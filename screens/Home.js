import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions
} from "react-native";

const { width, height } = Dimensions.get(
  "window"
);

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View
        style={{
          backgroundColor: "#0B8A67",
          flex: 1,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Image
          style={{
            width: 111,
            height: 111
          }}
          source={require("../assets/images/title.png")}
          resizeMode={"contain"}
        />

        <TouchableOpacity
          style={{
            width: width / 2,
            height: 50,
            borderRadius: 30,
            borderWidth: 1,
            borderColor: "white",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 50
          }}
          onPress={() => {
            this.props.navigation.navigate(
              "chat"
            );
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "400",
              color: "white"
            }}
          >
            대화 시작하기
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            width: width / 2,
            height: 50,
            borderRadius: 30,
            borderWidth: 1,
            borderColor: "white",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 15
          }}
          onPress={() => {
            this.props.navigation.navigate(
              "test"
            );
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "400",
              color: "white"
            }}
          >
            명상하기
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
