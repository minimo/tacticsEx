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

        var w = 32, h = 16;
        var qx = Math.floor(x/w/2);
        var qy = Math.floor(y/h/2);

        var mx = Math.floor((x/w/2)+(y/h/2));
     	var my = Math.floor((x/w/2)-(y/h/2));

     	return {x: qx, y: qy};
    },
});
