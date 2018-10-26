(function () {
  const canvas = document.getElementById('canvas')
  const distance = document.getElementById('distance')
  const canvasContext = canvas.getContext('2d')

  let startX = 0
  let startY = 0
  let recordingStarted = false

  let totalDistance = 0

  let startTime = new Date()
  let events = []

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

      // Compute time delay
      const endTime = new Date()
      const timeDifference = endTime - startTime
      startTime = endTime

      // Compute the end of the line
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

      // Record the event
      events.push([timeDifference, startX, startY, endX, endY])
    }
  }

  canvas.addEventListener('mousedown', recordStart)
  canvas.addEventListener('mouseleave', recordStop)
  canvas.addEventListener('mouseup', recordStop)
})();
