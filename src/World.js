/*
 *  World.js
 *  2015/03/10
 *  @auther minimo  
 *  This Program is MIT license.
 *
 *  マップ管理とユニットの移動、戦闘その他を自動で処理
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

    //ディスプレイリスト
    dispList: null,

    //マップサイズ
    mapW: 17,
    mapH: 33,

    //最大砦数
    maxForts: 20,

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

    //派遣戦力レート(10 - 90)
    rate: 50,

    //自動生成用乱数発生器  
    mt: null,
    rand: function(min, max) { return this.mt.nextInt(min, max); },

    //処理中フラグ
    busy: false,

    //長押しフラグ
    longPress: false,

    init: function(scene, seed) {
        this.superInit();
        this.scene = scene;

        this.seed = seed || 0;

        this.forts = [];
        this.units = [];
/*
        this.base = tm.display.Sprite("mapbase").setOrigin(0, 0).setPosition(32, 16);
        this.superClass.prototype.addChild.call(this, this.base);
*/
        this.base = tm.display.CanvasElement().setOrigin(0, 0).setPosition(32, 16);
        this.superClass.prototype.addChild.call(this, this.base);
        this.setupMapBase();

        this.dispList = [];

        //表示レイヤー構築（数字が大きい程優先度が高い）
        this.layers = [];
        for (var i = 0; i < LAYER_SYSTEM+1; i++) {
            this.layers[i] = tm.app.Object2D().addChildTo(this.base);
        }

        //マップ構築
        this.buildMap();

        this.time = 0;
    },

    update: function() {
        if (this.busy) return;

        //表示順序ソート
        if (this.time > 10 && this.time%6 == 0) this.sortDisplayList();

        //ユニット到着判定
        for (var i = 0, len = this.units.length; i < len; i++) {
            var unit = this.units[i];
            if (unit.HP <= 0)continue;
            var fort = unit.destination;
            //到着判定
            var dis = distance(unit, fort);
            if (dis < 26) {
                fort.damage(unit.alignment, unit.HP);
                unit.HP = 0;
                unit.active = false;
                if (fort.alignment == unit.alignment) {
                    unit.arrival();
                } else {
                    unit.dead();
                }
            }
        }

        //死亡ユニット掃除
        var len = this.dispList.length;
        for (var i = 0; i < len; i++) {
            var unit = this.dispList[i];
            if (unit === undefined)continue;
            if (!(unit instanceof tactics.Unit)) continue;
            if (unit.HP < 1 || !unit.active) {
                unit.remove();
                this.dispList.splice(i, 1);
            }
        }

        this.time++;
    },

    //表示順序のソート
    sortDisplayList: function() {
        var len = this.dispList.length;
        var dl = [];
        for (var i = 0; i < len; i++) {
            this.dispList[i].remove();
            dl.push(this.dispList[i]);
        }
        dl.sort(function(a, b) {
            if (a.y < b.y) return -1;
            return 1;
        });
        this.dispList = [];
        for (var i = 0; i < len; i++) {
            dl[i].addChildTo(this);
        }
    },

    //マップの基部作成
    setupMapBase: function() {
        this.map = [];
        for(var y = 0; y < this.mapH; y++) {
            this.map[y] = [];
            for(var x = 0; x < this.mapW; x++) {
                var mx = x*64+(y%2?32:0);
                var my = y*16;
                if (y%2 == 1 && x == this.mapW-1) break;
                this.map[y][x] = tactics.MapChip()
                    .addChildTo(this.base)
                    .setPosition(mx+32, my+16);
            }
        }
    },

    //マップの自動生成
    buildMap: function(seed) {
        this.seed = seed || 0;
        this.mt = new MersenneTwister(this.seed);

        this.enterFort( 1,  2, TYPE_PLAYER, 100, 1, 1);
        this.enterFort(15, 30, TYPE_ENEMY , 100, 1, 1);
        for (var i = 0; i < 10; i++) {
            var x = this.rand(0, this.mapW-1);
            var y = this.rand(0, this.mapH-1);
            var hp = this.rand(70, 200)
            this.enterFort(x, y, TYPE_NEUTRAL, hp, 1, 0);
        }
    },

    //砦の追加
    enterFort: function(x, y, alignment, HP, power, type) {
        var mx = x*64+(y%2?32:0)+32;
        var my = y*16;
        var f = tactics.Fort(alignment, HP, power, type)
            .addChildTo(this)
            .setPosition(mx, my);
        f.mapX = x;
        f.mapY = y;

        //ＩＤ登録
        f.ID = this.fortID;
        this.fortID++;

        //管理用配列に入れる
        this.forts.push(f);
        return f;
    },

    //ユニット投入
    enterUnit: function(from, to, rate) {
        if (!(from instanceof tactics.Fort))return null;

        //砦戦力１０未満は派遣出来ない
        if (from.HP < 10) return null;
        rate = rate || 0.5;

        var hp = Math.floor(from.HP*rate);
        from.hp -= hp;
        var unit = tactics.Unit(from.alignment, hp, 1)
            .addChildTo(this)
            .setPosition(from.x-this.x, from.y-this.y)
            .setDestination(to);
        return unit;
    },

    //スクリーン座標からマップ座標へ変換
    screenToMap: function(x, y){
        //マップ座標のオフセットを反映
        x -= this.base.x;
        y -= this.base.y;

        //マップ座標へ仮変換
        var w = 64, h = 32;
        var mx = Math.floor(x/w);
        var my = Math.floor(y/h)*2;

        //象限の判定
        var qx = Math.floor(x-mx*w);
        var qy = Math.floor(y-my*h/2);

        //第一象限（右上）
        if (qx > 32 && qy < 16) {
            var x2 = qx-32, y2 = qy;
            if (x2/2 > y2) my--;
        } else
        //第二象限（左上）
        if (qx < 32 && qy < 16) {
            var x2 = qx, y2 = qy;
            if (16-x2/2 > y2) {mx--; my--;}
        } else
        //第三象限（左下）
        if (qx < 32 && qy > 16) {
            var x2 = qx, y2 = qy-16;
            if (x2/2 < y2) {mx--; my++;}
        } else
        //第四象限（右下）
        if (qx > 32 && qy > 16) {
            var x2 = qx-32, y2 = qy-16;
            if (16-x2/2 < y2) my++;
        }

        //範囲内にクリッピング
        mx = Math.clamp(mx, 0, this.mapW-1);
        my = Math.clamp(my, 0, this.mapH-1);

    	return {x: mx, y: my};
    },

    //指定スクリーン座標上のマップ表示物を取得
    getMapPoint: function(x, y) {
        //砦を選択しているか判定
        var res = this.getFort(px, py);
        if (res && res.distance < 32) return res.fort;

        //ユニットを選択しているか判定
        var res = this.getUnit(px, py);
        if (res && res.distance < 16) return res.unit;

        //マップ地点を取得
        var mp = this.screenToMap(px, py);
        var x = mp.x*64+(mp.y%2?32:0)+32;
        var y = mp.y*16;
        return {x:x, y:y, mapX:mp.x, mapY:mp.y};
    },

    //指定スクリーン座標から一番近い砦を取得
    getFort: function(x, y){
        if (this.forts.length == 0) return null;
        x = x-this.base.x;
        y = y-this.base.y;
        var bd = 99999999;
        var f = null;
        for (var i = 0; i < this.forts.length; i++) {
            var p = this.forts[i];
            var dx = p.x-x;
            var dy = p.y-y;
            var dis = dx*dx+dy*dy;
            if (dis < bd){
                f = p;
                bd = dis;
            }
        }
        return {fort: f, distance: Math.sqrt(bd)};
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

    //指定スクリーン座標から一番近い部隊を取得
    getUnit: function(x, y) {
        if (this.units.length == 0)return null;
        x = x-this.x;
        y = y-this.y;
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
    getPowerOfForts: function(alignment) {
        var val = 0;
        for (var i = 0, len = this.forts.length; i < len; i++) {
            var p = this.forts[i];
            if (p.alignment == alignment) val += p.HP;
        }
        return val;
    },

    //部隊戦力合計を算出
    getPowerOfUnits: function(alignment) {
        var val = 0;
        for (var i = 0, len = this.units.length; i < len; i++) {
            var p = this.units[i];
            if (p.alignment == alignment) val += p.HP;
        }
        return val;
    },

    //addChildオーバーライド
    addChild: function(child) {
        //エフェクトレイヤ
        if (child.isEffect) {
            if (!child.isLower) {
                this.layers[LAYER_EFFECT_UPPER].addChild(child);
                return this;
            } else {
                this.layers[LAYER_EFFECT_LOWER].addChild(child);
                return this;
            }
        }

        //フォアグラウンドレイヤ
        if (child.isForeground) {
            this.layers[LAYER_FOREGROUND].addChild(child);
            return this;
        }

        //システム表示レイヤ
        if (child.isSystem) {
            this.layers[LAYER_SYSTEM].addChild(child);
            return this;
        }

        //ユニットをオブジェクトレイヤへ
        if (child instanceof tactics.Unit) {
            child.world = this;
            this.layers[LAYER_OBJECT].addChild(child);
            this.units[this.units.length] = child;
            this.dispList.push(child);
            return this;
        }

        //砦はオブジェクトレイヤへ
        if (child instanceof tactics.Fort) {
            child.world = this;
            this.layers[LAYER_OBJECT].addChild(child);
            this.forts[this.forts.length] = child;
            this.dispList.push(child);
            return this;
        }

        //マップオブジェクト
        if (child instanceof tactics.MapObject) {
            child.world = this;
            this.layers[LAYER_OBJECT].addChild(child);
            this.dispList.push(child);
            return this;
        }

        //どれにも該当しない場合はバックグラウンドへ追加
        this.layers[LAYER_BACKGROUND].addChild(child);
        return this;
    },
});
