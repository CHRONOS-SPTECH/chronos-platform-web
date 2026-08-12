function Button(props) {
  return (
    <button
      type={props.type ?? "button"}
      disabled={props.disabled}
      className="button"
      {...props}
    >
      {props.text}
    </button>
  );
}

export default Button;
