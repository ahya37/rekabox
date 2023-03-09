import { setDetailItem, setHSelectedImage, setSelectItemLocation } from "redux/action/item";

export const ClearRedux = () => (dispatch) => {
  dispatch(setSelectItemLocation([]));
  dispatch(setDetailItem({}));
  dispatch(setHSelectedImage(null));
};
