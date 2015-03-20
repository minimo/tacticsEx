/*
 *  Fort.js
 *  2015/03/10
 *  @auther minimo  
 *  This Program is MIT license.
 */

//砦管理クラス
tm.define("tactics.Fort", {
    superClass: tm.display.Sprite,

    ID: 0,

    //0: 中立
    //1: プレイヤー
    //2: エネミー
    type: 0,

    //生産力(0.5-2.0)
    power: 1,

    //戦力
    HP: 0,

    //戦力上昇フレーム間隔
    intervalHP: 15,

    //属性（0:中立 1:プレイヤー 2:エネミー）
    alignment: 0,

    //選択中フラグ
    select: false,
    active: true,

    //経過フレーム数
    time: 0,

    //所属ワールド
    world: null,

    //マップ上座標
    mapX: 0,
    mapY: 0,

    labelParam: {fontFamily:"Orbitron",align:"center", baseline:"middle", fontSize:10, outlineWidth:1},

    init: function(alignment, HP, power, type) {
        this.superInit("mapobject", 32, 32);
        this.setFrameIndex(5);
        this.setScale(MAPCHIP_SCALE);

        this.alignment = alignment || 0;
        this.HP = HP || 100;
        this.power = power || 1;
        this.type = type || 0;

        if (type == 1) this.setFrameIndex(6);

        var that = this;
        //選択カーソル
        this.cursor = tm.display.CircleShape({
            width: 64,
            height: 64,
            fillStyle: "rgba(0,0,0,0)",
            lineWidth: 5.0,
        }).addChildTo(this);
        this.cursor.blendMode = "source-over";
        this.cursor.alpha = 0;
        this.cursor.setScale(0);
        this.cursor.beforeSelect = false;
        this.cursor.update = function() {
            if (that.select) {
                this.rotation+=2;
                this.alpha+=0.15;
                if (this.alpha > 1.0)this.alpha = 1.0;
            } else {
                this.alpha-=0.15;
                if (this.alpha < 0.0)this.alpha = 0.0;
            }
            if (this.beforeSelect != that.select) {
                if (that.select) {
                    this.tweener.clear().to({scaleX:1, scaleY:1}, 200, "easeOutSine");
                } else {
                    this.tweener.clear().to({scaleX:0, scaleY:0}, 200, "easeOutSine");
                }
            }
            this.beforeSelect = that.select;
        };
        this.changeCursorColor(alignment);

        //HP表示
        this.label = tm.display.OutlineLabel("", 20)
            .addChildTo(this)
            .setParam(this.labelParam)
            .setPosition(0, -8);
        this.label.update = function() {
            this.text = "" + ~~that.HP;
            switch (that.alignment) {
                case TYPE_NEUTRAL:
                    this.fillStyle = "rgba(255, 255, 255, 1.0)";
                    break;
                case TYPE_PLAYER:
                    this.fillStyle = "rgba(0, 64, 255, 1.0)";
                    break;
                case TYPE_ENEMY:
                    this.fillStyle = "rgba(255, 64, 64, 1.0)";
                    break;
            }
        };
    },

    update: function() {
        if (this.world.busy) return;
        if (this.alignment != TYPE_NEUTRAL) {
            var rev = 1;
            if (this.alpha == TYPE_ENEMY) {
                rev = this.world.handicap;
            }
            if (this.time % this.intervalHP == 0){
                this.HP += this.power * rev * 0.5;
            }
        }
        this.time++;
    },

    //攻撃を受ける
    damage: function(alignment, power) {
        if (this.alignment == alignment) {
            this.HP += power;
        } else {
            this.HP -= power;
            if (this.HP < 0) {
                this.HP *= -1;
                this.alignment = alignment;
                this.changeCursorColor(alignment);
            }
        }
    },

    //特定ワールド座標からの距離
    distance: function(x, y) {
        var dx = this.x-x;
        var dy = this.y-y;
        return Math.sqrt(dx*dx+dy*dy);
    },

    //選択カーソル色変更
    changeCursorColor: function(alignment) {
        if (alignment == TYPE_PLAYER) {
            this.cursor.strokeStyle = tm.graphics.LinearGradient(0,0,0,64).addColorStopList([
                { offset:0.0, color:"rgba(0,0,255,0.0)" },
                { offset:0.2, color:"rgba(0,0,255,0.8)" },
                { offset:0.5, color:"rgba(0,0,255,1.0)" },
                { offset:0.8, color:"rgba(0,0,255,0.8)" },
                { offset:1.0, color:"rgba(0,0,255,0.0)" },
            ]).toStyle();
        } else if (alignment == TYPE_NEUTRAL) {
            this.cursor.strokeStyle = tm.graphics.LinearGradient(0,0,0,64).addColorStopList([
                { offset:0.0, color:"rgba(0,255,0,0.0)" },
                { offset:0.2, color:"rgba(0,255,0,0.8)" },
                { offset:0.5, color:"rgba(0,255,0,1.0)" },
                { offset:0.8, color:"rgba(0,255,0,0.8)" },
                { offset:1.0, color:"rgba(0,255,0,0.0)" },
            ]).toStyle();
        } else if (alignment == TYPE_ENEMY) {
            this.cursor.strokeStyle = tm.graphics.LinearGradient(0,0,0,64).addColorStopList([
                { offset:0.0, color:"rgba(255,0,0,0.0)" },
                { offset:0.2, color:"rgba(255,0,0,0.8)" },
                { offset:0.5, color:"rgba(255,0,0,1.0)" },
                { offset:0.8, color:"rgba(255,0,0,0.8)" },
                { offset:1.0, color:"rgba(255,0,0,0.0)" },
           ]).toStyle();
        }
    },
});
