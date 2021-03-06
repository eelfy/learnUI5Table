sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/mdc/p13n/FlexUtil'
], function (Controller, FlexUtil) {
	"use strict";

	return Controller.extend("sap.ui.mdc.sample.p13n.panels.Test", {

		onChartDialogPress: function(oEvt){
			var aAvailableRoles = [
				{
					key: "category",
					text: "Category"
				},
				{
					key: "series",
					text: "Series"
				},
				{
					key: "axis1",
					text: "Axis 1"
				},
				{
					key: "axis2",
					text: "Axis 2"
				}
			];
			var oChartData = {
				items:[
					{name: "a",label: "Country",selected: true,kind: "Dimension",role: "category",availableRoles: aAvailableRoles},
					{name: "b",label: "Year",selected: true,kind: "Dimension",role: "category",availableRoles: aAvailableRoles},
					{name: "c",label: "Name",selected: true,kind: "Dimension",role: "category",availableRoles: aAvailableRoles},
					{name: "d",label: "Region",selected: false,kind: "Measure",role: "axis1",availableRoles: aAvailableRoles},
					{name: "e",label: "City",selected: false,kind: "Dimension",role: "category",availableRoles: aAvailableRoles},
					{name: "f",label: "Fiscal Period",selected: false,kind: "Dimension",role: "category",availableRoles: aAvailableRoles},
					{name: "g",label: "WhatEver",selected: false,kind: "Measure",role: "axis1",availableRoles: aAvailableRoles},
					{name: "h",label: "Uncreative",selected: false,kind: "Dimension",role: "category",availableRoles: aAvailableRoles},
					{name: "i",label: "Column",selected: false,kind: "Measure",role: "axis1",availableRoles: aAvailableRoles}
				]
			};
			// first parameter should be the control, but we just pass the button for the domref in Util class
			var mSettings = {
				control: oEvt.getSource(),
				source: oEvt.getSource(),
				items: oChartData,
				p13nType: "Chart"
			};
			FlexUtil.showP13nPanel(mSettings);
		},
		onSortDialogPress: function(oEvt){
			var oSortData = {
				items: [
					{name:"a", label: "Country", sortOrder:"Ascending", selected: true},
					{name:"b", label: "Year", sortOrder:"Ascending", selected: true},
					{name:"c", label: "Name", sortOrder:"Ascending", selected: false},
					{name:"d", label: "Region", sortOrder:"Ascending", selected: false},
					{name:"e", label: "City", sortOrder:"Ascending", selected: false}
				]
			};
			var mSettings = {
				control: oEvt.getSource(),
				source: oEvt.getSource(),
				items: oSortData,
				p13nType: "Sort"
			};
			// first parameter should be the control, but we just pass the button for the domref in Util class
			FlexUtil.showP13nPanel(mSettings);
		},
		onSelectionDialogPress: function(oEvt){
			var oColumnsData = {
				items: [
					{name:"a", label: "Country", selected: true},
					{name:"b", label: "Year", selected: true},
					{name:"c", label: "Name", selected: true},
					{name:"d", label: "Region", selected: false},
					{name:"e", label: "Wow", selected: false},
					{name:"f", label: "Brand", selected: false},
					{name:"g", label: "Year Again", selected: true},
					{name:"h", label: "First Name", selected: false},
					{name:"i", label: "Region Again", selected: false},
					{name:"j", label: "Last Name", selected: false}
				]
			};
			var mSettings = {
				control: oEvt.getSource(),
				source: oEvt.getSource(),
				items: oColumnsData,
				p13nType: "Columns"
			};
			// first parameter should be the control, but we just pass the button for the domref in Util class
			FlexUtil.showP13nPanel(mSettings);
		}
	});

}, true);
