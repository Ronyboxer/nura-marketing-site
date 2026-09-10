import { NextResponse } from "next/server";

import { answer } from "@/lib/nura/answer.ts";
import { matchMemory } from "@/lib/nura/match.ts";

// A thin wrapper over answer(). All of the behaviour that matters lives in
// lib/nura; this file only validates, throttles, caches and returns.

export const runtime = "nodejs";

const MIN_LENGTH = 4;
const MAX_LENGTH = 200;

const PER_MINUTE = 10;
const PER_HOUR = 50;
const MINUTE = 60_000;
const HOUR = 60 * MINUTE;

const CACHE_TTL = HOUR;

type Hits = { minute: number[]; hour: number[] };
type CacheEntry = { body: Body; expires: number };
type Body = { answer: string; sourceMemory: string | null; fellBack: boolean };

// In-memory and therefore per-instance. That is the right size of solution for
// a marketing demo: it costs nothing, and the worst case is a visitor on a
// second instance getting a second allowance.
const hitsByIp = new Map<string, Hits>();
const cache = new Map<string, CacheEntry>();

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function withinRateLimit(ip: string): boolean {
  const now = Date.now();
  const hits = hitsByIp.get(ip) ?? { minute: [], hour: [] };

  hits.minute = hits.minute.filter((at) => now - at < MINUTE);
  hits.hour = hits.hour.filter((at) => now - at < HOUR);

  if (hits.minute.length >= PER_MINUTE || hits.hour.length >= PER_HOUR) {
    hitsByIp.set(ip, hits);
    return false;
  }

  hits.minute.push(now);
  hits.hour.push(now);
  hitsByIp.set(ip, hits);

  // Drop anyone who has gone quiet, so the map cannot grow without bound.
  if (hitsByIp.size > 5000) {
    for (const [key, value] of hitsByIp) {
      if (value.hour.length === 0) hitsByIp.delete(key);
    }
  }

  return true;
}

/** Most visitors type the same handful of things, so most answers are free. */
function cacheKey(question: string): string {
  return question.toLowerCase().replace(/\s+/g, " ").trim();
}

function readCache(key: string): Body | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (entry.expires < Date.now()) {
    cache.delete(key);
    return null;
  }
  return entry.body;
}

function writeCache(key: string, body: Body) {
  if (cache.size > 500) cache.clear();
  cache.set(key, { body, expires: Date.now() + CACHE_TTL });
}

export async function POST(request: Request) {
  let question: unknown;
  try {
    ({ question } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (typeof question !== "string") {
    return NextResponse.json(
      { error: "Please type a question." },
      { status: 400 },
    );
  }

  const trimmed = question.trim();
  if (trimmed.length < MIN_LENGTH || trimmed.length > MAX_LENGTH) {
    return NextResponse.json(
      {
        error: `Please ask something between ${MIN_LENGTH} and ${MAX_LENGTH} characters.`,
      },
      { status: 400 },
    );
  }

  if (!withinRateLimit(clientIp(request))) {
    return NextResponse.json(
      { error: "That's a lot of questions. Please try again in a minute." },
      { status: 429 },
    );
  }

  const key = cacheKey(trimmed);
  const cached = readCache(key);
  if (cached) return NextResponse.json(cached);

  let body: Body;
  try {
    const result = await answer(trimmed);
    body = {
      answer: result.answer,
      sourceMemory: result.sourceMemory,
      fellBack: result.fellBack,
    };
  } catch (error) {
    // answer() already degrades to the memory verbatim when the model is
    // unavailable, so reaching here is unexpected. Fall back to the matcher on
    // its own rather than show a visitor a broken demo.
    console.error("Answering failed:", error);
    const match = matchMemory(trimmed);
    const fallback = await answer(trimmed, {
      phrase: async (memory) => memory.text,
    });
    body = {
      answer: fallback.answer,
      sourceMemory: match ? match.memory.text : null,
      fellBack: fallback.fellBack,
    };
  }

  writeCache(key, body);
  return NextResponse.json(body);
}
