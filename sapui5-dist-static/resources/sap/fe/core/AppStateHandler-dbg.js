/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */
sap.ui.define(
	[
		"sap/ui/mdc/p13n/StateUtil",
		"sap/ui/base/Object",
		"sap/fe/core/library",
		"sap/fe/navigation/library",
		"sap/fe/core/CommonUtils",
		"sap/ui/fl/apply/api/ControlVariantApplyAPI",
		"sap/base/Log",
		"sap/base/util/merge",
		"sap/base/util/deepEqual",
		"sap/fe/core/BusyLocker"
	],
	function(StateUtil, BaseObject, CoreLibrary, NavLibrary, CommonUtils, ControlVariantApplyAPI, Log, merge, deepEqual, BusyLocker) {
		"use strict";

		var NavType = NavLibrary.NavType;

		function _toES6Promise(oThenable) {
			return Promise.resolve(
				oThenable
					.then(function() {
						return Array.prototype.slice.call(arguments);
					})
					.catch(function() {
						return Array.prototype.slice.call(arguments);
					})
			);
		}

		var AppStateHandler = BaseObject.extend("sap.fe.core.AppStateHandler", {
			constructor: function(oAppComponent) {
				this.oAppComponent = oAppComponent;
				this.sId = oAppComponent.getId() + "/AppStateHandler";

				this.bNoRouteChange = false;
				Log.info("APPSTATE : Appstate handler initialized");
				return BaseObject.apply(this, arguments);
			},
			getId: function() {
				return this.sId;
			},
			/**
			 * Creates/updates the appstate.
			 *
			 * @returns {Promise} promise resolving the stored data
			 * @ui5-restricted
			 */
			createAppState: function() {
				if (BusyLocker.isLocked(this)) {
					return Promise.resolve();
				}

				var oNavigationService = this.oAppComponent.getNavigationService(),
					oRouterProxy = this.oAppComponent.getRouterProxy(),
					sHash = oRouterProxy.getHash(),
					oController = this.oAppComponent.getRootControl().getController(),
					that = this;

				if (!oController.viewState) {
					return Promise.reject(
						"viewState controller extension not available for controller: " + oController.getMetadata().getName()
					);
				}

				return oController.viewState.retrieveViewState().then(function(mInnerAppState) {
					var oStoreData = { appState: mInnerAppState };
					if (mInnerAppState && !deepEqual(that._mCurrentAppState, mInnerAppState)) {
						that._mCurrentAppState = mInnerAppState;
						var oAppState = oNavigationService.storeInnerAppStateWithImmediateReturn(oStoreData, true);
						Log.info("APPSTATE: Appstate stored");
						var sAppStateKey = oAppState.appStateKey;
						var sNewHash = oNavigationService.replaceInnerAppStateKey(sHash, sAppStateKey);
						if (sNewHash !== sHash) {
							oRouterProxy.navToHash(sNewHash);
							that.bNoRouteChange = true;
						}
						Log.info("APPSTATE: navToHash");
					}
					return oStoreData;
				});
			},

			_createNavigationParameters: function(oAppData, sNavType) {
				return Object.assign({}, oAppData, {
					selectionVariantDefaults: oAppData.oDefaultedSelectionVariant,
					selectionVariant: oAppData.oSelectionVariant,
					requiresStandardVariant: !oAppData.bNavSelVarHasDefaultsOnly,
					navigationType: sNavType
				});
			},

			/**
			 * Applies an appstate by fetching appdata and passing it to _applyAppstateToPage.
			 *
			 * @function
			 * @static
			 * @memberof sap.fe.core.AppStateHandler
			 * @returns {Promise} a promise for async handling
			 * @private
			 * @ui5-restricted
			 **/
			applyAppState: function() {
				if (BusyLocker.isLocked(this)) {
					return Promise.resolve();
				}
				BusyLocker.lock(this);

				var that = this,
					oNavigationService = this.oAppComponent.getNavigationService();
				// TODO oNavigationService.parseNavigation() should return ES6 promise instead jQuery.promise
				return _toES6Promise(oNavigationService.parseNavigation())
					.catch(function(aErrorData) {
						if (!aErrorData) {
							aErrorData = [];
						}
						Log.warning("APPSTATE: Parse Navigation failed", aErrorData[0]);
						return [
							{
								/* app data */
							},
							aErrorData[1],
							aErrorData[2]
						];
					})
					.then(function(aResults) {
						Log.info("APPSTATE: Parse Navigation done");

						// aResults[1] => oStartupParameters (not evaluated)
						var oAppData = aResults[0] || {},
							sNavType = aResults[2] || NavType.initial,
							oRootController = that.oAppComponent.getRootControl().getController();

						that._mCurrentAppState = sNavType === NavType.iAppState ? oAppData && oAppData.appState : undefined;

						if (!oRootController.viewState) {
							throw new Error("viewState extension required for controller " + oRootController.getMetadata().getName());
						}

						return oRootController.viewState
							.applyViewState(that._mCurrentAppState, that._createNavigationParameters(oAppData, sNavType))
							.catch(function(oError) {
								Log.error("appState could not be applied", oError);
								throw oError;
							});
					})
					.finally(function() {
						BusyLocker.unlock(that);
					});
			},
			/**
			 * To check is route is changed by change in the iAPPState.
			 *
			 * @returns {boolean}
			 **/
			checkIfRouteChangedByIApp: function() {
				return this.bNoRouteChange;
			},
			/**
			 * Reset the route changed by iAPPState.
			 **/
			resetRouteChangedByIApp: function() {
				if (this.bNoRouteChange) {
					this.bNoRouteChange = false;
				}
			},
			_isListBasedComponent: function(oComponent) {
				return oComponent.isA("sap.fe.templates.ListComponent");
			}
		});

		return AppStateHandler;
	},
	/* bExport= */
	true
);
