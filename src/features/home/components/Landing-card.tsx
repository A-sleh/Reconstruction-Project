import Button from "@/components/inputs/Button";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

export interface ILandingCard {
  picture: string;
  name: string;
  avatar: string;
  address: string;
  description: string;
  capacity: number;
}

const Image = ({
  picture,
  className,
}: Pick<ILandingCard, "picture"> & { className?: string }) => (
  <img
    src={picture}
    alt={`landing-${picture}`}
    className={` rounded-md w-full object-cover ${className} group-hover:opacity-90 transition-opacity`}
  />
);

const UserInfo = ({
  name,
  avatar,
  className,
}: Pick<ILandingCard, "name" | "avatar"> & { className?: string }) => {
  const { t } = useTranslation();
  return (
    <div
      className={`flex gap-2 items-start ${className} z-20 relative right-6 overflow-hidden`}
    >
      <img
        src={avatar}
        alt={`user-${name}`}
        className="w-11 h-11 rounded-full object-cover "
      />
      <div>
        <span className="text-gray-600 text-[12px]">{t("home.investor")}</span>
        <h6 className="text-[13px]">{name}</h6>
      </div>
    </div>
  );
};

const ContentInfo = ({
  address,
  description,
  capacity,
  className,
}: Pick<ILandingCard, "address" | "description" | "capacity"> & {
  className?: string;
}) => {
  const { t } = useTranslation();
  return (
    <div
      className={`bg-white my-2 p-4 rounded-md flex flex-col ${className} z-50 overflow-hidden`}
    >
      <h2 className="font-semibold text-sm">{address}</h2>
      <p className="text-gray-500 my-2 text-[14px]">{description}</p>
      <span className="mb-2 text-sm font-bold">{capacity}</span>
      <Button className="rounded-sm my-2 mt-auto ">
        {t("home.seeDetails")}
      </Button>
    </div>
  );
};

const LandingCard = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative bg-gray-300/30 p-2 rounded-md group overflow-hidden ">
      <div className="absolute inset-0 z-2 bg-linear-to-b from-white to-60% to-transparent"></div>
      {children}
    </div>
  );
};

LandingCard.Image = Image;
LandingCard.UserInfo = UserInfo;
LandingCard.ContentInfo = ContentInfo;

export default LandingCard;
