/* eslint-disable */

import React from "react";
import ReactDOM from "react-dom/client";
import "./style/calendar.css";
import App from "./App";
import "./style/animation.css";
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#00bcd4",
    },
  },
});

class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animationClass: "test",
    };
  }
  render() {
    return (
      <div className={this.state.animationClass} id="animation">
        <MuiThemeProvider theme={theme}>
          <App />
        </MuiThemeProvider>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Application />
    {/* <Selectable />, */}
  </React.StrictMode>
);
