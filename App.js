import React, { Component } from "react";
import { View, Text } from "react-native";

import MainTabContainer from "./navigation/MainTab";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <MainTabContainer />;
  }
}
