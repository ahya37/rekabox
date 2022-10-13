const initialState = {
  listHistories: [],
  dataReport: [],
  useFormLisHistory: {},
  detailHistory: null,
};

const HistoryReducer = (state = initialState, action) => {
  if (action.type === "SET_USEFORM_LIST_HISTORIES") {
    return {
      ...state,
      useFormLisHistory: action.value,
    };
  }
  if (action.type === "SET_LIST_HISTORIES") {
    return {
      ...state,
      listHistories: action.value,
    };
  }
  if (action.type === "SET_DETAIL_HISTORY") {
    return {
      ...state,
      detailHistory: action.value,
    };
  }
  if (action.type === "SET_DATA_REPORT") {
    return {
      ...state,
      dataReport: action.value,
    };
  }
  return state;
};

export default HistoryReducer;
