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
        <h4>(Recording only supported on desktop browsers at this time.)</h4>
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
          1. Go to <a href="/create">Create</a>. <br />
          2. Enter class information and objects you want ProcSmart to detect
          and flag. <br />
          3. Generate Session ID and share with students. <br />
        </p>
        <br />
        <h2>Students</h2>
        <p>
          1. Go to <a href="/record">Record</a>. Allow permission for ProcSmart
          to use your computer webcam.
          <br />
          2. Enter your name and class Session ID provided by your educator.
          <br />
          3. Save and record webcam. Ensure your face is visible during the
          recording. <br />
          4. Stop when examination is complete. The recording and ProcSmart
          analysis will be downloaded locally. <br />
          5. Share downloaded files with educator. <br />
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
