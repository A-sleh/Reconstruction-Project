import { assets } from "@/assets/assets";

type IAuthLayout = {
  children: React.ReactNode;
};

export const AuthLayout: React.FC<IAuthLayout> = ({
  children,
}) => {
  return (
    <div className="flex min-h-screen md:p-0 bg-primary">
      <div className="flex overflow-hidden flex-1">
        {/* Left: Decorative */}
        <div className="hidden lg:flex p-5 items-center rounded-l-2xl ">
          <img
            src={assets["authImage6"]}
            alt=""
            className="lg:w-full h-full rounded-xl"
          />
        </div>

        {/* Right: Form */}
        <div className="flex justify-center items-center p-4 pt-0 md:p-8 w-full md:w-auto overflow-hidden bg-white flex-1 border-y-20 lg:border-none  border-primary">
          {children}
        </div>
      </div>
    </div>
  );
};
