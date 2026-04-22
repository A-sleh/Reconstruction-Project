export interface IInvestor {
  avatar: string;
  name: string;
  description: string;
}

const InvestorCard: React.FC<IInvestor> = ({ name, avatar, description }) => {
  return (
    <div className="relative rounded-md group overflow-hidden">
      <div className="absolute inset-0 z-1 bg-linear-to-b from-white to-50% to-transparent"></div>
      <h3 className="absolute font-bold top-2 right-2 z-2">{name}</h3>
      <img
        src={avatar}
        alt={`investor-${name}`}
        className="w-full h-50 rounded-md"
      />
      <p className="absolute left-0 right-0 bottom-0 p-3 bg-white text-gray-500 text-[13px] translate-y-full group-hover:translate-y-1 transition">
        {description}
      </p>
    </div>
  );
};

export default InvestorCard;
