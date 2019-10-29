import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from "react-native";

import Colors from "../../utility/Colors";

export default class SelecteItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPressed: false
    };
  }

  render() {
    const { text } = this.props;
    const { isPressed } = this.state;
    return (
      <View
        style={{
          marginVertical: 10,
          marginRight: 10
        }}
      >
        <TouchableOpacity
          style={
            isPressed
              ? styles.pressed
              : styles.none
          }
          onPress={() => {
            this.setState({
              isPressed: !isPressed
            });
            if (!isPressed) {
              this.props._onPress(text);
            }
          }}
        >
          <Text
            style={
              isPressed
                ? styles.pressed_text
                : styles.none_text
            }
          >
            {this.props.text}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  none: {
    borderWidth: 0.5,
    borderColor: "gray",
    borderRadius: 20,
    padding: 10
  },
  pressed: {
    borderWidth: 0.5,
    borderColor: "white",
    borderRadius: 20,
    padding: 10,
    backgroundColor: Colors.userMessageBack
  },
  none_text: {
    color: "black"
  },
  pressed_text: {
    color: "white"
  }
});
