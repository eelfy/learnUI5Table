/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/registry/Settings","sap/ui/fl/write/_internal/Storage","sap/ui/fl/Layer"],function(S,a,L){"use strict";var F={isPublishAvailable:function(){return S.getInstance().then(function(s){return!s.isProductiveSystem();});},isSaveAsAvailable:function(l){return S.getInstance().then(function(s){if(s.isAppVariantSaveAsEnabled()&&l===L.CUSTOMER&&!!sap.ushell_abap){return true;}return false;});},isKeyUser:function(){return S.getInstance().then(function(s){return s.isKeyUser();});},isVersioningEnabled:function(l){return S.getInstance().then(function(s){return s.isVersioningEnabled(l);});},isContextSharingEnabled:function(l){return a.isContextSharingEnabled({layer:l});}};return F;});
