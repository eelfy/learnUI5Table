sap.ui.define(
	[
		"sap/ui/core/service/Service",
		"sap/ui/core/service/ServiceFactory",
		"sap/ui/core/service/ServiceFactoryRegistry",
		"sap/ui/model/base/ManagedObjectModel",
		"sap/ui/model/resource/ResourceModel",
		"sap/ui/core/mvc/View",
		"sap/ui/core/Component",
		"sap/ui/model/json/JSONModel",
		"sap/base/Log",
		"sap/fe/core/TemplateModel",
		"sap/fe/core/helpers/DynamicAnnotationPathHelper",
		"sap/ui/core/cache/CacheManager",
		"sap/base/strings/hash",
		"sap/ui/VersionInfo",
		"sap/ui/Device"
	],
	function(
		Service,
		ServiceFactory,
		ServiceFactoryRegistry,
		ManagedObjectModel,
		ResourceModel,
		View,
		Component,
		JSONModel,
		Log,
		TemplateModel,
		DynamicAnnotationPathHelper,
		CacheManager,
		hash,
		VersionInfo,
		Device
	) {
		"use strict";

		var TemplatedViewService = Service.extend("sap.fe.core.services.TemplatedViewService", {
			initPromise: null,
			init: function() {
				var that = this;
				var aServiceDependencies = [];
				var oContext = this.getContext();
				var oComponent = oContext.scopeObject;
				var oAppComponent = Component.getOwnerComponentFor(oComponent);
				var oMetaModel = oAppComponent.getMetaModel();
				var sStableId = oAppComponent.getMetadata().getComponentName() + "::" + oAppComponent.getLocalId(oComponent.getId());
				var aEnhanceI18n = oComponent.getEnhanceI18n() || [];
				var sAppNamespace;

				if (aEnhanceI18n) {
					sAppNamespace = oAppComponent.getMetadata().getComponentName();
					for (var i = 0; i < aEnhanceI18n.length; i++) {
						// In order to support text-verticalization applications can also passs a resource model defined in the manifest
						// UI5 takes care of text-verticalization for resource models defined in the manifest
						// Hence check if the given key is a resource model defined in the manifest
						// if so this model should be used to enhance the sap.fe resource model so pass it as it is
						var oResourceModel = oAppComponent.getModel(aEnhanceI18n[i]);
						if (oResourceModel && oResourceModel.isA("sap.ui.model.resource.ResourceModel")) {
							aEnhanceI18n[i] = oResourceModel;
						} else {
							aEnhanceI18n[i] = sAppNamespace + "." + aEnhanceI18n[i].replace(".properties", "");
						}
					}
				}

				var sCacheIdentifier =
					oAppComponent.getMetadata().getName() +
					"_" +
					sStableId +
					"_" +
					sap.ui
						.getCore()
						.getConfiguration()
						.getLanguageTag();
				aServiceDependencies.push(
					ServiceFactoryRegistry.get("sap.fe.core.services.ResourceModelService")
						.createInstance({
							scopeType: "component",
							scopeObject: oComponent,
							settings: {
								bundles: ["sap.fe.core.messagebundle", "sap.fe.templates.messagebundle"],
								enhanceI18n: aEnhanceI18n,
								modelName: "sap.fe.i18n"
							}
						})
						.then(function(oResourceModelService) {
							that.oResourceModelService = oResourceModelService;
							return oResourceModelService.getResourceModel();
						})
				);

				aServiceDependencies.push(
					ServiceFactoryRegistry.get("sap.fe.core.services.CacheHandlerService")
						.createInstance({
							settings: {
								metaModel: oMetaModel
							}
						})
						.then(function(oCacheHandlerService) {
							that.oCacheHandlerService = oCacheHandlerService;
							return oCacheHandlerService.validateCacheKey(sCacheIdentifier);
						})
				);
				aServiceDependencies.push(
					VersionInfo.load()
						.then(function(oInfo) {
							var sTimestamp = "";
							if (!oInfo.libraries) {
								sTimestamp = sap.ui.buildinfo.buildtime;
							} else {
								oInfo.libraries.forEach(function(oLibrary) {
									sTimestamp += oLibrary.buildTimestamp;
								});
							}
							return sTimestamp;
						})
						.catch(function() {
							return "<NOVALUE>";
						})
				);

				var sPageModelCacheKey = "";
				this.initPromise = Promise.all(aServiceDependencies)
					.then(function(aDependenciesResult) {
						var sCacheKey = aDependenciesResult[1];
						var sVersionInfo = aDependenciesResult[2];
						var oManifestContent = oAppComponent.getManifest();
						var oShellServices = oAppComponent.getShellServices();
						var sManifestHash = hash(
							JSON.stringify({
								sapApp: oManifestContent["sap.app"],
								viewData: oComponent.getViewData()
							})
						);
						sPageModelCacheKey =
							sCacheKey +
							"-" +
							sManifestHash +
							"-" +
							sVersionInfo +
							"-" +
							sStableId +
							"-" +
							oShellServices.instanceType +
							"-pageModel";
						return Promise.all(aDependenciesResult.concat([that._getCachedModel(sPageModelCacheKey)]));
					})
					.then(function(aDependenciesResult) {
						var oResourceModel = aDependenciesResult[0];
						var sCacheKey = aDependenciesResult[1];
						var oPageModelCache = aDependenciesResult[3];
						return new Promise(function(resolve) {
							sap.ui.require(["sap/fe/core/converters/TemplateConverter"], function(TemplateConverter) {
								resolve(
									that.createView(
										oResourceModel,
										sStableId,
										sCacheKey,
										sPageModelCacheKey,
										oPageModelCache,
										TemplateConverter
									)
								);
							});
						});
					})
					.then(function(sCacheKey) {
						var oCacheHandlerService = ServiceFactoryRegistry.get("sap.fe.core.services.CacheHandlerService").getInstance(
							oMetaModel
						);
						oCacheHandlerService.invalidateIfNeeded(sCacheKey, sCacheIdentifier);
					});
			},
			_getCachedModel: function(sCacheKey) {
				if (
					sap.ui
						.getCore()
						.getConfiguration()
						.getViewCache()
				) {
					return CacheManager.get(sCacheKey);
				}
				return undefined;
			},
			_setCachedModel: function(sCacheKey, oCacheModel) {
				if (
					sap.ui
						.getCore()
						.getConfiguration()
						.getViewCache()
				) {
					CacheManager.set(sCacheKey, oCacheModel);
				}
				return undefined;
			},
			/**
			 * Refresh the current view using the same configuration as before.
			 * This is useful for our demokit !
			 *
			 * @param oComponent
			 * @returns {Promise<void>}
			 * @private
			 */
			refreshView: function(oComponent) {
				var that = this;
				var oRootView = oComponent.getRootControl();
				if (oRootView) {
					oRootView.destroy();
				} else if (that.oView) {
					that.oView.destroy();
				}
				return that
					.createView(that.resourceModel, that.stableId, "", "", undefined, that.TemplateConverter)
					.then(function() {
						oComponent.oContainer.invalidate();
					})
					.catch(function(oError) {
						oComponent.oContainer.invalidate();
						Log.error(oError);
					});
			},
			createView: function(oResourceModel, sStableId, sCacheKey, sPageModelCacheKey, oPageModelCache, TemplateConverter) {
				var that = this;
				that.resourceModel = oResourceModel;
				that.stableId = sStableId;
				that.TemplateConverter = TemplateConverter;
				var oContext = this.getContext(),
					mServiceSettings = oContext.settings,
					sConverterType = mServiceSettings.converterType,
					oComponent = oContext.scopeObject,
					oAppComponent = Component.getOwnerComponentFor(oComponent),
					sFullContextPath = oAppComponent.getRoutingService().getTargetInformationFor(oComponent).options.settings
						.fullContextPath,
					oMetaModel = oAppComponent.getMetaModel(),
					oManifestContent = oAppComponent.getManifest(),
					oDeviceModel = new JSONModel(sap.ui.Device).setDefaultBindingMode("OneWay"),
					oManifestModel = new JSONModel(oManifestContent),
					bError = false,
					oPageModel,
					oViewDataModel,
					oViewSettings,
					mViewData;

				this.oFactory = oContext.factory;

				function getViewSettings() {
					var aSplitPath = sFullContextPath.split("/");
					var sEntitySetPath = aSplitPath.reduce(function(sPathSoFar, sNextPathPart) {
						if (sNextPathPart === "") {
							return sPathSoFar;
						}
						if (sPathSoFar === "") {
							sPathSoFar = "/" + sNextPathPart;
						} else {
							var oTarget = oMetaModel.getObject(sPathSoFar + "/$NavigationPropertyBinding/" + sNextPathPart);
							if (oTarget && Object.keys(oTarget).length > 0) {
								sPathSoFar += "/$NavigationPropertyBinding";
							}
							sPathSoFar += "/" + sNextPathPart;
						}
						return sPathSoFar;
					}, "");
					var oViewSettings = {
						type: "XML",
						preprocessors: {
							xml: {
								bindingContexts: {
									entitySet: sEntitySetPath ? oMetaModel.createBindingContext(sEntitySetPath) : null,
									fullContextPath: sFullContextPath ? oMetaModel.createBindingContext(sFullContextPath) : null,
									contextPath: sFullContextPath ? oMetaModel.createBindingContext(sFullContextPath) : null,
									converterContext: oPageModel.createBindingContext("/", null, { noResolve: true }),
									viewData: mViewData ? oViewDataModel.createBindingContext("/") : null
								},
								models: {
									entitySet: oMetaModel,
									fullContextPath: oMetaModel,
									contextPath: oMetaModel,
									"sap.fe.i18n": oResourceModel,
									metaModel: oMetaModel,
									"sap.fe.deviceModel": oDeviceModel, // TODO: discuss names here
									manifest: oManifestModel,
									converterContext: oPageModel,
									viewData: oViewDataModel
								},
								appComponent: oAppComponent
							}
						},
						id: sStableId,
						viewName: mServiceSettings.viewName || oComponent.getViewName(),
						viewData: mViewData,
						cache: { keys: [sCacheKey] },
						models: {
							"sap.fe.i18n": oResourceModel
						},
						height: "100%"
					};
					return oViewSettings;
				}
				function createErrorPage(reason) {
					// just replace the view name and add an additional model containing the reason, but
					// keep the other settings
					Log.error(reason.message, reason);
					oViewSettings.viewName = mServiceSettings.errorViewName || "sap.fe.core.services.view.TemplatingErrorPage";
					oViewSettings.preprocessors.xml.models["error"] = new JSONModel(reason);

					return oComponent.runAsOwner(function() {
						return View.create(oViewSettings).then(function(oView) {
							that.oView = oView;
							that.oView.setModel(new ManagedObjectModel(that.oView), "$view");
							oComponent.setAggregation("rootControl", that.oView);
							return sCacheKey;
						});
					});
				}
				return oAppComponent
					.getService("routingService")
					.then(function(oRoutingService) {
						// Retrieve the viewLevel for the component
						var oTargetInfo = oRoutingService.getTargetInformationFor(oComponent);
						var mOutbounds =
							oManifestContent["sap.app"] &&
							oManifestContent["sap.app"].crossNavigation &&
							oManifestContent["sap.app"].crossNavigation.outbounds;
						var mNavigation = oComponent.getNavigation() || {};
						Object.keys(mNavigation).forEach(function(navigationObjectKey) {
							var navigationObject = mNavigation[navigationObjectKey];
							var outboundConfig;
							if (
								navigationObject.detail &&
								navigationObject.detail.outbound &&
								mOutbounds[navigationObject.detail.outbound]
							) {
								outboundConfig = mOutbounds[navigationObject.detail.outbound];
								navigationObject.detail.outboundDetail = {
									semanticObject: outboundConfig.semanticObject,
									action: outboundConfig.action,
									parameters: outboundConfig.parameters
								};
							}
							if (
								navigationObject.create &&
								navigationObject.create.outbound &&
								mOutbounds[navigationObject.create.outbound]
							) {
								outboundConfig = mOutbounds[navigationObject.create.outbound];
								navigationObject.create.outboundDetail = {
									semanticObject: outboundConfig.semanticObject,
									action: outboundConfig.action,
									parameters: outboundConfig.parameters
								};
							}
						});
						mViewData = {
							navigation: mNavigation,
							viewLevel: oTargetInfo.viewLevel,
							stableId: sStableId,
							contentDensities: oManifestContent["sap.ui5"].contentDensities,
							resourceBundle: oResourceModel.__bundle,
							fullContextPath: sFullContextPath,
							isDesktop: Device.system.desktop
						};

						if (oComponent.getViewData) {
							Object.assign(mViewData, oComponent.getViewData());
						}

						mViewData.converterType = sConverterType;

						oViewDataModel = new JSONModel(mViewData);
						if (mViewData && mViewData.controlConfiguration) {
							Object.keys(mViewData.controlConfiguration).forEach(function(sAnnotationPath) {
								if (sAnnotationPath.indexOf("[") !== -1) {
									var sTargetAnnotationPath = DynamicAnnotationPathHelper.resolveDynamicExpression(
										sAnnotationPath,
										oMetaModel
									);
									mViewData.controlConfiguration[sTargetAnnotationPath] = mViewData.controlConfiguration[sAnnotationPath];
								}
							});
						}
						var oShellServices = oAppComponent.getShellServices();
						oPageModel = new TemplateModel(function() {
							try {
								if (!!oPageModelCache) {
									return oPageModelCache;
								} else {
									var oDiagnostics = oAppComponent.getDiagnostics();
									var iIssueCount = oDiagnostics.getIssues().length;
									var oConverterPageModel = TemplateConverter.convertPage(
										sConverterType,
										oMetaModel,
										mViewData,
										oShellServices,
										oDiagnostics,
										sFullContextPath,
										oAppComponent.getEnvironmentCapabilities().getCapabilities()
									);

									var aIssues = oDiagnostics.getIssues();
									var aAddedIssues = aIssues.slice(iIssueCount);
									if (aAddedIssues.length > 0) {
										Log.warning(
											"Some issues have been detected in your project, please check the UI5 support assistant rule for sap.fe.core"
										);
									}
									// Fire and forget in the cache
									that._setCachedModel(sPageModelCacheKey, oConverterPageModel);
									return oConverterPageModel;
								}
							} catch (error) {
								Log.error(error, error);
								return {};
							}
						}, oMetaModel);

						if (!bError) {
							oViewSettings = getViewSettings();
							// Setting the pageModel on the component for potential reuse
							oComponent.setModel(oPageModel, "_pageModel");
							return oComponent.runAsOwner(function() {
								return View.create(oViewSettings)
									.catch(createErrorPage)
									.then(function(oView) {
										that.oView = oView;
										that.oView.setModel(new ManagedObjectModel(that.oView), "$view");
										that.oView.setModel(oViewDataModel, "viewData");
										oComponent.setAggregation("rootControl", that.oView);
										return sCacheKey;
									})
									.catch(Log.error);
							});
						}
					})
					.catch(function(error) {
						Log.error(error.message, error);
						throw new Error("Error while creating view : " + error);
					});
			},
			getView: function() {
				return this.oView;
			},
			exit: function() {
				// Deregister global instance
				this.oResourceModelService && this.oResourceModelService.destroy();
				this.oCacheHandlerService && this.oCacheHandlerService.destroy();
				this.oFactory.removeGlobalInstance();
			}
		});

		return ServiceFactory.extend("sap.fe.core.services.TemplatedViewServiceFactory", {
			_oInstanceRegistry: {},
			createInstance: function(oServiceContext) {
				var oTemplatedViewService = new TemplatedViewService(Object.assign({ factory: this }, oServiceContext));
				return oTemplatedViewService.initPromise.then(function() {
					return oTemplatedViewService;
				});
			},
			removeGlobalInstance: function() {
				this._oInstanceRegistry = {};
			}
		});
	},
	true
);
