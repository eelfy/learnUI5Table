/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/fe/macros/chart/ChartUtils","sap/fe/macros/table/Utils","sap/ui/model/Filter","sap/fe/macros/DelegateUtil"],function(C,T,F,D){"use strict";function _(t){var v=sap.ui.fl.Utils.getViewForControl(t);var c=v.getContent()[0].data("singleChartId");return v.byId(c);}var A={updateBindingInfo:function(t,m,b){var f,o;var c={},a={};var d,e;Object.assign(b,D.getCustomData(t,"rowsBindingInfo"));if(t.getRowBinding()){b.suspended=false;}var M=_(t);var g=C.getChartSelectionsExist(M,t);a=T.getAllFilterInfo(t);d=a&&a.filters;f=a;if(g){c=C.getAllFilterInfo(M);e=c&&c.filters;f=c;}var h=d&&e?d.concat(e):e||d;o=new F({filters:h,and:true});T.updateBindingInfo(b,f,o);},_getDelegateParentClass:function(){return undefined;},rebindTable:function(t,b){var i=t.getBindingContext("pageInternal");var s=i.getProperty(i.getPath()+"/alpContentView");if(s!=="Chart"){this._getDelegateParentClass().rebindTable(t,b);}}};return A;},false);
