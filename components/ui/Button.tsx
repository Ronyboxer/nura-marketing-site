import type { ComponentPropsWithoutRef } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "default" | "large";

const BASE =
  "t-body-s inline-flex items-center justify-center gap-2 rounded-md px-5 font-medium transition-colors duration-150 ease-nura disabled:cursor-not-allowed disabled:opacity-60";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-green text-surface hover:bg-green-700",
  secondary:
    "border border-line-strong bg-surface text-ink hover:border-ink-3 hover:bg-sunken",
  ghost: "text-green hover:bg-green-50",
};

const SIZES: Record<Size, string> = {
  default: "h-11",
  large: "h-[52px]",
};

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  variant = "primary",
  size = "default",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    />
  );
}

type LinkButtonProps = ComponentPropsWithoutRef<"a"> & {
  variant?: Variant;
  size?: Size;
};

export function LinkButton({
  variant = "primary",
  size = "default",
  className = "",
  ...props
}: LinkButtonProps) {
  return (
    <a
      className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    />
  );
}
