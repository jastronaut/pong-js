var pong;
(function (pong) {
    var board = document.querySelector('#board');
    var bigger = document.querySelector('#bigger');
    var smaller = document.querySelector('#smaller');
    var faster = document.querySelector('#faster');
    var slower = document.querySelector('#slower');
    var gamectrl = document.querySelector('#gamectrl');
    var paddlecoords = document.querySelector('#paddlecoords');
    var whichpressed = document.querySelector('#whichpressed');
    var ballcoords = document.querySelector('#ballcoords');
    var timeelapsed = document.querySelector('#timeelapsed');
    var seconds = -1;
    var minutes = 0;
    var ctx = board.getContext('2d');
    var initgame = false;
    var gameLoop = null;
    var timerLoop = null;
    var debug = false;
    function showDebugMenu() {
        if (debug) {
            var debugdisplay = document.querySelector('.debug');
            debugdisplay.style.display = 'block';
        }
    }
    showDebugMenu();
    function resetTimer() {
        seconds = -1;
        minutes = 0;
        timeelapsed.innerHTML = '<b>Time elapsed</b>: 00:00';
    }
    function setTimer() {
        if (seconds == 59) {
            minutes++;
            seconds = 0;
        }
        else
            seconds++;
        var minutesformat = minutes.toString();
        if (minutes < 10)
            minutesformat = '0' + minutesformat;
        var secondsformat = seconds.toString();
        if (seconds < 10)
            secondsformat = '0' + secondsformat;
        timeelapsed.innerHTML = '<b>Time elapsed</b>: ' + minutesformat + ':' + secondsformat;
    }
    setTimer();
    // ball controls
    bigger.onclick = function () {
        ballR += 10;
    };
    smaller.onclick = function () {
        ballR -= 10;
    };
    faster.onclick = function () {
        dx *= 2;
        dy *= 2;
    };
    slower.onclick = function () {
        dy /= 2;
        dx /= 2;
    };
    // game code
    var ballX = board.width / 2;
    var ballY = board.height / 2;
    var ballR = 20;
    var dx = -4;
    var dy = -4;
    function resetBall() {
        ballX = board.width / 2;
        ballY = board.height / 2;
        ballR = 20;
        dx = -4;
        dy = -4;
    }
    function drawBall() {
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballR, 0, Math.PI * 2, false);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.closePath();
        if (debug)
            ballcoords.innerHTML = "<b>Ball</b>: (" + ballX + ", " + ballY + ")";
    }
    var paddleW = 100;
    var paddleH = 20;
    var paddleX = (board.width / 2) - (paddleW / 2);
    var paddleY = board.height - paddleH;
    var leftCount = 0;
    var rightCount = 0;
    function resetPaddle() {
        paddleW = 100;
        paddleH = 20;
        paddleX = (board.width / 2) - (paddleW / 2);
        paddleY = board.height - paddleH;
        leftCount = 0;
        rightCount = 0;
    }
    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, paddleY, paddleW, paddleH);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.closePath();
        if (debug)
            paddlecoords.innerHTML = "<b>Paddle</b>: (" + paddleX + ", " + paddleY + ")";
    }
    // paddle arrow control
    var leftPressed = false;
    var rightPressed = false;
    window.onkeydown = function (event) {
        if (event.keyCode == 37)
            leftPressed = true;
        else if (event.keyCode == 39)
            rightPressed = true;
    };
    window.onkeyup = function (event) {
        if (event.keyCode == 37)
            leftPressed = false;
        else if (event.keyCode == 39)
            rightPressed = false;
    };
    function draw() {
        ctx.clearRect(0, 0, board.width, board.height);
        drawBall();
        drawPaddle();
        ballX += dx;
        ballY += dy;
        if (ballY + (ballR / 2) > board.height - paddleH) {
            if ((ballX >= paddleX) && (ballX <= paddleX + paddleW)) {
                dy *= -1;
            }
            else {
                window.clearInterval(gameLoop);
                window.clearInterval(timerLoop);
                gamectrl.classList.remove('btn-success');
                gamectrl.classList.add('btn-danger');
            }
        }
        if (ballX < ballR / 2 || ballX > board.width - ballR / 2)
            dx *= -1;
        if (ballY < ballR / 2 || ballY > board.height - ballR / 2)
            dy *= -1;
        if (leftPressed)
            whichpressed.innerHTML = 'Left ' + ++leftCount;
        if (rightPressed)
            whichpressed.innerHTML = 'Right ' + ++rightCount;
        if (leftPressed && paddleX > 0)
            paddleX -= 7;
        if (rightPressed && paddleX + paddleW < board.width)
            paddleX += 7;
    }
    gamectrl.onclick = function () {
        if (!initgame) {
            gameLoop = window.setInterval(draw, 30);
            timerLoop = window.setInterval(setTimer, 1000);
            initgame = true;
            gamectrl.innerHTML = 'Restart Game';
        }
        else {
            if (gamectrl.classList.contains('btn-danger')) {
                gamectrl.classList.remove('btn-danger');
                gamectrl.classList.add('btn-success');
            }
            ctx.clearRect(0, 0, board.width, board.height);
            window.clearInterval(gameLoop);
            window.clearInterval(timerLoop);
            resetBall();
            resetPaddle();
            resetTimer();
            gameLoop = window.setInterval(draw, 30);
            timerLoop = window.setInterval(setTimer, 1000);
            initgame = false;
        }
    };
})(pong || (pong = {}));
