import { assets } from "@/assets/assets";

type IAuthLayout = {
  children: React.ReactNode;
  title?: string;
  subTitle?: string;
};

export const AuthLayout: React.FC<IAuthLayout> = ({
  children,
  title,
  subTitle,
}) => {
  return (
    <div className="flex min-h-screen md:p-0 bg-primary">
      <div className="flex overflow-hidden flex-1 md:max-h-screen">
        {/* Left: Decorative */}
        <div className="hidden lg:flex p-5 items-center rounded-l-2xl max-h-screen ">
          <img
            src={assets["authImage6"]}
            alt=""
            className="lg:w-full h-full rounded-xl"
          />
        </div>

        {/* Right: Form */}
        <div className="flex flex-col justify-center items-center p-4 pt-0 md:p-8 w-full md:w-auto  bg-white flex-1 border-y-20 lg:border-none  border-primary overflow-auto">
          {title && subTitle && (
            <div className="self-start px-4 md:px-8 md:mt-8">
              {title && <h1 className="text-3xl font-bold ">{title}</h1>}
              {subTitle && (
                <p className="mt-2 text-sm text-gray-500">{subTitle}</p>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};
