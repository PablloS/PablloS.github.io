
//обработка кнопки "способности"
$(document).ready(function() {
   $("#rules").on("click", skills); 
});

//считываем с помощью ajax описание с xml файла
function skills() {
    pauseFlag = true;
    StartFlag = false;
    var div = $("<div id='description'></div>");
    var freeze = $("<div class = 'Descr' id= 'f'></div>");
    $.get("skills.xml", function(data) {
        var el = $(data).find("freeze").text(); 
        freeze.append(el); 
    });
    var heal = $("<div class = 'Descr'></div>");
    $.get("skills.xml", function(data) {
        var el = $(data).find("heal").text(); 
        heal.append(el); 
    });
    var boom = $("<div class = 'Descr' id = 'b'></div>");
    $.get("skills.xml", function(data) {
        var el = $(data).find("boom").text(); 
        boom.append(el); 
    });
    var close = $("<div id='close'>Закрыть</div>"); 
    close.on("click", removeDiv);
    div.append(freeze);
    div.append(heal);
    div.append(boom);
    div.append(close);
    $("body").append(div); 
}

//удаление блока 
function removeDiv() {
    StartFlag = true;
    pauseFlag = false; 
    $("#description").remove(); 
}