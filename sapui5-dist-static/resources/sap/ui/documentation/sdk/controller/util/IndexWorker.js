/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
(function(){"use strict";fetch("../../../../../../../documentation-config.js").then(function(r){if(r.ok){importScripts(r.url);var R={getResourceOriginPath:function(P){var C=self['sap-ui-documentation-config'],i=(C&&C.demoKitResourceOrigin)||'.';return i+this._formatPath(P);},_formatPath:function(P){P=P.replace(/^\.\//,'/');if(!P.match(/^\//)){P="/"+P;}return P;}};U.SEARCH_INDEX=R.getResourceOriginPath("../../../../../../../searchindex.json");}});var U={SEARCH_INDEX:"../../../../../../../searchindex.json",SEARCH_LIB:"../../thirdparty/elasticlunr.js",PROMISE_POLYFIL_LIB:"../../../../../../sap/ui/thirdparty/es6-promise.js"};var A={"properties":"controlProperties","fields":"properties","aggregations":"aggregations","associations":"associations","events":"events","specialSettings":"specialsettings","annotations":"annotations","methods":"methods"},a={"properties":"property","fields":"field","aggregations":"aggregation","associations":"association","events":"event","specialSettings":"specialsetting","annotations":"annotation","methods":"method"},D={"documentation":"topics","samples":"entity","apiref":"apiref"};if(!self.Promise){importScripts(U.PROMISE_POLYFIL_LIB);}importScripts(U.SEARCH_LIB);var W={COMMANDS:{INIT:"fetch",SEARCH:"search"},RESPONSE_FIELDS:{DONE:"bDone",SEARCH_RESULT:"oSearchResult"}},M=["properties","aggregations","associations","events","methods","specialSettings","annotations"],I=M.concat(["title","contents","paramTypes"]),b=["get","set","add","insert","remove","destroy","indexOf","attach","detach"],c=new RegExp("[a-zA-Z]+"),O=" ",o={},d=false;self.addEventListener('message',function(E){var i=E.data,C=i&&i.cmd;if(C===W.COMMANDS.INIT){d=E.data.bIsMsieBrowser;f().then(function(){var r={};r[W.RESPONSE_FIELDS.DONE]=true;self.postMessage(r);});}else if(C===W.COMMANDS.SEARCH){s(E.data.sQuery,E.data.preferencedCategory).then(function(q){var r={};r[W.RESPONSE_FIELDS.SEARCH_RESULT]=q;self.postMessage(r);});}},false);function f(){return new Promise(function(r,i){var q=o["index"],t;if(q){r(q);return;}var u=new XMLHttpRequest(),v=function(E){if(E.target.response===null){return self.postMessage({error:"Resource file searchindex.json not found"});}t=E.target.response;if(typeof t!=='object'){t=JSON.parse(t);}t=g(t);e();q=lunr.Index.load(t.lunr);o["index"]=q;o["docs"]=t.docs;r(q);};if(!d){u.responseType='json';}u.addEventListener("load",v,false);u.open("get",U.SEARCH_INDEX);u.send();});}function s(q,P){q=p(q);return new Promise(function(r,i){f().then(function(t){var u,v=new S();function w(F,x,R){var y=t.search(x,j(F));v.add(y,x,F,R);}w("title",q);M.forEach(function(F){lunr.tokenizer(q).forEach(function(x){w(F,x,true);});});w("paramTypes",q);w("contents",q);u=v.getAll();u=l(u,q,P);r({success:u.data&&!!(u.data.length),totalHits:u.data&&u.data.length,matches:u});});});}function p(q){var r;for(var i=0;i<b.length;i++){var P=b[i];if(q.indexOf(P)===0){r=q.substring(P.length);}}if(r&&c.test(r)){q+=O+r;}return q;}function e(){var i=lunr.tokenizer;var r=/[-./#_,;\(\)=><|]/g;lunr.tokenizer=function(q){return i.call(lunr,q).reduce(function(t,u){if(r.test(u)){u=u.replace(r," ");t.push.apply(t,u.toLowerCase().split(/ +/));}else{t.push(u.toLowerCase());}return t;},[]);};Object.keys(i).forEach(function(q){lunr.tokenizer[q]=i[q];});}function g(q){function r(F){var i=q.lunr.index[F].tfValues;i[0]=NaN;q.lunr.index[F].tfValues=undefined;function v(C){var y=[];C.split(",").forEach(function(z){var P=z.split(":"),K=parseInt(P[0]),B=P[1];while(B.length>0){y.push(B.slice(0,K));B=B.slice(K);}});return y;}function w(N){var y=N.docs,C=0;if(y===undefined){N.docs={};}else{Object.keys(y).forEach(function(z){if(typeof y[z]==='number'){y[z]={tf:i[y[z]]};}if(z.indexOf(':')>=0){var B=v(z);B.forEach(function(E){y[E]=y[z];C++;});y[z]=undefined;}else{C++;}});}if(N.df===undefined){N.df=C;}}function x(N){w(N);Object.keys(N).forEach(function(K){if(K!=='docs'&&K!=='df'){var V=N[K];var L=K.length;if(L>1){while(--L>0){var T={};T[K.charAt(L)]=V;V=T;}N[K.charAt(0)]=V;N[K]=undefined;}x(V);}});}x(q.lunr.index[F].root);}function t(N,P){for(var i in N){P.apply(N,[i,N[i]]);if(N[i]!==null&&typeof(N[i])=="object"){t(N[i],P);}}}function u(K,v){if(v===undefined){delete this[K];}}I.forEach(function(F){r(F);});t(q,u);return q;}var S=function(){var i=o["docs"];if(!i){throw new Error("docs are required");}this._oDocs=i;this._oCollectedResults={};};S.prototype.add=function(r,q,i,R){r.forEach(function(t){this._mergeResultWithDocInfo(t,q,i,R);this._oCollectedResults[this._getResultId(t)]=t;}.bind(this));return this;};S.prototype.getAll=function(){return k(this._oCollectedResults);};S.prototype._mergeResultWithDocInfo=function(r,q,i,R){var t=this._oDocs[r.ref];r.doc=t;r.matchedDocField=i;if(R){r.matchedDocWord=h(t[i],q);}};S.prototype._getResultId=function(r){var i=r.ref,q=r.matchedDocWord||"";return i+"/"+q;};function h(w,t){if(w){var i=function(u){return u.toLowerCase().indexOf(t.toLowerCase())===0;};var q=w.split(" ");var r=q.filter(i);if(r.length){return r[0];}}return null;}function j(F){var C={fields:{},expand:true};C.fields[F]={};return C;}function k(i){var K=Object.keys(i),v=[];K.forEach(function(q){v.push(i[q]);});return v;}function l(q,Q,P){var N,r=0,t=[],u=[],v=[],w=[],F=[],x=0,y=0,z=0,E=0;if(q){for(var i=0;i<q.length;i++){var B=q[i],C=B.doc;C.modifiedStr=C.modified+"";var G=C.modifiedStr.substring(0,4)+"/"+C.modifiedStr.substring(4,6)+"/"+C.modifiedStr.substring(6,8)+", "+C.modifiedStr.substring(8,10)+":"+C.modifiedStr.substring(10),T=C.title,H=C.summary,J=C.path,K=false,L,R;if(C.category===D.documentation){J=J.substring(0,J.lastIndexOf(".html"));K=true;L="Documentation";R={title:T?T:"Untitled",path:J,summary:H||"",score:C.score,modified:G,category:L};v.push(R);z++;}else if(C.category===D.samples){K=true;L="Samples";R={title:T?T+" (samples)":"Untitled",path:J,summary:H||"",score:C.score,modified:G,category:L};w.push(R);E++;}else if(C.category===D.apiref){J=_(B);T=m(B);H=n(B);K=true;L="API Reference";R={title:T,path:J,summary:H||"",score:C.score,modified:G,category:L};u.push(R);y++;}if(K){t.push(R);x++;if((F.length<10)&&(C.category===P)){F.push(R);}}}}while((F.length<10)&&(r<t.length)){N=t[r++];if(F.indexOf(N)===-1){F.push(N);}}return{data:t,aDataAPI:u,aDataDoc:v,aDataExplored:w,filteredData:F,AllLength:x,APILength:y,DocLength:z,ExploredLength:E};}function _(i){var E=i.matchedDocField,q=i.doc.title,r=A[E],u;u="api/"+q;if(r){u+="#"+r;}if(E==="methods"){u+="/"+i.matchedDocWord;}return u;}function m(i){var q=i.doc,r=a[i.matchedDocField],t=i.matchedDocWord;if(r&&t){return t+" ("+r+")";}if(q.kind){return q.title+" ("+q.kind+")";}return q.title;}function n(i){var q=i.doc,r=a[i.matchedDocField],t=i.matchedDocWord,u=r&&t;if(u){return q.title;}return q.summary;}})();