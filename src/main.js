/*
 *  main.js
 *  2015/03/10
 *  @auther minimo  
 *  This Program is MIT license.
 */
 
//乱数発生器
mt = new MersenneTwister();
var rand = function(min, max) { return mt.nextInt(min, max); };    //乱数発生

//フレームレート
fps = 30;
var sec = function(s) { return ~~(fps * s);}    //秒からフレーム数へ変換

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

//マップチップサイズ
MAPCHIP_WIDTH = 64;
MAPCHIP_HEIGHT = 32;
MAPCHIP_SCALE = 2;

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

//表示レイヤー
LAYER_SYSTEM = 8;           //システム表示
LAYER_FOREGROUND = 7;       //フォアグラウンド
LAYER_EFFECT_UPPER = 6;     //エフェクト上位
LAYER_MAPOBJ_UPPER = 5;     //マップオブジェクト上位
LAYER_UNIT = 4;             //ユニット
LAYER_MAPOBJ_LOWEE = 3;     //マップオブジェクト下位
LAYER_EFFECT_LOWER = 2;     //エフェクト下位
LAYER_MAP = 1;              //マップ
LAYER_BACKGROUND = 0;       //バックグラウンド

//ユニット、砦タイプ
TYPE_NEUTRAL = 0;
TYPE_PLAYER = 1;
TYPE_ENEMY = 2;

//コントロールフラグ
CTRL_NOTHING = 0;
CTRL_MAP = 1;
CTRL_FORT = 2;
CTRL_UNIT = 3;
CTRL_RATE = 4;
CTRL_SCALE = 5;
CTRL_ALLFORTS = 6;
CTRL_MENU = 7;
CTRL_IGNORE = 99;

//インスタンス
appMain = {};

//アプリケーションメイン
tm.main(function() {
    appMain = tactics.CanvasApp("#world");
    appMain.enableStats();
    appMain.run();
});
