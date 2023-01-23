import ActionType from "../type";

export const setSelectItemLocation = (value) => ({
  type: ActionType.SET_ITEM_BY_LOCATION,
  value,
});

export const setDetailItem = (value) => ({
  type: ActionType.SET_DETAIL_ITEM,
  value,
});

export const setLocationByItem = (value) => ({
  type: ActionType.SET_LOCATION_BY_ITEM,
  value,
});

export const setHistoryByLocation = (value) => ({
  type: ActionType.SET_HISTORY_BY_LOCATION,
  value,
});

export const setShowItems = (value) => ({
  type: ActionType.SET_SHOW_ITEMS,
  value,
});

export const setDetailHistoryByLocation = (value) => ({
  type: ActionType.SET_DETAIL_HISTORY,
  value,
});

export const setFromLocIdx = (value) => ({
  type: ActionType.SET_FROM_LOCIDX,
  value,
});

export const setFromDateStockMissing = (value) => ({
  type: ActionType.SET_USEFORM_DATE_STOCK_MISSING,
  value,
});

export const setSelectItemBundle = (value) => ({
  type: ActionType.SET_SELECT_ITEM_BUNDLE,
  value,
});

export const setSelectItemMixBundle = (value) => ({
  type: ActionType.SET_SELECT_ITEM_MIX_BUNDLE,
  value,
});

export const setListItems = (value) => ({
  type: ActionType.SET_LIST_ITEMS,
  value
});

export const setLoading = (value) => ({
  type: ActionType.SET_LOADING,
  value
})

export const setDataItems = (value) => ({
  type: ActionType.SET_DATA_ITEMS,
  value
})

export const setAuditItems = (value) => ({
  type: ActionType.SET_AUDIT_ITEM,
  value
})

