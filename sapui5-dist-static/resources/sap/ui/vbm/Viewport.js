/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */
sap.ui.define(["sap/ui/core/Control","sap/ui/core/ResizeHandler","./adapter3d/thirdparty/three","./adapter3d/thirdparty/OrbitControls","./adapter3d/Utilities","./ViewportRenderer","sap/base/Log","./library"],function(C,R,T,O,U,V,L,l){"use strict";var t="sap.ui.vbm.Viewport";var a=C.extend("sap.ui.vbm.Viewport",{metadata:{library:"sap.ui.vbm",properties:{width:{type:"sap.ui.core.CSSSize",defaultValue:"100%"},height:{type:"sap.ui.core.CSSSize",defaultValue:"100%"},cameraHistoryLength:{type:"int",defaultValue:0},cameraHistoryPos:{type:"int"}},events:{cameraChange:{parameters:{historyPos:{type:"int"},historyLength:{type:"int"}}}}}});var E=0.000001;var F=0.6;var M=50000.0;var b=85.0;var c=a.getMetadata().getParent().getClass().prototype;a.prototype.init=function(){if(c.init){c.init.call(this);}this._resizeListenerId=null;this._renderLoopRequestId=0;this._renderLoopFunction=this._renderLoop.bind(this);this._renderer=new T.WebGLRenderer({antialias:true});this._renderer.setPixelRatio(window.devicePixelRatio);this._renderer.shadowMap.enabled=true;this._renderer.domElement.tabIndex=-1;this._renderer.domElement.setAttribute("role",sap.ui.core.AccessibleRole.Img);this._renderer.domElement.id=this.getId()+"-canvas";this._scene=new T.Scene();this._root=new T.Group();this._root.scale.set(-1,1,1);this._root.rotateX(T.Math.degToRad(90));this._root.matrixAutoUpdate=false;this._root.updateMatrix();this._scene.add(this._root);this._mapPlane=new T.Mesh(new T.PlaneGeometry(M,M,1,1),new T.MeshBasicMaterial({color:0x207bad,side:T.DoubleSide}));this._mapPlane.name="MapPlane";this._mapPlane.layers.set(2);this._mapPlane.visible=false;this._mapPlane.matrixAutoUpdate=false;this._mapPlane.updateMatrix();this._root.add(this._mapPlane);this._scene.background=new T.Color('white');this._scene.add(new T.AmbientLight(0x202020,1));var h=new T.DirectionalLight(0x333333,1);h.position.set(0,0,-1);h.matrixAutoUpdate=false;h.updateMatrix();this._scene.add(h);var i=new T.DirectionalLight(0x51515b,1);i.position.set(-2,-1.1,2.5);i.matrixAutoUpdate=false;i.updateMatrix();this._scene.add(i);var j=new T.DirectionalLight(0x5b5b5b,2);j.position.set(2,1.5,0.5);j.matrixAutoUpdate=false;j.updateMatrix();this._scene.add(j);this._light=new T.DirectionalLight(0xEEEEEE,1);this._lightPos=new T.Vector3(0,0,0);this._scene.add(this._light);this._camera=new T.PerspectiveCamera(30,window.innerWidth/window.innerHeight,0.1,2000);this._camera.layers.enable(0);this._camera.layers.enable(1);this._scene.add(this._camera);this._camera.position.set(0,30,30);this._camera.lookAt(new T.Vector3(0,0,0));this._cameraHome=undefined;this._flyToRequestId=undefined;this._resetTimerId=undefined;this._cameraHistory=[];this._cameraChangeEvent={};this._bbox=new T.Box3();this._cameraController=new O(this._camera,this._renderer.domElement);this._cameraController.addEventListener("end",this._cameraEnd.bind(this));this._cameraController.addEventListener("change",this._cameraUpdate.bind(this));this._cameraController.update();};a.prototype.exit=function(){if(this._resizeListenerId){R.deregister(this._resizeListenerId);this._resizeListenerId=null;}this._stopRenderLoop();this._scene=null;this._camera=null;this._renderer=null;if(c.exit){c.exit.call(this);}};a.prototype.getRoot=function(){return this._root;};a.prototype.getScene=function(){return this._scene;};a.prototype.getCamera=function(){return this._camera;};a.prototype.getCameraHistoryLength=function(){return this._cameraHistory.length;};a.prototype.setCameraHistoryLength=function(){L.error("cameraHistoryLength is read only property","",t);return this;};a.prototype.setCameraHistoryPos=function(p){if(this._cameraHistory.length>0&&p>=0&&p<this._cameraHistory.length){if(p!==this.getCameraHistoryPos()){this.setProperty("cameraHistoryPos",p,true);delete this._cameraHistory[p].tag;this._fireCameraChange();this._flyTo(this._cameraController.saveState(),this._cameraHistory[p],F);}}return this;};a.prototype.applyCameraHome=function(h){if(this._cameraHome){this._applyCamera(this._cameraHome,h);}};a.prototype.worldToScreen=function(p){var h=this.getDomRef();if(!h){return undefined;}var i=h.getBoundingClientRect();var j=this.getCamera();var m=new T.Matrix4().multiplyMatrices(j.projectionMatrix,new T.Matrix4().getInverse(j.matrixWorld));var s=p.clone().applyMatrix4(m);var x=Math.floor((+s.x*0.5+0.5)*i.width+0.5);var y=Math.floor((-s.y*0.5+0.5)*i.height+0.5);return new T.Vector2(x,y);};a.prototype.onBeforeRendering=function(){if(this._resizeListenerId){R.deregister(this._resizeListenerId);this._resizeListenerId=null;}this._stopRenderLoop();};a.prototype.onAfterRendering=function(){var h=this.getDomRef();h.appendChild(this._renderer.domElement);this._resizeListenerId=R.register(this,this._handleResize.bind(this));this._handleResize({size:{width:h.clientWidth,height:h.clientHeight}});this._startRenderLoop();};a.prototype._handleResize=function(h){if(!this._camera||!this._renderer){return false;}var w=h.size.width;var i=h.size.height;if(this._camera){this._camera.aspect=w/i;this._camera.updateProjectionMatrix();}this._renderer.setSize(w,i,false);};a.prototype._startRenderLoop=function(){if(!this._renderLoopRequestId){this._renderLoopRequestId=window.requestAnimationFrame(this._renderLoopFunction);}return this;};a.prototype._stopRenderLoop=function(){if(this._renderLoopRequestId){window.cancelAnimationFrame(this._renderLoopRequestId);this._renderLoopRequestId=0;}return this;};a.prototype._renderLoop=function(){this._cameraController.update();this._camera.getWorldDirection(this._lightPos);this._lightPos.negate();this._light.position.copy(this._lightPos);this._renderer.render(this._scene,this._camera);this._renderLoopRequestId=window.requestAnimationFrame(this._renderLoopFunction);};function e(h,s,i,j){return s+i*((h=h/j-1)*h*h+1);}function f(h){var i=Math.min((Date.now()-h.when)/1000,h.length);var j=h.tempTarget;j.x=e(i,h.from.target.x,h.to.target.x-h.from.target.x,h.length);j.y=e(i,h.from.target.y,h.to.target.y-h.from.target.y,h.length);j.z=e(i,h.from.target.z,h.to.target.z-h.from.target.z,h.length);var k=e(i,h.distanceFrom,h.distanceTo-h.distanceFrom,h.length);var m=e(i,0,h.angle,h.length);var p=h.tempPos.copy(h.dir).applyAxisAngle(h.axis,m).multiplyScalar(k).add(j);this._cameraController.reset({position:p,target:j,zoom:1.0});if(i<h.length){this._flyToRequestId=window.requestAnimationFrame(f.bind(this,h));}else{this._flyToRequestId=undefined;}}a.prototype._flyTo=function(h,i,j){var k=i.position.clone().sub(i.target);var m=h.position.clone().sub(h.target);var n=k.length();var o=m.length();var p=Math.acos(U.clamp(m.dot(k)/(n*o),-1,1));var q={to:i,from:h,when:Date.now(),length:j,angle:p,axis:m.clone().cross(k).normalize(),distanceTo:n,distanceFrom:o,dir:m.normalize(),tempPos:new T.Vector3(),tempTarget:new T.Vector3()};if(this._flyToRequestId){window.cancelAnimationFrame(this._flyToRequestId);}this._flyToRequestId=window.requestAnimationFrame(f.bind(this,q));};a.prototype._cameraEnd=function(h){var s=this._cameraController.saveState();var p=this.getCameraHistoryPos();var i=p>=0?this._cameraHistory[p]:undefined;if(i==undefined||s.target.distanceToSquared(i.target)>E||s.position.distanceToSquared(i.position)>E){this._pushCameraChange(s);}};function r(){if(this._cameraHistory.length>0){delete this._cameraHistory[this._cameraHistory.length-1].tag;}this._resetTimerId=undefined;}a.prototype._cameraUpdate=function(h){if(h.tag){if(this._resetTimerId){window.clearTimeout(this._resetTimerId);}this._resetTimerId=window.setTimeout(r.bind(this),500);var s=this._cameraController.saveState();var p=this.getCameraHistoryPos();s.tag=h.tag;var i=p>=0?this._cameraHistory[p]:{};if(s.tag&&s.tag===i.tag){this._cameraHistory[p]=s;}else{this._pushCameraChange(s);}}this._updateCamera();this._updateController();};a.prototype._fireCameraChange=function(){this._cameraChangeEvent.historyPos=this.getCameraHistoryPos();this._cameraChangeEvent.historyLength=this._cameraHistory.length;this.fireCameraChange(this._cameraChangeEvent);};a.prototype._pushCameraChange=function(s){var p=this.getCameraHistoryPos();this._cameraHistory.splice(p>=0?p+1:0,this._cameraHistory.length);this._cameraHistory.push(s);this.setProperty("cameraHistoryPos",this._cameraHistory.length-1,true);this._fireCameraChange();};a.prototype._setCameraHome=function(s){this._cameraHome=s;};a.prototype._applyCamera=function(s,h){var i=this._cameraController.saveState();if(s.target.distanceToSquared(i.target)>E||s.position.distanceToSquared(i.position)>E){this._pushCameraChange(s);if(h){this._flyTo(this._cameraController.saveState(),s,F);}else{this._cameraController.reset(s);}}};a.prototype._getCameraState=function(){return this._cameraController.saveState();};a.prototype._intersectMapPlane=function(h){h.layers.set(2);var o=h.intersectObjects([this._mapPlane],false);return o;};var _=new T.Box3(),d=new T.Matrix4();function g(o,h){var i,j=o.geometry;o.updateWorldMatrix(false,false);if(o.visible&&j){if(!j.boundingBox){j.computeBoundingBox();}if(o.isInstancedMesh){for(i=0;i<o.count;++i){o.getMatrixAt(i,d);_.copy(j.boundingBox);_.applyMatrix4(d);h.union(_);}}else{_.copy(j.boundingBox);_.applyMatrix4(o.matrixWorld);h.union(_);}}var k=o.children;for(i=0;i<k.length;++i){g(k[i],h);}}a.prototype._resetBBox=function(){this._bbox.makeEmpty();};a.prototype._getBBox=function(){if(this._bbox.isEmpty()){g(this.getScene(),this._bbox);}return this._bbox;};a.prototype._updateCamera=function(){var h=this._getBBox();if(!h.isEmpty()){var s=new T.Sphere();h.getBoundingSphere(s);if(s.radius===0){s.radius=1;}this._camera.updateMatrixWorld(false);s.center.applyMatrix4(this._camera.matrixWorldInverse);var n=U.clamp(-s.center.z-s.radius,s.radius*0.001,-s.center.z-s.radius);var i=n+s.radius*2,j=false;if(Math.abs(this._camera.near-n)>=this._camera.near*0.03){this._camera.near=n;j=true;}if(Math.abs(this._camera.far-i)>=this._camera.far*0.03){this._camera.far=i;j=true;}if(j){this._camera.updateProjectionMatrix();}}};a.prototype._updateController=function(){var h=this._cameraController.target.clone().sub(this._camera.position).normalize();var n=new T.Vector3(0,this._camera.position.y>0?1:-1,0);var p=new T.Plane(n),i=new T.Vector3();var j=new T.Ray(this._camera.position,h);if(j.intersectPlane(p,i)){if(T.Math.radToDeg(this._camera.position.clone().sub(i).angleTo(n))<b){this._cameraController.target.copy(i);}}};return a;});
