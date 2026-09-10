export const nav = {
  wordmark: "Nura",
  links: [
    { label: "Try it", href: "#try-it" },
    { label: "How it works", href: "#how-it-works" },
    { label: "FAQ", href: "#faq" },
  ],
  cta: "Join the waitlist",
};

export const hero = {
  eyebrow: "For families living with dementia and memory loss",
  headline: "The same kind answer, every time they ask.",
  subhead:
    "Nura is a gentle voice companion for people living with dementia and Alzheimer's. Your family writes the answers. Nura shares them warmly, patiently, and only ever the truth you've given it.",
};

export const demo = {
  memoriesLabel: "What Margaret's family wrote",
  memoriesToggle: {
    show: "Show what Margaret's family wrote",
    hide: "Hide what Margaret's family wrote",
  },
  inputLabel: "Ask Nura a question",
  placeholder: "Ask Nura something…",
  submit: "Ask Nura",
  thinking: "One moment…",
  chipsLabel: "Or try one of these",
  chips: [
    { question: "What's my granddaughter's name?" },
    { question: "Where do I live now?" },
    { question: "Who makes my tea?" },
    { question: "What's my sister's name?", marker: "try one it can't answer" },
  ],
  sourceLabel: "From your family's words",
  fallbackNote: "No memory matched. Nura didn't guess.",
  note: "This is a real demo. Nura can only answer from the memories above.",
};

export const refusal = {
  heading: "Nura never makes things up.",
  body: "Most AI guesses when it doesn't know. For someone living with memory loss, a confident wrong answer can be frightening. Nura is built the opposite way. The decision to answer or to stay quiet happens before the AI is involved, and the AI only ever sees what your family wrote. There is no path by which Nura can tell them something you didn't say.",
  callout: "Your words in. Your words out. Nothing made up.",
};

export const howItWorks = {
  heading: "How Nura works",
  steps: [
    {
      icon: "NotebookPen" as const,
      title: "Your family fills it in",
      body: "On the caregiver side, you add the people, places, and moments that matter, in your own words.",
    },
    {
      icon: "Mic" as const,
      title: "They simply ask",
      body: "Your loved one taps once and speaks. No menus, no learning, nothing to get wrong.",
    },
    {
      icon: "Heart" as const,
      title: "They hear the truth, warmly",
      body: "Nura finds the answer you wrote and says it kindly, the fortieth time as gently as the first.",
    },
  ],
};

export const whoItsFor = {
  heading: "Made for memory loss, and the families who carry it.",
  body: "Nura supports older adults living with dementia, Alzheimer's, and other forms of cognitive decline, and the spouses, children, and grandchildren caring for them. It works alongside you, never instead of you.",
};

export const faq = {
  heading: "Questions families ask",
  items: [
    {
      question: "Does Nura replace a caregiver?",
      answer:
        "No. Nura lightens the load of constant repetition so you can be present for the moments that matter. It works alongside you, never instead of you.",
    },
    {
      question: "Does it make things up like other AI?",
      answer:
        "Never. Nura only shares the answers your family has written. If it doesn't have one, it says so gently.",
    },
    {
      question: "Is our information private?",
      answer:
        "Yes. Your family's memories belong to your family. They're kept secure and are never sold.",
    },
    {
      question: "What if my parent says something that isn't true?",
      answer:
        "Nura won't correct or argue. It responds with the gentle, reassuring answer your family chose in advance.",
    },
    {
      question: "Is this a medical device?",
      answer:
        "No. Nura is a comfort and memory-support companion, not a medical or diagnostic tool.",
    },
  ],
};

export const waitlist = {
  heading: "Be there for the moment, not the question.",
  subhead:
    "Join the waitlist and we'll let you know the moment Nura is ready for your family.",
  placeholder: "your@email.com",
  label: "Email address",
  button: "Join the waitlist",
  success: "Thank you, we'll be in touch soon.",
};

export const footer = {
  line: "Nura — the same kind answer, every time.",
  links: nav.links,
  smallPrint: `Nura is not a medical device and does not provide medical advice. © ${new Date().getFullYear()} Nura.`,
};
