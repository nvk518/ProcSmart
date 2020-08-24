import React, { Component, createRef } from "react";
import Button from "@material-ui/core/Button";
import styles from "../Home.module.css";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className={styles.body}>
        <h1>ProcSmart</h1>
        <h3>
          ProcSmart is an online proctoring service using Machine Learning
          object classfication technology ideal for simulating and enforcing a
          test taking environment.
        </h3>
        <h2>Features</h2>
        <p>
          - Record webcam video securely and reliably. Because ProcSmart is
          completely client based, no recording data is stored on our servers.
          Download the recording directly to your device.
        </p>
        <p>
          - Machine Learning models accurately identify whether a person is
          detected in the frame and if a phone is detected. After the user stops
          the recording, the data and statistics are downloaded as an easily
          readable JSON file.
        </p>
        <p>
          - Add a class to obtain a unique Session ID and encryption password.
          Students must add the Session ID to unlock recording. The encryption
          password can decrypt the webcam and JSON files downloaded by students,
          preventing the mishandling or tampering with the files.
        </p>
        <br />
        <h2>Educators</h2>
        <p>
          1. Go to <a href="/create">Create</a>
          2. Enter class information and objects you want ProcSmart to detect
          and flag.
        </p>
        <br />
        <div className={styles.start}>
          <h1>Get Started</h1>
          <h2>I am a...</h2>
          <Button
            size="large"
            className={styles.button1}
            variant="contained"
            color="primary"
            href="/record"
          >
            Student
          </Button>
          <Button
            size="large"
            className={styles.button2}
            variant="contained"
            color="primary"
            href="/create"
          >
            Educator
          </Button>
        </div>
      </div>
    );
  }
}

export default Home;
