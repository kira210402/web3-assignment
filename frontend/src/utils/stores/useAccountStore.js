import { create } from 'zustand';

const useAccountStore = create((set) => ({
  account: null,
  setAccount: (account) => set({ account }),
}));

export default useAccountStore;