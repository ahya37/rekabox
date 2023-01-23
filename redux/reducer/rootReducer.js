import { combineReducers } from "redux";
import itemReducer from "./item";
import HistoryReducer from "./hostory";
import MenuReducer from "./menu";
import UserProfileReducer from "./user";
import purchaseReducer from './purchase'
import salesReducer from "./sales";
import accountReducer from "./account";
import locationReducer from "./location";

const rootReducer = combineReducers({
  salesReducer: salesReducer,
  itemReducer: itemReducer,
  HistoryReducer: HistoryReducer,
  MenuReducer: MenuReducer,
  UserProfileReducer: UserProfileReducer,
  purchaseReducer: purchaseReducer,
  accountReducer: accountReducer,
  locationReducer: locationReducer,
});

export default rootReducer;
