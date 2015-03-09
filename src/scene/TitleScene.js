/*
 *  TitleScene.js
 *  2014/06/19
 *  @auther minimo  
 *  This Program is MIT license.
 *
 */

tm.define("shotgun.TitleScene", {
    superClass: tm.app.Scene,

    //フォントパラメータ
    labelParam: {fontFamily:"Yasashisa", align: "center", baseline:"middle", outlineWidth:2, fontWeight:700 },
    scoreParam: {fontFamily:"Yasashisa", align: "left", baseline:"middle", outlineWidth:2 },

    bgColor: 'rgba(50, 150, 50, 1)',

    init: function() {
        this.superInit();
        this.background = "rgba(0, 0, 0, 0.0)";

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
/*
        var fillStyle = tm.graphics.LinearGradient(-SC_W*0.2, 0, SC_W*0.1, 64)
            .addColorStopList([
                { offset: 0.1, color: "hsla(130, 90%, 0%, 0.5)"},
                { offset: 0.5, color: "hsla(130, 90%, 0%, 0.9)"},
                { offset: 0.9, color: "hsla(140, 90%, 0%, 0.5)"},
            ]).toStyle();
*/
        var fillStyle = "Red";
        var outlineStyle = "White";
        var shadowColor = 'rgba(160, 160, 160, 1)';

        //ショットガンシルエット
        var sg = tm.display.Sprite("shotgun", 640, 250)
            .addChildTo(this.titleLayer)
            .setPosition(SC_W*0.5, SC_H*0.2);
        sg.scaleX = -1;
        sg.rotation = -10;

        //タイトルロゴ
        tm.display.Sprite("titlelogo", 600, 300)
            .addChildTo(this.titleLayer)
            .setPosition(SC_W*0.5, SC_H*0.2);

        var that = this;
        var width = SC_W, height = 100;
        var y = SC_H*0.4, space = 115;
        var param = {flat: appMain.buttonFlat, fontSize: 50};

        //プレイスタート
        this.start = shotgun.Button(width, height, "PLAY", param)
            .addChildTo(this.titleLayer)
            .setPosition(SC_W*0.5, y)
            .addEventListener("pushed", function() {
                that.buttonLock(true);

                that.start.tweener.clear().moveBy(0, SC_H, 500, "easeInQuint");
                that.tutorial.tweener.clear().moveBy(0, SC_H, 500, "easeInQuint");
                that.option.tweener.clear().moveBy(0, SC_H, 500, "easeInQuint");
                that.credit.tweener.clear().moveBy(0, SC_H, 500, "easeInQuint");
                that.ranking.tweener.clear().moveBy(0, SC_H, 500, "easeInQuint");

                that.normal.tweener.clear().wait(300).fadeIn(300).call(function(){that.normal.setLock(false);});
                that.hard.tweener.clear().wait(300).fadeIn(300).call(function(){that.hard.setLock(false);});
//                that.practice.tweener.clear().wait(300).fadeIn(300).call(function(){that.practice.setLock(false);});
                that.retJoker_label.tweener.clear().wait(300).fadeIn(300);
                that.retJoker.tweener.clear().wait(300).fadeIn(300).call(function(){that.retJoker.setLock(false);});
                that.ret.tweener.clear().wait(300).fadeIn(300).call(function(){that.ret.setLock(false);});
                that.retJoker.toggleON = appMain.returnJoker;
            });

        //チュートリアル
        y+=space;
        this.tutorial = shotgun.Button(width, height, "TUTORIAL", param)
            .addChildTo(this.titleLayer)
            .setPosition(SC_W*0.5, y)
            .addEventListener("pushed", function() {
                that.buttonLock(true);
                that.titleLayer.tweener.clear()
                    .moveBy(-SC_W, 0, 500, "easeOutQuint")
                    .call(function(){
                        appMain.pushScene(shotgun.TutorialScene());
                    })
                    .moveBy(SC_W, 0, 500, "easeOutQuint");
            });

        //RANKING
        y+=space;
        this.ranking = shotgun.Button(width, height, "RANKING", param)
            .addChildTo(this.titleLayer)
            .setPosition(SC_W*0.5, y)
            .addEventListener("pushed", function() {
                that.buttonLock(true);
                if (appMain.highScore[GAMEMODE_NORMAL]    != 0) submitScore(GAMEMODE_NORMAL, false, appMain.highScore[GAMEMODE_NORMAL]);
                if (appMain.highScore[GAMEMODE_NORMAL+10] != 0) submitScore(GAMEMODE_NORMAL, true , appMain.highScore[GAMEMODE_NORMAL+10]);
                if (appMain.highScore[GAMEMODE_HARD]      != 0) submitScore(GAMEMODE_HARD  , false, appMain.highScore[GAMEMODE_HARD]);
                if (appMain.highScore[GAMEMODE_HARD+10]   != 0) submitScore(GAMEMODE_HARD  , true , appMain.highScore[GAMEMODE_HARD+10]);
                showLeadersBoard();
                that.buttonLock(false);
            });

        //クレジット
        y+=space;
        this.credit = shotgun.Button(width, height, "CREDIT", param)
            .addChildTo(this.titleLayer)
            .setPosition(SC_W*0.5, y)
            .addEventListener("pushed", function() {
                that.buttonLock(true);
                that.mask.tweener.clear()
                    .fadeIn(200)
                    .call(function(){
                        appMain.pushScene(shotgun.CreditScene());
                    });
            });
        //設定
        y+=space;
        this.option = shotgun.Button(width, height, "OPTION", param)
            .addChildTo(this.titleLayer)
            .setPosition(SC_W*0.5, y)
            .addEventListener("pushed", function() {
                that.buttonLock(true);
                that.mask.tweener.clear()
                    .fadeIn(200)
                    .call(function(){
                        appMain.pushScene(shotgun.SettingScene());
                    });
            });

        //ノーマルモード
        this.normal = shotgun.Button(width, height, "NORMAL", param)
            .addChildTo(this.titleLayer)
            .setPosition(SC_W*0.5, SC_H*0.40)
            .setAlpha(0)
            .setLock(true)
            .addEventListener("pushed", function() {
                appMain.bonusLife = 0;
                that.mask.tweener.clear().fadeIn(200).call(function(){appMain.replaceScene(shotgun.MainScene(GAMEMODE_NORMAL));});
            });

        //ハードモード
        this.hard = shotgun.Button(width, height, "HARD", param)
            .addChildTo(this.titleLayer)
            .setPosition(SC_W*0.5, SC_H*0.50)
            .setAlpha(0)
            .setLock(true)
            .addEventListener("pushed", function() {
                appMain.bonusLife = 0;
                that.mask.tweener.clear().fadeIn(200).call(function(){appMain.replaceScene(shotgun.MainScene(GAMEMODE_HARD));});
            });

        //プラクティスモード
/*
        this.practice = shotgun.Button(width, height, "PRACTICE", param)
            .addChildTo(this.titleLayer)
            .setPosition(SC_W*0.5, SC_H*0.60)
            .setAlpha(0)
            .setLock(true)
            .addEventListener("pushed", function() {
                appMain.bonusLife = 0;
                that.mask.tweener.clear().fadeIn(200).call(function(){appMain.replaceScene(shotgun.MainScene(GAMEMODE_PRACTICE));});
            });
*/
        //ジョーカー戻り設定ボタン
        var that = this;
        this.retJoker_label = tm.display.OutlineLabel("RETURN JOKER", 40)
            .addChildTo(this)
            .setParam(this.labelParam)
            .setPosition(SC_W*0.5, SC_H*0.58)
            .setAlpha(0);
        this.retJoker = shotgun.ToggleButton(300, 80, "ON", "OFF", param)
            .addChildTo(this)
            .setPosition(SC_W*0.5, SC_H*0.65)
            .setAlpha(0)
            .setLock(true)
            .addEventListener("pushed", function() {
                appMain.returnJoker = that.retJoker.toggleON;
                appMain.saveConfig();
            });
        this.retJoker.toggleON = appMain.returnJoker;

        //戻る
        this.ret = shotgun.Button(width, height, "RETURN", param)
            .addChildTo(this.titleLayer)
            .setPosition(SC_W*0.5, SC_H*0.75)
            .setAlpha(0)
            .setLock(true)
            .addEventListener("pushed", function() {
                that.buttonLock(false);
                that.start.tweener.clear().moveBy(0, -SC_H, 500, "easeOutQuint");
                that.tutorial.tweener.clear().moveBy(0, -SC_H, 500, "easeOutQuint");
                that.option.tweener.clear().moveBy(0, -SC_H, 500, "easeOutQuint");
                that.credit.tweener.clear().moveBy(0, -SC_H, 500, "easeOutQuint");
                that.ranking.tweener.clear().moveBy(0, -SC_H, 500, "easeOutQuint");

                that.normal.tweener.clear().call(function(){that.normal.setLock(true);}).fadeOut(300);
                that.hard.tweener.clear().call(function(){that.hard.setLock(true);}).fadeOut(300);
//                that.practice.tweener.clear().call(function(){that.practice.setLock(true);}).fadeOut(300);
                that.retJoker_label.tweener.clear().fadeOut(300);
                that.retJoker.tweener.clear().call(function(){that.retJoker.setLock(true);}).fadeOut(300);
                that.ret.tweener.clear().call(function(){that.ret.setLock(true);}).fadeOut(300);
            });

        //バージョン表示
        tm.display.OutlineLabel("Version "+appMain.version, 30)
            .addChildTo(this.titleLayer)
            .setPosition(SC_W*0.5, SC_H*0.05)
            .setParam({fontFamily: "CasinoRegular", align: "center", baseline: "middle", outlineWidth: 3 });
    },

    buttonLock: function(b) {
        this.start.setLock(b);
        this.tutorial.setLock(b);
        this.option.setLock(b);
        this.credit.setLock(b);
        this.ranking.setLock(b);
    },

    addButton: function(page, finish) {
        var that = this;
        var width = 230, height = 60;

        //戻る
        shotgun.Button(width, height, "PREV")
            .addChildTo(this.titleLayer)
            .setPosition(SC_W*0.25+SC_W*page, SC_H*0.9)
            .addEventListener("pushed", function() {
                that.titleLayer.tweener.clear().moveBy(SC_W, 0, 500, "easeOutQuint");
            });

        if (!finish) {
            //次
            shotgun.Button(width, height, "NEXT")
                .addChildTo(this.titleLayer)
                .setPosition(SC_W*0.75+SC_W*page, SC_H*0.9)
                .addEventListener("pushed", function() {
                    that.titleLayer.tweener.clear().moveBy(-SC_W, 0, 500, "easeOutQuint");
                });
        } else {
            //終了
            shotgun.Button(width, height, "EXIT")
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
        if (appMain.firstGame) {
            appMain.pushScene(shotgun.SelectLanguageScene());
//            appMain.pushScene(shotgun.TutorialScene());
        }
        if (this.time % 7 == 0) {
            var c = tm.display.Sprite("card", CARD_W, CARD_H)
                .addChildTo(this.underLayer)
                .setPosition(rand(0, SC_W), -100-rand(0, 50))
                .setFrameIndex(rand(0, 54));
            var d = rand(0, 10);
            if (d == 3) c.setFrameIndex(52);
            if (d == 4) c.setFrameIndex(53);
            c.update = function() {
                this.rotation+=this.vr;
                this.y+=this.vy;
                if (this.y > SC_H*1.2) {this.remove();}
            }
            c.vr = rand(-5, 5) || 1;
            c.vy = rand(5, 15);
            c.setScale(rand(7, 10)/10);
        }

        //ハイスコアを自動登録
        if (this.time == 60) {
            if (appMain.highScore[GAMEMODE_NORMAL]    != 0) submitScore(GAMEMODE_NORMAL, false, appMain.highScore[GAMEMODE_NORMAL]);
            if (appMain.highScore[GAMEMODE_NORMAL+10] != 0) submitScore(GAMEMODE_NORMAL, true , appMain.highScore[GAMEMODE_NORMAL+10]);
            if (appMain.highScore[GAMEMODE_HARD]      != 0) submitScore(GAMEMODE_HARD  , false, appMain.highScore[GAMEMODE_HARD]);
            if (appMain.highScore[GAMEMODE_HARD+10]   != 0) submitScore(GAMEMODE_HARD  , true , appMain.highScore[GAMEMODE_HARD+10]);
        }

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
//        if (this.time > 30) appMain.replaceScene(shotgun.MainScene());
    },

});
