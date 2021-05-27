/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

/**
 * Initialization Code and shared classes of library sap.ui.mdc.
 */
sap.ui.define(
	[
		"sap/ui/model/json/JSONModel",
		"sap/base/Log",
		"sap/ui/base/ManagedObject",
		"sap/fe/macros/ResourceModel",
		"sap/ui/core/util/XMLPreprocessor",
		"sap/ui/base/SyncPromise",
		"./TraceInfo",
		"sap/base/util/ObjectPath"
	],
	function(JSONModel, Log, ManagedObject, ResourceModel, XMLPreprocessor, SyncPromise, TraceInfo, ObjectPath) {
		"use strict";

		var sPhantomUtil = "sap.fe.macros.PhantomUtil",
			oI18nModel = ResourceModel.getModel();
		//Pretend to be able to do object binding
		oI18nModel.bindContext =
			oI18nModel.bindContext ||
			function() {
				return {
					initialize: function() {},
					attachChange: function() {},
					detachChange: function() {},
					attachEvents: function() {},
					detachEvents: function() {},
					updateRequired: function() {},
					destroy: function() {},
					getContext: function() {}
				};
			};

		function validateMacroMetadataContext(sName, mContexts, oContextSettings, sKey) {
			var oContext, oContextObject;

			if (!mContexts[sKey]) {
				if (oContextSettings.required) {
					throw new Error(sName + ": " + "Required metadataContext '" + sKey + "' is missing");
				}
			} else {
				// Check if properties of metadataContext are of expected kind, e.g. $kind or $Type. Expected kind can be specified as an array or a string
				oContext = mContexts[sKey];
				oContextObject = oContext.getObject();
				// not null or undefined or ...
				if (oContextObject) {
					// clone the context settings
					var oContextSettingsToCheck = Object.assign({}, oContextSettings);
					// no need to loop over properties 'type' and 'required'
					delete oContextSettingsToCheck.required;
					delete oContextSettingsToCheck.computed;
					delete oContextSettingsToCheck.isPublic;
					delete oContextSettingsToCheck.type;

					// If context object has $kind property, $Type should not be checked
					// Therefore remove from context settings
					if (oContextObject.hasOwnProperty("$kind")) {
						delete oContextSettingsToCheck.$Type;
					} else {
						delete oContextSettingsToCheck.$kind;
					}

					Object.keys(oContextSettingsToCheck).forEach(function(sProp) {
						var aContextSettingsProp = Array.isArray(oContextSettingsToCheck[sProp])
								? oContextSettingsToCheck[sProp]
								: [oContextSettingsToCheck[sProp]],
							sValue;

						if (typeof oContextObject === "object") {
							sValue = oContextObject[sProp];
							if (!sValue) {
								if (oContextObject.hasOwnProperty("$Path")) {
									sValue = oContext.getObject("$Path/" + sProp);
								}
							}
						} else if (typeof oContextObject === "string") {
							sValue = oContext.getObject(sProp);
							if (!sValue) {
								sValue = aContextSettingsProp[0]; // take expected value to suppress error
							}
						} else {
							sValue = null;
						}

						if (aContextSettingsProp.indexOf(sValue) === -1) {
							throw new Error(
								sName +
									": '" +
									sKey +
									"' must be '" +
									sProp +
									"' '" +
									aContextSettingsProp +
									"' but is '" +
									sValue +
									"': " +
									oContext.getPath()
							);
						}
					});
				}
			}
		}

		function validateMacroSignature(sName, oMetadata, mContexts, oNode) {
			var aMetadataContextKeys = (oMetadata.metadataContexts && Object.keys(oMetadata.metadataContexts)) || [],
				aProperties = (oMetadata.properties && Object.keys(oMetadata.properties)) || [],
				oAttributeNames = {};

			// collect all attributes to find unchecked properties
			Object.keys(oNode.attributes).forEach(function(iKey) {
				var sKey = oNode.attributes[iKey].name;
				if (sKey !== "metadataContexts") {
					oAttributeNames[sKey] = true;
				}
			});
			// special handling for old metadataContext call syntax
			Object.keys(mContexts).forEach(function(sKey) {
				if (sKey !== "this" && sKey !== "this.i18n") {
					oAttributeNames[sKey] = true;
				}
			});

			//Check metadataContexts
			aMetadataContextKeys.forEach(function(sKey) {
				var oContextSettings = oMetadata.metadataContexts[sKey];

				validateMacroMetadataContext(sName, mContexts, oContextSettings, sKey);
				delete oAttributeNames[sKey];
			});
			//Check properties
			aProperties.forEach(function(sKey) {
				var oPropertySettings = oMetadata.properties[sKey];
				// TODO validate property type if possible
				if (!oNode.hasAttribute(sKey)) {
					if (oPropertySettings.required && !oPropertySettings.hasOwnProperty("defaultValue")) {
						throw new Error(sName + ": " + "Required property '" + sKey + "' is missing");
					}
				} else {
					delete oAttributeNames[sKey];
				}
			});

			// Unchecked properties
			Object.keys(oAttributeNames).forEach(function(sKey) {
				// no check for properties which start with underscore "_" or contain a colon ":" (different namespace), e.g. xmlns:trace, trace:macroID, unittest:id
				if (sKey.charAt(0) !== "_" && sKey.indexOf(":") < 0) {
					Log.warning("Unchecked parameter: " + sName + ": " + sKey, null, sPhantomUtil);
				}
			});
		}

		function prepareMetadata(oMacroDefinition, isPublic) {
			if (oMacroDefinition) {
				var oProperties = {};
				var oAggregations = {
					"dependents": {
						type: "sap.ui.core.Element"
					},
					"customData": {
						type: "sap.ui.core.Element"
					}
				};
				var oMetadataContexts = oMacroDefinition.metadataContexts || {};

				Object.keys(oMacroDefinition.properties).forEach(function(sPropertyName) {
					if (oMacroDefinition.properties[sPropertyName].type !== "sap.ui.model.Context") {
						oProperties[sPropertyName] = oMacroDefinition.properties[sPropertyName];
					} else {
						oMetadataContexts[sPropertyName] = oMacroDefinition.properties[sPropertyName];
					}
				});
				// Merge events into properties as they are handled indentically
				if (oMacroDefinition.events) {
					Object.keys(oMacroDefinition.events).forEach(function(sEventName) {
						oProperties[sEventName] = oMacroDefinition.events[sEventName];
					});
				}
				if (oMacroDefinition.aggregations) {
					Object.keys(oMacroDefinition.aggregations).forEach(function(sPropertyName) {
						oAggregations[sPropertyName] = oMacroDefinition.aggregations[sPropertyName];
					});
				}
				return {
					properties: oProperties,
					aggregations: oAggregations,
					metadataContexts: oMetadataContexts
				};
			} else {
				return {
					metadataContexts: {},
					aggregations: {
						"dependents": {
							type: "sap.ui.core.Element"
						},
						"customData": {
							type: "sap.ui.core.Element"
						}
					},
					properties: {},
					events: {}
				};
			}
		}

		function wrapOutput(sKey) {
			return function(oValue) {
				var oObj = {};
				oObj[sKey] = oValue;
				return oObj;
			};
		}

		function getAttributeValue(oNode, sKeyValue, oDefinitionProperties) {
			return function() {
				var vValue = oNode.getAttribute(sKeyValue);
				if (!vValue && oDefinitionProperties.defaultValue) {
					vValue = oDefinitionProperties.defaultValue;
				}
				return wrapOutput(sKeyValue)(vValue);
			};
		}

		/**
		 * Retrieves the metadata context for the current node attribute.
		 *
		 * @param {object} oSettings the templating settings
		 * @param {Element} oNode the dom node to conside
		 * @param {string} sAttributeName the name of the current
		 * @param {object} oVisitor the templating visitor
		 * @param {boolean} bDoNotResolve force to ignore the value set in the attribute
		 * @returns {{path, model: string}} the metadata context
		 * @private
		 */
		function _getMetadataContext(oSettings, oNode, sAttributeName, oVisitor, bDoNotResolve) {
			var oMetadataContext;
			if (!bDoNotResolve && oNode.hasAttribute(sAttributeName)) {
				var sAttributeValue = oNode.getAttribute(sAttributeName),
					sMetaPath;
				oVisitor.getResult(sAttributeValue, oNode);
				oMetadataContext = ManagedObject.bindingParser(sAttributeValue);
				if (!oMetadataContext) {
					if (sAttributeName === "metaPath" && oSettings.bindingContexts.contextPath) {
						if (sAttributeValue.startsWith("/")) {
							// absolute path - we just use this one
							sMetaPath = sAttributeValue;
						} else {
							var sContextPath = oSettings.bindingContexts.contextPath.getPath();
							if (!sContextPath.endsWith("/")) {
								sContextPath += "/";
							}
							sMetaPath = sContextPath + sAttributeValue;
						}
						oMetadataContext = {
							model: "contextPath",
							path: sMetaPath
						};
					} else {
						oMetadataContext = {
							model: "metaModel",
							path: oSettings.bindingContexts.entitySet
								? oSettings.bindingContexts.entitySet.getPath(sAttributeValue)
								: sAttributeValue
						};
					}
				}
			} else if (oSettings.bindingContexts.hasOwnProperty(sAttributeName)) {
				oMetadataContext = {
					model: sAttributeName,
					path: ""
				};
			}
			return oMetadataContext;
		}
		function publicResolve(oMacroDefinition, oNode, oVisitor) {
			return resolve(oMacroDefinition, oNode, oVisitor, true);
		}

		function resolve(oMacroDefinition, oNode, oVisitor, isPublic) {
			var sFragmentName = oMacroDefinition.fragment || oMacroDefinition.namespace + "." + oMacroDefinition.name,
				sName = "this",
				sI18nName = sName + ".i18n",
				mContexts = {},
				oAttributesModel = new JSONModel(oNode),
				sMetadataContexts = oNode.getAttribute("metadataContexts"),
				oMetadataContexts = {},
				oSettings = oVisitor.getSettings(),
				j;

			var oMetadata = prepareMetadata(oMacroDefinition.metadata, isPublic);

			oAttributesModel._getObject = function(sPath, oContext) {
				if ((sPath === undefined || sPath === "") && this.oProps) {
					return this.oProps;
				}
				// just return the attribute - we can't validate them and we don't support aggregations for now
				var oValue = ObjectPath.get(sPath.replace(/\//g, "."), this.oProps);
				if (oValue !== undefined) {
					return oValue;
				}
				if (this.oProps && this.oProps.hasOwnProperty(sPath)) {
					return this.oProps[sPath];
				}
				if (sPath.indexOf(":") === -1 && sPath.indexOf("/") === -1) {
					Log.error("Missing property " + sPath + " on macro metadata " + oMacroDefinition.name);
				}
				return oNode.getAttribute(sPath);
			};

			oAttributesModel.getContextName = function() {
				return sName;
			};

			oAttributesModel.$$valueAsPromise = true; //for asynchronuous preprocessing

			//make sure all texts can be accessed at templating time
			mContexts[sI18nName] = oI18nModel.getContext("/");

			//Inject storage for macros
			if (!oSettings[sFragmentName]) {
				oSettings[sFragmentName] = {};
			}

			// First of all we need to visit the attributes
			var oTargetPromise = null;
			var bMetadataContextLegacy = true;
			var mMissingContext = {};
			if (oMacroDefinition.hasValidation) {
				var oDefinitionProperties = oMetadata.properties;
				var oDefinitionContexts = oMetadata.metadataContexts;
				var aDefinitionPropertiesKeys = Object.keys(oDefinitionProperties);
				var aDefinitionContextsKeys = Object.keys(oDefinitionContexts);
				var aAttributeVisitorPromises = [];
				for (j = 0; j < aDefinitionPropertiesKeys.length; j++) {
					var sKeyValue = aDefinitionPropertiesKeys[j];
					if (isPublic && !oDefinitionProperties[sKeyValue].isPublic && oNode.hasAttribute(sKeyValue)) {
						Log.error("Property " + sKeyValue + " was ignored as it is not intended for public usage");
						var oObj = {};
						oObj[sKeyValue] = oDefinitionProperties[sKeyValue].defaultValue;
						aAttributeVisitorPromises.push(Promise.resolve(oObj));
					} else if (oNode.hasAttribute(sKeyValue)) {
						aAttributeVisitorPromises.push(
							oVisitor
								.visitAttribute(oNode, oNode.attributes[sKeyValue])
								.then(getAttributeValue(oNode, sKeyValue, oDefinitionProperties[sKeyValue]))
						);
					} else {
						var oObj = {};
						oObj[sKeyValue] = oDefinitionProperties[sKeyValue].defaultValue;
						aAttributeVisitorPromises.push(Promise.resolve(oObj));
					}
				}
				// First check if the contexts are defined directly
				bMetadataContextLegacy = false;
				// Sort keys to be sure contextPath is before metaPath ( yes I'm desperate )
				aDefinitionContextsKeys = aDefinitionContextsKeys.sort(function(a, b) {
					return a > b ? 1 : -1;
				});
				for (j = 0; j < aDefinitionContextsKeys.length; j++) {
					var sAttributeName = aDefinitionContextsKeys[j];
					var bDoNotResolve = isPublic && !oDefinitionContexts[sAttributeName].isPublic && oNode.hasAttribute(sAttributeName);
					var oMetadataContext = _getMetadataContext(oSettings, oNode, sAttributeName, oVisitor, bDoNotResolve);
					if (oMetadataContext) {
						oMetadataContext.name = sAttributeName;
						addSingleContext(mContexts, oVisitor, oMetadataContext, oMetadataContexts);
						if (
							(sAttributeName === "entitySet" && !oSettings.bindingContexts.hasOwnProperty(sAttributeName)) ||
							sAttributeName === "contextPath"
						) {
							oSettings.bindingContexts[sAttributeName] = mContexts[sAttributeName];
						}
						aAttributeVisitorPromises.push(Promise.resolve(wrapOutput(sAttributeName)(mContexts[sAttributeName])));
					} else {
						mMissingContext[sAttributeName] = true;
						bMetadataContextLegacy = true;
					}
				}

				// Aggregation Support
				if (oNode.firstElementChild !== null) {
					// If there are aggregation we need to visit the childNodes first and foremost
					aAttributeVisitorPromises.push(oVisitor.visitChildNodes(oNode));
				}

				oTargetPromise = SyncPromise.all(aAttributeVisitorPromises);
			} else {
				oTargetPromise = oVisitor.visitAttributes(oNode);
			}
			var oAggregations = {};
			return oTargetPromise
				.then(function(aProps) {
					if (aProps != null) {
						var oProps = aProps.reduce(function(oReducer, oProp) {
							return Object.assign(oReducer, oProp);
						}, {});

						Object.keys(oMetadata.properties).forEach(function(sChildName) {
							if (
								oMetadata.properties[sChildName].type === "object" &&
								(!oProps.hasOwnProperty(sChildName) || oProps[sChildName] === undefined)
							) {
								// Object Type properties need to be initialized
								oProps[sChildName] = {};
							}
						});
						var oFirstElementChild = oNode.firstElementChild;
						while (oFirstElementChild !== null) {
							var sChildName = oFirstElementChild.localName;
							if (Object.keys(oMetadata.aggregations).indexOf(sChildName) !== -1) {
								oAggregations[oFirstElementChild.localName] = oFirstElementChild;
							} else if (Object.keys(oMetadata.properties).indexOf(sChildName) !== -1) {
								// Object Type properties
								oProps[sChildName] = {};
								for (var i = 0; i < Object.keys(oFirstElementChild.attributes).length; i++) {
									var attributeIndex = Object.keys(oFirstElementChild.attributes)[i];
									oProps[sChildName][oFirstElementChild.attributes[attributeIndex].localName] =
										oFirstElementChild.attributes[attributeIndex].value;
								}
							}

							oFirstElementChild = oFirstElementChild.nextElementSibling;
						}

						var oCreateFn = oMacroDefinition.prepareMacroParameters || oMacroDefinition.create;
						if (oCreateFn) {
							var oControlConfig = {};
							if (oSettings.models.viewData) {
								oControlConfig = oSettings.models.viewData.getProperty("/controlConfiguration");
							}
							oProps = oCreateFn.call(oMacroDefinition, oProps, oControlConfig, oSettings);
							Object.keys(oMetadata.metadataContexts).forEach(function(sMetadataName) {
								if (oMetadata.metadataContexts[sMetadataName].computed) {
									mContexts[sMetadataName] = oProps[sMetadataName];
								}
							});
							Object.keys(mMissingContext).forEach(function(sContextName) {
								if (oProps.hasOwnProperty(sContextName)) {
									mContexts[sContextName] = oProps[sContextName];
								}
							});
						}
						oAttributesModel.oProps = oProps;
					}
					if (bMetadataContextLegacy && sMetadataContexts) {
						oMetadataContexts = sMetadataContexts ? ManagedObject.bindingParser(sMetadataContexts) : { parts: [] };
						if (!oMetadataContexts.parts) {
							oMetadataContexts = { parts: [oMetadataContexts] };
						}

						for (j = 0; j < oMetadataContexts.parts.length; j++) {
							addSingleContext(mContexts, oVisitor, oMetadataContexts.parts[j], oMetadataContexts);
							// Make sure every previously defined context can be used in the next binding
							oVisitor = oVisitor["with"](mContexts, false);
						}
					}
				})
				.then(function() {
					var oPreviousMacroInfo;
					mContexts[sName] = oAttributesModel.getContext("/");

					//Keep track
					if (TraceInfo.isTraceInfoActive()) {
						var oTraceInfo = TraceInfo.traceMacroCalls(sFragmentName, oMetadata, mContexts, oNode, oVisitor);
						if (oTraceInfo) {
							oPreviousMacroInfo = oSettings["_macroInfo"];
							oSettings["_macroInfo"] = oTraceInfo.macroInfo;
						}
					}
					validateMacroSignature(sFragmentName, oMetadata, mContexts, oNode);

					var oContextVisitor = oVisitor["with"](mContexts, true);
					var oParent = oNode.parentNode;
					return oContextVisitor.insertFragment(sFragmentName, oNode).then(function() {
						if (Object.keys(oAggregations).length > 0) {
							var oMacroElement = oParent.firstElementChild;
							Object.keys(oAggregations).forEach(function(sAggregationName) {
								var oAggregationElement = oAggregations[sAggregationName];
								if (oMacroElement !== null) {
									var oNewChild = document.createElementNS(oMacroElement.namespaceURI, sAggregationName);
									var oElementChild = oAggregationElement.firstElementChild;
									while (oElementChild) {
										var oNextChild = oElementChild.nextElementSibling;
										oNewChild.appendChild(oElementChild);
										oElementChild = oNextChild;
									}
									oMacroElement.appendChild(oNewChild);
								}
							});
						}
						if (oPreviousMacroInfo) {
							//restore macro info if available
							oSettings["_macroInfo"] = oPreviousMacroInfo;
						} else {
							delete oSettings["_macroInfo"];
						}
					});
				});
		}

		function addSingleContext(mContexts, oVisitor, oCtx, oMetadataContexts) {
			var sKey = oCtx.name || oCtx.model || undefined;

			if (oMetadataContexts[sKey]) {
				return; // do not add twice
			}
			try {
				var sContextPath = oCtx.path;
				if (oCtx.model != null) {
					sContextPath = oCtx.model + ">" + sContextPath;
				}
				mContexts[sKey] = oVisitor.getContext(sContextPath); // add the context to the visitor
				var mSetting = oVisitor.getSettings();
				if (mSetting && mSetting.bindingContexts && mSetting.bindingContexts.entitySet) {
					mContexts[sKey].$$configModelContext = oVisitor.getSettings().bindingContexts.entitySet.$$configModelContext;
				}
				oMetadataContexts[sKey] = mContexts[sKey]; // make it available inside metadataContexts JSON object
			} catch (ex) {
				// ignore the context as this can only be the case if the model is not ready, i.e. not a preprocessing model but maybe a model for
				// providing afterwards
				// TODO not yet implemented
				//mContexts["_$error"].oModel.setProperty("/" + sKey, ex);
			}
		}

		function register(oMacroDefinition) {
			XMLPreprocessor.plugIn(resolve.bind(this, oMacroDefinition), oMacroDefinition.namespace, oMacroDefinition.name);
			if (oMacroDefinition.publicName) {
				XMLPreprocessor.plugIn(
					publicResolve.bind(this, oMacroDefinition),
					oMacroDefinition.publicNamespace,
					oMacroDefinition.publicName
				);
			}
		}

		// add private methods for QUnit test to register function
		register._validateMacroSignature = validateMacroSignature;

		return {
			register: register
		};
	}
);
