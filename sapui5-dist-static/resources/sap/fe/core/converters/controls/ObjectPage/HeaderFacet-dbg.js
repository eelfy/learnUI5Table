sap.ui.define(["sap/fe/core/converters/helpers/ConfigurableObject", "sap/fe/core/converters/helpers/ID", "sap/fe/core/helpers/BindingExpression", "sap/fe/core/converters/helpers/Key", "../Common/Form", "sap/fe/core/converters/annotations/DataField"], function (ConfigurableObject, ID, BindingExpression, Key, Form, DataField) {
  "use strict";

  var _exports = {};
  var getSemanticObjectPath = DataField.getSemanticObjectPath;
  var getFormElementsFromManifest = Form.getFormElementsFromManifest;
  var FormElementType = Form.FormElementType;
  var KeyHelper = Key.KeyHelper;
  var not = BindingExpression.not;
  var equal = BindingExpression.equal;
  var compileBinding = BindingExpression.compileBinding;
  var annotationExpression = BindingExpression.annotationExpression;
  var HeaderFacetID = ID.HeaderFacetID;
  var HeaderFacetFormID = ID.HeaderFacetFormID;
  var HeaderFacetContainerID = ID.HeaderFacetContainerID;
  var CustomHeaderFacetID = ID.CustomHeaderFacetID;
  var Placement = ConfigurableObject.Placement;
  var insertCustomElements = ConfigurableObject.insertCustomElements;

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Definitions: Header Facet Types, Generic OP Header Facet, Manifest Properties for Custom Header Facet
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  var HeaderFacetType;

  (function (HeaderFacetType) {
    HeaderFacetType["Annotation"] = "Annotation";
    HeaderFacetType["XMLFragment"] = "XMLFragment";
  })(HeaderFacetType || (HeaderFacetType = {}));

  _exports.HeaderFacetType = HeaderFacetType;
  var FacetType;

  (function (FacetType) {
    FacetType["Reference"] = "Reference";
    FacetType["Collection"] = "Collection";
  })(FacetType || (FacetType = {}));

  _exports.FacetType = FacetType;
  var FlexDesignTimeType;

  (function (FlexDesignTimeType) {
    FlexDesignTimeType["Default"] = "Default";
    FlexDesignTimeType["NotAdaptable"] = "not-adaptable";
    FlexDesignTimeType["NotAdaptableTree"] = "not-adaptable-tree";
    FlexDesignTimeType["NotAdaptableVisibility"] = "not-adaptable-visibility";
  })(FlexDesignTimeType || (FlexDesignTimeType = {}));

  _exports.FlexDesignTimeType = FlexDesignTimeType;
  var HeaderDataPointType;

  (function (HeaderDataPointType) {
    HeaderDataPointType["ProgressIndicator"] = "ProgressIndicator";
    HeaderDataPointType["RatingIndicator"] = "RatingIndicator";
    HeaderDataPointType["Content"] = "Content";
  })(HeaderDataPointType || (HeaderDataPointType = {}));

  var TargetAnnotationType;

  (function (TargetAnnotationType) {
    TargetAnnotationType["None"] = "None";
    TargetAnnotationType["DataPoint"] = "DataPoint";
    TargetAnnotationType["Chart"] = "Chart";
    TargetAnnotationType["Identification"] = "Identification";
    TargetAnnotationType["Contact"] = "Contact";
    TargetAnnotationType["Address"] = "Address";
    TargetAnnotationType["FieldGroup"] = "FieldGroup";
  })(TargetAnnotationType || (TargetAnnotationType = {}));

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Collect All Header Facets: Custom (via Manifest) and Annotation Based (via Metamodel)
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * Retrieve header facets from annotations.
   *
   * @param {ConverterContext} converterContext for this object
   *
   * @returns {ObjectPageHeaderFacet} header facets from annotations
   */
  function getHeaderFacetsFromAnnotations(converterContext) {
    var _converterContext$get, _converterContext$get2, _converterContext$get3;

    var headerFacets = [];
    (_converterContext$get = converterContext.getEntityType().annotations) === null || _converterContext$get === void 0 ? void 0 : (_converterContext$get2 = _converterContext$get.UI) === null || _converterContext$get2 === void 0 ? void 0 : (_converterContext$get3 = _converterContext$get2.HeaderFacets) === null || _converterContext$get3 === void 0 ? void 0 : _converterContext$get3.forEach(function (facet) {
      var headerFacet = createHeaderFacet(facet, converterContext);

      if (headerFacet) {
        headerFacets.push(headerFacet);
      }
    });
    return headerFacets;
  }
  /**
   * Retrieve custom header facets from manifest.
   *
   * @param {ConfigurableRecord<ManifestHeaderFacet>} manifestCustomHeaderFacets settings for this object
   *
   * @returns {Record<string, CustomObjectPageHeaderFacet>} header facets from manifest
   */


  _exports.getHeaderFacetsFromAnnotations = getHeaderFacetsFromAnnotations;

  function getHeaderFacetsFromManifest(manifestCustomHeaderFacets) {
    var customHeaderFacets = {};
    Object.keys(manifestCustomHeaderFacets).forEach(function (manifestHeaderFacetKey) {
      var customHeaderFacet = manifestCustomHeaderFacets[manifestHeaderFacetKey];
      customHeaderFacets[manifestHeaderFacetKey] = createCustomHeaderFacet(customHeaderFacet, manifestHeaderFacetKey);
    });
    return customHeaderFacets;
  }
  /**
   * Retrieve flexibility designtime settings from manifest.
   *
   * @param {FacetTypes} facetDefinition facet definition
   * @param {FacetTypes} collectionFacetDefinition collection facet definition
   * @param {ConverterContext} converterContext settings for this object
   *
   * @returns {FlexDesignTimeType} designtime setting or default
   */


  _exports.getHeaderFacetsFromManifest = getHeaderFacetsFromManifest;

  function getDesignTimeMetadata(facetDefinition, collectionFacetDefinition, converterContext) {
    var _facetDefinition$ID;

    var designTimeMetadata = FlexDesignTimeType.Default;
    var headerFacetID = ((_facetDefinition$ID = facetDefinition.ID) === null || _facetDefinition$ID === void 0 ? void 0 : _facetDefinition$ID.toString()) || ""; // For HeaderFacets nested inside CollectionFacet RTA should be disabled, therefore set to "not-adaptable-tree"

    if (facetDefinition.$Type === "com.sap.vocabularies.UI.v1.ReferenceFacet" && collectionFacetDefinition.$Type === "com.sap.vocabularies.UI.v1.CollectionFacet") {
      designTimeMetadata = FlexDesignTimeType.NotAdaptableTree;
    } else {
      var headerFacetsControlConfig = converterContext.getManifestControlConfiguration("@com.sap.vocabularies.UI.v1.HeaderFacets");

      if (headerFacetID) {
        var _headerFacetsControlC, _headerFacetsControlC2, _headerFacetsControlC3;

        var designTime = headerFacetsControlConfig === null || headerFacetsControlConfig === void 0 ? void 0 : (_headerFacetsControlC = headerFacetsControlConfig.facets) === null || _headerFacetsControlC === void 0 ? void 0 : (_headerFacetsControlC2 = _headerFacetsControlC[headerFacetID]) === null || _headerFacetsControlC2 === void 0 ? void 0 : (_headerFacetsControlC3 = _headerFacetsControlC2.flexSettings) === null || _headerFacetsControlC3 === void 0 ? void 0 : _headerFacetsControlC3.designtime;

        switch (designTime) {
          case FlexDesignTimeType.NotAdaptable:
          case FlexDesignTimeType.NotAdaptableTree:
          case FlexDesignTimeType.NotAdaptableVisibility:
            designTimeMetadata = designTime;
        }
      }
    }

    return designTimeMetadata;
  } ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Convert & Build Annotation Based Header Facets
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  _exports.getDesignTimeMetadata = getDesignTimeMetadata;

  function createReferenceHeaderFacet(facetDefinition, collectionFacetDefinition, converterContext) {
    var _facetDefinition$anno, _facetDefinition$anno2, _facetDefinition$anno3;

    if (facetDefinition.$Type === "com.sap.vocabularies.UI.v1.ReferenceFacet" && !(((_facetDefinition$anno = facetDefinition.annotations) === null || _facetDefinition$anno === void 0 ? void 0 : (_facetDefinition$anno2 = _facetDefinition$anno.UI) === null || _facetDefinition$anno2 === void 0 ? void 0 : (_facetDefinition$anno3 = _facetDefinition$anno2.Hidden) === null || _facetDefinition$anno3 === void 0 ? void 0 : _facetDefinition$anno3.valueOf()) === true)) {
      var _annotations$UI, _annotations$UI$Hidde;

      var headerFacetID = HeaderFacetID({
        Facet: facetDefinition
      }),
          getHeaderFacetKey = function (facetDefinition, fallback) {
        var _facetDefinition$ID2, _facetDefinition$Labe;

        return ((_facetDefinition$ID2 = facetDefinition.ID) === null || _facetDefinition$ID2 === void 0 ? void 0 : _facetDefinition$ID2.toString()) || ((_facetDefinition$Labe = facetDefinition.Label) === null || _facetDefinition$Labe === void 0 ? void 0 : _facetDefinition$Labe.toString()) || fallback;
      },
          targetAnnotationValue = facetDefinition.Target.value,
          targetAnnotationType = getTargetAnnotationType(facetDefinition);

      var headerFormData;
      var headerDataPointData;

      switch (targetAnnotationType) {
        case TargetAnnotationType.FieldGroup:
          headerFormData = getFieldGroupFormData(facetDefinition, converterContext);
          break;

        case TargetAnnotationType.DataPoint:
          headerDataPointData = getDataPointData(facetDefinition);
          break;
        // ToDo: Handle other cases
      }

      var annotations = facetDefinition.annotations;
      return {
        type: HeaderFacetType.Annotation,
        facetType: FacetType.Reference,
        id: headerFacetID,
        containerId: HeaderFacetContainerID({
          Facet: facetDefinition
        }),
        key: getHeaderFacetKey(facetDefinition, headerFacetID),
        flexSettings: {
          designtime: getDesignTimeMetadata(facetDefinition, collectionFacetDefinition, converterContext)
        },
        visible: compileBinding(not(equal(annotationExpression(annotations === null || annotations === void 0 ? void 0 : (_annotations$UI = annotations.UI) === null || _annotations$UI === void 0 ? void 0 : (_annotations$UI$Hidde = _annotations$UI.Hidden) === null || _annotations$UI$Hidde === void 0 ? void 0 : _annotations$UI$Hidde.valueOf()), true))),
        annotationPath: converterContext.getEntitySetBasedAnnotationPath(facetDefinition.fullyQualifiedName) + "/",
        targetAnnotationValue: targetAnnotationValue,
        targetAnnotationType: targetAnnotationType,
        headerFormData: headerFormData,
        headerDataPointData: headerDataPointData
      };
    }

    return undefined;
  }

  function createCollectionHeaderFacet(collectionFacetDefinition, converterContext) {
    if (collectionFacetDefinition.$Type === "com.sap.vocabularies.UI.v1.CollectionFacet") {
      var _collectionFacetDefin, _collectionFacetDefin2, _collectionFacetDefin3;

      var facets = [],
          headerFacetID = HeaderFacetID({
        Facet: collectionFacetDefinition
      }),
          getHeaderFacetKey = function (facetDefinition, fallback) {
        var _facetDefinition$ID3, _facetDefinition$Labe2;

        return ((_facetDefinition$ID3 = facetDefinition.ID) === null || _facetDefinition$ID3 === void 0 ? void 0 : _facetDefinition$ID3.toString()) || ((_facetDefinition$Labe2 = facetDefinition.Label) === null || _facetDefinition$Labe2 === void 0 ? void 0 : _facetDefinition$Labe2.toString()) || fallback;
      };

      collectionFacetDefinition.Facets.forEach(function (facetDefinition) {
        var facet = createReferenceHeaderFacet(facetDefinition, collectionFacetDefinition, converterContext);

        if (facet) {
          facets.push(facet);
        }
      });
      return {
        type: HeaderFacetType.Annotation,
        facetType: FacetType.Collection,
        id: headerFacetID,
        containerId: HeaderFacetContainerID({
          Facet: collectionFacetDefinition
        }),
        key: getHeaderFacetKey(collectionFacetDefinition, headerFacetID),
        flexSettings: {
          designtime: getDesignTimeMetadata(collectionFacetDefinition, collectionFacetDefinition, converterContext)
        },
        visible: compileBinding(not(equal(annotationExpression((_collectionFacetDefin = collectionFacetDefinition.annotations) === null || _collectionFacetDefin === void 0 ? void 0 : (_collectionFacetDefin2 = _collectionFacetDefin.UI) === null || _collectionFacetDefin2 === void 0 ? void 0 : (_collectionFacetDefin3 = _collectionFacetDefin2.Hidden) === null || _collectionFacetDefin3 === void 0 ? void 0 : _collectionFacetDefin3.valueOf()), true))),
        annotationPath: converterContext.getEntitySetBasedAnnotationPath(collectionFacetDefinition.fullyQualifiedName) + "/",
        facets: facets
      };
    }

    return undefined;
  }

  function getTargetAnnotationType(facetDefinition) {
    var annotationType = TargetAnnotationType.None;
    var annotationTypeMap = {
      "com.sap.vocabularies.UI.v1.DataPoint": TargetAnnotationType.DataPoint,
      "com.sap.vocabularies.UI.v1.Chart": TargetAnnotationType.Chart,
      "com.sap.vocabularies.UI.v1.Identification": TargetAnnotationType.Identification,
      "com.sap.vocabularies.Communication.v1.Contact": TargetAnnotationType.Contact,
      "com.sap.vocabularies.Communication.v1.Address": TargetAnnotationType.Address,
      "com.sap.vocabularies.UI.v1.FieldGroup": TargetAnnotationType.FieldGroup
    }; // ReferenceURLFacet and CollectionFacet do not have Target property.

    if (facetDefinition.$Type !== "com.sap.vocabularies.UI.v1.ReferenceURLFacet" && facetDefinition.$Type !== "com.sap.vocabularies.UI.v1.CollectionFacet") {
      var _facetDefinition$Targ, _facetDefinition$Targ2;

      annotationType = annotationTypeMap[(_facetDefinition$Targ = facetDefinition.Target) === null || _facetDefinition$Targ === void 0 ? void 0 : (_facetDefinition$Targ2 = _facetDefinition$Targ.$target) === null || _facetDefinition$Targ2 === void 0 ? void 0 : _facetDefinition$Targ2.term] || TargetAnnotationType.None;
    }

    return annotationType;
  }

  function getFieldGroupFormData(facetDefinition, converterContext) {
    var _facetDefinition$Labe3;

    // split in this from annotation + getFieldGroupFromDefault
    if (!facetDefinition) {
      throw new Error("Cannot get FieldGroup form data without facet definition");
    }

    var formElements = insertCustomElements(getFormElementsFromAnnotations(facetDefinition, converterContext), getFormElementsFromManifest(facetDefinition, converterContext));
    return {
      id: HeaderFacetFormID({
        Facet: facetDefinition
      }),
      label: (_facetDefinition$Labe3 = facetDefinition.Label) === null || _facetDefinition$Labe3 === void 0 ? void 0 : _facetDefinition$Labe3.toString(),
      formElements: formElements
    };
  }
  /**
   * Create an array of manifest based formElements.
   *
   * @param {FacetType} facetDefinition for this object
   * @param {ConverterContext} converterContext for this object
   *
   * @returns {Array} Annotation based FormElements
   */


  function getFormElementsFromAnnotations(facetDefinition, converterContext) {
    var annotationBasedFormElements = []; // ReferenceURLFacet and CollectionFacet do not have Target property.

    if (facetDefinition.$Type !== "com.sap.vocabularies.UI.v1.ReferenceURLFacet" && facetDefinition.$Type !== "com.sap.vocabularies.UI.v1.CollectionFacet") {
      var _facetDefinition$Targ3, _facetDefinition$Targ4;

      (_facetDefinition$Targ3 = facetDefinition.Target) === null || _facetDefinition$Targ3 === void 0 ? void 0 : (_facetDefinition$Targ4 = _facetDefinition$Targ3.$target) === null || _facetDefinition$Targ4 === void 0 ? void 0 : _facetDefinition$Targ4.Data.forEach(function (dataField) {
        var _dataField$annotation, _dataField$annotation2, _dataField$annotation3;

        if (!(((_dataField$annotation = dataField.annotations) === null || _dataField$annotation === void 0 ? void 0 : (_dataField$annotation2 = _dataField$annotation.UI) === null || _dataField$annotation2 === void 0 ? void 0 : (_dataField$annotation3 = _dataField$annotation2.Hidden) === null || _dataField$annotation3 === void 0 ? void 0 : _dataField$annotation3.valueOf()) === true)) {
          var semanticObjectAnnotationPath = getSemanticObjectPath(converterContext, dataField);

          if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataField") {
            var _dataField$Value, _dataField$Value$$tar, _dataField$Value$$tar2, _dataField$Value$$tar3, _dataField$Value$$tar4, _annotations$UI2, _annotations$UI2$Hidd, _dataField$Value2, _dataField$Value2$$ta, _dataField$Value2$$ta2, _dataField$Value2$$ta3;

            var annotations = dataField.annotations;
            annotationBasedFormElements.push({
              isValueMultilineText: ((_dataField$Value = dataField.Value) === null || _dataField$Value === void 0 ? void 0 : (_dataField$Value$$tar = _dataField$Value.$target) === null || _dataField$Value$$tar === void 0 ? void 0 : (_dataField$Value$$tar2 = _dataField$Value$$tar.annotations) === null || _dataField$Value$$tar2 === void 0 ? void 0 : (_dataField$Value$$tar3 = _dataField$Value$$tar2.UI) === null || _dataField$Value$$tar3 === void 0 ? void 0 : (_dataField$Value$$tar4 = _dataField$Value$$tar3.MultiLineText) === null || _dataField$Value$$tar4 === void 0 ? void 0 : _dataField$Value$$tar4.valueOf()) === true,
              type: FormElementType.Annotation,
              key: KeyHelper.generateKeyFromDataField(dataField),
              visible: compileBinding(not(equal(annotationExpression(annotations === null || annotations === void 0 ? void 0 : (_annotations$UI2 = annotations.UI) === null || _annotations$UI2 === void 0 ? void 0 : (_annotations$UI2$Hidd = _annotations$UI2.Hidden) === null || _annotations$UI2$Hidd === void 0 ? void 0 : _annotations$UI2$Hidd.valueOf()), true))),
              label: ((_dataField$Value2 = dataField.Value) === null || _dataField$Value2 === void 0 ? void 0 : (_dataField$Value2$$ta = _dataField$Value2.$target) === null || _dataField$Value2$$ta === void 0 ? void 0 : (_dataField$Value2$$ta2 = _dataField$Value2$$ta.annotations) === null || _dataField$Value2$$ta2 === void 0 ? void 0 : (_dataField$Value2$$ta3 = _dataField$Value2$$ta2.Common) === null || _dataField$Value2$$ta3 === void 0 ? void 0 : _dataField$Value2$$ta3.Label) || dataField.Label,
              idPrefix: HeaderFacetFormID({
                Facet: facetDefinition
              }, dataField),
              annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName) + "/",
              semanticObjectPath: semanticObjectAnnotationPath
            });
          } else if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation") {
            var _dataField$Target, _dataField$Target$$ta, _dataField$Target$$ta2, _dataField$Target$$ta3, _dataField$Target$$ta4, _annotations$UI3, _annotations$UI3$Hidd, _dataField$Target2, _dataField$Target2$$t, _dataField$Target2$$t2, _dataField$Target2$$t3;

            var _annotations = dataField.annotations;
            annotationBasedFormElements.push({
              isValueMultilineText: ((_dataField$Target = dataField.Target) === null || _dataField$Target === void 0 ? void 0 : (_dataField$Target$$ta = _dataField$Target.$target) === null || _dataField$Target$$ta === void 0 ? void 0 : (_dataField$Target$$ta2 = _dataField$Target$$ta.annotations) === null || _dataField$Target$$ta2 === void 0 ? void 0 : (_dataField$Target$$ta3 = _dataField$Target$$ta2.UI) === null || _dataField$Target$$ta3 === void 0 ? void 0 : (_dataField$Target$$ta4 = _dataField$Target$$ta3.MultiLineText) === null || _dataField$Target$$ta4 === void 0 ? void 0 : _dataField$Target$$ta4.valueOf()) === true,
              type: FormElementType.Annotation,
              key: KeyHelper.generateKeyFromDataField(dataField),
              visible: compileBinding(not(equal(annotationExpression(_annotations === null || _annotations === void 0 ? void 0 : (_annotations$UI3 = _annotations.UI) === null || _annotations$UI3 === void 0 ? void 0 : (_annotations$UI3$Hidd = _annotations$UI3.Hidden) === null || _annotations$UI3$Hidd === void 0 ? void 0 : _annotations$UI3$Hidd.valueOf()), true))),
              label: ((_dataField$Target2 = dataField.Target) === null || _dataField$Target2 === void 0 ? void 0 : (_dataField$Target2$$t = _dataField$Target2.$target) === null || _dataField$Target2$$t === void 0 ? void 0 : (_dataField$Target2$$t2 = _dataField$Target2$$t.annotations) === null || _dataField$Target2$$t2 === void 0 ? void 0 : (_dataField$Target2$$t3 = _dataField$Target2$$t2.Common) === null || _dataField$Target2$$t3 === void 0 ? void 0 : _dataField$Target2$$t3.Label) || dataField.Label,
              idPrefix: HeaderFacetFormID({
                Facet: facetDefinition
              }, dataField),
              annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName) + "/",
              semanticObjectPath: semanticObjectAnnotationPath
            });
          }
        }
      });
    }

    return annotationBasedFormElements;
  }

  function getDataPointData(facetDefinition) {
    var type = HeaderDataPointType.Content;

    if (facetDefinition.$Type === "com.sap.vocabularies.UI.v1.ReferenceFacet") {
      var _facetDefinition$Targ5, _facetDefinition$Targ6, _facetDefinition$Targ7, _facetDefinition$Targ8;

      if (((_facetDefinition$Targ5 = facetDefinition.Target) === null || _facetDefinition$Targ5 === void 0 ? void 0 : (_facetDefinition$Targ6 = _facetDefinition$Targ5.$target) === null || _facetDefinition$Targ6 === void 0 ? void 0 : _facetDefinition$Targ6.Visualization) === "UI.VisualizationType/Progress") {
        type = HeaderDataPointType.ProgressIndicator;
      } else if (((_facetDefinition$Targ7 = facetDefinition.Target) === null || _facetDefinition$Targ7 === void 0 ? void 0 : (_facetDefinition$Targ8 = _facetDefinition$Targ7.$target) === null || _facetDefinition$Targ8 === void 0 ? void 0 : _facetDefinition$Targ8.Visualization) === "UI.VisualizationType/Rating") {
        type = HeaderDataPointType.RatingIndicator;
      }
    }

    return {
      type: type
    };
  }
  /**
   * Create an annotation based header facet.
   *
   * @param {FacetTypes} facetDefinition of this object
   * @param {ConverterContext} converterContext for this object
   *
   * @returns {ObjectPageHeaderFacet} Annotation based header facet created
   */


  function createHeaderFacet(facetDefinition, converterContext) {
    var headerFacet;

    switch (facetDefinition.$Type) {
      case "com.sap.vocabularies.UI.v1.ReferenceFacet":
        headerFacet = createReferenceHeaderFacet(facetDefinition, facetDefinition, converterContext);
        break;

      case "com.sap.vocabularies.UI.v1.CollectionFacet":
        headerFacet = createCollectionHeaderFacet(facetDefinition, converterContext);
        break;
    }

    return headerFacet;
  } ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Convert & Build Manifest Based Header Facets
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  function generateBinding(requestGroupId) {
    if (!requestGroupId) {
      return undefined;
    }

    var groupId = ["Heroes", "Decoration", "Workers", "LongRunners"].indexOf(requestGroupId) !== -1 ? "$auto." + requestGroupId : requestGroupId;
    return "{ path : '', parameters : { $$groupId : '" + groupId + "' } }";
  }
  /**
   * Create a manifest based custom header facet.
   *
   * @param {ManifestHeaderFacet} customHeaderFacetDefinition for this object
   * @param {string} headerFacetKey of this object
   *
   * @returns {CustomObjectPageHeaderFacet} manifest based custom header facet created
   */


  function createCustomHeaderFacet(customHeaderFacetDefinition, headerFacetKey) {
    var customHeaderFacetID = CustomHeaderFacetID(headerFacetKey);
    var position = customHeaderFacetDefinition.position;

    if (!position) {
      position = {
        placement: Placement.After
      };
    }

    return {
      facetType: FacetType.Reference,
      facets: [],
      type: customHeaderFacetDefinition.type,
      id: customHeaderFacetID,
      containerId: customHeaderFacetID,
      key: headerFacetKey,
      position: position,
      visible: customHeaderFacetDefinition.visible,
      fragmentName: customHeaderFacetDefinition.name,
      title: customHeaderFacetDefinition.title,
      subTitle: customHeaderFacetDefinition.subTitle,
      stashed: customHeaderFacetDefinition.stashed || false,
      flexSettings: _objectSpread({}, {
        designtime: FlexDesignTimeType.Default
      }, {}, customHeaderFacetDefinition.flexSettings),
      binding: generateBinding(customHeaderFacetDefinition.requestGroupId)
    };
  }

  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhlYWRlckZhY2V0LnRzIl0sIm5hbWVzIjpbIkhlYWRlckZhY2V0VHlwZSIsIkZhY2V0VHlwZSIsIkZsZXhEZXNpZ25UaW1lVHlwZSIsIkhlYWRlckRhdGFQb2ludFR5cGUiLCJUYXJnZXRBbm5vdGF0aW9uVHlwZSIsImdldEhlYWRlckZhY2V0c0Zyb21Bbm5vdGF0aW9ucyIsImNvbnZlcnRlckNvbnRleHQiLCJoZWFkZXJGYWNldHMiLCJnZXRFbnRpdHlUeXBlIiwiYW5ub3RhdGlvbnMiLCJVSSIsIkhlYWRlckZhY2V0cyIsImZvckVhY2giLCJmYWNldCIsImhlYWRlckZhY2V0IiwiY3JlYXRlSGVhZGVyRmFjZXQiLCJwdXNoIiwiZ2V0SGVhZGVyRmFjZXRzRnJvbU1hbmlmZXN0IiwibWFuaWZlc3RDdXN0b21IZWFkZXJGYWNldHMiLCJjdXN0b21IZWFkZXJGYWNldHMiLCJPYmplY3QiLCJrZXlzIiwibWFuaWZlc3RIZWFkZXJGYWNldEtleSIsImN1c3RvbUhlYWRlckZhY2V0IiwiY3JlYXRlQ3VzdG9tSGVhZGVyRmFjZXQiLCJnZXREZXNpZ25UaW1lTWV0YWRhdGEiLCJmYWNldERlZmluaXRpb24iLCJjb2xsZWN0aW9uRmFjZXREZWZpbml0aW9uIiwiZGVzaWduVGltZU1ldGFkYXRhIiwiRGVmYXVsdCIsImhlYWRlckZhY2V0SUQiLCJJRCIsInRvU3RyaW5nIiwiJFR5cGUiLCJOb3RBZGFwdGFibGVUcmVlIiwiaGVhZGVyRmFjZXRzQ29udHJvbENvbmZpZyIsImdldE1hbmlmZXN0Q29udHJvbENvbmZpZ3VyYXRpb24iLCJkZXNpZ25UaW1lIiwiZmFjZXRzIiwiZmxleFNldHRpbmdzIiwiZGVzaWdudGltZSIsIk5vdEFkYXB0YWJsZSIsIk5vdEFkYXB0YWJsZVZpc2liaWxpdHkiLCJjcmVhdGVSZWZlcmVuY2VIZWFkZXJGYWNldCIsIkhpZGRlbiIsInZhbHVlT2YiLCJIZWFkZXJGYWNldElEIiwiRmFjZXQiLCJnZXRIZWFkZXJGYWNldEtleSIsImZhbGxiYWNrIiwiTGFiZWwiLCJ0YXJnZXRBbm5vdGF0aW9uVmFsdWUiLCJUYXJnZXQiLCJ2YWx1ZSIsInRhcmdldEFubm90YXRpb25UeXBlIiwiZ2V0VGFyZ2V0QW5ub3RhdGlvblR5cGUiLCJoZWFkZXJGb3JtRGF0YSIsImhlYWRlckRhdGFQb2ludERhdGEiLCJGaWVsZEdyb3VwIiwiZ2V0RmllbGRHcm91cEZvcm1EYXRhIiwiRGF0YVBvaW50IiwiZ2V0RGF0YVBvaW50RGF0YSIsInR5cGUiLCJBbm5vdGF0aW9uIiwiZmFjZXRUeXBlIiwiUmVmZXJlbmNlIiwiaWQiLCJjb250YWluZXJJZCIsIkhlYWRlckZhY2V0Q29udGFpbmVySUQiLCJrZXkiLCJ2aXNpYmxlIiwiY29tcGlsZUJpbmRpbmciLCJub3QiLCJlcXVhbCIsImFubm90YXRpb25FeHByZXNzaW9uIiwiYW5ub3RhdGlvblBhdGgiLCJnZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoIiwiZnVsbHlRdWFsaWZpZWROYW1lIiwidW5kZWZpbmVkIiwiY3JlYXRlQ29sbGVjdGlvbkhlYWRlckZhY2V0IiwiRmFjZXRzIiwiQ29sbGVjdGlvbiIsImFubm90YXRpb25UeXBlIiwiTm9uZSIsImFubm90YXRpb25UeXBlTWFwIiwiQ2hhcnQiLCJJZGVudGlmaWNhdGlvbiIsIkNvbnRhY3QiLCJBZGRyZXNzIiwiJHRhcmdldCIsInRlcm0iLCJFcnJvciIsImZvcm1FbGVtZW50cyIsImluc2VydEN1c3RvbUVsZW1lbnRzIiwiZ2V0Rm9ybUVsZW1lbnRzRnJvbUFubm90YXRpb25zIiwiZ2V0Rm9ybUVsZW1lbnRzRnJvbU1hbmlmZXN0IiwiSGVhZGVyRmFjZXRGb3JtSUQiLCJsYWJlbCIsImFubm90YXRpb25CYXNlZEZvcm1FbGVtZW50cyIsIkRhdGEiLCJkYXRhRmllbGQiLCJzZW1hbnRpY09iamVjdEFubm90YXRpb25QYXRoIiwiZ2V0U2VtYW50aWNPYmplY3RQYXRoIiwiaXNWYWx1ZU11bHRpbGluZVRleHQiLCJWYWx1ZSIsIk11bHRpTGluZVRleHQiLCJGb3JtRWxlbWVudFR5cGUiLCJLZXlIZWxwZXIiLCJnZW5lcmF0ZUtleUZyb21EYXRhRmllbGQiLCJDb21tb24iLCJpZFByZWZpeCIsInNlbWFudGljT2JqZWN0UGF0aCIsIkNvbnRlbnQiLCJWaXN1YWxpemF0aW9uIiwiUHJvZ3Jlc3NJbmRpY2F0b3IiLCJSYXRpbmdJbmRpY2F0b3IiLCJnZW5lcmF0ZUJpbmRpbmciLCJyZXF1ZXN0R3JvdXBJZCIsImdyb3VwSWQiLCJpbmRleE9mIiwiY3VzdG9tSGVhZGVyRmFjZXREZWZpbml0aW9uIiwiaGVhZGVyRmFjZXRLZXkiLCJjdXN0b21IZWFkZXJGYWNldElEIiwiQ3VzdG9tSGVhZGVyRmFjZXRJRCIsInBvc2l0aW9uIiwicGxhY2VtZW50IiwiUGxhY2VtZW50IiwiQWZ0ZXIiLCJmcmFnbWVudE5hbWUiLCJuYW1lIiwidGl0bGUiLCJzdWJUaXRsZSIsInN0YXNoZWQiLCJiaW5kaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBO0FBQ0E7QUFDQTtNQUVZQSxlOzthQUFBQSxlO0FBQUFBLElBQUFBLGU7QUFBQUEsSUFBQUEsZTtLQUFBQSxlLEtBQUFBLGU7OztNQUtBQyxTOzthQUFBQSxTO0FBQUFBLElBQUFBLFM7QUFBQUEsSUFBQUEsUztLQUFBQSxTLEtBQUFBLFM7OztNQUtBQyxrQjs7YUFBQUEsa0I7QUFBQUEsSUFBQUEsa0I7QUFBQUEsSUFBQUEsa0I7QUFBQUEsSUFBQUEsa0I7QUFBQUEsSUFBQUEsa0I7S0FBQUEsa0IsS0FBQUEsa0I7OztNQWlCUEMsbUI7O2FBQUFBLG1CO0FBQUFBLElBQUFBLG1CO0FBQUFBLElBQUFBLG1CO0FBQUFBLElBQUFBLG1CO0tBQUFBLG1CLEtBQUFBLG1COztNQVVBQyxvQjs7YUFBQUEsb0I7QUFBQUEsSUFBQUEsb0I7QUFBQUEsSUFBQUEsb0I7QUFBQUEsSUFBQUEsb0I7QUFBQUEsSUFBQUEsb0I7QUFBQUEsSUFBQUEsb0I7QUFBQUEsSUFBQUEsb0I7QUFBQUEsSUFBQUEsb0I7S0FB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QUdDLG1CQUFtQixDQUFDRixjQUFELENBQS9DO0FBRUEsUUFBSUcsUUFBOEIsR0FBR0osMkJBQTJCLENBQUNJLFFBQWpFOztBQUNBLFFBQUksQ0FBQ0EsUUFBTCxFQUFlO0FBQ2RBLE1BQUFBLFFBQVEsR0FBRztBQUNWQyxRQUFBQSxTQUFTLEVBQUVDLFNBQVMsQ0FBQ0M7QUFEWCxPQUFYO0FBR0E7O0FBQ0QsV0FBTztBQUNOL0QsTUFBQUEsU0FBUyxFQUFFL0QsU0FBUyxDQUFDZ0UsU0FEZjtBQUVOM0IsTUFBQUEsTUFBTSxFQUFFLEVBRkY7QUFHTndCLE1BQUFBLElBQUksRUFBRTBELDJCQUEyQixDQUFDMUQsSUFINUI7QUFJTkksTUFBQUEsRUFBRSxFQUFFd0QsbUJBSkU7QUFLTnZELE1BQUFBLFdBQVcsRUFBRXVELG1CQUxQO0FBTU5yRCxNQUFBQSxHQUFHLEVBQUVvRCxjQU5DO0FBT05HLE1BQUFBLFFBQVEsRUFBRUEsUUFQSjtBQVFOdEQsTUFBQUEsT0FBTyxFQUFFa0QsMkJBQTJCLENBQUNsRCxPQVIvQjtBQVNOMEQsTUFBQUEsWUFBWSxFQUFFUiwyQkFBMkIsQ0FBQ1MsSUFUcEM7QUFVTkMsTUFBQUEsS0FBSyxFQUFFViwyQkFBMkIsQ0FBQ1UsS0FWN0I7QUFXTkMsTUFBQUEsUUFBUSxFQUFFWCwyQkFBMkIsQ0FBQ1csUUFYaEM7QUFZTkMsTUFBQUEsT0FBTyxFQUFFWiwyQkFBMkIsQ0FBQ1ksT0FBNUIsSUFBdUMsS0FaMUM7QUFhTjdGLE1BQUFBLFlBQVksb0JBQU87QUFBRUMsUUFBQUEsVUFBVSxFQUFFdEMsa0JBQWtCLENBQUMyQjtBQUFqQyxPQUFQLE1BQXNEMkYsMkJBQTJCLENBQUNqRixZQUFsRixDQWJOO0FBY044RixNQUFBQSxPQUFPLEVBQUVqQixlQUFlLENBQUNJLDJCQUEyQixDQUFDSCxjQUE3QjtBQWRsQixLQUFQO0FBZ0JBIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNYW5pZmVzdEhlYWRlckZhY2V0IH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvTWFuaWZlc3RTZXR0aW5nc1wiO1xuaW1wb3J0IHtcblx0Q29uZmlndXJhYmxlT2JqZWN0LFxuXHRDb25maWd1cmFibGVSZWNvcmQsXG5cdEN1c3RvbUVsZW1lbnQsXG5cdGluc2VydEN1c3RvbUVsZW1lbnRzLFxuXHRQbGFjZW1lbnQsXG5cdFBvc2l0aW9uXG59IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvQ29uZmlndXJhYmxlT2JqZWN0XCI7XG5pbXBvcnQgeyBEYXRhRmllbGRBYnN0cmFjdFR5cGVzLCBGYWNldFR5cGVzLCBSZWZlcmVuY2VGYWNldFR5cGVzLCBVSUFubm90YXRpb25UeXBlcyB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlc1wiO1xuaW1wb3J0IHsgQ29udmVydGVyQ29udGV4dCB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL3RlbXBsYXRlcy9CYXNlQ29udmVydGVyXCI7XG5pbXBvcnQgeyBDdXN0b21IZWFkZXJGYWNldElELCBIZWFkZXJGYWNldENvbnRhaW5lcklELCBIZWFkZXJGYWNldEZvcm1JRCwgSGVhZGVyRmFjZXRJRCB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvSURcIjtcbmltcG9ydCB7IGFubm90YXRpb25FeHByZXNzaW9uLCBCaW5kaW5nRXhwcmVzc2lvbiwgY29tcGlsZUJpbmRpbmcsIGVxdWFsLCBub3QgfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9CaW5kaW5nRXhwcmVzc2lvblwiO1xuaW1wb3J0IHsgS2V5SGVscGVyIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvaGVscGVycy9LZXlcIjtcbmltcG9ydCB7IEFubm90YXRpb25Gb3JtRWxlbWVudCwgRm9ybUVsZW1lbnQsIEZvcm1FbGVtZW50VHlwZSwgZ2V0Rm9ybUVsZW1lbnRzRnJvbU1hbmlmZXN0IH0gZnJvbSBcIi4uL0NvbW1vbi9Gb3JtXCI7XG5pbXBvcnQgeyBnZXRTZW1hbnRpY09iamVjdFBhdGggfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9hbm5vdGF0aW9ucy9EYXRhRmllbGRcIjtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBEZWZpbml0aW9uczogSGVhZGVyIEZhY2V0IFR5cGVzLCBHZW5lcmljIE9QIEhlYWRlciBGYWNldCwgTWFuaWZlc3QgUHJvcGVydGllcyBmb3IgQ3VzdG9tIEhlYWRlciBGYWNldFxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbmV4cG9ydCBlbnVtIEhlYWRlckZhY2V0VHlwZSB7XG5cdEFubm90YXRpb24gPSBcIkFubm90YXRpb25cIixcblx0WE1MRnJhZ21lbnQgPSBcIlhNTEZyYWdtZW50XCJcbn1cblxuZXhwb3J0IGVudW0gRmFjZXRUeXBlIHtcblx0UmVmZXJlbmNlID0gXCJSZWZlcmVuY2VcIixcblx0Q29sbGVjdGlvbiA9IFwiQ29sbGVjdGlvblwiXG59XG5cbmV4cG9ydCBlbnVtIEZsZXhEZXNpZ25UaW1lVHlwZSB7XG5cdERlZmF1bHQgPSBcIkRlZmF1bHRcIixcblx0Tm90QWRhcHRhYmxlID0gXCJub3QtYWRhcHRhYmxlXCIsIC8vIGRpc2FibGUgYWxsIGFjdGlvbnMgb24gdGhhdCBpbnN0YW5jZVxuXHROb3RBZGFwdGFibGVUcmVlID0gXCJub3QtYWRhcHRhYmxlLXRyZWVcIiwgLy8gZGlzYWJsZSBhbGwgYWN0aW9ucyBvbiB0aGF0IGluc3RhbmNlIGFuZCBvbiBhbGwgY2hpbGRyZW4gb2YgdGhhdCBpbnN0YW5jZVxuXHROb3RBZGFwdGFibGVWaXNpYmlsaXR5ID0gXCJub3QtYWRhcHRhYmxlLXZpc2liaWxpdHlcIiAvLyBkaXNhYmxlIGFsbCBhY3Rpb25zIHRoYXQgaW5mbHVlbmNlIHRoZSB2aXNpYmlsaXR5LCBuYW1lbHkgcmV2ZWFsIGFuZCByZW1vdmVcbn1cblxuZXhwb3J0IHR5cGUgRmxleFNldHRpbmdzID0ge1xuXHRkZXNpZ250aW1lPzogRmxleERlc2lnblRpbWVUeXBlO1xufTtcblxudHlwZSBIZWFkZXJGb3JtRGF0YSA9IHtcblx0aWQ6IHN0cmluZztcblx0bGFiZWw/OiBzdHJpbmc7XG5cdGZvcm1FbGVtZW50czogRm9ybUVsZW1lbnRbXTtcbn07XG5cbmVudW0gSGVhZGVyRGF0YVBvaW50VHlwZSB7XG5cdFByb2dyZXNzSW5kaWNhdG9yID0gXCJQcm9ncmVzc0luZGljYXRvclwiLFxuXHRSYXRpbmdJbmRpY2F0b3IgPSBcIlJhdGluZ0luZGljYXRvclwiLFxuXHRDb250ZW50ID0gXCJDb250ZW50XCJcbn1cblxudHlwZSBIZWFkZXJEYXRhUG9pbnREYXRhID0ge1xuXHR0eXBlOiBIZWFkZXJEYXRhUG9pbnRUeXBlO1xufTtcblxuZW51bSBUYXJnZXRBbm5vdGF0aW9uVHlwZSB7XG5cdE5vbmUgPSBcIk5vbmVcIixcblx0RGF0YVBvaW50ID0gXCJEYXRhUG9pbnRcIixcblx0Q2hhcnQgPSBcIkNoYXJ0XCIsXG5cdElkZW50aWZpY2F0aW9uID0gXCJJZGVudGlmaWNhdGlvblwiLFxuXHRDb250YWN0ID0gXCJDb250YWN0XCIsXG5cdEFkZHJlc3MgPSBcIkFkZHJlc3NcIixcblx0RmllbGRHcm91cCA9IFwiRmllbGRHcm91cFwiXG59XG5cbnR5cGUgQmFzZUhlYWRlckZhY2V0ID0gQ29uZmlndXJhYmxlT2JqZWN0ICYge1xuXHR0eXBlOiBIZWFkZXJGYWNldFR5cGU7IC8vIE1hbmlmZXN0IG9yIE1ldGFkYXRhXG5cdGlkOiBzdHJpbmc7XG5cdGNvbnRhaW5lcklkOiBzdHJpbmc7XG5cdGFubm90YXRpb25QYXRoPzogc3RyaW5nO1xuXHRmbGV4U2V0dGluZ3M/OiBGbGV4U2V0dGluZ3M7XG5cdHZpc2libGU6IEJpbmRpbmdFeHByZXNzaW9uPGJvb2xlYW4+O1xuXHR0YXJnZXRBbm5vdGF0aW9uVmFsdWU/OiBzdHJpbmc7XG5cdHRhcmdldEFubm90YXRpb25UeXBlPzogVGFyZ2V0QW5ub3RhdGlvblR5cGU7XG59O1xuXG50eXBlIEJhc2VSZWZlcmVuY2VGYWNldCA9IEJhc2VIZWFkZXJGYWNldCAmIHtcblx0ZmFjZXRUeXBlOiBGYWNldFR5cGUuUmVmZXJlbmNlO1xufTtcblxudHlwZSBGaWVsZEdyb3VwRmFjZXQgPSBCYXNlUmVmZXJlbmNlRmFjZXQgJiB7XG5cdGhlYWRlckZvcm1EYXRhPzogSGVhZGVyRm9ybURhdGE7XG59O1xuXG50eXBlIERhdGFQb2ludEZhY2V0ID0gQmFzZVJlZmVyZW5jZUZhY2V0ICYge1xuXHRoZWFkZXJEYXRhUG9pbnREYXRhPzogSGVhZGVyRGF0YVBvaW50RGF0YTtcbn07XG5cbnR5cGUgUmVmZXJlbmNlRmFjZXQgPSBGaWVsZEdyb3VwRmFjZXQgfCBEYXRhUG9pbnRGYWNldDtcblxudHlwZSBDb2xsZWN0aW9uRmFjZXQgPSBCYXNlSGVhZGVyRmFjZXQgJiB7XG5cdGZhY2V0VHlwZTogRmFjZXRUeXBlLkNvbGxlY3Rpb247XG5cdGZhY2V0czogUmVmZXJlbmNlRmFjZXRbXTtcbn07XG5cbmV4cG9ydCB0eXBlIE9iamVjdFBhZ2VIZWFkZXJGYWNldCA9IFJlZmVyZW5jZUZhY2V0IHwgQ29sbGVjdGlvbkZhY2V0O1xuXG5leHBvcnQgdHlwZSBDdXN0b21PYmplY3RQYWdlSGVhZGVyRmFjZXQgPSBDdXN0b21FbGVtZW50PE9iamVjdFBhZ2VIZWFkZXJGYWNldD4gJiB7XG5cdGZyYWdtZW50TmFtZTogc3RyaW5nO1xuXHR0aXRsZT86IHN0cmluZztcblx0c3ViVGl0bGU/OiBzdHJpbmc7XG5cdHN0YXNoZWQ/OiBib29sZWFuO1xuXHRiaW5kaW5nPzogc3RyaW5nO1xufTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBDb2xsZWN0IEFsbCBIZWFkZXIgRmFjZXRzOiBDdXN0b20gKHZpYSBNYW5pZmVzdCkgYW5kIEFubm90YXRpb24gQmFzZWQgKHZpYSBNZXRhbW9kZWwpXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuLyoqXG4gKiBSZXRyaWV2ZSBoZWFkZXIgZmFjZXRzIGZyb20gYW5ub3RhdGlvbnMuXG4gKlxuICogQHBhcmFtIHtDb252ZXJ0ZXJDb250ZXh0fSBjb252ZXJ0ZXJDb250ZXh0IGZvciB0aGlzIG9iamVjdFxuICpcbiAqIEByZXR1cm5zIHtPYmplY3RQYWdlSGVhZGVyRmFjZXR9IGhlYWRlciBmYWNldHMgZnJvbSBhbm5vdGF0aW9uc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0SGVhZGVyRmFjZXRzRnJvbUFubm90YXRpb25zKGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQpOiBPYmplY3RQYWdlSGVhZGVyRmFjZXRbXSB7XG5cdGNvbnN0IGhlYWRlckZhY2V0czogT2JqZWN0UGFnZUhlYWRlckZhY2V0W10gPSBbXTtcblx0Y29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlKCkuYW5ub3RhdGlvbnM/LlVJPy5IZWFkZXJGYWNldHM/LmZvckVhY2goZmFjZXQgPT4ge1xuXHRcdGNvbnN0IGhlYWRlckZhY2V0OiBPYmplY3RQYWdlSGVhZGVyRmFjZXQgfCB1bmRlZmluZWQgPSBjcmVhdGVIZWFkZXJGYWNldChmYWNldCwgY29udmVydGVyQ29udGV4dCk7XG5cdFx0aWYgKGhlYWRlckZhY2V0KSB7XG5cdFx0XHRoZWFkZXJGYWNldHMucHVzaChoZWFkZXJGYWNldCk7XG5cdFx0fVxuXHR9KTtcblxuXHRyZXR1cm4gaGVhZGVyRmFjZXRzO1xufVxuXG4vKipcbiAqIFJldHJpZXZlIGN1c3RvbSBoZWFkZXIgZmFjZXRzIGZyb20gbWFuaWZlc3QuXG4gKlxuICogQHBhcmFtIHtDb25maWd1cmFibGVSZWNvcmQ8TWFuaWZlc3RIZWFkZXJGYWNldD59IG1hbmlmZXN0Q3VzdG9tSGVhZGVyRmFjZXRzIHNldHRpbmdzIGZvciB0aGlzIG9iamVjdFxuICpcbiAqIEByZXR1cm5zIHtSZWNvcmQ8c3RyaW5nLCBDdXN0b21PYmplY3RQYWdlSGVhZGVyRmFjZXQ+fSBoZWFkZXIgZmFjZXRzIGZyb20gbWFuaWZlc3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEhlYWRlckZhY2V0c0Zyb21NYW5pZmVzdChcblx0bWFuaWZlc3RDdXN0b21IZWFkZXJGYWNldHM6IENvbmZpZ3VyYWJsZVJlY29yZDxNYW5pZmVzdEhlYWRlckZhY2V0PlxuKTogUmVjb3JkPHN0cmluZywgQ3VzdG9tT2JqZWN0UGFnZUhlYWRlckZhY2V0PiB7XG5cdGNvbnN0IGN1c3RvbUhlYWRlckZhY2V0czogUmVjb3JkPHN0cmluZywgQ3VzdG9tT2JqZWN0UGFnZUhlYWRlckZhY2V0PiA9IHt9O1xuXG5cdE9iamVjdC5rZXlzKG1hbmlmZXN0Q3VzdG9tSGVhZGVyRmFjZXRzKS5mb3JFYWNoKG1hbmlmZXN0SGVhZGVyRmFjZXRLZXkgPT4ge1xuXHRcdGNvbnN0IGN1c3RvbUhlYWRlckZhY2V0OiBNYW5pZmVzdEhlYWRlckZhY2V0ID0gbWFuaWZlc3RDdXN0b21IZWFkZXJGYWNldHNbbWFuaWZlc3RIZWFkZXJGYWNldEtleV07XG5cdFx0Y3VzdG9tSGVhZGVyRmFjZXRzW21hbmlmZXN0SGVhZGVyRmFjZXRLZXldID0gY3JlYXRlQ3VzdG9tSGVhZGVyRmFjZXQoY3VzdG9tSGVhZGVyRmFjZXQsIG1hbmlmZXN0SGVhZGVyRmFjZXRLZXkpO1xuXHR9KTtcblxuXHRyZXR1cm4gY3VzdG9tSGVhZGVyRmFjZXRzO1xufVxuXG4vKipcbiAqIFJldHJpZXZlIGZsZXhpYmlsaXR5IGRlc2lnbnRpbWUgc2V0dGluZ3MgZnJvbSBtYW5pZmVzdC5cbiAqXG4gKiBAcGFyYW0ge0ZhY2V0VHlwZXN9IGZhY2V0RGVmaW5pdGlvbiBmYWNldCBkZWZpbml0aW9uXG4gKiBAcGFyYW0ge0ZhY2V0VHlwZXN9IGNvbGxlY3Rpb25GYWNldERlZmluaXRpb24gY29sbGVjdGlvbiBmYWNldCBkZWZpbml0aW9uXG4gKiBAcGFyYW0ge0NvbnZlcnRlckNvbnRleHR9IGNvbnZlcnRlckNvbnRleHQgc2V0dGluZ3MgZm9yIHRoaXMgb2JqZWN0XG4gKlxuICogQHJldHVybnMge0ZsZXhEZXNpZ25UaW1lVHlwZX0gZGVzaWdudGltZSBzZXR0aW5nIG9yIGRlZmF1bHRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldERlc2lnblRpbWVNZXRhZGF0YShcblx0ZmFjZXREZWZpbml0aW9uOiBGYWNldFR5cGVzLFxuXHRjb2xsZWN0aW9uRmFjZXREZWZpbml0aW9uOiBGYWNldFR5cGVzLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0XG4pOiBGbGV4RGVzaWduVGltZVR5cGUge1xuXHRsZXQgZGVzaWduVGltZU1ldGFkYXRhOiBGbGV4RGVzaWduVGltZVR5cGUgPSBGbGV4RGVzaWduVGltZVR5cGUuRGVmYXVsdDtcblx0Y29uc3QgaGVhZGVyRmFjZXRJRCA9IGZhY2V0RGVmaW5pdGlvbi5JRD8udG9TdHJpbmcoKSB8fCBcIlwiO1xuXG5cdC8vIEZvciBIZWFkZXJGYWNldHMgbmVzdGVkIGluc2lkZSBDb2xsZWN0aW9uRmFjZXQgUlRBIHNob3VsZCBiZSBkaXNhYmxlZCwgdGhlcmVmb3JlIHNldCB0byBcIm5vdC1hZGFwdGFibGUtdHJlZVwiXG5cdGlmIChcblx0XHRmYWNldERlZmluaXRpb24uJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLlJlZmVyZW5jZUZhY2V0ICYmXG5cdFx0Y29sbGVjdGlvbkZhY2V0RGVmaW5pdGlvbi4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuQ29sbGVjdGlvbkZhY2V0XG5cdCkge1xuXHRcdGRlc2lnblRpbWVNZXRhZGF0YSA9IEZsZXhEZXNpZ25UaW1lVHlwZS5Ob3RBZGFwdGFibGVUcmVlO1xuXHR9IGVsc2Uge1xuXHRcdGNvbnN0IGhlYWRlckZhY2V0c0NvbnRyb2xDb25maWcgPSBjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0Q29udHJvbENvbmZpZ3VyYXRpb24oXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuSGVhZGVyRmFjZXRzXCIpO1xuXHRcdGlmIChoZWFkZXJGYWNldElEKSB7XG5cdFx0XHRjb25zdCBkZXNpZ25UaW1lID0gaGVhZGVyRmFjZXRzQ29udHJvbENvbmZpZz8uZmFjZXRzPy5baGVhZGVyRmFjZXRJRF0/LmZsZXhTZXR0aW5ncz8uZGVzaWdudGltZTtcblx0XHRcdHN3aXRjaCAoZGVzaWduVGltZSkge1xuXHRcdFx0XHRjYXNlIEZsZXhEZXNpZ25UaW1lVHlwZS5Ob3RBZGFwdGFibGU6XG5cdFx0XHRcdGNhc2UgRmxleERlc2lnblRpbWVUeXBlLk5vdEFkYXB0YWJsZVRyZWU6XG5cdFx0XHRcdGNhc2UgRmxleERlc2lnblRpbWVUeXBlLk5vdEFkYXB0YWJsZVZpc2liaWxpdHk6XG5cdFx0XHRcdFx0ZGVzaWduVGltZU1ldGFkYXRhID0gZGVzaWduVGltZTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmV0dXJuIGRlc2lnblRpbWVNZXRhZGF0YTtcbn1cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBDb252ZXJ0ICYgQnVpbGQgQW5ub3RhdGlvbiBCYXNlZCBIZWFkZXIgRmFjZXRzXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbmZ1bmN0aW9uIGNyZWF0ZVJlZmVyZW5jZUhlYWRlckZhY2V0KFxuXHRmYWNldERlZmluaXRpb246IEZhY2V0VHlwZXMsXG5cdGNvbGxlY3Rpb25GYWNldERlZmluaXRpb246IEZhY2V0VHlwZXMsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHRcbik6IFJlZmVyZW5jZUZhY2V0IHwgdW5kZWZpbmVkIHtcblx0aWYgKGZhY2V0RGVmaW5pdGlvbi4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuUmVmZXJlbmNlRmFjZXQgJiYgIShmYWNldERlZmluaXRpb24uYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4/LnZhbHVlT2YoKSA9PT0gdHJ1ZSkpIHtcblx0XHRjb25zdCBoZWFkZXJGYWNldElEID0gSGVhZGVyRmFjZXRJRCh7IEZhY2V0OiBmYWNldERlZmluaXRpb24gfSksXG5cdFx0XHRnZXRIZWFkZXJGYWNldEtleSA9IChmYWNldERlZmluaXRpb246IEZhY2V0VHlwZXMsIGZhbGxiYWNrOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuXHRcdFx0XHRyZXR1cm4gZmFjZXREZWZpbml0aW9uLklEPy50b1N0cmluZygpIHx8IGZhY2V0RGVmaW5pdGlvbi5MYWJlbD8udG9TdHJpbmcoKSB8fCBmYWxsYmFjaztcblx0XHRcdH0sXG5cdFx0XHR0YXJnZXRBbm5vdGF0aW9uVmFsdWUgPSBmYWNldERlZmluaXRpb24uVGFyZ2V0LnZhbHVlLFxuXHRcdFx0dGFyZ2V0QW5ub3RhdGlvblR5cGUgPSBnZXRUYXJnZXRBbm5vdGF0aW9uVHlwZShmYWNldERlZmluaXRpb24pO1xuXG5cdFx0bGV0IGhlYWRlckZvcm1EYXRhOiBIZWFkZXJGb3JtRGF0YSB8IHVuZGVmaW5lZDtcblx0XHRsZXQgaGVhZGVyRGF0YVBvaW50RGF0YTogSGVhZGVyRGF0YVBvaW50RGF0YSB8IHVuZGVmaW5lZDtcblxuXHRcdHN3aXRjaCAodGFyZ2V0QW5ub3RhdGlvblR5cGUpIHtcblx0XHRcdGNhc2UgVGFyZ2V0QW5ub3RhdGlvblR5cGUuRmllbGRHcm91cDpcblx0XHRcdFx0aGVhZGVyRm9ybURhdGEgPSBnZXRGaWVsZEdyb3VwRm9ybURhdGEoZmFjZXREZWZpbml0aW9uLCBjb252ZXJ0ZXJDb250ZXh0KTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgVGFyZ2V0QW5ub3RhdGlvblR5cGUuRGF0YVBvaW50OlxuXHRcdFx0XHRoZWFkZXJEYXRhUG9pbnREYXRhID0gZ2V0RGF0YVBvaW50RGF0YShmYWNldERlZmluaXRpb24pO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdC8vIFRvRG86IEhhbmRsZSBvdGhlciBjYXNlc1xuXHRcdH1cblxuXHRcdGNvbnN0IHsgYW5ub3RhdGlvbnMgfSA9IGZhY2V0RGVmaW5pdGlvbjtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dHlwZTogSGVhZGVyRmFjZXRUeXBlLkFubm90YXRpb24sXG5cdFx0XHRmYWNldFR5cGU6IEZhY2V0VHlwZS5SZWZlcmVuY2UsXG5cdFx0XHRpZDogaGVhZGVyRmFjZXRJRCxcblx0XHRcdGNvbnRhaW5lcklkOiBIZWFkZXJGYWNldENvbnRhaW5lcklEKHsgRmFjZXQ6IGZhY2V0RGVmaW5pdGlvbiB9KSxcblx0XHRcdGtleTogZ2V0SGVhZGVyRmFjZXRLZXkoZmFjZXREZWZpbml0aW9uLCBoZWFkZXJGYWNldElEKSxcblx0XHRcdGZsZXhTZXR0aW5nczogeyBkZXNpZ250aW1lOiBnZXREZXNpZ25UaW1lTWV0YWRhdGEoZmFjZXREZWZpbml0aW9uLCBjb2xsZWN0aW9uRmFjZXREZWZpbml0aW9uLCBjb252ZXJ0ZXJDb250ZXh0KSB9LFxuXHRcdFx0dmlzaWJsZTogY29tcGlsZUJpbmRpbmcobm90KGVxdWFsKGFubm90YXRpb25FeHByZXNzaW9uKGFubm90YXRpb25zPy5VST8uSGlkZGVuPy52YWx1ZU9mKCkpLCB0cnVlKSkpLFxuXHRcdFx0YW5ub3RhdGlvblBhdGg6IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0QmFzZWRBbm5vdGF0aW9uUGF0aChmYWNldERlZmluaXRpb24uZnVsbHlRdWFsaWZpZWROYW1lKSArIFwiL1wiLFxuXHRcdFx0dGFyZ2V0QW5ub3RhdGlvblZhbHVlLFxuXHRcdFx0dGFyZ2V0QW5ub3RhdGlvblR5cGUsXG5cdFx0XHRoZWFkZXJGb3JtRGF0YSxcblx0XHRcdGhlYWRlckRhdGFQb2ludERhdGFcblx0XHR9O1xuXHR9XG5cblx0cmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlQ29sbGVjdGlvbkhlYWRlckZhY2V0KFxuXHRjb2xsZWN0aW9uRmFjZXREZWZpbml0aW9uOiBGYWNldFR5cGVzLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0XG4pOiBDb2xsZWN0aW9uRmFjZXQgfCB1bmRlZmluZWQge1xuXHRpZiAoY29sbGVjdGlvbkZhY2V0RGVmaW5pdGlvbi4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuQ29sbGVjdGlvbkZhY2V0KSB7XG5cdFx0Y29uc3QgZmFjZXRzOiBSZWZlcmVuY2VGYWNldFtdID0gW10sXG5cdFx0XHRoZWFkZXJGYWNldElEID0gSGVhZGVyRmFjZXRJRCh7IEZhY2V0OiBjb2xsZWN0aW9uRmFjZXREZWZpbml0aW9uIH0pLFxuXHRcdFx0Z2V0SGVhZGVyRmFjZXRLZXkgPSAoZmFjZXREZWZpbml0aW9uOiBGYWNldFR5cGVzLCBmYWxsYmFjazogc3RyaW5nKTogc3RyaW5nID0+IHtcblx0XHRcdFx0cmV0dXJuIGZhY2V0RGVmaW5pdGlvbi5JRD8udG9TdHJpbmcoKSB8fCBmYWNldERlZmluaXRpb24uTGFiZWw/LnRvU3RyaW5nKCkgfHwgZmFsbGJhY2s7XG5cdFx0XHR9O1xuXG5cdFx0Y29sbGVjdGlvbkZhY2V0RGVmaW5pdGlvbi5GYWNldHMuZm9yRWFjaChmYWNldERlZmluaXRpb24gPT4ge1xuXHRcdFx0Y29uc3QgZmFjZXQ6IFJlZmVyZW5jZUZhY2V0IHwgdW5kZWZpbmVkID0gY3JlYXRlUmVmZXJlbmNlSGVhZGVyRmFjZXQoXG5cdFx0XHRcdGZhY2V0RGVmaW5pdGlvbixcblx0XHRcdFx0Y29sbGVjdGlvbkZhY2V0RGVmaW5pdGlvbixcblx0XHRcdFx0Y29udmVydGVyQ29udGV4dFxuXHRcdFx0KTtcblx0XHRcdGlmIChmYWNldCkge1xuXHRcdFx0XHRmYWNldHMucHVzaChmYWNldCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dHlwZTogSGVhZGVyRmFjZXRUeXBlLkFubm90YXRpb24sXG5cdFx0XHRmYWNldFR5cGU6IEZhY2V0VHlwZS5Db2xsZWN0aW9uLFxuXHRcdFx0aWQ6IGhlYWRlckZhY2V0SUQsXG5cdFx0XHRjb250YWluZXJJZDogSGVhZGVyRmFjZXRDb250YWluZXJJRCh7IEZhY2V0OiBjb2xsZWN0aW9uRmFjZXREZWZpbml0aW9uIH0pLFxuXHRcdFx0a2V5OiBnZXRIZWFkZXJGYWNldEtleShjb2xsZWN0aW9uRmFjZXREZWZpbml0aW9uLCBoZWFkZXJGYWNldElEKSxcblx0XHRcdGZsZXhTZXR0aW5nczogeyBkZXNpZ250aW1lOiBnZXREZXNpZ25UaW1lTWV0YWRhdGEoY29sbGVjdGlvbkZhY2V0RGVmaW5pdGlvbiwgY29sbGVjdGlvbkZhY2V0RGVmaW5pdGlvbiwgY29udmVydGVyQ29udGV4dCkgfSxcblx0XHRcdHZpc2libGU6IGNvbXBpbGVCaW5kaW5nKG5vdChlcXVhbChhbm5vdGF0aW9uRXhwcmVzc2lvbihjb2xsZWN0aW9uRmFjZXREZWZpbml0aW9uLmFubm90YXRpb25zPy5VST8uSGlkZGVuPy52YWx1ZU9mKCkpLCB0cnVlKSkpLFxuXHRcdFx0YW5ub3RhdGlvblBhdGg6IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0QmFzZWRBbm5vdGF0aW9uUGF0aChjb2xsZWN0aW9uRmFjZXREZWZpbml0aW9uLmZ1bGx5UXVhbGlmaWVkTmFtZSkgKyBcIi9cIixcblx0XHRcdGZhY2V0c1xuXHRcdH07XG5cdH1cblxuXHRyZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBnZXRUYXJnZXRBbm5vdGF0aW9uVHlwZShmYWNldERlZmluaXRpb246IEZhY2V0VHlwZXMpOiBUYXJnZXRBbm5vdGF0aW9uVHlwZSB7XG5cdGxldCBhbm5vdGF0aW9uVHlwZSA9IFRhcmdldEFubm90YXRpb25UeXBlLk5vbmU7XG5cdGNvbnN0IGFubm90YXRpb25UeXBlTWFwOiBSZWNvcmQ8c3RyaW5nLCBUYXJnZXRBbm5vdGF0aW9uVHlwZT4gPSB7XG5cdFx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhUG9pbnRcIjogVGFyZ2V0QW5ub3RhdGlvblR5cGUuRGF0YVBvaW50LFxuXHRcdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuQ2hhcnRcIjogVGFyZ2V0QW5ub3RhdGlvblR5cGUuQ2hhcnQsXG5cdFx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5JZGVudGlmaWNhdGlvblwiOiBUYXJnZXRBbm5vdGF0aW9uVHlwZS5JZGVudGlmaWNhdGlvbixcblx0XHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW11bmljYXRpb24udjEuQ29udGFjdFwiOiBUYXJnZXRBbm5vdGF0aW9uVHlwZS5Db250YWN0LFxuXHRcdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbXVuaWNhdGlvbi52MS5BZGRyZXNzXCI6IFRhcmdldEFubm90YXRpb25UeXBlLkFkZHJlc3MsXG5cdFx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5GaWVsZEdyb3VwXCI6IFRhcmdldEFubm90YXRpb25UeXBlLkZpZWxkR3JvdXBcblx0fTtcblx0Ly8gUmVmZXJlbmNlVVJMRmFjZXQgYW5kIENvbGxlY3Rpb25GYWNldCBkbyBub3QgaGF2ZSBUYXJnZXQgcHJvcGVydHkuXG5cdGlmIChmYWNldERlZmluaXRpb24uJFR5cGUgIT09IFVJQW5ub3RhdGlvblR5cGVzLlJlZmVyZW5jZVVSTEZhY2V0ICYmIGZhY2V0RGVmaW5pdGlvbi4kVHlwZSAhPT0gVUlBbm5vdGF0aW9uVHlwZXMuQ29sbGVjdGlvbkZhY2V0KSB7XG5cdFx0YW5ub3RhdGlvblR5cGUgPSBhbm5vdGF0aW9uVHlwZU1hcFtmYWNldERlZmluaXRpb24uVGFyZ2V0Py4kdGFyZ2V0Py50ZXJtXSB8fCBUYXJnZXRBbm5vdGF0aW9uVHlwZS5Ob25lO1xuXHR9XG5cblx0cmV0dXJuIGFubm90YXRpb25UeXBlO1xufVxuXG5mdW5jdGlvbiBnZXRGaWVsZEdyb3VwRm9ybURhdGEoZmFjZXREZWZpbml0aW9uOiBSZWZlcmVuY2VGYWNldFR5cGVzLCBjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogSGVhZGVyRm9ybURhdGEge1xuXHQvLyBzcGxpdCBpbiB0aGlzIGZyb20gYW5ub3RhdGlvbiArIGdldEZpZWxkR3JvdXBGcm9tRGVmYXVsdFxuXHRpZiAoIWZhY2V0RGVmaW5pdGlvbikge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBnZXQgRmllbGRHcm91cCBmb3JtIGRhdGEgd2l0aG91dCBmYWNldCBkZWZpbml0aW9uXCIpO1xuXHR9XG5cblx0Y29uc3QgZm9ybUVsZW1lbnRzID0gaW5zZXJ0Q3VzdG9tRWxlbWVudHMoXG5cdFx0Z2V0Rm9ybUVsZW1lbnRzRnJvbUFubm90YXRpb25zKGZhY2V0RGVmaW5pdGlvbiwgY29udmVydGVyQ29udGV4dCksXG5cdFx0Z2V0Rm9ybUVsZW1lbnRzRnJvbU1hbmlmZXN0KGZhY2V0RGVmaW5pdGlvbiwgY29udmVydGVyQ29udGV4dClcblx0KTtcblxuXHRyZXR1cm4ge1xuXHRcdGlkOiBIZWFkZXJGYWNldEZvcm1JRCh7IEZhY2V0OiBmYWNldERlZmluaXRpb24gfSksXG5cdFx0bGFiZWw6IGZhY2V0RGVmaW5pdGlvbi5MYWJlbD8udG9TdHJpbmcoKSxcblx0XHRmb3JtRWxlbWVudHNcblx0fTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYW4gYXJyYXkgb2YgbWFuaWZlc3QgYmFzZWQgZm9ybUVsZW1lbnRzLlxuICpcbiAqIEBwYXJhbSB7RmFjZXRUeXBlfSBmYWNldERlZmluaXRpb24gZm9yIHRoaXMgb2JqZWN0XG4gKiBAcGFyYW0ge0NvbnZlcnRlckNvbnRleHR9IGNvbnZlcnRlckNvbnRleHQgZm9yIHRoaXMgb2JqZWN0XG4gKlxuICogQHJldHVybnMge0FycmF5fSBBbm5vdGF0aW9uIGJhc2VkIEZvcm1FbGVtZW50c1xuICovXG5mdW5jdGlvbiBnZXRGb3JtRWxlbWVudHNGcm9tQW5ub3RhdGlvbnMoZmFjZXREZWZpbml0aW9uOiBGYWNldFR5cGVzLCBjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogQW5ub3RhdGlvbkZvcm1FbGVtZW50W10ge1xuXHRjb25zdCBhbm5vdGF0aW9uQmFzZWRGb3JtRWxlbWVudHM6IEFubm90YXRpb25Gb3JtRWxlbWVudFtdID0gW107XG5cblx0Ly8gUmVmZXJlbmNlVVJMRmFjZXQgYW5kIENvbGxlY3Rpb25GYWNldCBkbyBub3QgaGF2ZSBUYXJnZXQgcHJvcGVydHkuXG5cdGlmIChmYWNldERlZmluaXRpb24uJFR5cGUgIT09IFVJQW5ub3RhdGlvblR5cGVzLlJlZmVyZW5jZVVSTEZhY2V0ICYmIGZhY2V0RGVmaW5pdGlvbi4kVHlwZSAhPT0gVUlBbm5vdGF0aW9uVHlwZXMuQ29sbGVjdGlvbkZhY2V0KSB7XG5cdFx0ZmFjZXREZWZpbml0aW9uLlRhcmdldD8uJHRhcmdldD8uRGF0YS5mb3JFYWNoKChkYXRhRmllbGQ6IERhdGFGaWVsZEFic3RyYWN0VHlwZXMpID0+IHtcblx0XHRcdGlmICghKGRhdGFGaWVsZC5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbj8udmFsdWVPZigpID09PSB0cnVlKSkge1xuXHRcdFx0XHRjb25zdCBzZW1hbnRpY09iamVjdEFubm90YXRpb25QYXRoID0gZ2V0U2VtYW50aWNPYmplY3RQYXRoKGNvbnZlcnRlckNvbnRleHQsIGRhdGFGaWVsZCk7XG5cdFx0XHRcdGlmIChkYXRhRmllbGQuJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZCkge1xuXHRcdFx0XHRcdGNvbnN0IHsgYW5ub3RhdGlvbnMgfSA9IGRhdGFGaWVsZDtcblx0XHRcdFx0XHRhbm5vdGF0aW9uQmFzZWRGb3JtRWxlbWVudHMucHVzaCh7XG5cdFx0XHRcdFx0XHRpc1ZhbHVlTXVsdGlsaW5lVGV4dDogZGF0YUZpZWxkLlZhbHVlPy4kdGFyZ2V0Py5hbm5vdGF0aW9ucz8uVUk/Lk11bHRpTGluZVRleHQ/LnZhbHVlT2YoKSA9PT0gdHJ1ZSxcblx0XHRcdFx0XHRcdHR5cGU6IEZvcm1FbGVtZW50VHlwZS5Bbm5vdGF0aW9uLFxuXHRcdFx0XHRcdFx0a2V5OiBLZXlIZWxwZXIuZ2VuZXJhdGVLZXlGcm9tRGF0YUZpZWxkKGRhdGFGaWVsZCksXG5cdFx0XHRcdFx0XHR2aXNpYmxlOiBjb21waWxlQmluZGluZyhub3QoZXF1YWwoYW5ub3RhdGlvbkV4cHJlc3Npb24oYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4/LnZhbHVlT2YoKSksIHRydWUpKSksXG5cdFx0XHRcdFx0XHRsYWJlbDogZGF0YUZpZWxkLlZhbHVlPy4kdGFyZ2V0Py5hbm5vdGF0aW9ucz8uQ29tbW9uPy5MYWJlbCB8fCBkYXRhRmllbGQuTGFiZWwsXG5cdFx0XHRcdFx0XHRpZFByZWZpeDogSGVhZGVyRmFjZXRGb3JtSUQoeyBGYWNldDogZmFjZXREZWZpbml0aW9uIH0sIGRhdGFGaWVsZCksXG5cdFx0XHRcdFx0XHRhbm5vdGF0aW9uUGF0aDogY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoKGRhdGFGaWVsZC5mdWxseVF1YWxpZmllZE5hbWUpICsgXCIvXCIsXG5cdFx0XHRcdFx0XHRzZW1hbnRpY09iamVjdFBhdGg6IHNlbWFudGljT2JqZWN0QW5ub3RhdGlvblBhdGhcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSBlbHNlIGlmIChkYXRhRmllbGQuJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZEZvckFubm90YXRpb24pIHtcblx0XHRcdFx0XHRjb25zdCB7IGFubm90YXRpb25zIH0gPSBkYXRhRmllbGQ7XG5cdFx0XHRcdFx0YW5ub3RhdGlvbkJhc2VkRm9ybUVsZW1lbnRzLnB1c2goe1xuXHRcdFx0XHRcdFx0aXNWYWx1ZU11bHRpbGluZVRleHQ6IGRhdGFGaWVsZC5UYXJnZXQ/LiR0YXJnZXQ/LmFubm90YXRpb25zPy5VST8uTXVsdGlMaW5lVGV4dD8udmFsdWVPZigpID09PSB0cnVlLFxuXHRcdFx0XHRcdFx0dHlwZTogRm9ybUVsZW1lbnRUeXBlLkFubm90YXRpb24sXG5cdFx0XHRcdFx0XHRrZXk6IEtleUhlbHBlci5nZW5lcmF0ZUtleUZyb21EYXRhRmllbGQoZGF0YUZpZWxkKSxcblx0XHRcdFx0XHRcdHZpc2libGU6IGNvbXBpbGVCaW5kaW5nKG5vdChlcXVhbChhbm5vdGF0aW9uRXhwcmVzc2lvbihhbm5vdGF0aW9ucz8uVUk/LkhpZGRlbj8udmFsdWVPZigpKSwgdHJ1ZSkpKSxcblx0XHRcdFx0XHRcdGxhYmVsOiBkYXRhRmllbGQuVGFyZ2V0Py4kdGFyZ2V0Py5hbm5vdGF0aW9ucz8uQ29tbW9uPy5MYWJlbCB8fCBkYXRhRmllbGQuTGFiZWwsXG5cdFx0XHRcdFx0XHRpZFByZWZpeDogSGVhZGVyRmFjZXRGb3JtSUQoeyBGYWNldDogZmFjZXREZWZpbml0aW9uIH0sIGRhdGFGaWVsZCksXG5cdFx0XHRcdFx0XHRhbm5vdGF0aW9uUGF0aDogY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoKGRhdGFGaWVsZC5mdWxseVF1YWxpZmllZE5hbWUpICsgXCIvXCIsXG5cdFx0XHRcdFx0XHRzZW1hbnRpY09iamVjdFBhdGg6IHNlbWFudGljT2JqZWN0QW5ub3RhdGlvblBhdGhcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0cmV0dXJuIGFubm90YXRpb25CYXNlZEZvcm1FbGVtZW50cztcbn1cblxuZnVuY3Rpb24gZ2V0RGF0YVBvaW50RGF0YShmYWNldERlZmluaXRpb246IEZhY2V0VHlwZXMpOiBIZWFkZXJEYXRhUG9pbnREYXRhIHtcblx0bGV0IHR5cGUgPSBIZWFkZXJEYXRhUG9pbnRUeXBlLkNvbnRlbnQ7XG5cdGlmIChmYWNldERlZmluaXRpb24uJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLlJlZmVyZW5jZUZhY2V0KSB7XG5cdFx0aWYgKGZhY2V0RGVmaW5pdGlvbi5UYXJnZXQ/LiR0YXJnZXQ/LlZpc3VhbGl6YXRpb24gPT09IFwiVUkuVmlzdWFsaXphdGlvblR5cGUvUHJvZ3Jlc3NcIikge1xuXHRcdFx0dHlwZSA9IEhlYWRlckRhdGFQb2ludFR5cGUuUHJvZ3Jlc3NJbmRpY2F0b3I7XG5cdFx0fSBlbHNlIGlmIChmYWNldERlZmluaXRpb24uVGFyZ2V0Py4kdGFyZ2V0Py5WaXN1YWxpemF0aW9uID09PSBcIlVJLlZpc3VhbGl6YXRpb25UeXBlL1JhdGluZ1wiKSB7XG5cdFx0XHR0eXBlID0gSGVhZGVyRGF0YVBvaW50VHlwZS5SYXRpbmdJbmRpY2F0b3I7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHsgdHlwZSB9O1xufVxuXG4vKipcbiAqIENyZWF0ZSBhbiBhbm5vdGF0aW9uIGJhc2VkIGhlYWRlciBmYWNldC5cbiAqXG4gKiBAcGFyYW0ge0ZhY2V0VHlwZXN9IGZhY2V0RGVmaW5pdGlvbiBvZiB0aGlzIG9iamVjdFxuICogQHBhcmFtIHtDb252ZXJ0ZXJDb250ZXh0fSBjb252ZXJ0ZXJDb250ZXh0IGZvciB0aGlzIG9iamVjdFxuICpcbiAqIEByZXR1cm5zIHtPYmplY3RQYWdlSGVhZGVyRmFjZXR9IEFubm90YXRpb24gYmFzZWQgaGVhZGVyIGZhY2V0IGNyZWF0ZWRcbiAqL1xuZnVuY3Rpb24gY3JlYXRlSGVhZGVyRmFjZXQoZmFjZXREZWZpbml0aW9uOiBGYWNldFR5cGVzLCBjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogT2JqZWN0UGFnZUhlYWRlckZhY2V0IHwgdW5kZWZpbmVkIHtcblx0bGV0IGhlYWRlckZhY2V0OiBPYmplY3RQYWdlSGVhZGVyRmFjZXQgfCB1bmRlZmluZWQ7XG5cdHN3aXRjaCAoZmFjZXREZWZpbml0aW9uLiRUeXBlKSB7XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5SZWZlcmVuY2VGYWNldDpcblx0XHRcdGhlYWRlckZhY2V0ID0gY3JlYXRlUmVmZXJlbmNlSGVhZGVyRmFjZXQoZmFjZXREZWZpbml0aW9uLCBmYWNldERlZmluaXRpb24sIGNvbnZlcnRlckNvbnRleHQpO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkNvbGxlY3Rpb25GYWNldDpcblx0XHRcdGhlYWRlckZhY2V0ID0gY3JlYXRlQ29sbGVjdGlvbkhlYWRlckZhY2V0KGZhY2V0RGVmaW5pdGlvbiwgY29udmVydGVyQ29udGV4dCk7XG5cdFx0XHRicmVhaztcblx0fVxuXG5cdHJldHVybiBoZWFkZXJGYWNldDtcbn1cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBDb252ZXJ0ICYgQnVpbGQgTWFuaWZlc3QgQmFzZWQgSGVhZGVyIEZhY2V0c1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbmZ1bmN0aW9uIGdlbmVyYXRlQmluZGluZyhyZXF1ZXN0R3JvdXBJZD86IHN0cmluZyk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG5cdGlmICghcmVxdWVzdEdyb3VwSWQpIHtcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG5cdGNvbnN0IGdyb3VwSWQgPVxuXHRcdFtcIkhlcm9lc1wiLCBcIkRlY29yYXRpb25cIiwgXCJXb3JrZXJzXCIsIFwiTG9uZ1J1bm5lcnNcIl0uaW5kZXhPZihyZXF1ZXN0R3JvdXBJZCkgIT09IC0xID8gXCIkYXV0by5cIiArIHJlcXVlc3RHcm91cElkIDogcmVxdWVzdEdyb3VwSWQ7XG5cblx0cmV0dXJuIFwieyBwYXRoIDogJycsIHBhcmFtZXRlcnMgOiB7ICQkZ3JvdXBJZCA6ICdcIiArIGdyb3VwSWQgKyBcIicgfSB9XCI7XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgbWFuaWZlc3QgYmFzZWQgY3VzdG9tIGhlYWRlciBmYWNldC5cbiAqXG4gKiBAcGFyYW0ge01hbmlmZXN0SGVhZGVyRmFjZXR9IGN1c3RvbUhlYWRlckZhY2V0RGVmaW5pdGlvbiBmb3IgdGhpcyBvYmplY3RcbiAqIEBwYXJhbSB7c3RyaW5nfSBoZWFkZXJGYWNldEtleSBvZiB0aGlzIG9iamVjdFxuICpcbiAqIEByZXR1cm5zIHtDdXN0b21PYmplY3RQYWdlSGVhZGVyRmFjZXR9IG1hbmlmZXN0IGJhc2VkIGN1c3RvbSBoZWFkZXIgZmFjZXQgY3JlYXRlZFxuICovXG5mdW5jdGlvbiBjcmVhdGVDdXN0b21IZWFkZXJGYWNldChjdXN0b21IZWFkZXJGYWNldERlZmluaXRpb246IE1hbmlmZXN0SGVhZGVyRmFjZXQsIGhlYWRlckZhY2V0S2V5OiBzdHJpbmcpOiBDdXN0b21PYmplY3RQYWdlSGVhZGVyRmFjZXQge1xuXHRjb25zdCBjdXN0b21IZWFkZXJGYWNldElEID0gQ3VzdG9tSGVhZGVyRmFjZXRJRChoZWFkZXJGYWNldEtleSk7XG5cblx0bGV0IHBvc2l0aW9uOiBQb3NpdGlvbiB8IHVuZGVmaW5lZCA9IGN1c3RvbUhlYWRlckZhY2V0RGVmaW5pdGlvbi5wb3NpdGlvbjtcblx0aWYgKCFwb3NpdGlvbikge1xuXHRcdHBvc2l0aW9uID0ge1xuXHRcdFx0cGxhY2VtZW50OiBQbGFjZW1lbnQuQWZ0ZXJcblx0XHR9O1xuXHR9XG5cdHJldHVybiB7XG5cdFx0ZmFjZXRUeXBlOiBGYWNldFR5cGUuUmVmZXJlbmNlLFxuXHRcdGZhY2V0czogW10sXG5cdFx0dHlwZTogY3VzdG9tSGVhZGVyRmFjZXREZWZpbml0aW9uLnR5cGUsXG5cdFx0aWQ6IGN1c3RvbUhlYWRlckZhY2V0SUQsXG5cdFx0Y29udGFpbmVySWQ6IGN1c3RvbUhlYWRlckZhY2V0SUQsXG5cdFx0a2V5OiBoZWFkZXJGYWNldEtleSxcblx0XHRwb3NpdGlvbjogcG9zaXRpb24sXG5cdFx0dmlzaWJsZTogY3VzdG9tSGVhZGVyRmFjZXREZWZpbml0aW9uLnZpc2libGUsXG5cdFx0ZnJhZ21lbnROYW1lOiBjdXN0b21IZWFkZXJGYWNldERlZmluaXRpb24ubmFtZSxcblx0XHR0aXRsZTogY3VzdG9tSGVhZGVyRmFjZXREZWZpbml0aW9uLnRpdGxlLFxuXHRcdHN1YlRpdGxlOiBjdXN0b21IZWFkZXJGYWNldERlZmluaXRpb24uc3ViVGl0bGUsXG5cdFx0c3Rhc2hlZDogY3VzdG9tSGVhZGVyRmFjZXREZWZpbml0aW9uLnN0YXNoZWQgfHwgZmFsc2UsXG5cdFx0ZmxleFNldHRpbmdzOiB7IC4uLnsgZGVzaWdudGltZTogRmxleERlc2lnblRpbWVUeXBlLkRlZmF1bHQgfSwgLi4uY3VzdG9tSGVhZGVyRmFjZXREZWZpbml0aW9uLmZsZXhTZXR0aW5ncyB9LFxuXHRcdGJpbmRpbmc6IGdlbmVyYXRlQmluZGluZyhjdXN0b21IZWFkZXJGYWNldERlZmluaXRpb24ucmVxdWVzdEdyb3VwSWQpXG5cdH07XG59XG4iXX0=