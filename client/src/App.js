import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Hi There ACE</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <a href="/charities-visual">Click to Donate Now</a> <br />
        <a href="/charity-info">This is a single charity in a list. Click to see detailed info.</a>
      </div>
    );
  }
}

export default App;
