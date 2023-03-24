import React from "react";
import "../css/Button.css";
import { Link } from "react-router-dom";

const STYLES = ["btn--primary", "btn--outline"];

const SIZES = ["btn--medium", "btn--large"];

export const Button = ({
  //props for button
  to,
  children,
  type,
  onClick,
  buttonStyle,
  buttonSize,
}) => {
  //function that checks button style if the buttonstyle set is included in the array of style it sets it to that otherwise the defualt is primary
  const checkButtonStyle = STYLES.includes(buttonStyle)
    ? buttonStyle
    : STYLES[0];
  const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];

  const checkLink = to ? to : "/";

  return (
    <Link to={checkLink} className="btn-mobile">
      <button
        className={`btn ${checkButtonStyle} ${checkButtonSize}`}
        onClick={onClick}
        type={type}
      >
        {children}
      </button>
    </Link>
  );
};
