/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/m/Popover",
	"sap/m/Text",
	"sap/m/library"
], function (Popover, Text, library) {
	"use strict";

	var PlacementType = library.PlacementType,
		oText = new Text().addStyleClass("sapUiSmallMargin"),
		oPopover = new Popover({
			showHeader: false,
			placement: PlacementType.VerticalPreferredTop,
			horizontalScrolling: false,
			contentWidth: "200px",
			content: oText
		});

	function Tooltip() { }

	Tooltip.prototype.setText = function (sText) {
		oText.setText(sText);
	};

	Tooltip.prototype.show = function ($openBy) {
		oPopover.openBy($openBy);
	};

	Tooltip.prototype.hide = function () {
		oPopover.close();
	};

	Tooltip.prototype.getPopoverDomRef = function () {
		return oPopover.getDomRef();
	};

	return Tooltip;
});