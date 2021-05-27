/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./BaseController"],function(B){"use strict";var r=sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");var C=B.extend("sap.ui.mdc.p13n.subcontroller.ColumnController");C.prototype.getContainerSettings=function(){return{title:r.getText("table.SETTINGS_COLUMN")};};C.prototype.getChangeOperations=function(){return{add:"addColumn",remove:"removeColumn",move:"moveColumn"};};return C;});
