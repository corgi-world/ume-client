import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions
} from "react-native";

const { width, height } = Dimensions.get(
  "window"
);

export default class Recording_Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View>
        <View
          style={{
            width,
            height,
            backgroundColor: "black",
            opacity: 0.9
          }}
        ></View>
        <View
          style={{
            width,
            height: height / 2,
            backgroundColor: "white",
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 5,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text>Hello</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
