/*
 *  WorldMap.js
 *  2015/03/10
 *  @auther minimo  
 *  This Program is MIT license.
 */

//マップチップ
tm.define("tactics.MapChip", {
    superClass: "tm.display.Sprite",

    init: function() {
        this.superInit("mapchip", 32, 16);
        this.setFrameTrimming(16, 16);
        this.setFrameIndex(0);
        this.setScale(2);
    },
});

//マップ
tm.define("tactics.WorldMap", {
    superClass: "tm.display.CanvasElement",

    //Worldクラス
    world: null,

    //マップ上
    mapW: 17,
    mapH: 33,
    map: [],

    init: function(world) {
        this.superInit();
        this.blendMode = "lighter";
        this.world = world || null;

//        this.setupBaseMap();

        this.base = tm.display.Sprite("mapbase")
            .addChildTo(this)
            .setOrigin(0, 0)
            .setPosition(0,0);
    },

    update: function() {
    },

    //マップの基部作成
    setupBaseMap: function() {
        for(var y = 0; y < this.mapH; y++) {
            this.map[y] = [];
            for(var x = 0; x < this.mapW; x++) {
                var mx = x*64+(y%2?32:0);
                var my = y*16;
                if (y%2 == 1 && x == this.mapW-1) break;
                this.map[y][x] = tactics.MapChip()
                    .addChildTo(this)
                    .setPosition(mx+32, my+16);
            }
        }
    },

    //スクリーン座標からマップ座標へ変換
    screenToMap: function(x, y) {
        x -= this.x;
        y -= this.y;

        var w = 64, h = 32;
        var mx = Math.floor(x/w);
        var my = Math.floor(y/h)*2;

        //象限の判定
        var qx = Math.floor(x-mx*w);
        var qy = Math.floor(y-my*h/2);

        //第一象限（右上）
        if (qx > 32 && qy < 16) {
            var x2 = qx-32;
            var y2 = qy;
            if (x2/2 > y2) my--;
        } else
        //第二象限（左上）
        if (qx < 32 && qy < 16) {
            var x2 = qx;
            var y2 = qy;
            if (16-x2/2 > y2) {
                mx--;
                my--;
            }
        } else
        //第三象限（左下）
        if (qx < 32 && qy > 16) {
            var x2 = qx;
            var y2 = qy-16;
            if (x2/2 < y2) {
                mx--;
                my++;
            }
        } else
        //第四象限（右下）
        if (qx > 32 && qy > 16) {
            var x2 = qx-32;
            var y2 = qy-16;
            if (16-x2/2 < y2) my++;
        }

    	return {x: mx, y: my};
    },
});
