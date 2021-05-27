sap.ui.define(["sap/fe/macros/field/FieldTemplating", "path", "sap/fe/test/JestTemplatingHelper", "sap/fe/core/converters/MetaModelConverter", "sap/fe/core/helpers/BindingExpression"], function (FieldTemplating, path, JestTemplatingHelper, MetaModelConverter, BindingExpression) {
  "use strict";

  var ifElse = BindingExpression.ifElse;
  var compileBinding = BindingExpression.compileBinding;
  var bindingExpression = BindingExpression.bindingExpression;
  var convertTypes = MetaModelConverter.convertTypes;
  var evaluateBindingWithModel = JestTemplatingHelper.evaluateBindingWithModel;
  var getDataModelObjectPathForProperty = JestTemplatingHelper.getDataModelObjectPathForProperty;
  var getMetaModel = JestTemplatingHelper.getMetaModel;
  var compileCDS = JestTemplatingHelper.compileCDS;
  var addTextArrangementToBindingExpression = FieldTemplating.addTextArrangementToBindingExpression;
  var getBindingWithTextArrangement = FieldTemplating.getBindingWithTextArrangement;
  describe("Field Templating Testing", function () {
    var convertedTypes;
    var entitySet;
    var entityType;
    var properties = {};
    beforeAll(function () {
      try {
        var sMetadataUrl = compileCDS(path.join(__dirname, "./FieldTemplating.cds"));
        return Promise.resolve(getMetaModel(sMetadataUrl)).then(function (metaModel) {
          convertedTypes = convertTypes(metaModel);
          var maybeEntitySet = convertedTypes.entitySets.find(function (et) {
            return et.name === "getBindingWithTextArrangement";
          });

          if (maybeEntitySet) {
            entitySet = maybeEntitySet;
            entityType = maybeEntitySet.entityType;
            entityType.entityProperties.forEach(function (prop) {
              properties[prop.name] = prop;
            });
          } else {
            throw new Error("Error in test setup");
          }
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    it("#getBindingWithTextArrangement", function () {
      // Cases to consider
      // TextOnly
      var textOnlyBinding = getBindingWithTextArrangement(getDataModelObjectPathForProperty(entitySet, properties["textOnly"]), bindingExpression("textOnly"));
      expect(textOnlyBinding).toMatchSnapshot();
      expect(compileBinding(textOnlyBinding)).toContain("targetText");
      expect(evaluateBindingWithModel(compileBinding(textOnlyBinding), {
        targetText: "Yolo"
      })).toEqual("Yolo"); // No text arrangement

      var noTextBinding = getBindingWithTextArrangement(getDataModelObjectPathForProperty(entitySet, properties["noText"]), bindingExpression("noText"));
      expect(noTextBinding).toMatchSnapshot();
      expect(compileBinding(noTextBinding)).toContain("noText");
      expect(evaluateBindingWithModel(compileBinding(noTextBinding), {
        noText: "Yolo"
      })).toEqual("Yolo"); // TextFirst

      var textFirstBinding = getBindingWithTextArrangement(getDataModelObjectPathForProperty(entitySet, properties["textFirst"]), bindingExpression("textFirst"));
      expect(textFirstBinding).toMatchSnapshot();
      expect(compileBinding(textFirstBinding)).toContain("textFirst");
      expect(compileBinding(textFirstBinding)).toContain("targetText");
      expect(evaluateBindingWithModel(compileBinding(textFirstBinding), {
        textFirst: "Yolo Last",
        targetText: "Yolo Description"
      })).toEqual("Yolo Description (Yolo Last)"); // TextLast

      var textLastBinding = getBindingWithTextArrangement(getDataModelObjectPathForProperty(entitySet, properties["textLast"]), bindingExpression("textLast"));
      expect(textLastBinding).toMatchSnapshot();
      expect(compileBinding(textLastBinding)).toContain("textLast");
      expect(compileBinding(textLastBinding)).toContain("targetText");
      expect(evaluateBindingWithModel(compileBinding(textLastBinding), {
        textLast: "Yolo First",
        targetText: "Yolo Description"
      })).toEqual("Yolo First (Yolo Description)");
    });
    it("#addTextArrangementToBindingExpression", function () {
      var fullContext = getDataModelObjectPathForProperty(entitySet);
      var otherModelBinding = addTextArrangementToBindingExpression(bindingExpression("textLast", "otherModel"), fullContext);
      expect(otherModelBinding).toMatchSnapshot();
      expect(compileBinding(otherModelBinding)).toContain("textLast");
      expect(compileBinding(otherModelBinding)).not.toContain("targetText");
      var addTextLastBinding = addTextArrangementToBindingExpression(bindingExpression("textLast"), fullContext);
      expect(addTextLastBinding).toMatchSnapshot();
      expect(compileBinding(addTextLastBinding)).toContain("textLast");
      expect(compileBinding(addTextLastBinding)).toContain("targetText");
      expect(evaluateBindingWithModel(compileBinding(addTextLastBinding), {
        textLast: "Yolo First",
        targetText: "Yolo Description"
      })).toEqual("Yolo First (Yolo Description)");
      var complexTextBinding = addTextArrangementToBindingExpression(ifElse(bindingExpression("testProp"), bindingExpression("textLast"), bindingExpression("noText")), fullContext);
      expect(complexTextBinding).toMatchSnapshot();
      expect(compileBinding(complexTextBinding)).toContain("textLast");
      expect(compileBinding(complexTextBinding)).toContain("targetText");
      var modelContent = {
        testProp: true,
        textLast: "Yolo First",
        targetText: "Yolo Description",
        noText: "Not Yolo"
      };
      expect(evaluateBindingWithModel(compileBinding(complexTextBinding), modelContent)).toEqual("Yolo First (Yolo Description)");
      modelContent.testProp = false;
      expect(evaluateBindingWithModel(compileBinding(complexTextBinding), modelContent)).toEqual("Not Yolo");
    });
  });
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZpZWxkVGVtcGxhdGluZy5zcGVjLnRzIl0sIm5hbWVzIjpbImRlc2NyaWJlIiwiY29udmVydGVkVHlwZXMiLCJlbnRpdHlTZXQiLCJlbnRpdHlUeXBlIiwicHJvcGVydGllcyIsImJlZm9yZUFsbCIsInNNZXRhZGF0YVVybCIsImNvbXBpbGVDRFMiLCJwYXRoIiwiam9pbiIsIl9fZGlybmFtZSIsImdldE1ldGFNb2RlbCIsIm1ldGFNb2RlbCIsImNvbnZlcnRUeXBlcyIsIm1heWJlRW50aXR5U2V0IiwiZW50aXR5U2V0cyIsImZpbmQiLCJldCIsIm5hbWUiLCJlbnRpdHlQcm9wZXJ0aWVzIiwiZm9yRWFjaCIsInByb3AiLCJFcnJvciIsIml0IiwidGV4dE9ubHlCaW5kaW5nIiwiZ2V0QmluZGluZ1dpdGhUZXh0QXJyYW5nZW1lbnQiLCJnZXREYXRhTW9kZWxPYmplY3RQYXRoRm9yUHJvcGVydHkiLCJiaW5kaW5nRXhwcmVzc2lvbiIsImV4cGVjdCIsInRvTWF0Y2hTbmFwc2hvdCIsImNvbXBpbGVCaW5kaW5nIiwidG9Db250YWluIiwiZXZhbHVhdGVCaW5kaW5nV2l0aE1vZGVsIiwidGFyZ2V0VGV4dCIsInRvRXF1YWwiLCJub1RleHRCaW5kaW5nIiwibm9UZXh0IiwidGV4dEZpcnN0QmluZGluZyIsInRleHRGaXJzdCIsInRleHRMYXN0QmluZGluZyIsInRleHRMYXN0IiwiZnVsbENvbnRleHQiLCJvdGhlck1vZGVsQmluZGluZyIsImFkZFRleHRBcnJhbmdlbWVudFRvQmluZGluZ0V4cHJlc3Npb24iLCJub3QiLCJhZGRUZXh0TGFzdEJpbmRpbmciLCJjb21wbGV4VGV4dEJpbmRpbmciLCJpZkVsc2UiLCJtb2RlbENvbnRlbnQiLCJ0ZXN0UHJvcCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQU9BQSxFQUFBQSxRQUFRLENBQUMsMEJBQUQsRUFBNkIsWUFBTTtBQUMxQyxRQUFJQyxjQUFKO0FBQ0EsUUFBSUMsU0FBSjtBQUNBLFFBQUlDLFVBQUo7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ckQ7QUFDQUgsTUFBQUEsTUFBTSxDQUFDRSxjQUFjLENBQUNnQixrQkFBRCxDQUFmLENBQU4sQ0FBMkNmLFNBQTNDLENBQXFELFlBQXJEO0FBQ0EsVUFBTWlCLFlBQVksR0FBRztBQUNwQkMsUUFBQUEsUUFBUSxFQUFFLElBRFU7QUFFcEJULFFBQUFBLFFBQVEsRUFBRSxZQUZVO0FBR3BCUCxRQUFBQSxVQUFVLEVBQUUsa0JBSFE7QUFJcEJHLFFBQUFBLE1BQU0sRUFBRTtBQUpZLE9BQXJCO0FBTUFSLE1BQUFBLE1BQU0sQ0FBQ0ksd0JBQXdCLENBQUNGLGNBQWMsQ0FBQ2dCLGtCQUFELENBQWYsRUFBcUNFLFlBQXJDLENBQXpCLENBQU4sQ0FBbUZkLE9BQW5GLENBQTJGLCtCQUEzRjtBQUVBYyxNQUFBQSxZQUFZLENBQUNDLFFBQWIsR0FBd0IsS0FBeEI7QUFDQXJCLE1BQUFBLE1BQU0sQ0FBQ0ksd0JBQXdCLENBQUNGLGNBQWMsQ0FBQ2dCLGtCQUFELENBQWYsRUFBcUNFLFlBQXJDLENBQXpCLENBQU4sQ0FBbUZkLE9BQW5GLENBQTJGLFVBQTNGO0FBQ0EsS0FqQ0MsQ0FBRjtBQWtDQSxHQXJHTyxDQUFSIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXRCaW5kaW5nV2l0aFRleHRBcnJhbmdlbWVudCwgYWRkVGV4dEFycmFuZ2VtZW50VG9CaW5kaW5nRXhwcmVzc2lvbiB9IGZyb20gXCJzYXAvZmUvbWFjcm9zL2ZpZWxkL0ZpZWxkVGVtcGxhdGluZ1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IGNvbXBpbGVDRFMsIGdldE1ldGFNb2RlbCwgZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aEZvclByb3BlcnR5LCBldmFsdWF0ZUJpbmRpbmdXaXRoTW9kZWwgfSBmcm9tIFwic2FwL2ZlL3Rlc3QvSmVzdFRlbXBsYXRpbmdIZWxwZXJcIjtcbmltcG9ydCB7IGNvbnZlcnRUeXBlcyB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL01ldGFNb2RlbENvbnZlcnRlclwiO1xuaW1wb3J0IHsgRW50aXR5U2V0LCBFbnRpdHlUeXBlLCBQcm9wZXJ0eSB9IGZyb20gXCJAc2FwLXV4L2Fubm90YXRpb24tY29udmVydGVyXCI7XG5pbXBvcnQgeyBiaW5kaW5nRXhwcmVzc2lvbiwgY29tcGlsZUJpbmRpbmcsIGlmRWxzZSB9IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0JpbmRpbmdFeHByZXNzaW9uXCI7XG5cbmRlc2NyaWJlKFwiRmllbGQgVGVtcGxhdGluZyBUZXN0aW5nXCIsICgpID0+IHtcblx0bGV0IGNvbnZlcnRlZFR5cGVzO1xuXHRsZXQgZW50aXR5U2V0OiBFbnRpdHlTZXQ7XG5cdGxldCBlbnRpdHlUeXBlOiBFbnRpdHlUeXBlO1xuXHRjb25zdCBwcm9wZXJ0aWVzOiBSZWNvcmQ8c3RyaW5nLCBQcm9wZXJ0eT4gPSB7fTtcblx0YmVmb3JlQWxsKGFzeW5jICgpID0+IHtcblx0XHRjb25zdCBzTWV0YWRhdGFVcmwgPSBjb21waWxlQ0RTKHBhdGguam9pbihfX2Rpcm5hbWUsIFwiLi9GaWVsZFRlbXBsYXRpbmcuY2RzXCIpKTtcblx0XHRjb25zdCBtZXRhTW9kZWwgPSBhd2FpdCBnZXRNZXRhTW9kZWwoc01ldGFkYXRhVXJsKTtcblx0XHRjb252ZXJ0ZWRUeXBlcyA9IGNvbnZlcnRUeXBlcyhtZXRhTW9kZWwpO1xuXHRcdGNvbnN0IG1heWJlRW50aXR5U2V0ID0gY29udmVydGVkVHlwZXMuZW50aXR5U2V0cy5maW5kKGV0ID0+IGV0Lm5hbWUgPT09IFwiZ2V0QmluZGluZ1dpdGhUZXh0QXJyYW5nZW1lbnRcIik7XG5cdFx0aWYgKG1heWJlRW50aXR5U2V0KSB7XG5cdFx0XHRlbnRpdHlTZXQgPSBtYXliZUVudGl0eVNldDtcblx0XHRcdGVudGl0eVR5cGUgPSBtYXliZUVudGl0eVNldC5lbnRpdHlUeXBlO1xuXHRcdFx0ZW50aXR5VHlwZS5lbnRpdHlQcm9wZXJ0aWVzLmZvckVhY2gocHJvcCA9PiB7XG5cdFx0XHRcdHByb3BlcnRpZXNbcHJvcC5uYW1lXSA9IHByb3A7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiRXJyb3IgaW4gdGVzdCBzZXR1cFwiKTtcblx0XHR9XG5cdH0pO1xuXG5cdGl0KFwiI2dldEJpbmRpbmdXaXRoVGV4dEFycmFuZ2VtZW50XCIsICgpID0+IHtcblx0XHQvLyBDYXNlcyB0byBjb25zaWRlclxuXG5cdFx0Ly8gVGV4dE9ubHlcblx0XHRjb25zdCB0ZXh0T25seUJpbmRpbmcgPSBnZXRCaW5kaW5nV2l0aFRleHRBcnJhbmdlbWVudChcblx0XHRcdGdldERhdGFNb2RlbE9iamVjdFBhdGhGb3JQcm9wZXJ0eShlbnRpdHlTZXQsIHByb3BlcnRpZXNbXCJ0ZXh0T25seVwiXSksXG5cdFx0XHRiaW5kaW5nRXhwcmVzc2lvbihcInRleHRPbmx5XCIpXG5cdFx0KTtcblx0XHRleHBlY3QodGV4dE9ubHlCaW5kaW5nKS50b01hdGNoU25hcHNob3QoKTtcblx0XHRleHBlY3QoY29tcGlsZUJpbmRpbmcodGV4dE9ubHlCaW5kaW5nKSkudG9Db250YWluKFwidGFyZ2V0VGV4dFwiKTtcblx0XHRleHBlY3QoZXZhbHVhdGVCaW5kaW5nV2l0aE1vZGVsKGNvbXBpbGVCaW5kaW5nKHRleHRPbmx5QmluZGluZyksIHsgdGFyZ2V0VGV4dDogXCJZb2xvXCIgfSkpLnRvRXF1YWwoXCJZb2xvXCIpO1xuXG5cdFx0Ly8gTm8gdGV4dCBhcnJhbmdlbWVudFxuXHRcdGNvbnN0IG5vVGV4dEJpbmRpbmcgPSBnZXRCaW5kaW5nV2l0aFRleHRBcnJhbmdlbWVudChcblx0XHRcdGdldERhdGFNb2RlbE9iamVjdFBhdGhGb3JQcm9wZXJ0eShlbnRpdHlTZXQsIHByb3BlcnRpZXNbXCJub1RleHRcIl0pLFxuXHRcdFx0YmluZGluZ0V4cHJlc3Npb24oXCJub1RleHRcIilcblx0XHQpO1xuXHRcdGV4cGVjdChub1RleHRCaW5kaW5nKS50b01hdGNoU25hcHNob3QoKTtcblx0XHRleHBlY3QoY29tcGlsZUJpbmRpbmcobm9UZXh0QmluZGluZykpLnRvQ29udGFpbihcIm5vVGV4dFwiKTtcblx0XHRleHBlY3QoZXZhbHVhdGVCaW5kaW5nV2l0aE1vZGVsKGNvbXBpbGVCaW5kaW5nKG5vVGV4dEJpbmRpbmcpLCB7IG5vVGV4dDogXCJZb2xvXCIgfSkpLnRvRXF1YWwoXCJZb2xvXCIpO1xuXG5cdFx0Ly8gVGV4dEZpcnN0XG5cdFx0Y29uc3QgdGV4dEZpcnN0QmluZGluZyA9IGdldEJpbmRpbmdXaXRoVGV4dEFycmFuZ2VtZW50KFxuXHRcdFx0Z2V0RGF0YU1vZGVsT2JqZWN0UGF0aEZvclByb3BlcnR5KGVudGl0eVNldCwgcHJvcGVydGllc1tcInRleHRGaXJzdFwiXSksXG5cdFx0XHRiaW5kaW5nRXhwcmVzc2lvbihcInRleHRGaXJzdFwiKVxuXHRcdCk7XG5cdFx0ZXhwZWN0KHRleHRGaXJzdEJpbmRpbmcpLnRvTWF0Y2hTbmFwc2hvdCgpO1xuXHRcdGV4cGVjdChjb21waWxlQmluZGluZyh0ZXh0Rmlyc3RCaW5kaW5nKSkudG9Db250YWluKFwidGV4dEZpcnN0XCIpO1xuXHRcdGV4cGVjdChjb21waWxlQmluZGluZyh0ZXh0Rmlyc3RCaW5kaW5nKSkudG9Db250YWluKFwidGFyZ2V0VGV4dFwiKTtcblx0XHRleHBlY3QoXG5cdFx0XHRldmFsdWF0ZUJpbmRpbmdXaXRoTW9kZWwoY29tcGlsZUJpbmRpbmcodGV4dEZpcnN0QmluZGluZyksIHsgdGV4dEZpcnN0OiBcIllvbG8gTGFzdFwiLCB0YXJnZXRUZXh0OiBcIllvbG8gRGVzY3JpcHRpb25cIiB9KVxuXHRcdCkudG9FcXVhbChcIllvbG8gRGVzY3JpcHRpb24gKFlvbG8gTGFzdClcIik7XG5cblx0XHQvLyBUZXh0TGFzdFxuXHRcdGNvbnN0IHRleHRMYXN0QmluZGluZyA9IGdldEJpbmRpbmdXaXRoVGV4dEFycmFuZ2VtZW50KFxuXHRcdFx0Z2V0RGF0YU1vZGVsT2JqZWN0UGF0aEZvclByb3BlcnR5KGVudGl0eVNldCwgcHJvcGVydGllc1tcInRleHRMYXN0XCJdKSxcblx0XHRcdGJpbmRpbmdFeHByZXNzaW9uKFwidGV4dExhc3RcIilcblx0XHQpO1xuXHRcdGV4cGVjdCh0ZXh0TGFzdEJpbmRpbmcpLnRvTWF0Y2hTbmFwc2hvdCgpO1xuXHRcdGV4cGVjdChjb21waWxlQmluZGluZyh0ZXh0TGFzdEJpbmRpbmcpKS50b0NvbnRhaW4oXCJ0ZXh0TGFzdFwiKTtcblx0XHRleHBlY3QoY29tcGlsZUJpbmRpbmcodGV4dExhc3RCaW5kaW5nKSkudG9Db250YWluKFwidGFyZ2V0VGV4dFwiKTtcblx0XHRleHBlY3QoXG5cdFx0XHRldmFsdWF0ZUJpbmRpbmdXaXRoTW9kZWwoY29tcGlsZUJpbmRpbmcodGV4dExhc3RCaW5kaW5nKSwgeyB0ZXh0TGFzdDogXCJZb2xvIEZpcnN0XCIsIHRhcmdldFRleHQ6IFwiWW9sbyBEZXNjcmlwdGlvblwiIH0pXG5cdFx0KS50b0VxdWFsKFwiWW9sbyBGaXJzdCAoWW9sbyBEZXNjcmlwdGlvbilcIik7XG5cdH0pO1xuXG5cdGl0KFwiI2FkZFRleHRBcnJhbmdlbWVudFRvQmluZGluZ0V4cHJlc3Npb25cIiwgKCkgPT4ge1xuXHRcdGNvbnN0IGZ1bGxDb250ZXh0ID0gZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aEZvclByb3BlcnR5KGVudGl0eVNldCk7XG5cblx0XHRjb25zdCBvdGhlck1vZGVsQmluZGluZyA9IGFkZFRleHRBcnJhbmdlbWVudFRvQmluZGluZ0V4cHJlc3Npb24oYmluZGluZ0V4cHJlc3Npb24oXCJ0ZXh0TGFzdFwiLCBcIm90aGVyTW9kZWxcIiksIGZ1bGxDb250ZXh0KTtcblx0XHRleHBlY3Qob3RoZXJNb2RlbEJpbmRpbmcpLnRvTWF0Y2hTbmFwc2hvdCgpO1xuXHRcdGV4cGVjdChjb21waWxlQmluZGluZyhvdGhlck1vZGVsQmluZGluZykpLnRvQ29udGFpbihcInRleHRMYXN0XCIpO1xuXHRcdGV4cGVjdChjb21waWxlQmluZGluZyhvdGhlck1vZGVsQmluZGluZykpLm5vdC50b0NvbnRhaW4oXCJ0YXJnZXRUZXh0XCIpO1xuXG5cdFx0Y29uc3QgYWRkVGV4dExhc3RCaW5kaW5nID0gYWRkVGV4dEFycmFuZ2VtZW50VG9CaW5kaW5nRXhwcmVzc2lvbihiaW5kaW5nRXhwcmVzc2lvbihcInRleHRMYXN0XCIpLCBmdWxsQ29udGV4dCk7XG5cdFx0ZXhwZWN0KGFkZFRleHRMYXN0QmluZGluZykudG9NYXRjaFNuYXBzaG90KCk7XG5cdFx0ZXhwZWN0KGNvbXBpbGVCaW5kaW5nKGFkZFRleHRMYXN0QmluZGluZykpLnRvQ29udGFpbihcInRleHRMYXN0XCIpO1xuXHRcdGV4cGVjdChjb21waWxlQmluZGluZyhhZGRUZXh0TGFzdEJpbmRpbmcpKS50b0NvbnRhaW4oXCJ0YXJnZXRUZXh0XCIpO1xuXHRcdGV4cGVjdChcblx0XHRcdGV2YWx1YXRlQmluZGluZ1dpdGhNb2RlbChjb21waWxlQmluZGluZyhhZGRUZXh0TGFzdEJpbmRpbmcpLCB7IHRleHRMYXN0OiBcIllvbG8gRmlyc3RcIiwgdGFyZ2V0VGV4dDogXCJZb2xvIERlc2NyaXB0aW9uXCIgfSlcblx0XHQpLnRvRXF1YWwoXCJZb2xvIEZpcnN0IChZb2xvIERlc2NyaXB0aW9uKVwiKTtcblxuXHRcdGNvbnN0IGNvbXBsZXhUZXh0QmluZGluZyA9IGFkZFRleHRBcnJhbmdlbWVudFRvQmluZGluZ0V4cHJlc3Npb24oXG5cdFx0XHRpZkVsc2UoYmluZGluZ0V4cHJlc3Npb24oXCJ0ZXN0UHJvcFwiKSwgYmluZGluZ0V4cHJlc3Npb24oXCJ0ZXh0TGFzdFwiKSwgYmluZGluZ0V4cHJlc3Npb24oXCJub1RleHRcIikpLFxuXHRcdFx0ZnVsbENvbnRleHRcblx0XHQpO1xuXHRcdGV4cGVjdChjb21wbGV4VGV4dEJpbmRpbmcpLnRvTWF0Y2hTbmFwc2hvdCgpO1xuXHRcdGV4cGVjdChjb21waWxlQmluZGluZyhjb21wbGV4VGV4dEJpbmRpbmcpKS50b0NvbnRhaW4oXCJ0ZXh0TGFzdFwiKTtcblx0XHRleHBlY3QoY29tcGlsZUJpbmRpbmcoY29tcGxleFRleHRCaW5kaW5nKSkudG9Db250YWluKFwidGFyZ2V0VGV4dFwiKTtcblx0XHRjb25zdCBtb2RlbENvbnRlbnQgPSB7XG5cdFx0XHR0ZXN0UHJvcDogdHJ1ZSxcblx0XHRcdHRleHRMYXN0OiBcIllvbG8gRmlyc3RcIixcblx0XHRcdHRhcmdldFRleHQ6IFwiWW9sbyBEZXNjcmlwdGlvblwiLFxuXHRcdFx0bm9UZXh0OiBcIk5vdCBZb2xvXCJcblx0XHR9O1xuXHRcdGV4cGVjdChldmFsdWF0ZUJpbmRpbmdXaXRoTW9kZWwoY29tcGlsZUJpbmRpbmcoY29tcGxleFRleHRCaW5kaW5nKSwgbW9kZWxDb250ZW50KSkudG9FcXVhbChcIllvbG8gRmlyc3QgKFlvbG8gRGVzY3JpcHRpb24pXCIpO1xuXG5cdFx0bW9kZWxDb250ZW50LnRlc3RQcm9wID0gZmFsc2U7XG5cdFx0ZXhwZWN0KGV2YWx1YXRlQmluZGluZ1dpdGhNb2RlbChjb21waWxlQmluZGluZyhjb21wbGV4VGV4dEJpbmRpbmcpLCBtb2RlbENvbnRlbnQpKS50b0VxdWFsKFwiTm90IFlvbG9cIik7XG5cdH0pO1xufSk7XG4iXX0=