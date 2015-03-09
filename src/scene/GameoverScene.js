/*
 *  GameoverScene.js
 *  2014/06/23
 *  @auther minimo  
 *  This Program is MIT license.
 *
 */

tm.define("shotgun.GameoverScene", {
    superClass: tm.app.Scene,

    parentScene: null,
    mode: 0,
    bonus: false,
    dispExtend: false,

    //ラベル用フォントパラメータ
    headerParam: {fontFamily:"CasinoRegular", align: "center", baseline:"middle", outlineWidth:2 },
    labelParam: {fontFamily:"Yasashisa", align: "center", baseline:"middle", outlineWidth:2 },
    scoreParam: {fontFamily:"Yasashisa", align: "left", baseline:"middle", outlineWidth:2 },
    extendParam: {fontFamily:"Yasashisa", align: "center", baseline:"middle", outlineWidth:2, fillStyle: "red" },

    init: function(parentScene) {
        this.superInit();
        this.background = "rgba(0, 0, 0, 0.0)";

        this.parentScene = parentScene;
        this.mode = parentScene.mode;
        this.bonus = parentScene.bonus;

        //スコア情報取得
        var m = appMain.returnJoker? this.mode+10: this.mode;
        var lastScore = appMain.lastScore[m];
        var highScore = appMain.highScore[m];
        var newRecord = parentScene.newRecord;

        //バックグラウンド
        this.bg = tm.display.RectangleShape({width: SC_W, height: SC_H, fillStyle: appMain.bgColor, strokeStyle: appMain.bgColor})
            .addChildTo(this)
            .setPosition(SC_W*0.5, SC_H*0.5);

        var that = this;
        var width = SC_W, height = 90;

        //メインとリザルトを分けてレイヤーを作成
        this.mainLayer = tm.app.Object2D().addChildTo(this);
        this.resultLayer = tm.app.Object2D().addChildTo(this);

        this.top = tm.display.OutlineLabel("RESULT", 60)
            .addChildTo(this)
            .setParam(this.headerParam)
            .setPosition(SC_W*0.5, SC_H*0.05);

        //スコア表示
        this.score = tm.display.OutlineLabel("SCORE "+lastScore, 50)
            .addChildTo(this)
            .setParam(this.labelParam)
            .setPosition(SC_W*0.5, SC_H*0.12);

        this.score = tm.display.OutlineLabel("YOUR BEST SCORE IS "+highScore, 35)
            .addChildTo(this)
            .setParam(this.labelParam)
            .setPosition(SC_W*0.5, SC_H*0.17);
        if (newRecord) {
            var nr = tm.display.OutlineLabel("NewRecord!!", 20)
                .addChildTo(this)
                .setParam(this.labelParam)
                .setFillStyle("Red")
                .setFillStyleOutline("rgb(255,200,200)")
                .setPosition(SC_W*0.82, SC_H*0.20);
        }

        //GameCenterへスコア登録
        submitScore(this.mode, appMain.returnJoker, lastScore);

        //役一覧
        for (var i = 0; i < 12; i++) {
            var handName = $trans(appMain.handList[i].name);
            tm.display.OutlineLabel(handName+":"+this.parentScene.handCount[appMain.handList[i].point], 35)
                .addChildTo(this.resultLayer)
                .setParam(this.scoreParam)
                .setPosition(SC_W*0.2, SC_H*0.22+(i*42));
        }

        //ボタン用パラメータ
        var param = {flat: appMain.buttonFlat, fontSize:50};

        //全画面広告ボタン
        this.Ad = shotgun.Button(width*0.3, height, "Ad", param)
            .addChildTo(this)
            .setPosition(SC_W*0.15, SC_H*0.7)
            .addEventListener("pushed", function() {
                if(ENABLE_PHONEGAP && AdMob) {
                    AdMob.prepareInterstitial({
                        adId:admobid.interstitial,
                        autoShow:true
                    });
                }
                if (that.mode != GAMEMODE_HARD) appMain.bonusLife = 1;
            });

        //GAMECENTER
        shotgun.Button(width*0.4, height, "RANKING", param)
            .addChildTo(this)
            .setPosition(SC_W*0.5, SC_H*0.70)
            .addEventListener("pushed", function() {
                var mode = that.parentScene.mode;
                var lb = "Normal_";
                if (mode == GAMEMODE_HARD) lb = "Hard_";
                if (appMain.returnJoker) lb += "RJ";
                showLeadersBoard(lb);
            });

        //SNS
        shotgun.Button(width*0.3, height, "SNS", param)
            .addChildTo(this)
            .setPosition(SC_W*0.85, SC_H*0.70)
            .addEventListener("pushed", function() {
                sendSocialMessage(that.mode, appMain.returnJoker, lastScore);
            });

        //リトライボタン
        this.retry = shotgun.Button(width, height, "TRY AGAIN", param)
            .addChildTo(this)
            .setPosition(SC_W*0.5, SC_H*0.78)
            .addEventListener("pushed", function() {
                var mode = that.parentScene.mode;
                that.parentScene = null;
                that.mask.tweener.clear().fadeIn(300).call(function(){appMain.replaceScene(shotgun.MainScene(mode));});
            });

        //戻るボタン
        this.back = shotgun.Button(width, height, "RETURN TO TITLE", param)
            .addChildTo(this)
            .setPosition(SC_W*0.5, SC_H*0.86)
            .addEventListener("pushed", function() {
                that.parentScene = null;
                that.mask.tweener.clear().fadeIn(300).call(function(){appMain.replaceScene(shotgun.TitleScene());});
            });

        //ライフサービステロップ
        if (this.mode == GAMEMODE_NORMAL && !this.bonus) {
            if (appMain.telopCount < 0 || appMain.firstNormalGameOver) {
                this.telop = shotgun.Telop()
                    .addChildTo(this)
                    .setPosition(SC_W*0.5, SC_H*0.5)
                    .add({text:$trans("Adボタンで広告を見るとライフ１個ボーナス！"), size:28, dispWait:5000, silent:true});
                appMain.telopCount = 4;
            }
            appMain.telopCount--;
            appMain.firstNormalGameOver = false;
            appMain.saveConfig();
        }

        //目隠し
        this.mask = tm.display.RectangleShape({width: SC_W, height: SC_H, fillStyle: "rgba(0, 0, 0, 1.0)", strokeStyle: "rgba(0, 0, 0, 1.0)"})
            .addChildTo(this)
            .setPosition(SC_W*0.5, SC_H*0.5);
        this.mask.tweener.clear().fadeOut(200);
    },

    update: function() {
        if (!this.dispExtend && appMain.bonusLife != 0) {
            var that = this;
            var c = tm.display.Sprite("card", CARD_W, CARD_H)
                .addChildTo(this.retry)
                .setPosition(190, 0)
                .setFrameIndex(13*3)
                .tweener.clear()
                .fadeOut(1)
                .wait(1000)
                .call(function(){
                    that.Ad.remove();
                })
                .wait(1000)
                .fadeIn(1)
                .scale(0.4, 1000, "easeOutBounce")
                .call(function(){
                    tm.display.OutlineLabel("+", 70)
                        .addChildTo(that.retry)
                        .setParam(that.extendParam)
                        .setPosition(150, 0);
                });
            this.dispExtend = true;
        }
    },

    //タッチorクリック開始処理
    ontouchstart: function(e) {
    },

    //タッチorクリック移動処理
    ontouchmove: function(e) {
    },

    //タッチorクリック終了処理
    ontouchend: function(e) {
    },

});
