/*
 *  PowerBalance.js
 *  2014/03/17
 *  @auther minimo  
 *  This Program is MIT license.
 */
 
//勢力天秤
tm.define("tactics.PowerBalance", {
    superClass: "tm.display.CanvasElement",

    app: null,

    //Worldクラス
    world: null,

    //幅
    width: 640,

    //マウスオーバーフラグ
    mouseover: false,

    init: function(world, width, height) {
        this.superInit();
        this.world = world || null;
        this.width = width || SC_W*0.9;
        this.height = height || 32;
        this.blendMode = "lighter";
    },

    update: function() {
    },

    draw: function(canvas) {
        if (!this.mouseover) {
            this.alpha+=0.1;
            if (this.alpha > 1.0)this.alpha = 1.0;
        } else {
            this.alpha-=0.1;
            if (this.alpha < 0.0)this.alpha = 0.0;
        }
        canvas.lineWidth = 16;
        canvas.globalCompositeOperation = "source-over";
        canvas.fillStyle = "rgba(64, 64, 64, 0.8)";
        canvas.fillRect(0, 0, this.width, this.height);

        //勢力図作成
        if (this.world) {
            //各陣営
            var pl = this.world.getPower(TYPE_PLAYER);
            var en = this.world.getPower(TYPE_ENEMY);
            var nt = this.world.getPower(TYPE_NEUTRAL);

            var playerFort  = pl.fort;
            var playerUnit  = pl.unit;
            var enemyFort   = en.fort;
            var enemyUnit   = en.unit;
            var neutralFort = nt.fort;

            //全体
            var all = playerFort+playerUnit+enemyFort+enemyUnit+neutralFort;

            //勢力比率
            var player = (playerFort+playerUnit)/all;
            var enemy = (enemyFort+enemyUnit)/all;
            var neutral = (neutralFort)/all;

            var bl = this.width-20;
            canvas.fillStyle = "rgba(0, 64, 255, 0.8)";
            canvas.fillRect(10, 3, bl*player, this.height-6);
            canvas.fillStyle = "rgba(180, 180, 180, 0.8)";
            canvas.fillRect(bl*player+10, 3, bl*neutral, this.height-6);
            canvas.fillStyle = "rgba(255, 64, 64, 0.8)";
            canvas.fillRect(bl*player+bl*neutral+10, 3, bl*enemy, this.height-6);
        }
    }
});
