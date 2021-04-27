import React, { Component } from "react";

import MainTabContainer from "./navigation/MainTab";
import RootStackContainer from "./navigation/RootStack";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <RootStackContainer />;
  }
}
