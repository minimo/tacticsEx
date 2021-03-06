/*
 *  Unit.js
 *  2015/03/10
 *  @auther minimo  
 *  This Program is MIT license.
 */
 
//ユニット管理クラス
tm.define("tactics.Unit", {
    superClass: tm.app.Object2D,

    //ＩＤ
    ID: 0,

    //所属部隊ＩＤ
    groupID: 0,
    leader: false, //隊長フラグ

    //戦力
    HP: 0,

    //攻撃力
    power: 1,

    //属性（0:中立 1:プレイヤー 2:エネミー）
    alignment: 0,   //※仕様上中立は無い（予定）

    //目的地
    destination: null,

    //進行用パラメータ
    vx: 0,
    vy: 0,
    speed: 1,
    bx: 0,
    by: 0,
    battle: false, //戦闘中

    //所属ワールド
    world: null,

    //選択フラグ
    select: false,

    //有効フラグ
    active: true,

    //マウスオーバーフラグ
    mouseover: false,

    init: function(alignment, HP, power) {
        this.superInit();
        this.alignment = alignment || 0;
        this.HP = HP || 1;
        this.power = power || 1;

        var ss = null;
        switch(alignment) {
            case TYPE_NEUTRAL:
                ss = tactics.SpriteSheet.Normal;
                break;
            case TYPE_PLAYER:
                ss = tactics.SpriteSheet.Knight;
                break;
            case TYPE_ENEMY:
                ss = tactics.SpriteSheet.Monster;
                break;
        }
        var that = this;
        this.sprite = tm.display.AnimationSprite(ss)
            .addChildTo(this)
            .gotoAndPlay("walk_down");

        this.sprite.onanimationend = function() {
            if (this.currentAnimationName == "attack_down" ||
                this.currentAnimationName == "attack_up") {
                that.battle = false;
            }
        }
    
        this.time = 0;
    },

    update: function() {
        if (this.world.busy) return;

        if (this.battle) {
            if (this.sprite.currentAnimationName != "attack_down" &&
                this.sprite.currentAnimationName != "attack_up") {
                this.sprite.gotoAndPlay("attack_up");
            }
        } else {
            this.x += this.vx;
            this.y += this.vy;
        }

        if (this.active && this.HP < 1) {
            unit.dead();
        }

        if (this.vy < 0) {
            if (this.sprite.currentAnimationName != "walk_up") this.sprite.gotoAndPlay("walk_up");
            if (this.vx < 0) {
                this.scaleX = -1;
            } else {
                this.scaleX = 1;
            }
        } else {
            if (this.sprite.currentAnimationName != "walk_down") this.sprite.gotoAndPlay("walk_down");
            if (this.vx < 0) {
                this.scaleX = 1;
            } else {
                this.scaleX = -1;
            }
        }
        if (this.vx == 0 && this.vy == 0) {
            if (this.sprite.currentAnimationName != "walk_up") this.sprite.gotoAndPlay("stop_up");
            if (this.sprite.currentAnimationName != "walk_down") this.sprite.gotoAndPlay("stop_down");
        }

        this.bx = this.x;
        this.by = this.y;
        this.time++;
    },

    //目的地座標設定
    setDestination: function(dest) {
        this.destination = dest;
        var gx = this.x;
        var gy = this.y;
        var tx = dest.x;
        var ty = dest.y;
        var dis = Math.sqrt((tx-gx)*(tx-gx) + (ty-gy)*(ty-gy));
        if (dis == 0)return;
        this.vx = (tx-gx)/dis*this.speed;
        this.vy = (ty-gy)/dis*this.speed;
        return this;
    },

    //特定ワールド座標からの距離
    getDistance: function(x, y) {
        var dx = this.x-x;
        var dy = this.y-y;
        return Math.sqrt(dx*dx+dy*dy);
    },

    //被ダメージ処理    
    damage: function(pow) {
        this.HP -= pow;
        if (this.HP < 0)this.dead();
        return this;
    },

    //目標到着処理
    arrival: function() {
        this.active = false;
        return this;
    },

    //破壊処理
    dead: function() {
        this.active = false;
        tactics.MapEffect(tactics.SpriteSheet.Explode)
            .addChildTo(this.world)
            .setPosition(this.x, this.y)
            .gotoAndPlay("explode");
        tactics.MapEffect(tactics.SpriteSheet.Knight)
            .addChildTo(this.world)
            .setPosition(this.x, this.y)
            .gotoAndPlay("dead");
        return this;
    }
});
