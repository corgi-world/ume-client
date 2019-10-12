import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity
} from "react-native";

export default class Buttons extends Component {
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
    const { script } = this.props;

    let items = {};
    for (var i = 0; i < script.length; i++) {
      var text = script[i];
      items[i] = {
        index: i,
        text
      };
    }

    return (
      <View style={{ borderBottomWidth: 0.2 }}>
        {Object.values(items).map(item => {
          return (
            <TouchableOpacity
              key={item.text}
              style={{
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 10,
                borderTopWidth: 0.5
              }}
              onPress={() => {
                this.props._pushedInputBlock(
                  item.index,
                  item.text
                );
              }}
            >
              <Text style={{ fontSize: 16 }}>
                {item.text}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}
