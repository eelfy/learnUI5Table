/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["../NodeContentType","./Element"],function(N,E){"use strict";var H=function(){};H.prototype.createHotspot=function(s,p,j,n,a){var h=s.getDefaultNodeHierarchy().createNode(p,n,null,N.Hotspot,a);this.updateHotspot(h,j);h.parent.rerender();return h;};H.prototype.removeHotspot=function(s,h){s.getDefaultNodeHierarchy().removeNode(h);};H.prototype.updateHotspot=function(h,j,f){while(h.children.length>0){h.remove(h.children[h.children.length-1]);}if(j){h.userData.jointNodes=Array.from(j);}j=h.userData.jointNodes;if(j){var a=E._invertMatrix(h._matrixWorld());j.forEach(function(b){var c=b.clone();c.matrix=E._multiplyMatrices(a,b._matrixWorld());h.add(c);});}h._initAsHotspot(f);};return H;});
