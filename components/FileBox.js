import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet
} from "react-native";

const { width, height } = Dimensions.get(
  "window"
);

export default class FileBox extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  _pressed() {
    const { fileName } = this.props.file;

    const func = this.props._onSelect;
    func(fileName + ".caf");
  }

  render() {
    const {
      fileName,
      fileTime
    } = this.props.file;

    return (
      <TouchableOpacity
        style={{
          width: width,
          height: 77,
          justifyContent: "center",
          alignItems: "center"
        }}
        onPress={this._pressed.bind(this)}
      >
        <Text style={styles.text}>
          {fileName}
        </Text>
        <Text style={styles.text}>
          {fileTime}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: "black",
    marginVertical: 5
  }
});
