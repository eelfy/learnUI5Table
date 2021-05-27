/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/base/Log","jquery.sap.global","./library","sap/rules/ui/DecisionTableCell","sap/rules/ui/RuleBase","sap/rules/ui/Utils","sap/ui/table/Table","sap/ui/table/Column","sap/m/Toolbar","sap/m/Popover","sap/m/Menu","sap/m/Dialog","sap/m/MenuButton","sap/m/Button","sap/m/ToolbarSpacer","sap/m/Text","sap/m/Input","sap/m/ObjectIdentifier","sap/m/Link","sap/m/Label","sap/m/BusyIndicator","sap/m/DisplayListItem","sap/m/MenuItem","sap/m/FlexBox","sap/m/MessageStrip","sap/rules/ui/DecisionTableSettingsOld","sap/rules/ui/type/DecisionTableCell","sap/rules/ui/ast/constants/Constants","sap/rules/ui/services/AstExpressionLanguage","sap/rules/ui/ast/util/AstUtil","sap/rules/ui/Constants","sap/ui/core/LocaleData"],function(L,q,l,D,R,U,T,C,a,P,M,b,c,B,d,f,I,O,g,h,k,m,n,F,o,p,r,s,A,t,u,v){"use strict";var x={vocabulary:"vocabulary",rule:"rule",columns:"columns",rows:"rows"};var y=3;var z=R.extend("sap.rules.ui.DecisionTable",{metadata:{properties:{enableSettings:{type:"boolean",group:"Misc",defaultValue:false},cellFormat:{type:"sap.rules.ui.DecisionTableCellFormat",defaultValue:sap.rules.ui.DecisionTableCellFormat.Both},hitPolicies:{type:"sap.rules.ui.RuleHitPolicy[]",defaultValue:[sap.rules.ui.RuleHitPolicy.FirstMatch,sap.rules.ui.RuleHitPolicy.AllMatch]},lineActionBuffer:{type:"any",defaultValue:{rowPath:null,operation:null}},decisionTableFormat:{type:"sap.rules.ui.DecisionTableFormat",defaultValue:sap.rules.ui.DecisionTableFormat.CellFormat},threshold:{type:"int",defaultValue:999},visibleRowCount:{type:"int",defaultValue:999}},aggregations:{"_toolbar":{type:"sap.m.Toolbar",multiple:false,singularName:"_toolbar"},"_table":{type:"sap.ui.core.Control",multiple:false,singularName:"_table"},"_errorsText":{type:"sap.m.MessageStrip",multiple:false,singularName:"_errorsText"}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"},ariaRoleDescription:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaRoleDescription"}}},_addErrorLabel:function(){var e=new o({showCloseButton:true,showIcon:true,type:sap.ui.core.MessageType.Error,visible:false}).addStyleClass("sapUiTinyMargin");this.setAggregation("_errorsText",e,true);},_addNewRow:function(e,i){var j=this.oMenu;if(j){j.close();}var w=this._getModel();var E=this.dataBucket.columns&&this.dataBucket.columns.results;if(!w||!E){return;}var G=this.getAggregation("_table"),H=this.getBindingContext(),J=H.getProperty("Id"),V=H.getProperty("Version");var K={RuleId:J,Version:V};e=e||0;var N;if(i){K.Sequence=1;}else{N=G.getContextByIndex(e).getPath();K.Sequence=w.getProperty(N).Sequence;K.Sequence++;}K.Id=this._calNextRowId();w.createEntry("/DecisionTableRows",{properties:K});G.setSelectedIndex(K.Sequence-1);this._clearErrorMessages();this._saveWorkAround([],this.oBundle.getText("addRowSuccess"));},_addNewRowWorkaround:function(e){var i=this._internalModel.getProperty("/selectedRow");this._addNewRow(i,e);},_addNodeObject:function(e){var N=[];var i=sap.ui.getCore().byId(this.getAstExpressionLanguage());var j=i._astBunldeInstance.ASTUtil;var w=[];w.Root=e.Root;w.SequenceNumber=e.Sequence;w.ParentId=e.ParentId;w.Reference=e.Reference;w.Id=e.NodeId;w.Type=e.Type;w.Value=e.Value?e.Value:"";if(e.Type==="I"){w.Value=e.IncompleteExpression;}if(e.Function){w.Function=e.Function;}if(e.Type!=="P"&&e.Type!=="O"&&!e.Function){var E=[];E.BusinessDataType=e.Output?e.Output.BusinessDataType:e.BusinessDataType;E.DataObjectType=e.Output?e.Output.DataObjectType:e.DataObjectType;w.Output=E;}j.createNode(w);},_addTable:function(){var e=new T({visibleRowCount:this.VISIBLEROWCOUNT,threshold:this.THRESHOLD,visibleRowCountMode:sap.ui.table.VisibleRowCountMode.Fixed,selectionMode:{parts:[{path:"dtModel>/editable"}],formatter:this._decideSelectionMode},rowSelectionChange:function(){this.oParent._rowSelectionChange();},enableColumnReordering:false,busy:"{dtModel>/busyTableState}"});e._updateTableCell=this._updateTableCell;e.setBusyIndicatorDelay(0);this.setAggregation("_table",e,true);},_addToolBar:function(){var e=new a({design:"Transparent",enabled:"{dtModel>/editable}"});var i=new sap.m.Title({text:this.oBundle.getText("decisionTable"),tooltip:this.oBundle.getText("decisionTable")});var j=new c({text:this.oBundle.getText("addRow"),visible:"{dtModel>/editable}",enabled:{parts:[{path:"dtModel>/newTable"}],formatter:this._decideAddRowEnablement},menu:new M({items:this._getMenuItems()})}).setTooltip(this.oBundle.getText("addRow"));var w=new B({text:this.oBundle.getText("deleteRow"),press:[this._deleteRowWorkaround,this],visible:"{dtModel>/editable}",type:sap.m.ButtonType.Transparent,enabled:{parts:[{path:"dtModel>/newTable"},{path:"dtModel>/isAtLeastOneRowSelected"}],formatter:this._decideDeleteRowEnablement}}).setTooltip(this.oBundle.getText("deleteRow"));var E=new B({text:this.oBundle.getText("copyRow"),press:[this._copyRow,this],type:sap.m.ButtonType.Transparent,visible:{parts:[{path:"dtModel>/editable"},{path:"dtModel>/sequenceExist"}],formatter:this._decideLineActionVisibility},enabled:{parts:[{path:"dtModel>/newTable"},{path:"dtModel>/isExactlyOneRowSelected"}],formatter:this._decideCopyRowEnablement}}).setTooltip(this.oBundle.getText("copyRow"));var G=new B({text:this.oBundle.getText("cutRow"),type:sap.m.ButtonType.Transparent,press:[this._cutRow,this],visible:{parts:[{path:"dtModel>/editable"},{path:"dtModel>/sequenceExist"}],formatter:this._decideLineActionVisibility},enabled:{parts:[{path:"dtModel>/newTable"},{path:"dtModel>/isExactlyOneRowSelected"}],formatter:this._decideCopyRowEnablement}}).setTooltip(this.oBundle.getText("cutRow"));var H=new c({text:this.oBundle.getText("pasteRow"),type:sap.m.ButtonType.Transparent,visible:{parts:[{path:"dtModel>/editable"},{path:"dtModel>/sequenceExist"}],formatter:this._decideLineActionVisibility},enabled:{parts:[{path:"dtModel>/newTable"},{path:"dtModel>/isExactlyOneRowSelected"},{path:"dtModel>/isSelection"}],formatter:this._decidePasteRowEnablement},menu:new M({items:this._getPasteMenuItems()})}).setTooltip(this.oBundle.getText("pasteRow"));var S=new B({text:"",press:this._openTableSettings.bind(this),visible:{parts:[{path:"dtModel>/enableSettings"},{path:"dtModel>/editable"}],formatter:this._decideSettingsEnablement},enabled:{parts:[{path:"dtModel>/enableSettings"},{path:"dtModel>/editable"}],formatter:this._decideSettingsEnablement}}).setTooltip(this.oBundle.getText("tableSettings"));S.setIcon("sap-icon://action-settings");e.addContent(i);e.addContent(new d({}));e.addContent(j);e.addContent(new d({width:"1em"}));e.addContent(w);e._delete=w;e.addContent(new d({width:"1em"}));e.addContent(E);e.addContent(new d({width:"1em"}));e.addContent(G);e.addContent(new d({width:"1em"}));e.addContent(H);e.addContent(new d({width:"1em"}));e.addContent(S);e.addContent(new d({width:"1em"}));this.setAggregation("_toolbar",e,true);},_bindColumns:function(){var e=this.getAggregation("_table");var i=[this._getBindModelName(),this.getBindingContextPath(),"/DecisionTable/DecisionTableColumns"].join("");var j="Condition,Result";if(this.getAstExpressionLanguage()){j="Condition/DecisionTableColumnConditionASTs,Result/DecisionTableColumnResultASTs";}e.bindColumns({path:i,parameters:{expand:j},factory:this._columnFactory.bind(this)});e.getBinding("columns").attachDataRequested(this._handleColumnsDataRequested,this);e.getBinding("columns").attachDataReceived(this._handleColumnsDataReceived,this);e.attachColumnResize(e,this._onColumnResize,this);},_onColumnResize:function(){this.columnResized=true;var e={"colResize":true};var E=sap.ui.getCore().getEventBus();E.publish("sap.ui.rules","_onColumnResized",e);},_bindRows:function(){var e=this.getAggregation("_table");var i=[this._getBindModelName(),this.getBindingContextPath(),"/DecisionTable/DecisionTableRows"].join("");var j="Cells";if(this.getAstExpressionLanguage()){j="Cells/DecisionTableRowCellASTs";}var S=new sap.ui.model.Sorter("Sequence");e.bindRows({path:i,parameters:{expand:j},sorter:S});e.getBinding("rows").attachDataRequested(this._handleRowsDataRequested,this);e.getBinding("rows").attachDataReceived(this._handleRowsDataReceived,this);},_bindRule:function(){var e=[this._getBindModelName(),this.getBindingContextPath()].join("");this.bindElement({path:e,parameters:{expand:"DecisionTable"}});this.getElementBinding().attachDataRequested(this._handleRuleDataRequested,this);this.getElementBinding().attachDataReceived(this._handleRuleDataReceived,this);this.getElementBinding().refresh();},_buildMessagesStructure:function(e,j,E){var G;var H;var J;var K;if(!e.details){return j;}for(var w=0;w<e.details.length;w++){G=e.details[w];if(!G.messages){continue;}for(var i=0;i<G.messages.length;i++){J=G.messages[i].description;H=G.messages[i].additionalInfo;if(H.type==="ruleResult"){E.push(J);K="genericError";j[K]=E;}else if(H.type==="column"){K="errorInColumnHeader";j[K]=true;}else if(H.type==="cell"){K="RowId="+H.rowId+",ColId="+H.colId;j[K]=J;}}}return j;},_callCopyRuleRow:function(i,V,S,j,w,E){var G={groupId:"changes"};this._getModel().setDeferredGroups([G.groupId]);var H=function(e){this.resetControl();this._internalModel.setProperty("/busyState",false);}.bind(this);var J=function(e){sap.m.MessageToast.show(e);}.bind(this);var K=function(e){this._getModel().callFunction("/CopyRuleRow",{method:"POST",groupId:G.groupId,urlParameters:{RuleId:i,SourceRowId:S,TargetRowSeq:j,DeleteSourceRow:w,OverrideTargetRow:E}});this._getModel().submitChanges({groupId:G.groupId,success:H,error:J});}.bind(this);if(this._getModel().hasPendingChanges()){this._getModel().submitChanges({groupId:G.groupId,success:K,error:J});}else{K();}},_calNextRowId:function(){var e=this.dataBucket.rows.results;var j=0;for(var i=0;i<e.length;i++){if(e[i].Id>j){j=e[i].Id;}}var w=j+1;return w;},_clearErrorMessages:function(){var e=this.getAggregation("_errorsText");e.setText("");e.setVisible(false);this._internalModel.setProperty("/validationStatus",{},null,true);this._internalModel.setProperty("/valueState",{},null,true);},_closePopover:function(){var e=sap.ui.getCore().byId("popover");if(e){e.close();}},_collectColIdAndExpressionDetails:function(e){var i=e.length;var j=[];for(var w=0;w<i;w++){if(e[w].Result&&e[w].Result.Expression){var E={'columnID':e[w].Result.Id,'expressionContent':e[w].Result.Expression};j.push(E);}}return j;},_columnFactory:function(i,e){var j=this;if(this.multiHeaderFlag){this.multiHeaderFlag=false;}var w=this._getBindModelName();var E=e.getProperty("Type"),G=e.getProperty("Id"),H=e.getProperty("RuleId"),J=e.getProperty("Version");var K={RuleId:H,Id:G,Version:J};var N=w+e.getModel().createKey("/DecisionTableColumnResults",K);var Q=e.getModel();var S=Q.aBindings;this.columnWidth="auto";var V=new C(i,{width:this.columnWidth,minWidth:128,multiLabels:[this._createColIfThenHeader(e),this._createColDescriptionHeader(e,this)],template:this._createCell(e)});w=this._getBindModelName();this.firstResultColumnBound=e.getProperty(w+"Type")===sap.rules.ui.DecisionTableColumn.Result;if(E===sap.rules.ui.DecisionTableColumn.Result){if(this.getAstExpressionLanguage()){V.bindProperty("visible",{parts:[{path:N+"/AccessMode"}],formatter:this._columnVisibility});}if(this.getExpressionLanguage()){V.bindProperty("visible",{parts:[{path:N+"/AccessMode"}],formatter:function(){var W=j.getModel()&&N!==""?j.getModel().getObject(N).BusinessDataType:"";if(W===u.DATE_BUSINESS_TYPE||W===u.TIMESTAMP_BUSINESS_TYPE||W===u.NUMBER||W===u.STRING||W===u.BOOLEAN_BUSINESS_TYPE||W===u.BOOLEAN_ENHANCED_BUSINESS_TYPE){var X=j.getModel().getObject(N).AccessMode;return j._columnVisibility(X);}else{return false;}}});}}return V;},_columnVisibility:function(e){if(e==="Hidden"||e==="HIDDEN"){return false;}else{return true;}},_concatinateColumnsHeaderErrors:function(e){var i="";for(var j in e){if(e.hasOwnProperty(j)){if(e[j].header){i+="In Col: "+j+" - "+e[j].header+"\n";}}}return i;},_concatinateHeaderErrors:function(e){var j="";for(var i=0;i<e.length;i++){j+="\n"+e[i];}return j;},_convertAndValidate:function(){var e=this._getRuleData();var E=sap.ui.getCore().byId(this.getExpressionLanguage());if(E){var i={};if(E&&e){i=E.convertRuleToDisplayValues(e);if(i.deferredResult){i.deferredResult.done(this._processValidationResults.bind(this));}else{this._processValidationResults(i,e);}}}else{this._displayModel.setData(e);this._settingsModel.setData(e);}},_copyRow:function(){this._cutCopyRow("copy");},_createCell:function(e){var i=e.getProperty("Id");var j=e.getProperty("Type");var w=new D({editable:"{dtModel>/editable}",displayModelName:"displayModel",decisionTableCellType:this._decisionTableCellFormatter}).data({colId:i,colType:j,table:this.getAggregation("_table")});if(this.getAstExpressionLanguage()){w.setAstExpressionLanguage(this.getAstExpressionLanguage());}else{w.setExpressionLanguage(this.getExpressionLanguage());}return w;},_createColDescriptionHeader:function(e,i){var j=this;var w=e.getProperty("Type"),E=e.getProperty("Id"),G=e.getProperty("RuleId"),H=e.getProperty("Version");var J="";var K;var N;var Q;var S;var V={RuleId:G,Id:E,Version:H};var W;if(this.getExpressionLanguage()){J="displayModel>";}var X=document.getElementsByClassName("sapUiSizeCozy").length>0?3:1;var Y=new f({maxLines:X}).addStyleClass("sapRULDecisionTableColumnHeaderLabel");if(w===sap.rules.ui.DecisionTableColumn.Condition){N=e.getModel().createKey("/DecisionTableColumnConditions",V);W=e.getModel().createKey("/DecisionTableColumns",V);Q=new sap.ui.model.Context(e.getModel(),N);if(this.getAstExpressionLanguage()){S=i._getExpressionFromAstNodes(Q);}K=J+N;Y.bindText({parts:[{path:K+"/Expression"},{path:W+"/Label"},{path:K+"/FixedOperator"}],formatter:function($,_,a1){var b1="";if(j.getAstExpressionLanguage()){b1=!_?S:_;}else{b1=!_?$:_;}if(a1){var c1=j.getAstExpressionLanguage()?j.astUtil._getCapitalOperatorName(a1):a1;b1+=" "+c1;}return b1;}});Y.bindProperty("tooltip",{parts:[{path:K+"/Expression"},{path:K+"/FixedOperator"}],formatter:function($,_){var a1="";if(j.getAstExpressionLanguage()){a1=S?S:"";}else{a1=$;}if(_){var b1=j.getAstExpressionLanguage()?j.astUtil._getCapitalOperatorName(_):_;a1+=" "+b1;}return a1;}});}else if(w===sap.rules.ui.DecisionTableColumn.Result){var Z=e.getModel().createKey("/DecisionTableColumnResults",V);K=J+Z;Y.bindText({parts:[{path:K+"/DataObjectAttributeName"},{path:K+"/DataObjectAttributeLabel"},{path:"dtModel>/busyState"}],formatter:this._getOutputColumnDescription.bind(this)});Y.bindProperty("tooltip",{parts:[{path:K+"/DataObjectAttributeName"},{path:K+"/DataObjectAttributeLabel"},{path:"dtModel>/busyState"}],formatter:this._getOutputColumnDescription.bind(this)});}return Y;},_createColIfThenHeader:function(e){var i=this._getBindModelName();var j=this.oBundle;return new h({text:{parts:[{path:i+"Type"},{path:i+"Sequence"}],formatter:function(w,S){if(S===1){return j.getText("conditionIfColumn");}else if(w===sap.rules.ui.DecisionTableColumn.Result){return j.getText("resultThenColumn");}else{return"";}}},design:"Bold"});},_createDecisionTableSettings:function(){var e;if(this.isSequenceExistsInOdataMetadata()){e=this._createNewDecisionTableSettings();}else{e=this._createOldDecisionTableSettings();}return e;},_createNewDecisionTableSettings:function(){var e=this._getModel();var i=this.getBindingContext();var j=new sap.rules.ui.DecisionTableSettings({hitPolicies:"{dtModel>/hitPolicies}",newDecisionTable:this._internalModel.getProperty("/newTable"),cellFormat:"{dtModel>/cellFormat}",decisionTableFormat:this.getDecisionTableFormat()});if(this.getAstExpressionLanguage()){j.setAstExpressionLanguage(this.getAstExpressionLanguage());}else{j.setExpressionLanguage(this.getExpressionLanguage());}var w=JSON.stringify(this._settingsModel.getData());var E=JSON.parse(w);var G=new sap.ui.model.json.JSONModel(E);j.setModel(G);j.setModel(this._internalModel,"dtModel");j.setModel(e,"oDataModel");j.setBindingContext(i,"dummy");return j;},_createOldDecisionTableSettings:function(){var e=this._getModel();var i=this.getBindingContext();var j=new p({expressionLanguage:this.getExpressionLanguage(),hitPolicies:"{dtModel>/hitPolicies}",newDecisionTable:this._internalModel.getProperty("/newTable")});j.setModel(e);j.setModel(this._internalModel,"dtModel");j.setBindingContext(i);return j;},_cutCopyRow:function(e){var i=this._getModel();if(!i){return;}var j=this.getAggregation("_table");var S=[];if(j){S=j.getSelectedIndices();}if(S.length!==1){return;}var w=j.getContextByIndex(S[0]).getPath();this._markSelection(false);this.setLineActionBuffer({rowPath:w,operation:e});this._markSelection(true);j.setSelectedIndex(-1);sap.m.MessageToast.show(this.oBundle.getText(e+"RowSuccess"));},_cutRow:function(){this._cutCopyRow("cut");},_dataPartRequested:function(e){this.dataBucket.dataReceived[e]=false;this._setDataLoadedPromise();this._updateBusyState();},_dataPartReceived:function(e){this.dataBucket.dataReceived[e]=true;if(!this._isAllDataReceived()){return;}try{this._convertAndValidate();this.dataBucket.collectRowsMode="replace";}catch(E){window.console.log(E);}this._updateBusyState();this._dataLoaded.resolve();},_decideAddRowEnablement:function(e){return!e;},_decideCopyRowEnablement:function(e,i){return e===false&&i;},_decideDeleteRowEnablement:function(e,i){return e===false&&i;},_decideLineActionVisibility:function(i,e){return i===true&&e;},_decidePasteRowEnablement:function(e,i,j){return e===false&&i&&j;},_decideSelectionMode:function(e){return e?sap.ui.table.SelectionMode.MultiToggle:sap.ui.table.SelectionMode.None;},_decideSettingsEnablement:function(e,i){return e&&i;},_deleteRow:function(){var e=this._getModel();if(!e){return;}var j=this.getAggregation("_table");var S=[];if(j){S=j.getSelectedIndices();}if(S.length===0){return;}var w=S.length;for(var i=0;i<w;i++){var E=j.getContextByIndex(S[i]).getPath();e.remove(E);}j.setSelectedIndex(-1);this._clearErrorMessages();this.setLineActionBuffer({rowPath:null,operation:null});sap.m.MessageToast.show(this.oBundle.getText("deleteRowSuccess"));},_deleteRowWorkaround:function(){var e=this._getModel();if(e.hasPendingChanges()){this._saveWorkAround({success:function(){this._deleteRow();}.bind(this)});}else{this._deleteRow();}},_displayErrorMessages:function(e,i){},_displayHeaderErrorMessages:function(e,i){var j=this.getAggregation("_errorsText");this.oBundle=sap.ui.getCore().getLibraryResourceBundle("sap.rules.ui.i18n");var w=this._concatinateHeaderErrors(e);j.setText(this.oBundle.getText("errorInTableHeader")+w);j.setVisible(true);},_flatRule:function(e){var i=this._getModel();var j={};var w=function(E,G,H){var J=i.createKey(G,H);E[J]=H;};e.DecisionTable.DecisionTableColumns.results.forEach(function(E,G){if(E.Type==="CONDITION"){var H=E.Condition;if(H.parserResults&&H.parserResults.status==="Success"){H.Expression=H.parserResults.converted.Expression;if(H.parserResults.converted.FixedOperator||H.parserResults.converted.FixedOperator===""){H.FixedOperator=H.parserResults.converted.FixedOperator;}else{H.FixedOperator=H.FixedOperator;}}else{try{H.Expression=JSON.parse(H.Expression).text;}catch(J){H.Expression=H.Expression;}try{H.FixedOperator=JSON.parse(H.FixedOperator).text;}catch(J){H.Expression=H.Expression;}}delete H.parserResults;w(j,"DecisionTableColumnConditions",H);}else if(E.Type==="RESULT"){var K=E.Result;w(j,"DecisionTableColumnResults",K);}});e.DecisionTable.DecisionTableRows.results.forEach(function(E){var G=E.Cells;G.results.forEach(function(H){if(H.parserResults&&H.parserResults.status==="Success"){if(H.parserResults.converted.Content){H.Content=H.parserResults.converted.Content;}else{H.Content=H.Content;}}else if(H.parserResults&&H.parserResults.status==="Error"){try{if(H.Content===Object){H.Content=JSON.parse(H.Content).text;}else{H.Content=H.Content;}}catch(J){H.Content="";L.error("failed to pars AST cell in ColId "+H.ColId+" RowId "+H.RowId+" set cell content to empty");}}delete H.parserResults;w(j,"DecisionTableRowCells",H);});});return j;},_getBindModelName:function(){var e="";var i=this.getModelName();if(i){e=i+">";}return e;},_getBlankContent:function(){var e=new h({text:this.oBundle.getText("start")});var S=new f();S.setText("\u00a0");var i=new g({enabled:{parts:[{path:"dtModel>/enableSettings"},{path:"dtModel>/editable"}],formatter:this._decideSettingsEnablement},text:" "+this.oBundle.getText("settings"),press:[this._openTableSettings,this]}).addStyleClass("sapRULDecisionTableLink");var j=new F({justifyContent:"Center",items:[e,S,i],visible:{parts:[{path:"dtModel>/enableSettings"},{path:"dtModel>/editable"}],formatter:this._decideSettingsEnablement}}).addStyleClass("sapUiMediumMargin");return j;},_getDataLoadedPromise:function(){if(!this._dataLoaded){this._setDataLoadedPromise();}return this._dataLoaded.promise();},_getExpressionFromAstNodes:function(e){var i=this;var j=sap.ui.getCore().byId(this.getAstExpressionLanguage());var w=j._astBunldeInstance.TermsProvider.TermsProvider;var E="";var G="";var H=e.getPath();var J=e.getObject(H);var K=J.DecisionTableColumnConditionASTs;var N=j._astBunldeInstance.ASTUtil;var Q=this._internalModel.getProperty("/conditionCellAstValues");var S=0;var V=0;var W=[s.AVG,s.SUM,s.COUNT,s.COUNTDISTINCT,s.DISTINCT,s.MIN,s.MAX,s.FILTER,s.TOP,s.BOTTOM,s.FIRST,s.SELECT,s.SORTASC,s.SORTDESC];N.clearNodes();K=K.__list;if(K&&K.length>0){for(var X in K){var Y=K[X];i._addNodeObject(e.getObject("/"+Y));}var Z=N.getNodes();var $=i._getDateFormatter();var _=i._getDateTimeFormatter();E=N.toAstExpressionStringForDt(Z,$,_);V=E.JSON.length;var a1=e.getObject(e.getPath()).FixedOperator;var b1=i.astUtil._getCapitalOperatorName(a1);if(E&&E.relString){E.relString=E.relString.replace(/\\/g,"\\\\").replace(/{/g,"\\{").replace(/}/g,"\\}");}Q[e.getPath()]={"headerValue":E.relString+" "+b1};var c1=E.shortRELString?E.shortRELString.split(" "):[];c1=E.displayString?E.displayString.split(" "):[];for(var d1 in c1){var e1="";if(c1[d1].startsWith("./")||c1[d1].startsWith("/")){e1=w.getTermNameFromASTNodeReference(c1[d1]);}if(e1!==""){G=G+" "+e1;}else{var f1=c1[d1].split("(");if(i.includes(W,f1[0])&&S<V){c1[d1]=c1[d1].replace(E.JSON[S].dataObject,w.getTermNameFromASTNodeReference(E.JSON[S].dataObject));S++;}G=G+" "+c1[d1];}}if(G!=""){E=G;}}if(!Q[e.getPath()]){Q[e.getPath()]={"headerValue":""};}this._internalModel.setProperty("/conditionCellAstValues",Q);return(E instanceof Object?E.shortRELString:E.trim());},_getMenuItems:function(){var e=[new n({text:this.oBundle.getText("insertFirst"),enabled:true,press:this._addNewRowWorkaround.bind(this,true)}),new n({text:this.oBundle.getText("insertAfter"),enabled:{parts:[{path:"dtModel>/newTable"},{path:"dtModel>/isExactlyOneRowSelected"}],formatter:this._decideCopyRowEnablement},press:this._addNewRowWorkaround.bind(this,false)})];return e;},_getModel:function(){var e=this.getModelName();if(e){return this.getModel(e);}return this.getModel();},_getOutputColumnDescription:function(N,e){var i;if(this.getExpressionLanguage()){i=sap.ui.getCore().byId(this.getExpressionLanguage());if(i&&i._isDataExist()){var j=this.getBindingContext().getProperty("ResultDataObjectId");var w=i.getResultColumnDescription(N,j,e);return w;}}return(e?e:N);},_getPasteMenuItems:function(){var e=[new n({text:this.oBundle.getText("pasteRowAction"),enabled:{parts:[{path:"dtModel>/newTable"},{path:"dtModel>/isExactlyOneRowSelected"}],formatter:this._decideCopyRowEnablement},press:this._rowAction.bind(this,"paste")}),new n({text:this.oBundle.getText("insertBeforeRowAction"),enabled:{parts:[{path:"dtModel>/newTable"},{path:"dtModel>/isExactlyOneRowSelected"}],formatter:this._decideCopyRowEnablement},press:this._rowAction.bind(this,"insertBefore")}),new n({text:this.oBundle.getText("insertAfterRowAction"),enabled:{parts:[{path:"dtModel>/newTable"},{path:"dtModel>/isExactlyOneRowSelected"}],formatter:this._decideCopyRowEnablement},press:this._rowAction.bind(this,"insertAfter")})];return e;},_getRuleData:function(){var e=this.getBindingContextPath();var i=this._getModel();var j=q.extend({},true,i.getProperty(e,null,true));var w=j.DecisionTable;w.DecisionTableColumns=this.dataBucket.columns;w.DecisionTableRows=this.dataBucket.rows;return j;},_handleColumnsDataReceived:function(e){var i=e.getParameter("data");if(!i){return;}var j=this.getAggregation("_table");if(i.results&&i.results.length>0){this._internalModel.setProperty("/newTable",false);j.setNoData(null);this._setExpressionLanguageVersionOnoData(false);}else{this._internalModel.setProperty("/newTable",true);var w=this._getBlankContent();j.setNoData(w);this._setExpressionLanguageVersionOnoData(true);}this.dataBucket[x.columns]=i;this._dataPartReceived(x.columns);this._handleHeaderSpan();},_handleColumnsDataRequested:function(e){this._dataPartRequested(x.columns);},_handleRowsDataReceived:function(e){var i=e.getParameter("data");if(i){if(this.dataBucket.collectRowsMode==="replace"){this.dataBucket[x.rows]=i;this.dataBucket.collectRowsMode="append";}else{var j=this.dataBucket[x.rows];var w={results:(j.results)?j.results.concat(i.results):i.results};this.dataBucket[x.rows]=w;}this._dataPartReceived(x.rows);}this._setTableRows();},_handleRowsDataRequested:function(e){this._dataPartRequested(x.rows);},_handleRuleDataReceived:function(e){if(e){this._dataPartReceived(x.rule);}},_handleRuleDataRequested:function(){this._dataPartRequested(x.rule);},_handleVocabularyDataChanged:function(e){var i=e.getParameter("data");if(i){this._handleVocabularyDataReceived(i);}else{this._handleVocabularyDataRequested();}},_handleVocabularyDataReceived:function(e){if(e){this._dataPartReceived(x.vocabulary);}},_handleVocabularyDataRequested:function(){this._dataPartRequested(x.vocabulary);},_handleHeaderSpan:function(){if(!this.multiHeaderFlag){var i;this.multiHeaderFlag=true;var e=this.dataBucket.columns.results;this.iNumOfCondition=0;this.iNumOfResults=0;for(i=0;i<e.length;i++){if(e[i].Type===sap.rules.ui.DecisionTableColumn.Condition){this.iNumOfCondition++;}else if(e[i].Type===sap.rules.ui.DecisionTableColumn.Result){this.iNumOfResults++;}}var j=this.getAggregation('_table');e=j.getAggregation('columns');for(i=0;i<this.iNumOfCondition;i++){e[i].setHeaderSpan([this.iNumOfCondition,1]);}for(;i<e.length;i++){e[i].setHeaderSpan([this.iNumOfResults,1]);}}},_initDataBucket:function(){var e=false;var E;if(this.getAstExpressionLanguage()){E=sap.ui.getCore().byId(this.getAstExpressionLanguage());}else{E=sap.ui.getCore().byId(this.getExpressionLanguage());}if(E&&E._isDataExist()){e=true;}this.dataBucket={dataReceived:{vocabulary:e,rule:false,rows:false,columns:false},rows:{},columns:{},collectRowsMode:"replace"};},_initDisplayModel:function(){this._displayModel=new sap.ui.model.json.JSONModel();this.setModel(this._displayModel,"displayModel");this._settingsModel=new sap.ui.model.json.JSONModel();this.setModel(this._settingsModel,"settingModel");},_initInternalModel:function(){var e={};e.editable=this.getEditable();e.newTable=true;e.sequenceExist=true;e.busyState=true;e.busyTableState=true;e.cellFormat=this.getCellFormat();e.hitPolicies=this.getHitPolicies();e.enableSettings=this.getEnableSettings();e.isAtLeastOneRowSelected=false;e.isExactlyOneRowSelected=false;e.isSelection=false;e.validationStatus={};e.valueState={};e.selectedRow=null;e.conditionCellAstValues=[];e.ruleBindingPath="";this._internalModel=new sap.ui.model.json.JSONModel(e);this.setModel(this._internalModel,"dtModel");},_isAllDataReceived:function(){var e=this.dataBucket.dataReceived;return e.rule&&e.rows&&e.columns&&e.vocabulary;},_markSelection:function(e){var j=this.getLineActionBuffer().rowPath;var w=this.getAggregation("_table");var E=this._getModel();if(j){var G=w.getFirstVisibleRow();var H=E.getProperty(j).Sequence-1;if((H-G>-1)&&(H-G<w.getVisibleRowCount())){var J=w.getRows()[H-G];var K=J.getCells();if(K){for(var i=0;i<K.length;i++){if(e){K[i].addStyleClass("sapRULDecisionTableSCellMarked");}else{K[i].removeStyleClass("sapRULDecisionTableSCellMarked");}}}}}},_openTableSettings:function(){this.dataBucket.dataReceived.rows=false;var e=this._createDecisionTableSettings();var j=new b({contentWidth:"70%",contentHeight:"490px",title:this.oBundle.getText("tableSettings")});j.addContent(e);var w=e.getButtons(j);for(var i=0;i<w.length;i++){j.addButton(w[i]);}j.attachBeforeClose(function(E){var G=j.getState();j.destroy();if(G===sap.ui.core.ValueState.Success){this._initDisplayModel();this._refreshBinding();}},this);this._closePopover();j.open();},_processValidationResults:function(e,i){if(e&&e.output){if(e.output.status==="Error"){var j=[];var w=this._internalModel.getProperty("/validationStatus");var E={};w=this._buildMessagesStructure(e,w,j);for(var G in w){if(w.hasOwnProperty(G)&&(typeof w[G]==="string")&&w[G]!=="null"){E[G]=sap.ui.core.ValueState.Error;}}this._displayErrorMessages(j,w);this._internalModel.setProperty("/validationStatus",w,null,true);this._internalModel.setProperty("/valueState",E,null,true);}var H=this._flatRule(e.output.decisionTableData);this._settingsModel.setData(e.output.decisionTableData);if(this.dataBucket.rows.results){this._settingsModel.rowLength=this.dataBucket.rows.results.length;}this._displayModel.setData(H,true);}},_rowAction:function(e){this._rowActionWorkAround(e);},_rowActionWorkAround:function(e){var i=this._internalModel.getProperty("/selectedRow");this._markSelection(false);var j=this.getLineActionBuffer();this.setLineActionBuffer({rowPath:null,operation:null});var w=this.getAggregation("_table");var E=i+1;if(e==="insertAfter"){E++;}var G=this._getModel();var S=G.getProperty(j.rowPath).Id;var H=G.getProperty(j.rowPath).RuleId;var V=G.getProperty(j.rowPath).Version;this._internalModel.setProperty("/busyState",true);var J=(j.operation==="cut");if(e==="paste"){this._callCopyRuleRow(H,V,S,E,J,true);}else{this._callCopyRuleRow(H,V,S,E,J,false);}w.setSelectedIndex(-1);if(e==="insertBefore"||e==="insertAfter"){sap.m.MessageToast.show(this.oBundle.getText("addRowSuccess"));}if(e==="paste"){sap.m.MessageToast.show(this.oBundle.getText("pasteSuccess"));}},_refreshBinding:function(){var e=this.getAggregation("_table");var i=this.getElementBinding();if(i){i.refresh();}var j=e.getBinding("columns");if(j){j.refresh();}var w=e.getBinding("rows");if(w){w.refresh();}var E=sap.ui.getCore().getEventBus();E.publish("sap.ui.rules","refreshDTRuleModel");},_rowSelectionChange:function(){var e=this.getAggregation("_table");var S=[];if(e){S=e.getSelectedIndices();}if(S.length>0){this._internalModel.setProperty("/isAtLeastOneRowSelected",true);this._internalModel.setProperty("/selectedRow",S[0]);}else{this._internalModel.setProperty("/isAtLeastOneRowSelected",false);}if(S.length==1){this._internalModel.setProperty("/isExactlyOneRowSelected",true);}else{this._internalModel.setProperty("/isExactlyOneRowSelected",false);}if(this.getLineActionBuffer().rowPath){this._internalModel.setProperty("/isSelection",true);}else{this._internalModel.setProperty("/isSelection",false);}},_setDataLoadedPromise:function(){if(!this._dataLoaded||this._dataLoaded.state()!=="pending"){this._dataLoaded=new q.Deferred();}},_setExpressionLanguageVersionOnoData:function(N){var e=this._getModel();var i=this.getBindingContext();var V="1.0.0";if(N){var E;if(this.getAstExpressionLanguage()){E=sap.ui.getCore().byId(this.getAstExpressionLanguage());V="2.0.0";}else{E=sap.ui.getCore().byId(this.getExpressionLanguage());V=E.getExpressionLanguageVersion();}e.setProperty("ExpressionLanguageVersion",V,i,true);}else{V=e.getProperty(this.getBindingContextPath()+'/ExpressionLanguageVersion');if(!V){V="1.0.0";}}this._decisionTableCellFormatter.setExpressionLanguageVersion(V);},_setTableRows:function(){var e=this.getAggregation("_table");var i=e.getBinding("rows");var V=y;if(i&&i.getLength()){V=Math.min(i.getLength(),this.VISIBLEROWCOUNT);}var j=e.getVisibleRowCount();if(j!==V){e.setVisibleRowCount(V);}if((this.dataBucket&&this.dataBucket.rows&&this.dataBucket.rows.results.length===0)||!this.getEditable()){e.setSelectionMode(sap.ui.table.SelectionMode.None);}else{e.setSelectionMode(sap.ui.table.SelectionMode.MultiToggle);}},_unbindColumns:function(){var e=this.getAggregation("_table");e.unbindColumns();},_unbindRows:function(){var e=this.getAggregation("_table");e.unbindRows();},_unbindRule:function(){this.unbindElement();},_updateBusyState:function(){var e=this.dataBucket.dataReceived;var i=e.rule&&e.columns&&e.vocabulary;var j=!i;this._internalModel.setProperty("/busyState",j);var w=!e.rows;this._internalModel.setProperty("/busyTableState",w);},_updateTableCell:function(e,i,j,w){e.removeStyleClass("sapRULDecisionTableSCellMarked");var E="null";var G=this;var H=this.getParent();if(i){var J=e.data("colId");var K=i.getProperty("Id");var N=i.getProperty("RuleId");var Q=i.getProperty("Version");var S=i.getModel();var V='';var W='';var X={RuleId:N,ColId:J,RowId:K,Version:Q};var Y=S.createKey("/DecisionTableRowCells",X);var Z=new sap.ui.model.Context(S,Y);var $={RuleId:N,Id:J,Version:Q};var _=S.createKey("/DecisionTableColumnConditions",$);var a1=H.getModel("dtModel").getData().conditionCellAstValues;var b1={RuleId:N,Id:J,Version:Q};var c1={Id:N,Version:Q};E=Y+"/Content";switch(e.data("colType")){case"CONDITION":V="/"+S.createKey("DecisionTableColumnConditions",b1);W="/"+S.createKey("Rules",c1);e.setHeaderValuePath(V+'/Expression');e.setFixedOperatorPath(V+'/FixedOperator');e.setRuleFormatPath(W+'/RuleFormat');e.setDecisionTableFormat(G.getParent().getDecisionTableFormat());e.setValueOnlyPath(V+'/ValueOnly');if(a1[_]){e.setHeaderInfo(a1[_]);}break;case"RESULT":V="/"+S.createKey("DecisionTableColumnResults",b1);W="/"+S.createKey("Rules",c1);e.setTypePath(V+'/BusinessDataType');if(sap.ui.getCore().byId(H.getAstExpressionLanguage())){var d1=H.getModel("settingModel").getData().ResultDataObjectId;var e1=S.getProperty(V+'/DataObjectAttributeId');e.setAttributeInfoPath("/"+d1+"/"+e1);}else{e.setAttributeInfoPath(V+'/DataObjectAttributeId');}e.setAttributeNamePath(V+'/DataObjectAttributeName');e.setRuleFormatPath(W+'/RuleFormat');e.setDecisionTableFormat(G.getParent().getDecisionTableFormat());break;default:break;}e.setKeyProperties(X);e.setValueStateTextPath("dtModel>/validationStatus/"+"RowId="+K+",ColId="+J);e.setValueStatePath("dtModel>/valueState/"+"RowId="+K+",ColId="+J);}e.setValuePath(E);},exit:function(){var e=this.oMenu;if(e){e.destroy();}},init:function(){this.multiHeaderFlag=false;this.resetContent=true;this.astUtil=new t();this._initInternalModel();this._initDisplayModel();this._initDataBucket();this.bindProperty("busy","dtModel>/busyState");this.oBundle=sap.ui.getCore().getLibraryResourceBundle("sap.rules.ui.i18n");this._addToolBar();this._addTable();this._addErrorLabel();this._decisionTableCellFormatter=new r();this.setBusyIndicatorDelay(0);},isSequenceExistsInOdataMetadata:function(){var e=this.getModel();if(e){var w=e.getServiceMetadata();if(w){var E=w.dataServices.schema[0].entityType;var G;var H;var J;for(var i=0;i<E.length;i++){G=E[i];if(G.name!=="DecisionTableColumn"){continue;}H=G.property;for(var j=0;j<H.length;j++){J=H[j];if(J.name==="Sequence"){return true;}}}}}return false;},onBeforeRendering:function(){if(this.resetContent){this.resetControl();this.resetContent=false;}},resetControl:function(){this._unbindRule();this._unbindRows();this._unbindColumns();this._clearErrorMessages();this._initDataBucket();this._initDisplayModel();this._updateBusyState();var e=this._getModel();var i=this.getBindingContextPath();if(!i||!e){return;}var j=new sap.ui.model.Context(e,i);this._internalModel.setProperty("/ruleBindingPath",i);this.setBindingContext(j);this._bindRule();this._bindRows();this._bindColumns();},setAstExpressionLanguage:function(e){this.setAssociation("astExpressionLanguage",e,true);var i=(e instanceof Object)?e:sap.ui.getCore().byId(e);if(!i){return this;}var j=this.getAggregation("_table");if(j){var w=j.getBinding("columns");if(w){w.refresh();}}if(i._isDataExist()){var E=new sap.ui.base.Event("","",{data:true});this._handleVocabularyDataChanged(E);}i.attachDataChange(this._handleVocabularyDataChanged.bind(this));return this;},setBindingContextPath:function(e){var i=this.getBindingContextPath();if(e&&(i!==e)){this._unbindRule();this._unbindRows();this._unbindColumns();this.setProperty("bindingContextPath",e);this.resetContent=true;this._initDataBucket();var j=this.getModel();if(!j.isMetadataLoadingFailed()){if(j.getServiceMetadata()){this._internalModel.setProperty("/sequenceExist",this.isSequenceExistsInOdataMetadata());}else{j.attachMetadataLoaded(function(){this._internalModel.setProperty("/sequenceExist",this.isSequenceExistsInOdataMetadata());}.bind(this));}}}return this;},setCellFormat:function(e){this.setProperty("cellFormat",e,true);this._internalModel.setProperty("/cellFormat",e);return this;},setEditable:function(e){this.setProperty("editable",e,true);this._internalModel.setProperty("/editable",e);this._internalModel.setProperty("/sequenceExist",this.isSequenceExistsInOdataMetadata());var i=this.getAggregation("_table");var j=this.getAggregation("_toolbar");if(e===false){i.addStyleClass("sapRULDecisionTableEdit");j.removeStyleClass("sapRULDecisionTableToolBar");}else{i.removeStyleClass("sapRULDecisionTableEdit");j.addStyleClass("sapRULDecisionTableToolBar");}if(e===false){this._clearErrorMessages();}return this;},setEnableSettings:function(e){this.setProperty("enableSettings",e,true);this._internalModel.setProperty("/enableSettings",e);return this;},setExpressionLanguage:function(e){this.setAssociation("expressionLanguage",e,true);this._decisionTableCellFormatter.setExpressionLanguage(this.getExpressionLanguage());var i=(e instanceof Object)?e:sap.ui.getCore().byId(e);if(!i){return this;}var j=this.getAggregation("_table");if(j){var w=j.getBinding("columns");if(w){w.refresh();}}if(i._isDataExist()){var E=new sap.ui.base.Event("","",{data:true});this._handleVocabularyDataChanged(E);}i.attachDataChange(this._handleVocabularyDataChanged.bind(this));return this;},setHitPolicies:function(e){this.setProperty("hitPolicies",e,true);this._internalModel.setProperty("/hitPolicies",e);return this;},setModelName:function(e){this.setProperty("modelName",e);this.resetContent=true;return this;}});sap.rules.ui.DecisionTable.prototype._saveWorkAround=function(e,i){var j=this._getModel();j.submitChanges(e);sap.m.MessageToast.show(i);};sap.rules.ui.DecisionTable.prototype.includes=function(e,i){var j=false;if(e.indexOf(i)!==-1){j=true;}return j;};sap.rules.ui.DecisionTable.prototype._getLocaleData=function(){var e=sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale();return v.getInstance(e);};sap.rules.ui.DecisionTable.prototype._getDateFormatter=function(){var e=this._getLocaleData();var i=e.getDatePattern('medium');var j=sap.ui.core.format.DateFormat.getDateInstance({pattern:i});return j;};sap.rules.ui.DecisionTable.prototype._getDateTimeFormatter=function(){var e=this._getLocaleData();var i=e.getDatePattern('medium');var j=e.getTimePattern('medium');var w=sap.ui.core.format.DateFormat.getDateTimeInstance({pattern:i+" "+j});return w;};sap.rules.ui.DecisionTable.prototype.VISIBLEROWCOUNT=30;sap.rules.ui.DecisionTable.prototype.THRESHOLD=30;return z;},true);
