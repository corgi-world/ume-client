import React, { Component } from "react";
import { View, Text } from "react-native";

export default class Waiting extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    setTimeout(() => {
      this.props._scrollToEnd();
    }, 200);
  }

  render() {
    const { script, level } = this.props;
    const height = script.length * 39;

    console.log(this.props.waitingText);

    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          height
        }}
      >
        <Text
          style={{
            fontSize: 16
          }}
        >
          {this.props.waitingText}
        </Text>
      </View>
    );
  }
}
