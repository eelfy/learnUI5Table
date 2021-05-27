/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/Device"],function(D){"use strict";var I={apiVersion:2};I.render=function(r,i){var s=i._sSymbolId;r.openStart("svg",i);r.class("sapFIllustration");r.openEnd();r.openStart("use");r.attr('href',"#"+s);r.openEnd();r.close("use");r.close("svg");};return I;},true);
