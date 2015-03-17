/*
 *  MainScene.js
 *  2015/03/10
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

    //マップ情報
    world: null,

    //ラベル用パラメータ
    labelParam: {fontFamily: "Orbitron", align: "left", baseline: "middle",outlineWidth: 3, fontWeight:700},

    init: function() {
        this.superInit();
        this.background = "rgba(0, 0, 0, 0.0)";

        //バックグラウンド
        this.bg = tm.display.RectangleShape({width: SC_W, height: SC_H, fillStyle: appMain.bgColor, strokeStyle: appMain.bgColor})
            .addChildTo(this)
            .setPosition(SC_W*0.5, SC_H*0.5);

        //マルチタッチ初期化
        this.touches = tm.input.TouchesEx(this);

        //レイヤー準備
        this.lowerLayer = tm.app.Object2D().addChildTo(this);
        this.mainLayer = tm.app.Object2D().addChildTo(this);
        this.upperLayer = tm.app.Object2D().addChildTo(this);

        //マップ
        this.world = tactics.World()
            .addChildTo(this.mainLayer);

        //勢力天秤
        this.balance = tactics.PowerBalance(this.world)
            .addChildTo(this.mainLayer)
            .setPosition(SC_W*0.05, SC_H*0.9);

        this.test = tm.display.Label("x:0 y:0")
            .addChildTo(this)
            .setPosition(32, SC_H-60)
            .setParam({fontFamily:"Orbitron", align: "left", baseline:"middle", outlineWidth:2 });

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

    setupWorld: function() {
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

        //砦の判定
        var res = this.world.getFort(sx, sy);
        if (res && res.distance < 32) {
            res.fort.select = true;
            return;
        }

        var mp = this.world.screenToMap(sx, sy);
        var x = mp.x*64+(mp.y%2?32:0)+32;
        var y = mp.y*16;

        this.pointer = tm.display.Sprite("mapobject", 32, 32)
            .addChildTo(this.world.base)
            .setFrameIndex(4)
            .setScale(2, 2)
            .setPosition(x, y);
    },

    //タッチorクリック移動処理
    ontouchesmove: function(e) {
        if (this.touchID != e.ID) return;
        var sx = e.pointing.x;
        var sy = e.pointing.y;
        var moveX = Math.abs(sx - this.beforeX);
        var moveY = Math.abs(sx - this.beforeY);

        var mp = this.world.screenToMap(sx, sy);
        this.test.text = "x:"+mp.x+" y:"+mp.y;

        var mp = this.world.screenToMap(sx, sy);
        var x = mp.x*64+(mp.y%2?32:0)+32;
        var y = mp.y*16;
        if (this.pointer) {
            this.pointer.setPosition(x, y);
        } else {
        }

        this.clickTime++;
    },

    //タッチorクリック終了処理
    ontouchesend: function(e) {
        if (this.touchID != e.ID) return;
        this.touchID = -1;
        var sx = e.pointing.x;
        var sy = e.pointing.y;
        var moveX = Math.abs(sx - this.beforeX);
        var moveY = Math.abs(sx - this.beforeY);

        this.world.selectFortGroup(TYPE_PLAYER, false);
        this.world.selectFortGroup(TYPE_ENEMY, false);
        this.world.selectFortGroup(TYPE_NEUTRAL, false);
        if (this.pointer) {
            this.pointer.remove();
            this.pointer = null;
        }
    },
});

