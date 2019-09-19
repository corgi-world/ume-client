import React, { Component } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  Keyboard,
  Text
} from "react-native";

import uuidv1 from "uuid/v1";
import KeyboardSpacer from "react-native-keyboard-spacer";

import {
  MessageScript,
  Delay,
  ButtonScript
} from "../scripts/Scripts";

import MessageManager from "../components/message/MessageManager";

import Waiting from "../components/Inputs/Waiting";
import Buttons from "../components/Inputs/Buttons";
import TextBox from "../components/Inputs/TextBox";
import Recording from "../components/Inputs/Recording";

export default class Chat extends Component {
  constructor(props) {
    super(props);

    this.followEnum = {
      none: 0,
      main: 1
    };

    this.modeEnum = {
      none: 0,
      wait: 1,
      button: 2,
      text: 3,
      record: 4
    };

    this.messageTypeEnum = {
      service: 0,
      user: 1
    };

    this.state = {
      follow: this.followEnum.none,
      mode: this.modeEnum.text,
      level: 0,

      messages: {}
    };

    this.isUnmount = false;
  }

  _scrollToEnd = () => {
    if (this.isUnmount) {
      return;
    }
    this.scroll.scrollToEnd({ animated: true });
  };
  _keyboardDidShow() {
    this._scrollToEnd();
  }
  _keyboardDidHide() {
    this._scrollToEnd();
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow.bind(this)
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide.bind(this)
    );

    const serviceMessageId = uuidv1();
    const serviceObject = {
      [serviceMessageId]: {
        id: serviceMessageId,
        type: this.messageTypeEnum.service,
        isComplete: false,
        texts: MessageScript[0],
        delays: Delay[0]
      }
    };

    this.setState(prevState => {
      const newState = {
        ...prevState,
        follow: this.followEnum.main,
        mode: this.modeEnum.wait,
        level: 0,
        messages: {
          ...prevState.messages,
          ...serviceObject
        }
      };

      return { ...newState };
    });
  }

  componentWillUnmount() {
    this.isUnmount = true;

    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <SafeAreaView
          style={{
            flex: 1
          }}
        >
          <ScrollView
            ref={scroll => {
              this.scroll = scroll;
            }}
            style={{
              flex: 1,
              backgroundColor: "white"
            }}
            onContentSizeChange={() => {
              this._scrollToEnd();
            }}
            onScroll={event => {}}
            onScrollEndDrag={event => {}}
            scrollEventThrottle={160}
          >
            {Object.values(
              this.state.messages
            ).map(message => {
              return (
                <MessageManager
                  key={message.id}
                  id={message.id}
                  type={message.type}
                  isComplete={message.isComplete}
                  texts={message.texts}
                  delays={message.delays}
                  _updateComplete={this._updateComplete.bind(
                    this
                  )}
                  focusedIndex={
                    message.focusedIndex
                  }
                  isPlayback={message.isPlayback}
                  playbackFileName={
                    message.playbackFileName
                  }
                />
              );
            })}
          </ScrollView>
          {this._makeInput()}
        </SafeAreaView>
        <KeyboardSpacer />
      </View>
    );
  }

  _updateComplete = async id => {
    const { follow, mode, level } = this.state;

    let nextFollow = follow;
    let nextMode = mode;
    let nextLevel = level;

    if (follow == this.followEnum.main) {
      if (level == 0) {
        nextMode = this.modeEnum.text;
      } else if (level == 1) {
        nextMode = this.modeEnum.button;
      } else if (level == 2) {
        nextMode = this.modeEnum.record;
      } else if (level == 3) {
        nextFollow = this.followEnum.end;
        nextMode = this.modeEnum.none;
      }
    }

    this.setState({
      follow: nextFollow,
      mode: nextMode,
      level: nextLevel
    });
  };

  _pushedInputBlock = async (index, text) => {
    const { follow, mode, level } = this.state;

    let nextFollow = follow;
    let nextMode = mode;
    let nextLevel = level;

    if (follow == this.followEnum.main) {
      if (level == 1) {
        nextMode = this.modeEnum.wait;
        nextLevel = level + 1;
      }
    }

    this._makeMessages(
      text,
      nextFollow,
      nextMode,
      nextLevel,
      null,
      null,
      0
    );
  };
  _sendText = async text => {
    const { follow, mode, level } = this.state;

    let nextFollow = follow;
    let nextMode = mode;
    let nextLevel = level;

    if (follow == this.followEnum.main) {
      if (level == 0) {
        nextMode = this.modeEnum.wait;
        nextLevel = level + 1;
      }
    }

    this._makeMessages(
      text,
      nextFollow,
      nextMode,
      nextLevel
    );
  };
  _record = async fileName => {
    const { follow, mode, level } = this.state;

    let nextFollow = follow;
    let nextMode = mode;
    let nextLevel = level;

    if (follow == this.followEnum.main) {
      if (level == 2) {
        nextMode = this.modeEnum.wait;
        nextLevel = level + 1;
      }
    }

    this._makeMessages(
      "-",
      nextFollow,
      nextMode,
      nextLevel,
      true,
      fileName
    );
  };

  _makeMessages(
    userText,
    nextFollow,
    nextMode,
    nextLevel,
    isPlayback,
    playbackFileName,
    focusedIndex
  ) {
    const userMessageId = uuidv1();
    const userObject = {
      [userMessageId]: {
        id: userMessageId,
        type: this.messageTypeEnum.user,
        isComplete: true,
        texts: [userText],
        delays: 0,
        isPlayback,
        playbackFileName
      }
    };

    const serviceMessageId = uuidv1();
    const serviceObject = {
      [serviceMessageId]: {
        id: serviceMessageId,
        type: this.messageTypeEnum.service,
        isComplete: false,
        texts: MessageScript[nextLevel],
        delays: Delay[nextLevel],
        focusedIndex
      }
    };

    this.setState(prevState => {
      const newState = {
        ...prevState,
        follow: nextFollow,
        mode: nextMode,
        level: nextLevel,
        messages: {
          ...prevState.messages,
          ...userObject,
          ...serviceObject
        }
      };

      return { ...newState };
    });
  }

  _makeInput() {
    const { follow, mode, level } = this.state;

    if (follow == this.followEnum.end) {
      return <View />;
    }

    if (mode == this.modeEnum.none) {
      return <View />;
    } else if (mode == this.modeEnum.wait) {
      return (
        <Waiting
          script={ButtonScript[level]}
          level={level}
          _scrollToEnd={this._scrollToEnd}
        />
      );
    } else if (mode == this.modeEnum.button) {
      return (
        <Buttons
          script={ButtonScript[level]}
          _pushedInputBlock={
            this._pushedInputBlock
          }
          _scrollToEnd={this._scrollToEnd}
        />
      );
    } else if (mode == this.modeEnum.text) {
      return (
        <TextBox
          _scrollToEnd={this._scrollToEnd}
          _sendText={this._sendText}
        />
      );
    } else if (mode == this.modeEnum.record) {
      return (
        <Recording
          _scrollToEnd={this._scrollToEnd}
          _record={this._record}
        />
      );
    }
  }
}
