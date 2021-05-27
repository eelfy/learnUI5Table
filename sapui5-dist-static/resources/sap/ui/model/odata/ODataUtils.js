/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/model/Sorter','sap/ui/model/FilterProcessor','sap/ui/core/format/DateFormat',"sap/base/Log","sap/base/assert","sap/ui/thirdparty/jquery","sap/base/security/encodeURL","sap/ui/core/CalendarType"],function(S,F,D,L,a,q,e,C){"use strict";var d,o,b,r=/^([-+]?)0*(\d+)(\.\d+|)$/,t,c=/\.$/,f=/0+$/;function s(){if(!d){d=D.getDateInstance({pattern:"'datetime'''yyyy-MM-dd'T'HH:mm:ss''",calendarType:C.Gregorian});o=D.getDateInstance({pattern:"'datetime'''yyyy-MM-dd'T'HH:mm:ss.SSS''",calendarType:C.Gregorian});b=D.getDateInstance({pattern:"'datetimeoffset'''yyyy-MM-dd'T'HH:mm:ss'Z'''",calendarType:C.Gregorian});t=D.getTimeInstance({pattern:"'time''PT'HH'H'mm'M'ss'S'''",calendarType:C.Gregorian});}}var O=function(){};O.createSortParams=function(x){var y;if(!x||x.length==0){return;}y="$orderby=";for(var i=0;i<x.length;i++){var z=x[i];if(z instanceof S){y+=z.sPath;y+=z.bDescending?"%20desc":"%20asc";y+=",";}else{L.error("Trying to use "+z+" as a Sorter, but it is a "+typeof z);}}y=y.slice(0,-1);return y;};function g(i){if(i&&typeof i.convert==="function"){i=i.convert();}return i;}O.createFilterParams=function(i,M,E){var x;if(Array.isArray(i)){i=i.map(g);x=F.groupFilters(i);}else{x=g(i);}if(!x){return;}return"$filter="+this._createFilterParams(x,M,E);};O._createFilterParams=function(x,M,E){var y=this,z=Array.isArray(x)?F.groupFilters(x):x;function A(z,i){z=g(z);if(z.aFilters){return B(z,i);}return y._createFilterSegment(z.sPath,M,E,z.sOperator,z.oValue1,z.oValue2,z.bCaseSensitive);}function B(G,H){var I=G.aFilters,J=!!G.bAnd,K="";if(I.length===0){return J?"true":"false";}if(I.length===1){if(I[0]._bMultiFilter){return A(I[0]);}return A(I[0],true);}if(!H){K+="(";}K+=A(I[0]);for(var i=1;i<I.length;i++){K+=J?"%20and%20":"%20or%20";K+=A(I[i]);}if(!H){K+=")";}return K;}if(!z){return;}return A(z,true);};O._createUrlParamsArray=function(P){var U,T=typeof P,i;if(Array.isArray(P)){return P;}U=[];if(T==="string"||P instanceof String){if(P){U.push(P);}}else if(T==="object"){i=this._encodeURLParameters(P);if(i){U.push(i);}}return U;};O._encodeURLParameters=function(P){if(!P){return"";}var U=[];q.each(P,function(i,V){if(typeof V==="string"||V instanceof String){V=encodeURIComponent(V);}i=i.startsWith('$')?i:encodeURIComponent(i);U.push(i+"="+V);});return U.join("&");};O.setOrigin=function(i,P){var x,y,z;if(!i||!P||i.indexOf(";mo")>0){return i;}if(typeof P=="string"){x=P;}else{x=P.alias;if(!x){y=P.system;z=P.client;if(!y||!z){L.warning("ODataUtils.setOrigin: No Client or System ID given for Origin");return i;}x="sid("+y+"."+z+")";}}var U=i.split("?");var B=U[0];var A=U[1]?"?"+U[1]:"";var T="";if(B[B.length-1]==="/"){B=B.substring(0,B.length-1);T="/";}var E=/(\/[^\/]+)$/g;var G=/(;o=[^\/;]+)/g;var H=B.match(E)[0];var I=H.match(G);var J=I?I[0]:null;if(J){if(P.force){var K=H.replace(J,";o="+x);B=B.replace(H,K);return B+T+A;}return i;}B=B+";o="+x+T;return B+A;};O.setAnnotationOrigin=function(A,P){var i;var x=A.indexOf("/Annotations(");var H=P&&P.preOriginBaseUri?P.preOriginBaseUri.indexOf(".xsodata"):-1;if(x===-1){x=A.indexOf("/Annotations%28");}if(x>=0){if(A.indexOf("/$value",x)===-1){L.warning("ODataUtils.setAnnotationOrigin: Annotation url is missing $value segment.");i=A;}else{var y=A.substring(0,x);var z=A.substring(x,A.length);var B=O.setOrigin(y,P);i=B+z;}}else if(H>=0){i=O.setOrigin(A,P);}else{i=A.replace(P.preOriginBaseUri,P.postOriginBaseUri);}return i;};O._resolveMultiFilter=function(M,x,E){var y=this,z=M.aFilters,A="";if(z){A+="(";q.each(z,function(i,B){if(B._bMultiFilter){A+=y._resolveMultiFilter(B,x,E);}else if(B.sPath){A+=y._createFilterSegment(B.sPath,x,E,B.sOperator,B.oValue1,B.oValue2,"",B.bCaseSensitive);}if(i<(z.length-1)){if(M.bAnd){A+="%20and%20";}else{A+="%20or%20";}}});A+=")";}return A;};O._createFilterSegment=function(P,M,E,i,V,x,y){var z,T;if(y===undefined){y=true;}if(E){z=M._getPropertyMetadata(E,P);T=z&&z.type;a(z,"PropertyType for property "+P+" of EntityType "+E.name+" not found!");}if(T){V=this.formatValue(V,T,y);x=(x!=null)?this.formatValue(x,T,y):null;}else{a(null,"Type for filter property could not be found in metadata!");}if(V){V=e(String(V));}if(x){x=e(String(x));}if(!y&&T==="Edm.String"){P="toupper("+P+")";}switch(i){case"EQ":case"NE":case"GT":case"GE":case"LT":case"LE":return P+"%20"+i.toLowerCase()+"%20"+V;case"BT":return"("+P+"%20ge%20"+V+"%20and%20"+P+"%20le%20"+x+")";case"NB":return"not%20("+P+"%20ge%20"+V+"%20and%20"+P+"%20le%20"+x+")";case"Contains":return"substringof("+V+","+P+")";case"NotContains":return"not%20substringof("+V+","+P+")";case"StartsWith":return"startswith("+P+","+V+")";case"NotStartsWith":return"not%20startswith("+P+","+V+")";case"EndsWith":return"endswith("+P+","+V+")";case"NotEndsWith":return"not%20endswith("+P+","+V+")";default:L.error("ODataUtils :: Unknown filter operator "+i);return"true";}};O.formatValue=function(V,T,i){var x,y;if(i===undefined){i=true;}if(V===null||V===undefined){return"null";}s();switch(T){case"Edm.String":V=i?V:V.toUpperCase();y="'"+String(V).replace(/'/g,"''")+"'";break;case"Edm.Time":if(typeof V==="object"){y=t.format(new Date(V.ms),true);}else{y="time'"+V+"'";}break;case"Edm.DateTime":x=V instanceof Date?V:new Date(V);if(x.getMilliseconds()>0){y=o.format(x,true);}else{y=d.format(x,true);}break;case"Edm.DateTimeOffset":x=V instanceof Date?V:new Date(V);y=b.format(x,true);break;case"Edm.Guid":y="guid'"+V+"'";break;case"Edm.Decimal":y=V+"m";break;case"Edm.Int64":y=V+"l";break;case"Edm.Double":y=V+"d";break;case"Edm.Float":case"Edm.Single":y=V+"f";break;case"Edm.Binary":y="binary'"+V+"'";break;default:y=String(V);break;}return y;};O.parseValue=function(V){var i=V[0],x=V[V.length-1];s();if(i==="'"){return V.slice(1,-1).replace(/''/g,"'");}else if(V.startsWith("time'")){return{__edmType:"Edm.Time",ms:t.parse(V,true).getTime()};}else if(V.startsWith("datetime'")){if(V.indexOf(".")===-1){return d.parse(V,true);}else{return o.parse(V,true);}}else if(V.startsWith("datetimeoffset'")){return b.parse(V,true);}else if(V.startsWith("guid'")){return V.slice(5,-1);}else if(V==="null"){return null;}else if(x==="m"||x==="l"||x==="d"||x==="f"){return V.slice(0,-1);}else if(!isNaN(i)||i==="-"){return parseInt(V);}else if(V==="true"||V==="false"){return V==="true";}else if(V.startsWith("binary'")){return V.slice(7,-1);}throw new Error("Cannot parse value '"+V+"', no Edm type found");};function h(V,i){if(V===i){return 0;}if(V===null||i===null||V===undefined||i===undefined){return NaN;}return V>i?1:-1;}function p(V){var M;if(typeof V!=="string"){return undefined;}M=r.exec(V);if(!M){return undefined;}return{sign:M[1]==="-"?-1:1,integerLength:M[2].length,abs:M[2]+M[3].replace(f,"").replace(c,"")};}function j(V,i){var x,y,R;if(V===i){return 0;}x=p(V);y=p(i);if(!x||!y){return NaN;}if(x.sign!==y.sign){return x.sign>y.sign?1:-1;}R=h(x.integerLength,y.integerLength)||h(x.abs,y.abs);return x.sign*R;}var k=/^PT(\d\d)H(\d\d)M(\d\d)S$/;function l(V){if(typeof V==="string"&&k.test(V)){V=parseInt(RegExp.$1)*3600000+parseInt(RegExp.$2)*60000+parseInt(RegExp.$3)*1000;}if(V instanceof Date){return V.getTime();}if(V&&V.__edmType==="Edm.Time"){return V.ms;}return V;}O.compare=function(V,i,A){return A?j(V,i):h(l(V),l(i));};O.getComparator=function(E){switch(E){case"Edm.Date":case"Edm.DateTime":case"Edm.DateTimeOffset":case"Edm.Time":return O.compare;case"Edm.Decimal":case"Edm.Int64":return j;default:return h;}};var m=/([(=,])('.*?')([,)])/g,n=/[MLDF](?=[,)](?:[^']*'[^']*')*[^']*$)/g,u=/([(=,])(X')/g,N=function(i,x,y,z){return x+encodeURIComponent(decodeURIComponent(y))+z;},v=function(i){return i.toLowerCase();},w=function(i,x){return x+"binary'";};O._normalizeKey=function(K){return K.replace(m,N).replace(n,v).replace(u,w);};return O;},true);
