/*
 *  TitleScene.js
 *  2014/06/19
 *  @auther minimo  
 *  This Program is MIT license.
 *
 */

tm.define("tactics.TitleScene", {
    superClass: tm.app.Scene,

    //フォントパラメータ
    labelParam: {fontFamily:"Orbitron", align: "center", baseline:"middle", outlineWidth:2, fontWeight:700 },
    scoreParam: {fontFamily:"Orbitron", align: "left", baseline:"middle", outlineWidth:2 },

    bgColor: 'rgba(0, 0, 0, 1)',

    init: function() {
        this.superInit();

        //バックグラウンド
        this.bg = tm.display.RectangleShape({width: SC_W, height: SC_H, fillStyle: appMain.bgColor, strokeStyle: appMain.bgColor})
            .addChildTo(this)
            .setPosition(SC_W*0.5, SC_H*0.5)

        //タイトルとチュートリアルを分けてレイヤーを作成
        this.titleLayer = tm.app.Object2D().addChildTo(this);
        this.underLayer = tm.app.Object2D().addChildTo(this.titleLayer);
        this.tutorialLayer = tm.app.Object2D().addChildTo(this);

        //チュートリアル側バックグラウンド
        this.bg2 = tm.display.RectangleShape({width: SC_W, height: SC_H, fillStyle: appMain.bgColor, strokeStyle: appMain.bgColor})
            .addChildTo(this.titleLayer)
            .setPosition(SC_W*1.5, SC_H*0.5)

        //各画面セットアップ
        this.setupTitle();

        //目隠し
        this.mask = tm.display.RectangleShape({width: SC_W, height: SC_H, fillStyle: "rgba(0, 0, 0, 1.0)", strokeStyle: "rgba(0, 0, 0, 1.0)"})
            .addChildTo(this)
            .setPosition(SC_W*0.5, SC_H*0.5);
        this.mask.tweener.clear().fadeOut(300);
        
        this.time = 0;

        if (!appMain.firstGame) appMain.playBGM("titleBGM");
    },

    onresume: function() {
        this.buttonLock(false);
        this.mask.tweener.clear().fadeOut(200);
    },

    setupTitle: function() {
        var fillStyle = "Red";
        var outlineStyle = "White";
        var shadowColor = 'rgba(160, 160, 160, 1)';

        //タイトルロゴ
        this.logo = tm.display.OutlineLabel("TACTICS 8x8", 80)
            .addChildTo(this)
            .setParam(this.labelParam)
            .setPosition(SC_W*0.5, SC_H*0.2);

        var that = this;
        var width = SC_W*0.4, height = 100;
        var y = SC_H*0.4, space = 115;
        var param = {flat: appMain.buttonFlat, fontSize: 50};

        //プレイスタート
        this.start = tactics.Button(width, height, "PLAY", param)
            .addChildTo(this.titleLayer)
            .setPosition(SC_W*0.5, y)
            .addEventListener("pushed", function() {
                that.buttonLock(true);
                that.mask.tweener.clear()
                    .fadeIn(200)
                    .call(function(){
                        appMain.pushScene(tactics.MainScene());
                    });
            });

        //クレジット
        y+=space;
        this.credit = tactics.Button(width, height, "CREDIT", param)
            .addChildTo(this.titleLayer)
            .setPosition(SC_W*0.5, y)
            .addEventListener("pushed", function() {
                that.buttonLock(true);
                that.mask.tweener.clear()
                    .fadeIn(200)
                    .call(function(){
                        appMain.pushScene(tactics.CreditScene());
                    });
            });
        //設定
        y+=space;
        this.option = tactics.Button(width, height, "OPTION", param)
            .addChildTo(this.titleLayer)
            .setPosition(SC_W*0.5, y)
            .addEventListener("pushed", function() {
                that.buttonLock(true);
                that.mask.tweener.clear()
                    .fadeIn(200)
                    .call(function(){
                        appMain.pushScene(tactics.SettingScene());
                    });
            });


        //バージョン表示
        tm.display.OutlineLabel("Version "+appMain.version, 30)
            .addChildTo(this.titleLayer)
            .setPosition(SC_W*0.5, SC_H*0.05)
            .setParam({fontFamily: "CasinoRegular", align: "center", baseline: "middle", outlineWidth: 3 });
    },

    buttonLock: function(b) {
        this.start.setLock(b);
        this.option.setLock(b);
        this.credit.setLock(b);
    },

    addButton: function(page, finish) {
        var that = this;
        var width = 230, height = 60;

        //戻る
        tactics.Button(width, height, "PREV")
            .addChildTo(this.titleLayer)
            .setPosition(SC_W*0.25+SC_W*page, SC_H*0.9)
            .addEventListener("pushed", function() {
                that.titleLayer.tweener.clear().moveBy(SC_W, 0, 500, "easeOutQuint");
            });

        if (!finish) {
            //次
            tactics.Button(width, height, "NEXT")
                .addChildTo(this.titleLayer)
                .setPosition(SC_W*0.75+SC_W*page, SC_H*0.9)
                .addEventListener("pushed", function() {
                    that.titleLayer.tweener.clear().moveBy(-SC_W, 0, 500, "easeOutQuint");
                });
        } else {
            //終了
            tactics.Button(width, height, "EXIT")
                .addChildTo(this.titleLayer)
                .setPosition(SC_W*0.75+SC_W*page, SC_H*0.9)
                .addEventListener("pushed", function() {
                    that.titleLayer.tweener.clear().moveBy(SC_W*page, 0, 500, "easeOutQuint");
                });
        }
    },

    setupScoreList: function() {
        var page = 3;
        var that = this;
        var width = 230, height = 60;

        tm.display.OutlineLabel("得点表", 40)
            .addChildTo(this.titleLayer)
            .setPosition(SC_W*0.5+SC_W*page, SC_H*0.1)
            .setParam(this.labelParam);

        for (var i = 0; i < 10; i++) {
            tm.display.OutlineLabel($trans(appMain.handList[i+2].name)+" : "+appMain.handList[i+2].point+"pts", 40)
                .addChildTo(this.titleLayer)
                .setPosition(SC_W*0.1+SC_W*page, SC_H*0.17+(i*70))
                .setParam(this.scoreParam);
        }

        this.addButton(page, true);
    },

    update: function() {
        //スクリーンショット保存
        var kb = appMain.keyboard;
        if (kb.getKeyDown("s")) appMain.canvas.saveAsImage();

        this.time++;
    },

    //タッチorクリック開始処理
    ontouchstart: function(e) {
    },

    //タッチorクリック移動処理
    ontouchmove: function(e) {
    },

    //タッチorクリック終了処理
    ontouchend: function(e) {
        tm.sound.WebAudio.unlock();
//        if (this.time > 30) appMain.replaceScene(tactics.MainScene());
    },

});
