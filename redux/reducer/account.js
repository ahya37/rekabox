import ActionType from "redux/type";

const inittialState = {
    selectedAccount: {}
};

const accountReducer = (state = inittialState, action) => {
    switch (action.type) {
        case ActionType.SET_SELECT_ACCOUNT:
            return {
                ...state,
                selectedAccount: action.value
            }

        default:
            return {
                ...state,
            };
    }
}

export default accountReducer;