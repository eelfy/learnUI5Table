/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/simple/GanttRowSettings"],function(G){"use strict";var M=G.extend("sap.gantt.simple.MultiActivityRowSettings",{metadata:{defaultAggregation:"tasks",aggregations:{tasks:{type:"sap.gantt.simple.BaseShape",multiple:true,singularName:"task"}}}});return M;});
