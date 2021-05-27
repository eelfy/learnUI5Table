/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/base/Log'],function(L){"use strict";var F=function(s){this.mSettings=s||{};this.sMode=this.mSettings.mode||F.Mode.ALLOW;this.fnCallback=this.mSettings.callback;this.iTimeout=this.mSettings.timeout||10000;this.bBlockEvents=this.mSettings.blockEvents!==false;this.bShowBlockLayer=this.mSettings.showBlockLayer!==false;this.bAllowSameOrigin=this.mSettings.allowSameOrigin!==false;this.sParentOrigin='';this.bUnlocked=false;this.bRunnable=false;this.bParentUnlocked=false;this.bParentResponded=false;this.sStatus="pending";this.aFPChilds=[];var t=this;this.iTimer=setTimeout(function(){if(t.bRunnable&&t.bParentResponded&&!t.bParentUnlocked){L.error("Reached timeout of "+t.iTimeout+"ms waiting for the parent to be unlocked","","sap/ui/security/FrameOptions");}else{L.error("Reached timeout of "+t.iTimeout+"ms waiting for a response from parent window","","sap/ui/security/FrameOptions");}t._callback(false);},this.iTimeout);var h=function(){t._handlePostMessage.apply(t,arguments);};F.__window.addEventListener('message',h);if(F.__parent===F.__self||F.__parent==null||this.sMode===F.Mode.ALLOW){this._applyState(true,true);}else{this._lock();if(this.sMode===F.Mode.DENY){L.error("Embedding blocked because configuration mode is set to 'DENY'","","sap/ui/security/FrameOptions");this._callback(false);return;}if(this.bAllowSameOrigin){try{var p=F.__parent;var o=false;var T=true;do{var a=p.document.domain;if(p==F.__top){if(a!=undefined){o=true;}break;}p=p.parent;}while(T);if(o){this._applyState(true,true);}}catch(e){this._sendRequireMessage();}}else{this._sendRequireMessage();}}};F.Mode={TRUSTED:'trusted',ALLOW:'allow',DENY:'deny'};F.__window=window;F.__parent=parent;F.__self=self;F.__top=top;F._events=["mousedown","mouseup","click","dblclick","mouseover","mouseout","touchstart","touchend","touchmove","touchcancel","keydown","keypress","keyup"];F.prototype.match=function(p,P){if(!(/\*/i.test(P))){return p==P;}else{P=P.replace(/\//gi,"\\/");P=P.replace(/\./gi,"\\.");P=P.replace(/\*/gi,".*");P=P.replace(/:\.\*$/gi,":\\d*");if(P.substr(P.length-1,1)!=='$'){P=P+'$';}if(P.substr(0,1)!=='^'){P='^'+P;}var r=new RegExp(P,'i');return r.test(p);}};F._lockHandler=function(e){e.stopPropagation();e.preventDefault();};F.prototype._createBlockLayer=function(){if(document.readyState=="complete"){var l=document.createElement("div");l.style.position="absolute";l.style.top="-1000px";l.style.bottom="-1000px";l.style.left="-1000px";l.style.right="-1000px";l.style.opacity="0";l.style.backgroundColor="white";l.style.zIndex=2147483647;document.body.appendChild(l);this._lockDiv=l;}};F.prototype._setCursor=function(){if(this._lockDiv){this._lockDiv.style.cursor=this.sStatus=="denied"?"not-allowed":"wait";}};F.prototype._lock=function(){var t=this;if(this.bBlockEvents){for(var i=0;i<F._events.length;i++){document.addEventListener(F._events[i],F._lockHandler,true);}}if(this.bShowBlockLayer){this._blockLayer=function(){t._createBlockLayer();t._setCursor();};if(document.readyState=="complete"){this._blockLayer();}else{document.addEventListener("readystatechange",this._blockLayer);}}};F.prototype._unlock=function(){if(this.bBlockEvents){for(var i=0;i<F._events.length;i++){document.removeEventListener(F._events[i],F._lockHandler,true);}}if(this.bShowBlockLayer){document.removeEventListener("readystatechange",this._blockLayer);if(this._lockDiv){document.body.removeChild(this._lockDiv);delete this._lockDiv;}}};F.prototype._callback=function(s){this.sStatus=s?"allowed":"denied";this._setCursor();clearTimeout(this.iTimer);if(typeof this.fnCallback==='function'){this.fnCallback.call(null,s);}};F.prototype._applyState=function(i,I){if(this.bUnlocked){return;}if(i){this.bRunnable=true;}if(I){this.bParentUnlocked=true;}if(!this.bRunnable||!this.bParentUnlocked){return;}this._unlock();this._callback(true);this._notifyChildFrames();this.bUnlocked=true;};F.prototype._applyTrusted=function(t){if(t){this._applyState(true,false);}else{this._callback(false);}};F.prototype._check=function(p){if(this.bRunnable){return;}var t=false;if(this.bAllowSameOrigin&&this.sParentOrigin&&F.__window.document.URL.indexOf(this.sParentOrigin)==0){t=true;}else if(this.mSettings.allowlist&&this.mSettings.allowlist.length!=0){var h=this.sParentOrigin.split('//')[1];h=h.split(':')[0];for(var i=0;i<this.mSettings.allowlist.length;i++){var m=h.indexOf(this.mSettings.allowlist[i]);if(m!=-1&&h.substring(m)==this.mSettings.allowlist[i]){t=true;break;}}}if(t){this._applyTrusted(t);}else if(this.mSettings.allowlistService){var a=this;var x=new XMLHttpRequest();var u=this.mSettings.allowlistService+'?parentOrigin='+encodeURIComponent(this.sParentOrigin);x.onreadystatechange=function(){if(x.readyState==4){a._handleXmlHttpResponse(x,p);}};x.open('GET',u,true);x.setRequestHeader('Accept','application/json');x.send();}else{L.error("Embedding blocked because the allowlist or the allowlist service is not configured correctly","","sap/ui/security/FrameOptions");this._callback(false);}};F.prototype._handleXmlHttpResponse=function(x,p){if(x.status===200){var t=false;var r=x.responseText;var R=JSON.parse(r);if(R.active==false){this._applyState(true,true);}else if(p){return;}else{if(this.match(this.sParentOrigin,R.origin)){t=R.framing;}if(!t){L.error("Embedding blocked because the allowlist service does not allow framing","","sap/ui/security/FrameOptions");}this._applyTrusted(t);}}else{L.error("The configured allowlist service is not available: "+x.status,"","sap/ui/security/FrameOptions");this._callback(false);}};F.prototype._notifyChildFrames=function(){for(var i=0;i<this.aFPChilds.length;i++){this.aFPChilds[i].postMessage('SAPFrameProtection*parent-unlocked','*');}};F.prototype._sendRequireMessage=function(){F.__parent.postMessage('SAPFrameProtection*require-origin','*');if(this.mSettings.allowlistService){setTimeout(function(){if(!this.bParentResponded){this._check(true);}}.bind(this),10);}};F.prototype._handlePostMessage=function(e){var s=e.source,d=e.data;if(s===F.__self||s==null||typeof d!=="string"||d.indexOf("SAPFrameProtection*")===-1){return;}if(s===F.__parent){this.bParentResponded=true;if(!this.sParentOrigin){this.sParentOrigin=e.origin;this._check();}if(d=="SAPFrameProtection*parent-unlocked"){this._applyState(false,true);}}else if(s.parent===F.__self&&d=="SAPFrameProtection*require-origin"&&this.bUnlocked){s.postMessage("SAPFrameProtection*parent-unlocked","*");}else{s.postMessage("SAPFrameProtection*parent-origin","*");this.aFPChilds.push(s);}};return F;});