import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p> SUPER EFFICIENT DRAWING BOARD </p>
        </header>
        <div className="drawing-container">
          <canvas id="drawing-board" width="700" height="400"></canvas>
        </div>
      </div>
    );
  }
}

export default App;
