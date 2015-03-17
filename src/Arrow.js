/*
 *  Arrow.js
 *  2015/03/17
 *  @auther minimo  
 *  This Program is MIT license.
 */
 
//選択矢印
tm.define("tatics.Arrow", {
    superClass: tm.display.Sprite,

    //始点と終点
    from: null,
    to: null,

    //アクティブフラグ
    active: true,
    
    //フォアグラウンドレイヤフラグ
    isForeground: true,

    init: function(from, to, width) {
        width = width || 8;
        this.superInit("arrow", 160, width);
        this.setPosition(from.x, from.y);

        this.originX = 0;
        this.originY = 0.5;
        this.from = from;
        this.to = to;
        this.alpha = 0.0;
    },

    update: function() {
        //始点または終点が非アクティブな場合は非表示
        if (this.from instanceof tactics.Unit) {
            if (!this.from.active) {
                this.visible = false;
                return;
            }
        }
        if (this.to instanceof tactics.Unit) {
            if (!this.to.active) {
                this.visible = false;
                return;
            }
        }
        
        //終点がNULLの場合非表示
        if (!this.to) {
            this.visible = false;
            return;
        }

        //始点と終点が同じ場合には非表示
        if (this.from === this.to) {
            this.visible = false;
        } else {
            this.visible = true;
        }

        //中心点からの直線を計算
        var fx = this.from.x, fy = this.from.y;
        var tx = this.to.x, ty = this.to.y;
        var dx = tx-fx, dy = ty-fy;

        //始点が砦の場合円周上にする
        if (this.from instanceof tactics.Fort) {
            var len = 16/Math.sqrt(dx*dx+dy*dy);
            fx = fx*(1-len)+tx*len;
            fy = fy*(1-len)+ty*len;
            dx = tx-fx, dy = ty-fy;

            //始点が敵砦の場合非表示にする
            if (this.from.alignment != TYPE_PLAYER) {
                this.visible = false;
                return;
            }
        }

        //終点が砦の場合円周上にする
        if (this.to instanceof tactics.Fort) {
            var len = 16/Math.sqrt(dx*dx+dy*dy);
            tx = fx*len+tx*(1-len);
            ty = fy*len+ty*(1-len);
            dx = tx-fx, dy = ty-fy;
        }

        //再計算
        this.x = fx;
        this.y = fy;
        this.rotation = Math.atan2(dy, dx)*toDeg;   //二点間の角度
        this.scaleX = Math.sqrt(dx*dx+dy*dy)/160;

        if (this.active) {
            this.alpha += 0.05;
            if (this.alpha > 0.7)this.alpha = 0.7;
        } else {
            this.alpha -= 0.05;
            if (this.alpha < 0.0)this.remove();
        }
    },
    
    getLength: function() {
        return distance(this.from, this.to);
    },
});
