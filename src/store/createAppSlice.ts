import { StateSlice } from '@/types/store';
import { AppStateDefinition, AppStateActions } from '@/types/App';

const createAppSlice: StateSlice<AppStateDefinition & AppStateActions> = (
  set
) => ({
  isSidebarOpen: true,
  toggleIsSidebarOpen: (open: boolean) => {
    set((state) => {
      state.app.isSidebarOpen = open;
    });
  },
});

export default createAppSlice;
