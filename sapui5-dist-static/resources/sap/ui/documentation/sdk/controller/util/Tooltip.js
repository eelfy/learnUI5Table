/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/Popover","sap/m/Text","sap/m/library"],function(P,T,l){"use strict";var a=l.PlacementType,t=new T().addStyleClass("sapUiSmallMargin"),p=new P({showHeader:false,placement:a.VerticalPreferredTop,horizontalScrolling:false,contentWidth:"200px",content:t});function b(){}b.prototype.setText=function(s){t.setText(s);};b.prototype.show=function($){p.openBy($);};b.prototype.hide=function(){p.close();};b.prototype.getPopoverDomRef=function(){return p.getDomRef();};return b;});
