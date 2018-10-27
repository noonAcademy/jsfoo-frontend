import React, { Component } from 'react';
import { distanceBetweenCoordinates } from "./utils";
import './DrawingBoard.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      isDrawing: false,
      distance: 0
    }
  }

  _getContext = () => {
    const el = this.canvasRef.current;
    return el.getContext("2d");
  }

  _handleClearCanvas = () => {
    const ctx = this._getContext();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.setState({ distance: 0 });
  }

  _handleResetCanvas = () => {
    this._handleClearCanvas();
    this.records = [];
    this.staredAt = null;
  }

  _handleRecord = (coodinates) => {
    const recordLen = this.records.length;
    
    if (recordLen > 0) {
      const gap = Date.now() - this.staredAt;
      const last = this.records[recordLen - 1];
      if (last[0] === coodinates[0]
        && last[1] === coodinates[1]
        && last[2] === coodinates[2]) {
        this.records[recordLen - 1][3].push(gap);
        return;
      } else {
        coodinates.push([gap])
      }
    } else {
      this.staredAt = Date.now();
      coodinates.push([0]);
    }
    this.records.push(coodinates);
  }

  _handleUpdateDistance = (index) => {
    if (!index) {
      index = this.records.length - 1;
    }
    const P = this.records[index - 1];
    const Q = this.records[index];
    const distance = distanceBetweenCoordinates(P[0], P[1], Q[0], Q[1]);
    this.setState({ distance: this.state.distance + distance }); 
  }

  _handleReply = async () => {
    this._handleClearCanvas();

    await Promise.all(this.records.map((record, index) => {
      return record[3].map((diff) => {
        return new Promise(resolve => {
          setTimeout(() => {
            this._handleDraw(record, index)
            resolve(1);
          }, diff);
        })
      })
    }));
  }

  _handleDraw = (coodinates, index) => {
    const ctx = this._getContext();

    const type = coodinates[2];
    switch(type) {
      case "D":
        ctx.beginPath();
        ctx.moveTo(coodinates[0], coodinates[1]);
        break;
      case "M":
        // Connecting the last point with current coordinates
        ctx.lineTo(coodinates[0], coodinates[1]);
        ctx.stroke();
        this._handleUpdateDistance(index);
        break;
    default:
        // Nothing
    }
  }

  _handleOnMouseDown = (e) => {
    // [X, Y, Type: (Down)]
    const coodinates = [
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY,
      "D"
    ];
    this.setState({ isDrawing: true }, () => {
      this._handleRecord(coodinates);
      this._handleDraw(coodinates);
    });
  }

  _handleOnMouseMove = (e) => {
    const { isDrawing } = this.state;
    // [X, Y, Type: (Move)]
    const coodinates = [
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY,
      "M"
    ];

    if (isDrawing) {
      this._handleRecord(coodinates);
      this._handleDraw(coodinates);
    }
  }

  _handleOnMouseUp = () => {
    const ctx = this._getContext();
    ctx.closePath();
    this.setState({ isDrawing: false });
  }

  records = [];
  staredAt = null;

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p> SUPER EFFICIENT DRAWING BOARD </p>
        </header>
        <div className="drawing-container">
          <div className="action-container">
            <button onClick={this._handleResetCanvas}> Reset </button>
            <button onClick={this._handleReply}> Play </button>
          </div>
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
        <h2>Distance: {parseFloat(this.state.distance).toFixed(2)} meter(s)</h2>
      </div>
    );
  }
}

export default App;
