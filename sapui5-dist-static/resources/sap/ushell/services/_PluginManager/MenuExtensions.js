// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define([],function(){"use strict";function c(p){return function g(n){return sap.ushell.Container.getServiceAsync("Menu").then(function(m){return m.getEntryProvider(p,n);});};}return function(p){return{getMenuEntryProvider:c(p)};};});
