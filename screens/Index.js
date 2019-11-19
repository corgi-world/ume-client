import React, { Component } from "react";
import { View, AsyncStorage } from "react-native";

import Communication from "../utility/Communication";

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async _setDay(id) {
    const date1 = new Date();
    const date2 = new Date("2019-11-19");
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.floor(
      diffTime / (1000 * 60 * 60 * 24)
    );
    // console.log(diffDays + " " + diffTime);

    const data = await Communication(
      "getDate",
      { id },
      "getDate error"
    );

    const result = data.result;
    if (result == "OK") {
      const recentDate = data.recentDate;
      // console.log(recentDate);
    } else {
    }
  }

  async componentDidMount() {
    // await AsyncStorage.clear();

    var id = await AsyncStorage.getItem("id");
    id = id == null ? false : id;

    this._setDay(id);

    if (id) {
      this.props.navigation.navigate("home");
    } else {
      this.props.navigation.navigate("login");
    }
  }
  render() {
    return <View></View>;
  }
}
