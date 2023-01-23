const initialState = {
  userProfile: {},
};

const UserProfileReducer = (state = initialState, action) => {
  if (action.type === "SET_PROFILE") {
    return {
      ...state,
      userProfile: action.value,
    };
  }
  return state;
};

export default UserProfileReducer;
