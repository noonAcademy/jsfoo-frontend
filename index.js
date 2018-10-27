(function () {
  const canvas = document.getElementById('canvas')
  const replayButton = document.getElementById('replay')
  const toggleDrawModeButton = document.getElementById('toggle-draw-mode')
  const distance = document.getElementById('distance')
  const canvasContext = canvas.getContext('2d')

  let startX = 0
  let startY = 0
  let recordingStarted = false
  let endX = 0
  let endY = 0

  // use flag to control whether to draw line segments or free-hand drawing
  let drawAsLine = true

  let startTime = new Date()
  let totalDistance = 0
  let events = []

  const drawLine = (startX, startY, endX, endY) => {
    canvasContext.beginPath()
    canvasContext.strokeStyle = 'black'
    canvasContext.moveTo(startX, startY)
    canvasContext.lineTo(endX, endY)
    canvasContext.stroke()
  }

  const updateTotalDistance = (startX, startY, endX, endY) => {
    totalDistance += Math.sqrt((endX - startX) * (endX - startX) + (endY - startY) * (endY - startY))
    distance.innerText = `Distance Covered: ${Math.round(totalDistance * 100) / 100} m`
  }

  const recordStart = (event) => {
    recordingStarted = true

    // Record the start of the line
    const boundingRect = event.target.getBoundingClientRect()
    startX = event.clientX - boundingRect.left
    startY = event.clientY - boundingRect.top
  }

  const recordDrag = (event) => {
    if (recordingStarted) {
      // Compute time delay
      const endTime = new Date()
      const timeDifference = endTime - startTime
      startTime = endTime

      // Compute the end of the line
      const boundingRect = event.target.getBoundingClientRect()
      endX = event.clientX - boundingRect.left
      endY = event.clientY - boundingRect.top

      if (drawAsLine) {
        // Clear canvas
        canvasContext.clearRect(0, 0, canvas.width, canvas.height)

        // Repaint lines
        for (const [_, startX, startY, endX, endY, isEndpoint] of events) {
          if (isEndpoint) {
            drawLine(startX, startY, endX, endY)
          }
        }
      }

      // Draw the line
      drawLine(startX, startY, endX, endY)

      // Record the event
      events.push([timeDifference, startX, startY, endX, endY, false])

      if (!drawAsLine) {
        // Update the distance covered
        updateTotalDistance(startX, startY, endX, endY)

        // Reset start of line
        startX = endX
        startY = endY
      }

    }
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
      endX = event.clientX - boundingRect.left
      endY = event.clientY - boundingRect.top

      // Draw the line
      drawLine(startX, startY, endX, endY)

      // Update the distance covered
      updateTotalDistance(startX, startY, endX, endY)

      // Record the event
      events.push([timeDifference, startX, startY, endX, endY, true])
    }
  }

  const replayEvent = (eventId = 0) => {
    if (eventId === events.length) {
      startTime = new Date()

      return
    }

    // Get current event data
    const [timeDifference, startX, startY, endX, endY, isEndpoint] = events[eventId]

    // Reset canvas and distance
    if (eventId === 0) {
      canvasContext.clearRect(0, 0, canvas.width, canvas.height)

      totalDistance = 0
    }

    setTimeout(() => {
      if (drawAsLine) {
        // Animate drawing of the lines
        for (let currentEventId in events) {
          if (currentEventId > eventId) break

          const [_, startX, startY, endX, endY, isEndpoint] = events[currentEventId]

          canvasContext.clearRect(0, 0, canvas.width, canvas.height)

          drawLine(startX, startY, endX, endY)
        }

        // Redraw the lines
        for (let currentEventId in events) {
          if (currentEventId > eventId) break

          const [_, startX, startY, endX, endY, isEndpoint] = events[currentEventId]

          if (!isEndpoint) continue

          drawLine(startX, startY, endX, endY)
        }

        // Update the distance covered
        if (isEndpoint) {
          updateTotalDistance(startX, startY, endX, endY)
        }
      } else {
        drawLine(startX, startY, endX, endY)

        updateTotalDistance(startX, startY, endX, endY)
      }

      // Replay next event
      replayEvent(eventId + 1)
    }, timeDifference)
  }

  const toggleDrawMode = () => {
    drawAsLine = !drawAsLine

    canvasContext.clearRect(0, 0, canvas.width, canvas.height)

    toggleDrawModeButton.innerText = drawAsLine ? 'Switch to Free Hand Mode' : 'Switch to Line Mode'
    distance.innerText = 'Distance Covered: 0.00 m'


    startTime = new Date()
    totalDistance = 0
    events = []
  }

  // Add listeners
  canvas.addEventListener('mousedown', recordStart)
  canvas.addEventListener('mousemove', recordDrag)
  canvas.addEventListener('mouseleave', recordStop)
  canvas.addEventListener('mouseup', recordStop)
  replayButton.addEventListener('click', () => replayEvent())
  toggleDrawModeButton.addEventListener('click', toggleDrawMode)
})()
