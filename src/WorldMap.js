/*
 *  WorldMap.js
 *  2015/03/10
 *  @auther minimo  
 *  This Program is MIT license.
 */
 
//マップ
tm.define("tactics.WorldMap", {
    superClass: "tm.display.CanvasElement",

    app: null,

    //Worldクラス
    world: null,

    //サイズ
    size: 100,

    //マウスオーバーフラグ
    mouseover: false,

    init: function(x, y, size, world) {
        this.superInit();
        this.app = app;
        this.blendMode = "lighter";
        this.x = x || 0;
        this.y = y || 0;
        this.size = size || 100;
        this.world = world || null;
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
        canvas.fillRect(0, 0, this.size, this.size);

        if (this.world) {
            //画面範囲の描画
            canvas.fillStyle = "rgba(100, 100, 100, 0.9)";
            var rateW = this.size/this.world.size/this.world.scaleX;      //全体マップと表示マップの比率
            var rateH = this.size/this.world.size/this.world.scaleY;

            var sx = -this.world.base.x*rateW;
            var sy = -this.world.base.y*rateH;
            var sw = SC_W*rateW;
            var sh = SC_H*rateH;
            canvas.fillRect(sx, sy, sw, sh);

            //惑星位置の描画
            for (var i = 0, len = this.world.planets.length; i < len; i++) {
                var p = this.world.planets[i];
                switch (p.alignment) {
                    case TYPE_NEUTRAL:
                        canvas.fillStyle = "white";
                        break;
                    case TYPE_PLAYER:
                        canvas.fillStyle = "aqua";
                        break;
                    case TYPE_ENEMY:
                        canvas.fillStyle = "red";
                        break;
                }
                var x = (p.x/this.world.size)*this.size;
                var y = (p.y/this.world.size)*this.size;
                canvas.fillCircle(x, y, 3*p.power);
            }
            //ユニット位置の描画
            for (var i = 0, len = this.world.units.length; i < len; i++) {
                var u = this.world.units[i];
                switch (u.alignment) {
                    case TYPE_PLAYER:
                        canvas.fillStyle = "aqua";
                        break;
                    case TYPE_ENEMY:
                        canvas.fillStyle = "red";
                        break;
                }
                var x = (u.x/this.world.size)*this.size;
                var y = (u.y/this.world.size)*this.size;
                canvas.fillRect(x-1, y-1, 2, 2);
            }
        }
    }
});
