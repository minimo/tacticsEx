/*
 *  Application.js
 *  2015/03/10
 *  @auther minimo  
 *  This Program is MIT license.
 */

//namespace tactics
tactics = {
    core: null,
};

tm.define("tactics.CanvasApp", {
    superClass: tm.app.CanvasApp,

    version: "0.0.1",

    //初回起動フラグ
    firstGame: false,
    firstNormalGameOver: true,
    telopCount: 1,

    //ＢＧＭ＆効果音
    bgm: null,
    bgmIsPlay: false,
    sounds: null,

    //スコア保存
    lastScore: [],
    highScore: [],

    //実績保存
    achievement: null,

    //バックグラウンドカラー
    bgColor: 'rgba(0, 0, 0, 1)',

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

        tactics.core = this;

        //サウンドセット
        this.sounds = tactics.SoundSet(MEDIA_DEFAULT);

        //設定情報の読み込み
        this.loadConfig();

        //アセット読み込み
        var loadingScene = tactics.LoadingScene();
        this.replaceScene(loadingScene);
    },

    exitApp: function() {
        this.stop();
    },

    //設定データの保存
    saveConfig: function() {
        return this;
    },

    //設定データの読み込み
    loadConfig: function() {
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

tactics.CanvasApp.prototype.accessor("volumeBGM", {
    "get": function() { return this.sounds.volumeBGM; },
    "set": function(vol) {
        this.setVolumeBGM(vol)
    }
});
tactics.CanvasApp.prototype.accessor("volumeSE", {
    "get": function() { return this.sounds.volumeSE; },
    "set": function(vol) {
        this.setVolumeSE(vol)
    }
});


