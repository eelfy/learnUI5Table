sap.ui.define(["sap/fe/core/templating/UIFormatters", "sap/fe/core/templating/DataModelPathHelper", "sap/fe/core/helpers/BindingExpression", "sap/fe/core/templating/PropertyHelper", "sap/fe/core/formatters/ValueFormatter"], function (UIFormatters, DataModelPathHelper, BindingExpression, PropertyHelper, valueFormatters) {
  "use strict";

  var _exports = {};
  var getAssociatedTextPropertyPath = PropertyHelper.getAssociatedTextPropertyPath;
  var hasValueHelp = PropertyHelper.hasValueHelp;
  var getAssociatedCurrencyPropertyPath = PropertyHelper.getAssociatedCurrencyPropertyPath;
  var getAssociatedUnitPropertyPath = PropertyHelper.getAssociatedUnitPropertyPath;
  var isProperty = PropertyHelper.isProperty;
  var getAssociatedCurrencyProperty = PropertyHelper.getAssociatedCurrencyProperty;
  var getAssociatedUnitProperty = PropertyHelper.getAssociatedUnitProperty;
  var isPathExpression = PropertyHelper.isPathExpression;
  var bindingExpression = BindingExpression.bindingExpression;
  var constant = BindingExpression.constant;
  var compileBinding = BindingExpression.compileBinding;
  var transformRecursively = BindingExpression.transformRecursively;
  var addTypeInformation = BindingExpression.addTypeInformation;
  var formatResult = BindingExpression.formatResult;
  var annotationExpression = BindingExpression.annotationExpression;
  var getContextRelativeTargetObjectPath = DataModelPathHelper.getContextRelativeTargetObjectPath;
  var getPathRelativeLocation = DataModelPathHelper.getPathRelativeLocation;
  var enhanceDataModelPath = DataModelPathHelper.enhanceDataModelPath;
  var getDisplayMode = UIFormatters.getDisplayMode;

  /**
   * Recursively add the text arrangement to a binding expression.
   *
   * @param bindingExpression the binding expression to enhance
   * @param fullContextPath the current context path we're on (to properly resolve the text arrangement properties)
   * @returns an updated expression.
   */
  var addTextArrangementToBindingExpression = function (bindingExpression, fullContextPath) {
    return transformRecursively(bindingExpression, "Binding", function (expression) {
      var outExpression = expression;

      if (expression.modelName === undefined) {
        // In case of default model we then need to resolve the text arrangement property
        var oPropertyDataModelPath = enhanceDataModelPath(fullContextPath, expression.path);
        outExpression = getBindingWithTextArrangement(oPropertyDataModelPath, expression);
      }

      return outExpression;
    });
  };

  _exports.addTextArrangementToBindingExpression = addTextArrangementToBindingExpression;

  var getBindingWithUnitOrCurrency = function (oPropertyDataModelPath, propertyBindingExpression) {
    var _oPropertyDefinition$, _oPropertyDefinition$2;

    var oPropertyDefinition = oPropertyDataModelPath.targetObject;
    var unit = (_oPropertyDefinition$ = oPropertyDefinition.annotations) === null || _oPropertyDefinition$ === void 0 ? void 0 : (_oPropertyDefinition$2 = _oPropertyDefinition$.Measures) === null || _oPropertyDefinition$2 === void 0 ? void 0 : _oPropertyDefinition$2.Unit;
    var relativeLocation = getPathRelativeLocation(oPropertyDataModelPath.contextLocation, oPropertyDataModelPath.navigationProperties); //TODO we might want to do a format label of the unit

    propertyBindingExpression = formatWithTypeInformation(oPropertyDefinition, propertyBindingExpression);
    var output = propertyBindingExpression;

    if (unit) {
      output = addTypeInformation([propertyBindingExpression, formatWithTypeInformation(unit.$target, annotationExpression(unit, relativeLocation))], "sap.ui.model.odata.type.Unit");
    } else {
      var _oPropertyDefinition$3, _oPropertyDefinition$4;

      var currency = (_oPropertyDefinition$3 = oPropertyDefinition.annotations) === null || _oPropertyDefinition$3 === void 0 ? void 0 : (_oPropertyDefinition$4 = _oPropertyDefinition$3.Measures) === null || _oPropertyDefinition$4 === void 0 ? void 0 : _oPropertyDefinition$4.ISOCurrency;

      if (currency) {
        output = addTypeInformation([propertyBindingExpression, annotationExpression(currency, relativeLocation)], "sap.ui.model.odata.type.Currency");
      }
    }

    return output;
  };

  _exports.getBindingWithUnitOrCurrency = getBindingWithUnitOrCurrency;

  var getBindingWithTextArrangement = function (oPropertyDataModelPath, propertyBindingExpression, formatOptions) {
    var _oPropertyDefinition$5, _oPropertyDefinition$6;

    var targetDisplayModeOverride = formatOptions === null || formatOptions === void 0 ? void 0 : formatOptions.displayMode;
    var outExpression = propertyBindingExpression;
    var oPropertyDefinition = oPropertyDataModelPath.targetObject;
    var expressionFormatOptions;

    if (oPropertyDefinition.type === "Edm.Date" && (formatOptions === null || formatOptions === void 0 ? void 0 : formatOptions.valueFormat)) {
      expressionFormatOptions = {
        style: formatOptions.valueFormat
      };
    }

    var targetDisplayMode = targetDisplayModeOverride || getDisplayMode(oPropertyDefinition, oPropertyDataModelPath);
    var commonText = (_oPropertyDefinition$5 = oPropertyDefinition.annotations) === null || _oPropertyDefinition$5 === void 0 ? void 0 : (_oPropertyDefinition$6 = _oPropertyDefinition$5.Common) === null || _oPropertyDefinition$6 === void 0 ? void 0 : _oPropertyDefinition$6.Text;
    var relativeLocation = getPathRelativeLocation(oPropertyDataModelPath.contextLocation, oPropertyDataModelPath.navigationProperties);
    propertyBindingExpression = formatWithTypeInformation(oPropertyDefinition, propertyBindingExpression, expressionFormatOptions);

    if (targetDisplayMode !== "Value" && commonText) {
      switch (targetDisplayMode) {
        case "Description":
          outExpression = annotationExpression(commonText, relativeLocation);
          break;

        case "DescriptionValue":
          outExpression = formatResult([annotationExpression(commonText, relativeLocation), propertyBindingExpression], valueFormatters.formatWithBrackets);
          break;

        case "ValueDescription":
          outExpression = formatResult([propertyBindingExpression, annotationExpression(commonText, relativeLocation)], valueFormatters.formatWithBrackets);
          break;
      }
    }

    return outExpression;
  };

  _exports.getBindingWithTextArrangement = getBindingWithTextArrangement;

  var formatValueRecursively = function (bindingExpression, fullContextPath) {
    return transformRecursively(bindingExpression, "Binding", function (expression) {
      var outExpression = expression;

      if (expression.modelName === undefined) {
        // In case of default model we then need to resolve the text arrangement property
        var oPropertyDataModelPath = enhanceDataModelPath(fullContextPath, expression.path);
        outExpression = formatWithTypeInformation(oPropertyDataModelPath.targetObject, expression);
      }

      return outExpression;
    });
  };

  _exports.formatValueRecursively = formatValueRecursively;
  var EDM_TYPE_MAPPING = {
    "Edm.Boolean": {
      type: "sap.ui.model.odata.type.Boolean"
    },
    "Edm.Byte": {
      type: "sap.ui.model.odata.type.Byte"
    },
    "Edm.Date": {
      type: "sap.ui.model.odata.type.Date"
    },
    "Edm.DateTimeOffset": {
      constraints: {
        "$Precision": "precision"
      },
      type: "sap.ui.model.odata.type.DateTimeOffset"
    },
    "Edm.Decimal": {
      constraints: {
        "@Org.OData.Validation.V1.Minimum/$Decimal": "minimum",
        "@Org.OData.Validation.V1.Minimum@Org.OData.Validation.V1.Exclusive": "minimumExclusive",
        "@Org.OData.Validation.V1.Maximum/$Decimal": "maximum",
        "@Org.OData.Validation.V1.Maximum@Org.OData.Validation.V1.Exclusive": "maximumExclusive",
        "$Precision": "precision",
        "$Scale": "scale"
      },
      type: "sap.ui.model.odata.type.Decimal"
    },
    "Edm.Double": {
      type: "sap.ui.model.odata.type.Double"
    },
    "Edm.Guid": {
      type: "sap.ui.model.odata.type.Guid"
    },
    "Edm.Int16": {
      type: "sap.ui.model.odata.type.Int16"
    },
    "Edm.Int32": {
      type: "sap.ui.model.odata.type.Int32"
    },
    "Edm.Int64": {
      type: "sap.ui.model.odata.type.Int64"
    },
    "Edm.SByte": {
      type: "sap.ui.model.odata.type.SByte"
    },
    "Edm.Single": {
      type: "sap.ui.model.odata.type.Single"
    },
    "Edm.Stream": {
      type: "sap.ui.model.odata.type.Stream"
    },
    "Edm.String": {
      constraints: {
        "@com.sap.vocabularies.Common.v1.IsDigitSequence": "isDigitSequence",
        "$MaxLength": "maxLength",
        "$Nullable": "nullable"
      },
      type: "sap.ui.model.odata.type.String"
    },
    "Edm.TimeOfDay": {
      constraints: {
        "$Precision": "precision"
      },
      type: "sap.ui.model.odata.type.TimeOfDay"
    }
  };

  var formatWithTypeInformation = function (oProperty, propertyBindingExpression, expressionFormatOptions) {
    var outExpression = propertyBindingExpression;

    if (oProperty._type === "Property") {
      var oTargetMapping = EDM_TYPE_MAPPING[oProperty.type];

      if (oTargetMapping) {
        outExpression.type = oTargetMapping.type;

        if (oTargetMapping.constraints) {
          outExpression.constraints = {};

          if (oTargetMapping.constraints.$Scale && oProperty.scale !== undefined) {
            outExpression.constraints.scale = oProperty.scale;
          }

          if (oTargetMapping.constraints.$Precision && oProperty.precision !== undefined) {
            outExpression.constraints.precision = oProperty.precision;
          }

          if (oTargetMapping.constraints.$MaxLength && oProperty.maxLength !== undefined) {
            outExpression.constraints.maxLength = oProperty.maxLength;
          }

          if (oTargetMapping.constraints.$Nullable && oProperty.nullable === false) {
            outExpression.constraints.nullable = oProperty.nullable;
          }
        }

        if (expressionFormatOptions && outExpression.type === "sap.ui.model.odata.type.Date") {
          outExpression.formatOptions = expressionFormatOptions;
        }

        if (outExpression.type === "sap.ui.model.odata.type.String") {
          if (!outExpression.formatOptions) {
            outExpression.formatOptions = {};
          }

          outExpression.formatOptions.parseKeepsEmptyString = true;
        }
      }
    }

    return outExpression;
  };

  _exports.formatWithTypeInformation = formatWithTypeInformation;

  var getTextBinding = function (oPropertyDataModelObjectPath, formatOptions) {
    var _oPropertyDataModelOb, _oPropertyDataModelOb2, _oPropertyDataModelOb3, _oPropertyDataModelOb4;

    if (((_oPropertyDataModelOb = oPropertyDataModelObjectPath.targetObject) === null || _oPropertyDataModelOb === void 0 ? void 0 : _oPropertyDataModelOb.$Type) === "com.sap.vocabularies.UI.v1.DataField" || ((_oPropertyDataModelOb2 = oPropertyDataModelObjectPath.targetObject) === null || _oPropertyDataModelOb2 === void 0 ? void 0 : _oPropertyDataModelOb2.$Type) === "com.sap.vocabularies.UI.v1.DataPointType" || ((_oPropertyDataModelOb3 = oPropertyDataModelObjectPath.targetObject) === null || _oPropertyDataModelOb3 === void 0 ? void 0 : _oPropertyDataModelOb3.$Type) === "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath" || ((_oPropertyDataModelOb4 = oPropertyDataModelObjectPath.targetObject) === null || _oPropertyDataModelOb4 === void 0 ? void 0 : _oPropertyDataModelOb4.$Type) === "com.sap.vocabularies.UI.v1.DataFieldWithUrl") {
      // there is no resolved property so we return the value has a constant
      var fieldValue = oPropertyDataModelObjectPath.targetObject.Value || "";
      return compileBinding(constant(fieldValue));
    }

    if (isPathExpression(oPropertyDataModelObjectPath.targetObject) && oPropertyDataModelObjectPath.targetObject.$target) {
      var oNavPath = oPropertyDataModelObjectPath.targetEntityType.resolvePath(oPropertyDataModelObjectPath.targetObject.path, true);
      oPropertyDataModelObjectPath.targetObject = oNavPath.target;
      oNavPath.visitedObjects.forEach(function (oNavObj) {
        if (oNavObj && oNavObj._type === "NavigationProperty") {
          oPropertyDataModelObjectPath.navigationProperties.push(oNavObj);
        }
      });
    }

    var oBindingExpression = bindingExpression(getContextRelativeTargetObjectPath(oPropertyDataModelObjectPath));
    var oPropertyUnit = getAssociatedUnitProperty(oPropertyDataModelObjectPath.targetObject);
    var oPropertyCurrency = getAssociatedCurrencyProperty(oPropertyDataModelObjectPath.targetObject);
    var oTargetBinding;

    if (oPropertyUnit || oPropertyCurrency) {
      oTargetBinding = getBindingWithUnitOrCurrency(oPropertyDataModelObjectPath, oBindingExpression);
    } else {
      oTargetBinding = getBindingWithTextArrangement(oPropertyDataModelObjectPath, oBindingExpression, formatOptions);
    } // We don't include $$nopatch and parseKeepEmptyString as they make no sense in the text binding case


    return compileBinding(oTargetBinding);
  };

  _exports.getTextBinding = getTextBinding;

  var getValueBinding = function (oPropertyDataModelObjectPath, formatOptions) {
    var ignoreUnit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var ignoreFormatting = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var bindingParameters = arguments.length > 4 ? arguments[4] : undefined;
    var targetTypeAny = arguments.length > 5 ? arguments[5] : undefined;

    if (isPathExpression(oPropertyDataModelObjectPath.targetObject) && oPropertyDataModelObjectPath.targetObject.$target) {
      var oNavPath = oPropertyDataModelObjectPath.targetEntityType.resolvePath(oPropertyDataModelObjectPath.targetObject.path, true);
      oPropertyDataModelObjectPath.targetObject = oNavPath.target;
      oNavPath.visitedObjects.forEach(function (oNavObj) {
        if (oNavObj && oNavObj._type === "NavigationProperty") {
          oPropertyDataModelObjectPath.navigationProperties.push(oNavObj);
        }
      });
    }

    var targetObject = oPropertyDataModelObjectPath.targetObject;

    if (isProperty(targetObject)) {
      var _targetObject$annotat, _targetObject$annotat2;

      var oBindingExpression = bindingExpression(getContextRelativeTargetObjectPath(oPropertyDataModelObjectPath));

      if ((_targetObject$annotat = targetObject.annotations) === null || _targetObject$annotat === void 0 ? void 0 : (_targetObject$annotat2 = _targetObject$annotat.Communication) === null || _targetObject$annotat2 === void 0 ? void 0 : _targetObject$annotat2.IsEmailAddress) {
        oBindingExpression.type = "sap.fe.core.type.Email";
      } else {
        var oPropertyUnit = getAssociatedUnitProperty(oPropertyDataModelObjectPath.targetObject);
        var oPropertyCurrency = getAssociatedCurrencyProperty(oPropertyDataModelObjectPath.targetObject);

        if (!ignoreUnit && (oPropertyUnit || oPropertyCurrency)) {
          oBindingExpression = getBindingWithUnitOrCurrency(oPropertyDataModelObjectPath, oBindingExpression);

          if (oPropertyUnit && !hasValueHelp(oPropertyUnit) || oPropertyCurrency && !hasValueHelp(oPropertyCurrency)) {
            // If there is a unit or currency without a value help we need to configure the binding to not show the measure, otherwise it's needed for the mdc field
            oBindingExpression.formatOptions = {
              showMeasure: false
            };
          }
        } else {
          oBindingExpression = formatWithTypeInformation(targetObject, oBindingExpression);

          if (oBindingExpression.type === "sap.ui.model.odata.type.String") {
            oBindingExpression.formatOptions = {
              parseKeepsEmptyString: true
            };
          }
        }
      }

      if (ignoreFormatting) {
        delete oBindingExpression.formatOptions;
        delete oBindingExpression.constraints;
        delete oBindingExpression.type;
      }

      if (bindingParameters) {
        oBindingExpression.parameters = bindingParameters;
      }

      if (targetTypeAny) {
        oBindingExpression.targetType = "any";
      }

      return compileBinding(oBindingExpression);
    } else {
      if (targetObject && targetObject.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithUrl") {
        return compileBinding(annotationExpression(targetObject.Value));
      } else {
        return "";
      }
    }
  };

  _exports.getValueBinding = getValueBinding;

  var getUnitBinding = function (oPropertyDataModelObjectPath, formatOptions) {
    var sUnitPropertyPath = getAssociatedUnitPropertyPath(oPropertyDataModelObjectPath.targetObject);
    var sCurrencyPropertyPath = getAssociatedCurrencyPropertyPath(oPropertyDataModelObjectPath.targetObject);

    if (sUnitPropertyPath || sCurrencyPropertyPath) {
      var targetPropertyPath = sUnitPropertyPath || sCurrencyPropertyPath;
      var oUOMPropertyDataModelObjectPath = enhanceDataModelPath(oPropertyDataModelObjectPath, targetPropertyPath);
      return getValueBinding(oUOMPropertyDataModelObjectPath, formatOptions);
    }

    return undefined;
  };

  _exports.getUnitBinding = getUnitBinding;

  var getAssociatedTextBinding = function (oPropertyDataModelObjectPath, formatOptions) {
    var textPropertyPath = getAssociatedTextPropertyPath(oPropertyDataModelObjectPath.targetObject);

    if (textPropertyPath) {
      var oTextPropertyPath = enhanceDataModelPath(oPropertyDataModelObjectPath, textPropertyPath);
      var oValueBinding = getValueBinding(oTextPropertyPath, formatOptions, true, true, {
        $$noPatch: true
      });
      return oValueBinding;
    }

    return undefined;
  };

  _exports.getAssociatedTextBinding = getAssociatedTextBinding;

  var getDisplayStyle = function (oPropertyPath, oDataField, oDataModelPath, formatOptions) {
    var _oProperty$annotation, _oProperty$annotation2, _oDataField$Target, _oDataField$Target$$t, _oDataField$Target2, _oDataField$Target2$$, _oProperty$annotation3, _oProperty$annotation4, _oProperty$annotation5, _oProperty$annotation6, _oProperty$annotation7, _oProperty$annotation8, _oDataModelPath$targe, _oDataModelPath$targe2, _oDataModelPath$targe3, _oDataModelPath$targe4, _oProperty$annotation9, _oProperty$annotation10, _oDataModelPath$targe8, _oDataModelPath$targe9, _oProperty$annotation11, _oProperty$annotation12;

    // algorithm to determine the field fragment to use
    if (!oPropertyPath || typeof oPropertyPath === "string") {
      return "Text";
    }

    var oProperty = isPathExpression(oPropertyPath) && oPropertyPath.$target || oPropertyPath;

    if ((_oProperty$annotation = oProperty.annotations) === null || _oProperty$annotation === void 0 ? void 0 : (_oProperty$annotation2 = _oProperty$annotation.UI) === null || _oProperty$annotation2 === void 0 ? void 0 : _oProperty$annotation2.IsImageURL) {
      return "Avatar";
    }

    if (oProperty.type === "Edm.Stream") {
      return "Avatar";
    }

    switch (oDataField.$Type) {
      case "com.sap.vocabularies.UI.v1.DataPointType":
        return "DataPoint";

      case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
        if (((_oDataField$Target = oDataField.Target) === null || _oDataField$Target === void 0 ? void 0 : (_oDataField$Target$$t = _oDataField$Target.$target) === null || _oDataField$Target$$t === void 0 ? void 0 : _oDataField$Target$$t.$Type) === "com.sap.vocabularies.UI.v1.DataPointType") {
          return "DataPoint";
        } else if (((_oDataField$Target2 = oDataField.Target) === null || _oDataField$Target2 === void 0 ? void 0 : (_oDataField$Target2$$ = _oDataField$Target2.$target) === null || _oDataField$Target2$$ === void 0 ? void 0 : _oDataField$Target2$$.$Type) === "com.sap.vocabularies.Communication.v1.ContactType") {
          return "Contact";
        }

        break;

      case "com.sap.vocabularies.UI.v1.DataFieldForAction":
      case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
        return "Button";

      case "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":
        return "Link";
    }

    if (oDataField.Criticality) {
      return "ObjectStatus";
    }

    if ((_oProperty$annotation3 = oProperty.annotations) === null || _oProperty$annotation3 === void 0 ? void 0 : (_oProperty$annotation4 = _oProperty$annotation3.Measures) === null || _oProperty$annotation4 === void 0 ? void 0 : _oProperty$annotation4.ISOCurrency) {
      return "AmountWithCurrency";
    }

    if (((_oProperty$annotation5 = oProperty.annotations) === null || _oProperty$annotation5 === void 0 ? void 0 : (_oProperty$annotation6 = _oProperty$annotation5.Communication) === null || _oProperty$annotation6 === void 0 ? void 0 : _oProperty$annotation6.IsEmailAddress) || ((_oProperty$annotation7 = oProperty.annotations) === null || _oProperty$annotation7 === void 0 ? void 0 : (_oProperty$annotation8 = _oProperty$annotation7.Communication) === null || _oProperty$annotation8 === void 0 ? void 0 : _oProperty$annotation8.IsPhoneNumber)) {
      return "Link";
    }

    if (oDataModelPath === null || oDataModelPath === void 0 ? void 0 : (_oDataModelPath$targe = oDataModelPath.targetEntitySet) === null || _oDataModelPath$targe === void 0 ? void 0 : (_oDataModelPath$targe2 = _oDataModelPath$targe.entityType) === null || _oDataModelPath$targe2 === void 0 ? void 0 : (_oDataModelPath$targe3 = _oDataModelPath$targe2.annotations) === null || _oDataModelPath$targe3 === void 0 ? void 0 : (_oDataModelPath$targe4 = _oDataModelPath$targe3.Common) === null || _oDataModelPath$targe4 === void 0 ? void 0 : _oDataModelPath$targe4.SemanticKey) {
      var aSemanticKeys = oDataModelPath.targetEntitySet.entityType.annotations.Common.SemanticKey;
      var bIsSemanticKey = !aSemanticKeys.every(function (oKey) {
        var _oKey$$target;

        return (oKey === null || oKey === void 0 ? void 0 : (_oKey$$target = oKey.$target) === null || _oKey$$target === void 0 ? void 0 : _oKey$$target.name) !== oProperty.name; // need to check if it works also for direct properties
      });

      if (bIsSemanticKey && formatOptions.semanticKeyStyle) {
        var _oDataModelPath$targe5, _oDataModelPath$targe6, _oDataModelPath$targe7;

        if ((_oDataModelPath$targe5 = oDataModelPath.targetEntitySet) === null || _oDataModelPath$targe5 === void 0 ? void 0 : (_oDataModelPath$targe6 = _oDataModelPath$targe5.annotations) === null || _oDataModelPath$targe6 === void 0 ? void 0 : (_oDataModelPath$targe7 = _oDataModelPath$targe6.Common) === null || _oDataModelPath$targe7 === void 0 ? void 0 : _oDataModelPath$targe7.DraftRoot) {
          // we then still check whether this is available at designtime on the entityset
          return "SemanticKeyWithDraftIndicator";
        }

        return formatOptions.semanticKeyStyle === "ObjectIdentifier" ? "ObjectIdentifier" : "LabelSemanticKey";
      }
    }

    if ((_oProperty$annotation9 = oProperty.annotations) === null || _oProperty$annotation9 === void 0 ? void 0 : (_oProperty$annotation10 = _oProperty$annotation9.UI) === null || _oProperty$annotation10 === void 0 ? void 0 : _oProperty$annotation10.MultiLineText) {
      return "Text";
    }

    var aNavigationProperties = (oDataModelPath === null || oDataModelPath === void 0 ? void 0 : (_oDataModelPath$targe8 = oDataModelPath.targetEntitySet) === null || _oDataModelPath$targe8 === void 0 ? void 0 : (_oDataModelPath$targe9 = _oDataModelPath$targe8.entityType) === null || _oDataModelPath$targe9 === void 0 ? void 0 : _oDataModelPath$targe9.navigationProperties) || [];
    var bIsUsedInNavigationWithQuickViewFacets = false;
    aNavigationProperties.forEach(function (oNavProp) {
      if (oNavProp.referentialConstraint && oNavProp.referentialConstraint.length) {
        oNavProp.referentialConstraint.forEach(function (oRefConstraint) {
          if ((oRefConstraint === null || oRefConstraint === void 0 ? void 0 : oRefConstraint.sourceProperty) === oProperty.name) {
            var _oNavProp$targetType, _oNavProp$targetType$, _oNavProp$targetType$2;

            if (oNavProp === null || oNavProp === void 0 ? void 0 : (_oNavProp$targetType = oNavProp.targetType) === null || _oNavProp$targetType === void 0 ? void 0 : (_oNavProp$targetType$ = _oNavProp$targetType.annotations) === null || _oNavProp$targetType$ === void 0 ? void 0 : (_oNavProp$targetType$2 = _oNavProp$targetType$.UI) === null || _oNavProp$targetType$2 === void 0 ? void 0 : _oNavProp$targetType$2.QuickViewFacets) {
              bIsUsedInNavigationWithQuickViewFacets = true;
            }
          }
        });
      }
    });

    if (bIsUsedInNavigationWithQuickViewFacets) {
      return "LinkWithQuickViewForm";
    }

    if ((_oProperty$annotation11 = oProperty.annotations) === null || _oProperty$annotation11 === void 0 ? void 0 : (_oProperty$annotation12 = _oProperty$annotation11.Common) === null || _oProperty$annotation12 === void 0 ? void 0 : _oProperty$annotation12.SemanticObject) {
      return "LinkWrapper";
    }

    if (oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithUrl") {
      return "Link";
    }

    return "Text";
  };

  _exports.getDisplayStyle = getDisplayStyle;

  var getEditStyle = function (oPropertyPath, oDataField) {
    var _oDataField$Target3, _oDataField$Target3$$, _oProperty$annotation13, _oProperty$annotation14, _oProperty$annotation15, _oProperty$annotation16, _oProperty$annotation17, _oProperty$annotation18;

    // algorithm to determine the field fragment to use
    if (!oPropertyPath || typeof oPropertyPath === "string") {
      return null;
    }

    var oProperty = isPathExpression(oPropertyPath) && oPropertyPath.$target || oPropertyPath;

    switch (oDataField.$Type) {
      case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
        if (((_oDataField$Target3 = oDataField.Target) === null || _oDataField$Target3 === void 0 ? void 0 : (_oDataField$Target3$$ = _oDataField$Target3.$target) === null || _oDataField$Target3$$ === void 0 ? void 0 : _oDataField$Target3$$.$Type) === "com.sap.vocabularies.Communication.v1.ContactType") {
          return null;
        }

        break;
      //case "com.sap.vocabularies.UI.v1.DataPointType":TODO special handling for rating indicator

      case "com.sap.vocabularies.UI.v1.DataFieldForAction":
      case "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":
      case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
        return null;
    }

    var oPropertyUnit = getAssociatedUnitProperty(oProperty);
    var oPropertyCurrency = getAssociatedCurrencyProperty(oProperty);

    if (PropertyHelper.hasValueHelp(oProperty) || oPropertyUnit && PropertyHelper.hasValueHelp(oPropertyUnit) || oPropertyCurrency && PropertyHelper.hasValueHelp(oPropertyCurrency)) {
      return "InputWithValueHelp";
    }

    if (((_oProperty$annotation13 = oProperty.annotations) === null || _oProperty$annotation13 === void 0 ? void 0 : (_oProperty$annotation14 = _oProperty$annotation13.UI) === null || _oProperty$annotation14 === void 0 ? void 0 : _oProperty$annotation14.MultiLineText) && oProperty.type === "Edm.String") {
      return "TextArea";
    }

    switch (oProperty.type) {
      case "Edm.Date":
        return "DatePicker";

      case "Edm.Time":
      case "Edm.TimeOfDay":
        return "TimePicker";

      case "Edm.DateTime":
      case "Edm.DateTimeOffset":
        return "DateTimePicker";

      case "Edm.Boolean":
        return "CheckBox";
    }

    if (((_oProperty$annotation15 = oProperty.annotations) === null || _oProperty$annotation15 === void 0 ? void 0 : (_oProperty$annotation16 = _oProperty$annotation15.Measures) === null || _oProperty$annotation16 === void 0 ? void 0 : _oProperty$annotation16.ISOCurrency) || ((_oProperty$annotation17 = oProperty.annotations) === null || _oProperty$annotation17 === void 0 ? void 0 : (_oProperty$annotation18 = _oProperty$annotation17.Measures) === null || _oProperty$annotation18 === void 0 ? void 0 : _oProperty$annotation18.Unit)) {
      return "InputWithUnit";
    }

    return "Input";
  };

  _exports.getEditStyle = getEditStyle;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZpZWxkVGVtcGxhdGluZy50cyJdLCJuYW1lcyI6WyJhZGRUZXh0QXJyYW5nZW1lbnRUb0JpbmRpbmdFeHByZXNzaW9uIiwiYmluZGluZ0V4cHJlc3Npb24iLCJmdWxsQ29udGV4dFBhdGgiLCJ0cmFuc2Zvcm1SZWN1cnNpdmVseSIsImV4cHJlc3Npb24iLCJvdXRFeHByZXNzaW9uIiwibW9kZWxOYW1lIiwidW5kZWZpbmVkIiwib1Byb3BlcnR5RGF0YU1vZGVsUGF0aCIsImVuaGFuY2VEYXRhTW9kZWxQYXRoIiwicGF0aCIsImdldEJpbmRpbmdXaXRoVGV4dEFycmFuZ2VtZW50IiwiZ2V0QmluZGluZ1dpdGhVbml0T3JDdXJyZW5jeSIsInByb3BlcnR5QmluZGluZ0V4cHJlc3Npb24iLCJvUHJvcGVydHlEZWZpbml0aW9uIiwidGFyZ2V0T2JqZWN0IiwidW5pdCIsImFubm90YXRpb25zIiwiTWVhc3VyZXMiLCJVbml0IiwicmVsYXRpdmVMb2NhdGlvbiIsImdldFBhdGhSZWxhdGl2ZUxvY2F0aW9uIiwiY29udGV4dExvY2F0aW9uIiwibmF2aWdhdGlvblByb3BlcnRpZXMiLCJmb3JtYXRXaXRoVHlwZUluZm9ybWF0aW9uIiwib3V0cHV0IiwiYWRkVHlwZUluZm9ybWF0aW9uIiwiJHRhcmdldCIsImFubm90YXRpb25FeHByZXNzaW9uIiwiY3VycmVuY3kiLCJJU09DdXJyZW5jeSIsImZvcm1hdE9wdGlvbnMiLCJ0YXJnZXREaXNwbGF5TW9kZU92ZXJyaWRlIiwiZGlzcGxheU1vZGUiLCJleHByZXNzaW9uRm9ybWF0T3B0aW9ucyIsInR5cGUiLCJ2YWx1ZUZvcm1hdCIsInN0eWxlIiwidGFyZ2V0RGlzcGxheU1vZGUiLCJnZXREaXNwbGF5TW9kZSIsImNvbW1vblRleHQiLCJDb21tb24iLCJUZXh0IiwiZm9ybWF0UmVzdWx0IiwidmFsdWVGb3JtYXR0ZXJzIiwiZm9ybWF0V2l0aEJyYWNrZXRzIiwiZm9ybWF0VmFsdWVSZWN1cnNpdmVseSIsIkVETV9UWVBFX01BUFBJTkciLCJjb25zdHJhaW50cyIsIm9Qcm9wZXJ0eSIsIl90eXBlIiwib1RhcmdldE1hcHBpbmciLCIkU2NhbGUiLCJzY2FsZSIsIiRQcmVjaXNpb24iLCJwcmVjaXNpb24iLCIkTWF4TGVuZ3RoIiwibWF4TGVuZ3RoIiwiJE51bGxhYmxlIiwibnVsbGFibGUiLCJwYXJzZUtlZXBzRW1wdHlTdHJpbmciLCJnZXRUZXh0QmluZGluZyIsIm9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgiLCIkVHlwZSIsImZpZWxkVmFsdWUiLCJWYWx1ZSIsImNvbXBpbGVCaW5kaW5nIiwiY29uc3RhbnQiLCJpc1BhdGhFeHByZXNzaW9uIiwib05hdlBhdGgiLCJ0YXJnZXRFbnRpdHlUeXBlIiwicmVzb2x2ZVBhdGgiLCJ0YXJnZXQiLCJ2aXNpdGVkT2JqZWN0cyIsImZvckVhY2giLCJvTmF2T2JqIiwicHVzaCIsIm9CaW5kaW5nRXhwcmVzc2lvbiIsImdldENvbnRleHRSZWxhdGl2ZVRhcmdldE9iamVjdFBhdGgiLCJvUHJvcGVydHlVbml0IiwiZ2V0QXNzb2NpYXRlZFVuaXRQcm9wZXJ0eSIsIm9Qcm9wZXJ0eUN1cnJlbmN5IiwiZ2V0QXNzb2NpYXRlZEN1cnJlbmN5UHJvcGVydHkiLCJvVGFyZ2V0QmluZGluZyIsImdldFZhbHVlQmluZGluZyIsImlnbm9yZVVuaXQiLCJpZ25vcmVGb3JtYXR0aW5nIiwiYmluZGluZ1BhcmFtZXRlcnMiLCJ0YXJnZXRUeXBlQW55IiwiaXNQcm9wZXJ0eSIsIkNvbW11bmljYXRpb24iLCJJc0VtYWlsQWRkcmVzcyIsImhhc1ZhbHVlSGVscCIsInNob3dNZWFzdXJlIiwicGFyYW1ldGVycyIsInRhcmdldFR5cGUiLCJnZXRVbml0QmluZGluZyIsInNVbml0UHJvcGVydHlQYXRoIiwiZ2V0QXNzb2NpYXRlZFVuaXRQcm9wZXJ0eVBhdGgiLCJzQ3VycmVuY3lQcm9wZXJ0eVBhdGgiLCJnZXRBc3NvY2lhdGVkQ3VycmVuY3lQcm9wZXJ0eVBhdGgiLCJ0YXJnZXRQcm9wZXJ0eVBhdGgiLCJvVU9NUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoIiwiZ2V0QXNzb2NpYXRlZFRleHRCaW5kaW5nIiwidGV4dFByb3BlcnR5UGF0aCIsImdldEFzc29jaWF0ZWRUZXh0UHJvcGVydHlQYXRoIiwib1RleHRQcm9wZXJ0eVBhdGgiLCJvVmFsdWVCaW5kaW5nIiwiJCRub1BhdGNoIiwiZ2V0RGlzcGxheVN0eWxlIiwib1Byb3BlcnR5UGF0aCIsIm9EYXRhRmllbGQiLCJvRGF0YU1vZGVsUGF0aCIsIlVJIiwiSXNJbWFnZVVSTCIsIlRhcmdldCIsIkNyaXRpY2FsaXR5IiwiSXNQaG9uZU51bWJlciIsInRhcmdldEVudGl0eVNldCIsImVudGl0eVR5cGUiLCJTZW1hbnRpY0tleSIsImFTZW1hbnRpY0tleXMiLCJiSXNTZW1hbnRpY0tleSIsImV2ZXJ5Iiwib0tleSIsIm5hbWUiLCJzZW1hbnRpY0tleVN0eWxlIiwiRHJhZnRSb290IiwiTXVsdGlMaW5lVGV4dCIsImFOYXZpZ2F0aW9uUHJvcGVydGllcyIsImJJc1VzZWRJbk5hdmlnYXRpb25XaXRoUXVpY2tWaWV3RmFjZXRzIiwib05hdlByb3AiLCJyZWZlcmVudGlhbENvbnN0cmFpbnQiLCJsZW5ndGgiLCJvUmVmQ29uc3RyYWludCIsInNvdXJjZVByb3BlcnR5IiwiUXVpY2tWaWV3RmFjZXRzIiwiU2VtYW50aWNPYmplY3QiLCJnZXRFZGl0U3R5bGUiLCJQcm9wZXJ0eUhlbHBlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0VBOzs7Ozs7O0FBT08sTUFBTUEscUNBQXFDLEdBQUcsVUFDcERDLGlCQURvRCxFQUVwREMsZUFGb0QsRUFHbEM7QUFDbEIsV0FBT0Msb0JBQW9CLENBQUNGLGlCQUFELEVBQW9CLFNBQXBCLEVBQStCLFVBQUNHLFVBQUQsRUFBa0Q7QUFDM0csVUFBSUMsYUFBOEIsR0FBR0QsVUFBckM7O0FBQ0EsVUFBSUEsVUFBVSxDQUFDRSxTQUFYLEtBQXlCQyxTQUE3QixFQUF3QztBQUN2QztBQUNB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dERpc3BsYXlNb2RlLCBQcm9wZXJ0eU9yUGF0aCwgRGlzcGxheU1vZGUgfSBmcm9tIFwic2FwL2ZlL2NvcmUvdGVtcGxhdGluZy9VSUZvcm1hdHRlcnNcIjtcbmltcG9ydCB7XG5cdERhdGFNb2RlbE9iamVjdFBhdGgsXG5cdGVuaGFuY2VEYXRhTW9kZWxQYXRoLFxuXHRnZXRQYXRoUmVsYXRpdmVMb2NhdGlvbixcblx0Z2V0Q29udGV4dFJlbGF0aXZlVGFyZ2V0T2JqZWN0UGF0aFxufSBmcm9tIFwic2FwL2ZlL2NvcmUvdGVtcGxhdGluZy9EYXRhTW9kZWxQYXRoSGVscGVyXCI7XG5pbXBvcnQgeyBQcm9wZXJ0eSB9IGZyb20gXCJAc2FwLXV4L2Fubm90YXRpb24tY29udmVydGVyXCI7XG5pbXBvcnQge1xuXHRFeHByZXNzaW9uLFxuXHRhbm5vdGF0aW9uRXhwcmVzc2lvbixcblx0Zm9ybWF0UmVzdWx0LFxuXHRhZGRUeXBlSW5mb3JtYXRpb24sXG5cdHRyYW5zZm9ybVJlY3Vyc2l2ZWx5LFxuXHRCaW5kaW5nRXhwcmVzc2lvbkV4cHJlc3Npb24sXG5cdEJpbmRpbmdFeHByZXNzaW9uLFxuXHRjb21waWxlQmluZGluZyxcblx0Y29uc3RhbnQsXG5cdGJpbmRpbmdFeHByZXNzaW9uXG59IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0JpbmRpbmdFeHByZXNzaW9uXCI7XG5pbXBvcnQge1xuXHRpc1BhdGhFeHByZXNzaW9uLFxuXHRnZXRBc3NvY2lhdGVkVW5pdFByb3BlcnR5LFxuXHRnZXRBc3NvY2lhdGVkQ3VycmVuY3lQcm9wZXJ0eSxcblx0aXNQcm9wZXJ0eSxcblx0Z2V0QXNzb2NpYXRlZFVuaXRQcm9wZXJ0eVBhdGgsXG5cdGdldEFzc29jaWF0ZWRDdXJyZW5jeVByb3BlcnR5UGF0aCxcblx0aGFzVmFsdWVIZWxwLFxuXHRnZXRBc3NvY2lhdGVkVGV4dFByb3BlcnR5UGF0aFxufSBmcm9tIFwic2FwL2ZlL2NvcmUvdGVtcGxhdGluZy9Qcm9wZXJ0eUhlbHBlclwiO1xuaW1wb3J0IHZhbHVlRm9ybWF0dGVycyBmcm9tIFwic2FwL2ZlL2NvcmUvZm9ybWF0dGVycy9WYWx1ZUZvcm1hdHRlclwiO1xuaW1wb3J0ICogYXMgUHJvcGVydHlIZWxwZXIgZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvUHJvcGVydHlIZWxwZXJcIjtcbmltcG9ydCB7IERhdGFGaWVsZFdpdGhVcmwsIFVJQW5ub3RhdGlvblR5cGVzIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzXCI7XG5cbmV4cG9ydCB0eXBlIEZvcm1hdE9wdGlvbnMgPSB7XG5cdHZhbHVlRm9ybWF0OiBTdHJpbmc7XG5cdHRleHRBbGlnbk1vZGU6IFN0cmluZztcblx0ZGlzcGxheU1vZGU6IERpc3BsYXlNb2RlO1xuXHR0ZXh0TGluZXNEaXNwbGF5OiBTdHJpbmc7XG5cdHRleHRMaW5lc0VkaXQ6IFN0cmluZztcblx0c2hvd0VtcHR5SW5kaWNhdG9yOiBib29sZWFuO1xuXHRzZW1hbnRpY0tleVN0eWxlOiBTdHJpbmc7XG5cdHNob3dJY29uVXJsOiBib29sZWFuO1xufTtcblxuZXhwb3J0IHR5cGUgRWRpdFN0eWxlID1cblx0fCBcIklucHV0V2l0aFZhbHVlSGVscFwiXG5cdHwgXCJUZXh0QXJlYVwiXG5cdHwgXCJEYXRlUGlja2VyXCJcblx0fCBcIlRpbWVQaWNrZXJcIlxuXHR8IFwiRGF0ZVRpbWVQaWNrZXJcIlxuXHR8IFwiQ2hlY2tCb3hcIlxuXHR8IFwiSW5wdXRXaXRoVW5pdFwiXG5cdHwgXCJJbnB1dFwiO1xuXG5leHBvcnQgdHlwZSBEaXNwbGF5U3R5bGUgPVxuXHR8IFwiVGV4dFwiXG5cdHwgXCJBdmF0YXJcIlxuXHR8IFwiRGF0YVBvaW50XCJcblx0fCBcIkNvbnRhY3RcIlxuXHR8IFwiQnV0dG9uXCJcblx0fCBcIkxpbmtcIlxuXHR8IFwiT2JqZWN0U3RhdHVzXCJcblx0fCBcIkFtb3VudFdpdGhDdXJyZW5jeVwiXG5cdHwgXCJTZW1hbnRpY0tleVdpdGhEcmFmdEluZGljYXRvclwiXG5cdHwgXCJPYmplY3RJZGVudGlmaWVyXCJcblx0fCBcIkxhYmVsU2VtYW50aWNLZXlcIlxuXHR8IFwiTGlua1dpdGhRdWlja1ZpZXdGb3JtXCJcblx0fCBcIkxpbmtXcmFwcGVyXCI7XG5cbi8qKlxuICogUmVjdXJzaXZlbHkgYWRkIHRoZSB0ZXh0IGFycmFuZ2VtZW50IHRvIGEgYmluZGluZyBleHByZXNzaW9uLlxuICpcbiAqIEBwYXJhbSBiaW5kaW5nRXhwcmVzc2lvbiB0aGUgYmluZGluZyBleHByZXNzaW9uIHRvIGVuaGFuY2VcbiAqIEBwYXJhbSBmdWxsQ29udGV4dFBhdGggdGhlIGN1cnJlbnQgY29udGV4dCBwYXRoIHdlJ3JlIG9uICh0byBwcm9wZXJseSByZXNvbHZlIHRoZSB0ZXh0IGFycmFuZ2VtZW50IHByb3BlcnRpZXMpXG4gKiBAcmV0dXJucyBhbiB1cGRhdGVkIGV4cHJlc3Npb24uXG4gKi9cbmV4cG9ydCBjb25zdCBhZGRUZXh0QXJyYW5nZW1lbnRUb0JpbmRpbmdFeHByZXNzaW9uID0gZnVuY3Rpb24oXG5cdGJpbmRpbmdFeHByZXNzaW9uOiBFeHByZXNzaW9uPGFueT4sXG5cdGZ1bGxDb250ZXh0UGF0aDogRGF0YU1vZGVsT2JqZWN0UGF0aFxuKTogRXhwcmVzc2lvbjxhbnk+IHtcblx0cmV0dXJuIHRyYW5zZm9ybVJlY3Vyc2l2ZWx5KGJpbmRpbmdFeHByZXNzaW9uLCBcIkJpbmRpbmdcIiwgKGV4cHJlc3Npb246IEJpbmRpbmdFeHByZXNzaW9uRXhwcmVzc2lvbjxhbnk+KSA9PiB7XG5cdFx0bGV0IG91dEV4cHJlc3Npb246IEV4cHJlc3Npb248YW55PiA9IGV4cHJlc3Npb247XG5cdFx0aWYgKGV4cHJlc3Npb24ubW9kZWxOYW1lID09PSB1bmRlZmluZWQpIHtcblx0XHRcdC8vIEluIGNhc2Ugb2YgZGVmYXVsdCBtb2RlbCB3ZSB0aGVuIG5lZWQgdG8gcmVzb2x2ZSB0aGUgdGV4dCBhcnJhbmdlbWVudCBwcm9wZXJ0eVxuXHRcdFx0Y29uc3Qgb1Byb3BlcnR5RGF0YU1vZGVsUGF0aCA9IGVuaGFuY2VEYXRhTW9kZWxQYXRoKGZ1bGxDb250ZXh0UGF0aCwgZXhwcmVzc2lvbi5wYXRoKTtcblx0XHRcdG91dEV4cHJlc3Npb24gPSBnZXRCaW5kaW5nV2l0aFRleHRBcnJhbmdlbWVudChvUHJvcGVydHlEYXRhTW9kZWxQYXRoLCBleHByZXNzaW9uKTtcblx0XHR9XG5cdFx0cmV0dXJuIG91dEV4cHJlc3Npb247XG5cdH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEJpbmRpbmdXaXRoVW5pdE9yQ3VycmVuY3kgPSBmdW5jdGlvbihcblx0b1Byb3BlcnR5RGF0YU1vZGVsUGF0aDogRGF0YU1vZGVsT2JqZWN0UGF0aCxcblx0cHJvcGVydHlCaW5kaW5nRXhwcmVzc2lvbjogRXhwcmVzc2lvbjxzdHJpbmc+XG4pOiBFeHByZXNzaW9uPHN0cmluZz4ge1xuXHRjb25zdCBvUHJvcGVydHlEZWZpbml0aW9uID0gb1Byb3BlcnR5RGF0YU1vZGVsUGF0aC50YXJnZXRPYmplY3QgYXMgUHJvcGVydHk7XG5cdGNvbnN0IHVuaXQgPSBvUHJvcGVydHlEZWZpbml0aW9uLmFubm90YXRpb25zPy5NZWFzdXJlcz8uVW5pdDtcblx0Y29uc3QgcmVsYXRpdmVMb2NhdGlvbiA9IGdldFBhdGhSZWxhdGl2ZUxvY2F0aW9uKG9Qcm9wZXJ0eURhdGFNb2RlbFBhdGguY29udGV4dExvY2F0aW9uLCBvUHJvcGVydHlEYXRhTW9kZWxQYXRoLm5hdmlnYXRpb25Qcm9wZXJ0aWVzKTtcblx0Ly9UT0RPIHdlIG1pZ2h0IHdhbnQgdG8gZG8gYSBmb3JtYXQgbGFiZWwgb2YgdGhlIHVuaXRcblx0cHJvcGVydHlCaW5kaW5nRXhwcmVzc2lvbiA9IGZvcm1hdFdpdGhUeXBlSW5mb3JtYXRpb24ob1Byb3BlcnR5RGVmaW5pdGlvbiwgcHJvcGVydHlCaW5kaW5nRXhwcmVzc2lvbik7XG5cdGxldCBvdXRwdXQgPSBwcm9wZXJ0eUJpbmRpbmdFeHByZXNzaW9uO1xuXHRpZiAodW5pdCkge1xuXHRcdG91dHB1dCA9IGFkZFR5cGVJbmZvcm1hdGlvbihcblx0XHRcdFtcblx0XHRcdFx0cHJvcGVydHlCaW5kaW5nRXhwcmVzc2lvbixcblx0XHRcdFx0Zm9ybWF0V2l0aFR5cGVJbmZvcm1hdGlvbigodW5pdCBhcyBhbnkpLiR0YXJnZXQsIGFubm90YXRpb25FeHByZXNzaW9uKHVuaXQsIHJlbGF0aXZlTG9jYXRpb24pIGFzIEV4cHJlc3Npb248c3RyaW5nPilcblx0XHRcdF0sXG5cdFx0XHRcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLlVuaXRcIlxuXHRcdCk7XG5cdH0gZWxzZSB7XG5cdFx0Y29uc3QgY3VycmVuY3kgPSBvUHJvcGVydHlEZWZpbml0aW9uLmFubm90YXRpb25zPy5NZWFzdXJlcz8uSVNPQ3VycmVuY3k7XG5cdFx0aWYgKGN1cnJlbmN5KSB7XG5cdFx0XHRvdXRwdXQgPSBhZGRUeXBlSW5mb3JtYXRpb24oXG5cdFx0XHRcdFtwcm9wZXJ0eUJpbmRpbmdFeHByZXNzaW9uLCBhbm5vdGF0aW9uRXhwcmVzc2lvbihjdXJyZW5jeSwgcmVsYXRpdmVMb2NhdGlvbikgYXMgRXhwcmVzc2lvbjxzdHJpbmc+XSxcblx0XHRcdFx0XCJzYXAudWkubW9kZWwub2RhdGEudHlwZS5DdXJyZW5jeVwiXG5cdFx0XHQpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gb3V0cHV0O1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEJpbmRpbmdXaXRoVGV4dEFycmFuZ2VtZW50ID0gZnVuY3Rpb24oXG5cdG9Qcm9wZXJ0eURhdGFNb2RlbFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgsXG5cdHByb3BlcnR5QmluZGluZ0V4cHJlc3Npb246IEV4cHJlc3Npb248c3RyaW5nPixcblx0Zm9ybWF0T3B0aW9ucz86IEZvcm1hdE9wdGlvbnNcbik6IEV4cHJlc3Npb248c3RyaW5nPiB7XG5cdGNvbnN0IHRhcmdldERpc3BsYXlNb2RlT3ZlcnJpZGUgPSBmb3JtYXRPcHRpb25zPy5kaXNwbGF5TW9kZTtcblx0bGV0IG91dEV4cHJlc3Npb24gPSBwcm9wZXJ0eUJpbmRpbmdFeHByZXNzaW9uO1xuXHRjb25zdCBvUHJvcGVydHlEZWZpbml0aW9uID0gb1Byb3BlcnR5RGF0YU1vZGVsUGF0aC50YXJnZXRPYmplY3QgYXMgUHJvcGVydHk7XG5cdGxldCBleHByZXNzaW9uRm9ybWF0T3B0aW9ucztcblx0aWYgKG9Qcm9wZXJ0eURlZmluaXRpb24udHlwZSA9PT0gXCJFZG0uRGF0ZVwiICYmIGZvcm1hdE9wdGlvbnM/LnZhbHVlRm9ybWF0KSB7XG5cdFx0ZXhwcmVzc2lvbkZvcm1hdE9wdGlvbnMgPSB7IHN0eWxlOiBmb3JtYXRPcHRpb25zLnZhbHVlRm9ybWF0IH07XG5cdH1cblx0Y29uc3QgdGFyZ2V0RGlzcGxheU1vZGUgPSB0YXJnZXREaXNwbGF5TW9kZU92ZXJyaWRlIHx8IGdldERpc3BsYXlNb2RlKG9Qcm9wZXJ0eURlZmluaXRpb24sIG9Qcm9wZXJ0eURhdGFNb2RlbFBhdGgpO1xuXHRjb25zdCBjb21tb25UZXh0ID0gb1Byb3BlcnR5RGVmaW5pdGlvbi5hbm5vdGF0aW9ucz8uQ29tbW9uPy5UZXh0O1xuXHRjb25zdCByZWxhdGl2ZUxvY2F0aW9uID0gZ2V0UGF0aFJlbGF0aXZlTG9jYXRpb24ob1Byb3BlcnR5RGF0YU1vZGVsUGF0aC5jb250ZXh0TG9jYXRpb24sIG9Qcm9wZXJ0eURhdGFNb2RlbFBhdGgubmF2aWdhdGlvblByb3BlcnRpZXMpO1xuXHRwcm9wZXJ0eUJpbmRpbmdFeHByZXNzaW9uID0gZm9ybWF0V2l0aFR5cGVJbmZvcm1hdGlvbihvUHJvcGVydHlEZWZpbml0aW9uLCBwcm9wZXJ0eUJpbmRpbmdFeHByZXNzaW9uLCBleHByZXNzaW9uRm9ybWF0T3B0aW9ucyk7XG5cdGlmICh0YXJnZXREaXNwbGF5TW9kZSAhPT0gXCJWYWx1ZVwiICYmIGNvbW1vblRleHQpIHtcblx0XHRzd2l0Y2ggKHRhcmdldERpc3BsYXlNb2RlKSB7XG5cdFx0XHRjYXNlIFwiRGVzY3JpcHRpb25cIjpcblx0XHRcdFx0b3V0RXhwcmVzc2lvbiA9IGFubm90YXRpb25FeHByZXNzaW9uKGNvbW1vblRleHQsIHJlbGF0aXZlTG9jYXRpb24pIGFzIEV4cHJlc3Npb248c3RyaW5nPjtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiRGVzY3JpcHRpb25WYWx1ZVwiOlxuXHRcdFx0XHRvdXRFeHByZXNzaW9uID0gZm9ybWF0UmVzdWx0KFxuXHRcdFx0XHRcdFthbm5vdGF0aW9uRXhwcmVzc2lvbihjb21tb25UZXh0LCByZWxhdGl2ZUxvY2F0aW9uKSBhcyBFeHByZXNzaW9uPHN0cmluZz4sIHByb3BlcnR5QmluZGluZ0V4cHJlc3Npb25dLFxuXHRcdFx0XHRcdHZhbHVlRm9ybWF0dGVycy5mb3JtYXRXaXRoQnJhY2tldHNcblx0XHRcdFx0KTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiVmFsdWVEZXNjcmlwdGlvblwiOlxuXHRcdFx0XHRvdXRFeHByZXNzaW9uID0gZm9ybWF0UmVzdWx0KFxuXHRcdFx0XHRcdFtwcm9wZXJ0eUJpbmRpbmdFeHByZXNzaW9uLCBhbm5vdGF0aW9uRXhwcmVzc2lvbihjb21tb25UZXh0LCByZWxhdGl2ZUxvY2F0aW9uKSBhcyBFeHByZXNzaW9uPHN0cmluZz5dLFxuXHRcdFx0XHRcdHZhbHVlRm9ybWF0dGVycy5mb3JtYXRXaXRoQnJhY2tldHNcblx0XHRcdFx0KTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBvdXRFeHByZXNzaW9uO1xufTtcblxuZXhwb3J0IGNvbnN0IGZvcm1hdFZhbHVlUmVjdXJzaXZlbHkgPSBmdW5jdGlvbihiaW5kaW5nRXhwcmVzc2lvbjogRXhwcmVzc2lvbjxhbnk+LCBmdWxsQ29udGV4dFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgpOiBFeHByZXNzaW9uPGFueT4ge1xuXHRyZXR1cm4gdHJhbnNmb3JtUmVjdXJzaXZlbHkoYmluZGluZ0V4cHJlc3Npb24sIFwiQmluZGluZ1wiLCAoZXhwcmVzc2lvbjogQmluZGluZ0V4cHJlc3Npb25FeHByZXNzaW9uPGFueT4pID0+IHtcblx0XHRsZXQgb3V0RXhwcmVzc2lvbjogRXhwcmVzc2lvbjxhbnk+ID0gZXhwcmVzc2lvbjtcblx0XHRpZiAoZXhwcmVzc2lvbi5tb2RlbE5hbWUgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Ly8gSW4gY2FzZSBvZiBkZWZhdWx0IG1vZGVsIHdlIHRoZW4gbmVlZCB0byByZXNvbHZlIHRoZSB0ZXh0IGFycmFuZ2VtZW50IHByb3BlcnR5XG5cdFx0XHRjb25zdCBvUHJvcGVydHlEYXRhTW9kZWxQYXRoID0gZW5oYW5jZURhdGFNb2RlbFBhdGgoZnVsbENvbnRleHRQYXRoLCBleHByZXNzaW9uLnBhdGgpO1xuXHRcdFx0b3V0RXhwcmVzc2lvbiA9IGZvcm1hdFdpdGhUeXBlSW5mb3JtYXRpb24ob1Byb3BlcnR5RGF0YU1vZGVsUGF0aC50YXJnZXRPYmplY3QsIGV4cHJlc3Npb24pO1xuXHRcdH1cblx0XHRyZXR1cm4gb3V0RXhwcmVzc2lvbjtcblx0fSk7XG59O1xuXG5jb25zdCBFRE1fVFlQRV9NQVBQSU5HOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuXHRcIkVkbS5Cb29sZWFuXCI6IHsgdHlwZTogXCJzYXAudWkubW9kZWwub2RhdGEudHlwZS5Cb29sZWFuXCIgfSxcblx0XCJFZG0uQnl0ZVwiOiB7IHR5cGU6IFwic2FwLnVpLm1vZGVsLm9kYXRhLnR5cGUuQnl0ZVwiIH0sXG5cdFwiRWRtLkRhdGVcIjogeyB0eXBlOiBcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLkRhdGVcIiB9LFxuXHRcIkVkbS5EYXRlVGltZU9mZnNldFwiOiB7XG5cdFx0Y29uc3RyYWludHM6IHtcblx0XHRcdFwiJFByZWNpc2lvblwiOiBcInByZWNpc2lvblwiXG5cdFx0fSxcblx0XHR0eXBlOiBcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLkRhdGVUaW1lT2Zmc2V0XCJcblx0fSxcblx0XCJFZG0uRGVjaW1hbFwiOiB7XG5cdFx0Y29uc3RyYWludHM6IHtcblx0XHRcdFwiQE9yZy5PRGF0YS5WYWxpZGF0aW9uLlYxLk1pbmltdW0vJERlY2ltYWxcIjogXCJtaW5pbXVtXCIsXG5cdFx0XHRcIkBPcmcuT0RhdGEuVmFsaWRhdGlvbi5WMS5NaW5pbXVtQE9yZy5PRGF0YS5WYWxpZGF0aW9uLlYxLkV4Y2x1c2l2ZVwiOiBcIm1pbmltdW1FeGNsdXNpdmVcIixcblx0XHRcdFwiQE9yZy5PRGF0YS5WYWxpZGF0aW9uLlYxLk1heGltdW0vJERlY2ltYWxcIjogXCJtYXhpbXVtXCIsXG5cdFx0XHRcIkBPcmcuT0RhdGEuVmFsaWRhdGlvbi5WMS5NYXhpbXVtQE9yZy5PRGF0YS5WYWxpZGF0aW9uLlYxLkV4Y2x1c2l2ZVwiOiBcIm1heGltdW1FeGNsdXNpdmVcIixcblx0XHRcdFwiJFByZWNpc2lvblwiOiBcInByZWNpc2lvblwiLFxuXHRcdFx0XCIkU2NhbGVcIjogXCJzY2FsZVwiXG5cdFx0fSxcblx0XHR0eXBlOiBcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLkRlY2ltYWxcIlxuXHR9LFxuXHRcIkVkbS5Eb3VibGVcIjogeyB0eXBlOiBcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLkRvdWJsZVwiIH0sXG5cdFwiRWRtLkd1aWRcIjogeyB0eXBlOiBcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLkd1aWRcIiB9LFxuXHRcIkVkbS5JbnQxNlwiOiB7IHR5cGU6IFwic2FwLnVpLm1vZGVsLm9kYXRhLnR5cGUuSW50MTZcIiB9LFxuXHRcIkVkbS5JbnQzMlwiOiB7IHR5cGU6IFwic2FwLnVpLm1vZGVsLm9kYXRhLnR5cGUuSW50MzJcIiB9LFxuXHRcIkVkbS5JbnQ2NFwiOiB7IHR5cGU6IFwic2FwLnVpLm1vZGVsLm9kYXRhLnR5cGUuSW50NjRcIiB9LFxuXHRcIkVkbS5TQnl0ZVwiOiB7IHR5cGU6IFwic2FwLnVpLm1vZGVsLm9kYXRhLnR5cGUuU0J5dGVcIiB9LFxuXHRcIkVkbS5TaW5nbGVcIjogeyB0eXBlOiBcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLlNpbmdsZVwiIH0sXG5cdFwiRWRtLlN0cmVhbVwiOiB7IHR5cGU6IFwic2FwLnVpLm1vZGVsLm9kYXRhLnR5cGUuU3RyZWFtXCIgfSxcblx0XCJFZG0uU3RyaW5nXCI6IHtcblx0XHRjb25zdHJhaW50czoge1xuXHRcdFx0XCJAY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLklzRGlnaXRTZXF1ZW5jZVwiOiBcImlzRGlnaXRTZXF1ZW5jZVwiLFxuXHRcdFx0XCIkTWF4TGVuZ3RoXCI6IFwibWF4TGVuZ3RoXCIsXG5cdFx0XHRcIiROdWxsYWJsZVwiOiBcIm51bGxhYmxlXCJcblx0XHR9LFxuXHRcdHR5cGU6IFwic2FwLnVpLm1vZGVsLm9kYXRhLnR5cGUuU3RyaW5nXCJcblx0fSxcblx0XCJFZG0uVGltZU9mRGF5XCI6IHtcblx0XHRjb25zdHJhaW50czoge1xuXHRcdFx0XCIkUHJlY2lzaW9uXCI6IFwicHJlY2lzaW9uXCJcblx0XHR9LFxuXHRcdHR5cGU6IFwic2FwLnVpLm1vZGVsLm9kYXRhLnR5cGUuVGltZU9mRGF5XCJcblx0fVxufTtcblxuZXhwb3J0IGNvbnN0IGZvcm1hdFdpdGhUeXBlSW5mb3JtYXRpb24gPSBmdW5jdGlvbihcblx0b1Byb3BlcnR5OiBQcm9wZXJ0eSxcblx0cHJvcGVydHlCaW5kaW5nRXhwcmVzc2lvbjogRXhwcmVzc2lvbjxzdHJpbmc+LFxuXHRleHByZXNzaW9uRm9ybWF0T3B0aW9ucz86IG9iamVjdFxuKTogRXhwcmVzc2lvbjxzdHJpbmc+IHtcblx0Y29uc3Qgb3V0RXhwcmVzc2lvbjogQmluZGluZ0V4cHJlc3Npb25FeHByZXNzaW9uPGFueT4gPSBwcm9wZXJ0eUJpbmRpbmdFeHByZXNzaW9uIGFzIEJpbmRpbmdFeHByZXNzaW9uRXhwcmVzc2lvbjxhbnk+O1xuXHRpZiAob1Byb3BlcnR5Ll90eXBlID09PSBcIlByb3BlcnR5XCIpIHtcblx0XHRjb25zdCBvVGFyZ2V0TWFwcGluZyA9IEVETV9UWVBFX01BUFBJTkdbKG9Qcm9wZXJ0eSBhcyBQcm9wZXJ0eSkudHlwZV07XG5cdFx0aWYgKG9UYXJnZXRNYXBwaW5nKSB7XG5cdFx0XHRvdXRFeHByZXNzaW9uLnR5cGUgPSBvVGFyZ2V0TWFwcGluZy50eXBlO1xuXHRcdFx0aWYgKG9UYXJnZXRNYXBwaW5nLmNvbnN0cmFpbnRzKSB7XG5cdFx0XHRcdG91dEV4cHJlc3Npb24uY29uc3RyYWludHMgPSB7fTtcblx0XHRcdFx0aWYgKG9UYXJnZXRNYXBwaW5nLmNvbnN0cmFpbnRzLiRTY2FsZSAmJiBvUHJvcGVydHkuc2NhbGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdG91dEV4cHJlc3Npb24uY29uc3RyYWludHMuc2NhbGUgPSBvUHJvcGVydHkuc2NhbGU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKG9UYXJnZXRNYXBwaW5nLmNvbnN0cmFpbnRzLiRQcmVjaXNpb24gJiYgb1Byb3BlcnR5LnByZWNpc2lvbiAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0b3V0RXhwcmVzc2lvbi5jb25zdHJhaW50cy5wcmVjaXNpb24gPSBvUHJvcGVydHkucHJlY2lzaW9uO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChvVGFyZ2V0TWFwcGluZy5jb25zdHJhaW50cy4kTWF4TGVuZ3RoICYmIG9Qcm9wZXJ0eS5tYXhMZW5ndGggIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdG91dEV4cHJlc3Npb24uY29uc3RyYWludHMubWF4TGVuZ3RoID0gb1Byb3BlcnR5Lm1heExlbmd0aDtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAob1RhcmdldE1hcHBpbmcuY29uc3RyYWludHMuJE51bGxhYmxlICYmIG9Qcm9wZXJ0eS5udWxsYWJsZSA9PT0gZmFsc2UpIHtcblx0XHRcdFx0XHRvdXRFeHByZXNzaW9uLmNvbnN0cmFpbnRzLm51bGxhYmxlID0gb1Byb3BlcnR5Lm51bGxhYmxlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAoZXhwcmVzc2lvbkZvcm1hdE9wdGlvbnMgJiYgb3V0RXhwcmVzc2lvbi50eXBlID09PSBcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLkRhdGVcIikge1xuXHRcdFx0XHRvdXRFeHByZXNzaW9uLmZvcm1hdE9wdGlvbnMgPSBleHByZXNzaW9uRm9ybWF0T3B0aW9ucztcblx0XHRcdH1cblx0XHRcdGlmIChvdXRFeHByZXNzaW9uLnR5cGUgPT09IFwic2FwLnVpLm1vZGVsLm9kYXRhLnR5cGUuU3RyaW5nXCIpIHtcblx0XHRcdFx0aWYgKCFvdXRFeHByZXNzaW9uLmZvcm1hdE9wdGlvbnMpIHtcblx0XHRcdFx0XHRvdXRFeHByZXNzaW9uLmZvcm1hdE9wdGlvbnMgPSB7fTtcblx0XHRcdFx0fVxuXHRcdFx0XHRvdXRFeHByZXNzaW9uLmZvcm1hdE9wdGlvbnMucGFyc2VLZWVwc0VtcHR5U3RyaW5nID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmV0dXJuIG91dEV4cHJlc3Npb247XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0VGV4dEJpbmRpbmcgPSBmdW5jdGlvbihcblx0b1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aDogRGF0YU1vZGVsT2JqZWN0UGF0aCxcblx0Zm9ybWF0T3B0aW9uczogRm9ybWF0T3B0aW9uc1xuKTogQmluZGluZ0V4cHJlc3Npb248c3RyaW5nPiB7XG5cdGlmIChcblx0XHRvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdD8uJFR5cGUgPT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkXCIgfHxcblx0XHRvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdD8uJFR5cGUgPT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YVBvaW50VHlwZVwiIHx8XG5cdFx0b1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3Q/LiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZFdpdGhOYXZpZ2F0aW9uUGF0aFwiIHx8XG5cdFx0b1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3Q/LiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZFdpdGhVcmxcIlxuXHQpIHtcblx0XHQvLyB0aGVyZSBpcyBubyByZXNvbHZlZCBwcm9wZXJ0eSBzbyB3ZSByZXR1cm4gdGhlIHZhbHVlIGhhcyBhIGNvbnN0YW50XG5cdFx0Y29uc3QgZmllbGRWYWx1ZSA9IG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0LlZhbHVlIHx8IFwiXCI7XG5cdFx0cmV0dXJuIGNvbXBpbGVCaW5kaW5nKGNvbnN0YW50KGZpZWxkVmFsdWUpKTtcblx0fVxuXHRpZiAoaXNQYXRoRXhwcmVzc2lvbihvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdCkgJiYgb1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QuJHRhcmdldCkge1xuXHRcdGNvbnN0IG9OYXZQYXRoID0gb1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRFbnRpdHlUeXBlLnJlc29sdmVQYXRoKG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0LnBhdGgsIHRydWUpO1xuXHRcdG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0ID0gb05hdlBhdGgudGFyZ2V0O1xuXHRcdG9OYXZQYXRoLnZpc2l0ZWRPYmplY3RzLmZvckVhY2goKG9OYXZPYmo6IGFueSkgPT4ge1xuXHRcdFx0aWYgKG9OYXZPYmogJiYgb05hdk9iai5fdHlwZSA9PT0gXCJOYXZpZ2F0aW9uUHJvcGVydHlcIikge1xuXHRcdFx0XHRvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLm5hdmlnYXRpb25Qcm9wZXJ0aWVzLnB1c2gob05hdk9iaik7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblx0Y29uc3Qgb0JpbmRpbmdFeHByZXNzaW9uID0gYmluZGluZ0V4cHJlc3Npb24oZ2V0Q29udGV4dFJlbGF0aXZlVGFyZ2V0T2JqZWN0UGF0aChvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoKSk7XG5cdGNvbnN0IG9Qcm9wZXJ0eVVuaXQgPSBnZXRBc3NvY2lhdGVkVW5pdFByb3BlcnR5KG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0KTtcblx0Y29uc3Qgb1Byb3BlcnR5Q3VycmVuY3kgPSBnZXRBc3NvY2lhdGVkQ3VycmVuY3lQcm9wZXJ0eShvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdCk7XG5cdGxldCBvVGFyZ2V0QmluZGluZztcblx0aWYgKG9Qcm9wZXJ0eVVuaXQgfHwgb1Byb3BlcnR5Q3VycmVuY3kpIHtcblx0XHRvVGFyZ2V0QmluZGluZyA9IGdldEJpbmRpbmdXaXRoVW5pdE9yQ3VycmVuY3kob1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aCwgb0JpbmRpbmdFeHByZXNzaW9uKTtcblx0fSBlbHNlIHtcblx0XHRvVGFyZ2V0QmluZGluZyA9IGdldEJpbmRpbmdXaXRoVGV4dEFycmFuZ2VtZW50KG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgsIG9CaW5kaW5nRXhwcmVzc2lvbiwgZm9ybWF0T3B0aW9ucyk7XG5cdH1cblx0Ly8gV2UgZG9uJ3QgaW5jbHVkZSAkJG5vcGF0Y2ggYW5kIHBhcnNlS2VlcEVtcHR5U3RyaW5nIGFzIHRoZXkgbWFrZSBubyBzZW5zZSBpbiB0aGUgdGV4dCBiaW5kaW5nIGNhc2Vcblx0cmV0dXJuIGNvbXBpbGVCaW5kaW5nKG9UYXJnZXRCaW5kaW5nKTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRWYWx1ZUJpbmRpbmcgPSBmdW5jdGlvbihcblx0b1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aDogRGF0YU1vZGVsT2JqZWN0UGF0aCxcblx0Zm9ybWF0T3B0aW9uczogRm9ybWF0T3B0aW9ucyxcblx0aWdub3JlVW5pdDogYm9vbGVhbiA9IGZhbHNlLFxuXHRpZ25vcmVGb3JtYXR0aW5nOiBib29sZWFuID0gZmFsc2UsXG5cdGJpbmRpbmdQYXJhbWV0ZXJzPzogb2JqZWN0LFxuXHR0YXJnZXRUeXBlQW55PzogYm9vbGVhblxuKTogQmluZGluZ0V4cHJlc3Npb248c3RyaW5nPiB7XG5cdGlmIChpc1BhdGhFeHByZXNzaW9uKG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0KSAmJiBvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdC4kdGFyZ2V0KSB7XG5cdFx0Y29uc3Qgb05hdlBhdGggPSBvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldEVudGl0eVR5cGUucmVzb2x2ZVBhdGgob1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QucGF0aCwgdHJ1ZSk7XG5cdFx0b1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QgPSBvTmF2UGF0aC50YXJnZXQ7XG5cdFx0b05hdlBhdGgudmlzaXRlZE9iamVjdHMuZm9yRWFjaCgob05hdk9iajogYW55KSA9PiB7XG5cdFx0XHRpZiAob05hdk9iaiAmJiBvTmF2T2JqLl90eXBlID09PSBcIk5hdmlnYXRpb25Qcm9wZXJ0eVwiKSB7XG5cdFx0XHRcdG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgubmF2aWdhdGlvblByb3BlcnRpZXMucHVzaChvTmF2T2JqKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdGNvbnN0IHRhcmdldE9iamVjdCA9IG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0O1xuXHRpZiAoaXNQcm9wZXJ0eSh0YXJnZXRPYmplY3QpKSB7XG5cdFx0bGV0IG9CaW5kaW5nRXhwcmVzc2lvbjogQmluZGluZ0V4cHJlc3Npb25FeHByZXNzaW9uPHN0cmluZz4gPSBiaW5kaW5nRXhwcmVzc2lvbihcblx0XHRcdGdldENvbnRleHRSZWxhdGl2ZVRhcmdldE9iamVjdFBhdGgob1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aClcblx0XHQpO1xuXHRcdGlmICh0YXJnZXRPYmplY3QuYW5ub3RhdGlvbnM/LkNvbW11bmljYXRpb24/LklzRW1haWxBZGRyZXNzKSB7XG5cdFx0XHRvQmluZGluZ0V4cHJlc3Npb24udHlwZSA9IFwic2FwLmZlLmNvcmUudHlwZS5FbWFpbFwiO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCBvUHJvcGVydHlVbml0ID0gZ2V0QXNzb2NpYXRlZFVuaXRQcm9wZXJ0eShvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdCk7XG5cdFx0XHRjb25zdCBvUHJvcGVydHlDdXJyZW5jeSA9IGdldEFzc29jaWF0ZWRDdXJyZW5jeVByb3BlcnR5KG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0KTtcblx0XHRcdGlmICghaWdub3JlVW5pdCAmJiAob1Byb3BlcnR5VW5pdCB8fCBvUHJvcGVydHlDdXJyZW5jeSkpIHtcblx0XHRcdFx0b0JpbmRpbmdFeHByZXNzaW9uID0gZ2V0QmluZGluZ1dpdGhVbml0T3JDdXJyZW5jeShvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLCBvQmluZGluZ0V4cHJlc3Npb24pIGFzIGFueTtcblx0XHRcdFx0aWYgKChvUHJvcGVydHlVbml0ICYmICFoYXNWYWx1ZUhlbHAob1Byb3BlcnR5VW5pdCkpIHx8IChvUHJvcGVydHlDdXJyZW5jeSAmJiAhaGFzVmFsdWVIZWxwKG9Qcm9wZXJ0eUN1cnJlbmN5KSkpIHtcblx0XHRcdFx0XHQvLyBJZiB0aGVyZSBpcyBhIHVuaXQgb3IgY3VycmVuY3kgd2l0aG91dCBhIHZhbHVlIGhlbHAgd2UgbmVlZCB0byBjb25maWd1cmUgdGhlIGJpbmRpbmcgdG8gbm90IHNob3cgdGhlIG1lYXN1cmUsIG90aGVyd2lzZSBpdCdzIG5lZWRlZCBmb3IgdGhlIG1kYyBmaWVsZFxuXHRcdFx0XHRcdG9CaW5kaW5nRXhwcmVzc2lvbi5mb3JtYXRPcHRpb25zID0ge1xuXHRcdFx0XHRcdFx0c2hvd01lYXN1cmU6IGZhbHNlXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0b0JpbmRpbmdFeHByZXNzaW9uID0gZm9ybWF0V2l0aFR5cGVJbmZvcm1hdGlvbih0YXJnZXRPYmplY3QsIG9CaW5kaW5nRXhwcmVzc2lvbikgYXMgQmluZGluZ0V4cHJlc3Npb25FeHByZXNzaW9uPHN0cmluZz47XG5cdFx0XHRcdGlmIChvQmluZGluZ0V4cHJlc3Npb24udHlwZSA9PT0gXCJzYXAudWkubW9kZWwub2RhdGEudHlwZS5TdHJpbmdcIikge1xuXHRcdFx0XHRcdG9CaW5kaW5nRXhwcmVzc2lvbi5mb3JtYXRPcHRpb25zID0ge1xuXHRcdFx0XHRcdFx0cGFyc2VLZWVwc0VtcHR5U3RyaW5nOiB0cnVlXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoaWdub3JlRm9ybWF0dGluZykge1xuXHRcdFx0ZGVsZXRlIG9CaW5kaW5nRXhwcmVzc2lvbi5mb3JtYXRPcHRpb25zO1xuXHRcdFx0ZGVsZXRlIG9CaW5kaW5nRXhwcmVzc2lvbi5jb25zdHJhaW50cztcblx0XHRcdGRlbGV0ZSBvQmluZGluZ0V4cHJlc3Npb24udHlwZTtcblx0XHR9XG5cdFx0aWYgKGJpbmRpbmdQYXJhbWV0ZXJzKSB7XG5cdFx0XHRvQmluZGluZ0V4cHJlc3Npb24ucGFyYW1ldGVycyA9IGJpbmRpbmdQYXJhbWV0ZXJzO1xuXHRcdH1cblx0XHRpZiAodGFyZ2V0VHlwZUFueSkge1xuXHRcdFx0b0JpbmRpbmdFeHByZXNzaW9uLnRhcmdldFR5cGUgPSBcImFueVwiO1xuXHRcdH1cblxuXHRcdHJldHVybiBjb21waWxlQmluZGluZyhvQmluZGluZ0V4cHJlc3Npb24pO1xuXHR9IGVsc2Uge1xuXHRcdGlmICh0YXJnZXRPYmplY3QgJiYgdGFyZ2V0T2JqZWN0LiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRXaXRoVXJsKSB7XG5cdFx0XHRyZXR1cm4gY29tcGlsZUJpbmRpbmcoYW5ub3RhdGlvbkV4cHJlc3Npb24oKHRhcmdldE9iamVjdCBhcyBEYXRhRmllbGRXaXRoVXJsKS5WYWx1ZSkpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gXCJcIjtcblx0XHR9XG5cdH1cbn07XG5cbmV4cG9ydCBjb25zdCBnZXRVbml0QmluZGluZyA9IGZ1bmN0aW9uKFxuXHRvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoLFxuXHRmb3JtYXRPcHRpb25zOiBGb3JtYXRPcHRpb25zXG4pOiBCaW5kaW5nRXhwcmVzc2lvbjxzdHJpbmc+IHtcblx0Y29uc3Qgc1VuaXRQcm9wZXJ0eVBhdGggPSBnZXRBc3NvY2lhdGVkVW5pdFByb3BlcnR5UGF0aChvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdCk7XG5cdGNvbnN0IHNDdXJyZW5jeVByb3BlcnR5UGF0aCA9IGdldEFzc29jaWF0ZWRDdXJyZW5jeVByb3BlcnR5UGF0aChvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdCk7XG5cdGlmIChzVW5pdFByb3BlcnR5UGF0aCB8fCBzQ3VycmVuY3lQcm9wZXJ0eVBhdGgpIHtcblx0XHRjb25zdCB0YXJnZXRQcm9wZXJ0eVBhdGggPSBzVW5pdFByb3BlcnR5UGF0aCB8fCBzQ3VycmVuY3lQcm9wZXJ0eVBhdGg7XG5cdFx0Y29uc3Qgb1VPTVByb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aCA9IGVuaGFuY2VEYXRhTW9kZWxQYXRoKG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgsIHRhcmdldFByb3BlcnR5UGF0aCk7XG5cdFx0cmV0dXJuIGdldFZhbHVlQmluZGluZyhvVU9NUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLCBmb3JtYXRPcHRpb25zKTtcblx0fVxuXHRyZXR1cm4gdW5kZWZpbmVkO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEFzc29jaWF0ZWRUZXh0QmluZGluZyA9IGZ1bmN0aW9uKFxuXHRvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoLFxuXHRmb3JtYXRPcHRpb25zOiBGb3JtYXRPcHRpb25zXG4pOiBCaW5kaW5nRXhwcmVzc2lvbjxzdHJpbmc+IHtcblx0Y29uc3QgdGV4dFByb3BlcnR5UGF0aCA9IGdldEFzc29jaWF0ZWRUZXh0UHJvcGVydHlQYXRoKG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0KTtcblx0aWYgKHRleHRQcm9wZXJ0eVBhdGgpIHtcblx0XHRjb25zdCBvVGV4dFByb3BlcnR5UGF0aCA9IGVuaGFuY2VEYXRhTW9kZWxQYXRoKG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgsIHRleHRQcm9wZXJ0eVBhdGgpO1xuXHRcdGNvbnN0IG9WYWx1ZUJpbmRpbmcgPSBnZXRWYWx1ZUJpbmRpbmcob1RleHRQcm9wZXJ0eVBhdGgsIGZvcm1hdE9wdGlvbnMsIHRydWUsIHRydWUsIHsgJCRub1BhdGNoOiB0cnVlIH0pO1xuXHRcdHJldHVybiBvVmFsdWVCaW5kaW5nO1xuXHR9XG5cdHJldHVybiB1bmRlZmluZWQ7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0RGlzcGxheVN0eWxlID0gZnVuY3Rpb24oXG5cdG9Qcm9wZXJ0eVBhdGg6IFByb3BlcnR5T3JQYXRoPFByb3BlcnR5Pixcblx0b0RhdGFGaWVsZDogYW55LFxuXHRvRGF0YU1vZGVsUGF0aDogRGF0YU1vZGVsT2JqZWN0UGF0aCxcblx0Zm9ybWF0T3B0aW9uczogRm9ybWF0T3B0aW9uc1xuKTogRGlzcGxheVN0eWxlIHtcblx0Ly8gYWxnb3JpdGhtIHRvIGRldGVybWluZSB0aGUgZmllbGQgZnJhZ21lbnQgdG8gdXNlXG5cdGlmICghb1Byb3BlcnR5UGF0aCB8fCB0eXBlb2Ygb1Byb3BlcnR5UGF0aCA9PT0gXCJzdHJpbmdcIikge1xuXHRcdHJldHVybiBcIlRleHRcIjtcblx0fVxuXHRjb25zdCBvUHJvcGVydHk6IFByb3BlcnR5ID0gKGlzUGF0aEV4cHJlc3Npb24ob1Byb3BlcnR5UGF0aCkgJiYgb1Byb3BlcnR5UGF0aC4kdGFyZ2V0KSB8fCAob1Byb3BlcnR5UGF0aCBhcyBQcm9wZXJ0eSk7XG5cdGlmIChvUHJvcGVydHkuYW5ub3RhdGlvbnM/LlVJPy5Jc0ltYWdlVVJMKSB7XG5cdFx0cmV0dXJuIFwiQXZhdGFyXCI7XG5cdH1cblx0aWYgKG9Qcm9wZXJ0eS50eXBlID09PSBcIkVkbS5TdHJlYW1cIikge1xuXHRcdHJldHVybiBcIkF2YXRhclwiO1xuXHR9XG5cdHN3aXRjaCAob0RhdGFGaWVsZC4kVHlwZSkge1xuXHRcdGNhc2UgXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhUG9pbnRUeXBlXCI6XG5cdFx0XHRyZXR1cm4gXCJEYXRhUG9pbnRcIjtcblx0XHRjYXNlIFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkRm9yQW5ub3RhdGlvblwiOlxuXHRcdFx0aWYgKG9EYXRhRmllbGQuVGFyZ2V0Py4kdGFyZ2V0Py4kVHlwZSA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhUG9pbnRUeXBlXCIpIHtcblx0XHRcdFx0cmV0dXJuIFwiRGF0YVBvaW50XCI7XG5cdFx0XHR9IGVsc2UgaWYgKG9EYXRhRmllbGQuVGFyZ2V0Py4kdGFyZ2V0Py4kVHlwZSA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tdW5pY2F0aW9uLnYxLkNvbnRhY3RUeXBlXCIpIHtcblx0XHRcdFx0cmV0dXJuIFwiQ29udGFjdFwiO1xuXHRcdFx0fVxuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEZvckFjdGlvblwiOlxuXHRcdGNhc2UgXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb25cIjpcblx0XHRcdHJldHVybiBcIkJ1dHRvblwiO1xuXHRcdGNhc2UgXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRXaXRoTmF2aWdhdGlvblBhdGhcIjpcblx0XHRcdHJldHVybiBcIkxpbmtcIjtcblx0fVxuXHRpZiAob0RhdGFGaWVsZC5Dcml0aWNhbGl0eSkge1xuXHRcdHJldHVybiBcIk9iamVjdFN0YXR1c1wiO1xuXHR9XG5cdGlmIChvUHJvcGVydHkuYW5ub3RhdGlvbnM/Lk1lYXN1cmVzPy5JU09DdXJyZW5jeSkge1xuXHRcdHJldHVybiBcIkFtb3VudFdpdGhDdXJyZW5jeVwiO1xuXHR9XG5cdGlmIChvUHJvcGVydHkuYW5ub3RhdGlvbnM/LkNvbW11bmljYXRpb24/LklzRW1haWxBZGRyZXNzIHx8IG9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uQ29tbXVuaWNhdGlvbj8uSXNQaG9uZU51bWJlcikge1xuXHRcdHJldHVybiBcIkxpbmtcIjtcblx0fVxuXHRpZiAob0RhdGFNb2RlbFBhdGg/LnRhcmdldEVudGl0eVNldD8uZW50aXR5VHlwZT8uYW5ub3RhdGlvbnM/LkNvbW1vbj8uU2VtYW50aWNLZXkpIHtcblx0XHRjb25zdCBhU2VtYW50aWNLZXlzID0gb0RhdGFNb2RlbFBhdGgudGFyZ2V0RW50aXR5U2V0LmVudGl0eVR5cGUuYW5ub3RhdGlvbnMuQ29tbW9uLlNlbWFudGljS2V5O1xuXHRcdGNvbnN0IGJJc1NlbWFudGljS2V5ID0gIWFTZW1hbnRpY0tleXMuZXZlcnkoZnVuY3Rpb24ob0tleSkge1xuXHRcdFx0cmV0dXJuIG9LZXk/LiR0YXJnZXQ/Lm5hbWUgIT09IG9Qcm9wZXJ0eS5uYW1lO1xuXHRcdFx0Ly8gbmVlZCB0byBjaGVjayBpZiBpdCB3b3JrcyBhbHNvIGZvciBkaXJlY3QgcHJvcGVydGllc1xuXHRcdH0pO1xuXHRcdGlmIChiSXNTZW1hbnRpY0tleSAmJiBmb3JtYXRPcHRpb25zLnNlbWFudGljS2V5U3R5bGUpIHtcblx0XHRcdGlmIChvRGF0YU1vZGVsUGF0aC50YXJnZXRFbnRpdHlTZXQ/LmFubm90YXRpb25zPy5Db21tb24/LkRyYWZ0Um9vdCkge1xuXHRcdFx0XHQvLyB3ZSB0aGVuIHN0aWxsIGNoZWNrIHdoZXRoZXIgdGhpcyBpcyBhdmFpbGFibGUgYXQgZGVzaWdudGltZSBvbiB0aGUgZW50aXR5c2V0XG5cdFx0XHRcdHJldHVybiBcIlNlbWFudGljS2V5V2l0aERyYWZ0SW5kaWNhdG9yXCI7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZm9ybWF0T3B0aW9ucy5zZW1hbnRpY0tleVN0eWxlID09PSBcIk9iamVjdElkZW50aWZpZXJcIiA/IFwiT2JqZWN0SWRlbnRpZmllclwiIDogXCJMYWJlbFNlbWFudGljS2V5XCI7XG5cdFx0fVxuXHR9XG5cdGlmIChvUHJvcGVydHkuYW5ub3RhdGlvbnM/LlVJPy5NdWx0aUxpbmVUZXh0KSB7XG5cdFx0cmV0dXJuIFwiVGV4dFwiO1xuXHR9XG5cdGNvbnN0IGFOYXZpZ2F0aW9uUHJvcGVydGllcyA9IG9EYXRhTW9kZWxQYXRoPy50YXJnZXRFbnRpdHlTZXQ/LmVudGl0eVR5cGU/Lm5hdmlnYXRpb25Qcm9wZXJ0aWVzIHx8IFtdO1xuXHRsZXQgYklzVXNlZEluTmF2aWdhdGlvbldpdGhRdWlja1ZpZXdGYWNldHMgPSBmYWxzZTtcblx0YU5hdmlnYXRpb25Qcm9wZXJ0aWVzLmZvckVhY2gob05hdlByb3AgPT4ge1xuXHRcdGlmIChvTmF2UHJvcC5yZWZlcmVudGlhbENvbnN0cmFpbnQgJiYgb05hdlByb3AucmVmZXJlbnRpYWxDb25zdHJhaW50Lmxlbmd0aCkge1xuXHRcdFx0b05hdlByb3AucmVmZXJlbnRpYWxDb25zdHJhaW50LmZvckVhY2gob1JlZkNvbnN0cmFpbnQgPT4ge1xuXHRcdFx0XHRpZiAob1JlZkNvbnN0cmFpbnQ/LnNvdXJjZVByb3BlcnR5ID09PSBvUHJvcGVydHkubmFtZSkge1xuXHRcdFx0XHRcdGlmIChvTmF2UHJvcD8udGFyZ2V0VHlwZT8uYW5ub3RhdGlvbnM/LlVJPy5RdWlja1ZpZXdGYWNldHMpIHtcblx0XHRcdFx0XHRcdGJJc1VzZWRJbk5hdmlnYXRpb25XaXRoUXVpY2tWaWV3RmFjZXRzID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG5cdGlmIChiSXNVc2VkSW5OYXZpZ2F0aW9uV2l0aFF1aWNrVmlld0ZhY2V0cykge1xuXHRcdHJldHVybiBcIkxpbmtXaXRoUXVpY2tWaWV3Rm9ybVwiO1xuXHR9XG5cdGlmIChvUHJvcGVydHkuYW5ub3RhdGlvbnM/LkNvbW1vbj8uU2VtYW50aWNPYmplY3QpIHtcblx0XHRyZXR1cm4gXCJMaW5rV3JhcHBlclwiO1xuXHR9XG5cdGlmIChvRGF0YUZpZWxkLiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZFdpdGhVcmxcIikge1xuXHRcdHJldHVybiBcIkxpbmtcIjtcblx0fVxuXHRyZXR1cm4gXCJUZXh0XCI7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0RWRpdFN0eWxlID0gZnVuY3Rpb24ob1Byb3BlcnR5UGF0aDogUHJvcGVydHlPclBhdGg8UHJvcGVydHk+LCBvRGF0YUZpZWxkOiBhbnkpOiBFZGl0U3R5bGUgfCBudWxsIHtcblx0Ly8gYWxnb3JpdGhtIHRvIGRldGVybWluZSB0aGUgZmllbGQgZnJhZ21lbnQgdG8gdXNlXG5cdGlmICghb1Byb3BlcnR5UGF0aCB8fCB0eXBlb2Ygb1Byb3BlcnR5UGF0aCA9PT0gXCJzdHJpbmdcIikge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGNvbnN0IG9Qcm9wZXJ0eTogUHJvcGVydHkgPSAoaXNQYXRoRXhwcmVzc2lvbihvUHJvcGVydHlQYXRoKSAmJiBvUHJvcGVydHlQYXRoLiR0YXJnZXQpIHx8IChvUHJvcGVydHlQYXRoIGFzIFByb3BlcnR5KTtcblx0c3dpdGNoIChvRGF0YUZpZWxkLiRUeXBlKSB7XG5cdFx0Y2FzZSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEZvckFubm90YXRpb25cIjpcblx0XHRcdGlmIChvRGF0YUZpZWxkLlRhcmdldD8uJHRhcmdldD8uJFR5cGUgPT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbXVuaWNhdGlvbi52MS5Db250YWN0VHlwZVwiKSB7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXHRcdFx0YnJlYWs7XG5cdFx0Ly9jYXNlIFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YVBvaW50VHlwZVwiOlRPRE8gc3BlY2lhbCBoYW5kbGluZyBmb3IgcmF0aW5nIGluZGljYXRvclxuXHRcdGNhc2UgXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRGb3JBY3Rpb25cIjpcblx0XHRjYXNlIFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkV2l0aE5hdmlnYXRpb25QYXRoXCI6XG5cdFx0Y2FzZSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvblwiOlxuXHRcdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0Y29uc3Qgb1Byb3BlcnR5VW5pdCA9IGdldEFzc29jaWF0ZWRVbml0UHJvcGVydHkob1Byb3BlcnR5KTtcblx0Y29uc3Qgb1Byb3BlcnR5Q3VycmVuY3kgPSBnZXRBc3NvY2lhdGVkQ3VycmVuY3lQcm9wZXJ0eShvUHJvcGVydHkpO1xuXHRpZiAoXG5cdFx0UHJvcGVydHlIZWxwZXIuaGFzVmFsdWVIZWxwKG9Qcm9wZXJ0eSkgfHxcblx0XHQob1Byb3BlcnR5VW5pdCAmJiBQcm9wZXJ0eUhlbHBlci5oYXNWYWx1ZUhlbHAob1Byb3BlcnR5VW5pdCkpIHx8XG5cdFx0KG9Qcm9wZXJ0eUN1cnJlbmN5ICYmIFByb3BlcnR5SGVscGVyLmhhc1ZhbHVlSGVscChvUHJvcGVydHlDdXJyZW5jeSkpXG5cdCkge1xuXHRcdHJldHVybiBcIklucHV0V2l0aFZhbHVlSGVscFwiO1xuXHR9XG5cdGlmIChvUHJvcGVydHkuYW5ub3RhdGlvbnM/LlVJPy5NdWx0aUxpbmVUZXh0ICYmIG9Qcm9wZXJ0eS50eXBlID09PSBcIkVkbS5TdHJpbmdcIikge1xuXHRcdHJldHVybiBcIlRleHRBcmVhXCI7XG5cdH1cblx0c3dpdGNoIChvUHJvcGVydHkudHlwZSkge1xuXHRcdGNhc2UgXCJFZG0uRGF0ZVwiOlxuXHRcdFx0cmV0dXJuIFwiRGF0ZVBpY2tlclwiO1xuXHRcdGNhc2UgXCJFZG0uVGltZVwiOlxuXHRcdGNhc2UgXCJFZG0uVGltZU9mRGF5XCI6XG5cdFx0XHRyZXR1cm4gXCJUaW1lUGlja2VyXCI7XG5cdFx0Y2FzZSBcIkVkbS5EYXRlVGltZVwiOlxuXHRcdGNhc2UgXCJFZG0uRGF0ZVRpbWVPZmZzZXRcIjpcblx0XHRcdHJldHVybiBcIkRhdGVUaW1lUGlja2VyXCI7XG5cdFx0Y2FzZSBcIkVkbS5Cb29sZWFuXCI6XG5cdFx0XHRyZXR1cm4gXCJDaGVja0JveFwiO1xuXHR9XG5cdGlmIChvUHJvcGVydHkuYW5ub3RhdGlvbnM/Lk1lYXN1cmVzPy5JU09DdXJyZW5jeSB8fCBvUHJvcGVydHkuYW5ub3RhdGlvbnM/Lk1lYXN1cmVzPy5Vbml0KSB7XG5cdFx0cmV0dXJuIFwiSW5wdXRXaXRoVW5pdFwiO1xuXHR9XG5cdHJldHVybiBcIklucHV0XCI7XG59O1xuIl19