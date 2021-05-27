sap.ui.define(["path", "sap/fe/test/JestTemplatingHelper", "sap/fe/core/converters/MetaModelConverter"], function (path, JestTemplatingHelper, MetaModelConverter) {
  "use strict";

  var convertTypes = MetaModelConverter.convertTypes;
  var compileCDS = JestTemplatingHelper.compileCDS;
  var getMetaModel = JestTemplatingHelper.getMetaModel;
  describe("MetaModel Converter can transform the metamodel into a pure object construct", function () {
    var metaModel;
    beforeAll(function () {
      try {
        var sMetadataUrl = compileCDS(path.join(__dirname, "../data/MetaModelConverter.cds"));
        return Promise.resolve(getMetaModel(sMetadataUrl)).then(function (_getMetaModel) {
          metaModel = _getMetaModel;
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    it("can convert it", function () {
      var _convertedType$entity, _convertedType$entity2;

      var convertedType = convertTypes(metaModel);
      expect(convertedType.entitySets.length).toEqual(1);
      expect((_convertedType$entity = convertedType.entitySets[0].annotations.Common) === null || _convertedType$entity === void 0 ? void 0 : _convertedType$entity.DraftRoot).not.toBeNull();
      expect((_convertedType$entity2 = convertedType.entitySets[0].annotations.Common) === null || _convertedType$entity2 === void 0 ? void 0 : _convertedType$entity2.DraftRoot).not.toBeUndefined();
      expect(convertedType.entityTypes.length).toEqual(2);
      expect(convertedType.entityTypes[1].name).toEqual("TestEntity");
      expect(convertedType.entityTypes[1].entityProperties.length).toEqual(29);
    });
  });
  describe("MetaModel Converter - handling of bound actions ", function () {
    var oMetaModel;
    beforeAll(function () {
      try {
        var sMetadataUrl = compileCDS(path.join(__dirname, "../data/MetaModelConverterBoundAction.cds"));
        return Promise.resolve(getMetaModel(sMetadataUrl)).then(function (_getMetaModel2) {
          oMetaModel = _getMetaModel2;
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    it("builds the fully qualified name of bound actions correctly", function () {
      var _convertedType$action, _convertedType$action2, _convertedType$action3, _convertedType$action4;

      var convertedType = convertTypes(oMetaModel);
      expect((_convertedType$action = convertedType.actions.find(function (x) {
        return x.name === "myNewAction";
      })) === null || _convertedType$action === void 0 ? void 0 : _convertedType$action.fullyQualifiedName).toEqual("sap.fe.test.JestService.myNewAction(Collection(sap.fe.test.JestService.TestEntity))");
      expect((_convertedType$action2 = convertedType.actions.find(function (x) {
        return x.name === "myNewAction";
      })) === null || _convertedType$action2 === void 0 ? void 0 : _convertedType$action2.sourceEntityType).not.toBeUndefined();
      expect((_convertedType$action3 = convertedType.actions.find(function (x) {
        return x.name === "myBoundAction";
      })) === null || _convertedType$action3 === void 0 ? void 0 : _convertedType$action3.fullyQualifiedName).toEqual("sap.fe.test.JestService.myBoundAction(sap.fe.test.JestService.secondEntity)");
      expect((_convertedType$action4 = convertedType.actions.find(function (x) {
        return x.name === "myBoundAction";
      })) === null || _convertedType$action4 === void 0 ? void 0 : _convertedType$action4.sourceEntityType).not.toBeUndefined();
    });
  });
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1ldGFNb2RlbENvbnZlcnRlci5zcGVjLnRzIl0sIm5hbWVzIjpbImRlc2NyaWJlIiwibWV0YU1vZGVsIiwiYmVmb3JlQWxsIiwic01ldGFkYXRhVXJsIiwiY29tcGlsZUNEUyIsInBhdGgiLCJqb2luIiwiX19kaXJuYW1lIiwiZ2V0TWV0YU1vZGVsIiwiaXQiLCJjb252ZXJ0ZWRUeXBlIiwiY29udmVydFR5cGVzIiwiZXhwZWN0IiwiZW50aXR5U2V0cyIsImxlbmd0aCIsInRvRXF1YWwiLCJhbm5vdGF0aW9ucyIsIkNvbW1vbiIsIkRyYWZ0Um9vdCIsIm5vdCIsInRvQmVOdWxsIiwidG9CZVVuZGVmaW5lZCIsImVudGl0eVR5cGVzIiwibmFtZSIsImVudGl0eVByb3BlcnRpZXMiLCJvTWV0YU1vZGVsIiwiYWN0aW9ucyIsImZpbmQiLCJ4IiwiZnVsbHlRdWFsaWZpZWROYW1lIiwic291cmNlRW50aXR5VHlwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBS0FBLEVBQUFBLFFBQVEsQ0FBQyw4RUFBRCxFQUFpRixZQUFXO0FBQ25HLFFBQUlDLFNBQUo7QUFDQUMsSUFBQUEsU0FBUztBQUFBLFVBQWtCO0FBQzFCLFlBQU1DLFlBQVksR0FBR0MsVUFBVSxDQUFDQyxJQUFJLENBQUNDLElBQUwsQ0FBVUMsU0FBVixFQUFxQixnQ0FBckIsQ0FBRCxDQUEvQjtBQUQwQiwrQkFFUkMsWUFBWSxDQUFDTCxZQUFELENBRko7QUFFMUJGLFVBQUFBLFNBQVMsZ0JBQVQ7QUFGMEI7QUFHMUIsT0FIUTtBQUFBO0FBQUE7QUFBQSxNQUFUO0FBS0FRLElBQUFBLEVBQUUsQ0FBQyxnQkFBRCxFQUFtQixZQUFXO0FBQUE7O0FBQy9CLFVBQU1DLGFBQWEsR0FBR0MsWUFBWSxDQUFDVixTQUFELENBQWxDO0FBQ0FXLE1BQUFBLE1BQU0sQ0FBQ0YsYUFBYSxDQUFDRyxVQUFkLENBQXlCQyxNQUExQixDQUFOLENBQXdDQyxPQUF4QyxDQUFnRCxDQUFoRDtBQUNBSCxNQUFBQSxNQUFNLDBCQUFDRixhQUFhLENBQUNHLFVBQWQsQ0FBeUIsQ0FBekIsRUFBNEJHLFdBQTVCLENBQXdDQyxNQUF6QywwREFBQyxzQkFBZ0RDLFNBQWpELENBQU4sQ0FBa0VDLEdBQWxFLENBQXNFQyxRQUF0RTtBQUNBUixNQUFBQSxNQUFNLDJCQUFDRixhQUFhLENBQUNHLFVBQWQsQ0FBeUIsQ0FBekIsRUFBNEJHLFdBQTVCLENBQXdDQyxNQUF6QywyREFBQyx1QkFBZ0RDLFNBQWpELENBQU4sQ0FBa0VDLEdBQWxFLENBQXNFRSxhQUF0RTtBQUNBVCxNQUFBQSxNQUFNLENBQUNGLGFBQWEsQ0FBQ1ksV0FBZCxDQUEwQlIsTUFBM0IsQ0FBTixDQUF5Q0MsT0FBekMsQ0FBaUQsQ0FBakQ7QUFDQUgsTUFBQUEsTUFBTSxDQUFDRixhQUFhLENBQUNZLFdBQWQsQ0FBMEIsQ0FBMUIsRUFBNkJDLElBQTlCLENBQU4sQ0FBMENSLE9BQTFDLENBQWtELFlBQWxEO0FBQ0FILE1BQUFBLE1BQU0sQ0FBQ0YsYUFBYSxDQUFDWSxXQUFkLENBQTBCLENBQTFCLEVBQTZCRSxnQkFBN0IsQ0FBOENWLE1BQS9DLENBQU4sQ0FBNkRDLE9BQTdELENBQXFFLEVBQXJFO0FBQ0EsS0FSQyxDQUFGO0FBU0EsR0FoQk8sQ0FBUjtBQWtCQWYsRUFBQUEsUUFBUSxDQUFDLGtEQUFELEVBQXFELFlBQVc7QUFDdkUsUUFBSXlCLFVBQUo7QUFFQXZCLElBQUFBLFNBQVM7QUFBQSxVQUFrQjtBQUMxQixZQUFNQyxZQUFZLEdBQUdDLFVBQVUsQ0FBQ0MsSUFBSSxDQUFDQyxJQUFMLENBQVVDLFNBQVYsRUFBcUIsMkNBQXJCLENBQUQsQ0FBL0I7QUFEMEIsK0JBRVBDLFlBQVksQ0FBQ0wsWUFBRCxDQUZMO0FBRTFCc0IsVUFBQUEsVUFBVSxpQkFBVjtBQUYwQjtBQUcxQixPQUhRO0FBQUE7QUFBQTtBQUFBLE1BQVQ7QUFLQWhCLElBQUFBLEVBQUUsQ0FBQyw0REFBRCxFQUErRCxZQUFNO0FBQUE7O0FBQ3RFLFVBQU1DLGFBQWEsR0FBR0MsWUFBWSxDQUFDYyxVQUFELENBQWxDO0FBQ0FiLE1BQUFBLE1BQU0sMEJBQUNGLGFBQWEsQ0FBQ2dCLE9BQWQsQ0FBc0JDLElBQXRCLENBQTJCLFVBQUFDLENBQUM7QUFBQSxlQUFJQSxDQUFDLENBQUNMLElBQUYsS0FBVyxhQUFmO0FBQUEsT0FBNUIsQ0FBRCwwREFBQyxzQkFBMkRNLGtCQUE1RCxDQUFOLENBQXNGZCxPQUF0RixDQUNDLHFGQUREO0FBR0FILE1BQUFBLE1BQU0sMkJBQUNGLGFBQWEsQ0FBQ2dCLE9BQWQsQ0FBc0JDLElBQXRCLENBQTJCLFVBQUFDLENBQUM7QUFBQSxlQUFJQSxDQUFDLENBQUNMLElBQUYsS0FBVyxhQUFmO0FBQUEsT0FBNUIsQ0FBRCwyREFBQyx1QkFBMkRPLGdCQUE1RCxDQUFOLENBQW9GWCxHQUFwRixDQUF3RkUsYUFBeEY7QUFDQVQsTUFBQUEsTUFBTSwyQkFBQ0YsYUFBYSxDQUFDZ0IsT0FBZCxDQUFzQkMsSUFBdEIsQ0FBMkIsVUFBQUMsQ0FBQztBQUFBLGVBQUlBLENBQUMsQ0FBQ0wsSUFBRixLQUFXLGVBQWY7QUFBQSxPQUE1QixDQUFELDJEQUFDLHVCQUE2RE0sa0JBQTlELENBQU4sQ0FBd0ZkLE9BQXhGLENBQ0MsNkVBREQ7QUFHQUgsTUFBQUEsTUFBTSwyQkFBQ0YsYUFBYSxDQUFDZ0IsT0FBZCxDQUFzQkMsSUFBdEIsQ0FBMkIsVUFBQUMsQ0FBQztBQUFBLGVBQUlBLENBQUMsQ0FBQ0wsSUFBRixLQUFXLGVBQWY7QUFBQSxPQUE1QixDQUFELDJEQUFDLHVCQUE2RE8sZ0JBQTlELENBQU4sQ0FBc0ZYLEdBQXRGLENBQTBGRSxhQUExRjtBQUNBLEtBVkMsQ0FBRjtBQVdBLEdBbkJPLENBQVIiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBnZXRNZXRhTW9kZWwsIGNvbXBpbGVDRFMgfSBmcm9tIFwic2FwL2ZlL3Rlc3QvSmVzdFRlbXBsYXRpbmdIZWxwZXJcIjtcbmltcG9ydCB7IE9EYXRhTWV0YU1vZGVsIH0gZnJvbSBcInNhcC91aS9tb2RlbC9vZGF0YS92NFwiO1xuaW1wb3J0IHsgY29udmVydFR5cGVzIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvTWV0YU1vZGVsQ29udmVydGVyXCI7XG5cbmRlc2NyaWJlKFwiTWV0YU1vZGVsIENvbnZlcnRlciBjYW4gdHJhbnNmb3JtIHRoZSBtZXRhbW9kZWwgaW50byBhIHB1cmUgb2JqZWN0IGNvbnN0cnVjdFwiLCBmdW5jdGlvbigpIHtcblx0bGV0IG1ldGFNb2RlbDogT0RhdGFNZXRhTW9kZWw7XG5cdGJlZm9yZUFsbChhc3luYyBmdW5jdGlvbigpIHtcblx0XHRjb25zdCBzTWV0YWRhdGFVcmwgPSBjb21waWxlQ0RTKHBhdGguam9pbihfX2Rpcm5hbWUsIFwiLi4vZGF0YS9NZXRhTW9kZWxDb252ZXJ0ZXIuY2RzXCIpKTtcblx0XHRtZXRhTW9kZWwgPSBhd2FpdCBnZXRNZXRhTW9kZWwoc01ldGFkYXRhVXJsKTtcblx0fSk7XG5cblx0aXQoXCJjYW4gY29udmVydCBpdFwiLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCBjb252ZXJ0ZWRUeXBlID0gY29udmVydFR5cGVzKG1ldGFNb2RlbCk7XG5cdFx0ZXhwZWN0KGNvbnZlcnRlZFR5cGUuZW50aXR5U2V0cy5sZW5ndGgpLnRvRXF1YWwoMSk7XG5cdFx0ZXhwZWN0KGNvbnZlcnRlZFR5cGUuZW50aXR5U2V0c1swXS5hbm5vdGF0aW9ucy5Db21tb24/LkRyYWZ0Um9vdCkubm90LnRvQmVOdWxsKCk7XG5cdFx0ZXhwZWN0KGNvbnZlcnRlZFR5cGUuZW50aXR5U2V0c1swXS5hbm5vdGF0aW9ucy5Db21tb24/LkRyYWZ0Um9vdCkubm90LnRvQmVVbmRlZmluZWQoKTtcblx0XHRleHBlY3QoY29udmVydGVkVHlwZS5lbnRpdHlUeXBlcy5sZW5ndGgpLnRvRXF1YWwoMik7XG5cdFx0ZXhwZWN0KGNvbnZlcnRlZFR5cGUuZW50aXR5VHlwZXNbMV0ubmFtZSkudG9FcXVhbChcIlRlc3RFbnRpdHlcIik7XG5cdFx0ZXhwZWN0KGNvbnZlcnRlZFR5cGUuZW50aXR5VHlwZXNbMV0uZW50aXR5UHJvcGVydGllcy5sZW5ndGgpLnRvRXF1YWwoMjkpO1xuXHR9KTtcbn0pO1xuXG5kZXNjcmliZShcIk1ldGFNb2RlbCBDb252ZXJ0ZXIgLSBoYW5kbGluZyBvZiBib3VuZCBhY3Rpb25zIFwiLCBmdW5jdGlvbigpIHtcblx0bGV0IG9NZXRhTW9kZWw6IE9EYXRhTWV0YU1vZGVsO1xuXG5cdGJlZm9yZUFsbChhc3luYyBmdW5jdGlvbigpIHtcblx0XHRjb25zdCBzTWV0YWRhdGFVcmwgPSBjb21waWxlQ0RTKHBhdGguam9pbihfX2Rpcm5hbWUsIFwiLi4vZGF0YS9NZXRhTW9kZWxDb252ZXJ0ZXJCb3VuZEFjdGlvbi5jZHNcIikpO1xuXHRcdG9NZXRhTW9kZWwgPSBhd2FpdCBnZXRNZXRhTW9kZWwoc01ldGFkYXRhVXJsKTtcblx0fSk7XG5cblx0aXQoXCJidWlsZHMgdGhlIGZ1bGx5IHF1YWxpZmllZCBuYW1lIG9mIGJvdW5kIGFjdGlvbnMgY29ycmVjdGx5XCIsICgpID0+IHtcblx0XHRjb25zdCBjb252ZXJ0ZWRUeXBlID0gY29udmVydFR5cGVzKG9NZXRhTW9kZWwpO1xuXHRcdGV4cGVjdChjb252ZXJ0ZWRUeXBlLmFjdGlvbnMuZmluZCh4ID0+IHgubmFtZSA9PT0gXCJteU5ld0FjdGlvblwiKT8uZnVsbHlRdWFsaWZpZWROYW1lKS50b0VxdWFsKFxuXHRcdFx0XCJzYXAuZmUudGVzdC5KZXN0U2VydmljZS5teU5ld0FjdGlvbihDb2xsZWN0aW9uKHNhcC5mZS50ZXN0Lkplc3RTZXJ2aWNlLlRlc3RFbnRpdHkpKVwiXG5cdFx0KTtcblx0XHRleHBlY3QoY29udmVydGVkVHlwZS5hY3Rpb25zLmZpbmQoeCA9PiB4Lm5hbWUgPT09IFwibXlOZXdBY3Rpb25cIik/LnNvdXJjZUVudGl0eVR5cGUpLm5vdC50b0JlVW5kZWZpbmVkKCk7XG5cdFx0ZXhwZWN0KGNvbnZlcnRlZFR5cGUuYWN0aW9ucy5maW5kKHggPT4geC5uYW1lID09PSBcIm15Qm91bmRBY3Rpb25cIik/LmZ1bGx5UXVhbGlmaWVkTmFtZSkudG9FcXVhbChcblx0XHRcdFwic2FwLmZlLnRlc3QuSmVzdFNlcnZpY2UubXlCb3VuZEFjdGlvbihzYXAuZmUudGVzdC5KZXN0U2VydmljZS5zZWNvbmRFbnRpdHkpXCJcblx0XHQpO1xuXHRcdGV4cGVjdChjb252ZXJ0ZWRUeXBlLmFjdGlvbnMuZmluZCh4ID0+IHgubmFtZSA9PT0gXCJteUJvdW5kQWN0aW9uXCIpPy5zb3VyY2VFbnRpdHlUeXBlKS5ub3QudG9CZVVuZGVmaW5lZCgpO1xuXHR9KTtcbn0pO1xuIl19