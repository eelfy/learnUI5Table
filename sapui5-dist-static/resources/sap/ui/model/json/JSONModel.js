/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/model/ClientModel','sap/ui/model/Context','./JSONListBinding','./JSONPropertyBinding','./JSONTreeBinding',"sap/base/Log","sap/ui/thirdparty/jquery","sap/base/util/isPlainObject"],function(C,a,J,b,c,L,q,d){"use strict";var f=C.extend("sap.ui.model.json.JSONModel",{constructor:function(D,o){this.pSequentialImportCompleted=Promise.resolve();C.apply(this,arguments);this.bObserve=o;if(D&&typeof D=="object"){this.setData(D);}},metadata:{publicMethods:["setJSON","getJSON"]}});f.prototype.setData=function(D,m){if(m){this.oData=q.extend(true,Array.isArray(this.oData)?[]:{},this.oData,D);}else{this.oData=D;}if(this.bObserve){this.observeData();}this.checkUpdate();};f.prototype.observeData=function(){var t=this;function e(v){return function(){return v;};}function g(O,n){return function(v){o(v,O,n);t.checkUpdate();};}function h(O,n,v){if(typeof v=="function"){O[n]=v;}else{Object.defineProperty(O,n,{get:e(v),set:g(O,n)});}}function o(O,p,n){if(Array.isArray(O)){for(var i=0;i<O.length;i++){o(O[i],O,i);}}else if(d(O)){for(var i in O){o(O[i],O,i);}}if(p){h(p,n,O);}}o(this.oData);};f.prototype.setJSON=function(j,m){var o;try{o=JSON.parse(j+"");this.setData(o,m);}catch(e){L.fatal("The following problem occurred: JSON parse Error: "+e);this.fireParseError({url:"",errorCode:-1,reason:"",srcText:e,line:-1,linepos:-1,filepos:-1});}};f.prototype.getJSON=function(){return JSON.stringify(this.oData);};f.prototype.loadData=function(u,p,A,t,m,e,h){var g;A=(A!==false);t=t||"GET";e=e===undefined?this.bCache:e;this.fireRequestSent({url:u,type:t,async:A,headers:h,info:"cache="+e+";bMerge="+m,infoObject:{cache:e,merge:m}});var s=function(D){if(!D){L.fatal("The following problem occurred: No data was retrieved by service: "+u);}this.setData(D,m);this.fireRequestCompleted({url:u,type:t,async:A,headers:h,info:"cache="+e+";bMerge="+m,infoObject:{cache:e,merge:m},success:true});}.bind(this);var E=function(P,T){var M=T||P.textStatus;var P=A?P.request:P;var S=P.status;var j=P.statusText;var r=P.responseText;var o={message:M,statusCode:S,statusText:j,responseText:r};L.fatal("The following problem occurred: "+M,r+","+S+","+j);this.fireRequestCompleted({url:u,type:t,async:A,headers:h,info:"cache="+e+";bMerge="+m,infoObject:{cache:e,merge:m},success:false,errorobject:o});this.fireRequestFailed(o);if(A){return Promise.reject(o);}}.bind(this);var _=function(s,E){this._ajax({url:u,async:A,dataType:'json',cache:e,data:p,headers:h,type:t,success:s,error:E});}.bind(this);if(A){g=new Promise(function(r,j){var R=function(x,T,o){j({request:x,textStatus:T,error:o});};_(r,R);});var i=this.pSequentialImportCompleted.then(function(){return g.then(s,E);});this.pSequentialImportCompleted=i.catch(function(o){L.error("Loading of data failed: "+o.stack);});return i;}else{_(s,E);}};f.prototype.dataLoaded=function(){return this.pSequentialImportCompleted;};f.prototype.bindProperty=function(p,o,P){var B=new b(this,p,o,P);return B;};f.prototype.bindList=function(p,o,s,F,P){var B=new J(this,p,o,s,F,P);return B;};f.prototype.bindTree=function(p,o,F,P,s){var B=new c(this,p,o,F,P,s);return B;};f.prototype.setProperty=function(p,v,o,A){var r=this.resolve(p,o),l,O,P;if(!r){return false;}if(r=="/"){this.setData(v);return true;}l=r.lastIndexOf("/");O=r.substring(0,l||1);P=r.substr(l+1);var e=this._getObject(O);if(e){e[P]=v;this.checkUpdate(false,A);return true;}return false;};f.prototype.getProperty=function(p,o){return this._getObject(p,o);};f.prototype._getObject=function(p,o){var n=this.isLegacySyntax()?this.oData:null;if(o instanceof a){n=this._getObject(o.getPath());}else if(o!=null){n=o;}if(!p){return n;}var P=p.split("/"),i=0;if(!P[0]){n=this.oData;i++;}while(n&&P[i]){n=n[P[i]];i++;}return n;};f.prototype.isList=function(p,o){var A=this.resolve(p,o);return Array.isArray(this._getObject(A));};f.prototype._setMetaModel=function(m){this._oMetaModel=m;};f.prototype.getMetaModel=function(){return this._oMetaModel;};return f;});
