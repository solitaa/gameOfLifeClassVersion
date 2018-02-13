function randomNumber(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement(array) {
  	return array[Math.floor(Math.random() * array.length)];
}

/*function removeElementFromArray(arr,x,y){
	function func(elem, ind, arr){
		if(elem.x == x && elem.y == y){
			arr.splice(ind,1);
			return arr;
		}
    }
    arr.findIndex(func);
}*/

function removeElementFromArray(arr,x,y){
	for(var i in arr){

		if(arr[i].x == x && arr[i].y == y){
			arr.splice(i,1);
			return arr;
		}
    }	
}

function deepCopyMatrix(m){
	var nMatrix = [];
	for(var i = 0; i < m.length; i++){
		nMatrix[i] = [];
		for(var j = 0; j < m[i].length; j++){
			nMatrix[i][j] = m[i][j];
		}
	}
	return nMatrix;
}



class Grid{
	constructor(X, Y){
		this.X = X;
		this.Y = Y;
		this.acted = [];
		this.iteration = 0;

		this.matrix = new Array(Y);
		for (var i = 0; i < this.matrix.length; ++i) {
			this.matrix[i] = new Array(X);
		}


		//fill the matrix
		var coordsArray = [];
		for(var i = 0; i < this.matrix.length; ++i){
			for(var j = 0; j < this.matrix[0].length; ++j){
				this.matrix[i][j] = 0;
				coordsArray.push({'x':i,'y':j});
			}
		}
		var wallCount = Math.floor(coordsArray.length*wallPercent/100);
		var grassCount = Math.floor(coordsArray.length*grassPercent/100);
		var critterCount = Math.floor(coordsArray.length*critterPercent/100);

		for(var i = 0; i < wallCount; i++){
			var a = randomNumber(0,coordsArray.length-1);
			var t = coordsArray[a];
			this.matrix[t.x][t.y] = 8;
			removeElementFromArray(coordsArray,t.x,t.y);

		}		for(var i = 0; i < grassCount; i++){
			var a = randomNumber(0,coordsArray.length-1);
			var t = coordsArray[a];
			this.matrix[t.x][t.y] = 1;
			removeElementFromArray(coordsArray,t.x,t.y);

		}
		for(var i = 0; i < critterCount; i++){
			var a = randomNumber(0,coordsArray.length-1);
			var t = coordsArray[a];
			this.matrix[t.x][t.y] = 2;
			removeElementFromArray(coordsArray,t.x,t.y);

		}
	}



	isInside(x,y) {
		return x >= 0 && x < X && y >= 0 && y < Y;
	};

	createObjects(){
        for(var i = 0; i < grid.matrix.length; ++i){
            for(var j = 0; j < grid.matrix[i].length; ++j){
                if(grid.matrix[i][j] == 1){
                	var t = new Grass(j,i,1);
                	grassArr.push(t);
                }
                else if(grid.matrix[i][j] == 2){
                	standardCritterArr.push(new StandardCritter(j,i,2));
                }
                else if(grid.matrix[i][j] == 8){

                }
            }
        }
    }
    drawMatrix(){
    	this.iteration++;
		background(100);
        for(var i = 0; i < grid.matrix.length; ++i){
            for(var j = 0; j < grid.matrix[i].length; ++j){
                if(grid.matrix[i][j] == 1){
                    fill(13, 90, 34);
                    rect(j*side, i*side, side, side);
                }
                else if(grid.matrix[i][j] == 2){
                    fill(207, 191, 23);
                    rect(j*side, i*side, side, side);
                }
                else if(grid.matrix[i][j] == 8){
                    fill(96, 58, 0);
                    rect(j*side, i*side, side, side);
                }
            }
        }
	}
}


class lifeForms {
	constructor(x,y,index){
		this.x = x;
		this.y = y;
		this.energy = 1;
		this.index = index;
		this.direction;
		this.directions = [];	
	}

	getNewDirections(){
		this.directions = [
			[this.x - 1, this.y - 1],
			[this.x    , this.y - 1],
			[this.x + 1, this.y - 1],
			[this.x - 1, this.y    ],
			[this.x + 1, this.y    ],
			[this.x - 1, this.y + 1],
			[this.x    , this.y + 1],
			[this.x + 1, this.y + 1]
		];
	}

	findCharacter(ch) {
		this.getNewDirections();
		var found = [];
		for (var dir in this.directions){
			var t = this.directions[dir];
			if (grid.isInside(t[0],t[1])){
				if (grid.matrix[t[1]][t[0]] == ch){
					found.push(t);
				}
			}
		}
		return found;
	};

	getRandomCharacter(ch){
		return randomElement(this.findCharacter(ch));
	};
}



class Grass extends lifeForms{
	constructor(x,y,energy,index) {
		super(x,y,energy,index);
        this.multiply = 0;
        this.parentX;
        this.parentY;
    }
	mul(){
		this.multiply++;
		this.direction = this.getRandomCharacter(0);
		if(this.multiply >= 8 && this.direction){
			var newGrass = new Grass(this.direction[0],this.direction[1],this.index);
			newGrass.parentX = this.x;
			newGrass.parentY = this.y;
			grassArr.push(newGrass);
			grid.matrix[this.direction[1]][this.direction[0]] = this.index;
			this.multiply = 0;
		}

	}

}





class StandardCritter extends lifeForms {
	constructor(x,y,energy,index) {
		super(x, y, energy, index);
        this.energy = 8;
        this.power = 0;
        this.age = 0;
        this.maxEnergy = 8;
    }


	move(){
		this.direction = this.getRandomCharacter(0);
		this.energy--;
		if(this.energy <= 0){
			this.die();
			return;
		}
		if(this.direction) {

			this.power = 0;
			grid.matrix[this.direction[1]][this.direction[0]] = this.index;
			grid.matrix[this.y][this.x] = 0;
			this.x = this.direction[0];
			this.y = this.direction[1];
		}
	}


	eat(){
		this.direction = this.getRandomCharacter(1);
		
		
		if(this.direction){
			++this.power;

			this.energy = this.maxEnergy;
			grid.matrix[this.y][this.x] = 0;
			grid.matrix[this.direction[1]][this.direction[0]] = 2;
			this.y = this.direction[1];
			this.x = this.direction[0];
			removeElementFromArray(grassArr,this.direction[0],this.direction[1]);
			if(this.power == 10){
				this.mul();
			}
			return true;
		}


	}


	mul(){
		this.maxEnergy = Math.floor(this.maxEnergy/2);
		var newDirForKidCritter = this.getRandomCharacter(0);
		
		if(newDirForKidCritter){
			this.power = 0;
			standardCritterArr.push(new StandardCritter(newDirForKidCritter[0],newDirForKidCritter[1],this.index));
			grid.matrix[newDirForKidCritter[1]][newDirForKidCritter[0]] = this.index;
		}
	}

	die(){
		grid.matrix[this.y][this.x] = 0;
		removeElementFromArray(standardCritterArr,this.x,this.y);
	}


	act(){
		++this.age;
		if(!this.eat()){
			this.move();
		}
	}

}













/*


this.matrix = new Array(rows);
for (var i = 0; i < this.matrix.length; ++i) {
	this.matrix[i] = new Array(columns);
}


//fill the matrix
for(var i = 0; i < this.matrix.length; ++i){
	for(var j = 0; j < this.matrix[0].length; ++j){
		this.matrix[i][j] = randomNumber(0,1);
	}
}
this.matrix = [[8,8,8,8],
				[8,0,2,8],
				[8,2,0,8],
				[8,8,8,8]
				];


this.matrix = [[8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
					[8,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0],
					[8,0,1,1,0,0,0,0,0,0,0,2,0,0,0,0,0],
					[8,0,1,0,0,0,2,0,0,0,0,0,0,0,0,0,0],
					[8,0,1,1,1,1,0,8,8,0,0,0,0,0,0,0,0],
					[8,0,0,0,0,0,0,8,8,0,0,2,0,0,0,0,0],
					[8,0,0,0,1,1,0,0,8,0,0,0,0,0,0,0,0],
					[8,0,1,0,0,0,0,1,8,0,0,0,0,0,0,0,0],
					[8,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
					[8,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
					[8,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
					[8,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
					[8,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
					[8,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
					[8,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
					[8,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
					[8,0,1,1,1,1,0,8,8,0,0,0,0,0,0,0,0],
					[8,0,1,1,1,1,0,8,8,0,0,0,0,0,0,0,0],
					[8,0,1,1,1,1,0,8,8,0,0,2,0,0,0,0,0],
					[8,0,1,1,1,1,0,8,8,0,0,0,0,0,0,0,0],
 					[8,0,1,1,1,1,0,8,8,0,0,0,0,0,0,0,0],
					[8,0,1,1,1,1,0,8,8,0,0,0,0,0,0,0,0],
					[8,0,1,1,1,1,0,8,8,0,0,0,0,0,0,0,0],
					[8,0,1,1,1,1,0,8,8,0,0,0,0,0,0,0,0],
					[8,0,1,1,1,1,0,8,8,0,0,0,0,0,0,0,0],
					[8,0,1,1,1,1,0,8,8,0,0,0,0,0,0,0,0],
					[8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0]
					];




*/