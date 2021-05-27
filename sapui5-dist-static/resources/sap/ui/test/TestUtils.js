/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.sjax","sap/base/Log","sap/base/util/merge","sap/base/util/UriParameters","sap/ui/thirdparty/URI","sap/ui/core/Core"],function(q,L,m,U,a){"use strict";var r=/\/\$batch($|\?)/,b=/(?:^|\r\n)Content-Id\s*:\s*(\S+)/i,c=/^(.*)?:\s*(.*)$/,j="application/json;charset=UTF-8;IEEE754Compatible=true",M={},s="\r\nContent-Type: application/http\r\n"+"Content-Transfer-Encoding: binary\r\n",d=/^Content-Type:\s*multipart\/mixed;\s*boundary=/i,u=U.fromQuery(window.location.search),A=u.get("autoRespondAfter"),R=u.get("realOData"),e=/^(\S+) (\S+)$/,f=/^(GET|DELETE|MERGE|PATCH|POST) (\S+) HTTP\/1\.1$/,D={},g=/^(OData-Version|DataServiceVersion)$/,p=R==="true"||R==="proxy",h=p||R==="direct",k=0,S=u.get("supportAssistant")==="true",T;if(h){document.title=document.title+" (real OData)";}function l(o,E,P){var i=QUnit.objectType(o),t=QUnit.objectType(E),N;if(i==="string"&&t==="regexp"){if(!E.test(o)){throw new Error(P+": actual value "+o+" does not match expected regular expression "+E);}return;}if(i!==t){throw new Error(P+": actual type "+i+" does not match expected type "+t);}if(i==="array"){if(o.length<E.length){throw new Error(P+": array length: "+o.length+" < "+E.length);}}if(i==="array"||i==="object"){for(N in E){l(o[N],E[N],P==="/"?P+N:P+"/"+N);}}else if(o!==E){throw new Error(P+": actual value "+o+" does not match expected value "+E);}}function n(o,E,i,t){try{l(o,E,"/");QUnit.assert.pushResult({result:t,actual:o,expected:E,message:i});}catch(v){QUnit.assert.pushResult({result:!t,actual:o,expected:E,message:(i||"")+" failed because of "+v.message});}}T={awaitRendering:function(){if(sap.ui.getCore().getUIDirty()){return new Promise(function(i){function o(){if(sap.ui.getCore().getUIDirty()){setTimeout(o,1);}else{i();}}o();});}},deepContains:function(o,E,i){n(o,E,i,true);},notDeepContains:function(o,E,i){n(o,E,i,false);},useFakeServer:function(o,B,F,i){var t,v;function w(X,Y){var Z=N(X,Y.requestBody),$=J(Y);k+=1;Y.respond(200,q.extend({},$,{"Content-Type":"multipart/mixed;boundary="+Z.boundary}),G(Z,$));}function x(X){var Y={buildResponse:X.buildResponse,code:X.code||200,headers:X.headers||{},ifMatch:X.ifMatch};if(X.source){Y.message=Q(B+X.source);Y.headers["Content-Type"]=Y.headers["Content-Type"]||z(X.source);}else if(typeof X.message==="object"){Y.headers["Content-Type"]=j;Y.message=JSON.stringify(X.message);}else{Y.message=X.message;}return Y;}function y(){var X,Y,Z={};for(Y in F){X=F[Y];if(!Y.includes(" ")){Y="GET "+Y;}if(Array.isArray(X)){Z[Y]=X.map(x);}else{Z[Y]=[x(X)];}}return Z;}function z(X){if(/\.xml$/.test(X)){return"application/xml";}if(/\.json$/.test(X)){return j;}return"application/x-octet-stream";}function C(X,Y,Z){L.error(Y.requestLine,Z,"sap.ui.test.TestUtils");return{code:X,headers:{"Content-Type":"text/plain"},message:Z};}function E(X){return X.slice(0,X.indexOf("\r\n"));}function G(X,Y){var Z=[""];X.parts.forEach(function($){Z.push($.boundary?"\r\nContent-Type: multipart/mixed;boundary="+$.boundary+"\r\n\r\n"+G($,Y):H($,Y));});Z.push("--\r\n");return Z.join("--"+X.boundary);}function H(X,Y){var Z=q.extend({},Y,X.headers);return s+(X.contentId?"Content-ID: "+X.contentId+"\r\n":"")+"\r\nHTTP/1.1 "+X.code+" \r\n"+Object.keys(Z).map(function($){return $+": "+Z[$];}).join("\r\n")+"\r\n\r\n"+(X.message||"")+"\r\n";}function I(X,Y){var Z,$,_=X+" "+Y;if(v[_]){return{responses:v[_]};}if(!t){return undefined;}Z=[];$=t.filter(function(a1){var b1=_.match(a1.regExp);if(b1){Z.push(b1);}return b1;});if($.length>1){L.warning("Multiple matches found for "+_,undefined,"sap.ui.test.TestUtils");return undefined;}return $.length?{responses:$[0].response,match:Z[0]}:undefined;}function J(X){var Y,Z={};for(Y in X.requestHeaders){if(g.test(Y)){Z[Y]=X.requestHeaders[Y];}}return Z;}function K(X,Y){var Z=I(X.method,X.url),$,_=Z&&Z.responses;_=(_||[]).filter(function($){if(typeof $.ifMatch==="function"){return $.ifMatch(X);}return!$.ifMatch||$.ifMatch.test(X.requestBody);});if(_.length){$=_[0];if(typeof $.buildResponse==="function"){$=m({},$);$.buildResponse(Z.match,$);}}else{switch(X.method){case"HEAD":$={code:200};break;case"DELETE":case"MERGE":case"PATCH":$={code:204};break;case"POST":$={code:200,headers:{"Content-Type":j},message:X.requestBody};break;}}if($){L.info(X.method+" "+X.url,'{"If-Match":'+JSON.stringify(X.requestHeaders["If-Match"])+'}',"sap.ui.test.TestUtils");}else{$=C(404,X,"No mock data found");}$.headers=q.extend({},J(X),$.headers);if(Y&&$.code<300){$.contentId=Y;}return $;}function N(X,Y){var Z;Y=Y.replace(/^\s+/,"");Z=E(Y);return{boundary:E(Y).slice(2),parts:Y.split(Z).slice(1,-1).map(function($){var _,a1,b1,c1,d1,e1;$=$.slice(2);a1=E($);if(d.test(a1)){c1=N(X,$.slice(a1.length+4));_=c1.parts.filter(function(f1){return f1.code>=300;});return _.length?_[0]:c1;}e1=$.indexOf("\r\n\r\n")+4;d1=O(X,$.slice(e1));b1=b.exec($.slice(0,e1));return K(d1,b1&&b1[1]);})};}function O(X,Y){var Z=Y.indexOf("\r\n\r\n"),$,_,a1={requestHeaders:{}};a1.requestBody=Y.slice(Z+4,Y.length-2);Y=Y.slice(0,Z);$=Y.split("\r\n");a1.requestLine=$.shift();_=f.exec(a1.requestLine);if(_){a1.method=_[1];a1.url=X+_[2];$.forEach(function(b1){var _=c.exec(b1);if(_){a1.requestHeaders[_[1]]=_[2];}});}return a1;}function P(X){var Y=X.url;if(r.test(Y)){w(Y.slice(0,Y.indexOf("/$batch")+1),X);}else{V(X);}}function Q(X){var Y=M[X];if(!Y){q.ajax({async:false,url:X,dataType:"text",success:function(Z){Y=Z;}});if(!Y){throw new Error(X+": resource not found");}M[X]=Y;}return Y;}function V(X){var Y=K(X);k+=1;X.respond(Y.code,Y.headers,Y.message);}function W(){var X,Y;v=y();if(i){t=i.map(function(Z){return{regExp:Z.regExp,response:Array.isArray(Z.response)?Z.response.map(x):[x(Z.response)]};});}Y=sinon.fakeServer.create();o.add(Y);Y.autoRespond=true;if(A){Y.autoRespondAfter=parseInt(A);}Y.respondWith("GET",/./,V);Y.respondWith("DELETE",/./,V);Y.respondWith("HEAD",/./,V);Y.respondWith("PATCH",/./,V);Y.respondWith("MERGE",/./,V);Y.respondWith("POST",/./,P);X=Y.restore;Y.restore=function(){sinon.FakeXMLHttpRequest.filters=[];X.apply(this,arguments);};sinon.xhr.supportsCORS=q.support.cors;sinon.FakeXMLHttpRequest.useFilters=true;sinon.FakeXMLHttpRequest.addFilter(function(Z,$){return Z!=="DELETE"&&Z!=="HEAD"&&Z!=="MERGE"&&Z!=="PATCH"&&Z!=="POST"&&!I(Z,$);});}B=sap.ui.require.toUrl(B).replace(/(^|\/)resources\/(~[-a-zA-Z0-9_.]*~\/)?/,"$1test-resources/")+"/";W();},withNormalizedMessages:function(C){var o=sinon.sandbox.create();try{var t=sap.ui.getCore(),G=t.getLibraryResourceBundle;o.stub(t,"getLibraryResourceBundle").returns({getText:function(K,v){var w=K,x=G.call(t).getText(K),i;for(i=0;i<10;i+=1){if(x.indexOf("{"+i+"}")>=0){w+=" "+(i>=v.length?"{"+i+"}":v[i]);}}return w;}});C.apply(this);}finally{o.verifyAndRestore();}},isRealOData:function(){return h;},isSupportAssistant:function(){return S;},getRealOData:function(){return R?"&realOData="+R:"";},getRequestCount:function(){return k;},proxy:function(i){var P,Q;if(!p){return i;}Q=i.indexOf("?");P=sap.ui.require.toUrl("sap/ui").replace("resources/sap/ui","proxy");return new a(P+i,document.baseURI).pathname().toString()+(Q>=0?i.slice(Q):"");},resetRequestCount:function(){k=0;},retrieveData:function(K){var v=D[K];delete D[K];return v;},setData:function(K,v){D[K]=v;},setupODataV4Server:function(o,F,i,t,v){var w={};if(h){return;}if(!t){t="/";}else if(t.slice(-1)!=="/"){t+="/";}Object.keys(F).forEach(function(x){var y=e.exec(x),z,B;if(y){z=y[1]||"GET";B=y[2];}else{z="GET";B=x;}if(!B.startsWith("/")){B=t+B;}w[z+" "+B]=F[x];});T.useFakeServer(o,i||"sap/ui/core/qunit/odata/v4/data",w,v);}};return T;},true);
