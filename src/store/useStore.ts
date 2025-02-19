import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import createAppSlice from './createAppSlice';
import createUserSlice from './createUserSlice';
import { CombinedState } from '@/types/store';
import { immer } from 'zustand/middleware/immer';
import deepMerge from 'deepmerge';

const useStore = create<CombinedState>()(
  devtools(
    persist(
      immer((...api) => ({
        app: createAppSlice(...api),
        user: createUserSlice(...api),
      })),
      {
        name: 'nurturemoms-state',
        partialize: (state) => ({
          user: state.user,
        }),
        merge: (persistedState, currentState) =>
          deepMerge(currentState, persistedState as CombinedState),
      }
    )
  )
);

export default useStore;
