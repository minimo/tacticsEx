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

    //各陣営勢力
    pl: 0,
    en: 0,
    nr: 0,

    init: function(world, width, height) {
        this.superInit();
        this.world = world || null;
        this.width = width || SC_W*0.9;
        this.height = height || 32;
        this.blendMode = "lighter";

        this.pl = this.world.getPower(TYPE_PLAYER);
        this.en = this.world.getPower(TYPE_ENEMY);
        this.nt = this.world.getPower(TYPE_NEUTRAL);
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

            if (this.pl < pl) this.pl++
            if (this.pl > pl) this.pl--
            if (this.en < en) this.en++
            if (this.en > en) this.en--
            if (this.nt < nt) this.nt++
            if (this.nt > nt) this.nt--

            //全体
            var all = this.pl+this.en+this.nt;

            //勢力比率
            var player  = this.pl/all;
            var enemy   = this.en/all;
            var neutral = this.nt/all;

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
