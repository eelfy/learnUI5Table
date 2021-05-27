/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/simple/BaseGroup"],function(B){"use strict";var M=B.extend("sap.gantt.simple.MultiActivityGroup",{metadata:{defaultAggregation:"task",aggregations:{task:{type:"sap.gantt.simple.BaseShape",multiple:false,sapGanttOrder:1},indicators:{type:"sap.gantt.simple.BaseShape",multiple:true,singularName:"indicator",sapGanttOrder:0},subTasks:{type:"sap.gantt.simple.BaseShape",multiple:true,singularName:"subTask",sapGanttLazy:true}}}});return M;},true);
