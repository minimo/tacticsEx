/*
 *  MainScene.js
 *  2014/06/19
 *  @auther minimo  
 *  This Program is MIT license.
 *
 */

tm.define("tactics.MainScene", {
    superClass: tm.app.Scene,

    //マルチタッチ補助クラス
    touches: null,
    touchID: -1,

    //タッチ情報
    startX: 0,
    startY: 0,
    touchTime: 0,
    moveX: 0,
    moveY: 0,
    beforeX: 0,
    beforeY: 0,

    //経過時間
    time: 1,

    //遷移情報
    exitGame: false,

    //ラベル用パラメータ
    labelParamBasic: {fontFamily: "Yasashisa", align: "left", baseline: "middle",outlineWidth: 3, fontWeight:700},
    labelParamBasicCenter: {fontFamily: "Yasashisa'", align: "center", baseline: "middle",outlineWidth: 3, fontWeight:700},
    labelParamPoker: {fontFamily: "CasinoRegular",align: "center", baseline: "middle", outlineWidth: 3},
    labelParamHand:  {fontFamily: "CasinoRegular",align: "left", baseline: "middle", outlineWidth: 3},
    labelParamBefore:{fontFamily: "Yasashisa",align: "left", baseline: "top", outlineWidth: 3, fontWeight:700},
    labelParamModeName: {fontFamily: "Yasashisa", align: "right", baseline: "middle",outlineWidth: 3, fontWeight:700},

    init: function(mode) {
        this.superInit();
        this.background = "rgba(0, 0, 0, 0.0)";

        //ゲームモード
        if (mode === undefined) mode = GAMEMODE_NORMAL;
        this.mode = mode;

        //ボーナス貰ってるか判定
        if (appMain.bonusLife != 0) this.bonus = true;

        //ハードモードはライフ無し
        if (this.mode == GAMEMODE_HARD) {
            this.life = 0;
            this.level = 2.5;
            this.levelReset = 1;
            this.absTime = ~~(30*60*3.5);
        }

        //バックグラウンド
        this.bg = tm.display.RectangleShape({width: SC_W, height: SC_H, fillStyle: appMain.bgColor, strokeStyle: appMain.bgColor})
            .addChildTo(this)
            .setPosition(SC_W*0.5, SC_H*0.5)

        //マルチタッチ初期化
        this.touches = tm.input.TouchesEx(this);

        //レイヤー準備
        this.lowerLayer = tm.app.Object2D().addChildTo(this);
        this.mainLayer = tm.app.Object2D().addChildTo(this);
        this.upperLayer = tm.app.Object2D().addChildTo(this);

        //目隠し
        this.mask = tm.display.RectangleShape({width: SC_W, height: SC_H, fillStyle: "rgba(0, 0, 0, 1.0)", strokeStyle: "rgba(0, 0, 0, 1.0)"})
            .addChildTo(this)
            .setPosition(SC_W*0.5, SC_H*0.5);
        this.mask.tweener.clear().fadeOut(200);
    },
    
    update: function() {
        //スクリーンショット保存
        var kb = appMain.keyboard;
        if (kb.getKeyDown("s")) appMain.canvas.saveAsImage();

        this.time++;
    },

    //タッチorクリック開始処理
    ontouchesstart: function(e) {
        if (this.touchID > 0)return;
        this.touchID = e.ID;

        var sx = this.startX = e.pointing.x;
        var sy = this.startY = e.pointing.y;
        this.moveX = 0;
        this.moveY = 0;

        this.beforeX = sx;
        this.beforeY = sy;
        this.touchTime = 0;
    },

    //タッチorクリック移動処理
    ontouchesmove: function(e) {
        if (this.touchID != e.ID) return;

        var sx = e.pointing.x;
        var sy = e.pointing.y;
        var moveX = Math.abs(sx - this.beforeX);
        var moveY = Math.abs(sx - this.beforeY);

        if (!this.shuffled) {
            if (moveX > 200) {
                this.deck.shuffle();
                this.shuffled = true;
            }
        }

        if (this.time % 10 == 0) {
            this.beforeX = sx;
            this.beforeY = sy;
        }
    },

    //タッチorクリック終了処理
    ontouchesend: function(e) {
        if (this.touchID != e.ID) return;
        this.touchID = -1;

        var sx = e.pointing.x;
        var sy = e.pointing.y;

        if (this.pick && !this.shuffled && !this.deck.busy && !this.gameend) {
            var c = this.deck.pick(sx, sy);
            if (c) this.deck.addHand(c);
        }
        this.shuffled = false;
    },
});

