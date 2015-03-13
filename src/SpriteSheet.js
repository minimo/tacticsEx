/*
 *  SpriteSheet.js
 *  2015/03/13
 *  @auther minimo  
 *  This Program is MIT license.
 */
(function() {

tactics.SpriteSheet = {};

//スプライトシート作成
tactics.createSpriteSheet = function() {

    //騎士ユニット
    tactics.SpriteSheet.Knight = tm.asset.SpriteSheet({
        image: "knight",
        frame: {
            width: 64,
            height: 64,
            count: 32,
        },
        animations: {
            "stop_down": {
                frames:[0],
                next: "stop_down",
                frequency: 60,
            },
            "stop_up": {
                frames:[2],
                next: "stop_up",
                frequency: 60,
            },
            "walk_down": {
                frames:[4,5,6,7],
                next: "walk_down",
                frequency: 5,
            },
            "walk_up": {
                frames:[8,9,10,11],
                next: "walk_up",
                frequency: 5,
            },
            "attack_down": {
                frames:[12,13,14,15],
                next: "attack_down",
                frequency: 5,
            },
            "attack_up": {
                frames:[16,17,18,19],
                next: "attack_up",
                frequency: 5,
            },
        },
    });

    //モンスターユニット
    tactics.SpriteSheet.Monster = tm.asset.SpriteSheet({
        image: "monster",
        frame: {
            width: 64,
            height: 64,
            count: 32,
        },
        animations: {
            "stop_down": {
                frames:[0],
                next: "stop_down",
                frequency: 60,
            },
            "stop_up": {
                frames:[2],
                next: "stop_up",
                frequency: 60,
            },
            "walk_down": {
                frames:[4,5,6,7],
                next: "walk_down",
                frequency: 5,
            },
            "walk_up": {
                frames:[8,9,10,11],
                next: "walk_up",
                frequency: 5,
            },
            "attack_down": {
                frames:[12,13,14,15],
                next: "stop_down",
                frequency: 5,
            },
            "attack_up": {
                frames:[16,17,18,19],
                next: "stop_up",
                frequency: 5,
            },
        },
    });

    //村人ユニット
    tactics.SpriteSheet.Normal = tm.asset.SpriteSheet({
        image: "normal",
        frame: {
            width: 32,
            height: 32,
            count: 32,
        },
        animations: {
            "stop_down": {
                frames:[5],
                next: "stop_down",
                frequency: 60,
            },
            "stop_up": {
                frames:[4],
                next: "stop_up",
                frequency: 60,
            },
            "walk_down": {
                frames:[1,5,9],
                next: "walk_down",
                frequency: 5,
            },
            "walk_up": {
                frames:[0,4,8],
                next: "walk_up",
                frequency: 5,
            },
        },
    });

    //爆発
    tactics.SpriteSheet.Explode = tm.asset.SpriteSheet({
        image: "explode",
        frame: {
            width: 32,
            height: 48,
            count: 8,
        },
        animations: {
            "explode": {
                frames:[0,1,2,3,4,5,6,7],
                frequency: 4,
            },
        },
    });
};


})();