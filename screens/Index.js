import React, { Component } from "react";
import { View, AsyncStorage } from "react-native";

import Communication from "../utility/Communication";

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async _setDay(id) {
    const data = await Communication(
      "getDate",
      { id },
      "getDate error"
    );

    const result = data.result;
    if (result == "OK") {
      const loginDate = new Date(data.loginDate);

      const now = new Date();
      const diffTime = Math.abs(now - loginDate);
      const diffDays = Math.floor(
        diffTime / (1000 * 60 * 60 * 24)
      );
      console.log(diffDays); // save day
    } else {
    }
  }

  async componentDidMount() {
    // await AsyncStorage.clear();

    var id = await AsyncStorage.getItem("id");
    id = id == null ? false : id;

    if (id) {
      this._setDay(id);
      this.props.navigation.navigate("home");
    } else {
      this.props.navigation.navigate("login");
    }
  }
  render() {
    return <View></View>;
  }
}
