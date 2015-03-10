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
};
