import ActionType from "redux/type";

const inittialState = {
    selectedAccount: {},
    showFormAccount: false,
    listAccount: []
};

const accountReducer = (state = inittialState, action) => {
    switch (action.type) {
        case ActionType.SET_SELECT_ACCOUNT:
            return {
                ...state,
                selectedAccount: action.value
            }

        case ActionType.SET_SHOW_FORM_ACCOUNT:
            return {
                ...state,
                showFormAccount: action.value
            }
        case ActionType.SET_LIST_ACCOUNT:
            return {
                ...state,
                listAccount: action.value
            }

        default:
            return {
                ...state,
            };
    }
}

export default accountReducer;