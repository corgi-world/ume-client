import React, { Component } from "react";
import { View, Text } from "react-native";

import uuidv1 from "uuid/v1";

import ServiceMessage from "./ServiceMessage";
import UserMessage from "./UserMessage";

export default class MessageManager extends Component {
  constructor(props) {
    super(props);

    this.isUnmount = false;

    this.messageTypeEnum = {
      service: 0,
      user: 1
    };

    this.state = {
      messages: {}
    };
  }

  componentDidMount() {
    const isComplete = this.props.isComplete;
    const {
      type,
      texts,
      delays,
      isPlayback,
      playbackFileName
    } = this.props;
    const length = texts.length;

    if (isComplete) {
      let objects = {};
      for (var i = 0; i < length; i++) {
        let id = uuidv1();
        let isFirst = i === 0;
        let object = {
          id: id,
          index: i,
          type,
          isWait: false,
          isFirst,
          text: texts[i],
          delay: 0,
          isPlayback,
          playbackFileName
        };

        objects[id] = object;
        this.setState({ messages: objects });
      }
    } else {
      let objects = {};
      let id = uuidv1();
      let object = {
        id: id,
        index: 0,
        type,
        isWait: true,
        isFirst: true,
        text: texts[0],
        delay: delays[0],
        isPlayback,
        playbackFileName
      };
      objects[id] = object;
      this.setState({ messages: objects });
    }
  }

  componentWillUnmount() {
    this.isUnmount = true;
  }

  _update(index) {
    if (this.isUnmount) return;

    const {
      id,
      type,
      texts,
      delays
    } = this.props;
    const length = texts.length;
    let level = index + 1;

    if (level < length) {
      let id = uuidv1();
      let object = {
        [id]: {
          id: id,
          index: level,
          type,
          isWait: true,
          isFirst: false,
          text: texts[level],
          delay: delays[level]
        }
      };

      this.setState(prevState => {
        const newState = {
          ...prevState,
          messages: {
            ...prevState.messages,
            ...object
          }
        };

        return { ...newState };
      });
    } else if (level === length) {
      this.props._updateComplete(id);
    }
  }

  render() {
    return (
      <View>
        {Object.values(this.state.messages).map(
          message => {
            if (
              message.type ===
              this.messageTypeEnum.service
            ) {
              return (
                <ServiceMessage
                  key={message.id}
                  index={message.index}
                  _update={this._update.bind(
                    this
                  )}
                  isWait={message.isWait}
                  isFirst={message.isFirst}
                  text={message.text}
                  delay={message.delay}
                  _isFocused={
                    this.props._isFocusedIndex ==
                    message.index
                  }
                />
              );
            } else {
              return (
                <UserMessage
                  key={message.id}
                  index={message.index}
                  _update={this._update.bind(
                    this
                  )}
                  isWait={message.isWait}
                  isFirst={message.isFirst}
                  text={message.text}
                  delay={message.delay}
                  isPlayback={message.isPlayback}
                  playbackFileName={
                    message.playbackFileName
                  }
                />
              );
            }
          }
        )}
      </View>
    );
  }
}
