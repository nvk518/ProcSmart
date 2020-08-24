import React, { Component, createRef } from "react";
import { db, firestore } from "../firebase";

import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import styles from "../Create.module.css";

var sha1 = require("sha1");

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      course: "",
      sessionID: "",
      term: "",
      year: "",
      password: "",
      phone: false,
      person: false,
      book: false,
      bottle: false,
      laptop: false,
      remote: false,
      keyboard: false,
      nameError: false,
      classError: false,
      termError: false,
      yearError: false,
    };

    this.generateRef = createRef();
    this.classRef = createRef();
    this.nameRef = createRef();

    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.handleYearChange = this.handleYearChange.bind(this);
  }

  createSession = () => {
    const hash = sha1(
      this.nameRef.current.value +
        this.classRef.current.value +
        this.state.term +
        this.state.year
    );
    const hashPass = sha1(
      this.nameRef.current.value +
        this.classRef.current.value +
        this.state.term +
        this.state.year +
        this.state.phone +
        this.state.person +
        this.state.book
    );
    var nr = this.nameRef.current.value;
    var cr = this.classRef.current.value;
    this.setState({
      name: nr,
      course: cr,
      sessionID: hash,
      password: hashPass,
    });

    db.collection("users")
      .doc(hash)
      .set({
        sessionID: hash,
        name: this.nameRef.current.value,
        course: this.classRef.current.value,
        term: this.state.term,
        year: this.state.year,
        password: hashPass,
        phone: this.state.phone,
        person: this.state.person,
        book: this.state.book,
        bottle: this.state.bottle,
        laptop: this.state.laptop,
        remote: this.state.remote,
        keyboard: this.state.keyboard,
      })
      .then(function () {
        console.log("Document successfully written!");
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  };

  handleOnSubmit = (e) => {
    e.preventDefault();
    var nameE = false;
    var classE = false;
    var termE = false;
    var yearE = false;
    if (this.nameRef.current.value === "") {
      nameE = true;
    } else if (this.classRef.current.value === "") {
      classE = true;
    } else if (this.state.term === "") {
      termE = true;
    } else if (this.state.year === "") {
      yearE = true;
    }
    this.setState({
      nameError: nameE,
      classError: classE,
      termError: termE,
      yearError: yearE,
    });
    if (!nameE && !classE && !termE && !yearE) {
      this.createSession();
    }
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.checked,
    });
  };

  handleTermChange = (e) => {
    this.setState({
      term: e.target.value,
    });
  };

  handleYearChange = (e) => {
    this.setState({
      year: e.target.value,
    });
  };

  render() {
    return (
      <div className={styles.form}>
        <h1>Create class profile</h1>
        <form noValidate autoComplete="off" onSubmit={this.handleOnSubmit}>
          <div>
            <TextField
              required
              inputRef={this.nameRef}
              id="standard-required"
              label="Name"
              defaultValue=""
              error={this.state.nameError}
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
              inputRef={this.classRef}
              id="standard-required"
              label="Class"
              defaultValue=""
              error={this.state.classError}
            />
          </div>
          <br />
          <FormControl>
            <InputLabel shrink id="demo-simple-select-placeholder-label-label">
              Term
            </InputLabel>{" "}
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={this.state.term}
              onChange={this.handleTermChange}
              className={styles.combo}
              error={this.state.termError}
            >
              <MenuItem value={"Fall"}>Fall</MenuItem>
              <MenuItem value={"Winter"}>Winter</MenuItem>
              <MenuItem value={"Spring"}>Spring</MenuItem>
              <MenuItem value={"Summer"}>Summer</MenuItem>
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel shrink id="demo-simple-select-placeholder-label-label">
              Year
            </InputLabel>{" "}
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={this.state.year}
              onChange={this.handleYearChange}
              className={styles.combo}
              error={this.state.yearError}
            >
              <MenuItem value={"2020"}>2020</MenuItem>
              <MenuItem value={"2021"}>2021</MenuItem>
              <MenuItem value={"2022"}>2022</MenuItem>
              <MenuItem value={"2023"}>2023</MenuItem>
              <MenuItem value={"2024"}>2024</MenuItem>
              <MenuItem value={"2025"}>2025</MenuItem>
              <MenuItem value={"2026"}>2026</MenuItem>
              <MenuItem value={"2027"}>2027</MenuItem>
              <MenuItem value={"2028"}>2028</MenuItem>
              <MenuItem value={"2029"}>2029</MenuItem>
              <MenuItem value={"2030"}>2030</MenuItem>
              <MenuItem value={"2031"}>2031</MenuItem>
              <MenuItem value={"2032"}>2032</MenuItem>
              <MenuItem value={"2033"}>2033</MenuItem>
              <MenuItem value={"2034"}>2034</MenuItem>
              <MenuItem value={"2035"}>2035</MenuItem>
            </Select>
          </FormControl>
          <br />
          <br />
          <FormControl component="fieldset">
            <FormLabel component="legend">Choose Objects Classified</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.phone}
                    onChange={this.handleChange}
                    name="phone"
                  />
                }
                label="phone"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.person}
                    onChange={this.handleChange}
                    name="person"
                  />
                }
                label="person"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.book}
                    onChange={this.handleChange}
                    name="book"
                  />
                }
                label="book"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.laptop}
                    onChange={this.handleChange}
                    name="laptop"
                  />
                }
                label="laptop"
              />
            </FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.bottle}
                  onChange={this.handleChange}
                  name="bottle"
                />
              }
              label="bottle"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.remote}
                  onChange={this.handleChange}
                  name="remote"
                />
              }
              label="remote"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.keyboard}
                  onChange={this.handleChange}
                  name="keyboard"
                />
              }
              label="keyboard"
            />
          </FormControl>
          <div>
            <Button
              type="submit"
              ref={this.generateRef}
              variant="contained"
              color="primary"
            >
              Generate
            </Button>
          </div>
        </form>
        <br />
        <div>Session ID: {this.state.sessionID}</div>
        <div>Session password: {this.state.password}</div>
      </div>
    );
  }
}

export default Create;
