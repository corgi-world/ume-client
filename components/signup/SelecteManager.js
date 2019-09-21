import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView
} from "react-native";

import SelecteItem from "./SelecteItem";

export default class SelecteManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      helpless: [],
      unlovable: [],
      worthless: []
    };

    this.helplessTexts = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      length: 5
    };
    this.helplessTexts[0].push("Incompetent");
    this.helplessTexts[0].push("Ineffective");
    this.helplessTexts[0].push(
      "I can’t do anything right"
    );
    this.helplessTexts[1].push("Helpless");
    this.helplessTexts[1].push("Powerless");
    this.helplessTexts[1].push("Weak");
    this.helplessTexts[1].push("Victim");
    this.helplessTexts[2].push("Needy");
    this.helplessTexts[2].push("Trapped");
    this.helplessTexts[2].push("Out of control");
    this.helplessTexts[2].push("Failure");
    this.helplessTexts[3].push("Defective");
    this.helplessTexts[3].push("Not good enough");
    this.helplessTexts[3].push("Loser");
  }

  _onPress(text) {
    console.log(text);
  }

  _makeItem(text) {
    return (
      <SelecteItem
        key={text}
        text={text}
        _onPress={this._onPress}
      />
    );
  }
  render() {
    let items = [];
    for (
      var i = 0;
      i < this.helplessTexts.length;
      i++
    ) {
      items.push(
        <View
          key={"helpless" + i}
          style={styles.containerRow}
        >
          {Object.values(
            this.helplessTexts[i]
          ).map(text => this._makeItem(text))}
        </View>
      );
    }

    return (
      <View>
        <View style={styles.container}>
          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 20 }}>
              Feeling Helpless
            </Text>
          </View>
          {items}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 20,
    marginTop: 30
  },
  containerRow: {
    flexDirection: "row"
  }
});
