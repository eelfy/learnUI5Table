// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/dnd/DragAndDrop"
], function (DragAndDrop) {
    "use strict";

    var oTestUtils = {};

    function createNativeDragEventDummy (sEventType) {
        var oEvent = document.createEvent("Event");
        oEvent.initEvent(sEventType, true, true); // bubbles and cancelable both set to true
        oEvent.dataTransfer = {
            types: [],
            dropEffect: "",
            setData: function () {
            }
        };
        return oEvent;
    }

    function createjQueryDragEventDummy (sEventType, oTargetControl) {
        var oEvent = new jQuery.Event(sEventType);
        oEvent.target = oTargetControl.getDomRef();
        oEvent.originalEvent = createNativeDragEventDummy(sEventType);
        return oEvent;
    }

    oTestUtils.drag = function doDrag (sEventType, oTargetControl, sTriggerEventType) {
        // mimics the behavior of focusing the target control when starting a drag (since pressing on an element focuses it)
        if (document.activeElement && (document.activeElement !== oTargetControl.getFocusDomRef()) && (sEventType === "dragstart")) {
            oTargetControl.focus();
        }

        var oEvent = createjQueryDragEventDummy(sEventType, oTargetControl);
        DragAndDrop.preprocessEvent(oEvent);
        oTargetControl.$().trigger(sTriggerEventType || oEvent); // "sTriggerEventType" is optional
        return oEvent;
    };

    return oTestUtils;
}, /* bExport = */ false);