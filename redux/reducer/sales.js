import ActionType from "redux/type";

const inittialState = {
  editDataSales:[]
};

const salesReducer = (state = inittialState, action) => {
  switch (action.type) {
    case ActionType.SET_EDIT_DATA_SALES:
      return {
        ...state,
        editDataSales: action.value,
      };

    default:
      return {
        ...state,
      };
  }
};

export default salesReducer;