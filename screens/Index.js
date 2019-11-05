import React, { Component } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  AsyncStorage
} from "react-native";

const CollectionsList = require("collections/list");

const { width, height } = Dimensions.get(
  "window"
);

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ""
    };
  }

  async componentDidMount() {
    // await AsyncStorage.clear();

    var name = await AsyncStorage.getItem("name");
    name = name === null ? false : name;

    if (name) {
      this.props.navigation.navigate("chat");
      /*
      array = new CollectionsList();
      array.add(
        "29632410-eee7-11e9-a3c0-c3b2e1d3cd64.caf"
      );
      array.add(
        "29632410-eee7-11e9-a3c0-c3b2e1d3cd64.caf"
      );
      array.add(
        "29632410-eee7-11e9-a3c0-c3b2e1d3cd64.caf"
      );

      this.props.navigation.navigate(
        "meditation",
        {
          audioFileNames: array,
          texts: ["1", "2", "3"]
        }
      );*/
    } else {
      this.props.navigation.navigate("login");
    }
  }
  render() {
    return <View></View>;
  }
}

const styles = StyleSheet.create({
  _textInput: {
    width: width - 100,
    fontSize: 15,
    padding: 10,
    borderWidth: 0.5,
    borderColor: "#bebebe",
    borderRadius: 10
  }
});
