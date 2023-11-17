
var startButton = document.createElement('button');
startButton.disabled=true
startButton.innerText = 'Start'
document.getElementById('gameSettings').append(startButton)



class Circle{
    constructor(x, y, radius, gameWidth, gameHeight) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.gameWidth = gameWidth
        this.gameHeight = gameHeight
        this.alive = true;

    }
    circlesOverlap(targetCircle) {
        // Calculate the distance between the centers of the circles
        const distance = Math.sqrt(Math.pow(targetCircle.x - this.x, 2) + Math.pow(targetCircle.y - this.y, 2));

        // Check if the distance is less than or equal to the sum of the radius
        return targetCircle.isAlive() && this.isAlive() && (distance <= this.radius + targetCircle.radius);
    }
    destroy(){
        this.alive = false;
    }
    isAlive(){
        return this.alive;
    }
    wallCollisionActionOnX(){

    }
    wallCollisionActionOnY(){

    }
    checkCollisionWithTheWall() {
        // COLLISION WITH VERTICAL WALLS ?
        if ((this.x + this.radius) > this.gameWidth) {
            // the ball hit the right wall
            // change horizontal direction
            this.wallCollisionActionOnX()

            // put the ball at the collision point
            this.x = this.gameWidth - this.radius;
        } else if ((this.x - this.radius) < 0) {
            // the ball hit the left wall
            // change horizontal direction
            this.wallCollisionActionOnX()

            // put the ball at the collision point
            this.x = this.radius;
        }

        // COLLISIONS WTH HORIZONTAL WALLS ?
        // Not in the else as the ball can touch both
        // vertical and horizontal walls in corners
        if ((this.y + this.radius) > this.gameHeight) {
            // the ball hit the right wall
            // change horizontal direction
            this.wallCollisionActionOnY()

            // put the ball at the collision point
            this.y = this.gameHeight - this.radius;
        } else if ((this.y - this.radius) < 0) {
            // the ball hit the left wall
            // change horizontal direction
            this.wallCollisionActionOnY()

            // put the ball at the collision point
            this.y = this.radius;
        }
    }
}
class Ghost extends Circle{
    constructor(x, y, radius, speed, colour, gameWidth, gameHeight) {
        super(x, y, radius, gameWidth, gameHeight);
        this.speed = speed;
        this.colour = colour;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        this.draw_ghost(ctx, this.radius, {
            fill: this.colour
        });
        ctx.restore();
    }

    draw_ghost(ctx, radius, options) {
        options = options || {}
        let feet = options.feet || 4;
        let head_radius = radius * 0.8;
        let foot_radius = head_radius / feet;
        ctx.save();
        ctx.strokeStyle = options.stroke || "white";
        ctx.fillStyle = options.fill || "red";
        ctx.lineWidth = options.lineWidth || radius * 0.05;
        ctx.beginPath();
        for (let foot = 0; foot < feet; foot++) {
            ctx.arc(
                (2 * foot_radius * (feet - foot)) - head_radius - foot_radius,
                radius - foot_radius,
                foot_radius, 0, Math.PI
            );
        }
        ctx.lineTo(-head_radius, radius - foot_radius);
        ctx.arc(0, head_radius - radius, head_radius, Math.PI, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(-head_radius / 2.5, -head_radius / 2, head_radius / 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(head_radius / 3.5, -head_radius / 2, head_radius / 3, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(-head_radius / 2, -head_radius / 2.2, head_radius / 8, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(head_radius / 4, -head_radius / 2.2, head_radius / 8, 0, 2 * Math.PI);
        ctx.fill();

        ctx.restore();
    }

    update(target, elapsed) {
        let angle = Math.atan2(target.y - this.y, target.x - this.x);
        let x_speed = Math.cos(angle) * this.speed*globalSpeedMutiplier;
        let y_speed = Math.sin(angle) * this.speed*globalSpeedMutiplier;
        this.x += x_speed * elapsed;
        this.y += y_speed * elapsed;
        this.checkCollisionWithTheWall();
    }

}
class PacMan extends Circle{
    constructor(x, y, radius, speed, gameWidth, gameHeight) {
        super(x,y, radius, gameWidth, gameHeight)
        this.speed = speed;
        this.angle = 0;
        this.x_speed = speed;
        this.y_speed = 0;
        this.time = 0;
        this.mouth = 0;
    }
    width(){
        return this.radius
    }
    height(){
        return this.radius
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        this.draw_pacman(ctx, this.radius, this.mouth);
        ctx.restore();
    }

    draw_pacman(ctx, radius, mouth) {
        let angle = 0.2 * Math.PI * mouth;
        ctx.save();
        ctx.fillStyle = "yellow";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(0, 0, radius, angle, 2 * Math.PI - angle);
        ctx.lineTo(0, 0);
        ctx.closePath()
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }

    turn(direction) {
        if (this.y_speed) {
            this.x_speed = -direction * this.y_speed;
            this.y_speed = 0;
            this.angle = this.x_speed > 0 ? 0 : Math.PI;
        } else {
            this.y_speed = direction * this.x_speed;
            this.x_speed = 0;
            this.angle = this.y_speed > 0 ? 0.5 * Math.PI : 1.5 * Math.PI;
        }
    }

    turn_left() {
        this.turn(-1);
    }

    turn_right() {
        this.turn(1);
    }

    update(elapsed, width, height) {
        /*if (Math.random() <= 0.01) {
            if (Math.random() < 0.5) {
                this.turn_left();
            } else {
                this.turn_right();
            }
        }*/

        /*if (this.x - this.radius + elapsed * this.x_speed > width) {
            this.x = -this.radius;
        }
        if (this.x + this.radius + elapsed * this.x_speed < 0) {
            this.x = width + this.radius;
        }
        if (this.y - this.radius + elapsed * this.y_speed > height) {
            this.y = -this.radius;
        }
        if (this.y + this.radius + elapsed * this.y_speed < 0) {
            this.y = height + this.radius;
        }*/

        /*this.x += this.x_speed * elapsed;
        this.y += this.y_speed * elapsed;*/

        this.time += elapsed;
        this.mouth = Math.abs(Math.sin(2 * Math.PI * this.time));

        this.checkCollisionWithTheWall();
    }
    moveTo(x,y){
        this.x = x;
        this.y = y;
    }
}
const FoodType = {
    Good: {
        'value': 100,
        'color': 'green',
        'audio':'sounds/munch_1.wav',
        'key': 'good'
    },
    Bad: {
        'value': -100,
        'color': 'red',
        'audio':'sounds/munch_2.wav',
        'key': 'bad'
    },
    BadZigzag: {
        'value': -100,
        'color': 'orange',
        'audio':'sounds/munch_2.wav',
        'key': 'bad'
    },
    BadZigzagRandomSize: {
        'value': -100,
        'color': 'yellow',
        'audio':'sounds/munch_2.wav',
        'key': 'bad'
    }

};
class Food extends Circle{
    constructor(x,y, foodSize, foodType, gameWidth, gameHeight) {
        super(x,y,5 + 30 * foodSize, gameWidth, gameHeight)
        this.color= foodType['color'];
        this.eaten = false;
        this.foodType = foodType;
        this.eatAudio = new Audio(foodType['audio']);
    }
    eat(){
        if (!(this.eaten)) {
            this.eatAudio.play();
            this.eaten = true;
            this.destroy();
            return this.getPoint();
        }
        return 0;
    }
    draw(ctx){
        if (this.eaten)
            return;

        ctx.save();

        // translate the coordinate system, draw relative to it
        ctx.translate(this.x, this.y);

        ctx.fillStyle = this.color;
        // (0, 0) is the top left corner of the monster.
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, 2*Math.PI);
        ctx.fill();

        ctx.restore();
    }
    update(){}
    getPoint(){
        return this.foodType.value
    }

}
class AliveFood extends Food{
    constructor(x,y, foodSize, speedX, speedY, foodType, gameSpeed, gameWidth, gameHeight) {
        super(x,y, foodSize, foodType, gameWidth, gameHeight);
        this.speedX = speedX;
        this.speedY = speedY;
        this.gameSpeed = gameSpeed;
        this.ballWallHit = new Audio('sounds/mixkit-game-ball-tap-2073.wav');
    }

    update(){

        // b is the current ball in the array
        this.x += (this.speedX * this.gameSpeed*globalSpeedMutiplier);
        this.y += (this.speedY * this.gameSpeed*globalSpeedMutiplier);
        this.checkCollisionWithTheWall();
    }
    wallCollisionActionOnX() {
        super.wallCollisionActionOnX();
        this.speedX = -this.speedX;
        this.ballWallHit.play();
    }
    wallCollisionActionOnY() {
        super.wallCollisionActionOnY();
        this.speedY = -this.speedY;
        this.ballWallHit.play();

    }
}

class ZigZagAliveFood extends AliveFood{
    wallCollisionActionOnX() {
        super.wallCollisionActionOnX();
        this.speedY = this.getRandomDirection();
    }
    wallCollisionActionOnY() {
        super.wallCollisionActionOnY();
        this.speedX = this.getRandomDirection();

    }
    getRandomDirection() {
        // Generate a random number between -1 and 1
        return (Math.random() - 0.5) * 2;
    }
}
class ZigZagRandomSizeAliveFood extends ZigZagAliveFood{
    constructor(x,y, foodSize, speedX, speedY, foodType, gameSpeed, gameWidth, gameHeight){
        super(x,y, foodSize, speedX, speedY, foodType, gameSpeed, gameWidth, gameHeight)
        this.lastGeneratedTime = Date.now();
    }
    update(){
        super.update()
        const currentTime = Date.now();
        // Compare the current time with the last generated time
        if (currentTime - this.lastGeneratedTime >= 3000) {
            // Update the last generated time
            this.lastGeneratedTime = currentTime;
            this.radius = this.getRandomNumber(0.02,1);
        }

    }
    getRandomNumber(min, max) {

        return 30*(Math.random() * (max - min) + min) + 5 ;
    }
    draw(ctx) {
        super.draw(ctx);
        console.log('dynamic radius',this.radius);
    }
}
class Game{
    constructor(_window, targeted_document, level) {

        this.window = _window
        this.targeted_document = targeted_document

        this.context = this.targeted_document.getElementById("pacman").getContext("2d");
        this.currentLevel = level;
        this.previous = null;
        this.elapsed=null;
        // add a mousemove event listener to the canvas
        this.targeted_document.addEventListener('mousemove', this.mouseMoved);
    }

    draw(ctx, guide) {
        this.currentLevel.draw(ctx, guide)
    }

    update(elapsed) {
        this.currentLevel.update(elapsed)
    }


    mouseMoved(evt) {
        this.currentLevel.mouseMoved(evt)
    }
    frame(timestamp) {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        if (!this.previous) this.previous = timestamp;
        this.elapsed = timestamp - this.previous;
        this.update(this.elapsed / 1000);
        this.draw(this.context, true);
        this.previous = timestamp;
        this.window.requestAnimationFrame(this.frame);
    }
    run(){
        this.currentLevel = new Level(window,document)
        startButton.style.display = 'none';
        this.window.requestAnimationFrame(this.frame);
    }
}
class Level{
    constructor(_window, targeted_document, nextStage, balls_number=10, gameWidth=600, gameHeight=600, levelSoundPath='sounds/siren_1.wav') {
        this.targeted_document = targeted_document
        this.gameWidth = gameWidth
        this.gameHeight = gameHeight
        this.gameSceneHeight = gameHeight -50
        this.nextStage = nextStage
        this.context = this.targeted_document.getElementById("pacman").getContext("2d");


        this.pacman = new PacMan(this.context.canvas.width / 2, this.context.canvas.height / 2, 20, 100, this.gameWidth, this.gameHeight);
        this.ghosts = []
        this.foods = [];

        this.eatenType = {};
        this.availableType = {};

        this.initLevelAudio = new Audio('sounds/game_start.wav');
        this.curentLevelAudio = new Audio(levelSoundPath);
        // this.curentLevelAudio.loop = true;

        this.initSoundFinishPlayed = false;
        this.gamePaused = false;
        this.finish = false;
        this.point = 400;
        this.initLevel();
    }
    // Draw the menu
    // Draw the menu with styling
    drawPauseMenu(ctx) {
        // Draw the game background (assuming there is an image or something)
        // You may need to replace this with your actual background drawing logic
        ctx.save()
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; // Change this color to match your background color
        ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);

        // Apply blur effect to the background when paused
        if (this.gamePaused) {
            ctx.filter = "blur(1px)";
        } else {
            ctx.filter = "none";
        }

        // Draw a semi-transparent overlay to dim the game when paused
        //ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.fillStyle = "#fff";
        ctx.font = "40px Arial";
        ctx.fillText("Game Paused", ctx.canvas.width / 2 - 120, 100);

        ctx.fillStyle = "#66ccff";
        ctx.font = "30px Arial";
        ctx.fillText("1. Resume Game", ctx.canvas.width / 2 - 100, 250);
        ctx.fillText("2. Quit Game", ctx.canvas.width / 2 - 100, 300);

        // Reset the filter for other drawings
        ctx.filter = "none";

        ctx.restore();
    }

    // Simple fade-in animation for the menu
    fadeIn() {
        let alpha = 0;

        function animate() {
            alpha += 0.02;
            if (alpha >= 1) {
                alpha = 1;
                clearInterval(animationInterval);
            }

            this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
            this.drawMenu();

            // Apply the fade-in effect
            this.context.globalAlpha = alpha;
        }

        const animationInterval = setInterval(animate, 20);
    }
    getNextStage(){
        return Level;
    }
    initLevel() {
        try {
            if (this.initLevelAudio.currentTime === 0 && this.initLevelAudio.paused) {
                // Audio has not started playing, so play it
                this.initLevelAudio.play();
                this.initComponents();


            }} catch (error) {
            // Handle specific types of exceptions
            if (error.name === 'SecurityError') {
                console.error('SecurityError: Permission denied to play the audio.');
            } else if (error.name === 'InvalidStateError') {
                console.error('InvalidStateError: The audio element is not in a valid state for the operation.');
            } else if (error.name === 'NetworkError') {
                console.error('NetworkError: There was a problem loading the audio file.');
            } else {
                // Catch any other unexpected errors
                console.error('An error occurred while trying to play the audio:', error.message);
            }
        }

    }

    initComponents() {
        this.createAllGhosts();
        this.createNGoodFood(18);
        // create n balls
        this.createNBadFood(2);
        this.createNBadFoodAlive(2);

    }

    createARedGhost() {
        this.ghosts.push(new Ghost(this.context.canvas.width * Math.random(), this.context.canvas.height * Math.random(), 20, 35, 'red', this.gameWidth, this.gameHeight));
    }
    createAPinkGhost() {
        this.ghosts.push(new Ghost(this.context.canvas.width * Math.random(), this.context.canvas.height * Math.random(), 20, 45, 'pink', this.gameWidth, this.gameHeight));
    }
    createACyanGhost() {
        this.ghosts.push(new Ghost(this.context.canvas.width * Math.random(), this.context.canvas.height * Math.random(), 20, 55, 'cyan', this.gameWidth, this.gameHeight));
    }
    createAnOrangeGhost() {
        this.ghosts.push(new Ghost(this.context.canvas.width * Math.random(), this.context.canvas.height * Math.random(), 20, 75, 'orange', this.gameWidth, this.gameHeight));
    }
    createAllGhosts(){
        this.createARedGhost()
        this.createAPinkGhost()
        this.createACyanGhost()
        this.createAnOrangeGhost()
    }
    createNBadFood(n) {
        for (let i = 0; i < n; i++) {
            let tmp_food = null;
            do{
                tmp_food = new Food(Math.random() * this.gameWidth, Math.random() * this.gameHeight, 0.02, FoodType.Bad, this.gameWidth, this.gameHeight);
            }while (tmp_food.circlesOverlap(this.pacman))

            this.foods.push(tmp_food)
        }
    }

    createNGoodFood(n) {

        // create n balls
        for (let i = 0; i < n; i++) {
            let tmp_food = null;
            do{
                tmp_food = new Food(Math.random() * this.gameWidth, Math.random() * this.gameSceneHeight, 0.02, FoodType.Good, this.gameWidth, this.gameHeight);
            }while (tmp_food.circlesOverlap(this.pacman))

            if (!(FoodType.Good.key in this.availableType))
                this.availableType[FoodType.Good.key] = 0
            this.availableType[FoodType.Good.key] += 1
            this.foods.push(
                tmp_food
            )
        }
    }

    initLevelMain() {
        if (this.initLevelAudio.ended) {
            if (!this.initSoundFinishPlayed) {

                // Play the audio
                this.curentLevelAudio.play();


                this.initSoundFinishPlayed = true
            }
            return true;
        }
        return false;
    }

    draw(ctx, guide) {
        //if (this.isFinished())
        //    return
        if (this.gamePaused){
            this.drawPauseMenu(ctx);
        }else{
            this.pacman.draw(ctx);
            this.ghosts.forEach(function (ghost) {
                ghost.draw(ctx, guide);
            });
            for (const food of this.foods) {
                food.draw(ctx)
            }

            ctx.fillStyle = "#000";
            ctx.font = "15px Arial";
            ctx.fillText(this.point.toString(), 20, 20);
        }


    }
    testCollisionWithPlayerAndFood(b) {
        if(this.pacman.circlesOverlap(b)) {
            // we remove the element located at index
            // from the balls array
            // splice: first parameter = starting index
            //         second parameter = number of elements to remove
            if (!(b.foodType.key in this.eatenType))
                this.eatenType[b.foodType.key] = 0
            this.eatenType[b.foodType.key] ++
            if (b.foodType.key in this.availableType)
                this.availableType[b.foodType.key] --;
            this.point += b.eat();
            if (this.point<0){
                this.gameOver();
            }
        }
    }

    keydown(evt) {
        console.log(evt);
        switch (evt.key) {
            case "Escape":
                // Toggle game pause state
                this.gamePaused = !this.gamePaused;
                if (this.gamePaused) {
                } else {
                    // Resume game logic
                    // Add your resume game logic here
                    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
                }
                break;
            case "1":
                if (this.gamePaused) {
                    // Resume game logic
                    this.gamePaused = false;
                    // Add your resume game logic here
                    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
                }
                break;
            case "2":
                if (this.gamePaused) {
                    // Quit game logic
                    alert("Quitting game!");
                    // Add your quit game logic here
                }
                break;
        }
    }
    mouseMoved(evt) {
        if (this.initLevelMain()&&!this.isFinished()&&!this.gamePaused)
            this.pacman.moveTo(evt.clientX-this.targeted_document.getElementById("pacman").getBoundingClientRect().left,evt.clientY-this.targeted_document.getElementById("pacman").getBoundingClientRect().top);
    }
    checkForNextLevel(){
        if (this.initLevelMain() && FoodType.Good.key in this.availableType && this.availableType[FoodType.Good.key]===0) {
            this.nextStage(this.getNextStage());
            this.finished()
        }
    }

    update(elapsed, force=false) {

        if (this.isFinished() || this.gamePaused) {
            if (this.gamePaused){}
            //console.log('game updated paused');
            return
        }
        if (this.initLevelMain()||force){
            if (!force)
                if (this.curentLevelAudio.currentTime >= 0.29) {
                    // If the audio is within the 3-6 second range, rewind to 3 seconds
                    this.curentLevelAudio.currentTime = 0;
                } else if (this.curentLevelAudio.currentTime < 0) {
                    // If the audio is not within the 3-6 second range, play from 3 seconds
                    this.curentLevelAudio.currentTime = 0;
                    this.curentLevelAudio.play();
                }

            this.pacman.update(elapsed, this.context.canvas.width, this.context.canvas.height);
            for (const ghost of this.ghosts) {
                ghost.update(this.pacman, elapsed);
                this.testCollisionWithPlayerAndGhost(ghost);
            }
            for (const food of this.foods) {
                food.update();
                this.testCollisionWithPlayerAndFood(food);
            }

            this.checkForNextLevel();

        }
    }

    testCollisionWithPlayerAndGhost(b) {
        if(this.pacman.circlesOverlap(b)) {
            this.gameOver();
        }
    }
    gameOver(){
        alert('game over');
        location.reload();
    }
    createNBadFoodAlive(n) {
        for (let i = 0; i < n; i++) {

            let tmp_food = null;
            do{
                tmp_food = new AliveFood(Math.random() * this.gameWidth, Math.random() * this.gameHeight, 0.02, 2, 2, FoodType.Bad, 2, this.gameWidth, this.gameHeight);
            }while (tmp_food.circlesOverlap(this.pacman))

            this.foods.push(
                tmp_food
            )
        }
    }
    createNBadZigzagFoodAlive(n) {
        for (let i = 0; i < n; i++) {

            let tmp_food = null;
            do{
                tmp_food = new ZigZagAliveFood(Math.random() * this.gameWidth, Math.random() * this.gameHeight, 0.02, 2, 2, FoodType.BadZigzag, 2, this.gameWidth, this.gameHeight);
            }while (tmp_food.circlesOverlap(this.pacman))

            this.foods.push(
                tmp_food
            )
        }
    }
    createNBadZigzagRandomSizeFoodAlive(n) {
        for (let i = 0; i < n; i++) {

            let tmp_food = null;
            do{
                tmp_food = new ZigZagRandomSizeAliveFood(Math.random() * this.gameWidth, Math.random() * this.gameHeight, 0.02, 2, 2, FoodType.BadZigzagRandomSize, 2, this.gameWidth, this.gameHeight);
            }while (tmp_food.circlesOverlap(this.pacman))

            this.foods.push(
                tmp_food
            )
        }
    }

    finished() {
        this.finish = true;
    }
    isFinished(){
        return this.finish;
    }
}
class Levels{
    constructor(_window, targeted_document, balls_number=10, gameWidth=600, gameHeight=600, levelSoundPath='sounds/siren_1.wav') {
        this._window = _window
        this.targeted_document = targeted_document
        this.balls_number = balls_number
        this.gameWidth = gameWidth
        this.gameHeight = gameHeight
        this.levelSoundPath = levelSoundPath
        this.otherInt = 3
        this.currentLevel = new LevelWithBadAliveFood(this._window, this.targeted_document, this.nextStage, this.balls_number, this.gameWidth, this.gameHeight, this.levelSoundPath)
    }

    nextStage(nextStageClass){
        this.currentLevel = new nextStageClass(this._window, this.targeted_document, this.nextStage, this.balls_number, this.gameWidth, this.gameHeight, this.levelSoundPath);
    }
    draw(ctx, guide) {
        this.currentLevel.draw(ctx, guide);

    }
    update(elapsed, force=false) {
        if (this.currentLevel.isFinished()) {
            var nextLevelClass = this.currentLevel.getNextStage()
            this.currentLevel = new nextLevelClass(this._window, this.targeted_document, this.nextStage, this.balls_number, this.gameWidth, this.gameHeight, this.levelSoundPath);
        }
        this.currentLevel.update(elapsed, force);
    }
    mouseMoved(evt){
        this.currentLevel.mouseMoved(evt);
    }
    keydown(evt){
        this.currentLevel.keydown(evt);
    }
}
class LevelWithBadAliveFood extends Level{
    initComponents() {
        this.createNGoodFood(1);
        this.createNBadFoodAlive(1)
    }
    getNextStage() {
        return LevelWithBadZigZagAliveFood;
    }
}
class LevelWithBadZigZagAliveFood extends Level{
    initComponents() {
        this.createNGoodFood(10);
        this.createNBadFoodAlive(2)
        this.createNBadZigzagFoodAlive(2)
    }
    getNextStage() {
        return LevelWithBadZigZagRandomSizeAliveFood;
    }
}
class LevelWithBadZigZagRandomSizeAliveFood extends Level{
    initComponents() {
        this.createNGoodFood(10);
        this.createNBadFood(1);
        this.createNBadFoodAlive(2);
        this.createNBadZigzagFoodAlive(2)
        this.createNBadZigzagRandomSizeFoodAlive(2);
    }
    getNextStage() {
        return LevelWithOneRedGhost;
    }
}
class LevelWithOneRedGhost extends Level{
    initComponents() {
        this.createNGoodFood(10);
        this.createARedGhost();
    }
    getNextStage() {
        return LevelWithAllGhosts;
    }
}
class LevelWithAllGhosts extends Level{
    initComponents() {
        this.createNGoodFood(18);
        this.createNBadFood(5);
        this.createNBadFoodAlive(2);
        this.createAllGhosts();
    }
    getNextStage() {
        return LevelWithAllEnemies;
    }
}
class LevelWithAllEnemies extends Level{
    initComponents() {
        this.createNGoodFood(10);
        this.createNBadFood(1);
        this.createNBadFoodAlive(2);
        this.createNBadZigzagFoodAlive(2)
        this.createNBadZigzagRandomSizeFoodAlive(2);
        this.createAllGhosts();
    }
    getNextStage() {
        return LevelWithBadAliveFood;
    }
}
startButton.onclick = function() {
    let currentLevel = null;
    const context = document.getElementById("pacman").getContext("2d");

    let previous = null;
    let elapsed=null;
    // add a mousemove event listener to the canvas
    document.addEventListener('mousemove', mouseMoved);
    document.addEventListener("keydown", keydown);
    function keydown(evt) {
        currentLevel.keydown(evt)
    }
    function mouseMoved(evt) {
        currentLevel.mouseMoved(evt)
    }
    function frame(timestamp) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        if (!previous) previous = timestamp;
        elapsed = timestamp - previous;
        currentLevel.update(elapsed / 1000);
        currentLevel.draw(context, true);
        previous = timestamp;
        window.requestAnimationFrame(frame);
    }
    function run(){
        currentLevel = new Levels(window,document);
        startButton.style.display = 'none';
        window.requestAnimationFrame(frame);
    }
    run()
};
//let mygame = new Game(window, document);

startButton.disabled=false

var globalSpeedMutiplier = 1;
function changeBallSpeed(coef) {
    globalSpeedMutiplier = coef;
}