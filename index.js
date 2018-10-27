(function () {
  const canvas = document.getElementById('canvas')
  const replay = document.getElementById('replay')
  const distance = document.getElementById('distance')
  const canvasContext = canvas.getContext('2d')

  let startX = 0
  let startY = 0
  let recordingStarted = false

  let totalDistance = 0

  let startTime = new Date()
  let events = []

  const drawLine = (startX, startY, endX, endY) => {
    canvasContext.beginPath();
    canvasContext.strokeStyle = 'black';
    canvasContext.moveTo(startX, startY);
    canvasContext.lineTo(endX, endY);
    canvasContext.stroke();
  }

  const updateTotalDistance = (startX, startY, endX, endY) => {
    totalDistance += Math.sqrt((endX - startX) * (endX - startX) + (endY - startY) * (endY - startY));
    distance.innerText = `Distance Covered: ${Math.round(totalDistance * 100) / 100} m`;
  }

  const recordStart = (event) => {
    recordingStarted = true

    // Record the start of the line
    const boundingRect = event.target.getBoundingClientRect()
    startX = event.clientX - boundingRect.left
    startY = event.clientY - boundingRect.top
  }

  const recordStop = (event) => {
    if (recordingStarted) {
      recordingStarted = false

      // Compute time delay
      const endTime = new Date()
      const timeDifference = endTime - startTime
      startTime = endTime

      // Compute the end of the line
      const boundingRect = event.target.getBoundingClientRect()
      const endX = event.clientX - boundingRect.left
      const endY = event.clientY - boundingRect.top

      // Draw the line
      drawLine(startX, startY, endX, endY)

      // Update the distance covered
      updateTotalDistance(startX, startY, endX, endY)

      // Record the event
      events.push([timeDifference, startX, startY, endX, endY])
    }
  }

  const replayEvent = (eventId = 0) => {
    if (eventId === events.length) {
      startTime = new Date()

      return
    }

    // Get current event data
    const [timeDifference, startX, startY, endX, endY] = events[eventId]

    // Reset canvas and distance
    if (eventId === 0) {
      canvasContext.clearRect(0, 0, canvas.width, canvas.height)

      totalDistance = 0
    }

    setTimeout(() => {
      // Draw the line
      drawLine(startX, startY, endX, endY)

      // Update the distance covered
      updateTotalDistance(startX, startY, endX, endY)

      // Replay next event
      replayEvent(eventId + 1)
    }, timeDifference)
  }

  // Add listeners
  canvas.addEventListener('mousedown', recordStart)
  canvas.addEventListener('mouseleave', recordStop)
  canvas.addEventListener('mouseup', recordStop)
  replay.addEventListener('click', () => replayEvent())
})();
