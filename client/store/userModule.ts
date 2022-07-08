import RootState from './rootState';
import { Action } from 'redux';

export type UserState = {
  address: string;
};

interface SetUserStateAction extends Action {
  type: 'SET_USER_STATE';
  state: UserState;
}

interface ResetUserStateAction extends Action {
  type: 'RESET_USER_STATE';
}

export type UserActions = SetUserStateAction | ResetUserStateAction;

const INITIAL_STATE: UserState = {
  address: '',
};

const userReducer = (state: UserState = INITIAL_STATE, action: UserActions): UserState => {
  switch (action.type) {
    case 'SET_USER_STATE':
      return { ...action.state };
    case 'RESET_USER_STATE':
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default userReducer;

export const userSelector = {
  address: (state: RootState) => (state?.user?.address ? state.user.address : ''),
};
