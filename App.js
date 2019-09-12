import React, { Component } from "react";

import MainTabContainer from "./navigation/MainTab";
import MainStackContainer from "./navigation/MainStack";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <MainStackContainer />;
  }
}
