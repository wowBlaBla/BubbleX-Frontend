import { combineReducers } from 'redux';

import alert from './alert';
import auth from './auth';
import profile from './profile';
import post from './post';
import projectSetting from './projectSetting';
import { walletReducer } from './walletReducers';

export default combineReducers({
  auth,
  projectSetting,
  wallet: walletReducer
});
