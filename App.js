import React, { Component } from "react";

import MainTabContainer from "./navigation/MainTab";
import RootStackContainer from "./navigation/RootStack";

import Ddd from "./screens/test";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <RootStackContainer />;
  }
}
