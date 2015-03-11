/*
 *  Application.js
 *  2014/03/10
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


//SpriteのsetFrameIndexをちょっと改造
tm.display.Sprite.prototype.setFrameIndex = function(index, width, height) {

    //テクスチャのトリミング設定
    var sx = this.frameTrimX || 0;
    var sy = this.frameTrimY || 0;
    var sw = this.frameTrimW || (this.image.width-sx);
    var sh = this.frameTrimH || (this.image.height-sy);

    var tw  = width || this.width;
    var th  = height || this.height;
    var row = ~~(sw / tw);
    var col = ~~(sh / th);
    var maxIndex = row*col;
    index = index%maxIndex;

    var x   = index%row;
    var y   = ~~(index/row);
    this.srcRect.x = sx+x*tw;
    this.srcRect.y = sy+y*th;
    this.srcRect.width  = tw;
    this.srcRect.height = th;

    this._frameIndex = index;

    return this;
}
//トリミング開始位置設定
tm.display.Sprite.prototype.setFrameTrimming = function(x, y, width, height) {
    this.frameTrimX = x || 0;
    this.frameTrimY = y || 0;
    this.frameTrimW = width || this.image.width - this.frameTrimX;
    this.frameTrimH = height || this.image.height - this.frameTrimY;
    return this;
}

//アニメーションスプライト拡張
tm.display.AnimationSprite.prototype.currentAnimationName = null;
tm.display.AnimationSprite.prototype._gotoAndPlay = tm.display.AnimationSprite.prototype.gotoAndPlay;
tm.display.AnimationSprite.prototype._gotoAndStop = tm.display.AnimationSprite.prototype.gotoAndStop;
tm.display.AnimationSprite.prototype.gotoAndPlay = function(name) {
    name = (name !== undefined) ? name : "default";
    this.currentAnimationName = name;
    return this._gotoAndPlay(name);
}
tm.display.AnimationSprite.prototype.gotoAndStop = function(name) {
    name = (name !== undefined) ? name : "default";
    this.currentAnimationName = name;
    return this._gotoAndStop(name);
}
tm.display.AnimationSprite.prototype._normalizeFrame = function() {
    var anim = this.currentAnimation;
    if (anim) {
        if (this.currentFrameIndex < anim.frames.length) {
            this.currentFrame = anim.frames[this.currentFrameIndex];
        }
        else {
            // dispatch animationend
            var e = tm.event.Event("animationend");
            e.animationName = this.currentAnimationName;
            this.dispatchEvent(e);

            if (anim.next) {
                this.gotoAndPlay(anim.next);
            }
            else {
                this.currentFrameIndex = anim.frames.length - 1;
                this.currentFrame = anim.frames[this.currentFrameIndex];
                this.paused = true;
            }
        }
    }
}


