import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ScrollView,
  Platform
} from "react-native";

import * as Font from "expo-font";

import { Asset } from "expo-asset";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions";

import uuidv1 from "uuid/v1";

import _Gif from "../components/message/_GIF";

import { isIphoneX } from "react-native-iphone-x-helper";

const { width, height } = Dimensions.get(
  "window"
);

class Icon {
  constructor(module, width, height) {
    this.module = module;
    this.width = width;
    this.height = height;
    Asset.fromModule(this.module).downloadAsync();
  }
}

const ICON_RECORD_BUTTON_1 = new Icon(
  require("../assets/images/record_button_1.png"),
  50,
  50
);
const ICON_RECORD_BUTTON_2 = new Icon(
  require("../assets/images/record_button_2.png"),
  50,
  50
);

const ICON_RECORDING = new Icon(
  require("../assets/images/record_icon.png"),
  20,
  14
);

const BACKGROUND_COLOR = "#FFFFFF";

import ServerURL from "../utility/ServerURL";
import axios from "axios";

export default class Recording extends React.Component {
  constructor(props) {
    super(props);
    this.recording = null;
    this.sound = null;
    this.isSeeking = false;
    this.shouldPlayAtEndOfSeek = false;
    this.state = {
      haveRecordingPermissions: false,
      isLoading: false,
      muted: false,
      recordingDuration: null,
      isRecording: false,
      fontLoaded: false,
      shouldCorrectPitch: true,
      volume: 1.0,
      rate: 1.0
    };
    this.recordingSettings = JSON.parse(
      JSON.stringify(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      )
    );
    // // UNCOMMENT THIS TO TEST maxFileSize:
    // this.recordingSettings.android['maxFileSize'] = 12000;
  }

  componentDidMount() {
    /*
    const params = this.props.navigation.state.params;
    setTimeout(() => {
      this.props._scrollToEnd();
    }, 150);*/

    (async () => {
      await Font.loadAsync({
        NanumSquareRegular: require("../assets/fonts/NanumSquareRegular.ttf")
      });
      this.setState({ fontLoaded: true });
    })();

    this._askForPermissions();
  }

  _askForPermissions = async () => {
    const response = await Permissions.askAsync(
      Permissions.AUDIO_RECORDING
    );
    this.setState({
      haveRecordingPermissions:
        response.status === "granted"
    });
  };

  _updateScreenForRecordingStatus = status => {
    if (status.canRecord) {
      this.setState({
        isRecording: status.isRecording,
        recordingDuration: status.durationMillis
      });
    } else if (status.isDoneRecording) {
      this.setState({
        isRecording: false,
        recordingDuration: status.durationMillis
      });
      if (!this.state.isLoading) {
        this._stopRecordingAndEnablePlayback();
      }
    }
  };

  async _stopPlaybackAndBeginRecording() {
    this.setState({
      isLoading: true
    });
    if (this.sound !== null) {
      await this.sound.unloadAsync();
      this.sound.setOnPlaybackStatusUpdate(null);
      this.sound = null;
    }
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS:
        Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid:
        Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true
    });
    if (this.recording !== null) {
      this.recording.setOnRecordingStatusUpdate(
        null
      );
      this.recording = null;
    }

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(
      this.recordingSettings
    );
    recording.setOnRecordingStatusUpdate(
      this._updateScreenForRecordingStatus
    );

    this.recording = recording;
    await this.recording.startAsync(); // Will call this._updateScreenForRecordingStatus to update the screen.
    this.setState({
      isLoading: false
    });
  }

  async _stopRecordingAndEnablePlayback() {
    this.setState({
      isLoading: true
    });
    try {
      await this.recording.stopAndUnloadAsync();
    } catch (error) {
      // Do nothing -- we are already unloaded.
    }

    const info = await FileSystem.getInfoAsync(
      this.recording.getURI()
    );

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS:
        Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      playsInSilentLockedModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid:
        Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true
    });
    const {
      sound,
      status
    } = await this.recording.createNewLoadedSoundAsync(
      {
        isLooping: true,
        isMuted: this.state.muted,
        volume: this.state.volume,
        rate: this.state.rate,
        shouldCorrectPitch: this.state
          .shouldCorrectPitch
      }
    );

    const fileName = await this._saveRecording(
      info.uri,
      status
    );

    this.setState({
      isLoading: false
    });

    if (fileName != null) {
      const params = this.props.navigation.state
        .params;
      params._record(fileName);
      this.props.navigation.navigate("chat");
    }
  }

  _toDateString(date) {
    const s =
      date.getFullYear() +
      "" +
      this._pad(date.getMonth() + 1, 2) +
      "" +
      this._pad(date.getDate(), 2) +
      "-" +
      this._pad(date.getHours(), 2) +
      "" +
      this._pad(date.getMinutes(), 2) +
      "" +
      this._pad(date.getSeconds(), 2);
    return s;
  }
  _pad(n, width) {
    n = n + "";
    return n.length >= width
      ? n
      : new Array(width - n.length + 1).join(
          "0"
        ) + n;
  }

  _saveRecording = async (file, status) => {
    const data = new FormData();
    let cleanFile = "";
    let fileType = "";
    let extString = "";

    if (Platform.OS == "android") {
      cleanFile = file;

      extString = ".caf";
      fileType = "audio/caf";
    } else {
      cleanFile = file.replace("file://", "");

      extString = ".caf";
      fileType = "audio/caf";
    }

    console.log(cleanFile);

    const params = this.props.navigation.state
      .params;

    const fileName =
      params.id +
      "-" +
      "day" +
      params.day +
      "-" +
      uuidv1();

    data.append("audio", {
      name: fileName + extString,
      type: fileType,
      uri: cleanFile
    });

    data.append("fileName", fileName);
    data.append(
      "fileTime",
      this._getMMSSFromMillis(
        status.durationMillis
      )
    );

    data.append("id", params.id);
    data.append("name", params.name);
    data.append("day", params.day);
    data.append(
      "sentimentText",
      params.sentimentText
    );
    data.append("eventText", params.eventText);
    data.append("recordingText", params.script);

    try {
      await axios.post(ServerURL + "save", data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data"
        }
      });

      return fileName + extString;
    } catch (error) {
      console.log(error);

      return null;
    }
  };

  _onRecordPressed = () => {
    if (this.state.isRecording) {
      this._stopRecordingAndEnablePlayback();
    } else {
      this._stopPlaybackAndBeginRecording();
    }
  };

  _getMMSSFromMillis(millis) {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);

    const padWithZero = number => {
      const string = number.toString();
      if (number < 10) {
        return "0" + string;
      }
      return string;
    };
    return (
      padWithZero(minutes) +
      ":" +
      padWithZero(seconds)
    );
  }

  _getRecordingTimestamp() {
    if (this.state.recordingDuration != null) {
      return `${this._getMMSSFromMillis(
        this.state.recordingDuration
      )}`;
    }
    return `${this._getMMSSFromMillis(0)}`;
  }

  render() {
    const params = this.props.navigation.state
      .params;
    const script = params.script;

    const micHeight = 130;
    let top = 0;

    if (isIphoneX()) {
      top = height / 6;
    } else {
      top = 40;
    }

    const scriptHeigth =
      height - top * 2 - micHeight;
    const horizontalRate = 6;
    const left = width / (horizontalRate * 2);

    const gifFileName = params.gifFileName;

    const isGif = params.isGif;

    if (!this.state.haveRecordingPermissions) {
      return (
        <View style={{ flex: 1 }}>
          <Text>
            You must enable audio recording
            permissions in order to use this app.
          </Text>
        </View>
      );
    }

    if (!this.state.fontLoaded) {
      return <View></View>;
    }

    return (
      <View>
        <View
          style={{
            width,
            height,
            backgroundColor: "black",
            opacity: 0.7
          }}
        ></View>
        <View
          style={{
            width: width - width / horizontalRate,
            height: scriptHeigth,
            backgroundColor: "white",
            position: "absolute",
            left,
            top,
            zIndex: 5,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 30
          }}
        >
          <View style={{ padding: 15 }}>
            {/*
            <Text
              style={{
                fontSize: 18,
                textAlign: "center"
              }}
            >
              {script}
            </Text>
            */}
            {isGif ? (
              <_Gif
                gifFileName={gifFileName}
                _maxWidth={
                  width - width / horizontalRate
                }
              />
            ) : (
              <Text
                style={{
                  fontSize: 16,
                  textAlign: "center",
                  fontFamily: "NanumSquareRegular"
                }}
              >
                {script}
              </Text>
            )}
          </View>
        </View>

        <View
          style={{
            width: width,
            height: micHeight,
            backgroundColor: "white",
            position: "absolute",
            left: 0,
            bottom: 0,
            zIndex: 5,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <TouchableHighlight
            underlayColor={BACKGROUND_COLOR}
            onPress={this._onRecordPressed}
            disabled={this.state.isLoading}
          >
            <Image
              style={{ width: 70, height: 70 }}
              source={
                this.state.isRecording
                  ? ICON_RECORD_BUTTON_2.module
                  : ICON_RECORD_BUTTON_1.module
              }
            />
          </TouchableHighlight>
          <Text
            style={{
              fontSize: 16,
              marginTop: 5,
              marginBottom: 5
            }}
          >
            {this._getRecordingTimestamp()}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  emptyContainer: {
    alignSelf: "stretch",
    backgroundColor: BACKGROUND_COLOR
  },
  noPermissionsText: {
    textAlign: "center"
  }
});
