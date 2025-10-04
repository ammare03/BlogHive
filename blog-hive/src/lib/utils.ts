import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Strip HTML tags from a string to get plain text
 * @param html - HTML string to strip
 * @returns Plain text without HTML tags
 */
export function stripHtml(html: string): string {
  if (typeof window === "undefined") {
    // Server-side: use a simple regex
    return html.replace(/<[^>]*>/g, "");
  }
  // Client-side: use DOM parser for better accuracy
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

/**
 * Get a preview/excerpt from HTML content
 * @param html - HTML string
 * @param length - Maximum length of preview (default: 150)
 * @returns Preview text with ellipsis if truncated
 */
export function getHtmlPreview(html: string, length: number = 150): string {
  const text = stripHtml(html);
  if (text.length <= length) {
    return text;
  }
  return text.substring(0, length) + "...";
}
