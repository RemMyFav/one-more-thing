import React from "react";
import "../style/update_calendar_popup.css";
function Create_calendar_popup(props) {
  return props.trigger ? (
    <div className="update_calendar_popup">
      <div className="update_calendar_popup_inner">
        <button className="close_btn">X</button>
        {props.children}
      </div>
    </div>
  ) : (
    ""
  );
}
export default Create_calendar_popup;
