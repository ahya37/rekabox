import { combineReducers } from "redux";
import itemReducer from "./item";
import HistoryReducer from "./hostory";
import MenuReducer from "./menu";
import UserProfileReducer from "./user";
import purchaseReducer from './purchase'
import salesReducer from "./sales";

const rootReducer = combineReducers({
  salesReducer: salesReducer,
  itemReducer: itemReducer,
  HistoryReducer: HistoryReducer,
  MenuReducer: MenuReducer,
  UserProfileReducer: UserProfileReducer,
  purchaseReducer: purchaseReducer
});

export default rootReducer;
