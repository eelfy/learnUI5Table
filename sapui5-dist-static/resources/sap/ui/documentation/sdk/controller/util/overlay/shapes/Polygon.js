/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./Shape"],function(S){"use strict";var P=S.extend();P.prototype.setPosition=function(c){this.oContainer.setAttribute("points",c);};return P;});
