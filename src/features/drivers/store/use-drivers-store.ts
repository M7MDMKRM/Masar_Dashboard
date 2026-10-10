import { create } from "zustand";

interface DriversStoreState {
  accountStatusFilter: string;
  registrationDateFilter: string;
  searchQuery: string;
  currentPage: number;
  setAccountStatusFilter: (filter: string) => void;
  setRegistrationDateFilter: (filter: string) => void;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
}

export const useDriversStore = create<DriversStoreState>((set) => ({
  accountStatusFilter: "all",
  registrationDateFilter: "all",
  searchQuery: "",
  currentPage: 1,
  setAccountStatusFilter: (filter) => set({ accountStatusFilter: filter, currentPage: 1 }),
  setRegistrationDateFilter: (filter) => set({ registrationDateFilter: filter, currentPage: 1 }),
  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),
}));
