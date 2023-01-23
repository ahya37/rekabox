import ActionType from "redux/type";

export const setShowFormLocation = (value) => ({
    type: ActionType.SET_SHOW_FORM_LOCATION,
    value,
});


export const setListLocation = (value) => ({
    type: ActionType.SET_LIST_LOCATION,
    value,
})