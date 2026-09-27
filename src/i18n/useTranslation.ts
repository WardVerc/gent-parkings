import { useMemo } from "react";
import { detectLocale, translate, type TranslationKey } from "./translations";

export type TranslateFn = (
  key: TranslationKey,
  params?: Record<string, string | number>,
) => string;

export function useTranslation(): TranslateFn {
  const locale = useMemo(() => detectLocale(), []);
  return (key, params) => translate(locale, key, params);
}
