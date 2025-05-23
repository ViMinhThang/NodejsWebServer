import React, { type CSSProperties, type MouseEventHandler, type ReactNode } from "react";
import Loading from "./InlineLoading";
interface ButtonProps {
  id?: string;
  size?: "big" | "small" | "extraSmall";
  color?: "default" | "blue" | "red" | "green" | "gray";
  outlined?: boolean;
  rounded?: boolean;
  block?: boolean;
  className?: string;
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  children?: ReactNode;
}
const Button:React.FC<ButtonProps> = (props) => {
  let className = "button";

  switch (props.size) {
    case "big":
      className += " button-big";
      break;
    case "small":
      className += " button-small";
      break;
    case "extraSmall":
      className += " button-extra-small";
      break;
  }

  switch (props.color) {
    case "default":
      if (props.outlined) {
        className += " button-default-outlined";
      } else {
        className += " button-default";
      }
      break;
    case "blue":
      if (props.outlined) {
        className += " button-blue-outlined";
      } else {
        className += " button-blue";
      }
      break;
    case "red":
      if (props.outlined) {
        className += " button-red-outlined";
      } else {
        className += " button-red";
      }
      break;
    case "green":
      if (props.outlined) {
        className += " button-green-outlined";
      } else {
        className += " button-green";
      }
      break;
    case "gray":
      if (props.outlined) {
        className += " button-gray-outlined";
      } else {
        className += " button-gray";
      }
      break;

    default:
      if (props.outlined) {
        className += " button-default-outlined";
      } else {
        className += " button-default";
      }
      break;
  }

  if (props.rounded) {
    className += " button-rounded";
  }

  if (props.block) {
    className += " button-block";
  }

  className += " " + props.className;

  let loadingColor;
  if (props.color === "blue") loadingColor = "blue";
  if (!props.outlined) loadingColor = "light";

  return (
    <button
      id={props.id}
      style={props.style}
      onClick={props.onClick}
      className={className}
      type={props.type ? props.type : "button"}
      disabled={props.loading ? true : props.disabled}
    >
      {props.children}
      {props.loading && (
        <Loading className="u-margin-left-03" color={loadingColor} />
      )}
    </button>
  );
};

export default Button;
