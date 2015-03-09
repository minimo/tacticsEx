/*
 *  SoundSet.js
 *  2014/11/28
 *  @auther minimo  
 *  This Program is MIT license.
 *
 */

//サウンド管理
tm.define("shotgun.SoundSet", {
    defaultType: MEDIA_ASSET,
    elements: null,

    bgm: null,
    bgmIsPlay: false,

    volumeBGM: 5,
    volumeSE: 5,

    init: function(type) {
        this.defaultType = type || MEDIA_ASSET;
        this.elements = [];
    },

    add: function(name, url) {
        if (name === undefined) return null;
        url = url || null;

        var e = null;
        switch(this.defaultType) {
            case MEDIA_ASSET:
                e = shotgun.SoundElement_WebAudio(name);
                break;
            case MEDIA_CORDOVA:
                e = shotgun.SoundElement_CordovaMedia(name, url);
                break;
            case MEDIA_LLA:
                e = shotgun.SoundElement_LLA(name, url);
                break;
        }
        this.elements.push(e);
        return this;
    },

    find: function(name) {
        for (var i = 0; i < this.elements.length; i++) {
            if (this.elements[i].name == name) return this.elements[i];
        }
        return null;
    },

    playBGM: function(name) {
        if (this.bgm) {
            this.bgm.stop();
            this.bgmIsPlay = false;
        }
        var media = this.find(name);
        if (media) {
            media.play(true);
            media.setVolume(this.volumeBGM);
            this.bgm = media;
            this.bgmIsPlay = true;
        } else {
            if (this.add(name)) this.playBGM(name);
        }
        return this;
    },

    stopBGM: function() {
        if (this.bgm) {
            if (this.bgmIsPlay) {
                this.bgm.stop();
                this.bgmIsPlay = false;
            }
            this.bgm = null;
        }
        return this;
    },

    pauseBGM: function() {
        if (this.bgm) {
            if (this.bgmIsPlay) {
                this.bgm.pause();
                this.bgmIsPlay = false;
            }
        }
        return this;
    },

    resumeBGM: function() {
        if (this.bgm) {
            if (!this.bgmIsPlay) {
                this.bgm.volume = this.volumeBGM;
                this.bgm.resume();
                this.bgmIsPlay = true;
            }
        }
        return this;
    },

    setVolumeBGM: function(vol) {
        this.volumeBGM = vol;
        if (this.bgm) {
            this.bgm.pause();
            this.bgm.setVolume(this.volumeBGM);
            this.bgm.resume();
        }
        return this;
    },

    playSE: function(name) {
        var media = this.find(name);
        if (media) {
            media.setVolume(this.volumeSE);
            media.playClone();
        } else {
            if (this.add(name)) this.playSE(name);
        }
        return this;
    },

    setVolumeSE: function(vol) {
        this.volumeSE = vol;
        return this;
    },
});

//SoundElement Basic
tm.define("shotgun.SoundElement", {

    type: 0,
    name: null,
    url: null,
    media: null,
    volume: 10,
    status: null,
    message: null,

    init: function(type, name, url) {
        this.type = type;
        this.name = name;
        this.url = url || null;
    },

    play: function(loop) {
        return this;
    },

    playClone: function() {
        return this;
    },

    resume: function() {
        if (!this.media) return this;
        this.media.resume();
        return this;
    },

    pause: function () {
        if (!this.media) return this;
        this.media.pause();
    },

    stop: function() {
        if (!this.media) return this;
        this.media.stop();
        return this;
    },

    setVolume: function(vol) {
        if (!this.media) return this;
        if (vol === undefined) vol = 1;
        this.volume = vol;
        this.media.volume = this.volume*0.1;
        return this;
    },
});

//SoundElement(WebAudio/tmlibAsset)
tm.define("shotgun.SoundElement_WebAudio", {
    superClass: shotgun.SoundElement,

    init: function(name) {
        this.superInit(MEDIA_ASSET, name);
        this.media = tm.asset.AssetManager.get(name);
        if (!this.media) console.warn("asset not found. "+name);
    },

    play: function(loop) {
        if (!this.media) return this;
        this.media.loop = loop;
        this.media.play();
        return this;
    },

    playClone: function() {
        if (!this.media) return this;
        this.media.loop = false;
        this.media.clone().play();
        return this;
    },
});

//SoundElement(CordovaMediaPlugin)
tm.define("shotgun.SoundElement_CordovaMedia", {
    superClass: shotgun.SoundElement,

    init: function(name, url) {
        this.superInit(MEDIA_CORDOVA, name, cordovaPath()+url);

        var that = this;
        this.media = new Media(this.url,
            function(){
                that.status="OK";
                that.message = "OK:"+that.url;
//                AdvanceAlert(that.message);
            },
            function(err){
                that.status="NG";
                that.message = "NG:"+err.message+":"+that.url;
//                AdvanceAlert(that.message);
            });
    },

    play: function(loop) {
        if (!this.media) return this;
        if (loop) {
            this.media.play({numberOfLoops:9999, playAudioWhenScreenIsLocked : false});
        } else {
            this.media.play({playAudioWhenScreenIsLocked : false});
        }
        return this;
    },

    playClone: function() {
        if (!this.media) return this;
        var tmp = new Media(this.url);
        tmp.play();
        tmp = null;
        return this;
    },
});

//SoundElement(LowLatencyAudioPlugin)
tm.define("shotgun.SoundElement_LLA", {
    superClass: shotgun.SoundElement,
    lla: null,
    init: function(name, url) {
        this.superInit(MEDIA_LLA, name, url);

        if (window.plugins && window.plugins.LowLatencyAudio) {
            this.lla = window.plugins.LowLatencyAudio;
            var that = this;
            this.lla.preloadAudio(this.name, url, this.volume*0.1, 1,
                function(msg){
                    that.status="OK";
                    that.message = "OK:"+that.url;
//                    AdvanceAlert(that.message);
                },
                function(msg){
                    that.status="NG";
                    that.message = "NG:"+msg+":"+that.url;
//                    AdvanceAlert(that.message);
                });
        }
    },

    play: function(loop) {
        if (!this.lla) return this;
        if (loop) {
            this.lla.loop(this.name);
        } else {
            this.lla.play(this.name);
        }
        return this;
    },

    playClone: function() {
        if (!this.lla) return this;
        this.lla.play(this.name);
        return this;
    },

    stop: function() {
        if (!this.lla) return this;
        this.lla.stop(this.name);
        return this;
    },

    pause: function () {
        if (!this.lla) return this;
        this.lla.stop(this.name);
    },

    setVolume: function(vol) {
        if (!this.lla) return this;
        return this;
        if (vol === undefined) vol = 1;
        this.volume = vol;
        this.lla.unload(this.name);
        this.lla.preloadAudio(this.name, url, this.volume*0.1, 1,
            function(msg){
                that.status="OK";
                that.message = "OK:"+url;
//                AdvanceAlert(that.message);
            },
            function(msg){
                that.status="NG";
                that.message = "NG:"+msg+":"+url;
//                AdvanceAlert(that.message);
            });
        return this;
    },
});
