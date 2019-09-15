import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Dimensions
} from "react-native";

import { TypingAnimation } from "react-native-typing-animation";

const { width, height } = Dimensions.get(
  "window"
);

export default class Typing extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "flex-end",
          flexDirection: "row"
        }}
      >
        <View
          style={
            this.props.isFirst
              ? styles.first_profile
              : styles.second_profile
          }
        />

        <TypingAnimation
          dotColor="black"
          dotMargin={10}
          dotAmplitude={5}
          dotSpeed={0.15}
          dotRadius={5}
          dotX={20}
          dotY={-6}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  first_message: {
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    backgroundColor: "#15badb",
    maxWidth: width - 150
  },
  second_message: {
    borderRadius: 15,
    backgroundColor: "#15badb",
    maxWidth: width - 150
  }
});
