import React, { Component } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet
} from "react-native";

export default class SelectedBeliefs extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const selected = this.props.navigation.state
      .params.selected;

    let items = {};
    let itemsLength = 0;
    let length = selected.length;
    let d = 3;
    let count = 0;

    items[0] = [];
    for (var i = 0; i < length; i++) {
      count += 1;
      if (count === d) {
        itemsLength += 1;
        items[itemsLength] = [];
        count = 0;
        items["length"] = itemsLength + 1;
      }
      items[itemsLength].push(selected[i]);
    }

    let controls = "";
    console.log(items);

    return (
      <SafeAreaView
        style={{
          flex: 1
        }}
      >
        <View
          style={{
            flex: 3,
            justifyContent: "flex-end",
            paddingLeft: 20,
            paddingBottom: 10
          }}
        >
          <Text style={styles.title}>
            Me's core belief
          </Text>
          <Text style={styles.semiTitle}>
            How you see yourself
          </Text>
        </View>

        <View
          style={{
            flex: 8,
            backgroundColor: "pink",
            justifyContent: "center",
            alignItems: "center"
          }}
        ></View>
        <View
          style={{
            flex: 4,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text style={styles.semiTitle}>
            Me, you're more lovable if you know
            how to yourself
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            borderTopWidth: 0.5
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate(
                "chat"
              );
            }}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600"
              }}
            >
              Start
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "600"
  },
  semiTitle: {
    fontSize: 24,
    fontWeight: "600"
  }
});
