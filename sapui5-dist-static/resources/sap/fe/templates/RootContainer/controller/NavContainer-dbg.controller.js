sap.ui.define(
	[
		"sap/ui/model/json/JSONModel",
		"./RootContainerBaseController",
		"sap/fe/core/CommonUtils",
		"sap/fe/core/controllerextensions/ViewState",
		"sap/m/Link",
		"sap/m/MessagePage",
		"sap/m/MessageBox"
	],
	function(JSONModel, BaseController, CommonUtils, ViewState, Link, MessagePage, MessageBox) {
		"use strict";

		/**
		 * @class Application developers should use this controller for the sap.fe.templates.RootContainer.NavContainer.Fcl view.
		 *
		 * This controller and its associated view provide the entry point for your application when using the classic full page layout in SAP Fiori elements.
		 * When used, you should declare a sap.m.routing.Router as `router` in your application manifest.
		 *
		 * @hideconstructor
		 * @public
		 * @name sap.fe.templates.RootContainer.controller.NavContainer
		 */
		return BaseController.extend("sap.fe.templates.RootContainer.controller.NavContainer", {
			viewState: ViewState.override({
				adaptStateControls: function(aStateControls) {
					var that = this;
					var pCurrentPage = new Promise(function(resolve) {
						var oView = that.getView(),
							oNavContainer = oView.byId("appContent");
						var oCurrentPage = oNavContainer.getCurrentPage();
						if (
							oCurrentPage &&
							oCurrentPage.getController &&
							oCurrentPage.getController().isPlaceholder &&
							oCurrentPage.getController().isPlaceholder()
						) {
							oCurrentPage.getController().attachEventOnce("targetPageInsertedInContainer", function(oEvent) {
								var oTargetPage = oEvent.getParameter("targetpage");
								resolve(CommonUtils.getTargetView(oTargetPage));
							});
						} else {
							resolve(CommonUtils.getTargetView(oCurrentPage));
						}
					});
					aStateControls.push(pCurrentPage);
				}
			}),

			/**
			 * @private
			 * @name sap.fe.templates.RootContainer.controller.NavContainer.getMetadata
			 * @function
			 */

			_getNavContainer: function() {
				return this.getView().getContent()[0];
			},

			/**
			 * Check if the FCL component is enabled.
			 *
			 * @function
			 * @name sap.fe.templates.RootContainer.controller.NavContainer.controller#isFclEnabled
			 * @memberof sap.fe.templates.RootContainer.controller.NavContainer.controller
			 * @returns {bool} true or false
			 *
			 * @ui5-restricted
			 * @final
			 */
			isFclEnabled: function() {
				return false;
			},

			_scrollTablesToLastNavigatedItems: function() {},

			displayMessagePage: function(sErrorMessage, mParameters) {
				var oNavContainer = this._getNavContainer();

				if (!this.oMessagePage) {
					this.oMessagePage = new MessagePage({
						showHeader: false,
						icon: "sap-icon://message-error"
					});

					oNavContainer.addPage(this.oMessagePage);
				}

				this.oMessagePage.setText(sErrorMessage);

				if (mParameters.technicalMessage) {
					this.oMessagePage.setCustomDescription(
						new Link({
							text: mParameters.description || mParameters.technicalMessage,
							press: function() {
								MessageBox.show(mParameters.technicalMessage, {
									icon: MessageBox.Icon.ERROR,
									title: mParameters.title,
									actions: [MessageBox.Action.OK],
									defaultAction: MessageBox.Action.OK,
									details: mParameters.technicalDetails || "",
									contentWidth: "60%"
								});
							}
						})
					);
				} else {
					this.oMessagePage.setDescription(mParameters.description || "");
				}

				oNavContainer.to(this.oMessagePage.getId());
			},

			/**
			 * Trigger the navigation to the Placeholder for a specific route target.
			 *
			 * @function
			 * @name sap.fe.templates.RootContainer.controller.NavContainer.controller#displayPlaceholders
			 * @memberof sap.fe.templates.RootContainer.controller.NavContainer.controller
			 * @param {object} [oTarget] route target for which the placeHolder must be displayed
			 * @param {object} [aTargets] array containing routing targets for the current navigation
			 * @param {object} [oPlaceholderTarget] objec containing the view to be displayed . if empty the placeHolder view is created and stored
			 * @param {object} [oRootContainer] NavContainer or FCL
			 *
			 * @returns {boolean} true if the placeHolder is displayed
			 * @ui5-restricted
			 * @final
			 */
			displayPlaceholders: function(oTarget, aTargets, oPlaceholderTarget, oRootContainer) {
				var bPlaceholderDisplayed = false;
				oRootContainer.setDefaultTransitionName("placeholder");
				var oPlaceholderMapping = this.oPlaceholder.getPlaceholderMapping();

				if (oPlaceholderMapping[oTarget.name]) {
					if (!oPlaceholderTarget.view) {
						oPlaceholderTarget.view = this.oPlaceholder.createPlaceholderView(oTarget.name);
						oRootContainer.addPage(oPlaceholderTarget.view);
					}

					var oStartupParameterFromManifest = this.oPlaceholder.buildOptionParameters(
						oTarget.options && oTarget.options.settings && oTarget.options.settings._placeholderScreen
					);

					var bPlaceholderScreenEnabledFirstTimeOnly =
						oTarget.name === "sap.fe.templates.ListReport"
							? true
							: this.oPlaceholder.getStartupOptions("enabledFirstTimeOnly") ||
							  (this.oPlaceholder.getStartupOptions("enabledFirstTimeOnly") === null &&
									oStartupParameterFromManifest.enabledFirstTimeOnly);
					if (
						(bPlaceholderScreenEnabledFirstTimeOnly && !oPlaceholderTarget.view.getController().istargetNavigated(oTarget)) ||
						!bPlaceholderScreenEnabledFirstTimeOnly
					) {
						oPlaceholderTarget.view.getController().setPlaceholderOption(oStartupParameterFromManifest);
						oRootContainer.to(oPlaceholderTarget.view, "show");
						bPlaceholderDisplayed = true;
					}
				}

				return bPlaceholderDisplayed;
			}
		});
	},
	true
);
