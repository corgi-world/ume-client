import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  Dimensions
} from "react-native";

const { width, height } = this.props;

export default class _GIF extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { gifFileName } = this.props;

    return (
      <View
        style={{
          maxWidth: width - 150,
          maxHeight: 150
        }}
      >
        <Text> _GIF </Text>
      </View>
    );
  }
}
