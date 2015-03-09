/*
 *  touches.js
 *  2014/03/19
 *  @auther minimo  
 *  This Program is MIT license.
 *
 */

//マルチタッチ補助クラス
tm.define("tm.input.TouchesEx", {
    //タッチID
    touchID: 0,

    //タッチ中ポイントリスト
    touchList: null,

    //強制シングル化フラグ
    single: false,

    //親シーン
    scene: null,

    init: function(scene) {
        this.scene = scene;
        this.touchList = [];

        //シーンに対してイベントリスナを登録
        var self = this;
        scene.addEventListener("touchstart", function(e) {
            if (!self.single) {
                self.touchList.push({ id: self.touchID, pointing: e.pointing, time:0 });
                e.ID = self.touchID;
                this.ontouchesstart(e);
                self.touchID++;
            } else {
                self.touchList[0] = { id: 0, pointing: e.pointing, time:0 };
                e.ID = 0;
                this.ontouchesstart(e);
            }
        });

        scene.addEventListener("touchmove", function(e) {
            if (!self.single) {
                var min = 99999999;
                var target = 9999;
                for (var i = 0, len = self.touchList.length; i < len; i++) {
                    var x = e.pointing.x - self.touchList[i].pointing.x;
                    var y = e.pointing.y - self.touchList[i].pointing.y;
                    var dis = (x*x+y*y);
                    if (dis < min) {
                        target = i;
                        min = dis;
                    }
                }
                self.touchList[target].pointing = e.pointing;

                e.ID = self.touchList[target].id;
                this.ontouchesmove(e);
            } else {
                self.touchList[0] = {id:0, pointing: e.pointing};
                e.ID = 0;
                this.ontouchesmove(e);
            }
        });
        scene.addEventListener("touchend",function(e) {
            if (!self.single) {
                var min = 99999999;
                var target = 9999;
                for (var i = 0, len = self.touchList.length; i < len; i++) {
                    var x = e.pointing.x - self.touchList[i].pointing.x;
                    var y = e.pointing.y - self.touchList[i].pointing.y;
                    var dis = (x*x+y*y);
                    if (dis < min) {
                        target = i;
                        min = dis;
                    }
                }
                self.touchList[target].pointing = e.pointing;
 
                e.ID = self.touchList[target].id;
                this.ontouchesend(e);
                self.touchList.splice(target, 1);
                if (self.touchList.length == 0)self.touchID = 0;
            } else {
                e.ID = 0;
                this.ontouchesend(e);
                self.touchList = [];
            }
        });
    },

    //タッチ数の取得
    numTouches: function() {
        return this.touchList.length;
    },

    //強制リセット
    reset: function() {
        this.touchID = 0;
        this.touchList = [];
    },
});

