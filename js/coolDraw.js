{
  // to restrict use of global variable, we are not using onClick in HTML
  const playBtn = document.getElementById('playBtn');
  const captureBtn = document.getElementById('captureBtn');
  const clearBtn = document.getElementById('clearBtn');
  const stopBtn = document.getElementById('stopBtn');
  const myCanvas = document.getElementById('myCanvas');
  const distanceEle = document.getElementById('distance');
  const distanceContainer = document.getElementById('distanceContainer');

  const show = function() {
    this.style.display = 'inline';
  };
  const showBlock = function() {
    this.style.display = 'block';
  };

  const hide = function() {
    this.style.display = 'none';
  };

  const stopCapturing = (drawing) => {
    captureBtn.show();
    stopBtn.hide();
    playBtn.show();
    clearBtn.show();

    drawing.stopCapturing();
  };

  const startCapturing = (drawing) => {
    playBtn.hide();
    captureBtn.hide();
    stopBtn.show();
    clearBtn.hide();

    drawing.startCapturing();
  };

  const startPlayback = (drawing) => {
    drawing.replayEvents(() => {
      //on playback start
      playBtn.hide();
      captureBtn.hide();
      clearBtn.hide();
      distanceContainer.hide();
    }, () => {
      //on playback end
      playBtn.show();
      captureBtn.show();
      clearBtn.show();
      distanceContainer.show();
    });
  };

  window.addEventListener('load', () => {

    HTMLInputElement.prototype.show = show;
    HTMLDivElement.prototype.show = showBlock;
    HTMLInputElement.prototype.hide = hide;
    HTMLDivElement.prototype.hide = hide;

    playBtn.hide();
    stopBtn.hide();

    // initializing canvas event Handlers
    const drawing = new CanvasDrawing(myCanvas, distanceEle);

    captureBtn.addEventListener('click', () => {
      startCapturing(drawing);
    });

    stopBtn.addEventListener('click', () => {
      stopCapturing(drawing);
    });

    playBtn.addEventListener('click', () => {
      startPlayback(drawing);
    });

    clearBtn.addEventListener('click', () => {
      drawing.clearCanvas();
    });
  }, false);
}
