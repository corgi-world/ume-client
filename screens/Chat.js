import React, { Component } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  Keyboard,
  Text,
  AsyncStorage
} from "react-native";

import uuidv1 from "uuid/v1";
import KeyboardSpacer from "react-native-keyboard-spacer";

import CommonScript from "../scripts/CommonScript";
import RelationsScript from "../scripts/RelationsScript";
import WorkplaceScript from "../scripts/WorkplaceScript";

import MessageManager from "../components/message/MessageManager";

import Waiting from "../components/Inputs/Waiting";
import Buttons from "../components/Inputs/Buttons";
import TextBox from "../components/Inputs/TextBox";
import Recording from "../components/Inputs/Recording";

export default class Chat extends Component {
  constructor(props) {
    super(props);

    this.script = CommonScript;

    this.meditationText = null;
    this.audioFileName = null;

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

  _changeScriptsText(mark, newText) {
    let script1 = CommonScript.MessageScript;
    let startIndex1 = script1.startIndex;
    let length1 =
      script1.startIndex + script1.length;
    for (var i = startIndex1; i < length1; i++) {
      for (
        var j = 0;
        j < script1[i].length;
        j++
      ) {
        const s = script1[i][j]
          .split(mark)
          .join(newText);
        script1[i][j] = s;
      }
    }

    let script2 = WorkplaceScript.MessageScript;
    let startIndex2 = script2.startIndex;
    let length2 =
      script2.startIndex + script2.length;
    for (var i = startIndex2; i < length2; i++) {
      for (
        var j = 0;
        j < script2[i].length;
        j++
      ) {
        const s = script2[i][j]
          .split(mark)
          .join(newText);
        script2[i][j] = s;
      }
    }
  }

  _checkGifIndex(script) {
    for (var i = 0; i < script.length; i++) {
      let text = script[i];
      let isGif = text.includes("**");
      if (isGif) {
        return i;
      }
    }

    return null;
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

    const name = await AsyncStorage.getItem(
      "name"
    );
    this._changeScriptsText("@@", name);

    let gifIndex = this._checkGifIndex(
      this.script.MessageScript[0]
    );

    const serviceMessageId = uuidv1();
    const serviceObject = {
      [serviceMessageId]: {
        id: serviceMessageId,
        type: this.messageTypeEnum.service,
        isComplete: false,
        texts: this.script.MessageScript[0],
        delays: this.script.Delay[0],
        gifIndex
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
                  gifIndex={message.gifIndex}
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
      if (level == 0) {
        nextMode = this.modeEnum.button;
      } else if (level == 1) {
        nextMode = this.modeEnum.text;
      } else if (level == 2) {
        nextMode = this.modeEnum.button;
      } else if (level == 3) {
        nextMode = this.modeEnum.button;
      } else if (level == 4) {
        nextMode = this.modeEnum.button;
      } else if (level == 5) {
        nextMode = this.modeEnum.button;
      } else if (level == 6) {
        nextMode = this.modeEnum.button;
      } else if (level == 7) {
        nextMode = this.modeEnum.button;
      } else if (level == 8) {
        nextMode = this.modeEnum.button;
      } else if (level == 9) {
        nextMode = this.modeEnum.text;
      } else if (level == 10) {
        nextMode = this.modeEnum.text;
      } else if (level == 11) {
        nextMode = this.modeEnum.button;
      } else if (level == 12) {
        nextMode = this.modeEnum.button;
      } else if (level == 13) {
        nextMode = this.modeEnum.button;
      } else if (level == 14) {
        nextMode = this.modeEnum.button;
      } else if (level == 15) {
        nextMode = this.modeEnum.record;
      } else if (level == 16) {
        nextMode = this.modeEnum.text;
      } else if (level == 17) {
        nextMode = this.modeEnum.button;
      } else if (level == 18) {
        nextMode = this.modeEnum.button;
      } else if (level == 19) {
        nextMode = this.modeEnum.button;
      } else if (level == 20) {
        nextMode = this.modeEnum.button;
      } else if (level == 21) {
        nextMode = this.modeEnum.button;
      } else if (level == 22) {
        nextMode = this.modeEnum.record;
      } else if (level == 23) {
        nextMode = this.modeEnum.text;
      } else if (level == 24) {
        nextMode = this.modeEnum.text;
      } else if (level == 25) {
        nextMode = this.modeEnum.button;
      }
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
    let nextMode = mode;
    let nextLevel = level;
    let isPlayback = null;
    let isRecordingCheck = null;
    let audioFileName = null;
    let focusedIndex = null;

    if (follow == this.followEnum.main) {
      nextMode = this.modeEnum.wait;
      nextLevel = level + 1;

      if (level == 8) {
        let feel =
          CommonScript.ButtonScript[text];
        this._changeScriptsText("##", feel);
      }

      /*
      if (nextLevel == 100) {
        console.log(this.audioFileName);
        this.props.navigation.navigate(
          "meditation",
          {
            audioFileName: this.audioFileName,
            text: this.meditationText
          }
        );
        return;
      }*/
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
    let nextMode = mode;
    let nextLevel = level;

    if (follow == this.followEnum.main) {
      nextMode = this.modeEnum.wait;
      nextLevel = level + 1;
      if (level == 9) {
        let keyword = "";
        if (text.includes("학업")) {
          keyword = "학업 스트레스";
          this.script = WorkplaceScript;
        } else if (text.includes("대인")) {
          keyword = "대인 관계";
          this.script = WorkplaceScript;
        } else if (text.includes("취업")) {
          keyword = "취업 스트레스";
          this.script = WorkplaceScript;
        } else {
          keyword = "직장 스트레스";
          this.script = WorkplaceScript;
        }

        this._changeScriptsText("$$", keyword);
      } else if (level == 24) {
        const iam = text;
        this._changeScriptsText("%%", iam);
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
    let nextMode = mode;
    let nextLevel = level;

    if (follow == this.followEnum.main) {
      nextMode = this.modeEnum.wait;
      nextLevel = level + 1;
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

    let gifIndex = this._checkGifIndex(
      this.script.MessageScript[nextLevel]
    );

    const serviceMessageId = uuidv1();
    const serviceObject = {
      [serviceMessageId]: {
        id: serviceMessageId,
        type: this.messageTypeEnum.service,
        isComplete: false,
        texts: this.script.MessageScript[
          nextLevel
        ],
        delays: this.script.Delay[nextLevel],
        isRecordingCheck,
        isPlayback,
        audioFileName,
        focusedIndex,
        gifIndex
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
          script={this.script.ButtonScript[level]}
          level={level}
          waitingText={waitingText}
          _scrollToEnd={this._scrollToEnd}
        />
      );
    } else if (mode == this.modeEnum.button) {
      return (
        <Buttons
          script={this.script.ButtonScript[level]}
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
