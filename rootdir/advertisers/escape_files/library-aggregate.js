/************************************************************************
 Copyright (C) Unpublished Versata Software, Inc. All rights reserved.
 Versata Software, Inc., Confidential and Proprietary.

 This software is subject to copyright protection
 under the laws of the United States and other countries.

 Unless otherwise explicitly stated, this software is provided
 by Versata "AS IS".
*************************************************************************/
(function(){var g=getPackageForName("com.forddirect.ng.aspects");var f=YAHOO.Bubbling;var e=YAHOO.util.Dom;var d=YAHOO.util.Event;var a=YAHOO.lang;var h=getPackageForName("com.forddirect.ng.util");var i=getPackageForName("com.forddirect.ng.widgets");var b=getPackageForName("com.forddirect.ng.views");b.BaseView=function(){};var c=b.BaseView.prototype;c.init=function(j){this.addWidget("disclaimer-flip",i.DisclaimerFlip);this.addWidget("reserve-flip",i.ReserveFlip);this.addWidget("get-updates-flip",i.GetUpdatesFlip);this.updateSessionActiveCookie();_instances.bsLoader.browserHistoryChange.subscribe(this.handleBrowserHistoryChange,null,this);_instances.bsLoader.initCompleteEvent.subscribe(this.onLoaderInitComplete,null,this);};c.updateSessionActiveCookie=function(){var j=_instances.cookieManager;var k=j.readCookie("sessionActive");if(!k){var l={path:"/",domain:__params.domain};j.setCookie("sessionActive","true",l);}};c.onLoaderInitComplete=function(){this.handleBrowserHistoryChange();};c.handleBrowserHistoryChange=function(){};h.registerResizableElement("page");a.augmentObject(c,g.Widgetizable);})();
