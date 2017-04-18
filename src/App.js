import React, { Component } from 'react';
import './App.css';
import { Table } from 'react-bootstrap';

var uuid = require('uuid');
var firebase = require('firebase');

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAvc7Rl8fVofMSbd87eEkzAhpzCxxyM7j8",
  authDomain: "invlntoryapp.firebaseapp.com",
  databaseURL: "https://invlntoryapp.firebaseio.com",
  storageBucket: "invlntoryapp.appspot.com",
  messagingSenderId: "686878654387"
};
firebase.initializeApp(config);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: uuid.v1(),
      name: '',
      inventory: {},
      submitted: false,
    }

    this.handleQuestionChange = this.handleQuestionChange.bind(this);
    this._doneInventory = this._doneInventory.bind(this);
    this.handleCategoriesSubmit = this.handleCategoriesSubmit.bind(this);
    this._loadFirebaseData = this._loadFirebaseData.bind(this);
    this.handleNameSubmit = this.handleNameSubmit.bind(this);
  }

  componentDidMount() {
    var self = this;
    self._loadFirebaseData();
  }

  _loadFirebaseData() {
    var self = this;

    self.setState({ inventory: [] });
    //getting data from firebase
    firebase.database().ref().once('value').then((snapshot) => {
      snapshot.forEach(function (data) {
        self.setState({
          inventory: self.state.inventory.concat(data.val())
        });
      });
    });
  }

  handleQuestionChange(event) {
    var self = this;
    var inventory = self.state.inventory;
    if (event.target.name === 'instr') {
      inventory.instr = event.target.value;
    } else if (event.target.name === 'model') {
      inventory.model = event.target.value;
    } else if (event.target.name === 'size') {
      inventory.size = event.target.value;
    } else if (event.target.name === 'serialnum') {
      inventory.serialnum = event.target.value;
    }

    this.setState({ inventory: inventory }, function () {
      console.log(self.state);
    });
  }


  handleCategoriesSubmit(event) {
    var self = this;
    event.preventDefault();
    firebase.database().ref('inVLNtoryApp/' + self.state.id).set({
      name: self.state.name,
      inventory: self.state.inventory
    });

    self.setState({ submitted: true }, function () {
      console.log('Inventory Submitted...');
    });
    self._loadFirebaseData();
    document.getElementById("invent-form").reset();
  }

  handleNameSubmit(event) {
    var self = this;
    event.preventDefault();
    var name = self.refs.name.value;
    self.setState({ name: name }, function () {
      console.log(self.state);
    });
  }

  _doneInventory(event) {
    var self = this;
    event.preventDefault();
    self.setState({ name: '', submitted: false }, function () {
      console.log(self.state);
    });
  }


  render() {
    var self = this;
    var user;
    var categories;
    var inputForm;
    var rows;
    var table;

    if (self.state.name) {
      user = <h2>Welcome {self.state.name}</h2>
      categories = <span className="categories-cont">
        <h3>Instrument Inventory </h3>
        <form onSubmit={self.handleCategoriesSubmit.bind(this)} id="invent-form">
          <div>
            <label className="invent-label">Instrument: </label><br />
            <input className="radio-buttons" type="radio" ref="instr1" name="instr" value="Violin" onChange={self.handleQuestionChange} />Violin
            <input className="radio-buttons" type="radio" ref="instr2" name="instr" value="Viola" onChange={self.handleQuestionChange} />Viola
            <input className="radio-buttons" type="radio" ref="instr3" name="instr" value="Cello" onChange={self.handleQuestionChange} />Cello
            <input className="radio-buttons" type="radio" ref="instr4" name="instr" value="Bass" onChange={self.handleQuestionChange} />Bass
          </div>
          <br />
          <div>
            <label className="invent-label">Model:</label><br />
            <input type="text" ref="model" name="model" placeholder="Instrument Model..." onChange={self.handleQuestionChange} />
          </div>
          <br />
          <div>
            <label className="invent-label">Size:</label><br />
            <input className="radio-buttons" type="radio" ref="radios" name="size" value="4/4" onChange={self.handleQuestionChange} />4/4
          <input className="radio-buttons" type="radio" ref="radios" name="size" value="3/4" onChange={self.handleQuestionChange} />3/4
          <input className="radio-buttons" type="radio" ref="radios" name="size" value="1/2" onChange={self.handleQuestionChange} />1/2
          <input className="radio-buttons" type="radio" ref="radios" name="size" value="1/4" onChange={self.handleQuestionChange} />1/4
          <input className="radio-buttons" type="radio" ref="radios" name="size" value="1/8" onChange={self.handleQuestionChange} />1/8<br />
            <input className="radio-buttons" type="radio" ref="radios" name="size" value="12" onChange={self.handleQuestionChange} />12"
          <input className="radio-buttons" type="radio" ref="radios" name="size" value="13" onChange={self.handleQuestionChange} />13"
          <input className="radio-buttons" type="radio" ref="radios" name="size" value="14" onChange={self.handleQuestionChange} />14"
          <input className="radio-buttons" type="radio" ref="radios" name="size" value="15" onChange={self.handleQuestionChange} />15"
          <input className="radio-buttons" type="radio" ref="radios" name="size" value="16" onChange={self.handleQuestionChange} />16"
        </div>
          <br />
          <div>
            <label className="invent-label">Serial Number: </label><br />
            <input type="text" ref="serialnum" name="serialnum" placeholder="Serial Number..." onChange={self.handleQuestionChange} />
          </div>
          <br /> <br /> <br />
          <input className="submit-button" type="submit" value="Submit" />
          <input className="done-button" type="button" onClick={self._doneInventory} value="Done" />
        </form>
      </span>

      rows = self.state.inventory.map(function (item, index) {
        return Object.keys(item).map(function (s) {

          return (
            <tr key={s}>
              <th> {item[s].name} </th>
              <th> {item[s].inventory.instr} </th>
              <th> {item[s].inventory.model} </th>
              <th> {item[s].inventory.size} </th>
              <th> {item[s].inventory.serialnum} </th>
            </tr>
          )
        });
      });

      table = (
        <span className="inventTable">
          <Table striped bordered condensed hover className="table-inv">
            <thead>
              <tr>
                <th> Employee </th>
                <th> Instrument </th>
                <th> Model </th>
                <th> Size </th>
                <th> Serial Number </th>
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </Table>
        </span>
      )

    } else if (!self.state.name && self.state.submitted === false) {
      user = <span>
        <h2>Please Enter Employee Id:</h2>
        <form onSubmit={self.handleNameSubmit.bind(this)}>
          <input type="text" placeholder="Employee Id..." ref="name" />
        </form>
      </span>;
      categories = '';
      rows = '';
      table = '';
    }
    // } else if (self.state.submitted && self.state.done === true) {
    //   user = <h2>Thank you {self.state.name}. Inventory has been submitted.</h2>
    // }


    return (
      <div className="App">
        <div className="App-header">
          <h2>in(VLN)tory</h2>
        </div>
        <div className="text-center">
          {user}
        </div>
        <div className="container">
          {categories}
          {table}
        </div>
      </div>
    );
  }
}

export default App;
