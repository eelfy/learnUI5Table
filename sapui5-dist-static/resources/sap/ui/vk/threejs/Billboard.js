/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/base/ManagedObject","../thirdparty/three","../thirdparty/html2canvas","../BillboardCoordinateSpace","../BillboardTextEncoding","../BillboardStyle","../BillboardBorderLineStyle","../BillboardHorizontalAlignment","./ThreeUtils","../NodeContentType"],function(B,t,h,b,c,d,e,f,T,N){"use strict";var g=B.extend("sap.ui.vk.threejs.Billboard",{metadata:{properties:{node:{type:"any",defaultValue:new THREE.Group()},text:{type:"string",defaultValue:""},font:{type:"string",defaultValue:""},fontSize:{type:"float",defaultValue:20},fontWeight:{type:"string",defaultValue:"normal"},fontItalic:{type:"boolean",defaultValue:false},textColor:{type:"sap.ui.core.CSSColor",defaultValue:"#fff"},borderColor:{type:"sap.ui.core.CSSColor",defaultValue:"#fff"},borderOpacity:{type:"float",defaultValue:1},backgroundColor:{type:"sap.ui.core.CSSColor",defaultValue:"#fff"},backgroundOpacity:{type:"float",defaultValue:0.5},encoding:{type:"sap.ui.vk.BillboardTextEncoding",defaultValue:c.PlainText},width:{type:"float",defaultValue:100},height:{type:"float",defaultValue:100},style:{type:"sap.ui.vk.BillboardStyle",defaultValue:d.None},borderLineStyle:{type:"sap.ui.vk.BillboardBorderLineStyle",defaultValue:e.Solid},borderWidth:{type:"float",defaultValue:2},horizontalAlignment:{type:"sap.ui.vk.BillboardHorizontalAlignment",defaultValue:f.Left},texture:{type:"any",defaultValue:null},material:{type:"any"},link:{type:"string",defaultValue:""},coordinateSpace:{type:"sap.ui.vk.BillboardCoordinateSpace",defaultValue:b.Viewport},position:{type:"any",defaultValue:new THREE.Vector3(0,0,0)},renderOrder:{type:"int",defaultValue:0}}}});g.prototype.init=function(){if(B.prototype.init){B.prototype.init.call(this);}var a=new THREE.BufferGeometry();a.setIndex([0,1,2,2,1,3]);a.setAttribute("position",new THREE.Float32BufferAttribute([-0.5,-0.5,0,0.5,-0.5,0,-0.5,0.5,0,0.5,0.5,0],3));a.setAttribute("normal",new THREE.Float32BufferAttribute([0,0,1,0,0,1,0,0,1,0,0,1],3));a.setAttribute("uv",new THREE.Float32BufferAttribute([0,0,1,0,0,1,1,1],2));var i=new THREE.MeshBasicMaterial({depthTest:false,depthWrite:false,transparent:true,alphaTest:0.05,premultipliedAlpha:true,side:THREE.DoubleSide});this.setProperty("material",i,true);this._billboard=new THREE.Mesh(a,i);this._needUpdateTexture=true;};g.prototype.exit=function(){if(B.prototype.exit){B.prototype.exit.call(this);}if(this._billboard){T.disposeObject(this._billboard);this._billboard=null;}};g.prototype.setNode=function(n){if(n instanceof THREE.Object3D){this.setProperty("node",n,true);n.add(this._billboard);n.matrixAutoUpdate=false;n.isBillboard=true;n.userData.billboard=this;this._traverse(function(a){a.userData.skipIt=true;});}return this;};g.prototype._traverse=function(a){a(this._billboard);};g.prototype.setEncoding=function(v){this.setProperty("encoding",v,true);this._needUpdateTexture=true;return this;};g.prototype.setText=function(v){this.setProperty("text",v,true);this._needUpdateTexture=true;return this;};g.prototype.setFont=function(v){this.setProperty("font",v,true);this._needUpdateTexture=true;return this;};g.prototype.setFontSize=function(v){this.setProperty("fontSize",v,true);this._needUpdateTexture=true;return this;};g.prototype.setFontWeight=function(v){this.setProperty("fontWeight",v,true);this._needUpdateTexture=true;return this;};g.prototype.setFontItalic=function(v){this.setProperty("fontItalic",v,true);this._needUpdateTexture=true;return this;};g.prototype.setStyle=function(v){this.setProperty("style",v,true);this._needUpdateTexture=true;return this;};g.prototype.setWidth=function(v){this.setProperty("width",v,true);this._needUpdateTexture=true;return this;};g.prototype.setHeight=function(v){this.setProperty("height",v,true);this._needUpdateTexture=true;return this;};g.prototype.setTextColor=function(v){this.setProperty("textColor",v,true);this._needUpdateTexture=true;return this;};g.prototype.setBackgroundColor=function(v){this.setProperty("backgroundColor",v,true);this._needUpdateTexture=true;return this;};g.prototype.setBackgroundOpacity=function(v){this.setProperty("backgroundOpacity",v,true);this._needUpdateTexture=true;return this;};g.prototype.setBorderWidth=function(v){this.setProperty("borderWidth",v,true);this._needUpdateTexture=true;return this;};g.prototype.setBorderLineStyle=function(v){this.setProperty("borderLineStyle",v,true);this._needUpdateTexture=true;return this;};g.prototype.setBorderColor=function(v){this.setProperty("borderColor",v,true);this._needUpdateTexture=true;return this;};g.prototype.setBorderOpacity=function(v){this.setProperty("borderOpacity",v,true);this._needUpdateTexture=true;return this;};g.prototype.setHorizontalAlignment=function(v){this.setProperty("horizontalAlignment",v,true);this._needUpdateTexture=true;return this;};g.prototype.setLink=function(v){this.setProperty("link",v,true);this._needUpdateTexture=true;return this;};g.prototype.setTexture=function(v){this.setProperty("texture",v,true);this._billboard.material.map=v;return this;};g.prototype.setMaterial=function(v){this.setProperty("material",v,true);this._billboard.material=v;return this;};g.prototype.setRenderOrder=function(v){this.setProperty("renderOrder",v,true);this._traverse(function(a){a.renderOrder=v;});return this;};g.prototype._renderBackground=function(a,w,i,n){a.fillStyle=this.getBackgroundColor();a.strokeStyle=this.getBorderColor();a.lineWidth=n;switch(this.getBorderLineStyle()){default:a.setLineDash([]);break;case e.Dash:a.setLineDash([n*5,n]);break;case e.Dot:a.setLineDash([n*2,n]);break;case e.DashDot:a.setLineDash([n*5,n,n*2,n]);break;case e.DashDotDot:a.setLineDash([n*5,n,n*2,n,n*2,n]);break;}var o=n/2;if(this.getStyle()===d.RectangularShape){a.globalAlpha=this.getBackgroundOpacity();if(a.globalAlpha>0){a.fillRect(0,0,w,i);}a.globalAlpha=n>0?this.getBorderOpacity():0;if(a.globalAlpha>0){a.strokeRect(o,o,w-n,i-n);}}else if(this.getStyle()===d.CircularShape){var x=w/2;var y=i/2;var r=w/2;a.beginPath();a.arc(x,y,r-o,0,2*Math.PI);a.closePath();a.globalAlpha=this.getBackgroundOpacity();if(a.globalAlpha>0){a.fill();}a.globalAlpha=n>0?this.getBorderOpacity():0;if(a.globalAlpha>0){a.stroke();}}a.globalAlpha=1;a.setLineDash([]);};g.prototype._getFont=function(a){return(this.getFontItalic()?"italic ":"")+this.getFontWeight()+" "+(this.getFontSize()*a)+"px "+(this.getFont()||"Arial");};g.prototype._renderPlainText=function(n){var o=document.createElement("canvas");var r=o.getContext("2d");var s=this.getFontSize()*n;var u=this._getFont(n);r.font=u;var v=Math.ceil(s);var w=this.getBorderLineStyle()!==e.None?this.getBorderWidth()*n:0;var z=Math.ceil(s*0.2+w);var A=this.getText().split("\n");var C=0;A.forEach(function(I){C=Math.max(C,r.measureText(I).width);});var D=this.getLink();if(D.length>0){C=Math.max(C,r.measureText(D).width);}C=Math.ceil(C*0.5)*2;var E=A.length+(D.length>0?1:0);var F=Math.ceil(v*E*0.5)*2;var G=C+z*2;var H=F+z*2;if(this.getStyle()===d.CircularShape){G=H=Math.max(G,H);}this._width=G/n;this._height=H/n;o.width=THREE.Math.ceilPowerOfTwo(G);o.height=THREE.Math.ceilPowerOfTwo(H);this._renderBackground(r,G,H,w);r.font=u;r.textAlign=this.getHorizontalAlignment();r.textBaseline="middle";var a=["left","center","right"].indexOf(r.textAlign);var x=(G+C*(a-1))>>1;var y=(H-(E-1)*v)>>1;r.fillStyle=this.getTextColor();r.filter="blur(0px)";for(var i in A){r.fillText(A[i],x,y+v*i);}if(D.length>0){r.fillStyle="#00f";r.textAlign="right";r.textBaseline="bottom";r.fillText(D,G-z,H-z);}this._setBillboardTexture(o,G,H);};g.prototype._renderHtmlText=function(a){var i=document.createElement("canvas");var n=i.getContext("2d");var o=this.getBorderLineStyle()!==e.None?this.getBorderWidth()*a:0;var r=Math.ceil(o);var w=Math.ceil(this.getWidth()*a)+r*2;var s=Math.ceil(this.getHeight()*a)+r*2;if(this.getStyle()===d.CircularShape){w=s=Math.max(w,s);}this._width=w/a;this._height=s/a;i.width=THREE.Math.ceilPowerOfTwo(w);i.height=THREE.Math.ceilPowerOfTwo(s);this._renderBackground(n,w,s,o);var u=this.getLink();if(u.length>0){n.font=this._getFont(a);n.fillStyle="#00f";n.textAlign="right";n.textBaseline="bottom";n.fillText(u,w-r,s-r);}var v=document.createElement("iframe");v.style.visibility="hidden";v.width=(w-r*2)/a;v.height=(s-r*2)/a;document.body.appendChild(v);var x=v.contentDocument||v.contentWindow.document;x.open();x.close();x.body.innerHTML=this.getText();var y=document.createElement("canvas");y.width=v.width*a;y.height=v.height*a;y.style.width=v.width+"px";y.style.height=v.height+"px";var z=y.getContext("2d");z.scale(a,a);this._billboard.material.visible=false;h(x.body,{canvas:y,backgroundColor:null}).then(function(y){if(y.width>0&&y.height>0){i.getContext("2d").drawImage(y,r,r);}setTimeout(this._setBillboardTexture.bind(this,i,w,s),0);document.body.removeChild(v);}.bind(this));};g.prototype._setBillboardTexture=function(a,w,i){var u=w/a.width,v=i/a.height;this._billboard.geometry.setAttribute("uv",new THREE.Float32BufferAttribute([0,1-v,u,1-v,0,1,u,1],2));var n=new THREE.CanvasTexture(a);n.magFilter=THREE.NearestFilter;this._billboard.material.map=n;this._billboard.material.needsUpdate=true;this._billboard.material.visible=true;};var p=new THREE.Vector4(),j=new THREE.Vector3(),k=new THREE.Vector3(),l=new THREE.Vector3(),q=new THREE.Quaternion(),m=new THREE.Vector3();g.prototype._updateTexture=function(){this._width=this.getWidth();this._height=this.getHeight();if(this.getText()&&!this.getTexture()){switch(this.getEncoding()){default:case c.PlainText:this._renderPlainText(window.devicePixelRatio);break;case c.HtmlText:this._renderHtmlText(window.devicePixelRatio);break;}}};g.prototype._update=function(r,a,v){var n=this.getNode();if(!n||!n.visible){return;}if(this._needUpdateTexture){this._needUpdateTexture=false;this._updateTexture();}n.matrix.getInverse(n.parent.matrixWorld);n.matrix.decompose(n.position,n.quaternion,n.scale);n.matrixWorld.identity();this._billboard.quaternion.copy(a.quaternion);var s=this.getPosition(),i=this._billboard.position,o=1;if(s){i.copy(s);}else{i.setScalar(0);}var u=this.getCoordinateSpace();if(u===b.Screen){o=THREE.Math.lerp(a.near,a.far,1e-4);i.multiplyScalar(2/a.projectionMatrix.elements[5]);i.z=-1;i.multiplyScalar(o).applyMatrix4(a.matrixWorld);}else if(u===b.Viewport){if(v.x>v.y){i.x*=v.y/v.x;}else{i.y*=v.x/v.y;}i.z=-0.9999;i.unproject(a);p.copy(i).applyMatrix4(a.matrixWorldInverse).applyMatrix4(a.projectionMatrix);var w=(p.x/p.w)*0.5*v.x,x=(p.y/p.w)*0.5*v.y;o=p.w*2/(v.x*a.projectionMatrix.elements[0]);j.setFromMatrixColumn(a.matrixWorld,0).multiplyScalar(o*(Math.round(w)-w));k.setFromMatrixColumn(a.matrixWorld,1).multiplyScalar(o*(Math.round(x)-x));i.add(j).add(k);}this._billboard.scale.set(this._width*o,this._height*o,1);this._billboard.updateMatrix();this._billboard.updateMatrixWorld();};g.prototype._ortho2DUpdate=function(r,a){if(!this.visible){return;}var o=this.userData.originalTransform;var i=a.near*1.0001;if(Math.abs(o.q.w-1)>1e-3){i=Math.min(i+a.near*o.s.length()*0.5,(a.near+a.far)*0.5);}this.position.copy(o.p).multiplyScalar(2/a.projectionMatrix.elements[5]);this.position.z=-1;this.position.multiplyScalar(i).applyMatrix4(a.matrixWorld);q.copy(a.quaternion).multiply(o.q);this.quaternion.copy(q);this.scale.copy(o.s).multiplyScalar(i*0.5);this.scale.z=Math.min(i-a.near,this.scale.z*0.001);this.matrixWorld.compose(this.position,this.quaternion,this.scale);this.matrix.getInverse(this.parent.matrixWorld).multiply(this.matrixWorld);this.matrix.decompose(this.position,this.quaternion,this.scale);this.updateMatrixWorld(true);};g.prototype._billboardViewUpdate=function(r,a){if(!this.visible){return;}this.parent.matrixWorld.decompose(l,q,m);q.inverse().multiply(a.quaternion);this.quaternion.copy(q);if(a.userData.rotate&&this._vkGetNodeContentType()===N.Symbol){var i=THREE.Math.degToRad(a.fov);var n=a.getWorldDirection(new THREE.Vector3());var o=this.getWorldPosition(new THREE.Vector3());var s=Math.asin(o.distanceTo(n.multiplyScalar(500))/1000);this.baseScale=this.baseScale?this.baseScale:this.scale.clone();this.scale.copy(this.baseScale).multiplyScalar(i*Math.cos(2*s));var u=a.position.z;if(u){var v=(99-u)/99;this.scale.multiplyScalar(v);}}this.updateMatrix();this.updateMatrixWorld();};g.prototype._lockToViewportUpdate=function(r,a){var i=0;this.children.forEach(function(o){if(o.visible&&Math.abs(o.quaternion.w-1)>1e-3){i=Math.max(i,o.scale.length());}});var n=Math.min(a.near*(1.0001+i*0.5),(a.near+a.far)*0.5);this.position.setFromMatrixColumn(a.matrixWorld,2).multiplyScalar(-n);this.position.add(a.position);this.scale.setScalar(n*2/a.projectionMatrix.elements[5]);this.matrixWorld.compose(this.position,a.quaternion,this.scale);this.matrix.getInverse(this.parent.matrixWorld).multiply(this.matrixWorld);this.matrix.decompose(this.position,this.quaternion,this.scale);this.updateMatrixWorld(true);};return g;});
