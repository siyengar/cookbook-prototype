function verifyDapResize(a){var b=dapMgr.adCont;!b[a].resizeCalled&&dap_Resize(b[a].ifrmid,b[a].w,b[a].h)}function dap_Resize(a,c,b){document.getElementById(a).width=c;document.getElementById(a).height=b;c>0&&b>0&&dapMgr.saveAdResize(a,c,b)}function ShowAcb(){}var _dapUtils=new function(){var a=navigator.userAgent.toLowerCase(),g=navigator.appVersion.toLowerCase(),b=parseFloat(g),f=parseInt(b),e=a.indexOf("mac")!=-1;this.is_opera=a.indexOf("opera")!=-1;this.is_ff=a.indexOf("firefox")!=-1;var c=g.indexOf("msie");if(c!=-1){if(e){c=a.indexOf("msie");b=parseFloat(a.substring(c+5,a.indexOf(";",c)))}else b=parseFloat(g.substring(c+5,g.indexOf(";",c)));f=parseInt(b)}var d=c!=-1&&!this.is_opera;this.is_ie=d;this.is_ie5up=d&&b>=5;this.is_ie5_5=d&&a.indexOf("msie 5.5")!=-1;this.is_ie5_5up=d&&b>=5.5;this.is_ie6=d&&f==6;this.is_ie6up=d&&b>=6;this.is_win=a.indexOf("win")!=-1||a.indexOf("16bit")!=-1;if(e)this.is_win=!e;if(this.is_ff){this.ffPos=a.indexOf("firefox");if(a.length>this.ffPos+8)f=parseInt(a.substring(this.ffPos+8));if(a.length>this.ffPos+10)b=parseInt(a.substring(this.ffPos+10))}this.is_mac=e;this.minorVer=b;this.majorVer=f;this.getCurrentStyle=function(a){return window.getComputedStyle?window.getComputedStyle(a,null)?window.getComputedStyle(a,null):document.defaultView.getComputedStyle(a,null):a.currentStyle}},dapMgr=new function(){var c=['//rad.msn.com/ADSAdClient31.dll?GetSAd=','//a.rad.msn.com/ADSAdClient31.dll?GetSAd=', '//b.rad.msn.com/ADSAdClient31.dll?GetSAd='],j=0,h=100,b=_dapUtils.is_ie&&_dapUtils.majorVer<8?2:6;this.adCont=[];var k=function(e,a,b,d,c){this.qs=e;this.divid=a;this.ifrmid=b;this.w=d;this.h=c;this.resizeCalled=false};this.renderAd=function(c,g,f,e){var a=this.adCont,b=d(c);if(b>-1){a[b].qs=g;a[b].divid=c;a[b].w=f;a[b].h=e}else{if(a.length<h){var j=new k(g,c,"dapIfM"+a.length,f,e);a.push(j)}else return;b=a.length-1}i(b)};this.saveAdResize=function(c,e,d){for(var b=this.adCont,a=0;a<b.length;a++)if(b[a].ifrmid==c){b[a].w=e;b[a].h=d;b[a].resizeCalled=true;return}};this.enableACB=function(){};var d=function(b){for(var a=0;a<dapMgr.adCont.length;a++)if(dapMgr.adCont[a].divid==b)return a},i=function(d){var e=dapMgr.adCont,k=c[Math.floor(j++%(c.length*b)/b)],i=document.getElementById(e[d].divid);if(!i)return;if(!e[d].qs||e[d].qs.length==0)return;var n=_dapUtils.getCurrentStyle(i);if(n){var m=n.display;if(m=="none"||m=="hidden")return}var l=e[d].ifrmid,a=document.createElement("IFRAME");a.id=l;a.name=l;a.width=e[d].w;a.height=e[d].h;a.scrolling="no";a.frameBorder="0";a.allowTransparency=true;i.insertBefore(a,i.firstChild);if(k.length>0)k+="&DPJS=4";k+=g;var o=f(k+e[d].qs,l,d),h=a.contentDocument;if(h&&h.write){h.write(o);!_dapUtils.is_ie&&!_dapUtils.is_opera&&h.close()}else a.src="javascript:'"+o+"'"},f=function(d,c,b){var a='<html><head><title>Advertisement</title></head><body id="'+c+'" leftmargin="0" topmargin="0" style="background-color:transparent"><script type="text/javascript">var inDapIF=true; var inDapMgrIf=true;';if(document.domain&&location.hostname!=document.domain)a+='document.domain="'+document.domain+'";';a+='<\/script><script type="text/javascript">function startTimer(){if (event.srcElement.readyState == "complete") {parent.verifyDapResize('+b+');window.setTimeout("document.close();", 2000);}}<\/script><script type="text/javascript"  src="'+d+'" onreadystatechange="startTimer();" onload="parent.verifyDapResize('+b+');"><\/script></body></html>';return a},a=function(a,d,e){if(a!=null){var c=a.toLowerCase().indexOf(d.toLowerCase()+"=");if(c!=-1){c+=d.length+1;var b=a.indexOf(e,c);b=b==-1?a.length:b;return a.substring(c,b)}}return""},e=function(){var e=document.cookie,f=escape(a(e,"mh",";")),d=f!=""?"&PN="+f:"",b=escape(a(a(e,"ANON",";"),"A","&")),c=escape(a(e,"MUID",";"));if(b=="")b=c;d+=b!=""?"&ID="+b:"";d+=c!=""?"&MUID="+c:"";return d},g=e()}