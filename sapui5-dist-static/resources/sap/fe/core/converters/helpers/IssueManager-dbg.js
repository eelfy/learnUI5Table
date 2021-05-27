sap.ui.define([], function () {
  "use strict";

  var _exports = {};
  var IssueSeverity;

  (function (IssueSeverity) {
    IssueSeverity[IssueSeverity["High"] = 0] = "High";
    IssueSeverity[IssueSeverity["Low"] = 1] = "Low";
    IssueSeverity[IssueSeverity["Medium"] = 2] = "Medium";
  })(IssueSeverity || (IssueSeverity = {}));

  _exports.IssueSeverity = IssueSeverity;
  var IssueCategoryType = {
    Facets: {
      MissingID: "MissingID",
      UnSupportedLevel: "UnsupportedLevel"
    }
  };
  _exports.IssueCategoryType = IssueCategoryType;
  var IssueCategory;

  (function (IssueCategory) {
    IssueCategory["Annotation"] = "Annotation";
    IssueCategory["Template"] = "Template";
    IssueCategory["Manifest"] = "Manifest";
    IssueCategory["Facets"] = "Facets";
  })(IssueCategory || (IssueCategory = {}));

  _exports.IssueCategory = IssueCategory;
  var IssueType = {
    MISSING_LINEITEM: "We couldn't find a line item annotation for the current entitySet, you should consider adding one.",
    MISSING_SELECTIONFIELD: "Defined Selection Field is not found",
    MALFORMED_DATAFIELD_FOR_IBN: {
      REQUIRESCONTEXT: "DataFieldForIntentBasedNavigation cannot use requires context in form/header.",
      INLINE: "DataFieldForIntentBasedNavigation cannot use Inline in form/header."
    },
    FULLSCREENMODE_NOT_ON_LISTREPORT: "enableFullScreenMode is not supported on list report pages."
  };
  _exports.IssueType = IssueType;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIklzc3VlTWFuYWdlci50cyJdLCJuYW1lcyI6WyJJc3N1ZVNldmVyaXR5IiwiSXNzdWVDYXRlZ29yeVR5cGUiLCJGYWNldHMiLCJNaXNzaW5nSUQiLCJVblN1cHBvcnRlZExldmVsIiwiSXNzdWVDYXRlZ29yeSIsIklzc3VlVHlwZSIsIk1JU1NJTkdfTElORUlURU0iLCJNSVNTSU5HX1NFTEVDVElPTkZJRUxEIiwiTUFMRk9STUVEX0RBVEFGSUVMRF9GT1JfSUJOIiwiUkVRVUlSRVNDT05URVhUIiwiSU5MSU5FIiwiRlVMTFNDUkVFTk1PREVfTk9UX09OX0xJU1RSRVBPUlQiXSwibWFwcGluZ3MiOiI7Ozs7TUFBWUEsYTs7YUFBQUEsYTtBQUFBQSxJQUFBQSxhLENBQUFBLGE7QUFBQUEsSUFBQUEsYSxDQUFBQSxhO0FBQUFBLElBQUFBLGEsQ0FBQUEsYTtLQUFBQSxhLEtBQUFBLGE7OztBQU1MLE1BQU1DLGlCQUFpQixHQUFHO0FBQ2hDQyxJQUFBQSxNQUFNLEVBQUU7QUFDUEMsTUFBQUEsU0FBUyxFQUFFLFdBREo7QUFFUEMsTUFBQUEsZ0JBQWdCLEVBQUU7QUFGWDtBQUR3QixHQUExQjs7TUFPS0MsYTs7YUFBQUEsYTtBQUFBQSxJQUFBQSxhO0FBQUFBLElBQUFBLGE7QUFBQUEsSUFBQUEsYTtBQUFBQSxJQUFBQSxhO0tBQUFBLGEsS0FBQUEsYTs7O0FBTUwsTUFBTUMsU0FBUyxHQUFHO0FBQ3hCQyxJQUFBQSxnQkFBZ0IsRUFBRSxvR0FETTtBQUV4QkMsSUFBQUEsc0JBQXNCLEVBQUUsc0NBRkE7QUFHeEJDLElBQUFBLDJCQUEyQixFQUFFO0FBQzVCQyxNQUFBQSxlQUFlLEVBQUUsK0VBRFc7QUFFNUJDLE1BQUFBLE1BQU0sRUFBRTtBQUZvQixLQUhMO0FBT3hCQyxJQUFBQSxnQ0FBZ0MsRUFBRTtBQVBWLEdBQWxCIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZW51bSBJc3N1ZVNldmVyaXR5IHtcblx0SGlnaCxcblx0TG93LFxuXHRNZWRpdW1cbn1cblxuZXhwb3J0IGNvbnN0IElzc3VlQ2F0ZWdvcnlUeXBlID0ge1xuXHRGYWNldHM6IHtcblx0XHRNaXNzaW5nSUQ6IFwiTWlzc2luZ0lEXCIsXG5cdFx0VW5TdXBwb3J0ZWRMZXZlbDogXCJVbnN1cHBvcnRlZExldmVsXCJcblx0fVxufTtcblxuZXhwb3J0IGVudW0gSXNzdWVDYXRlZ29yeSB7XG5cdEFubm90YXRpb24gPSBcIkFubm90YXRpb25cIixcblx0VGVtcGxhdGUgPSBcIlRlbXBsYXRlXCIsXG5cdE1hbmlmZXN0ID0gXCJNYW5pZmVzdFwiLFxuXHRGYWNldHMgPSBcIkZhY2V0c1wiXG59XG5leHBvcnQgY29uc3QgSXNzdWVUeXBlID0ge1xuXHRNSVNTSU5HX0xJTkVJVEVNOiBcIldlIGNvdWxkbid0IGZpbmQgYSBsaW5lIGl0ZW0gYW5ub3RhdGlvbiBmb3IgdGhlIGN1cnJlbnQgZW50aXR5U2V0LCB5b3Ugc2hvdWxkIGNvbnNpZGVyIGFkZGluZyBvbmUuXCIsXG5cdE1JU1NJTkdfU0VMRUNUSU9ORklFTEQ6IFwiRGVmaW5lZCBTZWxlY3Rpb24gRmllbGQgaXMgbm90IGZvdW5kXCIsXG5cdE1BTEZPUk1FRF9EQVRBRklFTERfRk9SX0lCTjoge1xuXHRcdFJFUVVJUkVTQ09OVEVYVDogXCJEYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb24gY2Fubm90IHVzZSByZXF1aXJlcyBjb250ZXh0IGluIGZvcm0vaGVhZGVyLlwiLFxuXHRcdElOTElORTogXCJEYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb24gY2Fubm90IHVzZSBJbmxpbmUgaW4gZm9ybS9oZWFkZXIuXCJcblx0fSxcblx0RlVMTFNDUkVFTk1PREVfTk9UX09OX0xJU1RSRVBPUlQ6IFwiZW5hYmxlRnVsbFNjcmVlbk1vZGUgaXMgbm90IHN1cHBvcnRlZCBvbiBsaXN0IHJlcG9ydCBwYWdlcy5cIlxufTtcbiJdfQ==