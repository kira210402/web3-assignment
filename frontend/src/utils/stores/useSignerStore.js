import { create } from 'zustand';

const useSignerStore = create((set) => ({
  signer: null,
  setSigner: (signer) => set({ signer }),
}));

export default useSignerStore;