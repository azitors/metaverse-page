import { combineReducers } from 'redux';
import RootState from './rootState';
import user from './userModule';

export default combineReducers<RootState>({
  user,
});
