sap.ui.define(["sap/fe/test/JestTemplatingHelper", "path"], function (JestTemplatingHelper, path) {
  "use strict";

  var compileCDS = JestTemplatingHelper.compileCDS;
  var getControlAttribute = JestTemplatingHelper.getControlAttribute;
  var getTemplatingResult = JestTemplatingHelper.getTemplatingResult;
  describe("MacroField for a value help", function () {
    var sMetadataUrl = compileCDS(path.join(__dirname, "./data/FieldMacroWithValueHelp.cds"));
    var mBindingContexts = {
      "entitySet": "/Items"
    };
    it("with a navigation property as a property", function () {
      try {
        var xmlField = "<internalMacro:Field xmlns:internalMacro=\"sap.fe.macros.internal\"\n\t\t\t\t\t\t\t\t\tentitySet=\"{entitySet>}\"\n\t\t\t\t\t\t\t\t\tdataField=\"toSubItems/subvhReference\"\n\t\t\t\t\t\t\t\t\tvhIdPrefix=\"VH\"\n\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t</internalMacro:Field>";
        return Promise.resolve(getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {})).then(function (domResult) {
          expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/mdc:Field");
          expect(getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/mdc:Field", "fieldHelp", domResult)).toEqual("VH::toSubItems::subvhReference");
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    it("with a navigation property as a property and a flexId", function () {
      try {
        var xmlField = "<internalMacro:Field xmlns:internalMacro=\"sap.fe.macros.internal\"\n\t\t\t\t\t\t\t\t\t_flexId=\"MyCustomFlexID\"\n\t\t\t\t\t\t\t\t\tentitySet=\"{entitySet>}\"\n\t\t\t\t\t\t\t\t\tdataField=\"toSubItems/subvhReference\"\n\t\t\t\t\t\t\t\t\tvhIdPrefix=\"VH\"\n\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t</internalMacro:Field>";
        return Promise.resolve(getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {})).then(function (domResult) {
          expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/mdc:Field");
          expect(getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/mdc:Field", "fieldHelp", domResult)).toEqual("MyCustomFlexID-content_VH");
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    it("with a navigation property as a datafield", function () {
      try {
        var xmlField = "<internalMacro:Field xmlns:internalMacro=\"sap.fe.macros.internal\"\n\t\t\t\t\t\t\t\t\tentitySet=\"{entitySet>}\"\n\t\t\t\t\t\t\t\t\tdataField=\"@com.sap.vocabularies.UI.v1.LineItem/1\"\n\t\t\t\t\t\t\t\t\tvhIdPrefix=\"VH\"\n\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t</internalMacro:Field>";
        return Promise.resolve(getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {})).then(function (domResult) {
          expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/mdc:Field");
          expect(getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/mdc:Field", "fieldHelp", domResult)).toEqual("VH::toSubItems::subvhReference");
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    it("with a navigation property as a datafield and a flexId", function () {
      try {
        var xmlField = "<internalMacro:Field xmlns:internalMacro=\"sap.fe.macros.internal\"\n\t\t\t\t\t\t\t\t\t_flexId=\"MyCustomFlexID\"\n\t\t\t\t\t\t\t\t\tentitySet=\"{entitySet>}\"\n\t\t\t\t\t\t\t\t\tdataField=\"@com.sap.vocabularies.UI.v1.LineItem/1\"\n\t\t\t\t\t\t\t\t\tvhIdPrefix=\"VH\"\n\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t</internalMacro:Field>";
        return Promise.resolve(getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {})).then(function (domResult) {
          expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/mdc:Field");
          expect(getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/mdc:Field", "fieldHelp", domResult)).toEqual("MyCustomFlexID-content_VH");
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZpZWxkTWFjcm9XaXRoVmFsdWVIZWxwLnNwZWMudHMiXSwibmFtZXMiOlsiZGVzY3JpYmUiLCJzTWV0YWRhdGFVcmwiLCJjb21waWxlQ0RTIiwicGF0aCIsImpvaW4iLCJfX2Rpcm5hbWUiLCJtQmluZGluZ0NvbnRleHRzIiwiaXQiLCJ4bWxGaWVsZCIsImdldFRlbXBsYXRpbmdSZXN1bHQiLCJkb21SZXN1bHQiLCJleHBlY3QiLCJ0b0hhdmVDb250cm9sIiwiZ2V0Q29udHJvbEF0dHJpYnV0ZSIsInRvRXF1YWwiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUlBQSxFQUFBQSxRQUFRLENBQUMsNkJBQUQsRUFBZ0MsWUFBTTtBQUM3QyxRQUFNQyxZQUFZLEdBQUdDLFVBQVUsQ0FBQ0MsSUFBSSxDQUFDQyxJQUFMLENBQVVDLFNBQVYsRUFBcUIsb0NBQXJCLENBQUQsQ0FBL0I7QUFDQSxRQUFNQyxnQkFBZ0IsR0FBRztBQUN4QixtQkFBYTtBQURXLEtBQXpCO0FBSUFDLElBQUFBLEVBQUUsQ0FBQywwQ0FBRDtBQUFBLFVBQXlEO0FBQzFELFlBQU1DLFFBQVEscVJBQWQ7QUFEMEQsK0JBUWxDQyxtQkFBbUIsQ0FBQ0QsUUFBRCxFQUFXUCxZQUFYLEVBQXlCSyxnQkFBekIsRUFBMkMsRUFBM0MsQ0FSZSxpQkFRcERJLFNBUm9EO0FBUzFEQyxVQUFBQSxNQUFNLENBQUNELFNBQUQsQ0FBTixDQUFrQkUsYUFBbEIsQ0FBZ0MscUVBQWhDO0FBQ0FELFVBQUFBLE1BQU0sQ0FBQ0UsbUJBQW1CLENBQUMscUVBQUQsRUFBd0UsV0FBeEUsRUFBcUZILFNBQXJGLENBQXBCLENBQU4sQ0FBMkhJLE9BQTNILENBQ0MsZ0NBREQ7QUFWMEQ7QUFhMUQsT0FiQztBQUFBO0FBQUE7QUFBQSxNQUFGO0FBZUFQLElBQUFBLEVBQUUsQ0FBQyx1REFBRDtBQUFBLFVBQXNFO0FBQ3ZFLFlBQU1DLFFBQVEsbVVBQWQ7QUFEdUUsK0JBUy9DQyxtQkFBbUIsQ0FBQ0QsUUFBRCxFQUFXUCxZQUFYLEVBQXlCSyxnQkFBekIsRUFBMkMsRUFBM0MsQ0FUNEIsaUJBU2pFSSxTQVRpRTtBQVV2RUMsVUFBQUEsTUFBTSxDQUFDRCxTQUFELENBQU4sQ0FBa0JFLGFBQWxCLENBQWdDLHFFQUFoQztBQUNBRCxVQUFBQSxNQUFNLENBQUNFLG1CQUFtQixDQUFDLHFFQUFELEVBQXdFLFdBQXhFLEVBQXFGSCxTQUFyRixDQUFwQixDQUFOLENBQTJISSxPQUEzSCxDQUNDLDJCQUREO0FBWHVFO0FBY3ZFLE9BZEM7QUFBQTtBQUFBO0FBQUEsTUFBRjtBQWdCQVAsSUFBQUEsRUFBRSxDQUFDLDJDQUFEO0FBQUEsVUFBMEQ7QUFDM0QsWUFBTUMsUUFBUSxrU0FBZDtBQUQyRCwrQkFRbkNDLG1CQUFtQixDQUFDRCxRQUFELEVBQVdQLFlBQVgsRUFBeUJLLGdCQUF6QixFQUEyQyxFQUEzQyxDQVJnQixpQkFRckRJLFNBUnFEO0FBUzNEQyxVQUFBQSxNQUFNLENBQUNELFNBQUQsQ0FBTixDQUFrQkUsYUFBbEIsQ0FBZ0MscUVBQWhDO0FBQ0FELFVBQUFBLE1BQU0sQ0FBQ0UsbUJBQW1CLENBQUMscUVBQUQsRUFBd0UsV0FBeEUsRUFBcUZILFNBQXJGLENBQXBCLENBQU4sQ0FBMkhJLE9BQTNILENBQ0MsZ0NBREQ7QUFWMkQ7QUFhM0QsT0FiQztBQUFBO0FBQUE7QUFBQSxNQUFGO0FBZUFQLElBQUFBLEVBQUUsQ0FBQyx3REFBRDtBQUFBLFVBQXVFO0FBQ3hFLFlBQU1DLFFBQVEsZ1ZBQWQ7QUFEd0UsK0JBU2hEQyxtQkFBbUIsQ0FBQ0QsUUFBRCxFQUFXUCxZQUFYLEVBQXlCSyxnQkFBekIsRUFBMkMsRUFBM0MsQ0FUNkIsaUJBU2xFSSxTQVRrRTtBQVV4RUMsVUFBQUEsTUFBTSxDQUFDRCxTQUFELENBQU4sQ0FBa0JFLGFBQWxCLENBQWdDLHFFQUFoQztBQUNBRCxVQUFBQSxNQUFNLENBQUNFLG1CQUFtQixDQUFDLHFFQUFELEVBQXdFLFdBQXhFLEVBQXFGSCxTQUFyRixDQUFwQixDQUFOLENBQTJISSxPQUEzSCxDQUNDLDJCQUREO0FBWHdFO0FBY3hFLE9BZEM7QUFBQTtBQUFBO0FBQUEsTUFBRjtBQWVBLEdBbkVPLENBQVIiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldFRlbXBsYXRpbmdSZXN1bHQsIGdldENvbnRyb2xBdHRyaWJ1dGUsIGNvbXBpbGVDRFMsIHNlcmlhbGl6ZVhNTCB9IGZyb20gXCJzYXAvZmUvdGVzdC9KZXN0VGVtcGxhdGluZ0hlbHBlclwiO1xuXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCI7XG5cbmRlc2NyaWJlKFwiTWFjcm9GaWVsZCBmb3IgYSB2YWx1ZSBoZWxwXCIsICgpID0+IHtcblx0Y29uc3Qgc01ldGFkYXRhVXJsID0gY29tcGlsZUNEUyhwYXRoLmpvaW4oX19kaXJuYW1lLCBcIi4vZGF0YS9GaWVsZE1hY3JvV2l0aFZhbHVlSGVscC5jZHNcIikpO1xuXHRjb25zdCBtQmluZGluZ0NvbnRleHRzID0ge1xuXHRcdFwiZW50aXR5U2V0XCI6IFwiL0l0ZW1zXCJcblx0fTtcblxuXHRpdChcIndpdGggYSBuYXZpZ2F0aW9uIHByb3BlcnR5IGFzIGEgcHJvcGVydHlcIiwgYXN5bmMgKCkgPT4ge1xuXHRcdGNvbnN0IHhtbEZpZWxkID0gYDxpbnRlcm5hbE1hY3JvOkZpZWxkIHhtbG5zOmludGVybmFsTWFjcm89XCJzYXAuZmUubWFjcm9zLmludGVybmFsXCJcblx0XHRcdFx0XHRcdFx0XHRcdGVudGl0eVNldD1cIntlbnRpdHlTZXQ+fVwiXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhRmllbGQ9XCJ0b1N1Ykl0ZW1zL3N1YnZoUmVmZXJlbmNlXCJcblx0XHRcdFx0XHRcdFx0XHRcdHZoSWRQcmVmaXg9XCJWSFwiXG5cdFx0XHRcdFx0XHRcdFx0XHQ+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8L2ludGVybmFsTWFjcm86RmllbGQ+YDtcblxuXHRcdGNvbnN0IGRvbVJlc3VsdCA9IGF3YWl0IGdldFRlbXBsYXRpbmdSZXN1bHQoeG1sRmllbGQsIHNNZXRhZGF0YVVybCwgbUJpbmRpbmdDb250ZXh0cywge30pO1xuXHRcdGV4cGVjdChkb21SZXN1bHQpLnRvSGF2ZUNvbnRyb2woXCIvbWFjcm9zOkZpZWxkQVBJL2NvbnRyb2w6RmllbGRXcmFwcGVyL2NvbnRyb2w6Y29udGVudEVkaXQvbWRjOkZpZWxkXCIpO1xuXHRcdGV4cGVjdChnZXRDb250cm9sQXR0cmlidXRlKFwiL21hY3JvczpGaWVsZEFQSS9jb250cm9sOkZpZWxkV3JhcHBlci9jb250cm9sOmNvbnRlbnRFZGl0L21kYzpGaWVsZFwiLCBcImZpZWxkSGVscFwiLCBkb21SZXN1bHQpKS50b0VxdWFsKFxuXHRcdFx0XCJWSDo6dG9TdWJJdGVtczo6c3VidmhSZWZlcmVuY2VcIlxuXHRcdCk7XG5cdH0pO1xuXG5cdGl0KFwid2l0aCBhIG5hdmlnYXRpb24gcHJvcGVydHkgYXMgYSBwcm9wZXJ0eSBhbmQgYSBmbGV4SWRcIiwgYXN5bmMgKCkgPT4ge1xuXHRcdGNvbnN0IHhtbEZpZWxkID0gYDxpbnRlcm5hbE1hY3JvOkZpZWxkIHhtbG5zOmludGVybmFsTWFjcm89XCJzYXAuZmUubWFjcm9zLmludGVybmFsXCJcblx0XHRcdFx0XHRcdFx0XHRcdF9mbGV4SWQ9XCJNeUN1c3RvbUZsZXhJRFwiXG5cdFx0XHRcdFx0XHRcdFx0XHRlbnRpdHlTZXQ9XCJ7ZW50aXR5U2V0Pn1cIlxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUZpZWxkPVwidG9TdWJJdGVtcy9zdWJ2aFJlZmVyZW5jZVwiXG5cdFx0XHRcdFx0XHRcdFx0XHR2aElkUHJlZml4PVwiVkhcIlxuXHRcdFx0XHRcdFx0XHRcdFx0PlxuXHRcdFx0XHRcdFx0XHRcdFx0PC9pbnRlcm5hbE1hY3JvOkZpZWxkPmA7XG5cblx0XHRjb25zdCBkb21SZXN1bHQgPSBhd2FpdCBnZXRUZW1wbGF0aW5nUmVzdWx0KHhtbEZpZWxkLCBzTWV0YWRhdGFVcmwsIG1CaW5kaW5nQ29udGV4dHMsIHt9KTtcblx0XHRleHBlY3QoZG9tUmVzdWx0KS50b0hhdmVDb250cm9sKFwiL21hY3JvczpGaWVsZEFQSS9jb250cm9sOkZpZWxkV3JhcHBlci9jb250cm9sOmNvbnRlbnRFZGl0L21kYzpGaWVsZFwiKTtcblx0XHRleHBlY3QoZ2V0Q29udHJvbEF0dHJpYnV0ZShcIi9tYWNyb3M6RmllbGRBUEkvY29udHJvbDpGaWVsZFdyYXBwZXIvY29udHJvbDpjb250ZW50RWRpdC9tZGM6RmllbGRcIiwgXCJmaWVsZEhlbHBcIiwgZG9tUmVzdWx0KSkudG9FcXVhbChcblx0XHRcdFwiTXlDdXN0b21GbGV4SUQtY29udGVudF9WSFwiXG5cdFx0KTtcblx0fSk7XG5cblx0aXQoXCJ3aXRoIGEgbmF2aWdhdGlvbiBwcm9wZXJ0eSBhcyBhIGRhdGFmaWVsZFwiLCBhc3luYyAoKSA9PiB7XG5cdFx0Y29uc3QgeG1sRmllbGQgPSBgPGludGVybmFsTWFjcm86RmllbGQgeG1sbnM6aW50ZXJuYWxNYWNybz1cInNhcC5mZS5tYWNyb3MuaW50ZXJuYWxcIlxuXHRcdFx0XHRcdFx0XHRcdFx0ZW50aXR5U2V0PVwie2VudGl0eVNldD59XCJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGFGaWVsZD1cIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5MaW5lSXRlbS8xXCJcblx0XHRcdFx0XHRcdFx0XHRcdHZoSWRQcmVmaXg9XCJWSFwiXG5cdFx0XHRcdFx0XHRcdFx0XHQ+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8L2ludGVybmFsTWFjcm86RmllbGQ+YDtcblxuXHRcdGNvbnN0IGRvbVJlc3VsdCA9IGF3YWl0IGdldFRlbXBsYXRpbmdSZXN1bHQoeG1sRmllbGQsIHNNZXRhZGF0YVVybCwgbUJpbmRpbmdDb250ZXh0cywge30pO1xuXHRcdGV4cGVjdChkb21SZXN1bHQpLnRvSGF2ZUNvbnRyb2woXCIvbWFjcm9zOkZpZWxkQVBJL2NvbnRyb2w6RmllbGRXcmFwcGVyL2NvbnRyb2w6Y29udGVudEVkaXQvbWRjOkZpZWxkXCIpO1xuXHRcdGV4cGVjdChnZXRDb250cm9sQXR0cmlidXRlKFwiL21hY3JvczpGaWVsZEFQSS9jb250cm9sOkZpZWxkV3JhcHBlci9jb250cm9sOmNvbnRlbnRFZGl0L21kYzpGaWVsZFwiLCBcImZpZWxkSGVscFwiLCBkb21SZXN1bHQpKS50b0VxdWFsKFxuXHRcdFx0XCJWSDo6dG9TdWJJdGVtczo6c3VidmhSZWZlcmVuY2VcIlxuXHRcdCk7XG5cdH0pO1xuXG5cdGl0KFwid2l0aCBhIG5hdmlnYXRpb24gcHJvcGVydHkgYXMgYSBkYXRhZmllbGQgYW5kIGEgZmxleElkXCIsIGFzeW5jICgpID0+IHtcblx0XHRjb25zdCB4bWxGaWVsZCA9IGA8aW50ZXJuYWxNYWNybzpGaWVsZCB4bWxuczppbnRlcm5hbE1hY3JvPVwic2FwLmZlLm1hY3Jvcy5pbnRlcm5hbFwiXG5cdFx0XHRcdFx0XHRcdFx0XHRfZmxleElkPVwiTXlDdXN0b21GbGV4SURcIlxuXHRcdFx0XHRcdFx0XHRcdFx0ZW50aXR5U2V0PVwie2VudGl0eVNldD59XCJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGFGaWVsZD1cIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5MaW5lSXRlbS8xXCJcblx0XHRcdFx0XHRcdFx0XHRcdHZoSWRQcmVmaXg9XCJWSFwiXG5cdFx0XHRcdFx0XHRcdFx0XHQ+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8L2ludGVybmFsTWFjcm86RmllbGQ+YDtcblxuXHRcdGNvbnN0IGRvbVJlc3VsdCA9IGF3YWl0IGdldFRlbXBsYXRpbmdSZXN1bHQoeG1sRmllbGQsIHNNZXRhZGF0YVVybCwgbUJpbmRpbmdDb250ZXh0cywge30pO1xuXHRcdGV4cGVjdChkb21SZXN1bHQpLnRvSGF2ZUNvbnRyb2woXCIvbWFjcm9zOkZpZWxkQVBJL2NvbnRyb2w6RmllbGRXcmFwcGVyL2NvbnRyb2w6Y29udGVudEVkaXQvbWRjOkZpZWxkXCIpO1xuXHRcdGV4cGVjdChnZXRDb250cm9sQXR0cmlidXRlKFwiL21hY3JvczpGaWVsZEFQSS9jb250cm9sOkZpZWxkV3JhcHBlci9jb250cm9sOmNvbnRlbnRFZGl0L21kYzpGaWVsZFwiLCBcImZpZWxkSGVscFwiLCBkb21SZXN1bHQpKS50b0VxdWFsKFxuXHRcdFx0XCJNeUN1c3RvbUZsZXhJRC1jb250ZW50X1ZIXCJcblx0XHQpO1xuXHR9KTtcbn0pO1xuIl19