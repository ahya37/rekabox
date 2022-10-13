export default function Input(props) {
  const { ...nativeProps } = props;
  return <input type="text" className="form-control" {...nativeProps} />;
}
