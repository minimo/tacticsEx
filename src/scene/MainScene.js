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

    //コントロール中フラグ
    control: CTRL_NOTHING,

    //経過時間
    time: 1,

    //遷移情報
    exitGame: false,

    //マップ情報
    world: null,

    //選択矢印
    arrow: null,

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
            if (res.fort.alignment == TYPE_PLAYER) {
                this.control = CTRL_FORT;
                this.arrow = tactics.Arrow(res.fort).addChildTo(this.world);
            }
            return;
        }

        var mp = this.world.screenToMap(sx, sy);
        var x = mp.x*64+(mp.y%2?32:0)+32;
        var y = mp.y*16;

        this.pointer = tm.display.Sprite("mapobject", 32, 32)
            .addChildTo(this.world.base)
            .setFrameIndex(4)
            .setScale(MAPCHIP_SCALE)
            .setPosition(x, y)
            .setAlpha(0.5);
    },

    //タッチorクリック移動処理
    ontouchesmove: function(e) {
        if (this.touchID != e.ID) return;
        var sx = e.pointing.x;
        var sy = e.pointing.y;
        var moveX = Math.abs(sx - this.beforeX);
        var moveY = Math.abs(sx - this.beforeY);

        var mp = this.world.screenToMap(sx, sy);
        var x = mp.x*64+(mp.y%2?32:0)+32;
        var y = mp.y*16;

        if (this.pointer) {
            this.pointer.setPosition(x, y);
        } else {
            this.pointer = tm.display.Sprite("mapobject", 32, 32)
                .addChildTo(this.world.base)
                .setFrameIndex(4)
                .setScale(MAPCHIP_SCALE)
                .setPosition(x, y)
                .setAlpha(0.5);
        }
        if (this.arrow) {
            if (this.arrow.to instanceof tactics.Fort) {
            } else {
                this.arrow.to = {x:sx-32, y:sy-16, active:true};
            }
        }

        //砦をタッチ
        if (this.control == CTRL_FORT) {
            var res = this.world.getFort(sx, sy);
            if (res && res.fort != this.arrow.from) {
                if (res.distance < 32) {
                    if (this.arrow.to instanceof tactics.Fort && this.arrow.to != res.fort) {
                        this.arrow.to.select = false;
                    }
                    this.arrow.to = res.fort;
                    res.fort.select = true;
                    this.pointer.remove();
                    this.pointer = null;
                } else {
                    if (this.arrow.to instanceof tactics.Fort) {
                        var f = this.arrow.to;
                        f.select = false;
                        this.arrow.to = {x:sx-32, y:sy-16, active:true};
                    }
                }
            }
        }

        //デバッグ用
        this.test.text = "x:"+mp.x+" y:"+mp.y;

        this.touchTime++;
    },

    //タッチorクリック終了処理
    ontouchesend: function(e) {
        if (this.touchID != e.ID) return;
        this.touchID = -1;
        var sx = e.pointing.x;
        var sy = e.pointing.y;
        var moveX = Math.abs(sx - this.beforeX);
        var moveY = Math.abs(sx - this.beforeY);

        //砦操作
        if (this.control == CTRL_FORT && this.arrow) {
            var from = this.arrow.from;
            var to = this.arrow.to;
            //行き先が砦かユニットの場合は兵隊派遣
            if (to instanceof tactics.Fort || to instanceof tactics.Unit) {
                this.world.enterUnit(from, to);
            }
        }
        this.world.selectFortGroup(TYPE_PLAYER, false);
        this.world.selectFortGroup(TYPE_ENEMY, false);
        this.world.selectFortGroup(TYPE_NEUTRAL, false);
        if (this.pointer) {
            this.pointer.remove();
            this.pointer = null;
        }
        if (this.arrow) {
            this.arrow.remove();
            this.arrow = null;
        }

        this.control = CTRL_NOTHING;
    },
});

