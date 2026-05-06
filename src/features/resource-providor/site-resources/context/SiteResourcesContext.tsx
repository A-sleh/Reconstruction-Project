import { Resource } from "@/data/resource-providor/mockData";
import { createContext, useContext } from "react";

interface IResourceValue {
  openEdit: (r: Resource) => void;
  handleDelete: (r: Resource) => void;
  resources: Resource[];
}

const SiteResourceContext = createContext<IResourceValue>({} as IResourceValue);

export default function SiteResourceProvidor({
  value,
  children,
}: {
  value: IResourceValue;
  children: React.ReactNode;
}) {
  return (
    <SiteResourceContext.Provider value={value}>
      {children}
    </SiteResourceContext.Provider>
  );
}

export const useSiteResources = () => {
  const context = useContext(SiteResourceContext);

  if (!context) {
    throw new Error("You should use site Resource inside the context providor");
  }

  return context;
};
