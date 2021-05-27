/* eslint-disable consistent-return */
/* global QUnit */
sap.ui.define(["sap/fe/macros/internal/valuehelp/ValueListHelper", "sap/ui/dom/units/Rem"], function(ValueListHelper, Rem) {
	"use strict";

	QUnit.module("Unit Tests for getColumnVisibility, hasImportance, getMinScreenWidth, getTableItemsParameters");
	QUnit.test("Unit test to check column visibility of value list", function(assert) {
		[
			{
				oValueList: {
					$model: {
						id: "id-4711-01",
						getMetaModel: function() {
							return {
								getObject: function(sPath) {
									if (sPath === "/Customer/Customer@com.sap.vocabularies.UI.v1.Hidden") {
										return false;
									}
								}
							};
						}
					},
					$Type: "com.sap.vocabularies.Common.v1.ValueListType",
					CollectionPath: "Customer",
					Label: "Sold-to Party",
					Parameters: [
						{
							"@com.sap.vocabularies.UI.v1.Importance": {
								$EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
							},
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterInOut",
							LocalDataProperty: {
								$PropertyPath: "SoldToParty"
							},
							ValueListProperty: "Customer",
							vExpectedValue: undefined,
							sMessage: " showing return value 'undefined'"
						},
						{
							"@com.sap.vocabularies.UI.v1.Importance": {
								$EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
							},
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
							ValueListProperty: "CustomerName",
							vExpectedValue: undefined,
							sMessage: " showing return value 'undefined'"
						},
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
							ValueListProperty: "OrganizationBPName1",
							vExpectedValue: "{_VHUI>/showAllColumns}",
							sMessage: " showing return value '{_VHUI>/showAllColumns}'"
						},
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
							ValueListProperty: "OrganizationBPName2",
							vExpectedValue: "{_VHUI>/showAllColumns}",
							sMessage: " showing return value '{_VHUI>/showAllColumns}'"
						},
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
							ValueListProperty: "PostalCode",
							vExpectedValue: "{_VHUI>/showAllColumns}",
							sMessage: " showing return value '{_VHUI>/showAllColumns}'"
						},
						{
							"@com.sap.vocabularies.UI.v1.Importance": {
								$EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
							},
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
							ValueListProperty: "CityName",
							vExpectedValue: undefined,
							sMessage: " showing return value 'undefined'"
						},
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
							ValueListProperty: "Country",
							vExpectedValue: "{_VHUI>/showAllColumns}",
							sMessage: " showing return value '{_VHUI>/showAllColumns}'"
						},
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
							ValueListProperty: "InternationalPhoneNumber",
							vExpectedValue: "{_VHUI>/showAllColumns}",
							sMessage: " showing return value '{_VHUI>/showAllColumns}'"
						},
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
							ValueListProperty: "EmailAddress",
							vExpectedValue: "{_VHUI>/showAllColumns}",
							sMessage: " showing return value '${_VHUI>/showAllColumns} || false'"
						}
					],
					getObject: function() {
						return this;
					},
					vExpectedValue: "Importance/High",
					sExpectedMinScreenWidth: "{= ${_VHUI>/minScreenWidth}}",
					sExpectedTableItemsParameters: "{path: '/Customer', suspended : false, sorter: {path: 'Customer', ascending: true}}"
				}
			},
			{
				oValueList: {
					$model: {
						id: "id-4711-02",
						getMetaModel: function() {
							return {
								getObject: function(sPath) {
									if (sPath === "/Customer/OrganizationBPName1@com.sap.vocabularies.UI.v1.Hidden") {
										return true;
									}
								}
							};
						}
					},
					$Type: "com.sap.vocabularies.Common.v1.ValueListType",
					CollectionPath: "Customer",
					Label: "Sold-to Party",
					Parameters: [
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
							ValueListProperty: "OrganizationBPName1",
							vExpectedValue: undefined,
							sMessage: " showing return value 'undefined'"
						},
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterInOut",
							LocalDataProperty: {
								$PropertyPath: "SoldToParty"
							},
							ValueListProperty: "Customer",
							vExpectedValue: undefined,
							sMessage: " showing return value 'undefined'"
						},
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
							ValueListProperty: "CustomerName",
							vExpectedValue: undefined,
							sMessage: " showing return value 'undefined'"
						},
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
							ValueListProperty: "PostalCode",
							vExpectedValue: undefined,
							sMessage: " showing return value 'undefined'"
						},
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
							ValueListProperty: "CityName",
							vExpectedValue: undefined,
							sMessage: " showing return value 'undefined'"
						},
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
							ValueListProperty: "Country",
							vExpectedValue: undefined,
							sMessage: " showing return value 'undefined'"
						}
					],
					getObject: function() {
						return this;
					},
					vExpectedValue: "None",
					sExpectedMinScreenWidth: "416px",
					sExpectedTableItemsParameters: "{path: '/Customer', suspended : false, sorter: {path: 'Customer', ascending: true}}"
				}
			},
			{
				oValueList: {
					$model: {
						id: "id-4711-03",
						getMetaModel: function() {
							return {
								getObject: function(sPath) {
									if (sPath === "/Customer/OrganizationBPName1@com.sap.vocabularies.UI.v1.Hidden") {
										return true;
									}
								}
							};
						}
					},
					$Type: "com.sap.vocabularies.Common.v1.ValueListType",
					CollectionPath: "Customer",
					Label: "Sold-to Party",
					Parameters: [
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
							ValueListProperty: "OrganizationBPName1",
							vExpectedValue: undefined,
							sMessage: " showing return value 'undefined'"
						},
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterOut",
							LocalDataProperty: {
								$PropertyPath: "SoldToParty"
							},
							ValueListProperty: "Customer",
							vExpectedValue: undefined,
							sMessage: " showing return value 'undefined'"
						},
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
							ValueListProperty: "CustomerName",
							vExpectedValue: undefined,
							sMessage: " showing return value 'undefined'"
						},
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
							ValueListProperty: "PostalCode",
							vExpectedValue: undefined,
							sMessage: " showing return value 'undefined'"
						},
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
							ValueListProperty: "CityName",
							vExpectedValue: undefined,
							sMessage: " showing return value 'undefined'"
						},
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
							ValueListProperty: "Country",
							vExpectedValue: undefined,
							sMessage: " showing return value 'undefined'"
						}
					],
					getObject: function() {
						return this;
					},
					vExpectedValue: "None",
					sExpectedMinScreenWidth: "416px",
					sExpectedTableItemsParameters: "{path: '/Customer', suspended : false, sorter: {path: 'Customer', ascending: true}}"
				}
			},
			{
				oValueList: {
					$model: {
						id: "id-4711-04",
						getMetaModel: function() {
							return {
								getObject: function(sPath) {
									if (sPath === "/Customer/OrganizationBPName1@com.sap.vocabularies.UI.v1.Hidden") {
										return true;
									}
								}
							};
						}
					},
					bSuggested: true,
					$Type: "com.sap.vocabularies.Common.v1.ValueListType",
					CollectionPath: "Customer",
					Label: "Sold-to Party",
					Parameters: [
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
							ValueListProperty: "OrganizationBPName1",
							vExpectedValue: undefined,
							sMessage: " showing return value 'undefined'"
						},
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterOut",
							LocalDataProperty: {
								$PropertyPath: "SoldToParty"
							},
							ValueListProperty: "Customer",
							vExpectedValue: undefined,
							sMessage: " showing return value 'undefined'"
						},
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
							ValueListProperty: "CustomerName",
							vExpectedValue: undefined,
							sMessage: " showing return value 'undefined'"
						},
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
							ValueListProperty: "PostalCode",
							vExpectedValue: undefined,
							sMessage: " showing return value 'undefined'"
						},
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
							ValueListProperty: "CityName",
							vExpectedValue: undefined,
							sMessage: " showing return value 'undefined'"
						},
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
							ValueListProperty: "Country",
							vExpectedValue: undefined,
							sMessage: " showing return value 'undefined'"
						}
					],
					getObject: function() {
						return this;
					},
					vExpectedValue: "None",
					sExpectedMinScreenWidth: "416px",
					sExpectedTableItemsParameters: "{path: '/Customer', suspended : true, sorter: {path: 'Customer', ascending: true}}"
				}
			},
			{
				oValueList: {
					$model: {
						id: "id-4711-05",
						getMetaModel: function() {
							return {
								getObject: function(sPath) {
									if (sPath === "/Customer/OrganizationBPName1@com.sap.vocabularies.UI.v1.Hidden") {
										return true;
									}
								}
							};
						}
					},
					bSuggested: false,
					$Type: "com.sap.vocabularies.Common.v1.ValueListType",
					CollectionPath: "Customer",
					Label: "Sold-to Party",
					Parameters: [
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
							ValueListProperty: "OrganizationBPName1",
							vExpectedValue: undefined,
							sMessage: " showing return value 'undefined'"
						},
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterOut",
							LocalDataProperty: {
								$PropertyPath: "SoldToParty"
							},
							ValueListProperty: "Customer",
							vExpectedValue: undefined,
							sMessage: " showing return value 'undefined'"
						},
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
							ValueListProperty: "CustomerName",
							vExpectedValue: undefined,
							sMessage: " showing return value 'undefined'"
						},
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
							ValueListProperty: "PostalCode",
							vExpectedValue: undefined,
							sMessage: " showing return value 'undefined'"
						},
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
							ValueListProperty: "CityName",
							vExpectedValue: undefined,
							sMessage: " showing return value 'undefined'"
						},
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
							ValueListProperty: "Country",
							vExpectedValue: undefined,
							sMessage: " showing return value 'undefined'"
						}
					],
					getObject: function() {
						return this;
					},
					vExpectedValue: "None",
					sExpectedMinScreenWidth: "416px",
					sExpectedTableItemsParameters: "{path: '/Customer', suspended : false, sorter: {path: 'Customer', ascending: true}}"
				}
			},
			{
				oValueList: {
					$model: {
						id: "id-4711-06",
						getMetaModel: function() {
							return {
								getObject: function(sPath) {
									if (sPath === "/Customer/OrganizationBPName1@com.sap.vocabularies.UI.v1.Hidden") {
										return true;
									}
								}
							};
						}
					},
					bSuggested: false,
					$Type: "com.sap.vocabularies.Common.v1.ValueListType",
					CollectionPath: "Customer",
					Label: "Sold-to Party",
					Parameters: [
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
							ValueListProperty: "OrganizationBPName1",
							vExpectedValue: undefined,
							sMessage: " showing return value 'undefined'"
						},
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterInOut",
							LocalDataProperty: {
								$PropertyPath: "SoldToParty"
							},
							ValueListProperty: "Customer",
							vExpectedValue: undefined,
							sMessage: " showing return value 'undefined'"
						},
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
							ValueListProperty: "CustomerName",
							vExpectedValue: undefined,
							sMessage: " showing return value 'undefined'"
						},
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
							ValueListProperty: "PostalCode",
							vExpectedValue: undefined,
							sMessage: " showing return value 'undefined'"
						},
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
							ValueListProperty: "CityName",
							vExpectedValue: undefined,
							sMessage: " showing return value 'undefined'"
						},
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
							ValueListProperty: "Country",
							vExpectedValue: undefined,
							sMessage: " showing return value 'undefined'"
						}
					],
					getObject: function() {
						return this;
					},
					vExpectedValue: "None",
					sExpectedMinScreenWidth: "416px",
					sExpectedTableItemsParameters: "{path: '/Customer', suspended : false, sorter: {path: 'Customer', ascending: true}}"
				}
			},
			{
				oValueList: {
					$model: {
						id: "id-4711-07",
						getMetaModel: function() {
							return {
								getObject: function(sPath) {
									if (sPath === "/Customer/OrganizationBPName1@com.sap.vocabularies.UI.v1.Hidden") {
										return true;
									}
								}
							};
						}
					},
					bSuggested: false,
					$Type: "com.sap.vocabularies.Common.v1.ValueListType",
					CollectionPath: "Customer",
					Label: "Sold-to Party",
					Parameters: [
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
							ValueListProperty: "OrganizationBPName1",
							vExpectedValue: undefined,
							sMessage: " showing return value 'undefined'"
						},
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterInOut",
							LocalDataProperty: {
								$PropertyPath: "SoldToParty"
							},
							ValueListProperty: "Customer",
							vExpectedValue: undefined,
							sMessage: " showing return value 'undefined'"
						},
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterIn",
							LocalDataProperty: {
								$PropertyPath: "SalesOrganization"
							},
							ValueListProperty: "SalesOrganization",
							vExpectedValue: undefined,
							sMessage: " showing return value 'undefined'"
						},
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
							ValueListProperty: "CustomerName",
							vExpectedValue: undefined,
							sMessage: " showing return value 'undefined'"
						},
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
							ValueListProperty: "PostalCode",
							vExpectedValue: undefined,
							sMessage: " showing return value 'undefined'"
						},
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
							ValueListProperty: "CityName",
							vExpectedValue: undefined,
							sMessage: " showing return value 'undefined'"
						},
						{
							$Type: "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly",
							ValueListProperty: "Country",
							vExpectedValue: undefined,
							sMessage: " showing return value 'undefined'"
						}
					],
					getObject: function() {
						return this;
					},
					vExpectedValue: "None",
					sExpectedMinScreenWidth: "416px",
					sExpectedTableItemsParameters: "{path: '/Customer', suspended : true, sorter: {path: 'Customer', ascending: true}}"
				}
			}
		].forEach(function(oProperty) {
			oProperty.oValueList.Parameters.forEach(function(oParameter) {
				var actualValue = ValueListHelper.getColumnVisibility(oProperty.oValueList, oParameter);
				assert.equal(
					actualValue,
					oParameter.vExpectedValue,
					"Unit test to check getColumnVisibility " + oParameter.sMessage + ": ok"
				);
			});

			var actualValue = ValueListHelper.hasImportance(oProperty.oValueList);
			assert.equal(
				actualValue,
				oProperty.oValueList.vExpectedValue,
				"Unit test to check hasImportance returning '" + actualValue + "': ok"
			);
			actualValue = ValueListHelper.getMinScreenWidth(oProperty.oValueList);
			assert.equal(
				actualValue,
				oProperty.oValueList.sExpectedMinScreenWidth,
				"Unit test to check getMinScreenWidth returning '" + actualValue + "': ok"
			);
			actualValue = ValueListHelper.getTableItemsParameters(oProperty.oValueList, null, oProperty.oValueList.bSuggested);
			assert.equal(
				actualValue,
				oProperty.oValueList.sExpectedTableItemsParameters,
				"Unit test to check getTableItemsParameters returning '" + actualValue + "': ok"
			);
		});
	});
	QUnit.test("Unit test for calculating the width of popover table based on columns width for value help", function(assert) {
		[
			{
				getColumns: function() {
					var columnInfo = [
						{
							getVisible: function() {
								return true;
							},
							getWidth: function() {
								return "7em";
							}
						},
						{
							getVisible: function() {
								return true;
							},
							getWidth: function() {
								return "auto";
							}
						},
						{
							getVisible: function() {
								return false;
							},
							getWidth: function() {
								return "auto";
							}
						}
					];
					return columnInfo;
				},
				minWidth: 10,
				expectedOutput: "18em"
			},
			{
				getColumns: function() {
					var columnInfo = [
						{
							getVisible: function() {
								return true;
							},
							getWidth: function() {
								return "7em";
							}
						},
						{
							getVisible: function() {
								return true;
							},
							getWidth: function() {
								return "auto";
							}
						},
						{
							getVisible: function() {
								return false;
							},
							getWidth: function() {
								return "auto";
							}
						}
					];
					return columnInfo;
				},
				minWidth: 50,
				expectedOutput: "50em"
			},
			{
				getColumns: function() {
					var columnInfo = [];
					return columnInfo;
				},
				minWidth: -1,
				expectedOutput: "0em"
			},
			{
				getColumns: function() {
					var columnInfo = [];
					return columnInfo;
				},
				minWidth: 10,
				expectedOutput: "10em"
			}
		].forEach(function(oTable) {
			var actualValue = ValueListHelper.getTableWidth(oTable, oTable.minWidth);
			assert.equal(
				actualValue,
				oTable.expectedOutput,
				"Unit test to calculate table width based on columns '" + actualValue + "': ok"
			);
		});
	});
	QUnit.test("Unit test for getting popover column width based on data type", function(assert) {
		[
			{
				Input: "Edm.Stream",
				Expected: "7em"
			},
			{
				Input: "Edm.Boolean",
				Expected: "8em"
			},
			{
				Input: "Edm.Date",
				Expected: "9em"
			},
			{
				Input: "Edm.TimeOfDay",
				Expected: "9em"
			},
			{
				Input: "Edm.DateTimeOffset",
				Expected: "12em"
			},
			{
				Input: "Edm.ForDefaultCase",
				Expected: "auto"
			}
		].forEach(function(sDataFieldType) {
			var actualValue = ValueListHelper.getColumnWidth(sDataFieldType.Input);
			assert.equal(actualValue, sDataFieldType.Expected, "Unit test to check getColumnWidth returning '" + actualValue + "': ok");
		});
	});
});
