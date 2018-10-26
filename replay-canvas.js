const DONT_STORE = false

const getAbsolutePosition = (element) => {
  var r = { x: element.offsetLeft, y: element.offsetTop }
  if (element.offsetParent) {
    var tmp = getAbsolutePosition(element.offsetParent)
    r.x += tmp.x
    r.y += tmp.y
  }
  return r
}

const getRelativeCoordinates = (event, reference) => {
  const el = event.target || event.srcElement
  let pos
  let x, y
  let e

  if (!window.opera && typeof event.offsetX !== 'undefined') {
    // Use offset coordinates and find common offsetParent
    pos = { x: event.offsetX, y: event.offsetY }

    // Send the coordinates upwards through the offsetParent chain.
    e = el
    while (e) {
      e.mouseX = pos.x
      e.mouseY = pos.y
      pos.x += e.offsetLeft
      pos.y += e.offsetTop
      e = e.offsetParent
    }

    // Look for the coordinates starting from the reference element.
    e = reference
    const offset = { x: 0, y: 0 }
    while (e) {
      if (typeof e.mouseX !== 'undefined') {
        x = e.mouseX - offset.x
        y = e.mouseY - offset.y
        break
      }
      offset.x += e.offsetLeft
      offset.y += e.offsetTop
      e = e.offsetParent
    }

    // Reset stored coordinates
    e = el
    while (e) {
      e.mouseX = undefined
      e.mouseY = undefined
      e = e.offsetParent
    }
  } else {
    // Use absolute coordinates
    pos = getAbsolutePosition(reference)
    x = event.pageX - pos.x
    y = event.pageY - pos.y
  }
  // Subtract distance to middle
  return { x: x, y: y }
}

const canvas = document.getElementById('cool-draw')
canvas.setAttribute('width', document.getElementsByClassName('container')[0].clientWidth)

const ctx = canvas.getContext('2d')

let clickedPoints = []
let mousepressed = false
let distanceTravelled = 0
let start

const formsTriangle = (ptA, ptB, ptC) => ptA[0] * (ptB[1] - ptC[1]) + ptB[0] * (ptC[1] - ptA[1]) + ptC[0] * (ptA[1] - ptB[1])

const updateDistance = (num = clickedPoints.length) => {
  if (num > 1) {
    let p1 = clickedPoints[num - 2]
    let p2 = clickedPoints[num - 1]
    distanceTravelled += Math.hypot(p2[0] - p1[0], p2[1] - p2[1])
  }
  document.getElementById('distance-calculator').innerHTML = `Drawn ${distanceTravelled} meters.`
}

const addPoint = (obj, index) => {
  if (!clickedPoints.length) {
    start = Date.now()
    obj.push(0)
  } else {
    obj.push(Date.now() - start)
  }

  if (index) {
    clickedPoints[index] = obj
  } else {
    clickedPoints.push(obj)
  }
}

const draw = (pt, index) => {
  if (pt[2] === 'c') {
    ctx.beginPath()
    ctx.moveTo(pt[0], pt[1])
    mousepressed = true
  } else if (pt[2] === 'd' && mousepressed) {
    ctx.lineTo(pt[0], pt[1])
    ctx.stroke()
    updateDistance(index)
  } else if (pt[2] === 'r') {
    mousepressed = false
    ctx.closePath()
  } else if (pt[2] === 'w') {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  }
}

const mouseRecorder = ev => {
  const target = ev.target || ev.srcElement
  const coords = getRelativeCoordinates(ev, target)
  let obj = [
    coords.x,
    coords.y
  ]

  switch (ev.type) {
    case 'mousedown':
    case 'mouseup':

      obj.push(ev.type === 'mousedown' ? 'c' : 'r') // clicked = 'c' ; releases = 'r'
      addPoint(obj)
      break

    case 'mousemove':
      obj.push('d') // dragged = 'd'
      if (mousepressed) {
        if (clickedPoints.length > 2) {
          const numPointsRegistered = clickedPoints.length

          if (
            !formsTriangle(
              clickedPoints[numPointsRegistered - 2],
              clickedPoints[numPointsRegistered - 1],
              obj
            )
          ) {
            addPoint(obj, numPointsRegistered - 1)
          } else {
            addPoint(obj)
          }
        } else {
          addPoint(obj)
        }
      }
  }

  draw(obj)
}

const clearCanvas = (store = true) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  distanceTravelled = 0
  if (store) {
    addPoint([null, null, 'w'])
  }
  updateDistance()
}

const shred = () => {
  clearCanvas()

  clickedPoints = []
}

const replay = () => {
  const num = clickedPoints.length
  clearCanvas(DONT_STORE)
  canvas.removeEventListener('mousedown', mouseRecorder)
  canvas.removeEventListener('mousemove', mouseRecorder)
  canvas.removeEventListener('mouseup', mouseRecorder)
  clickedPoints.map((pt, index) => {
    setTimeout(() => {
      draw(pt, index)

      if (index === num - 1) {
        canvas.addEventListener('mousedown', mouseRecorder)
        canvas.addEventListener('mousemove', mouseRecorder)
        canvas.addEventListener('mouseup', mouseRecorder)
      }
    }, pt[3])
  })
}

clearCanvas(DONT_STORE)

canvas.addEventListener('mousedown', mouseRecorder)
canvas.addEventListener('mousemove', mouseRecorder)
canvas.addEventListener('mouseup', mouseRecorder)

const showPayload = () => {
  document.getElementById('payload').innerHTML = JSON.stringify(clickedPoints, null, 2)
}
