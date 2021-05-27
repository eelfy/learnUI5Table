/* eslint-disable consistent-return */
/* global QUnit sinon */
sap.ui.define(
	["sap/ui/model/json/JSONModel", "sap/ui/core/Control", "sap/fe/macros/table/TableRuntime", "sap/fe/core/helpers/ModelHelper"],
	function(JSONModel, Control, TableRuntime, ModelHelper) {
		"use strict";
		var sandbox = sinon.sandbox.create();
		QUnit.module("Unit Test for setContexts");
		QUnit.test("Unit test to check setContexts ", function(assert) {
			[
				// Test Number 1
				{
					aSelectedContexts: [
						{
							getObject: function() {
								return {
									HasDraftEntity: false,
									"#ActionPath": "Sunday Light Apricot"
								};
							},
							getProperty: function(sProperty) {
								return false;
							}
						},
						{
							getObject: function() {
								return {
									HasDraftEntity: true,
									IsActiveEntity: true,
									DraftAdministrativeData: {
										InProcessByUser: false
									},
									Name: "Red Paprica"
								};
							},
							getProperty: function(sProperty) {
								return true;
							}
						},
						{
							getObject: function() {
								return {
									HasDraftEntity: true,
									IsActiveEntity: true,
									DraftAdministrativeData: {
										InProcessByUser: true
									},
									Name: "Blue Jok"
								};
							},
							getProperty: function(sProperty) {
								return true;
							}
						},
						{
							getObject: function() {
								return {
									HasDraftEntity: true,
									IsActiveEntity: false,
									DraftAdministrativeData: {
										InProcessByUser: true
									},
									Name: "Pink Tie"
								};
							},
							getProperty: function(sProperty) {
								return true;
							}
						}
					],
					sDeletablePath: "HasDraftEntity",
					oDraft: "DraftRoot",
					sCollection: "{}",
					sMessage: "with multiple selected contexts, model name, action path and deletable path as property name",
					bExpectedValue: {
						selectedContexts: [
							{
								getObject: function() {
									return {
										HasDraftEntity: false,
										"#ActionPath": "Sunday Light Apricot"
									};
								},
								getProperty: function(sProperty) {
									return false;
								}
							},
							{
								getObject: function() {
									return {
										HasDraftEntity: true,
										IsActiveEntity: true,
										DraftAdministrativeData: {
											InProcessByUser: false
										},
										Name: "Red Paprica"
									};
								},
								getProperty: function(sProperty) {
									return true;
								}
							},
							{
								getObject: function() {
									return {
										HasDraftEntity: true,
										IsActiveEntity: true,
										DraftAdministrativeData: {
											InProcessByUser: true
										},
										Name: "Blue Jok"
									};
								},
								getProperty: function(sProperty) {
									return true;
								}
							},
							{
								getObject: function() {
									return {
										HasDraftEntity: true,
										IsActiveEntity: false,
										DraftAdministrativeData: {
											InProcessByUser: true
										},
										Name: "Pink Tie"
									};
								},
								getProperty: function(sProperty) {
									return true;
								}
							}
						],
						numberOfSelectedContexts: 4,
						dynamicActions: {
							"ActionPath": { enabled: true }
						},
						ibn: {},
						deleteEnabled: true,
						deletableContexts: [
							{
								getObject: function() {
									return {
										HasDraftEntity: true,
										IsActiveEntity: false,
										DraftAdministrativeData: {
											InProcessByUser: true
										},
										Name: "Pink Tie"
									};
								},
								getProperty: function(sProperty) {
									return true;
								}
							}
						],
						unSavedContexts: [
							{
								getObject: function() {
									return {
										HasDraftEntity: true,
										IsActiveEntity: true,
										DraftAdministrativeData: {
											InProcessByUser: false
										},
										Name: "Red Paprica"
									};
								},
								getProperty: function(sProperty) {
									return true;
								}
							}
						],
						lockedContexts: [
							{
								getObject: function() {
									return {
										HasDraftEntity: true,
										IsActiveEntity: true,
										DraftAdministrativeData: {
											InProcessByUser: true
										},
										Name: "Blue Jok"
									};
								},
								getProperty: function(sProperty) {
									return true;
								}
							}
						]
					}
				},
				// Test Number 2
				{
					aSelectedContexts: [
						{
							getObject: function() {
								return {
									HasDraftEntity: false,
									"#ActionPath": "Sunday Light Apricot"
								};
							},
							getProperty: function(sProperty) {
								return false;
							}
						},
						{
							getObject: function() {
								return {
									HasDraftEntity: true,
									IsActiveEntity: true,
									DraftAdministrativeData: {
										InProcessByUser: false
									},
									Name: "Red Paprica"
								};
							},
							getProperty: function(sProperty) {
								return true;
							}
						},
						{
							getObject: function() {
								return {
									HasDraftEntity: true,
									IsActiveEntity: true,
									DraftAdministrativeData: {
										InProcessByUser: true
									},
									Name: "Blue Jok"
								};
							},
							getProperty: function(sProperty) {
								return true;
							}
						}
					],
					sPrefix: "template::Artists::Table",
					sDeletablePath: "undefined",
					oDraft: "Draft",
					sCollection: "{}",
					sMessage: "without model name and with deletable path as undefined",
					bExpectedValue: {
						selectedContexts: [
							{
								getObject: function() {
									return {
										HasDraftEntity: false,
										"#ActionPath": "Sunday Light Apricot"
									};
								},
								getProperty: function(sProperty) {
									return false;
								}
							},
							{
								getObject: function() {
									return {
										HasDraftEntity: true,
										IsActiveEntity: true,
										DraftAdministrativeData: {
											InProcessByUser: false
										},
										Name: "Red Paprica"
									};
								},
								getProperty: function(sProperty) {
									return true;
								}
							},
							{
								getObject: function() {
									return {
										HasDraftEntity: true,
										IsActiveEntity: true,
										DraftAdministrativeData: {
											InProcessByUser: true
										},
										Name: "Blue Jok"
									};
								},
								getProperty: function(sProperty) {
									return true;
								}
							}
						],
						numberOfSelectedContexts: 3,
						dynamicActions: {
							"ActionPath": { enabled: true }
						},
						ibn: {},
						deleteEnabled: true,
						deletableContexts: [
							{
								getObject: function() {
									return {
										HasDraftEntity: false,
										Name: "Sunday Light Apricot"
									};
								},
								getProperty: function(sProperty) {
									return false;
								}
							}
						],
						unSavedContexts: [
							{
								getObject: function() {
									return {
										HasDraftEntity: true,
										IsActiveEntity: true,
										DraftAdministrativeData: {
											InProcessByUser: false
										},
										Name: "Red Paprica"
									};
								},
								getProperty: function(sProperty) {
									return true;
								}
							}
						],
						lockedContexts: [
							{
								getObject: function() {
									return {
										HasDraftEntity: true,
										IsActiveEntity: true,
										DraftAdministrativeData: {
											InProcessByUser: true
										},
										Name: "Blue Jok"
									};
								},
								getProperty: function(sProperty) {
									return true;
								}
							}
						]
					}
				},
				// Test Number 3
				{
					aSelectedContexts: [
						{
							getObject: function() {
								var oResponse = {
									HasDraftEntity: false,
									SetBillingBlockIsHidden: false,
									"#com.c_salesordermanage_sd.ChangeOrderStatus": "Sunday Light Apricot"
								};
								if (arguments.length) {
									return oResponse[arguments[0]];
								}
								return oResponse;
							},
							getProperty: function(sProperty) {
								return false;
							}
						},
						{
							getObject: function() {
								var oResponse = {
									HasDraftEntity: true,
									SetBillingBlockIsHidden: true,
									IsActiveEntity: true,
									DraftAdministrativeData: {
										InProcessByUser: false
									},
									Name: "Red Paprica"
								};
								if (arguments.length) {
									return oResponse[arguments[0]];
								}
								return oResponse;
							},
							getProperty: function(sProperty) {
								return true;
							}
						}
					],
					sPrefix: "template::SalesOrderManage::Table",
					sDeletablePath: "HasDraftEntity",
					oDraft: "DraftRoot",
					sCollection: '{"com.c_salesordermanage_sd.ChangeOrderStatus":"SetBillingBlockIsHidden"}',
					sMessage: "with two selected contexts and one has OperationAvailable path based value true",
					bExpectedValue: {
						selectedContexts: [
							{
								getObject: function() {
									return {
										HasDraftEntity: false,
										SetBillingBlockIsHidden: false,
										"#ActionPath": "com.c_salesordermanage_sd.ChangeOrderStatus"
									};
								},
								getProperty: function(sProperty) {
									return false;
								}
							},
							{
								getObject: function() {
									return {
										HasDraftEntity: true,
										SetBillingBlockIsHidden: true,
										IsActiveEntity: true,
										DraftAdministrativeData: {
											InProcessByUser: false
										},
										Name: "Red Paprica"
									};
								},
								getProperty: function(sProperty) {
									return true;
								}
							}
						],
						numberOfSelectedContexts: 2,
						dynamicActions: {
							"com.c_salesordermanage_sd.ChangeOrderStatus": {
								bEnabled: true,
								aApplicable: [
									{
										getObject: function() {
											return {
												HasDraftEntity: true,
												SetBillingBlockIsHidden: true,
												IsActiveEntity: true,
												DraftAdministrativeData: {
													InProcessByUser: false
												},
												Name: "Red Paprica"
											};
										},
										getProperty: function(sProperty) {
											return true;
										}
									}
								],
								aNotApplicable: [
									{
										getObject: function() {
											var oResponse = {
												HasDraftEntity: false,
												SetBillingBlockIsHidden: false,
												"#ActionPath": "Sunday Light Apricot"
											};
											if (arguments.length) {
												return oResponse[arguments[0]];
											}
											return oResponse;
										},
										getProperty: function(sProperty) {
											return false;
										}
									}
								]
							}
						},
						ibn: {},
						deleteEnabled: true,
						deletableContexts: [],
						unSavedContexts: [{}],
						lockedContexts: []
					}
				},
				// Test Number 4
				{
					aSelectedContexts: [
						{
							getObject: function() {
								var oResponse = {
									HasDraftEntity: false,
									SetBillingBlockIsHidden: false,
									"#com.c_salesordermanage_sd.ChangeOrderStatus": "Sunday Light Apricot"
								};
								if (arguments.length) {
									return oResponse[arguments[0]];
								}
								return oResponse;
							},
							getProperty: function(sProperty) {
								return false;
							}
						},
						{
							getObject: function() {
								var oResponse = {
									HasDraftEntity: true,
									SetBillingBlockIsHidden: false,
									IsActiveEntity: true,
									DraftAdministrativeData: {
										InProcessByUser: false
									},
									Name: "Red Paprica"
								};
								if (arguments.length) {
									return oResponse[arguments[0]];
								}
								return oResponse;
							},
							getProperty: function(sProperty) {
								return true;
							}
						}
					],
					sPrefix: "template::SalesOrderManage::Table",
					sDeletablePath: "HasDraftEntity",
					oDraft: "DraftRoot",
					sCollection: '{"com.c_salesordermanage_sd.ChangeOrderStatus":"SetBillingBlockIsHidden"}',
					sMessage: "with two selected contexts and none has OperationAvailable path based value true",
					bExpectedValue: {
						selectedContexts: [
							{
								getObject: function() {
									return {
										HasDraftEntity: false,
										SetBillingBlockIsHidden: false,
										"#com.c_salesordermanage_sd.ChangeOrderStatus": "Sunday Light Apricot"
									};
								},
								getProperty: function(sProperty) {
									return false;
								}
							},
							{
								getObject: function() {
									return {
										HasDraftEntity: true,
										SetBillingBlockIsHidden: true,
										IsActiveEntity: true,
										DraftAdministrativeData: {
											InProcessByUser: false
										},
										Name: "Red Paprica"
									};
								},
								getProperty: function(sProperty) {
									return true;
								}
							}
						],
						numberOfSelectedContexts: 2,
						dynamicActions: {
							"com.c_salesordermanage_sd.ChangeOrderStatus": {
								bEnabled: false,
								aApplicable: [],
								aNotApplicable: [
									{
										getObject: function() {
											var oResponse = {
												HasDraftEntity: false,
												SetBillingBlockIsHidden: false,
												"#ActionPath": "Sunday Light Apricot"
											};
											if (arguments.length) {
												return oResponse[arguments[0]];
											}
											return oResponse;
										},
										getProperty: function(sProperty) {
											return false;
										}
									},
									{
										getObject: function() {
											return {
												HasDraftEntity: true,
												SetBillingBlockIsHidden: true,
												IsActiveEntity: true,
												DraftAdministrativeData: {
													InProcessByUser: false
												},
												Name: "Red Paprica"
											};
										},
										getProperty: function(sProperty) {
											return true;
										}
									}
								]
							}
						},
						ibn: {},
						deleteEnabled: true,
						deletableContexts: [],
						unSavedContexts: [{}],
						lockedContexts: []
					}
				},
				// Test Number 5
				{
					aSelectedContexts: [
						{
							getObject: function() {
								return {
									HasDraftEntity: false,
									SetBillingBlockIsHidden: false,
									"#com.c_salesordermanage_sd.ChangeOrderStatus": {}
								};
							},
							getProperty: function(sProperty) {
								return false;
							}
						},
						{
							getObject: function() {
								return {
									HasDraftEntity: true,
									SetBillingBlockIsHidden: true,
									IsActiveEntity: true,
									DraftAdministrativeData: {
										InProcessByUser: false
									},
									Name: "Red Paprica"
								};
							},
							getProperty: function(sProperty) {
								return true;
							}
						}
					],
					sPrefix: "template::SalesOrderManage::Table",
					sDeletablePath: "HasDraftEntity",
					oDraft: "DraftRoot",
					sCollection: '{"com.c_salesordermanage_sd.ChangeOrderStatus":null}',
					sMessage: "with two selected contexts and one has action advertisement when OperationAvailable is static null",
					bExpectedValue: {
						selectedContexts: [
							{
								getObject: function() {
									return {
										HasDraftEntity: false,
										SetBillingBlockIsHidden: false,
										"#com.c_salesordermanage_sd.ChangeOrderStatus": {}
									};
								},
								getProperty: function(sProperty) {
									return false;
								}
							},
							{
								getObject: function() {
									return {
										HasDraftEntity: true,
										SetBillingBlockIsHidden: true,
										IsActiveEntity: true,
										DraftAdministrativeData: {
											InProcessByUser: false
										},
										Name: "Red Paprica"
									};
								},
								getProperty: function(sProperty) {
									return true;
								}
							}
						],
						numberOfSelectedContexts: 2,
						dynamicActions: {
							"com.c_salesordermanage_sd.ChangeOrderStatus": { bEnabled: true, aApplicable: [], aNotApplicable: [] }
						},
						ibn: {},
						deleteEnabled: true,
						deletableContexts: [],
						unSavedContexts: [{}],
						lockedContexts: []
					}
				},
				// Test Number 6
				{
					aSelectedContexts: [
						{
							getObject: function() {
								var oResponse = {
									HasDraftEntity: false,
									SetBillingBlockIsHidden: false
								};
								if (arguments.length) {
									return oResponse[arguments[0]];
								}
								return oResponse;
							},
							getProperty: function(sProperty) {
								return false;
							}
						},
						{
							getObject: function() {
								var oResponse = {
									HasDraftEntity: true,
									SetBillingBlockIsHidden: true,
									IsActiveEntity: true,
									DraftAdministrativeData: {
										InProcessByUser: false
									},
									Name: "Red Paprica"
								};
								if (arguments.length) {
									return oResponse[arguments[0]];
								}
								return oResponse;
							},
							getProperty: function(sProperty) {
								return true;
							}
						}
					],
					sPrefix: "template::SalesOrderManage::Table",
					sDeletablePath: "HasDraftEntity",
					oDraft: "DraftRoot",
					sCollection: '{"com.c_salesordermanage_sd.ChangeOrderStatus":null}',
					sMessage: "with two selected contexts and none has action advertisement when OperationAvailable is static null",
					bExpectedValue: {
						selectedContexts: [
							{
								getObject: function() {
									return {
										HasDraftEntity: false,
										SetBillingBlockIsHidden: false
									};
								},
								getProperty: function(sProperty) {
									return false;
								}
							},
							{
								getObject: function() {
									return {
										HasDraftEntity: true,
										SetBillingBlockIsHidden: true,
										IsActiveEntity: true,
										DraftAdministrativeData: {
											InProcessByUser: false
										},
										Name: "Red Paprica"
									};
								},
								getProperty: function(sProperty) {
									return true;
								}
							}
						],
						numberOfSelectedContexts: 2,
						dynamicActions: {
							"com.c_salesordermanage_sd.ChangeOrderStatus": {
								bEnabled: false,
								aApplicable: [],
								aNotApplicable: [
									{
										getObject: function() {
											var oResponse = {
												HasDraftEntity: false,
												SetBillingBlockIsHidden: false
											};
											if (arguments.length) {
												return oResponse[arguments[0]];
											}
											return oResponse;
										},
										getProperty: function(sProperty) {
											return false;
										}
									},
									{
										getObject: function() {
											var oResponse = {
												HasDraftEntity: true,
												SetBillingBlockIsHidden: true,
												IsActiveEntity: true,
												DraftAdministrativeData: {
													InProcessByUser: false
												},
												Name: "Red Paprica"
											};
											if (arguments.length) {
												return oResponse[arguments[0]];
											}
											return oResponse;
										},
										getProperty: function(sProperty) {
											return true;
										}
									}
								]
							}
						},
						ibn: {},
						deleteEnabled: true,
						deletableContexts: [],
						unSavedContexts: [{}],
						lockedContexts: []
					}
				}
			].forEach(function(oProperty) {
				var oTable = new Control();

				var oStub = sandbox.stub(oTable, "getModel");
				var uiModel = new JSONModel({
					control: oProperty
				});

				ModelHelper.enhanceInternalJSONModel(uiModel);

				oTable.setModel(uiModel, "internal");
				oStub.withArgs("internal").returns(uiModel);
				oTable.bindElement({
					path: "/control",
					model: "internal"
				});

				oTable.getSelectedContexts = function() {
					return oProperty.aSelectedContexts;
				};
				TableRuntime.setContexts(oTable, oProperty.sDeletablePath, oProperty.oDraft, oProperty.sCollection);
				var actualValue = oTable.getBindingContext("internal").getObject();
				delete actualValue.controlId;
				assert.deepEqual(
					JSON.stringify(actualValue),
					JSON.stringify(oProperty.bExpectedValue),
					"Unit test to check setContexts " + oProperty.sMessage + ": ok"
				);
				oTable.destroy();
				oTable.invalidate();
				oStub.restore();
			});
		});
	}
);
