//@ui5-bundle sap/fe/core/library-preload.support.js
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */
/**
 * Adds support rules of the sap.fe.core library to the support infrastructure.
 */
sap.ui.predefine('sap/fe/core/library.support',
	[
		"./support/AnnotationIssue.support",
		"./support/CollectionFacetMissingID.support",
		"./support/CollectionFacetUnsupportedLevel.support"
	],
	function(AnnotationIssue, CollectionFacetMissingID, CollectionFacetUnsupportedLevel) {
		"use strict";

		sap.ui.support.SystemPresets.FeV4 = {
			id: "FioriElementsV4",
			title: "Fiori Elements V4",
			description: "Fiori Elements V4 rules",
			selections: [{ ruleId: "annotationIssue", libName: "sap.fe.core" }]
		};

		return {
			name: "sap.fe.core",
			niceName: "SAP.FE V4 - Core library",
			ruleset: [AnnotationIssue.getRules(), CollectionFacetMissingID.getRules(), CollectionFacetUnsupportedLevel.getRules()]
		};
	},
	true
);
sap.ui.predefine('sap/fe/core/support/AnnotationIssue.support',["sap/fe/core/support/CommonHelper", "sap/fe/core/converters/helpers/IssueManager"], function (CommonHelper, IssueManager) {
  "use strict";

  var _exports = {};
  var IssueCategory = IssueManager.IssueCategory;
  var Audiences = CommonHelper.Audiences;
  var getIssueByCategory = CommonHelper.getIssueByCategory;
  var Categories = CommonHelper.Categories;
  var oAnnotationIssue = {
    id: "annotationIssue",
    title: "Annotations: Incorrect path or target",
    minversion: "1.85",
    audiences: [Audiences.Application],
    categories: [Categories.Usage],
    description: "This rule identifies the incorrect path or targets defined in the metadata of the annotation.xml file or CDS annotations.",
    resolution: "Please review the message details for more information.",
    resolutionurls: [{
      "text": "CDS Annotations reference",
      "href": "https://cap.cloud.sap/docs/cds/common"
    }],
    check: function (oIssueManager, oCoreFacade)
    /*oScope: any*/
    {
      getIssueByCategory(oIssueManager, oCoreFacade, IssueCategory.Annotation);
    }
  };

  function getRules() {
    return [oAnnotationIssue];
  }

  _exports.getRules = getRules;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFubm90YXRpb25Jc3N1ZS5zdXBwb3J0LnRzIl0sIm5hbWVzIjpbIm9Bbm5vdGF0aW9uSXNzdWUiLCJpZCIsInRpdGxlIiwibWludmVyc2lvbiIsImF1ZGllbmNlcyIsIkF1ZGllbmNlcyIsIkFwcGxpY2F0aW9uIiwiY2F0ZWdvcmllcyIsIkNhdGVnb3JpZXMiLCJVc2FnZSIsImRlc2NyaXB0aW9uIiwicmVzb2x1dGlvbiIsInJlc29sdXRpb251cmxzIiwiY2hlY2siLCJvSXNzdWVNYW5hZ2VyIiwib0NvcmVGYWNhZGUiLCJnZXRJc3N1ZUJ5Q2F0ZWdvcnkiLCJJc3N1ZUNhdGVnb3J5IiwiQW5ub3RhdGlvbiIsImdldFJ1bGVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUdBLE1BQU1BLGdCQUFnQixHQUFHO0FBQ3hCQyxJQUFBQSxFQUFFLEVBQUUsaUJBRG9CO0FBRXhCQyxJQUFBQSxLQUFLLEVBQUUsdUNBRmlCO0FBR3hCQyxJQUFBQSxVQUFVLEVBQUUsTUFIWTtBQUl4QkMsSUFBQUEsU0FBUyxFQUFFLENBQUNDLFNBQVMsQ0FBQ0MsV0FBWCxDQUphO0FBS3hCQyxJQUFBQSxVQUFVLEVBQUUsQ0FBQ0MsVUFBVSxDQUFDQyxLQUFaLENBTFk7QUFNeEJDLElBQUFBLFdBQVcsRUFDViwySEFQdUI7QUFReEJDLElBQUFBLFVBQVUsRUFBRSx5REFSWTtBQVN4QkMsSUFBQUEsY0FBYyxFQUFFLENBQUM7QUFBRSxjQUFRLDJCQUFWO0FBQXVDLGNBQVE7QUFBL0MsS0FBRCxDQVRRO0FBVXhCQyxJQUFBQSxLQUFLLEVBQUUsVUFBU0MsYUFBVCxFQUE2QkMsV0FBN0I7QUFBOEM7QUFBaUI7QUFDckVDLE1BQUFBLGtCQUFrQixDQUFDRixhQUFELEVBQWdCQyxXQUFoQixFQUE2QkUsYUFBYSxDQUFDQyxVQUEzQyxDQUFsQjtBQUNBO0FBWnVCLEdBQXpCOztBQWNPLFdBQVNDLFFBQVQsR0FBb0I7QUFDMUIsV0FBTyxDQUFDbkIsZ0JBQUQsQ0FBUDtBQUNBIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDYXRlZ29yaWVzLCBnZXRJc3N1ZUJ5Q2F0ZWdvcnksIEF1ZGllbmNlcyB9IGZyb20gXCJzYXAvZmUvY29yZS9zdXBwb3J0L0NvbW1vbkhlbHBlclwiO1xuaW1wb3J0IHsgSXNzdWVDYXRlZ29yeSB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvSXNzdWVNYW5hZ2VyXCI7XG5cbmNvbnN0IG9Bbm5vdGF0aW9uSXNzdWUgPSB7XG5cdGlkOiBcImFubm90YXRpb25Jc3N1ZVwiLFxuXHR0aXRsZTogXCJBbm5vdGF0aW9uczogSW5jb3JyZWN0IHBhdGggb3IgdGFyZ2V0XCIsXG5cdG1pbnZlcnNpb246IFwiMS44NVwiLFxuXHRhdWRpZW5jZXM6IFtBdWRpZW5jZXMuQXBwbGljYXRpb25dLFxuXHRjYXRlZ29yaWVzOiBbQ2F0ZWdvcmllcy5Vc2FnZV0sXG5cdGRlc2NyaXB0aW9uOlxuXHRcdFwiVGhpcyBydWxlIGlkZW50aWZpZXMgdGhlIGluY29ycmVjdCBwYXRoIG9yIHRhcmdldHMgZGVmaW5lZCBpbiB0aGUgbWV0YWRhdGEgb2YgdGhlIGFubm90YXRpb24ueG1sIGZpbGUgb3IgQ0RTIGFubm90YXRpb25zLlwiLFxuXHRyZXNvbHV0aW9uOiBcIlBsZWFzZSByZXZpZXcgdGhlIG1lc3NhZ2UgZGV0YWlscyBmb3IgbW9yZSBpbmZvcm1hdGlvbi5cIixcblx0cmVzb2x1dGlvbnVybHM6IFt7IFwidGV4dFwiOiBcIkNEUyBBbm5vdGF0aW9ucyByZWZlcmVuY2VcIiwgXCJocmVmXCI6IFwiaHR0cHM6Ly9jYXAuY2xvdWQuc2FwL2RvY3MvY2RzL2NvbW1vblwiIH1dLFxuXHRjaGVjazogZnVuY3Rpb24ob0lzc3VlTWFuYWdlcjogYW55LCBvQ29yZUZhY2FkZTogYW55IC8qb1Njb3BlOiBhbnkqLykge1xuXHRcdGdldElzc3VlQnlDYXRlZ29yeShvSXNzdWVNYW5hZ2VyLCBvQ29yZUZhY2FkZSwgSXNzdWVDYXRlZ29yeS5Bbm5vdGF0aW9uKTtcblx0fVxufTtcbmV4cG9ydCBmdW5jdGlvbiBnZXRSdWxlcygpIHtcblx0cmV0dXJuIFtvQW5ub3RhdGlvbklzc3VlXTtcbn1cbiJdfQ==
sap.ui.predefine('sap/fe/core/support/CollectionFacetMissingID.support',["sap/fe/core/support/CommonHelper", "sap/fe/core/converters/helpers/IssueManager"], function (CommonHelper, IssueManager) {
  "use strict";

  var _exports = {};
  var IssueCategory = IssueManager.IssueCategory;
  var Audiences = CommonHelper.Audiences;
  var getIssueByCategory = CommonHelper.getIssueByCategory;
  var Categories = CommonHelper.Categories;
  var oCollectionFacetMissingIDIssue = {
    id: "collectionFacetMissingId",
    title: "CollectionFacet: Missing IDs",
    minversion: "1.85",
    audiences: [Audiences.Application],
    categories: [Categories.Usage],
    description: "A collection facet requires an ID in the annotation file to derive a control ID from it.",
    resolution: "Always provide a unique ID to a collection facet.",
    resolutionurls: [{
      "text": "CollectionFacets",
      "href": "https://ui5.sap.com/#/topic/facfea09018d4376acaceddb7e3f03b6"
    }],
    check: function (oIssueManager, oCoreFacade)
    /*oScope: any*/
    {
      getIssueByCategory(oIssueManager, oCoreFacade, IssueCategory.Facets, "MissingID");
    }
  };

  function getRules() {
    return [oCollectionFacetMissingIDIssue];
  }

  _exports.getRules = getRules;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbGxlY3Rpb25GYWNldE1pc3NpbmdJRC5zdXBwb3J0LnRzIl0sIm5hbWVzIjpbIm9Db2xsZWN0aW9uRmFjZXRNaXNzaW5nSURJc3N1ZSIsImlkIiwidGl0bGUiLCJtaW52ZXJzaW9uIiwiYXVkaWVuY2VzIiwiQXVkaWVuY2VzIiwiQXBwbGljYXRpb24iLCJjYXRlZ29yaWVzIiwiQ2F0ZWdvcmllcyIsIlVzYWdlIiwiZGVzY3JpcHRpb24iLCJyZXNvbHV0aW9uIiwicmVzb2x1dGlvbnVybHMiLCJjaGVjayIsIm9Jc3N1ZU1hbmFnZXIiLCJvQ29yZUZhY2FkZSIsImdldElzc3VlQnlDYXRlZ29yeSIsIklzc3VlQ2F0ZWdvcnkiLCJGYWNldHMiLCJnZXRSdWxlcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFFQSxNQUFNQSw4QkFBOEIsR0FBRztBQUN0Q0MsSUFBQUEsRUFBRSxFQUFFLDBCQURrQztBQUV0Q0MsSUFBQUEsS0FBSyxFQUFFLDhCQUYrQjtBQUd0Q0MsSUFBQUEsVUFBVSxFQUFFLE1BSDBCO0FBSXRDQyxJQUFBQSxTQUFTLEVBQUUsQ0FBQ0MsU0FBUyxDQUFDQyxXQUFYLENBSjJCO0FBS3RDQyxJQUFBQSxVQUFVLEVBQUUsQ0FBQ0MsVUFBVSxDQUFDQyxLQUFaLENBTDBCO0FBTXRDQyxJQUFBQSxXQUFXLEVBQUUsMEZBTnlCO0FBT3RDQyxJQUFBQSxVQUFVLEVBQUUsbURBUDBCO0FBUXRDQyxJQUFBQSxjQUFjLEVBQUUsQ0FBQztBQUFFLGNBQVEsa0JBQVY7QUFBOEIsY0FBUTtBQUF0QyxLQUFELENBUnNCO0FBU3RDQyxJQUFBQSxLQUFLLEVBQUUsVUFBU0MsYUFBVCxFQUE2QkMsV0FBN0I7QUFBOEM7QUFBaUI7QUFDckVDLE1BQUFBLGtCQUFrQixDQUFDRixhQUFELEVBQWdCQyxXQUFoQixFQUE2QkUsYUFBYSxDQUFDQyxNQUEzQyxFQUFtRCxXQUFuRCxDQUFsQjtBQUNBO0FBWHFDLEdBQXZDOztBQWFPLFdBQVNDLFFBQVQsR0FBb0I7QUFDMUIsV0FBTyxDQUFDbkIsOEJBQUQsQ0FBUDtBQUNBIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDYXRlZ29yaWVzLCBnZXRJc3N1ZUJ5Q2F0ZWdvcnksIEF1ZGllbmNlcyB9IGZyb20gXCJzYXAvZmUvY29yZS9zdXBwb3J0L0NvbW1vbkhlbHBlclwiO1xuaW1wb3J0IHsgSXNzdWVDYXRlZ29yeSB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvSXNzdWVNYW5hZ2VyXCI7XG5jb25zdCBvQ29sbGVjdGlvbkZhY2V0TWlzc2luZ0lESXNzdWUgPSB7XG5cdGlkOiBcImNvbGxlY3Rpb25GYWNldE1pc3NpbmdJZFwiLFxuXHR0aXRsZTogXCJDb2xsZWN0aW9uRmFjZXQ6IE1pc3NpbmcgSURzXCIsXG5cdG1pbnZlcnNpb246IFwiMS44NVwiLFxuXHRhdWRpZW5jZXM6IFtBdWRpZW5jZXMuQXBwbGljYXRpb25dLFxuXHRjYXRlZ29yaWVzOiBbQ2F0ZWdvcmllcy5Vc2FnZV0sXG5cdGRlc2NyaXB0aW9uOiBcIkEgY29sbGVjdGlvbiBmYWNldCByZXF1aXJlcyBhbiBJRCBpbiB0aGUgYW5ub3RhdGlvbiBmaWxlIHRvIGRlcml2ZSBhIGNvbnRyb2wgSUQgZnJvbSBpdC5cIixcblx0cmVzb2x1dGlvbjogXCJBbHdheXMgcHJvdmlkZSBhIHVuaXF1ZSBJRCB0byBhIGNvbGxlY3Rpb24gZmFjZXQuXCIsXG5cdHJlc29sdXRpb251cmxzOiBbeyBcInRleHRcIjogXCJDb2xsZWN0aW9uRmFjZXRzXCIsIFwiaHJlZlwiOiBcImh0dHBzOi8vdWk1LnNhcC5jb20vIy90b3BpYy9mYWNmZWEwOTAxOGQ0Mzc2YWNhY2VkZGI3ZTNmMDNiNlwiIH1dLFxuXHRjaGVjazogZnVuY3Rpb24ob0lzc3VlTWFuYWdlcjogYW55LCBvQ29yZUZhY2FkZTogYW55IC8qb1Njb3BlOiBhbnkqLykge1xuXHRcdGdldElzc3VlQnlDYXRlZ29yeShvSXNzdWVNYW5hZ2VyLCBvQ29yZUZhY2FkZSwgSXNzdWVDYXRlZ29yeS5GYWNldHMsIFwiTWlzc2luZ0lEXCIpO1xuXHR9XG59O1xuZXhwb3J0IGZ1bmN0aW9uIGdldFJ1bGVzKCkge1xuXHRyZXR1cm4gW29Db2xsZWN0aW9uRmFjZXRNaXNzaW5nSURJc3N1ZV07XG59XG4iXX0=
sap.ui.predefine('sap/fe/core/support/CollectionFacetUnsupportedLevel.support',["sap/fe/core/support/CommonHelper", "sap/fe/core/converters/helpers/IssueManager"], function (CommonHelper, IssueManager) {
  "use strict";

  var _exports = {};
  var IssueCategory = IssueManager.IssueCategory;
  var Audiences = CommonHelper.Audiences;
  var getIssueByCategory = CommonHelper.getIssueByCategory;
  var Categories = CommonHelper.Categories;
  var oCollectionFacetUnsupportedLevelIssue = {
    id: "collectionFacetUnsupportedLevel",
    title: "CollectionFacet: Unsupported Levels",
    minversion: "1.86",
    audiences: [Audiences.Application],
    categories: [Categories.Usage],
    description: "Collection facets at level 3 or lower (level 4, 5…) are not supported and will not be visible on the UI.",
    resolution: "At level 3 you can only use reference facets, but not collection facets.",
    resolutionurls: [{
      "text": "CollectionFacets",
      "href": "https://ui5.sap.com/#/topic/facfea09018d4376acaceddb7e3f03b6"
    }],
    check: function (oIssueManager, oCoreFacade)
    /*oScope: any*/
    {
      getIssueByCategory(oIssueManager, oCoreFacade, IssueCategory.Facets, "UnsupportedLevel");
    }
  };

  function getRules() {
    return [oCollectionFacetUnsupportedLevelIssue];
  }

  _exports.getRules = getRules;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbGxlY3Rpb25GYWNldFVuc3VwcG9ydGVkTGV2ZWwuc3VwcG9ydC50cyJdLCJuYW1lcyI6WyJvQ29sbGVjdGlvbkZhY2V0VW5zdXBwb3J0ZWRMZXZlbElzc3VlIiwiaWQiLCJ0aXRsZSIsIm1pbnZlcnNpb24iLCJhdWRpZW5jZXMiLCJBdWRpZW5jZXMiLCJBcHBsaWNhdGlvbiIsImNhdGVnb3JpZXMiLCJDYXRlZ29yaWVzIiwiVXNhZ2UiLCJkZXNjcmlwdGlvbiIsInJlc29sdXRpb24iLCJyZXNvbHV0aW9udXJscyIsImNoZWNrIiwib0lzc3VlTWFuYWdlciIsIm9Db3JlRmFjYWRlIiwiZ2V0SXNzdWVCeUNhdGVnb3J5IiwiSXNzdWVDYXRlZ29yeSIsIkZhY2V0cyIsImdldFJ1bGVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUVBLE1BQU1BLHFDQUFxQyxHQUFHO0FBQzdDQyxJQUFBQSxFQUFFLEVBQUUsaUNBRHlDO0FBRTdDQyxJQUFBQSxLQUFLLEVBQUUscUNBRnNDO0FBRzdDQyxJQUFBQSxVQUFVLEVBQUUsTUFIaUM7QUFJN0NDLElBQUFBLFNBQVMsRUFBRSxDQUFDQyxTQUFTLENBQUNDLFdBQVgsQ0FKa0M7QUFLN0NDLElBQUFBLFVBQVUsRUFBRSxDQUFDQyxVQUFVLENBQUNDLEtBQVosQ0FMaUM7QUFNN0NDLElBQUFBLFdBQVcsRUFBRSwwR0FOZ0M7QUFPN0NDLElBQUFBLFVBQVUsRUFBRSwwRUFQaUM7QUFRN0NDLElBQUFBLGNBQWMsRUFBRSxDQUFDO0FBQUUsY0FBUSxrQkFBVjtBQUE4QixjQUFRO0FBQXRDLEtBQUQsQ0FSNkI7QUFTN0NDLElBQUFBLEtBQUssRUFBRSxVQUFTQyxhQUFULEVBQTZCQyxXQUE3QjtBQUE4QztBQUFpQjtBQUNyRUMsTUFBQUEsa0JBQWtCLENBQUNGLGFBQUQsRUFBZ0JDLFdBQWhCLEVBQTZCRSxhQUFhLENBQUNDLE1BQTNDLEVBQW1ELGtCQUFuRCxDQUFsQjtBQUNBO0FBWDRDLEdBQTlDOztBQWFPLFdBQVNDLFFBQVQsR0FBb0I7QUFDMUIsV0FBTyxDQUFDbkIscUNBQUQsQ0FBUDtBQUNBIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDYXRlZ29yaWVzLCBnZXRJc3N1ZUJ5Q2F0ZWdvcnksIEF1ZGllbmNlcyB9IGZyb20gXCJzYXAvZmUvY29yZS9zdXBwb3J0L0NvbW1vbkhlbHBlclwiO1xuaW1wb3J0IHsgSXNzdWVDYXRlZ29yeSB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvSXNzdWVNYW5hZ2VyXCI7XG5jb25zdCBvQ29sbGVjdGlvbkZhY2V0VW5zdXBwb3J0ZWRMZXZlbElzc3VlID0ge1xuXHRpZDogXCJjb2xsZWN0aW9uRmFjZXRVbnN1cHBvcnRlZExldmVsXCIsXG5cdHRpdGxlOiBcIkNvbGxlY3Rpb25GYWNldDogVW5zdXBwb3J0ZWQgTGV2ZWxzXCIsXG5cdG1pbnZlcnNpb246IFwiMS44NlwiLFxuXHRhdWRpZW5jZXM6IFtBdWRpZW5jZXMuQXBwbGljYXRpb25dLFxuXHRjYXRlZ29yaWVzOiBbQ2F0ZWdvcmllcy5Vc2FnZV0sXG5cdGRlc2NyaXB0aW9uOiBcIkNvbGxlY3Rpb24gZmFjZXRzIGF0IGxldmVsIDMgb3IgbG93ZXIgKGxldmVsIDQsIDXigKYpIGFyZSBub3Qgc3VwcG9ydGVkIGFuZCB3aWxsIG5vdCBiZSB2aXNpYmxlIG9uIHRoZSBVSS5cIixcblx0cmVzb2x1dGlvbjogXCJBdCBsZXZlbCAzIHlvdSBjYW4gb25seSB1c2UgcmVmZXJlbmNlIGZhY2V0cywgYnV0IG5vdCBjb2xsZWN0aW9uIGZhY2V0cy5cIixcblx0cmVzb2x1dGlvbnVybHM6IFt7IFwidGV4dFwiOiBcIkNvbGxlY3Rpb25GYWNldHNcIiwgXCJocmVmXCI6IFwiaHR0cHM6Ly91aTUuc2FwLmNvbS8jL3RvcGljL2ZhY2ZlYTA5MDE4ZDQzNzZhY2FjZWRkYjdlM2YwM2I2XCIgfV0sXG5cdGNoZWNrOiBmdW5jdGlvbihvSXNzdWVNYW5hZ2VyOiBhbnksIG9Db3JlRmFjYWRlOiBhbnkgLypvU2NvcGU6IGFueSovKSB7XG5cdFx0Z2V0SXNzdWVCeUNhdGVnb3J5KG9Jc3N1ZU1hbmFnZXIsIG9Db3JlRmFjYWRlLCBJc3N1ZUNhdGVnb3J5LkZhY2V0cywgXCJVbnN1cHBvcnRlZExldmVsXCIpO1xuXHR9XG59O1xuZXhwb3J0IGZ1bmN0aW9uIGdldFJ1bGVzKCkge1xuXHRyZXR1cm4gW29Db2xsZWN0aW9uRmFjZXRVbnN1cHBvcnRlZExldmVsSXNzdWVdO1xufVxuIl19
//# sourceMappingURL=library-preload.support.js.map