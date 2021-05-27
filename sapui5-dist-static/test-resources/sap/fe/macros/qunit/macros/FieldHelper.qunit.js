/* eslint-disable consistent-return */
/* global QUnit sinon */
sap.ui.define(
	[
		"sap/fe/macros/field/FieldHelper",
		"sap/ui/model/odata/v4/AnnotationHelper",
		"sap/fe/macros/CommonHelper",
		"sap/ui/base/ManagedObject",
		"sap/base/Log",
		"sap/fe/macros/ResourceModel",
		"sap/ui/model/json/JSONModel"
	],
	function(FieldHelper, AnnotationHelper, commonHelper, ManagedObject, Log, ResourceModel, JSONModel) {
		"use strict";
		var sandbox = sinon.sandbox.create();
		QUnit.module("Unit Test for isLineItem", {
			beforeEach: function() {}
		});
		QUnit.test("Unit test to check isLineItem ", function(assert) {
			[
				{
					oInterface: {
						context: {
							getPath: function() {
								return "@com.sap.vocabularies.UI.v1.LineItem";
							}
						}
					},
					bExpectedValue: true,
					sMessage: "with line item in path"
				},
				{
					oInterface: {
						context: {
							getPath: function() {
								return "";
							}
						}
					},
					bExpectedValue: false,
					sMessage: "without line item in path"
				}
			].forEach(function(oProperty) {
				var oValue = "";
				var actualValue = FieldHelper.isLineItem(oValue, oProperty.oInterface);
				assert.equal(actualValue, oProperty.bExpectedValue, "Unit test to check isLineItem " + oProperty.sMessage + ": ok");
			});
		});

		QUnit.module("Unit Test for getRequiredForDataField");

		QUnit.test("Unit test to check requiredForDataField ", function(assert) {
			[
				{
					oFieldControl: "com.sap.vocabularies.Common.v1.FieldControlType/Mandatory",
					expectedValue: false,
					sMessage: "without editmode and with Field Control Enum Member"
				},
				{
					expectedValue: false,
					sMessage: "without Field Control and EditMode"
				},
				{
					oFieldControl: "{height}",
					expectedValue: false,
					sMessage: "with Field Control Path without EditMode"
				},
				{
					editMode: "{ui>/editMode}",
					expectedValue: false,
					sMessage: "without Field Control Path with EditMode"
				},
				{
					sEditMode: "{ui>/editMode}",
					oFieldControl: "com.sap.vocabularies.Common.v1.FieldControlType/Mandatory",
					expectedValue: "{= %{ui>/editMode} === 'Editable'}",
					sMessage: "with nullable true and Field Control Enum Member with EditMode"
				},
				{
					sEditMode: "{ui>/editMode}",
					oFieldControl: "{height}",
					expectedValue: "{= %{height} === 7 && %{ui>/editMode} === 'Editable'}",
					sMessage: "with Field Control Path and EditMode"
				},
				{
					sEditMode: "Editable",
					oFieldControl: "com.sap.vocabularies.Common.v1.FieldControlType/Mandatory",
					expectedValue: true,
					sMessage: "with nullable true and Field Control Enum Member with EditMode"
				},
				{
					sEditMode: "Display",
					expectedValue: false,
					sMessage: "with Edit Mode as Display"
				}
			].forEach(function(oProperty) {
				var actualValue = FieldHelper.getRequiredForDataField(oProperty.oFieldControl, oProperty.sEditMode);
				assert.equal(
					actualValue,
					oProperty.expectedValue,
					"Unit test to check requiredForDataField " + oProperty.sMessage + ": ok"
				);
			});
		});

		QUnit.module("Unit Test for getImportance");

		QUnit.test("Unit test to check getImportance ", function(assert) {
			[
				{
					oDataField: { "$Type": "com.sap.vocabularies.UI.v1.DataField", "Value": { "$Path": "ID" } },
					aSemanticKeys: [{ "$PropertyPath": "ID" }],
					aFieldGroupData: "",
					expectedValue: "High",
					sMessage: "with DataField, semantic key and NO importance"
				},
				{
					oDataField: {
						"@com.sap.vocabularies.UI.v1.Importance": { "$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/Low" },
						"$Type": "com.sap.vocabularies.UI.v1.DataField",
						"Value": { "$Path": "ID" }
					},
					aSemanticKeys: [{ "$PropertyPath": "ID" }],
					aFieldGroupData: "",
					expectedValue: "Low",
					sMessage: "with DataField, semantic key and importance"
				},
				{
					oDataField: { "$Type": "com.sap.vocabularies.UI.v1.DataField", "Value": { "$Path": "ID" } },
					aSemanticKeys: [],
					aFieldGroupData: "",
					expectedValue: "None",
					sMessage: "with DataField, NO semantic key and NO importance"
				},
				{
					oDataField: {
						"$Type": "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
						"Target": {
							"$AnnotationPath": "_CreditLimitDetails/@com.sap.vocabularies.UI.v1.Chart#RadialCriticalityPathHidden"
						},
						"Label": "Credit Limit Details"
					},
					aSemanticKeys: [],
					aFieldGroupData: "",
					expectedValue: "None",
					sMessage: "with DataFieldForAnnotation, NO semantic key and NO importance"
				},
				{
					oDataField: {
						"$Type": "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
						"Target": {
							"$AnnotationPath": "_CreditLimitDetails/@com.sap.vocabularies.UI.v1.Chart#RadialCriticalityPathHidden"
						},
						"Label": "Credit Limit Details"
					},
					aSemanticKeys: [{ "$PropertyPath": "ID" }],
					aFieldGroupData: "",
					expectedValue: "None",
					sMessage: "with DataFieldForAnnotation (no FieldGroup), NO semantic key and NO importance"
				},
				{
					oDataField: {
						"@com.sap.vocabularies.UI.v1.Importance": { "$EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/Low" },
						"$Type": "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
						"Target": { "$AnnotationPath": "@com.sap.vocabularies.UI.v1.FieldGroup#multipleActionFields" },
						"Label": "Sold-To Party"
					},
					aSemanticKeys: [{ "$PropertyPath": "ID" }],
					aFieldGroupData: [
						{ "$Type": "com.sap.vocabularies.UI.v1.DataField", "Value": { "$Path": "SoldToParty" } },
						{
							"$Type": "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
							"Target": { "$AnnotationPath": "@com.sap.vocabularies.UI.v1.DataPoint#Rating" }
						},
						{ "$Type": "com.sap.vocabularies.UI.v1.DataField", "Value": { "$Path": "ID" } }
					],
					expectedValue: "Low",
					sMessage: "with DataFieldForAnnotation (FieldGroup), semantic key used inthe FieldGroup and importance defined"
				},
				{
					oDataField: {
						"$Type": "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
						"Target": { "$AnnotationPath": "@com.sap.vocabularies.UI.v1.FieldGroup#multipleActionFields" },
						"Label": "Sold-To Party"
					},
					aSemanticKeys: [{ "$PropertyPath": "ID" }],
					aFieldGroupData: [
						{ "$Type": "com.sap.vocabularies.UI.v1.DataField", "Value": { "$Path": "SoldToParty" } },
						{
							"$Type": "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
							"Target": { "$AnnotationPath": "@com.sap.vocabularies.UI.v1.DataPoint#Rating" }
						},
						{ "$Type": "com.sap.vocabularies.UI.v1.DataField", "Value": { "$Path": "ID" } }
					],
					expectedValue: "High",
					sMessage: "with DataFieldForAnnotation (FieldGroup), semantic key used inthe FieldGroup and NO importance defined"
				}
			].forEach(function(oProperty) {
				var actualValue = FieldHelper.getImportance(oProperty.oDataField, oProperty.aSemanticKeys, oProperty.aFieldGroupData);
				assert.equal(actualValue, oProperty.expectedValue, "Unit test to check getImportance " + oProperty.sMessage + ": ok");
			});
		});

		QUnit.module("Unit Test for buildExpressionForCriticalityIcon");

		QUnit.test("Unit test to check buildExpressionForCriticalityIcon ", function(assert) {
			[
				{
					sCriticalityProperty: "height",
					expectedValue:
						"{= (${height} === 'com.sap.vocabularies.UI.v1.CriticalityType/Negative') || (${height} === '1') || (${height} === 1) ? 'sap-icon://message-error' : " +
						"(${height} === 'com.sap.vocabularies.UI.v1.CriticalityType/Critical') || (${height} === '2') || (${height} === 2) ? 'sap-icon://message-warning' : " +
						"(${height} === 'com.sap.vocabularies.UI.v1.CriticalityType/Positive') || (${height} === '3') || (${height} === 3) ? 'sap-icon://message-success' : " +
						"(${height} === 'com.sap.vocabularies.UI.v1.CriticalityType/Information') || (${height} === '5') || (${height} === 5) ? 'sap-icon://message-information' : " +
						"'' }",
					sMessage: "with Criticality Property"
				},
				{
					sMessage: "without Criticality Property"
				}
			].forEach(function(oProperty) {
				var actualValue = FieldHelper.buildExpressionForCriticalityIcon(oProperty.sCriticalityProperty);
				assert.equal(
					actualValue,
					oProperty.expectedValue,
					"Unit test to check buildExpressionForCriticalityIcon " + oProperty.sMessage + ": ok"
				);
			});
		});
		QUnit.module("Unit Test for buildExpressionForCriticalityColor");

		QUnit.test("Unit Test to check buildExpressionForCriticalityColor", function(assert) {
			[
				{
					oDataPoint: {
						Description: "Progress Indicator",
						Title: {
							$Path: "name"
						},
						Value: {
							$Decimal: "25"
						},
						Visualization: {
							$EnumMember: "com.sap.vocabularies.UI.v1.VisualizationType/Progress"
						}
					},
					sExpectedValue: "None",
					sMessage: "when Criticality is not provided"
				},
				{
					oDataPoint: {
						Description: "Progress Indicator",
						Title: {
							$Path: "name"
						},
						Value: {
							$Decimal: "25"
						},
						Visualization: {
							$EnumMember: "com.sap.vocabularies.UI.v1.VisualizationType/Progress"
						},
						Criticality: {
							$Path: "availability_code"
						}
					},
					sExpectedValue:
						"{= (${availability_code} === 'com.sap.vocabularies.UI.v1.CriticalityType/Negative') || (${availability_code} === '1') || (${availability_code} === 1) ? 'Error' : (${availability_code} === 'com.sap.vocabularies.UI.v1.CriticalityType/Critical') || (${availability_code} === '2') || (${availability_code} === 2) ? 'Warning' : (${availability_code} === 'com.sap.vocabularies.UI.v1.CriticalityType/Positive') || (${availability_code} === '3') || (${availability_code} === 3) ? 'Success' : (${availability_code} === 'com.sap.vocabularies.UI.v1.CriticalityType/Information') || (${availability_code} === '5') || (${availability_code} === 5) ? 'Indication05' : 'None' }",
					sMessage: "when Criticality is provided"
				},
				{
					oDataPoint: {
						Description: "Progress Indicator",
						Title: {
							$Path: "name"
						},
						Value: {
							$Decimal: "25"
						},
						Visualization: {
							$EnumMember: "com.sap.vocabularies.UI.v1.VisualizationType/Progress"
						},
						Criticality: {
							$EnumMember: "com.sap.vocabularies.UI.v1.CriticalityType/Positive"
						}
					},
					sExpectedValue:
						"{= ('com.sap.vocabularies.UI.v1.CriticalityType/Positive' === 'com.sap.vocabularies.UI.v1.CriticalityType/Negative') || ('com.sap.vocabularies.UI.v1.CriticalityType/Positive' === '1') || ('com.sap.vocabularies.UI.v1.CriticalityType/Positive' === 1) ? 'Error' : ('com.sap.vocabularies.UI.v1.CriticalityType/Positive' === 'com.sap.vocabularies.UI.v1.CriticalityType/Critical') || ('com.sap.vocabularies.UI.v1.CriticalityType/Positive' === '2') || ('com.sap.vocabularies.UI.v1.CriticalityType/Positive' === 2) ? 'Warning' : ('com.sap.vocabularies.UI.v1.CriticalityType/Positive' === 'com.sap.vocabularies.UI.v1.CriticalityType/Positive') || ('com.sap.vocabularies.UI.v1.CriticalityType/Positive' === '3') || ('com.sap.vocabularies.UI.v1.CriticalityType/Positive' === 3) ? 'Success' : ('com.sap.vocabularies.UI.v1.CriticalityType/Positive' === 'com.sap.vocabularies.UI.v1.CriticalityType/Information') || ('com.sap.vocabularies.UI.v1.CriticalityType/Positive' === '5') || ('com.sap.vocabularies.UI.v1.CriticalityType/Positive' === 5) ? 'Indication05' : 'None' }",
					sMessage: "when Criticality Enum Member is provided"
				},
				{
					oDataPoint: {
						Description: "Progress Indicator",
						Title: {
							$Path: "name"
						},
						Value: {
							$Decimal: "25"
						},
						Visualization: {
							$EnumMember: "com.sap.vocabularies.UI.v1.VisualizationType/Progress"
						},
						Criticality: {
							$Path: ""
						}
					},
					sExpectedValue: "None",
					sMessage: "hen Criticality is provided, but Path/EnumMember not provided"
				}
			].forEach(function(oProperty) {
				var sActualValue = FieldHelper.buildExpressionForCriticalityColor(oProperty.oDataPoint);
				assert.equal(
					sActualValue,
					oProperty.sExpectedValue,
					"buildExpressionForCriticality " + oProperty.sMessage + " is checked correctly"
				);
			});
		});

		QUnit.module("Unit Test for isSemanticKey");

		QUnit.test("Unit test to check isSemanticKey ", function(assert) {
			[
				{
					oValue: {
						$Path: "reviewer"
					},
					aSemanticKeys: undefined,
					expectedValue: false,
					sMessage: "with no semantic key - undefined"
				},
				{
					oValue: {
						$Path: "reviewer"
					},
					aSemanticKeys: [],
					expectedValue: false,
					sMessage: "with no semantic key - empty"
				},
				{
					oValue: undefined,
					aSemanticKeys: [
						{
							$PropertyPath: "id"
						}
					],
					expectedValue: false,
					sMessage: "with no property value"
				},
				{
					oValue: {
						$Path: "id"
					},
					aSemanticKeys: [
						{
							$PropertyPath: "id"
						}
					],
					expectedValue: true,
					sMessage: "with semantic key"
				}
			].forEach(function(oProperty) {
				var actualValue = FieldHelper.isSemanticKey(oProperty.aSemanticKeys, oProperty.oValue);
				assert.equal(actualValue, oProperty.expectedValue, "Unit test to check isSemanticKey " + oProperty.sMessage + ":  ok");
			});
		});

		QUnit.module("Unit Test for isNotAlwaysHidden");

		QUnit.test("Unit test to check isNotAlwaysHidden ", function(assert) {
			[
				{
					oDetails: {
						context: {
							getObject: function(objName) {
								if (objName == "Value/$Path@com.sap.vocabularies.UI.v1.Hidden") {
									return true;
								}
							}
						}
					},
					oDataField: {
						Value: {
							"$Path": "height"
						}
					},
					expectedValue: false,
					sMessage: "with DataField Value as true"
				},
				{
					oDetails: {
						context: {
							getObject: function(objName) {
								if (objName == "Value/$Path@com.sap.vocabularies.UI.v1.Hidden") {
									return false;
								}
							}
						}
					},
					oDataField: {
						Value: {
							"$Path": "height"
						}
					},
					expectedValue: true,
					sMessage: "with DataField Value as false"
				},
				{
					oDetails: {
						context: {
							getObject: function(objName) {
								if (objName == "Value/$Path@com.sap.vocabularies.UI.v1.Hidden") {
									return {
										"$Path": "height"
									};
								}
								if (objName == "@com.sap.vocabularies.UI.v1.Hidden") {
									return true;
								}
							}
						}
					},
					oDataField: {
						Value: {
							"$Path": "height"
						}
					},
					expectedValue: false,
					sMessage: "with DataField Value as true and has $Path"
				},
				{
					oDetails: {
						context: {
							getObject: function(objName) {
								if (objName == "Value/$Path@com.sap.vocabularies.UI.v1.Hidden") {
									return {
										"$Path": "height"
									};
								}
								if (objName == "@com.sap.vocabularies.UI.v1.Hidden") {
									return false;
								}
							}
						}
					},
					oDataField: {
						Value: {
							"$Path": "height"
						}
					},
					expectedValue: true,
					sMessage: "with DataField Value as false and has $Path"
				}
			].forEach(function(oProperty) {
				var actualValue = FieldHelper.isNotAlwaysHidden(oProperty.oDataField, oProperty.oDetails);
				assert.equal(actualValue, oProperty.expectedValue, "Unit test to check isNotAlwaysHidden " + oProperty.sMessage + ":  ok");
				sandbox.restore();
			});
		});
		QUnit.module("Unit Test for buildExpressionForTextValue");

		QUnit.test("Unit test to check buildExpressionForTextValue ", function(assert) {
			[
				{
					oDataField: {
						context: {
							getModel: function() {
								return {
									getObject: function(objName) {
										return {
											"$Path": "CountryOfOrigin_Text"
										};
									},
									createBindingContext: function() {
										return {
											getProperty: function() {
												return "CountryOfOrigin";
											}
										};
									}
								};
							},
							getPath: function() {
								return "/Artists/@com.sap.vocabularies.UI.v1.LineItem/2/Value/$Path";
							}
						}
					},
					valueStub: "{CountryOfOrigin_Text}",
					getNavigationPathStub: "Publications/InternalPublications/CountryOfOrigin",
					sPropertyPath: "CountryOfOrigin",
					expectedValue: "{ path : 'Publications/InternalPublications/CountryOfOrigin_Text', parameters: {'$$noPatch': true}}",
					sMessage: "with Text annotation"
				},
				{
					oDataField: {
						context: {
							getModel: function() {
								return {
									getObject: function() {
										return "";
									},
									createBindingContext: function() {
										return {
											getProperty: function() {
												return "CountryOfOrigin";
											}
										};
									}
								};
							},
							getPath: function() {
								return "";
							}
						}
					},
					getNavigationPathStub: "CountryOfOrigin",
					sPropertyPath: "CountryOfOrigin",
					expectedValue: undefined,
					sMessage: "without Text annotation"
				}
			].forEach(function(oProperty) {
				sandbox.stub(AnnotationHelper, "value").callsFake(function() {
					return oProperty.valueStub;
				});
				sandbox.stub(AnnotationHelper, "getNavigationPath").callsFake(function() {
					return oProperty.getNavigationPathStub;
				});
				var actualValue = FieldHelper.buildExpressionForTextValue(oProperty.sPropertyPath, oProperty.oDataField);
				assert.equal(
					actualValue,
					oProperty.expectedValue,
					"Unit test to check buildExpressionForTextValue " + oProperty.sMessage + ":  ok"
				);
				sandbox.restore();
			});
		});

		QUnit.module("Unit Test for computed anntotation @@fieldControl for DataFields");

		QUnit.test("Unit test to check @@fieldControl", function(assert) {
			[
				{
					sPropertyPath: "BreakUpYear",
					oInterface: {
						context: {
							getPath: function(sPath) {
								return "/Artists/@com.sap.vocabularies.UI.v1.LineItem/2/Value/$Path";
							},
							getModel: function() {
								return {
									getObject: function(sPath) {
										return {
											"$Path": "__FieldControl/BreakUpYear"
										};
									},
									createBindingContext: function() {
										return {
											getProperty: function() {
												return {
													"$Path": "__FieldControl/BreakUpYear"
												};
											}
										};
									}
								};
							}
						}
					},
					expectedValue: "{__FieldControl/BreakUpYear}",
					sMessage: "with Field Control as path (dynamic)"
				},
				{
					sPropertyPath: "Name",
					oInterface: {
						context: {
							getPath: function(sPath) {
								return "/Artists/@com.sap.vocabularies.UI.v1.LineItem/2/Value/$Path";
							},
							getModel: function() {
								return {
									getObject: function(sPath) {
										return {
											"$EnumMember": "com.sap.vocabularies.Common.v1.FieldControlType/ReadOnly"
										};
									},
									createBindingContext: function() {
										return {
											getProperty: function() {
												return {
													"$EnumMember": "com.sap.vocabularies.Common.v1.FieldControlType/ReadOnly"
												};
											}
										};
									}
								};
							}
						}
					},
					expectedValue: "com.sap.vocabularies.Common.v1.FieldControlType/ReadOnly",
					sMessage: "with Field Control as EnumMember (static)"
				},
				{
					oInterface: {
						context: {
							getPath: function(sPath) {},
							getModel: function() {
								return {
									getObject: function() {
										return "";
									},
									createBindingContext: function() {
										return {
											getProperty: function() {
												return "";
											}
										};
									}
								};
							}
						}
					},
					sMessage: "without FieldControl"
				}
			].forEach(function(oProperty) {
				sandbox.stub(AnnotationHelper, "value").callsFake(function() {
					return "{__FieldControl/BreakUpYear}";
				});
				var actualValue = FieldHelper.fieldControl(oProperty.sPropertyPath, oProperty.oInterface);
				assert.equal(actualValue, oProperty.expectedValue, "Unit test to check @@fieldControl " + oProperty.sMessage + ":  ok");
				sandbox.restore();
			});
		});

		QUnit.module("Unit Test for computed anntotation @@displayMode", {
			beforeEach: function() {},
			afterEach: function() {
				sandbox.restore();
			}
		});

		QUnit.test("Unit test to check @@displayMode", function(assert) {
			[
				{
					propertyAnnotations: {},
					expectedValue: "Value",
					info: "No annotations"
				},
				{
					propertyAnnotations: {
						"@com.sap.vocabularies.Common.v1.Text": {}
					},
					expectedValue: "DescriptionValue",
					info: "Common.Text (w/o TextArrangement)"
				},
				{
					propertyAnnotations: {
						"@com.sap.vocabularies.Common.v1.Text": {},
						"@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement": {
							$EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"
						}
					},
					expectedValue: "Description",
					info: "Common.Text with TextArrangement TextOnly"
				},
				{
					propertyAnnotations: {
						"@com.sap.vocabularies.Common.v1.Text": {},
						"@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement": {
							$EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst"
						}
					},
					expectedValue: "DescriptionValue",
					info: "Common.Text with TextArrangement TextFirst"
				},
				{
					propertyAnnotations: {
						"@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement": {}
					},
					expectedValue: "Value",
					info: "No Common.Text but TextArrangement (which would be a wrong annotation)"
				},
				{
					propertyAnnotations: {
						"@com.sap.vocabularies.Common.v1.Text": {},
						"@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement": {
							$EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextSeparate"
						}
					},
					expectedValue: "DescriptionValue",
					info: "Common.Text with TextArrangement TextSeparate"
				},
				{
					propertyAnnotations: {
						"@com.sap.vocabularies.Common.v1.Text": {}
					},
					collectionAnnotations: {},
					expectedValue: "DescriptionValue",
					info: "Common.Text (w/o TextArrangement)"
				},
				{
					propertyAnnotations: {
						"@com.sap.vocabularies.Common.v1.Text": {}
					},
					collectionAnnotations: {
						"@com.sap.vocabularies.UI.v1.TextArrangement": {
							$EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"
						}
					},
					expectedValue: "Description",
					info: "Common.Text with TextArrangement TextOnly"
				},
				{
					propertyAnnotations: {
						"@com.sap.vocabularies.Common.v1.Text": {}
					},
					collectionAnnotations: {
						"@com.sap.vocabularies.UI.v1.TextArrangement": {
							$EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst"
						}
					},
					expectedValue: "DescriptionValue",
					info: "Common.Text with TextArrangement TextFirst"
				},
				{
					propertyAnnotations: {
						"@com.sap.vocabularies.Common.v1.Text": {},
						"@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement": {
							$EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextLast"
						}
					},
					collectionAnnotations: {
						"@com.sap.vocabularies.UI.v1.TextArrangement": {
							$EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"
						}
					},
					expectedValue: "ValueDescription",
					info: "Common.Text with Text arrangement of property type and entity type"
				},
				{
					propertyAnnotations: {},
					collectionAnnotations: {
						"@com.sap.vocabularies.UI.v1.TextArrangement": {
							$EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"
						}
					},
					expectedValue: "Value",
					info: "No Common.Text but TextArrangement (which would be a wrong annotation)"
				}
			].forEach(function(oTest) {
				assert.equal(
					FieldHelper.displayMode(oTest.propertyAnnotations, oTest.collectionAnnotations),
					oTest.expectedValue,
					oTest.info + " correctly computed " + oTest.expectedValue
				);
			});
		});

		/* NEEDS TO BE REWORKED
		QUnit.module("Unit Test for computed anntotation @@value for DataFields", {
			beforeEach: function () {

			},
			afterEach: function () {
				sandbox.restore();
			}
		});
		QUnit.test("Unit test to check @@value", function (assert) {
			var done = assert.async(), aPromises = [];
			[{
				dataField: { $Path: "Name" },
				testnamePostfix: "",
				$kind: "Property", $Type: "Edm.String",
				annotations: {},
				expectedValue: "{path: 'Name',type: 'sap.ui.model.odata.type.String'}"
			},{
				dataField: { $Path: "UnitCode" },
				testnamePostfix: " with $MaxLength: 3",
				$kind: "Property", $Type: "Edm.String", $MaxLength: 3, $Nullable: false,
				annotations: {},
				expectedValue: "{path: 'UnitCode',type: 'sap.ui.model.odata.type.String',constraints: {nullable: false, maxLength: 3}}"
			},{
				dataField: { $Path: "SomeDate" },
				testnamePostfix: "",
				$kind: "Property", $Type: "Edm.Date", $Nullable: true,
				annotations: {},
				expectedValue: "{path: 'SomeDate',type: 'sap.ui.model.odata.type.Date',formatOptions : {style : 'medium'}}"
			},
			{
				dataField: { $Path: "ProcessingStartDateTime" },
				testnamePostfix: "",
				"$kind": "Property",
				"$Type": "Edm.DateTimeOffset",
				"$Precision": 7,
				annotations: {},
				expectedValue: "{path: 'ProcessingStartDateTime',type: 'sap.ui.model.odata.type.DateTimeOffset',constraints: {precision: 7},formatOptions : {style : 'medium'}}"
			},{
				dataField: { $Path: "Price" },
				testnamePostfix: "that has a ISOCurrency",
				"$kind": "Property",
				"$Type": "Edm.Decimal",
				"$Precision": 10,
				"$Scale": 3,
				annotations: {
					"@Org.OData.Measures.V1.ISOCurrency": {
						$Path: "Currency"
					}
				},
				expectedValue: "{parts: ['Price','Currency'], type: 'sap.ui.model.type.Currency',constraints: {precision: 10, scale: 3},formatOptions : {parseAsString : true}}",
				exclude: "parameter"
			}].forEach(function(oProperty) {
				var oInterface = {
						context: {
							getPath: function () {
								return '/someType/' + oProperty.dataField.$Path;
							},
							getObject: function(sPath, oContext) {
								if (sPath === "@sapui.name") {
									return; //undefined
								} else if (sPath.indexOf("@") > -1) {
									return oProperty.annotations;
								} else if (!sPath) {
									return oProperty.dataField.$Path;
								} else {
									return oProperty;
								}
							},
							getModel: function () {
								return {
									getObject: function (sPath) {
										return sPath;
									},
									getProperty: function(sPath) {
										return sPath;
									},
									createBindingContext: function() {
										return oInterface.context;
									}
								};
							}
						}
					},
					oParam = Object.assign({}, oProperty);//Parameter clone
				oParam.testnamePostfix = "";
				oParam.$Name = oProperty.dataField.$Path;
				aPromises.push(Promise.all([
					FieldHelper.value(oProperty.dataField, oInterface).then(function(sResult) {
						assert.equal(sResult, oProperty.expectedValue, "[DataField]  " + oProperty.$Type + " " + oProperty.testnamePostfix + ": ok  ------> " + sResult );
					}),
					FieldHelper.value(oProperty, oInterface).then(function(sResult) {
						assert.equal(sResult, oProperty.expectedValue, "[Property]   " + oProperty.$Type + " " + oProperty.testnamePostfix + ": ok  ------> " + sResult );
					}),
					FieldHelper.value(oParam, oInterface).then(function(sResult) {
						if (oProperty.exclude && oProperty.exclude.indexOf("parameter") > -1) {
							assert.ok(true, "[Parameter]   " + oProperty.$Type + " " + oProperty.testnamePostfix + ": Not supported" );
						} else {
							assert.equal(sResult, oProperty.expectedValue, "[Parameter]   " + oProperty.$Type + " " + oProperty.testnamePostfix + ": ok  ------> " + sResult );
						}
					})
				]));
			});
			Promise.all(aPromises).then(function() {
				done();
			});
		});
		*/
		QUnit.module("Unit Test for getFieldGroupIds", {
			beforeEach: function() {},
			afterEach: function() {
				sandbox.restore();
			}
		});
		QUnit.test("Unit test to check getFieldGroupIds with/out SideEffects annotation", function(assert) {
			[
				{
					propertyPath: "property1",
					entityType: "namespace.EntityType1",
					container: {
						entitySet1: {
							"$kind": "EntitySet",
							"$Type": "namespace.EntityType1"
						},
						entitySet2: {
							"$kind": "EntitySet",
							"$Type": "namespace.EntityType2"
						},
						"namespace.EntityType1": {
							"$kind": "EntityType",
							property1: "property1",
							property2: "property2"
						},
						"namespace.EntityType2": {
							"$kind": "EntityType",
							property1: "property1",
							property2: "property2",
							navigationProperty: {
								"$Type": "namespace.EntityType1"
							}
						},
						"namespace.EntityType1@": {
							"@com.sap.vocabularies.Common.v1.SideEffects#Qualifier": {
								SourceProperties: [
									{
										"$PropertyPath": "property1"
									}
								],
								TargetProperties: [
									{
										"$PropertyPath": "property2"
									}
								]
							}
						},
						"namespace.EntityType2@": {
							"@com.sap.vocabularies.Common.v1.SideEffects#Qualifier": {
								SourceProperties: [
									{
										"$PropertyPath": "navigationProperty/property1"
									}
								],
								TargetProperties: [
									{
										"$PropertyPath": "property1"
									}
								]
							}
						}
					},
					expectedValue: "namespace.EntityType1#Qualifier$$ImmediateRequest,namespace.EntityType2#Qualifier$$ImmediateRequest"
				},
				{
					propertyPath: "property1",
					entityType: "namespace.EntityType1",
					container: {
						entitySet1: {
							"$kind": "EntitySet",
							"$Type": "namespace.EntityType1"
						},
						entitySet2: {
							"$kind": "EntitySet",
							"$Type": "namespace.EntityType2"
						},
						"namespace.EntityType1": {
							"$kind": "EntityType",
							property1: "property1",
							property2: "property2"
						},
						"namespace.EntityType2": {
							"$kind": "EntityType",
							property1: "property1",
							property2: "property2",
							navigationProperty: {
								"$Type": "namespace.EntityType1"
							}
						},
						"namespace.EntityType1@": {
							"@com.sap.vocabularies.Common.v1.SideEffects#Qualifier": {
								SourceProperties: [
									{
										"$PropertyPath": "property1"
									}
								],
								TargetProperties: [
									{
										"$PropertyPath": "property2"
									}
								]
							}
						},
						"namespace.EntityType2@": {
							"@com.sap.vocabularies.Common.v1.SideEffects#Qualifier": {
								SourceEntities: [
									{
										"$NavigationPropertyPath": "navigationProperty"
									}
								],
								TargetProperties: [
									{
										"$PropertyPath": "property1"
									}
								]
							}
						}
					},
					expectedValue: "namespace.EntityType2#Qualifier$$ImmediateRequest,namespace.EntityType1#Qualifier$$ImmediateRequest"
				},
				{
					propertyPath: "property1",
					entityType: "namespace.EntityType1",
					container: {
						entitySet1: {
							"$kind": "EntitySet",
							"$Type": "namespace.EntityType1"
						},
						entitySet2: {
							"$kind": "EntitySet",
							"$Type": "namespace.EntityType2"
						},
						"namespace.EntityType1": {
							"$kind": "EntityType",
							property1: "property1",
							property2: "property2"
						},
						"namespace.EntityType2": {
							"$kind": "EntityType",
							property1: "property1",
							property2: "property2",
							navigationProperty: {
								"$Type": "namespace.EntityType1"
							}
						},
						"namespace.EntityType1@": {
							"@com.sap.vocabularies.Common.v1.SideEffects#Qualifier": {
								SourceProperties: [
									{
										"$PropertyPath": "property1"
									},
									{
										"$PropertyPath": "property2"
									}
								],
								TargetProperties: [
									{
										"$PropertyPath": "property2"
									}
								]
							}
						},
						"namespace.EntityType2@": {
							"@com.sap.vocabularies.Common.v1.SideEffects#Qualifier": {
								SourceEntities: [
									{
										"$NavigationPropertyPath": "navigationProperty"
									}
								],
								TargetProperties: [
									{
										"$PropertyPath": "property1"
									}
								]
							}
						}
					},
					expectedValue: "namespace.EntityType2#Qualifier$$ImmediateRequest,namespace.EntityType1#Qualifier"
				},
				{
					propertyPath: "property1",
					container: {
						entitySet1: {
							"$kind": "EntitySet",
							"$Type": "namespace.EntityType1"
						},
						entitySet2: {
							"$kind": "EntitySet",
							"$Type": "namespace.EntityType2"
						},
						"namespace.EntityType1": {
							"$kind": "EntityType",
							property1: "property1",
							property2: "property2",
							navigationProperty: {
								"$Type": "namespace.EntityType2"
							}
						},
						"namespace.EntityType2": {
							"$kind": "EntityType",
							property1: "property1",
							property2: "property2"
						},
						"namespace.EntityType1@": {},
						"namespace.EntityType2@": {}
					},
					expectedValue: undefined
				}
			].forEach(function(oProperty) {
				var oContext = {
						getInterface: function() {
							return {
								getModel: function() {
									return {
										requestObject: function(sPath) {
											if (sPath === "/$") {
												return Promise.resolve(oProperty.container);
											}
											if (sPath.indexOf("navigationProperty") > -1) {
												var aPaths = sPath.split("/"),
													result = oProperty.container;
												aPaths = aPaths.splice(1, 2);
												aPaths.forEach(function(sSegment) {
													result = result[sSegment];
												});
												return Promise.resolve(result["$Type"]);
											}
											return Promise.resolve(oProperty.container[sPath.substr(1)]);
										}
									};
								},
								getSetting: function() {
									return {};
								}
							};
						},
						getPath: function() {
							return "/" + oProperty.entityType;
						}
					},
					done = assert.async();
				FieldHelper.getFieldGroupIds(oContext, oProperty.propertyPath, oProperty.entityType).then(function(sResult) {
					assert.equal(
						sResult,
						oProperty.expectedValue,
						"[FieldGroupIds]  " + oProperty.propertyPath + " --- " + oProperty.expectedValue
					);
					done();
				});
			});
		});

		QUnit.module("Unit Test for getNavigationEntity", {
			beforeEach: function() {}
		});
		QUnit.test("Unit test for getNavigationEntity when called without context i.e from template:with", function(assert) {
			[
				{
					oContext: {
						context: {
							getObject: function(sPath) {
								return sPath
									? {
											"$kind": "EntityType",
											"$Key": ["ID", "IsActiveEntity"],
											"ID": {
												"$kind": "Property",
												"$Type": "Edm.Guid",
												"$Nullable": false
											},
											"name": {
												"$kind": "Property",
												"$Type": "Edm.String"
											},
											"category": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.Categories",
												"$ReferentialConstraint": {
													"category_ID": "ID"
												}
											},
											"supplier": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.Suppliers"
											},
											"DraftAdministrativeData": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.DraftAdministrativeData",
												"$ContainsTarget": true
											},
											"SiblingEntity": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.Products"
											}
									  }
									: { "$Path": "product" };
							},
							getPath: function() {
								return "/Products/$Type@com.sap.vocabularies.UI.v1.Facets/0/Facets/0/Target/$AnnotationPath/Data/4/Value";
							}
						}
					},
					bExpectedValue: undefined,
					sMessage: "with semantic object pointing to naviagation entity without $ReferentialConstraint"
				},
				{
					oContext: {
						context: {
							getObject: function(sPath) {
								return sPath
									? {
											"$kind": "EntityType",
											"$Key": ["ID", "IsActiveEntity"],
											"ID": {
												"$kind": "Property",
												"$Type": "Edm.Guid",
												"$Nullable": false
											},
											"name": {
												"$kind": "Property",
												"$Type": "Edm.String"
											},
											"category": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.Categories",
												"$ReferentialConstraint": {
													"category_ID": "ID"
												}
											},
											"supplier": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.Suppliers",
												"$ReferentialConstraint": {
													"supplier": "ID"
												}
											},
											"DraftAdministrativeData": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.DraftAdministrativeData",
												"$ContainsTarget": true
											},
											"SiblingEntity": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.Products"
											}
									  }
									: { "$Path": "product" };
							},
							getPath: function() {
								return "/Products/$Type@com.sap.vocabularies.UI.v1.Facets/0/Facets/0/Target/$AnnotationPath/Data/4/Value";
							}
						}
					},
					bExpectedValue: undefined,
					sMessage:
						"with semantic object pointing to naviagation entity without matching property name inside $ReferentialConstraint"
				},
				{
					oContext: {
						context: {
							getObject: function(sPath) {
								return sPath
									? {
											"$kind": "EntityType",
											"$Key": ["ID", "IsActiveEntity"],
											"ID": {
												"$kind": "Property",
												"$Type": "Edm.Guid",
												"$Nullable": false
											},
											"name": {
												"$kind": "Property",
												"$Type": "Edm.String"
											},
											"category": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.Categories",
												"$ReferentialConstraint": {
													"category_ID": "ID"
												}
											},
											"supplier": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.Suppliers",
												"$ReferentialConstraint": {
													"supplier_ID": "ID"
												}
											},
											"DraftAdministrativeData": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.DraftAdministrativeData",
												"$ContainsTarget": true
											},
											"SiblingEntity": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.Products"
											}
									  }
									: { "$Path": "supplier_ID" };
							},
							getPath: function() {
								return "/Products/$Type@com.sap.vocabularies.UI.v1.Facets/0/Facets/0/Target/$AnnotationPath/Data/4/Value";
							}
						}
					},
					bExpectedValue: "/Products/$Type/supplier",
					sMessage:
						"with semantic object pointing to naviagation entity with a matching property name inside $ReferentialConstraint"
				}
			].forEach(function(object) {
				var actualValue = FieldHelper.getNavigationEntity(object.oContext.context);
				assert.equal(actualValue, object.bExpectedValue, "Unit test " + object.sMessage + ": ok");
			});
		});
		QUnit.module("Unit Test for getNavigationEntity", {
			beforeEach: function() {}
		});
		QUnit.test("Unit test for getNavigationEntity when called with context from computed annotation", function(assert) {
			[
				{
					oProperty: {
						$Path: "supplier_ID"
					},
					oContext: {
						context: {
							getObject: function(sPath) {
								return sPath
									? {
											"$kind": "EntityType",
											"$Key": ["ID", "IsActiveEntity"],
											"ID": {
												"$kind": "Property",
												"$Type": "Edm.Guid",
												"$Nullable": false
											},
											"name": {
												"$kind": "Property",
												"$Type": "Edm.String"
											},
											"category": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.Categories",
												"$ReferentialConstraint": {
													"category_ID": "ID"
												}
											},
											"supplier": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.Suppliers"
											},
											"DraftAdministrativeData": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.DraftAdministrativeData",
												"$ContainsTarget": true
											},
											"SiblingEntity": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.Products"
											}
									  }
									: { "$Path": "product" };
							},
							getPath: function() {
								return "/Products/$Type@com.sap.vocabularies.UI.v1.Facets/0/Facets/0/Target/$AnnotationPath/Data/4/Value";
							}
						}
					},
					bExpectedValue: undefined,
					sMessage: "with semantic object pointing to naviagation entity without $ReferentialConstraint"
				},
				{
					oProperty: {
						$Path: "supplier_ID"
					},
					oContext: {
						context: {
							getObject: function(sPath) {
								return sPath
									? {
											"$kind": "EntityType",
											"$Key": ["ID", "IsActiveEntity"],
											"ID": {
												"$kind": "Property",
												"$Type": "Edm.Guid",
												"$Nullable": false
											},
											"name": {
												"$kind": "Property",
												"$Type": "Edm.String"
											},
											"category": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.Categories",
												"$ReferentialConstraint": {
													"category_ID": "ID"
												}
											},
											"supplier": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.Suppliers",
												"$ReferentialConstraint": {
													"supplier": "ID"
												}
											},
											"DraftAdministrativeData": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.DraftAdministrativeData",
												"$ContainsTarget": true
											},
											"SiblingEntity": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.Products"
											}
									  }
									: { "$Path": "product" };
							},
							getPath: function() {
								return "/Products/$Type@com.sap.vocabularies.UI.v1.Facets/0/Facets/0/Target/$AnnotationPath/Data/4/Value";
							}
						}
					},
					bExpectedValue: undefined,
					sMessage:
						"with semantic object pointing to naviagation entity without matching property name inside $ReferentialConstraint"
				},
				{
					oProperty: {
						$Path: "supplier_ID"
					},
					oContext: {
						context: {
							getObject: function(sPath) {
								return sPath
									? {
											"$kind": "EntityType",
											"$Key": ["ID", "IsActiveEntity"],
											"ID": {
												"$kind": "Property",
												"$Type": "Edm.Guid",
												"$Nullable": false
											},
											"name": {
												"$kind": "Property",
												"$Type": "Edm.String"
											},
											"category": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.Categories",
												"$ReferentialConstraint": {
													"category_ID": "ID"
												}
											},
											"supplier": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.Suppliers",
												"$ReferentialConstraint": {
													"supplier_ID": "ID"
												}
											},
											"DraftAdministrativeData": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.DraftAdministrativeData",
												"$ContainsTarget": true
											},
											"SiblingEntity": {
												"$kind": "NavigationProperty",
												"$Type": "clouds.products.CatalogService.Products"
											}
									  }
									: { "$Path": "supplier_ID" };
							},
							getPath: function() {
								return "/Products/$Type@com.sap.vocabularies.UI.v1.Facets/0/Facets/0/Target/$AnnotationPath/Data/4/Value";
							}
						}
					},
					bExpectedValue: "{supplier}",
					sMessage:
						"with semantic object pointing to naviagation entity with a matching property name inside $ReferentialConstraint"
				}
			].forEach(function(object) {
				var actualValue = FieldHelper.getNavigationEntity(object.oContext.context, object.oProperty);
				assert.equal(actualValue, object.bExpectedValue, "Unit test " + object.sMessage + ": ok");
			});
		});

		QUnit.module("Unit Test for valueHelpProperty", {
			beforeEach: function() {}
		});
		QUnit.test(
			"Unit test for valueHelpProperty to get the valuehelp property from the DataField or from selectionFields propertypath",
			function(assert) {
				[
					{
						oPropertyContext: {
							getObject: function(sPath) {
								return sPath && sPath.indexOf("$Path@") > -1
									? {}
									: {
											"$Path": "Property"
									  };
							},
							getPath: function() {
								return "/Products/$Type@com.sap.vocabularies.UI.v1.Facets/0/Facets/0/Target/$AnnotationPath/Data/4/Value";
							}
						},
						bExpectedValue:
							"/Products/$Type@com.sap.vocabularies.UI.v1.Facets/0/Facets/0/Target/$AnnotationPath/Data/4/Value/$Path",
						sMessage: "with field property at $Path"
					},
					{
						oPropertyContext: {
							getObject: function(sPath) {
								return sPath && sPath.indexOf("$Path@") > -1
									? {
											"@Org.OData.Measures.V1.ISOCurrency": {
												"$Path": "PropertyCurrency"
											}
									  }
									: {
											"$Path": "Property"
									  };
							},
							getPath: function() {
								return "/Products/$Type@com.sap.vocabularies.UI.v1.Facets/0/Facets/0/Target/$AnnotationPath/Data/4/Value";
							}
						},
						bExpectedValue:
							"/Products/$Type@com.sap.vocabularies.UI.v1.Facets/0/Facets/0/Target/$AnnotationPath/Data/4/Value/$Path@Org.OData.Measures.V1.ISOCurrency/$Path",
						sMessage: "with field property at $Path with ISOCurrency annotations"
					},
					{
						oPropertyContext: {
							getObject: function(sPath) {
								return sPath && sPath.indexOf("$Path@") > -1
									? {
											"@Org.OData.Measures.V1.Unit": {
												"$Path": "PropertyUnit"
											}
									  }
									: {
											"$Path": "Property"
									  };
							},
							getPath: function() {
								return "/Products/$Type@com.sap.vocabularies.UI.v1.Facets/0/Facets/0/Target/$AnnotationPath/Data/4/Value";
							}
						},
						bExpectedValue:
							"/Products/$Type@com.sap.vocabularies.UI.v1.Facets/0/Facets/0/Target/$AnnotationPath/Data/4/Value/$Path@Org.OData.Measures.V1.Unit/$Path",
						sMessage: "with field property at $Path with Unit annotations"
					},
					{
						oPropertyContext: {
							getObject: function(sPath) {
								return sPath && sPath.indexOf("$PropertyPath@") > -1
									? {}
									: {
											"$PropertyPath": "Property"
									  };
							},
							getPath: function() {
								return "/Products/@com.sap.vocabularies.UI.v1.SelectionFields/0/$PropertyPath";
							}
						},
						bExpectedValue: "/Products/@com.sap.vocabularies.UI.v1.SelectionFields/0/$PropertyPath",
						sMessage: "with field property from selectionFields"
					},
					{
						oPropertyContext: {
							getObject: function(sPath) {
								return sPath && sPath.indexOf("$PropertyPath@") > -1
									? {
											"@Org.OData.Measures.V1.ISOCurrency": {
												"$Path": "PropertyCurrency"
											}
									  }
									: {
											"$PropertyPath": "Property"
									  };
							},
							getPath: function() {
								return "/Products/@com.sap.vocabularies.UI.v1.SelectionFields/0/$PropertyPath";
							}
						},
						bExpectedValue:
							"/Products/@com.sap.vocabularies.UI.v1.SelectionFields/0/$PropertyPath@Org.OData.Measures.V1.ISOCurrency/$Path",
						sMessage: "with field property from selectionFields with ISOCurrency annotations"
					},
					{
						oPropertyContext: {
							getObject: function(sPath) {
								return sPath && sPath.indexOf("$PropertyPath@") > -1
									? {
											"@Org.OData.Measures.V1.Unit": {
												"$Path": "PropertyUnit"
											}
									  }
									: {
											"$PropertyPath": "Property"
									  };
							},
							getPath: function() {
								return "/Products/@com.sap.vocabularies.UI.v1.SelectionFields/0/$PropertyPath";
							}
						},
						bExpectedValue:
							"/Products/@com.sap.vocabularies.UI.v1.SelectionFields/0/$PropertyPath@Org.OData.Measures.V1.Unit/$Path",
						sMessage: "with field property from selectionFields with Unit annotations"
					}
				].forEach(function(object) {
					var actualValue = FieldHelper.valueHelpProperty(object.oPropertyContext);
					assert.equal(actualValue, object.bExpectedValue, "Unit test for valueHelpProperty " + object.sMessage + ": ok");
				});
			}
		);

		QUnit.module("Unit Test for getConditionsBinding", {
			beforeEach: function() {},
			afterEach: function() {
				sandbox.restore();
			}
		});
		QUnit.test("Unit test to check getConditionsBinding for FilterFields", function(assert) {
			var oModel = new JSONModel({
				entitySet1: {
					property1: {
						$Type: "Emd.String",
						$kind: "Property"
					},
					navigationProperty: {
						$Type: "namespace.EntityType1",
						$kind: "NavigationProperty",
						property1: {
							$Type: "Emd.String",
							$kind: "Property"
						}
					},
					collectionProperty: {
						$Type: "namespace.EntityType2",
						$isCollection: true,
						$kind: "NavigationProperty",
						property1: {
							$Type: "Emd.String",
							$kind: "Property"
						}
					},
					complexProperty: {
						$Type: "namespace.EntityType3",
						$kind: "Property",
						collectionProperty: {
							$Type: "namespace.EntityType4",
							$isCollection: true,
							$kind: "NavigationProperty",
							navigationProperty: {
								$Type: "namespace.EntityType5",
								$kind: "NavigationProperty",
								property1: {
									$Type: "Emd.String",
									$kind: "Property"
								}
							}
						}
					}
				}
			});

			[
				{
					filterFieldPath: "property1",
					entitySet: "entitySet1",
					context: {
						getInterface: function(idx) {
							if (idx === 0) {
								return {
									getModel: function() {
										return oModel;
									},
									getPath: function() {
										return "/entitySet1/property1";
									}
								};
							}
						}
					},
					expectedValue: "{$filters>/conditions/property1}",
					sMessage: "without navigation"
				},
				{
					filterFieldPath: "navigationProperty/property1",
					entitySet: "entitySet1",
					context: {
						getInterface: function(idx) {
							if (idx === 0) {
								return {
									getModel: function() {
										return oModel;
									},
									getPath: function() {
										return "/entitySet1/navigationProperty/property1";
									}
								};
							}
						}
					},
					expectedValue: "{$filters>/conditions/navigationProperty/property1}",
					sMessage: "with navigation without collection"
				},
				{
					filterFieldPath: "collectionProperty/property1",
					entitySet: "entitySet1",
					context: {
						getInterface: function(idx) {
							if (idx === 0) {
								return {
									getModel: function() {
										return oModel;
									},
									getPath: function() {
										return "/entitySet1/collectionProperty/property1";
									}
								};
							}
						}
					},
					expectedValue: "{$filters>/conditions/collectionProperty*/property1}",
					sMessage: "with navigation with collection"
				},
				{
					filterFieldPath: "complexProperty/collectionProperty/navigationProperty/property1",
					entitySet: "entitySet1",
					context: {
						getInterface: function(idx) {
							if (idx === 0) {
								return {
									getModel: function() {
										return oModel;
									},
									getPath: function() {
										return "/entitySet1/complexProperty/collectionProperty/navigationProperty/property1";
									}
								};
							}
						}
					},
					expectedValue: "{$filters>/conditions/complexProperty/collectionProperty*/navigationProperty/property1}",
					sMessage: "with deep complex & nav properties"
				},
				{
					filterFieldPath: "$Type/property1",
					entitySet: "entitySet1",
					context: {
						getInterface: function(idx) {
							if (idx === 0) {
								return {
									getModel: function() {
										return {
											getProperty: function(sPath) {
												if (sPath.endsWith("$Type")) {
													return "entitySet1";
												}
												return oModel.getProperty(sPath.replace("/$Type", ""));
											}
										};
									},
									getPath: function() {
										return "/entitySet1/$Type/property1";
									}
								};
							}
						}
					},
					expectedValue: "{$filters>/conditions/property1}",
					sMessage: "with $Type in path"
				},
				{
					filterFieldPath: "property1",
					entitySet: "entitySet1",
					context: {
						getInterface: function(idx) {
							if (idx === 0) {
								return {
									getModel: function() {
										return oModel;
									},
									getPath: function() {
										return "/entitySet1/property1";
									}
								};
							} else if (idx === 1) {
								return {
									getPath: function() {
										return "/entitySet1/";
									}
								};
							}
						}
					},
					entityType: {
						"$kind": "EntityType"
					},
					expectedValue: "{$filters>/conditions/property1}",
					sMessage: "without navigation"
				},
				{
					filterFieldPath: "navigationProperty/property1",
					entitySet: "entitySet1",
					context: {
						getInterface: function(idx) {
							if (idx === 0) {
								return {
									getModel: function() {
										return oModel;
									},
									getPath: function() {
										return "/entitySet1/navigationProperty/property1";
									}
								};
							} else if (idx === 1) {
								return {
									getPath: function() {
										return "/entitySet1/";
									}
								};
							}
						}
					},
					entityType: {
						"$kind": "EntityType"
					},
					expectedValue: "{$filters>/conditions/navigationProperty/property1}",
					sMessage: "with navigation without collection"
				},
				{
					filterFieldPath: "collectionProperty/property1",
					entitySet: "entitySet1",
					context: {
						getInterface: function(idx) {
							if (idx === 0) {
								return {
									getModel: function() {
										return oModel;
									},
									getPath: function() {
										return "/entitySet1/collectionProperty/property1";
									}
								};
							} else if (idx === 1) {
								return {
									getPath: function() {
										return "/entitySet1/";
									}
								};
							}
						}
					},
					entityType: {
						"$kind": "EntityType"
					},
					expectedValue: "{$filters>/conditions/collectionProperty*/property1}",
					sMessage: "with navigation with collection"
				},
				{
					filterFieldPath: "complexProperty/collectionProperty/navigationProperty/property1",
					entitySet: "entitySet1",
					context: {
						getInterface: function(idx) {
							if (idx === 0) {
								return {
									getModel: function() {
										return oModel;
									},
									getPath: function() {
										return "/entitySet1/complexProperty/collectionProperty/navigationProperty/property1";
									}
								};
							} else if (idx === 1) {
								return {
									getPath: function() {
										return "/entitySet1/";
									}
								};
							}
						}
					},
					entityType: {
						"$kind": "EntityType"
					},
					expectedValue: "{$filters>/conditions/complexProperty/collectionProperty*/navigationProperty/property1}",
					sMessage: "with deep complex & nav properties"
				},
				{
					filterFieldPath: "$Type/property1",
					entitySet: "entitySet1",
					context: {
						getInterface: function(idx) {
							if (idx === 0) {
								return {
									getModel: function() {
										return {
											getProperty: function(sPath) {
												if (sPath.endsWith("$Type")) {
													return "entitySet1";
												}
												return oModel.getProperty(sPath.replace("/$Type", ""));
											}
										};
									},
									getPath: function() {
										return "/entitySet1/$Type/property1";
									}
								};
							} else if (idx === 1) {
								return {
									getPath: function() {
										return "/entitySet1/$Type/";
									}
								};
							}
						}
					},
					entityType: {
						"$kind": "EntityType"
					},
					expectedValue: "{$filters>/conditions/property1}",
					sMessage: "with $Type in path"
				}
			].forEach(function(oProperty) {
				assert.equal(
					FieldHelper.getConditionsBinding(oProperty.context, oProperty.filterFieldPath, oProperty.entityType),
					oProperty.expectedValue,
					"ConditionsBinding for filterfield with filedPath '" +
						oProperty.filterFieldPath +
						"' " +
						oProperty.sMessage +
						" is '" +
						oProperty.expectedValue +
						"'."
				);
			});

			oModel.destroy();
		});

		QUnit.module("Unit test to check edit mode of filter field within valuehelp");
		QUnit.test("Unit test to check edit mode of filter field within valuehelp", function(assert) {
			var aInputData = [
				{
					oValueList: {
						Parameters: [{ $Type: "com.sap.vocabularies.Common.v1.ValueListParameterIn", ValueListProperty: "property1" }]
					},
					sPropertyPath: "property1",
					outputData: "ReadOnly",
					sMessage: "Field is display-only when it is an in parameter"
				},
				{
					oValueList: {
						Parameters: [{ $Type: "com.sap.vocabularies.Common.v1.ValueListParameterIn", ValueListProperty: "property2" }]
					},
					sPropertyPath: "property1",
					outputData: "Editable",
					sMessage: "Field is editable for in parameter whose valuelist property not equal to field property"
				},
				{
					oValueList: {
						Parameters: [{ $Type: "com.sap.vocabularies.Common.v1.ValueListParameterInOut", ValueListProperty: "property1" }]
					},
					sPropertyPath: "property1",
					outputData: "Editable",
					sMessage: "Field is editable for inout parameter"
				},
				{
					oValueList: {
						Parameters: [{ $Type: "com.sap.vocabularies.Common.v1.ValueListParameterOut", ValueListProperty: "property1" }]
					},
					sPropertyPath: "property1",
					outputData: "Editable",
					sMessage: "Field is editable for out parameter "
				},
				{
					oValueList: {},
					sPropertyPath: "property1",
					outputData: "Editable",
					sMessage: "Field is editable when valuelist annotation is not avilable"
				}
			];
			aInputData.forEach(function(oElement, index) {
				assert.deepEqual(
					FieldHelper.getFieldEditModeInValueHelp(oElement.oValueList, oElement.sPropertyPath),
					oElement.outputData,
					oElement.sMessage
				);
			});
		});
		QUnit.module("Unit Test for maxConditions", {
			beforeEach: function() {}
		});
		QUnit.test("Value 1 for Edm.Boolean, SingleValue, SingleRange in Filter Restrictions", function(assert) {
			[
				{
					oValue: "BooleanField",
					oInterface: {
						context: {
							getModel: function() {
								return {
									getObject: function(param) {
										var returnObject;
										if (param && param === "@Org.OData.Capabilities.V1.FilterRestrictions") {
											returnObject = {};
										}
										if (param === "") {
											returnObject = { $Type: "Edm.Boolean" };
										}
										return returnObject;
									}
								};
							},
							getPath: function() {
								return "";
							}
						}
					},
					bExpectedValue: 1,
					sMessage: " boolean type"
				},
				{
					oValue: "DateField",
					oInterface: {
						context: {
							getModel: function() {
								return {
									getObject: function(param) {
										var returnObject;
										if (param && param === "@Org.OData.Capabilities.V1.FilterRestrictions") {
											returnObject = {
												FilterExpressionRestrictions: [
													{
														Property: { $PropertyPath: "DateField" },
														AllowedExpressions: "SingleValue"
													}
												]
											};
										}
										if (param === "") {
											returnObject = { $Type: "Edm.Date" };
										}
										return returnObject;
									}
								};
							},
							getPath: function() {
								return "";
							}
						}
					},
					bExpectedValue: 1,
					sMessage: "Single Value in Allowed Expression"
				},
				{
					oValue: "DateField",
					oInterface: {
						context: {
							getModel: function() {
								return {
									getObject: function(param) {
										var returnObject;
										if (param && param === "@Org.OData.Capabilities.V1.FilterRestrictions") {
											returnObject = {
												FilterExpressionRestrictions: [
													{
														Property: { $PropertyPath: "DateField" },
														AllowedExpressions: "SingleRange"
													}
												]
											};
										}
										if (param === "") {
											returnObject = { $Type: "Edm.Date" };
										}
										return returnObject;
									}
								};
							},
							getPath: function() {
								return "";
							}
						}
					},
					bExpectedValue: 1,
					sMessage: "Single Range in Allowed Expression"
				},
				{
					oValue: "DateField",
					oInterface: {
						context: {
							getModel: function() {
								return {
									getObject: function(param) {
										var returnObject;
										if (param && param === "@Org.OData.Capabilities.V1.FilterRestrictions") {
											returnObject = "";
										}
										if (param === "") {
											returnObject = { $Type: "Edm.Date" };
										}
										return returnObject;
									}
								};
							},
							getPath: function() {
								return "";
							}
						}
					},
					bExpectedValue: -1,
					sMessage: " date and no filter restrictions"
				}
			].forEach(function(oProperty) {
				sandbox.stub(commonHelper, "getEntitySetForPropertyPath").callsFake(function() {
					return "";
				});

				var actualValue = FieldHelper.maxConditions(oProperty.oValue, oProperty.oInterface);
				assert.equal(actualValue, oProperty.bExpectedValue, "Unit test to check maxConditions for " + oProperty.sMessage + ": ok");
				sandbox.restore();
			});
		});

		QUnit.module("Unit Test check Operators");

		QUnit.test("Unit test to check Operators", function(assert) {
			[
				{
					dataField: "LastChangedDateTime",
					iContext: {
						getInterface: function() {
							return {
								getModel: function() {
									return {
										createBindingContext: function() {
											return {
												getPath: function(sPath) {
													return "dummy/LastChangedDateTime";
												},
												getModel: function() {
													return "dummy";
												},
												getObject: function(sPath) {
													if (sPath === "@sapui.name") {
														return "LastChangedDateTime";
													} else {
														// Filter Annotations
														return {
															FilterExpressionRestrictions: [
																{
																	Property: { $PropertyPath: "LastChangedDateTime" },
																	AllowedExpressions: "SingleRange"
																}
															]
														};
													}
												}
											};
										}
									};
								},
								getPath: function() {
									return "dummy/LastChangedDateTime";
								}
							};
						}
					},
					$Type: "Edm.DateTime",
					useSemanticDateRange: "false",
					expectedValue: "EQ,BT,LE,LT,GE,GT,NOTLE,NOTLT,NOTGE,NOTGT",
					sMessage: "Edm.String and Single Range"
				},
				{
					dataField: "SalesOrderDate",
					iContext: {
						getInterface: function() {
							return {
								getModel: function() {
									return {
										createBindingContext: function() {
											return {
												getPath: function(sPath) {
													return "dummy/SalesOrderDate";
												},
												getModel: function() {
													return "dummy";
												},
												getObject: function(sPath) {
													if (sPath === "@sapui.name") {
														return "SalesOrderDate";
													} else {
														// Filter Annotations
														return {
															FilterExpressionRestrictions: [
																{
																	Property: { $PropertyPath: "SalesOrderDate" },
																	AllowedExpressions: "SingleValue"
																}
															]
														};
													}
												}
											};
										}
									};
								},
								getPath: function() {
									return "dummy/SalesOrderDate";
								}
							};
						}
					},
					$Type: "Edm.Date",
					useSemanticDateRange: "false",
					expectedValue: "EQ",
					sMessage: "Edm.Date and Single Value"
				},
				{
					dataField: "SalesOrderDate",
					iContext: {
						getInterface: function() {
							return {
								getModel: function() {
									return {
										createBindingContext: function() {
											return {
												getPath: function(sPath) {
													return "dummy/SalesOrderDate";
												},
												getModel: function() {
													return "dummy";
												},
												getObject: function(sPath) {
													if (sPath === "@sapui.name") {
														return "SalesOrderDate";
													} else {
														// Filter Annotations
														return {
															FilterExpressionRestrictions: [
																{
																	Property: { $PropertyPath: "SalesOrderDate" },
																	AllowedExpressions: "MultiValue"
																}
															]
														};
													}
												}
											};
										}
									};
								},
								getPath: function() {
									return "dummy/SalesOrderDate";
								}
							};
						}
					},
					$Type: "Edm.Date",
					useSemanticDateRange: "false",
					expectedValue: "EQ",
					sMessage: "Edm.Date and Multi Value"
				},
				{
					dataField: "SalesOrderDate",
					iContext: {
						getInterface: function() {
							return {
								getModel: function() {
									return {
										createBindingContext: function() {
											return {
												getPath: function(sPath) {
													return "dummy/SalesOrderDate";
												},
												getModel: function() {
													return "dummy";
												},
												getObject: function(sPath) {
													if (sPath === "@sapui.name") {
														return "SalesOrderDate";
													} else {
														// Filter Annotations
														return {
															FilterExpressionRestrictions: [
																{
																	Property: { $PropertyPath: "SalesOrderDate" },
																	AllowedExpressions: "SingleRange"
																}
															]
														};
													}
												}
											};
										}
									};
								},
								getPath: function() {
									return "dummy/SalesOrderDate";
								}
							};
						}
					},
					$Type: "Edm.Date",
					useSemanticDateRange: "true",
					expectedValue:
						"DATE,FROM,TO,DATERANGE,TODAY,YESTERDAY,TOMORROW,TODAYFROMTO,LASTDAYS,NEXTDAYS,THISWEEK," +
						"LASTWEEK,LASTWEEKS,NEXTWEEK,NEXTWEEKS,SPECIFICMONTH,THISMONTH,LASTMONTH,LASTMONTHS,NEXTMONTH,NEXTMONTHS," +
						"THISQUARTER,LASTQUARTER,LASTQUARTERS,NEXTQUARTER,NEXTQUARTERS,QUARTER1,QUARTER2," +
						"QUARTER3,QUARTER4,THISYEAR,LASTYEAR,LASTYEARS,NEXTYEAR,NEXTYEARS,YEARTODATE",
					sMessage: "Edm.Date and Single Range"
				},
				{
					dataField: "SalesOrderDate",
					iContext: {
						getInterface: function() {
							return {
								getModel: function() {
									return {
										createBindingContext: function() {
											return {
												getPath: function(sPath) {
													return "dummy/SalesOrderDate";
												},
												getModel: function() {
													return "dummy";
												},
												getObject: function(sPath) {
													if (sPath === "@sapui.name") {
														return "SalesOrderDate";
													} else {
														// Filter Annotations
														return {
															FilterExpressionRestrictions: [
																{
																	Property: { $PropertyPath: "SalesOrderDate" },
																	AllowedExpressions: "SingleRange"
																}
															]
														};
													}
												}
											};
										}
									};
								},
								getPath: function() {
									return "dummy/SalesOrderDate";
								}
							};
						}
					},
					$Type: "Edm.Date",
					useSemanticDateRange: "false",
					expectedValue: "EQ,GE,LE,LT,GT,BT,NOTLE,NOTLT,NOTGE,NOTGT",
					sMessage: "Edm.Date and Single Range"
				},
				{
					dataField: "SalesOrderDate",
					iContext: {
						getInterface: function() {
							return {
								getModel: function() {
									return {
										createBindingContext: function() {
											return {
												getPath: function(sPath) {
													return "dummy/SalesOrderDate";
												},
												getModel: function() {
													return "dummy";
												},
												getObject: function(sPath) {
													if (sPath === "@sapui.name") {
														return "SalesOrderDate";
													} else {
														// Filter Annotations
														return {
															FilterExpressionRestrictions: [
																{
																	Property: { $PropertyPath: "SalesOrderDate" },
																	AllowedExpressions: "MultiRange"
																}
															]
														};
													}
												}
											};
										}
									};
								},
								getPath: function() {
									return "dummy/SalesOrderDate";
								}
							};
						}
					},
					$Type: "Edm.Date",
					useSemanticDateRange: "true",
					expectedValue: "EQ,GE,LE,LT,GT,BT,NE,NOTBT,NOTLE,NOTLT,NOTGE,NOTGT",
					sMessage: "Edm.Date and Multi Range"
				},
				{
					dataField: "SalesOrderDate",
					iContext: {
						getInterface: function() {
							return {
								getModel: function() {
									return {
										createBindingContext: function() {
											return {
												getPath: function(sPath) {
													return "dummy/SalesOrderDate";
												},
												getModel: function() {
													return "dummy";
												},
												getObject: function(sPath) {
													if (sPath === "@sapui.name") {
														return "SalesOrderDate";
													} else {
														// Filter Annotations
														return {
															FilterExpressionRestrictions: [
																{
																	Property: { $PropertyPath: "SalesOrderDate" },
																	AllowedExpressions: "MultiRange"
																}
															]
														};
													}
												}
											};
										}
									};
								},
								getPath: function() {
									return "dummy/SalesOrderDate";
								}
							};
						}
					},
					$Type: "Edm.Date",
					useSemanticDateRange: "false",
					expectedValue: "EQ,GE,LE,LT,GT,BT,NE,NOTBT,NOTLE,NOTLT,NOTGE,NOTGT",
					sMessage: "Edm.Date and Multi Range"
				},
				{
					dataField: "NetAmount",
					iContext: {
						getInterface: function() {
							return {
								getModel: function() {
									return {
										createBindingContext: function() {
											return {
												getPath: function(sPath) {
													return "dummy/NetAmount";
												},
												getModel: function() {
													return "dummy";
												},
												getObject: function(sPath) {
													if (sPath === "@sapui.name") {
														return "NetAmount";
													} else {
														// Filter Annotations
														return {
															FilterExpressionRestrictions: [
																{
																	Property: { $PropertyPath: "NetAmount" },
																	AllowedExpressions: "MultiRange"
																}
															]
														};
													}
												}
											};
										}
									};
								},
								getPath: function() {
									return "dummy/NetAmount";
								}
							};
						}
					},
					useSemanticDateRange: "false",
					$Type: "Edm.Decimal",
					expectedValue: "EQ,BT,LE,LT,GE,GT,NE,NOTBT,NOTLE,NOTLT,NOTGE,NOTGT",
					sMessage: "Edm.Decimal and Multi Range"
				},
				{
					dataField: "SoldToParty",
					iContext: {
						getInterface: function() {
							return {
								getModel: function() {
									return {
										createBindingContext: function() {
											return {
												getPath: function(sPath) {
													return "dummy/SoldToParty";
												},
												getModel: function() {
													return "dummy";
												},
												getObject: function(sPath) {
													if (sPath === "@sapui.name") {
														return "SoldToParty";
													} else {
														// Filter Annotations
														return {
															FilterExpressionRestrictions: [
																{
																	Property: { $PropertyPath: "SoldToParty" },
																	AllowedExpressions: "SearchExpression"
																}
															]
														};
													}
												}
											};
										}
									};
								},
								getPath: function() {
									return "dummy/SoldToParty";
								}
							};
						}
					},
					$Type: "Edm.String",
					useSemanticDateRange: "false",
					expectedValue: "Contains,StartsWith,EndsWith,NotContains,NotStartsWith,NotEndsWith",
					sMessage: "Edm.String and Search Expressions"
				},
				{
					dataField: "SoldToParty",
					iContext: {
						getInterface: function() {
							return {
								getModel: function() {
									return {
										createBindingContext: function() {
											return {
												getPath: function(sPath) {
													return "dummy/SoldToParty";
												},
												getModel: function() {
													return "dummy";
												},
												getObject: function(sPath) {
													if (sPath === "@sapui.name") {
														return "SoldToParty";
													} else {
														// Filter Annotations
														return {
															FilterExpressionRestrictions: [
																{
																	Property: { $PropertyPath: "SoldToParty" },
																	AllowedExpressions: "MultiRangeOrSearchExpression"
																}
															]
														};
													}
												}
											};
										}
									};
								},
								getPath: function() {
									return "dummy/SoldToParty";
								}
							};
						}
					},
					$Type: "Edm.String",
					useSemanticDateRange: "false",
					expectedValue:
						"Contains,EQ,BT,StartsWith,EndsWith,LE,LT,GE,GT,NotContains,NE,NOTBT,NotStartsWith,NotEndsWith,NOTLE,NOTLT,NOTGE,NOTGT",
					sMessage: "Edm.String and MultiRange Or Search Expressions"
				}
			].forEach(function(oProperty) {
				sandbox.stub(commonHelper, "getEntitySetForPropertyPath").callsFake(function() {
					return "dummy";
				});
				var actualValue = FieldHelper.operators(oProperty.iContext, oProperty, oProperty.useSemanticDateRange);
				assert.equal(actualValue, oProperty.expectedValue, "Unit test to check Operators for " + oProperty.sMessage + ":  ok");
				sandbox.restore();
			});
		});

		QUnit.module("Unit Test for getSemanticKeyTitle");
		QUnit.test("Unit test to check getSemanticKeyTitle ", function(assert) {
			[
				{
					sPropertyTextValue: "{ path : 'SalesOrder', parameters: {'$$noPatch': true}}",
					sPropertyValue: "{path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}}",
					oTextArrangement: {
						$EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"
					},
					sSemanticKeyStyle: "ObjectIdentifier",
					oDraftRoot: {
						$Type: "com.sap.vocabularies.Common.v1.DraftRootType"
					},
					bExpectedValue:
						"{= (!%{IsActiveEntity} ? !%{HasActiveEntity} ? (${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === '' || ${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === undefined || ${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === null ? 'New Object': ${ path : 'SalesOrder', parameters: {'$$noPatch': true}}) : (${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === '' || ${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === undefined || ${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === null ? '<Unnamed Object>': ${ path : 'SalesOrder', parameters: {'$$noPatch': true}}) : (${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === '' || ${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === undefined || ${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === null ? '<Unnamed Object>': ${ path : 'SalesOrder', parameters: {'$$noPatch': true}}))}",
					sMessage: "with Responsive LR table and having a text association"
				},
				{
					sPropertyValue: "{path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}}",
					sSemanticKeyStyle: "ObjectIdentifier",
					oDraftRoot: {
						$Type: "com.sap.vocabularies.Common.v1.DraftRootType"
					},
					bExpectedValue:
						"{= (!%{IsActiveEntity} ? !%{HasActiveEntity} ? (${path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}} === '' || ${path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}} === undefined || ${path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}} === null ? 'New Object': ${path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}}) : (${path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}} === '' || ${path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}} === undefined || ${path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}} === null ? '<Unnamed Object>': ${path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}}) : (${path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}} === '' || ${path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}} === undefined || ${path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}} === null ? '<Unnamed Object>': ${path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}}))}",
					sMessage: "with Responsive LR table and not having a text association"
				},
				{
					sPropertyTextValue: "{ path : 'SalesOrder', parameters: {'$$noPatch': true}}",
					sPropertyValue: "{path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}}",
					sSemanticKeyStyle: "ObjectIdentifier",
					bExpectedValue: "{ path : 'SalesOrder', parameters: {'$$noPatch': true}}",
					sMessage: "with Responsive OP table and having a text association"
				},
				{
					sPropertyValue: "{path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}}",
					sSemanticKeyStyle: "ObjectIdentifier",
					bExpectedValue: "{path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}}",
					sMessage: "with Responsive OP table and not having a text association"
				},
				{
					sPropertyTextValue: "{ path : 'SalesOrder', parameters: {'$$noPatch': true}}",
					sPropertyValue: "{path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}}",
					sSemanticKeyStyle: "Label",
					oDraftRoot: {
						$Type: "com.sap.vocabularies.Common.v1.DraftRootType"
					},
					bExpectedValue:
						"{= (!%{IsActiveEntity} ? !%{HasActiveEntity} ? (${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === '' || ${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === undefined || ${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === null ? 'New Object': ${ path : 'SalesOrder', parameters: {'$$noPatch': true}}) : (${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === '' || ${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === undefined || ${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === null ? '<Unnamed Object>': ${ path : 'SalesOrder', parameters: {'$$noPatch': true}}) : (${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === '' || ${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === undefined || ${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === null ? '<Unnamed Object>': ${ path : 'SalesOrder', parameters: {'$$noPatch': true}}))}",
					sMessage: "with non Responsive LR table and having a text association and no text arrangement"
				},
				{
					sPropertyTextValue: "{ path : 'SalesOrder', parameters: {'$$noPatch': true}}",
					sPropertyValue: "{path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}}",
					oTextArrangement: {
						$EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst"
					},
					sSemanticKeyStyle: "Label",
					oDraftRoot: {
						$Type: "com.sap.vocabularies.Common.v1.DraftRootType"
					},
					bExpectedValue:
						"{= (!%{IsActiveEntity} ? !%{HasActiveEntity} ? (${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === '' || ${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === undefined || ${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === null ? 'New Object': ${ path : 'SalesOrder', parameters: {'$$noPatch': true}}) : (${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === '' || ${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === undefined || ${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === null ? '<Unnamed Object>': ${ path : 'SalesOrder', parameters: {'$$noPatch': true}}) : (${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === '' || ${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === undefined || ${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === null ? '<Unnamed Object>': ${ path : 'SalesOrder', parameters: {'$$noPatch': true}})) +' (' + (${path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}}) +')' }",
					sMessage: "with non Responsive LR table and having a text association and text arrangement as Text First"
				},
				{
					sPropertyTextValue: "{ path : 'SalesOrder', parameters: {'$$noPatch': true}}",
					sPropertyValue: "{path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}}",
					oTextArrangement: {
						$EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextLast"
					},
					sSemanticKeyStyle: "Label",
					oDraftRoot: {
						$Type: "com.sap.vocabularies.Common.v1.DraftRootType"
					},
					bExpectedValue:
						"{= (${path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}}) + ' (' + (!%{IsActiveEntity} ? !%{HasActiveEntity} ? (${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === '' || ${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === undefined || ${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === null ? 'New Object': ${ path : 'SalesOrder', parameters: {'$$noPatch': true}}) : (${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === '' || ${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === undefined || ${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === null ? '<Unnamed Object>': ${ path : 'SalesOrder', parameters: {'$$noPatch': true}}) : (${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === '' || ${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === undefined || ${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === null ? '<Unnamed Object>': ${ path : 'SalesOrder', parameters: {'$$noPatch': true}})) +')' }",
					sMessage: "with non Responsive LR table and having a text association and text arrangement as Text Last"
				},
				{
					sPropertyTextValue: "{ path : 'SalesOrder', parameters: {'$$noPatch': true}}",
					sPropertyValue: "{path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}}",
					sSemanticKeyStyle: "Label",
					oDraftRoot: {
						$Type: "com.sap.vocabularies.Common.v1.DraftRootType"
					},
					bExpectedValue:
						"{= (!%{IsActiveEntity} ? !%{HasActiveEntity} ? (${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === '' || ${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === undefined || ${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === null ? 'New Object': ${ path : 'SalesOrder', parameters: {'$$noPatch': true}}) : (${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === '' || ${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === undefined || ${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === null ? '<Unnamed Object>': ${ path : 'SalesOrder', parameters: {'$$noPatch': true}}) : (${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === '' || ${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === undefined || ${ path : 'SalesOrder', parameters: {'$$noPatch': true}} === null ? '<Unnamed Object>': ${ path : 'SalesOrder', parameters: {'$$noPatch': true}}))}",
					sMessage: "with non Responsive LR table and having a text association and text arrangement as Text Only"
				},
				{
					sPropertyValue: "{path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}}",
					sSemanticKeyStyle: "Label",
					oDraftRoot: {
						$Type: "com.sap.vocabularies.Common.v1.DraftRootType"
					},
					bExpectedValue:
						"{= (!%{IsActiveEntity} ? !%{HasActiveEntity} ? (${path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}} === '' || ${path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}} === undefined || ${path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}} === null ? 'New Object': ${path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}}) : (${path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}} === '' || ${path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}} === undefined || ${path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}} === null ? '<Unnamed Object>': ${path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}}) : (${path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}} === '' || ${path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}} === undefined || ${path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}} === null ? '<Unnamed Object>': ${path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}}))}",
					sMessage: "with non Responsive LR table and not having a text association"
				},
				{
					sPropertyTextValue: "{ path : 'SalesOrder', parameters: {'$$noPatch': true}}",
					sPropertyValue: "{path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}}",
					oTextArrangement: {
						$EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst"
					},
					sSemanticKeyStyle: "Label",
					bExpectedValue:
						"{= ${ path : 'SalesOrder', parameters: {'$$noPatch': true}} +' (' + (${path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}}) +')' }",
					sMessage: "with non Responsive OP table and having a text association and text arrangement as Text First"
				},
				{
					sPropertyTextValue: "{ path : 'SalesOrder', parameters: {'$$noPatch': true}}",
					sPropertyValue: "{path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}}",
					oTextArrangement: {
						$EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextLast"
					},
					sSemanticKeyStyle: "Label",
					bExpectedValue:
						"{= (${path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}}) + ' (' + ${ path : 'SalesOrder', parameters: {'$$noPatch': true}} +')' }",
					sMessage: "with non Responsive OP table and having a text association and text arrangement as Text Last"
				},
				{
					sPropertyTextValue: "{ path : 'SalesOrder', parameters: {'$$noPatch': true}}",
					sPropertyValue: "{path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}}",
					oTextArrangement: {
						$EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"
					},
					sSemanticKeyStyle: "Label",
					bExpectedValue: "{ path : 'SalesOrder', parameters: {'$$noPatch': true}}",
					sMessage: "with non Responsive OP table and having a text association and text arrangement as Text Only"
				},
				{
					sPropertyTextValue: "{ path : 'SalesOrder', parameters: {'$$noPatch': true}}",
					sPropertyValue: "{path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}}",
					sSemanticKeyStyle: "Label",
					bExpectedValue: "{ path : 'SalesOrder', parameters: {'$$noPatch': true}}",
					sMessage: "with non Responsive OP table and having a text association and with no text arrangement"
				},
				{
					sPropertyValue: "{path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}}",
					sSemanticKeyStyle: "Label",
					bExpectedValue: "{path:'ID',type:'sap.ui.model.odata.type.Guid',constraints:{'nullable':false}}",
					sMessage: "with non Responsive OP table and having no text association"
				}
			].forEach(function(oProperty) {
				sandbox.stub(ResourceModel, "getText").callsFake(function(sKey) {
					if (sKey === "M_FIELD_HELPER_NEW_OBJECT") {
						return "New Object";
					} else {
						return "<Unnamed Object>";
					}
				});
				var actualValue = FieldHelper.getSemanticKeyTitle(
					oProperty.sPropertyTextValue,
					oProperty.sPropertyValue,
					oProperty.sDataField,
					oProperty.oTextArrangement,
					oProperty.sSemanticKeyStyle,
					oProperty.oDraftRoot
				);
				assert.equal(
					actualValue,
					oProperty.bExpectedValue,
					"Unit test to check getSemanticKeyTitle " + oProperty.sMessage + ": ok"
				);
				sandbox.restore();
			});
		});

		QUnit.module("Unit Test for getPropertyCollection");
		QUnit.test("Unit Test for getPropertyCollection", function(assert) {
			[
				{
					context: {
						getPath: function() {
							return "/SalesOrderManage/@com.sap.vocabularies.UI.v1.FieldGroup#multipleActionFields/Data/1/Target/$AnnotationPath/Value";
						},
						getObject: function(sPath) {
							if (sPath === "$Path") {
								return "SoldToParty";
							}
							return "SalesOrderManage";
						}
					},
					expectedValue: "/SalesOrderManage",
					sMessage: "property from entity of qualified field group, part of main entity"
				},
				{
					context: {
						getPath: function() {
							return "/SalesOrderManage/@com.sap.vocabularies.UI.v1.Facets/0/Facets/0/Facets/0/Target/$AnnotationPath/Data/3/Value";
						},
						getObject: function(sPath) {
							if (sPath === "$Path") {
								return "SoldToParty";
							}
							return "SalesOrderManage";
						}
					},
					expectedValue: "/SalesOrderManage",
					sMessage: "property from entity of facet which is part of main entity"
				},
				{
					context: {
						getPath: function() {
							return "/SalesOrderManage/$NavigationPropertyBinding/_ShipToParty/@com.sap.vocabularies.UI.v1.FieldGroup#AddressData/Data/1/Value";
						},
						getObject: function(sPath) {
							if (sPath === "$Path") {
								return "SoldToParty";
							}
							return "HeaderShipToParty";
						}
					},
					expectedValue: "/HeaderShipToParty",
					sMessage: "property from entity of field group which is part of navigation entity"
				},
				{
					context: {
						getPath: function() {
							return "/SalesOrderManage/$NavigationPropertyBinding/_ShipToParty/@com.sap.vocabularies.UI.v1.FieldGroup#AddressData/Data/1/Value";
						},
						getObject: function(sPath) {
							if (sPath === "$Path") {
								return "_Customer/CustomerName";
							}
							if (sPath.indexOf("_Customer") > -1) {
								return "Customer";
							}
							return "HeaderShipToParty";
						}
					},
					expectedValue: "/Customer",
					sMessage: "property from navigation entity, field group from navigation entity"
				},
				{
					context: {
						getPath: function() {
							return "/SalesOrderManage/_Partner/@com.sap.vocabularies.UI.v1.LineItem/4/Value";
						},
						getObject: function(sPath) {
							if (sPath === "$Path") {
								return "SoldToParty";
							}
							return "HeaderShipToParty";
						}
					},
					expectedValue: "/HeaderShipToParty",
					sMessage: "line item from a navigation entity"
				},
				{
					context: {
						getPath: function() {
							return "/SalesOrderItem/$NavigationPropertyBinding/_ShipToParty/@com.sap.vocabularies.UI.v1.LineItem/0/Value";
						},
						getObject: function(sPath) {
							if (sPath === "$Path") {
								return "SoldToParty";
							}
							return "HeaderShipToParty";
						}
					},
					expectedValue: "/HeaderShipToParty",
					sMessage: "line item from a navigation entity"
				},
				{
					context: {
						getPath: function() {
							return "/SalesOrderItem/$NavigationPropertyBinding/_ShipToParty/@com.sap.vocabularies.UI.v1.LineItem/0/Value";
						},
						getObject: function(sPath) {
							if (sPath === "$Path") {
								return "_Customer/CustomerName";
							}
							if (sPath.indexOf("_Customer") > -1) {
								return "Customer";
							}
							return "HeaderShipToParty";
						}
					},
					expectedValue: "/Customer",
					sMessage: "line item in a navigation entity, property also from navigation entity"
				},
				{
					context: {
						getPath: function() {
							return "/SalesOrderItem/_ShipToParty/_ContactInfo/@com.sap.vocabularies.UI.v1.LineItem/0/Value";
						},
						getObject: function(sPath) {
							if (sPath === "$Path") {
								return "_Customer/CustomerName";
							}
							if (sPath.indexOf("_Customer") > -1) {
								return "Customer";
							}
							if (sPath.indexOf("_ContactInfo") > -1) {
								return "ContactDetails";
							}
							return "HeaderShipToParty";
						}
					},
					expectedValue: "/Customer",
					sMessage: "multilevel path for property"
				},
				{
					context: {
						getPath: function() {
							return "/SalesOrderItem/$NavigationPropertyBinding/_ShipToParty/$NavigationPropertyBinding/_ContactInfo/@com.sap.vocabularies.UI.v1.LineItem/0/Value";
						},
						getObject: function(sPath) {
							if (sPath === "$Path") {
								return "_Customer/CustomerName";
							}
							if (sPath.indexOf("_Customer") > -1) {
								return "Customer";
							}
							if (sPath.indexOf("_ContactInfo") > -1) {
								return "ContactDetails";
							}
							return "HeaderShipToParty";
						}
					},
					expectedValue: "/Customer",
					sMessage: "multilevel path for parent control"
				}
			].forEach(function(oInputData) {
				var sEntity = FieldHelper.getPropertyCollection(oInputData.context);
				assert.equal(sEntity, oInputData.expectedValue, "Entity from getPropertyCollection -- OK : " + oInputData.sMessage);
			});
		});

		QUnit.module("Unit Test for _getEntitySetFromMultiLevel");
		QUnit.test("Unit Test for _getEntitySetFromMultiLevel", function(assert) {
			[
				{
					context: {
						getObject: function(sPath) {
							if (sPath.indexOf("_navEntity")) {
								return "navEntity";
							}
							return "someEntity";
						}
					},
					path: "/mainEntity/_someEntity1/_someEntity2/_navEntity",
					start: 0,
					diff: 0, // all parts in the path are considered
					source: "/mainEntity",
					expectedValue: "/navEntity",
					message: "entire path is used to fetch the entity"
				},
				{
					context: {
						getObject: function(sPath) {
							if (sPath.indexOf("_navEntity")) {
								return "navEntity";
							}
							return "someEntity";
						}
					},
					path: "_navEntity1/_navEntity2/_navEntity/propertyPath",
					start: 0,
					diff: 1, //propertyPath is ignored
					source: "/mainEntity",
					expectedValue: "/navEntity",
					message: "last part of the path is ignored (diff modified)"
				},
				{
					context: {
						getObject: function(sPath) {
							if (sPath.indexOf("_navEntity")) {
								return "navEntity";
							}
							return "someEntity";
						}
					},
					path: "mainEntity/_navEntity1/_navEntity/propertyPath",
					start: 1, // main entity part is ignored
					diff: 0,
					source: "/mainEntity",
					expectedValue: "/navEntity",
					message: "first part of the path is ignored"
				}
			].forEach(function(oInputData) {
				var sPath = FieldHelper._getEntitySetFromMultiLevel(
					oInputData.context,
					oInputData.path,
					oInputData.source,
					oInputData.start,
					oInputData.diff
				);
				assert.equal(sPath, oInputData.expectedValue, "Entity from _getEntitySetFromMultiLevel -- OK : " + oInputData.message);
			});
		});

		//TO-DO Enhance this QUnit for other scenarios
		QUnit.module("Unit Test for getDataFieldAlignment");
		QUnit.test("Unit Test for getDataFieldAlignment", function(assert) {
			var oDataField = {
				$Type: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
				Target: {
					$AnnotationPath: "@com.sap.vocabularies.UI.v1.DataPoint#Rating"
				}
			};
			var sEntityPath = "/SalesOrderManage";
			var oModel = {
				getObject: function(sPath) {
					return "com.sap.vocabularies.UI.v1.VisualizationType/Rating";
				}
			};
			var actualValue = FieldHelper.getDataFieldAlignment(oDataField, oModel, sEntityPath);
			assert.equal(actualValue, "Begin");
		});
	}
);
