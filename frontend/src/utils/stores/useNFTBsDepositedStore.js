import { create } from 'zustand';

const useNFTBsDepositedStore = create((set) => ({
  NFTBsDeposited: [],
  setNFTBsDeposited: (NFTBsDeposited) => set({ NFTBsDeposited }),
}));

export default useNFTBsDepositedStore;