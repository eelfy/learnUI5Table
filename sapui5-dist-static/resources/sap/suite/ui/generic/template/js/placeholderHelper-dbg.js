sap.ui.define(["sap/ui/model/odata/AnnotationHelper",
	"sap/base/util/isEmptyObject",
	"sap/base/util/extend"
], function (AnnotationHelperModel,isEmptyObject,extend) {
	"use strict";

	var placeholderHelper = {

		/*
		This method is used to reset the placeholders to components
		when the placeholder values are (i)FE-DATA-LOADED, (ii)FE-HEADER-LOADED and (i) and (ii) with -FIRSTTIMEONLY
		But this is not used for view created, instead resetPlaceHoldersForRoute is used
		There is an issue with datareceivedofTable, once that is fixed, this method would be obsolete and only resetPlaceHoldersForRoute would be used.
		*/

		resetPlaceHolders: function(oTemplateUtils, aConditionToRemovePlaceholder){	
			var oTemplatePrivateGlobal = oTemplateUtils.oComponentUtils.getTemplatePrivateGlobalModel();
			var sPlaceholderValue = oTemplatePrivateGlobal.getProperty("/generic/placeholderValue");
			if (aConditionToRemovePlaceholder.indexOf(sPlaceholderValue) !== -1){
				oTemplatePrivateGlobal.setProperty("/generic/placeholdersShown", {"":true});
			}
		},

		/*
		This method is used to reset the placeholders to components
		when the placeholder values are FE-VIEW-CREATED and  FE-VIEW-CREATED-FIRSTTIMEONLY
		*/

		resetPlaceHoldersForRoute: function(oTemplatePrivateGlobalModel,sRouteName,aConditionToRemovePlaceholder){
			var sPlaceholderValue = oTemplatePrivateGlobalModel.getProperty("/generic/placeholderValue");
			if (aConditionToRemovePlaceholder.indexOf(sPlaceholderValue) !== -1){
				var mPlaceholdersOld = oTemplatePrivateGlobalModel.getProperty("/generic/placeholdersShown");
				var mPlaceholdersNew = Object.create(null);
				for (var sRoute in mPlaceholdersOld){
						if (sRoute !== sRouteName){
							mPlaceholdersNew[sRoute] = true;
						}
					}
				oTemplatePrivateGlobalModel.setProperty("/generic/placeholdersShown", mPlaceholdersNew);
			}
		},
		// return if placeholder is active
		isPlaceHolderInactive: function(oTemplatePrivateGlobalModel){
			if (oTemplatePrivateGlobalModel.getProperty("/generic/placeholdersShown") !== undefined){
				return isEmptyObject(oTemplatePrivateGlobalModel.getProperty("/generic/placeholdersShown"));
			} else {
				return false;
			}
			
		},

		setPlaceHolderPreconditions: function(oTemplatePrivateGlobalModel){
			oTemplatePrivateGlobalModel.setProperty("/generic/repeatPlaceholder", true);
		},

		setPlaceholder: function(oIdentity, oFlexibleColumnLayoutHandler, oTemplatePrivateGlobalModel, oRoutingTree, aConditionToIgnorePlaceholder){
			var mPlaceholders = Object.create(null);
			var bIsMultiColumn = oFlexibleColumnLayoutHandler && !oFlexibleColumnLayoutHandler.hasIdentityFullscreenLayout(oIdentity);
			var mPlaceholdersOld = oTemplatePrivateGlobalModel.getProperty("/generic/placeholdersShown");
			extend(mPlaceholders, mPlaceholdersOld); 
			var placeholderValue = oTemplatePrivateGlobalModel.getProperty("/generic/placeholderValue");
			// This function is not removing placeholders. It only decides whether new ones need to be set
			for (var oTreeNode = oIdentity.treeNode; oTreeNode; oTreeNode = bIsMultiColumn && oTreeNode.fCLLevel && oRoutingTree[oTreeNode.parentRoute]){
				if (oTreeNode.behaviour.getPlaceholderInfo() && placeholderValue){
					if (!oTreeNode.componentId ){ // setting place holder when LR and OP is opened for first time
						mPlaceholders[oTreeNode.sRouteName] = true;
					} else if (oTemplatePrivateGlobalModel.getProperty("/generic/repeatPlaceholder") === true){ // setting placeholder, when OP is not opened first time, but still placeholder is required.
						if (aConditionToIgnorePlaceholder.indexOf(placeholderValue) === -1){
						mPlaceholders[oTreeNode.sRouteName] = true;
						}
					}
					oTemplatePrivateGlobalModel.setProperty("/generic/repeatPlaceholder", false);	   
				}
			}
			oTemplatePrivateGlobalModel.setProperty("/generic/placeholdersShown", mPlaceholders);

		}

	};

	return placeholderHelper;
}, /* bExport= */ true);
