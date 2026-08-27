import {
  cloneElement,
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

const ModelContext = createContext<any>(null);

function Open({
  children,
  opens: openWindowName,
}: {
  children: ReactNode;
  opens: string;
}) {
  const { open } = useContext(ModelContext);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return cloneElement(children, { onClick: () => open(openWindowName) });
}

function Close({ children }: { children: React.ReactNode }) {
  const { close } = useContext(ModelContext);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return cloneElement(children, { onClick: () => close() });
}

function Window({
  children,
  name,
  model_width = "md:min-w-[40vw] md:max-w-[50vw]",
}: {
  children: ReactNode;
  name: string;
  model_width?: string;
}) {
  const { openName } = useContext(ModelContext);

  if (name !== openName) return null;

  return createPortal(
    <div
      className="flex justify-center items-center fixed inset-0 bg-[rgba(0,0,0,.4)] z-100"
      data-model-window={name}
    >
      <div className={`w-[90vw]  p-4 rounded-lg bg-white ${model_width}`}>
        {children}
      </div>
    </div>,
    document.body,
  );
}

const Model = ({ children }: { children: ReactNode }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language == "ar";
  const [openName, setOpenName] = useState<string>("");
  const close = () => setOpenName("");
  const open = setOpenName;

  const value = {
    close,
    open,
    openName,
  };

  return (
    <ModelContext.Provider value={value}>
      <div dir={isArabic ? "rtl" : "ltr"}>
        {children}
      </div>
    </ModelContext.Provider>
  );
};

Model.Open = Open;
Model.Close = Close;
Model.Window = Window;

export default Model;
