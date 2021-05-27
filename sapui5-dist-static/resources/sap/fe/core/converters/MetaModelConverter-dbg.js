sap.ui.define(["sap/fe/core/converters/common/AnnotationConverter"], function (AnnotationConverter) {
  "use strict";

  var _exports = {};

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  var VOCABULARY_ALIAS = {
    "Org.OData.Capabilities.V1": "Capabilities",
    "Org.OData.Core.V1": "Core",
    "Org.OData.Measures.V1": "Measures",
    "com.sap.vocabularies.Common.v1": "Common",
    "com.sap.vocabularies.UI.v1": "UI",
    "com.sap.vocabularies.Session.v1": "Session",
    "com.sap.vocabularies.Analytics.v1": "Analytics",
    "com.sap.vocabularies.PersonalData.v1": "PersonalData",
    "com.sap.vocabularies.Communication.v1": "Communication"
  };
  var DefaultEnvironmentCapabilities = {
    Chart: true,
    MicroChart: true,
    UShell: true,
    IntentBasedNavigation: true
  };
  _exports.DefaultEnvironmentCapabilities = DefaultEnvironmentCapabilities;
  var MetaModelConverter = {
    parsePropertyValue: function (annotationObject, propertyKey, currentTarget, annotationsLists, oCapabilities) {
      var _this = this;

      var value;
      var currentPropertyTarget = currentTarget + "/" + propertyKey;

      if (annotationObject === null) {
        value = {
          type: "Null",
          Null: null
        };
      } else if (typeof annotationObject === "string") {
        value = {
          type: "String",
          String: annotationObject
        };
      } else if (typeof annotationObject === "boolean") {
        value = {
          type: "Bool",
          Bool: annotationObject
        };
      } else if (typeof annotationObject === "number") {
        value = {
          type: "Int",
          Int: annotationObject
        };
      } else if (Array.isArray(annotationObject)) {
        value = {
          type: "Collection",
          Collection: annotationObject.map(function (subAnnotationObject, subAnnotationObjectIndex) {
            return _this.parseAnnotationObject(subAnnotationObject, currentPropertyTarget + "/" + subAnnotationObjectIndex, annotationsLists, oCapabilities);
          })
        };

        if (annotationObject.length > 0) {
          if (annotationObject[0].hasOwnProperty("$PropertyPath")) {
            value.Collection.type = "PropertyPath";
          } else if (annotationObject[0].hasOwnProperty("$Path")) {
            value.Collection.type = "Path";
          } else if (annotationObject[0].hasOwnProperty("$NavigationPropertyPath")) {
            value.Collection.type = "NavigationPropertyPath";
          } else if (annotationObject[0].hasOwnProperty("$AnnotationPath")) {
            value.Collection.type = "AnnotationPath";
          } else if (annotationObject[0].hasOwnProperty("$Type")) {
            value.Collection.type = "Record";
          } else if (annotationObject[0].hasOwnProperty("$If")) {
            value.Collection.type = "If";
          } else if (annotationObject[0].hasOwnProperty("$Apply")) {
            value.Collection.type = "Apply";
          } else if (typeof annotationObject[0] === "object") {
            // $Type is optional...
            value.Collection.type = "Record";
          } else {
            value.Collection.type = "String";
          }
        }
      } else if (annotationObject.$Path !== undefined) {
        value = {
          type: "Path",
          Path: annotationObject.$Path
        };
      } else if (annotationObject.$Decimal !== undefined) {
        value = {
          type: "Decimal",
          Decimal: parseFloat(annotationObject.$Decimal)
        };
      } else if (annotationObject.$PropertyPath !== undefined) {
        value = {
          type: "PropertyPath",
          PropertyPath: annotationObject.$PropertyPath
        };
      } else if (annotationObject.$NavigationPropertyPath !== undefined) {
        value = {
          type: "NavigationPropertyPath",
          NavigationPropertyPath: annotationObject.$NavigationPropertyPath
        };
      } else if (annotationObject.$If !== undefined) {
        value = {
          type: "If",
          If: annotationObject.$If
        };
      } else if (annotationObject.$Apply !== undefined) {
        value = {
          type: "Apply",
          Apply: annotationObject.$Apply,
          Function: annotationObject.$Function
        };
      } else if (annotationObject.$AnnotationPath !== undefined) {
        value = {
          type: "AnnotationPath",
          AnnotationPath: annotationObject.$AnnotationPath
        };
      } else if (annotationObject.$EnumMember !== undefined) {
        value = {
          type: "EnumMember",
          EnumMember: this.mapNameToAlias(annotationObject.$EnumMember.split("/")[0]) + "/" + annotationObject.$EnumMember.split("/")[1]
        };
      } else if (annotationObject.$Type) {
        value = {
          type: "Record",
          Record: this.parseAnnotationObject(annotationObject, currentTarget, annotationsLists, oCapabilities)
        };
      } else {
        value = {
          type: "Record",
          Record: this.parseAnnotationObject(annotationObject, currentTarget, annotationsLists, oCapabilities)
        };
      }

      return {
        name: propertyKey,
        value: value
      };
    },
    mapNameToAlias: function (annotationName) {
      var _annotationName$split = annotationName.split("@"),
          _annotationName$split2 = _slicedToArray(_annotationName$split, 2),
          pathPart = _annotationName$split2[0],
          annoPart = _annotationName$split2[1];

      if (!annoPart) {
        annoPart = pathPart;
        pathPart = "";
      } else {
        pathPart += "@";
      }

      var lastDot = annoPart.lastIndexOf(".");
      return pathPart + VOCABULARY_ALIAS[annoPart.substr(0, lastDot)] + "." + annoPart.substr(lastDot + 1);
    },
    parseAnnotationObject: function (annotationObject, currentObjectTarget, annotationsLists, oCapabilities) {
      var _this2 = this;

      var parsedAnnotationObject = {};

      if (annotationObject === null) {
        parsedAnnotationObject = {
          type: "Null",
          Null: null
        };
      } else if (typeof annotationObject === "string") {
        parsedAnnotationObject = {
          type: "String",
          String: annotationObject
        };
      } else if (typeof annotationObject === "boolean") {
        parsedAnnotationObject = {
          type: "Bool",
          Bool: annotationObject
        };
      } else if (typeof annotationObject === "number") {
        parsedAnnotationObject = {
          type: "Int",
          Int: annotationObject
        };
      } else if (annotationObject.$AnnotationPath !== undefined) {
        parsedAnnotationObject = {
          type: "AnnotationPath",
          AnnotationPath: annotationObject.$AnnotationPath
        };
      } else if (annotationObject.$Path !== undefined) {
        parsedAnnotationObject = {
          type: "Path",
          Path: annotationObject.$Path
        };
      } else if (annotationObject.$Decimal !== undefined) {
        parsedAnnotationObject = {
          type: "Decimal",
          Decimal: parseFloat(annotationObject.$Decimal)
        };
      } else if (annotationObject.$PropertyPath !== undefined) {
        parsedAnnotationObject = {
          type: "PropertyPath",
          PropertyPath: annotationObject.$PropertyPath
        };
      } else if (annotationObject.$If !== undefined) {
        parsedAnnotationObject = {
          type: "If",
          If: annotationObject.$If
        };
      } else if (annotationObject.$Apply !== undefined) {
        parsedAnnotationObject = {
          type: "Apply",
          Apply: annotationObject.$Apply,
          Function: annotationObject.$Function
        };
      } else if (annotationObject.$NavigationPropertyPath !== undefined) {
        parsedAnnotationObject = {
          type: "NavigationPropertyPath",
          NavigationPropertyPath: annotationObject.$NavigationPropertyPath
        };
      } else if (annotationObject.$EnumMember !== undefined) {
        parsedAnnotationObject = {
          type: "EnumMember",
          EnumMember: this.mapNameToAlias(annotationObject.$EnumMember.split("/")[0]) + "/" + annotationObject.$EnumMember.split("/")[1]
        };
      } else if (Array.isArray(annotationObject)) {
        var parsedAnnotationCollection = parsedAnnotationObject;
        parsedAnnotationCollection.collection = annotationObject.map(function (subAnnotationObject, subAnnotationIndex) {
          return _this2.parseAnnotationObject(subAnnotationObject, currentObjectTarget + "/" + subAnnotationIndex, annotationsLists, oCapabilities);
        });

        if (annotationObject.length > 0) {
          if (annotationObject[0].hasOwnProperty("$PropertyPath")) {
            parsedAnnotationCollection.collection.type = "PropertyPath";
          } else if (annotationObject[0].hasOwnProperty("$Path")) {
            parsedAnnotationCollection.collection.type = "Path";
          } else if (annotationObject[0].hasOwnProperty("$NavigationPropertyPath")) {
            parsedAnnotationCollection.collection.type = "NavigationPropertyPath";
          } else if (annotationObject[0].hasOwnProperty("$AnnotationPath")) {
            parsedAnnotationCollection.collection.type = "AnnotationPath";
          } else if (annotationObject[0].hasOwnProperty("$Type")) {
            parsedAnnotationCollection.collection.type = "Record";
          } else if (annotationObject[0].hasOwnProperty("$If")) {
            parsedAnnotationCollection.collection.type = "If";
          } else if (annotationObject[0].hasOwnProperty("$Apply")) {
            parsedAnnotationCollection.collection.type = "Apply";
          } else if (typeof annotationObject[0] === "object") {
            parsedAnnotationCollection.collection.type = "Record";
          } else {
            parsedAnnotationCollection.collection.type = "String";
          }
        }
      } else {
        if (annotationObject.$Type) {
          var typeValue = annotationObject.$Type;
          parsedAnnotationObject.type = typeValue; //`${typeAlias}.${typeTerm}`;
        }

        var propertyValues = [];
        Object.keys(annotationObject).forEach(function (propertyKey) {
          if (propertyKey !== "$Type" && propertyKey !== "$If" && propertyKey !== "$Apply" && propertyKey !== "$Eq" && !propertyKey.startsWith("@")) {
            propertyValues.push(_this2.parsePropertyValue(annotationObject[propertyKey], propertyKey, currentObjectTarget, annotationsLists, oCapabilities));
          } else if (propertyKey.startsWith("@")) {
            // Annotation of annotation
            _this2.createAnnotationLists(_defineProperty({}, propertyKey, annotationObject[propertyKey]), currentObjectTarget, annotationsLists, oCapabilities);
          }
        });
        parsedAnnotationObject.propertyValues = propertyValues;
      }

      return parsedAnnotationObject;
    },
    getOrCreateAnnotationList: function (target, annotationsLists) {
      var potentialTarget = annotationsLists.find(function (annotationList) {
        return annotationList.target === target;
      });

      if (!potentialTarget) {
        potentialTarget = {
          target: target,
          annotations: []
        };
        annotationsLists.push(potentialTarget);
      }

      return potentialTarget;
    },
    createAnnotationLists: function (annotationObjects, annotationTarget, annotationLists, oCapabilities) {
      var _this3 = this;

      var outAnnotationObject = this.getOrCreateAnnotationList(annotationTarget, annotationLists);

      if (!oCapabilities.MicroChart) {
        delete annotationObjects["@com.sap.vocabularies.UI.v1.Chart"];
      }

      function removeChartAnnotations(annotationObject) {
        return annotationObject.filter(function (oRecord) {
          if (oRecord.Target && oRecord.Target.$AnnotationPath) {
            return oRecord.Target.$AnnotationPath.indexOf("@com.sap.vocabularies.UI.v1.Chart") === -1;
          } else {
            return true;
          }
        });
      }

      function removeIBNAnnotations(annotationObject) {
        return annotationObject.filter(function (oRecord) {
          return oRecord.$Type !== "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation";
        });
      }

      function handlePresentationVariant(annotationObject) {
        return annotationObject.filter(function (oRecord) {
          return oRecord.$AnnotationPath !== "@com.sap.vocabularies.UI.v1.Chart";
        });
      }

      Object.keys(annotationObjects).forEach(function (annotationKey) {
        var annotationObject = annotationObjects[annotationKey];

        switch (annotationKey) {
          case "@com.sap.vocabularies.UI.v1.HeaderFacets":
            if (!oCapabilities.MicroChart) {
              annotationObject = removeChartAnnotations(annotationObject);
            }

            break;

          case "@com.sap.vocabularies.UI.v1.Identification":
            if (!oCapabilities.IntentBasedNavigation) {
              annotationObject = removeIBNAnnotations(annotationObject);
            }

            break;

          case "@com.sap.vocabularies.UI.v1.LineItem":
            if (!oCapabilities.IntentBasedNavigation) {
              annotationObject = removeIBNAnnotations(annotationObject);
            }

            if (!oCapabilities.MicroChart) {
              annotationObject = removeChartAnnotations(annotationObject);
            }

            break;

          case "@com.sap.vocabularies.UI.v1.FieldGroup":
            if (!oCapabilities.IntentBasedNavigation) {
              annotationObject.Data = removeIBNAnnotations(annotationObject.Data);
            }

            if (!oCapabilities.MicroChart) {
              annotationObject.Data = removeChartAnnotations(annotationObject.Data);
            }

            break;

          case "@com.sap.vocabularies.UI.v1.PresentationVariant":
            if (!oCapabilities.Chart && annotationObject.Visualizations) {
              annotationObject.Visualizations = handlePresentationVariant(annotationObject.Visualizations);
            }

            break;

          default:
            break;
        }

        annotationObjects[annotationKey] = annotationObject;
        var currentOutAnnotationObject = outAnnotationObject; // Check for annotation of annotation

        var annotationOfAnnotationSplit = annotationKey.split("@");

        if (annotationOfAnnotationSplit.length > 2) {
          currentOutAnnotationObject = _this3.getOrCreateAnnotationList(annotationTarget + "@" + annotationOfAnnotationSplit[1], annotationLists);
          annotationKey = annotationOfAnnotationSplit[2];
        } else {
          annotationKey = annotationOfAnnotationSplit[1];
        }

        var annotationQualifierSplit = annotationKey.split("#");
        var qualifier = annotationQualifierSplit[1];
        annotationKey = annotationQualifierSplit[0];
        var parsedAnnotationObject = {
          term: "".concat(annotationKey),
          qualifier: qualifier
        };
        var currentAnnotationTarget = annotationTarget + "@" + parsedAnnotationObject.term;

        if (qualifier) {
          currentAnnotationTarget += "#" + qualifier;
        }

        var isCollection = false;

        if (annotationObject === null) {
          parsedAnnotationObject.value = {
            type: "Bool",
            Bool: annotationObject
          };
        } else if (typeof annotationObject === "string") {
          parsedAnnotationObject.value = {
            type: "String",
            String: annotationObject
          };
        } else if (typeof annotationObject === "boolean") {
          parsedAnnotationObject.value = {
            type: "Bool",
            Bool: annotationObject
          };
        } else if (typeof annotationObject === "number") {
          parsedAnnotationObject.value = {
            type: "Int",
            Int: annotationObject
          };
        } else if (annotationObject.$If !== undefined) {
          parsedAnnotationObject.value = {
            type: "If",
            If: annotationObject.$If
          };
        } else if (annotationObject.$Apply !== undefined) {
          parsedAnnotationObject.value = {
            type: "Apply",
            Apply: annotationObject.$Apply,
            Function: annotationObject.$Function
          };
        } else if (annotationObject.$Path !== undefined) {
          parsedAnnotationObject.value = {
            type: "Path",
            Path: annotationObject.$Path
          };
        } else if (annotationObject.$AnnotationPath !== undefined) {
          parsedAnnotationObject.value = {
            type: "AnnotationPath",
            AnnotationPath: annotationObject.$AnnotationPath
          };
        } else if (annotationObject.$Decimal !== undefined) {
          parsedAnnotationObject.value = {
            type: "Decimal",
            Decimal: parseFloat(annotationObject.$Decimal)
          };
        } else if (annotationObject.$EnumMember !== undefined) {
          parsedAnnotationObject.value = {
            type: "EnumMember",
            EnumMember: _this3.mapNameToAlias(annotationObject.$EnumMember.split("/")[0]) + "/" + annotationObject.$EnumMember.split("/")[1]
          };
        } else if (Array.isArray(annotationObject)) {
          isCollection = true;
          parsedAnnotationObject.collection = annotationObject.map(function (subAnnotationObject, subAnnotationIndex) {
            return _this3.parseAnnotationObject(subAnnotationObject, currentAnnotationTarget + "/" + subAnnotationIndex, annotationLists, oCapabilities);
          });

          if (annotationObject.length > 0) {
            if (annotationObject[0].hasOwnProperty("$PropertyPath")) {
              parsedAnnotationObject.collection.type = "PropertyPath";
            } else if (annotationObject[0].hasOwnProperty("$Path")) {
              parsedAnnotationObject.collection.type = "Path";
            } else if (annotationObject[0].hasOwnProperty("$NavigationPropertyPath")) {
              parsedAnnotationObject.collection.type = "NavigationPropertyPath";
            } else if (annotationObject[0].hasOwnProperty("$AnnotationPath")) {
              parsedAnnotationObject.collection.type = "AnnotationPath";
            } else if (annotationObject[0].hasOwnProperty("$Type")) {
              parsedAnnotationObject.collection.type = "Record";
            } else if (annotationObject[0].hasOwnProperty("$If")) {
              parsedAnnotationObject.collection.type = "If";
            } else if (annotationObject[0].hasOwnProperty("$Apply")) {
              parsedAnnotationObject.collection.type = "Apply";
            } else if (typeof annotationObject[0] === "object") {
              parsedAnnotationObject.collection.type = "Record";
            } else {
              parsedAnnotationObject.collection.type = "String";
            }
          }
        } else {
          var record = {
            propertyValues: []
          };

          if (annotationObject.$Type) {
            var typeValue = annotationObject.$Type;
            record.type = "".concat(typeValue);
          }

          var propertyValues = [];
          Object.keys(annotationObject).forEach(function (propertyKey) {
            if (propertyKey !== "$Type" && !propertyKey.startsWith("@")) {
              propertyValues.push(_this3.parsePropertyValue(annotationObject[propertyKey], propertyKey, currentAnnotationTarget, annotationLists, oCapabilities));
            } else if (propertyKey.startsWith("@")) {
              // Annotation of record
              _this3.createAnnotationLists(_defineProperty({}, propertyKey, annotationObject[propertyKey]), currentAnnotationTarget, annotationLists, oCapabilities);
            }
          });
          record.propertyValues = propertyValues;
          parsedAnnotationObject.record = record;
        }

        parsedAnnotationObject.isCollection = isCollection;
        currentOutAnnotationObject.annotations.push(parsedAnnotationObject);
      });
    },
    parseProperty: function (oMetaModel, entityTypeObject, propertyName, annotationLists, oCapabilities) {
      var propertyAnnotation = oMetaModel.getObject("/".concat(entityTypeObject.fullyQualifiedName, "/").concat(propertyName, "@"));
      var propertyDefinition = oMetaModel.getObject("/".concat(entityTypeObject.fullyQualifiedName, "/").concat(propertyName));
      var propertyObject = {
        _type: "Property",
        name: propertyName,
        fullyQualifiedName: "".concat(entityTypeObject.fullyQualifiedName, "/").concat(propertyName),
        type: propertyDefinition.$Type,
        maxLength: propertyDefinition.$MaxLength,
        precision: propertyDefinition.$Precision,
        scale: propertyDefinition.$Scale,
        nullable: propertyDefinition.$Nullable
      };
      this.createAnnotationLists(propertyAnnotation, propertyObject.fullyQualifiedName, annotationLists, oCapabilities);
      return propertyObject;
    },
    parseNavigationProperty: function (oMetaModel, entityTypeObject, navPropertyName, annotationLists, oCapabilities) {
      var navPropertyAnnotation = oMetaModel.getObject("/".concat(entityTypeObject.fullyQualifiedName, "/").concat(navPropertyName, "@"));
      var navPropertyDefinition = oMetaModel.getObject("/".concat(entityTypeObject.fullyQualifiedName, "/").concat(navPropertyName));
      var referentialConstraint = [];

      if (navPropertyDefinition.$ReferentialConstraint) {
        referentialConstraint = Object.keys(navPropertyDefinition.$ReferentialConstraint).map(function (sourcePropertyName) {
          return {
            sourceTypeName: entityTypeObject.name,
            sourceProperty: sourcePropertyName,
            targetTypeName: navPropertyDefinition.$Type,
            targetProperty: navPropertyDefinition.$ReferentialConstraint[sourcePropertyName]
          };
        });
      }

      var navigationProperty = {
        _type: "NavigationProperty",
        name: navPropertyName,
        fullyQualifiedName: "".concat(entityTypeObject.fullyQualifiedName, "/").concat(navPropertyName),
        partner: navPropertyDefinition.$Partner,
        isCollection: navPropertyDefinition.$isCollection ? navPropertyDefinition.$isCollection : false,
        containsTarget: navPropertyDefinition.$ContainsTarget,
        targetTypeName: navPropertyDefinition.$Type,
        referentialConstraint: referentialConstraint
      };
      this.createAnnotationLists(navPropertyAnnotation, navigationProperty.fullyQualifiedName, annotationLists, oCapabilities);
      return navigationProperty;
    },
    parseEntitySet: function (oMetaModel, entitySetName, annotationLists, entityContainerName, oCapabilities) {
      var entitySetDefinition = oMetaModel.getObject("/".concat(entitySetName));
      var entitySetAnnotation = oMetaModel.getObject("/".concat(entitySetName, "@"));
      var entitySetObject = {
        _type: "EntitySet",
        name: entitySetName,
        navigationPropertyBinding: {},
        entityTypeName: entitySetDefinition.$Type,
        fullyQualifiedName: "".concat(entityContainerName, "/").concat(entitySetName)
      };
      this.createAnnotationLists(entitySetAnnotation, entitySetObject.fullyQualifiedName, annotationLists, oCapabilities);
      return entitySetObject;
    },
    parseEntityType: function (oMetaModel, entityTypeName, annotationLists, namespace, oCapabilities) {
      var _this4 = this;

      var entityTypeAnnotation = oMetaModel.getObject("/".concat(entityTypeName, "@"));
      var entityTypeDefinition = oMetaModel.getObject("/".concat(entityTypeName));
      var entityKeys = getEntityKeys(entityTypeDefinition);

      function getEntityKeys(entityTypeDefinition) {
        if (!entityTypeDefinition.$Key && entityTypeDefinition.$BaseType) {
          return getEntityKeys(oMetaModel.getObject("/".concat(entityTypeDefinition.$BaseType)));
        }

        return entityTypeDefinition.$Key || []; //handling of entity types without key as well as basetype
      }

      var entityTypeObject = {
        _type: "EntityType",
        name: entityTypeName.replace(namespace + ".", ""),
        fullyQualifiedName: entityTypeName,
        keys: [],
        entityProperties: [],
        navigationProperties: []
      };
      this.createAnnotationLists(entityTypeAnnotation, entityTypeObject.fullyQualifiedName, annotationLists, oCapabilities);
      var entityProperties = Object.keys(entityTypeDefinition).filter(function (propertyNameOrNot) {
        if (propertyNameOrNot != "$Key" && propertyNameOrNot != "$kind") {
          return entityTypeDefinition[propertyNameOrNot].$kind === "Property";
        }
      }).map(function (propertyName) {
        return _this4.parseProperty(oMetaModel, entityTypeObject, propertyName, annotationLists, oCapabilities);
      });
      var navigationProperties = Object.keys(entityTypeDefinition).filter(function (propertyNameOrNot) {
        if (propertyNameOrNot != "$Key" && propertyNameOrNot != "$kind") {
          return entityTypeDefinition[propertyNameOrNot].$kind === "NavigationProperty";
        }
      }).map(function (navPropertyName) {
        return _this4.parseNavigationProperty(oMetaModel, entityTypeObject, navPropertyName, annotationLists, oCapabilities);
      });
      entityTypeObject.keys = entityKeys.map(function (entityKey) {
        return entityProperties.find(function (property) {
          return property.name === entityKey;
        });
      }).filter(function (property) {
        return property !== undefined;
      });
      entityTypeObject.entityProperties = entityProperties;
      entityTypeObject.navigationProperties = navigationProperties;
      return entityTypeObject;
    },
    parseComplexType: function (oMetaModel, complexTypeName, annotationLists, namespace, oCapabilities) {
      var _this5 = this;

      var complexTypeAnnotation = oMetaModel.getObject("/".concat(complexTypeName, "@"));
      var complexTypeDefinition = oMetaModel.getObject("/".concat(complexTypeName));
      var complexTypeObject = {
        _type: "ComplexType",
        name: complexTypeName.replace(namespace + ".", ""),
        fullyQualifiedName: complexTypeName,
        properties: [],
        navigationProperties: []
      };
      this.createAnnotationLists(complexTypeAnnotation, complexTypeObject.fullyQualifiedName, annotationLists, oCapabilities);
      var complexTypeProperties = Object.keys(complexTypeDefinition).filter(function (propertyNameOrNot) {
        if (propertyNameOrNot != "$Key" && propertyNameOrNot != "$kind") {
          return complexTypeDefinition[propertyNameOrNot].$kind === "Property";
        }
      }).map(function (propertyName) {
        return _this5.parseProperty(oMetaModel, complexTypeObject, propertyName, annotationLists, oCapabilities);
      });
      complexTypeObject.properties = complexTypeProperties;
      var complexTypeNavigationProperties = Object.keys(complexTypeDefinition).filter(function (propertyNameOrNot) {
        if (propertyNameOrNot != "$Key" && propertyNameOrNot != "$kind") {
          return complexTypeDefinition[propertyNameOrNot].$kind === "NavigationProperty";
        }
      }).map(function (navPropertyName) {
        return _this5.parseNavigationProperty(oMetaModel, complexTypeObject, navPropertyName, annotationLists, oCapabilities);
      });
      complexTypeObject.navigationProperties = complexTypeNavigationProperties;
      return complexTypeObject;
    },
    parseAction: function (actionName, actionRawData, namespace, entityContainerName) {
      var actionEntityType = "";
      var actionFQN = "".concat(actionName);
      var actionShortName = actionName.substr(namespace.length + 1);

      if (actionRawData.$IsBound) {
        var bindingParameter = actionRawData.$Parameter[0];
        actionEntityType = bindingParameter.$Type;

        if (bindingParameter.$isCollection === true) {
          actionFQN = "".concat(actionName, "(Collection(").concat(actionEntityType, "))");
        } else {
          actionFQN = "".concat(actionName, "(").concat(actionEntityType, ")");
        }
      } else {
        actionFQN = "".concat(entityContainerName, "/").concat(actionShortName);
      }

      var parameters = actionRawData.$Parameter || [];
      return {
        _type: "Action",
        name: actionShortName,
        fullyQualifiedName: actionFQN,
        isBound: actionRawData.$IsBound,
        sourceType: actionEntityType,
        returnType: actionRawData.$ReturnType ? actionRawData.$ReturnType.$Type : "",
        parameters: parameters.map(function (param) {
          return {
            _type: "ActionParameter",
            isEntitySet: param.$Type === actionRawData.$EntitySetPath,
            fullyQualifiedName: "".concat(actionFQN, "/").concat(param.$Name),
            type: param.$Type // TODO missing properties ?

          };
        })
      };
    },
    parseEntityTypes: function (oMetaModel, oInCapabilities) {
      var _this6 = this;

      var oCapabilities;

      if (!oInCapabilities) {
        oCapabilities = DefaultEnvironmentCapabilities;
      } else {
        oCapabilities = oInCapabilities;
      }

      var oMetaModelData = oMetaModel.getObject("/$");
      var oEntitySets = oMetaModel.getObject("/");
      var annotationLists = [];
      var entityTypes = [];
      var entitySets = [];
      var complexTypes = [];
      var entityContainerName = oMetaModelData.$EntityContainer;
      var namespace = "";
      var schemaKeys = Object.keys(oMetaModelData).filter(function (metamodelKey) {
        return oMetaModelData[metamodelKey].$kind === "Schema";
      });

      if (schemaKeys && schemaKeys.length > 0) {
        namespace = schemaKeys[0].substr(0, schemaKeys[0].length - 1);
      } else if (entityTypes && entityTypes.length) {
        namespace = entityTypes[0].fullyQualifiedName.replace(entityTypes[0].name, "");
        namespace = namespace.substr(0, namespace.length - 1);
      }

      Object.keys(oMetaModelData).filter(function (entityTypeName) {
        return entityTypeName !== "$kind" && oMetaModelData[entityTypeName].$kind === "EntityType";
      }).forEach(function (entityTypeName) {
        var entityType = _this6.parseEntityType(oMetaModel, entityTypeName, annotationLists, namespace, oCapabilities);

        entityType.entityProperties.forEach(function (entityProperty) {
          if (!oMetaModelData.$Annotations[entityProperty.fullyQualifiedName]) {
            oMetaModelData.$Annotations[entityProperty.fullyQualifiedName] = {};
          }

          if (!oMetaModelData.$Annotations[entityProperty.fullyQualifiedName]["@com.sap.vocabularies.UI.v1.DataFieldDefault"]) {
            oMetaModelData.$Annotations[entityProperty.fullyQualifiedName]["@com.sap.vocabularies.UI.v1.DataFieldDefault"] = {
              $Type: "com.sap.vocabularies.UI.v1.DataField",
              Value: {
                $Path: entityProperty.name
              }
            };

            _this6.createAnnotationLists({
              "@com.sap.vocabularies.UI.v1.DataFieldDefault": oMetaModelData.$Annotations[entityProperty.fullyQualifiedName]["@com.sap.vocabularies.UI.v1.DataFieldDefault"]
            }, entityProperty.fullyQualifiedName, annotationLists, oCapabilities);
          }
        });
        entityTypes.push(entityType);
      });
      Object.keys(oEntitySets).filter(function (entitySetName) {
        return entitySetName !== "$kind" && oEntitySets[entitySetName].$kind === "EntitySet";
      }).forEach(function (entitySetName) {
        var entitySet = _this6.parseEntitySet(oMetaModel, entitySetName, annotationLists, entityContainerName, oCapabilities);

        entitySets.push(entitySet);
      });
      Object.keys(oMetaModelData).filter(function (complexTypeName) {
        return complexTypeName !== "$kind" && oMetaModelData[complexTypeName].$kind === "ComplexType";
      }).forEach(function (complexTypeName) {
        var complexType = _this6.parseComplexType(oMetaModel, complexTypeName, annotationLists, namespace, oCapabilities);

        complexTypes.push(complexType);
      });
      var oEntityContainerName = Object.keys(oMetaModelData).find(function (entityContainerName) {
        return entityContainerName !== "$kind" && oMetaModelData[entityContainerName].$kind === "EntityContainer";
      });
      var entityContainer = {};

      if (oEntityContainerName) {
        entityContainer = {
          name: oEntityContainerName.replace(namespace + ".", ""),
          fullyQualifiedName: oEntityContainerName
        };
      }

      entitySets.forEach(function (entitySet) {
        var navPropertyBindings = oMetaModelData[entityContainerName][entitySet.name].$NavigationPropertyBinding;

        if (navPropertyBindings) {
          Object.keys(navPropertyBindings).forEach(function (navPropName) {
            var targetEntitySet = entitySets.find(function (entitySetName) {
              return entitySetName.name === navPropertyBindings[navPropName];
            });

            if (targetEntitySet) {
              entitySet.navigationPropertyBinding[navPropName] = targetEntitySet;
            }
          });
        }
      });
      var actions = Object.keys(oMetaModelData).filter(function (key) {
        return Array.isArray(oMetaModelData[key]) && oMetaModelData[key].length > 0 && oMetaModelData[key][0].$kind === "Action";
      }).reduce(function (outActions, actionName) {
        var actions = oMetaModelData[actionName];
        actions.forEach(function (action) {
          outActions.push(_this6.parseAction(actionName, action, namespace, entityContainerName));
        });
        return outActions;
      }, []); // FIXME Crappy code to deal with annotations for functions

      var annotations = oMetaModelData.$Annotations;
      var actionAnnotations = Object.keys(annotations).filter(function (target) {
        return target.indexOf("(") !== -1;
      });
      actionAnnotations.forEach(function (target) {
        _this6.createAnnotationLists(oMetaModelData.$Annotations[target], target, annotationLists, oCapabilities);
      });
      var entityContainerAnnotations = annotations[entityContainerName]; // Retrieve Entity Container annotations

      if (entityContainerAnnotations) {
        this.createAnnotationLists(entityContainerAnnotations, entityContainerName, annotationLists, oCapabilities);
      } // Sort by target length


      annotationLists = annotationLists.sort(function (a, b) {
        return a.target.length >= b.target.length ? 1 : -1;
      });
      var references = [];
      return {
        identification: "metamodelResult",
        version: "4.0",
        schema: {
          entityContainer: entityContainer,
          entitySets: entitySets,
          entityTypes: entityTypes,
          complexTypes: complexTypes,
          associations: [],
          actions: actions,
          namespace: namespace,
          annotations: {
            "metamodelResult": annotationLists
          }
        },
        references: references
      };
    }
  };
  var mMetaModelMap = {};
  /**
   * Convert the ODataMetaModel into another format that allow for easy manipulation of the annotations.
   *
   * @param {ODataMetaModel} oMetaModel the current oDataMetaModel
   * @param oCapabilities the current capabilities
   * @returns {ConverterOutput} an object containing object like annotation
   */

  function convertTypes(oMetaModel, oCapabilities) {
    var sMetaModelId = oMetaModel.id;

    if (!mMetaModelMap.hasOwnProperty(sMetaModelId)) {
      var parsedOutput = MetaModelConverter.parseEntityTypes(oMetaModel, oCapabilities);
      mMetaModelMap[sMetaModelId] = AnnotationConverter.convertTypes(parsedOutput);
    }

    return mMetaModelMap[sMetaModelId];
  }

  _exports.convertTypes = convertTypes;

  function deleteModelCacheData(oMetaModel) {
    delete mMetaModelMap[oMetaModel.id];
  }

  _exports.deleteModelCacheData = deleteModelCacheData;

  function convertMetaModelContext(oMetaModelContext) {
    var bIncludeVisitedObjects = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var oConverterOutput = convertTypes(oMetaModelContext.getModel());
    var sPath = oMetaModelContext.getPath();
    var aPathSplit = sPath.split("/");
    var targetEntitySet = oConverterOutput.entitySets.find(function (entitySet) {
      return entitySet.name === aPathSplit[1];
    });
    var relativePath = aPathSplit.slice(2).join("/");
    var localObjects = [targetEntitySet];

    var _loop = function () {
      var relativeSplit = relativePath.split("/");
      var targetNavProp = targetEntitySet.entityType.navigationProperties.find(function (navProp) {
        return navProp.name === relativeSplit[1];
      });

      if (targetNavProp) {
        localObjects.push(targetNavProp);
      }

      targetEntitySet = targetEntitySet.navigationPropertyBinding[relativeSplit[1]];
      localObjects.push(targetEntitySet);
      relativePath = relativeSplit.slice(2).join("/");
    };

    while (relativePath && relativePath.length > 0 && relativePath.startsWith("$NavigationPropertyBinding")) {
      _loop();
    }

    if (relativePath.startsWith("$Type")) {
      // We're anyway going to look on the entityType...
      relativePath = aPathSplit.slice(3).join("/");
    }

    if (targetEntitySet && relativePath.length) {
      var oTarget = targetEntitySet.entityType.resolvePath(relativePath, bIncludeVisitedObjects);

      if (oTarget) {
        if (bIncludeVisitedObjects) {
          oTarget.visitedObjects = localObjects.concat(oTarget.visitedObjects);
        }
      } else if (targetEntitySet.entityType && targetEntitySet.entityType.actions) {
        // if target is an action or an action parameter
        var actions = targetEntitySet.entityType && targetEntitySet.entityType.actions;
        var relativeSplit = relativePath.split("/");

        if (actions[relativeSplit[0]]) {
          var action = actions[relativeSplit[0]];

          if (relativeSplit[1] && action.parameters) {
            var parameterName = relativeSplit[1];
            var targetParameter = action.parameters.find(function (parameter) {
              return parameter.fullyQualifiedName.endsWith("/" + parameterName);
            });
            return targetParameter;
          } else if (relativePath.length === 1) {
            return action;
          }
        }
      }

      return oTarget;
    } else {
      if (bIncludeVisitedObjects) {
        return {
          target: targetEntitySet,
          visitedObjects: localObjects
        };
      }

      return targetEntitySet;
    }
  }

  _exports.convertMetaModelContext = convertMetaModelContext;

  function getInvolvedDataModelObjects(oMetaModelContext, oEntitySetMetaModelContext) {
    var metaModelContext = convertMetaModelContext(oMetaModelContext, true);
    var targetEntitySetLocation;

    if (oEntitySetMetaModelContext && oEntitySetMetaModelContext.getPath() !== "/") {
      targetEntitySetLocation = getInvolvedDataModelObjects(oEntitySetMetaModelContext);
    }

    return getInvolvedDataModelObjectFromPath(metaModelContext, targetEntitySetLocation);
  }

  _exports.getInvolvedDataModelObjects = getInvolvedDataModelObjects;

  function getInvolvedDataModelObjectFromPath(metaModelContext, targetEntitySetLocation) {
    var dataModelObjects = metaModelContext.visitedObjects.filter(function (visitedObject) {
      return visitedObject && visitedObject.hasOwnProperty("_type") && visitedObject._type !== "EntityType";
    });

    if (metaModelContext.target && metaModelContext.target.hasOwnProperty("_type") && metaModelContext.target._type !== "EntityType") {
      dataModelObjects.push(metaModelContext.target);
    }

    var navigationProperties = [];
    var rootEntitySet = dataModelObjects[0]; // currentEntitySet can be undefined.

    var currentEntitySet = rootEntitySet;
    var currentEntityType = rootEntitySet.entityType;
    var i = 1;
    var currentObject;
    var navigatedPaths = [];

    while (i < dataModelObjects.length) {
      currentObject = dataModelObjects[i++];

      if (currentObject._type === "NavigationProperty") {
        navigatedPaths.push(currentObject.name);
        navigationProperties.push(currentObject);
        currentEntityType = currentObject.targetType;

        if (currentEntitySet && currentEntitySet.navigationPropertyBinding.hasOwnProperty(navigatedPaths.join("/"))) {
          currentEntitySet = currentEntitySet.navigationPropertyBinding[currentObject.name];
          navigatedPaths = [];
        } else {
          currentEntitySet = undefined;
        }
      }

      if (currentObject._type === "EntitySet") {
        currentEntitySet = currentObject;
        currentEntityType = currentEntitySet.entityType;
      }
    }

    if (targetEntitySetLocation && targetEntitySetLocation.startingEntitySet !== rootEntitySet) {
      // In case the entityset is not starting from the same location it may mean that we are doing too much work earlier for some reason
      // As such we need to redefine the context source for the targetEntitySetLocation
      var startingIndex = dataModelObjects.indexOf(targetEntitySetLocation.startingEntitySet);

      if (startingIndex !== -1) {
        // If it's not found I don't know what we can do (probably nothing)
        var requiredDataModelObjects = dataModelObjects.slice(0, startingIndex);
        targetEntitySetLocation.startingEntitySet = rootEntitySet;
        targetEntitySetLocation.navigationProperties = requiredDataModelObjects.filter(function (object) {
          return object._type === "NavigationProperty";
        }).concat(targetEntitySetLocation.navigationProperties);
      }
    }

    var outDataModelPath = {
      startingEntitySet: rootEntitySet,
      targetEntitySet: currentEntitySet,
      targetEntityType: currentEntityType,
      targetObject: metaModelContext.target,
      navigationProperties: navigationProperties,
      contextLocation: targetEntitySetLocation
    };

    if (!outDataModelPath.contextLocation) {
      outDataModelPath.contextLocation = outDataModelPath;
    }

    return outDataModelPath;
  }

  _exports.getInvolvedDataModelObjectFromPath = getInvolvedDataModelObjectFromPath;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1ldGFNb2RlbENvbnZlcnRlci50cyJdLCJuYW1lcyI6WyJWT0NBQlVMQVJZX0FMSUFTIiwiRGVmYXVsdEVudmlyb25tZW50Q2FwYWJpbGl0aWVzIiwiQ2hhcnQiLCJNaWNyb0NoYXJ0IiwiVVNoZWxsIiwiSW50ZW50QmFzZWROYXZpZ2F0aW9uIiwiTWV0YU1vZGVsQ29udmVydGVyIiwicGFyc2VQcm9wZXJ0eVZhbHVlIiwiYW5ub3RhdGlvbk9iamVjdCIsInByb3BlcnR5S2V5IiwiY3VycmVudFRhcmdldCIsImFubm90YXRpb25zTGlzdHMiLCJvQ2FwYWJpbGl0aWVzIiwidmFsdWUiLCJjdXJyZW50UHJvcGVydHlUYXJnZXQiLCJ0eXBlIiwiTnVsbCIsIlN0cmluZyIsIkJvb2wiLCJJbnQiLCJBcnJheSIsImlzQXJyYXkiLCJDb2xsZWN0aW9uIiwibWFwIiwic3ViQW5ub3RhdGlvbk9iamVjdCIsInN1YkFubm90YXRpb25PYmplY3RJbmRleCIsInBhcnNlQW5ub3RhdGlvbk9iamVjdCIsImxlbmd0aCIsImhhc093blByb3BlcnR5IiwiJFBhdGgiLCJ1bmRlZmluZWQiLCJQYXRoIiwiJERlY2ltYWwiLCJEZWNpbWFsIiwicGFyc2VGbG9hdCIsIiRQcm9wZXJ0eVBhdGgiLCJQcm9wZXJ0eVBhdGgiLCIkTmF2aWdhdGlvblByb3BlcnR5UGF0aCIsIk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgiLCIkSWYiLCJJZiIsIiRBcHBseSIsIkFwcGx5IiwiRnVuY3Rpb24iLCIkRnVuY3Rpb24iLCIkQW5ub3RhdGlvblBhdGgiLCJBbm5vdGF0aW9uUGF0aCIsIiRFbnVtTWVtYmVyIiwiRW51bU1lbWJlciIsIm1hcE5hbWVUb0FsaWFzIiwic3BsaXQiLCIkVHlwZSIsIlJlY29yZCIsIm5hbWUiLCJhbm5vdGF0aW9uTmFtZSIsInBhdGhQYXJ0IiwiYW5ub1BhcnQiLCJsYXN0RG90IiwibGFzdEluZGV4T2YiLCJzdWJzdHIiLCJjdXJyZW50T2JqZWN0VGFyZ2V0IiwicGFyc2VkQW5ub3RhdGlvbk9iamVjdCIsInBhcnNlZEFubm90YXRpb25Db2xsZWN0aW9uIiwiY29sbGVjdGlvbiIsInN1YkFubm90YXRpb25JbmRleCIsInR5cGVWYWx1ZSIsInByb3BlcnR5VmFsdWVzIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJzdGFydHNXaXRoIiwicHVzaCIsImNyZWF0ZUFubm90YXRpb25MaXN0cyIsImdldE9yQ3JlYXRlQW5ub3RhdGlvbkxpc3QiLCJ0YXJnZXQiLCJwb3RlbnRpYWxUYXJnZXQiLCJmaW5kIiwiYW5ub3RhdGlvbkxpc3QiLCJhbm5vdGF0aW9ucyIsImFubm90YXRpb25PYmplY3RzIiwiYW5ub3RhdGlvblRhcmdldCIsImFubm90YXRpb25MaXN0cyIsIm91dEFubm90YXRpb25PYmplY3QiLCJyZW1vdmVDaGFydEFubm90YXRpb25zIiwiZmlsdGVyIiwib1JlY29yZCIsIlRhcmdldCIsImluZGV4T2YiLCJyZW1vdmVJQk5Bbm5vdGF0aW9ucyIsImhhbmRsZVByZXNlbnRhdGlvblZhcmlhbnQiLCJhbm5vdGF0aW9uS2V5IiwiRGF0YSIsIlZpc3VhbGl6YXRpb25zIiwiY3VycmVudE91dEFubm90YXRpb25PYmplY3QiLCJhbm5vdGF0aW9uT2ZBbm5vdGF0aW9uU3BsaXQiLCJhbm5vdGF0aW9uUXVhbGlmaWVyU3BsaXQiLCJxdWFsaWZpZXIiLCJ0ZXJtIiwiY3VycmVudEFubm90YXRpb25UYXJnZXQiLCJpc0NvbGxlY3Rpb24iLCJyZWNvcmQiLCJwYXJzZVByb3BlcnR5Iiwib01ldGFNb2RlbCIsImVudGl0eVR5cGVPYmplY3QiLCJwcm9wZXJ0eU5hbWUiLCJwcm9wZXJ0eUFubm90YXRpb24iLCJnZXRPYmplY3QiLCJmdWxseVF1YWxpZmllZE5hbWUiLCJwcm9wZXJ0eURlZmluaXRpb24iLCJwcm9wZXJ0eU9iamVjdCIsIl90eXBlIiwibWF4TGVuZ3RoIiwiJE1heExlbmd0aCIsInByZWNpc2lvbiIsIiRQcmVjaXNpb24iLCJzY2FsZSIsIiRTY2FsZSIsIm51bGxhYmxlIiwiJE51bGxhYmxlIiwicGFyc2VOYXZpZ2F0aW9uUHJvcGVydHkiLCJuYXZQcm9wZXJ0eU5hbWUiLCJuYXZQcm9wZXJ0eUFubm90YXRpb24iLCJuYXZQcm9wZXJ0eURlZmluaXRpb24iLCJyZWZlcmVudGlhbENvbnN0cmFpbnQiLCIkUmVmZXJlbnRpYWxDb25zdHJhaW50Iiwic291cmNlUHJvcGVydHlOYW1lIiwic291cmNlVHlwZU5hbWUiLCJzb3VyY2VQcm9wZXJ0eSIsInRhcmdldFR5cGVOYW1lIiwidGFyZ2V0UHJvcGVydHkiLCJuYXZpZ2F0aW9uUHJvcGVydHkiLCJwYXJ0bmVyIiwiJFBhcnRuZXIiLCIkaXNDb2xsZWN0aW9uIiwiY29udGFpbnNUYXJnZXQiLCIkQ29udGFpbnNUYXJnZXQiLCJwYXJzZUVudGl0eVNldCIsImVudGl0eVNldE5hbWUiLCJlbnRpdHlDb250YWluZXJOYW1lIiwiZW50aXR5U2V0RGVmaW5pdGlvbiIsImVudGl0eVNldEFubm90YXRpb24iLCJlbnRpdHlTZXRPYmplY3QiLCJuYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nIiwiZW50aXR5VHlwZU5hbWUiLCJwYXJzZUVudGl0eVR5cGUiLCJuYW1lc3BhY2UiLCJlbnRpdHlUeXBlQW5ub3RhdGlvbiIsImVudGl0eVR5cGVEZWZpbml0aW9uIiwiZW50aXR5S2V5cyIsImdldEVudGl0eUtleXMiLCIkS2V5IiwiJEJhc2VUeXBlIiwicmVwbGFjZSIsImVudGl0eVByb3BlcnRpZXMiLCJuYXZpZ2F0aW9uUHJvcGVydGllcyIsInByb3BlcnR5TmFtZU9yTm90IiwiJGtpbmQiLCJlbnRpdHlLZXkiLCJwcm9wZXJ0eSIsInBhcnNlQ29tcGxleFR5cGUiLCJjb21wbGV4VHlwZU5hbWUiLCJjb21wbGV4VHlwZUFubm90YXRpb24iLCJjb21wbGV4VHlwZURlZmluaXRpb24iLCJjb21wbGV4VHlwZU9iamVjdCIsInByb3BlcnRpZXMiLCJjb21wbGV4VHlwZVByb3BlcnRpZXMiLCJjb21wbGV4VHlwZU5hdmlnYXRpb25Qcm9wZXJ0aWVzIiwicGFyc2VBY3Rpb24iLCJhY3Rpb25OYW1lIiwiYWN0aW9uUmF3RGF0YSIsImFjdGlvbkVudGl0eVR5cGUiLCJhY3Rpb25GUU4iLCJhY3Rpb25TaG9ydE5hbWUiLCIkSXNCb3VuZCIsImJpbmRpbmdQYXJhbWV0ZXIiLCIkUGFyYW1ldGVyIiwicGFyYW1ldGVycyIsImlzQm91bmQiLCJzb3VyY2VUeXBlIiwicmV0dXJuVHlwZSIsIiRSZXR1cm5UeXBlIiwicGFyYW0iLCJpc0VudGl0eVNldCIsIiRFbnRpdHlTZXRQYXRoIiwiJE5hbWUiLCJwYXJzZUVudGl0eVR5cGVzIiwib0luQ2FwYWJpbGl0aWVzIiwib01ldGFNb2RlbERhdGEiLCJvRW50aXR5U2V0cyIsImVudGl0eVR5cGVzIiwiZW50aXR5U2V0cyIsImNvbXBsZXhUeXBlcyIsIiRFbnRpdHlDb250YWluZXIiLCJzY2hlbWFLZXlzIiwibWV0YW1vZGVsS2V5IiwiZW50aXR5VHlwZSIsImVudGl0eVByb3BlcnR5IiwiJEFubm90YXRpb25zIiwiVmFsdWUiLCJlbnRpdHlTZXQiLCJjb21wbGV4VHlwZSIsIm9FbnRpdHlDb250YWluZXJOYW1lIiwiZW50aXR5Q29udGFpbmVyIiwibmF2UHJvcGVydHlCaW5kaW5ncyIsIiROYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nIiwibmF2UHJvcE5hbWUiLCJ0YXJnZXRFbnRpdHlTZXQiLCJhY3Rpb25zIiwia2V5IiwicmVkdWNlIiwib3V0QWN0aW9ucyIsImFjdGlvbiIsImFjdGlvbkFubm90YXRpb25zIiwiZW50aXR5Q29udGFpbmVyQW5ub3RhdGlvbnMiLCJzb3J0IiwiYSIsImIiLCJyZWZlcmVuY2VzIiwiaWRlbnRpZmljYXRpb24iLCJ2ZXJzaW9uIiwic2NoZW1hIiwiYXNzb2NpYXRpb25zIiwibU1ldGFNb2RlbE1hcCIsImNvbnZlcnRUeXBlcyIsInNNZXRhTW9kZWxJZCIsImlkIiwicGFyc2VkT3V0cHV0IiwiQW5ub3RhdGlvbkNvbnZlcnRlciIsImRlbGV0ZU1vZGVsQ2FjaGVEYXRhIiwiY29udmVydE1ldGFNb2RlbENvbnRleHQiLCJvTWV0YU1vZGVsQ29udGV4dCIsImJJbmNsdWRlVmlzaXRlZE9iamVjdHMiLCJvQ29udmVydGVyT3V0cHV0IiwiZ2V0TW9kZWwiLCJzUGF0aCIsImdldFBhdGgiLCJhUGF0aFNwbGl0IiwicmVsYXRpdmVQYXRoIiwic2xpY2UiLCJqb2luIiwibG9jYWxPYmplY3RzIiwicmVsYXRpdmVTcGxpdCIsInRhcmdldE5hdlByb3AiLCJuYXZQcm9wIiwib1RhcmdldCIsInJlc29sdmVQYXRoIiwidmlzaXRlZE9iamVjdHMiLCJjb25jYXQiLCJwYXJhbWV0ZXJOYW1lIiwidGFyZ2V0UGFyYW1ldGVyIiwicGFyYW1ldGVyIiwiZW5kc1dpdGgiLCJnZXRJbnZvbHZlZERhdGFNb2RlbE9iamVjdHMiLCJvRW50aXR5U2V0TWV0YU1vZGVsQ29udGV4dCIsIm1ldGFNb2RlbENvbnRleHQiLCJ0YXJnZXRFbnRpdHlTZXRMb2NhdGlvbiIsImdldEludm9sdmVkRGF0YU1vZGVsT2JqZWN0RnJvbVBhdGgiLCJkYXRhTW9kZWxPYmplY3RzIiwidmlzaXRlZE9iamVjdCIsInJvb3RFbnRpdHlTZXQiLCJjdXJyZW50RW50aXR5U2V0IiwiY3VycmVudEVudGl0eVR5cGUiLCJpIiwiY3VycmVudE9iamVjdCIsIm5hdmlnYXRlZFBhdGhzIiwidGFyZ2V0VHlwZSIsInN0YXJ0aW5nRW50aXR5U2V0Iiwic3RhcnRpbmdJbmRleCIsInJlcXVpcmVkRGF0YU1vZGVsT2JqZWN0cyIsIm9iamVjdCIsIm91dERhdGFNb2RlbFBhdGgiLCJ0YXJnZXRFbnRpdHlUeXBlIiwidGFyZ2V0T2JqZWN0IiwiY29udGV4dExvY2F0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBd0JBLE1BQU1BLGdCQUFxQixHQUFHO0FBQzdCLGlDQUE2QixjQURBO0FBRTdCLHlCQUFxQixNQUZRO0FBRzdCLDZCQUF5QixVQUhJO0FBSTdCLHNDQUFrQyxRQUpMO0FBSzdCLGtDQUE4QixJQUxEO0FBTTdCLHVDQUFt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Q1EsdUJBQXVCLENBQUNyRyxvQkFGYyxDQUEvQztBQUdBO0FBQ0Q7O0FBQ0QsUUFBTW9ILGdCQUFnQixHQUFHO0FBQ3hCSixNQUFBQSxpQkFBaUIsRUFBRVAsYUFESztBQUV4QnJELE1BQUFBLGVBQWUsRUFBRXNELGdCQUZPO0FBR3hCVyxNQUFBQSxnQkFBZ0IsRUFBRVYsaUJBSE07QUFJeEJXLE1BQUFBLFlBQVksRUFBRWxCLGdCQUFnQixDQUFDcEwsTUFKUDtBQUt4QmdGLE1BQUFBLG9CQUFvQixFQUFwQkEsb0JBTHdCO0FBTXhCdUgsTUFBQUEsZUFBZSxFQUFFbEI7QUFOTyxLQUF6Qjs7QUFRQSxRQUFJLENBQUNlLGdCQUFnQixDQUFDRyxlQUF0QixFQUF1QztBQUN0Q0gsTUFBQUEsZ0JBQWdCLENBQUNHLGVBQWpCLEdBQW1DSCxnQkFBbkM7QUFDQTs7QUFDRCxXQUFPQSxnQkFBUDtBQUNBIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBbm5vdGF0aW9uLCBBbm5vdGF0aW9uTGlzdCwgQW5ub3RhdGlvblJlY29yZCwgRXhwcmVzc2lvbiwgUGFyc2VyT3V0cHV0IH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzXCI7XG4vLyBUaGlzIGZpbGUgaXMgcmV0cmlldmVkIGZyb20gQHNhcC11eC9hbm5vdGF0aW9uLWNvbnZlcnRlciwgc2hhcmVkIGNvZGUgd2l0aCB0b29sIHN1aXRlXG5pbXBvcnQgeyBBbm5vdGF0aW9uQ29udmVydGVyIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvY29tbW9uXCI7XG5pbXBvcnQgeyBPRGF0YU1ldGFNb2RlbCB9IGZyb20gXCJzYXAvdWkvbW9kZWwvb2RhdGEvdjRcIjtcbmltcG9ydCB7XG5cdENvbnZlcnRlck91dHB1dCxcblx0RW50aXR5U2V0IGFzIF9FbnRpdHlTZXQsXG5cdEVudGl0eVR5cGUgYXMgX0VudGl0eVR5cGUsXG5cdE5hdmlnYXRpb25Qcm9wZXJ0eSBhcyBfTmF2aWdhdGlvblByb3BlcnR5XG59IGZyb20gXCJAc2FwLXV4L2Fubm90YXRpb24tY29udmVydGVyXCI7XG5pbXBvcnQge1xuXHRFbnRpdHlUeXBlLFxuXHRFbnRpdHlTZXQsXG5cdFByb3BlcnR5LFxuXHRDb21wbGV4VHlwZSxcblx0UmVmZXJlbnRpYWxDb25zdHJhaW50LFxuXHRWNE5hdmlnYXRpb25Qcm9wZXJ0eSxcblx0QWN0aW9uLFxuXHRSZWZlcmVuY2UsXG5cdEVudGl0eUNvbnRhaW5lclxufSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXMvZGlzdC9QYXJzZXJcIjtcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwic2FwL3VpL21vZGVsXCI7XG5pbXBvcnQgeyBEYXRhTW9kZWxPYmplY3RQYXRoIH0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvRGF0YU1vZGVsUGF0aEhlbHBlclwiO1xuXG5jb25zdCBWT0NBQlVMQVJZX0FMSUFTOiBhbnkgPSB7XG5cdFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMVwiOiBcIkNhcGFiaWxpdGllc1wiLFxuXHRcIk9yZy5PRGF0YS5Db3JlLlYxXCI6IFwiQ29yZVwiLFxuXHRcIk9yZy5PRGF0YS5NZWFzdXJlcy5WMVwiOiBcIk1lYXN1cmVzXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxXCI6IFwiQ29tbW9uXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjFcIjogXCJVSVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlNlc3Npb24udjFcIjogXCJTZXNzaW9uXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQW5hbHl0aWNzLnYxXCI6IFwiQW5hbHl0aWNzXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuUGVyc29uYWxEYXRhLnYxXCI6IFwiUGVyc29uYWxEYXRhXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbXVuaWNhdGlvbi52MVwiOiBcIkNvbW11bmljYXRpb25cIlxufTtcblxuZXhwb3J0IHR5cGUgRW52aXJvbm1lbnRDYXBhYmlsaXRpZXMgPSB7XG5cdENoYXJ0OiBib29sZWFuO1xuXHRNaWNyb0NoYXJ0OiBib29sZWFuO1xuXHRVU2hlbGw6IGJvb2xlYW47XG5cdEludGVudEJhc2VkTmF2aWdhdGlvbjogYm9vbGVhbjtcbn07XG5cbmV4cG9ydCBjb25zdCBEZWZhdWx0RW52aXJvbm1lbnRDYXBhYmlsaXRpZXMgPSB7XG5cdENoYXJ0OiB0cnVlLFxuXHRNaWNyb0NoYXJ0OiB0cnVlLFxuXHRVU2hlbGw6IHRydWUsXG5cdEludGVudEJhc2VkTmF2aWdhdGlvbjogdHJ1ZVxufTtcblxudHlwZSBNZXRhTW9kZWxBY3Rpb24gPSB7XG5cdCRraW5kOiBcIkFjdGlvblwiO1xuXHQkSXNCb3VuZDogYm9vbGVhbjtcblx0JEVudGl0eVNldFBhdGg6IHN0cmluZztcblx0JFBhcmFtZXRlcjoge1xuXHRcdCRUeXBlOiBzdHJpbmc7XG5cdFx0JE5hbWU6IHN0cmluZztcblx0XHQkTnVsbGFibGU/OiBib29sZWFuO1xuXHRcdCRNYXhMZW5ndGg/OiBudW1iZXI7XG5cdFx0JFByZWNpc2lvbj86IG51bWJlcjtcblx0XHQkU2NhbGU/OiBudW1iZXI7XG5cdFx0JGlzQ29sbGVjdGlvbj86IGJvb2xlYW47XG5cdH1bXTtcblx0JFJldHVyblR5cGU6IHtcblx0XHQkVHlwZTogc3RyaW5nO1xuXHR9O1xufTtcblxuY29uc3QgTWV0YU1vZGVsQ29udmVydGVyID0ge1xuXHRwYXJzZVByb3BlcnR5VmFsdWUoXG5cdFx0YW5ub3RhdGlvbk9iamVjdDogYW55LFxuXHRcdHByb3BlcnR5S2V5OiBzdHJpbmcsXG5cdFx0Y3VycmVudFRhcmdldDogc3RyaW5nLFxuXHRcdGFubm90YXRpb25zTGlzdHM6IGFueVtdLFxuXHRcdG9DYXBhYmlsaXRpZXM6IEVudmlyb25tZW50Q2FwYWJpbGl0aWVzXG5cdCk6IGFueSB7XG5cdFx0bGV0IHZhbHVlO1xuXHRcdGNvbnN0IGN1cnJlbnRQcm9wZXJ0eVRhcmdldDogc3RyaW5nID0gY3VycmVudFRhcmdldCArIFwiL1wiICsgcHJvcGVydHlLZXk7XG5cdFx0aWYgKGFubm90YXRpb25PYmplY3QgPT09IG51bGwpIHtcblx0XHRcdHZhbHVlID0geyB0eXBlOiBcIk51bGxcIiwgTnVsbDogbnVsbCB9O1xuXHRcdH0gZWxzZSBpZiAodHlwZW9mIGFubm90YXRpb25PYmplY3QgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdHZhbHVlID0geyB0eXBlOiBcIlN0cmluZ1wiLCBTdHJpbmc6IGFubm90YXRpb25PYmplY3QgfTtcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBhbm5vdGF0aW9uT2JqZWN0ID09PSBcImJvb2xlYW5cIikge1xuXHRcdFx0dmFsdWUgPSB7IHR5cGU6IFwiQm9vbFwiLCBCb29sOiBhbm5vdGF0aW9uT2JqZWN0IH07XG5cdFx0fSBlbHNlIGlmICh0eXBlb2YgYW5ub3RhdGlvbk9iamVjdCA9PT0gXCJudW1iZXJcIikge1xuXHRcdFx0dmFsdWUgPSB7IHR5cGU6IFwiSW50XCIsIEludDogYW5ub3RhdGlvbk9iamVjdCB9O1xuXHRcdH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShhbm5vdGF0aW9uT2JqZWN0KSkge1xuXHRcdFx0dmFsdWUgPSB7XG5cdFx0XHRcdHR5cGU6IFwiQ29sbGVjdGlvblwiLFxuXHRcdFx0XHRDb2xsZWN0aW9uOiBhbm5vdGF0aW9uT2JqZWN0Lm1hcCgoc3ViQW5ub3RhdGlvbk9iamVjdCwgc3ViQW5ub3RhdGlvbk9iamVjdEluZGV4KSA9PlxuXHRcdFx0XHRcdHRoaXMucGFyc2VBbm5vdGF0aW9uT2JqZWN0KFxuXHRcdFx0XHRcdFx0c3ViQW5ub3RhdGlvbk9iamVjdCxcblx0XHRcdFx0XHRcdGN1cnJlbnRQcm9wZXJ0eVRhcmdldCArIFwiL1wiICsgc3ViQW5ub3RhdGlvbk9iamVjdEluZGV4LFxuXHRcdFx0XHRcdFx0YW5ub3RhdGlvbnNMaXN0cyxcblx0XHRcdFx0XHRcdG9DYXBhYmlsaXRpZXNcblx0XHRcdFx0XHQpXG5cdFx0XHRcdClcblx0XHRcdH07XG5cdFx0XHRpZiAoYW5ub3RhdGlvbk9iamVjdC5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJFByb3BlcnR5UGF0aFwiKSkge1xuXHRcdFx0XHRcdCh2YWx1ZS5Db2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiUHJvcGVydHlQYXRoXCI7XG5cdFx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRQYXRoXCIpKSB7XG5cdFx0XHRcdFx0KHZhbHVlLkNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJQYXRoXCI7XG5cdFx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiROYXZpZ2F0aW9uUHJvcGVydHlQYXRoXCIpKSB7XG5cdFx0XHRcdFx0KHZhbHVlLkNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJOYXZpZ2F0aW9uUHJvcGVydHlQYXRoXCI7XG5cdFx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRBbm5vdGF0aW9uUGF0aFwiKSkge1xuXHRcdFx0XHRcdCh2YWx1ZS5Db2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiQW5ub3RhdGlvblBhdGhcIjtcblx0XHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJFR5cGVcIikpIHtcblx0XHRcdFx0XHQodmFsdWUuQ29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIlJlY29yZFwiO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkSWZcIikpIHtcblx0XHRcdFx0XHQodmFsdWUuQ29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIklmXCI7XG5cdFx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRBcHBseVwiKSkge1xuXHRcdFx0XHRcdCh2YWx1ZS5Db2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiQXBwbHlcIjtcblx0XHRcdFx0fSBlbHNlIGlmICh0eXBlb2YgYW5ub3RhdGlvbk9iamVjdFswXSA9PT0gXCJvYmplY3RcIikge1xuXHRcdFx0XHRcdC8vICRUeXBlIGlzIG9wdGlvbmFsLi4uXG5cdFx0XHRcdFx0KHZhbHVlLkNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJSZWNvcmRcIjtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQodmFsdWUuQ29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIlN0cmluZ1wiO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRQYXRoICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHZhbHVlID0geyB0eXBlOiBcIlBhdGhcIiwgUGF0aDogYW5ub3RhdGlvbk9iamVjdC4kUGF0aCB9O1xuXHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kRGVjaW1hbCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR2YWx1ZSA9IHsgdHlwZTogXCJEZWNpbWFsXCIsIERlY2ltYWw6IHBhcnNlRmxvYXQoYW5ub3RhdGlvbk9iamVjdC4kRGVjaW1hbCkgfTtcblx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJFByb3BlcnR5UGF0aCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR2YWx1ZSA9IHsgdHlwZTogXCJQcm9wZXJ0eVBhdGhcIiwgUHJvcGVydHlQYXRoOiBhbm5vdGF0aW9uT2JqZWN0LiRQcm9wZXJ0eVBhdGggfTtcblx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGggIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dmFsdWUgPSB7XG5cdFx0XHRcdHR5cGU6IFwiTmF2aWdhdGlvblByb3BlcnR5UGF0aFwiLFxuXHRcdFx0XHROYXZpZ2F0aW9uUHJvcGVydHlQYXRoOiBhbm5vdGF0aW9uT2JqZWN0LiROYXZpZ2F0aW9uUHJvcGVydHlQYXRoXG5cdFx0XHR9O1xuXHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kSWYgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dmFsdWUgPSB7IHR5cGU6IFwiSWZcIiwgSWY6IGFubm90YXRpb25PYmplY3QuJElmIH07XG5cdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRBcHBseSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR2YWx1ZSA9IHsgdHlwZTogXCJBcHBseVwiLCBBcHBseTogYW5ub3RhdGlvbk9iamVjdC4kQXBwbHksIEZ1bmN0aW9uOiBhbm5vdGF0aW9uT2JqZWN0LiRGdW5jdGlvbiB9O1xuXHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kQW5ub3RhdGlvblBhdGggIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dmFsdWUgPSB7IHR5cGU6IFwiQW5ub3RhdGlvblBhdGhcIiwgQW5ub3RhdGlvblBhdGg6IGFubm90YXRpb25PYmplY3QuJEFubm90YXRpb25QYXRoIH07XG5cdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRFbnVtTWVtYmVyICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHZhbHVlID0ge1xuXHRcdFx0XHR0eXBlOiBcIkVudW1NZW1iZXJcIixcblx0XHRcdFx0RW51bU1lbWJlcjpcblx0XHRcdFx0XHR0aGlzLm1hcE5hbWVUb0FsaWFzKGFubm90YXRpb25PYmplY3QuJEVudW1NZW1iZXIuc3BsaXQoXCIvXCIpWzBdKSArIFwiL1wiICsgYW5ub3RhdGlvbk9iamVjdC4kRW51bU1lbWJlci5zcGxpdChcIi9cIilbMV1cblx0XHRcdH07XG5cdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRUeXBlKSB7XG5cdFx0XHR2YWx1ZSA9IHtcblx0XHRcdFx0dHlwZTogXCJSZWNvcmRcIixcblx0XHRcdFx0UmVjb3JkOiB0aGlzLnBhcnNlQW5ub3RhdGlvbk9iamVjdChhbm5vdGF0aW9uT2JqZWN0LCBjdXJyZW50VGFyZ2V0LCBhbm5vdGF0aW9uc0xpc3RzLCBvQ2FwYWJpbGl0aWVzKVxuXHRcdFx0fTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFsdWUgPSB7XG5cdFx0XHRcdHR5cGU6IFwiUmVjb3JkXCIsXG5cdFx0XHRcdFJlY29yZDogdGhpcy5wYXJzZUFubm90YXRpb25PYmplY3QoYW5ub3RhdGlvbk9iamVjdCwgY3VycmVudFRhcmdldCwgYW5ub3RhdGlvbnNMaXN0cywgb0NhcGFiaWxpdGllcylcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdG5hbWU6IHByb3BlcnR5S2V5LFxuXHRcdFx0dmFsdWVcblx0XHR9O1xuXHR9LFxuXHRtYXBOYW1lVG9BbGlhcyhhbm5vdGF0aW9uTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcblx0XHRsZXQgW3BhdGhQYXJ0LCBhbm5vUGFydF0gPSBhbm5vdGF0aW9uTmFtZS5zcGxpdChcIkBcIik7XG5cdFx0aWYgKCFhbm5vUGFydCkge1xuXHRcdFx0YW5ub1BhcnQgPSBwYXRoUGFydDtcblx0XHRcdHBhdGhQYXJ0ID0gXCJcIjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cGF0aFBhcnQgKz0gXCJAXCI7XG5cdFx0fVxuXHRcdGNvbnN0IGxhc3REb3QgPSBhbm5vUGFydC5sYXN0SW5kZXhPZihcIi5cIik7XG5cdFx0cmV0dXJuIHBhdGhQYXJ0ICsgVk9DQUJVTEFSWV9BTElBU1thbm5vUGFydC5zdWJzdHIoMCwgbGFzdERvdCldICsgXCIuXCIgKyBhbm5vUGFydC5zdWJzdHIobGFzdERvdCArIDEpO1xuXHR9LFxuXHRwYXJzZUFubm90YXRpb25PYmplY3QoXG5cdFx0YW5ub3RhdGlvbk9iamVjdDogYW55LFxuXHRcdGN1cnJlbnRPYmplY3RUYXJnZXQ6IHN0cmluZyxcblx0XHRhbm5vdGF0aW9uc0xpc3RzOiBhbnlbXSxcblx0XHRvQ2FwYWJpbGl0aWVzOiBFbnZpcm9ubWVudENhcGFiaWxpdGllc1xuXHQpOiBFeHByZXNzaW9uIHwgQW5ub3RhdGlvblJlY29yZCB8IEFubm90YXRpb24ge1xuXHRcdGxldCBwYXJzZWRBbm5vdGF0aW9uT2JqZWN0OiBhbnkgPSB7fTtcblx0XHRpZiAoYW5ub3RhdGlvbk9iamVjdCA9PT0gbnVsbCkge1xuXHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdCA9IHsgdHlwZTogXCJOdWxsXCIsIE51bGw6IG51bGwgfTtcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBhbm5vdGF0aW9uT2JqZWN0ID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0ID0geyB0eXBlOiBcIlN0cmluZ1wiLCBTdHJpbmc6IGFubm90YXRpb25PYmplY3QgfTtcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBhbm5vdGF0aW9uT2JqZWN0ID09PSBcImJvb2xlYW5cIikge1xuXHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdCA9IHsgdHlwZTogXCJCb29sXCIsIEJvb2w6IGFubm90YXRpb25PYmplY3QgfTtcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBhbm5vdGF0aW9uT2JqZWN0ID09PSBcIm51bWJlclwiKSB7XG5cdFx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0ID0geyB0eXBlOiBcIkludFwiLCBJbnQ6IGFubm90YXRpb25PYmplY3QgfTtcblx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJEFubm90YXRpb25QYXRoICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QgPSB7IHR5cGU6IFwiQW5ub3RhdGlvblBhdGhcIiwgQW5ub3RhdGlvblBhdGg6IGFubm90YXRpb25PYmplY3QuJEFubm90YXRpb25QYXRoIH07XG5cdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRQYXRoICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QgPSB7IHR5cGU6IFwiUGF0aFwiLCBQYXRoOiBhbm5vdGF0aW9uT2JqZWN0LiRQYXRoIH07XG5cdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiREZWNpbWFsICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QgPSB7IHR5cGU6IFwiRGVjaW1hbFwiLCBEZWNpbWFsOiBwYXJzZUZsb2F0KGFubm90YXRpb25PYmplY3QuJERlY2ltYWwpIH07XG5cdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRQcm9wZXJ0eVBhdGggIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdCA9IHsgdHlwZTogXCJQcm9wZXJ0eVBhdGhcIiwgUHJvcGVydHlQYXRoOiBhbm5vdGF0aW9uT2JqZWN0LiRQcm9wZXJ0eVBhdGggfTtcblx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJElmICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QgPSB7IHR5cGU6IFwiSWZcIiwgSWY6IGFubm90YXRpb25PYmplY3QuJElmIH07XG5cdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRBcHBseSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0ID0geyB0eXBlOiBcIkFwcGx5XCIsIEFwcGx5OiBhbm5vdGF0aW9uT2JqZWN0LiRBcHBseSwgRnVuY3Rpb246IGFubm90YXRpb25PYmplY3QuJEZ1bmN0aW9uIH07XG5cdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiROYXZpZ2F0aW9uUHJvcGVydHlQYXRoICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QgPSB7XG5cdFx0XHRcdHR5cGU6IFwiTmF2aWdhdGlvblByb3BlcnR5UGF0aFwiLFxuXHRcdFx0XHROYXZpZ2F0aW9uUHJvcGVydHlQYXRoOiBhbm5vdGF0aW9uT2JqZWN0LiROYXZpZ2F0aW9uUHJvcGVydHlQYXRoXG5cdFx0XHR9O1xuXHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kRW51bU1lbWJlciAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0ID0ge1xuXHRcdFx0XHR0eXBlOiBcIkVudW1NZW1iZXJcIixcblx0XHRcdFx0RW51bU1lbWJlcjpcblx0XHRcdFx0XHR0aGlzLm1hcE5hbWVUb0FsaWFzKGFubm90YXRpb25PYmplY3QuJEVudW1NZW1iZXIuc3BsaXQoXCIvXCIpWzBdKSArIFwiL1wiICsgYW5ub3RhdGlvbk9iamVjdC4kRW51bU1lbWJlci5zcGxpdChcIi9cIilbMV1cblx0XHRcdH07XG5cdFx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGFubm90YXRpb25PYmplY3QpKSB7XG5cdFx0XHRjb25zdCBwYXJzZWRBbm5vdGF0aW9uQ29sbGVjdGlvbiA9IHBhcnNlZEFubm90YXRpb25PYmplY3QgYXMgYW55O1xuXHRcdFx0cGFyc2VkQW5ub3RhdGlvbkNvbGxlY3Rpb24uY29sbGVjdGlvbiA9IGFubm90YXRpb25PYmplY3QubWFwKChzdWJBbm5vdGF0aW9uT2JqZWN0LCBzdWJBbm5vdGF0aW9uSW5kZXgpID0+XG5cdFx0XHRcdHRoaXMucGFyc2VBbm5vdGF0aW9uT2JqZWN0KFxuXHRcdFx0XHRcdHN1YkFubm90YXRpb25PYmplY3QsXG5cdFx0XHRcdFx0Y3VycmVudE9iamVjdFRhcmdldCArIFwiL1wiICsgc3ViQW5ub3RhdGlvbkluZGV4LFxuXHRcdFx0XHRcdGFubm90YXRpb25zTGlzdHMsXG5cdFx0XHRcdFx0b0NhcGFiaWxpdGllc1xuXHRcdFx0XHQpXG5cdFx0XHQpO1xuXHRcdFx0aWYgKGFubm90YXRpb25PYmplY3QubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRQcm9wZXJ0eVBhdGhcIikpIHtcblx0XHRcdFx0XHQocGFyc2VkQW5ub3RhdGlvbkNvbGxlY3Rpb24uY29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIlByb3BlcnR5UGF0aFwiO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkUGF0aFwiKSkge1xuXHRcdFx0XHRcdChwYXJzZWRBbm5vdGF0aW9uQ29sbGVjdGlvbi5jb2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiUGF0aFwiO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkTmF2aWdhdGlvblByb3BlcnR5UGF0aFwiKSkge1xuXHRcdFx0XHRcdChwYXJzZWRBbm5vdGF0aW9uQ29sbGVjdGlvbi5jb2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiTmF2aWdhdGlvblByb3BlcnR5UGF0aFwiO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkQW5ub3RhdGlvblBhdGhcIikpIHtcblx0XHRcdFx0XHQocGFyc2VkQW5ub3RhdGlvbkNvbGxlY3Rpb24uY29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIkFubm90YXRpb25QYXRoXCI7XG5cdFx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRUeXBlXCIpKSB7XG5cdFx0XHRcdFx0KHBhcnNlZEFubm90YXRpb25Db2xsZWN0aW9uLmNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJSZWNvcmRcIjtcblx0XHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJElmXCIpKSB7XG5cdFx0XHRcdFx0KHBhcnNlZEFubm90YXRpb25Db2xsZWN0aW9uLmNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJJZlwiO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkQXBwbHlcIikpIHtcblx0XHRcdFx0XHQocGFyc2VkQW5ub3RhdGlvbkNvbGxlY3Rpb24uY29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIkFwcGx5XCI7XG5cdFx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIGFubm90YXRpb25PYmplY3RbMF0gPT09IFwib2JqZWN0XCIpIHtcblx0XHRcdFx0XHQocGFyc2VkQW5ub3RhdGlvbkNvbGxlY3Rpb24uY29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIlJlY29yZFwiO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdChwYXJzZWRBbm5vdGF0aW9uQ29sbGVjdGlvbi5jb2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiU3RyaW5nXCI7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKGFubm90YXRpb25PYmplY3QuJFR5cGUpIHtcblx0XHRcdFx0Y29uc3QgdHlwZVZhbHVlID0gYW5ub3RhdGlvbk9iamVjdC4kVHlwZTtcblx0XHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdC50eXBlID0gdHlwZVZhbHVlOyAvL2Ake3R5cGVBbGlhc30uJHt0eXBlVGVybX1gO1xuXHRcdFx0fVxuXHRcdFx0Y29uc3QgcHJvcGVydHlWYWx1ZXM6IGFueSA9IFtdO1xuXHRcdFx0T2JqZWN0LmtleXMoYW5ub3RhdGlvbk9iamVjdCkuZm9yRWFjaChwcm9wZXJ0eUtleSA9PiB7XG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHRwcm9wZXJ0eUtleSAhPT0gXCIkVHlwZVwiICYmXG5cdFx0XHRcdFx0cHJvcGVydHlLZXkgIT09IFwiJElmXCIgJiZcblx0XHRcdFx0XHRwcm9wZXJ0eUtleSAhPT0gXCIkQXBwbHlcIiAmJlxuXHRcdFx0XHRcdHByb3BlcnR5S2V5ICE9PSBcIiRFcVwiICYmXG5cdFx0XHRcdFx0IXByb3BlcnR5S2V5LnN0YXJ0c1dpdGgoXCJAXCIpXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdHByb3BlcnR5VmFsdWVzLnB1c2goXG5cdFx0XHRcdFx0XHR0aGlzLnBhcnNlUHJvcGVydHlWYWx1ZShcblx0XHRcdFx0XHRcdFx0YW5ub3RhdGlvbk9iamVjdFtwcm9wZXJ0eUtleV0sXG5cdFx0XHRcdFx0XHRcdHByb3BlcnR5S2V5LFxuXHRcdFx0XHRcdFx0XHRjdXJyZW50T2JqZWN0VGFyZ2V0LFxuXHRcdFx0XHRcdFx0XHRhbm5vdGF0aW9uc0xpc3RzLFxuXHRcdFx0XHRcdFx0XHRvQ2FwYWJpbGl0aWVzXG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSBlbHNlIGlmIChwcm9wZXJ0eUtleS5zdGFydHNXaXRoKFwiQFwiKSkge1xuXHRcdFx0XHRcdC8vIEFubm90YXRpb24gb2YgYW5ub3RhdGlvblxuXHRcdFx0XHRcdHRoaXMuY3JlYXRlQW5ub3RhdGlvbkxpc3RzKFxuXHRcdFx0XHRcdFx0eyBbcHJvcGVydHlLZXldOiBhbm5vdGF0aW9uT2JqZWN0W3Byb3BlcnR5S2V5XSB9LFxuXHRcdFx0XHRcdFx0Y3VycmVudE9iamVjdFRhcmdldCxcblx0XHRcdFx0XHRcdGFubm90YXRpb25zTGlzdHMsXG5cdFx0XHRcdFx0XHRvQ2FwYWJpbGl0aWVzXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LnByb3BlcnR5VmFsdWVzID0gcHJvcGVydHlWYWx1ZXM7XG5cdFx0fVxuXHRcdHJldHVybiBwYXJzZWRBbm5vdGF0aW9uT2JqZWN0O1xuXHR9LFxuXHRnZXRPckNyZWF0ZUFubm90YXRpb25MaXN0KHRhcmdldDogc3RyaW5nLCBhbm5vdGF0aW9uc0xpc3RzOiBBbm5vdGF0aW9uTGlzdFtdKTogQW5ub3RhdGlvbkxpc3Qge1xuXHRcdGxldCBwb3RlbnRpYWxUYXJnZXQgPSBhbm5vdGF0aW9uc0xpc3RzLmZpbmQoYW5ub3RhdGlvbkxpc3QgPT4gYW5ub3RhdGlvbkxpc3QudGFyZ2V0ID09PSB0YXJnZXQpO1xuXHRcdGlmICghcG90ZW50aWFsVGFyZ2V0KSB7XG5cdFx0XHRwb3RlbnRpYWxUYXJnZXQgPSB7XG5cdFx0XHRcdHRhcmdldDogdGFyZ2V0LFxuXHRcdFx0XHRhbm5vdGF0aW9uczogW11cblx0XHRcdH07XG5cdFx0XHRhbm5vdGF0aW9uc0xpc3RzLnB1c2gocG90ZW50aWFsVGFyZ2V0KTtcblx0XHR9XG5cdFx0cmV0dXJuIHBvdGVudGlhbFRhcmdldDtcblx0fSxcblxuXHRjcmVhdGVBbm5vdGF0aW9uTGlzdHMoXG5cdFx0YW5ub3RhdGlvbk9iamVjdHM6IGFueSxcblx0XHRhbm5vdGF0aW9uVGFyZ2V0OiBzdHJpbmcsXG5cdFx0YW5ub3RhdGlvbkxpc3RzOiBhbnlbXSxcblx0XHRvQ2FwYWJpbGl0aWVzOiBFbnZpcm9ubWVudENhcGFiaWxpdGllc1xuXHQpIHtcblx0XHRjb25zdCBvdXRBbm5vdGF0aW9uT2JqZWN0ID0gdGhpcy5nZXRPckNyZWF0ZUFubm90YXRpb25MaXN0KGFubm90YXRpb25UYXJnZXQsIGFubm90YXRpb25MaXN0cyk7XG5cdFx0aWYgKCFvQ2FwYWJpbGl0aWVzLk1pY3JvQ2hhcnQpIHtcblx0XHRcdGRlbGV0ZSBhbm5vdGF0aW9uT2JqZWN0c1tcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5DaGFydFwiXTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiByZW1vdmVDaGFydEFubm90YXRpb25zKGFubm90YXRpb25PYmplY3Q6IGFueSkge1xuXHRcdFx0cmV0dXJuIGFubm90YXRpb25PYmplY3QuZmlsdGVyKChvUmVjb3JkOiBhbnkpID0+IHtcblx0XHRcdFx0aWYgKG9SZWNvcmQuVGFyZ2V0ICYmIG9SZWNvcmQuVGFyZ2V0LiRBbm5vdGF0aW9uUGF0aCkge1xuXHRcdFx0XHRcdHJldHVybiBvUmVjb3JkLlRhcmdldC4kQW5ub3RhdGlvblBhdGguaW5kZXhPZihcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5DaGFydFwiKSA9PT0gLTE7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHJlbW92ZUlCTkFubm90YXRpb25zKGFubm90YXRpb25PYmplY3Q6IGFueSkge1xuXHRcdFx0cmV0dXJuIGFubm90YXRpb25PYmplY3QuZmlsdGVyKChvUmVjb3JkOiBhbnkpID0+IHtcblx0XHRcdFx0cmV0dXJuIG9SZWNvcmQuJFR5cGUgIT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uXCI7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBoYW5kbGVQcmVzZW50YXRpb25WYXJpYW50KGFubm90YXRpb25PYmplY3Q6IGFueSkge1xuXHRcdFx0cmV0dXJuIGFubm90YXRpb25PYmplY3QuZmlsdGVyKChvUmVjb3JkOiBhbnkpID0+IHtcblx0XHRcdFx0cmV0dXJuIG9SZWNvcmQuJEFubm90YXRpb25QYXRoICE9PSBcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5DaGFydFwiO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0T2JqZWN0LmtleXMoYW5ub3RhdGlvbk9iamVjdHMpLmZvckVhY2goYW5ub3RhdGlvbktleSA9PiB7XG5cdFx0XHRsZXQgYW5ub3RhdGlvbk9iamVjdCA9IGFubm90YXRpb25PYmplY3RzW2Fubm90YXRpb25LZXldO1xuXHRcdFx0c3dpdGNoIChhbm5vdGF0aW9uS2V5KSB7XG5cdFx0XHRcdGNhc2UgXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuSGVhZGVyRmFjZXRzXCI6XG5cdFx0XHRcdFx0aWYgKCFvQ2FwYWJpbGl0aWVzLk1pY3JvQ2hhcnQpIHtcblx0XHRcdFx0XHRcdGFubm90YXRpb25PYmplY3QgPSByZW1vdmVDaGFydEFubm90YXRpb25zKGFubm90YXRpb25PYmplY3QpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5JZGVudGlmaWNhdGlvblwiOlxuXHRcdFx0XHRcdGlmICghb0NhcGFiaWxpdGllcy5JbnRlbnRCYXNlZE5hdmlnYXRpb24pIHtcblx0XHRcdFx0XHRcdGFubm90YXRpb25PYmplY3QgPSByZW1vdmVJQk5Bbm5vdGF0aW9ucyhhbm5vdGF0aW9uT2JqZWN0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuTGluZUl0ZW1cIjpcblx0XHRcdFx0XHRpZiAoIW9DYXBhYmlsaXRpZXMuSW50ZW50QmFzZWROYXZpZ2F0aW9uKSB7XG5cdFx0XHRcdFx0XHRhbm5vdGF0aW9uT2JqZWN0ID0gcmVtb3ZlSUJOQW5ub3RhdGlvbnMoYW5ub3RhdGlvbk9iamVjdCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICghb0NhcGFiaWxpdGllcy5NaWNyb0NoYXJ0KSB7XG5cdFx0XHRcdFx0XHRhbm5vdGF0aW9uT2JqZWN0ID0gcmVtb3ZlQ2hhcnRBbm5vdGF0aW9ucyhhbm5vdGF0aW9uT2JqZWN0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRmllbGRHcm91cFwiOlxuXHRcdFx0XHRcdGlmICghb0NhcGFiaWxpdGllcy5JbnRlbnRCYXNlZE5hdmlnYXRpb24pIHtcblx0XHRcdFx0XHRcdGFubm90YXRpb25PYmplY3QuRGF0YSA9IHJlbW92ZUlCTkFubm90YXRpb25zKGFubm90YXRpb25PYmplY3QuRGF0YSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICghb0NhcGFiaWxpdGllcy5NaWNyb0NoYXJ0KSB7XG5cdFx0XHRcdFx0XHRhbm5vdGF0aW9uT2JqZWN0LkRhdGEgPSByZW1vdmVDaGFydEFubm90YXRpb25zKGFubm90YXRpb25PYmplY3QuRGF0YSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlByZXNlbnRhdGlvblZhcmlhbnRcIjpcblx0XHRcdFx0XHRpZiAoIW9DYXBhYmlsaXRpZXMuQ2hhcnQgJiYgYW5ub3RhdGlvbk9iamVjdC5WaXN1YWxpemF0aW9ucykge1xuXHRcdFx0XHRcdFx0YW5ub3RhdGlvbk9iamVjdC5WaXN1YWxpemF0aW9ucyA9IGhhbmRsZVByZXNlbnRhdGlvblZhcmlhbnQoYW5ub3RhdGlvbk9iamVjdC5WaXN1YWxpemF0aW9ucyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0YW5ub3RhdGlvbk9iamVjdHNbYW5ub3RhdGlvbktleV0gPSBhbm5vdGF0aW9uT2JqZWN0O1xuXHRcdFx0bGV0IGN1cnJlbnRPdXRBbm5vdGF0aW9uT2JqZWN0ID0gb3V0QW5ub3RhdGlvbk9iamVjdDtcblxuXHRcdFx0Ly8gQ2hlY2sgZm9yIGFubm90YXRpb24gb2YgYW5ub3RhdGlvblxuXHRcdFx0Y29uc3QgYW5ub3RhdGlvbk9mQW5ub3RhdGlvblNwbGl0ID0gYW5ub3RhdGlvbktleS5zcGxpdChcIkBcIik7XG5cdFx0XHRpZiAoYW5ub3RhdGlvbk9mQW5ub3RhdGlvblNwbGl0Lmxlbmd0aCA+IDIpIHtcblx0XHRcdFx0Y3VycmVudE91dEFubm90YXRpb25PYmplY3QgPSB0aGlzLmdldE9yQ3JlYXRlQW5ub3RhdGlvbkxpc3QoXG5cdFx0XHRcdFx0YW5ub3RhdGlvblRhcmdldCArIFwiQFwiICsgYW5ub3RhdGlvbk9mQW5ub3RhdGlvblNwbGl0WzFdLFxuXHRcdFx0XHRcdGFubm90YXRpb25MaXN0c1xuXHRcdFx0XHQpO1xuXHRcdFx0XHRhbm5vdGF0aW9uS2V5ID0gYW5ub3RhdGlvbk9mQW5ub3RhdGlvblNwbGl0WzJdO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0YW5ub3RhdGlvbktleSA9IGFubm90YXRpb25PZkFubm90YXRpb25TcGxpdFsxXTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgYW5ub3RhdGlvblF1YWxpZmllclNwbGl0ID0gYW5ub3RhdGlvbktleS5zcGxpdChcIiNcIik7XG5cdFx0XHRjb25zdCBxdWFsaWZpZXIgPSBhbm5vdGF0aW9uUXVhbGlmaWVyU3BsaXRbMV07XG5cdFx0XHRhbm5vdGF0aW9uS2V5ID0gYW5ub3RhdGlvblF1YWxpZmllclNwbGl0WzBdO1xuXG5cdFx0XHRjb25zdCBwYXJzZWRBbm5vdGF0aW9uT2JqZWN0OiBhbnkgPSB7XG5cdFx0XHRcdHRlcm06IGAke2Fubm90YXRpb25LZXl9YCxcblx0XHRcdFx0cXVhbGlmaWVyOiBxdWFsaWZpZXJcblx0XHRcdH07XG5cdFx0XHRsZXQgY3VycmVudEFubm90YXRpb25UYXJnZXQgPSBhbm5vdGF0aW9uVGFyZ2V0ICsgXCJAXCIgKyBwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LnRlcm07XG5cdFx0XHRpZiAocXVhbGlmaWVyKSB7XG5cdFx0XHRcdGN1cnJlbnRBbm5vdGF0aW9uVGFyZ2V0ICs9IFwiI1wiICsgcXVhbGlmaWVyO1xuXHRcdFx0fVxuXHRcdFx0bGV0IGlzQ29sbGVjdGlvbiA9IGZhbHNlO1xuXHRcdFx0aWYgKGFubm90YXRpb25PYmplY3QgPT09IG51bGwpIHtcblx0XHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdC52YWx1ZSA9IHsgdHlwZTogXCJCb29sXCIsIEJvb2w6IGFubm90YXRpb25PYmplY3QgfTtcblx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIGFubm90YXRpb25PYmplY3QgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdC52YWx1ZSA9IHsgdHlwZTogXCJTdHJpbmdcIiwgU3RyaW5nOiBhbm5vdGF0aW9uT2JqZWN0IH07XG5cdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBhbm5vdGF0aW9uT2JqZWN0ID09PSBcImJvb2xlYW5cIikge1xuXHRcdFx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LnZhbHVlID0geyB0eXBlOiBcIkJvb2xcIiwgQm9vbDogYW5ub3RhdGlvbk9iamVjdCB9O1xuXHRcdFx0fSBlbHNlIGlmICh0eXBlb2YgYW5ub3RhdGlvbk9iamVjdCA9PT0gXCJudW1iZXJcIikge1xuXHRcdFx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LnZhbHVlID0geyB0eXBlOiBcIkludFwiLCBJbnQ6IGFubm90YXRpb25PYmplY3QgfTtcblx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kSWYgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LnZhbHVlID0geyB0eXBlOiBcIklmXCIsIElmOiBhbm5vdGF0aW9uT2JqZWN0LiRJZiB9O1xuXHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRBcHBseSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QudmFsdWUgPSB7IHR5cGU6IFwiQXBwbHlcIiwgQXBwbHk6IGFubm90YXRpb25PYmplY3QuJEFwcGx5LCBGdW5jdGlvbjogYW5ub3RhdGlvbk9iamVjdC4kRnVuY3Rpb24gfTtcblx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kUGF0aCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QudmFsdWUgPSB7IHR5cGU6IFwiUGF0aFwiLCBQYXRoOiBhbm5vdGF0aW9uT2JqZWN0LiRQYXRoIH07XG5cdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJEFubm90YXRpb25QYXRoICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdC52YWx1ZSA9IHtcblx0XHRcdFx0XHR0eXBlOiBcIkFubm90YXRpb25QYXRoXCIsXG5cdFx0XHRcdFx0QW5ub3RhdGlvblBhdGg6IGFubm90YXRpb25PYmplY3QuJEFubm90YXRpb25QYXRoXG5cdFx0XHRcdH07XG5cdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJERlY2ltYWwgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LnZhbHVlID0geyB0eXBlOiBcIkRlY2ltYWxcIiwgRGVjaW1hbDogcGFyc2VGbG9hdChhbm5vdGF0aW9uT2JqZWN0LiREZWNpbWFsKSB9O1xuXHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRFbnVtTWVtYmVyICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdC52YWx1ZSA9IHtcblx0XHRcdFx0XHR0eXBlOiBcIkVudW1NZW1iZXJcIixcblx0XHRcdFx0XHRFbnVtTWVtYmVyOlxuXHRcdFx0XHRcdFx0dGhpcy5tYXBOYW1lVG9BbGlhcyhhbm5vdGF0aW9uT2JqZWN0LiRFbnVtTWVtYmVyLnNwbGl0KFwiL1wiKVswXSkgKyBcIi9cIiArIGFubm90YXRpb25PYmplY3QuJEVudW1NZW1iZXIuc3BsaXQoXCIvXCIpWzFdXG5cdFx0XHRcdH07XG5cdFx0XHR9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoYW5ub3RhdGlvbk9iamVjdCkpIHtcblx0XHRcdFx0aXNDb2xsZWN0aW9uID0gdHJ1ZTtcblx0XHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdC5jb2xsZWN0aW9uID0gYW5ub3RhdGlvbk9iamVjdC5tYXAoKHN1YkFubm90YXRpb25PYmplY3QsIHN1YkFubm90YXRpb25JbmRleCkgPT5cblx0XHRcdFx0XHR0aGlzLnBhcnNlQW5ub3RhdGlvbk9iamVjdChcblx0XHRcdFx0XHRcdHN1YkFubm90YXRpb25PYmplY3QsXG5cdFx0XHRcdFx0XHRjdXJyZW50QW5ub3RhdGlvblRhcmdldCArIFwiL1wiICsgc3ViQW5ub3RhdGlvbkluZGV4LFxuXHRcdFx0XHRcdFx0YW5ub3RhdGlvbkxpc3RzLFxuXHRcdFx0XHRcdFx0b0NhcGFiaWxpdGllc1xuXHRcdFx0XHRcdClcblx0XHRcdFx0KTtcblx0XHRcdFx0aWYgKGFubm90YXRpb25PYmplY3QubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJFByb3BlcnR5UGF0aFwiKSkge1xuXHRcdFx0XHRcdFx0KHBhcnNlZEFubm90YXRpb25PYmplY3QuY29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIlByb3BlcnR5UGF0aFwiO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRQYXRoXCIpKSB7XG5cdFx0XHRcdFx0XHQocGFyc2VkQW5ub3RhdGlvbk9iamVjdC5jb2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiUGF0aFwiO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiROYXZpZ2F0aW9uUHJvcGVydHlQYXRoXCIpKSB7XG5cdFx0XHRcdFx0XHQocGFyc2VkQW5ub3RhdGlvbk9iamVjdC5jb2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiTmF2aWdhdGlvblByb3BlcnR5UGF0aFwiO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRBbm5vdGF0aW9uUGF0aFwiKSkge1xuXHRcdFx0XHRcdFx0KHBhcnNlZEFubm90YXRpb25PYmplY3QuY29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIkFubm90YXRpb25QYXRoXCI7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJFR5cGVcIikpIHtcblx0XHRcdFx0XHRcdChwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LmNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJSZWNvcmRcIjtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkSWZcIikpIHtcblx0XHRcdFx0XHRcdChwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LmNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJJZlwiO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRBcHBseVwiKSkge1xuXHRcdFx0XHRcdFx0KHBhcnNlZEFubm90YXRpb25PYmplY3QuY29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIkFwcGx5XCI7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICh0eXBlb2YgYW5ub3RhdGlvbk9iamVjdFswXSA9PT0gXCJvYmplY3RcIikge1xuXHRcdFx0XHRcdFx0KHBhcnNlZEFubm90YXRpb25PYmplY3QuY29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIlJlY29yZFwiO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQocGFyc2VkQW5ub3RhdGlvbk9iamVjdC5jb2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiU3RyaW5nXCI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCByZWNvcmQ6IEFubm90YXRpb25SZWNvcmQgPSB7XG5cdFx0XHRcdFx0cHJvcGVydHlWYWx1ZXM6IFtdXG5cdFx0XHRcdH07XG5cdFx0XHRcdGlmIChhbm5vdGF0aW9uT2JqZWN0LiRUeXBlKSB7XG5cdFx0XHRcdFx0Y29uc3QgdHlwZVZhbHVlID0gYW5ub3RhdGlvbk9iamVjdC4kVHlwZTtcblx0XHRcdFx0XHRyZWNvcmQudHlwZSA9IGAke3R5cGVWYWx1ZX1gO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnN0IHByb3BlcnR5VmFsdWVzOiBhbnlbXSA9IFtdO1xuXHRcdFx0XHRPYmplY3Qua2V5cyhhbm5vdGF0aW9uT2JqZWN0KS5mb3JFYWNoKHByb3BlcnR5S2V5ID0+IHtcblx0XHRcdFx0XHRpZiAocHJvcGVydHlLZXkgIT09IFwiJFR5cGVcIiAmJiAhcHJvcGVydHlLZXkuc3RhcnRzV2l0aChcIkBcIikpIHtcblx0XHRcdFx0XHRcdHByb3BlcnR5VmFsdWVzLnB1c2goXG5cdFx0XHRcdFx0XHRcdHRoaXMucGFyc2VQcm9wZXJ0eVZhbHVlKFxuXHRcdFx0XHRcdFx0XHRcdGFubm90YXRpb25PYmplY3RbcHJvcGVydHlLZXldLFxuXHRcdFx0XHRcdFx0XHRcdHByb3BlcnR5S2V5LFxuXHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRBbm5vdGF0aW9uVGFyZ2V0LFxuXHRcdFx0XHRcdFx0XHRcdGFubm90YXRpb25MaXN0cyxcblx0XHRcdFx0XHRcdFx0XHRvQ2FwYWJpbGl0aWVzXG5cdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChwcm9wZXJ0eUtleS5zdGFydHNXaXRoKFwiQFwiKSkge1xuXHRcdFx0XHRcdFx0Ly8gQW5ub3RhdGlvbiBvZiByZWNvcmRcblx0XHRcdFx0XHRcdHRoaXMuY3JlYXRlQW5ub3RhdGlvbkxpc3RzKFxuXHRcdFx0XHRcdFx0XHR7IFtwcm9wZXJ0eUtleV06IGFubm90YXRpb25PYmplY3RbcHJvcGVydHlLZXldIH0sXG5cdFx0XHRcdFx0XHRcdGN1cnJlbnRBbm5vdGF0aW9uVGFyZ2V0LFxuXHRcdFx0XHRcdFx0XHRhbm5vdGF0aW9uTGlzdHMsXG5cdFx0XHRcdFx0XHRcdG9DYXBhYmlsaXRpZXNcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0cmVjb3JkLnByb3BlcnR5VmFsdWVzID0gcHJvcGVydHlWYWx1ZXM7XG5cdFx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QucmVjb3JkID0gcmVjb3JkO1xuXHRcdFx0fVxuXHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdC5pc0NvbGxlY3Rpb24gPSBpc0NvbGxlY3Rpb247XG5cdFx0XHRjdXJyZW50T3V0QW5ub3RhdGlvbk9iamVjdC5hbm5vdGF0aW9ucy5wdXNoKHBhcnNlZEFubm90YXRpb25PYmplY3QpO1xuXHRcdH0pO1xuXHR9LFxuXHRwYXJzZVByb3BlcnR5KFxuXHRcdG9NZXRhTW9kZWw6IGFueSxcblx0XHRlbnRpdHlUeXBlT2JqZWN0OiBFbnRpdHlUeXBlIHwgQ29tcGxleFR5cGUsXG5cdFx0cHJvcGVydHlOYW1lOiBzdHJpbmcsXG5cdFx0YW5ub3RhdGlvbkxpc3RzOiBBbm5vdGF0aW9uTGlzdFtdLFxuXHRcdG9DYXBhYmlsaXRpZXM6IEVudmlyb25tZW50Q2FwYWJpbGl0aWVzXG5cdCk6IFByb3BlcnR5IHtcblx0XHRjb25zdCBwcm9wZXJ0eUFubm90YXRpb24gPSBvTWV0YU1vZGVsLmdldE9iamVjdChgLyR7ZW50aXR5VHlwZU9iamVjdC5mdWxseVF1YWxpZmllZE5hbWV9LyR7cHJvcGVydHlOYW1lfUBgKTtcblx0XHRjb25zdCBwcm9wZXJ0eURlZmluaXRpb24gPSBvTWV0YU1vZGVsLmdldE9iamVjdChgLyR7ZW50aXR5VHlwZU9iamVjdC5mdWxseVF1YWxpZmllZE5hbWV9LyR7cHJvcGVydHlOYW1lfWApO1xuXG5cdFx0Y29uc3QgcHJvcGVydHlPYmplY3Q6IFByb3BlcnR5ID0ge1xuXHRcdFx0X3R5cGU6IFwiUHJvcGVydHlcIixcblx0XHRcdG5hbWU6IHByb3BlcnR5TmFtZSxcblx0XHRcdGZ1bGx5UXVhbGlmaWVkTmFtZTogYCR7ZW50aXR5VHlwZU9iamVjdC5mdWxseVF1YWxpZmllZE5hbWV9LyR7cHJvcGVydHlOYW1lfWAsXG5cdFx0XHR0eXBlOiBwcm9wZXJ0eURlZmluaXRpb24uJFR5cGUsXG5cdFx0XHRtYXhMZW5ndGg6IHByb3BlcnR5RGVmaW5pdGlvbi4kTWF4TGVuZ3RoLFxuXHRcdFx0cHJlY2lzaW9uOiBwcm9wZXJ0eURlZmluaXRpb24uJFByZWNpc2lvbixcblx0XHRcdHNjYWxlOiBwcm9wZXJ0eURlZmluaXRpb24uJFNjYWxlLFxuXHRcdFx0bnVsbGFibGU6IHByb3BlcnR5RGVmaW5pdGlvbi4kTnVsbGFibGVcblx0XHR9O1xuXG5cdFx0dGhpcy5jcmVhdGVBbm5vdGF0aW9uTGlzdHMocHJvcGVydHlBbm5vdGF0aW9uLCBwcm9wZXJ0eU9iamVjdC5mdWxseVF1YWxpZmllZE5hbWUsIGFubm90YXRpb25MaXN0cywgb0NhcGFiaWxpdGllcyk7XG5cblx0XHRyZXR1cm4gcHJvcGVydHlPYmplY3Q7XG5cdH0sXG5cdHBhcnNlTmF2aWdhdGlvblByb3BlcnR5KFxuXHRcdG9NZXRhTW9kZWw6IGFueSxcblx0XHRlbnRpdHlUeXBlT2JqZWN0OiBFbnRpdHlUeXBlIHwgQ29tcGxleFR5cGUsXG5cdFx0bmF2UHJvcGVydHlOYW1lOiBzdHJpbmcsXG5cdFx0YW5ub3RhdGlvbkxpc3RzOiBBbm5vdGF0aW9uTGlzdFtdLFxuXHRcdG9DYXBhYmlsaXRpZXM6IEVudmlyb25tZW50Q2FwYWJpbGl0aWVzXG5cdCk6IFY0TmF2aWdhdGlvblByb3BlcnR5IHtcblx0XHRjb25zdCBuYXZQcm9wZXJ0eUFubm90YXRpb24gPSBvTWV0YU1vZGVsLmdldE9iamVjdChgLyR7ZW50aXR5VHlwZU9iamVjdC5mdWxseVF1YWxpZmllZE5hbWV9LyR7bmF2UHJvcGVydHlOYW1lfUBgKTtcblx0XHRjb25zdCBuYXZQcm9wZXJ0eURlZmluaXRpb24gPSBvTWV0YU1vZGVsLmdldE9iamVjdChgLyR7ZW50aXR5VHlwZU9iamVjdC5mdWxseVF1YWxpZmllZE5hbWV9LyR7bmF2UHJvcGVydHlOYW1lfWApO1xuXG5cdFx0bGV0IHJlZmVyZW50aWFsQ29uc3RyYWludDogUmVmZXJlbnRpYWxDb25zdHJhaW50W10gPSBbXTtcblx0XHRpZiAobmF2UHJvcGVydHlEZWZpbml0aW9uLiRSZWZlcmVudGlhbENvbnN0cmFpbnQpIHtcblx0XHRcdHJlZmVyZW50aWFsQ29uc3RyYWludCA9IE9iamVjdC5rZXlzKG5hdlByb3BlcnR5RGVmaW5pdGlvbi4kUmVmZXJlbnRpYWxDb25zdHJhaW50KS5tYXAoc291cmNlUHJvcGVydHlOYW1lID0+IHtcblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRzb3VyY2VUeXBlTmFtZTogZW50aXR5VHlwZU9iamVjdC5uYW1lLFxuXHRcdFx0XHRcdHNvdXJjZVByb3BlcnR5OiBzb3VyY2VQcm9wZXJ0eU5hbWUsXG5cdFx0XHRcdFx0dGFyZ2V0VHlwZU5hbWU6IG5hdlByb3BlcnR5RGVmaW5pdGlvbi4kVHlwZSxcblx0XHRcdFx0XHR0YXJnZXRQcm9wZXJ0eTogbmF2UHJvcGVydHlEZWZpbml0aW9uLiRSZWZlcmVudGlhbENvbnN0cmFpbnRbc291cmNlUHJvcGVydHlOYW1lXVxuXHRcdFx0XHR9O1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdGNvbnN0IG5hdmlnYXRpb25Qcm9wZXJ0eTogVjROYXZpZ2F0aW9uUHJvcGVydHkgPSB7XG5cdFx0XHRfdHlwZTogXCJOYXZpZ2F0aW9uUHJvcGVydHlcIixcblx0XHRcdG5hbWU6IG5hdlByb3BlcnR5TmFtZSxcblx0XHRcdGZ1bGx5UXVhbGlmaWVkTmFtZTogYCR7ZW50aXR5VHlwZU9iamVjdC5mdWxseVF1YWxpZmllZE5hbWV9LyR7bmF2UHJvcGVydHlOYW1lfWAsXG5cdFx0XHRwYXJ0bmVyOiBuYXZQcm9wZXJ0eURlZmluaXRpb24uJFBhcnRuZXIsXG5cdFx0XHRpc0NvbGxlY3Rpb246IG5hdlByb3BlcnR5RGVmaW5pdGlvbi4kaXNDb2xsZWN0aW9uID8gbmF2UHJvcGVydHlEZWZpbml0aW9uLiRpc0NvbGxlY3Rpb24gOiBmYWxzZSxcblx0XHRcdGNvbnRhaW5zVGFyZ2V0OiBuYXZQcm9wZXJ0eURlZmluaXRpb24uJENvbnRhaW5zVGFyZ2V0LFxuXHRcdFx0dGFyZ2V0VHlwZU5hbWU6IG5hdlByb3BlcnR5RGVmaW5pdGlvbi4kVHlwZSxcblx0XHRcdHJlZmVyZW50aWFsQ29uc3RyYWludFxuXHRcdH07XG5cblx0XHR0aGlzLmNyZWF0ZUFubm90YXRpb25MaXN0cyhuYXZQcm9wZXJ0eUFubm90YXRpb24sIG5hdmlnYXRpb25Qcm9wZXJ0eS5mdWxseVF1YWxpZmllZE5hbWUsIGFubm90YXRpb25MaXN0cywgb0NhcGFiaWxpdGllcyk7XG5cblx0XHRyZXR1cm4gbmF2aWdhdGlvblByb3BlcnR5O1xuXHR9LFxuXHRwYXJzZUVudGl0eVNldChcblx0XHRvTWV0YU1vZGVsOiBhbnksXG5cdFx0ZW50aXR5U2V0TmFtZTogc3RyaW5nLFxuXHRcdGFubm90YXRpb25MaXN0czogQW5ub3RhdGlvbkxpc3RbXSxcblx0XHRlbnRpdHlDb250YWluZXJOYW1lOiBzdHJpbmcsXG5cdFx0b0NhcGFiaWxpdGllczogRW52aXJvbm1lbnRDYXBhYmlsaXRpZXNcblx0KTogRW50aXR5U2V0IHtcblx0XHRjb25zdCBlbnRpdHlTZXREZWZpbml0aW9uID0gb01ldGFNb2RlbC5nZXRPYmplY3QoYC8ke2VudGl0eVNldE5hbWV9YCk7XG5cdFx0Y29uc3QgZW50aXR5U2V0QW5ub3RhdGlvbiA9IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGAvJHtlbnRpdHlTZXROYW1lfUBgKTtcblx0XHRjb25zdCBlbnRpdHlTZXRPYmplY3Q6IEVudGl0eVNldCA9IHtcblx0XHRcdF90eXBlOiBcIkVudGl0eVNldFwiLFxuXHRcdFx0bmFtZTogZW50aXR5U2V0TmFtZSxcblx0XHRcdG5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmc6IHt9LFxuXHRcdFx0ZW50aXR5VHlwZU5hbWU6IGVudGl0eVNldERlZmluaXRpb24uJFR5cGUsXG5cdFx0XHRmdWxseVF1YWxpZmllZE5hbWU6IGAke2VudGl0eUNvbnRhaW5lck5hbWV9LyR7ZW50aXR5U2V0TmFtZX1gXG5cdFx0fTtcblx0XHR0aGlzLmNyZWF0ZUFubm90YXRpb25MaXN0cyhlbnRpdHlTZXRBbm5vdGF0aW9uLCBlbnRpdHlTZXRPYmplY3QuZnVsbHlRdWFsaWZpZWROYW1lLCBhbm5vdGF0aW9uTGlzdHMsIG9DYXBhYmlsaXRpZXMpO1xuXHRcdHJldHVybiBlbnRpdHlTZXRPYmplY3Q7XG5cdH0sXG5cblx0cGFyc2VFbnRpdHlUeXBlKFxuXHRcdG9NZXRhTW9kZWw6IGFueSxcblx0XHRlbnRpdHlUeXBlTmFtZTogc3RyaW5nLFxuXHRcdGFubm90YXRpb25MaXN0czogQW5ub3RhdGlvbkxpc3RbXSxcblx0XHRuYW1lc3BhY2U6IHN0cmluZyxcblx0XHRvQ2FwYWJpbGl0aWVzOiBFbnZpcm9ubWVudENhcGFiaWxpdGllc1xuXHQpOiBFbnRpdHlUeXBlIHtcblx0XHRjb25zdCBlbnRpdHlUeXBlQW5ub3RhdGlvbiA9IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGAvJHtlbnRpdHlUeXBlTmFtZX1AYCk7XG5cdFx0Y29uc3QgZW50aXR5VHlwZURlZmluaXRpb24gPSBvTWV0YU1vZGVsLmdldE9iamVjdChgLyR7ZW50aXR5VHlwZU5hbWV9YCk7XG5cblx0XHRjb25zdCBlbnRpdHlLZXlzOiBhbnkgPSBnZXRFbnRpdHlLZXlzKGVudGl0eVR5cGVEZWZpbml0aW9uKTtcblxuXHRcdGZ1bmN0aW9uIGdldEVudGl0eUtleXMoZW50aXR5VHlwZURlZmluaXRpb246IGFueSk6IGFueSB7XG5cdFx0XHRpZiAoIWVudGl0eVR5cGVEZWZpbml0aW9uLiRLZXkgJiYgZW50aXR5VHlwZURlZmluaXRpb24uJEJhc2VUeXBlKSB7XG5cdFx0XHRcdHJldHVybiBnZXRFbnRpdHlLZXlzKG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGAvJHtlbnRpdHlUeXBlRGVmaW5pdGlvbi4kQmFzZVR5cGV9YCkpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGVudGl0eVR5cGVEZWZpbml0aW9uLiRLZXkgfHwgW107IC8vaGFuZGxpbmcgb2YgZW50aXR5IHR5cGVzIHdpdGhvdXQga2V5IGFzIHdlbGwgYXMgYmFzZXR5cGVcblx0XHR9XG5cdFx0Y29uc3QgZW50aXR5VHlwZU9iamVjdDogRW50aXR5VHlwZSA9IHtcblx0XHRcdF90eXBlOiBcIkVudGl0eVR5cGVcIixcblx0XHRcdG5hbWU6IGVudGl0eVR5cGVOYW1lLnJlcGxhY2UobmFtZXNwYWNlICsgXCIuXCIsIFwiXCIpLFxuXHRcdFx0ZnVsbHlRdWFsaWZpZWROYW1lOiBlbnRpdHlUeXBlTmFtZSxcblx0XHRcdGtleXM6IFtdLFxuXHRcdFx0ZW50aXR5UHJvcGVydGllczogW10sXG5cdFx0XHRuYXZpZ2F0aW9uUHJvcGVydGllczogW11cblx0XHR9O1xuXG5cdFx0dGhpcy5jcmVhdGVBbm5vdGF0aW9uTGlzdHMoZW50aXR5VHlwZUFubm90YXRpb24sIGVudGl0eVR5cGVPYmplY3QuZnVsbHlRdWFsaWZpZWROYW1lLCBhbm5vdGF0aW9uTGlzdHMsIG9DYXBhYmlsaXRpZXMpO1xuXHRcdGNvbnN0IGVudGl0eVByb3BlcnRpZXMgPSBPYmplY3Qua2V5cyhlbnRpdHlUeXBlRGVmaW5pdGlvbilcblx0XHRcdC5maWx0ZXIocHJvcGVydHlOYW1lT3JOb3QgPT4ge1xuXHRcdFx0XHRpZiAocHJvcGVydHlOYW1lT3JOb3QgIT0gXCIkS2V5XCIgJiYgcHJvcGVydHlOYW1lT3JOb3QgIT0gXCIka2luZFwiKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGVudGl0eVR5cGVEZWZpbml0aW9uW3Byb3BlcnR5TmFtZU9yTm90XS4ka2luZCA9PT0gXCJQcm9wZXJ0eVwiO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0Lm1hcChwcm9wZXJ0eU5hbWUgPT4ge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5wYXJzZVByb3BlcnR5KG9NZXRhTW9kZWwsIGVudGl0eVR5cGVPYmplY3QsIHByb3BlcnR5TmFtZSwgYW5ub3RhdGlvbkxpc3RzLCBvQ2FwYWJpbGl0aWVzKTtcblx0XHRcdH0pO1xuXG5cdFx0Y29uc3QgbmF2aWdhdGlvblByb3BlcnRpZXMgPSBPYmplY3Qua2V5cyhlbnRpdHlUeXBlRGVmaW5pdGlvbilcblx0XHRcdC5maWx0ZXIocHJvcGVydHlOYW1lT3JOb3QgPT4ge1xuXHRcdFx0XHRpZiAocHJvcGVydHlOYW1lT3JOb3QgIT0gXCIkS2V5XCIgJiYgcHJvcGVydHlOYW1lT3JOb3QgIT0gXCIka2luZFwiKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGVudGl0eVR5cGVEZWZpbml0aW9uW3Byb3BlcnR5TmFtZU9yTm90XS4ka2luZCA9PT0gXCJOYXZpZ2F0aW9uUHJvcGVydHlcIjtcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5tYXAobmF2UHJvcGVydHlOYW1lID0+IHtcblx0XHRcdFx0cmV0dXJuIHRoaXMucGFyc2VOYXZpZ2F0aW9uUHJvcGVydHkob01ldGFNb2RlbCwgZW50aXR5VHlwZU9iamVjdCwgbmF2UHJvcGVydHlOYW1lLCBhbm5vdGF0aW9uTGlzdHMsIG9DYXBhYmlsaXRpZXMpO1xuXHRcdFx0fSk7XG5cblx0XHRlbnRpdHlUeXBlT2JqZWN0LmtleXMgPSBlbnRpdHlLZXlzXG5cdFx0XHQubWFwKChlbnRpdHlLZXk6IHN0cmluZykgPT4gZW50aXR5UHJvcGVydGllcy5maW5kKChwcm9wZXJ0eTogUHJvcGVydHkpID0+IHByb3BlcnR5Lm5hbWUgPT09IGVudGl0eUtleSkpXG5cdFx0XHQuZmlsdGVyKChwcm9wZXJ0eTogUHJvcGVydHkpID0+IHByb3BlcnR5ICE9PSB1bmRlZmluZWQpO1xuXHRcdGVudGl0eVR5cGVPYmplY3QuZW50aXR5UHJvcGVydGllcyA9IGVudGl0eVByb3BlcnRpZXM7XG5cdFx0ZW50aXR5VHlwZU9iamVjdC5uYXZpZ2F0aW9uUHJvcGVydGllcyA9IG5hdmlnYXRpb25Qcm9wZXJ0aWVzO1xuXG5cdFx0cmV0dXJuIGVudGl0eVR5cGVPYmplY3Q7XG5cdH0sXG5cdHBhcnNlQ29tcGxleFR5cGUoXG5cdFx0b01ldGFNb2RlbDogYW55LFxuXHRcdGNvbXBsZXhUeXBlTmFtZTogc3RyaW5nLFxuXHRcdGFubm90YXRpb25MaXN0czogQW5ub3RhdGlvbkxpc3RbXSxcblx0XHRuYW1lc3BhY2U6IHN0cmluZyxcblx0XHRvQ2FwYWJpbGl0aWVzOiBFbnZpcm9ubWVudENhcGFiaWxpdGllc1xuXHQpOiBDb21wbGV4VHlwZSB7XG5cdFx0Y29uc3QgY29tcGxleFR5cGVBbm5vdGF0aW9uID0gb01ldGFNb2RlbC5nZXRPYmplY3QoYC8ke2NvbXBsZXhUeXBlTmFtZX1AYCk7XG5cdFx0Y29uc3QgY29tcGxleFR5cGVEZWZpbml0aW9uID0gb01ldGFNb2RlbC5nZXRPYmplY3QoYC8ke2NvbXBsZXhUeXBlTmFtZX1gKTtcblx0XHRjb25zdCBjb21wbGV4VHlwZU9iamVjdDogQ29tcGxleFR5cGUgPSB7XG5cdFx0XHRfdHlwZTogXCJDb21wbGV4VHlwZVwiLFxuXHRcdFx0bmFtZTogY29tcGxleFR5cGVOYW1lLnJlcGxhY2UobmFtZXNwYWNlICsgXCIuXCIsIFwiXCIpLFxuXHRcdFx0ZnVsbHlRdWFsaWZpZWROYW1lOiBjb21wbGV4VHlwZU5hbWUsXG5cdFx0XHRwcm9wZXJ0aWVzOiBbXSxcblx0XHRcdG5hdmlnYXRpb25Qcm9wZXJ0aWVzOiBbXVxuXHRcdH07XG5cblx0XHR0aGlzLmNyZWF0ZUFubm90YXRpb25MaXN0cyhjb21wbGV4VHlwZUFubm90YXRpb24sIGNvbXBsZXhUeXBlT2JqZWN0LmZ1bGx5UXVhbGlmaWVkTmFtZSwgYW5ub3RhdGlvbkxpc3RzLCBvQ2FwYWJpbGl0aWVzKTtcblx0XHRjb25zdCBjb21wbGV4VHlwZVByb3BlcnRpZXMgPSBPYmplY3Qua2V5cyhjb21wbGV4VHlwZURlZmluaXRpb24pXG5cdFx0XHQuZmlsdGVyKHByb3BlcnR5TmFtZU9yTm90ID0+IHtcblx0XHRcdFx0aWYgKHByb3BlcnR5TmFtZU9yTm90ICE9IFwiJEtleVwiICYmIHByb3BlcnR5TmFtZU9yTm90ICE9IFwiJGtpbmRcIikge1xuXHRcdFx0XHRcdHJldHVybiBjb21wbGV4VHlwZURlZmluaXRpb25bcHJvcGVydHlOYW1lT3JOb3RdLiRraW5kID09PSBcIlByb3BlcnR5XCI7XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQubWFwKHByb3BlcnR5TmFtZSA9PiB7XG5cdFx0XHRcdHJldHVybiB0aGlzLnBhcnNlUHJvcGVydHkob01ldGFNb2RlbCwgY29tcGxleFR5cGVPYmplY3QsIHByb3BlcnR5TmFtZSwgYW5ub3RhdGlvbkxpc3RzLCBvQ2FwYWJpbGl0aWVzKTtcblx0XHRcdH0pO1xuXG5cdFx0Y29tcGxleFR5cGVPYmplY3QucHJvcGVydGllcyA9IGNvbXBsZXhUeXBlUHJvcGVydGllcztcblx0XHRjb25zdCBjb21wbGV4VHlwZU5hdmlnYXRpb25Qcm9wZXJ0aWVzID0gT2JqZWN0LmtleXMoY29tcGxleFR5cGVEZWZpbml0aW9uKVxuXHRcdFx0LmZpbHRlcihwcm9wZXJ0eU5hbWVPck5vdCA9PiB7XG5cdFx0XHRcdGlmIChwcm9wZXJ0eU5hbWVPck5vdCAhPSBcIiRLZXlcIiAmJiBwcm9wZXJ0eU5hbWVPck5vdCAhPSBcIiRraW5kXCIpIHtcblx0XHRcdFx0XHRyZXR1cm4gY29tcGxleFR5cGVEZWZpbml0aW9uW3Byb3BlcnR5TmFtZU9yTm90XS4ka2luZCA9PT0gXCJOYXZpZ2F0aW9uUHJvcGVydHlcIjtcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5tYXAobmF2UHJvcGVydHlOYW1lID0+IHtcblx0XHRcdFx0cmV0dXJuIHRoaXMucGFyc2VOYXZpZ2F0aW9uUHJvcGVydHkob01ldGFNb2RlbCwgY29tcGxleFR5cGVPYmplY3QsIG5hdlByb3BlcnR5TmFtZSwgYW5ub3RhdGlvbkxpc3RzLCBvQ2FwYWJpbGl0aWVzKTtcblx0XHRcdH0pO1xuXHRcdGNvbXBsZXhUeXBlT2JqZWN0Lm5hdmlnYXRpb25Qcm9wZXJ0aWVzID0gY29tcGxleFR5cGVOYXZpZ2F0aW9uUHJvcGVydGllcztcblx0XHRyZXR1cm4gY29tcGxleFR5cGVPYmplY3Q7XG5cdH0sXG5cdHBhcnNlQWN0aW9uKGFjdGlvbk5hbWU6IHN0cmluZywgYWN0aW9uUmF3RGF0YTogTWV0YU1vZGVsQWN0aW9uLCBuYW1lc3BhY2U6IHN0cmluZywgZW50aXR5Q29udGFpbmVyTmFtZTogc3RyaW5nKTogQWN0aW9uIHtcblx0XHRsZXQgYWN0aW9uRW50aXR5VHlwZTogc3RyaW5nID0gXCJcIjtcblx0XHRsZXQgYWN0aW9uRlFOID0gYCR7YWN0aW9uTmFtZX1gO1xuXHRcdGNvbnN0IGFjdGlvblNob3J0TmFtZSA9IGFjdGlvbk5hbWUuc3Vic3RyKG5hbWVzcGFjZS5sZW5ndGggKyAxKTtcblx0XHRpZiAoYWN0aW9uUmF3RGF0YS4kSXNCb3VuZCkge1xuXHRcdFx0Y29uc3QgYmluZGluZ1BhcmFtZXRlciA9IGFjdGlvblJhd0RhdGEuJFBhcmFtZXRlclswXTtcblx0XHRcdGFjdGlvbkVudGl0eVR5cGUgPSBiaW5kaW5nUGFyYW1ldGVyLiRUeXBlO1xuXHRcdFx0aWYgKGJpbmRpbmdQYXJhbWV0ZXIuJGlzQ29sbGVjdGlvbiA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRhY3Rpb25GUU4gPSBgJHthY3Rpb25OYW1lfShDb2xsZWN0aW9uKCR7YWN0aW9uRW50aXR5VHlwZX0pKWA7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRhY3Rpb25GUU4gPSBgJHthY3Rpb25OYW1lfSgke2FjdGlvbkVudGl0eVR5cGV9KWA7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGFjdGlvbkZRTiA9IGAke2VudGl0eUNvbnRhaW5lck5hbWV9LyR7YWN0aW9uU2hvcnROYW1lfWA7XG5cdFx0fVxuXHRcdGNvbnN0IHBhcmFtZXRlcnMgPSBhY3Rpb25SYXdEYXRhLiRQYXJhbWV0ZXIgfHwgW107XG5cdFx0cmV0dXJuIHtcblx0XHRcdF90eXBlOiBcIkFjdGlvblwiLFxuXHRcdFx0bmFtZTogYWN0aW9uU2hvcnROYW1lLFxuXHRcdFx0ZnVsbHlRdWFsaWZpZWROYW1lOiBhY3Rpb25GUU4sXG5cdFx0XHRpc0JvdW5kOiBhY3Rpb25SYXdEYXRhLiRJc0JvdW5kLFxuXHRcdFx0c291cmNlVHlwZTogYWN0aW9uRW50aXR5VHlwZSxcblx0XHRcdHJldHVyblR5cGU6IGFjdGlvblJhd0RhdGEuJFJldHVyblR5cGUgPyBhY3Rpb25SYXdEYXRhLiRSZXR1cm5UeXBlLiRUeXBlIDogXCJcIixcblx0XHRcdHBhcmFtZXRlcnM6IHBhcmFtZXRlcnMubWFwKHBhcmFtID0+IHtcblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRfdHlwZTogXCJBY3Rpb25QYXJhbWV0ZXJcIixcblx0XHRcdFx0XHRpc0VudGl0eVNldDogcGFyYW0uJFR5cGUgPT09IGFjdGlvblJhd0RhdGEuJEVudGl0eVNldFBhdGgsXG5cdFx0XHRcdFx0ZnVsbHlRdWFsaWZpZWROYW1lOiBgJHthY3Rpb25GUU59LyR7cGFyYW0uJE5hbWV9YCxcblx0XHRcdFx0XHR0eXBlOiBwYXJhbS4kVHlwZVxuXHRcdFx0XHRcdC8vIFRPRE8gbWlzc2luZyBwcm9wZXJ0aWVzID9cblx0XHRcdFx0fTtcblx0XHRcdH0pXG5cdFx0fTtcblx0fSxcblx0cGFyc2VFbnRpdHlUeXBlcyhvTWV0YU1vZGVsOiBhbnksIG9JbkNhcGFiaWxpdGllcz86IEVudmlyb25tZW50Q2FwYWJpbGl0aWVzKTogUGFyc2VyT3V0cHV0IHtcblx0XHRsZXQgb0NhcGFiaWxpdGllczogRW52aXJvbm1lbnRDYXBhYmlsaXRpZXM7XG5cdFx0aWYgKCFvSW5DYXBhYmlsaXRpZXMpIHtcblx0XHRcdG9DYXBhYmlsaXRpZXMgPSBEZWZhdWx0RW52aXJvbm1lbnRDYXBhYmlsaXRpZXM7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG9DYXBhYmlsaXRpZXMgPSBvSW5DYXBhYmlsaXRpZXM7XG5cdFx0fVxuXHRcdGNvbnN0IG9NZXRhTW9kZWxEYXRhID0gb01ldGFNb2RlbC5nZXRPYmplY3QoXCIvJFwiKTtcblx0XHRjb25zdCBvRW50aXR5U2V0cyA9IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KFwiL1wiKTtcblx0XHRsZXQgYW5ub3RhdGlvbkxpc3RzOiBBbm5vdGF0aW9uTGlzdFtdID0gW107XG5cdFx0Y29uc3QgZW50aXR5VHlwZXM6IEVudGl0eVR5cGVbXSA9IFtdO1xuXHRcdGNvbnN0IGVudGl0eVNldHM6IEVudGl0eVNldFtdID0gW107XG5cdFx0Y29uc3QgY29tcGxleFR5cGVzOiBDb21wbGV4VHlwZVtdID0gW107XG5cdFx0Y29uc3QgZW50aXR5Q29udGFpbmVyTmFtZSA9IG9NZXRhTW9kZWxEYXRhLiRFbnRpdHlDb250YWluZXI7XG5cdFx0bGV0IG5hbWVzcGFjZSA9IFwiXCI7XG5cdFx0Y29uc3Qgc2NoZW1hS2V5cyA9IE9iamVjdC5rZXlzKG9NZXRhTW9kZWxEYXRhKS5maWx0ZXIobWV0YW1vZGVsS2V5ID0+IG9NZXRhTW9kZWxEYXRhW21ldGFtb2RlbEtleV0uJGtpbmQgPT09IFwiU2NoZW1hXCIpO1xuXHRcdGlmIChzY2hlbWFLZXlzICYmIHNjaGVtYUtleXMubGVuZ3RoID4gMCkge1xuXHRcdFx0bmFtZXNwYWNlID0gc2NoZW1hS2V5c1swXS5zdWJzdHIoMCwgc2NoZW1hS2V5c1swXS5sZW5ndGggLSAxKTtcblx0XHR9IGVsc2UgaWYgKGVudGl0eVR5cGVzICYmIGVudGl0eVR5cGVzLmxlbmd0aCkge1xuXHRcdFx0bmFtZXNwYWNlID0gZW50aXR5VHlwZXNbMF0uZnVsbHlRdWFsaWZpZWROYW1lLnJlcGxhY2UoZW50aXR5VHlwZXNbMF0ubmFtZSwgXCJcIik7XG5cdFx0XHRuYW1lc3BhY2UgPSBuYW1lc3BhY2Uuc3Vic3RyKDAsIG5hbWVzcGFjZS5sZW5ndGggLSAxKTtcblx0XHR9XG5cdFx0T2JqZWN0LmtleXMob01ldGFNb2RlbERhdGEpXG5cdFx0XHQuZmlsdGVyKGVudGl0eVR5cGVOYW1lID0+IHtcblx0XHRcdFx0cmV0dXJuIGVudGl0eVR5cGVOYW1lICE9PSBcIiRraW5kXCIgJiYgb01ldGFNb2RlbERhdGFbZW50aXR5VHlwZU5hbWVdLiRraW5kID09PSBcIkVudGl0eVR5cGVcIjtcblx0XHRcdH0pXG5cdFx0XHQuZm9yRWFjaChlbnRpdHlUeXBlTmFtZSA9PiB7XG5cdFx0XHRcdGNvbnN0IGVudGl0eVR5cGUgPSB0aGlzLnBhcnNlRW50aXR5VHlwZShvTWV0YU1vZGVsLCBlbnRpdHlUeXBlTmFtZSwgYW5ub3RhdGlvbkxpc3RzLCBuYW1lc3BhY2UsIG9DYXBhYmlsaXRpZXMpO1xuXHRcdFx0XHRlbnRpdHlUeXBlLmVudGl0eVByb3BlcnRpZXMuZm9yRWFjaChlbnRpdHlQcm9wZXJ0eSA9PiB7XG5cdFx0XHRcdFx0aWYgKCFvTWV0YU1vZGVsRGF0YS4kQW5ub3RhdGlvbnNbZW50aXR5UHJvcGVydHkuZnVsbHlRdWFsaWZpZWROYW1lXSkge1xuXHRcdFx0XHRcdFx0b01ldGFNb2RlbERhdGEuJEFubm90YXRpb25zW2VudGl0eVByb3BlcnR5LmZ1bGx5UXVhbGlmaWVkTmFtZV0gPSB7fTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCFvTWV0YU1vZGVsRGF0YS4kQW5ub3RhdGlvbnNbZW50aXR5UHJvcGVydHkuZnVsbHlRdWFsaWZpZWROYW1lXVtcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGREZWZhdWx0XCJdKSB7XG5cdFx0XHRcdFx0XHRvTWV0YU1vZGVsRGF0YS4kQW5ub3RhdGlvbnNbZW50aXR5UHJvcGVydHkuZnVsbHlRdWFsaWZpZWROYW1lXVtcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGREZWZhdWx0XCJdID0ge1xuXHRcdFx0XHRcdFx0XHQkVHlwZTogXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRcIixcblx0XHRcdFx0XHRcdFx0VmFsdWU6IHsgJFBhdGg6IGVudGl0eVByb3BlcnR5Lm5hbWUgfVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdHRoaXMuY3JlYXRlQW5ub3RhdGlvbkxpc3RzKFxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkRGVmYXVsdFwiOlxuXHRcdFx0XHRcdFx0XHRcdFx0b01ldGFNb2RlbERhdGEuJEFubm90YXRpb25zW2VudGl0eVByb3BlcnR5LmZ1bGx5UXVhbGlmaWVkTmFtZV1bXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZERlZmF1bHRcIlxuXHRcdFx0XHRcdFx0XHRcdFx0XVxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRlbnRpdHlQcm9wZXJ0eS5mdWxseVF1YWxpZmllZE5hbWUsXG5cdFx0XHRcdFx0XHRcdGFubm90YXRpb25MaXN0cyxcblx0XHRcdFx0XHRcdFx0b0NhcGFiaWxpdGllc1xuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRlbnRpdHlUeXBlcy5wdXNoKGVudGl0eVR5cGUpO1xuXHRcdFx0fSk7XG5cdFx0T2JqZWN0LmtleXMob0VudGl0eVNldHMpXG5cdFx0XHQuZmlsdGVyKGVudGl0eVNldE5hbWUgPT4ge1xuXHRcdFx0XHRyZXR1cm4gZW50aXR5U2V0TmFtZSAhPT0gXCIka2luZFwiICYmIG9FbnRpdHlTZXRzW2VudGl0eVNldE5hbWVdLiRraW5kID09PSBcIkVudGl0eVNldFwiO1xuXHRcdFx0fSlcblx0XHRcdC5mb3JFYWNoKGVudGl0eVNldE5hbWUgPT4ge1xuXHRcdFx0XHRjb25zdCBlbnRpdHlTZXQgPSB0aGlzLnBhcnNlRW50aXR5U2V0KG9NZXRhTW9kZWwsIGVudGl0eVNldE5hbWUsIGFubm90YXRpb25MaXN0cywgZW50aXR5Q29udGFpbmVyTmFtZSwgb0NhcGFiaWxpdGllcyk7XG5cdFx0XHRcdGVudGl0eVNldHMucHVzaChlbnRpdHlTZXQpO1xuXHRcdFx0fSk7XG5cdFx0T2JqZWN0LmtleXMob01ldGFNb2RlbERhdGEpXG5cdFx0XHQuZmlsdGVyKGNvbXBsZXhUeXBlTmFtZSA9PiB7XG5cdFx0XHRcdHJldHVybiBjb21wbGV4VHlwZU5hbWUgIT09IFwiJGtpbmRcIiAmJiBvTWV0YU1vZGVsRGF0YVtjb21wbGV4VHlwZU5hbWVdLiRraW5kID09PSBcIkNvbXBsZXhUeXBlXCI7XG5cdFx0XHR9KVxuXHRcdFx0LmZvckVhY2goY29tcGxleFR5cGVOYW1lID0+IHtcblx0XHRcdFx0Y29uc3QgY29tcGxleFR5cGUgPSB0aGlzLnBhcnNlQ29tcGxleFR5cGUob01ldGFNb2RlbCwgY29tcGxleFR5cGVOYW1lLCBhbm5vdGF0aW9uTGlzdHMsIG5hbWVzcGFjZSwgb0NhcGFiaWxpdGllcyk7XG5cdFx0XHRcdGNvbXBsZXhUeXBlcy5wdXNoKGNvbXBsZXhUeXBlKTtcblx0XHRcdH0pO1xuXHRcdGNvbnN0IG9FbnRpdHlDb250YWluZXJOYW1lID0gT2JqZWN0LmtleXMob01ldGFNb2RlbERhdGEpLmZpbmQoZW50aXR5Q29udGFpbmVyTmFtZSA9PiB7XG5cdFx0XHRyZXR1cm4gZW50aXR5Q29udGFpbmVyTmFtZSAhPT0gXCIka2luZFwiICYmIG9NZXRhTW9kZWxEYXRhW2VudGl0eUNvbnRhaW5lck5hbWVdLiRraW5kID09PSBcIkVudGl0eUNvbnRhaW5lclwiO1xuXHRcdH0pO1xuXHRcdGxldCBlbnRpdHlDb250YWluZXI6IEVudGl0eUNvbnRhaW5lciA9IHt9O1xuXHRcdGlmIChvRW50aXR5Q29udGFpbmVyTmFtZSkge1xuXHRcdFx0ZW50aXR5Q29udGFpbmVyID0ge1xuXHRcdFx0XHRuYW1lOiBvRW50aXR5Q29udGFpbmVyTmFtZS5yZXBsYWNlKG5hbWVzcGFjZSArIFwiLlwiLCBcIlwiKSxcblx0XHRcdFx0ZnVsbHlRdWFsaWZpZWROYW1lOiBvRW50aXR5Q29udGFpbmVyTmFtZVxuXHRcdFx0fTtcblx0XHR9XG5cdFx0ZW50aXR5U2V0cy5mb3JFYWNoKGVudGl0eVNldCA9PiB7XG5cdFx0XHRjb25zdCBuYXZQcm9wZXJ0eUJpbmRpbmdzID0gb01ldGFNb2RlbERhdGFbZW50aXR5Q29udGFpbmVyTmFtZV1bZW50aXR5U2V0Lm5hbWVdLiROYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nO1xuXHRcdFx0aWYgKG5hdlByb3BlcnR5QmluZGluZ3MpIHtcblx0XHRcdFx0T2JqZWN0LmtleXMobmF2UHJvcGVydHlCaW5kaW5ncykuZm9yRWFjaChuYXZQcm9wTmFtZSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgdGFyZ2V0RW50aXR5U2V0ID0gZW50aXR5U2V0cy5maW5kKGVudGl0eVNldE5hbWUgPT4gZW50aXR5U2V0TmFtZS5uYW1lID09PSBuYXZQcm9wZXJ0eUJpbmRpbmdzW25hdlByb3BOYW1lXSk7XG5cdFx0XHRcdFx0aWYgKHRhcmdldEVudGl0eVNldCkge1xuXHRcdFx0XHRcdFx0ZW50aXR5U2V0Lm5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmdbbmF2UHJvcE5hbWVdID0gdGFyZ2V0RW50aXR5U2V0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRjb25zdCBhY3Rpb25zOiBBY3Rpb25bXSA9IE9iamVjdC5rZXlzKG9NZXRhTW9kZWxEYXRhKVxuXHRcdFx0LmZpbHRlcihrZXkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gQXJyYXkuaXNBcnJheShvTWV0YU1vZGVsRGF0YVtrZXldKSAmJiBvTWV0YU1vZGVsRGF0YVtrZXldLmxlbmd0aCA+IDAgJiYgb01ldGFNb2RlbERhdGFba2V5XVswXS4ka2luZCA9PT0gXCJBY3Rpb25cIjtcblx0XHRcdH0pXG5cdFx0XHQucmVkdWNlKChvdXRBY3Rpb25zOiBBY3Rpb25bXSwgYWN0aW9uTmFtZSkgPT4ge1xuXHRcdFx0XHRjb25zdCBhY3Rpb25zID0gb01ldGFNb2RlbERhdGFbYWN0aW9uTmFtZV07XG5cdFx0XHRcdGFjdGlvbnMuZm9yRWFjaCgoYWN0aW9uOiBNZXRhTW9kZWxBY3Rpb24pID0+IHtcblx0XHRcdFx0XHRvdXRBY3Rpb25zLnB1c2godGhpcy5wYXJzZUFjdGlvbihhY3Rpb25OYW1lLCBhY3Rpb24sIG5hbWVzcGFjZSwgZW50aXR5Q29udGFpbmVyTmFtZSkpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0cmV0dXJuIG91dEFjdGlvbnM7XG5cdFx0XHR9LCBbXSk7XG5cdFx0Ly8gRklYTUUgQ3JhcHB5IGNvZGUgdG8gZGVhbCB3aXRoIGFubm90YXRpb25zIGZvciBmdW5jdGlvbnNcblx0XHRjb25zdCBhbm5vdGF0aW9ucyA9IG9NZXRhTW9kZWxEYXRhLiRBbm5vdGF0aW9ucztcblx0XHRjb25zdCBhY3Rpb25Bbm5vdGF0aW9ucyA9IE9iamVjdC5rZXlzKGFubm90YXRpb25zKS5maWx0ZXIodGFyZ2V0ID0+IHRhcmdldC5pbmRleE9mKFwiKFwiKSAhPT0gLTEpO1xuXHRcdGFjdGlvbkFubm90YXRpb25zLmZvckVhY2godGFyZ2V0ID0+IHtcblx0XHRcdHRoaXMuY3JlYXRlQW5ub3RhdGlvbkxpc3RzKG9NZXRhTW9kZWxEYXRhLiRBbm5vdGF0aW9uc1t0YXJnZXRdLCB0YXJnZXQsIGFubm90YXRpb25MaXN0cywgb0NhcGFiaWxpdGllcyk7XG5cdFx0fSk7XG5cdFx0Y29uc3QgZW50aXR5Q29udGFpbmVyQW5ub3RhdGlvbnMgPSBhbm5vdGF0aW9uc1tlbnRpdHlDb250YWluZXJOYW1lXTtcblxuXHRcdC8vIFJldHJpZXZlIEVudGl0eSBDb250YWluZXIgYW5ub3RhdGlvbnNcblx0XHRpZiAoZW50aXR5Q29udGFpbmVyQW5ub3RhdGlvbnMpIHtcblx0XHRcdHRoaXMuY3JlYXRlQW5ub3RhdGlvbkxpc3RzKGVudGl0eUNvbnRhaW5lckFubm90YXRpb25zLCBlbnRpdHlDb250YWluZXJOYW1lLCBhbm5vdGF0aW9uTGlzdHMsIG9DYXBhYmlsaXRpZXMpO1xuXHRcdH1cblx0XHQvLyBTb3J0IGJ5IHRhcmdldCBsZW5ndGhcblx0XHRhbm5vdGF0aW9uTGlzdHMgPSBhbm5vdGF0aW9uTGlzdHMuc29ydCgoYSwgYikgPT4gKGEudGFyZ2V0Lmxlbmd0aCA+PSBiLnRhcmdldC5sZW5ndGggPyAxIDogLTEpKTtcblx0XHRjb25zdCByZWZlcmVuY2VzOiBSZWZlcmVuY2VbXSA9IFtdO1xuXHRcdHJldHVybiB7XG5cdFx0XHRpZGVudGlmaWNhdGlvbjogXCJtZXRhbW9kZWxSZXN1bHRcIixcblx0XHRcdHZlcnNpb246IFwiNC4wXCIsXG5cdFx0XHRzY2hlbWE6IHtcblx0XHRcdFx0ZW50aXR5Q29udGFpbmVyLFxuXHRcdFx0XHRlbnRpdHlTZXRzLFxuXHRcdFx0XHRlbnRpdHlUeXBlcyxcblx0XHRcdFx0Y29tcGxleFR5cGVzLFxuXHRcdFx0XHRhc3NvY2lhdGlvbnM6IFtdLFxuXHRcdFx0XHRhY3Rpb25zLFxuXHRcdFx0XHRuYW1lc3BhY2UsXG5cdFx0XHRcdGFubm90YXRpb25zOiB7XG5cdFx0XHRcdFx0XCJtZXRhbW9kZWxSZXN1bHRcIjogYW5ub3RhdGlvbkxpc3RzXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRyZWZlcmVuY2VzOiByZWZlcmVuY2VzXG5cdFx0fTtcblx0fVxufTtcblxuY29uc3QgbU1ldGFNb2RlbE1hcDogUmVjb3JkPHN0cmluZywgUGFyc2VyT3V0cHV0PiA9IHt9O1xuXG4vKipcbiAqIENvbnZlcnQgdGhlIE9EYXRhTWV0YU1vZGVsIGludG8gYW5vdGhlciBmb3JtYXQgdGhhdCBhbGxvdyBmb3IgZWFzeSBtYW5pcHVsYXRpb24gb2YgdGhlIGFubm90YXRpb25zLlxuICpcbiAqIEBwYXJhbSB7T0RhdGFNZXRhTW9kZWx9IG9NZXRhTW9kZWwgdGhlIGN1cnJlbnQgb0RhdGFNZXRhTW9kZWxcbiAqIEBwYXJhbSBvQ2FwYWJpbGl0aWVzIHRoZSBjdXJyZW50IGNhcGFiaWxpdGllc1xuICogQHJldHVybnMge0NvbnZlcnRlck91dHB1dH0gYW4gb2JqZWN0IGNvbnRhaW5pbmcgb2JqZWN0IGxpa2UgYW5ub3RhdGlvblxuICovXG5leHBvcnQgZnVuY3Rpb24gY29udmVydFR5cGVzKG9NZXRhTW9kZWw6IE9EYXRhTWV0YU1vZGVsLCBvQ2FwYWJpbGl0aWVzPzogRW52aXJvbm1lbnRDYXBhYmlsaXRpZXMpOiBDb252ZXJ0ZXJPdXRwdXQge1xuXHRjb25zdCBzTWV0YU1vZGVsSWQgPSAob01ldGFNb2RlbCBhcyBhbnkpLmlkO1xuXHRpZiAoIW1NZXRhTW9kZWxNYXAuaGFzT3duUHJvcGVydHkoc01ldGFNb2RlbElkKSkge1xuXHRcdGNvbnN0IHBhcnNlZE91dHB1dCA9IE1ldGFNb2RlbENvbnZlcnRlci5wYXJzZUVudGl0eVR5cGVzKG9NZXRhTW9kZWwsIG9DYXBhYmlsaXRpZXMpO1xuXHRcdG1NZXRhTW9kZWxNYXBbc01ldGFNb2RlbElkXSA9IEFubm90YXRpb25Db252ZXJ0ZXIuY29udmVydFR5cGVzKHBhcnNlZE91dHB1dCk7XG5cdH1cblx0cmV0dXJuIChtTWV0YU1vZGVsTWFwW3NNZXRhTW9kZWxJZF0gYXMgYW55KSBhcyBDb252ZXJ0ZXJPdXRwdXQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWxldGVNb2RlbENhY2hlRGF0YShvTWV0YU1vZGVsOiBPRGF0YU1ldGFNb2RlbCkge1xuXHRkZWxldGUgbU1ldGFNb2RlbE1hcFsob01ldGFNb2RlbCBhcyBhbnkpLmlkXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRNZXRhTW9kZWxDb250ZXh0KG9NZXRhTW9kZWxDb250ZXh0OiBDb250ZXh0LCBiSW5jbHVkZVZpc2l0ZWRPYmplY3RzOiBib29sZWFuID0gZmFsc2UpOiBhbnkge1xuXHRjb25zdCBvQ29udmVydGVyT3V0cHV0ID0gY29udmVydFR5cGVzKChvTWV0YU1vZGVsQ29udGV4dC5nZXRNb2RlbCgpIGFzIHVua25vd24pIGFzIE9EYXRhTWV0YU1vZGVsKTtcblx0Y29uc3Qgc1BhdGggPSBvTWV0YU1vZGVsQ29udGV4dC5nZXRQYXRoKCk7XG5cblx0Y29uc3QgYVBhdGhTcGxpdCA9IHNQYXRoLnNwbGl0KFwiL1wiKTtcblx0bGV0IHRhcmdldEVudGl0eVNldDogX0VudGl0eVNldCA9IG9Db252ZXJ0ZXJPdXRwdXQuZW50aXR5U2V0cy5maW5kKGVudGl0eVNldCA9PiBlbnRpdHlTZXQubmFtZSA9PT0gYVBhdGhTcGxpdFsxXSkgYXMgX0VudGl0eVNldDtcblx0bGV0IHJlbGF0aXZlUGF0aCA9IGFQYXRoU3BsaXQuc2xpY2UoMikuam9pbihcIi9cIik7XG5cblx0Y29uc3QgbG9jYWxPYmplY3RzOiBhbnlbXSA9IFt0YXJnZXRFbnRpdHlTZXRdO1xuXHR3aGlsZSAocmVsYXRpdmVQYXRoICYmIHJlbGF0aXZlUGF0aC5sZW5ndGggPiAwICYmIHJlbGF0aXZlUGF0aC5zdGFydHNXaXRoKFwiJE5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmdcIikpIHtcblx0XHRjb25zdCByZWxhdGl2ZVNwbGl0ID0gcmVsYXRpdmVQYXRoLnNwbGl0KFwiL1wiKTtcblx0XHRjb25zdCB0YXJnZXROYXZQcm9wID0gdGFyZ2V0RW50aXR5U2V0LmVudGl0eVR5cGUubmF2aWdhdGlvblByb3BlcnRpZXMuZmluZChuYXZQcm9wID0+IG5hdlByb3AubmFtZSA9PT0gcmVsYXRpdmVTcGxpdFsxXSk7XG5cdFx0aWYgKHRhcmdldE5hdlByb3ApIHtcblx0XHRcdGxvY2FsT2JqZWN0cy5wdXNoKHRhcmdldE5hdlByb3ApO1xuXHRcdH1cblx0XHR0YXJnZXRFbnRpdHlTZXQgPSB0YXJnZXRFbnRpdHlTZXQubmF2aWdhdGlvblByb3BlcnR5QmluZGluZ1tyZWxhdGl2ZVNwbGl0WzFdXTtcblx0XHRsb2NhbE9iamVjdHMucHVzaCh0YXJnZXRFbnRpdHlTZXQpO1xuXHRcdHJlbGF0aXZlUGF0aCA9IHJlbGF0aXZlU3BsaXQuc2xpY2UoMikuam9pbihcIi9cIik7XG5cdH1cblx0aWYgKHJlbGF0aXZlUGF0aC5zdGFydHNXaXRoKFwiJFR5cGVcIikpIHtcblx0XHQvLyBXZSdyZSBhbnl3YXkgZ29pbmcgdG8gbG9vayBvbiB0aGUgZW50aXR5VHlwZS4uLlxuXHRcdHJlbGF0aXZlUGF0aCA9IGFQYXRoU3BsaXQuc2xpY2UoMykuam9pbihcIi9cIik7XG5cdH1cblx0aWYgKHRhcmdldEVudGl0eVNldCAmJiByZWxhdGl2ZVBhdGgubGVuZ3RoKSB7XG5cdFx0Y29uc3Qgb1RhcmdldCA9IHRhcmdldEVudGl0eVNldC5lbnRpdHlUeXBlLnJlc29sdmVQYXRoKHJlbGF0aXZlUGF0aCwgYkluY2x1ZGVWaXNpdGVkT2JqZWN0cyk7XG5cdFx0aWYgKG9UYXJnZXQpIHtcblx0XHRcdGlmIChiSW5jbHVkZVZpc2l0ZWRPYmplY3RzKSB7XG5cdFx0XHRcdG9UYXJnZXQudmlzaXRlZE9iamVjdHMgPSBsb2NhbE9iamVjdHMuY29uY2F0KG9UYXJnZXQudmlzaXRlZE9iamVjdHMpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAodGFyZ2V0RW50aXR5U2V0LmVudGl0eVR5cGUgJiYgdGFyZ2V0RW50aXR5U2V0LmVudGl0eVR5cGUuYWN0aW9ucykge1xuXHRcdFx0Ly8gaWYgdGFyZ2V0IGlzIGFuIGFjdGlvbiBvciBhbiBhY3Rpb24gcGFyYW1ldGVyXG5cdFx0XHRjb25zdCBhY3Rpb25zID0gdGFyZ2V0RW50aXR5U2V0LmVudGl0eVR5cGUgJiYgdGFyZ2V0RW50aXR5U2V0LmVudGl0eVR5cGUuYWN0aW9ucztcblx0XHRcdGNvbnN0IHJlbGF0aXZlU3BsaXQgPSByZWxhdGl2ZVBhdGguc3BsaXQoXCIvXCIpO1xuXHRcdFx0aWYgKGFjdGlvbnNbcmVsYXRpdmVTcGxpdFswXV0pIHtcblx0XHRcdFx0Y29uc3QgYWN0aW9uID0gYWN0aW9uc1tyZWxhdGl2ZVNwbGl0WzBdXTtcblx0XHRcdFx0aWYgKHJlbGF0aXZlU3BsaXRbMV0gJiYgYWN0aW9uLnBhcmFtZXRlcnMpIHtcblx0XHRcdFx0XHRjb25zdCBwYXJhbWV0ZXJOYW1lID0gcmVsYXRpdmVTcGxpdFsxXTtcblx0XHRcdFx0XHRjb25zdCB0YXJnZXRQYXJhbWV0ZXIgPSBhY3Rpb24ucGFyYW1ldGVycy5maW5kKHBhcmFtZXRlciA9PiB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcGFyYW1ldGVyLmZ1bGx5UXVhbGlmaWVkTmFtZS5lbmRzV2l0aChcIi9cIiArIHBhcmFtZXRlck5hbWUpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHJldHVybiB0YXJnZXRQYXJhbWV0ZXI7XG5cdFx0XHRcdH0gZWxzZSBpZiAocmVsYXRpdmVQYXRoLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0XHRcdHJldHVybiBhY3Rpb247XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG9UYXJnZXQ7XG5cdH0gZWxzZSB7XG5cdFx0aWYgKGJJbmNsdWRlVmlzaXRlZE9iamVjdHMpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHRhcmdldDogdGFyZ2V0RW50aXR5U2V0LFxuXHRcdFx0XHR2aXNpdGVkT2JqZWN0czogbG9jYWxPYmplY3RzXG5cdFx0XHR9O1xuXHRcdH1cblx0XHRyZXR1cm4gdGFyZ2V0RW50aXR5U2V0O1xuXHR9XG59XG5cbnR5cGUgQ29udmVydGVyT2JqZWN0ID0ge1xuXHRfdHlwZTogc3RyaW5nO1xuXHRuYW1lOiBzdHJpbmc7XG59O1xuZXhwb3J0IHR5cGUgUmVzb2x2ZWRUYXJnZXQgPSB7XG5cdHRhcmdldD86IENvbnZlcnRlck9iamVjdDtcblx0dmlzaXRlZE9iamVjdHM6IENvbnZlcnRlck9iamVjdFtdO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEludm9sdmVkRGF0YU1vZGVsT2JqZWN0cyhvTWV0YU1vZGVsQ29udGV4dDogQ29udGV4dCwgb0VudGl0eVNldE1ldGFNb2RlbENvbnRleHQ/OiBDb250ZXh0KTogRGF0YU1vZGVsT2JqZWN0UGF0aCB7XG5cdGNvbnN0IG1ldGFNb2RlbENvbnRleHQgPSBjb252ZXJ0TWV0YU1vZGVsQ29udGV4dChvTWV0YU1vZGVsQ29udGV4dCwgdHJ1ZSk7XG5cdGxldCB0YXJnZXRFbnRpdHlTZXRMb2NhdGlvbjtcblx0aWYgKG9FbnRpdHlTZXRNZXRhTW9kZWxDb250ZXh0ICYmIG9FbnRpdHlTZXRNZXRhTW9kZWxDb250ZXh0LmdldFBhdGgoKSAhPT0gXCIvXCIpIHtcblx0XHR0YXJnZXRFbnRpdHlTZXRMb2NhdGlvbiA9IGdldEludm9sdmVkRGF0YU1vZGVsT2JqZWN0cyhvRW50aXR5U2V0TWV0YU1vZGVsQ29udGV4dCk7XG5cdH1cblx0cmV0dXJuIGdldEludm9sdmVkRGF0YU1vZGVsT2JqZWN0RnJvbVBhdGgobWV0YU1vZGVsQ29udGV4dCwgdGFyZ2V0RW50aXR5U2V0TG9jYXRpb24pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW52b2x2ZWREYXRhTW9kZWxPYmplY3RGcm9tUGF0aChcblx0bWV0YU1vZGVsQ29udGV4dDogUmVzb2x2ZWRUYXJnZXQsXG5cdHRhcmdldEVudGl0eVNldExvY2F0aW9uPzogRGF0YU1vZGVsT2JqZWN0UGF0aFxuKTogRGF0YU1vZGVsT2JqZWN0UGF0aCB7XG5cdGNvbnN0IGRhdGFNb2RlbE9iamVjdHMgPSBtZXRhTW9kZWxDb250ZXh0LnZpc2l0ZWRPYmplY3RzLmZpbHRlcihcblx0XHQodmlzaXRlZE9iamVjdDogYW55KSA9PiB2aXNpdGVkT2JqZWN0ICYmIHZpc2l0ZWRPYmplY3QuaGFzT3duUHJvcGVydHkoXCJfdHlwZVwiKSAmJiB2aXNpdGVkT2JqZWN0Ll90eXBlICE9PSBcIkVudGl0eVR5cGVcIlxuXHQpO1xuXHRpZiAobWV0YU1vZGVsQ29udGV4dC50YXJnZXQgJiYgbWV0YU1vZGVsQ29udGV4dC50YXJnZXQuaGFzT3duUHJvcGVydHkoXCJfdHlwZVwiKSAmJiBtZXRhTW9kZWxDb250ZXh0LnRhcmdldC5fdHlwZSAhPT0gXCJFbnRpdHlUeXBlXCIpIHtcblx0XHRkYXRhTW9kZWxPYmplY3RzLnB1c2gobWV0YU1vZGVsQ29udGV4dC50YXJnZXQpO1xuXHR9XG5cdGNvbnN0IG5hdmlnYXRpb25Qcm9wZXJ0aWVzOiBfTmF2aWdhdGlvblByb3BlcnR5W10gPSBbXTtcblx0Y29uc3Qgcm9vdEVudGl0eVNldDogX0VudGl0eVNldCA9IGRhdGFNb2RlbE9iamVjdHNbMF0gYXMgX0VudGl0eVNldDtcblx0Ly8gY3VycmVudEVudGl0eVNldCBjYW4gYmUgdW5kZWZpbmVkLlxuXHRsZXQgY3VycmVudEVudGl0eVNldDogX0VudGl0eVNldCB8IHVuZGVmaW5lZCA9IHJvb3RFbnRpdHlTZXQgYXMgX0VudGl0eVNldDtcblx0bGV0IGN1cnJlbnRFbnRpdHlUeXBlOiBfRW50aXR5VHlwZSA9IHJvb3RFbnRpdHlTZXQuZW50aXR5VHlwZTtcblx0bGV0IGkgPSAxO1xuXHRsZXQgY3VycmVudE9iamVjdDtcblx0bGV0IG5hdmlnYXRlZFBhdGhzID0gW107XG5cdHdoaWxlIChpIDwgZGF0YU1vZGVsT2JqZWN0cy5sZW5ndGgpIHtcblx0XHRjdXJyZW50T2JqZWN0ID0gZGF0YU1vZGVsT2JqZWN0c1tpKytdO1xuXHRcdGlmIChjdXJyZW50T2JqZWN0Ll90eXBlID09PSBcIk5hdmlnYXRpb25Qcm9wZXJ0eVwiKSB7XG5cdFx0XHRuYXZpZ2F0ZWRQYXRocy5wdXNoKGN1cnJlbnRPYmplY3QubmFtZSk7XG5cdFx0XHRuYXZpZ2F0aW9uUHJvcGVydGllcy5wdXNoKGN1cnJlbnRPYmplY3QgYXMgX05hdmlnYXRpb25Qcm9wZXJ0eSk7XG5cdFx0XHRjdXJyZW50RW50aXR5VHlwZSA9IChjdXJyZW50T2JqZWN0IGFzIF9OYXZpZ2F0aW9uUHJvcGVydHkpLnRhcmdldFR5cGU7XG5cdFx0XHRpZiAoY3VycmVudEVudGl0eVNldCAmJiBjdXJyZW50RW50aXR5U2V0Lm5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmcuaGFzT3duUHJvcGVydHkobmF2aWdhdGVkUGF0aHMuam9pbihcIi9cIikpKSB7XG5cdFx0XHRcdGN1cnJlbnRFbnRpdHlTZXQgPSBjdXJyZW50RW50aXR5U2V0Lm5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmdbY3VycmVudE9iamVjdC5uYW1lXTtcblx0XHRcdFx0bmF2aWdhdGVkUGF0aHMgPSBbXTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGN1cnJlbnRFbnRpdHlTZXQgPSB1bmRlZmluZWQ7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmIChjdXJyZW50T2JqZWN0Ll90eXBlID09PSBcIkVudGl0eVNldFwiKSB7XG5cdFx0XHRjdXJyZW50RW50aXR5U2V0ID0gY3VycmVudE9iamVjdCBhcyBfRW50aXR5U2V0O1xuXHRcdFx0Y3VycmVudEVudGl0eVR5cGUgPSBjdXJyZW50RW50aXR5U2V0LmVudGl0eVR5cGU7XG5cdFx0fVxuXHR9XG5cblx0aWYgKHRhcmdldEVudGl0eVNldExvY2F0aW9uICYmIHRhcmdldEVudGl0eVNldExvY2F0aW9uLnN0YXJ0aW5nRW50aXR5U2V0ICE9PSByb290RW50aXR5U2V0KSB7XG5cdFx0Ly8gSW4gY2FzZSB0aGUgZW50aXR5c2V0IGlzIG5vdCBzdGFydGluZyBmcm9tIHRoZSBzYW1lIGxvY2F0aW9uIGl0IG1heSBtZWFuIHRoYXQgd2UgYXJlIGRvaW5nIHRvbyBtdWNoIHdvcmsgZWFybGllciBmb3Igc29tZSByZWFzb25cblx0XHQvLyBBcyBzdWNoIHdlIG5lZWQgdG8gcmVkZWZpbmUgdGhlIGNvbnRleHQgc291cmNlIGZvciB0aGUgdGFyZ2V0RW50aXR5U2V0TG9jYXRpb25cblx0XHRjb25zdCBzdGFydGluZ0luZGV4ID0gZGF0YU1vZGVsT2JqZWN0cy5pbmRleE9mKHRhcmdldEVudGl0eVNldExvY2F0aW9uLnN0YXJ0aW5nRW50aXR5U2V0KTtcblx0XHRpZiAoc3RhcnRpbmdJbmRleCAhPT0gLTEpIHtcblx0XHRcdC8vIElmIGl0J3Mgbm90IGZvdW5kIEkgZG9uJ3Qga25vdyB3aGF0IHdlIGNhbiBkbyAocHJvYmFibHkgbm90aGluZylcblx0XHRcdGNvbnN0IHJlcXVpcmVkRGF0YU1vZGVsT2JqZWN0cyA9IGRhdGFNb2RlbE9iamVjdHMuc2xpY2UoMCwgc3RhcnRpbmdJbmRleCk7XG5cdFx0XHR0YXJnZXRFbnRpdHlTZXRMb2NhdGlvbi5zdGFydGluZ0VudGl0eVNldCA9IHJvb3RFbnRpdHlTZXQ7XG5cdFx0XHR0YXJnZXRFbnRpdHlTZXRMb2NhdGlvbi5uYXZpZ2F0aW9uUHJvcGVydGllcyA9IHJlcXVpcmVkRGF0YU1vZGVsT2JqZWN0c1xuXHRcdFx0XHQuZmlsdGVyKChvYmplY3Q6IGFueSkgPT4gb2JqZWN0Ll90eXBlID09PSBcIk5hdmlnYXRpb25Qcm9wZXJ0eVwiKVxuXHRcdFx0XHQuY29uY2F0KHRhcmdldEVudGl0eVNldExvY2F0aW9uLm5hdmlnYXRpb25Qcm9wZXJ0aWVzKSBhcyBfTmF2aWdhdGlvblByb3BlcnR5W107XG5cdFx0fVxuXHR9XG5cdGNvbnN0IG91dERhdGFNb2RlbFBhdGggPSB7XG5cdFx0c3RhcnRpbmdFbnRpdHlTZXQ6IHJvb3RFbnRpdHlTZXQsXG5cdFx0dGFyZ2V0RW50aXR5U2V0OiBjdXJyZW50RW50aXR5U2V0LFxuXHRcdHRhcmdldEVudGl0eVR5cGU6IGN1cnJlbnRFbnRpdHlUeXBlLFxuXHRcdHRhcmdldE9iamVjdDogbWV0YU1vZGVsQ29udGV4dC50YXJnZXQsXG5cdFx0bmF2aWdhdGlvblByb3BlcnRpZXMsXG5cdFx0Y29udGV4dExvY2F0aW9uOiB0YXJnZXRFbnRpdHlTZXRMb2NhdGlvblxuXHR9O1xuXHRpZiAoIW91dERhdGFNb2RlbFBhdGguY29udGV4dExvY2F0aW9uKSB7XG5cdFx0b3V0RGF0YU1vZGVsUGF0aC5jb250ZXh0TG9jYXRpb24gPSBvdXREYXRhTW9kZWxQYXRoO1xuXHR9XG5cdHJldHVybiBvdXREYXRhTW9kZWxQYXRoO1xufVxuIl19