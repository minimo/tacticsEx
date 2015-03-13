/*
 *  World.js
 *  2015/03/10
 *  @auther minimo  
 *  This Program is MIT license.
 *
 *  配置した砦やユニットの移動、戦闘その他を自動で処理
 *  操作はMainSceneから行う
 *
 */

//マップ管理クラス
tm.define("tactics.World", {
    superClass: tm.app.Object2D,

    //親シーン
    scene: null,

    //マップ番号
    number: 0,

    //ベースレイヤー
    base: null,

    //スプライトレイヤー
    layers: null,

    //最大惑星数
    maxPlanets: 20,

    //砦リスト
    forts: null,

    //ユニットリスト
    units: null,

    //砦ＩＤ連番
    fortID: 0,

    //ユニットＩＤ連番
    unitID: 0,
    unitGroupID: 0,

    //ハンディキャップ（相手の戦力増加比率係数）
    handicap: 1.0,

    //艦隊派遣時戦力レート(10 - 90)
    rate: 50,

    init: function(scene) {
        this.superInit();
        this.scene = scene;
        this.forts = [];
        this.units = [];

        this.base = tm.app.Object2D().setOrigin(0, 0);
        this.superClass.prototype.addChild.call(this, this.base);

        //表示レイヤー構築（数字が大きい程優先度が高い）
        this.layers = [];
        for (var i = 0; i < LAYER_SYSTEM+1; i++) {
            this.layers[i] = tm.app.Object2D().addChildTo(this.base);
        }
    },

    update: function() {
    },
    
    //砦の追加
    enterFrot: function(x, y, alignment, HP, power, type) {
    },

    //艦隊投入
    enterUnit: function(from, to, rate) {
    },

    //指定座標から一番近い惑星を取得
    getFort: function(x, y){
        var bd = 99999999;
        var pl = null;
        for (var i = 0; i < this.forts.length; i++) {
            var p = this.forts[i];
            var dx = p.x-x;
            var dy = p.y-y;
            var dis = dx*dx+dy*dy;
            if (dis < bd){
                pl = p;
                bd = dis;
            }
        }
        return {fort: pl, distance: Math.sqrt(bd)};
    },

    //特定陣営の砦を配列で取得
    getFortGroup: function(alignment) {
        var forts = [];
        for (var i = 0; i < this.forts.length; i++) {
            if (this.forts[i].alignment == alignment) forts.push(this.forts[i]);
        }
        return forts.length == 0? null : forts;
    },

    //特定陣営の惑星を選択／非選択にする
    selectFortGroup: function(alignment, select) {
        for (var i = 0; i < this.forts.length; i++) {
            if (this.forts[i].alignment == alignment) this.forts[i].select = select;
        }
    },

    //指定座標から一番近い部隊を取得
    getUnit: function(x, y) {
        if (this.units.length == 0)return null;
        var bd = 99999999;
        var unit = null;
        for (var i = 0; i < this.units.length; i++) {
            var u = this.units[i];
            var dx = u.x-x;
            var dy = u.y-y;
            var dis = dx*dx+dy*dy;
            if (dis < bd){
                unit = u;
                bd = dis;
            }
        }
        return {unit: unit, distance: Math.sqrt(bd)};
    },

    //特定のグループＩＤのユニットを配列で取得
    getUnitGroup: function(groupID) {
        var units = [];
        for (var i = 0; i < this.units.length; i++) {
            if (this.units[i].groupID == groupID) units.push(this.units[i]);
        }
        return units.length == 0? null : units;
    },

    //特定のユニットグループを選択／非選択にする
    selectUnitGroup: function(groupID, select) {
        for (var i = 0, len = this.units.length; i < len; i++) {
            var u = this.units[i];
            if (u.groupID == groupID)u.select = select;
        }
    },

    //特定のユニットグループの目標を変更する
    setDestinationUnitGroup: function(groupID, destination) {
        for (var i = 0, len = this.units.length; i < len; i++) {
            var u = this.units[i];
            if (u.groupID == groupID)u.setDestination(destination);
        }
    },
    
    //惑星戦力合計を算出
    getPowerOfPlanet: function(alignment) {
        var val = 0;
        for (var i = 0, len = this.forts.length; i < len; i++) {
            var p = this.forts[i];
            if (p.alignment == alignment) val += p.HP;
        }
        return val;
    },

    //部隊戦力合計を算出
    getPowerOfUnit: function(alignment) {
        var val = 0;
        for (var i = 0, len = this.units.length; i < len; i++) {
            var p = this.units[i];
            if (p.alignment == alignment) val += p.HP;
        }
        return val;
    },

    //addChildオーバーライド
    addChild: function(child) {
        //ユニットレイヤ
        if (child instanceof tactics.Unit) {
            child.world = this;
            this.layers[LAYER_UNIT].addChild(child);
            this.units[this.units.length] = child;
            return;
        }

        //マップレイヤ
        if (child instanceof tactics.Planet) {
            child.world = this;
            this.layers[LAYER_PLANET].addChild(child);
            this.forts[this.forts.length] = child;
            return;
        }

        //エフェクトレイヤ
        if (child.isEffect) {
            if (!child.isLower) {
                this.layers[LAYER_EFFECT_UPPER].addChild(child);
                return;
            } else {
                this.layers[LAYER_EFFECT_LOWER].addChild(child);
                return;
            }
        }

        //フォアグラウンドレイヤ
        if (child.isForeground) {
            this.layers[LAYER_FOREGROUND].addChild(child);
            return;
        }

        //システム表示レイヤ
        if (child.isSystem) {
            this.layers[LAYER_SYSTEM].addChild(child);
            return;
        }

        //どれにも該当しない場合はバックグラウンドへ追加
        this.layers[LAYER_BACKGROUND].addChild(child);
//        this.superClass.prototype.addChild.apply(this, arguments);
    },
});
