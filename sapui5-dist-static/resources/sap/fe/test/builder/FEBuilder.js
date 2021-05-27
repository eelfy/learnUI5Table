sap.ui.define(["sap/ui/test/OpaBuilder","sap/fe/test/Utils","sap/ui/test/Opa5","sap/ui/test/matchers/Matcher","sap/ui/core/util/ShortcutHelper","sap/base/util/deepEqual"],function(O,U,a,M,S,d){"use strict";var E={focused:function(f){var b=O.Matchers.focused(true);return f?b:O.Matchers.not(b);},controlType:function(t){return function(c){return c&&c.isA(t);};},content:function(s){return function(c){if(!c){return false;}var A=c.getMetadata().getDefaultAggregationName()||"content",v=U.getAggregation(c,A);if(!v){return false;}if(!Array.isArray(v)){v=[v];}return v.some(function(o){return F.Matchers.states(s)(o);});};},p13nMode:function(m){if(!Array.isArray(m)){m=[];}m.sort();return function(c){var p=c.getP13nMode();if(!Array.isArray(p)){p=[];}p.sort();return d(m,p);};},label:function(l){return function(c){if(c.getMetadata().getProperty("label")){return O.Matchers.match(O.Matchers.properties({label:l}))(c);}return F.Matchers.label(l)(c);};}};var F=function(){return O.apply(this,arguments);};F.create=function(o){return new F(o);};F.prototype=Object.create(O.prototype);F.prototype.constructor=F;F.prototype.getStatesMatcher=function(s){return F.Matchers.states(s);};F.prototype.hasState=function(s){if(!s){return this;}if(s.visible===false){this.mustBeVisible(false);this.mustBeEnabled(false);}if(s.enabled===false){this.mustBeEnabled(false);}return this.has(this.getStatesMatcher(s));};F.prototype.doPressKeyboardShortcut=function(s){return this.do(F.Actions.keyboardShortcut(s));};F.getControls=function(b,s){var o=b.build(),c=a.getPlugin().getMatchingControls(o),C=O.Matchers.filter(o.matchers)(c);if(s){if(C.length>1){throw new Error("found ambiguous results");}return C.length?C[0]:null;}return C;};F.controlsExist=function(b){return!!F.getControls(b).length;};F.createClosePopoverBuilder=function(o,p,s){return O.create(o).success(function(){var P=false,c=function(){P=true;},b=F.createPopoverBuilder(o,p);if(s||F.controlsExist(b)){return b.do(function(e){e.attachEventOnce("afterClose",c);e.close();}).success(O.create(o).check(function(){return P;})).execute();}});};F.createPopoverBuilder=function(o,p){var b=O.create(o).hasType("sap.m.Popover").isDialogElement(true).has(function(P){return P.isOpen();}).checkNumberOfMatches(1);if(p){b.has(p||[]);}return b;};F.createMessageToastBuilder=function(t){return O.create().check(function(){var w=a.getWindow();return(w.sapFEStubs&&w.sapFEStubs.getLastToastMessage&&w.sapFEStubs.getLastToastMessage()===t);}).description("Toast message '"+t+"' was displayed");};F.Matchers={FOCUSED_ELEMENT:function(){var t=a.getWindow().sap.ui.getCore(),f=t.getCurrentFocusedControlId();if(f){return t.byId(f);}return null;},state:function(n,v){if(n in E){return E[n](v);}return function(c){var m=c.getMetadata(),A=m.hasAggregation(n)&&m.getAggregation(n).multiple?U.getAggregation(c,n):null;if(!A){var p={};p[n]=v;return F.Matchers.match(O.Matchers.properties(p))(c);}if(!Array.isArray(A)){A=[A];}if(!Array.isArray(v)){if(U.isOfType(v,Number)){return A.length===v;}return A.some(function(o){return F.Matchers.states(v)(o);});}return(v.length===A.length&&A.every(function(o,i){return F.Matchers.states(v[i])(o);}));};},states:function(s,f){if(!U.isOfType(s,Object)){return O.Matchers.TRUE;}if(!U.isOfType(f,Function)){f=F.Matchers.state;}return F.Matchers.match(Object.keys(s).map(function(p){return f(p,s[p]);}));},match:function(m){var f=O.Matchers.match(m);return function(c){return!!f(c);};},bound:function(){return function(c){return c&&!!c.getBindingContext();};},allMatch:function(m){var f=O.Matchers.filter(m);return function(i){var e=(i&&i.length)||0;return e===f(i).length;};},someMatch:function(m){var f=O.Matchers.filter(m);return function(i){return f(i).length>0;};},id:function(i){return function(c){if(U.isOfType(i,String)){return c.getId()===i;}else{return i.test(c.getId());}};},type:function(t){return function(c){if(U.isOfType(t,String)){return c.getMetadata().getName()===t;}else{return t.test(c.getMetadata().getName());}};},atIndex:function(i){return function(I){if(U.isOfType(I,[null,undefined])){return null;}I=[].concat(I);return I.length>i?I[i]:null;};},singleElement:function(){return function(c){if(!Array.isArray(c)){c=[c];}if(c.length!==1){return false;}return c[0];};},label:function(t){return O.Matchers.some(function(c){var C=c.getId&&c.getId();return(C&&F.controlsExist(F.create().hasType("sap.m.Label").hasProperties({text:t,labelFor:C})));},function(c){var A=c.getAriaLabelledBy&&c.getAriaLabelledBy();if(Array.isArray(A)&&A.length>0){return A.some(function(s){var o=a.getWindow().sap.ui.getCore().byId(s);return o&&o.getText&&o.getText()===t;});}});}};F.Actions={keyboardShortcut:function(s,c,i){var A=U.parseArguments([String,String,Boolean],arguments);s=A[0];c=A[1];i=A[2];return function(e){var n=S.parseShortcut(s);n.type="keydown";if(s.toLowerCase()===n.key){n.key=s;}var j=c?e.$().find(c):e.$();if(!i){e.focus();}j.trigger(n);};}};return F;});
