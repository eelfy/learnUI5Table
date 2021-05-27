sap.ui.define(["../../helpers/ConfigurableObject", "../../helpers/ID", "../../helpers/Key", "sap/fe/core/converters/annotations/DataField", "sap/fe/core/templating/DataModelPathHelper"], function (ConfigurableObject, ID, Key, DataField, DataModelPathHelper) {
  "use strict";

  var _exports = {};
  var getTargetObjectPath = DataModelPathHelper.getTargetObjectPath;
  var getTargetEntitySetPath = DataModelPathHelper.getTargetEntitySetPath;
  var getSemanticObjectPath = DataField.getSemanticObjectPath;
  var KeyHelper = Key.KeyHelper;
  var FormID = ID.FormID;
  var Placement = ConfigurableObject.Placement;
  var insertCustomElements = ConfigurableObject.insertCustomElements;

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var FormElementType;

  (function (FormElementType) {
    FormElementType["Default"] = "Default";
    FormElementType["Annotation"] = "Annotation";
  })(FormElementType || (FormElementType = {}));

  _exports.FormElementType = FormElementType;

  function getFormElementsFromAnnotations(facetDefinition, converterContext) {
    var formElements = [];
    var resolvedTarget = converterContext.getEntityTypeAnnotation(facetDefinition.Target.value);
    var formAnnotation = resolvedTarget.annotation;
    converterContext = resolvedTarget.converterContext;

    switch (formAnnotation === null || formAnnotation === void 0 ? void 0 : formAnnotation.term) {
      case "com.sap.vocabularies.UI.v1.FieldGroup":
        formAnnotation.Data.forEach(function (field) {
          var _field$annotations, _field$annotations$UI, _field$annotations$UI2;

          var semanticObjectAnnotationPath = getSemanticObjectPath(converterContext, field);

          if (field.$Type !== "com.sap.vocabularies.UI.v1.DataFieldForAction" && field.$Type !== "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" && ((_field$annotations = field.annotations) === null || _field$annotations === void 0 ? void 0 : (_field$annotations$UI = _field$annotations.UI) === null || _field$annotations$UI === void 0 ? void 0 : (_field$annotations$UI2 = _field$annotations$UI.Hidden) === null || _field$annotations$UI2 === void 0 ? void 0 : _field$annotations$UI2.valueOf()) !== true) {
            formElements.push({
              key: KeyHelper.generateKeyFromDataField(field),
              type: FormElementType.Annotation,
              annotationPath: converterContext.getEntitySetBasedAnnotationPath(field.fullyQualifiedName) + "/",
              semanticObjectPath: semanticObjectAnnotationPath,
              formatOptions: {
                textLinesDisplay: 0,
                textLinesEdit: 4
              }
            });
          }
        });
        break;

      case "com.sap.vocabularies.UI.v1.Identification":
        formAnnotation.forEach(function (field) {
          var _field$annotations2, _field$annotations2$U, _field$annotations2$U2;

          var semanticObjectAnnotationPath = getSemanticObjectPath(converterContext, field);

          if (field.$Type !== "com.sap.vocabularies.UI.v1.DataFieldForAction" && field.$Type !== "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" && ((_field$annotations2 = field.annotations) === null || _field$annotations2 === void 0 ? void 0 : (_field$annotations2$U = _field$annotations2.UI) === null || _field$annotations2$U === void 0 ? void 0 : (_field$annotations2$U2 = _field$annotations2$U.Hidden) === null || _field$annotations2$U2 === void 0 ? void 0 : _field$annotations2$U2.valueOf()) !== true) {
            formElements.push({
              key: KeyHelper.generateKeyFromDataField(field),
              type: FormElementType.Annotation,
              annotationPath: converterContext.getEntitySetBasedAnnotationPath(field.fullyQualifiedName) + "/",
              semanticObjectPath: semanticObjectAnnotationPath,
              formatOptions: {
                textLinesDisplay: 0,
                textLinesEdit: 4
              }
            });
          }
        });
        break;

      case "com.sap.vocabularies.UI.v1.DataPoint":
        formElements.push({
          // key: KeyHelper.generateKeyFromDataField(formAnnotation),
          key: "DataPoint::" + (formAnnotation.qualifier ? formAnnotation.qualifier : ""),
          type: FormElementType.Annotation,
          annotationPath: converterContext.getEntitySetBasedAnnotationPath(formAnnotation.fullyQualifiedName) + "/"
        });
        break;

      case "com.sap.vocabularies.Communication.v1.Contact":
        formElements.push({
          // key: KeyHelper.generateKeyFromDataField(formAnnotation),
          key: "Contact::" + (formAnnotation.qualifier ? formAnnotation.qualifier : ""),
          type: FormElementType.Annotation,
          annotationPath: converterContext.getEntitySetBasedAnnotationPath(formAnnotation.fullyQualifiedName) + "/"
        });
        break;

      default:
        break;
    }

    return formElements;
  }

  function getFormElementsFromManifest(facetDefinition, converterContext) {
    var manifestWrapper = converterContext.getManifestWrapper();
    var manifestFormContainer = manifestWrapper.getFormContainer(facetDefinition.Target.value);
    var formElements = {};

    if (manifestFormContainer === null || manifestFormContainer === void 0 ? void 0 : manifestFormContainer.fields) {
      Object.keys(manifestFormContainer === null || manifestFormContainer === void 0 ? void 0 : manifestFormContainer.fields).forEach(function (fieldId) {
        formElements[fieldId] = {
          key: fieldId,
          type: FormElementType.Default,
          template: manifestFormContainer.fields[fieldId].template,
          label: manifestFormContainer.fields[fieldId].label,
          position: manifestFormContainer.fields[fieldId].position || {
            placement: Placement.After
          },
          formatOptions: _objectSpread({
            textLinesDisplay: 0,
            textLinesEdit: 4
          }, manifestFormContainer.fields[fieldId].formatOptions)
        };
      });
    }

    return formElements;
  }

  _exports.getFormElementsFromManifest = getFormElementsFromManifest;

  function getFormContainer(facetDefinition, converterContext) {
    var _resolvedTarget$conve, _facetDefinition$ID;

    //TODO form container id
    var resolvedTarget = converterContext.getEntityTypeAnnotation(facetDefinition.Target.value);
    var sEntitySetPath;

    if (resolvedTarget.converterContext.getEntitySet() !== converterContext.getEntitySet()) {
      sEntitySetPath = getTargetEntitySetPath(resolvedTarget.converterContext.getDataModelObjectPath());
    } else if (((_resolvedTarget$conve = resolvedTarget.converterContext.getDataModelObjectPath().targetObject) === null || _resolvedTarget$conve === void 0 ? void 0 : _resolvedTarget$conve.containsTarget) === true) {
      sEntitySetPath = getTargetObjectPath(resolvedTarget.converterContext.getDataModelObjectPath(), false);
    }

    return {
      id: facetDefinition === null || facetDefinition === void 0 ? void 0 : (_facetDefinition$ID = facetDefinition.ID) === null || _facetDefinition$ID === void 0 ? void 0 : _facetDefinition$ID.toString(),
      formElements: insertCustomElements(getFormElementsFromAnnotations(facetDefinition, converterContext), getFormElementsFromManifest(facetDefinition, converterContext), {
        formatOptions: "overwrite"
      }),
      annotationPath: "/" + facetDefinition.fullyQualifiedName,
      entitySet: sEntitySetPath
    };
  }

  _exports.getFormContainer = getFormContainer;

  function getFormContainersForCollection(facetDefinition, converterContext) {
    var _facetDefinition$Face;

    var formContainers = []; //TODO coll facet inside coll facet?

    (_facetDefinition$Face = facetDefinition.Facets) === null || _facetDefinition$Face === void 0 ? void 0 : _facetDefinition$Face.forEach(function (facet) {
      // Ignore level 3 collection facet
      if (facet.$Type === "com.sap.vocabularies.UI.v1.CollectionFacet") {
        return;
      }

      formContainers.push(getFormContainer(facet, converterContext));
    });
    return formContainers;
  }

  function isReferenceFacet(facetDefinition) {
    return facetDefinition.$Type === "com.sap.vocabularies.UI.v1.ReferenceFacet";
  }

  _exports.isReferenceFacet = isReferenceFacet;

  function createFormDefinition(facetDefinition, converterContext) {
    var _facetDefinition$anno, _facetDefinition$anno2, _facetDefinition$anno3;

    switch (facetDefinition.$Type) {
      case "com.sap.vocabularies.UI.v1.CollectionFacet":
        // Keep only valid children
        var formCollectionDefinition = {
          id: FormID({
            Facet: facetDefinition
          }),
          useFormContainerLabels: true,
          hasFacetsNotPartOfPreview: facetDefinition.Facets.some(function (childFacet) {
            var _childFacet$annotatio, _childFacet$annotatio2, _childFacet$annotatio3;

            return ((_childFacet$annotatio = childFacet.annotations) === null || _childFacet$annotatio === void 0 ? void 0 : (_childFacet$annotatio2 = _childFacet$annotatio.UI) === null || _childFacet$annotatio2 === void 0 ? void 0 : (_childFacet$annotatio3 = _childFacet$annotatio2.PartOfPreview) === null || _childFacet$annotatio3 === void 0 ? void 0 : _childFacet$annotatio3.valueOf()) === false;
          }),
          formContainers: getFormContainersForCollection(facetDefinition, converterContext)
        };
        return formCollectionDefinition;

      case "com.sap.vocabularies.UI.v1.ReferenceFacet":
        var formDefinition = {
          id: FormID({
            Facet: facetDefinition
          }),
          useFormContainerLabels: false,
          hasFacetsNotPartOfPreview: ((_facetDefinition$anno = facetDefinition.annotations) === null || _facetDefinition$anno === void 0 ? void 0 : (_facetDefinition$anno2 = _facetDefinition$anno.UI) === null || _facetDefinition$anno2 === void 0 ? void 0 : (_facetDefinition$anno3 = _facetDefinition$anno2.PartOfPreview) === null || _facetDefinition$anno3 === void 0 ? void 0 : _facetDefinition$anno3.valueOf()) === false,
          formContainers: [getFormContainer(facetDefinition, converterContext)]
        };
        return formDefinition;

      default:
        throw new Error("Cannot create form based on ReferenceURLFacet");
    }
  }

  _exports.createFormDefinition = createFormDefinition;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZvcm0udHMiXSwibmFtZXMiOlsiRm9ybUVsZW1lbnRUeXBlIiwiZ2V0Rm9ybUVsZW1lbnRzRnJvbUFubm90YXRpb25zIiwiZmFjZXREZWZpbml0aW9uIiwiY29udmVydGVyQ29udGV4dCIsImZvcm1FbGVtZW50cyIsInJlc29sdmVkVGFyZ2V0IiwiZ2V0RW50aXR5VHlwZUFubm90YXRpb24iLCJUYXJnZXQiLCJ2YWx1ZSIsImZvcm1Bbm5vdGF0aW9uIiwiYW5ub3RhdGlvbiIsInRlcm0iLCJEYXRhIiwiZm9yRWFjaCIsImZpZWxkIiwic2VtYW50aWNPYmplY3RBbm5vdGF0aW9uUGF0aCIsImdldFNlbWFudGljT2JqZWN0UGF0aCIsIiRUeXBlIiwiYW5ub3RhdGlvbnMiLCJVSSIsIkhpZGRlbiIsInZhbHVlT2YiLCJwdXNoIiwia2V5IiwiS2V5SGVscGVyIiwiZ2VuZXJhdGVLZXlGcm9tRGF0YUZpZWxkIiwidHlwZSIsIkFubm90YXRpb24iLCJhbm5vdGF0aW9uUGF0aCIsImdldEVudGl0eVNldEJhc2VkQW5ub3RhdGlvblBhdGgiLCJmdWxseVF1YWxpZmllZE5hbWUiLCJzZW1hbnRpY09iamVjdFBhdGgiLCJmb3JtYXRPcHRpb25zIiwidGV4dExpbmVzRGlzcGxheSIsInRleHRMaW5lc0VkaXQiLCJxdWFsaWZpZXIiLCJnZXRGb3JtRWxlbWVudHNGcm9tTWFuaWZlc3QiLCJtYW5pZmVzdFdyYXBwZXIiLCJnZXRNYW5pZmVzdFdyYXBwZXIiLCJtYW5pZmVzdEZvcm1Db250YWluZXIiLCJnZXRGb3JtQ29udGFpbmVyIiwiZmllbGRzIiwiT2JqZWN0Iiwia2V5cyIsImZpZWxkSWQiLCJEZWZhdWx0IiwidGVtcGxhdGUiLCJsYWJlbCIsInBvc2l0aW9uIiwicGxhY2VtZW50IiwiUGxhY2VtZW50IiwiQWZ0ZXIiLCJzRW50aXR5U2V0UGF0aCIsImdldEVudGl0eVNldCIsImdldFRhcmdldEVudGl0eVNldFBhdGgiLCJnZXREYXRhTW9kZWxPYmplY3RQYXRoIiwidGFyZ2V0T2JqZWN0IiwiY29udGFpbnNUYXJnZXQiLCJnZXRUYXJnZXRPYmplY3RQYXRoIiwiaWQiLCJJRCIsInRvU3RyaW5nIiwiaW5zZXJ0Q3VzdG9tRWxlbWVudHMiLCJlbnRpdHlTZXQiLCJnZXRGb3JtQ29udGFpbmVyc0ZvckNvbGxlY3Rpb24iLCJmb3JtQ29udGFpbmVycyIsIkZhY2V0cyIsImZhY2V0IiwiaXNSZWZlcmVuY2VGYWNldCIsImNyZWF0ZUZvcm1EZWZpbml0aW9uIiwiZm9ybUNvbGxlY3Rpb25EZWZpbml0aW9uIiwiRm9ybUlEIiwiRmFjZXQiLCJ1c2VGb3JtQ29udGFpbmVyTGFiZWxzIiwiaGFzRmFjZXRzTm90UGFydE9mUHJldmlldyIsInNvbWUiLCJjaGlsZEZhY2V0IiwiUGFydE9mUHJldmlldyIsImZvcm1EZWZpbml0aW9uIiwiRXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQTBCWUEsZTs7YUFBQUEsZTtBQUFBQSxJQUFBQSxlO0FBQUFBLElBQUFBLGU7S0FBQUEsZSxLQUFBQSxlOzs7O0FBbUNaLFdBQVNDLDhCQUFULENBQXdDQyxlQUF4QyxFQUE4RUMsZ0JBQTlFLEVBQTJJO0FBQzFJLFFBQU1DLFlBQXFDLEdBQUcsRUFBOUM7QUFDQSxRQUFNQyxjQUFjLEdBQUdGLGdCQUFnQixDQUFDRyx1QkFBakIsQ0FBeUNKLGVBQWUsQ0FBQ0ssTUFBaEIsQ0FBdUJDLEtBQWhFLENBQXZCO0FBQ0EsUUFBTUMsY0FBMkUsR0FBR0osY0FBYyxDQUFDSyxVQUFuRztBQUdBUCxJQUFBQSxnQkFBZ0IsR0FBR0UsY0FBYyxDQUFDRixnQkFBbEM7O0FBQ0EsWUFBUU0sY0FBUixhQUFRQSxjQUFSLHVCQUFRQSxjQUFjLENBQUVFLElBQXhCO0FBQ0M7QUFDRUYsUUFBQUEsY0FBRCxDQUErQ0csSUFBL0MsQ0FBb0RDLE9BQXBELENBQTRELFVBQUFDLEtBQUssRUFBSTtBQUFBOztBQUNwRSxjQUFNQyw0QkFBNEIsR0FBR0MscUJBQXFCLENBQUNiLGdCQUFELEVBQW1CVyxL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QztBQVFBLGVBQU9tRSx3QkFBUDs7QUFDRDtBQUNDLFlBQU1RLGNBQWMsR0FBRztBQUN0Qm5CLFVBQUFBLEVBQUUsRUFBRVksTUFBTSxDQUFDO0FBQUVDLFlBQUFBLEtBQUssRUFBRXRFO0FBQVQsV0FBRCxDQURZO0FBRXRCdUUsVUFBQUEsc0JBQXNCLEVBQUUsS0FGRjtBQUd0QkMsVUFBQUEseUJBQXlCLEVBQUUsMEJBQUF4RSxlQUFlLENBQUNnQixXQUFoQiwwR0FBNkJDLEVBQTdCLDRHQUFpQzBELGFBQWpDLGtGQUFnRHhELE9BQWhELFFBQThELEtBSG5FO0FBSXRCNEMsVUFBQUEsY0FBYyxFQUFFLENBQUN6QixnQkFBZ0IsQ0FBQ3RDLGVBQUQsRUFBa0JDLGdCQUFsQixDQUFqQjtBQUpNLFNBQXZCO0FBTUEsZUFBTzJFLGNBQVA7O0FBQ0Q7QUFDQyxjQUFNLElBQUlDLEtBQUosQ0FBVSwrQ0FBVixDQUFOO0FBckJGO0FBdUJBIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuXHRBbm5vdGF0aW9uVGVybSxcblx0Q29sbGVjdGlvbkZhY2V0VHlwZXMsXG5cdENvbW11bmljYXRpb25Bbm5vdGF0aW9uVGVybXMsXG5cdEZhY2V0VHlwZXMsXG5cdEZpZWxkR3JvdXAsXG5cdElkZW50aWZpY2F0aW9uLFxuXHRSZWZlcmVuY2VGYWNldFR5cGVzLFxuXHRVSUFubm90YXRpb25UZXJtcyxcblx0VUlBbm5vdGF0aW9uVHlwZXNcbn0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzXCI7XG5pbXBvcnQgeyBCaW5kaW5nRXhwcmVzc2lvbiB9IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0JpbmRpbmdFeHByZXNzaW9uXCI7XG5pbXBvcnQgeyBDb25maWd1cmFibGVPYmplY3QsIEN1c3RvbUVsZW1lbnQsIGluc2VydEN1c3RvbUVsZW1lbnRzLCBQbGFjZW1lbnQgfSBmcm9tIFwiLi4vLi4vaGVscGVycy9Db25maWd1cmFibGVPYmplY3RcIjtcbmltcG9ydCB7IEZvcm1JRCB9IGZyb20gXCIuLi8uLi9oZWxwZXJzL0lEXCI7XG5pbXBvcnQgeyBLZXlIZWxwZXIgfSBmcm9tIFwiLi4vLi4vaGVscGVycy9LZXlcIjtcbmltcG9ydCB7IEZvcm1NYW5pZmVzdENvbmZpZ3VyYXRpb24sIEZvcm1hdE9wdGlvbnNUeXBlIH0gZnJvbSBcIi4uLy4uL01hbmlmZXN0U2V0dGluZ3NcIjtcbmltcG9ydCB7IENvbnZlcnRlckNvbnRleHQgfSBmcm9tIFwiLi4vLi4vdGVtcGxhdGVzL0Jhc2VDb252ZXJ0ZXJcIjtcbmltcG9ydCB7IGdldFNlbWFudGljT2JqZWN0UGF0aCB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2Fubm90YXRpb25zL0RhdGFGaWVsZFwiO1xuaW1wb3J0IHsgZ2V0VGFyZ2V0RW50aXR5U2V0UGF0aCwgZ2V0VGFyZ2V0T2JqZWN0UGF0aCB9IGZyb20gXCJzYXAvZmUvY29yZS90ZW1wbGF0aW5nL0RhdGFNb2RlbFBhdGhIZWxwZXJcIjtcblxuZXhwb3J0IHR5cGUgRm9ybURlZmluaXRpb24gPSB7XG5cdGlkOiBzdHJpbmc7XG5cdHVzZUZvcm1Db250YWluZXJMYWJlbHM6IGJvb2xlYW47XG5cdGhhc0ZhY2V0c05vdFBhcnRPZlByZXZpZXc6IGJvb2xlYW47XG59O1xuXG5leHBvcnQgZW51bSBGb3JtRWxlbWVudFR5cGUge1xuXHREZWZhdWx0ID0gXCJEZWZhdWx0XCIsXG5cdEFubm90YXRpb24gPSBcIkFubm90YXRpb25cIlxufVxuXG5leHBvcnQgdHlwZSBCYXNlRm9ybUVsZW1lbnQgPSBDb25maWd1cmFibGVPYmplY3QgJiB7XG5cdHR5cGU6IEZvcm1FbGVtZW50VHlwZTtcblx0bGFiZWw/OiBzdHJpbmc7XG5cdHZpc2libGU/OiBCaW5kaW5nRXhwcmVzc2lvbjxib29sZWFuPjtcblx0Zm9ybWF0T3B0aW9ucz86IEZvcm1hdE9wdGlvbnNUeXBlO1xufTtcblxuZXhwb3J0IHR5cGUgQW5ub3RhdGlvbkZvcm1FbGVtZW50ID0gQmFzZUZvcm1FbGVtZW50ICYge1xuXHRpZFByZWZpeD86IHN0cmluZztcblx0YW5ub3RhdGlvblBhdGg/OiBzdHJpbmc7XG5cdGlzVmFsdWVNdWx0aWxpbmVUZXh0PzogYm9vbGVhbjtcblx0c2VtYW50aWNPYmplY3RQYXRoPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgQ3VzdG9tRm9ybUVsZW1lbnQgPSBDdXN0b21FbGVtZW50PFxuXHRCYXNlRm9ybUVsZW1lbnQgJiB7XG5cdFx0dHlwZTogRm9ybUVsZW1lbnRUeXBlLkRlZmF1bHQ7XG5cdFx0dGVtcGxhdGU6IHN0cmluZztcblx0fVxuPjtcblxuZXhwb3J0IHR5cGUgRm9ybUVsZW1lbnQgPSBDdXN0b21Gb3JtRWxlbWVudCB8IEFubm90YXRpb25Gb3JtRWxlbWVudDtcblxudHlwZSBGb3JtQ29udGFpbmVyID0ge1xuXHRpZD86IHN0cmluZztcblx0Zm9ybUVsZW1lbnRzOiBGb3JtRWxlbWVudFtdO1xuXHRhbm5vdGF0aW9uUGF0aDogc3RyaW5nO1xuXHRlbnRpdHlTZXQ/OiBzdHJpbmc7XG59O1xuXG5mdW5jdGlvbiBnZXRGb3JtRWxlbWVudHNGcm9tQW5ub3RhdGlvbnMoZmFjZXREZWZpbml0aW9uOiBSZWZlcmVuY2VGYWNldFR5cGVzLCBjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogQW5ub3RhdGlvbkZvcm1FbGVtZW50W10ge1xuXHRjb25zdCBmb3JtRWxlbWVudHM6IEFubm90YXRpb25Gb3JtRWxlbWVudFtdID0gW107XG5cdGNvbnN0IHJlc29sdmVkVGFyZ2V0ID0gY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlQW5ub3RhdGlvbihmYWNldERlZmluaXRpb24uVGFyZ2V0LnZhbHVlKTtcblx0Y29uc3QgZm9ybUFubm90YXRpb246IEFubm90YXRpb25UZXJtPElkZW50aWZpY2F0aW9uPiB8IEFubm90YXRpb25UZXJtPEZpZWxkR3JvdXA+ID0gcmVzb2x2ZWRUYXJnZXQuYW5ub3RhdGlvbiBhc1xuXHRcdHwgQW5ub3RhdGlvblRlcm08SWRlbnRpZmljYXRpb24+XG5cdFx0fCBBbm5vdGF0aW9uVGVybTxGaWVsZEdyb3VwPjtcblx0Y29udmVydGVyQ29udGV4dCA9IHJlc29sdmVkVGFyZ2V0LmNvbnZlcnRlckNvbnRleHQ7XG5cdHN3aXRjaCAoZm9ybUFubm90YXRpb24/LnRlcm0pIHtcblx0XHRjYXNlIFVJQW5ub3RhdGlvblRlcm1zLkZpZWxkR3JvdXA6XG5cdFx0XHQoZm9ybUFubm90YXRpb24gYXMgQW5ub3RhdGlvblRlcm08RmllbGRHcm91cD4pLkRhdGEuZm9yRWFjaChmaWVsZCA9PiB7XG5cdFx0XHRcdGNvbnN0IHNlbWFudGljT2JqZWN0QW5ub3RhdGlvblBhdGggPSBnZXRTZW1hbnRpY09iamVjdFBhdGgoY29udmVydGVyQ29udGV4dCwgZmllbGQpO1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0ZmllbGQuJFR5cGUgIT09IFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZEZvckFjdGlvbiAmJlxuXHRcdFx0XHRcdGZpZWxkLiRUeXBlICE9PSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb24gJiZcblx0XHRcdFx0XHRmaWVsZC5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbj8udmFsdWVPZigpICE9PSB0cnVlXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdGZvcm1FbGVtZW50cy5wdXNoKHtcblx0XHRcdFx0XHRcdGtleTogS2V5SGVscGVyLmdlbmVyYXRlS2V5RnJvbURhdGFGaWVsZChmaWVsZCksXG5cdFx0XHRcdFx0XHR0eXBlOiBGb3JtRWxlbWVudFR5cGUuQW5ub3RhdGlvbixcblx0XHRcdFx0XHRcdGFubm90YXRpb25QYXRoOiBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVNldEJhc2VkQW5ub3RhdGlvblBhdGgoZmllbGQuZnVsbHlRdWFsaWZpZWROYW1lKSArIFwiL1wiLFxuXHRcdFx0XHRcdFx0c2VtYW50aWNPYmplY3RQYXRoOiBzZW1hbnRpY09iamVjdEFubm90YXRpb25QYXRoLFxuXHRcdFx0XHRcdFx0Zm9ybWF0T3B0aW9uczoge1xuXHRcdFx0XHRcdFx0XHR0ZXh0TGluZXNEaXNwbGF5OiAwLFxuXHRcdFx0XHRcdFx0XHR0ZXh0TGluZXNFZGl0OiA0XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UZXJtcy5JZGVudGlmaWNhdGlvbjpcblx0XHRcdChmb3JtQW5ub3RhdGlvbiBhcyBBbm5vdGF0aW9uVGVybTxJZGVudGlmaWNhdGlvbj4pLmZvckVhY2goZmllbGQgPT4ge1xuXHRcdFx0XHRjb25zdCBzZW1hbnRpY09iamVjdEFubm90YXRpb25QYXRoID0gZ2V0U2VtYW50aWNPYmplY3RQYXRoKGNvbnZlcnRlckNvbnRleHQsIGZpZWxkKTtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdGZpZWxkLiRUeXBlICE9PSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JBY3Rpb24gJiZcblx0XHRcdFx0XHRmaWVsZC4kVHlwZSAhPT0gVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uICYmXG5cdFx0XHRcdFx0ZmllbGQuYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4/LnZhbHVlT2YoKSAhPT0gdHJ1ZVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRmb3JtRWxlbWVudHMucHVzaCh7XG5cdFx0XHRcdFx0XHRrZXk6IEtleUhlbHBlci5nZW5lcmF0ZUtleUZyb21EYXRhRmllbGQoZmllbGQpLFxuXHRcdFx0XHRcdFx0dHlwZTogRm9ybUVsZW1lbnRUeXBlLkFubm90YXRpb24sXG5cdFx0XHRcdFx0XHRhbm5vdGF0aW9uUGF0aDogY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoKGZpZWxkLmZ1bGx5UXVhbGlmaWVkTmFtZSkgKyBcIi9cIixcblx0XHRcdFx0XHRcdHNlbWFudGljT2JqZWN0UGF0aDogc2VtYW50aWNPYmplY3RBbm5vdGF0aW9uUGF0aCxcblx0XHRcdFx0XHRcdGZvcm1hdE9wdGlvbnM6IHtcblx0XHRcdFx0XHRcdFx0dGV4dExpbmVzRGlzcGxheTogMCxcblx0XHRcdFx0XHRcdFx0dGV4dExpbmVzRWRpdDogNFxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVGVybXMuRGF0YVBvaW50OlxuXHRcdFx0Zm9ybUVsZW1lbnRzLnB1c2goe1xuXHRcdFx0XHQvLyBrZXk6IEtleUhlbHBlci5nZW5lcmF0ZUtleUZyb21EYXRhRmllbGQoZm9ybUFubm90YXRpb24pLFxuXHRcdFx0XHRrZXk6IFwiRGF0YVBvaW50OjpcIiArIChmb3JtQW5ub3RhdGlvbi5xdWFsaWZpZXIgPyBmb3JtQW5ub3RhdGlvbi5xdWFsaWZpZXIgOiBcIlwiKSxcblx0XHRcdFx0dHlwZTogRm9ybUVsZW1lbnRUeXBlLkFubm90YXRpb24sXG5cdFx0XHRcdGFubm90YXRpb25QYXRoOiBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVNldEJhc2VkQW5ub3RhdGlvblBhdGgoZm9ybUFubm90YXRpb24uZnVsbHlRdWFsaWZpZWROYW1lKSArIFwiL1wiXG5cdFx0XHR9KTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgQ29tbXVuaWNhdGlvbkFubm90YXRpb25UZXJtcy5Db250YWN0OlxuXHRcdFx0Zm9ybUVsZW1lbnRzLnB1c2goe1xuXHRcdFx0XHQvLyBrZXk6IEtleUhlbHBlci5nZW5lcmF0ZUtleUZyb21EYXRhRmllbGQoZm9ybUFubm90YXRpb24pLFxuXHRcdFx0XHRrZXk6IFwiQ29udGFjdDo6XCIgKyAoZm9ybUFubm90YXRpb24ucXVhbGlmaWVyID8gZm9ybUFubm90YXRpb24ucXVhbGlmaWVyIDogXCJcIiksXG5cdFx0XHRcdHR5cGU6IEZvcm1FbGVtZW50VHlwZS5Bbm5vdGF0aW9uLFxuXHRcdFx0XHRhbm5vdGF0aW9uUGF0aDogY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoKGZvcm1Bbm5vdGF0aW9uLmZ1bGx5UXVhbGlmaWVkTmFtZSkgKyBcIi9cIlxuXHRcdFx0fSk7XG5cdFx0XHRicmVhaztcblx0XHRkZWZhdWx0OlxuXHRcdFx0YnJlYWs7XG5cdH1cblx0cmV0dXJuIGZvcm1FbGVtZW50cztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEZvcm1FbGVtZW50c0Zyb21NYW5pZmVzdChcblx0ZmFjZXREZWZpbml0aW9uOiBSZWZlcmVuY2VGYWNldFR5cGVzLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0XG4pOiBSZWNvcmQ8c3RyaW5nLCBDdXN0b21Gb3JtRWxlbWVudD4ge1xuXHRjb25zdCBtYW5pZmVzdFdyYXBwZXIgPSBjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0V3JhcHBlcigpO1xuXHRjb25zdCBtYW5pZmVzdEZvcm1Db250YWluZXI6IEZvcm1NYW5pZmVzdENvbmZpZ3VyYXRpb24gPSBtYW5pZmVzdFdyYXBwZXIuZ2V0Rm9ybUNvbnRhaW5lcihmYWNldERlZmluaXRpb24uVGFyZ2V0LnZhbHVlKTtcblx0Y29uc3QgZm9ybUVsZW1lbnRzOiBSZWNvcmQ8c3RyaW5nLCBDdXN0b21Gb3JtRWxlbWVudD4gPSB7fTtcblx0aWYgKG1hbmlmZXN0Rm9ybUNvbnRhaW5lcj8uZmllbGRzKSB7XG5cdFx0T2JqZWN0LmtleXMobWFuaWZlc3RGb3JtQ29udGFpbmVyPy5maWVsZHMpLmZvckVhY2goZmllbGRJZCA9PiB7XG5cdFx0XHRmb3JtRWxlbWVudHNbZmllbGRJZF0gPSB7XG5cdFx0XHRcdGtleTogZmllbGRJZCxcblx0XHRcdFx0dHlwZTogRm9ybUVsZW1lbnRUeXBlLkRlZmF1bHQsXG5cdFx0XHRcdHRlbXBsYXRlOiBtYW5pZmVzdEZvcm1Db250YWluZXIuZmllbGRzW2ZpZWxkSWRdLnRlbXBsYXRlLFxuXHRcdFx0XHRsYWJlbDogbWFuaWZlc3RGb3JtQ29udGFpbmVyLmZpZWxkc1tmaWVsZElkXS5sYWJlbCxcblx0XHRcdFx0cG9zaXRpb246IG1hbmlmZXN0Rm9ybUNvbnRhaW5lci5maWVsZHNbZmllbGRJZF0ucG9zaXRpb24gfHwge1xuXHRcdFx0XHRcdHBsYWNlbWVudDogUGxhY2VtZW50LkFmdGVyXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdE9wdGlvbnM6IHtcblx0XHRcdFx0XHR0ZXh0TGluZXNEaXNwbGF5OiAwLFxuXHRcdFx0XHRcdHRleHRMaW5lc0VkaXQ6IDQsXG5cdFx0XHRcdFx0Li4ubWFuaWZlc3RGb3JtQ29udGFpbmVyLmZpZWxkc1tmaWVsZElkXS5mb3JtYXRPcHRpb25zXG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fSk7XG5cdH1cblx0cmV0dXJuIGZvcm1FbGVtZW50cztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEZvcm1Db250YWluZXIoZmFjZXREZWZpbml0aW9uOiBSZWZlcmVuY2VGYWNldFR5cGVzLCBjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogRm9ybUNvbnRhaW5lciB7XG5cdC8vVE9ETyBmb3JtIGNvbnRhaW5lciBpZFxuXHRjb25zdCByZXNvbHZlZFRhcmdldCA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZUFubm90YXRpb24oZmFjZXREZWZpbml0aW9uLlRhcmdldC52YWx1ZSk7XG5cdGxldCBzRW50aXR5U2V0UGF0aCE6IHN0cmluZztcblx0aWYgKHJlc29sdmVkVGFyZ2V0LmNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0KCkgIT09IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0KCkpIHtcblx0XHRzRW50aXR5U2V0UGF0aCA9IGdldFRhcmdldEVudGl0eVNldFBhdGgocmVzb2x2ZWRUYXJnZXQuY29udmVydGVyQ29udGV4dC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCkpO1xuXHR9IGVsc2UgaWYgKHJlc29sdmVkVGFyZ2V0LmNvbnZlcnRlckNvbnRleHQuZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCgpLnRhcmdldE9iamVjdD8uY29udGFpbnNUYXJnZXQgPT09IHRydWUpIHtcblx0XHRzRW50aXR5U2V0UGF0aCA9IGdldFRhcmdldE9iamVjdFBhdGgocmVzb2x2ZWRUYXJnZXQuY29udmVydGVyQ29udGV4dC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCksIGZhbHNlKTtcblx0fVxuXHRyZXR1cm4ge1xuXHRcdGlkOiBmYWNldERlZmluaXRpb24/LklEPy50b1N0cmluZygpLFxuXHRcdGZvcm1FbGVtZW50czogaW5zZXJ0Q3VzdG9tRWxlbWVudHMoXG5cdFx0XHRnZXRGb3JtRWxlbWVudHNGcm9tQW5ub3RhdGlvbnMoZmFjZXREZWZpbml0aW9uLCBjb252ZXJ0ZXJDb250ZXh0KSxcblx0XHRcdGdldEZvcm1FbGVtZW50c0Zyb21NYW5pZmVzdChmYWNldERlZmluaXRpb24sIGNvbnZlcnRlckNvbnRleHQpLFxuXHRcdFx0eyBmb3JtYXRPcHRpb25zOiBcIm92ZXJ3cml0ZVwiIH1cblx0XHQpLFxuXHRcdGFubm90YXRpb25QYXRoOiBcIi9cIiArIGZhY2V0RGVmaW5pdGlvbi5mdWxseVF1YWxpZmllZE5hbWUsXG5cdFx0ZW50aXR5U2V0OiBzRW50aXR5U2V0UGF0aFxuXHR9O1xufVxuXG5mdW5jdGlvbiBnZXRGb3JtQ29udGFpbmVyc0ZvckNvbGxlY3Rpb24oZmFjZXREZWZpbml0aW9uOiBDb2xsZWN0aW9uRmFjZXRUeXBlcywgY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCk6IEZvcm1Db250YWluZXJbXSB7XG5cdGNvbnN0IGZvcm1Db250YWluZXJzOiBGb3JtQ29udGFpbmVyW10gPSBbXTtcblx0Ly9UT0RPIGNvbGwgZmFjZXQgaW5zaWRlIGNvbGwgZmFjZXQ/XG5cdGZhY2V0RGVmaW5pdGlvbi5GYWNldHM/LmZvckVhY2goZmFjZXQgPT4ge1xuXHRcdC8vIElnbm9yZSBsZXZlbCAzIGNvbGxlY3Rpb24gZmFjZXRcblx0XHRpZiAoZmFjZXQuJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLkNvbGxlY3Rpb25GYWNldCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRmb3JtQ29udGFpbmVycy5wdXNoKGdldEZvcm1Db250YWluZXIoZmFjZXQgYXMgUmVmZXJlbmNlRmFjZXRUeXBlcywgY29udmVydGVyQ29udGV4dCkpO1xuXHR9KTtcblx0cmV0dXJuIGZvcm1Db250YWluZXJzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNSZWZlcmVuY2VGYWNldChmYWNldERlZmluaXRpb246IEZhY2V0VHlwZXMpOiBmYWNldERlZmluaXRpb24gaXMgUmVmZXJlbmNlRmFjZXRUeXBlcyB7XG5cdHJldHVybiBmYWNldERlZmluaXRpb24uJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLlJlZmVyZW5jZUZhY2V0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRm9ybURlZmluaXRpb24oZmFjZXREZWZpbml0aW9uOiBGYWNldFR5cGVzLCBjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogRm9ybURlZmluaXRpb24ge1xuXHRzd2l0Y2ggKGZhY2V0RGVmaW5pdGlvbi4kVHlwZSkge1xuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuQ29sbGVjdGlvbkZhY2V0OlxuXHRcdFx0Ly8gS2VlcCBvbmx5IHZhbGlkIGNoaWxkcmVuXG5cdFx0XHRjb25zdCBmb3JtQ29sbGVjdGlvbkRlZmluaXRpb24gPSB7XG5cdFx0XHRcdGlkOiBGb3JtSUQoeyBGYWNldDogZmFjZXREZWZpbml0aW9uIH0pLFxuXHRcdFx0XHR1c2VGb3JtQ29udGFpbmVyTGFiZWxzOiB0cnVlLFxuXHRcdFx0XHRoYXNGYWNldHNOb3RQYXJ0T2ZQcmV2aWV3OiBmYWNldERlZmluaXRpb24uRmFjZXRzLnNvbWUoXG5cdFx0XHRcdFx0Y2hpbGRGYWNldCA9PiBjaGlsZEZhY2V0LmFubm90YXRpb25zPy5VST8uUGFydE9mUHJldmlldz8udmFsdWVPZigpID09PSBmYWxzZVxuXHRcdFx0XHQpLFxuXHRcdFx0XHRmb3JtQ29udGFpbmVyczogZ2V0Rm9ybUNvbnRhaW5lcnNGb3JDb2xsZWN0aW9uKGZhY2V0RGVmaW5pdGlvbiwgY29udmVydGVyQ29udGV4dClcblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gZm9ybUNvbGxlY3Rpb25EZWZpbml0aW9uO1xuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuUmVmZXJlbmNlRmFjZXQ6XG5cdFx0XHRjb25zdCBmb3JtRGVmaW5pdGlvbiA9IHtcblx0XHRcdFx0aWQ6IEZvcm1JRCh7IEZhY2V0OiBmYWNldERlZmluaXRpb24gfSksXG5cdFx0XHRcdHVzZUZvcm1Db250YWluZXJMYWJlbHM6IGZhbHNlLFxuXHRcdFx0XHRoYXNGYWNldHNOb3RQYXJ0T2ZQcmV2aWV3OiBmYWNldERlZmluaXRpb24uYW5ub3RhdGlvbnM/LlVJPy5QYXJ0T2ZQcmV2aWV3Py52YWx1ZU9mKCkgPT09IGZhbHNlLFxuXHRcdFx0XHRmb3JtQ29udGFpbmVyczogW2dldEZvcm1Db250YWluZXIoZmFjZXREZWZpbml0aW9uLCBjb252ZXJ0ZXJDb250ZXh0KV1cblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gZm9ybURlZmluaXRpb247XG5cdFx0ZGVmYXVsdDpcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBjcmVhdGUgZm9ybSBiYXNlZCBvbiBSZWZlcmVuY2VVUkxGYWNldFwiKTtcblx0fVxufVxuIl19