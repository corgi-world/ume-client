import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";

export default class TextBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: ""
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.props._scrollToEnd();
    }, 200);
  }

  render() {
    const { inputText } = this.state;
    const {
      _scrollToEnd,
      _sendText
    } = this.props;

    return (
      <View style={{ flexDirection: "row" }}>
        <TextInput
          style={{
            fontSize: 16,
            borderWidth: 0.5,
            borderColor: "#bebebe",
            borderRadius: 10,
            backgroundColor: "white",
            padding: 10,
            paddingTop: 12,
            flex: 1,
            margin: 10
          }}
          placeholder={"편하게 말씀해주세요"}
          autoFocus={true}
          autoCorrect={false}
          multiline={true}
          value={this.state.inputText}
          onChangeText={text => {
            _scrollToEnd();
            this.setState({ inputText: text });
          }}
        />
        <TouchableOpacity
          style={{
            width: 50,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#15badb",
            borderRadius: 10,
            marginRight: 10,
            marginVertical: 10
          }}
          onPress={() => {
            _sendText(inputText);
          }}
        >
          <View style={{}}>
            <Text
              style={{
                fontSize: 16,
                color: "white",
                fontWeight: "400"
              }}
            >
              전송
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
