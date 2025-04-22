import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { isAddress } from "viem";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return "";

  // Check if it's a valid Ethereum address
  const isValidAddress = isAddress(address);
  if (!isValidAddress) return address;

  // Return first and last `chars` characters
  return `${address.substring(0, chars + 2)}...${address.substring(
    address.length - chars
  )}`;
}
