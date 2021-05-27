sap.ui.define([], function () {
  "use strict";

  var _exports = {};

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

  function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var Path = function Path(pathExpression, targetName, annotationsTerm, annotationType, term) {
    _classCallCheck(this, Path);

    this.path = pathExpression.Path;
    this.type = "Path";
    this.$target = targetName;
    this.term = term, this.annotationType = annotationType, this.annotationsTerm = annotationsTerm;
  };

  var TermToTypes;

  (function (TermToTypes) {
    TermToTypes["Org.OData.Authorization.V1.SecuritySchemes"] = "Org.OData.Authorization.V1.SecurityScheme";
    TermToTypes["Org.OData.Authorization.V1.Authorizations"] = "Org.OData.Authorization.V1.Authorization";
    TermToTypes["Org.OData.Core.V1.Revisions"] = "Org.OData.Core.V1.RevisionType";
    TermToTypes["Org.OData.Core.V1.Links"] = "Org.OData.Core.V1.Link";
    TermToTypes["Org.OData.Core.V1.Example"] = "Org.OData.Core.V1.ExampleValue";
    TermToTypes["Org.OData.Core.V1.Messages"] = "Org.OData.Core.V1.MessageType";
    TermToTypes["Org.OData.Core.V1.ValueException"] = "Org.OData.Core.V1.ValueExceptionType";
    TermToTypes["Org.OData.Core.V1.ResourceException"] = "Org.OData.Core.V1.ResourceExceptionType";
    TermToTypes["Org.OData.Core.V1.DataModificationException"] = "Org.OData.Core.V1.DataModificationExceptionType";
    TermToTypes["Org.OData.Core.V1.IsLanguageDependent"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Core.V1.DereferenceableIDs"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Core.V1.ConventionalIDs"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Core.V1.Permissions"] = "Org.OData.Core.V1.Permission";
    TermToTypes["Org.OData.Core.V1.DefaultNamespace"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Core.V1.Immutable"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Core.V1.Computed"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Core.V1.ComputedDefaultValue"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Core.V1.IsURL"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Core.V1.IsMediaType"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Core.V1.ContentDisposition"] = "Org.OData.Core.V1.ContentDispositionType";
    TermToTypes["Org.OData.Core.V1.OptimisticConcurrency"] = "Edm.PropertyPath";
    TermToTypes["Org.OData.Core.V1.AdditionalProperties"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Core.V1.AutoExpand"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Core.V1.AutoExpandReferences"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Core.V1.MayImplement"] = "Org.OData.Core.V1.QualifiedTypeName";
    TermToTypes["Org.OData.Core.V1.Ordered"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Core.V1.PositionalInsert"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Core.V1.AlternateKeys"] = "Org.OData.Core.V1.AlternateKey";
    TermToTypes["Org.OData.Core.V1.OptionalParameter"] = "Org.OData.Core.V1.OptionalParameterType";
    TermToTypes["Org.OData.Core.V1.OperationAvailable"] = "Edm.Boolean";
    TermToTypes["Org.OData.Core.V1.SymbolicName"] = "Org.OData.Core.V1.SimpleIdentifier";
    TermToTypes["Org.OData.Capabilities.V1.ConformanceLevel"] = "Org.OData.Capabilities.V1.ConformanceLevelType";
    TermToTypes["Org.OData.Capabilities.V1.AsynchronousRequestsSupported"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Capabilities.V1.BatchContinueOnErrorSupported"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Capabilities.V1.IsolationSupported"] = "Org.OData.Capabilities.V1.IsolationLevel";
    TermToTypes["Org.OData.Capabilities.V1.CrossJoinSupported"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Capabilities.V1.CallbackSupported"] = "Org.OData.Capabilities.V1.CallbackType";
    TermToTypes["Org.OData.Capabilities.V1.ChangeTracking"] = "Org.OData.Capabilities.V1.ChangeTrackingType";
    TermToTypes["Org.OData.Capabilities.V1.CountRestrictions"] = "Org.OData.Capabilities.V1.CountRestrictionsType";
    TermToTypes["Org.OData.Capabilities.V1.NavigationRestrictions"] = "Org.OData.Capabilities.V1.NavigationRestrictionsType";
    TermToTypes["Org.OData.Capabilities.V1.IndexableByKey"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Capabilities.V1.TopSupported"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Capabilities.V1.SkipSupported"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Capabilities.V1.ComputeSupported"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Capabilities.V1.SelectSupport"] = "Org.OData.Capabilities.V1.SelectSupportType";
    TermToTypes["Org.OData.Capabilities.V1.BatchSupported"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Capabilities.V1.BatchSupport"] = "Org.OData.Capabilities.V1.BatchSupportType";
    TermToTypes["Org.OData.Capabilities.V1.FilterRestrictions"] = "Org.OData.Capabilities.V1.FilterRestrictionsType";
    TermToTypes["Org.OData.Capabilities.V1.SortRestrictions"] = "Org.OData.Capabilities.V1.SortRestrictionsType";
    TermToTypes["Org.OData.Capabilities.V1.ExpandRestrictions"] = "Org.OData.Capabilities.V1.ExpandRestrictionsType";
    TermToTypes["Org.OData.Capabilities.V1.SearchRestrictions"] = "Org.OData.Capabilities.V1.SearchRestrictionsType";
    TermToTypes["Org.OData.Capabilities.V1.KeyAsSegmentSupported"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Capabilities.V1.QuerySegmentSupported"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Capabilities.V1.InsertRestrictions"] = "Org.OData.Capabilities.V1.InsertRestrictionsType";
    TermToTypes["Org.OData.Capabilities.V1.DeepInsertSupport"] = "Org.OData.Capabilities.V1.DeepInsertSupportType";
    TermToTypes["Org.OData.Capabilities.V1.UpdateRestrictions"] = "Org.OData.Capabilities.V1.UpdateRestrictionsType";
    TermToTypes["Org.OData.Capabilities.V1.DeepUpdateSupport"] = "Org.OData.Capabilities.V1.DeepUpdateSupportType";
    TermToTypes["Org.OData.Capabilities.V1.DeleteRestrictions"] = "Org.OData.Capabilities.V1.DeleteRestrictionsType";
    TermToTypes["Org.OData.Capabilities.V1.CollectionPropertyRestrictions"] = "Org.OData.Capabilities.V1.CollectionPropertyRestrictionsType";
    TermToTypes["Org.OData.Capabilities.V1.OperationRestrictions"] = "Org.OData.Capabilities.V1.OperationRestrictionsType";
    TermToTypes["Org.OData.Capabilities.V1.AnnotationValuesInQuerySupported"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Capabilities.V1.ModificationQueryOptions"] = "Org.OData.Capabilities.V1.ModificationQueryOptionsType";
    TermToTypes["Org.OData.Capabilities.V1.ReadRestrictions"] = "Org.OData.Capabilities.V1.ReadRestrictionsType";
    TermToTypes["Org.OData.Capabilities.V1.CustomHeaders"] = "Org.OData.Capabilities.V1.CustomParameter";
    TermToTypes["Org.OData.Capabilities.V1.CustomQueryOptions"] = "Org.OData.Capabilities.V1.CustomParameter";
    TermToTypes["Org.OData.Capabilities.V1.MediaLocationUpdateSupported"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Aggregation.V1.ApplySupported"] = "Org.OData.Aggregation.V1.ApplySupportedType";
    TermToTypes["Org.OData.Aggregation.V1.Groupable"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Aggregation.V1.Aggregatable"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Aggregation.V1.ContextDefiningProperties"] = "Edm.PropertyPath";
    TermToTypes["Org.OData.Aggregation.V1.LeveledHierarchy"] = "Edm.PropertyPath";
    TermToTypes["Org.OData.Aggregation.V1.RecursiveHierarchy"] = "Org.OData.Aggregation.V1.RecursiveHierarchyType";
    TermToTypes["Org.OData.Aggregation.V1.AvailableOnAggregates"] = "Org.OData.Aggregation.V1.AvailableOnAggregatesType";
    TermToTypes["Org.OData.Validation.V1.Minimum"] = "Edm.PrimitiveType";
    TermToTypes["Org.OData.Validation.V1.Maximum"] = "Edm.PrimitiveType";
    TermToTypes["Org.OData.Validation.V1.Exclusive"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Validation.V1.AllowedValues"] = "Org.OData.Validation.V1.AllowedValue";
    TermToTypes["Org.OData.Validation.V1.MultipleOf"] = "Edm.Decimal";
    TermToTypes["Org.OData.Validation.V1.Constraint"] = "Org.OData.Validation.V1.ConstraintType";
    TermToTypes["Org.OData.Validation.V1.ItemsOf"] = "Org.OData.Validation.V1.ItemsOfType";
    TermToTypes["Org.OData.Validation.V1.OpenPropertyTypeConstraint"] = "Org.OData.Core.V1.QualifiedTypeName";
    TermToTypes["Org.OData.Validation.V1.DerivedTypeConstraint"] = "Org.OData.Core.V1.QualifiedTypeName";
    TermToTypes["Org.OData.Validation.V1.AllowedTerms"] = "Org.OData.Core.V1.QualifiedTermName";
    TermToTypes["Org.OData.Validation.V1.ApplicableTerms"] = "Org.OData.Core.V1.QualifiedTermName";
    TermToTypes["Org.OData.Validation.V1.MaxItems"] = "Edm.Int64";
    TermToTypes["Org.OData.Validation.V1.MinItems"] = "Edm.Int64";
    TermToTypes["Org.OData.Measures.V1.Scale"] = "Edm.Byte";
    TermToTypes["Org.OData.Measures.V1.DurationGranularity"] = "Org.OData.Measures.V1.DurationGranularityType";
    TermToTypes["com.sap.vocabularies.Analytics.v1.Dimension"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Analytics.v1.Measure"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Analytics.v1.AccumulativeMeasure"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Analytics.v1.RolledUpPropertyCount"] = "Edm.Int16";
    TermToTypes["com.sap.vocabularies.Analytics.v1.PlanningAction"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Analytics.v1.AggregatedProperties"] = "com.sap.vocabularies.Analytics.v1.AggregatedPropertyType";
    TermToTypes["com.sap.vocabularies.Common.v1.ServiceVersion"] = "Edm.Int32";
    TermToTypes["com.sap.vocabularies.Common.v1.ServiceSchemaVersion"] = "Edm.Int32";
    TermToTypes["com.sap.vocabularies.Common.v1.TextFor"] = "Edm.PropertyPath";
    TermToTypes["com.sap.vocabularies.Common.v1.IsLanguageIdentifier"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.TextFormat"] = "com.sap.vocabularies.Common.v1.TextFormatType";
    TermToTypes["com.sap.vocabularies.Common.v1.IsDigitSequence"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsUpperCase"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsCurrency"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsUnit"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.UnitSpecificScale"] = "Edm.PrimitiveType";
    TermToTypes["com.sap.vocabularies.Common.v1.UnitSpecificPrecision"] = "Edm.PrimitiveType";
    TermToTypes["com.sap.vocabularies.Common.v1.SecondaryKey"] = "Edm.PropertyPath";
    TermToTypes["com.sap.vocabularies.Common.v1.MinOccurs"] = "Edm.Int64";
    TermToTypes["com.sap.vocabularies.Common.v1.MaxOccurs"] = "Edm.Int64";
    TermToTypes["com.sap.vocabularies.Common.v1.AssociationEntity"] = "Edm.NavigationPropertyPath";
    TermToTypes["com.sap.vocabularies.Common.v1.DerivedNavigation"] = "Edm.NavigationPropertyPath";
    TermToTypes["com.sap.vocabularies.Common.v1.Masked"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.MaskedAlways"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.SemanticObjectMapping"] = "com.sap.vocabularies.Common.v1.SemanticObjectMappingType";
    TermToTypes["com.sap.vocabularies.Common.v1.IsInstanceAnnotation"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.FilterExpressionRestrictions"] = "com.sap.vocabularies.Common.v1.FilterExpressionRestrictionType";
    TermToTypes["com.sap.vocabularies.Common.v1.FieldControl"] = "com.sap.vocabularies.Common.v1.FieldControlType";
    TermToTypes["com.sap.vocabularies.Common.v1.Application"] = "com.sap.vocabularies.Common.v1.ApplicationType";
    TermToTypes["com.sap.vocabularies.Common.v1.Timestamp"] = "Edm.DateTimeOffset";
    TermToTypes["com.sap.vocabularies.Common.v1.ErrorResolution"] = "com.sap.vocabularies.Common.v1.ErrorResolutionType";
    TermToTypes["com.sap.vocabularies.Common.v1.Messages"] = "Edm.ComplexType";
    TermToTypes["com.sap.vocabularies.Common.v1.numericSeverity"] = "com.sap.vocabularies.Common.v1.NumericMessageSeverityType";
    TermToTypes["com.sap.vocabularies.Common.v1.MaximumNumericMessageSeverity"] = "com.sap.vocabularies.Common.v1.NumericMessageSeverityType";
    TermToTypes["com.sap.vocabularies.Common.v1.IsActionCritical"] = "Edm.Boolean";
    TermToTypes["com.sap.vocabularies.Common.v1.Attributes"] = "Edm.PropertyPath";
    TermToTypes["com.sap.vocabularies.Common.v1.RelatedRecursiveHierarchy"] = "Edm.AnnotationPath";
    TermToTypes["com.sap.vocabularies.Common.v1.Interval"] = "com.sap.vocabularies.Common.v1.IntervalType";
    TermToTypes["com.sap.vocabularies.Common.v1.ResultContext"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.WeakReferentialConstraint"] = "com.sap.vocabularies.Common.v1.WeakReferentialConstraintType";
    TermToTypes["com.sap.vocabularies.Common.v1.IsNaturalPerson"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.ValueList"] = "com.sap.vocabularies.Common.v1.ValueListType";
    TermToTypes["com.sap.vocabularies.Common.v1.ValueListRelevantQualifiers"] = "com.sap.vocabularies.Common.v1.SimpleIdentifier";
    TermToTypes["com.sap.vocabularies.Common.v1.ValueListWithFixedValues"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.ValueListMapping"] = "com.sap.vocabularies.Common.v1.ValueListMappingType";
    TermToTypes["com.sap.vocabularies.Common.v1.IsCalendarYear"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsCalendarHalfyear"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsCalendarQuarter"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsCalendarMonth"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsCalendarWeek"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsDayOfCalendarMonth"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsDayOfCalendarYear"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsCalendarYearHalfyear"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsCalendarYearQuarter"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsCalendarYearMonth"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsCalendarYearWeek"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsCalendarDate"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsFiscalYear"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsFiscalPeriod"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsFiscalYearPeriod"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsFiscalQuarter"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsFiscalYearQuarter"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsFiscalWeek"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsFiscalYearWeek"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsDayOfFiscalYear"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsFiscalYearVariant"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.MutuallyExclusiveTerm"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.DraftRoot"] = "com.sap.vocabularies.Common.v1.DraftRootType";
    TermToTypes["com.sap.vocabularies.Common.v1.DraftNode"] = "com.sap.vocabularies.Common.v1.DraftNodeType";
    TermToTypes["com.sap.vocabularies.Common.v1.DraftActivationVia"] = "com.sap.vocabularies.Common.v1.SimpleIdentifier";
    TermToTypes["com.sap.vocabularies.Common.v1.EditableFieldFor"] = "Edm.PropertyPath";
    TermToTypes["com.sap.vocabularies.Common.v1.SemanticKey"] = "Edm.PropertyPath";
    TermToTypes["com.sap.vocabularies.Common.v1.SideEffects"] = "com.sap.vocabularies.Common.v1.SideEffectsType";
    TermToTypes["com.sap.vocabularies.Common.v1.DefaultValuesFunction"] = "com.sap.vocabularies.Common.v1.QualifiedName";
    TermToTypes["com.sap.vocabularies.Common.v1.FilterDefaultValue"] = "Edm.PrimitiveType";
    TermToTypes["com.sap.vocabularies.Common.v1.FilterDefaultValueHigh"] = "Edm.PrimitiveType";
    TermToTypes["com.sap.vocabularies.Common.v1.SortOrder"] = "com.sap.vocabularies.Common.v1.SortOrderType";
    TermToTypes["com.sap.vocabularies.Common.v1.RecursiveHierarchy"] = "com.sap.vocabularies.Common.v1.RecursiveHierarchyType";
    TermToTypes["com.sap.vocabularies.Common.v1.CreatedAt"] = "Edm.DateTimeOffset";
    TermToTypes["com.sap.vocabularies.Common.v1.CreatedBy"] = "com.sap.vocabularies.Common.v1.UserID";
    TermToTypes["com.sap.vocabularies.Common.v1.ChangedAt"] = "Edm.DateTimeOffset";
    TermToTypes["com.sap.vocabularies.Common.v1.ChangedBy"] = "com.sap.vocabularies.Common.v1.UserID";
    TermToTypes["com.sap.vocabularies.Common.v1.ApplyMultiUnitBehaviorForSortingAndFiltering"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.CodeList.v1.CurrencyCodes"] = "com.sap.vocabularies.CodeList.v1.CodeListSource";
    TermToTypes["com.sap.vocabularies.CodeList.v1.UnitsOfMeasure"] = "com.sap.vocabularies.CodeList.v1.CodeListSource";
    TermToTypes["com.sap.vocabularies.CodeList.v1.StandardCode"] = "Edm.PropertyPath";
    TermToTypes["com.sap.vocabularies.CodeList.v1.ExternalCode"] = "Edm.PropertyPath";
    TermToTypes["com.sap.vocabularies.CodeList.v1.IsConfigurationDeprecationCode"] = "Edm.Boolean";
    TermToTypes["com.sap.vocabularies.Communication.v1.Contact"] = "com.sap.vocabularies.Communication.v1.ContactType";
    TermToTypes["com.sap.vocabularies.Communication.v1.Address"] = "com.sap.vocabularies.Communication.v1.AddressType";
    TermToTypes["com.sap.vocabularies.Communication.v1.IsEmailAddress"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Communication.v1.IsPhoneNumber"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Communication.v1.Event"] = "com.sap.vocabularies.Communication.v1.EventData";
    TermToTypes["com.sap.vocabularies.Communication.v1.Task"] = "com.sap.vocabularies.Communication.v1.TaskData";
    TermToTypes["com.sap.vocabularies.Communication.v1.Message"] = "com.sap.vocabularies.Communication.v1.MessageData";
    TermToTypes["com.sap.vocabularies.Hierarchy.v1.RecursiveHierarchy"] = "com.sap.vocabularies.Hierarchy.v1.RecursiveHierarchyType";
    TermToTypes["com.sap.vocabularies.PersonalData.v1.EntitySemantics"] = "com.sap.vocabularies.PersonalData.v1.EntitySemanticsType";
    TermToTypes["com.sap.vocabularies.PersonalData.v1.FieldSemantics"] = "com.sap.vocabularies.PersonalData.v1.FieldSemanticsType";
    TermToTypes["com.sap.vocabularies.PersonalData.v1.IsPotentiallyPersonal"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Session.v1.StickySessionSupported"] = "com.sap.vocabularies.Session.v1.StickySessionSupportedType";
    TermToTypes["com.sap.vocabularies.UI.v1.HeaderInfo"] = "com.sap.vocabularies.UI.v1.HeaderInfoType";
    TermToTypes["com.sap.vocabularies.UI.v1.Identification"] = "com.sap.vocabularies.UI.v1.DataFieldAbstract";
    TermToTypes["com.sap.vocabularies.UI.v1.Badge"] = "com.sap.vocabularies.UI.v1.BadgeType";
    TermToTypes["com.sap.vocabularies.UI.v1.LineItem"] = "com.sap.vocabularies.UI.v1.DataFieldAbstract";
    TermToTypes["com.sap.vocabularies.UI.v1.StatusInfo"] = "com.sap.vocabularies.UI.v1.DataFieldAbstract";
    TermToTypes["com.sap.vocabularies.UI.v1.FieldGroup"] = "com.sap.vocabularies.UI.v1.FieldGroupType";
    TermToTypes["com.sap.vocabularies.UI.v1.ConnectedFields"] = "com.sap.vocabularies.UI.v1.ConnectedFieldsType";
    TermToTypes["com.sap.vocabularies.UI.v1.GeoLocations"] = "com.sap.vocabularies.UI.v1.GeoLocationType";
    TermToTypes["com.sap.vocabularies.UI.v1.GeoLocation"] = "com.sap.vocabularies.UI.v1.GeoLocationType";
    TermToTypes["com.sap.vocabularies.UI.v1.Contacts"] = "Edm.AnnotationPath";
    TermToTypes["com.sap.vocabularies.UI.v1.MediaResource"] = "com.sap.vocabularies.UI.v1.MediaResourceType";
    TermToTypes["com.sap.vocabularies.UI.v1.DataPoint"] = "com.sap.vocabularies.UI.v1.DataPointType";
    TermToTypes["com.sap.vocabularies.UI.v1.KPI"] = "com.sap.vocabularies.UI.v1.KPIType";
    TermToTypes["com.sap.vocabularies.UI.v1.Chart"] = "com.sap.vocabularies.UI.v1.ChartDefinitionType";
    TermToTypes["com.sap.vocabularies.UI.v1.ValueCriticality"] = "com.sap.vocabularies.UI.v1.ValueCriticalityType";
    TermToTypes["com.sap.vocabularies.UI.v1.CriticalityLabels"] = "com.sap.vocabularies.UI.v1.CriticalityLabelType";
    TermToTypes["com.sap.vocabularies.UI.v1.SelectionFields"] = "Edm.PropertyPath";
    TermToTypes["com.sap.vocabularies.UI.v1.Facets"] = "com.sap.vocabularies.UI.v1.Facet";
    TermToTypes["com.sap.vocabularies.UI.v1.HeaderFacets"] = "com.sap.vocabularies.UI.v1.Facet";
    TermToTypes["com.sap.vocabularies.UI.v1.QuickViewFacets"] = "com.sap.vocabularies.UI.v1.Facet";
    TermToTypes["com.sap.vocabularies.UI.v1.QuickCreateFacets"] = "com.sap.vocabularies.UI.v1.Facet";
    TermToTypes["com.sap.vocabularies.UI.v1.FilterFacets"] = "com.sap.vocabularies.UI.v1.ReferenceFacet";
    TermToTypes["com.sap.vocabularies.UI.v1.SelectionPresentationVariant"] = "com.sap.vocabularies.UI.v1.SelectionPresentationVariantType";
    TermToTypes["com.sap.vocabularies.UI.v1.PresentationVariant"] = "com.sap.vocabularies.UI.v1.PresentationVariantType";
    TermToTypes["com.sap.vocabularies.UI.v1.SelectionVariant"] = "com.sap.vocabularies.UI.v1.SelectionVariantType";
    TermToTypes["com.sap.vocabularies.UI.v1.ThingPerspective"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.UI.v1.IsSummary"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.UI.v1.PartOfPreview"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.UI.v1.Map"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.UI.v1.Gallery"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.UI.v1.IsImageURL"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.UI.v1.IsImage"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.UI.v1.MultiLineText"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.UI.v1.TextArrangement"] = "com.sap.vocabularies.UI.v1.TextArrangementType";
    TermToTypes["com.sap.vocabularies.UI.v1.Importance"] = "com.sap.vocabularies.UI.v1.ImportanceType";
    TermToTypes["com.sap.vocabularies.UI.v1.Hidden"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.UI.v1.CreateHidden"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.UI.v1.UpdateHidden"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.UI.v1.DeleteHidden"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.UI.v1.HiddenFilter"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.UI.v1.DataFieldDefault"] = "com.sap.vocabularies.UI.v1.DataFieldAbstract";
    TermToTypes["com.sap.vocabularies.UI.v1.Criticality"] = "com.sap.vocabularies.UI.v1.CriticalityType";
    TermToTypes["com.sap.vocabularies.UI.v1.CriticalityCalculation"] = "com.sap.vocabularies.UI.v1.CriticalityCalculationType";
    TermToTypes["com.sap.vocabularies.UI.v1.Emphasized"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.UI.v1.OrderBy"] = "Edm.PropertyPath";
    TermToTypes["com.sap.vocabularies.UI.v1.ParameterDefaultValue"] = "Edm.PrimitiveType";
    TermToTypes["com.sap.vocabularies.UI.v1.RecommendationState"] = "com.sap.vocabularies.UI.v1.RecommendationStateType";
    TermToTypes["com.sap.vocabularies.UI.v1.RecommendationList"] = "com.sap.vocabularies.UI.v1.RecommendationListType";
    TermToTypes["com.sap.vocabularies.UI.v1.ExcludeFromNavigationContext"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.HTML5.v1.CssDefaults"] = "com.sap.vocabularies.HTML5.v1.CssDefaultsType";
  })(TermToTypes || (TermToTypes = {}));

  var defaultReferences = [{
    alias: "Capabilities",
    namespace: "Org.OData.Capabilities.V1",
    uri: ""
  }, {
    alias: "Aggregation",
    namespace: "Org.OData.Aggregation.V1",
    uri: ""
  }, {
    alias: "Validation",
    namespace: "Org.OData.Validation.V1",
    uri: ""
  }, {
    namespace: "Org.OData.Core.V1",
    alias: "Core",
    uri: ""
  }, {
    namespace: "Org.OData.Measures.V1",
    alias: "Measures",
    uri: ""
  }, {
    namespace: "com.sap.vocabularies.Common.v1",
    alias: "Common",
    uri: ""
  }, {
    namespace: "com.sap.vocabularies.UI.v1",
    alias: "UI",
    uri: ""
  }, {
    namespace: "com.sap.vocabularies.Session.v1",
    alias: "Session",
    uri: ""
  }, {
    namespace: "com.sap.vocabularies.Analytics.v1",
    alias: "Analytics",
    uri: ""
  }, {
    namespace: "com.sap.vocabularies.CodeList.v1",
    alias: "CodeList",
    uri: ""
  }, {
    namespace: "com.sap.vocabularies.PersonalData.v1",
    alias: "PersonalData",
    uri: ""
  }, {
    namespace: "com.sap.vocabularies.Communication.v1",
    alias: "Communication",
    uri: ""
  }, {
    namespace: "com.sap.vocabularies.HTML5.v1",
    alias: "HTML5",
    uri: ""
  }];
  _exports.defaultReferences = defaultReferences;

  function alias(references, unaliasedValue) {
    if (!references.reverseReferenceMap) {
      references.reverseReferenceMap = references.reduce(function (map, reference) {
        map[reference.namespace] = reference;
        return map;
      }, {});
    }

    if (!unaliasedValue) {
      return unaliasedValue;
    }

    var lastDotIndex = unaliasedValue.lastIndexOf(".");
    var namespace = unaliasedValue.substr(0, lastDotIndex);
    var value = unaliasedValue.substr(lastDotIndex + 1);
    var reference = references.reverseReferenceMap[namespace];

    if (reference) {
      return "".concat(reference.alias, ".").concat(value);
    } else {
      // Try to see if it's an annotation Path like to_SalesOrder/@UI.LineItem
      if (unaliasedValue.indexOf("@") !== -1) {
        var _unaliasedValue$split = unaliasedValue.split("@"),
            _unaliasedValue$split2 = _toArray(_unaliasedValue$split),
            preAlias = _unaliasedValue$split2[0],
            postAlias = _unaliasedValue$split2.slice(1);

        return "".concat(preAlias, "@").concat(alias(references, postAlias.join("@")));
      } else {
        return unaliasedValue;
      }
    }
  }

  function unalias(references, aliasedValue) {
    if (!references.referenceMap) {
      references.referenceMap = references.reduce(function (map, reference) {
        map[reference.alias] = reference;
        return map;
      }, {});
    }

    if (!aliasedValue) {
      return aliasedValue;
    }

    var _aliasedValue$split = aliasedValue.split("."),
        _aliasedValue$split2 = _toArray(_aliasedValue$split),
        alias = _aliasedValue$split2[0],
        value = _aliasedValue$split2.slice(1);

    var reference = references.referenceMap[alias];

    if (reference) {
      return "".concat(reference.namespace, ".").concat(value.join("."));
    } else {
      // Try to see if it's an annotation Path like to_SalesOrder/@UI.LineItem
      if (aliasedValue.indexOf("@") !== -1) {
        var _aliasedValue$split3 = aliasedValue.split("@"),
            _aliasedValue$split4 = _toArray(_aliasedValue$split3),
            preAlias = _aliasedValue$split4[0],
            postAlias = _aliasedValue$split4.slice(1);

        return "".concat(preAlias, "@").concat(unalias(references, postAlias.join("@")));
      } else {
        return aliasedValue;
      }
    }
  }

  function buildObjectMap(parserOutput) {
    var objectMap = {};

    if (parserOutput.schema.entityContainer && parserOutput.schema.entityContainer.fullyQualifiedName) {
      objectMap[parserOutput.schema.entityContainer.fullyQualifiedName] = parserOutput.schema.entityContainer;
    }

    parserOutput.schema.entitySets.forEach(function (entitySet) {
      objectMap[entitySet.fullyQualifiedName] = entitySet;
    });
    parserOutput.schema.actions.forEach(function (action) {
      objectMap[action.fullyQualifiedName] = action;
      objectMap[action.fullyQualifiedName.split("(")[0]] = action;
      action.parameters.forEach(function (parameter) {
        objectMap[parameter.fullyQualifiedName] = parameter;
      });
    });
    parserOutput.schema.complexTypes.forEach(function (complexType) {
      objectMap[complexType.fullyQualifiedName] = complexType;
      complexType.properties.forEach(function (property) {
        objectMap[property.fullyQualifiedName] = property;
      });
    });
    parserOutput.schema.entityTypes.forEach(function (entityType) {
      objectMap[entityType.fullyQualifiedName] = entityType;
      entityType.entityProperties.forEach(function (property) {
        objectMap[property.fullyQualifiedName] = property;

        if (property.type.indexOf("Edm") === -1) {
          // Handle complex types
          var complexTypeDefinition = objectMap[property.type];

          if (complexTypeDefinition && complexTypeDefinition.properties) {
            complexTypeDefinition.properties.forEach(function (complexTypeProp) {
              var complexTypePropTarget = Object.assign(complexTypeProp, {
                _type: "Property",
                fullyQualifiedName: property.fullyQualifiedName + "/" + complexTypeProp.name
              });
              objectMap[complexTypePropTarget.fullyQualifiedName] = complexTypePropTarget;
            });
          }
        }
      });
      entityType.navigationProperties.forEach(function (navProperty) {
        objectMap[navProperty.fullyQualifiedName] = navProperty;
      });
    });
    Object.keys(parserOutput.schema.annotations).forEach(function (annotationSource) {
      parserOutput.schema.annotations[annotationSource].forEach(function (annotationList) {
        var currentTargetName = unalias(parserOutput.references, annotationList.target);
        annotationList.annotations.forEach(function (annotation) {
          var annotationFQN = "".concat(currentTargetName, "@").concat(unalias(parserOutput.references, annotation.term));

          if (annotation.qualifier) {
            annotationFQN += "#".concat(annotation.qualifier);
          }

          if (typeof annotation !== "object") {
            debugger;
          }

          objectMap[annotationFQN] = annotation;
          annotation.fullyQualifiedName = annotationFQN;
        });
      });
    });
    return objectMap;
  }

  function combinePath(currentTarget, path) {
    if (path.startsWith("@")) {
      return currentTarget + unalias(defaultReferences, path);
    } else {
      return currentTarget + "/" + path;
    }
  }

  function addAnnotationErrorMessage(path, oErrorMsg) {
    if (!ALL_ANNOTATION_ERRORS[path]) {
      ALL_ANNOTATION_ERRORS[path] = [oErrorMsg];
    } else {
      ALL_ANNOTATION_ERRORS[path].push(oErrorMsg);
    }
  }

  function resolveTarget(objectMap, currentTarget, path) {
    var pathOnly = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var includeVisitedObjects = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    var annotationType = arguments.length > 5 ? arguments[5] : undefined;
    var annotationsTerm = arguments.length > 6 ? arguments[6] : undefined;

    if (!path) {
      return undefined;
    } //const propertyPath = path;


    var aVisitedObjects = [];

    if (currentTarget && currentTarget._type === "Property") {
      currentTarget = objectMap[currentTarget.fullyQualifiedName.split("/")[0]];
    }

    path = combinePath(currentTarget.fullyQualifiedName, path);
    var pathSplit = path.split("/");
    var targetPathSplit = [];
    pathSplit.forEach(function (pathPart) {
      // Separate out the annotation
      if (pathPart.indexOf("@") !== -1) {
        var _pathPart$split = pathPart.split("@"),
            _pathPart$split2 = _slicedToArray(_pathPart$split, 2),
            _path = _pathPart$split2[0],
            annotationPath = _pathPart$split2[1];

        targetPathSplit.push(_path);
        targetPathSplit.push("@".concat(annotationPath));
      } else {
        targetPathSplit.push(pathPart);
      }
    });
    var currentPath = path;
    var target = targetPathSplit.reduce(function (currentValue, pathPart) {
      if (pathPart === "$Type" && currentValue._type === "EntityType") {
        return currentValue;
      }

      if (pathPart.length === 0) {
        // Empty Path after an entitySet means entityType
        if (currentValue && currentValue._type === "EntitySet" && currentValue.entityType) {
          aVisitedObjects.push(currentValue);
          currentValue = currentValue.entityType;
        }

        if (currentValue && currentValue._type === "NavigationProperty" && currentValue.targetType) {
          aVisitedObjects.push(currentValue);
          currentValue = currentValue.targetType;
        }

        return currentValue;
      }

      if (includeVisitedObjects && currentValue !== null && currentValue !== undefined) {
        aVisitedObjects.push(currentValue);
      }

      if (!currentValue) {
        currentPath = pathPart;
      } else if (currentValue._type === "EntitySet" && pathPart === "$Type") {
        currentValue = currentValue.targetType;
        return currentValue;
      } else if (currentValue._type === "EntitySet" && currentValue.entityType) {
        currentPath = combinePath(currentValue.entityTypeName, pathPart);
      } else if (currentValue._type === "NavigationProperty" && currentValue.targetTypeName) {
        currentPath = combinePath(currentValue.targetTypeName, pathPart);
      } else if (currentValue._type === "NavigationProperty" && currentValue.targetType) {
        currentPath = combinePath(currentValue.targetType.fullyQualifiedName, pathPart);
      } else if (currentValue._type === "Property") {
        currentPath = combinePath(currentValue.fullyQualifiedName, pathPart);
      } else if (currentValue._type === "Action" && currentValue.isBound) {
        currentPath = combinePath(currentValue.fullyQualifiedName, pathPart);

        if (!objectMap[currentPath]) {
          currentPath = combinePath(currentValue.sourceType, pathPart);
        }
      } else if (currentValue._type === "ActionParameter" && currentValue.isEntitySet) {
        currentPath = combinePath(currentValue.type, pathPart);
      } else if (currentValue._type === "ActionParameter" && !currentValue.isEntitySet) {
        currentPath = combinePath(currentTarget.fullyQualifiedName.substr(0, currentTarget.fullyQualifiedName.lastIndexOf("/")), pathPart);

        if (!objectMap[currentPath]) {
          var lastIdx = currentTarget.fullyQualifiedName.lastIndexOf("/");

          if (lastIdx === -1) {
            lastIdx = currentTarget.fullyQualifiedName.length;
          }

          currentPath = combinePath(objectMap[currentTarget.fullyQualifiedName.substr(0, lastIdx)].sourceType, pathPart);
        }
      } else {
        currentPath = combinePath(currentValue.fullyQualifiedName, pathPart);

        if (pathPart !== "name" && currentValue[pathPart] !== undefined) {
          return currentValue[pathPart];
        } else if (pathPart === "$AnnotationPath" && currentValue.$target) {
          return currentValue.$target;
        } else if (pathPart === "$Path" && currentValue.$target) {
          return currentValue.$target;
        } else if (pathPart.startsWith("$Path") && currentValue.$target) {
          var intermediateTarget = currentValue.$target;
          currentPath = combinePath(intermediateTarget.fullyQualifiedName, pathPart.substr(5));
        } else if (currentValue.hasOwnProperty("$Type")) {
          // This is now an annotation value
          var entityType = objectMap[currentValue.fullyQualifiedName.split("@")[0]];

          if (entityType) {
            currentPath = combinePath(entityType.fullyQualifiedName, pathPart);
          }
        }
      }

      return objectMap[currentPath];
    }, null);

    if (!target) {
      if (annotationsTerm && annotationType) {
        var oErrorMsg = {
          message: "Unable to resolve the path expression: " + "\n" + path + "\n" + "\n" + "Hint: Check and correct the path values under the following structure in the metadata (annotation.xml file or CDS annotations for the application): \n\n" + "<Annotation Term = " + annotationsTerm + ">" + "\n" + "<Record Type = " + annotationType + ">" + "\n" + "<AnnotationPath = " + path + ">"
        };
        addAnnotationErrorMessage(path, oErrorMsg);
      } else {
        var oErrorMsg = {
          message: "Unable to resolve the path expression: " + path + "\n" + "\n" + "Hint: Check and correct the path values under the following structure in the metadata (annotation.xml file or CDS annotations for the application): \n\n" + "<Annotation Term = " + pathSplit[0] + ">" + "\n" + "<PropertyValue  Path= " + pathSplit[1] + ">"
        };
        addAnnotationErrorMessage(path, oErrorMsg);
      } // console.log("Missing target " + path);

    }

    if (pathOnly) {
      return currentPath;
    }

    if (includeVisitedObjects) {
      return {
        visitedObjects: aVisitedObjects,
        target: target
      };
    }

    return target;
  }

  function isAnnotationPath(pathStr) {
    return pathStr.indexOf("@") !== -1;
  }

  function parseValue(propertyValue, valueFQN, parserOutput, currentTarget, objectMap, toResolve, annotationSource, unresolvedAnnotations, annotationType, annotationsTerm) {
    if (propertyValue === undefined) {
      return undefined;
    }

    switch (propertyValue.type) {
      case "String":
        return propertyValue.String;

      case "Int":
        return propertyValue.Int;

      case "Bool":
        return propertyValue.Bool;

      case "Decimal":
        return propertyValue.Decimal;

      case "Date":
        return propertyValue.Date;

      case "EnumMember":
        return alias(parserOutput.references, propertyValue.EnumMember);

      case "PropertyPath":
        return {
          type: "PropertyPath",
          value: propertyValue.PropertyPath,
          fullyQualifiedName: valueFQN,
          $target: resolveTarget(objectMap, currentTarget, propertyValue.PropertyPath, false, false, annotationType, annotationsTerm)
        };

      case "NavigationPropertyPath":
        return {
          type: "NavigationPropertyPath",
          value: propertyValue.NavigationPropertyPath,
          fullyQualifiedName: valueFQN,
          $target: resolveTarget(objectMap, currentTarget, propertyValue.NavigationPropertyPath, false, false, annotationType, annotationsTerm)
        };

      case "AnnotationPath":
        var annotationTarget = resolveTarget(objectMap, currentTarget, unalias(parserOutput.references, propertyValue.AnnotationPath), true, false, annotationType, annotationsTerm);
        var annotationPath = {
          type: "AnnotationPath",
          value: propertyValue.AnnotationPath,
          fullyQualifiedName: valueFQN,
          $target: annotationTarget,
          annotationType: annotationType,
          annotationsTerm: annotationsTerm,
          term: "",
          path: ""
        };
        toResolve.push(annotationPath);
        return annotationPath;

      case "Path":
        if (isAnnotationPath(propertyValue.Path)) {
          // If it's an anntoation that we can resolve, resolve it !
          var _$target = resolveTarget(objectMap, currentTarget, propertyValue.Path, false, false, annotationType, annotationsTerm);

          if (_$target) {
            return _$target;
          }
        }

        var $target = resolveTarget(objectMap, currentTarget, propertyValue.Path, true, false, annotationType, annotationsTerm);
        var path = new Path(propertyValue, $target, annotationsTerm, annotationType, "");
        toResolve.push(path);
        return path;

      case "Record":
        return parseRecord(propertyValue.Record, valueFQN, parserOutput, currentTarget, objectMap, toResolve, annotationSource, unresolvedAnnotations, annotationType, annotationsTerm);

      case "Collection":
        return parseCollection(propertyValue.Collection, valueFQN, parserOutput, currentTarget, objectMap, toResolve, annotationSource, unresolvedAnnotations, annotationType, annotationsTerm);

      case "Apply":
      case "If":
        return propertyValue;
    }
  }

  function inferTypeFromTerm(annotationsTerm, parserOutput, annotationTarget) {
    var targetType = TermToTypes[annotationsTerm];
    var oErrorMsg = {
      isError: false,
      message: "The type of the record used within the term ".concat(annotationsTerm, " was not defined and was inferred as ").concat(targetType, ".\nHint: If possible, try to maintain the Type property for each Record.\n<Annotations Target=\"").concat(annotationTarget, "\">\n\t<Annotation Term=\"").concat(annotationsTerm, "\">\n\t\t<Record>...</Record>\n\t</Annotation>\n</Annotations>")
    };
    addAnnotationErrorMessage(annotationTarget + "/" + annotationsTerm, oErrorMsg);
    return targetType;
  }

  function parseRecord(recordDefinition, currentFQN, parserOutput, currentTarget, objectMap, toResolve, annotationSource, unresolvedAnnotations, annotationType, annotationsTerm) {
    var targetType;

    if (!recordDefinition.type && annotationsTerm) {
      targetType = inferTypeFromTerm(annotationsTerm, parserOutput, currentTarget.fullyQualifiedName);
    } else {
      targetType = unalias(parserOutput.references, recordDefinition.type);
    }

    var annotationTerm = {
      $Type: targetType,
      fullyQualifiedName: currentFQN
    };
    var annotationContent = {};

    if (recordDefinition.annotations && Array.isArray(recordDefinition.annotations)) {
      var subAnnotationList = {
        target: currentFQN,
        annotations: recordDefinition.annotations,
        __source: annotationSource
      };
      unresolvedAnnotations.push(subAnnotationList);
    }

    recordDefinition.propertyValues.forEach(function (propertyValue) {
      annotationContent[propertyValue.name] = parseValue(propertyValue.value, "".concat(currentFQN, "/").concat(propertyValue.name), parserOutput, currentTarget, objectMap, toResolve, annotationSource, unresolvedAnnotations, annotationType, annotationsTerm);

      if (propertyValue.annotations && Array.isArray(propertyValue.annotations)) {
        var _subAnnotationList = {
          target: "".concat(currentFQN, "/").concat(propertyValue.name),
          annotations: propertyValue.annotations,
          __source: annotationSource
        };
        unresolvedAnnotations.push(_subAnnotationList);
      }

      if (annotationContent.hasOwnProperty("Action") && (annotationTerm.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" || annotationTerm.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithAction")) {
        if (currentTarget.actions) {
          annotationContent.ActionTarget = currentTarget.actions[annotationContent.Action] || objectMap[annotationContent.Action];

          if (!annotationContent.ActionTarget) {
            // Add to diagnostics debugger;
            ANNOTATION_ERRORS.push({
              message: "Unable to resolve the action " + annotationContent.Action + " defined for " + annotationTerm.fullyQualifiedName
            });
          }
        }
      }
    });
    return Object.assign(annotationTerm, annotationContent);
  }

  function getOrInferCollectionType(collectionDefinition) {
    var type = collectionDefinition.type;

    if (type === undefined && collectionDefinition.length > 0) {
      var firstColItem = collectionDefinition[0];

      if (firstColItem.hasOwnProperty("PropertyPath")) {
        type = "PropertyPath";
      } else if (firstColItem.hasOwnProperty("Path")) {
        type = "Path";
      } else if (firstColItem.hasOwnProperty("AnnotationPath")) {
        type = "AnnotationPath";
      } else if (firstColItem.hasOwnProperty("NavigationPropertyPath")) {
        type = "NavigationPropertyPath";
      } else if (typeof firstColItem === "object" && (firstColItem.hasOwnProperty("type") || firstColItem.hasOwnProperty("propertyValues"))) {
        type = "Record";
      } else if (typeof firstColItem === "string") {
        type = "String";
      }
    } else if (type === undefined) {
      type = "EmptyCollection";
    }

    return type;
  }

  function parseCollection(collectionDefinition, parentFQN, parserOutput, currentTarget, objectMap, toResolve, annotationSource, unresolvedAnnotations, annotationType, annotationsTerm) {
    var collectionDefinitionType = getOrInferCollectionType(collectionDefinition);

    switch (collectionDefinitionType) {
      case "PropertyPath":
        return collectionDefinition.map(function (propertyPath, propertyIdx) {
          return {
            type: "PropertyPath",
            value: propertyPath.PropertyPath,
            fullyQualifiedName: "".concat(parentFQN, "/").concat(propertyIdx),
            $target: resolveTarget(objectMap, currentTarget, propertyPath.PropertyPath, false, false, annotationType, annotationsTerm)
          };
        });

      case "Path":
        return collectionDefinition.map(function (pathValue) {
          if (isAnnotationPath(pathValue.Path)) {
            // If it's an anntoation that we can resolve, resolve it !
            var _$target2 = resolveTarget(objectMap, currentTarget, pathValue.Path, false, false, annotationType, annotationsTerm);

            if (_$target2) {
              return _$target2;
            }
          }

          var $target = resolveTarget(objectMap, currentTarget, pathValue.Path, true, false, annotationType, annotationsTerm);
          var path = new Path(pathValue, $target, annotationsTerm, annotationType, "");
          toResolve.push(path);
          return path;
        });

      case "AnnotationPath":
        return collectionDefinition.map(function (annotationPath, annotationIdx) {
          var annotationTarget = resolveTarget(objectMap, currentTarget, annotationPath.AnnotationPath, true, false, annotationType, annotationsTerm);
          var annotationCollectionElement = {
            type: "AnnotationPath",
            value: annotationPath.AnnotationPath,
            fullyQualifiedName: "".concat(parentFQN, "/").concat(annotationIdx),
            $target: annotationTarget,
            annotationType: annotationType,
            annotationsTerm: annotationsTerm,
            term: "",
            path: ""
          };
          toResolve.push(annotationCollectionElement);
          return annotationCollectionElement;
        });

      case "NavigationPropertyPath":
        return collectionDefinition.map(function (navPropertyPath, navPropIdx) {
          return {
            type: "NavigationPropertyPath",
            value: navPropertyPath.NavigationPropertyPath,
            fullyQualifiedName: "".concat(parentFQN, "/").concat(navPropIdx),
            $target: resolveTarget(objectMap, currentTarget, navPropertyPath.NavigationPropertyPath, false, false, annotationType, annotationsTerm)
          };
        });

      case "Record":
        return collectionDefinition.map(function (recordDefinition, recordIdx) {
          return parseRecord(recordDefinition, "".concat(parentFQN, "/").concat(recordIdx), parserOutput, currentTarget, objectMap, toResolve, annotationSource, unresolvedAnnotations, annotationType, annotationsTerm);
        });

      case "Apply":
        return collectionDefinition.map(function (ifValue) {
          return ifValue;
        });

      case "If":
        return collectionDefinition.map(function (ifValue) {
          return ifValue;
        });

      case "String":
        return collectionDefinition.map(function (stringValue) {
          if (typeof stringValue === "string") {
            return stringValue;
          } else {
            return stringValue.String;
          }
        });

      default:
        if (collectionDefinition.length === 0) {
          return [];
        }

        throw new Error("Unsupported case");
    }
  }

  function convertAnnotation(annotation, parserOutput, currentTarget, objectMap, toResolve, annotationSource, unresolvedAnnotations) {
    if (annotation.record) {
      var annotationType = annotation.record.type ? unalias(parserOutput.references, annotation.record.type) : inferTypeFromTerm(annotation.term, parserOutput, currentTarget.fullyQualifiedName);
      var annotationTerm = {
        $Type: annotationType,
        fullyQualifiedName: annotation.fullyQualifiedName,
        qualifier: annotation.qualifier
      };
      var annotationContent = {};
      annotation.record.propertyValues.forEach(function (propertyValue) {
        annotationContent[propertyValue.name] = parseValue(propertyValue.value, "".concat(annotation.fullyQualifiedName, "/").concat(propertyValue.name), parserOutput, currentTarget, objectMap, toResolve, annotationSource, unresolvedAnnotations, annotationType, annotation.term);

        if (annotationContent.hasOwnProperty("Action") && (!annotation.record || annotationTerm.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" || annotationTerm.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithAction")) {
          if (currentTarget.actions) {
            annotationContent.ActionTarget = currentTarget.actions[annotationContent.Action] || objectMap[annotationContent.Action];

            if (!annotationContent.ActionTarget) {
              ANNOTATION_ERRORS.push({
                message: "Unable to resolve the action " + annotationContent.Action + " defined for " + annotation.fullyQualifiedName
              }); // Add to diagnostics
              // debugger;
            }
          }
        }
      });
      return Object.assign(annotationTerm, annotationContent);
    } else if (annotation.collection === undefined) {
      if (annotation.value) {
        return parseValue(annotation.value, annotation.fullyQualifiedName, parserOutput, currentTarget, objectMap, toResolve, annotationSource, unresolvedAnnotations, "", annotation.term);
      } else {
        return true;
      }
    } else if (annotation.collection) {
      var collection = parseCollection(annotation.collection, annotation.fullyQualifiedName, parserOutput, currentTarget, objectMap, toResolve, annotationSource, unresolvedAnnotations, "", annotation.term);
      collection.fullyQualifiedName = annotation.fullyQualifiedName;
      return collection;
    } else {
      throw new Error("Unsupported case");
    }
  }

  function createResolvePathFn(entityType, objectMap) {
    return function (relativePath, includeVisitedObjects) {
      var annotationTerm = "";
      var annotationType = "";
      return resolveTarget(objectMap, entityType, relativePath, false, includeVisitedObjects, annotationType, annotationTerm);
    };
  }

  function resolveNavigationProperties(entityTypes, associations, objectMap) {
    entityTypes.forEach(function (entityType) {
      entityType.navigationProperties = entityType.navigationProperties.map(function (navProp) {
        var outNavProp = {
          _type: "NavigationProperty",
          name: navProp.name,
          fullyQualifiedName: navProp.fullyQualifiedName,
          partner: navProp.hasOwnProperty("partner") ? navProp.partner : undefined,
          // targetTypeName: FullyQualifiedName;
          // targetType: EntityType;
          isCollection: navProp.hasOwnProperty("isCollection") ? navProp.isCollection : false,
          containsTarget: navProp.hasOwnProperty("containsTarget") ? navProp.containsTarget : false,
          referentialConstraint: navProp.referentialConstraint ? navProp.referentialConstraint : []
        };

        if (navProp.targetTypeName) {
          outNavProp.targetType = objectMap[navProp.targetTypeName];
        } else if (navProp.relationship) {
          var targetAssociation = associations.find(function (association) {
            return association.fullyQualifiedName === navProp.relationship;
          });

          if (targetAssociation) {
            var associationEnd = targetAssociation.associationEnd.find(function (end) {
              return end.role === navProp.toRole;
            });

            if (associationEnd) {
              outNavProp.targetType = objectMap[associationEnd.type];
              outNavProp.isCollection = associationEnd.multiplicity === "*";
            }
          }
        }

        if (outNavProp.targetType) {
          outNavProp.targetTypeName = outNavProp.targetType.fullyQualifiedName;
        }

        var outNavPropReq = outNavProp;
        objectMap[outNavPropReq.fullyQualifiedName] = outNavPropReq;
        return outNavPropReq;
      });
      entityType.resolvePath = createResolvePathFn(entityType, objectMap);
    });
  }

  function linkActionsToEntityType(namespace, actions, objectMap) {
    actions.forEach(function (action) {
      if (action.isBound) {
        var sourceEntityType = objectMap[action.sourceType];
        action.sourceEntityType = sourceEntityType;

        if (sourceEntityType) {
          if (!sourceEntityType.actions) {
            sourceEntityType.actions = {};
          }

          sourceEntityType.actions[action.name] = action;
          sourceEntityType.actions["".concat(namespace, ".").concat(action.name)] = action;
        }

        action.returnEntityType = objectMap[action.returnType];
      }
    });
  }

  function linkEntityTypeToEntitySet(entitySets, objectMap, references) {
    entitySets.forEach(function (entitySet) {
      entitySet.entityType = objectMap[entitySet.entityTypeName];

      if (!entitySet.entityType) {
        entitySet.entityType = objectMap[unalias(references, entitySet.entityTypeName)];
      }

      if (!entitySet.annotations) {
        entitySet.annotations = {};
      }

      if (!entitySet.entityType.annotations) {
        entitySet.entityType.annotations = {};
      }

      entitySet.entityType.keys.forEach(function (keyProp) {
        keyProp.isKey = true;
      });
    });
  }

  function linkPropertiesToComplexTypes(entityTypes, objectMap) {
    entityTypes.forEach(function (entityType) {
      entityType.entityProperties.forEach(function (entityProperty) {
        if (entityProperty.type.indexOf("Edm") === -1) {
          var complexType = objectMap[entityProperty.type];

          if (complexType) {
            entityProperty.targetType = complexType;
          }
        }
      });
    });
  }

  function prepareComplexTypes(complexTypes, associations, objectMap) {
    complexTypes.forEach(function (complexType) {
      complexType.annotations = {};
      complexType.properties.forEach(function (property) {
        if (!property.annotations) {
          property.annotations = {};
        }
      });
      complexType.navigationProperties = complexType.navigationProperties.map(function (navProp) {
        if (!navProp.annotations) {
          navProp.annotations = {};
        }

        var outNavProp = {
          _type: "NavigationProperty",
          name: navProp.name,
          fullyQualifiedName: navProp.fullyQualifiedName,
          partner: navProp.hasOwnProperty("partner") ? navProp.partner : undefined,
          // targetTypeName: FullyQualifiedName;
          // targetType: EntityType;
          isCollection: navProp.hasOwnProperty("isCollection") ? navProp.isCollection : false,
          containsTarget: navProp.hasOwnProperty("containsTarget") ? navProp.containsTarget : false,
          referentialConstraint: navProp.referentialConstraint ? navProp.referentialConstraint : []
        };

        if (navProp.targetTypeName) {
          outNavProp.targetType = objectMap[navProp.targetTypeName];
        } else if (navProp.relationship) {
          var targetAssociation = associations.find(function (association) {
            return association.fullyQualifiedName === navProp.relationship;
          });

          if (targetAssociation) {
            var associationEnd = targetAssociation.associationEnd.find(function (end) {
              return end.role === navProp.toRole;
            });

            if (associationEnd) {
              outNavProp.targetType = objectMap[associationEnd.type];
              outNavProp.isCollection = associationEnd.multiplicity === "*";
            }
          }
        }

        if (outNavProp.targetType) {
          outNavProp.targetTypeName = outNavProp.targetType.fullyQualifiedName;
        }

        var outNavPropReq = outNavProp;
        objectMap[outNavPropReq.fullyQualifiedName] = outNavPropReq;
        return outNavPropReq;
      });
    });
  }

  function splitTerm(references, termValue) {
    var aliasedTerm = alias(references, termValue);
    var lastDot = aliasedTerm.lastIndexOf(".");
    var termAlias = aliasedTerm.substr(0, lastDot);
    var term = aliasedTerm.substr(lastDot + 1);
    return [termAlias, term];
  }
  /**
   * Resolve a specific path
   * @param sPath
   */


  function createGlobalResolve(convertedOutput, objectMap) {
    return function resolvePath(sPath) {
      var aPathSplit = sPath.split("/");

      if (aPathSplit.shift() !== "") {
        throw new Error("Cannot deal with relative path");
      }

      var entitySetName = aPathSplit.shift();
      var entitySet = convertedOutput.entitySets.find(function (et) {
        return et.name === entitySetName;
      });

      if (!entitySet) {
        return {
          target: convertedOutput.entityContainer,
          objectPath: [convertedOutput.entityContainer]
        };
      }

      if (aPathSplit.length === 0) {
        return {
          target: entitySet,
          objectPath: [convertedOutput.entityContainer, entitySet]
        };
      } else {
        var targetResolution = resolveTarget(objectMap, entitySet, "/" + aPathSplit.join("/"), false, true);

        if (targetResolution.target) {
          targetResolution.visitedObjects.push(targetResolution.target);
        }

        return {
          target: targetResolution.target,
          objectPath: targetResolution.visitedObjects
        };
      }
    };
  }

  var ANNOTATION_ERRORS = [];
  var ALL_ANNOTATION_ERRORS = {};

  function convertTypes(parserOutput) {
    ANNOTATION_ERRORS = [];
    var objectMap = buildObjectMap(parserOutput);
    resolveNavigationProperties(parserOutput.schema.entityTypes, parserOutput.schema.associations, objectMap);
    linkActionsToEntityType(parserOutput.schema.namespace, parserOutput.schema.actions, objectMap);
    linkEntityTypeToEntitySet(parserOutput.schema.entitySets, objectMap, parserOutput.references);
    linkPropertiesToComplexTypes(parserOutput.schema.entityTypes, objectMap);
    prepareComplexTypes(parserOutput.schema.complexTypes, parserOutput.schema.associations, objectMap);
    var toResolve = [];
    var unresolvedAnnotations = [];
    Object.keys(parserOutput.schema.annotations).forEach(function (annotationSource) {
      parserOutput.schema.annotations[annotationSource].forEach(function (annotationList) {
        var currentTargetName = unalias(parserOutput.references, annotationList.target);
        var currentTarget = objectMap[currentTargetName];

        if (!currentTarget) {
          if (currentTargetName.indexOf("@") !== -1) {
            annotationList.__source = annotationSource;
            unresolvedAnnotations.push(annotationList);
          }
        } else if (typeof currentTarget === "object") {
          if (!currentTarget.annotations) {
            currentTarget.annotations = {};
          }

          annotationList.annotations.forEach(function (annotation) {
            var _splitTerm = splitTerm(defaultReferences, annotation.term),
                _splitTerm2 = _slicedToArray(_splitTerm, 2),
                vocAlias = _splitTerm2[0],
                vocTerm = _splitTerm2[1];

            if (!currentTarget.annotations[vocAlias]) {
              currentTarget.annotations[vocAlias] = {};
            }

            if (!currentTarget.annotations._annotations) {
              currentTarget.annotations._annotations = {};
            }

            var vocTermWithQualifier = "".concat(vocTerm).concat(annotation.qualifier ? "#".concat(annotation.qualifier) : "");
            currentTarget.annotations[vocAlias][vocTermWithQualifier] = convertAnnotation(annotation, parserOutput, currentTarget, objectMap, toResolve, annotationSource, unresolvedAnnotations);

            switch (typeof currentTarget.annotations[vocAlias][vocTermWithQualifier]) {
              case "string":
                currentTarget.annotations[vocAlias][vocTermWithQualifier] = new String(currentTarget.annotations[vocAlias][vocTermWithQualifier]);
                break;

              case "boolean":
                currentTarget.annotations[vocAlias][vocTermWithQualifier] = new Boolean(currentTarget.annotations[vocAlias][vocTermWithQualifier]);
                break;
            }

            if (currentTarget.annotations[vocAlias][vocTermWithQualifier] !== null && typeof currentTarget.annotations[vocAlias][vocTermWithQualifier] === "object") {
              currentTarget.annotations[vocAlias][vocTermWithQualifier].term = unalias(defaultReferences, "".concat(vocAlias, ".").concat(vocTerm));
              currentTarget.annotations[vocAlias][vocTermWithQualifier].qualifier = annotation.qualifier;
              currentTarget.annotations[vocAlias][vocTermWithQualifier].__source = annotationSource;
            }

            var annotationTarget = "".concat(currentTargetName, "@").concat(unalias(defaultReferences, vocAlias + "." + vocTermWithQualifier));

            if (annotation.annotations && Array.isArray(annotation.annotations)) {
              var subAnnotationList = {
                target: annotationTarget,
                annotations: annotation.annotations,
                __source: annotationSource
              };
              unresolvedAnnotations.push(subAnnotationList);
            } else if (annotation.annotations && !currentTarget.annotations[vocAlias][vocTermWithQualifier].annotations) {
              currentTarget.annotations[vocAlias][vocTermWithQualifier].annotations = annotation.annotations;
            }

            currentTarget.annotations._annotations["".concat(vocAlias, ".").concat(vocTermWithQualifier)] = currentTarget.annotations[vocAlias][vocTermWithQualifier];
            objectMap[annotationTarget] = currentTarget.annotations[vocAlias][vocTermWithQualifier];
          });
        }
      });
    });
    var extraUnresolvedAnnotations = [];
    unresolvedAnnotations.forEach(function (annotationList) {
      var currentTargetName = unalias(parserOutput.references, annotationList.target);

      var _currentTargetName$sp = currentTargetName.split("@"),
          _currentTargetName$sp2 = _slicedToArray(_currentTargetName$sp, 2),
          baseObj = _currentTargetName$sp2[0],
          annotationPart = _currentTargetName$sp2[1];

      var targetSplit = annotationPart.split("/");
      baseObj = baseObj + "@" + targetSplit[0];
      var currentTarget = targetSplit.slice(1).reduce(function (currentObj, path) {
        if (!currentObj) {
          return null;
        }

        return currentObj[path];
      }, objectMap[baseObj]);

      if (!currentTarget) {
        ANNOTATION_ERRORS.push({
          message: "The following annotation target was not found on the service " + currentTargetName
        }); // console.log("Missing target again " + currentTargetName);
      } else if (typeof currentTarget === "object") {
        if (!currentTarget.annotations) {
          currentTarget.annotations = {};
        }

        annotationList.annotations.forEach(function (annotation) {
          var _splitTerm3 = splitTerm(defaultReferences, annotation.term),
              _splitTerm4 = _slicedToArray(_splitTerm3, 2),
              vocAlias = _splitTerm4[0],
              vocTerm = _splitTerm4[1];

          if (!currentTarget.annotations[vocAlias]) {
            currentTarget.annotations[vocAlias] = {};
          }

          if (!currentTarget.annotations._annotations) {
            currentTarget.annotations._annotations = {};
          }

          var vocTermWithQualifier = "".concat(vocTerm).concat(annotation.qualifier ? "#".concat(annotation.qualifier) : "");
          currentTarget.annotations[vocAlias][vocTermWithQualifier] = convertAnnotation(annotation, parserOutput, currentTarget, objectMap, toResolve, annotationList.__source, extraUnresolvedAnnotations);

          if (currentTarget.annotations[vocAlias][vocTermWithQualifier] !== null && typeof currentTarget.annotations[vocAlias][vocTermWithQualifier] === "object") {
            currentTarget.annotations[vocAlias][vocTermWithQualifier].term = unalias(defaultReferences, "".concat(vocAlias, ".").concat(vocTerm));
            currentTarget.annotations[vocAlias][vocTermWithQualifier].qualifier = annotation.qualifier;
            currentTarget.annotations[vocAlias][vocTermWithQualifier].__source = annotationList.__source;
          }

          currentTarget.annotations._annotations["".concat(vocAlias, ".").concat(vocTermWithQualifier)] = currentTarget.annotations[vocAlias][vocTermWithQualifier];
          objectMap["".concat(currentTargetName, "@").concat(unalias(defaultReferences, vocAlias + "." + vocTermWithQualifier))] = currentTarget.annotations[vocAlias][vocTermWithQualifier];
        });
      }
    });
    toResolve.forEach(function (resolveable) {
      var targetStr = resolveable.$target;
      var annotationsTerm = resolveable.annotationsTerm;
      var annotationType = resolveable.annotationType;
      resolveable.$target = objectMap[targetStr];
      delete resolveable.annotationType;
      delete resolveable.annotationsTerm;

      if (!resolveable.$target) {
        resolveable.targetString = targetStr;

        if (annotationsTerm && annotationType) {
          var oErrorMsg = {
            message: "Unable to resolve the path expression: " + targetStr + "\n" + "\n" + "Hint: Check and correct the path values under the following structure in the metadata (annotation.xml file or CDS annotations for the application): \n\n" + "<Annotation Term = " + annotationsTerm + ">" + "\n" + "<Record Type = " + annotationType + ">" + "\n" + "<AnnotationPath = " + targetStr + ">"
          };
          addAnnotationErrorMessage(targetStr, oErrorMsg);
        } else {
          var _property = resolveable.term;
          var path = resolveable.path;
          var termInfo = targetStr ? targetStr.split("/")[0] : targetStr;
          var _oErrorMsg = {
            message: "Unable to resolve the path expression: " + targetStr + "\n" + "\n" + "Hint: Check and correct the path values under the following structure in the metadata (annotation.xml file or CDS annotations for the application): \n\n" + "<Annotation Term = " + termInfo + ">" + "\n" + "<PropertyValue Property = " + _property + "        Path= " + path + ">"
          };
          addAnnotationErrorMessage(targetStr, _oErrorMsg);
        }
      }
    });

    for (var property in ALL_ANNOTATION_ERRORS) {
      ANNOTATION_ERRORS.push(ALL_ANNOTATION_ERRORS[property][0]);
    }

    parserOutput.entitySets = parserOutput.schema.entitySets;
    var convertedOutput = {
      version: parserOutput.version,
      annotations: parserOutput.schema.annotations,
      namespace: parserOutput.schema.namespace,
      entityContainer: parserOutput.schema.entityContainer,
      actions: parserOutput.schema.actions,
      entitySets: parserOutput.schema.entitySets,
      entityTypes: parserOutput.schema.entityTypes,
      complexTypes: parserOutput.schema.complexTypes,
      references: defaultReferences,
      diagnostics: ANNOTATION_ERRORS.concat()
    };
    convertedOutput.resolvePath = createGlobalResolve(convertedOutput, objectMap);
    return convertedOutput;
  }

  _exports.convertTypes = convertTypes;

  function revertValueToGenericType(references, value) {
    var result;

    if (typeof value === "string") {
      var valueMatches = value.match(/(\w+)\.\w+\/.*/);

      if (valueMatches && references.find(function (ref) {
        return ref.alias === valueMatches[1];
      })) {
        result = {
          type: "EnumMember",
          EnumMember: value
        };
      } else {
        result = {
          type: "String",
          String: value
        };
      }
    } else if (Array.isArray(value)) {
      result = {
        type: "Collection",
        Collection: value.map(function (anno) {
          return revertCollectionItemToGenericType(references, anno);
        })
      };
    } else if (typeof value === "boolean") {
      result = {
        type: "Bool",
        Bool: value
      };
    } else if (typeof value === "number") {
      if (value.toString() === value.toFixed()) {
        result = {
          type: "Int",
          Int: value
        };
      } else {
        result = {
          type: "Decimal",
          Decimal: value
        };
      }
    } else if (typeof value === "object" && value.isDecimal && value.isDecimal()) {
      result = {
        type: "Decimal",
        Decimal: value.valueOf()
      };
    } else if (value.type === "Path") {
      result = {
        type: "Path",
        Path: value.path
      };
    } else if (value.type === "AnnotationPath") {
      result = {
        type: "AnnotationPath",
        AnnotationPath: value.value
      };
    } else if (value.type === "PropertyPath") {
      result = {
        type: "PropertyPath",
        PropertyPath: value.value
      };
    } else if (value.type === "NavigationPropertyPath") {
      result = {
        type: "NavigationPropertyPath",
        NavigationPropertyPath: value.value
      };
    } else if (Object.prototype.hasOwnProperty.call(value, "$Type")) {
      result = {
        type: "Record",
        Record: revertCollectionItemToGenericType(references, value)
      };
    }

    return result;
  }

  function revertCollectionItemToGenericType(references, collectionItem) {
    if (typeof collectionItem === "string") {
      return collectionItem;
    } else if (typeof collectionItem === "object") {
      if (collectionItem.hasOwnProperty("$Type")) {
        // Annotation Record
        var outItem = {
          type: collectionItem.$Type,
          propertyValues: []
        }; // Could validate keys and type based on $Type

        Object.keys(collectionItem).forEach(function (collectionKey) {
          if (collectionKey !== "$Type" && collectionKey !== "term" && collectionKey !== "__source" && collectionKey !== "qualifier" && collectionKey !== "ActionTarget" && collectionKey !== "fullyQualifiedName" && collectionKey !== "annotations") {
            var value = collectionItem[collectionKey];
            outItem.propertyValues.push({
              name: collectionKey,
              value: revertValueToGenericType(references, value)
            });
          } else if (collectionKey === "annotations") {
            var annotations = collectionItem[collectionKey];
            outItem.annotations = [];
            Object.keys(annotations).filter(function (key) {
              return key !== "_annotations";
            }).forEach(function (key) {
              Object.keys(annotations[key]).forEach(function (term) {
                var _outItem$annotations;

                var parsedAnnotation = revertTermToGenericType(references, annotations[key][term]);

                if (!parsedAnnotation.term) {
                  var unaliasedTerm = unalias(references, "".concat(key, ".").concat(term));

                  if (unaliasedTerm) {
                    var qualifiedSplit = unaliasedTerm.split("#");
                    parsedAnnotation.term = qualifiedSplit[0];

                    if (qualifiedSplit.length > 1) {
                      parsedAnnotation.qualifier = qualifiedSplit[1];
                    }
                  }
                }

                (_outItem$annotations = outItem.annotations) === null || _outItem$annotations === void 0 ? void 0 : _outItem$annotations.push(parsedAnnotation);
              });
            });
          }
        });
        return outItem;
      } else if (collectionItem.type === "PropertyPath") {
        return {
          type: "PropertyPath",
          PropertyPath: collectionItem.value
        };
      } else if (collectionItem.type === "AnnotationPath") {
        return {
          type: "AnnotationPath",
          AnnotationPath: collectionItem.value
        };
      } else if (collectionItem.type === "NavigationPropertyPath") {
        return {
          type: "NavigationPropertyPath",
          NavigationPropertyPath: collectionItem.value
        };
      }
    }
  }

  function revertTermToGenericType(references, annotation) {
    var baseAnnotation = {
      term: annotation.term,
      qualifier: annotation.qualifier
    };

    if (Array.isArray(annotation)) {
      // Collection
      return _objectSpread(_objectSpread({}, baseAnnotation), {}, {
        collection: annotation.map(function (anno) {
          return revertCollectionItemToGenericType(references, anno);
        })
      });
    } else if (annotation.hasOwnProperty("$Type")) {
      return _objectSpread(_objectSpread({}, baseAnnotation), {}, {
        record: revertCollectionItemToGenericType(references, annotation)
      });
    } else {
      return _objectSpread(_objectSpread({}, baseAnnotation), {}, {
        value: revertValueToGenericType(references, annotation)
      });
    }
  }

  _exports.revertTermToGenericType = revertTermToGenericType;
  return _exports;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9zYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2NvbW1vbi9Bbm5vdGF0aW9uQ29udmVydGVyLnRzIl0sIm5hbWVzIjpbIlBhdGgiLCJwYXRoRXhwcmVzc2lvbiIsInRhcmdldE5hbWUiLCJhbm5vdGF0aW9uc1Rlcm0iLCJhbm5vdGF0aW9uVHlwZSIsInRlcm0iLCJwYXRoIiwidHlwZSIsIiR0YXJnZXQiLCJUZXJtVG9UeXBlcyIsImRlZmF1bHRSZWZlcmVuY2VzIiwiYWxpYXMiLCJuYW1lc3BhY2UiLCJ1cmkiLCJyZWZlcmVuY2VzIiwidW5hbGlhc2VkVmFsdWUiLCJyZXZlcnNlUmVmZXJlbmNlTWFwIiwicmVkdWNlIiwibWFwIiwicmVmZXJlbmNlIiwibGFzdERvdEluZGV4IiwibGFzdEluZGV4T2YiLCJzdWJzdHIiLCJ2YWx1ZSIsImluZGV4T2YiLCJzcGxpdCIsInByZUFsaWFzIiwicG9zdEFsaWFzIiwiam9pbiIsInVuYWxpYXMiLCJhbGlhc2VkVmFsdWUiLCJyZWZlcmVuY2VNYXAiLCJidWlsZE9iamVjdE1hcCIsInBhcnNlck91dHB1dCIsIm9iamVjdE1hcCIsInNjaGVtYSIsImVudGl0eUNvbnRhaW5lciIsImZ1bGx5UXVhbGlmaWVkTmFtZSIsImVudGl0eVNldHMiLCJmb3JFYWNoIiwiZW50aXR5U2V0IiwiYWN0aW9ucyIsImFjdGlvbiIsInBhcmFtZXRlcnMiLCJwYXJhbWV0ZXIiLCJjb21wbGV4VHlwZXMiLCJjb21wbGV4VHlwZSIsInByb3BlcnRpZXMiLCJwcm9wZXJ0eSIsImVudGl0eVR5cGVzIiwiZW50aXR5VHlwZSIsImVudGl0eVByb3BlcnRpZXMiLCJjb21wbGV4VHlwZURlZmluaXRpb24iLCJjb21wbGV4VHlwZVByb3AiLCJjb21wbGV4VHlwZVByb3BUYXJnZXQiLCJPYmplY3QiLCJhc3NpZ24iLCJfdHlwZSIsIm5hbWUiLCJuYXZpZ2F0aW9uUHJvcGVydGllcyIsIm5hdlByb3BlcnR5Iiwia2V5cyIsImFubm90YXRpb25zIiwiYW5ub3RhdGlvblNvdXJjZSIsImFubm90YXRpb25MaXN0IiwiY3VycmVudFRhcmdldE5hbWUiLCJ0YXJnZXQiLCJhbm5vdGF0aW9uIiwiYW5ub3RhdGlvbkZRTiIsInF1YWxpZmllciIsImNvbWJpbmVQYXRoIiwiY3VycmVudFRhcmdldCIsInN0YXJ0c1dpdGgiLCJhZGRBbm5vdGF0aW9uRXJyb3JNZXNzYWdlIiwib0Vycm9yTXNnIiwiQUxMX0FOTk9UQVRJT05fRVJST1JTIiwicHVzaCIsInJlc29sdmVUYXJnZXQiLCJwYXRoT25seSIsImluY2x1ZGVWaXNpdGVkT2JqZWN0cyIsInVuZGVmaW5lZCIsImFWaXNpdGVkT2JqZWN0cyIsInBhdGhTcGxpdCIsInRhcmdldFBhdGhTcGxpdCIsInBhdGhQYXJ0IiwiYW5ub3RhdGlvblBhdGgiLCJjdXJyZW50UGF0aCIsImN1cnJlbnRWYWx1ZSIsImxlbmd0aCIsInRhcmdldFR5cGUiLCJlbnRpdHlUeXBlTmFtZSIsInRhcmdldFR5cGVOYW1lIiwiaXNCb3VuZCIsInNvdXJjZVR5cGUiLCJpc0VudGl0eVNldCIsImxhc3RJZHgiLCJpbnRlcm1lZGlhdGVUYXJnZXQiLCJoYXNPd25Qcm9wZXJ0eSIsIm1lc3NhZ2UiLCJ2aXNpdGVkT2JqZWN0cyIsImlzQW5ub3RhdGlvblBhdGgiLCJwYXRoU3RyIiwicGFyc2VWYWx1ZSIsInByb3BlcnR5VmFsdWUiLCJ2YWx1ZUZRTiIsInRvUmVzb2x2ZSIsInVucmVzb2x2ZWRBbm5vdGF0aW9ucyIsIlN0cmluZyIsIkludCIsIkJvb2wiLCJEZWNpbWFsIiwiRGF0ZSIsIkVudW1NZW1iZXIiLCJQcm9wZXJ0eVBhdGgiLCJOYXZpZ2F0aW9uUHJvcGVydHlQYXRoIiwiYW5ub3RhdGlvblRhcmdldCIsIkFubm90YXRpb25QYXRoIiwicGFyc2VSZWNvcmQiLCJSZWNvcmQiLCJwYXJzZUNvbGxlY3Rpb24iLCJDb2xsZWN0aW9uIiwiaW5mZXJUeXBlRnJvbVRlcm0iLCJpc0Vycm9yIiwicmVjb3JkRGVmaW5pdGlvbiIsImN1cnJlbnRGUU4iLCJhbm5vdGF0aW9uVGVybSIsIiRUeXBlIiwiYW5ub3RhdGlvbkNvbnRlbnQiLCJBcnJheSIsImlzQXJyYXkiLCJzdWJBbm5vdGF0aW9uTGlzdCIsIl9fc291cmNlIiwicHJvcGVydHlWYWx1ZXMiLCJBY3Rpb25UYXJnZXQiLCJBY3Rpb24iLCJBTk5PVEFUSU9OX0VSUk9SUyIsImdldE9ySW5mZXJDb2xsZWN0aW9uVHlwZSIsImNvbGxlY3Rpb25EZWZpbml0aW9uIiwiZmlyc3RDb2xJdGVtIiwicGFyZW50RlFOIiwiY29sbGVjdGlvbkRlZmluaXRpb25UeXBlIiwicHJvcGVydHlQYXRoIiwicHJvcGVydHlJZHgiLCJwYXRoVmFsdWUiLCJhbm5vdGF0aW9uSWR4IiwiYW5ub3RhdGlvbkNvbGxlY3Rpb25FbGVtZW50IiwibmF2UHJvcGVydHlQYXRoIiwibmF2UHJvcElkeCIsInJlY29yZElkeCIsImlmVmFsdWUiLCJzdHJpbmdWYWx1ZSIsIkVycm9yIiwiY29udmVydEFubm90YXRpb24iLCJyZWNvcmQiLCJjb2xsZWN0aW9uIiwiY3JlYXRlUmVzb2x2ZVBhdGhGbiIsInJlbGF0aXZlUGF0aCIsInJlc29sdmVOYXZpZ2F0aW9uUHJvcGVydGllcyIsImFzc29jaWF0aW9ucyIsIm5hdlByb3AiLCJvdXROYXZQcm9wIiwicGFydG5lciIsImlzQ29sbGVjdGlvbiIsImNvbnRhaW5zVGFyZ2V0IiwicmVmZXJlbnRpYWxDb25zdHJhaW50IiwicmVsYXRpb25zaGlwIiwidGFyZ2V0QXNzb2NpYXRpb24iLCJmaW5kIiwiYXNzb2NpYXRpb24iLCJhc3NvY2lhdGlvbkVuZCIsImVuZCIsInJvbGUiLCJ0b1JvbGUiLCJtdWx0aXBsaWNpdHkiLCJvdXROYXZQcm9wUmVxIiwicmVzb2x2ZVBhdGgiLCJsaW5rQWN0aW9uc1RvRW50aXR5VHlwZSIsInNvdXJjZUVudGl0eVR5cGUiLCJyZXR1cm5FbnRpdHlUeXBlIiwicmV0dXJuVHlwZSIsImxpbmtFbnRpdHlUeXBlVG9FbnRpdHlTZXQiLCJrZXlQcm9wIiwiaXNLZXkiLCJsaW5rUHJvcGVydGllc1RvQ29tcGxleFR5cGVzIiwiZW50aXR5UHJvcGVydHkiLCJwcmVwYXJlQ29tcGxleFR5cGVzIiwic3BsaXRUZXJtIiwidGVybVZhbHVlIiwiYWxpYXNlZFRlcm0iLCJsYXN0RG90IiwidGVybUFsaWFzIiwiY3JlYXRlR2xvYmFsUmVzb2x2ZSIsImNvbnZlcnRlZE91dHB1dCIsInNQYXRoIiwiYVBhdGhTcGxpdCIsInNoaWZ0IiwiZW50aXR5U2V0TmFtZSIsImV0Iiwib2JqZWN0UGF0aCIsInRhcmdldFJlc29sdXRpb24iLCJjb252ZXJ0VHlwZXMiLCJ2b2NBbGlhcyIsInZvY1Rlcm0iLCJfYW5ub3RhdGlvbnMiLCJ2b2NUZXJtV2l0aFF1YWxpZmllciIsIkJvb2xlYW4iLCJleHRyYVVucmVzb2x2ZWRBbm5vdGF0aW9ucyIsImJhc2VPYmoiLCJhbm5vdGF0aW9uUGFydCIsInRhcmdldFNwbGl0Iiwic2xpY2UiLCJjdXJyZW50T2JqIiwicmVzb2x2ZWFibGUiLCJ0YXJnZXRTdHIiLCJ0YXJnZXRTdHJpbmciLCJ0ZXJtSW5mbyIsInZlcnNpb24iLCJkaWFnbm9zdGljcyIsImNvbmNhdCIsInJldmVydFZhbHVlVG9HZW5lcmljVHlwZSIsInJlc3VsdCIsInZhbHVlTWF0Y2hlcyIsIm1hdGNoIiwicmVmIiwiYW5ubyIsInJldmVydENvbGxlY3Rpb25JdGVtVG9HZW5lcmljVHlwZSIsInRvU3RyaW5nIiwidG9GaXhlZCIsImlzRGVjaW1hbCIsInZhbHVlT2YiLCJwcm90b3R5cGUiLCJjYWxsIiwiY29sbGVjdGlvbkl0ZW0iLCJvdXRJdGVtIiwiY29sbGVjdGlvbktleSIsImZpbHRlciIsImtleSIsInBhcnNlZEFubm90YXRpb24iLCJyZXZlcnRUZXJtVG9HZW5lcmljVHlwZSIsInVuYWxpYXNlZFRlcm0iLCJxdWFsaWZpZWRTcGxpdCIsImJhc2VBbm5vdGF0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQXNDTUEsSSxHQVFMLGNBQ0NDLGNBREQsRUFFQ0MsVUFGRCxFQUdDQyxlQUhELEVBSUNDLGNBSkQsRUFLQ0MsSUFMRCxFQU1FO0FBQUE7O0FBQ0QsU0FBS0MsSUFBTCxHQUFZTCxjQUFjLENBQUNELElBQTNCO0FBQ0EsU0FBS08sSUFBTCxHQUFZLE1BQVo7QUFDQSxTQUFLQyxPQUFMLEdBQWVOLFVBQWY7QUFDQyxTQUFLRyxJQUFMLEdBQVlBLElBQWIsRUFBcUIsS0FBS0QsY0FBTCxHQUFzQkEsY0FBM0MsRUFBNkQsS0FBS0QsZUFBTCxHQUF1QkEsZUFBcEY7QUFDQSxHOztNQUdHTSxXOzthQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFB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O0FBQ0EsS0FGTSxNQUVBO0FBQ04sNkNBQVk4SyxjQUFaO0FBQTRCMU4sUUFBQUEsS0FBSyxFQUFFb00sd0JBQXdCLENBQUM3TSxVQUFELEVBQWFxRCxVQUFiO0FBQTNEO0FBQ0E7QUFDRCIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcblx0QW5ub3RhdGlvbiBhcyBFZG1Bbm5vdGF0aW9uLFxuXHRBbm5vdGF0aW9uTGlzdCxcblx0QW5ub3RhdGlvblJlY29yZCxcblx0QW5ub3RhdGlvblRlcm0sXG5cdENvbnZlcnRlck91dHB1dCxcblx0RXhwcmVzc2lvbixcblx0UGFyc2VyT3V0cHV0LFxuXHRQYXRoRXhwcmVzc2lvbixcblx0UHJvcGVydHlQYXRoLFxuXHRQcm9wZXJ0eVZhbHVlLFxuXHRBbm5vdGF0aW9uUGF0aEV4cHJlc3Npb24sXG5cdE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhFeHByZXNzaW9uLFxuXHRQcm9wZXJ0eVBhdGhFeHByZXNzaW9uXG59IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlc1wiO1xuaW1wb3J0IHtcblx0QXNzb2NpYXRpb24sXG5cdEdlbmVyaWNOYXZpZ2F0aW9uUHJvcGVydHksXG5cdFJlZmVyZW5jZSxcblx0UHJvcGVydHkgYXMgUGFyc2VyUHJvcGVydHksXG5cdEVudGl0eVR5cGUgYXMgUGFyc2VyRW50aXR5VHlwZSxcblx0Q29tcGxleFR5cGUgYXMgUGFyc2VyQ29tcGxleFR5cGUsXG5cdFYyTmF2aWdhdGlvblByb3BlcnR5LFxuXHRWNE5hdmlnYXRpb25Qcm9wZXJ0eVxufSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXMvZGlzdC9QYXJzZXJcIjtcbmltcG9ydCB7XG5cdEFubm90YXRpb24sXG5cdEVudGl0eVR5cGUsXG5cdENvbXBsZXhUeXBlLFxuXHRBY3Rpb24sXG5cdEVudGl0eVNldCxcblx0UHJvcGVydHksXG5cdE5hdmlnYXRpb25Qcm9wZXJ0eSxcblx0RW50aXR5Q29udGFpbmVyLFxuXHRTZXJ2aWNlT2JqZWN0QW5kQW5ub3RhdGlvbixcblx0UmVzb2x1dGlvblRhcmdldFxufSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXMvZGlzdC9Db252ZXJ0ZXJcIjtcblxuY2xhc3MgUGF0aCB7XG5cdHBhdGg6IHN0cmluZztcblx0JHRhcmdldDogc3RyaW5nO1xuXHR0eXBlOiBzdHJpbmc7XG5cdGFubm90YXRpb25zVGVybTogc3RyaW5nO1xuXHRhbm5vdGF0aW9uVHlwZTogc3RyaW5nO1xuXHR0ZXJtOiBzdHJpbmc7XG5cblx0Y29uc3RydWN0b3IoXG5cdFx0cGF0aEV4cHJlc3Npb246IFBhdGhFeHByZXNzaW9uLFxuXHRcdHRhcmdldE5hbWU6IHN0cmluZyxcblx0XHRhbm5vdGF0aW9uc1Rlcm06IHN0cmluZyxcblx0XHRhbm5vdGF0aW9uVHlwZTogc3RyaW5nLFxuXHRcdHRlcm06IHN0cmluZ1xuXHQpIHtcblx0XHR0aGlzLnBhdGggPSBwYXRoRXhwcmVzc2lvbi5QYXRoO1xuXHRcdHRoaXMudHlwZSA9IFwiUGF0aFwiO1xuXHRcdHRoaXMuJHRhcmdldCA9IHRhcmdldE5hbWU7XG5cdFx0KHRoaXMudGVybSA9IHRlcm0pLCAodGhpcy5hbm5vdGF0aW9uVHlwZSA9IGFubm90YXRpb25UeXBlKSwgKHRoaXMuYW5ub3RhdGlvbnNUZXJtID0gYW5ub3RhdGlvbnNUZXJtKTtcblx0fVxufVxuXG5lbnVtIFRlcm1Ub1R5cGVzIHtcblx0XCJPcmcuT0RhdGEuQXV0aG9yaXphdGlvbi5WMS5TZWN1cml0eVNjaGVtZXNcIiA9IFwiT3JnLk9EYXRhLkF1dGhvcml6YXRpb24uVjEuU2VjdXJpdHlTY2hlbWVcIixcblx0XCJPcmcuT0RhdGEuQXV0aG9yaXphdGlvbi5WMS5BdXRob3JpemF0aW9uc1wiID0gXCJPcmcuT0RhdGEuQXV0aG9yaXphdGlvbi5WMS5BdXRob3JpemF0aW9uXCIsXG5cdFwiT3JnLk9EYXRhLkNvcmUuVjEuUmV2aXNpb25zXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlJldmlzaW9uVHlwZVwiLFxuXHRcIk9yZy5PRGF0YS5Db3JlLlYxLkxpbmtzXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLkxpbmtcIixcblx0XCJPcmcuT0RhdGEuQ29yZS5WMS5FeGFtcGxlXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLkV4YW1wbGVWYWx1ZVwiLFxuXHRcIk9yZy5PRGF0YS5Db3JlLlYxLk1lc3NhZ2VzXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLk1lc3NhZ2VUeXBlXCIsXG5cdFwiT3JnLk9EYXRhLkNvcmUuVjEuVmFsdWVFeGNlcHRpb25cIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVmFsdWVFeGNlcHRpb25UeXBlXCIsXG5cdFwiT3JnLk9EYXRhLkNvcmUuVjEuUmVzb3VyY2VFeGNlcHRpb25cIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuUmVzb3VyY2VFeGNlcHRpb25UeXBlXCIsXG5cdFwiT3JnLk9EYXRhLkNvcmUuVjEuRGF0YU1vZGlmaWNhdGlvbkV4Y2VwdGlvblwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5EYXRhTW9kaWZpY2F0aW9uRXhjZXB0aW9uVHlwZVwiLFxuXHRcIk9yZy5PRGF0YS5Db3JlLlYxLklzTGFuZ3VhZ2VEZXBlbmRlbnRcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiT3JnLk9EYXRhLkNvcmUuVjEuRGVyZWZlcmVuY2VhYmxlSURzXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcIk9yZy5PRGF0YS5Db3JlLlYxLkNvbnZlbnRpb25hbElEc1wiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJPcmcuT0RhdGEuQ29yZS5WMS5QZXJtaXNzaW9uc1wiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5QZXJtaXNzaW9uXCIsXG5cdFwiT3JnLk9EYXRhLkNvcmUuVjEuRGVmYXVsdE5hbWVzcGFjZVwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJPcmcuT0RhdGEuQ29yZS5WMS5JbW11dGFibGVcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiT3JnLk9EYXRhLkNvcmUuVjEuQ29tcHV0ZWRcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiT3JnLk9EYXRhLkNvcmUuVjEuQ29tcHV0ZWREZWZhdWx0VmFsdWVcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiT3JnLk9EYXRhLkNvcmUuVjEuSXNVUkxcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiT3JnLk9EYXRhLkNvcmUuVjEuSXNNZWRpYVR5cGVcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiT3JnLk9EYXRhLkNvcmUuVjEuQ29udGVudERpc3Bvc2l0aW9uXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLkNvbnRlbnREaXNwb3NpdGlvblR5cGVcIixcblx0XCJPcmcuT0RhdGEuQ29yZS5WMS5PcHRpbWlzdGljQ29uY3VycmVuY3lcIiA9IFwiRWRtLlByb3BlcnR5UGF0aFwiLFxuXHRcIk9yZy5PRGF0YS5Db3JlLlYxLkFkZGl0aW9uYWxQcm9wZXJ0aWVzXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcIk9yZy5PRGF0YS5Db3JlLlYxLkF1dG9FeHBhbmRcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiT3JnLk9EYXRhLkNvcmUuVjEuQXV0b0V4cGFuZFJlZmVyZW5jZXNcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiT3JnLk9EYXRhLkNvcmUuVjEuTWF5SW1wbGVtZW50XCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlF1YWxpZmllZFR5cGVOYW1lXCIsXG5cdFwiT3JnLk9EYXRhLkNvcmUuVjEuT3JkZXJlZFwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJPcmcuT0RhdGEuQ29yZS5WMS5Qb3NpdGlvbmFsSW5zZXJ0XCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcIk9yZy5PRGF0YS5Db3JlLlYxLkFsdGVybmF0ZUtleXNcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuQWx0ZXJuYXRlS2V5XCIsXG5cdFwiT3JnLk9EYXRhLkNvcmUuVjEuT3B0aW9uYWxQYXJhbWV0ZXJcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuT3B0aW9uYWxQYXJhbWV0ZXJUeXBlXCIsXG5cdFwiT3JnLk9EYXRhLkNvcmUuVjEuT3BlcmF0aW9uQXZhaWxhYmxlXCIgPSBcIkVkbS5Cb29sZWFuXCIsXG5cdFwiT3JnLk9EYXRhLkNvcmUuVjEuU3ltYm9saWNOYW1lXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlNpbXBsZUlkZW50aWZpZXJcIixcblx0XCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLkNvbmZvcm1hbmNlTGV2ZWxcIiA9IFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5Db25mb3JtYW5jZUxldmVsVHlwZVwiLFxuXHRcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuQXN5bmNocm9ub3VzUmVxdWVzdHNTdXBwb3J0ZWRcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5CYXRjaENvbnRpbnVlT25FcnJvclN1cHBvcnRlZFwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLklzb2xhdGlvblN1cHBvcnRlZFwiID0gXCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLklzb2xhdGlvbkxldmVsXCIsXG5cdFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5Dcm9zc0pvaW5TdXBwb3J0ZWRcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5DYWxsYmFja1N1cHBvcnRlZFwiID0gXCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLkNhbGxiYWNrVHlwZVwiLFxuXHRcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuQ2hhbmdlVHJhY2tpbmdcIiA9IFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5DaGFuZ2VUcmFja2luZ1R5cGVcIixcblx0XCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLkNvdW50UmVzdHJpY3Rpb25zXCIgPSBcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuQ291bnRSZXN0cmljdGlvbnNUeXBlXCIsXG5cdFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5OYXZpZ2F0aW9uUmVzdHJpY3Rpb25zXCIgPSBcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuTmF2aWdhdGlvblJlc3RyaWN0aW9uc1R5cGVcIixcblx0XCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLkluZGV4YWJsZUJ5S2V5XCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuVG9wU3VwcG9ydGVkXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuU2tpcFN1cHBvcnRlZFwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLkNvbXB1dGVTdXBwb3J0ZWRcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5TZWxlY3RTdXBwb3J0XCIgPSBcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuU2VsZWN0U3VwcG9ydFR5cGVcIixcblx0XCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLkJhdGNoU3VwcG9ydGVkXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuQmF0Y2hTdXBwb3J0XCIgPSBcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuQmF0Y2hTdXBwb3J0VHlwZVwiLFxuXHRcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuRmlsdGVyUmVzdHJpY3Rpb25zXCIgPSBcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuRmlsdGVyUmVzdHJpY3Rpb25zVHlwZVwiLFxuXHRcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuU29ydFJlc3RyaWN0aW9uc1wiID0gXCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLlNvcnRSZXN0cmljdGlvbnNUeXBlXCIsXG5cdFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5FeHBhbmRSZXN0cmljdGlvbnNcIiA9IFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5FeHBhbmRSZXN0cmljdGlvbnNUeXBlXCIsXG5cdFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5TZWFyY2hSZXN0cmljdGlvbnNcIiA9IFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5TZWFyY2hSZXN0cmljdGlvbnNUeXBlXCIsXG5cdFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5LZXlBc1NlZ21lbnRTdXBwb3J0ZWRcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5RdWVyeVNlZ21lbnRTdXBwb3J0ZWRcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5JbnNlcnRSZXN0cmljdGlvbnNcIiA9IFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5JbnNlcnRSZXN0cmljdGlvbnNUeXBlXCIsXG5cdFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5EZWVwSW5zZXJ0U3VwcG9ydFwiID0gXCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLkRlZXBJbnNlcnRTdXBwb3J0VHlwZVwiLFxuXHRcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuVXBkYXRlUmVzdHJpY3Rpb25zXCIgPSBcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuVXBkYXRlUmVzdHJpY3Rpb25zVHlwZVwiLFxuXHRcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuRGVlcFVwZGF0ZVN1cHBvcnRcIiA9IFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5EZWVwVXBkYXRlU3VwcG9ydFR5cGVcIixcblx0XCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLkRlbGV0ZVJlc3RyaWN0aW9uc1wiID0gXCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLkRlbGV0ZVJlc3RyaWN0aW9uc1R5cGVcIixcblx0XCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLkNvbGxlY3Rpb25Qcm9wZXJ0eVJlc3RyaWN0aW9uc1wiID0gXCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLkNvbGxlY3Rpb25Qcm9wZXJ0eVJlc3RyaWN0aW9uc1R5cGVcIixcblx0XCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLk9wZXJhdGlvblJlc3RyaWN0aW9uc1wiID0gXCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLk9wZXJhdGlvblJlc3RyaWN0aW9uc1R5cGVcIixcblx0XCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLkFubm90YXRpb25WYWx1ZXNJblF1ZXJ5U3VwcG9ydGVkXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuTW9kaWZpY2F0aW9uUXVlcnlPcHRpb25zXCIgPSBcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuTW9kaWZpY2F0aW9uUXVlcnlPcHRpb25zVHlwZVwiLFxuXHRcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuUmVhZFJlc3RyaWN0aW9uc1wiID0gXCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLlJlYWRSZXN0cmljdGlvbnNUeXBlXCIsXG5cdFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5DdXN0b21IZWFkZXJzXCIgPSBcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuQ3VzdG9tUGFyYW1ldGVyXCIsXG5cdFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5DdXN0b21RdWVyeU9wdGlvbnNcIiA9IFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5DdXN0b21QYXJhbWV0ZXJcIixcblx0XCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLk1lZGlhTG9jYXRpb25VcGRhdGVTdXBwb3J0ZWRcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiT3JnLk9EYXRhLkFnZ3JlZ2F0aW9uLlYxLkFwcGx5U3VwcG9ydGVkXCIgPSBcIk9yZy5PRGF0YS5BZ2dyZWdhdGlvbi5WMS5BcHBseVN1cHBvcnRlZFR5cGVcIixcblx0XCJPcmcuT0RhdGEuQWdncmVnYXRpb24uVjEuR3JvdXBhYmxlXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcIk9yZy5PRGF0YS5BZ2dyZWdhdGlvbi5WMS5BZ2dyZWdhdGFibGVcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiT3JnLk9EYXRhLkFnZ3JlZ2F0aW9uLlYxLkNvbnRleHREZWZpbmluZ1Byb3BlcnRpZXNcIiA9IFwiRWRtLlByb3BlcnR5UGF0aFwiLFxuXHRcIk9yZy5PRGF0YS5BZ2dyZWdhdGlvbi5WMS5MZXZlbGVkSGllcmFyY2h5XCIgPSBcIkVkbS5Qcm9wZXJ0eVBhdGhcIixcblx0XCJPcmcuT0RhdGEuQWdncmVnYXRpb24uVjEuUmVjdXJzaXZlSGllcmFyY2h5XCIgPSBcIk9yZy5PRGF0YS5BZ2dyZWdhdGlvbi5WMS5SZWN1cnNpdmVIaWVyYXJjaHlUeXBlXCIsXG5cdFwiT3JnLk9EYXRhLkFnZ3JlZ2F0aW9uLlYxLkF2YWlsYWJsZU9uQWdncmVnYXRlc1wiID0gXCJPcmcuT0RhdGEuQWdncmVnYXRpb24uVjEuQXZhaWxhYmxlT25BZ2dyZWdhdGVzVHlwZVwiLFxuXHRcIk9yZy5PRGF0YS5WYWxpZGF0aW9uLlYxLk1pbmltdW1cIiA9IFwiRWRtLlByaW1pdGl2ZVR5cGVcIixcblx0XCJPcmcuT0RhdGEuVmFsaWRhdGlvbi5WMS5NYXhpbXVtXCIgPSBcIkVkbS5QcmltaXRpdmVUeXBlXCIsXG5cdFwiT3JnLk9EYXRhLlZhbGlkYXRpb24uVjEuRXhjbHVzaXZlXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcIk9yZy5PRGF0YS5WYWxpZGF0aW9uLlYxLkFsbG93ZWRWYWx1ZXNcIiA9IFwiT3JnLk9EYXRhLlZhbGlkYXRpb24uVjEuQWxsb3dlZFZhbHVlXCIsXG5cdFwiT3JnLk9EYXRhLlZhbGlkYXRpb24uVjEuTXVsdGlwbGVPZlwiID0gXCJFZG0uRGVjaW1hbFwiLFxuXHRcIk9yZy5PRGF0YS5WYWxpZGF0aW9uLlYxLkNvbnN0cmFpbnRcIiA9IFwiT3JnLk9EYXRhLlZhbGlkYXRpb24uVjEuQ29uc3RyYWludFR5cGVcIixcblx0XCJPcmcuT0RhdGEuVmFsaWRhdGlvbi5WMS5JdGVtc09mXCIgPSBcIk9yZy5PRGF0YS5WYWxpZGF0aW9uLlYxLkl0ZW1zT2ZUeXBlXCIsXG5cdFwiT3JnLk9EYXRhLlZhbGlkYXRpb24uVjEuT3BlblByb3BlcnR5VHlwZUNvbnN0cmFpbnRcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuUXVhbGlmaWVkVHlwZU5hbWVcIixcblx0XCJPcmcuT0RhdGEuVmFsaWRhdGlvbi5WMS5EZXJpdmVkVHlwZUNvbnN0cmFpbnRcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuUXVhbGlmaWVkVHlwZU5hbWVcIixcblx0XCJPcmcuT0RhdGEuVmFsaWRhdGlvbi5WMS5BbGxvd2VkVGVybXNcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuUXVhbGlmaWVkVGVybU5hbWVcIixcblx0XCJPcmcuT0RhdGEuVmFsaWRhdGlvbi5WMS5BcHBsaWNhYmxlVGVybXNcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuUXVhbGlmaWVkVGVybU5hbWVcIixcblx0XCJPcmcuT0RhdGEuVmFsaWRhdGlvbi5WMS5NYXhJdGVtc1wiID0gXCJFZG0uSW50NjRcIixcblx0XCJPcmcuT0RhdGEuVmFsaWRhdGlvbi5WMS5NaW5JdGVtc1wiID0gXCJFZG0uSW50NjRcIixcblx0XCJPcmcuT0RhdGEuTWVhc3VyZXMuVjEuU2NhbGVcIiA9IFwiRWRtLkJ5dGVcIixcblx0XCJPcmcuT0RhdGEuTWVhc3VyZXMuVjEuRHVyYXRpb25HcmFudWxhcml0eVwiID0gXCJPcmcuT0RhdGEuTWVhc3VyZXMuVjEuRHVyYXRpb25HcmFudWxhcml0eVR5cGVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5BbmFseXRpY3MudjEuRGltZW5zaW9uXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkFuYWx5dGljcy52MS5NZWFzdXJlXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkFuYWx5dGljcy52MS5BY2N1bXVsYXRpdmVNZWFzdXJlXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkFuYWx5dGljcy52MS5Sb2xsZWRVcFByb3BlcnR5Q291bnRcIiA9IFwiRWRtLkludDE2XCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQW5hbHl0aWNzLnYxLlBsYW5uaW5nQWN0aW9uXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkFuYWx5dGljcy52MS5BZ2dyZWdhdGVkUHJvcGVydGllc1wiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5BbmFseXRpY3MudjEuQWdncmVnYXRlZFByb3BlcnR5VHlwZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5TZXJ2aWNlVmVyc2lvblwiID0gXCJFZG0uSW50MzJcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuU2VydmljZVNjaGVtYVZlcnNpb25cIiA9IFwiRWRtLkludDMyXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlRleHRGb3JcIiA9IFwiRWRtLlByb3BlcnR5UGF0aFwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5Jc0xhbmd1YWdlSWRlbnRpZmllclwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuVGV4dEZvcm1hdFwiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuVGV4dEZvcm1hdFR5cGVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuSXNEaWdpdFNlcXVlbmNlXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5Jc1VwcGVyQ2FzZVwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuSXNDdXJyZW5jeVwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuSXNVbml0XCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5Vbml0U3BlY2lmaWNTY2FsZVwiID0gXCJFZG0uUHJpbWl0aXZlVHlwZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5Vbml0U3BlY2lmaWNQcmVjaXNpb25cIiA9IFwiRWRtLlByaW1pdGl2ZVR5cGVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuU2Vjb25kYXJ5S2V5XCIgPSBcIkVkbS5Qcm9wZXJ0eVBhdGhcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuTWluT2NjdXJzXCIgPSBcIkVkbS5JbnQ2NFwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5NYXhPY2N1cnNcIiA9IFwiRWRtLkludDY0XCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkFzc29jaWF0aW9uRW50aXR5XCIgPSBcIkVkbS5OYXZpZ2F0aW9uUHJvcGVydHlQYXRoXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkRlcml2ZWROYXZpZ2F0aW9uXCIgPSBcIkVkbS5OYXZpZ2F0aW9uUHJvcGVydHlQYXRoXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLk1hc2tlZFwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuTWFza2VkQWx3YXlzXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5TZW1hbnRpY09iamVjdE1hcHBpbmdcIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlNlbWFudGljT2JqZWN0TWFwcGluZ1R5cGVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuSXNJbnN0YW5jZUFubm90YXRpb25cIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkZpbHRlckV4cHJlc3Npb25SZXN0cmljdGlvbnNcIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkZpbHRlckV4cHJlc3Npb25SZXN0cmljdGlvblR5cGVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuRmllbGRDb250cm9sXCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5GaWVsZENvbnRyb2xUeXBlXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkFwcGxpY2F0aW9uXCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5BcHBsaWNhdGlvblR5cGVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuVGltZXN0YW1wXCIgPSBcIkVkbS5EYXRlVGltZU9mZnNldFwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5FcnJvclJlc29sdXRpb25cIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkVycm9yUmVzb2x1dGlvblR5cGVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuTWVzc2FnZXNcIiA9IFwiRWRtLkNvbXBsZXhUeXBlXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLm51bWVyaWNTZXZlcml0eVwiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuTnVtZXJpY01lc3NhZ2VTZXZlcml0eVR5cGVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuTWF4aW11bU51bWVyaWNNZXNzYWdlU2V2ZXJpdHlcIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLk51bWVyaWNNZXNzYWdlU2V2ZXJpdHlUeXBlXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLklzQWN0aW9uQ3JpdGljYWxcIiA9IFwiRWRtLkJvb2xlYW5cIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuQXR0cmlidXRlc1wiID0gXCJFZG0uUHJvcGVydHlQYXRoXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlJlbGF0ZWRSZWN1cnNpdmVIaWVyYXJjaHlcIiA9IFwiRWRtLkFubm90YXRpb25QYXRoXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkludGVydmFsXCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5JbnRlcnZhbFR5cGVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuUmVzdWx0Q29udGV4dFwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuV2Vha1JlZmVyZW50aWFsQ29uc3RyYWludFwiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuV2Vha1JlZmVyZW50aWFsQ29uc3RyYWludFR5cGVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuSXNOYXR1cmFsUGVyc29uXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5WYWx1ZUxpc3RcIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlZhbHVlTGlzdFR5cGVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuVmFsdWVMaXN0UmVsZXZhbnRRdWFsaWZpZXJzXCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5TaW1wbGVJZGVudGlmaWVyXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlZhbHVlTGlzdFdpdGhGaXhlZFZhbHVlc1wiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuVmFsdWVMaXN0TWFwcGluZ1wiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuVmFsdWVMaXN0TWFwcGluZ1R5cGVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuSXNDYWxlbmRhclllYXJcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLklzQ2FsZW5kYXJIYWxmeWVhclwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuSXNDYWxlbmRhclF1YXJ0ZXJcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLklzQ2FsZW5kYXJNb250aFwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuSXNDYWxlbmRhcldlZWtcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLklzRGF5T2ZDYWxlbmRhck1vbnRoXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5Jc0RheU9mQ2FsZW5kYXJZZWFyXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5Jc0NhbGVuZGFyWWVhckhhbGZ5ZWFyXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5Jc0NhbGVuZGFyWWVhclF1YXJ0ZXJcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLklzQ2FsZW5kYXJZZWFyTW9udGhcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLklzQ2FsZW5kYXJZZWFyV2Vla1wiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuSXNDYWxlbmRhckRhdGVcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLklzRmlzY2FsWWVhclwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuSXNGaXNjYWxQZXJpb2RcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLklzRmlzY2FsWWVhclBlcmlvZFwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuSXNGaXNjYWxRdWFydGVyXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5Jc0Zpc2NhbFllYXJRdWFydGVyXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5Jc0Zpc2NhbFdlZWtcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLklzRmlzY2FsWWVhcldlZWtcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLklzRGF5T2ZGaXNjYWxZZWFyXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5Jc0Zpc2NhbFllYXJWYXJpYW50XCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5NdXR1YWxseUV4Y2x1c2l2ZVRlcm1cIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkRyYWZ0Um9vdFwiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuRHJhZnRSb290VHlwZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5EcmFmdE5vZGVcIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkRyYWZ0Tm9kZVR5cGVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuRHJhZnRBY3RpdmF0aW9uVmlhXCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5TaW1wbGVJZGVudGlmaWVyXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkVkaXRhYmxlRmllbGRGb3JcIiA9IFwiRWRtLlByb3BlcnR5UGF0aFwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5TZW1hbnRpY0tleVwiID0gXCJFZG0uUHJvcGVydHlQYXRoXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlNpZGVFZmZlY3RzXCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5TaWRlRWZmZWN0c1R5cGVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuRGVmYXVsdFZhbHVlc0Z1bmN0aW9uXCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5RdWFsaWZpZWROYW1lXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkZpbHRlckRlZmF1bHRWYWx1ZVwiID0gXCJFZG0uUHJpbWl0aXZlVHlwZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5GaWx0ZXJEZWZhdWx0VmFsdWVIaWdoXCIgPSBcIkVkbS5QcmltaXRpdmVUeXBlXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlNvcnRPcmRlclwiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuU29ydE9yZGVyVHlwZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5SZWN1cnNpdmVIaWVyYXJjaHlcIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlJlY3Vyc2l2ZUhpZXJhcmNoeVR5cGVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuQ3JlYXRlZEF0XCIgPSBcIkVkbS5EYXRlVGltZU9mZnNldFwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5DcmVhdGVkQnlcIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlVzZXJJRFwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5DaGFuZ2VkQXRcIiA9IFwiRWRtLkRhdGVUaW1lT2Zmc2V0XCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkNoYW5nZWRCeVwiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuVXNlcklEXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkFwcGx5TXVsdGlVbml0QmVoYXZpb3JGb3JTb3J0aW5nQW5kRmlsdGVyaW5nXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvZGVMaXN0LnYxLkN1cnJlbmN5Q29kZXNcIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29kZUxpc3QudjEuQ29kZUxpc3RTb3VyY2VcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db2RlTGlzdC52MS5Vbml0c09mTWVhc3VyZVwiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db2RlTGlzdC52MS5Db2RlTGlzdFNvdXJjZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvZGVMaXN0LnYxLlN0YW5kYXJkQ29kZVwiID0gXCJFZG0uUHJvcGVydHlQYXRoXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29kZUxpc3QudjEuRXh0ZXJuYWxDb2RlXCIgPSBcIkVkbS5Qcm9wZXJ0eVBhdGhcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db2RlTGlzdC52MS5Jc0NvbmZpZ3VyYXRpb25EZXByZWNhdGlvbkNvZGVcIiA9IFwiRWRtLkJvb2xlYW5cIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tdW5pY2F0aW9uLnYxLkNvbnRhY3RcIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbXVuaWNhdGlvbi52MS5Db250YWN0VHlwZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW11bmljYXRpb24udjEuQWRkcmVzc1wiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tdW5pY2F0aW9uLnYxLkFkZHJlc3NUeXBlXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbXVuaWNhdGlvbi52MS5Jc0VtYWlsQWRkcmVzc1wiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tdW5pY2F0aW9uLnYxLklzUGhvbmVOdW1iZXJcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbXVuaWNhdGlvbi52MS5FdmVudFwiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tdW5pY2F0aW9uLnYxLkV2ZW50RGF0YVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW11bmljYXRpb24udjEuVGFza1wiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tdW5pY2F0aW9uLnYxLlRhc2tEYXRhXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbXVuaWNhdGlvbi52MS5NZXNzYWdlXCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW11bmljYXRpb24udjEuTWVzc2FnZURhdGFcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5IaWVyYXJjaHkudjEuUmVjdXJzaXZlSGllcmFyY2h5XCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkhpZXJhcmNoeS52MS5SZWN1cnNpdmVIaWVyYXJjaHlUeXBlXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuUGVyc29uYWxEYXRhLnYxLkVudGl0eVNlbWFudGljc1wiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5QZXJzb25hbERhdGEudjEuRW50aXR5U2VtYW50aWNzVHlwZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlBlcnNvbmFsRGF0YS52MS5GaWVsZFNlbWFudGljc1wiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5QZXJzb25hbERhdGEudjEuRmllbGRTZW1hbnRpY3NUeXBlXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuUGVyc29uYWxEYXRhLnYxLklzUG90ZW50aWFsbHlQZXJzb25hbFwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5QZXJzb25hbERhdGEudjEuSXNQb3RlbnRpYWxseVNlbnNpdGl2ZVwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5TZXNzaW9uLnYxLlN0aWNreVNlc3Npb25TdXBwb3J0ZWRcIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuU2Vzc2lvbi52MS5TdGlja3lTZXNzaW9uU3VwcG9ydGVkVHlwZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkhlYWRlckluZm9cIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuSGVhZGVySW5mb1R5cGVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5JZGVudGlmaWNhdGlvblwiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRBYnN0cmFjdFwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkJhZGdlXCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkJhZGdlVHlwZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkxpbmVJdGVtXCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEFic3RyYWN0XCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuU3RhdHVzSW5mb1wiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRBYnN0cmFjdFwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkZpZWxkR3JvdXBcIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRmllbGRHcm91cFR5cGVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5Db25uZWN0ZWRGaWVsZHNcIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuQ29ubmVjdGVkRmllbGRzVHlwZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkdlb0xvY2F0aW9uc1wiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5HZW9Mb2NhdGlvblR5cGVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5HZW9Mb2NhdGlvblwiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5HZW9Mb2NhdGlvblR5cGVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5Db250YWN0c1wiID0gXCJFZG0uQW5ub3RhdGlvblBhdGhcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5NZWRpYVJlc291cmNlXCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLk1lZGlhUmVzb3VyY2VUeXBlXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YVBvaW50XCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFQb2ludFR5cGVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5LUElcIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuS1BJVHlwZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkNoYXJ0XCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkNoYXJ0RGVmaW5pdGlvblR5cGVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5WYWx1ZUNyaXRpY2FsaXR5XCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlZhbHVlQ3JpdGljYWxpdHlUeXBlXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuQ3JpdGljYWxpdHlMYWJlbHNcIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuQ3JpdGljYWxpdHlMYWJlbFR5cGVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5TZWxlY3Rpb25GaWVsZHNcIiA9IFwiRWRtLlByb3BlcnR5UGF0aFwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkZhY2V0c1wiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5GYWNldFwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkhlYWRlckZhY2V0c1wiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5GYWNldFwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlF1aWNrVmlld0ZhY2V0c1wiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5GYWNldFwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlF1aWNrQ3JlYXRlRmFjZXRzXCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkZhY2V0XCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRmlsdGVyRmFjZXRzXCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlJlZmVyZW5jZUZhY2V0XCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuU2VsZWN0aW9uUHJlc2VudGF0aW9uVmFyaWFudFwiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5TZWxlY3Rpb25QcmVzZW50YXRpb25WYXJpYW50VHlwZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlByZXNlbnRhdGlvblZhcmlhbnRcIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuUHJlc2VudGF0aW9uVmFyaWFudFR5cGVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5TZWxlY3Rpb25WYXJpYW50XCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlNlbGVjdGlvblZhcmlhbnRUeXBlXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuVGhpbmdQZXJzcGVjdGl2ZVwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5Jc1N1bW1hcnlcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuUGFydE9mUHJldmlld1wiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5NYXBcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuR2FsbGVyeVwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5Jc0ltYWdlVVJMXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLklzSW1hZ2VcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuTXVsdGlMaW5lVGV4dFwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5UZXh0QXJyYW5nZW1lbnRcIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuVGV4dEFycmFuZ2VtZW50VHlwZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkltcG9ydGFuY2VcIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuSW1wb3J0YW5jZVR5cGVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5IaWRkZW5cIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuQ3JlYXRlSGlkZGVuXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlVwZGF0ZUhpZGRlblwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EZWxldGVIaWRkZW5cIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuSGlkZGVuRmlsdGVyXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZERlZmF1bHRcIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkQWJzdHJhY3RcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5Dcml0aWNhbGl0eVwiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5Dcml0aWNhbGl0eVR5cGVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5Dcml0aWNhbGl0eUNhbGN1bGF0aW9uXCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkNyaXRpY2FsaXR5Q2FsY3VsYXRpb25UeXBlXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRW1waGFzaXplZFwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5PcmRlckJ5XCIgPSBcIkVkbS5Qcm9wZXJ0eVBhdGhcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5QYXJhbWV0ZXJEZWZhdWx0VmFsdWVcIiA9IFwiRWRtLlByaW1pdGl2ZVR5cGVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5SZWNvbW1lbmRhdGlvblN0YXRlXCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlJlY29tbWVuZGF0aW9uU3RhdGVUeXBlXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuUmVjb21tZW5kYXRpb25MaXN0XCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlJlY29tbWVuZGF0aW9uTGlzdFR5cGVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5FeGNsdWRlRnJvbU5hdmlnYXRpb25Db250ZXh0XCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkhUTUw1LnYxLkNzc0RlZmF1bHRzXCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkhUTUw1LnYxLkNzc0RlZmF1bHRzVHlwZVwiXG59XG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0UmVmZXJlbmNlczogUmVmZXJlbmNlc1dpdGhNYXAgPSBbXG5cdHsgYWxpYXM6IFwiQ2FwYWJpbGl0aWVzXCIsIG5hbWVzcGFjZTogXCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxXCIsIHVyaTogXCJcIiB9LFxuXHR7IGFsaWFzOiBcIkFnZ3JlZ2F0aW9uXCIsIG5hbWVzcGFjZTogXCJPcmcuT0RhdGEuQWdncmVnYXRpb24uVjFcIiwgdXJpOiBcIlwiIH0sXG5cdHsgYWxpYXM6IFwiVmFsaWRhdGlvblwiLCBuYW1lc3BhY2U6IFwiT3JnLk9EYXRhLlZhbGlkYXRpb24uVjFcIiwgdXJpOiBcIlwiIH0sXG5cdHsgbmFtZXNwYWNlOiBcIk9yZy5PRGF0YS5Db3JlLlYxXCIsIGFsaWFzOiBcIkNvcmVcIiwgdXJpOiBcIlwiIH0sXG5cdHsgbmFtZXNwYWNlOiBcIk9yZy5PRGF0YS5NZWFzdXJlcy5WMVwiLCBhbGlhczogXCJNZWFzdXJlc1wiLCB1cmk6IFwiXCIgfSxcblx0eyBuYW1lc3BhY2U6IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxXCIsIGFsaWFzOiBcIkNvbW1vblwiLCB1cmk6IFwiXCIgfSxcblx0eyBuYW1lc3BhY2U6IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjFcIiwgYWxpYXM6IFwiVUlcIiwgdXJpOiBcIlwiIH0sXG5cdHsgbmFtZXNwYWNlOiBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlNlc3Npb24udjFcIiwgYWxpYXM6IFwiU2Vzc2lvblwiLCB1cmk6IFwiXCIgfSxcblx0eyBuYW1lc3BhY2U6IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQW5hbHl0aWNzLnYxXCIsIGFsaWFzOiBcIkFuYWx5dGljc1wiLCB1cmk6IFwiXCIgfSxcblx0eyBuYW1lc3BhY2U6IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29kZUxpc3QudjFcIiwgYWxpYXM6IFwiQ29kZUxpc3RcIiwgdXJpOiBcIlwiIH0sXG5cdHsgbmFtZXNwYWNlOiBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlBlcnNvbmFsRGF0YS52MVwiLCBhbGlhczogXCJQZXJzb25hbERhdGFcIiwgdXJpOiBcIlwiIH0sXG5cdHsgbmFtZXNwYWNlOiBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW11bmljYXRpb24udjFcIiwgYWxpYXM6IFwiQ29tbXVuaWNhdGlvblwiLCB1cmk6IFwiXCIgfSxcblx0eyBuYW1lc3BhY2U6IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuSFRNTDUudjFcIiwgYWxpYXM6IFwiSFRNTDVcIiwgdXJpOiBcIlwiIH1cbl07XG5cbnR5cGUgUmVmZXJlbmNlc1dpdGhNYXAgPSBSZWZlcmVuY2VbXSAmIHtcblx0cmVmZXJlbmNlTWFwPzogUmVjb3JkPHN0cmluZywgUmVmZXJlbmNlPjtcblx0cmV2ZXJzZVJlZmVyZW5jZU1hcD86IFJlY29yZDxzdHJpbmcsIFJlZmVyZW5jZT47XG59O1xuXG5mdW5jdGlvbiBhbGlhcyhyZWZlcmVuY2VzOiBSZWZlcmVuY2VzV2l0aE1hcCwgdW5hbGlhc2VkVmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG5cdGlmICghcmVmZXJlbmNlcy5yZXZlcnNlUmVmZXJlbmNlTWFwKSB7XG5cdFx0cmVmZXJlbmNlcy5yZXZlcnNlUmVmZXJlbmNlTWFwID0gcmVmZXJlbmNlcy5yZWR1Y2UoKG1hcDogUmVjb3JkPHN0cmluZywgUmVmZXJlbmNlPiwgcmVmZXJlbmNlKSA9PiB7XG5cdFx0XHRtYXBbcmVmZXJlbmNlLm5hbWVzcGFjZV0gPSByZWZlcmVuY2U7XG5cdFx0XHRyZXR1cm4gbWFwO1xuXHRcdH0sIHt9KTtcblx0fVxuXHRpZiAoIXVuYWxpYXNlZFZhbHVlKSB7XG5cdFx0cmV0dXJuIHVuYWxpYXNlZFZhbHVlO1xuXHR9XG5cdGNvbnN0IGxhc3REb3RJbmRleCA9IHVuYWxpYXNlZFZhbHVlLmxhc3RJbmRleE9mKFwiLlwiKTtcblx0Y29uc3QgbmFtZXNwYWNlID0gdW5hbGlhc2VkVmFsdWUuc3Vic3RyKDAsIGxhc3REb3RJbmRleCk7XG5cdGNvbnN0IHZhbHVlID0gdW5hbGlhc2VkVmFsdWUuc3Vic3RyKGxhc3REb3RJbmRleCArIDEpO1xuXHRjb25zdCByZWZlcmVuY2UgPSByZWZlcmVuY2VzLnJldmVyc2VSZWZlcmVuY2VNYXBbbmFtZXNwYWNlXTtcblx0aWYgKHJlZmVyZW5jZSkge1xuXHRcdHJldHVybiBgJHtyZWZlcmVuY2UuYWxpYXN9LiR7dmFsdWV9YDtcblx0fSBlbHNlIHtcblx0XHQvLyBUcnkgdG8gc2VlIGlmIGl0J3MgYW4gYW5ub3RhdGlvbiBQYXRoIGxpa2UgdG9fU2FsZXNPcmRlci9AVUkuTGluZUl0ZW1cblx0XHRpZiAodW5hbGlhc2VkVmFsdWUuaW5kZXhPZihcIkBcIikgIT09IC0xKSB7XG5cdFx0XHRjb25zdCBbcHJlQWxpYXMsIC4uLnBvc3RBbGlhc10gPSB1bmFsaWFzZWRWYWx1ZS5zcGxpdChcIkBcIik7XG5cdFx0XHRyZXR1cm4gYCR7cHJlQWxpYXN9QCR7YWxpYXMocmVmZXJlbmNlcywgcG9zdEFsaWFzLmpvaW4oXCJAXCIpKX1gO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gdW5hbGlhc2VkVmFsdWU7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIHVuYWxpYXMocmVmZXJlbmNlczogUmVmZXJlbmNlc1dpdGhNYXAsIGFsaWFzZWRWYWx1ZTogc3RyaW5nIHwgdW5kZWZpbmVkKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcblx0aWYgKCFyZWZlcmVuY2VzLnJlZmVyZW5jZU1hcCkge1xuXHRcdHJlZmVyZW5jZXMucmVmZXJlbmNlTWFwID0gcmVmZXJlbmNlcy5yZWR1Y2UoKG1hcDogUmVjb3JkPHN0cmluZywgUmVmZXJlbmNlPiwgcmVmZXJlbmNlKSA9PiB7XG5cdFx0XHRtYXBbcmVmZXJlbmNlLmFsaWFzXSA9IHJlZmVyZW5jZTtcblx0XHRcdHJldHVybiBtYXA7XG5cdFx0fSwge30pO1xuXHR9XG5cdGlmICghYWxpYXNlZFZhbHVlKSB7XG5cdFx0cmV0dXJuIGFsaWFzZWRWYWx1ZTtcblx0fVxuXHRjb25zdCBbYWxpYXMsIC4uLnZhbHVlXSA9IGFsaWFzZWRWYWx1ZS5zcGxpdChcIi5cIik7XG5cdGNvbnN0IHJlZmVyZW5jZSA9IHJlZmVyZW5jZXMucmVmZXJlbmNlTWFwW2FsaWFzXTtcblx0aWYgKHJlZmVyZW5jZSkge1xuXHRcdHJldHVybiBgJHtyZWZlcmVuY2UubmFtZXNwYWNlfS4ke3ZhbHVlLmpvaW4oXCIuXCIpfWA7XG5cdH0gZWxzZSB7XG5cdFx0Ly8gVHJ5IHRvIHNlZSBpZiBpdCdzIGFuIGFubm90YXRpb24gUGF0aCBsaWtlIHRvX1NhbGVzT3JkZXIvQFVJLkxpbmVJdGVtXG5cdFx0aWYgKGFsaWFzZWRWYWx1ZS5pbmRleE9mKFwiQFwiKSAhPT0gLTEpIHtcblx0XHRcdGNvbnN0IFtwcmVBbGlhcywgLi4ucG9zdEFsaWFzXSA9IGFsaWFzZWRWYWx1ZS5zcGxpdChcIkBcIik7XG5cdFx0XHRyZXR1cm4gYCR7cHJlQWxpYXN9QCR7dW5hbGlhcyhyZWZlcmVuY2VzLCBwb3N0QWxpYXMuam9pbihcIkBcIikpfWA7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBhbGlhc2VkVmFsdWU7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGJ1aWxkT2JqZWN0TWFwKHBhcnNlck91dHB1dDogUGFyc2VyT3V0cHV0KTogUmVjb3JkPHN0cmluZywgYW55PiB7XG5cdGNvbnN0IG9iamVjdE1hcDogYW55ID0ge307XG5cdGlmIChwYXJzZXJPdXRwdXQuc2NoZW1hLmVudGl0eUNvbnRhaW5lciAmJiBwYXJzZXJPdXRwdXQuc2NoZW1hLmVudGl0eUNvbnRhaW5lci5mdWxseVF1YWxpZmllZE5hbWUpIHtcblx0XHRvYmplY3RNYXBbcGFyc2VyT3V0cHV0LnNjaGVtYS5lbnRpdHlDb250YWluZXIuZnVsbHlRdWFsaWZpZWROYW1lXSA9IHBhcnNlck91dHB1dC5zY2hlbWEuZW50aXR5Q29udGFpbmVyO1xuXHR9XG5cdHBhcnNlck91dHB1dC5zY2hlbWEuZW50aXR5U2V0cy5mb3JFYWNoKGVudGl0eVNldCA9PiB7XG5cdFx0b2JqZWN0TWFwW2VudGl0eVNldC5mdWxseVF1YWxpZmllZE5hbWVdID0gZW50aXR5U2V0O1xuXHR9KTtcblx0cGFyc2VyT3V0cHV0LnNjaGVtYS5hY3Rpb25zLmZvckVhY2goYWN0aW9uID0+IHtcblx0XHRvYmplY3RNYXBbYWN0aW9uLmZ1bGx5UXVhbGlmaWVkTmFtZV0gPSBhY3Rpb247XG5cdFx0b2JqZWN0TWFwW2FjdGlvbi5mdWxseVF1YWxpZmllZE5hbWUuc3BsaXQoXCIoXCIpWzBdXSA9IGFjdGlvbjtcblx0XHRhY3Rpb24ucGFyYW1ldGVycy5mb3JFYWNoKHBhcmFtZXRlciA9PiB7XG5cdFx0XHRvYmplY3RNYXBbcGFyYW1ldGVyLmZ1bGx5UXVhbGlmaWVkTmFtZV0gPSBwYXJhbWV0ZXI7XG5cdFx0fSk7XG5cdH0pO1xuXHRwYXJzZXJPdXRwdXQuc2NoZW1hLmNvbXBsZXhUeXBlcy5mb3JFYWNoKGNvbXBsZXhUeXBlID0+IHtcblx0XHRvYmplY3RNYXBbY29tcGxleFR5cGUuZnVsbHlRdWFsaWZpZWROYW1lXSA9IGNvbXBsZXhUeXBlO1xuXHRcdGNvbXBsZXhUeXBlLnByb3BlcnRpZXMuZm9yRWFjaChwcm9wZXJ0eSA9PiB7XG5cdFx0XHRvYmplY3RNYXBbcHJvcGVydHkuZnVsbHlRdWFsaWZpZWROYW1lXSA9IHByb3BlcnR5O1xuXHRcdH0pO1xuXHR9KTtcblx0cGFyc2VyT3V0cHV0LnNjaGVtYS5lbnRpdHlUeXBlcy5mb3JFYWNoKGVudGl0eVR5cGUgPT4ge1xuXHRcdG9iamVjdE1hcFtlbnRpdHlUeXBlLmZ1bGx5UXVhbGlmaWVkTmFtZV0gPSBlbnRpdHlUeXBlO1xuXHRcdGVudGl0eVR5cGUuZW50aXR5UHJvcGVydGllcy5mb3JFYWNoKHByb3BlcnR5ID0+IHtcblx0XHRcdG9iamVjdE1hcFtwcm9wZXJ0eS5mdWxseVF1YWxpZmllZE5hbWVdID0gcHJvcGVydHk7XG5cdFx0XHRpZiAocHJvcGVydHkudHlwZS5pbmRleE9mKFwiRWRtXCIpID09PSAtMSkge1xuXHRcdFx0XHQvLyBIYW5kbGUgY29tcGxleCB0eXBlc1xuXHRcdFx0XHRjb25zdCBjb21wbGV4VHlwZURlZmluaXRpb24gPSBvYmplY3RNYXBbcHJvcGVydHkudHlwZV0gYXMgQ29tcGxleFR5cGU7XG5cdFx0XHRcdGlmIChjb21wbGV4VHlwZURlZmluaXRpb24gJiYgY29tcGxleFR5cGVEZWZpbml0aW9uLnByb3BlcnRpZXMpIHtcblx0XHRcdFx0XHRjb21wbGV4VHlwZURlZmluaXRpb24ucHJvcGVydGllcy5mb3JFYWNoKGNvbXBsZXhUeXBlUHJvcCA9PiB7XG5cdFx0XHRcdFx0XHRjb25zdCBjb21wbGV4VHlwZVByb3BUYXJnZXQ6IFBhcnNlclByb3BlcnR5ID0gT2JqZWN0LmFzc2lnbihjb21wbGV4VHlwZVByb3AsIHtcblx0XHRcdFx0XHRcdFx0X3R5cGU6IFwiUHJvcGVydHlcIixcblx0XHRcdFx0XHRcdFx0ZnVsbHlRdWFsaWZpZWROYW1lOiBwcm9wZXJ0eS5mdWxseVF1YWxpZmllZE5hbWUgKyBcIi9cIiArIGNvbXBsZXhUeXBlUHJvcC5uYW1lXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdG9iamVjdE1hcFtjb21wbGV4VHlwZVByb3BUYXJnZXQuZnVsbHlRdWFsaWZpZWROYW1lXSA9IGNvbXBsZXhUeXBlUHJvcFRhcmdldDtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdGVudGl0eVR5cGUubmF2aWdhdGlvblByb3BlcnRpZXMuZm9yRWFjaChuYXZQcm9wZXJ0eSA9PiB7XG5cdFx0XHRvYmplY3RNYXBbbmF2UHJvcGVydHkuZnVsbHlRdWFsaWZpZWROYW1lXSA9IG5hdlByb3BlcnR5O1xuXHRcdH0pO1xuXHR9KTtcblxuXHRPYmplY3Qua2V5cyhwYXJzZXJPdXRwdXQuc2NoZW1hLmFubm90YXRpb25zKS5mb3JFYWNoKGFubm90YXRpb25Tb3VyY2UgPT4ge1xuXHRcdHBhcnNlck91dHB1dC5zY2hlbWEuYW5ub3RhdGlvbnNbYW5ub3RhdGlvblNvdXJjZV0uZm9yRWFjaChhbm5vdGF0aW9uTGlzdCA9PiB7XG5cdFx0XHRjb25zdCBjdXJyZW50VGFyZ2V0TmFtZSA9IHVuYWxpYXMocGFyc2VyT3V0cHV0LnJlZmVyZW5jZXMsIGFubm90YXRpb25MaXN0LnRhcmdldCk7XG5cdFx0XHRhbm5vdGF0aW9uTGlzdC5hbm5vdGF0aW9ucy5mb3JFYWNoKGFubm90YXRpb24gPT4ge1xuXHRcdFx0XHRsZXQgYW5ub3RhdGlvbkZRTiA9IGAke2N1cnJlbnRUYXJnZXROYW1lfUAke3VuYWxpYXMocGFyc2VyT3V0cHV0LnJlZmVyZW5jZXMsIGFubm90YXRpb24udGVybSl9YDtcblx0XHRcdFx0aWYgKGFubm90YXRpb24ucXVhbGlmaWVyKSB7XG5cdFx0XHRcdFx0YW5ub3RhdGlvbkZRTiArPSBgIyR7YW5ub3RhdGlvbi5xdWFsaWZpZXJ9YDtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodHlwZW9mIGFubm90YXRpb24gIT09IFwib2JqZWN0XCIpIHtcblx0XHRcdFx0XHRkZWJ1Z2dlcjtcblx0XHRcdFx0fVxuXHRcdFx0XHRvYmplY3RNYXBbYW5ub3RhdGlvbkZRTl0gPSBhbm5vdGF0aW9uO1xuXHRcdFx0XHQoYW5ub3RhdGlvbiBhcyBBbm5vdGF0aW9uKS5mdWxseVF1YWxpZmllZE5hbWUgPSBhbm5vdGF0aW9uRlFOO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH0pO1xuXHRyZXR1cm4gb2JqZWN0TWFwO1xufVxuXG5mdW5jdGlvbiBjb21iaW5lUGF0aChjdXJyZW50VGFyZ2V0OiBzdHJpbmcsIHBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG5cdGlmIChwYXRoLnN0YXJ0c1dpdGgoXCJAXCIpKSB7XG5cdFx0cmV0dXJuIGN1cnJlbnRUYXJnZXQgKyB1bmFsaWFzKGRlZmF1bHRSZWZlcmVuY2VzLCBwYXRoKTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gY3VycmVudFRhcmdldCArIFwiL1wiICsgcGF0aDtcblx0fVxufVxuXG5mdW5jdGlvbiBhZGRBbm5vdGF0aW9uRXJyb3JNZXNzYWdlKHBhdGg6IHN0cmluZywgb0Vycm9yTXNnOiBhbnkpIHtcblx0aWYgKCFBTExfQU5OT1RBVElPTl9FUlJPUlNbcGF0aF0pIHtcblx0XHRBTExfQU5OT1RBVElPTl9FUlJPUlNbcGF0aF0gPSBbb0Vycm9yTXNnXTtcblx0fSBlbHNlIHtcblx0XHRBTExfQU5OT1RBVElPTl9FUlJPUlNbcGF0aF0ucHVzaChvRXJyb3JNc2cpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVUYXJnZXQoXG5cdG9iamVjdE1hcDogYW55LFxuXHRjdXJyZW50VGFyZ2V0OiBhbnksXG5cdHBhdGg6IHN0cmluZyxcblx0cGF0aE9ubHk6IGJvb2xlYW4gPSBmYWxzZSxcblx0aW5jbHVkZVZpc2l0ZWRPYmplY3RzOiBib29sZWFuID0gZmFsc2UsXG5cdGFubm90YXRpb25UeXBlPzogc3RyaW5nLFxuXHRhbm5vdGF0aW9uc1Rlcm0/OiBzdHJpbmdcbikge1xuXHRpZiAoIXBhdGgpIHtcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG5cdC8vY29uc3QgcHJvcGVydHlQYXRoID0gcGF0aDtcblx0Y29uc3QgYVZpc2l0ZWRPYmplY3RzOiBhbnlbXSA9IFtdO1xuXHRpZiAoY3VycmVudFRhcmdldCAmJiBjdXJyZW50VGFyZ2V0Ll90eXBlID09PSBcIlByb3BlcnR5XCIpIHtcblx0XHRjdXJyZW50VGFyZ2V0ID0gb2JqZWN0TWFwW2N1cnJlbnRUYXJnZXQuZnVsbHlRdWFsaWZpZWROYW1lLnNwbGl0KFwiL1wiKVswXV07XG5cdH1cblx0cGF0aCA9IGNvbWJpbmVQYXRoKGN1cnJlbnRUYXJnZXQuZnVsbHlRdWFsaWZpZWROYW1lLCBwYXRoKTtcblxuXHRjb25zdCBwYXRoU3BsaXQgPSBwYXRoLnNwbGl0KFwiL1wiKTtcblx0Y29uc3QgdGFyZ2V0UGF0aFNwbGl0OiBzdHJpbmdbXSA9IFtdO1xuXHRwYXRoU3BsaXQuZm9yRWFjaChwYXRoUGFydCA9PiB7XG5cdFx0Ly8gU2VwYXJhdGUgb3V0IHRoZSBhbm5vdGF0aW9uXG5cdFx0aWYgKHBhdGhQYXJ0LmluZGV4T2YoXCJAXCIpICE9PSAtMSkge1xuXHRcdFx0Y29uc3QgW3BhdGgsIGFubm90YXRpb25QYXRoXSA9IHBhdGhQYXJ0LnNwbGl0KFwiQFwiKTtcblx0XHRcdHRhcmdldFBhdGhTcGxpdC5wdXNoKHBhdGgpO1xuXHRcdFx0dGFyZ2V0UGF0aFNwbGl0LnB1c2goYEAke2Fubm90YXRpb25QYXRofWApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0YXJnZXRQYXRoU3BsaXQucHVzaChwYXRoUGFydCk7XG5cdFx0fVxuXHR9KTtcblx0bGV0IGN1cnJlbnRQYXRoID0gcGF0aDtcblx0Y29uc3QgdGFyZ2V0ID0gdGFyZ2V0UGF0aFNwbGl0LnJlZHVjZSgoY3VycmVudFZhbHVlOiBhbnksIHBhdGhQYXJ0KSA9PiB7XG5cdFx0aWYgKHBhdGhQYXJ0ID09PSBcIiRUeXBlXCIgJiYgY3VycmVudFZhbHVlLl90eXBlID09PSBcIkVudGl0eVR5cGVcIikge1xuXHRcdFx0cmV0dXJuIGN1cnJlbnRWYWx1ZTtcblx0XHR9XG5cdFx0aWYgKHBhdGhQYXJ0Lmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0Ly8gRW1wdHkgUGF0aCBhZnRlciBhbiBlbnRpdHlTZXQgbWVhbnMgZW50aXR5VHlwZVxuXHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSAmJiBjdXJyZW50VmFsdWUuX3R5cGUgPT09IFwiRW50aXR5U2V0XCIgJiYgY3VycmVudFZhbHVlLmVudGl0eVR5cGUpIHtcblx0XHRcdFx0YVZpc2l0ZWRPYmplY3RzLnB1c2goY3VycmVudFZhbHVlKTtcblx0XHRcdFx0Y3VycmVudFZhbHVlID0gY3VycmVudFZhbHVlLmVudGl0eVR5cGU7XG5cdFx0XHR9XG5cdFx0XHRpZiAoY3VycmVudFZhbHVlICYmIGN1cnJlbnRWYWx1ZS5fdHlwZSA9PT0gXCJOYXZpZ2F0aW9uUHJvcGVydHlcIiAmJiBjdXJyZW50VmFsdWUudGFyZ2V0VHlwZSkge1xuXHRcdFx0XHRhVmlzaXRlZE9iamVjdHMucHVzaChjdXJyZW50VmFsdWUpO1xuXHRcdFx0XHRjdXJyZW50VmFsdWUgPSBjdXJyZW50VmFsdWUudGFyZ2V0VHlwZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBjdXJyZW50VmFsdWU7XG5cdFx0fVxuXHRcdGlmIChpbmNsdWRlVmlzaXRlZE9iamVjdHMgJiYgY3VycmVudFZhbHVlICE9PSBudWxsICYmIGN1cnJlbnRWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRhVmlzaXRlZE9iamVjdHMucHVzaChjdXJyZW50VmFsdWUpO1xuXHRcdH1cblx0XHRpZiAoIWN1cnJlbnRWYWx1ZSkge1xuXHRcdFx0Y3VycmVudFBhdGggPSBwYXRoUGFydDtcblx0XHR9IGVsc2UgaWYgKGN1cnJlbnRWYWx1ZS5fdHlwZSA9PT0gXCJFbnRpdHlTZXRcIiAmJiBwYXRoUGFydCA9PT0gXCIkVHlwZVwiKSB7XG5cdFx0XHRjdXJyZW50VmFsdWUgPSBjdXJyZW50VmFsdWUudGFyZ2V0VHlwZTtcblx0XHRcdHJldHVybiBjdXJyZW50VmFsdWU7XG5cdFx0fSBlbHNlIGlmIChjdXJyZW50VmFsdWUuX3R5cGUgPT09IFwiRW50aXR5U2V0XCIgJiYgY3VycmVudFZhbHVlLmVudGl0eVR5cGUpIHtcblx0XHRcdGN1cnJlbnRQYXRoID0gY29tYmluZVBhdGgoY3VycmVudFZhbHVlLmVudGl0eVR5cGVOYW1lLCBwYXRoUGFydCk7XG5cdFx0fSBlbHNlIGlmIChjdXJyZW50VmFsdWUuX3R5cGUgPT09IFwiTmF2aWdhdGlvblByb3BlcnR5XCIgJiYgY3VycmVudFZhbHVlLnRhcmdldFR5cGVOYW1lKSB7XG5cdFx0XHRjdXJyZW50UGF0aCA9IGNvbWJpbmVQYXRoKGN1cnJlbnRWYWx1ZS50YXJnZXRUeXBlTmFtZSwgcGF0aFBhcnQpO1xuXHRcdH0gZWxzZSBpZiAoY3VycmVudFZhbHVlLl90eXBlID09PSBcIk5hdmlnYXRpb25Qcm9wZXJ0eVwiICYmIGN1cnJlbnRWYWx1ZS50YXJnZXRUeXBlKSB7XG5cdFx0XHRjdXJyZW50UGF0aCA9IGNvbWJpbmVQYXRoKGN1cnJlbnRWYWx1ZS50YXJnZXRUeXBlLmZ1bGx5UXVhbGlmaWVkTmFtZSwgcGF0aFBhcnQpO1xuXHRcdH0gZWxzZSBpZiAoY3VycmVudFZhbHVlLl90eXBlID09PSBcIlByb3BlcnR5XCIpIHtcblx0XHRcdGN1cnJlbnRQYXRoID0gY29tYmluZVBhdGgoY3VycmVudFZhbHVlLmZ1bGx5UXVhbGlmaWVkTmFtZSwgcGF0aFBhcnQpO1xuXHRcdH0gZWxzZSBpZiAoY3VycmVudFZhbHVlLl90eXBlID09PSBcIkFjdGlvblwiICYmIGN1cnJlbnRWYWx1ZS5pc0JvdW5kKSB7XG5cdFx0XHRjdXJyZW50UGF0aCA9IGNvbWJpbmVQYXRoKGN1cnJlbnRWYWx1ZS5mdWxseVF1YWxpZmllZE5hbWUsIHBhdGhQYXJ0KTtcblx0XHRcdGlmICghb2JqZWN0TWFwW2N1cnJlbnRQYXRoXSkge1xuXHRcdFx0XHRjdXJyZW50UGF0aCA9IGNvbWJpbmVQYXRoKGN1cnJlbnRWYWx1ZS5zb3VyY2VUeXBlLCBwYXRoUGFydCk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChjdXJyZW50VmFsdWUuX3R5cGUgPT09IFwiQWN0aW9uUGFyYW1ldGVyXCIgJiYgY3VycmVudFZhbHVlLmlzRW50aXR5U2V0KSB7XG5cdFx0XHRjdXJyZW50UGF0aCA9IGNvbWJpbmVQYXRoKGN1cnJlbnRWYWx1ZS50eXBlLCBwYXRoUGFydCk7XG5cdFx0fSBlbHNlIGlmIChjdXJyZW50VmFsdWUuX3R5cGUgPT09IFwiQWN0aW9uUGFyYW1ldGVyXCIgJiYgIWN1cnJlbnRWYWx1ZS5pc0VudGl0eVNldCkge1xuXHRcdFx0Y3VycmVudFBhdGggPSBjb21iaW5lUGF0aChcblx0XHRcdFx0Y3VycmVudFRhcmdldC5mdWxseVF1YWxpZmllZE5hbWUuc3Vic3RyKDAsIGN1cnJlbnRUYXJnZXQuZnVsbHlRdWFsaWZpZWROYW1lLmxhc3RJbmRleE9mKFwiL1wiKSksXG5cdFx0XHRcdHBhdGhQYXJ0XG5cdFx0XHQpO1xuXHRcdFx0aWYgKCFvYmplY3RNYXBbY3VycmVudFBhdGhdKSB7XG5cdFx0XHRcdGxldCBsYXN0SWR4ID0gY3VycmVudFRhcmdldC5mdWxseVF1YWxpZmllZE5hbWUubGFzdEluZGV4T2YoXCIvXCIpO1xuXHRcdFx0XHRpZiAobGFzdElkeCA9PT0gLTEpIHtcblx0XHRcdFx0XHRsYXN0SWR4ID0gY3VycmVudFRhcmdldC5mdWxseVF1YWxpZmllZE5hbWUubGVuZ3RoO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGN1cnJlbnRQYXRoID0gY29tYmluZVBhdGgoXG5cdFx0XHRcdFx0KG9iamVjdE1hcFtjdXJyZW50VGFyZ2V0LmZ1bGx5UXVhbGlmaWVkTmFtZS5zdWJzdHIoMCwgbGFzdElkeCldIGFzIEFjdGlvbikuc291cmNlVHlwZSxcblx0XHRcdFx0XHRwYXRoUGFydFxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRjdXJyZW50UGF0aCA9IGNvbWJpbmVQYXRoKGN1cnJlbnRWYWx1ZS5mdWxseVF1YWxpZmllZE5hbWUsIHBhdGhQYXJ0KTtcblx0XHRcdGlmIChwYXRoUGFydCAhPT0gXCJuYW1lXCIgJiYgY3VycmVudFZhbHVlW3BhdGhQYXJ0XSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHJldHVybiBjdXJyZW50VmFsdWVbcGF0aFBhcnRdO1xuXHRcdFx0fSBlbHNlIGlmIChwYXRoUGFydCA9PT0gXCIkQW5ub3RhdGlvblBhdGhcIiAmJiBjdXJyZW50VmFsdWUuJHRhcmdldCkge1xuXHRcdFx0XHRyZXR1cm4gY3VycmVudFZhbHVlLiR0YXJnZXQ7XG5cdFx0XHR9IGVsc2UgaWYgKHBhdGhQYXJ0ID09PSBcIiRQYXRoXCIgJiYgY3VycmVudFZhbHVlLiR0YXJnZXQpIHtcblx0XHRcdFx0cmV0dXJuIGN1cnJlbnRWYWx1ZS4kdGFyZ2V0O1xuXHRcdFx0fSBlbHNlIGlmIChwYXRoUGFydC5zdGFydHNXaXRoKFwiJFBhdGhcIikgJiYgY3VycmVudFZhbHVlLiR0YXJnZXQpIHtcblx0XHRcdFx0Y29uc3QgaW50ZXJtZWRpYXRlVGFyZ2V0ID0gY3VycmVudFZhbHVlLiR0YXJnZXQ7XG5cdFx0XHRcdGN1cnJlbnRQYXRoID0gY29tYmluZVBhdGgoaW50ZXJtZWRpYXRlVGFyZ2V0LmZ1bGx5UXVhbGlmaWVkTmFtZSwgcGF0aFBhcnQuc3Vic3RyKDUpKTtcblx0XHRcdH0gZWxzZSBpZiAoY3VycmVudFZhbHVlLmhhc093blByb3BlcnR5KFwiJFR5cGVcIikpIHtcblx0XHRcdFx0Ly8gVGhpcyBpcyBub3cgYW4gYW5ub3RhdGlvbiB2YWx1ZVxuXHRcdFx0XHRjb25zdCBlbnRpdHlUeXBlID0gb2JqZWN0TWFwW2N1cnJlbnRWYWx1ZS5mdWxseVF1YWxpZmllZE5hbWUuc3BsaXQoXCJAXCIpWzBdXTtcblx0XHRcdFx0aWYgKGVudGl0eVR5cGUpIHtcblx0XHRcdFx0XHRjdXJyZW50UGF0aCA9IGNvbWJpbmVQYXRoKGVudGl0eVR5cGUuZnVsbHlRdWFsaWZpZWROYW1lLCBwYXRoUGFydCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG9iamVjdE1hcFtjdXJyZW50UGF0aF07XG5cdH0sIG51bGwpO1xuXHRpZiAoIXRhcmdldCkge1xuXHRcdGlmIChhbm5vdGF0aW9uc1Rlcm0gJiYgYW5ub3RhdGlvblR5cGUpIHtcblx0XHRcdHZhciBvRXJyb3JNc2cgPSB7XG5cdFx0XHRcdG1lc3NhZ2U6XG5cdFx0XHRcdFx0XCJVbmFibGUgdG8gcmVzb2x2ZSB0aGUgcGF0aCBleHByZXNzaW9uOiBcIiArXG5cdFx0XHRcdFx0XCJcXG5cIiArXG5cdFx0XHRcdFx0cGF0aCArXG5cdFx0XHRcdFx0XCJcXG5cIiArXG5cdFx0XHRcdFx0XCJcXG5cIiArXG5cdFx0XHRcdFx0XCJIaW50OiBDaGVjayBhbmQgY29ycmVjdCB0aGUgcGF0aCB2YWx1ZXMgdW5kZXIgdGhlIGZvbGxvd2luZyBzdHJ1Y3R1cmUgaW4gdGhlIG1ldGFkYXRhIChhbm5vdGF0aW9uLnhtbCBmaWxlIG9yIENEUyBhbm5vdGF0aW9ucyBmb3IgdGhlIGFwcGxpY2F0aW9uKTogXFxuXFxuXCIgK1xuXHRcdFx0XHRcdFwiPEFubm90YXRpb24gVGVybSA9IFwiICtcblx0XHRcdFx0XHRhbm5vdGF0aW9uc1Rlcm0gK1xuXHRcdFx0XHRcdFwiPlwiICtcblx0XHRcdFx0XHRcIlxcblwiICtcblx0XHRcdFx0XHRcIjxSZWNvcmQgVHlwZSA9IFwiICtcblx0XHRcdFx0XHRhbm5vdGF0aW9uVHlwZSArXG5cdFx0XHRcdFx0XCI+XCIgK1xuXHRcdFx0XHRcdFwiXFxuXCIgK1xuXHRcdFx0XHRcdFwiPEFubm90YXRpb25QYXRoID0gXCIgK1xuXHRcdFx0XHRcdHBhdGggK1xuXHRcdFx0XHRcdFwiPlwiXG5cdFx0XHR9O1xuXHRcdFx0YWRkQW5ub3RhdGlvbkVycm9yTWVzc2FnZShwYXRoLCBvRXJyb3JNc2cpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgb0Vycm9yTXNnID0ge1xuXHRcdFx0XHRtZXNzYWdlOlxuXHRcdFx0XHRcdFwiVW5hYmxlIHRvIHJlc29sdmUgdGhlIHBhdGggZXhwcmVzc2lvbjogXCIgK1xuXHRcdFx0XHRcdHBhdGggK1xuXHRcdFx0XHRcdFwiXFxuXCIgK1xuXHRcdFx0XHRcdFwiXFxuXCIgK1xuXHRcdFx0XHRcdFwiSGludDogQ2hlY2sgYW5kIGNvcnJlY3QgdGhlIHBhdGggdmFsdWVzIHVuZGVyIHRoZSBmb2xsb3dpbmcgc3RydWN0dXJlIGluIHRoZSBtZXRhZGF0YSAoYW5ub3RhdGlvbi54bWwgZmlsZSBvciBDRFMgYW5ub3RhdGlvbnMgZm9yIHRoZSBhcHBsaWNhdGlvbik6IFxcblxcblwiICtcblx0XHRcdFx0XHRcIjxBbm5vdGF0aW9uIFRlcm0gPSBcIiArXG5cdFx0XHRcdFx0cGF0aFNwbGl0WzBdICtcblx0XHRcdFx0XHRcIj5cIiArXG5cdFx0XHRcdFx0XCJcXG5cIiArXG5cdFx0XHRcdFx0XCI8UHJvcGVydHlWYWx1ZSAgUGF0aD0gXCIgK1xuXHRcdFx0XHRcdHBhdGhTcGxpdFsxXSArXG5cdFx0XHRcdFx0XCI+XCJcblx0XHRcdH07XG5cdFx0XHRhZGRBbm5vdGF0aW9uRXJyb3JNZXNzYWdlKHBhdGgsIG9FcnJvck1zZyk7XG5cdFx0fVxuXHRcdC8vIGNvbnNvbGUubG9nKFwiTWlzc2luZyB0YXJnZXQgXCIgKyBwYXRoKTtcblx0fVxuXHRpZiAocGF0aE9ubHkpIHtcblx0XHRyZXR1cm4gY3VycmVudFBhdGg7XG5cdH1cblx0aWYgKGluY2x1ZGVWaXNpdGVkT2JqZWN0cykge1xuXHRcdHJldHVybiB7XG5cdFx0XHR2aXNpdGVkT2JqZWN0czogYVZpc2l0ZWRPYmplY3RzLFxuXHRcdFx0dGFyZ2V0OiB0YXJnZXRcblx0XHR9O1xuXHR9XG5cdHJldHVybiB0YXJnZXQ7XG59XG5cbmZ1bmN0aW9uIGlzQW5ub3RhdGlvblBhdGgocGF0aFN0cjogc3RyaW5nKTogYm9vbGVhbiB7XG5cdHJldHVybiBwYXRoU3RyLmluZGV4T2YoXCJAXCIpICE9PSAtMTtcbn1cblxuZnVuY3Rpb24gcGFyc2VWYWx1ZShcblx0cHJvcGVydHlWYWx1ZTogRXhwcmVzc2lvbixcblx0dmFsdWVGUU46IHN0cmluZyxcblx0cGFyc2VyT3V0cHV0OiBQYXJzZXJPdXRwdXQsXG5cdGN1cnJlbnRUYXJnZXQ6IGFueSxcblx0b2JqZWN0TWFwOiBhbnksXG5cdHRvUmVzb2x2ZTogUmVzb2x2ZWFibGVbXSxcblx0YW5ub3RhdGlvblNvdXJjZTogc3RyaW5nLFxuXHR1bnJlc29sdmVkQW5ub3RhdGlvbnM6IEFubm90YXRpb25MaXN0W10sXG5cdGFubm90YXRpb25UeXBlOiBzdHJpbmcsXG5cdGFubm90YXRpb25zVGVybTogc3RyaW5nXG4pIHtcblx0aWYgKHByb3BlcnR5VmFsdWUgPT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdH1cblx0c3dpdGNoIChwcm9wZXJ0eVZhbHVlLnR5cGUpIHtcblx0XHRjYXNlIFwiU3RyaW5nXCI6XG5cdFx0XHRyZXR1cm4gcHJvcGVydHlWYWx1ZS5TdHJpbmc7XG5cdFx0Y2FzZSBcIkludFwiOlxuXHRcdFx0cmV0dXJuIHByb3BlcnR5VmFsdWUuSW50O1xuXHRcdGNhc2UgXCJCb29sXCI6XG5cdFx0XHRyZXR1cm4gcHJvcGVydHlWYWx1ZS5Cb29sO1xuXHRcdGNhc2UgXCJEZWNpbWFsXCI6XG5cdFx0XHRyZXR1cm4gcHJvcGVydHlWYWx1ZS5EZWNpbWFsO1xuXHRcdGNhc2UgXCJEYXRlXCI6XG5cdFx0XHRyZXR1cm4gcHJvcGVydHlWYWx1ZS5EYXRlO1xuXHRcdGNhc2UgXCJFbnVtTWVtYmVyXCI6XG5cdFx0XHRyZXR1cm4gYWxpYXMocGFyc2VyT3V0cHV0LnJlZmVyZW5jZXMsIHByb3BlcnR5VmFsdWUuRW51bU1lbWJlcik7XG5cdFx0Y2FzZSBcIlByb3BlcnR5UGF0aFwiOlxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dHlwZTogXCJQcm9wZXJ0eVBhdGhcIixcblx0XHRcdFx0dmFsdWU6IHByb3BlcnR5VmFsdWUuUHJvcGVydHlQYXRoLFxuXHRcdFx0XHRmdWxseVF1YWxpZmllZE5hbWU6IHZhbHVlRlFOLFxuXHRcdFx0XHQkdGFyZ2V0OiByZXNvbHZlVGFyZ2V0KFxuXHRcdFx0XHRcdG9iamVjdE1hcCxcblx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LFxuXHRcdFx0XHRcdHByb3BlcnR5VmFsdWUuUHJvcGVydHlQYXRoLFxuXHRcdFx0XHRcdGZhbHNlLFxuXHRcdFx0XHRcdGZhbHNlLFxuXHRcdFx0XHRcdGFubm90YXRpb25UeXBlLFxuXHRcdFx0XHRcdGFubm90YXRpb25zVGVybVxuXHRcdFx0XHQpXG5cdFx0XHR9O1xuXHRcdGNhc2UgXCJOYXZpZ2F0aW9uUHJvcGVydHlQYXRoXCI6XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR0eXBlOiBcIk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcIixcblx0XHRcdFx0dmFsdWU6IHByb3BlcnR5VmFsdWUuTmF2aWdhdGlvblByb3BlcnR5UGF0aCxcblx0XHRcdFx0ZnVsbHlRdWFsaWZpZWROYW1lOiB2YWx1ZUZRTixcblx0XHRcdFx0JHRhcmdldDogcmVzb2x2ZVRhcmdldChcblx0XHRcdFx0XHRvYmplY3RNYXAsXG5cdFx0XHRcdFx0Y3VycmVudFRhcmdldCxcblx0XHRcdFx0XHRwcm9wZXJ0eVZhbHVlLk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgsXG5cdFx0XHRcdFx0ZmFsc2UsXG5cdFx0XHRcdFx0ZmFsc2UsXG5cdFx0XHRcdFx0YW5ub3RhdGlvblR5cGUsXG5cdFx0XHRcdFx0YW5ub3RhdGlvbnNUZXJtXG5cdFx0XHRcdClcblx0XHRcdH07XG5cdFx0Y2FzZSBcIkFubm90YXRpb25QYXRoXCI6XG5cdFx0XHRjb25zdCBhbm5vdGF0aW9uVGFyZ2V0ID0gcmVzb2x2ZVRhcmdldChcblx0XHRcdFx0b2JqZWN0TWFwLFxuXHRcdFx0XHRjdXJyZW50VGFyZ2V0LFxuXHRcdFx0XHR1bmFsaWFzKHBhcnNlck91dHB1dC5yZWZlcmVuY2VzLCBwcm9wZXJ0eVZhbHVlLkFubm90YXRpb25QYXRoKSBhcyBzdHJpbmcsXG5cdFx0XHRcdHRydWUsXG5cdFx0XHRcdGZhbHNlLFxuXHRcdFx0XHRhbm5vdGF0aW9uVHlwZSxcblx0XHRcdFx0YW5ub3RhdGlvbnNUZXJtXG5cdFx0XHQpO1xuXHRcdFx0Y29uc3QgYW5ub3RhdGlvblBhdGggPSB7XG5cdFx0XHRcdHR5cGU6IFwiQW5ub3RhdGlvblBhdGhcIixcblx0XHRcdFx0dmFsdWU6IHByb3BlcnR5VmFsdWUuQW5ub3RhdGlvblBhdGgsXG5cdFx0XHRcdGZ1bGx5UXVhbGlmaWVkTmFtZTogdmFsdWVGUU4sXG5cdFx0XHRcdCR0YXJnZXQ6IGFubm90YXRpb25UYXJnZXQsXG5cdFx0XHRcdGFubm90YXRpb25UeXBlOiBhbm5vdGF0aW9uVHlwZSxcblx0XHRcdFx0YW5ub3RhdGlvbnNUZXJtOiBhbm5vdGF0aW9uc1Rlcm0sXG5cdFx0XHRcdHRlcm06IFwiXCIsXG5cdFx0XHRcdHBhdGg6IFwiXCJcblx0XHRcdH07XG5cdFx0XHR0b1Jlc29sdmUucHVzaChhbm5vdGF0aW9uUGF0aCk7XG5cdFx0XHRyZXR1cm4gYW5ub3RhdGlvblBhdGg7XG5cdFx0Y2FzZSBcIlBhdGhcIjpcblx0XHRcdGlmIChpc0Fubm90YXRpb25QYXRoKHByb3BlcnR5VmFsdWUuUGF0aCkpIHtcblx0XHRcdFx0Ly8gSWYgaXQncyBhbiBhbm50b2F0aW9uIHRoYXQgd2UgY2FuIHJlc29sdmUsIHJlc29sdmUgaXQgIVxuXHRcdFx0XHRjb25zdCAkdGFyZ2V0ID0gcmVzb2x2ZVRhcmdldChcblx0XHRcdFx0XHRvYmplY3RNYXAsXG5cdFx0XHRcdFx0Y3VycmVudFRhcmdldCxcblx0XHRcdFx0XHRwcm9wZXJ0eVZhbHVlLlBhdGgsXG5cdFx0XHRcdFx0ZmFsc2UsXG5cdFx0XHRcdFx0ZmFsc2UsXG5cdFx0XHRcdFx0YW5ub3RhdGlvblR5cGUsXG5cdFx0XHRcdFx0YW5ub3RhdGlvbnNUZXJtXG5cdFx0XHRcdCk7XG5cdFx0XHRcdGlmICgkdGFyZ2V0KSB7XG5cdFx0XHRcdFx0cmV0dXJuICR0YXJnZXQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGNvbnN0ICR0YXJnZXQgPSByZXNvbHZlVGFyZ2V0KFxuXHRcdFx0XHRvYmplY3RNYXAsXG5cdFx0XHRcdGN1cnJlbnRUYXJnZXQsXG5cdFx0XHRcdHByb3BlcnR5VmFsdWUuUGF0aCxcblx0XHRcdFx0dHJ1ZSxcblx0XHRcdFx0ZmFsc2UsXG5cdFx0XHRcdGFubm90YXRpb25UeXBlLFxuXHRcdFx0XHRhbm5vdGF0aW9uc1Rlcm1cblx0XHRcdCk7XG5cdFx0XHRjb25zdCBwYXRoID0gbmV3IFBhdGgocHJvcGVydHlWYWx1ZSwgJHRhcmdldCwgYW5ub3RhdGlvbnNUZXJtLCBhbm5vdGF0aW9uVHlwZSwgXCJcIik7XG5cdFx0XHR0b1Jlc29sdmUucHVzaChwYXRoKTtcblx0XHRcdHJldHVybiBwYXRoO1xuXG5cdFx0Y2FzZSBcIlJlY29yZFwiOlxuXHRcdFx0cmV0dXJuIHBhcnNlUmVjb3JkKFxuXHRcdFx0XHRwcm9wZXJ0eVZhbHVlLlJlY29yZCxcblx0XHRcdFx0dmFsdWVGUU4sXG5cdFx0XHRcdHBhcnNlck91dHB1dCxcblx0XHRcdFx0Y3VycmVudFRhcmdldCxcblx0XHRcdFx0b2JqZWN0TWFwLFxuXHRcdFx0XHR0b1Jlc29sdmUsXG5cdFx0XHRcdGFubm90YXRpb25Tb3VyY2UsXG5cdFx0XHRcdHVucmVzb2x2ZWRBbm5vdGF0aW9ucyxcblx0XHRcdFx0YW5ub3RhdGlvblR5cGUsXG5cdFx0XHRcdGFubm90YXRpb25zVGVybVxuXHRcdFx0KTtcblx0XHRjYXNlIFwiQ29sbGVjdGlvblwiOlxuXHRcdFx0cmV0dXJuIHBhcnNlQ29sbGVjdGlvbihcblx0XHRcdFx0cHJvcGVydHlWYWx1ZS5Db2xsZWN0aW9uLFxuXHRcdFx0XHR2YWx1ZUZRTixcblx0XHRcdFx0cGFyc2VyT3V0cHV0LFxuXHRcdFx0XHRjdXJyZW50VGFyZ2V0LFxuXHRcdFx0XHRvYmplY3RNYXAsXG5cdFx0XHRcdHRvUmVzb2x2ZSxcblx0XHRcdFx0YW5ub3RhdGlvblNvdXJjZSxcblx0XHRcdFx0dW5yZXNvbHZlZEFubm90YXRpb25zLFxuXHRcdFx0XHRhbm5vdGF0aW9uVHlwZSxcblx0XHRcdFx0YW5ub3RhdGlvbnNUZXJtXG5cdFx0XHQpO1xuXHRcdGNhc2UgXCJBcHBseVwiOlxuXHRcdGNhc2UgXCJJZlwiOlxuXHRcdFx0cmV0dXJuIHByb3BlcnR5VmFsdWU7XG5cdH1cbn1cblxuZnVuY3Rpb24gaW5mZXJUeXBlRnJvbVRlcm0oYW5ub3RhdGlvbnNUZXJtOiBzdHJpbmcsIHBhcnNlck91dHB1dDogUGFyc2VyT3V0cHV0LCBhbm5vdGF0aW9uVGFyZ2V0OiBzdHJpbmcpIHtcblx0Y29uc3QgdGFyZ2V0VHlwZSA9IChUZXJtVG9UeXBlcyBhcyBhbnkpW2Fubm90YXRpb25zVGVybV07XG5cdHZhciBvRXJyb3JNc2cgPSB7XG5cdFx0aXNFcnJvcjogZmFsc2UsXG5cdFx0bWVzc2FnZTogYFRoZSB0eXBlIG9mIHRoZSByZWNvcmQgdXNlZCB3aXRoaW4gdGhlIHRlcm0gJHthbm5vdGF0aW9uc1Rlcm19IHdhcyBub3QgZGVmaW5lZCBhbmQgd2FzIGluZmVycmVkIGFzICR7dGFyZ2V0VHlwZX0uXG5IaW50OiBJZiBwb3NzaWJsZSwgdHJ5IHRvIG1haW50YWluIHRoZSBUeXBlIHByb3BlcnR5IGZvciBlYWNoIFJlY29yZC5cbjxBbm5vdGF0aW9ucyBUYXJnZXQ9XCIke2Fubm90YXRpb25UYXJnZXR9XCI+XG5cdDxBbm5vdGF0aW9uIFRlcm09XCIke2Fubm90YXRpb25zVGVybX1cIj5cblx0XHQ8UmVjb3JkPi4uLjwvUmVjb3JkPlxuXHQ8L0Fubm90YXRpb24+XG48L0Fubm90YXRpb25zPmBcblx0fTtcblx0YWRkQW5ub3RhdGlvbkVycm9yTWVzc2FnZShhbm5vdGF0aW9uVGFyZ2V0ICsgXCIvXCIgKyBhbm5vdGF0aW9uc1Rlcm0sIG9FcnJvck1zZyk7XG5cdHJldHVybiB0YXJnZXRUeXBlO1xufVxuXG5mdW5jdGlvbiBwYXJzZVJlY29yZChcblx0cmVjb3JkRGVmaW5pdGlvbjogQW5ub3RhdGlvblJlY29yZCxcblx0Y3VycmVudEZRTjogc3RyaW5nLFxuXHRwYXJzZXJPdXRwdXQ6IFBhcnNlck91dHB1dCxcblx0Y3VycmVudFRhcmdldDogYW55LFxuXHRvYmplY3RNYXA6IGFueSxcblx0dG9SZXNvbHZlOiBSZXNvbHZlYWJsZVtdLFxuXHRhbm5vdGF0aW9uU291cmNlOiBzdHJpbmcsXG5cdHVucmVzb2x2ZWRBbm5vdGF0aW9uczogQW5ub3RhdGlvbkxpc3RbXSxcblx0YW5ub3RhdGlvblR5cGU6IHN0cmluZyxcblx0YW5ub3RhdGlvbnNUZXJtOiBzdHJpbmdcbikge1xuXHRsZXQgdGFyZ2V0VHlwZTtcblx0aWYgKCFyZWNvcmREZWZpbml0aW9uLnR5cGUgJiYgYW5ub3RhdGlvbnNUZXJtKSB7XG5cdFx0dGFyZ2V0VHlwZSA9IGluZmVyVHlwZUZyb21UZXJtKGFubm90YXRpb25zVGVybSwgcGFyc2VyT3V0cHV0LCBjdXJyZW50VGFyZ2V0LmZ1bGx5UXVhbGlmaWVkTmFtZSk7XG5cdH0gZWxzZSB7XG5cdFx0dGFyZ2V0VHlwZSA9IHVuYWxpYXMocGFyc2VyT3V0cHV0LnJlZmVyZW5jZXMsIHJlY29yZERlZmluaXRpb24udHlwZSk7XG5cdH1cblx0Y29uc3QgYW5ub3RhdGlvblRlcm06IGFueSA9IHtcblx0XHQkVHlwZTogdGFyZ2V0VHlwZSxcblx0XHRmdWxseVF1YWxpZmllZE5hbWU6IGN1cnJlbnRGUU5cblx0fTtcblx0Y29uc3QgYW5ub3RhdGlvbkNvbnRlbnQ6IGFueSA9IHt9O1xuXHRpZiAocmVjb3JkRGVmaW5pdGlvbi5hbm5vdGF0aW9ucyAmJiBBcnJheS5pc0FycmF5KHJlY29yZERlZmluaXRpb24uYW5ub3RhdGlvbnMpKSB7XG5cdFx0Y29uc3Qgc3ViQW5ub3RhdGlvbkxpc3QgPSB7XG5cdFx0XHR0YXJnZXQ6IGN1cnJlbnRGUU4sXG5cdFx0XHRhbm5vdGF0aW9uczogcmVjb3JkRGVmaW5pdGlvbi5hbm5vdGF0aW9ucyxcblx0XHRcdF9fc291cmNlOiBhbm5vdGF0aW9uU291cmNlXG5cdFx0fTtcblx0XHR1bnJlc29sdmVkQW5ub3RhdGlvbnMucHVzaChzdWJBbm5vdGF0aW9uTGlzdCk7XG5cdH1cblx0cmVjb3JkRGVmaW5pdGlvbi5wcm9wZXJ0eVZhbHVlcy5mb3JFYWNoKChwcm9wZXJ0eVZhbHVlOiBQcm9wZXJ0eVZhbHVlKSA9PiB7XG5cdFx0YW5ub3RhdGlvbkNvbnRlbnRbcHJvcGVydHlWYWx1ZS5uYW1lXSA9IHBhcnNlVmFsdWUoXG5cdFx0XHRwcm9wZXJ0eVZhbHVlLnZhbHVlLFxuXHRcdFx0YCR7Y3VycmVudEZRTn0vJHtwcm9wZXJ0eVZhbHVlLm5hbWV9YCxcblx0XHRcdHBhcnNlck91dHB1dCxcblx0XHRcdGN1cnJlbnRUYXJnZXQsXG5cdFx0XHRvYmplY3RNYXAsXG5cdFx0XHR0b1Jlc29sdmUsXG5cdFx0XHRhbm5vdGF0aW9uU291cmNlLFxuXHRcdFx0dW5yZXNvbHZlZEFubm90YXRpb25zLFxuXHRcdFx0YW5ub3RhdGlvblR5cGUsXG5cdFx0XHRhbm5vdGF0aW9uc1Rlcm1cblx0XHQpO1xuXHRcdGlmIChwcm9wZXJ0eVZhbHVlLmFubm90YXRpb25zICYmIEFycmF5LmlzQXJyYXkocHJvcGVydHlWYWx1ZS5hbm5vdGF0aW9ucykpIHtcblx0XHRcdGNvbnN0IHN1YkFubm90YXRpb25MaXN0ID0ge1xuXHRcdFx0XHR0YXJnZXQ6IGAke2N1cnJlbnRGUU59LyR7cHJvcGVydHlWYWx1ZS5uYW1lfWAsXG5cdFx0XHRcdGFubm90YXRpb25zOiBwcm9wZXJ0eVZhbHVlLmFubm90YXRpb25zLFxuXHRcdFx0XHRfX3NvdXJjZTogYW5ub3RhdGlvblNvdXJjZVxuXHRcdFx0fTtcblx0XHRcdHVucmVzb2x2ZWRBbm5vdGF0aW9ucy5wdXNoKHN1YkFubm90YXRpb25MaXN0KTtcblx0XHR9XG5cdFx0aWYgKFxuXHRcdFx0YW5ub3RhdGlvbkNvbnRlbnQuaGFzT3duUHJvcGVydHkoXCJBY3Rpb25cIikgJiZcblx0XHRcdChhbm5vdGF0aW9uVGVybS4kVHlwZSA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRGb3JBY3Rpb25cIiB8fFxuXHRcdFx0XHRhbm5vdGF0aW9uVGVybS4kVHlwZSA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRXaXRoQWN0aW9uXCIpXG5cdFx0KSB7XG5cdFx0XHRpZiAoY3VycmVudFRhcmdldC5hY3Rpb25zKSB7XG5cdFx0XHRcdGFubm90YXRpb25Db250ZW50LkFjdGlvblRhcmdldCA9XG5cdFx0XHRcdFx0Y3VycmVudFRhcmdldC5hY3Rpb25zW2Fubm90YXRpb25Db250ZW50LkFjdGlvbl0gfHwgb2JqZWN0TWFwW2Fubm90YXRpb25Db250ZW50LkFjdGlvbl07XG5cdFx0XHRcdGlmICghYW5ub3RhdGlvbkNvbnRlbnQuQWN0aW9uVGFyZ2V0KSB7XG5cdFx0XHRcdFx0Ly8gQWRkIHRvIGRpYWdub3N0aWNzIGRlYnVnZ2VyO1xuXHRcdFx0XHRcdEFOTk9UQVRJT05fRVJST1JTLnB1c2goe1xuXHRcdFx0XHRcdFx0bWVzc2FnZTpcblx0XHRcdFx0XHRcdFx0XCJVbmFibGUgdG8gcmVzb2x2ZSB0aGUgYWN0aW9uIFwiICtcblx0XHRcdFx0XHRcdFx0YW5ub3RhdGlvbkNvbnRlbnQuQWN0aW9uICtcblx0XHRcdFx0XHRcdFx0XCIgZGVmaW5lZCBmb3IgXCIgK1xuXHRcdFx0XHRcdFx0XHRhbm5vdGF0aW9uVGVybS5mdWxseVF1YWxpZmllZE5hbWVcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cdHJldHVybiBPYmplY3QuYXNzaWduKGFubm90YXRpb25UZXJtLCBhbm5vdGF0aW9uQ29udGVudCk7XG59XG5cbmV4cG9ydCB0eXBlIENvbGxlY3Rpb25UeXBlID1cblx0fCBcIlByb3BlcnR5UGF0aFwiXG5cdHwgXCJQYXRoXCJcblx0fCBcIklmXCJcblx0fCBcIkFwcGx5XCJcblx0fCBcIkFubm90YXRpb25QYXRoXCJcblx0fCBcIk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcIlxuXHR8IFwiUmVjb3JkXCJcblx0fCBcIlN0cmluZ1wiXG5cdHwgXCJFbXB0eUNvbGxlY3Rpb25cIjtcblxuZnVuY3Rpb24gZ2V0T3JJbmZlckNvbGxlY3Rpb25UeXBlKGNvbGxlY3Rpb25EZWZpbml0aW9uOiBhbnlbXSk6IENvbGxlY3Rpb25UeXBlIHtcblx0bGV0IHR5cGU6IENvbGxlY3Rpb25UeXBlID0gKGNvbGxlY3Rpb25EZWZpbml0aW9uIGFzIGFueSkudHlwZTtcblx0aWYgKHR5cGUgPT09IHVuZGVmaW5lZCAmJiBjb2xsZWN0aW9uRGVmaW5pdGlvbi5sZW5ndGggPiAwKSB7XG5cdFx0Y29uc3QgZmlyc3RDb2xJdGVtID0gY29sbGVjdGlvbkRlZmluaXRpb25bMF07XG5cdFx0aWYgKGZpcnN0Q29sSXRlbS5oYXNPd25Qcm9wZXJ0eShcIlByb3BlcnR5UGF0aFwiKSkge1xuXHRcdFx0dHlwZSA9IFwiUHJvcGVydHlQYXRoXCI7XG5cdFx0fSBlbHNlIGlmIChmaXJzdENvbEl0ZW0uaGFzT3duUHJvcGVydHkoXCJQYXRoXCIpKSB7XG5cdFx0XHR0eXBlID0gXCJQYXRoXCI7XG5cdFx0fSBlbHNlIGlmIChmaXJzdENvbEl0ZW0uaGFzT3duUHJvcGVydHkoXCJBbm5vdGF0aW9uUGF0aFwiKSkge1xuXHRcdFx0dHlwZSA9IFwiQW5ub3RhdGlvblBhdGhcIjtcblx0XHR9IGVsc2UgaWYgKGZpcnN0Q29sSXRlbS5oYXNPd25Qcm9wZXJ0eShcIk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcIikpIHtcblx0XHRcdHR5cGUgPSBcIk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcIjtcblx0XHR9IGVsc2UgaWYgKFxuXHRcdFx0dHlwZW9mIGZpcnN0Q29sSXRlbSA9PT0gXCJvYmplY3RcIiAmJlxuXHRcdFx0KGZpcnN0Q29sSXRlbS5oYXNPd25Qcm9wZXJ0eShcInR5cGVcIikgfHwgZmlyc3RDb2xJdGVtLmhhc093blByb3BlcnR5KFwicHJvcGVydHlWYWx1ZXNcIikpXG5cdFx0KSB7XG5cdFx0XHR0eXBlID0gXCJSZWNvcmRcIjtcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBmaXJzdENvbEl0ZW0gPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdHR5cGUgPSBcIlN0cmluZ1wiO1xuXHRcdH1cblx0fSBlbHNlIGlmICh0eXBlID09PSB1bmRlZmluZWQpIHtcblx0XHR0eXBlID0gXCJFbXB0eUNvbGxlY3Rpb25cIjtcblx0fVxuXHRyZXR1cm4gdHlwZTtcbn1cblxuZnVuY3Rpb24gcGFyc2VDb2xsZWN0aW9uKFxuXHRjb2xsZWN0aW9uRGVmaW5pdGlvbjogYW55W10sXG5cdHBhcmVudEZRTjogc3RyaW5nLFxuXHRwYXJzZXJPdXRwdXQ6IFBhcnNlck91dHB1dCxcblx0Y3VycmVudFRhcmdldDogYW55LFxuXHRvYmplY3RNYXA6IGFueSxcblx0dG9SZXNvbHZlOiBSZXNvbHZlYWJsZVtdLFxuXHRhbm5vdGF0aW9uU291cmNlOiBzdHJpbmcsXG5cdHVucmVzb2x2ZWRBbm5vdGF0aW9uczogQW5ub3RhdGlvbkxpc3RbXSxcblx0YW5ub3RhdGlvblR5cGU6IHN0cmluZyxcblx0YW5ub3RhdGlvbnNUZXJtOiBzdHJpbmdcbikge1xuXHRjb25zdCBjb2xsZWN0aW9uRGVmaW5pdGlvblR5cGUgPSBnZXRPckluZmVyQ29sbGVjdGlvblR5cGUoY29sbGVjdGlvbkRlZmluaXRpb24pO1xuXHRzd2l0Y2ggKGNvbGxlY3Rpb25EZWZpbml0aW9uVHlwZSkge1xuXHRcdGNhc2UgXCJQcm9wZXJ0eVBhdGhcIjpcblx0XHRcdHJldHVybiBjb2xsZWN0aW9uRGVmaW5pdGlvbi5tYXAoKHByb3BlcnR5UGF0aCwgcHJvcGVydHlJZHgpID0+IHtcblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHR0eXBlOiBcIlByb3BlcnR5UGF0aFwiLFxuXHRcdFx0XHRcdHZhbHVlOiBwcm9wZXJ0eVBhdGguUHJvcGVydHlQYXRoLFxuXHRcdFx0XHRcdGZ1bGx5UXVhbGlmaWVkTmFtZTogYCR7cGFyZW50RlFOfS8ke3Byb3BlcnR5SWR4fWAsXG5cdFx0XHRcdFx0JHRhcmdldDogcmVzb2x2ZVRhcmdldChcblx0XHRcdFx0XHRcdG9iamVjdE1hcCxcblx0XHRcdFx0XHRcdGN1cnJlbnRUYXJnZXQsXG5cdFx0XHRcdFx0XHRwcm9wZXJ0eVBhdGguUHJvcGVydHlQYXRoLFxuXHRcdFx0XHRcdFx0ZmFsc2UsXG5cdFx0XHRcdFx0XHRmYWxzZSxcblx0XHRcdFx0XHRcdGFubm90YXRpb25UeXBlLFxuXHRcdFx0XHRcdFx0YW5ub3RhdGlvbnNUZXJtXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHR9O1xuXHRcdFx0fSk7XG5cdFx0Y2FzZSBcIlBhdGhcIjpcblx0XHRcdHJldHVybiBjb2xsZWN0aW9uRGVmaW5pdGlvbi5tYXAocGF0aFZhbHVlID0+IHtcblx0XHRcdFx0aWYgKGlzQW5ub3RhdGlvblBhdGgocGF0aFZhbHVlLlBhdGgpKSB7XG5cdFx0XHRcdFx0Ly8gSWYgaXQncyBhbiBhbm50b2F0aW9uIHRoYXQgd2UgY2FuIHJlc29sdmUsIHJlc29sdmUgaXQgIVxuXHRcdFx0XHRcdGNvbnN0ICR0YXJnZXQgPSByZXNvbHZlVGFyZ2V0KFxuXHRcdFx0XHRcdFx0b2JqZWN0TWFwLFxuXHRcdFx0XHRcdFx0Y3VycmVudFRhcmdldCxcblx0XHRcdFx0XHRcdHBhdGhWYWx1ZS5QYXRoLFxuXHRcdFx0XHRcdFx0ZmFsc2UsXG5cdFx0XHRcdFx0XHRmYWxzZSxcblx0XHRcdFx0XHRcdGFubm90YXRpb25UeXBlLFxuXHRcdFx0XHRcdFx0YW5ub3RhdGlvbnNUZXJtXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRpZiAoJHRhcmdldCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuICR0YXJnZXQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnN0ICR0YXJnZXQgPSByZXNvbHZlVGFyZ2V0KFxuXHRcdFx0XHRcdG9iamVjdE1hcCxcblx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LFxuXHRcdFx0XHRcdHBhdGhWYWx1ZS5QYXRoLFxuXHRcdFx0XHRcdHRydWUsXG5cdFx0XHRcdFx0ZmFsc2UsXG5cdFx0XHRcdFx0YW5ub3RhdGlvblR5cGUsXG5cdFx0XHRcdFx0YW5ub3RhdGlvbnNUZXJtXG5cdFx0XHRcdCk7XG5cdFx0XHRcdGNvbnN0IHBhdGggPSBuZXcgUGF0aChwYXRoVmFsdWUsICR0YXJnZXQsIGFubm90YXRpb25zVGVybSwgYW5ub3RhdGlvblR5cGUsIFwiXCIpO1xuXHRcdFx0XHR0b1Jlc29sdmUucHVzaChwYXRoKTtcblx0XHRcdFx0cmV0dXJuIHBhdGg7XG5cdFx0XHR9KTtcblx0XHRjYXNlIFwiQW5ub3RhdGlvblBhdGhcIjpcblx0XHRcdHJldHVybiBjb2xsZWN0aW9uRGVmaW5pdGlvbi5tYXAoKGFubm90YXRpb25QYXRoLCBhbm5vdGF0aW9uSWR4KSA9PiB7XG5cdFx0XHRcdGNvbnN0IGFubm90YXRpb25UYXJnZXQgPSByZXNvbHZlVGFyZ2V0KFxuXHRcdFx0XHRcdG9iamVjdE1hcCxcblx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LFxuXHRcdFx0XHRcdGFubm90YXRpb25QYXRoLkFubm90YXRpb25QYXRoLFxuXHRcdFx0XHRcdHRydWUsXG5cdFx0XHRcdFx0ZmFsc2UsXG5cdFx0XHRcdFx0YW5ub3RhdGlvblR5cGUsXG5cdFx0XHRcdFx0YW5ub3RhdGlvbnNUZXJtXG5cdFx0XHRcdCk7XG5cdFx0XHRcdGNvbnN0IGFubm90YXRpb25Db2xsZWN0aW9uRWxlbWVudCA9IHtcblx0XHRcdFx0XHR0eXBlOiBcIkFubm90YXRpb25QYXRoXCIsXG5cdFx0XHRcdFx0dmFsdWU6IGFubm90YXRpb25QYXRoLkFubm90YXRpb25QYXRoLFxuXHRcdFx0XHRcdGZ1bGx5UXVhbGlmaWVkTmFtZTogYCR7cGFyZW50RlFOfS8ke2Fubm90YXRpb25JZHh9YCxcblx0XHRcdFx0XHQkdGFyZ2V0OiBhbm5vdGF0aW9uVGFyZ2V0LFxuXHRcdFx0XHRcdGFubm90YXRpb25UeXBlOiBhbm5vdGF0aW9uVHlwZSxcblx0XHRcdFx0XHRhbm5vdGF0aW9uc1Rlcm06IGFubm90YXRpb25zVGVybSxcblx0XHRcdFx0XHR0ZXJtOiBcIlwiLFxuXHRcdFx0XHRcdHBhdGg6IFwiXCJcblx0XHRcdFx0fTtcblx0XHRcdFx0dG9SZXNvbHZlLnB1c2goYW5ub3RhdGlvbkNvbGxlY3Rpb25FbGVtZW50KTtcblx0XHRcdFx0cmV0dXJuIGFubm90YXRpb25Db2xsZWN0aW9uRWxlbWVudDtcblx0XHRcdH0pO1xuXHRcdGNhc2UgXCJOYXZpZ2F0aW9uUHJvcGVydHlQYXRoXCI6XG5cdFx0XHRyZXR1cm4gY29sbGVjdGlvbkRlZmluaXRpb24ubWFwKChuYXZQcm9wZXJ0eVBhdGgsIG5hdlByb3BJZHgpID0+IHtcblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHR0eXBlOiBcIk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcIixcblx0XHRcdFx0XHR2YWx1ZTogbmF2UHJvcGVydHlQYXRoLk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgsXG5cdFx0XHRcdFx0ZnVsbHlRdWFsaWZpZWROYW1lOiBgJHtwYXJlbnRGUU59LyR7bmF2UHJvcElkeH1gLFxuXHRcdFx0XHRcdCR0YXJnZXQ6IHJlc29sdmVUYXJnZXQoXG5cdFx0XHRcdFx0XHRvYmplY3RNYXAsXG5cdFx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LFxuXHRcdFx0XHRcdFx0bmF2UHJvcGVydHlQYXRoLk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgsXG5cdFx0XHRcdFx0XHRmYWxzZSxcblx0XHRcdFx0XHRcdGZhbHNlLFxuXHRcdFx0XHRcdFx0YW5ub3RhdGlvblR5cGUsXG5cdFx0XHRcdFx0XHRhbm5vdGF0aW9uc1Rlcm1cblx0XHRcdFx0XHQpXG5cdFx0XHRcdH07XG5cdFx0XHR9KTtcblx0XHRjYXNlIFwiUmVjb3JkXCI6XG5cdFx0XHRyZXR1cm4gY29sbGVjdGlvbkRlZmluaXRpb24ubWFwKChyZWNvcmREZWZpbml0aW9uLCByZWNvcmRJZHgpID0+IHtcblx0XHRcdFx0cmV0dXJuIHBhcnNlUmVjb3JkKFxuXHRcdFx0XHRcdHJlY29yZERlZmluaXRpb24sXG5cdFx0XHRcdFx0YCR7cGFyZW50RlFOfS8ke3JlY29yZElkeH1gLFxuXHRcdFx0XHRcdHBhcnNlck91dHB1dCxcblx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LFxuXHRcdFx0XHRcdG9iamVjdE1hcCxcblx0XHRcdFx0XHR0b1Jlc29sdmUsXG5cdFx0XHRcdFx0YW5ub3RhdGlvblNvdXJjZSxcblx0XHRcdFx0XHR1bnJlc29sdmVkQW5ub3RhdGlvbnMsXG5cdFx0XHRcdFx0YW5ub3RhdGlvblR5cGUsXG5cdFx0XHRcdFx0YW5ub3RhdGlvbnNUZXJtXG5cdFx0XHRcdCk7XG5cdFx0XHR9KTtcblx0XHRjYXNlIFwiQXBwbHlcIjpcblx0XHRcdHJldHVybiBjb2xsZWN0aW9uRGVmaW5pdGlvbi5tYXAoaWZWYWx1ZSA9PiB7XG5cdFx0XHRcdHJldHVybiBpZlZhbHVlO1xuXHRcdFx0fSk7XG5cdFx0Y2FzZSBcIklmXCI6XG5cdFx0XHRyZXR1cm4gY29sbGVjdGlvbkRlZmluaXRpb24ubWFwKGlmVmFsdWUgPT4ge1xuXHRcdFx0XHRyZXR1cm4gaWZWYWx1ZTtcblx0XHRcdH0pO1xuXHRcdGNhc2UgXCJTdHJpbmdcIjpcblx0XHRcdHJldHVybiBjb2xsZWN0aW9uRGVmaW5pdGlvbi5tYXAoc3RyaW5nVmFsdWUgPT4ge1xuXHRcdFx0XHRpZiAodHlwZW9mIHN0cmluZ1ZhbHVlID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHN0cmluZ1ZhbHVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiBzdHJpbmdWYWx1ZS5TdHJpbmc7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHRpZiAoY29sbGVjdGlvbkRlZmluaXRpb24ubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdHJldHVybiBbXTtcblx0XHRcdH1cblx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVuc3VwcG9ydGVkIGNhc2VcIik7XG5cdH1cbn1cblxudHlwZSBSZXNvbHZlYWJsZSA9IHtcblx0JHRhcmdldDogc3RyaW5nO1xuXHR0YXJnZXRTdHJpbmc/OiBzdHJpbmc7XG5cdGFubm90YXRpb25zVGVybTogc3RyaW5nO1xuXHRhbm5vdGF0aW9uVHlwZTogc3RyaW5nO1xuXHR0ZXJtOiBzdHJpbmc7XG5cdHBhdGg6IHN0cmluZztcbn07XG5cbmZ1bmN0aW9uIGNvbnZlcnRBbm5vdGF0aW9uKFxuXHRhbm5vdGF0aW9uOiBBbm5vdGF0aW9uLFxuXHRwYXJzZXJPdXRwdXQ6IFBhcnNlck91dHB1dCxcblx0Y3VycmVudFRhcmdldDogYW55LFxuXHRvYmplY3RNYXA6IGFueSxcblx0dG9SZXNvbHZlOiBSZXNvbHZlYWJsZVtdLFxuXHRhbm5vdGF0aW9uU291cmNlOiBzdHJpbmcsXG5cdHVucmVzb2x2ZWRBbm5vdGF0aW9uczogQW5ub3RhdGlvbkxpc3RbXVxuKTogYW55IHtcblx0aWYgKGFubm90YXRpb24ucmVjb3JkKSB7XG5cdFx0Y29uc3QgYW5ub3RhdGlvblR5cGUgPSBhbm5vdGF0aW9uLnJlY29yZC50eXBlXG5cdFx0XHQ/IHVuYWxpYXMocGFyc2VyT3V0cHV0LnJlZmVyZW5jZXMsIGFubm90YXRpb24ucmVjb3JkLnR5cGUpXG5cdFx0XHQ6IGluZmVyVHlwZUZyb21UZXJtKGFubm90YXRpb24udGVybSwgcGFyc2VyT3V0cHV0LCBjdXJyZW50VGFyZ2V0LmZ1bGx5UXVhbGlmaWVkTmFtZSk7XG5cdFx0Y29uc3QgYW5ub3RhdGlvblRlcm06IGFueSA9IHtcblx0XHRcdCRUeXBlOiBhbm5vdGF0aW9uVHlwZSxcblx0XHRcdGZ1bGx5UXVhbGlmaWVkTmFtZTogYW5ub3RhdGlvbi5mdWxseVF1YWxpZmllZE5hbWUsXG5cdFx0XHRxdWFsaWZpZXI6IGFubm90YXRpb24ucXVhbGlmaWVyXG5cdFx0fTtcblx0XHRjb25zdCBhbm5vdGF0aW9uQ29udGVudDogYW55ID0ge307XG5cdFx0YW5ub3RhdGlvbi5yZWNvcmQucHJvcGVydHlWYWx1ZXMuZm9yRWFjaCgocHJvcGVydHlWYWx1ZTogUHJvcGVydHlWYWx1ZSkgPT4ge1xuXHRcdFx0YW5ub3RhdGlvbkNvbnRlbnRbcHJvcGVydHlWYWx1ZS5uYW1lXSA9IHBhcnNlVmFsdWUoXG5cdFx0XHRcdHByb3BlcnR5VmFsdWUudmFsdWUsXG5cdFx0XHRcdGAke2Fubm90YXRpb24uZnVsbHlRdWFsaWZpZWROYW1lfS8ke3Byb3BlcnR5VmFsdWUubmFtZX1gLFxuXHRcdFx0XHRwYXJzZXJPdXRwdXQsXG5cdFx0XHRcdGN1cnJlbnRUYXJnZXQsXG5cdFx0XHRcdG9iamVjdE1hcCxcblx0XHRcdFx0dG9SZXNvbHZlLFxuXHRcdFx0XHRhbm5vdGF0aW9uU291cmNlLFxuXHRcdFx0XHR1bnJlc29sdmVkQW5ub3RhdGlvbnMsXG5cdFx0XHRcdGFubm90YXRpb25UeXBlLFxuXHRcdFx0XHRhbm5vdGF0aW9uLnRlcm1cblx0XHRcdCk7XG5cdFx0XHRpZiAoXG5cdFx0XHRcdGFubm90YXRpb25Db250ZW50Lmhhc093blByb3BlcnR5KFwiQWN0aW9uXCIpICYmXG5cdFx0XHRcdCghYW5ub3RhdGlvbi5yZWNvcmQgfHxcblx0XHRcdFx0XHRhbm5vdGF0aW9uVGVybS4kVHlwZSA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRGb3JBY3Rpb25cIiB8fFxuXHRcdFx0XHRcdGFubm90YXRpb25UZXJtLiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZFdpdGhBY3Rpb25cIilcblx0XHRcdCkge1xuXHRcdFx0XHRpZiAoY3VycmVudFRhcmdldC5hY3Rpb25zKSB7XG5cdFx0XHRcdFx0YW5ub3RhdGlvbkNvbnRlbnQuQWN0aW9uVGFyZ2V0ID1cblx0XHRcdFx0XHRcdGN1cnJlbnRUYXJnZXQuYWN0aW9uc1thbm5vdGF0aW9uQ29udGVudC5BY3Rpb25dIHx8IG9iamVjdE1hcFthbm5vdGF0aW9uQ29udGVudC5BY3Rpb25dO1xuXHRcdFx0XHRcdGlmICghYW5ub3RhdGlvbkNvbnRlbnQuQWN0aW9uVGFyZ2V0KSB7XG5cdFx0XHRcdFx0XHRBTk5PVEFUSU9OX0VSUk9SUy5wdXNoKHtcblx0XHRcdFx0XHRcdFx0bWVzc2FnZTpcblx0XHRcdFx0XHRcdFx0XHRcIlVuYWJsZSB0byByZXNvbHZlIHRoZSBhY3Rpb24gXCIgK1xuXHRcdFx0XHRcdFx0XHRcdGFubm90YXRpb25Db250ZW50LkFjdGlvbiArXG5cdFx0XHRcdFx0XHRcdFx0XCIgZGVmaW5lZCBmb3IgXCIgK1xuXHRcdFx0XHRcdFx0XHRcdGFubm90YXRpb24uZnVsbHlRdWFsaWZpZWROYW1lXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdC8vIEFkZCB0byBkaWFnbm9zdGljc1xuXHRcdFx0XHRcdFx0Ly8gZGVidWdnZXI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmV0dXJuIE9iamVjdC5hc3NpZ24oYW5ub3RhdGlvblRlcm0sIGFubm90YXRpb25Db250ZW50KTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uLmNvbGxlY3Rpb24gPT09IHVuZGVmaW5lZCkge1xuXHRcdGlmIChhbm5vdGF0aW9uLnZhbHVlKSB7XG5cdFx0XHRyZXR1cm4gcGFyc2VWYWx1ZShcblx0XHRcdFx0YW5ub3RhdGlvbi52YWx1ZSxcblx0XHRcdFx0YW5ub3RhdGlvbi5mdWxseVF1YWxpZmllZE5hbWUsXG5cdFx0XHRcdHBhcnNlck91dHB1dCxcblx0XHRcdFx0Y3VycmVudFRhcmdldCxcblx0XHRcdFx0b2JqZWN0TWFwLFxuXHRcdFx0XHR0b1Jlc29sdmUsXG5cdFx0XHRcdGFubm90YXRpb25Tb3VyY2UsXG5cdFx0XHRcdHVucmVzb2x2ZWRBbm5vdGF0aW9ucyxcblx0XHRcdFx0XCJcIixcblx0XHRcdFx0YW5ub3RhdGlvbi50ZXJtXG5cdFx0XHQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvbi5jb2xsZWN0aW9uKSB7XG5cdFx0Y29uc3QgY29sbGVjdGlvbjogYW55ID0gcGFyc2VDb2xsZWN0aW9uKFxuXHRcdFx0YW5ub3RhdGlvbi5jb2xsZWN0aW9uLFxuXHRcdFx0YW5ub3RhdGlvbi5mdWxseVF1YWxpZmllZE5hbWUsXG5cdFx0XHRwYXJzZXJPdXRwdXQsXG5cdFx0XHRjdXJyZW50VGFyZ2V0LFxuXHRcdFx0b2JqZWN0TWFwLFxuXHRcdFx0dG9SZXNvbHZlLFxuXHRcdFx0YW5ub3RhdGlvblNvdXJjZSxcblx0XHRcdHVucmVzb2x2ZWRBbm5vdGF0aW9ucyxcblx0XHRcdFwiXCIsXG5cdFx0XHRhbm5vdGF0aW9uLnRlcm1cblx0XHQpO1xuXHRcdGNvbGxlY3Rpb24uZnVsbHlRdWFsaWZpZWROYW1lID0gYW5ub3RhdGlvbi5mdWxseVF1YWxpZmllZE5hbWU7XG5cdFx0cmV0dXJuIGNvbGxlY3Rpb247XG5cdH0gZWxzZSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5zdXBwb3J0ZWQgY2FzZVwiKTtcblx0fVxufVxuXG5mdW5jdGlvbiBjcmVhdGVSZXNvbHZlUGF0aEZuKGVudGl0eVR5cGU6IEVudGl0eVR5cGUsIG9iamVjdE1hcDogUmVjb3JkPHN0cmluZywgYW55Pikge1xuXHRyZXR1cm4gZnVuY3Rpb24ocmVsYXRpdmVQYXRoOiBzdHJpbmcsIGluY2x1ZGVWaXNpdGVkT2JqZWN0czogYm9vbGVhbik6IGFueSB7XG5cdFx0Y29uc3QgYW5ub3RhdGlvblRlcm06IHN0cmluZyA9IFwiXCI7XG5cdFx0Y29uc3QgYW5ub3RhdGlvblR5cGU6IHN0cmluZyA9IFwiXCI7XG5cdFx0cmV0dXJuIHJlc29sdmVUYXJnZXQoXG5cdFx0XHRvYmplY3RNYXAsXG5cdFx0XHRlbnRpdHlUeXBlLFxuXHRcdFx0cmVsYXRpdmVQYXRoLFxuXHRcdFx0ZmFsc2UsXG5cdFx0XHRpbmNsdWRlVmlzaXRlZE9iamVjdHMsXG5cdFx0XHRhbm5vdGF0aW9uVHlwZSxcblx0XHRcdGFubm90YXRpb25UZXJtXG5cdFx0KTtcblx0fTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZU5hdmlnYXRpb25Qcm9wZXJ0aWVzKFxuXHRlbnRpdHlUeXBlczogUGFyc2VyRW50aXR5VHlwZVtdLFxuXHRhc3NvY2lhdGlvbnM6IEFzc29jaWF0aW9uW10sXG5cdG9iamVjdE1hcDogUmVjb3JkPHN0cmluZywgYW55PlxuKTogdm9pZCB7XG5cdGVudGl0eVR5cGVzLmZvckVhY2goZW50aXR5VHlwZSA9PiB7XG5cdFx0ZW50aXR5VHlwZS5uYXZpZ2F0aW9uUHJvcGVydGllcyA9IGVudGl0eVR5cGUubmF2aWdhdGlvblByb3BlcnRpZXMubWFwKG5hdlByb3AgPT4ge1xuXHRcdFx0Y29uc3Qgb3V0TmF2UHJvcDogUGFydGlhbDxOYXZpZ2F0aW9uUHJvcGVydHk+ID0ge1xuXHRcdFx0XHRfdHlwZTogXCJOYXZpZ2F0aW9uUHJvcGVydHlcIixcblx0XHRcdFx0bmFtZTogbmF2UHJvcC5uYW1lLFxuXHRcdFx0XHRmdWxseVF1YWxpZmllZE5hbWU6IG5hdlByb3AuZnVsbHlRdWFsaWZpZWROYW1lLFxuXHRcdFx0XHRwYXJ0bmVyOiAobmF2UHJvcCBhcyBhbnkpLmhhc093blByb3BlcnR5KFwicGFydG5lclwiKSA/IChuYXZQcm9wIGFzIGFueSkucGFydG5lciA6IHVuZGVmaW5lZCxcblx0XHRcdFx0Ly8gdGFyZ2V0VHlwZU5hbWU6IEZ1bGx5UXVhbGlmaWVkTmFtZTtcblx0XHRcdFx0Ly8gdGFyZ2V0VHlwZTogRW50aXR5VHlwZTtcblx0XHRcdFx0aXNDb2xsZWN0aW9uOiAobmF2UHJvcCBhcyBhbnkpLmhhc093blByb3BlcnR5KFwiaXNDb2xsZWN0aW9uXCIpID8gKG5hdlByb3AgYXMgYW55KS5pc0NvbGxlY3Rpb24gOiBmYWxzZSxcblx0XHRcdFx0Y29udGFpbnNUYXJnZXQ6IChuYXZQcm9wIGFzIGFueSkuaGFzT3duUHJvcGVydHkoXCJjb250YWluc1RhcmdldFwiKVxuXHRcdFx0XHRcdD8gKG5hdlByb3AgYXMgYW55KS5jb250YWluc1RhcmdldFxuXHRcdFx0XHRcdDogZmFsc2UsXG5cdFx0XHRcdHJlZmVyZW50aWFsQ29uc3RyYWludDogKG5hdlByb3AgYXMgYW55KS5yZWZlcmVudGlhbENvbnN0cmFpbnRcblx0XHRcdFx0XHQ/IChuYXZQcm9wIGFzIGFueSkucmVmZXJlbnRpYWxDb25zdHJhaW50XG5cdFx0XHRcdFx0OiBbXVxuXHRcdFx0fTtcblx0XHRcdGlmICgobmF2UHJvcCBhcyBHZW5lcmljTmF2aWdhdGlvblByb3BlcnR5KS50YXJnZXRUeXBlTmFtZSkge1xuXHRcdFx0XHRvdXROYXZQcm9wLnRhcmdldFR5cGUgPSBvYmplY3RNYXBbKG5hdlByb3AgYXMgVjROYXZpZ2F0aW9uUHJvcGVydHkpLnRhcmdldFR5cGVOYW1lXTtcblx0XHRcdH0gZWxzZSBpZiAoKG5hdlByb3AgYXMgVjJOYXZpZ2F0aW9uUHJvcGVydHkpLnJlbGF0aW9uc2hpcCkge1xuXHRcdFx0XHRjb25zdCB0YXJnZXRBc3NvY2lhdGlvbiA9IGFzc29jaWF0aW9ucy5maW5kKFxuXHRcdFx0XHRcdGFzc29jaWF0aW9uID0+IGFzc29jaWF0aW9uLmZ1bGx5UXVhbGlmaWVkTmFtZSA9PT0gKG5hdlByb3AgYXMgVjJOYXZpZ2F0aW9uUHJvcGVydHkpLnJlbGF0aW9uc2hpcFxuXHRcdFx0XHQpO1xuXHRcdFx0XHRpZiAodGFyZ2V0QXNzb2NpYXRpb24pIHtcblx0XHRcdFx0XHRjb25zdCBhc3NvY2lhdGlvbkVuZCA9IHRhcmdldEFzc29jaWF0aW9uLmFzc29jaWF0aW9uRW5kLmZpbmQoXG5cdFx0XHRcdFx0XHRlbmQgPT4gZW5kLnJvbGUgPT09IChuYXZQcm9wIGFzIFYyTmF2aWdhdGlvblByb3BlcnR5KS50b1JvbGVcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdGlmIChhc3NvY2lhdGlvbkVuZCkge1xuXHRcdFx0XHRcdFx0b3V0TmF2UHJvcC50YXJnZXRUeXBlID0gb2JqZWN0TWFwW2Fzc29jaWF0aW9uRW5kLnR5cGVdO1xuXHRcdFx0XHRcdFx0b3V0TmF2UHJvcC5pc0NvbGxlY3Rpb24gPSBhc3NvY2lhdGlvbkVuZC5tdWx0aXBsaWNpdHkgPT09IFwiKlwiO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKG91dE5hdlByb3AudGFyZ2V0VHlwZSkge1xuXHRcdFx0XHRvdXROYXZQcm9wLnRhcmdldFR5cGVOYW1lID0gb3V0TmF2UHJvcC50YXJnZXRUeXBlLmZ1bGx5UXVhbGlmaWVkTmFtZTtcblx0XHRcdH1cblx0XHRcdGNvbnN0IG91dE5hdlByb3BSZXEgPSBvdXROYXZQcm9wIGFzIE5hdmlnYXRpb25Qcm9wZXJ0eTtcblx0XHRcdG9iamVjdE1hcFtvdXROYXZQcm9wUmVxLmZ1bGx5UXVhbGlmaWVkTmFtZV0gPSBvdXROYXZQcm9wUmVxO1xuXHRcdFx0cmV0dXJuIG91dE5hdlByb3BSZXE7XG5cdFx0fSk7XG5cdFx0KGVudGl0eVR5cGUgYXMgRW50aXR5VHlwZSkucmVzb2x2ZVBhdGggPSBjcmVhdGVSZXNvbHZlUGF0aEZuKGVudGl0eVR5cGUgYXMgRW50aXR5VHlwZSwgb2JqZWN0TWFwKTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGxpbmtBY3Rpb25zVG9FbnRpdHlUeXBlKG5hbWVzcGFjZTogc3RyaW5nLCBhY3Rpb25zOiBBY3Rpb25bXSwgb2JqZWN0TWFwOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogdm9pZCB7XG5cdGFjdGlvbnMuZm9yRWFjaChhY3Rpb24gPT4ge1xuXHRcdGlmIChhY3Rpb24uaXNCb3VuZCkge1xuXHRcdFx0Y29uc3Qgc291cmNlRW50aXR5VHlwZSA9IG9iamVjdE1hcFthY3Rpb24uc291cmNlVHlwZV07XG5cdFx0XHRhY3Rpb24uc291cmNlRW50aXR5VHlwZSA9IHNvdXJjZUVudGl0eVR5cGU7XG5cdFx0XHRpZiAoc291cmNlRW50aXR5VHlwZSkge1xuXHRcdFx0XHRpZiAoIXNvdXJjZUVudGl0eVR5cGUuYWN0aW9ucykge1xuXHRcdFx0XHRcdHNvdXJjZUVudGl0eVR5cGUuYWN0aW9ucyA9IHt9O1xuXHRcdFx0XHR9XG5cdFx0XHRcdHNvdXJjZUVudGl0eVR5cGUuYWN0aW9uc1thY3Rpb24ubmFtZV0gPSBhY3Rpb247XG5cdFx0XHRcdHNvdXJjZUVudGl0eVR5cGUuYWN0aW9uc1tgJHtuYW1lc3BhY2V9LiR7YWN0aW9uLm5hbWV9YF0gPSBhY3Rpb247XG5cdFx0XHR9XG5cdFx0XHRhY3Rpb24ucmV0dXJuRW50aXR5VHlwZSA9IG9iamVjdE1hcFthY3Rpb24ucmV0dXJuVHlwZV07XG5cdFx0fVxuXHR9KTtcbn1cblxuZnVuY3Rpb24gbGlua0VudGl0eVR5cGVUb0VudGl0eVNldChcblx0ZW50aXR5U2V0czogRW50aXR5U2V0W10sXG5cdG9iamVjdE1hcDogUmVjb3JkPHN0cmluZywgYW55Pixcblx0cmVmZXJlbmNlczogUmVmZXJlbmNlc1dpdGhNYXBcbik6IHZvaWQge1xuXHRlbnRpdHlTZXRzLmZvckVhY2goZW50aXR5U2V0ID0+IHtcblx0XHRlbnRpdHlTZXQuZW50aXR5VHlwZSA9IG9iamVjdE1hcFtlbnRpdHlTZXQuZW50aXR5VHlwZU5hbWVdO1xuXHRcdGlmICghZW50aXR5U2V0LmVudGl0eVR5cGUpIHtcblx0XHRcdGVudGl0eVNldC5lbnRpdHlUeXBlID0gb2JqZWN0TWFwW3VuYWxpYXMocmVmZXJlbmNlcywgZW50aXR5U2V0LmVudGl0eVR5cGVOYW1lKSBhcyBzdHJpbmddO1xuXHRcdH1cblx0XHRpZiAoIWVudGl0eVNldC5hbm5vdGF0aW9ucykge1xuXHRcdFx0ZW50aXR5U2V0LmFubm90YXRpb25zID0ge307XG5cdFx0fVxuXHRcdGlmICghZW50aXR5U2V0LmVudGl0eVR5cGUuYW5ub3RhdGlvbnMpIHtcblx0XHRcdGVudGl0eVNldC5lbnRpdHlUeXBlLmFubm90YXRpb25zID0ge307XG5cdFx0fVxuXHRcdGVudGl0eVNldC5lbnRpdHlUeXBlLmtleXMuZm9yRWFjaCgoa2V5UHJvcDogUHJvcGVydHkpID0+IHtcblx0XHRcdGtleVByb3AuaXNLZXkgPSB0cnVlO1xuXHRcdH0pO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gbGlua1Byb3BlcnRpZXNUb0NvbXBsZXhUeXBlcyhlbnRpdHlUeXBlczogRW50aXR5VHlwZVtdLCBvYmplY3RNYXA6IFJlY29yZDxzdHJpbmcsIGFueT4pIHtcblx0ZW50aXR5VHlwZXMuZm9yRWFjaChlbnRpdHlUeXBlID0+IHtcblx0XHRlbnRpdHlUeXBlLmVudGl0eVByb3BlcnRpZXMuZm9yRWFjaChlbnRpdHlQcm9wZXJ0eSA9PiB7XG5cdFx0XHRpZiAoZW50aXR5UHJvcGVydHkudHlwZS5pbmRleE9mKFwiRWRtXCIpID09PSAtMSkge1xuXHRcdFx0XHRjb25zdCBjb21wbGV4VHlwZSA9IG9iamVjdE1hcFtlbnRpdHlQcm9wZXJ0eS50eXBlXSBhcyBDb21wbGV4VHlwZTtcblx0XHRcdFx0aWYgKGNvbXBsZXhUeXBlKSB7XG5cdFx0XHRcdFx0KGVudGl0eVByb3BlcnR5IGFzIFByb3BlcnR5KS50YXJnZXRUeXBlID0gY29tcGxleFR5cGU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIHByZXBhcmVDb21wbGV4VHlwZXMoXG5cdGNvbXBsZXhUeXBlczogUGFyc2VyQ29tcGxleFR5cGVbXSxcblx0YXNzb2NpYXRpb25zOiBBc3NvY2lhdGlvbltdLFxuXHRvYmplY3RNYXA6IFJlY29yZDxzdHJpbmcsIGFueT5cbikge1xuXHRjb21wbGV4VHlwZXMuZm9yRWFjaChjb21wbGV4VHlwZSA9PiB7XG5cdFx0KGNvbXBsZXhUeXBlIGFzIENvbXBsZXhUeXBlKS5hbm5vdGF0aW9ucyA9IHt9O1xuXHRcdGNvbXBsZXhUeXBlLnByb3BlcnRpZXMuZm9yRWFjaChwcm9wZXJ0eSA9PiB7XG5cdFx0XHRpZiAoIShwcm9wZXJ0eSBhcyBQcm9wZXJ0eSkuYW5ub3RhdGlvbnMpIHtcblx0XHRcdFx0KHByb3BlcnR5IGFzIFByb3BlcnR5KS5hbm5vdGF0aW9ucyA9IHt9O1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdGNvbXBsZXhUeXBlLm5hdmlnYXRpb25Qcm9wZXJ0aWVzID0gY29tcGxleFR5cGUubmF2aWdhdGlvblByb3BlcnRpZXMubWFwKG5hdlByb3AgPT4ge1xuXHRcdFx0aWYgKCEobmF2UHJvcCBhcyBOYXZpZ2F0aW9uUHJvcGVydHkpLmFubm90YXRpb25zKSB7XG5cdFx0XHRcdChuYXZQcm9wIGFzIE5hdmlnYXRpb25Qcm9wZXJ0eSkuYW5ub3RhdGlvbnMgPSB7fTtcblx0XHRcdH1cblx0XHRcdGNvbnN0IG91dE5hdlByb3A6IFBhcnRpYWw8TmF2aWdhdGlvblByb3BlcnR5PiA9IHtcblx0XHRcdFx0X3R5cGU6IFwiTmF2aWdhdGlvblByb3BlcnR5XCIsXG5cdFx0XHRcdG5hbWU6IG5hdlByb3AubmFtZSxcblx0XHRcdFx0ZnVsbHlRdWFsaWZpZWROYW1lOiBuYXZQcm9wLmZ1bGx5UXVhbGlmaWVkTmFtZSxcblx0XHRcdFx0cGFydG5lcjogKG5hdlByb3AgYXMgYW55KS5oYXNPd25Qcm9wZXJ0eShcInBhcnRuZXJcIikgPyAobmF2UHJvcCBhcyBhbnkpLnBhcnRuZXIgOiB1bmRlZmluZWQsXG5cdFx0XHRcdC8vIHRhcmdldFR5cGVOYW1lOiBGdWxseVF1YWxpZmllZE5hbWU7XG5cdFx0XHRcdC8vIHRhcmdldFR5cGU6IEVudGl0eVR5cGU7XG5cdFx0XHRcdGlzQ29sbGVjdGlvbjogKG5hdlByb3AgYXMgYW55KS5oYXNPd25Qcm9wZXJ0eShcImlzQ29sbGVjdGlvblwiKSA/IChuYXZQcm9wIGFzIGFueSkuaXNDb2xsZWN0aW9uIDogZmFsc2UsXG5cdFx0XHRcdGNvbnRhaW5zVGFyZ2V0OiAobmF2UHJvcCBhcyBhbnkpLmhhc093blByb3BlcnR5KFwiY29udGFpbnNUYXJnZXRcIilcblx0XHRcdFx0XHQ/IChuYXZQcm9wIGFzIGFueSkuY29udGFpbnNUYXJnZXRcblx0XHRcdFx0XHQ6IGZhbHNlLFxuXHRcdFx0XHRyZWZlcmVudGlhbENvbnN0cmFpbnQ6IChuYXZQcm9wIGFzIGFueSkucmVmZXJlbnRpYWxDb25zdHJhaW50XG5cdFx0XHRcdFx0PyAobmF2UHJvcCBhcyBhbnkpLnJlZmVyZW50aWFsQ29uc3RyYWludFxuXHRcdFx0XHRcdDogW11cblx0XHRcdH07XG5cdFx0XHRpZiAoKG5hdlByb3AgYXMgR2VuZXJpY05hdmlnYXRpb25Qcm9wZXJ0eSkudGFyZ2V0VHlwZU5hbWUpIHtcblx0XHRcdFx0b3V0TmF2UHJvcC50YXJnZXRUeXBlID0gb2JqZWN0TWFwWyhuYXZQcm9wIGFzIFY0TmF2aWdhdGlvblByb3BlcnR5KS50YXJnZXRUeXBlTmFtZV07XG5cdFx0XHR9IGVsc2UgaWYgKChuYXZQcm9wIGFzIFYyTmF2aWdhdGlvblByb3BlcnR5KS5yZWxhdGlvbnNoaXApIHtcblx0XHRcdFx0Y29uc3QgdGFyZ2V0QXNzb2NpYXRpb24gPSBhc3NvY2lhdGlvbnMuZmluZChcblx0XHRcdFx0XHRhc3NvY2lhdGlvbiA9PiBhc3NvY2lhdGlvbi5mdWxseVF1YWxpZmllZE5hbWUgPT09IChuYXZQcm9wIGFzIFYyTmF2aWdhdGlvblByb3BlcnR5KS5yZWxhdGlvbnNoaXBcblx0XHRcdFx0KTtcblx0XHRcdFx0aWYgKHRhcmdldEFzc29jaWF0aW9uKSB7XG5cdFx0XHRcdFx0Y29uc3QgYXNzb2NpYXRpb25FbmQgPSB0YXJnZXRBc3NvY2lhdGlvbi5hc3NvY2lhdGlvbkVuZC5maW5kKFxuXHRcdFx0XHRcdFx0ZW5kID0+IGVuZC5yb2xlID09PSAobmF2UHJvcCBhcyBWMk5hdmlnYXRpb25Qcm9wZXJ0eSkudG9Sb2xlXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRpZiAoYXNzb2NpYXRpb25FbmQpIHtcblx0XHRcdFx0XHRcdG91dE5hdlByb3AudGFyZ2V0VHlwZSA9IG9iamVjdE1hcFthc3NvY2lhdGlvbkVuZC50eXBlXTtcblx0XHRcdFx0XHRcdG91dE5hdlByb3AuaXNDb2xsZWN0aW9uID0gYXNzb2NpYXRpb25FbmQubXVsdGlwbGljaXR5ID09PSBcIipcIjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChvdXROYXZQcm9wLnRhcmdldFR5cGUpIHtcblx0XHRcdFx0b3V0TmF2UHJvcC50YXJnZXRUeXBlTmFtZSA9IG91dE5hdlByb3AudGFyZ2V0VHlwZS5mdWxseVF1YWxpZmllZE5hbWU7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBvdXROYXZQcm9wUmVxID0gb3V0TmF2UHJvcCBhcyBOYXZpZ2F0aW9uUHJvcGVydHk7XG5cdFx0XHRvYmplY3RNYXBbb3V0TmF2UHJvcFJlcS5mdWxseVF1YWxpZmllZE5hbWVdID0gb3V0TmF2UHJvcFJlcTtcblx0XHRcdHJldHVybiBvdXROYXZQcm9wUmVxO1xuXHRcdH0pO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gc3BsaXRUZXJtKHJlZmVyZW5jZXM6IFJlZmVyZW5jZXNXaXRoTWFwLCB0ZXJtVmFsdWU6IHN0cmluZykge1xuXHRjb25zdCBhbGlhc2VkVGVybSA9IGFsaWFzKHJlZmVyZW5jZXMsIHRlcm1WYWx1ZSk7XG5cdGNvbnN0IGxhc3REb3QgPSBhbGlhc2VkVGVybS5sYXN0SW5kZXhPZihcIi5cIik7XG5cdGxldCB0ZXJtQWxpYXMgPSBhbGlhc2VkVGVybS5zdWJzdHIoMCwgbGFzdERvdCk7XG5cdGxldCB0ZXJtID0gYWxpYXNlZFRlcm0uc3Vic3RyKGxhc3REb3QgKyAxKTtcblx0cmV0dXJuIFt0ZXJtQWxpYXMsIHRlcm1dO1xufVxuXG4vKipcbiAqIFJlc29sdmUgYSBzcGVjaWZpYyBwYXRoXG4gKiBAcGFyYW0gc1BhdGhcbiAqL1xuZnVuY3Rpb24gY3JlYXRlR2xvYmFsUmVzb2x2ZShjb252ZXJ0ZWRPdXRwdXQ6IENvbnZlcnRlck91dHB1dCwgb2JqZWN0TWFwOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSB7XG5cdHJldHVybiBmdW5jdGlvbiByZXNvbHZlUGF0aDxUIGV4dGVuZHMgU2VydmljZU9iamVjdEFuZEFubm90YXRpb24+KHNQYXRoOiBzdHJpbmcpOiBSZXNvbHV0aW9uVGFyZ2V0PFQ+IHtcblx0XHRjb25zdCBhUGF0aFNwbGl0ID0gc1BhdGguc3BsaXQoXCIvXCIpO1xuXHRcdGlmIChhUGF0aFNwbGl0LnNoaWZ0KCkgIT09IFwiXCIpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBkZWFsIHdpdGggcmVsYXRpdmUgcGF0aFwiKTtcblx0XHR9XG5cdFx0Y29uc3QgZW50aXR5U2V0TmFtZSA9IGFQYXRoU3BsaXQuc2hpZnQoKTtcblx0XHRjb25zdCBlbnRpdHlTZXQgPSBjb252ZXJ0ZWRPdXRwdXQuZW50aXR5U2V0cy5maW5kKGV0ID0+IGV0Lm5hbWUgPT09IGVudGl0eVNldE5hbWUpO1xuXHRcdGlmICghZW50aXR5U2V0KSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR0YXJnZXQ6IGNvbnZlcnRlZE91dHB1dC5lbnRpdHlDb250YWluZXIsXG5cdFx0XHRcdG9iamVjdFBhdGg6IFtjb252ZXJ0ZWRPdXRwdXQuZW50aXR5Q29udGFpbmVyXVxuXHRcdFx0fSBhcyBSZXNvbHV0aW9uVGFyZ2V0PFQ+O1xuXHRcdH1cblx0XHRpZiAoYVBhdGhTcGxpdC5sZW5ndGggPT09IDApIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHRhcmdldDogZW50aXR5U2V0LFxuXHRcdFx0XHRvYmplY3RQYXRoOiBbY29udmVydGVkT3V0cHV0LmVudGl0eUNvbnRhaW5lciwgZW50aXR5U2V0XVxuXHRcdFx0fSBhcyBSZXNvbHV0aW9uVGFyZ2V0PFQ+O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCB0YXJnZXRSZXNvbHV0aW9uOiBhbnkgPSByZXNvbHZlVGFyZ2V0KG9iamVjdE1hcCwgZW50aXR5U2V0LCBcIi9cIiArIGFQYXRoU3BsaXQuam9pbihcIi9cIiksIGZhbHNlLCB0cnVlKTtcblx0XHRcdGlmICh0YXJnZXRSZXNvbHV0aW9uLnRhcmdldCkge1xuXHRcdFx0XHR0YXJnZXRSZXNvbHV0aW9uLnZpc2l0ZWRPYmplY3RzLnB1c2godGFyZ2V0UmVzb2x1dGlvbi50YXJnZXQpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dGFyZ2V0OiB0YXJnZXRSZXNvbHV0aW9uLnRhcmdldCxcblx0XHRcdFx0b2JqZWN0UGF0aDogdGFyZ2V0UmVzb2x1dGlvbi52aXNpdGVkT2JqZWN0c1xuXHRcdFx0fTtcblx0XHR9XG5cdH07XG59XG5cbmxldCBBTk5PVEFUSU9OX0VSUk9SUzogeyBtZXNzYWdlOiBzdHJpbmcgfVtdID0gW107XG5sZXQgQUxMX0FOTk9UQVRJT05fRVJST1JTOiBhbnkgPSB7fTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRUeXBlcyhwYXJzZXJPdXRwdXQ6IFBhcnNlck91dHB1dCk6IENvbnZlcnRlck91dHB1dCB7XG5cdEFOTk9UQVRJT05fRVJST1JTID0gW107XG5cdGNvbnN0IG9iamVjdE1hcCA9IGJ1aWxkT2JqZWN0TWFwKHBhcnNlck91dHB1dCk7XG5cdHJlc29sdmVOYXZpZ2F0aW9uUHJvcGVydGllcyhcblx0XHRwYXJzZXJPdXRwdXQuc2NoZW1hLmVudGl0eVR5cGVzIGFzIEVudGl0eVR5cGVbXSxcblx0XHRwYXJzZXJPdXRwdXQuc2NoZW1hLmFzc29jaWF0aW9ucyxcblx0XHRvYmplY3RNYXBcblx0KTtcblx0bGlua0FjdGlvbnNUb0VudGl0eVR5cGUocGFyc2VyT3V0cHV0LnNjaGVtYS5uYW1lc3BhY2UsIHBhcnNlck91dHB1dC5zY2hlbWEuYWN0aW9ucyBhcyBBY3Rpb25bXSwgb2JqZWN0TWFwKTtcblx0bGlua0VudGl0eVR5cGVUb0VudGl0eVNldChwYXJzZXJPdXRwdXQuc2NoZW1hLmVudGl0eVNldHMgYXMgRW50aXR5U2V0W10sIG9iamVjdE1hcCwgcGFyc2VyT3V0cHV0LnJlZmVyZW5jZXMpO1xuXHRsaW5rUHJvcGVydGllc1RvQ29tcGxleFR5cGVzKHBhcnNlck91dHB1dC5zY2hlbWEuZW50aXR5VHlwZXMgYXMgRW50aXR5VHlwZVtdLCBvYmplY3RNYXApO1xuXHRwcmVwYXJlQ29tcGxleFR5cGVzKHBhcnNlck91dHB1dC5zY2hlbWEuY29tcGxleFR5cGVzIGFzIENvbXBsZXhUeXBlW10sIHBhcnNlck91dHB1dC5zY2hlbWEuYXNzb2NpYXRpb25zLCBvYmplY3RNYXApO1xuXHRjb25zdCB0b1Jlc29sdmU6IFJlc29sdmVhYmxlW10gPSBbXTtcblx0Y29uc3QgdW5yZXNvbHZlZEFubm90YXRpb25zOiBBbm5vdGF0aW9uTGlzdFtdID0gW107XG5cblx0T2JqZWN0LmtleXMocGFyc2VyT3V0cHV0LnNjaGVtYS5hbm5vdGF0aW9ucykuZm9yRWFjaChhbm5vdGF0aW9uU291cmNlID0+IHtcblx0XHRwYXJzZXJPdXRwdXQuc2NoZW1hLmFubm90YXRpb25zW2Fubm90YXRpb25Tb3VyY2VdLmZvckVhY2goYW5ub3RhdGlvbkxpc3QgPT4ge1xuXHRcdFx0Y29uc3QgY3VycmVudFRhcmdldE5hbWUgPSB1bmFsaWFzKHBhcnNlck91dHB1dC5yZWZlcmVuY2VzLCBhbm5vdGF0aW9uTGlzdC50YXJnZXQpIGFzIHN0cmluZztcblx0XHRcdGNvbnN0IGN1cnJlbnRUYXJnZXQgPSBvYmplY3RNYXBbY3VycmVudFRhcmdldE5hbWVdO1xuXHRcdFx0aWYgKCFjdXJyZW50VGFyZ2V0KSB7XG5cdFx0XHRcdGlmIChjdXJyZW50VGFyZ2V0TmFtZS5pbmRleE9mKFwiQFwiKSAhPT0gLTEpIHtcblx0XHRcdFx0XHQoYW5ub3RhdGlvbkxpc3QgYXMgYW55KS5fX3NvdXJjZSA9IGFubm90YXRpb25Tb3VyY2U7XG5cdFx0XHRcdFx0dW5yZXNvbHZlZEFubm90YXRpb25zLnB1c2goYW5ub3RhdGlvbkxpc3QpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBjdXJyZW50VGFyZ2V0ID09PSBcIm9iamVjdFwiKSB7XG5cdFx0XHRcdGlmICghY3VycmVudFRhcmdldC5hbm5vdGF0aW9ucykge1xuXHRcdFx0XHRcdGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnMgPSB7fTtcblx0XHRcdFx0fVxuXHRcdFx0XHRhbm5vdGF0aW9uTGlzdC5hbm5vdGF0aW9ucy5mb3JFYWNoKGFubm90YXRpb24gPT4ge1xuXHRcdFx0XHRcdGNvbnN0IFt2b2NBbGlhcywgdm9jVGVybV0gPSBzcGxpdFRlcm0oZGVmYXVsdFJlZmVyZW5jZXMsIGFubm90YXRpb24udGVybSk7XG5cdFx0XHRcdFx0aWYgKCFjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zW3ZvY0FsaWFzXSkge1xuXHRcdFx0XHRcdFx0Y3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc10gPSB7fTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCFjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zLl9hbm5vdGF0aW9ucykge1xuXHRcdFx0XHRcdFx0Y3VycmVudFRhcmdldC5hbm5vdGF0aW9ucy5fYW5ub3RhdGlvbnMgPSB7fTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRjb25zdCB2b2NUZXJtV2l0aFF1YWxpZmllciA9IGAke3ZvY1Rlcm19JHthbm5vdGF0aW9uLnF1YWxpZmllciA/IGAjJHthbm5vdGF0aW9uLnF1YWxpZmllcn1gIDogXCJcIn1gO1xuXHRcdFx0XHRcdGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnNbdm9jQWxpYXNdW3ZvY1Rlcm1XaXRoUXVhbGlmaWVyXSA9IGNvbnZlcnRBbm5vdGF0aW9uKFxuXHRcdFx0XHRcdFx0YW5ub3RhdGlvbiBhcyBBbm5vdGF0aW9uLFxuXHRcdFx0XHRcdFx0cGFyc2VyT3V0cHV0LFxuXHRcdFx0XHRcdFx0Y3VycmVudFRhcmdldCxcblx0XHRcdFx0XHRcdG9iamVjdE1hcCxcblx0XHRcdFx0XHRcdHRvUmVzb2x2ZSxcblx0XHRcdFx0XHRcdGFubm90YXRpb25Tb3VyY2UsXG5cdFx0XHRcdFx0XHR1bnJlc29sdmVkQW5ub3RhdGlvbnNcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdHN3aXRjaCAodHlwZW9mIGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnNbdm9jQWxpYXNdW3ZvY1Rlcm1XaXRoUXVhbGlmaWVyXSkge1xuXHRcdFx0XHRcdFx0Y2FzZSBcInN0cmluZ1wiOlxuXHRcdFx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zW3ZvY0FsaWFzXVt2b2NUZXJtV2l0aFF1YWxpZmllcl0gPSBuZXcgU3RyaW5nKFxuXHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnNbdm9jQWxpYXNdW3ZvY1Rlcm1XaXRoUXVhbGlmaWVyXVxuXHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgXCJib29sZWFuXCI6XG5cdFx0XHRcdFx0XHRcdGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnNbdm9jQWxpYXNdW3ZvY1Rlcm1XaXRoUXVhbGlmaWVyXSA9IG5ldyBCb29sZWFuKFxuXHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnNbdm9jQWxpYXNdW3ZvY1Rlcm1XaXRoUXVhbGlmaWVyXVxuXHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0Y3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc11bdm9jVGVybVdpdGhRdWFsaWZpZXJdICE9PSBudWxsICYmXG5cdFx0XHRcdFx0XHR0eXBlb2YgY3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc11bdm9jVGVybVdpdGhRdWFsaWZpZXJdID09PSBcIm9iamVjdFwiXG5cdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zW3ZvY0FsaWFzXVt2b2NUZXJtV2l0aFF1YWxpZmllcl0udGVybSA9IHVuYWxpYXMoXG5cdFx0XHRcdFx0XHRcdGRlZmF1bHRSZWZlcmVuY2VzLFxuXHRcdFx0XHRcdFx0XHRgJHt2b2NBbGlhc30uJHt2b2NUZXJtfWBcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zW3ZvY0FsaWFzXVt2b2NUZXJtV2l0aFF1YWxpZmllcl0ucXVhbGlmaWVyID0gYW5ub3RhdGlvbi5xdWFsaWZpZXI7XG5cdFx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zW3ZvY0FsaWFzXVt2b2NUZXJtV2l0aFF1YWxpZmllcl0uX19zb3VyY2UgPSBhbm5vdGF0aW9uU291cmNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjb25zdCBhbm5vdGF0aW9uVGFyZ2V0ID0gYCR7Y3VycmVudFRhcmdldE5hbWV9QCR7dW5hbGlhcyhcblx0XHRcdFx0XHRcdGRlZmF1bHRSZWZlcmVuY2VzLFxuXHRcdFx0XHRcdFx0dm9jQWxpYXMgKyBcIi5cIiArIHZvY1Rlcm1XaXRoUXVhbGlmaWVyXG5cdFx0XHRcdFx0KX1gO1xuXHRcdFx0XHRcdGlmIChhbm5vdGF0aW9uLmFubm90YXRpb25zICYmIEFycmF5LmlzQXJyYXkoYW5ub3RhdGlvbi5hbm5vdGF0aW9ucykpIHtcblx0XHRcdFx0XHRcdGNvbnN0IHN1YkFubm90YXRpb25MaXN0ID0ge1xuXHRcdFx0XHRcdFx0XHR0YXJnZXQ6IGFubm90YXRpb25UYXJnZXQsXG5cdFx0XHRcdFx0XHRcdGFubm90YXRpb25zOiBhbm5vdGF0aW9uLmFubm90YXRpb25zLFxuXHRcdFx0XHRcdFx0XHRfX3NvdXJjZTogYW5ub3RhdGlvblNvdXJjZVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdHVucmVzb2x2ZWRBbm5vdGF0aW9ucy5wdXNoKHN1YkFubm90YXRpb25MaXN0KTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKFxuXHRcdFx0XHRcdFx0YW5ub3RhdGlvbi5hbm5vdGF0aW9ucyAmJlxuXHRcdFx0XHRcdFx0IWN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnNbdm9jQWxpYXNdW3ZvY1Rlcm1XaXRoUXVhbGlmaWVyXS5hbm5vdGF0aW9uc1xuXHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0Y3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc11bdm9jVGVybVdpdGhRdWFsaWZpZXJdLmFubm90YXRpb25zID0gYW5ub3RhdGlvbi5hbm5vdGF0aW9ucztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y3VycmVudFRhcmdldC5hbm5vdGF0aW9ucy5fYW5ub3RhdGlvbnNbYCR7dm9jQWxpYXN9LiR7dm9jVGVybVdpdGhRdWFsaWZpZXJ9YF0gPVxuXHRcdFx0XHRcdFx0Y3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc11bdm9jVGVybVdpdGhRdWFsaWZpZXJdO1xuXHRcdFx0XHRcdG9iamVjdE1hcFthbm5vdGF0aW9uVGFyZ2V0XSA9IGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnNbdm9jQWxpYXNdW3ZvY1Rlcm1XaXRoUXVhbGlmaWVyXTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0pO1xuXHRjb25zdCBleHRyYVVucmVzb2x2ZWRBbm5vdGF0aW9uczogQW5ub3RhdGlvbkxpc3RbXSA9IFtdO1xuXHR1bnJlc29sdmVkQW5ub3RhdGlvbnMuZm9yRWFjaChhbm5vdGF0aW9uTGlzdCA9PiB7XG5cdFx0Y29uc3QgY3VycmVudFRhcmdldE5hbWUgPSB1bmFsaWFzKHBhcnNlck91dHB1dC5yZWZlcmVuY2VzLCBhbm5vdGF0aW9uTGlzdC50YXJnZXQpIGFzIHN0cmluZztcblx0XHRsZXQgW2Jhc2VPYmosIGFubm90YXRpb25QYXJ0XSA9IGN1cnJlbnRUYXJnZXROYW1lLnNwbGl0KFwiQFwiKTtcblx0XHRjb25zdCB0YXJnZXRTcGxpdCA9IGFubm90YXRpb25QYXJ0LnNwbGl0KFwiL1wiKTtcblx0XHRiYXNlT2JqID0gYmFzZU9iaiArIFwiQFwiICsgdGFyZ2V0U3BsaXRbMF07XG5cdFx0Y29uc3QgY3VycmVudFRhcmdldCA9IHRhcmdldFNwbGl0LnNsaWNlKDEpLnJlZHVjZSgoY3VycmVudE9iaiwgcGF0aCkgPT4ge1xuXHRcdFx0aWYgKCFjdXJyZW50T2JqKSB7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGN1cnJlbnRPYmpbcGF0aF07XG5cdFx0fSwgb2JqZWN0TWFwW2Jhc2VPYmpdKTtcblx0XHRpZiAoIWN1cnJlbnRUYXJnZXQpIHtcblx0XHRcdEFOTk9UQVRJT05fRVJST1JTLnB1c2goe1xuXHRcdFx0XHRtZXNzYWdlOiBcIlRoZSBmb2xsb3dpbmcgYW5ub3RhdGlvbiB0YXJnZXQgd2FzIG5vdCBmb3VuZCBvbiB0aGUgc2VydmljZSBcIiArIGN1cnJlbnRUYXJnZXROYW1lXG5cdFx0XHR9KTtcblx0XHRcdC8vIGNvbnNvbGUubG9nKFwiTWlzc2luZyB0YXJnZXQgYWdhaW4gXCIgKyBjdXJyZW50VGFyZ2V0TmFtZSk7XG5cdFx0fSBlbHNlIGlmICh0eXBlb2YgY3VycmVudFRhcmdldCA9PT0gXCJvYmplY3RcIikge1xuXHRcdFx0aWYgKCFjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zKSB7XG5cdFx0XHRcdGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnMgPSB7fTtcblx0XHRcdH1cblx0XHRcdGFubm90YXRpb25MaXN0LmFubm90YXRpb25zLmZvckVhY2goYW5ub3RhdGlvbiA9PiB7XG5cdFx0XHRcdGNvbnN0IFt2b2NBbGlhcywgdm9jVGVybV0gPSBzcGxpdFRlcm0oZGVmYXVsdFJlZmVyZW5jZXMsIGFubm90YXRpb24udGVybSk7XG5cdFx0XHRcdGlmICghY3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc10pIHtcblx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zW3ZvY0FsaWFzXSA9IHt9O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghY3VycmVudFRhcmdldC5hbm5vdGF0aW9ucy5fYW5ub3RhdGlvbnMpIHtcblx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zLl9hbm5vdGF0aW9ucyA9IHt9O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3Qgdm9jVGVybVdpdGhRdWFsaWZpZXIgPSBgJHt2b2NUZXJtfSR7YW5ub3RhdGlvbi5xdWFsaWZpZXIgPyBgIyR7YW5ub3RhdGlvbi5xdWFsaWZpZXJ9YCA6IFwiXCJ9YDtcblx0XHRcdFx0Y3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc11bdm9jVGVybVdpdGhRdWFsaWZpZXJdID0gY29udmVydEFubm90YXRpb24oXG5cdFx0XHRcdFx0YW5ub3RhdGlvbiBhcyBBbm5vdGF0aW9uLFxuXHRcdFx0XHRcdHBhcnNlck91dHB1dCxcblx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LFxuXHRcdFx0XHRcdG9iamVjdE1hcCxcblx0XHRcdFx0XHR0b1Jlc29sdmUsXG5cdFx0XHRcdFx0KGFubm90YXRpb25MaXN0IGFzIGFueSkuX19zb3VyY2UsXG5cdFx0XHRcdFx0ZXh0cmFVbnJlc29sdmVkQW5ub3RhdGlvbnNcblx0XHRcdFx0KTtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnNbdm9jQWxpYXNdW3ZvY1Rlcm1XaXRoUXVhbGlmaWVyXSAhPT0gbnVsbCAmJlxuXHRcdFx0XHRcdHR5cGVvZiBjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zW3ZvY0FsaWFzXVt2b2NUZXJtV2l0aFF1YWxpZmllcl0gPT09IFwib2JqZWN0XCJcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0Y3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc11bdm9jVGVybVdpdGhRdWFsaWZpZXJdLnRlcm0gPSB1bmFsaWFzKFxuXHRcdFx0XHRcdFx0ZGVmYXVsdFJlZmVyZW5jZXMsXG5cdFx0XHRcdFx0XHRgJHt2b2NBbGlhc30uJHt2b2NUZXJtfWBcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnNbdm9jQWxpYXNdW3ZvY1Rlcm1XaXRoUXVhbGlmaWVyXS5xdWFsaWZpZXIgPSBhbm5vdGF0aW9uLnF1YWxpZmllcjtcblx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zW3ZvY0FsaWFzXVtcblx0XHRcdFx0XHRcdHZvY1Rlcm1XaXRoUXVhbGlmaWVyXG5cdFx0XHRcdFx0XS5fX3NvdXJjZSA9IChhbm5vdGF0aW9uTGlzdCBhcyBhbnkpLl9fc291cmNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnMuX2Fubm90YXRpb25zW2Ake3ZvY0FsaWFzfS4ke3ZvY1Rlcm1XaXRoUXVhbGlmaWVyfWBdID1cblx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zW3ZvY0FsaWFzXVt2b2NUZXJtV2l0aFF1YWxpZmllcl07XG5cdFx0XHRcdG9iamVjdE1hcFtgJHtjdXJyZW50VGFyZ2V0TmFtZX1AJHt1bmFsaWFzKGRlZmF1bHRSZWZlcmVuY2VzLCB2b2NBbGlhcyArIFwiLlwiICsgdm9jVGVybVdpdGhRdWFsaWZpZXIpfWBdID1cblx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zW3ZvY0FsaWFzXVt2b2NUZXJtV2l0aFF1YWxpZmllcl07XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0pO1xuXHR0b1Jlc29sdmUuZm9yRWFjaChyZXNvbHZlYWJsZSA9PiB7XG5cdFx0Y29uc3QgdGFyZ2V0U3RyID0gcmVzb2x2ZWFibGUuJHRhcmdldDtcblx0XHRjb25zdCBhbm5vdGF0aW9uc1Rlcm0gPSByZXNvbHZlYWJsZS5hbm5vdGF0aW9uc1Rlcm07XG5cdFx0Y29uc3QgYW5ub3RhdGlvblR5cGUgPSByZXNvbHZlYWJsZS5hbm5vdGF0aW9uVHlwZTtcblx0XHRyZXNvbHZlYWJsZS4kdGFyZ2V0ID0gb2JqZWN0TWFwW3RhcmdldFN0cl07XG5cdFx0ZGVsZXRlIHJlc29sdmVhYmxlLmFubm90YXRpb25UeXBlO1xuXHRcdGRlbGV0ZSByZXNvbHZlYWJsZS5hbm5vdGF0aW9uc1Rlcm07XG5cdFx0aWYgKCFyZXNvbHZlYWJsZS4kdGFyZ2V0KSB7XG5cdFx0XHRyZXNvbHZlYWJsZS50YXJnZXRTdHJpbmcgPSB0YXJnZXRTdHI7XG5cdFx0XHRpZiAoYW5ub3RhdGlvbnNUZXJtICYmIGFubm90YXRpb25UeXBlKSB7XG5cdFx0XHRcdGNvbnN0IG9FcnJvck1zZyA9IHtcblx0XHRcdFx0XHRtZXNzYWdlOlxuXHRcdFx0XHRcdFx0XCJVbmFibGUgdG8gcmVzb2x2ZSB0aGUgcGF0aCBleHByZXNzaW9uOiBcIiArXG5cdFx0XHRcdFx0XHR0YXJnZXRTdHIgK1xuXHRcdFx0XHRcdFx0XCJcXG5cIiArXG5cdFx0XHRcdFx0XHRcIlxcblwiICtcblx0XHRcdFx0XHRcdFwiSGludDogQ2hlY2sgYW5kIGNvcnJlY3QgdGhlIHBhdGggdmFsdWVzIHVuZGVyIHRoZSBmb2xsb3dpbmcgc3RydWN0dXJlIGluIHRoZSBtZXRhZGF0YSAoYW5ub3RhdGlvbi54bWwgZmlsZSBvciBDRFMgYW5ub3RhdGlvbnMgZm9yIHRoZSBhcHBsaWNhdGlvbik6IFxcblxcblwiICtcblx0XHRcdFx0XHRcdFwiPEFubm90YXRpb24gVGVybSA9IFwiICtcblx0XHRcdFx0XHRcdGFubm90YXRpb25zVGVybSArXG5cdFx0XHRcdFx0XHRcIj5cIiArXG5cdFx0XHRcdFx0XHRcIlxcblwiICtcblx0XHRcdFx0XHRcdFwiPFJlY29yZCBUeXBlID0gXCIgK1xuXHRcdFx0XHRcdFx0YW5ub3RhdGlvblR5cGUgK1xuXHRcdFx0XHRcdFx0XCI+XCIgK1xuXHRcdFx0XHRcdFx0XCJcXG5cIiArXG5cdFx0XHRcdFx0XHRcIjxBbm5vdGF0aW9uUGF0aCA9IFwiICtcblx0XHRcdFx0XHRcdHRhcmdldFN0ciArXG5cdFx0XHRcdFx0XHRcIj5cIlxuXHRcdFx0XHR9O1xuXHRcdFx0XHRhZGRBbm5vdGF0aW9uRXJyb3JNZXNzYWdlKHRhcmdldFN0ciwgb0Vycm9yTXNnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IHByb3BlcnR5ID0gcmVzb2x2ZWFibGUudGVybTtcblx0XHRcdFx0Y29uc3QgcGF0aCA9IHJlc29sdmVhYmxlLnBhdGg7XG5cdFx0XHRcdGNvbnN0IHRlcm1JbmZvID0gdGFyZ2V0U3RyID8gdGFyZ2V0U3RyLnNwbGl0KFwiL1wiKVswXSA6IHRhcmdldFN0cjtcblx0XHRcdFx0Y29uc3Qgb0Vycm9yTXNnID0ge1xuXHRcdFx0XHRcdG1lc3NhZ2U6XG5cdFx0XHRcdFx0XHRcIlVuYWJsZSB0byByZXNvbHZlIHRoZSBwYXRoIGV4cHJlc3Npb246IFwiICtcblx0XHRcdFx0XHRcdHRhcmdldFN0ciArXG5cdFx0XHRcdFx0XHRcIlxcblwiICtcblx0XHRcdFx0XHRcdFwiXFxuXCIgK1xuXHRcdFx0XHRcdFx0XCJIaW50OiBDaGVjayBhbmQgY29ycmVjdCB0aGUgcGF0aCB2YWx1ZXMgdW5kZXIgdGhlIGZvbGxvd2luZyBzdHJ1Y3R1cmUgaW4gdGhlIG1ldGFkYXRhIChhbm5vdGF0aW9uLnhtbCBmaWxlIG9yIENEUyBhbm5vdGF0aW9ucyBmb3IgdGhlIGFwcGxpY2F0aW9uKTogXFxuXFxuXCIgK1xuXHRcdFx0XHRcdFx0XCI8QW5ub3RhdGlvbiBUZXJtID0gXCIgK1xuXHRcdFx0XHRcdFx0dGVybUluZm8gK1xuXHRcdFx0XHRcdFx0XCI+XCIgK1xuXHRcdFx0XHRcdFx0XCJcXG5cIiArXG5cdFx0XHRcdFx0XHRcIjxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5ID0gXCIgK1xuXHRcdFx0XHRcdFx0cHJvcGVydHkgK1xuXHRcdFx0XHRcdFx0XCIgICAgICAgIFBhdGg9IFwiICtcblx0XHRcdFx0XHRcdHBhdGggK1xuXHRcdFx0XHRcdFx0XCI+XCJcblx0XHRcdFx0fTtcblx0XHRcdFx0YWRkQW5ub3RhdGlvbkVycm9yTWVzc2FnZSh0YXJnZXRTdHIsIG9FcnJvck1zZyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblx0Zm9yICh2YXIgcHJvcGVydHkgaW4gQUxMX0FOTk9UQVRJT05fRVJST1JTKSB7XG5cdFx0QU5OT1RBVElPTl9FUlJPUlMucHVzaChBTExfQU5OT1RBVElPTl9FUlJPUlNbcHJvcGVydHldWzBdKTtcblx0fVxuXHQocGFyc2VyT3V0cHV0IGFzIGFueSkuZW50aXR5U2V0cyA9IHBhcnNlck91dHB1dC5zY2hlbWEuZW50aXR5U2V0cztcblxuXHRjb25zdCBjb252ZXJ0ZWRPdXRwdXQ6IFBhcnRpYWw8Q29udmVydGVyT3V0cHV0PiA9IHtcblx0XHR2ZXJzaW9uOiBwYXJzZXJPdXRwdXQudmVyc2lvbixcblx0XHRhbm5vdGF0aW9uczogcGFyc2VyT3V0cHV0LnNjaGVtYS5hbm5vdGF0aW9ucyxcblx0XHRuYW1lc3BhY2U6IHBhcnNlck91dHB1dC5zY2hlbWEubmFtZXNwYWNlLFxuXHRcdGVudGl0eUNvbnRhaW5lcjogcGFyc2VyT3V0cHV0LnNjaGVtYS5lbnRpdHlDb250YWluZXIgYXMgRW50aXR5Q29udGFpbmVyLFxuXHRcdGFjdGlvbnM6IHBhcnNlck91dHB1dC5zY2hlbWEuYWN0aW9ucyBhcyBBY3Rpb25bXSxcblx0XHRlbnRpdHlTZXRzOiBwYXJzZXJPdXRwdXQuc2NoZW1hLmVudGl0eVNldHMgYXMgRW50aXR5U2V0W10sXG5cdFx0ZW50aXR5VHlwZXM6IHBhcnNlck91dHB1dC5zY2hlbWEuZW50aXR5VHlwZXMgYXMgRW50aXR5VHlwZVtdLFxuXHRcdGNvbXBsZXhUeXBlczogcGFyc2VyT3V0cHV0LnNjaGVtYS5jb21wbGV4VHlwZXMgYXMgQ29tcGxleFR5cGVbXSxcblx0XHRyZWZlcmVuY2VzOiBkZWZhdWx0UmVmZXJlbmNlcyxcblx0XHRkaWFnbm9zdGljczogQU5OT1RBVElPTl9FUlJPUlMuY29uY2F0KClcblx0fTtcblx0Y29udmVydGVkT3V0cHV0LnJlc29sdmVQYXRoID0gY3JlYXRlR2xvYmFsUmVzb2x2ZShjb252ZXJ0ZWRPdXRwdXQgYXMgQ29udmVydGVyT3V0cHV0LCBvYmplY3RNYXApO1xuXHRyZXR1cm4gY29udmVydGVkT3V0cHV0IGFzIENvbnZlcnRlck91dHB1dDtcbn1cblxuZnVuY3Rpb24gcmV2ZXJ0VmFsdWVUb0dlbmVyaWNUeXBlKHJlZmVyZW5jZXM6IFJlZmVyZW5jZVtdLCB2YWx1ZTogYW55KTogRXhwcmVzc2lvbiB8IHVuZGVmaW5lZCB7XG5cdGxldCByZXN1bHQ6IEV4cHJlc3Npb24gfCB1bmRlZmluZWQ7XG5cdGlmICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIpIHtcblx0XHRjb25zdCB2YWx1ZU1hdGNoZXMgPSB2YWx1ZS5tYXRjaCgvKFxcdyspXFwuXFx3K1xcLy4qLyk7XG5cdFx0aWYgKHZhbHVlTWF0Y2hlcyAmJiByZWZlcmVuY2VzLmZpbmQocmVmID0+IHJlZi5hbGlhcyA9PT0gdmFsdWVNYXRjaGVzWzFdKSkge1xuXHRcdFx0cmVzdWx0ID0ge1xuXHRcdFx0XHR0eXBlOiBcIkVudW1NZW1iZXJcIixcblx0XHRcdFx0RW51bU1lbWJlcjogdmFsdWVcblx0XHRcdH07XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlc3VsdCA9IHtcblx0XHRcdFx0dHlwZTogXCJTdHJpbmdcIixcblx0XHRcdFx0U3RyaW5nOiB2YWx1ZVxuXHRcdFx0fTtcblx0XHR9XG5cdH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcblx0XHRyZXN1bHQgPSB7XG5cdFx0XHR0eXBlOiBcIkNvbGxlY3Rpb25cIixcblx0XHRcdENvbGxlY3Rpb246IHZhbHVlLm1hcChhbm5vID0+IHJldmVydENvbGxlY3Rpb25JdGVtVG9HZW5lcmljVHlwZShyZWZlcmVuY2VzLCBhbm5vKSkgYXMgYW55W11cblx0XHR9O1xuXHR9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJib29sZWFuXCIpIHtcblx0XHRyZXN1bHQgPSB7XG5cdFx0XHR0eXBlOiBcIkJvb2xcIixcblx0XHRcdEJvb2w6IHZhbHVlXG5cdFx0fTtcblx0fSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09IFwibnVtYmVyXCIpIHtcblx0XHRpZiAodmFsdWUudG9TdHJpbmcoKSA9PT0gdmFsdWUudG9GaXhlZCgpKSB7XG5cdFx0XHRyZXN1bHQgPSB7XG5cdFx0XHRcdHR5cGU6IFwiSW50XCIsXG5cdFx0XHRcdEludDogdmFsdWVcblx0XHRcdH07XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlc3VsdCA9IHtcblx0XHRcdFx0dHlwZTogXCJEZWNpbWFsXCIsXG5cdFx0XHRcdERlY2ltYWw6IHZhbHVlXG5cdFx0XHR9O1xuXHRcdH1cblx0fSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdmFsdWUuaXNEZWNpbWFsICYmIHZhbHVlLmlzRGVjaW1hbCgpKSB7XG5cdFx0cmVzdWx0ID0ge1xuXHRcdFx0dHlwZTogXCJEZWNpbWFsXCIsXG5cdFx0XHREZWNpbWFsOiB2YWx1ZS52YWx1ZU9mKClcblx0XHR9O1xuXHR9IGVsc2UgaWYgKHZhbHVlLnR5cGUgPT09IFwiUGF0aFwiKSB7XG5cdFx0cmVzdWx0ID0ge1xuXHRcdFx0dHlwZTogXCJQYXRoXCIsXG5cdFx0XHRQYXRoOiB2YWx1ZS5wYXRoXG5cdFx0fTtcblx0fSBlbHNlIGlmICh2YWx1ZS50eXBlID09PSBcIkFubm90YXRpb25QYXRoXCIpIHtcblx0XHRyZXN1bHQgPSB7XG5cdFx0XHR0eXBlOiBcIkFubm90YXRpb25QYXRoXCIsXG5cdFx0XHRBbm5vdGF0aW9uUGF0aDogdmFsdWUudmFsdWVcblx0XHR9O1xuXHR9IGVsc2UgaWYgKHZhbHVlLnR5cGUgPT09IFwiUHJvcGVydHlQYXRoXCIpIHtcblx0XHRyZXN1bHQgPSB7XG5cdFx0XHR0eXBlOiBcIlByb3BlcnR5UGF0aFwiLFxuXHRcdFx0UHJvcGVydHlQYXRoOiB2YWx1ZS52YWx1ZVxuXHRcdH07XG5cdH0gZWxzZSBpZiAodmFsdWUudHlwZSA9PT0gXCJOYXZpZ2F0aW9uUHJvcGVydHlQYXRoXCIpIHtcblx0XHRyZXN1bHQgPSB7XG5cdFx0XHR0eXBlOiBcIk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcIixcblx0XHRcdE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGg6IHZhbHVlLnZhbHVlXG5cdFx0fTtcblx0fSBlbHNlIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIFwiJFR5cGVcIikpIHtcblx0XHRyZXN1bHQgPSB7XG5cdFx0XHR0eXBlOiBcIlJlY29yZFwiLFxuXHRcdFx0UmVjb3JkOiByZXZlcnRDb2xsZWN0aW9uSXRlbVRvR2VuZXJpY1R5cGUocmVmZXJlbmNlcywgdmFsdWUpIGFzIEFubm90YXRpb25SZWNvcmRcblx0XHR9O1xuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHJldmVydENvbGxlY3Rpb25JdGVtVG9HZW5lcmljVHlwZShcblx0cmVmZXJlbmNlczogUmVmZXJlbmNlW10sXG5cdGNvbGxlY3Rpb25JdGVtOiBhbnlcbik6XG5cdHwgQW5ub3RhdGlvblJlY29yZFxuXHR8IHN0cmluZ1xuXHR8IFByb3BlcnR5UGF0aEV4cHJlc3Npb25cblx0fCBQYXRoRXhwcmVzc2lvblxuXHR8IE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhFeHByZXNzaW9uXG5cdHwgQW5ub3RhdGlvblBhdGhFeHByZXNzaW9uXG5cdHwgdW5kZWZpbmVkIHtcblx0aWYgKHR5cGVvZiBjb2xsZWN0aW9uSXRlbSA9PT0gXCJzdHJpbmdcIikge1xuXHRcdHJldHVybiBjb2xsZWN0aW9uSXRlbTtcblx0fSBlbHNlIGlmICh0eXBlb2YgY29sbGVjdGlvbkl0ZW0gPT09IFwib2JqZWN0XCIpIHtcblx0XHRpZiAoY29sbGVjdGlvbkl0ZW0uaGFzT3duUHJvcGVydHkoXCIkVHlwZVwiKSkge1xuXHRcdFx0Ly8gQW5ub3RhdGlvbiBSZWNvcmRcblx0XHRcdGNvbnN0IG91dEl0ZW06IEFubm90YXRpb25SZWNvcmQgPSB7XG5cdFx0XHRcdHR5cGU6IGNvbGxlY3Rpb25JdGVtLiRUeXBlLFxuXHRcdFx0XHRwcm9wZXJ0eVZhbHVlczogW10gYXMgYW55W11cblx0XHRcdH07XG5cdFx0XHQvLyBDb3VsZCB2YWxpZGF0ZSBrZXlzIGFuZCB0eXBlIGJhc2VkIG9uICRUeXBlXG5cdFx0XHRPYmplY3Qua2V5cyhjb2xsZWN0aW9uSXRlbSkuZm9yRWFjaChjb2xsZWN0aW9uS2V5ID0+IHtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdGNvbGxlY3Rpb25LZXkgIT09IFwiJFR5cGVcIiAmJlxuXHRcdFx0XHRcdGNvbGxlY3Rpb25LZXkgIT09IFwidGVybVwiICYmXG5cdFx0XHRcdFx0Y29sbGVjdGlvbktleSAhPT0gXCJfX3NvdXJjZVwiICYmXG5cdFx0XHRcdFx0Y29sbGVjdGlvbktleSAhPT0gXCJxdWFsaWZpZXJcIiAmJlxuXHRcdFx0XHRcdGNvbGxlY3Rpb25LZXkgIT09IFwiQWN0aW9uVGFyZ2V0XCIgJiZcblx0XHRcdFx0XHRjb2xsZWN0aW9uS2V5ICE9PSBcImZ1bGx5UXVhbGlmaWVkTmFtZVwiICYmXG5cdFx0XHRcdFx0Y29sbGVjdGlvbktleSAhPT0gXCJhbm5vdGF0aW9uc1wiXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdGNvbnN0IHZhbHVlID0gY29sbGVjdGlvbkl0ZW1bY29sbGVjdGlvbktleV07XG5cdFx0XHRcdFx0b3V0SXRlbS5wcm9wZXJ0eVZhbHVlcy5wdXNoKHtcblx0XHRcdFx0XHRcdG5hbWU6IGNvbGxlY3Rpb25LZXksXG5cdFx0XHRcdFx0XHR2YWx1ZTogcmV2ZXJ0VmFsdWVUb0dlbmVyaWNUeXBlKHJlZmVyZW5jZXMsIHZhbHVlKSBhcyBFeHByZXNzaW9uXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoY29sbGVjdGlvbktleSA9PT0gXCJhbm5vdGF0aW9uc1wiKSB7XG5cdFx0XHRcdFx0Y29uc3QgYW5ub3RhdGlvbnMgPSBjb2xsZWN0aW9uSXRlbVtjb2xsZWN0aW9uS2V5XTtcblx0XHRcdFx0XHRvdXRJdGVtLmFubm90YXRpb25zID0gW107XG5cdFx0XHRcdFx0T2JqZWN0LmtleXMoYW5ub3RhdGlvbnMpXG5cdFx0XHRcdFx0XHQuZmlsdGVyKGtleSA9PiBrZXkgIT09IFwiX2Fubm90YXRpb25zXCIpXG5cdFx0XHRcdFx0XHQuZm9yRWFjaChrZXkgPT4ge1xuXHRcdFx0XHRcdFx0XHRPYmplY3Qua2V5cyhhbm5vdGF0aW9uc1trZXldKS5mb3JFYWNoKHRlcm0gPT4ge1xuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IHBhcnNlZEFubm90YXRpb24gPSByZXZlcnRUZXJtVG9HZW5lcmljVHlwZShyZWZlcmVuY2VzLCBhbm5vdGF0aW9uc1trZXldW3Rlcm1dKTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoIXBhcnNlZEFubm90YXRpb24udGVybSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc3QgdW5hbGlhc2VkVGVybSA9IHVuYWxpYXMocmVmZXJlbmNlcywgYCR7a2V5fS4ke3Rlcm19YCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAodW5hbGlhc2VkVGVybSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBxdWFsaWZpZWRTcGxpdCA9IHVuYWxpYXNlZFRlcm0uc3BsaXQoXCIjXCIpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRwYXJzZWRBbm5vdGF0aW9uLnRlcm0gPSBxdWFsaWZpZWRTcGxpdFswXTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKHF1YWxpZmllZFNwbGl0Lmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwYXJzZWRBbm5vdGF0aW9uLnF1YWxpZmllciA9IHF1YWxpZmllZFNwbGl0WzFdO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdG91dEl0ZW0uYW5ub3RhdGlvbnM/LnB1c2gocGFyc2VkQW5ub3RhdGlvbik7XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIG91dEl0ZW07XG5cdFx0fSBlbHNlIGlmIChjb2xsZWN0aW9uSXRlbS50eXBlID09PSBcIlByb3BlcnR5UGF0aFwiKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR0eXBlOiBcIlByb3BlcnR5UGF0aFwiLFxuXHRcdFx0XHRQcm9wZXJ0eVBhdGg6IGNvbGxlY3Rpb25JdGVtLnZhbHVlXG5cdFx0XHR9O1xuXHRcdH0gZWxzZSBpZiAoY29sbGVjdGlvbkl0ZW0udHlwZSA9PT0gXCJBbm5vdGF0aW9uUGF0aFwiKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR0eXBlOiBcIkFubm90YXRpb25QYXRoXCIsXG5cdFx0XHRcdEFubm90YXRpb25QYXRoOiBjb2xsZWN0aW9uSXRlbS52YWx1ZVxuXHRcdFx0fTtcblx0XHR9IGVsc2UgaWYgKGNvbGxlY3Rpb25JdGVtLnR5cGUgPT09IFwiTmF2aWdhdGlvblByb3BlcnR5UGF0aFwiKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR0eXBlOiBcIk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcIixcblx0XHRcdFx0TmF2aWdhdGlvblByb3BlcnR5UGF0aDogY29sbGVjdGlvbkl0ZW0udmFsdWVcblx0XHRcdH07XG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXZlcnRUZXJtVG9HZW5lcmljVHlwZShyZWZlcmVuY2VzOiBSZWZlcmVuY2VbXSwgYW5ub3RhdGlvbjogQW5ub3RhdGlvblRlcm08YW55Pik6IEVkbUFubm90YXRpb24ge1xuXHRjb25zdCBiYXNlQW5ub3RhdGlvbiA9IHtcblx0XHR0ZXJtOiBhbm5vdGF0aW9uLnRlcm0sXG5cdFx0cXVhbGlmaWVyOiBhbm5vdGF0aW9uLnF1YWxpZmllclxuXHR9O1xuXHRpZiAoQXJyYXkuaXNBcnJheShhbm5vdGF0aW9uKSkge1xuXHRcdC8vIENvbGxlY3Rpb25cblx0XHRyZXR1cm4ge1xuXHRcdFx0Li4uYmFzZUFubm90YXRpb24sXG5cdFx0XHRjb2xsZWN0aW9uOiBhbm5vdGF0aW9uLm1hcChhbm5vID0+IHJldmVydENvbGxlY3Rpb25JdGVtVG9HZW5lcmljVHlwZShyZWZlcmVuY2VzLCBhbm5vKSkgYXMgYW55W11cblx0XHR9O1xuXHR9IGVsc2UgaWYgKGFubm90YXRpb24uaGFzT3duUHJvcGVydHkoXCIkVHlwZVwiKSkge1xuXHRcdHJldHVybiB7IC4uLmJhc2VBbm5vdGF0aW9uLCByZWNvcmQ6IHJldmVydENvbGxlY3Rpb25JdGVtVG9HZW5lcmljVHlwZShyZWZlcmVuY2VzLCBhbm5vdGF0aW9uKSBhcyBhbnkgfTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4geyAuLi5iYXNlQW5ub3RhdGlvbiwgdmFsdWU6IHJldmVydFZhbHVlVG9HZW5lcmljVHlwZShyZWZlcmVuY2VzLCBhbm5vdGF0aW9uKSB9O1xuXHR9XG59XG4iXX0=