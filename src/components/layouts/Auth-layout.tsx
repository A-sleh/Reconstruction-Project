import { assets } from "@/assets/assets";
import { useEffect, useState, useTransition } from "react";

type IAuthLayout = {
  children: React.ReactNode;
  title: string;
  subTitle: string;
};

type imageOptionPaths =
  | "authImage1"
  | "authImage2"
  | "authImage3"
  | "authImage4"
  | "authImage5";

export const AuthLayout: React.FC<IAuthLayout> = ({
  children,
  title,
  subTitle,
}) => {
  const { locale } = useTransition();
  const [currentImage, setCurrentImage] =
    useState<imageOptionPaths>("authImage1");

  useEffect(() => {
    const changeImageInterval = setInterval(() => {
      const preImageNumber = Number(currentImage.split("").pop());

      if (preImageNumber == 5) {
        setCurrentImage(`authImage1`);
      } else {
        setCurrentImage(`authImage${preImageNumber + 1}` as imageOptionPaths);
      }
    }, 2500);

    return () => {
      clearInterval(changeImageInterval);
    };
  }, [currentImage]);

  return (
    <div className="flex min-h-screen items-center justify-center p-2 md:p-0 bg-secondary-hover-two">
      <div className="flex w-full overflow-hidden rounded-2xl md:rounded-none shadow-xl bg-white justify-center items-center">
        {/* Left: Decorative */}
        <div className="hidden w-120.5 md:block h-112.5">
          <div className="relative flex h-full items-center justify-center p-8 rounded-lg overflow-hidden ">
            <div
              className={`absolute top-3 ${locale !== "ar" ? "right-8" : "left-8"} z-5`}
            >
              <h1 className="text-3xl font-bold text-white">{title}</h1>
              <p className="mt-2 text-sm text-white/80">{subTitle}</p>
            </div>
            <div className="absolute h-40 right-0 top-0 left-0 bg-linear-to-b from-primary to-transparent z-2"></div>
            <div className="absolute bottom-0 right-0 top-0 left-0 bg-black opacity-30 z-1"></div>
            <img
              key={currentImage}
              src={assets[currentImage]}
              alt=""
              className="absolute inset-0 w-full h-full object-cover animate-fade-in "
            />
          </div>
        </div>

        {/* Right: Form */}
        <div className="p-4 md:p-8 w-full md:w-auto">{children}</div>
      </div>
    </div>
  );
};
