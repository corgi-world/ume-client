import React, { Component } from "react";
import { Animated, Easing } from "react-native";

import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import MainStack from "./MainStack";
import Recording_Modal from "../screens/Recording_Modal";

const RootStackNavigator = createStackNavigator(
  {
    mainStack: {
      screen: MainStack,
      navigationOptions: ({ navigation }) => {
        return {
          header: null
        };
      }
    },
    recording_modal: {
      screen: Recording_Modal,
      navigationOptions: ({ navigation }) => {
        return {
          header: null
        };
      }
    }
  },
  {
    mode: "modal",
    transparentCard: true
  }
);

export default RootStackContainer = createAppContainer(
  RootStackNavigator
);
