import { createWrapper, Context } from 'next-redux-wrapper';
import { Store, createStore } from 'redux';
import RootState from './rootState';
import RootReducer from './rootReducer';

const makeStore = (context: Context) => {
  return createStore(RootReducer);
};

export const wrapper = createWrapper<Store<RootState>>(makeStore);
