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

import * as Font from "expo-font";

import TypingAnimation from "./Typing";

import Colors from "../../utility/Colors";

import Playback from "./Playback";
import RecordingCheck from "./RecordingCheck";

import _Gif from "./_GIF";

export default class ServiceMesseage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isWait: true,
      fontLoaded: false
    };

    this.isUnmount = false;
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
        if (this.isUnmount === false) {
          _update(index);
          this.setState({ isWait: false });
        }
      }, delay);
    } else {
      if (this.isUnmount === false) {
        this.setState({ isWait: false });
      }
    }

    (async () => {
      await Font.loadAsync({
        NanumSquareRegular: require("../../assets/fonts/NanumSquareRegular.ttf")
      });
      this.setState({ fontLoaded: true });
    })();
  }

  componentWillUnmount() {
    this.isUnmount = true;
  }

  render() {
    const { isWait, fontLoaded } = this.state;
    const { _isFocused, gif, text } = this.props;

    let isGif = false;
    if (gif != null) {
      isGif = gif.index == this.props.index;
    }

    if (!fontLoaded) {
      return <View></View>;
    }

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
      if (isGif) {
        return (
          <View style={styles.box}>
            <View
              style={
                this.props.isFirst
                  ? styles.first_message
                  : styles.second_message
              }
            >
              <_Gif gif={gif} _maxWidth={205} />
            </View>
          </View>
        );
      } else {
        return (
          <View style={styles.box}>
            <View
              style={
                this.props.isFirst
                  ? styles.first_message
                  : styles.second_message
              }
            >
              <Text
                style={[
                  {
                    fontSize: 16,
                    padding: 10,
                    color:
                      Colors.serviceMessageFont,
                    fontFamily:
                      "NanumSquareRegular"
                  },
                  _isFocused
                    ? { fontWeight: "600" }
                    : {}
                ]}
              >
                {text}
              </Text>
            </View>
          </View>
        );
      }
    }
  }
}

const styles = StyleSheet.create({
  box: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "row",
    marginTop: 3,
    marginBottom: 3,
    marginLeft: 16
  },
  first_message: {
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    backgroundColor: Colors.serviceMessageBack,
    maxWidth: width - 150
  },
  second_message: {
    borderRadius: 15,
    backgroundColor: Colors.serviceMessageBack,
    maxWidth: width - 150
  }
});
