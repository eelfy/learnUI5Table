/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery",'sap/ui/documentation/library',"sap/base/Log"],function(q,l,L){"use strict";var p;var C={loadData:function(){if(!p){p=new Promise(function(r,a){l._loadAllLibInfo("","_getDocuIndex",function(b,d){var D=C._getIndices(b,d,function(){r(D);});});});}return p;},_getIndices:function(a,d,c){var b=["Action","Application","Container","Display","Chart","Mini Chart","Layout","List","Floorplans & Patterns","Popup","Tile","User Input","Testing","Theming","Tutorial","Routing","Data Binding","Data Visualization","Map","Utility"];var e=["namespace","since","category"];var f={namespace:{},since:{},category:{},formFactors:{"Independent":true,"Condensed":true,"Compact":true,"Cozy":true}};var F={"-":"Independent","S":"Condensed","SM":"Condensed, Compact","SL":"Condensed, Cozy","SML":"Condensed, Compact, Cozy","M":"Compact","ML":"Compact, Cozy","L":"Cozy"};var g={};g={};g.entityCount=0;g.entities=[];g.filter={};g.samples={};q.each(d,function(i,D){if(!D.explored){return;}else if(!D.explored.samplesRef){L.error("explored: cannot register lib '"+D.library+"'. missing 'explored.samplesRef'");return;}else if(Array.isArray(D.explored.samplesRef)&&D.explored.samplesRef.length!==D.explored.samplesRef.filter(function(I){return I.namespace&&I.ref;}).length){L.error("explored: cannot register lib '"+D.library+"'. missing 'explored.samplesRef.namespace' or 'explored.samplesRef.ref' in one or more of the configured namespaces");return;}else if(!Array.isArray(D.explored.samplesRef)&&!D.explored.samplesRef.namespace){L.error("explored: cannot register lib '"+D.library+"'. missing 'explored.samplesRef.namespace'");return;}else if(!Array.isArray(D.explored.samplesRef)&&!D.explored.samplesRef.ref){L.error("explored: cannot register lib '"+D.library+"'. missing 'explored.samplesRef.ref'");return;}else if(!D.explored.entities){L.error("explored: cannot register lib '"+D.library+"'. missing 'explored.entities'");return;}else{L.info("explored: now reading lib '"+D.library+"'");}if(Array.isArray(D.explored.samplesRef)){D.explored.samplesRef.forEach(function(I){(function(){var j={};j[I.namespace.replace(/\./g,"/")]=""+I.ref||".";sap.ui.loader.config({paths:j});}());});}else{(function(){var j={};j[D.explored.samplesRef.namespace.replace(/\./g,"/")]=""+D.explored.samplesRef.ref||".";sap.ui.loader.config({paths:j});}());}q.each(D.explored.samples,function(i,s){if(!s.id){L.error("explored: cannot register sample '?'. missing 'id'");}else if(!s.name){L.error("explored: cannot register sample '"+s.id+"'. missing 'name'");}else{g.samples[s.id]=s;}});q.each(D.explored.entities,function(j,E){if(!E.id){L.error("explored: cannot register entity '?'. missing 'id'");return;}if(D.explored.entitiesDefaults){q.each(D.explored.entitiesDefaults,function(k,v){if(!E.hasOwnProperty(k)){E[k]=v;}});}var I=E.id.lastIndexOf(".");var n=(I!==-1)?E.id.substring(0,I):E.id;E.namespace=n;if(!E.name){L.error("explored: cannot register entity '"+E.id+"'. missing 'name'");return;}if(b.indexOf(E.category)===-1){L.error("explored: cannot register entity '"+E.id+"'. category '"+E.category+"' is not allowed");return;}if(!E.formFactors){L.error("explored: cannot register entity '"+E.id+"'. missing 'formFactors'");return;}if(!F[E.formFactors]){L.error("explored: cannot register entity '"+E.id+"'. formFactors '"+E.formFactors+"' is not allowed");return;}E.formFactors=F[E.formFactors];var A=false;q.each(e,function(i,s){if(!E[s]){L.error("explored: cannot register entity '"+E.id+"'. missing '"+s+"'");A=true;return false;}});if(A){return;}q.each(e,function(i,s){f[s][E[s]]=true;});E.library=D.library;g.entities.push(E);});});q.each(g.entities,function(n,E){var i=0,s,k;E.searchTags=E.name+" "+E.name.replace(/\s/g,"")+" "+E.category;if(E.samples){E.samples.forEach(function(j){var r=g.samples[j];if(r){E.searchTags+=" "+r.name;E.searchTags+=" "+r.description;}});}if(E.samples&&!(E.samples instanceof Array)){E.samples=[];L.error("explored: cannot register samples for entity '"+E.id+"'. 'samples' is not an array");return;}if(!E.samples){E.samples=[];}if(E.samplesAsSteps){if(!(E.samplesAsSteps instanceof Array)){L.error("explored: cannot register samples for entity '"+E.id+"'. 'samplesAsSteps' is not an array");return;}k=function(N){if(N.toString().length===1){return"0"+N;}return N;};for(;i<E.samplesAsSteps.length;i++){s={"id":E.id+"."+k(i+1),"name":E.name+" - Step "+(i+1)+" - "+E.samplesAsSteps[i]};if(i>0){s.previousSampleId=E.id+"."+k(i);}if(i<E.samplesAsSteps.length-1){s.nextSampleId=E.id+"."+k(i+2);}s.entityId=E.id;E.samples.push(s);g.samples[s.id]=s;E.searchTags+=" "+s.name;}}else{var S=[],m;q.each(E.samples,function(j,I){var r=g.samples[I];if(!r){L.warning("explored: cannot register sample '"+I+"' for '"+E.id+"'. not found in the available docu indizes");}else{r.entityId=E.id;if(!r.contexts){r.contexts={};}if(!r.contexts[r.entityId]){r.contexts[r.entityId]={};}r.contexts[r.entityId].previousSampleId=(m?m.id:undefined);if(m){m.contexts[r.entityId].nextSampleId=r.id;}m=r;S.push(r);E.searchTags+=" "+r.name;}});E.samples=S;}E.sampleCount=E.samples.length;});g.entityCount=g.entities.length;q.each(f,function(s,j){g.filter[s]=[];q.each(j,function(k,v){g.filter[s].push({id:k});});});var o=l._getLibraryInfoSingleton();var h={};var P=[];for(var i=0;i<a.length;i++){P.push(new Promise(function(r){var j=function(k){h[k.library]=k.componentInfo;r();};o._getLibraryInfo(a[i],j);}));}Promise.all(P).then(function(){c&&c();});g.libComponentInfos=h;g.groups=this.getGroups(g.entities);return g;},findGroup:function(g,n){var a;for(var i=0;i<g.length;i++){a=g[i];if(a.name==n){return a;}}},getGroups:function(e){var g=[],a,b,s,c,i,j;for(i=0;i<e.length;i++){a=e[i];a.key='#/entity/'+a.id;s=a.samples;for(j=0;j<s.length;j++){c=s[j];c.key='#/sample/'+c.id+"/preview";}b=this.findGroup(g,a.category);if(!b){b={name:a.category,key:'#/group/'+a.category,controls:[a]};g.push(b);}else{b.controls.push(a);}}return g;}};return C;},true);
