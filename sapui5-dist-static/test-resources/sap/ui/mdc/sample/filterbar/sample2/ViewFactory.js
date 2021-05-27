/*!
* OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
*/

sap.ui.define([
	'jquery.sap.global', 'sap/ui/core/mvc/View'
], function (jQuery, View) {
	"use strict";
	function create(oViewSettings, oModel, oComp) {

		var oMetaModel = oModel.getMetaModel();

		return oMetaModel.requestObject("/").then(function() {
			oViewSettings.preprocessors = jQuery.extend(true, {
				xml: {
					bindingContexts: {
					},
					models: {
						'sap.ui.mdc.metaModel': oMetaModel
					}
				}
			}, oViewSettings.preprocessors);
			oViewSettings.type = "XML";
			var oViewPromise;
			oComp.runAsOwner(function(){
				oViewPromise = View.create(oViewSettings);
				oViewPromise.then(function(oView){
					oComp._addContent(oView);
					return oView;
				});

			});
			return oViewPromise;
		});
	}
	var viewFactory = {
		create: create
	};
	return viewFactory;
});