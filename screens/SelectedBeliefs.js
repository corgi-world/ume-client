import React, { Component } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet
} from "react-native";

import Colors from "../utility/Colors";

export default class SelectedBeliefs extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const selected = this.props.navigation.state
      .params.selected;

    let items = { length: 1 };
    let itemsLength = 0;
    let length = selected.length;
    let d = 2;
    let count = 0;

    items[0] = [];
    for (var i = 0; i < length; i++) {
      if (count === d) {
        itemsLength += 1;
        items[itemsLength] = [];
        count = 0;
        items["length"] = itemsLength + 1;
      }
      items[itemsLength].push(selected[i]);
      count += 1;
    }

    let controls = [];
    for (var i = 0; i < items.length; i++) {
      controls.push(
        <View
          key={"selected " + i}
          style={styles.containerRow}
        >
          {Object.values(items[i]).map(text => (
            <View
              key={"selected view " + text}
              style={styles.none}
            >
              <Text
                key={text}
                style={styles.none_text}
              >
                {text}
              </Text>
            </View>
          ))}
        </View>
      );
    }

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
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {controls}
        </View>
        <View
          style={{
            flex: 4,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text style={styles.semiTitle}>
            Me, you're more lovable if you know
            how to love yourself
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
                "home"
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
  },
  containerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  none: {
    marginVertical: 10,
    marginHorizontal: 5,
    borderWidth: 0.5,
    borderColor: "white",
    borderRadius: 20,
    padding: 10,
    backgroundColor: Colors.userMessageBack
  },
  none_text: {
    color: "white",
    fontSize: 18
  }
});
