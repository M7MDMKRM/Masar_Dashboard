import { create } from "zustand";

interface DashboardStoreState {
  timeFilter: string;
  searchQuery: string;
  setTimeFilter: (filter: string) => void;
  setSearchQuery: (query: string) => void;
}

export const useDashboardStore = create<DashboardStoreState>((set) => ({
  timeFilter: "today",
  searchQuery: "",
  setTimeFilter: (filter) => set({ timeFilter: filter }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
