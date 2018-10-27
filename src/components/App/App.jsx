import React, { Component } from 'react';
import DrawingBoard from '../DrawingBoard/DrawingBoard';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      totalDistCovered: 0,
      lines: [],
      replayLineInd: 0,
      pointInd: 0,
      isReplay: false
    };
    this.beginTime = new Date().getTime();
  }

  incrementDistCovered = (curLine) => {
    const { x: begX, y: begY } = curLine[0];
    const { x: endX, y: endY } = curLine[curLine.length - 1];
    const distanceCovered = Math.sqrt(Math.pow(endY - begY, 2) + Math.pow(endX - begX, 2));
    if (this.state.isReplay) {
      this.setState((prevState) => (
        {
          totalDistCovered: prevState.totalDistCovered + distanceCovered,
        }
      ));
    } else {
      this.setState((prevState) => (
        {
          totalDistCovered: prevState.totalDistCovered + distanceCovered,
          lines: [...prevState.lines, curLine]
        }
      ));
    }
  }

  startReplay = () => {
    this.setState({
      isReplay: true,
      replayLineInd: 0,
      pointInd: 0,
      totalDistCovered: 0
    });
  };

  updateReplayInd = () => {
    this.setState({
      replayLineInd: this.state.replayLineInd + 1,
      pointInd: 0,
      isReplay: this.state.replayLineInd + 1 !== this.state.lines.length,
    });
  };

  updatePointInd = () => {
    console.log(this.state.pointInd);
    this.setState({
      pointInd: this.state.pointInd + 1
    });
  };

  render() {
    const { isReplay, lines, replayLineInd, pointInd } = this.state;
    return (
      <React.Fragment>
        <DrawingBoard
          isReplay={isReplay}
          lines={lines}
          replayLineInd = {replayLineInd}
          pointInd={pointInd}
          beginTime={this.beginTime}
          updatePointInd={this.updatePointInd}
          updateReplayInd={this.updateReplayInd}
          incrementDistCovered={this.incrementDistCovered}
        />
        <div>
          <input type="button" value="Replay" onClick={this.startReplay} />
          <label>Total Distance {this.state.totalDistCovered}m</label>
        </div>
      </React.Fragment>
    );
  }
}

export default App;

