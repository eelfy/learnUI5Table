/* global QUnit */
sap.ui.define(["sap/ui/model/json/JSONModel", "sap/fe/core/helpers/SemanticKeyHelper"], function(JSONModel, SemanticKeyHelper) {
	"use strict";

	var oMetaModel = new JSONModel({
		"SalesOrderManage": {
			"$kind": "EntitySet",
			"$Type": "com.c_salesordermanage_sd.SalesOrderManage"
		},

		"com.c_salesordermanage_sd.SalesOrderManage": {
			"$Key": ["ID", "IsActiveEntity"],
			"ID": {
				"$Type": "Edm.Guid"
			},
			"SalesOrder": {
				"$Type": "Edm.String"
			},
			"IsActiveEntity": {
				"$Type": "Edm.Boolean"
			}
		}
	});

	function createContextStub(sPath, sEntitySetName, mProperties, aSemanticKeys) {
		oMetaModel.getMetaContext = function() {
			return {
				getObject: function() {
					return sEntitySetName;
				}
			};
		};
		oMetaModel.setProperty("/" + sEntitySetName + "/@com.sap.vocabularies.Common.v1.SemanticKey", aSemanticKeys);

		return {
			isA: function() {
				return false;
			},
			getPath: function() {
				return sPath;
			},
			getModel: function() {
				return {
					getMetaModel: function() {
						return oMetaModel;
					}
				};
			},
			getProperty: function(sKey) {
				return mProperties[sKey];
			}
		};
	}

	QUnit.module("SemanticKey helper", {});

	var aSemanticMappingTestData = [
		{
			desc: "One semantic key",
			path: "/SalesOrderManage(ID=123, IsActiveEntity=true)",
			entitySet: "SalesOrderManage",
			contextKeys: { ID: 123 },
			semanticKeys: ["ID"],
			expectedSemPath: "/SalesOrderManage(123)"
		},
		{
			desc: "Two semantic keys",
			path: "/SalesOrderManage(ID=123, IsActiveEntity=true)",
			entitySet: "SalesOrderManage",
			contextKeys: { ID: 123, IsActiveEntity: true },
			semanticKeys: ["ID", "IsActiveEntity"],
			expectedSemPath: "/SalesOrderManage(ID=123,IsActiveEntity=true)"
		},
		{
			desc: "One semantic key (string)",
			path: "/SalesOrderManage(ID=123, IsActiveEntity=true)",
			entitySet: "SalesOrderManage",
			contextKeys: { SalesOrder: "ABCD" },
			semanticKeys: ["SalesOrder"],
			expectedSemPath: "/SalesOrderManage('ABCD')"
		},
		{
			desc: "Two semantic keys (string)",
			path: "/SalesOrderManage(ID=123, IsActiveEntity=true)",
			entitySet: "SalesOrderManage",
			contextKeys: { ID: 123, SalesOrder: "ABCD" },
			semanticKeys: ["ID", "SalesOrder"],
			expectedSemPath: "/SalesOrderManage(ID=123,SalesOrder='ABCD')"
		},
		{
			desc: "One semantic key (not found in context)",
			path: "/SalesOrderManage(ID=123, IsActiveEntity=true)",
			entitySet: "SalesOrderManage",
			contextKeys: {},
			semanticKeys: ["SalesOrder"],
			expectedSemPath: "/SalesOrderManage(ID=123, IsActiveEntity=true)"
		},
		{
			desc: "One semantic key (found in context but not set/available)",
			path: "/SalesOrderManage(ID=123, IsActiveEntity=true)",
			entitySet: "SalesOrderManage",
			contextKeys: { SalesOrder: null },
			semanticKeys: ["SalesOrder"],
			expectedSemPath: "/SalesOrderManage(ID=123, IsActiveEntity=true)"
		},
		{
			desc: "Two semantic keys (not found in context)",
			path: "/SalesOrderManage(ID=123, IsActiveEntity=true)",
			entitySet: "SalesOrderManage",
			contextKeys: { ID: 123 },
			semanticKeys: ["ID", "SalesOrder"],
			expectedSemPath: "/SalesOrderManage(ID=123, IsActiveEntity=true)"
		},
		{
			desc: "Path not eligible for semantic key mapping",
			path: "/SalesOrderManage(ID=123, IsActiveEntity=true)/_Item(XX)",
			entitySet: "_Item",
			contextKeys: { ID: 123 },
			semanticKeys: ["ID"],
			expectedSemPath: "/SalesOrderManage(ID=123, IsActiveEntity=true)/_Item(XX)"
		},
		{
			desc: "No semantic key",
			path: "/SalesOrderManage(ID=123, IsActiveEntity=true)",
			entitySet: "SalesOrderManage",
			contextKeys: { ID: 123 },
			semanticKeys: null,
			expectedSemPath: "/SalesOrderManage(ID=123, IsActiveEntity=true)"
		}
	];

	aSemanticMappingTestData.forEach(function(oTestData) {
		QUnit.test("getSemanticPath - " + oTestData.desc, function(assert) {
			var aSemanticKeys =
				oTestData.semanticKeys &&
				oTestData.semanticKeys.map(function(key) {
					return { $PropertyPath: key };
				});
			var oContext = createContextStub(oTestData.path, oTestData.entitySet, oTestData.contextKeys, aSemanticKeys);

			var sSemPath = SemanticKeyHelper.getSemanticPath(oContext);
			//assert.equal(oMapping.technicalPath, oTestData.path, "testing technical path value");
			assert.equal(sSemPath, oTestData.expectedSemPath, "testing semantic path value");
		});
	});
});
