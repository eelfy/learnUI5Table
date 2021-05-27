/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */

sap.ui.define(["sap/ui/core/mvc/ControllerExtension", "sap/fe/core/BusyLocker", "sap/base/util/UriParameters", "sap/base/Log"], function(
	ControllerExtension,
	BusyLocker,
	UriParameters,
	Log
) {
	"use strict";

	/**
	 * {@link sap.ui.core.mvc.ControllerExtension Controller extension} for Placeholder
	 *
	 * @namespace
	 * @alias sap.fe.core.controllerextensions.Placeholder
	 *
	 **/
	var Extension = ControllerExtension.extend("sap.fe.core.controllerextensions.Placeholder", {
		enumViewType: {
			OBJECTPAGE: "ObjectPage",
			LISTREPORT: "ListReport"
		},

		enumStartingParams: {
			FE_VIEW_CREATED: "FE-VIEW-CREATED",
			FE_DATA_LOADED: "FE-DATA-LOADED",
			FE_HEROES_LOADED: "FE-HEROES-LOADED",
			FE_WORKERS_LOADED: "FE-WORKERS-LOADED",
			FE_HEROES_WORKERS_LOADED: "FE-HEROES-WORKERS-LOADED",
			DISABLED: "DISABLED"
		},

		override: {
			onExit: function() {
				this.oRouter.detachBeforeRouteMatched(this._fnBeforeRouteMatched);
				sap.m.NavContainer.addCustomTransition(
					"placeholder",
					function(oFromPage, oToPage, fCallback) {
						sap.m.NavContainer.transitions["show"].to(oFromPage, oToPage, fCallback);
					},
					sap.m.NavContainer.transitions["show"].back
				);
			}
		},

		attachRouteMatchers: function() {
			this._init();
			var that = this;
			if (this._isPlaceholderEnabledInManifest() || !this.getStartupOptions("disabled")) {
				this._fnBeforeRouteMatched = function(oEvent) {
					var bDisplayBusyIndicator = that.navigateToPlaceholder(
						that.oAppComponent,
						that.oRouter,
						that.oRootContainer,
						that.oPlaceholders
					);
					if (bDisplayBusyIndicator) {
						var oRootView = that.oAppComponent.getRootControl();
						BusyLocker.lock(oRootView);
						that.oRouter.attachEventOnce("routeMatched", function() {
							var oRootView = that.oAppComponent.getRootControl();
							if (BusyLocker.isLocked(oRootView)) {
								BusyLocker.unlock(oRootView);
							}
						});
					}
				};
				this.oRouter.attachBeforeRouteMatched(this._fnBeforeRouteMatched);
			}
		},

		buildOptionParameters: function(sStartupParam) {
			var oStartupOptions = {};
			if (sStartupParam && sStartupParam.indexOf("-FIRSTONLY") !== -1) {
				oStartupOptions.enabledFirstTimeOnly = true;
				sStartupParam = sStartupParam.replace("-FIRSTONLY", "");
			} else {
				oStartupOptions.enabledFirstTimeOnly = false;
			}
			if (!sStartupParam) {
				oStartupOptions.disabled = null;
				oStartupOptions.enabledFirstTimeOnly = null;
				oStartupOptions.transition = null;
			} else if (sStartupParam === "DISABLED") {
				oStartupOptions.disabled = true;
				oStartupOptions.transition = null;
			} else {
				oStartupOptions.disabled = false;
				oStartupOptions.transition = sStartupParam;
			}
			return oStartupOptions;
		},

		_init: function() {
			var that = this;
			this.oAppComponent = this.base.getAppComponent();
			this.oRouting = this.oAppComponent._oRouting;
			this.oRootContainer = this.oAppComponent.getRootContainer();
			this.oRouter = this.oAppComponent.getRouter();
			this.oPlaceholders = {};

			this.oStartupOptions = this.buildOptionParameters(UriParameters.fromQuery(window.location.search).get("sap-ui-xx-placeholder"));

			this.setPlaceholderMapping({
				"sap.fe.templates.ListReport": {
					placeHolderName: "sap.fe.placeholder.view.PlaceholderLR",
					viewType: this.enumViewType.LISTREPORT
				},
				"sap.fe.templates.AnalyticalListPage": {
					placeHolderName: "sap.fe.placeholder.view.PlaceholderLR",
					viewType: this.enumViewType.LISTREPORT
				},
				"sap.fe.templates.ObjectPage": {
					placeHolderName: "sap.fe.placeholder.view.PlaceholderOP",
					viewType: this.enumViewType.OBJECTPAGE
				}
			});

			sap.m.NavContainer.addCustomTransition(
				"placeholder",
				function(oFromPage, oToPage, fCallback) {
					if (oFromPage.getController && oFromPage.getController().isPlaceholder && oFromPage.getController().isPlaceholder()) {
						var sTransition = that.getStartupOptions("transition") || oFromPage.getController().getOptions("transition");
						if (sTransition !== that.enumStartingParams.FE_VIEW_CREATED) {
							oFromPage.getController().fireEvent("targetPageInsertedInContainer", { targetpage: oToPage });
							var oFromViewCtrl = oFromPage.getController();
							var oFromPageZIndex = oFromPage.$().css("z-index");
							oFromPage.$().css("z-index", 100);
							oToPage.removeStyleClass("sapMNavItemHidden"); // remove the "hidden" class which has been added by the NavContainer before the transition was called
							fCallback();
							var _removePlaceholder = function(oEvent) {
								oFromPage.$().css("z-index", oFromPageZIndex);
								oFromPage.addStyleClass("sapMNavItemHidden");
								oFromViewCtrl.currentTargetNavigated();

								aPlaceHolderEvents.forEach(function(oEvent) {
									oPageReady.detachEvent(oEvent.eventId, oEvent.fn);
								});
								aPlaceHolderEvents = [];
							};

							var aPlaceHolderEvents = [];
							var oPageReady = oToPage
								.getComponentInstance()
								.getRootControl()
								.getController().pageReady;
							oPageReady.attachEvent("pageReady", _removePlaceholder);
							aPlaceHolderEvents.push({ "eventId": "pageReady", "fn": _removePlaceholder });

							var pWaitHeroes, pWaitWorkers;
							var fnInitWaitHeroes = function() {
								return new Promise(function(resolve, reject) {
									oPageReady.attachEvent("heroesBatchReceived", resolve);
									oPageReady.attachEvent("pageReady", reject);
									aPlaceHolderEvents.push({ "eventId": "heroesBatchReceived", "fn": resolve });
									aPlaceHolderEvents.push({ "eventId": "pageReady", "fn": reject });
								});
							};

							var fnInitWaitWorkers = function() {
								return new Promise(function(resolve, reject) {
									oPageReady.attachEvent("workersBatchReceived", resolve);
									oPageReady.attachEvent("pageReady", reject);
									aPlaceHolderEvents.push({ "eventId": "workersBatchReceived", "fn": resolve });
									aPlaceHolderEvents.push({ "eventId": "pageReady", "fn": reject });
								});
							};

							switch (sTransition) {
								case that.enumStartingParams.FE_HEROES_LOADED:
									pWaitHeroes = fnInitWaitHeroes();
									pWaitHeroes.then(_removePlaceholder).catch(function() {
										Log.info("PlaceHolder : Heroes request not received");
									});
									break;
								case that.enumStartingParams.FE_WORKERS_LOADED:
									pWaitWorkers = fnInitWaitWorkers();
									pWaitWorkers.then(_removePlaceholder).catch(function() {
										Log.info("PlaceHolder : Workers request not received");
									});
									break;
								case that.enumStartingParams.FE_HEROES_WORKERS_LOADED:
									pWaitHeroes = fnInitWaitHeroes();
									pWaitWorkers = fnInitWaitWorkers();
									Promise.all([pWaitHeroes, pWaitWorkers])
										.then(_removePlaceholder)
										.catch(function() {
											Log.info("PlaceHolder : Heroes or Workers request not received");
										});
									break;

								default:
							}
						} else {
							var oFromViewCtrl = oFromPage.getController();
							oFromViewCtrl.currentTargetNavigated();
							sap.m.NavContainer.transitions["show"].to(oFromPage, oToPage, fCallback);
						}
					} else {
						sap.m.NavContainer.transitions["show"].to(oFromPage, oToPage, fCallback);
					}
				},
				sap.m.NavContainer.transitions["show"].back
			); /* code for transition */
		},

		_isPlaceholderEnabledInManifest: function() {
			var oManifestRoutingCfg = this.oAppComponent.getMetadata().getManifestEntry("/sap.ui5/routing");
			var aTargets = oManifestRoutingCfg["targets"];
			return Object.keys(aTargets).some(function(sTargetName) {
				var oTarget = oManifestRoutingCfg["targets"][sTargetName];
				return (
					oTarget.options &&
					oTarget.options.settings &&
					oTarget.options.settings._placeholderScreen &&
					oTarget.options.settings._placeholderScreen !== "DISABLED"
				);
			});
		},

		getStartupOptions: function(sKeyName) {
			return this.oStartupOptions[sKeyName];
		},

		setPlaceholderMapping: function(oMapping) {
			this.oPlaceholderMapping = oMapping;
		},

		getPlaceholderMapping: function(oMapping) {
			return this.oPlaceholderMapping;
		},

		createPlaceholderView: function(sViewName) {
			var oPlaceholder = new sap.ui.core.mvc.XMLView({
				viewName: this.oPlaceholderMapping[sViewName].placeHolderName
			});
			return oPlaceholder;
		},

		/**
		 * Trigger the navigation to the Placeholder based on the current hash (support NavContainer and FlexibleColumnLayout).
		 *
		 * @function
		 * @name sap.fe.templates.RootContainer.controller.Fcl.controller#navigateToPlaceholder
		 * @memberof sap.fe.templates.RootContainer.controller.Fcl.controller
		 * @param {object} [oAppComponent] the app component
		 * @param {object} [oRouter] the router component
		 * @param {object} [oRootContainer] NavContainer of FCL
		 * @param {object} [oPlaceholders] Map of placeholders for each kind of view (List Report, Object Page)
		 * @ui5-restricted
		 * @final
		 */

		navigateToPlaceholder: function(oAppComponent, oRouter, oRootContainer, oPlaceholders) {
			var oRouting = oAppComponent.getRoutingService();
			var sCurrentTechnicalPath = oRouter
				.getHashChanger()
				.getHash()
				.match(/([^?]*)/)[0];
			var oRoute = oRouting.getRouteFromHash(oRouter, oAppComponent);
			var aTargets = oRouting.getTargetsFromRoute(oRoute, oAppComponent);
			var that = this;
			var bDisplayBusyIndicator = true;

			//if the technical Path doesn't change, the placeholder is not reloaded
			// eg: this is the case when the user click on another section in the view (only the appstate is updated)
			if (sCurrentTechnicalPath !== this.sPreviousTechnicalPath) {
				aTargets.forEach(function(oTarget, index) {
					var bPlaceholderDisabled = true;
					switch (that.getStartupOptions("disabled")) {
						case false:
							bPlaceholderDisabled = false;
							break;
						case true:
							bPlaceholderDisabled = true;
							break;
						default:
							//getting configuration from Manifest
							var oStartupParameterFromManifest = that.buildOptionParameters(
								oTarget.options && oTarget.options.settings && oTarget.options.settings._placeholderScreen
							);
							bPlaceholderDisabled = oStartupParameterFromManifest.disabled;
					}

					if (bPlaceholderDisabled === false) {
						var oPlaceholderTarget;
						var oPlaceholderMapping = that.getPlaceholderMapping();
						if (oPlaceholderMapping[oTarget.name]) {
							switch (oPlaceholderMapping[oTarget.name].viewType) {
								case that.enumViewType.OBJECTPAGE:
									oPlaceholders.oOP = oPlaceholders.oOP ? oPlaceholders.oOP : {};
									oPlaceholderTarget = oPlaceholders.oOP;
									break;
								case that.enumViewType.LISTREPORT:
									oPlaceholders.oLR = oPlaceholders.oLR ? oPlaceholders.oLR : {};
									oPlaceholderTarget = oPlaceholders.oLR;
									break;
								default:
									break;
							}

							bDisplayBusyIndicator = that.base.displayPlaceholders(
								oTarget,
								aTargets,
								oPlaceholderTarget,
								oRootContainer,
								oRouter
							)
								? false
								: true;
						}
					}
				});
			}
			this.sPreviousTechnicalPath = sCurrentTechnicalPath;
			return bDisplayBusyIndicator;
		}
	});
	return Extension;
});
