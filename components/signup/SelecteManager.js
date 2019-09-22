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
    this.state = {};
  }

  _onPress(text) {
    this.props._onPress(text);
  }

  _makeItem(text) {
    return (
      <SelecteItem
        key={text}
        text={text}
        _onPress={this._onPress.bind(this)}
      />
    );
  }
  render() {
    const { title, texts } = this.props;

    let items = [];
    for (var i = 0; i < texts.length; i++) {
      items.push(
        <View
          key={"helpless" + i}
          style={styles.containerRow}
        >
          {Object.values(texts[i]).map(text =>
            this._makeItem(text)
          )}
        </View>
      );
    }

    return (
      <View>
        <View style={styles.container}>
          <View style={{ marginBottom: 10 }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "400"
              }}
            >
              {title}
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
