(function () {
  const canvas = document.getElementById('canvas')
  const canvasContext = canvas.getContext('2d')

  let startX = 0
  let startY = 0
  let recordingStarted = false

  const recordStart = (e) => {
    recordingStarted = true
    
    const boundingRect = e.target.getBoundingClientRect()
    startX = e.clientX - boundingRect.left
    startY = e.clientY - boundingRect.top
  }

  const recordStop = (e) => {
    if (recordingStarted) {
      recordingStarted = false

      const boundingRect = e.target.getBoundingClientRect()
      const endX = e.clientX - boundingRect.left
      const endY = e.clientY - boundingRect.top

      canvasContext.beginPath()
      canvasContext.strokeStyle = 'black'
      canvasContext.moveTo(startX, startY)
      canvasContext.lineTo(endX, endY)
      canvasContext.stroke()
    }
  }

  canvas.addEventListener('mousedown', recordStart)
  canvas.addEventListener('mouseleave', recordStop)
  canvas.addEventListener('mouseup', recordStop)
})();
