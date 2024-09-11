import { create } from 'zustand';

const useMintedBalanceStore = create((set) => ({
  mintedBalance: 0,
  setMintedBalance: (mintedBalance) => set({ mintedBalance }),
}));

export default useMintedBalanceStore;