/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/write/_internal/fieldExtensibility/Access"],function(A){"use strict";var F={};var _;function g(){if(!_){_=A;}return _;}function c(f,a){var i=g();return Promise.resolve(i[f](a));}F.isExtensibilityEnabled=function(C){return c("isExtensibilityEnabled",C);};F.isServiceOutdated=function(s){return c("isServiceOutdated",s);};F.setServiceValid=function(s){c("setServiceValid",s);};F.getTexts=function(){return c("getTexts");};F.getExtensionData=function(C){return c("getExtensionData",C);};F.onTriggerCreateExtensionData=function(e){c("onTriggerCreateExtensionData",e);};return F;});
