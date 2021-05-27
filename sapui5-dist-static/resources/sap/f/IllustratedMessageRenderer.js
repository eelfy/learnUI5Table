/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var I={apiVersion:2};I.render=function(r,i){var o=i._getIllustration(),a=i._getTitle(),b=i._getDescription(),c=i.getAdditionalContent();r.openStart("figure",i);r.class("sapFIllustratedMessage");r.openEnd();r.renderControl(o);r.openStart("figcaption").openEnd();r.renderControl(a);r.renderControl(b.addStyleClass("sapFIllustratedMessageDescription"));r.close("figcaption");r.openStart("div");r.class("sapFIllustratedMessageAdditionalContent");r.openEnd();c.forEach(function(C){r.renderControl(C);});r.close("div");r.close("figure");};return I;},true);
