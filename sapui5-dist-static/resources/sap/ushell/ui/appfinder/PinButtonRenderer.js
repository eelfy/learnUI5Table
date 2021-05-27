// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/m/ButtonRenderer","sap/ui/core/Renderer"],function(B,R){"use strict";var P=R.extend(B);P.apiVersion=2;P.renderAccessibilityAttributes=function(r,p,a){a.pressed=p.getSelected();};return P;});
