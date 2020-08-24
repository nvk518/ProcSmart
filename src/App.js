import React, { Component, createRef } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Record from "./components/record";
import Home from "./components/home";
import Create from "./components/create";

import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import HomeIcon from "@material-ui/icons/Home";
import VideoCallIcon from "@material-ui/icons/VideoCall";
import AddCircleIcon from "@material-ui/icons/AddCircle";

import styles from "./Home.module.css";

import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      value: 0,
    };
  }

  render() {
    return (
      <div>
        <Router>
          <BottomNavigation showLabels className={styles.root}>
            <BottomNavigationAction
              href="/home"
              label="Home"
              icon={<HomeIcon />}
            />
            <BottomNavigationAction
              href="/record"
              label="Record"
              icon={<VideoCallIcon />}
            />
            <BottomNavigationAction
              href="/create"
              label="Create"
              icon={<AddCircleIcon />}
            />
          </BottomNavigation>
          <div>
            {/* <ul>
              <li>
                <Link to="/home">Home</Link>
              </li>
              <li>
                <Link to="/record">Record</Link>
              </li>
              <li>
                <Link to="/create">Create Session</Link>
              </li>
            </ul>

            <hr /> */}

            <Route exact path="/" component={Home} />
            <Route exact path="/home" component={Home} />

            <Route path="/record" component={Record} />
            <Route path="/create" component={Create} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
