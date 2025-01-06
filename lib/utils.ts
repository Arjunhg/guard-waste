import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
