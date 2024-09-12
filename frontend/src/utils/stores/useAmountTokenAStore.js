import { create } from 'zustand';

const useAmountTokenAStore = create((set) => ({
  amountTokenA: 0,
  setAmountTokenA: (amountTokenA) => set({ amountTokenA }),
}));

export default useAmountTokenAStore;