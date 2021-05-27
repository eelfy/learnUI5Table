/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","./DataTableUtil"],function($,D){"use strict";function c(){this.aDataTables=[];}c.prototype.addDatatable=function(o){this.aDataTables.push(o);};c.prototype.destroyDatatables=function(){this.aDataTables.forEach(function(o){o.destroy();});this.aDataTables=[];};c.prototype.addMiddlewares=function(){$.fn.dataTable.ext.search.push(function(s,o,i,r,a){var S=true,b=this.aDataTables.find(function(b){return b.sId===s.sTableId;});if(b){S=b.handleSearch(s,o,i,r,a);}return S;}.bind(this));$.extend($.fn.dataTableExt.oSort,{"alpha-numeric-asc":function(a,b){return D.sortAlphaNumeric(a,b);},"alpha-numeric-desc":function(a,b){return D.sortAlphaNumeric(b,a);}});};function d(){var i=null;return{getInstance:function(){if(!i){i=new c();}return i;}};}return d();});
