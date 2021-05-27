/* global QUnit */
sap.ui.define(["sap/fe/core/helpers/StableIdHelper"], function(StableIdHelper) {
	"use strict";
	QUnit.module("Stable Id", {});

	QUnit.test("generate stable id with constants", function(assert) {
		[
			{
				aIdParts: ["filterBar"],
				sId: "filterBar"
			},
			{
				aIdParts: ["template", "filterBar"],
				sId: "template::filterBar"
			},
			{
				aIdParts: ["template", "table", "column"],
				sId: "template::table::column"
			}
		].forEach(function(oElement) {
			assert.equal(StableIdHelper.generate(oElement.aIdParts), oElement.sId, "Correct Id generated.");
		});
	});

	QUnit.test("generate stable id with constants and special characters", function(assert) {
		[
			{
				aIdParts: ["template/filterBar"],
				sId: "template::filterBar"
			},
			{
				aIdParts: ["template/table/column"],
				sId: "template::table::column"
			},
			{
				aIdParts: ["template#table@column"],
				sId: "template::table::column"
			},
			{
				aIdParts: ["/template/filterBar/"],
				sId: "template::filterBar"
			},
			{
				aIdParts: ["@template/table/column@"],
				sId: "template::table::column"
			},
			{
				aIdParts: ["#template#table@column#"],
				sId: "template::table::column"
			},
			{
				aIdParts: ["template(table)"],
				sId: "template::table"
			},
			{
				aIdParts: ["template(table)column"],
				sId: "template::table::column"
			}
		].forEach(function(oElement) {
			assert.equal(StableIdHelper.generate(oElement.aIdParts), oElement.sId, "Correct Id generated.");
		});
	});

	QUnit.test("generate parameterized stable id from Reference Facet", function(assert) {
		[
			{
				oParameter: {
					Facet: {
						$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet",
						Label: "Assigned Persons",
						Target: {
							$AnnotationPath: "_PersAssign/@com.sap.vocabularies.UI.v1.LineItem"
						}
					}
				},
				sId: "section::_PersAssign::LineItem"
			},
			{
				oParameter: {
					Facet: {
						$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet",
						Label: "Assigned Persons",
						Target: {
							$AnnotationPath: "_PersAssign/@com.sap.vocabularies.UI.v1.LineItem"
						},
						ID: "PersAssign"
					}
				},
				sId: "section::PersAssign"
			}
		].forEach(function(oElement) {
			assert.equal(StableIdHelper.generate(["section", oElement.oParameter]), oElement.sId, "Correct Id generated.");
		});
	});
	QUnit.test("multiple back to back occurrences of separator (::) should be combined into one", function(assert) {
		[
			{
				oParameter: {
					Facet: {
						$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet",
						Label: "Assigned Persons",
						Target: {
							$AnnotationPath: "_PersAssign/@@@/@com.sap.vocabularies.UI.v1.LineItem"
						}
					}
				},
				sId: "section::_PersAssign::LineItem"
			}
		].forEach(function(oElement) {
			assert.equal(StableIdHelper.generate(["section", oElement.oParameter]), oElement.sId, "Correct Id generated.");
		});
	});
	QUnit.test("generate parameterized stable id from Collection Facet", function(assert) {
		[
			{
				oParameter: {
					Facet: {
						$Type: "com.sap.vocabularies.UI.v1.CollectionFacet",
						Label: "General Info Facet Label",
						ID: "GeneralInformation"
					}
				},
				sId: "section::GeneralInformation"
			}
		].forEach(function(oElement) {
			assert.equal(StableIdHelper.generate(["section", oElement.oParameter]), oElement.sId, "Correct Id generated.");
		});
	});

	QUnit.test("Stable Id helper should throw an error", function(assert) {
		[
			{
				aId: ["Hello=*&^"],
				sError: "Hello=::&^ - Stable Id could not be generated due to insufficient information."
			},
			{
				aId: ["Stable Id"],
				sError: "Stable Id - Spaces are not allowed in ID parts."
			}
		].forEach(function(oElement) {
			assert.throws(
				function() {
					StableIdHelper.generate(oElement.aId);
				},
				function(sError) {
					return sError === oElement.sError;
				},
				"Appropriate error thrown"
			);
		});
	});

	/*
	Will be reworked after finshing getStableIdPartFromDataField
	QUnit.test("Unit test to check getStableIdPartFromDataField ", function(assert) {
		[
			{
				oDataField: {
					"$Type": "com.sap.vocabularies.UI.v1.DataFieldForAction",
					"Action": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.BREAK_UP"
				},
				replaceSpecialCharsInIdStub: "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.BREAK_UP",
				expectedValue: "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.BREAK_UP",
				sMessage: "with DataField Type as DataFieldForAction"
			},
			{
				oDataField: {
					"$Type": "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
					"Action": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.BREAK_UP",
					"SemanticObject": "Products"
				},
				semanticObjectStub: "Products",
				actionStub: "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.BREAK_UP",
				expectedValue: "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.BREAK_UP",
				sMessage: "with DataField Type as DataFieldForIntentBasedNavigation"
			},
			{
				oDataField: {
					"$Type": "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
					"Action": {
						"$Path": "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.BREAK_UP"
					},
					"SemanticObject": {
						"$Path": "Products"
					}
				},
				semanticObjectPathStub: "Products",
				actionPathStub: "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.BREAK_UP",
				expectedValue: "com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.BREAK_UP",
				sMessage: "with DataField Type as DataFieldForIntentBasedNavigation"
			},
			{
				oDataField: {
					"$Type": "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
					"Target": {
						"$AnnotationPath": "_Publication/@UI.LineItem"
					}
				},
				targetAnnotationPathStub: "_Publication/@UI.LineItem",
				expectedValue: "_Publication/@UI.LineItem",
				sMessage: "with DataField Type as DataFieldForAnnotation"
			},
			{
				oDataField: {
					"Value": {
						"$Path": "Name"
					}
				},
				valuePathStub: "Name",
				expectedValue: "Name",
				sMessage: "with DataField Value as Path"
			},
			{
				oDataField: {
					"Value": {
						"$Apply": [
							{
								"$Path": "Artists"
							},
							{
								"$Path": "Publications"
							},
							{
								"$Path": "Contributors"
							}
						],
						"$Function": "odata.concat"
					}
				},
				valueApplyPathStub: ["Artists", "Publications", "Contributors"],
				expectedValue: "Artists::Publications::Contributors",
				sMessage: "with DataField Value as $Apply"
			},
			{
				oDataField: {},
				mParameter: {
					context: {
						getObject: function() {
							return "Name";
						}
					}
				},
				expectedValue: "Name",
				sMessage: "with mParameter Value"
			},
			{
				oDataField: {},
				mParameter: {},
				sMessage: "with no Datafield and mParameter"
			}
		].forEach(function(oProperty) {
			var sandbox = sinon.sandbox.create();
			var oStub = sandbox.stub(StableIdHelper, "prepareId");
			oProperty.oDataField.$Type &&
			oStub.withArgs(oProperty.oDataField.$Type).returns("com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.BREAK_UP");
			oProperty.oDataField.SemanticObject && oStub.withArgs(oProperty.oDataField.SemanticObject).returns("Products");
			oProperty.oDataField.Action &&
			oStub
				.withArgs(oProperty.oDataField.Action)
				.returns("com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.BREAK_UP");
			oProperty.oDataField.Action &&
			oProperty.oDataField.Action.$Path &&
			oStub
				.withArgs(oProperty.oDataField.Action.$Path)
				.returns("com.sap.gateway.srvd.sadl_gw_appmusicdr_definition.v0001.BREAK_UP");
			oProperty.oDataField.SemanticObject &&
			oProperty.oDataField.SemanticObject.$Path &&
			oStub.withArgs(oProperty.oDataField.SemanticObject.$Path).returns("Products");
			oProperty.oDataField.Target &&
			oProperty.oDataField.Target.$AnnotationPath &&
			oStub.withArgs(oProperty.oDataField.Target.$AnnotationPath).returns("_Publication/@UI.LineItem");
			oProperty.oDataField.Value &&
			oProperty.oDataField.Value.$Path &&
			oStub.withArgs(oProperty.oDataField.Value.$Path).returns("Name");
			oProperty.oDataField.Value &&
			oProperty.oDataField.Value.$Apply &&
			oProperty.oDataField.Value.$Apply[0] &&
			oStub.withArgs(oProperty.oDataField.Value.$Apply[0].$Path).returns("Artists");
			oProperty.oDataField.Value &&
			oProperty.oDataField.Value.$Apply &&
			oProperty.oDataField.Value.$Apply[1] &&
			oStub.withArgs(oProperty.oDataField.Value.$Apply[1].$Path).returns("Publications");
			oProperty.oDataField.Value &&
			oProperty.oDataField.Value.$Apply &&
			oProperty.oDataField.Value.$Apply[2] &&
			oStub.withArgs(oProperty.oDataField.Value.$Apply[2].$Path).returns("Contributors");
			oProperty.mParameter &&
			oProperty.mParameter.context &&
			oStub.withArgs(oProperty.mParameter.context.getObject()).returns("Name");
			var actualValue = StableIdHelper.getStableIdPartFromDataField(oProperty.oDataField, oProperty.mParameter);
			assert.equal(
				actualValue,
				oProperty.expectedValue,
				"Unit test to check getStableIdPartFromDataField " + oProperty.sMessage + ":  ok"
			);
			sandbox.restore();
		});
	});

	 */
});
