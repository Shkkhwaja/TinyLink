// utils/validateUrl.ts
export function isValidUrl(u: string) {
  try {
    const url = new URL(u);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function isValidCode(code: string) {
  return /^[A-Za-z0-9]{6,8}$/.test(code);
}
