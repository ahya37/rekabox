import ActionType from "redux/type";

export const setSelectedAccount = (value) => ({
    type: ActionType.SET_SELECT_ACCOUNT,
    value,
});