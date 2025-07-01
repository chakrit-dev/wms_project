import { clsx } from "clsx"
import { twMerge } from "tailwind-merge" //  ใช้อันนี้แทน tailwind-variants

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
