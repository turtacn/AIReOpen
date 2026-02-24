import { useTranslation } from 'react-i18next';

export function LanguageToggle() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm transition-colors"
    >
      {i18n.language === 'en' ? '中文' : 'English'}
    </button>
  );
}
