/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./BasePanel","sap/m/Label","sap/m/ColumnListItem","sap/m/Select","sap/m/Text","sap/ui/core/Item","sap/ui/mdc/library"],function(B,L,C,S,T,I,M){"use strict";var a=B.extend("sap.ui.mdc.p13n.panels.ChartItemPanel",{metadata:{library:"sap.ui.mdc"},init:function(){B.prototype.init.apply(this,arguments);var c=new C({selected:"{"+this.P13N_MODEL+">visible}",cells:[new L({wrapping:true,text:"{"+this.P13N_MODEL+">label}",tooltip:"{"+this.P13N_MODEL+">tooltip}"}),new T({wrapping:true,text:"{"+this.P13N_MODEL+">kind}"}),new S({width:"100%",selectedKey:"{"+this.P13N_MODEL+">role}",change:[this.onChangeOfRole,this],forceSelection:false,enabled:{path:this.P13N_MODEL+">visible",formatter:function(e){return!!e;}},items:{path:this.P13N_MODEL+">availableRoles",templateShareable:false,template:new I({key:"{"+this.P13N_MODEL+">key}",text:"{"+this.P13N_MODEL+">text}"})}})]});this.setTemplate(c);this.setPanelColumns([this.getResourceText("chart.PERSONALIZATION_DIALOG_COLUMN_DESCRIPTION"),this.getResourceText("chart.PERSONALIZATION_DIALOG_COLUMN_TYPE"),this.getResourceText("chart.PERSONALIZATION_DIALOG_COLUMN_ROLE")]);},renderer:{}});a.prototype.setP13nModel=function(p){B.prototype.setP13nModel.apply(this,arguments);var i=[];this.getP13nModel().getProperty("/items").forEach(function(o){o.availableRoles=this._getChartItemTextByKey(o.kind);i.push(o);}.bind(this));this.getP13nModel().setProperty("/items",i);};a.prototype.onChangeOfRole=function(e){var s=e.getParameter("selectedItem");if(s){var t=e.getSource().getParent();this.fireChange();this._updateEnableOfMoveButtons(t);}};a.prototype._getChartItemTextByKey=function(k){var b=sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");var A={Dimension:[{key:M.ChartItemRoleType.category,text:b.getText('chart.PERSONALIZATION_DIALOG_CHARTROLE_CATEGORY')},{key:M.ChartItemRoleType.category2,text:b.getText('chart.PERSONALIZATION_DIALOG_CHARTROLE_CATEGORY2')},{key:M.ChartItemRoleType.series,text:b.getText('chart.PERSONALIZATION_DIALOG_CHARTROLE_SERIES')}],Measure:[{key:M.ChartItemRoleType.axis1,text:b.getText('chart.PERSONALIZATION_DIALOG_CHARTROLE_AXIS1')},{key:M.ChartItemRoleType.axis2,text:b.getText('chart.PERSONALIZATION_DIALOG_CHARTROLE_AXIS2')},{key:M.ChartItemRoleType.axis3,text:b.getText('chart.PERSONALIZATION_DIALOG_CHARTROLE_AXIS3')}]};return A[k];};return a;});
