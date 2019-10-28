import React, { Component } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet
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
      <View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{
            flexDirection: "row",
            borderTopWidth: 0.5,
            paddingTop: 15,
            paddingHorizontal: 20
          }}
        >
          {Object.values(items).map(item => {
            return (
              <TouchableOpacity
                key={item.text}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 10,
                  borderRadius: 30,
                  borderWidth: 1,
                  marginRight: 15
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
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {}
});
