sap.ui.define(["sap/ui/model/odata/v4/lib/_MetadataRequestor", "sap/ui/model/odata/v4/ODataMetaModel", "sap/ui/model/odata/v4/ODataModel", "sap/m/Button", "sap/fe/core/converters/MetaModelConverter", "path", "fs", "@sap/cds-compiler"], function (_MetadataRequestor, ODataMetaModel, ODataModel, Button, MetaModelConverter, path, fs, cds_compiler) {
  "use strict";

  var to = cds_compiler.to;
  var compileSources = cds_compiler.compileSources;
  var compactModel = cds_compiler.compactModel;
  var convertTypes = MetaModelConverter.convertTypes;
  describe("TemplateConverter UT", function () {
    it("Can Render a Control", function () {
      try {
        var button = new Button("Yolo56");
        var div = document.createElement("div");
        div.setAttribute("id", "content");
        document.body.appendChild(div);
        button.placeAt("content");
        sap.ui.getCore().applyChanges();
        var domRef = button.getDomRef();
        expect(domRef.outerHTML).toMatchSnapshot();
        return Promise.resolve();
      } catch (e) {
        return Promise.reject(e);
      }
    });
    it("can generate XML from CDS", function () {
      try {
        var cdsString = "namespace foo.bar;\n\t\t\tservice C\n\t\t\t{\n\t\t\t\tentity A (P1: String(100), P2:Decimal(10,5), P3: Integer)\n\t\t\t\t{\n\t\t\t\t  key id : Integer;\n\t\t\t\t  toA: association to A;\n\t\t\t\t};\n\t\t\t\tentity B {\n\t\t\t\t\tkey toA: association to A;\n\t\t\t\t};\n\t\t\t\tentity C {\n\t\t\t\t\tkey id : Integer;\n\t\t\t\t\ttoA: association to A on id = toA.id;\n\t\t\t\t};\n\t\t\t};";
        var csn = compileSources({
          "string.cds": cdsString
        }, {});
        var csnModel = compactModel(csn);
        var xsml = to.edmx(csnModel, {
          service: "foo.bar.C"
        });
        expect(xsml).toMatchSnapshot();
        return Promise.resolve();
      } catch (e) {
        return Promise.reject(e);
      }
    });
    it("Can mock an odatamodel", function () {
      sap.ui.registerMockMetadata("/fake/salesOrder/", fs.readFileSync(path.join(__dirname, "./data/salesOrderMetadata.xml")).toString());
      var oDataModel = new ODataModel({
        serviceUrl: "/fake/salesOrder/",
        synchronizationMode: "None"
      });
      var oMetaModel = oDataModel.getMetaModel();
      return oMetaModel.fetchEntityContainer().then(function () {
        expect(oMetaModel.getObject("/$")).toMatchSnapshot();
        var oConvertedTypes = convertTypes(oMetaModel);
        expect(oConvertedTypes.entitySets[0]).toMatchSnapshot();
        return oMetaModel;
      });
    });
    it("can fake a metamodel", function () {
      var sMetadataUrl = path.join(__dirname, "./data/salesOrderMetadata.xml");

      var oRequestor = _MetadataRequestor.create({}, "4.0", {});

      var oMetaModel = new ODataMetaModel(oRequestor, sMetadataUrl, undefined, null);
      return oMetaModel.fetchEntityContainer().then(function () {
        expect(oMetaModel.getObject("/$")).toMatchSnapshot();
        var oConvertedTypes = convertTypes(oMetaModel);
        expect(oConvertedTypes.entitySets[0]).toMatchSnapshot();
        return oMetaModel;
      });
    });
  });
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRlbXBsYXRlQ29udmVydGVyLnNwZWMudHMiXSwibmFtZXMiOlsiZGVzY3JpYmUiLCJpdCIsImJ1dHRvbiIsIkJ1dHRvbiIsImRpdiIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInNldEF0dHJpYnV0ZSIsImJvZHkiLCJhcHBlbmRDaGlsZCIsInBsYWNlQXQiLCJzYXAiLCJ1aSIsImdldENvcmUiLCJhcHBseUNoYW5nZXMiLCJkb21SZWYiLCJnZXREb21SZWYiLCJleHBlY3QiLCJvdXRlckhUTUwiLCJ0b01hdGNoU25hcHNob3QiLCJjZHNTdHJpbmciLCJjc24iLCJjb21waWxlU291cmNlcyIsImNzbk1vZGVsIiwiY29tcGFjdE1vZGVsIiwieHNtbCIsInRvIiwiZWRteCIsInNlcnZpY2UiLCJyZWdpc3Rlck1vY2tNZXRhZGF0YSIsImZzIiwicmVhZEZpbGVTeW5jIiwicGF0aCIsImpvaW4iLCJfX2Rpcm5hbWUiLCJ0b1N0cmluZyIsIm9EYXRhTW9kZWwiLCJPRGF0YU1vZGVsIiwic2VydmljZVVybCIsInN5bmNocm9uaXphdGlvbk1vZGUiLCJvTWV0YU1vZGVsIiwiZ2V0TWV0YU1vZGVsIiwiZmV0Y2hFbnRpdHlDb250YWluZXIiLCJ0aGVuIiwiZ2V0T2JqZWN0Iiwib0NvbnZlcnRlZFR5cGVzIiwiY29udmVydFR5cGVzIiwiZW50aXR5U2V0cyIsInNNZXRhZGF0YVVybCIsIm9SZXF1ZXN0b3IiLCJfTWV0YWRhdGFSZXF1ZXN0b3IiLCJjcmVhdGUiLCJPRGF0YU1ldGFNb2RlbCIsInVuZGVmaW5lZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQVNBQSxFQUFBQSxRQUFRLENBQUMsc0JBQUQsRUFBeUIsWUFBVztBQUMzQ0MsSUFBQUEsRUFBRSxDQUFDLHNCQUFEO0FBQUEsVUFBMEM7QUFDM0MsWUFBTUMsTUFBTSxHQUFHLElBQUlDLE1BQUosQ0FBVyxRQUFYLENBQWY7QUFDQSxZQUFNQyxHQUFHLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QixLQUF2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O0FBQ0F2QixRQUFBQSxNQUFNLENBQUM0QixlQUFlLENBQUNFLFVBQWhCLENBQTJCLENBQTNCLENBQUQsQ0FBTixDQUFzQzVCLGVBQXRDO0FBQ0EsZUFBT3FCLFVBQVA7QUFDQSxPQUxNLENBQVA7QUFNQSxLQVZDLENBQUY7QUFXQSxHQTlETyxDQUFSIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBfTWV0YWRhdGFSZXF1ZXN0b3IgfSBmcm9tIFwic2FwL3VpL21vZGVsL29kYXRhL3Y0L2xpYlwiO1xuaW1wb3J0IHsgT0RhdGFNZXRhTW9kZWwsIE9EYXRhTW9kZWwgfSBmcm9tIFwic2FwL3VpL21vZGVsL29kYXRhL3Y0XCI7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwic2FwL21cIjtcbmltcG9ydCB7IGNvbnZlcnRUeXBlcyB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL01ldGFNb2RlbENvbnZlcnRlclwiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcblxuaW1wb3J0IGZzIGZyb20gXCJmc1wiO1xuaW1wb3J0IHsgY29tcGFjdE1vZGVsLCBjb21waWxlU291cmNlcywgdG8gfSBmcm9tIFwiQHNhcC9jZHMtY29tcGlsZXJcIjtcblxuZGVzY3JpYmUoXCJUZW1wbGF0ZUNvbnZlcnRlciBVVFwiLCBmdW5jdGlvbigpIHtcblx0aXQoXCJDYW4gUmVuZGVyIGEgQ29udHJvbFwiLCBhc3luYyBmdW5jdGlvbigpIHtcblx0XHRjb25zdCBidXR0b24gPSBuZXcgQnV0dG9uKFwiWW9sbzU2XCIpO1xuXHRcdGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0ZGl2LnNldEF0dHJpYnV0ZShcImlkXCIsIFwiY29udGVudFwiKTtcblx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRpdik7XG5cdFx0YnV0dG9uLnBsYWNlQXQoXCJjb250ZW50XCIpO1xuXHRcdHNhcC51aS5nZXRDb3JlKCkuYXBwbHlDaGFuZ2VzKCk7XG5cdFx0Y29uc3QgZG9tUmVmID0gKGJ1dHRvbi5nZXREb21SZWYoKSBhcyB1bmtub3duKSBhcyBFbGVtZW50O1xuXHRcdGV4cGVjdChkb21SZWYub3V0ZXJIVE1MKS50b01hdGNoU25hcHNob3QoKTtcblx0fSk7XG5cblx0aXQoXCJjYW4gZ2VuZXJhdGUgWE1MIGZyb20gQ0RTXCIsIGFzeW5jIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0IGNkc1N0cmluZyA9IGBuYW1lc3BhY2UgZm9vLmJhcjtcblx0XHRcdHNlcnZpY2UgQ1xuXHRcdFx0e1xuXHRcdFx0XHRlbnRpdHkgQSAoUDE6IFN0cmluZygxMDApLCBQMjpEZWNpbWFsKDEwLDUpLCBQMzogSW50ZWdlcilcblx0XHRcdFx0e1xuXHRcdFx0XHQgIGtleSBpZCA6IEludGVnZXI7XG5cdFx0XHRcdCAgdG9BOiBhc3NvY2lhdGlvbiB0byBBO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHRlbnRpdHkgQiB7XG5cdFx0XHRcdFx0a2V5IHRvQTogYXNzb2NpYXRpb24gdG8gQTtcblx0XHRcdFx0fTtcblx0XHRcdFx0ZW50aXR5IEMge1xuXHRcdFx0XHRcdGtleSBpZCA6IEludGVnZXI7XG5cdFx0XHRcdFx0dG9BOiBhc3NvY2lhdGlvbiB0byBBIG9uIGlkID0gdG9BLmlkO1xuXHRcdFx0XHR9O1xuXHRcdFx0fTtgO1xuXHRcdGNvbnN0IGNzbiA9IGNvbXBpbGVTb3VyY2VzKHsgXCJzdHJpbmcuY2RzXCI6IGNkc1N0cmluZyB9LCB7fSk7XG5cdFx0Y29uc3QgY3NuTW9kZWwgPSBjb21wYWN0TW9kZWwoY3NuKTtcblx0XHRjb25zdCB4c21sID0gdG8uZWRteChjc25Nb2RlbCwgeyBzZXJ2aWNlOiBcImZvby5iYXIuQ1wiIH0pO1xuXG5cdFx0ZXhwZWN0KHhzbWwpLnRvTWF0Y2hTbmFwc2hvdCgpO1xuXHR9KTtcblxuXHRpdChcIkNhbiBtb2NrIGFuIG9kYXRhbW9kZWxcIiwgZnVuY3Rpb24oKSB7XG5cdFx0c2FwLnVpLnJlZ2lzdGVyTW9ja01ldGFkYXRhKFwiL2Zha2Uvc2FsZXNPcmRlci9cIiwgZnMucmVhZEZpbGVTeW5jKHBhdGguam9pbihfX2Rpcm5hbWUsIFwiLi9kYXRhL3NhbGVzT3JkZXJNZXRhZGF0YS54bWxcIikpLnRvU3RyaW5nKCkpO1xuXHRcdGNvbnN0IG9EYXRhTW9kZWwgPSBuZXcgT0RhdGFNb2RlbCh7XG5cdFx0XHRzZXJ2aWNlVXJsOiBcIi9mYWtlL3NhbGVzT3JkZXIvXCIsXG5cdFx0XHRzeW5jaHJvbml6YXRpb25Nb2RlOiBcIk5vbmVcIlxuXHRcdH0pO1xuXHRcdGNvbnN0IG9NZXRhTW9kZWwgPSBvRGF0YU1vZGVsLmdldE1ldGFNb2RlbCgpO1xuXHRcdHJldHVybiBvTWV0YU1vZGVsLmZldGNoRW50aXR5Q29udGFpbmVyKCkudGhlbigoKSA9PiB7XG5cdFx0XHRleHBlY3Qob01ldGFNb2RlbC5nZXRPYmplY3QoXCIvJFwiKSkudG9NYXRjaFNuYXBzaG90KCk7XG5cdFx0XHRjb25zdCBvQ29udmVydGVkVHlwZXMgPSBjb252ZXJ0VHlwZXMob01ldGFNb2RlbCk7XG5cdFx0XHRleHBlY3Qob0NvbnZlcnRlZFR5cGVzLmVudGl0eVNldHNbMF0pLnRvTWF0Y2hTbmFwc2hvdCgpO1xuXHRcdFx0cmV0dXJuIG9NZXRhTW9kZWw7XG5cdFx0fSk7XG5cdH0pO1xuXG5cdGl0KFwiY2FuIGZha2UgYSBtZXRhbW9kZWxcIiwgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3Qgc01ldGFkYXRhVXJsID0gcGF0aC5qb2luKF9fZGlybmFtZSwgXCIuL2RhdGEvc2FsZXNPcmRlck1ldGFkYXRhLnhtbFwiKTtcblx0XHRjb25zdCBvUmVxdWVzdG9yID0gX01ldGFkYXRhUmVxdWVzdG9yLmNyZWF0ZSh7fSwgXCI0LjBcIiwge30pO1xuXHRcdGNvbnN0IG9NZXRhTW9kZWwgPSBuZXcgT0RhdGFNZXRhTW9kZWwob1JlcXVlc3Rvciwgc01ldGFkYXRhVXJsLCB1bmRlZmluZWQsIG51bGwpO1xuXHRcdHJldHVybiBvTWV0YU1vZGVsLmZldGNoRW50aXR5Q29udGFpbmVyKCkudGhlbigoKSA9PiB7XG5cdFx0XHRleHBlY3Qob01ldGFNb2RlbC5nZXRPYmplY3QoXCIvJFwiKSkudG9NYXRjaFNuYXBzaG90KCk7XG5cdFx0XHRjb25zdCBvQ29udmVydGVkVHlwZXMgPSBjb252ZXJ0VHlwZXMob01ldGFNb2RlbCk7XG5cdFx0XHRleHBlY3Qob0NvbnZlcnRlZFR5cGVzLmVudGl0eVNldHNbMF0pLnRvTWF0Y2hTbmFwc2hvdCgpO1xuXHRcdFx0cmV0dXJuIG9NZXRhTW9kZWw7XG5cdFx0fSk7XG5cdH0pO1xufSk7XG4iXX0=