/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/documentation/sdk/controller/util/ResponsiveImageMap"],function(R){"use strict";var C="200px",r=/.+\/(.+)/;var t=function(a,$,b){if(b){$.setAttribute(a,true);}else{$.removeAttribute(a);}};var S=function(d){var m=d.querySelector('map'),i=d.querySelector('img');R.call(this,m,i);this.aSections=[].slice.call(d.querySelectorAll("section"));this.bStatic=d.dataset.staticType==="true";this.bRestoreSize=false;this.oMap=m;this.fnHandlers=Object.assign(this.fnHandlers,{click:this.onclick.bind(this),resize:this.resize.bind(this),imgMouseenter:this.onmouseenterImage.bind(this),imgMouseleave:this.onmouseleaveImage.bind(this)});this.areas.forEach(function(a){a.element.addEventListener("click",this.fnHandlers.click);},this);if(!this.bStatic){this.oImg.addEventListener("transitionend",this.fnHandlers.resize);this.oImg.addEventListener("mouseenter",this.fnHandlers.imgMouseenter);this.oImg.addEventListener("mouseleave",this.fnHandlers.imgMouseleave);}this.showSection(this.aSections[0].getAttribute("id"));};S.prototype=Object.create(R.prototype);S.prototype.constructor=S;S.prototype.showSection=function(s){this.aSections.forEach(function(o){t("hidden",o,o.getAttribute("id")!==s);});};S.prototype.onmouseenterImage=function(){if(this.bRestoreSize){this.oImg.style.width=this.iOriginalWidth+"px";this.bRestoreSize=false;this.resize();}};S.prototype.onmouseleaveImage=function(e){if(this.oMap.contains(e.relatedTarget)||this.oImg.contains(e.relatedTarget)){return;}this.bRestoreSize=true;};S.prototype.onclick=function(e){var T=e.target.alt.match(r)[1];e.preventDefault();this.showSection(T);if(!this.bStatic){this.oImg.style.width=C;}};S.prototype.removeEventListeners=function(){R.prototype.exit.call(this);this.areas.forEach(function(a){a.element.removeEventListener("click",this.fnHandlers.click);},this);if(!this.bStatic){this.oImg.removeEventListener("transitionend",this.fnHandlers.resize);this.oImg.removeEventListener("mouseenter",this.fnHandlers.imgMouseenter);this.oImg.removeEventListener("mouseleave",this.fnHandlers.imgMouseleave);}};return S;});
