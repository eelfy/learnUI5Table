/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["../NodeContentType","../TransformationMatrix","sap/base/util/uid"],function(N,T,u){"use strict";var P=function(){this._currentSceneId=null;};P.prototype.createPOI=function(c,p,v,a,b,n){v=v._implementation||v;b=b||{x:1,y:1};n=n||{};n.sid=n.sid||u();if(!n.transform){var d=v.getDomRef().getBoundingClientRect();var s=a.x-d.left;var e=a.y-d.top;var f=this.getBackgroundImageType(v);var g=v.hitTest(s,e).point;var h=f==="2DImage"?0.3:1.0;var i=f==="2DImage"?0.99:0.5;n.transform=[Number(b.x)*h,0,0,0,Number(b.y)*h,0,0,0,h,g.x*i,g.y*i,g.z*i];}else if(n.transform.length===16){n.transform=T.convertTo4x3(n.transform);}n.transformType=n.transformType||"BILLBOARD_VIEW";if(this._currentSceneId){c.getSceneBuilder()._resetCurrentScene(this._currentSceneId);}var l=v._cdsLoader;if(l){var j=l.getSkipLowLODRendering();l.setSkipLowLODRendering(false);var k=c.getDefaultNodeHierarchy();var m=k.createNode(null,"Sample POI",null,N.Symbol,n);var o=v.getCurrentView()||c.getViews()[0];o.updateNodeInfos([{target:m,visible:true}]);return l.loadTransientScene(p,m).then(function(t){l.setSkipLowLODRendering(j);v.setShouldRenderFrame();var q=t.nodeRef;q.traverse(function(w){w.userData.skipIt=true;});this._currentSceneId=q.userData.currentSceneId;Object.assign(q.userData.treeNode,n);var r={transform:T.convertTo4x4(n.transform),veid:n.sid,entityId:q.userData.entityId,name:n.name||"Sample POI",transformType:"view",contentType:"symbol"};return r;}.bind(this));}};P.prototype.removePOI=function(c,n){var a=c.getDefaultNodeHierarchy();var v=c.getViewStateManager();v.setVisibilityState(n,false,true);a.removeNode(n);};P.prototype.getPOIList=function(v){var a=v.getViewStateManager();return a?a.getSymbolNodes():[];};P.prototype.getBackgroundImageType=function(v){return v._viewStateManager.getBackgroundImageType();};P.prototype.getPoiRect=function(v,n){var c=v._getNativeCamera();var b=new THREE.Box3();b.setFromObject(n);var a=[new THREE.Vector3(b.min.x,b.min.y,b.min.z),new THREE.Vector3(b.max.x,b.max.y,b.max.z),new THREE.Vector3(b.min.x,b.min.y,b.max.z),new THREE.Vector3(b.min.x,b.max.y,b.max.z),new THREE.Vector3(b.max.x,b.min.y,b.max.z),new THREE.Vector3(b.max.x,b.max.y,b.min.z),new THREE.Vector3(b.min.x,b.max.y,b.min.z),new THREE.Vector3(b.max.x,b.min.y,b.min.z)];var f=new THREE.Frustum();f.setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(c.projectionMatrix,c.matrixWorldInverse));if(!f.intersectsBox(b)){return false;}var m=new THREE.Vector3(1,1,1);var d=new THREE.Vector3(-1,-1,-1);var e=new THREE.Vector3();for(var i=0;i<a.length;++i){if(!f.containsPoint(a[i])){return false;}var g=e.copy(a[i]);var h=g.project(c);m.min(h);d.max(h);}var j=new THREE.Box2(m,d);var k=v.getDomRef().getBoundingClientRect();var l=new THREE.Vector2(k.width/2,k.height/2);var o=j.min.clone().multiply(l);var p=j.max.clone().multiply(l);var w=p.x-o.x;var q=p.y-o.y;return{width:w,height:q};};P.prototype.adjustPoi=function(v,p){var b=this.getBackgroundImageType(v);var s=b==="2DImage"?0.3:1.0;if(b!=="2DImage"){var c=p.getWorldPosition(new THREE.Vector3());var r=c.length()/500;if(p.position&&p.baseScale){p.position.multiplyScalar(1/r);p.baseScale.multiplyScalar(1/r);p.updateMatrix();p.updateMatrixWorld();}}p.userData.transform=[s,0,0,0,s,0,0,0,s,p.position.x,p.position.y,p.position.z];};P.prototype.updateNodeId=function(c,n,a){var v=c.getViewStateManager();var p=v?v.getSymbolNodes(n)[0]:null;if(p){p.userData.nodeId=a;p.userData.treeNode.sid=a;c.setNodePersistentId(p,a);}return p;};P.prototype.updatePOI=function(v,n,p,a,b){var c=v.getScene();var s=v._viewStateManager.getSymbolNodes(n)[0];b=b||{};var l=v._cdsLoader;if(s&&l){s.name=b.name||s.name;if(a){s.baseScale.set(a.x,a.y);}var d=l.getSkipLowLODRendering();l.setSkipLowLODRendering(false);if(b.transform){if(b.transform.length===16){b.transform=T.convertTo4x3(b.transform);}s.position.set(b.transform[9],b.transform[10],b.transform[11]);}if(p){var e=v._viewStateManager.getNodeHierarchy();s.children.forEach(function(f){e.removeNode(f);});return l.loadTransientScene(p,s).then(function(t){l.setSkipLowLODRendering(d);var f=t.nodeRef;f.traverse(function(g){g.userData.skipIt=true;});c.getSceneBuilder()._resetCurrentScene(f.userData.currentSceneId);f.userData.treeNode.sid=s.userData.treeNode.sid;v.setShouldRenderFrame();return{target:f,entityId:f.userData.entityId};});}else{v.setShouldRenderFrame();var f=s.children[0];return Promise.resolve({target:f,entityId:s.userData.treeNode.entityId||f.userData.entityId});}}};return P;});
