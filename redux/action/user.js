import ActionType from "../type";

export const setUserProfile = (value) => ({
  type: ActionType.SET_PROFILE,
  value,
});
