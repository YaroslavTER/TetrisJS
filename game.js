var canvas = document.getElementById('canvas_id')
var ctx = canvas.getContext('2d')
var side = 20, rows = 10, colums = 20
var field=[[]]
var figure = { blocks:[[0,0],[0,1],[0,2],[1,1]], x: 0, y: 0}

function SetField(value){
    for(var row_index = 0; row_index < rows; row_index++){
        field[row_index] = new Array()
        for(var col_index = 0; col_index < colums; col_index++)
            field[row_index][col_index] = value
    }
}

function AddFigureToField(){

}

function Draw(){
    ctx.fillStyle = '#000000'
    for(var row_index = 0; row_index < rows; row_index++)
        for(var col_index = 0; col_index < colums; col_index++)
            if(field[row_index][col_index])
                ctx.fillRect(row_index*side, col_index*side, side, side)
}

function MoveDown(){
    for(var row_index = rows - 1; row_index >= 0; row_index--){
        for(var col_index = colums - 1; col_index >= 0; col_index--){
            if(field[row_index][col_index] && (col_index == colums-1 || field[row_index][col_index+1])){
                col_index = colums-1
                row_index = rows-1
            } else if(field[row_index][col_index] && (col_index+1 < colums && !field[row_index][col_index+1])){
                field[row_index][col_index+1]=true
                field[row_index][col_index]=false
            }
        }
    }
}

function MoveRight(){
    for(var row_index = rows - 1; row_index >= 0; row_index--){
        for(var col_index = colums - 1; col_index >= 0; col_index--){
            if(field[row_index][col_index] && (row_index == rows-1 && field[row_index+1][col_index])){

            } else if(field[row_index][col_index] && (row_index+1 < rows && !field[row_index+1][col_index])){//} && !(row_index == rows-1 && field[row_index+1][col_index])){
                field[row_index+1][col_index]=true
                field[row_index][col_index]=false
            }
        }
    }
}

function MoveLeft(){
    for(var row_index = 0; row_index < rows; row_index++)
        for(var col_index = 0; col_index < colums; col_index++)
            if(field[row_index][col_index] && (row_index == 0 && field[row_index-1][col_index])){

            } else if(field[row_index][col_index] && (row_index-1 >= 0 && !field[row_index-1][col_index])){
                field[row_index-1][col_index]=true
                field[row_index][col_index]=false
            }
}

SetField(false)
field[5][1]=true
field[6][1]=true
field[5][2]=true
field[5][3]=true
Draw()
document.addEventListener('keydown', function(event) {
    console.log(event.which)
    var keycode = (event.keyCode ? event.keyCode : event.which)
    if(event.which == 39){
        MoveRight()
        ctx.clearRect(0,0,rows*side,colums*side)
        Draw()
    }
    if(event.which == 37){
        MoveLeft()
        ctx.clearRect(0,0,rows*side,colums*side)
        Draw()
    }
})

setInterval(function(){
    MoveDown()
    ctx.clearRect(0,0,rows*side,colums*side)
    Draw()
},500)
