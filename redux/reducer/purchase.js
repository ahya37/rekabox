import ActionType from "redux/type";

const inittialState = {
  editPurchase: [],
  editDataPurchase:[]
};

const purchaseReducer = (state = inittialState, action) => {
  switch (action.type) {
    case ActionType.SET_EDIT_DATA_PURCHASE:
      return {
        ...state,
        editDataPurchase: action.value,
      };

    default:
      return {
        ...state,
      };
  }
};

export default purchaseReducer;
