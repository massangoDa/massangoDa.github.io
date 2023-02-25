var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 5;
var myMisileX = canvas.width/2;
var myMisileY = canvas.height-30;
var enemyMisileX = -10;
var enemyMisileY = 0;
var enemyMisileDy = 2;
var enemyMisileExist = false;
var startFlag = true;
var hitStatus = true;
var myMisileDy = -5;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
var mouseClicked = false;
var brickRowCount = 5;
var brickColumnCount = 3;
var brickWidth = 45;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
var lives = 3;

/* ブロック初期化 */
var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
  bricks[c] = [];
  for(var r=0; r<brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1, misile: 0 };
  }
}

document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("click", mouseClickHandler, false);

/* 敵ミサイルの状態 */
var enemyMisileStatus = setInterval(function(){
  if(!enemyMisileExist){
        for(var c=0; c<brickColumnCount; c++) {
            for(var r=0; r<brickRowCount; r++) {
                bricks[c][r].misile = 0;
                }
            }
        var randomC = Math.floor( Math.random() * brickColumnCount );
        var randomR = Math.floor( Math.random() * brickRowCount );
        if(bricks[randomC][randomR].status == 1){
            bricks[randomC][randomR].misile = 1;
        }
    }
}, 3000-moveCount*100);

/* 発射ミサイル位置設定 */
var enemyMisilePosition = setInterval(function(){
    if(!enemyMisileExist){
        for(var c=0; c<brickColumnCount; c++) {
            for(var r=0; r<brickRowCount; r++) {
                if(bricks[c][r].misile == 1) {
                    enemyMisileX = bricks[c][r].x+brickWidth/2;
                    enemyMisileY = bricks[c][r].y;
                }
            }
        }
    }
}, 3000-moveCount*100);

var moveCount = 0;
var rightFlag = 1;
/* 敵位置の変更 */
var enemyPosition = setInterval(function(){
    startFlag = false;
    var moveX = 5;
    var moveY = 0;
    if(moveCount>75){
        //敵が迫ってきたので，ゲームオーバー
        //alert("GAME OVER");
        document.location.reload();
    }
    if(moveCount % 10 == 5){
        moveX = 0;
        moveY = 20;
        rightFlag = -rightFlag;
    } else {
        moveX = rightFlag*5;
    }
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            bricks[c][r].x += moveX;
            bricks[c][r].y += moveY;
        }
    }
    moveCount++;
}, 1000);

/* パドル位置の取得 */
function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if(relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth/2;
  }
}

/* クリック位置の取得 */
function mouseClickHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
    if(!mouseClicked){
        myMisileX = relativeX;
        mouseClicked = true;
    }
}

/* ミサイルヒット判定 */
function collisionDetection() {
  for(var c=0; c<brickColumnCount; c++) {
    for(var r=0; r<brickRowCount; r++) {
      var b = bricks[c][r];
      if(b.status == 1) {
        if(myMisileX > b.x && myMisileX < b.x+brickWidth && myMisileY > b.y && myMisileY < b.y+brickHeight) {
          mouseClicked = false;
                    myMisileY = canvas.height-30;
          b.status = 0;
          score++;
                    console.log("敵にhit");
          if(score == brickRowCount*brickColumnCount) {
            alert("You win, congratulations!");
            document.location.reload();
          }
        }
      }
    }
  }
}

/* ミサイルの生成 */
function drawMyMisile() {
  ctx.beginPath();
  ctx.arc(myMisileX, myMisileY, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "#ff69b4";
  ctx.fill();
  ctx.closePath();
}

/* 敵ミサイルの生成 */
function drawEnemyMisile() {
  ctx.beginPath();
  ctx.arc(enemyMisileX, enemyMisileY, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

/* パドルの生成 */
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#ff69b4";
  ctx.fill();
  ctx.closePath();
}

/* ブロックの生成 */
function drawBricks() {
  for(var c=0; c<brickColumnCount; c++) {
    for(var r=0; r<brickRowCount; r++) {
      if(bricks[c][r].status == 1) {
                if(startFlag){
                    bricks[c][r].x = (r*(brickWidth+brickPadding))+brickOffsetLeft;
            bricks[c][r].y = (c*(brickHeight+brickPadding))+brickOffsetTop;
                }
        ctx.beginPath();
        ctx.rect(bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

/* スコア表示 */
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: "+score, 8, 20);
}

/* HP表示 */
function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

/* 描画 */
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
    drawEnemyMisile();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

    enemyMisileY += enemyMisileDy + 0.1*moveCount;
    if(enemyMisileY>canvas.height){
        enemyMisileExist = false;
        hitStatus = true;
    } else {
        enemyMisileExist = true;
    }
    if(hitStatus){
        if(canvas.height >= enemyMisileY && enemyMisileY >= canvas.height-ballRadius) {
            if(enemyMisileX > paddleX && enemyMisileX < paddleX + paddleWidth) {
                lives--;
                hitStatus = false;
                if(!lives) {
                    //alert("GAME OVER");
                    document.location.reload();
                }
            }
        }
    }

    if(mouseClicked){
        drawMyMisile();
        myMisileY += myMisileDy;
        if(myMisileY<=0){
            mouseClicked = false;
            myMisileY = canvas.height-30;
        }
    }
    if(myMisileY > enemyMisileY-ballRadius && enemyMisileY+ballRadius > myMisileY){
        if(myMisileX > enemyMisileX-ballRadius*2 && enemyMisileX+ballRadius*2 > myMisileX){
            console.log("MISILE同士がhit");
            enemyMisileExist = false;
            mouseClicked = false;
            myMisileY = canvas.height-30;
        }
    }
  requestAnimationFrame(draw);
}

draw();