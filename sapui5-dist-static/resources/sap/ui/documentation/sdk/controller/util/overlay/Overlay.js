/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/Log","./shapes/ShapeFactory"],function(L,S){"use strict";var a="http://www.w3.org/2000/svg";function c(C){var s=document.createElementNS(a,'svg'),w=C.getBoundingClientRect().width,h=C.getBoundingClientRect().height;s.setAttribute('height',w);s.setAttribute('width',h);s.setAttribute('class','overlay');C.appendChild(s);return s;}function O(C){this.oContainer=c(C);this.oShapes={};this.sCurrentShapeType='';}O.prototype.setShape=function(s,C){var o=this.oShapes[s];if(!o){o=S.create(s,C);o.setPosition(C);this.oShapes[s]=o;this.oContainer.appendChild(o.oContainer);}else{o.setPosition(C);}this.sCurrentShapeType=s;};O.prototype.getCurrentShape=function(){return this.oShapes[this.sCurrentShapeType];};O.prototype.show=function(){var s=this.getCurrentShape();if(s){s.show();}};O.prototype.hide=function(){var s=this.getCurrentShape();if(s){s.hide();}};return O;});
