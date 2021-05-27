sap.ui.define([
	"sap/ui/core/Core",
	"sap/gantt/simple/GanttRowSettings",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/GanttChartWithTable",
	"sap/ui/table/TreeTable",
	"sap/ui/table/Column",
	"sap/m/Label",
	"sap/m/Text",
	"sap/ui/model/json/JSONModel",
	"sap/ui/table/Table",
	"sap/gantt/axistime/ProportionZoomStrategy",
	"sap/gantt/config/TimeHorizon",
	"sap/ui/core/util/MockServer",
	"sap/gantt/simple/AdhocLine",
	"sap/gantt/simple/DeltaLine"
], function(Core, GanttRowSettings, BaseRectangle, GanttChartWithTable, TreeTable, Column, Label, Text, JSONModel, Table,
            ProportionZoomStrategy, TimeHorizon, MockServer, AdhocLine, DeltaLine){

	"use strict";
	var iNumberOfRows = 8;

	window.iNumberOfRows = iNumberOfRows;
	window.iNumberOfSubRows = 2;

/*
	+-------------------------------------------------------------+
	|  +--------------------+                                     |
	|  +--------------------+                                     |
	|  +---------+                                                |
	|  +---------+                                                |
	|             +---------+                                     |
	|             +---------+                                     |
	|                            +------------------------+       |
	|                            +------------------------+       |
	|                                                             |
	|                            +------------+                   |
	|                            +------------+                   |
	|                                          +----------+       |
	|                                          +----------+       |
	+-------------------------------------------------------------+
*/
	var fnCreateTestData = function(oVisibleHorizon, iNumberOfRows, iNumberOfSubRows, bCreateExpandData) {
		var oData = {rows: [], tree: {rows: []}};

		var Format = sap.gantt.misc.Format,
			iVisibleStartInMs = Format.abapTimestampToDate(oVisibleHorizon.getStartTime()).getTime(),
			iVisibleEndInMs = Format.abapTimestampToDate(oVisibleHorizon.getEndTime()).getTime();


		// 2 days interval
		var iIntervalInMs = 2 * 24 * 60 * 60 * 1000;
		var iTotalIntervalInMs = (iNumberOfRows - 1) * iIntervalInMs;
		var iDurationInMs = (iVisibleEndInMs - iVisibleStartInMs - iTotalIntervalInMs) / iNumberOfRows;

		var oRow, oSubRow;
		var iStartInMs = iVisibleStartInMs,
			iEndInMs = iStartInMs + iDurationInMs;
		for (var i = 0; i < iNumberOfRows; i++) {
			oRow = {
				"Id" : i,
				"Name": "Row_" + i,
				"StartDate": new Date(iStartInMs),
				"EndDate": new Date(iEndInMs)
			};

			if (bCreateExpandData) {
				// split the row duration into 3 parts, means the row represent 3 sub breaks
				var iNumOfPart = 3;
				var iPartInMs = Math.floor((iEndInMs - iStartInMs) / iNumOfPart);
				oRow.breaks = [];

				var iStartPartInMs = iStartInMs;
				for (var iPart = 0; iPart < iNumOfPart; iPart++) {
					oRow.breaks.push({
						"Id": oRow.Id + "_PART_" + iPart,
						"StartDate": new Date(iStartPartInMs),
						"EndDate": new Date(iStartPartInMs + iPartInMs)
					});
					iStartPartInMs += iPartInMs;
				}
			}

			oData.rows.push(jQuery.extend({}, oRow));

			var aSubRows = [];
			var oSubStart = new Date(iStartInMs);
			for (var j = 0; j < iNumberOfSubRows; j++) {
				oSubRow = {
					"Id": oRow["Id"] + "_SUB_" + j,
					"Name" : oRow["Name"] + "_SUB_" + j,
					"StartDate": oSubStart,
					"EndDate": new Date(oSubStart.getTime() + (iDurationInMs / iNumberOfSubRows))
				};
				oSubStart = new Date(oSubRow["EndDate"].getTime());
				aSubRows.push(oSubRow);
			}
			oRow.rows = aSubRows;
			oData.tree.rows.push(oRow);

			// the next row start time in millison seconds
			iStartInMs = iEndInMs + iIntervalInMs;
			iEndInMs = iStartInMs + iDurationInMs;
		}
		return oData;
	};

	var fnCreateDefaultShapeBindingSettings = function(){
		return new GanttRowSettings({
			rowId: "{Id}",
			shapes1: [
				new BaseRectangle({
					shapeId: "{Id}",
					time: "{StartDate}",
					endTime: "{EndDate}",
					title: "{Name}",
					fill: "#008FD3",
					selectable: true
				})
			]
		});
	};

	var oGanttChart;
	var createGanttChart = function(bSkipPlaceAt, oRowSettingTemplate, bCreateExpandData) {
		oRowSettingTemplate = oRowSettingTemplate || fnCreateDefaultShapeBindingSettings();
		oGanttChart = new GanttChartWithTable("Fiori.Elements:ID.with.dots.to.test.jQuery.escaping", {
			table: new TreeTable({
				id: "table",
				visibleRowCountMode: "Auto",
				selectionMode: "Single",
				selectionBehavior: "Row",
				rows: {
					path: "/tree",
					parameters: {arrayNames: ["rows"]}
				},
				columns: [
					new Column({
						width: "250px",
						label: new Label({ text: "Name" }),
						template: new Text({ text: "{Name}", wrapping: false })
					}),
					new Column({
						width: "250px",
						label: new Label({ text: "Start Date" }),
						template: new Text({ text: "{StartDate}", wrapping: false })
					})
				],
				rowSettingsTemplate: oRowSettingTemplate
			}),
			enableSelectAndDrag : false
		});

		window.oGanttChart = oGanttChart;

		var oModel = new JSONModel();

		oModel.setData(fnCreateTestData(sap.gantt.config.DEFAULT_INIT_HORIZON, window.iNumberOfRows, window.iNumberOfSubRows, !!bCreateExpandData));

		oGanttChart.setModel(oModel);

		if (!bSkipPlaceAt) {
			oGanttChart.placeAt("qunit-fixture");
			Core.applyChanges();
		}
		return oGanttChart;
	};

	var destroyGanttChart = function() {
		oGanttChart.destroy(true/**bSuppressInvalidate*/);
		oGanttChart = null;
	};

	function waitForGanttRendered(oGantt, bWithoutShapes) {
		return oGantt.getInnerGantt().resolveWhenReady(!bWithoutShapes);
	}

	/**
	 * Creates a simple Gantt chart with one row and one provided shape.
	 * @param oShape Shape to render
	 * @param sStartTime Start time of view horizon
	 * @param sEndTime Ent time of view horizon
	 * @returns {*}
	 * @private
	 */
	function createSimpleGantt(oShape, sStartTime, sEndTime) {
		var oGantt = new GanttChartWithTable({
			id: "gantt",
			table: new Table({
				id: "table",
				columns: new Column({
					width: "250px",
					label: new Label({ text: "Text" }),
					template: "text"
				}),
				rows: {
					path: "/root"
				},
				rowSettingsTemplate: new GanttRowSettings({
					rowId: "{id}",
					shapes1: oShape
				})
			}),
			axisTimeStrategy: new ProportionZoomStrategy({
				totalHorizon: new TimeHorizon({
					startTime: sStartTime,
					endTime: sEndTime
				}),
				visibleHorizon: new TimeHorizon({
					startTime: sStartTime,
					endTime: sEndTime
				})
			})
		});
		oGantt.setModel(new JSONModel({
			root: [
				{
					id: "row1",
					text: "Row 1"
				}
			]
		}));
		return oGantt;
	}

	/**
	 * Creates a simple Gantt chart with one row, one provided shape and Adhoc & Delta Lines.
	 * @param oShape Shape to render
	 * @param sStartTime Start time of view horizon
	 * @param sEndTime Ent time of view horizon
	 * @returns {*}
	 * @private
	 */
	function createGanttWithLines(oShape, sStartTime, sEndTime) {
		var oGantt = new GanttChartWithTable({
			id: "gantt",
			table: new Table({
				id: "table1",
				columns: new Column({
					width: "250px",
					label: new Label({ text: "Text" }),
					template: "text"
				}),
				rows: {
					path: "/root"
				},
				rowSettingsTemplate: new GanttRowSettings({
					rowId: "{id}",
					shapes1: oShape
				})
			}),
			simpleAdhocLines: [new AdhocLine({
				stroke: "#DC143C",
				strokeDasharray: "5,5",
				strokeOpacity: 0.5,
				timeStamp: "20180103000000",
				description: "Product Release.",
				markerType: sap.gantt.simple.MarkerType.Diamond
			})],
			deltaLines: [new DeltaLine({
				stroke: "#DC143C",
				strokeDasharray: "5, 2",
				timeStamp: "20180104000000",
				endTimeStamp: "20180104010000"
			})],
			axisTimeStrategy: new ProportionZoomStrategy({
				totalHorizon: new TimeHorizon({
					startTime: sStartTime,
					endTime: sEndTime
				}),
				visibleHorizon: new TimeHorizon({
					startTime: sStartTime,
					endTime: sEndTime
				})
			})
		});
		window.oGanttChart = oGantt;
		oGantt.setModel(new JSONModel({
			root: [
				{
					id: "row1",
					text: "Row 1"
				}
			]
		}));
		return oGantt;
	}

	var createGanttWithODataModel = function() {
		var sServiceUrl = "http://my.test.service.com/";
		var sURLPrefix = sap.ui.require.toUrl("sap/gantt/test/simple");

		var oMockServer = new MockServer({
			rootUri : sServiceUrl
		});
		oMockServer.simulate( sURLPrefix + "/../qunit/data/odata/metadata.xml", {
			sMockdataBaseUrl : sURLPrefix +  "/../qunit/data/odata/",
			bGenerateMissingMockData : true
		});

		oMockServer.start();
		// create data model
		var oDataModel = new sap.ui.model.odata.v2.ODataModel(sServiceUrl);

		// create configuration model
		var oDateType = new sap.ui.model.type.Date({pattern: "dd.MM.yyyy"});

		var oRowSettingTemplate = oRowSettingTemplate || fnCreateDefaultShapeBindingSettingsODataModel();

		// instantiate GanttChartWithTable
		var oGantt = new GanttChartWithTable({
			table: new TreeTable({
				id: "table",
				columns: [
					new sap.ui.table.Column({
						label: "Explanation",
						sortProperty: "Explanation",
						filterProperty: "Explanation",
						name: "Explanation",
						customData: new sap.ui.core.CustomData({
							key: "exportTableColumnConfig",
							value: {"columnKey": "Explanation", "leadingProperty":"Explanation", "dataType": "string", "hierarchyNodeLevel": "Level","wrap": true}
						}),
						template: new sap.m.Label({
							text: {
								path: "Explanation",
								model: "data"
							}
						})
					}),new sap.ui.table.Column({
						label: "Obj",
						sortProperty: "Obj",
						filterProperty: "Obj",
						name: "Obj",
						customData: new sap.ui.core.CustomData({
							key: "exportTableColumnConfig",
							value: {"columnKey": "Obj", "leadingProperty":"Obj", "dataType": "string", "hierarchyNodeLevel": "Level"}
						}),
						template: new sap.m.Label({
							text: {
								path: "Obj",
								model: "data"
							}
						})
					}),
					new sap.ui.table.Column({
						label: "Start Date",
						sortProperty: "StartDate",
						filterProperty: "StartDate",
						name: "StartDate",
						filterType: oDateType,
						customData: new sap.ui.core.CustomData({
							key: "exportTableColumnConfig",
							value: {"columnKey": "StartDate", "leadingProperty":"StartDate", "dataType": "dateTime", "displayFormat": "mmm-dd, yyyy", "hierarchyNodeLevel": "Level"}
						}),
						template: new sap.m.Label({
							text: {
								path: "StartDate",
								model: "data",
								type: oDateType
							}
						})
					}),
					new sap.ui.table.Column({
						label: "End Date",
						sortProperty: "EndDate",
						filterProperty: "EndDate",
						name: "EndDate",
						filterType: oDateType,
						customData: new sap.ui.core.CustomData({
							key: "exportTableColumnConfig",
							value: {"columnKey": "EndDate", "leadingProperty":"EndDate", "dataType": "dateTime", "displayFormat": "mmm-dd, yyyy", "hierarchyNodeLevel": "Level"}
						}),
						template: new sap.m.Label({
							text: {
								path: "EndDate",
								model: "data",
								type: oDateType
							}
						})
					}),
					new sap.ui.table.Column({
						label: "ID",
						sortProperty: "id",
						filterProperty: "id",
						name: "id",
						filterType: oDateType,
						customData: new sap.ui.core.CustomData({
							key: "exportTableColumnConfig",
							value: {"columnKey": "id", "leadingProperty":"id", "dataType": "numeric", "hierarchyNodeLevel": "Level"}
						}),
						template: new sap.m.Label({
							text: {
								path: "id",
								model: "data"
							}
						})
					}),
					new sap.ui.table.Column({
						label: "StartConstraint",
						sortProperty: "StartConstraint",
						filterProperty: "StartConstraint",
						name: "StartConstraint",
						filterType: oDateType,
						customData: new sap.ui.core.CustomData({
							key: "exportTableColumnConfig",
							value: {"columnKey": "StartConstraint", "leadingProperty":"StartConstraint", "dataType": "numeric", "unit": "kg", "hierarchyNodeLevel": "Level"}
						}),
						template: new sap.m.Label({
							text: {
								path: "StartConstraint",
								model: "data"
							}
						})
					}),
					new sap.ui.table.Column({
						label: "StartConstraint",
						sortProperty: "StartConstraint",
						filterProperty: "StartConstraint",
						name: "StartConstraint",
						filterType: oDateType,
						customData: new sap.ui.core.CustomData({
							key: "exportTableColumnConfig",
							value: {"columnKey": "StartConstraint", "leadingProperty":"StartConstraint", "dataType": "boolean", "hierarchyNodeLevel": "Level"}
						}),
						template: new sap.m.Label({
							text: {
								path: "StartConstraint",
								model: "data"
							}
						})
					}),
					new sap.ui.table.Column({
						label: "SuperiorGuid",
						sortProperty: "SuperiorGuid",
						filterProperty: "SuperiorGuid",
						name: "SuperiorGuid",
						filterType: oDateType,
						customData: new sap.ui.core.CustomData({
							key: "exportTableColumnConfig",
							value: {"columnKey": "SuperiorGuid", "leadingProperty":"SuperiorGuid", "dataType": "numeric", "isCurrency": true, "unitProperty": "Currency", "hierarchyNodeLevel": "Level"}
						}),
						template: new sap.m.Label({
							text: {
								path: "SuperiorGuid",
								model: "data"
							}
						})
					})],
				rows: {
					path: "data>/ProjectElmSet",
					parameters: {
						numberOfExpandedLevels: 1,
						treeAnnotationProperties: {
							hierarchyLevelFor: "Level",
							hierarchyParentNodeFor: "SuperiorGuid",
							hierarchyNodeFor: "Guid",
							hierarchyDrillStateFor: "DrillDownState"//this option doesn't work
						},
						expand: "Task, WorkingTime, ResourceGreedy"						}
				},
				rowSettingsTemplate : oRowSettingTemplate
			}),
			showExportTableToExcel : false,
			axisTimeStrategy: new ProportionZoomStrategy({
				totalHorizon: new TimeHorizon({
					startTime: "20140628000000",
					endTime: "20170101000000"
				}),
				visibleHorizon: new TimeHorizon({
					startTime: "20150101000000",
					endTime: "20150615000000"
				})
			})

		});

		oGantt.setModel(oDataModel, "data");
		oGantt.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();
		return oGantt;
	};

	var fnCreateDefaultShapeBindingSettingsODataModel = function(){
		return new GanttRowSettings({
			rowId: "{data>ObjectID}",
			shapes1: [
				new BaseRectangle({
					shapeId: "{data>ObjectID}",
					time: "{data>StartDate}",
					endTime: "{data>EndDate}",
					title: "{data>ObjectName}",
					fill: "#008FD3",
					selectable: true
				})
			]
		});
	};


	return {
		createGantt: createGanttChart,
		destroyGantt: destroyGanttChart,
		waitForGanttRendered: waitForGanttRendered,
		createSimpleGantt: createSimpleGantt,
		createGanttWithOData: createGanttWithODataModel,
		createGanttWithLines: createGanttWithLines
	};
});
