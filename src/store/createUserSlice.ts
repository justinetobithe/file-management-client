import User from '@/types/User';
import { StateSlice } from '@/types/store';
import { UserStateDefinition, UserStateActions } from '@/types/User';

const createUserSlice: StateSlice<UserStateDefinition & UserStateActions> = (
  set
) => ({
  data: null,
  setUser: (user: User) =>
    set((state) => {
      state.user.data = user;
    }),
});

export default createUserSlice;
