(function () {
  const canvas = document.getElementById('canvas')
  const distance = document.getElementById('distance')
  const canvasContext = canvas.getContext('2d')

  let startX = 0
  let startY = 0
  let recordingStarted = false
  let totalDistance = 0

  const recordStart = (e) => {
    recordingStarted = true

    // Record the start of the line
    const boundingRect = e.target.getBoundingClientRect()
    startX = e.clientX - boundingRect.left
    startY = e.clientY - boundingRect.top
  }

  const recordStop = (e) => {
    if (recordingStarted) {
      recordingStarted = false

      // Record the end of the line
      const boundingRect = e.target.getBoundingClientRect()
      const endX = e.clientX - boundingRect.left
      const endY = e.clientY - boundingRect.top

      // Draw the line
      canvasContext.beginPath()
      canvasContext.strokeStyle = 'black'
      canvasContext.moveTo(startX, startY)
      canvasContext.lineTo(endX, endY)
      canvasContext.stroke()

      // Update the distance covered
      totalDistance += Math.sqrt((endX - startX) * (endX - startX) + (endY - startY) * (endY - startY))
      distance.innerText = `Distance Covered: ${Math.round(totalDistance * 100) / 100} m`
    }
  }

  canvas.addEventListener('mousedown', recordStart)
  canvas.addEventListener('mouseleave', recordStop)
  canvas.addEventListener('mouseup', recordStop)
})();
