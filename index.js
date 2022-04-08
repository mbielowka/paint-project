import * as helpers from './functions'
import { canvas, ctx } from './functions'

const pencilTool = document.querySelector('.toolbar__pencil')
const undoTool = document.querySelector('.toolbar__undo')

let xLine
let yLine
let isPencilClicked = false
const square = document.querySelector('.toolbar__square-shape')
const circle = document.querySelector('.toolbar__circle-shape')

helpers.resizeCanvas()

let isRectangleClicked = false
let isCircleClicked = false

const pencilUse = () => {
    isPencilClicked = true
    isRectangleClicked = false
    isCircleClicked = false
    pencilTool.style.opacity = 0.5

    if(isPencilClicked) {
        ctx.beginPath()
        square.style.opacity = 1
    }
}

pencilTool.addEventListener('click', pencilUse)

square.addEventListener('click', () => {
    isRectangleClicked = true
    isPencilClicked = false
    isCircleClicked = false
    square.style.opacity = 0.5
    pencilTool.style.opacity = 1
    undoTool.style.opacity = 1
    circle.style.opacity = 1
})

circle.addEventListener('click', () => {
    isCircleClicked = true
    isPencilClicked = false
    isRectangleClicked = false
    circle.style.opacity = 0.5
    square.style.opacity = 1
    pencilTool.style.opacity = 1
    undoTool.style.opacity = 1
})

const onMouseMove = event => {
    const x = event.offsetX - xLine
    const y = event.offsetY - yLine

    if(isPencilClicked){
        isRectangleClicked = false
        helpers.drawLine(event)
    }

    if(isRectangleClicked){
        isCircleClicked = false
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        helpers.renderSquare(x, y, xLine, yLine)
        helpers.renderPaths()
    }

    if(isCircleClicked){
        isRectangleClicked = false
        isPencilClicked = false
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        helpers.renderCircle(x, xLine, yLine)
        helpers.renderPaths()
    }
}

canvas.addEventListener('mousedown', event => {
    xLine = event.offsetX
    yLine = event.offsetY

    if(isPencilClicked){
        isRectangleClicked = false
        isCircleClicked = false
    }

    canvas.addEventListener('mousemove', onMouseMove)
})

canvas.addEventListener('mouseup', event => {
    helpers.finishDrawing(onMouseMove, undoTool)
    
    if(isRectangleClicked){
        isPencilClicked = false
        isCircleClicked = false
        helpers.drawRectangle(event, xLine, yLine)
    }

    if(isCircleClicked){
        isPencilClicked = false
        isRectangleClicked = false
        helpers.drawCircle(event, xLine, yLine)
    }
})

undoTool.addEventListener('click', () => {
    helpers.undo()
    ctx.beginPath()
})
