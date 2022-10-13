import moment from "moment";

export default function DateTimeFormat(props) {
  const { date } = props;
  if (date === "") {
    return date;
  } else {
    return moment(date).format("DD-MM-YYYY HH:mm:ss");
  }
}
