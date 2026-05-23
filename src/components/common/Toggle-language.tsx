import { useEffect, useState, useRef } from "react";
import i18n from "@/lib/i18n";
import { assets } from "@/assets/assets";

const languages = [
  { code: "ar", label: "العربية", icon: assets.SYIcon },
  { code: "en", label: "EN", icon: assets.USAIcon },
];

const ToggleLanguage = () => {
  const [language, setLanguage] = useState<string>(i18n.language || "en");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("language");
    const initial = stored || i18n.language || "en";
    setLanguage(initial);
    document.documentElement.lang = initial;
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  const selectLanguage = (code: string) => {
    setLanguage(code);
    i18n.changeLanguage(code);
    localStorage.setItem("language", code);
    document.documentElement.lang = code;
    setOpen(false);
  };

  const current = languages.find((l) => l.code === language) || languages[1];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="inline-flex items-center gap-2 rounded-xl  px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 cursor-pointer"
        aria-expanded={open}
      >
        <img
          src={current.icon}
          alt={current.code}
          className="h-5 w-5 rounded-sm"
        />
        <span className="hidden sm:inline">{current.label}</span>
      </button>

      {open && (
        <ul
          className={`absolute right-0 z-50 mt-2 w-36 rounded-lg border border-slate-200 bg-white py-1 shadow-lg ${
            i18n.language === "ar" ? "right-0 left-auto" : "left-0 right-auto"
          }`}
        >
          {languages.map((lang) => (
            <li
              key={lang.code}
              className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50"
              onClick={() => selectLanguage(lang.code)}
            >
              <img
                src={lang.icon}
                alt={lang.code}
                className="h-4 w-4 rounded-sm"
              />
              <span className="flex-1">{lang.label}</span>
              {language === lang.code && (
                <span className="text-xs text-slate-400">✓</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ToggleLanguage;
