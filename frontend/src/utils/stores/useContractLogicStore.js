import { create } from 'zustand';

const useContractLogicStore = create((set) => ({
  contractLogic: null,
  setContractLogic: (contractLogic) => set({ contractLogic }),
}));

export default useContractLogicStore;