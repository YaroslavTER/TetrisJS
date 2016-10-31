var canvas = document.getElementById('canvas_id')
var ctx = canvas.getContext('2d')
var side = 20, rows = 10, colums = 20, falltime = 500
var figures = []
var colors = ['#FF420E', '#6897BB', '#FF7373', '#008080', '#567E35','#F44336',
              '#E91E63','#9C27B0','#673AB7','#3F51B5','#2196F3','#03A9F4','#8BC34A','#009688',
              '#FFEB3B','#FFC107','#FF9800','#795548','#607D8B','#9E9E9E']
var mainGameCycle
var gameStatus = 'stop'
var score = {
    _score: 0,
    add: function(n){
        this._score += n
        this.updateScore()
    },
    updateScore: function(){
        var s = document.getElementById('s')
        s.innerHTML = 'Score: '+this._score
    },
    reset: function(){
        this._score = 0
        this.updateScore()
    }
}

const blocksTemplates = [
    [
        [[0,0],[0,1],[0,2],[1,0]],
        [[-1,1],[0,1],[1,1],[1,2]],
        [[1,1],[1,0],[1,-1],[0,1]],
        [[0,0],[0,1],[1,1],[2,1]]
    ],[
        [[0,0],[1,0],[1,1],[1,2]],
        [[0,1],[1,1],[2,1],[2,0]],
        [[1,0],[1,1],[1,2],[2,2]],
        [[0,1],[0,2],[1,1],[2,1]]
    ],[
        [[0,0],[0,1],[0,2],[0,3]],
        [[-1,1],[0,1],[1,1],[2,1]]
    ],[
        [[0,0],[0,1],[0,2],[1,1]],
        [[-1,1],[0,1],[1,1],[0,2]],
        [[-1,1],[0,1],[0,0],[0,2]],
        [[-1,1],[0,1],[0,0],[1,1]]
    ],[
        [[1,0],[1,1],[0,1],[0,2]],
        [[-1,1],[0,1],[0,2],[1,2]]
    ],[
        [[0,0],[0,1],[1,0],[1,1]]
    ]
]

function AddFigure(){
    var f = { x: 0, y: 0, rotateIndex: 0}
    f.color = GetRandomColor()
    f.blocksTemplates = blocksTemplates[getRandInt(0,blocksTemplates.length-1)].slice()
    f.blocks = f.blocksTemplates[0].slice()
    f.x = rows/2-1
    f.y -= GetFigureHeight(f)+1
    if(CheckCollision(f, 0, 0)){
        console.log('new figure added')
        score.add(2)
        figures.push(f)
    }else{
        console.log('game over')
        GameOver()
    }
}

function GetFigureHeight(figure){
    var height = 0
    for(var i = 0; i < figure.blocks.length; i++)
        if(figure.blocks[i][1] > height)
            height = figure.blocks[i][1]
    return height
}

function CheckCollision(f, x, y){
    for(var i = 0; i < f.blocks.length; i++){
        if(f.blocks[i][0]+f.x+x < 0 || f.blocks[i][0]+f.x+x >= rows)
            return false
        if(f.blocks[i][1]+f.y+y >= colums)
            return false
        for(var k = 0; k < figures.length - 1; k++){
            var otherf = figures[k]
            for(var l = 0; l < otherf.blocks.length; l++){
                if(f.blocks[i][0]+f.x+x == otherf.blocks[l][0]+otherf.x &&
                   f.blocks[i][1]+f.y+y == otherf.blocks[l][1]+otherf.y){
                    return false
                }
            }
        }
    }
    return true
}

function TestForCollision(f,direction){
    if(direction == 'left')
        return CheckCollision(f, -1, 0)
    else if(direction == 'right')
        return CheckCollision(f, 1, 0)
    else if (direction == 'down')
        return CheckCollision(f, 0, 1)
    return false
}

function GetRandomColor(){
    do{
        var new_color = colors[getRandInt(0,colors.length-1)]
    }while(figures.length != 0 && new_color.localeCompare(figures[figures.length-1].color) == 0)
    return new_color
}

function MoveEverythingAbove(row){
    // TODO
}

function DeleteRow(row){
    for(var j = 0; j < figures.length; j++){
        var f = figures[j]
        for(var k = 0; k < f.blocks.length; k++){
            if((f.y + f.blocks[k][1])==row){
                f.blocks.splice(k,1)
                k--
            }
        }
    }
    MoveEverythingAbove(row)
    score.add(20)
}

function CheckForFullLine(){
    var width = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    var blocks = getAllBlocks()
    for(var i = 0; i < blocks.length; i++){
        width[blocks[i][1]] += 1
        if(width[blocks[i][1]]==10){
            console.log('Deleting row',blocks[i][1])
            DeleteRow(blocks[i][1])
        }
    }
    console.log(width)
}

function DrawField(){
    var st = 4
    ctx.clearRect(0,0,(rows+1)*side,(colums+1)*side)
    for(var i = 0; i < figures.length; i++ ){
        var f = figures[i]
        for(var j = 0; j < f.blocks.length; j++){
            ctx.fillStyle = f.color
            ctx.fillRect((f.blocks[j][0]+f.x)*side, (f.blocks[j][1]+f.y)*side, side, side)
            ctx.fillStyle = "rgba(255,255,255,0.3)"
            ctx.fillRect((f.blocks[j][0]+f.x)*side+st, (f.blocks[j][1]+f.y)*side, side-st, st)
            ctx.fillRect((f.blocks[j][0]+f.x)*side, (f.blocks[j][1]+f.y)*side, st, side)
            ctx.fillStyle = "rgba(0,0,0,0.15)"
            ctx.fillRect((f.blocks[j][0]+f.x)*side, (f.blocks[j][1]+f.y)*side+side-st, side-st, st)
            ctx.fillRect((f.blocks[j][0]+f.x)*side+side-st, (f.blocks[j][1]+f.y)*side, st, side)
        }
    }
}
function MoveLeft(){
    var f = figures[figures.length-1]
    if(TestForCollision(f,'left'))
        f.x--
}

function MoveRight(){
    var f = figures[figures.length-1]
    if(TestForCollision(f,'right'))
        f.x++
}

function MoveDown(){
    var f = figures[figures.length-1]
    if(TestForCollision(f,'down')){
        f.y++
    }else{
        CheckForFullLine()
        AddFigure()
    }
}

function GameOver(){
    clearInterval(mainGameCycle)
    gameStatus = 'stop'
}

function NewGame(){
    score.reset()
    figures = []
    AddFigure()
    DrawField()
    mainGameCycle = setInterval(function(){
        MoveDown()
        DrawField()
    },falltime)
    gameStatus = 'run'
}

function RotateCurrentFigure(){
    var length = figures.length-1
    var nextFigure = { x: figures[length].x, y: figures[length].y,
                       blocks: figures[length].blocksTemplates[(figures[length].rotateIndex+1)%figures[length].blocksTemplates.length],
                       color: figures[length].color }
    if(CheckCollision(nextFigure,0,0)){
        var f = figures[figures.length-1]
        f.rotateIndex = (f.rotateIndex + 1)%f.blocksTemplates.length
        f.blocks = f.blocksTemplates[f.rotateIndex].slice()
    }
}

// get all blocks
function getAllBlocks(){
    let arr = []
    for(var i = 0; i < figures.length; i++){
        var f = figures[i]
        for(var j = 0; j < f.blocks.length; j++){
            arr.push([f.blocks[j][0]+f.x, f.blocks[j][1]+f.y])
        }
    }
    return arr
}

// Listeners
document.addEventListener('keydown', function(event) {
    if(gameStatus == 'stop'){
        NewGame()
        return
    }

    var keycode = (event.keyCode ? event.keyCode : event.which)
    if(event.which == 39)
        MoveRight()
    else if(event.which == 37)
        MoveLeft()
    else if (event.which == 38)
        RotateCurrentFigure()
    else if(event.which == 40 )
        MoveDown()
    DrawField()
})

// util
function getRandInt(min,max){
    return Math.floor(Math.random() * (max - min + 1)) + min
}
/*
СЛАВА УКРАЇНІ
8888888888888888888888888888888888888888
88____________________________________88
88_________________88_________________88
88________________8888________________88
88____8__________888888__________8____88
88____88_________888888_________88____88
88____8888________8888________8888____88
88____88__888______88_______88__88____88
88____88___888_____88_____888___88____88
88____88___888_____88_____888___88____88
88____88____888____88____888____88____88
88____88____888____88____888____88____88
88____88____888___8888___888____88____88
88____88__8888____8888____8888__88____88
88____88__888____888888____888__88____88
88____888888_____88__88_____888888____88
88____8888888____88__88____8888888____88
88____88__888888888__888888888__88____88
88____88___88888888__88888888___88____88
88____88______888888888888______88____88
88____88______88__8888__88______88____88
88____88______88___88___88______88____88
88____8888888888888888888888888888____88
88____8888888888888888888888888888____88
88____________888__88__888____________88
888____________888_88_888____________888
_8888___________88888888___________8888_
__888888_________888888_________888888__
_____888888_______8888_______888888_____
________888888_____________888888_______
__________8888888______888888___________
______________888888888888______________
________________________________________
________________________________________
_____________Я ЖИВУ НА СВОЇЙ____________
____________БОГОМ ДАНІЙ ЗЕМЛІ___________

Ще не вмерла Украіна,
И слава, и воля!
Ще намъ, браття-молодці ,
Усміхнеться доля!
Згинуть наші вороги,
Якъ роса на сонці;
Запануємъ, браття й ми
У своій сторонці.

Душу, тіло ми положимъ
За свою свободу
И покажемъ, що ми браття
Козацького роду.
Гей-гей, браття миле,
Нумо братися за діло!
Гей-гей пора встати,
Пора волю добувати!

Наливайко, Залізнякъ
И Тарас Трясило
Кличуть насъ изъ-за могилъ
На святеє діло.
Изгадаймо славну смерть
Лицарства-козацтва,
Щобъ не втратить марне намъ
Своєго юнацтва.

Душу, тіло ми положимъ
За свою свободу
И покажемъ, що ми браття
Козацького роду.
Гей-гей, браття миле,
Нумо братися за діло!
Гей-гей пора встати,
Пора волю добувати!

Ой, Богдане, Богдане,
Славний наш гетьмане!
На-що віддавъ Украіну
Москалямъ поганимъ ?!
Щобъ вернути іі честь,
Ляжемъ головами,
Назовемся Украіни
Вірними синами!

Душу, тіло ми положимъ
За свою свободу
И покажемъ, що ми браття
Козацького роду.
Гей-гей, браття миле,
Нумо братися за діло!
Гей-гей пора встати,
Пора волю добувати!

Наші браття Славяне
Вже за зброю взялись ;
Не діжде ніхто, щобъ ми
По-заду зістались.
Поєднаймось разомъ всі,
Братчики-Славяне :
Нехай гинуть вороги,
Най воля настане!

Душу, тіло ми положимъ
За свою свободу
И покажемъ, що ми браття
Козацького роду.
Гей-гей, браття миле,
Нумо братися за діло!
Гей-гей пора встати,
Пора волю добувати!

*/
