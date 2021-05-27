/*
 * ! SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */

sap.ui.define([
	'sap/ui/Device',
	'sap/ui/core/library',
	'sap/ui/core/Icon',
	'sap/base/Log',
	'sap/base/util/merge',
	'sap/m/library',
	'sap/m/ObjectIdentifier',
	'sap/m/RadioButton',
	'sap/m/CheckBox',
	'sap/m/Text',
	'sap/m/Button',
	'sap/m/Input',
	'sap/m/HBox',
	'sap/m/Dialog',
	"sap/m/Popover",
	'sap/ui/comp/variants/VariantItem',
	'sap/ui/comp/variants/EditableVariantItem',
	'sap/ui/comp/variants/VariantManagement'
], function(
	Device,
	coreLibrary,
	Icon,
	Log,
	merge,
	mobileLibrary,
	ObjectIdentifier,
	RadioButton,
	CheckBox,
	Text,
	Button,
	Input,
	HBox,
	Dialog,
	Popover,
	VariantItem,
	EditableVariantItem,
	VariantManagement
) {
	"use strict";

	// shortcut for sap.ui.core.ValueState
	var ValueState = coreLibrary.ValueState;

	// shortcut for sap.ui.core.VerticalAlign
	var VerticalAlign = coreLibrary.VerticalAlign;

	// shortcut for sap.m.ButtonType
	var ButtonType = mobileLibrary.ButtonType;

	/**
	 * Constructor for a new SmartVariantManagementBase.<br>
	 * This class handles the UI Adaptation for the SmartVariantManagement
	 * control. It provides RTA enabled dialogs and the corresponding
	 * functionality for beeing able to create changes as key user.
	 *
	 * @param {string}
	 *            [sId] ID for the new control, generated automatically if no ID
	 *            is given
	 * @param {object}
	 *            [mSettings] initial settings for the new control
	 * @class
	 *            <h3>Overview</h3>
	 *            The <code>SmartVariantManagementBase</code> control is a
	 *            specialization of the
	 *            {@link sap.ui.comp.variants.VariantManagement VariantManagement}
	 *            control and communicates with the flexibility library that
	 *            offers SAPUI5 flexibility to manage the variants for the UI
	 *            Adaptation scenarios.<br>
	 *
	 * @extends sap.ui.comp.variants.VariantManagement
	 * @constructor
	 * @public
	 * @since 1.86
	 * @alias sap.ui.comp.smartvariants.SmartVariantManagementBase
	 * @ui5-metamodel This control/element also will be described in the UI5
	 *                (legacy) designtime metamodel
	 */
	var SmartVariantManagementBase = VariantManagement.extend("sap.ui.comp.smartvariants.SmartVariantManagementBase", /** @lends sap.ui.comp.smartvariants.SmartVariantManagementBase.prototype */
	{
		metadata: {
			library: "sap.ui.comp"
		},

		renderer: function(oRm, oControl) {
			VariantManagement.getMetadata().getRenderer().render(oRm, oControl);
		}
	});

	SmartVariantManagementBase.prototype.init = function() {
		VariantManagement.prototype.init.apply(this); // Call base class
	};


	SmartVariantManagementBase.prototype.exit = function() {
		VariantManagement.prototype.exit.apply(this, arguments);

		if (this._oRolesComponent) {
			this._oRolesComponent = null;
		}

		if (this._oInfoPopup) {
			this._oInfoPopup.destroy();
			this._oInfoPopup = null;
		}

		if (this._oRolesDialog) {
			this._oRolesDialog.destroy();
			this._oRolesDialog = null;
		}
	};

	SmartVariantManagementBase.prototype.getPersonalizableControlPersistencyKey  = function() {
		if (this.isPageVariant()) {
			return this.getPersistencyKey();
		}

		var aPersoInfo = this._getAllPersonalizableControls();
		if (aPersoInfo && (aPersoInfo.length === 1)) {
			return this._getControlPersKey(aPersoInfo[0]);
		}

		return null;
	};

	SmartVariantManagementBase.prototype.isSpecialVariant = function(sVariantId) {
		return this._isSpecialVariantById(sVariantId);
	};

	SmartVariantManagementBase.prototype.addVariant = function(oVariant, bIsDefault) {
		this._createVariantItem(oVariant);

		if (bIsDefault) {
			this.setDefaultVariantId(oVariant.getId());
		}
	};


	SmartVariantManagementBase.prototype.removeVariant = function(mProperties) {

		if (mProperties.variantId) {
			var oVariantItem = this.getItemByKey(mProperties.variantId);
			if (oVariantItem) {
				this.removeVariantItem(oVariantItem);
				oVariantItem.destroy();
			}

			delete this._mVariants[mProperties.variantId];
		}

		if (mProperties.previousVariantId) {
			this.activateVariant(mProperties.previousVariantId);
		}

		if (mProperties.previousDefault) {
			this.setDefaultVariantId(mProperties.previousDefault);
		}
	};

	SmartVariantManagementBase.prototype.removeWeakVariant = function(mProperties) {

		if (mProperties.variantId) {
			var oVariantItem = this.getItemByKey(mProperties.variantId);
			if (oVariantItem) {
				this.removeVariantItem(oVariantItem);
				oVariantItem.destroy();
			}

			delete this._mVariants[mProperties.variantId];
		}

		if (mProperties.previousVariantId) {
			this.setInitialSelectionKey(mProperties.previousVariantId);
		}

		if (mProperties.previousDirtyFlag) {
			this.setModified(mProperties.previousDirtyFlag);
		}

		if (mProperties.previousDefault) {
			this.setDefaultVariantId(mProperties.previousDefault);
		}
	};

	SmartVariantManagementBase.prototype.updateVariant = function(oVariant) {

		var oVariantItem;

		if (oVariant) {
			oVariantItem = this.getItemByKey(oVariant.getId());
			if (oVariantItem) {

				oVariantItem.setExecuteOnSelection(this._getExecuteOnSelection(oVariant));

				oVariantItem.setFavorite(oVariant.getFavorite());

				oVariantItem.setText(oVariant.getText("variantName"));

				if (oVariant.getContexts) {
					oVariantItem.setContexts(oVariant.getContexts());
				}
			}
		}
	};

	SmartVariantManagementBase.prototype.activateVariant = function(sVariantId) {
		this._setSelectionByKey(sVariantId);

		this.setModified(false);

		this.fireSelect({key: sVariantId});
	};

	SmartVariantManagementBase.prototype.getAllVariants  = function() {

		var oItem, aItems = this.getVariantItems();

		if (!aItems || (aItems.length < 1)) {
			// error case
			return [];
		}

		oItem = aItems[0];
		aItems.splice(0, 1);
		aItems.sort(this._compareItems);
		aItems.splice(0, 0, oItem);

		var aSortedVariantList = [];
		aItems.forEach(function(oItem) {
			aSortedVariantList.push(this._getVariantById(oItem.getKey()));
		}.bind(this));

		return aSortedVariantList;
	};

	SmartVariantManagementBase.prototype.getModified  = function() {
		return this.currentVariantGetModified();
	};

	SmartVariantManagementBase.prototype.setModified  = function(bValue) {
		return this.currentVariantSetModified(bValue);
	};
	SmartVariantManagementBase.prototype.getDefaultVariantId  = function() {
		return this.getDefaultVariantKey();
	};
	SmartVariantManagementBase.prototype.setDefaultVariantId  = function(sVariantId) {
		this._setDefaultVariantKey(sVariantId); // inform fl about the new default
		this.setDefaultVariantKey(sVariantId);	// inform VM about the new default
	};

	SmartVariantManagementBase.prototype.getPresentVariantId  = function() {
		return this.getCurrentVariantId() ? this.getCurrentVariantId() :  this.STANDARDVARIANTKEY;
	};

	SmartVariantManagementBase.prototype.getPresentVariantText  = function() {
		return this._getVariantText();
	};

	SmartVariantManagementBase.prototype.getPresentVariantContent = function() {
		return this._getContentAsync();
	};

	SmartVariantManagementBase.prototype._getPersoController = function() {
		return this._oPersoControl;
	};

	SmartVariantManagementBase.prototype._getPersoControllerType = function() {
		if (this.isPageVariant()) {
			return "page";
		}

		var aPersoInfo = this._getAllPersonalizableControls();
		if (aPersoInfo && (aPersoInfo.length === 1)) {
			return aPersoInfo[0].type;
		}

		return null;
	};

	SmartVariantManagementBase.prototype.getTitle = function() {
		return this.oVariantText;
	};


	SmartVariantManagementBase.prototype.isNameDuplicate = function(sName) {
		var sValue = sName.trim();
		return this._isDuplicateSaveAs(sValue);
	};

	SmartVariantManagementBase.prototype.isNameTooLong = function(sName) {
		var sValue = sName.trim();
		return (sValue.length > VariantManagement.MAX_NAME_LEN);
	};

	SmartVariantManagementBase.prototype.setStandardItemText = function(sName) {
		VariantManagement.prototype.setStandardItemText.apply(this, arguments);

		if (this.oVariantList) {
			var oVariantListItem = this.oVariantList.getItemByKey(this.getStandardVariantKey());
			if (oVariantListItem) {
				oVariantListItem.setText(sName);
			}
		}
	};

	SmartVariantManagementBase.prototype._createStandardVariantListItem = function() {
		var oStandardVariant = this.getVariantItems()[0];

		var oVariantListItem = null;

		oVariantListItem = new VariantItem(this.oVariantPopoverTrigger.getId() + "-item-standard", {
			key: oStandardVariant.getKey()
		});
		oVariantListItem.setText(this._determineStandardVariantName());

		this._setVariantListItemProperties(oStandardVariant, oVariantListItem);

		if (this.getStandardVariantKey() === this.STANDARDVARIANTKEY) {
			oVariantListItem.setAuthor(this.getStandardItemAuthor());
			oVariantListItem.setExecuteOnSelection(this.getExecuteOnSelectForStandardVariant());
		}

		return oVariantListItem;
	};

	SmartVariantManagementBase.prototype._restoreCompleteList = function(bIgnoreFavorites) {
		var iCount, oItem, oItems, oVariantListItem, oStandardVariantListItem;

		this.oVariantList.destroyItems();

		oStandardVariantListItem = this._createStandardVariantListItem();
		if (oStandardVariantListItem) {
			if (this.oSelectedVariantItemKey) {
				if (this.oSelectedVariantItemKey === oStandardVariantListItem.getKey()) {
					this.oVariantList.setSelectedItem(oStandardVariantListItem);
					this.oSelectedVariantItemKey = null;
				}
			} else {
				/* eslint-disable no-lonely-if */
				if (this.getSelectionKey() == oStandardVariantListItem.getKey() || this.getSelectionKey() === null) {
					this.oVariantList.setSelectedItem(oStandardVariantListItem);
					/* eslint-enable no-lonely-if */
				}
			}
		}

		oItems = this.getVariantItems();
		oItems.sort(this._compareItems);

		if (oStandardVariantListItem) {
			if (this._considerItem(bIgnoreFavorites, oStandardVariantListItem)) {
				this.oVariantList.insertItem(oStandardVariantListItem, 0);
			}
		}

		for (iCount = 0; iCount < oItems.length; iCount++) {
			oItem = oItems[iCount];

			if (!this._considerItem(bIgnoreFavorites, oItem)) {
				continue;
			}

			if (oItem.getKey() === this.getStandardVariantKey()) {
				continue;
			}

			oVariantListItem = this.oVariantList.getItemByKey(oItem.getKey());
			if (!oVariantListItem) {
				oVariantListItem = this._createVariantListItem(oItem, iCount);
				this.oVariantList.addItem(oVariantListItem);
			}

			if (this.oSelectedVariantItemKey) {
				if (this.oSelectedVariantItemKey === oVariantListItem.getKey()) {
					this.oVariantList.setSelectedItem(oVariantListItem);
					this.oSelectedVariantItemKey = null;
				}
			} else {
				/* eslint-disable no-lonely-if */
				if (this.getSelectionKey() == oVariantListItem.getKey()) {
					this.oVariantList.setSelectedItem(oVariantListItem);
					/* eslint-enable no-lonely-if */
				}
			}

		}
	};


	SmartVariantManagementBase.prototype._determineTooltip = function(oItem) {
		var sOptions, sTooltip;

		if (this._fGetDataForKeyUser) {
			return null;
		}

		if (oItem.getReadOnly() || oItem.getLabelReadOnly()) {
			sOptions = oItem.getAccessOptions();
			sTooltip = this._accessOptionsText(sOptions);
		} else {
			sTooltip = null;
		}

		if (oItem.getReadOnly()) {
			sTooltip = this.oResourceBundle.getText("VARIANT_MANAGEMENT_WRONG_LAYER");
		} else if (oItem.getLabelReadOnly() === true) {
			sTooltip = this.oResourceBundle.getText("VARIANT_MANAGEMENT_WRONG_LANGUAGE");
		}

		if (oItem.getKey() === this.getStandardVariantKey()) {
			sTooltip = null;
		}

		return sTooltip;
	};

	SmartVariantManagementBase.prototype._checkManageItemNameChangeKeyUser = function(oInputField, oItem) {
		var sText = oInputField.getValue().trim();
		var sKey = oItem.getKey();

		this._checkVariantNameConstraints(oInputField, this.oManagementTable);

		if (oInputField.getValueState() === ValueState.Error) {
			return;
		}

		if (this.oVariantList.getItemByKey(sKey).getText().trim() === sText) {
			return;
		}

		this._mTitleChanges[sKey] = sText;
	};


	SmartVariantManagementBase.prototype._getVariantByKeyFromManageKeyUser = function(sKey) {
		var oVariantItem = null;
		this.oManagementTable.getItems().some(function(oItem) {
			if (oItem.getKey() === sKey) {
				oVariantItem = oItem;
			}
			return (oVariantItem != null);
		});

		return oVariantItem;
	};

	SmartVariantManagementBase.prototype._getStandardVariantFromManageKeyUser = function() {
		return this._getVariantByKeyFromManageKeyUser(this.getStandardVariantKey());
	};

	SmartVariantManagementBase.prototype._getDefaultedEntryFromManageDefaultKeyUser = function() {

		var oDefaultedItem = null;
		this.oManagementTable.getItems().some(function(oItem) {
			if (oItem.getCells()[VariantManagement.DEF_COLUMN].getSelected()) {
				oDefaultedItem = oItem;
			}
			return (oDefaultedItem != null);
		});

		return oDefaultedItem;
	};


	SmartVariantManagementBase.prototype._handleManageDeletePressedKeyUser = function(oButton, oItem, fSetFavoriteState) {

		var oDefaultedItem = this._getDefaultedEntryFromManageDefaultKeyUser();
		if (oDefaultedItem && (oDefaultedItem.getKey() === oItem.getKey())) {
			var oStandardItem = this._getStandardVariantFromManageKeyUser();
			if (oStandardItem) {
				oStandardItem.getCells()[VariantManagement.DEF_COLUMN].setSelected(true);
				this._sDefaultChanges = oStandardItem.getKey();

				if (fSetFavoriteState) {
					var oFavCtrl = oStandardItem.getCells()[VariantManagement.FAV_COLUMN];
					if (oFavCtrl && this._isFavoriteSelected(oFavCtrl)) {
						fSetFavoriteState(oStandardItem, oFavCtrl, true);
					}
				}
			}
		}

		this.oManagementTable.removeItem(oItem);

		this._anyInErrorState(this.oManagementTable, oItem.getCells()[VariantManagement.NAME_COLUMN]);

		this._mDeletedChanges[oItem.getKey()] = true;

		oItem.destroy();
	};


	SmartVariantManagementBase.prototype._checkAndAddRolesContainerToManageDialog = function() {
		if (this._oRolesComponentContainer && this._oRolesDialog) {
			var oRolesComponentContainer = null;
			this._oRolesDialog.getContent().some(function(oContent) {
				if (oContent === this._oRolesComponentContainer) {
					oRolesComponentContainer = oContent;
					return true;
				}

				return false;
			}.bind(this));

			this._setSelectedContexts({ role: []});
			if (!oRolesComponentContainer) {
				this._oRolesDialog.addContent(this._oRolesComponentContainer);
			}
		}
	};


	SmartVariantManagementBase.prototype._determineRolesSpecificText = function(mContexts, oTextControl) {
		if (mContexts && oTextControl) {
			oTextControl.setText(this.oResourceBundle.getText((mContexts.role && mContexts.role.length > 0) ?  "VARIANT_MANAGEMENT_VISIBILITY_RESTRICTED" : "VARIANT_MANAGEMENT_VISIBILITY_NON_RESTRICTED"));
		}
	};

	SmartVariantManagementBase.prototype._checkAndCreateContextInfoChanges = function(sKey, oTextControl) {

		if (sKey) {
			if (this._oRolesComponentContainer) {
				try {
					if (!this._isInErrorContexts()) {
						var mContexts = this._getSelectedContexts();
						this._mContextInfoChanges[sKey] = mContexts;

						this._determineRolesSpecificText(mContexts, oTextControl);
					} else {
						return false;
					}
				} catch (ex) {
					return false;
				}
			}
			return true;
		}
		return false;
	};

	SmartVariantManagementBase.prototype._createRolesDialog = function() {
		if (!this._oRolesDialog) {
			this._oRolesDialog = new Dialog(this.getId() + "-roledialog", {
                draggable: true,
                resizable: true,
				contentWidth: "40%",
                title: this.oResourceBundle.getText("VARIANT_MANAGEMENT_SELECTROLES_DIALOG"),
				beginButton: new Button(this.getId() + "-rolesave", {
					text: this.oResourceBundle.getText("VARIANT_MANAGEMENT_SAVE"),
					press: function() {

						if (!this._checkAndCreateContextInfoChanges(this._oCurrentContextsKey, this._oTextControl)) {
							return;
						}
						this._oRolesDialog.close();
					}.bind(this)
				}),
				endButton: new Button(this.getId() + "-rolecancel", {
					text: this.oResourceBundle.getText("VARIANT_MANAGEMENT_CANCEL"),
					press: function() {
						this._oRolesDialog.close();
					}.bind(this)
				}),
				content: [ this._oRolesComponentContainer ],
				stretch: Device.system.phone
			});

			this._oRolesDialog.setParent(this);
			this._oRolesDialog.addStyleClass("sapUiContentPadding");
			this._oRolesDialog.addStyleClass(this._sStyleClassKeyUser);

			this._oRolesDialog.isPopupAdaptationAllowed = function() {
				return false;
			};
		}

		this._checkAndAddRolesContainerToManageDialog();
	};


	SmartVariantManagementBase.prototype._openRolesDialog = function(oItem, oTextControl) {
		this._createRolesDialog();

		this._oCurrentContextsKey = oItem.getKey();
		this._oTextControl = oTextControl;

		var mContexts = oItem.getContexts();

		if (this._mContextInfoChanges[this._oCurrentContextsKey]) {
			mContexts = this._mContextInfoChanges[this._oCurrentContextsKey];
		}

		this._setSelectedContexts(mContexts);

		this._oRolesDialog.open();
	};

	SmartVariantManagementBase.prototype._displayInfoPopup = function(oControl) {
		if (!this._oInfoPopup) {
			this._oInfoPopup = new Popover(this.getId() + "-infopopover", {
				showHeader: false,
				content: [
					new Text({text: this.oResourceBundle.getText("VARIANT_MANAGEMENT_INFO")})
					]
			});
		}

		this._oInfoPopup.openBy(oControl);
	};


	SmartVariantManagementBase.prototype._createEntriesForManageViewsDialog = function(oItem, iItemNo, mCallBackHandler) {
		var oNameCell, oTypeCell, oDefaultCell, oExecuteCell, oDeleteCell, oRolesCell;
		var sCurrentDefault = this.getDefaultVariantId();

		var sTypeText, sTooltip = this._determineTooltip(oItem);

		var oManageItem = new EditableVariantItem(this.oVariantManage.getId() + "-edit-" + iItemNo, {
			key: oItem.getKey(),
			global: oItem.getGlobal(),
			readOnly: oItem.getReadOnly(),
			author: oItem.getAuthor(),
			favorite: oItem.getFavorite(),
			//
			lifecyclePackage: oItem.getLifecyclePackage(),
			lifecycleTransportId: oItem.getLifecycleTransportId(),
			namespace: oItem.getNamespace(),
			labelReadOnly: oItem.getLabelReadOnly(),
			//
			vAlign: VerticalAlign.Middle
		});

		if (this._fGetDataForKeyUser) {
			var mContexts = merge({}, oItem.getContexts());

			if (!mContexts.hasOwnProperty("role")) {
				mContexts.role = [];
			}

			oManageItem.setContexts(mContexts);
		}

		// Favorites column
		oNameCell = new Icon(this.oVariantManage.getId() + "-fav-" + iItemNo, {
			press: mCallBackHandler.selectFavorite
		});
		oNameCell.addStyleClass("sapUICompVarMngmtFavColor");
		this._setFavoriteIcon(oNameCell, oItem.getFavorite());
		oManageItem.addCell(oNameCell);

		if (this._fGetDataForKeyUser && this.isSpecialVariant(oItem.getKey())) {
			oNameCell.detachPress(mCallBackHandler.selectFavorite);
			oNameCell.setVisible(false);
			delete this._mFavoriteChanges[oItem.getKey()];
		}


		// name column
		if (this._fGetDataForKeyUser) {
			if (this.isSpecialVariant(oItem.getKey())) {
				oNameCell = new ObjectIdentifier(this.oVariantManage.getId() + "-text-" + iItemNo);
				oNameCell.setTitle(oItem.getText());

				if (sTooltip) {
					oNameCell.setTooltip(sTooltip);
				}
			} else {
				oNameCell = new Input(this.oVariantManage.getId() + "-input-" + iItemNo, {
					liveChange: mCallBackHandler.inputLiveChange,
					change: mCallBackHandler.inputChange
				});

				oNameCell.setValue(oItem.getText());
			}

		} else {
			if (((oItem.getKey() === this.getStandardVariantKey()) || oItem.getReadOnly() || oItem.getLabelReadOnly() || !this.getVariantCreationByUserAllowed())) {
				oNameCell = new ObjectIdentifier(this.oVariantManage.getId() + "-text-" + iItemNo);
				oNameCell.setTitle(oItem.getText());

				if (sTooltip) {
					oNameCell.setTooltip(sTooltip);
				}
			} else {
				oNameCell = new Input(this.oVariantManage.getId() + "-input-" + iItemNo, {
					liveChange: mCallBackHandler.inputLiveChange,
					change: mCallBackHandler.inputChange
				});

				oNameCell.setValue(oItem.getText());
			}
		}

		oManageItem.addCell(oNameCell);



		// shared
		if (this._fGetDataForKeyUser) {
			oTypeCell = new Text();
		} else {
			if (oItem.getGlobal()) {
				sTypeText = this.oResourceBundle.getText("VARIANT_MANAGEMENT_SHARED");
			} else {
				sTypeText = this.oResourceBundle.getText("VARIANT_MANAGEMENT_PRIVATE");
			}
			oTypeCell = new Text(this.oVariantManage.getId() + "-type-" + iItemNo, {
				text: sTypeText,
				wrapping: false
			});
			oTypeCell.addStyleClass("sapUICompVarMngmtType");
		}
		oManageItem.addCell(oTypeCell);




		// default
		oDefaultCell = new RadioButton(this.oVariantManage.getId() + "-def-" + iItemNo, {
			groupName: this.oVariantManage.getId(),
			select: mCallBackHandler.selectDefault
		});

		if (this._fGetDataForKeyUser) {
			if ((sCurrentDefault === oItem.getKey()) || (oItem.getKey() === this.getStandardVariantKey()) && (sCurrentDefault === "")) {
				oDefaultCell.setSelected(true);
			}
		} else {
			if (this.sNewDefaultKey === oItem.getKey() || oItem.getKey() === this.getStandardVariantKey() && this.sNewDefaultKey === "") {
				oDefaultCell.setSelected(true);
				this._setFavoriteIcon(oManageItem.getCells()[0], true);
			}
		}
		oManageItem.addCell(oDefaultCell);



		// execute on select
		if (this.getDisplayTextForExecuteOnSelectionForStandardVariant && this.getDisplayTextForExecuteOnSelectionForStandardVariant() && oItem.getKey() === this.getStandardVariantKey()) {
			oExecuteCell = new Text(this.oVariantManage.getId() + "-exe-" + iItemNo, {
				text: this.getDisplayTextForExecuteOnSelectionForStandardVariant(),
				textAlign: "Center"
			});
		} else {
			oExecuteCell = new CheckBox(this.oVariantManage.getId() + "-exe-" + iItemNo, {
				selected: false,
				enabled: false,
				select: mCallBackHandler.executeOnSelect
			});

			if ((oItem.getKey() === this.getStandardVariantKey() && this.getSupportExecuteOnSelectOnSandardVariant())) {
				oExecuteCell.setEnabled(true);
				if (this.bExecuteOnSelectForStandardByUser !== null) {
					oExecuteCell.setSelected(this.bExecuteOnSelectForStandardByUser);
				} else {
					oExecuteCell.setSelected(oItem.getExecuteOnSelection());
				}
			} else if (this._fGetDataForKeyUser && this.isSpecialVariant(oItem.getKey())) {
				oExecuteCell.setEnabled(false);
				oExecuteCell.setSelected(oItem.getExecuteOnSelection());
			} else if (this._fGetDataForKeyUser) {
				oExecuteCell.setEnabled(true);
				oExecuteCell.setSelected(oItem.getExecuteOnSelection());
			} else {
				oExecuteCell.setEnabled(!oItem.getReadOnly());
				oExecuteCell.setSelected(oItem.getExecuteOnSelection());
			}

		}

		if (this._fGetDataForKeyUser && this.isSpecialVariant(oItem.getKey())) {
			oExecuteCell.setVisible(false);
		}
		oManageItem.addCell(oExecuteCell);



		// roles
		if (this._fGetDataForKeyUser && !this.isSpecialVariant(oItem.getKey())) {
			var oText = new Text({ wrapping: false });
			this._determineRolesSpecificText(oItem.getContexts(), oText);
			var oIcon = new Icon({
				src: "sap-icon://edit",
				press: mCallBackHandler.rolesPressed
			});
			oIcon.addStyleClass("sapUiCompVarMngmtRolesEdit");
			oRolesCell = new HBox(this.oVariantManage.getId() + "-role-" + iItemNo, {
				items: [oText, oIcon]
			});
			oRolesCell.addStyleClass("sapUICompVarMngmtRole");
		} else {
			oRolesCell = new Text();
		}

		oManageItem.addCell(oRolesCell);



		// author
		oTypeCell = new Text(this.oVariantManage.getId() + "-author-" + iItemNo, {
			text: oItem.getAuthor(),
			textAlign: "Begin"
		});
		oManageItem.addCell(oTypeCell);



		// delete
		if (this._fGetDataForKeyUser) {

		    if (this.isSpecialVariant(oItem.getKey())) {
				oDeleteCell = new Button(this.oVariantManage.getId() + "-info-" + iItemNo, {
					icon: "sap-icon://hint",
					enabled: true,
					type: ButtonType.Transparent,
					press: function() {
						this._displayInfoPopup(oDeleteCell);
					}.bind(this),
					tooltip: this.oResourceBundle.getText("VARIANT_MANAGEMENT_DELETE_NOT_POSSIBLE")
				});
		    } else {
				oDeleteCell = new Button(this.oVariantManage.getId() + "-del-" + iItemNo, {
					icon: "sap-icon://decline",
					enabled: true,
					type: ButtonType.Transparent,
					press: mCallBackHandler.deletePressed,
					tooltip: this.oResourceBundle.getText("VARIANT_MANAGEMENT_DELETE")
				});
		    }
		} else {

			oDeleteCell = new Button(this.oVariantManage.getId() + "-del-" + iItemNo, {
				icon: "sap-icon://decline",
				enabled: true,
				type: ButtonType.Transparent,
				press: mCallBackHandler.deletePressed,
				tooltip: this.oResourceBundle.getText("VARIANT_MANAGEMENT_DELETE")
			});

			if (oItem.getReadOnly() || !this.getVariantCreationByUserAllowed()) {
				oDeleteCell.setEnabled(false);
				oDeleteCell.setVisible(false);
			}
		}

		this._assignColumnInfoForDeleteButton(oDeleteCell);
		oManageItem.addCell(oDeleteCell);


		this.oManagementTable.addItem(oManageItem);

	};


	SmartVariantManagementBase.prototype.openManageViewsDialogForKeyUser = function(sStyleClass, fCallBack, oRolesComponentContainer) {

		var oItems;

		this._delayedControlCreation();

		this._mFavoriteChanges = {};
		this._mExecuteOnSelectChanges = {};
		this._mTitleChanges = {};
		this._mDeletedChanges = {};
		this._mContextInfoChanges = {};
		this.aRemovedVariants = [];
		this._sDefaultChanges = null;


		this.oManagementSave.setEnabled(true);
		this.oManagementTable.destroyItems();

		this._sStyleClassKeyUser = sStyleClass;
		this._fGetDataForKeyUser = fCallBack;

		this._bShowShare = this.getShowShare();
		this.setShowShare(false);

		this._bShowAsDefault = this.getShowSetAsDefault();
		this.setShowSetAsDefault(false);

		var fSetFavoriteState = function(oItem, oControl, bSelected) {
			this._mFavoriteChanges[oItem.getKey()] = bSelected;
			this._setFavoriteIcon(oControl, bSelected);
		}.bind(this);

		var fSelectFavorites = function(oEvent) {
			var bSelected = this._isFavoriteSelected(oEvent.oSource), oItem = oEvent.oSource.getParent();
			if (oItem) {
				fSetFavoriteState(oItem, oEvent.oSource, bSelected);
			}
		}.bind(this);

		var fChange = function(oEvent) {
			var oItem = oEvent.oSource.getParent();
			if (oItem) {
				this._checkManageItemNameChangeKeyUser(oEvent.oSource, oItem);
			}
		}.bind(this);

		var fLiveChange = function(oEvent) {
			this._checkVariantNameConstraints(oEvent.oSource, this.oManagementTable);
		}.bind(this);

		var fDeletePressed = function(oEvent) {
			var oItem = oEvent.oSource.getParent();
			if (oItem) {
			   this._handleManageDeletePressedKeyUser(oEvent.oSource, oItem, fSetFavoriteState);
			}
		}.bind(this);

		var fSelectDefault = function(oEvent) {
			var bSelected = (oEvent.getParameters().selected === true), oItem = oEvent.oSource.getParent();
			if (oItem) {
				if (bSelected) {

					this._sDefaultChanges = oItem.getKey();

					var oFavCtrl = oItem.getCells()[VariantManagement.FAV_COLUMN];
					if (oFavCtrl && this._isFavoriteSelected(oFavCtrl)) {
						fSetFavoriteState(oItem, oFavCtrl, true);
					}
				} else {
					this._sDefaultChanges = null;
				}
			}
		}.bind(this);

		var fExecuteOnSelect = function(oEvent) {
			var bSelected = (oEvent.getParameters().selected === true), oItem = oEvent.oSource.getParent();
			if (oItem) {
				this._mExecuteOnSelectChanges[oItem.getKey()] = bSelected;
			}
		}.bind(this);

		var fRolesPressed = function(oEvent) {
			var oItem = oEvent.oSource.getParent().getParent();
			this._openRolesDialog(oItem, oEvent.oSource.getParent().getItems()[0]);
		}.bind(this);


		this._initalizeManagementTableColumns();

		this._restoreCompleteList(true);

		oItems = this.oVariantList.getItems();

		Promise.all([oRolesComponentContainer]).then(function(vArgs) {
			this._oRolesComponentContainer = vArgs[0];

			this._columnVisibilityManagementTable(VariantManagement.RESTRICT_COLUMN, (!!this._oRolesComponentContainer));

			var mCallBackHandler = {
					selectFavorite: fSelectFavorites,
					selectDefault: fSelectDefault,
					executeOnSelect: fExecuteOnSelect,
					rolesPressed: fRolesPressed,
					inputChange: fChange,
					inputLiveChange: fLiveChange,
					deletePressed: fDeletePressed
			};

			for (var i = 0; i < oItems.length; i++) {
				this._createEntriesForManageViewsDialog(oItems[i], i, mCallBackHandler);
			}

			this._createManagementDialog();
			this._setDialogCompactStyle(this, this.oManagementDialog);

			this.oManagementDialog.isPopupAdaptationAllowed = function() {
				return false;
			};

			var oItem = this.oVariantList.getSelectedItem();
			if (oItem) {
				this.lastSelectedVariantKey = oItem.getKey();
			}
			this.oVariantPopOver.close();

			this.oManagementDialog.addStyleClass(sStyleClass);
			this.oManagementDialog.open();

		}.bind(this));

	};


	SmartVariantManagementBase.prototype._openVariantManagementDialog = function() {
		var oItem;
		var oItems = null;

		this._mFavoriteChanges = {};

		this.oManagementSave.setEnabled(true);

		this.oManagementTable.destroyItems();

		var fLiveChange = function(oEvent) {
			this._checkVariantNameConstraints(oEvent.oSource, this.oManagementTable);
		}.bind(this);

		var fChange = function(oControlEvent) {
			var oEvent = this._createEvent("inputfieldChange", this._checkManageItemNameChange);
			oEvent.args.push(oControlEvent.oSource.getParent());
			this._addEvent(oEvent);
		}.bind(this);

		var fSelectFavorites = function(oEvent) {
			var bSelected = this._isFavoriteSelected(oEvent.oSource), oItem = oEvent.oSource.getParent();
			if (oItem && (this.sNewDefaultKey !== oItem.getKey())) {
				this._mFavoriteChanges[oItem.getKey()] = bSelected;
				this._setFavoriteIcon(oEvent.oSource, bSelected);
			}
		}.bind(this);

		var fSelectDefault = function(oEvent) {
			var bSelected = (oEvent.getParameters().selected === true), oItem = oEvent.oSource.getParent();
			if (oItem) {

				if (bSelected) {
					this.sNewDefaultKey = oItem.getKey();
					this._mFavoriteChanges[oItem.getKey()] = bSelected;
				}

				var oFavCtrl = oItem.getCells()[VariantManagement.FAV_COLUMN];
				if (oFavCtrl && oItem.getFavorite) {
					if (bSelected) {
						this._setFavoriteIcon(oFavCtrl, true);

					} else {
						if (this._mFavoriteChanges[oItem.getKey()] !== undefined) {
							this._setFavoriteIcon(oFavCtrl, this._mFavoriteChanges[oItem.getKey()]);
						} else {
							this._setFavoriteIcon(oFavCtrl, oItem.getFavorite() === true);
						}
					}

					// oFavCtrl.setEditable(!bSelected);
				}
			}
		}.bind(this);

		var fExecuteOnSelect = function(oControlEvent) {
			var oEvent = this._createEvent("executeOnSelectionChange", this._handleManageExecuteOnSelectionChanged);
			oEvent.args.push(oControlEvent.oSource);
			this._addEvent(oEvent);
		}.bind(this);

		var fDeletePressed = function(oControlEvent) {
			var oEvent = this._createEvent("manageDeletePressed", this._handleManageDeletePressed);
			oEvent.args.push(oControlEvent.oSource);

			this._addEvent(oEvent);
		}.bind(this);

		if (this.oManageDialogSearchField) {
			this.oManageDialogSearchField.setValue("");
		}

		this._initalizeManagementTableColumns();
		this.sNewDefaultKey = this.getDefaultVariantKey();

		this._restoreCompleteList(true);

		oItem = this.oVariantList.getItemByKey(this.getStandardVariantKey());
		if (oItem) {
			this.oVariantList.removeItem(oItem);
		}

		oItems = this.oVariantList.getItems();
		oItems.sort(this._compareItems);
		if (oItem) {
			this.oVariantList.insertItem(oItem);
			oItems.splice(0, 0, oItem);
		}

		var mCallBackHandler = {
				selectFavorite: fSelectFavorites,
				selectDefault: fSelectDefault,
				executeOnSelect: fExecuteOnSelect,
				inputChange: fChange,
				inputLiveChange: fLiveChange,
				deletePressed: fDeletePressed
		};
		for (var i = 0; i < oItems.length; i++) {
			this._createEntriesForManageViewsDialog(oItems[i], i, mCallBackHandler);
		}

		this.aRemovedVariants = [];
		this.aRemovedVariantTransports = [];
		this.aRenamedVariants = [];

		this.aExeVariants = [];

		this._createManagementDialog();
		this._setDialogCompactStyle(this, this.oManagementDialog);
		oItem = this.oVariantList.getSelectedItem();
		if (oItem) {
			this.lastSelectedVariantKey = oItem.getKey();
		}
		this.oVariantPopOver.close();

		this.oManagementDialog.open();
	};


	SmartVariantManagementBase.prototype._checkAndAddRolesContainerToSaveAsDialog = function() {
		if (this._oRolesComponentContainer && this.oSaveDialog) {
			var oRolesComponentContainer = null;
			this.oSaveDialog.getContent().some(function(oContent) {
				if (oContent === this._oRolesComponentContainer) {
					oRolesComponentContainer = oContent;
					return true;
				}

				return false;
			}.bind(this));

			this._setSelectedContexts({ role: []});
			if (!oRolesComponentContainer) {
				this.oSaveDialog.addContent(this._oRolesComponentContainer);
			}
		}
	};

	SmartVariantManagementBase.prototype.openSaveAsDialogForKeyUser = function(sStyleClass, fCallBack, oRolesComponentContainer) {

		this._delayedControlCreation();

		this._sStyleClassKeyUser = sStyleClass;
		this._fGetDataForKeyUser = fCallBack;

		this._mContextInfoChanges = {};

		this._bShowShare = this.getShowShare();
		this.setShowShare(false);

		this._bShowAsDefault = this.getShowSetAsDefault();
		this.setShowSetAsDefault(false);

		this._initSaveAsDialog();


		this.oSaveDialog.addStyleClass(sStyleClass);
		this.oSaveDialog.isPopupAdaptationAllowed = function() {
			return false;
		};

		Promise.all([oRolesComponentContainer]).then(function(vArgs) {
			this._oRolesComponentContainer = vArgs[0];
			this._checkAndAddRolesContainerToSaveAsDialog();
			this.oSaveDialog.open();

		}.bind(this));
	};

	SmartVariantManagementBase.prototype._cleanUpSaveForKeyUser = function() {
		this.oSaveDialog.removeStyleClass(this._sStyleClassKeyUser);

		this._cleanUpKeyUser();
		this.oSaveDialog.close();
	};

	SmartVariantManagementBase.prototype._cleanUpManageViewsForKeyUser = function() {
		this.oManagementDialog.removeStyleClass(this._sStyleClassKeyUser);

		this._cleanUpKeyUser();
		this.oManagementDialog.close();
	};

	SmartVariantManagementBase.prototype._cleanUpKeyUser = function() {

		this.setShowShare(this._bShowShare);
		this.setShowSetAsDefault(this._bShowAsDefault);

		this._mFavoriteChanges = null;
		this._mExecuteOnSelectChanges = null;
		this._sDefaultChanges = null;
		this._mTitleChanges = null;
		this._mDeletedChanges = null;
		this._mContextInfoChanges = null;

		this._fGetDataForKeyUser = null;
		this._sStyleClassKeyUser = undefined;
		this._oRolesComponentContainer = null;
	};

	SmartVariantManagementBase.prototype._handleManageSavePressedForKeyUser = function() {

		var sItemKey, mData = {};
		var bSelectedItemDeleted = false;

		if (this._sDefaultChanges) {
			mData.default = this._sDefaultChanges;
		}

		if (Object.keys(this._mExecuteOnSelectChanges).length > 0) {
			for (sItemKey in this._mExecuteOnSelectChanges) {
				if (!mData[sItemKey]) {
					mData[sItemKey] = {};
				}

				mData[sItemKey].executeOnSelect = this._mExecuteOnSelectChanges[sItemKey];
			}
		}

		if (Object.keys(this._mFavoriteChanges).length > 0) {

			for (sItemKey in this._mFavoriteChanges) {

				if (this.isSpecialVariant(sItemKey)) {
					continue;
				}

				if (!mData[sItemKey]) {
					mData[sItemKey] = {};
				}

				mData[sItemKey].favorite = this._mFavoriteChanges[sItemKey];
			}
		}

		if (Object.keys(this._mTitleChanges).length > 0) {

			for (sItemKey in this._mTitleChanges) {

				if (!mData[sItemKey]) {
					mData[sItemKey] = {};
				}

				mData[sItemKey].name = this._mTitleChanges[sItemKey];
			}
		}

		if (Object.keys(this._mDeletedChanges).length > 0) {

			for (sItemKey in this._mDeletedChanges) {

				if (!mData[sItemKey]) {
					mData[sItemKey] = {};
				}

				mData[sItemKey].deleted = this._mDeletedChanges[sItemKey];
			}

			if (this.lastSelectedVariantKey === sItemKey) {
				bSelectedItemDeleted = true;
			}
		}

		if (Object.keys(this._mContextInfoChanges).length > 0) {

			for (sItemKey in this._mContextInfoChanges) {

				if (!mData[sItemKey]) {
					mData[sItemKey] = {};
				}

				mData[sItemKey].contexts = this._mContextInfoChanges[sItemKey];
			}
		}

		if (bSelectedItemDeleted) {
			this.activateVariant(this.getStandardVariantKey());
		}

		this._fGetDataForKeyUser(mData);

		this._cleanUpManageViewsForKeyUser();
	};

	SmartVariantManagementBase.prototype._handleManageCancelPressedForKeyUser = function() {
		this._fGetDataForKeyUser();
		this._cleanUpManageViewsForKeyUser();
	};

	SmartVariantManagementBase.prototype._handleSaveAsCancelPressedForKeyUser = function() {
		this._fGetDataForKeyUser();
		this._cleanUpSaveForKeyUser();
	};

	SmartVariantManagementBase.prototype._getSelectedContexts = function() {
		return this._oRolesComponentContainer.getComponentInstance().getSelectedContexts();
	};
	SmartVariantManagementBase.prototype._setSelectedContexts = function(mContexts) {
		this._oRolesComponentContainer.getComponentInstance().setSelectedContexts(mContexts);
	};

	SmartVariantManagementBase.prototype._isInErrorContexts = function() {
		return this._oRolesComponentContainer.getComponentInstance().hasErrorsAndShowErrorMessage();
	};

	SmartVariantManagementBase.prototype._getContentAsync = function() {
		return Promise.resolve(this._fetchContentAsync());
	};

	SmartVariantManagementBase.prototype._handleSaveAsPressedForKeyUser = function() {

		if (!this._checkAndCreateContextInfoChanges("newDummyKey")) {
			return;
		}

		try {
			this._getContentAsync().then(function(oContent) {
				var oData =  {
						"default": this.oDefault.getSelected(),
						executeOnSelect: this.oExecuteOnSelect.getSelected(),
						//favorite: true,
						type: this._getPersoControllerType(),
						text: this.oInputName.getValue().trim(),
						contexts: this._mContextInfoChanges["newDummyKey"],
						content: oContent
				};

				this._fGetDataForKeyUser(oData);
				this._cleanUpSaveForKeyUser();
			}.bind(this));
		} catch (ex) {
			Log.error("'_handleSaveAsPressedForKeyUser' throws an exception:" + ex.message);
			this._fGetDataForKeyUser([]);
			this._cleanUpSaveForKeyUser();
		}
	};

	return SmartVariantManagementBase;

});