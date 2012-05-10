var INTERCEPT_HOST = "https://ford.keysurvey2.com";
//var INTERCEPT_HOST = "https://ford.ssstest.com";
//var INTERCEPT_HOST = "http://vgrygoraschuk.ssstest.com";
//var INTERCEPT_HOST = "http://localhost:8080";
var DHTML_SUITE_JS_FOLDER = INTERCEPT_HOST + '/js/dhtmlsuite/';
var DHTML_SUITE_THEME_FOLDER = INTERCEPT_HOST + "/styles/dhtmlsuite/themes/";
var DHTML_SUITE_THEME = 'gray';
var isIE = navigator.appName.toLowerCase() == "Microsoft Internet Explorer".toLowerCase();
var FLAT_BARS_HEIGTH = 43;//26 - (isIE ? 10 : 0);//43
var FLAT_STYLE_INFO = '<style type="text/css">@font-face{font-family:"worldapp-fordngbs-antenna";src:local("worldapp-fordngbs-antenna"),url("http://www.ford.com/resources/ford/general/typefaces/antenna_regular-webfont.ttf") format("truetype"),url("http://www.ford.com/resources/ford/general/typefaces/antenna_regular-webfont.woff") format("woff"),url("http://www.ford.com/resources/ford/general/typefaces/antenna_regular-webfont.svg#webfont3RmT6iw4") format("svg");}\r\n' +
                      '@font-face{font-family:"worldapp-fordngbs-antenna-bold-italic";src:local("worldapp-fordngbs-antenna-bold-italic"),url("http://www.ford.com/resources/ford/general/typefaces/antenna_bolditalic-webfont.ttf") format("truetype"),url("http://www.ford.com/resources/ford/general/typefaces/antenna_bolditalic-webfont.woff") format("woff"),url("http://www.ford.com/resources/ford/general/typefaces/antenna_bolditalic-webfont.svg#webfontnRgXoHU6") format("svg");}\r\n' +
                      '@font-face{font-family:"worldapp-fordngbs-antenna-bold";src:local("worldapp-fordngbs-antenna-bold"),url("http://www.ford.com/resources/ford/general/typefaces/antenna_bold-webfont.ttf") format("truetype"),url("http://www.ford.com/resources/ford/general/typefaces/antenna_bold-webfont.woff") format("woff"),url("http://www.ford.com/resources/ford/general/typefaces/antenna_bold-webfont.svg#webfontEgJeXWMS") format("svg");}\r\n' +
                      '@font-face{font-family:"worldapp-fordngbs-antenna-italic";src:local("worldapp-fordngbs-antenna"),url("http://www.ford.com/resources/ford/general/typefaces/antenna_regularitalic-webfont.ttf") format("truetype"),url("http://www.ford.com/resources/ford/general/typefaces/antenna_regularitalic-webfont.wof") format("wof"),url("http://www.ford.com/resources/ford/general/typefaces/antenna_regularitalic-webfont.svg#webfontWdmQOeRu") format("svg");}\r\n' +
                      '#surveyLink input {color:#ffffff;border:none;width:53px;height:27px;background:url("' + INTERCEPT_HOST + '/img/btn.gif") no-repeat left top;margin-bottom:50px;}\r\n' +
                      '#surveyLink input:hover{background-position:right top;}</style>\r\n';


//start cookies js
function getWAExpDate(days, hours, minutes) {
    var expDate = new Date();
    if (typeof days == "number" && typeof hours == "number" &&
        typeof hours == "number") {
        expDate.setDate(expDate.getDate() + parseInt(days));
        expDate.setHours(expDate.getHours() + parseInt(hours));
        expDate.setMinutes(expDate.getMinutes() + parseInt(minutes));
        return expDate.toGMTString();
    }
}

// utility function called by getCookie( )
function getWACookieVal(offset) {
    var endstr = document.cookie.indexOf(";", offset);
    if (endstr == -1) {
        endstr = document.cookie.length;
    }
    return unescape(document.cookie.substring(offset, endstr));
}

// primary function to retrieve cookie by name
function getWACookie(name) {
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    while (i < clen) {
        var j = i + alen;
        if (document.cookie.substring(i, j) == arg) {
            return getWACookieVal(j);
        }
        i = document.cookie.indexOf(" ", i) + 1;
        if (i == 0) break;
    }
    return "";
}

// store cookie value with optional details as needed
function setWACookie(name, value, expires, path, domain, secure) {
    var cookieString = name + "=" + escape(value) +
                       ((expires) ? "; expires=" + expires : "") +
                       ((path) ? "; path=" + path : "") +
//                       ((domain) ? "; domain=" + domain : "") +
                       ((secure) ? "; secure" : "");
    document.cookie = cookieString;
}

// remove the cookie by setting ancient expiration date
function deleteWACookie(name, path, domain) {
    if (getWACookie(name)) {
        document.cookie = name + "=" +
                          ((path) ? "; path=" + path : "") +
//                          ((domain) ? "; domain=" + domain : "") +
                          "; expires=Thu, 01-Jan-70 00:00:01 GMT";
    }
}
//end cookies js

var ksPromptInfo = new Object();
var newPromptWindow = null;
var script_dhtmlSuiteCommon_Loaded = false;
var script_dhtmlSuiteDynamicContent_Loaded = false;
var script_dhtmlSuiteWindowWidget_Loaded = false;
var script_dhtmlSuiteDragDropSimple_Loaded = false;
var script_dhtmlSuiteResize_Loaded = false;
var style_flatWindow_Loaded = false;
var script_dhtmlSuiteCommon = null;
var script_dhtmlSuiteDynamicContent = null;
var script_dhtmlSuiteWindowWidget = null;
var script_dhtmlSuiteDragDropSimple = null;
var script_dhtmlSuiteResize = null;
var style_flatWindow = null;
var interceptScript = null;
var timeoutId = null;

function initialization(element) {
    //add_dhtmlStuiteLibrary();
    addEventHandlers(element);
}

function addEventHandlers(element) {
    function onLoad() {
        var currentDate = new Date();
        setWACookie("onLoadTD", currentDate, new Date(currentDate.getFullYear() + 1, 0, 1), "/", document.domain, false);
        deleteWACookie("onUnloadTD", "/", document.domain);
    };
    if (isIE)
        element.attachEvent("onload", function() {onLoad();});
    else
        element.addEventListener("load", function() {onLoad();}, false);

    function onUnload() {
        var currentDate = new Date();
        setWACookie("onUnloadTD", currentDate, new Date(currentDate.getFullYear() + 1, 0, 1), "/", document.domain, false);
        deleteWACookie("onLoadTD", "/", document.domain);
    };

    if (isIE)
        element.attachEvent("onunload", function(){onUnload();});
    else
        element.addEventListener("unload", function(){onUnload();}, false);
}

function add_dhtmlStuiteLibrary() {
    var head = document.getElementsByTagName('head')[0];
    if (style_flatWindow == null) {
        style_flatWindow = document.createElement('link');
        style_flatWindow.rel = "stylesheet";
        style_flatWindow.media = "screen";
        if (isIE) {
            style_flatWindow.onreadystatechange = function () {
                if (this.readyState == 'loaded')
                    style_flatWindow_Loaded = true;
            };
        } else style_flatWindow_Loaded = true;
        style_flatWindow.onload = function () {
            style_flatWindow_Loaded = true;
        };
        style_flatWindow.href = INTERCEPT_HOST + "/styles/flatWindow.css";
        head.appendChild(style_flatWindow);
    }
    if (script_dhtmlSuiteCommon == null) {
        script_dhtmlSuiteCommon = document.createElement('script');
        script_dhtmlSuiteCommon.type = 'text/javascript';
        script_dhtmlSuiteCommon.id = "script_dhtmlSuiteCommon";
        if (isIE) {
            script_dhtmlSuiteCommon.onreadystatechange = function () {
                if (this.readyState == 'loaded')
                    script_dhtmlSuiteCommon_Loaded = true;
            };
        }
        script_dhtmlSuiteCommon.onload = function () {
            script_dhtmlSuiteCommon_Loaded = true;
        };
        script_dhtmlSuiteCommon.src = DHTML_SUITE_JS_FOLDER + "dhtmlSuite-common.js";
        head.appendChild(script_dhtmlSuiteCommon);
    }

    if (script_dhtmlSuiteDynamicContent == null) {
        script_dhtmlSuiteDynamicContent = document.createElement('script');
        script_dhtmlSuiteDynamicContent.type = 'text/javascript';
        script_dhtmlSuiteDynamicContent.id = "script_dhtmlSuiteDynamicContent";
        if (isIE) {
            script_dhtmlSuiteDynamicContent.onreadystatechange = function () {
                if (this.readyState == 'loaded')
                    script_dhtmlSuiteDynamicContent_Loaded = true;
            };
        }
        script_dhtmlSuiteDynamicContent.onload = function () {
            script_dhtmlSuiteDynamicContent_Loaded = true;
        };
        script_dhtmlSuiteDynamicContent.src = DHTML_SUITE_JS_FOLDER + "dhtmlSuite-dynamicContent.js";
        head.appendChild(script_dhtmlSuiteDynamicContent);
    }

    if (script_dhtmlSuiteWindowWidget == null) {
        script_dhtmlSuiteWindowWidget = document.createElement('script');
        script_dhtmlSuiteWindowWidget.type = 'text/javascript';
        script_dhtmlSuiteWindowWidget.id = "script_dhtmlSuiteWindowWidget";
        if (isIE) {
            script_dhtmlSuiteWindowWidget.onreadystatechange = function () {
                if (this.readyState == 'loaded')
                    script_dhtmlSuiteWindowWidget_Loaded = true;
            };
        }
        script_dhtmlSuiteWindowWidget.onload = function () {
            script_dhtmlSuiteWindowWidget_Loaded = true;
        };
        script_dhtmlSuiteWindowWidget.src = DHTML_SUITE_JS_FOLDER + "dhtmlSuite-windowWidget.js";
        head.appendChild(script_dhtmlSuiteWindowWidget);
    }

    if (script_dhtmlSuiteDragDropSimple == null) {
        script_dhtmlSuiteDragDropSimple = document.createElement('script');
        script_dhtmlSuiteDragDropSimple.type = 'text/javascript';
        script_dhtmlSuiteDragDropSimple.id = "script_dhtmlSuiteDragDropSimple";
        if (isIE) {
            script_dhtmlSuiteDragDropSimple.onreadystatechange = function () {
                if (this.readyState == 'loaded')
                    script_dhtmlSuiteDragDropSimple_Loaded = true;
            };
        }
        script_dhtmlSuiteDragDropSimple.onload = function () {
            script_dhtmlSuiteDragDropSimple_Loaded = true;
        };
        script_dhtmlSuiteDragDropSimple.src = DHTML_SUITE_JS_FOLDER + "dhtmlSuite-dragDropSimple.js";
        head.appendChild(script_dhtmlSuiteDragDropSimple);
    }

    if (script_dhtmlSuiteResize == null) {
        script_dhtmlSuiteResize = document.createElement('script');
        script_dhtmlSuiteResize.type = 'text/javascript';
        script_dhtmlSuiteResize.id = "script_dhtmlSuiteResize";
        if (isIE) {
            script_dhtmlSuiteResize.onreadystatechange = function () {
                if (this.readyState == 'loaded')
                    script_dhtmlSuiteResize_Loaded = true;
            };
        }
        script_dhtmlSuiteResize.onload = function () {
            script_dhtmlSuiteResize_Loaded = true;
        };
        script_dhtmlSuiteResize.src = DHTML_SUITE_JS_FOLDER + "dhtmlSuite-resize.js";
        head.appendChild(script_dhtmlSuiteResize);
    }
}

function clearAll() {
    if (interceptScript != null) {
        var head = document.getElementsByTagName('head')[0];
        head.removeChild(interceptScript);
        interceptScript = null;
    }
    closeFlatWindow();
}

function closeFlatWindow() {
    if (newPromptWindow != null) {
        if (script_dhtmlSuiteCommon != null || script_dhtmlSuiteDynamicContent != null || script_dhtmlSuiteWindowWidget != null || script_dhtmlSuiteDragDropSimple != null || script_dhtmlSuiteResize != null) {
            newPromptWindow.purge();
            newPromptWindow.close();
            if (timeoutId != null)
                clearTimeout(timeoutId);
        }
        newPromptWindow = null;
    }
}

function createNewWindow(promptInfo) {
    clearAll();
    if (typeof(promptInfo) == "undefined" || promptInfo == null || promptInfo.URL == null || promptInfo.URL == "")
        return;
    var windowFeatures = 'width=' + promptInfo.width;
    windowFeatures += ',height=' + promptInfo.height;
    windowFeatures += ',left=' + promptInfo.xPos;
    windowFeatures += ',top=' + promptInfo.yPos;
    windowFeatures += ',resizable=yes,toolbar=no,menubar=no,location=no,scrollbars=yes';
    promptInfo.URL += "&tp=" + document.location.protocol + "//" + document.location.host + promptInfo.trackerPage;
    if (promptInfo.displayingMethod == 0) {
        newPromptWindow = window.open(promptInfo.URL, "_blank", windowFeatures);
        if (newPromptWindow != null)
            newPromptWindow.focus();
    } else  if (promptInfo.displayingMethod == 1) {
        newPromptWindow = window.open(promptInfo.URL, "_blank", windowFeatures);
        if (newPromptWindow != null)
            newPromptWindow.blur();
        // Forces the current window to remain on top
        window.focus();
    } else if (promptInfo.displayingMethod == 2 || promptInfo.displayingMethod == 3 || promptInfo.displayingMethod == 4) {
        if (newPromptWindow == null) {
            add_dhtmlStuiteLibrary();            
            showFlatWindow(promptInfo);
        }
    }
}

function IncludeJavaScript(jsFile) {
    document.write('<script type="text/javascript" src="' + jsFile + '"></script>');
}

function showFlatWindow(promptInfo) {
    if (style_flatWindow_Loaded && script_dhtmlSuiteCommon_Loaded && script_dhtmlSuiteDynamicContent_Loaded && script_dhtmlSuiteWindowWidget_Loaded && script_dhtmlSuiteDragDropSimple_Loaded && script_dhtmlSuiteResize_Loaded) {
        var newWindowModel = new DHTMLSuite.windowModel({
            windowsTheme:true,
            id:'newWindow',
            title:promptInfo.windowTitle,
            xPos:promptInfo.xPos,
            yPos:promptInfo.yPos,
            width:promptInfo.width,
            height:promptInfo.height,
            maxWidth:1000,
            maxHeight:1000,
            minWidth:promptInfo.width,
            minHeight:promptInfo.height,
            cookieName:window,
            isResizable:true,
            isMinimizable:true,
            isClosable:true});
        if (newWindowModel != null) {
            if (promptInfo.displayingMethod == 2) {
                newWindowModel.addTab({ id:'myTab',htmlElementId:'myTab',tabTitle:' ',
                    textContent:FLAT_STYLE_INFO + '<div id="surveyLink" style="-moz-border-radius: 10px 10px 10px 10px;margin:5px;padding:5px;border:2px solid #385D8A;width:auto;background: #fff"><div style="width:100%;height:140px;top left #fff;"></div><div style="width:100%; text-align:center; color:#17375e; font-family:\'AntennaRegular\',Arial;font-weight:normal;font-size:24px;line-height:33px;font-style:italic"><p>Your opinion is important!<br>Please take a moment to answer some questions.</p><input id="btnYes" type="button" value="Yes" onclick="startFlatingSurvey(\'' + promptInfo.URL + '\')"/>&nbsp;<input id="btnNo" type="button" value="No" onclick="closeFlatWindow();"/></div></div><div style="text-align:center;"><iframe scrolling="no" id="surveyFrame" style="width:0px;height:0px;" frameborder="0"></iframe></div>'});
            } else if (promptInfo.displayingMethod == 3) {
                newWindowModel.addTab({ id:'myTab',htmlElementId:'myTab',tabTitle:' ',
                    textContent:FLAT_STYLE_INFO + '<div id="surveyLink" style="-moz-border-radius: 10px 10px 10px 10px;margin:5px;padding:5px;border:2px solid #385D8A;width:auto;background: #fff"><div style="width:100%;height:140px;top left #fff;"></div><div style="width:100%; text-align:center; color:#17375e; font-family:\'AntennaRegular\',Arial;font-weight:normal;font-size:24px;line-height:33px;font-style:italic"><p>Your opinion is important!<br>Please take a moment to answer some questions.</p><input id="btnYes" type="button" value="Yes" onclick="startPreInviteSurvey(\'' + promptInfo.URL + "\',\'" + promptInfo.sessionId + '\')"/>&nbsp;<input id="btnNo" type="button" value="No" onclick="closeFlatWindow();"/></div></div><div style="text-align:center;"><iframe scrolling="no" id="surveyFrame" style="width:0px;height:0px;" frameborder="0"></iframe></div>'});
            } else {
                newWindowModel.addTab({ id:'myTab',htmlElementId:'myTab',tabTitle:' ',
                    textContent:FLAT_STYLE_INFO + '<div id="surveyLink" style="-moz-border-radius: 10px 10px 10px 10px;margin:5px;padding:5px;border:2px solid #385D8A;width:auto;background: #fff"><div style="width:100%;height:140px;top left #fff;"></div><div style="width:100%; text-align:center; color:#17375e; font-family:\'AntennaRegular\',Arial;font-weight:normal;font-size:24px;line-height:33px;font-style:italic"><p>Your opinion is important!<br>Please take a moment to answer some questions.</p><input id="btnYes" type="button" value="Yes" onclick="startPrePostSurvey(\'' + promptInfo.URL + "\',\'" + promptInfo.sessionId + '\')"/>&nbsp;<input id="btnNo" type="button" value="No" onclick="closeFlatWindow();"/></div></div><div style="text-align:center;"><iframe scrolling="no" id="surveyFrame" style="width:0px;height:0px;" frameborder="0"></iframe></div>'});
            }
            newPromptWindow = new DHTMLSuite.windowWidget(newWindowModel);
            newPromptWindow.init();
            newPromptWindow.slideWindowToXAndY(promptInfo.xPos, promptInfo.yPos);
            newPromptWindow.setHeightOfWindow(promptInfo.height - 15);
            newPromptWindow.setWidthOfWindow(promptInfo.width);
            newPromptWindow.maximizeWindow();

            var surveyLink = document.getElementById("surveyLink");
            surveyLink.style.height = (parseInt(newPromptWindow.divElContent.style.height) - FLAT_BARS_HEIGTH) + "px";
            setTimeout(function() {
                flatWindowResize();
            }, 500);

            if (promptInfo.timeBeforeHideMS != null && promptInfo.timeBeforeHideMS > 0)
                timeoutId = setTimeout("minimizeFlatWindow();", promptInfo.timeBeforeHideMS * 1000);
        }
    } else setTimeout(function() {
        showFlatWindow(promptInfo);
    }, 1);
}

function minimizeFlatWindow() {
    if (newPromptWindow != null)
        newPromptWindow.minimizeWindow();
}

function startFlatingSurvey(surveyURL) {
    if (timeoutId != null)
        clearTimeout(timeoutId);
    var surveyLink = document.getElementById("surveyLink");
    var surveyFrame = document.getElementById("surveyFrame");
    if (surveyLink != null && surveyFrame != null) {
        if (newPromptWindow != null && newPromptWindow.divElContent != null) {
            newPromptWindow.setHeightOfWindow(newPromptWindow.windowModel.maxHeight);
            newPromptWindow.setWidthOfWindow(newPromptWindow.windowModel.maxWidth);
            surveyFrame.style.height = (parseInt(newPromptWindow.divElContent.style.height) - FLAT_BARS_HEIGTH) + "px";
        }
        else surveyFrame.style.height = "100%";
        surveyFrame.style.width = "98%";
        surveyLink.style.visibility = "hidden";
        surveyLink.style.display = "none";
        surveyFrame.src = surveyURL;
    }
}

function startPreInviteSurvey(surveyURL, sessionId) {
    var currentDate = new Date();
    setWACookie(sessionId, surveyURL, new Date(currentDate.getFullYear() + 1, 0, 1), "/", document.domain, false);
    var windowFeatures = 'width=400,height=300,left=100,top=100,resizable=yes,toolbar=no,menubar=no,location=no,scrollbars=yes';
    var thankYouWindowURL = document.location.protocol + "//" + document.location.host + promptInfo.trackerPage + "?sessionId=" + sessionId + "&surveySrc=" + surveyURL;
    var newPromptWindow = window.open(thankYouWindowURL, "_blank", windowFeatures);
    if (newPromptWindow != null)
        newPromptWindow.blur();
    window.focus();
    closeFlatWindow();
}

function startPrePostSurvey(surveyURL, sessionId) {
    if (timeoutId != null)
        clearTimeout(timeoutId);
    var surveyLink = document.getElementById("surveyLink");
    var surveyFrame = document.getElementById("surveyFrame");
    if (surveyLink != null && surveyFrame != null) {
        var currentDate = new Date();
        setWACookie(sessionId, surveyURL, new Date(currentDate.getFullYear() + 1, 0, 1), "/", document.domain, false);
        if (newPromptWindow != null && newPromptWindow.divElContent != null) {
            newPromptWindow.setHeightOfWindow(newPromptWindow.windowModel.maxHeight);
            newPromptWindow.setWidthOfWindow(newPromptWindow.windowModel.maxWidth);
            surveyFrame.style.height = (parseInt(newPromptWindow.divElContent.style.height) - FLAT_BARS_HEIGTH) + "px";
        } else surveyFrame.style.height = "100%";
        surveyFrame.style.width = "98%";
        surveyFrame.style.margin = "0 auto";
        surveyLink.style.visibility = "hidden";
        surveyLink.style.display = "none";
        surveyFrame.src = surveyURL;
        checkPrePostCookie(sessionId);
    }
}

function checkPrePostCookie(sessionId) {
    var prePostCookie = getWACookie(sessionId + "prePostStarted");
    if (prePostCookie != "")
        closeFlatWindow();
    else
        setTimeout(function() {
            checkPrePostCookie(sessionId);
        }, 500);
}

function flatWindowResize() {
    flatWindowOnResize();
    setTimeout(function() {
        flatWindowResize();
    }, 500);
}

function flatWindowOnResize() {
    var surveyFrame = document.getElementById("surveyFrame");
    var surveyLink = document.getElementById("surveyLink");
    var activeDiv = surveyLink == null || surveyLink.style.visibility == "hidden" || surveyLink.style.display == "none" ? surveyFrame : surveyLink;
    if (activeDiv != null && newPromptWindow != null && newPromptWindow.divElContent != null) {
        if (activeDiv.id == "surveyLink" && parseInt(activeDiv.style.height) != parseInt(newPromptWindow.divElContent.style.height) - FLAT_BARS_HEIGTH)
            activeDiv.style.height = (parseInt(newPromptWindow.divElContent.style.height) - FLAT_BARS_HEIGTH) + "px";
        if (activeDiv.id == "surveyFrame" && parseInt(activeDiv.style.height) != parseInt(newPromptWindow.divElContent.style.height) - FLAT_BARS_HEIGTH)
            activeDiv.style.height = (parseInt(newPromptWindow.divElContent.style.height) - FLAT_BARS_HEIGTH) + "px";
    }
}

function runInterceptRules(sessionId, pageName, domainName) {
//    if (trim(sessionId) == "")
//        return;
    var head = document.getElementsByTagName('head')[0];
    clearAll();
    interceptScript = document.createElement('script');
    interceptScript.type = 'text/javascript';
    if (navigator.appName.toLowerCase() == "Microsoft Internet Explorer".toLowerCase()) {
        interceptScript.onreadystatechange = function () {
            if (this.readyState == 'loaded')
                createNewWindow(ksPromptInfo);
        };
    }
    interceptScript.onload = function () {
        createNewWindow(ksPromptInfo);
    };
    if (typeof(pageName) == "undefined") pageName = "";
    interceptScript.src = INTERCEPT_HOST + '/Servlet/Interception?sessionId=' + sessionId + '&pageName=' + pageName + '&domainName=' + (domainName == null ? "" : domainName);
    head.appendChild(interceptScript);
}

function runInterceptRulesTest(sessionId, pageName, domainName, ipAddress) {
//    if (trim(sessionId) == "")
//       return;
    var head = document.getElementsByTagName('head')[0];
    clearAll();
    interceptScript = document.createElement('script');
    interceptScript.type = 'text/javascript';
    if (navigator.appName.toLowerCase() == "Microsoft Internet Explorer".toLowerCase()) {
        interceptScript.onreadystatechange = function () {
            if (this.readyState == 'loaded')
                createNewWindow(ksPromptInfo);
        };
    }
    interceptScript.onload = function () {
        createNewWindow(ksPromptInfo);
    };
    if (typeof(pageName) == "undefined") pageName = "";
    interceptScript.src = INTERCEPT_HOST + '/Servlet/Interception?sessionId=' + sessionId + '&pageName=' + pageName + '&domainName=' + (domainName == null ? "" : domainName) + '&ipAddress=' + ipAddress;
    head.appendChild(interceptScript);
}

//function trim(stringToTrim) {
//	var result = stringToTrim.replace(/^\s+|\s+$/g,"");
//	while (result.indexOf("&nbsp;") != -1)
//		result = result.replace("&nbsp;", "");
//	return result;
//}

initialization(window);
