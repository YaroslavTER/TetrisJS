var canvas = document.getElementById('canvas_id')
var ctx = canvas.getContext('2d')
var side = 20, rows = 10, colums = 20, falltime = 500
var figures = [], colors = ['#ff420e', '#6897bb', '#ff7373', '#008080', '#567e35']

var blocksTemplates = [
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
    f.blocksTemplates = blocksTemplates[getRandInt(0,blocksTemplates.length-1)]
    f.blocks = f.blocksTemplates[0]
    f.x += rows/2
    f.y -= GetFigureDim(f).height+1
    figures.push(f)
}

function GetFigureDim(figure){//немного изменил
    var height = 0, width = 0
    for(var i = 0; i < figure.blocks.length; i++){
        if(figure.blocks[i][0] > width){
            width = figure.blocks[i][0]
        }
        if(figure.blocks[i][1] > height){
            height = figure.blocks[i][1]
        }
    }
    return {width: width, height: height}
}

function CheckSides(f, additionValue){
    for(var i = 0; i < f.blocks.length; i++){
        for(var k = 0; k < figures.length - 1; k++){
            var otherf = figures[k]
            for(var l = 0; l < otherf.blocks.length; l++){
                if(f.blocks[i][0]+f.x+additionValue == otherf.blocks[l][0]+otherf.x &&
                   f.blocks[i][1]+f.y == otherf.blocks[l][1]+otherf.y){
                    return false
                }
            }
        }
    }
    return true
}

function CheckDown(f, additionValue){
    for(var i = 0; i < f.blocks.length; i++){
        for(var k = 0; k < figures.length - 1; k++){
            var otherf = figures[k]
            for(var l = 0; l < otherf.blocks.length; l ++){
                if(f.blocks[i][1]+f.y+additionValue == otherf.blocks[l][1]+otherf.y &&
                   f.blocks[i][0]+f.x == otherf.blocks[l][0]+otherf.x){
                    return false
                }
            }
        }
    }
    return true
}

function TestForCollision(f,direction){
    var dim = GetFigureDim(f)
    if(direction == 'left' && f.x-1 >= 0)
        return CheckSides(f, -1)
    else if(direction == 'right' && f.x+1 < rows-dim.width)
        return CheckSides(f, 1)
    else if (direction == 'down' && f.y + dim.height +1 < colums)
        return CheckDown(f,1)
    return false

}

function GetRandomColor(){
    do{
        var new_color = colors[getRandInt(0,colors.length-1)]
    }while(figures.length != 0 && new_color.localeCompare(figures[figures.length-1].color) == 0)
    return new_color
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
    }else {
        AddFigure()
    }
}

function RotateCurrentFigure(){
    var length = figures.length-1
    var nextFigure = {x: figures[length].x, y: figures[length].y,
                   blocks: figures[length].blocksTemplates[(figures[length].rotateIndex+1)%figures[length].blocksTemplates.length],
                   color: figures[length].color}
    if(CheckSides(nextFigure,0) && CheckDown(nextFigure,0)){
        var f = figures[figures.length-1]
        f.rotateIndex = (f.rotateIndex + 1)%f.blocksTemplates.length
        f.blocks = f.blocksTemplates[f.rotateIndex]
    }
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
    if(event.which == 39)
        MoveRight()
    else if(event.which == 37)
        MoveLeft()
    else if (event.which == 38){
        RotateCurrentFigure()
    } else if(event.which == 40 ){
        MoveDown()
    }
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
