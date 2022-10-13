import ActionType from "../type";
const inittialState = {
  selectItemLocation: [],
  selectItemMixBundle: [],
  selectItemBundle: [{}],
  historyByLocation: [],
  detailHistoryByLocation: [],
  locationByItem: [],
  showItems: false,
  detailItem: {},
  fromLocIdx: {},
  formDateStockMissing: {},
  qty: 0,
};

const itemReducer = (state = inittialState, action) => {
  switch (action.type) {
    case ActionType.SET_SELECT_ITEM_BUNDLE:
      return {
        ...state,
        selectItemBundle: action.value,
      };
    case ActionType.SET_SELECT_ITEM_MIX_BUNDLE:
      return {
        ...state,
        selectItemMixBundle: action.value,
      };
    case ActionType.SET_ITEM_BY_LOCATION:
      return {
        ...state,
        selectItemLocation: action.value,
      };
    case ActionType.SET_DETAIL_ITEM:
      return {
        ...state,
        detailItem: action.value,
      };
    case ActionType.SET_LOCATION_BY_ITEM:
      return {
        ...state,
        locationByItem: action.value,
      };
    case ActionType.SET_HISTORY_BY_LOCATION:
      return {
        ...state,
        historyByLocation: action.value,
      };
    case ActionType.SET_SHOW_ITEMS:
      return {
        ...state,
        showItems: action.value,
      };
    case ActionType.SET_DETAIL_HISTORY:
      return {
        ...state,
        detailHistoryByLocation: action.value,
      };
    case ActionType.SET_FROM_LOCIDX:
      return {
        ...state,
        fromLocIdx: action.value,
      };
    case ActionType.SET_USEFORM_DATE_STOCK_MISSING:
      return {
        ...state,
        formDateStockMissing: action.value,
      };
    default:
      return { ...state };
  }
};

export default itemReducer;
