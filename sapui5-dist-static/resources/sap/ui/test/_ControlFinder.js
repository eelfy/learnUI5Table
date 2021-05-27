/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/Object","sap/ui/test/OpaPlugin","sap/ui/test/actions/Press","sap/ui/test/_LogCollector","sap/ui/test/_OpaLogger","sap/ui/thirdparty/jquery"],function(U,O,P,_,a,$){"use strict";var p=new O();var b=U.extend("sap.ui.test._ControlFinder",{});var l=a.getLogger("sap.ui.test._ControlFinder");var L=_.getInstance('^((?!autowaiter).)*$');var c=[];b._findControls=function(o){if(d(o)){try{return b._findControls(e(o));}catch(E){l.error(E);return[];}}else{var C=p._getFilteredControls(o);if(C===O.FILTER_FOUND_NO_CONTROLS){return[];}else{return Array.isArray(C)?C:[C];}}};b._findElements=function(o){L.start();var C=b._findControls(o);var g=function(h){return new P().$(h)[0]||h.getDomRef();};var E=C.map(function(h){switch(o.interaction){case"root":return h.getDomRef();case"focus":return h.getFocusDomRef();case"press":var i=new P()._getAdapter(h);return h.$(i)[0];case"auto":return g(h);default:i=o.interaction&&o.interaction.idSuffix;return i?h.$(i)[0]:g(h);}});c.push(L.getAndClearLog());L.stop();return E;};b._getControlForElement=function(E){var s=Object.prototype.toString.call(E)==="[object String]"?"#"+E:E;var g=b._getIdentifiedDOMElement(s).control();return g&&g[0];};b._getControlProperty=function(C,s){var g=$.extend({},C.mProperties,{id:C.getId()});return Object.keys(g).indexOf(s)>-1?g[s]:null;};b._getDomElementIDSuffix=function(E,C){var s=E.id;var D="-";var S=C.getId().length;return s.charAt(S)===D&&s.substring(S+1);};b._getIdentifiedDOMElement=function(s){if(typeof s==="string"){s=s.replace(/(:|\.|\[|\]|,|=|@)/g,"\\$1");}return $(s).closest("[data-sap-ui]");};b._getIdentifiedDOMElementId=function(s){var E=b._getIdentifiedDOMElement(s);return E.attr("data-sap-ui");};b._getLatestLog=function(){return c&&c.pop();};b._isControlInStaticArea=function(C){var s=sap.ui.getCore().getStaticAreaRef();return $.contains(s,C.getDomRef());};function d(o){return o.ancestor||o.descendant;}function e(o){var g={};if(o.ancestor){var A=f(o);var h=b._findControls(A)[0];if(h){g.ancestor=h;delete o.ancestor;}else{throw new Error("Ancestor not found using selector: "+JSON.stringify(A));}}if(o.descendant){var D=b._findControls(o.descendant)[0];if(D){g.descendant=D;delete o.descendant;}else{throw new Error("Descendant not found using selector: "+JSON.stringify(o.descendant));}}if($.isEmptyObject(g)){return o;}else{return $.extend({},o,{matchers:g});}}function f(o){if(Array.isArray(o.ancestor)){return{id:o.ancestor[0]};}else{return o.ancestor;}}return b;});
