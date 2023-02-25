const scenetop = document.querySelector("#top");
const sceneend = document.querySelector("#end");
const start = document.querySelector("#start");
const start2 = document.querySelector("#start2");
const start3 = document.querySelector("#start3");
const start4 = document.querySelector("#start4");
const scecedisplay = document.querySelector("#display");
let field = document.querySelectorAll(".field");
let turn = document.querySelector("h2");
let judgdisplay = document.querySelector("#judgdisplay");
let game = document.querySelector("#game");
let board = Array(9);//三つ揃ったか判定のために使う
let winflag = true;//勝敗が決まったらfalseにしてゲーム終了
let count = 0;//偶数なら先手の手番奇数なら後手の手番

const win_patterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

init();
function init() {
    start.addEventListener('click', playingfirst, false);
    start2.addEventListener('click', playingsecond, false);
}

function changescene(hiddenscene, visiblescene) {
    hiddenscene.classList.add("is-hidden");
    hiddenscene.classList.remove("is-visible");
    visiblescene.classList.add("is-visible");
    visiblescene.classList.remove("is-hidden");
}

function playingfirst() {
    changescene(scenetop, scecedisplay);
    player();
}
function playingsecond() {
    changescene(scenetop, scecedisplay);
    count = 3;
    turn.textContent = "コンピューターの番です";
    com();
    player()
}

function turn_action() {
    if (count % 2 == 0) {
        turn.textContent = "コンピューターの番です"
    } else {
        turn.textContent = "あなたの番です"
    }
    Judgment();
    count++;
}

//マスがクリックされた時の処理
function player() {
    for (let i = 0; i < field.length; i++) {
        field[i].onclick = () => {
            if (board[i] == undefined) {
                field[i].style.backgroundColor = "pink";
                board[i] = 1;
                turn_action();
                if (winflag) {
                    com();
                }
            }
        }
    }
}

//コンピュータ側の応手
function com() {
    game.classList.add('pointer-none');
    //コンピューターが後手の場合の一手目
    if (board[4] == 1 && count == 1) {
        drawingpiece(0);
        return;
    } else if (count == 1) {
        drawingpiece(4)
        return;
    }
    //2手目以降
    if (count > 2) {
        for (let j = 2; j > 0; j--) {
            for (let i = 0; i < win_patterns.length; i++) {
                let patterns = win_patterns[i];
                let square1 = (board[patterns[0]]);
                let square2 = (board[patterns[1]]);
                let square3 = (board[patterns[2]]);

                let x = square1 == undefined && square2 == j && square3 == j
                let y = square1 == j && square2 == undefined && square3 == j
                let z = square1 == j && square2 == j && square3 == undefined

                if (x) {
                    drawingpiece(patterns[0]);
                    return;
                }
                else if (y) {
                    drawingpiece(patterns[1]);
                    return;
                }
                else if (z) {
                    drawingpiece(patterns[2]);
                    return;
                }
            }
        }
    }
    if (!count % 2 == 0) {
        let flag = true;
        while (flag) {
            let random = Math.floor(Math.random() * board.length);
            if (board[random] == undefined) {
                drawingpiece(random);
                flag = false;
            }
        }
    }
    function drawingpiece(place) {
        setTimeout(function () {
            field[place].style.backgroundColor = "skyblue";
            board[place] = 2;
            game.classList.remove('pointer-none');
            turn_action();

        }, 1000);
    }
}

//三つ揃ったか判定
function Judgment() {

    for (let i = 0; i < win_patterns.length; i++) {
        let patterns = win_patterns[i];
        let square1 = (board[patterns[0]]);
        let square2 = (board[patterns[1]]);
        let square3 = (board[patterns[2]]);
        completed = square1 && square1 == square2 && square2 == square3 && square3 == square1;
        if (completed) {
            if (count % 2 == 0) {
                judgtextcreate(0);
                return;
            } else {
                judgtextcreate(1);
                return;
            }
        }
    }
    if (board.includes(undefined) == false && winflag) {
        judgtextcreate(2)
        return;
    }

    function judgtextcreate(result) {
        let judgtext = ["あなたの勝ちです", "コンピューターの勝ちです", "引き分けです"];
        judgdisplay.textContent = judgtext[result];
        changescene(scenetop, sceneend);
        scecedisplay.classList.remove("is-visible");
        scecedisplay.classList.add("is-hidden");
        start3.textContent = "もう一度対戦する";
        start3.onclick = () => { document.location.reload() };
        start4.textContent = "TOPへ戻る";
        start4.onclick = () => { location.replace("https://bubudoufu.com/webapp/") };
        game.classList.add('pointer-none');
        winflag = false;
        return;
    }
}