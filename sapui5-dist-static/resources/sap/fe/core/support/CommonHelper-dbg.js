sap.ui.define(["sap/ui/support/library", "sap/fe/core/converters/helpers/IssueManager"], function (SupportLib, IssueManager) {
  "use strict";

  var _exports = {};
  var IssueSeverity = IssueManager.IssueSeverity;
  var IssueCategory = IssueManager.IssueCategory;

  /*!
   * ${copyright}
   */

  /**
   * Defines support rules of the ObjectPageHeader control of sap.uxap library.
   */
  var Categories = SupportLib.Categories,
      // Accessibility, Performance, Memory, ...
  Severity = SupportLib.Severity,
      // Hint, Warning, Error
  Audiences = SupportLib.Audiences; // Control, Internal, Application
  //**********************************************************
  // Rule Definitions
  //**********************************************************
  // Rule checks if objectPage componentContainer height is set

  _exports.Categories = Categories;
  _exports.Audiences = Audiences;
  _exports.Severity = Severity;

  var getSeverity = function (oSeverity) {
    switch (oSeverity) {
      case IssueSeverity.Low:
        return Severity.Low;

      case IssueSeverity.High:
        return Severity.High;

      case IssueSeverity.Medium:
        return Severity.Medium;
    }
  };

  _exports.getSeverity = getSeverity;

  var getIssueByCategory = function (oIssueManager, oCoreFacade,
  /*oScope: any*/
  issueCategoryType, issueSubCategoryType) {
    var mComponents = oCoreFacade.getComponents();
    var oAppComponent;
    Object.keys(mComponents).forEach(function (sKey) {
      var _oComponent$getMetada, _oComponent$getMetada2;

      var oComponent = mComponents[sKey];

      if ((oComponent === null || oComponent === void 0 ? void 0 : (_oComponent$getMetada = oComponent.getMetadata()) === null || _oComponent$getMetada === void 0 ? void 0 : (_oComponent$getMetada2 = _oComponent$getMetada.getParent()) === null || _oComponent$getMetada2 === void 0 ? void 0 : _oComponent$getMetada2.getName()) === "sap.fe.core.AppComponent") {
        oAppComponent = oComponent;
      }
    });

    if (oAppComponent) {
      var aIssues = oAppComponent.getDiagnostics().getIssuesByCategory(IssueCategory[issueCategoryType], issueSubCategoryType);
      aIssues.forEach(function (oElement) {
        oIssueManager.addIssue({
          severity: getSeverity(oElement.severity),
          details: oElement.details,
          context: {
            id: oElement.category
          }
        });
      });
    }
  };

  _exports.getIssueByCategory = getIssueByCategory;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbW1vbkhlbHBlci50cyJdLCJuYW1lcyI6WyJDYXRlZ29yaWVzIiwiU3VwcG9ydExpYiIsIlNldmVyaXR5IiwiQXVkaWVuY2VzIiwiZ2V0U2V2ZXJpdHkiLCJvU2V2ZXJpdHkiLCJJc3N1ZVNldmVyaXR5IiwiTG93IiwiSGlnaCIsIk1lZGl1bSIsImdldElzc3VlQnlDYXRlZ29yeSIsIm9Jc3N1ZU1hbmFnZXIiLCJvQ29yZUZhY2FkZSIsImlzc3VlQ2F0ZWdvcnlUeXBlIiwiaXNzdWVTdWJDYXRlZ29yeVR5cGUiLCJtQ29tcG9uZW50cyIsImdldENvbXBvbmVudHMiLCJvQXBwQ29tcG9uZW50IiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJzS2V5Iiwib0NvbXBvbmVudCIsImdldE1ldGFkYXRhIiwiZ2V0UGFyZW50IiwiZ2V0TmFtZSIsImFJc3N1ZXMiLCJnZXREaWFnbm9zdGljcyIsImdldElzc3Vlc0J5Q2F0ZWdvcnkiLCJJc3N1ZUNhdGVnb3J5Iiwib0VsZW1lbnQiLCJhZGRJc3N1ZSIsInNldmVyaXR5IiwiZGV0YWlscyIsImNvbnRleHQiLCJpZCIsImNhdGVnb3J5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7QUFHQTs7O0FBUU8sTUFBTUEsVUFBVSxHQUFHQyxVQUFVLENBQUNELFVBQTlCO0FBQUEsTUFBMEM7QUFDaERFLEVBQUFBLFFBQVEsR0FBR0QsVUFBVSxDQUFDQyxRQURoQjtBQUFBLE1BQzBCO0FBQ2hDQyxFQUFBQSxTQUFTLEdBQUdGLFVBQVUsQ0FBQ0UsU0FGakIsQyxDQUU0QjtBQUVuQztBQUNBO0FBQ0E7QUFFQTs7Ozs7O0FBRU8sTUFBTUMsV0FBVyxHQUFHLFVBQVNDLFNBQVQsRUFBbUM7QUFDN0QsWUFBUUEsU0FBUjtBQUNDLFdBQUtDLGFBQWEsQ0FBQ0MsR0FBbkI7QUFDQyxlQUFPTCxRQUFRLENBQUNLLEdBQWhCOztBQUNELFdBQUtELGFBQWEsQ0FBQ0UsSUFBbkI7QUFDQyxlQUFPTixRQUFRLENBQUNNLElBQWhCOztBQUNELFdBQUtGLGFBQWEsQ0FBQ0csTUFBbkI7QUFDQyxlQUFPUCxRQUFRLENBQUNPLE1BQWhCO0FBTkY7QUFRQSxHQVRNOzs7O0FBV0EsTUFBTUMsa0JBQWtCLEdBQUcsVUFDakNDLGFBRGlDLEVBRWpDQyxXQUZpQztBQUVoQjtBQUNqQkMsRUFBQUEsaUJBSGlDLEVBSWpDQyxvQkFKaUMsRUFLaEM7QUFDRCxRQUFNQyxXQUFXLEdBQUdILFdBQVcsQ0FBQ0ksYUFBWixFQUFwQjtBQUNBLFFBQUlDLGFBQUo7QUFDQUMsSUFBQUEsTUFBTSxDQUFDQyxJQUFQLENBQVlKLFdBQVosRUFBeUJLLE9BQXpCLENBQWlDLFVBQUFDLElBQUksRUFBSTtBQUFBOztBQUN4QyxVQUFNQyxVQUFVLEdBQUdQLFdBQVcsQ0FBQ00sSUFBRCxDQUE5Qjs7QUFDQSxVQUNDLENBQUFDLFVBQVUsU0FBVixJQUFBQSxVQUFVLFdBQVYscUNBQUFBLFVBQVUsQ0FDUEMsV0FESCw0R0FFR0MsU0FGSCxvRkFHR0MsT0FISCxRQUdpQiwwQkFKbEIsRUFLRTtBQUNEUixRQUFBQSxhQUFhLEdBQUdLLFVBQWhCO0FBQ0E7QUFDRCxLQVZEOztBQVdBLFFBQUlMLGFBQUosRUFBbUI7QUFDbEIsVUFBTVMsT0FBTyxHQUFHVCxhQUFhLENBQUNVLGNBQWQsR0FBK0JDLG1CQUEvQixDQUFtREMsYUFBYSxDQUFDaEIsaUJBQUQsQ0FBaEUsRUFBcUZDLG9CQUFyRixDQUFoQjtBQUVBWSxNQUFBQSxPQUFPLENBQUNOLE9BQVIsQ0FBZ0IsVUFBU1UsUUFBVCxFQUFvQztBQUNuRG5CLFFBQUFBLGFBQWEsQ0FBQ29CLFFBQWQsQ0FBdUI7QUFDdEJDLFVBQUFBLFFBQVEsRUFBRTVCLFdBQVcsQ0FBQzBCLFFBQVEsQ0FBQ0UsUUFBVixDQURDO0FBRXRCQyxVQUFBQSxPQUFPLEVBQUVILFFBQVEsQ0FBQ0csT0FGSTtBQUd0QkMsVUFBQUEsT0FBTyxFQUFFO0FBQ1JDLFlBQUFBLEVBQUUsRUFBRUwsUUFBUSxDQUFDTTtBQURMO0FBSGEsU0FBdkI7QUFPQSxPQVJEO0FBU0E7QUFDRCxHQWhDTSIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiAke2NvcHlyaWdodH1cbiAqL1xuLyoqXG4gKiBEZWZpbmVzIHN1cHBvcnQgcnVsZXMgb2YgdGhlIE9iamVjdFBhZ2VIZWFkZXIgY29udHJvbCBvZiBzYXAudXhhcCBsaWJyYXJ5LlxuICovXG5pbXBvcnQgU3VwcG9ydExpYiBmcm9tIFwic2FwL3VpL3N1cHBvcnQvbGlicmFyeVwiO1xuaW1wb3J0IHsgSXNzdWVDYXRlZ29yeSwgSXNzdWVTZXZlcml0eSB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvSXNzdWVNYW5hZ2VyXCI7XG5pbXBvcnQgeyBJc3N1ZURlZmluaXRpb24gfSBmcm9tIFwic2FwL2ZlL2NvcmUvc3VwcG9ydC9EaWFnbm9zdGljc1wiO1xuaW1wb3J0IHsgQXBwQ29tcG9uZW50IH0gZnJvbSBcInNhcC9mZS9jb3JlXCI7XG5cbmV4cG9ydCBjb25zdCBDYXRlZ29yaWVzID0gU3VwcG9ydExpYi5DYXRlZ29yaWVzLCAvLyBBY2Nlc3NpYmlsaXR5LCBQZXJmb3JtYW5jZSwgTWVtb3J5LCAuLi5cblx0U2V2ZXJpdHkgPSBTdXBwb3J0TGliLlNldmVyaXR5LCAvLyBIaW50LCBXYXJuaW5nLCBFcnJvclxuXHRBdWRpZW5jZXMgPSBTdXBwb3J0TGliLkF1ZGllbmNlczsgLy8gQ29udHJvbCwgSW50ZXJuYWwsIEFwcGxpY2F0aW9uXG5cbi8vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gUnVsZSBEZWZpbml0aW9uc1xuLy8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbi8vIFJ1bGUgY2hlY2tzIGlmIG9iamVjdFBhZ2UgY29tcG9uZW50Q29udGFpbmVyIGhlaWdodCBpcyBzZXRcblxuZXhwb3J0IGNvbnN0IGdldFNldmVyaXR5ID0gZnVuY3Rpb24ob1NldmVyaXR5OiBJc3N1ZVNldmVyaXR5KSB7XG5cdHN3aXRjaCAob1NldmVyaXR5KSB7XG5cdFx0Y2FzZSBJc3N1ZVNldmVyaXR5Lkxvdzpcblx0XHRcdHJldHVybiBTZXZlcml0eS5Mb3c7XG5cdFx0Y2FzZSBJc3N1ZVNldmVyaXR5LkhpZ2g6XG5cdFx0XHRyZXR1cm4gU2V2ZXJpdHkuSGlnaDtcblx0XHRjYXNlIElzc3VlU2V2ZXJpdHkuTWVkaXVtOlxuXHRcdFx0cmV0dXJuIFNldmVyaXR5Lk1lZGl1bTtcblx0fVxufTtcblxuZXhwb3J0IGNvbnN0IGdldElzc3VlQnlDYXRlZ29yeSA9IGZ1bmN0aW9uKFxuXHRvSXNzdWVNYW5hZ2VyOiBhbnksXG5cdG9Db3JlRmFjYWRlOiBhbnkgLypvU2NvcGU6IGFueSovLFxuXHRpc3N1ZUNhdGVnb3J5VHlwZTogSXNzdWVDYXRlZ29yeSxcblx0aXNzdWVTdWJDYXRlZ29yeVR5cGU/OiBzdHJpbmdcbikge1xuXHRjb25zdCBtQ29tcG9uZW50cyA9IG9Db3JlRmFjYWRlLmdldENvbXBvbmVudHMoKTtcblx0bGV0IG9BcHBDb21wb25lbnQhOiBBcHBDb21wb25lbnQ7XG5cdE9iamVjdC5rZXlzKG1Db21wb25lbnRzKS5mb3JFYWNoKHNLZXkgPT4ge1xuXHRcdGNvbnN0IG9Db21wb25lbnQgPSBtQ29tcG9uZW50c1tzS2V5XTtcblx0XHRpZiAoXG5cdFx0XHRvQ29tcG9uZW50XG5cdFx0XHRcdD8uZ2V0TWV0YWRhdGEoKVxuXHRcdFx0XHQ/LmdldFBhcmVudCgpXG5cdFx0XHRcdD8uZ2V0TmFtZSgpID09PSBcInNhcC5mZS5jb3JlLkFwcENvbXBvbmVudFwiXG5cdFx0KSB7XG5cdFx0XHRvQXBwQ29tcG9uZW50ID0gb0NvbXBvbmVudDtcblx0XHR9XG5cdH0pO1xuXHRpZiAob0FwcENvbXBvbmVudCkge1xuXHRcdGNvbnN0IGFJc3N1ZXMgPSBvQXBwQ29tcG9uZW50LmdldERpYWdub3N0aWNzKCkuZ2V0SXNzdWVzQnlDYXRlZ29yeShJc3N1ZUNhdGVnb3J5W2lzc3VlQ2F0ZWdvcnlUeXBlXSwgaXNzdWVTdWJDYXRlZ29yeVR5cGUpO1xuXG5cdFx0YUlzc3Vlcy5mb3JFYWNoKGZ1bmN0aW9uKG9FbGVtZW50OiBJc3N1ZURlZmluaXRpb24pIHtcblx0XHRcdG9Jc3N1ZU1hbmFnZXIuYWRkSXNzdWUoe1xuXHRcdFx0XHRzZXZlcml0eTogZ2V0U2V2ZXJpdHkob0VsZW1lbnQuc2V2ZXJpdHkpLFxuXHRcdFx0XHRkZXRhaWxzOiBvRWxlbWVudC5kZXRhaWxzLFxuXHRcdFx0XHRjb250ZXh0OiB7XG5cdFx0XHRcdFx0aWQ6IG9FbGVtZW50LmNhdGVnb3J5XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG59O1xuIl19