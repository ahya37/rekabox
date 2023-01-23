const initialState = {
  listMenu: [],
};

const MenuReducer = (state = initialState, action) => {
  if (action.type === "SET_MENU") {
    return {
      ...state,
      listMenu: action.value,
    };
  }

  return state;
};

export default MenuReducer;
