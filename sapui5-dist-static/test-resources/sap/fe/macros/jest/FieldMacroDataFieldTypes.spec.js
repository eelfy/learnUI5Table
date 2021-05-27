sap.ui.define(["sap/fe/test/JestTemplatingHelper", "path"], function (JestTemplatingHelper, path) {
  "use strict";

  var compileCDS = JestTemplatingHelper.compileCDS;
  var getControlAttribute = JestTemplatingHelper.getControlAttribute;
  var getTemplatingResult = JestTemplatingHelper.getTemplatingResult;
  describe("MacroField - DataField Types - ", function () {
    var sMetadataUrl = compileCDS(path.join(__dirname, "./data/FieldMacroDataFieldTypes.cds"));
    var mBindingContexts = {
      "entitySet": "/Items"
    };
    describe("DataFieldForAnnotation - ", function () {
      it("Datapoint without visualization", function () {
        try {
          var xmlField = "<internalMacro:Field xmlns:internalMacro=\"sap.fe.macros.internal\"\n\t\t\t\t\t\t\t\t\tentitySet=\"{entitySet>}\"\n\t\t\t\t\t\t\t\t\tdataField=\"@com.sap.vocabularies.UI.v1.LineItem#DataPoint/0\"\n\t\t\t\t\t\t\t\t\t/>";
          return Promise.resolve(getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {})).then(function (domResult) {
            expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:ObjectStatus");
          });
        } catch (e) {
          return Promise.reject(e);
        }
      });
      it("Datapoint visualization Number", function () {
        try {
          var xmlField = "<internalMacro:Field xmlns:internalMacro=\"sap.fe.macros.internal\"\n\t\t\t\t\t\t\t\t\tentitySet=\"{entitySet>}\"\n\t\t\t\t\t\t\t\t\tdataField=\"@com.sap.vocabularies.UI.v1.LineItem#DataPoint/1\"\n\t\t\t\t\t\t\t\t\t/>";
          return Promise.resolve(getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {})).then(function (domResult) {
            expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:ObjectStatus");
          });
        } catch (e) {
          return Promise.reject(e);
        }
      });
      it("Datapoint visualization RatingIndicator", function () {
        try {
          var xmlField = "<internalMacro:Field xmlns:internalMacro=\"sap.fe.macros.internal\"\n\t\t\t\t\t\t\t\t\tentitySet=\"{entitySet>}\"\n\t\t\t\t\t\t\t\t\tdataField=\"@com.sap.vocabularies.UI.v1.LineItem#DataPoint/2\"\n\t\t\t\t\t\t\t\t\t/>";
          return Promise.resolve(getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {})).then(function (domResult) {
            expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:RatingIndicator");
          });
        } catch (e) {
          return Promise.reject(e);
        }
      });
      it("Datapoint visualization ProgressIndicator", function () {
        try {
          var xmlField = "<internalMacro:Field xmlns:internalMacro=\"sap.fe.macros.internal\"\n\t\t\t\t\t\t\t\t\tentitySet=\"{entitySet>}\"\n\t\t\t\t\t\t\t\t\tdataField=\"@com.sap.vocabularies.UI.v1.LineItem#DataPoint/3\"\n\t\t\t\t\t\t\t\t\t/>";
          return Promise.resolve(getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {})).then(function (domResult) {
            expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:ProgressIndicator");
          });
        } catch (e) {
          return Promise.reject(e);
        }
      });
      it("Contact", function () {
        try {
          var xmlField = "<internalMacro:Field xmlns:internalMacro=\"sap.fe.macros.internal\"\n\t\t\t\t\t\t\t\t\tentitySet=\"{entitySet>}\"\n\t\t\t\t\t\t\t\t\tdataField=\"@com.sap.vocabularies.UI.v1.LineItem#Contact/0\"\n\t\t\t\t\t\t\t\t\t/>";
          return Promise.resolve(getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {})).then(function (domResult) {
            expect(domResult).toHaveControl("/macros:FieldAPI/mdc:Field/mdc:fieldinfo/mdc:Link");
            expect(getControlAttribute("/macros:FieldAPI/mdc:Field/mdc:fieldinfo/mdc:Link", "binding", domResult)).toEqual("@com.sap.vocabularies.Communication.v1.Contact");
          });
        } catch (e) {
          return Promise.reject(e);
        }
      });
    });
    describe("DataFieldForAction - ", function () {
      it("Dummy dataFieldForAction", function () {
        try {
          var xmlField = "<internalMacro:Field xmlns:internalMacro=\"sap.fe.macros.internal\"\n\t\t\t\t\t\t\t\t\tentitySet=\"{entitySet>}\"\n\t\t\t\t\t\t\t\t\tdataField=\"@com.sap.vocabularies.UI.v1.LineItem#Action/0\"\n\t\t\t\t\t\t\t\t\t/>";
          return Promise.resolve(getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {})).then(function (domResult) {
            expect(domResult).toHaveControl("/macros:FieldAPI/m:Button");
            expect(getControlAttribute("/macros:FieldAPI/m:Button", "text", domResult)).toEqual("Dummy Action");
          });
        } catch (e) {
          return Promise.reject(e);
        }
      });
    });
    describe("DataFieldWithNavigationPath - ", function () {
      it("simple one", function () {
        try {
          var xmlField = "<internalMacro:Field xmlns:internalMacro=\"sap.fe.macros.internal\"\n\t\t\t\t\t\t\t\t\tentitySet=\"{entitySet>}\"\n\t\t\t\t\t\t\t\t\tdataField=\"@com.sap.vocabularies.UI.v1.LineItem#NavigationPath/0\"\n\t\t\t\t\t\t\t\t\t/>";
          return Promise.resolve(getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {})).then(function (domResult) {
            expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:Link");
            expect(getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:Link", "press", domResult)).toEqual("FieldRuntime.onDataFieldWithNavigationPath(${$source>/}, $controller, 'toSubItems')");
          });
        } catch (e) {
          return Promise.reject(e);
        }
      });
    });
    describe("DataFieldForIntentBasedNavigation - ", function () {
      it("simple one", function () {
        try {
          var xmlField = "<internalMacro:Field xmlns:internalMacro=\"sap.fe.macros.internal\"\n\t\t\t\t\t\t\t\t\tentitySet=\"{entitySet>}\"\n\t\t\t\t\t\t\t\t\tdataField=\"@com.sap.vocabularies.UI.v1.LineItem#IntentBasedNav/0\"\n\t\t\t\t\t\t\t\t\t/>";
          return Promise.resolve(getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {})).then(function (domResult) {
            expect(domResult).toHaveControl("/macros:FieldAPI/m:Button");
            expect(getControlAttribute("/macros:FieldAPI/m:Button", "press", domResult)).toEqual("._intentBasedNavigation.navigate('SubItems', 'test', { navigationContexts: ${$source>/}.getBindingContext()})");
            expect(getControlAttribute("/macros:FieldAPI/m:Button", "text", domResult)).toEqual("Intent");
          });
        } catch (e) {
          return Promise.reject(e);
        }
      });
    });
  });
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZpZWxkTWFjcm9EYXRhRmllbGRUeXBlcy5zcGVjLnRzIl0sIm5hbWVzIjpbImRlc2NyaWJlIiwic01ldGFkYXRhVXJsIiwiY29tcGlsZUNEUyIsInBhdGgiLCJqb2luIiwiX19kaXJuYW1lIiwibUJpbmRpbmdDb250ZXh0cyIsIml0IiwieG1sRmllbGQiLCJnZXRUZW1wbGF0aW5nUmVzdWx0IiwiZG9tUmVzdWx0IiwiZXhwZWN0IiwidG9IYXZlQ29udHJvbCIsImdldENvbnRyb2xBdHRyaWJ1dGUiLCJ0b0VxdWFsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFJQUEsRUFBQUEsUUFBUSxDQUFDLGlDQUFELEVBQW9DLFlBQU07QUFDakQsUUFBTUMsWUFBWSxHQUFHQyxVQUFVLENBQUNDLElBQUksQ0FBQ0MsSUFBTCxDQUFVQyxTQUFWLEVBQXFCLHFDQUFyQixDQUFELENBQS9CO0FBQ0EsUUFBTUMsZ0JBQWdCLEdBQUc7QUFDeEIsbUJBQWE7QUFEVyxLQUF6QjtBQUdBTixJQUFBQSxRQUFRLENBQUMsMkJBQUQsRUFBOEIsWUFBTTtBQUMzQ08sTUFBQUEsRUFBRSxDQUFDLGlDQUFEO0FBQUEsWUFBZ0Q7QUFDakQsY0FBTUMsUUFBUSw4TkFBZDtBQURpRCxpQ0FLekJDLG1CQUFtQixDQUFDRCxRQUFELEVBQVdQLFlBQVgsRUFBeUJLLGdCQUF6QixFQUEyQyxFQUEzQyxDQUxNLGlCQUszQ0ksU0FMMkM7QUFNakRDLFlBQUFBLE1BQU0sQ0FBQ0QsU0FBRCxDQUFOLENBQWtCRSxhQUFsQixDQUFnQyw2RUFBaEM7QUFOaUQ7QUFPakQsU0FQQztBQUFBO0FBQUE7QUFBQSxRQUFGO0FBUUFMLE1BQUFBLEVBQUUsQ0FBQyxnQ0FBRDtBQUFBLFlBQStDO0FBQ2hELGNBQU1DLFFBQVEsOE5BQWQ7QUFEZ0QsaUNBS3hCQyxtQkFBbUIsQ0FBQ0QsUUFBRCxFQUFXUCxZQUFYLEVBQXlCSyxnQkFBekIsRUFBMkMsRUFBM0MsQ0FMSyxpQkFLMUNJLFNBTDBDO0FBTWhEQyxZQUFBQSxN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QUFFLENBQUMsWUFBRDtBQUFBLFlBQTJCO0FBQzVCLGNBQU1DLFFBQVEsbU9BQWQ7QUFENEIsaUNBS0pDLG1CQUFtQixDQUFDRCxRQUFELEVBQVdQLFlBQVgsRUFBeUJLLGdCQUF6QixFQUEyQyxFQUEzQyxDQUxmLGlCQUt0QkksU0FMc0I7QUFNNUJDLFlBQUFBLE1BQU0sQ0FBQ0QsU0FBRCxDQUFOLENBQWtCRSxhQUFsQixDQUFnQywyQkFBaEM7QUFDQUQsWUFBQUEsTUFBTSxDQUFDRSxtQkFBbUIsQ0FBQywyQkFBRCxFQUE4QixPQUE5QixFQUF1Q0gsU0FBdkMsQ0FBcEIsQ0FBTixDQUE2RUksT0FBN0UsQ0FDQywrR0FERDtBQUdBSCxZQUFBQSxNQUFNLENBQUNFLG1CQUFtQixDQUFDLDJCQUFELEVBQThCLE1BQTlCLEVBQXNDSCxTQUF0QyxDQUFwQixDQUFOLENBQTRFSSxPQUE1RSxDQUFvRixRQUFwRjtBQVY0QjtBQVc1QixTQVhDO0FBQUE7QUFBQTtBQUFBLFFBQUY7QUFZQSxLQWJPLENBQVI7QUFjQSxHQTFGTyxDQUFSIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXRUZW1wbGF0aW5nUmVzdWx0LCBnZXRDb250cm9sQXR0cmlidXRlLCBjb21waWxlQ0RTLCBzZXJpYWxpemVYTUwgfSBmcm9tIFwic2FwL2ZlL3Rlc3QvSmVzdFRlbXBsYXRpbmdIZWxwZXJcIjtcblxuaW1wb3J0ICogYXMgcGF0aCBmcm9tIFwicGF0aFwiO1xuXG5kZXNjcmliZShcIk1hY3JvRmllbGQgLSBEYXRhRmllbGQgVHlwZXMgLSBcIiwgKCkgPT4ge1xuXHRjb25zdCBzTWV0YWRhdGFVcmwgPSBjb21waWxlQ0RTKHBhdGguam9pbihfX2Rpcm5hbWUsIFwiLi9kYXRhL0ZpZWxkTWFjcm9EYXRhRmllbGRUeXBlcy5jZHNcIikpO1xuXHRjb25zdCBtQmluZGluZ0NvbnRleHRzID0ge1xuXHRcdFwiZW50aXR5U2V0XCI6IFwiL0l0ZW1zXCJcblx0fTtcblx0ZGVzY3JpYmUoXCJEYXRhRmllbGRGb3JBbm5vdGF0aW9uIC0gXCIsICgpID0+IHtcblx0XHRpdChcIkRhdGFwb2ludCB3aXRob3V0IHZpc3VhbGl6YXRpb25cIiwgYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgeG1sRmllbGQgPSBgPGludGVybmFsTWFjcm86RmllbGQgeG1sbnM6aW50ZXJuYWxNYWNybz1cInNhcC5mZS5tYWNyb3MuaW50ZXJuYWxcIlxuXHRcdFx0XHRcdFx0XHRcdFx0ZW50aXR5U2V0PVwie2VudGl0eVNldD59XCJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGFGaWVsZD1cIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5MaW5lSXRlbSNEYXRhUG9pbnQvMFwiXG5cdFx0XHRcdFx0XHRcdFx0XHQvPmA7XG5cdFx0XHRjb25zdCBkb21SZXN1bHQgPSBhd2FpdCBnZXRUZW1wbGF0aW5nUmVzdWx0KHhtbEZpZWxkLCBzTWV0YWRhdGFVcmwsIG1CaW5kaW5nQ29udGV4dHMsIHt9KTtcblx0XHRcdGV4cGVjdChkb21SZXN1bHQpLnRvSGF2ZUNvbnRyb2woXCIvbWFjcm9zOkZpZWxkQVBJL2NvbnRyb2w6RmllbGRXcmFwcGVyL2NvbnRyb2w6Y29udGVudERpc3BsYXkvbTpPYmplY3RTdGF0dXNcIik7XG5cdFx0fSk7XG5cdFx0aXQoXCJEYXRhcG9pbnQgdmlzdWFsaXphdGlvbiBOdW1iZXJcIiwgYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgeG1sRmllbGQgPSBgPGludGVybmFsTWFjcm86RmllbGQgeG1sbnM6aW50ZXJuYWxNYWNybz1cInNhcC5mZS5tYWNyb3MuaW50ZXJuYWxcIlxuXHRcdFx0XHRcdFx0XHRcdFx0ZW50aXR5U2V0PVwie2VudGl0eVNldD59XCJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGFGaWVsZD1cIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5MaW5lSXRlbSNEYXRhUG9pbnQvMVwiXG5cdFx0XHRcdFx0XHRcdFx0XHQvPmA7XG5cdFx0XHRjb25zdCBkb21SZXN1bHQgPSBhd2FpdCBnZXRUZW1wbGF0aW5nUmVzdWx0KHhtbEZpZWxkLCBzTWV0YWRhdGFVcmwsIG1CaW5kaW5nQ29udGV4dHMsIHt9KTtcblx0XHRcdGV4cGVjdChkb21SZXN1bHQpLnRvSGF2ZUNvbnRyb2woXCIvbWFjcm9zOkZpZWxkQVBJL2NvbnRyb2w6RmllbGRXcmFwcGVyL2NvbnRyb2w6Y29udGVudERpc3BsYXkvbTpPYmplY3RTdGF0dXNcIik7XG5cdFx0fSk7XG5cdFx0aXQoXCJEYXRhcG9pbnQgdmlzdWFsaXphdGlvbiBSYXRpbmdJbmRpY2F0b3JcIiwgYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgeG1sRmllbGQgPSBgPGludGVybmFsTWFjcm86RmllbGQgeG1sbnM6aW50ZXJuYWxNYWNybz1cInNhcC5mZS5tYWNyb3MuaW50ZXJuYWxcIlxuXHRcdFx0XHRcdFx0XHRcdFx0ZW50aXR5U2V0PVwie2VudGl0eVNldD59XCJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGFGaWVsZD1cIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5MaW5lSXRlbSNEYXRhUG9pbnQvMlwiXG5cdFx0XHRcdFx0XHRcdFx0XHQvPmA7XG5cdFx0XHRjb25zdCBkb21SZXN1bHQgPSBhd2FpdCBnZXRUZW1wbGF0aW5nUmVzdWx0KHhtbEZpZWxkLCBzTWV0YWRhdGFVcmwsIG1CaW5kaW5nQ29udGV4dHMsIHt9KTtcblx0XHRcdGV4cGVjdChkb21SZXN1bHQpLnRvSGF2ZUNvbnRyb2woXCIvbWFjcm9zOkZpZWxkQVBJL2NvbnRyb2w6RmllbGRXcmFwcGVyL2NvbnRyb2w6Y29udGVudERpc3BsYXkvbTpSYXRpbmdJbmRpY2F0b3JcIik7XG5cdFx0fSk7XG5cdFx0aXQoXCJEYXRhcG9pbnQgdmlzdWFsaXphdGlvbiBQcm9ncmVzc0luZGljYXRvclwiLCBhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCB4bWxGaWVsZCA9IGA8aW50ZXJuYWxNYWNybzpGaWVsZCB4bWxuczppbnRlcm5hbE1hY3JvPVwic2FwLmZlLm1hY3Jvcy5pbnRlcm5hbFwiXG5cdFx0XHRcdFx0XHRcdFx0XHRlbnRpdHlTZXQ9XCJ7ZW50aXR5U2V0Pn1cIlxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUZpZWxkPVwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkxpbmVJdGVtI0RhdGFQb2ludC8zXCJcblx0XHRcdFx0XHRcdFx0XHRcdC8+YDtcblx0XHRcdGNvbnN0IGRvbVJlc3VsdCA9IGF3YWl0IGdldFRlbXBsYXRpbmdSZXN1bHQoeG1sRmllbGQsIHNNZXRhZGF0YVVybCwgbUJpbmRpbmdDb250ZXh0cywge30pO1xuXHRcdFx0ZXhwZWN0KGRvbVJlc3VsdCkudG9IYXZlQ29udHJvbChcIi9tYWNyb3M6RmllbGRBUEkvY29udHJvbDpGaWVsZFdyYXBwZXIvY29udHJvbDpjb250ZW50RGlzcGxheS9tOlByb2dyZXNzSW5kaWNhdG9yXCIpO1xuXHRcdH0pO1xuXHRcdGl0KFwiQ29udGFjdFwiLCBhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCB4bWxGaWVsZCA9IGA8aW50ZXJuYWxNYWNybzpGaWVsZCB4bWxuczppbnRlcm5hbE1hY3JvPVwic2FwLmZlLm1hY3Jvcy5pbnRlcm5hbFwiXG5cdFx0XHRcdFx0XHRcdFx0XHRlbnRpdHlTZXQ9XCJ7ZW50aXR5U2V0Pn1cIlxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUZpZWxkPVwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkxpbmVJdGVtI0NvbnRhY3QvMFwiXG5cdFx0XHRcdFx0XHRcdFx0XHQvPmA7XG5cdFx0XHRjb25zdCBkb21SZXN1bHQgPSBhd2FpdCBnZXRUZW1wbGF0aW5nUmVzdWx0KHhtbEZpZWxkLCBzTWV0YWRhdGFVcmwsIG1CaW5kaW5nQ29udGV4dHMsIHt9KTtcblx0XHRcdGV4cGVjdChkb21SZXN1bHQpLnRvSGF2ZUNvbnRyb2woXCIvbWFjcm9zOkZpZWxkQVBJL21kYzpGaWVsZC9tZGM6ZmllbGRpbmZvL21kYzpMaW5rXCIpO1xuXHRcdFx0ZXhwZWN0KGdldENvbnRyb2xBdHRyaWJ1dGUoXCIvbWFjcm9zOkZpZWxkQVBJL21kYzpGaWVsZC9tZGM6ZmllbGRpbmZvL21kYzpMaW5rXCIsIFwiYmluZGluZ1wiLCBkb21SZXN1bHQpKS50b0VxdWFsKFxuXHRcdFx0XHRcIkBjb20uc2FwLnZvY2FidWxhcmllcy5Db21tdW5pY2F0aW9uLnYxLkNvbnRhY3RcIlxuXHRcdFx0KTtcblx0XHR9KTtcblx0fSk7XG5cdGRlc2NyaWJlKFwiRGF0YUZpZWxkRm9yQWN0aW9uIC0gXCIsICgpID0+IHtcblx0XHRpdChcIkR1bW15IGRhdGFGaWVsZEZvckFjdGlvblwiLCBhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCB4bWxGaWVsZCA9IGA8aW50ZXJuYWxNYWNybzpGaWVsZCB4bWxuczppbnRlcm5hbE1hY3JvPVwic2FwLmZlLm1hY3Jvcy5pbnRlcm5hbFwiXG5cdFx0XHRcdFx0XHRcdFx0XHRlbnRpdHlTZXQ9XCJ7ZW50aXR5U2V0Pn1cIlxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUZpZWxkPVwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkxpbmVJdGVtI0FjdGlvbi8wXCJcblx0XHRcdFx0XHRcdFx0XHRcdC8+YDtcblx0XHRcdGNvbnN0IGRvbVJlc3VsdCA9IGF3YWl0IGdldFRlbXBsYXRpbmdSZXN1bHQoeG1sRmllbGQsIHNNZXRhZGF0YVVybCwgbUJpbmRpbmdDb250ZXh0cywge30pO1xuXHRcdFx0ZXhwZWN0KGRvbVJlc3VsdCkudG9IYXZlQ29udHJvbChcIi9tYWNyb3M6RmllbGRBUEkvbTpCdXR0b25cIik7XG5cdFx0XHRleHBlY3QoZ2V0Q29udHJvbEF0dHJpYnV0ZShcIi9tYWNyb3M6RmllbGRBUEkvbTpCdXR0b25cIiwgXCJ0ZXh0XCIsIGRvbVJlc3VsdCkpLnRvRXF1YWwoXCJEdW1teSBBY3Rpb25cIik7XG5cdFx0fSk7XG5cdH0pO1xuXG5cdGRlc2NyaWJlKFwiRGF0YUZpZWxkV2l0aE5hdmlnYXRpb25QYXRoIC0gXCIsICgpID0+IHtcblx0XHRpdChcInNpbXBsZSBvbmVcIiwgYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgeG1sRmllbGQgPSBgPGludGVybmFsTWFjcm86RmllbGQgeG1sbnM6aW50ZXJuYWxNYWNybz1cInNhcC5mZS5tYWNyb3MuaW50ZXJuYWxcIlxuXHRcdFx0XHRcdFx0XHRcdFx0ZW50aXR5U2V0PVwie2VudGl0eVNldD59XCJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGFGaWVsZD1cIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5MaW5lSXRlbSNOYXZpZ2F0aW9uUGF0aC8wXCJcblx0XHRcdFx0XHRcdFx0XHRcdC8+YDtcblx0XHRcdGNvbnN0IGRvbVJlc3VsdCA9IGF3YWl0IGdldFRlbXBsYXRpbmdSZXN1bHQoeG1sRmllbGQsIHNNZXRhZGF0YVVybCwgbUJpbmRpbmdDb250ZXh0cywge30pO1xuXHRcdFx0ZXhwZWN0KGRvbVJlc3VsdCkudG9IYXZlQ29udHJvbChcIi9tYWNyb3M6RmllbGRBUEkvY29udHJvbDpGaWVsZFdyYXBwZXIvY29udHJvbDpjb250ZW50RGlzcGxheS9tOkxpbmtcIik7XG5cdFx0XHRleHBlY3QoZ2V0Q29udHJvbEF0dHJpYnV0ZShcIi9tYWNyb3M6RmllbGRBUEkvY29udHJvbDpGaWVsZFdyYXBwZXIvY29udHJvbDpjb250ZW50RGlzcGxheS9tOkxpbmtcIiwgXCJwcmVzc1wiLCBkb21SZXN1bHQpKS50b0VxdWFsKFxuXHRcdFx0XHRcIkZpZWxkUnVudGltZS5vbkRhdGFGaWVsZFdpdGhOYXZpZ2F0aW9uUGF0aCgkeyRzb3VyY2U+L30sICRjb250cm9sbGVyLCAndG9TdWJJdGVtcycpXCJcblx0XHRcdCk7XG5cdFx0fSk7XG5cdH0pO1xuXG5cdGRlc2NyaWJlKFwiRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uIC0gXCIsICgpID0+IHtcblx0XHRpdChcInNpbXBsZSBvbmVcIiwgYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgeG1sRmllbGQgPSBgPGludGVybmFsTWFjcm86RmllbGQgeG1sbnM6aW50ZXJuYWxNYWNybz1cInNhcC5mZS5tYWNyb3MuaW50ZXJuYWxcIlxuXHRcdFx0XHRcdFx0XHRcdFx0ZW50aXR5U2V0PVwie2VudGl0eVNldD59XCJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGFGaWVsZD1cIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5MaW5lSXRlbSNJbnRlbnRCYXNlZE5hdi8wXCJcblx0XHRcdFx0XHRcdFx0XHRcdC8+YDtcblx0XHRcdGNvbnN0IGRvbVJlc3VsdCA9IGF3YWl0IGdldFRlbXBsYXRpbmdSZXN1bHQoeG1sRmllbGQsIHNNZXRhZGF0YVVybCwgbUJpbmRpbmdDb250ZXh0cywge30pO1xuXHRcdFx0ZXhwZWN0KGRvbVJlc3VsdCkudG9IYXZlQ29udHJvbChcIi9tYWNyb3M6RmllbGRBUEkvbTpCdXR0b25cIik7XG5cdFx0XHRleHBlY3QoZ2V0Q29udHJvbEF0dHJpYnV0ZShcIi9tYWNyb3M6RmllbGRBUEkvbTpCdXR0b25cIiwgXCJwcmVzc1wiLCBkb21SZXN1bHQpKS50b0VxdWFsKFxuXHRcdFx0XHRcIi5faW50ZW50QmFzZWROYXZpZ2F0aW9uLm5hdmlnYXRlKCdTdWJJdGVtcycsICd0ZXN0JywgeyBuYXZpZ2F0aW9uQ29udGV4dHM6ICR7JHNvdXJjZT4vfS5nZXRCaW5kaW5nQ29udGV4dCgpfSlcIlxuXHRcdFx0KTtcblx0XHRcdGV4cGVjdChnZXRDb250cm9sQXR0cmlidXRlKFwiL21hY3JvczpGaWVsZEFQSS9tOkJ1dHRvblwiLCBcInRleHRcIiwgZG9tUmVzdWx0KSkudG9FcXVhbChcIkludGVudFwiKTtcblx0XHR9KTtcblx0fSk7XG59KTtcbiJdfQ==