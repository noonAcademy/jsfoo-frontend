import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      isDrawing: false
    }
  }

  _getContext = () => {
    const el = this.canvasRef.current;
    return el.getContext("2d");
  }

  _handleOnMouseDown = (e) => {
    const ctx = this._getContext();
    const { offsetX, offsetY } = e.nativeEvent;
    this.setState({ isDrawing: true }, () => {
      // Moving staring point for a new line.
      ctx.moveTo(offsetX, offsetY);
    });
  }

  _handleOnMouseMove = (e) => {
    const { isDrawing } = this.state;
    const ctx = this._getContext();
    if (isDrawing) {
      // Connecting the last point with current coordinates
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.stroke();
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
      </div>
    );
  }
}

export default App;
