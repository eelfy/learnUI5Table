sap.ui.define([], function () {
  "use strict";

  var _exports = {};

  var isEntitySet = function (dataObject) {
    return dataObject && dataObject.hasOwnProperty("_type") && dataObject._type === "EntitySet";
  };

  _exports.isEntitySet = isEntitySet;

  var getFilterExpressionRestrictions = function (entitySet) {
    var _entitySet$annotation, _entitySet$annotation2, _entitySet$annotation3;

    return ((_entitySet$annotation = entitySet.annotations) === null || _entitySet$annotation === void 0 ? void 0 : (_entitySet$annotation2 = _entitySet$annotation.Capabilities) === null || _entitySet$annotation2 === void 0 ? void 0 : (_entitySet$annotation3 = _entitySet$annotation2.FilterRestrictions) === null || _entitySet$annotation3 === void 0 ? void 0 : _entitySet$annotation3.FilterExpressionRestrictions) || [];
  };

  _exports.getFilterExpressionRestrictions = getFilterExpressionRestrictions;

  var isStickySessionSupported = function (entitySet) {
    var _entitySet$annotation4;

    return !!((_entitySet$annotation4 = entitySet.annotations.Session) === null || _entitySet$annotation4 === void 0 ? void 0 : _entitySet$annotation4.StickySessionSupported);
  };

  _exports.isStickySessionSupported = isStickySessionSupported;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkVudGl0eVNldEhlbHBlci50cyJdLCJuYW1lcyI6WyJpc0VudGl0eVNldCIsImRhdGFPYmplY3QiLCJoYXNPd25Qcm9wZXJ0eSIsIl90eXBlIiwiZ2V0RmlsdGVyRXhwcmVzc2lvblJlc3RyaWN0aW9ucyIsImVudGl0eVNldCIsImFubm90YXRpb25zIiwiQ2FwYWJpbGl0aWVzIiwiRmlsdGVyUmVzdHJpY3Rpb25zIiwiRmlsdGVyRXhwcmVzc2lvblJlc3RyaWN0aW9ucyIsImlzU3RpY2t5U2Vzc2lvblN1cHBvcnRlZCIsIlNlc3Npb24iLCJTdGlja3lTZXNzaW9uU3VwcG9ydGVkIl0sIm1hcHBpbmdzIjoiOzs7OztBQUVPLE1BQU1BLFdBQVcsR0FBRyxVQUFTQyxVQUFULEVBQW1EO0FBQzdFLFdBQU9BLFVBQVUsSUFBSUEsVUFBVSxDQUFDQyxjQUFYLENBQTBCLE9BQTFCLENBQWQsSUFBb0RELFVBQVUsQ0FBQ0UsS0FBWCxLQUFxQixXQUFoRjtBQUNBLEdBRk07Ozs7QUFJQSxNQUFNQywrQkFBK0IsR0FBRyxVQUFTQyxTQUFULEVBQStCO0FBQUE7O0FBQzdFLFdBQU8sMEJBQUFBLFNBQVMsQ0FBQ0MsV0FBViwwR0FBdUJDLFlBQXZCLDRHQUFxQ0Msa0JBQXJDLGtGQUF5REMsNEJBQXpELEtBQXlGLEVBQWhHO0FBQ0EsR0FGTTs7OztBQUlBLE1BQU1DLHdCQUF3QixHQUFHLFVBQVNMLFNBQVQsRUFBd0M7QUFBQTs7QUFDL0UsV0FBTyxDQUFDLDRCQUFDQSxTQUFTLENBQUNDLFdBQVYsQ0FBc0JLLE9BQXZCLDJEQUFDLHVCQUErQkMsc0JBQWhDLENBQVI7QUFDQSxHQUZNIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFbnRpdHlTZXQgfSBmcm9tIFwiQHNhcC11eC9hbm5vdGF0aW9uLWNvbnZlcnRlclwiO1xuXG5leHBvcnQgY29uc3QgaXNFbnRpdHlTZXQgPSBmdW5jdGlvbihkYXRhT2JqZWN0OiBhbnkpOiBkYXRhT2JqZWN0IGlzIEVudGl0eVNldCB7XG5cdHJldHVybiBkYXRhT2JqZWN0ICYmIGRhdGFPYmplY3QuaGFzT3duUHJvcGVydHkoXCJfdHlwZVwiKSAmJiBkYXRhT2JqZWN0Ll90eXBlID09PSBcIkVudGl0eVNldFwiO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEZpbHRlckV4cHJlc3Npb25SZXN0cmljdGlvbnMgPSBmdW5jdGlvbihlbnRpdHlTZXQ6IEVudGl0eVNldCkge1xuXHRyZXR1cm4gZW50aXR5U2V0LmFubm90YXRpb25zPy5DYXBhYmlsaXRpZXM/LkZpbHRlclJlc3RyaWN0aW9ucz8uRmlsdGVyRXhwcmVzc2lvblJlc3RyaWN0aW9ucyB8fCBbXTtcbn07XG5cbmV4cG9ydCBjb25zdCBpc1N0aWNreVNlc3Npb25TdXBwb3J0ZWQgPSBmdW5jdGlvbihlbnRpdHlTZXQ6IEVudGl0eVNldCk6IGJvb2xlYW4ge1xuXHRyZXR1cm4gISFlbnRpdHlTZXQuYW5ub3RhdGlvbnMuU2Vzc2lvbj8uU3RpY2t5U2Vzc2lvblN1cHBvcnRlZDtcbn07XG4iXX0=