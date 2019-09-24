import React, { Component } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from "react-native";

import Beliefs from "../scripts/Beliefs";

import SelecteManager from "../components/signup/SelecteManager";

export default class SelectBeliefs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: []
    };

    Beliefs.init();
  }

  _onPress(text) {
    let selected = this.state.selected;
    let b = selected.includes(text);
    if (!b) {
      selected.push(text);

      this.setState({
        selected
      });
    }
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
          <ScrollView
            showsVerticalScrollIndicator={false}
          >
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={
                false
              }
            >
              <SelecteManager
                title={"Feeling Helpless"}
                texts={Beliefs.helpless}
                _onPress={this._onPress.bind(
                  this
                )}
              />
            </ScrollView>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={
                false
              }
            >
              <SelecteManager
                title={"Feeling Unlovable"}
                texts={Beliefs.unlovable}
                _onPress={this._onPress.bind(
                  this
                )}
              />
            </ScrollView>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={
                false
              }
            >
              <SelecteManager
                title={"Feeling Worthless"}
                texts={Beliefs.worthless}
                _onPress={this._onPress.bind(
                  this
                )}
              />
            </ScrollView>
          </ScrollView>
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
                "selectedBeliefs",
                {
                  selected: this.state.selected
                }
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
