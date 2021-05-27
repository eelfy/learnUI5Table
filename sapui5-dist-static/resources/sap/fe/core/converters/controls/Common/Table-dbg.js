sap.ui.define(["../../ManifestSettings", "../../templates/BaseConverter", "../../helpers/ID", "sap/fe/core/converters/controls/Common/Action", "sap/fe/core/converters/helpers/ConfigurableObject", "sap/fe/core/converters/annotations/DataField", "sap/fe/core/helpers/BindingExpression", "sap/fe/core/converters/helpers/BindingHelper", "sap/fe/core/converters/helpers/Key", "sap/fe/core/formatters/TableFormatter", "sap/fe/core/formatters/TableFormatterTypes", "sap/fe/core/templating/DataModelPathHelper", "sap/fe/core/helpers/StableIdHelper", "sap/fe/core/converters/helpers/IssueManager", "sap/fe/core/templating/PropertyHelper", "../../helpers/Aggregation"], function (ManifestSettings, BaseConverter, ID, Action, ConfigurableObject, DataField, BindingExpression, BindingHelper, Key, tableFormatters, TableFormatterTypes, DataModelPathHelper, StableIdHelper, IssueManager, PropertyHelper, Aggregation) {
  "use strict";

  var _exports = {};
  var AggregationHelper = Aggregation.AggregationHelper;
  var getAssociatedCurrencyProperty = PropertyHelper.getAssociatedCurrencyProperty;
  var getAssociatedUnitProperty = PropertyHelper.getAssociatedUnitProperty;
  var isProperty = PropertyHelper.isProperty;
  var IssueType = IssueManager.IssueType;
  var IssueSeverity = IssueManager.IssueSeverity;
  var IssueCategory = IssueManager.IssueCategory;
  var replaceSpecialChars = StableIdHelper.replaceSpecialChars;
  var isPathUpdatable = DataModelPathHelper.isPathUpdatable;
  var isPathInsertable = DataModelPathHelper.isPathInsertable;
  var isPathDeletable = DataModelPathHelper.isPathDeletable;
  var getTargetObjectPath = DataModelPathHelper.getTargetObjectPath;
  var MessageType = TableFormatterTypes.MessageType;
  var KeyHelper = Key.KeyHelper;
  var UI = BindingHelper.UI;
  var Draft = BindingHelper.Draft;
  var resolveBindingString = BindingExpression.resolveBindingString;
  var or = BindingExpression.or;
  var not = BindingExpression.not;
  var isConstant = BindingExpression.isConstant;
  var ifElse = BindingExpression.ifElse;
  var formatResult = BindingExpression.formatResult;
  var equal = BindingExpression.equal;
  var constant = BindingExpression.constant;
  var compileBinding = BindingExpression.compileBinding;
  var bindingExpression = BindingExpression.bindingExpression;
  var annotationExpression = BindingExpression.annotationExpression;
  var and = BindingExpression.and;
  var collectRelatedProperties = DataField.collectRelatedProperties;
  var getSemanticObjectPath = DataField.getSemanticObjectPath;
  var isDataFieldTypes = DataField.isDataFieldTypes;
  var isDataFieldForActionAbstract = DataField.isDataFieldForActionAbstract;
  var isDataFieldAlwaysHidden = DataField.isDataFieldAlwaysHidden;
  var collectRelatedPropertiesRecursively = DataField.collectRelatedPropertiesRecursively;
  var Placement = ConfigurableObject.Placement;
  var insertCustomElements = ConfigurableObject.insertCustomElements;
  var removeDuplicateActions = Action.removeDuplicateActions;
  var isActionNavigable = Action.isActionNavigable;
  var getActionsFromManifest = Action.getActionsFromManifest;
  var TableID = ID.TableID;
  var TemplateType = BaseConverter.TemplateType;
  var VisualizationType = ManifestSettings.VisualizationType;
  var VariantManagementType = ManifestSettings.VariantManagementType;
  var SelectionMode = ManifestSettings.SelectionMode;
  var HorizontalAlign = ManifestSettings.HorizontalAlign;
  var CreationMode = ManifestSettings.CreationMode;
  var AvailabilityType = ManifestSettings.AvailabilityType;
  var ActionType = ManifestSettings.ActionType;

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  var ColumnType;

  (function (ColumnType) {
    ColumnType["Default"] = "Default";
    ColumnType["Annotation"] = "Annotation";
  })(ColumnType || (ColumnType = {}));

  /**
   * Returns an array of all annotation based and manifest based table actions.
   *
   * @param {LineItem} lineItemAnnotation
   * @param {string} visualizationPath
   * @param {ConverterContext} converterContext
   * @param {NavigationSettingsConfiguration} navigationSettings
   * @returns {BaseAction} the complete table actions
   */
  function getTableActions(lineItemAnnotation, visualizationPath, converterContext, navigationSettings) {
    var aTableActions = getTableAnnotationActions(lineItemAnnotation, visualizationPath, converterContext);
    var aAnnotationActions = aTableActions.tableActions;
    var aHiddenActions = aTableActions.hiddenTableActions;
    return insertCustomElements(aAnnotationActions, getActionsFromManifest(converterContext.getManifestControlConfiguration(visualizationPath).actions, converterContext, aAnnotationActions, navigationSettings, true, aHiddenActions), {
      isNavigable: "overwrite",
      enableOnSelect: "overwrite",
      enableAutoScroll: "overwrite",
      enabled: "overwrite"
    });
  }
  /**
   * Returns an array off all columns, annotation based as well as manifest based.
   * They are sorted and some properties of can be overwritten through the manifest (check out the overwrite-able Keys).
   *
   * @param {LineItem} lineItemAnnotation Collection of data fields for representation in a table or list
   * @param {string} visualizationPath
   * @param {ConverterContext} converterContext
   * @param {NavigationSettingsConfiguration} navigationSettings
   * @returns {TableColumn[]} Returns all table columns that should be available, regardless of templating or personalization or their origin
   */


  _exports.getTableActions = getTableActions;

  function getTableColumns(lineItemAnnotation, visualizationPath, converterContext, navigationSettings) {
    var annotationColumns = getColumnsFromAnnotations(lineItemAnnotation, visualizationPath, converterContext);
    var manifestColumns = getColumnsFromManifest(converterContext.getManifestControlConfiguration(visualizationPath).columns, annotationColumns, converterContext, converterContext.getAnnotationEntityType(lineItemAnnotation), navigationSettings);
    return insertCustomElements(annotationColumns, manifestColumns, {
      width: "overwrite",
      isNavigable: "overwrite",
      availability: "overwrite",
      settings: "overwrite",
      horizontalAlign: "overwrite",
      formatOptions: "overwrite"
    });
  }
  /**
   * Retrieve the custom aggregation definitions from the entityType.
   *
   * @param entityType The target entity type.
   * @param tableColumns The array of columns for the entity type.
   * @param converterContext The converter context.
   * @returns the aggregate definitions from the entityType, or udefined if the entity doesn't support anaytical queries
   */


  _exports.getTableColumns = getTableColumns;

  var getAggregateDefinitionsFromEntityType = function (entityType, tableColumns, converterContext) {
    var aggregationHelper = new AggregationHelper(entityType, converterContext);

    function findColumnFromPath(path) {
      return tableColumns.find(function (column) {
        var annotationColumn = column;
        return annotationColumn.propertyInfos === undefined && annotationColumn.relativePath === path;
      });
    }

    if (!aggregationHelper.isAnalyticsSupported()) {
      return undefined;
    } // Keep a set of all currency/unit properties, as we don't want to consider them as aggregates
    // They are aggregates for technical reasons (to manage multi-units situations) but it doesn't make sense from a user standpoint


    var mCurrencyOrUnitProperties = new Set();
    tableColumns.forEach(function (oColumn) {
      var oTableColumn = oColumn;

      if (oTableColumn.unit) {
        mCurrencyOrUnitProperties.add(oTableColumn.unit);
      }
    });
    var mRawDefinitions = aggregationHelper.getCustomAggregateDefinitions();
    var mResult = {};
    tableColumns.forEach(function (oColumn) {
      var oTableColumn = oColumn;

      if (oTableColumn.propertyInfos === undefined && oTableColumn.relativePath) {
        var aRawContextDefiningProperties = mRawDefinitions[oTableColumn.relativePath]; // Ignore aggregates corresponding to currencies or units pf measure

        if (aRawContextDefiningProperties && !mCurrencyOrUnitProperties.has(oTableColumn.name)) {
          mResult[oTableColumn.name] = {
            defaultAggregate: {},
            relativePath: oTableColumn.relativePath
          };
          var aContextDefiningProperties = [];
          aRawContextDefiningProperties.forEach(function (contextDefiningPropertyName) {
            var oColumn = findColumnFromPath(contextDefiningPropertyName);

            if (oColumn) {
              aContextDefiningProperties.push(oColumn.name);
            }
          });

          if (aContextDefiningProperties.length) {
            mResult[oTableColumn.name].defaultAggregate.contextDefiningProperties = aContextDefiningProperties;
          }
        }
      }
    });
    return mResult;
  };
  /**
   * Updates a table visualization for analytical use cases.
   *
   * @param tableVisualization the visualization to be updated
   * @param entityType the entity type displayed in the table
   * @param converterContext the converter context
   * @param presentationVariantAnnotation the presentationVariant annotation (if any)
   */


  _exports.getAggregateDefinitionsFromEntityType = getAggregateDefinitionsFromEntityType;

  function updateTableVisualizationForAnalytics(tableVisualization, entityType, converterContext, presentationVariantAnnotation) {
    if (tableVisualization.control.type === "AnalyticalTable") {
      var aggregatesDefinitions = getAggregateDefinitionsFromEntityType(entityType, tableVisualization.columns, converterContext);

      if (aggregatesDefinitions) {
        tableVisualization.enableAnalytics = true;
        tableVisualization.aggregates = aggregatesDefinitions; // Add group and sort conditions from the presentation variant

        tableVisualization.annotation.groupConditions = getGroupConditions(presentationVariantAnnotation, tableVisualization.columns);
        tableVisualization.annotation.aggregateConditions = getAggregateConditions(presentationVariantAnnotation, tableVisualization.columns);
      }

      tableVisualization.control.type = "GridTable"; // AnalyticalTable isn't a real type for the MDC:Table, so we always switch back to Grid
    }
  }
  /**
   * Sets the 'unit' property in columns when necessary.
   *
   * @param entityType the entity type displayed in the table
   * @param tableColumns the columns to be updated
   */


  function updateUnitProperties(entityType, tableColumns) {
    tableColumns.forEach(function (oColumn) {
      var oTableColumn = oColumn;

      if (oTableColumn.propertyInfos === undefined && oTableColumn.relativePath) {
        var oProperty = entityType.entityProperties.find(function (oProp) {
          return oProp.name === oTableColumn.relativePath;
        });

        if (oProperty) {
          var _getAssociatedCurrenc, _getAssociatedUnitPro;

          var sUnit = ((_getAssociatedCurrenc = getAssociatedCurrencyProperty(oProperty)) === null || _getAssociatedCurrenc === void 0 ? void 0 : _getAssociatedCurrenc.name) || ((_getAssociatedUnitPro = getAssociatedUnitProperty(oProperty)) === null || _getAssociatedUnitPro === void 0 ? void 0 : _getAssociatedUnitPro.name);

          if (sUnit) {
            var oUnitColumn = tableColumns.find(function (column) {
              var annotationColumn = column;
              return annotationColumn.propertyInfos === undefined && annotationColumn.relativePath === sUnit;
            });
            oTableColumn.unit = oUnitColumn === null || oUnitColumn === void 0 ? void 0 : oUnitColumn.name;
          }
        }
      }
    });
  }

  function createTableVisualization(lineItemAnnotation, visualizationPath, converterContext, presentationVariantAnnotation, isCondensedTableLayoutCompliant) {
    var tableManifestConfig = getTableManifestConfiguration(lineItemAnnotation, visualizationPath, converterContext, isCondensedTableLayoutCompliant);

    var _splitPath = splitPath(visualizationPath),
        navigationPropertyPath = _splitPath.navigationPropertyPath;

    var dataModelPath = converterContext.getDataModelObjectPath();
    var entityName = dataModelPath.targetEntitySet ? dataModelPath.targetEntitySet.name : dataModelPath.startingEntitySet.name,
        isEntitySet = navigationPropertyPath.length === 0;
    var navigationOrCollectionName = isEntitySet ? entityName : navigationPropertyPath;
    var navigationSettings = converterContext.getManifestWrapper().getNavigationConfiguration(navigationOrCollectionName);
    var columns = getTableColumns(lineItemAnnotation, visualizationPath, converterContext, navigationSettings);
    var oVisualization = {
      type: VisualizationType.Table,
      annotation: getTableAnnotationConfiguration(lineItemAnnotation, visualizationPath, converterContext, tableManifestConfig, columns, presentationVariantAnnotation),
      control: tableManifestConfig,
      actions: removeDuplicateActions(getTableActions(lineItemAnnotation, visualizationPath, converterContext, navigationSettings)),
      columns: columns
    };
    updateUnitProperties(converterContext.getAnnotationEntityType(lineItemAnnotation), columns);
    updateTableVisualizationForAnalytics(oVisualization, converterContext.getAnnotationEntityType(lineItemAnnotation), converterContext, presentationVariantAnnotation);
    return oVisualization;
  }

  _exports.createTableVisualization = createTableVisualization;

  function createDefaultTableVisualization(converterContext) {
    var tableManifestConfig = getTableManifestConfiguration(undefined, "", converterContext, false);
    var columns = getColumnsFromEntityType({}, converterContext.getEntityType(), [], [], converterContext);
    var oVisualization = {
      type: VisualizationType.Table,
      annotation: getTableAnnotationConfiguration(undefined, "", converterContext, tableManifestConfig, columns),
      control: tableManifestConfig,
      actions: [],
      columns: columns
    };
    updateUnitProperties(converterContext.getEntityType(), columns);
    updateTableVisualizationForAnalytics(oVisualization, converterContext.getEntityType(), converterContext);
    return oVisualization;
  }
  /**
   * Loop through the DataFieldForAction and DataFieldForIntentBasedNavigation of a line item and return all the
   * Hidden UI annotation expressions.
   *
   * @param lineItemAnnotation Collection of data fields for representation in a table or list
   * @param contextDataModelObjectPath DataModelObjectPath
   * @param isEntitySet true or false
   * @returns {Expression<boolean>[]} All the UI Hidden path expressions found in the relevant actions
   */


  _exports.createDefaultTableVisualization = createDefaultTableVisualization;

  function getUIHiddenExpForActionsRequiringContext(lineItemAnnotation, contextDataModelObjectPath, isEntitySet) {
    var aUiHiddenPathExpressions = [];
    lineItemAnnotation.forEach(function (dataField) {
      var _dataField$ActionTarg, _dataField$Inline;

      if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" && (dataField === null || dataField === void 0 ? void 0 : (_dataField$ActionTarg = dataField.ActionTarget) === null || _dataField$ActionTarg === void 0 ? void 0 : _dataField$ActionTarg.isBound) || dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" && dataField.RequiresContext && (dataField === null || dataField === void 0 ? void 0 : (_dataField$Inline = dataField.Inline) === null || _dataField$Inline === void 0 ? void 0 : _dataField$Inline.valueOf()) !== true) {
        var _dataField$annotation, _dataField$annotation2, _dataField$annotation3;

        if (typeof ((_dataField$annotation = dataField.annotations) === null || _dataField$annotation === void 0 ? void 0 : (_dataField$annotation2 = _dataField$annotation.UI) === null || _dataField$annotation2 === void 0 ? void 0 : (_dataField$annotation3 = _dataField$annotation2.Hidden) === null || _dataField$annotation3 === void 0 ? void 0 : _dataField$annotation3.valueOf()) === "object") {
          aUiHiddenPathExpressions.push(equal(getBindingExpFromContext(dataField, contextDataModelObjectPath, isEntitySet), false));
        }
      }
    });
    return aUiHiddenPathExpressions;
  }
  /**
   * This method is used to change the context currently referenced by this binding by removing the last navigation property.
   *
   * It is used (specifically in this case), to transform a binding made for a NavProp context /MainObject/NavProp1/NavProp2,
   * into a binding on the previous context /MainObject/NavProp1.
   *
   * @param source DataFieldForAction | DataFieldForIntentBasedNavigation | CustomAction
   * @param contextDataModelObjectPath DataModelObjectPath
   * @param isEntitySet true or false
   * @returns the binding expression
   */


  function getBindingExpFromContext(source, contextDataModelObjectPath, isEntitySet) {
    var _ref, _ref2, _sExpression;

    var sExpression;

    if (((_ref = source) === null || _ref === void 0 ? void 0 : _ref.$Type) === "com.sap.vocabularies.UI.v1.DataFieldForAction" || ((_ref2 = source) === null || _ref2 === void 0 ? void 0 : _ref2.$Type) === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation") {
      var _ref3, _ref3$annotations, _ref3$annotations$UI;

      sExpression = (_ref3 = source) === null || _ref3 === void 0 ? void 0 : (_ref3$annotations = _ref3.annotations) === null || _ref3$annotations === void 0 ? void 0 : (_ref3$annotations$UI = _ref3$annotations.UI) === null || _ref3$annotations$UI === void 0 ? void 0 : _ref3$annotations$UI.Hidden;
    } else {
      var _ref4;

      sExpression = (_ref4 = source) === null || _ref4 === void 0 ? void 0 : _ref4.visible;
    }

    var sPath;

    if ((_sExpression = sExpression) === null || _sExpression === void 0 ? void 0 : _sExpression.path) {
      sPath = sExpression.path;
    } else {
      sPath = sExpression;
    }

    if (sPath) {
      var _ref5;

      if ((_ref5 = source) === null || _ref5 === void 0 ? void 0 : _ref5.visible) {
        sPath = sPath.substring(1, sPath.length - 1);
      }

      if (sPath.indexOf("/") > 0) {
        var _contextDataModelObje;

        //check if the navigation property is correct:
        var aSplitPath = sPath.split("/");
        var sNavigationPath = aSplitPath[0];

        if ((contextDataModelObjectPath === null || contextDataModelObjectPath === void 0 ? void 0 : (_contextDataModelObje = contextDataModelObjectPath.targetObject) === null || _contextDataModelObje === void 0 ? void 0 : _contextDataModelObje._type) === "NavigationProperty" && contextDataModelObjectPath.targetObject.partner === sNavigationPath) {
          return bindingExpression(aSplitPath.slice(1).join("/"));
        } else {
          return constant(true);
        } // In case there is no navigation property, if it's an entitySet, the expression binding has to be returned:

      } else if (isEntitySet) {
        return bindingExpression(sPath); // otherwise the expression binding cannot be taken into account for the selection mode evaluation:
      } else {
        return constant(true);
      }
    }

    return constant(true);
  }
  /**
   * Loop through the DataFieldForAction and DataFieldForIntentBasedNavigation of a line item and check
   * if at least one of them is always visible in the table toolbar (and requires a context).
   *
   * @param lineItemAnnotation Collection of data fields for representation in a table or list
   * @returns {boolean} true if there is at least 1 actions that meets the criteria
   */


  function hasBoundActionsAlwaysVisibleInToolBar(lineItemAnnotation) {
    return lineItemAnnotation.some(function (dataField) {
      var _dataField$Inline2, _dataField$annotation4, _dataField$annotation5, _dataField$annotation6, _dataField$annotation7, _dataField$annotation8, _dataField$annotation9;

      if ((dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" || dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation") && (dataField === null || dataField === void 0 ? void 0 : (_dataField$Inline2 = dataField.Inline) === null || _dataField$Inline2 === void 0 ? void 0 : _dataField$Inline2.valueOf()) !== true && (((_dataField$annotation4 = dataField.annotations) === null || _dataField$annotation4 === void 0 ? void 0 : (_dataField$annotation5 = _dataField$annotation4.UI) === null || _dataField$annotation5 === void 0 ? void 0 : (_dataField$annotation6 = _dataField$annotation5.Hidden) === null || _dataField$annotation6 === void 0 ? void 0 : _dataField$annotation6.valueOf()) === false || ((_dataField$annotation7 = dataField.annotations) === null || _dataField$annotation7 === void 0 ? void 0 : (_dataField$annotation8 = _dataField$annotation7.UI) === null || _dataField$annotation8 === void 0 ? void 0 : (_dataField$annotation9 = _dataField$annotation8.Hidden) === null || _dataField$annotation9 === void 0 ? void 0 : _dataField$annotation9.valueOf()) === undefined)) {
        if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction") {
          var _dataField$ActionTarg2;

          return dataField === null || dataField === void 0 ? void 0 : (_dataField$ActionTarg2 = dataField.ActionTarget) === null || _dataField$ActionTarg2 === void 0 ? void 0 : _dataField$ActionTarg2.isBound;
        } else if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation") {
          return dataField.RequiresContext;
        }
      }

      return false;
    });
  }

  function hasCustomActionsAlwaysVisibleInToolBar(manifestActions) {
    return Object.keys(manifestActions).some(function (actionKey) {
      var _action$visible;

      var action = manifestActions[actionKey];

      if (action.requiresSelection && ((_action$visible = action.visible) === null || _action$visible === void 0 ? void 0 : _action$visible.toString()) === "true") {
        return true;
      }

      return false;
    });
  }
  /**
   * Loop through the Custom Actions (with key requiresSelection) declared in the manifest for the current line item and return all the
   * visible key values as an expression.
   *
   * @param manifestActions the manifest defined actions
   * @returns {Expression<boolean>[]} all the visible path expressions of the actions that meet the criteria
   */


  function getVisibleExpForCustomActionsRequiringContext(manifestActions) {
    var aVisiblePathExpressions = [];

    if (manifestActions) {
      Object.keys(manifestActions).forEach(function (actionKey) {
        var action = manifestActions[actionKey];

        if (action.requiresSelection === true && action.visible !== undefined) {
          if (typeof action.visible === "string") {
            var _action$visible2;

            /*The final aim would be to check if the path expression depends on the parent context
            and considers only those expressions for the expression evaluation,
            but currently not possible from the manifest as the visible key is bound on the parent entity.
            Tricky to differenciate the path as it's done for the Hidden annotation.
            For the time being we consider all the paths of the manifest*/
            aVisiblePathExpressions.push(resolveBindingString(action === null || action === void 0 ? void 0 : (_action$visible2 = action.visible) === null || _action$visible2 === void 0 ? void 0 : _action$visible2.valueOf()));
          }
        }
      });
    }

    return aVisiblePathExpressions;
  }
  /**
   * Evaluate if the path is statically deletable or updatable.
   *
   * @param converterContext
   * @returns {TableCapabilityRestriction} the table capabilities
   */


  function getCapabilityRestriction(converterContext) {
    var isDeletable = isPathDeletable(converterContext.getDataModelObjectPath());
    var isUpdatable = isPathUpdatable(converterContext.getDataModelObjectPath());
    return {
      isDeletable: !(isConstant(isDeletable) && isDeletable.value === false),
      isUpdatable: !(isConstant(isUpdatable) && isUpdatable.value === false)
    };
  }

  _exports.getCapabilityRestriction = getCapabilityRestriction;

  function getSelectionMode(lineItemAnnotation, visualizationPath, converterContext, isEntitySet, targetCapabilities) {
    var _tableManifestSetting;

    if (!lineItemAnnotation) {
      return SelectionMode.None;
    }

    var tableManifestSettings = converterContext.getManifestControlConfiguration(visualizationPath);
    var selectionMode = (_tableManifestSetting = tableManifestSettings.tableSettings) === null || _tableManifestSetting === void 0 ? void 0 : _tableManifestSetting.selectionMode;
    var aHiddenBindingExpressions = [],
        aVisibleBindingExpressions = [];
    var manifestActions = getActionsFromManifest(converterContext.getManifestControlConfiguration(visualizationPath).actions, converterContext, [], undefined, false);
    var isParentDeletable, parentEntitySetDeletable;

    if (converterContext.getTemplateType() === TemplateType.ObjectPage) {
      isParentDeletable = isPathDeletable(converterContext.getDataModelObjectPath(), undefined);
      parentEntitySetDeletable = isParentDeletable ? compileBinding(isParentDeletable, true) : isParentDeletable;
    }

    if (selectionMode && selectionMode === SelectionMode.None) {
      if (!isEntitySet) {
        if (targetCapabilities.isDeletable || parentEntitySetDeletable !== "false") {
          selectionMode = SelectionMode.Multi;
          return compileBinding(ifElse(equal(bindingExpression("/editMode", "ui"), "Editable"), constant(selectionMode), constant("None")));
        } else {
          selectionMode = SelectionMode.None;
        }
      } else if (isEntitySet) {
        if (targetCapabilities.isDeletable) {
          selectionMode = SelectionMode.Multi;
          return selectionMode;
        } else {
          selectionMode = SelectionMode.None;
        }
      }
    } else if (!selectionMode || selectionMode === SelectionMode.Auto) {
      selectionMode = SelectionMode.Multi;
    }

    if (hasBoundActionsAlwaysVisibleInToolBar(lineItemAnnotation) || hasCustomActionsAlwaysVisibleInToolBar(manifestActions)) {
      return selectionMode;
    }

    aHiddenBindingExpressions = getUIHiddenExpForActionsRequiringContext(lineItemAnnotation, converterContext.getDataModelObjectPath(), isEntitySet);
    aVisibleBindingExpressions = getVisibleExpForCustomActionsRequiringContext(manifestActions); // No action requiring a context:

    if (aHiddenBindingExpressions.length === 0 && aVisibleBindingExpressions.length === 0) {
      if (!isEntitySet) {
        if (targetCapabilities.isDeletable || parentEntitySetDeletable !== "false") {
          return compileBinding(ifElse(equal(bindingExpression("/editMode", "ui"), "Editable"), constant(selectionMode), constant(SelectionMode.None)));
        } else {
          return SelectionMode.None;
        } // EntitySet deletable:

      } else if (targetCapabilities.isDeletable) {
        return selectionMode; // EntitySet not deletable:
      } else {
        return SelectionMode.None;
      } // There are actions requiring a context:

    } else if (!isEntitySet) {
      if (targetCapabilities.isDeletable || parentEntitySetDeletable !== "false") {
        return compileBinding(ifElse(equal(bindingExpression("/editMode", "ui"), "Editable"), constant(selectionMode), ifElse(or.apply(void 0, _toConsumableArray(aHiddenBindingExpressions.concat(aVisibleBindingExpressions))), constant(selectionMode), constant(SelectionMode.None))));
      } else {
        return compileBinding(ifElse(or.apply(void 0, _toConsumableArray(aHiddenBindingExpressions.concat(aVisibleBindingExpressions))), constant(selectionMode), constant(SelectionMode.None)));
      } //EntitySet deletable:

    } else if (targetCapabilities.isDeletable) {
      return SelectionMode.Multi; //EtitySet not deletable:
    } else {
      return compileBinding(ifElse(or.apply(void 0, _toConsumableArray(aHiddenBindingExpressions.concat(aVisibleBindingExpressions))), constant(selectionMode), constant(SelectionMode.None)));
    }
  }
  /**
   * Method to retrieve all table actions from annotations.
   *
   * @param lineItemAnnotation
   * @param visualizationPath
   * @param converterContext
   * @returns {Record<BaseAction, BaseAction>} the table annotation actions
   */


  _exports.getSelectionMode = getSelectionMode;

  function getTableAnnotationActions(lineItemAnnotation, visualizationPath, converterContext) {
    var tableActions = [];
    var hiddenTableActions = [];

    if (lineItemAnnotation) {
      lineItemAnnotation.forEach(function (dataField) {
        var _dataField$annotation10, _dataField$annotation11, _dataField$annotation12, _dataField$annotation13, _dataField$annotation14, _dataField$annotation15, _dataField$annotation16, _dataField$annotation17, _dataField$annotation18, _dataField$annotation19;

        var tableAction;

        if (isDataFieldForActionAbstract(dataField) && !(((_dataField$annotation10 = dataField.annotations) === null || _dataField$annotation10 === void 0 ? void 0 : (_dataField$annotation11 = _dataField$annotation10.UI) === null || _dataField$annotation11 === void 0 ? void 0 : (_dataField$annotation12 = _dataField$annotation11.Hidden) === null || _dataField$annotation12 === void 0 ? void 0 : _dataField$annotation12.valueOf()) === true) && !dataField.Inline && !dataField.Determining) {
          var key = KeyHelper.generateKeyFromDataField(dataField);

          switch (dataField.$Type) {
            case "com.sap.vocabularies.UI.v1.DataFieldForAction":
              tableAction = {
                type: ActionType.DataFieldForAction,
                annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
                key: key,
                visible: compileBinding(not(equal(annotationExpression((_dataField$annotation13 = dataField.annotations) === null || _dataField$annotation13 === void 0 ? void 0 : (_dataField$annotation14 = _dataField$annotation13.UI) === null || _dataField$annotation14 === void 0 ? void 0 : _dataField$annotation14.Hidden), true))),
                isNavigable: true
              };
              break;

            case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
              tableAction = {
                type: ActionType.DataFieldForIntentBasedNavigation,
                annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
                key: key,
                visible: compileBinding(not(equal(annotationExpression((_dataField$annotation15 = dataField.annotations) === null || _dataField$annotation15 === void 0 ? void 0 : (_dataField$annotation16 = _dataField$annotation15.UI) === null || _dataField$annotation16 === void 0 ? void 0 : _dataField$annotation16.Hidden), true)))
              };
              break;

            default:
              break;
          }
        } else if (((_dataField$annotation17 = dataField.annotations) === null || _dataField$annotation17 === void 0 ? void 0 : (_dataField$annotation18 = _dataField$annotation17.UI) === null || _dataField$annotation18 === void 0 ? void 0 : (_dataField$annotation19 = _dataField$annotation18.Hidden) === null || _dataField$annotation19 === void 0 ? void 0 : _dataField$annotation19.valueOf()) === true) {
          hiddenTableActions.push({
            type: ActionType.Default,
            key: KeyHelper.generateKeyFromDataField(dataField)
          });
        }

        if (tableAction) {
          tableActions.push(tableAction);
        }
      });
    }

    return {
      tableActions: tableActions,
      hiddenTableActions: hiddenTableActions
    };
  }

  function getCriticalityBindingByEnum(CriticalityEnum) {
    var criticalityProperty;

    switch (CriticalityEnum) {
      case "UI.CriticalityType/Negative":
        criticalityProperty = MessageType.Error;
        break;

      case "UI.CriticalityType/Critical":
        criticalityProperty = MessageType.Warning;
        break;

      case "UI.CriticalityType/Positive":
        criticalityProperty = MessageType.Success;
        break;

      case "UI.CriticalityType/Information":
        criticalityProperty = MessageType.Information;
        break;

      case "UI.CriticalityType/Neutral":
      default:
        criticalityProperty = MessageType.None;
    }

    return criticalityProperty;
  }

  function getHighlightRowBinding(criticalityAnnotation, isDraftRoot) {
    var defaultHighlightRowDefinition = MessageType.None;

    if (criticalityAnnotation) {
      if (typeof criticalityAnnotation === "object") {
        defaultHighlightRowDefinition = annotationExpression(criticalityAnnotation);
      } else {
        // Enum Value so we get the corresponding static part
        defaultHighlightRowDefinition = getCriticalityBindingByEnum(criticalityAnnotation);
      }
    }

    return ifElse(isDraftRoot && Draft.IsNewObject, MessageType.Information, formatResult([defaultHighlightRowDefinition], tableFormatters.rowHighlighting));
  }

  function _getCreationBehaviour(lineItemAnnotation, tableManifestConfiguration, converterContext, navigationSettings) {
    var _newAction2;

    var navigation = (navigationSettings === null || navigationSettings === void 0 ? void 0 : navigationSettings.create) || (navigationSettings === null || navigationSettings === void 0 ? void 0 : navigationSettings.detail); // cross-app

    if ((navigation === null || navigation === void 0 ? void 0 : navigation.outbound) && navigation.outboundDetail && (navigationSettings === null || navigationSettings === void 0 ? void 0 : navigationSettings.create)) {
      return {
        mode: "External",
        outbound: navigation.outbound,
        outboundDetail: navigation.outboundDetail,
        navigationSettings: navigationSettings
      };
    }

    var newAction;

    if (lineItemAnnotation) {
      var _converterContext$get, _targetAnnotations$Co, _targetAnnotations$Co2, _targetAnnotations$Se, _targetAnnotations$Se2;

      // in-app
      var targetEntityType = converterContext.getAnnotationEntityType(lineItemAnnotation);
      var targetAnnotations = (_converterContext$get = converterContext.getEntitySetForEntityType(targetEntityType)) === null || _converterContext$get === void 0 ? void 0 : _converterContext$get.annotations;
      newAction = (targetAnnotations === null || targetAnnotations === void 0 ? void 0 : (_targetAnnotations$Co = targetAnnotations.Common) === null || _targetAnnotations$Co === void 0 ? void 0 : (_targetAnnotations$Co2 = _targetAnnotations$Co.DraftRoot) === null || _targetAnnotations$Co2 === void 0 ? void 0 : _targetAnnotations$Co2.NewAction) || (targetAnnotations === null || targetAnnotations === void 0 ? void 0 : (_targetAnnotations$Se = targetAnnotations.Session) === null || _targetAnnotations$Se === void 0 ? void 0 : (_targetAnnotations$Se2 = _targetAnnotations$Se.StickySessionSupported) === null || _targetAnnotations$Se2 === void 0 ? void 0 : _targetAnnotations$Se2.NewAction); // TODO: Is there really no 'NewAction' on DraftNode? targetAnnotations?.Common?.DraftNode?.NewAction

      if (tableManifestConfiguration.creationMode === CreationMode.CreationRow && newAction) {
        // A combination of 'CreationRow' and 'NewAction' does not make sense
        // TODO: Or does it?
        throw Error("Creation mode '".concat(CreationMode.CreationRow, "' can not be used with a custom 'new' action (").concat(newAction, ")"));
      }

      if (navigation === null || navigation === void 0 ? void 0 : navigation.route) {
        var _newAction;

        // route specified
        return {
          mode: tableManifestConfiguration.creationMode,
          append: tableManifestConfiguration.createAtEnd,
          newAction: (_newAction = newAction) === null || _newAction === void 0 ? void 0 : _newAction.toString(),
          navigateToTarget: tableManifestConfiguration.creationMode === CreationMode.NewPage ? navigation.route : undefined // navigate only in NewPage mode

        };
      }
    } // no navigation or no route specified - fallback to inline create if original creation mode was 'NewPage'


    if (tableManifestConfiguration.creationMode === CreationMode.NewPage) {
      tableManifestConfiguration.creationMode = CreationMode.Inline;
    }

    return {
      mode: tableManifestConfiguration.creationMode,
      append: tableManifestConfiguration.createAtEnd,
      newAction: (_newAction2 = newAction) === null || _newAction2 === void 0 ? void 0 : _newAction2.toString()
    };
  }

  var _getRowConfigurationProperty = function (lineItemAnnotation, visualizationPath, converterContext, navigationSettings, targetPath) {
    var pressProperty, navigationTarget;
    var criticalityProperty = MessageType.None;
    var targetEntityType = converterContext.getAnnotationEntityType(lineItemAnnotation);

    if (navigationSettings && lineItemAnnotation) {
      var _navigationSettings$d, _navigationSettings$d2;

      navigationTarget = ((_navigationSettings$d = navigationSettings.display) === null || _navigationSettings$d === void 0 ? void 0 : _navigationSettings$d.target) || ((_navigationSettings$d2 = navigationSettings.detail) === null || _navigationSettings$d2 === void 0 ? void 0 : _navigationSettings$d2.outbound);

      if (navigationTarget) {
        pressProperty = ".handlers.onChevronPressNavigateOutBound( $controller ,'" + navigationTarget + "', ${$parameters>bindingContext})";
      } else if (targetEntityType) {
        var _navigationSettings$d3;

        var targetEntitySet = converterContext.getEntitySetForEntityType(targetEntityType);
        navigationTarget = (_navigationSettings$d3 = navigationSettings.detail) === null || _navigationSettings$d3 === void 0 ? void 0 : _navigationSettings$d3.route;

        if (navigationTarget) {
          var _lineItemAnnotation$a, _lineItemAnnotation$a2, _targetEntitySet$anno, _targetEntitySet$anno2, _targetEntitySet$anno3, _targetEntitySet$anno4, _targetEntitySet$anno5, _targetEntitySet$anno6, _targetEntitySet$anno7, _targetEntitySet$anno8;

          criticalityProperty = getHighlightRowBinding((_lineItemAnnotation$a = lineItemAnnotation.annotations) === null || _lineItemAnnotation$a === void 0 ? void 0 : (_lineItemAnnotation$a2 = _lineItemAnnotation$a.UI) === null || _lineItemAnnotation$a2 === void 0 ? void 0 : _lineItemAnnotation$a2.Criticality, !!(targetEntitySet === null || targetEntitySet === void 0 ? void 0 : (_targetEntitySet$anno = targetEntitySet.annotations) === null || _targetEntitySet$anno === void 0 ? void 0 : (_targetEntitySet$anno2 = _targetEntitySet$anno.Common) === null || _targetEntitySet$anno2 === void 0 ? void 0 : _targetEntitySet$anno2.DraftRoot) || !!(targetEntitySet === null || targetEntitySet === void 0 ? void 0 : (_targetEntitySet$anno3 = targetEntitySet.annotations) === null || _targetEntitySet$anno3 === void 0 ? void 0 : (_targetEntitySet$anno4 = _targetEntitySet$anno3.Common) === null || _targetEntitySet$anno4 === void 0 ? void 0 : _targetEntitySet$anno4.DraftNode));
          pressProperty = "._onTableRowPress(${$parameters>bindingContext}, { callExtension: true, targetPath: '" + targetPath + "', editable : " + ((targetEntitySet === null || targetEntitySet === void 0 ? void 0 : (_targetEntitySet$anno5 = targetEntitySet.annotations) === null || _targetEntitySet$anno5 === void 0 ? void 0 : (_targetEntitySet$anno6 = _targetEntitySet$anno5.Common) === null || _targetEntitySet$anno6 === void 0 ? void 0 : _targetEntitySet$anno6.DraftRoot) || (targetEntitySet === null || targetEntitySet === void 0 ? void 0 : (_targetEntitySet$anno7 = targetEntitySet.annotations) === null || _targetEntitySet$anno7 === void 0 ? void 0 : (_targetEntitySet$anno8 = _targetEntitySet$anno7.Common) === null || _targetEntitySet$anno8 === void 0 ? void 0 : _targetEntitySet$anno8.DraftNode) ? "!${$parameters>bindingContext}.getProperty('IsActiveEntity')" : "undefined") + "})"; //Need to access to DraftRoot and DraftNode !!!!!!!
        } else {
          var _lineItemAnnotation$a3, _lineItemAnnotation$a4;

          criticalityProperty = getHighlightRowBinding((_lineItemAnnotation$a3 = lineItemAnnotation.annotations) === null || _lineItemAnnotation$a3 === void 0 ? void 0 : (_lineItemAnnotation$a4 = _lineItemAnnotation$a3.UI) === null || _lineItemAnnotation$a4 === void 0 ? void 0 : _lineItemAnnotation$a4.Criticality, false);
        }
      }
    }

    var rowNavigatedExpression = formatResult([bindingExpression("/deepestPath", "internal")], tableFormatters.navigatedRow, targetEntityType);
    return {
      press: pressProperty,
      action: pressProperty ? "Navigation" : undefined,
      rowHighlighting: compileBinding(criticalityProperty),
      rowNavigated: compileBinding(rowNavigatedExpression)
    };
  };
  /**
   * Retrieve the columns from the entityType.
   *
   * @param columnsToBeCreated The columns to be created.
   * @param entityType The target entity type.
   * @param annotationColumns The array of columns created based on LineItem annotations.
   * @param nonSortableColumns The array of all non sortable column names.
   * @param converterContext The converter context.
   * @returns {AnnotationTableColumn[]} the column from the entityType
   */


  var getColumnsFromEntityType = function (columnsToBeCreated, entityType) {
    var annotationColumns = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var nonSortableColumns = arguments.length > 3 ? arguments[3] : undefined;
    var converterContext = arguments.length > 4 ? arguments[4] : undefined;
    var tableColumns = []; // Catch already existing columns - which were added before by LineItem Annotations

    var aggregationHelper = new AggregationHelper(entityType, converterContext);
    entityType.entityProperties.forEach(function (property) {
      // Catch already existing columns - which were added before by LineItem Annotations
      var exists = annotationColumns.some(function (column) {
        return column.name === property.name;
      }); // if target type exists, it is a complex property and should be ignored

      if (!property.targetType && !exists) {
        var description = columnsToBeCreated.hasOwnProperty(property.name) ? columnsToBeCreated[property.name].description : undefined;
        var fieldGroup = columnsToBeCreated.hasOwnProperty(property.name) ? columnsToBeCreated[property.name].fieldGroup : undefined;
        var relatedPropertiesInfo = collectRelatedProperties(property.name, property, converterContext, true);
        var relatedPropertyNames = Object.keys(relatedPropertiesInfo.properties);
        var columnInfo = getColumnDefinitionFromProperty(property, converterContext.getEntitySetBasedAnnotationPath(property.fullyQualifiedName), property.name, true, true, nonSortableColumns, aggregationHelper, converterContext, description, fieldGroup);

        if (relatedPropertyNames.length > 0) {
          columnInfo.propertyInfos = relatedPropertyNames;
          columnInfo.exportSettings = _objectSpread({}, columnInfo.exportSettings, {
            template: relatedPropertiesInfo.exportSettingsTemplate
          }); // Collect information of related columns to be created.

          relatedPropertyNames.forEach(function (name) {
            columnsToBeCreated[name] = relatedPropertiesInfo.properties[name];
          });
        }

        tableColumns.push(columnInfo);
      }
    });
    return tableColumns;
  };
  /**
   * Create a column definition from a property.
   * @param property {Property} Entity type property for which the column is created
   * @param fullPropertyPath {string} the full path to the target property
   * @param relativePath {string} the relative path to the target property based on the context
   * @param useDataFieldPrefix {boolean} should be prefixed with "DataField::", else it will be prefixed with "Property::"
   * @param availableForAdaptation {boolean} decides whether column should be available for adaptation
   * @param nonSortableColumns {string[]} the array of all non sortable column names
   * @param aggregationHelper {AggregationHelper} the aggregationHelper for the entity
   * @param converterContext {ConverterContext} the converter context
   * @param descriptionProperty {Property} Entity type property for the column containing the description
   * @param fieldGroup {DataFieldAbstractTypes} FieldGroup datafield for the column containing the property
   * @returns {AnnotationTableColumn} the annotation column definition
   */


  _exports.getColumnsFromEntityType = getColumnsFromEntityType;

  var getColumnDefinitionFromProperty = function (property, fullPropertyPath, relativePath, useDataFieldPrefix, availableForAdaptation, nonSortableColumns, aggregationHelper, converterContext, descriptionProperty, fieldGroup) {
    var _property$annotations, _property$annotations2, _property$annotations3;

    var name = useDataFieldPrefix ? relativePath : "Property::" + relativePath;
    var key = (useDataFieldPrefix ? "DataField::" : "Property::") + replaceSpecialChars(relativePath);
    var semanticObjectAnnotationPath = getSemanticObjectPath(converterContext, property.fullyQualifiedName);
    var isHidden = ((_property$annotations = property.annotations) === null || _property$annotations === void 0 ? void 0 : (_property$annotations2 = _property$annotations.UI) === null || _property$annotations2 === void 0 ? void 0 : (_property$annotations3 = _property$annotations2.Hidden) === null || _property$annotations3 === void 0 ? void 0 : _property$annotations3.valueOf()) === true;
    var groupPath = property.name ? _sliceAtSlash(property.name, true, false) : undefined;
    var isGroup = groupPath != property.name;

    var sLabel = _getLabel(property, isGroup);

    var exportLabels = descriptionProperty || fieldGroup || name.indexOf("@com.sap.vocabularies.UI.v1.DataPoint") > -1 ? _getExportLabel(sLabel, name, {
      value: property,
      description: descriptionProperty,
      fieldGroup: fieldGroup
    }) : undefined;
    return {
      key: key,
      isGroupable: aggregationHelper.isPropertyGroupable(property),
      type: ColumnType.Annotation,
      label: sLabel,
      groupLabel: isGroup ? _getLabel(property) : null,
      group: isGroup ? groupPath : null,
      annotationPath: fullPropertyPath,
      semanticObjectPath: semanticObjectAnnotationPath,
      // A fake property was created for the TargetValue used on DataPoints, this property should be hidden and non sortable
      availability: !availableForAdaptation || isHidden || name.indexOf("@com.sap.vocabularies.UI.v1.DataPoint") > -1 ? AvailabilityType.Hidden : AvailabilityType.Adaptation,
      name: name,
      relativePath: relativePath,
      sortable: !isHidden && nonSortableColumns.indexOf(relativePath) === -1 && !(name.indexOf("@com.sap.vocabularies.UI.v1.DataPoint") > -1),
      exportSettings: {
        labels: exportLabels
      },
      isKey: property.isKey
    };
  };
  /**
   * Returns boolean true for valid columns, false for invalid columns.
   *
   * @param {DataFieldAbstractTypes} dataField Different DataField types defined in the annotations
   * @returns {boolean} True for valid columns, false for invalid columns
   * @private
   */


  var _isValidColumn = function (dataField) {
    switch (dataField.$Type) {
      case "com.sap.vocabularies.UI.v1.DataFieldForAction":
      case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
        return !!dataField.Inline;

      case "com.sap.vocabularies.UI.v1.DataFieldWithAction":
      case "com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation":
        return false;

      case "com.sap.vocabularies.UI.v1.DataField":
      case "com.sap.vocabularies.UI.v1.DataFieldWithUrl":
      case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
      case "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":
        return true;

      default: // Todo: Replace with proper Log statement once available
      //  throw new Error("Unhandled DataField Abstract type: " + dataField.$Type);

    }
  };
  /**
   * Returns label for property and dataField.
   * @param {DataFieldAbstractTypes | Property} property Entity type property or DataField defined in the annotations
   * @param isGroup
   * @returns {string} Label of the property or DataField
   * @private
   */


  var _getLabel = function (property) {
    var isGroup = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (!property) {
      return undefined;
    }

    if (isProperty(property)) {
      var _property$annotations4, _property$annotations5, _dataFieldDefault$Lab, _property$annotations6, _property$annotations7;

      var dataFieldDefault = (_property$annotations4 = property.annotations) === null || _property$annotations4 === void 0 ? void 0 : (_property$annotations5 = _property$annotations4.UI) === null || _property$annotations5 === void 0 ? void 0 : _property$annotations5.DataFieldDefault;

      if (dataFieldDefault && !dataFieldDefault.qualifier && ((_dataFieldDefault$Lab = dataFieldDefault.Label) === null || _dataFieldDefault$Lab === void 0 ? void 0 : _dataFieldDefault$Lab.valueOf())) {
        var _dataFieldDefault$Lab2;

        return compileBinding(annotationExpression((_dataFieldDefault$Lab2 = dataFieldDefault.Label) === null || _dataFieldDefault$Lab2 === void 0 ? void 0 : _dataFieldDefault$Lab2.valueOf()));
      }

      return compileBinding(annotationExpression(((_property$annotations6 = property.annotations.Common) === null || _property$annotations6 === void 0 ? void 0 : (_property$annotations7 = _property$annotations6.Label) === null || _property$annotations7 === void 0 ? void 0 : _property$annotations7.valueOf()) || property.name));
    } else if (isDataFieldTypes(property)) {
      var _property$Label2, _property$Value, _property$Value$$targ, _property$Value$$targ2, _property$Value$$targ3, _property$Value$$targ4, _property$Value2, _property$Value2$$tar;

      if (!!isGroup && property.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation") {
        var _property$Label;

        return compileBinding(annotationExpression((_property$Label = property.Label) === null || _property$Label === void 0 ? void 0 : _property$Label.valueOf()));
      }

      return compileBinding(annotationExpression(((_property$Label2 = property.Label) === null || _property$Label2 === void 0 ? void 0 : _property$Label2.valueOf()) || ((_property$Value = property.Value) === null || _property$Value === void 0 ? void 0 : (_property$Value$$targ = _property$Value.$target) === null || _property$Value$$targ === void 0 ? void 0 : (_property$Value$$targ2 = _property$Value$$targ.annotations) === null || _property$Value$$targ2 === void 0 ? void 0 : (_property$Value$$targ3 = _property$Value$$targ2.Common) === null || _property$Value$$targ3 === void 0 ? void 0 : (_property$Value$$targ4 = _property$Value$$targ3.Label) === null || _property$Value$$targ4 === void 0 ? void 0 : _property$Value$$targ4.valueOf()) || ((_property$Value2 = property.Value) === null || _property$Value2 === void 0 ? void 0 : (_property$Value2$$tar = _property$Value2.$target) === null || _property$Value2$$tar === void 0 ? void 0 : _property$Value2$$tar.name)));
    } else if (property.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation") {
      var _property$Label3, _property$Target, _property$Target$$tar, _property$Target$$tar2, _property$Target$$tar3, _property$Target$$tar4, _property$Target$$tar5, _property$Target$$tar6;

      return compileBinding(annotationExpression(((_property$Label3 = property.Label) === null || _property$Label3 === void 0 ? void 0 : _property$Label3.valueOf()) || ((_property$Target = property.Target) === null || _property$Target === void 0 ? void 0 : (_property$Target$$tar = _property$Target.$target) === null || _property$Target$$tar === void 0 ? void 0 : (_property$Target$$tar2 = _property$Target$$tar.Value) === null || _property$Target$$tar2 === void 0 ? void 0 : (_property$Target$$tar3 = _property$Target$$tar2.$target) === null || _property$Target$$tar3 === void 0 ? void 0 : (_property$Target$$tar4 = _property$Target$$tar3.annotations) === null || _property$Target$$tar4 === void 0 ? void 0 : (_property$Target$$tar5 = _property$Target$$tar4.Common) === null || _property$Target$$tar5 === void 0 ? void 0 : (_property$Target$$tar6 = _property$Target$$tar5.Label) === null || _property$Target$$tar6 === void 0 ? void 0 : _property$Target$$tar6.valueOf())));
    } else {
      var _property$Label4;

      return compileBinding(annotationExpression((_property$Label4 = property.Label) === null || _property$Label4 === void 0 ? void 0 : _property$Label4.valueOf()));
    }
  };
  /**
   * Returns an array of export labels as properties could inherited from FieldGroups and we want
   * to keep FielpGroup label and property label.
   *
   * @param {string} sLabel property's label
   * @param {string} columnName This column named is only used to identify dummy property created for the TargetValue in DataPoints
   * @param {CollectedProperties} properties properties collected from property (it could be a description or FieldGroup)
   * @returns {string[]} the array of labels to be considered on the exportSettings.
   * @private
   */


  var _getExportLabel = function (sLabel, columnName, properties) {
    var exportLabels = [];

    if (properties.description) {
      var descriptionLabel = _getLabel(properties.description);

      exportLabels.push(descriptionLabel);
    }

    if (properties.fieldGroup) {
      var fieldGroupLabel = _getLabel(properties.fieldGroup);

      exportLabels.push(fieldGroupLabel);
    }

    exportLabels.push(sLabel); // Remove duplicate labels (e.g. FieldGroup label is the same as the label of one of the properties)

    exportLabels = exportLabels.filter(function (label, index) {
      if (exportLabels.indexOf(label) == index) {
        return label;
      }
    }); // Set export label for Fake property containing Datapoint TargetValue

    if ((columnName === null || columnName === void 0 ? void 0 : columnName.indexOf("@com.sap.vocabularies.UI.v1.DataPoint")) > -1) {
      exportLabels.push("DataPoint.TargetValue");
    }

    return exportLabels;
  };
  /**
   * Create a PropertyInfo for each identified property consumed by a LineItem.
   * @param columnsToBeCreated {Record<string, Property>} Identified properties.
   * @param existingColumns The list of columns created for LineItems and Properties of entityType.
   * @param nonSortableColumns The array of column names which cannot be sorted.
   * @param converterContext The converter context.
   * @param entityType The entity type for the LineItem
   * @returns {AnnotationTableColumn[]} the array of columns created.
   */


  var _createRelatedColumns = function (columnsToBeCreated, existingColumns, nonSortableColumns, converterContext, entityType) {
    var relatedColumns = [];
    var relatedPropertyNameMap = {};
    var aggregationHelper = new AggregationHelper(entityType, converterContext);
    Object.keys(columnsToBeCreated).forEach(function (name) {
      var _columnsToBeCreated$n = columnsToBeCreated[name],
          value = _columnsToBeCreated$n.value,
          description = _columnsToBeCreated$n.description,
          fieldGroup = _columnsToBeCreated$n.fieldGroup,
          annotationPath = converterContext.getAbsoluteAnnotationPath(name),
          relatedColumn = existingColumns.find(function (column) {
        return column.name === name;
      });

      if (relatedColumn === undefined) {
        // Case 1: Create a new property column, this property shouldn't be hidden
        // as it could added/removed via table personalization dialog.
        // Key contains DataField prefix to ensure all property columns have the same key format.
        relatedColumns.push(getColumnDefinitionFromProperty(value, annotationPath, name, true, false, nonSortableColumns, aggregationHelper, converterContext, description, fieldGroup));
      } else if (relatedColumn.annotationPath !== annotationPath || relatedColumn.propertyInfos && relatedColumn.propertyInfos.indexOf(name) !== -1) {
        // Case 2: The existing column points to a LineItem (or)
        // Case 3: This is a self reference from an existing column and
        // both cases require a dummy PropertyInfo for setting correct export settings.
        var newName = "Property::" + name; // Checking whether the related property column has already been created in a previous iteration.

        if (!existingColumns.some(function (column) {
          return column.name === newName;
        })) {
          // Create a new property column with 'Property::' prefix,
          // Set it to hidden as it is only consumed by Complex property infos.
          relatedColumns.push(getColumnDefinitionFromProperty(value, annotationPath, name, false, false, nonSortableColumns, aggregationHelper, converterContext, description));
          relatedPropertyNameMap[name] = newName;
        }
      }
    }); // The property 'name' has been prefixed with 'Property::' for uniqueness.
    // Update the same in other propertyInfos[] references which point to this property.

    existingColumns.forEach(function (column) {
      var _column$propertyInfos;

      column.propertyInfos = (_column$propertyInfos = column.propertyInfos) === null || _column$propertyInfos === void 0 ? void 0 : _column$propertyInfos.map(function (propertyInfo) {
        var _relatedPropertyNameM;

        return (_relatedPropertyNameM = relatedPropertyNameMap[propertyInfo]) !== null && _relatedPropertyNameM !== void 0 ? _relatedPropertyNameM : propertyInfo;
      });
    });
    return relatedColumns;
  };
  /**
   * Getting the Column Name
   * If it points to a DataField with one property or DataPoint with one property it will use the property name
   * here to be consistent with the existing flex changes.
   *
   * @param {DataFieldAbstractTypes} dataField Different DataField types defined in the annotations
   * @returns {string} Returns name of annotation columns
   * @private
   */


  var _getAnnotationColumnName = function (dataField) {
    var _dataField$Target, _dataField$Target$$ta, _dataField$Target$$ta2;

    // This is needed as we have flexibility changes already that we have to check against
    if (isDataFieldTypes(dataField)) {
      var _dataField$Value;

      return (_dataField$Value = dataField.Value) === null || _dataField$Value === void 0 ? void 0 : _dataField$Value.path;
    } else if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation" && ((_dataField$Target = dataField.Target) === null || _dataField$Target === void 0 ? void 0 : (_dataField$Target$$ta = _dataField$Target.$target) === null || _dataField$Target$$ta === void 0 ? void 0 : (_dataField$Target$$ta2 = _dataField$Target$$ta.Value) === null || _dataField$Target$$ta2 === void 0 ? void 0 : _dataField$Target$$ta2.path)) {
      // This is for removing duplicate properties. For example, 'Progress' Property is removed if it is already defined as a DataPoint
      return dataField.Target.$target.Value.path;
    } else {
      return KeyHelper.generateKeyFromDataField(dataField);
    }
  };
  /**
   * Determine the property relative path with respect to the root entity.
   * @param dataField The Data field being processed.
   * @returns {string} The relative path
   */


  var _getRelativePath = function (dataField) {
    var _ref6, _ref6$Value, _ref7, _ref7$Target;

    var relativePath = "";

    switch (dataField.$Type) {
      case "com.sap.vocabularies.UI.v1.DataField":
      case "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":
      case "com.sap.vocabularies.UI.v1.DataFieldWithUrl":
        relativePath = (_ref6 = dataField) === null || _ref6 === void 0 ? void 0 : (_ref6$Value = _ref6.Value) === null || _ref6$Value === void 0 ? void 0 : _ref6$Value.path;
        break;

      case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
        relativePath = (_ref7 = dataField) === null || _ref7 === void 0 ? void 0 : (_ref7$Target = _ref7.Target) === null || _ref7$Target === void 0 ? void 0 : _ref7$Target.value;
        break;

      case "com.sap.vocabularies.UI.v1.DataFieldForAction":
      case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
        relativePath = KeyHelper.generateKeyFromDataField(dataField);
        break;
    }

    return relativePath;
  };

  var _sliceAtSlash = function (path, isLastSlash, isLastPart) {
    var iSlashIndex = isLastSlash ? path.lastIndexOf("/") : path.indexOf("/");

    if (iSlashIndex === -1) {
      return path;
    }

    return isLastPart ? path.substring(iSlashIndex + 1, path.length) : path.substring(0, iSlashIndex);
  };
  /**
   * Determine whether a column is sortable.
   *
   * @param dataField The data field being processed
   * @param propertyPath The property path
   * @param nonSortableColumns Collection of non-sortable column names as per annotation
   * @returns {boolean} True if the column is sortable
   */


  var _isColumnSortable = function (dataField, propertyPath, nonSortableColumns) {
    var isSortable = false;

    if (nonSortableColumns.indexOf(propertyPath) === -1) {
      // Column is not marked as non-sortable via annotation
      switch (dataField.$Type) {
        case "com.sap.vocabularies.UI.v1.DataField":
        case "com.sap.vocabularies.UI.v1.DataFieldWithUrl":
          isSortable = true;
          break;

        case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
        case "com.sap.vocabularies.UI.v1.DataFieldForAction":
          // Action columns are not sortable
          isSortable = false;
          break;
      }
    }

    return isSortable;
  };
  /**
   * Returns line items from metadata annotations.
   *
   * @param lineItemAnnotation
   * @param visualizationPath
   * @param converterContext
   * @returns {TableColumn[]} the columns from the annotations
   */


  var getColumnsFromAnnotations = function (lineItemAnnotation, visualizationPath, converterContext) {
    var _map, _ref8, _converterContext$get2, _converterContext$get3, _converterContext$get4, _converterContext$get5;

    var entityType = converterContext.getAnnotationEntityType(lineItemAnnotation),
        annotationColumns = [],
        columnsToBeCreated = {},
        nonSortableColumns = (_map = (_ref8 = (_converterContext$get2 = converterContext.getEntitySet()) === null || _converterContext$get2 === void 0 ? void 0 : (_converterContext$get3 = _converterContext$get2.annotations) === null || _converterContext$get3 === void 0 ? void 0 : (_converterContext$get4 = _converterContext$get3.Capabilities) === null || _converterContext$get4 === void 0 ? void 0 : (_converterContext$get5 = _converterContext$get4.SortRestrictions) === null || _converterContext$get5 === void 0 ? void 0 : _converterContext$get5.NonSortableProperties) === null || _ref8 === void 0 ? void 0 : _ref8.map(function (property) {
      return property.value;
    })) !== null && _map !== void 0 ? _map : [];

    if (lineItemAnnotation) {
      // Get columns from the LineItem Annotation
      lineItemAnnotation.forEach(function (lineItem) {
        var _lineItem$Value, _lineItem$Value$$targ, _lineItem$annotations, _lineItem$annotations2, _lineItem$annotations3;

        if (!_isValidColumn(lineItem)) {
          return;
        }

        var semanticObjectAnnotationPath = isDataFieldTypes(lineItem) && ((_lineItem$Value = lineItem.Value) === null || _lineItem$Value === void 0 ? void 0 : (_lineItem$Value$$targ = _lineItem$Value.$target) === null || _lineItem$Value$$targ === void 0 ? void 0 : _lineItem$Value$$targ.fullyQualifiedName) ? getSemanticObjectPath(converterContext, lineItem) : undefined;

        var relativePath = _getRelativePath(lineItem); // Determine properties which are consumed by this LineItem.


        var relatedPropertiesInfo = collectRelatedPropertiesRecursively(lineItem, converterContext);
        var relatedPropertyNames = Object.keys(relatedPropertiesInfo.properties);

        var groupPath = _sliceAtSlash(relativePath, true, false);

        var isGroup = groupPath != relativePath;

        var sLabel = _getLabel(lineItem, isGroup);

        annotationColumns.push({
          key: KeyHelper.generateKeyFromDataField(lineItem),
          type: ColumnType.Annotation,
          label: sLabel,
          groupLabel: isGroup ? _getLabel(lineItem) : null,
          group: isGroup ? groupPath : null,
          annotationPath: converterContext.getEntitySetBasedAnnotationPath(lineItem.fullyQualifiedName),
          semanticObjectPath: semanticObjectAnnotationPath,
          availability: isDataFieldAlwaysHidden(lineItem) ? AvailabilityType.Hidden : AvailabilityType.Default,
          name: _getAnnotationColumnName(lineItem),
          relativePath: relativePath,
          sortable: _isColumnSortable(lineItem, relativePath, nonSortableColumns),
          propertyInfos: relatedPropertyNames.length > 0 ? relatedPropertyNames : undefined,
          exportSettings: {
            template: relatedPropertiesInfo.exportSettingsTemplate
          },
          width: ((_lineItem$annotations = lineItem.annotations) === null || _lineItem$annotations === void 0 ? void 0 : (_lineItem$annotations2 = _lineItem$annotations.HTML5) === null || _lineItem$annotations2 === void 0 ? void 0 : (_lineItem$annotations3 = _lineItem$annotations2.CssDefaults) === null || _lineItem$annotations3 === void 0 ? void 0 : _lineItem$annotations3.width) || undefined,
          isNavigable: true,
          formatOptions: {
            textLinesDisplay: 4,
            textLinesEdit: 4
          }
        }); // Collect information of related columns to be created.

        relatedPropertyNames.forEach(function (name) {
          columnsToBeCreated[name] = relatedPropertiesInfo.properties[name];
        });
      });
    } // Get columns from the Properties of EntityType


    var tableColumns = getColumnsFromEntityType(columnsToBeCreated, entityType, annotationColumns, nonSortableColumns, converterContext);
    tableColumns = tableColumns.concat(annotationColumns); // Create a propertyInfo for each related property.

    var relatedColumns = _createRelatedColumns(columnsToBeCreated, tableColumns, nonSortableColumns, converterContext, entityType);

    tableColumns = tableColumns.concat(relatedColumns);
    return tableColumns;
  };
  /**
   * Gets the property names from the manifest and checks against existing properties already added by annotations.
   * If a not yet stored property is found it adds it for sorting and filtering only to the annotationColumns.
   * @param properties {string[] | undefined}
   * @param annotationColumns {AnnotationTableColumn[]}
   * @param converterContext {ConverterContext}
   * @param entityType
   * @returns {string[]} the columns from the annotations
   */


  var _getPropertyNames = function (properties, annotationColumns, converterContext, entityType) {
    var matchedProperties;

    if (properties) {
      matchedProperties = properties.map(function (propertyPath) {
        var annotationColumn = annotationColumns.find(function (annotationColumn) {
          return annotationColumn.relativePath === propertyPath && annotationColumn.propertyInfos === undefined;
        });

        if (annotationColumn) {
          return annotationColumn.name;
        } else {
          var relatedColumns = _createRelatedColumns(_defineProperty({}, propertyPath, {
            value: entityType.resolvePath(propertyPath)
          }), annotationColumns, [], converterContext, entityType);

          annotationColumns.push(relatedColumns[0]);
          return relatedColumns[0].name;
        }
      });
    }

    return matchedProperties;
  };
  /**
   * Retrieves the table column property value based on certain conditions.
   *
   * Manifest defined property value for custom / annotation columns
   * Default property value for custom column if not overwritten in manifest.
   * @param property {any} The column property defined in the manifest
   * @param defaultValue {any} The default value of the property
   * @param isAnnotationColumn {boolean} Whether the column, defined in manifest, corresponds to an existing annotation column.
   * @returns {any} Determined property value for the column
   */


  var _getManifestOrDefaultValue = function (property, defaultValue, isAnnotationColumn) {
    if (property === undefined) {
      // If annotation column has no property defined in manifest,
      // do not overwrite it with manifest column's default value.
      return isAnnotationColumn ? undefined : defaultValue;
    } // Return what is defined in manifest.


    return property;
  };
  /**
   * Returns table column definitions from manifest.
   * @param columns
   * @param annotationColumns
   * @param converterContext
   * @param entityType
   * @param navigationSettings
   * @returns {Record<string, CustomColumn>} the columns from the manifest
   */


  var getColumnsFromManifest = function (columns, annotationColumns, converterContext, entityType, navigationSettings) {
    var internalColumns = {};

    var _loop = function (key) {
      var _manifestColumn$posit;

      var manifestColumn = columns[key]; // To identify the annotation column property overwrite via manifest use-case.

      var isAnnotationColumn = annotationColumns.some(function (column) {
        return column.key === key;
      });
      KeyHelper.validateKey(key);
      internalColumns[key] = {
        key: key,
        id: "CustomColumn::" + key,
        name: "CustomColumn::" + key,
        header: manifestColumn.header,
        width: manifestColumn.width || undefined,
        horizontalAlign: _getManifestOrDefaultValue(manifestColumn === null || manifestColumn === void 0 ? void 0 : manifestColumn.horizontalAlign, HorizontalAlign.Begin, isAnnotationColumn),
        type: ColumnType.Default,
        availability: _getManifestOrDefaultValue(manifestColumn === null || manifestColumn === void 0 ? void 0 : manifestColumn.availability, AvailabilityType.Default, isAnnotationColumn),
        template: manifestColumn.template || "undefined",
        position: {
          anchor: (_manifestColumn$posit = manifestColumn.position) === null || _manifestColumn$posit === void 0 ? void 0 : _manifestColumn$posit.anchor,
          placement: manifestColumn.position === undefined ? Placement.After : manifestColumn.position.placement
        },
        isNavigable: isAnnotationColumn ? undefined : isActionNavigable(manifestColumn, navigationSettings, true),
        settings: manifestColumn.settings,
        sortable: false,
        propertyInfos: _getPropertyNames(manifestColumn.properties, annotationColumns, converterContext, entityType),
        formatOptions: _objectSpread({
          textLinesDisplay: 4,
          textLinesEdit: 4
        }, manifestColumn.formatOptions)
      };
    };

    for (var key in columns) {
      _loop(key);
    }

    return internalColumns;
  };

  function getP13nMode(visualizationPath, converterContext, tableManifestConfiguration) {
    var manifestWrapper = converterContext.getManifestWrapper();
    var tableManifestSettings = converterContext.getManifestControlConfiguration(visualizationPath);
    var variantManagement = manifestWrapper.getVariantManagement();
    var hasVariantManagement = ["Page", "Control"].indexOf(variantManagement) > -1;
    var aPersonalization = [];

    if (hasVariantManagement) {
      var _tableManifestSetting2;

      var bAnalyticalTable = tableManifestConfiguration.type === "AnalyticalTable";

      if ((tableManifestSettings === null || tableManifestSettings === void 0 ? void 0 : (_tableManifestSetting2 = tableManifestSettings.tableSettings) === null || _tableManifestSetting2 === void 0 ? void 0 : _tableManifestSetting2.personalization) !== undefined) {
        // Personalization configured in manifest.
        var personalization = tableManifestSettings.tableSettings.personalization;

        if (personalization === true) {
          // Table personalization fully enabled.
          return bAnalyticalTable ? "Sort,Column,Filter,Group,Aggregate" : "Sort,Column,Filter";
        } else if (typeof personalization === "object") {
          // Specific personalization options enabled in manifest. Use them as is.
          if (personalization.sort) {
            aPersonalization.push("Sort");
          }

          if (personalization.column) {
            aPersonalization.push("Column");
          }

          if (personalization.filter) {
            aPersonalization.push("Filter");
          }

          if (personalization.group && bAnalyticalTable) {
            aPersonalization.push("Group");
          }

          if (personalization.aggregate && bAnalyticalTable) {
            aPersonalization.push("Aggregate");
          }

          return aPersonalization.length > 0 ? aPersonalization.join(",") : undefined;
        }
      } else {
        // No personalization configured in manifest.
        aPersonalization.push("Sort");
        aPersonalization.push("Column");

        if (variantManagement === VariantManagementType.Control) {
          // Feature parity with V2.
          // Enable table filtering by default only in case of Control level variant management.
          aPersonalization.push("Filter");
        }

        if (bAnalyticalTable) {
          aPersonalization.push("Group");
          aPersonalization.push("Aggregate");
        }

        return aPersonalization.join(",");
      }
    }

    return undefined;
  }

  _exports.getP13nMode = getP13nMode;

  function getDeleteHidden(currentEntitySet, navigationPath) {
    var isDeleteHidden = false;

    if (currentEntitySet && navigationPath) {
      var _currentEntitySet$nav, _currentEntitySet$nav2, _currentEntitySet$nav3;

      // Check if UI.DeleteHidden is pointing to parent path
      var deleteHiddenAnnotation = (_currentEntitySet$nav = currentEntitySet.navigationPropertyBinding[navigationPath]) === null || _currentEntitySet$nav === void 0 ? void 0 : (_currentEntitySet$nav2 = _currentEntitySet$nav.annotations) === null || _currentEntitySet$nav2 === void 0 ? void 0 : (_currentEntitySet$nav3 = _currentEntitySet$nav2.UI) === null || _currentEntitySet$nav3 === void 0 ? void 0 : _currentEntitySet$nav3.DeleteHidden;

      if (deleteHiddenAnnotation && deleteHiddenAnnotation.path) {
        if (deleteHiddenAnnotation.path.indexOf("/") > 0) {
          var aSplitHiddenPath = deleteHiddenAnnotation.path.split("/");
          var sNavigationPath = aSplitHiddenPath[0];
          var partnerName = currentEntitySet.entityType.navigationProperties.find(function (navProperty) {
            return navProperty.name === navigationPath;
          }).partner;

          if (partnerName === sNavigationPath) {
            isDeleteHidden = deleteHiddenAnnotation;
          }
        } else {
          isDeleteHidden = false;
        }
      } else {
        isDeleteHidden = deleteHiddenAnnotation;
      }
    } else {
      var _currentEntitySet$ann, _currentEntitySet$ann2;

      isDeleteHidden = currentEntitySet && ((_currentEntitySet$ann = currentEntitySet.annotations) === null || _currentEntitySet$ann === void 0 ? void 0 : (_currentEntitySet$ann2 = _currentEntitySet$ann.UI) === null || _currentEntitySet$ann2 === void 0 ? void 0 : _currentEntitySet$ann2.DeleteHidden);
    }

    return isDeleteHidden;
  }
  /**
   * Returns visibility for Delete button
   * @param converterContext
   * @param navigationPath
   * @param isTargetDeletable
   */


  function getDeleteVisible(converterContext, navigationPath, isTargetDeletable) {
    var currentEntitySet = converterContext.getEntitySet();
    var isDeleteHidden = getDeleteHidden(currentEntitySet, navigationPath);
    var isParentDeletable, parentEntitySetDeletable;

    if (converterContext.getTemplateType() === TemplateType.ObjectPage) {
      isParentDeletable = isPathDeletable(converterContext.getDataModelObjectPath(), navigationPath);
      parentEntitySetDeletable = isParentDeletable ? compileBinding(isParentDeletable) : isParentDeletable;
    } //do not show case the delete button if parentEntitySetDeletable is false


    if (parentEntitySetDeletable === "false") {
      return false;
    } else if (parentEntitySetDeletable && isDeleteHidden !== true) {
      //Delete Hidden in case of true and path based
      if (isDeleteHidden) {
        return "{= !${" + (navigationPath ? navigationPath + "/" : "") + isDeleteHidden.path + "} && ${ui>/editMode} === 'Editable'}";
      } else {
        return "{= ${ui>/editMode} === 'Editable'}";
      }
    } else if (isDeleteHidden === true || !isTargetDeletable || converterContext.getTemplateType() === TemplateType.AnalyticalListPage) {
      return false;
    } else if (converterContext.getTemplateType() !== TemplateType.ListReport) {
      if (isDeleteHidden) {
        return "{= !${" + (navigationPath ? navigationPath + "/" : "") + isDeleteHidden.path + "} && ${ui>/editMode} === 'Editable'}";
      } else {
        return "{= ${ui>/editMode} === 'Editable'}";
      }
    } else {
      return true;
    }
  }
  /**
   * Returns visibility for Create button
   *
   * @param converterContext
   * @param creationBehaviour
   * @returns {*} Expression or Boolean value of create hidden
   */


  _exports.getDeleteVisible = getDeleteVisible;

  function getCreateVisible(converterContext, creationMode, isInsertable) {
    var _currentEntitySet$ann3, _currentEntitySet$ann4, _currentEntitySet$ann5, _currentEntitySet$ann6, _converterContext$get6, _converterContext$get7, _converterContext$get8;

    var currentEntitySet = converterContext.getEntitySet();
    var dataModelObjectPath = converterContext.getDataModelObjectPath();
    var isCreateHidden = currentEntitySet ? annotationExpression((currentEntitySet === null || currentEntitySet === void 0 ? void 0 : (_currentEntitySet$ann3 = currentEntitySet.annotations.UI) === null || _currentEntitySet$ann3 === void 0 ? void 0 : _currentEntitySet$ann3.CreateHidden) || false, dataModelObjectPath.navigationProperties.map(function (navProp) {
      return navProp.name;
    })) : constant(false); // if there is a custom new action the create button will be bound against this new action (instead of a POST action).
    // The visibility of the create button then depends on the new action's OperationAvailable annotation (instead of the insertRestrictions):
    // OperationAvailable = true or undefined -> create is visible
    // OperationAvailable = false -> create is not visible

    var newActionName = currentEntitySet === null || currentEntitySet === void 0 ? void 0 : (_currentEntitySet$ann4 = currentEntitySet.annotations.Common) === null || _currentEntitySet$ann4 === void 0 ? void 0 : (_currentEntitySet$ann5 = _currentEntitySet$ann4.DraftRoot) === null || _currentEntitySet$ann5 === void 0 ? void 0 : (_currentEntitySet$ann6 = _currentEntitySet$ann5.NewAction) === null || _currentEntitySet$ann6 === void 0 ? void 0 : _currentEntitySet$ann6.toString();
    var showCreateForNewAction = newActionName ? annotationExpression(converterContext === null || converterContext === void 0 ? void 0 : (_converterContext$get6 = converterContext.getEntityType().actions[newActionName].annotations) === null || _converterContext$get6 === void 0 ? void 0 : (_converterContext$get7 = _converterContext$get6.Core) === null || _converterContext$get7 === void 0 ? void 0 : (_converterContext$get8 = _converterContext$get7.OperationAvailable) === null || _converterContext$get8 === void 0 ? void 0 : _converterContext$get8.valueOf(), [], true) : undefined; // - If it's statically not insertable -> create is not visible
    // - If create is statically hidden -> create is not visible
    // - If it's an ALP template -> create is not visible
    // -
    // - Otherwise
    // 	 - If the create mode is external -> create is visible
    // 	 - If we're on the list report -> create is visible
    // 	 - Otherwise
    // 	   - This depends on the value of the the UI.IsEditable

    return ifElse(or(or(equal(showCreateForNewAction, false), and(isConstant(isInsertable), equal(isInsertable, false), equal(showCreateForNewAction, undefined))), isConstant(isCreateHidden) && equal(isCreateHidden, true), converterContext.getTemplateType() === TemplateType.AnalyticalListPage), false, ifElse(or(creationMode === "External", converterContext.getTemplateType() === TemplateType.ListReport), true, and(not(isCreateHidden), UI.IsEditable)));
  }
  /**
   * Returns visibility for Create button
   *
   * @param converterContext
   * @param creationBehaviour
   * @returns {*} Expression or Boolean value of createhidden
   */


  _exports.getCreateVisible = getCreateVisible;

  function getPasteEnabled(converterContext, creationBehaviour, isInsertable) {
    // If create is not visible -> it's not enabled
    // If create is visible ->
    // 	 If it's in the ListReport -> not enabled
    //	 If it's insertable -> enabled
    return ifElse(equal(getCreateVisible(converterContext, creationBehaviour.mode, isInsertable), true), converterContext.getTemplateType() === TemplateType.ObjectPage && isInsertable, false);
  }
  /**
   * Returns a JSON string containing Presentation Variant sort conditions.
   *
   * @param presentationVariantAnnotation {PresentationVariantTypeTypes | undefined} Presentation variant annotation
   * @param columns Converter processed table columns
   * @returns {string | undefined} Sort conditions for a Presentation variant.
   */


  _exports.getPasteEnabled = getPasteEnabled;

  function getSortConditions(presentationVariantAnnotation, columns) {
    var sortConditions;

    if (presentationVariantAnnotation === null || presentationVariantAnnotation === void 0 ? void 0 : presentationVariantAnnotation.SortOrder) {
      var sorters = [];
      var conditions = {
        sorters: sorters
      };
      presentationVariantAnnotation.SortOrder.forEach(function (condition) {
        var _ref9, _ref9$$target, _sortColumn$propertyI, _sortColumn$propertyI2;

        var propertyName = (_ref9 = condition.Property) === null || _ref9 === void 0 ? void 0 : (_ref9$$target = _ref9.$target) === null || _ref9$$target === void 0 ? void 0 : _ref9$$target.name;
        var sortColumn = columns.find(function (column) {
          return column.name === propertyName;
        });
        sortColumn === null || sortColumn === void 0 ? void 0 : (_sortColumn$propertyI = sortColumn.propertyInfos) === null || _sortColumn$propertyI === void 0 ? void 0 : _sortColumn$propertyI.forEach(function (relatedPropertyName) {
          // Complex PropertyInfo. Add each related property for sorting.
          conditions.sorters.push({
            name: relatedPropertyName,
            descending: !!condition.Descending
          });
        });

        if (!(sortColumn === null || sortColumn === void 0 ? void 0 : (_sortColumn$propertyI2 = sortColumn.propertyInfos) === null || _sortColumn$propertyI2 === void 0 ? void 0 : _sortColumn$propertyI2.length)) {
          // Not a complex PropertyInfo. Consider the property itself for sorting.
          conditions.sorters.push({
            name: propertyName,
            descending: !!condition.Descending
          });
        }
      });
      sortConditions = conditions.sorters.length ? JSON.stringify(conditions) : undefined;
    }

    return sortConditions;
  }
  /**
   * Converts an array of prpertyPath to an array of propertyInfo names.
   *
   * @param paths the array to be converted
   * @param columns the array of propertyInfos
   * @returns an array of proprtyInfo names
   */


  function convertPropertyPathsToInfoNames(paths, columns) {
    var infoNames = [];
    paths.forEach(function (currentPath) {
      var _currentPath$$target;

      if (currentPath === null || currentPath === void 0 ? void 0 : (_currentPath$$target = currentPath.$target) === null || _currentPath$$target === void 0 ? void 0 : _currentPath$$target.name) {
        var propertyInfo = columns.find(function (column) {
          var _currentPath$$target2;

          var annotationColumn = column;
          return !annotationColumn.propertyInfos && annotationColumn.relativePath === (currentPath === null || currentPath === void 0 ? void 0 : (_currentPath$$target2 = currentPath.$target) === null || _currentPath$$target2 === void 0 ? void 0 : _currentPath$$target2.name);
        });

        if (propertyInfo) {
          infoNames.push(propertyInfo.name);
        }
      }
    });
    return infoNames;
  }
  /**
   * Returns a JSON string containing Presentation Variant group conditions.
   *
   * @param presentationVariantAnnotation {PresentationVariantTypeTypes | undefined} Presentation variant annotation
   * @param columns Converter processed table columns
   * @returns {string | undefined} Group conditions for a Presentation variant.
   */


  function getGroupConditions(presentationVariantAnnotation, columns) {
    var groupConditions;

    if (presentationVariantAnnotation === null || presentationVariantAnnotation === void 0 ? void 0 : presentationVariantAnnotation.GroupBy) {
      var aGroupBy = presentationVariantAnnotation.GroupBy;
      var aGroupLevels = convertPropertyPathsToInfoNames(aGroupBy, columns).map(function (infoName) {
        return {
          name: infoName
        };
      });
      groupConditions = aGroupLevels.length ? JSON.stringify({
        groupLevels: aGroupLevels
      }) : undefined;
    }

    return groupConditions;
  }
  /**
   * Returns a JSON string containing Presentation Variant aggregate conditions.
   *
   * @param presentationVariantAnnotation {PresentationVariantTypeTypes | undefined} Presentation variant annotation
   * @param columns Converter processed table columns
   * @returns {string | undefined} Group conditions for a Presentation variant.
   */


  function getAggregateConditions(presentationVariantAnnotation, columns) {
    var aggregateConditions;

    if (presentationVariantAnnotation === null || presentationVariantAnnotation === void 0 ? void 0 : presentationVariantAnnotation.Total) {
      var aTotals = presentationVariantAnnotation.Total;
      var aggregates = {};
      convertPropertyPathsToInfoNames(aTotals, columns).forEach(function (infoName) {
        aggregates[infoName] = {};
      });
      aggregateConditions = JSON.stringify(aggregates);
    }

    return aggregateConditions;
  }

  function getTableAnnotationConfiguration(lineItemAnnotation, visualizationPath, converterContext, tableManifestConfiguration, columns, presentationVariantAnnotation) {
    var _converterContext$get9, _converterContext$get10, _converterContext$get11;

    // Need to get the target
    var _splitPath2 = splitPath(visualizationPath),
        navigationPropertyPath = _splitPath2.navigationPropertyPath;

    var title = (_converterContext$get9 = converterContext.getDataModelObjectPath().targetEntityType.annotations) === null || _converterContext$get9 === void 0 ? void 0 : (_converterContext$get10 = _converterContext$get9.UI) === null || _converterContext$get10 === void 0 ? void 0 : (_converterContext$get11 = _converterContext$get10.HeaderInfo) === null || _converterContext$get11 === void 0 ? void 0 : _converterContext$get11.TypeNamePlural;
    var entitySet = converterContext.getDataModelObjectPath().startingEntitySet;
    var pageManifestSettings = converterContext.getManifestWrapper();
    var isEntitySet = navigationPropertyPath.length === 0,
        p13nMode = getP13nMode(visualizationPath, converterContext, tableManifestConfiguration),
        id = isEntitySet && entitySet ? TableID(entitySet.name, "LineItem") : TableID(visualizationPath);
    var targetCapabilities = getCapabilityRestriction(converterContext);
    var selectionMode = getSelectionMode(lineItemAnnotation, visualizationPath, converterContext, isEntitySet, targetCapabilities);
    var threshold = isEntitySet ? 30 : 10;

    if (presentationVariantAnnotation === null || presentationVariantAnnotation === void 0 ? void 0 : presentationVariantAnnotation.MaxItems) {
      threshold = presentationVariantAnnotation.MaxItems.valueOf();
    }

    var navigationOrCollectionName = isEntitySet && entitySet ? entitySet.name : navigationPropertyPath;
    var navigationSettings = pageManifestSettings.getNavigationConfiguration(navigationOrCollectionName);

    var creationBehaviour = _getCreationBehaviour(lineItemAnnotation, tableManifestConfiguration, converterContext, navigationSettings);

    var isParentDeletable, parentEntitySetDeletable;

    if (converterContext.getTemplateType() === TemplateType.ObjectPage) {
      var _isParentDeletable;

      isParentDeletable = isPathDeletable(converterContext.getDataModelObjectPath(), undefined, true);

      if ((_isParentDeletable = isParentDeletable) === null || _isParentDeletable === void 0 ? void 0 : _isParentDeletable.currentEntityRestriction) {
        parentEntitySetDeletable = undefined;
      } else {
        parentEntitySetDeletable = isParentDeletable ? compileBinding(isParentDeletable, true) : isParentDeletable;
      }
    }

    var dataModelObjectPath = converterContext.getDataModelObjectPath();
    var isInsertable = isPathInsertable(dataModelObjectPath);
    return {
      id: id,
      entityName: entitySet ? entitySet.name : "",
      collection: getTargetObjectPath(converterContext.getDataModelObjectPath()),
      navigationPath: navigationPropertyPath,
      isEntitySet: isEntitySet,
      row: _getRowConfigurationProperty(lineItemAnnotation, visualizationPath, converterContext, navigationSettings, navigationOrCollectionName),
      p13nMode: p13nMode,
      show: {
        "delete": getDeleteVisible(converterContext, navigationPropertyPath, targetCapabilities.isDeletable),
        create: compileBinding(getCreateVisible(converterContext, creationBehaviour === null || creationBehaviour === void 0 ? void 0 : creationBehaviour.mode, isInsertable)),
        paste: compileBinding(getPasteEnabled(converterContext, creationBehaviour, isInsertable))
      },
      displayMode: isInDisplayMode(converterContext),
      create: creationBehaviour,
      selectionMode: selectionMode,
      autoBindOnInit: converterContext.getTemplateType() !== TemplateType.ListReport && converterContext.getTemplateType() !== TemplateType.AnalyticalListPage,
      enableControlVM: pageManifestSettings.getVariantManagement() === "Control" && !!p13nMode,
      threshold: threshold,
      sortConditions: getSortConditions(presentationVariantAnnotation, columns),
      parentEntityDeleteEnabled: parentEntitySetDeletable,
      title: title
    };
  }

  _exports.getTableAnnotationConfiguration = getTableAnnotationConfiguration;

  function isInDisplayMode(converterContext) {
    var templateType = converterContext.getTemplateType();

    if (templateType === TemplateType.AnalyticalListPage || templateType === TemplateType.ListReport) {
      return true;
    } // updatable will be handled at the property level


    return false;
  }
  /**
   * Split the visualization path into the navigation property path and annotation.
   *
   * @param visualizationPath
   * @returns {object}
   */


  function splitPath(visualizationPath) {
    var _visualizationPath$sp = visualizationPath.split("@"),
        _visualizationPath$sp2 = _slicedToArray(_visualizationPath$sp, 2),
        navigationPropertyPath = _visualizationPath$sp2[0],
        annotationPath = _visualizationPath$sp2[1];

    if (navigationPropertyPath.lastIndexOf("/") === navigationPropertyPath.length - 1) {
      // Drop trailing slash
      navigationPropertyPath = navigationPropertyPath.substr(0, navigationPropertyPath.length - 1);
    }

    return {
      navigationPropertyPath: navigationPropertyPath,
      annotationPath: annotationPath
    };
  }

  function getSelectionVariantConfiguration(selectionVariantPath, converterContext) {
    var resolvedTarget = converterContext.getEntityTypeAnnotation(selectionVariantPath);
    var selection = resolvedTarget.annotation;

    if (selection) {
      var _selection$SelectOpti, _selection$Text;

      var propertyNames = [];
      (_selection$SelectOpti = selection.SelectOptions) === null || _selection$SelectOpti === void 0 ? void 0 : _selection$SelectOpti.forEach(function (selectOption) {
        var propertyName = selectOption.PropertyName;
        var PropertyPath = propertyName.value;

        if (propertyNames.indexOf(PropertyPath) === -1) {
          propertyNames.push(PropertyPath);
        }
      });
      return {
        text: selection === null || selection === void 0 ? void 0 : (_selection$Text = selection.Text) === null || _selection$Text === void 0 ? void 0 : _selection$Text.toString(),
        propertyNames: propertyNames
      };
    }

    return undefined;
  }

  _exports.getSelectionVariantConfiguration = getSelectionVariantConfiguration;

  function getTableManifestConfiguration(lineItemAnnotation, visualizationPath, converterContext) {
    var isCondensedTableLayoutCompliant = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var tableManifestSettings = converterContext.getManifestControlConfiguration(visualizationPath);
    var tableSettings = tableManifestSettings.tableSettings;
    var quickSelectionVariant;
    var quickFilterPaths = [];
    var enableExport = true;
    var creationMode = CreationMode.NewPage;
    var filters;
    var createAtEnd = true;
    var disableAddRowButtonForEmptyData = false;
    var condensedTableLayout = false;
    var hideTableTitle = false;
    var tableType = "ResponsiveTable";
    var enableFullScreen = false;
    var selectionLimit = 200;
    var enablePaste = converterContext.getTemplateType() === "ObjectPage";
    var shellServices = converterContext.getShellServices();
    var userContentDensity = shellServices === null || shellServices === void 0 ? void 0 : shellServices.getContentDensity();
    var appContentDensity = converterContext.getManifestWrapper().getContentDensities();
    var entityType = converterContext.getEntityType();
    var aggregationHelper = new AggregationHelper(entityType, converterContext);

    if ((appContentDensity === null || appContentDensity === void 0 ? void 0 : appContentDensity.cozy) === true && (appContentDensity === null || appContentDensity === void 0 ? void 0 : appContentDensity.compact) !== true || userContentDensity === "cozy") {
      isCondensedTableLayoutCompliant = false;
    }

    if (tableSettings && lineItemAnnotation) {
      var _tableSettings$quickV, _tableSettings$quickV2, _tableSettings$creati, _tableSettings$creati2, _tableSettings$creati3, _tableSettings$creati4, _tableSettings$quickV4;

      var targetEntityType = converterContext.getAnnotationEntityType(lineItemAnnotation);
      tableSettings === null || tableSettings === void 0 ? void 0 : (_tableSettings$quickV = tableSettings.quickVariantSelection) === null || _tableSettings$quickV === void 0 ? void 0 : (_tableSettings$quickV2 = _tableSettings$quickV.paths) === null || _tableSettings$quickV2 === void 0 ? void 0 : _tableSettings$quickV2.forEach(function (path) {
        var _tableSettings$quickV3;

        quickSelectionVariant = targetEntityType.resolvePath("@" + path.annotationPath); // quickSelectionVariant = converterContext.getEntityTypeAnnotation(path.annotationPath);

        if (quickSelectionVariant) {
          quickFilterPaths.push({
            annotationPath: path.annotationPath
          });
        }

        filters = {
          quickFilters: {
            enabled: converterContext.getTemplateType() === TemplateType.ListReport ? "{= ${pageInternal>hasPendingFilters} !== true}" : true,
            showCounts: tableSettings === null || tableSettings === void 0 ? void 0 : (_tableSettings$quickV3 = tableSettings.quickVariantSelection) === null || _tableSettings$quickV3 === void 0 ? void 0 : _tableSettings$quickV3.showCounts,
            paths: quickFilterPaths
          }
        };
      });
      creationMode = ((_tableSettings$creati = tableSettings.creationMode) === null || _tableSettings$creati === void 0 ? void 0 : _tableSettings$creati.name) || creationMode;
      createAtEnd = ((_tableSettings$creati2 = tableSettings.creationMode) === null || _tableSettings$creati2 === void 0 ? void 0 : _tableSettings$creati2.createAtEnd) !== undefined ? (_tableSettings$creati3 = tableSettings.creationMode) === null || _tableSettings$creati3 === void 0 ? void 0 : _tableSettings$creati3.createAtEnd : true;
      disableAddRowButtonForEmptyData = !!((_tableSettings$creati4 = tableSettings.creationMode) === null || _tableSettings$creati4 === void 0 ? void 0 : _tableSettings$creati4.disableAddRowButtonForEmptyData);
      condensedTableLayout = tableSettings.condensedTableLayout !== undefined ? tableSettings.condensedTableLayout : false;
      hideTableTitle = !!((_tableSettings$quickV4 = tableSettings.quickVariantSelection) === null || _tableSettings$quickV4 === void 0 ? void 0 : _tableSettings$quickV4.hideTableTitle);
      tableType = (tableSettings === null || tableSettings === void 0 ? void 0 : tableSettings.type) || "ResponsiveTable";

      if (converterContext.getTemplateType() === "AnalyticalListPage") {
        if ((tableSettings === null || tableSettings === void 0 ? void 0 : tableSettings.type) === "AnalyticalTable" && !aggregationHelper.isAnalyticsSupported()) {
          tableType = "GridTable";
        }

        if (!(tableSettings === null || tableSettings === void 0 ? void 0 : tableSettings.type)) {
          if (converterContext.getManifestWrapper().isDesktop() && aggregationHelper.isAnalyticsSupported()) {
            tableType = "AnalyticalTable";
          } else {
            tableType = "ResponsiveTable";
          }
        }
      }

      enableFullScreen = tableSettings.enableFullScreen || false;

      if (enableFullScreen === true && converterContext.getTemplateType() === TemplateType.ListReport) {
        enableFullScreen = false;
        converterContext.getDiagnostics().addIssue(IssueCategory.Manifest, IssueSeverity.Low, IssueType.FULLSCREENMODE_NOT_ON_LISTREPORT);
      }

      selectionLimit = tableSettings.selectAll === true || tableSettings.selectionLimit === 0 ? 0 : tableSettings.selectionLimit || 200;
      enablePaste = converterContext.getTemplateType() === "ObjectPage" && tableSettings.enablePaste !== false;
      enableExport = tableSettings.enableExport !== undefined ? tableSettings.enableExport : converterContext.getTemplateType() !== "ObjectPage" || enablePaste;
    }

    return {
      filters: filters,
      type: tableType,
      enableFullScreen: enableFullScreen,
      headerVisible: !(quickSelectionVariant && hideTableTitle),
      enableExport: enableExport,
      creationMode: creationMode,
      createAtEnd: createAtEnd,
      disableAddRowButtonForEmptyData: disableAddRowButtonForEmptyData,
      useCondensedTableLayout: condensedTableLayout && isCondensedTableLayoutCompliant,
      selectionLimit: selectionLimit,
      enablePaste: enablePaste
    };
  }

  _exports.getTableManifestConfiguration = getTableManifestConfiguration;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRhYmxlLnRzIl0sIm5hbWVzIjpbIkNvbHVtblR5cGUiLCJnZXRUYWJsZUFjdGlvbnMiLCJsaW5lSXRlbUFubm90YXRpb24iLCJ2aXN1YWxpemF0aW9uUGF0aCIsImNvbnZlcnRlckNvbnRleHQiLCJuYXZpZ2F0aW9uU2V0dGluZ3MiLCJhVGFibGVBY3Rpb25zIiwiZ2V0VGFibGVBbm5vdGF0aW9uQWN0aW9ucyIsImFBbm5vdGF0aW9uQWN0aW9ucyIsInRhYmxlQWN0aW9ucyIsImFIaWRkZW5BY3Rpb25zIiwiaGlkZGVuVGFibGVBY3Rpb25zIiwiaW5zZXJ0Q3VzdG9tRWxlbWVudHMiLCJnZXRBY3Rpb25zRnJvbU1hbmlmZXN0IiwiZ2V0TWFuaWZlc3RDb250cm9sQ29uZmlndXJhdGlvbiIsImFjdGlvbnMiLCJpc05hdmlnYWJsZSIsImVuYWJsZU9uU2VsZWN0IiwiZW5hYmxlQXV0b1Njcm9sbCIsImVuYWJsZWQiLCJnZXRUYWJsZUNvbHVtbnMiLCJhbm5vdGF0aW9uQ29sdW1ucyIsImdldENvbHVtbnNGcm9tQW5ub3RhdGlvbnMiLCJtYW5pZmVzdENvbHVtbnMiLCJnZXRDb2x1bW5zRnJvbU1hbmlmZXN0IiwiY29sdW1ucyIsImdldEFubm90YXRpb25FbnRpdHlUeXBlIiwid2lkdGgiLCJhdmFpbGFiaWxpdHkiLCJzZXR0aW5ncyIsImhvcml6b250YWxBbGlnbiIsImZvcm1hdE9wdGlvbnMiLCJnZXRBZ2dyZWdhdGVEZWZpbml0aW9uc0Zyb21FbnRpdHlUeXBlIiwiZW50aXR5VHlwZSIsInRhYmxlQ29sdW1ucyIsImFnZ3JlZ2F0aW9uSGVscGVyIiwiQWdncmVnYXRpb25IZWxwZXIiLCJmaW5kQ29sdW1uRnJvbVBhdGgiLCJwYXRoIiwiZmluZCIsImNvbHVtbiIsImFubm90YXRpb25Db2x1bW4iLCJwcm9wZXJ0eUluZm9zIiwidW5kZWZpbmVkIiwicmVsYXRpdmVQYXRoIiwiaXNBbmFseXRpY3NTdXBwb3J0ZWQiLCJtQ3VycmVuY3lPclVuaXRQcm9wZXJ0aWVzIiwiU2V0IiwiZm9yRWFjaCIsIm9Db2x1bW4iLCJvVGFibGVDb2x1bW4iLCJ1bml0IiwiYWRkIiwibVJhd0RlZmluaXRpb25zIiwiZ2V0Q3VzdG9tQWdncmVnYXRlRGVmaW5pdGlvbnMiLCJtUmVzdWx0IiwiYVJhd0NvbnRleHREZWZpbmluZ1Byb3BlcnRpZXMiLCJoYXMiLCJuYW1lIiwiZGVmYXVsdEFnZ3JlZ2F0ZSIsImFDb250ZXh0RGVmaW5pbmdQcm9wZXJ0aWVzIiwiY29udGV4dERlZmluaW5nUHJvcGVydHlOYW1lIiwicHVzaCIsImxlbmd0aCIsImNvbnRleHREZWZpbmluZ1Byb3BlcnRpZXMiLCJ1cGRhdGVUYWJsZVZpc3VhbGl6YXRpb25Gb3JBbmFseXRpY3MiLCJ0YWJsZVZpc3VhbGl6YXRpb24iLCJwcmVzZW50YXRpb25WYXJpYW50QW5ub3RhdGlvbiIsImNvbnRyb2wiLCJ0eXBlIiwiYWdncmVnYXRlc0RlZmluaXRpb25zIiwiZW5hYmxlQW5hbHl0aWNzIiwiYWdncmVnYXRlcyIsImFubm90YXRpb24iLCJncm91cENvbmRpdGlvbnMiLCJnZXRHcm91cENvbmRpdGlvbnMiLCJhZ2dyZWdhdGVDb25kaXRpb25zIiwiZ2V0QWdncmVnYXRlQ29uZGl0aW9ucyIsInVwZGF0ZVVuaXRQcm9wZXJ0aWVzIiwib1Byb3BlcnR5IiwiZW50aXR5UHJvcGVydGllcyIsIm9Qcm9wIiwic1VuaXQiLCJnZXRBc3NvY2lhdGVkQ3VycmVuY3lQcm9wZXJ0eSIsImdldEFzc29jaWF0ZWRVbml0UHJvcGVydHkiLCJvVW5pdENvbHVtbiIsImNyZWF0ZVRhYmxlVmlzdWFsaXphdGlvbiIsImlzQ29uZGVuc2VkVGFibGVMYXlvdXRDb21wbGlhbnQiLCJ0YWJsZU1hbmlmZXN0Q29uZmlnIiwiZ2V0VGFibGVNYW5pZmVzdENvbmZpZ3VyYXRpb24iLCJzcGxpdFBhdGgiLCJuYXZpZ2F0aW9uUHJvcGVydHlQYXRoIiwiZGF0YU1vZGVsUGF0aCIsImdldERhdGFNb2RlbE9iamVjdFBhdGgiLCJlbnRpdHlOYW1lIiwidGFyZ2V0RW50aXR5U2V0Iiwic3RhcnRpbmdFbnRpdHlTZXQiLCJpc0VudGl0eVNldCIsIm5hdmlnYXRpb25PckNvbGxlY3Rpb25OYW1lIiwiZ2V0TWFuaWZlc3RXcmFwcGVyIiwiZ2V0TmF2aWdhdGlvbkNvbmZpZ3VyYXRpb24iLCJvVmlzdWFsaXphdGlvbiIsIlZpc3VhbGl6YXRpb25UeXBlIiwiVGFibGUiLCJnZXRUYWJsZUFubm90YXRpb25Db25maWd1cmF0aW9uIiwicmVtb3ZlRHVwbGljYXRlQWN0aW9ucyIsImNyZWF0ZURlZmF1bHRUYWJsZVZpc3VhbGl6YXRpb24iLCJnZXRDb2x1bW5zRnJvbUVudGl0eVR5cGUiLCJnZXRFbnRpdHlUeXBlIiwiZ2V0VUlIaWRkZW5FeHBGb3JBY3Rpb25zUmVxdWlyaW5nQ29udGV4dCIsImNvbnRleHREYXRhTW9kZWxPYmplY3RQYXRoIiwiYVVpSGlkZGVuUGF0aEV4cHJlc3Npb25zIiwiZGF0YUZpZWxkIiwiJFR5cGUiLCJBY3Rpb25UYXJnZXQiLCJpc0JvdW5kIiwiUmVxdWlyZXNDb250ZXh0IiwiSW5saW5lIiwidmFsdWVPZiIsImFubm90YXRpb25zIiwiVUkiLCJIaWRkZW4iLCJlcXVhbCIsImdldEJpbmRpbmdFeHBGcm9tQ29udGV4dCIsInNvdXJjZSIsInNFeHByZXNzaW9uIiwidmlzaWJsZSIsInNQYXRoIiwic3Vic3RyaW5nIiwiaW5kZXhPZiIsImFTcGxpdFBhdGgiLCJzcGxpdCIsInNOYXZpZ2F0aW9uUGF0aCIsInRhcmdldE9iamVjdCIsIl90eXBlIiwicGFydG5lciIsImJpbmRpbmdFeHByZXNzaW9uIiwic2xpY2UiLCJqb2luIiwiY29uc3RhbnQiLCJoYXNCb3VuZEFjdGlvbnNBbHdheXNWaXNpYmxlSW5Ub29sQmFyIiwic29tZSIsImhhc0N1c3RvbUFjdGlvbnNBbHdheXNWaXNpYmxlSW5Ub29sQmFyIiwibWFuaWZlc3RBY3Rpb25zIiwiT2JqZWN0Iiwia2V5cyIsImFjdGlvbktleSIsImFjdGlvbiIsInJlcXVpcmVzU2VsZWN0aW9uIiwidG9TdHJpbmciLCJnZXRWaXNpYmxlRXhwRm9yQ3VzdG9tQWN0aW9uc1JlcXVpcmluZ0NvbnRleHQiLCJhVmlzaWJsZVBhdGhFeHByZXNzaW9ucyIsInJlc29sdmVCaW5kaW5nU3RyaW5nIiwiZ2V0Q2FwYWJpbGl0eVJlc3RyaWN0aW9uIiwiaXNEZWxldGFibGUiLCJpc1BhdGhEZWxldGFibGUiLCJpc1VwZGF0YWJsZSIsImlzUGF0aFVwZGF0YWJsZSIsImlzQ29uc3RhbnQiLCJ2YWx1ZSIsImdldFNlbGVjdGlvbk1vZGUiLCJ0YXJnZXRDYXBhYmlsaXRpZXMiLCJTZWxlY3Rpb25Nb2RlIiwiTm9uZSIsInRhYmxlTWFuaWZlc3RTZXR0aW5ncyIsInNlbGVjdGlvbk1vZGUiLCJ0YWJsZVNldHRpbmdzIiwiYUhpZGRlbkJpbmRpbmdFeHByZXNzaW9ucyIsImFWaXNpYmxlQmluZGluZ0V4cHJlc3Npb25zIiwiaXNQYXJlbnREZWxldGFibGUiLCJwYXJlbnRFbnRpdHlTZXREZWxldGFibGUiLCJnZXRUZW1wbGF0ZVR5cGUiLCJUZW1wbGF0ZVR5cGUiLCJPYmplY3RQYWdlIiwiY29tcGlsZUJpbmRpbmciLCJNdWx0aSIsImlmRWxzZSIsIkF1dG8iLCJvciIsImNvbmNhdCIsInRhYmxlQWN0aW9uIiwiaXNEYXRhRmllbGRGb3JBY3Rpb25BYnN0cmFjdCIsIkRldGVybWluaW5nIiwia2V5IiwiS2V5SGVscGVyIiwiZ2VuZXJhdGVLZXlGcm9tRGF0YUZpZWxkIiwiQWN0aW9uVHlwZSIsIkRhdGFGaWVsZEZvckFjdGlvbiIsImFubm90YXRpb25QYXRoIiwiZ2V0RW50aXR5U2V0QmFzZWRBbm5vdGF0aW9uUGF0aCIsImZ1bGx5UXVhbGlmaWVkTmFtZSIsIm5vdCIsImFubm90YXRpb25FeHByZXNzaW9uIiwiRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uIiwiRGVmYXVsdCIsImdldENyaXRpY2FsaXR5QmluZGluZ0J5RW51bSIsIkNyaXRpY2FsaXR5RW51bSIsImNyaXRpY2FsaXR5UHJvcGVydHkiLCJNZXNzYWdlVHlwZSIsIkVycm9yIiwiV2FybmluZyIsIlN1Y2Nlc3MiLCJJbmZvcm1hdGlvbiIsImdldEhpZ2hsaWdodFJvd0JpbmRpbmciLCJjcml0aWNhbGl0eUFubm90YXRpb24iLCJpc0RyYWZ0Um9vdCIsImRlZmF1bHRIaWdobGlnaHRSb3dEZWZpbml0aW9uIiwiRHJhZnQiLCJJc05ld09iamVjdCIsImZvcm1hdFJlc3VsdCIsInRhYmxlRm9ybWF0dGVycyIsInJvd0hpZ2hsaWdodGluZyIsIl9nZXRDcmVhdGlvbkJlaGF2aW91ciIsInRhYmxlTWFuaWZlc3RDb25maWd1cmF0aW9uIiwibmF2aWdhdGlvbiIsImNyZWF0ZSIsImRldGFpbCIsIm91dGJvdW5kIiwib3V0Ym91bmREZXRhaWwiLCJtb2RlIiwibmV3QWN0aW9uIiwidGFyZ2V0RW50aXR5VHlwZSIsInRhcmdldEFubm90YXRpb25zIiwiZ2V0RW50aXR5U2V0Rm9yRW50aXR5VHlwZSIsIkNvbW1vbiIsIkRyYWZ0Um9vdCIsIk5ld0FjdGlvbiIsIlNlc3Npb24iLCJTdGlja3lTZXNzaW9uU3VwcG9ydGVkIiwiY3JlYXRpb25Nb2RlIiwiQ3JlYXRpb25Nb2RlIiwiQ3JlYXRpb25Sb3ciLCJyb3V0ZSIsImFwcGVuZCIsImNyZWF0ZUF0RW5kIiwibmF2aWdhdGVUb1RhcmdldCIsIk5ld1BhZ2UiLCJfZ2V0Um93Q29uZmlndXJhdGlvblByb3BlcnR5IiwidGFyZ2V0UGF0aCIsInByZXNzUHJvcGVydHkiLCJuYXZpZ2F0aW9uVGFyZ2V0IiwiZGlzcGxheSIsInRhcmdldCIsIkNyaXRpY2FsaXR5IiwiRHJhZnROb2RlIiwicm93TmF2aWdhdGVkRXhwcmVzc2lvbiIsIm5hdmlnYXRlZFJvdyIsInByZXNzIiwicm93TmF2aWdhdGVkIiwiY29sdW1uc1RvQmVDcmVhdGVkIiwibm9uU29ydGFibGVDb2x1bW5zIiwicHJvcGVydHkiLCJleGlzdHMiLCJ0YXJnZXRUeXBlIiwiZGVzY3JpcHRpb24iLCJoYXNPd25Qcm9wZXJ0eSIsImZpZWxkR3JvdXAiLCJyZWxhdGVkUHJvcGVydGllc0luZm8iLCJjb2xsZWN0UmVsYXRlZFByb3BlcnRpZXMiLCJyZWxhdGVkUHJvcGVydHlOYW1lcyIsInByb3BlcnRpZXMiLCJjb2x1bW5JbmZvIiwiZ2V0Q29sdW1uRGVmaW5pdGlvbkZyb21Qcm9wZXJ0eSIsImV4cG9ydFNldHRpbmdzIiwidGVtcGxhdGUiLCJleHBvcnRTZXR0aW5nc1RlbXBsYXRlIiwiZnVsbFByb3BlcnR5UGF0aCIsInVzZURhdGFGaWVsZFByZWZpeCIsImF2YWlsYWJsZUZvckFkYXB0YXRpb24iLCJkZXNjcmlwdGlvblByb3BlcnR5IiwicmVwbGFjZVNwZWNpYWxDaGFycyIsInNlbWFudGljT2JqZWN0QW5ub3RhdGlvblBhdGgiLCJnZXRTZW1hbnRpY09iamVjdFBhdGgiLCJpc0hpZGRlbiIsImdyb3VwUGF0aCIsIl9zbGljZUF0U2xhc2giLCJpc0dyb3VwIiwic0xhYmVsIiwiX2dldExhYmVsIiwiZXhwb3J0TGFiZWxzIiwiX2dldEV4cG9ydExhYmVsIiwiaXNHcm91cGFibGUiLCJpc1Byb3BlcnR5R3JvdXBhYmxlIiwiQW5ub3RhdGlvbiIsImxhYmVsIiwiZ3JvdXBMYWJlbCIsImdyb3VwIiwic2VtYW50aWNPYmplY3RQYXRoIiwiQXZhaWxhYmlsaXR5VHlwZSIsIkFkYXB0YXRpb24iLCJzb3J0YWJsZSIsImxhYmVscyIsImlzS2V5IiwiX2lzVmFsaWRDb2x1bW4iLCJpc1Byb3BlcnR5IiwiZGF0YUZpZWxkRGVmYXVsdCIsIkRhdGFGaWVsZERlZmF1bHQiLCJxdWFsaWZpZXIiLCJMYWJlbCIsImlzRGF0YUZpZWxkVHlwZXMiLCJWYWx1ZSIsIiR0YXJnZXQiLCJUYXJnZXQiLCJjb2x1bW5OYW1lIiwiZGVzY3JpcHRpb25MYWJlbCIsImZpZWxkR3JvdXBMYWJlbCIsImZpbHRlciIsImluZGV4IiwiX2NyZWF0ZVJlbGF0ZWRDb2x1bW5zIiwiZXhpc3RpbmdDb2x1bW5zIiwicmVsYXRlZENvbHVtbnMiLCJyZWxhdGVkUHJvcGVydHlOYW1lTWFwIiwiZ2V0QWJzb2x1dGVBbm5vdGF0aW9uUGF0aCIsInJlbGF0ZWRDb2x1bW4iLCJuZXdOYW1lIiwibWFwIiwicHJvcGVydHlJbmZvIiwiX2dldEFubm90YXRpb25Db2x1bW5OYW1lIiwiX2dldFJlbGF0aXZlUGF0aCIsImlzTGFzdFNsYXNoIiwiaXNMYXN0UGFydCIsImlTbGFzaEluZGV4IiwibGFzdEluZGV4T2YiLCJfaXNDb2x1bW5Tb3J0YWJsZSIsInByb3BlcnR5UGF0aCIsImlzU29ydGFibGUiLCJnZXRFbnRpdHlTZXQiLCJDYXBhYmlsaXRpZXMiLCJTb3J0UmVzdHJpY3Rpb25zIiwiTm9uU29ydGFibGVQcm9wZXJ0aWVzIiwibGluZUl0ZW0iLCJjb2xsZWN0UmVsYXRlZFByb3BlcnRpZXNSZWN1cnNpdmVseSIsImlzRGF0YUZpZWxkQWx3YXlzSGlkZGVuIiwiSFRNTDUiLCJDc3NEZWZhdWx0cyIsInRleHRMaW5lc0Rpc3BsYXkiLCJ0ZXh0TGluZXNFZGl0IiwiX2dldFByb3BlcnR5TmFtZXMiLCJtYXRjaGVkUHJvcGVydGllcyIsInJlc29sdmVQYXRoIiwiX2dldE1hbmlmZXN0T3JEZWZhdWx0VmFsdWUiLCJkZWZhdWx0VmFsdWUiLCJpc0Fubm90YXRpb25Db2x1bW4iLCJpbnRlcm5hbENvbHVtbnMiLCJtYW5pZmVzdENvbHVtbiIsInZhbGlkYXRlS2V5IiwiaWQiLCJoZWFkZXIiLCJIb3Jpem9udGFsQWxpZ24iLCJCZWdpbiIsInBvc2l0aW9uIiwiYW5jaG9yIiwicGxhY2VtZW50IiwiUGxhY2VtZW50IiwiQWZ0ZXIiLCJpc0FjdGlvbk5hdmlnYWJsZSIsImdldFAxM25Nb2RlIiwibWFuaWZlc3RXcmFwcGVyIiwidmFyaWFudE1hbmFnZW1lbnQiLCJnZXRWYXJpYW50TWFuYWdlbWVudCIsImhhc1ZhcmlhbnRNYW5hZ2VtZW50IiwiYVBlcnNvbmFsaXphdGlvbiIsImJBbmFseXRpY2FsVGFibGUiLCJwZXJzb25hbGl6YXRpb24iLCJzb3J0IiwiYWdncmVnYXRlIiwiVmFyaWFudE1hbmFnZW1lbnRUeXBlIiwiQ29udHJvbCIsImdldERlbGV0ZUhpZGRlbiIsImN1cnJlbnRFbnRpdHlTZXQiLCJuYXZpZ2F0aW9uUGF0aCIsImlzRGVsZXRlSGlkZGVuIiwiZGVsZXRlSGlkZGVuQW5ub3RhdGlvbiIsIm5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmciLCJEZWxldGVIaWRkZW4iLCJhU3BsaXRIaWRkZW5QYXRoIiwicGFydG5lck5hbWUiLCJuYXZpZ2F0aW9uUHJvcGVydGllcyIsIm5hdlByb3BlcnR5IiwiZ2V0RGVsZXRlVmlzaWJsZSIsImlzVGFyZ2V0RGVsZXRhYmxlIiwiQW5hbHl0aWNhbExpc3RQYWdlIiwiTGlzdFJlcG9ydCIsImdldENyZWF0ZVZpc2libGUiLCJpc0luc2VydGFibGUiLCJkYXRhTW9kZWxPYmplY3RQYXRoIiwiaXNDcmVhdGVIaWRkZW4iLCJDcmVhdGVIaWRkZW4iLCJuYXZQcm9wIiwibmV3QWN0aW9uTmFtZSIsInNob3dDcmVhdGVGb3JOZXdBY3Rpb24iLCJDb3JlIiwiT3BlcmF0aW9uQXZhaWxhYmxlIiwiYW5kIiwiSXNFZGl0YWJsZSIsImdldFBhc3RlRW5hYmxlZCIsImNyZWF0aW9uQmVoYXZpb3VyIiwiZ2V0U29ydENvbmRpdGlvbnMiLCJzb3J0Q29uZGl0aW9ucyIsIlNvcnRPcmRlciIsInNvcnRlcnMiLCJjb25kaXRpb25zIiwiY29uZGl0aW9uIiwicHJvcGVydHlOYW1lIiwiUHJvcGVydHkiLCJzb3J0Q29sdW1uIiwicmVsYXRlZFByb3BlcnR5TmFtZSIsImRlc2NlbmRpbmciLCJEZXNjZW5kaW5nIiwiSlNPTiIsInN0cmluZ2lmeSIsImNvbnZlcnRQcm9wZXJ0eVBhdGhzVG9JbmZvTmFtZXMiLCJwYXRocyIsImluZm9OYW1lcyIsImN1cnJlbnRQYXRoIiwiR3JvdXBCeSIsImFHcm91cEJ5IiwiYUdyb3VwTGV2ZWxzIiwiaW5mb05hbWUiLCJncm91cExldmVscyIsIlRvdGFsIiwiYVRvdGFscyIsInRpdGxlIiwiSGVhZGVySW5mbyIsIlR5cGVOYW1lUGx1cmFsIiwiZW50aXR5U2V0IiwicGFnZU1hbmlmZXN0U2V0dGluZ3MiLCJwMTNuTW9kZSIsIlRhYmxlSUQiLCJ0aHJlc2hvbGQiLCJNYXhJdGVtcyIsImN1cnJlbnRFbnRpdHlSZXN0cmljdGlvbiIsImlzUGF0aEluc2VydGFibGUiLCJjb2xsZWN0aW9uIiwiZ2V0VGFyZ2V0T2JqZWN0UGF0aCIsInJvdyIsInNob3ciLCJwYXN0ZSIsImRpc3BsYXlNb2RlIiwiaXNJbkRpc3BsYXlNb2RlIiwiYXV0b0JpbmRPbkluaXQiLCJlbmFibGVDb250cm9sVk0iLCJwYXJlbnRFbnRpdHlEZWxldGVFbmFibGVkIiwidGVtcGxhdGVUeXBlIiwic3Vic3RyIiwiZ2V0U2VsZWN0aW9uVmFyaWFudENvbmZpZ3VyYXRpb24iLCJzZWxlY3Rpb25WYXJpYW50UGF0aCIsInJlc29sdmVkVGFyZ2V0IiwiZ2V0RW50aXR5VHlwZUFubm90YXRpb24iLCJzZWxlY3Rpb24iLCJwcm9wZXJ0eU5hbWVzIiwiU2VsZWN0T3B0aW9ucyIsInNlbGVjdE9wdGlvbiIsIlByb3BlcnR5TmFtZSIsIlByb3BlcnR5UGF0aCIsInRleHQiLCJUZXh0IiwicXVpY2tTZWxlY3Rpb25WYXJpYW50IiwicXVpY2tGaWx0ZXJQYXRocyIsImVuYWJsZUV4cG9ydCIsImZpbHRlcnMiLCJkaXNhYmxlQWRkUm93QnV0dG9uRm9yRW1wdHlEYXRhIiwiY29uZGVuc2VkVGFibGVMYXlvdXQiLCJoaWRlVGFibGVUaXRsZSIsInRhYmxlVHlwZSIsImVuYWJsZUZ1bGxTY3JlZW4iLCJzZWxlY3Rpb25MaW1pdCIsImVuYWJsZVBhc3RlIiwic2hlbGxTZXJ2aWNlcyIsImdldFNoZWxsU2VydmljZXMiLCJ1c2VyQ29udGVudERlbnNpdHkiLCJnZXRDb250ZW50RGVuc2l0eSIsImFwcENvbnRlbnREZW5zaXR5IiwiZ2V0Q29udGVudERlbnNpdGllcyIsImNvenkiLCJjb21wYWN0IiwicXVpY2tWYXJpYW50U2VsZWN0aW9uIiwicXVpY2tGaWx0ZXJzIiwic2hvd0NvdW50cyIsImlzRGVza3RvcCIsImdldERpYWdub3N0aWNzIiwiYWRkSXNzdWUiLCJJc3N1ZUNhdGVnb3J5IiwiTWFuaWZlc3QiLCJJc3N1ZVNldmVyaXR5IiwiTG93IiwiSXNzdWVUeXBlIiwiRlVMTFNDUkVFTk1PREVfTk9UX09OX0xJU1RSRVBPUlQiLCJzZWxlY3RBbGwiLCJoZWFkZXJWaXNpYmxlIiwidXNlQ29uZGVuc2VkVGFibGVMYXlvdXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFxTEtBLFU7O2FBQUFBLFU7QUFBQUEsSUFBQUEsVTtBQUFBQSxJQUFBQSxVO0tBQUFBLFUsS0FBQUEsVTs7QUFrRUw7Ozs7Ozs7OztBQVNPLFdBQVNDLGVBQVQsQ0FDTkMsa0JBRE0sRUFFTkMsaUJBRk0sRUFHTkMsZ0JBSE0sRUFJTkMsa0JBSk0sRUFLUztBQUNmLFFBQU1DLGFBQWEsR0FBR0MseUJBQXlCLENBQUNMLGtCQUFELEVBQXFCQyxpQkFBckIsRUFBd0NDLGdCQUF4QyxDQUEvQztBQUNBLFFBQU1JLGtCQUFrQixHQUFHRixhQUFhLENBQUNHLFlBQXpDO0FBQ0EsUUFBTUMsY0FBYyxHQUFHSixhQUFhLENBQUNLLGtCQUFyQztBQUNBLFdBQU9DLG9CQUFvQixDQUMxQkosa0JBRDBCLEVBRTFCSyxzQkFBc0IsQ0FDckJULGdCQUFnQixDQUFDVSwrQkFBakIsQ0FBaURYLGlCQUFqRCxFQUFvRVksT0FEL0MsRUFFckJYLGdCQUZxQixFQUdyQkksa0JBSHFCLEVBSXJCSCxrQkFKcUIsRUFLckIsSUFMcUIsRUFNckJLLGNBTnFCLENBRkksRUFVMUI7QUFBRU0sTUFBQUEsV0FBVyxFQUFFLFdBQWY7QUFBNEJDLE1BQUFBLGNBQWMsRUFBRSxXQUE1QztBQUF5REMsTUFBQUEsZ0JBQWdCLEVBQUUsV0FBM0U7QUFBd0ZDLE1BQUFBLE9BQU8sRUFBRTtBQUFqRyxLQVYwQixDQUEzQjtBQVlBO0FBRUQ7Ozs7Ozs7Ozs7Ozs7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QXZDLElBQXVEd1MsV0FIM0Q7QUFJQTs7QUFDRCxXQUFPO0FBQ05QLE1BQUFBLE9BQU8sRUFBRUEsT0FESDtBQUVOdlksTUFBQUEsSUFBSSxFQUFFMlksU0FGQTtBQUdOQyxNQUFBQSxnQkFBZ0IsRUFBRUEsZ0JBSFo7QUFJTndCLE1BQUFBLGFBQWEsRUFBRSxFQUFFaEMscUJBQXFCLElBQUlNLGNBQTNCLENBSlQ7QUFLTkosTUFBQUEsWUFBWSxFQUFFQSxZQUxSO0FBTU50TyxNQUFBQSxZQUFZLEVBQUVBLFlBTlI7QUFPTkssTUFBQUEsV0FBVyxFQUFFQSxXQVBQO0FBUU5tTyxNQUFBQSwrQkFBK0IsRUFBRUEsK0JBUjNCO0FBU042QixNQUFBQSx1QkFBdUIsRUFBRTVCLG9CQUFvQixJQUFJdlgsK0JBVDNDO0FBVU4yWCxNQUFBQSxjQUFjLEVBQUVBLGNBVlY7QUFXTkMsTUFBQUEsV0FBVyxFQUFFQTtBQVhQLEtBQVA7QUFhQSIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcblx0Q3JpdGljYWxpdHlUeXBlLFxuXHREYXRhRmllbGQsXG5cdERhdGFGaWVsZEFic3RyYWN0VHlwZXMsXG5cdERhdGFGaWVsZEZvckFubm90YXRpb24sXG5cdERhdGFGaWVsZEZvckFjdGlvbixcblx0RGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uLFxuXHRFbnVtVmFsdWUsXG5cdExpbmVJdGVtLFxuXHRQYXRoQW5ub3RhdGlvbkV4cHJlc3Npb24sXG5cdFByZXNlbnRhdGlvblZhcmlhbnRUeXBlVHlwZXMsXG5cdFByb3BlcnR5QW5ub3RhdGlvblZhbHVlLFxuXHRQcm9wZXJ0eVBhdGgsXG5cdFNlbGVjdGlvblZhcmlhbnRUeXBlLFxuXHRTZWxlY3RPcHRpb25UeXBlLFxuXHRVSUFubm90YXRpb25UeXBlc1xufSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXNcIjtcbmltcG9ydCB7XG5cdEFjdGlvblR5cGUsXG5cdEF2YWlsYWJpbGl0eVR5cGUsXG5cdENyZWF0aW9uTW9kZSxcblx0Rm9ybWF0T3B0aW9uc1R5cGUsXG5cdEhvcml6b250YWxBbGlnbixcblx0TWFuaWZlc3RUYWJsZUNvbHVtbixcblx0TWFuaWZlc3RXcmFwcGVyLFxuXHROYXZpZ2F0aW9uU2V0dGluZ3NDb25maWd1cmF0aW9uLFxuXHROYXZpZ2F0aW9uVGFyZ2V0Q29uZmlndXJhdGlvbixcblx0U2VsZWN0aW9uTW9kZSxcblx0VGFibGVDb2x1bW5TZXR0aW5ncyxcblx0VGFibGVNYW5pZmVzdENvbmZpZ3VyYXRpb24sXG5cdFZhcmlhbnRNYW5hZ2VtZW50VHlwZSxcblx0VmlzdWFsaXphdGlvblR5cGVcbn0gZnJvbSBcIi4uLy4uL01hbmlmZXN0U2V0dGluZ3NcIjtcbmltcG9ydCB7IEVudGl0eVNldCwgRW50aXR5VHlwZSwgUHJvcGVydHkgfSBmcm9tIFwiQHNhcC11eC9hbm5vdGF0aW9uLWNvbnZlcnRlclwiO1xuaW1wb3J0IHsgQ29udmVydGVyQ29udGV4dCwgVGVtcGxhdGVUeXBlIH0gZnJvbSBcIi4uLy4uL3RlbXBsYXRlcy9CYXNlQ29udmVydGVyXCI7XG5pbXBvcnQgeyBUYWJsZUlEIH0gZnJvbSBcIi4uLy4uL2hlbHBlcnMvSURcIjtcbmltcG9ydCB7XG5cdEFubm90YXRpb25BY3Rpb24sXG5cdEJhc2VBY3Rpb24sXG5cdEN1c3RvbUFjdGlvbixcblx0Z2V0QWN0aW9uc0Zyb21NYW5pZmVzdCxcblx0aXNBY3Rpb25OYXZpZ2FibGUsXG5cdHJlbW92ZUR1cGxpY2F0ZUFjdGlvbnNcbn0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvY29udHJvbHMvQ29tbW9uL0FjdGlvblwiO1xuaW1wb3J0IHsgQ29uZmlndXJhYmxlT2JqZWN0LCBDdXN0b21FbGVtZW50LCBpbnNlcnRDdXN0b21FbGVtZW50cywgUGxhY2VtZW50IH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvaGVscGVycy9Db25maWd1cmFibGVPYmplY3RcIjtcbmltcG9ydCB7XG5cdGNvbGxlY3RSZWxhdGVkUHJvcGVydGllc1JlY3Vyc2l2ZWx5LFxuXHRDb21wbGV4UHJvcGVydHlJbmZvLFxuXHRpc0RhdGFGaWVsZEFsd2F5c0hpZGRlbixcblx0aXNEYXRhRmllbGRGb3JBY3Rpb25BYnN0cmFjdCxcblx0aXNEYXRhRmllbGRUeXBlcyxcblx0Z2V0U2VtYW50aWNPYmplY3RQYXRoLFxuXHRjb2xsZWN0UmVsYXRlZFByb3BlcnRpZXMsXG5cdENvbGxlY3RlZFByb3BlcnRpZXNcbn0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvYW5ub3RhdGlvbnMvRGF0YUZpZWxkXCI7XG5pbXBvcnQge1xuXHRhbmQsXG5cdGFubm90YXRpb25FeHByZXNzaW9uLFxuXHRCaW5kaW5nRXhwcmVzc2lvbixcblx0YmluZGluZ0V4cHJlc3Npb24sXG5cdGNvbXBpbGVCaW5kaW5nLFxuXHRjb25zdGFudCxcblx0ZXF1YWwsXG5cdEV4cHJlc3Npb24sXG5cdEV4cHJlc3Npb25PclByaW1pdGl2ZSxcblx0Zm9ybWF0UmVzdWx0LFxuXHRpZkVsc2UsXG5cdGlzQ29uc3RhbnQsXG5cdG5vdCxcblx0b3IsXG5cdHJlc29sdmVCaW5kaW5nU3RyaW5nXG59IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0JpbmRpbmdFeHByZXNzaW9uXCI7XG5pbXBvcnQgeyBEcmFmdCwgVUkgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9oZWxwZXJzL0JpbmRpbmdIZWxwZXJcIjtcbmltcG9ydCB7IEtleUhlbHBlciB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvS2V5XCI7XG5pbXBvcnQgdGFibGVGb3JtYXR0ZXJzIGZyb20gXCJzYXAvZmUvY29yZS9mb3JtYXR0ZXJzL1RhYmxlRm9ybWF0dGVyXCI7XG5pbXBvcnQgeyBNZXNzYWdlVHlwZSB9IGZyb20gXCJzYXAvZmUvY29yZS9mb3JtYXR0ZXJzL1RhYmxlRm9ybWF0dGVyVHlwZXNcIjtcbmltcG9ydCB7XG5cdERhdGFNb2RlbE9iamVjdFBhdGgsXG5cdGdldFRhcmdldE9iamVjdFBhdGgsXG5cdGlzUGF0aERlbGV0YWJsZSxcblx0aXNQYXRoSW5zZXJ0YWJsZSxcblx0aXNQYXRoVXBkYXRhYmxlXG59IGZyb20gXCJzYXAvZmUvY29yZS90ZW1wbGF0aW5nL0RhdGFNb2RlbFBhdGhIZWxwZXJcIjtcbmltcG9ydCB7IHJlcGxhY2VTcGVjaWFsQ2hhcnMgfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9TdGFibGVJZEhlbHBlclwiO1xuaW1wb3J0IHsgSXNzdWVDYXRlZ29yeSwgSXNzdWVTZXZlcml0eSwgSXNzdWVUeXBlIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvaGVscGVycy9Jc3N1ZU1hbmFnZXJcIjtcbmltcG9ydCAqIGFzIEVkbSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXMvZGlzdC9FZG1cIjtcbmltcG9ydCB7IGlzUHJvcGVydHksIGdldEFzc29jaWF0ZWRVbml0UHJvcGVydHksIGdldEFzc29jaWF0ZWRDdXJyZW5jeVByb3BlcnR5IH0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvUHJvcGVydHlIZWxwZXJcIjtcblxuaW1wb3J0IHsgQWdncmVnYXRpb25IZWxwZXIgfSBmcm9tIFwiLi4vLi4vaGVscGVycy9BZ2dyZWdhdGlvblwiO1xuXG5leHBvcnQgdHlwZSBUYWJsZUFubm90YXRpb25Db25maWd1cmF0aW9uID0ge1xuXHRhdXRvQmluZE9uSW5pdDogYm9vbGVhbjtcblx0Y29sbGVjdGlvbjogc3RyaW5nO1xuXHRlbmFibGVDb250cm9sVk0/OiBib29sZWFuO1xuXHRmaWx0ZXJJZD86IHN0cmluZztcblx0aWQ6IHN0cmluZztcblx0aXNFbnRpdHlTZXQ6IGJvb2xlYW47XG5cdG5hdmlnYXRpb25QYXRoOiBzdHJpbmc7XG5cdHAxM25Nb2RlPzogc3RyaW5nO1xuXHRyb3c/OiB7XG5cdFx0YWN0aW9uPzogc3RyaW5nO1xuXHRcdHByZXNzPzogc3RyaW5nO1xuXHRcdHJvd0hpZ2hsaWdodGluZzogQmluZGluZ0V4cHJlc3Npb248TWVzc2FnZVR5cGU+O1xuXHRcdHJvd05hdmlnYXRlZDogQmluZGluZ0V4cHJlc3Npb248Ym9vbGVhbj47XG5cdH07XG5cdHNlbGVjdGlvbk1vZGU6IHN0cmluZyB8IHVuZGVmaW5lZDtcblx0c2hvdz86IHtcblx0XHRjcmVhdGU/OiBzdHJpbmcgfCBib29sZWFuO1xuXHRcdGRlbGV0ZT86IHN0cmluZyB8IGJvb2xlYW47XG5cdFx0cGFzdGU/OiBCaW5kaW5nRXhwcmVzc2lvbjxib29sZWFuPjtcblx0fTtcblx0ZGlzcGxheU1vZGU/OiBib29sZWFuO1xuXHR0aHJlc2hvbGQ6IG51bWJlcjtcblx0ZW50aXR5TmFtZTogc3RyaW5nO1xuXHRzb3J0Q29uZGl0aW9ucz86IHN0cmluZztcblx0Z3JvdXBDb25kaXRpb25zPzogc3RyaW5nO1xuXHRhZ2dyZWdhdGVDb25kaXRpb25zPzogc3RyaW5nO1xuXG5cdC8qKiBDcmVhdGUgbmV3IGVudHJpZXMgKi9cblx0Y3JlYXRlOiBDcmVhdGVCZWhhdmlvdXIgfCBDcmVhdGVCZWhhdmlvdXJFeHRlcm5hbDtcblx0cGFyZW50RW50aXR5RGVsZXRlRW5hYmxlZD86IEJpbmRpbmdFeHByZXNzaW9uPGJvb2xlYW4+O1xuXHR0aXRsZTogc3RyaW5nO1xufTtcblxuLyoqXG4gKiBOZXcgZW50cmllcyBhcmUgY3JlYXRlZCB3aXRoaW4gdGhlIGFwcCAoZGVmYXVsdCBjYXNlKVxuICovXG50eXBlIENyZWF0ZUJlaGF2aW91ciA9IHtcblx0bW9kZTogQ3JlYXRpb25Nb2RlO1xuXHRhcHBlbmQ6IEJvb2xlYW47XG5cdG5ld0FjdGlvbj86IHN0cmluZztcblx0bmF2aWdhdGVUb1RhcmdldD86IHN0cmluZztcbn07XG5cbi8qKlxuICogTmV3IGVudHJpZXMgYXJlIGNyZWF0ZWQgYnkgbmF2aWdhdGluZyB0byBzb21lIHRhcmdldFxuICovXG50eXBlIENyZWF0ZUJlaGF2aW91ckV4dGVybmFsID0ge1xuXHRtb2RlOiBcIkV4dGVybmFsXCI7XG5cdG91dGJvdW5kOiBzdHJpbmc7XG5cdG91dGJvdW5kRGV0YWlsOiBOYXZpZ2F0aW9uVGFyZ2V0Q29uZmlndXJhdGlvbltcIm91dGJvdW5kRGV0YWlsXCJdO1xuXHRuYXZpZ2F0aW9uU2V0dGluZ3M6IE5hdmlnYXRpb25TZXR0aW5nc0NvbmZpZ3VyYXRpb247XG59O1xuXG5leHBvcnQgdHlwZSBUYWJsZUNhcGFiaWxpdHlSZXN0cmljdGlvbiA9IHtcblx0aXNEZWxldGFibGU6IGJvb2xlYW47XG5cdGlzVXBkYXRhYmxlOiBib29sZWFuO1xufTtcblxuZXhwb3J0IHR5cGUgVGFibGVGaWx0ZXJzQ29uZmlndXJhdGlvbiA9IHtcblx0ZW5hYmxlZD86IHN0cmluZyB8IGJvb2xlYW47XG5cdHBhdGhzOiBbXG5cdFx0e1xuXHRcdFx0YW5ub3RhdGlvblBhdGg6IHN0cmluZztcblx0XHR9XG5cdF07XG5cdHNob3dDb3VudHM/OiBib29sZWFuO1xufTtcblxuZXhwb3J0IHR5cGUgU2VsZWN0aW9uVmFyaWFudENvbmZpZ3VyYXRpb24gPSB7XG5cdHByb3BlcnR5TmFtZXM6IHN0cmluZ1tdO1xuXHR0ZXh0Pzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgVGFibGVDb250cm9sQ29uZmlndXJhdGlvbiA9IHtcblx0Y3JlYXRlQXRFbmQ6IGJvb2xlYW47XG5cdGNyZWF0aW9uTW9kZTogQ3JlYXRpb25Nb2RlO1xuXHRkaXNhYmxlQWRkUm93QnV0dG9uRm9yRW1wdHlEYXRhOiBib29sZWFuO1xuXHR1c2VDb25kZW5zZWRUYWJsZUxheW91dDogYm9vbGVhbjtcblx0ZW5hYmxlRXhwb3J0OiBib29sZWFuO1xuXHRoZWFkZXJWaXNpYmxlOiBib29sZWFuO1xuXHRmaWx0ZXJzPzogUmVjb3JkPHN0cmluZywgVGFibGVGaWx0ZXJzQ29uZmlndXJhdGlvbj47XG5cdHR5cGU6IFRhYmxlVHlwZTtcblx0c2VsZWN0QWxsPzogYm9vbGVhbjtcblx0c2VsZWN0aW9uTGltaXQ6IG51bWJlcjtcblx0ZW5hYmxlUGFzdGU6IGJvb2xlYW47XG5cdGVuYWJsZUZ1bGxTY3JlZW46IGJvb2xlYW47XG59O1xuXG5leHBvcnQgdHlwZSBUYWJsZVR5cGUgPSBcIkdyaWRUYWJsZVwiIHwgXCJSZXNwb25zaXZlVGFibGVcIiB8IFwiQW5hbHl0aWNhbFRhYmxlXCI7XG5cbmVudW0gQ29sdW1uVHlwZSB7XG5cdERlZmF1bHQgPSBcIkRlZmF1bHRcIiwgLy8gRGVmYXVsdCBUeXBlXG5cdEFubm90YXRpb24gPSBcIkFubm90YXRpb25cIlxufVxuXG5leHBvcnQgdHlwZSBCYXNlVGFibGVDb2x1bW4gPSBDb25maWd1cmFibGVPYmplY3QgJiB7XG5cdGlkOiBzdHJpbmc7XG5cdHdpZHRoPzogc3RyaW5nO1xuXHRuYW1lOiBzdHJpbmc7XG5cdGF2YWlsYWJpbGl0eT86IEF2YWlsYWJpbGl0eVR5cGU7XG5cdHR5cGU6IENvbHVtblR5cGU7IC8vT3JpZ2luIG9mIHRoZSBzb3VyY2Ugd2hlcmUgd2UgYXJlIGdldHRpbmcgdGhlIHRlbXBsYXRlZCBpbmZvcm1hdGlvbiBmcm9tLFxuXHRpc05hdmlnYWJsZT86IGJvb2xlYW47XG5cdHNldHRpbmdzPzogVGFibGVDb2x1bW5TZXR0aW5ncztcblx0c2VtYW50aWNPYmplY3RQYXRoPzogc3RyaW5nO1xuXHRwcm9wZXJ0eUluZm9zPzogc3RyaW5nW107XG5cdHNvcnRhYmxlOiBib29sZWFuO1xuXHRob3Jpem9udGFsQWxpZ24/OiBIb3Jpem9udGFsQWxpZ247XG5cdGZvcm1hdE9wdGlvbnM6IEZvcm1hdE9wdGlvbnNUeXBlO1xufTtcblxuZXhwb3J0IHR5cGUgQ3VzdG9tVGFibGVDb2x1bW4gPSBCYXNlVGFibGVDb2x1bW4gJiB7XG5cdGhlYWRlcj86IHN0cmluZztcblx0dGVtcGxhdGU6IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIEFubm90YXRpb25UYWJsZUNvbHVtbiA9IEJhc2VUYWJsZUNvbHVtbiAmIHtcblx0YW5ub3RhdGlvblBhdGg6IHN0cmluZztcblx0cmVsYXRpdmVQYXRoOiBzdHJpbmc7XG5cdGxhYmVsPzogc3RyaW5nO1xuXHRncm91cExhYmVsPzogc3RyaW5nO1xuXHRncm91cD86IHN0cmluZztcblx0aXNHcm91cGFibGU/OiBib29sZWFuO1xuXHRpc0tleT86IGJvb2xlYW47XG5cdHVuaXQ/OiBzdHJpbmc7XG5cdGV4cG9ydFNldHRpbmdzPzoge1xuXHRcdHRlbXBsYXRlPzogc3RyaW5nO1xuXHRcdGxhYmVscz86IHN0cmluZ1tdO1xuXHR9O1xufTtcblxudHlwZSBUYWJsZUNvbHVtbiA9IEN1c3RvbVRhYmxlQ29sdW1uIHwgQW5ub3RhdGlvblRhYmxlQ29sdW1uO1xuXG5leHBvcnQgdHlwZSBDdXN0b21Db2x1bW4gPSBDdXN0b21FbGVtZW50PFRhYmxlQ29sdW1uPjtcblxuZXhwb3J0IHR5cGUgQWdncmVnYXRlRGF0YSA9IHtcblx0ZGVmYXVsdEFnZ3JlZ2F0ZToge1xuXHRcdGNvbnRleHREZWZpbmluZ1Byb3BlcnRpZXM/OiBzdHJpbmdbXTtcblx0fTtcblx0cmVsYXRpdmVQYXRoOiBzdHJpbmc7XG59O1xuXG5leHBvcnQgdHlwZSBUYWJsZVZpc3VhbGl6YXRpb24gPSB7XG5cdHR5cGU6IFZpc3VhbGl6YXRpb25UeXBlLlRhYmxlO1xuXHRhbm5vdGF0aW9uOiBUYWJsZUFubm90YXRpb25Db25maWd1cmF0aW9uO1xuXHRjb250cm9sOiBUYWJsZUNvbnRyb2xDb25maWd1cmF0aW9uO1xuXHRjb2x1bW5zOiBUYWJsZUNvbHVtbltdO1xuXHRhY3Rpb25zOiBCYXNlQWN0aW9uW107XG5cdGFnZ3JlZ2F0ZXM/OiBSZWNvcmQ8c3RyaW5nLCBBZ2dyZWdhdGVEYXRhPjtcblx0ZW5hYmxlQW5hbHl0aWNzPzogYm9vbGVhbjtcbn07XG5cbnR5cGUgU29ydGVyVHlwZSA9IHtcblx0bmFtZTogc3RyaW5nO1xuXHRkZXNjZW5kaW5nOiBib29sZWFuO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIGFuIGFycmF5IG9mIGFsbCBhbm5vdGF0aW9uIGJhc2VkIGFuZCBtYW5pZmVzdCBiYXNlZCB0YWJsZSBhY3Rpb25zLlxuICpcbiAqIEBwYXJhbSB7TGluZUl0ZW19IGxpbmVJdGVtQW5ub3RhdGlvblxuICogQHBhcmFtIHtzdHJpbmd9IHZpc3VhbGl6YXRpb25QYXRoXG4gKiBAcGFyYW0ge0NvbnZlcnRlckNvbnRleHR9IGNvbnZlcnRlckNvbnRleHRcbiAqIEBwYXJhbSB7TmF2aWdhdGlvblNldHRpbmdzQ29uZmlndXJhdGlvbn0gbmF2aWdhdGlvblNldHRpbmdzXG4gKiBAcmV0dXJucyB7QmFzZUFjdGlvbn0gdGhlIGNvbXBsZXRlIHRhYmxlIGFjdGlvbnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFRhYmxlQWN0aW9ucyhcblx0bGluZUl0ZW1Bbm5vdGF0aW9uOiBMaW5lSXRlbSxcblx0dmlzdWFsaXphdGlvblBhdGg6IHN0cmluZyxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCxcblx0bmF2aWdhdGlvblNldHRpbmdzPzogTmF2aWdhdGlvblNldHRpbmdzQ29uZmlndXJhdGlvblxuKTogQmFzZUFjdGlvbltdIHtcblx0Y29uc3QgYVRhYmxlQWN0aW9ucyA9IGdldFRhYmxlQW5ub3RhdGlvbkFjdGlvbnMobGluZUl0ZW1Bbm5vdGF0aW9uLCB2aXN1YWxpemF0aW9uUGF0aCwgY29udmVydGVyQ29udGV4dCk7XG5cdGNvbnN0IGFBbm5vdGF0aW9uQWN0aW9ucyA9IGFUYWJsZUFjdGlvbnMudGFibGVBY3Rpb25zO1xuXHRjb25zdCBhSGlkZGVuQWN0aW9ucyA9IGFUYWJsZUFjdGlvbnMuaGlkZGVuVGFibGVBY3Rpb25zO1xuXHRyZXR1cm4gaW5zZXJ0Q3VzdG9tRWxlbWVudHMoXG5cdFx0YUFubm90YXRpb25BY3Rpb25zLFxuXHRcdGdldEFjdGlvbnNGcm9tTWFuaWZlc3QoXG5cdFx0XHRjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0Q29udHJvbENvbmZpZ3VyYXRpb24odmlzdWFsaXphdGlvblBhdGgpLmFjdGlvbnMsXG5cdFx0XHRjb252ZXJ0ZXJDb250ZXh0LFxuXHRcdFx0YUFubm90YXRpb25BY3Rpb25zLFxuXHRcdFx0bmF2aWdhdGlvblNldHRpbmdzLFxuXHRcdFx0dHJ1ZSxcblx0XHRcdGFIaWRkZW5BY3Rpb25zXG5cdFx0KSxcblx0XHR7IGlzTmF2aWdhYmxlOiBcIm92ZXJ3cml0ZVwiLCBlbmFibGVPblNlbGVjdDogXCJvdmVyd3JpdGVcIiwgZW5hYmxlQXV0b1Njcm9sbDogXCJvdmVyd3JpdGVcIiwgZW5hYmxlZDogXCJvdmVyd3JpdGVcIiB9XG5cdCk7XG59XG5cbi8qKlxuICogUmV0dXJucyBhbiBhcnJheSBvZmYgYWxsIGNvbHVtbnMsIGFubm90YXRpb24gYmFzZWQgYXMgd2VsbCBhcyBtYW5pZmVzdCBiYXNlZC5cbiAqIFRoZXkgYXJlIHNvcnRlZCBhbmQgc29tZSBwcm9wZXJ0aWVzIG9mIGNhbiBiZSBvdmVyd3JpdHRlbiB0aHJvdWdoIHRoZSBtYW5pZmVzdCAoY2hlY2sgb3V0IHRoZSBvdmVyd3JpdGUtYWJsZSBLZXlzKS5cbiAqXG4gKiBAcGFyYW0ge0xpbmVJdGVtfSBsaW5lSXRlbUFubm90YXRpb24gQ29sbGVjdGlvbiBvZiBkYXRhIGZpZWxkcyBmb3IgcmVwcmVzZW50YXRpb24gaW4gYSB0YWJsZSBvciBsaXN0XG4gKiBAcGFyYW0ge3N0cmluZ30gdmlzdWFsaXphdGlvblBhdGhcbiAqIEBwYXJhbSB7Q29udmVydGVyQ29udGV4dH0gY29udmVydGVyQ29udGV4dFxuICogQHBhcmFtIHtOYXZpZ2F0aW9uU2V0dGluZ3NDb25maWd1cmF0aW9ufSBuYXZpZ2F0aW9uU2V0dGluZ3NcbiAqIEByZXR1cm5zIHtUYWJsZUNvbHVtbltdfSBSZXR1cm5zIGFsbCB0YWJsZSBjb2x1bW5zIHRoYXQgc2hvdWxkIGJlIGF2YWlsYWJsZSwgcmVnYXJkbGVzcyBvZiB0ZW1wbGF0aW5nIG9yIHBlcnNvbmFsaXphdGlvbiBvciB0aGVpciBvcmlnaW5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFRhYmxlQ29sdW1ucyhcblx0bGluZUl0ZW1Bbm5vdGF0aW9uOiBMaW5lSXRlbSxcblx0dmlzdWFsaXphdGlvblBhdGg6IHN0cmluZyxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCxcblx0bmF2aWdhdGlvblNldHRpbmdzPzogTmF2aWdhdGlvblNldHRpbmdzQ29uZmlndXJhdGlvblxuKTogVGFibGVDb2x1bW5bXSB7XG5cdGNvbnN0IGFubm90YXRpb25Db2x1bW5zID0gZ2V0Q29sdW1uc0Zyb21Bbm5vdGF0aW9ucyhsaW5lSXRlbUFubm90YXRpb24sIHZpc3VhbGl6YXRpb25QYXRoLCBjb252ZXJ0ZXJDb250ZXh0KTtcblx0Y29uc3QgbWFuaWZlc3RDb2x1bW5zID0gZ2V0Q29sdW1uc0Zyb21NYW5pZmVzdChcblx0XHRjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0Q29udHJvbENvbmZpZ3VyYXRpb24odmlzdWFsaXphdGlvblBhdGgpLmNvbHVtbnMsXG5cdFx0YW5ub3RhdGlvbkNvbHVtbnMgYXMgQW5ub3RhdGlvblRhYmxlQ29sdW1uW10sXG5cdFx0Y29udmVydGVyQ29udGV4dCxcblx0XHRjb252ZXJ0ZXJDb250ZXh0LmdldEFubm90YXRpb25FbnRpdHlUeXBlKGxpbmVJdGVtQW5ub3RhdGlvbiksXG5cdFx0bmF2aWdhdGlvblNldHRpbmdzXG5cdCk7XG5cblx0cmV0dXJuIGluc2VydEN1c3RvbUVsZW1lbnRzKGFubm90YXRpb25Db2x1bW5zLCBtYW5pZmVzdENvbHVtbnMsIHtcblx0XHR3aWR0aDogXCJvdmVyd3JpdGVcIixcblx0XHRpc05hdmlnYWJsZTogXCJvdmVyd3JpdGVcIixcblx0XHRhdmFpbGFiaWxpdHk6IFwib3ZlcndyaXRlXCIsXG5cdFx0c2V0dGluZ3M6IFwib3ZlcndyaXRlXCIsXG5cdFx0aG9yaXpvbnRhbEFsaWduOiBcIm92ZXJ3cml0ZVwiLFxuXHRcdGZvcm1hdE9wdGlvbnM6IFwib3ZlcndyaXRlXCJcblx0fSk7XG59XG5cbi8qKlxuICogUmV0cmlldmUgdGhlIGN1c3RvbSBhZ2dyZWdhdGlvbiBkZWZpbml0aW9ucyBmcm9tIHRoZSBlbnRpdHlUeXBlLlxuICpcbiAqIEBwYXJhbSBlbnRpdHlUeXBlIFRoZSB0YXJnZXQgZW50aXR5IHR5cGUuXG4gKiBAcGFyYW0gdGFibGVDb2x1bW5zIFRoZSBhcnJheSBvZiBjb2x1bW5zIGZvciB0aGUgZW50aXR5IHR5cGUuXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dCBUaGUgY29udmVydGVyIGNvbnRleHQuXG4gKiBAcmV0dXJucyB0aGUgYWdncmVnYXRlIGRlZmluaXRpb25zIGZyb20gdGhlIGVudGl0eVR5cGUsIG9yIHVkZWZpbmVkIGlmIHRoZSBlbnRpdHkgZG9lc24ndCBzdXBwb3J0IGFuYXl0aWNhbCBxdWVyaWVzXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRBZ2dyZWdhdGVEZWZpbml0aW9uc0Zyb21FbnRpdHlUeXBlID0gZnVuY3Rpb24oXG5cdGVudGl0eVR5cGU6IEVudGl0eVR5cGUsXG5cdHRhYmxlQ29sdW1uczogVGFibGVDb2x1bW5bXSxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dFxuKTogUmVjb3JkPHN0cmluZywgQWdncmVnYXRlRGF0YT4gfCB1bmRlZmluZWQge1xuXHRjb25zdCBhZ2dyZWdhdGlvbkhlbHBlciA9IG5ldyBBZ2dyZWdhdGlvbkhlbHBlcihlbnRpdHlUeXBlLCBjb252ZXJ0ZXJDb250ZXh0KTtcblxuXHRmdW5jdGlvbiBmaW5kQ29sdW1uRnJvbVBhdGgocGF0aDogc3RyaW5nKTogVGFibGVDb2x1bW4gfCB1bmRlZmluZWQge1xuXHRcdHJldHVybiB0YWJsZUNvbHVtbnMuZmluZChjb2x1bW4gPT4ge1xuXHRcdFx0Y29uc3QgYW5ub3RhdGlvbkNvbHVtbiA9IGNvbHVtbiBhcyBBbm5vdGF0aW9uVGFibGVDb2x1bW47XG5cdFx0XHRyZXR1cm4gYW5ub3RhdGlvbkNvbHVtbi5wcm9wZXJ0eUluZm9zID09PSB1bmRlZmluZWQgJiYgYW5ub3RhdGlvbkNvbHVtbi5yZWxhdGl2ZVBhdGggPT09IHBhdGg7XG5cdFx0fSk7XG5cdH1cblxuXHRpZiAoIWFnZ3JlZ2F0aW9uSGVscGVyLmlzQW5hbHl0aWNzU3VwcG9ydGVkKCkpIHtcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG5cblx0Ly8gS2VlcCBhIHNldCBvZiBhbGwgY3VycmVuY3kvdW5pdCBwcm9wZXJ0aWVzLCBhcyB3ZSBkb24ndCB3YW50IHRvIGNvbnNpZGVyIHRoZW0gYXMgYWdncmVnYXRlc1xuXHQvLyBUaGV5IGFyZSBhZ2dyZWdhdGVzIGZvciB0ZWNobmljYWwgcmVhc29ucyAodG8gbWFuYWdlIG11bHRpLXVuaXRzIHNpdHVhdGlvbnMpIGJ1dCBpdCBkb2Vzbid0IG1ha2Ugc2Vuc2UgZnJvbSBhIHVzZXIgc3RhbmRwb2ludFxuXHRjb25zdCBtQ3VycmVuY3lPclVuaXRQcm9wZXJ0aWVzID0gbmV3IFNldCgpO1xuXHR0YWJsZUNvbHVtbnMuZm9yRWFjaChvQ29sdW1uID0+IHtcblx0XHRjb25zdCBvVGFibGVDb2x1bW4gPSBvQ29sdW1uIGFzIEFubm90YXRpb25UYWJsZUNvbHVtbjtcblx0XHRpZiAob1RhYmxlQ29sdW1uLnVuaXQpIHtcblx0XHRcdG1DdXJyZW5jeU9yVW5pdFByb3BlcnRpZXMuYWRkKG9UYWJsZUNvbHVtbi51bml0KTtcblx0XHR9XG5cdH0pO1xuXG5cdGNvbnN0IG1SYXdEZWZpbml0aW9ucyA9IGFnZ3JlZ2F0aW9uSGVscGVyLmdldEN1c3RvbUFnZ3JlZ2F0ZURlZmluaXRpb25zKCk7XG5cdGNvbnN0IG1SZXN1bHQ6IFJlY29yZDxzdHJpbmcsIEFnZ3JlZ2F0ZURhdGE+ID0ge307XG5cblx0dGFibGVDb2x1bW5zLmZvckVhY2gob0NvbHVtbiA9PiB7XG5cdFx0Y29uc3Qgb1RhYmxlQ29sdW1uID0gb0NvbHVtbiBhcyBBbm5vdGF0aW9uVGFibGVDb2x1bW47XG5cdFx0aWYgKG9UYWJsZUNvbHVtbi5wcm9wZXJ0eUluZm9zID09PSB1bmRlZmluZWQgJiYgb1RhYmxlQ29sdW1uLnJlbGF0aXZlUGF0aCkge1xuXHRcdFx0Y29uc3QgYVJhd0NvbnRleHREZWZpbmluZ1Byb3BlcnRpZXMgPSBtUmF3RGVmaW5pdGlvbnNbb1RhYmxlQ29sdW1uLnJlbGF0aXZlUGF0aF07XG5cblx0XHRcdC8vIElnbm9yZSBhZ2dyZWdhdGVzIGNvcnJlc3BvbmRpbmcgdG8gY3VycmVuY2llcyBvciB1bml0cyBwZiBtZWFzdXJlXG5cdFx0XHRpZiAoYVJhd0NvbnRleHREZWZpbmluZ1Byb3BlcnRpZXMgJiYgIW1DdXJyZW5jeU9yVW5pdFByb3BlcnRpZXMuaGFzKG9UYWJsZUNvbHVtbi5uYW1lKSkge1xuXHRcdFx0XHRtUmVzdWx0W29UYWJsZUNvbHVtbi5uYW1lXSA9IHtcblx0XHRcdFx0XHRkZWZhdWx0QWdncmVnYXRlOiB7fSxcblx0XHRcdFx0XHRyZWxhdGl2ZVBhdGg6IG9UYWJsZUNvbHVtbi5yZWxhdGl2ZVBhdGhcblx0XHRcdFx0fTtcblx0XHRcdFx0Y29uc3QgYUNvbnRleHREZWZpbmluZ1Byb3BlcnRpZXM6IHN0cmluZ1tdID0gW107XG5cdFx0XHRcdGFSYXdDb250ZXh0RGVmaW5pbmdQcm9wZXJ0aWVzLmZvckVhY2goY29udGV4dERlZmluaW5nUHJvcGVydHlOYW1lID0+IHtcblx0XHRcdFx0XHRjb25zdCBvQ29sdW1uID0gZmluZENvbHVtbkZyb21QYXRoKGNvbnRleHREZWZpbmluZ1Byb3BlcnR5TmFtZSk7XG5cdFx0XHRcdFx0aWYgKG9Db2x1bW4pIHtcblx0XHRcdFx0XHRcdGFDb250ZXh0RGVmaW5pbmdQcm9wZXJ0aWVzLnB1c2gob0NvbHVtbi5uYW1lKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGlmIChhQ29udGV4dERlZmluaW5nUHJvcGVydGllcy5sZW5ndGgpIHtcblx0XHRcdFx0XHRtUmVzdWx0W29UYWJsZUNvbHVtbi5uYW1lXS5kZWZhdWx0QWdncmVnYXRlLmNvbnRleHREZWZpbmluZ1Byb3BlcnRpZXMgPSBhQ29udGV4dERlZmluaW5nUHJvcGVydGllcztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblx0cmV0dXJuIG1SZXN1bHQ7XG59O1xuXG4vKipcbiAqIFVwZGF0ZXMgYSB0YWJsZSB2aXN1YWxpemF0aW9uIGZvciBhbmFseXRpY2FsIHVzZSBjYXNlcy5cbiAqXG4gKiBAcGFyYW0gdGFibGVWaXN1YWxpemF0aW9uIHRoZSB2aXN1YWxpemF0aW9uIHRvIGJlIHVwZGF0ZWRcbiAqIEBwYXJhbSBlbnRpdHlUeXBlIHRoZSBlbnRpdHkgdHlwZSBkaXNwbGF5ZWQgaW4gdGhlIHRhYmxlXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dCB0aGUgY29udmVydGVyIGNvbnRleHRcbiAqIEBwYXJhbSBwcmVzZW50YXRpb25WYXJpYW50QW5ub3RhdGlvbiB0aGUgcHJlc2VudGF0aW9uVmFyaWFudCBhbm5vdGF0aW9uIChpZiBhbnkpXG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZVRhYmxlVmlzdWFsaXphdGlvbkZvckFuYWx5dGljcyhcblx0dGFibGVWaXN1YWxpemF0aW9uOiBUYWJsZVZpc3VhbGl6YXRpb24sXG5cdGVudGl0eVR5cGU6IEVudGl0eVR5cGUsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdHByZXNlbnRhdGlvblZhcmlhbnRBbm5vdGF0aW9uPzogUHJlc2VudGF0aW9uVmFyaWFudFR5cGVUeXBlc1xuKSB7XG5cdGlmICh0YWJsZVZpc3VhbGl6YXRpb24uY29udHJvbC50eXBlID09PSBcIkFuYWx5dGljYWxUYWJsZVwiKSB7XG5cdFx0Y29uc3QgYWdncmVnYXRlc0RlZmluaXRpb25zID0gZ2V0QWdncmVnYXRlRGVmaW5pdGlvbnNGcm9tRW50aXR5VHlwZShlbnRpdHlUeXBlLCB0YWJsZVZpc3VhbGl6YXRpb24uY29sdW1ucywgY29udmVydGVyQ29udGV4dCk7XG5cblx0XHRpZiAoYWdncmVnYXRlc0RlZmluaXRpb25zKSB7XG5cdFx0XHR0YWJsZVZpc3VhbGl6YXRpb24uZW5hYmxlQW5hbHl0aWNzID0gdHJ1ZTtcblx0XHRcdHRhYmxlVmlzdWFsaXphdGlvbi5hZ2dyZWdhdGVzID0gYWdncmVnYXRlc0RlZmluaXRpb25zO1xuXG5cdFx0XHQvLyBBZGQgZ3JvdXAgYW5kIHNvcnQgY29uZGl0aW9ucyBmcm9tIHRoZSBwcmVzZW50YXRpb24gdmFyaWFudFxuXHRcdFx0dGFibGVWaXN1YWxpemF0aW9uLmFubm90YXRpb24uZ3JvdXBDb25kaXRpb25zID0gZ2V0R3JvdXBDb25kaXRpb25zKHByZXNlbnRhdGlvblZhcmlhbnRBbm5vdGF0aW9uLCB0YWJsZVZpc3VhbGl6YXRpb24uY29sdW1ucyk7XG5cdFx0XHR0YWJsZVZpc3VhbGl6YXRpb24uYW5ub3RhdGlvbi5hZ2dyZWdhdGVDb25kaXRpb25zID0gZ2V0QWdncmVnYXRlQ29uZGl0aW9ucyhcblx0XHRcdFx0cHJlc2VudGF0aW9uVmFyaWFudEFubm90YXRpb24sXG5cdFx0XHRcdHRhYmxlVmlzdWFsaXphdGlvbi5jb2x1bW5zXG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdHRhYmxlVmlzdWFsaXphdGlvbi5jb250cm9sLnR5cGUgPSBcIkdyaWRUYWJsZVwiOyAvLyBBbmFseXRpY2FsVGFibGUgaXNuJ3QgYSByZWFsIHR5cGUgZm9yIHRoZSBNREM6VGFibGUsIHNvIHdlIGFsd2F5cyBzd2l0Y2ggYmFjayB0byBHcmlkXG5cdH1cbn1cblxuLyoqXG4gKiBTZXRzIHRoZSAndW5pdCcgcHJvcGVydHkgaW4gY29sdW1ucyB3aGVuIG5lY2Vzc2FyeS5cbiAqXG4gKiBAcGFyYW0gZW50aXR5VHlwZSB0aGUgZW50aXR5IHR5cGUgZGlzcGxheWVkIGluIHRoZSB0YWJsZVxuICogQHBhcmFtIHRhYmxlQ29sdW1ucyB0aGUgY29sdW1ucyB0byBiZSB1cGRhdGVkXG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZVVuaXRQcm9wZXJ0aWVzKGVudGl0eVR5cGU6IEVudGl0eVR5cGUsIHRhYmxlQ29sdW1uczogVGFibGVDb2x1bW5bXSkge1xuXHR0YWJsZUNvbHVtbnMuZm9yRWFjaChvQ29sdW1uID0+IHtcblx0XHRjb25zdCBvVGFibGVDb2x1bW4gPSBvQ29sdW1uIGFzIEFubm90YXRpb25UYWJsZUNvbHVtbjtcblx0XHRpZiAob1RhYmxlQ29sdW1uLnByb3BlcnR5SW5mb3MgPT09IHVuZGVmaW5lZCAmJiBvVGFibGVDb2x1bW4ucmVsYXRpdmVQYXRoKSB7XG5cdFx0XHRjb25zdCBvUHJvcGVydHkgPSBlbnRpdHlUeXBlLmVudGl0eVByb3BlcnRpZXMuZmluZChvUHJvcCA9PiBvUHJvcC5uYW1lID09PSBvVGFibGVDb2x1bW4ucmVsYXRpdmVQYXRoKTtcblx0XHRcdGlmIChvUHJvcGVydHkpIHtcblx0XHRcdFx0Y29uc3Qgc1VuaXQgPSBnZXRBc3NvY2lhdGVkQ3VycmVuY3lQcm9wZXJ0eShvUHJvcGVydHkpPy5uYW1lIHx8IGdldEFzc29jaWF0ZWRVbml0UHJvcGVydHkob1Byb3BlcnR5KT8ubmFtZTtcblx0XHRcdFx0aWYgKHNVbml0KSB7XG5cdFx0XHRcdFx0Y29uc3Qgb1VuaXRDb2x1bW4gPSB0YWJsZUNvbHVtbnMuZmluZChjb2x1bW4gPT4ge1xuXHRcdFx0XHRcdFx0Y29uc3QgYW5ub3RhdGlvbkNvbHVtbiA9IGNvbHVtbiBhcyBBbm5vdGF0aW9uVGFibGVDb2x1bW47XG5cdFx0XHRcdFx0XHRyZXR1cm4gYW5ub3RhdGlvbkNvbHVtbi5wcm9wZXJ0eUluZm9zID09PSB1bmRlZmluZWQgJiYgYW5ub3RhdGlvbkNvbHVtbi5yZWxhdGl2ZVBhdGggPT09IHNVbml0O1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0b1RhYmxlQ29sdW1uLnVuaXQgPSBvVW5pdENvbHVtbj8ubmFtZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUYWJsZVZpc3VhbGl6YXRpb24oXG5cdGxpbmVJdGVtQW5ub3RhdGlvbjogTGluZUl0ZW0sXG5cdHZpc3VhbGl6YXRpb25QYXRoOiBzdHJpbmcsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdHByZXNlbnRhdGlvblZhcmlhbnRBbm5vdGF0aW9uPzogUHJlc2VudGF0aW9uVmFyaWFudFR5cGVUeXBlcyxcblx0aXNDb25kZW5zZWRUYWJsZUxheW91dENvbXBsaWFudD86IGJvb2xlYW5cbik6IFRhYmxlVmlzdWFsaXphdGlvbiB7XG5cdGNvbnN0IHRhYmxlTWFuaWZlc3RDb25maWcgPSBnZXRUYWJsZU1hbmlmZXN0Q29uZmlndXJhdGlvbihcblx0XHRsaW5lSXRlbUFubm90YXRpb24sXG5cdFx0dmlzdWFsaXphdGlvblBhdGgsXG5cdFx0Y29udmVydGVyQ29udGV4dCxcblx0XHRpc0NvbmRlbnNlZFRhYmxlTGF5b3V0Q29tcGxpYW50XG5cdCk7XG5cdGNvbnN0IHsgbmF2aWdhdGlvblByb3BlcnR5UGF0aCB9ID0gc3BsaXRQYXRoKHZpc3VhbGl6YXRpb25QYXRoKTtcblx0Y29uc3QgZGF0YU1vZGVsUGF0aCA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCgpO1xuXHRjb25zdCBlbnRpdHlOYW1lOiBzdHJpbmcgPSBkYXRhTW9kZWxQYXRoLnRhcmdldEVudGl0eVNldCA/IGRhdGFNb2RlbFBhdGgudGFyZ2V0RW50aXR5U2V0Lm5hbWUgOiBkYXRhTW9kZWxQYXRoLnN0YXJ0aW5nRW50aXR5U2V0Lm5hbWUsXG5cdFx0aXNFbnRpdHlTZXQ6IGJvb2xlYW4gPSBuYXZpZ2F0aW9uUHJvcGVydHlQYXRoLmxlbmd0aCA9PT0gMDtcblx0Y29uc3QgbmF2aWdhdGlvbk9yQ29sbGVjdGlvbk5hbWUgPSBpc0VudGl0eVNldCA/IGVudGl0eU5hbWUgOiBuYXZpZ2F0aW9uUHJvcGVydHlQYXRoO1xuXHRjb25zdCBuYXZpZ2F0aW9uU2V0dGluZ3MgPSBjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0V3JhcHBlcigpLmdldE5hdmlnYXRpb25Db25maWd1cmF0aW9uKG5hdmlnYXRpb25PckNvbGxlY3Rpb25OYW1lKTtcblx0Y29uc3QgY29sdW1ucyA9IGdldFRhYmxlQ29sdW1ucyhsaW5lSXRlbUFubm90YXRpb24sIHZpc3VhbGl6YXRpb25QYXRoLCBjb252ZXJ0ZXJDb250ZXh0LCBuYXZpZ2F0aW9uU2V0dGluZ3MpO1xuXG5cdGNvbnN0IG9WaXN1YWxpemF0aW9uOiBUYWJsZVZpc3VhbGl6YXRpb24gPSB7XG5cdFx0dHlwZTogVmlzdWFsaXphdGlvblR5cGUuVGFibGUsXG5cdFx0YW5ub3RhdGlvbjogZ2V0VGFibGVBbm5vdGF0aW9uQ29uZmlndXJhdGlvbihcblx0XHRcdGxpbmVJdGVtQW5ub3RhdGlvbixcblx0XHRcdHZpc3VhbGl6YXRpb25QYXRoLFxuXHRcdFx0Y29udmVydGVyQ29udGV4dCxcblx0XHRcdHRhYmxlTWFuaWZlc3RDb25maWcsXG5cdFx0XHRjb2x1bW5zLFxuXHRcdFx0cHJlc2VudGF0aW9uVmFyaWFudEFubm90YXRpb25cblx0XHQpLFxuXHRcdGNvbnRyb2w6IHRhYmxlTWFuaWZlc3RDb25maWcsXG5cdFx0YWN0aW9uczogcmVtb3ZlRHVwbGljYXRlQWN0aW9ucyhnZXRUYWJsZUFjdGlvbnMobGluZUl0ZW1Bbm5vdGF0aW9uLCB2aXN1YWxpemF0aW9uUGF0aCwgY29udmVydGVyQ29udGV4dCwgbmF2aWdhdGlvblNldHRpbmdzKSksXG5cdFx0Y29sdW1uczogY29sdW1uc1xuXHR9O1xuXG5cdHVwZGF0ZVVuaXRQcm9wZXJ0aWVzKGNvbnZlcnRlckNvbnRleHQuZ2V0QW5ub3RhdGlvbkVudGl0eVR5cGUobGluZUl0ZW1Bbm5vdGF0aW9uKSwgY29sdW1ucyk7XG5cdHVwZGF0ZVRhYmxlVmlzdWFsaXphdGlvbkZvckFuYWx5dGljcyhcblx0XHRvVmlzdWFsaXphdGlvbixcblx0XHRjb252ZXJ0ZXJDb250ZXh0LmdldEFubm90YXRpb25FbnRpdHlUeXBlKGxpbmVJdGVtQW5ub3RhdGlvbiksXG5cdFx0Y29udmVydGVyQ29udGV4dCxcblx0XHRwcmVzZW50YXRpb25WYXJpYW50QW5ub3RhdGlvblxuXHQpO1xuXG5cdHJldHVybiBvVmlzdWFsaXphdGlvbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZURlZmF1bHRUYWJsZVZpc3VhbGl6YXRpb24oY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCk6IFRhYmxlVmlzdWFsaXphdGlvbiB7XG5cdGNvbnN0IHRhYmxlTWFuaWZlc3RDb25maWcgPSBnZXRUYWJsZU1hbmlmZXN0Q29uZmlndXJhdGlvbih1bmRlZmluZWQsIFwiXCIsIGNvbnZlcnRlckNvbnRleHQsIGZhbHNlKTtcblx0Y29uc3QgY29sdW1ucyA9IGdldENvbHVtbnNGcm9tRW50aXR5VHlwZSh7fSwgY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlKCksIFtdLCBbXSwgY29udmVydGVyQ29udGV4dCk7XG5cdGNvbnN0IG9WaXN1YWxpemF0aW9uOiBUYWJsZVZpc3VhbGl6YXRpb24gPSB7XG5cdFx0dHlwZTogVmlzdWFsaXphdGlvblR5cGUuVGFibGUsXG5cdFx0YW5ub3RhdGlvbjogZ2V0VGFibGVBbm5vdGF0aW9uQ29uZmlndXJhdGlvbih1bmRlZmluZWQsIFwiXCIsIGNvbnZlcnRlckNvbnRleHQsIHRhYmxlTWFuaWZlc3RDb25maWcsIGNvbHVtbnMpLFxuXHRcdGNvbnRyb2w6IHRhYmxlTWFuaWZlc3RDb25maWcsXG5cdFx0YWN0aW9uczogW10sXG5cdFx0Y29sdW1uczogY29sdW1uc1xuXHR9O1xuXG5cdHVwZGF0ZVVuaXRQcm9wZXJ0aWVzKGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZSgpLCBjb2x1bW5zKTtcblx0dXBkYXRlVGFibGVWaXN1YWxpemF0aW9uRm9yQW5hbHl0aWNzKG9WaXN1YWxpemF0aW9uLCBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVR5cGUoKSwgY29udmVydGVyQ29udGV4dCk7XG5cblx0cmV0dXJuIG9WaXN1YWxpemF0aW9uO1xufVxuXG4vKipcbiAqIExvb3AgdGhyb3VnaCB0aGUgRGF0YUZpZWxkRm9yQWN0aW9uIGFuZCBEYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb24gb2YgYSBsaW5lIGl0ZW0gYW5kIHJldHVybiBhbGwgdGhlXG4gKiBIaWRkZW4gVUkgYW5ub3RhdGlvbiBleHByZXNzaW9ucy5cbiAqXG4gKiBAcGFyYW0gbGluZUl0ZW1Bbm5vdGF0aW9uIENvbGxlY3Rpb24gb2YgZGF0YSBmaWVsZHMgZm9yIHJlcHJlc2VudGF0aW9uIGluIGEgdGFibGUgb3IgbGlzdFxuICogQHBhcmFtIGNvbnRleHREYXRhTW9kZWxPYmplY3RQYXRoIERhdGFNb2RlbE9iamVjdFBhdGhcbiAqIEBwYXJhbSBpc0VudGl0eVNldCB0cnVlIG9yIGZhbHNlXG4gKiBAcmV0dXJucyB7RXhwcmVzc2lvbjxib29sZWFuPltdfSBBbGwgdGhlIFVJIEhpZGRlbiBwYXRoIGV4cHJlc3Npb25zIGZvdW5kIGluIHRoZSByZWxldmFudCBhY3Rpb25zXG4gKi9cbmZ1bmN0aW9uIGdldFVJSGlkZGVuRXhwRm9yQWN0aW9uc1JlcXVpcmluZ0NvbnRleHQoXG5cdGxpbmVJdGVtQW5ub3RhdGlvbjogTGluZUl0ZW0sXG5cdGNvbnRleHREYXRhTW9kZWxPYmplY3RQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoLFxuXHRpc0VudGl0eVNldDogYm9vbGVhblxuKTogRXhwcmVzc2lvbjxib29sZWFuPltdIHtcblx0Y29uc3QgYVVpSGlkZGVuUGF0aEV4cHJlc3Npb25zOiBFeHByZXNzaW9uPGJvb2xlYW4+W10gPSBbXTtcblx0bGluZUl0ZW1Bbm5vdGF0aW9uLmZvckVhY2goZGF0YUZpZWxkID0+IHtcblx0XHRpZiAoXG5cdFx0XHQoZGF0YUZpZWxkLiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JBY3Rpb24gJiYgZGF0YUZpZWxkPy5BY3Rpb25UYXJnZXQ/LmlzQm91bmQpIHx8XG5cdFx0XHQoZGF0YUZpZWxkLiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb24gJiZcblx0XHRcdFx0ZGF0YUZpZWxkLlJlcXVpcmVzQ29udGV4dCAmJlxuXHRcdFx0XHRkYXRhRmllbGQ/LklubGluZT8udmFsdWVPZigpICE9PSB0cnVlKVxuXHRcdCkge1xuXHRcdFx0aWYgKHR5cGVvZiBkYXRhRmllbGQuYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4/LnZhbHVlT2YoKSA9PT0gXCJvYmplY3RcIikge1xuXHRcdFx0XHRhVWlIaWRkZW5QYXRoRXhwcmVzc2lvbnMucHVzaChcblx0XHRcdFx0XHRlcXVhbChcblx0XHRcdFx0XHRcdGdldEJpbmRpbmdFeHBGcm9tQ29udGV4dChcblx0XHRcdFx0XHRcdFx0ZGF0YUZpZWxkIGFzIERhdGFGaWVsZEZvckFjdGlvbiB8IERhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvbixcblx0XHRcdFx0XHRcdFx0Y29udGV4dERhdGFNb2RlbE9iamVjdFBhdGgsXG5cdFx0XHRcdFx0XHRcdGlzRW50aXR5U2V0XG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0ZmFsc2Vcblx0XHRcdFx0XHQpXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIGFVaUhpZGRlblBhdGhFeHByZXNzaW9ucztcbn1cblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyB1c2VkIHRvIGNoYW5nZSB0aGUgY29udGV4dCBjdXJyZW50bHkgcmVmZXJlbmNlZCBieSB0aGlzIGJpbmRpbmcgYnkgcmVtb3ZpbmcgdGhlIGxhc3QgbmF2aWdhdGlvbiBwcm9wZXJ0eS5cbiAqXG4gKiBJdCBpcyB1c2VkIChzcGVjaWZpY2FsbHkgaW4gdGhpcyBjYXNlKSwgdG8gdHJhbnNmb3JtIGEgYmluZGluZyBtYWRlIGZvciBhIE5hdlByb3AgY29udGV4dCAvTWFpbk9iamVjdC9OYXZQcm9wMS9OYXZQcm9wMixcbiAqIGludG8gYSBiaW5kaW5nIG9uIHRoZSBwcmV2aW91cyBjb250ZXh0IC9NYWluT2JqZWN0L05hdlByb3AxLlxuICpcbiAqIEBwYXJhbSBzb3VyY2UgRGF0YUZpZWxkRm9yQWN0aW9uIHwgRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uIHwgQ3VzdG9tQWN0aW9uXG4gKiBAcGFyYW0gY29udGV4dERhdGFNb2RlbE9iamVjdFBhdGggRGF0YU1vZGVsT2JqZWN0UGF0aFxuICogQHBhcmFtIGlzRW50aXR5U2V0IHRydWUgb3IgZmFsc2VcbiAqIEByZXR1cm5zIHRoZSBiaW5kaW5nIGV4cHJlc3Npb25cbiAqL1xuZnVuY3Rpb24gZ2V0QmluZGluZ0V4cEZyb21Db250ZXh0KFxuXHRzb3VyY2U6IERhdGFGaWVsZEZvckFjdGlvbiB8IERhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvbiB8IEN1c3RvbUFjdGlvbixcblx0Y29udGV4dERhdGFNb2RlbE9iamVjdFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgsXG5cdGlzRW50aXR5U2V0OiBib29sZWFuXG4pOiBFeHByZXNzaW9uPGFueT4ge1xuXHRsZXQgc0V4cHJlc3Npb246IGFueSB8IHVuZGVmaW5lZDtcblx0aWYgKFxuXHRcdChzb3VyY2UgYXMgRGF0YUZpZWxkRm9yQWN0aW9uKT8uJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZEZvckFjdGlvbiB8fFxuXHRcdChzb3VyY2UgYXMgRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uKT8uJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvblxuXHQpIHtcblx0XHRzRXhwcmVzc2lvbiA9IChzb3VyY2UgYXMgRGF0YUZpZWxkRm9yQWN0aW9uIHwgRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uKT8uYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW47XG5cdH0gZWxzZSB7XG5cdFx0c0V4cHJlc3Npb24gPSAoc291cmNlIGFzIEN1c3RvbUFjdGlvbik/LnZpc2libGU7XG5cdH1cblx0bGV0IHNQYXRoOiBzdHJpbmc7XG5cdGlmIChzRXhwcmVzc2lvbj8ucGF0aCkge1xuXHRcdHNQYXRoID0gc0V4cHJlc3Npb24ucGF0aDtcblx0fSBlbHNlIHtcblx0XHRzUGF0aCA9IHNFeHByZXNzaW9uO1xuXHR9XG5cdGlmIChzUGF0aCkge1xuXHRcdGlmICgoc291cmNlIGFzIEN1c3RvbUFjdGlvbik/LnZpc2libGUpIHtcblx0XHRcdHNQYXRoID0gc1BhdGguc3Vic3RyaW5nKDEsIHNQYXRoLmxlbmd0aCAtIDEpO1xuXHRcdH1cblx0XHRpZiAoc1BhdGguaW5kZXhPZihcIi9cIikgPiAwKSB7XG5cdFx0XHQvL2NoZWNrIGlmIHRoZSBuYXZpZ2F0aW9uIHByb3BlcnR5IGlzIGNvcnJlY3Q6XG5cdFx0XHRjb25zdCBhU3BsaXRQYXRoID0gc1BhdGguc3BsaXQoXCIvXCIpO1xuXHRcdFx0Y29uc3Qgc05hdmlnYXRpb25QYXRoID0gYVNwbGl0UGF0aFswXTtcblx0XHRcdGlmIChcblx0XHRcdFx0Y29udGV4dERhdGFNb2RlbE9iamVjdFBhdGg/LnRhcmdldE9iamVjdD8uX3R5cGUgPT09IFwiTmF2aWdhdGlvblByb3BlcnR5XCIgJiZcblx0XHRcdFx0Y29udGV4dERhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0LnBhcnRuZXIgPT09IHNOYXZpZ2F0aW9uUGF0aFxuXHRcdFx0KSB7XG5cdFx0XHRcdHJldHVybiBiaW5kaW5nRXhwcmVzc2lvbihhU3BsaXRQYXRoLnNsaWNlKDEpLmpvaW4oXCIvXCIpKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBjb25zdGFudCh0cnVlKTtcblx0XHRcdH1cblx0XHRcdC8vIEluIGNhc2UgdGhlcmUgaXMgbm8gbmF2aWdhdGlvbiBwcm9wZXJ0eSwgaWYgaXQncyBhbiBlbnRpdHlTZXQsIHRoZSBleHByZXNzaW9uIGJpbmRpbmcgaGFzIHRvIGJlIHJldHVybmVkOlxuXHRcdH0gZWxzZSBpZiAoaXNFbnRpdHlTZXQpIHtcblx0XHRcdHJldHVybiBiaW5kaW5nRXhwcmVzc2lvbihzUGF0aCk7XG5cdFx0XHQvLyBvdGhlcndpc2UgdGhlIGV4cHJlc3Npb24gYmluZGluZyBjYW5ub3QgYmUgdGFrZW4gaW50byBhY2NvdW50IGZvciB0aGUgc2VsZWN0aW9uIG1vZGUgZXZhbHVhdGlvbjpcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIGNvbnN0YW50KHRydWUpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gY29uc3RhbnQodHJ1ZSk7XG59XG5cbi8qKlxuICogTG9vcCB0aHJvdWdoIHRoZSBEYXRhRmllbGRGb3JBY3Rpb24gYW5kIERhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvbiBvZiBhIGxpbmUgaXRlbSBhbmQgY2hlY2tcbiAqIGlmIGF0IGxlYXN0IG9uZSBvZiB0aGVtIGlzIGFsd2F5cyB2aXNpYmxlIGluIHRoZSB0YWJsZSB0b29sYmFyIChhbmQgcmVxdWlyZXMgYSBjb250ZXh0KS5cbiAqXG4gKiBAcGFyYW0gbGluZUl0ZW1Bbm5vdGF0aW9uIENvbGxlY3Rpb24gb2YgZGF0YSBmaWVsZHMgZm9yIHJlcHJlc2VudGF0aW9uIGluIGEgdGFibGUgb3IgbGlzdFxuICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlcmUgaXMgYXQgbGVhc3QgMSBhY3Rpb25zIHRoYXQgbWVldHMgdGhlIGNyaXRlcmlhXG4gKi9cbmZ1bmN0aW9uIGhhc0JvdW5kQWN0aW9uc0Fsd2F5c1Zpc2libGVJblRvb2xCYXIobGluZUl0ZW1Bbm5vdGF0aW9uOiBMaW5lSXRlbSk6IGJvb2xlYW4ge1xuXHRyZXR1cm4gbGluZUl0ZW1Bbm5vdGF0aW9uLnNvbWUoZGF0YUZpZWxkID0+IHtcblx0XHRpZiAoXG5cdFx0XHQoZGF0YUZpZWxkLiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JBY3Rpb24gfHxcblx0XHRcdFx0ZGF0YUZpZWxkLiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb24pICYmXG5cdFx0XHRkYXRhRmllbGQ/LklubGluZT8udmFsdWVPZigpICE9PSB0cnVlICYmXG5cdFx0XHQoZGF0YUZpZWxkLmFubm90YXRpb25zPy5VST8uSGlkZGVuPy52YWx1ZU9mKCkgPT09IGZhbHNlIHx8IGRhdGFGaWVsZC5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbj8udmFsdWVPZigpID09PSB1bmRlZmluZWQpXG5cdFx0KSB7XG5cdFx0XHRpZiAoZGF0YUZpZWxkLiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JBY3Rpb24pIHtcblx0XHRcdFx0cmV0dXJuIGRhdGFGaWVsZD8uQWN0aW9uVGFyZ2V0Py5pc0JvdW5kO1xuXHRcdFx0fSBlbHNlIGlmIChkYXRhRmllbGQuJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvbikge1xuXHRcdFx0XHRyZXR1cm4gZGF0YUZpZWxkLlJlcXVpcmVzQ29udGV4dDtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gaGFzQ3VzdG9tQWN0aW9uc0Fsd2F5c1Zpc2libGVJblRvb2xCYXIobWFuaWZlc3RBY3Rpb25zOiBSZWNvcmQ8c3RyaW5nLCBDdXN0b21BY3Rpb24+KTogYm9vbGVhbiB7XG5cdHJldHVybiBPYmplY3Qua2V5cyhtYW5pZmVzdEFjdGlvbnMpLnNvbWUoYWN0aW9uS2V5ID0+IHtcblx0XHRjb25zdCBhY3Rpb24gPSBtYW5pZmVzdEFjdGlvbnNbYWN0aW9uS2V5XTtcblx0XHRpZiAoYWN0aW9uLnJlcXVpcmVzU2VsZWN0aW9uICYmIGFjdGlvbi52aXNpYmxlPy50b1N0cmluZygpID09PSBcInRydWVcIikge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fSk7XG59XG5cbi8qKlxuICogTG9vcCB0aHJvdWdoIHRoZSBDdXN0b20gQWN0aW9ucyAod2l0aCBrZXkgcmVxdWlyZXNTZWxlY3Rpb24pIGRlY2xhcmVkIGluIHRoZSBtYW5pZmVzdCBmb3IgdGhlIGN1cnJlbnQgbGluZSBpdGVtIGFuZCByZXR1cm4gYWxsIHRoZVxuICogdmlzaWJsZSBrZXkgdmFsdWVzIGFzIGFuIGV4cHJlc3Npb24uXG4gKlxuICogQHBhcmFtIG1hbmlmZXN0QWN0aW9ucyB0aGUgbWFuaWZlc3QgZGVmaW5lZCBhY3Rpb25zXG4gKiBAcmV0dXJucyB7RXhwcmVzc2lvbjxib29sZWFuPltdfSBhbGwgdGhlIHZpc2libGUgcGF0aCBleHByZXNzaW9ucyBvZiB0aGUgYWN0aW9ucyB0aGF0IG1lZXQgdGhlIGNyaXRlcmlhXG4gKi9cbmZ1bmN0aW9uIGdldFZpc2libGVFeHBGb3JDdXN0b21BY3Rpb25zUmVxdWlyaW5nQ29udGV4dChtYW5pZmVzdEFjdGlvbnM6IFJlY29yZDxzdHJpbmcsIEN1c3RvbUFjdGlvbj4pOiBFeHByZXNzaW9uPGJvb2xlYW4+W10ge1xuXHRjb25zdCBhVmlzaWJsZVBhdGhFeHByZXNzaW9uczogRXhwcmVzc2lvbjxib29sZWFuPltdID0gW107XG5cdGlmIChtYW5pZmVzdEFjdGlvbnMpIHtcblx0XHRPYmplY3Qua2V5cyhtYW5pZmVzdEFjdGlvbnMpLmZvckVhY2goYWN0aW9uS2V5ID0+IHtcblx0XHRcdGNvbnN0IGFjdGlvbiA9IG1hbmlmZXN0QWN0aW9uc1thY3Rpb25LZXldO1xuXHRcdFx0aWYgKGFjdGlvbi5yZXF1aXJlc1NlbGVjdGlvbiA9PT0gdHJ1ZSAmJiBhY3Rpb24udmlzaWJsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGlmICh0eXBlb2YgYWN0aW9uLnZpc2libGUgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0XHQvKlRoZSBmaW5hbCBhaW0gd291bGQgYmUgdG8gY2hlY2sgaWYgdGhlIHBhdGggZXhwcmVzc2lvbiBkZXBlbmRzIG9uIHRoZSBwYXJlbnQgY29udGV4dFxuXHRcdFx0XHRcdGFuZCBjb25zaWRlcnMgb25seSB0aG9zZSBleHByZXNzaW9ucyBmb3IgdGhlIGV4cHJlc3Npb24gZXZhbHVhdGlvbixcblx0XHRcdFx0XHRidXQgY3VycmVudGx5IG5vdCBwb3NzaWJsZSBmcm9tIHRoZSBtYW5pZmVzdCBhcyB0aGUgdmlzaWJsZSBrZXkgaXMgYm91bmQgb24gdGhlIHBhcmVudCBlbnRpdHkuXG5cdFx0XHRcdFx0VHJpY2t5IHRvIGRpZmZlcmVuY2lhdGUgdGhlIHBhdGggYXMgaXQncyBkb25lIGZvciB0aGUgSGlkZGVuIGFubm90YXRpb24uXG5cdFx0XHRcdFx0Rm9yIHRoZSB0aW1lIGJlaW5nIHdlIGNvbnNpZGVyIGFsbCB0aGUgcGF0aHMgb2YgdGhlIG1hbmlmZXN0Ki9cblxuXHRcdFx0XHRcdGFWaXNpYmxlUGF0aEV4cHJlc3Npb25zLnB1c2gocmVzb2x2ZUJpbmRpbmdTdHJpbmcoYWN0aW9uPy52aXNpYmxlPy52YWx1ZU9mKCkpKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cdHJldHVybiBhVmlzaWJsZVBhdGhFeHByZXNzaW9ucztcbn1cblxuLyoqXG4gKiBFdmFsdWF0ZSBpZiB0aGUgcGF0aCBpcyBzdGF0aWNhbGx5IGRlbGV0YWJsZSBvciB1cGRhdGFibGUuXG4gKlxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHRcbiAqIEByZXR1cm5zIHtUYWJsZUNhcGFiaWxpdHlSZXN0cmljdGlvbn0gdGhlIHRhYmxlIGNhcGFiaWxpdGllc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2FwYWJpbGl0eVJlc3RyaWN0aW9uKGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQpOiBUYWJsZUNhcGFiaWxpdHlSZXN0cmljdGlvbiB7XG5cdGNvbnN0IGlzRGVsZXRhYmxlID0gaXNQYXRoRGVsZXRhYmxlKGNvbnZlcnRlckNvbnRleHQuZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCgpKTtcblx0Y29uc3QgaXNVcGRhdGFibGUgPSBpc1BhdGhVcGRhdGFibGUoY29udmVydGVyQ29udGV4dC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCkpO1xuXHRyZXR1cm4ge1xuXHRcdGlzRGVsZXRhYmxlOiAhKGlzQ29uc3RhbnQoaXNEZWxldGFibGUpICYmIGlzRGVsZXRhYmxlLnZhbHVlID09PSBmYWxzZSksXG5cdFx0aXNVcGRhdGFibGU6ICEoaXNDb25zdGFudChpc1VwZGF0YWJsZSkgJiYgaXNVcGRhdGFibGUudmFsdWUgPT09IGZhbHNlKVxuXHR9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2VsZWN0aW9uTW9kZShcblx0bGluZUl0ZW1Bbm5vdGF0aW9uOiBMaW5lSXRlbSB8IHVuZGVmaW5lZCxcblx0dmlzdWFsaXphdGlvblBhdGg6IHN0cmluZyxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCxcblx0aXNFbnRpdHlTZXQ6IGJvb2xlYW4sXG5cdHRhcmdldENhcGFiaWxpdGllczogVGFibGVDYXBhYmlsaXR5UmVzdHJpY3Rpb25cbik6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG5cdGlmICghbGluZUl0ZW1Bbm5vdGF0aW9uKSB7XG5cdFx0cmV0dXJuIFNlbGVjdGlvbk1vZGUuTm9uZTtcblx0fVxuXHRjb25zdCB0YWJsZU1hbmlmZXN0U2V0dGluZ3MgPSBjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0Q29udHJvbENvbmZpZ3VyYXRpb24odmlzdWFsaXphdGlvblBhdGgpO1xuXHRsZXQgc2VsZWN0aW9uTW9kZSA9IHRhYmxlTWFuaWZlc3RTZXR0aW5ncy50YWJsZVNldHRpbmdzPy5zZWxlY3Rpb25Nb2RlO1xuXHRsZXQgYUhpZGRlbkJpbmRpbmdFeHByZXNzaW9uczogRXhwcmVzc2lvbjxib29sZWFuPltdID0gW10sXG5cdFx0YVZpc2libGVCaW5kaW5nRXhwcmVzc2lvbnM6IEV4cHJlc3Npb248Ym9vbGVhbj5bXSA9IFtdO1xuXHRjb25zdCBtYW5pZmVzdEFjdGlvbnMgPSBnZXRBY3Rpb25zRnJvbU1hbmlmZXN0KFxuXHRcdGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RDb250cm9sQ29uZmlndXJhdGlvbih2aXN1YWxpemF0aW9uUGF0aCkuYWN0aW9ucyxcblx0XHRjb252ZXJ0ZXJDb250ZXh0LFxuXHRcdFtdLFxuXHRcdHVuZGVmaW5lZCxcblx0XHRmYWxzZVxuXHQpO1xuXHRsZXQgaXNQYXJlbnREZWxldGFibGUsIHBhcmVudEVudGl0eVNldERlbGV0YWJsZTtcblx0aWYgKGNvbnZlcnRlckNvbnRleHQuZ2V0VGVtcGxhdGVUeXBlKCkgPT09IFRlbXBsYXRlVHlwZS5PYmplY3RQYWdlKSB7XG5cdFx0aXNQYXJlbnREZWxldGFibGUgPSBpc1BhdGhEZWxldGFibGUoY29udmVydGVyQ29udGV4dC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCksIHVuZGVmaW5lZCk7XG5cdFx0cGFyZW50RW50aXR5U2V0RGVsZXRhYmxlID0gaXNQYXJlbnREZWxldGFibGUgPyBjb21waWxlQmluZGluZyhpc1BhcmVudERlbGV0YWJsZSwgdHJ1ZSkgOiBpc1BhcmVudERlbGV0YWJsZTtcblx0fVxuXHRpZiAoc2VsZWN0aW9uTW9kZSAmJiBzZWxlY3Rpb25Nb2RlID09PSBTZWxlY3Rpb25Nb2RlLk5vbmUpIHtcblx0XHRpZiAoIWlzRW50aXR5U2V0KSB7XG5cdFx0XHRpZiAodGFyZ2V0Q2FwYWJpbGl0aWVzLmlzRGVsZXRhYmxlIHx8IHBhcmVudEVudGl0eVNldERlbGV0YWJsZSAhPT0gXCJmYWxzZVwiKSB7XG5cdFx0XHRcdHNlbGVjdGlvbk1vZGUgPSBTZWxlY3Rpb25Nb2RlLk11bHRpO1xuXHRcdFx0XHRyZXR1cm4gY29tcGlsZUJpbmRpbmcoXG5cdFx0XHRcdFx0aWZFbHNlKGVxdWFsKGJpbmRpbmdFeHByZXNzaW9uKFwiL2VkaXRNb2RlXCIsIFwidWlcIiksIFwiRWRpdGFibGVcIiksIGNvbnN0YW50KHNlbGVjdGlvbk1vZGUpLCBjb25zdGFudChcIk5vbmVcIikpXG5cdFx0XHRcdCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzZWxlY3Rpb25Nb2RlID0gU2VsZWN0aW9uTW9kZS5Ob25lO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoaXNFbnRpdHlTZXQpIHtcblx0XHRcdGlmICh0YXJnZXRDYXBhYmlsaXRpZXMuaXNEZWxldGFibGUpIHtcblx0XHRcdFx0c2VsZWN0aW9uTW9kZSA9IFNlbGVjdGlvbk1vZGUuTXVsdGk7XG5cdFx0XHRcdHJldHVybiBzZWxlY3Rpb25Nb2RlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c2VsZWN0aW9uTW9kZSA9IFNlbGVjdGlvbk1vZGUuTm9uZTtcblx0XHRcdH1cblx0XHR9XG5cdH0gZWxzZSBpZiAoIXNlbGVjdGlvbk1vZGUgfHwgc2VsZWN0aW9uTW9kZSA9PT0gU2VsZWN0aW9uTW9kZS5BdXRvKSB7XG5cdFx0c2VsZWN0aW9uTW9kZSA9IFNlbGVjdGlvbk1vZGUuTXVsdGk7XG5cdH1cblxuXHRpZiAoaGFzQm91bmRBY3Rpb25zQWx3YXlzVmlzaWJsZUluVG9vbEJhcihsaW5lSXRlbUFubm90YXRpb24pIHx8IGhhc0N1c3RvbUFjdGlvbnNBbHdheXNWaXNpYmxlSW5Ub29sQmFyKG1hbmlmZXN0QWN0aW9ucykpIHtcblx0XHRyZXR1cm4gc2VsZWN0aW9uTW9kZTtcblx0fVxuXHRhSGlkZGVuQmluZGluZ0V4cHJlc3Npb25zID0gZ2V0VUlIaWRkZW5FeHBGb3JBY3Rpb25zUmVxdWlyaW5nQ29udGV4dChcblx0XHRsaW5lSXRlbUFubm90YXRpb24sXG5cdFx0Y29udmVydGVyQ29udGV4dC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCksXG5cdFx0aXNFbnRpdHlTZXRcblx0KTtcblx0YVZpc2libGVCaW5kaW5nRXhwcmVzc2lvbnMgPSBnZXRWaXNpYmxlRXhwRm9yQ3VzdG9tQWN0aW9uc1JlcXVpcmluZ0NvbnRleHQobWFuaWZlc3RBY3Rpb25zKTtcblxuXHQvLyBObyBhY3Rpb24gcmVxdWlyaW5nIGEgY29udGV4dDpcblx0aWYgKGFIaWRkZW5CaW5kaW5nRXhwcmVzc2lvbnMubGVuZ3RoID09PSAwICYmIGFWaXNpYmxlQmluZGluZ0V4cHJlc3Npb25zLmxlbmd0aCA9PT0gMCkge1xuXHRcdGlmICghaXNFbnRpdHlTZXQpIHtcblx0XHRcdGlmICh0YXJnZXRDYXBhYmlsaXRpZXMuaXNEZWxldGFibGUgfHwgcGFyZW50RW50aXR5U2V0RGVsZXRhYmxlICE9PSBcImZhbHNlXCIpIHtcblx0XHRcdFx0cmV0dXJuIGNvbXBpbGVCaW5kaW5nKFxuXHRcdFx0XHRcdGlmRWxzZShlcXVhbChiaW5kaW5nRXhwcmVzc2lvbihcIi9lZGl0TW9kZVwiLCBcInVpXCIpLCBcIkVkaXRhYmxlXCIpLCBjb25zdGFudChzZWxlY3Rpb25Nb2RlKSwgY29uc3RhbnQoU2VsZWN0aW9uTW9kZS5Ob25lKSlcblx0XHRcdFx0KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBTZWxlY3Rpb25Nb2RlLk5vbmU7XG5cdFx0XHR9XG5cdFx0XHQvLyBFbnRpdHlTZXQgZGVsZXRhYmxlOlxuXHRcdH0gZWxzZSBpZiAodGFyZ2V0Q2FwYWJpbGl0aWVzLmlzRGVsZXRhYmxlKSB7XG5cdFx0XHRyZXR1cm4gc2VsZWN0aW9uTW9kZTtcblx0XHRcdC8vIEVudGl0eVNldCBub3QgZGVsZXRhYmxlOlxuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gU2VsZWN0aW9uTW9kZS5Ob25lO1xuXHRcdH1cblx0XHQvLyBUaGVyZSBhcmUgYWN0aW9ucyByZXF1aXJpbmcgYSBjb250ZXh0OlxuXHR9IGVsc2UgaWYgKCFpc0VudGl0eVNldCkge1xuXHRcdGlmICh0YXJnZXRDYXBhYmlsaXRpZXMuaXNEZWxldGFibGUgfHwgcGFyZW50RW50aXR5U2V0RGVsZXRhYmxlICE9PSBcImZhbHNlXCIpIHtcblx0XHRcdHJldHVybiBjb21waWxlQmluZGluZyhcblx0XHRcdFx0aWZFbHNlKFxuXHRcdFx0XHRcdGVxdWFsKGJpbmRpbmdFeHByZXNzaW9uKFwiL2VkaXRNb2RlXCIsIFwidWlcIiksIFwiRWRpdGFibGVcIiksXG5cdFx0XHRcdFx0Y29uc3RhbnQoc2VsZWN0aW9uTW9kZSksXG5cdFx0XHRcdFx0aWZFbHNlKFxuXHRcdFx0XHRcdFx0b3IoLi4uYUhpZGRlbkJpbmRpbmdFeHByZXNzaW9ucy5jb25jYXQoYVZpc2libGVCaW5kaW5nRXhwcmVzc2lvbnMpKSxcblx0XHRcdFx0XHRcdGNvbnN0YW50KHNlbGVjdGlvbk1vZGUpLFxuXHRcdFx0XHRcdFx0Y29uc3RhbnQoU2VsZWN0aW9uTW9kZS5Ob25lKVxuXHRcdFx0XHRcdClcblx0XHRcdFx0KVxuXHRcdFx0KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIGNvbXBpbGVCaW5kaW5nKFxuXHRcdFx0XHRpZkVsc2UoXG5cdFx0XHRcdFx0b3IoLi4uYUhpZGRlbkJpbmRpbmdFeHByZXNzaW9ucy5jb25jYXQoYVZpc2libGVCaW5kaW5nRXhwcmVzc2lvbnMpKSxcblx0XHRcdFx0XHRjb25zdGFudChzZWxlY3Rpb25Nb2RlKSxcblx0XHRcdFx0XHRjb25zdGFudChTZWxlY3Rpb25Nb2RlLk5vbmUpXG5cdFx0XHRcdClcblx0XHRcdCk7XG5cdFx0fVxuXHRcdC8vRW50aXR5U2V0IGRlbGV0YWJsZTpcblx0fSBlbHNlIGlmICh0YXJnZXRDYXBhYmlsaXRpZXMuaXNEZWxldGFibGUpIHtcblx0XHRyZXR1cm4gU2VsZWN0aW9uTW9kZS5NdWx0aTtcblx0XHQvL0V0aXR5U2V0IG5vdCBkZWxldGFibGU6XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIGNvbXBpbGVCaW5kaW5nKFxuXHRcdFx0aWZFbHNlKFxuXHRcdFx0XHRvciguLi5hSGlkZGVuQmluZGluZ0V4cHJlc3Npb25zLmNvbmNhdChhVmlzaWJsZUJpbmRpbmdFeHByZXNzaW9ucykpLFxuXHRcdFx0XHRjb25zdGFudChzZWxlY3Rpb25Nb2RlKSxcblx0XHRcdFx0Y29uc3RhbnQoU2VsZWN0aW9uTW9kZS5Ob25lKVxuXHRcdFx0KVxuXHRcdCk7XG5cdH1cbn1cblxuLyoqXG4gKiBNZXRob2QgdG8gcmV0cmlldmUgYWxsIHRhYmxlIGFjdGlvbnMgZnJvbSBhbm5vdGF0aW9ucy5cbiAqXG4gKiBAcGFyYW0gbGluZUl0ZW1Bbm5vdGF0aW9uXG4gKiBAcGFyYW0gdmlzdWFsaXphdGlvblBhdGhcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0XG4gKiBAcmV0dXJucyB7UmVjb3JkPEJhc2VBY3Rpb24sIEJhc2VBY3Rpb24+fSB0aGUgdGFibGUgYW5ub3RhdGlvbiBhY3Rpb25zXG4gKi9cbmZ1bmN0aW9uIGdldFRhYmxlQW5ub3RhdGlvbkFjdGlvbnMobGluZUl0ZW1Bbm5vdGF0aW9uOiBMaW5lSXRlbSwgdmlzdWFsaXphdGlvblBhdGg6IHN0cmluZywgY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCkge1xuXHRjb25zdCB0YWJsZUFjdGlvbnM6IEJhc2VBY3Rpb25bXSA9IFtdO1xuXHRjb25zdCBoaWRkZW5UYWJsZUFjdGlvbnM6IEJhc2VBY3Rpb25bXSA9IFtdO1xuXHRpZiAobGluZUl0ZW1Bbm5vdGF0aW9uKSB7XG5cdFx0bGluZUl0ZW1Bbm5vdGF0aW9uLmZvckVhY2goKGRhdGFGaWVsZDogRGF0YUZpZWxkQWJzdHJhY3RUeXBlcykgPT4ge1xuXHRcdFx0bGV0IHRhYmxlQWN0aW9uOiBBbm5vdGF0aW9uQWN0aW9uIHwgdW5kZWZpbmVkO1xuXHRcdFx0aWYgKFxuXHRcdFx0XHRpc0RhdGFGaWVsZEZvckFjdGlvbkFic3RyYWN0KGRhdGFGaWVsZCkgJiZcblx0XHRcdFx0IShkYXRhRmllbGQuYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4/LnZhbHVlT2YoKSA9PT0gdHJ1ZSkgJiZcblx0XHRcdFx0IWRhdGFGaWVsZC5JbmxpbmUgJiZcblx0XHRcdFx0IWRhdGFGaWVsZC5EZXRlcm1pbmluZ1xuXHRcdFx0KSB7XG5cdFx0XHRcdGNvbnN0IGtleSA9IEtleUhlbHBlci5nZW5lcmF0ZUtleUZyb21EYXRhRmllbGQoZGF0YUZpZWxkKTtcblx0XHRcdFx0c3dpdGNoIChkYXRhRmllbGQuJFR5cGUpIHtcblx0XHRcdFx0XHRjYXNlIFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkRm9yQWN0aW9uXCI6XG5cdFx0XHRcdFx0XHR0YWJsZUFjdGlvbiA9IHtcblx0XHRcdFx0XHRcdFx0dHlwZTogQWN0aW9uVHlwZS5EYXRhRmllbGRGb3JBY3Rpb24sXG5cdFx0XHRcdFx0XHRcdGFubm90YXRpb25QYXRoOiBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVNldEJhc2VkQW5ub3RhdGlvblBhdGgoZGF0YUZpZWxkLmZ1bGx5UXVhbGlmaWVkTmFtZSksXG5cdFx0XHRcdFx0XHRcdGtleToga2V5LFxuXHRcdFx0XHRcdFx0XHR2aXNpYmxlOiBjb21waWxlQmluZGluZyhub3QoZXF1YWwoYW5ub3RhdGlvbkV4cHJlc3Npb24oZGF0YUZpZWxkLmFubm90YXRpb25zPy5VST8uSGlkZGVuKSwgdHJ1ZSkpKSxcblx0XHRcdFx0XHRcdFx0aXNOYXZpZ2FibGU6IHRydWVcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdGNhc2UgXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb25cIjpcblx0XHRcdFx0XHRcdHRhYmxlQWN0aW9uID0ge1xuXHRcdFx0XHRcdFx0XHR0eXBlOiBBY3Rpb25UeXBlLkRhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvbixcblx0XHRcdFx0XHRcdFx0YW5ub3RhdGlvblBhdGg6IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0QmFzZWRBbm5vdGF0aW9uUGF0aChkYXRhRmllbGQuZnVsbHlRdWFsaWZpZWROYW1lKSxcblx0XHRcdFx0XHRcdFx0a2V5OiBrZXksXG5cdFx0XHRcdFx0XHRcdHZpc2libGU6IGNvbXBpbGVCaW5kaW5nKG5vdChlcXVhbChhbm5vdGF0aW9uRXhwcmVzc2lvbihkYXRhRmllbGQuYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4pLCB0cnVlKSkpXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKGRhdGFGaWVsZC5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbj8udmFsdWVPZigpID09PSB0cnVlKSB7XG5cdFx0XHRcdGhpZGRlblRhYmxlQWN0aW9ucy5wdXNoKHtcblx0XHRcdFx0XHR0eXBlOiBBY3Rpb25UeXBlLkRlZmF1bHQsXG5cdFx0XHRcdFx0a2V5OiBLZXlIZWxwZXIuZ2VuZXJhdGVLZXlGcm9tRGF0YUZpZWxkKGRhdGFGaWVsZClcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAodGFibGVBY3Rpb24pIHtcblx0XHRcdFx0dGFibGVBY3Rpb25zLnB1c2godGFibGVBY3Rpb24pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cdHJldHVybiB7XG5cdFx0dGFibGVBY3Rpb25zOiB0YWJsZUFjdGlvbnMsXG5cdFx0aGlkZGVuVGFibGVBY3Rpb25zOiBoaWRkZW5UYWJsZUFjdGlvbnNcblx0fTtcbn1cblxuZnVuY3Rpb24gZ2V0Q3JpdGljYWxpdHlCaW5kaW5nQnlFbnVtKENyaXRpY2FsaXR5RW51bTogRW51bVZhbHVlPENyaXRpY2FsaXR5VHlwZT4pIHtcblx0bGV0IGNyaXRpY2FsaXR5UHJvcGVydHk7XG5cdHN3aXRjaCAoQ3JpdGljYWxpdHlFbnVtKSB7XG5cdFx0Y2FzZSBcIlVJLkNyaXRpY2FsaXR5VHlwZS9OZWdhdGl2ZVwiOlxuXHRcdFx0Y3JpdGljYWxpdHlQcm9wZXJ0eSA9IE1lc3NhZ2VUeXBlLkVycm9yO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBcIlVJLkNyaXRpY2FsaXR5VHlwZS9Dcml0aWNhbFwiOlxuXHRcdFx0Y3JpdGljYWxpdHlQcm9wZXJ0eSA9IE1lc3NhZ2VUeXBlLldhcm5pbmc7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFwiVUkuQ3JpdGljYWxpdHlUeXBlL1Bvc2l0aXZlXCI6XG5cdFx0XHRjcml0aWNhbGl0eVByb3BlcnR5ID0gTWVzc2FnZVR5cGUuU3VjY2Vzcztcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJVSS5Dcml0aWNhbGl0eVR5cGUvSW5mb3JtYXRpb25cIjpcblx0XHRcdGNyaXRpY2FsaXR5UHJvcGVydHkgPSBNZXNzYWdlVHlwZS5JbmZvcm1hdGlvbjtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJVSS5Dcml0aWNhbGl0eVR5cGUvTmV1dHJhbFwiOlxuXHRcdGRlZmF1bHQ6XG5cdFx0XHRjcml0aWNhbGl0eVByb3BlcnR5ID0gTWVzc2FnZVR5cGUuTm9uZTtcblx0fVxuXHRyZXR1cm4gY3JpdGljYWxpdHlQcm9wZXJ0eTtcbn1cblxuZnVuY3Rpb24gZ2V0SGlnaGxpZ2h0Um93QmluZGluZyhcblx0Y3JpdGljYWxpdHlBbm5vdGF0aW9uOiBQYXRoQW5ub3RhdGlvbkV4cHJlc3Npb248Q3JpdGljYWxpdHlUeXBlPiB8IEVudW1WYWx1ZTxDcml0aWNhbGl0eVR5cGU+IHwgdW5kZWZpbmVkLFxuXHRpc0RyYWZ0Um9vdDogYm9vbGVhblxuKTogRXhwcmVzc2lvbjxNZXNzYWdlVHlwZT4ge1xuXHRsZXQgZGVmYXVsdEhpZ2hsaWdodFJvd0RlZmluaXRpb246IE1lc3NhZ2VUeXBlIHwgRXhwcmVzc2lvbjxNZXNzYWdlVHlwZT4gPSBNZXNzYWdlVHlwZS5Ob25lO1xuXHRpZiAoY3JpdGljYWxpdHlBbm5vdGF0aW9uKSB7XG5cdFx0aWYgKHR5cGVvZiBjcml0aWNhbGl0eUFubm90YXRpb24gPT09IFwib2JqZWN0XCIpIHtcblx0XHRcdGRlZmF1bHRIaWdobGlnaHRSb3dEZWZpbml0aW9uID0gYW5ub3RhdGlvbkV4cHJlc3Npb24oY3JpdGljYWxpdHlBbm5vdGF0aW9uKSBhcyBFeHByZXNzaW9uPE1lc3NhZ2VUeXBlPjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gRW51bSBWYWx1ZSBzbyB3ZSBnZXQgdGhlIGNvcnJlc3BvbmRpbmcgc3RhdGljIHBhcnRcblx0XHRcdGRlZmF1bHRIaWdobGlnaHRSb3dEZWZpbml0aW9uID0gZ2V0Q3JpdGljYWxpdHlCaW5kaW5nQnlFbnVtKGNyaXRpY2FsaXR5QW5ub3RhdGlvbik7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBpZkVsc2UoXG5cdFx0aXNEcmFmdFJvb3QgJiYgRHJhZnQuSXNOZXdPYmplY3QsXG5cdFx0TWVzc2FnZVR5cGUuSW5mb3JtYXRpb24gYXMgTWVzc2FnZVR5cGUsXG5cdFx0Zm9ybWF0UmVzdWx0KFtkZWZhdWx0SGlnaGxpZ2h0Um93RGVmaW5pdGlvbl0sIHRhYmxlRm9ybWF0dGVycy5yb3dIaWdobGlnaHRpbmcpXG5cdCk7XG59XG5cbmZ1bmN0aW9uIF9nZXRDcmVhdGlvbkJlaGF2aW91cihcblx0bGluZUl0ZW1Bbm5vdGF0aW9uOiBMaW5lSXRlbSB8IHVuZGVmaW5lZCxcblx0dGFibGVNYW5pZmVzdENvbmZpZ3VyYXRpb246IFRhYmxlQ29udHJvbENvbmZpZ3VyYXRpb24sXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdG5hdmlnYXRpb25TZXR0aW5nczogTmF2aWdhdGlvblNldHRpbmdzQ29uZmlndXJhdGlvblxuKTogVGFibGVBbm5vdGF0aW9uQ29uZmlndXJhdGlvbltcImNyZWF0ZVwiXSB7XG5cdGNvbnN0IG5hdmlnYXRpb24gPSBuYXZpZ2F0aW9uU2V0dGluZ3M/LmNyZWF0ZSB8fCBuYXZpZ2F0aW9uU2V0dGluZ3M/LmRldGFpbDtcblxuXHQvLyBjcm9zcy1hcHBcblx0aWYgKG5hdmlnYXRpb24/Lm91dGJvdW5kICYmIG5hdmlnYXRpb24ub3V0Ym91bmREZXRhaWwgJiYgbmF2aWdhdGlvblNldHRpbmdzPy5jcmVhdGUpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0bW9kZTogXCJFeHRlcm5hbFwiLFxuXHRcdFx0b3V0Ym91bmQ6IG5hdmlnYXRpb24ub3V0Ym91bmQsXG5cdFx0XHRvdXRib3VuZERldGFpbDogbmF2aWdhdGlvbi5vdXRib3VuZERldGFpbCxcblx0XHRcdG5hdmlnYXRpb25TZXR0aW5nczogbmF2aWdhdGlvblNldHRpbmdzXG5cdFx0fTtcblx0fVxuXG5cdGxldCBuZXdBY3Rpb247XG5cdGlmIChsaW5lSXRlbUFubm90YXRpb24pIHtcblx0XHQvLyBpbi1hcHBcblx0XHRjb25zdCB0YXJnZXRFbnRpdHlUeXBlID0gY29udmVydGVyQ29udGV4dC5nZXRBbm5vdGF0aW9uRW50aXR5VHlwZShsaW5lSXRlbUFubm90YXRpb24pO1xuXHRcdGNvbnN0IHRhcmdldEFubm90YXRpb25zID0gY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXRGb3JFbnRpdHlUeXBlKHRhcmdldEVudGl0eVR5cGUpPy5hbm5vdGF0aW9ucztcblx0XHRuZXdBY3Rpb24gPSB0YXJnZXRBbm5vdGF0aW9ucz8uQ29tbW9uPy5EcmFmdFJvb3Q/Lk5ld0FjdGlvbiB8fCB0YXJnZXRBbm5vdGF0aW9ucz8uU2Vzc2lvbj8uU3RpY2t5U2Vzc2lvblN1cHBvcnRlZD8uTmV3QWN0aW9uOyAvLyBUT0RPOiBJcyB0aGVyZSByZWFsbHkgbm8gJ05ld0FjdGlvbicgb24gRHJhZnROb2RlPyB0YXJnZXRBbm5vdGF0aW9ucz8uQ29tbW9uPy5EcmFmdE5vZGU/Lk5ld0FjdGlvblxuXG5cdFx0aWYgKHRhYmxlTWFuaWZlc3RDb25maWd1cmF0aW9uLmNyZWF0aW9uTW9kZSA9PT0gQ3JlYXRpb25Nb2RlLkNyZWF0aW9uUm93ICYmIG5ld0FjdGlvbikge1xuXHRcdFx0Ly8gQSBjb21iaW5hdGlvbiBvZiAnQ3JlYXRpb25Sb3cnIGFuZCAnTmV3QWN0aW9uJyBkb2VzIG5vdCBtYWtlIHNlbnNlXG5cdFx0XHQvLyBUT0RPOiBPciBkb2VzIGl0P1xuXHRcdFx0dGhyb3cgRXJyb3IoYENyZWF0aW9uIG1vZGUgJyR7Q3JlYXRpb25Nb2RlLkNyZWF0aW9uUm93fScgY2FuIG5vdCBiZSB1c2VkIHdpdGggYSBjdXN0b20gJ25ldycgYWN0aW9uICgke25ld0FjdGlvbn0pYCk7XG5cdFx0fVxuXHRcdGlmIChuYXZpZ2F0aW9uPy5yb3V0ZSkge1xuXHRcdFx0Ly8gcm91dGUgc3BlY2lmaWVkXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRtb2RlOiB0YWJsZU1hbmlmZXN0Q29uZmlndXJhdGlvbi5jcmVhdGlvbk1vZGUsXG5cdFx0XHRcdGFwcGVuZDogdGFibGVNYW5pZmVzdENvbmZpZ3VyYXRpb24uY3JlYXRlQXRFbmQsXG5cdFx0XHRcdG5ld0FjdGlvbjogbmV3QWN0aW9uPy50b1N0cmluZygpLFxuXHRcdFx0XHRuYXZpZ2F0ZVRvVGFyZ2V0OiB0YWJsZU1hbmlmZXN0Q29uZmlndXJhdGlvbi5jcmVhdGlvbk1vZGUgPT09IENyZWF0aW9uTW9kZS5OZXdQYWdlID8gbmF2aWdhdGlvbi5yb3V0ZSA6IHVuZGVmaW5lZCAvLyBuYXZpZ2F0ZSBvbmx5IGluIE5ld1BhZ2UgbW9kZVxuXHRcdFx0fTtcblx0XHR9XG5cdH1cblxuXHQvLyBubyBuYXZpZ2F0aW9uIG9yIG5vIHJvdXRlIHNwZWNpZmllZCAtIGZhbGxiYWNrIHRvIGlubGluZSBjcmVhdGUgaWYgb3JpZ2luYWwgY3JlYXRpb24gbW9kZSB3YXMgJ05ld1BhZ2UnXG5cdGlmICh0YWJsZU1hbmlmZXN0Q29uZmlndXJhdGlvbi5jcmVhdGlvbk1vZGUgPT09IENyZWF0aW9uTW9kZS5OZXdQYWdlKSB7XG5cdFx0dGFibGVNYW5pZmVzdENvbmZpZ3VyYXRpb24uY3JlYXRpb25Nb2RlID0gQ3JlYXRpb25Nb2RlLklubGluZTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0bW9kZTogdGFibGVNYW5pZmVzdENvbmZpZ3VyYXRpb24uY3JlYXRpb25Nb2RlLFxuXHRcdGFwcGVuZDogdGFibGVNYW5pZmVzdENvbmZpZ3VyYXRpb24uY3JlYXRlQXRFbmQsXG5cdFx0bmV3QWN0aW9uOiBuZXdBY3Rpb24/LnRvU3RyaW5nKClcblx0fTtcbn1cblxuY29uc3QgX2dldFJvd0NvbmZpZ3VyYXRpb25Qcm9wZXJ0eSA9IGZ1bmN0aW9uKFxuXHRsaW5lSXRlbUFubm90YXRpb246IExpbmVJdGVtIHwgdW5kZWZpbmVkLFxuXHR2aXN1YWxpemF0aW9uUGF0aDogc3RyaW5nLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRuYXZpZ2F0aW9uU2V0dGluZ3M6IE5hdmlnYXRpb25TZXR0aW5nc0NvbmZpZ3VyYXRpb24sXG5cdHRhcmdldFBhdGg6IHN0cmluZ1xuKSB7XG5cdGxldCBwcmVzc1Byb3BlcnR5LCBuYXZpZ2F0aW9uVGFyZ2V0O1xuXHRsZXQgY3JpdGljYWxpdHlQcm9wZXJ0eTogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPE1lc3NhZ2VUeXBlPiA9IE1lc3NhZ2VUeXBlLk5vbmU7XG5cdGNvbnN0IHRhcmdldEVudGl0eVR5cGUgPSBjb252ZXJ0ZXJDb250ZXh0LmdldEFubm90YXRpb25FbnRpdHlUeXBlKGxpbmVJdGVtQW5ub3RhdGlvbik7XG5cdGlmIChuYXZpZ2F0aW9uU2V0dGluZ3MgJiYgbGluZUl0ZW1Bbm5vdGF0aW9uKSB7XG5cdFx0bmF2aWdhdGlvblRhcmdldCA9IG5hdmlnYXRpb25TZXR0aW5ncy5kaXNwbGF5Py50YXJnZXQgfHwgbmF2aWdhdGlvblNldHRpbmdzLmRldGFpbD8ub3V0Ym91bmQ7XG5cdFx0aWYgKG5hdmlnYXRpb25UYXJnZXQpIHtcblx0XHRcdHByZXNzUHJvcGVydHkgPVxuXHRcdFx0XHRcIi5oYW5kbGVycy5vbkNoZXZyb25QcmVzc05hdmlnYXRlT3V0Qm91bmQoICRjb250cm9sbGVyICwnXCIgKyBuYXZpZ2F0aW9uVGFyZ2V0ICsgXCInLCAkeyRwYXJhbWV0ZXJzPmJpbmRpbmdDb250ZXh0fSlcIjtcblx0XHR9IGVsc2UgaWYgKHRhcmdldEVudGl0eVR5cGUpIHtcblx0XHRcdGNvbnN0IHRhcmdldEVudGl0eVNldCA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0Rm9yRW50aXR5VHlwZSh0YXJnZXRFbnRpdHlUeXBlKTtcblx0XHRcdG5hdmlnYXRpb25UYXJnZXQgPSBuYXZpZ2F0aW9uU2V0dGluZ3MuZGV0YWlsPy5yb3V0ZTtcblx0XHRcdGlmIChuYXZpZ2F0aW9uVGFyZ2V0KSB7XG5cdFx0XHRcdGNyaXRpY2FsaXR5UHJvcGVydHkgPSBnZXRIaWdobGlnaHRSb3dCaW5kaW5nKFxuXHRcdFx0XHRcdGxpbmVJdGVtQW5ub3RhdGlvbi5hbm5vdGF0aW9ucz8uVUk/LkNyaXRpY2FsaXR5LFxuXHRcdFx0XHRcdCEhdGFyZ2V0RW50aXR5U2V0Py5hbm5vdGF0aW9ucz8uQ29tbW9uPy5EcmFmdFJvb3QgfHwgISF0YXJnZXRFbnRpdHlTZXQ/LmFubm90YXRpb25zPy5Db21tb24/LkRyYWZ0Tm9kZVxuXHRcdFx0XHQpO1xuXHRcdFx0XHRwcmVzc1Byb3BlcnR5ID1cblx0XHRcdFx0XHRcIi5fb25UYWJsZVJvd1ByZXNzKCR7JHBhcmFtZXRlcnM+YmluZGluZ0NvbnRleHR9LCB7IGNhbGxFeHRlbnNpb246IHRydWUsIHRhcmdldFBhdGg6ICdcIiArXG5cdFx0XHRcdFx0dGFyZ2V0UGF0aCArXG5cdFx0XHRcdFx0XCInLCBlZGl0YWJsZSA6IFwiICtcblx0XHRcdFx0XHQodGFyZ2V0RW50aXR5U2V0Py5hbm5vdGF0aW9ucz8uQ29tbW9uPy5EcmFmdFJvb3QgfHwgdGFyZ2V0RW50aXR5U2V0Py5hbm5vdGF0aW9ucz8uQ29tbW9uPy5EcmFmdE5vZGVcblx0XHRcdFx0XHRcdD8gXCIhJHskcGFyYW1ldGVycz5iaW5kaW5nQ29udGV4dH0uZ2V0UHJvcGVydHkoJ0lzQWN0aXZlRW50aXR5JylcIlxuXHRcdFx0XHRcdFx0OiBcInVuZGVmaW5lZFwiKSArXG5cdFx0XHRcdFx0XCJ9KVwiOyAvL05lZWQgdG8gYWNjZXNzIHRvIERyYWZ0Um9vdCBhbmQgRHJhZnROb2RlICEhISEhISFcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNyaXRpY2FsaXR5UHJvcGVydHkgPSBnZXRIaWdobGlnaHRSb3dCaW5kaW5nKGxpbmVJdGVtQW5ub3RhdGlvbi5hbm5vdGF0aW9ucz8uVUk/LkNyaXRpY2FsaXR5LCBmYWxzZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdGNvbnN0IHJvd05hdmlnYXRlZEV4cHJlc3Npb246IEV4cHJlc3Npb248Ym9vbGVhbj4gPSBmb3JtYXRSZXN1bHQoXG5cdFx0W2JpbmRpbmdFeHByZXNzaW9uKFwiL2RlZXBlc3RQYXRoXCIsIFwiaW50ZXJuYWxcIildLFxuXHRcdHRhYmxlRm9ybWF0dGVycy5uYXZpZ2F0ZWRSb3csXG5cdFx0dGFyZ2V0RW50aXR5VHlwZVxuXHQpO1xuXHRyZXR1cm4ge1xuXHRcdHByZXNzOiBwcmVzc1Byb3BlcnR5LFxuXHRcdGFjdGlvbjogcHJlc3NQcm9wZXJ0eSA/IFwiTmF2aWdhdGlvblwiIDogdW5kZWZpbmVkLFxuXHRcdHJvd0hpZ2hsaWdodGluZzogY29tcGlsZUJpbmRpbmcoY3JpdGljYWxpdHlQcm9wZXJ0eSksXG5cdFx0cm93TmF2aWdhdGVkOiBjb21waWxlQmluZGluZyhyb3dOYXZpZ2F0ZWRFeHByZXNzaW9uKVxuXHR9O1xufTtcblxuLyoqXG4gKiBSZXRyaWV2ZSB0aGUgY29sdW1ucyBmcm9tIHRoZSBlbnRpdHlUeXBlLlxuICpcbiAqIEBwYXJhbSBjb2x1bW5zVG9CZUNyZWF0ZWQgVGhlIGNvbHVtbnMgdG8gYmUgY3JlYXRlZC5cbiAqIEBwYXJhbSBlbnRpdHlUeXBlIFRoZSB0YXJnZXQgZW50aXR5IHR5cGUuXG4gKiBAcGFyYW0gYW5ub3RhdGlvbkNvbHVtbnMgVGhlIGFycmF5IG9mIGNvbHVtbnMgY3JlYXRlZCBiYXNlZCBvbiBMaW5lSXRlbSBhbm5vdGF0aW9ucy5cbiAqIEBwYXJhbSBub25Tb3J0YWJsZUNvbHVtbnMgVGhlIGFycmF5IG9mIGFsbCBub24gc29ydGFibGUgY29sdW1uIG5hbWVzLlxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHQgVGhlIGNvbnZlcnRlciBjb250ZXh0LlxuICogQHJldHVybnMge0Fubm90YXRpb25UYWJsZUNvbHVtbltdfSB0aGUgY29sdW1uIGZyb20gdGhlIGVudGl0eVR5cGVcbiAqL1xuZXhwb3J0IGNvbnN0IGdldENvbHVtbnNGcm9tRW50aXR5VHlwZSA9IGZ1bmN0aW9uKFxuXHRjb2x1bW5zVG9CZUNyZWF0ZWQ6IFJlY29yZDxzdHJpbmcsIENvbGxlY3RlZFByb3BlcnRpZXM+LFxuXHRlbnRpdHlUeXBlOiBFbnRpdHlUeXBlLFxuXHRhbm5vdGF0aW9uQ29sdW1uczogQW5ub3RhdGlvblRhYmxlQ29sdW1uW10gPSBbXSxcblx0bm9uU29ydGFibGVDb2x1bW5zOiBzdHJpbmdbXSxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dFxuKTogQW5ub3RhdGlvblRhYmxlQ29sdW1uW10ge1xuXHRjb25zdCB0YWJsZUNvbHVtbnM6IEFubm90YXRpb25UYWJsZUNvbHVtbltdID0gW107XG5cdC8vIENhdGNoIGFscmVhZHkgZXhpc3RpbmcgY29sdW1ucyAtIHdoaWNoIHdlcmUgYWRkZWQgYmVmb3JlIGJ5IExpbmVJdGVtIEFubm90YXRpb25zXG5cdGNvbnN0IGFnZ3JlZ2F0aW9uSGVscGVyID0gbmV3IEFnZ3JlZ2F0aW9uSGVscGVyKGVudGl0eVR5cGUsIGNvbnZlcnRlckNvbnRleHQpO1xuXG5cdGVudGl0eVR5cGUuZW50aXR5UHJvcGVydGllcy5mb3JFYWNoKChwcm9wZXJ0eTogUHJvcGVydHkpID0+IHtcblx0XHQvLyBDYXRjaCBhbHJlYWR5IGV4aXN0aW5nIGNvbHVtbnMgLSB3aGljaCB3ZXJlIGFkZGVkIGJlZm9yZSBieSBMaW5lSXRlbSBBbm5vdGF0aW9uc1xuXHRcdGNvbnN0IGV4aXN0cyA9IGFubm90YXRpb25Db2x1bW5zLnNvbWUoY29sdW1uID0+IHtcblx0XHRcdHJldHVybiBjb2x1bW4ubmFtZSA9PT0gcHJvcGVydHkubmFtZTtcblx0XHR9KTtcblxuXHRcdC8vIGlmIHRhcmdldCB0eXBlIGV4aXN0cywgaXQgaXMgYSBjb21wbGV4IHByb3BlcnR5IGFuZCBzaG91bGQgYmUgaWdub3JlZFxuXHRcdGlmICghcHJvcGVydHkudGFyZ2V0VHlwZSAmJiAhZXhpc3RzKSB7XG5cdFx0XHRjb25zdCBkZXNjcmlwdGlvbiA9IGNvbHVtbnNUb0JlQ3JlYXRlZC5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eS5uYW1lKVxuXHRcdFx0XHQ/IGNvbHVtbnNUb0JlQ3JlYXRlZFtwcm9wZXJ0eS5uYW1lXS5kZXNjcmlwdGlvblxuXHRcdFx0XHQ6IHVuZGVmaW5lZDtcblx0XHRcdGNvbnN0IGZpZWxkR3JvdXAgPSBjb2x1bW5zVG9CZUNyZWF0ZWQuaGFzT3duUHJvcGVydHkocHJvcGVydHkubmFtZSkgPyBjb2x1bW5zVG9CZUNyZWF0ZWRbcHJvcGVydHkubmFtZV0uZmllbGRHcm91cCA6IHVuZGVmaW5lZDtcblx0XHRcdGNvbnN0IHJlbGF0ZWRQcm9wZXJ0aWVzSW5mbzogQ29tcGxleFByb3BlcnR5SW5mbyA9IGNvbGxlY3RSZWxhdGVkUHJvcGVydGllcyhwcm9wZXJ0eS5uYW1lLCBwcm9wZXJ0eSwgY29udmVydGVyQ29udGV4dCwgdHJ1ZSk7XG5cdFx0XHRjb25zdCByZWxhdGVkUHJvcGVydHlOYW1lczogc3RyaW5nW10gPSBPYmplY3Qua2V5cyhyZWxhdGVkUHJvcGVydGllc0luZm8ucHJvcGVydGllcyk7XG5cdFx0XHRjb25zdCBjb2x1bW5JbmZvID0gZ2V0Q29sdW1uRGVmaW5pdGlvbkZyb21Qcm9wZXJ0eShcblx0XHRcdFx0cHJvcGVydHksXG5cdFx0XHRcdGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0QmFzZWRBbm5vdGF0aW9uUGF0aChwcm9wZXJ0eS5mdWxseVF1YWxpZmllZE5hbWUpLFxuXHRcdFx0XHRwcm9wZXJ0eS5uYW1lLFxuXHRcdFx0XHR0cnVlLFxuXHRcdFx0XHR0cnVlLFxuXHRcdFx0XHRub25Tb3J0YWJsZUNvbHVtbnMsXG5cdFx0XHRcdGFnZ3JlZ2F0aW9uSGVscGVyLFxuXHRcdFx0XHRjb252ZXJ0ZXJDb250ZXh0LFxuXHRcdFx0XHRkZXNjcmlwdGlvbixcblx0XHRcdFx0ZmllbGRHcm91cFxuXHRcdFx0KTtcblx0XHRcdGlmIChyZWxhdGVkUHJvcGVydHlOYW1lcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdGNvbHVtbkluZm8ucHJvcGVydHlJbmZvcyA9IHJlbGF0ZWRQcm9wZXJ0eU5hbWVzO1xuXHRcdFx0XHRjb2x1bW5JbmZvLmV4cG9ydFNldHRpbmdzID0ge1xuXHRcdFx0XHRcdC4uLmNvbHVtbkluZm8uZXhwb3J0U2V0dGluZ3MsXG5cdFx0XHRcdFx0dGVtcGxhdGU6IHJlbGF0ZWRQcm9wZXJ0aWVzSW5mby5leHBvcnRTZXR0aW5nc1RlbXBsYXRlXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0Ly8gQ29sbGVjdCBpbmZvcm1hdGlvbiBvZiByZWxhdGVkIGNvbHVtbnMgdG8gYmUgY3JlYXRlZC5cblx0XHRcdFx0cmVsYXRlZFByb3BlcnR5TmFtZXMuZm9yRWFjaChuYW1lID0+IHtcblx0XHRcdFx0XHRjb2x1bW5zVG9CZUNyZWF0ZWRbbmFtZV0gPSByZWxhdGVkUHJvcGVydGllc0luZm8ucHJvcGVydGllc1tuYW1lXTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdHRhYmxlQ29sdW1ucy5wdXNoKGNvbHVtbkluZm8pO1xuXHRcdH1cblx0fSk7XG5cdHJldHVybiB0YWJsZUNvbHVtbnM7XG59O1xuXG4vKipcbiAqIENyZWF0ZSBhIGNvbHVtbiBkZWZpbml0aW9uIGZyb20gYSBwcm9wZXJ0eS5cbiAqIEBwYXJhbSBwcm9wZXJ0eSB7UHJvcGVydHl9IEVudGl0eSB0eXBlIHByb3BlcnR5IGZvciB3aGljaCB0aGUgY29sdW1uIGlzIGNyZWF0ZWRcbiAqIEBwYXJhbSBmdWxsUHJvcGVydHlQYXRoIHtzdHJpbmd9IHRoZSBmdWxsIHBhdGggdG8gdGhlIHRhcmdldCBwcm9wZXJ0eVxuICogQHBhcmFtIHJlbGF0aXZlUGF0aCB7c3RyaW5nfSB0aGUgcmVsYXRpdmUgcGF0aCB0byB0aGUgdGFyZ2V0IHByb3BlcnR5IGJhc2VkIG9uIHRoZSBjb250ZXh0XG4gKiBAcGFyYW0gdXNlRGF0YUZpZWxkUHJlZml4IHtib29sZWFufSBzaG91bGQgYmUgcHJlZml4ZWQgd2l0aCBcIkRhdGFGaWVsZDo6XCIsIGVsc2UgaXQgd2lsbCBiZSBwcmVmaXhlZCB3aXRoIFwiUHJvcGVydHk6OlwiXG4gKiBAcGFyYW0gYXZhaWxhYmxlRm9yQWRhcHRhdGlvbiB7Ym9vbGVhbn0gZGVjaWRlcyB3aGV0aGVyIGNvbHVtbiBzaG91bGQgYmUgYXZhaWxhYmxlIGZvciBhZGFwdGF0aW9uXG4gKiBAcGFyYW0gbm9uU29ydGFibGVDb2x1bW5zIHtzdHJpbmdbXX0gdGhlIGFycmF5IG9mIGFsbCBub24gc29ydGFibGUgY29sdW1uIG5hbWVzXG4gKiBAcGFyYW0gYWdncmVnYXRpb25IZWxwZXIge0FnZ3JlZ2F0aW9uSGVscGVyfSB0aGUgYWdncmVnYXRpb25IZWxwZXIgZm9yIHRoZSBlbnRpdHlcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0IHtDb252ZXJ0ZXJDb250ZXh0fSB0aGUgY29udmVydGVyIGNvbnRleHRcbiAqIEBwYXJhbSBkZXNjcmlwdGlvblByb3BlcnR5IHtQcm9wZXJ0eX0gRW50aXR5IHR5cGUgcHJvcGVydHkgZm9yIHRoZSBjb2x1bW4gY29udGFpbmluZyB0aGUgZGVzY3JpcHRpb25cbiAqIEBwYXJhbSBmaWVsZEdyb3VwIHtEYXRhRmllbGRBYnN0cmFjdFR5cGVzfSBGaWVsZEdyb3VwIGRhdGFmaWVsZCBmb3IgdGhlIGNvbHVtbiBjb250YWluaW5nIHRoZSBwcm9wZXJ0eVxuICogQHJldHVybnMge0Fubm90YXRpb25UYWJsZUNvbHVtbn0gdGhlIGFubm90YXRpb24gY29sdW1uIGRlZmluaXRpb25cbiAqL1xuY29uc3QgZ2V0Q29sdW1uRGVmaW5pdGlvbkZyb21Qcm9wZXJ0eSA9IGZ1bmN0aW9uKFxuXHRwcm9wZXJ0eTogUHJvcGVydHksXG5cdGZ1bGxQcm9wZXJ0eVBhdGg6IHN0cmluZyxcblx0cmVsYXRpdmVQYXRoOiBzdHJpbmcsXG5cdHVzZURhdGFGaWVsZFByZWZpeDogYm9vbGVhbixcblx0YXZhaWxhYmxlRm9yQWRhcHRhdGlvbjogYm9vbGVhbixcblx0bm9uU29ydGFibGVDb2x1bW5zOiBzdHJpbmdbXSxcblx0YWdncmVnYXRpb25IZWxwZXI6IEFnZ3JlZ2F0aW9uSGVscGVyLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRkZXNjcmlwdGlvblByb3BlcnR5PzogUHJvcGVydHksXG5cdGZpZWxkR3JvdXA/OiBEYXRhRmllbGRBYnN0cmFjdFR5cGVzXG4pOiBBbm5vdGF0aW9uVGFibGVDb2x1bW4ge1xuXHRjb25zdCBuYW1lID0gdXNlRGF0YUZpZWxkUHJlZml4ID8gcmVsYXRpdmVQYXRoIDogXCJQcm9wZXJ0eTo6XCIgKyByZWxhdGl2ZVBhdGg7XG5cdGNvbnN0IGtleSA9ICh1c2VEYXRhRmllbGRQcmVmaXggPyBcIkRhdGFGaWVsZDo6XCIgOiBcIlByb3BlcnR5OjpcIikgKyByZXBsYWNlU3BlY2lhbENoYXJzKHJlbGF0aXZlUGF0aCk7XG5cdGNvbnN0IHNlbWFudGljT2JqZWN0QW5ub3RhdGlvblBhdGggPSBnZXRTZW1hbnRpY09iamVjdFBhdGgoY29udmVydGVyQ29udGV4dCwgcHJvcGVydHkuZnVsbHlRdWFsaWZpZWROYW1lKTtcblx0Y29uc3QgaXNIaWRkZW4gPSBwcm9wZXJ0eS5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbj8udmFsdWVPZigpID09PSB0cnVlO1xuXHRjb25zdCBncm91cFBhdGg6IHN0cmluZyB8IHVuZGVmaW5lZCA9IHByb3BlcnR5Lm5hbWUgPyBfc2xpY2VBdFNsYXNoKHByb3BlcnR5Lm5hbWUsIHRydWUsIGZhbHNlKSA6IHVuZGVmaW5lZDtcblx0Y29uc3QgaXNHcm91cDogYm9vbGVhbiA9IGdyb3VwUGF0aCAhPSBwcm9wZXJ0eS5uYW1lO1xuXHRjb25zdCBzTGFiZWw6IHN0cmluZyB8IHVuZGVmaW5lZCA9IF9nZXRMYWJlbChwcm9wZXJ0eSwgaXNHcm91cCk7XG5cdGNvbnN0IGV4cG9ydExhYmVsczogKHN0cmluZyB8IHVuZGVmaW5lZClbXSB8IHVuZGVmaW5lZCA9XG5cdFx0ZGVzY3JpcHRpb25Qcm9wZXJ0eSB8fCBmaWVsZEdyb3VwIHx8IG5hbWUuaW5kZXhPZihcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhUG9pbnRcIikgPiAtMVxuXHRcdFx0PyBfZ2V0RXhwb3J0TGFiZWwoc0xhYmVsLCBuYW1lLCB7XG5cdFx0XHRcdFx0dmFsdWU6IHByb3BlcnR5LFxuXHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBkZXNjcmlwdGlvblByb3BlcnR5LFxuXHRcdFx0XHRcdGZpZWxkR3JvdXA6IGZpZWxkR3JvdXBcblx0XHRcdCAgfSlcblx0XHRcdDogdW5kZWZpbmVkO1xuXG5cdHJldHVybiB7XG5cdFx0a2V5OiBrZXksXG5cdFx0aXNHcm91cGFibGU6IGFnZ3JlZ2F0aW9uSGVscGVyLmlzUHJvcGVydHlHcm91cGFibGUocHJvcGVydHkpLFxuXHRcdHR5cGU6IENvbHVtblR5cGUuQW5ub3RhdGlvbixcblx0XHRsYWJlbDogc0xhYmVsLFxuXHRcdGdyb3VwTGFiZWw6IGlzR3JvdXAgPyBfZ2V0TGFiZWwocHJvcGVydHkpIDogbnVsbCxcblx0XHRncm91cDogaXNHcm91cCA/IGdyb3VwUGF0aCA6IG51bGwsXG5cdFx0YW5ub3RhdGlvblBhdGg6IGZ1bGxQcm9wZXJ0eVBhdGgsXG5cdFx0c2VtYW50aWNPYmplY3RQYXRoOiBzZW1hbnRpY09iamVjdEFubm90YXRpb25QYXRoLFxuXHRcdC8vIEEgZmFrZSBwcm9wZXJ0eSB3YXMgY3JlYXRlZCBmb3IgdGhlIFRhcmdldFZhbHVlIHVzZWQgb24gRGF0YVBvaW50cywgdGhpcyBwcm9wZXJ0eSBzaG91bGQgYmUgaGlkZGVuIGFuZCBub24gc29ydGFibGVcblx0XHRhdmFpbGFiaWxpdHk6XG5cdFx0XHQhYXZhaWxhYmxlRm9yQWRhcHRhdGlvbiB8fCBpc0hpZGRlbiB8fCBuYW1lLmluZGV4T2YoXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YVBvaW50XCIpID4gLTFcblx0XHRcdFx0PyBBdmFpbGFiaWxpdHlUeXBlLkhpZGRlblxuXHRcdFx0XHQ6IEF2YWlsYWJpbGl0eVR5cGUuQWRhcHRhdGlvbixcblx0XHRuYW1lOiBuYW1lLFxuXHRcdHJlbGF0aXZlUGF0aDogcmVsYXRpdmVQYXRoLFxuXHRcdHNvcnRhYmxlOlxuXHRcdFx0IWlzSGlkZGVuICYmIG5vblNvcnRhYmxlQ29sdW1ucy5pbmRleE9mKHJlbGF0aXZlUGF0aCkgPT09IC0xICYmICEobmFtZS5pbmRleE9mKFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFQb2ludFwiKSA+IC0xKSxcblx0XHRleHBvcnRTZXR0aW5nczoge1xuXHRcdFx0bGFiZWxzOiBleHBvcnRMYWJlbHNcblx0XHR9LFxuXHRcdGlzS2V5OiBwcm9wZXJ0eS5pc0tleVxuXHR9IGFzIEFubm90YXRpb25UYWJsZUNvbHVtbjtcbn07XG5cbi8qKlxuICogUmV0dXJucyBib29sZWFuIHRydWUgZm9yIHZhbGlkIGNvbHVtbnMsIGZhbHNlIGZvciBpbnZhbGlkIGNvbHVtbnMuXG4gKlxuICogQHBhcmFtIHtEYXRhRmllbGRBYnN0cmFjdFR5cGVzfSBkYXRhRmllbGQgRGlmZmVyZW50IERhdGFGaWVsZCB0eXBlcyBkZWZpbmVkIGluIHRoZSBhbm5vdGF0aW9uc1xuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgZm9yIHZhbGlkIGNvbHVtbnMsIGZhbHNlIGZvciBpbnZhbGlkIGNvbHVtbnNcbiAqIEBwcml2YXRlXG4gKi9cbmNvbnN0IF9pc1ZhbGlkQ29sdW1uID0gZnVuY3Rpb24oZGF0YUZpZWxkOiBEYXRhRmllbGRBYnN0cmFjdFR5cGVzKSB7XG5cdHN3aXRjaCAoZGF0YUZpZWxkLiRUeXBlKSB7XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JBY3Rpb246XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb246XG5cdFx0XHRyZXR1cm4gISFkYXRhRmllbGQuSW5saW5lO1xuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkV2l0aEFjdGlvbjpcblx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZFdpdGhJbnRlbnRCYXNlZE5hdmlnYXRpb246XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGQ6XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRXaXRoVXJsOlxuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9yQW5ub3RhdGlvbjpcblx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZFdpdGhOYXZpZ2F0aW9uUGF0aDpcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdGRlZmF1bHQ6XG5cdFx0Ly8gVG9kbzogUmVwbGFjZSB3aXRoIHByb3BlciBMb2cgc3RhdGVtZW50IG9uY2UgYXZhaWxhYmxlXG5cdFx0Ly8gIHRocm93IG5ldyBFcnJvcihcIlVuaGFuZGxlZCBEYXRhRmllbGQgQWJzdHJhY3QgdHlwZTogXCIgKyBkYXRhRmllbGQuJFR5cGUpO1xuXHR9XG59O1xuXG4vKipcbiAqIFJldHVybnMgbGFiZWwgZm9yIHByb3BlcnR5IGFuZCBkYXRhRmllbGQuXG4gKiBAcGFyYW0ge0RhdGFGaWVsZEFic3RyYWN0VHlwZXMgfCBQcm9wZXJ0eX0gcHJvcGVydHkgRW50aXR5IHR5cGUgcHJvcGVydHkgb3IgRGF0YUZpZWxkIGRlZmluZWQgaW4gdGhlIGFubm90YXRpb25zXG4gKiBAcGFyYW0gaXNHcm91cFxuICogQHJldHVybnMge3N0cmluZ30gTGFiZWwgb2YgdGhlIHByb3BlcnR5IG9yIERhdGFGaWVsZFxuICogQHByaXZhdGVcbiAqL1xuY29uc3QgX2dldExhYmVsID0gZnVuY3Rpb24ocHJvcGVydHk6IERhdGFGaWVsZEFic3RyYWN0VHlwZXMgfCBQcm9wZXJ0eSwgaXNHcm91cDogYm9vbGVhbiA9IGZhbHNlKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcblx0aWYgKCFwcm9wZXJ0eSkge1xuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdH1cblx0aWYgKGlzUHJvcGVydHkocHJvcGVydHkpKSB7XG5cdFx0Y29uc3QgZGF0YUZpZWxkRGVmYXVsdCA9IHByb3BlcnR5LmFubm90YXRpb25zPy5VST8uRGF0YUZpZWxkRGVmYXVsdDtcblx0XHRpZiAoZGF0YUZpZWxkRGVmYXVsdCAmJiAhZGF0YUZpZWxkRGVmYXVsdC5xdWFsaWZpZXIgJiYgZGF0YUZpZWxkRGVmYXVsdC5MYWJlbD8udmFsdWVPZigpKSB7XG5cdFx0XHRyZXR1cm4gY29tcGlsZUJpbmRpbmcoYW5ub3RhdGlvbkV4cHJlc3Npb24oZGF0YUZpZWxkRGVmYXVsdC5MYWJlbD8udmFsdWVPZigpKSk7XG5cdFx0fVxuXHRcdHJldHVybiBjb21waWxlQmluZGluZyhhbm5vdGF0aW9uRXhwcmVzc2lvbihwcm9wZXJ0eS5hbm5vdGF0aW9ucy5Db21tb24/LkxhYmVsPy52YWx1ZU9mKCkgfHwgcHJvcGVydHkubmFtZSkpO1xuXHR9IGVsc2UgaWYgKGlzRGF0YUZpZWxkVHlwZXMocHJvcGVydHkpKSB7XG5cdFx0aWYgKCEhaXNHcm91cCAmJiBwcm9wZXJ0eS4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkV2l0aEludGVudEJhc2VkTmF2aWdhdGlvbikge1xuXHRcdFx0cmV0dXJuIGNvbXBpbGVCaW5kaW5nKGFubm90YXRpb25FeHByZXNzaW9uKHByb3BlcnR5LkxhYmVsPy52YWx1ZU9mKCkpKTtcblx0XHR9XG5cdFx0cmV0dXJuIGNvbXBpbGVCaW5kaW5nKFxuXHRcdFx0YW5ub3RhdGlvbkV4cHJlc3Npb24oXG5cdFx0XHRcdHByb3BlcnR5LkxhYmVsPy52YWx1ZU9mKCkgfHwgcHJvcGVydHkuVmFsdWU/LiR0YXJnZXQ/LmFubm90YXRpb25zPy5Db21tb24/LkxhYmVsPy52YWx1ZU9mKCkgfHwgcHJvcGVydHkuVmFsdWU/LiR0YXJnZXQ/Lm5hbWVcblx0XHRcdClcblx0XHQpO1xuXHR9IGVsc2UgaWYgKHByb3BlcnR5LiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JBbm5vdGF0aW9uKSB7XG5cdFx0cmV0dXJuIGNvbXBpbGVCaW5kaW5nKFxuXHRcdFx0YW5ub3RhdGlvbkV4cHJlc3Npb24oXG5cdFx0XHRcdHByb3BlcnR5LkxhYmVsPy52YWx1ZU9mKCkgfHwgcHJvcGVydHkuVGFyZ2V0Py4kdGFyZ2V0Py5WYWx1ZT8uJHRhcmdldD8uYW5ub3RhdGlvbnM/LkNvbW1vbj8uTGFiZWw/LnZhbHVlT2YoKVxuXHRcdFx0KVxuXHRcdCk7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIGNvbXBpbGVCaW5kaW5nKGFubm90YXRpb25FeHByZXNzaW9uKHByb3BlcnR5LkxhYmVsPy52YWx1ZU9mKCkpKTtcblx0fVxufTtcblxuLyoqXG4gKiBSZXR1cm5zIGFuIGFycmF5IG9mIGV4cG9ydCBsYWJlbHMgYXMgcHJvcGVydGllcyBjb3VsZCBpbmhlcml0ZWQgZnJvbSBGaWVsZEdyb3VwcyBhbmQgd2Ugd2FudFxuICogdG8ga2VlcCBGaWVscEdyb3VwIGxhYmVsIGFuZCBwcm9wZXJ0eSBsYWJlbC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc0xhYmVsIHByb3BlcnR5J3MgbGFiZWxcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb2x1bW5OYW1lIFRoaXMgY29sdW1uIG5hbWVkIGlzIG9ubHkgdXNlZCB0byBpZGVudGlmeSBkdW1teSBwcm9wZXJ0eSBjcmVhdGVkIGZvciB0aGUgVGFyZ2V0VmFsdWUgaW4gRGF0YVBvaW50c1xuICogQHBhcmFtIHtDb2xsZWN0ZWRQcm9wZXJ0aWVzfSBwcm9wZXJ0aWVzIHByb3BlcnRpZXMgY29sbGVjdGVkIGZyb20gcHJvcGVydHkgKGl0IGNvdWxkIGJlIGEgZGVzY3JpcHRpb24gb3IgRmllbGRHcm91cClcbiAqIEByZXR1cm5zIHtzdHJpbmdbXX0gdGhlIGFycmF5IG9mIGxhYmVscyB0byBiZSBjb25zaWRlcmVkIG9uIHRoZSBleHBvcnRTZXR0aW5ncy5cbiAqIEBwcml2YXRlXG4gKi9cbmNvbnN0IF9nZXRFeHBvcnRMYWJlbCA9IGZ1bmN0aW9uKHNMYWJlbDogc3RyaW5nIHwgdW5kZWZpbmVkLCBjb2x1bW5OYW1lOiBzdHJpbmcsIHByb3BlcnRpZXM6IENvbGxlY3RlZFByb3BlcnRpZXMpOiAoc3RyaW5nIHwgdW5kZWZpbmVkKVtdIHtcblx0bGV0IGV4cG9ydExhYmVsczogKHN0cmluZyB8IHVuZGVmaW5lZClbXSA9IFtdO1xuXHRpZiAocHJvcGVydGllcy5kZXNjcmlwdGlvbikge1xuXHRcdGNvbnN0IGRlc2NyaXB0aW9uTGFiZWw6IHN0cmluZyB8IHVuZGVmaW5lZCA9IF9nZXRMYWJlbChwcm9wZXJ0aWVzLmRlc2NyaXB0aW9uKTtcblx0XHRleHBvcnRMYWJlbHMucHVzaChkZXNjcmlwdGlvbkxhYmVsKTtcblx0fVxuXHRpZiAocHJvcGVydGllcy5maWVsZEdyb3VwKSB7XG5cdFx0Y29uc3QgZmllbGRHcm91cExhYmVsOiBzdHJpbmcgfCB1bmRlZmluZWQgPSBfZ2V0TGFiZWwocHJvcGVydGllcy5maWVsZEdyb3VwKTtcblx0XHRleHBvcnRMYWJlbHMucHVzaChmaWVsZEdyb3VwTGFiZWwpO1xuXHR9XG5cdGV4cG9ydExhYmVscy5wdXNoKHNMYWJlbCk7XG5cdC8vIFJlbW92ZSBkdXBsaWNhdGUgbGFiZWxzIChlLmcuIEZpZWxkR3JvdXAgbGFiZWwgaXMgdGhlIHNhbWUgYXMgdGhlIGxhYmVsIG9mIG9uZSBvZiB0aGUgcHJvcGVydGllcylcblx0ZXhwb3J0TGFiZWxzID0gZXhwb3J0TGFiZWxzLmZpbHRlcihmdW5jdGlvbihsYWJlbCwgaW5kZXgpIHtcblx0XHRpZiAoZXhwb3J0TGFiZWxzLmluZGV4T2YobGFiZWwpID09IGluZGV4KSB7XG5cdFx0XHRyZXR1cm4gbGFiZWw7XG5cdFx0fVxuXHR9KTtcblxuXHQvLyBTZXQgZXhwb3J0IGxhYmVsIGZvciBGYWtlIHByb3BlcnR5IGNvbnRhaW5pbmcgRGF0YXBvaW50IFRhcmdldFZhbHVlXG5cdGlmIChjb2x1bW5OYW1lPy5pbmRleE9mKFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFQb2ludFwiKSA+IC0xKSB7XG5cdFx0ZXhwb3J0TGFiZWxzLnB1c2goXCJEYXRhUG9pbnQuVGFyZ2V0VmFsdWVcIik7XG5cdH1cblxuXHRyZXR1cm4gZXhwb3J0TGFiZWxzO1xufTtcbi8qKlxuICogQ3JlYXRlIGEgUHJvcGVydHlJbmZvIGZvciBlYWNoIGlkZW50aWZpZWQgcHJvcGVydHkgY29uc3VtZWQgYnkgYSBMaW5lSXRlbS5cbiAqIEBwYXJhbSBjb2x1bW5zVG9CZUNyZWF0ZWQge1JlY29yZDxzdHJpbmcsIFByb3BlcnR5Pn0gSWRlbnRpZmllZCBwcm9wZXJ0aWVzLlxuICogQHBhcmFtIGV4aXN0aW5nQ29sdW1ucyBUaGUgbGlzdCBvZiBjb2x1bW5zIGNyZWF0ZWQgZm9yIExpbmVJdGVtcyBhbmQgUHJvcGVydGllcyBvZiBlbnRpdHlUeXBlLlxuICogQHBhcmFtIG5vblNvcnRhYmxlQ29sdW1ucyBUaGUgYXJyYXkgb2YgY29sdW1uIG5hbWVzIHdoaWNoIGNhbm5vdCBiZSBzb3J0ZWQuXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dCBUaGUgY29udmVydGVyIGNvbnRleHQuXG4gKiBAcGFyYW0gZW50aXR5VHlwZSBUaGUgZW50aXR5IHR5cGUgZm9yIHRoZSBMaW5lSXRlbVxuICogQHJldHVybnMge0Fubm90YXRpb25UYWJsZUNvbHVtbltdfSB0aGUgYXJyYXkgb2YgY29sdW1ucyBjcmVhdGVkLlxuICovXG5jb25zdCBfY3JlYXRlUmVsYXRlZENvbHVtbnMgPSBmdW5jdGlvbihcblx0Y29sdW1uc1RvQmVDcmVhdGVkOiBSZWNvcmQ8c3RyaW5nLCBDb2xsZWN0ZWRQcm9wZXJ0aWVzPixcblx0ZXhpc3RpbmdDb2x1bW5zOiBBbm5vdGF0aW9uVGFibGVDb2x1bW5bXSxcblx0bm9uU29ydGFibGVDb2x1bW5zOiBzdHJpbmdbXSxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCxcblx0ZW50aXR5VHlwZTogRW50aXR5VHlwZVxuKTogQW5ub3RhdGlvblRhYmxlQ29sdW1uW10ge1xuXHRjb25zdCByZWxhdGVkQ29sdW1uczogQW5ub3RhdGlvblRhYmxlQ29sdW1uW10gPSBbXTtcblx0Y29uc3QgcmVsYXRlZFByb3BlcnR5TmFtZU1hcDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuXHRjb25zdCBhZ2dyZWdhdGlvbkhlbHBlciA9IG5ldyBBZ2dyZWdhdGlvbkhlbHBlcihlbnRpdHlUeXBlLCBjb252ZXJ0ZXJDb250ZXh0KTtcblxuXHRPYmplY3Qua2V5cyhjb2x1bW5zVG9CZUNyZWF0ZWQpLmZvckVhY2gobmFtZSA9PiB7XG5cdFx0Y29uc3QgeyB2YWx1ZSwgZGVzY3JpcHRpb24sIGZpZWxkR3JvdXAgfSA9IGNvbHVtbnNUb0JlQ3JlYXRlZFtuYW1lXSxcblx0XHRcdGFubm90YXRpb25QYXRoID0gY29udmVydGVyQ29udGV4dC5nZXRBYnNvbHV0ZUFubm90YXRpb25QYXRoKG5hbWUpLFxuXHRcdFx0Ly8gQ2hlY2sgd2hldGhlciB0aGUgcmVsYXRlZCBjb2x1bW4gYWxyZWFkeSBleGlzdHMuXG5cdFx0XHRyZWxhdGVkQ29sdW1uID0gZXhpc3RpbmdDb2x1bW5zLmZpbmQoY29sdW1uID0+IGNvbHVtbi5uYW1lID09PSBuYW1lKTtcblx0XHRpZiAocmVsYXRlZENvbHVtbiA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHQvLyBDYXNlIDE6IENyZWF0ZSBhIG5ldyBwcm9wZXJ0eSBjb2x1bW4sIHRoaXMgcHJvcGVydHkgc2hvdWxkbid0IGJlIGhpZGRlblxuXHRcdFx0Ly8gYXMgaXQgY291bGQgYWRkZWQvcmVtb3ZlZCB2aWEgdGFibGUgcGVyc29uYWxpemF0aW9uIGRpYWxvZy5cblx0XHRcdC8vIEtleSBjb250YWlucyBEYXRhRmllbGQgcHJlZml4IHRvIGVuc3VyZSBhbGwgcHJvcGVydHkgY29sdW1ucyBoYXZlIHRoZSBzYW1lIGtleSBmb3JtYXQuXG5cdFx0XHRyZWxhdGVkQ29sdW1ucy5wdXNoKFxuXHRcdFx0XHRnZXRDb2x1bW5EZWZpbml0aW9uRnJvbVByb3BlcnR5KFxuXHRcdFx0XHRcdHZhbHVlLFxuXHRcdFx0XHRcdGFubm90YXRpb25QYXRoLFxuXHRcdFx0XHRcdG5hbWUsXG5cdFx0XHRcdFx0dHJ1ZSxcblx0XHRcdFx0XHRmYWxzZSxcblx0XHRcdFx0XHRub25Tb3J0YWJsZUNvbHVtbnMsXG5cdFx0XHRcdFx0YWdncmVnYXRpb25IZWxwZXIsXG5cdFx0XHRcdFx0Y29udmVydGVyQ29udGV4dCxcblx0XHRcdFx0XHRkZXNjcmlwdGlvbixcblx0XHRcdFx0XHRmaWVsZEdyb3VwXG5cdFx0XHRcdClcblx0XHRcdCk7XG5cdFx0fSBlbHNlIGlmIChcblx0XHRcdHJlbGF0ZWRDb2x1bW4uYW5ub3RhdGlvblBhdGggIT09IGFubm90YXRpb25QYXRoIHx8XG5cdFx0XHQocmVsYXRlZENvbHVtbi5wcm9wZXJ0eUluZm9zICYmIHJlbGF0ZWRDb2x1bW4ucHJvcGVydHlJbmZvcy5pbmRleE9mKG5hbWUpICE9PSAtMSlcblx0XHQpIHtcblx0XHRcdC8vIENhc2UgMjogVGhlIGV4aXN0aW5nIGNvbHVtbiBwb2ludHMgdG8gYSBMaW5lSXRlbSAob3IpXG5cdFx0XHQvLyBDYXNlIDM6IFRoaXMgaXMgYSBzZWxmIHJlZmVyZW5jZSBmcm9tIGFuIGV4aXN0aW5nIGNvbHVtbiBhbmRcblx0XHRcdC8vIGJvdGggY2FzZXMgcmVxdWlyZSBhIGR1bW15IFByb3BlcnR5SW5mbyBmb3Igc2V0dGluZyBjb3JyZWN0IGV4cG9ydCBzZXR0aW5ncy5cblxuXHRcdFx0Y29uc3QgbmV3TmFtZSA9IFwiUHJvcGVydHk6OlwiICsgbmFtZTtcblx0XHRcdC8vIENoZWNraW5nIHdoZXRoZXIgdGhlIHJlbGF0ZWQgcHJvcGVydHkgY29sdW1uIGhhcyBhbHJlYWR5IGJlZW4gY3JlYXRlZCBpbiBhIHByZXZpb3VzIGl0ZXJhdGlvbi5cblx0XHRcdGlmICghZXhpc3RpbmdDb2x1bW5zLnNvbWUoY29sdW1uID0+IGNvbHVtbi5uYW1lID09PSBuZXdOYW1lKSkge1xuXHRcdFx0XHQvLyBDcmVhdGUgYSBuZXcgcHJvcGVydHkgY29sdW1uIHdpdGggJ1Byb3BlcnR5OjonIHByZWZpeCxcblx0XHRcdFx0Ly8gU2V0IGl0IHRvIGhpZGRlbiBhcyBpdCBpcyBvbmx5IGNvbnN1bWVkIGJ5IENvbXBsZXggcHJvcGVydHkgaW5mb3MuXG5cdFx0XHRcdHJlbGF0ZWRDb2x1bW5zLnB1c2goXG5cdFx0XHRcdFx0Z2V0Q29sdW1uRGVmaW5pdGlvbkZyb21Qcm9wZXJ0eShcblx0XHRcdFx0XHRcdHZhbHVlLFxuXHRcdFx0XHRcdFx0YW5ub3RhdGlvblBhdGgsXG5cdFx0XHRcdFx0XHRuYW1lLFxuXHRcdFx0XHRcdFx0ZmFsc2UsXG5cdFx0XHRcdFx0XHRmYWxzZSxcblx0XHRcdFx0XHRcdG5vblNvcnRhYmxlQ29sdW1ucyxcblx0XHRcdFx0XHRcdGFnZ3JlZ2F0aW9uSGVscGVyLFxuXHRcdFx0XHRcdFx0Y29udmVydGVyQ29udGV4dCxcblx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpO1xuXHRcdFx0XHRyZWxhdGVkUHJvcGVydHlOYW1lTWFwW25hbWVdID0gbmV3TmFtZTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cdC8vIFRoZSBwcm9wZXJ0eSAnbmFtZScgaGFzIGJlZW4gcHJlZml4ZWQgd2l0aCAnUHJvcGVydHk6OicgZm9yIHVuaXF1ZW5lc3MuXG5cdC8vIFVwZGF0ZSB0aGUgc2FtZSBpbiBvdGhlciBwcm9wZXJ0eUluZm9zW10gcmVmZXJlbmNlcyB3aGljaCBwb2ludCB0byB0aGlzIHByb3BlcnR5LlxuXHRleGlzdGluZ0NvbHVtbnMuZm9yRWFjaChjb2x1bW4gPT4ge1xuXHRcdGNvbHVtbi5wcm9wZXJ0eUluZm9zID0gY29sdW1uLnByb3BlcnR5SW5mb3M/Lm1hcChwcm9wZXJ0eUluZm8gPT4gcmVsYXRlZFByb3BlcnR5TmFtZU1hcFtwcm9wZXJ0eUluZm9dID8/IHByb3BlcnR5SW5mbyk7XG5cdH0pO1xuXG5cdHJldHVybiByZWxhdGVkQ29sdW1ucztcbn07XG5cbi8qKlxuICogR2V0dGluZyB0aGUgQ29sdW1uIE5hbWVcbiAqIElmIGl0IHBvaW50cyB0byBhIERhdGFGaWVsZCB3aXRoIG9uZSBwcm9wZXJ0eSBvciBEYXRhUG9pbnQgd2l0aCBvbmUgcHJvcGVydHkgaXQgd2lsbCB1c2UgdGhlIHByb3BlcnR5IG5hbWVcbiAqIGhlcmUgdG8gYmUgY29uc2lzdGVudCB3aXRoIHRoZSBleGlzdGluZyBmbGV4IGNoYW5nZXMuXG4gKlxuICogQHBhcmFtIHtEYXRhRmllbGRBYnN0cmFjdFR5cGVzfSBkYXRhRmllbGQgRGlmZmVyZW50IERhdGFGaWVsZCB0eXBlcyBkZWZpbmVkIGluIHRoZSBhbm5vdGF0aW9uc1xuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyBuYW1lIG9mIGFubm90YXRpb24gY29sdW1uc1xuICogQHByaXZhdGVcbiAqL1xuY29uc3QgX2dldEFubm90YXRpb25Db2x1bW5OYW1lID0gZnVuY3Rpb24oZGF0YUZpZWxkOiBEYXRhRmllbGRBYnN0cmFjdFR5cGVzKSB7XG5cdC8vIFRoaXMgaXMgbmVlZGVkIGFzIHdlIGhhdmUgZmxleGliaWxpdHkgY2hhbmdlcyBhbHJlYWR5IHRoYXQgd2UgaGF2ZSB0byBjaGVjayBhZ2FpbnN0XG5cdGlmIChpc0RhdGFGaWVsZFR5cGVzKGRhdGFGaWVsZCkpIHtcblx0XHRyZXR1cm4gZGF0YUZpZWxkLlZhbHVlPy5wYXRoO1xuXHR9IGVsc2UgaWYgKGRhdGFGaWVsZC4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9yQW5ub3RhdGlvbiAmJiBkYXRhRmllbGQuVGFyZ2V0Py4kdGFyZ2V0Py5WYWx1ZT8ucGF0aCkge1xuXHRcdC8vIFRoaXMgaXMgZm9yIHJlbW92aW5nIGR1cGxpY2F0ZSBwcm9wZXJ0aWVzLiBGb3IgZXhhbXBsZSwgJ1Byb2dyZXNzJyBQcm9wZXJ0eSBpcyByZW1vdmVkIGlmIGl0IGlzIGFscmVhZHkgZGVmaW5lZCBhcyBhIERhdGFQb2ludFxuXHRcdHJldHVybiBkYXRhRmllbGQuVGFyZ2V0LiR0YXJnZXQuVmFsdWUucGF0aDtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gS2V5SGVscGVyLmdlbmVyYXRlS2V5RnJvbURhdGFGaWVsZChkYXRhRmllbGQpO1xuXHR9XG59O1xuXG4vKipcbiAqIERldGVybWluZSB0aGUgcHJvcGVydHkgcmVsYXRpdmUgcGF0aCB3aXRoIHJlc3BlY3QgdG8gdGhlIHJvb3QgZW50aXR5LlxuICogQHBhcmFtIGRhdGFGaWVsZCBUaGUgRGF0YSBmaWVsZCBiZWluZyBwcm9jZXNzZWQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgcmVsYXRpdmUgcGF0aFxuICovXG5jb25zdCBfZ2V0UmVsYXRpdmVQYXRoID0gZnVuY3Rpb24oZGF0YUZpZWxkOiBEYXRhRmllbGRBYnN0cmFjdFR5cGVzKTogc3RyaW5nIHtcblx0bGV0IHJlbGF0aXZlUGF0aDogc3RyaW5nID0gXCJcIjtcblxuXHRzd2l0Y2ggKGRhdGFGaWVsZC4kVHlwZSkge1xuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkOlxuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkV2l0aE5hdmlnYXRpb25QYXRoOlxuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkV2l0aFVybDpcblx0XHRcdHJlbGF0aXZlUGF0aCA9IChkYXRhRmllbGQgYXMgRGF0YUZpZWxkKT8uVmFsdWU/LnBhdGg7XG5cdFx0XHRicmVhaztcblxuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9yQW5ub3RhdGlvbjpcblx0XHRcdHJlbGF0aXZlUGF0aCA9IChkYXRhRmllbGQgYXMgRGF0YUZpZWxkRm9yQW5ub3RhdGlvbik/LlRhcmdldD8udmFsdWU7XG5cdFx0XHRicmVhaztcblxuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9yQWN0aW9uOlxuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uOlxuXHRcdFx0cmVsYXRpdmVQYXRoID0gS2V5SGVscGVyLmdlbmVyYXRlS2V5RnJvbURhdGFGaWVsZChkYXRhRmllbGQpO1xuXHRcdFx0YnJlYWs7XG5cdH1cblxuXHRyZXR1cm4gcmVsYXRpdmVQYXRoO1xufTtcblxuY29uc3QgX3NsaWNlQXRTbGFzaCA9IGZ1bmN0aW9uKHBhdGg6IHN0cmluZywgaXNMYXN0U2xhc2g6IGJvb2xlYW4sIGlzTGFzdFBhcnQ6IGJvb2xlYW4pIHtcblx0Y29uc3QgaVNsYXNoSW5kZXggPSBpc0xhc3RTbGFzaCA/IHBhdGgubGFzdEluZGV4T2YoXCIvXCIpIDogcGF0aC5pbmRleE9mKFwiL1wiKTtcblxuXHRpZiAoaVNsYXNoSW5kZXggPT09IC0xKSB7XG5cdFx0cmV0dXJuIHBhdGg7XG5cdH1cblx0cmV0dXJuIGlzTGFzdFBhcnQgPyBwYXRoLnN1YnN0cmluZyhpU2xhc2hJbmRleCArIDEsIHBhdGgubGVuZ3RoKSA6IHBhdGguc3Vic3RyaW5nKDAsIGlTbGFzaEluZGV4KTtcbn07XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgYSBjb2x1bW4gaXMgc29ydGFibGUuXG4gKlxuICogQHBhcmFtIGRhdGFGaWVsZCBUaGUgZGF0YSBmaWVsZCBiZWluZyBwcm9jZXNzZWRcbiAqIEBwYXJhbSBwcm9wZXJ0eVBhdGggVGhlIHByb3BlcnR5IHBhdGhcbiAqIEBwYXJhbSBub25Tb3J0YWJsZUNvbHVtbnMgQ29sbGVjdGlvbiBvZiBub24tc29ydGFibGUgY29sdW1uIG5hbWVzIGFzIHBlciBhbm5vdGF0aW9uXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgY29sdW1uIGlzIHNvcnRhYmxlXG4gKi9cbmNvbnN0IF9pc0NvbHVtblNvcnRhYmxlID0gZnVuY3Rpb24oZGF0YUZpZWxkOiBEYXRhRmllbGRBYnN0cmFjdFR5cGVzLCBwcm9wZXJ0eVBhdGg6IHN0cmluZywgbm9uU29ydGFibGVDb2x1bW5zOiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xuXHRsZXQgaXNTb3J0YWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuXHRpZiAobm9uU29ydGFibGVDb2x1bW5zLmluZGV4T2YocHJvcGVydHlQYXRoKSA9PT0gLTEpIHtcblx0XHQvLyBDb2x1bW4gaXMgbm90IG1hcmtlZCBhcyBub24tc29ydGFibGUgdmlhIGFubm90YXRpb25cblx0XHRzd2l0Y2ggKGRhdGFGaWVsZC4kVHlwZSkge1xuXHRcdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGQ6XG5cdFx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZFdpdGhVcmw6XG5cdFx0XHRcdGlzU29ydGFibGUgPSB0cnVlO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb246XG5cdFx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZEZvckFjdGlvbjpcblx0XHRcdFx0Ly8gQWN0aW9uIGNvbHVtbnMgYXJlIG5vdCBzb3J0YWJsZVxuXHRcdFx0XHRpc1NvcnRhYmxlID0gZmFsc2U7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gaXNTb3J0YWJsZTtcbn07XG5cbi8qKlxuICogUmV0dXJucyBsaW5lIGl0ZW1zIGZyb20gbWV0YWRhdGEgYW5ub3RhdGlvbnMuXG4gKlxuICogQHBhcmFtIGxpbmVJdGVtQW5ub3RhdGlvblxuICogQHBhcmFtIHZpc3VhbGl6YXRpb25QYXRoXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dFxuICogQHJldHVybnMge1RhYmxlQ29sdW1uW119IHRoZSBjb2x1bW5zIGZyb20gdGhlIGFubm90YXRpb25zXG4gKi9cbmNvbnN0IGdldENvbHVtbnNGcm9tQW5ub3RhdGlvbnMgPSBmdW5jdGlvbihcblx0bGluZUl0ZW1Bbm5vdGF0aW9uOiBMaW5lSXRlbSxcblx0dmlzdWFsaXphdGlvblBhdGg6IHN0cmluZyxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dFxuKTogVGFibGVDb2x1bW5bXSB7XG5cdGNvbnN0IGVudGl0eVR5cGUgPSBjb252ZXJ0ZXJDb250ZXh0LmdldEFubm90YXRpb25FbnRpdHlUeXBlKGxpbmVJdGVtQW5ub3RhdGlvbiksXG5cdFx0YW5ub3RhdGlvbkNvbHVtbnM6IEFubm90YXRpb25UYWJsZUNvbHVtbltdID0gW10sXG5cdFx0Y29sdW1uc1RvQmVDcmVhdGVkOiBSZWNvcmQ8c3RyaW5nLCBDb2xsZWN0ZWRQcm9wZXJ0aWVzPiA9IHt9LFxuXHRcdG5vblNvcnRhYmxlQ29sdW1uczogc3RyaW5nW10gPVxuXHRcdFx0KGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0KCk/LmFubm90YXRpb25zPy5DYXBhYmlsaXRpZXM/LlNvcnRSZXN0cmljdGlvbnNcblx0XHRcdFx0Py5Ob25Tb3J0YWJsZVByb3BlcnRpZXMgYXMgRWRtLlByb3BlcnR5UGF0aFtdKT8ubWFwKChwcm9wZXJ0eTogUHJvcGVydHlQYXRoKSA9PiBwcm9wZXJ0eS52YWx1ZSkgPz8gW107XG5cblx0aWYgKGxpbmVJdGVtQW5ub3RhdGlvbikge1xuXHRcdC8vIEdldCBjb2x1bW5zIGZyb20gdGhlIExpbmVJdGVtIEFubm90YXRpb25cblx0XHRsaW5lSXRlbUFubm90YXRpb24uZm9yRWFjaChsaW5lSXRlbSA9PiB7XG5cdFx0XHRpZiAoIV9pc1ZhbGlkQ29sdW1uKGxpbmVJdGVtKSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBzZW1hbnRpY09iamVjdEFubm90YXRpb25QYXRoID1cblx0XHRcdFx0aXNEYXRhRmllbGRUeXBlcyhsaW5lSXRlbSkgJiYgbGluZUl0ZW0uVmFsdWU/LiR0YXJnZXQ/LmZ1bGx5UXVhbGlmaWVkTmFtZVxuXHRcdFx0XHRcdD8gZ2V0U2VtYW50aWNPYmplY3RQYXRoKGNvbnZlcnRlckNvbnRleHQsIGxpbmVJdGVtKVxuXHRcdFx0XHRcdDogdW5kZWZpbmVkO1xuXHRcdFx0Y29uc3QgcmVsYXRpdmVQYXRoID0gX2dldFJlbGF0aXZlUGF0aChsaW5lSXRlbSk7XG5cdFx0XHQvLyBEZXRlcm1pbmUgcHJvcGVydGllcyB3aGljaCBhcmUgY29uc3VtZWQgYnkgdGhpcyBMaW5lSXRlbS5cblx0XHRcdGNvbnN0IHJlbGF0ZWRQcm9wZXJ0aWVzSW5mbzogQ29tcGxleFByb3BlcnR5SW5mbyA9IGNvbGxlY3RSZWxhdGVkUHJvcGVydGllc1JlY3Vyc2l2ZWx5KGxpbmVJdGVtLCBjb252ZXJ0ZXJDb250ZXh0KTtcblx0XHRcdGNvbnN0IHJlbGF0ZWRQcm9wZXJ0eU5hbWVzOiBzdHJpbmdbXSA9IE9iamVjdC5rZXlzKHJlbGF0ZWRQcm9wZXJ0aWVzSW5mby5wcm9wZXJ0aWVzKTtcblx0XHRcdGNvbnN0IGdyb3VwUGF0aDogc3RyaW5nID0gX3NsaWNlQXRTbGFzaChyZWxhdGl2ZVBhdGgsIHRydWUsIGZhbHNlKTtcblx0XHRcdGNvbnN0IGlzR3JvdXA6IGJvb2xlYW4gPSBncm91cFBhdGggIT0gcmVsYXRpdmVQYXRoO1xuXHRcdFx0Y29uc3Qgc0xhYmVsOiBzdHJpbmcgfCB1bmRlZmluZWQgPSBfZ2V0TGFiZWwobGluZUl0ZW0sIGlzR3JvdXApO1xuXHRcdFx0YW5ub3RhdGlvbkNvbHVtbnMucHVzaCh7XG5cdFx0XHRcdGtleTogS2V5SGVscGVyLmdlbmVyYXRlS2V5RnJvbURhdGFGaWVsZChsaW5lSXRlbSksXG5cdFx0XHRcdHR5cGU6IENvbHVtblR5cGUuQW5ub3RhdGlvbixcblx0XHRcdFx0bGFiZWw6IHNMYWJlbCxcblx0XHRcdFx0Z3JvdXBMYWJlbDogaXNHcm91cCA/IF9nZXRMYWJlbChsaW5lSXRlbSkgOiBudWxsLFxuXHRcdFx0XHRncm91cDogaXNHcm91cCA/IGdyb3VwUGF0aCA6IG51bGwsXG5cdFx0XHRcdGFubm90YXRpb25QYXRoOiBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVNldEJhc2VkQW5ub3RhdGlvblBhdGgobGluZUl0ZW0uZnVsbHlRdWFsaWZpZWROYW1lKSxcblx0XHRcdFx0c2VtYW50aWNPYmplY3RQYXRoOiBzZW1hbnRpY09iamVjdEFubm90YXRpb25QYXRoLFxuXHRcdFx0XHRhdmFpbGFiaWxpdHk6IGlzRGF0YUZpZWxkQWx3YXlzSGlkZGVuKGxpbmVJdGVtKSA/IEF2YWlsYWJpbGl0eVR5cGUuSGlkZGVuIDogQXZhaWxhYmlsaXR5VHlwZS5EZWZhdWx0LFxuXHRcdFx0XHRuYW1lOiBfZ2V0QW5ub3RhdGlvbkNvbHVtbk5hbWUobGluZUl0ZW0pLFxuXHRcdFx0XHRyZWxhdGl2ZVBhdGg6IHJlbGF0aXZlUGF0aCxcblx0XHRcdFx0c29ydGFibGU6IF9pc0NvbHVtblNvcnRhYmxlKGxpbmVJdGVtLCByZWxhdGl2ZVBhdGgsIG5vblNvcnRhYmxlQ29sdW1ucyksXG5cdFx0XHRcdHByb3BlcnR5SW5mb3M6IHJlbGF0ZWRQcm9wZXJ0eU5hbWVzLmxlbmd0aCA+IDAgPyByZWxhdGVkUHJvcGVydHlOYW1lcyA6IHVuZGVmaW5lZCxcblx0XHRcdFx0ZXhwb3J0U2V0dGluZ3M6IHtcblx0XHRcdFx0XHR0ZW1wbGF0ZTogcmVsYXRlZFByb3BlcnRpZXNJbmZvLmV4cG9ydFNldHRpbmdzVGVtcGxhdGVcblx0XHRcdFx0fSxcblx0XHRcdFx0d2lkdGg6IGxpbmVJdGVtLmFubm90YXRpb25zPy5IVE1MNT8uQ3NzRGVmYXVsdHM/LndpZHRoIHx8IHVuZGVmaW5lZCxcblx0XHRcdFx0aXNOYXZpZ2FibGU6IHRydWUsXG5cdFx0XHRcdGZvcm1hdE9wdGlvbnM6IHtcblx0XHRcdFx0XHR0ZXh0TGluZXNEaXNwbGF5OiA0LFxuXHRcdFx0XHRcdHRleHRMaW5lc0VkaXQ6IDRcblx0XHRcdFx0fVxuXHRcdFx0fSBhcyBBbm5vdGF0aW9uVGFibGVDb2x1bW4pO1xuXG5cdFx0XHQvLyBDb2xsZWN0IGluZm9ybWF0aW9uIG9mIHJlbGF0ZWQgY29sdW1ucyB0byBiZSBjcmVhdGVkLlxuXHRcdFx0cmVsYXRlZFByb3BlcnR5TmFtZXMuZm9yRWFjaChuYW1lID0+IHtcblx0XHRcdFx0Y29sdW1uc1RvQmVDcmVhdGVkW25hbWVdID0gcmVsYXRlZFByb3BlcnRpZXNJbmZvLnByb3BlcnRpZXNbbmFtZV07XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fVxuXG5cdC8vIEdldCBjb2x1bW5zIGZyb20gdGhlIFByb3BlcnRpZXMgb2YgRW50aXR5VHlwZVxuXHRsZXQgdGFibGVDb2x1bW5zID0gZ2V0Q29sdW1uc0Zyb21FbnRpdHlUeXBlKGNvbHVtbnNUb0JlQ3JlYXRlZCwgZW50aXR5VHlwZSwgYW5ub3RhdGlvbkNvbHVtbnMsIG5vblNvcnRhYmxlQ29sdW1ucywgY29udmVydGVyQ29udGV4dCk7XG5cdHRhYmxlQ29sdW1ucyA9IHRhYmxlQ29sdW1ucy5jb25jYXQoYW5ub3RhdGlvbkNvbHVtbnMpO1xuXG5cdC8vIENyZWF0ZSBhIHByb3BlcnR5SW5mbyBmb3IgZWFjaCByZWxhdGVkIHByb3BlcnR5LlxuXHRjb25zdCByZWxhdGVkQ29sdW1ucyA9IF9jcmVhdGVSZWxhdGVkQ29sdW1ucyhjb2x1bW5zVG9CZUNyZWF0ZWQsIHRhYmxlQ29sdW1ucywgbm9uU29ydGFibGVDb2x1bW5zLCBjb252ZXJ0ZXJDb250ZXh0LCBlbnRpdHlUeXBlKTtcblx0dGFibGVDb2x1bW5zID0gdGFibGVDb2x1bW5zLmNvbmNhdChyZWxhdGVkQ29sdW1ucyk7XG5cblx0cmV0dXJuIHRhYmxlQ29sdW1ucztcbn07XG5cbi8qKlxuICogR2V0cyB0aGUgcHJvcGVydHkgbmFtZXMgZnJvbSB0aGUgbWFuaWZlc3QgYW5kIGNoZWNrcyBhZ2FpbnN0IGV4aXN0aW5nIHByb3BlcnRpZXMgYWxyZWFkeSBhZGRlZCBieSBhbm5vdGF0aW9ucy5cbiAqIElmIGEgbm90IHlldCBzdG9yZWQgcHJvcGVydHkgaXMgZm91bmQgaXQgYWRkcyBpdCBmb3Igc29ydGluZyBhbmQgZmlsdGVyaW5nIG9ubHkgdG8gdGhlIGFubm90YXRpb25Db2x1bW5zLlxuICogQHBhcmFtIHByb3BlcnRpZXMge3N0cmluZ1tdIHwgdW5kZWZpbmVkfVxuICogQHBhcmFtIGFubm90YXRpb25Db2x1bW5zIHtBbm5vdGF0aW9uVGFibGVDb2x1bW5bXX1cbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0IHtDb252ZXJ0ZXJDb250ZXh0fVxuICogQHBhcmFtIGVudGl0eVR5cGVcbiAqIEByZXR1cm5zIHtzdHJpbmdbXX0gdGhlIGNvbHVtbnMgZnJvbSB0aGUgYW5ub3RhdGlvbnNcbiAqL1xuY29uc3QgX2dldFByb3BlcnR5TmFtZXMgPSBmdW5jdGlvbihcblx0cHJvcGVydGllczogc3RyaW5nW10gfCB1bmRlZmluZWQsXG5cdGFubm90YXRpb25Db2x1bW5zOiBBbm5vdGF0aW9uVGFibGVDb2x1bW5bXSxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCxcblx0ZW50aXR5VHlwZTogRW50aXR5VHlwZVxuKTogc3RyaW5nW10gfCB1bmRlZmluZWQge1xuXHRsZXQgbWF0Y2hlZFByb3BlcnRpZXM6IHN0cmluZ1tdIHwgdW5kZWZpbmVkO1xuXG5cdGlmIChwcm9wZXJ0aWVzKSB7XG5cdFx0bWF0Y2hlZFByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzLm1hcChmdW5jdGlvbihwcm9wZXJ0eVBhdGgpIHtcblx0XHRcdGNvbnN0IGFubm90YXRpb25Db2x1bW4gPSBhbm5vdGF0aW9uQ29sdW1ucy5maW5kKGZ1bmN0aW9uKGFubm90YXRpb25Db2x1bW4pIHtcblx0XHRcdFx0cmV0dXJuIGFubm90YXRpb25Db2x1bW4ucmVsYXRpdmVQYXRoID09PSBwcm9wZXJ0eVBhdGggJiYgYW5ub3RhdGlvbkNvbHVtbi5wcm9wZXJ0eUluZm9zID09PSB1bmRlZmluZWQ7XG5cdFx0XHR9KTtcblx0XHRcdGlmIChhbm5vdGF0aW9uQ29sdW1uKSB7XG5cdFx0XHRcdHJldHVybiBhbm5vdGF0aW9uQ29sdW1uLm5hbWU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCByZWxhdGVkQ29sdW1ucyA9IF9jcmVhdGVSZWxhdGVkQ29sdW1ucyhcblx0XHRcdFx0XHR7IFtwcm9wZXJ0eVBhdGhdOiB7IHZhbHVlOiBlbnRpdHlUeXBlLnJlc29sdmVQYXRoKHByb3BlcnR5UGF0aCkgfSB9LFxuXHRcdFx0XHRcdGFubm90YXRpb25Db2x1bW5zLFxuXHRcdFx0XHRcdFtdLFxuXHRcdFx0XHRcdGNvbnZlcnRlckNvbnRleHQsXG5cdFx0XHRcdFx0ZW50aXR5VHlwZVxuXHRcdFx0XHQpO1xuXHRcdFx0XHRhbm5vdGF0aW9uQ29sdW1ucy5wdXNoKHJlbGF0ZWRDb2x1bW5zWzBdKTtcblx0XHRcdFx0cmV0dXJuIHJlbGF0ZWRDb2x1bW5zWzBdLm5hbWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRyZXR1cm4gbWF0Y2hlZFByb3BlcnRpZXM7XG59O1xuXG4vKipcbiAqIFJldHJpZXZlcyB0aGUgdGFibGUgY29sdW1uIHByb3BlcnR5IHZhbHVlIGJhc2VkIG9uIGNlcnRhaW4gY29uZGl0aW9ucy5cbiAqXG4gKiBNYW5pZmVzdCBkZWZpbmVkIHByb3BlcnR5IHZhbHVlIGZvciBjdXN0b20gLyBhbm5vdGF0aW9uIGNvbHVtbnNcbiAqIERlZmF1bHQgcHJvcGVydHkgdmFsdWUgZm9yIGN1c3RvbSBjb2x1bW4gaWYgbm90IG92ZXJ3cml0dGVuIGluIG1hbmlmZXN0LlxuICogQHBhcmFtIHByb3BlcnR5IHthbnl9IFRoZSBjb2x1bW4gcHJvcGVydHkgZGVmaW5lZCBpbiB0aGUgbWFuaWZlc3RcbiAqIEBwYXJhbSBkZWZhdWx0VmFsdWUge2FueX0gVGhlIGRlZmF1bHQgdmFsdWUgb2YgdGhlIHByb3BlcnR5XG4gKiBAcGFyYW0gaXNBbm5vdGF0aW9uQ29sdW1uIHtib29sZWFufSBXaGV0aGVyIHRoZSBjb2x1bW4sIGRlZmluZWQgaW4gbWFuaWZlc3QsIGNvcnJlc3BvbmRzIHRvIGFuIGV4aXN0aW5nIGFubm90YXRpb24gY29sdW1uLlxuICogQHJldHVybnMge2FueX0gRGV0ZXJtaW5lZCBwcm9wZXJ0eSB2YWx1ZSBmb3IgdGhlIGNvbHVtblxuICovXG5jb25zdCBfZ2V0TWFuaWZlc3RPckRlZmF1bHRWYWx1ZSA9IGZ1bmN0aW9uKHByb3BlcnR5OiBhbnksIGRlZmF1bHRWYWx1ZTogYW55LCBpc0Fubm90YXRpb25Db2x1bW46IGJvb2xlYW4pOiBhbnkge1xuXHRpZiAocHJvcGVydHkgPT09IHVuZGVmaW5lZCkge1xuXHRcdC8vIElmIGFubm90YXRpb24gY29sdW1uIGhhcyBubyBwcm9wZXJ0eSBkZWZpbmVkIGluIG1hbmlmZXN0LFxuXHRcdC8vIGRvIG5vdCBvdmVyd3JpdGUgaXQgd2l0aCBtYW5pZmVzdCBjb2x1bW4ncyBkZWZhdWx0IHZhbHVlLlxuXHRcdHJldHVybiBpc0Fubm90YXRpb25Db2x1bW4gPyB1bmRlZmluZWQgOiBkZWZhdWx0VmFsdWU7XG5cdH1cblx0Ly8gUmV0dXJuIHdoYXQgaXMgZGVmaW5lZCBpbiBtYW5pZmVzdC5cblx0cmV0dXJuIHByb3BlcnR5O1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRhYmxlIGNvbHVtbiBkZWZpbml0aW9ucyBmcm9tIG1hbmlmZXN0LlxuICogQHBhcmFtIGNvbHVtbnNcbiAqIEBwYXJhbSBhbm5vdGF0aW9uQ29sdW1uc1xuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHRcbiAqIEBwYXJhbSBlbnRpdHlUeXBlXG4gKiBAcGFyYW0gbmF2aWdhdGlvblNldHRpbmdzXG4gKiBAcmV0dXJucyB7UmVjb3JkPHN0cmluZywgQ3VzdG9tQ29sdW1uPn0gdGhlIGNvbHVtbnMgZnJvbSB0aGUgbWFuaWZlc3RcbiAqL1xuY29uc3QgZ2V0Q29sdW1uc0Zyb21NYW5pZmVzdCA9IGZ1bmN0aW9uKFxuXHRjb2x1bW5zOiBSZWNvcmQ8c3RyaW5nLCBNYW5pZmVzdFRhYmxlQ29sdW1uPixcblx0YW5ub3RhdGlvbkNvbHVtbnM6IEFubm90YXRpb25UYWJsZUNvbHVtbltdLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRlbnRpdHlUeXBlOiBFbnRpdHlUeXBlLFxuXHRuYXZpZ2F0aW9uU2V0dGluZ3M/OiBOYXZpZ2F0aW9uU2V0dGluZ3NDb25maWd1cmF0aW9uXG4pOiBSZWNvcmQ8c3RyaW5nLCBDdXN0b21Db2x1bW4+IHtcblx0Y29uc3QgaW50ZXJuYWxDb2x1bW5zOiBSZWNvcmQ8c3RyaW5nLCBDdXN0b21Db2x1bW4+ID0ge307XG5cblx0Zm9yIChjb25zdCBrZXkgaW4gY29sdW1ucykge1xuXHRcdGNvbnN0IG1hbmlmZXN0Q29sdW1uID0gY29sdW1uc1trZXldO1xuXHRcdC8vIFRvIGlkZW50aWZ5IHRoZSBhbm5vdGF0aW9uIGNvbHVtbiBwcm9wZXJ0eSBvdmVyd3JpdGUgdmlhIG1hbmlmZXN0IHVzZS1jYXNlLlxuXHRcdGNvbnN0IGlzQW5ub3RhdGlvbkNvbHVtbiA9IGFubm90YXRpb25Db2x1bW5zLnNvbWUoY29sdW1uID0+IGNvbHVtbi5rZXkgPT09IGtleSk7XG5cdFx0S2V5SGVscGVyLnZhbGlkYXRlS2V5KGtleSk7XG5cblx0XHRpbnRlcm5hbENvbHVtbnNba2V5XSA9IHtcblx0XHRcdGtleToga2V5LFxuXHRcdFx0aWQ6IFwiQ3VzdG9tQ29sdW1uOjpcIiArIGtleSxcblx0XHRcdG5hbWU6IFwiQ3VzdG9tQ29sdW1uOjpcIiArIGtleSxcblx0XHRcdGhlYWRlcjogbWFuaWZlc3RDb2x1bW4uaGVhZGVyLFxuXHRcdFx0d2lkdGg6IG1hbmlmZXN0Q29sdW1uLndpZHRoIHx8IHVuZGVmaW5lZCxcblx0XHRcdGhvcml6b250YWxBbGlnbjogX2dldE1hbmlmZXN0T3JEZWZhdWx0VmFsdWUobWFuaWZlc3RDb2x1bW4/Lmhvcml6b250YWxBbGlnbiwgSG9yaXpvbnRhbEFsaWduLkJlZ2luLCBpc0Fubm90YXRpb25Db2x1bW4pLFxuXHRcdFx0dHlwZTogQ29sdW1uVHlwZS5EZWZhdWx0LFxuXHRcdFx0YXZhaWxhYmlsaXR5OiBfZ2V0TWFuaWZlc3RPckRlZmF1bHRWYWx1ZShtYW5pZmVzdENvbHVtbj8uYXZhaWxhYmlsaXR5LCBBdmFpbGFiaWxpdHlUeXBlLkRlZmF1bHQsIGlzQW5ub3RhdGlvbkNvbHVtbiksXG5cdFx0XHR0ZW1wbGF0ZTogbWFuaWZlc3RDb2x1bW4udGVtcGxhdGUgfHwgXCJ1bmRlZmluZWRcIixcblx0XHRcdHBvc2l0aW9uOiB7XG5cdFx0XHRcdGFuY2hvcjogbWFuaWZlc3RDb2x1bW4ucG9zaXRpb24/LmFuY2hvcixcblx0XHRcdFx0cGxhY2VtZW50OiBtYW5pZmVzdENvbHVtbi5wb3NpdGlvbiA9PT0gdW5kZWZpbmVkID8gUGxhY2VtZW50LkFmdGVyIDogbWFuaWZlc3RDb2x1bW4ucG9zaXRpb24ucGxhY2VtZW50XG5cdFx0XHR9LFxuXHRcdFx0aXNOYXZpZ2FibGU6IGlzQW5ub3RhdGlvbkNvbHVtbiA/IHVuZGVmaW5lZCA6IGlzQWN0aW9uTmF2aWdhYmxlKG1hbmlmZXN0Q29sdW1uLCBuYXZpZ2F0aW9uU2V0dGluZ3MsIHRydWUpLFxuXHRcdFx0c2V0dGluZ3M6IG1hbmlmZXN0Q29sdW1uLnNldHRpbmdzLFxuXHRcdFx0c29ydGFibGU6IGZhbHNlLFxuXHRcdFx0cHJvcGVydHlJbmZvczogX2dldFByb3BlcnR5TmFtZXMobWFuaWZlc3RDb2x1bW4ucHJvcGVydGllcywgYW5ub3RhdGlvbkNvbHVtbnMsIGNvbnZlcnRlckNvbnRleHQsIGVudGl0eVR5cGUpLFxuXHRcdFx0Zm9ybWF0T3B0aW9uczoge1xuXHRcdFx0XHR0ZXh0TGluZXNEaXNwbGF5OiA0LFxuXHRcdFx0XHR0ZXh0TGluZXNFZGl0OiA0LFxuXHRcdFx0XHQuLi5tYW5pZmVzdENvbHVtbi5mb3JtYXRPcHRpb25zXG5cdFx0XHR9XG5cdFx0fTtcblx0fVxuXHRyZXR1cm4gaW50ZXJuYWxDb2x1bW5zO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFAxM25Nb2RlKFxuXHR2aXN1YWxpemF0aW9uUGF0aDogc3RyaW5nLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHR0YWJsZU1hbmlmZXN0Q29uZmlndXJhdGlvbjogVGFibGVDb250cm9sQ29uZmlndXJhdGlvblxuKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcblx0Y29uc3QgbWFuaWZlc3RXcmFwcGVyOiBNYW5pZmVzdFdyYXBwZXIgPSBjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0V3JhcHBlcigpO1xuXHRjb25zdCB0YWJsZU1hbmlmZXN0U2V0dGluZ3M6IFRhYmxlTWFuaWZlc3RDb25maWd1cmF0aW9uID0gY29udmVydGVyQ29udGV4dC5nZXRNYW5pZmVzdENvbnRyb2xDb25maWd1cmF0aW9uKHZpc3VhbGl6YXRpb25QYXRoKTtcblx0Y29uc3QgdmFyaWFudE1hbmFnZW1lbnQ6IFZhcmlhbnRNYW5hZ2VtZW50VHlwZSA9IG1hbmlmZXN0V3JhcHBlci5nZXRWYXJpYW50TWFuYWdlbWVudCgpO1xuXHRjb25zdCBoYXNWYXJpYW50TWFuYWdlbWVudDogYm9vbGVhbiA9IFtcIlBhZ2VcIiwgXCJDb250cm9sXCJdLmluZGV4T2YodmFyaWFudE1hbmFnZW1lbnQpID4gLTE7XG5cdGNvbnN0IGFQZXJzb25hbGl6YXRpb246IHN0cmluZ1tdID0gW107XG5cdGlmIChoYXNWYXJpYW50TWFuYWdlbWVudCkge1xuXHRcdGNvbnN0IGJBbmFseXRpY2FsVGFibGUgPSB0YWJsZU1hbmlmZXN0Q29uZmlndXJhdGlvbi50eXBlID09PSBcIkFuYWx5dGljYWxUYWJsZVwiO1xuXHRcdGlmICh0YWJsZU1hbmlmZXN0U2V0dGluZ3M/LnRhYmxlU2V0dGluZ3M/LnBlcnNvbmFsaXphdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHQvLyBQZXJzb25hbGl6YXRpb24gY29uZmlndXJlZCBpbiBtYW5pZmVzdC5cblx0XHRcdGNvbnN0IHBlcnNvbmFsaXphdGlvbjogYW55ID0gdGFibGVNYW5pZmVzdFNldHRpbmdzLnRhYmxlU2V0dGluZ3MucGVyc29uYWxpemF0aW9uO1xuXHRcdFx0aWYgKHBlcnNvbmFsaXphdGlvbiA9PT0gdHJ1ZSkge1xuXHRcdFx0XHQvLyBUYWJsZSBwZXJzb25hbGl6YXRpb24gZnVsbHkgZW5hYmxlZC5cblx0XHRcdFx0cmV0dXJuIGJBbmFseXRpY2FsVGFibGUgPyBcIlNvcnQsQ29sdW1uLEZpbHRlcixHcm91cCxBZ2dyZWdhdGVcIiA6IFwiU29ydCxDb2x1bW4sRmlsdGVyXCI7XG5cdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBwZXJzb25hbGl6YXRpb24gPT09IFwib2JqZWN0XCIpIHtcblx0XHRcdFx0Ly8gU3BlY2lmaWMgcGVyc29uYWxpemF0aW9uIG9wdGlvbnMgZW5hYmxlZCBpbiBtYW5pZmVzdC4gVXNlIHRoZW0gYXMgaXMuXG5cdFx0XHRcdGlmIChwZXJzb25hbGl6YXRpb24uc29ydCkge1xuXHRcdFx0XHRcdGFQZXJzb25hbGl6YXRpb24ucHVzaChcIlNvcnRcIik7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHBlcnNvbmFsaXphdGlvbi5jb2x1bW4pIHtcblx0XHRcdFx0XHRhUGVyc29uYWxpemF0aW9uLnB1c2goXCJDb2x1bW5cIik7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHBlcnNvbmFsaXphdGlvbi5maWx0ZXIpIHtcblx0XHRcdFx0XHRhUGVyc29uYWxpemF0aW9uLnB1c2goXCJGaWx0ZXJcIik7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHBlcnNvbmFsaXphdGlvbi5ncm91cCAmJiBiQW5hbHl0aWNhbFRhYmxlKSB7XG5cdFx0XHRcdFx0YVBlcnNvbmFsaXphdGlvbi5wdXNoKFwiR3JvdXBcIik7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHBlcnNvbmFsaXphdGlvbi5hZ2dyZWdhdGUgJiYgYkFuYWx5dGljYWxUYWJsZSkge1xuXHRcdFx0XHRcdGFQZXJzb25hbGl6YXRpb24ucHVzaChcIkFnZ3JlZ2F0ZVwiKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gYVBlcnNvbmFsaXphdGlvbi5sZW5ndGggPiAwID8gYVBlcnNvbmFsaXphdGlvbi5qb2luKFwiLFwiKSA6IHVuZGVmaW5lZDtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gTm8gcGVyc29uYWxpemF0aW9uIGNvbmZpZ3VyZWQgaW4gbWFuaWZlc3QuXG5cdFx0XHRhUGVyc29uYWxpemF0aW9uLnB1c2goXCJTb3J0XCIpO1xuXHRcdFx0YVBlcnNvbmFsaXphdGlvbi5wdXNoKFwiQ29sdW1uXCIpO1xuXHRcdFx0aWYgKHZhcmlhbnRNYW5hZ2VtZW50ID09PSBWYXJpYW50TWFuYWdlbWVudFR5cGUuQ29udHJvbCkge1xuXHRcdFx0XHQvLyBGZWF0dXJlIHBhcml0eSB3aXRoIFYyLlxuXHRcdFx0XHQvLyBFbmFibGUgdGFibGUgZmlsdGVyaW5nIGJ5IGRlZmF1bHQgb25seSBpbiBjYXNlIG9mIENvbnRyb2wgbGV2ZWwgdmFyaWFudCBtYW5hZ2VtZW50LlxuXHRcdFx0XHRhUGVyc29uYWxpemF0aW9uLnB1c2goXCJGaWx0ZXJcIik7XG5cdFx0XHR9XG5cdFx0XHRpZiAoYkFuYWx5dGljYWxUYWJsZSkge1xuXHRcdFx0XHRhUGVyc29uYWxpemF0aW9uLnB1c2goXCJHcm91cFwiKTtcblx0XHRcdFx0YVBlcnNvbmFsaXphdGlvbi5wdXNoKFwiQWdncmVnYXRlXCIpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGFQZXJzb25hbGl6YXRpb24uam9pbihcIixcIik7XG5cdFx0fVxuXHR9XG5cdHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIGdldERlbGV0ZUhpZGRlbihjdXJyZW50RW50aXR5U2V0OiBFbnRpdHlTZXQgfCB1bmRlZmluZWQsIG5hdmlnYXRpb25QYXRoOiBzdHJpbmcpIHtcblx0bGV0IGlzRGVsZXRlSGlkZGVuOiBhbnkgPSBmYWxzZTtcblx0aWYgKGN1cnJlbnRFbnRpdHlTZXQgJiYgbmF2aWdhdGlvblBhdGgpIHtcblx0XHQvLyBDaGVjayBpZiBVSS5EZWxldGVIaWRkZW4gaXMgcG9pbnRpbmcgdG8gcGFyZW50IHBhdGhcblx0XHRjb25zdCBkZWxldGVIaWRkZW5Bbm5vdGF0aW9uID0gY3VycmVudEVudGl0eVNldC5uYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nW25hdmlnYXRpb25QYXRoXT8uYW5ub3RhdGlvbnM/LlVJPy5EZWxldGVIaWRkZW47XG5cdFx0aWYgKGRlbGV0ZUhpZGRlbkFubm90YXRpb24gJiYgKGRlbGV0ZUhpZGRlbkFubm90YXRpb24gYXMgYW55KS5wYXRoKSB7XG5cdFx0XHRpZiAoKGRlbGV0ZUhpZGRlbkFubm90YXRpb24gYXMgYW55KS5wYXRoLmluZGV4T2YoXCIvXCIpID4gMCkge1xuXHRcdFx0XHRjb25zdCBhU3BsaXRIaWRkZW5QYXRoID0gKGRlbGV0ZUhpZGRlbkFubm90YXRpb24gYXMgYW55KS5wYXRoLnNwbGl0KFwiL1wiKTtcblx0XHRcdFx0Y29uc3Qgc05hdmlnYXRpb25QYXRoID0gYVNwbGl0SGlkZGVuUGF0aFswXTtcblx0XHRcdFx0Y29uc3QgcGFydG5lck5hbWUgPSAoY3VycmVudEVudGl0eVNldCBhcyBhbnkpLmVudGl0eVR5cGUubmF2aWdhdGlvblByb3BlcnRpZXMuZmluZChcblx0XHRcdFx0XHQobmF2UHJvcGVydHk6IGFueSkgPT4gbmF2UHJvcGVydHkubmFtZSA9PT0gbmF2aWdhdGlvblBhdGhcblx0XHRcdFx0KS5wYXJ0bmVyO1xuXHRcdFx0XHRpZiAocGFydG5lck5hbWUgPT09IHNOYXZpZ2F0aW9uUGF0aCkge1xuXHRcdFx0XHRcdGlzRGVsZXRlSGlkZGVuID0gZGVsZXRlSGlkZGVuQW5ub3RhdGlvbjtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aXNEZWxldGVIaWRkZW4gPSBmYWxzZTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0aXNEZWxldGVIaWRkZW4gPSBkZWxldGVIaWRkZW5Bbm5vdGF0aW9uO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRpc0RlbGV0ZUhpZGRlbiA9IGN1cnJlbnRFbnRpdHlTZXQgJiYgY3VycmVudEVudGl0eVNldC5hbm5vdGF0aW9ucz8uVUk/LkRlbGV0ZUhpZGRlbjtcblx0fVxuXHRyZXR1cm4gaXNEZWxldGVIaWRkZW47XG59XG5cbi8qKlxuICogUmV0dXJucyB2aXNpYmlsaXR5IGZvciBEZWxldGUgYnV0dG9uXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dFxuICogQHBhcmFtIG5hdmlnYXRpb25QYXRoXG4gKiBAcGFyYW0gaXNUYXJnZXREZWxldGFibGVcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGVsZXRlVmlzaWJsZShcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCxcblx0bmF2aWdhdGlvblBhdGg6IHN0cmluZyxcblx0aXNUYXJnZXREZWxldGFibGU6IGJvb2xlYW5cbik6IEJpbmRpbmdFeHByZXNzaW9uPGJvb2xlYW4+IHtcblx0Y29uc3QgY3VycmVudEVudGl0eVNldCA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0KCk7XG5cdGNvbnN0IGlzRGVsZXRlSGlkZGVuOiBhbnkgPSBnZXREZWxldGVIaWRkZW4oY3VycmVudEVudGl0eVNldCwgbmF2aWdhdGlvblBhdGgpO1xuXHRsZXQgaXNQYXJlbnREZWxldGFibGUsIHBhcmVudEVudGl0eVNldERlbGV0YWJsZTtcblx0aWYgKGNvbnZlcnRlckNvbnRleHQuZ2V0VGVtcGxhdGVUeXBlKCkgPT09IFRlbXBsYXRlVHlwZS5PYmplY3RQYWdlKSB7XG5cdFx0aXNQYXJlbnREZWxldGFibGUgPSBpc1BhdGhEZWxldGFibGUoY29udmVydGVyQ29udGV4dC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCksIG5hdmlnYXRpb25QYXRoKTtcblx0XHRwYXJlbnRFbnRpdHlTZXREZWxldGFibGUgPSBpc1BhcmVudERlbGV0YWJsZSA/IGNvbXBpbGVCaW5kaW5nKGlzUGFyZW50RGVsZXRhYmxlKSA6IGlzUGFyZW50RGVsZXRhYmxlO1xuXHR9XG5cdC8vZG8gbm90IHNob3cgY2FzZSB0aGUgZGVsZXRlIGJ1dHRvbiBpZiBwYXJlbnRFbnRpdHlTZXREZWxldGFibGUgaXMgZmFsc2Vcblx0aWYgKHBhcmVudEVudGl0eVNldERlbGV0YWJsZSA9PT0gXCJmYWxzZVwiKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9IGVsc2UgaWYgKHBhcmVudEVudGl0eVNldERlbGV0YWJsZSAmJiBpc0RlbGV0ZUhpZGRlbiAhPT0gdHJ1ZSkge1xuXHRcdC8vRGVsZXRlIEhpZGRlbiBpbiBjYXNlIG9mIHRydWUgYW5kIHBhdGggYmFzZWRcblx0XHRpZiAoaXNEZWxldGVIaWRkZW4pIHtcblx0XHRcdHJldHVybiBcIns9ICEke1wiICsgKG5hdmlnYXRpb25QYXRoID8gbmF2aWdhdGlvblBhdGggKyBcIi9cIiA6IFwiXCIpICsgaXNEZWxldGVIaWRkZW4ucGF0aCArIFwifSAmJiAke3VpPi9lZGl0TW9kZX0gPT09ICdFZGl0YWJsZSd9XCI7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBcIns9ICR7dWk+L2VkaXRNb2RlfSA9PT0gJ0VkaXRhYmxlJ31cIjtcblx0XHR9XG5cdH0gZWxzZSBpZiAoaXNEZWxldGVIaWRkZW4gPT09IHRydWUgfHwgIWlzVGFyZ2V0RGVsZXRhYmxlIHx8IGNvbnZlcnRlckNvbnRleHQuZ2V0VGVtcGxhdGVUeXBlKCkgPT09IFRlbXBsYXRlVHlwZS5BbmFseXRpY2FsTGlzdFBhZ2UpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0gZWxzZSBpZiAoY29udmVydGVyQ29udGV4dC5nZXRUZW1wbGF0ZVR5cGUoKSAhPT0gVGVtcGxhdGVUeXBlLkxpc3RSZXBvcnQpIHtcblx0XHRpZiAoaXNEZWxldGVIaWRkZW4pIHtcblx0XHRcdHJldHVybiBcIns9ICEke1wiICsgKG5hdmlnYXRpb25QYXRoID8gbmF2aWdhdGlvblBhdGggKyBcIi9cIiA6IFwiXCIpICsgaXNEZWxldGVIaWRkZW4ucGF0aCArIFwifSAmJiAke3VpPi9lZGl0TW9kZX0gPT09ICdFZGl0YWJsZSd9XCI7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBcIns9ICR7dWk+L2VkaXRNb2RlfSA9PT0gJ0VkaXRhYmxlJ31cIjtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIHZpc2liaWxpdHkgZm9yIENyZWF0ZSBidXR0b25cbiAqXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dFxuICogQHBhcmFtIGNyZWF0aW9uQmVoYXZpb3VyXG4gKiBAcmV0dXJucyB7Kn0gRXhwcmVzc2lvbiBvciBCb29sZWFuIHZhbHVlIG9mIGNyZWF0ZSBoaWRkZW5cbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q3JlYXRlVmlzaWJsZShcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCxcblx0Y3JlYXRpb25Nb2RlOiBDcmVhdGlvbk1vZGUgfCBcIkV4dGVybmFsXCIsXG5cdGlzSW5zZXJ0YWJsZTogRXhwcmVzc2lvbjxib29sZWFuPlxuKTogRXhwcmVzc2lvbjxib29sZWFuPiB7XG5cdGNvbnN0IGN1cnJlbnRFbnRpdHlTZXQgPSBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVNldCgpO1xuXHRjb25zdCBkYXRhTW9kZWxPYmplY3RQYXRoID0gY29udmVydGVyQ29udGV4dC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCk7XG5cdGNvbnN0IGlzQ3JlYXRlSGlkZGVuOiBFeHByZXNzaW9uPGJvb2xlYW4+ID0gY3VycmVudEVudGl0eVNldFxuXHRcdD8gYW5ub3RhdGlvbkV4cHJlc3Npb24oXG5cdFx0XHRcdChjdXJyZW50RW50aXR5U2V0Py5hbm5vdGF0aW9ucy5VST8uQ3JlYXRlSGlkZGVuIGFzIFByb3BlcnR5QW5ub3RhdGlvblZhbHVlPGJvb2xlYW4+KSB8fCBmYWxzZSxcblx0XHRcdFx0ZGF0YU1vZGVsT2JqZWN0UGF0aC5uYXZpZ2F0aW9uUHJvcGVydGllcy5tYXAobmF2UHJvcCA9PiBuYXZQcm9wLm5hbWUpXG5cdFx0ICApXG5cdFx0OiBjb25zdGFudChmYWxzZSk7XG5cdC8vIGlmIHRoZXJlIGlzIGEgY3VzdG9tIG5ldyBhY3Rpb24gdGhlIGNyZWF0ZSBidXR0b24gd2lsbCBiZSBib3VuZCBhZ2FpbnN0IHRoaXMgbmV3IGFjdGlvbiAoaW5zdGVhZCBvZiBhIFBPU1QgYWN0aW9uKS5cblx0Ly8gVGhlIHZpc2liaWxpdHkgb2YgdGhlIGNyZWF0ZSBidXR0b24gdGhlbiBkZXBlbmRzIG9uIHRoZSBuZXcgYWN0aW9uJ3MgT3BlcmF0aW9uQXZhaWxhYmxlIGFubm90YXRpb24gKGluc3RlYWQgb2YgdGhlIGluc2VydFJlc3RyaWN0aW9ucyk6XG5cdC8vIE9wZXJhdGlvbkF2YWlsYWJsZSA9IHRydWUgb3IgdW5kZWZpbmVkIC0+IGNyZWF0ZSBpcyB2aXNpYmxlXG5cdC8vIE9wZXJhdGlvbkF2YWlsYWJsZSA9IGZhbHNlIC0+IGNyZWF0ZSBpcyBub3QgdmlzaWJsZVxuXHRjb25zdCBuZXdBY3Rpb25OYW1lOiBCaW5kaW5nRXhwcmVzc2lvbjxzdHJpbmc+ID0gY3VycmVudEVudGl0eVNldD8uYW5ub3RhdGlvbnMuQ29tbW9uPy5EcmFmdFJvb3Q/Lk5ld0FjdGlvbj8udG9TdHJpbmcoKTtcblx0Y29uc3Qgc2hvd0NyZWF0ZUZvck5ld0FjdGlvbiA9IG5ld0FjdGlvbk5hbWVcblx0XHQ/IGFubm90YXRpb25FeHByZXNzaW9uKFxuXHRcdFx0XHRjb252ZXJ0ZXJDb250ZXh0Py5nZXRFbnRpdHlUeXBlKCkuYWN0aW9uc1tuZXdBY3Rpb25OYW1lXS5hbm5vdGF0aW9ucz8uQ29yZT8uT3BlcmF0aW9uQXZhaWxhYmxlPy52YWx1ZU9mKCksXG5cdFx0XHRcdFtdLFxuXHRcdFx0XHR0cnVlXG5cdFx0ICApXG5cdFx0OiB1bmRlZmluZWQ7XG5cblx0Ly8gLSBJZiBpdCdzIHN0YXRpY2FsbHkgbm90IGluc2VydGFibGUgLT4gY3JlYXRlIGlzIG5vdCB2aXNpYmxlXG5cdC8vIC0gSWYgY3JlYXRlIGlzIHN0YXRpY2FsbHkgaGlkZGVuIC0+IGNyZWF0ZSBpcyBub3QgdmlzaWJsZVxuXHQvLyAtIElmIGl0J3MgYW4gQUxQIHRlbXBsYXRlIC0+IGNyZWF0ZSBpcyBub3QgdmlzaWJsZVxuXHQvLyAtXG5cdC8vIC0gT3RoZXJ3aXNlXG5cdC8vIFx0IC0gSWYgdGhlIGNyZWF0ZSBtb2RlIGlzIGV4dGVybmFsIC0+IGNyZWF0ZSBpcyB2aXNpYmxlXG5cdC8vIFx0IC0gSWYgd2UncmUgb24gdGhlIGxpc3QgcmVwb3J0IC0+IGNyZWF0ZSBpcyB2aXNpYmxlXG5cdC8vIFx0IC0gT3RoZXJ3aXNlXG5cdC8vIFx0ICAgLSBUaGlzIGRlcGVuZHMgb24gdGhlIHZhbHVlIG9mIHRoZSB0aGUgVUkuSXNFZGl0YWJsZVxuXHRyZXR1cm4gaWZFbHNlKFxuXHRcdG9yKFxuXHRcdFx0b3IoXG5cdFx0XHRcdGVxdWFsKHNob3dDcmVhdGVGb3JOZXdBY3Rpb24sIGZhbHNlKSxcblx0XHRcdFx0YW5kKGlzQ29uc3RhbnQoaXNJbnNlcnRhYmxlKSwgZXF1YWwoaXNJbnNlcnRhYmxlLCBmYWxzZSksIGVxdWFsKHNob3dDcmVhdGVGb3JOZXdBY3Rpb24sIHVuZGVmaW5lZCkpXG5cdFx0XHQpLFxuXHRcdFx0aXNDb25zdGFudChpc0NyZWF0ZUhpZGRlbikgJiYgZXF1YWwoaXNDcmVhdGVIaWRkZW4sIHRydWUpLFxuXHRcdFx0Y29udmVydGVyQ29udGV4dC5nZXRUZW1wbGF0ZVR5cGUoKSA9PT0gVGVtcGxhdGVUeXBlLkFuYWx5dGljYWxMaXN0UGFnZVxuXHRcdCksXG5cdFx0ZmFsc2UsXG5cdFx0aWZFbHNlKFxuXHRcdFx0b3IoY3JlYXRpb25Nb2RlID09PSBcIkV4dGVybmFsXCIsIGNvbnZlcnRlckNvbnRleHQuZ2V0VGVtcGxhdGVUeXBlKCkgPT09IFRlbXBsYXRlVHlwZS5MaXN0UmVwb3J0KSxcblx0XHRcdHRydWUsXG5cdFx0XHRhbmQobm90KGlzQ3JlYXRlSGlkZGVuKSwgVUkuSXNFZGl0YWJsZSlcblx0XHQpXG5cdCk7XG59XG5cbi8qKlxuICogUmV0dXJucyB2aXNpYmlsaXR5IGZvciBDcmVhdGUgYnV0dG9uXG4gKlxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHRcbiAqIEBwYXJhbSBjcmVhdGlvbkJlaGF2aW91clxuICogQHJldHVybnMgeyp9IEV4cHJlc3Npb24gb3IgQm9vbGVhbiB2YWx1ZSBvZiBjcmVhdGVoaWRkZW5cbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFzdGVFbmFibGVkKFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRjcmVhdGlvbkJlaGF2aW91cjogVGFibGVBbm5vdGF0aW9uQ29uZmlndXJhdGlvbltcImNyZWF0ZVwiXSxcblx0aXNJbnNlcnRhYmxlOiBFeHByZXNzaW9uPGJvb2xlYW4+XG4pOiBFeHByZXNzaW9uPGJvb2xlYW4+IHtcblx0Ly8gSWYgY3JlYXRlIGlzIG5vdCB2aXNpYmxlIC0+IGl0J3Mgbm90IGVuYWJsZWRcblx0Ly8gSWYgY3JlYXRlIGlzIHZpc2libGUgLT5cblx0Ly8gXHQgSWYgaXQncyBpbiB0aGUgTGlzdFJlcG9ydCAtPiBub3QgZW5hYmxlZFxuXHQvL1x0IElmIGl0J3MgaW5zZXJ0YWJsZSAtPiBlbmFibGVkXG5cdHJldHVybiBpZkVsc2UoXG5cdFx0ZXF1YWwoZ2V0Q3JlYXRlVmlzaWJsZShjb252ZXJ0ZXJDb250ZXh0LCBjcmVhdGlvbkJlaGF2aW91ci5tb2RlLCBpc0luc2VydGFibGUpLCB0cnVlKSxcblx0XHRjb252ZXJ0ZXJDb250ZXh0LmdldFRlbXBsYXRlVHlwZSgpID09PSBUZW1wbGF0ZVR5cGUuT2JqZWN0UGFnZSAmJiBpc0luc2VydGFibGUsXG5cdFx0ZmFsc2Vcblx0KTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgSlNPTiBzdHJpbmcgY29udGFpbmluZyBQcmVzZW50YXRpb24gVmFyaWFudCBzb3J0IGNvbmRpdGlvbnMuXG4gKlxuICogQHBhcmFtIHByZXNlbnRhdGlvblZhcmlhbnRBbm5vdGF0aW9uIHtQcmVzZW50YXRpb25WYXJpYW50VHlwZVR5cGVzIHwgdW5kZWZpbmVkfSBQcmVzZW50YXRpb24gdmFyaWFudCBhbm5vdGF0aW9uXG4gKiBAcGFyYW0gY29sdW1ucyBDb252ZXJ0ZXIgcHJvY2Vzc2VkIHRhYmxlIGNvbHVtbnNcbiAqIEByZXR1cm5zIHtzdHJpbmcgfCB1bmRlZmluZWR9IFNvcnQgY29uZGl0aW9ucyBmb3IgYSBQcmVzZW50YXRpb24gdmFyaWFudC5cbiAqL1xuZnVuY3Rpb24gZ2V0U29ydENvbmRpdGlvbnMoXG5cdHByZXNlbnRhdGlvblZhcmlhbnRBbm5vdGF0aW9uOiBQcmVzZW50YXRpb25WYXJpYW50VHlwZVR5cGVzIHwgdW5kZWZpbmVkLFxuXHRjb2x1bW5zOiBUYWJsZUNvbHVtbltdXG4pOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuXHRsZXQgc29ydENvbmRpdGlvbnM6IHN0cmluZyB8IHVuZGVmaW5lZDtcblx0aWYgKHByZXNlbnRhdGlvblZhcmlhbnRBbm5vdGF0aW9uPy5Tb3J0T3JkZXIpIHtcblx0XHRjb25zdCBzb3J0ZXJzOiBTb3J0ZXJUeXBlW10gPSBbXTtcblx0XHRjb25zdCBjb25kaXRpb25zID0ge1xuXHRcdFx0c29ydGVyczogc29ydGVyc1xuXHRcdH07XG5cdFx0cHJlc2VudGF0aW9uVmFyaWFudEFubm90YXRpb24uU29ydE9yZGVyLmZvckVhY2goY29uZGl0aW9uID0+IHtcblx0XHRcdGNvbnN0IHByb3BlcnR5TmFtZSA9IChjb25kaXRpb24uUHJvcGVydHkgYXMgUHJvcGVydHlQYXRoKT8uJHRhcmdldD8ubmFtZTtcblx0XHRcdGNvbnN0IHNvcnRDb2x1bW4gPSBjb2x1bW5zLmZpbmQoY29sdW1uID0+IGNvbHVtbi5uYW1lID09PSBwcm9wZXJ0eU5hbWUpIGFzIEFubm90YXRpb25UYWJsZUNvbHVtbjtcblx0XHRcdHNvcnRDb2x1bW4/LnByb3BlcnR5SW5mb3M/LmZvckVhY2gocmVsYXRlZFByb3BlcnR5TmFtZSA9PiB7XG5cdFx0XHRcdC8vIENvbXBsZXggUHJvcGVydHlJbmZvLiBBZGQgZWFjaCByZWxhdGVkIHByb3BlcnR5IGZvciBzb3J0aW5nLlxuXHRcdFx0XHRjb25kaXRpb25zLnNvcnRlcnMucHVzaCh7XG5cdFx0XHRcdFx0bmFtZTogcmVsYXRlZFByb3BlcnR5TmFtZSxcblx0XHRcdFx0XHRkZXNjZW5kaW5nOiAhIWNvbmRpdGlvbi5EZXNjZW5kaW5nXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cblx0XHRcdGlmICghc29ydENvbHVtbj8ucHJvcGVydHlJbmZvcz8ubGVuZ3RoKSB7XG5cdFx0XHRcdC8vIE5vdCBhIGNvbXBsZXggUHJvcGVydHlJbmZvLiBDb25zaWRlciB0aGUgcHJvcGVydHkgaXRzZWxmIGZvciBzb3J0aW5nLlxuXHRcdFx0XHRjb25kaXRpb25zLnNvcnRlcnMucHVzaCh7XG5cdFx0XHRcdFx0bmFtZTogcHJvcGVydHlOYW1lLFxuXHRcdFx0XHRcdGRlc2NlbmRpbmc6ICEhY29uZGl0aW9uLkRlc2NlbmRpbmdcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0c29ydENvbmRpdGlvbnMgPSBjb25kaXRpb25zLnNvcnRlcnMubGVuZ3RoID8gSlNPTi5zdHJpbmdpZnkoY29uZGl0aW9ucykgOiB1bmRlZmluZWQ7XG5cdH1cblx0cmV0dXJuIHNvcnRDb25kaXRpb25zO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGFuIGFycmF5IG9mIHBycGVydHlQYXRoIHRvIGFuIGFycmF5IG9mIHByb3BlcnR5SW5mbyBuYW1lcy5cbiAqXG4gKiBAcGFyYW0gcGF0aHMgdGhlIGFycmF5IHRvIGJlIGNvbnZlcnRlZFxuICogQHBhcmFtIGNvbHVtbnMgdGhlIGFycmF5IG9mIHByb3BlcnR5SW5mb3NcbiAqIEByZXR1cm5zIGFuIGFycmF5IG9mIHByb3BydHlJbmZvIG5hbWVzXG4gKi9cblxuZnVuY3Rpb24gY29udmVydFByb3BlcnR5UGF0aHNUb0luZm9OYW1lcyhwYXRoczogUHJvcGVydHlQYXRoW10sIGNvbHVtbnM6IFRhYmxlQ29sdW1uW10pOiBzdHJpbmdbXSB7XG5cdGNvbnN0IGluZm9OYW1lczogc3RyaW5nW10gPSBbXTtcblx0cGF0aHMuZm9yRWFjaChjdXJyZW50UGF0aCA9PiB7XG5cdFx0aWYgKGN1cnJlbnRQYXRoPy4kdGFyZ2V0Py5uYW1lKSB7XG5cdFx0XHRjb25zdCBwcm9wZXJ0eUluZm8gPSBjb2x1bW5zLmZpbmQoY29sdW1uID0+IHtcblx0XHRcdFx0Y29uc3QgYW5ub3RhdGlvbkNvbHVtbiA9IGNvbHVtbiBhcyBBbm5vdGF0aW9uVGFibGVDb2x1bW47XG5cdFx0XHRcdHJldHVybiAhYW5ub3RhdGlvbkNvbHVtbi5wcm9wZXJ0eUluZm9zICYmIGFubm90YXRpb25Db2x1bW4ucmVsYXRpdmVQYXRoID09PSBjdXJyZW50UGF0aD8uJHRhcmdldD8ubmFtZTtcblx0XHRcdH0pO1xuXHRcdFx0aWYgKHByb3BlcnR5SW5mbykge1xuXHRcdFx0XHRpbmZvTmFtZXMucHVzaChwcm9wZXJ0eUluZm8ubmFtZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHRyZXR1cm4gaW5mb05hbWVzO1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBKU09OIHN0cmluZyBjb250YWluaW5nIFByZXNlbnRhdGlvbiBWYXJpYW50IGdyb3VwIGNvbmRpdGlvbnMuXG4gKlxuICogQHBhcmFtIHByZXNlbnRhdGlvblZhcmlhbnRBbm5vdGF0aW9uIHtQcmVzZW50YXRpb25WYXJpYW50VHlwZVR5cGVzIHwgdW5kZWZpbmVkfSBQcmVzZW50YXRpb24gdmFyaWFudCBhbm5vdGF0aW9uXG4gKiBAcGFyYW0gY29sdW1ucyBDb252ZXJ0ZXIgcHJvY2Vzc2VkIHRhYmxlIGNvbHVtbnNcbiAqIEByZXR1cm5zIHtzdHJpbmcgfCB1bmRlZmluZWR9IEdyb3VwIGNvbmRpdGlvbnMgZm9yIGEgUHJlc2VudGF0aW9uIHZhcmlhbnQuXG4gKi9cbmZ1bmN0aW9uIGdldEdyb3VwQ29uZGl0aW9ucyhcblx0cHJlc2VudGF0aW9uVmFyaWFudEFubm90YXRpb246IFByZXNlbnRhdGlvblZhcmlhbnRUeXBlVHlwZXMgfCB1bmRlZmluZWQsXG5cdGNvbHVtbnM6IFRhYmxlQ29sdW1uW11cbik6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG5cdGxldCBncm91cENvbmRpdGlvbnM6IHN0cmluZyB8IHVuZGVmaW5lZDtcblx0aWYgKHByZXNlbnRhdGlvblZhcmlhbnRBbm5vdGF0aW9uPy5Hcm91cEJ5KSB7XG5cdFx0Y29uc3QgYUdyb3VwQnkgPSBwcmVzZW50YXRpb25WYXJpYW50QW5ub3RhdGlvbi5Hcm91cEJ5IGFzIFByb3BlcnR5UGF0aFtdO1xuXHRcdGNvbnN0IGFHcm91cExldmVscyA9IGNvbnZlcnRQcm9wZXJ0eVBhdGhzVG9JbmZvTmFtZXMoYUdyb3VwQnksIGNvbHVtbnMpLm1hcChpbmZvTmFtZSA9PiB7XG5cdFx0XHRyZXR1cm4geyBuYW1lOiBpbmZvTmFtZSB9O1xuXHRcdH0pO1xuXG5cdFx0Z3JvdXBDb25kaXRpb25zID0gYUdyb3VwTGV2ZWxzLmxlbmd0aCA/IEpTT04uc3RyaW5naWZ5KHsgZ3JvdXBMZXZlbHM6IGFHcm91cExldmVscyB9KSA6IHVuZGVmaW5lZDtcblx0fVxuXHRyZXR1cm4gZ3JvdXBDb25kaXRpb25zO1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBKU09OIHN0cmluZyBjb250YWluaW5nIFByZXNlbnRhdGlvbiBWYXJpYW50IGFnZ3JlZ2F0ZSBjb25kaXRpb25zLlxuICpcbiAqIEBwYXJhbSBwcmVzZW50YXRpb25WYXJpYW50QW5ub3RhdGlvbiB7UHJlc2VudGF0aW9uVmFyaWFudFR5cGVUeXBlcyB8IHVuZGVmaW5lZH0gUHJlc2VudGF0aW9uIHZhcmlhbnQgYW5ub3RhdGlvblxuICogQHBhcmFtIGNvbHVtbnMgQ29udmVydGVyIHByb2Nlc3NlZCB0YWJsZSBjb2x1bW5zXG4gKiBAcmV0dXJucyB7c3RyaW5nIHwgdW5kZWZpbmVkfSBHcm91cCBjb25kaXRpb25zIGZvciBhIFByZXNlbnRhdGlvbiB2YXJpYW50LlxuICovXG5mdW5jdGlvbiBnZXRBZ2dyZWdhdGVDb25kaXRpb25zKFxuXHRwcmVzZW50YXRpb25WYXJpYW50QW5ub3RhdGlvbjogUHJlc2VudGF0aW9uVmFyaWFudFR5cGVUeXBlcyB8IHVuZGVmaW5lZCxcblx0Y29sdW1uczogVGFibGVDb2x1bW5bXVxuKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcblx0bGV0IGFnZ3JlZ2F0ZUNvbmRpdGlvbnM6IHN0cmluZyB8IHVuZGVmaW5lZDtcblx0aWYgKHByZXNlbnRhdGlvblZhcmlhbnRBbm5vdGF0aW9uPy5Ub3RhbCkge1xuXHRcdGNvbnN0IGFUb3RhbHMgPSBwcmVzZW50YXRpb25WYXJpYW50QW5ub3RhdGlvbi5Ub3RhbCBhcyBQcm9wZXJ0eVBhdGhbXTtcblx0XHRjb25zdCBhZ2dyZWdhdGVzOiBSZWNvcmQ8c3RyaW5nLCBvYmplY3Q+ID0ge307XG5cdFx0Y29udmVydFByb3BlcnR5UGF0aHNUb0luZm9OYW1lcyhhVG90YWxzLCBjb2x1bW5zKS5mb3JFYWNoKGluZm9OYW1lID0+IHtcblx0XHRcdGFnZ3JlZ2F0ZXNbaW5mb05hbWVdID0ge307XG5cdFx0fSk7XG5cblx0XHRhZ2dyZWdhdGVDb25kaXRpb25zID0gSlNPTi5zdHJpbmdpZnkoYWdncmVnYXRlcyk7XG5cdH1cblxuXHRyZXR1cm4gYWdncmVnYXRlQ29uZGl0aW9ucztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRhYmxlQW5ub3RhdGlvbkNvbmZpZ3VyYXRpb24oXG5cdGxpbmVJdGVtQW5ub3RhdGlvbjogTGluZUl0ZW0gfCB1bmRlZmluZWQsXG5cdHZpc3VhbGl6YXRpb25QYXRoOiBzdHJpbmcsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdHRhYmxlTWFuaWZlc3RDb25maWd1cmF0aW9uOiBUYWJsZUNvbnRyb2xDb25maWd1cmF0aW9uLFxuXHRjb2x1bW5zOiBUYWJsZUNvbHVtbltdLFxuXHRwcmVzZW50YXRpb25WYXJpYW50QW5ub3RhdGlvbj86IFByZXNlbnRhdGlvblZhcmlhbnRUeXBlVHlwZXNcbik6IFRhYmxlQW5ub3RhdGlvbkNvbmZpZ3VyYXRpb24ge1xuXHQvLyBOZWVkIHRvIGdldCB0aGUgdGFyZ2V0XG5cdGNvbnN0IHsgbmF2aWdhdGlvblByb3BlcnR5UGF0aCB9ID0gc3BsaXRQYXRoKHZpc3VhbGl6YXRpb25QYXRoKTtcblx0Y29uc3QgdGl0bGU6IGFueSA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCgpLnRhcmdldEVudGl0eVR5cGUuYW5ub3RhdGlvbnM/LlVJPy5IZWFkZXJJbmZvPy5UeXBlTmFtZVBsdXJhbDtcblx0Y29uc3QgZW50aXR5U2V0ID0gY29udmVydGVyQ29udGV4dC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCkuc3RhcnRpbmdFbnRpdHlTZXQ7XG5cdGNvbnN0IHBhZ2VNYW5pZmVzdFNldHRpbmdzOiBNYW5pZmVzdFdyYXBwZXIgPSBjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0V3JhcHBlcigpO1xuXHRjb25zdCBpc0VudGl0eVNldDogYm9vbGVhbiA9IG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgubGVuZ3RoID09PSAwLFxuXHRcdHAxM25Nb2RlOiBzdHJpbmcgfCB1bmRlZmluZWQgPSBnZXRQMTNuTW9kZSh2aXN1YWxpemF0aW9uUGF0aCwgY29udmVydGVyQ29udGV4dCwgdGFibGVNYW5pZmVzdENvbmZpZ3VyYXRpb24pLFxuXHRcdGlkID0gaXNFbnRpdHlTZXQgJiYgZW50aXR5U2V0ID8gVGFibGVJRChlbnRpdHlTZXQubmFtZSwgXCJMaW5lSXRlbVwiKSA6IFRhYmxlSUQodmlzdWFsaXphdGlvblBhdGgpO1xuXHRjb25zdCB0YXJnZXRDYXBhYmlsaXRpZXMgPSBnZXRDYXBhYmlsaXR5UmVzdHJpY3Rpb24oY29udmVydGVyQ29udGV4dCk7XG5cdGNvbnN0IHNlbGVjdGlvbk1vZGUgPSBnZXRTZWxlY3Rpb25Nb2RlKGxpbmVJdGVtQW5ub3RhdGlvbiwgdmlzdWFsaXphdGlvblBhdGgsIGNvbnZlcnRlckNvbnRleHQsIGlzRW50aXR5U2V0LCB0YXJnZXRDYXBhYmlsaXRpZXMpO1xuXHRsZXQgdGhyZXNob2xkID0gaXNFbnRpdHlTZXQgPyAzMCA6IDEwO1xuXHRpZiAocHJlc2VudGF0aW9uVmFyaWFudEFubm90YXRpb24/Lk1heEl0ZW1zKSB7XG5cdFx0dGhyZXNob2xkID0gcHJlc2VudGF0aW9uVmFyaWFudEFubm90YXRpb24uTWF4SXRlbXMudmFsdWVPZigpIGFzIG51bWJlcjtcblx0fVxuXG5cdGNvbnN0IG5hdmlnYXRpb25PckNvbGxlY3Rpb25OYW1lID0gaXNFbnRpdHlTZXQgJiYgZW50aXR5U2V0ID8gZW50aXR5U2V0Lm5hbWUgOiBuYXZpZ2F0aW9uUHJvcGVydHlQYXRoO1xuXHRjb25zdCBuYXZpZ2F0aW9uU2V0dGluZ3MgPSBwYWdlTWFuaWZlc3RTZXR0aW5ncy5nZXROYXZpZ2F0aW9uQ29uZmlndXJhdGlvbihuYXZpZ2F0aW9uT3JDb2xsZWN0aW9uTmFtZSk7XG5cdGNvbnN0IGNyZWF0aW9uQmVoYXZpb3VyID0gX2dldENyZWF0aW9uQmVoYXZpb3VyKGxpbmVJdGVtQW5ub3RhdGlvbiwgdGFibGVNYW5pZmVzdENvbmZpZ3VyYXRpb24sIGNvbnZlcnRlckNvbnRleHQsIG5hdmlnYXRpb25TZXR0aW5ncyk7XG5cdGxldCBpc1BhcmVudERlbGV0YWJsZTogYW55LCBwYXJlbnRFbnRpdHlTZXREZWxldGFibGU7XG5cdGlmIChjb252ZXJ0ZXJDb250ZXh0LmdldFRlbXBsYXRlVHlwZSgpID09PSBUZW1wbGF0ZVR5cGUuT2JqZWN0UGFnZSkge1xuXHRcdGlzUGFyZW50RGVsZXRhYmxlID0gaXNQYXRoRGVsZXRhYmxlKGNvbnZlcnRlckNvbnRleHQuZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCgpLCB1bmRlZmluZWQsIHRydWUpO1xuXHRcdGlmIChpc1BhcmVudERlbGV0YWJsZT8uY3VycmVudEVudGl0eVJlc3RyaWN0aW9uKSB7XG5cdFx0XHRwYXJlbnRFbnRpdHlTZXREZWxldGFibGUgPSB1bmRlZmluZWQ7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHBhcmVudEVudGl0eVNldERlbGV0YWJsZSA9IGlzUGFyZW50RGVsZXRhYmxlID8gY29tcGlsZUJpbmRpbmcoaXNQYXJlbnREZWxldGFibGUsIHRydWUpIDogaXNQYXJlbnREZWxldGFibGU7XG5cdFx0fVxuXHR9XG5cdGNvbnN0IGRhdGFNb2RlbE9iamVjdFBhdGggPSBjb252ZXJ0ZXJDb250ZXh0LmdldERhdGFNb2RlbE9iamVjdFBhdGgoKTtcblx0Y29uc3QgaXNJbnNlcnRhYmxlOiBFeHByZXNzaW9uPGJvb2xlYW4+ID0gaXNQYXRoSW5zZXJ0YWJsZShkYXRhTW9kZWxPYmplY3RQYXRoKTtcblxuXHRyZXR1cm4ge1xuXHRcdGlkOiBpZCxcblx0XHRlbnRpdHlOYW1lOiBlbnRpdHlTZXQgPyBlbnRpdHlTZXQubmFtZSA6IFwiXCIsXG5cdFx0Y29sbGVjdGlvbjogZ2V0VGFyZ2V0T2JqZWN0UGF0aChjb252ZXJ0ZXJDb250ZXh0LmdldERhdGFNb2RlbE9iamVjdFBhdGgoKSksXG5cdFx0bmF2aWdhdGlvblBhdGg6IG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgsXG5cdFx0aXNFbnRpdHlTZXQ6IGlzRW50aXR5U2V0LFxuXHRcdHJvdzogX2dldFJvd0NvbmZpZ3VyYXRpb25Qcm9wZXJ0eShcblx0XHRcdGxpbmVJdGVtQW5ub3RhdGlvbixcblx0XHRcdHZpc3VhbGl6YXRpb25QYXRoLFxuXHRcdFx0Y29udmVydGVyQ29udGV4dCxcblx0XHRcdG5hdmlnYXRpb25TZXR0aW5ncyxcblx0XHRcdG5hdmlnYXRpb25PckNvbGxlY3Rpb25OYW1lXG5cdFx0KSxcblx0XHRwMTNuTW9kZTogcDEzbk1vZGUsXG5cdFx0c2hvdzoge1xuXHRcdFx0XCJkZWxldGVcIjogZ2V0RGVsZXRlVmlzaWJsZShjb252ZXJ0ZXJDb250ZXh0LCBuYXZpZ2F0aW9uUHJvcGVydHlQYXRoLCB0YXJnZXRDYXBhYmlsaXRpZXMuaXNEZWxldGFibGUpLFxuXHRcdFx0Y3JlYXRlOiBjb21waWxlQmluZGluZyhnZXRDcmVhdGVWaXNpYmxlKGNvbnZlcnRlckNvbnRleHQsIGNyZWF0aW9uQmVoYXZpb3VyPy5tb2RlLCBpc0luc2VydGFibGUpKSxcblx0XHRcdHBhc3RlOiBjb21waWxlQmluZGluZyhnZXRQYXN0ZUVuYWJsZWQoY29udmVydGVyQ29udGV4dCwgY3JlYXRpb25CZWhhdmlvdXIsIGlzSW5zZXJ0YWJsZSkpXG5cdFx0fSxcblx0XHRkaXNwbGF5TW9kZTogaXNJbkRpc3BsYXlNb2RlKGNvbnZlcnRlckNvbnRleHQpLFxuXHRcdGNyZWF0ZTogY3JlYXRpb25CZWhhdmlvdXIsXG5cdFx0c2VsZWN0aW9uTW9kZTogc2VsZWN0aW9uTW9kZSxcblx0XHRhdXRvQmluZE9uSW5pdDpcblx0XHRcdGNvbnZlcnRlckNvbnRleHQuZ2V0VGVtcGxhdGVUeXBlKCkgIT09IFRlbXBsYXRlVHlwZS5MaXN0UmVwb3J0ICYmXG5cdFx0XHRjb252ZXJ0ZXJDb250ZXh0LmdldFRlbXBsYXRlVHlwZSgpICE9PSBUZW1wbGF0ZVR5cGUuQW5hbHl0aWNhbExpc3RQYWdlLFxuXHRcdGVuYWJsZUNvbnRyb2xWTTogcGFnZU1hbmlmZXN0U2V0dGluZ3MuZ2V0VmFyaWFudE1hbmFnZW1lbnQoKSA9PT0gXCJDb250cm9sXCIgJiYgISFwMTNuTW9kZSxcblx0XHR0aHJlc2hvbGQ6IHRocmVzaG9sZCxcblx0XHRzb3J0Q29uZGl0aW9uczogZ2V0U29ydENvbmRpdGlvbnMocHJlc2VudGF0aW9uVmFyaWFudEFubm90YXRpb24sIGNvbHVtbnMpLFxuXHRcdHBhcmVudEVudGl0eURlbGV0ZUVuYWJsZWQ6IHBhcmVudEVudGl0eVNldERlbGV0YWJsZSxcblx0XHR0aXRsZTogdGl0bGVcblx0fTtcbn1cblxuZnVuY3Rpb24gaXNJbkRpc3BsYXlNb2RlKGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQpOiBib29sZWFuIHtcblx0Y29uc3QgdGVtcGxhdGVUeXBlID0gY29udmVydGVyQ29udGV4dC5nZXRUZW1wbGF0ZVR5cGUoKTtcblx0aWYgKHRlbXBsYXRlVHlwZSA9PT0gVGVtcGxhdGVUeXBlLkFuYWx5dGljYWxMaXN0UGFnZSB8fCB0ZW1wbGF0ZVR5cGUgPT09IFRlbXBsYXRlVHlwZS5MaXN0UmVwb3J0KSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0Ly8gdXBkYXRhYmxlIHdpbGwgYmUgaGFuZGxlZCBhdCB0aGUgcHJvcGVydHkgbGV2ZWxcblx0cmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIFNwbGl0IHRoZSB2aXN1YWxpemF0aW9uIHBhdGggaW50byB0aGUgbmF2aWdhdGlvbiBwcm9wZXJ0eSBwYXRoIGFuZCBhbm5vdGF0aW9uLlxuICpcbiAqIEBwYXJhbSB2aXN1YWxpemF0aW9uUGF0aFxuICogQHJldHVybnMge29iamVjdH1cbiAqL1xuZnVuY3Rpb24gc3BsaXRQYXRoKHZpc3VhbGl6YXRpb25QYXRoOiBzdHJpbmcpIHtcblx0bGV0IFtuYXZpZ2F0aW9uUHJvcGVydHlQYXRoLCBhbm5vdGF0aW9uUGF0aF0gPSB2aXN1YWxpemF0aW9uUGF0aC5zcGxpdChcIkBcIik7XG5cblx0aWYgKG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgubGFzdEluZGV4T2YoXCIvXCIpID09PSBuYXZpZ2F0aW9uUHJvcGVydHlQYXRoLmxlbmd0aCAtIDEpIHtcblx0XHQvLyBEcm9wIHRyYWlsaW5nIHNsYXNoXG5cdFx0bmF2aWdhdGlvblByb3BlcnR5UGF0aCA9IG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGguc3Vic3RyKDAsIG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgubGVuZ3RoIC0gMSk7XG5cdH1cblx0cmV0dXJuIHsgbmF2aWdhdGlvblByb3BlcnR5UGF0aCwgYW5ub3RhdGlvblBhdGggfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNlbGVjdGlvblZhcmlhbnRDb25maWd1cmF0aW9uKFxuXHRzZWxlY3Rpb25WYXJpYW50UGF0aDogc3RyaW5nLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0XG4pOiBTZWxlY3Rpb25WYXJpYW50Q29uZmlndXJhdGlvbiB8IHVuZGVmaW5lZCB7XG5cdGNvbnN0IHJlc29sdmVkVGFyZ2V0ID0gY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlQW5ub3RhdGlvbihzZWxlY3Rpb25WYXJpYW50UGF0aCk7XG5cdGNvbnN0IHNlbGVjdGlvbjogU2VsZWN0aW9uVmFyaWFudFR5cGUgPSByZXNvbHZlZFRhcmdldC5hbm5vdGF0aW9uIGFzIFNlbGVjdGlvblZhcmlhbnRUeXBlO1xuXG5cdGlmIChzZWxlY3Rpb24pIHtcblx0XHRjb25zdCBwcm9wZXJ0eU5hbWVzOiBzdHJpbmdbXSA9IFtdO1xuXHRcdHNlbGVjdGlvbi5TZWxlY3RPcHRpb25zPy5mb3JFYWNoKChzZWxlY3RPcHRpb246IFNlbGVjdE9wdGlvblR5cGUpID0+IHtcblx0XHRcdGNvbnN0IHByb3BlcnR5TmFtZTogYW55ID0gc2VsZWN0T3B0aW9uLlByb3BlcnR5TmFtZTtcblx0XHRcdGNvbnN0IFByb3BlcnR5UGF0aDogc3RyaW5nID0gcHJvcGVydHlOYW1lLnZhbHVlO1xuXHRcdFx0aWYgKHByb3BlcnR5TmFtZXMuaW5kZXhPZihQcm9wZXJ0eVBhdGgpID09PSAtMSkge1xuXHRcdFx0XHRwcm9wZXJ0eU5hbWVzLnB1c2goUHJvcGVydHlQYXRoKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dGV4dDogc2VsZWN0aW9uPy5UZXh0Py50b1N0cmluZygpLFxuXHRcdFx0cHJvcGVydHlOYW1lczogcHJvcGVydHlOYW1lc1xuXHRcdH07XG5cdH1cblx0cmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRhYmxlTWFuaWZlc3RDb25maWd1cmF0aW9uKFxuXHRsaW5lSXRlbUFubm90YXRpb246IExpbmVJdGVtIHwgdW5kZWZpbmVkLFxuXHR2aXN1YWxpemF0aW9uUGF0aDogc3RyaW5nLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRpc0NvbmRlbnNlZFRhYmxlTGF5b3V0Q29tcGxpYW50OiBib29sZWFuID0gZmFsc2Vcbik6IFRhYmxlQ29udHJvbENvbmZpZ3VyYXRpb24ge1xuXHRjb25zdCB0YWJsZU1hbmlmZXN0U2V0dGluZ3M6IFRhYmxlTWFuaWZlc3RDb25maWd1cmF0aW9uID0gY29udmVydGVyQ29udGV4dC5nZXRNYW5pZmVzdENvbnRyb2xDb25maWd1cmF0aW9uKHZpc3VhbGl6YXRpb25QYXRoKTtcblx0Y29uc3QgdGFibGVTZXR0aW5ncyA9IHRhYmxlTWFuaWZlc3RTZXR0aW5ncy50YWJsZVNldHRpbmdzO1xuXHRsZXQgcXVpY2tTZWxlY3Rpb25WYXJpYW50OiBhbnk7XG5cdGNvbnN0IHF1aWNrRmlsdGVyUGF0aHM6IHsgYW5ub3RhdGlvblBhdGg6IHN0cmluZyB9W10gPSBbXTtcblx0bGV0IGVuYWJsZUV4cG9ydCA9IHRydWU7XG5cdGxldCBjcmVhdGlvbk1vZGUgPSBDcmVhdGlvbk1vZGUuTmV3UGFnZTtcblx0bGV0IGZpbHRlcnM7XG5cdGxldCBjcmVhdGVBdEVuZCA9IHRydWU7XG5cdGxldCBkaXNhYmxlQWRkUm93QnV0dG9uRm9yRW1wdHlEYXRhID0gZmFsc2U7XG5cdGxldCBjb25kZW5zZWRUYWJsZUxheW91dCA9IGZhbHNlO1xuXHRsZXQgaGlkZVRhYmxlVGl0bGUgPSBmYWxzZTtcblx0bGV0IHRhYmxlVHlwZTogVGFibGVUeXBlID0gXCJSZXNwb25zaXZlVGFibGVcIjtcblx0bGV0IGVuYWJsZUZ1bGxTY3JlZW4gPSBmYWxzZTtcblx0bGV0IHNlbGVjdGlvbkxpbWl0ID0gMjAwO1xuXHRsZXQgZW5hYmxlUGFzdGUgPSBjb252ZXJ0ZXJDb250ZXh0LmdldFRlbXBsYXRlVHlwZSgpID09PSBcIk9iamVjdFBhZ2VcIjtcblx0Y29uc3Qgc2hlbGxTZXJ2aWNlcyA9IGNvbnZlcnRlckNvbnRleHQuZ2V0U2hlbGxTZXJ2aWNlcygpO1xuXHRjb25zdCB1c2VyQ29udGVudERlbnNpdHkgPSBzaGVsbFNlcnZpY2VzPy5nZXRDb250ZW50RGVuc2l0eSgpO1xuXHRjb25zdCBhcHBDb250ZW50RGVuc2l0eSA9IGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RXcmFwcGVyKCkuZ2V0Q29udGVudERlbnNpdGllcygpO1xuXHRjb25zdCBlbnRpdHlUeXBlID0gY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlKCk7XG5cdGNvbnN0IGFnZ3JlZ2F0aW9uSGVscGVyID0gbmV3IEFnZ3JlZ2F0aW9uSGVscGVyKGVudGl0eVR5cGUsIGNvbnZlcnRlckNvbnRleHQpO1xuXHRpZiAoKGFwcENvbnRlbnREZW5zaXR5Py5jb3p5ID09PSB0cnVlICYmIGFwcENvbnRlbnREZW5zaXR5Py5jb21wYWN0ICE9PSB0cnVlKSB8fCB1c2VyQ29udGVudERlbnNpdHkgPT09IFwiY296eVwiKSB7XG5cdFx0aXNDb25kZW5zZWRUYWJsZUxheW91dENvbXBsaWFudCA9IGZhbHNlO1xuXHR9XG5cdGlmICh0YWJsZVNldHRpbmdzICYmIGxpbmVJdGVtQW5ub3RhdGlvbikge1xuXHRcdGNvbnN0IHRhcmdldEVudGl0eVR5cGUgPSBjb252ZXJ0ZXJDb250ZXh0LmdldEFubm90YXRpb25FbnRpdHlUeXBlKGxpbmVJdGVtQW5ub3RhdGlvbik7XG5cdFx0dGFibGVTZXR0aW5ncz8ucXVpY2tWYXJpYW50U2VsZWN0aW9uPy5wYXRocz8uZm9yRWFjaCgocGF0aDogeyBhbm5vdGF0aW9uUGF0aDogc3RyaW5nIH0pID0+IHtcblx0XHRcdHF1aWNrU2VsZWN0aW9uVmFyaWFudCA9IHRhcmdldEVudGl0eVR5cGUucmVzb2x2ZVBhdGgoXCJAXCIgKyBwYXRoLmFubm90YXRpb25QYXRoKTtcblx0XHRcdC8vIHF1aWNrU2VsZWN0aW9uVmFyaWFudCA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZUFubm90YXRpb24ocGF0aC5hbm5vdGF0aW9uUGF0aCk7XG5cdFx0XHRpZiAocXVpY2tTZWxlY3Rpb25WYXJpYW50KSB7XG5cdFx0XHRcdHF1aWNrRmlsdGVyUGF0aHMucHVzaCh7IGFubm90YXRpb25QYXRoOiBwYXRoLmFubm90YXRpb25QYXRoIH0pO1xuXHRcdFx0fVxuXHRcdFx0ZmlsdGVycyA9IHtcblx0XHRcdFx0cXVpY2tGaWx0ZXJzOiB7XG5cdFx0XHRcdFx0ZW5hYmxlZDpcblx0XHRcdFx0XHRcdGNvbnZlcnRlckNvbnRleHQuZ2V0VGVtcGxhdGVUeXBlKCkgPT09IFRlbXBsYXRlVHlwZS5MaXN0UmVwb3J0XG5cdFx0XHRcdFx0XHRcdD8gXCJ7PSAke3BhZ2VJbnRlcm5hbD5oYXNQZW5kaW5nRmlsdGVyc30gIT09IHRydWV9XCJcblx0XHRcdFx0XHRcdFx0OiB0cnVlLFxuXHRcdFx0XHRcdHNob3dDb3VudHM6IHRhYmxlU2V0dGluZ3M/LnF1aWNrVmFyaWFudFNlbGVjdGlvbj8uc2hvd0NvdW50cyxcblx0XHRcdFx0XHRwYXRoczogcXVpY2tGaWx0ZXJQYXRoc1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH0pO1xuXHRcdGNyZWF0aW9uTW9kZSA9IHRhYmxlU2V0dGluZ3MuY3JlYXRpb25Nb2RlPy5uYW1lIHx8IGNyZWF0aW9uTW9kZTtcblx0XHRjcmVhdGVBdEVuZCA9IHRhYmxlU2V0dGluZ3MuY3JlYXRpb25Nb2RlPy5jcmVhdGVBdEVuZCAhPT0gdW5kZWZpbmVkID8gdGFibGVTZXR0aW5ncy5jcmVhdGlvbk1vZGU/LmNyZWF0ZUF0RW5kIDogdHJ1ZTtcblx0XHRkaXNhYmxlQWRkUm93QnV0dG9uRm9yRW1wdHlEYXRhID0gISF0YWJsZVNldHRpbmdzLmNyZWF0aW9uTW9kZT8uZGlzYWJsZUFkZFJvd0J1dHRvbkZvckVtcHR5RGF0YTtcblx0XHRjb25kZW5zZWRUYWJsZUxheW91dCA9IHRhYmxlU2V0dGluZ3MuY29uZGVuc2VkVGFibGVMYXlvdXQgIT09IHVuZGVmaW5lZCA/IHRhYmxlU2V0dGluZ3MuY29uZGVuc2VkVGFibGVMYXlvdXQgOiBmYWxzZTtcblx0XHRoaWRlVGFibGVUaXRsZSA9ICEhdGFibGVTZXR0aW5ncy5xdWlja1ZhcmlhbnRTZWxlY3Rpb24/LmhpZGVUYWJsZVRpdGxlO1xuXHRcdHRhYmxlVHlwZSA9IHRhYmxlU2V0dGluZ3M/LnR5cGUgfHwgXCJSZXNwb25zaXZlVGFibGVcIjtcblx0XHRpZiAoY29udmVydGVyQ29udGV4dC5nZXRUZW1wbGF0ZVR5cGUoKSA9PT0gXCJBbmFseXRpY2FsTGlzdFBhZ2VcIikge1xuXHRcdFx0aWYgKHRhYmxlU2V0dGluZ3M/LnR5cGUgPT09IFwiQW5hbHl0aWNhbFRhYmxlXCIgJiYgIWFnZ3JlZ2F0aW9uSGVscGVyLmlzQW5hbHl0aWNzU3VwcG9ydGVkKCkpIHtcblx0XHRcdFx0dGFibGVUeXBlID0gXCJHcmlkVGFibGVcIjtcblx0XHRcdH1cblx0XHRcdGlmICghdGFibGVTZXR0aW5ncz8udHlwZSkge1xuXHRcdFx0XHRpZiAoY29udmVydGVyQ29udGV4dC5nZXRNYW5pZmVzdFdyYXBwZXIoKS5pc0Rlc2t0b3AoKSAmJiBhZ2dyZWdhdGlvbkhlbHBlci5pc0FuYWx5dGljc1N1cHBvcnRlZCgpKSB7XG5cdFx0XHRcdFx0dGFibGVUeXBlID0gXCJBbmFseXRpY2FsVGFibGVcIjtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0YWJsZVR5cGUgPSBcIlJlc3BvbnNpdmVUYWJsZVwiO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVuYWJsZUZ1bGxTY3JlZW4gPSB0YWJsZVNldHRpbmdzLmVuYWJsZUZ1bGxTY3JlZW4gfHwgZmFsc2U7XG5cdFx0aWYgKGVuYWJsZUZ1bGxTY3JlZW4gPT09IHRydWUgJiYgY29udmVydGVyQ29udGV4dC5nZXRUZW1wbGF0ZVR5cGUoKSA9PT0gVGVtcGxhdGVUeXBlLkxpc3RSZXBvcnQpIHtcblx0XHRcdGVuYWJsZUZ1bGxTY3JlZW4gPSBmYWxzZTtcblx0XHRcdGNvbnZlcnRlckNvbnRleHRcblx0XHRcdFx0LmdldERpYWdub3N0aWNzKClcblx0XHRcdFx0LmFkZElzc3VlKElzc3VlQ2F0ZWdvcnkuTWFuaWZlc3QsIElzc3VlU2V2ZXJpdHkuTG93LCBJc3N1ZVR5cGUuRlVMTFNDUkVFTk1PREVfTk9UX09OX0xJU1RSRVBPUlQpO1xuXHRcdH1cblx0XHRzZWxlY3Rpb25MaW1pdCA9IHRhYmxlU2V0dGluZ3Muc2VsZWN0QWxsID09PSB0cnVlIHx8IHRhYmxlU2V0dGluZ3Muc2VsZWN0aW9uTGltaXQgPT09IDAgPyAwIDogdGFibGVTZXR0aW5ncy5zZWxlY3Rpb25MaW1pdCB8fCAyMDA7XG5cdFx0ZW5hYmxlUGFzdGUgPSBjb252ZXJ0ZXJDb250ZXh0LmdldFRlbXBsYXRlVHlwZSgpID09PSBcIk9iamVjdFBhZ2VcIiAmJiB0YWJsZVNldHRpbmdzLmVuYWJsZVBhc3RlICE9PSBmYWxzZTtcblx0XHRlbmFibGVFeHBvcnQgPVxuXHRcdFx0dGFibGVTZXR0aW5ncy5lbmFibGVFeHBvcnQgIT09IHVuZGVmaW5lZFxuXHRcdFx0XHQ/IHRhYmxlU2V0dGluZ3MuZW5hYmxlRXhwb3J0XG5cdFx0XHRcdDogY29udmVydGVyQ29udGV4dC5nZXRUZW1wbGF0ZVR5cGUoKSAhPT0gXCJPYmplY3RQYWdlXCIgfHwgZW5hYmxlUGFzdGU7XG5cdH1cblx0cmV0dXJuIHtcblx0XHRmaWx0ZXJzOiBmaWx0ZXJzLFxuXHRcdHR5cGU6IHRhYmxlVHlwZSxcblx0XHRlbmFibGVGdWxsU2NyZWVuOiBlbmFibGVGdWxsU2NyZWVuLFxuXHRcdGhlYWRlclZpc2libGU6ICEocXVpY2tTZWxlY3Rpb25WYXJpYW50ICYmIGhpZGVUYWJsZVRpdGxlKSxcblx0XHRlbmFibGVFeHBvcnQ6IGVuYWJsZUV4cG9ydCxcblx0XHRjcmVhdGlvbk1vZGU6IGNyZWF0aW9uTW9kZSxcblx0XHRjcmVhdGVBdEVuZDogY3JlYXRlQXRFbmQsXG5cdFx0ZGlzYWJsZUFkZFJvd0J1dHRvbkZvckVtcHR5RGF0YTogZGlzYWJsZUFkZFJvd0J1dHRvbkZvckVtcHR5RGF0YSxcblx0XHR1c2VDb25kZW5zZWRUYWJsZUxheW91dDogY29uZGVuc2VkVGFibGVMYXlvdXQgJiYgaXNDb25kZW5zZWRUYWJsZUxheW91dENvbXBsaWFudCxcblx0XHRzZWxlY3Rpb25MaW1pdDogc2VsZWN0aW9uTGltaXQsXG5cdFx0ZW5hYmxlUGFzdGU6IGVuYWJsZVBhc3RlXG5cdH07XG59XG4iXX0=