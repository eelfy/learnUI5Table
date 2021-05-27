sap.ui.define(["sap/fe/core/converters/controls/Common/Table", "path", "sap/fe/core/converters/MetaModelConverter", "sap/fe/test/JestTemplatingHelper", "sap/fe/core/converters/templates/BaseConverter", "sap/fe/core/converters/ManifestSettings", "sap/fe/core/helpers/BindingExpression", "sap/fe/core/converters/helpers/BindingHelper"], function (Table, path, MetaModelConverter, JestTemplatingHelper, BaseConverter, ManifestSettings, BindingExpression, BindingHelper) {
  "use strict";

  var UI = BindingHelper.UI;
  var constant = BindingExpression.constant;
  var compileBinding = BindingExpression.compileBinding;
  var bindingExpression = BindingExpression.bindingExpression;
  var CreationMode = ManifestSettings.CreationMode;
  var TemplateType = BaseConverter.TemplateType;
  var getMetaModel = JestTemplatingHelper.getMetaModel;
  var getConverterContext = JestTemplatingHelper.getConverterContext;
  var compileCDS = JestTemplatingHelper.compileCDS;
  var convertTypes = MetaModelConverter.convertTypes;
  var getSelectionMode = Table.getSelectionMode;
  var getTableManifestConfiguration = Table.getTableManifestConfiguration;
  var getCreateVisible = Table.getCreateVisible;
  var convertedTypes;
  var convertedTypesNoOa;
  var convertedTypesAnalyticalService;
  var convertedTypesOaTrue;
  var convertedTypesOaFalse;
  var convertedTypesSelectionMode;
  beforeAll(function () {
    try {
      var sMetadataUrl = compileCDS(path.join(__dirname, "../data/Table.cds"));
      return Promise.resolve(getMetaModel(sMetadataUrl)).then(function (metaModel) {
        convertedTypes = convertTypes(metaModel);
        var sMetadataUrlSelectionMode = compileCDS(path.join(__dirname, "../data/TableGetSelectionMode.cds"));
        return Promise.resolve(getMetaModel(sMetadataUrlSelectionMode)).then(function (metaModelSelectionMode) {
          convertedTypesSelectionMode = convertTypes(metaModelSelectionMode);
          var sMetadataUrlAnalyticalService = compileCDS(path.join(__dirname, "../data/AnalyticalService.cds"));
          return Promise.resolve(getMetaModel(sMetadataUrlAnalyticalService)).then(function (metaModelAnalyticalService) {
            convertedTypesAnalyticalService = convertTypes(metaModelAnalyticalService);
            var sMetadataUrlNoOa = compileCDS(path.join(__dirname, "../data/TableNewActionNoOperationAvailable.cds"));
            return Promise.resolve(getMetaModel(sMetadataUrlNoOa)).then(function (metaModelNoOa) {
              convertedTypesNoOa = convertTypes(metaModelNoOa);
              var sMetadataUrlOaTrue = compileCDS(path.join(__dirname, "../data/TableNewActionOperationAvailableTrue.cds"));
              return Promise.resolve(getMetaModel(sMetadataUrlOaTrue)).then(function (metaModelOaTrue) {
                convertedTypesOaTrue = convertTypes(metaModelOaTrue);
                var sMetadataUrlOaFalse = compileCDS(path.join(__dirname, "../data/TableNewActionOperationAvailableFalse.cds"));
                return Promise.resolve(getMetaModel(sMetadataUrlOaFalse)).then(function (metaModelOaFalse) {
                  convertedTypesOaFalse = convertTypes(metaModelOaFalse);
                });
              });
            });
          });
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  });

  var getTableConfigurationForTest = function (manifestSettings) {
    var _basicContext$getEnti;

    var templateType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : TemplateType.ListReport;
    var isCondensedLayoutCompliant = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var userContentDensities = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "compact";
    var converterOutput = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : convertedTypes;
    var basicContext = getConverterContext(converterOutput, manifestSettings, templateType, userContentDensities);
    return getTableManifestConfiguration((_basicContext$getEnti = basicContext.getEntityType().annotations.UI) === null || _basicContext$getEnti === void 0 ? void 0 : _basicContext$getEnti.LineItem, "@com.sap.vocabularies.UI.v1.LineItem", basicContext, isCondensedLayoutCompliant);
  };

  describe("Table Converter - #getTableManifestConfiguration ", function () {
    it("works with basic configuration", function () {
      var tableConfiguration = getTableConfigurationForTest({
        entitySet: "TestEntity"
      });
      expect(tableConfiguration).toMatchSnapshot();
      expect(tableConfiguration.type === "ResponsiveTable");
    });
    it("Influence the table type", function () {
      var tableConfiguration = getTableConfigurationForTest({
        entitySet: "TestEntity",
        controlConfiguration: {
          "@com.sap.vocabularies.UI.v1.LineItem": {
            tableSettings: {
              type: "GridTable"
            }
          }
        }
      });
      expect(tableConfiguration.type).toEqual("GridTable");
    });
    it("Export Option Default", function () {
      // If defined, then the value should be equal to the provided setting
      var manifestSettings = {
        entitySet: "TestEntity"
      };
      var tableConfiguration = getTableConfigurationForTest(manifestSettings);
      expect(tableConfiguration.enableExport).toBe(true);
      var tableConfigurationOP = getTableConfigurationForTest(manifestSettings, TemplateType.ObjectPage);
      expect(tableConfigurationOP.enableExport).toBe(true);
    });
    it("Influence the Export Option", function () {
      // If defined, then the value should be equal to the provided setting
      var manifestSettings = {
        entitySet: "TestEntity",
        controlConfiguration: {
          "@com.sap.vocabularies.UI.v1.LineItem": {
            tableSettings: {
              enableExport: true
            }
          }
        }
      };
      var tableConfiguration = getTableConfigurationForTest(manifestSettings);
      expect(tableConfiguration.enableExport).toBe(true);
      var tableConfigurationOP = getTableConfigurationForTest(manifestSettings, TemplateType.ObjectPage);
      expect(tableConfigurationOP.enableExport).toBe(true);
      var noPasteManifestSettings = {
        entitySet: "TestEntity",
        controlConfiguration: {
          "@com.sap.vocabularies.UI.v1.LineItem": {
            tableSettings: {
              enablePaste: false
            }
          }
        }
      };
      var tableConfigurationNoPaste = getTableConfigurationForTest(noPasteManifestSettings);
      expect(tableConfigurationNoPaste.enableExport).toBe(true);
      var tableConfigurationNoPasteOP = getTableConfigurationForTest(noPasteManifestSettings, TemplateType.ObjectPage);
      expect(tableConfigurationNoPasteOP.enableExport).toBe(false);
    });
  });
  describe("Table Converter - #getCreateVisible ", function () {
    var IS_INSERTABLE_FALSE = constant(false);
    var IS_INSERTABLE_TRUE = constant(true);
    var IS_INSERTABLE_DYNAMIC = bindingExpression("SomeDynamicExpression");
    var BASIC_CONTEXT_LR;
    var BASIC_CONTEXT_OP;
    var HIDDEN_CONTEXT_LR;
    var HIDDEN_CONTEXT_OP;
    var DYNAMIC_HIDDEN_CONTEXT_LR;
    var DYNAMIC_HIDDEN_CONTEXT_OP;
    var NEW_ACTION_NO_OA;
    var NEW_ACTION_OA_TRUE;
    var NEW_ACTION_OA_FALSE;
    beforeAll(function () {
      BASIC_CONTEXT_LR = getConverterContext(convertedTypes, {
        entitySet: "TestEntity"
      }, TemplateType.ListReport);
      BASIC_CONTEXT_OP = getConverterContext(convertedTypes, {
        entitySet: "TestEntity"
      }, TemplateType.ObjectPage);
      HIDDEN_CONTEXT_LR = getConverterContext(convertedTypes, {
        entitySet: "CreateHiddenEntity"
      }, TemplateType.ListReport);
      HIDDEN_CONTEXT_OP = getConverterContext(convertedTypes, {
        entitySet: "CreateHiddenEntity"
      }, TemplateType.ObjectPage);
      DYNAMIC_HIDDEN_CONTEXT_LR = getConverterContext(convertedTypes, {
        entitySet: "CreateHiddenDynamicEntity"
      }, TemplateType.ListReport);
      DYNAMIC_HIDDEN_CONTEXT_OP = getConverterContext(convertedTypes, {
        entitySet: "CreateHiddenDynamicEntity"
      }, TemplateType.ObjectPage);
      NEW_ACTION_NO_OA = getConverterContext(convertedTypesNoOa, {
        entitySet: "TestEntity"
      }, TemplateType.ListReport);
      NEW_ACTION_OA_TRUE = getConverterContext(convertedTypesOaTrue, {
        entitySet: "TestEntity"
      }, TemplateType.ListReport);
      NEW_ACTION_OA_FALSE = getConverterContext(convertedTypesOaFalse, {
        entitySet: "TestEntity"
      }, TemplateType.ListReport);
    });
    it("If it's statically not insertable -> create is not visible", function () {
      expect(compileBinding(getCreateVisible(BASIC_CONTEXT_LR, CreationMode.CreationRow, IS_INSERTABLE_FALSE))).toEqual("false");
      expect(compileBinding(getCreateVisible(BASIC_CONTEXT_LR, "External", IS_INSERTABLE_FALSE))).toEqual("false");
      expect(compileBinding(getCreateVisible(BASIC_CONTEXT_OP, CreationMode.CreationRow, IS_INSERTABLE_FALSE))).toEqual("false");
      expect(compileBinding(getCreateVisible(BASIC_CONTEXT_OP, "External", IS_INSERTABLE_FALSE))).toEqual("false");
    });
    it("If create is statically hidden -> create is not visible", function () {
      expect(compileBinding(getCreateVisible(HIDDEN_CONTEXT_LR, CreationMode.CreationRow, IS_INSERTABLE_TRUE))).toEqual("false");
      expect(compileBinding(getCreateVisible(HIDDEN_CONTEXT_LR, "External", IS_INSERTABLE_TRUE))).toEqual("false");
      expect(compileBinding(getCreateVisible(HIDDEN_CONTEXT_OP, CreationMode.CreationRow, IS_INSERTABLE_TRUE))).toEqual("false");
      expect(compileBinding(getCreateVisible(HIDDEN_CONTEXT_OP, "External", IS_INSERTABLE_TRUE))).toEqual("false");
    });
    it("Otherwise if the create mode is external -> create is visible", function () {
      expect(compileBinding(getCreateVisible(BASIC_CONTEXT_LR, "External", IS_INSERTABLE_TRUE))).toEqual("true");
      expect(compileBinding(getCreateVisible(BASIC_CONTEXT_OP, "External", IS_INSERTABLE_TRUE))).toEqual("true");
      expect(compileBinding(getCreateVisible(BASIC_CONTEXT_LR, "External", IS_INSERTABLE_DYNAMIC))).toEqual("true");
      expect(compileBinding(getCreateVisible(BASIC_CONTEXT_OP, "External", IS_INSERTABLE_DYNAMIC))).toEqual("true");
      expect(compileBinding(getCreateVisible(DYNAMIC_HIDDEN_CONTEXT_LR, "External", IS_INSERTABLE_TRUE))).toEqual("true");
      expect(compileBinding(getCreateVisible(DYNAMIC_HIDDEN_CONTEXT_OP, "External", IS_INSERTABLE_TRUE))).toEqual("true");
      expect(compileBinding(getCreateVisible(DYNAMIC_HIDDEN_CONTEXT_LR, "External", IS_INSERTABLE_DYNAMIC))).toEqual("true");
      expect(compileBinding(getCreateVisible(DYNAMIC_HIDDEN_CONTEXT_OP, "External", IS_INSERTABLE_DYNAMIC))).toEqual("true");
    });
    it("If we're on the list report -> create is visible", function () {
      expect(compileBinding(getCreateVisible(BASIC_CONTEXT_LR, CreationMode.CreationRow, IS_INSERTABLE_TRUE))).toEqual("true");
      expect(compileBinding(getCreateVisible(DYNAMIC_HIDDEN_CONTEXT_LR, CreationMode.CreationRow, IS_INSERTABLE_TRUE))).toEqual("true");
      expect(compileBinding(getCreateVisible(BASIC_CONTEXT_LR, CreationMode.CreationRow, IS_INSERTABLE_DYNAMIC))).toEqual("true");
      expect(compileBinding(getCreateVisible(DYNAMIC_HIDDEN_CONTEXT_LR, CreationMode.CreationRow, IS_INSERTABLE_DYNAMIC))).toEqual("true");
    });
    it("Otherwise this depends on the value of the the UI.IsEditable", function () {
      expect(getCreateVisible(BASIC_CONTEXT_OP, CreationMode.CreationRow, IS_INSERTABLE_TRUE)).toEqual(UI.IsEditable);
      expect(getCreateVisible(BASIC_CONTEXT_OP, CreationMode.CreationRow, IS_INSERTABLE_DYNAMIC)).toEqual(UI.IsEditable);
      expect(compileBinding(getCreateVisible(DYNAMIC_HIDDEN_CONTEXT_OP, CreationMode.CreationRow, IS_INSERTABLE_TRUE))).toEqual("{= (!%{hiddenCreate} && %{ui>/isEditable})}");
      expect(compileBinding(getCreateVisible(DYNAMIC_HIDDEN_CONTEXT_OP, CreationMode.CreationRow, IS_INSERTABLE_DYNAMIC))).toEqual("{= (!%{hiddenCreate} && %{ui>/isEditable})}");
    });
    it("If a New Action exists create depends on the Core.OperationAvailable annotation", function () {
      expect(compileBinding(getCreateVisible(NEW_ACTION_NO_OA, CreationMode.CreationRow, IS_INSERTABLE_TRUE))).toEqual("true");
      expect(compileBinding(getCreateVisible(NEW_ACTION_NO_OA, CreationMode.CreationRow, IS_INSERTABLE_FALSE))).toEqual("true");
      expect(compileBinding(getCreateVisible(NEW_ACTION_OA_TRUE, CreationMode.CreationRow, IS_INSERTABLE_TRUE))).toEqual("true");
      expect(compileBinding(getCreateVisible(NEW_ACTION_OA_TRUE, CreationMode.CreationRow, IS_INSERTABLE_FALSE))).toEqual("true");
      expect(compileBinding(getCreateVisible(NEW_ACTION_OA_FALSE, CreationMode.CreationRow, IS_INSERTABLE_TRUE))).toEqual("false");
      expect(compileBinding(getCreateVisible(NEW_ACTION_OA_FALSE, CreationMode.CreationRow, IS_INSERTABLE_FALSE))).toEqual("false");
    });
  });
  describe("Table Converter - #getSelectionMode ", function () {
    var getSelectionModeForTest = function (isEntitySet, targetCapabilities, basicContext, visualizationPath) {
      var _basicContext$getEnti2;

      return getSelectionMode((_basicContext$getEnti2 = basicContext.getEntityType().annotations.UI) === null || _basicContext$getEnti2 === void 0 ? void 0 : _basicContext$getEnti2.LineItem, visualizationPath, basicContext, isEntitySet, targetCapabilities);
    };

    it("If the LR is not deletable and its table has not action : the tableSelectionMode is 'None' ", function () {
      var basicContext_LR = getConverterContext(convertedTypesSelectionMode, {
        entitySet: "EntityWithoutActionOnTable"
      }, TemplateType.ListReport);
      var result = getSelectionModeForTest(true, {
        isDeletable: false,
        isUpdatable: false
      }, basicContext_LR, "@com.sap.vocabularies.UI.v1.LineItem");
      expect(result).toEqual("None");
    });
    it("If the LR is deletable and its table has not action : the tableSelectionMode is 'Multi' ", function () {
      var basicContext_LR = getConverterContext(convertedTypesSelectionMode, {
        entitySet: "EntityWithoutActionOnTable"
      }, TemplateType.ListReport);
      var result = getSelectionModeForTest(true, {
        isDeletable: true,
        isUpdatable: false
      }, basicContext_LR, "@com.sap.vocabularies.UI.v1.LineItem");
      expect(result).toEqual("Multi");
    });
    it("If the LR is not deletable and its table has at least 1 bound action : the tableSelectionMode is 'Multi' ", function () {
      var basicContext_LR = getConverterContext(convertedTypesSelectionMode, {
        entitySet: "EntityWithBoundActionOnTable"
      }, TemplateType.ListReport);
      var result = getSelectionModeForTest(true, {
        isDeletable: false,
        isUpdatable: false
      }, basicContext_LR, "@com.sap.vocabularies.UI.v1.LineItem");
      expect(result).toEqual("Multi");
    });
    it("If the LR is not deletable and its table has only unbound actions : the tableSelectionMode is 'None' ", function () {
      var basicContext_LR = getConverterContext(convertedTypesSelectionMode, {
        entitySet: "EntityWithUnBoundActionOnTable"
      }, TemplateType.ListReport);
      var result = getSelectionModeForTest(true, {
        isDeletable: false,
        isUpdatable: false
      }, basicContext_LR, "@com.sap.vocabularies.UI.v1.LineItem");
      expect(result).toEqual("None");
    });
    it("If the LR is not deletable and its table has 1 bound action without hidden annotation : the tableSelectionMode is 'Multi' ", function () {
      var basicContext_LR = getConverterContext(convertedTypesSelectionMode, {
        entitySet: "EntityWithBoundActionOnTable"
      }, TemplateType.ListReport);
      var result = getSelectionModeForTest(true, {
        isDeletable: false,
        isUpdatable: false
      }, basicContext_LR, "@com.sap.vocabularies.UI.v1.LineItem");
      expect(result).toEqual("Multi");
    });
    it("If the LR is not deletable and its table has 1 DataFieldForIntentBasedNavigation statically not hidden and requiring context : the tableSelectionMode is 'Multi' ", function () {
      var basicContext_LR = getConverterContext(convertedTypesSelectionMode, {
        entitySet: "EntityWithActionRequingContextOnTable"
      }, TemplateType.ListReport);
      var result = getSelectionModeForTest(true, {
        isDeletable: false,
        isUpdatable: false
      }, basicContext_LR, "@com.sap.vocabularies.UI.v1.LineItem");
      expect(result).toEqual("Multi");
    });
    it("If the LR is not deletable and its table has 1 DataFieldForIntentBasedNavigation requiring a context with Hidden binding exp : the tableSelectionMode is '{= %{isHidden} === false ? 'Multi' : 'None'}' ", function () {
      var basicContext_LR = getConverterContext(convertedTypesSelectionMode, {
        entitySet: "EntityWithActionRequingContextOnTableWithHiddenExp"
      }, TemplateType.ListReport);
      var result = getSelectionModeForTest(true, {
        isDeletable: false,
        isUpdatable: false
      }, basicContext_LR, "@com.sap.vocabularies.UI.v1.LineItem");
      expect(result).toEqual("{= %{isHidden} === false ? 'Multi' : 'None'}");
    });
    it("If the LR is not deletable and its table has 1 custom bound and statically visible action : the tableSelectionMode is 'Multi' ", function () {
      var manifestSettings = {
        entitySet: "EntityWithCustomActionOnTable",
        controlConfiguration: {
          "@com.sap.vocabularies.UI.v1.LineItem": {
            tableSettings: {
              enableExport: false
            },
            actions: {
              "Action1": {
                press: "xx",
                visible: "true",
                enabled: "true",
                text: "Custom Action",
                enableOnSelect: "xx",
                requiresSelection: true
              }
            }
          }
        }
      };
      var basicContext_LR = getConverterContext(convertedTypesSelectionMode, manifestSettings, TemplateType.ListReport);
      var result = getSelectionModeForTest(true, {
        isDeletable: false,
        isUpdatable: false
      }, basicContext_LR, "@com.sap.vocabularies.UI.v1.LineItem");
      expect(result).toEqual("Multi");
    });
    it("If the LR is not deletable and its table has several custom bound actions with visible key as an expression binding : the tableSelectionMode is 'Multi' in Edit Mode, 'None' otherwise", function () {
      var manifestSettings = {
        entitySet: "EntityWithCustomActionOnTable",
        controlConfiguration: {
          "@com.sap.vocabularies.UI.v1.LineItem": {
            tableSettings: {
              enableExport: false
            },
            actions: {
              "Action1": {
                press: "xx",
                visible: "{= ${ui>/editMode} === 'Editable' }",
                enabled: "true",
                text: "Custom Action1",
                enableOnSelect: "xx",
                requiresSelection: true
              },
              "Action2": {
                press: "xx",
                visible: "{= %{OverallSDProcessStatus} === 'B' }",
                enabled: "true",
                text: "Custom Action2",
                enableOnSelect: "xx",
                requiresSelection: true
              }
            }
          }
        }
      };
      var basicContext_LR = getConverterContext(convertedTypesSelectionMode, manifestSettings, TemplateType.ListReport);
      var result = getSelectionModeForTest(true, {
        isDeletable: false,
        isUpdatable: false
      }, basicContext_LR, "@com.sap.vocabularies.UI.v1.LineItem");
      expect(result).toEqual("{= (( ${ui>/editMode} === 'Editable' ) || ( %{OverallSDProcessStatus} === 'B' )) ? 'Multi' : 'None'}");
    });
    it("If the OP is not deletable and and its table has not action : the tableSelectionMode is 'None' ", function () {
      var basicContext_OP = getConverterContext(convertedTypesSelectionMode, {
        entitySet: "EntityWithoutActionOnTable"
      }, TemplateType.ObjectPage);
      var result = getSelectionModeForTest(false, {
        isDeletable: false,
        isUpdatable: false
      }, basicContext_OP, "@com.sap.vocabularies.UI.v1.LineItem");
      expect(result).toEqual("None");
    });
    it("If the OP is deletable and its table has not action : the tableSelectionMode is Multi in Edit Mode and None otherwise", function () {
      var basicContext_OP = getConverterContext(convertedTypesSelectionMode, {
        entitySet: "EntityWithoutActionOnTable"
      }, TemplateType.ObjectPage);
      var result = getSelectionModeForTest(false, {
        isDeletable: true,
        isUpdatable: false
      }, basicContext_OP, "@com.sap.vocabularies.UI.v1.LineItem");
      expect(result).toEqual("{= %{ui>/editMode} === 'Editable' ? 'Multi' : 'None'}");
    });
    it("If the OP is deletable and its table has 1 DataFieldForIntentBasedNavigation requiring a context with Hidden binding exp with nav property", function () {
      var manifestSettings = {
        entitySet: "EntityWithBoundActionOnTableWithHiddenExp",
        controlConfiguration: {
          "_Item/@com.sap.vocabularies.UI.v1.LineItem": {
            tableSettings: {
              enableExport: false
            }
          }
        }
      };
      var basicContext_OP = getConverterContext(convertedTypesSelectionMode, manifestSettings, TemplateType.ObjectPage);
      var dataModelObjectPath = basicContext_OP.getDataModelObjectPath();
      dataModelObjectPath.targetObject._type = "NavigationProperty";
      dataModelObjectPath.targetObject.partner = "owner";
      var result = getSelectionModeForTest(false, {
        isDeletable: true,
        isUpdatable: false
      }, basicContext_OP, "_Item/@com.sap.vocabularies.UI.v1.LineItem");
      expect(result).toEqual("{= %{ui>/editMode} === 'Editable' ? 'Multi' : (%{Hidden} === false ? 'Multi' : 'None')}");
    });
    it("If the OP is deletable and its table has 1 DataFieldForIntentBasedNavigation requiring a context with an Hidden annotation (without navProp) : the tableSelectionMode is Multi in Edition, None otherwise", function () {
      var basicContext_OP = getConverterContext(convertedTypesSelectionMode, {
        entitySet: "EntityWithBoundAction2OnTableWithHiddenExp"
      }, TemplateType.ObjectPage);
      var result = getSelectionModeForTest(false, {
        isDeletable: true,
        isUpdatable: false
      }, basicContext_OP, "@com.sap.vocabularies.UI.v1.LineItem");
      expect(result).toEqual("{= %{ui>/editMode} === 'Editable' ? 'Multi' : 'None'}");
    });
    it("If the OP is deletable and its table has a mix of visible actions with Hidden and visible binding exp with nav property", function () {
      var manifestSettings = {
        entitySet: "EntityWithMultipleActionsWithBindingExp",
        controlConfiguration: {
          "_Item/@com.sap.vocabularies.UI.v1.LineItem": {
            tableSettings: {
              enableExport: false
            },
            actions: {
              "Action1": {
                press: "xx",
                visible: "{= ${ui>/editMode} === 'Editable' }",
                enabled: "true",
                text: "Custom Action1",
                enableOnSelect: "xx",
                requiresSelection: true
              },
              "Action2": {
                press: "xx",
                visible: "{= %{OverallSDProcessStatus} === 'B' }",
                enabled: "true",
                text: "Custom Action2",
                enableOnSelect: "xx",
                requiresSelection: true
              }
            }
          }
        }
      };
      var basicContext_OP = getConverterContext(convertedTypesSelectionMode, manifestSettings, TemplateType.ObjectPage);
      var dataModelObjectPath = basicContext_OP.getDataModelObjectPath();
      dataModelObjectPath.targetObject._type = "NavigationProperty";
      dataModelObjectPath.targetObject.partner = "owner";
      var result = getSelectionModeForTest(false, {
        isDeletable: true,
        isUpdatable: false
      }, basicContext_OP, "_Item/@com.sap.vocabularies.UI.v1.LineItem");
      expect(result).toEqual("{= %{ui>/editMode} === 'Editable' ? 'Multi' : ((%{Hidden1} === false || %{Hidden2} === false || ( ${ui>/editMode} === 'Editable' ) || ( %{OverallSDProcessStatus} === 'B' )) ? 'Multi' : 'None')}");
    });
  });
  describe("Condensed Layout", function () {
    it("Default Value", function () {
      var manifestSettings = {
        entitySet: "TestEntity"
      };
      var tableConfiguration = getTableConfigurationForTest(manifestSettings);
      expect(tableConfiguration.useCondensedTableLayout).toBe(false);
      var tableConfigurationOP = getTableConfigurationForTest(manifestSettings, TemplateType.ObjectPage);
      expect(tableConfigurationOP.useCondensedTableLayout).toBe(false);
    });
    it("Manifest Forces to true", function () {
      var manifestSettings = {
        entitySet: "TestEntity",
        controlConfiguration: {
          "@com.sap.vocabularies.UI.v1.LineItem": {
            tableSettings: {
              condensedTableLayout: true
            }
          }
        }
      }; // Even if defined, the value should be used only in cases where the setting is compatible

      var tableConfiguration = getTableConfigurationForTest(manifestSettings, TemplateType.ListReport);
      expect(tableConfiguration.useCondensedTableLayout).toBe(false);
      var tableConfigurationOP = getTableConfigurationForTest(manifestSettings, TemplateType.ObjectPage);
      expect(tableConfigurationOP.useCondensedTableLayout).toBe(false); // In a Condensed Layout Compliant Setting, the value should be true

      var tableConfigurationCL = getTableConfigurationForTest(manifestSettings, TemplateType.ListReport, true);
      expect(tableConfigurationCL.useCondensedTableLayout).toBe(true);
      var tableConfigurationCLOP = getTableConfigurationForTest(manifestSettings, TemplateType.ObjectPage, true);
      expect(tableConfigurationCLOP.useCondensedTableLayout).toBe(true);
    });
    it("Manifest Forces to true in incorrect setting from manifest", function () {
      var manifestSettings = {
        entitySet: "TestEntity",
        controlConfiguration: {
          "@com.sap.vocabularies.UI.v1.LineItem": {
            tableSettings: {
              condensedTableLayout: true
            }
          }
        },
        contentDensities: {
          cozy: true,
          compact: false
        }
      }; // In a Condensed Layout Compliant Setting, the value should be true

      var tableConfigurationCL = getTableConfigurationForTest(manifestSettings, TemplateType.ListReport, true);
      expect(tableConfigurationCL.useCondensedTableLayout).toBe(false);
      var tableConfigurationCLOP = getTableConfigurationForTest(manifestSettings, TemplateType.ObjectPage, true);
      expect(tableConfigurationCLOP.useCondensedTableLayout).toBe(false);
    });
    it("Manifest Forces to true in incorrect setting from environment", function () {
      var manifestSettings = {
        entitySet: "TestEntity",
        controlConfiguration: {
          "@com.sap.vocabularies.UI.v1.LineItem": {
            tableSettings: {
              condensedTableLayout: true
            }
          }
        }
      }; // In a Condensed Layout Compliant Setting, the value should be true

      var tableConfigurationCL = getTableConfigurationForTest(manifestSettings, TemplateType.ListReport, true, "cozy");
      expect(tableConfigurationCL.useCondensedTableLayout).toBe(false);
      var tableConfigurationCLOP = getTableConfigurationForTest(manifestSettings, TemplateType.ObjectPage, true, "cozy");
      expect(tableConfigurationCLOP.useCondensedTableLayout).toBe(false);
    });
  });
  describe("Analytical Table", function () {
    var getTableConfigurationForAnalyticalTest = function (manifestSettings) {
      var _basicContext$getEnti3;

      var templateType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : TemplateType.ListReport;
      var converterOutput = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : convertedTypes;
      var tableType = arguments.length > 3 ? arguments[3] : undefined;
      var basicContext = getConverterContext(converterOutput, manifestSettings, templateType);
      basicContext.getManifestControlConfiguration("@com.sap.vocabularies.UI.v1.LineItem").tableSettings.type = (tableType === null || tableType === void 0 ? void 0 : tableType.type) || undefined;
      return getTableManifestConfiguration((_basicContext$getEnti3 = basicContext.getEntityType().annotations.UI) === null || _basicContext$getEnti3 === void 0 ? void 0 : _basicContext$getEnti3.LineItem, "@com.sap.vocabularies.UI.v1.LineItem", basicContext);
    };

    it("If not specified, the default table type is 'AnalyticalTable' on a desktop when the service is Analytical compliant", function () {
      var manifestSettings = {
        entitySet: "TestEntity",
        controlConfiguration: {
          "@com.sap.vocabularies.UI.v1.LineItem": {
            tableSettings: {
              condensedTableLayout: true
            }
          }
        },
        isDesktop: true
      };
      var tableConfigurationALP = getTableConfigurationForAnalyticalTest(manifestSettings, TemplateType.AnalyticalListPage, convertedTypesAnalyticalService);
      expect(tableConfigurationALP.type).toEqual("AnalyticalTable");
    });
    it("If not specified, the default table type is 'ResponsiveTable' on a desktop when the service is NOT Analytical compliant", function () {
      var manifestSettings = {
        entitySet: "TestEntity",
        controlConfiguration: {
          "@com.sap.vocabularies.UI.v1.LineItem": {
            tableSettings: {
              condensedTableLayout: true
            }
          }
        },
        isDesktop: true
      };
      var tableConfigurationALP = getTableConfigurationForAnalyticalTest(manifestSettings, TemplateType.AnalyticalListPage, convertedTypes);
      expect(tableConfigurationALP.type).toEqual("ResponsiveTable");
    });
    it("If not specified, the default table type is 'ResponsiveTable' on a mobile/tablet device no matter the service", function () {
      var manifestSettings = {
        entitySet: "TestEntity",
        controlConfiguration: {
          "@com.sap.vocabularies.UI.v1.LineItem": {
            tableSettings: {
              condensedTableLayout: true
            }
          }
        },
        isDesktop: false
      };
      var tableConfigurationALP = getTableConfigurationForAnalyticalTest(manifestSettings, TemplateType.AnalyticalListPage, convertedTypesAnalyticalService);
      expect(tableConfigurationALP.type).toEqual("ResponsiveTable");
    });
    it("If the tableType is set to AnalyticalTable, but the service is NOT Analytical compliant, the tableType is forced to 'GridTable'", function () {
      var manifestSettings = {
        entitySet: "TestEntity",
        controlConfiguration: {
          "@com.sap.vocabularies.UI.v1.LineItem": {
            tableSettings: {
              condensedTableLayout: true
            }
          }
        },
        isDesktop: true
      };
      var tableType = {
        type: "AnalyticalTable"
      };
      var tableConfigurationALP = getTableConfigurationForAnalyticalTest(manifestSettings, TemplateType.AnalyticalListPage, convertedTypes, tableType);
      expect(tableConfigurationALP.type).toEqual("GridTable");
    });
    it("If the tableType is set to AnalyticalTable, with a service Analytical compliant, the tableType is 'AnalyticalTable'", function () {
      var manifestSettings = {
        entitySet: "TestEntity",
        controlConfiguration: {
          "@com.sap.vocabularies.UI.v1.LineItem": {
            tableSettings: {
              condensedTableLayout: true
            }
          }
        },
        isDesktop: true
      };
      var tableType = {
        type: "AnalyticalTable"
      };
      var tableConfigurationALP = getTableConfigurationForAnalyticalTest(manifestSettings, TemplateType.AnalyticalListPage, convertedTypesAnalyticalService, tableType);
      expect(tableConfigurationALP.type).toEqual("AnalyticalTable");
    });
  });
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRhYmxlLnNwZWMudHMiXSwibmFtZXMiOlsiY29udmVydGVkVHlwZXMiLCJjb252ZXJ0ZWRUeXBlc05vT2EiLCJjb252ZXJ0ZWRUeXBlc0FuYWx5dGljYWxTZXJ2aWNlIiwiY29udmVydGVkVHlwZXNPYVRydWUiLCJjb252ZXJ0ZWRUeXBlc09hRmFsc2UiLCJjb252ZXJ0ZWRUeXBlc1NlbGVjdGlvbk1vZGUiLCJiZWZvcmVBbGwiLCJzTWV0YWRhdGFVcmwiLCJjb21waWxlQ0RTIiwicGF0aCIsImpvaW4iLCJfX2Rpcm5hbWUiLCJnZXRNZXRhTW9kZWwiLCJtZXRhTW9kZWwiLCJjb252ZXJ0VHlwZXMiLCJzTWV0YWRhdGFVcmxTZWxlY3Rpb25Nb2RlIiwibWV0YU1vZGVsU2VsZWN0aW9uTW9kZSIsInNNZXRhZGF0YVVybEFuYWx5dGljYWxTZXJ2aWNlIiwibWV0YU1vZGVsQW5hbHl0aWNhbFNlcnZpY2UiLCJzTWV0YWRhdGFVcmxOb09hIiwibWV0YU1vZGVsTm9PYSIsInNNZXRhZGF0YVVybE9hVHJ1ZSIsIm1ldGFNb2RlbE9hVHJ1ZSIsInNNZXRhZGF0YVVybE9hRmFsc2UiLCJtZXRhTW9kZWxPYUZhbHNlIiwiZ2V0VGFibGVDb25maWd1cmF0aW9uRm9yVGVzdCIsIm1hbmlmZXN0U2V0dGluZ3MiLCJ0ZW1wbGF0ZVR5cGUiLCJUZW1wbGF0ZVR5cGUiLCJMaXN0UmVwb3J0IiwiaXNDb25kZW5zZWRMYXlvdXRDb21wbGlhbnQiLCJ1c2VyQ29udGVudERlbnNpdGllcyIsImNvbnZlcnRlck91dHB1dCIsImJhc2ljQ29udGV4dCIsImdldENvbnZlcnRlckNvbnRleHQiLCJnZXRUYWJsZU1hbmlmZXN0Q29uZmlndXJhdGlvbiIsImdldEVudGl0eVR5cGUiLCJhbm5vdGF0aW9ucyIsIlVJIiwiTGluZUl0ZW0iLCJkZXNjcmliZSIsIml0IiwidGFibGVDb25maWd1cmF0aW9uIiwiZW50aXR5U2V0IiwiZXhwZWN0IiwidG9NYXRjaFNuYXBzaG90IiwidHlwZSIsImNvbnRyb2xDb25maWd1cmF0aW9uIiwidGFibGVTZXR0aW5ncyIsInRvRXF1YWwiLCJlbmFibGVFeHBvcnQiLCJ0b0JlIiwidGFibGVDb25maWd1cmF0aW9uT1AiLCJPYmplY3RQYWdlIiwibm9QYXN0ZU1hbmlmZXN0U2V0dGluZ3MiLCJlbmFibGVQYXN0ZSIsInRhYmxlQ29uZmlndXJhdGlvbk5vUGFzdGUiLCJ0YWJsZUNvbmZpZ3VyYXRpb25Ob1Bhc3RlT1AiLCJJU19JTlNFUlRBQkxFX0ZBTFNFIiwiY29uc3RhbnQiLCJJU19JTlNFUlRBQkxFX1RSVUUiLCJJU19JTlNFUlRBQkxFX0RZTkFNSUMiLCJiaW5kaW5nRXhwcmVzc2lvbiIsIkJBU0lDX0NPTlRFWFRfTFIiLCJCQVNJQ19DT05URVhUX09QIiwiSElEREVOX0NPTlRFWFRfTFIiLCJISURERU5fQ09OVEVYVF9PUCIsIkRZTkFNSUNfSElEREVOX0NPTlRFWFRfTFIiLCJEWU5BTUlDX0hJRERFTl9DT05URVhUX09QIiwiTkVXX0FDVElPTl9OT19PQSIsIk5FV19BQ1RJT05fT0FfVFJVRSIsIk5FV19BQ1RJT05fT0FfRkFMU0UiLCJjb21waWxlQmluZGluZyIsImdldENyZWF0ZVZpc2libGUiLCJDcmVhdGlvbk1vZGUiLCJDcmVhdGlvblJvdyIsIklzRWRpdGFibGUiLCJnZXRTZWxlY3Rpb25Nb2RlRm9yVGVzdCIsImlzRW50aXR5U2V0IiwidGFyZ2V0Q2FwYWJpbGl0aWVzIiwidmlzdWFsaXphdGlvblBhdGgiLCJnZXRTZWxlY3Rpb25Nb2RlIiwiYmFzaWNDb250ZXh0X0xSIiwicmVzdWx0IiwiaXNEZWxldGFibGUiLCJpc1VwZGF0YWJsZSIsImFjdGlvbnMiLCJwcmVzcyIsInZpc2libGUiLCJlbmFibGVkIiwidGV4dCIsImVuYWJsZU9uU2VsZWN0IiwicmVxdWlyZXNTZWxlY3Rpb24iLCJiYXNpY0NvbnRleHRfT1AiLCJkYXRhTW9kZWxPYmplY3RQYXRoIiwiZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCIsInRhcmdldE9iamVjdCIsIl90eXBlIiwicGFydG5lciIsInVzZUNvbmRlbnNlZFRhYmxlTGF5b3V0IiwiY29uZGVuc2VkVGFibGVMYXlvdXQiLCJ0YWJsZUNvbmZpZ3VyYXRpb25DTCIsInRhYmxlQ29uZmlndXJhdGlvbkNMT1AiLCJjb250ZW50RGVuc2l0aWVzIiwiY296eSIsImNvbXBhY3QiLCJnZXRUYWJsZUNvbmZpZ3VyYXRpb25Gb3JBbmFseXRpY2FsVGVzdCIsInRhYmxlVHlwZSIsImdldE1hbmlmZXN0Q29udHJvbENvbmZpZ3VyYXRpb24iLCJ1bmRlZmluZWQiLCJpc0Rlc2t0b3AiLCJ0YWJsZUNvbmZpZ3VyYXRpb25BTFAiLCJBbmFseXRpY2FsTGlzdFBhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQkEsTUFBSUEsY0FBSjtBQUNBLE1BQUlDLGtCQUFKO0FBQ0EsTUFBSUMsK0JBQUo7QUFDQSxNQUFJQyxvQkFBSjtBQUNBLE1BQUlDLHFCQUFKO0FBQ0EsTUFBSUMsMkJBQUo7QUFFQUMsRUFBQUEsU0FBUztBQUFBLFFBQWtCO0FBQzFCLFVBQU1DLFlBQVksR0FBR0MsVUFBVSxDQUFDQyxJQUFJLENBQUNDLElBQUwsQ0FBVUMsU0FBVixFQUFxQixtQkFBckIsQ0FBRCxDQUEvQjtBQUQwQiw2QkFFRkMsWUFBWSxDQUFDTCxZQUFELENBRlYsaUJBRXBCTSxTQUZvQjtBQUcxQmIsUUFBQUEsY0FBYyxHQUFHYyxZQUFZLENBQUNELFNBQUQsQ0FBN0I7QUFFQSxZQUFNRSx5QkFBeUIsR0FBR1AsVUFBVSxDQUFDQyxJQUFJLENBQUNDLElBQUwsQ0FBVUMsU0FBVixFQUFxQixtQ0FBckIsQ0FBRCxDQUE1QztBQUwwQiwrQkFNV0MsWUFBWSxDQUFDRyx5QkFBRCxDQU52QixpQkFNcEJDLHNCQU5vQjtBQU8xQlgsVUFBQUEsMkJBQTJCLEdBQUdTLFlBQVksQ0FBQ0Usc0JBQUQsQ0FBMUM7QUFFQSxjQUFNQyw2QkFBNkIsR0FBR1QsVUFBVSxDQUFDQyxJQUFJLENBQUNDLElBQUwsQ0FBVUMsU0FBVixFQUFxQiwrQkFBckIsQ0FB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QUFTLEVBQUU7QUFUYSxPQUF6QjtBQVdBLFVBQU1ILFNBQTZDLEdBQUc7QUFBRTdELFFBQUFBLElBQUksRUFBRTtBQUFSLE9BQXREO0FBQ0EsVUFBTWlFLHFCQUFxQixHQUFHTCxzQ0FBc0MsQ0FDbkVoRixnQkFEbUUsRUFFbkVFLFlBQVksQ0FBQ29GLGtCQUZzRCxFQUduRWhILGNBSG1FLEVBSW5FMkcsU0FKbUUsQ0FBcEU7QUFNQS9ELE1BQUFBLE1BQU0sQ0FBQ21FLHFCQUFxQixDQUFDakUsSUFBdkIsQ0FBTixDQUFtQ0csT0FBbkMsQ0FBMkMsV0FBM0M7QUFDQSxLQXBCQyxDQUFGO0FBcUJBUixJQUFBQSxFQUFFLENBQUMscUhBQUQsRUFBd0gsWUFBTTtBQUMvSCxVQUFNZixnQkFBZ0IsR0FBRztBQUN4QmlCLFFBQUFBLFNBQVMsRUFBRSxZQURhO0FBRXhCSSxRQUFBQSxvQkFBb0IsRUFBRTtBQUNyQixrREFBd0M7QUFDdkNDLFlBQUFBLGFBQWEsRUFBRTtBQUNkb0QsY0FBQUEsb0JBQW9CLEVBQUU7QUFEUjtBQUR3QjtBQURuQixTQUZFO0FBU3hCVSxRQUFBQSxTQUFTLEVBQUU7QUFUYSxPQUF6QjtBQVdBLFVBQU1ILFNBQTZDLEdBQUc7QUFBRTdELFFBQUFBLElBQUksRUFBRTtBQUFSLE9BQXREO0FBQ0EsVUFBTWlFLHFCQUFxQixHQUFHTCxzQ0FBc0MsQ0FDbkVoRixnQkFEbUUsRUFFbkVFLFlBQVksQ0FBQ29GLGtCQUZzRCxFQUduRTlHLCtCQUhtRSxFQUluRXlHLFNBSm1FLENBQXBFO0FBTUEvRCxNQUFBQSxNQUFNLENBQUNtRSxxQkFBcUIsQ0FBQ2pFLElBQXZCLENBQU4sQ0FBbUNHLE9BQW5DLENBQTJDLGlCQUEzQztBQUNBLEtBcEJDLENBQUY7QUFxQkEsR0FuSE8sQ0FBUiIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcblx0Z2V0Q3JlYXRlVmlzaWJsZSxcblx0Z2V0VGFibGVNYW5pZmVzdENvbmZpZ3VyYXRpb24sXG5cdFRhYmxlQ29udHJvbENvbmZpZ3VyYXRpb24sXG5cdGdldFNlbGVjdGlvbk1vZGUsXG5cdFRhYmxlQ2FwYWJpbGl0eVJlc3RyaWN0aW9uXG59IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2NvbnRyb2xzL0NvbW1vbi9UYWJsZVwiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IGNvbnZlcnRUeXBlcyB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL01ldGFNb2RlbENvbnZlcnRlclwiO1xuaW1wb3J0IHsgY29tcGlsZUNEUywgZ2V0Q29udmVydGVyQ29udGV4dCwgZ2V0TWV0YU1vZGVsIH0gZnJvbSBcInNhcC9mZS90ZXN0L0plc3RUZW1wbGF0aW5nSGVscGVyXCI7XG5pbXBvcnQgeyBDb252ZXJ0ZXJDb250ZXh0LCBUZW1wbGF0ZVR5cGUgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy90ZW1wbGF0ZXMvQmFzZUNvbnZlcnRlclwiO1xuaW1wb3J0IHsgQ3JlYXRpb25Nb2RlLCBMaXN0UmVwb3J0TWFuaWZlc3RTZXR0aW5ncywgVGFibGVNYW5pZmVzdFNldHRpbmdzQ29uZmlndXJhdGlvbiB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL01hbmlmZXN0U2V0dGluZ3NcIjtcbmltcG9ydCB7IENvbnZlcnRlck91dHB1dCB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlc1wiO1xuaW1wb3J0IHsgYmluZGluZ0V4cHJlc3Npb24sIGNvbXBpbGVCaW5kaW5nLCBjb25zdGFudCB9IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0JpbmRpbmdFeHByZXNzaW9uXCI7XG5pbXBvcnQgeyBVSSB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvQmluZGluZ0hlbHBlclwiO1xuXG5sZXQgY29udmVydGVkVHlwZXM6IENvbnZlcnRlck91dHB1dDtcbmxldCBjb252ZXJ0ZWRUeXBlc05vT2E6IENvbnZlcnRlck91dHB1dDtcbmxldCBjb252ZXJ0ZWRUeXBlc0FuYWx5dGljYWxTZXJ2aWNlOiBDb252ZXJ0ZXJPdXRwdXQ7XG5sZXQgY29udmVydGVkVHlwZXNPYVRydWU6IENvbnZlcnRlck91dHB1dDtcbmxldCBjb252ZXJ0ZWRUeXBlc09hRmFsc2U6IENvbnZlcnRlck91dHB1dDtcbmxldCBjb252ZXJ0ZWRUeXBlc1NlbGVjdGlvbk1vZGU6IENvbnZlcnRlck91dHB1dDtcblxuYmVmb3JlQWxsKGFzeW5jIGZ1bmN0aW9uKCkge1xuXHRjb25zdCBzTWV0YWRhdGFVcmwgPSBjb21waWxlQ0RTKHBhdGguam9pbihfX2Rpcm5hbWUsIFwiLi4vZGF0YS9UYWJsZS5jZHNcIikpO1xuXHRjb25zdCBtZXRhTW9kZWwgPSBhd2FpdCBnZXRNZXRhTW9kZWwoc01ldGFkYXRhVXJsKTtcblx0Y29udmVydGVkVHlwZXMgPSBjb252ZXJ0VHlwZXMobWV0YU1vZGVsKTtcblxuXHRjb25zdCBzTWV0YWRhdGFVcmxTZWxlY3Rpb25Nb2RlID0gY29tcGlsZUNEUyhwYXRoLmpvaW4oX19kaXJuYW1lLCBcIi4uL2RhdGEvVGFibGVHZXRTZWxlY3Rpb25Nb2RlLmNkc1wiKSk7XG5cdGNvbnN0IG1ldGFNb2RlbFNlbGVjdGlvbk1vZGUgPSBhd2FpdCBnZXRNZXRhTW9kZWwoc01ldGFkYXRhVXJsU2VsZWN0aW9uTW9kZSk7XG5cdGNvbnZlcnRlZFR5cGVzU2VsZWN0aW9uTW9kZSA9IGNvbnZlcnRUeXBlcyhtZXRhTW9kZWxTZWxlY3Rpb25Nb2RlKTtcblxuXHRjb25zdCBzTWV0YWRhdGFVcmxBbmFseXRpY2FsU2VydmljZSA9IGNvbXBpbGVDRFMocGF0aC5qb2luKF9fZGlybmFtZSwgXCIuLi9kYXRhL0FuYWx5dGljYWxTZXJ2aWNlLmNkc1wiKSk7XG5cdGNvbnN0IG1ldGFNb2RlbEFuYWx5dGljYWxTZXJ2aWNlID0gYXdhaXQgZ2V0TWV0YU1vZGVsKHNNZXRhZGF0YVVybEFuYWx5dGljYWxTZXJ2aWNlKTtcblx0Y29udmVydGVkVHlwZXNBbmFseXRpY2FsU2VydmljZSA9IGNvbnZlcnRUeXBlcyhtZXRhTW9kZWxBbmFseXRpY2FsU2VydmljZSk7XG5cblx0Y29uc3Qgc01ldGFkYXRhVXJsTm9PYSA9IGNvbXBpbGVDRFMocGF0aC5qb2luKF9fZGlybmFtZSwgXCIuLi9kYXRhL1RhYmxlTmV3QWN0aW9uTm9PcGVyYXRpb25BdmFpbGFibGUuY2RzXCIpKTtcblx0Y29uc3QgbWV0YU1vZGVsTm9PYSA9IGF3YWl0IGdldE1ldGFNb2RlbChzTWV0YWRhdGFVcmxOb09hKTtcblx0Y29udmVydGVkVHlwZXNOb09hID0gY29udmVydFR5cGVzKG1ldGFNb2RlbE5vT2EpO1xuXG5cdGNvbnN0IHNNZXRhZGF0YVVybE9hVHJ1ZSA9IGNvbXBpbGVDRFMocGF0aC5qb2luKF9fZGlybmFtZSwgXCIuLi9kYXRhL1RhYmxlTmV3QWN0aW9uT3BlcmF0aW9uQXZhaWxhYmxlVHJ1ZS5jZHNcIikpO1xuXHRjb25zdCBtZXRhTW9kZWxPYVRydWUgPSBhd2FpdCBnZXRNZXRhTW9kZWwoc01ldGFkYXRhVXJsT2FUcnVlKTtcblx0Y29udmVydGVkVHlwZXNPYVRydWUgPSBjb252ZXJ0VHlwZXMobWV0YU1vZGVsT2FUcnVlKTtcblxuXHRjb25zdCBzTWV0YWRhdGFVcmxPYUZhbHNlID0gY29tcGlsZUNEUyhwYXRoLmpvaW4oX19kaXJuYW1lLCBcIi4uL2RhdGEvVGFibGVOZXdBY3Rpb25PcGVyYXRpb25BdmFpbGFibGVGYWxzZS5jZHNcIikpO1xuXHRjb25zdCBtZXRhTW9kZWxPYUZhbHNlID0gYXdhaXQgZ2V0TWV0YU1vZGVsKHNNZXRhZGF0YVVybE9hRmFsc2UpO1xuXHRjb252ZXJ0ZWRUeXBlc09hRmFsc2UgPSBjb252ZXJ0VHlwZXMobWV0YU1vZGVsT2FGYWxzZSk7XG59KTtcbmNvbnN0IGdldFRhYmxlQ29uZmlndXJhdGlvbkZvclRlc3QgPSAoXG5cdG1hbmlmZXN0U2V0dGluZ3M6IExpc3RSZXBvcnRNYW5pZmVzdFNldHRpbmdzLFxuXHR0ZW1wbGF0ZVR5cGU6IFRlbXBsYXRlVHlwZSA9IFRlbXBsYXRlVHlwZS5MaXN0UmVwb3J0LFxuXHRpc0NvbmRlbnNlZExheW91dENvbXBsaWFudDogYm9vbGVhbiA9IGZhbHNlLFxuXHR1c2VyQ29udGVudERlbnNpdGllczogc3RyaW5nID0gXCJjb21wYWN0XCIsXG5cdGNvbnZlcnRlck91dHB1dDogQ29udmVydGVyT3V0cHV0ID0gY29udmVydGVkVHlwZXNcbik6IFRhYmxlQ29udHJvbENvbmZpZ3VyYXRpb24gPT4ge1xuXHRjb25zdCBiYXNpY0NvbnRleHQgPSBnZXRDb252ZXJ0ZXJDb250ZXh0KGNvbnZlcnRlck91dHB1dCwgbWFuaWZlc3RTZXR0aW5ncywgdGVtcGxhdGVUeXBlLCB1c2VyQ29udGVudERlbnNpdGllcyk7XG5cdHJldHVybiBnZXRUYWJsZU1hbmlmZXN0Q29uZmlndXJhdGlvbihcblx0XHRiYXNpY0NvbnRleHQuZ2V0RW50aXR5VHlwZSgpLmFubm90YXRpb25zLlVJPy5MaW5lSXRlbSxcblx0XHRcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5MaW5lSXRlbVwiLFxuXHRcdGJhc2ljQ29udGV4dCxcblx0XHRpc0NvbmRlbnNlZExheW91dENvbXBsaWFudFxuXHQpO1xufTtcbmRlc2NyaWJlKFwiVGFibGUgQ29udmVydGVyIC0gI2dldFRhYmxlTWFuaWZlc3RDb25maWd1cmF0aW9uIFwiLCBmdW5jdGlvbigpIHtcblx0aXQoXCJ3b3JrcyB3aXRoIGJhc2ljIGNvbmZpZ3VyYXRpb25cIiwgKCkgPT4ge1xuXHRcdGNvbnN0IHRhYmxlQ29uZmlndXJhdGlvbiA9IGdldFRhYmxlQ29uZmlndXJhdGlvbkZvclRlc3Qoe1xuXHRcdFx0ZW50aXR5U2V0OiBcIlRlc3RFbnRpdHlcIlxuXHRcdH0pO1xuXHRcdGV4cGVjdCh0YWJsZUNvbmZpZ3VyYXRpb24pLnRvTWF0Y2hTbmFwc2hvdCgpO1xuXHRcdGV4cGVjdCh0YWJsZUNvbmZpZ3VyYXRpb24udHlwZSA9PT0gXCJSZXNwb25zaXZlVGFibGVcIik7XG5cdH0pO1xuXG5cdGl0KFwiSW5mbHVlbmNlIHRoZSB0YWJsZSB0eXBlXCIsICgpID0+IHtcblx0XHRjb25zdCB0YWJsZUNvbmZpZ3VyYXRpb24gPSBnZXRUYWJsZUNvbmZpZ3VyYXRpb25Gb3JUZXN0KHtcblx0XHRcdGVudGl0eVNldDogXCJUZXN0RW50aXR5XCIsXG5cdFx0XHRjb250cm9sQ29uZmlndXJhdGlvbjoge1xuXHRcdFx0XHRcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5MaW5lSXRlbVwiOiB7XG5cdFx0XHRcdFx0dGFibGVTZXR0aW5nczoge1xuXHRcdFx0XHRcdFx0dHlwZTogXCJHcmlkVGFibGVcIlxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdGV4cGVjdCh0YWJsZUNvbmZpZ3VyYXRpb24udHlwZSkudG9FcXVhbChcIkdyaWRUYWJsZVwiKTtcblx0fSk7XG5cblx0aXQoXCJFeHBvcnQgT3B0aW9uIERlZmF1bHRcIiwgKCkgPT4ge1xuXHRcdC8vIElmIGRlZmluZWQsIHRoZW4gdGhlIHZhbHVlIHNob3VsZCBiZSBlcXVhbCB0byB0aGUgcHJvdmlkZWQgc2V0dGluZ1xuXHRcdGNvbnN0IG1hbmlmZXN0U2V0dGluZ3MgPSB7XG5cdFx0XHRlbnRpdHlTZXQ6IFwiVGVzdEVudGl0eVwiXG5cdFx0fTtcblx0XHRjb25zdCB0YWJsZUNvbmZpZ3VyYXRpb24gPSBnZXRUYWJsZUNvbmZpZ3VyYXRpb25Gb3JUZXN0KG1hbmlmZXN0U2V0dGluZ3MpO1xuXHRcdGV4cGVjdCh0YWJsZUNvbmZpZ3VyYXRpb24uZW5hYmxlRXhwb3J0KS50b0JlKHRydWUpO1xuXHRcdGNvbnN0IHRhYmxlQ29uZmlndXJhdGlvbk9QID0gZ2V0VGFibGVDb25maWd1cmF0aW9uRm9yVGVzdChtYW5pZmVzdFNldHRpbmdzLCBUZW1wbGF0ZVR5cGUuT2JqZWN0UGFnZSk7XG5cdFx0ZXhwZWN0KHRhYmxlQ29uZmlndXJhdGlvbk9QLmVuYWJsZUV4cG9ydCkudG9CZSh0cnVlKTtcblx0fSk7XG5cblx0aXQoXCJJbmZsdWVuY2UgdGhlIEV4cG9ydCBPcHRpb25cIiwgKCkgPT4ge1xuXHRcdC8vIElmIGRlZmluZWQsIHRoZW4gdGhlIHZhbHVlIHNob3VsZCBiZSBlcXVhbCB0byB0aGUgcHJvdmlkZWQgc2V0dGluZ1xuXHRcdGNvbnN0IG1hbmlmZXN0U2V0dGluZ3MgPSB7XG5cdFx0XHRlbnRpdHlTZXQ6IFwiVGVzdEVudGl0eVwiLFxuXHRcdFx0Y29udHJvbENvbmZpZ3VyYXRpb246IHtcblx0XHRcdFx0XCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuTGluZUl0ZW1cIjoge1xuXHRcdFx0XHRcdHRhYmxlU2V0dGluZ3M6IHtcblx0XHRcdFx0XHRcdGVuYWJsZUV4cG9ydDogdHJ1ZVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cdFx0Y29uc3QgdGFibGVDb25maWd1cmF0aW9uID0gZ2V0VGFibGVDb25maWd1cmF0aW9uRm9yVGVzdChtYW5pZmVzdFNldHRpbmdzKTtcblx0XHRleHBlY3QodGFibGVDb25maWd1cmF0aW9uLmVuYWJsZUV4cG9ydCkudG9CZSh0cnVlKTtcblx0XHRjb25zdCB0YWJsZUNvbmZpZ3VyYXRpb25PUCA9IGdldFRhYmxlQ29uZmlndXJhdGlvbkZvclRlc3QobWFuaWZlc3RTZXR0aW5ncywgVGVtcGxhdGVUeXBlLk9iamVjdFBhZ2UpO1xuXHRcdGV4cGVjdCh0YWJsZUNvbmZpZ3VyYXRpb25PUC5lbmFibGVFeHBvcnQpLnRvQmUodHJ1ZSk7XG5cblx0XHRjb25zdCBub1Bhc3RlTWFuaWZlc3RTZXR0aW5ncyA9IHtcblx0XHRcdGVudGl0eVNldDogXCJUZXN0RW50aXR5XCIsXG5cdFx0XHRjb250cm9sQ29uZmlndXJhdGlvbjoge1xuXHRcdFx0XHRcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5MaW5lSXRlbVwiOiB7XG5cdFx0XHRcdFx0dGFibGVTZXR0aW5nczoge1xuXHRcdFx0XHRcdFx0ZW5hYmxlUGFzdGU6IGZhbHNlXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRjb25zdCB0YWJsZUNvbmZpZ3VyYXRpb25Ob1Bhc3RlID0gZ2V0VGFibGVDb25maWd1cmF0aW9uRm9yVGVzdChub1Bhc3RlTWFuaWZlc3RTZXR0aW5ncyk7XG5cdFx0ZXhwZWN0KHRhYmxlQ29uZmlndXJhdGlvbk5vUGFzdGUuZW5hYmxlRXhwb3J0KS50b0JlKHRydWUpO1xuXHRcdGNvbnN0IHRhYmxlQ29uZmlndXJhdGlvbk5vUGFzdGVPUCA9IGdldFRhYmxlQ29uZmlndXJhdGlvbkZvclRlc3Qobm9QYXN0ZU1hbmlmZXN0U2V0dGluZ3MsIFRlbXBsYXRlVHlwZS5PYmplY3RQYWdlKTtcblx0XHRleHBlY3QodGFibGVDb25maWd1cmF0aW9uTm9QYXN0ZU9QLmVuYWJsZUV4cG9ydCkudG9CZShmYWxzZSk7XG5cdH0pO1xufSk7XG5cbmRlc2NyaWJlKFwiVGFibGUgQ29udmVydGVyIC0gI2dldENyZWF0ZVZpc2libGUgXCIsIGZ1bmN0aW9uKCkge1xuXHRjb25zdCBJU19JTlNFUlRBQkxFX0ZBTFNFID0gY29uc3RhbnQoZmFsc2UpO1xuXHRjb25zdCBJU19JTlNFUlRBQkxFX1RSVUUgPSBjb25zdGFudCh0cnVlKTtcblx0Y29uc3QgSVNfSU5TRVJUQUJMRV9EWU5BTUlDID0gYmluZGluZ0V4cHJlc3Npb24oXCJTb21lRHluYW1pY0V4cHJlc3Npb25cIik7XG5cdGxldCBCQVNJQ19DT05URVhUX0xSOiBDb252ZXJ0ZXJDb250ZXh0O1xuXHRsZXQgQkFTSUNfQ09OVEVYVF9PUDogQ29udmVydGVyQ29udGV4dDtcblx0bGV0IEhJRERFTl9DT05URVhUX0xSOiBDb252ZXJ0ZXJDb250ZXh0O1xuXHRsZXQgSElEREVOX0NPTlRFWFRfT1A6IENvbnZlcnRlckNvbnRleHQ7XG5cdGxldCBEWU5BTUlDX0hJRERFTl9DT05URVhUX0xSOiBDb252ZXJ0ZXJDb250ZXh0O1xuXHRsZXQgRFlOQU1JQ19ISURERU5fQ09OVEVYVF9PUDogQ29udmVydGVyQ29udGV4dDtcblx0bGV0IE5FV19BQ1RJT05fTk9fT0E6IENvbnZlcnRlckNvbnRleHQ7XG5cdGxldCBORVdfQUNUSU9OX09BX1RSVUU6IENvbnZlcnRlckNvbnRleHQ7XG5cdGxldCBORVdfQUNUSU9OX09BX0ZBTFNFOiBDb252ZXJ0ZXJDb250ZXh0O1xuXG5cdGJlZm9yZUFsbChmdW5jdGlvbigpIHtcblx0XHRCQVNJQ19DT05URVhUX0xSID0gZ2V0Q29udmVydGVyQ29udGV4dChjb252ZXJ0ZWRUeXBlcywgeyBlbnRpdHlTZXQ6IFwiVGVzdEVudGl0eVwiIH0sIFRlbXBsYXRlVHlwZS5MaXN0UmVwb3J0KTtcblx0XHRCQVNJQ19DT05URVhUX09QID0gZ2V0Q29udmVydGVyQ29udGV4dChjb252ZXJ0ZWRUeXBlcywgeyBlbnRpdHlTZXQ6IFwiVGVzdEVudGl0eVwiIH0sIFRlbXBsYXRlVHlwZS5PYmplY3RQYWdlKTtcblx0XHRISURERU5fQ09OVEVYVF9MUiA9IGdldENvbnZlcnRlckNvbnRleHQoY29udmVydGVkVHlwZXMsIHsgZW50aXR5U2V0OiBcIkNyZWF0ZUhpZGRlbkVudGl0eVwiIH0sIFRlbXBsYXRlVHlwZS5MaXN0UmVwb3J0KTtcblx0XHRISURERU5fQ09OVEVYVF9PUCA9IGdldENvbnZlcnRlckNvbnRleHQoY29udmVydGVkVHlwZXMsIHsgZW50aXR5U2V0OiBcIkNyZWF0ZUhpZGRlbkVudGl0eVwiIH0sIFRlbXBsYXRlVHlwZS5PYmplY3RQYWdlKTtcblx0XHREWU5BTUlDX0hJRERFTl9DT05URVhUX0xSID0gZ2V0Q29udmVydGVyQ29udGV4dChcblx0XHRcdGNvbnZlcnRlZFR5cGVzLFxuXHRcdFx0eyBlbnRpdHlTZXQ6IFwiQ3JlYXRlSGlkZGVuRHluYW1pY0VudGl0eVwiIH0sXG5cdFx0XHRUZW1wbGF0ZVR5cGUuTGlzdFJlcG9ydFxuXHRcdCk7XG5cdFx0RFlOQU1JQ19ISURERU5fQ09OVEVYVF9PUCA9IGdldENvbnZlcnRlckNvbnRleHQoXG5cdFx0XHRjb252ZXJ0ZWRUeXBlcyxcblx0XHRcdHsgZW50aXR5U2V0OiBcIkNyZWF0ZUhpZGRlbkR5bmFtaWNFbnRpdHlcIiB9LFxuXHRcdFx0VGVtcGxhdGVUeXBlLk9iamVjdFBhZ2Vcblx0XHQpO1xuXHRcdE5FV19BQ1RJT05fTk9fT0EgPSBnZXRDb252ZXJ0ZXJDb250ZXh0KGNvbnZlcnRlZFR5cGVzTm9PYSwgeyBlbnRpdHlTZXQ6IFwiVGVzdEVudGl0eVwiIH0sIFRlbXBsYXRlVHlwZS5MaXN0UmVwb3J0KTtcblx0XHRORVdfQUNUSU9OX09BX1RSVUUgPSBnZXRDb252ZXJ0ZXJDb250ZXh0KGNvbnZlcnRlZFR5cGVzT2FUcnVlLCB7IGVudGl0eVNldDogXCJUZXN0RW50aXR5XCIgfSwgVGVtcGxhdGVUeXBlLkxpc3RSZXBvcnQpO1xuXHRcdE5FV19BQ1RJT05fT0FfRkFMU0UgPSBnZXRDb252ZXJ0ZXJDb250ZXh0KGNvbnZlcnRlZFR5cGVzT2FGYWxzZSwgeyBlbnRpdHlTZXQ6IFwiVGVzdEVudGl0eVwiIH0sIFRlbXBsYXRlVHlwZS5MaXN0UmVwb3J0KTtcblx0fSk7XG5cblx0aXQoXCJJZiBpdCdzIHN0YXRpY2FsbHkgbm90IGluc2VydGFibGUgLT4gY3JlYXRlIGlzIG5vdCB2aXNpYmxlXCIsICgpID0+IHtcblx0XHRleHBlY3QoY29tcGlsZUJpbmRpbmcoZ2V0Q3JlYXRlVmlzaWJsZShCQVNJQ19DT05URVhUX0xSLCBDcmVhdGlvbk1vZGUuQ3JlYXRpb25Sb3csIElTX0lOU0VSVEFCTEVfRkFMU0UpKSkudG9FcXVhbChcImZhbHNlXCIpO1xuXHRcdGV4cGVjdChjb21waWxlQmluZGluZyhnZXRDcmVhdGVWaXNpYmxlKEJBU0lDX0NPTlRFWFRfTFIsIFwiRXh0ZXJuYWxcIiwgSVNfSU5TRVJUQUJMRV9GQUxTRSkpKS50b0VxdWFsKFwiZmFsc2VcIik7XG5cdFx0ZXhwZWN0KGNvbXBpbGVCaW5kaW5nKGdldENyZWF0ZVZpc2libGUoQkFTSUNfQ09OVEVYVF9PUCwgQ3JlYXRpb25Nb2RlLkNyZWF0aW9uUm93LCBJU19JTlNFUlRBQkxFX0ZBTFNFKSkpLnRvRXF1YWwoXCJmYWxzZVwiKTtcblx0XHRleHBlY3QoY29tcGlsZUJpbmRpbmcoZ2V0Q3JlYXRlVmlzaWJsZShCQVNJQ19DT05URVhUX09QLCBcIkV4dGVybmFsXCIsIElTX0lOU0VSVEFCTEVfRkFMU0UpKSkudG9FcXVhbChcImZhbHNlXCIpO1xuXHR9KTtcblxuXHRpdChcIklmIGNyZWF0ZSBpcyBzdGF0aWNhbGx5IGhpZGRlbiAtPiBjcmVhdGUgaXMgbm90IHZpc2libGVcIiwgKCkgPT4ge1xuXHRcdGV4cGVjdChjb21waWxlQmluZGluZyhnZXRDcmVhdGVWaXNpYmxlKEhJRERFTl9DT05URVhUX0xSLCBDcmVhdGlvbk1vZGUuQ3JlYXRpb25Sb3csIElTX0lOU0VSVEFCTEVfVFJVRSkpKS50b0VxdWFsKFwiZmFsc2VcIik7XG5cdFx0ZXhwZWN0KGNvbXBpbGVCaW5kaW5nKGdldENyZWF0ZVZpc2libGUoSElEREVOX0NPTlRFWFRfTFIsIFwiRXh0ZXJuYWxcIiwgSVNfSU5TRVJUQUJMRV9UUlVFKSkpLnRvRXF1YWwoXCJmYWxzZVwiKTtcblx0XHRleHBlY3QoY29tcGlsZUJpbmRpbmcoZ2V0Q3JlYXRlVmlzaWJsZShISURERU5fQ09OVEVYVF9PUCwgQ3JlYXRpb25Nb2RlLkNyZWF0aW9uUm93LCBJU19JTlNFUlRBQkxFX1RSVUUpKSkudG9FcXVhbChcImZhbHNlXCIpO1xuXHRcdGV4cGVjdChjb21waWxlQmluZGluZyhnZXRDcmVhdGVWaXNpYmxlKEhJRERFTl9DT05URVhUX09QLCBcIkV4dGVybmFsXCIsIElTX0lOU0VSVEFCTEVfVFJVRSkpKS50b0VxdWFsKFwiZmFsc2VcIik7XG5cdH0pO1xuXG5cdGl0KFwiT3RoZXJ3aXNlIGlmIHRoZSBjcmVhdGUgbW9kZSBpcyBleHRlcm5hbCAtPiBjcmVhdGUgaXMgdmlzaWJsZVwiLCAoKSA9PiB7XG5cdFx0ZXhwZWN0KGNvbXBpbGVCaW5kaW5nKGdldENyZWF0ZVZpc2libGUoQkFTSUNfQ09OVEVYVF9MUiwgXCJFeHRlcm5hbFwiLCBJU19JTlNFUlRBQkxFX1RSVUUpKSkudG9FcXVhbChcInRydWVcIik7XG5cdFx0ZXhwZWN0KGNvbXBpbGVCaW5kaW5nKGdldENyZWF0ZVZpc2libGUoQkFTSUNfQ09OVEVYVF9PUCwgXCJFeHRlcm5hbFwiLCBJU19JTlNFUlRBQkxFX1RSVUUpKSkudG9FcXVhbChcInRydWVcIik7XG5cdFx0ZXhwZWN0KGNvbXBpbGVCaW5kaW5nKGdldENyZWF0ZVZpc2libGUoQkFTSUNfQ09OVEVYVF9MUiwgXCJFeHRlcm5hbFwiLCBJU19JTlNFUlRBQkxFX0RZTkFNSUMpKSkudG9FcXVhbChcInRydWVcIik7XG5cdFx0ZXhwZWN0KGNvbXBpbGVCaW5kaW5nKGdldENyZWF0ZVZpc2libGUoQkFTSUNfQ09OVEVYVF9PUCwgXCJFeHRlcm5hbFwiLCBJU19JTlNFUlRBQkxFX0RZTkFNSUMpKSkudG9FcXVhbChcInRydWVcIik7XG5cdFx0ZXhwZWN0KGNvbXBpbGVCaW5kaW5nKGdldENyZWF0ZVZpc2libGUoRFlOQU1JQ19ISURERU5fQ09OVEVYVF9MUiwgXCJFeHRlcm5hbFwiLCBJU19JTlNFUlRBQkxFX1RSVUUpKSkudG9FcXVhbChcInRydWVcIik7XG5cdFx0ZXhwZWN0KGNvbXBpbGVCaW5kaW5nKGdldENyZWF0ZVZpc2libGUoRFlOQU1JQ19ISURERU5fQ09OVEVYVF9PUCwgXCJFeHRlcm5hbFwiLCBJU19JTlNFUlRBQkxFX1RSVUUpKSkudG9FcXVhbChcInRydWVcIik7XG5cdFx0ZXhwZWN0KGNvbXBpbGVCaW5kaW5nKGdldENyZWF0ZVZpc2libGUoRFlOQU1JQ19ISURERU5fQ09OVEVYVF9MUiwgXCJFeHRlcm5hbFwiLCBJU19JTlNFUlRBQkxFX0RZTkFNSUMpKSkudG9FcXVhbChcInRydWVcIik7XG5cdFx0ZXhwZWN0KGNvbXBpbGVCaW5kaW5nKGdldENyZWF0ZVZpc2libGUoRFlOQU1JQ19ISURERU5fQ09OVEVYVF9PUCwgXCJFeHRlcm5hbFwiLCBJU19JTlNFUlRBQkxFX0RZTkFNSUMpKSkudG9FcXVhbChcInRydWVcIik7XG5cdH0pO1xuXG5cdGl0KFwiSWYgd2UncmUgb24gdGhlIGxpc3QgcmVwb3J0IC0+IGNyZWF0ZSBpcyB2aXNpYmxlXCIsICgpID0+IHtcblx0XHRleHBlY3QoY29tcGlsZUJpbmRpbmcoZ2V0Q3JlYXRlVmlzaWJsZShCQVNJQ19DT05URVhUX0xSLCBDcmVhdGlvbk1vZGUuQ3JlYXRpb25Sb3csIElTX0lOU0VSVEFCTEVfVFJVRSkpKS50b0VxdWFsKFwidHJ1ZVwiKTtcblx0XHRleHBlY3QoY29tcGlsZUJpbmRpbmcoZ2V0Q3JlYXRlVmlzaWJsZShEWU5BTUlDX0hJRERFTl9DT05URVhUX0xSLCBDcmVhdGlvbk1vZGUuQ3JlYXRpb25Sb3csIElTX0lOU0VSVEFCTEVfVFJVRSkpKS50b0VxdWFsKFwidHJ1ZVwiKTtcblx0XHRleHBlY3QoY29tcGlsZUJpbmRpbmcoZ2V0Q3JlYXRlVmlzaWJsZShCQVNJQ19DT05URVhUX0xSLCBDcmVhdGlvbk1vZGUuQ3JlYXRpb25Sb3csIElTX0lOU0VSVEFCTEVfRFlOQU1JQykpKS50b0VxdWFsKFwidHJ1ZVwiKTtcblx0XHRleHBlY3QoY29tcGlsZUJpbmRpbmcoZ2V0Q3JlYXRlVmlzaWJsZShEWU5BTUlDX0hJRERFTl9DT05URVhUX0xSLCBDcmVhdGlvbk1vZGUuQ3JlYXRpb25Sb3csIElTX0lOU0VSVEFCTEVfRFlOQU1JQykpKS50b0VxdWFsKFxuXHRcdFx0XCJ0cnVlXCJcblx0XHQpO1xuXHR9KTtcblxuXHRpdChcIk90aGVyd2lzZSB0aGlzIGRlcGVuZHMgb24gdGhlIHZhbHVlIG9mIHRoZSB0aGUgVUkuSXNFZGl0YWJsZVwiLCAoKSA9PiB7XG5cdFx0ZXhwZWN0KGdldENyZWF0ZVZpc2libGUoQkFTSUNfQ09OVEVYVF9PUCwgQ3JlYXRpb25Nb2RlLkNyZWF0aW9uUm93LCBJU19JTlNFUlRBQkxFX1RSVUUpKS50b0VxdWFsKFVJLklzRWRpdGFibGUpO1xuXHRcdGV4cGVjdChnZXRDcmVhdGVWaXNpYmxlKEJBU0lDX0NPTlRFWFRfT1AsIENyZWF0aW9uTW9kZS5DcmVhdGlvblJvdywgSVNfSU5TRVJUQUJMRV9EWU5BTUlDKSkudG9FcXVhbChVSS5Jc0VkaXRhYmxlKTtcblx0XHRleHBlY3QoY29tcGlsZUJpbmRpbmcoZ2V0Q3JlYXRlVmlzaWJsZShEWU5BTUlDX0hJRERFTl9DT05URVhUX09QLCBDcmVhdGlvbk1vZGUuQ3JlYXRpb25Sb3csIElTX0lOU0VSVEFCTEVfVFJVRSkpKS50b0VxdWFsKFxuXHRcdFx0XCJ7PSAoISV7aGlkZGVuQ3JlYXRlfSAmJiAle3VpPi9pc0VkaXRhYmxlfSl9XCJcblx0XHQpO1xuXHRcdGV4cGVjdChjb21waWxlQmluZGluZyhnZXRDcmVhdGVWaXNpYmxlKERZTkFNSUNfSElEREVOX0NPTlRFWFRfT1AsIENyZWF0aW9uTW9kZS5DcmVhdGlvblJvdywgSVNfSU5TRVJUQUJMRV9EWU5BTUlDKSkpLnRvRXF1YWwoXG5cdFx0XHRcIns9ICghJXtoaWRkZW5DcmVhdGV9ICYmICV7dWk+L2lzRWRpdGFibGV9KX1cIlxuXHRcdCk7XG5cdH0pO1xuXG5cdGl0KFwiSWYgYSBOZXcgQWN0aW9uIGV4aXN0cyBjcmVhdGUgZGVwZW5kcyBvbiB0aGUgQ29yZS5PcGVyYXRpb25BdmFpbGFibGUgYW5ub3RhdGlvblwiLCAoKSA9PiB7XG5cdFx0ZXhwZWN0KGNvbXBpbGVCaW5kaW5nKGdldENyZWF0ZVZpc2libGUoTkVXX0FDVElPTl9OT19PQSwgQ3JlYXRpb25Nb2RlLkNyZWF0aW9uUm93LCBJU19JTlNFUlRBQkxFX1RSVUUpKSkudG9FcXVhbChcInRydWVcIik7XG5cdFx0ZXhwZWN0KGNvbXBpbGVCaW5kaW5nKGdldENyZWF0ZVZpc2libGUoTkVXX0FDVElPTl9OT19PQSwgQ3JlYXRpb25Nb2RlLkNyZWF0aW9uUm93LCBJU19JTlNFUlRBQkxFX0ZBTFNFKSkpLnRvRXF1YWwoXCJ0cnVlXCIpO1xuXG5cdFx0ZXhwZWN0KGNvbXBpbGVCaW5kaW5nKGdldENyZWF0ZVZpc2libGUoTkVXX0FDVElPTl9PQV9UUlVFLCBDcmVhdGlvbk1vZGUuQ3JlYXRpb25Sb3csIElTX0lOU0VSVEFCTEVfVFJVRSkpKS50b0VxdWFsKFwidHJ1ZVwiKTtcblx0XHRleHBlY3QoY29tcGlsZUJpbmRpbmcoZ2V0Q3JlYXRlVmlzaWJsZShORVdfQUNUSU9OX09BX1RSVUUsIENyZWF0aW9uTW9kZS5DcmVhdGlvblJvdywgSVNfSU5TRVJUQUJMRV9GQUxTRSkpKS50b0VxdWFsKFwidHJ1ZVwiKTtcblxuXHRcdGV4cGVjdChjb21waWxlQmluZGluZyhnZXRDcmVhdGVWaXNpYmxlKE5FV19BQ1RJT05fT0FfRkFMU0UsIENyZWF0aW9uTW9kZS5DcmVhdGlvblJvdywgSVNfSU5TRVJUQUJMRV9UUlVFKSkpLnRvRXF1YWwoXCJmYWxzZVwiKTtcblx0XHRleHBlY3QoY29tcGlsZUJpbmRpbmcoZ2V0Q3JlYXRlVmlzaWJsZShORVdfQUNUSU9OX09BX0ZBTFNFLCBDcmVhdGlvbk1vZGUuQ3JlYXRpb25Sb3csIElTX0lOU0VSVEFCTEVfRkFMU0UpKSkudG9FcXVhbChcImZhbHNlXCIpO1xuXHR9KTtcbn0pO1xuXG5kZXNjcmliZShcIlRhYmxlIENvbnZlcnRlciAtICNnZXRTZWxlY3Rpb25Nb2RlIFwiLCBmdW5jdGlvbigpIHtcblx0Y29uc3QgZ2V0U2VsZWN0aW9uTW9kZUZvclRlc3QgPSAoXG5cdFx0aXNFbnRpdHlTZXQ6IGJvb2xlYW4sXG5cdFx0dGFyZ2V0Q2FwYWJpbGl0aWVzOiBUYWJsZUNhcGFiaWxpdHlSZXN0cmljdGlvbixcblx0XHRiYXNpY0NvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdFx0dmlzdWFsaXphdGlvblBhdGg6IHN0cmluZ1xuXHQpOiBzdHJpbmcgfCB1bmRlZmluZWQgPT4ge1xuXHRcdHJldHVybiBnZXRTZWxlY3Rpb25Nb2RlKFxuXHRcdFx0YmFzaWNDb250ZXh0LmdldEVudGl0eVR5cGUoKS5hbm5vdGF0aW9ucy5VST8uTGluZUl0ZW0sXG5cdFx0XHR2aXN1YWxpemF0aW9uUGF0aCxcblx0XHRcdGJhc2ljQ29udGV4dCxcblx0XHRcdGlzRW50aXR5U2V0LFxuXHRcdFx0dGFyZ2V0Q2FwYWJpbGl0aWVzXG5cdFx0KTtcblx0fTtcblxuXHRpdChcIklmIHRoZSBMUiBpcyBub3QgZGVsZXRhYmxlIGFuZCBpdHMgdGFibGUgaGFzIG5vdCBhY3Rpb24gOiB0aGUgdGFibGVTZWxlY3Rpb25Nb2RlIGlzICdOb25lJyBcIiwgKCkgPT4ge1xuXHRcdGNvbnN0IGJhc2ljQ29udGV4dF9MUiA9IGdldENvbnZlcnRlckNvbnRleHQoXG5cdFx0XHRjb252ZXJ0ZWRUeXBlc1NlbGVjdGlvbk1vZGUsXG5cdFx0XHR7IGVudGl0eVNldDogXCJFbnRpdHlXaXRob3V0QWN0aW9uT25UYWJsZVwiIH0sXG5cdFx0XHRUZW1wbGF0ZVR5cGUuTGlzdFJlcG9ydFxuXHRcdCk7XG5cdFx0Y29uc3QgcmVzdWx0ID0gZ2V0U2VsZWN0aW9uTW9kZUZvclRlc3QoXG5cdFx0XHR0cnVlLFxuXHRcdFx0eyBpc0RlbGV0YWJsZTogZmFsc2UsIGlzVXBkYXRhYmxlOiBmYWxzZSB9LFxuXHRcdFx0YmFzaWNDb250ZXh0X0xSLFxuXHRcdFx0XCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuTGluZUl0ZW1cIlxuXHRcdCk7XG5cdFx0ZXhwZWN0KHJlc3VsdCkudG9FcXVhbChcIk5vbmVcIik7XG5cdH0pO1xuXHRpdChcIklmIHRoZSBMUiBpcyBkZWxldGFibGUgYW5kIGl0cyB0YWJsZSBoYXMgbm90IGFjdGlvbiA6IHRoZSB0YWJsZVNlbGVjdGlvbk1vZGUgaXMgJ011bHRpJyBcIiwgKCkgPT4ge1xuXHRcdGNvbnN0IGJhc2ljQ29udGV4dF9MUiA9IGdldENvbnZlcnRlckNvbnRleHQoXG5cdFx0XHRjb252ZXJ0ZWRUeXBlc1NlbGVjdGlvbk1vZGUsXG5cdFx0XHR7IGVudGl0eVNldDogXCJFbnRpdHlXaXRob3V0QWN0aW9uT25UYWJsZVwiIH0sXG5cdFx0XHRUZW1wbGF0ZVR5cGUuTGlzdFJlcG9ydFxuXHRcdCk7XG5cdFx0Y29uc3QgcmVzdWx0ID0gZ2V0U2VsZWN0aW9uTW9kZUZvclRlc3QoXG5cdFx0XHR0cnVlLFxuXHRcdFx0eyBpc0RlbGV0YWJsZTogdHJ1ZSwgaXNVcGRhdGFibGU6IGZhbHNlIH0sXG5cdFx0XHRiYXNpY0NvbnRleHRfTFIsXG5cdFx0XHRcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5MaW5lSXRlbVwiXG5cdFx0KTtcblx0XHRleHBlY3QocmVzdWx0KS50b0VxdWFsKFwiTXVsdGlcIik7XG5cdH0pO1xuXHRpdChcIklmIHRoZSBMUiBpcyBub3QgZGVsZXRhYmxlIGFuZCBpdHMgdGFibGUgaGFzIGF0IGxlYXN0IDEgYm91bmQgYWN0aW9uIDogdGhlIHRhYmxlU2VsZWN0aW9uTW9kZSBpcyAnTXVsdGknIFwiLCAoKSA9PiB7XG5cdFx0Y29uc3QgYmFzaWNDb250ZXh0X0xSID0gZ2V0Q29udmVydGVyQ29udGV4dChcblx0XHRcdGNvbnZlcnRlZFR5cGVzU2VsZWN0aW9uTW9kZSxcblx0XHRcdHsgZW50aXR5U2V0OiBcIkVudGl0eVdpdGhCb3VuZEFjdGlvbk9uVGFibGVcIiB9LFxuXHRcdFx0VGVtcGxhdGVUeXBlLkxpc3RSZXBvcnRcblx0XHQpO1xuXHRcdGNvbnN0IHJlc3VsdCA9IGdldFNlbGVjdGlvbk1vZGVGb3JUZXN0KFxuXHRcdFx0dHJ1ZSxcblx0XHRcdHsgaXNEZWxldGFibGU6IGZhbHNlLCBpc1VwZGF0YWJsZTogZmFsc2UgfSxcblx0XHRcdGJhc2ljQ29udGV4dF9MUixcblx0XHRcdFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkxpbmVJdGVtXCJcblx0XHQpO1xuXHRcdGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoXCJNdWx0aVwiKTtcblx0fSk7XG5cdGl0KFwiSWYgdGhlIExSIGlzIG5vdCBkZWxldGFibGUgYW5kIGl0cyB0YWJsZSBoYXMgb25seSB1bmJvdW5kIGFjdGlvbnMgOiB0aGUgdGFibGVTZWxlY3Rpb25Nb2RlIGlzICdOb25lJyBcIiwgKCkgPT4ge1xuXHRcdGNvbnN0IGJhc2ljQ29udGV4dF9MUiA9IGdldENvbnZlcnRlckNvbnRleHQoXG5cdFx0XHRjb252ZXJ0ZWRUeXBlc1NlbGVjdGlvbk1vZGUsXG5cdFx0XHR7IGVudGl0eVNldDogXCJFbnRpdHlXaXRoVW5Cb3VuZEFjdGlvbk9uVGFibGVcIiB9LFxuXHRcdFx0VGVtcGxhdGVUeXBlLkxpc3RSZXBvcnRcblx0XHQpO1xuXHRcdGNvbnN0IHJlc3VsdCA9IGdldFNlbGVjdGlvbk1vZGVGb3JUZXN0KFxuXHRcdFx0dHJ1ZSxcblx0XHRcdHsgaXNEZWxldGFibGU6IGZhbHNlLCBpc1VwZGF0YWJsZTogZmFsc2UgfSxcblx0XHRcdGJhc2ljQ29udGV4dF9MUixcblx0XHRcdFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkxpbmVJdGVtXCJcblx0XHQpO1xuXHRcdGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoXCJOb25lXCIpO1xuXHR9KTtcblx0aXQoXCJJZiB0aGUgTFIgaXMgbm90IGRlbGV0YWJsZSBhbmQgaXRzIHRhYmxlIGhhcyAxIGJvdW5kIGFjdGlvbiB3aXRob3V0IGhpZGRlbiBhbm5vdGF0aW9uIDogdGhlIHRhYmxlU2VsZWN0aW9uTW9kZSBpcyAnTXVsdGknIFwiLCAoKSA9PiB7XG5cdFx0Y29uc3QgYmFzaWNDb250ZXh0X0xSID0gZ2V0Q29udmVydGVyQ29udGV4dChcblx0XHRcdGNvbnZlcnRlZFR5cGVzU2VsZWN0aW9uTW9kZSxcblx0XHRcdHsgZW50aXR5U2V0OiBcIkVudGl0eVdpdGhCb3VuZEFjdGlvbk9uVGFibGVcIiB9LFxuXHRcdFx0VGVtcGxhdGVUeXBlLkxpc3RSZXBvcnRcblx0XHQpO1xuXHRcdGNvbnN0IHJlc3VsdCA9IGdldFNlbGVjdGlvbk1vZGVGb3JUZXN0KFxuXHRcdFx0dHJ1ZSxcblx0XHRcdHsgaXNEZWxldGFibGU6IGZhbHNlLCBpc1VwZGF0YWJsZTogZmFsc2UgfSxcblx0XHRcdGJhc2ljQ29udGV4dF9MUixcblx0XHRcdFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkxpbmVJdGVtXCJcblx0XHQpO1xuXHRcdGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoXCJNdWx0aVwiKTtcblx0fSk7XG5cdGl0KFwiSWYgdGhlIExSIGlzIG5vdCBkZWxldGFibGUgYW5kIGl0cyB0YWJsZSBoYXMgMSBEYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb24gc3RhdGljYWxseSBub3QgaGlkZGVuIGFuZCByZXF1aXJpbmcgY29udGV4dCA6IHRoZSB0YWJsZVNlbGVjdGlvbk1vZGUgaXMgJ011bHRpJyBcIiwgKCkgPT4ge1xuXHRcdGNvbnN0IGJhc2ljQ29udGV4dF9MUiA9IGdldENvbnZlcnRlckNvbnRleHQoXG5cdFx0XHRjb252ZXJ0ZWRUeXBlc1NlbGVjdGlvbk1vZGUsXG5cdFx0XHR7IGVudGl0eVNldDogXCJFbnRpdHlXaXRoQWN0aW9uUmVxdWluZ0NvbnRleHRPblRhYmxlXCIgfSxcblx0XHRcdFRlbXBsYXRlVHlwZS5MaXN0UmVwb3J0XG5cdFx0KTtcblx0XHRjb25zdCByZXN1bHQgPSBnZXRTZWxlY3Rpb25Nb2RlRm9yVGVzdChcblx0XHRcdHRydWUsXG5cdFx0XHR7IGlzRGVsZXRhYmxlOiBmYWxzZSwgaXNVcGRhdGFibGU6IGZhbHNlIH0sXG5cdFx0XHRiYXNpY0NvbnRleHRfTFIsXG5cdFx0XHRcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5MaW5lSXRlbVwiXG5cdFx0KTtcblx0XHRleHBlY3QocmVzdWx0KS50b0VxdWFsKFwiTXVsdGlcIik7XG5cdH0pO1xuXHRpdChcIklmIHRoZSBMUiBpcyBub3QgZGVsZXRhYmxlIGFuZCBpdHMgdGFibGUgaGFzIDEgRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uIHJlcXVpcmluZyBhIGNvbnRleHQgd2l0aCBIaWRkZW4gYmluZGluZyBleHAgOiB0aGUgdGFibGVTZWxlY3Rpb25Nb2RlIGlzICd7PSAle2lzSGlkZGVufSA9PT0gZmFsc2UgPyAnTXVsdGknIDogJ05vbmUnfScgXCIsICgpID0+IHtcblx0XHRjb25zdCBiYXNpY0NvbnRleHRfTFIgPSBnZXRDb252ZXJ0ZXJDb250ZXh0KFxuXHRcdFx0Y29udmVydGVkVHlwZXNTZWxlY3Rpb25Nb2RlLFxuXHRcdFx0eyBlbnRpdHlTZXQ6IFwiRW50aXR5V2l0aEFjdGlvblJlcXVpbmdDb250ZXh0T25UYWJsZVdpdGhIaWRkZW5FeHBcIiB9LFxuXHRcdFx0VGVtcGxhdGVUeXBlLkxpc3RSZXBvcnRcblx0XHQpO1xuXHRcdGNvbnN0IHJlc3VsdCA9IGdldFNlbGVjdGlvbk1vZGVGb3JUZXN0KFxuXHRcdFx0dHJ1ZSxcblx0XHRcdHsgaXNEZWxldGFibGU6IGZhbHNlLCBpc1VwZGF0YWJsZTogZmFsc2UgfSxcblx0XHRcdGJhc2ljQ29udGV4dF9MUixcblx0XHRcdFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkxpbmVJdGVtXCJcblx0XHQpO1xuXHRcdGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoXCJ7PSAle2lzSGlkZGVufSA9PT0gZmFsc2UgPyAnTXVsdGknIDogJ05vbmUnfVwiKTtcblx0fSk7XG5cdGl0KFwiSWYgdGhlIExSIGlzIG5vdCBkZWxldGFibGUgYW5kIGl0cyB0YWJsZSBoYXMgMSBjdXN0b20gYm91bmQgYW5kIHN0YXRpY2FsbHkgdmlzaWJsZSBhY3Rpb24gOiB0aGUgdGFibGVTZWxlY3Rpb25Nb2RlIGlzICdNdWx0aScgXCIsICgpID0+IHtcblx0XHRjb25zdCBtYW5pZmVzdFNldHRpbmdzID0ge1xuXHRcdFx0ZW50aXR5U2V0OiBcIkVudGl0eVdpdGhDdXN0b21BY3Rpb25PblRhYmxlXCIsXG5cdFx0XHRjb250cm9sQ29uZmlndXJhdGlvbjoge1xuXHRcdFx0XHRcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5MaW5lSXRlbVwiOiB7XG5cdFx0XHRcdFx0dGFibGVTZXR0aW5nczoge1xuXHRcdFx0XHRcdFx0ZW5hYmxlRXhwb3J0OiBmYWxzZVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0YWN0aW9uczoge1xuXHRcdFx0XHRcdFx0XCJBY3Rpb24xXCI6IHtcblx0XHRcdFx0XHRcdFx0cHJlc3M6IFwieHhcIixcblx0XHRcdFx0XHRcdFx0dmlzaWJsZTogXCJ0cnVlXCIsXG5cdFx0XHRcdFx0XHRcdGVuYWJsZWQ6IFwidHJ1ZVwiLFxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBcIkN1c3RvbSBBY3Rpb25cIixcblx0XHRcdFx0XHRcdFx0ZW5hYmxlT25TZWxlY3Q6IFwieHhcIixcblx0XHRcdFx0XHRcdFx0cmVxdWlyZXNTZWxlY3Rpb246IHRydWVcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHRcdGNvbnN0IGJhc2ljQ29udGV4dF9MUiA9IGdldENvbnZlcnRlckNvbnRleHQoY29udmVydGVkVHlwZXNTZWxlY3Rpb25Nb2RlLCBtYW5pZmVzdFNldHRpbmdzLCBUZW1wbGF0ZVR5cGUuTGlzdFJlcG9ydCk7XG5cdFx0Y29uc3QgcmVzdWx0ID0gZ2V0U2VsZWN0aW9uTW9kZUZvclRlc3QoXG5cdFx0XHR0cnVlLFxuXHRcdFx0eyBpc0RlbGV0YWJsZTogZmFsc2UsIGlzVXBkYXRhYmxlOiBmYWxzZSB9LFxuXHRcdFx0YmFzaWNDb250ZXh0X0xSLFxuXHRcdFx0XCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuTGluZUl0ZW1cIlxuXHRcdCk7XG5cdFx0ZXhwZWN0KHJlc3VsdCkudG9FcXVhbChcIk11bHRpXCIpO1xuXHR9KTtcblx0aXQoXCJJZiB0aGUgTFIgaXMgbm90IGRlbGV0YWJsZSBhbmQgaXRzIHRhYmxlIGhhcyBzZXZlcmFsIGN1c3RvbSBib3VuZCBhY3Rpb25zIHdpdGggdmlzaWJsZSBrZXkgYXMgYW4gZXhwcmVzc2lvbiBiaW5kaW5nIDogdGhlIHRhYmxlU2VsZWN0aW9uTW9kZSBpcyAnTXVsdGknIGluIEVkaXQgTW9kZSwgJ05vbmUnIG90aGVyd2lzZVwiLCAoKSA9PiB7XG5cdFx0Y29uc3QgbWFuaWZlc3RTZXR0aW5ncyA9IHtcblx0XHRcdGVudGl0eVNldDogXCJFbnRpdHlXaXRoQ3VzdG9tQWN0aW9uT25UYWJsZVwiLFxuXHRcdFx0Y29udHJvbENvbmZpZ3VyYXRpb246IHtcblx0XHRcdFx0XCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuTGluZUl0ZW1cIjoge1xuXHRcdFx0XHRcdHRhYmxlU2V0dGluZ3M6IHtcblx0XHRcdFx0XHRcdGVuYWJsZUV4cG9ydDogZmFsc2Vcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGFjdGlvbnM6IHtcblx0XHRcdFx0XHRcdFwiQWN0aW9uMVwiOiB7XG5cdFx0XHRcdFx0XHRcdHByZXNzOiBcInh4XCIsXG5cdFx0XHRcdFx0XHRcdHZpc2libGU6IFwiez0gJHt1aT4vZWRpdE1vZGV9ID09PSAnRWRpdGFibGUnIH1cIixcblx0XHRcdFx0XHRcdFx0ZW5hYmxlZDogXCJ0cnVlXCIsXG5cdFx0XHRcdFx0XHRcdHRleHQ6IFwiQ3VzdG9tIEFjdGlvbjFcIixcblx0XHRcdFx0XHRcdFx0ZW5hYmxlT25TZWxlY3Q6IFwieHhcIixcblx0XHRcdFx0XHRcdFx0cmVxdWlyZXNTZWxlY3Rpb246IHRydWVcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcIkFjdGlvbjJcIjoge1xuXHRcdFx0XHRcdFx0XHRwcmVzczogXCJ4eFwiLFxuXHRcdFx0XHRcdFx0XHR2aXNpYmxlOiBcIns9ICV7T3ZlcmFsbFNEUHJvY2Vzc1N0YXR1c30gPT09ICdCJyB9XCIsXG5cdFx0XHRcdFx0XHRcdGVuYWJsZWQ6IFwidHJ1ZVwiLFxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBcIkN1c3RvbSBBY3Rpb24yXCIsXG5cdFx0XHRcdFx0XHRcdGVuYWJsZU9uU2VsZWN0OiBcInh4XCIsXG5cdFx0XHRcdFx0XHRcdHJlcXVpcmVzU2VsZWN0aW9uOiB0cnVlXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRjb25zdCBiYXNpY0NvbnRleHRfTFIgPSBnZXRDb252ZXJ0ZXJDb250ZXh0KGNvbnZlcnRlZFR5cGVzU2VsZWN0aW9uTW9kZSwgbWFuaWZlc3RTZXR0aW5ncywgVGVtcGxhdGVUeXBlLkxpc3RSZXBvcnQpO1xuXHRcdGNvbnN0IHJlc3VsdCA9IGdldFNlbGVjdGlvbk1vZGVGb3JUZXN0KFxuXHRcdFx0dHJ1ZSxcblx0XHRcdHsgaXNEZWxldGFibGU6IGZhbHNlLCBpc1VwZGF0YWJsZTogZmFsc2UgfSxcblx0XHRcdGJhc2ljQ29udGV4dF9MUixcblx0XHRcdFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkxpbmVJdGVtXCJcblx0XHQpO1xuXHRcdGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoXCJ7PSAoKCAke3VpPi9lZGl0TW9kZX0gPT09ICdFZGl0YWJsZScgKSB8fCAoICV7T3ZlcmFsbFNEUHJvY2Vzc1N0YXR1c30gPT09ICdCJyApKSA/ICdNdWx0aScgOiAnTm9uZSd9XCIpO1xuXHR9KTtcblx0aXQoXCJJZiB0aGUgT1AgaXMgbm90IGRlbGV0YWJsZSBhbmQgYW5kIGl0cyB0YWJsZSBoYXMgbm90IGFjdGlvbiA6IHRoZSB0YWJsZVNlbGVjdGlvbk1vZGUgaXMgJ05vbmUnIFwiLCAoKSA9PiB7XG5cdFx0Y29uc3QgYmFzaWNDb250ZXh0X09QID0gZ2V0Q29udmVydGVyQ29udGV4dChcblx0XHRcdGNvbnZlcnRlZFR5cGVzU2VsZWN0aW9uTW9kZSxcblx0XHRcdHsgZW50aXR5U2V0OiBcIkVudGl0eVdpdGhvdXRBY3Rpb25PblRhYmxlXCIgfSxcblx0XHRcdFRlbXBsYXRlVHlwZS5PYmplY3RQYWdlXG5cdFx0KTtcblx0XHRjb25zdCByZXN1bHQgPSBnZXRTZWxlY3Rpb25Nb2RlRm9yVGVzdChcblx0XHRcdGZhbHNlLFxuXHRcdFx0eyBpc0RlbGV0YWJsZTogZmFsc2UsIGlzVXBkYXRhYmxlOiBmYWxzZSB9LFxuXHRcdFx0YmFzaWNDb250ZXh0X09QLFxuXHRcdFx0XCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuTGluZUl0ZW1cIlxuXHRcdCk7XG5cdFx0ZXhwZWN0KHJlc3VsdCkudG9FcXVhbChcIk5vbmVcIik7XG5cdH0pO1xuXHRpdChcIklmIHRoZSBPUCBpcyBkZWxldGFibGUgYW5kIGl0cyB0YWJsZSBoYXMgbm90IGFjdGlvbiA6IHRoZSB0YWJsZVNlbGVjdGlvbk1vZGUgaXMgTXVsdGkgaW4gRWRpdCBNb2RlIGFuZCBOb25lIG90aGVyd2lzZVwiLCAoKSA9PiB7XG5cdFx0Y29uc3QgYmFzaWNDb250ZXh0X09QID0gZ2V0Q29udmVydGVyQ29udGV4dChcblx0XHRcdGNvbnZlcnRlZFR5cGVzU2VsZWN0aW9uTW9kZSxcblx0XHRcdHsgZW50aXR5U2V0OiBcIkVudGl0eVdpdGhvdXRBY3Rpb25PblRhYmxlXCIgfSxcblx0XHRcdFRlbXBsYXRlVHlwZS5PYmplY3RQYWdlXG5cdFx0KTtcblx0XHRjb25zdCByZXN1bHQgPSBnZXRTZWxlY3Rpb25Nb2RlRm9yVGVzdChcblx0XHRcdGZhbHNlLFxuXHRcdFx0eyBpc0RlbGV0YWJsZTogdHJ1ZSwgaXNVcGRhdGFibGU6IGZhbHNlIH0sXG5cdFx0XHRiYXNpY0NvbnRleHRfT1AsXG5cdFx0XHRcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5MaW5lSXRlbVwiXG5cdFx0KTtcblx0XHRleHBlY3QocmVzdWx0KS50b0VxdWFsKFwiez0gJXt1aT4vZWRpdE1vZGV9ID09PSAnRWRpdGFibGUnID8gJ011bHRpJyA6ICdOb25lJ31cIik7XG5cdH0pO1xuXHRpdChcIklmIHRoZSBPUCBpcyBkZWxldGFibGUgYW5kIGl0cyB0YWJsZSBoYXMgMSBEYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb24gcmVxdWlyaW5nIGEgY29udGV4dCB3aXRoIEhpZGRlbiBiaW5kaW5nIGV4cCB3aXRoIG5hdiBwcm9wZXJ0eVwiLCAoKSA9PiB7XG5cdFx0Y29uc3QgbWFuaWZlc3RTZXR0aW5ncyA9IHtcblx0XHRcdGVudGl0eVNldDogXCJFbnRpdHlXaXRoQm91bmRBY3Rpb25PblRhYmxlV2l0aEhpZGRlbkV4cFwiLFxuXHRcdFx0Y29udHJvbENvbmZpZ3VyYXRpb246IHtcblx0XHRcdFx0XCJfSXRlbS9AY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuTGluZUl0ZW1cIjoge1xuXHRcdFx0XHRcdHRhYmxlU2V0dGluZ3M6IHtcblx0XHRcdFx0XHRcdGVuYWJsZUV4cG9ydDogZmFsc2Vcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHRcdGNvbnN0IGJhc2ljQ29udGV4dF9PUCA9IGdldENvbnZlcnRlckNvbnRleHQoY29udmVydGVkVHlwZXNTZWxlY3Rpb25Nb2RlLCBtYW5pZmVzdFNldHRpbmdzLCBUZW1wbGF0ZVR5cGUuT2JqZWN0UGFnZSk7XG5cdFx0Y29uc3QgZGF0YU1vZGVsT2JqZWN0UGF0aCA9IGJhc2ljQ29udGV4dF9PUC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCk7XG5cdFx0ZGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QuX3R5cGUgPSBcIk5hdmlnYXRpb25Qcm9wZXJ0eVwiO1xuXHRcdGRhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0LnBhcnRuZXIgPSBcIm93bmVyXCI7XG5cdFx0Y29uc3QgcmVzdWx0ID0gZ2V0U2VsZWN0aW9uTW9kZUZvclRlc3QoXG5cdFx0XHRmYWxzZSxcblx0XHRcdHsgaXNEZWxldGFibGU6IHRydWUsIGlzVXBkYXRhYmxlOiBmYWxzZSB9LFxuXHRcdFx0YmFzaWNDb250ZXh0X09QLFxuXHRcdFx0XCJfSXRlbS9AY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuTGluZUl0ZW1cIlxuXHRcdCk7XG5cdFx0ZXhwZWN0KHJlc3VsdCkudG9FcXVhbChcIns9ICV7dWk+L2VkaXRNb2RlfSA9PT0gJ0VkaXRhYmxlJyA/ICdNdWx0aScgOiAoJXtIaWRkZW59ID09PSBmYWxzZSA/ICdNdWx0aScgOiAnTm9uZScpfVwiKTtcblx0fSk7XG5cdGl0KFwiSWYgdGhlIE9QIGlzIGRlbGV0YWJsZSBhbmQgaXRzIHRhYmxlIGhhcyAxIERhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvbiByZXF1aXJpbmcgYSBjb250ZXh0IHdpdGggYW4gSGlkZGVuIGFubm90YXRpb24gKHdpdGhvdXQgbmF2UHJvcCkgOiB0aGUgdGFibGVTZWxlY3Rpb25Nb2RlIGlzIE11bHRpIGluIEVkaXRpb24sIE5vbmUgb3RoZXJ3aXNlXCIsICgpID0+IHtcblx0XHRjb25zdCBiYXNpY0NvbnRleHRfT1AgPSBnZXRDb252ZXJ0ZXJDb250ZXh0KFxuXHRcdFx0Y29udmVydGVkVHlwZXNTZWxlY3Rpb25Nb2RlLFxuXHRcdFx0eyBlbnRpdHlTZXQ6IFwiRW50aXR5V2l0aEJvdW5kQWN0aW9uMk9uVGFibGVXaXRoSGlkZGVuRXhwXCIgfSxcblx0XHRcdFRlbXBsYXRlVHlwZS5PYmplY3RQYWdlXG5cdFx0KTtcblx0XHRjb25zdCByZXN1bHQgPSBnZXRTZWxlY3Rpb25Nb2RlRm9yVGVzdChcblx0XHRcdGZhbHNlLFxuXHRcdFx0eyBpc0RlbGV0YWJsZTogdHJ1ZSwgaXNVcGRhdGFibGU6IGZhbHNlIH0sXG5cdFx0XHRiYXNpY0NvbnRleHRfT1AsXG5cdFx0XHRcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5MaW5lSXRlbVwiXG5cdFx0KTtcblx0XHRleHBlY3QocmVzdWx0KS50b0VxdWFsKFwiez0gJXt1aT4vZWRpdE1vZGV9ID09PSAnRWRpdGFibGUnID8gJ011bHRpJyA6ICdOb25lJ31cIik7XG5cdH0pO1xuXHRpdChcIklmIHRoZSBPUCBpcyBkZWxldGFibGUgYW5kIGl0cyB0YWJsZSBoYXMgYSBtaXggb2YgdmlzaWJsZSBhY3Rpb25zIHdpdGggSGlkZGVuIGFuZCB2aXNpYmxlIGJpbmRpbmcgZXhwIHdpdGggbmF2IHByb3BlcnR5XCIsICgpID0+IHtcblx0XHRjb25zdCBtYW5pZmVzdFNldHRpbmdzID0ge1xuXHRcdFx0ZW50aXR5U2V0OiBcIkVudGl0eVdpdGhNdWx0aXBsZUFjdGlvbnNXaXRoQmluZGluZ0V4cFwiLFxuXHRcdFx0Y29udHJvbENvbmZpZ3VyYXRpb246IHtcblx0XHRcdFx0XCJfSXRlbS9AY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuTGluZUl0ZW1cIjoge1xuXHRcdFx0XHRcdHRhYmxlU2V0dGluZ3M6IHtcblx0XHRcdFx0XHRcdGVuYWJsZUV4cG9ydDogZmFsc2Vcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGFjdGlvbnM6IHtcblx0XHRcdFx0XHRcdFwiQWN0aW9uMVwiOiB7XG5cdFx0XHRcdFx0XHRcdHByZXNzOiBcInh4XCIsXG5cdFx0XHRcdFx0XHRcdHZpc2libGU6IFwiez0gJHt1aT4vZWRpdE1vZGV9ID09PSAnRWRpdGFibGUnIH1cIixcblx0XHRcdFx0XHRcdFx0ZW5hYmxlZDogXCJ0cnVlXCIsXG5cdFx0XHRcdFx0XHRcdHRleHQ6IFwiQ3VzdG9tIEFjdGlvbjFcIixcblx0XHRcdFx0XHRcdFx0ZW5hYmxlT25TZWxlY3Q6IFwieHhcIixcblx0XHRcdFx0XHRcdFx0cmVxdWlyZXNTZWxlY3Rpb246IHRydWVcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcIkFjdGlvbjJcIjoge1xuXHRcdFx0XHRcdFx0XHRwcmVzczogXCJ4eFwiLFxuXHRcdFx0XHRcdFx0XHR2aXNpYmxlOiBcIns9ICV7T3ZlcmFsbFNEUHJvY2Vzc1N0YXR1c30gPT09ICdCJyB9XCIsXG5cdFx0XHRcdFx0XHRcdGVuYWJsZWQ6IFwidHJ1ZVwiLFxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBcIkN1c3RvbSBBY3Rpb24yXCIsXG5cdFx0XHRcdFx0XHRcdGVuYWJsZU9uU2VsZWN0OiBcInh4XCIsXG5cdFx0XHRcdFx0XHRcdHJlcXVpcmVzU2VsZWN0aW9uOiB0cnVlXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRjb25zdCBiYXNpY0NvbnRleHRfT1AgPSBnZXRDb252ZXJ0ZXJDb250ZXh0KGNvbnZlcnRlZFR5cGVzU2VsZWN0aW9uTW9kZSwgbWFuaWZlc3RTZXR0aW5ncywgVGVtcGxhdGVUeXBlLk9iamVjdFBhZ2UpO1xuXHRcdGNvbnN0IGRhdGFNb2RlbE9iamVjdFBhdGggPSBiYXNpY0NvbnRleHRfT1AuZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCgpO1xuXHRcdGRhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0Ll90eXBlID0gXCJOYXZpZ2F0aW9uUHJvcGVydHlcIjtcblx0XHRkYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdC5wYXJ0bmVyID0gXCJvd25lclwiO1xuXHRcdGNvbnN0IHJlc3VsdCA9IGdldFNlbGVjdGlvbk1vZGVGb3JUZXN0KFxuXHRcdFx0ZmFsc2UsXG5cdFx0XHR7IGlzRGVsZXRhYmxlOiB0cnVlLCBpc1VwZGF0YWJsZTogZmFsc2UgfSxcblx0XHRcdGJhc2ljQ29udGV4dF9PUCxcblx0XHRcdFwiX0l0ZW0vQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkxpbmVJdGVtXCJcblx0XHQpO1xuXHRcdGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoXG5cdFx0XHRcIns9ICV7dWk+L2VkaXRNb2RlfSA9PT0gJ0VkaXRhYmxlJyA/ICdNdWx0aScgOiAoKCV7SGlkZGVuMX0gPT09IGZhbHNlIHx8ICV7SGlkZGVuMn0gPT09IGZhbHNlIHx8ICggJHt1aT4vZWRpdE1vZGV9ID09PSAnRWRpdGFibGUnICkgfHwgKCAle092ZXJhbGxTRFByb2Nlc3NTdGF0dXN9ID09PSAnQicgKSkgPyAnTXVsdGknIDogJ05vbmUnKX1cIlxuXHRcdCk7XG5cdH0pO1xufSk7XG5cbmRlc2NyaWJlKFwiQ29uZGVuc2VkIExheW91dFwiLCAoKSA9PiB7XG5cdGl0KFwiRGVmYXVsdCBWYWx1ZVwiLCAoKSA9PiB7XG5cdFx0Y29uc3QgbWFuaWZlc3RTZXR0aW5ncyA9IHtcblx0XHRcdGVudGl0eVNldDogXCJUZXN0RW50aXR5XCJcblx0XHR9O1xuXHRcdGNvbnN0IHRhYmxlQ29uZmlndXJhdGlvbiA9IGdldFRhYmxlQ29uZmlndXJhdGlvbkZvclRlc3QobWFuaWZlc3RTZXR0aW5ncyk7XG5cdFx0ZXhwZWN0KHRhYmxlQ29uZmlndXJhdGlvbi51c2VDb25kZW5zZWRUYWJsZUxheW91dCkudG9CZShmYWxzZSk7XG5cdFx0Y29uc3QgdGFibGVDb25maWd1cmF0aW9uT1AgPSBnZXRUYWJsZUNvbmZpZ3VyYXRpb25Gb3JUZXN0KG1hbmlmZXN0U2V0dGluZ3MsIFRlbXBsYXRlVHlwZS5PYmplY3RQYWdlKTtcblx0XHRleHBlY3QodGFibGVDb25maWd1cmF0aW9uT1AudXNlQ29uZGVuc2VkVGFibGVMYXlvdXQpLnRvQmUoZmFsc2UpO1xuXHR9KTtcblx0aXQoXCJNYW5pZmVzdCBGb3JjZXMgdG8gdHJ1ZVwiLCAoKSA9PiB7XG5cdFx0Y29uc3QgbWFuaWZlc3RTZXR0aW5ncyA9IHtcblx0XHRcdGVudGl0eVNldDogXCJUZXN0RW50aXR5XCIsXG5cdFx0XHRjb250cm9sQ29uZmlndXJhdGlvbjoge1xuXHRcdFx0XHRcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5MaW5lSXRlbVwiOiB7XG5cdFx0XHRcdFx0dGFibGVTZXR0aW5nczoge1xuXHRcdFx0XHRcdFx0Y29uZGVuc2VkVGFibGVMYXlvdXQ6IHRydWVcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHRcdC8vIEV2ZW4gaWYgZGVmaW5lZCwgdGhlIHZhbHVlIHNob3VsZCBiZSB1c2VkIG9ubHkgaW4gY2FzZXMgd2hlcmUgdGhlIHNldHRpbmcgaXMgY29tcGF0aWJsZVxuXHRcdGNvbnN0IHRhYmxlQ29uZmlndXJhdGlvbiA9IGdldFRhYmxlQ29uZmlndXJhdGlvbkZvclRlc3QobWFuaWZlc3RTZXR0aW5ncywgVGVtcGxhdGVUeXBlLkxpc3RSZXBvcnQpO1xuXHRcdGV4cGVjdCh0YWJsZUNvbmZpZ3VyYXRpb24udXNlQ29uZGVuc2VkVGFibGVMYXlvdXQpLnRvQmUoZmFsc2UpO1xuXHRcdGNvbnN0IHRhYmxlQ29uZmlndXJhdGlvbk9QID0gZ2V0VGFibGVDb25maWd1cmF0aW9uRm9yVGVzdChtYW5pZmVzdFNldHRpbmdzLCBUZW1wbGF0ZVR5cGUuT2JqZWN0UGFnZSk7XG5cdFx0ZXhwZWN0KHRhYmxlQ29uZmlndXJhdGlvbk9QLnVzZUNvbmRlbnNlZFRhYmxlTGF5b3V0KS50b0JlKGZhbHNlKTtcblxuXHRcdC8vIEluIGEgQ29uZGVuc2VkIExheW91dCBDb21wbGlhbnQgU2V0dGluZywgdGhlIHZhbHVlIHNob3VsZCBiZSB0cnVlXG5cdFx0Y29uc3QgdGFibGVDb25maWd1cmF0aW9uQ0wgPSBnZXRUYWJsZUNvbmZpZ3VyYXRpb25Gb3JUZXN0KG1hbmlmZXN0U2V0dGluZ3MsIFRlbXBsYXRlVHlwZS5MaXN0UmVwb3J0LCB0cnVlKTtcblx0XHRleHBlY3QodGFibGVDb25maWd1cmF0aW9uQ0wudXNlQ29uZGVuc2VkVGFibGVMYXlvdXQpLnRvQmUodHJ1ZSk7XG5cdFx0Y29uc3QgdGFibGVDb25maWd1cmF0aW9uQ0xPUCA9IGdldFRhYmxlQ29uZmlndXJhdGlvbkZvclRlc3QobWFuaWZlc3RTZXR0aW5ncywgVGVtcGxhdGVUeXBlLk9iamVjdFBhZ2UsIHRydWUpO1xuXHRcdGV4cGVjdCh0YWJsZUNvbmZpZ3VyYXRpb25DTE9QLnVzZUNvbmRlbnNlZFRhYmxlTGF5b3V0KS50b0JlKHRydWUpO1xuXHR9KTtcblx0aXQoXCJNYW5pZmVzdCBGb3JjZXMgdG8gdHJ1ZSBpbiBpbmNvcnJlY3Qgc2V0dGluZyBmcm9tIG1hbmlmZXN0XCIsICgpID0+IHtcblx0XHRjb25zdCBtYW5pZmVzdFNldHRpbmdzID0ge1xuXHRcdFx0ZW50aXR5U2V0OiBcIlRlc3RFbnRpdHlcIixcblx0XHRcdGNvbnRyb2xDb25maWd1cmF0aW9uOiB7XG5cdFx0XHRcdFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkxpbmVJdGVtXCI6IHtcblx0XHRcdFx0XHR0YWJsZVNldHRpbmdzOiB7XG5cdFx0XHRcdFx0XHRjb25kZW5zZWRUYWJsZUxheW91dDogdHJ1ZVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGNvbnRlbnREZW5zaXRpZXM6IHtcblx0XHRcdFx0Y296eTogdHJ1ZSxcblx0XHRcdFx0Y29tcGFjdDogZmFsc2Vcblx0XHRcdH1cblx0XHR9O1xuXHRcdC8vIEluIGEgQ29uZGVuc2VkIExheW91dCBDb21wbGlhbnQgU2V0dGluZywgdGhlIHZhbHVlIHNob3VsZCBiZSB0cnVlXG5cdFx0Y29uc3QgdGFibGVDb25maWd1cmF0aW9uQ0wgPSBnZXRUYWJsZUNvbmZpZ3VyYXRpb25Gb3JUZXN0KG1hbmlmZXN0U2V0dGluZ3MsIFRlbXBsYXRlVHlwZS5MaXN0UmVwb3J0LCB0cnVlKTtcblx0XHRleHBlY3QodGFibGVDb25maWd1cmF0aW9uQ0wudXNlQ29uZGVuc2VkVGFibGVMYXlvdXQpLnRvQmUoZmFsc2UpO1xuXHRcdGNvbnN0IHRhYmxlQ29uZmlndXJhdGlvbkNMT1AgPSBnZXRUYWJsZUNvbmZpZ3VyYXRpb25Gb3JUZXN0KG1hbmlmZXN0U2V0dGluZ3MsIFRlbXBsYXRlVHlwZS5PYmplY3RQYWdlLCB0cnVlKTtcblx0XHRleHBlY3QodGFibGVDb25maWd1cmF0aW9uQ0xPUC51c2VDb25kZW5zZWRUYWJsZUxheW91dCkudG9CZShmYWxzZSk7XG5cdH0pO1xuXG5cdGl0KFwiTWFuaWZlc3QgRm9yY2VzIHRvIHRydWUgaW4gaW5jb3JyZWN0IHNldHRpbmcgZnJvbSBlbnZpcm9ubWVudFwiLCAoKSA9PiB7XG5cdFx0Y29uc3QgbWFuaWZlc3RTZXR0aW5ncyA9IHtcblx0XHRcdGVudGl0eVNldDogXCJUZXN0RW50aXR5XCIsXG5cdFx0XHRjb250cm9sQ29uZmlndXJhdGlvbjoge1xuXHRcdFx0XHRcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5MaW5lSXRlbVwiOiB7XG5cdFx0XHRcdFx0dGFibGVTZXR0aW5nczoge1xuXHRcdFx0XHRcdFx0Y29uZGVuc2VkVGFibGVMYXlvdXQ6IHRydWVcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHRcdC8vIEluIGEgQ29uZGVuc2VkIExheW91dCBDb21wbGlhbnQgU2V0dGluZywgdGhlIHZhbHVlIHNob3VsZCBiZSB0cnVlXG5cdFx0Y29uc3QgdGFibGVDb25maWd1cmF0aW9uQ0wgPSBnZXRUYWJsZUNvbmZpZ3VyYXRpb25Gb3JUZXN0KG1hbmlmZXN0U2V0dGluZ3MsIFRlbXBsYXRlVHlwZS5MaXN0UmVwb3J0LCB0cnVlLCBcImNvenlcIik7XG5cdFx0ZXhwZWN0KHRhYmxlQ29uZmlndXJhdGlvbkNMLnVzZUNvbmRlbnNlZFRhYmxlTGF5b3V0KS50b0JlKGZhbHNlKTtcblx0XHRjb25zdCB0YWJsZUNvbmZpZ3VyYXRpb25DTE9QID0gZ2V0VGFibGVDb25maWd1cmF0aW9uRm9yVGVzdChtYW5pZmVzdFNldHRpbmdzLCBUZW1wbGF0ZVR5cGUuT2JqZWN0UGFnZSwgdHJ1ZSwgXCJjb3p5XCIpO1xuXHRcdGV4cGVjdCh0YWJsZUNvbmZpZ3VyYXRpb25DTE9QLnVzZUNvbmRlbnNlZFRhYmxlTGF5b3V0KS50b0JlKGZhbHNlKTtcblx0fSk7XG59KTtcblxuZGVzY3JpYmUoXCJBbmFseXRpY2FsIFRhYmxlXCIsICgpID0+IHtcblx0Y29uc3QgZ2V0VGFibGVDb25maWd1cmF0aW9uRm9yQW5hbHl0aWNhbFRlc3QgPSAoXG5cdFx0bWFuaWZlc3RTZXR0aW5nczogTGlzdFJlcG9ydE1hbmlmZXN0U2V0dGluZ3MsXG5cdFx0dGVtcGxhdGVUeXBlOiBUZW1wbGF0ZVR5cGUgPSBUZW1wbGF0ZVR5cGUuTGlzdFJlcG9ydCxcblx0XHRjb252ZXJ0ZXJPdXRwdXQ6IENvbnZlcnRlck91dHB1dCA9IGNvbnZlcnRlZFR5cGVzLFxuXHRcdHRhYmxlVHlwZT86IFRhYmxlTWFuaWZlc3RTZXR0aW5nc0NvbmZpZ3VyYXRpb25cblx0KTogVGFibGVDb250cm9sQ29uZmlndXJhdGlvbiA9PiB7XG5cdFx0Y29uc3QgYmFzaWNDb250ZXh0ID0gZ2V0Q29udmVydGVyQ29udGV4dChjb252ZXJ0ZXJPdXRwdXQsIG1hbmlmZXN0U2V0dGluZ3MsIHRlbXBsYXRlVHlwZSk7XG5cdFx0YmFzaWNDb250ZXh0LmdldE1hbmlmZXN0Q29udHJvbENvbmZpZ3VyYXRpb24oXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuTGluZUl0ZW1cIikudGFibGVTZXR0aW5ncy50eXBlID1cblx0XHRcdHRhYmxlVHlwZT8udHlwZSB8fCB1bmRlZmluZWQ7XG5cdFx0cmV0dXJuIGdldFRhYmxlTWFuaWZlc3RDb25maWd1cmF0aW9uKFxuXHRcdFx0YmFzaWNDb250ZXh0LmdldEVudGl0eVR5cGUoKS5hbm5vdGF0aW9ucy5VST8uTGluZUl0ZW0sXG5cdFx0XHRcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5MaW5lSXRlbVwiLFxuXHRcdFx0YmFzaWNDb250ZXh0XG5cdFx0KTtcblx0fTtcblx0aXQoXCJJZiBub3Qgc3BlY2lmaWVkLCB0aGUgZGVmYXVsdCB0YWJsZSB0eXBlIGlzICdBbmFseXRpY2FsVGFibGUnIG9uIGEgZGVza3RvcCB3aGVuIHRoZSBzZXJ2aWNlIGlzIEFuYWx5dGljYWwgY29tcGxpYW50XCIsICgpID0+IHtcblx0XHRjb25zdCBtYW5pZmVzdFNldHRpbmdzID0ge1xuXHRcdFx0ZW50aXR5U2V0OiBcIlRlc3RFbnRpdHlcIixcblx0XHRcdGNvbnRyb2xDb25maWd1cmF0aW9uOiB7XG5cdFx0XHRcdFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkxpbmVJdGVtXCI6IHtcblx0XHRcdFx0XHR0YWJsZVNldHRpbmdzOiB7XG5cdFx0XHRcdFx0XHRjb25kZW5zZWRUYWJsZUxheW91dDogdHJ1ZVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGlzRGVza3RvcDogdHJ1ZVxuXHRcdH07XG5cdFx0Y29uc3QgdGFibGVDb25maWd1cmF0aW9uQUxQID0gZ2V0VGFibGVDb25maWd1cmF0aW9uRm9yQW5hbHl0aWNhbFRlc3QoXG5cdFx0XHRtYW5pZmVzdFNldHRpbmdzLFxuXHRcdFx0VGVtcGxhdGVUeXBlLkFuYWx5dGljYWxMaXN0UGFnZSxcblx0XHRcdGNvbnZlcnRlZFR5cGVzQW5hbHl0aWNhbFNlcnZpY2Vcblx0XHQpO1xuXHRcdGV4cGVjdCh0YWJsZUNvbmZpZ3VyYXRpb25BTFAudHlwZSkudG9FcXVhbChcIkFuYWx5dGljYWxUYWJsZVwiKTtcblx0fSk7XG5cdGl0KFwiSWYgbm90IHNwZWNpZmllZCwgdGhlIGRlZmF1bHQgdGFibGUgdHlwZSBpcyAnUmVzcG9uc2l2ZVRhYmxlJyBvbiBhIGRlc2t0b3Agd2hlbiB0aGUgc2VydmljZSBpcyBOT1QgQW5hbHl0aWNhbCBjb21wbGlhbnRcIiwgKCkgPT4ge1xuXHRcdGNvbnN0IG1hbmlmZXN0U2V0dGluZ3MgPSB7XG5cdFx0XHRlbnRpdHlTZXQ6IFwiVGVzdEVudGl0eVwiLFxuXHRcdFx0Y29udHJvbENvbmZpZ3VyYXRpb246IHtcblx0XHRcdFx0XCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuTGluZUl0ZW1cIjoge1xuXHRcdFx0XHRcdHRhYmxlU2V0dGluZ3M6IHtcblx0XHRcdFx0XHRcdGNvbmRlbnNlZFRhYmxlTGF5b3V0OiB0cnVlXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0aXNEZXNrdG9wOiB0cnVlXG5cdFx0fTtcblx0XHRjb25zdCB0YWJsZUNvbmZpZ3VyYXRpb25BTFAgPSBnZXRUYWJsZUNvbmZpZ3VyYXRpb25Gb3JBbmFseXRpY2FsVGVzdChcblx0XHRcdG1hbmlmZXN0U2V0dGluZ3MsXG5cdFx0XHRUZW1wbGF0ZVR5cGUuQW5hbHl0aWNhbExpc3RQYWdlLFxuXHRcdFx0Y29udmVydGVkVHlwZXNcblx0XHQpO1xuXHRcdGV4cGVjdCh0YWJsZUNvbmZpZ3VyYXRpb25BTFAudHlwZSkudG9FcXVhbChcIlJlc3BvbnNpdmVUYWJsZVwiKTtcblx0fSk7XG5cdGl0KFwiSWYgbm90IHNwZWNpZmllZCwgdGhlIGRlZmF1bHQgdGFibGUgdHlwZSBpcyAnUmVzcG9uc2l2ZVRhYmxlJyBvbiBhIG1vYmlsZS90YWJsZXQgZGV2aWNlIG5vIG1hdHRlciB0aGUgc2VydmljZVwiLCAoKSA9PiB7XG5cdFx0Y29uc3QgbWFuaWZlc3RTZXR0aW5ncyA9IHtcblx0XHRcdGVudGl0eVNldDogXCJUZXN0RW50aXR5XCIsXG5cdFx0XHRjb250cm9sQ29uZmlndXJhdGlvbjoge1xuXHRcdFx0XHRcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5MaW5lSXRlbVwiOiB7XG5cdFx0XHRcdFx0dGFibGVTZXR0aW5nczoge1xuXHRcdFx0XHRcdFx0Y29uZGVuc2VkVGFibGVMYXlvdXQ6IHRydWVcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRpc0Rlc2t0b3A6IGZhbHNlXG5cdFx0fTtcblx0XHRjb25zdCB0YWJsZUNvbmZpZ3VyYXRpb25BTFAgPSBnZXRUYWJsZUNvbmZpZ3VyYXRpb25Gb3JBbmFseXRpY2FsVGVzdChcblx0XHRcdG1hbmlmZXN0U2V0dGluZ3MsXG5cdFx0XHRUZW1wbGF0ZVR5cGUuQW5hbHl0aWNhbExpc3RQYWdlLFxuXHRcdFx0Y29udmVydGVkVHlwZXNBbmFseXRpY2FsU2VydmljZVxuXHRcdCk7XG5cdFx0ZXhwZWN0KHRhYmxlQ29uZmlndXJhdGlvbkFMUC50eXBlKS50b0VxdWFsKFwiUmVzcG9uc2l2ZVRhYmxlXCIpO1xuXHR9KTtcblx0aXQoXCJJZiB0aGUgdGFibGVUeXBlIGlzIHNldCB0byBBbmFseXRpY2FsVGFibGUsIGJ1dCB0aGUgc2VydmljZSBpcyBOT1QgQW5hbHl0aWNhbCBjb21wbGlhbnQsIHRoZSB0YWJsZVR5cGUgaXMgZm9yY2VkIHRvICdHcmlkVGFibGUnXCIsICgpID0+IHtcblx0XHRjb25zdCBtYW5pZmVzdFNldHRpbmdzID0ge1xuXHRcdFx0ZW50aXR5U2V0OiBcIlRlc3RFbnRpdHlcIixcblx0XHRcdGNvbnRyb2xDb25maWd1cmF0aW9uOiB7XG5cdFx0XHRcdFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkxpbmVJdGVtXCI6IHtcblx0XHRcdFx0XHR0YWJsZVNldHRpbmdzOiB7XG5cdFx0XHRcdFx0XHRjb25kZW5zZWRUYWJsZUxheW91dDogdHJ1ZVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGlzRGVza3RvcDogdHJ1ZVxuXHRcdH07XG5cdFx0Y29uc3QgdGFibGVUeXBlOiBUYWJsZU1hbmlmZXN0U2V0dGluZ3NDb25maWd1cmF0aW9uID0geyB0eXBlOiBcIkFuYWx5dGljYWxUYWJsZVwiIH07XG5cdFx0Y29uc3QgdGFibGVDb25maWd1cmF0aW9uQUxQID0gZ2V0VGFibGVDb25maWd1cmF0aW9uRm9yQW5hbHl0aWNhbFRlc3QoXG5cdFx0XHRtYW5pZmVzdFNldHRpbmdzLFxuXHRcdFx0VGVtcGxhdGVUeXBlLkFuYWx5dGljYWxMaXN0UGFnZSxcblx0XHRcdGNvbnZlcnRlZFR5cGVzLFxuXHRcdFx0dGFibGVUeXBlXG5cdFx0KTtcblx0XHRleHBlY3QodGFibGVDb25maWd1cmF0aW9uQUxQLnR5cGUpLnRvRXF1YWwoXCJHcmlkVGFibGVcIik7XG5cdH0pO1xuXHRpdChcIklmIHRoZSB0YWJsZVR5cGUgaXMgc2V0IHRvIEFuYWx5dGljYWxUYWJsZSwgd2l0aCBhIHNlcnZpY2UgQW5hbHl0aWNhbCBjb21wbGlhbnQsIHRoZSB0YWJsZVR5cGUgaXMgJ0FuYWx5dGljYWxUYWJsZSdcIiwgKCkgPT4ge1xuXHRcdGNvbnN0IG1hbmlmZXN0U2V0dGluZ3MgPSB7XG5cdFx0XHRlbnRpdHlTZXQ6IFwiVGVzdEVudGl0eVwiLFxuXHRcdFx0Y29udHJvbENvbmZpZ3VyYXRpb246IHtcblx0XHRcdFx0XCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuTGluZUl0ZW1cIjoge1xuXHRcdFx0XHRcdHRhYmxlU2V0dGluZ3M6IHtcblx0XHRcdFx0XHRcdGNvbmRlbnNlZFRhYmxlTGF5b3V0OiB0cnVlXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0aXNEZXNrdG9wOiB0cnVlXG5cdFx0fTtcblx0XHRjb25zdCB0YWJsZVR5cGU6IFRhYmxlTWFuaWZlc3RTZXR0aW5nc0NvbmZpZ3VyYXRpb24gPSB7IHR5cGU6IFwiQW5hbHl0aWNhbFRhYmxlXCIgfTtcblx0XHRjb25zdCB0YWJsZUNvbmZpZ3VyYXRpb25BTFAgPSBnZXRUYWJsZUNvbmZpZ3VyYXRpb25Gb3JBbmFseXRpY2FsVGVzdChcblx0XHRcdG1hbmlmZXN0U2V0dGluZ3MsXG5cdFx0XHRUZW1wbGF0ZVR5cGUuQW5hbHl0aWNhbExpc3RQYWdlLFxuXHRcdFx0Y29udmVydGVkVHlwZXNBbmFseXRpY2FsU2VydmljZSxcblx0XHRcdHRhYmxlVHlwZVxuXHRcdCk7XG5cdFx0ZXhwZWN0KHRhYmxlQ29uZmlndXJhdGlvbkFMUC50eXBlKS50b0VxdWFsKFwiQW5hbHl0aWNhbFRhYmxlXCIpO1xuXHR9KTtcbn0pO1xuIl19