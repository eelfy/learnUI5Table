/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["../Core","./ViewportRenderer","../ViewportBase","sap/ui/core/ResizeHandler","sap/ui/events/KeyCodes","../Loco","../ViewStateManager","./ViewStateManager","../ViewportHandler","../VisibilityMode","../ZoomTo","../SelectionMode","../NodeContentType","../getResourceBundle","../Messages","./Scene","./OrthographicCamera","./Element","./Rectangle","./HotspotHelper","../colorToCSSColor","../cssColorToColor","../colorToABGR","../abgrToColor","sap/base/Log"],function(v,V,c,R,K,L,d,e,g,h,Z,S,N,j,M,k,O,E,l,H,m,n,o,p,q){"use strict";var r=c.extend("sap.ui.vk.svg.Viewport",{metadata:{library:"sap.ui.vk",events:{cameraChanged:{parameters:{offset:"float[]",zoom:"float"},enableEventBubbling:true},hotspotEnter:{parameters:{nodeRef:"any"},enableEventBubbling:true},hotspotLeave:{parameters:{nodeRef:"any"},enableEventBubbling:true}}}});var s=r.getMetadata().getParent().getClass().prototype;r.prototype.init=function(){if(s.init){s.init.call(this);}this._resizeListenerId=null;this._animLoopRequestId=0;this._animLoopFunction=this._animLoop.bind(this);this._width=this._height=0;this._camera=new O();this._gestureX=0;this._gestureY=0;this._scene=null;this._selectionRect=new l({material:{lineColor:[0.75,0.75,0,1],lineStyle:{dashPattern:[2,2]}}});this._viewportHandler=new g(this);this._loco=new L(this);this._loco.addHandler(this._viewportHandler,-1);this._hotspotHelper=new H();this._currentViewIndex=0;this._currentView=null;v.getEventBus().subscribe("sap.ui.vk","viewStateApplied",this._onViewStateApplied,this);};r.prototype.exit=function(){v.getEventBus().unsubscribe("sap.ui.vk","viewStateApplied",this._onViewStateApplied,this);this._loco.removeHandler(this._viewportHandler);this._viewportHandler.destroy();if(this._resizeListenerId){R.deregister(this._resizeListenerId);this._resizeListenerId=null;}this.setScene(null);this._renderer=null;this._loco=null;this._viewportHandler=null;if(s.exit){s.exit.call(this);}};r.prototype.onBeforeRendering=function(){if(this._resizeListenerId){R.deregister(this._resizeListenerId);this._resizeListenerId=null;}};r.prototype.onAfterRendering=function(){this._resizeListenerId=R.register(this,this._handleResize.bind(this));var a=this.getDomRef();if(this._scene){var b=this._scene.getRootElement();b._setDomRef(document.getElementById(b.uid));this._hotspotEffect=b.domRef?b.domRef.parentNode.getElementById("hotspot-effect"):null;}else{this._hotspotEffect=null;}this._handleResize({size:{width:a.clientWidth,height:a.clientHeight}});};r.prototype._handleResize=function(a){var b=this._width;var f=this._height;this._width=a.size.width;this._height=a.size.height;if(b===0||f===0){this.zoomTo(Z.All,null,0,0);}else{this._camera.update(this._width,this._height,b,f);this._updateViewBox();this.fireCameraChanged({viewBox:this._getViewBox()});}this.fireResize({size:{width:this._width,height:this._height}});return true;};r.prototype.setScene=function(a){this._scene=a;this._currentViewIndex=0;this._currentView=null;if(a){var i=a.getInitialView();if(i){this.activateView(i);}this._onContentLoadingFinished();}return this;};r.prototype.getScene=function(){return this._scene;};r.prototype.onSetViewStateManager=function(a){this._viewStateManager=a;a.attachOutliningChanged(this._onOutliningOrSelectionChanged,this);a.attachSelectionChanged(this._onOutliningOrSelectionChanged,this);};r.prototype.onRemoveViewStateManager=function(a){a.detachOutliningChanged(this._onOutliningOrSelectionChanged,this);a.detachSelectionChanged(this._onOutliningOrSelectionChanged,this);this._viewStateManager=null;};r.prototype._getViewStateManagerSVG=function(){if(this._viewStateManager){if(this._viewStateManager instanceof e){return this._viewStateManager;}if(this._viewStateManager instanceof d&&this._viewStateManager._implementation instanceof e){return this._viewStateManager._implementation;}}return null;};r.prototype.hitTest=function(x,y){var a=this._getViewStateManagerSVG();if(!a||!this._scene){return null;}var b=this._scene.getRootElement();var f=this.getDomRef().getBoundingClientRect();var i=document.elementFromPoint(x+f.x,y+f.y);var z=i!==null&&i.id?b.getElementById(i.id):null;return z?z._getSceneTreeElement():null;};r.prototype.tap=function(x,y,i){var a=this.hitTest(x,y);if(!i){this.tapObject(a);if(a!==null){this.fireNodeClicked({nodeRef:a,x:x,y:y},true,true);}}else if(!this.getFreezeCamera()){if(a&&this._camera.zoomedObject!==a){this._camera.zoomedObject=a;this.zoomTo(Z.Node,this._camera.zoomedObject,0.5,0.1);}else{this._camera.zoomedObject=null;this.zoomTo(Z.Visible,null,0.5,0);}}return this;};r.prototype.tapObject=function(a){var b={picked:a?[a]:[]};this.fireNodesPicked(b);if(this.getSelectionMode()===S.Exclusive){this.exclusiveSelectionHandler(b.picked);}else if(this.getSelectionMode()===S.Sticky){this.stickySelectionHandler(b.picked);}return this;};var t={x:-2,y:-2};var u=2;var w=5;r.prototype.onkeydown=function(a){if(!a.isMarked()){switch(a.keyCode){case K.ARROW_LEFT:case K.ARROW_RIGHT:case K.ARROW_UP:case K.ARROW_DOWN:if(a.ctrlKey||a.altKey||a.metaKey){break;}var b={x:0,y:0};switch(a.keyCode){case K.ARROW_LEFT:b.x=-1;break;case K.ARROW_RIGHT:b.x=+1;break;case K.ARROW_UP:b.y=-1;break;case K.ARROW_DOWN:b.y=+1;break;default:break;}this.beginGesture(t.x,t.y);if(a.shiftKey){this.pan(w*b.x,w*b.y);}else{this.rotate(u*b.x,u*b.y,true);}this.endGesture();a.preventDefault();a.stopPropagation();break;case 189:case K.PLUS:case K.NUMPAD_MINUS:case K.NUMPAD_PLUS:this.beginGesture(this._width*0.5,this._height*0.5);this.zoom(a.keyCode===K.PLUS||a.keyCode===K.NUMPAD_PLUS?1.02:0.98);this.endGesture();a.preventDefault();a.stopPropagation();break;default:break;}}};r.prototype._onOutliningOrSelectionChanged=function(a){var b=this.getTools();for(var i=0;i<b.length;i++){var f=sap.ui.getCore().byId(b[i]);var x=f.getGizmoForContainer(this);if(x&&x.handleSelectionChanged){x.handleSelectionChanged(a);}}};r.prototype.setSelectionRect=function(a){var b=document.getElementById(this._selectionRect.uid);if(b){if(a){b.removeAttribute("display");a=this._camera._transformRect(a);b.setAttribute("x",a.x1,a.x2);b.setAttribute("y",a.y1,a.y2);b.setAttribute("width",a.x2-a.x1);b.setAttribute("height",a.y2-a.y1);}else{b.setAttribute("display","none");}}};r.prototype._select=function(a){var b=this._getViewStateManagerSVG();if(b&&this._scene){a=this._camera._transformRect(a);var f=new Set();this._scene.getRootElement()._findRectElementsRecursive(f,a,b._mask);b.setSelectionStates(Array.from(f),[]);return Array.from(f);}return[];};r.prototype.getImage=function(a,b,f,i,x){return null;};r.prototype._setContent=function(a){this.setScene(a instanceof k?a:null);var b=new O();b.reset(a&&a.camera,this._width,this._height);this.setCamera(b);if(this.getScene()){var i=this.getScene().getInitialView();if(i&&this._getViewStateManagerSVG()){this.activateView(i,false,true);}}return this;};r.prototype.onSetContentConnector=function(a){c.prototype.onSetContentConnector.call(this,a);a.attachContentLoadingFinished(this._onContentLoadingFinished,this);};r.prototype.onUnsetContentConnector=function(a){a.detachContentLoadingFinished(this._onContentLoadingFinished,this);c.prototype.onUnsetContentConnector.call(this,a);};r.prototype._onContentLoadingFinished=function(a){if(this._scene){var b=this._scene.getDefaultNodeHierarchy();if(b){var f=this.getShowAllHotspots()?1:0;var i=b.getHotspotNodeIds();i.forEach(function(x){this._hotspotHelper.updateHotspot(x,undefined,f);},this);}this.zoomTo(Z.All,null,0,0);this.invalidate();}};function A(a,b,f){return a+(b-a)*f;}function B(a,b,x){x=Math.min(Math.max((x-a)/(b-a),0.0),1.0);return x*x*x*(x*(x*6-15)+10);}r.prototype._animLoop=function(){this._animLoopRequestId=0;var a=this._anim;if(a){var b=a.start;var i=a.end;var x=Date.now();var f=Math.min(B(0,1,(x-b.time)/a.duration),1);this._camera.offsetX=A(b.offsetX,i.offsetX,f);this._camera.offsetY=A(b.offsetY,i.offsetY,f);this._camera.zoom=A(b.zoom,i.zoom,f);this.fireCameraChanged({viewBox:this._getViewBox()});if(this._updateViewBox()&&(x-b.time)<a.duration){this._animLoopRequestId=window.requestAnimationFrame(this._animLoopFunction);}else{delete this._anim;}}};r.prototype.getCurrentView=function(){return this._currentView;};r.prototype._onViewStateApplied=function(a,b,f){if(f.source===this._getViewStateManagerSVG()){this.activateView(f.view);}};r.prototype.activateView=function(a){if(!this._scene){return this;}var b=this._scene.getViewGroups();var f=this;if(b){b.forEach(function(x){x.getViews().forEach(function(y){if(y===a){f._currentViewIndex=x.getViews().indexOf(y);}});});}this.fireViewActivated({viewIndex:this._currentViewIndex,view:a});v.getEventBus().publish("sap.ui.vk","viewActivated",{source:this,view:a,viewIndex:this._currentViewIndex});v.getEventBus().publish("sap.ui.vk","readyForAnimation",{source:this._getViewStateManagerSVG(),view:a,ignoreAnimationPosition:false});this._currentView=a;var i=a.getCamera();if(i){this.setCamera(i);}if(a.topColor!==undefined){this.setBackgroundColorTop(m({red:a.topColor[0]*255,green:a.topColor[1]*255,blue:a.topColor[2]*255,alpha:a.topColor[3]}));}if(a.bottomColor!==undefined){this.setBackgroundColorBottom(m({red:a.bottomColor[0]*255,green:a.bottomColor[1]*255,blue:a.bottomColor[2]*255,alpha:a.bottomColor[3]}));}this.rerender();this.fireViewFinished({viewIndex:this._currentViewIndex});return this;};r.prototype.resetCurrentView=function(){if(this._currentView){this._getViewStateManagerSVG()._resetNodesStatusByCurrenView(this._currentView);this.rerender();}return this;};r.prototype.zoomTo=function(a,b,f,i){if(this._width===0||this._height===0||this._scene==null){return this;}var x={min:{x:Infinity,y:Infinity},max:{x:-Infinity,y:-Infinity}};var y=this._getViewStateManagerSVG();(Array.isArray(a)?a:[a]).forEach(function(a){switch(a){case Z.All:this._scene.getRootElement()._expandBoundingBoxRecursive(x,-1>>>0);break;case Z.Visible:if(y){this._scene.getRootElement()._expandBoundingBoxRecursive(x,y._mask);}break;case Z.Selected:if(y){y.enumerateSelection(function(b){b._expandBoundingBoxRecursive(x,-1>>>0);});}break;case Z.Node:if(!b){return this;}if(Array.isArray(b)){b.forEach(function(b){b._expandBoundingBoxRecursive(x,-1>>>0);});}else{b._expandBoundingBoxRecursive(x,-1>>>0);}break;case Z.Restore:q.error(j().getText("VIEWPORT_MSG_RESTORENOTIMPLEMENTED"));return this;case Z.NodeSetIsolation:q.error(j().getText("VIEWPORT_MSG_NODESETISOLATIONNOTIMPLEMENTED"));return this;case Z.RestoreRemoveIsolation:q.error(j().getText("VIEWPORT_MSG_RESTOREREMOVEISOLATIONNOTIMPLEMENTED"));return this;case Z.ViewLeft:case Z.ViewRight:case Z.ViewTop:case Z.ViewBottom:case Z.ViewBack:case Z.ViewFront:return this;default:break;}}.bind(this));if(x.min.x<x.max.x&&x.min.y<x.max.y){var z=new O();z._zoomTo(x,this._width,this._height,i);this._activateCamera(z,f);}return this;};r.prototype._activateCamera=function(a,f){if(f>0&&!this._animLoopRequestId){this._anim={start:{time:Date.now(),offsetX:this._camera.offsetX,offsetY:this._camera.offsetY,zoom:this._camera.zoom},end:{offsetX:a.offsetX,offsetY:a.offsetY,zoom:a.zoom},duration:f*1e3};this._animLoopRequestId=window.requestAnimationFrame(this._animLoopFunction);}else{this._camera.zoom=a.zoom;this._camera.offsetX=a.offsetX;this._camera.offsetY=a.offsetY;this._updateViewBox();this.fireCameraChanged({viewBox:this._getViewBox()});}};r.prototype.beginGesture=function(x,y){this._gestureX=(x-this._camera.offsetX)/this._camera.zoom;this._gestureY=(y-this._camera.offsetY)/this._camera.zoom;};r.prototype.endGesture=function(){this._gestureX=0;this._gestureY=0;};r.prototype.pan=function(a,b){if(!this.getFreezeCamera()){this._camera.offsetX+=a;this._camera.offsetY+=b;this._updateViewBox();this.fireCameraChanged({viewBox:this._getViewBox()});}};r.prototype.rotate=function(a,b){this.pan(a,b);};r.prototype.zoom=function(z){if(!this.getFreezeCamera()){var a=this._camera.zoom;this._camera.zoom*=z;this._camera.offsetX+=this._gestureX*(a-this._camera.zoom);this._camera.offsetY+=this._gestureY*(a-this._camera.zoom);this._updateViewBox();this.fireCameraChanged({viewBox:this._getViewBox()});}};r.prototype.hover=function(x,y){var a=this._getViewStateManagerSVG();if(!a){return;}var b=this.getDisableHotspotHovering()?null:this.hitTest(x,y);if(this._hotspotElement&&this._hotspotElement!==b){this.fireHotspotLeave({nodeRef:this._hotspotElement});if(!this.getShowAllHotspots()){this._hotspotElement.setOpacity(a._mask,0);}this._hotspotElement=null;}if(b&&b._vkGetNodeContentType()===N.Hotspot){this._hotspotElement=b;if(!this.getShowAllHotspots()){b.setOpacity(a._mask,1);}this.fireHotspotEnter({nodeRef:b});}};r.prototype._getViewBox=function(){var a=this._camera.zoom>0?1/this._camera.zoom:1;return[-this._camera.offsetX*a,-this._camera.offsetY*a,this._width*a,this._height*a];};r.prototype._updateViewBox=function(){var a=this._scene?this._scene.getRootElement():null;var b=a?a.domRef:null;if(b){b.parentNode.setAttribute("viewBox",this._getViewBox().join(" "));if(this._hotspotEffect){var f=this._getHotspotEffectScale();var i=f*8;this._hotspotEffect.setAttribute("x",-i+"%");this._hotspotEffect.setAttribute("y",-i+"%");this._hotspotEffect.setAttribute("width",(100+i*2)+"%");this._hotspotEffect.setAttribute("height",(100+i*2)+"%");this._hotspotEffect.children[0].setAttribute("stdDeviation",f);}return true;}return false;};r.prototype._getHotspotEffectScale=function(){return this._camera&&this._camera.zoom>0?8/this._camera.zoom:0;};r.prototype.getViewInfo=function(a){var b={};if(a==null){a={};}if(a.camera==null){a.camera=true;}if(a.camera){b.camera={viewBox:this._getViewBox()};}if(a.visibility&&this._viewStateManager){var f=a.visibility.mode==null?h.Complete:a.visibility.mode;b.visibility={mode:f};if(f===h.Complete){var i=this._viewStateManager.getVisibilityComplete();b.visibility.visible=i.visible;b.visibility.hidden=i.hidden;}else if(this._viewStateManager.getShouldTrackVisibilityChanges()){b.visibility.changes=this._viewStateManager.getVisibilityChanges();}else{q.warning(j().getText(M.VIT32.summary),M.VIT32.code,"sap.ui.vk.threejs.Viewport");}}var x=this._getViewStateManagerSVG();if(a.selection&&x){b.selection=x._getSelectionComplete();}return b;};r.prototype.setViewInfo=function(a,f){var b=a.camera;if(b&&b.viewBox){var i=new O();i._setViewBox(b.viewBox,this._width,this._height);this._activateCamera(i,f);}var x=new Map();if(a.visibility||a.selection){var y=this._viewStateManager.getNodeHierarchy(),z=y.findNodesByName();z.forEach(function(Q){var T=y.createNodeProxy(Q);var U=T.getVeId();y.destroyNodeProxy(T);if(U){x.set(U,Q);}});}if(a.visibility){switch(a.visibility.mode){case h.Complete:var C=a.visibility.visible,D=a.visibility.hidden;C.forEach(function(Q){this._viewStateManager.setVisibilityState(x.get(Q),true,false);},this);D.forEach(function(Q){this._viewStateManager.setVisibilityState(x.get(Q),false,false);},this);break;case h.Differences:this._viewStateManager.resetVisibility();a.visibility.changes.forEach(function(Q){var T=x.get(Q);if(T){this._viewStateManager.setVisibilityState(T,!this._viewStateManager.getVisibilityState(T),false);}},this);break;default:q.error(j().getText(M.VIT28.summary),M.VIT28.code,"sap.ui.vk.threejs.Viewport");break;}}var F=this._getViewStateManagerSVG();var G=a.selection;if(G&&F){var I=F._getSelectionComplete();if(Array.isArray(G.selected)){var J=[];var P=[];G.selected.forEach(function(Q){var T=x.get(Q);if(T){J.push(T);}});I.selected.forEach(function(Q){var T=x.get(Q);if(T&&G.selected.indexOf(Q)<0){P.push(T);}});F.setSelectionStates(J,P,false,false);}}return this;};r.prototype.queueCommand=function(a){if(this instanceof r){a();}return this;};r.prototype.getOutputSize=function(){var b=this.getDomRef().getBoundingClientRect();var a=b.width;var f=b.height;var i;i=Math.min(a,f);return{left:(a-i)*0.5,top:(f-i)*0.5,sideLength:i};};r.prototype.setShouldRenderFrame=function(){};r.prototype._isPanoramicActivated=function(){return false;};r.prototype.setShowAllHotspots=function(a){this.setProperty("showAllHotspots",a,true);var b=this._getViewStateManagerSVG();if(b){var f=b.getNodeHierarchy();var i=f.getHotspotNodeIds();var x=this._hotspotElement;i.forEach(function(y){if(y.domRef){if(a){y.setOpacity(b._mask,1);}else if(y!==x){y.setOpacity(b._mask,0);}}});}};r.prototype.setDisableHotspotHovering=function(a){this.setProperty("disableHotspotHovering",a,true);if(a){this.hover(0,0);}};r.prototype.setHotspotColorABGR=function(a){this.setProperty("hotspotColorABGR",a,true);this.setProperty("hotspotColor",m(p(a)),true);this.invalidate();return this;};r.prototype.setHotspotColor=function(a){this.setProperty("hotspotColor",a,true);this.setProperty("hotspotColorABGR",o(n(a)),true);this.invalidate();return this;};return r;});
