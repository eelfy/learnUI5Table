/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var _={};var A={fetch:function(u,t){if(!(u in _)){_[u]=this._fetch(u,t);}return _[u];},_fetch:function(u,t){return new Promise(function(r,a){var R,s,b=this._getExpectedResponseType(u,t);function h(e){s=e.type==="load"&&(R.status===200||R.status===0);if(!s){a(new Error("could not fetch '"+u+"': "+R.status));return;}r(A._readResponse(R));}R=new XMLHttpRequest();R.open("GET",u,true);R.responseType=b;R.onload=R.onerror=h;R.send();}.bind(this));},_readResponse:function(r){var R=r.responseType,o=(R==="text")?r.responseText:r.response;if(R==="arraybuffer"){try{o=new Uint8Array(o);}catch(e){}}return o;},_getExpectedResponseType:function(r,t){if(r.match(/.+(.js|.json|.less|.xml|.html|.properties|.css|.svg|.md|.txt)$/i)||t){return"text";}return"arraybuffer";}};return A;},true);
