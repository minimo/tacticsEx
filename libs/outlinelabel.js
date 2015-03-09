/*
 * OutlineLabel.js
 */

tm.display = tm.display || {};

(function() {

    /**
     * @class tm.display.OutlineLabel
     * システムフォントを描画するクラス（アウトライン付き）
     * @extends tm.display.CanvasElement
     */
    tm.display.OutlineLabel = tm.createClass({
        superClass: tm.display.CanvasElement,

        //縁取り分を含めたラベル配列
        labels: null,
        
        //アウトラインの幅
        _outlineWidth: 1,

        /**
         * @constructor
         */
        init: function(text, size) {
            this.superInit();

            this.outlineColor = "black";

            //アウトライン作成
            this.labels = [];
            var n = 0;
            for (var i = -1; i < 2; i++) {
                for (var j = -1; j < 2; j++) {
                    this.labels[n] = tm.display.Label(text, size);
                    this.labels[n].setPosition(i * this.outlineWidth, j * this.outlineWidth);
                    if (i == 0 && j == 0){
                        this.labels[n].fillStyle = 'white';
                    } else {
                        this.labels[n].fillStyle = 'black';
                        this.labels[n].addChildTo(this);
                    }
                    n++;
                }
            }
            //真ん中は一番後に追加
            this.labels[4].addChildTo(this);
        },

        setAlign: function(align) {
            this.align = align;
            return this;
        },

        setBaseline: function(baseline) {
            this.baseline = baseline;
            return this;
        },
        
        setFontSize: function(size) {
            this.fontSize = size;
            return this;
        },
        
        setFontFamily: function(family) {
            this.fontFamily = family;
            return this;
        },

        setFontWeight: function(weight) {
            this.fontWeight = weight;
            return this;
        },

        setBlendMode: function(blendMode) {
            this.blendMode = blendMode;
            return this;
        },

        setFillStyle: function(fillStyle) {
            this.fillStyle = fillStyle;
            return this;
        },

        setFillStyleOutline: function(fillStyle) {
            this.fillStyleOutline = fillStyle;
            return this;
        },

        setOutlineWidth: function(width) {
            this.outlineWidth = width;
            return this;
        },

        //パラメータ一括セット
        setParam: function(param) {
            this.fontFamily       = param.fontFamily       || this.fontFamily;
            this.align            = param.align            || this.align;
            this.baseline         = param.baseline         || this.baseline;
            this.fontSize         = param.fontSize         || this.fontSize
            this.fontWeight       = param.fontWeight       || this.fontWeight;
            this.fillStyle        = param.fillStyle        || this.fillStyle;
            this.fillStyleOutline = param.fillStyleOutline || this.fillStyleOutline;
            this.outlineWidth     = param.outlineWidth     || this.outlineWidth;
            return this;
        },
    });

    /**
     * @property    text
     * 文字
     */
    tm.display.OutlineLabel.prototype.accessor("text", {
        "get": function() { return this.labels[0].text; },
        "set": function(v){
            if (v == null || v == undefined) {
                for (var i = 0; i < 9; i++)this.labels[i].text = "";
            } else {
                for (var i = 0; i < 9; i++)this.labels[i].text = v;
            }
        }
    });

    /**
     * @property    fontSize
     * フォントサイズ
     */
    tm.display.OutlineLabel.prototype.accessor("fontSize", {
        "get": function() { return this.labels[0].fontSize; },
        "set": function(v) {
            for (var i = 0; i < 9; i++)this.labels[i].fontSize = v;
        }
    });

    /**
     * @property    fontFamily
     * フォント
     */
    tm.display.OutlineLabel.prototype.accessor("fontFamily", {
        "get": function() { return this.labels[0].fontFamily; },
        "set": function(v){
            for (var i = 0; i < 9; i++)this.labels[i].fontFamily = v;
        }
    });

    /**
     * @property    fontWeight
     */
    tm.display.OutlineLabel.prototype.accessor("fontWeight", {
        "get": function() { return this.labels[0].fontWeight; },
        "set": function(v) {
            for (var i = 0; i < 9; i++)this.labels[i].fontWeight = v;
        },
    });

    /**
     * @property lineHeight
     */
    tm.display.OutlineLabel.prototype.accessor("lineHeight", {
        "get": function() { return this.labels[0].lineHeight; },
        "set": function(v) {
            for (var i = 0; i < 9; i++)this.labels[i].lineHeight = v;
        },
    });

    /**
     * @property fillStyle
     */
    tm.display.OutlineLabel.prototype.accessor("fillStyle", {
        "get": function() { return this.labels[4].fillStyle; },
        "set": function(fillStyle) {
            this.labels[4].fillStyle = fillStyle;
        },
    });

    /**
     * @property fillStyleOutline
     */
    tm.display.OutlineLabel.prototype.accessor("fillStyleOutline", {
        "get": function() { return this.labels[0].fillStyle; },
        "set": function(fillStyle) {
            for (var i = 0; i < 9; i++) {
                if (i != 4)this.labels[i].fillStyle = fillStyle;
            }
        },
    });

    /**
     * @property    align
     */
    tm.display.OutlineLabel.prototype.accessor("align", {
        "get": function() { return this.labels[0].align; },
        "set": function(align) {
            for (var i = 0; i < 9; i++)this.labels[i].align = align;
        }
    });

    /**
     * @property    baseline
     */
    tm.display.OutlineLabel.prototype.accessor("baseline", {
        "get": function() { return this.labels[0].baseline; },
        "set": function(baseline) {
            for (var i = 0; i < 9; i++)this.labels[i].baseline = baseline;
        }
    });

    /**
     * @property    blendMode
     */
    tm.display.OutlineLabel.prototype.accessor("blendMode", {
        "get": function() { return this.labels[4].blendMode; },
        "set": function(blendMode) {
            for (var i = 0; i < 9; i++)this.labels[i].blendMode = blendMode;
        }
    });

    /**
     * @property    alpha
     */
    tm.display.OutlineLabel.prototype.accessor("alpha", {
        "get": function() { return this.labels[4].alpha; },
        "set": function(alpha) {
            for (var i = 0; i < 9; i++)this.labels[i].alpha = alpha;
        }
    });

    /**
     * @property    visible
     */
    tm.display.OutlineLabel.prototype.accessor("visible", {
        "get": function() { return this.labels[0].visible; },
        "set": function(visible) {
            for (var i = 0; i < 9; i++)this.labels[i].visible = visible;
        }
    });

    /**
     * @property    outlineWidth
     *              縁取り幅
     */
    tm.display.OutlineLabel.prototype.accessor("outlineWidth", {
        "get": function() { return this._outlineWidth; },
        "set": function(width) {
            this._outlineWidth = width;
            var n = 0;
            for (var i = -1; i < 2; i++) {
                for (var j = -1; j < 2; j++) {
                    this.labels[n].setPosition(i * this._outlineWidth, j * this._outlineWidth);
                    n++;
                }
            }
        }
    });

    /**
     * @property    shadowBlur
     */
    tm.display.OutlineLabel.prototype.accessor("shadowBlur", {
        "get": function() { return this.labels[4].shadowBlur; },
        "set": function(shadowBlur) {
           for (var i = 0; i < 9; i++)this.labels[i].shadowBlur = shadowBlur;
//           this.labels[4].shadowBlur = shadowBlur;
        }
    });

    /**
     * @property    shadowColoe
     */
    tm.display.OutlineLabel.prototype.accessor("shadowColor", {
        "get": function() { return this.labels[4].shadowColor; },
        "set": function(shadowColor) {
            for (var i = 0; i < 9; i++)this.labels[i].shadowColor = shadowColor;
//            this.labels[4].shadowColor = shadowColor;
        }
    });

    //パラメータ一括セット
    tm.display.Label.prototype.setParam = function(param) {
        this.fontFamily       = param.fontFamily       || this.fontFamily;
        this.align            = param.align            || this.align;
        this.baseline         = param.baseline         || this.baseline;
        this.fontSize         = param.fontSize         || this.fontSize
        this.fontWeight       = param.fontWeight       || this.fontWeight;
        this.fillStyle        = param.fillStyle        || this.fillStyle;
        return this;
    }

})();
