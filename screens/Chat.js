import React, { Component } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  Keyboard,
  Text,
  AsyncStorage
} from "react-native";

import ServerURL from "../utility/ServerURL";
import axios from "axios";

import uuidv1 from "uuid/v1";
import KeyboardSpacer from "react-native-keyboard-spacer";

const CollectionsList = require("collections/list");

import MessageManager from "../components/message/MessageManager";

import Waiting from "../components/Inputs/Waiting";
import Buttons from "../components/Inputs/Buttons";
import TextBox from "../components/Inputs/TextBox";
import Recording from "../components/Inputs/Recording";

export default class Chat extends Component {
  constructor(props) {
    super(props);

    this.userName = "";

    this.scriptObject = {};

    this.sentiment = "";
    this.event = "";
    this.day = 0;
    this.contentCount = 0;

    this.sentimentText = "";
    this.eventText = "";

    this.meditationTexts = new CollectionsList();
    this.audioFileNames = new CollectionsList();

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

    this.inputTypes = {
      button: this.modeEnum.button,
      text: this.modeEnum.text
    };

    this.messageTypeEnum = {
      service: 0,
      user: 1
    };

    this.state = {
      follow: this.followEnum.none,
      mode: this.modeEnum.text,
      level: 0,
      waitingText: "",

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

  _changeScriptText(scriptObject, mark, newText) {
    let length = scriptObject.endLevel + 1;
    for (var i = 0; i < length; i++) {
      const messages = scriptObject[i].messages;
      for (var j = 0; j < messages.length; j++) {
        const s = messages[j]
          .split(mark)
          .join(newText);
        messages[j] = s;
      }
    }
  }

  async callServer(url, parameter) {
    let result = null;

    try {
      result = await axios.post(
        ServerURL + url,
        parameter,
        { timeout: 2000 }
      );
    } catch (err) {
      console.log("script get error");
    }

    return result.data;
  }

  async changeScriptObject(p) {
    this.scriptObject = await this.callServer(
      "script/get",
      p
    );

    if (p.scriptType === "contents") {
      this.contentCount += 1;
    }

    this._changeScriptText(
      this.scriptObject,
      "@@",
      this.userName
    );

    if (this.sentimentText != "") {
    }
    if (this.eventText != "") {
    }
  }

  async componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow.bind(this)
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide.bind(this)
    );

    this.userName = await AsyncStorage.getItem(
      "name"
    );

    await this.changeScriptObject({
      scriptType: "openings",
      day: this.day
    });

    const serviceMessageId = uuidv1();
    const serviceObject = {
      [serviceMessageId]: {
        id: serviceMessageId,
        type: this.messageTypeEnum.service,
        isComplete: false,
        texts: this.scriptObject[0].messages,
        delays: this.scriptObject[0].delays,
        gif: this.scriptObject[0].gif
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
                  isRecordingCheck={
                    message.isRecordingCheck
                  }
                  audioFileName={
                    message.audioFileName
                  }
                  gif={message.gif}
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
    let nextWaitingText = "";

    if (follow == this.followEnum.main) {
      const inputType = this.scriptObject[level]
        .inputType;
      nextMode = this.inputTypes[inputType];
    }

    this.setState({
      follow: nextFollow,
      mode: nextMode,
      level: nextLevel,
      waitingText: nextWaitingText
    });
  };

  _pushedInputBlock = async (index, text) => {
    const { follow, mode, level } = this.state;

    let nextFollow = follow;
    let nextMode = this.modeEnum.wait;
    let nextLevel = level;
    let isPlayback = null;
    let isRecordingCheck = null;
    let audioFileName = null;
    let focusedIndex = null;

    if (follow == this.followEnum.main) {
      // messages change
      const changeMessages = this.scriptObject[
        level
      ].changeMessages;
      if (changeMessages != undefined) {
        const mark = changeMessages.mark;
        const newText =
          changeMessages.newTexts[index];
        this._changeScriptText(
          this.scriptObject,
          mark,
          newText
        );
      }

      // buttonTexts change
      const changeButtonTexts = this.scriptObject[
        level
      ].changeButtonTexts;
      if (changeButtonTexts != undefined) {
        const newButtonTexts =
          changeButtonTexts[index];
        const targetLevel =
          changeButtonTexts.targetLevel;
        this.scriptObject[
          targetLevel
        ].buttonTexts = newButtonTexts;
      }

      // branch
      const branch = this.scriptObject[level]
        .branch;
      if (branch != undefined) {
        const number = branch.number;
        if (number == 0) {
          this.sentiment = branch[index];
        } else if (number == 1) {
          this.event = branch[index];
        }
      }

      // saveSentimentText
      const saveSentimentText = this.scriptObject[
        level
      ].saveSentimentText;
      if (saveSentimentText) {
        this.sentimentText = text;
      }

      // saveEventText
      const saveEventText = this.scriptObject[
        level
      ].saveEventText;
      if (saveEventText) {
        this.eventText = text;
      }

      // changeSentimentText
      const changeSentimentText = this
        .scriptObject[level].changeSentimentText;
      if (changeSentimentText != undefined) {
        const mark = changeSentimentText.mark;
        this._changeScriptText(
          this.scriptObject,
          mark,
          this.sentimentText
        );
      }

      // changeEventText
      const changeEventText = this.scriptObject[
        level
      ].changeEventText;
      if (changeEventText != undefined) {
        const mark = changeEventText.mark;
        this._changeScriptText(
          this.scriptObject,
          mark,
          this.eventText
        );
      }

      const endLevel = this.scriptObject.endLevel;
      if (level < endLevel) {
        nextLevel += 1;
        const recordingText = this.scriptObject[
          level
        ].recordingText;
        if (recordingText) {
          this.meditationTexts.add(recordingText);
          this.props.navigation.navigate(
            "recording_modal",
            {
              script: recordingText,
              _scrollToEnd: this._scrollToEnd,
              _record: this._record
            }
          );
          return;
        }
      } else if (level == endLevel) {
        const meditation = this.scriptObject[
          level
        ].meditation;
        if (meditation) {
          this.props.navigation.navigate(
            "meditation",
            {
              audioFileNames: this.audioFileNames,
              texts: this.meditationTexts.toArray()
            }
          );
          return;
        }

        await this.changeScriptObject({
          scriptType: "contents",
          sentiment: this.sentiment,
          event: this.event,
          day: this.day,
          contentCount: this.contentCount
        });

        nextLevel = 0;
      }
    }

    this._makeMessages(
      text,
      nextFollow,
      nextMode,
      nextLevel,
      isPlayback,
      isRecordingCheck,
      audioFileName,
      focusedIndex
    );
  };
  _sendText = async text => {
    const { follow, mode, level } = this.state;

    let nextFollow = follow;
    let nextMode = this.modeEnum.wait;
    let nextLevel = level;

    // changeSentimentText
    const changeSentimentText = this.scriptObject[
      level
    ].changeSentimentText;
    if (changeSentimentText != undefined) {
      const mark = changeSentimentText.mark;
      this._changeScriptText(
        this.scriptObject,
        mark,
        this.sentimentText
      );
    }

    // changeEventText
    const changeEventText = this.scriptObject[
      level
    ].changeEventText;
    if (changeEventText != undefined) {
      const mark = changeEventText.mark;
      this._changeScriptText(
        this.scriptObject,
        mark,
        this.eventText
      );
    }

    if (follow == this.followEnum.main) {
      const endLevel = this.scriptObject.endLevel;
      if (level < endLevel) {
        nextLevel += 1;
      } else if (level == endLevel) {
        await this.changeScriptObject({
          scriptType: "contents",
          sentiment: this.sentiment,
          event: this.event,
          day: this.day,
          contentCount: this.contentCount
        });

        nextLevel = 0;
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

    this.audioFileName = fileName;

    let nextFollow = follow;
    let nextMode = this.modeEnum.wait;
    let nextLevel = level;

    if (follow == this.followEnum.main) {
      const endLevel = this.scriptObject.endLevel;
      if (level < endLevel) {
        nextLevel += 1;
        this.audioFileNames.add(fileName);
      }
    }

    this._makeMessages(
      "-",
      nextFollow,
      nextMode,
      nextLevel,
      true,
      false,
      fileName
    );
  };

  _makeMessages(
    userText,
    nextFollow,
    nextMode,
    nextLevel,
    isRecordingCheck,
    isPlayback,
    audioFileName,
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
        isRecordingCheck,
        isPlayback,
        audioFileName,
        focusedIndex
      }
    };

    const serviceMessageId = uuidv1();
    const serviceObject = {
      [serviceMessageId]: {
        id: serviceMessageId,
        type: this.messageTypeEnum.service,
        isComplete: false,
        texts: this.scriptObject[nextLevel]
          .messages,
        delays: this.scriptObject[nextLevel]
          .delays,
        isRecordingCheck,
        isPlayback,
        audioFileName,
        focusedIndex,
        gif: this.scriptObject[nextLevel].gif
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
    const {
      follow,
      mode,
      level,
      waitingText
    } = this.state;

    if (follow == this.followEnum.none) {
      return <View />;
    }

    if (mode == this.modeEnum.none) {
      return <View />;
    } else if (mode == this.modeEnum.wait) {
      return (
        <Waiting
          script={
            this.scriptObject[level].buttonTexts
          }
          level={level}
          waitingText={waitingText}
          _scrollToEnd={this._scrollToEnd}
        />
      );
    } else if (mode == this.modeEnum.button) {
      return (
        <Buttons
          script={
            this.scriptObject[level].buttonTexts
          }
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
