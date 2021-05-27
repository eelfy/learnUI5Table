sap.ui.define(
	[
		"sap/ui/core/service/Service",
		"sap/ui/core/service/ServiceFactory",
		"sap/ui/model/resource/ResourceModel",
		"sap/base/i18n/ResourceBundle"
	],
	function(Service, ServiceFactory, ResourceModel, ResourceBundle) {
		"use strict";

		var ResourceModelService = Service.extend("sap.fe.core.services.ResourceModelService", {
			initPromise: Promise.resolve(),
			init: function() {
				var oContext = this.getContext();
				var mSettings = oContext.settings;
				this.oFactory = oContext.factory;

				// When enhancing i18n keys the value in the last resource bundle takes precedence
				// hence arrange various resource bundles so that enhanceI18n provided by the application is the last.
				// The following order is used :
				// 1. sap.fe bundle - sap.fe.core.messagebundle (passed with mSettings.bundles)
				// 2. sap.fe bundle - sap.fe.templates.messagebundle (passed with mSettings.bundles)
				// 3. Multiple bundles passed by the application as part of enhanceI18n
				var aBundles = mSettings.bundles.concat(mSettings.enhanceI18n || []).map(function(vI18n) {
					// if value passed for enhanceI18n is a Resource Model, return the associated bundle
					// else the value is a bundleUrl, return Resource Bundle configuration so that a bundle can be created
					return typeof vI18n.isA === "function" && vI18n.isA("sap.ui.model.resource.ResourceModel")
						? vI18n.getResourceBundle()
						: { bundleName: vI18n.replace(/\//g, ".") };
				});

				this.oResourceModel = new ResourceModel({
					bundleName: aBundles[0].bundleName,
					enhanceWith: aBundles.slice(1),
					async: true
				});

				if (oContext.scopeType === "component") {
					var oComponent = oContext.scopeObject;
					oComponent.setModel(this.oResourceModel, mSettings.modelName);
				}

				this.initPromise = this.oResourceModel.getResourceBundle().then(
					function(oBundle) {
						this.oResourceModel.__bundle = oBundle;
						return this;
					}.bind(this)
				);
			},

			getResourceModel: function() {
				return this.oResourceModel;
			},
			exit: function() {
				// Deregister global instance
				this.oFactory.removeGlobalInstance();
			}
		});

		return ServiceFactory.extend("sap.fe.core.services.ResourceModelServiceFactory", {
			_oInstances: {},
			createInstance: function(oServiceContext) {
				var sKey =
					oServiceContext.settings.bundles.join(",") +
					(oServiceContext.settings.enhanceI18n ? "," + oServiceContext.settings.enhanceI18n.join(",") : "");

				if (!this._oInstances[sKey]) {
					this._oInstances[sKey] = new ResourceModelService(Object.assign({ factory: this }, oServiceContext));
				}

				return this._oInstances[sKey].initPromise;
			},
			removeGlobalInstance: function() {
				this._oInstances = {};
			}
		});
	},
	true
);
