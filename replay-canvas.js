
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

const formsTriangle = (ptA, ptB, ptC) => ptA.x * (ptB.y - ptC.y) + ptB.x * (ptC.y - ptA.y) + ptC.x * (ptA.y - ptB.y)

const updateDistance = (num = clickedPoints.length) => {
  if (num > 1) {
    let p1 = clickedPoints[num - 2]
    let p2 = clickedPoints[num - 1]
    distanceTravelled += Math.hypot(p2.x - p1.x, p2.y - p2.y)
  }
  document.getElementById('distance-calculator').innerHTML = `Drawn ${distanceTravelled} meters.`
}

const addPoint = ({ x, y, t }, index) => {
  let obj = {
    x,
    y,
    t
  }

  if (!clickedPoints.length) {
    start = Date.now()
    obj.d = 0
  } else {
    obj.d = Date.now() - start
  }

  if (index) {
    clickedPoints[index] = obj
  } else {
    clickedPoints.push(obj)
  }
}

const draw = (pt, index) => {
  if (pt.t === 'c') {
    ctx.beginPath()
    ctx.moveTo(pt.x, pt.y)
    mousepressed = true
  } else if (pt.t === 'd' && mousepressed) {
    ctx.lineTo(pt.x, pt.y)
    ctx.stroke()
    updateDistance(index)
  } else if (pt.t === 'r') {
    mousepressed = false
    ctx.closePath()
  }
}

const mouseRecorder = ev => {
  const target = ev.target || ev.srcElement
  const coords = getRelativeCoordinates(ev, target)
  let obj = {
    x: coords.x, y: coords.y
  }

  switch (ev.type) {
    case 'mousedown':
    case 'mouseup':

      obj.t = ev.type === 'mousedown' ? 'c' : 'r' // clicked = 'c' ; releases = 'r'
      addPoint(obj)
      break

    case 'mousemove':
      obj.t = 'd' // dragged = 'd'
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

const clearCanvas = () => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  distanceTravelled = 0
  updateDistance()
}

const shred = () => {
  clearCanvas()

  clickedPoints = []
}

const replay = () => {
  const num = clickedPoints.length
  clearCanvas()
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
    }, pt.d)
  })
}

clearCanvas()

canvas.addEventListener('mousedown', mouseRecorder)
canvas.addEventListener('mousemove', mouseRecorder)
canvas.addEventListener('mouseup', mouseRecorder)

const showPayload = () => {
  document.getElementById('payload').innerHTML = JSON.stringify(clickedPoints, null, 2)
}
