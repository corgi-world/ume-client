import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView
} from "react-native";

import FileBox from "./FileBox";

export default class FileManager extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { files } = this.props;

    if (files == null || files == undefined) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text>~</Text>
        </View>
      );
    } else {
      return (
        <ScrollView
          style={{
            marginTop: 20
          }}
        >
          {Object.values(files).map(file => {
            return (
              <View
                key={
                  file.fileName + file.fileTime
                }
                style={{
                  flex: 1,
                  borderTopWidth: 0.5,
                  borderColor: "gray"
                }}
              >
                <FileBox
                  key={file.fileName}
                  _onSelect={this.props._onSelect}
                  file={file}
                />
              </View>
            );
          })}
        </ScrollView>
      );
    }
  }
}
