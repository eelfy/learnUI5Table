/* SAP APF Analysis Path Framework
* 
* (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
jQuery.sap.declare("sap.apf.ui.representations.table");jQuery.sap.require("sap.apf.core.constants");jQuery.sap.require('sap.apf.ui.utils.formatter');jQuery.sap.require("sap.apf.ui.representations.utils.paginationHandler");jQuery.sap.require("sap.apf.ui.representations.BaseUI5ChartRepresentation");jQuery.sap.require("sap.apf.ui.representations.utils.paginationDisplayOptionHandler");jQuery.sap.require("sap.ui.model.Sorter");jQuery.sap.require("sap.ui.table.Table");jQuery.sap.require("sap.ui.table.Column");jQuery.sap.require("sap.ui.core.CustomData");jQuery.sap.require("sap.ui.model.json.JSONModel");jQuery.sap.require("sap.ui.core.Icon");jQuery.sap.require("sap.ui.layout.VerticalLayout");jQuery.sap.require("sap.m.Text");jQuery.sap.require("sap.m.Label");jQuery.sap.require("sap.m.Button");jQuery.sap.require("sap.m.HBox");jQuery.sap.require("sap.m.VBox");jQuery.sap.require("sap.m.ScrollContainer");jQuery.sap.require('sap.ui.export.Spreadsheet');jQuery.sap.require("sap.apf.ui.utils.determineColumnSettingsForSpreadSheetExport");jQuery.sap.require("sap.ui.export.EdmType");jQuery.sap.require("sap.m.Dialog");(function(){'use strict';function _(t,s){s.forEach(function(i){t.addSelectionInterval(i,i);});}function a(C){C.loadAllButton.attachEvent("setFocusOnLoadAllButtonEvent",C.loadAllButton.setFocusOnLoadAllButton);}function b(t,r){if(t.bIsAlternateRepresentation&&t.oApi.getActiveStep()){t.oApi.getActiveStep().getSelectedRepresentation().oRepresentationFilterHandler.getFilterValues().forEach(function(F){if(t.aFiltersInTable.indexOf(F)===-1){t.aFiltersInTable.push(F);}});}if((r&&t.oParameter.top)||t.oParameter.isAlternateRepresentation){t.aFiltersInTable=c(t,r);}}function c(t,r){var F=[];t.aFiltersInTable.forEach(function(i){t.aDataResponse.forEach(function(l){var m=l[r];if(m==i&&F.indexOf(i)===-1){F.push(i);}});});return F;}function d(t,r,C){var s=t.tableControl.getContextByIndex(C[0]).getProperty(r);if((t.tableControl.isIndexSelected(C[0]))&&(t.aFiltersInTable.indexOf(s))===-1){t.aFiltersInTable.push(s);}else{var i=t.aFiltersInTable.indexOf(s);if(i!==-1){t.aFiltersInTable.splice(i,1);}}}function e(t,C){f(t);t.aFiltersInTable=C;t.oApi.getActiveStep().getSelectedRepresentation().oRepresentationFilterHandler.updateFilterFromSelection(C);t.oApi.selectionChanged();}function f(t){t.oRepresentationFilterHandler.clearFilters();t.oApi.getActiveStep().getSelectedRepresentation().oRepresentationFilterHandler.clearFilters();t.aValidatedFilter=[];t.aFiltersInTable=[];}function g(C,s,i,n,w){var l=C.nDataResponseCount||0;var m,t;var o=C.oApi.getTextNotHtmlEncoded("buttonTextExport");var p=new sap.m.Button({text:o,press:function(){if(C.aDataResponse.length>10000){var r=C;r.newOpenDialog=new sap.m.Dialog({type:sap.m.DialogType.Message,title:C.oApi.getTextNotHtmlEncoded("warningTitle"),state:'Warning',content:new sap.m.Text({text:C.oApi.getTextNotHtmlEncoded("exportWarning")}),beginButton:new sap.m.Button({text:C.oApi.getTextNotHtmlEncoded("warningExport"),press:function(){C.exportExcel(s);r.newOpenDialog.close();}}),endButton:new sap.m.Button({text:C.oApi.getTextNotHtmlEncoded("warningCancel"),press:function(){r.newOpenDialog.close();}}),afterClose:function(){r.oUiApi.getLayoutView().setBusy(false);r.newOpenDialog.destroy();}});r.newOpenDialog.open();}else{C.exportExcel(s);}}}).addStyleClass("sapUiTinyMarginBeginEnd");C.titleControl=new sap.m.Title({level:sap.ui.core.TitleLevel.H1}).addStyleClass("sapUiTinyMarginBegin").addStyleClass("sapUiTinyMarginTop");if(C.aDataResponse.length===0){p.setEnabled(false);}if(w){t=C.title;}else if(C.oParameter.top){m=new sap.m.HBox({items:[p]});t=C.title;}else if(n){m=new sap.m.HBox({items:[p]});t=C.oApi.getTextNotHtmlEncoded("stepTitleWithNumberOfRecords",[C.title,i,i]);}else{o=C.oApi.getTextNotHtmlEncoded("buttonTextLoadAll");if(C.loadAllButton===undefined){C.loadAllButton=new sap.m.Button({text:o,press:C.loadAll.bind(C)});C.loadAllButton.setFocusOnLoadAllButton=function(){this.focus();this.detachEvent("setFocusOnLoadAllButtonEvent",this.setFocusOnLoadAllButton);};}m=new sap.m.HBox({items:[C.loadAllButton,p]});t=C.oApi.getTextNotHtmlEncoded("stepTitleWithNumberOfRecords",[C.title,i,l]);C.loadAllButton.addAriaLabelledBy(C.titleControl);}p.addAriaLabelledBy(C.titleControl);C.titleControl.setText(t);var q=new sap.m.HBox({alignItems:"Start",wrap:"Wrap",justifyContent:"SpaceBetween",items:[C.titleControl,m]});return q;}function h(t,s,T,w){var i=function(A){return function(B){if(T.metadata!==undefined){var D;if(t.value[A]&&B){D=T.oFormatter.getFormattedValueAsString(t.value[A],B);if(D!==undefined){return D;}}}return B;};};var o=new sap.ui.table.Table({title:s,showNoData:false,enableSelectAll:false,visibleRowCountMode:sap.ui.table.VisibleRowCountMode.Auto});if(w){o.setWidth(w+"px");}o.setLayoutData(new sap.m.FlexItemData({growFactor:1}));if(sap.ui.Device.system.desktop){o.addStyleClass("sapUiSizeCompact");}var r=T.oParameter.requiredFilters;var l=(r&&(r.length>0))?"MultiToggle":"None";o.setSelectionMode(l);var m=[],C,n,p;for(var q=0;q<t.name.length;q++){C=new sap.m.Text({wrapping:false});C.bindText(t.value[q],i(q),sap.ui.model.BindingMode.OneWay);C.bindProperty("tooltip",t.value[q],i(q));n=new sap.ui.table.Column({label:new sap.m.Label({text:t.name[q],tooltip:t.name[q]}),template:C});p=new sap.ui.core.CustomData({value:{text:t.name[q],key:t.value[q]}});if(w){n.setMinWidth(125);}n.addCustomData(p);m.push(n);}var u;u=m;u.forEach(function(A){o.addColumn(A);});if(m.length>10){o.getColumns().forEach(function(n){n.setWidth("125px");});}var M=new sap.ui.model.json.JSONModel();M.setSizeLimit(10000);var v=T.getData();M.setData({tableData:v});o.setModel(M);o.bindRows("/tableData");if(T.metadata!==undefined){for(var x=0;x<t.name.length;x++){var y=T.metadata.getPropertyMetadata(t.value[x]);if(y["aggregation-role"]==="measure"){var z=o.getColumns()[x];z.setHAlign(sap.ui.core.HorizontalAlign.End);}}}return o;}function j(t){var T=t.getData();var p=[],n;var C={name:[],value:[]};p=t.oParameter.dimensions.concat(t.oParameter.measures).length?t.oParameter.dimensions.concat(t.oParameter.measures):t.parameter.properties;if(T.length!==0){for(var i=0;i<p.length;i++){C.value[i]=p[i].fieldName;var l=t.metadata.getPropertyMetadata(p[i].fieldName).label||t.metadata.getPropertyMetadata(p[i].fieldName).name;var u="";if(t.metadata!==undefined&&t.metadata.getPropertyMetadata(p[i].fieldName).unit!==undefined){var U=t.metadata.getPropertyMetadata(p[i].fieldName).unit;u=t.getData()[0][U];for(n=0;n<t.getData().length;n++){if(u!==t.getData()[n][U]){u=undefined;break;}}C.name[i]=p[i].fieldDesc===undefined||!t.oApi.getTextNotHtmlEncoded(p[i].fieldDesc).length?l:t.oApi.getTextNotHtmlEncoded(p[i].fieldDesc);if(u!==undefined&&u!==""){C.name[i]=t.oApi.getTextNotHtmlEncoded("displayUnit",[C.name[i],u]);}}else{C.name[i]=p[i].fieldDesc===undefined||!t.oApi.getTextNotHtmlEncoded(p[i].fieldDesc).length?l:t.oApi.getTextNotHtmlEncoded(p[i].fieldDesc);}}}return C;}function k(v){var s;var S=v.getSelectedSortItem();v.getSortItems().forEach(function(o){if(o.getId()===S){s=o.getKey();}});return s;}sap.apf.ui.representations.table=function(A,p){this.oViewSettingDialog=undefined;this.aDataResponse=[];this.aValidatedFilter=[];this.aFiltersInTable=[];this.oParameter=p;this.orderby=p.orderby;this.omitTopAndSkipOptionsForNextPathUpdate=false;sap.apf.ui.representations.BaseUI5ChartRepresentation.apply(this,[A,p]);this.alternateRepresentation=p.alternateRepresentationType;this.type=sap.apf.ui.utils.CONSTANTS.representationTypes.TABLE_REPRESENTATION;this.oPaginationHandler=new sap.apf.ui.representations.utils.PaginationHandler(this);this.oPaginationDisplayOptionHandler=new sap.apf.ui.representations.utils.PaginationDisplayOptionHandler();this._drawSelection=function(E){var r=this.oParameter.requiredFilters;var R=r&&(r.length>0)?r[0]:undefined;var i=E.getParameter("userInteraction");var C=E.getParameter("rowIndices");if(!i||C.length===0){return;}if(E.getSource().getFocusDomRef()&&E.getSource().getFocusDomRef().offsetTop!==0){this.nFirstVisibleRow=this.tableControl.getFirstVisibleRow();}d(this,R,C);var l=jQuery.unique(this.aFiltersInTable);e(this,l);};this._handleSelectionEvent=function(E){this._drawSelection(E);};this._getSelectedIndicesInTable=function(r){var t=this;var s=[];t.aDataResponse.forEach(function(i,l){var m=i[r];if(t.aFiltersInTable.indexOf(m)!==-1){s.push(l);}});return s;};};sap.apf.ui.representations.table.prototype=Object.create(sap.apf.ui.representations.BaseUI5ChartRepresentation.prototype);sap.apf.ui.representations.table.prototype.constructor=sap.apf.ui.representations.table;sap.apf.ui.representations.table.prototype.setData=function(D,m,n,v){var s=this;var r,i;if(!m){var M=this.oApi.createMessageObject({code:"6004",aParameters:[this.oApi.getTextNotHtmlEncoded("step")]});this.oApi.putMessage(M);}this.metadata=m;this.oFormatter=new sap.apf.ui.utils.formatter({getEventCallback:this.oApi.getEventCallback.bind(this.oApi),getTextNotHtmlEncoded:this.oApi.getTextNotHtmlEncoded,getExits:this.oApi.getExits()},this.metadata,this.aDataResponse);if(this.oParameter.requiredFilters.length>0){r=this.oParameter.requiredFilters[0];i=m.getPropertyMetadata(r).text;}if(!this.oParameter.isAlternateRepresentation){if(r){this.aValidatedFilter=[];if(v&&v.length>0){v.forEach(function(q){s.aValidatedFilter.push(q[r]);s.oPaginationDisplayOptionHandler.createDisplayValueLookupForPaginatedFilter(q[r],q[i]);});s.aFiltersInTable=s.aValidatedFilter;}else{s.aFiltersInTable=[];}}var l=this.getRequestOptions();var o=l.paging&&l.paging.skip;this.nDataResponseCount=n;if(o===undefined||o===0){this.aDataResponse=D;}else{D.map(function(q){s.aDataResponse.push(q);});}if(!this.oParameter.top&&this.titleControl){var p=(this.aDataResponse&&this.aDataResponse.length)||0;var t=this.oApi.getTextNotHtmlEncoded("stepTitleWithNumberOfRecords",[this.title,p,n]);this.titleControl.setText(t);}}else{this.aDataResponse=D;}if(i){this.aDataResponse.forEach(function(q){s.oPaginationDisplayOptionHandler.createDisplayValueLookupForPaginatedFilter(q[r],q[i]);});}};sap.apf.ui.representations.table.prototype.getFilter=function(){this.filter=this.oRepresentationFilterHandler.createFilterFromSelectedValues(this.aFiltersInTable);return this.filter;};sap.apf.ui.representations.table.prototype.getSelections=function(){var t=this,s=[],S;var r=t.parameter.requiredFilters[0];b(t,r);t.aFiltersInTable.forEach(function(i){S=t.oPaginationDisplayOptionHandler.getDisplayNameForPaginatedFilter(i,t.parameter.requiredFilterOptions,r,t.oFormatter,t.metadata);s.push({id:i,text:S});});return s;};sap.apf.ui.representations.table.prototype.markSelectionInTable=function(i){var r=this.oParameter.requiredFilters?this.oParameter.requiredFilters[0]:undefined;if(r){var s=this._getSelectedIndicesInTable(r);if(this.oParameter.isAlternateRepresentation){var S=[];var l=this.tableControl.getBinding().aIndices;s.forEach(function(m){S.push(l.indexOf(m));});s=S;}this.tableControl.clearSelection();if(s.length>0){_(this.tableControl,s);}}};sap.apf.ui.representations.table.prototype.getRequestOptions=function(F,i){this.bIsAlternateRepresentation=i;if(F){this.oPaginationHandler.resetPaginationOption();}var r={paging:{},orderby:[]};if(F){this.omitTopAndSkipOptionsForNextPathUpdate=false;}if(this.omitTopAndSkipOptionsForNextPathUpdate){r.paging={inlineCount:true};}else if(!this.bIsAlternateRepresentation){r.paging=this.oPaginationHandler.getPagingOption(this.oParameter.top);}if(this.orderby){r.orderby=this.orderby;}if(this.oViewSettingDialog){var s=k(this.oViewSettingDialog);if(s){var S={property:k(this.oViewSettingDialog),ascending:!this.oViewSettingDialog.getSortDescending()};this.orderby=[S];r.orderby=[S];}}return r;};sap.apf.ui.representations.table.prototype.resetPaginationForTable=function(){this.omitTopAndSkipOptionsForNextPathUpdate=false;this.oPaginationHandler.resetPaginationOption();};sap.apf.ui.representations.table.prototype.getMainContent=function(s,w,i){var l=this;var t=this.getData();this.title=s;var m=this.oParameter.dimensions.concat(this.oParameter.measures).length?this.oParameter.dimensions.concat(this.oParameter.measures):this.oParameter.properties;var n=j(this);var M;if(!s){M=this.oApi.createMessageObject({code:"6002",aParameters:["title",this.oApi.getTextNotHtmlEncoded("step")]});this.oApi.putMessage(M);}if(m.length===0){M=this.oApi.createMessageObject({code:"6002",aParameters:["dimensions",s]});this.oApi.putMessage(M);}if(!t||t.length===0){M=this.oApi.createMessageObject({code:"6000",aParameters:[s]});this.oApi.putMessage(M);}var o;if(this.oParameter.isAlternateRepresentation){o=g(this,s,t.length,true,w);}else{o=g(this,s,t.length,false,w);}this.tableControl=h(n,o,this,w);this.tableControl.addAriaLabelledBy(o.getItems()[0]);this.tableControl.addEventDelegate({onAfterRendering:function(){if(l.oParameter){l.markSelectionInTable(true);if(l.loadAllButton){l.loadAllButton.fireEvent("setFocusOnLoadAllButtonEvent");}if(!l.oParameter.top&&!l.oParameter.isAlternateRepresentation&&l.nDataResponseCount>100){l.oPaginationHandler.attachPaginationOnTable(l);}}}});this.tableControl.attachRowSelectionChange(this._handleSelectionEvent.bind(this));this.oLoadMoreLink=new sap.m.Link({text:this.oApi.getTextNotHtmlEncoded("moreIcon"),visible:false});var v=new sap.m.VBox({fitContainer:true,items:[this.tableControl,this.oLoadMoreLink]}).addStyleClass("tableRepresentation");if(i){v.setHeight(i+"px");}return v;};sap.apf.ui.representations.table.prototype.getThumbnailContent=function(){var t;var T=this.getData();var i=this.oParameter.isAlternateRepresentation?"sap-icon://table-view":"sap-icon://table-chart";if(T!==undefined&&T.length!==0){var o=new sap.ui.core.Icon({src:i,size:"70px"}).addStyleClass('thumbnailTableImage');t=o;}else{var n=new sap.m.Text({text:this.oApi.getTextNotHtmlEncoded("noDataText")}).addStyleClass('noDataText');t=new sap.ui.layout.VerticalLayout({content:n});}return t;};sap.apf.ui.representations.table.prototype.removeAllSelection=function(){f(this);this.tableControl.clearSelection();this.oApi.selectionChanged();};sap.apf.ui.representations.table.prototype.getPrintContent=function(s){var p=this.tableControl.clone();p.getColumns().forEach(function(i){i.setWidth("auto");i.getTemplate().setWrapping(true);});var S=this.tableControl.getSelectedIndices();p.setVisibleRowCountMode(sap.ui.table.VisibleRowCountMode.Fixed);p.setVisibleRowCount(p.getModel().getData().tableData.length);p.onAfterRendering=function(){S.forEach(function(i){p.getRows()[i].getDomRef().classList.add('sapTableSelectionForPrint');});};var P={oRepresentation:p};return P;};sap.apf.ui.representations.table.prototype.getViewSettingDialog=function(){if(!this.oViewSettingDialog){var v={oTableInstance:this};var V=new sap.ui.view({type:sap.ui.core.mvc.ViewType.JS,viewName:"sap.apf.ui.reuse.view.viewSetting",viewData:v});this.oViewSettingDialog=V.getContent()[0];this.oViewSettingDialog.addStyleClass("sapUiSizeCompact");}return this.oViewSettingDialog;};sap.apf.ui.representations.table.prototype.loadAll=function(){this.omitTopAndSkipOptionsForNextPathUpdate=true;if(this.loadAllButton){a(this);}this.oApi.selectionChanged();};sap.apf.ui.representations.table.prototype.exportExcel=function(s){var t=this;function l(){var p=j(t);var n=[];var i,q;for(i=0;i<p.value.length;i++){q=sap.apf.ui.utils.determineColumnSettingsForSpreadSheetExport(p.value[i],t.metadata);q.property=p.value[i];q.label=p.name[i];n.push(q);}return n;}var m=this.getData();var n=l();var S={workbook:{columns:n},dataSource:m,fileName:s+".xlsx"};var o=new sap.ui.export.Spreadsheet(S);o.build();};sap.apf.ui.representations.table.prototype.onChartSwitch=function(){this.resetPaginationForTable();};sap.apf.ui.representations.table.prototype.destroy=function(){if(this.orderby){this.orderby=null;}if(this.oParameter){this.oParameter=null;}if(this.oViewSettingDialog){this.oViewSettingDialog.destroy();}if(this.aDataResponse){this.aDataResponse=null;}if(this.aValidatedFilter){this.aValidatedFilter=[];}if(this.aFiltersInTable){this.aFiltersInTable=[];}sap.apf.ui.representations.BaseUI5ChartRepresentation.prototype.destroy.call(this);};}());
