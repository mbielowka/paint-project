export const canvas = document.getElementById('drawing-board')
export const ctx = canvas.getContext('2d')
const colorPicker = document.querySelector('.colorpicker')
const lineWidthSlider = document.querySelector('.slider')
let lines = []
let allLines = []
let squares = []
let circles = []

export const resizeCanvas = () => {
    canvas.width = window.innerWidth - 100
    canvas.height = 1000
}

export const renderPaths = () => {
    allLines.forEach(line => {
        if('path' in line){
            ctx.beginPath()
            ctx.lineWidth = line.width
            ctx.strokeStyle = line.color

            line.path.forEach(path => {
                path.forEach(element => {
                    const[x, y] = element
                    ctx.lineTo(x, y)
                })
            })
            
            ctx.lineCap = 'round'
            ctx.stroke()
            ctx.closePath()
        }
        if('shape' in line){
            line.shape.forEach(shape => {
                shape.forEach(([x, y, w, h]) => {
                    ctx.lineWidth = line.width
                    ctx.strokeStyle = line.color
                    ctx.strokeRect(x, y, w, h)
                })
            })
        }
        if('shapeArc' in line){
            line.shapeArc.forEach(shapeArc => {
                shapeArc.forEach(([x, y, r, a, b]) => {
                    ctx.lineWidth = line.width
                    ctx.strokeStyle = line.color
                    ctx.beginPath()
                    ctx.arc(x, y, r, a, b)
                    ctx.stroke()
                    ctx.closePath()
                })
            })
        }
    })
}

export const renderSquare = (x, y, xLine, yLine) => {
    ctx.lineWidth = lineWidthSlider.value
    ctx.strokeStyle = colorPicker.value
    ctx.strokeRect(xLine, yLine, x, y)
    
}

export const renderCircle = (x, xLine, yLine) => {
    ctx.lineWidth = lineWidthSlider.value
    ctx.strokeStyle = colorPicker.value
    ctx.beginPath()
    ctx.arc(xLine, yLine, Math.abs(x), 0, 2 * Math.PI)
    ctx.stroke()
    ctx.closePath()
}

export const drawLine = (event) => {
    ctx.lineWidth = lineWidthSlider.value
    ctx.lineCap = 'round'
    ctx.strokeStyle = colorPicker.value
    
    ctx.lineTo(event.offsetX, event.offsetY)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(event.offsetX, event.offsetY)
    ctx.closePath()
    
    lines = lines.concat([[event.offsetX, event.offsetY]])
}

export const drawRectangle = (event, xLine, yLine) => { 
    let width = event.offsetX - xLine
    let height = event.offsetY - yLine
    ctx.lineWidth = lineWidthSlider.value
    ctx.strokeStyle = colorPicker.value
    ctx.strokeRect(xLine, yLine, width, height)
    squares = squares.concat([[xLine, yLine, width, height]])
    allLines = allLines.concat({color:colorPicker.value, width: lineWidthSlider.value, shape:[squares]})
    squares = []
}

export const drawCircle = (event, xLine, yLine) => {
    let r = Math.abs(event.offsetX - xLine)
    ctx.lineWidth = lineWidthSlider.value
    ctx.strokeStyle = colorPicker.value
    ctx.beginPath()
    ctx.arc(xLine, yLine, r, 0, 2 * Math.PI)
    circles = circles.concat([[xLine, yLine, r, 0, 2 * Math.PI]])
    ctx.stroke()
    ctx.closePath()
    allLines = allLines.concat({color:colorPicker.value, width: lineWidthSlider.value, shapeArc:[circles]})
    circles = []
}
export const finishDrawing = (onMouseMove, undoTool) => {
    ctx.beginPath()
    canvas.removeEventListener('mousemove', onMouseMove)
    if(lines.length < 1) {
        return
    }

    allLines = allLines.concat({color:colorPicker.value, width: lineWidthSlider.value, path:[lines]})
    lines = []
    if(allLines.length > 0) {
        undoTool.style.opacity = 1
    } 
}

export const undo = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    allLines = allLines.slice(0, -1)
    renderPaths()
}
