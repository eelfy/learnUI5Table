/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/threejs/ViewStateManager",
	"sap/ui/vk/threejs/Viewport",
	"sap/ui/vk/AnimationPlayer",
	"sap/ui/vk/AnimationPlayback",
	"sap/ui/vk/View",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithContentConnector",
	"sap/ui/vk/thirdparty/three"
], function(
	jQuery,
	ViewStateManager,
	Viewport,
	AnimationPlayer,
	AnimationPlayback,
	View,
	loader,
	three
) {
	"use strict";

	var viewport = new Viewport();
	var viewStateManager, animationPlayer;
	viewport.placeAt("content");

	QUnit.moduleWithContentConnector("AnimationLoad", "test-resources/sap/ui/vk/qunit/media/stand_foot_rests.asm.json", "threejs.test.json", function(assert) {
		viewStateManager = new ViewStateManager({ contentConnector: this.contentConnector });
		viewport.setViewStateManager(viewStateManager);
		viewport.setContentConnector(this.contentConnector);
		animationPlayer = new AnimationPlayer({
			viewStateManager: viewStateManager
		});
	});

	QUnit.test("AnimationPlayer time changed", function(assert) {
		var scene = viewport.getScene();

		var sequence0 = scene.createSequence("sq0", {
			name: "Test sequence 0",
			duration: 1.2
		});

		var sequence1 = scene.createSequence("sq1", {
			name: "Test sequence 1",
			duration: 3
		});

		var view = new View();
		var playback0 = new AnimationPlayback();
		playback0.setSequence(sequence0);
		view.addPlayback(playback0);

		var playback1 = new AnimationPlayback();
		playback1.setSequence(sequence1);
		view.addPlayback(playback1);
		animationPlayer.activateView(view);

		assert.equal(animationPlayer.getTime(), 0, "time initialised to zero");

		var beforeTimeChangedFired, timeChangedFired;
		var onBeforeTimeChanged, onTimeChanged;


		// change to a time within playback 1
		beforeTimeChangedFired = false;
		timeChangedFired = false;
		onBeforeTimeChanged = function(event) {
			beforeTimeChangedFired = true;
			var parameters = event.getParameters();
			assert.equal(parameters.time, 0, "time parameter");
			assert.equal(parameters.nextTime, 1, "nextTime parameter");
			assert.equal(parameters.currentPlayback, playback0, "currentPlayback parameter");
			assert.equal(parameters.nextPlayback, playback0, "nextPlayback parameter");

			assert.equal(animationPlayer.getTime(), parameters.time, "animationPlayer.getTime() == parameters.time");
			assert.equal(animationPlayer.getCurrentPlayback(), parameters.currentPlayback, "animationPlayer.getTime() == parameters.currentPlayback");
		};
		onTimeChanged = function(event) {
			timeChangedFired = true;
			var parameters = event.getParameters();
			assert.equal(parameters.time, 1, "time parameter");
			assert.equal(parameters.previousTime, 0, "previousTime parameter");
			assert.equal(parameters.currentPlayback, playback0, "currentPlayback parameter");
			assert.equal(parameters.previousPlayback, playback0, "previousPlayback parameter");

			assert.equal(animationPlayer.getTime(), parameters.time, "animationPlayer.getTime() == parameters.time");
			assert.equal(animationPlayer.getCurrentPlayback(), parameters.currentPlayback, "animationPlayer.getTime() == parameters.currentPlayback");
		};
		animationPlayer.attachEventOnce("beforeTimeChanged", onBeforeTimeChanged);
		animationPlayer.attachEventOnce("timeChanged", onTimeChanged);
		animationPlayer.setTime(1);
		animationPlayer.detachEvent("beforeTimeChanged", onBeforeTimeChanged);
		animationPlayer.detachEvent("timeChanged", onTimeChanged);

		assert.equal(animationPlayer.getTime(), 1, "animationPlayer.getTime()");
		assert.equal(animationPlayer.getCurrentPlayback(), playback0, "animationPlayer.getCurrentPlayback()");
		assert.equal(beforeTimeChangedFired, true, "beforeTimeChanged fired");
		assert.equal(timeChangedFired, true, "timeChangedFired fired");


		// change to end of first playback
		beforeTimeChangedFired = false;
		timeChangedFired = false;
		onBeforeTimeChanged = function(event) {
			beforeTimeChangedFired = true;
			var parameters = event.getParameters();
			assert.equal(parameters.time, 1, "time parameter");
			assert.equal(parameters.nextTime, 1.2, "nextTime parameter");
			assert.equal(parameters.currentPlayback, playback0, "currentPlayback parameter");
			assert.equal(parameters.nextPlayback, playback0, "nextPlayback parameter");

			assert.equal(animationPlayer.getTime(), parameters.time, "animationPlayer.getTime() == parameters.time");
			assert.equal(animationPlayer.getCurrentPlayback(), parameters.currentPlayback, "animationPlayer.getTime() == parameters.currentPlayback");
		};
		onTimeChanged = function(event) {
			timeChangedFired = true;
			var parameters = event.getParameters();
			assert.equal(parameters.time, 1.2, "time parameter");
			assert.equal(parameters.previousTime, 1, "previousTime parameter");
			assert.equal(parameters.currentPlayback, playback0, "currentPlayback parameter");
			assert.equal(parameters.previousPlayback, playback0, "previousPlayback parameter");

			assert.equal(animationPlayer.getTime(), parameters.time, "animationPlayer.getTime() == parameters.time");
			assert.equal(animationPlayer.getCurrentPlayback(), parameters.currentPlayback, "animationPlayer.getTime() == parameters.currentPlayback");
		};
		animationPlayer.attachEventOnce("beforeTimeChanged", onBeforeTimeChanged);
		animationPlayer.attachEventOnce("timeChanged", onTimeChanged);
		animationPlayer.setTime(1.2, 0);
		animationPlayer.detachEvent("beforeTimeChanged", onBeforeTimeChanged);
		animationPlayer.detachEvent("timeChanged", onTimeChanged);

		assert.equal(animationPlayer.getTime(), 1.2, "animationPlayer.getTime()");
		assert.equal(animationPlayer.getCurrentPlayback(), playback0, "animationPlayer.getCurrentPlayback()");
		assert.equal(beforeTimeChangedFired, true, "beforeTimeChanged fired");
		assert.equal(timeChangedFired, true, "timeChangedFired fired");


		// change to start of first playback
		beforeTimeChangedFired = false;
		timeChangedFired = false;
		onBeforeTimeChanged = function(event) {
			beforeTimeChangedFired = true;
			var parameters = event.getParameters();
			assert.equal(parameters.time, 1.2, "time parameter");
			assert.equal(parameters.nextTime, 1.2, "nextTime parameter");
			assert.equal(parameters.currentPlayback, playback0, "currentPlayback parameter");
			assert.equal(parameters.nextPlayback, playback1, "nextPlayback parameter");

			assert.equal(animationPlayer.getTime(), parameters.time, "animationPlayer.getTime() == parameters.time");
			assert.equal(animationPlayer.getCurrentPlayback(), parameters.currentPlayback, "animationPlayer.getTime() == parameters.currentPlayback");
		};
		onTimeChanged = function(event) {
			timeChangedFired = true;
			var parameters = event.getParameters();
			assert.equal(parameters.time, 1.2, "time parameter");
			assert.equal(parameters.previousTime, 1.2, "previousTime parameter");
			assert.equal(parameters.currentPlayback, playback1, "currentPlayback parameter");
			assert.equal(parameters.previousPlayback, playback0, "previousPlayback parameter");

			assert.equal(animationPlayer.getTime(), parameters.time, "animationPlayer.getTime() == parameters.time");
			assert.equal(animationPlayer.getCurrentPlayback(), parameters.currentPlayback, "animationPlayer.getTime() == parameters.currentPlayback");
		};
		animationPlayer.attachEventOnce("beforeTimeChanged", onBeforeTimeChanged);
		animationPlayer.attachEventOnce("timeChanged", onTimeChanged);
		animationPlayer.setTime(0, 1);
		animationPlayer.detachEvent("beforeTimeChanged", onBeforeTimeChanged);
		animationPlayer.detachEvent("timeChanged", onTimeChanged);

		assert.equal(animationPlayer.getTime(), 1.2, "animationPlayer.getTime()");
		assert.equal(animationPlayer.getCurrentPlayback(), playback1, "animationPlayer.getCurrentPlayback()");
		assert.equal(beforeTimeChangedFired, true, "beforeTimeChanged fired");
		assert.equal(timeChangedFired, true, "timeChangedFired fired");


		// no change to time
		beforeTimeChangedFired = false;
		timeChangedFired = false;
		onBeforeTimeChanged = function() {
			beforeTimeChangedFired = true;
		};
		onTimeChanged = function() {
			timeChangedFired = true;
		};
		animationPlayer.attachEventOnce("beforeTimeChanged", onBeforeTimeChanged);
		animationPlayer.attachEventOnce("timeChanged", onTimeChanged);
		animationPlayer.setTime(0, 1);
		animationPlayer.detachEvent("beforeTimeChanged", onBeforeTimeChanged);
		animationPlayer.detachEvent("timeChanged", onTimeChanged);

		assert.equal(animationPlayer.getTime(), 1.2, "animationPlayer.getTime()");
		assert.equal(animationPlayer.getCurrentPlayback(), playback1, "animationPlayer.getCurrentPlayback()");
		assert.equal(beforeTimeChangedFired, false, "beforeTimeChanged fired");
		assert.equal(timeChangedFired, false, "timeChangedFired fired");


		// block time change events
		beforeTimeChangedFired = false;
		timeChangedFired = false;
		onBeforeTimeChanged = function() {
			beforeTimeChangedFired = true;
		};
		onTimeChanged = function() {
			timeChangedFired = true;
		};
		animationPlayer.attachEventOnce("beforeTimeChanged", onBeforeTimeChanged);
		animationPlayer.attachEventOnce("timeChanged", onTimeChanged);
		animationPlayer.setTime(0, 0, true);
		animationPlayer.detachEvent("beforeTimeChanged", onBeforeTimeChanged);
		animationPlayer.detachEvent("timeChanged", onTimeChanged);
		assert.equal(animationPlayer.getTime(), 0, "animationPlayer.getTime()");
		assert.equal(animationPlayer.getCurrentPlayback(), playback0, "animationPlayer.getCurrentPlayback()");
		assert.equal(beforeTimeChangedFired, false, "beforeTimeChanged fired");
		assert.equal(timeChangedFired, false, "timeChangedFired fired");


		// time out of range (-1)
		beforeTimeChangedFired = false;
		timeChangedFired = false;
		onBeforeTimeChanged = function(event) {
			beforeTimeChangedFired = true;
			var parameters = event.getParameters();
			assert.equal(parameters.time, 0, "time parameter");
			assert.equal(parameters.nextTime, -1, "nextTime parameter");
			assert.equal(parameters.currentPlayback, playback0, "currentPlayback parameter");
			assert.equal(parameters.nextPlayback, undefined, "nextPlayback parameter");

			assert.equal(animationPlayer.getTime(), parameters.time, "animationPlayer.getTime() == parameters.time");
			assert.equal(animationPlayer.getCurrentPlayback(), parameters.currentPlayback, "animationPlayer.getTime() == parameters.currentPlayback");
		};
		onTimeChanged = function(event) {
			timeChangedFired = true;
			var parameters = event.getParameters();
			assert.equal(parameters.time, -1, "time parameter");
			assert.equal(parameters.previousTime, 0, "previousTime parameter");
			assert.equal(parameters.currentPlayback, undefined, "currentPlayback parameter");
			assert.equal(parameters.previousPlayback, playback0, "previousPlayback parameter");

			assert.equal(animationPlayer.getTime(), parameters.time, "animationPlayer.getTime() == parameters.time");
			assert.equal(animationPlayer.getCurrentPlayback(), parameters.currentPlayback, "animationPlayer.getTime() == parameters.currentPlayback");
		};
		animationPlayer.attachEventOnce("beforeTimeChanged", onBeforeTimeChanged);
		animationPlayer.attachEventOnce("timeChanged", onTimeChanged);
		animationPlayer.setTime(-1);
		animationPlayer.detachEvent("beforeTimeChanged", onBeforeTimeChanged);
		animationPlayer.detachEvent("timeChanged", onTimeChanged);

		assert.equal(animationPlayer.getTime(), -1, "animationPlayer.getTime()");
		assert.equal(animationPlayer.getCurrentPlayback(), undefined, "animationPlayer.getCurrentPlayback()");
		assert.equal(beforeTimeChangedFired, true, "beforeTimeChanged fired");
		assert.equal(timeChangedFired, true, "timeChangedFired fired");


		// time out of range (+10)
		animationPlayer.setTime(0);
		beforeTimeChangedFired = false;
		timeChangedFired = false;
		onBeforeTimeChanged = function(event) {
			beforeTimeChangedFired = true;
			var parameters = event.getParameters();
			assert.equal(parameters.time, 0, "time parameter");
			assert.equal(parameters.nextTime, 10, "nextTime parameter");
			assert.equal(parameters.currentPlayback, playback0, "currentPlayback parameter");
			assert.equal(parameters.nextPlayback, undefined, "nextPlayback parameter");

			assert.equal(animationPlayer.getTime(), parameters.time, "animationPlayer.getTime() == parameters.time");
			assert.equal(animationPlayer.getCurrentPlayback(), parameters.currentPlayback, "animationPlayer.getTime() == parameters.currentPlayback");
		};
		onTimeChanged = function(event) {
			timeChangedFired = true;
			var parameters = event.getParameters();
			assert.equal(parameters.time, 10, "time parameter");
			assert.equal(parameters.previousTime, 0, "previousTime parameter");
			assert.equal(parameters.currentPlayback, undefined, "currentPlayback parameter");
			assert.equal(parameters.previousPlayback, playback0, "previousPlayback parameter");

			assert.equal(animationPlayer.getTime(), parameters.time, "animationPlayer.getTime() == parameters.time");
			assert.equal(animationPlayer.getCurrentPlayback(), parameters.currentPlayback, "animationPlayer.getTime() == parameters.currentPlayback");
		};
		animationPlayer.attachEventOnce("beforeTimeChanged", onBeforeTimeChanged);
		animationPlayer.attachEventOnce("timeChanged", onTimeChanged);
		animationPlayer.setTime(10);
		animationPlayer.detachEvent("beforeTimeChanged", onBeforeTimeChanged);
		animationPlayer.detachEvent("timeChanged", onTimeChanged);

		assert.equal(animationPlayer.getTime(), 10, "animationPlayer.getTime()");
		assert.equal(animationPlayer.getCurrentPlayback(), undefined, "animationPlayer.getCurrentPlayback()");
		assert.equal(beforeTimeChangedFired, true, "beforeTimeChanged fired");
		assert.equal(timeChangedFired, true, "timeChangedFired fired");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
