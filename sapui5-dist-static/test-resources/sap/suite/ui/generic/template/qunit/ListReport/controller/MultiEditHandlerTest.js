/**
 * tests for the sap.suite.ui.generic.template.ListReport.controller.MultiEditHandler.js
 */
sap.ui.define([ "sap/ui/model/json/JSONModel",
				"testUtils/sinonEnhanced",
				"sap/suite/ui/generic/template/ListReport/controller/MultiEditHandler",
                "sap/suite/ui/generic/template/genericUtilities/testableHelper",
                "sap/ui/comp/smartmultiedit/Container",
			  ],
			  function(JSONModel, sinon, MultiEditHandler, testableHelper, Container) {
    "use strict";
    var aContexts = [];
    var aUpdatableContexts = [];
    var aColumns = [];
    var obj = {entityType: null};
    var sandbox, oStubForPrivate;
    var oMultiEditHandler;

	module("MultiEditHandler", {
		setup: function() {
           sandbox = sinon.sandbox.create();
            oStubForPrivate = testableHelper.startTest();
            oMultiEditHandler = new MultiEditHandler(oState, oController, oTemplateUtils);	
		},
		teardown: function() {
			testableHelper.endTest();
			sandbox.restore();
		}
    });

    var oState = {
		oSmartTable: {
            getEntitySet: function() {
                return "salesordernd";
            },
            getTable: function() {
                return {
                    getSelectedContexts: function() {
                        return aContexts; 
                    },
                    getColumns: function() {
                        return aColumns;
                    }
                };
            },
            getModel: function() {
                return {
                    getMetaModel: function() {
                        return {
                            getODataEntityType: function() {
                                return null;
                            },
                            getODataEntitySet: function() {
                                return obj;
                            }
                        };
                    }
                }
            }
		},
		oSmartFilterbar: {
			getFilters: function() {
				return {};
			},
			attachSearch: function() {
				return {};
			}
		},
		oIappStateHandler: {
			areDataShownInTable: function(){
				return bAreDataShownInTable;
			},
			changeIappState: function() {
				// nothing
			}
		},
		oWorklistData: {
			bWorkListEnabled: false
		}
    };
    var oController = {
		getOwnerComponent: function(){ return oComponent; },
		byId: function(sControlId){ return oSwithingControl; }
    };
    var oTemplateUtils = {
		oComponentUtils: {
			getTemplatePrivateModel: function(){
				return oTemplatePrivateModel;
			},
			getSettings: function() {
				return mSettings;
			}
		},
		oCommonUtils: {
            filterUpdatableContexts: function(oElement) {
				return aUpdatableContexts;
            },
            getDialogFragmentAsync: function(oElement) {
				return Promise.resolve(oMultiEditDialog);
            },
            getText: function() {
                return "Edit Object";
            }
		},
		oServices: {
			oApplication: {
				getBusyHelper: function() {
					return {
						getBusyDelay: function() {
							return 0; // for the test every asynchronous operation is considered as 'long running'
						}
					};
				}
            },
            oCRUDManager: {
                updateMultipleEntities: function() {
                    return Promise.resolve();
                }
            }
		}
    };

    var oMultiEditDialog = {
        getModel: function() {
            return {
                setProperty: function() {
                    return "";
                }
            };
        },
        addContent: function() {
            return oContainer;
        },
        open: function() {
            assert.ok(true, "MultiEdit Dialog is open successfully");
        },
        getContent: function() {
            return [oContainer];
        },
        close: function() {
            return null;
        },
        destroyContent: function() {
            return null;
        }
    };

    var oContainer = new Container();
    oContainer.setContexts(aUpdatableContexts);
    oMultiEditDialog.addContent(oContainer);
    
    var oEvent = {
        getSource: function() {
            return {
                getParent: function() {
                    return oMultiEditDialog;
                }
            }
        }
    }

	QUnit.test("Check if MultiEditHandler loaded correctly", function(assert) {
		try {
			assert.ok(oMultiEditHandler != null, "oMultiEditHandler instance creation was successfull");
		} catch (e) {
			assert.notOk(e != null, "oMultiEditHandler instance creation was not successfull");
		}
    });

    aContexts.push({ getPath: function() { return "/ProductType(SalesOrderItem = '10')"; }, sPath:"/ProductType()", getProperty: function() { return "10"; }});					
	aUpdatableContexts.push({ getPath: function() { return "/ProductType(SalesOrderItem = '10')"; }, sPath:"/ProductType()", getProperty: function() { return "10"; }});					

    QUnit.test("Check if Multi Edit is Possible where all the selected context is Updatable", function(assert) {

    var oMultiEditDialog = {
        getModel: function() {
            return {
                setProperty: function() {
                    return "";
                }
            };
        },
        addContent: function() {
            return oContainer;
        },
        open: function() {
            assert.ok(true, "MultiEdit Dialog is open successfully");
        },
        getContent: function() {
            return [oContainer];
        },
        close: function() {
            return null;
        },
        destroyContent: function() {
            return null;
        }
    };
        sandbox.stub(oTemplateUtils.oCommonUtils, "getDialogFragmentAsync", function (sName, oController) { 
            return Promise.resolve(oMultiEditDialog);
        })
        var sResult = oMultiEditHandler.onMultiEditButtonPress();
        assert.strictEqual(sResult, undefined, "Multi Edit is possible for all the selected Field");
    });
			
	QUnit.test("Check if Multi Edit is Possible where few of the selected context is Updatable", function(assert) {
        var oMultiEditConfirmationDialog = {
            getModel: function() {
                return {
                    setProperty: function() {
                        return "";
                    }
                };
            },
            addContent: function() {
                return oContainer;
            },
            open: function() {
                assert.ok(true, "MultiEdit Confirmation Dialog is open successfully");
            },
            getContent: function() {
                return [oContainer];
            },
            close: function() {
                return null;
            }
        };
        aContexts.push({ getPath: function() { return "/ProductType(SalesOrderItem = '11')"; }, sPath:"/ProductType()", getProperty: function() { return "11"; }});
        sandbox.stub(oTemplateUtils.oCommonUtils, "getDialogFragmentAsync", function (sName, oController) { 
            return Promise.resolve(oMultiEditConfirmationDialog);
        })
        var sResult = oMultiEditHandler.onMultiEditButtonPress();
		assert.strictEqual(sResult, undefined, "Multi Edit is possible for few of the selected Field");
    });

    QUnit.test("Check if fnStartMultiSave is called", function(assert) {
        var sResult = oStubForPrivate.fnStartMultiSave(oEvent);
		assert.strictEqual(sResult, undefined, "fnStartMultiSave is called from MultiEdit Dialog");
    });


});
