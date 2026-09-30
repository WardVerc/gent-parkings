import en from "./en.json";
import nl from "./nl.json";

export type TranslationKey = keyof typeof en;

const dictionaries = { en, nl };

type Locale = keyof typeof dictionaries;

export function detectLocale(): Locale {
  return navigator.language.toLowerCase().startsWith("nl") ? "nl" : "en";
}

export function translate(
  locale: Locale,
  key: TranslationKey,
  params?: Record<string, string | number>,
): string {
  const template = dictionaries[locale][key] ?? dictionaries.en[key];
  if (!params) return template;

  return Object.entries(params).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    template,
  );
}
