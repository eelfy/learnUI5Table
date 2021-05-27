/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./Rect","./Polygon","./Circle"],function(R,P,C){"use strict";var S="http://www.w3.org/2000/svg";function c(s){switch(s){case'rect':return new R().createShape(S,s);case'poly':return new P().createShape(S,"polygon");case'circle':return new C().createShape(S,s);default:}}return{create:c};});
