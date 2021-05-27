/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./_Helper","sap/base/strings/escapeRegExp"],function(_,e){"use strict";var a={"POST":true,"PUT":true,"PATCH":true,"DELETE":true},r=/^\$\d+/,b=/(\S*?)=(?:"(.+)"|(\S+))/;function g(C){var B=c(C,"boundary"),m=C.trim().indexOf("multipart/mixed");if(m!==0||!B){throw new Error('Invalid $batch response header "Content-Type": '+C);}B=e(B);return new RegExp('--'+B+'(?:[ \t]*\r\n|--)');}function c(H,p){var P,i=H.split(";"),m;p=p.toLowerCase();for(P=1;P<i.length;P+=1){m=b.exec(i[P]);if(m[1].toLowerCase()===p){return m[2]||m[3];}}}function d(m){var C=h(m,"content-type");return C.startsWith("multipart/mixed;")?C:undefined;}function f(m){var C=h(m,"content-id"),R;if(!C){throw new Error("Content-ID MIME header missing for the change set response.");}R=parseInt(C);if(isNaN(R)){throw new Error("Invalid Content-ID value in change set response.");}return R;}function h(H,l){var i,m,n=H.split("\r\n");for(i=0;i<n.length;i+=1){m=n[i].split(":");if(m[0].toLowerCase().trim()===l){return m[1].trim();}}}function j(C,R,I){var B=R.split(g(C)),l=[];B=B.slice(1,-1);B.forEach(function(m){var n,o,p,H,q,t,u,v,w,x,i,M,y,z={},A;y=m.indexOf("\r\n\r\n");M=m.slice(0,y);w=m.indexOf("\r\n\r\n",y+4);v=m.slice(y+4,w);n=d(M);if(n){l.push(j(n,m.slice(y+4),true));return;}u=v.split("\r\n");x=u[0].split(" ");z.status=parseInt(x[1]);z.statusText=x.slice(2).join(' ');z.headers={};for(i=1;i<u.length;i+=1){H=u[i];p=H.indexOf(':');q=H.slice(0,p).trim();t=H.slice(p+1).trim();z.headers[q]=t;if(q.toLowerCase()==="content-type"){o=c(t,"charset");if(o&&o.toLowerCase()!=="utf-8"){throw new Error('Unsupported "Content-Type" charset: '+o);}}}z.responseText=m.slice(w+4,-2);if(I){A=f(M);l[A]=z;}else{l.push(z);}});return l;}function s(H){var i,l=[];for(i in H){l.push(i,":",H[i],"\r\n");}return l;}function k(R,C,E){var B=(C!==undefined?"changeset_":"batch_")+_.uid(),i=C!==undefined,l=[];if(i){l.push("Content-Type: multipart/mixed;boundary=",B,"\r\n\r\n");}R.forEach(function(o,m){var n="",u=o.url;if(i){o.$ContentID=m+"."+C;n="Content-ID:"+o.$ContentID+"\r\n";}l.push("--",B,"\r\n");if(Array.isArray(o)){if(i){throw new Error('Change set must not contain a nested change set.');}l=l.concat(k(o,m).body);}else{if(i&&!a[o.method]){throw new Error("Invalid HTTP request method: "+o.method+". Change set must contain only POST, PUT, PATCH or DELETE requests.");}if(C!==undefined&&u[0]==="$"){u=u.replace(r,"$&."+C);}l=l.concat("Content-Type:application/http\r\n","Content-Transfer-Encoding:binary\r\n",n,"\r\n",o.method," ",u," HTTP/1.1\r\n",s(_.resolveIfMatchHeader(o.headers)),"\r\n",JSON.stringify(o.body)||"","\r\n");}});l.push("--",B,"--\r\n",E);return{body:l,batchBoundary:B};}return{deserializeBatchResponse:function(C,R){return j(C,R,false);},serializeBatchRequest:function(R,E){var B=k(R,undefined,E);return{body:B.body.join(""),headers:{"Content-Type":"multipart/mixed; boundary="+B.batchBoundary,"MIME-Version":"1.0"}};}};},false);