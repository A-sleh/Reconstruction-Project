import { assets } from "@/assets/assets";


const Hero = () => {

  const images = [
    { src: assets.homePage_hero_building, alt: "building" },
    { src: assets.homePage_hero_engineer, alt: "engineer" },
    { src: assets.homePage_hero_resource, alt: "resource" },
    { src: assets.homePage_hero_service, alt: "service" },
  ];

  return (
    <section className="relative">
      <div className="overflow-hidden">
        <div className="flex w-full h-[60vh] mx-auto animate-infinit-loop">
          {/* Render images twice for seamless infinite scroll */}
          {images.map((image, index) => (
            <img
              key={index}
              src={image.src}
              className="flex-1 object-fill min-w-full"
              alt={image.alt}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
