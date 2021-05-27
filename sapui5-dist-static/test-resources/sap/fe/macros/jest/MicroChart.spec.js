sap.ui.define(["sap/fe/test/JestTemplatingHelper", "sap/fe/macros/MicroChart.metadata", "path"], function (JestTemplatingHelper, MicroChartMetadata, path) {
  "use strict";

  var registerMacro = JestTemplatingHelper.registerMacro;
  var compileCDS = JestTemplatingHelper.compileCDS;
  var getControlAttribute = JestTemplatingHelper.getControlAttribute;
  var getTemplatingResult = JestTemplatingHelper.getTemplatingResult;
  describe("MicroChart", function () {
    beforeAll(function () {
      registerMacro(MicroChartMetadata);
    });
    var sMetadataUrl = compileCDS(path.join(__dirname, "./data/MicroChart.cds"));
    var mBindingContexts = {
      "collection": "/Items",
      "chartAnnotation": "/Items/$Type/@com.sap.vocabularies.UI.v1.Chart#RadialChart"
    };
    it("Bullet", function () {
      try {
        var xml = "<macro:MicroChart xmlns:macro=\"sap.fe.macros\"\n\t\t\t\t\t\tcollection=\"{collection>}\"\n\t\t\t\t\t\tchartAnnotation=\"{chartAnnotation>}\"\n\t\t/>";
        return Promise.resolve(getTemplatingResult(xml, sMetadataUrl, mBindingContexts, {})).then(function (domResult) {
          expect(domResult).toHaveControl("/macroMicroChart:MicroChartContainer/microChart:BulletMicroChart");
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    it("Bullet for Analytics", function () {
      try {
        var xml = "<macro:MicroChart xmlns:macro=\"sap.fe.macros\"\n\t\t\t\t\t\tcollection=\"{collection>}\"\n\t\t\t\t\t\tchartAnnotation=\"{chartAnnotation>}\"\n\t\t\t\t\t\tisAnalytics=\"true\"\n\t\t/>";
        return Promise.resolve(getTemplatingResult(xml, sMetadataUrl, mBindingContexts, {})).then(function (domResult) {
          expect(domResult).toHaveControl("/control:ConditionalWrapper/control:contentTrue/macroMicroChart:MicroChartContainer");
          expect(domResult).toHaveControl("/control:ConditionalWrapper/control:contentFalse/m:Text");
          expect(getControlAttribute("/control:ConditionalWrapper", "condition", domResult)).toEqual("{= !!%{unit1}}");
          var currencyContentTrue = getControlAttribute("/control:ConditionalWrapper/control:contentTrue/macroMicroChart:MicroChartContainer", "uomPath", domResult);
          expect(currencyContentTrue).toEqual("unit1");
          expect(currencyContentTrue).not.toBeFalsy();
          var currencyContentFalse = getControlAttribute("/control:ConditionalWrapper/control:contentFalse/m:Text", "text", domResult);
          expect(currencyContentFalse).toEqual("*");
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1pY3JvQ2hhcnQuc3BlYy50cyJdLCJuYW1lcyI6WyJkZXNjcmliZSIsImJlZm9yZUFsbCIsInJlZ2lzdGVyTWFjcm8iLCJNaWNyb0NoYXJ0TWV0YWRhdGEiLCJzTWV0YWRhdGFVcmwiLCJjb21waWxlQ0RTIiwicGF0aCIsImpvaW4iLCJfX2Rpcm5hbWUiLCJtQmluZGluZ0NvbnRleHRzIiwiaXQiLCJ4bWwiLCJnZXRUZW1wbGF0aW5nUmVzdWx0IiwiZG9tUmVzdWx0IiwiZXhwZWN0IiwidG9IYXZlQ29udHJvbCIsImdldENvbnRyb2xBdHRyaWJ1dGUiLCJ0b0VxdWFsIiwiY3VycmVuY3lDb250ZW50VHJ1ZSIsIm5vdCIsInRvQmVGYWxzeSIsImN1cnJlbmN5Q29udGVudEZhbHNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBSUFBLEVBQUFBLFFBQVEsQ0FBQyxZQUFELEVBQWUsWUFBTTtBQUM1QkMsSUFBQUEsU0FBUyxDQUFDLFlBQU07QUFDZkMsTUFBQUEsYUFBYSxDQUFDQyxrQkFBRCxDQUFiO0FBQ0EsS0FGUSxDQUFUO0FBR0EsUUFBTUMsWUFBWSxHQUFHQyxVQUFVLENBQUNDLElBQUksQ0FBQ0MsSUFBTCxDQUFVQyxTQUFWLEVBQXFCLHVCQUFyQixDQUFELENBQS9CO0FBQ0EsUUFBTUMsZ0JBQWdCLEdBQUc7QUFDeEIsb0JBQWMsUUFEVTtBQUV4Qix5QkFBbUI7QUFGSyxLQUF6QjtBQUtBQyxJQUFBQSxFQUFFLENBQUMsUUFBRDtBQUFBLFVBQXVCO0FBQ3hCLFlBQU1DLEdBQUcsMEpBQVQ7QUFEd0IsK0JBS0FDLG1CQUFtQixDQUFDRCxHQUFELEVBQU1QLFlBQU4sRUFBb0JLLGdCQUFwQixFQUFzQyxFQUF0QyxDQUxuQixpQkFLbEJJLFNBTGtCO0FBTXhCQyxVQUFBQSxNQUFNLENBQUNELFNBQUQsQ0FBTixDQUFrQkUsYUFBbEIsQ0FBZ0Msa0VBQWhDO0FBTndCO0FBT3hCLE9BUEM7QUFBQTtBQUFBO0FBQUEsTUFBRjtBQVNBTCxJQUFBQSxFQUFFLENBQUMsc0JBQUQ7QUFBQSxVQUFxQztBQUN0QyxZQUFNQyxHQUFHLDRMQUFUO0FBRHNDLCtCQU1kQyxtQkFBbUIsQ0FBQ0QsR0FBRCxFQUFNUCxZQUFOLEVBQW9CSyxnQkFBcEIsRUFBc0MsRUFBdEMsQ0FOTCxpQkFNaENJLFNBTmdDO0FBT3RDQyxVQUFBQSxNQUFNLENBQUNELFNBQUQsQ0FBTixDQUFrQkUsYUFBbEIsQ0FBZ0MscUZBQWhDO0FBQ0FELFVBQUFBLE1BQU0sQ0FBQ0QsU0FBRCxDQUFOLENBQWtCRSxhQUFsQixDQUFnQyx5REFBaEM7QUFFQUQsVUFBQUEsTUFBTSxDQUFDRSxtQkFBbUIsQ0FBQyw2QkFBRCxFQUFnQyxXQUFoQyxFQUE2Q0gsU0FBN0MsQ0FBcEIsQ0FBTixDQUFtRkksT0FBbkYsQ0FBMkYsZ0JBQTNGO0FBQ0EsY0FBTUMsbUJBQW1CLEdBQUdGLG1CQUFtQixDQUM5QyxxRkFEOEMsRUFFOUMsU0FGOEMsRUFHOUNILFNBSDhDLENBQS9DO0FBS0FDLFVBQUFBLE1BQU0sQ0FBQ0ksbUJBQUQsQ0FBTixDQUE0QkQsT0FBNUIsQ0FBb0MsT0FBcEM7QUFDQUgsVUFBQUEsTUFBTSxDQUFDSSxtQkFBRCxDQUFOLENBQTRCQyxHQUE1QixDQUFnQ0MsU0FBaEM7QUFFQSxjQUFNQyxvQkFBb0IsR0FBR0wsbUJBQW1CLENBQUMseURBQUQsRUFBNEQsTUFBNUQsRUFBb0VILFNBQXBFLENBQWhEO0FBQ0FDLFVBQUFBLE1BQU0sQ0FBQ08sb0JBQUQsQ0FBTixDQUE2QkosT0FBN0IsQ0FBcUMsR0FBckM7QUFwQnNDO0FBcUJ0QyxPQXJCQztBQUFBO0FBQUE7QUFBQSxNQUFGO0FBc0JBLEdBekNPLENBQVIiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldFRlbXBsYXRpbmdSZXN1bHQsIGdldENvbnRyb2xBdHRyaWJ1dGUsIGNvbXBpbGVDRFMsIHNlcmlhbGl6ZVhNTCwgcmVnaXN0ZXJNYWNybyB9IGZyb20gXCJzYXAvZmUvdGVzdC9KZXN0VGVtcGxhdGluZ0hlbHBlclwiO1xuaW1wb3J0IE1pY3JvQ2hhcnRNZXRhZGF0YSBmcm9tIFwic2FwL2ZlL21hY3Jvcy9NaWNyb0NoYXJ0Lm1ldGFkYXRhXCI7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCI7XG5cbmRlc2NyaWJlKFwiTWljcm9DaGFydFwiLCAoKSA9PiB7XG5cdGJlZm9yZUFsbCgoKSA9PiB7XG5cdFx0cmVnaXN0ZXJNYWNybyhNaWNyb0NoYXJ0TWV0YWRhdGEpO1xuXHR9KTtcblx0Y29uc3Qgc01ldGFkYXRhVXJsID0gY29tcGlsZUNEUyhwYXRoLmpvaW4oX19kaXJuYW1lLCBcIi4vZGF0YS9NaWNyb0NoYXJ0LmNkc1wiKSk7XG5cdGNvbnN0IG1CaW5kaW5nQ29udGV4dHMgPSB7XG5cdFx0XCJjb2xsZWN0aW9uXCI6IFwiL0l0ZW1zXCIsXG5cdFx0XCJjaGFydEFubm90YXRpb25cIjogXCIvSXRlbXMvJFR5cGUvQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkNoYXJ0I1JhZGlhbENoYXJ0XCJcblx0fTtcblxuXHRpdChcIkJ1bGxldFwiLCBhc3luYyAoKSA9PiB7XG5cdFx0Y29uc3QgeG1sID0gYDxtYWNybzpNaWNyb0NoYXJ0IHhtbG5zOm1hY3JvPVwic2FwLmZlLm1hY3Jvc1wiXG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uPVwie2NvbGxlY3Rpb24+fVwiXG5cdFx0XHRcdFx0XHRjaGFydEFubm90YXRpb249XCJ7Y2hhcnRBbm5vdGF0aW9uPn1cIlxuXHRcdC8+YDtcblx0XHRjb25zdCBkb21SZXN1bHQgPSBhd2FpdCBnZXRUZW1wbGF0aW5nUmVzdWx0KHhtbCwgc01ldGFkYXRhVXJsLCBtQmluZGluZ0NvbnRleHRzLCB7fSk7XG5cdFx0ZXhwZWN0KGRvbVJlc3VsdCkudG9IYXZlQ29udHJvbChcIi9tYWNyb01pY3JvQ2hhcnQ6TWljcm9DaGFydENvbnRhaW5lci9taWNyb0NoYXJ0OkJ1bGxldE1pY3JvQ2hhcnRcIik7XG5cdH0pO1xuXG5cdGl0KFwiQnVsbGV0IGZvciBBbmFseXRpY3NcIiwgYXN5bmMgKCkgPT4ge1xuXHRcdGNvbnN0IHhtbCA9IGA8bWFjcm86TWljcm9DaGFydCB4bWxuczptYWNybz1cInNhcC5mZS5tYWNyb3NcIlxuXHRcdFx0XHRcdFx0Y29sbGVjdGlvbj1cIntjb2xsZWN0aW9uPn1cIlxuXHRcdFx0XHRcdFx0Y2hhcnRBbm5vdGF0aW9uPVwie2NoYXJ0QW5ub3RhdGlvbj59XCJcblx0XHRcdFx0XHRcdGlzQW5hbHl0aWNzPVwidHJ1ZVwiXG5cdFx0Lz5gO1xuXHRcdGNvbnN0IGRvbVJlc3VsdCA9IGF3YWl0IGdldFRlbXBsYXRpbmdSZXN1bHQoeG1sLCBzTWV0YWRhdGFVcmwsIG1CaW5kaW5nQ29udGV4dHMsIHt9KTtcblx0XHRleHBlY3QoZG9tUmVzdWx0KS50b0hhdmVDb250cm9sKFwiL2NvbnRyb2w6Q29uZGl0aW9uYWxXcmFwcGVyL2NvbnRyb2w6Y29udGVudFRydWUvbWFjcm9NaWNyb0NoYXJ0Ok1pY3JvQ2hhcnRDb250YWluZXJcIik7XG5cdFx0ZXhwZWN0KGRvbVJlc3VsdCkudG9IYXZlQ29udHJvbChcIi9jb250cm9sOkNvbmRpdGlvbmFsV3JhcHBlci9jb250cm9sOmNvbnRlbnRGYWxzZS9tOlRleHRcIik7XG5cblx0XHRleHBlY3QoZ2V0Q29udHJvbEF0dHJpYnV0ZShcIi9jb250cm9sOkNvbmRpdGlvbmFsV3JhcHBlclwiLCBcImNvbmRpdGlvblwiLCBkb21SZXN1bHQpKS50b0VxdWFsKFwiez0gISEle3VuaXQxfX1cIik7XG5cdFx0Y29uc3QgY3VycmVuY3lDb250ZW50VHJ1ZSA9IGdldENvbnRyb2xBdHRyaWJ1dGUoXG5cdFx0XHRcIi9jb250cm9sOkNvbmRpdGlvbmFsV3JhcHBlci9jb250cm9sOmNvbnRlbnRUcnVlL21hY3JvTWljcm9DaGFydDpNaWNyb0NoYXJ0Q29udGFpbmVyXCIsXG5cdFx0XHRcInVvbVBhdGhcIixcblx0XHRcdGRvbVJlc3VsdFxuXHRcdCk7XG5cdFx0ZXhwZWN0KGN1cnJlbmN5Q29udGVudFRydWUpLnRvRXF1YWwoXCJ1bml0MVwiKTtcblx0XHRleHBlY3QoY3VycmVuY3lDb250ZW50VHJ1ZSkubm90LnRvQmVGYWxzeSgpO1xuXG5cdFx0Y29uc3QgY3VycmVuY3lDb250ZW50RmFsc2UgPSBnZXRDb250cm9sQXR0cmlidXRlKFwiL2NvbnRyb2w6Q29uZGl0aW9uYWxXcmFwcGVyL2NvbnRyb2w6Y29udGVudEZhbHNlL206VGV4dFwiLCBcInRleHRcIiwgZG9tUmVzdWx0KTtcblx0XHRleHBlY3QoY3VycmVuY3lDb250ZW50RmFsc2UpLnRvRXF1YWwoXCIqXCIpO1xuXHR9KTtcbn0pO1xuIl19