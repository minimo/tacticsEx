/*
 *  SettingScene.js
 *  2015/03/10
 *  @auther minimo  
 *  This Program is MIT license.
 *
 */

tm.define("tactics.SettingScene", {
    superClass: tm.app.Scene,

    bgm: null,
    se: null,

    //ラベル用フォントパラメータ
    headerParam: {fontFamily:"Orbitron", align: "center", baseline:"middle", outlineWidth:2 },
    labelParam:  {fontFamily:"Orbitron", align: "center", baseline:"middle", outlineWidth:2 },

    init: function() {
        this.superInit();
        this.background = "rgba(0, 0, 0, 0.0)";
        var that = this;

        //バックグラウンド
        this.bg = tm.display.RectangleShape({width: SC_W, height: SC_H, fillStyle: appMain.bgColor, strokeStyle: appMain.bgColor})
            .addChildTo(this)
            .setPosition(SC_W*0.5, SC_H*0.5);

        tm.display.OutlineLabel("OPTION", 60)
            .addChildTo(this)
            .setParam(this.headerParam)
            .setPosition(SC_W*0.5, SC_H*0.07);

        tm.display.OutlineLabel("SOUND SETTING", 40)
            .addChildTo(this)
            .setParam(this.labelParam)
            .setPosition(SC_W*0.5, SC_H*0.15);

        //言語選択
        tm.display.OutlineLabel("LANGUAGE", 40)
            .addChildTo(this)
            .setParam(this.labelParam)
            .setPosition(SC_W*0.5, SC_H*0.50);
        var width = 250, height = 90;
        this.japanese = tactics.ToggleButton(width, height, "日本語", "日本語", {flat: appMain.buttonFlat, fontSize:40})
            .addChildTo(this)
            .setPosition(SC_W*0.25, SC_H*0.57)
            .addEventListener("pushed", function() {
                if (this.toggleON) {
                    appMain.language = "JAPANESE";
                    that.english.toggleON = false;
                }
                this.toggleON = true;
            });
        this.english = tactics.ToggleButton(width, height, "English", "English", {flat: appMain.buttonFlat, fontSize:40})
            .addChildTo(this)
            .setPosition(SC_W*0.75, SC_H*0.57)
            .addEventListener("pushed", function() {
                if (this.toggleON) {
                    appMain.language = "ENGLISH";
                    that.japanese.toggleON = false;
                }
                this.toggleON = true;
            });
        if (appMain.language == "JAPANESE") {
            this.japanese.toggleON = true;
            this.english.toggleON = false;
        } else {
            this.japanese.toggleON = false;
            this.english.toggleON = true;
        }

        //戻るボタン
        var width = SC_W, height = 100;
        tactics.Button(width, height, "RETURN TO TITLE", {flat: appMain.buttonFlat, fontSize:50})
            .addChildTo(this)
            .setPosition(SC_W*0.5, SC_H*0.85)
            .addEventListener("pushed", function() {
                that.mask.tweener.clear().fadeOut(200);
                appMain.saveConfig();
                appMain.popScene();
            });

        //目隠し
        this.mask = tm.display.RectangleShape({width: SC_W, height: SC_H, fillStyle: "rgba(0, 0, 0, 1.0)", strokeStyle: "rgba(0, 0, 0, 1.0)"})
            .addChildTo(this)
            .setPosition(SC_W*0.5, SC_H*0.5)
        this.mask.tweener.clear().fadeOut(200);

        this.time = 0;
    },

    setVolumeBGM: function(vol) {
        if (vol != appMain.volumeBGM) {
            appMain.pauseBGM();
            appMain.setVolumeBGM(vol);
            appMain.resumeBGM();
        }
        for (var i = 0; i < 10; i++) {
            this.bgm[i].setFrameIndex(52).setScale(0.3);
            if (i == vol-1) {
                this.bgm[i].remove().addChildTo(this);
                this.bgm[i].setFrameIndex(i).setScale(0.5);
            } else {
                this.bgm[i].setFrameIndex(52).setScale(0.3);
            }
        }
    },

    setVolumeSE: function(vol) {
        if (vol != appMain.volumeSE) {
            appMain.setVolumeSE(vol);
            appMain.playSE("hand");
        }
        for (var i = 0; i < 10; i++) {
            this.se[i].setFrameIndex(53).setScale(0.3);
            if (i == vol-1) {
                this.se[i].remove().addChildTo(this);
                this.se[i].setFrameIndex(i+13*3).setScale(0.5);
            } else {
                this.se[i].setFrameIndex(53).setScale(0.3);
            }
        }
    },

    update: function() {
        this.time++;
    },

/*
    onresume: function() {
        if (this.dialog.answer == true) {
            appMain.highScore[GAMEMODE_NORMAL] = 0;
            appMain.highScore[GAMEMODE_NORMAL+10] = 0;
            appMain.highScore[GAMEMODE_HARD] = 0;
            appMain.highScore[GAMEMODE_HARD+10] = 0;
            this.dialog.answer = false;
        }
    },
*/
    //タッチorクリック開始処理
    ontouchstart: function(e) {
    },

    //タッチorクリック移動処理
    ontouchmove: function(e) {
        var sx = e.pointing.x;
        var sy = e.pointing.y;

        sx += 22;
        if (SC_W*0.10 < sx && sx < SC_W*0.25+440) {
            sx -= SC_W*0.25;
            var x = ~~(sx/44)+1;
            //ＢＧＭボリューム
            if ( SC_H*0.2 < sy && sy < SC_H*0.3) {
                if (sx < 0) {
                    this.setVolumeBGM(0);
                } else {
                    this.setVolumeBGM(x);
                }
            }

            //ＳＥボリューム
            if ( SC_H*0.3 < sy && sy < SC_H*0.4) {
                if (sx < 0) {
                    this.setVolumeSE(0);
                } else {
                    this.setVolumeSE(x);
                }
            }
        }
    },

    //タッチorクリック終了処理
    ontouchend: function(e) {
    },
});


