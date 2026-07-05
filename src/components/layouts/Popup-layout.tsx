import { motion } from "framer-motion";
import { X } from "lucide-react";
import Model from "@/components/model/Model";
import { useRef } from "react";

interface Props {
  openKey: string;
  openButton?: React.ReactNode | null;
  title?: string;
  subTitle?: string;
  children?: ((closeModel: () => void) => React.ReactNode) | React.ReactNode;
}

export default function PopuupLayout({
  openKey,
  subTitle,
  title,
  openButton,
  children,
}: Props) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const withOutHeader = !title && !subTitle;

  // To close the modal from the child component, we can use this function to trigger the click event on the close button.
  const handleCloseModal = () => {
    closeBtnRef.current?.click();
  };

  return (
    <Model>
      <Model.Open opens={openKey}>{openButton}</Model.Open>
      <Model.Window name={openKey}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-2xl border border-gray-300 bg-white shadow-elegant"
          >
            <div className="flex items-center justify-between border-b border-gray-300 p-6">
              <div hidden={withOutHeader}>
                <h2 hidden={!title} className="text-xl font-semibold">
                  {title}
                </h2>
                <p
                  hidden={!subTitle}
                  className="text-sm text-muted-foreground mt-0.5"
                >
                  {subTitle}
                </p>
              </div>
              <Model.Close>
                <button
                  type="button"
                  className="rounded-full p-2 text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground"
                  ref={closeBtnRef}
                >
                  <X className="h-4 w-4" />
                </button>
              </Model.Close>
            </div>
            <div className="p-6">
              {typeof children == "function"
                ? children(handleCloseModal)
                : children}
            </div>
          </motion.div>
        </motion.div>
      </Model.Window>
    </Model>
  );
}
