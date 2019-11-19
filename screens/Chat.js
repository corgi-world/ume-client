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

    this.userID = "";
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

      messages: {}
    };

    this.isUnmount = false;
  }

  _backup = async () => {
    if (this.contentCount > 0) {
      let backup = {
        day: this.day,
        scriptObject: this.scriptObject,
        sentiment: this.sentimentText,
        event: this.event,
        contentCount: this.contentCount,
        sentimentText: this.sentimentText,
        eventText: this.eventText,
        meditationTexts: this.meditationTexts,
        audioFileNames: this.audioFileNames,
        state: this.state
      };

      const s = JSON.stringify(backup);
      await AsyncStorage.setItem("backup", s);
    }
  };

  _restore = async backup => {
    const obj = JSON.parse(backup);
    this.day = obj.day;
    this.scriptObject = obj.scriptObject;
    this.sentiment = obj.sentiment;
    this.event = obj.event;
    this.contentCount = obj.contentCount;
    this.sentimentText = obj.sentimentText;
    this.eventText = obj.eventText;

    const mts = obj.meditationTexts;
    this.meditationTexts = new CollectionsList();
    for (var i = 0; i < mts.length; i++) {
      this.meditationTexts.add(mts[i]);
    }

    const fns = obj.audioFileNames;
    this.audioFileNames = new CollectionsList();
    for (var i = 0; i < fns.length; i++) {
      this.audioFileNames.add(fns[i]);
    }

    this.setState({
      follow: obj.state.follow,
      mode: obj.state.mode,
      level: obj.state.level,

      messages: obj.state.messages
    });
  };

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

  async callServer(url, parameter, log) {
    let result = null;

    try {
      result = await axios.post(
        ServerURL + url,
        parameter,
        { timeout: 2000 }
      );
    } catch (err) {
      console.log(log);
    }

    return result.data;
  }

  async changeScriptObject(p) {
    this.scriptObject = await this.callServer(
      "script/get",
      p,
      "script error"
    );

    if (p.scriptType === "contents") {
      this.contentCount += 1;
    }

    this._changeScriptText(
      this.scriptObject,
      "@@",
      this.userName
    );

    // changeSentimentText
    this.changeSentimentTexts(0);

    // changeEventText
    this.changeEventTexts(0);
  }

  changeSentimentTexts(level) {
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
  }
  changeEventTexts(level) {
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

    this.day = await AsyncStorage.getItem("day");
    if (this.day == null) this.day = 0;

    this.userID = await AsyncStorage.getItem(
      "id"
    );
    this.userName = await AsyncStorage.getItem(
      "name"
    );

    const backup = null;

    if (backup == null) {
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
    } else {
      this._restore(backup);
    }
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
    // this._backup();

    const { follow, mode, level } = this.state;

    let nextFollow = follow;
    let nextMode = mode;
    let nextLevel = level;

    if (follow == this.followEnum.main) {
      const inputType = this.scriptObject[level]
        .inputType;
      nextMode = this.inputTypes[inputType];
    }

    this.setState({
      follow: nextFollow,
      mode: nextMode,
      level: nextLevel
    });
  };

  async _saveInput(type, text) {
    const obj = {};
    obj.id = this.userID;
    obj.name = this.userName;
    obj.day = this.day;
    obj.sentimentText = this.sentimentText;
    obj.eventText = this.eventText;
    obj.type = type;
    obj.text = text;
    await this.callServer(
      "saveInput",
      obj,
      "save Input error"
    );
  }

  _pushedInputBlock = async (index, text) => {
    this._saveInput("button", text);

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
      if (saveSentimentText != undefined) {
        this.sentimentText =
          saveSentimentText[text];
      }

      // saveEventText
      const saveEventText = this.scriptObject[
        level
      ].saveEventText;
      if (saveEventText) {
        this.eventText = text;
      }

      // changeSentimentText
      this.changeSentimentTexts(level);

      // changeEventText
      this.changeEventTexts(level);

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
              id: this.userID,
              name: this.userName,
              day: this.day,
              sentimentText: this.sentimentText,
              eventText: this.eventText,
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
              texts: this.meditationTexts.toArray(),
              day: this.day
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
    this._saveInput("text", text);

    const { follow, mode, level } = this.state;

    let nextFollow = follow;
    let nextMode = this.modeEnum.wait;
    let nextLevel = level;

    // messages change
    const changeMessages = this.scriptObject[
      level
    ].changeMessages;
    if (changeMessages != undefined) {
      const mark = changeMessages.mark;
      const newText = text;
      this._changeScriptText(
        this.scriptObject,
        mark,
        newText
      );
    }

    // recordingText change
    const changeRecordingText = this.scriptObject[
      level
    ].changeRecordingText;
    if (changeRecordingText != undefined) {
      const newRecordingText = text;
      const targetLevel =
        changeRecordingText.targetLevel;
      const mark = changeRecordingText.mark;

      const s = this.scriptObject[
        targetLevel
      ].recordingText
        .split(mark)
        .join(newRecordingText);
      this.scriptObject[
        targetLevel
      ].recordingText = s;
    }

    // changeSentimentText
    this.changeSentimentTexts(level);

    // changeEventText
    this.changeEventTexts(level);

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
    const { follow, mode, level } = this.state;

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
