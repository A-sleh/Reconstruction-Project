import { assets } from "@/assets/assets";
import Button from "@/components/inputs/Button";
import i18n from "@/lib/i18n";
import { Link } from "react-router";

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
  return (
    <div className="group relative rounded-xl overflow-hidden border border-gray-300  bg-white transition-all duration-300 cursor-pointer h-fit">
      <div className="relative w-full h-72 overflow-hidden bg-linear-to-br from-gray-100 to-gray-200 ">
        <img
          //@ts-ignore
          src={assets[imageIndex]}
          alt={title}
          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110 group-hover:brightness-50"
        />
        <p className="absolute top-2 left-2 p-2 rounded-lg text-white z-10 bg-white/10">{category}</p>
        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>

      {/* Content Container */}
      <div className="m-4 mx-2 p-2 rounded-lg flex flex-col group-hover:bg-gray-300/20 transition">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-gray-800 transition-colors duration-300">
          {title}
        </h3>

        {/* Description - fades in and expands */}
        <div className="grow">
          <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-500 group-hover:max-h-48 group-hover:opacity-100">
            <p className="text-gray-600 text-sm leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Button - fades in and slides up */}
        <Link to={link} className="grow max-h-0 overflow-hidden opacity-0 transition-all duration-500 group-hover:max-h-48 group-hover:opacity-100">
          <Button variant="outline" className="my-5">
            {i18n.language == 'ar' ? "انضم إلينا" : "Join us"}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default JoinUsCard;
