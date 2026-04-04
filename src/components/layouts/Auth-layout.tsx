import { assets } from "@/assets/assets";
import { useEffect, useState } from "react";

type IAuthLayout = {
  children: React.ReactNode;
};

type imageOptionPaths =
  | "authImage1"
  | "authImage2"
  | "authImage3"
  | "authImage4"
  | "authImage5";

export const AuthLayout: React.FC<IAuthLayout> = ({ children }) => {
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
    <div className="flex min-h-screen items-center justify-center p-4 bg-secondary-hover-two">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl bg-card shadow-xl  p-8 bg-white ">
        {/* Left: Decorative */}
        <div className="hidden w-1/2 md:block h-112.5 ">
          <div className="relative flex h-full items-center justify-center p-8 rounded-lg overflow-hidden ">
            <img
              key={currentImage}
              src={assets[currentImage]}
              alt=""
              className="absolute inset-0 w-full h-full object-cover animate-fade-in "
            />
          </div>
        </div>

        {/* Right: Form */}
        <div className="p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
};
