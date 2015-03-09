/*
 *  Telop.js
 *  2015/02/05
 *  @auther minimo  
 *  This Program is MIT license.
 */

//メッセージテロップ表示
tm.define("shotgun.Telop", {
    superClass: tm.app.Object2D,

    //テロップメッセージキュー
    queue: [],
    sound: "achievement",

    //終了フラグ
    finish: false,

    init: function(wait, alpha) {
        this.superInit();
        wait = wait || 1000;
        alpha = alpha || 0.5;

        this.bg = tm.display.RectangleShape({width:SC_W, height:70, fillStyle:"rgba(0,0,0,{0})".format(alpha), strokeStyle:"rgba(0,0,0,{0})".format(alpha)})
            .addChildTo(this)
            .setAlpha(0);
        this.bg.tweener.clear().wait(wait).fadeIn(100);

        this.textLabel = tm.display.OutlineLabel("", 30)
            .addChildTo(this)
            .setPosition(SC_W, 0);
        this.textLabel.tweener.clear().wait(wait);
    },

    update: function() {
        if (this.queue.length == 0 && !this.finish) {
            this.finish = true;
            this.bg.tweener.clear()
                .fadeOut(100)
                .call(function(){
                    this.remove();
                }.bind(this));
        }
    },

    add: function(param) {
        param = param || {};
        var defParam = {
            text: "Test message",
            size: 30,
            dispWait: 1500,
            silent: false,
        };
        param.$safe(defParam);

        this.queue.push({text:param.text, size:param.size, dispWait:param.dispWait, silent: param.silent});

        var that = this;
        this.textLabel.tweener
            .call(function() {
                this.setPosition(SC_W, 0);
                this.text = that.queue[0].text;
                this.fontSize = that.queue[0].size;
                if(!that.queue[0].silent) appMain.playSE(that.sound);
            }.bind(this.textLabel))
            .move(0, 0, 250, "easeInOutSine")
            .wait(param.dispWait)
            .move(-SC_W, 0, 250, "easeInOutSine")
            .call(function() {
                that.queue.splice(0, 1);
            }.bind(this.textLabel));
    },
});
