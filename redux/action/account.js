import ActionType from "redux/type";

export const setSelectedAccount = (value) => ({
    type: ActionType.SET_SELECT_ACCOUNT,
    value,
});

export const setShowFormAccount = (value) => ({
    type: ActionType.SET_SHOW_FORM_ACCOUNT,
    value,
});

export const setListAccount = (value) => ({
    type: ActionType.SET_LIST_ACCOUNT,
    value,
})