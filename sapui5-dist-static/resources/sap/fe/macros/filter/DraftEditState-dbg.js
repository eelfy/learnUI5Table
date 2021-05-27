/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

sap.ui.define(
	[
		"sap/ui/mdc/condition/FilterOperatorUtil",
		"sap/ui/mdc/condition/Operator",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/ui/model/json/JSONModel",
		"sap/ui/mdc/enum/ConditionValidated"
	],
	function(FilterOperatorUtil, Operator, Filter, FilterOperator, JSONModel, ConditionValidated) {
		"use strict";

		var feBundle = sap.ui.getCore().getLibraryResourceBundle("sap.fe.core");
		/**
		 * Enum for edit state of a document in an draft enabled service collection.
		 * Allows to simplify filtering on a set of documents as described by the
		 * individual state
		 *
		 * @readonly
		 * @enum {string}
		 * @private
		 * @ui5-restricted
		 */
		var EDITSTATE = {
			/**
			 * Active documents that don't have a corresponding draft and all own draft documents
			 * @private
			 * @ui5-restricted
			 */
			ALL: {
				id: "ALL",
				display: feBundle.getText("C_DRAFT_EDIT_STATE_DRAFT_ALL_FILTER")
			},
			/**
			 * Active documents that don't have a draft document
			 * @private
			 * @ui5-restricted
			 */
			UNCHANGED: {
				id: "UNCHANGED",
				display: feBundle.getText("C_DRAFT_EDIT_STATE_DRAFT_UNCHANGED_FILTER")
			},
			/**
			 * Own draft documents
			 * @private
			 * @ui5-restricted
			 */
			OWN_DRAFT: {
				id: "OWN_DRAFT",
				display: feBundle.getText("C_DRAFT_EDIT_STATE_DRAFT_OWN_DRAFT_FILTER")
			},
			/**
			 * Active documents that are locked by other users
			 * @private
			 * @ui5-restricted
			 */
			LOCKED: {
				id: "LOCKED",
				display: feBundle.getText("C_DRAFT_EDIT_STATE_DRAFT_LOCKED_FILTER")
			},
			/**
			 * Active documents that have draft documents by other users
			 * @private

			 * @ui5-restricted
			 */
			UNSAVED_CHANGES: {
				id: "UNSAVED_CHANGES",
				display: feBundle.getText("C_DRAFT_EDIT_STATE_DRAFT_UNSAVED_CHANGES_FILTER")
			}
		};

		function getFilterForEditState(sEditState) {
			switch (sEditState) {
				case EDITSTATE.UNCHANGED.id:
					return new Filter({
						filters: [
							new Filter({ path: "IsActiveEntity", operator: FilterOperator.EQ, value1: true }),
							new Filter({ path: "HasDraftEntity", operator: FilterOperator.EQ, value1: false })
						],
						and: true
					});
				case EDITSTATE.OWN_DRAFT.id:
					return new Filter({ path: "IsActiveEntity", operator: FilterOperator.EQ, value1: false });
				case EDITSTATE.LOCKED.id:
					return new Filter({
						filters: [
							new Filter({ path: "IsActiveEntity", operator: FilterOperator.EQ, value1: true }),
							new Filter({
								path: "SiblingEntity/IsActiveEntity",
								operator: FilterOperator.EQ,
								value1: null
							}),
							new Filter({
								path: "DraftAdministrativeData/InProcessByUser",
								operator: FilterOperator.NE,
								value1: ""
							})
						],
						and: true
					});
				case EDITSTATE.UNSAVED_CHANGES.id:
					return new Filter({
						filters: [
							new Filter({ path: "IsActiveEntity", operator: FilterOperator.EQ, value1: true }),
							new Filter({
								path: "SiblingEntity/IsActiveEntity",
								operator: FilterOperator.EQ,
								value1: null
							}),
							new Filter({
								path: "DraftAdministrativeData/InProcessByUser",
								operator: FilterOperator.EQ,
								value1: ""
							})
						],
						and: true
					});
				default:
					// ALL
					return new Filter({
						filters: [
							new Filter({ path: "IsActiveEntity", operator: FilterOperator.EQ, value1: false }),
							new Filter({
								path: "SiblingEntity/IsActiveEntity",
								operator: FilterOperator.EQ,
								value1: null
							})
						],
						and: false
					});
			}
		}

		FilterOperatorUtil.addOperator(
			new Operator({
				name: "DRAFT_EDIT_STATE",
				valueTypes: ["self"],
				tokenParse: "^(.*)$",
				format: function(vValue) {
					return vValue && vValue.values[1];
				},
				getModelFilter: function(oCondition, sFieldPath) {
					return getFilterForEditState(oCondition.values[0]);
				},
				parse: function(parm) {
					return parm;
				},
				validateInput: true,
				checkValidated: function(oCondition) {
					// This ensures that the listfieldhelp is also called for old variants saved with Validated parameter as undefined.
					oCondition.validated = ConditionValidated.Validated;
				}
			})
		);

		EDITSTATE.getEditStatesContext = function() {
			return new JSONModel([EDITSTATE.ALL, EDITSTATE.UNCHANGED, EDITSTATE.OWN_DRAFT, EDITSTATE.LOCKED, EDITSTATE.UNSAVED_CHANGES])
				.bindContext("/")
				.getBoundContext();
		};

		EDITSTATE.getFilterForEditState = getFilterForEditState;

		return EDITSTATE;
	},
	true
);
