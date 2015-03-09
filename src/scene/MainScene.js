/*
 *  MainScene.js
 *  2014/06/19
 *  @auther minimo  
 *  This Program is MIT license.
 *
 */

tm.define("shotgun.MainScene", {
    superClass: tm.app.Scene,

    //マルチタッチ補助クラス
    touches: null,
    touchID: -1,

    //タッチ情報
    startX: 0,
    startY: 0,
    touchTime: 0,
    moveX: 0,
    moveY: 0,
    beforeX: 0,
    beforeY: 0,

    //デッキ
    deck: null,
    shuffled: false,

    //ゲーム内情報
    mode: 0,
    start: false,   //ゲームスタートフラグ
    score: 0,       //スコア
    life: 2,        //ライフ
    lifeMax: 5,     //ライフ最大値
    pick: false,    //カードピック可能フラグ
    level: 1,       //ゲームレベル
    levelReset: 0,  //レベルリセット回数
    handCount: null,//役の回数
    onePair: 0,     //ワンペアの連続回数
    gameend: false, //ゲーム終了フラグ
    complete: false,//役コンプリートフラグ
    newRecord: false,   //ハイスコア更新フラグ
    handLog: [],    //役ログ
    bonus: false,   //ボーナスライフ貰ってるかフラグ
    useJoker: false,//ジョーカー使ったよフラグ
    noMissCount: 0, //ミス無し回数

    //カウンタ
    count: 10,      //カード選択カウントダウン用
    limitCount: 9*44,
    limitMax: 9*44,

    //経過時間
    time: 1,
    absTime: 1,
    touchTime: 0,

    //遷移情報
    exitGame: false,

    //ラベル用パラメータ
    labelParamBasic: {fontFamily: "Yasashisa", align: "left", baseline: "middle",outlineWidth: 3, fontWeight:700},
    labelParamBasicCenter: {fontFamily: "Yasashisa'", align: "center", baseline: "middle",outlineWidth: 3, fontWeight:700},
    labelParamPoker: {fontFamily: "CasinoRegular",align: "center", baseline: "middle", outlineWidth: 3},
    labelParamHand:  {fontFamily: "CasinoRegular",align: "left", baseline: "middle", outlineWidth: 3},
    labelParamBefore:{fontFamily: "Yasashisa",align: "left", baseline: "top", outlineWidth: 3, fontWeight:700},
    labelParamModeName: {fontFamily: "Yasashisa", align: "right", baseline: "middle",outlineWidth: 3, fontWeight:700},

    init: function(mode) {
        this.superInit();
        this.background = "rgba(0, 0, 0, 0.0)";

        //ゲームモード
        if (mode === undefined) mode = GAMEMODE_NORMAL;
        this.mode = mode;

        //ボーナス貰ってるか判定
        if (appMain.bonusLife != 0) this.bonus = true;

        //ハードモードはライフ無し
        if (this.mode == GAMEMODE_HARD) {
            this.life = 0;
            this.level = 2.5;
            this.levelReset = 1;
            this.absTime = ~~(30*60*3.5);
        }

        //バックグラウンド
        this.bg = tm.display.RectangleShape({width: SC_W, height: SC_H, fillStyle: appMain.bgColor, strokeStyle: appMain.bgColor})
            .addChildTo(this)
            .setPosition(SC_W*0.5, SC_H*0.5)

        //マルチタッチ初期化
        this.touches = tm.input.TouchesEx(this);

        //レイヤー準備
        this.lowerLayer = tm.app.Object2D().addChildTo(this);
        this.mainLayer = tm.app.Object2D().addChildTo(this);
        this.upperLayer = tm.app.Object2D().addChildTo(this);

        //上がり回数配列
        this.handCount = [];
        for (var i = 0; i < 12; i++) {
            this.handCount[appMain.handList[i].point] = 0;
        }

        //スコア表示
        var that = this;
        this.scoreLabel = tm.display.OutlineLabel("SCORE ", 40)
            .addChildTo(this)
            .setParam(this.labelParamBasic)
            .setPosition(8, 32);
        this.scoreLabel.score = 0;
        this.scoreLabel.update = function() {
            this.text = "SCORE "+this.score;
            if (this.score < that.score) {
                var s = ~~((that.score-this.score)/11);
                if (s < 3) s=3;
                this.score += s;
                if (this.score > that.score)this.score = that.score;
            }
        }

        //ライフ表示
        if (this.mode != GAMEMODE_HARD) {
            this.lifeLabel = tm.display.OutlineLabel("LIFE:", 40)
                .addChildTo(this)
                .setParam(this.labelParamBasic)
                .setPosition(8, 96);
            if (this.mode != GAMEMODE_PRACTICE) {
                this.lifeLabel.beforeLife = this.life;
                this.lifeLabel.lg = [];
                for (var i = 0; i < this.lifeMax; i++ ) {
                    var c = this.lifeLabel.lg[i] = tm.display.Sprite("card", CARD_W, CARD_H)
                        .addChildTo(this.lifeLabel)
                        .setScale(0.3)
                        .setPosition(130+i*45, 0)
                        .setFrameIndex(13*3+i);
                    c.alpha = 0;
                    if (i < this.life) c.alpha = 1;
                }
                this.lifeLabel.update = function() {
                    if (this.beforeLife == that.life || this.beforeLife == 0) return;
                    if (that.lifeMax < that.life ) return;
                    if (that.life < this.beforeLife) {
                        this.lg[this.beforeLife-1].tweener.clear().scale(0.0, 500);
                    } else if (that.life > this.beforeLife) {
                        if (that.life-this.beforeLife < 2) {
                            this.lg[that.life-1].tweener.clear().scale(1,1).fadeIn(1).scale(0.3, 1000, "easeOutBounce");
                        } else {
                            //２ＵＰ用
                            this.lg[that.life-2].tweener.clear().scale(1,1).fadeIn(1).scale(0.3, 1000, "easeOutBounce");
                            this.lg[that.life-1].tweener.clear().wait(500).scale(1,1).fadeIn(1).scale(0.3, 1000, "easeOutBounce");
                        }
                    }
                    this.beforeLife = that.life;
                }
            } else {
                tm.display.OutlineLabel("∞", 70)
                    .addChildTo(this)
                    .setParam(this.labelParamBasic)
                    .setPosition(130, 96);
            }
        }

        //タイムリミットゲージ
        var color = "hsla({0}, 100%, 50%, 1.0)".format(300);
        this.meter = tm.display.Shape({width: 30, height: 500})
            .addChildTo(this)
            .setPosition(20, SC_H*0.65)
            .setOrigin(0.5, 1.0);
        this.meter.update = function() {
            var limit = that.limitCount*(500/that.limitMax);
            var hsl = ~~(that.limitCount*(120/that.limitMax));
            var color = "hsla({0}, 100%, 50%, 1.0)".format(hsl);

            var c = this.canvas;
            c.clear(0,0,30,500);
            c.fillStyle = color;
            c.strokeStyle = color;
            c.lineWidth = 1;

            var lw = Number(c.lineWidth);
            c.fillRect(0, 500-limit, this.width, this.height-(500-limit));
            c.restore();
        }
        tm.display.RectangleShape({width: 30, height: 500, fillStyle: "rgba(0,0,0,0)", strokeStyle: "Black", lineWidth: 3})
            .addChildTo(this)
            .setPosition(20, SC_H*0.65)
            .setOrigin(0.5, 1.0);

        //直前の役表示
        var by = SC_H*0.8+CARD_H*CARD_SCALE*0.5-10;
        this.beforeLabel = tm.display.OutlineLabel("BEFORE:", 30)
            .addChildTo(this)
            .setParam(this.labelParamBefore)
            .setPosition(8, by);
        this.beforeHand = tm.display.OutlineLabel("nothing", 30)
            .addChildTo(this)
            .setParam(this.labelParamBefore)
            .setPosition(150, by);
        this.beforeHand.name = "";
        this.beforeHand.alert = false;
        this.beforeHand.update = function() {
            if (this.alert) {
                this.fillStyle = "Red";
            } else {
                this.fillStyle = "White";
            }
            this.text = this.name;
        }

        //ポーズボタン
        this.pause = shotgun.Button(200, 60, "PAUSE", {flat: appMain.buttonFlat, fontSize:40})
            .addChildTo(this)
            .setPosition(SC_W*0.84, 90)
            .addEventListener("pushed", function() {
                appMain.pushScene(shotgun.PauseScene(this));
            }.bind(this));

        //モード名称表示とBGM
        var modeName;
        switch(mode) {
            case GAMEMODE_NORMAL:
                modeName = "NORMAL";
                appMain.playBGM("mainBGM");
                break;
            case GAMEMODE_HARD:
                modeName = "HARD";
                appMain.playBGM("hardBGM");
                break;
            case GAMEMODE_PRACTICE:
                modeName = "PRACTICE";
                appMain.playBGM("mainBGM");
                break;
        }
        this.modeLabel = tm.display.OutlineLabel(modeName, 40)
            .addChildTo(this)
            .setParam(this.labelParamModeName)
            .setPosition(SC_W-5, 32);

        //カードデッキ
        this.deck = shotgun.CardDeck().addChildTo(this.mainLayer);

        //スタートアップ
        var lb = this.readyLabel = tm.display.Sprite("ready")
            .addChildTo(this.upperLayer)
            .setPosition(SC_W/2, SC_H/2)
            .setScale(1.5);
        lb.tweener.clear().wait(500).fadeOut(500).wait(300);
        lb.tweener.call(function(){
            that.deck.startup();
            that.deck.shuffle();
            that.start = true;
            that.pick = true;
        });

        //カウントダウン表示
        var lb = this.countDown = tm.display.Sprite("count", 256, 256)
            .addChildTo(this.upperLayer)
            .setPosition(SC_W/2, SC_H/2)
            .setFrameIndex(4);
        lb.beforeCount = 9;
        lb.alpha = 0.0;
        lb.update = function() {
            if (that.count < 6) {
                this.visible = true;
                if (this.beforeCount == that.count) {
                    this.alpha -= 0.05;
                    if (this.alpha < 0)this.alpha = 0;
                } else {
                    this.alpha = 1.0;
                    appMain.playSE("countdown");
                }
                this.setFrameIndex(that.count);
            } else {
                this.visible = false;
            }
            this.beforeCount = that.count;
        }

        //メッセージ表示キュー
        var ms = this.messageQueue = tm.display.OutlineLabel("", 100)
            .addChildTo(this.upperLayer)
            .setParam(this.labelParamPoker)
            .setPosition(SC_W*0.5, SC_H*0.5);
        ms.duration = -1;
        ms.queue = [];
        ms.update = function() {
            this.duration--;
            if (this.duration == 0) this.text = "";
            if (this.duration < 0) {
                if (this.queue.length > 0) {
                    var p = this.queue[0];
                    this.text = p.text;
                    this.setFontSize(p.size);
                    this.duration = p.duration;
                    this.queue.splice(0, 1);

                    this.tweener.clear().fadeIn(1);
                }
            }
        }
        ms.addMessage = function(text, size, duration) {
            duration = duration || 50;
            var param = {text: text, size: size, duration: duration};
            this.queue.push(param);
        }

        //デバッグ用レベル表示
        if (DEBUG) {
            var lb = tm.display.OutlineLabel("", 40)
                .addChildTo(this)
                .setParam(this.labelParamBasic)
                .setPosition(SC_W*0.0, SC_H-20);
            lb.update = function() {
                this.text = "Level:"+that.level;
            }
        }

        //目隠し
        this.mask = tm.display.RectangleShape({width: SC_W, height: SC_H, fillStyle: "rgba(0, 0, 0, 1.0)", strokeStyle: "rgba(0, 0, 0, 1.0)"})
            .addChildTo(this)
            .setPosition(SC_W*0.5, SC_H*0.5);
        this.mask.tweener.clear().fadeOut(200);

        //起動時実績チェック
        this.checkAchievement({mode:this.mode});
    },
    
    update: function() {
        if (!this.start) return;
        if (this.deck.busy) return;

        //ボーナスライフ加算演出
        if (this.mode != GAMEMODE_HARD && appMain.bonusLife != 0) {
            this.messageQueue.addMessage("THANKYOU!!", 90);
            appMain.bonusLife = 0;

            var that = this;
            var tmp = tm.app.Object2D()
                .addChildTo(this);
            tmp.tweener.clear()
                .wait(1000)
                .call(function(){
                    that.life++;
                    appMain.playSE("extend");
                    this.remove();
                }.bind(tmp));
        }

        if (this.pick && !this.gameend) {
            //カウントダウン間隔
            var interval = 45-~~(this.level*10);
            if (interval < 10) interval = 10;

            //タイムリミットゲージ用カウンタ
            if (this.count == 10) {
                this.limitMax = this.limitCount = interval*10;
            } else if (this.count < 10) {
                this.limitCount--;
                if (this.limitCount < 0) this.limitCount = 0;
            }

            //カウントダウン
            if (this.time % interval == 0) this.count--;
        }

        //手札が五枚揃ったor時間切れ
        if (this.deck.numHand == 5 || this.count < 0) {
            this.checkHand();
        }

        //カードピック可能時のみ時間を進める
        if (this.pick) {
            this.time++;
            this.absTime++;
        }

        //ゲーム終了処理
        if (this.exitGame) {
            appMain.stopBGM();
            appMain.replaceScene(shotgun.TitleScene());
        }

        //スクリーンショット保存
        var kb = appMain.keyboard;
        if (kb.getKeyDown("s")) appMain.canvas.saveAsImage();

        //チート
        this.cheat();

        this.touchTime++;
    },

    //チートコマンド
    cheat: function() {
        if (!CHEAT) return;
        var kb = appMain.keyboard;
        if (kb.getKeyDown("1")) { //RSF
            this.deck.addHand(this.deck.pickCard(SUIT_SPADE, 10));
            this.deck.addHand(this.deck.pickCard(SUIT_SPADE, 11));
            this.deck.addHand(this.deck.pickCard(SUIT_SPADE, 12));
            this.deck.addHand(this.deck.pickCard(SUIT_SPADE, 13));
            this.deck.addHand(this.deck.pickCard(SUIT_SPADE, 1));
        }
        if (kb.getKeyDown("2")) { //SF
            this.deck.addHand(this.deck.pickCard(SUIT_SPADE, 10));
            this.deck.addHand(this.deck.pickCard(SUIT_SPADE, 11));
            this.deck.addHand(this.deck.pickCard(SUIT_SPADE, 12));
            this.deck.addHand(this.deck.pickCard(SUIT_SPADE, 13));
            this.deck.addHand(this.deck.pickCard(SUIT_SPADE, 9));
        }
        if (kb.getKeyDown("3")) { //FLUSH
            this.deck.addHand(this.deck.pickCard(SUIT_SPADE, 6));
            this.deck.addHand(this.deck.pickCard(SUIT_SPADE, 11));
            this.deck.addHand(this.deck.pickCard(SUIT_SPADE, 12));
            this.deck.addHand(this.deck.pickCard(SUIT_SPADE, 13));
            this.deck.addHand(this.deck.pickCard(SUIT_SPADE, 9));
        }
        if (kb.getKeyDown("4")) { //Straght
            this.deck.addHand(this.deck.pickCard(SUIT_HEART, 10));
            this.deck.addHand(this.deck.pickCard(SUIT_SPADE, 11));
            this.deck.addHand(this.deck.pickCard(SUIT_SPADE, 12));
            this.deck.addHand(this.deck.pickCard(SUIT_SPADE, 13));
            this.deck.addHand(this.deck.pickCard(SUIT_SPADE, 9));
        }
        if (kb.getKeyDown("5")) { //4c
            this.deck.addHand(this.deck.pickCard(SUIT_HEART, 10));
            this.deck.addHand(this.deck.pickCard(SUIT_CLOVER, 10));
            this.deck.addHand(this.deck.pickCard(SUIT_DIAMOND, 10));
            this.deck.addHand(this.deck.pickCard(SUIT_SPADE, 10));
        }
        if (kb.getKeyDown("6")) { //3c
            this.deck.addHand(this.deck.pickCard(SUIT_HEART, 10));
            this.deck.addHand(this.deck.pickCard(SUIT_CLOVER, 10));
            this.deck.addHand(this.deck.pickCard(SUIT_DIAMOND, 10));
        }
        if (kb.getKeyDown("7")) { //2p
            this.deck.addHand(this.deck.pickCard(SUIT_HEART, 8));
            this.deck.addHand(this.deck.pickCard(SUIT_CLOVER, 8));
            this.deck.addHand(this.deck.pickCard(SUIT_DIAMOND, 10));
            this.deck.addHand(this.deck.pickCard(SUIT_SPADE, 10));
        }
    },

    //ゲームオーバー
    gameover: function() {
        this.start = false;
        this.pick = false;
        this.gameend = true;

        this.pause.lock = true;

        //スコア情報更新
        var mode = this.mode;
        if (appMain.returnJoker) mode+=10;
        appMain.lastScore[mode] = this.score;
        if (this.score > appMain.highScore[mode]) {
            appMain.highScore[mode] = this.score;
            this.newRecord = true;
        }

        //ゲームオーバー時実績チェック
        var param = {
            gameover:true,
            useJoker: this.useJoker
        };
        this.checkAchievement(param);

        //メッセージ
        var that = this;
        var lb = tm.display.Sprite("gameover")
            .addChildTo(this.upperLayer)
            .setPosition(SC_W*0.5, SC_H*0.5-SC_H);
        lb.tweener
            .wait(500)
            .move(SC_W*0.5, SC_H*0.5, 4000, "easeOutBounce")
            .wait(2000)
            .call(function() {
                this.remove();
                appMain.replaceScene(shotgun.GameoverScene(that));
            }.bind(lb));

        //設定保存
        appMain.saveConfig();
    },

    //実績達成チェック
    checkAchievement: function(param) {
        var ac = appMain.achievement.check(param);
        if (ac) {
            //達成実績があったらテロップを投入
            var that = this;
            var telop = shotgun.Telop().addChildTo(this).setPosition(SC_W*0.5, SC_H*0.85);
            for (var i = 0; i < ac.length; i++) {
                var text1 = $trans("実績「");
                var text2 = $trans("」が解除されました");
                var text = text1+$trans(ac[i].name)+text2;
                var size = 30;
                if (appMain.language == "JAPANESE") {
                    size = text.length<22? 30: 27;
                }
                telop.add({text:text, size:size});
            }
        }
    },

    //手札内容のチェック
    checkHand: function() {
        this.pick = false;
        this.deck.sortHand();
        this.deck.numHand = 0;
        var hand = this.deck.checkHand();
        this.dispHand(hand);
        this.handCount[hand]++;

        //役履歴保存
        this.handLog.push({
            hand: hand,
            leftTime: this.count,
            cards: this.deck.hands.clone()
        });
        if (this.handLog.length > 20) this.handLog.splice(0, 1);

        //役無し、手札未成立、ワンペア２連続はペナルティ
        var penalty = 0;
        if (hand == NOPAIR) penalty = 1;
        if (hand == MISS) penalty = 1;
        if (hand == ONEPAIR) {
            this.onePair++;
            if (this.onePair % 2 == 0) penalty = 1;
        } else {
            this.onePair = 0;
        }
        if (penalty > 0) {
            appMain.playSE("nopair");
            if (this.mode != GAMEMODE_PRACTICE) this.life -= penalty;
            this.noMissCount = 0;
        } else {
            appMain.playSE("hand");
            this.noMissCount++;
        }

        //得点がプラスの時のみスコアに加算
        if (hand > 0) {
            var ps = hand;    //加算スコア

            //早上がりボーナス判定
            var msg = "";
            if (this.count > 8) {
                ps = ~~(ps*2);
                msg = "FANTASTIC!";
            } else if (this.count > 7) {
                ps = ~~(ps*1.5);
                msg = "EXCELLENT!";
            } else if (this.count > 5) {
                ps = ~~(ps*1.3);
                msg = "GOOD!"
            }
            if (msg != "") {
                this.messageQueue.addMessage(msg, 100);
            }
            this.score+=ps;
        }

        //エクステンド判定
        var extend = 0;

        //役コンプリート判定
        var cp = true;
        if (!this.complete) {
            if (this.handCount[ONEPAIR] == 0) cp = false;
            if (this.handCount[FLUSH] == 0) cp = false;
            if (this.handCount[TWOPAIR] == 0) cp = false;
            if (this.handCount[THREECARD] == 0) cp = false;
            if (this.handCount[FULLHOUSE] == 0) cp = false;
            if (this.handCount[STRAIGHT] == 0) cp = false;
            if (this.handCount[FOURCARD] == 0) cp = false;
            if (this.handCount[STRAIGHTFLUSH] == 0) cp = false;
            if (this.handCount[ROYALSTRAIGHTFLUSH] == 0) cp = false;
            if (cp) {
                extend++;
                this.complete = true;
                this.score+=2000;
                this.messageQueue.addMessage("HAND COMPLETE!", 70);
            }
        }

        //初回R.S.Fの場合はライフ＋１
        if (hand == ROYALSTRAIGHTFLUSH && this.handCount[hand] == 1) extend++;

        //エクステンド処理
        if (extend != 0 && this.mode == GAMEMODE_NORMAL) {
            var that = this;
            var tmp = tm.app.Object2D()
                .addChildTo(this);
            tmp.tweener.clear()
                .wait(1000)
                .call(function(){
                    that.life+=extend;
                    appMain.playSE("extend");
                    this.remove();
                }.bind(tmp));
        }

        //ゲームオーバー判定
        if (this.life < 0) {
            appMain.stopBGM();
            this.gameover();
        }

        //実績判定
        if (ENABLE_ACHIEVEMENT) {
            var param = {
                mode:this.mode,
                cards:this.deck.hands,
                lastHand:hand,
                handLog:this.handLog,
                score:this.score,
                handCount:this.handCount,
                complete:cp,
                leftTime:this.count,
                noMissCount: this.noMissCount,
            };
            this.checkAchievement(param);
        }

        this.count = 10;
        this.time = 0;

        //ジョーカー使用判定
        if (!this.useJoker) this.useJoker = this.deck.jokerInHand

        //レベル処理
        this.level = Math.sqrt(this.absTime*(0.0002*(this.levelReset+1)))+1;
        if (this.level > 2 && this.levelReset < 1) {
            this.absTime = 0;
            this.level = 1;
            this.levelReset++;
        }
    },

    //役名表示
    dispHand: function(hand, wait) {
        wait = wait || 1200;
        var name1 = "", name2 = "", name3 = "";
        var size = 80; offset = 0;
        switch (hand) {
            case MISS:          name1 = "MISS!"; offset = 10; break;
            case NOPAIR:        name1 = "NO PAIR"; size = 65; break;
            case ONEPAIR:       name1 = "ONE"; name2 = "PAIR"; offset = 30; break;
            case FLUSH:         name1 = "FLUSH"; break;
            case TWOPAIR:       name1 = "TWO"; name2 = "PAIR"; offset = 30; break;
            case THREECARD:     name1 = "THREE"; name2 = "CARD"; size = 70; break;
            case FULLHOUSE:     name1 = "FULL"; name2 = "HOUSE"; size = 75; break;
            case STRAIGHT:      name1 = "STRAIGHT"; size = 50; break;
            case FOURCARD:      name1 = "FOUR"; name2 = "CARD"; offset = 10; break;
            case FIVECARD:      name1 = "FIVE"; name2 = "CARD"; offset = 10; break;
            case STRAIGHTFLUSH: name1 = "STRAIGHT"; name2 = "FLUSH"; size = 50; break;
            case ROYALSTRAIGHTFLUSH: name1 = "ROYAL"; name2 = "STRAIGHT"; name3 = "FLUSH !!"; size = 50; break;
        }
        if (appMain.language == "ENGLISH") {
            switch (hand) {
                case THREECARD:     name1 = "THREE"; name2 = "OF"; name3 = "A KIND"; size = 70; offset = 20; break;
                case FOURCARD:      name1 = "FOUR";  name2 = "OF"; name3 = "A KIND"; size = 70; offset = 30; break;
                case FIVECARD:      name1 = "FIVE";  name2 = "OF"; name3 = "A KIND"; size = 70; offset = 30; break;
                case ROYALSTRAIGHTFLUSH: name1 = "ROYAL"; name2 = "FLUSH !!"; name3 = "", size = 60; break;
                default:
                    break;
            }
        }

        //役名表示
        var that = this;
        var x = SC_W*0.6+offset, y = SC_H*0.8;
        var step = SC_H*0.08;
        if (name2 != "") y-=SC_H*0.04;
        if (name3 != "") {
            y-=SC_H*0.02;
            step = SC_H*0.06;
        }

        //１行目
        var lb1 = tm.display.OutlineLabel(name1, size).addChildTo(this);
        lb1.setParam(this.labelParamHand);
        lb1.setPosition(x, y);
        lb1.tweener.clear().wait(wait)
            .call(function(){
                lb1.remove();
                that.deck.clearHand();
                that.pick = true;
                that.beforeHand.name = that.deck.handName(hand);
                if (that.onePair % 2 == 1)
                    that.beforeHand.alert = true;
                else
                    that.beforeHand.alert = false;
            });

        //２行目
        y += step;
        var lb2 = tm.display.OutlineLabel(name2, size).addChildTo(this);
        lb2.setParam(this.labelParamHand);
        lb2.setPosition(x, y);
        lb2.tweener.clear().wait(wait).call(function(){lb2.remove();});

        //３行目
        y += step;
        var lb3 = tm.display.OutlineLabel(name3, size).addChildTo(this);
        lb3.setParam(this.labelParamHand);
        lb3.setPosition(x, y);
        lb3.tweener.clear().wait(wait).call(function(){lb3.remove();});
    },

    //タッチorクリック開始処理
    ontouchesstart: function(e) {
        if (this.touchID > 0)return;
        this.touchID = e.ID;

        var sx = this.startX = e.pointing.x;
        var sy = this.startY = e.pointing.y;
        this.moveX = 0;
        this.moveY = 0;

        this.beforeX = sx;
        this.beforeY = sy;
        this.touchTime = 0;
    },

    //タッチorクリック移動処理
    ontouchesmove: function(e) {
        if (this.touchID != e.ID) return;

        var sx = e.pointing.x;
        var sy = e.pointing.y;
        var moveX = Math.abs(sx - this.beforeX);
        var moveY = Math.abs(sx - this.beforeY);

        if (!this.shuffled) {
            if (moveX > 200) {
                this.deck.shuffle();
                this.shuffled = true;
            }
        }

        if (this.time % 10 == 0) {
            this.beforeX = sx;
            this.beforeY = sy;
        }
    },

    //タッチorクリック終了処理
    ontouchesend: function(e) {
        if (this.touchID != e.ID) return;
        this.touchID = -1;

        var sx = e.pointing.x;
        var sy = e.pointing.y;

        if (this.pick && !this.shuffled && !this.deck.busy && !this.gameend) {
            var c = this.deck.pick(sx, sy);
            if (c) this.deck.addHand(c);
        }
        this.shuffled = false;
    },
});

