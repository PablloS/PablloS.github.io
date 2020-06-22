var N = 3;
var widthCount, heightCount;
var StartFlag = true, pauseFlag = false, frez = true, endGameFlag=false;
var enemySpeed = 0.3;
var id1, id2, id3, id4;
var dropTimer = 50000;

$(document).ready(function () {
    if (localStorage.length==0)
        localStorage.setItem("score", "0");
    $("#score").html(parseInt(localStorage.getItem("score")));
    count1();
    $("#start").on("click", startGame);
    $("#pause").on("click", pauseGame);
});

//функция рассчитывающая длину и ширину игрового поля в пикселях
function count1() {
    widthCount = $("#gameArea").css("width");
    widthCount = parseInt(widthCount.replace("px", ""));
    heightCount = $("#gameArea").css("height");
    heightCount = parseInt(heightCount.replace("px", ""));
    heightCount = heightCount - (heightCount / 10);
}

//функция для старта игры
function startGame() {
    if (StartFlag) {
        //строим базу 
        var base = $("<div id='base'></div>");
        base.attr("hp", 10000);
        $("#gameArea").append(base);
        var baseHp = $("<div id='baseHp'></div>");
        $("#gameContent").append(baseHp);
        //добавляем див points
        var points = $("<div id='points'>Score</div>");
        var pointsVal = $("<div id='pointsVal'>0</div>");
        $("#scoreCont").append(points);
        $("#scoreCont").append(pointsVal);
        //добавляем дивы с умениями 
        var money = $("<div id='money'>Money</div>");
        var moneyVal = $("<div id='moneyVal'>0</div>");
        var moneyCont = $("<div id='moneyCont'></div>");
        $(moneyCont).append(money);
        $(moneyCont).append(moneyVal);
        var contain = $("<div id = 'skillCont'></div>");
        var heal = $("<div id = 'heal'>Здоровье 75</div>");
        heal.on("click", healBase);
        var boom = $("<div id = 'boom'>Бум 150</div>");
        boom.on("click", boomEvent);
        var freeze = $("<div id = 'freeze'>Заморозка 50</div>");
        freeze.on("click", freezeEvent);
        $(contain).append(moneyCont);
        $(contain).append(freeze);
        $(contain).append(heal);
        $(contain).append(boom);
        $("#gameContent").append(contain);
        //вызываем функцию которая расставляет противников
        newWave();
        StartFlag = false;
        //вызываем функцию которая движет противников вперёд 
        enemyMove();
        //в setInterval вызываем функции которые создают новых противников и усложняют условия игроку
        id1 = setInterval(newWave, 10000);
        id2 = setInterval(function () {
            if (!pauseFlag) {
                if (N < 15)
                    N++;
                if (enemySpeed < 2)
                    enemySpeed += 0.01;
            }
        }, 15000);
        id4 = setInterval(function () {
            if (!pauseFlag && $(".enemy").length == 0) {
                newWave();
            }
        }, 3000);
        setTimeout(randomDrop, dropTimer);
    }
}

//Пауза игры
function pauseGame() {
    if (!StartFlag) {
        if (!pauseFlag)
            $("#pause").html("Продолжить");
        else
            $("#pause").html("Пауза");
        pauseFlag = !pauseFlag;
    }
}

//создание новой волны противников 
function newWave() {
    if (!pauseFlag && frez) {
        //Расставляем противников
        var count1 = 95 / N - 4;
        var count = 0;
        for (var i = 0; i < N; i++) {
            var enemy = $("<div class='enemy'></div>");
            var enHeighPos = parseInt(Math.random() * 10);
            var enWidPos = parseInt(Math.random() * (count1 - count) + count);
            enemy.css({"top": enHeighPos + "%", "right": +enWidPos + "%"});
            enemy.on("click", fire);
            enemy.attr("hp", 3);
            $("#gameArea").append(enemy);
            count1 += 95 / N;
            count += 95 / N;
        }
    }
}

//движение и атака противников
function enemyMove() {
    //движем противников вперёд
    id3 = setInterval(go1, 16);
    function go1() {
        if (!pauseFlag) {
            $(".enemy").each(function (ind, el) {
                var top = $(el).css("top");
                top = parseFloat(top.replace("px", ""));
                top += enemySpeed;
                //если не дошли до базы - движемся дальше, иначе вызываем функцию уничтожения базы
                if (top < heightCount)
                    $(el).css("top", top + "px");
                else {
                    baseDestr();
                }
            });
        }
    }
}

//функция атаки игрока
function fire() {
    if (!pauseFlag) {
        //клик по противнику отнимает у него здоровье, если здоровье = 0, удаляет противника с поля
        var hp = $(this).attr("hp");
        hp--;
        if (frez) {
            $(this).css("background-image", "url(img/enemy2.png)");
            var thisEnemy = $(this);
            setTimeout(function () {
                thisEnemy.css("background-image", "url(img/enemy.png)");
            }, 60, thisEnemy);
        }
        if (hp == 0) {
            $(this).remove();
            var points = parseInt($("#pointsVal").html());
            points += 5;
            $("#pointsVal").html(points);
            var money = parseInt($("#moneyVal").html());
            money += 1;
            $("#moneyVal").html(money);
        } else
            $(this).attr("hp", hp);
    }
}

//функция рассчёта здоровья базы
function baseDestr() {
    //если противники добрались до базы, отнимаем здоровье у базы, если здоровье базы = 0 - конец игры
    var hp = $("#base").attr("hp");
    hp--;
    if (hp == 0) {
        $("#base").remove();
        endGame();
    } else
        $("#base").attr("hp", hp);
    if (hp % 100 == 0) {
        var width = $("#baseHp").css("width");
        width = parseFloat(width.replace("px", ""));
        width -= widthCount / 100;
        $("#baseHp").css("width", width + "px");
    }
}

//ящик со случайным дропом
function randomDrop() {
    if (!pauseFlag) {
        $("#drop").remove();
        if (dropTimer > 15000) {
            dropTimer -= 5000;
        }
        var height = parseInt(Math.random() * (60) + 10);
        var width = parseInt(Math.random() * (80) + 10);
        var drop = $("<div id='drop'></div>");
        drop.on("click", freeItem);
        drop.css({"top": height + "%", "right": width + "%"});
        $("#gameArea").append(drop);
        setTimeout(function () {
            if (!pauseFlag)
                $("#drop").remove();
        }, 5000);
    }
    if (!endGameFlag) 
        setTimeout(randomDrop, dropTimer);
}

//генератор предмета в ящике 
function freeItem() {
    if (!pauseFlag) {
        $("#drop").remove();
        var count = parseInt(Math.random() * 7);
        if (count < 3) {
            var money = parseInt($("#moneyVal").html());
            money += 30;
            $("#moneyVal").html(money);
        } else if (count == 3) {
            var money = parseInt($("#moneyVal").html());
            money += 75;
            $("#moneyVal").html(money);
            healBase();
        } else if (count == 4 || count == 5) {
            var money = parseInt($("#moneyVal").html());
            money += 50;
            $("#moneyVal").html(money);
            freezeEvent();
        } else if (count == 6) {
            var money = parseInt($("#moneyVal").html());
            money += 150;
            $("#moneyVal").html(money);
            boomEvent();
        }
    }
}

//Скилл игрока: восстановление здоровья у базы
function healBase() {
    if (!pauseFlag) {
        var money = parseInt($("#moneyVal").html());
        if (money >= 75) {
            var width = $("#baseHp").css("width");
            width = parseFloat(width.replace("px", ""));
            if (width < widthCount - 25 * (widthCount / 100)) {
                width += 25 * (widthCount / 100);
                $("#baseHp").css("width", width + "px");
            } else
                $("#baseHp").css("width", widthCount + "px");
            var hp = parseInt($("#base").attr("hp"));
            if (hp < 7500) {
                hp += 2500;
                $("#base").attr("hp", hp);
            } else {
                $("#base").attr("hp", 10000);
            }
            money -= 75;
            $("#moneyVal").html(money);
        }
    }
}

//Скилл игрока: уничтожение всех противников на поле
function boomEvent() {
    if (!pauseFlag) {
        var money = parseInt($("#moneyVal").html());
        if (money >= 150) {
            $(".enemy").each(function (ind, el) {
                $(el).css("background-image", "url(img/enemy2.png)");
                setTimeout(function () {
                    $(el).remove();
                    var points = parseInt($("#pointsVal").html());
                    points += 5;
                    $("#pointsVal").html(points);
                }, 150, el);
            });
            money -= 150;
            $("#moneyVal").html(money);
        }
    }
}

//Скилл игрока: заморозка противников на 5 секунд
function freezeEvent() {
    if (frez && !pauseFlag) {
        frez = false;
        var money = parseInt($("#moneyVal").html());
        if (money >= 50) {
            clearInterval(id3);
            $(".enemy").each(function (ind, el) {
                $(el).css("background-image", "url(img/iceEnemy.png)");
            });
            setTimeout(function () {
                frez = true;
                enemyMove();
                $(".enemy").each(function (ind, el) {
                    $(el).css("background-image", "url(img/enemy.png)");
                });
            }, 5000);
            money -= 50;
            $("#moneyVal").html(money);
        }
    }
}

//функция окончание игры
function endGame() {
    //окончание игры
    pauseFlag = true;
    endGameFlag = true;
    $("#skillCont").remove();
    var endGame = $("<div id='endGame'><p>Вы проиграли Ваш счёт: " + parseInt($("#pointsVal").html()) + "</p><button id='newGame'>Начать новую игру</button></div>");
    $("#gameArea").append(endGame);
    var bestScore = parseInt(localStorage.getItem("score"));
    var tmpScore = parseInt($("#pointsVal").html());
    if (tmpScore > bestScore) {
        $("#score").html(tmpScore);
        localStorage.setItem("score", JSON.stringify(tmpScore));
    }
    $("#newGame").on("click", newGame);
}

//запуск новой игры после проигрыша
function newGame() {
    //очищаем арену и запускаем новую игру
    N = 3;
    enemySpeed = 0.3;
    $(".enemy").remove();
    $("#baseHp").remove();
    $("#points").remove();
    $("#pointsVal").remove();
    $("#endGame").remove();
    clearInterval(id1);
    clearInterval(id2);
    clearInterval(id3);
    clearInterval(id4);
    StartFlag = true;
    pauseFlag = false;
    startGame();
}
