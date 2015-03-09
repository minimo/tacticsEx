/*
 * math.js
 *
 * Google Closure Compiler最適化用
 */

tiger.math = {};

(function() {
    
    /**
     * @class Math
     * 数学
     */
    
    /**
     * クランプ
     */
    tiger.math.clamp = function(x, a, b) {
//        return ( Math.max( Math.min(x, ), min ) )
        return (x < a) ? a : ( (x > b) ? b : x );
    };
    
    /**
     * @property    DEG_TO_RAD
     * Degree to Radian.
     */
    tiger.math.DEG_TO_RAD = Math.PI/180;
    
    
    /**
     * @property    RAD_TO_DEG
     * Radian to Degree.
     */
    tiger.math.RAD_TO_DEG = 180/Math.PI;
    
    /**
     * @method
     * Degree を Radian に変換
     */
    tiger.math.degToRad = function(deg) {
        return deg * tiger.math.DEG_TO_RAD;
    };
    
    /**
     * @method
     * Radian を Degree に変換
     */
    tiger.math.radToDeg = function(rad) {
        return rad * tiger.math.RAD_TO_DEG;
    };
    
    
    
    /**
     * @method
     * ランダムな値を指定された範囲内で生成
     */
    tiger.math.rand = function(min, max) {
        return window.Math.floor( window.Math.random()*(max-min+1) ) + min;
    };
    
    /**
     * @method
     * ランダムな値を指定された範囲内で生成
     */
    tiger.math.randf= function(min, max) {
        return window.Math.random()*(max-min)+min;
    };

    /**
     * @method
     * 長さを取得
     */
    tiger.math.magnitude = function() {
        return Math.sqrt(tiger.math.magnitudeSq.apply(null, arguments));
    };
    
    
    /**
     * @method
     * 長さの２乗を取得
     */
    tiger.math.magnitudeSq = function() {
        var n = 0;
        
        for (var i=0,len=arguments.length; i<len; ++i) {
            n += arguments[i]*arguments[i];
        }
        
        return n;
    };


    /**
     * @method
     * a <= x <= b のとき true を返す
     */
    tiger.math.inside = function(x, a, b) {
        return (x >= a) && (x) <= b;
    };
    
})();

