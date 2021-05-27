/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/base/strings/capitalize','sap/base/strings/camelize','sap/base/strings/hyphenate','sap/base/strings/escapeRegExp','sap/base/strings/formatMessage'],function(q,c,a,h,e,f){"use strict";q.sap.endsWith=function(s,E){if(typeof(E)!="string"||E==""){return false;}return s.endsWith(E);};q.sap.endsWithIgnoreCase=function(s,E){if(typeof(E)!="string"||E==""){return false;}s=s.toUpperCase();E=E.toUpperCase();return s.endsWith(E);};q.sap.startsWith=function(s,S){if(typeof(S)!="string"||S==""){return false;}return s.startsWith(S);};q.sap.startsWithIgnoreCase=function(s,S){if(typeof(S)!="string"||S==""){return false;}s=s.toUpperCase();S=S.toUpperCase();return s.startsWith(S);};q.sap.charToUpperCase=function(s,p){if(!s){return s;}if(!p||isNaN(p)||p<=0||p>=s.length){return c(s);}var C=s.charAt(p).toUpperCase();if(p>0){return s.substring(0,p)+C+s.substring(p+1);}return C+s.substring(p+1);};q.sap.padLeft=function(s,p,l){if(!s){s="";}if(p&&p.length===1){return s.padStart(l,p);}while(s.length<l){s=p+s;}return s;};q.sap.padRight=function(s,p,l){if(!s){s="";}if(p&&p.length===1){return s.padEnd(l,p);}while(s.length<l){s=s+p;}return s;};q.sap.camelCase=a;q.sap.hyphen=h;q.sap.escapeRegExp=e;q.sap.formatMessage=f;return q;});
