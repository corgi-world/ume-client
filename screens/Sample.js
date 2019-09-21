import React, { Component } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from "react-native";

import SelecteManager from "../components/signup/SelecteManager";

export default class Sample extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
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
            Select Your
          </Text>
          <Text style={styles.title}>
            core beliefs
          </Text>
        </View>
        <View style={{ flex: 12 }}>
          <ScrollView>
            <ScrollView horizontal={true}>
              <SelecteManager />
            </ScrollView>
            <ScrollView horizontal={true}>
              <SelecteManager />
            </ScrollView>
            <ScrollView horizontal={true}>
              <SelecteManager />
            </ScrollView>
          </ScrollView>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: "pink"
          }}
        >
          <TouchableOpacity
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
              Next
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
  }
});
