import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { initState } from './init-state';
import { initListener } from './init-listener';

const useGlobalStore = create<StateType>()(
  persist(
    (set) => ({
      ...initState(),
      setGlobalStore: set,
    }),
    {
      name: 'state',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

initListener(useGlobalStore.setState);
export default useGlobalStore;
