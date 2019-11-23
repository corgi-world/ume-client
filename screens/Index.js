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
      const loginDate = data.loginDate;

      const now = new Date();
      const start = new Date(
        now.getFullYear(),
        0,
        0
      );
      const diff = now - start;
      const oneDay = 1000 * 60 * 60 * 24;
      const nowDay = Math.floor(diff / oneDay);
      const day = nowDay - loginDate;

      console.log(
        loginDate + " " + nowDay + " " + day
      );

      await AsyncStorage.setItem(
        "day",
        day.toString()
      );
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
