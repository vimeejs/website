export const locales = ["en", "ja"] as const;
export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  en: "English",
  ja: "日本語",
};

/** Extract locale from a content collection entry ID */
export function getLocaleFromId(id: string): Locale {
  return id.startsWith("ja/") ? "ja" : "en";
}

/** Strip locale prefix from entry ID to get the route slug */
export function stripLocalePrefix(id: string): string {
  return id.replace(/^ja\//, "");
}

/** Build the full path for a doc entry given locale and slug */
export function getDocPath(locale: Locale, slug: string): string {
  return `/${locale}/${slug}/`;
}

/** Get the alternate locale path for language switching */
export function getAlternateLocalePath(
  currentPath: string,
  targetLocale: Locale,
): string {
  return currentPath.replace(/^\/(en|ja)\//, `/${targetLocale}/`);
}
