import LandingCard, { ILandingCard } from "./Landing-card";
import { assets } from "@/assets/assets";
import SectionHeader from "./SectionHeader";
import { useTranslation } from "react-i18next";

const landing: ILandingCard[] = [
  {
    picture: assets.landingPageImage_modernBuilding,
    address: "الفرقان دوار الصخره",
    capacity: 40000,
    description: "الارض تتمتع بموقع حغرافي مميز",
    avatar: assets.landingPageImage_jop_engineer,
    name: "عبدالفتاح عصله",
  },
  {
    picture: assets.homePage_hero_building,
    address: "الفرقان دوار الصخره",
    capacity: 40000,
    description: "الارض تتمتع بموقع حغرافي مميز",
    avatar: assets.landingPageImage_jop_engineer,
    name: "عبدالفتاح عصله",
  },
  {
    picture: assets.homePage_hero_resource,
    address: "الفرقان دوار الصخره",
    capacity: 40000,
    description: "الارض تتمتع بموقع حغرافي مميز",
    avatar: assets.landingPageImage_jop_engineer,
    name: "عبدالفتاح عصله",
  },
  {
    picture: assets.homePage_hero_service,
    address: "الفرقان دوار الصخره",
    capacity: 40000,
    description: "الارض تتمتع بموقع حغرافي مميز",
    avatar: assets.authImage5,
    name: "عبدالفتاح عصله",
  },
  {
    picture: assets.authImage3,
    address: "الفرقان دوار الصخره",
    capacity: 40000,
    description: "الارض تتمتع بموقع حغرافي مميز",
    avatar: assets.landingPageImage_jop_engineer,
    name: "عبدالفتاح عصله",
  },
  {
    picture: assets.landingPageImage_buildingSearching,
    address: "الفرقان دوار الصخره",
    capacity: 40000,
    description: "الارض تتمتع بموقع حغرافي مميز",
    avatar: assets.landingPageImage_jop_engineer,
    name: "عبدالفتاح عصله",
  },
  {
    picture: assets.authImage2,
    address: "الفرقان دوار الصخره",
    capacity: 40000,
    description: "الارض تتمتع بموقع حغرافي مميز",
    avatar: assets.landingPageImage_jop_engineer,
    name: "عبدالفتاح عصله",
  },
];

const LandingSection = () => {
  const { t } = useTranslation();
  return (
    <div className="shadow-[0_0_0_100px_white]">
      <SectionHeader
        link={window.location.pathname}
        title={t("home.commonLandingTitle")}
      />
      <div className="flex flex-col lg:flex-row gap-2">
        <LandingCard>
          <LandingCard.Image picture={landing[0].picture} className="h-80" />
          <span className="absolute top-6">
            <LandingCard.UserInfo
              name={landing[0].name}
              avatar={landing[0].avatar}
            />
          </span>
          <LandingCard.ContentInfo
            address={landing[0].address}
            description={landing[0].description}
            capacity={landing[0].capacity}
            className=""
          />
        </LandingCard>
        <div className="flex-1 grid gap-2">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            {landing.slice(1, 7).map((land, Idx) => {
              return (
                <LandingCard key={Idx}>
                  <span className="absolute top-6">
                    <LandingCard.UserInfo
                      name={land.name}
                      avatar={land.avatar}
                      className=""
                    />
                  </span>
                  <div className="flex w-full">
                    <LandingCard.Image
                      picture={land.picture}
                      className="flex-1 h-60 w-10"
                    />
                  </div>
                  <LandingCard.ContentInfo
                    address={land.address}
                    description={land.description}
                    capacity={land.capacity}
                    className="lg:absolute group-hover:translate-y-[0%] lg:translate-y-[120%] bottom-0 left-0 right-0 lg:mx-2 lg:group-hover:shadow-[0_0_10000px_black] transition"
                  />
                </LandingCard>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingSection;
