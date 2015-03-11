/*
 *  World.js
 *  2014/03/10
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

    //マップサイズ
    sizeW: 10,
    sizeH: 8,

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

        this.base = tm.app.Object2D();
        this.base.originX = 0;
        this.base.originY = 0;
        this.superClass.prototype.addChild.call(this, this.base);

        //表示レイヤー構築（数字が大きい程優先度が高い）
        this.layers = [];
        for (var i = 0; i < LAYER_SYSTEM+1; i++) {
            this.layers[i] = tm.app.Object2D().addChildTo(this.base);
        }
    },

    update: function() {
        //ユニット到着判定
        for (var i = 0, len = this.units.length; i < len; i++) {
            var unit = this.units[i];
            if (unit.HP <= 0)continue;
            var planet = unit.destination;
            //到着判定
            var dis = distance(unit, planet);
            if (dis < 26*planet.power) {
                planet.damage(unit.alignment, unit.HP);
                unit.HP = 0;
                unit.active = false;
                if (planet.alignment == unit.alignment) {
                    unit.arrival();
                } else {
                    unit.destroy();
                }
            }
        }

        //惑星対ユニット攻撃判定
        for (var i = 0, len = this.forts.length; i < len; i++) {
            var planet = this.forts[i];
            for (var j = 0, len2 = this.units.length; j < len2; j++) {
                var unit = this.units[j];
                if (!unit.active)continue;
                if (unit.alignment == planet.alignment)continue;
                var dis = distance(unit, planet);
                if (dis < 70*planet.power) {
                    var dice = rand(0,100);
                    if (dice > 98 || unit.destination == planet && dice > 95) {
                        if (rand(0,100) > 40) {
                            this.enterLaser(planet, unit);
                        } else {
                            this.enterBeam(planet, unit, rand(10,30), rand(3,15));
                        }
                        if (rand(0,100) > 90) {
                            this.enterExplode(unit);
                            unit.damage(1);
                        }
                    }
                }
            }
        }

        //ユニット対ユニットor惑星
        len = this.units.length;
        for (var i = 0; i < len; i++) {
            var unit1 = this.units[i];
            if (unit1.HP <= 0)continue;
            //対ユニット戦闘
            if (rand(0,100) > 95) {
                for (var j = 0; j < len; j++) {
                    var unit2 = this.units[j];
                    if (unit1.alignment == unit2.alignment) continue;

                    var dis = distanceSq(unit1, unit2);
                    if (dis > 3600) continue;

                    if (rand(0,100) < 70)continue;
                    if (unit2.HP <= 0)continue;
                    this.enterLaser(unit1, unit2);
                    if (rand(0,100) > 90) {
                        this.enterExplode(unit2);
                        unit2.damage(1);
                    }
                }
            }
            //対惑星戦闘
            var planet = unit1.destination;
            if (unit1.alignment != planet.alignment) {
                var dis = distance(unit1, planet);
                if (dis < 60 * planet.power &&  rand(0,100) > 95) {
                    if (rand(0,100) > 40) {
                        this.enterLaser(unit1, planet);
                    } else {
                        this.enterBeam(unit1, planet, rand(10,30), rand(3,15));
                    }
                    if (rand(0, 100) > 98) {
                        planet.damage(unit1.alignment, 1);
                    }
                }
            }
        }

        //破壊ユニット掃除
        for (var i = 0; i < len; i++) {
            var unit = this.units[i];
            if (unit === undefined)continue;
            if (unit.HP <= 0 || !unit.active) {
                unit.remove();
                this.units.splice(i, 1);
            }
        }
    },
    
    //マップの構築
    build: function(seed) {
        //マップ構築は専用の乱数体系を使用
        seed = seed || rand(0,65536);
        var rn = new MersenneTwister(seed);
        this.number = seed;

        //バックグラウンドの追加
        var bg = tm.display.Sprite("bg1",3848, 1280).addChildTo(this);
//        var bg = tm.display.Sprite("bg2",2408, 1884).addChildTo(this);
        bg.x = -rn.nextInt(0, 2568);
        bg.y = 0;
        bg.originX = bg.originY = 0;

        //プレイヤー主星
        this.enterPlanet(96, 96, TYPE_PLAYER, 100, 1.5, PLANET_EARTH);

        //エネミー主星
        this.enterPlanet(this.size-96, this.size-96, TYPE_ENEMY, 100, 1.5, PLANET_MARS);

        //中立惑星配置
        for (var i = 0; i < this.maxPlanets; i++) {
            var x = rn.nextInt(96, this.size-96);
            var y = rn.nextInt(96, this.size-96);
            var ok = true;
            //一定距離内に配置済み惑星が無いか確認
            for (var j = 0; j < this.forts.length; j++) {
                var p = this.forts[j];
                var dx = p.x-x, dy = p.y-y;
                var dis = dx*dx+dy*dy;
                if (dis < 17424){ok = false;break;} //132*132
            }
            if (!ok) {i--;continue;}

            var power = rn.nextInt(80, 200)/100;
            var HP = ~~(rn.nextInt(30, 50)*power);
            var type = solarSystem[rn.nextInt(0, 9)];
            this.enterPlanet(x, y, TYPE_NEUTRAL, HP, power, type);
        }
    },

    //チュートリアル用マップの構築
    buildTutorial: function(phase, width, height) {
    },

    //惑星の追加
    enterPlanet: function(x, y, alignment, HP, power, type) {
        alignment = alignment || TYPE_NEUTRAL;
        power = power || rand(60, 200)/100;
        HP = HP || ~~(rand(30, 70)*power);
        type = type || rand(0, 5);

        var p = tactics.Planet(x, y, alignment, HP, power, type).addChildTo(this);
        p.ID = this.planetID;
        this.planetID++;
    },

    //艦隊投入
    enterUnit: function(from, to, rate) {
        rate = rate/100 || this.rate/100;
        if (rate > 0.9)rate = 0.9;

        if (from.HP < 10)return null;
        var HP = from.HP * rate;
        from.HP -= HP;
        if (from.HP < 0)from.HP = 1;
        var num = ~~(HP/10)+1;
        var unitHP = 10;
        if (num > 20) {
            unitHP = 20;
            num = ~~(num/2)+1;
        }
        for (var i = 0; i < num; i++) {
            var r = rand(0, 360)*toRad;
            var d = rand(0, 32);
            var x = from.x + Math.sin(r)*d*from.power;
            var y = from.y + Math.cos(r)*d*from.power;
            var unit = tactics.Unit(x, y, from.alignment, unitHP).addChildTo(this);
            unit.setDestination(to, r, d);
            unit.ID = this.unitID;
            this.unitID++;
            unit.groupID = this.unitGroupID;
        }
        this.unitGroupID++;
    },

    //レーザーエフェクト投入
    enterLaser: function(from, to, scale) {
        scale = scale || 1.0;
        var fx = from.x, fy = from.y
        var tx = to.x, ty = to.y;
        if (from instanceof tactics.Planet) {
            var r = rand(0, 359)*toRad;
            var l = rand(0, 40*from.power);
            fx += Math.sin(r)*l;
            fy += Math.cos(r)*l;
        }
        if (to instanceof tactics.Planet) {
            var r = rand(0, 359)*toRad;
            var l = rand(0, 40*from.power);
            tx += Math.sin(r)*l;
            ty += Math.cos(r)*l;
        }
        var laserType;
        switch (from.alignment) {
            case TYPE_PLAYER:
                laserType = "laser_b";
                break;
            case TYPE_ENEMY:
                laserType = "laser_r";
                break;
            case TYPE_NEUTRAL:
                laserType = "laser_h";
                break;
        }
        var laser = tm.display.Sprite(laserType, 50, 640);
        laser.setPosition(fx, fy);
        laser.originX = 0.5;
        laser.originY = 1.0;
        laser.from = {x: fx, y: fy};
        laser.to = {x: tx, y: ty};
        laser.isEffect = true;
        laser.scaleX = 0.1*scale;
        laser.setFrameIndex(0, 50, 640);
        laser.update = function() {
            //中心点からの直線を計算
            var fx = this.from.x, fy = this.from.y;
            var tx = this.to.x, ty = this.to.y;
            var dx = tx-fx, dy = ty-fy;
            this.rotation = Math.atan2(dy, dx)*toDeg+90;   //二点間の角度
            this.scaleY = Math.sqrt(dx*dx+dy*dy)/640;
            this.alpha -= 0.1*SPD;
            if (this.alpha < 0.0)this.remove();
        }
        laser.addChildTo(this);
    },

    //ビームエフェクト投入
    enterBeam: function(from, to, length, speed) {
        length = length || 10;
        speed = speed || 5;
        speed *= SPD;

        var fx = from.x, fy = from.y
        var tx = to.x, ty = to.y;
        if (from instanceof tactics.Planet) {
            fx += rand(0, 64*from.power)-32*from.power;
            fy += rand(0, 64*from.power)-32*from.power;
        }
        if (to instanceof tactics.Planet) {
            tx += rand(0, 64*to.power)-32*to.power;
            ty += rand(0, 64*to.power)-32*to.power;
        }
        var beamType;
        switch (from.alignment) {
            case TYPE_PLAYER:
                beamType = "laser_b";
                break;
            case TYPE_ENEMY:
                beamType = "laser_r";
                break;
            case TYPE_NEUTRAL:
                beamType = "laser_h";
                break;
        }
        var beam = tm.display.Sprite(beamType, 50, 640);
        beam.setPosition(fx, fy);
        beam.originX = 0.5;
        beam.originY = 1.0;
        beam.from = {x: fx, y: fy};
        beam.to = {x: tx, y: ty};
        beam.isEffect = true;
        beam.scaleX = 0.1;
        beam.scaleY = 1/640*length;
        beam.setFrameIndex(0, 50, 640);
        var dis = Math.sqrt((tx-fx)*(tx-fx) + (ty-fy)*(ty-fy));
        beam.vx = (tx-fx)/dis*speed;
        beam.vy = (ty-fy)/dis*speed;
        beam.limit = ~~(dis/speed);
        beam.time = 0;
        var dx = tx-fx, dy = ty-fy;
        beam.rotation = Math.atan2(dy, dx)*toDeg+90;   //二点間の角度
        var that = this;
        beam.update = function() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.time > this.limit) {
                if (rand(0,100) > 80) that.enterExplode({x: this.x, y: this.y}, 0.5);
                this.remove();
            }
            this.time++;
        }
        beam.addChildTo(this);
    },

    //爆発エフェクト投入
    enterExplode: function(target, scale) {
        scale = scale || 1.0;
        var exp = tm.display.Sprite("explode", 64, 64);
        exp.setPosition(target.x, target.y);
        exp.setScale(scale);
        exp.isEffect = true;
        exp.setFrameIndex(0, 64, 64);
        exp.frame = 1;
        exp.age = 1;
        exp.rotation = rand(0, 360);
        exp.update = function() {
            if (this.age % ~~(3/SPD) == 0) {
                this.setFrameIndex(this.frame, 64, 64);
                this.frame++;
                if (this.frame > 18)this.remove();
            }
            this.age++;
        }
        exp.addChildTo(this);
    },

    //指定座標から一番近い惑星を取得
    getPlanet: function(x, y){
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
        return {planet: pl, distance: Math.sqrt(bd)};
    },

    //特定陣営の惑星を配列で取得
    getPlanetGroup: function(alignment) {
        var forts = [];
        for (var i = 0; i < this.forts.length; i++) {
            if (this.forts[i].alignment == alignment) forts.push(this.forts[i]);
        }
        return forts.length == 0? null : forts;
    },

    //特定陣営の惑星を選択／非選択にする
    selectPlanetGroup: function(alignment, select) {
        for (var i = 0; i < this.forts.length; i++) {
            if (this.forts[i].alignment == alignment) this.forts[i].select = select;
        }
    },

    //指定座標から一番近い艦隊を取得
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

    //艦隊戦力合計を算出
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
