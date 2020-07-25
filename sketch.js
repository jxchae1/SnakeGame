let snake;
let scl = 50;
let food;
let previousPressedKey;
let score = 0;
let myFont;


function setup() {
    createCanvas(800,700);
    snake = new Snake();
    frameRate(8.5);
    foodLocation();
}

function draw() {
    background(51);
    if (snake.eat(food)===true) {
        foodLocation();
        addScore();
    }

    snake.death();
    snake.update();
    snake.show();


    if (food.isSuperFood) {
        fill(161, 202, 241); //blue
        rect(food.x, food.y, scl, scl)

        fill(255, 255, 255);
        textSize(43);
        text('S',food.x+10, food.y+40);

    } else {
        fill(255, 188 , 217); //pink
        rect(food.x, food.y, scl, scl);

    }

}

function keyPressed(){
    //prevents user from pressing the same key direction they came from
    if (previousPressedKey === UP_ARROW && keyCode===DOWN_ARROW){
        return;
    }else if (previousPressedKey === DOWN_ARROW && keyCode===UP_ARROW){
        return;
    }else if (previousPressedKey === RIGHT_ARROW && keyCode===LEFT_ARROW) {
        return;
    }else if (previousPressedKey === LEFT_ARROW && keyCode===RIGHT_ARROW) {
        return;
    }

    if (keyCode === UP_ARROW){
        snake.dir(0,-1);
    }else if (keyCode === DOWN_ARROW){
        snake.dir(0,1);
    }else if (keyCode === RIGHT_ARROW) {
        snake.dir(1,0);
    }else if (keyCode === LEFT_ARROW) {
        snake.dir(-1,0);
    }

    previousPressedKey = keyCode;
}

function Snake(){
    this.x = 0;
    this.y = 0;
    this.xspeed = 0;
    this.yspeed = 0;
    this.total = 0;
    this.tail = [];

    this.eat = function(pos){
        let d = dist(this.x, this.y, pos.x, pos.y); //distance between snake (x1,y1) and food (x2,y2)
        if (d<1){
            this.total++;
            return true;
        }else{
            return false;
        }
    }

    //receives x and y value in order to set the snake's direction
    this.dir = function(x,y){
        this.xspeed = x;
        this.yspeed = y;
    }

    this.death = function(){
        let isDead = false;
        for (let i=0; i<this.tail.length; i++){
            let pos = this.tail[i];
            let d = dist(this.x, this.y, pos.x, pos.y);
            if (d < 1){
                isDead = true;
            }
        }

        if (isDead===false && ((this.x<0 || this.x>=width-scl) || (this.y<0 || this.y>=height-scl))){
            isDead = true;
        }

        if(isDead) {
            noLoop();
            if(confirm("Would you like to start over?")){
                startNewGame();
            }
        }
    }

    this.update = function(){

        if (this.total===this.tail.length){
            for(let i=0; i<this.tail.length-1;i++){
                this.tail[i] = this.tail[i+1];
            }
        }
        this.tail[this.total-1] = createVector(this.x, this.y);

        this.x = this.x + this.xspeed*scl; //x moving to a new spot
        this.y = this.y + this.yspeed*scl; //y moving to a new spot

        //makes sure snake is within the game bound
        this.x = constrain(this.x, 0, width-scl);
        this.y = constrain(this.y, 0, height-scl);

    }

    this.show = function(){
        //tail
        for(let i=0; i<this.tail.length; i++){
            fill(255,255,102); //light yellow
            rect(this.tail[i].x, this.tail[i].y, scl, scl);
        }

        //head
        fill(244,202,22); //dark yellow
        rect(this.x, this.y, scl, scl);
    }
}

//picks random location for food
//also makes sure the food is in an exact spot on the grid
function foodLocation(){
    let cols = floor(width/scl);
    let rows = floor(height/scl);
    food = createVector(floor(random(cols)),floor(random(rows)));
    food.mult(scl);

    //exception for when food is created at (0,0)
    if(food.x === 0 && food.y === 0){
        foodLocation();
        return;
    }

    food.isSuperFood = floor(random(0,11)) === 1;
    if (food.isSuperFood){
        setTimeout(foodLocation,5000);
    }
}

function addScore(){
    score = score + (food.isSuperFood ? 100 : 10);
    displayScore(score);
}

function displayScore(score) {
    document.getElementById("score").innerHTML = score;
}

function startNewGame(){
    location.reload();
}
