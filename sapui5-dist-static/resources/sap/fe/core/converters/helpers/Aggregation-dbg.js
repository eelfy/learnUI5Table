sap.ui.define([], function () {
  "use strict";

  var _exports = {};

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * helper class for Aggregation annotations.
   */
  var AggregationHelper = /*#__PURE__*/function () {
    /**
     * Creates a helper for a specific entity type and a converter context.
     *
     * @param entityType the entity type
     * @param converterContext the context
     */
    function AggregationHelper(entityType, converterContext) {
      var _converterContext$get, _converterContext$get2, _converterContext$get3, _converterContext$get4, _converterContext$get5, _converterContext$get6, _converterContext$get7, _converterContext$get8, _converterContext$get9;

      _classCallCheck(this, AggregationHelper);

      this._entityType = entityType;
      this._converterContext = converterContext;
      this._bApplySupported = ((_converterContext$get = converterContext.getEntitySet()) === null || _converterContext$get === void 0 ? void 0 : (_converterContext$get2 = _converterContext$get.annotations) === null || _converterContext$get2 === void 0 ? void 0 : (_converterContext$get3 = _converterContext$get2.Aggregation) === null || _converterContext$get3 === void 0 ? void 0 : _converterContext$get3.ApplySupported) || ((_converterContext$get4 = converterContext.getEntityContainer().annotations) === null || _converterContext$get4 === void 0 ? void 0 : (_converterContext$get5 = _converterContext$get4.Aggregation) === null || _converterContext$get5 === void 0 ? void 0 : _converterContext$get5.ApplySupported) ? true : false;
      var entitySetRestrictions = (_converterContext$get6 = converterContext.getEntitySet()) === null || _converterContext$get6 === void 0 ? void 0 : (_converterContext$get7 = _converterContext$get6.annotations) === null || _converterContext$get7 === void 0 ? void 0 : (_converterContext$get8 = _converterContext$get7.Aggregation) === null || _converterContext$get8 === void 0 ? void 0 : (_converterContext$get9 = _converterContext$get8.ApplySupported) === null || _converterContext$get9 === void 0 ? void 0 : _converterContext$get9.PropertyRestrictions;

      if (entitySetRestrictions !== undefined) {
        this._bHasPropertyRestrictions = entitySetRestrictions ? true : false;
      } else {
        var _converterContext$get10, _converterContext$get11, _converterContext$get12;

        this._bHasPropertyRestrictions = ((_converterContext$get10 = converterContext.getEntityContainer().annotations) === null || _converterContext$get10 === void 0 ? void 0 : (_converterContext$get11 = _converterContext$get10.Aggregation) === null || _converterContext$get11 === void 0 ? void 0 : (_converterContext$get12 = _converterContext$get11.ApplySupported) === null || _converterContext$get12 === void 0 ? void 0 : _converterContext$get12.PropertyRestrictions) ? true : false;
      }

      if (this._bHasPropertyRestrictions) {
        var _converterContext$get13, _converterContext$get14, _converterContext$get15, _converterContext$get16, _converterContext$get17, _converterContext$get18, _converterContext$get19;

        var groupablePropsFromContainer = ((_converterContext$get13 = converterContext.getEntityContainer().annotations) === null || _converterContext$get13 === void 0 ? void 0 : (_converterContext$get14 = _converterContext$get13.Aggregation) === null || _converterContext$get14 === void 0 ? void 0 : (_converterContext$get15 = _converterContext$get14.ApplySupported) === null || _converterContext$get15 === void 0 ? void 0 : _converterContext$get15.GroupableProperties) || [];
        var groupablePropsFromEntitySet = ((_converterContext$get16 = converterContext.getEntitySet()) === null || _converterContext$get16 === void 0 ? void 0 : (_converterContext$get17 = _converterContext$get16.annotations) === null || _converterContext$get17 === void 0 ? void 0 : (_converterContext$get18 = _converterContext$get17.Aggregation) === null || _converterContext$get18 === void 0 ? void 0 : (_converterContext$get19 = _converterContext$get18.ApplySupported) === null || _converterContext$get19 === void 0 ? void 0 : _converterContext$get19.GroupableProperties) || [];
        this._aRestrictedGroupableProperties = groupablePropsFromContainer.concat(groupablePropsFromEntitySet);
      } else {
        this._aRestrictedGroupableProperties = [];
      }
    }
    /**
     * Checks if the entity supports analytical queries.
     *
     * @returns true if analytical queries are supported, false otherwise.
     */


    _exports.AggregationHelper = AggregationHelper;

    _createClass(AggregationHelper, [{
      key: "isAnalyticsSupported",
      value: function isAnalyticsSupported() {
        return this._bApplySupported;
      }
      /**
       * Checks if a property is groupable.
       *
       * @param property the property to check
       * @returns undefined if the entity doesn't support analytical queries, true or false otherwise
       */

    }, {
      key: "isPropertyGroupable",
      value: function isPropertyGroupable(property) {
        if (!this._bApplySupported) {
          return undefined;
        } else {
          var _property$annotations, _property$annotations2, _property$annotations3;

          return !this._bHasPropertyRestrictions || ((_property$annotations = property.annotations) === null || _property$annotations === void 0 ? void 0 : (_property$annotations2 = _property$annotations.Aggregation) === null || _property$annotations2 === void 0 ? void 0 : (_property$annotations3 = _property$annotations2.Groupable) === null || _property$annotations3 === void 0 ? void 0 : _property$annotations3.valueOf()) === true || this._aRestrictedGroupableProperties.findIndex(function (path) {
            return path.$target.fullyQualifiedName === property.fullyQualifiedName;
          }) >= 0;
        }
      }
      /**
       * Returns the list of custom aggregate definitions for the entity type.
       *
       * @returns A map (propertyName --> array of context-defining property names) for each custom aggregate corresponding to a property. The array of
       * context-refining property names is empty if the aggregates doesn't have any context-defining property.
       */

    }, {
      key: "getCustomAggregateDefinitions",
      value: function getCustomAggregateDefinitions() {
        var _this = this;

        var mDefinitions = {}; // Get the custom aggregates on the entity type AND the entity set

        var aCustomAggregateAnnotations = this._converterContext.getEntityContainerAnnotationsByTerm("Aggregation", "Org.OData.Aggregation.V1.CustomAggregate").concat(this._converterContext.getEntitySetAnnotationsByTerm("Aggregation", "Org.OData.Aggregation.V1.CustomAggregate"));

        aCustomAggregateAnnotations.forEach(function (annotation) {
          // Check if there's a property with the same name as the custom aggregate
          var oAggregatedProperty = _this._entityType.entityProperties.find(function (oProperty) {
            return oProperty.name === annotation.qualifier;
          });

          if (oAggregatedProperty) {
            var _annotation$annotatio, _annotation$annotatio2;

            var aContextDefiningProperties = (_annotation$annotatio = annotation.annotations) === null || _annotation$annotatio === void 0 ? void 0 : (_annotation$annotatio2 = _annotation$annotatio.Aggregation) === null || _annotation$annotatio2 === void 0 ? void 0 : _annotation$annotatio2.ContextDefiningProperties;
            mDefinitions[oAggregatedProperty.name] = aContextDefiningProperties ? aContextDefiningProperties.map(function (oCtxDefProperty) {
              return oCtxDefProperty.value;
            }) : [];
          }
        });
        return mDefinitions;
      }
    }]);

    return AggregationHelper;
  }();

  _exports.AggregationHelper = AggregationHelper;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFnZ3JlZ2F0aW9uLnRzIl0sIm5hbWVzIjpbIkFnZ3JlZ2F0aW9uSGVscGVyIiwiZW50aXR5VHlwZSIsImNvbnZlcnRlckNvbnRleHQiLCJfZW50aXR5VHlwZSIsIl9jb252ZXJ0ZXJDb250ZXh0IiwiX2JBcHBseVN1cHBvcnRlZCIsImdldEVudGl0eVNldCIsImFubm90YXRpb25zIiwiQWdncmVnYXRpb24iLCJBcHBseVN1cHBvcnRlZCIsImdldEVudGl0eUNvbnRhaW5lciIsImVudGl0eVNldFJlc3RyaWN0aW9ucyIsIlByb3BlcnR5UmVzdHJpY3Rpb25zIiwidW5kZWZpbmVkIiwiX2JIYXNQcm9wZXJ0eVJlc3RyaWN0aW9ucyIsImdyb3VwYWJsZVByb3BzRnJvbUNvbnRhaW5lciIsIkdyb3VwYWJsZVByb3BlcnRpZXMiLCJncm91cGFibGVQcm9wc0Zyb21FbnRpdHlTZXQiLCJfYVJlc3RyaWN0ZWRHcm91cGFibGVQcm9wZXJ0aWVzIiwiY29uY2F0IiwicHJvcGVydHkiLCJHcm91cGFibGUiLCJ2YWx1ZU9mIiwiZmluZEluZGV4IiwicGF0aCIsIiR0YXJnZXQiLCJmdWxseVF1YWxpZmllZE5hbWUiLCJtRGVmaW5pdGlvbnMiLCJhQ3VzdG9tQWdncmVnYXRlQW5ub3RhdGlvbnMiLCJnZXRFbnRpdHlDb250YWluZXJBbm5vdGF0aW9uc0J5VGVybSIsImdldEVudGl0eVNldEFubm90YXRpb25zQnlUZXJtIiwiZm9yRWFjaCIsImFubm90YXRpb24iLCJvQWdncmVnYXRlZFByb3BlcnR5IiwiZW50aXR5UHJvcGVydGllcyIsImZpbmQiLCJvUHJvcGVydHkiLCJuYW1lIiwicXVhbGlmaWVyIiwiYUNvbnRleHREZWZpbmluZ1Byb3BlcnRpZXMiLCJDb250ZXh0RGVmaW5pbmdQcm9wZXJ0aWVzIiwibWFwIiwib0N0eERlZlByb3BlcnR5IiwidmFsdWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBT0E7OztNQUdhQSxpQjtBQU9aOzs7Ozs7QUFNQSwrQkFBWUMs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U0FBUyxFQUFJO0FBQy9FLG1CQUFPQSxTQUFTLENBQUNDLElBQVYsS0FBbUJMLFVBQVUsQ0FBQ00sU0FBckM7QUFDQSxXQUYyQixDQUE1Qjs7QUFHQSxjQUFJTCxtQkFBSixFQUF5QjtBQUFBOztBQUN4QixnQkFBTU0sMEJBQTBCLDRCQUFHUCxVQUFVLENBQUN6QixXQUFkLG9GQUFHLHNCQUF3QkMsV0FBM0IsMkRBQUcsdUJBQXFDZ0MseUJBQXhFO0FBRUFiLFlBQUFBLFlBQVksQ0FBQ00sbUJBQW1CLENBQUNJLElBQXJCLENBQVosR0FBeUNFLDBCQUEwQixHQUNoRUEsMEJBQTBCLENBQUNFLEdBQTNCLENBQStCLFVBQUFDLGVBQWUsRUFBSTtBQUNsRCxxQkFBT0EsZUFBZSxDQUFDQyxLQUF2QjtBQUNDLGFBRkQsQ0FEZ0UsR0FJaEUsRUFKSDtBQUtBO0FBQ0QsU0FkRDtBQWdCQSxlQUFPaEIsWUFBUDtBQUNBIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFbnRpdHlUeXBlLCBQcm9wZXJ0eSB9IGZyb20gXCJAc2FwLXV4L2Fubm90YXRpb24tY29udmVydGVyXCI7XG5pbXBvcnQgeyBBbm5vdGF0aW9uVGVybSB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlc1wiO1xuaW1wb3J0IHsgQWdncmVnYXRpb25Bbm5vdGF0aW9uVGVybXMsIEN1c3RvbUFnZ3JlZ2F0ZSB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlcy9kaXN0L2dlbmVyYXRlZC9BZ2dyZWdhdGlvblwiO1xuaW1wb3J0IHsgUHJvcGVydHlQYXRoIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzL2Rpc3QvRWRtXCI7XG5cbmltcG9ydCB7IENvbnZlcnRlckNvbnRleHQgfSBmcm9tIFwiLi4vdGVtcGxhdGVzL0Jhc2VDb252ZXJ0ZXJcIjtcblxuLyoqXG4gKiBoZWxwZXIgY2xhc3MgZm9yIEFnZ3JlZ2F0aW9uIGFubm90YXRpb25zLlxuICovXG5leHBvcnQgY2xhc3MgQWdncmVnYXRpb25IZWxwZXIge1xuXHRfZW50aXR5VHlwZTogRW50aXR5VHlwZTtcblx0X2NvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQ7XG5cdF9iQXBwbHlTdXBwb3J0ZWQ6IGJvb2xlYW47XG5cdF9iSGFzUHJvcGVydHlSZXN0cmljdGlvbnM6IGJvb2xlYW47XG5cdF9hUmVzdHJpY3RlZEdyb3VwYWJsZVByb3BlcnRpZXM6IFByb3BlcnR5UGF0aFtdO1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgaGVscGVyIGZvciBhIHNwZWNpZmljIGVudGl0eSB0eXBlIGFuZCBhIGNvbnZlcnRlciBjb250ZXh0LlxuXHQgKlxuXHQgKiBAcGFyYW0gZW50aXR5VHlwZSB0aGUgZW50aXR5IHR5cGVcblx0ICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHQgdGhlIGNvbnRleHRcblx0ICovXG5cdGNvbnN0cnVjdG9yKGVudGl0eVR5cGU6IEVudGl0eVR5cGUsIGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQpIHtcblx0XHR0aGlzLl9lbnRpdHlUeXBlID0gZW50aXR5VHlwZTtcblx0XHR0aGlzLl9jb252ZXJ0ZXJDb250ZXh0ID0gY29udmVydGVyQ29udGV4dDtcblxuXHRcdHRoaXMuX2JBcHBseVN1cHBvcnRlZCA9XG5cdFx0XHRjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVNldCgpPy5hbm5vdGF0aW9ucz8uQWdncmVnYXRpb24/LkFwcGx5U3VwcG9ydGVkIHx8XG5cdFx0XHRjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eUNvbnRhaW5lcigpLmFubm90YXRpb25zPy5BZ2dyZWdhdGlvbj8uQXBwbHlTdXBwb3J0ZWRcblx0XHRcdFx0PyB0cnVlXG5cdFx0XHRcdDogZmFsc2U7XG5cblx0XHRjb25zdCBlbnRpdHlTZXRSZXN0cmljdGlvbnMgPSBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVNldCgpPy5hbm5vdGF0aW9ucz8uQWdncmVnYXRpb24/LkFwcGx5U3VwcG9ydGVkPy5Qcm9wZXJ0eVJlc3RyaWN0aW9ucztcblx0XHRpZiAoZW50aXR5U2V0UmVzdHJpY3Rpb25zICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHRoaXMuX2JIYXNQcm9wZXJ0eVJlc3RyaWN0aW9ucyA9IGVudGl0eVNldFJlc3RyaWN0aW9ucyA/IHRydWUgOiBmYWxzZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5fYkhhc1Byb3BlcnR5UmVzdHJpY3Rpb25zID0gY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlDb250YWluZXIoKS5hbm5vdGF0aW9ucz8uQWdncmVnYXRpb24/LkFwcGx5U3VwcG9ydGVkXG5cdFx0XHRcdD8uUHJvcGVydHlSZXN0cmljdGlvbnNcblx0XHRcdFx0PyB0cnVlXG5cdFx0XHRcdDogZmFsc2U7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX2JIYXNQcm9wZXJ0eVJlc3RyaWN0aW9ucykge1xuXHRcdFx0Y29uc3QgZ3JvdXBhYmxlUHJvcHNGcm9tQ29udGFpbmVyID0gKGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5Q29udGFpbmVyKCkuYW5ub3RhdGlvbnM/LkFnZ3JlZ2F0aW9uPy5BcHBseVN1cHBvcnRlZFxuXHRcdFx0XHQ/Lkdyb3VwYWJsZVByb3BlcnRpZXMgfHwgW10pIGFzIFByb3BlcnR5UGF0aFtdO1xuXHRcdFx0Y29uc3QgZ3JvdXBhYmxlUHJvcHNGcm9tRW50aXR5U2V0ID0gKGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0KCk/LmFubm90YXRpb25zPy5BZ2dyZWdhdGlvbj8uQXBwbHlTdXBwb3J0ZWRcblx0XHRcdFx0Py5Hcm91cGFibGVQcm9wZXJ0aWVzIHx8IFtdKSBhcyBQcm9wZXJ0eVBhdGhbXTtcblx0XHRcdHRoaXMuX2FSZXN0cmljdGVkR3JvdXBhYmxlUHJvcGVydGllcyA9IGdyb3VwYWJsZVByb3BzRnJvbUNvbnRhaW5lci5jb25jYXQoZ3JvdXBhYmxlUHJvcHNGcm9tRW50aXR5U2V0KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5fYVJlc3RyaWN0ZWRHcm91cGFibGVQcm9wZXJ0aWVzID0gW107XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiB0aGUgZW50aXR5IHN1cHBvcnRzIGFuYWx5dGljYWwgcXVlcmllcy5cblx0ICpcblx0ICogQHJldHVybnMgdHJ1ZSBpZiBhbmFseXRpY2FsIHF1ZXJpZXMgYXJlIHN1cHBvcnRlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuXHQgKi9cblx0cHVibGljIGlzQW5hbHl0aWNzU3VwcG9ydGVkKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0aGlzLl9iQXBwbHlTdXBwb3J0ZWQ7XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2tzIGlmIGEgcHJvcGVydHkgaXMgZ3JvdXBhYmxlLlxuXHQgKlxuXHQgKiBAcGFyYW0gcHJvcGVydHkgdGhlIHByb3BlcnR5IHRvIGNoZWNrXG5cdCAqIEByZXR1cm5zIHVuZGVmaW5lZCBpZiB0aGUgZW50aXR5IGRvZXNuJ3Qgc3VwcG9ydCBhbmFseXRpY2FsIHF1ZXJpZXMsIHRydWUgb3IgZmFsc2Ugb3RoZXJ3aXNlXG5cdCAqL1xuXHRwdWJsaWMgaXNQcm9wZXJ0eUdyb3VwYWJsZShwcm9wZXJ0eTogUHJvcGVydHkpOiBib29sZWFuIHwgdW5kZWZpbmVkIHtcblx0XHRpZiAoIXRoaXMuX2JBcHBseVN1cHBvcnRlZCkge1xuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0IXRoaXMuX2JIYXNQcm9wZXJ0eVJlc3RyaWN0aW9ucyB8fFxuXHRcdFx0XHRwcm9wZXJ0eS5hbm5vdGF0aW9ucz8uQWdncmVnYXRpb24/Lkdyb3VwYWJsZT8udmFsdWVPZigpID09PSB0cnVlIHx8XG5cdFx0XHRcdHRoaXMuX2FSZXN0cmljdGVkR3JvdXBhYmxlUHJvcGVydGllcy5maW5kSW5kZXgocGF0aCA9PiBwYXRoLiR0YXJnZXQuZnVsbHlRdWFsaWZpZWROYW1lID09PSBwcm9wZXJ0eS5mdWxseVF1YWxpZmllZE5hbWUpID49IDBcblx0XHRcdCk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIGxpc3Qgb2YgY3VzdG9tIGFnZ3JlZ2F0ZSBkZWZpbml0aW9ucyBmb3IgdGhlIGVudGl0eSB0eXBlLlxuXHQgKlxuXHQgKiBAcmV0dXJucyBBIG1hcCAocHJvcGVydHlOYW1lIC0tPiBhcnJheSBvZiBjb250ZXh0LWRlZmluaW5nIHByb3BlcnR5IG5hbWVzKSBmb3IgZWFjaCBjdXN0b20gYWdncmVnYXRlIGNvcnJlc3BvbmRpbmcgdG8gYSBwcm9wZXJ0eS4gVGhlIGFycmF5IG9mXG5cdCAqIGNvbnRleHQtcmVmaW5pbmcgcHJvcGVydHkgbmFtZXMgaXMgZW1wdHkgaWYgdGhlIGFnZ3JlZ2F0ZXMgZG9lc24ndCBoYXZlIGFueSBjb250ZXh0LWRlZmluaW5nIHByb3BlcnR5LlxuXHQgKi9cblx0cHVibGljIGdldEN1c3RvbUFnZ3JlZ2F0ZURlZmluaXRpb25zKCk6IFJlY29yZDxzdHJpbmcsIHN0cmluZ1tdPiB7XG5cdFx0Y29uc3QgbURlZmluaXRpb25zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmdbXT4gPSB7fTtcblxuXHRcdC8vIEdldCB0aGUgY3VzdG9tIGFnZ3JlZ2F0ZXMgb24gdGhlIGVudGl0eSB0eXBlIEFORCB0aGUgZW50aXR5IHNldFxuXHRcdGNvbnN0IGFDdXN0b21BZ2dyZWdhdGVBbm5vdGF0aW9uczogQW5ub3RhdGlvblRlcm08Q3VzdG9tQWdncmVnYXRlPltdID0gdGhpcy5fY29udmVydGVyQ29udGV4dFxuXHRcdFx0LmdldEVudGl0eUNvbnRhaW5lckFubm90YXRpb25zQnlUZXJtKFwiQWdncmVnYXRpb25cIiwgQWdncmVnYXRpb25Bbm5vdGF0aW9uVGVybXMuQ3VzdG9tQWdncmVnYXRlKVxuXHRcdFx0LmNvbmNhdCh0aGlzLl9jb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVNldEFubm90YXRpb25zQnlUZXJtKFwiQWdncmVnYXRpb25cIiwgQWdncmVnYXRpb25Bbm5vdGF0aW9uVGVybXMuQ3VzdG9tQWdncmVnYXRlKSk7XG5cblx0XHRhQ3VzdG9tQWdncmVnYXRlQW5ub3RhdGlvbnMuZm9yRWFjaChhbm5vdGF0aW9uID0+IHtcblx0XHRcdC8vIENoZWNrIGlmIHRoZXJlJ3MgYSBwcm9wZXJ0eSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgdGhlIGN1c3RvbSBhZ2dyZWdhdGVcblx0XHRcdGNvbnN0IG9BZ2dyZWdhdGVkUHJvcGVydHkgPSB0aGlzLl9lbnRpdHlUeXBlLmVudGl0eVByb3BlcnRpZXMuZmluZChvUHJvcGVydHkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gb1Byb3BlcnR5Lm5hbWUgPT09IGFubm90YXRpb24ucXVhbGlmaWVyO1xuXHRcdFx0fSk7XG5cdFx0XHRpZiAob0FnZ3JlZ2F0ZWRQcm9wZXJ0eSkge1xuXHRcdFx0XHRjb25zdCBhQ29udGV4dERlZmluaW5nUHJvcGVydGllcyA9IGFubm90YXRpb24uYW5ub3RhdGlvbnM/LkFnZ3JlZ2F0aW9uPy5Db250ZXh0RGVmaW5pbmdQcm9wZXJ0aWVzO1xuXG5cdFx0XHRcdG1EZWZpbml0aW9uc1tvQWdncmVnYXRlZFByb3BlcnR5Lm5hbWVdID0gYUNvbnRleHREZWZpbmluZ1Byb3BlcnRpZXNcblx0XHRcdFx0XHQ/IGFDb250ZXh0RGVmaW5pbmdQcm9wZXJ0aWVzLm1hcChvQ3R4RGVmUHJvcGVydHkgPT4ge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gb0N0eERlZlByb3BlcnR5LnZhbHVlO1xuXHRcdFx0XHRcdCAgfSlcblx0XHRcdFx0XHQ6IFtdO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIG1EZWZpbml0aW9ucztcblx0fVxufVxuIl19