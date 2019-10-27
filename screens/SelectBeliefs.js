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

  componentDidMount() {
    // this.props.navigation.navigate("chat");
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
            flex: 4,
            paddingLeft: 20,
            paddingVertical: 20
          }}
        >
          <View style={{ marginTop: 15 }}>
            <Text style={styles.title}>
              Select Your core beliefs
            </Text>
          </View>
          <View
            style={{
              marginTop: 20
            }}
          >
            <Text style={styles.subTitle}>
              난 현재 나를
            </Text>
            <Text style={styles.subTitle}>
              어떻게 바라보고 있을까?
            </Text>
          </View>
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
    fontSize: 23,
    fontWeight: "600"
  },
  subTitle: {
    fontSize: 28,
    fontWeight: "600"
  }
});
