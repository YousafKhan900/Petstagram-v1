import React, { useState } from "react";

function Alert({ type, message, deleteAlert }) {
  const [show, setShow] = useState(true);

  let color = "";
  let icon = "";
  switch (type) {
    case "Success":
      color = "darkseagreen";
      icon = "fa fa-check";
      break;
    case "Error":
      color = "indianred";
      icon = "fa fa-times";
      break;
    case "Warning":
      color = "orange";
      icon = "fa fa-exclamation";
      break;

    default:
      break;
  }

  if (!show) return null;

  return (
    <div
      className={`fixed bottom-0 right-0 border rounded-md sm:mb-6 sm:mr-6 w-full h-24 flex sm:w-80`}
      style={{ backgroundColor: `${color}` }}
    >
      <div className="flex flex-col justify-center items-center w-1/4">
        <h1 className="text-white text-4xl">
          <i className={`${icon}`} />
        </h1>
      </div>
      <div className="flex flex-col justify-center items-center w-3/4">
        <h1 className="text-white text-2xl self-start">{type}</h1>
        <p className="text-white text-sm self-start">{message}</p>
      </div>
      <div
        className="absolute top-0 right-0 mr-4 mt-2 cursor-pointer"
        onClick={() => {
          setShow(false);
          deleteAlert();
        }}
      >
        <i className="fa fa-times text-white text-lg" />
      </div>
    </div>
  );
}

export default Alert;
