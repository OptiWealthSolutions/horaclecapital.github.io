import { ui, defaultLang } from './ui';

export function getLangFromUrl(url: URL) {
  // Strip a trailing ".html" so the `/en` root (built as `en.html` with
  // build.format:'file') still resolves to the "en" locale.
  const seg = (url.pathname.split('/')[1] || '').replace(/\.html$/, '');
  if (seg in ui) return seg as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  }
}
