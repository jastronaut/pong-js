namespace pong {
    var board = document.querySelector('#board') as HTMLCanvasElement;

    var bigger = document.querySelector('#bigger') as HTMLButtonElement;
    var smaller = document.querySelector('#smaller') as HTMLButtonElement;
    var faster = document.querySelector('#faster') as HTMLButtonElement;
    var slower = document.querySelector('#slower') as HTMLButtonElement;

    var gamectrl = document.querySelector('#gamectrl') as HTMLButtonElement;
    var paddlecoords = document.querySelector('#paddlecoords') as HTMLParagraphElement;
    var whichpressed = document.querySelector('#whichpressed') as HTMLParagraphElement;
    var ballcoords = document.querySelector('#ballcoords') as HTMLParagraphElement;

    var timeelapsed = document.querySelector('#timeelapsed') as HTMLParagraphElement;
    let seconds = -1;
    let minutes = 0;

    var ctx = board.getContext('2d');

    let initgame = false;
    let gameLoop = null;
    let timerLoop = null;
    let debug = false;

    function showDebugMenu() {
        if (debug) {
            let debugdisplay = document.querySelector('.debug') as HTMLDivElement;
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
        } else
            seconds++;

        let minutesformat = minutes.toString();
        if (minutes < 10)
            minutesformat = '0' + minutesformat;
        let secondsformat = seconds.toString();
        if (seconds < 10)
            secondsformat = '0' + secondsformat;

        timeelapsed.innerHTML = '<b>Time elapsed</b>: ' + minutesformat + ':' + secondsformat;
    }

    setTimer();

    // ball controls
    bigger.onclick = () => {
        ballR += 10;
    };

    smaller.onclick = () => {
        ballR -= 10;
    };

    faster.onclick = () => {
        dx *= 2;
        dy *= 2;
    };

    slower.onclick = () => {
        dy /= 2;
        dx /= 2;
    };

    // game code
    let ballX = board.width / 2;
    let ballY = board.height / 2;
    let ballR = 20;
    let dx = -4;
    let dy = -4;

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

    let paddleW = 100;
    let paddleH = 20;
    let paddleX = (board.width / 2) - (paddleW / 2);
    let paddleY = board.height - paddleH;

    let leftCount = 0;
    let rightCount = 0;

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
    let leftPressed = false;
    let rightPressed = false;

    window.onkeydown = (event) => {
        if (event.keyCode == 37)
            leftPressed = true;
        else if (event.keyCode == 39)
            rightPressed = true; 

    };

    window.onkeyup = (event) => {
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
        if (ballY < ballR / 2 || ballY > board.height - ballR/2)
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

    gamectrl.onclick = () => {
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
}
