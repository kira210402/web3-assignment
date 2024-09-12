import { create } from 'zustand';

const useReloadDepositInfoStore = create((set) => ({
  isReloadDepositInfo: false,
  setIsReloadDepositInfo: (isReloadDepositInfo) => set({ isReloadDepositInfo }),
}));

export default useReloadDepositInfoStore;