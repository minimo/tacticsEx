/*
 *  PauseScene.js
 *  2015/03/10
 *  @auther minimo  
 *  This Program is MIT license.
 *
 */

tm.define("tactics.PauseScene", {
    superClass: tm.app.Scene,

    dialog: null,

    //ラベル用フォントパラメータ
    headerParam: {fontFamily:"CasinoRegular", align: "center", baseline:"middle", outlineWidth:2 },
    labelParam: {fontFamily:"Yasashisa", align: "center", baseline:"middle", outlineWidth:2 },
    scoreParam: {fontFamily:"Yasashisa", align: "left", baseline:"middle", outlineWidth:2 },

    init: function(parentScene) {
        this.superInit();
        this.background = "rgba(0, 0, 0, 0.0)";

        //ダイアログ
        this.dialog = tactics.ConfirmDialog("EXIT GAME?", ["YES", "NO"]);

        //バックグラウンド
        this.bg = tm.display.RectangleShape({width: SC_W, height: SC_H, fillStyle: appMain.bgColor, strokeStyle: appMain.bgColor})
            .addChildTo(this)
            .setPosition(SC_W*0.5, SC_H*0.5);

        var lb = tm.display.OutlineLabel("PAUSE", 60)
            .addChildTo(this)
            .setParam(this.headerParam)
            .setPosition(SC_W*0.5, SC_H*0.1);

        var that = this;
        var width = SC_W, height = 100;
        var param = {fillStyle:'rgba(0,80,0,1)', lineWidth:4};

        //戻るボタン
        tactics.Button(width, height, "RESUME", {flat: appMain.buttonFlat})
            .addChildTo(this)
            .setPosition(SC_W*0.5, SC_H*0.76)
            .addEventListener("pushed", function() {
                appMain.popScene();
            });

        //終了ボタン
        tactics.Button(width, height, "RETURN TO TITLE", {flat: appMain.buttonFlat})
            .addChildTo(this)
            .setPosition(SC_W*0.5, SC_H*0.85)
            .addEventListener("pushed", function() {
                appMain.pushScene(that.dialog);
            });

        this.time = 0;
    },

    update: function() {
        this.time++;
    },

    onresume: function() {
        if (this.dialog.answer == true) {
            appMain.replaceScene(tactics.TitleScene());
        }
    },

    //タッチorクリック開始処理
    ontouchstart: function(e) {
    },

    //タッチorクリック移動処理1
    ontouchmove: function(e) {
    },

    //タッチorクリック終了処理
    ontouchend: function(e) {
    },
});

tm.define("tactics.ConfirmDialog", {
    superClass: tm.app.Scene,

    answer: null,

    //ラベル用フォントパラメータ
    labelParam: {fontFamily:"Orbitron", align: "center", baseline:"middle", outlineWidth:4 },

    init: function(caption, button, fontSize) {
        this.superInit();
        
        button = button || ["OK", "CANCEL"];
        fontSize = fontSize || 50;

        //バックグラウンド
        tm.display.RoundRectangleShape({width: SC_W-20, height: SC_H*0.3, fillStyle: appMain.bgColor, lineWidth: 4})
            .addChildTo(this)
            .setPosition(SC_W*0.5, SC_H*0.5);

        var that = this;
        var width = SC_W-28, height = 90;
        var param = {fillStyle:'rgba(0,80,0,1)', lineWidth:4};

        //キャプション
        var lb = tm.display.OutlineLabel(caption, fontSize).addChildTo(this);
        lb.setParam(this.labelParam);
        lb.setPosition(SC_W*0.5, SC_H*0.42);

        //ＹＥＳ
        tactics.Button(width, height, button[0], {flat: appMain.buttonFlat})
            .addChildTo(this)
            .setPosition(SC_W*0.5, SC_H*0.5)
            .addEventListener("pushed", function() {
                that.answer = true;
                appMain.popScene();
            });

        //ＮＯ
        tactics.Button(width, height, button[1], {flat: appMain.buttonFlat})
            .addChildTo(this)
            .setPosition(SC_W*0.5, SC_H*0.58)
            .addEventListener("pushed", function() {
                that.answer = false;
                appMain.popScene();
            });
    },
});

var DEFALT_ALERTPARAM = {
    height: SC_H*0.35,
    text1: "text",
    text2: null,
    text3: null,
    fontSize: 32,
    button: "OK",
}

tm.define("tactics.AlertDialog", {
    superClass: tm.app.Scene,

    //ラベル用フォントパラメータ
    labelParam: {fontFamily:"Yasashisa", align: "center", baseline:"middle", outlineWidth:2 },

    init: function(param) {
        this.superInit();
        param = {}.$extend(DEFALT_ALERTPARAM, param);

        //バックグラウンド
        tm.display.RoundRectangleShape({width: SC_W-20, height: param.height, fillStyle: appMain.bgColor, lineWidth: 4})
            .addChildTo(this)
            .setPosition(SC_W*0.5, SC_H*0.5);

        var that = this;
        var width = SC_W-28, height = 90;

        //キャプション
        var pos = SC_H*0.47;
        if (param.text2) pos -= SC_H*0.05;
        if (param.text3) pos -= SC_H*0.05;

        var lb = tm.display.OutlineLabel(param.text1, param.fontSize).addChildTo(this);
        lb.setParam(this.labelParam);
        lb.setPosition(SC_W*0.5, pos);

        if (param.text2) {
            pos += SC_H*0.05;
            var lb = tm.display.OutlineLabel(param.text2, param.fontSize).addChildTo(this);
            lb.setParam(this.labelParam);
            lb.setPosition(SC_W*0.5, pos);
        }
        if (param.text3) {
            pos += SC_H*0.05;
            var lb = tm.display.OutlineLabel(param.text3, param.fontSize).addChildTo(this);
            lb.setParam(this.labelParam);
            lb.setPosition(SC_W*0.5, pos);
        }

        //ボタン
        tactics.Button(width, height, param.button, {flat: appMain.buttonFlat})
            .addChildTo(this)
            .setPosition(SC_W*0.5, SC_H*0.55)
            .addEventListener("pushed", function() {
                that.answer = false;
                appMain.popScene();
            });
    },
});
