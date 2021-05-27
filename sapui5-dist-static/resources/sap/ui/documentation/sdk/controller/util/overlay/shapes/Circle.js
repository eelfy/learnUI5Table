/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./Shape"],function(S){"use strict";var C=S.extend();C.prototype.setPosition=function(c){var a=c.split(","),p={cx:a[0],cy:a[1],r:a[2]};this.oContainer.setAttribute("cx",p.cx);this.oContainer.setAttribute("cy",p.cy);this.oContainer.setAttribute("r",p.r);};return C;});
