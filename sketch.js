let snake;
let scl = 50;
let food;
let previousPressedKey;
let score = 0;
const canvasWidth = 800;
const canvasHeight = 700;



function setup() {
    createCanvas(canvasWidth,canvasHeight);
    snake = new Snake();
    frameRate(8.5);
    foodLocation();
}

function draw() {
    background(51);
    if (snake.eat(food)===true) {
        addScore();
        foodLocation();
    }

    snake.update();
    snake.death();
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
        snake.dir('UP');
    }else if (keyCode === DOWN_ARROW){
        snake.dir('DOWN');
    }else if (keyCode === RIGHT_ARROW) {
        snake.dir('RIGHT');
    }else if (keyCode === LEFT_ARROW) {
        snake.dir('LEFT');
    }

    previousPressedKey = keyCode;
}

function Snake(){
    this.x = 0;
    this.y = 0;
    this.xDirection = 0;
    this.yDirection = 0;
    this.snakeBody = 0;
    this.tail = [];

    this.eat = function(pos){
        let headAndFoodProximity = dist(this.x, this.y, pos.x, pos.y);
        if (headAndFoodProximity<1){
            this.snakeBody++;
            return true;
        }else{
            return false;
        }
    }

    //receives x and y value in order to set the snake's direction
    this.dir = function(direction){
        if (direction === 'UP'){
            this.xDirection = 0;
            this.yDirection = -1;
        } else if (direction === 'DOWN') {
            this.xDirection = 0;
            this.yDirection = 1;
        } else if (direction === 'RIGHT') {
            this.xDirection = 1;
            this.yDirection = 0;
        } else{
            this.xDirection = -1;
            this.yDirection = 0;
        }
    }

    this.death = function(){
        let isDead = false;
        this.tail.forEach(val=>{
            let d = dist(this.x, this.y, val.x, val.y);
            if (d < 1){
                isDead = true;
            }
        })

        if (isDead===false && ((this.x<0 || this.x>=canvasWidth) || (this.y<0 || this.y>=canvasHeight))){
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

        if (this.snakeBody===this.tail.length){
            this.tail.shift();
        }
        this.tail[this.snakeBody-1] = createVector(this.x, this.y);

        this.x = this.x + this.xDirection*scl; //x moving to a new spot
        this.y = this.y + this.yDirection*scl; //y moving to a new spot

        //makes sure snake is within the game bound
        this.x = constrain(this.x, -1, canvasWidth+scl);
        this.y = constrain(this.y, -1, canvasHeight+scl);

    }

    this.show = function(){
        //tail
        this.tail.forEach(val=>{
            fill(255,255,102); //light yellow
            rect(val.x, val.y, scl, scl);
        })

        //head
        fill(244,202,22); //dark yellow
        rect(this.x, this.y, scl, scl);
    }
}

function foodLocation(){
    let cols = floor(canvasWidth/scl);
    let rows = floor(canvasHeight/scl);
    food = createVector(floor(random(cols)),floor(random(rows)));
    food.mult(scl);

    //exception for when food is created at (0,0)
    if(food.x === 0 && food.y === 0){
        foodLocation();
        return;
    }

    food.isSuperFood = floor(random(0,11)) === 1;
    if (food.isSuperFood){
        const superFoodTimeLimit = 5000;
        setTimeout(foodLocation,superFoodTimeLimit);
    }
}

function addScore(){
    score += (food.isSuperFood ? 100 : 10);
    displayScore(score);
}

function displayScore(score) {
    document.getElementById("score").innerHTML = score;
}

function startNewGame(){
    location.reload();
}
