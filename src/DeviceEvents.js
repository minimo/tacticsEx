/*
 *  DeviceEvents.js
 *  2014/07/15
 *  @auther minimo  
 *  This Program is MIT license.
 */

//実行ＯＳ種別
DEVICE_IOS = false;
DEVICE_ANDROID = false;

//定数
//PhoneGap使用可能フラグ
ENABLE_PHONEGAP = false;
DEBUG_PHONEGAP = false;

//GAMECENTER(GooglePlay)使用可能フラグ
ENABLE_GAMECENTER = false;
DEBUG_GAMECENTER = false;

//AdMob使用可能フラグ
ENABLE_ADMOB = false;
DEBUG_ADMOB = false;
TEST_ADMOB = false;

//Social Message
ENABLE_SOCIAL = false;

//PhoneGap Device Events
var onDeviceReady = function () {

    //使用ＯＳの判別
    DEVICE_IOS = ( /(android)/i.test(navigator.userAgent) )? false: true;
    if (!DEVICE_IOS) DEVICE_ANDROID = true;

    if (DEBUG_PHONEGAP) {
        AdvanceAlert('devicereadyイベントが発火しました');
        AdvanceAlert('Device:'+device.name+" "+device.platform);
    }

    ENABLE_PHONEGAP = true;

    //AdMob plugin
    if (AdMob) {
        var defaultOptions = {
            bannerId: admobid.banner,
            interstitialId: admobid.interstitial,
            position: AdMob.AD_POSITION.BOTTOM_CENTER,
            bgColor: 'black',
            isTesting: TEST_ADMOB,
            autoShow: true
        };
        AdMob.setOptions(defaultOptions);
        ENABLE_ADMOB = true;
    }

    //Game Center Plugin
    if (DEVICE_IOS) {
        gamecenter.auth(onGamecenterSuccess, onGamecenterFailure);
    }
    if (DEVICE_ANDROID) {
        googleplaygame.auth(onGamecenterSuccess, onGamecenterFailure);
    }

    //Social Message
    ENABLE_SOCIAL = true;
}

var onPause = function() {
    if (DEBUG_PHONEGAP) AdvanceAlert('pauseイベントが発火しました');

    //ゲーム中の場合ポーズシーンに移行
    var scene = appMain.currentScene;
    if (scene instanceof shotgun.MainScene && !scene.gameend) {
        appMain.pushScene(shotgun.PauseScene(scene));
    }
}

var onResume = function() {
    if (DEBUG_PHONEGAP) AdvanceAlert('resumeイベントが発火しました');

    //GAME CENTERに再度接続を行う
    if (DEVICE_IOS) {
        if (!ENABLE_GAMECENTER) {
            gamecenter.auth(onGamecenterSuccess, onGamecenterFailure);
        }
        return;
    }
    if (DEVICE_ANDROID) {
        if (!ENABLE_GAMECENTER) {
            googleplaygame.auth(onGamecenterSuccess, onGamecenterFailure);
        }
    }
}

var onOnline = function() {
    if (DEBUG_PHONEGAP) AdvanceAlert('onlineイベントが発火しました');
}

var onOffline = function() {
    if (DEBUG_PHONEGAP) AdvanceAlert('offlineイベントが発火しました');
}

//Phonegap Event listener
document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener('pause', onPause, false);
document.addEventListener('resume', onResume, false);
document.addEventListener('online', onOnline, false);
document.addEventListener('offline', onOffline, false);

/*
 *
 * iOS GameCenter
 * Android Google Play
 *
 */

// GAMECENTER CallBack
var onGamecenterSuccess = function() {
    if (DEBUG_GAMECENTER) AdvanceAlert('GameCenter connect success');
    ENABLE_GAMECENTER = true;
}

var onGamecenterFailure = function(result) {
    if (DEBUG_GAMECENTER) AdvanceAlert('GameCenterに接続できませんでした\n'+result);
    ENABLE_GAMECENTER = false;
}

//リーダーズボード参照
var showLeadersBoard = function(id) {
    id = id || "";

    if (DEVICE_IOS) {
        if (!ENABLE_PHONEGAP) {
            appMain.pushScene(shotgun.AlertDialog({
                height: SC_H*0.2,
                text1: "GameCenterに接続できませんでした",
                fontSize: 32,
                button: "OK"
            }));
            return false;
        }
        //GAMECENTERに接続してない場合は再接続
        if (!ENABLE_GAMECENTER) {
            gamecenter.auth(onGamecenterSuccess, onGamecenterFailure);

            //再接続失敗
            if (!ENABLE_GAMECENTER) {
                appMain.pushScene(shotgun.AlertDialog({
                    height: SC_H*0.2,
                    text1: "GameCenterに接続できませんでした",
                    fontSize: 32,
                    button: "OK"
                }));
                return false;
            }
        }

        gamecenter.showLeaderboard(function(){}, function(){}, {
            leaderboardId: id,
        });
        return true;
    }
    if (DEVICE_ANDROID) {
        if (id == "") {
            googleplaygame.showAllLeaderboards();
        } else {
            //IDをGooglePlay向けに変換
            if (id == "Normal_")    id = "CgkI-I-vk7YTEAIQAA";
            if (id == "Normal_RJ")  id = "CgkI-I-vk7YTEAIQAQ";
            if (id == "Hard_")      id = "CgkI-I-vk7YTEAIQAg";
            if (id == "Hard_RJ")    id = "CgkI-I-vk7YTEAIQAw";
            googleplaygame.showLeaderboard({
                leaderboardId: id,
            });
        }
        return true;
    }
}

//GameCenterにスコアを登録
var submitScore = function(mode, returnJoker, score) {
    if (!ENABLE_GAMECENTER) return false;
    if (DEVICE_IOS) {
        var id = "Normal_";
        if (mode == GAMEMODE_HARD) id = "Hard_";
        if (returnJoker) id += "RJ";
        gamecenter.submitScore(
            function() {
                if (DEBUG_GAMECENTER) AdvanceAlert('スコア登録に成功しました');
            },
            function() {
                if (DEBUG_GAMECENTER) AdvanceAlert('スコア登録に失敗しました');
            }, {
                score: score,
                leaderboardId: id,
            });
    }
    if (DEVICE_ANDROID) {
        var id = "";
        if (mode == GAMEMODE_NORMAL && !returnJoker) id = "CgkI-I-vk7YTEAIQAA";
        if (mode == GAMEMODE_NORMAL && returnJoker)  id = "CgkI-I-vk7YTEAIQAQ";
        if (mode == GAMEMODE_HARD   && !returnJoker) id = "CgkI-I-vk7YTEAIQAg";
        if (mode == GAMEMODE_HARD   && returnJoker)  id = "CgkI-I-vk7YTEAIQAw";
        googleplaygame.submitScore({
                score: score,
                leaderboardId: id,
            },
            function() {
                if (DEBUG_GAMECENTER) AdvanceAlert('スコア登録に成功しました');
            },
            function() {
                if (DEBUG_GAMECENTER) AdvanceAlert('スコア登録に失敗しました');
            });
    }
}

//GameCenterに実績登録
var reportAchievements = function(name, percent) {
    if (!ENABLE_GAMECENTER) return false;
    if (DEVICE_IOS) {
        gamecenter.reportAchievement(
            function(){
                if (DEBUG_GAMECENTER) AdvanceAlert('実績登録に成功しました');
            },
            function(){
                if (DEBUG_GAMECENTER) AdvanceAlert('実績登録に失敗しました');
            }, {
                achievementId: name,    //GameCenterは実績名とidが同一
                percent: "100"
            });
    }
    if (DEVICE_ANDROID) {
        if (shotgun.achievementList[name].id === undefined) return false;
        if (shotgun.achievementList[name].id == "") return false;
        googleplaygame.unlockAchievement({
                achievementId: shotgun.achievementList[name].id
            },
            function(){
                if (DEBUG_GAMECENTER) AdvanceAlert('実績登録に成功しました');
            },
            function(){
                if (DEBUG_GAMECENTER) AdvanceAlert('実績登録に失敗しました');
            });
    }
    return true;
}

//GameCenterの実績をリセット
var resetAchievements = function() {
    if (!ENABLE_GAMECENTER) return false;
    if (DEVICE_IOS) {
        gamecenter.resetAchievements(
            function(){
                if (DEBUG_GAMECENTER) AdvanceAlert('実績リセットに成功しました');
            },
            function(){
            if (DEBUG_GAMECENTER) AdvanceAlert('実績リセットに失敗しました');
            });
    }
    if (DEVICE_ANDROID) {
    }
}

/*
 *
 * AdMob
 *
 */

var ad_units = {
    ios : {
        banner:       'ca-app-pub-4753786498901311/3019381180', // or DFP format "/6253334/dfp_example_ad"
        interstitial: 'ca-app-pub-4753786498901311/7270571985'
//        banner: '/6253334/dfp_example_ad', // or DFP format "/6253334/dfp_example_ad"
//        interstitial: 'ca-app-pub-3940256099942544/4411468910'
    },
    android : {
        banner:       'ca-app-pub-4753786498901311/3019381180', // or DFP format "/6253334/dfp_example_ad"
        interstitial: 'ca-app-pub-4753786498901311/7270571985'
    }
};
// select the right Ad Id according to platform
var admobid = ( /(android)/i.test(navigator.userAgent) ) ? ad_units.android : ad_units.ios;

// AdMob CallBack
var onBannerLeaveApp = function(result) {
    if (DEBUG_ADMOB) AdvanceAlert('OnBannerLeaveApp\n'+result);
}

var onBannerDismiss = function(result) {
    if (DEBUG_ADMOB) AdvanceAlert('OnBannerDismiss\n'+result);
}

var onInterstitialPresent = function(result) {
    if (DEBUG_ADMOB) AdvanceAlert('onInterstitialPresent\n'+result);
}

var onInterstitialLeaveApp = function(result) {
    if (DEBUG_ADMOB) AdvanceAlert('onInterstitialLeaveApp\n'+result);
}

var onInterstitialDissmiss = function(result) {
    if (DEBUG_ADMOB) AdvanceAlert('onInterstitialDissmiss\n'+result);
}

//AdMob Event listener
document.addEventListener('onBannerLeaveApp', onBannerLeaveApp, false);
document.addEventListener('onBannerDismiss', onBannerDismiss, false);
document.addEventListener('onInterstitialPresent', onInterstitialPresent, false);
document.addEventListener('onInterstitialLeaveApp', onInterstitialLeaveApp, false);
document.addEventListener('onInterstitialDissmiss', onInterstitialDissmiss, false);

/*
 *
 * Social Message
 *
 */

//SNSにメッセージを送（ゲームオーバー時）
var sendSocialMessage = function(mode, returnJoker, score) {
    if (!ENABLE_SOCIAL) return false;

    //メッセージテキストの作成
    var lb = "Normal";
    if (mode == GAMEMODE_HARD) lb = "Hard";
    if (returnJoker) lb += "_RJ";

    var url = "https://itunes.apple.com/jp/app/shottoganpoka/id951249463";
    var text = "ShotgunPoker Score:"+score+"pts("+lb+")【"+url+"】 #ShotgunPoker #SGP_"+lb;
    var message = {
        text: text,
//        activityTypes: ["PostToTwitter"],
    };
    window.socialmessage.send(message);
}

//SNSにメッセージを送る（総合情報）
var sendSocialMessageGlobal = function() {
    if (!ENABLE_SOCIAL) return false;

    var score = 0;
    var mode = GAMEMODE_NORMAL;
    var returnJoker = false;

    //ベストスコアはどれか
    var sc1 = appMain.highScore[GAMEMODE_NORMAL];
    var sc2 = appMain.highScore[GAMEMODE_NORMAL+10];
    var sc3 = appMain.highScore[GAMEMODE_HARD];
    var sc4 = appMain.highScore[GAMEMODE_HARD+10];
    var sc = [sc1, sc2, sc3, sc4];
    score = sc[0];
    for (var i = 1; i < sc.length; i++) {
        if (score < sc[i]) score = sc[i];
    }
    if (score == sc[0]) {mode = GAMEMODE_NORMAL; returnJoker = false;}
    if (score == sc[1]) {mode = GAMEMODE_NORMAL; returnJoker = true;}
    if (score == sc[2]) {mode = GAMEMODE_HARD;   returnJoker = false;}
    if (score == sc[3]) {mode = GAMEMODE_HARD;   returnJoker = true;}

    //メッセージテキストの作成
    var lb = "Normal";
    if (mode == GAMEMODE_HARD) lb = "Hard";
    if (returnJoker) lb += "-RJ";

    var url = "https://itunes.apple.com/jp/app/shottoganpoka/id951249463";
    var text = "ShotgunPoker MyBestScore:"+score+"pts("+lb+")【"+url+"】 #ShotgunPoker #SGP_Best";
    var message = {
        text: text,
//        activityTypes: ["PostToTwitter"],
    };
    window.socialmessage.send(message);
}
