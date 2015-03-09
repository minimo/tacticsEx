/*
 *  main.js
 *  2014/06/19
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
SC_W = 640;
SC_H = 1136;

//カードサイズ
CARD_W = 140;
CARD_H = 210;
CARD_SCALE = 1;

//スート
SUIT_SPADE = 0;
SUIT_CLOVER = 1;
SUIT_DIAMOND = 2;
SUIT_HEART = 3;
SUIT_JOKER = 4;

//ゲームモード
GAMEMODE_PRACTICE = 0;
GAMEMODE_NORMAL = 1;
GAMEMODE_HARD = 2;

//シャッフルが発生する残りカード枚数
SHUFFLE_LIMIT = 25;

//ジョーカー使用フラグ
USE_JOKER = true;
RETURN_JOKER = false;   //使用したジョーカーを場に戻すか

//役一覧
MISS = -20;
NOPAIR = -10;
ONEPAIR = 10;
FLUSH = 20;
TWOPAIR = 50;
THREECARD = 100;
FULLHOUSE = 200;
STRAIGHT = 300;
FOURCARD = 500;
STRAIGHTFLUSH = 700;
FIVECARD = 800;
ROYALSTRAIGHTFLUSH = 1000;

//Use MEDIA TYPE
MEDIA_ASSET = 0;    //tmlib Asset
MEDIA_CORDOVA = 1;  //CordovaMediaPlugin
MEDIA_LLA = 2;      //LawLatencyAudioPlugin

//デフォルトメディアタイプ
MEDIA_DEFAULT = MEDIA_ASSET;

//フレームレート
fps = 30;
var sec = function(s) { return ~~(fps * s);}    //秒からフレーム数へ変換

//インスタンス
appMain = {};

//アプリケーションメイン
tm.main(function() {
    appMain = shotgun.CanvasApp("#world");
    appMain.createHandList();
    appMain.run();
});
