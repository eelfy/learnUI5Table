/*
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([],function(){"use strict";var S={sortByIndex:function(a){var f,r,I,F;if(!a||!a.length){return a;}r=[];f=[];for(var i=0;i<a.length;i++){F=a[i];I=F.index;if(I>=0){f.push(F);}else{r.push(F);}}if(f.length){f=f.sort(function(b,c){return b.index-c.index;});if(!r.length){r=f;}else{for(var j=0;j<f.length;j++){F=f[j];if(F.index>=r.length){r.push(F);}else{r.splice(F.index,0,F);}}}}return r;},groupSorting:function(a){var r=[];r=this.sortByIndex(a);for(var i=0;i<r.length;i++){if(r[i].fields){r[i].fields=this.sortByIndex(r[i].fields);}}return r;},destroy:function(){}};return S;},true);
