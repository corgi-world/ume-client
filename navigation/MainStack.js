import React, { Component } from "react";
import { createAppContainer } from "react-navigation";
import {
  createStackNavigator,
  HeaderBackButton
} from "react-navigation-stack";

import Index from "../screens/Index";
import Login from "../screens/Login";
import Home from "../screens/Home";

import Chat from "../screens/Chat";
import Meditation from "../screens/Meditation";
import Test from "../screens/test";

import SelectBeliefs from "../screens/SelectBeliefs";
import SelectedBeliefs from "../screens/SelectedBeliefs";

export default MainStackNavigator = createStackNavigator(
  {
    index: {
      screen: Index,
      navigationOptions: ({ navigation }) => {
        return {
          header: null,
          gesturesEnabled: false
        };
      }
    },
    login: {
      screen: Login,
      navigationOptions: ({ navigation }) => {
        return {
          header: null,
          gesturesEnabled: false
        };
      }
    },
    selectBeliefs: {
      screen: SelectBeliefs,
      navigationOptions: ({ navigation }) => {
        return {
          header: null,
          gesturesEnabled: false
        };
      }
    },
    selectedBeliefs: {
      screen: SelectedBeliefs,
      navigationOptions: ({ navigation }) => {
        return {
          header: null,
          gesturesEnabled: false
        };
      }
    },
    home: {
      screen: Home,
      navigationOptions: ({ navigation }) => {
        return {
          header: null,
          gesturesEnabled: false
        };
      }
    },
    chat: {
      screen: Chat,
      navigationOptions: ({ navigation }) => {
        return {
          headerStyle: {
            borderBottomWidth: 0,
            backgroundColor: "white"
          },
          headerTintColor: "black",
          headerTitle: "",
          gesturesEnabled: false,
          headerLeft: (
            <HeaderBackButton
              tintColor={"black"}
              onPress={() => {
                navigation.navigate("home");
              }}
            />
          )
        };
      }
    },
    meditation: {
      screen: Meditation,
      navigationOptions: ({ navigation }) => {
        return {
          header: null,
          gesturesEnabled: false
        };
      }
    },
    test: {
      screen: Test,
      navigationOptions: ({ navigation }) => {
        return {
          header: null,
          gesturesEnabled: false
        };
      }
    }
  },
  {
    headerMode: "screen",
    headerBackTitleVisible: false
  }
);
