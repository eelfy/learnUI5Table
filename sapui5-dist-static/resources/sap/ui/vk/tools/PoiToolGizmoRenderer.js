/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define([],function(){"use strict";var P={};P.render=function(r,c){r.write("<div");r.writeControlData(c);r.write(">");var t=c._tool;var p=t&&t.getButtons&&t.getButtons();if(p&&p.length){r.write("<div");r.addClass("sapUiVizKitPoiButtonsContainer");r.writeClasses();r.write(">");for(var j=0;j<p.length;++j){r.renderControl(p[j]);}r.write("</div>");}r.write("</div>");};return P;},true);
