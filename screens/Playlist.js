import React from "react";
import {
  Dimensions,
  Image,
  Slider,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  SafeAreaView
} from "react-native";

import { Asset } from "expo-asset";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as Font from "expo-font";
import * as Permissions from "expo-permissions";

class Icon {
  constructor(module, width, height) {
    this.module = module;
    this.width = width;
    this.height = height;
    Asset.fromModule(this.module).downloadAsync();
  }
}

const ICON_RECORD_BUTTON = new Icon(
  require("../assets/images/record_button.png"),
  70,
  119
);
const ICON_RECORDING = new Icon(
  require("../assets/images/record_icon.png"),
  20,
  14
);

const ICON_PLAY_BUTTON = new Icon(
  require("../assets/images/play_button.png"),
  34,
  51
);
const ICON_PAUSE_BUTTON = new Icon(
  require("../assets/images/pause_button.png"),
  34,
  51
);
const ICON_STOP_BUTTON = new Icon(
  require("../assets/images/stop_button.png"),
  22,
  22
);

const ICON_MUTED_BUTTON = new Icon(
  require("../assets/images/muted_button.png"),
  67,
  58
);
const ICON_UNMUTED_BUTTON = new Icon(
  require("../assets/images/unmuted_button.png"),
  67,
  58
);

const ICON_TRACK_1 = new Icon(
  require("../assets/images/track_1.png"),
  166,
  5
);
const ICON_THUMB_1 = new Icon(
  require("../assets/images/thumb_1.png"),
  18,
  19
);
const ICON_THUMB_2 = new Icon(
  require("../assets/images/thumb_2.png"),
  15,
  19
);

const {
  width: DEVICE_WIDTH,
  height: DEVICE_HEIGHT
} = Dimensions.get("window");
const BACKGROUND_COLOR = "#FFFFFF";
const LIVE_COLOR = "#FF0000";
const DISABLED_OPACITY = 0.5;
const RATE_SCALE = 3.0;

import ServerURL from "../utility/ServerURL";
import axios from "axios";

export default class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.recording = null;
    this.sound = null;
    this.isSeeking = false;
    this.shouldPlayAtEndOfSeek = false;
    this.state = {
      haveRecordingPermissions: false,
      isLoading: false,
      isPlaybackAllowed: false,
      muted: false,
      soundPosition: null,
      soundDuration: null,
      recordingDuration: null,
      shouldPlay: false,
      isPlaying: false,
      isRecording: false,
      fontLoaded: false,
      shouldCorrectPitch: true,
      volume: 1.0,
      rate: 1.0
    };
    this.recordingSettings = JSON.parse(
      JSON.stringify(
        Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY
      )
    );
    // // UNCOMMENT THIS TO TEST maxFileSize:
    // this.recordingSettings.android['maxFileSize'] = 12000;
  }

  _onFocused = () => {
    console.log("gogo");
  };

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener(
      "didFocus",
      this._onFocused
    );

    (async () => {
      await Font.loadAsync({
        "cutive-mono-regular": require("../assets/fonts/CutiveMono-Regular.ttf")
      });
      this.setState({ fontLoaded: true });
    })();
    this._askForPermissions();

    (async () => {
      const s =
        ServerURL +
        "getAudio/1567940715499-hello.caf";
      console.log(s);

      try {
        const {
          sound: soundObject,
          status
        } = await Audio.Sound.createAsync(
          { uri: s },
          {
            shouldPlay: false,
            isLooping: true,
            isMuted: this.state.muted,
            volume: this.state.volume,
            rate: this.state.rate,
            shouldCorrectPitch: this.state
              .shouldCorrectPitch
          },
          this._updateScreenForSoundStatus
        );

        this.sound = soundObject;

        this.setState({
          isLoading: false
        });
        // Your sound is playing!
      } catch (error) {
        // An error occurred!
      }
    })();
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

  _updateScreenForSoundStatus = status => {
    if (status.isLoaded) {
      this.setState({
        soundDuration: status.durationMillis,
        soundPosition: status.positionMillis,
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        rate: status.rate,
        muted: status.isMuted,
        volume: status.volume,
        shouldCorrectPitch:
          status.shouldCorrectPitch,
        isPlaybackAllowed: true
      });
    } else {
      this.setState({
        soundDuration: null,
        soundPosition: null,
        isPlaybackAllowed: false
      });
      if (status.error) {
        console.log(
          `FATAL PLAYER ERROR: ${status.error}`
        );
      }
    }
  };

  _onPlayPausePressed = () => {
    if (this.sound != null) {
      if (this.state.isPlaying) {
        this.sound.pauseAsync();
      } else {
        this.sound.playAsync();
      }
    }
  };

  _onStopPressed = () => {
    if (this.sound != null) {
      this.sound.stopAsync();
    }
  };

  _onMutePressed = () => {
    if (this.sound != null) {
      this.sound.setIsMutedAsync(
        !this.state.muted
      );
    }
  };

  _onVolumeSliderValueChange = value => {
    if (this.sound != null) {
      this.sound.setVolumeAsync(value);
    }
  };

  _trySetRate = async (
    rate,
    shouldCorrectPitch
  ) => {
    if (this.sound != null) {
      try {
        await this.sound.setRateAsync(
          rate,
          shouldCorrectPitch
        );
      } catch (error) {
        // Rate changing could not be performed, possibly because the client's Android API is too old.
      }
    }
  };

  _onRateSliderSlidingComplete = async value => {
    this._trySetRate(
      value * RATE_SCALE,
      this.state.shouldCorrectPitch
    );
  };

  _onPitchCorrectionPressed = async value => {
    this._trySetRate(
      this.state.rate,
      !this.state.shouldCorrectPitch
    );
  };

  _onSeekSliderValueChange = value => {
    if (this.sound != null && !this.isSeeking) {
      this.isSeeking = true;
      this.shouldPlayAtEndOfSeek = this.state.shouldPlay;
      this.sound.pauseAsync();
    }
  };

  _onSeekSliderSlidingComplete = async value => {
    if (this.sound != null) {
      this.isSeeking = false;
      const seekPosition =
        value * this.state.soundDuration;
      if (this.shouldPlayAtEndOfSeek) {
        this.sound.playFromPositionAsync(
          seekPosition
        );
      } else {
        this.sound.setPositionAsync(seekPosition);
      }
    }
  };

  _getSeekSliderPosition() {
    if (
      this.sound != null &&
      this.state.soundPosition != null &&
      this.state.soundDuration != null
    ) {
      return (
        this.state.soundPosition /
        this.state.soundDuration
      );
    }
    return 0;
  }

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

  _getPlaybackTimestamp() {
    if (
      this.sound != null &&
      this.state.soundPosition != null &&
      this.state.soundDuration != null
    ) {
      return `${this._getMMSSFromMillis(
        this.state.soundPosition
      )} / ${this._getMMSSFromMillis(
        this.state.soundDuration
      )}`;
    }
    return "";
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
    return (
      <SafeAreaView
        style={{
          flex: 1
        }}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 10
          }}
        >
          <View
            style={[
              styles.halfScreenContainer,
              {
                opacity:
                  !this.state.isPlaybackAllowed ||
                  this.state.isLoading
                    ? DISABLED_OPACITY
                    : 1.0
              }
            ]}
          >
            <View />
            <View
              style={styles.playbackContainer}
            >
              <Slider
                style={styles.playbackSlider}
                trackImage={ICON_TRACK_1.module}
                thumbImage={ICON_THUMB_1.module}
                value={this._getSeekSliderPosition()}
                onValueChange={
                  this._onSeekSliderValueChange
                }
                onSlidingComplete={
                  this
                    ._onSeekSliderSlidingComplete
                }
                disabled={
                  !this.state.isPlaybackAllowed ||
                  this.state.isLoading
                }
              />
              <Text
                style={[
                  styles.playbackTimestamp,
                  {
                    fontFamily:
                      "cutive-mono-regular"
                  }
                ]}
              >
                {this._getPlaybackTimestamp()}
              </Text>
            </View>
            <View
              style={[
                styles.buttonsContainerBase,
                styles.buttonsContainerTopRow
              ]}
            >
              <View
                style={styles.volumeContainer}
              >
                <TouchableHighlight
                  underlayColor={BACKGROUND_COLOR}
                  style={styles.wrapper}
                  onPress={this._onMutePressed}
                  disabled={
                    !this.state
                      .isPlaybackAllowed ||
                    this.state.isLoading
                  }
                >
                  <Image
                    style={styles.image}
                    source={
                      this.state.muted
                        ? ICON_MUTED_BUTTON.module
                        : ICON_UNMUTED_BUTTON.module
                    }
                  />
                </TouchableHighlight>
                <Slider
                  style={styles.volumeSlider}
                  trackImage={ICON_TRACK_1.module}
                  thumbImage={ICON_THUMB_2.module}
                  value={1}
                  onValueChange={
                    this
                      ._onVolumeSliderValueChange
                  }
                  disabled={
                    !this.state
                      .isPlaybackAllowed ||
                    this.state.isLoading
                  }
                />
              </View>
              <View
                style={styles.playStopContainer}
              >
                <TouchableHighlight
                  underlayColor={BACKGROUND_COLOR}
                  style={styles.wrapper}
                  onPress={
                    this._onPlayPausePressed
                  }
                  disabled={
                    !this.state
                      .isPlaybackAllowed ||
                    this.state.isLoading
                  }
                >
                  <Image
                    style={styles.image}
                    source={
                      this.state.isPlaying
                        ? ICON_PAUSE_BUTTON.module
                        : ICON_PLAY_BUTTON.module
                    }
                  />
                </TouchableHighlight>
                <TouchableHighlight
                  underlayColor={BACKGROUND_COLOR}
                  style={styles.wrapper}
                  onPress={this._onStopPressed}
                  disabled={
                    !this.state
                      .isPlaybackAllowed ||
                    this.state.isLoading
                  }
                >
                  <Image
                    style={styles.image}
                    source={
                      ICON_STOP_BUTTON.module
                    }
                  />
                </TouchableHighlight>
              </View>
              <View />
            </View>
            <View
              style={[
                styles.buttonsContainerBase,
                styles.buttonsContainerBottomRow
              ]}
            >
              <Text
                style={[
                  styles.timestamp,
                  {
                    fontFamily:
                      "cutive-mono-regular"
                  }
                ]}
              >
                Rate:
              </Text>
              <Slider
                style={styles.rateSlider}
                trackImage={ICON_TRACK_1.module}
                thumbImage={ICON_THUMB_1.module}
                value={
                  this.state.rate / RATE_SCALE
                }
                onSlidingComplete={
                  this
                    ._onRateSliderSlidingComplete
                }
                disabled={
                  !this.state.isPlaybackAllowed ||
                  this.state.isLoading
                }
              />
              <TouchableHighlight
                underlayColor={BACKGROUND_COLOR}
                style={styles.wrapper}
                onPress={
                  this._onPitchCorrectionPressed
                }
                disabled={
                  !this.state.isPlaybackAllowed ||
                  this.state.isLoading
                }
              >
                <Text
                  style={[
                    {
                      fontFamily:
                        "cutive-mono-regular"
                    }
                  ]}
                >
                  PC:{" "}
                  {this.state.shouldCorrectPitch
                    ? "yes"
                    : "no"}
                </Text>
              </TouchableHighlight>
            </View>
            <View />
          </View>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: "pink"
          }}
        ></View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  emptyContainer: {
    alignSelf: "stretch",
    backgroundColor: BACKGROUND_COLOR
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: BACKGROUND_COLOR,
    minHeight: DEVICE_HEIGHT,
    maxHeight: DEVICE_HEIGHT
  },
  noPermissionsText: {
    textAlign: "center"
  },
  halfScreenContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    minHeight: DEVICE_HEIGHT / 2.0,
    maxHeight: DEVICE_HEIGHT / 2.0
  },
  recordingContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    minHeight: ICON_RECORD_BUTTON.height,
    maxHeight: ICON_RECORD_BUTTON.height
  },
  recordingDataContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: ICON_RECORD_BUTTON.height,
    maxHeight: ICON_RECORD_BUTTON.height,
    minWidth: ICON_RECORD_BUTTON.width * 3.0,
    maxWidth: ICON_RECORD_BUTTON.width * 3.0
  },
  recordingDataRowContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: ICON_RECORDING.height,
    maxHeight: ICON_RECORDING.height
  },
  playbackContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    minHeight: ICON_THUMB_1.height * 2.0,
    maxHeight: ICON_THUMB_1.height * 2.0
  },
  playbackSlider: {
    alignSelf: "stretch"
  },
  liveText: {
    color: LIVE_COLOR
  },
  recordingTimestamp: {
    paddingLeft: 20
  },
  playbackTimestamp: {
    textAlign: "right",
    alignSelf: "stretch",
    paddingRight: 20
  },
  image: {
    backgroundColor: BACKGROUND_COLOR
  },
  textButton: {
    backgroundColor: BACKGROUND_COLOR,
    padding: 10
  },
  buttonsContainerBase: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  buttonsContainerTopRow: {
    maxHeight: ICON_MUTED_BUTTON.height,
    alignSelf: "stretch",
    paddingRight: 20
  },
  playStopContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minWidth:
      ((ICON_PLAY_BUTTON.width +
        ICON_STOP_BUTTON.width) *
        3.0) /
      2.0,
    maxWidth:
      ((ICON_PLAY_BUTTON.width +
        ICON_STOP_BUTTON.width) *
        3.0) /
      2.0
  },
  volumeContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minWidth: DEVICE_WIDTH / 2.0,
    maxWidth: DEVICE_WIDTH / 2.0
  },
  volumeSlider: {
    width:
      DEVICE_WIDTH / 2.0 - ICON_MUTED_BUTTON.width
  },
  buttonsContainerBottomRow: {
    maxHeight: ICON_THUMB_1.height,
    alignSelf: "stretch",
    paddingRight: 20,
    paddingLeft: 20
  },
  rateSlider: {
    width: DEVICE_WIDTH / 2.0
  }
});
