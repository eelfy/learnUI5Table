sap.ui.define(["sap/base/util/extend",
	"sap/base/util/isEmptyObject",
	"sap/base/util/each",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/analytics/odata4analytics",
	"sap/ui/generic/app/util/ModelUtil",
	"sap/suite/ui/generic/template/genericUtilities/FeLogger",
	"sap/suite/ui/generic/template/genericUtilities/oDataModelHelper",
	"sap/suite/ui/generic/template/genericUtilities/testableHelper",
	"sap/suite/ui/generic/template/lib/CRUDHelper",
	"sap/ui/core/format/DateFormat"
], function(extend, isEmptyObject, each, MessageBox, Filter, FilterOperator, odata4analytics, ModelUtil, FeLogger, oDataModelHelper, testableHelper, CRUDHelper, DateFormat){
		"use strict";
		var	sClassName = "lib.navigation.startupParameterHelper";
		var oLogger = new FeLogger(sClassName).getLogger();

		function fnCombineMode(sPreferredMode, sMode) {
			return {
				mode: sPreferredMode && sMode && (sMode !== sPreferredMode) ? "inconsistent" : sMode || sPreferredMode || "display",
				force: !!sMode
			};
		}

		function fnPrepareCreate(oTemplateContract) {
			var oGlobalModel = oTemplateContract.oAppComponent.getModel("_templPrivGlobal");
			oGlobalModel.setProperty("/generic/forceFullscreenCreate", true);
		}

		/**
		* Transforms the startup parameters with Edm.Guid type in a format which is understood by the backend and its used only in navigation scenarios.
		*
		* @param {array} aPropertiesOfTypeGuid array containing all parameters of Guid type
		* @param {map} mParameters javascript map object of the startup parameters
		*/
		function fnTransformEdmGuidParams(aPropertiesOfTypeGuid, mParameters) {
			aPropertiesOfTypeGuid.forEach(function (sProperty) {
				var aPropertyValues = mParameters[sProperty];
				if (aPropertyValues) {
					var sGuid = aPropertyValues[0];
					sGuid = sGuid.toLowerCase().replace(/(guid')([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(')/, "$2");
					if (!sGuid.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/)) {
						// assume legacy guid
						sGuid = sGuid.replace(/([0-9a-f]{8})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{12})/, "$1-$2-$3-$4-$5");
					}
					aPropertyValues[0] = sGuid;
				}
			});
		}

		/**
		* Transforms the startup parameters with Edm.DateTime/Edm.DateTimeOffset type in a format which is understood by the backend and its used only
		* in navigation scenarios. Date startup parameters are converted in UTC format by denver/generic layer as it is accepted by smart filter bar
		* but in navigation scenarios, we need to remove the UTC format so that batch request is made with appropriate value.
		*
		* @param {array} aPropertiesOfTypeDate array containing all parameters of DateTime/DateTimeOffset type
		* @param {map} mParameters javascript map object of the startup parameters
		*/
		function fnTransformEdmDateTimeParams(aPropertiesOfTypeDate, mParameters) {
			aPropertiesOfTypeDate.forEach(function (oProperty) {
				var aPropertyValues = mParameters[oProperty.name];
				if (aPropertyValues) {
					if (oProperty["type"] === "Edm.DateTime" && oProperty["sap:display-format"] === "Date") {
						var oFormatter = DateFormat.getDateTimeInstance({
							pattern: "yyyy-MM-ddTHH:mm:ss.SSSZ"
						});
						var oExpectedFormat = DateFormat.getDateInstance({
							pattern: "yyyy-MM-ddT00:00:00"
						});
						var oDate = oFormatter.parse(aPropertyValues[0]);
						aPropertyValues[0] = oExpectedFormat.format(oDate);
					}
				}
			});
		}

		/**
		* While navigation from source app to target, there are some cases where we need to transform/manipulate some startup parameters
		* in order to perform successful navigation. This kind of transformation is not required in list report but only with navigation 
		* to object page. Right now, only Guid and DateTime parameters need this kind of transormation and in future, if required, we
		* can add more functions to transform any additional parameter(s).
		*
		* @param {object} oModel The app component model
		* @param {string} sEntitySet entity set of the app
		* @param {map} mParameters javascript map object of the startup parameters
		*/
		function fnTransformStartupParameters(oModel, sEntitySet, mParameters) {
			if (isEmptyObject(mParameters)) {
				return;
			}
			var oMetaModel = oModel.getMetaModel();
			var oEntitySet = oMetaModel.getODataEntitySet(sEntitySet);
			var sEntityType = oEntitySet && oEntitySet.entityType;
			var oEntityType = oMetaModel.getODataEntityType(sEntityType);
			var aEntityTypeProperties = (oEntityType && oEntityType.property) || [];
			var aPropertiesOfTypeGuid = [], aPropertiesOfTypeDate = [];

			aEntityTypeProperties.forEach(function (oProperty) {
				if (oProperty.type === "Edm.Guid") {
					aPropertiesOfTypeGuid.push(oProperty.name);
				} else if (oProperty.type === "Edm.DateTime" || oProperty.type === "Edm.DateTimeOffset") {
					aPropertiesOfTypeDate.push(oProperty);
				}
			});

			fnTransformEdmGuidParams(aPropertiesOfTypeGuid, mParameters); 	//transform the Edm.Guid parameter
			fnTransformEdmDateTimeParams(aPropertiesOfTypeDate, mParameters); 	// transform the Edm.DateTime parameter
		}

		function getCreateParameters(oTemplateContract){
			var oInbounds = oTemplateContract.oAppComponent.getInboundParameters();
			return oInbounds ? Object.keys(oInbounds).filter(function(sParameter){
				return oInbounds[sParameter].useForCreate;
			}) : [];
		}

		function fnParameters2PredefinedValuesForCreate(oTemplateContract, mParameters){
			var oRet;
			var aCreateParameters = getCreateParameters(oTemplateContract);
			for (var i = 0; i < aCreateParameters.length; i++){
				var sCreateParameter = aCreateParameters[i];
				var aValues = mParameters[sCreateParameter];
				if (aValues && aValues.length === 1){
					oRet = oRet || Object.create(null);
					oRet[sCreateParameter] = aValues[0];
				}
			}
			return oRet;
		}

		function fnProcessEditableFieldFor(oMetaModel, sEntitySet, mParameters){
			// easiest solution to handle different possible usage of forEdit fields: provide a given value always in both fields
			// alternative solution: only check the other property at the places of usage, i.e.
			// - when checking navigable pages, check for values in the field, that is not part of semantic key
			// - when providing vlaues for SFB, check for values in the field, that is no selection field
			// pending: clarify, which solution would be better
			var oEntityType = oMetaModel.getODataEntityType(oMetaModel.getODataEntitySet(sEntitySet).entityType);
			oEntityType.property.forEach(function(oProperty){
				if (oProperty["com.sap.vocabularies.Common.v1.EditableFieldFor"]){
					// annotation property names follow their type, so PropertyPath is the right property to look at - String has to be supported for compatibility reasons
					var sKeyProperty = oProperty["com.sap.vocabularies.Common.v1.EditableFieldFor"].PropertyPath || oProperty["com.sap.vocabularies.Common.v1.EditableFieldFor"].String;
					var sForEditProperty = oProperty.name;
					// map key fields to corresponding for edit properties to provide values in SFB (without mapping in FLP)
					if (mParameters[sKeyProperty] && !mParameters[sForEditProperty]){
						mParameters[sForEditProperty] = mParameters[sKeyProperty];
					}
					// and vice versa to support navigation to object page if field is mapped in FLP (formerly recommend)
					if (mParameters[sForEditProperty] && !mParameters[sKeyProperty] ){
						mParameters[sKeyProperty] = mParameters[sForEditProperty];
					}
				}
			});
		}
		
		function isNodeAvailableForMode(oTreeNode, oMode){
			return !(oTreeNode.page.navigation && oTreeNode.page.navigation[oMode.mode]);
		}
		
		function isKeyCoveredByParams(aKeys, mParameters){
			return !!aKeys && aKeys.every(function(oKey){
				var sKeyProperty = oKey.name || oKey.PropertyPath; // Keys are located either at name (resource/entity key) or PropertyPath (SemanticKey annotation)
				var aParamValues = mParameters[sKeyProperty] || [];
				return aParamValues.length === 1;
			});
		}
		
		function getKeyFromCanonicalPath(sPath){
			var oSpec = oDataModelHelper.splitCanonicalPath(sPath);
			return oSpec.key;
		}
		
		function getNavigationCandidateForNode(oModel, oMetaModel, oTreeNode, mParameters, bConsiderTechnicalKeys){
			if (oTreeNode.noKey){
				return {
					treeNode: oTreeNode,
					navigationPossible: true,
					keyValue: ""
				};				
			}
			var oEntitySet = oMetaModel.getODataEntitySet(oTreeNode.entitySet);
			if (!oEntitySet){
				return null;
			}
			var oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
			var aSemanticKey = oEntityType["com.sap.vocabularies.Common.v1.SemanticKey"];
			if (isKeyCoveredByParams(aSemanticKey, mParameters)){
				return {
					treeNode: oTreeNode,
					key: aSemanticKey,
					isSemantic: true
				};
			}
			// Semantical key cannot be used -> if requested try technical key
			return bConsiderTechnicalKeys && oEntityType.key.propertyRef && isKeyCoveredByParams(oEntityType.key.propertyRef, mParameters) && {
				treeNode: oTreeNode,
				navigationPossible: true,
				keyValue: getKeyFromCanonicalPath(oModel.createKey(oTreeNode.entitySet, mParameters))
			};
		}
		
		function addChildNodesToNavigationCandidates(oModel, oMetaModel, oTemplateContract, oTreeNode, mParameters, oMode, mNavigationCandidates){
			oTreeNode.children.forEach(function(sEntitySet){
				var oChildNode = oTemplateContract.mEntityTree[sEntitySet];
				if (oChildNode.page.component.settings && oChildNode.page.component.settings.allowDeepLinking // for sub object pages deep linking is only allowed if configured accordingly
				&& isNodeAvailableForMode(oChildNode, oMode)){
					var oCandidate = getNavigationCandidateForNode(oModel, oMetaModel, oChildNode, mParameters, false); // note that technical keys are not considered for subobject pages
					if (oCandidate){
						mNavigationCandidates[oChildNode.sRouteName] = oCandidate;
						addChildNodesToNavigationCandidates(oModel, oMetaModel, oTemplateContract, oChildNode, mParameters, oMode, mNavigationCandidates);
					}
				}
			});
		}
		
		function getNavigationCandidates(oModel, oTemplateContract, sEntitySet, mParameters, oMode){
			var mRet = Object.create(null);
			mRet.root = { 
				treeNode: oTemplateContract.mRoutingTree.root,
				navigationPossible: true,
				keyValue: ""
			};
			var oMainObjectNode = oTemplateContract.mEntityTree[sEntitySet];
			if (oMainObjectNode && !(oMainObjectNode.page.component.settings && oMainObjectNode.page.component.settings.allowDeepLinking === false) // for main object page we assume deep linking is possible if not explicitly switched off
				&& isNodeAvailableForMode(oMainObjectNode, oMode)){
				var oMetaModel = oModel.getMetaModel();
				var oCandidate = getNavigationCandidateForNode(oModel, oMetaModel, oMainObjectNode, mParameters, true);
				if (oCandidate){
					mRet[oMainObjectNode.sRouteName] = oCandidate;
					if (oMode.mode === "display"){ // in display case we check also for nodes on deeper layers
						addChildNodesToNavigationCandidates(oModel, oMetaModel, oTemplateContract, oMainObjectNode, mParameters, oMode, mRet);			
					}
				}
			}
			return mRet;
		}
		
		function getFilterForCandidate(mParameters, oCandidate){
			var aFilters = oCandidate.key.map(function(oKey){
				var sProperty = oKey.PropertyPath;
				var sValue = mParameters[sProperty][0];
				return new Filter(sProperty, FilterOperator.EQ, sValue);	
			});
			if (oCandidate.treeNode.isDraft){
				var oDraftFilter = new Filter({
					filters: [new Filter("IsActiveEntity", "EQ", false),
						new Filter("SiblingEntity/IsActiveEntity", "EQ", null)
					],
					and: false
				});
				aFilters.push(oDraftFilter);				
			}
			return new Filter(aFilters, true);
		}
		
		function getParameterizedEntitySet(oModel, mParameters, oCandidate){
			var sEntitySet = oCandidate.treeNode.entitySet;
			var sRet = "/" + sEntitySet; // default
			try {
				var o4a = new odata4analytics.Model(odata4analytics.Model.ReferenceByModel(oModel));
				var queryResult = o4a.findQueryResultByName(sEntitySet);
				var queryResultRequest = new odata4analytics.QueryResultRequest(queryResult);
				var parameterization = queryResult && queryResult.getParameterization();
				var bIsParamPresent = false;
				if (parameterization) {
					queryResultRequest.setParameterizationRequest(new odata4analytics.ParameterizationRequest(parameterization));
					var aParametricSet = parameterization.getAllParameterNames();
					each(aParametricSet, function() {
						if (mParameters.hasOwnProperty(this)) {
							bIsParamPresent = true;
							queryResultRequest.getParameterizationRequest().setParameterValue(
								this,
								 mParameters[this][0]
							);
						}
					});
					// To handle Mandatory Parameter which starts without "P_" in parameter list
					for (var i = 0; i < aParametricSet.length; i++) {
						if (aParametricSet[i].startsWith("P_")) {
							var sMandatoryParameter = aParametricSet[i].substr(2);
							if (mParameters.hasOwnProperty(sMandatoryParameter)) {
								bIsParamPresent = true;
								queryResultRequest.getParameterizationRequest().setParameterValue(
									aParametricSet[i],
									 mParameters[sMandatoryParameter][0]);
							}
						}
					}
					if (bIsParamPresent) {
						sRet = queryResultRequest.getURIToQueryResultEntitySet();
					}
				}
			} catch (error) {
				// Not throwing an error because it will fail qunit and is not required as fall back is default
				oLogger.info(error.name + ":" + error.message );
			}
			return sRet;			
		}
		
		function getRowResult(oResult){
			if (!(oResult && oResult.results)){
				return null;
			}
			var oRet;
			oResult.results.some(function(oRow){
				oRet = oRow;
				return oRow.IsActiveEntity; // if this row is the active one, take it
			});
			return oRet;
		}
		
		function getReadRequestForCandidate(oModel, mParameters, oCandidate){
			var oFilter = getFilterForCandidate(mParameters, oCandidate);
			var sEntitySetPath = getParameterizedEntitySet(oModel, mParameters, oCandidate);
			return new Promise(function(fnResolve) {
				oModel.read(sEntitySetPath, {
					filters: [oFilter],
					success: function(oResult) {
						var oRowResult = getRowResult(oResult);
						var sPath = oRowResult && oModel.getKey(oRowResult);
						var sKey = sPath && getKeyFromCanonicalPath(sPath);
						fnResolve(sKey);
					},
					error: function() {
						fnResolve();
					}
				});
			});
		}
		
		function fnNavigateToCandidates(oTemplateContract, oModel, mNavigationCandidates, mParameters){
			var aTestRoutes = Object.keys(mNavigationCandidates).filter(function(sRoute){
				return !mNavigationCandidates[sRoute].navigationPossible;
			}); // determine all routes for which we still must check whether we can navigate
			var aTestPromises = aTestRoutes.map(function(sRoute){
				var oCandidate = mNavigationCandidates[sRoute];
				return getReadRequestForCandidate(oModel, mParameters, oCandidate);
			});
			return Promise.all(aTestPromises).then(function(aTestResults){
				for (var i = 0; i < aTestRoutes.length; i++){
					var oCandidate = mNavigationCandidates[aTestRoutes[i]];
					oCandidate.keyValue = aTestResults[i];
				}
				var getNavigationPossible = function(sRoute){
					var oCandidate = mNavigationCandidates[sRoute];
					if (oCandidate.navigationPossible === undefined){
						oCandidate.navigationPossible = !!oCandidate.keyValue && getNavigationPossible(oCandidate.treeNode.parentRoute);
					}
					return oCandidate.navigationPossible;
				};
				var oTargetNode;
				each(mNavigationCandidates, function(sRoute){
					if (getNavigationPossible(sRoute)){
						var oCandidateNode = mNavigationCandidates[sRoute].treeNode;
						oTargetNode = (!oTargetNode  || oTargetNode.level < oCandidateNode.level) ? oCandidateNode : oTargetNode;
					}
				});
				var aTargetKeys = [];
				for (var oCurrentNode = oTargetNode; oCurrentNode; oCurrentNode = oCurrentNode.level && oTemplateContract.mRoutingTree[oCurrentNode.parentRoute]){
					aTargetKeys[oCurrentNode.level] = mNavigationCandidates[oCurrentNode.sRouteName].keyValue;
				}
				var mAppStates = Object.create(null);
				if (oTemplateContract.oFlexibleColumnLayoutHandler){
					oTemplateContract.oFlexibleColumnLayoutHandler.adaptAppStatesForExternalNavigation(oTargetNode, mAppStates);
				}
				var oIdentity = {
					treeNode: oTargetNode,
					keys: aTargetKeys,
					appStates: mAppStates
				};
				return oTemplateContract.oNavigationControllerProxy.navigateToIdentity(oIdentity, true, 1).then(Function.prototype); // in case of success: return a Promise that resolves to nothing						
			});
		}
		
		/*This method returns a promise, which resolves to the entityset to which the navigate should happen
		* The semantic object annotation of the all the level 1 (first level) Object pages are taken and matched 
		* with the semantic object that is used for the navigation to happen, and the matich entity set is used
		* to open the object page
		*/
		function fnDetermineEntitySetForStartup(oTemplateContract, sMode){
			if (sMode === "create" && oTemplateContract.mRoutingTree.root.page.component.settings && oTemplateContract.mRoutingTree.root.page.component.settings.creationEntitySet){
				return Promise.resolve(oTemplateContract.mRoutingTree.root.page.component.settings.creationEntitySet);
			}
			return oTemplateContract.myIntentPromise ? oTemplateContract.myIntentPromise.then(function(oIntent){
				var aRootObjectPage = oTemplateContract.mRoutingTree.root.children;
				for (var i = 0; i < aRootObjectPage.length; i++){
					var sCandidate = aRootObjectPage[i];
					if (oTemplateContract.mEntityTree[sCandidate].semanticObject === oIntent.semanticObject){
						return sCandidate;
					}
				}
				return oTemplateContract.mRoutingTree.root.entitySet;	
			}) : Promise.resolve(oTemplateContract.mRoutingTree.root.entitySet);
		}
		
		function fnNavigateForCreate(oTemplateContract, mParameters, oModel, sEntitySet){
			fnPrepareCreate(oTemplateContract);
			var oPredefinedValues = fnParameters2PredefinedValuesForCreate(oTemplateContract, mParameters);
			var oDraftController = oTemplateContract.oAppComponent.getTransactionController().getDraftController();
			var bIsDraft = oDraftController.getDraftContext().isDraftEnabled(sEntitySet);
			if (bIsDraft) {
				//get the treenode(internal representation of page)
				var oTreeNode = oTemplateContract.mEntityTree[sEntitySet] || oTemplateContract.mRoutingTree.root;
				//create component and register view in order to get oController and oApplicationController.
				oTemplateContract.oNavigationControllerProxy.prepareHostView(oTreeNode);
				var oTargets = oTemplateContract.oNavigationControllerProxy.oRouter.getTargets();
				oTargets.display(oTreeNode.sRouteName);
				return oTreeNode.componentCreated.then(function(oComponent) {
					var oComponentRegistryEntry = oTemplateContract.componentRegistry[oComponent.getId()];
					return oComponentRegistryEntry.viewRegistered.then(function(){
						var sRootExpand = null;
						var oController = oComponentRegistryEntry.oController;
						var oApplicationController = oTemplateContract.oAppComponent.getApplicationController();
						var bUseNewActionForCreate = !!(oTemplateContract.mRoutingTree.root.page.component.settings && oTemplateContract.mRoutingTree.root.page.component.settings.useNewActionForCreate);
						var oParameters = {
							sRootExpand: sRootExpand,
							oController: oController,
							oApplicationController: oApplicationController,
							bUseNewActionForCreate: bUseNewActionForCreate
						};
						var oCreatePromise = CRUDHelper.create(oDraftController, sEntitySet, "/" + sEntitySet, oModel, oTemplateContract.oApplicationProxy, oPredefinedValues, oParameters);
						return oCreatePromise.then(function(oContext) {
							var mAppStates = Object.create(null);
							// if there is defaultLayoutTypeIfExternalNavigation property  in the manifest of the target application
							// set the fcl layout property from the value of defaultLayoutTypeIfExternalNavigation
							if (oTemplateContract.oFlexibleColumnLayoutHandler){
								var oTreeNode = oTemplateContract.mEntityTree[sEntitySet];
								oTemplateContract.oFlexibleColumnLayoutHandler.adaptAppStatesForExternalNavigation(oTreeNode, mAppStates);
							}
							return oTemplateContract.oNavigationControllerProxy.navigateToSubContext(oContext, true, 4, null, mAppStates).then(Function.prototype); // in case of success: return a Promise that resolves to nothing
						}, function(oError) {
							return {
								title: oTemplateContract.getText("ST_GENERIC_ERROR_TITLE"),
								text: oError.messageText,
								description: "",
								icon: "sap-icon://message-error"
							};
						});
					});
				});
			}
			// Non-draft case
			var mAppStates = Object.create(null);
			// if there is defaultLayoutTypeIfExternalNavigation property  in the manifest of the target application
			// set the fcl layout property from the value of defaultLayoutTypeIfExternalNavigation
			if (oTemplateContract.oFlexibleColumnLayoutHandler){
				oTemplateContract.oFlexibleColumnLayoutHandler.adaptAppStatesForExternalNavigation(oTemplateContract.mEntityTree[sEntitySet], mAppStates);
			}
			return oTemplateContract.oNavigationControllerProxy.navigateForNonDraftCreate(sEntitySet, oPredefinedValues, null, mAppStates).then(Function.prototype); // return a Promise that resolves to nothing
		}
		
		function fnNavigateForCreateWithContext(oTemplateContract, mParameters, oModel, sEntitySet){
			fnPrepareCreate(oTemplateContract);
			return new Promise(function(fnResolve){
				var fnHandleError = function(oError){
					fnResolve({
						title: oTemplateContract.getText("ST_ERROR"),
						text: (oError && oError.messageText) || oTemplateContract.getText("ST_GENERIC_UNKNOWN_NAVIGATION_TARGET"),
						icon: "sap-icon://message-error",
						description: ""
					});
				};
				var oEntitySet = oModel.getMetaModel().getODataEntitySet(sEntitySet);
				var oDraftRoot = oEntitySet["com.sap.vocabularies.Common.v1.DraftRoot"];
				if (oDraftRoot && oDraftRoot.NewAction) {
					var oFunctionImport = oModel.getMetaModel().getODataFunctionImport(oDraftRoot.NewAction.String.split("/")[1]);
					var oUrlParameters = {};
					if (oFunctionImport) {
						var iLength = oFunctionImport.parameter ? oFunctionImport.parameter.length : 0;
						for (var i = 0; i < iLength; i++) {
							var oFunctionParameter = oFunctionImport.parameter[i];
							var sParamValue = oFunctionParameter.mode === "In" && mParameters[oFunctionParameter.name] && mParameters[oFunctionParameter.name][0];
							if (sParamValue) {
								oUrlParameters[oFunctionParameter.name] = sParamValue;
							}
						}
						oModel.callFunction("/" + oFunctionImport.name, {
							success: function(oData, oResponse) {
								var oModelUtil = new ModelUtil(oModel);
								var oContext = oModelUtil.getContextFromResponse(oData);
								if (oContext) {
									oTemplateContract.oNavigationControllerProxy.navigateToSubContext(oContext, true, 4).then(fnResolve.bind(null, null));
								} else {
									fnHandleError();
								}
							},
							error: fnHandleError,
							method: "POST",
							urlParameters: oUrlParameters
						});
						return;
					}
				}
				fnHandleError();
			});		
		}
		
		function fnNavigateForEdit(oTemplateContract, mParameters, sEntitySet, oModel, oMode){ // App opens with an edit view, if there is a draft...if not, creates a draft
			var mParametersWithEditableFor = extend({}, mParameters);
			fnProcessEditableFieldFor(oModel.getMetaModel(), sEntitySet, mParametersWithEditableFor);
			var mNavigationCandidates = getNavigationCandidates(oModel, oTemplateContract, sEntitySet, mParametersWithEditableFor, oMode);
			var oNavigationCandidate;
			for (var sRoute in mNavigationCandidates){
				if (sRoute !== "root"){
					oNavigationCandidate = mNavigationCandidates[sRoute];
					break; // mNavigationCandidates has at most two entries. One of them is root, the other the main object.
				}
			}
			if (oNavigationCandidate){
				var oTransactionController = oTemplateContract.oAppComponent.getTransactionController();
				var sBindingPath = oNavigationCandidate.isSemantic ? "" : "/" + oModel.createKey(sEntitySet, mParametersWithEditableFor);
				var aKeys = oNavigationCandidate.isSemantic && oNavigationCandidate.key;
				var oEditPromise = CRUDHelper.edit(oTransactionController, sEntitySet, sBindingPath, oModel, oTemplateContract,
					oTemplateContract.oNavigationControllerProxy.fnInitializationResolve, aKeys, mParametersWithEditableFor);
				return oEditPromise.then(function(oResult){
					var mAppStates = Object.create(null);
					// if there is defaultLayoutTypeIfExternalNavigation property in the manifest of the target application
					// set the fcl layout property from the value of defaultLayoutTypeIfExternalNavigation
					if (oTemplateContract.oFlexibleColumnLayoutHandler){
						var oTreeNode = oTemplateContract.mEntityTree[sEntitySet];
						oTemplateContract.oFlexibleColumnLayoutHandler.adaptAppStatesForExternalNavigation(oTreeNode, mAppStates);
					}
					return oTemplateContract.oNavigationControllerProxy.navigateToSubContext(oResult.context, true, 2, null, mAppStates).then(Function.prototype); // return a Promise that resolves to nothing					
				}, function(oError){
					if (oError.lockedByUser) {
						if (oMode.force) {
							return {
								title: oTemplateContract.getText("LOCKED_OBJECT_POPOVER_TITLE"),
								text: oTemplateContract.getText("LOCKED_OBJECT_POPOVER_TITLE"),
								description: oTemplateContract.getText("ST_GENERIC_LOCKED_OBJECT_POPOVER_TEXT", [oError.lockedByUser]),
								icon: "sap-icon://message-error"
							};
						}
						return fnNavigateToCandidates(oTemplateContract, oModel, mNavigationCandidates, mParametersWithEditableFor);
					}
					if (oError.draftAdminReadResponse) {
						return null;
					}
					return new Promise(function(fnResolve){
						var sPopupText = oTemplateContract.getText("ST_GENERIC_ERROR_NOT_AUTORIZED_EDIT");
						MessageBox.warning(sPopupText, {
							onClose: function(){
								fnNavigateToCandidates(oTemplateContract, oModel, mNavigationCandidates, mParametersWithEditableFor).then(fnResolve);
							}
						});
					});
				});
			}
			return Promise.resolve();
		}
		
		function fnNavigateForDisplay(oTemplateContract, mParameters, sEntitySet, oModel, oMode){
			var mParametersWithEditableFor = extend({}, mParameters);
			fnProcessEditableFieldFor(oModel.getMetaModel(), sEntitySet, mParametersWithEditableFor);
			var mNavigationCandidates = getNavigationCandidates(oModel, oTemplateContract, sEntitySet, mParametersWithEditableFor, oMode);
			return fnNavigateToCandidates(oTemplateContract, oModel, mNavigationCandidates, mParametersWithEditableFor);
		}
		
		function fnParametersToNavigation(oTemplateContract, mParameters){
			var sRoute = mParameters && mParameters.route && mParameters.route.length === 1 && mParameters.route[0];
			if (sRoute){
				oTemplateContract.oNavigationControllerProxy.navigate(sRoute, true);
				return Promise.resolve();
			}
			var sPreferredMode = mParameters && mParameters.preferredMode && mParameters.preferredMode[0];
			var sMode = mParameters && mParameters.mode && mParameters.mode[0];
			var oMode = fnCombineMode(sPreferredMode, sMode);
			var oTargetEntitySetPromise = fnDetermineEntitySetForStartup(oTemplateContract, oMode.mode);
			return oTargetEntitySetPromise.then(function(sEntitySet){
				var oModel = oTemplateContract.oAppComponent.getModel();
				fnTransformStartupParameters(oModel, sEntitySet, mParameters); // get all properties of type Edm.guid and Edm.DateTime from the entityType and transform the strings if needed
				// Derive the mode from the parameters
				switch (oMode.mode){
					case "create":
						return fnNavigateForCreate(oTemplateContract, mParameters, oModel, sEntitySet);
					case "createWithContext":
						return fnNavigateForCreateWithContext(oTemplateContract, mParameters, oModel, sEntitySet);
					case "edit":
						return fnNavigateForEdit(oTemplateContract, mParameters, sEntitySet, oModel, oMode);
					case "display":
						return fnNavigateForDisplay(oTemplateContract, mParameters, sEntitySet, oModel, oMode);
				}
				// invalid or inconsistent mode provided -> resolve to an error object
				return {
					title: oTemplateContract.getText("ST_GENERIC_ERROR_TITLE"),
					text: oTemplateContract.getText("ST_GENERIC_ERROR_TITLE"),
					description: oTemplateContract.getText("PARAMETER_COMBINATION_NOT_SUPPORTED", [sMode, sPreferredMode]),
					icon: "sap-icon://message-error",
					replaceURL: true						
				};
			});
		}

		// Expose selected private functions to unit tests
		//
		/* eslint-disable */
		var fnTransformStartupParameters = testableHelper.testableStatic(fnTransformStartupParameters, "startupParameterHelper_fnTransformStartupParameters");
		/* eslint-enable */

		return {
			parametersToNavigation: fnParametersToNavigation
		};
	});
