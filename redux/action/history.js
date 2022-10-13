export const setListHistories = (value) => ({
  type: "SET_LIST_HISTORIES",
  value,
});

export const setDetailHistory = (value) => (dispatch) => ({
  type: "SET_DETAIL_HISTORY",
  value,
});

export const setUseFormListHistories = (value) => ({
  type: "SET_USEFORM_LIST_HISTORIES",
  value,
});

export const setDataReport = (value) => ({
  type: "SET_DATA_REPORT",
  value,
});
