/* common variables */
var MsIE;
var MsIE6;
var fadeInTiming = 555;
var fadeOutTiming = 333;
var rolloutTiming = 5555;
var flashVars, flashAttributes;
var flashParams = {
    menu: 'false',
    scale: 'noScale',
    allowFullscreen: 'true',
    allowScriptAccess: 'always',
    wmode: 'transparent'
};
var windowWidth, windowHeight, availContentHeight, imageWidth, imageHeight;

/* init functions */

function UBbkgResize() {
    if (self.innerHeight) {
        windowWidth = self.innerWidth;
        windowHeight = self.innerHeight;
    } else if (document.documentElement && document.documentElement.clientWidth) {
        windowWidth = document.documentElement.clientWidth;
        windowHeight = document.documentElement.clientHeight;
    } else if (document.body && document.body.clientWidth) {
        windowWidth = document.body.clientWidth;
        windowHeight = document.body.clientHeight;
    }

    if (parseInt(windowWidth) > 1440) {
        imageWidth = 1440;
        imageHeight = 900;
        bkgImgArray = bkgImgArrayLarge;

    } else {
        windowH = windowHeight;
        footerH = $('#footer').height();
        newPageH = this.windowH - footerH - 3;
        soglia = 670;

        if (newPageH > soglia) {
            imageWidth = 1440;
            imageHeight = 900;
            bkgImgArray = bkgImgArrayLarge;
        } else {
            imageWidth = 1440;
            imageHeight = 670;
            bkgImgArray = bkgImgArraySmall;
        }
    }

    availContentHeight = windowHeight - (3 + $('#footer').height());
    availContentHeight = (bkgFlshArray.length > 0) ? availContentHeight : (availContentHeight > imageHeight) ? imageHeight : availContentHeight;
    $("#back-ground-CTR").css({
        'height': availContentHeight
    });
    $("#page").css({
        'width': (bkgFlshArray.length > 0) ? '100%' : (windowWidth > imageWidth) ? imageWidth : windowWidth,
        'height': availContentHeight
    });

    if (parseInt(windowWidth) > 1024) {
        $(".footer-CNT").css({
            'width': (bkgFlshArray.length > 0) ? windowWidth - 202 : (windowWidth > imageWidth) ? imageWidth - 202 : windowWidth - 202,
            'padding-left': 101,
            'padding-right': 101
        });

        $(".side-menu").css({
            'left': 98
        });

        $(".related-content").css({
            'right': 98
        });
    }
    else {
        $(".footer-CNT").css({
            'width': (bkgFlshArray.length > 0) ? windowWidth - 26 : (windowWidth > imageWidth) ? imageWidth - 26 : windowWidth - 26,
            'padding-left': 13,
            'padding-right': 13
        });

        $(".side-menu").css({
            'left': 10
        });

        $(".related-content").css({
            'right': 10
        });
    }

    if (parseInt(windowWidth) > 1440) {

        $(".footer").css({
            'width': (bkgFlshArray.length > 0) ? '100%' : imageWidth,
            'margin': '0 auto'
        });

    }
    else {
        if (parseInt(windowWidth) <= 1024) {
            $(".footer").css({
                'width': (bkgFlshArray.length > 0) ? windowWidth : (windowWidth > imageWidth) ? imageWidth : windowWidth,
                'margin': ''
            });
        }
        else {
            $(".footer").css({
                'width': '',
                'margin': ''
            });
        }

    }
}
var loaded = 0;
var slided = 0;
var focusOnElm = '';
var focusOnRolloutTimeoutID = '';
var UBfocusOnFastSlideLoopID = '';
var UBfocusOnJumpToFastRollOutID = '';
function UBpreloadIMG() {
    $('<img />').attr('src', bkgImgArray[loaded]).load(function() {
        var nthChildStr = ":nth-child(" + (loaded - slided + 1) + ")";
        $(".back-ground-CNT" + nthChildStr).css('background-image', 'url(' + bkgImgArray[loaded] + ')');
        if (loaded == 0) {
            $(".back-ground-CNT:nth-child(1)").fadeIn(fadeInTiming);
            UBsetRelatedContentPosition();
            if (MsIE) {
                $(".related-content-CNT:first-child").show(0, function() {
                    $(".back-ground-CTR").css({ backgroundImage: 'none' });
                });
            } else {
                $(".related-content-CNT:first-child").fadeIn(fadeInTiming, function() {
                    $(".back-ground-CTR").css({ backgroundImage: 'none' });
                });
            }
        } else {
            $(".back-ground-CNT" + nthChildStr).css('background-image', 'url(' + bkgImgArray[loaded] + ')').show();
        }
        var nthChildFOStr = ":nth-child(" + (loaded - slided) + ")";
        loaded == 0 ? $(".focus-on li:last-child a").removeClass('inactive') : $(".focus-on li" + nthChildFOStr + " a").removeClass('inactive');
        if (loaded > 0 && focusOnRolloutTimeoutID == '' && $(".back-ground-CNT:nth-child(2)").css('background-image') != 'none') focusOnRolloutTimeoutID = setTimeout("UBfocusOnRollout();", rolloutTiming);
        loaded++;
        if (loaded < bkgImgArray.length) UBpreloadIMG();
    });
}
function UBsetRelatedContentPosition() {
    $(".related-content-CNT:first-child").hasClass('box-top') ? $("#related-content").removeClass('related-content-box-bottom').addClass('related-content-box-top') : $("#related-content").removeClass('related-content-box-top').addClass('related-content-box-bottom');
}
function UBinit() {
    /* detect IE */
    MsIE = ($.browser.msie) ? true : false;
    fadeOutTiming = (MsIE) ? 123 : fadeOutTiming;
    /* detect IE6 */
    MsIE6 = (MsIE && parseInt($.browser.version) < 7) ? true : false;
    /* resize background page */
    UBbkgResize();
    focusOnElm = $(".focus-on-CNT ul li").length;
    /* inizializza ciclo in base al numero di elementi */
    if (focusOnElm > 1) {// piu' di 1 elemento nel FOCUS-ON
        /* focus on settings */
        $(".focus-on-CNT li:first-child").appendTo('.focus-on-CNT ul');
        $(".focus-on-CNT,.focus-on-CNT ul").css('height', function() {
            return ($(".focus-on-CNT ul li").length - 1) * 63;
        });
        $(".focus-on").fadeIn(fadeInTiming * 3);
        /* preload immagini visual */
        (MsIE6) ? UBpreloadIMG_IE6() : UBpreloadIMG();
    } else {// 1 solo elemento nel FOCUS-ON
        /* preload immagine visual */
        $('<img />').attr('src', bkgImgArray[0]).load(function() {
            /* push elemento flash */
            if (bkgFlshArray[0] != '') {
                $(".back-ground-CNT").html('<div id="FLASH-CNT">' + $(".back-ground-CNT").html() + '<\/div>');
                swfobject.embedSWF(bkgFlshArray[0], 'FLASH-CNT', '100%', '100%', '10.0.0', '../swf/expressInstall.swf', flashVars, flashParams, flashAttributes);
            }
            $(".back-ground-CNT").css('background-image', 'url(' + bkgImgArray[0] + ')').fadeIn(fadeInTiming * 2, function() {
                /* set Related Content */
                UBsetRelatedContentPosition();
                if (MsIE) {
                    $(".related-content-CNT:first-child").show(0, function() {
                        $(".back-ground-CTR").css({ backgroundImage: 'none' });
                    });
                } else {
                    $(".related-content-CNT:first-child").fadeIn(fadeInTiming, function() {
                        $(".back-ground-CTR").css({ backgroundImage: 'none' });
                    });
                }
            });
        });
    }
}

/* common functions */
var activeMNU = '';
function UBshowMNU2ndLvl(myObj, myOldObj) {
    offset = $(myObj).parent('li').hasClass('more') && !$(myObj).hasClass('active') ? ((($(myObj).height() - $(myObj).next().height()) / 2) + $(myObj).offset().top) < 0 ? (($(myObj).height() - $(myObj).next().height()) / 2) + $(myObj).offset().top : 0 : 0;
    $(myObj).hasClass('active') ? $(myObj).toggleClass('active').next().fadeOut('fast', function() {
        activeMNU = '';
    }) : $(myObj).toggleClass('active').next().css('top', (($(myObj).height() - $(myObj).next().height()) / 2) - offset).fadeIn('fast', function() {
        if (activeMNU != '') $(activeMNU).toggleClass('active').next().fadeOut('fast');
        activeMNU = myObj;
    });
}
function UB_genPop(myUrl, myWinName, myWidth, myHeight, myPosX, myPosY, myPars) {
    //var winLeft = myPosX ? myPosX : (screen.availWidth - myWidth) / 2;
    //var winTop = myPosY ? myPosY : (screen.availHeight - myHeight) / 2;
    var winLeft = myPosX ? myPosX : (windowWidth - myWidth) / 2;
    var winTop = myPosY ? myPosY : (windowHeight - myHeight) / 2;
    var winParameters = myPars ? myPars + '' : ',toolbar=0,location=0,status=0,menubar=0,directories=0,scrollbars=0,resizable=0';
    var newWin = window.open(myUrl, myWinName, 'width=' + myWidth + ',height=' + myHeight + ',left=' + winLeft + ',top=' + winTop + winParameters);
    newWin.focus();
}
function UBunbindFocusOnClick() {
    $(".focus-on a").unbind('click').click(function() {
        UBfocusOnFastSlide($(this).parent('li').index() + 1);
    });
}
function UBfixPNG() {// IE6 png fixing
    $(".focus-on-CNT a").removeClass('active');
    $(".related-content-CNT shape").remove();
    $(".related-content-CNT img.pngfix").removeAttr('style');
    DD_belatedPNG.fix(".related-content-CNT img.pngfix");
}
function UBfocusOnRollout() {
    if (focusOnRolloutTimeoutID) clearTimeout(focusOnRolloutTimeoutID);
    $(".focus-on a").unbind('click').click(function() { return false; });
    $(".related-content-CNT:first-child").stop().fadeOut(fadeOutTiming, function() {
        if (MsIE) $(this).removeAttr('filter');
        $(".related-content-CNT:first-child").appendTo('.related-content');
        $("#back-ground-CTR .back-ground-CNT:first-child").animate({
            'margin-top': '-=' + availContentHeight
        }, 555, function() {
            // on animation complete
            $("#back-ground-CTR .back-ground-CNT:first-child").appendTo('#back-ground-CTR').css('margin-top', 0);
            slided++;
            if (MsIE6) UBfixPNG();
            UBsetRelatedContentPosition();
            if (MsIE) {
                $(".related-content-CNT:first-child").show(0, function() {
                    setTimeout("UBunbindFocusOnClick();", 123);
                    focusOnRolloutTimeoutID = setTimeout("UBfocusOnRollout();", rolloutTiming);
                });
            } else {
                $(".related-content-CNT:first-child").fadeIn(fadeInTiming, function() {
                    setTimeout("UBunbindFocusOnClick();", 123);
                    focusOnRolloutTimeoutID = setTimeout("UBfocusOnRollout();", rolloutTiming);
                });
            }
        });
        $(".focus-on-CNT li:first-child").animate({
            'margin-top': '-=63'
        }, 555, function() {
            // on animation complete
            $(".focus-on-CNT ul li:first-child").appendTo('.focus-on-CNT ul').css('margin-top', 0);
        });
    })
}
function UBfocusOnFastSlideLoop(myLoopIndex) {
    if (UBfocusOnFastSlideLoopID) clearTimeout(UBfocusOnFastSlideLoopID);
    var myActualLoopIndex = --myLoopIndex;
    $(".related-content-CNT:first-child").appendTo('.related-content');
    $("#back-ground-CTR .back-ground-CNT:first-child").animate({
        'margin-top': '-=' + availContentHeight
    }, 333, function() {
        // on animation complete
        $("#back-ground-CTR .back-ground-CNT:first-child").appendTo('#back-ground-CTR').css('margin-top', 0);
        slided++;
        if (myActualLoopIndex == 0) {
            if (MsIE6) UBfixPNG();
            UBsetRelatedContentPosition();
            if (MsIE) {
                $(".related-content-CNT:first-child").show(0, function() {
                    setTimeout("UBunbindFocusOnClick();", 123);
                    focusOnRolloutTimeoutID = setTimeout("UBfocusOnRollout();", rolloutTiming);
                });
            } else {
                $(".related-content-CNT:first-child").fadeIn(fadeInTiming, function() {
                    setTimeout("UBunbindFocusOnClick();", 123);
                    focusOnRolloutTimeoutID = setTimeout("UBfocusOnRollout();", rolloutTiming);
                });
            }
        } else {
            UBfocusOnFastSlideLoopID = setTimeout("UBfocusOnFastSlideLoop(" + myActualLoopIndex + ");", 223);
        }
    });
    $(".focus-on-CNT li:first-child").animate({
        'margin-top': '-=63'
    }, 333, function() {
        // on animation complete
        $(".focus-on-CNT ul li:first-child").appendTo('.focus-on-CNT ul').css('margin-top', 0);
    });
}
function UBfocusOnJumpToFastRollOut(myLoopIndex) {
    if (UBfocusOnJumpToFastRollOutID) clearTimeout(UBfocusOnJumpToFastRollOutID);
    var myActualLoopIndex = --myLoopIndex;
    $(".focus-on-CNT li:first-child").animate({
        'margin-top': '-=63'
    }, 333, function() {
        // on animation complete
        $(".focus-on-CNT ul li:first-child").appendTo('.focus-on-CNT ul').css('margin-top', 0);
        slided++;
        if (myActualLoopIndex == 0) {
            setTimeout("UBunbindFocusOnClick();", 223)
            focusOnRolloutTimeoutID = setTimeout("UBfocusOnRollout();", rolloutTiming);
        } else {
            UBfocusOnJumpToFastRollOutID = setTimeout("UBfocusOnJumpToFastRollOut(" + myActualLoopIndex + ");", 223);
        }
    });
}
function UBfocusOnJumpTo(myJumpIndex) {
    $("#back-ground-CTR .back-ground-CNT:first-child").fadeOut(fadeOutTiming, function() {
        for (j = 0; j < myJumpIndex; j++) {
            $("#back-ground-CTR .back-ground-CNT:first-child").appendTo('#back-ground-CTR').show();
            $(".related-content-CNT:first-child").appendTo('.related-content');
            if (loaded < 4) {
                $(".focus-on-CNT li:first-child").appendTo('.focus-on-CNT ul');
            } else if (j == 0) {
                UBfocusOnJumpToFastRollOut(myJumpIndex);
            }
            slided++;
            if (j == myJumpIndex - 1) {
                if (MsIE6) UBfixPNG();
                UBsetRelatedContentPosition();
                if (MsIE) {
                    $(".related-content-CNT:first-child").show(0, function() {
                        setTimeout("UBunbindFocusOnClick();", 123);
                    });
                } else {
                    $(".related-content-CNT:first-child").fadeIn(fadeInTiming, function() {
                        setTimeout("UBunbindFocusOnClick();", 123);
                    });
                }
            }
        }
    });
}
function UBfocusOnFastSlide(myIndex) {
    if (focusOnRolloutTimeoutID) clearTimeout(focusOnRolloutTimeoutID);
    $(".focus-on a").unbind('click').click(function() { return false; });
    $(".related-content-CNT:first-child").stop().fadeOut(fadeOutTiming, function() {
        if (MsIE) $(this).removeAttr('filter');
        $(".focus-on-CNT li").removeAttr('style');
        transition == 'S' ? UBfocusOnFastSlideLoop(myIndex) : UBfocusOnJumpTo(myIndex);
    })
}

/* jQuery common */
$(document).ready(function() {
    $("a[rel^='prettyPhoto']").prettyPhoto({ theme: 'dark_rounded' });
    /* assegna funzione ai link del focus-on */
    $(".focus-on a").click(function() {
        if (!$(this).hasClass('inactive')) UBfocusOnFastSlide($(this).parent('li').index() + 1);
    });
    /* interrompi le animazioni al mouse-over sul pannello RELATED-CONTENT */
    $(".related-content").mouseenter(function() {
        if (focusOnRolloutTimeoutID) clearTimeout(focusOnRolloutTimeoutID);
    }).mouseleave(function() {
        if (focusOnElm > 1) focusOnRolloutTimeoutID = setTimeout("UBfocusOnRollout();", rolloutTiming);
    });
    /* controllo al click: se aperto il context menu, lo chiudo */
    $('*').click(function() {
        if ($(this).parent('li').hasClass('more')) {
            UBshowMNU2ndLvl($(this), activeMNU);
        } else {
            UBshowMNU2ndLvl($('.more a.active:first-child'));
        }
        if ($(this).attr('href') == '#') {// esce se si tratta di voce con sottomenu
            return false;
        } else if ($(this).attr('href') != '#') {// controlla il tipo di link
            relParams = $(this).attr('rel');
            if (!relParams) {
                return;
            } else {
                relParams = relParams.split('|');
            }
            if (relParams[0] == 'P') {// popup con dimensioni fisse
                var parametriPop = '';
                if (relParams[5]) {
                    var popPars = relParams[5].split(',');
                    parametriPop = ',toolbar=' + popPars[0] + ',location=' + popPars[1] + ',status=' + popPars[2] + ',menubar=' + popPars[3] + ',directories=' + popPars[4] + ',scrollbars=' + popPars[5] + ',resizable=' + popPars[6];
                }
                UB_genPop($(this).attr('href'), 'pop' + Math.floor(Math.random() * 999999999), relParams[1], relParams[2], relParams[3], relParams[4], parametriPop);
                return false;
            } else if (relParams[0] == 'F') {// fullscreen ove possibile
                //UB_genPop($(this).attr('href'), 'pop' + Math.floor(Math.random() * 999999999), screen.width, screen.height, ',toolbar=0,location=0,status=0,menubar=0,directories=0,scrollbars=0,resizable=0,fullscreen=yes', 0, 0);
                UB_genPop($(this).attr('href'), 'pop' + Math.floor(Math.random() * 999999999), windowWidth, windowHeight, ',toolbar=0,location=0,status=0,menubar=0,directories=0,scrollbars=0,resizable=0,fullscreen=yes', 0, 0);
                return false;
            } else if (relParams[0] == 'L') {// lightbox
                iframed = relParams[3] ? 'iframe=true&' : '';
                $.prettyPhoto.open($(this).attr('href') + '?' + iframed + 'width=' + relParams[1] + '&height=' + relParams[2]);
                return false;
            }
        }
    });
});

/* event functions */
//window.onload=UBinit;
_spBodyOnLoadFunctionNames.push('UBinit');
window.onresize = UBbkgResize;
