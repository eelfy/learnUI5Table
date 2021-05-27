sap.ui.define(["sap/fe/macros/ValueHelp.metadata", "sap/fe/test/JestTemplatingHelper", "path"], function (ValueHelpMetadata, JestTemplatingHelper, path) {
  "use strict";

  var getControlAttribute = JestTemplatingHelper.getControlAttribute;
  var serializeXML = JestTemplatingHelper.serializeXML;
  var registerMacro = JestTemplatingHelper.registerMacro;
  var getTemplatingResult = JestTemplatingHelper.getTemplatingResult;
  var compileCDS = JestTemplatingHelper.compileCDS;
  describe("Value Help templating", function () {
    beforeEach(function () {
      registerMacro(ValueHelpMetadata);
    });
    var sMetadataUrl = compileCDS(path.join(__dirname, "./data/ValueHelpMacro.cds"));
    var mBindingContexts = {
      "entitySet": "/Items"
    };
    describe("- check control templating - ", function () {
      it("Properties without value help and outside the filter bar (no condition panel) ", function () {
        try {
          var xmlField = "<macro:ValueHelp xmlns:macro=\"sap.fe.macros\"\n\t\t\t\t\t\t\t\t\tproperty=\"ID\"\n\t\t\t\t\t\t\t\t\t/>";
          return Promise.resolve(getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {})).then(function (domResult) {
            expect(domResult).toNotHaveControl("/mdcField:FieldValueHelp");
            xmlField = "<macro:ValueHelp xmlns:macro=\"sap.fe.macros\"\n\t\t\t\t\t\t\t\t\tproperty=\"stringValue\"\n\t\t\t\t\t\t\t\t\t/>";
            return Promise.resolve(getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {})).then(function (_getTemplatingResult) {
              domResult = _getTemplatingResult;
              expect(domResult).toNotHaveControl("/mdcField:FieldValueHelp");
              xmlField = "<macro:ValueHelp xmlns:macro=\"sap.fe.macros\"\n\t\t\t\t\t\t\t\t\tproperty=\"decimalValue\"\n\t\t\t\t\t\t\t\t\t/>";
              return Promise.resolve(getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {})).then(function (_getTemplatingResult2) {
                domResult = _getTemplatingResult2;
                expect(domResult).toNotHaveControl("/mdcField:FieldValueHelp");
              });
            });
          });
        } catch (e) {
          return Promise.reject(e);
        }
      });
      it("Properties of type date will have a value help ", function () {
        try {
          var xmlField = "<macro:ValueHelp xmlns:macro=\"sap.fe.macros\"\n\t\t\t\t\t\t\t\t\tproperty=\"decimalValue\"\n\t\t\t\t\t\t\t\t\t/>";
          return Promise.resolve(getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {})).then(function (domResult) {
            expect(domResult).toNotHaveControl("/mdcField:FieldValueHelp");
            expect(serializeXML(domResult)).toMatchSnapshot();
          });
        } catch (e) {
          return Promise.reject(e);
        }
      });
      it("Properties with unit will have a value help on that unit ", function () {
        try {
          var xmlField = "<macro:ValueHelp xmlns:macro=\"sap.fe.macros\"\n\t\t\t\t\t\t\t\t\tproperty=\"quantity\"\n\t\t\t\t\t\t\t\t\t/>";
          return Promise.resolve(getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {})).then(function (domResult) {
            expect(domResult).toHaveControl("/mdcField:FieldValueHelp");
            expect(serializeXML(domResult)).toMatchSnapshot();
          });
        } catch (e) {
          return Promise.reject(e);
        }
      });
      it("Properties with unit will have not have value help on that unit in the filter field ", function () {
        try {
          var xmlField = "<macro:ValueHelp xmlns:macro=\"sap.fe.macros\"\n\t\t\t\t\t\t\t\t\tproperty=\"quantity\"\n\t\t\t\t\t\t\t\t\tfilterFieldValueHelp=\"true\"\n\t\t\t\t\t\t\t\t\tforceValueHelp=\"true\"\n\t\t\t\t\t\t\t\t\t/>";
          return Promise.resolve(getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {})).then(function (domResult) {
            expect(domResult).toHaveControl("/mdcField:FieldValueHelp");
            expect(getControlAttribute("/mdcField:FieldValueHelp", "id", domResult)).toEqual("ValueHelp::quantity");
            expect(getControlAttribute("/mdcField:FieldValueHelp", "showConditionPanel", domResult)).toEqual("true");
            expect(serializeXML(domResult)).toMatchSnapshot();
          });
        } catch (e) {
          return Promise.reject(e);
        }
      });
      it("Value with value help", function () {
        try {
          var xmlField = "<macro:ValueHelp xmlns:macro=\"sap.fe.macros\"\n\t\t\t\t\t\t\t\t\tidPrefix=\"VH\"\n\t\t\t\t\t\t\t\t\tproperty=\"vhReference\"\n\t\t\t\t\t\t\t\t\tconditionModel=\"$conditions\"\n\t\t\t\t\t\t\t\t\tfilterFieldValueHelp=\"false\"\n\t\t\t\t\t\t\t\t\trequestGroupId=\"Yolo\"\n\t\t\t\t\t\t\t\t\t/>";
          return Promise.resolve(getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {})).then(function (domResult) {
            expect(serializeXML(domResult)).toMatchSnapshot();
            var xmlFieldInFilterField = "<macro:ValueHelp xmlns:macro=\"sap.fe.macros\"\n\t\t\t\t\t\t\t\t\tidPrefix=\"VH\"\n\t\t\t\t\t\t\t\t\tproperty=\"vhReference\"\n\t\t\t\t\t\t\t\t\tconditionModel=\"$conditions\"\n\t\t\t\t\t\t\t\t\tfilterFieldValueHelp=\"false\"\n\t\t\t\t\t\t\t\t\trequestGroupId=\"Yolo\"\n\t\t\t\t\t\t\t\t\t/>";
            return Promise.resolve(getTemplatingResult(xmlFieldInFilterField, sMetadataUrl, mBindingContexts, {})).then(function (domResultInFilterField) {
              expect(serializeXML(domResultInFilterField)).toMatchSnapshot();
              expect(serializeXML(domResultInFilterField)).toEqual(serializeXML(domResult));
            });
          });
        } catch (e) {
          return Promise.reject(e);
        }
      });
      it("Value with value help with fixed values", function () {
        try {
          var xmlField = "<macro:ValueHelp xmlns:macro=\"sap.fe.macros\"\n\t\t\t\t\t\t\t\t\tidPrefix=\"VH\"\n\t\t\t\t\t\t\t\t\tproperty=\"vhReferenceWithFixedValues\"\n\t\t\t\t\t\t\t\t\tconditionModel=\"$conditions\"\n\t\t\t\t\t\t\t\t\tfilterFieldValueHelp=\"false\"\n\t\t\t\t\t\t\t\t\trequestGroupId=\"Yolo\"\n\t\t\t\t\t\t\t\t\t/>";
          return Promise.resolve(getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {})).then(function (domResult) {
            expect(serializeXML(domResult)).toMatchSnapshot();
          });
        } catch (e) {
          return Promise.reject(e);
        }
      });
      it("Value with value help following navproperty", function () {
        try {
          var xmlField = "<macro:ValueHelp xmlns:macro=\"sap.fe.macros\"\n\t\t\t\t\t\t\t\t\tidPrefix=\"VH\"\n\t\t\t\t\t\t\t\t\tproperty=\"toSubItems/subvhReference\"\n\t\t\t\t\t\t\t\t\tconditionModel=\"$conditions\"\n\t\t\t\t\t\t\t\t\tfilterFieldValueHelp=\"false\"\n\t\t\t\t\t\t\t\t\trequestGroupId=\"Yolo\"\n\t\t\t\t\t\t\t\t\t/>";
          return Promise.resolve(getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {})).then(function (domResult) {
            expect(serializeXML(domResult)).toMatchSnapshot();
            expect(getControlAttribute("/mdcField:FieldValueHelp", "id", domResult)).toEqual("VH::toSubItems::subvhReference");
          });
        } catch (e) {
          return Promise.reject(e);
        }
      });
      it("Value with value help following navproperty", function () {
        try {
          var xmlField = "<macro:ValueHelp xmlns:macro=\"sap.fe.macros\"\n\t\t\t\t\t\t\t\t\t_flexId=\"MyFlexID\"\n\t\t\t\t\t\t\t\t\tproperty=\"toSubItems/subvhReference\"\n\t\t\t\t\t\t\t\t\tconditionModel=\"$conditions\"\n\t\t\t\t\t\t\t\t\tfilterFieldValueHelp=\"false\"\n\t\t\t\t\t\t\t\t\trequestGroupId=\"Yolo\"\n\t\t\t\t\t\t\t\t\t/>";
          return Promise.resolve(getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {})).then(function (domResult) {
            expect(serializeXML(domResult)).toMatchSnapshot();
            expect(getControlAttribute("/mdcField:FieldValueHelp", "id", domResult)).toEqual("MyFlexID");
          });
        } catch (e) {
          return Promise.reject(e);
        }
      });
    });
  });
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlZhbHVlSGVscE1hY3JvLnNwZWMudHMiXSwibmFtZXMiOlsiZGVzY3JpYmUiLCJiZWZvcmVFYWNoIiwicmVnaXN0ZXJNYWNybyIsIlZhbHVlSGVscE1ldGFkYXRhIiwic01ldGFkYXRhVXJsIiwiY29tcGlsZUNEUyIsInBhdGgiLCJqb2luIiwiX19kaXJuYW1lIiwibUJpbmRpbmdDb250ZXh0cyIsIml0IiwieG1sRmllbGQiLCJnZXRUZW1wbGF0aW5nUmVzdWx0IiwiZG9tUmVzdWx0IiwiZXhwZWN0IiwidG9Ob3RIYXZlQ29udHJvbCIsInNlcmlhbGl6ZVhNTCIsInRvTWF0Y2hTbmFwc2hvdCIsInRvSGF2ZUNvbnRyb2wiLCJnZXRDb250cm9sQXR0cmlidXRlIiwidG9FcXVhbCIsInhtbEZpZWxkSW5GaWx0ZXJGaWVsZCIsImRvbVJlc3VsdEluRmlsdGVyRmllbGQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBSUFBLEVBQUFBLFFBQVEsQ0FBQyx1QkFBRCxFQUEwQixZQUFNO0FBQ3ZDQyxJQUFBQSxVQUFVLENBQUMsWUFBTTtBQUNoQkMsTUFBQUEsYUFBYSxDQUFDQyxpQkFBRCxDQUFiO0FBQ0EsS0FGUyxDQUFWO0FBSUEsUUFBTUMsWUFBWSxHQUFHQyxVQUFVLENBQUNDLElBQUksQ0FBQ0MsSUFBTCxDQUFVQyxTQUFWLEVBQXFCLDJCQUFyQixDQUFELENBQS9CO0FBQ0EsUUFBTUMsZ0JBQWdCLEdBQUc7QUFDeEIsbUJBQWE7QUFEVyxLQUF6QjtBQUlBVCxJQUFBQSxRQUFRLENBQUMsK0JBQUQsRUFBa0MsWUFBTTtBQUMvQ1UsTUFBQUEsRUFBRSxDQUFDLGdGQUFEO0FBQUEsWUFBK0Y7QUFDaEcsY0FBSUMsUUFBUSw0R0FBWjtBQURnRyxpQ0FLMUVDLG1CQUFtQixDQUFDRCxRQUFELEVBQVdQLFlBQVgsRUFBeUJLLGdCQUF6QixFQUEyQyxFQUEzQyxDQUx1RCxpQkFLNUZJLFNBTDRGO0FBTWhHQyxZQUFBQSxNQUFNLENBQUNELFNBQUQsQ0FBTixDQUFrQkUs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QUFBO0FBQUE7QUFBQSxRQUFGO0FBY0FWLE1BQUFBLEVBQUUsQ0FBQyw2Q0FBRDtBQUFBLFlBQTREO0FBQzdELGNBQU1DLFFBQVEsMFRBQWQ7QUFENkQsaUNBU3JDQyxtQkFBbUIsQ0FBQ0QsUUFBRCxFQUFXUCxZQUFYLEVBQXlCSyxnQkFBekIsRUFBMkMsRUFBM0MsQ0FUa0IsaUJBU3ZESSxTQVR1RDtBQVU3REMsWUFBQUEsTUFBTSxDQUFDRSxZQUFZLENBQUNILFNBQUQsQ0FBYixDQUFOLENBQWdDSSxlQUFoQztBQUNBSCxZQUFBQSxNQUFNLENBQUNLLG1CQUFtQixDQUFDLDBCQUFELEVBQTZCLElBQTdCLEVBQW1DTixTQUFuQyxDQUFwQixDQUFOLENBQXlFTyxPQUF6RSxDQUFpRixVQUFqRjtBQVg2RDtBQVk3RCxTQVpDO0FBQUE7QUFBQTtBQUFBLFFBQUY7QUFhQSxLQTNITyxDQUFSO0FBNEhBLEdBdElPLENBQVIiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWYWx1ZUhlbHBNZXRhZGF0YSBmcm9tIFwic2FwL2ZlL21hY3Jvcy9WYWx1ZUhlbHAubWV0YWRhdGFcIjtcbmltcG9ydCB7IGNvbXBpbGVDRFMsIGdldFRlbXBsYXRpbmdSZXN1bHQsIHJlZ2lzdGVyTWFjcm8sIHNlcmlhbGl6ZVhNTCwgZ2V0Q29udHJvbEF0dHJpYnV0ZSB9IGZyb20gXCJzYXAvZmUvdGVzdC9KZXN0VGVtcGxhdGluZ0hlbHBlclwiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcblxuZGVzY3JpYmUoXCJWYWx1ZSBIZWxwIHRlbXBsYXRpbmdcIiwgKCkgPT4ge1xuXHRiZWZvcmVFYWNoKCgpID0+IHtcblx0XHRyZWdpc3Rlck1hY3JvKFZhbHVlSGVscE1ldGFkYXRhKTtcblx0fSk7XG5cblx0Y29uc3Qgc01ldGFkYXRhVXJsID0gY29tcGlsZUNEUyhwYXRoLmpvaW4oX19kaXJuYW1lLCBcIi4vZGF0YS9WYWx1ZUhlbHBNYWNyby5jZHNcIikpO1xuXHRjb25zdCBtQmluZGluZ0NvbnRleHRzID0ge1xuXHRcdFwiZW50aXR5U2V0XCI6IFwiL0l0ZW1zXCJcblx0fTtcblxuXHRkZXNjcmliZShcIi0gY2hlY2sgY29udHJvbCB0ZW1wbGF0aW5nIC0gXCIsICgpID0+IHtcblx0XHRpdChcIlByb3BlcnRpZXMgd2l0aG91dCB2YWx1ZSBoZWxwIGFuZCBvdXRzaWRlIHRoZSBmaWx0ZXIgYmFyIChubyBjb25kaXRpb24gcGFuZWwpIFwiLCBhc3luYyAoKSA9PiB7XG5cdFx0XHRsZXQgeG1sRmllbGQgPSBgPG1hY3JvOlZhbHVlSGVscCB4bWxuczptYWNybz1cInNhcC5mZS5tYWNyb3NcIlxuXHRcdFx0XHRcdFx0XHRcdFx0cHJvcGVydHk9XCJJRFwiXG5cdFx0XHRcdFx0XHRcdFx0XHQvPmA7XG5cblx0XHRcdGxldCBkb21SZXN1bHQgPSBhd2FpdCBnZXRUZW1wbGF0aW5nUmVzdWx0KHhtbEZpZWxkLCBzTWV0YWRhdGFVcmwsIG1CaW5kaW5nQ29udGV4dHMsIHt9KTtcblx0XHRcdGV4cGVjdChkb21SZXN1bHQpLnRvTm90SGF2ZUNvbnRyb2woXCIvbWRjRmllbGQ6RmllbGRWYWx1ZUhlbHBcIik7XG5cblx0XHRcdHhtbEZpZWxkID0gYDxtYWNybzpWYWx1ZUhlbHAgeG1sbnM6bWFjcm89XCJzYXAuZmUubWFjcm9zXCJcblx0XHRcdFx0XHRcdFx0XHRcdHByb3BlcnR5PVwic3RyaW5nVmFsdWVcIlxuXHRcdFx0XHRcdFx0XHRcdFx0Lz5gO1xuXG5cdFx0XHRkb21SZXN1bHQgPSBhd2FpdCBnZXRUZW1wbGF0aW5nUmVzdWx0KHhtbEZpZWxkLCBzTWV0YWRhdGFVcmwsIG1CaW5kaW5nQ29udGV4dHMsIHt9KTtcblx0XHRcdGV4cGVjdChkb21SZXN1bHQpLnRvTm90SGF2ZUNvbnRyb2woXCIvbWRjRmllbGQ6RmllbGRWYWx1ZUhlbHBcIik7XG5cblx0XHRcdHhtbEZpZWxkID0gYDxtYWNybzpWYWx1ZUhlbHAgeG1sbnM6bWFjcm89XCJzYXAuZmUubWFjcm9zXCJcblx0XHRcdFx0XHRcdFx0XHRcdHByb3BlcnR5PVwiZGVjaW1hbFZhbHVlXCJcblx0XHRcdFx0XHRcdFx0XHRcdC8+YDtcblxuXHRcdFx0ZG9tUmVzdWx0ID0gYXdhaXQgZ2V0VGVtcGxhdGluZ1Jlc3VsdCh4bWxGaWVsZCwgc01ldGFkYXRhVXJsLCBtQmluZGluZ0NvbnRleHRzLCB7fSk7XG5cdFx0XHRleHBlY3QoZG9tUmVzdWx0KS50b05vdEhhdmVDb250cm9sKFwiL21kY0ZpZWxkOkZpZWxkVmFsdWVIZWxwXCIpO1xuXHRcdH0pO1xuXG5cdFx0aXQoXCJQcm9wZXJ0aWVzIG9mIHR5cGUgZGF0ZSB3aWxsIGhhdmUgYSB2YWx1ZSBoZWxwIFwiLCBhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCB4bWxGaWVsZCA9IGA8bWFjcm86VmFsdWVIZWxwIHhtbG5zOm1hY3JvPVwic2FwLmZlLm1hY3Jvc1wiXG5cdFx0XHRcdFx0XHRcdFx0XHRwcm9wZXJ0eT1cImRlY2ltYWxWYWx1ZVwiXG5cdFx0XHRcdFx0XHRcdFx0XHQvPmA7XG5cblx0XHRcdGNvbnN0IGRvbVJlc3VsdCA9IGF3YWl0IGdldFRlbXBsYXRpbmdSZXN1bHQoeG1sRmllbGQsIHNNZXRhZGF0YVVybCwgbUJpbmRpbmdDb250ZXh0cywge30pO1xuXHRcdFx0ZXhwZWN0KGRvbVJlc3VsdCkudG9Ob3RIYXZlQ29udHJvbChcIi9tZGNGaWVsZDpGaWVsZFZhbHVlSGVscFwiKTtcblx0XHRcdGV4cGVjdChzZXJpYWxpemVYTUwoZG9tUmVzdWx0KSkudG9NYXRjaFNuYXBzaG90KCk7XG5cdFx0fSk7XG5cblx0XHRpdChcIlByb3BlcnRpZXMgd2l0aCB1bml0IHdpbGwgaGF2ZSBhIHZhbHVlIGhlbHAgb24gdGhhdCB1bml0IFwiLCBhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCB4bWxGaWVsZCA9IGA8bWFjcm86VmFsdWVIZWxwIHhtbG5zOm1hY3JvPVwic2FwLmZlLm1hY3Jvc1wiXG5cdFx0XHRcdFx0XHRcdFx0XHRwcm9wZXJ0eT1cInF1YW50aXR5XCJcblx0XHRcdFx0XHRcdFx0XHRcdC8+YDtcblxuXHRcdFx0Y29uc3QgZG9tUmVzdWx0ID0gYXdhaXQgZ2V0VGVtcGxhdGluZ1Jlc3VsdCh4bWxGaWVsZCwgc01ldGFkYXRhVXJsLCBtQmluZGluZ0NvbnRleHRzLCB7fSk7XG5cdFx0XHRleHBlY3QoZG9tUmVzdWx0KS50b0hhdmVDb250cm9sKFwiL21kY0ZpZWxkOkZpZWxkVmFsdWVIZWxwXCIpO1xuXHRcdFx0ZXhwZWN0KHNlcmlhbGl6ZVhNTChkb21SZXN1bHQpKS50b01hdGNoU25hcHNob3QoKTtcblx0XHR9KTtcblxuXHRcdGl0KFwiUHJvcGVydGllcyB3aXRoIHVuaXQgd2lsbCBoYXZlIG5vdCBoYXZlIHZhbHVlIGhlbHAgb24gdGhhdCB1bml0IGluIHRoZSBmaWx0ZXIgZmllbGQgXCIsIGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IHhtbEZpZWxkID0gYDxtYWNybzpWYWx1ZUhlbHAgeG1sbnM6bWFjcm89XCJzYXAuZmUubWFjcm9zXCJcblx0XHRcdFx0XHRcdFx0XHRcdHByb3BlcnR5PVwicXVhbnRpdHlcIlxuXHRcdFx0XHRcdFx0XHRcdFx0ZmlsdGVyRmllbGRWYWx1ZUhlbHA9XCJ0cnVlXCJcblx0XHRcdFx0XHRcdFx0XHRcdGZvcmNlVmFsdWVIZWxwPVwidHJ1ZVwiXG5cdFx0XHRcdFx0XHRcdFx0XHQvPmA7XG5cblx0XHRcdGNvbnN0IGRvbVJlc3VsdCA9IGF3YWl0IGdldFRlbXBsYXRpbmdSZXN1bHQoeG1sRmllbGQsIHNNZXRhZGF0YVVybCwgbUJpbmRpbmdDb250ZXh0cywge30pO1xuXHRcdFx0ZXhwZWN0KGRvbVJlc3VsdCkudG9IYXZlQ29udHJvbChcIi9tZGNGaWVsZDpGaWVsZFZhbHVlSGVscFwiKTtcblx0XHRcdGV4cGVjdChnZXRDb250cm9sQXR0cmlidXRlKFwiL21kY0ZpZWxkOkZpZWxkVmFsdWVIZWxwXCIsIFwiaWRcIiwgZG9tUmVzdWx0KSkudG9FcXVhbChcIlZhbHVlSGVscDo6cXVhbnRpdHlcIik7XG5cdFx0XHRleHBlY3QoZ2V0Q29udHJvbEF0dHJpYnV0ZShcIi9tZGNGaWVsZDpGaWVsZFZhbHVlSGVscFwiLCBcInNob3dDb25kaXRpb25QYW5lbFwiLCBkb21SZXN1bHQpKS50b0VxdWFsKFwidHJ1ZVwiKTtcblx0XHRcdGV4cGVjdChzZXJpYWxpemVYTUwoZG9tUmVzdWx0KSkudG9NYXRjaFNuYXBzaG90KCk7XG5cdFx0fSk7XG5cblx0XHRpdChcIlZhbHVlIHdpdGggdmFsdWUgaGVscFwiLCBhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCB4bWxGaWVsZCA9IGA8bWFjcm86VmFsdWVIZWxwIHhtbG5zOm1hY3JvPVwic2FwLmZlLm1hY3Jvc1wiXG5cdFx0XHRcdFx0XHRcdFx0XHRpZFByZWZpeD1cIlZIXCJcblx0XHRcdFx0XHRcdFx0XHRcdHByb3BlcnR5PVwidmhSZWZlcmVuY2VcIlxuXHRcdFx0XHRcdFx0XHRcdFx0Y29uZGl0aW9uTW9kZWw9XCIkY29uZGl0aW9uc1wiXG5cdFx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJGaWVsZFZhbHVlSGVscD1cImZhbHNlXCJcblx0XHRcdFx0XHRcdFx0XHRcdHJlcXVlc3RHcm91cElkPVwiWW9sb1wiXG5cdFx0XHRcdFx0XHRcdFx0XHQvPmA7XG5cblx0XHRcdGNvbnN0IGRvbVJlc3VsdCA9IGF3YWl0IGdldFRlbXBsYXRpbmdSZXN1bHQoeG1sRmllbGQsIHNNZXRhZGF0YVVybCwgbUJpbmRpbmdDb250ZXh0cywge30pO1xuXHRcdFx0ZXhwZWN0KHNlcmlhbGl6ZVhNTChkb21SZXN1bHQpKS50b01hdGNoU25hcHNob3QoKTtcblxuXHRcdFx0Y29uc3QgeG1sRmllbGRJbkZpbHRlckZpZWxkID0gYDxtYWNybzpWYWx1ZUhlbHAgeG1sbnM6bWFjcm89XCJzYXAuZmUubWFjcm9zXCJcblx0XHRcdFx0XHRcdFx0XHRcdGlkUHJlZml4PVwiVkhcIlxuXHRcdFx0XHRcdFx0XHRcdFx0cHJvcGVydHk9XCJ2aFJlZmVyZW5jZVwiXG5cdFx0XHRcdFx0XHRcdFx0XHRjb25kaXRpb25Nb2RlbD1cIiRjb25kaXRpb25zXCJcblx0XHRcdFx0XHRcdFx0XHRcdGZpbHRlckZpZWxkVmFsdWVIZWxwPVwiZmFsc2VcIlxuXHRcdFx0XHRcdFx0XHRcdFx0cmVxdWVzdEdyb3VwSWQ9XCJZb2xvXCJcblx0XHRcdFx0XHRcdFx0XHRcdC8+YDtcblxuXHRcdFx0Y29uc3QgZG9tUmVzdWx0SW5GaWx0ZXJGaWVsZCA9IGF3YWl0IGdldFRlbXBsYXRpbmdSZXN1bHQoeG1sRmllbGRJbkZpbHRlckZpZWxkLCBzTWV0YWRhdGFVcmwsIG1CaW5kaW5nQ29udGV4dHMsIHt9KTtcblx0XHRcdGV4cGVjdChzZXJpYWxpemVYTUwoZG9tUmVzdWx0SW5GaWx0ZXJGaWVsZCkpLnRvTWF0Y2hTbmFwc2hvdCgpO1xuXHRcdFx0ZXhwZWN0KHNlcmlhbGl6ZVhNTChkb21SZXN1bHRJbkZpbHRlckZpZWxkKSkudG9FcXVhbChzZXJpYWxpemVYTUwoZG9tUmVzdWx0KSk7XG5cdFx0fSk7XG5cblx0XHRpdChcIlZhbHVlIHdpdGggdmFsdWUgaGVscCB3aXRoIGZpeGVkIHZhbHVlc1wiLCBhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCB4bWxGaWVsZCA9IGA8bWFjcm86VmFsdWVIZWxwIHhtbG5zOm1hY3JvPVwic2FwLmZlLm1hY3Jvc1wiXG5cdFx0XHRcdFx0XHRcdFx0XHRpZFByZWZpeD1cIlZIXCJcblx0XHRcdFx0XHRcdFx0XHRcdHByb3BlcnR5PVwidmhSZWZlcmVuY2VXaXRoRml4ZWRWYWx1ZXNcIlxuXHRcdFx0XHRcdFx0XHRcdFx0Y29uZGl0aW9uTW9kZWw9XCIkY29uZGl0aW9uc1wiXG5cdFx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJGaWVsZFZhbHVlSGVscD1cImZhbHNlXCJcblx0XHRcdFx0XHRcdFx0XHRcdHJlcXVlc3RHcm91cElkPVwiWW9sb1wiXG5cdFx0XHRcdFx0XHRcdFx0XHQvPmA7XG5cblx0XHRcdGNvbnN0IGRvbVJlc3VsdCA9IGF3YWl0IGdldFRlbXBsYXRpbmdSZXN1bHQoeG1sRmllbGQsIHNNZXRhZGF0YVVybCwgbUJpbmRpbmdDb250ZXh0cywge30pO1xuXHRcdFx0ZXhwZWN0KHNlcmlhbGl6ZVhNTChkb21SZXN1bHQpKS50b01hdGNoU25hcHNob3QoKTtcblx0XHR9KTtcblxuXHRcdGl0KFwiVmFsdWUgd2l0aCB2YWx1ZSBoZWxwIGZvbGxvd2luZyBuYXZwcm9wZXJ0eVwiLCBhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zdCB4bWxGaWVsZCA9IGA8bWFjcm86VmFsdWVIZWxwIHhtbG5zOm1hY3JvPVwic2FwLmZlLm1hY3Jvc1wiXG5cdFx0XHRcdFx0XHRcdFx0XHRpZFByZWZpeD1cIlZIXCJcblx0XHRcdFx0XHRcdFx0XHRcdHByb3BlcnR5PVwidG9TdWJJdGVtcy9zdWJ2aFJlZmVyZW5jZVwiXG5cdFx0XHRcdFx0XHRcdFx0XHRjb25kaXRpb25Nb2RlbD1cIiRjb25kaXRpb25zXCJcblx0XHRcdFx0XHRcdFx0XHRcdGZpbHRlckZpZWxkVmFsdWVIZWxwPVwiZmFsc2VcIlxuXHRcdFx0XHRcdFx0XHRcdFx0cmVxdWVzdEdyb3VwSWQ9XCJZb2xvXCJcblx0XHRcdFx0XHRcdFx0XHRcdC8+YDtcblxuXHRcdFx0Y29uc3QgZG9tUmVzdWx0ID0gYXdhaXQgZ2V0VGVtcGxhdGluZ1Jlc3VsdCh4bWxGaWVsZCwgc01ldGFkYXRhVXJsLCBtQmluZGluZ0NvbnRleHRzLCB7fSk7XG5cdFx0XHRleHBlY3Qoc2VyaWFsaXplWE1MKGRvbVJlc3VsdCkpLnRvTWF0Y2hTbmFwc2hvdCgpO1xuXHRcdFx0ZXhwZWN0KGdldENvbnRyb2xBdHRyaWJ1dGUoXCIvbWRjRmllbGQ6RmllbGRWYWx1ZUhlbHBcIiwgXCJpZFwiLCBkb21SZXN1bHQpKS50b0VxdWFsKFwiVkg6OnRvU3ViSXRlbXM6OnN1YnZoUmVmZXJlbmNlXCIpO1xuXHRcdH0pO1xuXG5cdFx0aXQoXCJWYWx1ZSB3aXRoIHZhbHVlIGhlbHAgZm9sbG93aW5nIG5hdnByb3BlcnR5XCIsIGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IHhtbEZpZWxkID0gYDxtYWNybzpWYWx1ZUhlbHAgeG1sbnM6bWFjcm89XCJzYXAuZmUubWFjcm9zXCJcblx0XHRcdFx0XHRcdFx0XHRcdF9mbGV4SWQ9XCJNeUZsZXhJRFwiXG5cdFx0XHRcdFx0XHRcdFx0XHRwcm9wZXJ0eT1cInRvU3ViSXRlbXMvc3VidmhSZWZlcmVuY2VcIlxuXHRcdFx0XHRcdFx0XHRcdFx0Y29uZGl0aW9uTW9kZWw9XCIkY29uZGl0aW9uc1wiXG5cdFx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJGaWVsZFZhbHVlSGVscD1cImZhbHNlXCJcblx0XHRcdFx0XHRcdFx0XHRcdHJlcXVlc3RHcm91cElkPVwiWW9sb1wiXG5cdFx0XHRcdFx0XHRcdFx0XHQvPmA7XG5cblx0XHRcdGNvbnN0IGRvbVJlc3VsdCA9IGF3YWl0IGdldFRlbXBsYXRpbmdSZXN1bHQoeG1sRmllbGQsIHNNZXRhZGF0YVVybCwgbUJpbmRpbmdDb250ZXh0cywge30pO1xuXHRcdFx0ZXhwZWN0KHNlcmlhbGl6ZVhNTChkb21SZXN1bHQpKS50b01hdGNoU25hcHNob3QoKTtcblx0XHRcdGV4cGVjdChnZXRDb250cm9sQXR0cmlidXRlKFwiL21kY0ZpZWxkOkZpZWxkVmFsdWVIZWxwXCIsIFwiaWRcIiwgZG9tUmVzdWx0KSkudG9FcXVhbChcIk15RmxleElEXCIpO1xuXHRcdH0pO1xuXHR9KTtcbn0pO1xuIl19