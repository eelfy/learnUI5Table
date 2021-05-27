/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./BaseController","sap/ui/mdc/p13n/P13nBuilder"],function(B,P){"use strict";var r=sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");var C=B.extend("sap.ui.mdc.p13n.subcontroller.ChartItemController");C.prototype.getAdaptationUI=function(){return"sap/ui/mdc/p13n/panels/ChartItemPanel";};C.prototype.getDelta=function(p){p.deltaAttributes.push("role");return B.prototype.getDelta.apply(this,arguments);};C.prototype.getContainerSettings=function(){return{title:r.getText("chart.PERSONALIZATION_DIALOG_TITLE")};};C.prototype.setP13nData=function(p){var i=this.getCurrentState();var I=P.arrayToMap(i);var o=P.prepareAdaptationData(p,function(m,a){var e=I[a.name];m.visible=!!e;m.position=e?e.position:-1;m.role=e?e.role:a.role;m.kind=a.kind;return a.visible;});P.sortP13nData({visible:"visible",position:"position"},o.items);o.items.forEach(function(a){delete a.position;});this.oP13nData=o;};C.prototype.getChangeOperations=function(){return{add:"addItem",remove:"removeItem",move:"moveItem"};};return C;});
