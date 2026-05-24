import { create } from "zustand";
import {
  initialCategories,
  initialOrderRequests,
  initialResources,
  initialSites,
  OrderRequest,
  Resource,
  WorkSite,
} from "@/data/resource-providor/mockData";

interface AppState {
  sites: WorkSite[];
  resources: Resource[];
  categories: string[];
  orderRequests: OrderRequest[];
  addSite: (s: Omit<WorkSite, "id">) => void;
  updateSite: (id: string, s: Omit<WorkSite, "id">) => void;
  deleteSite: (id: string) => void;
  addResource: (r: Omit<Resource, "id">) => void;
  updateResource: (id: string, r: Omit<Resource, "id">) => void;
  deleteResource: (id: string) => void;
  addOrderRequest: (o: Omit<OrderRequest, "id" | "status" | "requestedAt">) => void;
  approveOrderRequest: (id: string) => void;
  rejectOrderRequest: (id: string, reason: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sites: initialSites,
  resources: initialResources,
  categories: initialCategories,
  orderRequests: initialOrderRequests,
  addSite: (s) => set((st) => ({ sites: [{ ...s, id: crypto.randomUUID() }, ...st.sites] })),
  updateSite: (id, s) =>
    set((st) => ({ sites: st.sites.map((x) => (x.id === id ? { ...s, id } : x)) })),
  deleteSite: (id) =>
    set((st) => ({
      sites: st.sites.filter((x) => x.id !== id),
      resources: st.resources.filter((r) => r.siteId !== id),
      orderRequests: st.orderRequests.filter((o) => o.siteId !== id),
    })),
  addResource: (r) =>
    set((st) => ({ resources: [...st.resources, { ...r, id: crypto.randomUUID() }] })),
  updateResource: (id, r) =>
    set((st) => ({ resources: st.resources.map((x) => (x.id === id ? { ...r, id } : x)) })),
  deleteResource: (id) =>
    set((st) => ({ resources: st.resources.filter((x) => x.id !== id) })),
  addOrderRequest: (o) =>
    set((st) => ({
      orderRequests: [
        {
          ...o,
          id: crypto.randomUUID(),
          status: "pending",
          requestedAt: new Date().toISOString().slice(0, 10),
        },
        ...st.orderRequests,
      ],
    })),
  approveOrderRequest: (id) =>
    set((st) => {
      const o = st.orderRequests.find((x) => x.id === id);
      if (!o) return st;
      const newCategory = o.proposedCategory.trim();
      const categories = st.categories.includes(newCategory)
        ? st.categories
        : [...st.categories, newCategory];
      const newResource: Resource = {
        id: crypto.randomUUID(),
        siteId: o.siteId,
        name: o.name,
        description: o.description,
        image: o.image,
        unitType: o.unitType,
        pricePerUnit: o.pricePerUnit,
        category: newCategory,
        quantity: o.quantity,
        availability: o.quantity > 0 ? "in-stock" : "out-of-stock",
      };
      return {
        categories,
        resources: [...st.resources, newResource],
        orderRequests: st.orderRequests.map((x) =>
          x.id === id ? { ...x, status: "approved" } : x
        ),
      };
    }),
  rejectOrderRequest: (id, reason) =>
    set((st) => ({
      orderRequests: st.orderRequests.map((x) =>
        x.id === id ? { ...x, status: "rejected", rejectionReason: reason } : x
      ),
    })),
}));
