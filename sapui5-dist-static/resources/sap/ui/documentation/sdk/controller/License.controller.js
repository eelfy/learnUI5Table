/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/documentation/sdk/controller/BaseController","sap/ui/documentation/library"],function(B,l){"use strict";return B.extend("sap.ui.documentation.sdk.controller.License",{onInit:function(){this.getRouter().getRoute("license").attachPatternMatched(this._onTopicMatched,this);},_onTopicMatched:function(e){
// Get the LICENSE.txt file and display it. In case of error redirect to NotFound view.
l._getLicense().done(function(L){if(L!==""){this.getView().byId("licenseText").setText(L);}else{this.onRouteNotFound();}}.bind(this)).fail(function(){this.onRouteNotFound();}.bind(this));}});});
