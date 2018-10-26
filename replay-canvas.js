
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
const ctx = canvas.getContext('2d')

const clickedPoints = []
let mousepressed = false

const formsTriangle = (ptA, ptB, ptC) => ptA.x * (ptB.y - ptC.y) + ptB.x * (ptC.y - ptA.y) + ptC.x * (ptA.y - ptB.y)

const clickRegister = ev => {
  const target = ev.target || ev.srcElement
  const coords = getRelativeCoordinates(ev, target)
  switch (ev.type) {
    case 'mousedown':
    case 'mouseup':
      clickedPoints.push({ x: coords.x, y: coords.y, t: ev.type })
      mousepressed = ev.type === 'mousedown'
      if (ev.type === 'mousedown') {
        ctx.beginPath()
        ctx.moveTo(coords.x, ev.y)
      } else {
        ctx.closePath()
      }
      break

    case 'mousemove':
      if (mousepressed) {
        if (clickedPoints.length > 2) {
          const numPointsRegistered = clickedPoints.length

          if (
            !formsTriangle(
              clickedPoints[numPointsRegistered - 2],
              clickedPoints[numPointsRegistered - 1],
              { x: coords.x, y: coords.y }
            )
          ) {
            clickedPoints[numPointsRegistered - 1] = { x: coords.x, y: coords.y, t: ev.type }
          } else {
            clickedPoints[numPointsRegistered] = { x: coords.x, y: coords.y, t: ev.type }
          }
        } else {
          clickedPoints.push({ x: coords.x, y: coords.y, t: ev.type })
        }

        ctx.lineTo(coords.x, coords.y)
        ctx.stroke()
      }
  }
}

const clearCanvas = () => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

clearCanvas()

canvas.addEventListener('mousedown', clickRegister)
canvas.addEventListener('mousemove', clickRegister)
canvas.addEventListener('mouseup', clickRegister)
