sap.ui.define(["sap/fe/core/templating/UIFormatters", "sap/fe/core/templating/PropertyHelper"], function (UIFormatters, PropertyHelper) {
  "use strict";

  var _exports = {};
  var getAssociatedUnitProperty = PropertyHelper.getAssociatedUnitProperty;
  var getAssociatedCurrencyProperty = PropertyHelper.getAssociatedCurrencyProperty;
  var getDisplayMode = UIFormatters.getDisplayMode;

  /**
   * Identify if the given dataFieldAbstract passed is a "DataFieldForActionAbstract" (has Inline defined).
   *
   * @param {DataFieldAbstractTypes} dataField a datafield to evalute
   * @returns {boolean} validate that dataField is a DataFieldForActionAbstractTypes
   */
  function isDataFieldForActionAbstract(dataField) {
    return dataField.hasOwnProperty("Action");
  }
  /**
   * Identify if the given dataFieldAbstract passed is a "DataField" (has a Value).
   *
   * @param {DataFieldAbstractTypes} dataField a dataField to evaluate
   * @returns {boolean} validate that dataField is a DataFieldTypes
   */


  _exports.isDataFieldForActionAbstract = isDataFieldForActionAbstract;

  function isDataFieldTypes(dataField) {
    return dataField.hasOwnProperty("Value");
  }
  /**
   * Returns whether given data field has a static hidden annotation.
   *
   * @param {DataFieldAbstractTypes} dataField the datafield to check
   * @returns {boolean} true if datafield or referenced property has a static Hidden annotation, false else
   * @private
   */


  _exports.isDataFieldTypes = isDataFieldTypes;

  function isDataFieldAlwaysHidden(dataField) {
    var _dataField$annotation, _dataField$annotation2, _dataField$annotation3, _dataField$Value, _dataField$Value$$tar, _dataField$Value$$tar2, _dataField$Value$$tar3;

    return ((_dataField$annotation = dataField.annotations) === null || _dataField$annotation === void 0 ? void 0 : (_dataField$annotation2 = _dataField$annotation.UI) === null || _dataField$annotation2 === void 0 ? void 0 : (_dataField$annotation3 = _dataField$annotation2.Hidden) === null || _dataField$annotation3 === void 0 ? void 0 : _dataField$annotation3.valueOf()) === true || isDataFieldTypes(dataField) && ((_dataField$Value = dataField.Value) === null || _dataField$Value === void 0 ? void 0 : (_dataField$Value$$tar = _dataField$Value.$target) === null || _dataField$Value$$tar === void 0 ? void 0 : (_dataField$Value$$tar2 = _dataField$Value$$tar.annotations) === null || _dataField$Value$$tar2 === void 0 ? void 0 : (_dataField$Value$$tar3 = _dataField$Value$$tar2.UI) === null || _dataField$Value$$tar3 === void 0 ? void 0 : _dataField$Value$$tar3.Hidden) === true;
  }

  _exports.isDataFieldAlwaysHidden = isDataFieldAlwaysHidden;

  function getSemanticObjectPath(converterContext, object) {
    if (typeof object === "object") {
      var _object$Value, _object$Value$$target;

      if (isDataFieldTypes(object) && ((_object$Value = object.Value) === null || _object$Value === void 0 ? void 0 : (_object$Value$$target = _object$Value.$target) === null || _object$Value$$target === void 0 ? void 0 : _object$Value$$target.fullyQualifiedName)) {
        var _object$Value2, _object$Value2$$targe, _property$annotations, _property$annotations2;

        var property = converterContext.getEntityPropertyFromFullyQualifiedName((_object$Value2 = object.Value) === null || _object$Value2 === void 0 ? void 0 : (_object$Value2$$targe = _object$Value2.$target) === null || _object$Value2$$targe === void 0 ? void 0 : _object$Value2$$targe.fullyQualifiedName);

        if ((property === null || property === void 0 ? void 0 : (_property$annotations = property.annotations) === null || _property$annotations === void 0 ? void 0 : (_property$annotations2 = _property$annotations.Common) === null || _property$annotations2 === void 0 ? void 0 : _property$annotations2.SemanticObject) !== undefined) {
          return converterContext.getEntitySetBasedAnnotationPath(property === null || property === void 0 ? void 0 : property.fullyQualifiedName);
        }
      }
    } else {
      var _property$annotations3, _property$annotations4;

      var _property = converterContext.getEntityPropertyFromFullyQualifiedName(object);

      if ((_property === null || _property === void 0 ? void 0 : (_property$annotations3 = _property.annotations) === null || _property$annotations3 === void 0 ? void 0 : (_property$annotations4 = _property$annotations3.Common) === null || _property$annotations4 === void 0 ? void 0 : _property$annotations4.SemanticObject) !== undefined) {
        return converterContext.getEntitySetBasedAnnotationPath(_property === null || _property === void 0 ? void 0 : _property.fullyQualifiedName);
      }
    }

    return undefined;
  }
  /**
   * Collect related properties from a property's annotations.
   *
   * @param path The property path
   * @param property The property to be considered
   * @param converterContext The converter context
   * @param ignoreSelf Whether to exclude the same property from related properties.
   * @param relatedProperties The related properties identified so far.
   * @param fieldGroupProperty The fieldGroup property to which the property inherits.
   * @returns {ComplexPropertyInfo} The related properties identified.
   */


  _exports.getSemanticObjectPath = getSemanticObjectPath;

  function collectRelatedProperties(path, property, converterContext, ignoreSelf) {
    var relatedProperties = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {
      properties: {}
    };
    var fieldGroupProperty = arguments.length > 5 ? arguments[5] : undefined;

    /**
     * Helper to push unique related properties.
     *
     * @param key The property path
     * @param properties The properties object containing value property, description property...
     * @returns Index at which the property is available
     */
    function _pushUnique(key, properties) {
      if (!relatedProperties.properties.hasOwnProperty(key)) {
        relatedProperties.properties[key] = properties;
      }

      return Object.keys(relatedProperties.properties).indexOf(key);
    }
    /**
     * Helper to append the export settings template with a formatted text.
     *
     * @param value Formatted text
     */


    function _appendTemplate(value) {
      relatedProperties.exportSettingsTemplate = relatedProperties.exportSettingsTemplate ? "".concat(relatedProperties.exportSettingsTemplate).concat(value) : "".concat(value);
    }

    if (path && property) {
      var _property$annotations5, _property$annotations6;

      var navigationPathPrefix = path.indexOf("/") > -1 ? path.substring(0, path.lastIndexOf("/") + 1) : ""; // Check for Text annotation.

      var textAnnotation = (_property$annotations5 = property.annotations) === null || _property$annotations5 === void 0 ? void 0 : (_property$annotations6 = _property$annotations5.Common) === null || _property$annotations6 === void 0 ? void 0 : _property$annotations6.Text;
      var valueIndex;
      var currencyOrUoMIndex;

      if (relatedProperties.exportSettingsTemplate) {
        // FieldGroup use-case. Need to add each Field in new line.
        _appendTemplate("\n");
      }

      if ((textAnnotation === null || textAnnotation === void 0 ? void 0 : textAnnotation.path) && (textAnnotation === null || textAnnotation === void 0 ? void 0 : textAnnotation.$target)) {
        // Check for Text Arrangement.
        var dataModelObjectPath = converterContext.getDataModelObjectPath();
        var textAnnotationPropertyPath = navigationPathPrefix + textAnnotation.path;
        var displayMode = getDisplayMode(property, dataModelObjectPath);
        var descriptionIndex;

        switch (displayMode) {
          case "Value":
            valueIndex = _pushUnique(path, {
              value: property,
              fieldGroup: fieldGroupProperty
            });

            _appendTemplate("{".concat(valueIndex, "}"));

            break;

          case "Description":
            descriptionIndex = _pushUnique(textAnnotationPropertyPath, {
              value: textAnnotation.$target,
              description: property,
              fieldGroup: fieldGroupProperty
            }); // Keep value when exporting (split mode) on text Arrangement defined as #TextOnly (Only values are expected on paste from Excel functionality)

            _pushUnique(path, {
              value: property,
              fieldGroup: fieldGroupProperty
            });

            _appendTemplate("{".concat(descriptionIndex, "}"));

            break;

          case "ValueDescription":
            valueIndex = _pushUnique(path, {
              value: property,
              fieldGroup: fieldGroupProperty
            });
            descriptionIndex = _pushUnique(textAnnotationPropertyPath, {
              value: textAnnotation.$target,
              description: property,
              fieldGroup: fieldGroupProperty
            });

            _appendTemplate("{".concat(valueIndex, "} ({").concat(descriptionIndex, "})"));

            break;

          case "DescriptionValue":
            descriptionIndex = _pushUnique(textAnnotationPropertyPath, {
              value: textAnnotation.$target,
              description: property,
              fieldGroup: fieldGroupProperty
            });
            valueIndex = _pushUnique(path, {
              value: property,
              fieldGroup: fieldGroupProperty
            });

            _appendTemplate("{".concat(descriptionIndex, "} ({").concat(valueIndex, "})"));

            break;
        }
      } else {
        var _property$annotations7, _property$annotations8, _property$annotations9, _property$annotations10, _property$Target, _property$Target$$tar;

        // Check for field containing Currency Or Unit Properties.
        var currencyOrUoMProperty = getAssociatedCurrencyProperty(property) || getAssociatedUnitProperty(property);
        var currencyOrUnitAnnotation = (property === null || property === void 0 ? void 0 : (_property$annotations7 = property.annotations) === null || _property$annotations7 === void 0 ? void 0 : (_property$annotations8 = _property$annotations7.Measures) === null || _property$annotations8 === void 0 ? void 0 : _property$annotations8.ISOCurrency) || (property === null || property === void 0 ? void 0 : (_property$annotations9 = property.annotations) === null || _property$annotations9 === void 0 ? void 0 : (_property$annotations10 = _property$annotations9.Measures) === null || _property$annotations10 === void 0 ? void 0 : _property$annotations10.Unit);

        if (currencyOrUoMProperty && (currencyOrUnitAnnotation === null || currencyOrUnitAnnotation === void 0 ? void 0 : currencyOrUnitAnnotation.$target)) {
          valueIndex = _pushUnique(path, {
            value: property
          });
          currencyOrUoMIndex = _pushUnique(currencyOrUoMProperty.name, {
            value: currencyOrUnitAnnotation.$target
          });

          _appendTemplate("{".concat(valueIndex, "}  {").concat(currencyOrUoMIndex, "}"));
        } else if ((_property$Target = property.Target) === null || _property$Target === void 0 ? void 0 : (_property$Target$$tar = _property$Target.$target) === null || _property$Target$$tar === void 0 ? void 0 : _property$Target$$tar.Visualization) {
          var _property$Target$$tar2;

          // DataPoint use-case. Need to include targetValue to the template.
          valueIndex = _pushUnique(path, {
            value: (_property$Target$$tar2 = property.Target.$target.Value) === null || _property$Target$$tar2 === void 0 ? void 0 : _property$Target$$tar2.$target,
            fieldGroup: fieldGroupProperty
          }); // Need to create a new fake property containing the Rating Target Value.
          // It'll be used for the export on split mode.

          _pushUnique(property.Target.value, {
            value: property,
            fieldGroup: fieldGroupProperty
          });

          _appendTemplate("{".concat(valueIndex, "}/").concat(property.Target.$target.TargetValue));
        } else if (!ignoreSelf) {
          // Collect underlying property
          valueIndex = _pushUnique(path, {
            value: property,
            fieldGroup: fieldGroupProperty
          });

          _appendTemplate("{".concat(valueIndex, "}"));
        }
      }
    }

    return relatedProperties;
  }
  /**
   * Collect properties consumed by a Data Field.
   * This is for populating the ComplexPropertyInfos of the table delegate.
   *
   * @param dataField {DataFieldAbstractTypes} The Data Field for which the properties need to be identified.
   * @param converterContext The converter context
   * @param relatedProperties {ComplexPropertyInfo} The properties identified so far.
   * @param fieldGroupDataField {DataFieldAbstractTypes} The FieldGroup data Field to which the property belongs.
   * @returns {ComplexPropertyInfo} The properties related to the Data Field.
   */


  _exports.collectRelatedProperties = collectRelatedProperties;

  function collectRelatedPropertiesRecursively(dataField, converterContext) {
    var _dataField$Target, _dataField$Target$$ta, _dataField$Target$$ta2;

    var relatedProperties = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
      properties: {}
    };
    var fieldGroupDataField = arguments.length > 3 ? arguments[3] : undefined;

    if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataField" && dataField.Value) {
      var propertyPath = dataField.Value;
      relatedProperties = collectRelatedProperties(propertyPath.path, propertyPath.$target, converterContext, false, relatedProperties, fieldGroupDataField);
    } else if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation") {
      switch ((_dataField$Target = dataField.Target) === null || _dataField$Target === void 0 ? void 0 : (_dataField$Target$$ta = _dataField$Target.$target) === null || _dataField$Target$$ta === void 0 ? void 0 : _dataField$Target$$ta.$Type) {
        case "com.sap.vocabularies.UI.v1.FieldGroupType":
          var fieldGroup = dataField;
          (_dataField$Target$$ta2 = dataField.Target.$target.Data) === null || _dataField$Target$$ta2 === void 0 ? void 0 : _dataField$Target$$ta2.forEach(function (innerDataField) {
            relatedProperties = collectRelatedPropertiesRecursively(innerDataField, converterContext, relatedProperties, fieldGroup);
          });
          break;

        case "com.sap.vocabularies.UI.v1.DataPointType":
          relatedProperties = collectRelatedProperties(dataField.Target.$target.Value.path, dataField, converterContext, false, relatedProperties, fieldGroupDataField);
          break;
      }
    }

    return relatedProperties;
  }

  _exports.collectRelatedPropertiesRecursively = collectRelatedPropertiesRecursively;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRhdGFGaWVsZC50cyJdLCJuYW1lcyI6WyJpc0RhdGFGaWVsZEZvckFjdGlvbkFic3RyYWN0IiwiZGF0YUZpZWxkIiwiaGFzT3duUHJvcGVydHkiLCJpc0RhdGFGaWVsZFR5cGVzIiwiaXNEYXRhRmllbGRBbHdheXNIaWRkZW4iLCJhbm5vdGF0aW9ucyIsIlVJIiwiSGlkZGVuIiwidmFsdWVPZiIsIlZhbHVlIiwiJHRhcmdldCIsImdldFNlbWFudGljT2JqZWN0UGF0aCIsImNvbnZlcnRlckNvbnRleHQiLCJvYmplY3QiLCJmdWxseVF1YWxpZmllZE5hbWUiLCJwcm9wZXJ0eSIsImdldEVudGl0eVByb3BlcnR5RnJvbUZ1bGx5UXVhbGlmaWVkTmFtZSIsIkNvbW1vbiIsIlNlbWFudGljT2JqZWN0IiwidW5kZWZpbmVkIiwiZ2V0RW50aXR5U2V0QmFzZWRBbm5vdGF0aW9uUGF0aCIsImNvbGxlY3RSZWxhdGVkUHJvcGVydGllcyIsInBhdGgiLCJpZ25vcmVTZWxmIiwicmVsYXRlZFByb3BlcnRpZXMiLCJwcm9wZXJ0aWVzIiwiZmllbGRHcm91cFByb3BlcnR5IiwiX3B1c2hVbmlxdWUiLCJrZXkiLCJPYmplY3QiLCJrZXlzIiwiaW5kZXhPZiIsIl9hcHBlbmRUZW1wbGF0ZSIsInZhbHVlIiwiZXhwb3J0U2V0dGluZ3NUZW1wbGF0ZSIsIm5hdmlnYXRpb25QYXRoUHJlZml4Iiwic3Vic3RyaW5nIiwibGFzdEluZGV4T2YiLCJ0ZXh0QW5ub3RhdGlvbiIsIlRleHQiLCJ2YWx1ZUluZGV4IiwiY3VycmVuY3lPclVvTUluZGV4IiwiZGF0YU1vZGVsT2JqZWN0UGF0aCIsImdldERhdGFNb2RlbE9iamVjdFBhdGgiLCJ0ZXh0QW5ub3RhdGlvblByb3BlcnR5UGF0aCIsImRpc3BsYXlNb2RlIiwiZ2V0RGlzcGxheU1vZGUiLCJkZXNjcmlwdGlvbkluZGV4IiwiZmllbGRHcm91cCIsImRlc2NyaXB0aW9uIiwiY3VycmVuY3lPclVvTVByb3BlcnR5IiwiZ2V0QXNzb2NpYXRlZEN1cnJlbmN5UHJvcGVydHkiLCJnZXRBc3NvY2lhdGVkVW5pdFByb3BlcnR5IiwiY3VycmVuY3lPclVuaXRBbm5vdGF0aW9uIiwiTWVhc3VyZXMiLCJJU09DdXJyZW5jeSIsIlVuaXQiLCJuYW1lIiwiVGFyZ2V0IiwiVmlzdWFsaXphdGlvbiIsIlRhcmdldFZhbHVlIiwiY29sbGVjdFJlbGF0ZWRQcm9wZXJ0aWVzUmVjdXJzaXZlbHkiLCJmaWVsZEdyb3VwRGF0YUZpZWxkIiwiJFR5cGUiLCJwcm9wZXJ0eVBhdGgiLCJEYXRhIiwiZm9yRWFjaCIsImlubmVyRGF0YUZpZWxkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQWtCQTs7Ozs7O0FBTU8sV0FBU0EsNEJBQVQsQ0FBc0NDLFNBQXRDLEVBQXVIO0FBQzdILFdBQVFBLFNBQUQsQ0FBK0NDLGNBQS9DLENBQThELFFBQTlELENBQVA7QUFDQTtBQUVEOzs7Ozs7Ozs7O0FBTU8sV0FBU0MsZ0JBQVQsQ0FBMEJGLFNBQTFCLEVBQTBGO0FBQ2hHLFdBQVFBLFNBQUQsQ0FBOEJDLGNBQTlCLENBQTZDLE9BQTdDLENBQVA7QUFDQTtBQUVEOzs7Ozs7Ozs7OztBQU9PLFdBQVNFLHVCQUFULENBQWlDSCxTQUFqQyxFQUE2RTtBQUFBOztBQUNuRixXQUNDLDBCQUFBQSxTQUFTLENBQUNJLFdBQVYsMEdBQXVCQyxFQUF2Qiw0R0FBMkJDLE1BQTNCLGtGQUFtQ0MsT0FBbkMsUUFBaUQsSUFBakQsSUFDQ0wsZ0JBQWdCLENBQUNGLFNBQUQsQ0FBaEIsSUFBK0IscUJBQUFBLFNBQVMsQ0FBQ1EsS0FBViwrRkFBaUJDLE9BQWpCLDBHQUEwQkwsV0FBMUIsNEdBQXVDQyxFQUF2QyxrRkFBMkNDLE1BQTNDLE1BQXNELElBRnZGO0FBSUE7Ozs7QUFFTSxXQUFTSSxxQkFBVCxDQUErQkMsZ0JBQS9CLEVBQW1FQyxNQUFuRSxFQUFvRztBQUMxRyxRQUFJLE9BQU9BLE1BQVAsS0FBa0IsUUFBdEIsRUFBZ0M7QUFBQTs7QUFDL0IsVUFBSVYsZ0JBQWdCLENBQUNVLE1BQUQs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NEM7QUFDbEYzQyxZQUFBQSxpQkFBaUIsR0FBR3FDLG1DQUFtQyxDQUN0RE0sY0FEc0QsRUFFdER2RCxnQkFGc0QsRUFHdERZLGlCQUhzRCxFQUl0RHdCLFVBSnNELENBQXZEO0FBTUEsV0FQRDtBQVFBOztBQUVEO0FBQ0N4QixVQUFBQSxpQkFBaUIsR0FBR0gsd0JBQXdCLENBQzNDcEIsU0FBUyxDQUFDeUQsTUFBVixDQUFpQmhELE9BQWpCLENBQXlCRCxLQUF6QixDQUErQmEsSUFEWSxFQUUzQ3JCLFNBRjJDLEVBRzNDVyxnQkFIMkMsRUFJM0MsS0FKMkMsRUFLM0NZLGlCQUwyQyxFQU0zQ3NDLG1CQU4yQyxDQUE1QztBQVFBO0FBdEJGO0FBd0JBOztBQUVELFdBQU90QyxpQkFBUDtBQUNBIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEYXRhRmllbGRBYnN0cmFjdFR5cGVzLCBEYXRhRmllbGRGb3JBY3Rpb25BYnN0cmFjdFR5cGVzLCBEYXRhRmllbGRUeXBlcywgVUlBbm5vdGF0aW9uVHlwZXMgfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXNcIjtcbmltcG9ydCAqIGFzIEVkbSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXMvZGlzdC9FZG1cIjtcbmltcG9ydCB7IENvbnZlcnRlckNvbnRleHQgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy90ZW1wbGF0ZXMvQmFzZUNvbnZlcnRlclwiO1xuaW1wb3J0IHsgZ2V0RGlzcGxheU1vZGUsIFByb3BlcnR5T3JQYXRoIH0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvVUlGb3JtYXR0ZXJzXCI7XG5pbXBvcnQgeyBQcm9wZXJ0eSB9IGZyb20gXCJAc2FwLXV4L2Fubm90YXRpb24tY29udmVydGVyXCI7XG5pbXBvcnQgeyBnZXRBc3NvY2lhdGVkQ3VycmVuY3lQcm9wZXJ0eSwgZ2V0QXNzb2NpYXRlZFVuaXRQcm9wZXJ0eSB9IGZyb20gXCJzYXAvZmUvY29yZS90ZW1wbGF0aW5nL1Byb3BlcnR5SGVscGVyXCI7XG5cbmV4cG9ydCB0eXBlIENvbGxlY3RlZFByb3BlcnRpZXMgPSB7XG5cdHZhbHVlOiBQcm9wZXJ0eTtcblx0ZGVzY3JpcHRpb24/OiBQcm9wZXJ0eTtcblx0ZmllbGRHcm91cD86IERhdGFGaWVsZEFic3RyYWN0VHlwZXM7XG59O1xuXG5leHBvcnQgdHlwZSBDb21wbGV4UHJvcGVydHlJbmZvID0ge1xuXHRwcm9wZXJ0aWVzOiBSZWNvcmQ8c3RyaW5nLCBDb2xsZWN0ZWRQcm9wZXJ0aWVzPjtcblx0ZXhwb3J0U2V0dGluZ3NUZW1wbGF0ZT86IHN0cmluZztcbn07XG5cbi8qKlxuICogSWRlbnRpZnkgaWYgdGhlIGdpdmVuIGRhdGFGaWVsZEFic3RyYWN0IHBhc3NlZCBpcyBhIFwiRGF0YUZpZWxkRm9yQWN0aW9uQWJzdHJhY3RcIiAoaGFzIElubGluZSBkZWZpbmVkKS5cbiAqXG4gKiBAcGFyYW0ge0RhdGFGaWVsZEFic3RyYWN0VHlwZXN9IGRhdGFGaWVsZCBhIGRhdGFmaWVsZCB0byBldmFsdXRlXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gdmFsaWRhdGUgdGhhdCBkYXRhRmllbGQgaXMgYSBEYXRhRmllbGRGb3JBY3Rpb25BYnN0cmFjdFR5cGVzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0RhdGFGaWVsZEZvckFjdGlvbkFic3RyYWN0KGRhdGFGaWVsZDogRGF0YUZpZWxkQWJzdHJhY3RUeXBlcyk6IGRhdGFGaWVsZCBpcyBEYXRhRmllbGRGb3JBY3Rpb25BYnN0cmFjdFR5cGVzIHtcblx0cmV0dXJuIChkYXRhRmllbGQgYXMgRGF0YUZpZWxkRm9yQWN0aW9uQWJzdHJhY3RUeXBlcykuaGFzT3duUHJvcGVydHkoXCJBY3Rpb25cIik7XG59XG5cbi8qKlxuICogSWRlbnRpZnkgaWYgdGhlIGdpdmVuIGRhdGFGaWVsZEFic3RyYWN0IHBhc3NlZCBpcyBhIFwiRGF0YUZpZWxkXCIgKGhhcyBhIFZhbHVlKS5cbiAqXG4gKiBAcGFyYW0ge0RhdGFGaWVsZEFic3RyYWN0VHlwZXN9IGRhdGFGaWVsZCBhIGRhdGFGaWVsZCB0byBldmFsdWF0ZVxuICogQHJldHVybnMge2Jvb2xlYW59IHZhbGlkYXRlIHRoYXQgZGF0YUZpZWxkIGlzIGEgRGF0YUZpZWxkVHlwZXNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRGF0YUZpZWxkVHlwZXMoZGF0YUZpZWxkOiBEYXRhRmllbGRBYnN0cmFjdFR5cGVzKTogZGF0YUZpZWxkIGlzIERhdGFGaWVsZFR5cGVzIHtcblx0cmV0dXJuIChkYXRhRmllbGQgYXMgRGF0YUZpZWxkVHlwZXMpLmhhc093blByb3BlcnR5KFwiVmFsdWVcIik7XG59XG5cbi8qKlxuICogUmV0dXJucyB3aGV0aGVyIGdpdmVuIGRhdGEgZmllbGQgaGFzIGEgc3RhdGljIGhpZGRlbiBhbm5vdGF0aW9uLlxuICpcbiAqIEBwYXJhbSB7RGF0YUZpZWxkQWJzdHJhY3RUeXBlc30gZGF0YUZpZWxkIHRoZSBkYXRhZmllbGQgdG8gY2hlY2tcbiAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIGRhdGFmaWVsZCBvciByZWZlcmVuY2VkIHByb3BlcnR5IGhhcyBhIHN0YXRpYyBIaWRkZW4gYW5ub3RhdGlvbiwgZmFsc2UgZWxzZVxuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRGF0YUZpZWxkQWx3YXlzSGlkZGVuKGRhdGFGaWVsZDogRGF0YUZpZWxkQWJzdHJhY3RUeXBlcyk6IGJvb2xlYW4ge1xuXHRyZXR1cm4gKFxuXHRcdGRhdGFGaWVsZC5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbj8udmFsdWVPZigpID09PSB0cnVlIHx8XG5cdFx0KGlzRGF0YUZpZWxkVHlwZXMoZGF0YUZpZWxkKSAmJiBkYXRhRmllbGQuVmFsdWU/LiR0YXJnZXQ/LmFubm90YXRpb25zPy5VST8uSGlkZGVuID09PSB0cnVlKVxuXHQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2VtYW50aWNPYmplY3RQYXRoKGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsIG9iamVjdDogYW55KTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcblx0aWYgKHR5cGVvZiBvYmplY3QgPT09IFwib2JqZWN0XCIpIHtcblx0XHRpZiAoaXNEYXRhRmllbGRUeXBlcyhvYmplY3QpICYmIG9iamVjdC5WYWx1ZT8uJHRhcmdldD8uZnVsbHlRdWFsaWZpZWROYW1lKSB7XG5cdFx0XHRjb25zdCBwcm9wZXJ0eSA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5UHJvcGVydHlGcm9tRnVsbHlRdWFsaWZpZWROYW1lKG9iamVjdC5WYWx1ZT8uJHRhcmdldD8uZnVsbHlRdWFsaWZpZWROYW1lKTtcblx0XHRcdGlmIChwcm9wZXJ0eT8uYW5ub3RhdGlvbnM/LkNvbW1vbj8uU2VtYW50aWNPYmplY3QgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRyZXR1cm4gY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoKHByb3BlcnR5Py5mdWxseVF1YWxpZmllZE5hbWUpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRjb25zdCBwcm9wZXJ0eSA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5UHJvcGVydHlGcm9tRnVsbHlRdWFsaWZpZWROYW1lKG9iamVjdCk7XG5cdFx0aWYgKHByb3BlcnR5Py5hbm5vdGF0aW9ucz8uQ29tbW9uPy5TZW1hbnRpY09iamVjdCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXR1cm4gY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoKHByb3BlcnR5Py5mdWxseVF1YWxpZmllZE5hbWUpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIENvbGxlY3QgcmVsYXRlZCBwcm9wZXJ0aWVzIGZyb20gYSBwcm9wZXJ0eSdzIGFubm90YXRpb25zLlxuICpcbiAqIEBwYXJhbSBwYXRoIFRoZSBwcm9wZXJ0eSBwYXRoXG4gKiBAcGFyYW0gcHJvcGVydHkgVGhlIHByb3BlcnR5IHRvIGJlIGNvbnNpZGVyZWRcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0IFRoZSBjb252ZXJ0ZXIgY29udGV4dFxuICogQHBhcmFtIGlnbm9yZVNlbGYgV2hldGhlciB0byBleGNsdWRlIHRoZSBzYW1lIHByb3BlcnR5IGZyb20gcmVsYXRlZCBwcm9wZXJ0aWVzLlxuICogQHBhcmFtIHJlbGF0ZWRQcm9wZXJ0aWVzIFRoZSByZWxhdGVkIHByb3BlcnRpZXMgaWRlbnRpZmllZCBzbyBmYXIuXG4gKiBAcGFyYW0gZmllbGRHcm91cFByb3BlcnR5IFRoZSBmaWVsZEdyb3VwIHByb3BlcnR5IHRvIHdoaWNoIHRoZSBwcm9wZXJ0eSBpbmhlcml0cy5cbiAqIEByZXR1cm5zIHtDb21wbGV4UHJvcGVydHlJbmZvfSBUaGUgcmVsYXRlZCBwcm9wZXJ0aWVzIGlkZW50aWZpZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb2xsZWN0UmVsYXRlZFByb3BlcnRpZXMoXG5cdHBhdGg6IHN0cmluZyxcblx0cHJvcGVydHk6IEVkbS5QcmltaXRpdmVUeXBlLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRpZ25vcmVTZWxmOiBib29sZWFuLFxuXHRyZWxhdGVkUHJvcGVydGllczogQ29tcGxleFByb3BlcnR5SW5mbyA9IHsgcHJvcGVydGllczoge30gfSxcblx0ZmllbGRHcm91cFByb3BlcnR5PzogRGF0YUZpZWxkQWJzdHJhY3RUeXBlc1xuKTogQ29tcGxleFByb3BlcnR5SW5mbyB7XG5cdC8qKlxuXHQgKiBIZWxwZXIgdG8gcHVzaCB1bmlxdWUgcmVsYXRlZCBwcm9wZXJ0aWVzLlxuXHQgKlxuXHQgKiBAcGFyYW0ga2V5IFRoZSBwcm9wZXJ0eSBwYXRoXG5cdCAqIEBwYXJhbSBwcm9wZXJ0aWVzIFRoZSBwcm9wZXJ0aWVzIG9iamVjdCBjb250YWluaW5nIHZhbHVlIHByb3BlcnR5LCBkZXNjcmlwdGlvbiBwcm9wZXJ0eS4uLlxuXHQgKiBAcmV0dXJucyBJbmRleCBhdCB3aGljaCB0aGUgcHJvcGVydHkgaXMgYXZhaWxhYmxlXG5cdCAqL1xuXHRmdW5jdGlvbiBfcHVzaFVuaXF1ZShrZXk6IHN0cmluZywgcHJvcGVydGllczogQ29sbGVjdGVkUHJvcGVydGllcyk6IG51bWJlciB7XG5cdFx0aWYgKCFyZWxhdGVkUHJvcGVydGllcy5wcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KGtleSkpIHtcblx0XHRcdHJlbGF0ZWRQcm9wZXJ0aWVzLnByb3BlcnRpZXNba2V5XSA9IHByb3BlcnRpZXM7XG5cdFx0fVxuXHRcdHJldHVybiBPYmplY3Qua2V5cyhyZWxhdGVkUHJvcGVydGllcy5wcm9wZXJ0aWVzKS5pbmRleE9mKGtleSk7XG5cdH1cblxuXHQvKipcblx0ICogSGVscGVyIHRvIGFwcGVuZCB0aGUgZXhwb3J0IHNldHRpbmdzIHRlbXBsYXRlIHdpdGggYSBmb3JtYXR0ZWQgdGV4dC5cblx0ICpcblx0ICogQHBhcmFtIHZhbHVlIEZvcm1hdHRlZCB0ZXh0XG5cdCAqL1xuXHRmdW5jdGlvbiBfYXBwZW5kVGVtcGxhdGUodmFsdWU6IHN0cmluZykge1xuXHRcdHJlbGF0ZWRQcm9wZXJ0aWVzLmV4cG9ydFNldHRpbmdzVGVtcGxhdGUgPSByZWxhdGVkUHJvcGVydGllcy5leHBvcnRTZXR0aW5nc1RlbXBsYXRlXG5cdFx0XHQ/IGAke3JlbGF0ZWRQcm9wZXJ0aWVzLmV4cG9ydFNldHRpbmdzVGVtcGxhdGV9JHt2YWx1ZX1gXG5cdFx0XHQ6IGAke3ZhbHVlfWA7XG5cdH1cblxuXHRpZiAocGF0aCAmJiBwcm9wZXJ0eSkge1xuXHRcdGNvbnN0IG5hdmlnYXRpb25QYXRoUHJlZml4ID0gcGF0aC5pbmRleE9mKFwiL1wiKSA+IC0xID8gcGF0aC5zdWJzdHJpbmcoMCwgcGF0aC5sYXN0SW5kZXhPZihcIi9cIikgKyAxKSA6IFwiXCI7XG5cblx0XHQvLyBDaGVjayBmb3IgVGV4dCBhbm5vdGF0aW9uLlxuXHRcdGNvbnN0IHRleHRBbm5vdGF0aW9uID0gcHJvcGVydHkuYW5ub3RhdGlvbnM/LkNvbW1vbj8uVGV4dDtcblx0XHRsZXQgdmFsdWVJbmRleDogbnVtYmVyO1xuXHRcdGxldCBjdXJyZW5jeU9yVW9NSW5kZXg6IG51bWJlcjtcblxuXHRcdGlmIChyZWxhdGVkUHJvcGVydGllcy5leHBvcnRTZXR0aW5nc1RlbXBsYXRlKSB7XG5cdFx0XHQvLyBGaWVsZEdyb3VwIHVzZS1jYXNlLiBOZWVkIHRvIGFkZCBlYWNoIEZpZWxkIGluIG5ldyBsaW5lLlxuXHRcdFx0X2FwcGVuZFRlbXBsYXRlKFwiXFxuXCIpO1xuXHRcdH1cblxuXHRcdGlmICh0ZXh0QW5ub3RhdGlvbj8ucGF0aCAmJiB0ZXh0QW5ub3RhdGlvbj8uJHRhcmdldCkge1xuXHRcdFx0Ly8gQ2hlY2sgZm9yIFRleHQgQXJyYW5nZW1lbnQuXG5cdFx0XHRjb25zdCBkYXRhTW9kZWxPYmplY3RQYXRoID0gY29udmVydGVyQ29udGV4dC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCk7XG5cdFx0XHRjb25zdCB0ZXh0QW5ub3RhdGlvblByb3BlcnR5UGF0aCA9IG5hdmlnYXRpb25QYXRoUHJlZml4ICsgdGV4dEFubm90YXRpb24ucGF0aDtcblx0XHRcdGNvbnN0IGRpc3BsYXlNb2RlID0gZ2V0RGlzcGxheU1vZGUocHJvcGVydHkgYXMgUHJvcGVydHlPclBhdGg8UHJvcGVydHk+LCBkYXRhTW9kZWxPYmplY3RQYXRoKTtcblx0XHRcdGxldCBkZXNjcmlwdGlvbkluZGV4OiBudW1iZXI7XG5cdFx0XHRzd2l0Y2ggKGRpc3BsYXlNb2RlKSB7XG5cdFx0XHRcdGNhc2UgXCJWYWx1ZVwiOlxuXHRcdFx0XHRcdHZhbHVlSW5kZXggPSBfcHVzaFVuaXF1ZShwYXRoLCB7IHZhbHVlOiBwcm9wZXJ0eSwgZmllbGRHcm91cDogZmllbGRHcm91cFByb3BlcnR5IH0pO1xuXHRcdFx0XHRcdF9hcHBlbmRUZW1wbGF0ZShgeyR7dmFsdWVJbmRleH19YCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSBcIkRlc2NyaXB0aW9uXCI6XG5cdFx0XHRcdFx0ZGVzY3JpcHRpb25JbmRleCA9IF9wdXNoVW5pcXVlKHRleHRBbm5vdGF0aW9uUHJvcGVydHlQYXRoLCB7XG5cdFx0XHRcdFx0XHR2YWx1ZTogdGV4dEFubm90YXRpb24uJHRhcmdldCxcblx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBwcm9wZXJ0eSxcblx0XHRcdFx0XHRcdGZpZWxkR3JvdXA6IGZpZWxkR3JvdXBQcm9wZXJ0eVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdC8vIEtlZXAgdmFsdWUgd2hlbiBleHBvcnRpbmcgKHNwbGl0IG1vZGUpIG9uIHRleHQgQXJyYW5nZW1lbnQgZGVmaW5lZCBhcyAjVGV4dE9ubHkgKE9ubHkgdmFsdWVzIGFyZSBleHBlY3RlZCBvbiBwYXN0ZSBmcm9tIEV4Y2VsIGZ1bmN0aW9uYWxpdHkpXG5cdFx0XHRcdFx0X3B1c2hVbmlxdWUocGF0aCwgeyB2YWx1ZTogcHJvcGVydHksIGZpZWxkR3JvdXA6IGZpZWxkR3JvdXBQcm9wZXJ0eSB9KTtcblx0XHRcdFx0XHRfYXBwZW5kVGVtcGxhdGUoYHske2Rlc2NyaXB0aW9uSW5kZXh9fWApO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgXCJWYWx1ZURlc2NyaXB0aW9uXCI6XG5cdFx0XHRcdFx0dmFsdWVJbmRleCA9IF9wdXNoVW5pcXVlKHBhdGgsIHsgdmFsdWU6IHByb3BlcnR5LCBmaWVsZEdyb3VwOiBmaWVsZEdyb3VwUHJvcGVydHkgfSk7XG5cdFx0XHRcdFx0ZGVzY3JpcHRpb25JbmRleCA9IF9wdXNoVW5pcXVlKHRleHRBbm5vdGF0aW9uUHJvcGVydHlQYXRoLCB7XG5cdFx0XHRcdFx0XHR2YWx1ZTogdGV4dEFubm90YXRpb24uJHRhcmdldCxcblx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBwcm9wZXJ0eSxcblx0XHRcdFx0XHRcdGZpZWxkR3JvdXA6IGZpZWxkR3JvdXBQcm9wZXJ0eVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdF9hcHBlbmRUZW1wbGF0ZShgeyR7dmFsdWVJbmRleH19ICh7JHtkZXNjcmlwdGlvbkluZGV4fX0pYCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSBcIkRlc2NyaXB0aW9uVmFsdWVcIjpcblx0XHRcdFx0XHRkZXNjcmlwdGlvbkluZGV4ID0gX3B1c2hVbmlxdWUodGV4dEFubm90YXRpb25Qcm9wZXJ0eVBhdGgsIHtcblx0XHRcdFx0XHRcdHZhbHVlOiB0ZXh0QW5ub3RhdGlvbi4kdGFyZ2V0LFxuXHRcdFx0XHRcdFx0ZGVzY3JpcHRpb246IHByb3BlcnR5LFxuXHRcdFx0XHRcdFx0ZmllbGRHcm91cDogZmllbGRHcm91cFByb3BlcnR5XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0dmFsdWVJbmRleCA9IF9wdXNoVW5pcXVlKHBhdGgsIHsgdmFsdWU6IHByb3BlcnR5LCBmaWVsZEdyb3VwOiBmaWVsZEdyb3VwUHJvcGVydHkgfSk7XG5cdFx0XHRcdFx0X2FwcGVuZFRlbXBsYXRlKGB7JHtkZXNjcmlwdGlvbkluZGV4fX0gKHske3ZhbHVlSW5kZXh9fSlgKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gQ2hlY2sgZm9yIGZpZWxkIGNvbnRhaW5pbmcgQ3VycmVuY3kgT3IgVW5pdCBQcm9wZXJ0aWVzLlxuXHRcdFx0Y29uc3QgY3VycmVuY3lPclVvTVByb3BlcnR5ID0gZ2V0QXNzb2NpYXRlZEN1cnJlbmN5UHJvcGVydHkocHJvcGVydHkpIHx8IGdldEFzc29jaWF0ZWRVbml0UHJvcGVydHkocHJvcGVydHkpO1xuXHRcdFx0Y29uc3QgY3VycmVuY3lPclVuaXRBbm5vdGF0aW9uID0gcHJvcGVydHk/LmFubm90YXRpb25zPy5NZWFzdXJlcz8uSVNPQ3VycmVuY3kgfHwgcHJvcGVydHk/LmFubm90YXRpb25zPy5NZWFzdXJlcz8uVW5pdDtcblx0XHRcdGlmIChjdXJyZW5jeU9yVW9NUHJvcGVydHkgJiYgY3VycmVuY3lPclVuaXRBbm5vdGF0aW9uPy4kdGFyZ2V0KSB7XG5cdFx0XHRcdHZhbHVlSW5kZXggPSBfcHVzaFVuaXF1ZShwYXRoLCB7IHZhbHVlOiBwcm9wZXJ0eSB9KTtcblx0XHRcdFx0Y3VycmVuY3lPclVvTUluZGV4ID0gX3B1c2hVbmlxdWUoY3VycmVuY3lPclVvTVByb3BlcnR5Lm5hbWUsIHsgdmFsdWU6IGN1cnJlbmN5T3JVbml0QW5ub3RhdGlvbi4kdGFyZ2V0IH0pO1xuXHRcdFx0XHRfYXBwZW5kVGVtcGxhdGUoYHske3ZhbHVlSW5kZXh9fSAgeyR7Y3VycmVuY3lPclVvTUluZGV4fX1gKTtcblx0XHRcdH0gZWxzZSBpZiAocHJvcGVydHkuVGFyZ2V0Py4kdGFyZ2V0Py5WaXN1YWxpemF0aW9uKSB7XG5cdFx0XHRcdC8vIERhdGFQb2ludCB1c2UtY2FzZS4gTmVlZCB0byBpbmNsdWRlIHRhcmdldFZhbHVlIHRvIHRoZSB0ZW1wbGF0ZS5cblx0XHRcdFx0dmFsdWVJbmRleCA9IF9wdXNoVW5pcXVlKHBhdGgsIHsgdmFsdWU6IHByb3BlcnR5LlRhcmdldC4kdGFyZ2V0LlZhbHVlPy4kdGFyZ2V0LCBmaWVsZEdyb3VwOiBmaWVsZEdyb3VwUHJvcGVydHkgfSk7XG5cdFx0XHRcdC8vIE5lZWQgdG8gY3JlYXRlIGEgbmV3IGZha2UgcHJvcGVydHkgY29udGFpbmluZyB0aGUgUmF0aW5nIFRhcmdldCBWYWx1ZS5cblx0XHRcdFx0Ly8gSXQnbGwgYmUgdXNlZCBmb3IgdGhlIGV4cG9ydCBvbiBzcGxpdCBtb2RlLlxuXHRcdFx0XHRfcHVzaFVuaXF1ZShwcm9wZXJ0eS5UYXJnZXQudmFsdWUsIHsgdmFsdWU6IHByb3BlcnR5LCBmaWVsZEdyb3VwOiBmaWVsZEdyb3VwUHJvcGVydHkgfSk7XG5cdFx0XHRcdF9hcHBlbmRUZW1wbGF0ZShgeyR7dmFsdWVJbmRleH19LyR7cHJvcGVydHkuVGFyZ2V0LiR0YXJnZXQuVGFyZ2V0VmFsdWV9YCk7XG5cdFx0XHR9IGVsc2UgaWYgKCFpZ25vcmVTZWxmKSB7XG5cdFx0XHRcdC8vIENvbGxlY3QgdW5kZXJseWluZyBwcm9wZXJ0eVxuXHRcdFx0XHR2YWx1ZUluZGV4ID0gX3B1c2hVbmlxdWUocGF0aCwgeyB2YWx1ZTogcHJvcGVydHksIGZpZWxkR3JvdXA6IGZpZWxkR3JvdXBQcm9wZXJ0eSB9KTtcblx0XHRcdFx0X2FwcGVuZFRlbXBsYXRlKGB7JHt2YWx1ZUluZGV4fX1gKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gcmVsYXRlZFByb3BlcnRpZXM7XG59XG5cbi8qKlxuICogQ29sbGVjdCBwcm9wZXJ0aWVzIGNvbnN1bWVkIGJ5IGEgRGF0YSBGaWVsZC5cbiAqIFRoaXMgaXMgZm9yIHBvcHVsYXRpbmcgdGhlIENvbXBsZXhQcm9wZXJ0eUluZm9zIG9mIHRoZSB0YWJsZSBkZWxlZ2F0ZS5cbiAqXG4gKiBAcGFyYW0gZGF0YUZpZWxkIHtEYXRhRmllbGRBYnN0cmFjdFR5cGVzfSBUaGUgRGF0YSBGaWVsZCBmb3Igd2hpY2ggdGhlIHByb3BlcnRpZXMgbmVlZCB0byBiZSBpZGVudGlmaWVkLlxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHQgVGhlIGNvbnZlcnRlciBjb250ZXh0XG4gKiBAcGFyYW0gcmVsYXRlZFByb3BlcnRpZXMge0NvbXBsZXhQcm9wZXJ0eUluZm99IFRoZSBwcm9wZXJ0aWVzIGlkZW50aWZpZWQgc28gZmFyLlxuICogQHBhcmFtIGZpZWxkR3JvdXBEYXRhRmllbGQge0RhdGFGaWVsZEFic3RyYWN0VHlwZXN9IFRoZSBGaWVsZEdyb3VwIGRhdGEgRmllbGQgdG8gd2hpY2ggdGhlIHByb3BlcnR5IGJlbG9uZ3MuXG4gKiBAcmV0dXJucyB7Q29tcGxleFByb3BlcnR5SW5mb30gVGhlIHByb3BlcnRpZXMgcmVsYXRlZCB0byB0aGUgRGF0YSBGaWVsZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbGxlY3RSZWxhdGVkUHJvcGVydGllc1JlY3Vyc2l2ZWx5KFxuXHRkYXRhRmllbGQ6IERhdGFGaWVsZEFic3RyYWN0VHlwZXMsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdHJlbGF0ZWRQcm9wZXJ0aWVzOiBDb21wbGV4UHJvcGVydHlJbmZvID0geyBwcm9wZXJ0aWVzOiB7fSB9LFxuXHRmaWVsZEdyb3VwRGF0YUZpZWxkPzogRGF0YUZpZWxkQWJzdHJhY3RUeXBlcyB8IHVuZGVmaW5lZFxuKTogQ29tcGxleFByb3BlcnR5SW5mbyB7XG5cdGlmIChkYXRhRmllbGQuJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZCAmJiBkYXRhRmllbGQuVmFsdWUpIHtcblx0XHRjb25zdCBwcm9wZXJ0eVBhdGggPSBkYXRhRmllbGQuVmFsdWU7XG5cdFx0cmVsYXRlZFByb3BlcnRpZXMgPSBjb2xsZWN0UmVsYXRlZFByb3BlcnRpZXMoXG5cdFx0XHRwcm9wZXJ0eVBhdGgucGF0aCxcblx0XHRcdHByb3BlcnR5UGF0aC4kdGFyZ2V0LFxuXHRcdFx0Y29udmVydGVyQ29udGV4dCxcblx0XHRcdGZhbHNlLFxuXHRcdFx0cmVsYXRlZFByb3BlcnRpZXMsXG5cdFx0XHRmaWVsZEdyb3VwRGF0YUZpZWxkXG5cdFx0KTtcblx0fSBlbHNlIGlmIChkYXRhRmllbGQuJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZEZvckFubm90YXRpb24pIHtcblx0XHRzd2l0Y2ggKGRhdGFGaWVsZC5UYXJnZXQ/LiR0YXJnZXQ/LiRUeXBlKSB7XG5cdFx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkZpZWxkR3JvdXBUeXBlOlxuXHRcdFx0XHRjb25zdCBmaWVsZEdyb3VwOiBEYXRhRmllbGRBYnN0cmFjdFR5cGVzIHwgdW5kZWZpbmVkID0gZGF0YUZpZWxkO1xuXHRcdFx0XHRkYXRhRmllbGQuVGFyZ2V0LiR0YXJnZXQuRGF0YT8uZm9yRWFjaCgoaW5uZXJEYXRhRmllbGQ6IERhdGFGaWVsZEFic3RyYWN0VHlwZXMpID0+IHtcblx0XHRcdFx0XHRyZWxhdGVkUHJvcGVydGllcyA9IGNvbGxlY3RSZWxhdGVkUHJvcGVydGllc1JlY3Vyc2l2ZWx5KFxuXHRcdFx0XHRcdFx0aW5uZXJEYXRhRmllbGQsXG5cdFx0XHRcdFx0XHRjb252ZXJ0ZXJDb250ZXh0LFxuXHRcdFx0XHRcdFx0cmVsYXRlZFByb3BlcnRpZXMsXG5cdFx0XHRcdFx0XHRmaWVsZEdyb3VwXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFQb2ludFR5cGU6XG5cdFx0XHRcdHJlbGF0ZWRQcm9wZXJ0aWVzID0gY29sbGVjdFJlbGF0ZWRQcm9wZXJ0aWVzKFxuXHRcdFx0XHRcdGRhdGFGaWVsZC5UYXJnZXQuJHRhcmdldC5WYWx1ZS5wYXRoLFxuXHRcdFx0XHRcdGRhdGFGaWVsZCxcblx0XHRcdFx0XHRjb252ZXJ0ZXJDb250ZXh0LFxuXHRcdFx0XHRcdGZhbHNlLFxuXHRcdFx0XHRcdHJlbGF0ZWRQcm9wZXJ0aWVzLFxuXHRcdFx0XHRcdGZpZWxkR3JvdXBEYXRhRmllbGRcblx0XHRcdFx0KTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHJlbGF0ZWRQcm9wZXJ0aWVzO1xufVxuIl19