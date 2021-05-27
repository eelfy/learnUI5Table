sap.ui.define(["sap/fe/macros/internal/Field.metadata", "sap/fe/macros/PhantomUtil", "sap/ui/model/odata/v4/lib/_MetadataRequestor", "sap/ui/model/odata/v4/ODataMetaModel", "sap/ui/core/util/XMLPreprocessor", "sap/base/Log", "xpath", "fs", "@sap/cds-compiler", "prettier", "sap/ui/base/BindingParser", "sap/ui/model/json/JSONModel", "sap/ui/core/InvisibleText", "sap/fe/core/converters/ConverterContext", "sap/base/util/merge", "path"], function (FieldMetadata, PhantomUtil, _MetadataRequestor, ODataMetaModel, XMLPreprocessor, Log, xpath, fs, cds_compiler, prettier, BindingParser, JSONModel, InvisibleText, ConverterContext, merge, path) {
  "use strict";

  var _exports = {};
  var createConverterContext = ConverterContext.createConverterContext;
  var format = prettier.format;
  var to = cds_compiler.to;
  var compileSources = cds_compiler.compileSources;
  var compactModel = cds_compiler.compactModel;
  PhantomUtil.register(FieldMetadata);
  Log.setLevel(1, "sap.ui.core.util.XMLPreprocessor");
  jest.setTimeout(40000);
  var nameSpaceMap = {
    "macros": "sap.fe.macros",
    "control": "sap.fe.core.controls",
    "core": "sap.ui.core",
    "m": "sap.m",
    "mdc": "sap.ui.mdc",
    "mdcField": "sap.ui.mdc.field",
    "u": "sap.ui.unified",
    "macroMicroChart": "sap.fe.macros.microchart",
    "microChart": "sap.suite.ui.microchart"
  };
  var select = xpath.useNamespaces(nameSpaceMap);

  var registerMacro = function (macroMetadata) {
    PhantomUtil.register(macroMetadata);
  };

  _exports.registerMacro = registerMacro;

  var runXPathQuery = function (selector, xmldom) {
    return select(selector, xmldom);
  };

  expect.extend({
    toHaveControl: function (xmldom, selector) {
      var nodes = runXPathQuery("/root".concat(selector), xmldom);
      return {
        message: function () {
          var outputXml = serializeXML(xmldom);
          return "did not find controls matching ".concat(selector, " in generated xml:\n ").concat(outputXml);
        },
        pass: nodes && nodes.length >= 1
      };
    },
    toNotHaveControl: function (xmldom, selector) {
      var nodes = runXPathQuery("/root".concat(selector), xmldom);
      return {
        message: function () {
          var outputXml = serializeXML(xmldom);
          return "There is a control matching ".concat(selector, " in generated xml:\n ").concat(outputXml);
        },
        pass: nodes && nodes.length === 0
      };
    }
  });
  _exports.runXPathQuery = runXPathQuery;

  var getControlAttribute = function (controlSelector, attributeName, xmlDom) {
    var selector = "string(/root".concat(controlSelector, "/@").concat(attributeName, ")");
    return runXPathQuery(selector, xmlDom);
  };

  _exports.getControlAttribute = getControlAttribute;

  var serializeXML = function (xmlDom) {
    var serializer = new window.XMLSerializer();
    var xmlString = serializer.serializeToString(xmlDom).replace(/(?:[\t ]*(?:\r?\n|\r))+/g, "\n").replace(/\\"/g, '"');
    return format(xmlString, {
      parser: "html"
    });
  };
  /**
   * Compile a CDS file into an EDMX file.
   *
   * @param sCDSUrl {string} the path to the file containing the CDS definition. This file MUST declare the namespace
   * sap.fe.test and a service JestService
   * @returns {string} edmxUrl the path of the generated EDMX
   */


  _exports.serializeXML = serializeXML;

  var compileCDS = function (sCDSUrl) {
    var cdsString = fs.readFileSync(sCDSUrl, "utf-8");
    var csn = compileSources({
      "string.cds": cdsString
    }, {});
    var csnModel = compactModel(csn);
    var edmxContent = to.edmx(csnModel, {
      service: "sap.fe.test.JestService"
    });
    var dir = path.resolve(sCDSUrl, "..", "gen");
    var edmxUrl = path.resolve(dir, path.basename(sCDSUrl).replace(".cds", ".xml"));

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    fs.writeFileSync(edmxUrl, edmxContent);
    return edmxUrl;
  };

  _exports.compileCDS = compileCDS;

  var getFakeShellService = function () {
    var contentDensities = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "compact";
    return {
      getContentDensity: function () {
        return contentDensities;
      }
    };
  };

  _exports.getFakeShellService = getFakeShellService;

  var getFakeDiagnostics = function () {
    var issues = [];
    return {
      addIssue: function (issueCategory, issueSeverity, details) {
        issues.push({
          issueCategory: issueCategory,
          issueSeverity: issueSeverity,
          details: details
        });
      },
      getIssues: function () {
        return issues;
      },
      checkIfIssueExists: function (issueCategory, issueSeverity, details) {
        return issues.find(function (issue) {
          issue.issueCategory === issueCategory && issue.issueSeverity === issueSeverity && issue.details === details;
        });
      }
    };
  };

  _exports.getFakeDiagnostics = getFakeDiagnostics;

  var getConverterContext = function (convertedTypes, manifestSettings, templateType) {
    var userContentDensities = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "compact";
    var entitySet = convertedTypes.entitySets.find(function (es) {
      return es.name === manifestSettings.entitySet;
    });
    var dataModelPath = getDataModelObjectPathForProperty(entitySet, entitySet);
    return createConverterContext(convertedTypes, manifestSettings, templateType, getFakeShellService(userContentDensities), getFakeDiagnostics(), merge, dataModelPath);
  };

  _exports.getConverterContext = getConverterContext;

  var getMetaModel = function (sMetadataUrl) {
    try {
      var oRequestor = _MetadataRequestor.create({}, "4.0", {});

      var oMetaModel = new ODataMetaModel(oRequestor, sMetadataUrl, undefined, null);
      return Promise.resolve(oMetaModel.fetchEntityContainer()).then(function () {
        return oMetaModel;
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _exports.getMetaModel = getMetaModel;

  var getDataModelObjectPathForProperty = function (entitySet, property) {
    var targetPath = {
      startingEntitySet: entitySet,
      navigationProperties: [],
      targetObject: property,
      targetEntitySet: entitySet,
      targetEntityType: entitySet.entityType
    };
    targetPath.contextLocation = targetPath;
    return targetPath;
  };

  _exports.getDataModelObjectPathForProperty = getDataModelObjectPathForProperty;

  var evaluateBinding = function (bindingString) {
    var bindingElement = BindingParser.complexParser(bindingString);

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return bindingElement.formatter.apply(undefined, args);
  };

  _exports.evaluateBinding = evaluateBinding;

  var evaluateBindingWithModel = function (bindingString, modelContent) {
    var bindingElement = BindingParser.complexParser(bindingString);
    var jsonModel = new JSONModel(modelContent);
    var text = new InvisibleText();
    text.bindProperty("text", bindingElement);
    text.setModel(jsonModel);
    text.setBindingContext(jsonModel.createBindingContext("/"));
    return text.getText();
  };

  _exports.evaluateBindingWithModel = evaluateBindingWithModel;

  var getTemplatingResult = function (xmlInput, sMetadataUrl, mBindingContexts, mModels) {
    try {
      var templatedXml = "<root>".concat(xmlInput, "</root>");
      var parser = new window.DOMParser();
      var xmlDoc = parser.parseFromString(templatedXml, "text/xml");
      return Promise.resolve(getMetaModel(sMetadataUrl)).then(function (oMetaModel) {
        var oPreprocessorSettings = {
          models: Object.assign({
            metaModel: oMetaModel
          }, mModels),
          bindingContexts: {}
        }; //Inject models and bindingContexts

        Object.keys(mBindingContexts).forEach(function (sKey) {
          /* Assert to make sure the annotations are in the test metadata -> avoid misleading tests */
          expect(typeof oMetaModel.getObject(mBindingContexts[sKey])).toBeDefined();
          var oModel = mModels[sKey] || oMetaModel;
          oPreprocessorSettings.bindingContexts[sKey] = oModel.createBindingContext(mBindingContexts[sKey]); //Value is sPath

          oPreprocessorSettings.models[sKey] = oModel;
        }); //This context for macro testing

        if (oPreprocessorSettings.models["this"]) {
          oPreprocessorSettings.bindingContexts["this"] = oPreprocessorSettings.models["this"].createBindingContext("/");
        }

        return XMLPreprocessor.process(xmlDoc.firstElementChild, {
          name: "Test Fragment"
        }, oPreprocessorSettings);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _exports.getTemplatingResult = getTemplatingResult;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkplc3RUZW1wbGF0aW5nSGVscGVyLnRzIl0sIm5hbWVzIjpbIlBoYW50b21VdGlsIiwicmVnaXN0ZXIiLCJGaWVsZE1ldGFkYXRhIiwiTG9nIiwic2V0TGV2ZWwiLCJqZXN0Iiwic2V0VGltZW91dCIsIm5hbWVTcGFjZU1hcCIsInNlbGVjdCIsInhwYXRoIiwidXNlTmFtZXNwYWNlcyIsInJlZ2lzdGVyTWFjcm8iLCJtYWNyb01ldGFkYXRhIiwicnVuWFBhdGhRdWVyeSIsInNlbGVjdG9yIiwieG1sZG9tIiwiZXhwZWN0IiwiZXh0ZW5kIiwidG9IYXZlQ29udHJvbCIsIm5vZGVzIiwibWVzc2FnZSIsIm91dHB1dFhtbCIsInNlcmlhbGl6ZVhNTCIsInBhc3MiLCJsZW5ndGgiLCJ0b05vdEhhdmVDb250cm9sIiwiZ2V0Q29udHJvbEF0dHJpYnV0ZSIsImNvbnRyb2xTZWxlY3RvciIsImF0dHJpYnV0ZU5hbWUiLCJ4bWxEb20iLCJzZXJpYWxpemVyIiwid2luZG93IiwiWE1MU2VyaWFsaXplciIsInhtbFN0cmluZyIsInNlcmlhbGl6ZVRvU3RyaW5nIiwicmVwbGFjZSIsImZvcm1hdCIsInBhcnNlciIsImNvbXBpbGVDRFMiLCJzQ0RTVXJsIiwiY2RzU3RyaW5nIiwiZnMiLCJyZWFkRmlsZVN5bmMiLCJjc24iLCJjb21waWxlU291cmNlcyIsImNzbk1vZGVsIiwiY29tcGFjdE1vZGVsIiwiZWRteENvbnRlbnQiLCJ0byIsImVkbXgiLCJzZXJ2aWNlIiwiZGlyIiwicGF0aCIsInJlc29sdmUiLCJlZG14VXJsIiwiYmFzZW5hbWUiLCJleGlzdHNTeW5jIiwibWtkaXJTeW5jIiwid3JpdGVGaWxlU3luYyIsImdldEZha2VTaGVsbFNlcnZpY2UiLCJjb250ZW50RGVuc2l0aWVzIiwiZ2V0Q29udGVudERlbnNpdHkiLCJnZXRGYWtlRGlhZ25vc3RpY3MiLCJpc3N1ZXMiLCJhZGRJc3N1ZSIsImlzc3VlQ2F0ZWdvcnkiLCJpc3N1ZVNldmVyaXR5IiwiZGV0YWlscyIsInB1c2giLCJnZXRJc3N1ZXMiLCJjaGVja0lmSXNzdWVFeGlzdHMiLCJmaW5kIiwiaXNzdWUiLCJnZXRDb252ZXJ0ZXJDb250ZXh0IiwiY29udmVydGVkVHlwZXMiLCJtYW5pZmVzdFNldHRpbmdzIiwidGVtcGxhdGVUeXBlIiwidXNlckNvbnRlbnREZW5zaXRpZXMiLCJlbnRpdHlTZXQiLCJlbnRpdHlTZXRzIiwiZXMiLCJuYW1lIiwiZGF0YU1vZGVsUGF0aCIsImdldERhdGFNb2RlbE9iamVjdFBhdGhGb3JQcm9wZXJ0eSIsImNyZWF0ZUNvbnZlcnRlckNvbnRleHQiLCJtZXJnZSIsImdldE1ldGFNb2RlbCIsInNNZXRhZGF0YVVybCIsIm9SZXF1ZXN0b3IiLCJfTWV0YWRhdGFSZXF1ZXN0b3IiLCJjcmVhdGUiLCJvTWV0YU1vZGVsIiwiT0RhdGFNZXRhTW9kZWwiLCJ1bmRlZmluZWQiLCJmZXRjaEVudGl0eUNvbnRhaW5lciIsInByb3BlcnR5IiwidGFyZ2V0UGF0aCIsInN0YXJ0aW5nRW50aXR5U2V0IiwibmF2aWdhdGlvblByb3BlcnRpZXMiLCJ0YXJnZXRPYmplY3QiLCJ0YXJnZXRFbnRpdHlTZXQiLCJ0YXJnZXRFbnRpdHlUeXBlIiwiZW50aXR5VHlwZSIsImNvbnRleHRMb2NhdGlvbiIsImV2YWx1YXRlQmluZGluZyIsImJpbmRpbmdTdHJpbmciLCJiaW5kaW5nRWxlbWVudCIsIkJpbmRpbmdQYXJzZXIiLCJjb21wbGV4UGFyc2VyIiwiYXJncyIsImZvcm1hdHRlciIsImFwcGx5IiwiZXZhbHVhdGVCaW5kaW5nV2l0aE1vZGVsIiwibW9kZWxDb250ZW50IiwianNvbk1vZGVsIiwiSlNPTk1vZGVsIiwidGV4dCIsIkludmlzaWJsZVRleHQiLCJiaW5kUHJvcGVydHkiLCJzZXRNb2RlbCIsInNldEJpbmRpbmdDb250ZXh0IiwiY3JlYXRlQmluZGluZ0NvbnRleHQiLCJnZXRUZXh0IiwiZ2V0VGVtcGxhdGluZ1Jlc3VsdCIsInhtbElucHV0IiwibUJpbmRpbmdDb250ZXh0cyIsIm1Nb2RlbHMiLCJ0ZW1wbGF0ZWRYbWwiLCJET01QYXJzZXIiLCJ4bWxEb2MiLCJwYXJzZUZyb21TdHJpbmciLCJvUHJlcHJvY2Vzc29yU2V0dGluZ3MiLCJtb2RlbHMiLCJPYmplY3QiLCJhc3NpZ24iLCJtZXRhTW9kZWwiLCJiaW5kaW5nQ29udGV4dHMiLCJrZXlzIiwiZm9yRWFjaCIsInNLZXkiLCJnZXRPYmplY3QiLCJ0b0JlRGVmaW5lZCIsIm9Nb2RlbCIsIlhNTFByZXByb2Nlc3NvciIsInByb2Nlc3MiLCJmaXJzdEVsZW1lbnRDaGlsZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBdUJBQSxFQUFBQSxXQUFXLENBQUNDLFFBQVosQ0FBcUJDLGFBQXJCO0FBRUFDLEVBQUFBLEdBQUcsQ0FBQ0MsUUFBSixDQUFhLENBQWIsRUFBZ0Isa0NBQWhCO0FBQ0FDLEVBQUFBLElBQUksQ0FBQ0MsVUFBTCxDQUFnQixLQUFoQjtBQUVBLE1BQU1DLFlBQVksR0FBRztBQUNwQixjQUFVLGVBRFU7QUFFcEIsZUFBVyxzQkFGUztBQUdwQixZQUFRLGFBSFk7QUFJcEIsU0FBSyxPQUplO0FBS3BCLFdBQU8sWUFMYTtBQU1wQixnQkFBWSxrQkFOUTtBQU9wQixTQUFLLGdCQVBlO0FBUXBCLHVCQUFtQiwwQkFSQztBQVNwQixrQkFBYztBQVRNLEdBQXJCO0FBV0EsTUFBTUMsTUFBTSxHQUFHQyxLQUFLLENBQUNDLGFBQU4sQ0FBb0JILFlBQXBCLENBQWY7O0FBRU8sTUFBTUksYUFBYSxHQUFHLFVBQVNDLGFBQVQsRUFBNkI7QUFDekRaLElBQUFBLFdBQVcsQ0FBQ0MsUUFBWixDQUFxQlcsYUFBckI7QUFDQSxHQUZNOzs7O0FBR0EsTUFBTUMsYUFBYSxHQUFHLFVBQVNDLFFBQVQsRUFBMkJDLE1BQTNCLEVBQXFEO0FBQ2pGLFdBQU9QLE1BQU0sQ0FBQ00sUUFBRCxFQUFXQyxNQUFYLENBQWI7QUFDQSxHQUZNOztBQUlQQyxFQUFBQSxNQUFNLENBQUNDLE1BQVAsQ0FBYztBQUNiQyxJQUFBQSxhQURhLFlBQ0NILE1BREQsRUFDU0Qs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Q0FBUDtBQTlCQztBQStCRCxLQXBDK0I7QUFBQTtBQUFBO0FBQUEsR0FBekIiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBGaWVsZE1ldGFkYXRhIGZyb20gXCJzYXAvZmUvbWFjcm9zL2ludGVybmFsL0ZpZWxkLm1ldGFkYXRhXCI7XG5pbXBvcnQgeyBQaGFudG9tVXRpbCB9IGZyb20gXCJzYXAvZmUvbWFjcm9zXCI7XG5pbXBvcnQgeyBfTWV0YWRhdGFSZXF1ZXN0b3IgfSBmcm9tIFwic2FwL3VpL21vZGVsL29kYXRhL3Y0L2xpYlwiO1xuaW1wb3J0IHsgT0RhdGFNZXRhTW9kZWwgfSBmcm9tIFwic2FwL3VpL21vZGVsL29kYXRhL3Y0XCI7XG5pbXBvcnQgeyBYTUxQcmVwcm9jZXNzb3IgfSBmcm9tIFwic2FwL3VpL2NvcmUvdXRpbFwiO1xuaW1wb3J0IHsgTG9nIH0gZnJvbSBcInNhcC9iYXNlXCI7XG5pbXBvcnQgeHBhdGggZnJvbSBcInhwYXRoXCI7XG5pbXBvcnQgKiBhcyBmcyBmcm9tIFwiZnNcIjtcbmltcG9ydCB7IGNvbXBhY3RNb2RlbCwgY29tcGlsZVNvdXJjZXMsIHRvIH0gZnJvbSBcIkBzYXAvY2RzLWNvbXBpbGVyXCI7XG5pbXBvcnQgeyBmb3JtYXQgfSBmcm9tIFwicHJldHRpZXJcIjtcbmltcG9ydCB7IEJpbmRpbmdQYXJzZXIgfSBmcm9tIFwic2FwL3VpL2Jhc2VcIjtcbmltcG9ydCB7IENvbnZlcnRlck91dHB1dCwgRW50aXR5U2V0LCBQcm9wZXJ0eSB9IGZyb20gXCJAc2FwLXV4L2Fubm90YXRpb24tY29udmVydGVyXCI7XG5pbXBvcnQgeyBEYXRhTW9kZWxPYmplY3RQYXRoIH0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvRGF0YU1vZGVsUGF0aEhlbHBlclwiO1xuaW1wb3J0IHsgSlNPTk1vZGVsIH0gZnJvbSBcInNhcC91aS9tb2RlbC9qc29uXCI7XG5pbXBvcnQgeyBJbnZpc2libGVUZXh0IH0gZnJvbSBcInNhcC91aS9jb3JlXCI7XG5pbXBvcnQgeyBCYXNlTWFuaWZlc3RTZXR0aW5ncyB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL01hbmlmZXN0U2V0dGluZ3NcIjtcbmltcG9ydCB7IElzc3VlQ2F0ZWdvcnksIElzc3VlU2V2ZXJpdHkgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9oZWxwZXJzL0lzc3VlTWFuYWdlclwiO1xuaW1wb3J0IHsgSURpYWdub3N0aWNzIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvVGVtcGxhdGVDb252ZXJ0ZXJcIjtcbmltcG9ydCB7IElTaGVsbFNlcnZpY2VzUHJveHksIFRlbXBsYXRlVHlwZSB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL3RlbXBsYXRlcy9CYXNlQ29udmVydGVyXCI7XG5pbXBvcnQgeyBjcmVhdGVDb252ZXJ0ZXJDb250ZXh0IH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvQ29udmVydGVyQ29udGV4dFwiO1xuaW1wb3J0IHsgbWVyZ2UgfSBmcm9tIFwic2FwL2Jhc2UvdXRpbFwiO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tIFwicGF0aFwiO1xuXG5QaGFudG9tVXRpbC5yZWdpc3RlcihGaWVsZE1ldGFkYXRhKTtcblxuTG9nLnNldExldmVsKDEsIFwic2FwLnVpLmNvcmUudXRpbC5YTUxQcmVwcm9jZXNzb3JcIik7XG5qZXN0LnNldFRpbWVvdXQoNDAwMDApO1xuXG5jb25zdCBuYW1lU3BhY2VNYXAgPSB7XG5cdFwibWFjcm9zXCI6IFwic2FwLmZlLm1hY3Jvc1wiLFxuXHRcImNvbnRyb2xcIjogXCJzYXAuZmUuY29yZS5jb250cm9sc1wiLFxuXHRcImNvcmVcIjogXCJzYXAudWkuY29yZVwiLFxuXHRcIm1cIjogXCJzYXAubVwiLFxuXHRcIm1kY1wiOiBcInNhcC51aS5tZGNcIixcblx0XCJtZGNGaWVsZFwiOiBcInNhcC51aS5tZGMuZmllbGRcIixcblx0XCJ1XCI6IFwic2FwLnVpLnVuaWZpZWRcIixcblx0XCJtYWNyb01pY3JvQ2hhcnRcIjogXCJzYXAuZmUubWFjcm9zLm1pY3JvY2hhcnRcIixcblx0XCJtaWNyb0NoYXJ0XCI6IFwic2FwLnN1aXRlLnVpLm1pY3JvY2hhcnRcIlxufTtcbmNvbnN0IHNlbGVjdCA9IHhwYXRoLnVzZU5hbWVzcGFjZXMobmFtZVNwYWNlTWFwKTtcblxuZXhwb3J0IGNvbnN0IHJlZ2lzdGVyTWFjcm8gPSBmdW5jdGlvbihtYWNyb01ldGFkYXRhOiBhbnkpIHtcblx0UGhhbnRvbVV0aWwucmVnaXN0ZXIobWFjcm9NZXRhZGF0YSk7XG59O1xuZXhwb3J0IGNvbnN0IHJ1blhQYXRoUXVlcnkgPSBmdW5jdGlvbihzZWxlY3Rvcjogc3RyaW5nLCB4bWxkb206IE5vZGUgfCB1bmRlZmluZWQpIHtcblx0cmV0dXJuIHNlbGVjdChzZWxlY3RvciwgeG1sZG9tKTtcbn07XG5cbmV4cGVjdC5leHRlbmQoe1xuXHR0b0hhdmVDb250cm9sKHhtbGRvbSwgc2VsZWN0b3IpIHtcblx0XHRjb25zdCBub2RlcyA9IHJ1blhQYXRoUXVlcnkoYC9yb290JHtzZWxlY3Rvcn1gLCB4bWxkb20pO1xuXHRcdHJldHVybiB7XG5cdFx0XHRtZXNzYWdlOiAoKSA9PiB7XG5cdFx0XHRcdGNvbnN0IG91dHB1dFhtbCA9IHNlcmlhbGl6ZVhNTCh4bWxkb20pO1xuXHRcdFx0XHRyZXR1cm4gYGRpZCBub3QgZmluZCBjb250cm9scyBtYXRjaGluZyAke3NlbGVjdG9yfSBpbiBnZW5lcmF0ZWQgeG1sOlxcbiAke291dHB1dFhtbH1gO1xuXHRcdFx0fSxcblx0XHRcdHBhc3M6IG5vZGVzICYmIG5vZGVzLmxlbmd0aCA+PSAxXG5cdFx0fTtcblx0fSxcblx0dG9Ob3RIYXZlQ29udHJvbCh4bWxkb20sIHNlbGVjdG9yKSB7XG5cdFx0Y29uc3Qgbm9kZXMgPSBydW5YUGF0aFF1ZXJ5KGAvcm9vdCR7c2VsZWN0b3J9YCwgeG1sZG9tKTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0bWVzc2FnZTogKCkgPT4ge1xuXHRcdFx0XHRjb25zdCBvdXRwdXRYbWwgPSBzZXJpYWxpemVYTUwoeG1sZG9tKTtcblx0XHRcdFx0cmV0dXJuIGBUaGVyZSBpcyBhIGNvbnRyb2wgbWF0Y2hpbmcgJHtzZWxlY3Rvcn0gaW4gZ2VuZXJhdGVkIHhtbDpcXG4gJHtvdXRwdXRYbWx9YDtcblx0XHRcdH0sXG5cdFx0XHRwYXNzOiBub2RlcyAmJiBub2Rlcy5sZW5ndGggPT09IDBcblx0XHR9O1xuXHR9XG59KTtcblxuZXhwb3J0IGNvbnN0IGdldENvbnRyb2xBdHRyaWJ1dGUgPSBmdW5jdGlvbihjb250cm9sU2VsZWN0b3I6IHN0cmluZywgYXR0cmlidXRlTmFtZTogc3RyaW5nLCB4bWxEb206IE5vZGUpIHtcblx0Y29uc3Qgc2VsZWN0b3IgPSBgc3RyaW5nKC9yb290JHtjb250cm9sU2VsZWN0b3J9L0Ake2F0dHJpYnV0ZU5hbWV9KWA7XG5cdHJldHVybiBydW5YUGF0aFF1ZXJ5KHNlbGVjdG9yLCB4bWxEb20pO1xufTtcblxuZXhwb3J0IGNvbnN0IHNlcmlhbGl6ZVhNTCA9IGZ1bmN0aW9uKHhtbERvbTogTm9kZSkge1xuXHRjb25zdCBzZXJpYWxpemVyID0gbmV3IHdpbmRvdy5YTUxTZXJpYWxpemVyKCk7XG5cdGNvbnN0IHhtbFN0cmluZyA9IHNlcmlhbGl6ZXJcblx0XHQuc2VyaWFsaXplVG9TdHJpbmcoeG1sRG9tKVxuXHRcdC5yZXBsYWNlKC8oPzpbXFx0IF0qKD86XFxyP1xcbnxcXHIpKSsvZywgXCJcXG5cIilcblx0XHQucmVwbGFjZSgvXFxcXFwiL2csICdcIicpO1xuXHRyZXR1cm4gZm9ybWF0KHhtbFN0cmluZywgeyBwYXJzZXI6IFwiaHRtbFwiIH0pO1xufTtcblxuLyoqXG4gKiBDb21waWxlIGEgQ0RTIGZpbGUgaW50byBhbiBFRE1YIGZpbGUuXG4gKlxuICogQHBhcmFtIHNDRFNVcmwge3N0cmluZ30gdGhlIHBhdGggdG8gdGhlIGZpbGUgY29udGFpbmluZyB0aGUgQ0RTIGRlZmluaXRpb24uIFRoaXMgZmlsZSBNVVNUIGRlY2xhcmUgdGhlIG5hbWVzcGFjZVxuICogc2FwLmZlLnRlc3QgYW5kIGEgc2VydmljZSBKZXN0U2VydmljZVxuICogQHJldHVybnMge3N0cmluZ30gZWRteFVybCB0aGUgcGF0aCBvZiB0aGUgZ2VuZXJhdGVkIEVETVhcbiAqL1xuZXhwb3J0IGNvbnN0IGNvbXBpbGVDRFMgPSBmdW5jdGlvbihzQ0RTVXJsOiBzdHJpbmcpIHtcblx0Y29uc3QgY2RzU3RyaW5nID0gZnMucmVhZEZpbGVTeW5jKHNDRFNVcmwsIFwidXRmLThcIik7XG5cdGNvbnN0IGNzbiA9IGNvbXBpbGVTb3VyY2VzKHsgXCJzdHJpbmcuY2RzXCI6IGNkc1N0cmluZyB9LCB7fSk7XG5cdGNvbnN0IGNzbk1vZGVsID0gY29tcGFjdE1vZGVsKGNzbik7XG5cdGNvbnN0IGVkbXhDb250ZW50ID0gdG8uZWRteChjc25Nb2RlbCwgeyBzZXJ2aWNlOiBcInNhcC5mZS50ZXN0Lkplc3RTZXJ2aWNlXCIgfSk7XG5cdGNvbnN0IGRpciA9IHBhdGgucmVzb2x2ZShzQ0RTVXJsLCBcIi4uXCIsIFwiZ2VuXCIpO1xuXHRjb25zdCBlZG14VXJsID0gcGF0aC5yZXNvbHZlKGRpciwgcGF0aC5iYXNlbmFtZShzQ0RTVXJsKS5yZXBsYWNlKFwiLmNkc1wiLCBcIi54bWxcIikpO1xuXG5cdGlmICghZnMuZXhpc3RzU3luYyhkaXIpKSB7XG5cdFx0ZnMubWtkaXJTeW5jKGRpcik7XG5cdH1cblxuXHRmcy53cml0ZUZpbGVTeW5jKGVkbXhVcmwsIGVkbXhDb250ZW50KTtcblx0cmV0dXJuIGVkbXhVcmw7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0RmFrZVNoZWxsU2VydmljZSA9IGZ1bmN0aW9uKGNvbnRlbnREZW5zaXRpZXM6IHN0cmluZyA9IFwiY29tcGFjdFwiKTogSVNoZWxsU2VydmljZXNQcm94eSB7XG5cdHJldHVybiB7XG5cdFx0Z2V0Q29udGVudERlbnNpdHkoKTogc3RyaW5nIHtcblx0XHRcdHJldHVybiBjb250ZW50RGVuc2l0aWVzO1xuXHRcdH1cblx0fTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRGYWtlRGlhZ25vc3RpY3MgPSBmdW5jdGlvbigpOiBJRGlhZ25vc3RpY3Mge1xuXHRjb25zdCBpc3N1ZXM6IGFueVtdID0gW107XG5cdHJldHVybiB7XG5cdFx0YWRkSXNzdWUoaXNzdWVDYXRlZ29yeTogSXNzdWVDYXRlZ29yeSwgaXNzdWVTZXZlcml0eTogSXNzdWVTZXZlcml0eSwgZGV0YWlsczogc3RyaW5nKTogdm9pZCB7XG5cdFx0XHRpc3N1ZXMucHVzaCh7XG5cdFx0XHRcdGlzc3VlQ2F0ZWdvcnksXG5cdFx0XHRcdGlzc3VlU2V2ZXJpdHksXG5cdFx0XHRcdGRldGFpbHNcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0Z2V0SXNzdWVzKCk6IGFueVtdIHtcblx0XHRcdHJldHVybiBpc3N1ZXM7XG5cdFx0fSxcblx0XHRjaGVja0lmSXNzdWVFeGlzdHMoaXNzdWVDYXRlZ29yeTogSXNzdWVDYXRlZ29yeSwgaXNzdWVTZXZlcml0eTogSXNzdWVTZXZlcml0eSwgZGV0YWlsczogc3RyaW5nKTogYm9vbGVhbiB7XG5cdFx0XHRyZXR1cm4gaXNzdWVzLmZpbmQoaXNzdWUgPT4ge1xuXHRcdFx0XHRpc3N1ZS5pc3N1ZUNhdGVnb3J5ID09PSBpc3N1ZUNhdGVnb3J5ICYmIGlzc3VlLmlzc3VlU2V2ZXJpdHkgPT09IGlzc3VlU2V2ZXJpdHkgJiYgaXNzdWUuZGV0YWlscyA9PT0gZGV0YWlscztcblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRDb252ZXJ0ZXJDb250ZXh0ID0gZnVuY3Rpb24oXG5cdGNvbnZlcnRlZFR5cGVzOiBDb252ZXJ0ZXJPdXRwdXQsXG5cdG1hbmlmZXN0U2V0dGluZ3M6IEJhc2VNYW5pZmVzdFNldHRpbmdzLFxuXHR0ZW1wbGF0ZVR5cGU6IFRlbXBsYXRlVHlwZSxcblx0dXNlckNvbnRlbnREZW5zaXRpZXM6IHN0cmluZyA9IFwiY29tcGFjdFwiXG4pIHtcblx0Y29uc3QgZW50aXR5U2V0ID0gY29udmVydGVkVHlwZXMuZW50aXR5U2V0cy5maW5kKGVzID0+IGVzLm5hbWUgPT09IG1hbmlmZXN0U2V0dGluZ3MuZW50aXR5U2V0KTtcblx0Y29uc3QgZGF0YU1vZGVsUGF0aCA9IGdldERhdGFNb2RlbE9iamVjdFBhdGhGb3JQcm9wZXJ0eShlbnRpdHlTZXQgYXMgRW50aXR5U2V0LCBlbnRpdHlTZXQpO1xuXHRyZXR1cm4gY3JlYXRlQ29udmVydGVyQ29udGV4dChcblx0XHRjb252ZXJ0ZWRUeXBlcyxcblx0XHRtYW5pZmVzdFNldHRpbmdzLFxuXHRcdHRlbXBsYXRlVHlwZSxcblx0XHRnZXRGYWtlU2hlbGxTZXJ2aWNlKHVzZXJDb250ZW50RGVuc2l0aWVzKSxcblx0XHRnZXRGYWtlRGlhZ25vc3RpY3MoKSxcblx0XHRtZXJnZSxcblx0XHRkYXRhTW9kZWxQYXRoXG5cdCk7XG59O1xuZXhwb3J0IGNvbnN0IGdldE1ldGFNb2RlbCA9IGFzeW5jIGZ1bmN0aW9uKHNNZXRhZGF0YVVybDogc3RyaW5nKSB7XG5cdGNvbnN0IG9SZXF1ZXN0b3IgPSBfTWV0YWRhdGFSZXF1ZXN0b3IuY3JlYXRlKHt9LCBcIjQuMFwiLCB7fSk7XG5cdGNvbnN0IG9NZXRhTW9kZWwgPSBuZXcgT0RhdGFNZXRhTW9kZWwob1JlcXVlc3Rvciwgc01ldGFkYXRhVXJsLCB1bmRlZmluZWQsIG51bGwpO1xuXHRhd2FpdCBvTWV0YU1vZGVsLmZldGNoRW50aXR5Q29udGFpbmVyKCk7XG5cdHJldHVybiBvTWV0YU1vZGVsO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldERhdGFNb2RlbE9iamVjdFBhdGhGb3JQcm9wZXJ0eSA9IGZ1bmN0aW9uKGVudGl0eVNldDogRW50aXR5U2V0LCBwcm9wZXJ0eT86IFByb3BlcnR5IHwgRW50aXR5U2V0KTogRGF0YU1vZGVsT2JqZWN0UGF0aCB7XG5cdGNvbnN0IHRhcmdldFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGggPSB7XG5cdFx0c3RhcnRpbmdFbnRpdHlTZXQ6IGVudGl0eVNldCxcblx0XHRuYXZpZ2F0aW9uUHJvcGVydGllczogW10sXG5cdFx0dGFyZ2V0T2JqZWN0OiBwcm9wZXJ0eSxcblx0XHR0YXJnZXRFbnRpdHlTZXQ6IGVudGl0eVNldCxcblx0XHR0YXJnZXRFbnRpdHlUeXBlOiBlbnRpdHlTZXQuZW50aXR5VHlwZVxuXHR9O1xuXHR0YXJnZXRQYXRoLmNvbnRleHRMb2NhdGlvbiA9IHRhcmdldFBhdGg7XG5cdHJldHVybiB0YXJnZXRQYXRoO1xufTtcblxuZXhwb3J0IGNvbnN0IGV2YWx1YXRlQmluZGluZyA9IGZ1bmN0aW9uKGJpbmRpbmdTdHJpbmc6IHN0cmluZywgLi4uYXJnczogYW55W10pIHtcblx0Y29uc3QgYmluZGluZ0VsZW1lbnQgPSBCaW5kaW5nUGFyc2VyLmNvbXBsZXhQYXJzZXIoYmluZGluZ1N0cmluZyk7XG5cdHJldHVybiBiaW5kaW5nRWxlbWVudC5mb3JtYXR0ZXIuYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcbn07XG5cbmV4cG9ydCBjb25zdCBldmFsdWF0ZUJpbmRpbmdXaXRoTW9kZWwgPSBmdW5jdGlvbihiaW5kaW5nU3RyaW5nOiBzdHJpbmcgfCB1bmRlZmluZWQsIG1vZGVsQ29udGVudDogYW55KSB7XG5cdGNvbnN0IGJpbmRpbmdFbGVtZW50ID0gQmluZGluZ1BhcnNlci5jb21wbGV4UGFyc2VyKGJpbmRpbmdTdHJpbmcpO1xuXHRjb25zdCBqc29uTW9kZWwgPSBuZXcgSlNPTk1vZGVsKG1vZGVsQ29udGVudCk7XG5cdGNvbnN0IHRleHQgPSBuZXcgSW52aXNpYmxlVGV4dCgpO1xuXHR0ZXh0LmJpbmRQcm9wZXJ0eShcInRleHRcIiwgYmluZGluZ0VsZW1lbnQpO1xuXHR0ZXh0LnNldE1vZGVsKGpzb25Nb2RlbCk7XG5cdHRleHQuc2V0QmluZGluZ0NvbnRleHQoanNvbk1vZGVsLmNyZWF0ZUJpbmRpbmdDb250ZXh0KFwiL1wiKSk7XG5cdHJldHVybiB0ZXh0LmdldFRleHQoKTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRUZW1wbGF0aW5nUmVzdWx0ID0gYXN5bmMgZnVuY3Rpb24oXG5cdHhtbElucHV0OiBzdHJpbmcsXG5cdHNNZXRhZGF0YVVybDogc3RyaW5nLFxuXHRtQmluZGluZ0NvbnRleHRzOiB7IFt4OiBzdHJpbmddOiBhbnk7IGVudGl0eVNldD86IHN0cmluZyB9LFxuXHRtTW9kZWxzOiB7IFt4OiBzdHJpbmddOiBPRGF0YU1ldGFNb2RlbCB9XG4pIHtcblx0Y29uc3QgdGVtcGxhdGVkWG1sID0gYDxyb290PiR7eG1sSW5wdXR9PC9yb290PmA7XG5cdGNvbnN0IHBhcnNlciA9IG5ldyB3aW5kb3cuRE9NUGFyc2VyKCk7XG5cdGNvbnN0IHhtbERvYyA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcodGVtcGxhdGVkWG1sLCBcInRleHQveG1sXCIpO1xuXG5cdGNvbnN0IG9NZXRhTW9kZWwgPSBhd2FpdCBnZXRNZXRhTW9kZWwoc01ldGFkYXRhVXJsKTtcblx0Y29uc3Qgb1ByZXByb2Nlc3NvclNldHRpbmdzOiBhbnkgPSB7XG5cdFx0bW9kZWxzOiBPYmplY3QuYXNzaWduKFxuXHRcdFx0e1xuXHRcdFx0XHRtZXRhTW9kZWw6IG9NZXRhTW9kZWxcblx0XHRcdH0sXG5cdFx0XHRtTW9kZWxzXG5cdFx0KSxcblx0XHRiaW5kaW5nQ29udGV4dHM6IHt9XG5cdH07XG5cblx0Ly9JbmplY3QgbW9kZWxzIGFuZCBiaW5kaW5nQ29udGV4dHNcblx0T2JqZWN0LmtleXMobUJpbmRpbmdDb250ZXh0cykuZm9yRWFjaChmdW5jdGlvbihzS2V5KSB7XG5cdFx0LyogQXNzZXJ0IHRvIG1ha2Ugc3VyZSB0aGUgYW5ub3RhdGlvbnMgYXJlIGluIHRoZSB0ZXN0IG1ldGFkYXRhIC0+IGF2b2lkIG1pc2xlYWRpbmcgdGVzdHMgKi9cblx0XHRleHBlY3QodHlwZW9mIG9NZXRhTW9kZWwuZ2V0T2JqZWN0KG1CaW5kaW5nQ29udGV4dHNbc0tleV0pKS50b0JlRGVmaW5lZCgpO1xuXHRcdGNvbnN0IG9Nb2RlbCA9IG1Nb2RlbHNbc0tleV0gfHwgb01ldGFNb2RlbDtcblx0XHRvUHJlcHJvY2Vzc29yU2V0dGluZ3MuYmluZGluZ0NvbnRleHRzW3NLZXldID0gb01vZGVsLmNyZWF0ZUJpbmRpbmdDb250ZXh0KG1CaW5kaW5nQ29udGV4dHNbc0tleV0pOyAvL1ZhbHVlIGlzIHNQYXRoXG5cdFx0b1ByZXByb2Nlc3NvclNldHRpbmdzLm1vZGVsc1tzS2V5XSA9IG9Nb2RlbDtcblx0fSk7XG5cblx0Ly9UaGlzIGNvbnRleHQgZm9yIG1hY3JvIHRlc3Rpbmdcblx0aWYgKG9QcmVwcm9jZXNzb3JTZXR0aW5ncy5tb2RlbHNbXCJ0aGlzXCJdKSB7XG5cdFx0b1ByZXByb2Nlc3NvclNldHRpbmdzLmJpbmRpbmdDb250ZXh0c1tcInRoaXNcIl0gPSBvUHJlcHJvY2Vzc29yU2V0dGluZ3MubW9kZWxzW1widGhpc1wiXS5jcmVhdGVCaW5kaW5nQ29udGV4dChcIi9cIik7XG5cdH1cblxuXHRyZXR1cm4gWE1MUHJlcHJvY2Vzc29yLnByb2Nlc3MoeG1sRG9jLmZpcnN0RWxlbWVudENoaWxkISwgeyBuYW1lOiBcIlRlc3QgRnJhZ21lbnRcIiB9LCBvUHJlcHJvY2Vzc29yU2V0dGluZ3MpO1xufTtcbiJdfQ==