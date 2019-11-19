import React from "react";
import {
  Dimensions,
  Image,
  Slider,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  ImageBackground
} from "react-native";

import { Asset } from "expo-asset";
import { Audio } from "expo-av";
import * as Font from "expo-font";
import * as Permissions from "expo-permissions";

const CollectionsList = require("collections/list");

class Icon {
  constructor(module, width, height) {
    this.module = module;
    this.width = width;
    this.height = height;
    Asset.fromModule(this.module).downloadAsync();
  }
}

const ICON_PLAY_BUTTON = new Icon(
  require("../assets/images/play_button_1.png"),
  34,
  51
);
const ICON_PAUSE_BUTTON = new Icon(
  require("../assets/images/pause_button_1.png"),
  34,
  51
);
const ICON_STOP_BUTTON = new Icon(
  require("../assets/images/stop_button_1.png"),
  22,
  22
);
const ICON_EXIT_BUTTON = new Icon(
  require("../assets/images/exit_button.png"),
  22,
  22
);

const ICON_MUTED_BUTTON = new Icon(
  require("../assets/images/muted_button.png"),
  67,
  58
);

const {
  width: DEVICE_WIDTH,
  height: DEVICE_HEIGHT
} = Dimensions.get("window");
const BACKGROUND_COLOR = "white";
const LIVE_COLOR = "#FF0000";
const DISABLED_OPACITY = 0.5;
const RATE_SCALE = 3.0;

import ServerURL from "../utility/ServerURL";
import axios from "axios";

export default class Meditation extends React.Component {
  constructor(props) {
    super(props);
    this.recording = null;

    this.bgm = null;
    this.sounds = new CollectionsList();
    this.soundIndex = 0;
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
      fontLoaded: false,

      text: ""
    };
    this.recordingSettings = JSON.parse(
      JSON.stringify(
        Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY
      )
    );
    // // UNCOMMENT THIS TO TEST maxFileSize:
    // this.recordingSettings.android['maxFileSize'] = 12000;
  }

  componentDidMount = async () => {
    (async () => {
      await Font.loadAsync({
        NanumSquareRegular: require("../assets/fonts/NanumSquareRegular.ttf")
      });
      this.setState({ fontLoaded: true });
    })();

    const params = this.props.navigation.state
      .params;
    const audioFileNames = params.audioFileNames.toArray();
    const length = audioFileNames.length;

    this.bgm = await this._selectedAudioFile(
      "bgm.mp3",
      true,
      0.4
    );

    for (var i = 0; i < length; i++) {
      const audioFileName = audioFileNames[i];
      this.sounds.add(
        await this._selectedAudioFile(
          audioFileName,
          false,
          1,
          this._updateScreenForSoundStatus
        )
      );
    }

    const array = this.sounds.toArray();
    this.sound = array[this.soundIndex];

    await this._onPlayPausePressed();
  };

  componentWillUnmount = async () => {
    console.log("unmount");
  };

  _selectedAudioFile = async (
    selectedFileName,
    isLooping,
    volume,
    update
  ) => {
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
          isLooping: isLooping,
          isMuted: this.state.muted,
          volume: volume,
          rate: this.state.rate,
          shouldCorrectPitch: this.state
            .shouldCorrectPitch
        },
        update
      );

      this.setState({
        isLoading: false
      });

      return soundObject;
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

  _updateScreenForSoundStatus = async status => {
    if (status.didJustFinish) {
      const length = this.sounds.length;
      if (this.soundIndex < length - 1) {
        this.soundIndex += 1;
      } else {
        this.soundIndex = 0;
      }
      await this.sound.stopAsync();
      const array = this.sounds.toArray();
      this.sound = array[this.soundIndex];
      await this.sound.playAsync();

      const params = this.props.navigation.state
        .params;
      this.setState({
        text: params.texts[this.soundIndex]
      });
    }

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
    if (this.bgm != null) {
      if (this.state.isPlaying) {
        this.bgm.pauseAsync();
      } else {
        this.bgm.playAsync();
      }
    }

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
    if (this.bgm != null) {
      this.bgm.stopAsync();
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
    const params = this.props.navigation.state
      .params;
    let mt = params.texts[0];
    if (this.state.text !== "") {
      mt = this.state.text;
    }

    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 1
          }}
        >
          <ImageBackground
            source={require("../assets/images/back2.png")}
            style={{
              width: "100%",
              height: "100%"
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 20
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  color: "black",
                  textAlign: "center",
                  fontFamily: "NanumSquareRegular"
                }}
              >
                {mt}
              </Text>
            </View>
          </ImageBackground>
        </View>
        <SafeAreaView
          style={{
            width: DEVICE_WIDTH,
            height: 90,
            position: "absolute",
            right: 0,
            bottom: 0,
            zIndex: 5
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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <TouchableOpacity
                underlayColor={BACKGROUND_COLOR}
                style={{ marginRight: 10 }}
                onPress={this._onPlayPausePressed}
                disabled={
                  !this.state.isPlaybackAllowed ||
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
                  resizeMode={"contain"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                underlayColor={BACKGROUND_COLOR}
                style={styles.wrapper}
                onPress={this._onStopPressed}
                disabled={
                  !this.state.isPlaybackAllowed ||
                  this.state.isLoading
                }
              >
                <Image
                  style={styles.image}
                  source={ICON_STOP_BUTTON.module}
                  resizeMode={"contain"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>

        <SafeAreaView
          style={{
            width: DEVICE_WIDTH,
            height: 90,
            position: "absolute",
            right: 0,
            top: 0,
            zIndex: 5
          }}
        >
          <View
            style={{
              flex: 1,
              alignItems: "flex-end",
              marginTop: 5,
              marginRight: 15
            }}
          >
            <TouchableOpacity
              underlayColor={BACKGROUND_COLOR}
              style={styles.wrapper}
              onPress={() => {
                this._onStopPressed();
                this.props.navigation.navigate(
                  "home"
                );
              }}
            >
              <Image
                style={styles.image}
                source={ICON_EXIT_BUTTON.module}
                resizeMode={"contain"}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
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
    width: 50,
    height: 50
  },
  volumeSlider: {
    width:
      DEVICE_WIDTH / 2.0 - ICON_MUTED_BUTTON.width
  }
});
