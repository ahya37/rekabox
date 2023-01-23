export const ClearRedux = () => (dispatch) => {
  dispatch({ type: "SET_ITEM_BY_LOCATION", value: [] });
  dispatch({ type: "SET_DETAIL_ITEM", value: {} });
};
