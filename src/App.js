import React, { Component } from 'react';
import { distanceBetweenCoordinates } from "./utils";
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      isDrawing: false,
      staringCoodinates: null,
      distance: 0
    }
  }

  _getContext = () => {
    const el = this.canvasRef.current;
    return el.getContext("2d");
  }

  _handleOnMouseDown = (e) => {
    const ctx = this._getContext();
    const { offsetX, offsetY } = e.nativeEvent;
    this.setState({ isDrawing: true, staringCoodinates: [offsetX, offsetY] }, () => {
      // Moving staring point for a new line.
      ctx.moveTo(offsetX, offsetY);
    });
  }

  _handleOnMouseMove = (e) => {
    const { isDrawing, staringCoodinates } = this.state;
    const ctx = this._getContext();
    const { offsetX, offsetY } = e.nativeEvent;
    if (isDrawing) {
      // Connecting the last point with current coordinates
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();

      // Updating live distance
      const distance = distanceBetweenCoordinates(
        staringCoodinates[0],
        staringCoodinates[1],
        offsetX,
        offsetY)
      this.setState({ distance: parseFloat(distance).toFixed(2) });
    }
  }

  _handleOnMouseUp = () => {
    this.setState({ isDrawing: false });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p> SUPER EFFICIENT DRAWING BOARD </p>
        </header>
        <div className="drawing-container">
          <canvas
            id="drawing-board"
            width="700"
            height="400"
            ref={this.canvasRef}
            onMouseDown={this._handleOnMouseDown}
            onMouseMove={this._handleOnMouseMove}
            onMouseUp={this._handleOnMouseUp}
          />
        </div>
        <h2>Distance: {this.state.distance} meter(s)</h2>
      </div>
    );
  }
}

export default App;
