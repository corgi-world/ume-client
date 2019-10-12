import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import Index from "../screens/Index";
import Login from "../screens/Login";

import Chat from "../screens/Chat";
import Meditation from "../screens/Meditation";

import SelectBeliefs from "../screens/SelectBeliefs";
import SelectedBeliefs from "../screens/SelectedBeliefs";

const MainStackNavigator = createStackNavigator(
  {
    index: {
      screen: Index,
      navigationOptions: ({ navigation }) => {
        return {
          header: null
        };
      }
    },
    login: {
      screen: Login,
      navigationOptions: ({ navigation }) => {
        return {
          header: null
        };
      }
    },
    selectBeliefs: {
      screen: SelectBeliefs,
      navigationOptions: ({ navigation }) => {
        return {
          header: null
        };
      }
    },
    selectedBeliefs: {
      screen: SelectedBeliefs,
      navigationOptions: ({ navigation }) => {
        return {
          header: null
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
          headerTitle: ""
        };
      }
    },
    meditation: {
      screen: Meditation,
      navigationOptions: ({ navigation }) => {
        return {
          header: null
        };
      }
    }
    /*
    signup: {
      screen: Signup,
      navigationOptions: ({ navigation }) => {
        return {
          headerStyle: {
            borderBottomWidth: 0,
            backgroundColor: "white"
          },
          headerTintColor: "black",
          headerTitle: "회원가입"
        };
      }
    }*/
  },
  {
    headerMode: "screen",
    headerBackTitleVisible: false
  }
);

export default MainStackContainer = createAppContainer(
  MainStackNavigator
);
