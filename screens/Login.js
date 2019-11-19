import React, { Component } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  AsyncStorage,
  Alert
} from "react-native";

import Communication from "../utility/Communication";

const { width, height } = Dimensions.get(
  "window"
);

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      name: ""
    };
  }

  _showAlert(text, cancelText) {
    Alert.alert(
      text,
      "",
      [
        {
          text: cancelText
        }
      ],
      { cancelable: false }
    );
  }

  _onPress = async () => {
    const { id, name } = this.state;
    const data = await Communication(
      "login",
      { id, name },
      "login error"
    );

    const result = data.result;
    const isIdDuplicated = data.isIdDuplicated;

    if (result == "OK") {
      if (isIdDuplicated) {
        this._showAlert(
          "이미 중복된 아이디입니다.",
          "닫기"
        );
      } else {
        await AsyncStorage.setItem(
          "id",
          this.state.id
        );
        await AsyncStorage.setItem(
          "name",
          this.state.name
        );
        this.props.navigation.navigate(
          "selectBeliefs"
        );
      }
    } else {
      this._showAlert("통신 오류", "닫기");
    }
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <TextInput
          style={[
            styles._textInput,
            { marginBottom: 10 }
          ]}
          autoCorrect={false}
          placeholder={"아이디"}
          returnKeyType={"done"}
          onChangeText={text => {
            this.setState({ id: text });
          }}
        />
        <TextInput
          style={[
            styles._textInput,
            { marginBottom: 10 }
          ]}
          autoCorrect={false}
          placeholder={"이름"}
          returnKeyType={"done"}
          onChangeText={text => {
            this.setState({ name: text });
          }}
        />
        <TouchableOpacity
          style={{
            width: width - 100,
            height: 50,
            borderRadius: 15,
            borderWidth: 0.5,
            borderColor: "gray",
            justifyContent: "center",
            alignItems: "center"
          }}
          onPress={this._onPress}
        >
          <Text style={{ fontSize: 16 }}>
            로그인
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  _textInput: {
    width: width - 100,
    fontSize: 15,
    padding: 10,
    borderWidth: 0.5,
    borderColor: "#bebebe",
    borderRadius: 10
  }
});
