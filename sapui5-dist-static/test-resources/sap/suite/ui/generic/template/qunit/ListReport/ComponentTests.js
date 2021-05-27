/**
 * tests for the sap.suite.ui.generic.template.ListReport.Component.js
 */
sap.ui.define([ "sap/ui/thirdparty/sinon",
				"sap/ui/thirdparty/sinon-qunit",
				"sap/suite/ui/generic/template/ListReport/Component",
				"sap/suite/ui/generic/template/genericUtilities/testableHelper"
			 ],
		function(Sinon, SinonQunit, Component, testableHelper) {
			"use strict";

			var oComponentUtils = {
				getControllerExtensions: Function.prototype,
				isDraftEnabled: function () {
						return false;
				}
			};
			var oAppComponent = {
				getFlexibleColumnLayout: function(){ return false; }
			};
			var oComponent = {
				getAppComponent: function(){ return oAppComponent; }
			};
			var sandbox;

			module("getTemplateSpecificParameters Test Module", {
				setup : function() {
					testableHelper.startTest();
					this.oStubForPrivate = testableHelper.getStaticStub();
					this.oMetaModel = {
						getODataEntitySet: function(entitySet) {
							return {
								entityType : "entityType"
							};
						},
						getODataEntityType: function(entityType) {
							return {
								"com.sap.vocabularies.UI.v1.SelectionFields": []
							 };
						}
					};
					this.Device = {
						system: {
							phone: false
						}
					};
					this.sEntitySet = 'sLeadingEntitySet';
					sandbox = Sinon.sandbox.create();
				},
				teardown : function() {
					testableHelper.endTest();
				}
			});

			test("getTemplateSpecificParameters without quickVariantSelectionX", function() {
				//Arrange
				var oSettings = {
					tableSettings: {
						enableMultiEditDialog: true
					}
				};
				var oExpected = {
					allControlConfiguration: [],
					bNewAction: undefined,
					datePropertiesSettings: {},
					isResponsiveTable: true,
					isIndicatorRequired: true,
					isSelflinkRequired: true,
					isSemanticallyConnected: false,
					multiEdit: true,
					tableSettings: {
						enableMultiEditDialog: true,
						inlineDelete: false,
						multiSelect: false,
						mode: "SingleSelectLeft",
						onlyForDelete: true,
						selectAll: false,
						selectionLimit: 200,
						type: "ResponsiveTable"
					},
					"targetEntities": {
						"entityType": {
							"mTargetEntities": {},
							"sForceLinkRendering": "{}"
						  }
					}
				};
				//Act
				var oResult = this.oStubForPrivate.Component_getMethods(oComponent, oComponentUtils).getTemplateSpecificParameters(this.oMetaModel, oSettings, this.Device, this.sEntitySet);
				//Assert
				assert.deepEqual(oResult, oExpected, "fetches correct teplateSpecificParameters");
				//Clean
			});

			test("getTemplateSpecificParameters without quickVariantSelectionX", function() {
				//Arrange
				var oSettings = {
					tableSettings: {
						type: "GridTable",
						multiSelect: true
					}
				};
				var oExpected = {
					allControlConfiguration: [],
					bNewAction: undefined,
					datePropertiesSettings: {},
					isResponsiveTable: false,
					isIndicatorRequired: true,
					isSelflinkRequired: true,
					isSemanticallyConnected: false,
					tableSettings: {
						inlineDelete: false,
						multiSelect: true,
						mode: "MultiToggle",
						onlyForDelete: true,
						selectAll: false,
						selectionLimit: 200,
						type: "GridTable"
					},
					"targetEntities": {
						"entityType": {
							"mTargetEntities": {},
							"sForceLinkRendering": "{}"
						  }
					}
				};
				//Act
				var oResult = this.oStubForPrivate.Component_getMethods(oComponent, oComponentUtils).getTemplateSpecificParameters(this.oMetaModel, oSettings, this.Device, this.sEntitySet);
				//Assert
				assert.deepEqual(oResult, oExpected, "fetches correct teplateSpecificParameters");
				//Clean
			});

			test("getTemplateSpecificParameters without quickVariantSelectionX", function () {
				//Arrange
				var oSettings = {
					tableSettings: {
						// table 'Delete' mode
						"inlineDelete": true
					}
				};
				var oExpected = {
					"allControlConfiguration": [],
					bNewAction: undefined,
					"datePropertiesSettings": {},
					"isResponsiveTable": true,
					"isIndicatorRequired": true,
					"isSelflinkRequired": true,
					"isSemanticallyConnected": false,
					"tableSettings": {
						"inlineDelete": true,
						"multiSelect": false,
						mode: "Delete",
						onlyForDelete: true,
						"selectAll": false,
						"selectionLimit": 200,
						"type": "ResponsiveTable"
					},
					"targetEntities": {
						"entityType": {
							"mTargetEntities": {},
							"sForceLinkRendering": "{}"
						  }
					}
				};
				//Act
				var oResult = this.oStubForPrivate.Component_getMethods(oComponent, oComponentUtils).getTemplateSpecificParameters(this.oMetaModel, oSettings, this.Device, this.sEntitySet);
				//Assert
				assert.deepEqual(oResult, oExpected, "fetches correct teplateSpecificParameters");
				//Clean
			});


			test("getTemplateSpecificParameters without quickVariantSelectionX and updateRestrictions", function() {
				sandbox.stub(this.oMetaModel, "getODataEntitySet", function(){
					return {
						"Org.OData.Capabilities.V1.UpdateRestrictions": {
							Updatable: {Bool: "false"}
						},
						entityType : "entityType"
					};
				});
				//Arrange
				var oSettings = {
					tableSettings: {
						enableMultiEditDialog: true
					}
				};
				var oExpected = {
					allControlConfiguration: [],
					bNewAction: undefined,
					datePropertiesSettings: {},
					"isIndicatorRequired": true,
					isResponsiveTable: true,
					"isSelflinkRequired": true,
					"isSemanticallyConnected": false,
					multiEdit: false,
					tableSettings: {
						enableMultiEditDialog: true,
						inlineDelete: false,
						multiSelect: false,
						mode: "SingleSelectLeft",
						onlyForDelete: true,
						selectAll: false,
						selectionLimit: 200,
						type: "ResponsiveTable"
					},
					"targetEntities": {
						"entityType": {
							"mTargetEntities": {},
							"sForceLinkRendering": "{}"
						  }
					}
				};
				//Act
				var oResult = this.oStubForPrivate.Component_getMethods(oComponent, oComponentUtils).getTemplateSpecificParameters(this.oMetaModel, oSettings, this.Device, this.sEntitySet);
				//Assert
				assert.deepEqual(oResult, oExpected, "fetches correct teplateSpecificParameters");
				//Clean
			});

			test("getTemplateSpecificParameters with quickVariantSelectionX", function() {
				//Arrange
				var oSettings = {
					tableSettings: {
					},
					quickVariantSelectionX: {
						variants: {
							"1": {
								key: "1"
							}
						}
					}
				};
				var oExpectedSettings = {
					"allControlConfiguration": [],
					bNewAction: undefined,
					"datePropertiesSettings": {},
					"isResponsiveTable": true,
					"isIndicatorRequired": true,
					"isSelflinkRequired": true,
					"isSemanticallyConnected": false,
					"quickVariantSelectionX": {
						"variants": {
							"1": {
								"key": "1",
								"isSmartChart": false,
								"tableSettings": {
									"inlineDelete": false,
									"multiSelect": false,
									mode: "SingleSelectLeft",
									onlyForDelete: true,
									"selectAll": false,
									"selectionLimit": 200,
									"type": "ResponsiveTable"
								}
							}
						}
					},
					"targetEntities": {
						"entityType": {
							"mTargetEntities": {},
							"sForceLinkRendering": "{}"
						  }
					}
				};
				//Act
				var oResult = this.oStubForPrivate.Component_getMethods(undefined, oComponentUtils).getTemplateSpecificParameters(this.oMetaModel, oSettings, this.Device, this.sEntitySet);
				//Assert
				assert.deepEqual(oResult, oExpectedSettings, "fetches correct teplateSpecificParameters");
				//Clean
			});

			test("getTemplateSpecificParameters with quickVariantSelectionX2", function() {
				//Arrange
				var oSettings = {
					tableSettings: {
						type: "GridTable",
						selectAll: true
					},
					quickVariantSelectionX: {
						variants: {
							"1": {
								key: "1"
							}
						}
					}
				};
				var oExpectedSettings = {
					"allControlConfiguration": [],
					bNewAction: undefined,
					"datePropertiesSettings": {},
					"isResponsiveTable": false,
					"isIndicatorRequired": true,
					"isSelflinkRequired": true,
					"isSemanticallyConnected": false,
					"quickVariantSelectionX": {
						"variants": {
							"1": {
								"key": "1",
								"isSmartChart": false,
								"tableSettings": {
									"inlineDelete": false,
									"multiSelect": false,
									mode: "Single",
									onlyForDelete: true,
									"selectAll": true,
									"selectionLimit": 200,
									"type": "GridTable"
								}
							}
						}
					},
					"targetEntities": {
						"entityType": {
							"mTargetEntities": {},
							"sForceLinkRendering": "{}"
						  }
					}
				};
				//Act
				var oResult = this.oStubForPrivate.Component_getMethods(undefined, oComponentUtils).getTemplateSpecificParameters(this.oMetaModel, oSettings, this.Device, this.sEntitySet);
				//Assert
				assert.deepEqual(oResult, oExpectedSettings, "fetches correct teplateSpecificParameters");
				//Clean
			});

			test("getTemplateSpecificParameters with quickVariantSelectionX", function() {
				//Arrange
				var oSettings = {
					tableSettings: {
						type: "GridTable",
						selectAll: true
					},
					quickVariantSelectionX: {
						variants: {
							"1": {
								key: "1",
								tableSettings: {
									type: "TreeTable",
									selectionLimit: 600
								}
							}
						}
					}
				};
				var oExpectedSettings = {
					"allControlConfiguration": [],
					bNewAction: undefined,
					"datePropertiesSettings": {},
					"isResponsiveTable": false,
					"isIndicatorRequired": true,
					"isSelflinkRequired": true,
					"isSemanticallyConnected": false,
					"quickVariantSelectionX": {
						"variants": {
							"1": {
								"key": "1",
								"isSmartChart": false,
								"tableSettings": {
									"inlineDelete": false,
									"multiSelect": false,
									mode: "Single",
									onlyForDelete: true,
									"selectAll": false,
									"selectionLimit": 600,
									"type": "TreeTable"
								}
							}
						}
					},
					"targetEntities": {
						"entityType": {
							"mTargetEntities": {},
							"sForceLinkRendering": "{}"
						  }
					}
				};
				//Act
				var oResult = this.oStubForPrivate.Component_getMethods(undefined, oComponentUtils).getTemplateSpecificParameters(this.oMetaModel, oSettings, this.Device, this.sEntitySet);
				//Assert
				assert.deepEqual(oResult, oExpectedSettings, "fetches correct teplateSpecificParameters");
				//Clean
			});

			test("getTemplateSpecificParameters with quickVariantSelectionX1", function() {
				//Arrange
				var oSettings = {
					tableSettings: {
						type: "GridTable",
						selectAll: true
					},
					quickVariantSelectionX: {
						variants: {
							"1": {
								key: "1",
								tableSettings: {
									type: "AnalyticalTable",
									selectionLimit: 600
								}
							}
						}
					}
				};
				var oExpectedSettings = {
					"allControlConfiguration": [],
					bNewAction: undefined,
					"datePropertiesSettings": {},
					"isResponsiveTable": false,
					"isIndicatorRequired": true,
					"isSelflinkRequired": true,
					"isSemanticallyConnected": false,
					"quickVariantSelectionX": {
						"variants": {
							"1": {
								"key": "1",
								"isSmartChart": false,
								"tableSettings": {
									"inlineDelete": false,
									"multiSelect": false,
									mode: "Single",
									onlyForDelete: true,
									"selectAll": false,
									"selectionLimit": 600,
									"type": "GridTable"
								}
							}
						}
					},
					"targetEntities": {
						"entityType": {
							"mTargetEntities": {},
							"sForceLinkRendering": "{}"
						  }
					}
				};
				//Act
				var oResult = this.oStubForPrivate.Component_getMethods(undefined, oComponentUtils).getTemplateSpecificParameters(this.oMetaModel, oSettings, this.Device, this.sEntitySet);
				//Assert
				assert.deepEqual(oResult, oExpectedSettings, "fetches correct teplateSpecificParameters");
				//Clean
			});

			test("getTemplateSpecificParameters with quickVariantSelectionX", function() {
				//Arrange
				var oMetaModel = {
					getODataEntitySet: function(entitySet) {
						return {
							entityType : "entityType"
						};
					},
					getODataEntityType: function(entityType) {
						return {
							"sap:semantics": "aggregate",
							"com.sap.vocabularies.UI.v1.SelectionFields": []
						};
					}
				};
				var oSettings = {
					tableSettings: {
						type: "GridTable",
						selectAll: true
					},
					quickVariantSelectionX: {
						variants: {
							"1": {
								key: "1",
								tableSettings: {
									type: "AnalyticalTable",
									selectionLimit: 600
								}
							}
						}
					}
				};
				var oExpectedSettings = {
					"allControlConfiguration": [],
					bNewAction: undefined,
					"datePropertiesSettings": {},
					"isResponsiveTable": false,
					"isIndicatorRequired": true,
					"isSelflinkRequired": true,
					"isSemanticallyConnected": false,
					"quickVariantSelectionX": {
						"variants": {
							"1": {
								"key": "1",
								"isSmartChart": false,
								"tableSettings": {
									"inlineDelete": false,
									"multiSelect": false,
									mode: "Single",
									onlyForDelete: true,
									"selectAll": false,
									"selectionLimit": 600,
									"type": "AnalyticalTable"
								}
							}
						}
					},
					"targetEntities": {
						"entityType": {
							"mTargetEntities": {},
							"sForceLinkRendering": "{}"
						  }
					}
				};
			//Act
				var oResult = this.oStubForPrivate.Component_getMethods(undefined, oComponentUtils).getTemplateSpecificParameters(oMetaModel, oSettings, this.Device, this.sEntitySet);
				//Assert
				assert.deepEqual(oResult, oExpectedSettings, "fetches correct teplateSpecificParameters");
				//Clean
			});

			test("getTemplateSpecificParameters with quickVariantSelectionX", function() {
				//Arrange
				var oSettings = {
					tableSettings: {
						type: "GridTable",
						selectAll: true
					},
					quickVariantSelectionX: {
						variants: {
							"1": {
								key: "1",
								tableSettings: {
									type: "GridTable",
									selectionLimit: 600
								}
							},
							"2": {
								key: "2",
								tableSettings: {
									type: "TreeTable",
									selectionLimit: 600
								}
							}
						}
					}
				};
				var oExpectedSettings = {
					"allControlConfiguration": [],
					bNewAction: undefined,
					"datePropertiesSettings": {},
					"isResponsiveTable": false,
					"isIndicatorRequired": true,
					"isSelflinkRequired": true,
					"isSemanticallyConnected": false,
					"quickVariantSelectionX": {
						"variants": {
							"1": {
								"key": "1",
								"isSmartChart": false,
								"tableSettings": {
									"inlineDelete": false,
									"multiSelect": false,
									mode: "Single",
									onlyForDelete: true,
									"selectAll": false,
									"selectionLimit": 600,
									"type": "GridTable"
								}
							},
							"2": {
								"key": "2",
								"isSmartChart": false,
								"tableSettings": {
									"inlineDelete": false,
									"multiSelect": false,
									mode: "Single",
									onlyForDelete: true,
									"selectAll": false,
									"selectionLimit": 600,
									"type": "TreeTable"
								}
							}
						}
					},
					"targetEntities": {
						"entityType": {
							"mTargetEntities": {},
							"sForceLinkRendering": "{}"
						  }
					}
				};
				//Act
				var oResult = this.oStubForPrivate.Component_getMethods(undefined, oComponentUtils).getTemplateSpecificParameters(this.oMetaModel, oSettings, this.Device, this.sEntitySet);
				//Assert
				assert.deepEqual(oResult, oExpectedSettings, "fetches correct teplateSpecificParameters");
				//Clean
			});

			test("getTemplateSpecificParameters with quickVariantSelectionX", function() {
				//Arrange
				var oSettings = {
					tableSettings: {
						type: "GridTable",
						selectAll: true
					},
					quickVariantSelectionX: {
						variants: {
							"1": {
								key: "1",
								tableSettings: {
									type: "GridTable",
									selectionLimit: 600
								}
							},
							"2": {
								key: "2",
								tableSettings: {
									type: "ResponsiveTable",
									selectionLimit: 600
								}
							}
						}
					}
				};
				var oExpectedError = new Error("ListReport.Component: Variant with key 2 resulted in invalid Table Type combination. Please check documentation and update manifest.json.");
				//Act
				try{
					var oResult = this.oStubForPrivate.Component_getMethods(undefined, oComponentUtils).getTemplateSpecificParameters(this.oMetaModel, oSettings, this.Device, this.sEntitySet);
				} catch(err) {
					//Assert
					assert.deepEqual(err.name, "FioriElements", "Error of type FioriElements thrown");
					assert.deepEqual(err.message, oExpectedError.message, "Invalid Table Type combination error");
				}
				//Clean
			});

			test("getTemplateSpecificParameters with quickVariantSelectionX for diff tabletype in root vs tabs", function() {
				//Arrange
				var oMetaModel = {
					getODataEntitySet: function(entitySet) {
						return {
							entityType : entitySet === "rootEntitySet"? "rootEntityType": "entityType"
						};
					},
					getODataEntityType: function(entityType) {
						return {
							"sap:semantics": entityType === "rootEntityType" ? undefined : "aggregate",
							"com.sap.vocabularies.UI.v1.SelectionFields": []
						};
					}
				};
				var oSettings = {
					quickVariantSelectionX: {
						variants: {
							"1": {
								key: "1",
								entitySet: "entitySet",
								tableSettings: {
									type: "GridTable",
									selectionLimit: 600
								}
							}
						}
					}
				};
				var leadingEntitySet = "rootEntitySet";
				var oExpectedResult = {
					"allControlConfiguration": [],
					bNewAction: undefined,
					"datePropertiesSettings": {},
					"isResponsiveTable": false,
					"isIndicatorRequired": true,
					"isSelflinkRequired": true,
					"isSemanticallyConnected": false,
					"quickVariantSelectionX": {
						"variants": {
							"1": {
								"entitySet": "entitySet",
								"isSmartChart": false,
								"key": "1",
								"tableSettings": {
									"inlineDelete": false,
									"multiSelect": false,
									mode: "Single",
									onlyForDelete: true,
									"selectAll": false,
									"selectionLimit": 600,
									"type": "GridTable"
								}
							}
						}
					},
					"targetEntities": {
						"entityType": {
							"mTargetEntities": {},
							"sForceLinkRendering": "{}"
						  }
					}
				};
				//Act
				var oResult = this.oStubForPrivate.Component_getMethods(undefined, oComponentUtils).getTemplateSpecificParameters(oMetaModel, oSettings, this.Device, leadingEntitySet);
				//Assert
				assert.deepEqual(oResult, oExpectedResult, "Fetches expected settings");
				//Clean
			});

			test("getTemplateSpecificParameters with quickVariantSelectionX for diff tabletype in root vs tabs", function() {
				//Arrange
				var oMetaModel = {
					getODataEntitySet: function(entitySet) {
						return {
							entityType : entitySet === "rootEntitySet"? "rootEntityType": "entityType"
						};
					},
					getODataEntityType: function(entityType) {
						return {
							"sap:semantics": entityType === "rootEntityType" ? undefined : "aggregate",
							"com.sap.vocabularies.UI.v1.SelectionFields": []
						};
					}
				};
				var oSettings = {
					quickVariantSelectionX: {
						variants: {
							"1": {
								key: "1",
								entitySet: "entitySet",
								tableSettings: {
									type: "AnalyticalTable",
									selectionLimit: 600
								}
							}
						}
					}
				};
				var leadingEntitySet = "rootEntitySet";
				var oExpectedResult = {
					"allControlConfiguration": [],
					bNewAction: undefined,
					"datePropertiesSettings": {},
					"isResponsiveTable": false,
					"isIndicatorRequired": true,
					"isSelflinkRequired": true,
					"isSemanticallyConnected": false,
					"quickVariantSelectionX": {
						"variants": {
							"1": {
								"entitySet": "entitySet",
								"isSmartChart": false,
								"key": "1",
								"tableSettings": {
									"inlineDelete": false,
									"multiSelect": false,
									mode: "Single",
									onlyForDelete: true,
									"selectAll": false,
									"selectionLimit": 600,
									"type": "AnalyticalTable"
								}
							}
						}
					},
					"targetEntities": {
						"entityType": {
							"mTargetEntities": {},
							"sForceLinkRendering": "{}"
						  }
					}
				};
				//Act
				var oResult = this.oStubForPrivate.Component_getMethods(undefined, oComponentUtils).getTemplateSpecificParameters(oMetaModel, oSettings, this.Device, leadingEntitySet);
				//Assert
				assert.deepEqual(oResult, oExpectedResult, "Fetches expected settings");
				//Clean
			});

			test("getTemplateSpecificParameters with quickVariantSelectionX for diff tabletype in root vs tabs", function() {
				//Arrange
				var oMetaModel = {
					getODataEntitySet: function(entitySet) {
						return {
							entityType : entitySet === "rootEntitySet"? "rootEntityType": "entityType"
						};
					},
					getODataEntityType: function(entityType) {
						return {
							"sap:semantics": entityType === "rootEntityType" ? "aggregate" : undefined,
							"com.sap.vocabularies.UI.v1.SelectionFields": []
						};
					}
				};
				var oSettings = {
					quickVariantSelectionX: {
						variants: {
							"1": {
								key: "1",
								entitySet: "entitySet",
								tableSettings: {
									type: "AnalyticalTable",
									selectionLimit: 600
								}
							}
						}
					}
				};
				var leadingEntitySet = "rootEntitySet";
				var oExpectedResult = {
					"allControlConfiguration": [],
					bNewAction: undefined,
					"datePropertiesSettings": {},
					"isResponsiveTable": false,
					"isIndicatorRequired": true,
					"isSelflinkRequired": true,
					"isSemanticallyConnected": false,
					"quickVariantSelectionX": {
						"variants": {
							"1": {
								"entitySet": "entitySet",
								"isSmartChart": false,
								"key": "1",
								"tableSettings": {
									"inlineDelete": false,
									"multiSelect": false,
									mode: "Single",
									onlyForDelete: true,
									"selectAll": false,
									"selectionLimit": 600,
									"type": "GridTable"
								}
							}
						}
					},
					"targetEntities": {
						"entityType": {
							"mTargetEntities": {},
							"sForceLinkRendering": "{}"
						  }
					}
				};
				//Act
				var oResult = this.oStubForPrivate.Component_getMethods(undefined, oComponentUtils).getTemplateSpecificParameters(oMetaModel, oSettings, this.Device, leadingEntitySet);
				//Assert
				assert.deepEqual(oResult, oExpectedResult, "Fetches expected settings");
				//Clean
			});

			test("getTemplateSpecificParameters with quickVariantSelectionX for diff tabletype in root vs tabs", function() {
				//Arrange
				var oMetaModel = {
					getODataEntitySet: function(entitySet) {
						return {
							entityType : entitySet === "rootEntitySet"? "rootEntityType": "entityType"
						};
					},
					getODataEntityType: function(entityType) {
						return {
							"sap:semantics": entityType === "rootEntityType" ? "aggregate" : undefined,
							"com.sap.vocabularies.UI.v1.SelectionFields": []
						};
					}
				};
				var oSettings = {
					quickVariantSelectionX: {
						variants: {
							"1": {
								key: "1",
								entitySet: "entitySet",
								tableSettings: {
									type: "ResponsiveTable",
									selectionLimit: 600
								}
							}
						}
					}
				};
				var leadingEntitySet = "rootEntitySet";
				var oExpectedResult = {
					"allControlConfiguration": [],
					bNewAction: undefined,
					"datePropertiesSettings": {},
					"isResponsiveTable": true,
					"isIndicatorRequired": true,
					"isSelflinkRequired": true,
					"isSemanticallyConnected": false,
					"quickVariantSelectionX": {
						"variants": {
							"1": {
								"entitySet": "entitySet",
								"isSmartChart": false,
								"key": "1",
								"tableSettings": {
									"inlineDelete": false,
									"multiSelect": false,
									mode: "SingleSelectLeft",
									onlyForDelete: true,
									"selectAll": false,
									"selectionLimit": 600,
									"type": "ResponsiveTable"
								}
							}
						}
					},
					"targetEntities": {
						"entityType": {
							"mTargetEntities": {},
							"sForceLinkRendering": "{}"
						  }
					}
				};
				//Act
				var oResult = this.oStubForPrivate.Component_getMethods(undefined, oComponentUtils).getTemplateSpecificParameters(oMetaModel, oSettings, this.Device, leadingEntitySet);
				//Assert
				assert.deepEqual(oResult, oExpectedResult, "Fetches expected settings");
				//Clean
			});

			test("getTemplateSpecificParameters with quickVariantSelectionX for smartChart", function() {
				//Arrange
				this.oMetaModel.getODataEntityType = function(entityType) {
					return {
						path: {
							PresentationVariant: {
								Visualizations: [
									{
										AnnotationPath: "com.sap.vocabularies.UI.v1.Chart"
									}
								]
							}
						},
						"com.sap.vocabularies.UI.v1.SelectionFields": []
					};
				}

				var oSettings = {
					quickVariantSelectionX: {
						variants: {
							"1": {
								key: "1",
								annotationPath: "path"
							}
						}
					}
				};
				var oExpectedSettings = {
					"allControlConfiguration": [],
					bNewAction: undefined,
					"datePropertiesSettings": {},
					"isResponsiveTable": true,
					"isIndicatorRequired": true,
					"isSelflinkRequired": true,
					"isSemanticallyConnected": false,
					"quickVariantSelectionX": {
						"variants": {
							"1": {
								"annotationPath": "path",
								"isSmartChart": true,
								"key": "1"
							}
						}
					},
					"targetEntities": {}
				};
				//Act
				var oResult = this.oStubForPrivate.Component_getMethods(undefined, oComponentUtils).getTemplateSpecificParameters(this.oMetaModel, oSettings, this.Device, this.sEntitySet);
				//Assert
				assert.deepEqual(oResult, oExpectedSettings, "fetches correct teplateSpecificParameters");
				//Clean
			});

			test("getTemplateSpecificParameters with quickVariantSelectionX for smartChart", function() {
				//Arrange
				this.oMetaModel.getODataEntityType = function(entityType) {
					return {
						path: {
							PresentationVariant: {
								Visualizations: [
									{
										AnnotationPath: "com.sap.vocabularies.UI.v1.Chart"
									}
								]
							}
						},
						"com.sap.vocabularies.UI.v1.SelectionFields": []
					};
				}

				var oSettings = {
					quickVariantSelectionX: {
						variants: {
							"1": {
								key: "1",
								annotationPath: "path"
							}
						}
					}
				};
				var oExpectedSettings = {
					"allControlConfiguration": [],
					bNewAction: undefined,
					"datePropertiesSettings": {},
					"isResponsiveTable": true,
					"isIndicatorRequired": true,
					"isSelflinkRequired": true,
					"isSemanticallyConnected": false,
					"quickVariantSelectionX": {
						"variants": {
							"1": {
								"annotationPath": "path",
								"isSmartChart": true,
								"key": "1"
							}
						}
					},
					"targetEntities": {}
				};
				//Act
				var oResult = this.oStubForPrivate.Component_getMethods(undefined, oComponentUtils).getTemplateSpecificParameters(this.oMetaModel, oSettings, this.Device, this.sEntitySet);
				//Assert
				assert.deepEqual(oResult, oExpectedSettings, "fetches correct teplateSpecificParameters");
				//Clean
			});

			test("getTemplateSpecificParameters with quickVariantSelectionX for smartChart", function() {
				//Arrange
				this.oMetaModel.getODataEntityType = function(entityType) {
					return {
						path: {
							Visualizations: [
								{
									AnnotationPath: "com.sap.vocabularies.UI.v1.Chart"
								}
							]
						},
						"com.sap.vocabularies.UI.v1.SelectionFields": []
					};
				}

				var oSettings = {
					quickVariantSelectionX: {
						variants: {
							"1": {
								key: "1",
								annotationPath: "path"
							}
						}
					}
				};
				var oExpectedSettings = {
					"allControlConfiguration": [],
					bNewAction: undefined,
					"datePropertiesSettings": {},
					"isResponsiveTable": true,
					"isIndicatorRequired": true,
					"isSelflinkRequired": true,
					"isSemanticallyConnected": false,
					"quickVariantSelectionX": {
						"variants": {
							"1": {
								"annotationPath": "path",
								"isSmartChart": true,
								"key": "1"
							}
						}
					},
					"targetEntities": {}
				};
				//Act
				var oResult = this.oStubForPrivate.Component_getMethods(undefined, oComponentUtils).getTemplateSpecificParameters(this.oMetaModel, oSettings, this.Device, this.sEntitySet);
				//Assert
				assert.deepEqual(oResult, oExpectedSettings, "fetches correct teplateSpecificParameters");
				//Clean
			});
			test("getTemplateSpecificParameters with useNewActionCreate", function() {
				//Arrange
				this.oMetaModel.getODataEntityType = function(entityType) {
					return {
						path: {
							Visualizations: [
								{
									AnnotationPath: "com.sap.vocabularies.UI.v1.Chart"
								}
							]
						},
						"com.sap.vocabularies.UI.v1.SelectionFields": []
					};
				}
				var oDraftContext = {
					getODataDraftFunctionImportName: function() {
						return "function-import-name";
					}
				}
				var oModel = {};
				var oSettings = {
					useNewActionForCreate: true
				};
				var oExpectedSettings = {
					"allControlConfiguration": [],
					"bNewAction": true,
					"datePropertiesSettings": {},
					"isIndicatorRequired": true,
					"isResponsiveTable": true,
					"isSelflinkRequired": true,
					"isSemanticallyConnected": false,
					"tableSettings": {
						"inlineDelete": false,
						"mode": "SingleSelectLeft",
						"multiSelect": false,
						"onlyForDelete": true,
						"selectAll": false,
						"selectionLimit": 200,
						"type": "ResponsiveTable"
					},
					"useNewActionForCreate": true,
					"targetEntities": {
						"entityType": {
							"mTargetEntities": {},
							"sForceLinkRendering": "{}"
						  }
					}
			  };
				//Act
				var oResult = this.oStubForPrivate.Component_getMethods(undefined, oComponentUtils).getTemplateSpecificParameters(this.oMetaModel, oSettings, this.Device, this.sEntitySet, oDraftContext, oModel);
				//Assert
				assert.deepEqual(oResult, oExpectedSettings, "fetches correct teplateSpecificParameters");
				//Clean
			});
		});
