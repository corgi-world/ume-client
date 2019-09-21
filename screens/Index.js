import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground
} from "react-native";

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // this.props.navigation.navigate("chat");
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Image
          source={require("../assets/corgi.gif")}
          style={{
            width: "100%"
          }}
          resizeMode={"contain"}
        ></Image>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate(
              "chat"
            );
          }}
        >
          <Text>Hello</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
