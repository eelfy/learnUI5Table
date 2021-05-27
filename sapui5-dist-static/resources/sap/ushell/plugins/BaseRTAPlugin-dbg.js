// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define([
	"sap/ui/core/Component",
	"sap/ushell/appRuntime/ui5/plugins/baseRta/AppLifeCycleUtils",
	"sap/ushell/appRuntime/ui5/plugins/baseRta/CheckConditions",
	"sap/ushell/appRuntime/ui5/plugins/baseRta/Trigger",
	"sap/base/Log"
],
function (
	Component,
	AppLifeCycleUtils,
	CheckConditions,
	Trigger,
	Log
) {
	"use strict";

	var BaseRTAPlugin = Component.extend("sap.ushell.plugins.BaseRTAPlugin", {
		sType: null,

		init: function (mConfig) {
			this.mConfig = mConfig;
			this.mConfig.i18n = this.getModel("i18n").getResourceBundle();
			this.mConfig.loadPlugins = this._loadPlugins.bind(this);
			this.mConfig.onStartHandler = this._onStartHandler.bind(this);
			this.mConfig.onErrorHandler = this._onErrorHandler.bind(this);
			this.mConfig.onStopHandler = this._onStopHandler.bind(this);

			this.oTrigger = new Trigger(this.mConfig);

			if (
				this.mConfig.checkRestartRTA
				&& CheckConditions.checkUI5App(this)
				&& CheckConditions.checkRestartRTA(this.mConfig.layer)
			) {
				this.oTrigger.triggerStartRta(this);
			}

			var oAppLifeCycleService = AppLifeCycleUtils.getAppLifeCycleService();
			oAppLifeCycleService.attachAppLoaded(this._onAppLoaded, this);
		},

		exit: function () {
			var oAppLifeCycleService = AppLifeCycleUtils.getAppLifeCycleService();
			oAppLifeCycleService.detachAppLoaded(this._onAppLoaded, this);
			if (this._onRendererCreated) {
				var oContainer = AppLifeCycleUtils.getContainer();
				oContainer.detachRendererCreatedEvent(this._onRendererCreated, this);
			}
		},

		_onAppLoaded: function () {
			if (CheckConditions.checkUI5App(this)) {
				if (CheckConditions.checkRestartRTA(this.mConfig.layer)) {
					this.oTrigger.triggerStartRta(this);
				}
				this._adaptButtonVisibility(this.mConfig.id, true);
			} else {
				this._adaptButtonVisibility(this.mConfig.id, false);
			}
		},

		/**
		 * Event handler for the "Adapt" button of the RTA FLP Plugin
		 * Checks the supported browsers and starts the RTA
		 * @private
		 */
		_onAdapt: function () {
			var bFlexEnabled = CheckConditions.checkFlexEnabledOnStart(this);
			if (!bFlexEnabled) {
				this.oTrigger.handleFlexDisabledOnStart();
			} else {
				this.oTrigger.triggerStartRta(this);
			}
		},

		_adaptButtonVisibility: function (vControl, bVisible) {
			if (typeof vControl === "string") {
				vControl = sap.ui.getCore().byId(vControl);
			}
			if (!vControl) {
				return;
			}
			vControl.setVisible(bVisible);
		},

		/**
		 * Leaves the RTA adaptation mode
		 * @private
		 */
		_exitAdaptation: function () {
			if (this._switchToDefaultMode) {
				this._switchToDefaultMode();
			}
			this.oTrigger.exitRta();
		},

		/**
		 * This function is called when the start event of RTA was fired
		 * @private
		 */
		_onStartHandler: function () {},

		/**
		 * This function is called when the error event of RTA was fired
		 * @param {any} vError - value on error
		 * @private
		 */
		_onErrorHandler: function (vError) {
			this.oTrigger.errorHandler(vError);
			if (vError !== "Reload triggered") {
				this._exitAdaptation();

				var sError;
				var sMessage;

				if (vError instanceof Error) {
					sError = vError.stack;
					sMessage = this.mConfig.i18n.getText("TECHNICAL_ERROR");
				} else if (typeof vError === "string") {
					sError = sMessage = vError;
				}

				Log.error("Cannot start UI Adaptation: ", sError);

				sap.ui.require([
					"sap/ui/rta/Utils",
					"sap/m/MessageBox"
				], function (
					Utils,
					MessageBox
				) {
					MessageBox.error(
						sMessage,
						{
							title: this.mConfig.i18n.getText("ERROR_TITLE"),
							onClose: null,
							styleClass: Utils.getRtaStyleClassName()
						}
					);
				}.bind(this));
			}
		},

		/**
		 * This function is called when the stop event of RTA was fired
		 * @private
		 */
		_onStopHandler: function () {
			this._exitAdaptation();
		},

		/**
		 * This function should be overridden when custom plugins are needed
		 *
		 * @private
		 * @returns {Promise} Returns a resolved Promise
		 */
		_loadPlugins: function () {
			return Promise.resolve();
		}

	});
	return BaseRTAPlugin;

}, true /* bExport */);
