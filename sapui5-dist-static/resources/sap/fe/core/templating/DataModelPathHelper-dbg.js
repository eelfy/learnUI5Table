sap.ui.define(["sap/fe/core/helpers/BindingExpression", "sap/fe/core/templating/PropertyHelper"], function (BindingExpression, PropertyHelper) {
  "use strict";

  var _exports = {};
  var isPathExpression = PropertyHelper.isPathExpression;
  var equal = BindingExpression.equal;
  var constant = BindingExpression.constant;
  var annotationExpression = BindingExpression.annotationExpression;

  var getPathRelativeLocation = function (contextPath) {
    var visitedNavProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    if (!contextPath) {
      return visitedNavProps.map(function (navProp) {
        return navProp.name;
      });
    } else {
      if (visitedNavProps.length >= contextPath.navigationProperties.length) {
        var remainingNavProps = [];
        contextPath.navigationProperties.forEach(function (navProp, navIndex) {
          if (visitedNavProps[navIndex] !== navProp) {
            remainingNavProps.push(visitedNavProps[navIndex]);
          }
        });
        remainingNavProps = remainingNavProps.concat(visitedNavProps.slice(contextPath.navigationProperties.length));
        return remainingNavProps.map(function (navProp) {
          return navProp.name;
        });
      } else {
        var extraNavProp = [];
        visitedNavProps.forEach(function (navProp, navIndex) {
          if (contextPath.navigationProperties[navIndex] !== navProp) {
            extraNavProp.push(visitedNavProps[navIndex]);
          }
        });
        extraNavProp = extraNavProp.concat(contextPath.navigationProperties.slice(visitedNavProps.length));
        return extraNavProp.map(function (navProp) {
          return navProp.partner;
        });
      }
    }
  };

  _exports.getPathRelativeLocation = getPathRelativeLocation;

  var enhanceDataModelPath = function (dataModelObjectPath, propertyPath) {
    var sPropertyPath = "";

    if (isPathExpression(propertyPath) && propertyPath.path) {
      sPropertyPath = propertyPath.path;
    } else if (typeof propertyPath === "string") {
      sPropertyPath = propertyPath;
    }

    var oTarget;

    if (isPathExpression(propertyPath)) {
      oTarget = propertyPath.$target;
    } else if (dataModelObjectPath.targetEntityType) {
      oTarget = dataModelObjectPath.targetEntityType.resolvePath(sPropertyPath);
    } else {
      oTarget = dataModelObjectPath.targetObject;
    }

    var aPathSplit = sPropertyPath.split("/");
    var currentEntitySet = dataModelObjectPath.targetEntitySet;
    var currentEntityType = dataModelObjectPath.targetEntityType;
    var navigationProperties = dataModelObjectPath.navigationProperties.concat(); // Process only if we have to go through navigation properties

    aPathSplit.reduce(function (reducedEntityType, pathPart) {
      if (!reducedEntityType) {
        return undefined;
      }

      var potentialNavProp = reducedEntityType.navigationProperties.find(function (navProp) {
        return navProp.name === pathPart;
      });

      if (potentialNavProp) {
        navigationProperties.push(potentialNavProp);
        currentEntityType = potentialNavProp.targetType;

        if (currentEntitySet && currentEntitySet.navigationPropertyBinding.hasOwnProperty(pathPart)) {
          currentEntitySet = currentEntitySet.navigationPropertyBinding[pathPart];
        }

        return currentEntityType;
      }

      return undefined;
    }, dataModelObjectPath.targetEntityType);
    return {
      startingEntitySet: dataModelObjectPath.startingEntitySet,
      navigationProperties: navigationProperties,
      contextLocation: dataModelObjectPath.contextLocation,
      targetEntitySet: currentEntitySet,
      targetEntityType: currentEntityType,
      targetObject: oTarget
    };
  };

  _exports.enhanceDataModelPath = enhanceDataModelPath;

  var getTargetEntitySetPath = function (dataModelObjectPath) {
    var targetEntitySetPath = "/".concat(dataModelObjectPath.startingEntitySet.name);
    var currentEntitySet = dataModelObjectPath.startingEntitySet;
    var navigatedPaths = [];
    dataModelObjectPath.navigationProperties.forEach(function (navProp) {
      navigatedPaths.push(navProp.name);

      if (currentEntitySet && currentEntitySet.navigationPropertyBinding.hasOwnProperty(navigatedPaths.join("/"))) {
        targetEntitySetPath += "/$NavigationPropertyBinding/".concat(navigatedPaths.join("/"), "/$");
        currentEntitySet = currentEntitySet.navigationPropertyBinding[navigatedPaths.join("/")];
        navigatedPaths = [];
      }
    });
    return targetEntitySetPath;
  };

  _exports.getTargetEntitySetPath = getTargetEntitySetPath;

  var getTargetObjectPath = function (dataModelObjectPath) {
    var bRelative = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var path = "";

    if (!bRelative) {
      path += "/".concat(dataModelObjectPath.startingEntitySet.name);
    }

    if (dataModelObjectPath.navigationProperties.length > 0) {
      if (path.length > 0) {
        path += "/";
      }

      path += dataModelObjectPath.navigationProperties.map(function (navProp) {
        return navProp.name;
      }).join("/");
    }

    if (dataModelObjectPath.targetObject && dataModelObjectPath.targetObject.name && dataModelObjectPath.targetObject._type !== "NavigationProperty" && dataModelObjectPath.targetObject._type !== "EntityType" && dataModelObjectPath.targetObject !== dataModelObjectPath.startingEntitySet) {
      if (!path.endsWith("/")) {
        path += "/";
      }

      path += "".concat(dataModelObjectPath.targetObject.name);
    } else if (dataModelObjectPath.targetObject && dataModelObjectPath.targetObject.hasOwnProperty("term")) {
      if (path.length > 0 && !path.endsWith("/")) {
        path += "/";
      }

      path += "@".concat(dataModelObjectPath.targetObject.term);
    }

    return path;
  };

  _exports.getTargetObjectPath = getTargetObjectPath;

  var getContextRelativeTargetObjectPath = function (dataModelObjectPath) {
    var path = getPathRelativeLocation(dataModelObjectPath.contextLocation, dataModelObjectPath.navigationProperties).join("/");

    if (dataModelObjectPath.targetObject && dataModelObjectPath.targetObject.name && dataModelObjectPath.targetObject._type !== "NavigationProperty" && dataModelObjectPath.targetObject !== dataModelObjectPath.startingEntitySet) {
      if (path.length > 0 && !path.endsWith("/")) {
        path += "/";
      }

      path += "".concat(dataModelObjectPath.targetObject.name);
    } else if (dataModelObjectPath.targetObject && dataModelObjectPath.targetObject.hasOwnProperty("term")) {
      if (path.length > 0 && !path.endsWith("/")) {
        path += "/";
      }

      path += "@".concat(dataModelObjectPath.targetObject.term);
    }

    return path;
  };

  _exports.getContextRelativeTargetObjectPath = getContextRelativeTargetObjectPath;

  var isPathUpdatable = function (dataModelObjectPath, propertyPath) {
    return checkOnPath(dataModelObjectPath, function (annotationObject) {
      var _annotationObject$Upd;

      return annotationObject === null || annotationObject === void 0 ? void 0 : (_annotationObject$Upd = annotationObject.UpdateRestrictions) === null || _annotationObject$Upd === void 0 ? void 0 : _annotationObject$Upd.Updatable;
    }, propertyPath);
  };

  _exports.isPathUpdatable = isPathUpdatable;

  var isPathDeletable = function (dataModelObjectPath, propertyPath, bTableCase) {
    return checkOnPath(dataModelObjectPath, function (annotationObject) {
      var _annotationObject$Del;

      return annotationObject === null || annotationObject === void 0 ? void 0 : (_annotationObject$Del = annotationObject.DeleteRestrictions) === null || _annotationObject$Del === void 0 ? void 0 : _annotationObject$Del.Deletable;
    }, propertyPath, bTableCase);
  };

  _exports.isPathDeletable = isPathDeletable;

  var isPathInsertable = function (dataModelObjectPath, propertyPath) {
    return checkOnPath(dataModelObjectPath, function (annotationObject) {
      var _annotationObject$Ins;

      return annotationObject === null || annotationObject === void 0 ? void 0 : (_annotationObject$Ins = annotationObject.InsertRestrictions) === null || _annotationObject$Ins === void 0 ? void 0 : _annotationObject$Ins.Insertable;
    }, propertyPath);
  };

  _exports.isPathInsertable = isPathInsertable;

  var checkFilterExpressionRestrictions = function (dataModelObjectPath, allowedExpression) {
    return checkOnPath(dataModelObjectPath, function (annotationObject) {
      var _annotationObject$Fil;

      var filterExpressionRestrictions = (annotationObject === null || annotationObject === void 0 ? void 0 : (_annotationObject$Fil = annotationObject.FilterRestrictions) === null || _annotationObject$Fil === void 0 ? void 0 : _annotationObject$Fil.FilterExpressionRestrictions) || [];
      var currentObjectRestriction = filterExpressionRestrictions.find(function (restriction) {
        return restriction.Property.$target === dataModelObjectPath.targetObject;
      });

      if (currentObjectRestriction) {
        var _currentObjectRestric;

        return allowedExpression.indexOf(currentObjectRestriction === null || currentObjectRestriction === void 0 ? void 0 : (_currentObjectRestric = currentObjectRestriction.AllowedExpressions) === null || _currentObjectRestric === void 0 ? void 0 : _currentObjectRestric.toString()) !== -1;
      } else {
        return false;
      }
    });
  };

  _exports.checkFilterExpressionRestrictions = checkFilterExpressionRestrictions;

  var checkOnPath = function (dataModelObjectPath, checkFunction, propertyPath, bTableCase) {
    var _targetEntitySet, _targetEntitySet$anno;

    if (!dataModelObjectPath || !dataModelObjectPath.startingEntitySet) {
      return constant(true);
    }

    dataModelObjectPath = enhanceDataModelPath(dataModelObjectPath, propertyPath);
    var currentEntitySet = dataModelObjectPath.startingEntitySet;
    var parentEntitySet = null;
    var visitedNavigationPropsName = [];
    var allVisitedNavigationProps = [];
    var targetEntitySet = currentEntitySet;
    var resetVisitedNavProps = false;
    dataModelObjectPath.navigationProperties.forEach(function (navigationProperty) {
      if (resetVisitedNavProps) {
        visitedNavigationPropsName = [];
      }

      visitedNavigationPropsName.push(navigationProperty.name);
      allVisitedNavigationProps.push(navigationProperty);

      if (!navigationProperty.containsTarget) {
        // We should have a navigationPropertyBinding associated with the path so far which can consist of ([ContainmentNavProp]/)*[NavProp]
        var _fullNavigationPath = visitedNavigationPropsName.join("/");

        if (currentEntitySet && currentEntitySet.navigationPropertyBinding.hasOwnProperty(_fullNavigationPath)) {
          parentEntitySet = currentEntitySet;
          currentEntitySet = currentEntitySet.navigationPropertyBinding[_fullNavigationPath];
          targetEntitySet = currentEntitySet; // If we reached a navigation property with a navigationpropertybinding, we need to reset the visited path on the next iteration (if there is one)

          resetVisitedNavProps = true;
        } else {
          // We really should not end up here but at least let's try to avoid incorrect behavior
          parentEntitySet = currentEntitySet;
          currentEntitySet = null;
          resetVisitedNavProps = true;
        }
      } else {
        parentEntitySet = currentEntitySet;
        targetEntitySet = null;
      }
    }); // At this point we have navigated down all the nav prop and we should have
    // The target entityset pointing to either null (in case of containment navprop a last part), or the actual target (non containment as target)
    // The parent entitySet pointing to the previous entityset used in the path
    // VisitedNavigationPath should contain the path up to this property
    // Restrictions should then be evaluated as ParentEntitySet.NavRestrictions[NavpropertyPath] || TargetEntitySet.Restrictions

    var fullNavigationPath = visitedNavigationPropsName.join("/");
    var restrictions;

    if (parentEntitySet !== null) {
      var _parentEntitySet$anno, _parentEntitySet$anno2, _parentEntitySet$anno3;

      var _parentEntitySet = parentEntitySet;
      (_parentEntitySet$anno = _parentEntitySet.annotations) === null || _parentEntitySet$anno === void 0 ? void 0 : (_parentEntitySet$anno2 = _parentEntitySet$anno.Capabilities) === null || _parentEntitySet$anno2 === void 0 ? void 0 : (_parentEntitySet$anno3 = _parentEntitySet$anno2.NavigationRestrictions) === null || _parentEntitySet$anno3 === void 0 ? void 0 : _parentEntitySet$anno3.RestrictedProperties.forEach(function (restrictedNavProp) {
        var _restrictedNavProp$Na;

        if (((_restrictedNavProp$Na = restrictedNavProp.NavigationProperty) === null || _restrictedNavProp$Na === void 0 ? void 0 : _restrictedNavProp$Na.type) === "NavigationPropertyPath") {
          var _restrictionDefinition = checkFunction(restrictedNavProp);

          if (fullNavigationPath === restrictedNavProp.NavigationProperty.value && _restrictionDefinition !== undefined) {
            var _dataModelObjectPath;

            restrictions = equal(annotationExpression(_restrictionDefinition, getPathRelativeLocation((_dataModelObjectPath = dataModelObjectPath) === null || _dataModelObjectPath === void 0 ? void 0 : _dataModelObjectPath.contextLocation, allVisitedNavigationProps.slice(0, -1))), true);
          }
        }
      });
    }

    var targetRestrictions;
    var restrictionDefinition = checkFunction((_targetEntitySet = targetEntitySet) === null || _targetEntitySet === void 0 ? void 0 : (_targetEntitySet$anno = _targetEntitySet.annotations) === null || _targetEntitySet$anno === void 0 ? void 0 : _targetEntitySet$anno.Capabilities);

    if (restrictionDefinition !== undefined) {
      targetRestrictions = equal(annotationExpression(restrictionDefinition, getPathRelativeLocation(dataModelObjectPath.contextLocation, allVisitedNavigationProps)), true);
    } //object page table case in path based scenario's fallback to exisiting approach


    if (bTableCase && !restrictions && (restrictionDefinition === null || restrictionDefinition === void 0 ? void 0 : restrictionDefinition.path)) {
      var oResult = {
        "currentEntityRestriction": targetRestrictions
      };
      return oResult;
    }

    return restrictions || targetRestrictions || constant(true);
  };

  _exports.checkOnPath = checkOnPath;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRhdGFNb2RlbFBhdGhIZWxwZXIudHMiXSwibmFtZXMiOlsiZ2V0UGF0aFJlbGF0aXZlTG9jYXRpb24iLCJjb250ZXh0UGF0aCIsInZpc2l0ZWROYXZQcm9wcyIsIm1hcCIsIm5hdlByb3AiLCJuYW1lIiwibGVuZ3RoIiwibmF2aWdhdGlvblByb3BlcnRpZXMiLCJyZW1haW5pbmdOYXZQcm9wcyIsImZvckVhY2giLCJuYXZJbmRleCIsInB1c2giLCJjb25jYXQiLCJzbGljZSIsImV4dHJhTmF2UHJvcCIsInBhcnRuZXIiLCJlbmhhbmNlRGF0YU1vZGVsUGF0aCIsImRhdGFNb2RlbE9iamVjdFBhdGgiLCJwcm9wZXJ0eVBhdGgiLCJzUHJvcGVydHlQYXRoIiwiaXNQYXRoRXhwcmVzc2lvbiIsInBhdGgiLCJvVGFyZ2V0IiwiJHRhcmdldCIsInRhcmdldEVudGl0eVR5cGUiLCJyZXNvbHZlUGF0aCIsInRhcmdldE9iamVjdCIsImFQYXRoU3BsaXQiLCJzcGxpdCIsImN1cnJlbnRFbnRpdHlTZXQiLCJ0YXJnZXRFbnRpdHlTZXQiLCJjdXJyZW50RW50aXR5VHlwZSIsInJlZHVjZSIsInJlZHVjZWRFbnRpdHlUeXBlIiwicGF0aFBhcnQiLCJ1bmRlZmluZWQiLCJwb3RlbnRpYWxOYXZQcm9wIiwiZmluZCIsInRhcmdldFR5cGUiLCJuYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nIiwiaGFzT3duUHJvcGVydHkiLCJzdGFydGluZ0VudGl0eVNldCIsImNvbnRleHRMb2NhdGlvbiIsImdldFRhcmdldEVudGl0eVNldFBhdGgiLCJ0YXJnZXRFbnRpdHlTZXRQYXRoIiwibmF2aWdhdGVkUGF0aHMiLCJqb2luIiwiZ2V0VGFyZ2V0T2JqZWN0UGF0aCIsImJSZWxhdGl2ZSIsIl90eXBlIiwiZW5kc1dpdGgiLCJ0ZXJtIiwiZ2V0Q29udGV4dFJlbGF0aXZlVGFyZ2V0T2JqZWN0UGF0aCIsImlzUGF0aFVwZGF0YWJsZSIsImNoZWNrT25QYXRoIiwiYW5ub3RhdGlvbk9iamVjdCIsIlVwZGF0ZVJlc3RyaWN0aW9ucyIsIlVwZGF0YWJsZSIsImlzUGF0aERlbGV0YWJsZSIsImJUYWJsZUNhc2UiLCJEZWxldGVSZXN0cmljdGlvbnMiLCJEZWxldGFibGUiLCJpc1BhdGhJbnNlcnRhYmxlIiwiSW5zZXJ0UmVzdHJpY3Rpb25zIiwiSW5zZXJ0YWJsZSIsImNoZWNrRmlsdGVyRXhwcmVzc2lvblJlc3RyaWN0aW9ucyIsImFsbG93ZWRFeHByZXNzaW9uIiwiZmlsdGVyRXhwcmVzc2lvblJlc3RyaWN0aW9ucyIsIkZpbHRlclJlc3RyaWN0aW9ucyIsIkZpbHRlckV4cHJlc3Npb25SZXN0cmljdGlvbnMiLCJjdXJyZW50T2JqZWN0UmVzdHJpY3Rpb24iLCJyZXN0cmljdGlvbiIsIlByb3BlcnR5IiwiaW5kZXhPZiIsIkFsbG93ZWRFeHByZXNzaW9ucyIsInRvU3RyaW5nIiwiY2hlY2tGdW5jdGlvbiIsImNvbnN0YW50IiwicGFyZW50RW50aXR5U2V0IiwidmlzaXRlZE5hdmlnYXRpb25Qcm9wc05hbWUiLCJhbGxWaXNpdGVkTmF2aWdhdGlvblByb3BzIiwicmVzZXRWaXNpdGVkTmF2UHJvcHMiLCJuYXZpZ2F0aW9uUHJvcGVydHkiLCJjb250YWluc1RhcmdldCIsImZ1bGxOYXZpZ2F0aW9uUGF0aCIsInJlc3RyaWN0aW9ucyIsIl9wYXJlbnRFbnRpdHlTZXQiLCJhbm5vdGF0aW9ucyIsIkNhcGFiaWxpdGllcyIsIk5hdmlnYXRpb25SZXN0cmljdGlvbnMiLCJSZXN0cmljdGVkUHJvcGVydGllcyIsInJlc3RyaWN0ZWROYXZQcm9wIiwiTmF2aWdhdGlvblByb3BlcnR5IiwidHlwZSIsInJlc3RyaWN0aW9uRGVmaW5pdGlvbiIsInZhbHVlIiwiZXF1YWwiLCJhbm5vdGF0aW9uRXhwcmVzc2lvbiIsInRhcmdldFJlc3RyaWN0aW9ucyIsIm9SZXN1bHQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQXFCTyxNQUFNQSx1QkFBdUIsR0FBRyxVQUFTQyxXQUFULEVBQWtHO0FBQUEsUUFBdERDLGVB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LEdBQUdGLEtBQUssQ0FDekJDLG9CQUFvQixDQUNuQkgscUJBRG1CLEVBRW5COUYsdUJBQXVCLENBQUNpQixtQkFBbUIsQ0FBQ3lCLGVBQXJCLEVBQXNDc0MseUJBQXRDLENBRkosQ0FESyxFQUt6QixJQUx5QixDQUExQjtBQU9BLEtBN0VxQixDQThFdEI7OztBQUNBLFFBQUlyQixVQUFVLElBQUksQ0FBQzBCLFlBQWYsS0FBK0JTLHFCQUEvQixhQUErQkEscUJBQS9CLHVCQUErQkEscUJBQXFCLENBQUV6RSxJQUF0RCxDQUFKLEVBQWdFO0FBQy9ELFVBQU04RSxPQUFZLEdBQUc7QUFDcEIsb0NBQTRCRDtBQURSLE9BQXJCO0FBR0EsYUFBT0MsT0FBUDtBQUNBOztBQUNELFdBQU9kLFlBQVksSUFBSWEsa0JBQWhCLElBQXNDckIsUUFBUSxDQUFDLElBQUQsQ0FBckQ7QUFDQSxHQTNGTSIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRW50aXR5U2V0LCBFbnRpdHlUeXBlLCBOYXZpZ2F0aW9uUHJvcGVydHksIFByb3BlcnR5IH0gZnJvbSBcIkBzYXAtdXgvYW5ub3RhdGlvbi1jb252ZXJ0ZXJcIjtcbmltcG9ydCB7IGFubm90YXRpb25FeHByZXNzaW9uLCBjb25zdGFudCwgZXF1YWwsIEV4cHJlc3Npb24gfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9CaW5kaW5nRXhwcmVzc2lvblwiO1xuaW1wb3J0IHsgTmF2aWdhdGlvblByb3BlcnR5UmVzdHJpY3Rpb25UeXBlcyB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlcy9kaXN0L2dlbmVyYXRlZC9DYXBhYmlsaXRpZXNcIjtcbmltcG9ydCB7IFByb3BlcnR5T3JQYXRoIH0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvVUlGb3JtYXR0ZXJzXCI7XG5pbXBvcnQgeyBpc1BhdGhFeHByZXNzaW9uIH0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvUHJvcGVydHlIZWxwZXJcIjtcbmltcG9ydCB7XG5cdEZpbHRlckV4cHJlc3Npb25SZXN0cmljdGlvblR5cGVUeXBlcyxcblx0TmF2aWdhdGlvblByb3BlcnR5UmVzdHJpY3Rpb25cbn0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzL3R5cGVzL2dlbmVyYXRlZC9DYXBhYmlsaXRpZXNcIjtcbmltcG9ydCB7IEVudGl0eVNldEFubm90YXRpb25zX0NhcGFiaWxpdGllcyB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlcy9kaXN0L2dlbmVyYXRlZC9DYXBhYmlsaXRpZXNfRWRtXCI7XG5pbXBvcnQgeyBQcm9wZXJ0eVBhdGggfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXNcIjtcblxuZXhwb3J0IHR5cGUgRGF0YU1vZGVsT2JqZWN0UGF0aCA9IHtcblx0c3RhcnRpbmdFbnRpdHlTZXQ6IEVudGl0eVNldDtcblx0Y29udGV4dExvY2F0aW9uPzogRGF0YU1vZGVsT2JqZWN0UGF0aDtcblx0bmF2aWdhdGlvblByb3BlcnRpZXM6IE5hdmlnYXRpb25Qcm9wZXJ0eVtdO1xuXHR0YXJnZXRFbnRpdHlTZXQ/OiBFbnRpdHlTZXQ7XG5cdHRhcmdldEVudGl0eVR5cGU6IEVudGl0eVR5cGU7XG5cdHRhcmdldE9iamVjdDogYW55O1xufTtcblxuZXhwb3J0IGNvbnN0IGdldFBhdGhSZWxhdGl2ZUxvY2F0aW9uID0gZnVuY3Rpb24oY29udGV4dFBhdGg/OiBEYXRhTW9kZWxPYmplY3RQYXRoLCB2aXNpdGVkTmF2UHJvcHM6IE5hdmlnYXRpb25Qcm9wZXJ0eVtdID0gW10pOiBzdHJpbmdbXSB7XG5cdGlmICghY29udGV4dFBhdGgpIHtcblx0XHRyZXR1cm4gdmlzaXRlZE5hdlByb3BzLm1hcChuYXZQcm9wID0+IG5hdlByb3AubmFtZSk7XG5cdH0gZWxzZSB7XG5cdFx0aWYgKHZpc2l0ZWROYXZQcm9wcy5sZW5ndGggPj0gY29udGV4dFBhdGgubmF2aWdhdGlvblByb3BlcnRpZXMubGVuZ3RoKSB7XG5cdFx0XHRsZXQgcmVtYWluaW5nTmF2UHJvcHM6IE5hdmlnYXRpb25Qcm9wZXJ0eVtdID0gW107XG5cdFx0XHRjb250ZXh0UGF0aC5uYXZpZ2F0aW9uUHJvcGVydGllcy5mb3JFYWNoKChuYXZQcm9wLCBuYXZJbmRleCkgPT4ge1xuXHRcdFx0XHRpZiAodmlzaXRlZE5hdlByb3BzW25hdkluZGV4XSAhPT0gbmF2UHJvcCkge1xuXHRcdFx0XHRcdHJlbWFpbmluZ05hdlByb3BzLnB1c2godmlzaXRlZE5hdlByb3BzW25hdkluZGV4XSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmVtYWluaW5nTmF2UHJvcHMgPSByZW1haW5pbmdOYXZQcm9wcy5jb25jYXQodmlzaXRlZE5hdlByb3BzLnNsaWNlKGNvbnRleHRQYXRoLm5hdmlnYXRpb25Qcm9wZXJ0aWVzLmxlbmd0aCkpO1xuXHRcdFx0cmV0dXJuIHJlbWFpbmluZ05hdlByb3BzLm1hcChuYXZQcm9wID0+IG5hdlByb3AubmFtZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGxldCBleHRyYU5hdlByb3A6IE5hdmlnYXRpb25Qcm9wZXJ0eVtdID0gW107XG5cdFx0XHR2aXNpdGVkTmF2UHJvcHMuZm9yRWFjaCgobmF2UHJvcCwgbmF2SW5kZXgpID0+IHtcblx0XHRcdFx0aWYgKGNvbnRleHRQYXRoLm5hdmlnYXRpb25Qcm9wZXJ0aWVzW25hdkluZGV4XSAhPT0gbmF2UHJvcCkge1xuXHRcdFx0XHRcdGV4dHJhTmF2UHJvcC5wdXNoKHZpc2l0ZWROYXZQcm9wc1tuYXZJbmRleF0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdGV4dHJhTmF2UHJvcCA9IGV4dHJhTmF2UHJvcC5jb25jYXQoY29udGV4dFBhdGgubmF2aWdhdGlvblByb3BlcnRpZXMuc2xpY2UodmlzaXRlZE5hdlByb3BzLmxlbmd0aCkpO1xuXHRcdFx0cmV0dXJuIGV4dHJhTmF2UHJvcC5tYXAobmF2UHJvcCA9PiBuYXZQcm9wLnBhcnRuZXIpO1xuXHRcdH1cblx0fVxufTtcblxuZXhwb3J0IGNvbnN0IGVuaGFuY2VEYXRhTW9kZWxQYXRoID0gZnVuY3Rpb24oXG5cdGRhdGFNb2RlbE9iamVjdFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgsXG5cdHByb3BlcnR5UGF0aD86IFByb3BlcnR5T3JQYXRoPFByb3BlcnR5PlxuKTogRGF0YU1vZGVsT2JqZWN0UGF0aCB7XG5cdGxldCBzUHJvcGVydHlQYXRoOiBzdHJpbmcgPSBcIlwiO1xuXHRpZiAoaXNQYXRoRXhwcmVzc2lvbihwcm9wZXJ0eVBhdGgpICYmIHByb3BlcnR5UGF0aC5wYXRoKSB7XG5cdFx0c1Byb3BlcnR5UGF0aCA9IHByb3BlcnR5UGF0aC5wYXRoO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBwcm9wZXJ0eVBhdGggPT09IFwic3RyaW5nXCIpIHtcblx0XHRzUHJvcGVydHlQYXRoID0gcHJvcGVydHlQYXRoIGFzIHN0cmluZztcblx0fVxuXHRsZXQgb1RhcmdldDtcblx0aWYgKGlzUGF0aEV4cHJlc3Npb24ocHJvcGVydHlQYXRoKSkge1xuXHRcdG9UYXJnZXQgPSBwcm9wZXJ0eVBhdGguJHRhcmdldDtcblx0fSBlbHNlIGlmIChkYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldEVudGl0eVR5cGUpIHtcblx0XHRvVGFyZ2V0ID0gZGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRFbnRpdHlUeXBlLnJlc29sdmVQYXRoKHNQcm9wZXJ0eVBhdGgpO1xuXHR9IGVsc2Uge1xuXHRcdG9UYXJnZXQgPSBkYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdDtcblx0fVxuXHRjb25zdCBhUGF0aFNwbGl0ID0gc1Byb3BlcnR5UGF0aC5zcGxpdChcIi9cIik7XG5cdGxldCBjdXJyZW50RW50aXR5U2V0ID0gZGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRFbnRpdHlTZXQ7XG5cdGxldCBjdXJyZW50RW50aXR5VHlwZSA9IGRhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0RW50aXR5VHlwZTtcblx0Y29uc3QgbmF2aWdhdGlvblByb3BlcnRpZXMgPSBkYXRhTW9kZWxPYmplY3RQYXRoLm5hdmlnYXRpb25Qcm9wZXJ0aWVzLmNvbmNhdCgpO1xuXHQvLyBQcm9jZXNzIG9ubHkgaWYgd2UgaGF2ZSB0byBnbyB0aHJvdWdoIG5hdmlnYXRpb24gcHJvcGVydGllc1xuXG5cdGFQYXRoU3BsaXQucmVkdWNlKChyZWR1Y2VkRW50aXR5VHlwZTogRW50aXR5VHlwZSB8IHVuZGVmaW5lZCwgcGF0aFBhcnQ6IHN0cmluZykgPT4ge1xuXHRcdGlmICghcmVkdWNlZEVudGl0eVR5cGUpIHtcblx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0fVxuXHRcdGNvbnN0IHBvdGVudGlhbE5hdlByb3AgPSByZWR1Y2VkRW50aXR5VHlwZS5uYXZpZ2F0aW9uUHJvcGVydGllcy5maW5kKG5hdlByb3AgPT4gbmF2UHJvcC5uYW1lID09PSBwYXRoUGFydCk7XG5cdFx0aWYgKHBvdGVudGlhbE5hdlByb3ApIHtcblx0XHRcdG5hdmlnYXRpb25Qcm9wZXJ0aWVzLnB1c2gocG90ZW50aWFsTmF2UHJvcCk7XG5cdFx0XHRjdXJyZW50RW50aXR5VHlwZSA9IHBvdGVudGlhbE5hdlByb3AudGFyZ2V0VHlwZTtcblx0XHRcdGlmIChjdXJyZW50RW50aXR5U2V0ICYmIGN1cnJlbnRFbnRpdHlTZXQubmF2aWdhdGlvblByb3BlcnR5QmluZGluZy5oYXNPd25Qcm9wZXJ0eShwYXRoUGFydCkpIHtcblx0XHRcdFx0Y3VycmVudEVudGl0eVNldCA9IGN1cnJlbnRFbnRpdHlTZXQubmF2aWdhdGlvblByb3BlcnR5QmluZGluZ1twYXRoUGFydF07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gY3VycmVudEVudGl0eVR5cGU7XG5cdFx0fVxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdH0sIGRhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0RW50aXR5VHlwZSk7XG5cblx0cmV0dXJuIHtcblx0XHRzdGFydGluZ0VudGl0eVNldDogZGF0YU1vZGVsT2JqZWN0UGF0aC5zdGFydGluZ0VudGl0eVNldCxcblx0XHRuYXZpZ2F0aW9uUHJvcGVydGllczogbmF2aWdhdGlvblByb3BlcnRpZXMsXG5cdFx0Y29udGV4dExvY2F0aW9uOiBkYXRhTW9kZWxPYmplY3RQYXRoLmNvbnRleHRMb2NhdGlvbixcblx0XHR0YXJnZXRFbnRpdHlTZXQ6IGN1cnJlbnRFbnRpdHlTZXQsXG5cdFx0dGFyZ2V0RW50aXR5VHlwZTogY3VycmVudEVudGl0eVR5cGUsXG5cdFx0dGFyZ2V0T2JqZWN0OiBvVGFyZ2V0XG5cdH07XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0VGFyZ2V0RW50aXR5U2V0UGF0aCA9IGZ1bmN0aW9uKGRhdGFNb2RlbE9iamVjdFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgpOiBzdHJpbmcge1xuXHRsZXQgdGFyZ2V0RW50aXR5U2V0UGF0aDogc3RyaW5nID0gYC8ke2RhdGFNb2RlbE9iamVjdFBhdGguc3RhcnRpbmdFbnRpdHlTZXQubmFtZX1gO1xuXHRsZXQgY3VycmVudEVudGl0eVNldCA9IGRhdGFNb2RlbE9iamVjdFBhdGguc3RhcnRpbmdFbnRpdHlTZXQ7XG5cdGxldCBuYXZpZ2F0ZWRQYXRoczogc3RyaW5nW10gPSBbXTtcblx0ZGF0YU1vZGVsT2JqZWN0UGF0aC5uYXZpZ2F0aW9uUHJvcGVydGllcy5mb3JFYWNoKG5hdlByb3AgPT4ge1xuXHRcdG5hdmlnYXRlZFBhdGhzLnB1c2gobmF2UHJvcC5uYW1lKTtcblx0XHRpZiAoY3VycmVudEVudGl0eVNldCAmJiBjdXJyZW50RW50aXR5U2V0Lm5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmcuaGFzT3duUHJvcGVydHkobmF2aWdhdGVkUGF0aHMuam9pbihcIi9cIikpKSB7XG5cdFx0XHR0YXJnZXRFbnRpdHlTZXRQYXRoICs9IGAvJE5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmcvJHtuYXZpZ2F0ZWRQYXRocy5qb2luKFwiL1wiKX0vJGA7XG5cdFx0XHRjdXJyZW50RW50aXR5U2V0ID0gY3VycmVudEVudGl0eVNldC5uYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nW25hdmlnYXRlZFBhdGhzLmpvaW4oXCIvXCIpXTtcblx0XHRcdG5hdmlnYXRlZFBhdGhzID0gW107XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIHRhcmdldEVudGl0eVNldFBhdGg7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0VGFyZ2V0T2JqZWN0UGF0aCA9IGZ1bmN0aW9uKGRhdGFNb2RlbE9iamVjdFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgsIGJSZWxhdGl2ZTogYm9vbGVhbiA9IGZhbHNlKTogc3RyaW5nIHtcblx0bGV0IHBhdGggPSBcIlwiO1xuXHRpZiAoIWJSZWxhdGl2ZSkge1xuXHRcdHBhdGggKz0gYC8ke2RhdGFNb2RlbE9iamVjdFBhdGguc3RhcnRpbmdFbnRpdHlTZXQubmFtZX1gO1xuXHR9XG5cdGlmIChkYXRhTW9kZWxPYmplY3RQYXRoLm5hdmlnYXRpb25Qcm9wZXJ0aWVzLmxlbmd0aCA+IDApIHtcblx0XHRpZiAocGF0aC5sZW5ndGggPiAwKSB7XG5cdFx0XHRwYXRoICs9IFwiL1wiO1xuXHRcdH1cblx0XHRwYXRoICs9IGRhdGFNb2RlbE9iamVjdFBhdGgubmF2aWdhdGlvblByb3BlcnRpZXMubWFwKG5hdlByb3AgPT4gbmF2UHJvcC5uYW1lKS5qb2luKFwiL1wiKTtcblx0fVxuXG5cdGlmIChcblx0XHRkYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdCAmJlxuXHRcdGRhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0Lm5hbWUgJiZcblx0XHRkYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdC5fdHlwZSAhPT0gXCJOYXZpZ2F0aW9uUHJvcGVydHlcIiAmJlxuXHRcdGRhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0Ll90eXBlICE9PSBcIkVudGl0eVR5cGVcIiAmJlxuXHRcdGRhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0ICE9PSBkYXRhTW9kZWxPYmplY3RQYXRoLnN0YXJ0aW5nRW50aXR5U2V0XG5cdCkge1xuXHRcdGlmICghcGF0aC5lbmRzV2l0aChcIi9cIikpIHtcblx0XHRcdHBhdGggKz0gXCIvXCI7XG5cdFx0fVxuXHRcdHBhdGggKz0gYCR7ZGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QubmFtZX1gO1xuXHR9IGVsc2UgaWYgKGRhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0ICYmIGRhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0Lmhhc093blByb3BlcnR5KFwidGVybVwiKSkge1xuXHRcdGlmIChwYXRoLmxlbmd0aCA+IDAgJiYgIXBhdGguZW5kc1dpdGgoXCIvXCIpKSB7XG5cdFx0XHRwYXRoICs9IFwiL1wiO1xuXHRcdH1cblx0XHRwYXRoICs9IGBAJHtkYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdC50ZXJtfWA7XG5cdH1cblx0cmV0dXJuIHBhdGg7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0Q29udGV4dFJlbGF0aXZlVGFyZ2V0T2JqZWN0UGF0aCA9IGZ1bmN0aW9uKGRhdGFNb2RlbE9iamVjdFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgpOiBzdHJpbmcge1xuXHRsZXQgcGF0aCA9IGdldFBhdGhSZWxhdGl2ZUxvY2F0aW9uKGRhdGFNb2RlbE9iamVjdFBhdGguY29udGV4dExvY2F0aW9uLCBkYXRhTW9kZWxPYmplY3RQYXRoLm5hdmlnYXRpb25Qcm9wZXJ0aWVzKS5qb2luKFwiL1wiKTtcblx0aWYgKFxuXHRcdGRhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0ICYmXG5cdFx0ZGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QubmFtZSAmJlxuXHRcdGRhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0Ll90eXBlICE9PSBcIk5hdmlnYXRpb25Qcm9wZXJ0eVwiICYmXG5cdFx0ZGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QgIT09IGRhdGFNb2RlbE9iamVjdFBhdGguc3RhcnRpbmdFbnRpdHlTZXRcblx0KSB7XG5cdFx0aWYgKHBhdGgubGVuZ3RoID4gMCAmJiAhcGF0aC5lbmRzV2l0aChcIi9cIikpIHtcblx0XHRcdHBhdGggKz0gXCIvXCI7XG5cdFx0fVxuXHRcdHBhdGggKz0gYCR7ZGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QubmFtZX1gO1xuXHR9IGVsc2UgaWYgKGRhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0ICYmIGRhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0Lmhhc093blByb3BlcnR5KFwidGVybVwiKSkge1xuXHRcdGlmIChwYXRoLmxlbmd0aCA+IDAgJiYgIXBhdGguZW5kc1dpdGgoXCIvXCIpKSB7XG5cdFx0XHRwYXRoICs9IFwiL1wiO1xuXHRcdH1cblx0XHRwYXRoICs9IGBAJHtkYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdC50ZXJtfWA7XG5cdH1cblx0cmV0dXJuIHBhdGg7XG59O1xuXG5leHBvcnQgY29uc3QgaXNQYXRoVXBkYXRhYmxlID0gZnVuY3Rpb24oXG5cdGRhdGFNb2RlbE9iamVjdFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGggfCB1bmRlZmluZWQsXG5cdHByb3BlcnR5UGF0aD86IFByb3BlcnR5T3JQYXRoPFByb3BlcnR5PlxuKTogRXhwcmVzc2lvbjxib29sZWFuPiB7XG5cdHJldHVybiBjaGVja09uUGF0aChcblx0XHRkYXRhTW9kZWxPYmplY3RQYXRoLFxuXHRcdChhbm5vdGF0aW9uT2JqZWN0OiBOYXZpZ2F0aW9uUHJvcGVydHlSZXN0cmljdGlvbiB8IEVudGl0eVNldEFubm90YXRpb25zX0NhcGFiaWxpdGllcykgPT4ge1xuXHRcdFx0cmV0dXJuIGFubm90YXRpb25PYmplY3Q/LlVwZGF0ZVJlc3RyaWN0aW9ucz8uVXBkYXRhYmxlO1xuXHRcdH0sXG5cdFx0cHJvcGVydHlQYXRoXG5cdCk7XG59O1xuZXhwb3J0IGNvbnN0IGlzUGF0aERlbGV0YWJsZSA9IGZ1bmN0aW9uKFxuXHRkYXRhTW9kZWxPYmplY3RQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoIHwgdW5kZWZpbmVkLFxuXHRwcm9wZXJ0eVBhdGg/OiBQcm9wZXJ0eU9yUGF0aDxQcm9wZXJ0eT4sXG5cdGJUYWJsZUNhc2U/OiBib29sZWFuXG4pOiBFeHByZXNzaW9uPGJvb2xlYW4+IHtcblx0cmV0dXJuIGNoZWNrT25QYXRoKFxuXHRcdGRhdGFNb2RlbE9iamVjdFBhdGgsXG5cdFx0KGFubm90YXRpb25PYmplY3Q6IE5hdmlnYXRpb25Qcm9wZXJ0eVJlc3RyaWN0aW9uIHwgRW50aXR5U2V0QW5ub3RhdGlvbnNfQ2FwYWJpbGl0aWVzKSA9PiB7XG5cdFx0XHRyZXR1cm4gYW5ub3RhdGlvbk9iamVjdD8uRGVsZXRlUmVzdHJpY3Rpb25zPy5EZWxldGFibGU7XG5cdFx0fSxcblx0XHRwcm9wZXJ0eVBhdGgsXG5cdFx0YlRhYmxlQ2FzZVxuXHQpO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzUGF0aEluc2VydGFibGUgPSBmdW5jdGlvbihcblx0ZGF0YU1vZGVsT2JqZWN0UGF0aDogRGF0YU1vZGVsT2JqZWN0UGF0aCB8IHVuZGVmaW5lZCxcblx0cHJvcGVydHlQYXRoPzogUHJvcGVydHlPclBhdGg8UHJvcGVydHk+XG4pOiBFeHByZXNzaW9uPGJvb2xlYW4+IHtcblx0cmV0dXJuIGNoZWNrT25QYXRoKFxuXHRcdGRhdGFNb2RlbE9iamVjdFBhdGgsXG5cdFx0KGFubm90YXRpb25PYmplY3Q6IE5hdmlnYXRpb25Qcm9wZXJ0eVJlc3RyaWN0aW9uIHwgRW50aXR5U2V0QW5ub3RhdGlvbnNfQ2FwYWJpbGl0aWVzKSA9PiB7XG5cdFx0XHRyZXR1cm4gYW5ub3RhdGlvbk9iamVjdD8uSW5zZXJ0UmVzdHJpY3Rpb25zPy5JbnNlcnRhYmxlO1xuXHRcdH0sXG5cdFx0cHJvcGVydHlQYXRoXG5cdCk7XG59O1xuXG5leHBvcnQgY29uc3QgY2hlY2tGaWx0ZXJFeHByZXNzaW9uUmVzdHJpY3Rpb25zID0gZnVuY3Rpb24oXG5cdGRhdGFNb2RlbE9iamVjdFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgsXG5cdGFsbG93ZWRFeHByZXNzaW9uOiAoc3RyaW5nIHwgdW5kZWZpbmVkKVtdXG4pOiBFeHByZXNzaW9uPGJvb2xlYW4+IHtcblx0cmV0dXJuIGNoZWNrT25QYXRoKGRhdGFNb2RlbE9iamVjdFBhdGgsIChhbm5vdGF0aW9uT2JqZWN0OiBOYXZpZ2F0aW9uUHJvcGVydHlSZXN0cmljdGlvbiB8IEVudGl0eVNldEFubm90YXRpb25zX0NhcGFiaWxpdGllcykgPT4ge1xuXHRcdGNvbnN0IGZpbHRlckV4cHJlc3Npb25SZXN0cmljdGlvbnM6IEZpbHRlckV4cHJlc3Npb25SZXN0cmljdGlvblR5cGVUeXBlc1tdID1cblx0XHRcdChhbm5vdGF0aW9uT2JqZWN0Py5GaWx0ZXJSZXN0cmljdGlvbnM/LkZpbHRlckV4cHJlc3Npb25SZXN0cmljdGlvbnMgYXMgRmlsdGVyRXhwcmVzc2lvblJlc3RyaWN0aW9uVHlwZVR5cGVzW10pIHx8IFtdO1xuXHRcdGNvbnN0IGN1cnJlbnRPYmplY3RSZXN0cmljdGlvbiA9IGZpbHRlckV4cHJlc3Npb25SZXN0cmljdGlvbnMuZmluZChyZXN0cmljdGlvbiA9PiB7XG5cdFx0XHRyZXR1cm4gKHJlc3RyaWN0aW9uLlByb3BlcnR5IGFzIFByb3BlcnR5UGF0aCkuJHRhcmdldCA9PT0gZGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3Q7XG5cdFx0fSk7XG5cdFx0aWYgKGN1cnJlbnRPYmplY3RSZXN0cmljdGlvbikge1xuXHRcdFx0cmV0dXJuIGFsbG93ZWRFeHByZXNzaW9uLmluZGV4T2YoY3VycmVudE9iamVjdFJlc3RyaWN0aW9uPy5BbGxvd2VkRXhwcmVzc2lvbnM/LnRvU3RyaW5nKCkpICE9PSAtMTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fSk7XG59O1xuXG5leHBvcnQgY29uc3QgY2hlY2tPblBhdGggPSBmdW5jdGlvbihcblx0ZGF0YU1vZGVsT2JqZWN0UGF0aDogRGF0YU1vZGVsT2JqZWN0UGF0aCB8IHVuZGVmaW5lZCxcblx0Y2hlY2tGdW5jdGlvbjogRnVuY3Rpb24sXG5cdHByb3BlcnR5UGF0aD86IFByb3BlcnR5T3JQYXRoPFByb3BlcnR5Pixcblx0YlRhYmxlQ2FzZT86IGJvb2xlYW5cbik6IEV4cHJlc3Npb248Ym9vbGVhbj4ge1xuXHRpZiAoIWRhdGFNb2RlbE9iamVjdFBhdGggfHwgIWRhdGFNb2RlbE9iamVjdFBhdGguc3RhcnRpbmdFbnRpdHlTZXQpIHtcblx0XHRyZXR1cm4gY29uc3RhbnQodHJ1ZSk7XG5cdH1cblx0ZGF0YU1vZGVsT2JqZWN0UGF0aCA9IGVuaGFuY2VEYXRhTW9kZWxQYXRoKGRhdGFNb2RlbE9iamVjdFBhdGgsIHByb3BlcnR5UGF0aCk7XG5cblx0bGV0IGN1cnJlbnRFbnRpdHlTZXQ6IEVudGl0eVNldCB8IG51bGwgPSBkYXRhTW9kZWxPYmplY3RQYXRoLnN0YXJ0aW5nRW50aXR5U2V0O1xuXHRsZXQgcGFyZW50RW50aXR5U2V0OiBFbnRpdHlTZXQgfCBudWxsID0gbnVsbDtcblx0bGV0IHZpc2l0ZWROYXZpZ2F0aW9uUHJvcHNOYW1lOiBzdHJpbmdbXSA9IFtdO1xuXHRjb25zdCBhbGxWaXNpdGVkTmF2aWdhdGlvblByb3BzOiBOYXZpZ2F0aW9uUHJvcGVydHlbXSA9IFtdO1xuXHRsZXQgdGFyZ2V0RW50aXR5U2V0OiBFbnRpdHlTZXQgfCBudWxsID0gY3VycmVudEVudGl0eVNldDtcblx0bGV0IHJlc2V0VmlzaXRlZE5hdlByb3BzID0gZmFsc2U7XG5cblx0ZGF0YU1vZGVsT2JqZWN0UGF0aC5uYXZpZ2F0aW9uUHJvcGVydGllcy5mb3JFYWNoKChuYXZpZ2F0aW9uUHJvcGVydHk6IE5hdmlnYXRpb25Qcm9wZXJ0eSkgPT4ge1xuXHRcdGlmIChyZXNldFZpc2l0ZWROYXZQcm9wcykge1xuXHRcdFx0dmlzaXRlZE5hdmlnYXRpb25Qcm9wc05hbWUgPSBbXTtcblx0XHR9XG5cdFx0dmlzaXRlZE5hdmlnYXRpb25Qcm9wc05hbWUucHVzaChuYXZpZ2F0aW9uUHJvcGVydHkubmFtZSk7XG5cdFx0YWxsVmlzaXRlZE5hdmlnYXRpb25Qcm9wcy5wdXNoKG5hdmlnYXRpb25Qcm9wZXJ0eSk7XG5cdFx0aWYgKCFuYXZpZ2F0aW9uUHJvcGVydHkuY29udGFpbnNUYXJnZXQpIHtcblx0XHRcdC8vIFdlIHNob3VsZCBoYXZlIGEgbmF2aWdhdGlvblByb3BlcnR5QmluZGluZyBhc3NvY2lhdGVkIHdpdGggdGhlIHBhdGggc28gZmFyIHdoaWNoIGNhbiBjb25zaXN0IG9mIChbQ29udGFpbm1lbnROYXZQcm9wXS8pKltOYXZQcm9wXVxuXHRcdFx0Y29uc3QgZnVsbE5hdmlnYXRpb25QYXRoID0gdmlzaXRlZE5hdmlnYXRpb25Qcm9wc05hbWUuam9pbihcIi9cIik7XG5cdFx0XHRpZiAoY3VycmVudEVudGl0eVNldCAmJiBjdXJyZW50RW50aXR5U2V0Lm5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmcuaGFzT3duUHJvcGVydHkoZnVsbE5hdmlnYXRpb25QYXRoKSkge1xuXHRcdFx0XHRwYXJlbnRFbnRpdHlTZXQgPSBjdXJyZW50RW50aXR5U2V0O1xuXHRcdFx0XHRjdXJyZW50RW50aXR5U2V0ID0gY3VycmVudEVudGl0eVNldC5uYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nW2Z1bGxOYXZpZ2F0aW9uUGF0aF07XG5cdFx0XHRcdHRhcmdldEVudGl0eVNldCA9IGN1cnJlbnRFbnRpdHlTZXQ7XG5cdFx0XHRcdC8vIElmIHdlIHJlYWNoZWQgYSBuYXZpZ2F0aW9uIHByb3BlcnR5IHdpdGggYSBuYXZpZ2F0aW9ucHJvcGVydHliaW5kaW5nLCB3ZSBuZWVkIHRvIHJlc2V0IHRoZSB2aXNpdGVkIHBhdGggb24gdGhlIG5leHQgaXRlcmF0aW9uIChpZiB0aGVyZSBpcyBvbmUpXG5cdFx0XHRcdHJlc2V0VmlzaXRlZE5hdlByb3BzID0gdHJ1ZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIFdlIHJlYWxseSBzaG91bGQgbm90IGVuZCB1cCBoZXJlIGJ1dCBhdCBsZWFzdCBsZXQncyB0cnkgdG8gYXZvaWQgaW5jb3JyZWN0IGJlaGF2aW9yXG5cdFx0XHRcdHBhcmVudEVudGl0eVNldCA9IGN1cnJlbnRFbnRpdHlTZXQ7XG5cdFx0XHRcdGN1cnJlbnRFbnRpdHlTZXQgPSBudWxsO1xuXHRcdFx0XHRyZXNldFZpc2l0ZWROYXZQcm9wcyA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHBhcmVudEVudGl0eVNldCA9IGN1cnJlbnRFbnRpdHlTZXQ7XG5cdFx0XHR0YXJnZXRFbnRpdHlTZXQgPSBudWxsO1xuXHRcdH1cblx0fSk7XG5cblx0Ly8gQXQgdGhpcyBwb2ludCB3ZSBoYXZlIG5hdmlnYXRlZCBkb3duIGFsbCB0aGUgbmF2IHByb3AgYW5kIHdlIHNob3VsZCBoYXZlXG5cdC8vIFRoZSB0YXJnZXQgZW50aXR5c2V0IHBvaW50aW5nIHRvIGVpdGhlciBudWxsIChpbiBjYXNlIG9mIGNvbnRhaW5tZW50IG5hdnByb3AgYSBsYXN0IHBhcnQpLCBvciB0aGUgYWN0dWFsIHRhcmdldCAobm9uIGNvbnRhaW5tZW50IGFzIHRhcmdldClcblx0Ly8gVGhlIHBhcmVudCBlbnRpdHlTZXQgcG9pbnRpbmcgdG8gdGhlIHByZXZpb3VzIGVudGl0eXNldCB1c2VkIGluIHRoZSBwYXRoXG5cdC8vIFZpc2l0ZWROYXZpZ2F0aW9uUGF0aCBzaG91bGQgY29udGFpbiB0aGUgcGF0aCB1cCB0byB0aGlzIHByb3BlcnR5XG5cblx0Ly8gUmVzdHJpY3Rpb25zIHNob3VsZCB0aGVuIGJlIGV2YWx1YXRlZCBhcyBQYXJlbnRFbnRpdHlTZXQuTmF2UmVzdHJpY3Rpb25zW05hdnByb3BlcnR5UGF0aF0gfHwgVGFyZ2V0RW50aXR5U2V0LlJlc3RyaWN0aW9uc1xuXHRjb25zdCBmdWxsTmF2aWdhdGlvblBhdGggPSB2aXNpdGVkTmF2aWdhdGlvblByb3BzTmFtZS5qb2luKFwiL1wiKTtcblx0bGV0IHJlc3RyaWN0aW9ucztcblx0aWYgKHBhcmVudEVudGl0eVNldCAhPT0gbnVsbCkge1xuXHRcdGNvbnN0IF9wYXJlbnRFbnRpdHlTZXQ6IEVudGl0eVNldCA9IHBhcmVudEVudGl0eVNldDtcblx0XHRfcGFyZW50RW50aXR5U2V0LmFubm90YXRpb25zPy5DYXBhYmlsaXRpZXM/Lk5hdmlnYXRpb25SZXN0cmljdGlvbnM/LlJlc3RyaWN0ZWRQcm9wZXJ0aWVzLmZvckVhY2goXG5cdFx0XHQocmVzdHJpY3RlZE5hdlByb3A6IE5hdmlnYXRpb25Qcm9wZXJ0eVJlc3RyaWN0aW9uVHlwZXMpID0+IHtcblx0XHRcdFx0aWYgKHJlc3RyaWN0ZWROYXZQcm9wLk5hdmlnYXRpb25Qcm9wZXJ0eT8udHlwZSA9PT0gXCJOYXZpZ2F0aW9uUHJvcGVydHlQYXRoXCIpIHtcblx0XHRcdFx0XHRjb25zdCByZXN0cmljdGlvbkRlZmluaXRpb24gPSBjaGVja0Z1bmN0aW9uKHJlc3RyaWN0ZWROYXZQcm9wKTtcblx0XHRcdFx0XHRpZiAoZnVsbE5hdmlnYXRpb25QYXRoID09PSByZXN0cmljdGVkTmF2UHJvcC5OYXZpZ2F0aW9uUHJvcGVydHkudmFsdWUgJiYgcmVzdHJpY3Rpb25EZWZpbml0aW9uICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdHJlc3RyaWN0aW9ucyA9IGVxdWFsKFxuXHRcdFx0XHRcdFx0XHRhbm5vdGF0aW9uRXhwcmVzc2lvbihcblx0XHRcdFx0XHRcdFx0XHRyZXN0cmljdGlvbkRlZmluaXRpb24sXG5cdFx0XHRcdFx0XHRcdFx0Z2V0UGF0aFJlbGF0aXZlTG9jYXRpb24oZGF0YU1vZGVsT2JqZWN0UGF0aD8uY29udGV4dExvY2F0aW9uLCBhbGxWaXNpdGVkTmF2aWdhdGlvblByb3BzLnNsaWNlKDAsIC0xKSlcblx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0dHJ1ZVxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQpO1xuXHR9XG5cdGxldCB0YXJnZXRSZXN0cmljdGlvbnM7XG5cdGNvbnN0IHJlc3RyaWN0aW9uRGVmaW5pdGlvbiA9IGNoZWNrRnVuY3Rpb24odGFyZ2V0RW50aXR5U2V0Py5hbm5vdGF0aW9ucz8uQ2FwYWJpbGl0aWVzKTtcblx0aWYgKHJlc3RyaWN0aW9uRGVmaW5pdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0dGFyZ2V0UmVzdHJpY3Rpb25zID0gZXF1YWwoXG5cdFx0XHRhbm5vdGF0aW9uRXhwcmVzc2lvbihcblx0XHRcdFx0cmVzdHJpY3Rpb25EZWZpbml0aW9uLFxuXHRcdFx0XHRnZXRQYXRoUmVsYXRpdmVMb2NhdGlvbihkYXRhTW9kZWxPYmplY3RQYXRoLmNvbnRleHRMb2NhdGlvbiwgYWxsVmlzaXRlZE5hdmlnYXRpb25Qcm9wcylcblx0XHRcdCksXG5cdFx0XHR0cnVlXG5cdFx0KTtcblx0fVxuXHQvL29iamVjdCBwYWdlIHRhYmxlIGNhc2UgaW4gcGF0aCBiYXNlZCBzY2VuYXJpbydzIGZhbGxiYWNrIHRvIGV4aXNpdGluZyBhcHByb2FjaFxuXHRpZiAoYlRhYmxlQ2FzZSAmJiAhcmVzdHJpY3Rpb25zICYmIHJlc3RyaWN0aW9uRGVmaW5pdGlvbj8ucGF0aCkge1xuXHRcdGNvbnN0IG9SZXN1bHQ6IGFueSA9IHtcblx0XHRcdFwiY3VycmVudEVudGl0eVJlc3RyaWN0aW9uXCI6IHRhcmdldFJlc3RyaWN0aW9uc1xuXHRcdH07XG5cdFx0cmV0dXJuIG9SZXN1bHQ7XG5cdH1cblx0cmV0dXJuIHJlc3RyaWN0aW9ucyB8fCB0YXJnZXRSZXN0cmljdGlvbnMgfHwgY29uc3RhbnQodHJ1ZSk7XG59O1xuIl19