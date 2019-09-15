import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions
} from "react-native";

const { width, height } = Dimensions.get(
  "window"
);

import TypingAnimation from "./Typing";

import Playback from "./Playback";

export default class ServiceMesseage extends Component {
  constructor(props) {
    super(props);
    this.state = { isWait: true };
  }

  componentDidMount() {
    const {
      isWait,
      _update,
      index,
      delay
    } = this.props;
    if (isWait) {
      setTimeout(() => {
        _update(index);
        this.setState({ isWait: false });
      }, delay);
    } else {
      this.setState({ isWait: false });
    }
  }

  render() {
    const { isWait } = false;
    const {
      isPlayback,
      playbackFileName
    } = this.props;

    if (isWait) {
      return (
        <View
          style={{
            marginTop: 20,
            marginBottom: 20,
            marginLeft: 16
          }}
        >
          <TypingAnimation />
        </View>
      );
    } else {
      if (isPlayback) {
        return (
          <View
            style={{
              alignItems: "flex-start",
              justifyContent: "flex-end",
              flexDirection: "row",
              marginTop: 3,
              marginBottom: 3,
              marginRight: 15
            }}
          >
            <View
              style={
                this.props.isFirst
                  ? styles.first_message
                  : styles.second_message
              }
            >
              <Playback
                playbackFileName={
                  playbackFileName
                }
              />
            </View>
          </View>
        );
      } else {
        return (
          <View
            style={{
              alignItems: "flex-start",
              justifyContent: "flex-end",
              flexDirection: "row",
              marginTop: 3,
              marginBottom: 3,
              marginRight: 15
            }}
          >
            <View
              style={
                this.props.isFirst
                  ? styles.first_message
                  : styles.second_message
              }
            >
              <Text
                style={{
                  fontSize: 16,
                  padding: 10,
                  fontWeight: "400",
                  color: "white"
                }}
              >
                {this.props.text}
              </Text>
            </View>
          </View>
        );
      }
    }
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
