/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./Shape"],function(S){"use strict";var R=S.extend();R.prototype.setPosition=function(c){var C=c.split(","),p={x:C[0],y:C[1],width:C[2]-C[0],height:C[3]-C[1]};this.oContainer.setAttribute("x",p.x);this.oContainer.setAttribute("y",p.y);this.oContainer.setAttribute("width",p.width);this.oContainer.setAttribute("height",p.height);};return R;});
