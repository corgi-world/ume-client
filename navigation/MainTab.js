import React from "react";
import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";

import {
  Ionicons,
  MaterialIcons
} from "@expo/vector-icons";

import Recording from "../screens/Recording";
import Playlist from "../screens/Playlist";

const MainTabNavigator = createBottomTabNavigator(
  {
    recording: {
      screen: Recording,
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <Ionicons
            size={35}
            name="ios-recording"
            color={focused ? "black" : "#7f8c8d"}
          />
        )
      }
    },
    playlist: {
      screen: Playlist,
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <MaterialIcons
            size={28}
            name="audiotrack"
            color={focused ? "black" : "#7f8c8d"}
          />
        )
      }
    }
  },
  {
    tabBarOptions: {
      showLabel: false,
      style: {
        borderTopWidth: 0,
        backgroundColor: "white"
      }
    }
  }
);

export default MainTabContainer = createAppContainer(
  MainTabNavigator
);
