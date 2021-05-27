/* global QUnit */

sap.ui.define([
    "test-resources/sap/ui/vk/qunit/utils/ModuleWithContentConnector",
    "sap/ui/vk/threejs/Scene",
    "test-resources/sap/ui/vk/qunit/utils/ThreeJSUtils"
], function(
    Loader,
    Scene,
    ThreeJSUtils
) {
    "use strict";

    // var materialCreate = sinon.spy(THREE.Material, "call");
    // var geometryCreate = sinon.spy(THREE.BufferGeometry, "call");
    // var materialDispose = sinon.spy(THREE.Material.prototype, "dispose");
    // var geometryDispose = sinon.spy(THREE.BufferGeometry.prototype, "dispose");

    QUnit.moduleWithContentConnector("threejs.Scene Tests", "test-resources/sap/ui/vk/internal/testModels/998.vds", "vds4", null);

    QUnit.test("threejs.Scene clears all objects", function(assert) {
        var scene = this.contentConnector.getContent();
        assert.ok(scene instanceof sap.ui.vk.threejs.Scene, "Scene is properly constructed");

        scene.destroy();

        // var geometryCallInfo = ThreeJSUtils.createCallInfo(geometryCreate, geometryDispose);
        // ThreeJSUtils.analyzeCallInfo("Geometries", geometryCallInfo, assert);

        // var materialCallInfo = ThreeJSUtils.createCallInfo(materialCreate, materialDispose);
        // ThreeJSUtils.analyzeCallInfo("Materials", materialCallInfo, assert);
    });

    QUnit.done(function() {
		jQuery("#content").hide();
	});
});