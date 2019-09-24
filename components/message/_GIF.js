import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  Dimensions
} from "react-native";

import Gifs from "../../utility/Gifs";

const { width, height } = Dimensions.get(
  "window"
);

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
          width: width - 150,
          height: 225,
          justifyContent: "center"
        }}
      >
        <Image
          source={Gifs[gifFileName]}
          style={{
            width: "100%",
            height: "100%"
          }}
          resizeMode={"contain"}
        ></Image>
      </View>
    );
  }
}
