import {canvas, ctx, resizeCanvas, renderPaths, drawLine, drawRectangle, drawCircle, undo, renderSquare, renderCircle, finishDrawing} from './functions'

const pencilTool = document.querySelector('.pencil')
const undoTool = document.querySelector('.undo')

let xLine
let yLine
let isPencilClicked = false
const square = document.querySelector('.square-shape')
const circle = document.querySelector('.circle-shape')

resizeCanvas()

let isRectangleClicked = false
let isCircleClicked = false

const pencilUse = () => {
    isPencilClicked = true
    isRectangleClicked = false
    isCircleClicked = false
    pencilTool.style.opacity = 0.5
    if(isPencilClicked === true) {
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
    let x = event.offsetX - xLine
    let y = event.offsetY - yLine

    if(isPencilClicked){
        isRectangleClicked = false
        drawLine(event)
    }

    if(isRectangleClicked){
        isCircleClicked = false
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        renderSquare(x, y, xLine, yLine)
        renderPaths()
    }

    if(isCircleClicked){
        isRectangleClicked = false
        isPencilClicked = false
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        renderCircle(x, xLine, yLine)
        renderPaths()
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

    finishDrawing(onMouseMove, undoTool)
    if(isRectangleClicked){
        isPencilClicked = false
        isCircleClicked = false
        drawRectangle(event, xLine, yLine)
    }

    if(isCircleClicked){
        isPencilClicked = false
        isRectangleClicked = false
        drawCircle(event, xLine, yLine)
    }
})

undoTool.addEventListener('click', () => {
    undo()
    ctx.beginPath()
})
