import React, { Component } from "react";
import {
  View,
  Text,
  ImageBackground
} from "react-native";

export default class test extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 1
          }}
        >
          <ImageBackground
            source={require("../assets/images/back2.png")}
            style={{
              width: "100%",
              height: "100%"
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 20
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  color: "black"
                }}
              >
                dsfdsfkldsjfldsjflkjdlksjfjdsjfsdfdsfdsf
              </Text>
            </View>
          </ImageBackground>
        </View>
      </View>
    );
  }
}
