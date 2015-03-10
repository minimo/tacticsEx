/*
 * math.js
 *
 * Google Closure Compiler最適化用
 */

tactics.math = {};

(function() {
    
    /**
     * @class Math
     * 数学
     */
    
    /**
     * クランプ
     */
    tactics.math.clamp = function(x, a, b) {
//        return ( Math.max( Math.min(x, ), min ) )
        return (x < a) ? a : ( (x > b) ? b : x );
    };
    
    /**
     * @property    DEG_TO_RAD
     * Degree to Radian.
     */
    tactics.math.DEG_TO_RAD = Math.PI/180;
    
    
    /**
     * @property    RAD_TO_DEG
     * Radian to Degree.
     */
    tactics.math.RAD_TO_DEG = 180/Math.PI;
    
    /**
     * @method
     * Degree を Radian に変換
     */
    tactics.math.degToRad = function(deg) {
        return deg * tactics.math.DEG_TO_RAD;
    };
    
    /**
     * @method
     * Radian を Degree に変換
     */
    tactics.math.radToDeg = function(rad) {
        return rad * tactics.math.RAD_TO_DEG;
    };
    
    
    
    /**
     * @method
     * ランダムな値を指定された範囲内で生成
     */
    tactics.math.rand = function(min, max) {
        return window.Math.floor( window.Math.random()*(max-min+1) ) + min;
    };
    
    /**
     * @method
     * ランダムな値を指定された範囲内で生成
     */
    tactics.math.randf= function(min, max) {
        return window.Math.random()*(max-min)+min;
    };

    /**
     * @method
     * 長さを取得
     */
    tactics.math.magnitude = function() {
        return Math.sqrt(tactics.math.magnitudeSq.apply(null, arguments));
    };
    
    
    /**
     * @method
     * 長さの２乗を取得
     */
    tactics.math.magnitudeSq = function() {
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
    tactics.math.inside = function(x, a, b) {
        return (x >= a) && (x) <= b;
    };
    
})();

