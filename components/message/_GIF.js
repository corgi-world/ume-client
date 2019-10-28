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

  _calSize(org_width, org_height) {
    img_height = 0;
    ratio = org_width / 205;
    img_height = org_height / ratio;

    return img_height;
  }

  render() {
    const { gifFileName } = this.props;
    const obj = Gifs[gifFileName];
    const org_width = obj.width;
    const org_height = obj.height;
    const img_width = 205;
    const img_height = this._calSize(
      org_width,
      org_height
    );

    return (
      <View
        style={{
          width: img_width + 20,
          height: img_height + 20,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Image
          source={obj.file}
          style={{
            width: img_width,
            height: img_height
          }}
          resizeMode={"contain"}
        ></Image>
      </View>
    );
  }
}
