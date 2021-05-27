/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var D={apiVersion:2};D.render=function(r,c){var f=c.getAggregation("from"),t=c.getAggregation("to");r.openStart("div",c);r.openEnd();if(f){r.renderControl(f);}if(t){r.renderControl(t);}r.close("div");};return D;},true);
