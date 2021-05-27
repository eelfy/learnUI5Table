/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/base/Log","sap/ui/documentation/sdk/util/Resources"],function(q,L,R){"use strict";var t;var l={};function g(){if(l["index"]){return Promise.resolve(l["index"]);}return new Promise(function(r,e){q.ajax({async:true,url:R.getResourceOriginPath("/docs/api/api-index.json"),dataType:'json',success:function(v){var f=v.symbols||[];l["index"]=f;r(f);},error:function(){q.ajax({async:true,url:R.getResourceOriginPath("../../../../../../docs/api/api-index.json"),dataType:'json',success:function(v){var f=v.symbols||[];l["index"]=f;r(f);},error:function(){L.error("failed to load api-index.json");l["index"]=[];r([]);}});}});});}function a(){if(l["deprecated"]){return Promise.resolve(l["deprecated"]);}return new Promise(function(r,e){q.ajax({async:true,url:R.getResourceOriginPath("/docs/api/api-index-deprecated.json"),dataType:'json',success:function(v){l["deprecated"]=v;r(v);},error:function(){e();}});});}function b(){if(l["experimental"]){return Promise.resolve(l["experimental"]);}return new Promise(function(r,e){q.ajax({async:true,url:R.getResourceOriginPath("/docs/api/api-index-experimental.json"),dataType:'json',success:function(v){l["experimental"]=v;r(v);},error:function(){e();}});});}function c(){if(l["since"]){return Promise.resolve(l["since"]);}return new Promise(function(r,e){q.ajax({async:true,url:R.getResourceOriginPath("/docs/api/api-index-since.json"),dataType:'json',success:function(v){l["since"]=v;r(v);},error:function(){e();}});});}function d(e){if(!e){return Promise.resolve([]);}if(l[e]){return Promise.resolve(l[e]);}return new Promise(function(r){q.ajax({async:true,url:R.getResourceOriginPath(t+e.replace(/\./g,'/')+'/designtime/apiref/api.json'),dataType:'json',success:function(v){var f=v.symbols||[];l[e]=f;r(f);},error:function(f){L.error("failed to load api.json for: "+e);l[e]=[];r([]);}});});}function s(r){r=r==null?sap.ui.require.toUrl("")+"/"+'../test-resources/':r;if(r.slice(-1)!='/'){r+='/';}t=r;}s();return{_setRoot:s,getIndexJsonPromise:g,getDeprecatedPromise:a,getExperimentalPromise:b,getSincePromise:c,getLibraryElementsJSONPromise:d};});
