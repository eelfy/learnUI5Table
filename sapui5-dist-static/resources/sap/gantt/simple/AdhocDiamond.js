/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["./BaseDiamond"],function(B){"use strict";var A=B.extend("sap.gantt.simple.AdhocDiamond",{metadata:{events:{press:{},mouseEnter:{},mouseLeave:{}}},renderer:{apiVersion:2}});A.prototype.onclick=function(e){this.firePress(e);};A.prototype.onmouseover=function(e){this.fireMouseEnter(e);};A.prototype.onmouseout=function(e){this.fireMouseLeave(e);};A.prototype.renderElement=function(r,e){B.prototype.renderElement.apply(this,arguments);};return A;},true);
