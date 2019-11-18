import React, { Component } from "react";
import { View, AsyncStorage } from "react-native";

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    await AsyncStorage.clear();

    var userName = await AsyncStorage.getItem(
      "name"
    );
    userName =
      userName == null ? false : userName;

    if (userName) {
      this.props.navigation.navigate("home");
    } else {
      this.props.navigation.navigate("login");
    }
  }
  render() {
    return <View></View>;
  }
}
