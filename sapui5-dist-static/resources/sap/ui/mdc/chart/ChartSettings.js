/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var C={showPanel:function(c,p,s,P){C["showUI"+p](c,s);},showUIChart:function(c,s){c.getEngine().showUI(c,"Item");},showUISort:function(c,s){c.getEngine().showUI(c,"Sort");}};return C;});
