import React, { Component, createRef } from 'react';
import './DrawingBoard.css';

class DrawingBoard extends Component {
  constructor(props) {
    super(props);

    this.canvasData = {
      curLine: [],
      isDrawing: false,
    };
    this.canvasRef = createRef();
  }

  componentDidMount() {
    const canvas = this.canvasRef.current;
    this.ctx = canvas.getContext('2d');
    this.ctx.fillStyle = 'black';
    this.ctx.beginPath();
  }

  updatePointer = () => {
    const { lines, replayLineInd, pointInd, updatePointInd } = this.props;
    if (lines[replayLineInd][pointInd + 1]) {
      const diff = lines[replayLineInd][pointInd + 1].diffFromBegin - lines[replayLineInd][pointInd].diffFromBegin;
      setTimeout(updatePointInd, diff)
    }
  };

  updateLineWithDelay = () => {
    const { lines, replayLineInd, pointInd, updateReplayInd } = this.props;
    if (lines[replayLineInd + 1]) {
      const diff =  lines[replayLineInd + 1][0].diffFromBegin - lines[replayLineInd][pointInd].diffFromBegin;
      setTimeout(updateReplayInd, diff);
    }
  };

  componentDidUpdate(prevProps) {
    const { lines, replayLineInd, pointInd } = this.props;
    if (this.props.isReplay) {
      if (prevProps.isReplay !== this.props.isReplay) {
        this.canvasBeforeMouseMove = null;
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.startLine({clientX: lines[replayLineInd][0].x, clientY: lines[replayLineInd][0].y});
        this.updatePointer();
      } else if (prevProps.replayLineInd !== this.props.replayLineInd) {
        this.startLine({clientX: lines[replayLineInd][0].x, clientY: lines[replayLineInd][0].y});
        this.updatePointer();
      } else if (prevProps.pointInd !== this.props.pointInd) {
        if (this.props.pointInd === lines[replayLineInd].length - 1) {
          this.endLine({clientX: lines[replayLineInd][pointInd].x, clientY: lines[replayLineInd][pointInd].y});
          this.updateLineWithDelay();
        } else if (this.props.pointInd < lines[replayLineInd].length - 1){
          this.eraseTempAndCreateNewLine({clientX: lines[replayLineInd][pointInd].x, clientY: lines[replayLineInd][pointInd].y});
          this.updatePointer();
        }
      }
    }
  }

  getCorrectedPosition = (x, y) => {
    if (this.props.isReplay) {
      return { x, y};
    }
    return {
      x: x - this.ctx.canvas.offsetLeft,
      y: y - this.ctx.canvas.offsetTop,
    };
  }

  createLine = (event) => {
    this.ctx.beginPath();
    const { curLine } = this.canvasData;
    const { x: begX, y: begY } = curLine[0];
    const { x: endX, y: endY } = this.getCorrectedPosition(event.clientX, event.clientY);
    this.ctx.moveTo(begX, begY);
    this.ctx.lineTo(endX, endY);
    this.ctx.stroke();
    this.ctx.closePath();
    const diffFromBegin = new Date().getTime() - this.props.beginTime;
    this.canvasData.curLine.push({x: endX, y: endY, diffFromBegin: diffFromBegin});
  };

  startLine = (event) => {
    const { clientX, clientY } = event;
    this.ctx.moveTo(clientX, clientY);
    this.canvasData = {
      isDrawing: true,
      curLine: [{
        ...this.getCorrectedPosition(clientX, clientY),
        diffFromBegin: new Date().getTime() - this.props.beginTime
      }]
    };
    this.canvasBeforeMouseMove = this.ctx.getImageData(0, 0, this.ctx.canvas.clientWidth, this.ctx.canvas.clientHeight);
  }

  eraseTempAndCreateNewLine = (event) => {
    if (!this.canvasData.isDrawing) {
      return false;
    }
    this.ctx.putImageData(this.canvasBeforeMouseMove, 0, 0);
    this.createLine(event);
    return true;
  };

  endLine = (event) => {
    if(this.eraseTempAndCreateNewLine(event)) {
      this.canvasBeforeMouseMove = null;
      this.canvasData.isDrawing = false;
      this.props.incrementDistCovered(this.canvasData.curLine);
      this.canvasData.curLine = [];
    }
  };

  render() {
    return (
      <canvas
        ref={this.canvasRef}
        className="drawing-board"
        onMouseDown={this.startLine}
        onMouseMove={this.eraseTempAndCreateNewLine}
        onMouseOut={this.endLine}
        onMouseUp={this.endLine}
        width={400}
        height={400}
      />
    );
  }
}

export default DrawingBoard;
