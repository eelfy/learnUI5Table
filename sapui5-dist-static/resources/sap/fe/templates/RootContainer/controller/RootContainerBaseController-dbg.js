sap.ui.define(
	[
		"sap/ui/model/json/JSONModel",
		"sap/fe/core/BaseController",
		"sap/ui/core/Component",
		"sap/ui/core/routing/HashChanger",
		"sap/fe/core/CommonUtils",
		"sap/fe/macros/SizeHelper",
		"sap/ui/model/odata/v4/AnnotationHelper",
		"sap/ui/base/BindingParser",
		"sap/base/Log",
		"sap/fe/core/controllerextensions/Placeholder"
	],
	function(
		JSONModel,
		BaseController,
		Component,
		HashChanger,
		CommonUtils,
		SizeHelper,
		AnnotationHelper,
		BindingParser,
		Log,
		Placeholder
	) {
		"use strict";

		return BaseController.extend("sap.fe.templates.RootContainer.controller.RootContainerBaseController", {
			oPlaceholder: Placeholder,
			onInit: function() {
				SizeHelper.init();

				this._aHelperModels = [];
			},
			attachRouteMatchers: function() {
				this.oPlaceholder.attachRouteMatchers();
				this.getAppComponent()
					.getRoutingService()
					.attachAfterRouteMatched(this.shellTitleHandler, this);
			},
			onExit: function() {
				this.getAppComponent()
					.getRoutingService()
					.detachAfterRouteMatched(this.shellTitleHandler, this);
				this.oRouter = null;

				SizeHelper.exit();

				// Destroy all JSON models created dynamically for the views
				this._aHelperModels.forEach(function(oModel) {
					oModel.destroy();
				});
			},
			/**
			 * Convenience method for getting the resource bundle.
			 * @public
			 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
			 */
			getResourceBundle: function() {
				return this.getOwnerComponent()
					.getModel("i18n")
					.getResourceBundle();
			},
			getRouter: function() {
				if (!this.oRouter) {
					this.oRouter = this.getAppComponent().getRouter();
				}

				return this.oRouter;
			},

			_createHelperModel: function() {
				// We keep a reference on the models created dynamically, as they don't get destroyed
				// automatically when the view is destroyed.
				// This is done during onExit
				var oModel = new JSONModel();
				this._aHelperModels.push(oModel);

				return oModel;
			},

			/**
			 * Function waiting for the Right most view to be ready.
			 *
			 * @memberof sap.fe.templates.RootContainer.controller.BaseController
			 * @param {*} oEvent reference an Event parameter coming from routeMatched event
			 * @returns {Promise}
			 */
			waitForRightMostViewReady: function(oEvent) {
				return new Promise(function(resolve) {
					var aContainers = oEvent.getParameter("views"),
						// There can also be reuse components in the view, remove them before processing.
						aFEContainers = [];
					aContainers.forEach(function(oContainer) {
						var oView = oContainer;
						if (oContainer && oContainer.getComponentInstance) {
							var oComponentInstance = oContainer.getComponentInstance();
							oView = oComponentInstance.getRootControl();
						}
						if (oView && oView.getController() && oView.getController().pageReady) {
							aFEContainers.push(oView);
						}
					});
					var oRightMostFEView = aFEContainers[aFEContainers.length - 1];
					if (oRightMostFEView && oRightMostFEView.getController().pageReady.isPageReady()) {
						resolve(oRightMostFEView);
					} else {
						oRightMostFEView &&
							oRightMostFEView.getController().pageReady.attachEventOnce("pageReady", function() {
								resolve(oRightMostFEView);
							});
					}
				});
			},

			/**
			 * This function is updating the shell title after each navigation.
			 *
			 * @param oEvent
			 * @name sap.fe.templates.RootContainer.controller.BaseController#shellTitleHandler
			 * @memberof sap.fe.templates.RootContainer.controller.BaseController
			 */
			shellTitleHandler: function(oEvent) {
				var that = this;
				if (!that.oShellTitlePromise) {
					that.oShellTitlePromise = that
						.waitForRightMostViewReady(oEvent)
						.then(function(oView) {
							var oAppComponent = that.getAppComponent();
							var oData = { oView: oView, oAppComponent: oAppComponent };
							that._scrollTablesToLastNavigatedItems();
							if (oAppComponent.getEnvironmentCapabilities().getCapabilities().UShell) {
								that.computeTitleHierarchy(oData);
							}
							var oLastFocusedControl = oAppComponent.getRouterProxy().getFocusControlForCurrentHash();
							if (oView.getController() && oView.getController().onPageReady) {
								if (oLastFocusedControl) {
									oView.getParent().onPageReady({ lastFocusedControl: oLastFocusedControl });
								} else {
									var currentFocusedControlId = sap.ui.getCore().getCurrentFocusedControlId();
									var oCurrentFocusedControl = {
										controlId: currentFocusedControlId,
										focusInfo: { id: currentFocusedControlId }
									};
									oView.getParent().onPageReady({ lastFocusedControl: oCurrentFocusedControl });
								}
							}
							that.oShellTitlePromise = null;
						})
						.catch(function(oError) {
							Log.error("An error occurs while computing the title hierarchy and calling focus method", oError);
							that.oShellTitlePromise = null;
						});
				}
			},

			/**
			 * This function returns the TitleHierarchy cache ( or initializes it if undefined).
			 *
			 * @name sap.fe.templates.RootContainer.controller.BaseController#getTitleHierarchyCache
			 * @memberof sap.fe.templates.RootContainer.controller.BaseController
			 *
			 * @returns {object}  returns the TitleHierarchy cache
			 */
			getTitleHierarchyCache: function() {
				if (!this.oTitleHierarchyCache) {
					this.oTitleHierarchyCache = {};
				}
				return this.oTitleHierarchyCache;
			},

			/**
			 * This function returns a titleInfo object.
			 *
			 * @memberof sap.fe.templates.RootContainer.controller.BaseController
			 * @param {*} title
			 * @param {*} subtitle
			 * @param {*} sIntent intent path to be redirected to
			 * @returns {object}  oTitleinformation
			 */
			_computeTitleInfo: function(title, subtitle, sIntent) {
				var aParts = sIntent.split("/");
				if (aParts[aParts.length - 1].indexOf("?") === -1) {
					sIntent += "?restoreHistory=true";
				} else {
					sIntent += "&restoreHistory=true";
				}
				return {
					title: title,
					subtitle: subtitle,
					intent: sIntent,
					icon: ""
				};
			},

			/**
			 * This function is updating the cache to store Title Information
			 *
			 * @name sap.fe.templates.RootContainer.controller.BaseController#addNewEntryINCacheTitle
			 * @memberof sap.fe.templates.RootContainer.controller.BaseController
			 * @param {*} sPath path of the context to retrieve title information from MetaModel
			 * @param {*} oAppComponent reference to the oAppComponent
			 *
			 * @returns {promise}  oTitleinformation returned as promise
			 */

			addNewEntryInCacheTitle: function(sPath, oAppComponent) {
				var oTitleModel = this.getView().getModel();
				var that = this;
				var sEntityPath = sPath.replace(/ *\([^)]*\) */g, "");
				var sTitleExpression = AnnotationHelper.format(
					oAppComponent.getMetaModel().getProperty(sEntityPath + "/@com.sap.vocabularies.UI.v1.HeaderInfo/Title/Value"),
					{ context: oAppComponent.getMetaModel().createBindingContext("/") }
				);
				var oTitleExpression = BindingParser.complexParser(sTitleExpression);
				var sTypeName = oAppComponent.getMetaModel().getProperty(sEntityPath + "/@com.sap.vocabularies.UI.v1.HeaderInfo/TypeName");
				var oBindingViewContext = oTitleModel.createBindingContext(sPath);
				if (oTitleExpression) {
					var sTitlePath = oTitleExpression.parts ? oTitleExpression.parts[0].path : oTitleExpression.path;
					var fnTitleFormatter = oTitleExpression.formatter;
					var oPropertyBinding = oTitleModel.bindProperty(sTitlePath, oBindingViewContext);
					oPropertyBinding.initialize();
				}
				return new Promise(function(resolve, reject) {
					var sAppSpecificHash = HashChanger.getInstance().hrefForAppSpecificHash("");
					var sIntent = sAppSpecificHash + sPath.slice(1);
					var oTitleHierarchyCache = that.getTitleHierarchyCache();
					var fnChange = function(oEvent) {
						var sTargetValue = fnTitleFormatter
							? fnTitleFormatter(oEvent.getSource().getValue())
							: oEvent.getSource().getValue();
						oTitleHierarchyCache[sPath] = that._computeTitleInfo(sTypeName, sTargetValue, sIntent);
						resolve(oTitleHierarchyCache[sPath]);
						oPropertyBinding.detachChange(fnChange);
					};
					if (oPropertyBinding) {
						oPropertyBinding.attachChange(fnChange);
					} else {
						oTitleHierarchyCache[sPath] = that._computeTitleInfo(sTypeName, "", sIntent);
						resolve(oTitleHierarchyCache[sPath]);
					}
				});
			},
			/**
			 * Ensure that the ushell service receives all elements
			 * (title, subtitle, intent, icon) as strings.
			 *
			 * Annotation HeaderInfo allows for binding of title and description
			 * (which are used here as title and subtitle) to any element in the entity
			 * (being possibly types like boolean, timestamp, double, etc.)
			 *
			 * Creates a new hierarchy and converts non-string types to string.
			 *
			 * @param {*} aHierarchy Shell title hierarchy
			 * @returns {*} Copy of shell title hierarchy containing all elements as strings
			 */
			ensureHierarchyElementsAreStrings: function(aHierarchy) {
				var aHierarchyShell = [];
				for (var level in aHierarchy) {
					var oHierarchy = aHierarchy[level];
					var oShellHierarchy = {};
					for (var key in oHierarchy) {
						oShellHierarchy[key] = typeof oHierarchy[key] !== "string" ? String(oHierarchy[key]) : oHierarchy[key];
					}
					aHierarchyShell.push(oShellHierarchy);
				}
				return aHierarchyShell;
			},

			/**
			 * This function is updating the shell title after each navigation.
			 *
			 * @memberof sap.fe.templates.RootContainer.controller.BaseController
			 * @param {*} oData object containing reference to view and to oAppComponent
			 */
			computeTitleHierarchy: function(oData) {
				var that = this,
					oView = oData.oView,
					oAppComponent = oData.oAppComponent,
					oContext = oView.getBindingContext(),
					oCurrentPage = oView.getParent(),
					aTitleInformationPromises = [],
					sAppSpecificHash = HashChanger.getInstance().hrefForAppSpecificHash(""),
					sAppTitle = oAppComponent.getMetadata().getManifestEntry("sap.app").title || "",
					sAppSubTitle = oAppComponent.getMetadata().getManifestEntry("sap.app").appSubTitle || "",
					sAppRootPath = sAppSpecificHash,
					oPageTitleInformationPromise,
					sNewPath;

				if (this.bIsComputingTitleHierachy === true) {
					Log.warning("computeTitleHierarchy already running ... this call is canceled");
					return;
				}
				this.bIsComputingTitleHierachy = true;

				if (oCurrentPage && oCurrentPage._getPageTitleInformation) {
					if (oContext) {
						sNewPath = oContext.getPath();
						var aPathParts = sNewPath.split("/"),
							sTargetType,
							sPath = "",
							iNbPathParts = aPathParts.length;
						aPathParts.splice(-1, 1);

						aPathParts.forEach(function(sPathPart, i) {
							if (i === 0) {
								var aRoutes = oAppComponent.getManifestEntry("/sap.ui5/routing/routes"),
									aTargets = oAppComponent.getManifestEntry("/sap.ui5/routing/targets");
								var fnTargetTypeEval = function(sTarget) {
									if (typeof aRoutes[this.index].target === "string") {
										return sTarget === aRoutes[this.index].target;
									} else if (typeof aRoutes[this.index].target === "object") {
										for (var k = 0; k < aRoutes[this.index].target.length; k++) {
											return sTarget === aRoutes[this.index].target[k];
										}
									}
								};
								for (var j = 0; j < aRoutes.length; j++) {
									var oRoute = oAppComponent.getRouter().getRoute(aRoutes[j].name);
									if (oRoute.match(aPathParts[i])) {
										var sTarget = Object.keys(aTargets).find(fnTargetTypeEval, { index: j });
										sTargetType = oAppComponent.getRouter().getTarget(sTarget)._oOptions.name;
										break;
									}
								}
								if (sTargetType === "sap.fe.templates.ListReport") {
									aTitleInformationPromises.push(
										Promise.resolve(that._computeTitleInfo(sAppTitle, sAppSubTitle, sAppRootPath))
									);
								}
							} else if (i < iNbPathParts) {
								sPath += "/" + sPathPart;
								if (!that.getTitleHierarchyCache()[sPath]) {
									aTitleInformationPromises.push(that.addNewEntryInCacheTitle(sPath, oAppComponent));
								} else {
									aTitleInformationPromises.push(Promise.resolve(that.getTitleHierarchyCache()[sPath]));
								}
							}
						});
					}
					oPageTitleInformationPromise = oCurrentPage._getPageTitleInformation().then(function(oPageTitleInformation) {
						var sPageHash = HashChanger.getInstance().getHash();
						var aParts = sPageHash.split("/");
						if (aParts[aParts.length - 1].indexOf("?") === -1) {
							sPageHash += "?restoreHistory=true";
						} else {
							sPageHash += "&restoreHistory=true";
						}

						oPageTitleInformation.intent = sAppSpecificHash + sPageHash;
						if (oContext) {
							that.getTitleHierarchyCache()[sNewPath] = oPageTitleInformation;
						} else {
							that.getTitleHierarchyCache()[sAppRootPath] = oPageTitleInformation;
						}
						return oPageTitleInformation;
					});
					aTitleInformationPromises.push(oPageTitleInformationPromise);
				} else {
					aTitleInformationPromises.push(Promise.reject("Title information missing in HeaderInfo"));
				}
				Promise.all(aTitleInformationPromises)
					.then(function(aTitleInfoHierarchy) {
						// workaround for shell which is expecting all elements being of type string
						var aTitleInfoHierarchyShell = that.ensureHierarchyElementsAreStrings(aTitleInfoHierarchy);
						var sTitle = aTitleInfoHierarchyShell[aTitleInfoHierarchy.length - 1].title;
						oAppComponent.getShellServices().setHierarchy(aTitleInfoHierarchyShell.reverse());
						oAppComponent.getShellServices().setTitle(sTitle);
					})
					.catch(function(sErrorMessage) {
						Log.error(sErrorMessage);
					})
					.finally(function() {
						that.bIsComputingTitleHierachy = false;
					})
					.catch(function(sErrorMessage) {
						Log.error(sErrorMessage);
					});
			},

			calculateLayout: function(iNextFCLLevel, sPath, sProposedLayout) {
				return null;
			},

			/**
			 * Callback after a view has been bound to a context.
			 *
			 * @param {sap.ui.model.odata.v4.Context} oContext the context that has been bound to a view
			 */
			onContextBoundToView: function(oContext) {
				if (oContext) {
					var sDeepestPath = this.getView()
							.getModel("internal")
							.getProperty("/deepestPath"),
						sViewContextPath = oContext.getPath();

					if (!sDeepestPath || sDeepestPath.indexOf(sViewContextPath) !== 0) {
						// There was no previous value for the deepest reached path, or the path
						// for the view isn't a subpath of the previous deepest path --> update
						this.getView()
							.getModel("internal")
							.setProperty("/deepestPath", sViewContextPath, undefined, true);
					}
				}
			},

			displayMessagePage: function(sErrorMessage, mParameters) {
				// To be overridden
			},

			updateUIStateForView: function(oView, FCLLevel) {}
		});
	}
);
