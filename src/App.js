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
  constructor(props){
    super(props);
    this.state = {
      id:uuid.v1(),
      name:'',
      inventory : {},
      submitted: false
    }

   this.handleQuestionChange = this.handleQuestionChange.bind(this);
 } 

componentDidMount() {
    this._loadFirebaseData();
  }

_loadFirebaseData() {
    var self = this;

    this.setState({ inventory: [] });
    //getting data from firebase
    firebase.database().ref().once('value').then((snapshot) => {
      snapshot.forEach(function (data) {
        self.setState({
          inventory: self.state.inventory.concat(data.val())
        });
      });
    });
  }

handleQuestionChange(event){
    var inventory  = this.state.inventory ;
    if(event.target.name === 'instr'){
      inventory.instr = event.target.value;
    } else if(event.target.name === 'model'){
      inventory.model = event.target.value;
    } else if(event.target.name === 'size'){
      inventory.size = event.target.value;
    } else if(event.target.name === 'serialnum'){
      inventory.serialnum = event.target.value;
    } 

    this.setState({inventory:inventory },function(){
      console.log(this.state);
    });
  }

  
handleCategoriesSubmit(event){
    event.preventDefault();
    firebase.database().ref('inVLNtoryApp/'+this.state.id).set({
      name: this.state.name,
      inventory: this.state.inventory 
    });

    this.setState({submitted:true}, function(){
      console.log('Inventory Submitted...');
    });
    this._loadFirebaseData();
  }

handleNameSubmit(event) {
    event.preventDefault();
    var name = this.refs.name.value;
    this.setState({name:name}, function(){
      console.log(this.state);
    });
  }


  render() {
    var user;
    var categories;
    var inputForm;
    var rows;
    var table;

    if(this.state.name){
      user = <h2>Welcome {this.state.name}</h2>
      categories = <span className="categories-cont">
        <h3>Instrument Inventory </h3>
        <form onSubmit={this.handleCategoriesSubmit.bind(this)}>
          <div>
            <label className="invent-label">Instrument: </label><br />
            <input className="radio-buttons" type="radio" name="instr" value="Violin" onChange={this.handleQuestionChange} />Violin
            <input className="radio-buttons" type="radio" name="instr" value="Viola" onChange={this.handleQuestionChange} />Viola
            <input className="radio-buttons" type="radio" name="instr" value="Cello" onChange={this.handleQuestionChange} />Cello
            <input className="radio-buttons" type="radio" name="instr" value="Bass" onChange={this.handleQuestionChange} />Bass
          </div>
          <br />
          <div>
          <label className="invent-label">Model:</label><br />
          <input type="text" name="model" placeholder="Instrument Model..." onChange={this.handleQuestionChange} />
        </div>
        <br />
        <div>
          <label className="invent-label">Size:</label><br />
          <input className="radio-buttons" type="radio" name="size" value="4/4" onChange={this.handleQuestionChange} />4/4
          <input className="radio-buttons" type="radio" name="size" value="3/4" onChange={this.handleQuestionChange} />3/4
          <input className="radio-buttons" type="radio" name="size" value="1/2" onChange={this.handleQuestionChange} />1/2
          <input className="radio-buttons" type="radio" name="size" value="1/4" onChange={this.handleQuestionChange} />1/4
          <input className="radio-buttons" type="radio" name="size" value="1/8" onChange={this.handleQuestionChange} />1/8<br/>
          <input className="radio-buttons" type="radio" name="size" value="12" onChange={this.handleQuestionChange} />12"
          <input className="radio-buttons" type="radio" name="size" value="13" onChange={this.handleQuestionChange} />13"
          <input className="radio-buttons" type="radio" name="size" value="14" onChange={this.handleQuestionChange} />14"
          <input className="radio-buttons" type="radio" name="size" value="15" onChange={this.handleQuestionChange} />15"
          <input className="radio-buttons" type="radio" name="size" value="16" onChange={this.handleQuestionChange} />16"
        </div>
        <br />
        <div>
          <label className="invent-label">Serial Number: </label><br />
          <input type="text" name="serialnum" placeholder="Serial Number..." onChange={this.handleQuestionChange} />
        </div>
        <br /> <br /> <br />
        <input className="submit-button" type="submit" value="Submit" />
        </form>
      </span>

      rows = this.state.inventory.map(function (item, index) {
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

    // } else if (!this.state.name && this.state.submitted === false){
      } else if (!this.state.name && this.state.submitted === false) {
      user = <span>
        <h2>Please Enter Employee Id:</h2>
        <form onSubmit={this.handleNameSubmit.bind(this)}>
          <input type="text" placeholder="Employee Id..." ref="name" />
        </form>
      </span>;
      categories = '';
      rows = '';
      table = '';
    }
    // } else if(this.state.submitted === true){
    //      user = <h2>Thank you {this.state.name}. Inventory has been submitted.</h2>
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
