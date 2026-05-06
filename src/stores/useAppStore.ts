import { create } from "zustand";
import { initialResources, initialSites, Resource, WorkSite } from "@/data/resource-providor/mockData";

interface AppState {
  sites: WorkSite[];
  resources: Resource[];
  addSite: (s: Omit<WorkSite, "id">) => void;
  updateSite: (id: string, s: Omit<WorkSite, "id">) => void;
  deleteSite: (id: string) => void;
  addResource: (r: Omit<Resource, "id">) => void;
  updateResource: (id: string, r: Omit<Resource, "id">) => void;
  deleteResource: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sites: initialSites,
  resources: initialResources,
  addSite: (s) =>
    set((st) => ({ sites: [{ ...s, id: crypto.randomUUID() }, ...st.sites] })),
  updateSite: (id, s) =>
    set((st) => ({ sites: st.sites.map((x) => (x.id === id ? { ...s, id } : x)) })),
  deleteSite: (id) =>
    set((st) => ({
      sites: st.sites.filter((x) => x.id !== id),
      resources: st.resources.filter((r) => r.siteId !== id),
    })),
  addResource: (r) =>
    set((st) => ({ resources: [...st.resources, { ...r, id: crypto.randomUUID() }] })),
  updateResource: (id, r) =>
    set((st) => ({ resources: st.resources.map((x) => (x.id === id ? { ...r, id } : x)) })),
  deleteResource: (id) =>
    set((st) => ({ resources: st.resources.filter((x) => x.id !== id) })),
}));
