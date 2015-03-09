/*
 *  ShotgunPoker.js
 *  2014/06/19
 *  @auther minimo  
 *  This Program is MIT license.
 */

//namespace tiger
shotgun = {
    core: null,
};

tm.define("shotgun.CanvasApp", {
    superClass: tm.app.CanvasApp,

    version: "1.0.3",

    //初回起動フラグ
    firstGame: false,
    firstNormalGameOver: true,
    telopCount: 1,

    //ＢＧＭ＆効果音
    bgm: null,
    bgmIsPlay: false,
    sounds: null,

    //ボーナスライフ
    bonusLife: 0,

    //スコア保存
    lastScore: [],
    highScore: [],

    //実績保存
    achievement: null,

    //各種設定
    useJoker: USE_JOKER,
    returnJoker: RETURN_JOKER,
    handList: null,

    //バックグラウンドカラー
    bgColor: 'rgba(50, 120, 50, 1)',

    //フラットボタン使用フラグ
    buttonFlat: true,

    //言語設定
    language: "JAPANESE",

    init: function(id) {
        this.superInit(id);
        this.resize(SC_W, SC_H).fitWindow();
        this.fps = fps;
        this.background = "rgba(0, 0, 0, 0)";
        this.keyboard = tm.input.Keyboard(window);

        shotgun.core = this;

        //役名一覧作成
        this.createHandList();

        //サウンドセット
        this.sounds = shotgun.SoundSet(MEDIA_DEFAULT);

        //スコア
        this.highScore[GAMEMODE_NORMAL] = 0;
        this.lastScore[GAMEMODE_NORMAL] = 0;
        this.highScore[GAMEMODE_HARD] = 0;
        this.lastScore[GAMEMODE_HARD] = 0;

        this.highScore[GAMEMODE_NORMAL+10] = 0; //ReturnJoker
        this.lastScore[GAMEMODE_NORMAL+10] = 0;
        this.highScore[GAMEMODE_HARD+10] = 0;
        this.lastScore[GAMEMODE_HARD+10] = 0;

        //実績情報
        this.achievement = shotgun.Achievement();

        //設定情報の読み込み
        this.loadConfig();

        //アセット読み込み
        var loadingScene = shotgun.LoadingScene();
        this.replaceScene(loadingScene);
    },

    exitApp: function() {
        this.stop();
    },

    //役名一覧作成
    createHandList: function() {
        this.handList = [];
        this.handList[0]  = {name: $trans("MISS"), point: MISS};
        this.handList[1]  = {name: $trans("NO PAIR"), point: NOPAIR};
        this.handList[2]  = {name: $trans("ONE PAIR"), point: ONEPAIR};
        this.handList[3]  = {name: $trans("TWO PAIR"), point: TWOPAIR};
        this.handList[4]  = {name: $trans("FLUSH"), point: FLUSH};
        this.handList[5]  = {name: $trans("THREE CARD"), point: THREECARD};
        this.handList[6]  = {name: $trans("FULL HOUSE"), point: FULLHOUSE};
        this.handList[7]  = {name: $trans("STRAIGHT"), point: STRAIGHT};
        this.handList[8]  = {name: $trans("FOUR CARD"), point: FOURCARD};
        this.handList[9]  = {name: $trans("FIVE CARD"), point: FIVECARD};
        this.handList[10] = {name: $trans("STRAIGHT FLUSH"), point: STRAIGHTFLUSH};
        this.handList[11] = {name: $trans("R.STRAIGHT FLUSH"), point: ROYALSTRAIGHTFLUSH};
    },

    //設定データの保存
    saveConfig: function() {
        var saveObj = {
            "firstGame": false,
            "language": this.language,
            "volumeBGM": this.sounds.volumeBGM,
            "volumeSE": this.sounds.volumeSE,
            "returnJoker": this.returnJoker,
            "firstNormalGameOver": this.firstNormalGameOver,

            "highScore_normal":     this.highScore[GAMEMODE_NORMAL],
            "lastScore_normal":     this.lastScore[GAMEMODE_NORMAL],
            "highScore_normal_ret": this.highScore[GAMEMODE_NORMAL+10],
            "lastScore_normal_ret": this.lastScore[GAMEMODE_NORMAL+10],

            "highScore_hard":       this.highScore[GAMEMODE_HARD],
            "lastScore_hard":       this.lastScore[GAMEMODE_HARD],
            "highScore_hard_ret":   this.highScore[GAMEMODE_HARD+10],
            "lastScore_hard_ret":   this.lastScore[GAMEMODE_HARD+10],
        };
        localStorage.setItem("config", JSON.stringify(saveObj));

        //実績情報
        this.achievement.save();

        return this;
    },

    //設定データの読み込み
    loadConfig: function() {
        var cfg = localStorage.getItem("config");
        if (cfg) {
            var cfgDef = {
                "language": "JAPANESE",
                "volumeBGM": 5,
                "volumeSE": 5,
                "returnJoker": false,
                "firstNormalGameOver": true,

                "highScore_normal": 0,
                "lastScore_normal": 0,
                "highScore_normal_ret": 0,
                "lastScore_normal_ret": 0,

                "highScore_hard": 0,
                "lastScore_hard": 0,
                "highScore_hard_ret": 0,
                "lastScore_hard_ret": 0,
            }
            var c = JSON.parse(cfg);
            c.$safe(cfgDef);

            this.firstGame = false;
            this.language = c.language;
            if (this.language == 0) this.language = "JAPANESE";
            if (this.language == 1) this.language = "ENGLISH";
            this.sounds.volumeBGM = c.volumeBGM;
            this.sounds.volumeSE = c.volumeSE;
            this.returnJoker = c.returnJoker;
            this.firstNormalGameOver = c.firstNormalGameOver;


            this.highScore[GAMEMODE_NORMAL] = c.highScore_normal;
            this.lastScore[GAMEMODE_NORMAL] = c.lastScore_normal;
            this.highScore[GAMEMODE_NORMAL+10] = c.highScore_normal_ret;
            this.lastScore[GAMEMODE_NORMAL+10] = c.lastScore_normal_ret;
            this.highScore[GAMEMODE_HARD] = c.highScore_hard;
            this.lastScore[GAMEMODE_HARD] = c.lastScore_hard;
            this.highScore[GAMEMODE_HARD+10] = c.highScore_hard_ret;
            this.lastScore[GAMEMODE_HARD+10] = c.lastScore_hard_ret;

            //GameCenterに現在スコアを強制更新
            submitScore(GAMEMODE_NORMAL, false, this.highScore[GAMEMODE_NORMAL]);
            submitScore(GAMEMODE_NORMAL, true , this.highScore[GAMEMODE_NORMAL+10]);
            submitScore(GAMEMODE_HARD  , false, this.highScore[GAMEMODE_HARD]);
            submitScore(GAMEMODE_HARD  , true , this.highScore[GAMEMODE_HARD+10]);
        } else {
            //初期情報書き込み
            this.saveConfig();
            this.firstGame = true;
        }

        //実績情報
        this.achievement.load();

        return this;
    },

    playBGM: function(asset) {
        this.sounds.playBGM(asset);
        return this;
    },

    stopBGM: function() {
        this.sounds.stopBGM();
        return this;
    },

    pauseBGM: function() {
        this.sounds.pauseBGM();
        return this;
    },

    resumeBGM: function() {
        this.sounds.resumeBGM();
        return this;
    },

    playSE: function(asset) {
        this.sounds.playSE(asset);
        return this;
    },

    setVolumeBGM: function(vol) {
        this.sounds.setVolumeBGM(vol);
        return this;
    },

    setVolumeSE: function(vol) {
        this.sounds.setVolumeSE(vol);
        return this;
    },
});

shotgun.CanvasApp.prototype.accessor("volumeBGM", {
    "get": function() { return this.sounds.volumeBGM; },
    "set": function(vol) {
        this.setVolumeBGM(vol)
    }
});
shotgun.CanvasApp.prototype.accessor("volumeSE", {
    "get": function() { return this.sounds.volumeSE; },
    "set": function(vol) {
        this.setVolumeSE(vol)
    }
});
