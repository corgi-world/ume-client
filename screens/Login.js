import React, { Component } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  AsyncStorage
} from "react-native";

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

  async componentDidMount() {}

  _onPress = async () => {
    await AsyncStorage.setItem(
      "name",
      this.state.name
    );
    await AsyncStorage.setItem(
      "id",
      this.state.id
    );
    this.props.navigation.navigate(
      "selectBeliefs"
    );
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
