import { create } from 'zustand';

interface UIStore {
  openCategories: Record<string, boolean>;
  toggleCategory: (id: string, defaultOpen: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  openCategories: {},
  toggleCategory: (id, defaultOpen) => set((state) => {
    const current = state.openCategories[id] ?? defaultOpen;
    return {
      openCategories: {
        ...state.openCategories,
        [id]: !current
      }
    };
  })
}));
