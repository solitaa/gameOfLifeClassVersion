document.getElementById("stop").addEventListener("click", function() {
    drawn()
});

var time = 0;
var famerateCount = 0;
var X = 100;
var Y = 100;
var side = 8;
var grassPercent = 40;
var critterPercent = 2;
var wallPercent = 5;
var grid, standardCritterArr = [],grassArr = [];


function setup(){
    //frameRate(15);
    createCanvas(X*side, Y*side);
    background(100);  
    grid = new Grid(X,Y);
    grid.drawMatrix();
    grid.createObjects();
}


function draw(){
    if(++famerateCount%10 == 0){
        time++;
    }
    if(standardCritterArr.length == 0 || grassArr.length == 0){
        console.log(famerateCount);
        draw = function(){

        }
    }
    for(var i = 0; i < standardCritterArr.length; i++){
        standardCritterArr[i].act();
    }
    for(var i = 0; i < grassArr.length; i++){
        grassArr[i].mul();
    }
    grid.drawMatrix();
}
