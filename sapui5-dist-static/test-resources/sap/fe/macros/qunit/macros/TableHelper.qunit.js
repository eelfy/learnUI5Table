/* eslint-disable consistent-return */
/* global QUnit */
sap.ui.define(["sap/fe/macros/table/TableHelper"], function(TableHelper) {
	"use strict";
	QUnit.module("Unit Test for create$Select");

	QUnit.test("Unit test to check create$Select ", function(assert) {
		[
			{
				oCollection: {
					"@Org.OData.Capabilities.V1.DeleteRestrictions": {
						Deletable: {
							$Path: "HasDraftEntity"
						}
					}
				},
				bExpectedValue: ", $select: 'HasDraftEntity'",
				sMessage: "with DeleteRestrictions Path"
			},
			{
				oCollection: {
					"@Org.OData.Capabilities.V1.DeleteRestrictions": {
						Deletable: {
							Bool: "true"
						}
					}
				},
				bExpectedValue: "",
				sMessage: "with DeleteRestrictions Bool"
			},
			{
				oCollection: {},
				bExpectedValue: "",
				sMessage: "without DeleteRestrictions"
			}
		].forEach(function(oProperty) {
			var actualValue = TableHelper.create$Select(oProperty.oCollection, "", "", undefined, "@com.sap.vocabularies.UI.v1.LineItem");
			assert.equal(actualValue, oProperty.bExpectedValue, "Unit test to check create$Select " + oProperty.sMessage + ": ok");
		});
	});

	QUnit.test("Unit test to check create$Select for table with OperationAvailable fields", function(assert) {
		[
			{
				oCollection: {
					"@Org.OData.Capabilities.V1.NavigationRestrictions": {
						$Type: "Org.OData.Capabilities.V1.NavigationRestrictionsType"
					},
					RestrictedProperties: [
						{
							$Type: "Org.OData.Capabilities.V1.NavigationPropertyRestriction",
							InsertRestrictions: {
								$Type: "Org.OData.Capabilities.V1.InsertRestrictionsType",
								Insertable: true
							},
							NavigationProperty: {
								$NavigationPropertyPath: "_Item"
							}
						}
					],
					"@com.sap.vocabularies.Common.v1.DraftRoot:": {
						$Type: "com.sap.vocabularies.Common.v1.DraftRootType",
						ActivationAction: "com.c_salesordermanage_sd.draftActivate",
						EditAction: "com.c_salesordermanage_sd.draftEdit",
						PreparationAction: "com.c_salesordermanage_sd.draftPrepare"
					}
				},
				sOperationAvailableFields: "",
				sMessage: "with no OperationAvailable fields",
				sExpectedValue: ""
			},
			{
				oCollection: {
					"@Org.OData.Capabilities.V1.NavigationRestrictions": {
						$Type: "Org.OData.Capabilities.V1.NavigationRestrictionsType"
					},
					RestrictedProperties: [
						{
							$Type: "Org.OData.Capabilities.V1.NavigationPropertyRestriction",
							InsertRestrictions: {
								$Type: "Org.OData.Capabilities.V1.InsertRestrictionsType",
								Insertable: true
							},
							NavigationProperty: {
								$NavigationPropertyPath: "_Item"
							}
						}
					],
					"@com.sap.vocabularies.Common.v1.DraftRoot:": {
						$Type: "com.sap.vocabularies.Common.v1.DraftRootType",
						ActivationAction: "com.c_salesordermanage_sd.draftActivate",
						EditAction: "com.c_salesordermanage_sd.draftEdit",
						PreparationAction: "com.c_salesordermanage_sd.draftPrepare"
					}
				},
				sOperationAvailableFields: "SetBillingBlockIsHidden",
				sMessage: "with one OperationAvailable field",
				sExpectedValue: ", $select: 'SetBillingBlockIsHidden'"
			},
			{
				oCollection: {
					"@Org.OData.Capabilities.V1.NavigationRestrictions": {
						$Type: "Org.OData.Capabilities.V1.NavigationRestrictionsType"
					},
					RestrictedProperties: [
						{
							$Type: "Org.OData.Capabilities.V1.NavigationPropertyRestriction",
							InsertRestrictions: {
								$Type: "Org.OData.Capabilities.V1.InsertRestrictionsType",
								Insertable: true
							},
							NavigationProperty: {
								$NavigationPropertyPath: "_Item"
							}
						}
					],
					"@com.sap.vocabularies.Common.v1.DraftRoot:": {
						$Type: "com.sap.vocabularies.Common.v1.DraftRootType",
						ActivationAction: "com.c_salesordermanage_sd.draftActivate",
						EditAction: "com.c_salesordermanage_sd.draftEdit",
						PreparationAction: "com.c_salesordermanage_sd.draftPrepare"
					}
				},
				sOperationAvailableFields: "SetBillingBlockIsHidden,OverallSDProcessStatus",
				sMessage: "with two OperationAvailable fields",
				sExpectedValue: ", $select: 'SetBillingBlockIsHidden,OverallSDProcessStatus'"
			}
		].forEach(function(oProperty) {
			var actualValue = TableHelper.create$Select(
				oProperty.oCollection,
				oProperty.sOperationAvailableFields,
				"",
				undefined,
				"@com.sap.vocabularies.UI.v1.LineItem"
			);
			assert.equal(
				actualValue,
				oProperty.sExpectedValue,
				"Unit test to check create$Select to return string " + oProperty.sMessage + ": ok"
			);
		});
	});

	QUnit.test("Unit test to check create$Select for table with NavigationAvailable fields", function(assert) {
		[
			{
				oCollection: {
					"@Org.OData.Capabilities.V1.NavigationRestrictions": {
						$Type: "Org.OData.Capabilities.V1.NavigationRestrictionsType"
					},
					RestrictedProperties: [
						{
							$Type: "Org.OData.Capabilities.V1.NavigationPropertyRestriction",
							InsertRestrictions: {
								$Type: "Org.OData.Capabilities.V1.InsertRestrictionsType",
								Insertable: true
							},
							NavigationProperty: {
								$NavigationPropertyPath: "_Item"
							}
						}
					],
					"@com.sap.vocabularies.Common.v1.DraftRoot:": {
						$Type: "com.sap.vocabularies.Common.v1.DraftRootType",
						ActivationAction: "com.c_salesordermanage_sd.draftActivate",
						EditAction: "com.c_salesordermanage_sd.draftEdit",
						PreparationAction: "com.c_salesordermanage_sd.draftPrepare"
					}
				},
				sNavigationAvailableFields: "",
				sMessage: "with no NavigationAvailable fields",
				sExpectedValue: ""
			},
			{
				oCollection: {
					"@Org.OData.Capabilities.V1.NavigationRestrictions": {
						$Type: "Org.OData.Capabilities.V1.NavigationRestrictionsType"
					},
					RestrictedProperties: [
						{
							$Type: "Org.OData.Capabilities.V1.NavigationPropertyRestriction",
							InsertRestrictions: {
								$Type: "Org.OData.Capabilities.V1.InsertRestrictionsType",
								Insertable: true
							},
							NavigationProperty: {
								$NavigationPropertyPath: "_Item"
							}
						}
					],
					"@com.sap.vocabularies.Common.v1.DraftRoot:": {
						$Type: "com.sap.vocabularies.Common.v1.DraftRootType",
						ActivationAction: "com.c_salesordermanage_sd.draftActivate",
						EditAction: "com.c_salesordermanage_sd.draftEdit",
						PreparationAction: "com.c_salesordermanage_sd.draftPrepare"
					}
				},
				sNavigationAvailableFields: "Delivered",
				sMessage: "with one NavigationAvailable field",
				sExpectedValue: ", $select: 'Delivered'"
			},
			{
				oCollection: {
					"@Org.OData.Capabilities.V1.NavigationRestrictions": {
						$Type: "Org.OData.Capabilities.V1.NavigationRestrictionsType"
					},
					RestrictedProperties: [
						{
							$Type: "Org.OData.Capabilities.V1.NavigationPropertyRestriction",
							InsertRestrictions: {
								$Type: "Org.OData.Capabilities.V1.InsertRestrictionsType",
								Insertable: true
							},
							NavigationProperty: {
								$NavigationPropertyPath: "_Item"
							}
						}
					],
					"@com.sap.vocabularies.Common.v1.DraftRoot:": {
						$Type: "com.sap.vocabularies.Common.v1.DraftRootType",
						ActivationAction: "com.c_salesordermanage_sd.draftActivate",
						EditAction: "com.c_salesordermanage_sd.draftEdit",
						PreparationAction: "com.c_salesordermanage_sd.draftPrepare"
					}
				},
				sNavigationAvailableFields: "Delivered,_Partner/isVerified",
				sMessage: "with two NavigationAvailable fields",
				sExpectedValue: ", $select: 'Delivered,_Partner/isVerified'"
			},
			{
				oCollection: {
					"@Org.OData.Capabilities.V1.NavigationRestrictions": {
						$Type: "Org.OData.Capabilities.V1.NavigationRestrictionsType"
					},
					RestrictedProperties: [
						{
							$Type: "Org.OData.Capabilities.V1.NavigationPropertyRestriction",
							InsertRestrictions: {
								$Type: "Org.OData.Capabilities.V1.InsertRestrictionsType",
								Insertable: true
							},
							NavigationProperty: {
								$NavigationPropertyPath: "_Item"
							}
						}
					],
					"@com.sap.vocabularies.Common.v1.DraftRoot:": {
						$Type: "com.sap.vocabularies.Common.v1.DraftRootType",
						ActivationAction: "com.c_salesordermanage_sd.draftActivate",
						EditAction: "com.c_salesordermanage_sd.draftEdit",
						PreparationAction: "com.c_salesordermanage_sd.draftPrepare"
					}
				},
				sOperationAvailableFields: "SetBillingBlockIsHidden",
				sNavigationAvailableFields: "Delivered",
				sMessage: "with both NavigationAvailable fields and operationAvailable fields",
				sExpectedValue: ", $select: 'SetBillingBlockIsHidden,Delivered'"
			},
			{
				oCollection: {
					"@Org.OData.Capabilities.V1.NavigationRestrictions": {
						$Type: "Org.OData.Capabilities.V1.NavigationRestrictionsType"
					},
					RestrictedProperties: [
						{
							$Type: "Org.OData.Capabilities.V1.NavigationPropertyRestriction",
							InsertRestrictions: {
								$Type: "Org.OData.Capabilities.V1.InsertRestrictionsType",
								Insertable: true
							},
							NavigationProperty: {
								$NavigationPropertyPath: "_Item"
							}
						}
					],
					"@com.sap.vocabularies.Common.v1.DraftRoot:": {
						$Type: "com.sap.vocabularies.Common.v1.DraftRootType",
						ActivationAction: "com.c_salesordermanage_sd.draftActivate",
						EditAction: "com.c_salesordermanage_sd.draftEdit",
						PreparationAction: "com.c_salesordermanage_sd.draftPrepare"
					}
				},
				oPresentationVariant: {
					$Type: "com.sap.vocabularies.UI.v1.PresentationVariantType",
					SortOrder: [
						{
							$Type: "com.sap.vocabularies.Common.v1.SortOrderType",
							Property: {
								$PropertyPath: "ID"
							},
							Descending: true
						}
					],
					RequestAtLeast: [
						{
							$PropertyPath: "SalesOrder"
						}
					],
					Visualizations: [
						{
							$AnnotationPath: "@com.sap.vocabularies.UI.v1.LineItem"
						}
					]
				},
				sOperationAvailableFields: "SetBillingBlockIsHidden",
				aSemanticKeys: [
					{
						$PropertyPath: "materialdetail/owner_ID"
					}
				],
				sNavigationAvailableFields: "Delivered",
				sMessage: "with NavigationAvailable fields and operationAvailable fields and presentation variant and semantic keys",
				sExpectedValue: ", $select: 'SetBillingBlockIsHidden,Delivered,SalesOrder,materialdetail/owner_ID'"
			}
		].forEach(function(oProperty) {
			var actualValue = TableHelper.create$Select(
				oProperty.oCollection,
				oProperty.sOperationAvailableFields,
				oProperty.sNavigationAvailableFields,
				oProperty.oPresentationVariant,
				"@com.sap.vocabularies.UI.v1.PresentationVariant",
				oProperty.aSemanticKeys
			);
			assert.equal(
				actualValue,
				oProperty.sExpectedValue,
				"Unit test to check create$Select to return string " + oProperty.sMessage + ": ok"
			);
		});
	});

	QUnit.test("Unit test to check create$Select for table with Presentation Variant and Semantic Keys", function(assert) {
		[
			{
				oCollection: {
					"@Org.OData.Capabilities.V1.NavigationRestrictions": {
						$Type: "Org.OData.Capabilities.V1.NavigationRestrictionsType"
					},
					RestrictedProperties: [
						{
							$Type: "Org.OData.Capabilities.V1.NavigationPropertyRestriction",
							InsertRestrictions: {
								$Type: "Org.OData.Capabilities.V1.InsertRestrictionsType",
								Insertable: true
							},
							NavigationProperty: {
								$NavigationPropertyPath: "_Item"
							}
						}
					],
					"@com.sap.vocabularies.Common.v1.DraftRoot:": {
						$Type: "com.sap.vocabularies.Common.v1.DraftRootType",
						ActivationAction: "com.c_salesordermanage_sd.draftActivate",
						EditAction: "com.c_salesordermanage_sd.draftEdit",
						PreparationAction: "com.c_salesordermanage_sd.draftPrepare"
					}
				},
				sOperationAvailableFields: "",
				oPresentationVariant: undefined,
				aSemanticKeys: [
					{
						$PropertyPath: "SalesOrder"
					}
				],
				sMessage: "with no OperationAvailable fields, no PresentationVariantType RequestAtLeast and semantic keys",
				sExpectedValue: ", $select: 'SalesOrder'"
			},
			{
				oCollection: {
					"@Org.OData.Capabilities.V1.NavigationRestrictions": {
						$Type: "Org.OData.Capabilities.V1.NavigationRestrictionsType"
					},
					RestrictedProperties: [
						{
							$Type: "Org.OData.Capabilities.V1.NavigationPropertyRestriction",
							InsertRestrictions: {
								$Type: "Org.OData.Capabilities.V1.InsertRestrictionsType",
								Insertable: true
							},
							NavigationProperty: {
								$NavigationPropertyPath: "_Item"
							}
						}
					],
					"@com.sap.vocabularies.Common.v1.DraftRoot:": {
						$Type: "com.sap.vocabularies.Common.v1.DraftRootType",
						ActivationAction: "com.c_salesordermanage_sd.draftActivate",
						EditAction: "com.c_salesordermanage_sd.draftEdit",
						PreparationAction: "com.c_salesordermanage_sd.draftPrepare"
					}
				},
				oPresentationVariant: {
					$Type: "com.sap.vocabularies.UI.v1.PresentationVariantType",
					SortOrder: [
						{
							$Type: "com.sap.vocabularies.Common.v1.SortOrderType",
							Property: {
								$PropertyPath: "ID"
							},
							Descending: true
						}
					],
					RequestAtLeast: [
						{
							$PropertyPath: "SalesOrder"
						}
					],
					Visualizations: [
						{
							$AnnotationPath: "@com.sap.vocabularies.UI.v1.LineItem"
						}
					]
				},
				sOperationAvailableFields: "SetBillingBlockIsHidden",
				aSemanticKeys: [
					{
						$PropertyPath: "materialdetail.owner_ID"
					}
				],
				sMessage: "with OperationAvailable field, one Presentation Variant and semantic keys",
				sExpectedValue: ", $select: 'SetBillingBlockIsHidden,SalesOrder,materialdetail.owner_ID'"
			},
			{
				oCollection: {
					"@Org.OData.Capabilities.V1.NavigationRestrictions": {
						$Type: "Org.OData.Capabilities.V1.NavigationRestrictionsType"
					},
					RestrictedProperties: [
						{
							$Type: "Org.OData.Capabilities.V1.NavigationPropertyRestriction",
							InsertRestrictions: {
								$Type: "Org.OData.Capabilities.V1.InsertRestrictionsType",
								Insertable: true
							},
							NavigationProperty: {
								$NavigationPropertyPath: "_Item"
							}
						}
					],
					"@com.sap.vocabularies.Common.v1.DraftRoot:": {
						$Type: "com.sap.vocabularies.Common.v1.DraftRootType",
						ActivationAction: "com.c_salesordermanage_sd.draftActivate",
						EditAction: "com.c_salesordermanage_sd.draftEdit",
						PreparationAction: "com.c_salesordermanage_sd.draftPrepare"
					}
				},
				oPresentationVariant: {
					$Type: "com.sap.vocabularies.UI.v1.PresentationVariantType",
					SortOrder: [
						{
							$Type: "com.sap.vocabularies.Common.v1.SortOrderType",
							Property: {
								$PropertyPath: "ID"
							},
							Descending: true
						}
					],
					RequestAtLeast: [
						{
							$PropertyPath: "SalesOrder"
						}
					],
					Visualizations: [
						{
							$AnnotationPath: "@com.sap.vocabularies.UI.v1.LineItem"
						}
					]
				},
				sOperationAvailableFields: "",
				aSemanticKeys: [
					{
						$PropertyPath: "owner/SalesOrder"
					}
				],
				sMessage: "with no OperationAvailable field, one Presentation Variant and semantic keys",
				sExpectedValue: ", $select: 'SalesOrder,owner/SalesOrder'"
			},
			{
				oCollection: {
					"@Org.OData.Capabilities.V1.NavigationRestrictions": {
						$Type: "Org.OData.Capabilities.V1.NavigationRestrictionsType"
					},
					RestrictedProperties: [
						{
							$Type: "Org.OData.Capabilities.V1.NavigationPropertyRestriction",
							InsertRestrictions: {
								$Type: "Org.OData.Capabilities.V1.InsertRestrictionsType",
								Insertable: true
							},
							NavigationProperty: {
								$NavigationPropertyPath: "_Item"
							}
						}
					],
					"@com.sap.vocabularies.Common.v1.DraftRoot:": {
						$Type: "com.sap.vocabularies.Common.v1.DraftRootType",
						ActivationAction: "com.c_salesordermanage_sd.draftActivate",
						EditAction: "com.c_salesordermanage_sd.draftEdit",
						PreparationAction: "com.c_salesordermanage_sd.draftPrepare"
					}
				},
				oPresentationVariant: {
					$Type: "com.sap.vocabularies.UI.v1.PresentationVariantType",
					SortOrder: [
						{
							$Type: "com.sap.vocabularies.Common.v1.SortOrderType",
							Property: {
								$PropertyPath: "ID"
							},
							Descending: true
						}
					],
					RequestAtLeast: [
						{
							$PropertyPath: "SalesOrder"
						},
						{
							$PropertyPath: "SoldToParty"
						}
					],
					Visualizations: [
						{
							$AnnotationPath: "@com.sap.vocabularies.UI.v1.LineItem"
						}
					]
				},
				sOperationAvailableFields: "SetBillingBlockIsHidden",
				aSemanticKeys: [
					{
						$PropertyPath: "materialdetail.FabricationCountry"
					}
				],
				sMessage: "with OperationAvailable field, multiple Presentation Variant RequestAtLeast and semantic keys",
				sExpectedValue: ", $select: 'SetBillingBlockIsHidden,SalesOrder,SoldToParty,materialdetail.FabricationCountry'"
			},
			{
				oCollection: {
					"@Org.OData.Capabilities.V1.NavigationRestrictions": {
						$Type: "Org.OData.Capabilities.V1.NavigationRestrictionsType"
					},
					RestrictedProperties: [
						{
							$Type: "Org.OData.Capabilities.V1.NavigationPropertyRestriction",
							InsertRestrictions: {
								$Type: "Org.OData.Capabilities.V1.InsertRestrictionsType",
								Insertable: true
							},
							NavigationProperty: {
								$NavigationPropertyPath: "_Item"
							}
						}
					],
					"@com.sap.vocabularies.Common.v1.DraftRoot:": {
						$Type: "com.sap.vocabularies.Common.v1.DraftRootType",
						ActivationAction: "com.c_salesordermanage_sd.draftActivate",
						EditAction: "com.c_salesordermanage_sd.draftEdit",
						PreparationAction: "com.c_salesordermanage_sd.draftPrepare"
					}
				},
				oPresentationVariant: {
					$Type: "com.sap.vocabularies.UI.v1.PresentationVariantType",
					SortOrder: [
						{
							$Type: "com.sap.vocabularies.Common.v1.SortOrderType",
							Property: {
								$PropertyPath: "ID"
							},
							Descending: true
						}
					],
					RequestAtLeast: [
						{
							$PropertyPath: "SalesOrder"
						}
					],
					Visualizations: [
						{
							$AnnotationPath: "@com.sap.vocabularies.UI.v1.LineItem"
						}
					]
				},
				sOperationAvailableFields: "SetBillingBlockIsHidden",
				aSemanticKeys: undefined,
				sMessage: "with OperationAvailable field, one Presentation Variant and no semantic keys",
				sExpectedValue: ", $select: 'SetBillingBlockIsHidden,SalesOrder'"
			}
		].forEach(function(oProperty) {
			var actualValue = TableHelper.create$Select(
				oProperty.oCollection,
				oProperty.sOperationAvailableFields,
				"",
				oProperty.oPresentationVariant,
				"@com.sap.vocabularies.UI.v1.PresentationVariant",
				oProperty.aSemanticKeys
			);
			assert.equal(
				actualValue,
				oProperty.sExpectedValue,
				"Unit test to check create$Select to return string " + oProperty.sMessage + ": ok"
			);
		});
	});

	QUnit.test("Unit test to check addOperationAvailableFieldsToSelectQuery ", function(assert) {
		[
			{
				aLineItemCollection: [
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForAction",
						Action: "someNamespace.someBoundAction",
						Label: "Some Label"
					},
					{
						$Type: "com.sap.vocabularies.UI.v1.DataField",
						"@com.sap.vocabularies.UI.v1.Hidden": {
							$Path: "Delivered"
						},
						Value: {
							$Path: "TotalNetAmount"
						}
					}
				],
				oContext: {
					context: {
						getModel: function() {
							return {
								getObject: function(sPath) {
									if (
										sPath === "/SomeEntitySet/someNamespace.someBoundAction@Org.OData.Core.V1.OperationAvailable/$Path"
									) {
										return "_it/someProperty";
									} else if (
										sPath === "/SomeEntitySet/someNamespace.someBoundAction/@$ui5.overload/0/$Parameter/0/$Name"
									) {
										return "_it";
									} else if (
										sPath === "/SomeEntitySet/someNamespace.someBoundAction@Org.OData.Core.V1.OperationAvailable"
									) {
										return { $Path: "_it/someProperty" };
									} else if (sPath === "/") {
										return {
											$kind: "EntityContainer",
											SomeEntitySet: {
												$Type: "someNamespace.SomeEntityType"
											},
											SomeOtherEntitySet: {
												$Type: "someNamespace.SomeOtherEntityType"
											}
										};
									} else if (sPath.indexOf("Action") > 0) {
										return "someNamespace.someBoundAction";
									} else {
										return {
											$kind: "EntitySet",
											$Type: "someNamespace.SomeEntityType"
										};
									}
								}
							};
						},
						getPath: function() {
							return "/SomeEntitySet/@com.sap.vocabularies.UI.v1.LineItem";
						},
						getObject: function(sPath) {
							return this.getModel().getObject(sPath);
						}
					}
				},
				sMessage: "with one path based OperationAvailable",
				sExpectedValue: "someProperty"
			},
			{
				aLineItemCollection: [
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForAction",
						Action: "someNamespace.someBoundAction",
						Label: "Some Label"
					},
					{
						$Type: "com.sap.vocabularies.UI.v1.DataField",
						"@com.sap.vocabularies.UI.v1.Hidden": {
							$Path: "Delivered"
						},
						Value: {
							$Path: "TotalNetAmount"
						}
					}
				],
				oContext: {
					context: {
						getModel: function() {
							return {
								getObject: function(sPath) {
									if (
										sPath ===
										"/SomeOtherEntitySet/someNamespace.someBoundAction@Org.OData.Core.V1.OperationAvailable/$Path"
									) {
										return undefined;
									} else if (
										sPath === "/SomeOtherEntitySet/someNamespace.someBoundAction/@$ui5.overload/0/$Parameter/0/$Name"
									) {
										return "_it";
									} else if (
										sPath === "/SomeOtherEntitySet/someNamespace.someBoundAction@Org.OData.Core.V1.OperationAvailable"
									) {
										return undefined;
									} else if (sPath === "/") {
										return {
											$kind: "EntityContainer",
											SomeEntitySet: {
												$Type: "someNamespace.SomeEntityType"
											},
											SomeOtherEntitySet: {
												$Type: "someNamespace.SomeOtherEntityType"
											}
										};
									} else if (sPath.indexOf("Action") > 0) {
										return "someNamespace.someBoundAction";
									} else {
										return {
											$kind: "NavigationProperty",
											$Type: "someNamespace.SomeOtherEntityType"
										};
									}
								}
							};
						},
						getPath: function() {
							return "/SomeEntitySet/_SomeNavigationProperty/@com.sap.vocabularies.UI.v1.LineItem";
						},
						getObject: function(sPath) {
							return this.getModel().getObject(sPath);
						}
					}
				},
				sMessage: "with no path based OperationAvailable",
				sExpectedValue: ""
			}
		].forEach(function(oProperty) {
			var actualValue = TableHelper.addOperationAvailableFieldsToSelectQuery(oProperty.aLineItemCollection, oProperty.oContext);
			assert.equal(
				actualValue,
				oProperty.sExpectedValue,
				"Unit test to check addOperationAvailableFieldsToSelectQuery " + oProperty.sMessage + ": ok"
			);
		});
	});

	QUnit.test("Unit test to check addPresentationVariantToSelectQuery ", function(assert) {
		[
			{
				oPresentationVariant: undefined,
				sPresentationVariantPath: "@com.sap.vocabularies.UI.v1.LineItem",
				sMessage: "without Presentation Variant",
				sExpectedValue: ""
			},
			{
				oPresentationVariant: {
					$Type: "com.sap.vocabularies.UI.v1.PresentationVariantType",
					SortOrder: [
						{
							$Type: "com.sap.vocabularies.Common.v1.SortOrderType",
							Property: {
								$PropertyPath: "ID"
							},
							Descending: true
						}
					],
					Visualizations: [
						{
							$AnnotationPath: "@com.sap.vocabularies.UI.v1.LineItem"
						}
					]
				},
				sPresentationVariantPath: "@com.sap.vocabularies.UI.v1.PresentationVariant",
				sMessage: "without RequestAtLeast",
				sExpectedValue: ""
			},
			{
				oPresentationVariant: {
					$Type: "com.sap.vocabularies.UI.v1.PresentationVariantType",
					SortOrder: [
						{
							$Type: "com.sap.vocabularies.Common.v1.SortOrderType",
							Property: {
								$PropertyPath: "ID"
							},
							Descending: true
						}
					],
					RequestAtLeast: [
						{
							$PropertyPath: "SalesOrder"
						}
					],
					Visualizations: [
						{
							$AnnotationPath: "@com.sap.vocabularies.UI.v1.LineItem"
						}
					]
				},
				sPresentationVariantPath: "@com.sap.vocabularies.UI.v1.PresentationVariant",
				sMessage: "with one RequestAtLeast",
				sExpectedValue: "SalesOrder"
			},
			{
				oPresentationVariant: {
					$Type: "com.sap.vocabularies.UI.v1.PresentationVariantType",
					SortOrder: [
						{
							$Type: "com.sap.vocabularies.Common.v1.SortOrderType",
							Property: {
								$PropertyPath: "ID"
							},
							Descending: true
						}
					],
					RequestAtLeast: [
						{
							$PropertyPath: "SalesOrder"
						},
						{
							$PropertyPath: "SoldToParty"
						}
					],
					Visualizations: [
						{
							$AnnotationPath: "@com.sap.vocabularies.UI.v1.LineItem"
						}
					]
				},
				sPresentationVariantPath: "@com.sap.vocabularies.UI.v1.PresentationVariant",
				sMessage: "with multiple RequestAtLeast",
				sExpectedValue: "SalesOrder,SoldToParty"
			}
		].forEach(function(oProperty) {
			var actualValue = TableHelper.addPresentationVariantToSelectQuery(
				oProperty.oPresentationVariant,
				oProperty.sPresentationVariantPath
			);
			assert.equal(
				actualValue,
				oProperty.sExpectedValue,
				"Unit test to check addPresentationVariantToSelectQuery " + oProperty.sMessage + ": ok"
			);
		});
	});

	QUnit.test("Unit test to check getOperationAvailableMap ", function(assert) {
		[
			{
				aLineItemCollection: [
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForAction",
						Action: "someNamespace.someBoundAction",
						Label: "Some Label"
					},
					{
						$Type: "com.sap.vocabularies.UI.v1.DataField",
						"@com.sap.vocabularies.UI.v1.Hidden": {
							$Path: "Delivered"
						},
						Value: {
							$Path: "TotalNetAmount"
						}
					}
				],
				oContext: {
					context: {
						getModel: function() {
							return {
								getObject: function(sPath) {
									if (
										sPath === "/SomeEntitySet/someNamespace.someBoundAction@Org.OData.Core.V1.OperationAvailable/$Path"
									) {
										return "_it/someProperty";
									} else if (
										sPath === "/SomeEntitySet/someNamespace.someBoundAction/@$ui5.overload/0/$Parameter/0/$Name"
									) {
										return "_it";
									} else if (
										sPath === "/SomeEntitySet/someNamespace.someBoundAction@Org.OData.Core.V1.OperationAvailable"
									) {
										return { $Path: "_it/someProperty" };
									} else if (sPath === "/") {
										return {
											$kind: "EntityContainer",
											SomeEntitySet: {
												$Type: "someNamespace.SomeEntityType"
											},
											SomeOtherEntitySet: {
												$Type: "someNamespace.SomeOtherEntityType"
											}
										};
									} else if (sPath.indexOf("Action") > 0) {
										return "someNamespace.someBoundAction";
									} else {
										return {
											$kind: "EntitySet",
											$Type: "someNamespace.SomeEntityType"
										};
									}
								}
							};
						},
						getPath: function() {
							return "/SomeEntitySet/@com.sap.vocabularies.UI.v1.LineItem";
						},
						getObject: function(sPath) {
							return this.getModel().getObject(sPath);
						}
					}
				},
				sMessage: "with one path based OperationAvailable",
				sExpectedValue: '{"someNamespace.someBoundAction":"someProperty"}'
			},
			{
				aLineItemCollection: [
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForAction",
						Action: "someNamespace.someBoundAction",
						Label: "Some Label"
					},
					{
						$Type: "com.sap.vocabularies.UI.v1.DataField",
						"@com.sap.vocabularies.UI.v1.Hidden": {
							$Path: "Delivered"
						},
						Value: {
							$Path: "TotalNetAmount"
						}
					}
				],
				oContext: {
					context: {
						getModel: function() {
							return {
								getObject: function(sPath) {
									if (
										sPath ===
										"/SomeOtherEntitySet/someNamespace.someBoundAction@Org.OData.Core.V1.OperationAvailable/$Path"
									) {
										return undefined;
									} else if (
										sPath === "/SomeOtherEntitySet/someNamespace.someBoundAction/@$ui5.overload/0/$Parameter/0/$Name"
									) {
										return "_it";
									} else if (
										sPath === "/SomeOtherEntitySet/someNamespace.someBoundAction@Org.OData.Core.V1.OperationAvailable"
									) {
										return undefined;
									} else if (sPath === "/") {
										return {
											$kind: "EntityContainer",
											SomeEntitySet: {
												$Type: "someNamespace.SomeEntityType"
											},
											SomeOtherEntitySet: {
												$Type: "someNamespace.SomeOtherEntityType"
											}
										};
									} else if (sPath.indexOf("Action") > 0) {
										return "someNamespace.someBoundAction";
									} else {
										return {
											$kind: "NavigationProperty",
											$Type: "someNamespace.SomeOtherEntityType"
										};
									}
								}
							};
						},
						getPath: function() {
							return "/SomeEntitySet/_SomeNavigationProperty/@com.sap.vocabularies.UI.v1.LineItem";
						},
						getObject: function(sPath) {
							return this.getModel().getObject(sPath);
						}
					}
				},
				sMessage: "with no path based OperationAvailable",
				sExpectedValue: "{}"
			},
			{
				aLineItemCollection: [
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForAction",
						Action: "someNamespace.someBoundAction",
						Label: "Some Label"
					},
					{
						$Type: "com.sap.vocabularies.UI.v1.DataField",
						"@com.sap.vocabularies.UI.v1.Hidden": {
							$Path: "Delivered"
						},
						Value: {
							$Path: "TotalNetAmount"
						}
					}
				],
				oContext: {
					context: {
						getModel: function() {
							return {
								getObject: function(sPath) {
									if (
										sPath ===
										"/SomeOtherEntitySet/someNamespace.someBoundAction@Org.OData.Core.V1.OperationAvailable/$Path"
									) {
										return undefined;
									} else if (
										sPath === "/SomeOtherEntitySet/someNamespace.someBoundAction/@$ui5.overload/0/$Parameter/0/$Name"
									) {
										return "_it";
									} else if (
										sPath === "/SomeOtherEntitySet/someNamespace.someBoundAction@Org.OData.Core.V1.OperationAvailable"
									) {
										return null;
									} else if (sPath === "/") {
										return {
											$kind: "EntityContainer",
											SomeEntitySet: {
												$Type: "someNamespace.SomeEntityType"
											},
											SomeOtherEntitySet: {
												$Type: "someNamespace.SomeOtherEntityType"
											}
										};
									} else if (sPath.indexOf("Action") > 0) {
										return "someNamespace.someBoundAction";
									} else {
										return {
											$kind: "NavigationProperty",
											$Type: "someNamespace.SomeOtherEntityType"
										};
									}
								}
							};
						},
						getPath: function() {
							return "/SomeEntitySet/_SomeNavigationProperty/@com.sap.vocabularies.UI.v1.LineItem";
						},
						getObject: function(sPath) {
							return this.getModel().getObject(sPath);
						}
					}
				},
				sMessage: "with OperationAvailable as static null",
				sExpectedValue: '{"someNamespace.someBoundAction":null}'
			}
		].forEach(function(oProperty) {
			var actualValue = TableHelper.getOperationAvailableMap(oProperty.aLineItemCollection, oProperty.oContext);
			assert.equal(
				actualValue,
				oProperty.sExpectedValue,
				"Unit test to check getOperationAvailableMap " + oProperty.sMessage + ": ok"
			);
		});
	});

	QUnit.module("Unit test to check Correct Margin class is Added");
	QUnit.test("Unit test to check if getMarginClass is returning correct margin in case of rating indicators", function(assert) {
		var oCollection = [
			{ "$Type": "UI.DataFieldForAnnotation", "Target": "@UI.DataPoint#Rating_1" },
			{ "$Type": "UI.DataFieldForAnnotation", "Label": "Sold-​To Party", "Target": "_SoldToParty/@Communication.Contact" },
			{ "$Type": "UI.DataFieldForAnnotation", "Target": "@UI.DataPoint#Rating_2" }
		];
		var oElements = [
			{
				"annotation": { "$Type": "UI.DataFieldForAnnotation", "Target": "@UI.DataPoint#Rating_1" },
				"expectedValue": "sapUiNoMarginTop",
				"VisualizationValue": "com.sap.vocabularies.UI.v1.VisualizationType/Rating"
			},
			{
				"annotation": {
					"$Type": "UI.DataFieldForAnnotation",
					"Label": "Sold-​To Party",
					"Target": "_SoldToParty/@Communication.Contact"
				},
				"expectedValue": "sapUiTinyMarginBottom",
				"VisualizationValue": ""
			},
			{
				"annotation": { "$Type": "UI.DataFieldForAnnotation", "Target": "@UI.DataPoint#Rating_2" },
				"expectedValue": "sapUiNoMarginBottom sapUiNoMarginTop",
				"VisualizationValue": "com.sap.vocabularies.UI.v1.VisualizationType/Rating"
			}
		];
		oElements.forEach(function(oElement, index) {
			assert.deepEqual(
				TableHelper.getMarginClass(oCollection, oElement.annotation, oElement.VisualizationValue),
				oElement.expectedValue,
				oElement.expectedValue + "is returned for " + index + " entry in array"
			);
		});
	});

	QUnit.test("Unit test to check if getMarginClass is returning correct margin in case of other controls", function(assert) {
		var oCollection = [
			{ "$Type": "UI.DataField", "Value": "datafield_1" },
			{ "$Type": "UI.DataFieldForAnnotation", "Label": "Sold-​To Party", "Target": "_SoldToParty/@Communication.Contact" },
			{ "$Type": "UI.DataField", "Value": "datafield_2" }
		];
		var oElements = [
			{
				"annotation": { "$Type": "UI.DataField", "Value": "datafield_1" },
				"expectedValue": "sapUiTinyMarginBottom",
				"VisualizationValue": ""
			},
			{
				"annotation": {
					"$Type": "UI.DataFieldForAnnotation",
					"Label": "Sold-​To Party",
					"Target": "_SoldToParty/@Communication.Contact"
				},
				"expectedValue": "sapUiTinyMarginBottom",
				"VisualizationValue": ""
			},
			{ "annotation": { "$Type": "UI.DataField", "Value": "datafield_2" }, "expectedValue": "", "VisualizationValue": "" }
		];
		oElements.forEach(function(oElement, index) {
			assert.deepEqual(
				TableHelper.getMarginClass(oCollection, oElement.annotation, oElement.VisualizationValue),
				oElement.expectedValue,
				oElement.expectedValue + "is returned for " + index + " entry in array"
			);
		});
	});

	QUnit.module("Unit test to check setHeaderLabelVisibility method");
	QUnit.test("Unit test to check if setHeaderLabelVisibility is returning correct values", function(assert) {
		[
			{
				oDataField: {
					"$Type": "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
					"Label": "Sold-To Party",
					"Target": { "$AnnotationPath": "@com.sap.vocabularies.UI.v1.FieldGroup#multipleActionFields" }
				},
				odataFieldCollection: [
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForAction",
						Action: "someNamespace.someBoundAction",
						Label: "Some Label"
					}
				],
				expectedValue: false,
				msg: "FieldGroup contains only inline action, hence, header visibility is false."
			},
			{
				oDataField: {
					"$Type": "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
					"Label": "Sold-To Party",
					"Target": { "$AnnotationPath": "@com.sap.vocabularies.UI.v1.FieldGroup#multipleActionFields" }
				},
				odataFieldCollection: [
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
						Action: "someNamespace.someBoundAction",
						Label: "Some Label"
					}
				],
				expectedValue: false,
				msg: "FieldGroup contains only inline navigation action, hence, header visibility is false."
			},
			{
				oDataField: {
					"$Type": "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
					"Label": "Sold-To Party",
					"Target": { "$AnnotationPath": "@com.sap.vocabularies.UI.v1.FieldGroup#multipleActionFields" }
				},
				odataFieldCollection: [
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
						Action: "someNamespace.someBoundAction",
						Label: "Some Label"
					},
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForAction",
						Action: "someNamespace.someBoundAction",
						Label: "Some Label"
					}
				],
				expectedValue: false,
				msg: "FieldGroup contains only inline action/navigation buttons, hence, header visibility is false."
			},
			{
				oDataField: {
					"$Type": "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
					"Label": "Sold-To Party",
					"Target": { "$AnnotationPath": "@com.sap.vocabularies.UI.v1.FieldGroup#multipleActionFields" }
				},
				odataFieldCollection: [
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
						Action: "someNamespace.someBoundAction",
						Label: "Some Label"
					},
					{
						$Type: "com.sap.vocabularies.UI.v1.DataField",
						Value: "datafield_1"
					},
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
						Label: "Sold-​To Party",
						Target: "_SoldToParty/@Communication.Contact"
					}
				],
				expectedValue: true,
				msg:
					"FieldGroup contains inline action/navigation buttons as well as dataField or DataFieldForAnnotation, hence, header visibility is true."
			},
			{
				oDataField: {
					"$Type": "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
					"Label": "Sold-To Party",
					"Target": { "$AnnotationPath": "@com.sap.vocabularies.UI.v1.FieldGroup#multipleActionFields" }
				},
				odataFieldCollection: [
					{
						"$Type": "com.sap.vocabularies.UI.v1.DataField",
						"Value": "datafield_1",
						"@com.sap.vocabularies.UI.v1.Hidden": true
					},
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
						Label: "Sold-​To Party",
						Target: "_SoldToParty/@Communication.Contact"
					}
				],
				expectedValue: true,
				msg:
					"FieldGroup contains inline action/navigation buttons as well as some dataField or DataFieldForAnnotation which has UI.Hidden true, hence, header visibility is true."
			},
			{
				oDataField: {
					"$Type": "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
					"Label": "Sold-To Party",
					"Target": { "$AnnotationPath": "@com.sap.vocabularies.UI.v1.FieldGroup#multipleActionFields" }
				},
				odataFieldCollection: [
					{
						"$Type": "com.sap.vocabularies.UI.v1.DataField",
						"Value": "datafield_1",
						"@com.sap.vocabularies.UI.v1.Hidden": true
					},
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForAction",
						Action: "someNamespace.someBoundAction",
						Label: "Some Label"
					},
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
						Label: "Sold-​To Party",
						Target: "_SoldToParty/@Communication.Contact",
						"@com.sap.vocabularies.UI.v1.Hidden": true
					}
				],
				expectedValue: false,
				msg:
					"FieldGroup contains inline action/navigation buttons as well as ALL dataField or DataFieldForAnnotation which has UI.Hidden true, hence, header visibility is false."
			},
			{
				oDataField: {
					$Type: "UI.DataField",
					Value: "datafield_1"
				},
				odataFieldCollection: undefined,
				expectedValue: true,
				msg: "Column Contains no inline action/navigation buttons, hence header visibility is true"
			},
			{
				oDataField: {
					$Type: "com.sap.vocabularies.UI.v1.DataFieldForAction",
					SemanticObject: "SalesOrder",
					Action: "manageInline",
					Inline: true
				},
				odataFieldCollection: undefined,
				expectedValue: false,
				msg: "Column Contains inline action button, hence header visibility is false"
			},
			{
				oDataField: {
					$Type: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
					SemanticObject: "SalesOrder",
					Action: "manageInline",
					Inline: true
				},
				odataFieldCollection: undefined,
				expectedValue: false,
				msg: "Column Contains inline navigation action, hence header visibility is false"
			}
		].forEach(function(oElement) {
			assert.deepEqual(
				TableHelper.setHeaderLabelVisibility(oElement.oDataField, oElement.odataFieldCollection),
				oElement.expectedValue,
				oElement.msg
			);
		});
	});

	QUnit.module("Unit test to check _isStaticAction method");
	QUnit.test("Unit test to check _isStaticAction ", function(assert) {
		[
			// Action Overloading Scenarios
			{
				oActionContext: {
					"$kind": "Action",
					"$IsBound": true,
					"$EntitySetPath": "_it/_ItemPartner",
					"$Parameter": [
						{
							"$Type": "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderItemType",
							"$Name": "_it",
							"$Nullable": false
						}
					],
					"$ReturnType": {
						"$Type": "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.ItemPartnerType"
					}
				},
				sActionName:
					"com.sap.gateway.srvd.c_salesordermanage_sd.v0001.CreatePartner(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)",
				sAnnotationTargetEntityType: "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.HeaderPartnerType",
				sMessage:
					"Action overloading(oActionContext as object): Bound action to another entity type has to be treated as static action",
				bExpectedValue: true
			},
			{
				oActionContext: [
					{
						"$kind": "Action",
						"$IsBound": true,
						"$EntitySetPath": "_it/_ItemPartner",
						"$Parameter": [
							{
								"$Type": "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderItemType",
								"$Name": "_it",
								"$Nullable": false
							}
						],
						"$ReturnType": {
							"$Type": "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.ItemPartnerType"
						}
					},
					{
						"$kind": "Action",
						"$IsBound": true,
						"$EntitySetPath": "_it/_Partner",
						"$Parameter": [
							{
								"$Type": "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType",
								"$Name": "_it",
								"$Nullable": false
							}
						],
						"$ReturnType": {
							"$Type": "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.HeaderPartnerType"
						}
					}
				],
				sActionName:
					"com.sap.gateway.srvd.c_salesordermanage_sd.v0001.CreatePartner(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)",
				sAnnotationTargetEntityType: "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.HeaderPartnerType",
				sMessage:
					"Action overloading(oActionContext as array): Bound action to another entity type has to be treated as static action",
				bExpectedValue: true
			},
			{
				oActionContext: {
					"$kind": "Action",
					"$IsBound": true,
					"$Parameter": [
						{
							"$Type": "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.HeaderPartnerType",
							"$Name": "_it",
							"$Nullable": false
						}
					],
					"$ReturnType": {
						"$Type": "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.ItemPartnerType"
					}
				},
				sActionName:
					"com.sap.gateway.srvd.c_salesordermanage_sd.v0001.CreatePartner(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.HeaderPartnerType)",
				sAnnotationTargetEntityType: "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.HeaderPartnerType",
				sMessage: "Action overloading: Bound action to same entity type has to be treated as non static action",
				bExpectedValue: undefined
			},
			{
				oActionContext: {
					"$kind": "Action",
					"$IsBound": true,
					"$EntitySetPath": "_it",
					"$Parameter": [
						{
							"$Type": "com.c_salesordermanage_sd.SalesOrderManage",
							"$Name": "_it",
							"$isCollection": true
						}
					],
					"$ReturnType": {
						"$Type": "com.c_salesordermanage_sd.SalesOrderManage"
					}
				},
				sActionName: "com.c_salesordermanage_sd.DummyStaticAction(com.c_salesordermanage_sd.SalesOrderManage)",
				sAnnotationTargetEntityType: "com.c_salesordermanage_sd.SalesOrderManage",
				sMessage: "Action overloading: Action bound to a collection has to be treated as static action",
				bExpectedValue: true
			},
			// Non Action Overloading Scenarios
			{
				oActionContext: {
					"$kind": "Action",
					"$IsBound": true,
					"$Parameter": [
						{
							"$Type": "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderItemType",
							"$Name": "_it",
							"$Nullable": false
						}
					],
					"$ReturnType": {
						"$Type": "com.c_salesordermanage_sd.SalesOrderManage"
					}
				},
				sActionName: "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.UpdatePrices",
				sAnnotationTargetEntityType: "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderItemType",
				sMessage: "Not action overloading: Action not bound to collection has to be treated as non static action",
				bExpectedValue: undefined
			},
			{
				oActionContext: {
					"$kind": "Action",
					"$IsBound": true,
					"$Parameter": [
						{
							"$Type": "com.c_salesordermanage_sd.SalesOrderManage",
							"$Name": "_it",
							"$isCollection": true
						}
					],
					"$ReturnType": {
						"$Type": "com.c_salesordermanage_sd.SalesOrderManage"
					}
				},
				sActionName: "com.c_salesordermanage_sd.DummyStaticAction",
				sAnnotationTargetEntityType: "com.c_salesordermanage_sd.SalesOrderManage",
				sMessage: "Not action overloading: Action bound to collection has to be treated as static action",
				bExpectedValue: true
			}
		].forEach(function(oProperty) {
			var actualValue = TableHelper._isStaticAction(
				oProperty.oActionContext,
				oProperty.sActionName,
				oProperty.sAnnotationTargetEntityType
			);
			assert.equal(actualValue, oProperty.bExpectedValue, "Unit test to check _isStaticAction " + oProperty.sMessage + ": ok");
		});
	});

	QUnit.module("Unit test to check pressEventDataFieldForActionButton method");

	QUnit.test("Unit test to check pressEventDataFieldForActionButton ", function(assert) {
		var oTable = {
				id: "fe::table::SalesOrderManageType::LineItem",
				collection: {
					getObject: function() {
						return "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.HeaderPartnerType";
					}
				}
			},
			oDataField = {
				"$Type": "com.sap.vocabularies.UI.v1.DataFieldForAction",
				"Label": "Create Partner",
				"InvocationGrouping": { "$EnumMember": "com.sap.vocabularies.UI.v1.OperationGroupingType/Isolated" }
			},
			sEntityName = "SalesOrderManageType",
			sOperationAvailableMap =
				'{"com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType":"__OperationControl/SalesOrderManageType"}';
		[
			// Action Overloading Scenarios
			{
				oActionContext: {
					"$kind": "Action",
					"$IsBound": true,
					"$EntitySetPath": "_it/_ItemPartner",
					"$Parameter": [
						{
							"$Type": "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderItemType",
							"$Name": "_it",
							"$Nullable": false
						}
					],
					"$ReturnType": {
						"$Type": "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.ItemPartnerType"
					}
				},
				Action:
					"com.sap.gateway.srvd.c_salesordermanage_sd.v0001.CreatePartner(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)",
				isNavigable: false,
				enableAutoScroll: false,
				sMessage:
					"Action overloading(oActionContext as object): Bound action to another entity type has to be treated as static action",
				bExpectedValue:
					".editFlow.invokeAction('com.sap.gateway.srvd.c_salesordermanage_sd.v0001.CreatePartner(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)', { contexts: ${internal>selectedContexts}, bStaticAction: true, entitySetName: 'SalesOrderManageType', invocationGrouping: 'Isolated', prefix: 'fe::table::SalesOrderManageType::LineItem', operationAvailableMap: '{\"com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType\":\"__OperationControl/SalesOrderManageType\"}', model: ${$source>/}.getModel(), label: 'Create Partner', applicableContext: ${internal>dynamicActions/com.sap.gateway.srvd.c_salesordermanage_sd.v0001.CreatePartner(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)/aApplicable/}, notApplicableContext: ${internal>dynamicActions/com.sap.gateway.srvd.c_salesordermanage_sd.v0001.CreatePartner(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)/aNotApplicable/}, isNavigable: false, enableAutoScroll: false})"
			},
			{
				oActionContext: [
					{
						"$kind": "Action",
						"$IsBound": true,
						"$EntitySetPath": "_it/_ItemPartner",
						"$Parameter": [
							{
								"$Type": "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderItemType",
								"$Name": "_it",
								"$Nullable": false
							}
						],
						"$ReturnType": {
							"$Type": "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.ItemPartnerType"
						}
					},
					{
						"$kind": "Action",
						"$IsBound": true,
						"$EntitySetPath": "_it/_Partner",
						"$Parameter": [
							{
								"$Type": "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType",
								"$Name": "_it",
								"$Nullable": false
							}
						],
						"$ReturnType": {
							"$Type": "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.HeaderPartnerType"
						}
					}
				],
				Action:
					"com.sap.gateway.srvd.c_salesordermanage_sd.v0001.CreatePartner(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)",
				isNavigable: false,
				enableAutoScroll: false,
				sMessage:
					"Action overloading(oActionContext as array): Bound action to another entity type has to be treated as static action",
				bExpectedValue:
					".editFlow.invokeAction('com.sap.gateway.srvd.c_salesordermanage_sd.v0001.CreatePartner(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)', { contexts: ${internal>selectedContexts}, bStaticAction: true, entitySetName: 'SalesOrderManageType', invocationGrouping: 'Isolated', prefix: 'fe::table::SalesOrderManageType::LineItem', operationAvailableMap: '{\"com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType\":\"__OperationControl/SalesOrderManageType\"}', model: ${$source>/}.getModel(), label: 'Create Partner', applicableContext: ${internal>dynamicActions/com.sap.gateway.srvd.c_salesordermanage_sd.v0001.CreatePartner(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)/aApplicable/}, notApplicableContext: ${internal>dynamicActions/com.sap.gateway.srvd.c_salesordermanage_sd.v0001.CreatePartner(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)/aNotApplicable/}, isNavigable: false, enableAutoScroll: false})"
			},
			{
				oActionContext: {
					"$kind": "Action",
					"$IsBound": true,
					"$EntitySetPath": "_it/_ItemPartner",
					"$Parameter": [
						{
							"$Type": "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderItemType",
							"$Name": "_it",
							"$Nullable": false
						}
					],
					"$ReturnType": {
						"$Type": "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.ItemPartnerType"
					}
				},
				Action:
					"com.sap.gateway.srvd.c_salesordermanage_sd.v0001.CreatePartner(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.HeaderPartnerType)",
				isNavigable: false,
				enableAutoScroll: false,
				sMessage: "Action overloading: Bound action to same entity type has to be treated as non static action",
				bExpectedValue:
					".editFlow.invokeAction('com.sap.gateway.srvd.c_salesordermanage_sd.v0001.CreatePartner(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.HeaderPartnerType)', { contexts: ${internal>selectedContexts}, bStaticAction: undefined, entitySetName: 'SalesOrderManageType', invocationGrouping: 'Isolated', prefix: 'fe::table::SalesOrderManageType::LineItem', operationAvailableMap: '{\"com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType\":\"__OperationControl/SalesOrderManageType\"}', model: ${$source>/}.getModel(), label: 'Create Partner', applicableContext: ${internal>dynamicActions/com.sap.gateway.srvd.c_salesordermanage_sd.v0001.CreatePartner(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.HeaderPartnerType)/aApplicable/}, notApplicableContext: ${internal>dynamicActions/com.sap.gateway.srvd.c_salesordermanage_sd.v0001.CreatePartner(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.HeaderPartnerType)/aNotApplicable/}, isNavigable: false, enableAutoScroll: false})"
			},
			{
				oActionContext: {
					"$kind": "Action",
					"$IsBound": true,
					"$EntitySetPath": "_it",
					"$Parameter": [
						{
							"$Type": "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType",
							"$Name": "_it",
							"$isCollection": true
						}
					],
					"$ReturnType": {
						"$Type": "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType"
					}
				},
				Action:
					"com.sap.gateway.srvd.c_salesordermanage_sd.v0001.CreatePartner(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)",
				isNavigable: false,
				enableAutoScroll: false,
				sMessage: "Action overloading: Action bound to a collection has to be treated as static action",
				bExpectedValue:
					".editFlow.invokeAction('com.sap.gateway.srvd.c_salesordermanage_sd.v0001.CreatePartner(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)', { contexts: ${internal>selectedContexts}, bStaticAction: true, entitySetName: 'SalesOrderManageType', invocationGrouping: 'Isolated', prefix: 'fe::table::SalesOrderManageType::LineItem', operationAvailableMap: '{\"com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType\":\"__OperationControl/SalesOrderManageType\"}', model: ${$source>/}.getModel(), label: 'Create Partner', applicableContext: ${internal>dynamicActions/com.sap.gateway.srvd.c_salesordermanage_sd.v0001.CreatePartner(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)/aApplicable/}, notApplicableContext: ${internal>dynamicActions/com.sap.gateway.srvd.c_salesordermanage_sd.v0001.CreatePartner(com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType)/aNotApplicable/}, isNavigable: false, enableAutoScroll: false})"
			},
			// Non Action Overloading Scenarios
			{
				oActionContext: {
					"$kind": "Action",
					"$IsBound": true,
					"$EntitySetPath": "_it",
					"$Parameter": [
						{
							"$Type": "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType",
							"$Name": "_it",
							"$Nullable": false
						}
					],
					"$ReturnType": {
						"$Type": "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType"
					}
				},
				Action: "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.CreatePartner",
				isNavigable: false,
				enableAutoScroll: false,
				sMessage: "Not action overloading: Action not bound to collection has to be treated as non static action",
				bExpectedValue:
					".editFlow.invokeAction('com.sap.gateway.srvd.c_salesordermanage_sd.v0001.CreatePartner', { contexts: ${internal>selectedContexts}, bStaticAction: undefined, entitySetName: 'SalesOrderManageType', invocationGrouping: 'Isolated', prefix: 'fe::table::SalesOrderManageType::LineItem', operationAvailableMap: '{\"com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType\":\"__OperationControl/SalesOrderManageType\"}', model: ${$source>/}.getModel(), label: 'Create Partner', applicableContext: ${internal>dynamicActions/com.sap.gateway.srvd.c_salesordermanage_sd.v0001.CreatePartner/aApplicable/}, notApplicableContext: ${internal>dynamicActions/com.sap.gateway.srvd.c_salesordermanage_sd.v0001.CreatePartner/aNotApplicable/}, isNavigable: false, enableAutoScroll: false})"
			},
			{
				oActionContext: {
					"$kind": "Action",
					"$IsBound": true,
					"$EntitySetPath": "_it",
					"$Parameter": [
						{
							"$Type": "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType",
							"$Name": "_it",
							"$isCollection": true
						}
					],
					"$ReturnType": {
						"$Type": "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType"
					}
				},
				Action: "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.CreatePartner",
				isNavigable: false,
				enableAutoScroll: false,
				sMessage: "Not action overloading: Action bound to collection has to be treated as static action",
				bExpectedValue:
					".editFlow.invokeAction('com.sap.gateway.srvd.c_salesordermanage_sd.v0001.CreatePartner', { contexts: ${internal>selectedContexts}, bStaticAction: true, entitySetName: 'SalesOrderManageType', invocationGrouping: 'Isolated', prefix: 'fe::table::SalesOrderManageType::LineItem', operationAvailableMap: '{\"com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderManageType\":\"__OperationControl/SalesOrderManageType\"}', model: ${$source>/}.getModel(), label: 'Create Partner', applicableContext: ${internal>dynamicActions/com.sap.gateway.srvd.c_salesordermanage_sd.v0001.CreatePartner/aApplicable/}, notApplicableContext: ${internal>dynamicActions/com.sap.gateway.srvd.c_salesordermanage_sd.v0001.CreatePartner/aNotApplicable/}, isNavigable: false, enableAutoScroll: false})"
			}
		].forEach(function(oProperty) {
			oDataField.Action = oProperty.Action;
			var actualValue = TableHelper.pressEventDataFieldForActionButton(
				oTable,
				oDataField,
				sEntityName,
				sOperationAvailableMap,
				oProperty.oActionContext,
				oProperty.isNavigable,
				oProperty.enableAutoScroll
			);
			assert.equal(
				actualValue,
				oProperty.bExpectedValue,
				"Unit test to check pressEventDataFieldForActionButton " + oProperty.sMessage + ": ok"
			);
		});
	});

	QUnit.module("Unit test to check isDataFieldForActionEnabled method");

	QUnit.test("Unit test to check isDataFieldForActionEnabled ", function(assert) {
		[
			{
				oTable: undefined,
				oDataField: {
					"$Type": "com.sap.vocabularies.UI.v1.DataFieldForAction",
					"Label": "Create Draft",
					"Action": "com.sap.gateway.srvd.dmo.ui_travel_processor_uuid.v0001.TravelType"
				},
				oRequiresContext: false,
				oActionContext: undefined,
				sMessage: "Action is enabled for RequiresContext false",
				bExpectedValue: true
			},
			{
				oTable: undefined,
				oDataField: {
					"$Type": "com.sap.vocabularies.UI.v1.DataFieldForAction",
					"Label": "Create Draft",
					"Action": "com.sap.gateway.srvd.dmo.ui_travel_processor_uuid.v0001.TravelType"
				},
				oRequiresContext: true,
				oActionContext: {
					"$kind": "Action",
					"$IsBound": true,
					"$Parameter": [
						{
							"$Type": "com.sap.gateway.srvd.dmo.ui_travel_processor_uuid.v0001.TravelType",
							"$Name": "_it",
							"$Nullable": false,
							"$isCollection": true
						}
					]
				},
				sMessage: "Action is enable for Static Action",
				bExpectedValue: true
			},
			{
				oTable: {
					id: "fe::table::Travel::LineItem",
					collection: {
						getObject: function() {
							return "com.sap.gateway.srvd.dmo.ui_travel_processor_uuid.v0001.TravelType";
						}
					}
				},
				oDataField: {
					"$Type": "com.sap.vocabularies.UI.v1.DataFieldForAction",
					"Label": "Create Draft",
					"Action": "testAction(com.sap.gateway.srvd.dmo.ui_travel_processor_uuid.v0001.TravelType)"
				},
				oRequiresContext: true,
				oActionContext: {
					"$kind": "Action",
					"$IsBound": true,
					"$Parameter": [
						{
							"$Type": "com.sap.gateway.srvd.dmo.ui_travel_processor_uuid.v0001.TravelType",
							"$Name": "_it",
							"$Nullable": false
						}
					]
				},
				bIsDataFieldForIBN: undefined,
				sMessage: "Expression for Bound Actions with the single selection enabled",
				sActionEnable: "single",
				bExpectedValue:
					"{= ${internal>numberOfSelectedContexts} === 1 && ${internal>dynamicActions/testAction(com.sap.gateway.srvd.dmo.ui_travel_processor_uuid.v0001.TravelType)/bEnabled}}"
			},
			{
				oTable: {
					id: "fe::table::Travel::LineItem",
					collection: {
						getObject: function() {
							return "com.sap.gateway.srvd.dmo.ui_travel_processor_uuid.v0001.TravelType";
						}
					}
				},
				oDataField: {
					"$Type": "com.sap.vocabularies.UI.v1.DataFieldForAction",
					"Label": "Create Draft",
					"Action": "testAction(com.sap.gateway.srvd.dmo.ui_travel_processor_uuid.v0001.TravelType)"
				},
				oRequiresContext: true,
				oActionContext: {
					"$kind": "Action",
					"$IsBound": true,
					"$Parameter": [
						{
							"$Type": "com.sap.gateway.srvd.dmo.ui_travel_processor_uuid.v0001.TravelType",
							"$Name": "_it",
							"$Nullable": false
						}
					]
				},
				bIsDataFieldForIBN: undefined,
				sMessage: "Expression for Bound Actions with the multi selection enabled",
				sActionEnable: "multi",
				bExpectedValue:
					"{= ${internal>numberOfSelectedContexts} > 0 && ${internal>dynamicActions/testAction(com.sap.gateway.srvd.dmo.ui_travel_processor_uuid.v0001.TravelType)/bEnabled}}"
			},
			{
				oTable: {
					id: "fe::table::Travel::LineItem",
					collection: {
						getObject: function() {
							return "com.sap.gateway.srvd.dmo.ui_travel_processor_uuid.v0001.TravelType";
						}
					}
				},
				oDataField: {
					"$Type": "com.sap.vocabularies.UI.v1.DataFieldForAction",
					"Label": "Create Draft",
					"Action": "testAction(com.sap.gateway.srvd.dmo.ui_travel_processor_uuid.v0001.TravelType)"
				},
				oRequiresContext: true,
				oActionContext: {
					"$kind": "Action",
					"$IsBound": true,
					"$Parameter": [
						{
							"$Type": "com.sap.gateway.srvd.dmo.ui_travel_processor_uuid.v0001.TravelType",
							"$Name": "_it",
							"$Nullable": false
						}
					]
				},
				bIsDataFieldForIBN: undefined,
				sMessage: "Expression for Bound Actions without selection enabled",
				bExpectedValue:
					"{= ${internal>numberOfSelectedContexts} > 0 && ${internal>dynamicActions/testAction(com.sap.gateway.srvd.dmo.ui_travel_processor_uuid.v0001.TravelType)/bEnabled}}"
			},
			{
				oTable: {
					id: "fe::table::Travel::LineItem",
					collection: {
						getObject: function() {
							return "";
						},
						getPath: function() {
							return "/Travel";
						},
						getModel: function() {
							return "";
						}
					}
				},
				oDataField: {
					$Type: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
					SemanticObject: "SalesOrder",
					Action: "manage",
					Label: "IBN",
					RequiresContext: false,
					NavigationAvailable: false
				},
				oRequiresContext: false,
				bIsDataFieldForIBN: true,
				sMessage: "Expression for IBN with the RequiresContext as false and NavigationAvailable as false",
				sActionEnable: "false",
				bExpectedValue: false
			},
			{
				oTable: {
					id: "fe::table::Travel::LineItem",
					collection: {
						getObject: function() {
							return "";
						},
						getPath: function() {
							return "/Travel";
						},
						getModel: function() {
							return "";
						}
					}
				},
				oDataField: {
					$Type: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
					SemanticObject: "SalesOrder",
					Action: "manage",
					Label: "IBN",
					RequiresContext: false,
					NavigationAvailable: true
				},
				oRequiresContext: false,
				bIsDataFieldForIBN: true,
				sMessage: "Expression for IBN with the RequiresContext as false and NavigationAvailable as true",
				sActionEnable: "true",
				bExpectedValue: true
			},
			{
				oTable: {
					id: "fe::table::Travel::LineItem",
					collection: {
						getObject: function() {
							return "";
						},
						getPath: function() {
							return "/Travel";
						},
						getModel: function() {
							return {
								getObject: function() {
									return false;
								}
							};
						}
					}
				},
				oDataField: {
					$Type: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
					SemanticObject: "SalesOrder",
					Action: "manage",
					Label: "IBN",
					RequiresContext: false,
					NavigationAvailable: "Delivered"
				},
				oRequiresContext: false,
				bIsDataFieldForIBN: true,
				sMessage: "Expression for IBN with the RequiresContext as false and NavigationAvailable as path for LR table",
				sActionEnable: "{Delivered}",
				bExpectedValue: true
			},
			{
				oTable: {
					id: "fe::table::Item::LineItem",
					collection: {
						getObject: function() {
							return "";
						},
						getPath: function() {
							return "/Travel/_Item";
						},
						getModel: function() {
							return {
								getObject: function() {
									return "owner";
								}
							};
						}
					}
				},
				oDataField: {
					$Type: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
					SemanticObject: "SalesOrder",
					Action: "manage",
					Label: "IBN",
					RequiresContext: false,
					NavigationAvailable: { $Path: "owner/Delivered" }
				},
				oRequiresContext: false,
				bIsDataFieldForIBN: true,
				sMessage: "Expression for IBN with the RequiresContext as false and NavigationAvailable as path for OP table",
				sActionEnable: "{owner/Delivered}",
				bExpectedValue: "{= ${Delivered}}"
			},
			{
				oTable: {
					id: "fe::table::Travel::LineItem",
					collection: {
						getObject: function() {
							return "";
						},
						getPath: function() {
							return "/Travel";
						},
						getModel: function() {
							return "";
						}
					}
				},
				oDataField: {
					$Type: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
					SemanticObject: "SalesOrder",
					Action: "manage",
					Label: "IBN",
					RequiresContext: true,
					NavigationAvailable: false
				},
				oRequiresContext: true,
				bIsDataFieldForIBN: true,
				sMessage: "Expression for IBN with the RequiresContext as true and NavigationAvailable as false",
				sActionEnable: "false",
				bExpectedValue: false
			},
			{
				oTable: {
					id: "fe::table::Travel::LineItem",
					collection: {
						getObject: function() {
							return "";
						},
						getPath: function() {
							return "/Travel";
						},
						getModel: function() {
							return "";
						}
					}
				},
				oDataField: {
					$Type: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
					SemanticObject: "SalesOrder",
					Action: "manage",
					Label: "IBN",
					RequiresContext: true,
					NavigationAvailable: true
				},
				oRequiresContext: true,
				bIsDataFieldForIBN: true,
				sMessage: "Expression for IBN with the RequiresContext as true and NavigationAvailable as true",
				sActionEnable: "true",
				bExpectedValue: "{= %{internal>numberOfSelectedContexts} >= 1}"
			},
			{
				oTable: {
					id: "fe::table::Travel::LineItem",
					collection: {
						getObject: function() {
							return "";
						},
						getPath: function() {
							return "/Travel";
						},
						getModel: function() {
							return "";
						}
					}
				},
				oDataField: {
					$Type: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
					SemanticObject: "SalesOrder",
					Action: "manage",
					Label: "IBN",
					RequiresContext: true,
					NavigationAvailable: "Delivered"
				},
				oRequiresContext: true,
				bIsDataFieldForIBN: true,
				sMessage: "Expression for IBN with the RequiresContext as true and NavigationAvailable as Path",
				sActionEnable: "{Delivered}",
				bExpectedValue: "{= %{internal>numberOfSelectedContexts} >= 1 && ${internal>ibn/SalesOrder-manage/bEnabled}}"
			}
		].forEach(function(oProperty) {
			var actualValue = TableHelper.isDataFieldForActionEnabled(
				oProperty.oTable,
				oProperty.oDataField,
				oProperty.oRequiresContext,
				oProperty.bIsDataFieldForIBN,
				oProperty.oActionContext,
				oProperty.sActionEnable
			);
			assert.deepEqual(
				actualValue,
				oProperty.bExpectedValue,
				"Unit test to check isDataFieldForActionEnabled " + oProperty.sMessage + ": ok"
			);
		});
	});

	QUnit.module("Unit Test for check column settings");

	QUnit.test("Unit test to check getChartSize and getChartRenderLabels", function(assert) {
		[
			{
				oThis: {
					tableType: "ResponsiveTable"
				},
				oColumn: {
					name: ""
				},
				oExpectedResult: {
					microChartSize: "XS",
					showMicroChartLabel: false
				},
				sMessage: "Micro chart default size and label"
			},
			{
				oThis: {
					tableType: "ResponsiveTable"
				},
				oColumn: {
					name: "DataFieldForAnnotation::_CreditLimitDetails::Chart::RadialCriticalityPathHidden",
					settings: {
						microChartSize: "L",
						showMicroChartLabel: false
					}
				},
				oExpectedResult: {
					microChartSize: "L",
					showMicroChartLabel: false
				},
				sMessage: "Micro chart size and label from settings"
			},
			{
				oThis: {
					tableType: "ResponsiveTable"
				},
				oColumn: {
					name: "DataFieldForAnnotation::_CreditLimitDetails::Chart::RadialCriticalityPathHidden",
					settings: {
						"microChartSize": "L",
						"showMicroChartLabel": true
					}
				},
				oExpectedResult: {
					microChartSize: "L",
					showMicroChartLabel: true
				},
				sMessage: "Micro chart size and label from settings"
			},
			{
				oThis: {
					tableType: "GridTable"
				},

				oColumn: {
					name: "DataFieldForAnnotation::_CreditLimitDetails::Chart::RadialCriticalityPathHidden",
					settings: {
						"microChartSize": "L",
						"showMicroChartLabel": true
					}
				},
				oExpectedResult: {
					microChartSize: "XS",
					showMicroChartLabel: false
				},
				sMessage: "Any other table read default from settings"
			}
		].forEach(function(oProperty) {
			var sChartSize = TableHelper.getChartSize(oProperty.oThis, oProperty.oColumn);
			var sRenderLabels = TableHelper.getChartRenderLabels(oProperty.oThis, oProperty.oColumn);
			assert.equal(
				sChartSize,
				oProperty.oExpectedResult.microChartSize,
				"Unit test to check getChartSize " + oProperty.sMessage + ": ok"
			);
			assert.equal(
				sRenderLabels,
				oProperty.oExpectedResult.showMicroChartLabel,
				"Unit test to check getChartRenderLabels " + oProperty.sMessage + ": ok"
			);
		});
	});

	QUnit.module("Unit Test for getVBoxVisibility");

	QUnit.test("Unit test to check getVBoxVisibility ", function(assert) {
		[
			{
				oCollection: [
					{
						"@com.sap.vocabularies.UI.v1.Hidden": true
					},
					{
						"@com.sap.vocabularies.UI.v1.Hidden": true
					},
					{
						"@com.sap.vocabularies.UI.v1.Hidden": true
					}
				],
				bExpectedValue: false,
				sMessage: "with all static hidden fields"
			},
			{
				oCollection: [
					{
						"@com.sap.vocabularies.UI.v1.Hidden": false
					},
					{
						"@com.sap.vocabularies.UI.v1.Hidden": false
					},
					{
						"@com.sap.vocabularies.UI.v1.Hidden": false
					}
				],
				bExpectedValue: true,
				sMessage: "with all visible fields"
			},
			{
				oCollection: [
					{
						"@com.sap.vocabularies.UI.v1.Hidden": false
					},
					{
						"@com.sap.vocabularies.UI.v1.Hidden": {
							"$Path": "isVerified"
						}
					},
					{
						"@com.sap.vocabularies.UI.v1.Hidden": false
					}
				],
				bExpectedValue:
					"{parts:[{value: 'false'},{path: 'isVerified'},{value: 'false'}], formatter: 'sap.fe.macros.table.TableRuntime.getVBoxVisibility'}",
				sMessage: "with one field having hidden path"
			},
			{
				oCollection: [
					{
						"@com.sap.vocabularies.UI.v1.Hidden": {
							"$Path": "isDelivered"
						}
					},
					{
						"@com.sap.vocabularies.UI.v1.Hidden": {
							"$Path": "isVerified"
						}
					},
					{
						"@com.sap.vocabularies.UI.v1.Hidden": false
					}
				],
				bExpectedValue:
					"{parts:[{path: 'isDelivered'},{path: 'isVerified'},{value: 'false'}], formatter: 'sap.fe.macros.table.TableRuntime.getVBoxVisibility'}",
				sMessage: "with two field having hidden path"
			}
		].forEach(function(oProperty) {
			var actualValue = TableHelper.getVBoxVisibility(oProperty.oCollection);
			assert.equal(actualValue, oProperty.bExpectedValue, "Unit test to check getVBoxVisibility " + oProperty.sMessage + ": ok");
		});
	});

	QUnit.module("Unit Test for Method handleTableDeleteEnablementForSideEffects, getDeletablePathForTable, getDeletableValue");

	QUnit.test("Unit test for handleTableDeleteEnablementForSideEffects method", function(assert) {
		var sAllPaths = {};
		var oValue = (oValue1 = {
			"__EntityControl": {
				"Deletable": true
			}
		});
		var oValue1 = {
			"__EntityControl": {
				"Deletable": false
			}
		};
		[
			{
				getModel: function() {
					if (!this.sPath) {
						this.sPath = {};
					}
					return {
						getMetaModel: function() {
							return {
								getObject: function(sPath) {
									return {
										"Table--LineItem--OP@Org.OData.Capabilities.V1.DeleteRestrictions/Deletable": true
									};
								}
							};
						},
						getProperty: function(sPath) {
							return sAllPaths && sAllPaths[sPath];
						},
						setProperty: function(sPath, value) {
							if (sAllPaths) {
								sAllPaths[sPath] = value;
							}
						}
					};
				},
				getRowBinding: function() {
					return {
						getPath: function() {
							return "Table--LineItem--OP";
						}
					};
				},
				sMessage: "Restriction with static value true",
				bExpectedValue: undefined,
				getSelectedContexts: function() {
					return [];
				},
				getId: function() {
					return "Table--LineItem--OP";
				}
			},

			{
				getModel: function() {
					return {
						getMetaModel: function() {
							return {
								getObject: function(sPath) {
									if (sPath === "/HeaderPartner@Org.OData.Capabilities.V1.DeleteRestrictions/Deletable") {
										return { $Path: "__EntityControl/Deletable" };
									}
									if (sPath === "_Partner") {
										return false;
									}
									return {
										"$NavigationPropertyBinding": {
											"_Partner": "HeaderPartner"
										}
									};
								},
								getMetaPath: function(sPath) {
									var sMetaPath = sPath && sPath.split("--") && sPath.split("--")[0];
									return "/" + sMetaPath;
								}
							};
						},
						getProperty: function(sPath) {
							return sAllPaths && sAllPaths[sPath];
						},
						setProperty: function(sPath, value) {
							if (sAllPaths) {
								sAllPaths[sPath] = value;
							}
						}
					};
				},
				getRowBinding: function() {
					return {
						getPath: function() {
							return "_Partner";
						},
						getContext: function() {
							return {
								getPath: function() {
									return "SalesOrderManage--LineItem";
								}
							};
						}
					};
				},
				sMessage: "Restriction with path based value true",
				bExpectedValue: true,
				getSelectedContexts: function() {
					return [
						{
							getObject: function() {
								return {
									"__EntityControl": {
										"Deletable": true
									}
								};
							},
							getProperty: function(sPath) {
								sPath &&
									sPath.split("/").forEach(function(sPath) {
										oValue = oValue[sPath];
									});
								return oValue;
							}
						}
					];
				},
				getId: function() {
					return "Table--Partner--OP";
				}
			},
			{
				getModel: function() {
					return {
						getMetaModel: function() {
							return {
								getObject: function(sPath) {
									if (sPath === "/HeaderPartner@Org.OData.Capabilities.V1.DeleteRestrictions/Deletable") {
										return { $Path: "__EntityControl/Deletable" };
									}
									if (sPath === "_Partner") {
										return false;
									}
									return {
										"$NavigationPropertyBinding": {
											"_Partner": "HeaderPartner"
										}
									};
								},
								getMetaPath: function(sPath) {
									var sMetaPath = sPath && sPath.split("--") && sPath.split("--")[0];
									return "/" + sMetaPath;
								}
							};
						},
						getProperty: function(sPath) {
							return sAllPaths && sAllPaths[sPath];
						},
						setProperty: function(sPath, value) {
							if (sAllPaths) {
								sAllPaths[sPath] = value;
							}
						}
					};
				},
				getRowBinding: function() {
					return {
						getPath: function() {
							return "_Partner";
						},
						getContext: function() {
							return {
								getPath: function() {
									return "SalesOrderManage--LineItem";
								}
							};
						}
					};
				},
				sMessage: "Restriction with path based value False",
				bExpectedValue: false,
				getSelectedContexts: function() {
					return [
						{
							getObject: function() {
								return {
									"__EntityControl": {
										"Deletable": false
									}
								};
							},
							getProperty: function(sPath) {
								sPath &&
									sPath.split("/").forEach(function(sPath) {
										oValue1 = oValue1[sPath];
									});
								return oValue1;
							}
						}
					];
				},
				getId: function() {
					return "Table--Partner--OP";
				}
			},
			{
				getModel: function() {
					return {
						getMetaModel: function() {
							return {
								getObject: function(sPath) {
									return false;
								},
								getMetaPath: function(sPath) {
									var sMetaPath = sPath && sPath.split("--") && sPath.split("--")[0];
									return "/" + sMetaPath;
								}
							};
						},
						getProperty: function(sPath) {
							return sAllPaths && sAllPaths[sPath];
						},
						setProperty: function(sPath, value) {
							if (sAllPaths) {
								sAllPaths[sPath] = value;
							}
						}
					};
				},
				getRowBinding: function() {
					return {
						getPath: function() {
							return "_Partner";
						},
						getContext: function() {
							return {
								getPath: function() {
									return "SalesOrderManage--LineItem";
								}
							};
						}
					};
				},
				sMessage: "Restriction with static value direct false",
				bExpectedValue: false,
				getSelectedContexts: function() {
					return [
						{
							getObject: function() {
								return {
									"__EntityControl": {
										"Deletable": false
									}
								};
							},
							getProperty: function(sPath) {
								sPath &&
									sPath.split("/").forEach(function(sPath) {
										oValue1 = oValue1[sPath];
									});
								return oValue1;
							}
						}
					];
				},
				getId: function() {
					return "Table--Partner--OP";
				}
			},
			{
				getModel: function() {
					return {
						getMetaModel: function() {
							return {
								getObject: function(sPath) {
									return true;
								},
								getMetaPath: function(sPath) {
									var sMetaPath = sPath && sPath.split("--") && sPath.split("--")[0];
									return "/" + sMetaPath;
								}
							};
						},
						getProperty: function(sPath) {
							return sAllPaths && sAllPaths[sPath];
						},
						setProperty: function(sPath, value) {
							if (sAllPaths) {
								sAllPaths[sPath] = value;
							}
						}
					};
				},
				getRowBinding: function() {
					return {
						getPath: function() {
							return "_Partner";
						},
						getContext: function() {
							return {
								getPath: function() {
									return "SalesOrderManage--LineItem";
								}
							};
						}
					};
				},
				sMessage: "Restriction with static value direct true",
				bExpectedValue: false,
				getSelectedContexts: function() {
					return [
						{
							getObject: function() {
								return {
									"__EntityControl": {
										"Deletable": false
									}
								};
							},
							getProperty: function(sPath) {
								sPath &&
									sPath.split("/").forEach(function(sPath) {
										oValue1 = oValue1[sPath];
									});
								return oValue1;
							}
						}
					];
				},
				getId: function() {
					return "Table--Partner--OP";
				}
			}
		].forEach(function(oTable) {
			TableHelper.handleTableDeleteEnablementForSideEffects(oTable, oTable.getModel(), oTable.getModel());
			var actualValue = sAllPaths["deleteEnabled"];
			assert.equal(
				actualValue,
				oTable.bExpectedValue,
				"Unit test to check handleTableDeleteEnablementForSideEffects " + oTable.sMessage + ": ok"
			);
		});
	});

	QUnit.module("Unit Test for addNavigationAvailableFieldsToSelectQuery");

	QUnit.test("Unit test to check addNavigationAvailableFieldsToSelectQuery ", function(assert) {
		[
			{
				aLineItemCollection: [
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
						SemanticObject: "SalesOrder",
						Action: "manage",
						Label: "IBN",
						RequiresContext: true,
						NavigationAvailable: true
					},
					{
						$Type: "com.sap.vocabularies.UI.v1.DataField",
						"@com.sap.vocabularies.UI.v1.Hidden": {
							$Path: "Delivered"
						},
						Value: {
							$Path: "TotalNetAmount"
						}
					}
				],
				sMessage: "with one NavigationAvailable as static true",
				sExpectedValue: ""
			},
			{
				aLineItemCollection: [
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
						SemanticObject: "SalesOrder",
						Action: "manage",
						Label: "IBN",
						RequiresContext: true,
						NavigationAvailable: false
					},
					{
						$Type: "com.sap.vocabularies.UI.v1.DataField",
						"@com.sap.vocabularies.UI.v1.Hidden": {
							$Path: "Delivered"
						},
						Value: {
							$Path: "TotalNetAmount"
						}
					}
				],
				sMessage: "with one NavigationAvailable as static false",
				sExpectedValue: ""
			},
			{
				aLineItemCollection: [
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
						SemanticObject: "SalesOrder",
						Action: "manage",
						Label: "IBN",
						RequiresContext: true,
						NavigationAvailable: { $Path: "Delivered" }
					},
					{
						$Type: "com.sap.vocabularies.UI.v1.DataField",
						"@com.sap.vocabularies.UI.v1.Hidden": {
							$Path: "Delivered"
						},
						Value: {
							$Path: "TotalNetAmount"
						}
					}
				],
				sMessage: "with one NavigationAvailable as path",
				sExpectedValue: "Delivered"
			},
			{
				aLineItemCollection: [
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
						SemanticObject: "SalesOrder",
						Action: "manage",
						Label: "IBN",
						RequiresContext: true,
						NavigationAvailable: { $Path: "Delivered" }
					},
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
						SemanticObject: "FreeStyle",
						Action: "navigate",
						Label: "FreeStyle",
						RequiresContext: true,
						NavigationAvailable: { $Path: "_Partner/isVerified" }
					},
					{
						$Type: "com.sap.vocabularies.UI.v1.DataField",
						"@com.sap.vocabularies.UI.v1.Hidden": {
							$Path: "Delivered"
						},
						Value: {
							$Path: "TotalNetAmount"
						}
					}
				],
				sMessage: "with one NavigationAvailable as path",
				sExpectedValue: "Delivered,_Partner/isVerified"
			}
		].forEach(function(oProperty) {
			var actualValue = TableHelper.addNavigationAvailableFieldsToSelectQuery(oProperty.aLineItemCollection);
			assert.equal(
				actualValue,
				oProperty.sExpectedValue,
				"Unit test to check addNavigationAvailableFieldsToSelectQuery " + oProperty.sMessage + ": ok"
			);
		});
	});

	QUnit.test("Unit test to check getNavigationAvailableMap ", function(assert) {
		[
			{
				aLineItemCollection: [
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
						SemanticObject: "FreeStyle",
						Action: "navigate",
						Label: "FreeStyle",
						RequiresContext: true,
						NavigationAvailable: { $Path: "_Partner/isVerified" }
					},
					{
						$Type: "com.sap.vocabularies.UI.v1.DataField",
						"@com.sap.vocabularies.UI.v1.Hidden": {
							$Path: "Delivered"
						},
						Value: {
							$Path: "TotalNetAmount"
						}
					}
				],
				sMessage: "with one path based NavigationAvailable",
				sExpectedValue: '{"FreeStyle-navigate":"_Partner/isVerified"}'
			},
			{
				aLineItemCollection: [
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
						SemanticObject: "FreeStyle",
						Action: "navigate",
						Label: "FreeStyle",
						RequiresContext: true,
						NavigationAvailable: true
					},
					{
						$Type: "com.sap.vocabularies.UI.v1.DataField",
						"@com.sap.vocabularies.UI.v1.Hidden": {
							$Path: "Delivered"
						},
						Value: {
							$Path: "TotalNetAmount"
						}
					}
				],
				sMessage: "with static true NavigationAvailable",
				sExpectedValue: '{"FreeStyle-navigate":true}'
			},
			{
				aLineItemCollection: [
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
						SemanticObject: "FreeStyle",
						Action: "navigate",
						Label: "FreeStyle",
						RequiresContext: true,
						NavigationAvailable: false
					},
					{
						$Type: "com.sap.vocabularies.UI.v1.DataField",
						"@com.sap.vocabularies.UI.v1.Hidden": {
							$Path: "Delivered"
						},
						Value: {
							$Path: "TotalNetAmount"
						}
					}
				],
				sMessage: "with static false NavigationAvailable",
				sExpectedValue: '{"FreeStyle-navigate":false}'
			},
			{
				aLineItemCollection: [
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
						SemanticObject: "FreeStyle",
						Action: "navigate",
						Label: "FreeStyle",
						RequiresContext: false,
						NavigationAvailable: { $Path: "_Partner/isVerified" }
					},
					{
						$Type: "com.sap.vocabularies.UI.v1.DataField",
						"@com.sap.vocabularies.UI.v1.Hidden": {
							$Path: "Delivered"
						},
						Value: {
							$Path: "TotalNetAmount"
						}
					}
				],
				sMessage: "with RequiresContext as false",
				sExpectedValue: "{}"
			},
			{
				aLineItemCollection: [
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
						SemanticObject: "FreeStyle",
						Action: "navigate",
						Label: "FreeStyle",
						RequiresContext: true,
						NavigationAvailable: { $Path: "_Partner/isVerified" }
					},
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
						SemanticObject: "SalesOrder",
						Action: "manage",
						Label: "IBN",
						RequiresContext: true,
						NavigationAvailable: { $Path: "Delivered" }
					},
					{
						$Type: "com.sap.vocabularies.UI.v1.DataField",
						"@com.sap.vocabularies.UI.v1.Hidden": {
							$Path: "Delivered"
						},
						Value: {
							$Path: "TotalNetAmount"
						}
					}
				],
				sMessage: "with multiple Navigation Available Paths",
				sExpectedValue: '{"FreeStyle-navigate":"_Partner/isVerified","SalesOrder-manage":"Delivered"}'
			},
			{
				aLineItemCollection: [
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
						SemanticObject: "FreeStyle",
						Action: "navigate",
						Label: "FreeStyle",
						Inline: true,
						RequiresContext: true,
						NavigationAvailable: { $Path: "_Partner/isVerified" }
					},
					{
						$Type: "com.sap.vocabularies.UI.v1.DataField",
						"@com.sap.vocabularies.UI.v1.Hidden": {
							$Path: "Delivered"
						},
						Value: {
							$Path: "TotalNetAmount"
						}
					}
				],
				sMessage: "with Inline as true",
				sExpectedValue: "{}"
			}
		].forEach(function(oProperty) {
			var actualValue = TableHelper.getNavigationAvailableMap(oProperty.aLineItemCollection);
			assert.equal(
				actualValue,
				oProperty.sExpectedValue,
				"Unit test to check getNavigationAvailableMap " + oProperty.sMessage + ": ok"
			);
		});
	});
});
