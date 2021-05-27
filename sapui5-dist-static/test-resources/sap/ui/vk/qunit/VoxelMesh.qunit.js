/* global QUnit*/

sap.ui.define([
	"sap/ui/vk/totara/TotaraUtils",
	"sap/ui/vk/threejs/MarchingCubes",
	"sap/ui/vk/threejs/BBoxSubdivider",
	"sap/ui/vk/thirdparty/three"
], function(
	TotaraUtils,
	MarchingCubes,
	BBoxSubdivider,
	three
) {
	"use strict";

	QUnit.test("EncodedStringToVoxel", function(assert) {

		let voxelString = "A/9/+j/6D3czVb8/9Q/1M7uq8/rPXQwzM/PP9QyuMzP3dzNVr/Ov8Pszu6rzX/Bf/VXz86/wr/z+qvPz8F/8Xw=="

		let packed = TotaraUtils.base64ToUint8Array(voxelString)

		assert.equal(packed.length, 64, "Packed array is wrong length")
		assert.equal(packed[0], 3, "Wrong value at position 0 in packed array")

		let unpacked = BBoxSubdivider.unpackSubDividedBoundingBox(packed);

		assert.equal(unpacked.unpacked.length, 512, "Unpacked data wrong length")
		assert.equal(unpacked.unpacked[0],   0, "Wrong value at position 0 in unpacked array")
		assert.equal(unpacked.unpacked[1],   1, "Wrong value at position 1 in unpacked array")
		assert.equal(unpacked.unpacked[510], 1, "Wrong value at position 510 in unpacked array")
		assert.equal(unpacked.unpacked[511], 0, "Wrong value at position 511 in unpacked array")
		assert.equal(unpacked.numDivision, 8, "Wrong number of sub divisions")

		let geometry = MarchingCubes.march(unpacked)

		// These values are from before THREE updates them (Not sure how or why THREE updates them)
		assert.equal(geometry.attributes.position.array.length, 9864, "Wrong length of vertex array")
		assert.equal(geometry.attributes.position.array[0], -0.30000001192092896, "Wrong X value for first vertex")
		assert.equal(geometry.attributes.position.array[1], -0.45625001192092896, "Wrong Y value for first vertex")
		assert.equal(geometry.attributes.position.array[2], -0.42500001192092896, "Wrong Z value for first vertex")
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
