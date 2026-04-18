import { assets } from "@/assets/assets";
import Button from "@/components/inputs/Button";
import i18n from "@/lib/i18n";
import { Link } from "react-router";
import { useState } from "react";

interface JoinUsCardProps {
  title: string;
  imageIndex: string;
  description: string;
  link: string;
  category: string;
}

const JoinUsCard: React.FC<JoinUsCardProps> = ({
  title,
  category = 'engineer',
  imageIndex,
  description,
  link,
}) => {
  const [isActive, setIsActive] = useState(false);

  // For touch devices, use click/tap to toggle
  const handleTouchToggle = () => {
    setIsActive(!isActive);
  };

  return (
    <div 
      className="relative rounded-xl overflow-hidden border border-gray-300 bg-white transition-all duration-300 cursor-pointer h-fit group"
      onClick={handleTouchToggle}
      onMouseLeave={() => setIsActive(false)} // Reset on mouse leave for desktop
    >
      <div className="relative w-full h-72 overflow-hidden bg-linear-to-br from-gray-100 to-gray-200">
        <img
          //@ts-ignore
          src={assets[imageIndex]}
          alt={title}
          className={`w-full h-full object-cover transform transition-transform duration-700 ${
            isActive ? 'scale-110 brightness-50' : ''
          } md:group-hover:scale-110 md:group-hover:brightness-50`}
        />
        <p className="absolute top-2 left-2 p-2 rounded-lg text-white z-10 bg-white/10">{category}</p>
        {/* Overlay gradient */}
        <div className={`absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-700 ${
          isActive ? 'opacity-100' : 'opacity-0'
        } md:group-hover:opacity-100`} />
      </div>

      {/* Content Container */}
      <div className={`m-4 mx-2 p-2 rounded-lg flex flex-col transition ${
        isActive ? 'bg-gray-300/20' : ''
      } md:group-hover:bg-gray-300/20`}>
        {/* Title */}
        <h3 className={`text-lg font-bold text-gray-900 mb-3 line-clamp-2 transition-colors duration-300 ${
          isActive ? 'text-gray-800' : ''
        } md:group-hover:text-gray-800`}>
          {title}
        </h3>

        {/* Description - expands on touch/click */}
        <div className="grow">
          <div className={`overflow-hidden transition-all duration-500 ${
            isActive ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
          } md:group-hover:max-h-48 md:group-hover:opacity-100`}>
            <p className="text-gray-600 text-sm leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Button */}
        <Link to={link} className="grow">
          <div className={`overflow-hidden transition-all duration-500 ${
            isActive ? 'max-h-48 opacity-100 mt-5' : 'max-h-0 opacity-0'
          } md:group-hover:max-h-48 md:group-hover:opacity-100`}>
            <Button variant="outline" className="w-full">
              {i18n.language == 'ar' ? "انضم إلينا" : "Join us"}
            </Button>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default JoinUsCard;