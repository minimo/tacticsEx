/*
 *  language.js
 *  2014/10/23
 *  @auther minimo  
 *  This Program is MIT license.
 */

//言語変換
var $trans = function(text) {
    var ret = languagePack[text];
    if (ret) {
        var retText = ret[appMain.language];
        return retText?retText:text;
    }
    return text;
}

var languagePack = {

    //Tutorial
    "ショットガンポーカーの遊び方": {
        "ENGLISH": "How to play Shotgun Poker."
    },
    "スキップしたい場合は右上の": {
        "ENGLISH": "If you skip this tutorial."
    },
     "SKIPボタンを押してください": {
        "ENGLISH": "Please press SKIP button."
    },
    "制限時間内にカードを５枚選んで": {
        "ENGLISH": "Please make the hand of poker to"
    },
    "ポーカーの役を作ってください": {
        "ENGLISH": "choose 5 cards within the time limit."
    },
    "完成した役に応じた": {
        "ENGLISH": "Score is obtained in accor-"
    },
    "得点が入ります": {
        "ENGLISH": "dance with the finished hand."
    },
    "場のカードが少なくなると": {
        "ENGLISH": "The field of the card is reduced"
    },
    "カード補充してシャッフルされます": {
        "ENGLISH": "by the card replenished are shuffled."
    },
    "また、横に大きくスワイプすると": {
        "ENGLISH": "Can be made by the lateral to"
    },
    "カードのシャッフルが出来ます": {
        "ENGLISH": "increase swipe card shuffle."
    },
    "役無し、時間切れはミスとなり": {
        "ENGLISH": "No pair, expired becomes a mistake."
    },
    "左上のライフが一つ減ります": {
        "ENGLISH": "You upper left of life is reduced one."
    },
    "ワンペアが２回続いた場合も": {
        "ENGLISH": "It becomes a miss even if one"
    },
    "ミスとなります": {
        "ENGLISH": "pair was followed by twice."
    },
    "ライフが０の状態でミスすると": {
        "ENGLISH": "The game is over when you miss"
    },
    "ゲームオーバーです": {
        "ENGLISH": "in the state of life is not."
    },
    "以上でチュートリアルは終了です": {
        "ENGLISH": "This completes the tutorial above."
    },

    //GameCenter warning
    "GameCenterに接続できませんでした": {
        "ENGLISH": "I failed to access the GAMECENTER."
    },

    //GameOver Ad telop
    "Adボタンで広告を見るとライフ１個ボーナス！": {
        "ENGLISH": "View ad 'Ad' button and life one bonus !"
    },

    //Poker Hand
    "THREE CARD": {
        "ENGLISH": "THREE OF A KIND"
    },
    "FOUR CARD": {
        "ENGLISH": "FOUR OF A KIND"
    },
    "FIVE CARD": {
        "ENGLISH": "FIVE OF A KIND"
    },
    "R.STRAIGHT FLUSH": {
        "ENGLISH": "ROYAL FLUSH"
    },
    "ワンペア": {
        "ENGLISH": "One Pair"
    },
    "ツーペア": {
        "ENGLISH": "Two Pair"
    },
    "スリーカード": {
        "ENGLISH": "Three of a Kind"
    },
    "フォーカード": {
        "ENGLISH": "Four of a Kind"
    },
    "ファイブカード": {
        "ENGLISH": "Five of a Kind"
    },
    "フラッシュ": {
        "ENGLISH": "Flush"
    },
    "ストレート": {
        "ENGLISH": "Straight"
    },
    "フルハウス": {
        "ENGLISH": "Full House"
    },
    "ストレートフラッシュ": {
        "ENGLISH": "Straight Flush"
    },
    "ロイヤルストレートフラッシュ": {
        "ENGLISH": "Royal Flush"
    },

    //Achievement
    "実績「": {
        "ENGLISH": "Achievement '"
    },
    "」が解除されました": {
        "ENGLISH": "' unlocked."
    },

    //AchievementList
    "ワンペアを成立させた": {
        "ENGLISH": "You've passed a One Pair."
    },
    "ツーペアを成立させた": {
        "ENGLISH": "You've passed a Two Pair."
    },
    "スリーカードを成立させた": {
        "ENGLISH": "You've passed a Three of a Kind."
    },
    "フォーカードを成立させた": {
        "ENGLISH": "You've passed a Four of a Kind."
    },
    "ファイブカードを成立させた": {
        "ENGLISH": "You've passed a Five of a Kind."
    },
    "フラッシュを成立させた": {
        "ENGLISH": "You've passed a Flush."
    },
    "ストレートを成立させた": {
        "ENGLISH": "You've passed a Straight."
    },
    "フルハウスを成立させた": {
        "ENGLISH": "You've passed a Full House."
    },
    "ストレートフラッシュを成立させた": {
        "ENGLISH": "You've passed a Straight Flush."
    },
    "ロイヤルストレートフラッシュを成立させた": {
        "ENGLISH": "You've passed a Royal Flush."
    },

    "ノーマルモード": {
        "ENGLISH": "Normal"
    },
    "ノーマルモードでゲームをスタートした": {
        "ENGLISH": "You started the game in Normal."
    },
    "ハードモード": {
        "ENGLISH": "Normal"
    },
    "ハードモードでゲームをスタートした": {
        "ENGLISH": "You started the game in Hard."
    },
    "コンプリート": {
        "ENGLISH": "Complete"
    },
    "１ゲーム内でファイブカード以外の全役を成立させた": {
        "ENGLISH": "You passed a whole hands of non Five of a Kind in one game."
    },
    "グランドスラム": {
        "ENGLISH": "Gramd Slam"
    },
    "１ゲーム内で全ての役を成立させた": {
        "ENGLISH": "I was met all of the role in one game."
    },

    "１０００ＰＴＳ": {
        "ENGLISH": "1000pts"
    },
    "スコアが１０００ＰＴＳを超えた": {
        "ENGLISH": "Score exceeds the 1000PTS."
    },
    "５０００ＰＴＳ": {
        "ENGLISH": "5000pts"
    },
    "スコアが５０００ＰＴＳを超えた": {
        "ENGLISH": "Score exceeds the 5000PTS."
    },
    "１００００ＰＴＳ": {
        "ENGLISH": "10000pts"
    },
    "スコアが１００００ＰＴＳを超えた": {
        "ENGLISH": "Score exceeds the 10000PTS."
    },
    "２００００ＰＴＳ": {
        "ENGLISH": "20000pts"
    },
    "スコアが２００００ＰＴＳを超えた": {
        "ENGLISH": "Score exceeds the 20000PTS."
    },
    "ポーカー上級者": {
        "ENGLISH": "Poker senior"
    },
    "ハードモードで２０００ＰＴＳを超えた": {
        "ENGLISH": "Score exceeds the 2000pts in Hard mode."
    },
    "ポーカーマスター": {
        "ENGLISH": "Master of Poker"
    },
    "ハードモードで５０００ＰＴＳを超えた": {
        "ENGLISH": "Score exceeds the 5000pts in Hard mode."
    },
    "ポーカー神": {
        "ENGLISH": "The God of Poker"
    },
    "ハードモードで１００００ＰＴＳを超えた": {
        "ENGLISH": "Score exceeds the 10000pts in Hard mode."
    },

    "１－２－３": {
        "ENGLISH": "1-2-3"
    },
    "ワンペア、ツーペア、スリーカードの順で役を成立させた": {
        "ENGLISH": "One Pair, Two Pair, You was passed a hand in the order of Three of a Kind."
    },
    "１－２－３－４": {
        "ENGLISH": "1-2-3-4"
    },
    "ワンペア、ツーペア、スリーカード、フォーカードの順で役を成立させた": {
        "ENGLISH": "One Pair, Two Pair, Three of a Kind, You was passed a hand in the order of Four of a Kind."
    },
    "恋の２－４－１１": {
        "ENGLISH": "Love 2-4-11"
    },
    "役が成立した手札の中に２、４、Ｊがあった": {
        "ENGLISH": "2,4 in the hand that winning combination has been established, there was a J."
    },
    "スリーセブン": {
        "ENGLISH": "Triple 7"
    },
    "７のスリーカードを成立させた": {
        "ENGLISH": "You've passed a Three of a Kind."
    },
    "ダブルロイヤル": {
        "ENGLISH": "Double Royal"
    },
    "ロイヤルストレートフラッシュを２回連続で成立させた": {
        "ENGLISH": "Royal Flush You was established in two consecutive."
    },
};
