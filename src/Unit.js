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
            case 0:
                ss = tactics.SpriteSheet.Normal;
                break;
            case 1:
                ss = tactics.SpriteSheet.Knight;
                break;
            case 2:
                ss = tactics.SpriteSheet.Monster;
                break;
        }
        this.sprite = tm.display.AnimationSprite(tactics.SpriteSheet.Knight)
            .addChildTo(this)
            .gotoAndPlay("stop_down");
    
        this.time = 0;
    },

    update: function() {
        if (this.world.busy) return;
        this.bx = this.x;
        this.by = this.y;
        this.time++;
    },

    //目的地座標設定
    setDestination: function(dest, r, d) {
        this.destination = dest;
        r = r || rand(0, 359)*toRad;
        d = d * 0.7 || rand(0, 32);
        var tx = Math.sin(r)*d*dest.power;
        var ty = Math.cos(r)*d*dest.power;

        var gx = this.x;
        var gy = this.y;
        var tx = dest.x+tx;
        var ty = dest.y+ty;
        var dis = Math.sqrt((tx-gx)*(tx-gx) + (ty-gy)*(ty-gy));
        if (dis == 0)return;
        this.vx = (tx-gx)/dis*this.speed;
        this.vy = (ty-gy)/dis*this.speed;
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
    },

    //目標到着処理
    arrival: function() {
        this.active = false;
    },

    //破壊処理
    dead: function() {
        this.active = false;
    }
});

