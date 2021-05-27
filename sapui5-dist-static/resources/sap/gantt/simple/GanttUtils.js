/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/base/Log","sap/ui/core/Core","sap/gantt/misc/Utility","sap/ui/core/format/DateFormat","sap/ui/core/Locale","sap/m/OverflowToolbar","sap/ui/core/theming/Parameters","sap/ui/Device","./CoordinateUtils","sap/gantt/misc/Format"],function(q,L,C,U,D,d,O,P,e,f,F){"use strict";var o={};var g={};var h=false;var m=false;var G={SHAPE_ID_DATASET_KEY:"data-sap-gantt-shape-id",ROW_ID_DATASET_KEY:"data-sap-gantt-row-id",CONNECTABLE_DATASET_KEY:"data-sap-gantt-connectable",SELECT_FOR_DATASET_KEY:"sap-gantt-select-for",SHAPE_CONNECT_FOR_DATASET_KEY:"sap-gantt-shape-connect-for",SHAPE_CONNECT_INDICATOR_WIDTH:10,shapeElementById:function(s,a){var b=window.document.getElementById(a),S=b.querySelector("g.sapGanttChartShapes");var n=S.querySelectorAll("["+G.SHAPE_ID_DATASET_KEY+"='"+s+"']");var E=n[0];if(E){return q(E).control(0);}return null;},getValueX:function(s){var n;var p=s.getMetadata().getProperty("x");if(p){n=s.getProperty(p.name);if(n!==null&&n!==undefined){return n;}}var r=C.getConfiguration().getRTL(),t=r?(s.getEndTime()||s.getTime()):s.getTime();if(t){n=s.getXByTime(t);}if(!q.isNumeric(n)){L.warning("couldn't convert timestamp to x with value: "+t);}return n;},getRowInstance:function(E,t){var r=q(E.target).closest("rect.sapGanttBackgroundSVGRow").data("sapUiIndex");if(r!=null){return t.getRows()[r];}},getRowInstancefromShape:function(s){var r=s.getParentRowSettings();if(r!=null){return r.getParentRow();}},_get2dContext:function(i,s){if(!o.context){o.context=document.createElement('canvas').getContext("2d");}if(o.fontSize!==i||o.fontFamily!==s){o.context.font=i+"px "+s;o.fontSize=i;o.fontFamily=s;}return o.context;},getShapeTextWidth:function(t,i,s){return this._get2dContext(i,s).measureText(t).width;},getSelectedTableRowSettings:function(t,s){var a=t.getRows(),i=t.getFirstVisibleRow();if(a.length===0){return null;}var b=a[0].getIndex();var I=s-i;if(b!==i){I+=Math.abs(b-i);}return a[I].getAggregation("_settings");},updateGanttRows:function(a,r,i){var b=a.getParent().getParent();var $=q(document.getElementById(b.getId()+"-svg")),c=$.find("rect.sapGanttBackgroundSVGRow");c.eq(i).toggleClass("sapGanttBackgroundSVGRowSelected",!!r[i].selected);c.eq(i).toggleClass("sapGanttBackgroundSVGRowHovered",!!r[i].hovered);},getShapesWithUid:function(c,s){var E=function(S){var p=U.parseUid(S),a=p.shapeId;var b=["[id='",c,"']"," ["+G.SHAPE_ID_DATASET_KEY+"='",a,"']"].join("");return q(b).control().filter(function(i){return i.getShapeUid()===S;})[0];};return s.map(E);},getTimeFormaterBySmallInterval:function(a){var A=a.getAxisTimeStrategy(),s=A.getTimeLineOption().smallInterval,u=s.unit;var c=A.getCalendarType(),b=A.getLocale()?A.getLocale():new d(C.getConfiguration().getLanguage().toLowerCase());var i="yyyyMMMddhhms";if(!(u===sap.gantt.config.TimeUnit.minute||u===sap.gantt.config.TimeUnit.hour)){i="yyyyMMMdd";}return D.getDateTimeInstance({format:i,style:s.style,calendarType:c},s.locale?new d(s.locale):b);},resetStrokeDasharray:function(a){var s=a.getSimpleAdhocLines().find(function(x){return x._getSelected();});if(s){s._setSelected(false);var b=document.getElementById(s._getHeaderLine().sId);var c=document.getElementById(s._getLine().sId);var i=document.getElementById(s._getMarker().getId());i.style.cursor="pointer";if(c&&b){c.style.strokeDasharray=s.getStrokeDasharray();b.style.strokeDasharray=s.getStrokeDasharray();c.style.strokeWidth=s._getStrokeWidth();b.style.strokeWidth=s._getStrokeWidth();}}var S=a.getDeltaLines().find(function(x){return x._getIsSelected();});if(S){var j=S._getChartDeltaArea();if(j){var $=document.getElementById(j.sId);if(S._getEnableChartDeltaAreaHighlight()===true){$.style.opacity=0.0;}}var k=document.getElementById(S._getStartLine().sId);var E=document.getElementById(S._getEndLine().sId);var H=document.getElementById(S._getHeaderStartLine().sId);var l=document.getElementById(S._getHeaderEndLine().sId);var n=document.getElementById(S._getForwardMarker().sId);var B=document.getElementById(S._getBackwardMarker().sId);var p=document.getElementById(S._getHeaderDeltaArea().sId);var r=P.get("sapUiChartDataPointBorderColor");k.style.strokeDasharray=S.getStrokeDasharray();E.style.strokeDasharray=S.getStrokeDasharray();H.style.strokeDasharray=S.getStrokeDasharray();l.style.strokeDasharray=S.getStrokeDasharray();k.style.strokeWidth=S._getStrokeWidth();E.style.strokeWidth=S._getStrokeWidth();H.style.strokeWidth=S._getStrokeWidth();l.style.strokeWidth=S._getStrokeWidth();n.style.fillOpacity=0;B.style.fillOpacity=0;p.style.opacity=1;p.style.cursor="pointer";n.style.stroke=null;B.style.stroke=null;if(S._getVisibleMarker()===true){n.style.fillOpacity=1;B.style.fillOpacity=1;n.style.stroke=r;B.style.stroke=r;}var R=a._getResizeExtension();R.clearAllDeltaOutline();S._setIsSelected(false);}},adhocLinesPresentAndEnabled:function(a){return a.getSimpleAdhocLines().filter(function(A){return A.MarkerType!=sap.gantt.simple.MarkerType.None;}).length>0&&a.getEnableAdhocLine();},addToolbarToTable:function(s,t,i){if(t.getExtension().length==0){var a=new O();if(i){a.addContent(s.oExportTableToExcelButton);}t.addExtension(a);}else{if(i){t.getExtension()[0].addContent(s.oExportTableToExcelButton);}}},findSpaceInLevel:function(l,s,a,b){for(var j=0;j<g[l].length;j++){if(m){return;}if(g[l].length>1){if(j===0&&s[b]()<=g[l][j][a]()){g[l].push(s);h=true;}else if(g[l][j+1]!==undefined&&s[a]()>=g[l][j][b]()&&s[b]()<=g[l][j+1][a]()){g[l].push(s);h=true;}else if(j===g[l].length-1&&s[a]()>=g[l][j][b]()){g[l].push(s);h=true;}else{if(j===g[l].length-1&&parseInt(l,10)===Object.keys(g).length-1){g[parseInt(l,10)+1]=[s];h=true;}else{h=false;}}}else{if(s[a]()>=g[l][j][b]()||s[b]()<=g[l][j][a]()){g[l].push(s);h=true;}else{if(parseInt(l,10)===Object.keys(g).length-1){g[parseInt(l,10)+1]=[s];h=true;}else{h=false;}}}if(h){j=g[l].length;m=true;g=this.sortShapesByTime(g,l,a);}}},sortShapesByTime:function(s,l,a){var b=s[l].length;var c;do{c=false;for(var i=0;i<b;i++){if(s[l][i+1]!==undefined){if(s[l][i][a]()>s[l][i+1][a]()){var t=s[l][i];s[l][i]=s[l][i+1];s[l][i+1]=t;c=true;}}}}while(c);return s;},_partitionShapesIntoOverlappingRanges:function(s,a,b){g={};var c="get"+a.charAt(0).toUpperCase()+a.slice(1);var j="get"+b.charAt(0).toUpperCase()+b.slice(1);if(s.length>0){g[0]=[s[0]];}for(var i=1,l=s.length;i<l;i++){m=false;for(var k in g){this.findSpaceInLevel(k,s[i],c,j);}}return g;},calculateLevelForShapes:function(a,s,b){var c=function(j){return j.reduce(function(k,t){return k.concat(Array.isArray(t)?c(t):t);},[]);};var r=this._partitionShapesIntoOverlappingRanges(a,s,b);var M=0;var R=Object.values(r).map(function(j,k){j.map(function(l){var n=k+1;if(l._setLevel){l._setLevel(n);}l._level=n;if(M<n){M=n;}return l;});return j;});var S=c(R);var i={shapes:S,maxLevel:M};return i;},_partitionLinesIntoOverlappingRanges:function(c){c.sort(function(a,b){if(a.getTimeStamp()<b.getTimeStamp()){return-1;}if(a.getTimeStamp()>b.getTimeStamp()){return 1;}return 0;});var j=function(k){if(k.length==0){return false;}k.sort(function(a,b){var M;if(a instanceof sap.gantt.simple.AdhocLine){M=a.getTimeStamp();}else{M=a.getEndTimeStamp();}var n;if(b instanceof sap.gantt.simple.AdhocLine){n=b.getTimeStamp();}else{n=b.getEndTimeStamp();}if(M<n){return 1;}if(M>n){return-1;}return 0;});if(k[0]instanceof sap.gantt.simple.AdhocLine){return k[0].getTimeStamp();}else{return k[0].getEndTimeStamp();}};var r=[];var I=0;if(c.length>0){r[I]=[c[0]];}for(var i=1,l=c.length;i<l;i++){if(c[i].getTimeStamp()>=c[i-1].getTimeStamp()&&c[i].getTimeStamp()<j(r[I])){r[I].push(c[i]);}else{I++;r[I]=[c[i]];}}return r;},calculateLevelForMarkers:function(a,b){var c=function(k){return k.reduce(function(l,t){return l.concat(Array.isArray(t)?c(t):t);},[]);};var A=a.concat(b);var r=this._partitionLinesIntoOverlappingRanges(A);var M=0;var R=r.map(function(s){s.map(function(k,l){var n=l+1;k._setLevel(n);if(M<n){M=n;}return k;});return s;});var i=c(R);var j={adhocLines:i.filter(function(l){if(sap.gantt.simple.AdhocLine){return l instanceof sap.gantt.simple.AdhocLine;}}),deltaLines:i.filter(function(l){if(sap.gantt.simple.DeltaLine){return l instanceof sap.gantt.simple.DeltaLine;}}),maxLevel:M};return j;},getShapeSuccessors:function(s,a){var S=[];if(s.getEnableChainSelection()){var v=this._getVisibleRelationships(a);var A=v.filter(function(x){return x.getPredecessor()===s.getShapeId();});A.forEach(function(r){var b=r.getRelatedInRowShapes(a.getId());if(b.successor){S.push(b.successor);}});S=Array.from(new Set(S));}return S;},getShapePredeccessors:function(s,a){var S=[];if(s.getEnableChainSelection()){var v=this._getVisibleRelationships(a);var A=v.filter(function(x){return x.getSuccessor()===s.getShapeId();});A.forEach(function(r){var b=r.getRelatedInRowShapes(a.getId());if(b.predecessor){S.push(b.predecessor);}});S=Array.from(new Set(S));}return S;},selectAssociatedShapes:function(p,a){var s=p.shape;var b=a._getDragDropExtension();var n=!s.getSelected();if(b.shapeSelectedOnMouseDown&&!b.initiallySelected&&!a.getEnableSelectAndDrag()){n=b.shapeSelectedOnMouseDown;}var S=[s];if(s.getEnableChainSelection()){S=this._getShapesToSelect(s,a);}S.forEach(function(c){this.oSelection.updateShape(c.getShapeUid(),{selected:n,ctrl:true,draggable:c.getDraggable(),time:c.getTime(),endTime:c.getEndTime()});}.bind(a));return S;},_getShapesToSelect:function(s,a){var S=[s];var v=this._getVisibleRelationships(a);var A=v.filter(function(x){return x.getPredecessor()===s.getShapeId()||x.getSuccessor()===s.getShapeId();});A.forEach(function(r){var b=r.getRelatedInRowShapes(a.getId());if(b.predecessor&&b.predecessor.getSelectableInChainSelection()){S.push(b.predecessor);}if(b.successor&&b.successor.getSelectableInChainSelection()){S.push(b.successor);}});S=Array.from(new Set(S));return S;},_getVisibleRelationships:function(a){var r=[];a.getTable().getRows().forEach(function(b){var R=b.getAggregation('_settings').getRelationships();r=r.concat(R);});r=Array.from(new Set(r));return r;},rerenderAssociatedRelationships:function(a,s){var r=C.createRenderManager();var b=[];var v=this._getVisibleRelationships(a);v.forEach(function(x){if(x.getSuccessor()===s.getShapeId()||x.getPredecessor()===s.getShapeId()){b.push(x);}});b.forEach(function(R){R.renderElement(r,R,a.getId());});},getFilteredShapeType:function(s){s=Array.from(new Set(s));return s.filter(function(v){return v!=="None";});},getPathCorners:function(p,r){var t=p.replace(/([A-Z])/g,' $1');var R=[],b;var i=t.split(/[,\s]/).reduce(function(c,s){var a=s.match("([a-zA-Z])(.+)");if(a){c.push(a[1]);c.push(a[2]);}else{c.push(s);}return c;},[]);var S=i.reduce(function(S,a){if(parseFloat(a)==a&&S.length){S[S.length-1].push(a);}else{S.push([a]);}return S;},[]);function j(a,c,s){var X=c.x-a.x;var Y=c.y-a.y;var Z=Math.sqrt(X*X+Y*Y);return k(a,c,Math.min(1,s/Z));}function k(a,c,s){return{x:a.x+(c.x-a.x)*s,y:a.y+(c.y-a.y)*s};}function A(s,a){if(s.length>2){s[s.length-2]=a.x;s[s.length-1]=a.y;}}function l(s){return{x:parseFloat(s[s.length-2]),y:parseFloat(s[s.length-1])};}if(S.length>1){var n=l(S[0]),u=null;if(S[S.length-1][0]=="Z"&&S[0].length>2){u=["L",n.x,n.y];S[S.length-1]=u;}R.push(S[0]);for(var v=1;v<S.length;v++){var w=R[R.length-1],x=S[v],N=x==u?S[1]:S[v+1],y=r;if(N&&w&&w.length>2&&x[0]=="L"&&N.length>2&&N[0]=="L"){var z=l(w),B=l(x),E=l(N),H,I,J=Math.abs(z.x-B.x)+Math.abs(z.y-B.y),K=Math.abs(E.x-B.x)+Math.abs(E.y-B.y),M=Math.max(Math.min(y,J,K/2),1);H=j(B,z,M);I=j(B,E,M);A(x,H);x.origPoint=B;R.push(x);var Q=k(H,B,0.5),T=k(B,I,0.5),V=["C",Q.x,Q.y,T.x,T.y,I.x,I.y];V.origPoint=B;R.push(V);}else{R.push(x);}}if(u){var W=l(R[R.length-1]);R.push(["Z"]);A(R[0],W);}}else{R=S;}b=R.reduce(function(s,c){return s+c.join(" ")+" ";},"");return b;},iRTLModeInIE:function(){return(e.browser.msie&&C.getConfiguration().getRTL())?true:false;},arrayMove:function(a,b,n){if(n>=a.length){var k=n-a.length+1;while(k--){a.push(undefined);}}a.splice(n,0,a.splice(b,1)[0]);return a;},getEdgePoint:function(a){var b=2;var c=["Arrow","None"];var v=this._getVisibleRelationships(a);v.forEach(function(x){if(x.getPredecessor()!==undefined&&x.getSuccessor()!==undefined&&(x.getShapeTypeStart()!=="None"||c.indexOf(x.getShapeTypeEnd())==-1)){b=3;}});return b;},getTimeLabel:function(E,a,l,s){var p=f.getEventSVGPoint(s,E),t=F.dateToAbapTimestamp(a.viewToTime(p.x)),b=F._convertUTCToLocalTime(t,l),z=a.getZoomStrategy();return z.getLowerRowFormatter().format(b);}};return G;},true);
