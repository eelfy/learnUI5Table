sap.ui.define(["../../ManifestSettings", "../../helpers/ID", "../Common/Form", "../Common/DataVisualization", "../../helpers/ConfigurableObject", "sap/fe/core/converters/controls/Common/Action", "sap/fe/core/converters/helpers/Key", "sap/fe/core/helpers/BindingExpression", "sap/fe/core/converters/helpers/IssueManager", "sap/fe/core/converters/controls/ObjectPage/HeaderFacet", "../../objectPage/FormMenuActions"], function (ManifestSettings, ID, Form, DataVisualization, ConfigurableObject, Action, Key, BindingExpression, IssueManager, HeaderFacet, FormMenuActions) {
  "use strict";

  var _exports = {};
  var getFormActions = FormMenuActions.getFormActions;
  var getFormHiddenActions = FormMenuActions.getFormHiddenActions;
  var getVisibilityEnablementFormMenuActions = FormMenuActions.getVisibilityEnablementFormMenuActions;
  var getDesignTimeMetadata = HeaderFacet.getDesignTimeMetadata;
  var IssueCategory = IssueManager.IssueCategory;
  var IssueSeverity = IssueManager.IssueSeverity;
  var IssueType = IssueManager.IssueType;
  var ref = BindingExpression.ref;
  var not = BindingExpression.not;
  var fn = BindingExpression.fn;
  var equal = BindingExpression.equal;
  var compileBinding = BindingExpression.compileBinding;
  var bindingExpression = BindingExpression.bindingExpression;
  var annotationExpression = BindingExpression.annotationExpression;
  var KeyHelper = Key.KeyHelper;
  var removeDuplicateActions = Action.removeDuplicateActions;
  var getSemanticObjectMapping = Action.getSemanticObjectMapping;
  var ButtonType = Action.ButtonType;
  var isActionNavigable = Action.isActionNavigable;
  var getEnabledBinding = Action.getEnabledBinding;
  var getActionsFromManifest = Action.getActionsFromManifest;
  var Placement = ConfigurableObject.Placement;
  var insertCustomElements = ConfigurableObject.insertCustomElements;
  var getDataVisualizationConfiguration = DataVisualization.getDataVisualizationConfiguration;
  var isReferenceFacet = Form.isReferenceFacet;
  var createFormDefinition = Form.createFormDefinition;
  var SideContentID = ID.SideContentID;
  var SubSectionID = ID.SubSectionID;
  var FormID = ID.FormID;
  var CustomSubSectionID = ID.CustomSubSectionID;
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

  var SubSectionType;

  (function (SubSectionType) {
    SubSectionType["Unknown"] = "Unknown";
    SubSectionType["Form"] = "Form";
    SubSectionType["DataVisualization"] = "DataVisualization";
    SubSectionType["XMLFragment"] = "XMLFragment";
    SubSectionType["Placeholder"] = "Placeholder";
    SubSectionType["Mixed"] = "Mixed";
  })(SubSectionType || (SubSectionType = {}));

  _exports.SubSectionType = SubSectionType;
  var targetTerms = ["com.sap.vocabularies.UI.v1.LineItem", "com.sap.vocabularies.UI.v1.PresentationVariant", "com.sap.vocabularies.UI.v1.SelectionPresentationVariant"]; // TODO: Need to handle Table case inside createSubSection function if CollectionFacet has Table ReferenceFacet

  var hasTable = function () {
    var facets = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return facets.some(function (facetType) {
      var _facetType$Target, _facetType$Target$$ta;

      return targetTerms.indexOf(facetType === null || facetType === void 0 ? void 0 : (_facetType$Target = facetType.Target) === null || _facetType$Target === void 0 ? void 0 : (_facetType$Target$$ta = _facetType$Target.$target) === null || _facetType$Target$$ta === void 0 ? void 0 : _facetType$Target$$ta.term) > -1;
    });
  };
  /**
   * Create subsections based on facet definition.
   *
   * @param facetCollection
   * @param converterContext
   * @returns {ObjectPageSubSection[]} the current subections
   */


  function createSubSections(facetCollection, converterContext) {
    // First we determine which sub section we need to create
    var facetsToCreate = facetCollection.reduce(function (facetsToCreate, facetDefinition) {
      switch (facetDefinition.$Type) {
        case "com.sap.vocabularies.UI.v1.ReferenceFacet":
          facetsToCreate.push(facetDefinition);
          break;

        case "com.sap.vocabularies.UI.v1.CollectionFacet":
          // TODO If the Collection Facet has a child of type Collection Facet we bring them up one level (Form + Table use case) ?
          // first case facet Collection is combination of collection and reference facet or not all facets are reference facets.
          if (facetDefinition.Facets.find(function (facetType) {
            return facetType.$Type === "com.sap.vocabularies.UI.v1.CollectionFacet";
          })) {
            facetsToCreate.splice.apply(facetsToCreate, [facetsToCreate.length, 0].concat(_toConsumableArray(facetDefinition.Facets)));
          } else {
            facetsToCreate.push(facetDefinition);
          }

          break;

        case "com.sap.vocabularies.UI.v1.ReferenceURLFacet":
          // Not supported
          break;
      }

      return facetsToCreate;
    }, []); // Then we create the actual subsections

    return facetsToCreate.map(function (facet) {
      var _ref, _ref$Facets;

      return createSubSection(facet, facetsToCreate, converterContext, 0, !((_ref = facet) === null || _ref === void 0 ? void 0 : (_ref$Facets = _ref.Facets) === null || _ref$Facets === void 0 ? void 0 : _ref$Facets.length));
    });
  } // function isTargetForCompliant(annotationPath: AnnotationPath) {
  // 	return /.*com\.sap\.vocabularies\.UI\.v1\.(FieldGroup|Identification|DataPoint|StatusInfo).*/.test(annotationPath.value);
  // }


  _exports.createSubSections = createSubSections;

  var getSubSectionKey = function (facetDefinition, fallback) {
    var _facetDefinition$ID, _facetDefinition$Labe;

    return ((_facetDefinition$ID = facetDefinition.ID) === null || _facetDefinition$ID === void 0 ? void 0 : _facetDefinition$ID.toString()) || ((_facetDefinition$Labe = facetDefinition.Label) === null || _facetDefinition$Labe === void 0 ? void 0 : _facetDefinition$Labe.toString()) || fallback;
  };
  /**
   * Add Form menu action to all form actios, remove duplicate action and hidden actions.
   * @param actions
   * @param facetDefinition
   * @param converterContext
   * @returns {BaseAction[] | ConverterAction[]}
   */


  function addFormMenuActions(actions, facetDefinition, converterContext) {
    var hiddenActions = getFormHiddenActions(facetDefinition, converterContext) || [],
        formActions = getFormActions(facetDefinition, converterContext),
        formAllActions = insertCustomElements(actions, getActionsFromManifest(formActions, converterContext, actions, undefined, undefined, hiddenActions));
    return formAllActions ? getVisibilityEnablementFormMenuActions(removeDuplicateActions(formAllActions)) : actions;
  }
  /**
   * Retrieves the action form a facet.
   * @param facetDefinition
   * @param converterContext
   * @returns {ConverterAction[] | BaseAction[]} the current facet actions
   */


  function getFacetActions(facetDefinition, converterContext) {
    var actions = new Array();

    switch (facetDefinition.$Type) {
      case "com.sap.vocabularies.UI.v1.CollectionFacet":
        actions = facetDefinition.Facets.filter(function (facetDefinition) {
          return isReferenceFacet(facetDefinition);
        }).reduce(function (actions, facetDefinition) {
          return createFormActionReducer(actions, facetDefinition, converterContext);
        }, []);
        break;

      case "com.sap.vocabularies.UI.v1.ReferenceFacet":
        actions = createFormActionReducer([], facetDefinition, converterContext);
        break;
    }

    return addFormMenuActions(actions, facetDefinition, converterContext);
  }
  /**
   * Retruns the button type based on @UI.Emphasized annotation.
   * @param Emphasized Emphasized annotation value.
   * @returns {ButtonType | string} returns button type or path based expression.
   */


  function getButtonType(Emphasized) {
    var PathForButtonType = Emphasized === null || Emphasized === void 0 ? void 0 : Emphasized.path;

    if (PathForButtonType) {
      return "{= " + "!${" + PathForButtonType + "} ? '" + ButtonType.Transparent + "' : ${" + PathForButtonType + "}" + "}";
    } else if (Emphasized) {
      return ButtonType.Ghost;
    }

    return ButtonType.Transparent;
  }
  /**
   * Create a subsection based on a FacetTypes.
   * @param facetDefinition
   * @param facetsToCreate
   * @param converterContext
   * @param level
   * @param hasSingleContent
   * @returns {ObjectPageSubSection} one sub section definition
   */


  function createSubSection(facetDefinition, facetsToCreate, converterContext, level, hasSingleContent) {
    var _facetDefinition$anno, _facetDefinition$anno2, _ref2, _ref2$annotation, _ref3;

    var subSectionID = SubSectionID({
      Facet: facetDefinition
    });
    var subSection = {
      id: subSectionID,
      key: getSubSectionKey(facetDefinition, subSectionID),
      title: compileBinding(annotationExpression(facetDefinition.Label)),
      type: SubSectionType.Unknown,
      annotationPath: converterContext.getEntitySetBasedAnnotationPath(facetDefinition.fullyQualifiedName),
      visible: compileBinding(not(equal(annotationExpression((_facetDefinition$anno = facetDefinition.annotations) === null || _facetDefinition$anno === void 0 ? void 0 : (_facetDefinition$anno2 = _facetDefinition$anno.UI) === null || _facetDefinition$anno2 === void 0 ? void 0 : _facetDefinition$anno2.Hidden), true))),
      flexSettings: {
        designtime: getDesignTimeMetadata(facetDefinition, facetDefinition, converterContext)
      },
      level: level,
      sideContent: undefined
    };
    var content = [];
    var tableContent = [];
    var index = [];
    var unsupportedText = "";
    level++;

    switch (facetDefinition.$Type) {
      case "com.sap.vocabularies.UI.v1.CollectionFacet":
        var facets = facetDefinition.Facets;

        if (hasTable(facets)) {
          // if we have tables in a collection facet then we create separate subsection for them
          for (var i = 0; i < facets.length; i++) {
            var _Target, _Target$$target;

            if (targetTerms.indexOf((_Target = facets[i].Target) === null || _Target === void 0 ? void 0 : (_Target$$target = _Target.$target) === null || _Target$$target === void 0 ? void 0 : _Target$$target.term) > -1) {
              //creating separate array for tables
              tableContent.push(createSubSection(facets[i], [], converterContext, level, facets.length === 1));
              index.push(i);
            }
          }

          for (var _i = index.length - 1; _i >= 0; _i--) {
            //remove table facets from facet definition
            facets.splice(index[_i], 1);
          }

          if (facets.length) {
            facetDefinition.Facets = facets; //create a form subsection from the remaining facets

            content.push(createSubSection(facetDefinition, [], converterContext, level, hasSingleContent));
          }

          content = content.concat(tableContent);

          var mixedSubSection = _objectSpread({}, subSection, {
            type: SubSectionType.Mixed,
            level: level,
            content: content
          });

          return mixedSubSection;
        } else {
          var formCollectionSubSection = _objectSpread({}, subSection, {
            type: SubSectionType.Form,
            formDefinition: createFormDefinition(facetDefinition, converterContext),
            level: level,
            actions: getFacetActions(facetDefinition, converterContext)
          });

          return formCollectionSubSection;
        }

      case "com.sap.vocabularies.UI.v1.ReferenceFacet":
        if (!facetDefinition.Target.$target) {
          unsupportedText = "Unable to find annotationPath ".concat(facetDefinition.Target.value);
        } else {
          switch (facetDefinition.Target.$target.term) {
            case "com.sap.vocabularies.UI.v1.LineItem":
            case "com.sap.vocabularies.UI.v1.Chart":
            case "com.sap.vocabularies.UI.v1.PresentationVariant":
            case "com.sap.vocabularies.UI.v1.SelectionPresentationVariant":
              var presentation = getDataVisualizationConfiguration(facetDefinition.Target.value, getCondensedTableLayoutCompliance(facetDefinition, facetsToCreate, converterContext), converterContext);
              var controlTitle = (_ref2 = presentation.visualizations[0]) === null || _ref2 === void 0 ? void 0 : (_ref2$annotation = _ref2.annotation) === null || _ref2$annotation === void 0 ? void 0 : _ref2$annotation.title;
              controlTitle ? controlTitle : controlTitle = (_ref3 = presentation.visualizations[0]) === null || _ref3 === void 0 ? void 0 : _ref3.title;

              var dataVisualizationSubSection = _objectSpread({}, subSection, {
                type: SubSectionType.DataVisualization,
                level: level,
                presentation: presentation,
                showTitle: isSubsectionTitleShown(hasSingleContent, subSection.title, controlTitle)
              });

              return dataVisualizationSubSection;

            case "com.sap.vocabularies.UI.v1.FieldGroup":
            case "com.sap.vocabularies.UI.v1.Identification":
            case "com.sap.vocabularies.UI.v1.DataPoint":
            case "com.sap.vocabularies.UI.v1.StatusInfo":
            case "com.sap.vocabularies.Communication.v1.Contact":
              // All those element belong to a form facet
              var formElementSubSection = _objectSpread({}, subSection, {
                type: SubSectionType.Form,
                level: level,
                formDefinition: createFormDefinition(facetDefinition, converterContext),
                actions: getFacetActions(facetDefinition, converterContext)
              });

              return formElementSubSection;

            default:
              unsupportedText = "For ".concat(facetDefinition.Target.$target.term, " Fragment");
              break;
          }
        }

        break;

      case "com.sap.vocabularies.UI.v1.ReferenceURLFacet":
        unsupportedText = "For Reference URL Facet";
        break;

      default:
        break;
    } // If we reach here we ended up with an unsupported SubSection type


    var unsupportedSubSection = _objectSpread({}, subSection, {
      text: unsupportedText
    });

    return unsupportedSubSection;
  }

  _exports.createSubSection = createSubSection;

  function isSubsectionTitleShown(hasSingleContent, subSectionTitle, controlTitle) {
    if (hasSingleContent && controlTitle === subSectionTitle) {
      return false;
    }

    return true;
  }

  function createFormActionReducer(actions, facetDefinition, converterContext) {
    var referenceTarget = facetDefinition.Target.$target;
    var targetValue = facetDefinition.Target.value;
    var manifestActions = {};
    var dataFieldCollection = [];

    var _targetValue$split = targetValue.split("@"),
        _targetValue$split2 = _slicedToArray(_targetValue$split, 1),
        navigationPropertyPath = _targetValue$split2[0];

    if (navigationPropertyPath.length > 0) {
      if (navigationPropertyPath.lastIndexOf("/") === navigationPropertyPath.length - 1) {
        navigationPropertyPath = navigationPropertyPath.substr(0, navigationPropertyPath.length - 1);
      }
    } else {
      navigationPropertyPath = undefined;
    }

    if (referenceTarget) {
      switch (referenceTarget.term) {
        case "com.sap.vocabularies.UI.v1.FieldGroup":
          dataFieldCollection = referenceTarget.Data;
          manifestActions = getActionsFromManifest(converterContext.getManifestControlConfiguration(referenceTarget).actions, converterContext);
          break;

        case "com.sap.vocabularies.UI.v1.Identification":
        case "com.sap.vocabularies.UI.v1.StatusInfo":
          if (referenceTarget.qualifier) {
            dataFieldCollection = referenceTarget;
          }

          break;
      }
    }

    return dataFieldCollection.reduce(function (actions, dataField) {
      var _dataField$annotation, _dataField$RequiresCo, _dataField$Inline, _dataField$Label, _dataField$Navigation, _dataField$annotation2, _dataField$annotation3, _dataField$annotation4, _dataField$Label2, _dataField$annotation5, _dataField$annotation6, _dataField$annotation7;

      var UIAnnotation = dataField === null || dataField === void 0 ? void 0 : (_dataField$annotation = dataField.annotations) === null || _dataField$annotation === void 0 ? void 0 : _dataField$annotation.UI;

      switch (dataField.$Type) {
        case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
          if (((_dataField$RequiresCo = dataField.RequiresContext) === null || _dataField$RequiresCo === void 0 ? void 0 : _dataField$RequiresCo.valueOf()) === true) {
            converterContext.getDiagnostics().addIssue(IssueCategory.Annotation, IssueSeverity.Low, IssueType.MALFORMED_DATAFIELD_FOR_IBN.REQUIRESCONTEXT);
          }

          if (((_dataField$Inline = dataField.Inline) === null || _dataField$Inline === void 0 ? void 0 : _dataField$Inline.valueOf()) === true) {
            converterContext.getDiagnostics().addIssue(IssueCategory.Annotation, IssueSeverity.Low, IssueType.MALFORMED_DATAFIELD_FOR_IBN.INLINE);
          }

          var mNavigationParameters = {};

          if (dataField.Mapping) {
            mNavigationParameters.semanticObjectMapping = getSemanticObjectMapping(dataField.Mapping);
          }

          actions.push({
            type: ActionType.DataFieldForIntentBasedNavigation,
            id: FormID({
              Facet: facetDefinition
            }, dataField),
            key: KeyHelper.generateKeyFromDataField(dataField),
            text: (_dataField$Label = dataField.Label) === null || _dataField$Label === void 0 ? void 0 : _dataField$Label.toString(),
            annotationPath: "",
            enabled: dataField.NavigationAvailable !== undefined ? compileBinding(equal(annotationExpression((_dataField$Navigation = dataField.NavigationAvailable) === null || _dataField$Navigation === void 0 ? void 0 : _dataField$Navigation.valueOf()), true)) : true,
            visible: compileBinding(not(equal(annotationExpression((_dataField$annotation2 = dataField.annotations) === null || _dataField$annotation2 === void 0 ? void 0 : (_dataField$annotation3 = _dataField$annotation2.UI) === null || _dataField$annotation3 === void 0 ? void 0 : (_dataField$annotation4 = _dataField$annotation3.Hidden) === null || _dataField$annotation4 === void 0 ? void 0 : _dataField$annotation4.valueOf()), true))),
            buttonType: getButtonType(UIAnnotation === null || UIAnnotation === void 0 ? void 0 : UIAnnotation.Emphasized),
            press: compileBinding(fn("._intentBasedNavigation.navigate", [annotationExpression(dataField.SemanticObject), annotationExpression(dataField.Action), mNavigationParameters])),
            customData: compileBinding({
              semanticObject: annotationExpression(dataField.SemanticObject),
              action: annotationExpression(dataField.Action)
            })
          });
          break;

        case "com.sap.vocabularies.UI.v1.DataFieldForAction":
          var formManifestActionsConfiguration = converterContext.getManifestControlConfiguration(referenceTarget).actions;
          var key = KeyHelper.generateKeyFromDataField(dataField);
          actions.push({
            type: ActionType.DataFieldForAction,
            id: FormID({
              Facet: facetDefinition
            }, dataField),
            key: key,
            text: (_dataField$Label2 = dataField.Label) === null || _dataField$Label2 === void 0 ? void 0 : _dataField$Label2.toString(),
            annotationPath: "",
            enabled: getEnabledBinding(dataField.ActionTarget),
            binding: navigationPropertyPath ? "{ 'path' : '" + navigationPropertyPath + "'}" : undefined,
            visible: compileBinding(not(equal(annotationExpression((_dataField$annotation5 = dataField.annotations) === null || _dataField$annotation5 === void 0 ? void 0 : (_dataField$annotation6 = _dataField$annotation5.UI) === null || _dataField$annotation6 === void 0 ? void 0 : (_dataField$annotation7 = _dataField$annotation6.Hidden) === null || _dataField$annotation7 === void 0 ? void 0 : _dataField$annotation7.valueOf()), true))),
            requiresDialog: isDialog(dataField.ActionTarget),
            buttonType: getButtonType(UIAnnotation === null || UIAnnotation === void 0 ? void 0 : UIAnnotation.Emphasized),
            press: compileBinding(fn("invokeAction", [dataField.Action, {
              contexts: fn("getBindingContext", [], bindingExpression("", "$source")),
              invocationGrouping: dataField.InvocationGrouping === "UI.OperationGroupingType/ChangeSet" ? "ChangeSet" : "Isolated",
              label: annotationExpression(dataField.Label),
              model: fn("getModel", [], bindingExpression("/", "$source")),
              isNavigable: isActionNavigable(formManifestActionsConfiguration && formManifestActionsConfiguration[key])
            }], ref(".editFlow")))
          });
          break;
      }

      actions = insertCustomElements(actions, manifestActions);
      return actions;
    }, actions);
  }

  function isDialog(actionDefinition) {
    if (actionDefinition) {
      var _actionDefinition$ann, _actionDefinition$ann2;

      var bCritical = (_actionDefinition$ann = actionDefinition.annotations) === null || _actionDefinition$ann === void 0 ? void 0 : (_actionDefinition$ann2 = _actionDefinition$ann.Common) === null || _actionDefinition$ann2 === void 0 ? void 0 : _actionDefinition$ann2.IsActionCritical;

      if (actionDefinition.parameters.length > 1 || bCritical) {
        return "Dialog";
      } else {
        return "None";
      }
    } else {
      return "None";
    }
  }

  _exports.isDialog = isDialog;

  function createCustomSubSections(manifestSubSections, converterContext) {
    var subSections = {};
    Object.keys(manifestSubSections).forEach(function (subSectionKey) {
      return subSections[subSectionKey] = createCustomSubSection(manifestSubSections[subSectionKey], subSectionKey, converterContext);
    });
    return subSections;
  }

  _exports.createCustomSubSections = createCustomSubSections;

  function createCustomSubSection(manifestSubSection, subSectionKey, converterContext) {
    var sideContent = manifestSubSection.sideContent ? {
      template: manifestSubSection.sideContent.template,
      id: SideContentID(subSectionKey),
      visible: false
    } : undefined;
    var position = manifestSubSection.position;

    if (!position) {
      position = {
        placement: Placement.After
      };
    }

    var subSectionDefinition = {
      type: SubSectionType.Unknown,
      id: manifestSubSection.id || CustomSubSectionID(subSectionKey),
      actions: getActionsFromManifest(manifestSubSection.actions, converterContext),
      key: subSectionKey,
      title: manifestSubSection.title,
      level: 1,
      position: position,
      visible: manifestSubSection.visible,
      sideContent: sideContent
    };

    if (manifestSubSection.template || manifestSubSection.name) {
      subSectionDefinition.type = SubSectionType.XMLFragment;
      subSectionDefinition.template = manifestSubSection.template || manifestSubSection.name || "";
    } else {
      subSectionDefinition.type = SubSectionType.Placeholder;
    }

    return subSectionDefinition;
  }
  /**
   * Evaluate if the condensed mode can be appli3ed on the table.
   *
   * @param currentFacet
   * @param facetsToCreateInSection
   * @param converterContext
   *
   * @returns {boolean}  true for compliant, false otherwise
   */


  _exports.createCustomSubSection = createCustomSubSection;

  function getCondensedTableLayoutCompliance(currentFacet, facetsToCreateInSection, converterContext) {
    var manifestWrapper = converterContext.getManifestWrapper();

    if (manifestWrapper.useIconTabBar()) {
      // If the OP use the tab based we check if the facets that will be created for this section are all non visible
      return hasNoOtherVisibleTableInTargets(currentFacet, facetsToCreateInSection);
    } else {
      var _entityType$annotatio, _entityType$annotatio2, _entityType$annotatio3, _entityType$annotatio4, _entityType$annotatio5, _entityType$annotatio6;

      var entityType = converterContext.getEntityType();

      if (((_entityType$annotatio = entityType.annotations) === null || _entityType$annotatio === void 0 ? void 0 : (_entityType$annotatio2 = _entityType$annotatio.UI) === null || _entityType$annotatio2 === void 0 ? void 0 : (_entityType$annotatio3 = _entityType$annotatio2.Facets) === null || _entityType$annotatio3 === void 0 ? void 0 : _entityType$annotatio3.length) && ((_entityType$annotatio4 = entityType.annotations) === null || _entityType$annotatio4 === void 0 ? void 0 : (_entityType$annotatio5 = _entityType$annotatio4.UI) === null || _entityType$annotatio5 === void 0 ? void 0 : (_entityType$annotatio6 = _entityType$annotatio5.Facets) === null || _entityType$annotatio6 === void 0 ? void 0 : _entityType$annotatio6.length) > 1) {
        return hasNoOtherVisibleTableInTargets(currentFacet, facetsToCreateInSection);
      } else {
        return true;
      }
    }
  }

  function hasNoOtherVisibleTableInTargets(currentFacet, facetsToCreateInSection) {
    return facetsToCreateInSection.every(function (subFacet) {
      if (subFacet !== currentFacet) {
        if (subFacet.$Type === "com.sap.vocabularies.UI.v1.ReferenceFacet") {
          var _refFacet$Target, _refFacet$Target$$tar, _refFacet$Target2, _refFacet$Target2$$ta, _refFacet$Target$$tar2;

          var refFacet = subFacet;

          if (((_refFacet$Target = refFacet.Target) === null || _refFacet$Target === void 0 ? void 0 : (_refFacet$Target$$tar = _refFacet$Target.$target) === null || _refFacet$Target$$tar === void 0 ? void 0 : _refFacet$Target$$tar.term) === "com.sap.vocabularies.UI.v1.LineItem" || ((_refFacet$Target2 = refFacet.Target) === null || _refFacet$Target2 === void 0 ? void 0 : (_refFacet$Target2$$ta = _refFacet$Target2.$target) === null || _refFacet$Target2$$ta === void 0 ? void 0 : _refFacet$Target2$$ta.term) === "com.sap.vocabularies.UI.v1.PresentationVariant" || ((_refFacet$Target$$tar2 = refFacet.Target.$target) === null || _refFacet$Target$$tar2 === void 0 ? void 0 : _refFacet$Target$$tar2.term) === "com.sap.vocabularies.UI.v1.SelectionPresentationVariant") {
            var _refFacet$annotations, _refFacet$annotations2, _refFacet$annotations3, _refFacet$annotations4;

            return ((_refFacet$annotations = refFacet.annotations) === null || _refFacet$annotations === void 0 ? void 0 : (_refFacet$annotations2 = _refFacet$annotations.UI) === null || _refFacet$annotations2 === void 0 ? void 0 : _refFacet$annotations2.Hidden) !== undefined ? (_refFacet$annotations3 = refFacet.annotations) === null || _refFacet$annotations3 === void 0 ? void 0 : (_refFacet$annotations4 = _refFacet$annotations3.UI) === null || _refFacet$annotations4 === void 0 ? void 0 : _refFacet$annotations4.Hidden : false;
          }

          return true;
        } else {
          var subCollectionFacet = subFacet;
          return subCollectionFacet.Facets.every(function (facet) {
            var _subRefFacet$Target, _subRefFacet$Target$$, _subRefFacet$Target2, _subRefFacet$Target2$, _subRefFacet$Target3, _subRefFacet$Target3$;

            var subRefFacet = facet;

            if (((_subRefFacet$Target = subRefFacet.Target) === null || _subRefFacet$Target === void 0 ? void 0 : (_subRefFacet$Target$$ = _subRefFacet$Target.$target) === null || _subRefFacet$Target$$ === void 0 ? void 0 : _subRefFacet$Target$$.term) === "com.sap.vocabularies.UI.v1.LineItem" || ((_subRefFacet$Target2 = subRefFacet.Target) === null || _subRefFacet$Target2 === void 0 ? void 0 : (_subRefFacet$Target2$ = _subRefFacet$Target2.$target) === null || _subRefFacet$Target2$ === void 0 ? void 0 : _subRefFacet$Target2$.term) === "com.sap.vocabularies.UI.v1.PresentationVariant" || ((_subRefFacet$Target3 = subRefFacet.Target) === null || _subRefFacet$Target3 === void 0 ? void 0 : (_subRefFacet$Target3$ = _subRefFacet$Target3.$target) === null || _subRefFacet$Target3$ === void 0 ? void 0 : _subRefFacet$Target3$.term) === "com.sap.vocabularies.UI.v1.SelectionPresentationVariant") {
              var _subRefFacet$annotati, _subRefFacet$annotati2, _subRefFacet$annotati3, _subRefFacet$annotati4;

              return ((_subRefFacet$annotati = subRefFacet.annotations) === null || _subRefFacet$annotati === void 0 ? void 0 : (_subRefFacet$annotati2 = _subRefFacet$annotati.UI) === null || _subRefFacet$annotati2 === void 0 ? void 0 : _subRefFacet$annotati2.Hidden) !== undefined ? (_subRefFacet$annotati3 = subRefFacet.annotations) === null || _subRefFacet$annotati3 === void 0 ? void 0 : (_subRefFacet$annotati4 = _subRefFacet$annotati3.UI) === null || _subRefFacet$annotati4 === void 0 ? void 0 : _subRefFacet$annotati4.Hidden : false;
            }

            return true;
          });
        }
      }

      return true;
    });
  }

  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlN1YlNlY3Rpb24udHMiXSwibmFtZXMiOlsiU3ViU2VjdGlvblR5cGUiLCJ0YXJnZXRUZXJtcyIsImhhc1RhYmxlIiwiZmFjZXRzIiwic29tZSIsImZhY2V0VHlwZSIsImluZGV4T2YiLCJUYXJnZXQiLCIkdGFyZ2V0IiwidGVybSIsImNyZWF0ZVN1YlNlY3Rpb25zIiwiZmFjZXRDb2xsZWN0aW9uIiwiY29udmVydGVyQ29udGV4dCIsImZhY2V0c1RvQ3JlYXRlIiwicmVkdWNlIiwiZmFjZXREZWZpbml0aW9uIiwiJFR5cGUiLCJwdXNoIiwiRmFjZXRzIiwiZmluZCIsInNwbGljZSIsImxlbmd0aCIsIm1hcCIsImZhY2V0IiwiY3JlYXRlU3ViU2VjdGlvbiIsImdldFN1YlNlY3Rpb25LZXkiLCJmYWxsYmFjayIsIklEIiwidG9TdHJpbmciLCJMYWJlbCIsImFkZEZvcm1NZW51QWN0aW9ucyIsImFjdGlvbnMiLCJoaWRkZW5BY3Rpb25zIiwiZ2V0Rm9ybUhpZGRlbkFjdGlvbnMiLCJmb3JtQWN0aW9ucyIsImdldEZvcm1BY3Rpb25zIiwiZm9ybUFsbEFjdGlvbnMiLCJpbnNlcnRDdXN0b21FbGVtZW50cyIsImdldEFjdGlvbnNGcm9tTWFuaWZlc3QiLCJ1bmRlZmluZWQiLCJnZXRWaXNpYmlsaXR5RW5hYmxlbWVudEZvcm1NZW51QWN0aW9ucyIsInJlbW92ZUR1cGxpY2F0ZUFjdGlvbnMiLCJnZXRGYWNldEFjdGlvbnMiLCJBcnJheSIsImZpbHRlciIsImlzUmVmZXJlbmNlRmFjZXQiLCJjcmVhdGVGb3JtQWN0aW9uUmVkdWNlciIsImdldEJ1dHRvblR5cGUiLCJFbXBoYXNpemVkIiwiUGF0aEZvckJ1dHRvblR5cGUiLCJwYXRoIiwiQnV0dG9uVHlwZSIsIlRyYW5zcGFyZW50IiwiR2hvc3QiLCJsZXZlbCIsImhhc1NpbmdsZUNvbnRlbnQiLCJzdWJTZWN0aW9uSUQiLCJTdWJTZWN0aW9uSUQiLCJGYWNldCIsInN1YlNlY3Rpb24iLCJpZCIsImtleSIsInRpdGxlIiwiY29tcGlsZUJpbmRpbmciLCJhbm5vdGF0aW9uRXhwcmVzc2lvbiIsInR5cGUiLCJVbmtub3duIiwiYW5ub3RhdGlvblBhdGgiLCJnZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoIiwiZnVsbHlRdWFsaWZpZWROYW1lIiwidmlzaWJsZSIsIm5vdCIsImVxdWFsIiwiYW5ub3RhdGlvbnMiLCJVSSIsIkhpZGRlbiIsImZsZXhTZXR0aW5ncyIsImRlc2lnbnRpbWUiLCJnZXREZXNpZ25UaW1lTWV0YWRhdGEiLCJzaWRlQ29udGVudCIsImNvbnRlbnQiLCJ0YWJsZUNvbnRlbnQiLCJpbmRleCIsInVuc3VwcG9ydGVkVGV4dCIsImkiLCJjb25jYXQiLCJtaXhlZFN1YlNlY3Rpb24iLCJNaXhlZCIsImZvcm1Db2xsZWN0aW9uU3ViU2VjdGlvbiIsIkZvcm0iLCJmb3JtRGVmaW5pdGlvbiIsImNyZWF0ZUZvcm1EZWZpbml0aW9uIiwidmFsdWUiLCJwcmVzZW50YXRpb24iLCJnZXREYXRhVmlzdWFsaXphdGlvbkNvbmZpZ3VyYXRpb24iLCJnZXRDb25kZW5zZWRUYWJsZUxheW91dENvbXBsaWFuY2UiLCJjb250cm9sVGl0bGUiLCJ2aXN1YWxpemF0aW9ucyIsImFubm90YXRpb24iLCJkYXRhVmlzdWFsaXphdGlvblN1YlNlY3Rpb24iLCJEYXRhVmlzdWFsaXphdGlvbiIsInNob3dUaXRsZSIsImlzU3Vic2VjdGlvblRpdGxlU2hvd24iLCJmb3JtRWxlbWVudFN1YlNlY3Rpb24iLCJ1bnN1cHBvcnRlZFN1YlNlY3Rpb24iLCJ0ZXh0Iiwic3ViU2VjdGlvblRpdGxlIiwicmVmZXJlbmNlVGFyZ2V0IiwidGFyZ2V0VmFsdWUiLCJtYW5pZmVzdEFjdGlvbnMiLCJkYXRhRmllbGRDb2xsZWN0aW9uIiwic3BsaXQiLCJuYXZpZ2F0aW9uUHJvcGVydHlQYXRoIiwibGFzdEluZGV4T2YiLCJzdWJzdHIiLCJEYXRhIiwiZ2V0TWFuaWZlc3RDb250cm9sQ29uZmlndXJhdGlvbiIsInF1YWxpZmllciIsImRhdGFGaWVsZCIsIlVJQW5ub3RhdGlvbiIsIlJlcXVpcmVzQ29udGV4dCIsInZhbHVlT2YiLCJnZXREaWFnbm9zdGljcyIsImFkZElzc3VlIiwiSXNzdWVDYXRlZ29yeSIsIkFubm90YXRpb24iLCJJc3N1ZVNldmVyaXR5IiwiTG93IiwiSXNzdWVUeXBlIiwiTUFMRk9STUVEX0RBVEFGSUVMRF9GT1JfSUJOIiwiUkVRVUlSRVNDT05URVhUIiwiSW5saW5lIiwiSU5MSU5FIiwibU5hdmlnYXRpb25QYXJhbWV0ZXJzIiwiTWFwcGluZyIsInNlbWFudGljT2JqZWN0TWFwcGluZyIsImdldFNlbWFudGljT2JqZWN0TWFwcGluZyIsIkFjdGlvblR5cGUiLCJEYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb24iLCJGb3JtSUQiLCJLZXlIZWxwZXIiLCJnZW5lcmF0ZUtleUZyb21EYXRhRmllbGQiLCJlbmFibGVkIiwiTmF2aWdhdGlvbkF2YWlsYWJsZSIsImJ1dHRvblR5cGUiLCJwcmVzcyIsImZuIiwiU2VtYW50aWNPYmplY3QiLCJBY3Rpb24iLCJjdXN0b21EYXRhIiwic2VtYW50aWNPYmplY3QiLCJhY3Rpb24iLCJmb3JtTWFuaWZlc3RBY3Rpb25zQ29uZmlndXJhdGlvbiIsIkRhdGFGaWVsZEZvckFjdGlvbiIsImdldEVuYWJsZWRCaW5kaW5nIiwiQWN0aW9uVGFyZ2V0IiwiYmluZGluZyIsInJlcXVpcmVzRGlhbG9nIiwiaXNEaWFsb2ciLCJjb250ZXh0cyIsImJpbmRpbmdFeHByZXNzaW9uIiwiaW52b2NhdGlvbkdyb3VwaW5nIiwiSW52b2NhdGlvbkdyb3VwaW5nIiwibGFiZWwiLCJtb2RlbCIsImlzTmF2aWdhYmxlIiwiaXNBY3Rpb25OYXZpZ2FibGUiLCJyZWYiLCJhY3Rpb25EZWZpbml0aW9uIiwiYkNyaXRpY2FsIiwiQ29tbW9uIiwiSXNBY3Rpb25Dcml0aWNhbCIsInBhcmFtZXRlcnMiLCJjcmVhdGVDdXN0b21TdWJTZWN0aW9ucyIsIm1hbmlmZXN0U3ViU2VjdGlvbnMiLCJzdWJTZWN0aW9ucyIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwic3ViU2VjdGlvbktleSIsImNyZWF0ZUN1c3RvbVN1YlNlY3Rpb24iLCJtYW5pZmVzdFN1YlNlY3Rpb24iLCJ0ZW1wbGF0ZSIsIlNpZGVDb250ZW50SUQiLCJwb3NpdGlvbiIsInBsYWNlbWVudCIsIlBsYWNlbWVudCIsIkFmdGVyIiwic3ViU2VjdGlvbkRlZmluaXRpb24iLCJDdXN0b21TdWJTZWN0aW9uSUQiLCJuYW1lIiwiWE1MRnJhZ21lbnQiLCJQbGFjZWhvbGRlciIsImN1cnJlbnRGYWNldCIsImZhY2V0c1RvQ3JlYXRlSW5TZWN0aW9uIiwibWFuaWZlc3RXcmFwcGVyIiwiZ2V0TWFuaWZlc3RXcmFwcGVyIiwidXNlSWNvblRhYkJhciIsImhhc05vT3RoZXJWaXNpYmxlVGFibGVJblRhcmdldHMiLCJlbnRpdHlUeXBlIiwiZ2V0RW50aXR5VHlwZSIsImV2ZXJ5Iiwic3ViRmFjZXQiLCJyZWZGYWNldCIsInN1YkNvbGxlY3Rpb25GYWNldCIsInN1YlJlZkZhY2V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQThDWUEsYzs7YUFBQUEsYztBQUFBQSxJQUFBQSxjO0FBQUFBLElBQUFBLGM7QUFBQUEsSUFBQUEsYztBQUFBQSxJQUFBQSxjO0FBQUFBLElBQUFBLGM7QUFBQUEsSUFBQUEsYztLQUFBQSxjLEtBQUFBLGM7OztBQXVGWixNQUFNQyxXQUFxQixHQUFHLG9KQUE5QixDLENBTUE7O0FBQ0EsTUFBTUMsUUFBUSxHQUFHLFlBQXdCO0FBQUEsUUFBdkJDLE1BQXVCLHVFQUFQLEVBQU87QUFDeEMsV0FBT0EsTUFBTSxDQUFDQyxJQUFQLENBQVksVUFBQUMsU0FBUztBQUFBOztBQUFBLGFBQUlKLFdBQVcsQ0FBQ0ssT0FBWixDQUFvQkQsU0FBcEIsYUFBb0JBLFNBQXBCLDRDQUFvQkEsU0FBUyxDQUFFRSxNQUEvQiwrRUFBb0Isa0JBQW1CQyxP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eUJDLElBQXpCLCtEQUhELEVBSUU7QUFBQTs7QUFDRCxtQkFBTywwQkFBQWtNLFFBQVEsQ0FBQ2xJLFdBQVQsMEdBQXNCQyxFQUF0QixrRkFBMEJDLE1BQTFCLE1BQXFDcEMsU0FBckMsNkJBQWlEb0ssUUFBUSxDQUFDbEksV0FBMUQscUZBQWlELHVCQUFzQkMsRUFBdkUsMkRBQWlELHVCQUEwQkMsTUFBM0UsR0FBb0YsS0FBM0Y7QUFDQTs7QUFDRCxpQkFBTyxJQUFQO0FBQ0EsU0FWRCxNQVVPO0FBQ04sY0FBTWlJLGtCQUFrQixHQUFHRixRQUEzQjtBQUNBLGlCQUFPRSxrQkFBa0IsQ0FBQzFMLE1BQW5CLENBQTBCdUwsS0FBMUIsQ0FBZ0MsVUFBU2xMLEtBQVQsRUFBZ0I7QUFBQTs7QUFDdEQsZ0JBQU1zTCxXQUFXLEdBQUd0TCxLQUFwQjs7QUFDQSxnQkFDQyx3QkFBQXNMLFdBQVcsQ0FBQ3RNLE1BQVoscUdBQW9CQyxPQUFwQixnRkFBNkJDLElBQTdCLCtDQUNBLHlCQUFBb00sV0FBVyxDQUFDdE0sTUFBWix1R0FBb0JDLE9BQXBCLGdGQUE2QkMsSUFBN0Isc0RBREEsSUFFQSx5QkFBQW9NLFdBQVcsQ0FBQ3RNLE1BQVosdUdBQW9CQyxPQUFwQixnRkFBNkJDLElBQTdCLCtEQUhELEVBSUU7QUFBQTs7QUFDRCxxQkFBTywwQkFBQW9NLFdBQVcsQ0FBQ3BJLFdBQVosMEdBQXlCQyxFQUF6QixrRkFBNkJDLE1BQTdCLE1BQXdDcEMsU0FBeEMsNkJBQW9Ec0ssV0FBVyxDQUFDcEksV0FBaEUscUZBQW9ELHVCQUF5QkMsRUFBN0UsMkRBQW9ELHVCQUE2QkMsTUFBakYsR0FBMEYsS0FBakc7QUFDQTs7QUFDRCxtQkFBTyxJQUFQO0FBQ0EsV0FWTSxDQUFQO0FBV0E7QUFDRDs7QUFDRCxhQUFPLElBQVA7QUFDQSxLQTVCTSxDQUFQO0FBNkJBIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBY3Rpb25UeXBlLCBNYW5pZmVzdFN1YlNlY3Rpb24sIE1hbmlmZXN0QWN0aW9uIH0gZnJvbSBcIi4uLy4uL01hbmlmZXN0U2V0dGluZ3NcIjtcbmltcG9ydCB7XG5cdEFubm90YXRpb25UZXJtLFxuXHRDb2xsZWN0aW9uRmFjZXRUeXBlcyxcblx0RGF0YUZpZWxkQWJzdHJhY3RUeXBlcyxcblx0RmFjZXRUeXBlcyxcblx0RmllbGRHcm91cCxcblx0SWRlbnRpZmljYXRpb24sXG5cdE9wZXJhdGlvbkdyb3VwaW5nVHlwZSxcblx0UmVmZXJlbmNlRmFjZXRUeXBlcyxcblx0U3RhdHVzSW5mbyxcblx0VUlBbm5vdGF0aW9uVGVybXMsXG5cdFVJQW5ub3RhdGlvblR5cGVzXG59IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlc1wiO1xuaW1wb3J0IHsgQ29tbXVuaWNhdGlvbkFubm90YXRpb25UZXJtcyB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlcy9kaXN0L2dlbmVyYXRlZC9Db21tdW5pY2F0aW9uXCI7XG5pbXBvcnQgeyBDdXN0b21TdWJTZWN0aW9uSUQsIEZvcm1JRCwgU3ViU2VjdGlvbklELCBTaWRlQ29udGVudElEIH0gZnJvbSBcIi4uLy4uL2hlbHBlcnMvSURcIjtcbmltcG9ydCB7IENvbnZlcnRlckNvbnRleHQgfSBmcm9tIFwiLi4vLi4vdGVtcGxhdGVzL0Jhc2VDb252ZXJ0ZXJcIjtcbmltcG9ydCB7IGNyZWF0ZUZvcm1EZWZpbml0aW9uLCBGb3JtRGVmaW5pdGlvbiwgaXNSZWZlcmVuY2VGYWNldCB9IGZyb20gXCIuLi9Db21tb24vRm9ybVwiO1xuaW1wb3J0IHsgRGF0YVZpc3VhbGl6YXRpb25EZWZpbml0aW9uLCBnZXREYXRhVmlzdWFsaXphdGlvbkNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vQ29tbW9uL0RhdGFWaXN1YWxpemF0aW9uXCI7XG5pbXBvcnQgeyBDb25maWd1cmFibGVPYmplY3QsIENvbmZpZ3VyYWJsZVJlY29yZCwgQ3VzdG9tRWxlbWVudCwgaW5zZXJ0Q3VzdG9tRWxlbWVudHMsIFBsYWNlbWVudCB9IGZyb20gXCIuLi8uLi9oZWxwZXJzL0NvbmZpZ3VyYWJsZU9iamVjdFwiO1xuaW1wb3J0IHtcblx0Q29udmVydGVyQWN0aW9uLFxuXHRDdXN0b21BY3Rpb24sXG5cdGdldEFjdGlvbnNGcm9tTWFuaWZlc3QsXG5cdGdldEVuYWJsZWRCaW5kaW5nLFxuXHRpc0FjdGlvbk5hdmlnYWJsZSxcblx0QnV0dG9uVHlwZSxcblx0Z2V0U2VtYW50aWNPYmplY3RNYXBwaW5nLFxuXHRyZW1vdmVEdXBsaWNhdGVBY3Rpb25zLFxuXHRCYXNlQWN0aW9uXG59IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2NvbnRyb2xzL0NvbW1vbi9BY3Rpb25cIjtcbmltcG9ydCB7IEtleUhlbHBlciB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvS2V5XCI7XG5pbXBvcnQge1xuXHRhbm5vdGF0aW9uRXhwcmVzc2lvbixcblx0YmluZGluZ0V4cHJlc3Npb24sXG5cdEJpbmRpbmdFeHByZXNzaW9uLFxuXHRjb21waWxlQmluZGluZyxcblx0ZXF1YWwsXG5cdGZuLFxuXHRub3QsXG5cdHJlZlxufSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9CaW5kaW5nRXhwcmVzc2lvblwiO1xuaW1wb3J0IHsgSXNzdWVUeXBlLCBJc3N1ZVNldmVyaXR5LCBJc3N1ZUNhdGVnb3J5IH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvaGVscGVycy9Jc3N1ZU1hbmFnZXJcIjtcbmltcG9ydCB7IEZsZXhTZXR0aW5ncywgZ2V0RGVzaWduVGltZU1ldGFkYXRhIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvY29udHJvbHMvT2JqZWN0UGFnZS9IZWFkZXJGYWNldFwiO1xuaW1wb3J0IHsgZ2V0VmlzaWJpbGl0eUVuYWJsZW1lbnRGb3JtTWVudUFjdGlvbnMsIGdldEZvcm1IaWRkZW5BY3Rpb25zLCBnZXRGb3JtQWN0aW9ucyB9IGZyb20gXCIuLi8uLi9vYmplY3RQYWdlL0Zvcm1NZW51QWN0aW9uc1wiO1xuXG5leHBvcnQgZW51bSBTdWJTZWN0aW9uVHlwZSB7XG5cdFVua25vd24gPSBcIlVua25vd25cIiwgLy8gRGVmYXVsdCBUeXBlXG5cdEZvcm0gPSBcIkZvcm1cIixcblx0RGF0YVZpc3VhbGl6YXRpb24gPSBcIkRhdGFWaXN1YWxpemF0aW9uXCIsXG5cdFhNTEZyYWdtZW50ID0gXCJYTUxGcmFnbWVudFwiLFxuXHRQbGFjZWhvbGRlciA9IFwiUGxhY2Vob2xkZXJcIixcblx0TWl4ZWQgPSBcIk1peGVkXCJcbn1cblxudHlwZSBPYmplY3RQYWdlU3ViU2VjdGlvbiA9XG5cdHwgVW5zdXBwb3J0ZWRTdWJTZWN0aW9uXG5cdHwgRm9ybVN1YlNlY3Rpb25cblx0fCBEYXRhVmlzdWFsaXphdGlvblN1YlNlY3Rpb25cblx0fCBDb250YWN0U3ViU2VjdGlvblxuXHR8IFhNTEZyYWdtZW50U3ViU2VjdGlvblxuXHR8IFBsYWNlaG9sZGVyRnJhZ21lbnRTdWJTZWN0aW9uXG5cdHwgTWl4ZWRTdWJTZWN0aW9uO1xuXG50eXBlIEJhc2VTdWJTZWN0aW9uID0ge1xuXHRpZDogc3RyaW5nO1xuXHRrZXk6IHN0cmluZztcblx0dGl0bGU6IEJpbmRpbmdFeHByZXNzaW9uPHN0cmluZz47XG5cdGFubm90YXRpb25QYXRoOiBzdHJpbmc7XG5cdHR5cGU6IFN1YlNlY3Rpb25UeXBlO1xuXHR2aXNpYmxlOiBCaW5kaW5nRXhwcmVzc2lvbjxib29sZWFuPjtcblx0ZmxleFNldHRpbmdzPzogRmxleFNldHRpbmdzO1xuXHRsZXZlbDogbnVtYmVyO1xuXHRzaWRlQ29udGVudD86IFNpZGVDb250ZW50RGVmO1xufTtcblxudHlwZSBVbnN1cHBvcnRlZFN1YlNlY3Rpb24gPSBCYXNlU3ViU2VjdGlvbiAmIHtcblx0dGV4dDogc3RyaW5nO1xufTtcblxudHlwZSBEYXRhVmlzdWFsaXphdGlvblN1YlNlY3Rpb24gPSBCYXNlU3ViU2VjdGlvbiAmIHtcblx0dHlwZTogU3ViU2VjdGlvblR5cGUuRGF0YVZpc3VhbGl6YXRpb247XG5cdHByZXNlbnRhdGlvbjogRGF0YVZpc3VhbGl6YXRpb25EZWZpbml0aW9uO1xuXHRzaG93VGl0bGU6IGJvb2xlYW47XG59O1xuXG50eXBlIENvbnRhY3RTdWJTZWN0aW9uID0gVW5zdXBwb3J0ZWRTdWJTZWN0aW9uICYge307XG5cbnR5cGUgWE1MRnJhZ21lbnRTdWJTZWN0aW9uID0gT21pdDxCYXNlU3ViU2VjdGlvbiwgXCJhbm5vdGF0aW9uUGF0aFwiPiAmIHtcblx0dHlwZTogU3ViU2VjdGlvblR5cGUuWE1MRnJhZ21lbnQ7XG5cdHRlbXBsYXRlOiBzdHJpbmc7XG5cdGFjdGlvbnM6IFJlY29yZDxzdHJpbmcsIEN1c3RvbUFjdGlvbj47XG59O1xuXG50eXBlIEVtcGhhc2l6ZWQgPSB7XG5cdHBhdGg6IHN0cmluZztcbn07XG5cbnR5cGUgUGxhY2Vob2xkZXJGcmFnbWVudFN1YlNlY3Rpb24gPSBPbWl0PEJhc2VTdWJTZWN0aW9uLCBcImFubm90YXRpb25QYXRoXCI+ICYge1xuXHR0eXBlOiBTdWJTZWN0aW9uVHlwZS5QbGFjZWhvbGRlcjtcblx0YWN0aW9uczogUmVjb3JkPHN0cmluZywgQ3VzdG9tQWN0aW9uPjtcbn07XG5cbnR5cGUgTWl4ZWRTdWJTZWN0aW9uID0gQmFzZVN1YlNlY3Rpb24gJiB7XG5cdGNvbnRlbnQ6IEFycmF5PE9iamVjdFBhZ2VTdWJTZWN0aW9uPjtcbn07XG5cbmV4cG9ydCB0eXBlIEZvcm1TdWJTZWN0aW9uID0gQmFzZVN1YlNlY3Rpb24gJiB7XG5cdHR5cGU6IFN1YlNlY3Rpb25UeXBlLkZvcm07XG5cdGZvcm1EZWZpbml0aW9uOiBGb3JtRGVmaW5pdGlvbjtcblx0YWN0aW9uczogQ29udmVydGVyQWN0aW9uW10gfCBCYXNlQWN0aW9uW107XG59O1xuXG5leHBvcnQgdHlwZSBPYmplY3RQYWdlU2VjdGlvbiA9IENvbmZpZ3VyYWJsZU9iamVjdCAmIHtcblx0aWQ6IHN0cmluZztcblx0dGl0bGU6IEJpbmRpbmdFeHByZXNzaW9uPHN0cmluZz47XG5cdHNob3dUaXRsZT86IEJpbmRpbmdFeHByZXNzaW9uPGJvb2xlYW4+O1xuXHR2aXNpYmxlOiBCaW5kaW5nRXhwcmVzc2lvbjxib29sZWFuPjtcblx0c3ViU2VjdGlvbnM6IE9iamVjdFBhZ2VTdWJTZWN0aW9uW107XG59O1xuXG50eXBlIFNpZGVDb250ZW50RGVmID0ge1xuXHR0ZW1wbGF0ZT86IHN0cmluZztcblx0aWQ/OiBzdHJpbmc7XG5cdHNpZGVDb250ZW50RmFsbERvd24/OiBzdHJpbmc7XG5cdGNvbnRhaW5lclF1ZXJ5Pzogc3RyaW5nO1xuXHR2aXNpYmxlPzogYm9vbGVhbjtcbn07XG5cbmV4cG9ydCB0eXBlIEN1c3RvbU9iamVjdFBhZ2VTZWN0aW9uID0gQ3VzdG9tRWxlbWVudDxPYmplY3RQYWdlU2VjdGlvbj47XG5cbmV4cG9ydCB0eXBlIEN1c3RvbU9iamVjdFBhZ2VTdWJTZWN0aW9uID0gQ3VzdG9tRWxlbWVudDxPYmplY3RQYWdlU3ViU2VjdGlvbj47XG5cbmNvbnN0IHRhcmdldFRlcm1zOiBzdHJpbmdbXSA9IFtcblx0VUlBbm5vdGF0aW9uVGVybXMuTGluZUl0ZW0sXG5cdFVJQW5ub3RhdGlvblRlcm1zLlByZXNlbnRhdGlvblZhcmlhbnQsXG5cdFVJQW5ub3RhdGlvblRlcm1zLlNlbGVjdGlvblByZXNlbnRhdGlvblZhcmlhbnRcbl07XG5cbi8vIFRPRE86IE5lZWQgdG8gaGFuZGxlIFRhYmxlIGNhc2UgaW5zaWRlIGNyZWF0ZVN1YlNlY3Rpb24gZnVuY3Rpb24gaWYgQ29sbGVjdGlvbkZhY2V0IGhhcyBUYWJsZSBSZWZlcmVuY2VGYWNldFxuY29uc3QgaGFzVGFibGUgPSAoZmFjZXRzOiBhbnlbXSA9IFtdKSA9PiB7XG5cdHJldHVybiBmYWNldHMuc29tZShmYWNldFR5cGUgPT4gdGFyZ2V0VGVybXMuaW5kZXhPZihmYWNldFR5cGU/LlRhcmdldD8uJHRhcmdldD8udGVybSkgPiAtMSk7XG59O1xuXG4vKipcbiAqIENyZWF0ZSBzdWJzZWN0aW9ucyBiYXNlZCBvbiBmYWNldCBkZWZpbml0aW9uLlxuICpcbiAqIEBwYXJhbSBmYWNldENvbGxlY3Rpb25cbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0XG4gKiBAcmV0dXJucyB7T2JqZWN0UGFnZVN1YlNlY3Rpb25bXX0gdGhlIGN1cnJlbnQgc3ViZWN0aW9uc1xuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU3ViU2VjdGlvbnMoZmFjZXRDb2xsZWN0aW9uOiBGYWNldFR5cGVzW10sIGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQpOiBPYmplY3RQYWdlU3ViU2VjdGlvbltdIHtcblx0Ly8gRmlyc3Qgd2UgZGV0ZXJtaW5lIHdoaWNoIHN1YiBzZWN0aW9uIHdlIG5lZWQgdG8gY3JlYXRlXG5cdGNvbnN0IGZhY2V0c1RvQ3JlYXRlID0gZmFjZXRDb2xsZWN0aW9uLnJlZHVjZSgoZmFjZXRzVG9DcmVhdGU6IEZhY2V0VHlwZXNbXSwgZmFjZXREZWZpbml0aW9uKSA9PiB7XG5cdFx0c3dpdGNoIChmYWNldERlZmluaXRpb24uJFR5cGUpIHtcblx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuUmVmZXJlbmNlRmFjZXQ6XG5cdFx0XHRcdGZhY2V0c1RvQ3JlYXRlLnB1c2goZmFjZXREZWZpbml0aW9uKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkNvbGxlY3Rpb25GYWNldDpcblx0XHRcdFx0Ly8gVE9ETyBJZiB0aGUgQ29sbGVjdGlvbiBGYWNldCBoYXMgYSBjaGlsZCBvZiB0eXBlIENvbGxlY3Rpb24gRmFjZXQgd2UgYnJpbmcgdGhlbSB1cCBvbmUgbGV2ZWwgKEZvcm0gKyBUYWJsZSB1c2UgY2FzZSkgP1xuXHRcdFx0XHQvLyBmaXJzdCBjYXNlIGZhY2V0IENvbGxlY3Rpb24gaXMgY29tYmluYXRpb24gb2YgY29sbGVjdGlvbiBhbmQgcmVmZXJlbmNlIGZhY2V0IG9yIG5vdCBhbGwgZmFjZXRzIGFyZSByZWZlcmVuY2UgZmFjZXRzLlxuXHRcdFx0XHRpZiAoZmFjZXREZWZpbml0aW9uLkZhY2V0cy5maW5kKGZhY2V0VHlwZSA9PiBmYWNldFR5cGUuJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLkNvbGxlY3Rpb25GYWNldCkpIHtcblx0XHRcdFx0XHRmYWNldHNUb0NyZWF0ZS5zcGxpY2UoZmFjZXRzVG9DcmVhdGUubGVuZ3RoLCAwLCAuLi5mYWNldERlZmluaXRpb24uRmFjZXRzKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRmYWNldHNUb0NyZWF0ZS5wdXNoKGZhY2V0RGVmaW5pdGlvbik7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLlJlZmVyZW5jZVVSTEZhY2V0OlxuXHRcdFx0XHQvLyBOb3Qgc3VwcG9ydGVkXG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFjZXRzVG9DcmVhdGU7XG5cdH0sIFtdKTtcblxuXHQvLyBUaGVuIHdlIGNyZWF0ZSB0aGUgYWN0dWFsIHN1YnNlY3Rpb25zXG5cdHJldHVybiBmYWNldHNUb0NyZWF0ZS5tYXAoZmFjZXQgPT4gY3JlYXRlU3ViU2VjdGlvbihmYWNldCwgZmFjZXRzVG9DcmVhdGUsIGNvbnZlcnRlckNvbnRleHQsIDAsICEoZmFjZXQgYXMgYW55KT8uRmFjZXRzPy5sZW5ndGgpKTtcbn1cblxuLy8gZnVuY3Rpb24gaXNUYXJnZXRGb3JDb21wbGlhbnQoYW5ub3RhdGlvblBhdGg6IEFubm90YXRpb25QYXRoKSB7XG4vLyBcdHJldHVybiAvLipjb21cXC5zYXBcXC52b2NhYnVsYXJpZXNcXC5VSVxcLnYxXFwuKEZpZWxkR3JvdXB8SWRlbnRpZmljYXRpb258RGF0YVBvaW50fFN0YXR1c0luZm8pLiovLnRlc3QoYW5ub3RhdGlvblBhdGgudmFsdWUpO1xuLy8gfVxuY29uc3QgZ2V0U3ViU2VjdGlvbktleSA9IChmYWNldERlZmluaXRpb246IEZhY2V0VHlwZXMsIGZhbGxiYWNrOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuXHRyZXR1cm4gZmFjZXREZWZpbml0aW9uLklEPy50b1N0cmluZygpIHx8IGZhY2V0RGVmaW5pdGlvbi5MYWJlbD8udG9TdHJpbmcoKSB8fCBmYWxsYmFjaztcbn07XG4vKipcbiAqIEFkZCBGb3JtIG1lbnUgYWN0aW9uIHRvIGFsbCBmb3JtIGFjdGlvcywgcmVtb3ZlIGR1cGxpY2F0ZSBhY3Rpb24gYW5kIGhpZGRlbiBhY3Rpb25zLlxuICogQHBhcmFtIGFjdGlvbnNcbiAqIEBwYXJhbSBmYWNldERlZmluaXRpb25cbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0XG4gKiBAcmV0dXJucyB7QmFzZUFjdGlvbltdIHwgQ29udmVydGVyQWN0aW9uW119XG4gKi9cbmZ1bmN0aW9uIGFkZEZvcm1NZW51QWN0aW9ucyhcblx0YWN0aW9uczogQ29udmVydGVyQWN0aW9uW10sXG5cdGZhY2V0RGVmaW5pdGlvbjogRmFjZXRUeXBlcyxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dFxuKTogQmFzZUFjdGlvbltdIHwgQ29udmVydGVyQWN0aW9uW10ge1xuXHRjb25zdCBoaWRkZW5BY3Rpb25zOiBCYXNlQWN0aW9uW10gPSBnZXRGb3JtSGlkZGVuQWN0aW9ucyhmYWNldERlZmluaXRpb24sIGNvbnZlcnRlckNvbnRleHQpIHx8IFtdLFxuXHRcdGZvcm1BY3Rpb25zOiBDb25maWd1cmFibGVSZWNvcmQ8TWFuaWZlc3RBY3Rpb24+ID0gZ2V0Rm9ybUFjdGlvbnMoZmFjZXREZWZpbml0aW9uLCBjb252ZXJ0ZXJDb250ZXh0KSxcblx0XHRmb3JtQWxsQWN0aW9ucyA9IGluc2VydEN1c3RvbUVsZW1lbnRzKFxuXHRcdFx0YWN0aW9ucyxcblx0XHRcdGdldEFjdGlvbnNGcm9tTWFuaWZlc3QoZm9ybUFjdGlvbnMsIGNvbnZlcnRlckNvbnRleHQsIGFjdGlvbnMsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBoaWRkZW5BY3Rpb25zKVxuXHRcdCk7XG5cdHJldHVybiBmb3JtQWxsQWN0aW9ucyA/IGdldFZpc2liaWxpdHlFbmFibGVtZW50Rm9ybU1lbnVBY3Rpb25zKHJlbW92ZUR1cGxpY2F0ZUFjdGlvbnMoZm9ybUFsbEFjdGlvbnMpKSA6IGFjdGlvbnM7XG59XG5cbi8qKlxuICogUmV0cmlldmVzIHRoZSBhY3Rpb24gZm9ybSBhIGZhY2V0LlxuICogQHBhcmFtIGZhY2V0RGVmaW5pdGlvblxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHRcbiAqIEByZXR1cm5zIHtDb252ZXJ0ZXJBY3Rpb25bXSB8IEJhc2VBY3Rpb25bXX0gdGhlIGN1cnJlbnQgZmFjZXQgYWN0aW9uc1xuICovXG5mdW5jdGlvbiBnZXRGYWNldEFjdGlvbnMoZmFjZXREZWZpbml0aW9uOiBGYWNldFR5cGVzLCBjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogQmFzZUFjdGlvbltdIHwgQ29udmVydGVyQWN0aW9uW10ge1xuXHRsZXQgYWN0aW9ucyA9IG5ldyBBcnJheTxDb252ZXJ0ZXJBY3Rpb24+KCk7XG5cdHN3aXRjaCAoZmFjZXREZWZpbml0aW9uLiRUeXBlKSB7XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5Db2xsZWN0aW9uRmFjZXQ6XG5cdFx0XHRhY3Rpb25zID0gKGZhY2V0RGVmaW5pdGlvbi5GYWNldHMuZmlsdGVyKGZhY2V0RGVmaW5pdGlvbiA9PiBpc1JlZmVyZW5jZUZhY2V0KGZhY2V0RGVmaW5pdGlvbikpIGFzIFJlZmVyZW5jZUZhY2V0VHlwZXNbXSkucmVkdWNlKFxuXHRcdFx0XHQoYWN0aW9uczogQ29udmVydGVyQWN0aW9uW10sIGZhY2V0RGVmaW5pdGlvbikgPT4gY3JlYXRlRm9ybUFjdGlvblJlZHVjZXIoYWN0aW9ucywgZmFjZXREZWZpbml0aW9uLCBjb252ZXJ0ZXJDb250ZXh0KSxcblx0XHRcdFx0W11cblx0XHRcdCk7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLlJlZmVyZW5jZUZhY2V0OlxuXHRcdFx0YWN0aW9ucyA9IGNyZWF0ZUZvcm1BY3Rpb25SZWR1Y2VyKFtdLCBmYWNldERlZmluaXRpb24gYXMgUmVmZXJlbmNlRmFjZXRUeXBlcywgY29udmVydGVyQ29udGV4dCk7XG5cdFx0XHRicmVhaztcblx0fVxuXHRyZXR1cm4gYWRkRm9ybU1lbnVBY3Rpb25zKGFjdGlvbnMsIGZhY2V0RGVmaW5pdGlvbiwgY29udmVydGVyQ29udGV4dCk7XG59XG4vKipcbiAqIFJldHJ1bnMgdGhlIGJ1dHRvbiB0eXBlIGJhc2VkIG9uIEBVSS5FbXBoYXNpemVkIGFubm90YXRpb24uXG4gKiBAcGFyYW0gRW1waGFzaXplZCBFbXBoYXNpemVkIGFubm90YXRpb24gdmFsdWUuXG4gKiBAcmV0dXJucyB7QnV0dG9uVHlwZSB8IHN0cmluZ30gcmV0dXJucyBidXR0b24gdHlwZSBvciBwYXRoIGJhc2VkIGV4cHJlc3Npb24uXG4gKi9cbmZ1bmN0aW9uIGdldEJ1dHRvblR5cGUoRW1waGFzaXplZDogRW1waGFzaXplZCk6IEJ1dHRvblR5cGUgfCBzdHJpbmcge1xuXHRjb25zdCBQYXRoRm9yQnV0dG9uVHlwZTogc3RyaW5nID0gRW1waGFzaXplZD8ucGF0aDtcblx0aWYgKFBhdGhGb3JCdXR0b25UeXBlKSB7XG5cdFx0cmV0dXJuIFwiez0gXCIgKyBcIiEke1wiICsgUGF0aEZvckJ1dHRvblR5cGUgKyBcIn0gPyAnXCIgKyBCdXR0b25UeXBlLlRyYW5zcGFyZW50ICsgXCInIDogJHtcIiArIFBhdGhGb3JCdXR0b25UeXBlICsgXCJ9XCIgKyBcIn1cIjtcblx0fSBlbHNlIGlmIChFbXBoYXNpemVkKSB7XG5cdFx0cmV0dXJuIEJ1dHRvblR5cGUuR2hvc3Q7XG5cdH1cblx0cmV0dXJuIEJ1dHRvblR5cGUuVHJhbnNwYXJlbnQ7XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgc3Vic2VjdGlvbiBiYXNlZCBvbiBhIEZhY2V0VHlwZXMuXG4gKiBAcGFyYW0gZmFjZXREZWZpbml0aW9uXG4gKiBAcGFyYW0gZmFjZXRzVG9DcmVhdGVcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0XG4gKiBAcGFyYW0gbGV2ZWxcbiAqIEBwYXJhbSBoYXNTaW5nbGVDb250ZW50XG4gKiBAcmV0dXJucyB7T2JqZWN0UGFnZVN1YlNlY3Rpb259IG9uZSBzdWIgc2VjdGlvbiBkZWZpbml0aW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTdWJTZWN0aW9uKFxuXHRmYWNldERlZmluaXRpb246IEZhY2V0VHlwZXMsXG5cdGZhY2V0c1RvQ3JlYXRlOiBGYWNldFR5cGVzW10sXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdGxldmVsOiBudW1iZXIsXG5cdGhhc1NpbmdsZUNvbnRlbnQ6IGJvb2xlYW5cbik6IE9iamVjdFBhZ2VTdWJTZWN0aW9uIHtcblx0Y29uc3Qgc3ViU2VjdGlvbklEID0gU3ViU2VjdGlvbklEKHsgRmFjZXQ6IGZhY2V0RGVmaW5pdGlvbiB9KTtcblx0Y29uc3Qgc3ViU2VjdGlvbjogQmFzZVN1YlNlY3Rpb24gPSB7XG5cdFx0aWQ6IHN1YlNlY3Rpb25JRCxcblx0XHRrZXk6IGdldFN1YlNlY3Rpb25LZXkoZmFjZXREZWZpbml0aW9uLCBzdWJTZWN0aW9uSUQpLFxuXHRcdHRpdGxlOiBjb21waWxlQmluZGluZyhhbm5vdGF0aW9uRXhwcmVzc2lvbihmYWNldERlZmluaXRpb24uTGFiZWwpKSxcblx0XHR0eXBlOiBTdWJTZWN0aW9uVHlwZS5Vbmtub3duLFxuXHRcdGFubm90YXRpb25QYXRoOiBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVNldEJhc2VkQW5ub3RhdGlvblBhdGgoZmFjZXREZWZpbml0aW9uLmZ1bGx5UXVhbGlmaWVkTmFtZSksXG5cdFx0dmlzaWJsZTogY29tcGlsZUJpbmRpbmcobm90KGVxdWFsKGFubm90YXRpb25FeHByZXNzaW9uKGZhY2V0RGVmaW5pdGlvbi5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbiksIHRydWUpKSksXG5cdFx0ZmxleFNldHRpbmdzOiB7IGRlc2lnbnRpbWU6IGdldERlc2lnblRpbWVNZXRhZGF0YShmYWNldERlZmluaXRpb24sIGZhY2V0RGVmaW5pdGlvbiwgY29udmVydGVyQ29udGV4dCkgfSxcblx0XHRsZXZlbDogbGV2ZWwsXG5cdFx0c2lkZUNvbnRlbnQ6IHVuZGVmaW5lZFxuXHR9O1xuXHRsZXQgY29udGVudDogQXJyYXk8T2JqZWN0UGFnZVN1YlNlY3Rpb24+ID0gW107XG5cdGNvbnN0IHRhYmxlQ29udGVudDogQXJyYXk8T2JqZWN0UGFnZVN1YlNlY3Rpb24+ID0gW107XG5cdGNvbnN0IGluZGV4OiBBcnJheTxudW1iZXI+ID0gW107XG5cdGxldCB1bnN1cHBvcnRlZFRleHQgPSBcIlwiO1xuXHRsZXZlbCsrO1xuXHRzd2l0Y2ggKGZhY2V0RGVmaW5pdGlvbi4kVHlwZSkge1xuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuQ29sbGVjdGlvbkZhY2V0OlxuXHRcdFx0Y29uc3QgZmFjZXRzID0gZmFjZXREZWZpbml0aW9uLkZhY2V0cztcblx0XHRcdGlmIChoYXNUYWJsZShmYWNldHMpKSB7XG5cdFx0XHRcdC8vIGlmIHdlIGhhdmUgdGFibGVzIGluIGEgY29sbGVjdGlvbiBmYWNldCB0aGVuIHdlIGNyZWF0ZSBzZXBhcmF0ZSBzdWJzZWN0aW9uIGZvciB0aGVtXG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgZmFjZXRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0aWYgKHRhcmdldFRlcm1zLmluZGV4T2YoKGZhY2V0c1tpXSBhcyBhbnkpLlRhcmdldD8uJHRhcmdldD8udGVybSkgPiAtMSkge1xuXHRcdFx0XHRcdFx0Ly9jcmVhdGluZyBzZXBhcmF0ZSBhcnJheSBmb3IgdGFibGVzXG5cdFx0XHRcdFx0XHR0YWJsZUNvbnRlbnQucHVzaChjcmVhdGVTdWJTZWN0aW9uKGZhY2V0c1tpXSwgW10sIGNvbnZlcnRlckNvbnRleHQsIGxldmVsLCBmYWNldHMubGVuZ3RoID09PSAxKSk7XG5cdFx0XHRcdFx0XHRpbmRleC5wdXNoKGkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRmb3IgKGxldCBpID0gaW5kZXgubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdFx0XHQvL3JlbW92ZSB0YWJsZSBmYWNldHMgZnJvbSBmYWNldCBkZWZpbml0aW9uXG5cdFx0XHRcdFx0ZmFjZXRzLnNwbGljZShpbmRleFtpXSwgMSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGZhY2V0cy5sZW5ndGgpIHtcblx0XHRcdFx0XHRmYWNldERlZmluaXRpb24uRmFjZXRzID0gZmFjZXRzO1xuXHRcdFx0XHRcdC8vY3JlYXRlIGEgZm9ybSBzdWJzZWN0aW9uIGZyb20gdGhlIHJlbWFpbmluZyBmYWNldHNcblx0XHRcdFx0XHRjb250ZW50LnB1c2goY3JlYXRlU3ViU2VjdGlvbihmYWNldERlZmluaXRpb24sIFtdLCBjb252ZXJ0ZXJDb250ZXh0LCBsZXZlbCwgaGFzU2luZ2xlQ29udGVudCkpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnRlbnQgPSBjb250ZW50LmNvbmNhdCh0YWJsZUNvbnRlbnQpO1xuXHRcdFx0XHRjb25zdCBtaXhlZFN1YlNlY3Rpb246IE1peGVkU3ViU2VjdGlvbiA9IHtcblx0XHRcdFx0XHQuLi5zdWJTZWN0aW9uLFxuXHRcdFx0XHRcdHR5cGU6IFN1YlNlY3Rpb25UeXBlLk1peGVkLFxuXHRcdFx0XHRcdGxldmVsOiBsZXZlbCxcblx0XHRcdFx0XHRjb250ZW50OiBjb250ZW50XG5cdFx0XHRcdH07XG5cdFx0XHRcdHJldHVybiBtaXhlZFN1YlNlY3Rpb247XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCBmb3JtQ29sbGVjdGlvblN1YlNlY3Rpb246IEZvcm1TdWJTZWN0aW9uID0ge1xuXHRcdFx0XHRcdC4uLnN1YlNlY3Rpb24sXG5cdFx0XHRcdFx0dHlwZTogU3ViU2VjdGlvblR5cGUuRm9ybSxcblx0XHRcdFx0XHRmb3JtRGVmaW5pdGlvbjogY3JlYXRlRm9ybURlZmluaXRpb24oZmFjZXREZWZpbml0aW9uLCBjb252ZXJ0ZXJDb250ZXh0KSxcblx0XHRcdFx0XHRsZXZlbDogbGV2ZWwsXG5cdFx0XHRcdFx0YWN0aW9uczogZ2V0RmFjZXRBY3Rpb25zKGZhY2V0RGVmaW5pdGlvbiwgY29udmVydGVyQ29udGV4dClcblx0XHRcdFx0fTtcblx0XHRcdFx0cmV0dXJuIGZvcm1Db2xsZWN0aW9uU3ViU2VjdGlvbjtcblx0XHRcdH1cblx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLlJlZmVyZW5jZUZhY2V0OlxuXHRcdFx0aWYgKCFmYWNldERlZmluaXRpb24uVGFyZ2V0LiR0YXJnZXQpIHtcblx0XHRcdFx0dW5zdXBwb3J0ZWRUZXh0ID0gYFVuYWJsZSB0byBmaW5kIGFubm90YXRpb25QYXRoICR7ZmFjZXREZWZpbml0aW9uLlRhcmdldC52YWx1ZX1gO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c3dpdGNoIChmYWNldERlZmluaXRpb24uVGFyZ2V0LiR0YXJnZXQudGVybSkge1xuXHRcdFx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVGVybXMuTGluZUl0ZW06XG5cdFx0XHRcdFx0Y2FzZSBVSUFubm90YXRpb25UZXJtcy5DaGFydDpcblx0XHRcdFx0XHRjYXNlIFVJQW5ub3RhdGlvblRlcm1zLlByZXNlbnRhdGlvblZhcmlhbnQ6XG5cdFx0XHRcdFx0Y2FzZSBVSUFubm90YXRpb25UZXJtcy5TZWxlY3Rpb25QcmVzZW50YXRpb25WYXJpYW50OlxuXHRcdFx0XHRcdFx0Y29uc3QgcHJlc2VudGF0aW9uID0gZ2V0RGF0YVZpc3VhbGl6YXRpb25Db25maWd1cmF0aW9uKFxuXHRcdFx0XHRcdFx0XHRmYWNldERlZmluaXRpb24uVGFyZ2V0LnZhbHVlLFxuXHRcdFx0XHRcdFx0XHRnZXRDb25kZW5zZWRUYWJsZUxheW91dENvbXBsaWFuY2UoZmFjZXREZWZpbml0aW9uLCBmYWNldHNUb0NyZWF0ZSwgY29udmVydGVyQ29udGV4dCksXG5cdFx0XHRcdFx0XHRcdGNvbnZlcnRlckNvbnRleHRcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRsZXQgY29udHJvbFRpdGxlID0gKHByZXNlbnRhdGlvbi52aXN1YWxpemF0aW9uc1swXSBhcyBhbnkpPy5hbm5vdGF0aW9uPy50aXRsZTtcblx0XHRcdFx0XHRcdGNvbnRyb2xUaXRsZSA/IGNvbnRyb2xUaXRsZSA6IChjb250cm9sVGl0bGUgPSAocHJlc2VudGF0aW9uLnZpc3VhbGl6YXRpb25zWzBdIGFzIGFueSk/LnRpdGxlKTtcblx0XHRcdFx0XHRcdGNvbnN0IGRhdGFWaXN1YWxpemF0aW9uU3ViU2VjdGlvbjogRGF0YVZpc3VhbGl6YXRpb25TdWJTZWN0aW9uID0ge1xuXHRcdFx0XHRcdFx0XHQuLi5zdWJTZWN0aW9uLFxuXHRcdFx0XHRcdFx0XHR0eXBlOiBTdWJTZWN0aW9uVHlwZS5EYXRhVmlzdWFsaXphdGlvbixcblx0XHRcdFx0XHRcdFx0bGV2ZWw6IGxldmVsLFxuXHRcdFx0XHRcdFx0XHRwcmVzZW50YXRpb246IHByZXNlbnRhdGlvbixcblx0XHRcdFx0XHRcdFx0c2hvd1RpdGxlOiBpc1N1YnNlY3Rpb25UaXRsZVNob3duKGhhc1NpbmdsZUNvbnRlbnQsIHN1YlNlY3Rpb24udGl0bGUsIGNvbnRyb2xUaXRsZSlcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRyZXR1cm4gZGF0YVZpc3VhbGl6YXRpb25TdWJTZWN0aW9uO1xuXG5cdFx0XHRcdFx0Y2FzZSBVSUFubm90YXRpb25UZXJtcy5GaWVsZEdyb3VwOlxuXHRcdFx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVGVybXMuSWRlbnRpZmljYXRpb246XG5cdFx0XHRcdFx0Y2FzZSBVSUFubm90YXRpb25UZXJtcy5EYXRhUG9pbnQ6XG5cdFx0XHRcdFx0Y2FzZSBVSUFubm90YXRpb25UZXJtcy5TdGF0dXNJbmZvOlxuXHRcdFx0XHRcdGNhc2UgQ29tbXVuaWNhdGlvbkFubm90YXRpb25UZXJtcy5Db250YWN0OlxuXHRcdFx0XHRcdFx0Ly8gQWxsIHRob3NlIGVsZW1lbnQgYmVsb25nIHRvIGEgZm9ybSBmYWNldFxuXHRcdFx0XHRcdFx0Y29uc3QgZm9ybUVsZW1lbnRTdWJTZWN0aW9uOiBGb3JtU3ViU2VjdGlvbiA9IHtcblx0XHRcdFx0XHRcdFx0Li4uc3ViU2VjdGlvbixcblx0XHRcdFx0XHRcdFx0dHlwZTogU3ViU2VjdGlvblR5cGUuRm9ybSxcblx0XHRcdFx0XHRcdFx0bGV2ZWw6IGxldmVsLFxuXHRcdFx0XHRcdFx0XHRmb3JtRGVmaW5pdGlvbjogY3JlYXRlRm9ybURlZmluaXRpb24oZmFjZXREZWZpbml0aW9uLCBjb252ZXJ0ZXJDb250ZXh0KSxcblx0XHRcdFx0XHRcdFx0YWN0aW9uczogZ2V0RmFjZXRBY3Rpb25zKGZhY2V0RGVmaW5pdGlvbiwgY29udmVydGVyQ29udGV4dClcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRyZXR1cm4gZm9ybUVsZW1lbnRTdWJTZWN0aW9uO1xuXG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdHVuc3VwcG9ydGVkVGV4dCA9IGBGb3IgJHtmYWNldERlZmluaXRpb24uVGFyZ2V0LiR0YXJnZXQudGVybX0gRnJhZ21lbnRgO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuUmVmZXJlbmNlVVJMRmFjZXQ6XG5cdFx0XHR1bnN1cHBvcnRlZFRleHQgPSBcIkZvciBSZWZlcmVuY2UgVVJMIEZhY2V0XCI7XG5cdFx0XHRicmVhaztcblx0XHRkZWZhdWx0OlxuXHRcdFx0YnJlYWs7XG5cdH1cblx0Ly8gSWYgd2UgcmVhY2ggaGVyZSB3ZSBlbmRlZCB1cCB3aXRoIGFuIHVuc3VwcG9ydGVkIFN1YlNlY3Rpb24gdHlwZVxuXHRjb25zdCB1bnN1cHBvcnRlZFN1YlNlY3Rpb246IFVuc3VwcG9ydGVkU3ViU2VjdGlvbiA9IHtcblx0XHQuLi5zdWJTZWN0aW9uLFxuXHRcdHRleHQ6IHVuc3VwcG9ydGVkVGV4dFxuXHR9O1xuXHRyZXR1cm4gdW5zdXBwb3J0ZWRTdWJTZWN0aW9uO1xufVxuZnVuY3Rpb24gaXNTdWJzZWN0aW9uVGl0bGVTaG93bihoYXNTaW5nbGVDb250ZW50OiBib29sZWFuLCBzdWJTZWN0aW9uVGl0bGU6IEJpbmRpbmdFeHByZXNzaW9uPHN0cmluZz4sIGNvbnRyb2xUaXRsZTogc3RyaW5nKTogYm9vbGVhbiB7XG5cdGlmIChoYXNTaW5nbGVDb250ZW50ICYmIGNvbnRyb2xUaXRsZSA9PT0gc3ViU2VjdGlvblRpdGxlKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdHJldHVybiB0cnVlO1xufVxuZnVuY3Rpb24gY3JlYXRlRm9ybUFjdGlvblJlZHVjZXIoXG5cdGFjdGlvbnM6IENvbnZlcnRlckFjdGlvbltdLFxuXHRmYWNldERlZmluaXRpb246IFJlZmVyZW5jZUZhY2V0VHlwZXMsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHRcbik6IENvbnZlcnRlckFjdGlvbltdIHtcblx0Y29uc3QgcmVmZXJlbmNlVGFyZ2V0OiBBbm5vdGF0aW9uVGVybTxhbnk+ID0gZmFjZXREZWZpbml0aW9uLlRhcmdldC4kdGFyZ2V0O1xuXHRjb25zdCB0YXJnZXRWYWx1ZSA9IGZhY2V0RGVmaW5pdGlvbi5UYXJnZXQudmFsdWU7XG5cdGxldCBtYW5pZmVzdEFjdGlvbnM6IFJlY29yZDxzdHJpbmcsIEN1c3RvbUFjdGlvbj4gPSB7fTtcblx0bGV0IGRhdGFGaWVsZENvbGxlY3Rpb246IERhdGFGaWVsZEFic3RyYWN0VHlwZXNbXSA9IFtdO1xuXHRsZXQgW25hdmlnYXRpb25Qcm9wZXJ0eVBhdGhdOiBhbnkgPSB0YXJnZXRWYWx1ZS5zcGxpdChcIkBcIik7XG5cdGlmIChuYXZpZ2F0aW9uUHJvcGVydHlQYXRoLmxlbmd0aCA+IDApIHtcblx0XHRpZiAobmF2aWdhdGlvblByb3BlcnR5UGF0aC5sYXN0SW5kZXhPZihcIi9cIikgPT09IG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgubGVuZ3RoIC0gMSkge1xuXHRcdFx0bmF2aWdhdGlvblByb3BlcnR5UGF0aCA9IG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGguc3Vic3RyKDAsIG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgubGVuZ3RoIC0gMSk7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGggPSB1bmRlZmluZWQ7XG5cdH1cblxuXHRpZiAocmVmZXJlbmNlVGFyZ2V0KSB7XG5cdFx0c3dpdGNoIChyZWZlcmVuY2VUYXJnZXQudGVybSkge1xuXHRcdFx0Y2FzZSBVSUFubm90YXRpb25UZXJtcy5GaWVsZEdyb3VwOlxuXHRcdFx0XHRkYXRhRmllbGRDb2xsZWN0aW9uID0gKHJlZmVyZW5jZVRhcmdldCBhcyBGaWVsZEdyb3VwKS5EYXRhO1xuXHRcdFx0XHRtYW5pZmVzdEFjdGlvbnMgPSBnZXRBY3Rpb25zRnJvbU1hbmlmZXN0KFxuXHRcdFx0XHRcdGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RDb250cm9sQ29uZmlndXJhdGlvbihyZWZlcmVuY2VUYXJnZXQpLmFjdGlvbnMsXG5cdFx0XHRcdFx0Y29udmVydGVyQ29udGV4dFxuXHRcdFx0XHQpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVGVybXMuSWRlbnRpZmljYXRpb246XG5cdFx0XHRjYXNlIFVJQW5ub3RhdGlvblRlcm1zLlN0YXR1c0luZm86XG5cdFx0XHRcdGlmIChyZWZlcmVuY2VUYXJnZXQucXVhbGlmaWVyKSB7XG5cdFx0XHRcdFx0ZGF0YUZpZWxkQ29sbGVjdGlvbiA9IHJlZmVyZW5jZVRhcmdldCBhcyBJZGVudGlmaWNhdGlvbiB8IFN0YXR1c0luZm87XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGRhdGFGaWVsZENvbGxlY3Rpb24ucmVkdWNlKChhY3Rpb25zLCBkYXRhRmllbGQ6IERhdGFGaWVsZEFic3RyYWN0VHlwZXMpID0+IHtcblx0XHRjb25zdCBVSUFubm90YXRpb246IGFueSA9IGRhdGFGaWVsZD8uYW5ub3RhdGlvbnM/LlVJO1xuXHRcdHN3aXRjaCAoZGF0YUZpZWxkLiRUeXBlKSB7XG5cdFx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvbjpcblx0XHRcdFx0aWYgKGRhdGFGaWVsZC5SZXF1aXJlc0NvbnRleHQ/LnZhbHVlT2YoKSA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdGNvbnZlcnRlckNvbnRleHRcblx0XHRcdFx0XHRcdC5nZXREaWFnbm9zdGljcygpXG5cdFx0XHRcdFx0XHQuYWRkSXNzdWUoSXNzdWVDYXRlZ29yeS5Bbm5vdGF0aW9uLCBJc3N1ZVNldmVyaXR5LkxvdywgSXNzdWVUeXBlLk1BTEZPUk1FRF9EQVRBRklFTERfRk9SX0lCTi5SRVFVSVJFU0NPTlRFWFQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChkYXRhRmllbGQuSW5saW5lPy52YWx1ZU9mKCkgPT09IHRydWUpIHtcblx0XHRcdFx0XHRjb252ZXJ0ZXJDb250ZXh0XG5cdFx0XHRcdFx0XHQuZ2V0RGlhZ25vc3RpY3MoKVxuXHRcdFx0XHRcdFx0LmFkZElzc3VlKElzc3VlQ2F0ZWdvcnkuQW5ub3RhdGlvbiwgSXNzdWVTZXZlcml0eS5Mb3csIElzc3VlVHlwZS5NQUxGT1JNRURfREFUQUZJRUxEX0ZPUl9JQk4uSU5MSU5FKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjb25zdCBtTmF2aWdhdGlvblBhcmFtZXRlcnM6IGFueSA9IHt9O1xuXHRcdFx0XHRpZiAoZGF0YUZpZWxkLk1hcHBpbmcpIHtcblx0XHRcdFx0XHRtTmF2aWdhdGlvblBhcmFtZXRlcnMuc2VtYW50aWNPYmplY3RNYXBwaW5nID0gZ2V0U2VtYW50aWNPYmplY3RNYXBwaW5nKGRhdGFGaWVsZC5NYXBwaW5nKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRhY3Rpb25zLnB1c2goe1xuXHRcdFx0XHRcdHR5cGU6IEFjdGlvblR5cGUuRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uLFxuXHRcdFx0XHRcdGlkOiBGb3JtSUQoeyBGYWNldDogZmFjZXREZWZpbml0aW9uIH0sIGRhdGFGaWVsZCksXG5cdFx0XHRcdFx0a2V5OiBLZXlIZWxwZXIuZ2VuZXJhdGVLZXlGcm9tRGF0YUZpZWxkKGRhdGFGaWVsZCksXG5cdFx0XHRcdFx0dGV4dDogZGF0YUZpZWxkLkxhYmVsPy50b1N0cmluZygpLFxuXHRcdFx0XHRcdGFubm90YXRpb25QYXRoOiBcIlwiLFxuXHRcdFx0XHRcdGVuYWJsZWQ6XG5cdFx0XHRcdFx0XHRkYXRhRmllbGQuTmF2aWdhdGlvbkF2YWlsYWJsZSAhPT0gdW5kZWZpbmVkXG5cdFx0XHRcdFx0XHRcdD8gY29tcGlsZUJpbmRpbmcoZXF1YWwoYW5ub3RhdGlvbkV4cHJlc3Npb24oZGF0YUZpZWxkLk5hdmlnYXRpb25BdmFpbGFibGU/LnZhbHVlT2YoKSksIHRydWUpKVxuXHRcdFx0XHRcdFx0XHQ6IHRydWUsXG5cdFx0XHRcdFx0dmlzaWJsZTogY29tcGlsZUJpbmRpbmcobm90KGVxdWFsKGFubm90YXRpb25FeHByZXNzaW9uKGRhdGFGaWVsZC5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbj8udmFsdWVPZigpKSwgdHJ1ZSkpKSxcblx0XHRcdFx0XHRidXR0b25UeXBlOiBnZXRCdXR0b25UeXBlKFVJQW5ub3RhdGlvbj8uRW1waGFzaXplZCksXG5cdFx0XHRcdFx0cHJlc3M6IGNvbXBpbGVCaW5kaW5nKFxuXHRcdFx0XHRcdFx0Zm4oXCIuX2ludGVudEJhc2VkTmF2aWdhdGlvbi5uYXZpZ2F0ZVwiLCBbXG5cdFx0XHRcdFx0XHRcdGFubm90YXRpb25FeHByZXNzaW9uKGRhdGFGaWVsZC5TZW1hbnRpY09iamVjdCksXG5cdFx0XHRcdFx0XHRcdGFubm90YXRpb25FeHByZXNzaW9uKGRhdGFGaWVsZC5BY3Rpb24pLFxuXHRcdFx0XHRcdFx0XHRtTmF2aWdhdGlvblBhcmFtZXRlcnNcblx0XHRcdFx0XHRcdF0pXG5cdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRjdXN0b21EYXRhOiBjb21waWxlQmluZGluZyh7XG5cdFx0XHRcdFx0XHRzZW1hbnRpY09iamVjdDogYW5ub3RhdGlvbkV4cHJlc3Npb24oZGF0YUZpZWxkLlNlbWFudGljT2JqZWN0KSxcblx0XHRcdFx0XHRcdGFjdGlvbjogYW5ub3RhdGlvbkV4cHJlc3Npb24oZGF0YUZpZWxkLkFjdGlvbilcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZEZvckFjdGlvbjpcblx0XHRcdFx0Y29uc3QgZm9ybU1hbmlmZXN0QWN0aW9uc0NvbmZpZ3VyYXRpb246IGFueSA9IGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RDb250cm9sQ29uZmlndXJhdGlvbihyZWZlcmVuY2VUYXJnZXQpLmFjdGlvbnM7XG5cdFx0XHRcdGNvbnN0IGtleTogc3RyaW5nID0gS2V5SGVscGVyLmdlbmVyYXRlS2V5RnJvbURhdGFGaWVsZChkYXRhRmllbGQpO1xuXHRcdFx0XHRhY3Rpb25zLnB1c2goe1xuXHRcdFx0XHRcdHR5cGU6IEFjdGlvblR5cGUuRGF0YUZpZWxkRm9yQWN0aW9uLFxuXHRcdFx0XHRcdGlkOiBGb3JtSUQoeyBGYWNldDogZmFjZXREZWZpbml0aW9uIH0sIGRhdGFGaWVsZCksXG5cdFx0XHRcdFx0a2V5OiBrZXksXG5cdFx0XHRcdFx0dGV4dDogZGF0YUZpZWxkLkxhYmVsPy50b1N0cmluZygpLFxuXHRcdFx0XHRcdGFubm90YXRpb25QYXRoOiBcIlwiLFxuXHRcdFx0XHRcdGVuYWJsZWQ6IGdldEVuYWJsZWRCaW5kaW5nKGRhdGFGaWVsZC5BY3Rpb25UYXJnZXQpLFxuXHRcdFx0XHRcdGJpbmRpbmc6IG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGggPyBcInsgJ3BhdGgnIDogJ1wiICsgbmF2aWdhdGlvblByb3BlcnR5UGF0aCArIFwiJ31cIiA6IHVuZGVmaW5lZCxcblx0XHRcdFx0XHR2aXNpYmxlOiBjb21waWxlQmluZGluZyhub3QoZXF1YWwoYW5ub3RhdGlvbkV4cHJlc3Npb24oZGF0YUZpZWxkLmFubm90YXRpb25zPy5VST8uSGlkZGVuPy52YWx1ZU9mKCkpLCB0cnVlKSkpLFxuXHRcdFx0XHRcdHJlcXVpcmVzRGlhbG9nOiBpc0RpYWxvZyhkYXRhRmllbGQuQWN0aW9uVGFyZ2V0KSxcblx0XHRcdFx0XHRidXR0b25UeXBlOiBnZXRCdXR0b25UeXBlKFVJQW5ub3RhdGlvbj8uRW1waGFzaXplZCksXG5cdFx0XHRcdFx0cHJlc3M6IGNvbXBpbGVCaW5kaW5nKFxuXHRcdFx0XHRcdFx0Zm4oXG5cdFx0XHRcdFx0XHRcdFwiaW52b2tlQWN0aW9uXCIsXG5cdFx0XHRcdFx0XHRcdFtcblx0XHRcdFx0XHRcdFx0XHRkYXRhRmllbGQuQWN0aW9uLFxuXHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnRleHRzOiBmbihcImdldEJpbmRpbmdDb250ZXh0XCIsIFtdLCBiaW5kaW5nRXhwcmVzc2lvbihcIlwiLCBcIiRzb3VyY2VcIikpLFxuXHRcdFx0XHRcdFx0XHRcdFx0aW52b2NhdGlvbkdyb3VwaW5nOiAoZGF0YUZpZWxkLkludm9jYXRpb25Hcm91cGluZyA9PT0gXCJVSS5PcGVyYXRpb25Hcm91cGluZ1R5cGUvQ2hhbmdlU2V0XCJcblx0XHRcdFx0XHRcdFx0XHRcdFx0PyBcIkNoYW5nZVNldFwiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdDogXCJJc29sYXRlZFwiKSBhcyBPcGVyYXRpb25Hcm91cGluZ1R5cGUsXG5cdFx0XHRcdFx0XHRcdFx0XHRsYWJlbDogYW5ub3RhdGlvbkV4cHJlc3Npb24oZGF0YUZpZWxkLkxhYmVsKSxcblx0XHRcdFx0XHRcdFx0XHRcdG1vZGVsOiBmbihcImdldE1vZGVsXCIsIFtdLCBiaW5kaW5nRXhwcmVzc2lvbihcIi9cIiwgXCIkc291cmNlXCIpKSxcblx0XHRcdFx0XHRcdFx0XHRcdGlzTmF2aWdhYmxlOiBpc0FjdGlvbk5hdmlnYWJsZShcblx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9ybU1hbmlmZXN0QWN0aW9uc0NvbmZpZ3VyYXRpb24gJiYgZm9ybU1hbmlmZXN0QWN0aW9uc0NvbmZpZ3VyYXRpb25ba2V5XVxuXHRcdFx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XSxcblx0XHRcdFx0XHRcdFx0cmVmKFwiLmVkaXRGbG93XCIpXG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXHRcdGFjdGlvbnMgPSBpbnNlcnRDdXN0b21FbGVtZW50cyhhY3Rpb25zLCBtYW5pZmVzdEFjdGlvbnMpO1xuXHRcdHJldHVybiBhY3Rpb25zO1xuXHR9LCBhY3Rpb25zKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRGlhbG9nKGFjdGlvbkRlZmluaXRpb246IGFueSB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG5cdGlmIChhY3Rpb25EZWZpbml0aW9uKSB7XG5cdFx0Y29uc3QgYkNyaXRpY2FsID0gYWN0aW9uRGVmaW5pdGlvbi5hbm5vdGF0aW9ucz8uQ29tbW9uPy5Jc0FjdGlvbkNyaXRpY2FsO1xuXHRcdGlmIChhY3Rpb25EZWZpbml0aW9uLnBhcmFtZXRlcnMubGVuZ3RoID4gMSB8fCBiQ3JpdGljYWwpIHtcblx0XHRcdHJldHVybiBcIkRpYWxvZ1wiO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gXCJOb25lXCI7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBcIk5vbmVcIjtcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ3VzdG9tU3ViU2VjdGlvbnMoXG5cdG1hbmlmZXN0U3ViU2VjdGlvbnM6IFJlY29yZDxzdHJpbmcsIE1hbmlmZXN0U3ViU2VjdGlvbj4sXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHRcbik6IFJlY29yZDxzdHJpbmcsIEN1c3RvbU9iamVjdFBhZ2VTdWJTZWN0aW9uPiB7XG5cdGNvbnN0IHN1YlNlY3Rpb25zOiBSZWNvcmQ8c3RyaW5nLCBDdXN0b21PYmplY3RQYWdlU3ViU2VjdGlvbj4gPSB7fTtcblx0T2JqZWN0LmtleXMobWFuaWZlc3RTdWJTZWN0aW9ucykuZm9yRWFjaChcblx0XHRzdWJTZWN0aW9uS2V5ID0+XG5cdFx0XHQoc3ViU2VjdGlvbnNbc3ViU2VjdGlvbktleV0gPSBjcmVhdGVDdXN0b21TdWJTZWN0aW9uKG1hbmlmZXN0U3ViU2VjdGlvbnNbc3ViU2VjdGlvbktleV0sIHN1YlNlY3Rpb25LZXksIGNvbnZlcnRlckNvbnRleHQpKVxuXHQpO1xuXHRyZXR1cm4gc3ViU2VjdGlvbnM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDdXN0b21TdWJTZWN0aW9uKFxuXHRtYW5pZmVzdFN1YlNlY3Rpb246IE1hbmlmZXN0U3ViU2VjdGlvbixcblx0c3ViU2VjdGlvbktleTogc3RyaW5nLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0XG4pOiBDdXN0b21PYmplY3RQYWdlU3ViU2VjdGlvbiB7XG5cdGNvbnN0IHNpZGVDb250ZW50OiBTaWRlQ29udGVudERlZiB8IHVuZGVmaW5lZCA9IG1hbmlmZXN0U3ViU2VjdGlvbi5zaWRlQ29udGVudFxuXHRcdD8ge1xuXHRcdFx0XHR0ZW1wbGF0ZTogbWFuaWZlc3RTdWJTZWN0aW9uLnNpZGVDb250ZW50LnRlbXBsYXRlLFxuXHRcdFx0XHRpZDogU2lkZUNvbnRlbnRJRChzdWJTZWN0aW9uS2V5KSxcblx0XHRcdFx0dmlzaWJsZTogZmFsc2Vcblx0XHQgIH1cblx0XHQ6IHVuZGVmaW5lZDtcblx0bGV0IHBvc2l0aW9uID0gbWFuaWZlc3RTdWJTZWN0aW9uLnBvc2l0aW9uO1xuXHRpZiAoIXBvc2l0aW9uKSB7XG5cdFx0cG9zaXRpb24gPSB7XG5cdFx0XHRwbGFjZW1lbnQ6IFBsYWNlbWVudC5BZnRlclxuXHRcdH07XG5cdH1cblx0Y29uc3Qgc3ViU2VjdGlvbkRlZmluaXRpb24gPSB7XG5cdFx0dHlwZTogU3ViU2VjdGlvblR5cGUuVW5rbm93bixcblx0XHRpZDogbWFuaWZlc3RTdWJTZWN0aW9uLmlkIHx8IEN1c3RvbVN1YlNlY3Rpb25JRChzdWJTZWN0aW9uS2V5KSxcblx0XHRhY3Rpb25zOiBnZXRBY3Rpb25zRnJvbU1hbmlmZXN0KG1hbmlmZXN0U3ViU2VjdGlvbi5hY3Rpb25zLCBjb252ZXJ0ZXJDb250ZXh0KSxcblx0XHRrZXk6IHN1YlNlY3Rpb25LZXksXG5cdFx0dGl0bGU6IG1hbmlmZXN0U3ViU2VjdGlvbi50aXRsZSxcblx0XHRsZXZlbDogMSxcblx0XHRwb3NpdGlvbjogcG9zaXRpb24sXG5cdFx0dmlzaWJsZTogbWFuaWZlc3RTdWJTZWN0aW9uLnZpc2libGUsXG5cdFx0c2lkZUNvbnRlbnQ6IHNpZGVDb250ZW50XG5cdH07XG5cdGlmIChtYW5pZmVzdFN1YlNlY3Rpb24udGVtcGxhdGUgfHwgbWFuaWZlc3RTdWJTZWN0aW9uLm5hbWUpIHtcblx0XHRzdWJTZWN0aW9uRGVmaW5pdGlvbi50eXBlID0gU3ViU2VjdGlvblR5cGUuWE1MRnJhZ21lbnQ7XG5cdFx0KChzdWJTZWN0aW9uRGVmaW5pdGlvbiBhcyB1bmtub3duKSBhcyBYTUxGcmFnbWVudFN1YlNlY3Rpb24pLnRlbXBsYXRlID1cblx0XHRcdG1hbmlmZXN0U3ViU2VjdGlvbi50ZW1wbGF0ZSB8fCBtYW5pZmVzdFN1YlNlY3Rpb24ubmFtZSB8fCBcIlwiO1xuXHR9IGVsc2Uge1xuXHRcdHN1YlNlY3Rpb25EZWZpbml0aW9uLnR5cGUgPSBTdWJTZWN0aW9uVHlwZS5QbGFjZWhvbGRlcjtcblx0fVxuXHRyZXR1cm4gc3ViU2VjdGlvbkRlZmluaXRpb24gYXMgQ3VzdG9tT2JqZWN0UGFnZVN1YlNlY3Rpb247XG59XG5cbi8qKlxuICogRXZhbHVhdGUgaWYgdGhlIGNvbmRlbnNlZCBtb2RlIGNhbiBiZSBhcHBsaTNlZCBvbiB0aGUgdGFibGUuXG4gKlxuICogQHBhcmFtIGN1cnJlbnRGYWNldFxuICogQHBhcmFtIGZhY2V0c1RvQ3JlYXRlSW5TZWN0aW9uXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSAgdHJ1ZSBmb3IgY29tcGxpYW50LCBmYWxzZSBvdGhlcndpc2VcbiAqL1xuZnVuY3Rpb24gZ2V0Q29uZGVuc2VkVGFibGVMYXlvdXRDb21wbGlhbmNlKFxuXHRjdXJyZW50RmFjZXQ6IEZhY2V0VHlwZXMsXG5cdGZhY2V0c1RvQ3JlYXRlSW5TZWN0aW9uOiBGYWNldFR5cGVzW10sXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHRcbik6IGJvb2xlYW4ge1xuXHRjb25zdCBtYW5pZmVzdFdyYXBwZXIgPSBjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0V3JhcHBlcigpO1xuXHRpZiAobWFuaWZlc3RXcmFwcGVyLnVzZUljb25UYWJCYXIoKSkge1xuXHRcdC8vIElmIHRoZSBPUCB1c2UgdGhlIHRhYiBiYXNlZCB3ZSBjaGVjayBpZiB0aGUgZmFjZXRzIHRoYXQgd2lsbCBiZSBjcmVhdGVkIGZvciB0aGlzIHNlY3Rpb24gYXJlIGFsbCBub24gdmlzaWJsZVxuXHRcdHJldHVybiBoYXNOb090aGVyVmlzaWJsZVRhYmxlSW5UYXJnZXRzKGN1cnJlbnRGYWNldCwgZmFjZXRzVG9DcmVhdGVJblNlY3Rpb24pO1xuXHR9IGVsc2Uge1xuXHRcdGNvbnN0IGVudGl0eVR5cGUgPSBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVR5cGUoKTtcblx0XHRpZiAoZW50aXR5VHlwZS5hbm5vdGF0aW9ucz8uVUk/LkZhY2V0cz8ubGVuZ3RoICYmIGVudGl0eVR5cGUuYW5ub3RhdGlvbnM/LlVJPy5GYWNldHM/Lmxlbmd0aCA+IDEpIHtcblx0XHRcdHJldHVybiBoYXNOb090aGVyVmlzaWJsZVRhYmxlSW5UYXJnZXRzKGN1cnJlbnRGYWNldCwgZmFjZXRzVG9DcmVhdGVJblNlY3Rpb24pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gaGFzTm9PdGhlclZpc2libGVUYWJsZUluVGFyZ2V0cyhjdXJyZW50RmFjZXQ6IEZhY2V0VHlwZXMsIGZhY2V0c1RvQ3JlYXRlSW5TZWN0aW9uOiBGYWNldFR5cGVzW10pOiBib29sZWFuIHtcblx0cmV0dXJuIGZhY2V0c1RvQ3JlYXRlSW5TZWN0aW9uLmV2ZXJ5KGZ1bmN0aW9uKHN1YkZhY2V0KSB7XG5cdFx0aWYgKHN1YkZhY2V0ICE9PSBjdXJyZW50RmFjZXQpIHtcblx0XHRcdGlmIChzdWJGYWNldC4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuUmVmZXJlbmNlRmFjZXQpIHtcblx0XHRcdFx0Y29uc3QgcmVmRmFjZXQgPSBzdWJGYWNldCBhcyBSZWZlcmVuY2VGYWNldFR5cGVzO1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0cmVmRmFjZXQuVGFyZ2V0Py4kdGFyZ2V0Py50ZXJtID09PSBVSUFubm90YXRpb25UZXJtcy5MaW5lSXRlbSB8fFxuXHRcdFx0XHRcdHJlZkZhY2V0LlRhcmdldD8uJHRhcmdldD8udGVybSA9PT0gVUlBbm5vdGF0aW9uVGVybXMuUHJlc2VudGF0aW9uVmFyaWFudCB8fFxuXHRcdFx0XHRcdHJlZkZhY2V0LlRhcmdldC4kdGFyZ2V0Py50ZXJtID09PSBVSUFubm90YXRpb25UZXJtcy5TZWxlY3Rpb25QcmVzZW50YXRpb25WYXJpYW50XG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdHJldHVybiByZWZGYWNldC5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbiAhPT0gdW5kZWZpbmVkID8gcmVmRmFjZXQuYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4gOiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IHN1YkNvbGxlY3Rpb25GYWNldCA9IHN1YkZhY2V0IGFzIENvbGxlY3Rpb25GYWNldFR5cGVzO1xuXHRcdFx0XHRyZXR1cm4gc3ViQ29sbGVjdGlvbkZhY2V0LkZhY2V0cy5ldmVyeShmdW5jdGlvbihmYWNldCkge1xuXHRcdFx0XHRcdGNvbnN0IHN1YlJlZkZhY2V0ID0gZmFjZXQgYXMgUmVmZXJlbmNlRmFjZXRUeXBlcztcblx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHRzdWJSZWZGYWNldC5UYXJnZXQ/LiR0YXJnZXQ/LnRlcm0gPT09IFVJQW5ub3RhdGlvblRlcm1zLkxpbmVJdGVtIHx8XG5cdFx0XHRcdFx0XHRzdWJSZWZGYWNldC5UYXJnZXQ/LiR0YXJnZXQ/LnRlcm0gPT09IFVJQW5ub3RhdGlvblRlcm1zLlByZXNlbnRhdGlvblZhcmlhbnQgfHxcblx0XHRcdFx0XHRcdHN1YlJlZkZhY2V0LlRhcmdldD8uJHRhcmdldD8udGVybSA9PT0gVUlBbm5vdGF0aW9uVGVybXMuU2VsZWN0aW9uUHJlc2VudGF0aW9uVmFyaWFudFxuXHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHN1YlJlZkZhY2V0LmFubm90YXRpb25zPy5VST8uSGlkZGVuICE9PSB1bmRlZmluZWQgPyBzdWJSZWZGYWNldC5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbiA6IGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB0cnVlO1xuXHR9KTtcbn1cbiJdfQ==