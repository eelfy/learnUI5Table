/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
/* global Promise */
sap.ui.define(
	[
		"sap/ui/thirdparty/jquery",
		"sap/ui/core/XMLTemplateProcessor",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/util/XMLPreprocessor",
		"sap/ui/core/Fragment",
		"sap/fe/core/converters/templates/BaseConverter",
		"sap/ui/mdc/field/InParameter",
		"sap/ui/mdc/field/OutParameter",
		"sap/base/Log",
		"sap/ui/dom/units/Rem",
		"sap/fe/core/BusyLocker",
		"sap/fe/core/actions/messageHandling"
		//Just to be loaded for templating
		//"sap/ui/mdc/field/FieldValueHelp"
	],
	function(
		jQuery,
		XMLTemplateProcessor,
		JSONModel,
		XMLPreprocessor,
		Fragment,
		BaseConverter,
		InParameter,
		OutParameter,
		Log,
		Rem,
		BusyLocker,
		messageHandling
	) {
		"use strict";
		var waitForPromise = {};
		var aCachedValueHelp = [];

		function _hasImportanceHigh(oValueListContext) {
			return oValueListContext.Parameters.some(function(oParameter) {
				return (
					oParameter["@com.sap.vocabularies.UI.v1.Importance"] &&
					oParameter["@com.sap.vocabularies.UI.v1.Importance"].$EnumMember === "com.sap.vocabularies.UI.v1.ImportanceType/High"
				);
			});
		}

		function _entityIsSearchable(oValueListInfo) {
			var oCollectionAnnotations =
					oValueListInfo.valueListInfo.$model.getMetaModel().getObject("/" + oValueListInfo.valueListInfo.CollectionPath + "@") ||
					{},
				bSearchable =
					oCollectionAnnotations["@Org.OData.Capabilities.V1.SearchRestrictions"] &&
					oCollectionAnnotations["@Org.OData.Capabilities.V1.SearchRestrictions"].Searchable;
			return bSearchable === undefined ? true : bSearchable;
		}

		function _getCachedValueHelp(sValueHelpId) {
			return aCachedValueHelp.find(function(oVHElement) {
				return oVHElement.sVHId === sValueHelpId;
			});
		}

		function _redundantDescription(oValueList, oVLParameter, bIsDropDownListe) {
			var oMetaModel = oValueList.$model.getMetaModel(),
				oPropertyAnnotations,
				sDescriptionPath,
				bIsTextOnly,
				aRelevantColumn,
				sRedundantColumn;
			var bFindRedundantColumn =
				oMetaModel.getObject(
					"/" + oValueList.CollectionPath + "/" + oVLParameter.ValueListProperty + "@com.sap.vocabularies.UI.v1.Hidden"
				) === true
					? false
					: true;
			var bConsiderImportanceHigh =
				bFindRedundantColumn &&
				!bIsDropDownListe &&
				_hasImportanceHigh(oValueList) &&
				oVLParameter["@com.sap.vocabularies.UI.v1.Importance"] &&
				oVLParameter["@com.sap.vocabularies.UI.v1.Importance"].$EnumMember === "com.sap.vocabularies.UI.v1.ImportanceType/High"
					? true
					: false;

			// Check some conditions for hidding redundant columns
			if (bFindRedundantColumn) {
				aRelevantColumn = oValueList.Parameters.filter(function(oParameter) {
					if (
						oParameter.ValueListProperty !== oVLParameter.ValueListProperty &&
						oVLParameter.$Type !== "com.sap.vocabularies.Common.v1.ValueListParameterInOut"
					) {
						oPropertyAnnotations = oMetaModel.getObject(
							"/" + oValueList.CollectionPath + "/" + oParameter.ValueListProperty + "@"
						);
						sDescriptionPath =
							oPropertyAnnotations &&
							oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text"] &&
							oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text"].$Path;
					}
					return sDescriptionPath && sDescriptionPath === oVLParameter.ValueListProperty;
				});
				aRelevantColumn.forEach(function(oParameter) {
					if (oParameter.ValueListProperty !== oVLParameter.ValueListProperty) {
						oPropertyAnnotations = oMetaModel.getObject(
							"/" + oValueList.CollectionPath + "/" + oParameter.ValueListProperty + "@"
						);
						// VH without Dialog (DDL)
						if (bIsDropDownListe) {
							if (
								oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"] &&
								oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"]
									.$EnumMember === "com.sap.vocabularies.UI.v1.TextArrangementType/TextSeparate"
							) {
								sRedundantColumn = undefined;
							} else {
								sRedundantColumn =
									oMetaModel.getObject(
										"/" +
											oValueList.CollectionPath +
											"/" +
											oParameter.ValueListProperty +
											"@com.sap.vocabularies.UI.v1.Hidden"
									) !== true && "{_VHUI>/hideColumn}";
							}
							// VH with Dialog
						} else {
							bIsTextOnly =
								oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"] &&
								oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"]
									.$EnumMember === "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly";
							if (bIsTextOnly) {
								sRedundantColumn =
									oMetaModel.getObject(
										"/" +
											oValueList.CollectionPath +
											"/" +
											oParameter.ValueListProperty +
											"@com.sap.vocabularies.UI.v1.Hidden"
									) !== true && "{_VHUI>/hideColumn}";
							}
							if (!oParameter["@com.sap.vocabularies.UI.v1.Importance"]) {
								if (!bIsTextOnly) {
									sRedundantColumn = undefined;
								} else {
									sRedundantColumn = bConsiderImportanceHigh ? "{_VHUI>/showColumnInTypeAhead}" : "{_VHUI>/hideColumn}";
								}
							}
						}
					}
				});
				return sRedundantColumn;
			}
		}

		var ValueListHelper = {
			getColumnVisibility: function(oValueList, oVLParameter, oSource) {
				var bIsDropDownListe = oSource && !!oSource.valueHelpWithFixedValues,
					sRedundantColumn = _redundantDescription(oValueList, oVLParameter, bIsDropDownListe);
				// Hide redundant "TextArrangement-Columns"
				if (!!sRedundantColumn) {
					return sRedundantColumn;
				}
				if (bIsDropDownListe || !_hasImportanceHigh(oValueList)) {
					return undefined;
				} else if (
					oVLParameter &&
					oVLParameter["@com.sap.vocabularies.UI.v1.Importance"] &&
					oVLParameter["@com.sap.vocabularies.UI.v1.Importance"].$EnumMember === "com.sap.vocabularies.UI.v1.ImportanceType/High"
				) {
					return undefined;
				} else {
					return "{_VHUI>/showAllColumns}";
				}
			},
			hasImportance: function(oValueListContext) {
				return _hasImportanceHigh(oValueListContext.getObject()) ? "Importance/High" : "None";
			},
			getMinScreenWidth: function(oValueList) {
				return _hasImportanceHigh(oValueList) ? "{= ${_VHUI>/minScreenWidth}}" : "416px";
			},
			getTableItemsParameters: function(oValueList, sRequestGroupId, bSuggestion) {
				var sSortFieldName,
					sParameters = "",
					metaModel = oValueList.$model.getMetaModel();

				oValueList.Parameters.find(function(oElement) {
					if (
						metaModel.getObject(
							"/" +
								oValueList.CollectionPath +
								"/" +
								oElement.ValueListProperty +
								"@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement/$EnumMember"
						) === "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"
					) {
						sSortFieldName = metaModel.getObject(
							"/" +
								oValueList.CollectionPath +
								"/" +
								oElement.ValueListProperty +
								"@com.sap.vocabularies.Common.v1.Text/$Path"
						);
					} else {
						sSortFieldName = oElement.ValueListProperty;
					}
					return !(
						metaModel.getObject(
							"/" + oValueList.CollectionPath + "/" + oElement.ValueListProperty + "@com.sap.vocabularies.UI.v1.Hidden"
						) === true
					);
				});

				var bSuspended = oValueList.Parameters.some(function(oParameter) {
					return bSuggestion || oParameter.$Type === "com.sap.vocabularies.Common.v1.ValueListParameterIn";
				});

				if (sRequestGroupId) {
					sParameters = ", parameters: { $$groupId: '" + sRequestGroupId + "' }";
				}

				return (
					"{path: '/" +
					oValueList.CollectionPath +
					"'" +
					sParameters +
					", suspended : " +
					bSuspended +
					", sorter: {path: '" +
					sSortFieldName +
					"', ascending: true}}"
				);
			},
			getPropertyPath: function(oParameters) {
				return !oParameters.UnboundAction
					? "/" + oParameters.EntitySet + "/" + oParameters.Action + "/" + oParameters.Property
					: "/" + oParameters.Action.substring(oParameters.Action.lastIndexOf(".") + 1) + "/" + oParameters.Property;
			},
			getWaitForPromise: function() {
				return waitForPromise;
			},
			getValueListCollectionEntitySet: function(oValueListContext) {
				var mValueList = oValueListContext.getObject();
				return mValueList.$model.getMetaModel().createBindingContext("/" + mValueList.CollectionPath);
			},
			getValueListProperty: function(oPropertyContext) {
				var oValueListModel = oPropertyContext.getModel();
				var mValueList = oValueListModel.getObject("/");
				return mValueList.$model
					.getMetaModel()
					.createBindingContext("/" + mValueList.CollectionPath + "/" + oPropertyContext.getObject());
			},

			getValueListInfo: function(oFVH, oMetaModel, propertyPath, sConditionModel, oProperties) {
				var sKey,
					sDescriptionPath,
					sFilterFields = "",
					sPropertyName = oMetaModel.getObject(propertyPath + "@sapui.name"),
					sPropertyPath,
					aInParameters = [],
					aOutParameters = [],
					sFieldPropertyPath = "";
				// Adding bAutoExpandSelect (second parameter of requestValueListInfo) as true by default
				return oMetaModel
					.requestValueListInfo(propertyPath, true, oFVH.getBindingContext())
					.then(function(mValueListInfo) {
						var bProcessInOut = oFVH.getInParameters().length + oFVH.getOutParameters().length === 0,
							oVHUIModel = oFVH.getModel("_VHUI"),
							qualifierForValidation = oVHUIModel.getProperty("/qualifierForValidation"),
							bSuggestion = oVHUIModel.getProperty("/isSuggestion"),
							hasValueListRelevantQualifiers = oVHUIModel.getProperty("/hasValueListRelevantQualifiers"),
							aCollectiveSearchItems = oFVH.getAggregation("collectiveSearchItems"),
							aValueHelpKeys = Object.keys(mValueListInfo).sort(),
							sValueHelpQualifier = aValueHelpKeys[0],
							sValueHelpId;

						// No valid qualifier should be handled in mdc
						if (sValueHelpQualifier === undefined) {
							return oFVH.getModel("_VHUI").setProperty("/noValidValueHelp", true);
						}
						// Multiple/Collective ValueHelp and/or ContextDependentValueHelp (ContextDependentValueHelp not used in LR-Filterbar, Action/Create-Dialog)
						if (hasValueListRelevantQualifiers || aValueHelpKeys.length > 1 || aCollectiveSearchItems.length > 1) {
							// In case of type-ahead the avaiable qualifer for validation is used
							if (bSuggestion && aValueHelpKeys.indexOf(qualifierForValidation) > -1) {
								sValueHelpId =
									qualifierForValidation === ""
										? oFVH.getId() + "::non-qualifier"
										: oFVH.getId() + "::qualifier::" + qualifierForValidation;
								// Store in ValueHelp model
								oVHUIModel.setProperty("/valueHelpId", sValueHelpId);
								oVHUIModel.setProperty("/collectiveSearchKey", qualifierForValidation);
								mValueListInfo = mValueListInfo[qualifierForValidation];
								oFVH.setProperty("validateInput", true);
							} else {
								// In case of context is changes --> may be collectiveSearchItem needs to be removed
								aCollectiveSearchItems.forEach(function(oItem) {
									if (!aValueHelpKeys.includes(oItem.getKey())) {
										oFVH.removeAggregation("collectiveSearchItems", oItem);
									}
								});
								// Drop-down (vh selection) only visible if more then 1 VH
								if (aValueHelpKeys.length === 1) {
									oFVH.removeAllAggregation("collectiveSearchItems");
									oProperties.collectiveSearchKey = undefined;
								} else {
									aValueHelpKeys.forEach(function(sValueHelpKey) {
										if (
											aCollectiveSearchItems.filter(function(oItem) {
												return oItem.getKey() === sValueHelpKey;
											}).length === 0
										) {
											oFVH.addAggregation(
												"collectiveSearchItems",
												new sap.ui.core.Item({
													key: sValueHelpKey,
													text: mValueListInfo[sValueHelpKey].Label,
													enabled: true
												})
											);
										}
									});
								}
								if (oProperties && oProperties.collectiveSearchKey !== undefined) {
									sValueHelpQualifier = oProperties.collectiveSearchKey;
								} else if (oProperties && oProperties.collectiveSearchKey === undefined) {
									sValueHelpQualifier = aValueHelpKeys[0];
									oProperties.collectiveSearchKey = aValueHelpKeys[0];
								}
								// Build ValueHelp Id
								sValueHelpId =
									sValueHelpQualifier === ""
										? oFVH.getId() + "::non-qualifier"
										: oFVH.getId() + "::qualifier::" + sValueHelpQualifier;
								// Store in ValueHelp model
								oFVH.getModel("_VHUI").setProperty("/valueHelpId", sValueHelpId);
								oFVH.getModel("_VHUI").setProperty("/collectiveSearchKey", sValueHelpQualifier);
								// Get ValueHelp by qualifier
								mValueListInfo = mValueListInfo[sValueHelpQualifier];
								if (
									!oFVH.getParent().isA("sap.ui.mdc.FilterBar") &&
									bSuggestion &&
									qualifierForValidation !== sValueHelpQualifier
								) {
									oFVH.setProperty("validateInput", false);
								}
							}
						} else {
							// Default ValueHelp (the first/only one) is normaly ValueHelp w/o qualifier
							mValueListInfo = mValueListInfo[sValueHelpQualifier];
						}

						// Determine the settings
						// TODO: since this is a static function we can't store the infos when filterbar is requested later
						mValueListInfo.Parameters.forEach(function(entry) {
							//All String fields are allowed for filter
							sPropertyPath = "/" + mValueListInfo.CollectionPath + "/" + entry.ValueListProperty;
							var oProperty = mValueListInfo.$model.getMetaModel().getObject(sPropertyPath),
								oPropertyAnnotations = mValueListInfo.$model.getMetaModel().getObject(sPropertyPath + "@") || {};

							// If oProperty is undefined, then the property coming for the entry isn't defined in
							// the metamodel, therefore we don't need to add it in the in/out parameters
							if (oProperty) {
								// Search for the *out Parameter mapped to the local property
								if (!sKey && entry.$Type.indexOf("Out") > 48 && entry.LocalDataProperty.$PropertyPath === sPropertyName) {
									//"com.sap.vocabularies.Common.v1.ValueListParameter".length = 49
									sFieldPropertyPath = sPropertyPath;
									sKey = entry.ValueListProperty;
									//Only the text annotation of the key can specify the description
									sDescriptionPath =
										oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text"] &&
										oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text"].$Path;
								}
								if (
									!sFilterFields &&
									oProperty.$Type === "Edm.String" &&
									!oPropertyAnnotations["@com.sap.vocabularies.UI.v1.HiddenFilter"] &&
									!oPropertyAnnotations["@com.sap.vocabularies.UI.v1.Hidden"]
								) {
									//TODO: Ask why I can only specify one filter field? Maybe , is the wrong syntax...
									sFilterFields =
										sFilterFields.length > 0 ? sFilterFields + "," + entry.ValueListProperty : entry.ValueListProperty;
								}
								//Collect In and Out Parameter (except the field in question)
								if (
									bProcessInOut &&
									entry.$Type !== "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly" &&
									entry.$Type !== "com.sap.vocabularies.Common.v1.ValueListParameterConstant" &&
									entry.LocalDataProperty &&
									entry.LocalDataProperty.$PropertyPath !== sPropertyName
								) {
									var sValuePath = "";

									if (sConditionModel && sConditionModel.length > 0) {
										if (
											oFVH.getParent().isA("sap.ui.mdc.Table") &&
											oFVH.getBindingContext() &&
											entry.$Type === "com.sap.vocabularies.Common.v1.ValueListParameterIn"
										) {
											// Special handling for value help used in filter dialog
											var aParts = entry.LocalDataProperty.$PropertyPath.split("/");
											if (aParts.length > 1) {
												var sFirstNavigationProperty = aParts[0];
												var oBoundEntity = oFVH
													.getModel()
													.getMetaModel()
													.getMetaContext(oFVH.getBindingContext().getPath());
												var sPathOfTable = oFVH
													.getParent()
													.getRowBinding()
													.getPath();
												if (oBoundEntity.getObject(sPathOfTable + "/$Partner") === sFirstNavigationProperty) {
													// Using the condition model doesn't make any sense in case an in-parameter uses a navigation property
													// referring to the partner. Therefore reducing the path and using the FVH context instead of the condition model
													sValuePath =
														"{" +
														entry.LocalDataProperty.$PropertyPath.replace(sFirstNavigationProperty + "/", "") +
														"}";
												}
											}
										}

										if (!sValuePath) {
											sValuePath =
												"{" + sConditionModel + ">/conditions/" + entry.LocalDataProperty.$PropertyPath + "}";
										}
									} else {
										sValuePath = "{" + entry.LocalDataProperty.$PropertyPath + "}";
									}

									//Out and InOut
									if (entry.$Type.indexOf("Out") > 48) {
										aOutParameters.push(
											new OutParameter({
												value: sValuePath,
												helpPath: entry.ValueListProperty
											})
										);
									}
									//In and InOut
									if (entry.$Type.indexOf("In") > 48) {
										aInParameters.push(
											new InParameter({
												value: sValuePath,
												helpPath: entry.ValueListProperty,
												initialValueFilterEmpty: entry.InitialValueIsSignificant
											})
										);
									}
									//otherwise displayOnly and therefor not considered
								}
								// Collect Constant Parameter
								// We manage constants parameters as in parameters so that the value list table is filtered properly
								if (entry.$Type === "com.sap.vocabularies.Common.v1.ValueListParameterConstant") {
									aInParameters.push(
										new InParameter({
											value: entry.Constant,
											helpPath: entry.ValueListProperty
										})
									);
								}
							}
						});
						return {
							keyValue: sKey,
							descriptionValue: sDescriptionPath,
							fieldPropertyPath: sFieldPropertyPath,
							filters: sFilterFields,
							inParameters: aInParameters,
							outParameters: aOutParameters,
							valueListInfo: mValueListInfo
						};
					})
					.catch(function(exc) {
						var sMsg =
							exc.status && exc.status === 404
								? "Metadata not found (" + exc.status + ") for value help of property " + propertyPath
								: exc.message;
						Log.error(sMsg);
						oFVH.destroyContent();
					});
			},
			createValueHelpDialog: function(propertyPath, oFVH, oTable, oFilterBar, oValueListInfo, bSuggestion) {
				var sFVHClass = oFVH.getMetadata().getName(),
					oWrapper = oFVH.getContent && oFVH.getContent(),
					sWrapperId = oWrapper && oWrapper.getId(),
					sFilterFields = oValueListInfo && oValueListInfo.filters,
					aInParameters = oValueListInfo && oValueListInfo.inParameters,
					aOutParameters = oValueListInfo && oValueListInfo.outParameters,
					sValueHelpId = oFVH.getModel("_VHUI").getProperty("/valueHelpId"),
					that = this;

				// Only do this in case of context dependent value helps or other VH called the first time
				if ((!oTable || sValueHelpId !== undefined) && sFVHClass.indexOf("FieldValueHelp") > -1) {
					oFVH.setTitle(oValueListInfo.valueListInfo.Label);
					oFVH.setKeyPath(oValueListInfo.keyValue);
					oFVH.setDescriptionPath(oValueListInfo.descriptionValue);
					oFVH.setFilterFields(_entityIsSearchable(oValueListInfo) ? "$search" : "");
				}

				function templateFragment(sFragmentName) {
					var oFragment = XMLTemplateProcessor.loadTemplate(sFragmentName, "fragment"),
						mValueListInfo = oValueListInfo.valueListInfo,
						oValueListModel = new JSONModel(mValueListInfo),
						oValueListServiceMetaModel = mValueListInfo.$model.getMetaModel(),
						sValueHelpId = oFVH.getModel("_VHUI").getProperty("/valueHelpId"),
						oSourceModel = new JSONModel({
							id: sValueHelpId || oFVH.getId(),
							groupId: oFVH.data("requestGroupId") || undefined,
							bSuggestion: bSuggestion,
							valueHelpWithFixedValues: oFVH
								.getModel()
								.getMetaModel()
								.getObject(propertyPath + "@")["@com.sap.vocabularies.Common.v1.ValueListWithFixedValues"]
						});
					return Promise.resolve(
						XMLPreprocessor.process(
							oFragment,
							{ name: sFragmentName },
							{
								//querySelector("*")
								bindingContexts: {
									valueList: oValueListModel.createBindingContext("/"),
									entityType: oValueListServiceMetaModel.createBindingContext("/" + mValueListInfo.CollectionPath + "/"),
									source: oSourceModel.createBindingContext("/")
								},
								models: {
									valueList: oValueListModel,
									entityType: oValueListServiceMetaModel,
									source: oSourceModel,
									metaModel: oValueListServiceMetaModel,
									viewData: new JSONModel({
										converterType: BaseConverter.TemplateType.ListReport
									})
								}
							}
						)
					).then(function(oFragment) {
						var oLogInfo = { path: propertyPath, fragmentName: sFragmentName, fragment: oFragment };
						if (Log.getLevel() === Log.Level.DEBUG) {
							//In debug mode we log all generated fragments
							ValueListHelper.ALLFRAGMENTS = ValueListHelper.ALLFRAGMENTS || [];
							ValueListHelper.ALLFRAGMENTS.push(oLogInfo);
						}
						if (ValueListHelper.logFragment) {
							//One Tool Subscriber allowed
							setTimeout(function() {
								ValueListHelper.logFragment(oLogInfo);
							}, 0);
						}
						return Fragment.load({ definition: oFragment });
					});
				}

				oTable = oTable || templateFragment("sap.fe.macros.internal.valuehelp.ValueListTable");

				//Create filter bar if not there and requested via bSuggestion===false
				if (sFilterFields.length) {
					oFilterBar = oFilterBar || (!bSuggestion && templateFragment("sap.fe.macros.internal.valuehelp.ValueListFilterBar"));
				} else {
					oFilterBar = Promise.resolve();
				}
				return Promise.all([oTable, oFilterBar]).then(function(aControls) {
					var sValueHelpId = oFVH.getModel("_VHUI").getProperty("/valueHelpId"),
						sTableWidth,
						oTable = aControls[0],
						oFilterBar = aControls[1],
						aFilterItems = oFilterBar ? oFilterBar.getFilterItems() : [];
					if (oTable) {
						oTable.setModel(oValueListInfo.valueListInfo.$model);
						var oBinding = oTable.getBinding("items");
						oBinding.attachEventOnce("dataRequested", function() {
							BusyLocker.lock(oTable);
						});
						oBinding.attachEvent("dataReceived", function(oEvent) {
							if (BusyLocker.isLocked(oTable)) {
								BusyLocker.unlock(oTable);
							}
							if (oEvent.getParameter("error")) {
								// show the unbound messages but with a timeout as the messages are otherwise not yet in the message model
								setTimeout(messageHandling.showUnboundMessages, 0);
							}
						});
						Log.info("Value List XML content created [" + propertyPath + "]", oTable.getMetadata().getName(), "MDC Templating");
					}
					if (oFilterBar && aFilterItems.length) {
						oFilterBar.setModel(oValueListInfo.valueListInfo.$model);
						Log.info(
							"Value List XML content created [" + propertyPath + "]",
							oFilterBar.getMetadata().getName(),
							"MDC Templating"
						);
					}
					if (oTable !== oWrapper.getTable() || sValueHelpId !== undefined) {
						oWrapper.setTable(oTable);
						delete waitForPromise[sWrapperId];
					}
					// Different table width for type-ahead or dialog
					sTableWidth = that.getTableWidth(oTable, that._getWidthInRem(oFVH._getField()));
					oFVH.getModel("_VHUI").setProperty("/tableWidth", sTableWidth);
					oTable.setWidth(bSuggestion ? sTableWidth : "100%");
					if (
						(oFilterBar && oFilterBar !== oFVH.getFilterBar() && aFilterItems.length) ||
						(oFilterBar && sValueHelpId !== undefined)
					) {
						oFVH.setFilterBar(oFilterBar);
					} else {
						oFVH.addDependent(oFilterBar);
					}
					aOutParameters.forEach(function(oOutParameter) {
						oFVH.addOutParameter(oOutParameter);
					});
					aInParameters.forEach(function(oInParameter) {
						oFVH.addInParameter(oInParameter);
					});
					// Removing Value Help InParameter set in Condition because of a VH Constant Parameter set
					oFVH.attachEventOnce("afterClose", function(oEvent) {
						var oFVH = oEvent.oSource;
						var aConditions = oFVH && oFVH.getConditions();
						if (aConditions && aConditions[0] && aConditions[0].inParameters) {
							delete aConditions[0].inParameters;
							oFVH.fireSelect({ conditions: aConditions, add: false, close: true });
						}
					});

					// VH-Cache: In case of type-ahead only table is created, in case of VH-dialog the filterbar is created and needs to be cached
					if (sValueHelpId !== undefined) {
						var oSelectedCacheItem = _getCachedValueHelp(sValueHelpId);
						if (!oSelectedCacheItem) {
							aCachedValueHelp.push({
								sVHId: sValueHelpId,
								oVHTable: oTable,
								oVHFilterBar: oFilterBar
							});
						} else if (oSelectedCacheItem && oSelectedCacheItem.oVHFilterBar === false) {
							aCachedValueHelp[aCachedValueHelp.indexOf(oSelectedCacheItem)].oVHFilterBar = oFilterBar;
						}
					}
				});
			},
			_getWidthInRem: function(oControl) {
				var $width = oControl.$().width(),
					fWidth = $width ? parseFloat(Rem.fromPx($width)) : 0;
				return isNaN(fWidth) ? 0 : fWidth;
			},
			getTableWidth: function(oTable, fMinWidth) {
				var sWidth,
					aColumns = oTable.getColumns(),
					aVisibleColumns =
						(aColumns &&
							aColumns.filter(function(oColumn) {
								return oColumn && oColumn.getVisible();
							})) ||
						[],
					iSumWidth = aVisibleColumns.reduce(function(fSum, oColumn) {
						sWidth = oColumn.getWidth();
						if (sWidth && sWidth.endsWith("px")) {
							sWidth = Rem.fromPx(sWidth);
						}
						var fWidth = parseFloat(sWidth);
						return fSum + (isNaN(fWidth) ? 9 : fWidth);
					}, aVisibleColumns.length);
				return Math.max(iSumWidth, fMinWidth) + "em";
			},
			showValueListInfo: function(propertyPath, oFVH, bSuggestion, sConditionModel, oProperties) {
				var oModel = oFVH.getModel(),
					oMetaModel = oModel.getMetaModel(),
					oWrapper = oFVH.getContent && oFVH.getContent(),
					sWrapperId = oWrapper && oWrapper.getId(),
					oTable = oWrapper && oWrapper.getTable && oWrapper.getTable(),
					oFilterBar = oFVH && oFVH.getFilterBar && oFVH.getFilterBar(),
					bExists = oTable && oFilterBar,
					oVHUIModel,
					sQualifierForValidation,
					sValueHelpId;

				// setting the _VHUI model evaluated in the ValueListTable fragment
				oVHUIModel = oFVH.getModel("_VHUI");
				if (!oVHUIModel) {
					oVHUIModel = new JSONModel({});
					oFVH.setModel(oVHUIModel, "_VHUI");
					// Identifies the "ContextDependent-Scenario"
					oVHUIModel.setProperty(
						"/hasValueListRelevantQualifiers",
						!!oMetaModel.getObject(propertyPath + "@")["@com.sap.vocabularies.Common.v1.ValueListRelevantQualifiers"]
					);
					if (oFVH.getProperty("validateInput")) {
						sQualifierForValidation = oMetaModel.getObject(propertyPath + "@")[
							"@com.sap.vocabularies.Common.v1.ValueListForValidation"
						];
						sQualifierForValidation = sQualifierForValidation && sQualifierForValidation.replace(/\s/g, "");
						oVHUIModel.setProperty("/qualifierForValidation", sQualifierForValidation);
					}
				}
				oVHUIModel.setProperty("/isSuggestion", bSuggestion);
				oVHUIModel.setProperty("/showAllColumns", !bSuggestion);
				oVHUIModel.setProperty("/hideColumn", false);
				oVHUIModel.setProperty("/showColumnInTypeAhead", bSuggestion);
				oVHUIModel.setProperty("/minScreenWidth", !bSuggestion ? "418px" : undefined);
				sValueHelpId = oFVH.getModel("_VHUI").getProperty("/valueHelpId");
				if (oTable) {
					oTable.setWidth(bSuggestion ? oVHUIModel.getProperty("/tableWidth") : "100%");
				}

				// switch off internal caching
				if (
					(sValueHelpId !== undefined && oFVH.getBindingContext()) ||
					(oFVH.getModel("_VHUI").getProperty("/collectiveSearchKey") !== undefined &&
						oFVH.getModel("_VHUI").getProperty("/collectiveSearchKey") !== oProperties.collectiveSearchKey)
				) {
					oTable = undefined;
					oFilterBar = undefined;
					bExists = undefined;
					delete waitForPromise[sWrapperId];
				}

				if (!oFilterBar && oFVH.getDependents().length > 0) {
					var oPotentialFilterBar = oFVH.getDependents()[0];
					if (oPotentialFilterBar.isA("sap.ui.mdc.filterbar.vh.FilterBar")) {
						oFilterBar = oPotentialFilterBar;
					}
				}
				if (waitForPromise[sWrapperId] || bExists) {
					return waitForPromise["promise" + sWrapperId];
				} else {
					if (!oTable) {
						waitForPromise[sWrapperId] = true;
					}
					var oPromise = ValueListHelper.getValueListInfo(oFVH, oMetaModel, propertyPath, sConditionModel, oProperties)
						.then(function(oValueListInfo) {
							var sValueHelpId = oFVH.getModel("_VHUI").getProperty("/valueHelpId");
							var oSelectedCacheItem = _getCachedValueHelp(sValueHelpId);
							if (oFVH.getModel("_VHUI").getProperty("/noValidValueHelp")) {
								Log.error("Context dependent value help not found");
								return oFVH.close();
							}
							if (oSelectedCacheItem) {
								oTable = oSelectedCacheItem.oVHTable;
								oFilterBar = oSelectedCacheItem.oVHFilterBar;
							}
							return (
								oValueListInfo &&
								ValueListHelper.createValueHelpDialog(propertyPath, oFVH, oTable, oFilterBar, oValueListInfo, bSuggestion)
							);
						})
						.catch(function(exc) {
							var sMsg =
								exc.status && exc.status === 404
									? "Metadata not found (" + exc.status + ") for value help of property " + propertyPath
									: exc.message;
							Log.error(sMsg);
							oFVH.destroyContent();
						});
					waitForPromise["promise" + sWrapperId] = oPromise;
					return oPromise;
				}
			},
			setValueListFilterFields: function(propertyPath, oFVH, bSuggestion, sConditionModel) {
				var oModel = oFVH.getModel(),
					oMetaModel = oModel.getMetaModel();
				// For ContextDependentValueHelp the func getValueListInfo is also called
				if (
					oFVH.getBindingContext() &&
					oFVH
						.getModel()
						.getMetaModel()
						.getObject(propertyPath + "@")["@com.sap.vocabularies.Common.v1.ValueListRelevantQualifiers"]
				) {
					return;
				}
				return ValueListHelper.getValueListInfo(oFVH, oMetaModel, propertyPath, sConditionModel).then(function(oValueListInfo) {
					oValueListInfo && oFVH.setFilterFields(_entityIsSearchable(oValueListInfo) ? "$search" : "");
				});
			},
			getColumnWidth: function(sDataFieldType, oValueList) {
				if (oValueList && oValueList.Parameters && oValueList.Parameters.length === 1) {
					// in case there is a single parameter its width needs to match the table's hence type is ignored
					return "auto";
				}
				switch (sDataFieldType) {
					case "Edm.Stream":
						return "7em";
					case "Edm.Boolean":
						return "8em";
					case "Edm.Date":
					case "Edm.TimeOfDay":
						return "9em";
					case "Edm.DateTimeOffset":
						return "12em";
					default:
						return "auto";
				}
			}
		};
		return ValueListHelper;
	},
	/* bExport= */ true
);
