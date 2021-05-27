sap.ui.define(["../ManifestSettings", "sap/fe/core/templating/DataModelPathHelper", "./BaseConverter", "../controls/Common/DataVisualization", "../helpers/ID", "sap/fe/core/converters/controls/Common/Table", "sap/fe/core/converters/controls/Common/Action", "sap/fe/core/converters/helpers/ConfigurableObject", "sap/fe/core/converters/helpers/Key", "sap/fe/core/helpers/BindingExpression", "sap/fe/core/converters/helpers/IssueManager"], function (ManifestSettings, DataModelPathHelper, BaseConverter, DataVisualization, ID, Table, Action, ConfigurableObject, Key, BindingExpression, IssueManager) {
  "use strict";

  var _exports = {};
  var IssueCategory = IssueManager.IssueCategory;
  var IssueSeverity = IssueManager.IssueSeverity;
  var IssueType = IssueManager.IssueType;
  var compileBinding = BindingExpression.compileBinding;
  var annotationExpression = BindingExpression.annotationExpression;
  var KeyHelper = Key.KeyHelper;
  var Placement = ConfigurableObject.Placement;
  var insertCustomElements = ConfigurableObject.insertCustomElements;
  var getActionsFromManifest = Action.getActionsFromManifest;
  var getSelectionVariantConfiguration = Table.getSelectionVariantConfiguration;
  var TableID = ID.TableID;
  var FilterVariantManagementID = ID.FilterVariantManagementID;
  var FilterBarID = ID.FilterBarID;
  var isSelectionPresentationCompliant = DataVisualization.isSelectionPresentationCompliant;
  var getSelectionVariant = DataVisualization.getSelectionVariant;
  var isPresentationCompliant = DataVisualization.isPresentationCompliant;
  var getSelectionPresentationVariant = DataVisualization.getSelectionPresentationVariant;
  var getDefaultPresentationVariant = DataVisualization.getDefaultPresentationVariant;
  var getDefaultLineItem = DataVisualization.getDefaultLineItem;
  var getDefaultChart = DataVisualization.getDefaultChart;
  var getDataVisualizationConfiguration = DataVisualization.getDataVisualizationConfiguration;
  var TemplateType = BaseConverter.TemplateType;
  var getTargetObjectPath = DataModelPathHelper.getTargetObjectPath;
  var VisualizationType = ManifestSettings.VisualizationType;
  var AvailabilityType = ManifestSettings.AvailabilityType;

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  /**
   * Returns the condition path required for the condition model. It looks like follow:
   * <1:N-PropertyName>*\/<1:1-PropertyName>/<PropertyName>.
   *
   * @param entityType the root entity type
   * @param propertyPath the full path to the target property
   * @returns {string} the formatted condition path
   */
  var _getConditionPath = function (entityType, propertyPath) {
    var parts = propertyPath.split("/");
    var partialPath;
    var key = "";

    while (parts.length) {
      var part = parts.shift();
      partialPath = partialPath ? partialPath + "/" + part : part;
      var property = entityType.resolvePath(partialPath);

      if (property._type === "NavigationProperty" && property.isCollection) {
        part += "*";
      }

      key = key ? key + "/" + part : part;
    }

    return key;
  };

  var _createFilterSelectionField = function (entityType, property, fullPropertyPath, includeHidden, converterContext) {
    var _property$annotations, _property$annotations2, _property$annotations3;

    // ignore complex property types and hidden annotated ones
    if (property !== undefined && property.targetType === undefined && (includeHidden || ((_property$annotations = property.annotations) === null || _property$annotations === void 0 ? void 0 : (_property$annotations2 = _property$annotations.UI) === null || _property$annotations2 === void 0 ? void 0 : (_property$annotations3 = _property$annotations2.Hidden) === null || _property$annotations3 === void 0 ? void 0 : _property$annotations3.valueOf()) !== true)) {
      var _property$annotations4, _property$annotations5, _property$annotations6, _property$annotations7, _property$annotations8, _targetEntityType$ann, _targetEntityType$ann2, _targetEntityType$ann3;

      var targetEntityType = converterContext.getAnnotationEntityType(property);
      return {
        key: KeyHelper.getSelectionFieldKeyFromPath(fullPropertyPath),
        annotationPath: converterContext.getAbsoluteAnnotationPath(fullPropertyPath),
        conditionPath: _getConditionPath(entityType, fullPropertyPath),
        availability: ((_property$annotations4 = property.annotations) === null || _property$annotations4 === void 0 ? void 0 : (_property$annotations5 = _property$annotations4.UI) === null || _property$annotations5 === void 0 ? void 0 : (_property$annotations6 = _property$annotations5.HiddenFilter) === null || _property$annotations6 === void 0 ? void 0 : _property$annotations6.valueOf()) === true ? AvailabilityType.Hidden : AvailabilityType.Adaptation,
        label: compileBinding(annotationExpression(((_property$annotations7 = property.annotations.Common) === null || _property$annotations7 === void 0 ? void 0 : (_property$annotations8 = _property$annotations7.Label) === null || _property$annotations8 === void 0 ? void 0 : _property$annotations8.valueOf()) || property.name)),
        group: targetEntityType.name,
        groupLabel: compileBinding(annotationExpression((targetEntityType === null || targetEntityType === void 0 ? void 0 : (_targetEntityType$ann = targetEntityType.annotations) === null || _targetEntityType$ann === void 0 ? void 0 : (_targetEntityType$ann2 = _targetEntityType$ann.Common) === null || _targetEntityType$ann2 === void 0 ? void 0 : (_targetEntityType$ann3 = _targetEntityType$ann2.Label) === null || _targetEntityType$ann3 === void 0 ? void 0 : _targetEntityType$ann3.valueOf()) || targetEntityType.name))
      };
    }

    return undefined;
  };

  var _getSelectionFields = function (entityType, navigationPath, properties, includeHidden, converterContext) {
    var selectionFieldMap = {};

    if (properties) {
      properties.forEach(function (property) {
        var propertyPath = property.name;
        var fullPath = (navigationPath ? navigationPath + "/" : "") + propertyPath;

        var selectionField = _createFilterSelectionField(entityType, property, fullPath, includeHidden, converterContext);

        if (selectionField) {
          selectionFieldMap[fullPath] = selectionField;
        }
      });
    }

    return selectionFieldMap;
  };

  var _getSelectionFieldsByPath = function (entityType, propertyPaths, includeHidden, converterContext) {
    var selectionFields = {};

    if (propertyPaths) {
      propertyPaths.forEach(function (propertyPath) {
        var localSelectionFields;
        var property = entityType.resolvePath(propertyPath);

        if (property === undefined) {
          return;
        }

        if (property._type === "NavigationProperty") {
          // handle navigation properties
          localSelectionFields = _getSelectionFields(entityType, propertyPath, property.targetType.entityProperties, includeHidden, converterContext);
        } else if (property.targetType !== undefined) {
          // handle ComplexType properties
          localSelectionFields = _getSelectionFields(entityType, propertyPath, property.targetType.properties, includeHidden, converterContext);
        } else {
          var navigationPath = propertyPath.includes("/") ? propertyPath.split("/").splice(0, 1).join("/") : "";
          localSelectionFields = _getSelectionFields(entityType, navigationPath, [property], includeHidden, converterContext);
        }

        selectionFields = _objectSpread({}, selectionFields, {}, localSelectionFields);
      });
    }

    return selectionFields;
  };
  /**
   * Enter all DataFields of a given FieldGroup into the filterFacetMap.
   *
   * @param {AnnotationTerm<FieldGroupType>} fieldGroup
   * @returns {Record<string, FilterGroup>} filterFacetMap for the given fieldGroup
   */


  function getFieldGroupFilterGroups(fieldGroup) {
    var filterFacetMap = {};
    fieldGroup.Data.forEach(function (dataField) {
      if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataField") {
        var _fieldGroup$annotatio, _fieldGroup$annotatio2;

        filterFacetMap[dataField.Value.path] = {
          group: fieldGroup.fullyQualifiedName,
          groupLabel: compileBinding(annotationExpression(fieldGroup.Label || ((_fieldGroup$annotatio = fieldGroup.annotations) === null || _fieldGroup$annotatio === void 0 ? void 0 : (_fieldGroup$annotatio2 = _fieldGroup$annotatio.Common) === null || _fieldGroup$annotatio2 === void 0 ? void 0 : _fieldGroup$annotatio2.Label) || fieldGroup.qualifier)) || fieldGroup.qualifier
        };
      }
    });
    return filterFacetMap;
  }
  /**
   * Get all List Report Tables.
   * @param {ListReportViewDefinition[]} views List Report views configured into manifest
   * @returns {TableVisualization[]} List Report Table
   */


  function getTableVisualizations(views) {
    var tables = [];
    views.forEach(function (view) {
      view.presentation.visualizations.forEach(function (visualization) {
        if (visualization.type === VisualizationType.Table) {
          tables.push(visualization);
        }
      });
    });
    return tables;
  }
  /**
   * Is FilterBar search field hidden or not.
   *
   * @param {TableVisualization[]} listReportTables List Report tables
   * @param {ConverterContext} converterContext
   * @returns {boolean} Is FilterBar search field hidden or not
   */


  function getFilterBarhideBasicSearch(listReportTables, converterContext) {
    if (converterContext.getTemplateType() === TemplateType.AnalyticalListPage) {
      return true;
    }
    /**
     * Try to find a non analytical table with the main entity set (page entity set) as collection
     * if at least one table matches these conditions, basic search field must be displayed
     */


    return checkAllTableForEntitySetAreAnalytical(listReportTables, converterContext.getEntitySet().name);
  }
  /**
   * Check that all the tables for a dedicated entityset are configured as analytical table.
   * @param {TableVisualization[]} listReportTables List Report tables
   * @param {string} entitySetName
   * @returns {boolean} Is FilterBar search field hidden or not
   */


  function checkAllTableForEntitySetAreAnalytical(listReportTables, entitySetName) {
    if (listReportTables.length > 0) {
      return listReportTables.every(function (visualization) {
        return visualization.enableAnalytics && "/" + entitySetName === visualization.annotation.collection;
      });
    }

    return false;
  }
  /**
   * Retrieve the configuration for the selection fields that will be used within the filter bar
   * This configuration takes into account annotation and the selection variants.
   *
   * @param {ConverterContext} converterContext
   * @param {TableVisualization[]} lrTables
   * @returns {FilterSelectionField[]} an array of selection fields
   */


  var getSelectionFields = function (converterContext) {
    var _converterContext$get, _entityType$annotatio, _entityType$annotatio2, _entityType$annotatio3;

    var lrTables = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var selectionVariantPaths = []; // Fetch all selectionVariants defined in the different visualizations and different views (multi table mode)

    var selectionVariants = lrTables.map(function (visualization) {
      var tableFilters = visualization.control.filters;
      var tableSVConfigs = [];

      for (var key in tableFilters) {
        if (Array.isArray(tableFilters[key].paths)) {
          var paths = tableFilters[key].paths;
          paths.forEach(function (path) {
            if (path && path.annotationPath && selectionVariantPaths.indexOf(path.annotationPath) === -1) {
              selectionVariantPaths.push(path.annotationPath);
              var selectionVariantConfig = getSelectionVariantConfiguration(path.annotationPath, converterContext);

              if (selectionVariantConfig) {
                tableSVConfigs.push(selectionVariantConfig);
              }
            }
          });
        }
      }

      return tableSVConfigs;
    }).reduce(function (svConfigs, selectionVariant) {
      return svConfigs.concat(selectionVariant);
    }, []); // create a map of properties to be used in selection variants

    var excludedFilterProperties = selectionVariants.reduce(function (previousValue, selectionVariant) {
      selectionVariant.propertyNames.forEach(function (propertyName) {
        previousValue[propertyName] = true;
      });
      return previousValue;
    }, {});
    var entityType = converterContext.getEntityType();
    var filterFacets = (_converterContext$get = converterContext.getAnnotationEntityType().annotations.UI) === null || _converterContext$get === void 0 ? void 0 : _converterContext$get.FilterFacets;
    var filterFacetMap = {};
    var aFieldGroups = converterContext.getAnnotationsByTerm("UI", "com.sap.vocabularies.UI.v1.FieldGroup") || [];

    if (filterFacets === undefined || filterFacets.length < 0) {
      for (var i in aFieldGroups) {
        filterFacetMap = _objectSpread({}, filterFacetMap, {}, getFieldGroupFilterGroups(aFieldGroups[i]));
      }
    } else {
      filterFacetMap = filterFacets.reduce(function (previousValue, filterFacet) {
        for (var _i = 0; _i < filterFacet.Target.$target.Data.length; _i++) {
          var _filterFacet$ID, _filterFacet$Label;

          previousValue[filterFacet.Target.$target.Data[_i].Value.path] = {
            group: filterFacet === null || filterFacet === void 0 ? void 0 : (_filterFacet$ID = filterFacet.ID) === null || _filterFacet$ID === void 0 ? void 0 : _filterFacet$ID.toString(),
            groupLabel: filterFacet === null || filterFacet === void 0 ? void 0 : (_filterFacet$Label = filterFacet.Label) === null || _filterFacet$Label === void 0 ? void 0 : _filterFacet$Label.toString()
          };
        }

        return previousValue;
      }, {});
    }

    var aSelectOptions = [];
    var selectionVariant = getSelectionVariant(entityType, converterContext);

    if (selectionVariant) {
      aSelectOptions = selectionVariant.SelectOptions;
    } // create a map of all potential filter fields based on...


    var filterFields = _objectSpread({}, _getSelectionFields(entityType, "", entityType.entityProperties, false, converterContext), {}, _getSelectionFieldsByPath(entityType, converterContext.getManifestWrapper().getFilterConfiguration().navigationProperties, false, converterContext)); //Filters which has to be added which is part of SV/Default annotations but not present in the SelectionFields


    var defaultFilters = _getDefaultFilterFields(filterFields, aSelectOptions, entityType, converterContext, excludedFilterProperties); // finally create final list of filter fields by adding the SelectionFields first (order matters)...


    var allFilters = (((_entityType$annotatio = entityType.annotations) === null || _entityType$annotatio === void 0 ? void 0 : (_entityType$annotatio2 = _entityType$annotatio.UI) === null || _entityType$annotatio2 === void 0 ? void 0 : (_entityType$annotatio3 = _entityType$annotatio2.SelectionFields) === null || _entityType$annotatio3 === void 0 ? void 0 : _entityType$annotatio3.reduce(function (selectionFields, selectionField) {
      var propertyPath = selectionField.value;

      if (!(propertyPath in excludedFilterProperties)) {
        var filterField = _getFilterField(filterFields, propertyPath, converterContext, entityType);

        if (filterField) {
          filterField.group = "";
          filterField.groupLabel = "";
          selectionFields.push(filterField);
        }
      }

      return selectionFields;
    }, [])) || []). // To add the FilterField which is not part of the Selection Fields but the property is mentioned in the Selection Variant
    concat(defaultFilters || []) // ...and adding remaining filter fields, that are not used in a SelectionVariant (order doesn't matter)
    .concat(Object.keys(filterFields).filter(function (propertyPath) {
      return !(propertyPath in excludedFilterProperties);
    }).map(function (propertyPath) {
      return Object.assign(filterFields[propertyPath], filterFacetMap[propertyPath]);
    })); //if all tables are analytical tables "aggregatable" properties must be excluded

    if (checkAllTableForEntitySetAreAnalytical(lrTables, converterContext.getEntitySet().name)) {
      /**
       * Currently all agregates are root entity properties (no properties coming from navigation) and all
       * tables with same entitySet gets same aggreagte configuration that's why we can use frist table into
       * LR to get aggregates (without currency/unit properties since we expect to be able to filter them)
       */
      var aggregates = lrTables[0].aggregates;

      if (aggregates) {
        var aggregatableProperties = Object.keys(aggregates).map(function (aggregateKey) {
          return aggregates[aggregateKey].relativePath;
        });
        allFilters = allFilters.filter(function (filterField) {
          return aggregatableProperties.indexOf(filterField.key) === -1;
        });
      }
    }

    return allFilters;
  };

  _exports.getSelectionFields = getSelectionFields;

  var _getDefaultFilterFields = function (filterFields, aSelectOptions, entityType, converterContext, excludedFilterProperties) {
    var _entityType$annotatio4, _entityType$annotatio5, _entityType$annotatio6;

    var selectionFields = [];
    var UISelectionFields = {};
    var properties = entityType.entityProperties; // Using entityType instead of entitySet

    (_entityType$annotatio4 = entityType.annotations) === null || _entityType$annotatio4 === void 0 ? void 0 : (_entityType$annotatio5 = _entityType$annotatio4.UI) === null || _entityType$annotatio5 === void 0 ? void 0 : (_entityType$annotatio6 = _entityType$annotatio5.SelectionFields) === null || _entityType$annotatio6 === void 0 ? void 0 : _entityType$annotatio6.forEach(function (SelectionField) {
      UISelectionFields[SelectionField.value] = true;
    });

    if (aSelectOptions && aSelectOptions.length > 0) {
      aSelectOptions === null || aSelectOptions === void 0 ? void 0 : aSelectOptions.forEach(function (selectOption) {
        var _entityType$annotatio7, _entityType$annotatio8, _entityType$annotatio9;

        var propertyName = selectOption.PropertyName;
        var sPropertyPath = propertyName.value;
        var UISelectionFields = {};
        (_entityType$annotatio7 = entityType.annotations) === null || _entityType$annotatio7 === void 0 ? void 0 : (_entityType$annotatio8 = _entityType$annotatio7.UI) === null || _entityType$annotatio8 === void 0 ? void 0 : (_entityType$annotatio9 = _entityType$annotatio8.SelectionFields) === null || _entityType$annotatio9 === void 0 ? void 0 : _entityType$annotatio9.forEach(function (SelectionField) {
          UISelectionFields[SelectionField.value] = true;
        });

        if (!(sPropertyPath in excludedFilterProperties)) {
          if (!(sPropertyPath in UISelectionFields)) {
            var _FilterField = _getFilterField(filterFields, sPropertyPath, converterContext, entityType);

            if (_FilterField) {
              selectionFields.push(_FilterField);
            }
          }
        }
      });
    } else if (properties) {
      properties.forEach(function (property) {
        var _property$annotations9, _property$annotations10;

        var defaultFilterValue = (_property$annotations9 = property.annotations) === null || _property$annotations9 === void 0 ? void 0 : (_property$annotations10 = _property$annotations9.Common) === null || _property$annotations10 === void 0 ? void 0 : _property$annotations10.FilterDefaultValue;
        var PropertyPath = property.name;

        if (!(PropertyPath in excludedFilterProperties)) {
          if (defaultFilterValue && !(PropertyPath in UISelectionFields)) {
            var _FilterField2 = _getFilterField(filterFields, PropertyPath, converterContext, entityType);

            if (_FilterField2) {
              selectionFields.push(_FilterField2);
            }
          }
        }
      });
    }

    return selectionFields;
  };

  var _getFilterField = function (filterFields, propertyPath, converterContext, entityType) {
    var filterField = filterFields[propertyPath];

    if (filterField) {
      delete filterFields[propertyPath];
    } else {
      filterField = _createFilterSelectionField(entityType, entityType.resolvePath(propertyPath), propertyPath, true, converterContext);
    }

    if (!filterField) {
      converterContext.getDiagnostics().addIssue(IssueCategory.Annotation, IssueSeverity.High, IssueType.MISSING_SELECTIONFIELD);
    } // defined SelectionFields are available by default


    if (filterField) {
      filterField.availability = AvailabilityType.Default;
    }

    return filterField;
  };
  /**
   * Retrieves filter fields from the manifest.
   *
   * @param entityType the current entityType
   * @param converterContext the converter context
   * @returns {Record<string, CustomElementFilterField>} the manifest defined filter fields
   */


  var getManifestFilterFields = function (entityType, converterContext) {
    var fbConfig = converterContext.getManifestWrapper().getFilterConfiguration();
    var definedFilterFields = (fbConfig === null || fbConfig === void 0 ? void 0 : fbConfig.filterFields) || {};

    var selectionFields = _getSelectionFieldsByPath(entityType, Object.keys(definedFilterFields).map(function (key) {
      return KeyHelper.getPathFromSelectionFieldKey(key);
    }), true, converterContext);

    var filterFields = {};

    for (var sKey in definedFilterFields) {
      var filterField = definedFilterFields[sKey];
      var propertyName = KeyHelper.getPathFromSelectionFieldKey(sKey);
      var selectionField = selectionFields[propertyName];
      filterFields[sKey] = {
        key: sKey,
        annotationPath: selectionField === null || selectionField === void 0 ? void 0 : selectionField.annotationPath,
        conditionPath: (selectionField === null || selectionField === void 0 ? void 0 : selectionField.conditionPath) || propertyName,
        template: filterField.template,
        label: filterField.label,
        position: filterField.position || {
          placement: Placement.After
        },
        availability: filterField.availability || AvailabilityType.Default,
        settings: filterField.settings
      };
    }

    return filterFields;
  };
  /**
   * Find a visualization annotation that can be used for rendering the list report.
   *
   * @param {EntityType} entityType the current entityType
   * @param converterContext
   * @param bIsALP
   * @returns {LineItem | PresentationVariantTypeTypes | undefined} one compliant annotation for rendering the list report
   */


  function getCompliantVisualizationAnnotation(entityType, converterContext, bIsALP) {
    var annotationPath = converterContext.getManifestWrapper().getDefaultTemplateAnnotationPath();
    var selectionPresentationVariant = getSelectionPresentationVariant(entityType, annotationPath, converterContext);

    if (annotationPath && selectionPresentationVariant) {
      var _presentationVariant = selectionPresentationVariant.PresentationVariant;

      if (!_presentationVariant) {
        throw new Error("Presentation Variant is not configured in the SPV mentioned in the manifest");
      }

      var bPVComplaint = isPresentationCompliant(selectionPresentationVariant.PresentationVariant);

      if (!bPVComplaint) {
        return undefined;
      }

      if (isSelectionPresentationCompliant(selectionPresentationVariant, bIsALP)) {
        return selectionPresentationVariant;
      }
    }

    if (selectionPresentationVariant) {
      if (isSelectionPresentationCompliant(selectionPresentationVariant, bIsALP)) {
        return selectionPresentationVariant;
      }
    }

    var presentationVariant = getDefaultPresentationVariant(entityType);

    if (presentationVariant) {
      if (isPresentationCompliant(presentationVariant, bIsALP)) {
        return presentationVariant;
      }
    }

    if (!bIsALP) {
      var defaultLineItem = getDefaultLineItem(entityType);

      if (defaultLineItem) {
        return defaultLineItem;
      }
    }

    return undefined;
  }

  var getView = function (viewConverterConfiguration) {
    var config = viewConverterConfiguration;
    var converterContext = config.converterContext;
    var presentation = getDataVisualizationConfiguration(config.annotation ? converterContext.getRelativeAnnotationPath(config.annotation.fullyQualifiedName, converterContext.getEntityType()) : "", true, converterContext);
    var tableControlId = "";
    var chartControlId = "";
    var title = "";
    var selectionVariantPath = "";

    var isMultipleViewConfiguration = function (config) {
      return config.key !== undefined;
    };

    if (isMultipleViewConfiguration(config)) {
      // key exists only on multi tables mode
      var resolvedTarget = converterContext.getEntityTypeAnnotation(config.annotationPath);
      var viewAnnotation = resolvedTarget.annotation;
      converterContext = resolvedTarget.converterContext;
      title = compileBinding(annotationExpression(viewAnnotation.Text));
      /**
       * Need to loop on views and more precisely to table into views since
       * multi table mode get specific configuration (hidden filters or Table Id)
       */

      presentation.visualizations.forEach(function (visualizationDefinition, index) {
        switch (visualizationDefinition.type) {
          case VisualizationType.Table:
            var tableVisualization = presentation.visualizations[index];
            var filters = tableVisualization.control.filters || {};
            filters.hiddenFilters = filters.hiddenFilters || {
              paths: []
            };

            if (!config.keepPreviousPresonalization) {
              // Need to override Table Id to match with Tab Key (currently only table is managed in multiple view mode)
              tableVisualization.annotation.id = TableID(config.key, "LineItem");
            }

            if (config && config.annotation && config.annotation.term === "com.sap.vocabularies.UI.v1.SelectionPresentationVariant") {
              selectionVariantPath = config.annotation.SelectionVariant.fullyQualifiedName.split("@")[1];
            } else {
              selectionVariantPath = config.annotationPath;
            }
            /**
             * Provide Selection Variant to hiddenFilters in order to set the SV filters to the table
             * MDC Table override binding Filter and from SAP FE the only method where we are able to add
             * additional filter is 'rebindTable' into Table delegate
             * In order to avoid implementing specific LR feature to SAP FE Macro Table, the filter(s) related
             * to the Tab (multi table mode) can be passed to macro table via parameter/context named filters
             * and key hiddenFilters
             */


            filters.hiddenFilters.paths.push({
              annotationPath: selectionVariantPath
            });
            tableVisualization.control.filters = filters;
            break;

          case VisualizationType.Chart:
            // Not currently managed
            break;

          default:
            break;
        }
      });
    }

    presentation.visualizations.forEach(function (visualizationDefinition) {
      if (visualizationDefinition.type === VisualizationType.Table) {
        tableControlId = visualizationDefinition.annotation.id;
      } else if (visualizationDefinition.type === VisualizationType.Chart) {
        chartControlId = visualizationDefinition.id;
      }
    });
    return {
      presentation: presentation,
      tableControlId: tableControlId,
      chartControlId: chartControlId,
      entitySet: "/" + viewConverterConfiguration.entitySet.name,
      title: title,
      selectionVariantPath: selectionVariantPath
    };
  };

  var getViews = function (entitySet, converterContext, settingsViews) {
    var viewConverterConfigs = [];

    if (settingsViews) {
      settingsViews.paths.forEach(function (path) {
        var viewEntitySet = converterContext.findEntitySet(path.entitySet);
        var annotationPath = converterContext.getManifestWrapper().getDefaultTemplateAnnotationPath();
        var annotation;

        if (viewEntitySet) {
          var viewConverterContext = converterContext.getConverterContextFor(viewEntitySet);
          var resolvedTarget = viewConverterContext.getEntityTypeAnnotation(path.annotationPath);
          var targetAnnotation = resolvedTarget.annotation;
          converterContext = resolvedTarget.converterContext;

          if (targetAnnotation) {
            if (targetAnnotation.term === "com.sap.vocabularies.UI.v1.SelectionVariant") {
              if (annotationPath) {
                annotation = getSelectionPresentationVariant(viewEntitySet.entityType, annotationPath, converterContext);
              } else {
                annotation = getDefaultLineItem(viewEntitySet.entityType);
              }
            } else {
              annotation = targetAnnotation;
            }

            viewConverterConfigs.push({
              converterContext: viewConverterContext,
              entitySet: viewEntitySet,
              annotation: annotation,
              annotationPath: path.annotationPath,
              keepPreviousPresonalization: path.keepPreviousPresonalization,
              key: path.key
            });
          }
        } else {// TODO Diagnostics message
        }
      });
    } else {
      var entityType = converterContext.getEntityType();

      if (converterContext.getTemplateType() === TemplateType.AnalyticalListPage) {
        viewConverterConfigs = getAlpViewConfig(entitySet, converterContext, viewConverterConfigs);
      } else {
        viewConverterConfigs.push({
          annotation: getCompliantVisualizationAnnotation(entityType, converterContext, false),
          entitySet: entitySet,
          converterContext: converterContext
        });
      }
    }

    return viewConverterConfigs.map(function (viewConverterConfig) {
      return getView(viewConverterConfig);
    });
  };

  function getAlpViewConfig(entitySet, converterContext, viewConfigs) {
    var annotation = getCompliantVisualizationAnnotation(entitySet.entityType, converterContext, true);
    var chart, table;

    if (annotation) {
      viewConfigs.push({
        entitySet: entitySet,
        annotation: annotation,
        converterContext: converterContext
      });
    } else {
      chart = getDefaultChart(entitySet.entityType);
      table = getDefaultLineItem(entitySet.entityType);

      if (chart) {
        viewConfigs.push({
          entitySet: entitySet,
          annotation: chart,
          converterContext: converterContext
        });
      }

      if (table) {
        viewConfigs.push({
          entitySet: entitySet,
          annotation: table,
          converterContext: converterContext
        });
      }
    }

    return viewConfigs;
  }
  /**
   * Create the ListReportDefinition for the multi entitySets (multi table instances).
   *
   * @param converterContext
   * @returns {ListReportDefinition} the list report definition based on annotation + manifest
   */


  var convertPage = function (converterContext) {
    var templateType = converterContext.getTemplateType();
    var entitySet = converterContext.getEntitySet();
    var dataModelObjectPath = converterContext.getDataModelObjectPath();
    var entityType = converterContext.getEntityType();
    var sBaseContextPath = getTargetObjectPath(dataModelObjectPath);

    if (!entitySet) {
      // If we don't have an entitySet at this point we have an issue I'd say
      throw new Error("An EntitySet is required to be able to display a ListReport, please adjust your `entitySet` property to point to one.");
    }

    var manifestWrapper = converterContext.getManifestWrapper();
    var viewsDefinition = manifestWrapper.getViewConfiguration();
    var hasMultipleEntitySets = manifestWrapper.hasMultipleEntitySets();
    var views = getViews(entitySet, converterContext, viewsDefinition);
    var showTabCounts = viewsDefinition ? (viewsDefinition === null || viewsDefinition === void 0 ? void 0 : viewsDefinition.showCounts) || hasMultipleEntitySets : undefined; // with multi EntitySets, tab counts are displayed by default

    var lrTableVisualizations = getTableVisualizations(views);
    var singleTableId = "";
    var singleChartId = "";
    var filterBarId = FilterBarID(entitySet.name);
    var filterVariantManagementID = FilterVariantManagementID(filterBarId);
    var targetControlIds = [filterBarId].concat(lrTableVisualizations.map(function (visualization) {
      return visualization.annotation.id;
    }));
    var fbConfig = manifestWrapper.getFilterConfiguration();
    var useSemanticDateRange = fbConfig.useSemanticDateRange !== undefined ? fbConfig.useSemanticDateRange : true;
    var oConfig = getContentAreaId(templateType, views);

    if (oConfig) {
      singleChartId = oConfig.chartId;
      singleTableId = oConfig.tableId;
    }

    var annotationSelectionFields = getSelectionFields(converterContext, lrTableVisualizations);
    var selectionFields = insertCustomElements(annotationSelectionFields, getManifestFilterFields(entityType, converterContext), {
      "availability": "overwrite",
      label: "overwrite",
      position: "overwrite",
      template: "overwrite",
      settings: "overwrite"
    });
    var hideBasicSearch = getFilterBarhideBasicSearch(lrTableVisualizations, converterContext);
    var selectionVariant = getSelectionVariant(entityType, converterContext); // Sort header actions according to position attributes in manifest

    var headerActions = insertCustomElements([], getActionsFromManifest(manifestWrapper.getHeaderActions(), converterContext));
    var isAlp = converterContext.getTemplateType() === TemplateType.AnalyticalListPage;
    return {
      mainEntitySet: "/" + entitySet.name,
      mainEntityType: sBaseContextPath + "/",
      singleTableId: singleTableId,
      singleChartId: singleChartId,
      showTabCounts: showTabCounts,
      headerActions: headerActions,
      filterBar: {
        selectionFields: selectionFields,
        hideBasicSearch: hideBasicSearch
      },
      views: views,
      filterBarId: filterBarId,
      filterConditions: {
        selectionVariant: selectionVariant
      },
      variantManagement: {
        id: filterVariantManagementID,
        targetControlIds: targetControlIds.join(",")
      },
      isMultiEntitySets: hasMultipleEntitySets,
      isAlp: isAlp,
      useSemanticDateRange: useSemanticDateRange
    };
  };

  _exports.convertPage = convertPage;

  function getContentAreaId(templateType, views) {
    var singleTableId = "",
        singleChartId = "";

    if (views.length === 1) {
      singleTableId = views[0].tableControlId;
      singleChartId = views[0].chartControlId;
    } else if (templateType === TemplateType.AnalyticalListPage && views.length === 2) {
      views.map(function (oView) {
        if (oView.chartControlId) {
          singleChartId = oView.chartControlId;
        } else if (oView.tableControlId) {
          singleTableId = oView.tableControlId;
        }
      });
    }

    if (singleTableId || singleChartId) {
      return {
        chartId: singleChartId,
        tableId: singleTableId
      };
    }

    return undefined;
  }

  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkxpc3RSZXBvcnRDb252ZXJ0ZXIudHMiXSwibmFtZXMiOlsiX2dldENvbmRpdGlvblBhdGgiLCJlbnRpdHlUeXBlIiwicHJvcGVydHlQYXRoIiwicGFydHMiLCJzcGxpdCIsInBhcnRpYWxQYXRoIiwia2V5IiwibGVuZ3RoIiwicGFydCIsInNoaWZ0IiwicHJvcGVydHkiLCJyZXNvbHZlUGF0aCIsIl90eXBlIiwiaXNDb2xsZWN0aW9uIiwiX2NyZWF0ZUZpbHRlclNlbGVjdGlvbkZpZWxkIiwiZnVsbFByb3BlcnR5UGF0aCIsImluY2x1ZGVIaWRkZW4iLCJjb252ZXJ0ZXJDb250ZXh0IiwidW5kZWZpbmVkIiwidGFyZ2V0VHlwZSIsImFubm90YXRpb25zIiwiVUkiLCJIaWRkZW4iLCJ2YWx1ZU9mIiwidGFyZ2V0RW50aXR5VHlwZSIsImdldEFubm90YXRpb25FbnRpdHlUeXBlIiwiS2V5SGVscGVyIiwiZ2V0U2VsZWN0aW9uRmllbGRLZXlGcm9tUGF0aCIsImFubm90YXRpb25QYXRoIiwiZ2V0QWJzb2x1dGVBbm5vdGF0aW9uUGF0aCIsImNvbmRpdGlvblBhdGgiLCJhdmFpbGFiaWxpdHkiLCJIaWRkZW5GaWx0ZXIiLCJBdmFpbGFiaWxpdHlUeXBlIiwiQWRhcHRhdGlvbiIsImxhYmVsIiwiY29tcGlsZUJpbmRpbmciLCJhbm5vdGF0aW9uRXhwcmVzc2lvbiIsIkNvbW1vbiIsIkxhYmVsIiwibmFtZSIsImdyb3VwIiwiZ3JvdXBMYWJlbCIsIl9nZXRTZWxlY3Rpb25GaWVsZHMiLCJuYXZpZ2F0aW9uUGF0aCIsInByb3BlcnRpZXMiLCJzZWxlY3Rpb25GaWVsZE1hcCIsImZvckVhY2giLCJmdWxsUGF0aCIsInNlbGVjdGlvbkZpZWxkIiwiX2dldFNlbGVjdGlvbkZpZWxkc0J5UGF0aCIsInByb3BlcnR5UGF0aHMiLCJzZWxlY3Rpb25GaWVsZHMiLCJsb2NhbFNlbGVjdGlvbkZpZWxkcyIsImVudGl0eVByb3BlcnRpZXMiLCJpbmNsdWRlcyIsInNwbGljZSIsImpvaW4iLCJnZXRGaWVsZEdyb3VwRmlsdGVyR3JvdXBzIiwiZmllbGRHcm91cCIsImZpbHRlckZhY2V0TWFwIiwiRGF0YSIsImRhdGFGaWVsZCIsIiRUeXBlIiwiVmFsdWUiLCJwYXRoIiwiZnVsbHlRdWFsaWZpZWROYW1lIiwicXVhbGlmaWVyIiwiZ2V0VGFibGVWaXN1YWxpemF0aW9ucyIsInZpZXdzIiwidGFibGVzIiwidmlldyIsInByZXNlbnRhdGlvbiIsInZpc3VhbGl6YXRpb25zIiwidmlzdWFsaXphdGlvbiIsInR5cGUiLCJWaXN1YWxpemF0aW9uVHlwZSIsIlRhYmxlIiwicHVzaCIsImdldEZpbHRlckJhcmhpZGVCYXNpY1NlYXJjaCIsImxpc3RSZXBvcnRUYWJsZXMiLCJnZXRUZW1wbGF0ZVR5cGUiLCJUZW1wbGF0ZVR5cGUiLCJBbmFseXRpY2FsTGlzdFBhZ2UiLCJjaGVja0FsbFRhYmxlRm9yRW50aXR5U2V0QXJlQW5hbHl0aWNhbCIsImdldEVudGl0eVNldCIsImVudGl0eVNldE5hbWUiLCJldmVyeSIsImVuYWJsZUFuYWx5dGljcyIsImFubm90YXRpb24iLCJjb2xsZWN0aW9uIiwiZ2V0U2VsZWN0aW9uRmllbGRzIiwibHJUYWJsZXMiLCJzZWxlY3Rpb25WYXJpYW50UGF0aHMiLCJzZWxlY3Rpb25WYXJpYW50cyIsIm1hcCIsInRhYmxlRmlsdGVycyIsImNvbnRyb2wiLCJmaWx0ZXJzIiwidGFibGVTVkNvbmZpZ3MiLCJBcnJheSIsImlzQXJyYXkiLCJwYXRocyIsImluZGV4T2YiLCJzZWxlY3Rpb25WYXJpYW50Q29uZmlnIiwiZ2V0U2VsZWN0aW9uVmFyaWFudENvbmZpZ3VyYXRpb24iLCJyZWR1Y2UiLCJzdkNvbmZpZ3MiLCJzZWxlY3Rpb25WYXJpYW50IiwiY29uY2F0IiwiZXhjbHVkZWRGaWx0ZXJQcm9wZXJ0aWVzIiwicHJldmlvdXNWYWx1ZSIsInByb3BlcnR5TmFtZXMiLCJwcm9wZXJ0eU5hbWUiLCJnZXRFbnRpdHlUeXBlIiwiZmlsdGVyRmFjZXRzIiwiRmlsdGVyRmFjZXRzIiwiYUZpZWxkR3JvdXBzIiwiZ2V0QW5ub3RhdGlvbnNCeVRlcm0iLCJpIiwiZmlsdGVyRmFjZXQiLCJUYXJnZXQiLCIkdGFyZ2V0IiwiSUQiLCJ0b1N0cmluZyIsImFTZWxlY3RPcHRpb25zIiwiZ2V0U2VsZWN0aW9uVmFyaWFudCIsIlNlbGVjdE9wdGlvbnMiLCJmaWx0ZXJGaWVsZHMiLCJnZXRNYW5pZmVzdFdyYXBwZXIiLCJnZXRGaWx0ZXJDb25maWd1cmF0aW9uIiwibmF2aWdhdGlvblByb3BlcnRpZXMiLCJkZWZhdWx0RmlsdGVycyIsIl9nZXREZWZhdWx0RmlsdGVyRmllbGRzIiwiYWxsRmlsdGVycyIsIlNlbGVjdGlvbkZpZWxkcyIsInZhbHVlIiwiZmlsdGVyRmllbGQiLCJfZ2V0RmlsdGVyRmllbGQiLCJPYmplY3QiLCJrZXlzIiwiZmlsdGVyIiwiYXNzaWduIiwiYWdncmVnYXRlcyIsImFnZ3JlZ2F0YWJsZVByb3BlcnRpZXMiLCJhZ2dyZWdhdGVLZXkiLCJyZWxhdGl2ZVBhdGgiLCJVSVNlbGVjdGlvbkZpZWxkcyIsIlNlbGVjdGlvbkZpZWxkIiwic2VsZWN0T3B0aW9uIiwiUHJvcGVydHlOYW1lIiwic1Byb3BlcnR5UGF0aCIsIkZpbHRlckZpZWxkIiwiZGVmYXVsdEZpbHRlclZhbHVlIiwiRmlsdGVyRGVmYXVsdFZhbHVlIiwiUHJvcGVydHlQYXRoIiwiZ2V0RGlhZ25vc3RpY3MiLCJhZGRJc3N1ZSIsIklzc3VlQ2F0ZWdvcnkiLCJBbm5vdGF0aW9uIiwiSXNzdWVTZXZlcml0eSIsIkhpZ2giLCJJc3N1ZVR5cGUiLCJNSVNTSU5HX1NFTEVDVElPTkZJRUxEIiwiRGVmYXVsdCIsImdldE1hbmlmZXN0RmlsdGVyRmllbGRzIiwiZmJDb25maWciLCJkZWZpbmVkRmlsdGVyRmllbGRzIiwiZ2V0UGF0aEZyb21TZWxlY3Rpb25GaWVsZEtleSIsInNLZXkiLCJ0ZW1wbGF0ZSIsInBvc2l0aW9uIiwicGxhY2VtZW50IiwiUGxhY2VtZW50IiwiQWZ0ZXIiLCJzZXR0aW5ncyIsImdldENvbXBsaWFudFZpc3VhbGl6YXRpb25Bbm5vdGF0aW9uIiwiYklzQUxQIiwiZ2V0RGVmYXVsdFRlbXBsYXRlQW5ub3RhdGlvblBhdGgiLCJzZWxlY3Rpb25QcmVzZW50YXRpb25WYXJpYW50IiwiZ2V0U2VsZWN0aW9uUHJlc2VudGF0aW9uVmFyaWFudCIsInByZXNlbnRhdGlvblZhcmlhbnQiLCJQcmVzZW50YXRpb25WYXJpYW50IiwiRXJyb3IiLCJiUFZDb21wbGFpbnQiLCJpc1ByZXNlbnRhdGlvbkNvbXBsaWFudCIsImlzU2VsZWN0aW9uUHJlc2VudGF0aW9uQ29tcGxpYW50IiwiZ2V0RGVmYXVsdFByZXNlbnRhdGlvblZhcmlhbnQiLCJkZWZhdWx0TGluZUl0ZW0iLCJnZXREZWZhdWx0TGluZUl0ZW0iLCJnZXRWaWV3Iiwidmlld0NvbnZlcnRlckNvbmZpZ3VyYXRpb24iLCJjb25maWciLCJnZXREYXRhVmlzdWFsaXphdGlvbkNvbmZpZ3VyYXRpb24iLCJnZXRSZWxhdGl2ZUFubm90YXRpb25QYXRoIiwidGFibGVDb250cm9sSWQiLCJjaGFydENvbnRyb2xJZCIsInRpdGxlIiwic2VsZWN0aW9uVmFyaWFudFBhdGgiLCJpc011bHRpcGxlVmlld0NvbmZpZ3VyYXRpb24iLCJyZXNvbHZlZFRhcmdldCIsImdldEVudGl0eVR5cGVBbm5vdGF0aW9uIiwidmlld0Fubm90YXRpb24iLCJUZXh0IiwidmlzdWFsaXphdGlvbkRlZmluaXRpb24iLCJpbmRleCIsInRhYmxlVmlzdWFsaXphdGlvbiIsImhpZGRlbkZpbHRlcnMiLCJrZWVwUHJldmlvdXNQcmVzb25hbGl6YXRpb24iLCJpZCIsIlRhYmxlSUQiLCJ0ZXJtIiwiU2VsZWN0aW9uVmFyaWFudCIsIkNoYXJ0IiwiZW50aXR5U2V0IiwiZ2V0Vmlld3MiLCJzZXR0aW5nc1ZpZXdzIiwidmlld0NvbnZlcnRlckNvbmZpZ3MiLCJ2aWV3RW50aXR5U2V0IiwiZmluZEVudGl0eVNldCIsInZpZXdDb252ZXJ0ZXJDb250ZXh0IiwiZ2V0Q29udmVydGVyQ29udGV4dEZvciIsInRhcmdldEFubm90YXRpb24iLCJnZXRBbHBWaWV3Q29uZmlnIiwidmlld0NvbnZlcnRlckNvbmZpZyIsInZpZXdDb25maWdzIiwiY2hhcnQiLCJ0YWJsZSIsImdldERlZmF1bHRDaGFydCIsImNvbnZlcnRQYWdlIiwidGVtcGxhdGVUeXBlIiwiZGF0YU1vZGVsT2JqZWN0UGF0aCIsImdldERhdGFNb2RlbE9iamVjdFBhdGgiLCJzQmFzZUNvbnRleHRQYXRoIiwiZ2V0VGFyZ2V0T2JqZWN0UGF0aCIsIm1hbmlmZXN0V3JhcHBlciIsInZpZXdzRGVmaW5pdGlvbiIsImdldFZpZXdDb25maWd1cmF0aW9uIiwiaGFzTXVsdGlwbGVFbnRpdHlTZXRzIiwic2hvd1RhYkNvdW50cyIsInNob3dDb3VudHMiLCJsclRhYmxlVmlzdWFsaXphdGlvbnMiLCJzaW5nbGVUYWJsZUlkIiwic2luZ2xlQ2hhcnRJZCIsImZpbHRlckJhcklkIiwiRmlsdGVyQmFySUQiLCJmaWx0ZXJWYXJpYW50TWFuYWdlbWVudElEIiwiRmlsdGVyVmFyaWFudE1hbmFnZW1lbnRJRCIsInRhcmdldENvbnRyb2xJZHMiLCJ1c2VTZW1hbnRpY0RhdGVSYW5nZSIsIm9Db25maWciLCJnZXRDb250ZW50QXJlYUlkIiwiY2hhcnRJZCIsInRhYmxlSWQiLCJhbm5vdGF0aW9uU2VsZWN0aW9uRmllbGRzIiwiaW5zZXJ0Q3VzdG9tRWxlbWVudHMiLCJoaWRlQmFzaWNTZWFyY2giLCJoZWFkZXJBY3Rpb25zIiwiZ2V0QWN0aW9uc0Zyb21NYW5pZmVzdCIsImdldEhlYWRlckFjdGlvbnMiLCJpc0FscCIsIm1haW5FbnRpdHlTZXQiLCJtYWluRW50aXR5VHlwZSIsImZpbHRlckJhciIsImZpbHRlckNvbmRpdGlvbnMiLCJ2YXJpYW50TWFuYWdlbWVudCIsImlzTXVsdGlFbnRpdHlTZXRzIiwib1ZpZXciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXNIQTs7Ozs7Ozs7QUFRQSxNQUFNQSxpQkFB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b0RkLEtBQUssQ0FBQzlELE1BQU4sS0FBaUIsQ0FBekUsRUFBNEU7QUFDbEY4RCxNQUFBQSxLQUFLLENBQUMwQixHQUFOLENBQVUsVUFBQTRLLEtBQUssRUFBSTtBQUNsQixZQUFJQSxLQUFLLENBQUN2RSxjQUFWLEVBQTBCO0FBQ3pCK0MsVUFBQUEsYUFBYSxHQUFHd0IsS0FBSyxDQUFDdkUsY0FBdEI7QUFDQSxTQUZELE1BRU8sSUFBSXVFLEtBQUssQ0FBQ3hFLGNBQVYsRUFBMEI7QUFDaEMrQyxVQUFBQSxhQUFhLEdBQUd5QixLQUFLLENBQUN4RSxjQUF0QjtBQUNBO0FBQ0QsT0FORDtBQU9BOztBQUNELFFBQUkrQyxhQUFhLElBQUlDLGFBQXJCLEVBQW9DO0FBQ25DLGFBQU87QUFDTlMsUUFBQUEsT0FBTyxFQUFFVCxhQURIO0FBRU5VLFFBQUFBLE9BQU8sRUFBRVg7QUFGSCxPQUFQO0FBSUE7O0FBQ0QsV0FBT2hPLFNBQVA7QUFDQSIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcblx0QXZhaWxhYmlsaXR5VHlwZSxcblx0RmlsdGVyRmllbGRNYW5pZmVzdENvbmZpZ3VyYXRpb24sXG5cdEZpbHRlck1hbmlmZXN0Q29uZmlndXJhdGlvbixcblx0TXVsdGlwbGVWaWV3c0NvbmZpZ3VyYXRpb24sXG5cdFZpZXdQYXRoQ29uZmlndXJhdGlvbixcblx0VmlzdWFsaXphdGlvblR5cGUsXG5cdEZpbHRlclNldHRpbmdzXG59IGZyb20gXCIuLi9NYW5pZmVzdFNldHRpbmdzXCI7XG5pbXBvcnQgeyBnZXRUYXJnZXRPYmplY3RQYXRoIH0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvRGF0YU1vZGVsUGF0aEhlbHBlclwiO1xuaW1wb3J0IHsgRW50aXR5U2V0LCBFbnRpdHlUeXBlLCBOYXZpZ2F0aW9uUHJvcGVydHksIFByb3BlcnR5IH0gZnJvbSBcIkBzYXAtdXgvYW5ub3RhdGlvbi1jb252ZXJ0ZXJcIjtcbmltcG9ydCB7IENvbnZlcnRlckNvbnRleHQsIFRlbXBsYXRlVHlwZSB9IGZyb20gXCIuL0Jhc2VDb252ZXJ0ZXJcIjtcbmltcG9ydCB7XG5cdERhdGFWaXN1YWxpemF0aW9uQW5ub3RhdGlvbnMsXG5cdERhdGFWaXN1YWxpemF0aW9uRGVmaW5pdGlvbixcblx0Z2V0RGF0YVZpc3VhbGl6YXRpb25Db25maWd1cmF0aW9uLFxuXHRnZXREZWZhdWx0Q2hhcnQsXG5cdGdldERlZmF1bHRMaW5lSXRlbSxcblx0Z2V0RGVmYXVsdFByZXNlbnRhdGlvblZhcmlhbnQsXG5cdGdldFNlbGVjdGlvblByZXNlbnRhdGlvblZhcmlhbnQsXG5cdGlzUHJlc2VudGF0aW9uQ29tcGxpYW50LFxuXHRnZXRTZWxlY3Rpb25WYXJpYW50LFxuXHRpc1NlbGVjdGlvblByZXNlbnRhdGlvbkNvbXBsaWFudFxufSBmcm9tIFwiLi4vY29udHJvbHMvQ29tbW9uL0RhdGFWaXN1YWxpemF0aW9uXCI7XG5pbXBvcnQge1xuXHRMaW5lSXRlbSxcblx0UHJlc2VudGF0aW9uVmFyaWFudFR5cGVUeXBlcyxcblx0U2VsZWN0aW9uUHJlc2VudGF0aW9uVmFyaWFudFR5cGVUeXBlcyxcblx0U2VsZWN0T3B0aW9uVHlwZSxcblx0U2VsZWN0aW9uVmFyaWFudFR5cGVUeXBlcyxcblx0RmllbGRHcm91cFR5cGVcbn0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzL2Rpc3QvZ2VuZXJhdGVkL1VJXCI7XG5pbXBvcnQgeyBBbm5vdGF0aW9uVGVybSwgRGF0YUZpZWxkQWJzdHJhY3RUeXBlcywgUmVmZXJlbmNlRmFjZXRUeXBlcywgVUlBbm5vdGF0aW9uVGVybXMgfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXNcIjtcbmltcG9ydCB7IEZpbHRlckJhcklELCBGaWx0ZXJWYXJpYW50TWFuYWdlbWVudElELCBUYWJsZUlEIH0gZnJvbSBcIi4uL2hlbHBlcnMvSURcIjtcbmltcG9ydCB7XG5cdGdldFNlbGVjdGlvblZhcmlhbnRDb25maWd1cmF0aW9uLFxuXHRTZWxlY3Rpb25WYXJpYW50Q29uZmlndXJhdGlvbixcblx0VGFibGVWaXN1YWxpemF0aW9uXG59IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2NvbnRyb2xzL0NvbW1vbi9UYWJsZVwiO1xuaW1wb3J0IHsgQmFzZUFjdGlvbiwgZ2V0QWN0aW9uc0Zyb21NYW5pZmVzdCB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2NvbnRyb2xzL0NvbW1vbi9BY3Rpb25cIjtcbmltcG9ydCB7IENvbmZpZ3VyYWJsZU9iamVjdCwgQ3VzdG9tRWxlbWVudCwgaW5zZXJ0Q3VzdG9tRWxlbWVudHMsIFBsYWNlbWVudCB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvQ29uZmlndXJhYmxlT2JqZWN0XCI7XG5pbXBvcnQgeyBLZXlIZWxwZXIgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9oZWxwZXJzL0tleVwiO1xuaW1wb3J0IHsgYW5ub3RhdGlvbkV4cHJlc3Npb24sIGNvbXBpbGVCaW5kaW5nIH0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvQmluZGluZ0V4cHJlc3Npb25cIjtcbmltcG9ydCB7IElzc3VlVHlwZSwgSXNzdWVTZXZlcml0eSwgSXNzdWVDYXRlZ29yeSB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvSXNzdWVNYW5hZ2VyXCI7XG5cbnR5cGUgVmlld0Fubm90YXRpb25zVHlwZVR5cGVzID0gU2VsZWN0aW9uUHJlc2VudGF0aW9uVmFyaWFudFR5cGVUeXBlcyB8IFNlbGVjdGlvblZhcmlhbnRUeXBlVHlwZXM7XG50eXBlIFZhcmlhbnRNYW5hZ2VtZW50RGVmaW5pdGlvbiA9IHtcblx0aWQ6IHN0cmluZztcblx0dGFyZ2V0Q29udHJvbElkczogc3RyaW5nO1xufTtcblxudHlwZSBNdWx0aXBsZVZpZXdDb25maWd1cmF0aW9uID0gVmlld1BhdGhDb25maWd1cmF0aW9uICYge1xuXHRhbm5vdGF0aW9uPzogRGF0YVZpc3VhbGl6YXRpb25Bbm5vdGF0aW9ucztcbn07XG5cbnR5cGUgU2luZ2xlVmlld0NvbmZpZ3VyYXRpb24gPSB7XG5cdGFubm90YXRpb24/OiBEYXRhVmlzdWFsaXphdGlvbkFubm90YXRpb25zO1xufTtcblxudHlwZSBWaWV3Q29uZmlndXJhdGlvbiA9IE11bHRpcGxlVmlld0NvbmZpZ3VyYXRpb24gfCBTaW5nbGVWaWV3Q29uZmlndXJhdGlvbjtcblxudHlwZSBGaWx0ZXJGaWVsZCA9IENvbmZpZ3VyYWJsZU9iamVjdCAmIHtcblx0Y29uZGl0aW9uUGF0aDogc3RyaW5nO1xuXHRhdmFpbGFiaWxpdHk6IEF2YWlsYWJpbGl0eVR5cGU7XG5cdGFubm90YXRpb25QYXRoOiBzdHJpbmc7XG5cdGxhYmVsPzogc3RyaW5nO1xuXHR0ZW1wbGF0ZT86IHN0cmluZztcblx0Z3JvdXA/OiBzdHJpbmc7XG5cdGdyb3VwTGFiZWw/OiBzdHJpbmc7XG5cdHNldHRpbmdzPzogRmlsdGVyU2V0dGluZ3M7XG59O1xuXG50eXBlIEZpbHRlckdyb3VwID0ge1xuXHRncm91cD86IHN0cmluZztcblx0Z3JvdXBMYWJlbD86IHN0cmluZztcbn07XG5cbnR5cGUgVmlld0NvbnZlcnRlclNldHRpbmdzID0gVmlld0NvbmZpZ3VyYXRpb24gJiB7XG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQ7XG5cdGVudGl0eVNldDogRW50aXR5U2V0O1xufTtcblxudHlwZSBDdXN0b21FbGVtZW50RmlsdGVyRmllbGQgPSBDdXN0b21FbGVtZW50PEZpbHRlckZpZWxkPjtcblxuZXhwb3J0IHR5cGUgTGlzdFJlcG9ydERlZmluaXRpb24gPSB7XG5cdG1haW5FbnRpdHlTZXQ6IHN0cmluZztcblx0bWFpbkVudGl0eVR5cGU6IHN0cmluZzsgLy8gZW50aXR5VHlwZT4gYXQgdGhlIHN0YXJ0IG9mIExSIHRlbXBsYXRpbmdcblx0c2luZ2xlVGFibGVJZD86IHN0cmluZzsgLy8gb25seSB3aXRoIHNpbmdsZSBUYWJsZSBtb2RlXG5cdHNpbmdsZUNoYXJ0SWQ/OiBzdHJpbmc7IC8vIG9ubHkgd2l0aCBzaW5nbGUgVGFibGUgbW9kZVxuXHRzaG93VGFiQ291bnRzPzogYm9vbGVhbjsgLy8gb25seSB3aXRoIG11bHRpIFRhYmxlIG1vZGVcblx0aGVhZGVyQWN0aW9uczogQmFzZUFjdGlvbltdO1xuXHRmaWx0ZXJCYXI6IHtcblx0XHRzZWxlY3Rpb25GaWVsZHM6IEZpbHRlckZpZWxkW107XG5cdFx0aGlkZUJhc2ljU2VhcmNoOiBib29sZWFuO1xuXHR9O1xuXHR2aWV3czogTGlzdFJlcG9ydFZpZXdEZWZpbml0aW9uW107XG5cdGZpbHRlckNvbmRpdGlvbnM6IG9iamVjdDtcblx0aXNNdWx0aUVudGl0eVNldHM6IGJvb2xlYW47XG5cdGZpbHRlckJhcklkOiBzdHJpbmc7XG5cdHZhcmlhbnRNYW5hZ2VtZW50OiBWYXJpYW50TWFuYWdlbWVudERlZmluaXRpb247XG5cdGlzQWxwOiBib29sZWFuO1xuXHR1c2VTZW1hbnRpY0RhdGVSYW5nZT86IGJvb2xlYW47XG59O1xuXG5leHBvcnQgdHlwZSBMaXN0UmVwb3J0Vmlld0RlZmluaXRpb24gPSB7XG5cdHNlbGVjdGlvblZhcmlhbnRQYXRoPzogc3RyaW5nOyAvLyBvbmx5IHdpdGggb24gbXVsdGkgVGFibGUgbW9kZVxuXHR0aXRsZT86IHN0cmluZzsgLy8gb25seSB3aXRoIG11bHRpIFRhYmxlIG1vZGVcblx0ZW50aXR5U2V0OiBzdHJpbmc7XG5cdHByZXNlbnRhdGlvbjogRGF0YVZpc3VhbGl6YXRpb25EZWZpbml0aW9uO1xuXHR0YWJsZUNvbnRyb2xJZDogc3RyaW5nO1xuXHRjaGFydENvbnRyb2xJZDogc3RyaW5nO1xufTtcblxudHlwZSBDb250ZW50QXJlYUlEID0ge1xuXHRjaGFydElkOiBzdHJpbmc7XG5cdHRhYmxlSWQ6IHN0cmluZztcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgY29uZGl0aW9uIHBhdGggcmVxdWlyZWQgZm9yIHRoZSBjb25kaXRpb24gbW9kZWwuIEl0IGxvb2tzIGxpa2UgZm9sbG93OlxuICogPDE6Ti1Qcm9wZXJ0eU5hbWU+KlxcLzwxOjEtUHJvcGVydHlOYW1lPi88UHJvcGVydHlOYW1lPi5cbiAqXG4gKiBAcGFyYW0gZW50aXR5VHlwZSB0aGUgcm9vdCBlbnRpdHkgdHlwZVxuICogQHBhcmFtIHByb3BlcnR5UGF0aCB0aGUgZnVsbCBwYXRoIHRvIHRoZSB0YXJnZXQgcHJvcGVydHlcbiAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSBmb3JtYXR0ZWQgY29uZGl0aW9uIHBhdGhcbiAqL1xuY29uc3QgX2dldENvbmRpdGlvblBhdGggPSBmdW5jdGlvbihlbnRpdHlUeXBlOiBFbnRpdHlUeXBlLCBwcm9wZXJ0eVBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG5cdGNvbnN0IHBhcnRzID0gcHJvcGVydHlQYXRoLnNwbGl0KFwiL1wiKTtcblx0bGV0IHBhcnRpYWxQYXRoO1xuXHRsZXQga2V5ID0gXCJcIjtcblx0d2hpbGUgKHBhcnRzLmxlbmd0aCkge1xuXHRcdGxldCBwYXJ0ID0gcGFydHMuc2hpZnQoKSBhcyBzdHJpbmc7XG5cdFx0cGFydGlhbFBhdGggPSBwYXJ0aWFsUGF0aCA/IHBhcnRpYWxQYXRoICsgXCIvXCIgKyBwYXJ0IDogcGFydDtcblx0XHRjb25zdCBwcm9wZXJ0eTogUHJvcGVydHkgfCBOYXZpZ2F0aW9uUHJvcGVydHkgPSBlbnRpdHlUeXBlLnJlc29sdmVQYXRoKHBhcnRpYWxQYXRoKTtcblx0XHRpZiAocHJvcGVydHkuX3R5cGUgPT09IFwiTmF2aWdhdGlvblByb3BlcnR5XCIgJiYgcHJvcGVydHkuaXNDb2xsZWN0aW9uKSB7XG5cdFx0XHRwYXJ0ICs9IFwiKlwiO1xuXHRcdH1cblx0XHRrZXkgPSBrZXkgPyBrZXkgKyBcIi9cIiArIHBhcnQgOiBwYXJ0O1xuXHR9XG5cdHJldHVybiBrZXk7XG59O1xuXG5jb25zdCBfY3JlYXRlRmlsdGVyU2VsZWN0aW9uRmllbGQgPSBmdW5jdGlvbihcblx0ZW50aXR5VHlwZTogRW50aXR5VHlwZSxcblx0cHJvcGVydHk6IFByb3BlcnR5LFxuXHRmdWxsUHJvcGVydHlQYXRoOiBzdHJpbmcsXG5cdGluY2x1ZGVIaWRkZW46IGJvb2xlYW4sXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHRcbik6IEZpbHRlckZpZWxkIHwgdW5kZWZpbmVkIHtcblx0Ly8gaWdub3JlIGNvbXBsZXggcHJvcGVydHkgdHlwZXMgYW5kIGhpZGRlbiBhbm5vdGF0ZWQgb25lc1xuXHRpZiAoXG5cdFx0cHJvcGVydHkgIT09IHVuZGVmaW5lZCAmJlxuXHRcdHByb3BlcnR5LnRhcmdldFR5cGUgPT09IHVuZGVmaW5lZCAmJlxuXHRcdChpbmNsdWRlSGlkZGVuIHx8IHByb3BlcnR5LmFubm90YXRpb25zPy5VST8uSGlkZGVuPy52YWx1ZU9mKCkgIT09IHRydWUpXG5cdCkge1xuXHRcdGNvbnN0IHRhcmdldEVudGl0eVR5cGUgPSBjb252ZXJ0ZXJDb250ZXh0LmdldEFubm90YXRpb25FbnRpdHlUeXBlKHByb3BlcnR5KTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0a2V5OiBLZXlIZWxwZXIuZ2V0U2VsZWN0aW9uRmllbGRLZXlGcm9tUGF0aChmdWxsUHJvcGVydHlQYXRoKSxcblx0XHRcdGFubm90YXRpb25QYXRoOiBjb252ZXJ0ZXJDb250ZXh0LmdldEFic29sdXRlQW5ub3RhdGlvblBhdGgoZnVsbFByb3BlcnR5UGF0aCksXG5cdFx0XHRjb25kaXRpb25QYXRoOiBfZ2V0Q29uZGl0aW9uUGF0aChlbnRpdHlUeXBlLCBmdWxsUHJvcGVydHlQYXRoKSxcblx0XHRcdGF2YWlsYWJpbGl0eTpcblx0XHRcdFx0cHJvcGVydHkuYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW5GaWx0ZXI/LnZhbHVlT2YoKSA9PT0gdHJ1ZSA/IEF2YWlsYWJpbGl0eVR5cGUuSGlkZGVuIDogQXZhaWxhYmlsaXR5VHlwZS5BZGFwdGF0aW9uLFxuXHRcdFx0bGFiZWw6IGNvbXBpbGVCaW5kaW5nKGFubm90YXRpb25FeHByZXNzaW9uKHByb3BlcnR5LmFubm90YXRpb25zLkNvbW1vbj8uTGFiZWw/LnZhbHVlT2YoKSB8fCBwcm9wZXJ0eS5uYW1lKSksXG5cdFx0XHRncm91cDogdGFyZ2V0RW50aXR5VHlwZS5uYW1lLFxuXHRcdFx0Z3JvdXBMYWJlbDogY29tcGlsZUJpbmRpbmcoXG5cdFx0XHRcdGFubm90YXRpb25FeHByZXNzaW9uKHRhcmdldEVudGl0eVR5cGU/LmFubm90YXRpb25zPy5Db21tb24/LkxhYmVsPy52YWx1ZU9mKCkgfHwgdGFyZ2V0RW50aXR5VHlwZS5uYW1lKVxuXHRcdFx0KVxuXHRcdH07XG5cdH1cblx0cmV0dXJuIHVuZGVmaW5lZDtcbn07XG5cbmNvbnN0IF9nZXRTZWxlY3Rpb25GaWVsZHMgPSBmdW5jdGlvbihcblx0ZW50aXR5VHlwZTogRW50aXR5VHlwZSxcblx0bmF2aWdhdGlvblBhdGg6IHN0cmluZyxcblx0cHJvcGVydGllczogQXJyYXk8UHJvcGVydHk+IHwgdW5kZWZpbmVkLFxuXHRpbmNsdWRlSGlkZGVuOiBib29sZWFuLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0XG4pOiBSZWNvcmQ8c3RyaW5nLCBGaWx0ZXJGaWVsZD4ge1xuXHRjb25zdCBzZWxlY3Rpb25GaWVsZE1hcDogUmVjb3JkPHN0cmluZywgRmlsdGVyRmllbGQ+ID0ge307XG5cdGlmIChwcm9wZXJ0aWVzKSB7XG5cdFx0cHJvcGVydGllcy5mb3JFYWNoKChwcm9wZXJ0eTogUHJvcGVydHkpID0+IHtcblx0XHRcdGNvbnN0IHByb3BlcnR5UGF0aDogc3RyaW5nID0gcHJvcGVydHkubmFtZTtcblx0XHRcdGNvbnN0IGZ1bGxQYXRoOiBzdHJpbmcgPSAobmF2aWdhdGlvblBhdGggPyBuYXZpZ2F0aW9uUGF0aCArIFwiL1wiIDogXCJcIikgKyBwcm9wZXJ0eVBhdGg7XG5cdFx0XHRjb25zdCBzZWxlY3Rpb25GaWVsZCA9IF9jcmVhdGVGaWx0ZXJTZWxlY3Rpb25GaWVsZChlbnRpdHlUeXBlLCBwcm9wZXJ0eSwgZnVsbFBhdGgsIGluY2x1ZGVIaWRkZW4sIGNvbnZlcnRlckNvbnRleHQpO1xuXHRcdFx0aWYgKHNlbGVjdGlvbkZpZWxkKSB7XG5cdFx0XHRcdHNlbGVjdGlvbkZpZWxkTWFwW2Z1bGxQYXRoXSA9IHNlbGVjdGlvbkZpZWxkO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cdHJldHVybiBzZWxlY3Rpb25GaWVsZE1hcDtcbn07XG5cbmNvbnN0IF9nZXRTZWxlY3Rpb25GaWVsZHNCeVBhdGggPSBmdW5jdGlvbihcblx0ZW50aXR5VHlwZTogRW50aXR5VHlwZSxcblx0cHJvcGVydHlQYXRoczogQXJyYXk8c3RyaW5nPiB8IHVuZGVmaW5lZCxcblx0aW5jbHVkZUhpZGRlbjogYm9vbGVhbixcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dFxuKTogUmVjb3JkPHN0cmluZywgRmlsdGVyRmllbGQ+IHtcblx0bGV0IHNlbGVjdGlvbkZpZWxkczogUmVjb3JkPHN0cmluZywgRmlsdGVyRmllbGQ+ID0ge307XG5cdGlmIChwcm9wZXJ0eVBhdGhzKSB7XG5cdFx0cHJvcGVydHlQYXRocy5mb3JFYWNoKChwcm9wZXJ0eVBhdGg6IHN0cmluZykgPT4ge1xuXHRcdFx0bGV0IGxvY2FsU2VsZWN0aW9uRmllbGRzOiBSZWNvcmQ8c3RyaW5nLCBGaWx0ZXJGaWVsZD47XG5cblx0XHRcdGNvbnN0IHByb3BlcnR5OiBQcm9wZXJ0eSB8IE5hdmlnYXRpb25Qcm9wZXJ0eSA9IGVudGl0eVR5cGUucmVzb2x2ZVBhdGgocHJvcGVydHlQYXRoKTtcblx0XHRcdGlmIChwcm9wZXJ0eSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGlmIChwcm9wZXJ0eS5fdHlwZSA9PT0gXCJOYXZpZ2F0aW9uUHJvcGVydHlcIikge1xuXHRcdFx0XHQvLyBoYW5kbGUgbmF2aWdhdGlvbiBwcm9wZXJ0aWVzXG5cdFx0XHRcdGxvY2FsU2VsZWN0aW9uRmllbGRzID0gX2dldFNlbGVjdGlvbkZpZWxkcyhcblx0XHRcdFx0XHRlbnRpdHlUeXBlLFxuXHRcdFx0XHRcdHByb3BlcnR5UGF0aCxcblx0XHRcdFx0XHRwcm9wZXJ0eS50YXJnZXRUeXBlLmVudGl0eVByb3BlcnRpZXMsXG5cdFx0XHRcdFx0aW5jbHVkZUhpZGRlbixcblx0XHRcdFx0XHRjb252ZXJ0ZXJDb250ZXh0XG5cdFx0XHRcdCk7XG5cdFx0XHR9IGVsc2UgaWYgKHByb3BlcnR5LnRhcmdldFR5cGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHQvLyBoYW5kbGUgQ29tcGxleFR5cGUgcHJvcGVydGllc1xuXHRcdFx0XHRsb2NhbFNlbGVjdGlvbkZpZWxkcyA9IF9nZXRTZWxlY3Rpb25GaWVsZHMoXG5cdFx0XHRcdFx0ZW50aXR5VHlwZSxcblx0XHRcdFx0XHRwcm9wZXJ0eVBhdGgsXG5cdFx0XHRcdFx0cHJvcGVydHkudGFyZ2V0VHlwZS5wcm9wZXJ0aWVzLFxuXHRcdFx0XHRcdGluY2x1ZGVIaWRkZW4sXG5cdFx0XHRcdFx0Y29udmVydGVyQ29udGV4dFxuXHRcdFx0XHQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc3QgbmF2aWdhdGlvblBhdGggPSBwcm9wZXJ0eVBhdGguaW5jbHVkZXMoXCIvXCIpXG5cdFx0XHRcdFx0PyBwcm9wZXJ0eVBhdGhcblx0XHRcdFx0XHRcdFx0LnNwbGl0KFwiL1wiKVxuXHRcdFx0XHRcdFx0XHQuc3BsaWNlKDAsIDEpXG5cdFx0XHRcdFx0XHRcdC5qb2luKFwiL1wiKVxuXHRcdFx0XHRcdDogXCJcIjtcblx0XHRcdFx0bG9jYWxTZWxlY3Rpb25GaWVsZHMgPSBfZ2V0U2VsZWN0aW9uRmllbGRzKGVudGl0eVR5cGUsIG5hdmlnYXRpb25QYXRoLCBbcHJvcGVydHldLCBpbmNsdWRlSGlkZGVuLCBjb252ZXJ0ZXJDb250ZXh0KTtcblx0XHRcdH1cblxuXHRcdFx0c2VsZWN0aW9uRmllbGRzID0ge1xuXHRcdFx0XHQuLi5zZWxlY3Rpb25GaWVsZHMsXG5cdFx0XHRcdC4uLmxvY2FsU2VsZWN0aW9uRmllbGRzXG5cdFx0XHR9O1xuXHRcdH0pO1xuXHR9XG5cdHJldHVybiBzZWxlY3Rpb25GaWVsZHM7XG59O1xuXG4vKipcbiAqIEVudGVyIGFsbCBEYXRhRmllbGRzIG9mIGEgZ2l2ZW4gRmllbGRHcm91cCBpbnRvIHRoZSBmaWx0ZXJGYWNldE1hcC5cbiAqXG4gKiBAcGFyYW0ge0Fubm90YXRpb25UZXJtPEZpZWxkR3JvdXBUeXBlPn0gZmllbGRHcm91cFxuICogQHJldHVybnMge1JlY29yZDxzdHJpbmcsIEZpbHRlckdyb3VwPn0gZmlsdGVyRmFjZXRNYXAgZm9yIHRoZSBnaXZlbiBmaWVsZEdyb3VwXG4gKi9cbmZ1bmN0aW9uIGdldEZpZWxkR3JvdXBGaWx0ZXJHcm91cHMoZmllbGRHcm91cDogQW5ub3RhdGlvblRlcm08RmllbGRHcm91cFR5cGU+KTogUmVjb3JkPHN0cmluZywgRmlsdGVyR3JvdXA+IHtcblx0Y29uc3QgZmlsdGVyRmFjZXRNYXA6IFJlY29yZDxzdHJpbmcsIEZpbHRlckdyb3VwPiA9IHt9O1xuXHRmaWVsZEdyb3VwLkRhdGEuZm9yRWFjaCgoZGF0YUZpZWxkOiBEYXRhRmllbGRBYnN0cmFjdFR5cGVzKSA9PiB7XG5cdFx0aWYgKGRhdGFGaWVsZC4kVHlwZSA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRcIikge1xuXHRcdFx0ZmlsdGVyRmFjZXRNYXBbZGF0YUZpZWxkLlZhbHVlLnBhdGhdID0ge1xuXHRcdFx0XHRncm91cDogZmllbGRHcm91cC5mdWxseVF1YWxpZmllZE5hbWUsXG5cdFx0XHRcdGdyb3VwTGFiZWw6XG5cdFx0XHRcdFx0Y29tcGlsZUJpbmRpbmcoXG5cdFx0XHRcdFx0XHRhbm5vdGF0aW9uRXhwcmVzc2lvbihmaWVsZEdyb3VwLkxhYmVsIHx8IGZpZWxkR3JvdXAuYW5ub3RhdGlvbnM/LkNvbW1vbj8uTGFiZWwgfHwgZmllbGRHcm91cC5xdWFsaWZpZXIpXG5cdFx0XHRcdFx0KSB8fCBmaWVsZEdyb3VwLnF1YWxpZmllclxuXHRcdFx0fTtcblx0XHR9XG5cdH0pO1xuXHRyZXR1cm4gZmlsdGVyRmFjZXRNYXA7XG59XG5cbi8qKlxuICogR2V0IGFsbCBMaXN0IFJlcG9ydCBUYWJsZXMuXG4gKiBAcGFyYW0ge0xpc3RSZXBvcnRWaWV3RGVmaW5pdGlvbltdfSB2aWV3cyBMaXN0IFJlcG9ydCB2aWV3cyBjb25maWd1cmVkIGludG8gbWFuaWZlc3RcbiAqIEByZXR1cm5zIHtUYWJsZVZpc3VhbGl6YXRpb25bXX0gTGlzdCBSZXBvcnQgVGFibGVcbiAqL1xuZnVuY3Rpb24gZ2V0VGFibGVWaXN1YWxpemF0aW9ucyh2aWV3czogTGlzdFJlcG9ydFZpZXdEZWZpbml0aW9uW10pOiBUYWJsZVZpc3VhbGl6YXRpb25bXSB7XG5cdGNvbnN0IHRhYmxlczogVGFibGVWaXN1YWxpemF0aW9uW10gPSBbXTtcblx0dmlld3MuZm9yRWFjaChmdW5jdGlvbih2aWV3KSB7XG5cdFx0dmlldy5wcmVzZW50YXRpb24udmlzdWFsaXphdGlvbnMuZm9yRWFjaChmdW5jdGlvbih2aXN1YWxpemF0aW9uKSB7XG5cdFx0XHRpZiAodmlzdWFsaXphdGlvbi50eXBlID09PSBWaXN1YWxpemF0aW9uVHlwZS5UYWJsZSkge1xuXHRcdFx0XHR0YWJsZXMucHVzaCh2aXN1YWxpemF0aW9uKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSk7XG5cdHJldHVybiB0YWJsZXM7XG59XG5cbi8qKlxuICogSXMgRmlsdGVyQmFyIHNlYXJjaCBmaWVsZCBoaWRkZW4gb3Igbm90LlxuICpcbiAqIEBwYXJhbSB7VGFibGVWaXN1YWxpemF0aW9uW119IGxpc3RSZXBvcnRUYWJsZXMgTGlzdCBSZXBvcnQgdGFibGVzXG4gKiBAcGFyYW0ge0NvbnZlcnRlckNvbnRleHR9IGNvbnZlcnRlckNvbnRleHRcbiAqIEByZXR1cm5zIHtib29sZWFufSBJcyBGaWx0ZXJCYXIgc2VhcmNoIGZpZWxkIGhpZGRlbiBvciBub3RcbiAqL1xuZnVuY3Rpb24gZ2V0RmlsdGVyQmFyaGlkZUJhc2ljU2VhcmNoKGxpc3RSZXBvcnRUYWJsZXM6IFRhYmxlVmlzdWFsaXphdGlvbltdLCBjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogYm9vbGVhbiB7XG5cdGlmIChjb252ZXJ0ZXJDb250ZXh0LmdldFRlbXBsYXRlVHlwZSgpID09PSBUZW1wbGF0ZVR5cGUuQW5hbHl0aWNhbExpc3RQYWdlKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0LyoqXG5cdCAqIFRyeSB0byBmaW5kIGEgbm9uIGFuYWx5dGljYWwgdGFibGUgd2l0aCB0aGUgbWFpbiBlbnRpdHkgc2V0IChwYWdlIGVudGl0eSBzZXQpIGFzIGNvbGxlY3Rpb25cblx0ICogaWYgYXQgbGVhc3Qgb25lIHRhYmxlIG1hdGNoZXMgdGhlc2UgY29uZGl0aW9ucywgYmFzaWMgc2VhcmNoIGZpZWxkIG11c3QgYmUgZGlzcGxheWVkXG5cdCAqL1xuXHRyZXR1cm4gY2hlY2tBbGxUYWJsZUZvckVudGl0eVNldEFyZUFuYWx5dGljYWwobGlzdFJlcG9ydFRhYmxlcywgKGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0KCkgYXMgUmVxdWlyZWQ8RW50aXR5U2V0PikubmFtZSk7XG59XG5cbi8qKlxuICogQ2hlY2sgdGhhdCBhbGwgdGhlIHRhYmxlcyBmb3IgYSBkZWRpY2F0ZWQgZW50aXR5c2V0IGFyZSBjb25maWd1cmVkIGFzIGFuYWx5dGljYWwgdGFibGUuXG4gKiBAcGFyYW0ge1RhYmxlVmlzdWFsaXphdGlvbltdfSBsaXN0UmVwb3J0VGFibGVzIExpc3QgUmVwb3J0IHRhYmxlc1xuICogQHBhcmFtIHtzdHJpbmd9IGVudGl0eVNldE5hbWVcbiAqIEByZXR1cm5zIHtib29sZWFufSBJcyBGaWx0ZXJCYXIgc2VhcmNoIGZpZWxkIGhpZGRlbiBvciBub3RcbiAqL1xuZnVuY3Rpb24gY2hlY2tBbGxUYWJsZUZvckVudGl0eVNldEFyZUFuYWx5dGljYWwobGlzdFJlcG9ydFRhYmxlczogVGFibGVWaXN1YWxpemF0aW9uW10sIGVudGl0eVNldE5hbWU6IHN0cmluZykge1xuXHRpZiAobGlzdFJlcG9ydFRhYmxlcy5sZW5ndGggPiAwKSB7XG5cdFx0cmV0dXJuIGxpc3RSZXBvcnRUYWJsZXMuZXZlcnkodmlzdWFsaXphdGlvbiA9PiB7XG5cdFx0XHRyZXR1cm4gdmlzdWFsaXphdGlvbi5lbmFibGVBbmFseXRpY3MgJiYgXCIvXCIgKyBlbnRpdHlTZXROYW1lID09PSB2aXN1YWxpemF0aW9uLmFubm90YXRpb24uY29sbGVjdGlvbjtcblx0XHR9KTtcblx0fVxuXHRyZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogUmV0cmlldmUgdGhlIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBzZWxlY3Rpb24gZmllbGRzIHRoYXQgd2lsbCBiZSB1c2VkIHdpdGhpbiB0aGUgZmlsdGVyIGJhclxuICogVGhpcyBjb25maWd1cmF0aW9uIHRha2VzIGludG8gYWNjb3VudCBhbm5vdGF0aW9uIGFuZCB0aGUgc2VsZWN0aW9uIHZhcmlhbnRzLlxuICpcbiAqIEBwYXJhbSB7Q29udmVydGVyQ29udGV4dH0gY29udmVydGVyQ29udGV4dFxuICogQHBhcmFtIHtUYWJsZVZpc3VhbGl6YXRpb25bXX0gbHJUYWJsZXNcbiAqIEByZXR1cm5zIHtGaWx0ZXJTZWxlY3Rpb25GaWVsZFtdfSBhbiBhcnJheSBvZiBzZWxlY3Rpb24gZmllbGRzXG4gKi9cblxuZXhwb3J0IGNvbnN0IGdldFNlbGVjdGlvbkZpZWxkcyA9IGZ1bmN0aW9uKGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsIGxyVGFibGVzOiBUYWJsZVZpc3VhbGl6YXRpb25bXSA9IFtdKTogRmlsdGVyRmllbGRbXSB7XG5cdGNvbnN0IHNlbGVjdGlvblZhcmlhbnRQYXRoczogc3RyaW5nW10gPSBbXTtcblx0Ly8gRmV0Y2ggYWxsIHNlbGVjdGlvblZhcmlhbnRzIGRlZmluZWQgaW4gdGhlIGRpZmZlcmVudCB2aXN1YWxpemF0aW9ucyBhbmQgZGlmZmVyZW50IHZpZXdzIChtdWx0aSB0YWJsZSBtb2RlKVxuXHRjb25zdCBzZWxlY3Rpb25WYXJpYW50czogU2VsZWN0aW9uVmFyaWFudENvbmZpZ3VyYXRpb25bXSA9IGxyVGFibGVzXG5cdFx0Lm1hcCh2aXN1YWxpemF0aW9uID0+IHtcblx0XHRcdGNvbnN0IHRhYmxlRmlsdGVycyA9IHZpc3VhbGl6YXRpb24uY29udHJvbC5maWx0ZXJzO1xuXHRcdFx0Y29uc3QgdGFibGVTVkNvbmZpZ3M6IFNlbGVjdGlvblZhcmlhbnRDb25maWd1cmF0aW9uW10gPSBbXTtcblx0XHRcdGZvciAoY29uc3Qga2V5IGluIHRhYmxlRmlsdGVycykge1xuXHRcdFx0XHRpZiAoQXJyYXkuaXNBcnJheSh0YWJsZUZpbHRlcnNba2V5XS5wYXRocykpIHtcblx0XHRcdFx0XHRjb25zdCBwYXRocyA9IHRhYmxlRmlsdGVyc1trZXldLnBhdGhzO1xuXHRcdFx0XHRcdHBhdGhzLmZvckVhY2gocGF0aCA9PiB7XG5cdFx0XHRcdFx0XHRpZiAocGF0aCAmJiBwYXRoLmFubm90YXRpb25QYXRoICYmIHNlbGVjdGlvblZhcmlhbnRQYXRocy5pbmRleE9mKHBhdGguYW5ub3RhdGlvblBhdGgpID09PSAtMSkge1xuXHRcdFx0XHRcdFx0XHRzZWxlY3Rpb25WYXJpYW50UGF0aHMucHVzaChwYXRoLmFubm90YXRpb25QYXRoKTtcblx0XHRcdFx0XHRcdFx0Y29uc3Qgc2VsZWN0aW9uVmFyaWFudENvbmZpZyA9IGdldFNlbGVjdGlvblZhcmlhbnRDb25maWd1cmF0aW9uKHBhdGguYW5ub3RhdGlvblBhdGgsIGNvbnZlcnRlckNvbnRleHQpO1xuXHRcdFx0XHRcdFx0XHRpZiAoc2VsZWN0aW9uVmFyaWFudENvbmZpZykge1xuXHRcdFx0XHRcdFx0XHRcdHRhYmxlU1ZDb25maWdzLnB1c2goc2VsZWN0aW9uVmFyaWFudENvbmZpZyk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRhYmxlU1ZDb25maWdzO1xuXHRcdH0pXG5cdFx0LnJlZHVjZSgoc3ZDb25maWdzLCBzZWxlY3Rpb25WYXJpYW50KSA9PiBzdkNvbmZpZ3MuY29uY2F0KHNlbGVjdGlvblZhcmlhbnQpLCBbXSk7XG5cblx0Ly8gY3JlYXRlIGEgbWFwIG9mIHByb3BlcnRpZXMgdG8gYmUgdXNlZCBpbiBzZWxlY3Rpb24gdmFyaWFudHNcblx0Y29uc3QgZXhjbHVkZWRGaWx0ZXJQcm9wZXJ0aWVzOiBSZWNvcmQ8c3RyaW5nLCBib29sZWFuPiA9IHNlbGVjdGlvblZhcmlhbnRzLnJlZHVjZShcblx0XHQocHJldmlvdXNWYWx1ZTogUmVjb3JkPHN0cmluZywgYm9vbGVhbj4sIHNlbGVjdGlvblZhcmlhbnQpID0+IHtcblx0XHRcdHNlbGVjdGlvblZhcmlhbnQucHJvcGVydHlOYW1lcy5mb3JFYWNoKHByb3BlcnR5TmFtZSA9PiB7XG5cdFx0XHRcdHByZXZpb3VzVmFsdWVbcHJvcGVydHlOYW1lXSA9IHRydWU7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBwcmV2aW91c1ZhbHVlO1xuXHRcdH0sXG5cdFx0e31cblx0KTtcblx0Y29uc3QgZW50aXR5VHlwZSA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZSgpO1xuXHRjb25zdCBmaWx0ZXJGYWNldHMgPSBjb252ZXJ0ZXJDb250ZXh0LmdldEFubm90YXRpb25FbnRpdHlUeXBlKCkuYW5ub3RhdGlvbnMuVUk/LkZpbHRlckZhY2V0cztcblx0bGV0IGZpbHRlckZhY2V0TWFwOiBSZWNvcmQ8c3RyaW5nLCBGaWx0ZXJHcm91cD4gPSB7fTtcblxuXHRjb25zdCBhRmllbGRHcm91cHMgPSBjb252ZXJ0ZXJDb250ZXh0LmdldEFubm90YXRpb25zQnlUZXJtKFwiVUlcIiwgVUlBbm5vdGF0aW9uVGVybXMuRmllbGRHcm91cCkgfHwgW107XG5cblx0aWYgKGZpbHRlckZhY2V0cyA9PT0gdW5kZWZpbmVkIHx8IGZpbHRlckZhY2V0cy5sZW5ndGggPCAwKSB7XG5cdFx0Zm9yIChjb25zdCBpIGluIGFGaWVsZEdyb3Vwcykge1xuXHRcdFx0ZmlsdGVyRmFjZXRNYXAgPSB7XG5cdFx0XHRcdC4uLmZpbHRlckZhY2V0TWFwLFxuXHRcdFx0XHQuLi5nZXRGaWVsZEdyb3VwRmlsdGVyR3JvdXBzKGFGaWVsZEdyb3Vwc1tpXSBhcyBBbm5vdGF0aW9uVGVybTxGaWVsZEdyb3VwVHlwZT4pXG5cdFx0XHR9O1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRmaWx0ZXJGYWNldE1hcCA9IGZpbHRlckZhY2V0cy5yZWR1Y2UoKHByZXZpb3VzVmFsdWU6IFJlY29yZDxzdHJpbmcsIEZpbHRlckdyb3VwPiwgZmlsdGVyRmFjZXQ6IFJlZmVyZW5jZUZhY2V0VHlwZXMpID0+IHtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgZmlsdGVyRmFjZXQuVGFyZ2V0LiR0YXJnZXQuRGF0YS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRwcmV2aW91c1ZhbHVlW2ZpbHRlckZhY2V0LlRhcmdldC4kdGFyZ2V0LkRhdGFbaV0uVmFsdWUucGF0aF0gPSB7XG5cdFx0XHRcdFx0Z3JvdXA6IGZpbHRlckZhY2V0Py5JRD8udG9TdHJpbmcoKSxcblx0XHRcdFx0XHRncm91cExhYmVsOiBmaWx0ZXJGYWNldD8uTGFiZWw/LnRvU3RyaW5nKClcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBwcmV2aW91c1ZhbHVlO1xuXHRcdH0sIHt9KTtcblx0fVxuXG5cdGxldCBhU2VsZWN0T3B0aW9uczogYW55W10gPSBbXTtcblx0Y29uc3Qgc2VsZWN0aW9uVmFyaWFudCA9IGdldFNlbGVjdGlvblZhcmlhbnQoZW50aXR5VHlwZSwgY29udmVydGVyQ29udGV4dCk7XG5cdGlmIChzZWxlY3Rpb25WYXJpYW50KSB7XG5cdFx0YVNlbGVjdE9wdGlvbnMgPSBzZWxlY3Rpb25WYXJpYW50LlNlbGVjdE9wdGlvbnM7XG5cdH1cblxuXHQvLyBjcmVhdGUgYSBtYXAgb2YgYWxsIHBvdGVudGlhbCBmaWx0ZXIgZmllbGRzIGJhc2VkIG9uLi4uXG5cdGNvbnN0IGZpbHRlckZpZWxkczogUmVjb3JkPHN0cmluZywgRmlsdGVyRmllbGQ+ID0ge1xuXHRcdC8vIC4uLm5vbiBoaWRkZW4gcHJvcGVydGllcyBvZiB0aGUgZW50aXR5XG5cdFx0Li4uX2dldFNlbGVjdGlvbkZpZWxkcyhlbnRpdHlUeXBlLCBcIlwiLCBlbnRpdHlUeXBlLmVudGl0eVByb3BlcnRpZXMsIGZhbHNlLCBjb252ZXJ0ZXJDb250ZXh0KSxcblx0XHQvLyAuLi5hZGRpdGlvbmFsIG1hbmlmZXN0IGRlZmluZWQgbmF2aWdhdGlvbiBwcm9wZXJ0aWVzXG5cdFx0Li4uX2dldFNlbGVjdGlvbkZpZWxkc0J5UGF0aChcblx0XHRcdGVudGl0eVR5cGUsXG5cdFx0XHRjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0V3JhcHBlcigpLmdldEZpbHRlckNvbmZpZ3VyYXRpb24oKS5uYXZpZ2F0aW9uUHJvcGVydGllcyxcblx0XHRcdGZhbHNlLFxuXHRcdFx0Y29udmVydGVyQ29udGV4dFxuXHRcdClcblx0fTtcblxuXHQvL0ZpbHRlcnMgd2hpY2ggaGFzIHRvIGJlIGFkZGVkIHdoaWNoIGlzIHBhcnQgb2YgU1YvRGVmYXVsdCBhbm5vdGF0aW9ucyBidXQgbm90IHByZXNlbnQgaW4gdGhlIFNlbGVjdGlvbkZpZWxkc1xuXHRjb25zdCBkZWZhdWx0RmlsdGVycyA9IF9nZXREZWZhdWx0RmlsdGVyRmllbGRzKGZpbHRlckZpZWxkcywgYVNlbGVjdE9wdGlvbnMsIGVudGl0eVR5cGUsIGNvbnZlcnRlckNvbnRleHQsIGV4Y2x1ZGVkRmlsdGVyUHJvcGVydGllcyk7XG5cblx0Ly8gZmluYWxseSBjcmVhdGUgZmluYWwgbGlzdCBvZiBmaWx0ZXIgZmllbGRzIGJ5IGFkZGluZyB0aGUgU2VsZWN0aW9uRmllbGRzIGZpcnN0IChvcmRlciBtYXR0ZXJzKS4uLlxuXHRsZXQgYWxsRmlsdGVycyA9IChcblx0XHRlbnRpdHlUeXBlLmFubm90YXRpb25zPy5VST8uU2VsZWN0aW9uRmllbGRzPy5yZWR1Y2UoKHNlbGVjdGlvbkZpZWxkczogRmlsdGVyRmllbGRbXSwgc2VsZWN0aW9uRmllbGQpID0+IHtcblx0XHRcdGNvbnN0IHByb3BlcnR5UGF0aCA9IHNlbGVjdGlvbkZpZWxkLnZhbHVlO1xuXHRcdFx0aWYgKCEocHJvcGVydHlQYXRoIGluIGV4Y2x1ZGVkRmlsdGVyUHJvcGVydGllcykpIHtcblx0XHRcdFx0Y29uc3QgZmlsdGVyRmllbGQ6IEZpbHRlckZpZWxkIHwgdW5kZWZpbmVkID0gX2dldEZpbHRlckZpZWxkKGZpbHRlckZpZWxkcywgcHJvcGVydHlQYXRoLCBjb252ZXJ0ZXJDb250ZXh0LCBlbnRpdHlUeXBlKTtcblx0XHRcdFx0aWYgKGZpbHRlckZpZWxkKSB7XG5cdFx0XHRcdFx0ZmlsdGVyRmllbGQuZ3JvdXAgPSBcIlwiO1xuXHRcdFx0XHRcdGZpbHRlckZpZWxkLmdyb3VwTGFiZWwgPSBcIlwiO1xuXHRcdFx0XHRcdHNlbGVjdGlvbkZpZWxkcy5wdXNoKGZpbHRlckZpZWxkKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHNlbGVjdGlvbkZpZWxkcztcblx0XHR9LCBbXSkgfHwgW11cblx0KVxuXHRcdC8vIFRvIGFkZCB0aGUgRmlsdGVyRmllbGQgd2hpY2ggaXMgbm90IHBhcnQgb2YgdGhlIFNlbGVjdGlvbiBGaWVsZHMgYnV0IHRoZSBwcm9wZXJ0eSBpcyBtZW50aW9uZWQgaW4gdGhlIFNlbGVjdGlvbiBWYXJpYW50XG5cdFx0LmNvbmNhdChkZWZhdWx0RmlsdGVycyB8fCBbXSlcblx0XHQvLyAuLi5hbmQgYWRkaW5nIHJlbWFpbmluZyBmaWx0ZXIgZmllbGRzLCB0aGF0IGFyZSBub3QgdXNlZCBpbiBhIFNlbGVjdGlvblZhcmlhbnQgKG9yZGVyIGRvZXNuJ3QgbWF0dGVyKVxuXHRcdC5jb25jYXQoXG5cdFx0XHRPYmplY3Qua2V5cyhmaWx0ZXJGaWVsZHMpXG5cdFx0XHRcdC5maWx0ZXIocHJvcGVydHlQYXRoID0+ICEocHJvcGVydHlQYXRoIGluIGV4Y2x1ZGVkRmlsdGVyUHJvcGVydGllcykpXG5cdFx0XHRcdC5tYXAocHJvcGVydHlQYXRoID0+IHtcblx0XHRcdFx0XHRyZXR1cm4gT2JqZWN0LmFzc2lnbihmaWx0ZXJGaWVsZHNbcHJvcGVydHlQYXRoXSwgZmlsdGVyRmFjZXRNYXBbcHJvcGVydHlQYXRoXSk7XG5cdFx0XHRcdH0pXG5cdFx0KTtcblxuXHQvL2lmIGFsbCB0YWJsZXMgYXJlIGFuYWx5dGljYWwgdGFibGVzIFwiYWdncmVnYXRhYmxlXCIgcHJvcGVydGllcyBtdXN0IGJlIGV4Y2x1ZGVkXG5cdGlmIChjaGVja0FsbFRhYmxlRm9yRW50aXR5U2V0QXJlQW5hbHl0aWNhbChsclRhYmxlcywgKGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0KCkgYXMgUmVxdWlyZWQ8RW50aXR5U2V0PikubmFtZSkpIHtcblx0XHQvKipcblx0XHQgKiBDdXJyZW50bHkgYWxsIGFncmVnYXRlcyBhcmUgcm9vdCBlbnRpdHkgcHJvcGVydGllcyAobm8gcHJvcGVydGllcyBjb21pbmcgZnJvbSBuYXZpZ2F0aW9uKSBhbmQgYWxsXG5cdFx0ICogdGFibGVzIHdpdGggc2FtZSBlbnRpdHlTZXQgZ2V0cyBzYW1lIGFnZ3JlYWd0ZSBjb25maWd1cmF0aW9uIHRoYXQncyB3aHkgd2UgY2FuIHVzZSBmcmlzdCB0YWJsZSBpbnRvXG5cdFx0ICogTFIgdG8gZ2V0IGFnZ3JlZ2F0ZXMgKHdpdGhvdXQgY3VycmVuY3kvdW5pdCBwcm9wZXJ0aWVzIHNpbmNlIHdlIGV4cGVjdCB0byBiZSBhYmxlIHRvIGZpbHRlciB0aGVtKVxuXHRcdCAqL1xuXHRcdGNvbnN0IGFnZ3JlZ2F0ZXMgPSBsclRhYmxlc1swXS5hZ2dyZWdhdGVzO1xuXHRcdGlmIChhZ2dyZWdhdGVzKSB7XG5cdFx0XHRjb25zdCBhZ2dyZWdhdGFibGVQcm9wZXJ0aWVzOiBzdHJpbmdbXSA9IE9iamVjdC5rZXlzKGFnZ3JlZ2F0ZXMpLm1hcChhZ2dyZWdhdGVLZXkgPT4gYWdncmVnYXRlc1thZ2dyZWdhdGVLZXldLnJlbGF0aXZlUGF0aCk7XG5cdFx0XHRhbGxGaWx0ZXJzID0gYWxsRmlsdGVycy5maWx0ZXIoZmlsdGVyRmllbGQgPT4ge1xuXHRcdFx0XHRyZXR1cm4gYWdncmVnYXRhYmxlUHJvcGVydGllcy5pbmRleE9mKGZpbHRlckZpZWxkLmtleSkgPT09IC0xO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGFsbEZpbHRlcnM7XG59O1xuXG5jb25zdCBfZ2V0RGVmYXVsdEZpbHRlckZpZWxkcyA9IGZ1bmN0aW9uKFxuXHRmaWx0ZXJGaWVsZHM6IFJlY29yZDxzdHJpbmcsIEZpbHRlckZpZWxkPixcblx0YVNlbGVjdE9wdGlvbnM6IGFueVtdLFxuXHRlbnRpdHlUeXBlOiBFbnRpdHlUeXBlLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRleGNsdWRlZEZpbHRlclByb3BlcnRpZXM6IFJlY29yZDxzdHJpbmcsIGJvb2xlYW4+XG4pOiBGaWx0ZXJGaWVsZFtdIHtcblx0Y29uc3Qgc2VsZWN0aW9uRmllbGRzOiBGaWx0ZXJGaWVsZFtdID0gW107XG5cdGNvbnN0IFVJU2VsZWN0aW9uRmllbGRzOiBhbnkgPSB7fTtcblx0Y29uc3QgcHJvcGVydGllcyA9IGVudGl0eVR5cGUuZW50aXR5UHJvcGVydGllcztcblx0Ly8gVXNpbmcgZW50aXR5VHlwZSBpbnN0ZWFkIG9mIGVudGl0eVNldFxuXHRlbnRpdHlUeXBlLmFubm90YXRpb25zPy5VST8uU2VsZWN0aW9uRmllbGRzPy5mb3JFYWNoKFNlbGVjdGlvbkZpZWxkID0+IHtcblx0XHRVSVNlbGVjdGlvbkZpZWxkc1tTZWxlY3Rpb25GaWVsZC52YWx1ZV0gPSB0cnVlO1xuXHR9KTtcblx0aWYgKGFTZWxlY3RPcHRpb25zICYmIGFTZWxlY3RPcHRpb25zLmxlbmd0aCA+IDApIHtcblx0XHRhU2VsZWN0T3B0aW9ucz8uZm9yRWFjaCgoc2VsZWN0T3B0aW9uOiBTZWxlY3RPcHRpb25UeXBlKSA9PiB7XG5cdFx0XHRjb25zdCBwcm9wZXJ0eU5hbWU6IGFueSA9IHNlbGVjdE9wdGlvbi5Qcm9wZXJ0eU5hbWU7XG5cdFx0XHRjb25zdCBzUHJvcGVydHlQYXRoOiBzdHJpbmcgPSBwcm9wZXJ0eU5hbWUudmFsdWU7XG5cdFx0XHRjb25zdCBVSVNlbGVjdGlvbkZpZWxkczogYW55ID0ge307XG5cdFx0XHRlbnRpdHlUeXBlLmFubm90YXRpb25zPy5VST8uU2VsZWN0aW9uRmllbGRzPy5mb3JFYWNoKFNlbGVjdGlvbkZpZWxkID0+IHtcblx0XHRcdFx0VUlTZWxlY3Rpb25GaWVsZHNbU2VsZWN0aW9uRmllbGQudmFsdWVdID0gdHJ1ZTtcblx0XHRcdH0pO1xuXHRcdFx0aWYgKCEoc1Byb3BlcnR5UGF0aCBpbiBleGNsdWRlZEZpbHRlclByb3BlcnRpZXMpKSB7XG5cdFx0XHRcdGlmICghKHNQcm9wZXJ0eVBhdGggaW4gVUlTZWxlY3Rpb25GaWVsZHMpKSB7XG5cdFx0XHRcdFx0Y29uc3QgRmlsdGVyRmllbGQ6IEZpbHRlckZpZWxkIHwgdW5kZWZpbmVkID0gX2dldEZpbHRlckZpZWxkKGZpbHRlckZpZWxkcywgc1Byb3BlcnR5UGF0aCwgY29udmVydGVyQ29udGV4dCwgZW50aXR5VHlwZSk7XG5cdFx0XHRcdFx0aWYgKEZpbHRlckZpZWxkKSB7XG5cdFx0XHRcdFx0XHRzZWxlY3Rpb25GaWVsZHMucHVzaChGaWx0ZXJGaWVsZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0gZWxzZSBpZiAocHJvcGVydGllcykge1xuXHRcdHByb3BlcnRpZXMuZm9yRWFjaCgocHJvcGVydHk6IFByb3BlcnR5KSA9PiB7XG5cdFx0XHRjb25zdCBkZWZhdWx0RmlsdGVyVmFsdWUgPSBwcm9wZXJ0eS5hbm5vdGF0aW9ucz8uQ29tbW9uPy5GaWx0ZXJEZWZhdWx0VmFsdWU7XG5cdFx0XHRjb25zdCBQcm9wZXJ0eVBhdGggPSBwcm9wZXJ0eS5uYW1lO1xuXHRcdFx0aWYgKCEoUHJvcGVydHlQYXRoIGluIGV4Y2x1ZGVkRmlsdGVyUHJvcGVydGllcykpIHtcblx0XHRcdFx0aWYgKGRlZmF1bHRGaWx0ZXJWYWx1ZSAmJiAhKFByb3BlcnR5UGF0aCBpbiBVSVNlbGVjdGlvbkZpZWxkcykpIHtcblx0XHRcdFx0XHRjb25zdCBGaWx0ZXJGaWVsZDogRmlsdGVyRmllbGQgfCB1bmRlZmluZWQgPSBfZ2V0RmlsdGVyRmllbGQoZmlsdGVyRmllbGRzLCBQcm9wZXJ0eVBhdGgsIGNvbnZlcnRlckNvbnRleHQsIGVudGl0eVR5cGUpO1xuXHRcdFx0XHRcdGlmIChGaWx0ZXJGaWVsZCkge1xuXHRcdFx0XHRcdFx0c2VsZWN0aW9uRmllbGRzLnB1c2goRmlsdGVyRmllbGQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cdHJldHVybiBzZWxlY3Rpb25GaWVsZHM7XG59O1xuXG5jb25zdCBfZ2V0RmlsdGVyRmllbGQgPSBmdW5jdGlvbihcblx0ZmlsdGVyRmllbGRzOiBSZWNvcmQ8c3RyaW5nLCBGaWx0ZXJGaWVsZD4sXG5cdHByb3BlcnR5UGF0aDogc3RyaW5nLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRlbnRpdHlUeXBlOiBFbnRpdHlUeXBlXG4pOiBGaWx0ZXJGaWVsZCB8IHVuZGVmaW5lZCB7XG5cdGxldCBmaWx0ZXJGaWVsZDogRmlsdGVyRmllbGQgfCB1bmRlZmluZWQgPSBmaWx0ZXJGaWVsZHNbcHJvcGVydHlQYXRoXTtcblx0aWYgKGZpbHRlckZpZWxkKSB7XG5cdFx0ZGVsZXRlIGZpbHRlckZpZWxkc1twcm9wZXJ0eVBhdGhdO1xuXHR9IGVsc2Uge1xuXHRcdGZpbHRlckZpZWxkID0gX2NyZWF0ZUZpbHRlclNlbGVjdGlvbkZpZWxkKGVudGl0eVR5cGUsIGVudGl0eVR5cGUucmVzb2x2ZVBhdGgocHJvcGVydHlQYXRoKSwgcHJvcGVydHlQYXRoLCB0cnVlLCBjb252ZXJ0ZXJDb250ZXh0KTtcblx0fVxuXHRpZiAoIWZpbHRlckZpZWxkKSB7XG5cdFx0Y29udmVydGVyQ29udGV4dC5nZXREaWFnbm9zdGljcygpLmFkZElzc3VlKElzc3VlQ2F0ZWdvcnkuQW5ub3RhdGlvbiwgSXNzdWVTZXZlcml0eS5IaWdoLCBJc3N1ZVR5cGUuTUlTU0lOR19TRUxFQ1RJT05GSUVMRCk7XG5cdH1cblx0Ly8gZGVmaW5lZCBTZWxlY3Rpb25GaWVsZHMgYXJlIGF2YWlsYWJsZSBieSBkZWZhdWx0XG5cdGlmIChmaWx0ZXJGaWVsZCkge1xuXHRcdGZpbHRlckZpZWxkLmF2YWlsYWJpbGl0eSA9IEF2YWlsYWJpbGl0eVR5cGUuRGVmYXVsdDtcblx0fVxuXHRyZXR1cm4gZmlsdGVyRmllbGQ7XG59O1xuXG4vKipcbiAqIFJldHJpZXZlcyBmaWx0ZXIgZmllbGRzIGZyb20gdGhlIG1hbmlmZXN0LlxuICpcbiAqIEBwYXJhbSBlbnRpdHlUeXBlIHRoZSBjdXJyZW50IGVudGl0eVR5cGVcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0IHRoZSBjb252ZXJ0ZXIgY29udGV4dFxuICogQHJldHVybnMge1JlY29yZDxzdHJpbmcsIEN1c3RvbUVsZW1lbnRGaWx0ZXJGaWVsZD59IHRoZSBtYW5pZmVzdCBkZWZpbmVkIGZpbHRlciBmaWVsZHNcbiAqL1xuY29uc3QgZ2V0TWFuaWZlc3RGaWx0ZXJGaWVsZHMgPSBmdW5jdGlvbihcblx0ZW50aXR5VHlwZTogRW50aXR5VHlwZSxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dFxuKTogUmVjb3JkPHN0cmluZywgQ3VzdG9tRWxlbWVudEZpbHRlckZpZWxkPiB7XG5cdGNvbnN0IGZiQ29uZmlnOiBGaWx0ZXJNYW5pZmVzdENvbmZpZ3VyYXRpb24gPSBjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0V3JhcHBlcigpLmdldEZpbHRlckNvbmZpZ3VyYXRpb24oKTtcblx0Y29uc3QgZGVmaW5lZEZpbHRlckZpZWxkczogUmVjb3JkPHN0cmluZywgRmlsdGVyRmllbGRNYW5pZmVzdENvbmZpZ3VyYXRpb24+ID0gZmJDb25maWc/LmZpbHRlckZpZWxkcyB8fCB7fTtcblx0Y29uc3Qgc2VsZWN0aW9uRmllbGRzOiBSZWNvcmQ8c3RyaW5nLCBGaWx0ZXJGaWVsZD4gPSBfZ2V0U2VsZWN0aW9uRmllbGRzQnlQYXRoKFxuXHRcdGVudGl0eVR5cGUsXG5cdFx0T2JqZWN0LmtleXMoZGVmaW5lZEZpbHRlckZpZWxkcykubWFwKGtleSA9PiBLZXlIZWxwZXIuZ2V0UGF0aEZyb21TZWxlY3Rpb25GaWVsZEtleShrZXkpKSxcblx0XHR0cnVlLFxuXHRcdGNvbnZlcnRlckNvbnRleHRcblx0KTtcblx0Y29uc3QgZmlsdGVyRmllbGRzOiBSZWNvcmQ8c3RyaW5nLCBDdXN0b21FbGVtZW50RmlsdGVyRmllbGQ+ID0ge307XG5cblx0Zm9yIChjb25zdCBzS2V5IGluIGRlZmluZWRGaWx0ZXJGaWVsZHMpIHtcblx0XHRjb25zdCBmaWx0ZXJGaWVsZCA9IGRlZmluZWRGaWx0ZXJGaWVsZHNbc0tleV07XG5cdFx0Y29uc3QgcHJvcGVydHlOYW1lID0gS2V5SGVscGVyLmdldFBhdGhGcm9tU2VsZWN0aW9uRmllbGRLZXkoc0tleSk7XG5cdFx0Y29uc3Qgc2VsZWN0aW9uRmllbGQgPSBzZWxlY3Rpb25GaWVsZHNbcHJvcGVydHlOYW1lXTtcblx0XHRmaWx0ZXJGaWVsZHNbc0tleV0gPSB7XG5cdFx0XHRrZXk6IHNLZXksXG5cdFx0XHRhbm5vdGF0aW9uUGF0aDogc2VsZWN0aW9uRmllbGQ/LmFubm90YXRpb25QYXRoLFxuXHRcdFx0Y29uZGl0aW9uUGF0aDogc2VsZWN0aW9uRmllbGQ/LmNvbmRpdGlvblBhdGggfHwgcHJvcGVydHlOYW1lLFxuXHRcdFx0dGVtcGxhdGU6IGZpbHRlckZpZWxkLnRlbXBsYXRlLFxuXHRcdFx0bGFiZWw6IGZpbHRlckZpZWxkLmxhYmVsLFxuXHRcdFx0cG9zaXRpb246IGZpbHRlckZpZWxkLnBvc2l0aW9uIHx8IHsgcGxhY2VtZW50OiBQbGFjZW1lbnQuQWZ0ZXIgfSxcblx0XHRcdGF2YWlsYWJpbGl0eTogZmlsdGVyRmllbGQuYXZhaWxhYmlsaXR5IHx8IEF2YWlsYWJpbGl0eVR5cGUuRGVmYXVsdCxcblx0XHRcdHNldHRpbmdzOiBmaWx0ZXJGaWVsZC5zZXR0aW5nc1xuXHRcdH07XG5cdH1cblx0cmV0dXJuIGZpbHRlckZpZWxkcztcbn07XG5cbi8qKlxuICogRmluZCBhIHZpc3VhbGl6YXRpb24gYW5ub3RhdGlvbiB0aGF0IGNhbiBiZSB1c2VkIGZvciByZW5kZXJpbmcgdGhlIGxpc3QgcmVwb3J0LlxuICpcbiAqIEBwYXJhbSB7RW50aXR5VHlwZX0gZW50aXR5VHlwZSB0aGUgY3VycmVudCBlbnRpdHlUeXBlXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dFxuICogQHBhcmFtIGJJc0FMUFxuICogQHJldHVybnMge0xpbmVJdGVtIHwgUHJlc2VudGF0aW9uVmFyaWFudFR5cGVUeXBlcyB8IHVuZGVmaW5lZH0gb25lIGNvbXBsaWFudCBhbm5vdGF0aW9uIGZvciByZW5kZXJpbmcgdGhlIGxpc3QgcmVwb3J0XG4gKi9cbmZ1bmN0aW9uIGdldENvbXBsaWFudFZpc3VhbGl6YXRpb25Bbm5vdGF0aW9uKFxuXHRlbnRpdHlUeXBlOiBFbnRpdHlUeXBlLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRiSXNBTFA6IEJvb2xlYW5cbik6IExpbmVJdGVtIHwgUHJlc2VudGF0aW9uVmFyaWFudFR5cGVUeXBlcyB8IFNlbGVjdGlvblByZXNlbnRhdGlvblZhcmlhbnRUeXBlVHlwZXMgfCB1bmRlZmluZWQge1xuXHRjb25zdCBhbm5vdGF0aW9uUGF0aCA9IGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RXcmFwcGVyKCkuZ2V0RGVmYXVsdFRlbXBsYXRlQW5ub3RhdGlvblBhdGgoKTtcblx0Y29uc3Qgc2VsZWN0aW9uUHJlc2VudGF0aW9uVmFyaWFudCA9IGdldFNlbGVjdGlvblByZXNlbnRhdGlvblZhcmlhbnQoZW50aXR5VHlwZSwgYW5ub3RhdGlvblBhdGgsIGNvbnZlcnRlckNvbnRleHQpO1xuXHRpZiAoYW5ub3RhdGlvblBhdGggJiYgc2VsZWN0aW9uUHJlc2VudGF0aW9uVmFyaWFudCkge1xuXHRcdGNvbnN0IHByZXNlbnRhdGlvblZhcmlhbnQgPSBzZWxlY3Rpb25QcmVzZW50YXRpb25WYXJpYW50LlByZXNlbnRhdGlvblZhcmlhbnQ7XG5cdFx0aWYgKCFwcmVzZW50YXRpb25WYXJpYW50KSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJQcmVzZW50YXRpb24gVmFyaWFudCBpcyBub3QgY29uZmlndXJlZCBpbiB0aGUgU1BWIG1lbnRpb25lZCBpbiB0aGUgbWFuaWZlc3RcIik7XG5cdFx0fVxuXHRcdGNvbnN0IGJQVkNvbXBsYWludCA9IGlzUHJlc2VudGF0aW9uQ29tcGxpYW50KHNlbGVjdGlvblByZXNlbnRhdGlvblZhcmlhbnQuUHJlc2VudGF0aW9uVmFyaWFudCk7XG5cdFx0aWYgKCFiUFZDb21wbGFpbnQpIHtcblx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0fVxuXHRcdGlmIChpc1NlbGVjdGlvblByZXNlbnRhdGlvbkNvbXBsaWFudChzZWxlY3Rpb25QcmVzZW50YXRpb25WYXJpYW50LCBiSXNBTFApKSB7XG5cdFx0XHRyZXR1cm4gc2VsZWN0aW9uUHJlc2VudGF0aW9uVmFyaWFudDtcblx0XHR9XG5cdH1cblx0aWYgKHNlbGVjdGlvblByZXNlbnRhdGlvblZhcmlhbnQpIHtcblx0XHRpZiAoaXNTZWxlY3Rpb25QcmVzZW50YXRpb25Db21wbGlhbnQoc2VsZWN0aW9uUHJlc2VudGF0aW9uVmFyaWFudCwgYklzQUxQKSkge1xuXHRcdFx0cmV0dXJuIHNlbGVjdGlvblByZXNlbnRhdGlvblZhcmlhbnQ7XG5cdFx0fVxuXHR9XG5cdGNvbnN0IHByZXNlbnRhdGlvblZhcmlhbnQgPSBnZXREZWZhdWx0UHJlc2VudGF0aW9uVmFyaWFudChlbnRpdHlUeXBlKTtcblx0aWYgKHByZXNlbnRhdGlvblZhcmlhbnQpIHtcblx0XHRpZiAoaXNQcmVzZW50YXRpb25Db21wbGlhbnQocHJlc2VudGF0aW9uVmFyaWFudCwgYklzQUxQKSkge1xuXHRcdFx0cmV0dXJuIHByZXNlbnRhdGlvblZhcmlhbnQ7XG5cdFx0fVxuXHR9XG5cdGlmICghYklzQUxQKSB7XG5cdFx0Y29uc3QgZGVmYXVsdExpbmVJdGVtID0gZ2V0RGVmYXVsdExpbmVJdGVtKGVudGl0eVR5cGUpO1xuXHRcdGlmIChkZWZhdWx0TGluZUl0ZW0pIHtcblx0XHRcdHJldHVybiBkZWZhdWx0TGluZUl0ZW07XG5cdFx0fVxuXHR9XG5cdHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmNvbnN0IGdldFZpZXcgPSBmdW5jdGlvbih2aWV3Q29udmVydGVyQ29uZmlndXJhdGlvbjogVmlld0NvbnZlcnRlclNldHRpbmdzKTogTGlzdFJlcG9ydFZpZXdEZWZpbml0aW9uIHtcblx0Y29uc3QgY29uZmlnID0gdmlld0NvbnZlcnRlckNvbmZpZ3VyYXRpb247XG5cdGxldCBjb252ZXJ0ZXJDb250ZXh0ID0gY29uZmlnLmNvbnZlcnRlckNvbnRleHQ7XG5cdGNvbnN0IHByZXNlbnRhdGlvbjogRGF0YVZpc3VhbGl6YXRpb25EZWZpbml0aW9uID0gZ2V0RGF0YVZpc3VhbGl6YXRpb25Db25maWd1cmF0aW9uKFxuXHRcdGNvbmZpZy5hbm5vdGF0aW9uXG5cdFx0XHQ/IGNvbnZlcnRlckNvbnRleHQuZ2V0UmVsYXRpdmVBbm5vdGF0aW9uUGF0aChjb25maWcuYW5ub3RhdGlvbi5mdWxseVF1YWxpZmllZE5hbWUsIGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZSgpKVxuXHRcdFx0OiBcIlwiLFxuXHRcdHRydWUsXG5cdFx0Y29udmVydGVyQ29udGV4dFxuXHQpO1xuXHRsZXQgdGFibGVDb250cm9sSWQgPSBcIlwiO1xuXHRsZXQgY2hhcnRDb250cm9sSWQgPSBcIlwiO1xuXHRsZXQgdGl0bGU6IHN0cmluZyB8IHVuZGVmaW5lZCA9IFwiXCI7XG5cdGxldCBzZWxlY3Rpb25WYXJpYW50UGF0aCA9IFwiXCI7XG5cdGNvbnN0IGlzTXVsdGlwbGVWaWV3Q29uZmlndXJhdGlvbiA9IGZ1bmN0aW9uKGNvbmZpZzogVmlld0NvbmZpZ3VyYXRpb24pOiBjb25maWcgaXMgTXVsdGlwbGVWaWV3Q29uZmlndXJhdGlvbiB7XG5cdFx0cmV0dXJuIChjb25maWcgYXMgTXVsdGlwbGVWaWV3Q29uZmlndXJhdGlvbikua2V5ICE9PSB1bmRlZmluZWQ7XG5cdH07XG5cblx0aWYgKGlzTXVsdGlwbGVWaWV3Q29uZmlndXJhdGlvbihjb25maWcpKSB7XG5cdFx0Ly8ga2V5IGV4aXN0cyBvbmx5IG9uIG11bHRpIHRhYmxlcyBtb2RlXG5cdFx0Y29uc3QgcmVzb2x2ZWRUYXJnZXQgPSBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVR5cGVBbm5vdGF0aW9uKGNvbmZpZy5hbm5vdGF0aW9uUGF0aCk7XG5cdFx0Y29uc3Qgdmlld0Fubm90YXRpb246IFZpZXdBbm5vdGF0aW9uc1R5cGVUeXBlcyA9IHJlc29sdmVkVGFyZ2V0LmFubm90YXRpb24gYXMgVmlld0Fubm90YXRpb25zVHlwZVR5cGVzO1xuXHRcdGNvbnZlcnRlckNvbnRleHQgPSByZXNvbHZlZFRhcmdldC5jb252ZXJ0ZXJDb250ZXh0O1xuXHRcdHRpdGxlID0gY29tcGlsZUJpbmRpbmcoYW5ub3RhdGlvbkV4cHJlc3Npb24odmlld0Fubm90YXRpb24uVGV4dCkpO1xuXHRcdC8qKlxuXHRcdCAqIE5lZWQgdG8gbG9vcCBvbiB2aWV3cyBhbmQgbW9yZSBwcmVjaXNlbHkgdG8gdGFibGUgaW50byB2aWV3cyBzaW5jZVxuXHRcdCAqIG11bHRpIHRhYmxlIG1vZGUgZ2V0IHNwZWNpZmljIGNvbmZpZ3VyYXRpb24gKGhpZGRlbiBmaWx0ZXJzIG9yIFRhYmxlIElkKVxuXHRcdCAqL1xuXHRcdHByZXNlbnRhdGlvbi52aXN1YWxpemF0aW9ucy5mb3JFYWNoKCh2aXN1YWxpemF0aW9uRGVmaW5pdGlvbiwgaW5kZXgpID0+IHtcblx0XHRcdHN3aXRjaCAodmlzdWFsaXphdGlvbkRlZmluaXRpb24udHlwZSkge1xuXHRcdFx0XHRjYXNlIFZpc3VhbGl6YXRpb25UeXBlLlRhYmxlOlxuXHRcdFx0XHRcdGNvbnN0IHRhYmxlVmlzdWFsaXphdGlvbiA9IHByZXNlbnRhdGlvbi52aXN1YWxpemF0aW9uc1tpbmRleF0gYXMgVGFibGVWaXN1YWxpemF0aW9uO1xuXHRcdFx0XHRcdGNvbnN0IGZpbHRlcnMgPSB0YWJsZVZpc3VhbGl6YXRpb24uY29udHJvbC5maWx0ZXJzIHx8IHt9O1xuXHRcdFx0XHRcdGZpbHRlcnMuaGlkZGVuRmlsdGVycyA9IGZpbHRlcnMuaGlkZGVuRmlsdGVycyB8fCB7IHBhdGhzOiBbXSB9O1xuXHRcdFx0XHRcdGlmICghY29uZmlnLmtlZXBQcmV2aW91c1ByZXNvbmFsaXphdGlvbikge1xuXHRcdFx0XHRcdFx0Ly8gTmVlZCB0byBvdmVycmlkZSBUYWJsZSBJZCB0byBtYXRjaCB3aXRoIFRhYiBLZXkgKGN1cnJlbnRseSBvbmx5IHRhYmxlIGlzIG1hbmFnZWQgaW4gbXVsdGlwbGUgdmlldyBtb2RlKVxuXHRcdFx0XHRcdFx0dGFibGVWaXN1YWxpemF0aW9uLmFubm90YXRpb24uaWQgPSBUYWJsZUlEKGNvbmZpZy5rZXksIFwiTGluZUl0ZW1cIik7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKGNvbmZpZyAmJiBjb25maWcuYW5ub3RhdGlvbiAmJiBjb25maWcuYW5ub3RhdGlvbi50ZXJtID09PSBVSUFubm90YXRpb25UZXJtcy5TZWxlY3Rpb25QcmVzZW50YXRpb25WYXJpYW50KSB7XG5cdFx0XHRcdFx0XHRzZWxlY3Rpb25WYXJpYW50UGF0aCA9IChjb25maWcuYW5ub3RhdGlvbiBhcyBTZWxlY3Rpb25QcmVzZW50YXRpb25WYXJpYW50VHlwZVR5cGVzKS5TZWxlY3Rpb25WYXJpYW50LmZ1bGx5UXVhbGlmaWVkTmFtZS5zcGxpdChcblx0XHRcdFx0XHRcdFx0XCJAXCJcblx0XHRcdFx0XHRcdClbMV07XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHNlbGVjdGlvblZhcmlhbnRQYXRoID0gY29uZmlnLmFubm90YXRpb25QYXRoO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHQgKiBQcm92aWRlIFNlbGVjdGlvbiBWYXJpYW50IHRvIGhpZGRlbkZpbHRlcnMgaW4gb3JkZXIgdG8gc2V0IHRoZSBTViBmaWx0ZXJzIHRvIHRoZSB0YWJsZVxuXHRcdFx0XHRcdCAqIE1EQyBUYWJsZSBvdmVycmlkZSBiaW5kaW5nIEZpbHRlciBhbmQgZnJvbSBTQVAgRkUgdGhlIG9ubHkgbWV0aG9kIHdoZXJlIHdlIGFyZSBhYmxlIHRvIGFkZFxuXHRcdFx0XHRcdCAqIGFkZGl0aW9uYWwgZmlsdGVyIGlzICdyZWJpbmRUYWJsZScgaW50byBUYWJsZSBkZWxlZ2F0ZVxuXHRcdFx0XHRcdCAqIEluIG9yZGVyIHRvIGF2b2lkIGltcGxlbWVudGluZyBzcGVjaWZpYyBMUiBmZWF0dXJlIHRvIFNBUCBGRSBNYWNybyBUYWJsZSwgdGhlIGZpbHRlcihzKSByZWxhdGVkXG5cdFx0XHRcdFx0ICogdG8gdGhlIFRhYiAobXVsdGkgdGFibGUgbW9kZSkgY2FuIGJlIHBhc3NlZCB0byBtYWNybyB0YWJsZSB2aWEgcGFyYW1ldGVyL2NvbnRleHQgbmFtZWQgZmlsdGVyc1xuXHRcdFx0XHRcdCAqIGFuZCBrZXkgaGlkZGVuRmlsdGVyc1xuXHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdGZpbHRlcnMuaGlkZGVuRmlsdGVycy5wYXRocy5wdXNoKHsgYW5ub3RhdGlvblBhdGg6IHNlbGVjdGlvblZhcmlhbnRQYXRoIH0pO1xuXHRcdFx0XHRcdHRhYmxlVmlzdWFsaXphdGlvbi5jb250cm9sLmZpbHRlcnMgPSBmaWx0ZXJzO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFZpc3VhbGl6YXRpb25UeXBlLkNoYXJ0OlxuXHRcdFx0XHRcdC8vIE5vdCBjdXJyZW50bHkgbWFuYWdlZFxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0cHJlc2VudGF0aW9uLnZpc3VhbGl6YXRpb25zLmZvckVhY2godmlzdWFsaXphdGlvbkRlZmluaXRpb24gPT4ge1xuXHRcdGlmICh2aXN1YWxpemF0aW9uRGVmaW5pdGlvbi50eXBlID09PSBWaXN1YWxpemF0aW9uVHlwZS5UYWJsZSkge1xuXHRcdFx0dGFibGVDb250cm9sSWQgPSB2aXN1YWxpemF0aW9uRGVmaW5pdGlvbi5hbm5vdGF0aW9uLmlkO1xuXHRcdH0gZWxzZSBpZiAodmlzdWFsaXphdGlvbkRlZmluaXRpb24udHlwZSA9PT0gVmlzdWFsaXphdGlvblR5cGUuQ2hhcnQpIHtcblx0XHRcdGNoYXJ0Q29udHJvbElkID0gdmlzdWFsaXphdGlvbkRlZmluaXRpb24uaWQ7XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIHtcblx0XHRwcmVzZW50YXRpb24sXG5cdFx0dGFibGVDb250cm9sSWQsXG5cdFx0Y2hhcnRDb250cm9sSWQsXG5cdFx0ZW50aXR5U2V0OiBcIi9cIiArIHZpZXdDb252ZXJ0ZXJDb25maWd1cmF0aW9uLmVudGl0eVNldC5uYW1lLFxuXHRcdHRpdGxlLFxuXHRcdHNlbGVjdGlvblZhcmlhbnRQYXRoXG5cdH07XG59O1xuXG5jb25zdCBnZXRWaWV3cyA9IGZ1bmN0aW9uKFxuXHRlbnRpdHlTZXQ6IEVudGl0eVNldCxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCxcblx0c2V0dGluZ3NWaWV3czogTXVsdGlwbGVWaWV3c0NvbmZpZ3VyYXRpb24gfCB1bmRlZmluZWRcbik6IExpc3RSZXBvcnRWaWV3RGVmaW5pdGlvbltdIHtcblx0bGV0IHZpZXdDb252ZXJ0ZXJDb25maWdzOiBWaWV3Q29udmVydGVyU2V0dGluZ3NbXSA9IFtdO1xuXHRpZiAoc2V0dGluZ3NWaWV3cykge1xuXHRcdHNldHRpbmdzVmlld3MucGF0aHMuZm9yRWFjaChwYXRoID0+IHtcblx0XHRcdGNvbnN0IHZpZXdFbnRpdHlTZXQgPSBjb252ZXJ0ZXJDb250ZXh0LmZpbmRFbnRpdHlTZXQocGF0aC5lbnRpdHlTZXQpO1xuXHRcdFx0Y29uc3QgYW5ub3RhdGlvblBhdGggPSBjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0V3JhcHBlcigpLmdldERlZmF1bHRUZW1wbGF0ZUFubm90YXRpb25QYXRoKCk7XG5cdFx0XHRsZXQgYW5ub3RhdGlvbjtcblx0XHRcdGlmICh2aWV3RW50aXR5U2V0KSB7XG5cdFx0XHRcdGNvbnN0IHZpZXdDb252ZXJ0ZXJDb250ZXh0ID0gY29udmVydGVyQ29udGV4dC5nZXRDb252ZXJ0ZXJDb250ZXh0Rm9yKHZpZXdFbnRpdHlTZXQpO1xuXHRcdFx0XHRjb25zdCByZXNvbHZlZFRhcmdldCA9IHZpZXdDb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVR5cGVBbm5vdGF0aW9uKHBhdGguYW5ub3RhdGlvblBhdGgpO1xuXHRcdFx0XHRjb25zdCB0YXJnZXRBbm5vdGF0aW9uID0gcmVzb2x2ZWRUYXJnZXQuYW5ub3RhdGlvbiBhcyBEYXRhVmlzdWFsaXphdGlvbkFubm90YXRpb25zO1xuXHRcdFx0XHRjb252ZXJ0ZXJDb250ZXh0ID0gcmVzb2x2ZWRUYXJnZXQuY29udmVydGVyQ29udGV4dDtcblx0XHRcdFx0aWYgKHRhcmdldEFubm90YXRpb24pIHtcblx0XHRcdFx0XHRpZiAodGFyZ2V0QW5ub3RhdGlvbi50ZXJtID09PSBVSUFubm90YXRpb25UZXJtcy5TZWxlY3Rpb25WYXJpYW50KSB7XG5cdFx0XHRcdFx0XHRpZiAoYW5ub3RhdGlvblBhdGgpIHtcblx0XHRcdFx0XHRcdFx0YW5ub3RhdGlvbiA9IGdldFNlbGVjdGlvblByZXNlbnRhdGlvblZhcmlhbnQodmlld0VudGl0eVNldC5lbnRpdHlUeXBlLCBhbm5vdGF0aW9uUGF0aCwgY29udmVydGVyQ29udGV4dCk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRhbm5vdGF0aW9uID0gZ2V0RGVmYXVsdExpbmVJdGVtKHZpZXdFbnRpdHlTZXQuZW50aXR5VHlwZSkgYXMgTGluZUl0ZW07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGFubm90YXRpb24gPSB0YXJnZXRBbm5vdGF0aW9uO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR2aWV3Q29udmVydGVyQ29uZmlncy5wdXNoKHtcblx0XHRcdFx0XHRcdGNvbnZlcnRlckNvbnRleHQ6IHZpZXdDb252ZXJ0ZXJDb250ZXh0LFxuXHRcdFx0XHRcdFx0ZW50aXR5U2V0OiB2aWV3RW50aXR5U2V0LFxuXHRcdFx0XHRcdFx0YW5ub3RhdGlvbixcblx0XHRcdFx0XHRcdGFubm90YXRpb25QYXRoOiBwYXRoLmFubm90YXRpb25QYXRoLFxuXHRcdFx0XHRcdFx0a2VlcFByZXZpb3VzUHJlc29uYWxpemF0aW9uOiBwYXRoLmtlZXBQcmV2aW91c1ByZXNvbmFsaXphdGlvbixcblx0XHRcdFx0XHRcdGtleTogcGF0aC5rZXlcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gVE9ETyBEaWFnbm9zdGljcyBtZXNzYWdlXG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0gZWxzZSB7XG5cdFx0Y29uc3QgZW50aXR5VHlwZSA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZSgpO1xuXHRcdGlmIChjb252ZXJ0ZXJDb250ZXh0LmdldFRlbXBsYXRlVHlwZSgpID09PSBUZW1wbGF0ZVR5cGUuQW5hbHl0aWNhbExpc3RQYWdlKSB7XG5cdFx0XHR2aWV3Q29udmVydGVyQ29uZmlncyA9IGdldEFscFZpZXdDb25maWcoZW50aXR5U2V0LCBjb252ZXJ0ZXJDb250ZXh0LCB2aWV3Q29udmVydGVyQ29uZmlncyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZpZXdDb252ZXJ0ZXJDb25maWdzLnB1c2goe1xuXHRcdFx0XHRhbm5vdGF0aW9uOiBnZXRDb21wbGlhbnRWaXN1YWxpemF0aW9uQW5ub3RhdGlvbihlbnRpdHlUeXBlLCBjb252ZXJ0ZXJDb250ZXh0LCBmYWxzZSksXG5cdFx0XHRcdGVudGl0eVNldCxcblx0XHRcdFx0Y29udmVydGVyQ29udGV4dDogY29udmVydGVyQ29udGV4dFxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiB2aWV3Q29udmVydGVyQ29uZmlncy5tYXAodmlld0NvbnZlcnRlckNvbmZpZyA9PiB7XG5cdFx0cmV0dXJuIGdldFZpZXcodmlld0NvbnZlcnRlckNvbmZpZyk7XG5cdH0pO1xufTtcbmZ1bmN0aW9uIGdldEFscFZpZXdDb25maWcoXG5cdGVudGl0eVNldDogRW50aXR5U2V0LFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHR2aWV3Q29uZmlnczogVmlld0NvbnZlcnRlclNldHRpbmdzW11cbik6IFZpZXdDb252ZXJ0ZXJTZXR0aW5nc1tdIHtcblx0Y29uc3QgYW5ub3RhdGlvbiA9IGdldENvbXBsaWFudFZpc3VhbGl6YXRpb25Bbm5vdGF0aW9uKGVudGl0eVNldC5lbnRpdHlUeXBlLCBjb252ZXJ0ZXJDb250ZXh0LCB0cnVlKTtcblx0bGV0IGNoYXJ0LCB0YWJsZTtcblx0aWYgKGFubm90YXRpb24pIHtcblx0XHR2aWV3Q29uZmlncy5wdXNoKHtcblx0XHRcdGVudGl0eVNldCxcblx0XHRcdGFubm90YXRpb246IGFubm90YXRpb24sXG5cdFx0XHRjb252ZXJ0ZXJDb250ZXh0XG5cdFx0fSk7XG5cdH0gZWxzZSB7XG5cdFx0Y2hhcnQgPSBnZXREZWZhdWx0Q2hhcnQoZW50aXR5U2V0LmVudGl0eVR5cGUpO1xuXHRcdHRhYmxlID0gZ2V0RGVmYXVsdExpbmVJdGVtKGVudGl0eVNldC5lbnRpdHlUeXBlKTtcblx0XHRpZiAoY2hhcnQpIHtcblx0XHRcdHZpZXdDb25maWdzLnB1c2goe1xuXHRcdFx0XHRlbnRpdHlTZXQsXG5cdFx0XHRcdGFubm90YXRpb246IGNoYXJ0LFxuXHRcdFx0XHRjb252ZXJ0ZXJDb250ZXh0XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0aWYgKHRhYmxlKSB7XG5cdFx0XHR2aWV3Q29uZmlncy5wdXNoKHtcblx0XHRcdFx0ZW50aXR5U2V0LFxuXHRcdFx0XHRhbm5vdGF0aW9uOiB0YWJsZSxcblx0XHRcdFx0Y29udmVydGVyQ29udGV4dFxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiB2aWV3Q29uZmlncztcbn1cblxuLyoqXG4gKiBDcmVhdGUgdGhlIExpc3RSZXBvcnREZWZpbml0aW9uIGZvciB0aGUgbXVsdGkgZW50aXR5U2V0cyAobXVsdGkgdGFibGUgaW5zdGFuY2VzKS5cbiAqXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dFxuICogQHJldHVybnMge0xpc3RSZXBvcnREZWZpbml0aW9ufSB0aGUgbGlzdCByZXBvcnQgZGVmaW5pdGlvbiBiYXNlZCBvbiBhbm5vdGF0aW9uICsgbWFuaWZlc3RcbiAqL1xuZXhwb3J0IGNvbnN0IGNvbnZlcnRQYWdlID0gZnVuY3Rpb24oY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCk6IExpc3RSZXBvcnREZWZpbml0aW9uIHtcblx0Y29uc3QgdGVtcGxhdGVUeXBlID0gY29udmVydGVyQ29udGV4dC5nZXRUZW1wbGF0ZVR5cGUoKTtcblx0Y29uc3QgZW50aXR5U2V0ID0gY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXQoKTtcblx0Y29uc3QgZGF0YU1vZGVsT2JqZWN0UGF0aCA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCgpO1xuXHRjb25zdCBlbnRpdHlUeXBlID0gY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlKCk7XG5cdGNvbnN0IHNCYXNlQ29udGV4dFBhdGggPSBnZXRUYXJnZXRPYmplY3RQYXRoKGRhdGFNb2RlbE9iamVjdFBhdGgpO1xuXG5cdGlmICghZW50aXR5U2V0KSB7XG5cdFx0Ly8gSWYgd2UgZG9uJ3QgaGF2ZSBhbiBlbnRpdHlTZXQgYXQgdGhpcyBwb2ludCB3ZSBoYXZlIGFuIGlzc3VlIEknZCBzYXlcblx0XHR0aHJvdyBuZXcgRXJyb3IoXG5cdFx0XHRcIkFuIEVudGl0eVNldCBpcyByZXF1aXJlZCB0byBiZSBhYmxlIHRvIGRpc3BsYXkgYSBMaXN0UmVwb3J0LCBwbGVhc2UgYWRqdXN0IHlvdXIgYGVudGl0eVNldGAgcHJvcGVydHkgdG8gcG9pbnQgdG8gb25lLlwiXG5cdFx0KTtcblx0fVxuXHRjb25zdCBtYW5pZmVzdFdyYXBwZXIgPSBjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0V3JhcHBlcigpO1xuXHRjb25zdCB2aWV3c0RlZmluaXRpb246IE11bHRpcGxlVmlld3NDb25maWd1cmF0aW9uIHwgdW5kZWZpbmVkID0gbWFuaWZlc3RXcmFwcGVyLmdldFZpZXdDb25maWd1cmF0aW9uKCk7XG5cdGNvbnN0IGhhc011bHRpcGxlRW50aXR5U2V0cyA9IG1hbmlmZXN0V3JhcHBlci5oYXNNdWx0aXBsZUVudGl0eVNldHMoKTtcblx0Y29uc3Qgdmlld3M6IExpc3RSZXBvcnRWaWV3RGVmaW5pdGlvbltdID0gZ2V0Vmlld3MoZW50aXR5U2V0LCBjb252ZXJ0ZXJDb250ZXh0LCB2aWV3c0RlZmluaXRpb24pO1xuXHRjb25zdCBzaG93VGFiQ291bnRzID0gdmlld3NEZWZpbml0aW9uID8gdmlld3NEZWZpbml0aW9uPy5zaG93Q291bnRzIHx8IGhhc011bHRpcGxlRW50aXR5U2V0cyA6IHVuZGVmaW5lZDsgLy8gd2l0aCBtdWx0aSBFbnRpdHlTZXRzLCB0YWIgY291bnRzIGFyZSBkaXNwbGF5ZWQgYnkgZGVmYXVsdFxuXHRjb25zdCBsclRhYmxlVmlzdWFsaXphdGlvbnMgPSBnZXRUYWJsZVZpc3VhbGl6YXRpb25zKHZpZXdzKTtcblx0bGV0IHNpbmdsZVRhYmxlSWQgPSBcIlwiO1xuXHRsZXQgc2luZ2xlQ2hhcnRJZCA9IFwiXCI7XG5cdGNvbnN0IGZpbHRlckJhcklkID0gRmlsdGVyQmFySUQoZW50aXR5U2V0Lm5hbWUpO1xuXHRjb25zdCBmaWx0ZXJWYXJpYW50TWFuYWdlbWVudElEID0gRmlsdGVyVmFyaWFudE1hbmFnZW1lbnRJRChmaWx0ZXJCYXJJZCk7XG5cdGNvbnN0IHRhcmdldENvbnRyb2xJZHMgPSBbZmlsdGVyQmFySWRdLmNvbmNhdChcblx0XHRsclRhYmxlVmlzdWFsaXphdGlvbnMubWFwKHZpc3VhbGl6YXRpb24gPT4ge1xuXHRcdFx0cmV0dXJuIHZpc3VhbGl6YXRpb24uYW5ub3RhdGlvbi5pZDtcblx0XHR9KVxuXHQpO1xuXHRjb25zdCBmYkNvbmZpZyA9IG1hbmlmZXN0V3JhcHBlci5nZXRGaWx0ZXJDb25maWd1cmF0aW9uKCk7XG5cdGNvbnN0IHVzZVNlbWFudGljRGF0ZVJhbmdlID0gZmJDb25maWcudXNlU2VtYW50aWNEYXRlUmFuZ2UgIT09IHVuZGVmaW5lZCA/IGZiQ29uZmlnLnVzZVNlbWFudGljRGF0ZVJhbmdlIDogdHJ1ZTtcblxuXHRjb25zdCBvQ29uZmlnID0gZ2V0Q29udGVudEFyZWFJZCh0ZW1wbGF0ZVR5cGUsIHZpZXdzKTtcblx0aWYgKG9Db25maWcpIHtcblx0XHRzaW5nbGVDaGFydElkID0gb0NvbmZpZy5jaGFydElkO1xuXHRcdHNpbmdsZVRhYmxlSWQgPSBvQ29uZmlnLnRhYmxlSWQ7XG5cdH1cblx0Y29uc3QgYW5ub3RhdGlvblNlbGVjdGlvbkZpZWxkcyA9IGdldFNlbGVjdGlvbkZpZWxkcyhjb252ZXJ0ZXJDb250ZXh0LCBsclRhYmxlVmlzdWFsaXphdGlvbnMpO1xuXHRjb25zdCBzZWxlY3Rpb25GaWVsZHMgPSBpbnNlcnRDdXN0b21FbGVtZW50cyhhbm5vdGF0aW9uU2VsZWN0aW9uRmllbGRzLCBnZXRNYW5pZmVzdEZpbHRlckZpZWxkcyhlbnRpdHlUeXBlLCBjb252ZXJ0ZXJDb250ZXh0KSwge1xuXHRcdFwiYXZhaWxhYmlsaXR5XCI6IFwib3ZlcndyaXRlXCIsXG5cdFx0bGFiZWw6IFwib3ZlcndyaXRlXCIsXG5cdFx0cG9zaXRpb246IFwib3ZlcndyaXRlXCIsXG5cdFx0dGVtcGxhdGU6IFwib3ZlcndyaXRlXCIsXG5cdFx0c2V0dGluZ3M6IFwib3ZlcndyaXRlXCJcblx0fSk7XG5cdGNvbnN0IGhpZGVCYXNpY1NlYXJjaCA9IGdldEZpbHRlckJhcmhpZGVCYXNpY1NlYXJjaChsclRhYmxlVmlzdWFsaXphdGlvbnMsIGNvbnZlcnRlckNvbnRleHQpO1xuXHRjb25zdCBzZWxlY3Rpb25WYXJpYW50ID0gZ2V0U2VsZWN0aW9uVmFyaWFudChlbnRpdHlUeXBlLCBjb252ZXJ0ZXJDb250ZXh0KTtcblxuXHQvLyBTb3J0IGhlYWRlciBhY3Rpb25zIGFjY29yZGluZyB0byBwb3NpdGlvbiBhdHRyaWJ1dGVzIGluIG1hbmlmZXN0XG5cdGNvbnN0IGhlYWRlckFjdGlvbnMgPSBpbnNlcnRDdXN0b21FbGVtZW50cyhbXSwgZ2V0QWN0aW9uc0Zyb21NYW5pZmVzdChtYW5pZmVzdFdyYXBwZXIuZ2V0SGVhZGVyQWN0aW9ucygpLCBjb252ZXJ0ZXJDb250ZXh0KSk7XG5cdGNvbnN0IGlzQWxwOiBib29sZWFuID0gY29udmVydGVyQ29udGV4dC5nZXRUZW1wbGF0ZVR5cGUoKSA9PT0gVGVtcGxhdGVUeXBlLkFuYWx5dGljYWxMaXN0UGFnZTtcblxuXHRyZXR1cm4ge1xuXHRcdG1haW5FbnRpdHlTZXQ6IFwiL1wiICsgZW50aXR5U2V0Lm5hbWUsXG5cdFx0bWFpbkVudGl0eVR5cGU6IHNCYXNlQ29udGV4dFBhdGggKyBcIi9cIixcblx0XHRzaW5nbGVUYWJsZUlkLFxuXHRcdHNpbmdsZUNoYXJ0SWQsXG5cdFx0c2hvd1RhYkNvdW50cyxcblx0XHRoZWFkZXJBY3Rpb25zLFxuXHRcdGZpbHRlckJhcjoge1xuXHRcdFx0c2VsZWN0aW9uRmllbGRzLFxuXHRcdFx0aGlkZUJhc2ljU2VhcmNoXG5cdFx0fSxcblx0XHR2aWV3czogdmlld3MsXG5cdFx0ZmlsdGVyQmFySWQsXG5cdFx0ZmlsdGVyQ29uZGl0aW9uczoge1xuXHRcdFx0c2VsZWN0aW9uVmFyaWFudDogc2VsZWN0aW9uVmFyaWFudFxuXHRcdH0sXG5cdFx0dmFyaWFudE1hbmFnZW1lbnQ6IHtcblx0XHRcdGlkOiBmaWx0ZXJWYXJpYW50TWFuYWdlbWVudElELFxuXHRcdFx0dGFyZ2V0Q29udHJvbElkczogdGFyZ2V0Q29udHJvbElkcy5qb2luKFwiLFwiKVxuXHRcdH0sXG5cdFx0aXNNdWx0aUVudGl0eVNldHM6IGhhc011bHRpcGxlRW50aXR5U2V0cyxcblx0XHRpc0FscDogaXNBbHAsXG5cdFx0dXNlU2VtYW50aWNEYXRlUmFuZ2Vcblx0fTtcbn07XG5cbmZ1bmN0aW9uIGdldENvbnRlbnRBcmVhSWQodGVtcGxhdGVUeXBlOiBUZW1wbGF0ZVR5cGUsIHZpZXdzOiBMaXN0UmVwb3J0Vmlld0RlZmluaXRpb25bXSk6IENvbnRlbnRBcmVhSUQgfCB1bmRlZmluZWQge1xuXHRsZXQgc2luZ2xlVGFibGVJZCA9IFwiXCIsXG5cdFx0c2luZ2xlQ2hhcnRJZCA9IFwiXCI7XG5cdGlmICh2aWV3cy5sZW5ndGggPT09IDEpIHtcblx0XHRzaW5nbGVUYWJsZUlkID0gdmlld3NbMF0udGFibGVDb250cm9sSWQ7XG5cdFx0c2luZ2xlQ2hhcnRJZCA9IHZpZXdzWzBdLmNoYXJ0Q29udHJvbElkO1xuXHR9IGVsc2UgaWYgKHRlbXBsYXRlVHlwZSA9PT0gVGVtcGxhdGVUeXBlLkFuYWx5dGljYWxMaXN0UGFnZSAmJiB2aWV3cy5sZW5ndGggPT09IDIpIHtcblx0XHR2aWV3cy5tYXAob1ZpZXcgPT4ge1xuXHRcdFx0aWYgKG9WaWV3LmNoYXJ0Q29udHJvbElkKSB7XG5cdFx0XHRcdHNpbmdsZUNoYXJ0SWQgPSBvVmlldy5jaGFydENvbnRyb2xJZDtcblx0XHRcdH0gZWxzZSBpZiAob1ZpZXcudGFibGVDb250cm9sSWQpIHtcblx0XHRcdFx0c2luZ2xlVGFibGVJZCA9IG9WaWV3LnRhYmxlQ29udHJvbElkO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cdGlmIChzaW5nbGVUYWJsZUlkIHx8IHNpbmdsZUNoYXJ0SWQpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0Y2hhcnRJZDogc2luZ2xlQ2hhcnRJZCxcblx0XHRcdHRhYmxlSWQ6IHNpbmdsZVRhYmxlSWRcblx0XHR9O1xuXHR9XG5cdHJldHVybiB1bmRlZmluZWQ7XG59XG4iXX0=