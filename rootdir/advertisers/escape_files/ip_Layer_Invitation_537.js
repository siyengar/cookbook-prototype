var browser = new BrowserDetect(); var platform = '';

var _http = document.location.protocol;

//code to block IE 8
var localSwitch = true;
var my_browser = navigator.userAgent.toLowerCase();
if (my_browser.indexOf('msie 8.0') == -1) { localSwitch = true; }
//to stop completly, uncomment here.

//Paused on May 17, 2010
//localSwitch=false;
localSwitch = true;

//Changed to 705!!!

//var gJSFile = "javascript/Layer_537.js";
//var gJSFile = "http://ipinvite.iperceptions.com/Invitations/Javascripts/Layer_675.js";
var gJSFile = _http + "//ipinvite.iperceptions.com/Invitations/Javascripts/Layer_705.js";


function BrowserDetect() {
    ua = navigator.userAgent.toLowerCase(); this._string = navigator.userAgent.toLowerCase();
    this.isOpera = (ua.indexOf('opera') != -1); this.isGecko = (ua.indexOf('gecko') != -1 && ua.indexOf('safari') == -1);
    this.isIE = (ua.indexOf('msie') != -1 && !this.isOpera && (ua.indexOf('webtv') == -1));
    this.isMozilla = (this.isGecko && ua.indexOf('gecko/') + 14 == ua.length);
    this.isFirefox = (ua.indexOf('firefox') != -1);
}

function lScript(file) {
    var script = document.createElement('script');
    script.type = 'text/javascript'; script.src = file;
    if (typeof (script.onreadystatechange) == 'undefined')
        script.onload = function() { this.onload = null; };
    else
        script.onreadystatechange = function() { if (this.readyState != 'loaded' && this.readyState != 'complete') return; this.onreadystatechange = null; };

    document.getElementsByTagName('head')[0].appendChild(script);
}

function CC(name, value, days) {
    if (days) { var expDate = new Date(); expDate.setTime(expDate.getTime() + (days * 24 * 60 * 60 * 1000)); var expires = "; expires=" + expDate.toUTCString(); }
    else var expires = ""; document.cookie = name + "=" + value + expires + "; path=/";
}

function RC(NameOfCookie) {
    if (document.cookie.length > 0) {
        begin = document.cookie.indexOf(NameOfCookie + "=");
        if (begin != -1) {
            begin += NameOfCookie.length + 1; end = document.cookie.indexOf(";", begin);
            if (end == -1) end = document.cookie.length;
            return unescape(document.cookie.substring(begin, end));
        }
    }
    return null;
}

function EC(name) { CC(name, "", -1); }

//platform = RC("gtmo");
//console.log("The platform cookier is : %s ", platform);

function Exec() {
    var sCName = "IPERCEPTIONS_705"; var sCVal = "IPERCEPTIONS_705_COOKIE";
    var sCN = "IPE_S_705"; var sCV = "IPE_705_S_COOKIE";
    var sCVR; sCVR = RC(sCN);
    var sCValRet;
    var tCVName = "IPERCEPTIONS_TEST"; var tCVVal = "IPERCEPTIONS_TEST_COOKIE";
    var tCVValRet;
    CC(tCVName, tCVVal, 1);
    tCVValRet = RC(tCVName);
    sCValRet = RC(sCName);
    EC(tCVName);
    var rndNum = Math.floor((Math.random() * 10000));

    //Feb 25, 2010: 10%
    //Jan 3, 2011: 3.6%
    //June 2, 2011: 2.4%
    //June 5, 2011: 2.38%

    if (rndNum < 342 && tCVValRet !== null && sCVR === null && sCValRet === null) {
        CC(sCName, sCVal, 90); lScript(gJSFile);
    }

    if (sCVR == null) { CC(sCN, sCV); }
}


if (localSwitch) {
    //var GJS = "http://ipinvite.iperceptions.com/Invitations/Javascripts/Layer_Global.js";
    var GJS = _http + "//ipinvite.iperceptions.com/Invitations/Javascripts/Layer_Global_aicollect.js";
        lScript(GJS);
}
