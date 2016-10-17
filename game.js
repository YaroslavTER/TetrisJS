var canvas = document.getElementById('canvas_id')
var ctx = canvas.getContext('2d')
var side = 20, rows = 10, colums = 20
// у фигуры должен быть свой цвет
// но ето потом
var figure = { blocks:[[0,0],[0,1],[0,2],[1,1]], x: 0, y: 0}
var figures = []

function DrawField(){
    ctx.clearRect(0,0,(rows+1)*side,(colums+1)*side)
    ctx.fillStyle = '#000000'
    for(var i = 0; i < figures.length; i++ ){
        var f = figures[i]
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
    // а тут ширину
    if( f.x+1 < rows-1 ){
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
    }
    // тут еще надо будет прикольчик сделать типа если достигли дна
    // то эту фигуру замораживаем и создаем новую
}

// Main
figures.push(figure)
DrawField()


document.addEventListener('keydown', function(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which)
    if(event.which == 39){
        MoveRight()
    }
    if(event.which == 37){
        MoveLeft()
    }
    DrawField()
})

setInterval(function(){
    MoveDown()
    DrawField()
},500)
