var globalCurLevel = 1;
var globalText = "";
var globalTimer = null;
var globalIsSoundOn = false;
var globalErrorSound = new Audio("static/media/oops.ogg");
var globalSuccessSound = new Audio("static/media/yeah.mp3");

function showMsg(title, iconName, text) {
    $msg = $('#msg');
    $msg.find("span.title").text(title);
    $msg.find("p.msg.icon").addClass("material-symbols-outlined").text(iconName);
    $msg.find("p.msg.desc").html(text);
    $.blockUI({
        message: $('#msg')
    });
}

function theEnd() {
    $("#info").fadeOut();
    $("#soundCtrl").fadeOut();
    $("#level").fadeOut();
    $("#timer").fadeOut();
    $("#part2").fadeOut(function() {
        $("#part3").show('bounce', {times:1, direction: 'up'}, 300);
    });
}

var complete = function () {
    globalTimer.forceStop();
    var mistakes = +$("#mistakes").text();
    $("#mistakes").text(0);
    $("#re").hide();
    if (mistakes > 0) {
        $("#correct").text("0");
        var text = "Результат отличный, но у Вас были ошибки. Для перехода на другой уровень надо " +
            "два раза подряд пройти этот уровень без ошибок. Попробуйте еще разок!";
        showMsg("=(", "warning", text);
        start();
        return;
    }
    var howMuch = parseInt($("#correct").text());
    howMuch++
    $("#correct").text(howMuch);
    if (howMuch == 2) {
        globalCurLevel++;
        updateProgressBar();
        if (globalCurLevel == 4) {
            globalTimer = new Timer($("#min"), $("#sec"), onOverTime);
            $("#timer").hide();
        }
        if (globalCurLevel == 7) {
            theEnd();
            return;
        }
        var text = "Отлично! Вы прошли " + (globalCurLevel -1) + " уровень. Добро пожаловать на уровень "
            + globalCurLevel + " (из 6).";
        showMsg("Отлично", "done", text);
        $("#levelNum").text(globalCurLevel);
        $("#correct").text("0");
        start();
    } else {
        var text = "Хорошо! Вы расставили <strong>все верно и без ошибок</strong>. " +
            "Для того, чтобы перейти на следующий уровень надо проделать это <strong>еще 1 раз</strong>";
        showMsg("Правильно", "done", text);
        start();
    }
};

var error = function (msg) {
    if (msg == "small_text") {
        var text = "Этот сервис позволяет выучить стихотворения только длиной от 4 строк.";
    } else if (msg == "big_line") {
        var text = "В вашем стихотворении слишком длинные строки. Длина строки должна быть до 46 символов.";
    } else if (msg == "small_words") {
        var text = "В вашем стихотворении слишком короткие слова. Нужно как минимум 4 слова длиной от 4 букв и больше.";
    }
    showMsg("Ошибка ввода", "error", text);
};

var action = function(isCorrect, isFirst) {
    if (isCorrect && isFirst) {
        globalTimer.forceStart();
    }
    if (!isCorrect) {
        $("#mistakes").text((+$("#mistakes").text()+1));
        if (globalIsSoundOn) {
            $.clone(globalErrorSound).play();
        }
        if (+$("#mistakes").text() == 1 ) {
            $("#re").fadeIn(300);
        }
    } else {
        if (globalIsSoundOn) {
            $.clone(globalSuccessSound).play();
        }
    }
};

function isCorrectText() {
    var app = new App(globalText, 4, complete, error, action, $('#container'), $('#result'));
    return !app.isError;
}

function start() {
    if (globalCurLevel < 3) {
        var linesMixed = globalCurLevel*4;
        var app = new App(globalText, linesMixed, complete, error, action, $('#container'), $('#result'));
        if (!app.isError) {
            app.cleanUp();
            $('#result').html($("#help"+globalCurLevel).html());
            app.shuffle();
        }
        return;
    }
    if (globalCurLevel == 3) {
        $("#timer").css("display", "table");
        globalTimer.prepareCnt();
        var linesMixed = 4;
        var app = new App(globalText, linesMixed, complete, error, action, $('#container'), $('#result'));
        if (!app.isError) {
            app.cleanUp();
            $('#result').html($("#help3").html());
            app.shuffle();
        }
        return;
    }
    if (globalCurLevel == 4 || globalCurLevel == 5) {
        var linesMixed = (globalCurLevel-3)*4;
        var app = new App(globalText, linesMixed, complete, error, action, $('#container'), $('#result'));
        if (!app.isError) {
            app.cleanUp();
            app.missWords();
        }
        return;
    }
    if (globalCurLevel == 6) {
        $("#timer").css("display", "table");
        globalTimer.prepareCnt();
        var linesMixed = 4;
        var app = new App(globalText, linesMixed, complete, error, action, $('#container'), $('#result'));
        if (!app.isError) {
            app.cleanUp();
            app.missWords();
        }
        return;
    }
}

function updateProgressBar() {
    var percent = Math.round((globalCurLevel-1)/6*100);
    var $progress = $("#progressBar");
    if (percent > 80) {
        $progress.css("color", "white");
    }
    $progress.progressbar({value:percent});
    $progress.find("#percentText").text("Завершено на " + percent + "%");
}

function onOverTime(timeInc) {
    $("#mistakes").text(0);
    $("#correct").text("0");
    $("#re").hide();
    if (timeInc) {
        var text = "К сожалению, Вы снова не успели. Чтобы Вы не нервничали, мы увеличили время на 10%. " +
            "Надеемся, теперь у Вас все получится!";
    } else {
        var text = "К сожалению, Вы не успели выполнить задачу за отведенное Вам время. " +
            "Но поверьте, это вполне реально. Ведь это время взято не случайно. " +
            "Вы совсем недавно решили такую задачу именно за это время.";
    }
    showMsg("Не успели =(", "warning", text);
    start();
}

$(document).ready(function () {
    $("#poetry").focus();
    globalTimer = new Timer($("#min"), $("#sec"), onOverTime);
    $("#go").click(function () {
        globalText =  $("#poetry").val();
        if (isCorrectText()) {
            var t = 300;
            $("#adsense").hide();
            $("#part1").fadeOut(function(){
                $("#part2").show('bounce', {times:1, direction: 'up'}, t);
                $("#info").fadeIn(t);
                $("#level").fadeIn(t);
                $("#soundCtrl").fadeIn(t);
            });
            start();
        }
    });
    $(".unblock").click(function() {
        $.unblockUI();
        return false;
    });
    $("#msg a").click(function() {
        if (globalCurLevel > 3 && $("#title"+globalCurLevel).length > 0) {
            showMsg($("#title"+globalCurLevel).text(), "info", $("#help"+globalCurLevel).text());
            $("#title"+globalCurLevel).remove();
            $("#help"+globalCurLevel).remove();
            return;
        }
        $.unblockUI();
    });
    $("#send").click(function() {
        var $text = $("#contact > textarea");
        var text = $text.val();
        var arr = text.match(/[^\s]+/);
        if (arr === null) {
            $text.addClass("error");
        } else {
            $text.removeClass("error");
            $.ajax({
                type: "POST",
                url: "/byheart/post2mail.php",
                data: { text: text }
            }).done(function( msg ) {
                showMsg("Спасибо", "done", "Спасибо, сообщение отправлено. Если Вы оставили " +
                    "Ваши контакты - мы обязательно ответим Вам.");
                });
        }
    });
    $("#re").click(function() {
        $("#mistakes").text(0);
        $("#correct").text(0);
        $("#re").fadeOut(300);
        globalTimer.forceStop();
        start();
    });
    $("#soundCtrl").click(function() {
        if (globalIsSoundOn) {
            $(this).attr('src','static/media/sound_off.png');
            $(this).attr('title','Включить звук');
        } else {
            $(this).attr('src','static/media/sound_on.png');
            $(this).attr('title','Отключить звук');
        }
        globalIsSoundOn = !globalIsSoundOn;
    });
    $("#writeUs").click(function(event) {
        $.blockUI({
            message: $('#contact')
        });
        event.preventDefault();
    });
    /*
    $("body").keydown(function(e) {
        var keycode = e.keyCode;
        if  (keycode >= 49 && keycode <= 57) {
            var num = keycode - 48;
        } else if (keycode >= 97 && keycode <= 105) {
            var num = keycode - 96;
        }
        var arr = $("#container li");
        console.log(arr);
        if (arr.length > 0 && num <= arr.length) {
            arr[num-1].click();
        }
        console.log(num);
    });*/
})
