/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */
sap.ui.define(
	["sap/ui/base/Object", "sap/fe/core/CommonUtils", "sap/fe/macros/DelegateUtil", "sap/base/Log", "sap/ui/core/Component"],
	function(BaseObject, CommonUtils, DelegateUtil, Log, Component) {
		"use strict";

		/**
		 * @class Common Extension API for all pages of SAP Fiori elements for OData V4.
		 * @alias sap.fe.templates.ExtensionAPI
		 * @public
		 * @hideconstructor
		 * @extends sap.ui.base.Object
		 * @since 1.79.0
		 */

		var extensionAPI = BaseObject.extend("sap.fe.templates.ExtensionAPI", {
			constructor: function(oController, sId) {
				this._controller = oController;
				this._view = oController.getView();
				this.editFlow._controller = this._controller;
				this.intentBasedNavigation._controller = this._controller;
				this._prefix = sId;
			},
			destroy: function() {
				delete this._controller;
				delete this._view;
				delete this.editFlow._controller;
				delete this.intentBasedNavigation._controller;
			},

			/**
			 * @private
			 * @name sap.fe.templates.ExtensionAPI.getMetadata
			 * @function
			 */
			/**
			 * @private
			 * @name sap.fe.templates.ExtensionAPI.extend
			 * @function
			 */

			/**
			 * Access any control by ID.
			 *
			 * @alias sap.fe.templates.ExtensionAPI#byId
			 * @param {string} sId ID of the control without the view prefix. Either the ID prefixed by SAP Fiori elements
			 * (for example with the section) or the control ID only. The latter works only for an extension running in
			 * the same context (like in the same section). You can use the prefix for SAP Fiori elements to also access other controls located in different sections.
			 * @returns {sap.ui.core.Control} control if found
			 *
			 * @private
			 */
			byId: function(sId) {
				var oControl = this._view.byId(sId);

				if (!oControl && this._prefix) {
					// give it a try with the prefix
					oControl = this._view.byId(this._prefix + "--" + sId);
				}

				if (oControl) {
					return oControl;
				}
			},

			/**
			 * Get access to models managed by Fiori elements.<br>
			 * The following models can be accessed:
			 * <ul>
			 * <li>undefined: the undefined model returns the UI5 OData v4 model bound to this page</li>
			 * <li>i18n / further data models defined in the manifest</li>
			 * <li>ui: returns a UI5 JSON model containing UI information. Only the following properties are public,
			 * don't rely on any other property as it might change in the future
			 * 	<ul>
			 *     <li>editMode: contains either 'Editable' or 'Display'</li>
			 *  </ul>
			 * </li>
			 * </ul>.
			 *
			 * @alias sap.fe.templates.ExtensionAPI#getModel
			 * @param {string} sModelName Name of the model
			 * @returns {sap.ui.model.Model} The required model
			 *
			 * @public
			 */
			getModel: function(sModelName) {
				var oAppComponent;

				if (sModelName && sModelName !== "ui") {
					oAppComponent = CommonUtils.getAppComponent(this._view);
					if (!oAppComponent.getManifestEntry("sap.ui5").models[sModelName]) {
						// don't allow access to our internal models
						return null;
					}
				}

				return this._view.getModel(sModelName);
			},

			/**
			 * Add any control as a dependent to this Fiori elements page.
			 *
			 * @alias sap.fe.templates.ExtensionAPI#addDependent
			 * @param {sap.ui.core.Control} oControl Control to be added as dependent
			 *
			 * @public
			 */
			addDependent: function(oControl) {
				this._view.addDependent(oControl);
			},

			/**
			 * Remove a dependent control from this Fiori elements page.
			 *
			 * @alias sap.fe.templates.ExtensionAPI#removeDependent
			 * @param {sap.ui.core.Control} oControl Control to be added as dependent
			 *
			 * @public
			 */
			removeDependent: function(oControl) {
				this._view.removeDependent(oControl);
			},

			/**
			 * Navigate to another target.
			 *
			 * @alias sap.fe.templates.ExtensionAPI#navigateToTarget
			 * @param {string} sTarget Name of the target route
			 * @param {sap.ui.model.Context} [oContext] Context instance
			 *
			 * @public
			 */
			navigateToTarget: function(sTarget, oContext) {
				this._controller._routing.navigateToTarget(oContext, sTarget);
			},

			/**
			 * Load a fragment and go through the template preprocessor with the current page context.
			 *
			 * @alias sap.fe.templates.ExtensionAPI#loadFragment
			 * @param {object} mSettings The settings object
			 * @param {string} mSettings.id The id of the fragment itself
			 * @param {string} mSettings.name The name of the fragment to load
			 * @param {object} mSettings.controller The controller to attach to the fragment
			 * @returns {Promise<Element[]|sap.ui.core.Element[]>} The fragment definition
			 *
			 * @public
			 */
			loadFragment: function(mSettings) {
				var that = this;
				var oTemplateComponent = Component.getOwnerComponentFor(this._view);
				var oMetaModel = this.getModel().getMetaModel(),
					oPreprocessorSettings = {
						bindingContexts: {
							"entitySet": oMetaModel.createBindingContext("/" + oTemplateComponent.getEntitySet())
						},
						models: {
							"entitySet": oMetaModel,
							metaModel: oMetaModel
						},
						appComponent: CommonUtils.getAppComponent(this._view)
					};
				var oTemplatePromise = DelegateUtil.templateControlFragment(mSettings.name, oPreprocessorSettings, {
					controller: mSettings.controller,
					isXML: false,
					id: mSettings.id
				});
				oTemplatePromise
					.then(function(oFragment) {
						that.addDependent(oFragment);
					})
					.catch(function(oError) {
						Log.error(oError);
					});
				return oTemplatePromise;
			},

			/**
			 * Triggers an update of the app state.
			 * Should be called if the state of a control, or any other state relevant information, was changed.
			 *
			 * @alias sap.fe.templates.ExtensionAPI#updateAppState
			 * @returns {Promise} resolved with the new app state object
			 *
			 * @public
			 */
			updateAppState: function() {
				return this._controller
					.getAppComponent()
					.getAppStateHandler()
					.createAppState();
			},

			/**
			 * ExtensionAPI that provides methods related to editFlow.
			 *
			 * @namespace sap.fe.templates.ExtensionAPI.editFlow
			 * @public
			 * @since 1.85.0
			 */

			// AllowListing / Enhancing of public methods provided by the EditFlow Controller Extension
			editFlow: {
				/**
				 * Secured execution of the given function. Ensures that the function is only executed when certain conditions are fulfilled.
				 *
				 * @alias sap.fe.templates.ExtensionAPI.editFlow#securedExecution
				 * @param {Function} fnFunction The function to be executed. Should return a promise that is settled after completion of the execution. If nothing is returned, immediate completion is assumed.
				 * @param {map} [mParameters] Parameters to define the preconditions to be checked before execution
				 * @param {object} [mParameters.busy] Parameters regarding busy indication
				 * @param {boolean} [mParameters.busy.set=true] Triggers a busy indication during function execution. Can be set to false in case of immediate completion.
				 * @param {boolean} [mParameters.busy.check=true] Checks whether the application is currently busy. Function is only executed if not. Has to be set to false, if function is not triggered by direct user interaction, but as result of another function, that set the application busy.
				 * @param {boolean} [mParameters.updatesDocument] This operation updates the current document without using the bound model and context therefore draft status is updated in case of draft and user has to confirm cancelling the edit
				 * @returns {Promise} A Promise that is rejected, if execution is prohibited, and settled equivalent to the one returned by fnFunction.
				 *
				 * @public
				 */
				securedExecution: function(fnFunction, mParameters) {
					return this._controller.editFlow.securedExecution(fnFunction, mParameters);
				},

				/**
				 * Invokes a bound or unbound action.
				 *
				 * @static
				 * @alias sap.fe.templates.ExtensionAPI.editFlow#invokeAction
				 * @param {string} sActionName The name of the action to be called
				 * @param {Array|sap.ui.model.odata.v4.Context} vContext One or array of contexts, null in case of an unbound action
				 * @param {map} [mParameters] contains the following attributes:
				 * @param {string} [mParameters.label] a human-readable label for the action
				 * @returns {Promise}
				 *
				 * @public
				 */
				invokeAction: function(sActionName, vContext, mParameters) {
					var _mParameters = {};
					_mParameters.label = mParameters.label;

					if (vContext) {
						_mParameters.contexts = vContext;
					} else {
						// in case no context is passed we have to determine the model instead
						_mParameters.model = this._controller.getView().getModel();
					}

					return this._controller.editFlow.invokeAction(sActionName, _mParameters);
				}
			},
			/**
			 * ExtensionAPI providing edit flow related methods.
			 * @namespace sap.fe.templates.ExtensionAPI.intentBasedNavigation
			 * @public
			 * @since 1.86.0
			 */
			intentBasedNavigation: {
				/**
				 * Navigates to an Outbound provided in the manifest.
				 *
				 * @static
				 * @alias sap.fe.templates.ExtensionAPI.intentBasedNavigation#navigateOutbound
				 * @param {string} sOutbound Identifier to location the outbound in the manifest
				 * @param {object} mNavigationParameters Optional map containing key/value pairs to be passed to the intent
				 * @public
				 */
				navigateOutbound: function(sOutbound, mNavigationParameters) {
					var oInternalModelContext = this._controller.getView().getBindingContext("internal");
					oInternalModelContext.setProperty("externalNavigationContext", { "page": false });
					this._controller._intentBasedNavigation.navigateOutbound(sOutbound, mNavigationParameters);
				}
			}
		});

		return extensionAPI;
	}
);
