sap.ui.define(["sap/ui/core/mvc/Controller", "sap/fe/core/CommonUtils"], function(Controller, CommonUtils) {
	"use strict";

	return Controller.extend("sap.fe.core.BaseController", {
		/**
		 * Returns the current app component.
		 *
		 * @returns {sap.fe.core.AppComponent} the app component or null if not found
		 */
		getAppComponent: function() {
			if (!this._oAppComponent) {
				this._oAppComponent = CommonUtils.getAppComponent(this.getView());
			}
			return this._oAppComponent;
		},

		/**
		 * Convenience method for getting the view model by name in every controller of the application.
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function(sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model in every controller of the application.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		getResourceBundle: function(sI18nModelName) {
			if (!sI18nModelName) {
				sI18nModelName = "i18n";
			}
			return this.getAppComponent()
				.getModel(sI18nModelName)
				.getResourceBundle();
		}
	});
});
