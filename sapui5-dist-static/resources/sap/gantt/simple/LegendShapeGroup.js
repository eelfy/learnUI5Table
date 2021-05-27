/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["./BaseGroup","sap/gantt/simple/LegendShapeGroupOrientation"],function(B,L){"use strict";var a=B.extend("sap.gantt.simple.LegendShapeGroup",{metadata:{library:"sap.gantt",properties:{orientation:{type:"sap.gantt.simple.LegendShapeGroupOrientation",defaultValue:L.Vertical},title:{type:"string"}},aggregations:{shapes:{type:"sap.gantt.simple.BaseShape",multiple:true,singularName:"shape"}}}});return a;},true);
