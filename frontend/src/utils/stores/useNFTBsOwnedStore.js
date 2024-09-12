import { create } from 'zustand';

const useNFTBsOwnedStore = create((set) => ({
  NFTBsOwned: [],
  setNFTBsOwned: (NFTBsOwned) => set({ NFTBsOwned }),
}));

export default useNFTBsOwnedStore;