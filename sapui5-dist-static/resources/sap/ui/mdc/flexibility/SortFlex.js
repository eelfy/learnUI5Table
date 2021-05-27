/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/mdc/p13n/Engine"],function(E){"use strict";var r=function(c){var e=c&&c.isA&&c.isA("sap.ui.mdc.Table")&&c.isTableBound();var b=c&&c.isA&&(c.isA("sap.ui.mdc.Chart")||c.isA("sap.ui.mdc.ChartNew"));if(e||b){if(!c._bWaitForBindChanges){c._bWaitForBindChanges=true;E.getInstance().waitForChanges(c).then(function(){if(e){c.checkAndRebind();}else if(b){c.rebind();}delete c._bWaitForBindChanges;});}}};var f=function(c,C,s,i){if(i){c.resetRevertData();}else{c.setRevertData(s);}r(C);};var a=function(c,C,p,i){return new Promise(function(b,d){var M=p.modifier;var o=i?c.getRevertData():c.getContent();var s=M.getProperty(C,"sortConditions");var v=s?s.sorters:[];var e={name:o.name,descending:o.descending};v.splice(o.index,0,e);s={sorters:v};M.setProperty(C,"sortConditions",s);f(c,C,e,i);b();});};var R=function(c,C,p,i){return new Promise(function(b,d){var M=p.modifier;var e=i?c.getRevertData():c.getContent();var s=M.getProperty(C,"sortConditions");var v=s?s.sorters:[];if(!v){d();}var F=v.filter(function(o){return o.name===e.name;});var I=v.indexOf(F[0]);v.splice(I,1);s={sorters:v};M.setProperty(C,"sortConditions",s);f(c,C,e,i);b();});};var m=function(c,C,p,i){return new Promise(function(b,d){var M=p.modifier;var e=i?c.getRevertData():c.getContent();var s=M.getProperty(C,"sortConditions");var v=s?s.sorters:[];var F=v.filter(function(o){return o.name===e.name;});var O=v.indexOf(F[0]);v.splice(e.index,0,v.splice(O,1)[0]);s={sorters:v};M.setProperty(C,"sortConditions",s);f(c,C,e,i);b();});};var S={};S.removeSort={"changeHandler":{applyChange:function(c,C,p){return R(c,C,p,false);},completeChangeContent:function(c,C,p){},revertChange:function(c,C,p){return a(c,C,p,true);}},"layers":{"USER":true}};S.addSort={"changeHandler":{applyChange:function(c,C,p){return a(c,C,p,false);},completeChangeContent:function(c,C,p){},revertChange:function(c,C,p){return R(c,C,p,true);}},"layers":{"USER":true}};S.moveSort={"changeHandler":{applyChange:function(c,C,p){return m(c,C,p);},completeChangeContent:function(c,C,p){},revertChange:function(c,C,p){return m(c,C,p,true);}},"layers":{"USER":true}};return S;});
