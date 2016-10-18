var canvas = document.getElementById('canvas_id')
var ctx = canvas.getContext('2d')
var side = 20, rows = 10, colums = 20, time = 500, falltime = time
var figures = [], colors = ['#07977B', '#424C4A','#7E1B28','#207E1B']

var figureTemplates = [
    [[0,0],[0,1],[0,2],[1,0]],
    [[0,0],[0,1],[0,2],[0,3]],
    [[0,0],[0,1],[0,2],[1,1]],
    [[0,0],[0,1],[1,0],[1,1]]
]

function AddFigure(){
    var f = { x: 0, y: 0}
    f.color=''
    f = SetColor(f)
    f.blocks = figureTemplates[getRandInt(0,figureTemplates.length-1)]
    figures.push(f)
}

function GetFigureDim(){
    var f = figures[figures.length-1]
    var height = 0, width = 0
    for(var i = 0; i < f.blocks.length; i++){
        if(f.blocks[i][0] > height){
            height = f.blocks[i][0]
        }
        if(f.blocks[i][1] > width){
            width = f.blocks[i][1]
        }
    }
    return {width: height, height: width}
}

function SetColor(input_figure){
    var new_color = colors[getRandInt(0,colors.length)]
    while(figures.length != 0 && new_color.localeCompare(figures[figures.length-1].color) == 0){
        new_color = colors[getRandInt(0,colors.length)]
    }
    input_figure.color = new_color
    return input_figure
}

function DrawField(){
    ctx.clearRect(0,0,(rows+1)*side,(colums+1)*side)
    for(var i = 0; i < figures.length; i++ ){
        var f = figures[i]
        ctx.fillStyle = f.color
        for(var j = 0; j < f.blocks.length; j++){
            ctx.fillRect((f.blocks[j][0]+f.x)*side, (f.blocks[j][1]+f.y)*side, side, side)
        }
    }
}
function MoveLeft(){
    var f = figures[figures.length-1]
    if( f.x-1 >= 0 ){
        f.x--
    }
}

function MoveRight(){
    var f = figures[figures.length-1]
    var dim = GetFigureDim()
    if( f.x+1 < rows-dim.width ){
        f.x++
    }
}

function MoveDown(){
    var f = figures[figures.length-1]
    // тут типа надо будет посчитать высоту фигуры
    // оно еще будет меняться когда будет вращаться БЛЯ
    // пока пусть будет три
    if( f.y < colums-3){
        f.y++
    }else {
        AddFigure()
    }
    // тут еще надо будет прикольчик сделать типа если достигли дна
    // то эту фигуру замораживаем и создаем новую
}

function Rotate(){

}

// Main
AddFigure()
DrawField()

setInterval(function(){
    MoveDown()
    DrawField()
},falltime)

// Listeners
document.addEventListener('keydown', function(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which)
    if(event.which == 39){
        MoveRight()
    } else if(event.which == 37){
        MoveLeft()
    } else MoveDown()
    if(event.which == 40 ){
        falltime /= 2
    }
    DrawField()
})

// util
function getRandInt(min,max){
    return Math.floor(Math.random() * (max - min + 1)) + min
}
