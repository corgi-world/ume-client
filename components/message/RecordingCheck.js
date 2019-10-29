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

const ICON_PLAY_BUTTON = new Icon(
  require("../../assets/images/play_button.png"),
  34,
  51
);
const ICON_PAUSE_BUTTON = new Icon(
  require("../../assets/images/pause_button.png"),
  34,
  51
);
const ICON_STOP_BUTTON = new Icon(
  require("../../assets/images/stop_button.png"),
  22,
  22
);

const ICON_MUTED_BUTTON = new Icon(
  require("../../assets/images/muted_button.png"),
  67,
  58
);
const ICON_UNMUTED_BUTTON = new Icon(
  require("../../assets/images/unmuted_button.png"),
  67,
  58
);

const ICON_TRACK_1 = new Icon(
  require("../../assets/images/track_1.png"),
  166,
  5
);
const ICON_THUMB_1 = new Icon(
  require("../../assets/images/thumb_1.png"),
  18,
  19
);
const ICON_THUMB_2 = new Icon(
  require("../../assets/images/thumb_2.png"),
  15,
  19
);

const {
  width: DEVICE_WIDTH,
  height: DEVICE_HEIGHT
} = Dimensions.get("window");
const BACKGROUND_COLOR = "#15badb";
const LIVE_COLOR = "#FF0000";
const DISABLED_OPACITY = 0.5;
const RATE_SCALE = 3.0;

import ServerURL from "../../utility/ServerURL";
import axios from "axios";

export default class RecordingCheck extends React.Component {
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
      rate: 1.0,

      files: null
    };
    this.recordingSettings = JSON.parse(
      JSON.stringify(
        Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY
      )
    );
    // // UNCOMMENT THIS TO TEST maxFileSize:
    // this.recordingSettings.android['maxFileSize'] = 12000;
  }

  _onFocused = async () => {
    let result = null;
    try {
      result = await axios.post(
        ServerURL + "get",
        { timeout: 2000 }
      );
    } catch (err) {
      console.log("token axios 1");
    }

    const r = result.data.result;
    if (r == "OK") {
      const files = result.data.files;
      if (files != 0) {
        this.setState({
          files
        });
      } else {
        this.setState({
          files: null
        });
      }
    }
  };

  componentDidMount = async => {
    this._selectedAudioFile(
      this.props.audioFileName
    );
  };

  _selectedAudioFile = async selectedFileName => {
    if (this.sound != null) {
      this.sound.stopAsync();
    }

    const s =
      ServerURL + "getAudio/" + selectedFileName;
    console.log(s);

    try {
      const {
        sound: soundObject,
        status
      } = await Audio.Sound.createAsync(
        { uri: s },
        {
          shouldPlay: false,
          isLooping: false,
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
      console.log(error);
    }
  };

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
        if (this.sound != null) {
          this.sound.stopAsync();
        }
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
      <View
        style={{
          maxWidth: DEVICE_WIDTH - 150,
          height: 120
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 10
          }}
        >
          {/*
            trackImage={ICON_TRACK_1.module}
            thumbImage={ICON_THUMB_1.module}
            */}
          <Slider
            style={styles.playbackSlider}
            value={this._getSeekSliderPosition()}
            onValueChange={
              this._onSeekSliderValueChange
            }
            onSlidingComplete={
              this._onSeekSliderSlidingComplete
            }
            disabled={
              !this.state.isPlaybackAllowed ||
              this.state.isLoading
            }
          />
          <View
            style={{
              alignItems: "flex-end",
              justifyContent: "flex-end",
              paddingRight: 15,
              width: DEVICE_WIDTH - 150
            }}
          >
            <Text style={{ color: "white" }}>
              {this._getPlaybackTimestamp()}
            </Text>
          </View>
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
  playbackSlider: {
    alignSelf: "stretch"
  },
  image: {
    backgroundColor: BACKGROUND_COLOR
  },
  volumeSlider: {
    width:
      DEVICE_WIDTH / 2.0 - ICON_MUTED_BUTTON.width
  }
});
