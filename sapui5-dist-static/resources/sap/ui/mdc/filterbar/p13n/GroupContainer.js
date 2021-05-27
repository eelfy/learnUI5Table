/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/mdc/filterbar/IFilterContainer','sap/ui/mdc/p13n/panels/AdaptFiltersPanel'],function(I,A){"use strict";var G=I.extend("sap.ui.mdc.filterbar.p13n.GroupContainer");G.prototype.init=function(){I.prototype.init.apply(this,arguments);this.mFilterItems={};this.oLayout=new A();this.oLayout.setItemFactory(function(b){var k=this.oLayout.getModel(this.oLayout.P13N_MODEL).getProperty(b.sPath).name;var f=this.mFilterItems[k];return f;}.bind(this));};G.prototype.insertFilterField=function(c,i){this.mFilterItems[c._getFieldPath()]=c;};G.prototype.removeFilterField=function(c){this.oLayout.removeItem(c);};G.prototype.getFilterFields=function(){var f=[];Object.keys(this.mFilterItems).forEach(function(k){f.push(this.mFilterItems[k]);}.bind(this));return f;};G.prototype.update=function(){this.oLayout.restoreDefaults();};G.prototype.exit=function(){this.mFilterItems=null;this.mFilterFields=null;I.prototype.exit.apply(this,arguments);};return G;});
