let snake;
let scl = 20;
let food;

function setup() {
    createCanvas(600,600);
    snake = new Snake();
    frameRate(10)
    //food = createVector(random(width),random(height)); //creates random x,y coord for food
    pickLocation();
}

//picks random location for food
//also makes sure the food is in an exact spot on the grid
function pickLocation(){
    let cols = floor(height/scl);
    let rows = floor(width/scl);
    food = createVector(floor(random(cols)),floor(random(rows)));
    food.mult(scl);
}

function draw() {
    background(51);
    if (snake.eat(food)===true){
        pickLocation();
    }
    snake.death();
    snake.update();
    snake.show();

    fill(255, 0 , 100)
    rect(food.x, food.y, scl, scl);
}

//user's keyboard control
function keyPressed(){
    if (keyCode === UP_ARROW){
        snake.dir(0,-1);
    }else if (keyCode === DOWN_ARROW){
        snake.dir(0,1);
    }else if (keyCode === RIGHT_ARROW) {
        snake.dir(1,0);
    }else if (keyCode === LEFT_ARROW) {
        snake.dir(-1,0);
    }
}

function Snake(){
    this.x = 0;
    this.y = 0;
    this.xspeed = 0;
    this.yspeed = 0;
    this.total = 0;
    this.tail = [];

    //tells me whether or not the snake ate the food by
    //receiving a vector position for where the food is and comparing it with distance of snake
    this.eat = function(pos){
        let d = dist(this.x, this.y, pos.x, pos.y); //distance between snake (x1,y1) and food (x2,y2)
        if (d<1){
            this.total++;
            return true;
        }else{
            return false;
        }
    }

    //receives x and y value in order to set this objects directions
    this.dir = function(x,y){
        this.xspeed = x;
        this.yspeed = y;
    }

    this.death = function(){
        for (let i=0; i<this.tail.length; i++){
            let pos = this.tail[i];
            let d = dist(this.x, this.y, pos.x, pos.y);
            if (d < 1){
                this.total = 0;
                this.tail = [];
            }
        }
    }

    //every time the snake moves
    this.update = function(){
        //if no food has been eaten
        //everything in the array gets shifted over
        //else, if food is eaten, add another spot
        if (this.total===this.tail.length){
            for(let i=0; i<this.tail.length-1;i++){
                this.tail[i] = this.tail[i+1];
            }
        }
        this.tail[this.total-1] = createVector(this.x, this.y);

        this.x = this.x + this.xspeed*scl; //x moving to a new spot
        this.y = this.y + this.yspeed*scl; //y moving to a new spot

        this.x = constrain(this.x, 0, width-scl); //makes sure snake is within the game bound
        this.y = constrain(this.y, 0, height-scl);

    }

    this.show = function(){
        for(let i=0; i<this.tail.length; i++){
            fill(255,255,255);
            rect(this.tail[i].x, this.tail[i].y, scl, scl);
        }

        fill(255,255,255);
        rect(this.x, this.y, scl, scl);
    }
}