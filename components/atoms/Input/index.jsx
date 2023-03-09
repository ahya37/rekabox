export default function Input(props) {
  const { ...nativeProps } = props;
  const { value } = props;
  return <input type="text" className={`form-control ${value === '' ? 'is-invalid' : ''}`} {...nativeProps} />;
}
