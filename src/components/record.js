import React, { Component, createRef } from "react";
import { db } from "../firebase";
import { firestore } from "firebase";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import AccountCircle from "@material-ui/icons/AccountCircle";
import ComputerIcon from "@material-ui/icons/Computer";

import styles from "../Record.module.css";
const cocoSsd = require("@tensorflow-models/coco-ssd");

class Record extends Component {
  constructor() {
    super();

    this.videoRef = createRef();
    this.canvasRef = createRef();
    this.recordRef = createRef();
    this.listRef = createRef();
    this.nameRef = createRef();
    this.idRef = createRef();
    // we are gonna use inline style
    this.styles = {
      position: "fixed",
      //   top: 150,
      //   left: 150,
    };

    this.state = {
      userCode: "",
      recording: false,
      book: false,
      bottle: false,
      keyboard: false,
      laptop: false,
      remote: false,
      person: false,
      phone: false,
      bookDetected: 0,
      bottleDetected: 0,
      keyboardDetected: 0,
      laptopDetected: 0,
      remoteDetected: 0,
      noPerson: 0,
      phoneDetected: 0,
      loadingMsg: "Model is loading, please wait.",
      recordButton: true,
      sessionID: "",
      name: "",
      formHidden: false,
    };

    this.detectFromVideoFrame = this.detectFromVideoFrame.bind(this);
    this.showDetections = this.showDetections.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.renderRecording = this.renderRecording.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
  }

  detectFromVideoFrame = (model, video) => {
    model
      .detect(video)
      .then(
        (predictions) => {
          this.showDetections(predictions);
          requestAnimationFrame(() => {
            this.detectFromVideoFrame(model, video);
          });
        },
        (error) => {
          console.log("Couldn't start the webcam");
          console.error(error);
        }
      )
      .catch((error) => "");
  };

  showDetections = (predictions) => {
    const ctx = this.canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const font = "24px helvetica";
    ctx.font = font;
    ctx.textBaseline = "top";
    var containsPerson,
      containsDevice,
      containsBottle,
      containsBook,
      containsRemote,
      containsLaptop,
      containsKeyboard,
      containsPerson = false;
    predictions.forEach((prediction) => {
      if (this.state.recording) {
        switch (prediction.class) {
          case "bottle":
            containsBottle = this.state.bottle ? true : false;
            break;
          case "book":
            containsBook = this.state.book ? true : false;
            break;
          case "remote":
            containsRemote = this.state.remote ? true : false;
            break;
          case "laptop":
            containsLaptop = this.state.laptop ? true : false;
            break;
          case "keyboard":
            containsKeyboard = this.state.keyboard ? true : false;
            break;
          case "person":
            containsPerson = this.state.person ? true : false;
            break;
          case "cell phone":
            containsDevice = this.state.phone ? true : false;
            break;
          // default:
          //   console.log(prediction.class);
        }
      }
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];
      // Draw the bounding box.
      ctx.strokeStyle = "#2fff00";
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, width, height);
      // Draw the label background.
      ctx.fillStyle = "#2fff00";
      const textWidth = ctx.measureText(prediction.class).width;
      const textHeight = parseInt(font, 10);
      // draw top left rectangle
      ctx.fillRect(x, y, textWidth + 10, textHeight + 10);
      // draw bottom left rectangle
      ctx.fillRect(x, y + height - textHeight, textWidth + 15, textHeight + 10);

      // Draw the text last to ensure it's on top.
      ctx.fillStyle = "#000000";
      ctx.fillText(prediction.class, x, y);
      ctx.fillText(prediction.score.toFixed(2), x, y + height - textHeight);
    });
    if (this.state.recording) {
      var bookCount = containsBook
        ? this.state.bookDetected + 1
        : this.state.bookDetected;
      var bottleCount = containsBottle
        ? this.state.bottleDetected + 1
        : this.state.bottleDetected;
      var keyboardCount = containsKeyboard
        ? this.state.keyboardDetected + 1
        : this.state.keyboardDetected;
      var laptopCount = containsLaptop
        ? this.state.laptopDetected + 1
        : this.state.laptopDetected;
      var remoteCount = containsRemote
        ? this.state.remoteDetected + 1
        : this.state.remoteDetected;
      var personCount = !containsPerson
        ? this.state.noPerson + 1
        : this.state.noPerson;
      var phoneCount = containsDevice
        ? this.state.phoneDetected + 1
        : this.state.phoneDetected;
      this.setState({
        bookDetected: bookCount,
        bottleDetected: bottleCount,
        keyboardDetected: keyboardCount,
        laptopDetected: laptopCount,
        remoteDetected: remoteCount,
        noPerson: personCount,
        phoneDetected: phoneCount,
      });
    }
  };

  componentDidMount = () => {
    const _this = this;
    if (
      navigator.mediaDevices.getUserMedia ||
      navigator.mediaDevices.webkitGetUserMedia
    ) {
      // define a Promise that'll be used to load the webcam and read its frames
      const webcamPromise = navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: false,
        })
        .then(
          (stream) => {
            // pass the current frame to the window.stream

            const mimeType = "audio/webm";
            let chunks = [];
            const recorder = new MediaRecorder(stream, { type: mimeType });
            recorder.addEventListener("dataavailable", (event) => {
              if (typeof event.data === "undefined") return;
              if (event.data.size === 0) return;
              chunks.push(event.data);
            });
            recorder.addEventListener("stop", () => {
              const recording = new Blob(chunks, {
                type: mimeType,
              });
              _this.renderRecording(recording, _this.listRef.current);
              chunks = [];
            });
            _this.recordRef.current.removeAttribute("hidden");
            _this.recordRef.current.addEventListener("click", () => {
              if (recorder.state === "inactive") {
                recorder.start();
                _this.setState({ recording: true });
                _this.recordRef.current.innerText = "Stop";
              } else {
                recorder.stop();
                _this.createJSON();
                _this.setState({
                  recording: false,
                  bookDetected: 0,
                  bottleDetected: 0,
                  keyboardDetected: 0,
                  laptopDetected: 0,
                  remoteDetected: 0,
                  noPerson: 0,
                  phoneDetected: 0,
                });
                _this.recordRef.current.innerText = "Record";
              }
            });

            window.stream = stream;
            // pass the stream to the videoRef
            _this.videoRef.current.srcObject = stream;

            return new Promise((resolve) => {
              _this.videoRef.current.onloadedmetadata = () => {
                resolve();
              };
            });
          },
          (error) => {
            console.log("Couldn't start the webcam");
            console.error(error);
          }
        );

      // define a Promise that'll be used to load the model
      const loadlModelPromise = cocoSsd.load();

      // resolve all the Promises
      Promise.all([loadlModelPromise, webcamPromise])
        .then((values) => {
          this.setState({
            loadingMsg: "Model loaded.",
          });
          this.detectFromVideoFrame(values[0], this.videoRef.current);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  // let j = document.createElement("a");
  // j.id = "download";
  // j.download = "webcam" + Date.now() + ".mp4";
  // j.href = blobUrl;
  // j.click();

  createJSON = () => {
    var selection = {
      studentName: this.state.name,
      class:
        this.state.course + " - " + this.state.term + " " + this.state.year,
      sessionID: this.state.sessionID,
      noPerson: this.state.person ? this.state.noPerson / 12 : "N/A",
      phoneDetected: this.state.phone ? this.state.phoneDetected / 12 : "N/A",
      bookDetected: this.state.book ? this.state.bookDetected / 12 : "N/A",
      bottleDetected: this.state.bottle
        ? this.state.bottleDetected / 12
        : "N/A",
      laptopDetected: this.state.laptop
        ? this.state.laptopDetected / 12
        : "N/A",
      remoteDetected: this.state.remote
        ? this.state.remoteDetected / 12
        : "N/A",
      keyboardDetected: this.state.keyboard
        ? this.state.keyboardDetected / 12
        : "N/A",
    };
    let j = document.createElement("a");
    j.id = "download";
    j.download = "stack_" + Date.now() + ".json";
    j.href = URL.createObjectURL(
      new Blob([JSON.stringify(selection, null, 2)])
    );
    j.click();
  };

  renderRecording = (blob, list) => {
    const blobUrl = URL.createObjectURL(blob);
    // const li = document.createElement("li");
    // const audio = document.createElement("audio");
    // const anchor = document.createElement("a");
    // anchor.setAttribute("href", blobUrl);
    const now = new Date();
    // anchor.setAttribute(
    //   "download",
    //   `recording-${now.getFullYear()}-${(now.getMonth() + 1)
    //     .toString()
    //     .padStart(2, "0")}-${now
    //     .getDay()
    //     .toString()
    //     .padStart(2, "0")}--${now
    //     .getHours()
    //     .toString()
    //     .padStart(2, "0")}-${now
    //     .getMinutes()
    //     .toString()
    //     .padStart(2, "0")}-${now.getSeconds().toString().padStart(2, "0")}.webm`
    // );

    let j = document.createElement("a");
    j.id = "download";
    j.download = `recording_${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${now
      .getDay()
      .toString()
      .padStart(2, "0")}--${now
      .getHours()
      .toString()
      .padStart(2, "0")}-${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}-${now.getSeconds().toString().padStart(2, "0")}.webm`;
    j.href = blobUrl;
    j.click();
  };

  handleOnSubmit = (e) => {
    e.preventDefault();
    var _this = this;
    var query = db
      .collection("users")
      .where("sessionID", "==", this.idRef.current.value)
      .limit(1)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          _this.setState({
            name: _this.nameRef.current.value,
            id: _this.idRef.current.value,
            course: doc.data().course,
            term: doc.data().term,
            year: doc.data().year,
            book: doc.data().book,
            bottle: doc.data().book,
            phone: doc.data().phone,
            person: doc.data().person,
            remote: doc.data().remote,
            laptop: doc.data().laptop,
            keyboard: doc.data().keyboard,
            recordButton: false,
            formHidden: true,
          });
          console.log(doc.id, " => ", doc.data());
        });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  };

  render() {
    return (
      <div>
        <div className={styles.left}>
          <h1>Record</h1>
          <h4>{this.state.loadingMsg}</h4>
          <h2>Name: {this.state.name}</h2>
          <h2>Session ID: {this.state.id}</h2>
          <h2>
            Course: {this.state.course} {this.state.term} {this.state.year}
          </h2>
          <br />
          <form
            hidden={this.state.formHidden}
            noValidate
            autoComplete="off"
            onSubmit={this.handleOnSubmit}
          >
            <div>
              <TextField
                required
                inputRef={this.nameRef}
                id="Name"
                label="Name"
                defaultValue=""
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <br />
            <div>
              <TextField
                required
                inputRef={this.idRef}
                id="Session ID"
                label="Session ID"
                defaultValue=""
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ComputerIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </form>
        </div>
        <br />
        <div className={styles.right}>
          <video
            style={this.styles}
            autoPlay
            muted
            ref={this.videoRef}
            width="720"
            height="600"
          />
          <br />
          <canvas
            style={this.styles}
            ref={this.canvasRef}
            width="720"
            height="650"
          />
          <br />
          <Button
            ref={this.recordRef}
            variant="contained"
            color="primary"
            disabled={this.state.recordButton}
          >
            Record
          </Button>
          <ul ref={this.listRef} id="list"></ul>
        </div>
      </div>
    );
  }
}

export default Record;
