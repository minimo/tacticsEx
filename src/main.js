/*
 *  main.js
 *  2015/03/10
 *  @auther minimo  
 *  This Program is MIT license.
 */
 
//乱数発生器
mt = new MersenneTwister();
var rand = function(min, max) { return mt.nextInt(min, max); };    //乱数発生

//定数
//デバッグフラグ
DEBUG = false;

//チートコマンド有効フラグ
CHEAT = false;

//実績対応有効フラグ
ENABLE_ACHIEVEMENT = true;

//スクリーンサイズ
SC_W = 1136;
SC_H = 640;

//ゲームモード
GAMEMODE_PRACTICE = 0;
GAMEMODE_NORMAL = 1;
GAMEMODE_HARD = 2;

//Use MEDIA TYPE
MEDIA_ASSET = 0;    //tmlib Asset
MEDIA_CORDOVA = 1;  //CordovaMediaPlugin
MEDIA_LLA = 2;      //LawLatencyAudioPlugin

//デフォルトメディアタイプ
MEDIA_DEFAULT = MEDIA_ASSET;

//フレームレート
fps = 60;
var sec = function(s) { return ~~(fps * s);}    //秒からフレーム数へ変換

//表示レイヤー
LAYER_SYSTEM = 6;           //システム表示
LAYER_FOREGROUND = 5;       //フォアグラウンド
LAYER_EFFECT_UPPER = 4;     //エフェクト上位
LAYER_UNIT = 3;             //ユニット
LAYER_EFFECT_LOWER = 2;     //エフェクト下位
LAYER_PLANET = 1;           //惑星
LAYER_BACKGROUND = 0;       //バックグラウンド

//インスタンス
appMain = {};

//アプリケーションメイン
tm.main(function() {
    appMain = tactics.CanvasApp("#world");
    appMain.enableStats();
    appMain.run();
});
