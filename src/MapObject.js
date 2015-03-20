/*
 *  MapObject.js
 *  2015/03/10
 *  @auther minimo  
 *  This Program is MIT license.
 */

//マップオブジェクト
tm.define("tactics.MapObject", {
    superClass: "tm.display.Sprite",

    //所属ワールド
    world: null,

    init: function() {
        this.superInit("mapobject", 32, 32);
        this.setFrameIndex(0);
        this.setScale(MAPCHIP_SCALE);
    },
});

//マップチップ
tm.define("tactics.MapChip", {
    superClass: "tm.display.Sprite",

    init: function() {
        this.superInit("mapchip", 32, 16);
        this.setFrameIndex(0);
        this.setScale(MAPCHIP_SCALE);
    },
});

//マップ上エフェクト
tm.define("tactics.MapEffect", {
    superClass: "tm.display.AnimationSprite",

    delOK: false,
    isObject: true,

    init: function(ss) {
        this.superInit(ss);
    },
    onanimationend: function() {
        this.delOK = true;
    }
});

