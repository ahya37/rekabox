import ActionType from "redux/type";

const inittialState = {
    showFormLocation: false,
    listLocation: []

};

const locationReducer = (state = inittialState, action) => {
    switch (action.type) {
        case ActionType.SET_SHOW_FORM_LOCATION:
            return {
                ...state,
                showFormLocation: action.value
            }

            case ActionType.SET_LIST_LOCATION:
                return {
                    ...state,
                    listLocation: action.value
                }
        default:
            return {
                ...state,
            };
    }
}

export default locationReducer;