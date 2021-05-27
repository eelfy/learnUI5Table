/*!
 * SAPUI5

(c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(['sap/viz/ui5/data/DimensionDefinition','sap/viz/ui5/data/MeasureDefinition','sap/viz/ui5/controls/common/feeds/FeedItem','sap/viz/ui5/controls/common/feeds/AnalysisObject','sap/chart/TimeUnitType','sap/chart/utils/DateFormatUtil','sap/chart/utils/ChartUtils','sap/chart/utils/RoleMapper','sap/chart/ChartLog',"sap/ui/thirdparty/jquery"],function(D,M,F,A,T,a,C,R,b,q){"use strict";var s=function(){return sap.viz.vizservices.BVRService.suggestFeeds.apply(null,arguments);};var c=function(f,i){var r=sap.viz.vizservices.FeedService.validate(f,i);if(!r.valid){var k=r.results?r.results.bindings:null;if(k&&Object.keys(k).every(function(m){return k[m].allowMND&&(!k[m].missing||k[m].missing===1)&&!k[m].incorrect;})){return{valid:true};}}return r;};var _=[{"types":"*","toViz":{"category|category2":"categoryAxis","series":"color","axis1|axis2|axis3|axis4":"valueAxis"}},{"types":"column|bar|stacked_bar|stacked_column|line|combination|100_stacked_bar|100_stacked_column|stacked_combination|horizontal_stacked_combination","toViz":{}},{"types":"scatter|bubble|time_bubble|timeseries_scatter|timeseries_bubble","toViz":{"category|category2":"@context","axis1":"valueAxis","axis2":"valueAxis2"}},{"types":"bubble|time_bubble","toViz":{"axis3":"bubbleWidth"}},{"types":"pie|donut|100_donut","toViz":{"category|series|category2":"color","axis1|axis2|axis3|axis4":"size"}},{"types":"bullet|vertical_bullet","toViz":{"axis1|axis2|axis3|axis4":"@semanticBulletMsrs"}},{"types":"dual_combination|dual_horizontal_combination|dual_stacked_bar|100_dual_stacked_bar|dual_stacked_column|100_dual_stacked_column|dual_bar|dual_column|dual_line|dual_stacked_combination|dual_horizontal_stacked_combination","toViz":{"axis1":"valueAxis","axis2|axis3|axis4":"valueAxis2"}},{"types":"timeseries_line|timeseries_column|timeseries_combination|timeseries_stacked_column|timeseries_100_stacked_column","toViz":{"category":"timeAxis"}},{"types":"timeseries_scatter","toViz":{"category":R,"axis2|axis3":false}},{"types":"timeseries_bubble","toViz":{"category":R,"axis2":false,"axis3":"bubbleWidth"}},{"types":"dual_timeseries_combination","toViz":{"category":"timeAxis","axis1":"valueAxis","axis2|axis3|axis4":"valueAxis2"}},{"types":"heatmap","toViz":{"category":"categoryAxis","category2|series":"categoryAxis2","axis1|axis2|axis3|axis4":"color"}},{"types":"waterfall|horizontal_waterfall","toViz":{"series":"waterfallType"}},{"types":"timeseries_bullet","toViz":{"category|series":"timeAxis","axis1|axis2|axis3|axis4":"@semanticBulletMsrs"}},{"types":"timeseries_waterfall","toViz":{"category|series":"timeAxis"}}].reduce(function(m,f){var i=Object.keys(f.toViz).reduce(function(i,k){k.split("|").forEach(function(r){i[r]=f.toViz[k];return i;});return i;},{});f.types.split("|").forEach(function(k){if(!m.hasOwnProperty(k)){m[k]=[];}m[k].push(i);});return m;},{});var d=Object.keys(_).reduce(function(m,f){if(f!=="*"){m[f]=q.extend.apply(null,[true,{}].concat(_["*"].concat(_[f])));}return m;},{});function e(f,k,v){var i=(typeof k==="function")?k:function(o){return o[k];};return f.reduce(function(o,m){var n=i(m),r=(typeof v==="function")?v(m):m;if(n&&!o[n]){o[n]=[r];}else if(n){o[n].push(r);}return o;},{});}function g(m,f){var o={},r;f.forEach(function(v){var i=v._sFixedRole||v.getRole();if(m.hasOwnProperty(i)){var k=m[i];if(k){if(typeof k==="function"){if(!r){r=new k();}k=r.toFeedingId(v);}if(!o[k]){o[k]=[];}o[k].push(v);}}});return o;}var L={from:F.fromLightWeightFmt,build:function(o){var f=[];q.each(o.dims,function(k,v){f.push({id:k,type:"Dimension",values:v.map(h("Dimension"))});});q.each(o.msrs,function(k,v){f.push({id:k,type:"Measure",values:v.map(h("Measure"))});});return f;}};function h(f){return function(o){var i=o.getName();if(i==="MND"){return{id:"MND",type:"MND"};}var k={id:i,name:i,type:f};if(o instanceof sap.chart.data.TimeDimension){k.dataType="Date";}return k;};}function w(o,p){var n=o.getName(),f=o.getLabel(),i=o.getTextProperty(),k=o.getTextFormatter(),m=o.getDisplayText();var r={identity:n,name:f||n,value:"{"+n+"}"};if(typeof k==="function"){r.displayValue={formatter:k,parts:[{path:n,type:new sap.ui.model.type.String()}]};if(i){r.displayValue.parts.push({path:i,type:new sap.ui.model.type.String()});}}else if(m&&i){r.displayValue="{"+i+"}";}var v=new D(r);if(p&&o instanceof sap.chart.data.TimeDimension){var P=a.getInstance(o.getTimeUnit());if(P){var Q=P.parse.bind(P);v.getBindingInfo("value").formatter=function(V){return Q(V);};}v.setDataType("Date");v._setTimeUnit(o.getTimeUnit());}return v;}function j(m){var n=m.getName();var o=new M({identity:n,name:m.getLabel()||n,value:"{"+n+"}"});o._setUnitBinding(m.getUnitBinding());return o;}function l(f,i){var m=sap.viz.api.metadata.Viz.get("info/"+f),k=e(m.bindings,"role"),n=e(i,"id"),o=k["layout.category"]||[],S=k["mark.color"]||[];if(o.length===0){return[];}else{var r=[];q.each(o.concat(S),function(v,P){var Q=n[P.id];if(Q&&Q.length>0){q.each(Q[0].values,function(U,V){r.push(V.id);});}});return r;}}function p(f){return C.CONFIG.timeChartTypes.indexOf(f)>-1;}function t(f){return f&&f.indexOf('bullet')>-1;}function u(i){q.each(i,function(f,m){if(m&&(m.getSemantics&&m.getSemantics()!=='actual'||m.getSemanticallyRelatedMeasures&&!q.isEmptyObject(m.getSemanticallyRelatedMeasures()))){new b('error','Semantic Pattern'," Semantic pattern rule defined in invisible measures doesn't work.").display();}});}function x(f,i,m,k,n){var r=d[f];var o={dims:g(r,i),msrs:g(r,m)};if(t(f)){o.invisibleMsrs=n;}else{u(n);}var v=null,S=null;if(o.dims["@context"]){v=o.dims["@context"];delete o.dims["@context"];}var P=false;if(!k){if(R.semantics.hasSemanticMeasures(o)){var Q;if(C.CONFIG.nonSemanticPatternChartType.indexOf(f)===-1){Q=new b('error','Semantic Pattern',"Semantic pattern doesn't work when there is dataPointStyle or seriesStyle defined.");P=true;}else{Q=new b('error','Semantic Pattern',f+" doesn't support semantic pattern feature.");P=true;}Q.display();}}S=R.semantics.semanticPatternMsrs(o,f,P);v=(v||[]).concat(S.contexts);var U=L.build(o);U.contexts=v;U.semanticTuples=S.semanticTuples;return U;}var I=[{chartTypes:"bar,column,line,combination,heatmap,bullet,vertical_bullet,stacked_bar,stacked_column,stacked_combination,horizontal_stacked_combination,dual_bar,dual_column,dual_line,dual_stacked_bar,dual_stacked_column,dual_combination,dual_horizontal_combination,dual_stacked_combination,dual_horizontal_stacked_combination,100_stacked_bar,100_stacked_column,100_dual_stacked_bar,100_dual_stacked_column,waterfall,horizontal_waterfall".split(","),feed:"categoryAxis"},{chartTypes:"donut,100_donut,pie,scatter,bubble".split(","),feed:"color"}];function y(f,k,m){var i,n;for(i=0;i<I.length;i++){if(I[i].chartTypes.indexOf(f)!==-1){n=I[i].feed;break;}}var o=k.some(function(v){return v.id===n;});if(!o){var r=s("info/"+f,k,[{id:"MND",type:"MND"}]).feedItems;k.splice(0,k.length);r.forEach(function(v){if(v.values.length>0){k.push(v);}});k=J(f,k);}for(i=0;i<k.length;i++){if(k[i].id===n&&k[i].type==="Dimension"){k[i].values=k[i].values.concat(m.map(function(v){return{id:v.getName(),name:v.getName(),type:"Dimension",inResult:true};}));}}return c("info/"+f,k);}function z(f){f.forEach(function(o){o._sFixedRole=o.getRole();});}function B(f,i,k){i.forEach(function(o){o.values.forEach(function(m){var n=k.filter(function(n){return n.getName()===m.id;})[0];if(n){q.each(d[f],function(r,v){if(v===o.id){n._sFixedRole=r;return false;}});}});});}function E(f,i){var k=true;if(f.indexOf('timeseries_bullet')>-1){k=i.length>1&&i.every(function(m){return(m.actual&&m.reference)||(m.projected&&m.reference);});}else if(f.indexOf('timeseries_combination')>-1){k=i.length>0&&i.some(function(m){return(m.projected||m.reference);});}return k;}function G(k,m,n,r,P,Q,V){var S=m.concat(n).concat(r);z(S);var U=x(k,m,n,P,Q);k=k.indexOf('donut')>-1?'donut':k;var W=c("info/"+k,U);var X=U.contexts,Y=U.semanticTuples,Z=[];if(!W.valid){if(k.indexOf('dual_timeseries_combination')>-1){U.contexts=[];}U=K(k,W,U,m,n);W=c("info/"+k,U);B(k,U,S);if(P){if(E(k,Y)){U=x(k,m,n,P,Q);X=U.contexts;Y=U.semanticTuples;}}}else{B(k,U,S);}if(Y){Z=Y.filter(function(f){return f.projectedValueStartTime;});}if(W.valid&&r&&r.length>0){var $=e(m,function(o){return o.getName();});y(k,U,r.filter(function(o){return!$[o.getName()];}));}var a1=U.reduce(function(i,f){f.values.forEach(function(v){i[v.id]=true;});return i;},{});var b1=L.from(U);if(X){X.forEach(function(f){a1[f.getName()]=true;});b1._context=X.map(function(f){var o=f.getName();var v=true;for(var i=0;i<Z.length;i++){if(o===Z[i].actual||o===Z[i].projected){v=false;break;}}return{id:o,showInTooltip:v};});}b1._unused=N(U,m,n).filter(function(f){return!a1[f];});b1._def=O(m,W.valid?r:[],n,a1,Y,p(k));if(V){b1._def.dim.forEach(function(o){o.setBindingContext(null);});b1._def.msr.forEach(function(o){o.setBindingContext(null);});}b1._order=l(k,U);b1._valid=W.valid;b1._semanticTuples=Y;return b1;}function H(f){return e(sap.viz.api.metadata.Viz.get("info/"+f).bindings,"id");}function J(f,i,m){m=m||H(f);i.forEach(function(o){o.type=m[o.id][0].type;});return i;}function K(f,V,i,m,n){var o=H(f),r=false,P=false;var Q=V.results.bindings;Object.keys(Q).forEach(function(k){if(!o[k]){return;}if(o[k][0].type==="Measure"){P=true;}if(o[k][0].type==="Dimension"&&!(Q[k].allowMND&&(!Q[k].missing||Q[k].missing===1))){r=true;}});var S=i.filter(function(k){return!((k.type==="Dimension")?r:P);}),U=S.reduce(function(k,Z){(Z.values||[]).forEach(function(v){k[v.id]=true;});return k;},{});if(i.contexts){i.contexts.forEach(function(k){U[k.getName()]=true;});}var W=m.map(h("Dimension")),X=n.map(h("Measure"));var Y=s("info/"+f,S,W.concat(X).filter(function(k){return!U[k.id];})).feedItems;J(f,Y,o);return Y;}function N(i,k,m){var U=i.reduce(function(n,f){f.values.forEach(function(v){n[v.id]=true;});return n;},{});return k.concat(m).filter(function(n){return!U[n.getName()];}).map(function(n){return n.getName();});}function O(f,k,m,v,S,p){var o;if(p){var n;for(var i=0;i<f.length;i++){if(f[i]instanceof sap.chart.data.TimeDimension){n=f[i];break;}}o=a.getInstance(n.getTimeUnit());}return{dim:f.reduce(function(V,r){if(v[r.getName()]){V.push(w(r,p));}return V;},[]).concat(k.map(function(r){var P=w(r);P._setInResult(true);return P;})),msr:m.reduce(function(V,r){if(v[r.getName()]){V.push(j(r));}return V;},[]).concat((S||[]).reduce(function(r,P){if(P.timeAxis&&P.projectedValueStartTime){r.push(new M({identity:P.actual+"-"+P.projected,name:((P.labels&&P.labels.actual)||P.actual)+"-"+((P.labels&&P.labels.projected)||P.projected),value:{parts:[P.timeAxis,P.actual,P.projected],formatter:function(Q){var U=Q,V;if(Q&&Q.length>1){var W=Q[0];if(W){if(o){var X=o.parse(W);if(X){V=X.getTime();}}else{V=new Date(W).getTime();}if(V&&(V<P.projectedValueStartTime)){U=Q[1];}else{U=Q[2];}}}return U;}}}));}return r;},[]))};}return{fit:G,compatible:function(f,i,m){var n="info/"+f,r={used:{},error:null,compatible:true};var P=x(f,i,m),V=c(n,P);if(!V.valid){P=K(f,V,P,i,m);V=c(n,P);r.needFix=true;}if(V.valid){r.used=e(P,function(o){return o.type;},function(o){return o.values.filter(function(v){return v.type==="Dimension"||v.type==="Measure";}).map(function(v){return v.id;});});q.each(r.used,function(k,v){r.used[k]=v.reduce(function(o,W){return o.concat(W);},[]);});}else{r.compatible=false;var Q=sap.viz.api.metadata.Viz.get(n).bindings,S=e(Q,"type",function(o){return o.id;}),U={dim:0,msr:0,time:0};q.each(V.results.bindings,function(k,v){if(!v.missing){return;}if(S.Dimension.indexOf(k)!==-1&&!(v.allowMND&&v.missing===1)){U[k==="timeAxis"?"time":"dim"]+=v.missing;}else if(S.Measure.indexOf(k)!==-1){U.msr+=v.missing;}});r.error={missing:U};}return r;}};});
