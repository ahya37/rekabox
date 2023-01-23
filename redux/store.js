import { applyMiddleware, createStore, compose } from "redux";
import rootReducer from "./reducer/rootReducer";
import thunk from "redux-thunk";
import { createWrapper } from "next-redux-wrapper";

const middleware = [thunk];
const makeStore = () =>
  createStore(rootReducer, compose(applyMiddleware(...middleware)));

export const wrapper = createWrapper(makeStore);
