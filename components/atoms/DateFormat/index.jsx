import moment from "moment";

export default function DateFormat(props) {
  const { date } = props;
  if (date === "") {
    return date;
  } else {
    return moment(date).format("DD-MM-YYYY");
  }
}
