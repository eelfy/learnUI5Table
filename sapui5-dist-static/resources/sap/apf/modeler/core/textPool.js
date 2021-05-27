/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.apf.modeler.core.textPool");jQuery.sap.require("sap.apf.utils.hashtable");jQuery.sap.require("sap.apf.core.utils.filter");jQuery.sap.require("sap.ui.core.format.DateFormat");jQuery.sap.require('sap.apf.utils.utils');(function(){'use strict';sap.apf.modeler.core.TextPool=function(a,b,e){var m=a.instances.messageHandler;var p=a.instances.persistenceProxy;var c=a.isUsingCloudFoundryProxy;var H=a.constructors.Hashtable;var h=new H(m);var k=new H(m);var g=new H(m);var d=0;var f={TextElement:sap.apf.core.constants.textKeyForInitialText,Language:sap.apf.core.constants.developmentLanguage,TextElementType:"XFLD",TextElementDescription:"",MaximumLength:10,Application:b,TranslationHint:""};function l(t,j){var o=h.getKeys();var i,q=o.length;var r=j.MaximumLength||10;var s=j.TranslationHint||"";var u;for(i=0;i<q;i++){u=h.getItem(o[i]);if((u.TextElementDescription===t)&&(u.MaximumLength===r)&&(u.TranslationHint===s)){return o[i];}}return undefined;}this.removeTexts=function(t,o,q){var r=[];var i,s;function u(v){var j;if(!v){for(j=0;j<s;j++){h.removeItem(t[j]);}}q(v);}s=t.length;if(s===0){q(undefined);return;}for(i=0;i<s;i++){if(t[i]===sap.apf.core.constants.textKeyForInitialText){continue;}r.push({method:"DELETE",entitySetName:"texts",inputParameters:[{name:'TextElement',value:t[i]},{name:'Language',value:sap.apf.core.constants.developmentLanguage}]});}if(c){p.doChangeOperationsInBatch(r,u,o,true);}else{p.doChangeOperationsInBatch(r,u,o);}};this.isInitialTextKey=function(t){return(t===sap.apf.core.constants.textKeyForInitialText);};this.addTextsAndSave=function(t,j,o){function q(y,z){return(y.TextElement===z.TextElement&&y.TextElementDescription===z.TextElementDescription&&y.MaximumLength===z.MaximumLength&&y.Language===z.Language&&y.TranslationHint===z.TranslationHint);}var i;var r=t.length;var s;var u=[];var v=[];var w=[];var x;for(i=0;i<r;i++){if(t[i]===sap.apf.core.constants.textKeyForInitialText){continue;}s=h.getItem(t[i].TextElement);if(s){if(!q(s,t[i])){u.push(t[i]);h.setItem(t[i].TextElement,t[i]);}}else{v.push(t[i]);h.setItem(t[i].TextElement,t[i]);}}r=u.length;for(i=0;i<r;i++){x=[{name:'TextElement',value:u[i].TextElement},{name:'Language',value:u[i].Language}];u[i].MaximumLength=parseInt(u[i].MaximumLength,10);w.push({method:"PUT",entitySetName:"texts",data:u[i],inputParameters:x});}r=v.length;for(i=0;i<r;i++){v[i].MaximumLength=parseInt(v[i].MaximumLength,10);w.push({method:"POST",entitySetName:"texts",data:v[i]});}if(w.length>0){if(c){p.doChangeOperationsInBatch(w,j,o,false);}else{p.doChangeOperationsInBatch(w,j,o);}}else{j(undefined);}};this.exportTexts=function(i){var t=sap.apf.utils.renderHeaderOfTextPropertyFile(b,m);var j={TextElement:"AnalyticalConfigurationName",Language:sap.apf.core.constants.developmentLanguage,TextElementType:"XTIT",TextElementDescription:i,MaximumLength:250,Application:b,TranslationHint:""};return t+sap.apf.utils.renderTextEntries(h,m)+sap.apf.utils.renderEntryOfTextPropertyFile(j,m);};this.get=function(i){var j,o;if(i===sap.apf.core.constants.textKeyForInitialText){return f;}if(h.hasItem(i)){return h.getItem(i);}if(k.hasItem(i)){j=k.getItem(i);if(j.TextElementDescription){return j;}return h.getItem(j);}o=jQuery.extend({},true,f);o.TextElement=i;o.TextElementDescription=i;return o;};this.getPersistentKey=function(i){return i;};this.setTextAsPromise=function(t,i){var j;var o=jQuery.Deferred();var u=function(r,s,v){if(v){m.putMessage(v);}if(r){h.setItem(r.TextElement,r);j=r.TextElement;}o.resolve(r&&r.TextElement);};var q={TextElement:"",Language:sap.apf.core.constants.developmentLanguage,TextElementType:i.TextElementType,TextElementDescription:t,MaximumLength:i.MaximumLength||10,Application:b,TranslationHint:i.TranslationHint||""};if(!t){o.resolve(sap.apf.core.constants.textKeyForInitialText);}j=l(t,i);if(j){o.resolve(j);}else{d++;p.create('texts',q,u,true);}return o.promise();};this.getTextKeys=function(t){var j=h.getKeys();var i,o,q=j.length;var r=[];for(i=0;i<q;i++){o=h.getItem(j[i]);if(t&&o.TextElementType!==t){continue;}if(g.hasItem(j[i])){r.push(g.getItem(j[i]));}else{r.push(j[i]);}}return r;};this.getTextsByTypeAndLength=function(t,j){var o=h.getKeys();var i,q,r=o.length;var s=[];for(i=0;i<r;i++){q=h.getItem(o[i]);if(q.TextElementType===t&&q.MaximumLength===j){if(g.hasItem(o[i])){s.push({TextElement:g.getItem(o[i]),TextElementDescription:q.TextElementDescription});}else{s.push({TextElement:o[i],TextElementDescription:q.TextElementDescription});}}}return s;};function n(){var i,j;j=e.length;for(i=0;i<j;i++){if(e[i].TextElement){h.setItem(e[i].TextElement,e[i]);}}}n();};}());
