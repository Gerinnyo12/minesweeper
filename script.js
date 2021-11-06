let DIFFICULTY;
let act_difficulty;
let gameArea;
let body;
let happy_cat;
let cool_cat;
let sad_cat;
let menu_div;
let button_container;
let ez_button;
let medium_button;
let hard_button;
let restart_div;
let flag_counter;
let restart_button;
let sec_counter;
let sec_interval;
let chance_of_bomb;
let num_of_bombs;
let num_of_block_in_row;
let num_of_block_in_col;
let game_area_width;
let game_area_height;
let field_width;
let field_height;
let is_started;
let fields_with_bombs;
let revealed_fields;
let img1;
let img2;
let img3;
let img4;
let img5;
let img6;
let img7;
let img8;
let bomb_pic;
let empty_field;
let field_img;
let flag;
let background_music_div;
let background_music;
let pop_sound;
let win_sound;
let lose_sound;
let top_list_table;
let top_list;


$(document).on('contextmenu', function(e) {     // JOBB CLICK ELTUNTETESE
    e.preventDefault();
});

$(document).ready(function () {
    act_difficulty = 1;
    body = $('body');
    menu_div = $('<div></div>');
    button_container = $('<div></div>');
    ez_button = $('<input type="button" value="EZ"/>');
    medium_button = $('<input type="button" value="Közepes"/>');
    hard_button = $('<input type="button" value="Kegyetlen"/>');
    restart_div = $('<div></div>');
    flag_counter = $('<span style="border-left: none"></span>');
    restart_button = $('<img>');
    sec_counter = $('<span style="border-right: none"></span>');
    img1 = $('<img src="1.png" alt="1">');
    img2 = $('<img src="2.png" alt="2">');
    img3 = $('<img src="3.png" alt="3">');
    img4 = $('<img src="4.png" alt="4">');
    img5 = $('<img src="5.png" alt="5">');
    img6 = $('<img src="6.png" alt="6">');
    img7 = $('<img src="7.png" alt="7">');
    img8 = $('<img src="8.png" alt="8">');
    empty_field = $('<img src="ures.png" alt="ures">');
    flag = $('<img src="zaszlo.jpg" alt="zaszlo">');
    field_img = $('<img src="mezo.jpg" alt="mezo">');
    happy_cat = $('<img src="happy_cat.jpg" alt="restart">');
    cool_cat = $('<img src="cool_cat.jpg" alt="restart">');
    sad_cat = $('<img src="sad_cat.jpg" alt="restart">');
    bomb_pic = $('<img src="bomba.png" alt="bomba">');
    top_list_table = $('<table></table>');
    pop_sound = document.createElement('audio');
    pop_sound.setAttribute('src', 'pop_sound.mp3');
    win_sound = document.createElement('audio');
    win_sound.setAttribute('src', 'win_sound.mp3');
    lose_sound = document.createElement('audio');
    lose_sound.setAttribute('src', 'lose_sound.mp3');
    background_music_div = $('<div></div>');
    background_music = $('<audio controls autoplay loop>' +
                            '<source src="background_music.mp3" type="audio/mp3">' +
                            'A böngészője nem támogatja az audio tag-et.' +
                        '</audio>');
    init();
});

function init() {
    DIFFICULTY = act_difficulty;
    difficultySwitch();

    is_started = false;
    num_of_bombs = 0;
    fields_with_bombs = [];
    revealed_fields = 0;
    sec_counter.text(0);
    top_list = [];

    game_area_width = num_of_block_in_row * 50;
    game_area_height = num_of_block_in_col * 50;
    field_width = game_area_width / num_of_block_in_row;
    field_height = game_area_height / num_of_block_in_col;

    setScreen();

    restart_button.on("click", function () { init(); });
    ez_button.on("click", function () { act_difficulty = 1; init(); });
    medium_button.on("click", function () { act_difficulty = 2; init(); });
    hard_button.on("click", function () { act_difficulty = 3; init(); });

    appendScreen();
}

function difficultySwitch() {
    switch (DIFFICULTY) {
        case 1:
            num_of_block_in_row = 9;
            num_of_block_in_col = 9;
            chance_of_bomb = 10 / 81;
            break;
        case 2:
            num_of_block_in_row = 16;
            num_of_block_in_col = 16;
            chance_of_bomb = 40 / 256;
            break;
        default:
            num_of_block_in_row = 24;
            num_of_block_in_col = 24;
            chance_of_bomb = 99 / 576;
    }
}

function setScreen() {
    body.empty();
    body.addClass("body");

    background_music_div.addClass("background_music_div");

    menu_div.addClass("menu_div");

    button_container.addClass("buttons_div");
    button_container.append(ez_button);
    button_container.append(medium_button);
    button_container.append(hard_button);

    restart_div.addClass("buttons_div");
    restart_div.addClass("restart_div");
    flag_counter.addClass("info_box");

    restart_button.addClass("restart_button");
    $(restart_button).attr("src", happy_cat.attr("src"));

    sec_counter.addClass("info_box");

    restart_div.append(flag_counter);
    restart_div.append(restart_button);
    restart_div.append(sec_counter);

    gameArea = $('<div></div>');
    gameArea.addClass("gameArea");

    top_list_table.addClass("top_list_table");

    getTopList();
}

function appendScreen() {
    background_music_div.append(background_music);
    body.append(background_music_div);
    menu_div.append(button_container);
    menu_div.append(restart_div);
    body.append(menu_div);
    body.append(gameArea);
    body.append(top_list_table);

    $(menu_div).css({
        "width": game_area_width,
    });
    $(gameArea).css({
        "width": game_area_width,
        "height": game_area_height,
    });
    $(top_list_table).css({
        "width": game_area_width + 6,   // BORDER MIATT
    });

    drawFields();
    clearInterval(sec_interval);
}

function getTopList() {
    top_list = [];
    top_list_table.empty();
    for (let i = 0; i < localStorage.length; i++) {
        top_list[i] = [localStorage.key(i), parseInt(localStorage.getItem(localStorage.key(i)))];
    }
    top_list.sort(function (a, b) { return a[1] - b[1]; })
    top_list_table.append('<tr><td class="top_list_text" colspan="3">Top 5 lista:</td></tr>');
    top_list_table.append(  '<tr>' +
                                '<th class="table_column">Helyezés</th>' +
                                '<th class="table_column">Név</th>' +
                                '<th class="table_column">Idő</th>' +
                            '</tr>');
    for (let i = 0; i < top_list.length && i < 5; i++) {
        let row = $('<tr></tr>');
        let col1 = $('<td class="table_column"></td>');
        let col2 = $('<td class="table_column"></td>');
        let col3 = $('<td class="table_column"></td>');
        let text1 = i + 1 + ": ";
        let text2 = top_list[i][0];
        let text3 = top_list[i][1];
        col1.text(text1);
        col2.text(text2);
        col3.text(text3);
        row.append(col1);
        row.append(col2);
        row.append(col3);
        top_list_table.append(row);
    }
}

function drawFields() {
    for (let i = 0; i < num_of_block_in_col; i++) {
        for (let j = 0; j < num_of_block_in_row; j++) {
            let field = field_img.clone();
            let is_bomb = Math.random() <= chance_of_bomb;
            let top_of_field = i * field_width;
            let left_of_field = j * field_height;

            if (is_bomb) {
                fields_with_bombs.push({
                    top: top_of_field,
                    left: left_of_field
                });
                num_of_bombs++;
            }

            field.css({
                "width": field_width,
                "top": top_of_field,
                "left": left_of_field,
            });
            field.addClass("unrevealed");
            field.addClass("field");
            onClickField(field, is_bomb);
            gameArea.append(field);
        }
    }
    flag_counter.text(parseInt(num_of_bombs));
}

function countTime() {
    let secs = parseInt(sec_counter.text());
    sec_counter.text(secs + 1);
}

function onClickField(field, is_bomb) {
    field.mousedown(function(event) {
        if(event.which === 1) {
            leftClick(field, is_bomb);
            if (num_of_block_in_row * num_of_block_in_col - revealed_fields
                === num_of_bombs) {
                $.when(win()).then(function() {
                    updateTopList()
                    win_sound.play();
                });
            }
        }
        else if (event.which === 3) {
            rightClick(field);
        }
    });
}

function leftClick(field, is_bomb) {
    if (!is_started) {
        is_started = true;
        sec_interval = setInterval(countTime, 1000);
        if (is_bomb) {
            is_bomb = false;
            //console.log(fields_with_bombs);
            fields_with_bombs = fields_with_bombs.filter(function (value) {
                let bomb_top = parseInt(value.top);
                let bomb_left = parseInt(value.left);
                let field_top = parseInt(field.css("top"));
                let field_left = parseInt(field.css("left"));
                console.log(bomb_top + bomb_left + field_top + field_left);
                return bomb_top !== field_top || bomb_left !== field_left;
            });
            //console.log(fields_with_bombs);
            num_of_bombs--;
            flag_counter.text(parseInt(num_of_bombs));
        }
    }
    clickField(field, is_bomb);
}

function rightClick(field) {
    let clicked_field_img = $(field).attr("src");

    if (clicked_field_img === "mezo.jpg") {
        $(field).attr("src", flag.attr("src"));
        flag_counter.text(parseInt(flag_counter.text()) - 1);
    } else {
        $(field).attr("src", field_img.attr("src"));
        flag_counter.text(parseInt(flag_counter.text()) + 1);
    }
}

function clickField(field, is_bomb) {
    if (!is_bomb)
        return revealField(field);
    gameOver(field);
}

function revealField(field) {
    pop_sound.play();
    let field_left = parseInt($(field).css("left"));
    let field_top = parseInt($(field).css("top"));
    let bomb_num = 0;
    $(field).off();
    revealed_fields++;
    $(field).removeClass("unrevealed");

    for (let bomb of fields_with_bombs) {
        let abs_left = Math.abs(bomb.left - field_left);
        let abs_top = Math.abs(bomb.top - field_top);
        if (abs_left <= 50 && abs_top <= 50)
            bomb_num++;
    }

    switch (bomb_num) {
        case 1:
            $(field).attr('src', img1.attr("src"));
            break;
        case 2:
            $(field).attr('src', img2.attr("src"));
            break;
        case 3:
            $(field).attr('src', img3.attr("src"));
            break;
        case 4:
            $(field).attr('src', img4.attr("src"));
            break;
        case 5:
            $(field).attr('src', img5.attr("src"));
            break;
        case 6:
            $(field).attr('src', img6.attr("src"));
            break;
        case 7:
            $(field).attr('src', img7.attr("src"));
            break;
        case 8:
            $(field).attr('src', img8.attr("src"));
            break;
        default:
            $(field).attr('src', empty_field.attr("src"));
            $('.unrevealed').each(function () {
                if ($(this).hasClass("unrevealed")) {
                    let act_left = parseInt($(this).css("left"));
                    let act_top = parseInt($(this).css("top"));
                    let abs_left = Math.abs(act_left - field_left);
                    let abs_top = Math.abs(act_top - field_top);
                    if (abs_left <= 50 && abs_top <= 50) {
                        revealField($(this));
                    }
                }
            });
    }
}

function win() {
    let win_text = $('<h1>Gratula, nyertél! :)</h1>')
    win_text.addClass("win_text");
    $(restart_button).attr("src", cool_cat.attr("src"));
    finalSteps(win_text);
}

function gameOver(field) {
    lose_sound.play();
    let game_over_text = $('<h1>Vesztettél! :(</h1>')
    game_over_text.addClass("game_over_text");

    $(field).attr("src", bomb_pic.attr("src"));
    $(restart_button).attr("src", sad_cat.attr("src"));
    finalSteps(game_over_text);
}

function finalSteps(text) {
    $('.field').each(function () {
        $(this).off();
    });
    clearInterval(sec_interval);
    body.append(text);
}

function updateTopList() {
    let current_player = prompt("Gratula, nyertél! :)\nÍrd be a neved:");
    if (current_player !== null) {
        localStorage.setItem(current_player === "" ? "Ismeretlen"
            : current_player, sec_counter.text());
    }
    getTopList();
}