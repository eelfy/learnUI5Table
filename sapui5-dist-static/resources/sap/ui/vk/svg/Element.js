/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["../abgrToColor","../cssColorToColor","../NodeContentType","sap/base/util/uid"],function(d,e,N,u){"use strict";var E=function(a){a=a||{};this.type="Group";this.uid=u();this.sid=a.sid||undefined;this.name=a.name||undefined;this.vMask=(1|0);this.sMask=(0|0);this.matrix=new Float32Array(a.matrix||[1,0,0,1,0,0]);this.parent=null;this.children=[];this.domRef=null;this.nodeContentType=N.Regular;this.materialId=a.materialID;if(a.lineStyle){this.lineStyle=a.lineStyle;}if(a.fillStyle){this.fillStyle=a.fillStyle;}this.userData=a.subelement?{skipIt:true}:{};};function h(c,a){if(c){if(typeof c==="string"){c=e(c);return new Float32Array([c.red/255,c.green/255,c.blue/255,c.alpha]);}else if(c.length===4){return new Float32Array(c);}else{return new Float32Array([c[0],c[1],c[2],a]);}}return new Float32Array([0,0,0,a]);}E.prototype.isFillable=function(){return true;};E.prototype.defaultFillAlpha=0;E.prototype.setMaterial=function(m,a){m=m||{};if(this.materialId===m.materialId){var f=this.fillStyle;if(f){this.fill=h(f.colour,1);}else{this.fill=new Float32Array([0,0,0,0]);}var b=this.lineStyle;if(b){this.stroke=h(b.colour,1);this.strokeWidth=b.width||1;this.strokeDashArray=E._convertDashes(b.dashes||[],this.strokeWidth);}else{this.stroke=h(m.lineColor,1);this.strokeWidth=m.lineWidth!==undefined?m.lineWidth:1;this.strokeDashArray=(m.lineStyle&&m.lineStyle.dashPattern)||[];}if(m.lineStyle&&m.lineStyle.widthCoordinateSpace!==undefined){this.widthCoordinateSpace=m.lineStyle.widthCoordinateSpace;}}for(var i=0,l=this.children.length;i<l;i++){this.children[i].setMaterial(m);}if(a){this.invalidate();}};E._convertDashes=function(a,s){var b=[];for(var i=0;i<a.length;i++){var n=a[i]*10;if(n>0){b.push(n);b.push(0);}else if(n<0){b.push(0);b.push(-n);}else{b.push(s);b.push(s);}}return b;};E.prototype.add=function(a){if(a.parent!==null){a.parent.remove(a);}a.parent=this;this.children.push(a);a.sMask=this.sMask;if(this.highlightColor){a.highlightColor=this.highlightColor;}return this;};E.prototype.remove=function(a){var i=this.children.indexOf(a);if(i!==-1){a.parent=null;this.children.splice(i,1);this.invalidate();}return this;};E.prototype.replace=function(a,n){var i=this.children.indexOf(a);if(i!==-1){a.parent=null;n.parent=this;this.children[i]=n;n.domRef=a.domRef;n.invalidate();}return this;};E.prototype._vkPersistentId=function(){var a=this;do{if(a.sid){return a.sid;}a=a.parent;}while(a);return null;};E.prototype._vkGetNodeContentType=function(){return this.nodeContentType;};E.prototype._initAsHotspot=function(a){function r(c){if(c){c[0]=0;c[1]=0;c[2]=0;c[3]=c[3]>0?1:1e-4;}}if(a!==undefined){this.opacity=a;}this.traverse(function(n){if(n!==this){n.userData.skipIt=true;}r(n.fill);r(n.stroke);}.bind(this));};E.prototype._vkSetNodeContentType=function(n){this.nodeContentType=n;if(n===N.Hotspot){this._initAsHotspot(0);}};E.prototype.traverse=function(c){c(this);var a=this.children;for(var i=0,l=a.length;i<l;i++){a[i].traverse(c);}};E.prototype.traverseAncestors=function(c){var a=this.parent;if(a!==null){c(a);a.traverseAncestors(c);}};E.prototype.traverseVisible=function(c,m){if(this.isVisible(m)){c(this);var a=this.children;for(var i=0,l=a.length;i<l;i++){a[i].traverseVisible(c,m);}}};E.prototype.setVisible=function(m,v){if(!this.userData.skipIt){if(v){this.vMask|=m;}else{this.vMask&=~m;}if(this.domRef!==null){if(v){this.domRef.removeAttribute("display");}else{this.domRef.setAttribute("display","none");}}}};E.prototype.isVisible=function(m){return this.userData.skipIt||(this.vMask&m)!==0;};E.prototype._updateColor=function(m){if(this.domRef!==null){if(this.fill!==undefined){this.domRef.setAttribute("fill",this._cssColor(this.fill,m));}if(this.stroke!==undefined&&this.stroke[3]>0&&this.strokeWidth){this.domRef.setAttribute("stroke",this._cssColor(this.stroke,m));}}};E.prototype.setSelected=function(m,s,a){if(s){this.sMask|=m;this.highlightColor=a;}else{this.sMask&=~m;delete this.highlightColor;}this._updateColor(m);if(this.nodeContentType===N.Hotspot){this.setOpacity(m,this.opacity);}};E.prototype.isSelected=function(m){return(this.sMask&m)!==0;};E.prototype.setTintColor=function(m,a){this.tintColor=a;this._updateColor(m);};E.prototype._setOpacity=function(m,a){if(this.domRef!==null){if(a!==undefined){this.domRef.setAttribute("opacity",this.nodeContentType===N.Hotspot&&this.isSelected(m)?(a*0.5+0.5):a);}else{this.domRef.removeAttribute("opacity");}}};E.prototype._isGeometryNode=function(){return this.type!=="Group";};E.prototype._getFurthestParentWithOpacity=function(){var a=this.parent;var b;while(a){if(a.opacity){b=a.opacity;}a=a.parent;}return b;};E.prototype.setOpacity=function(m,a){if(this._isGeometryNode()){return;}var b=[];this.opacity=a;if(this.nodeContentType===N.Hotspot){this._setOpacity(m,a);return;}this.traverse(function(c){if(c._isGeometryNode()){b.push(c);}});b.forEach(function(l){var s=a;if(a===undefined){if(l.opacity){s=l.opacity;}else{s=l._getFurthestParentWithOpacity();}}l._setOpacity(m,s);});};function j(m){return m[0]===1&&m[1]===0&&m[2]===0&&m[3]===1&&m[4]===0&&m[5]===0;}E.prototype.setMatrix=function(m){this.matrix=m;if(this.domRef!==null){if(!j(m)){this.domRef.setAttribute("transform","matrix("+this.matrix.join(",")+")");}else{this.domRef.removeAttribute("transform");}}};E._multiplyMatrices=function(a,b){var c=a[0],f=a[2],g=a[4];var i=a[1],l=a[3],m=a[5];var n=b[0],q=b[2],r=b[4];var s=b[1],v=b[3],w=b[5];return new Float32Array([c*n+f*s,i*n+l*s,c*q+f*v,i*q+l*v,c*r+f*w+g,i*r+l*w+m]);};E._invertMatrix=function(m){var a=m[0],b=m[1],c=m[2],f=m[3],g=m[4],i=m[5],l=a*f-b*c;if(l===0){return new Float32Array([0,0,0,0,0,0]);}var n=1/l;var q=new Float32Array(6);q[0]=f*n;q[1]=-b*n;q[2]=-c*n;q[3]=a*n;q[4]=(i*c-f*g)*n;q[5]=(b*g-i*a)*n;return q;};E._decompose=function(m){var a=Math.sqrt(m[0]*m[0]+m[1]*m[1]);var b=Math.sqrt(m[2]*m[2]+m[3]*m[3]);var c=m[0]/a,f=m[1]/a,g=m[2]/b,i=m[3]/b;var q,s;if(c+i+1>0){s=0.5/Math.sqrt(2+c+i);q=[0,0,(f-g)*s,0.25/s];}else{s=2.0*Math.sqrt(2-c-i);q=[0,0,0.25*s,(f-g)/s];}return{position:[m[4],m[5],0],quaternion:q,scale:[a,b,1]};};E._compose=function(a,q,s){var b=s[0],c=s[1];var f=q[2],g=q[3];var z=f*f*2,w=g*f*2;return new Float32Array([(1-z)*b,w*b,-w*c,(1-z)*c,a[0],a[1]]);};E._transformPoint=function(a,b,m){return{x:a*m[0]+b*m[2]+m[4],y:a*m[1]+b*m[3]+m[5]};};E.prototype._matrixWorld=function(m){if(m!==undefined){return E._multiplyMatrices(m,this.matrix);}else{var a=this.parent;var b=this.matrix;while(a!==null){b=E._multiplyMatrices(a.matrix,b);a=a.parent;}return b;}};function k(b,x,y,a,c){b.min.x=Math.min(b.min.x,x-a);b.min.y=Math.min(b.min.y,y-c);b.max.x=Math.max(b.max.x,x+a);b.max.y=Math.max(b.max.y,y+c);}function o(a){return a*a;}E.prototype._expandBoundingBoxCE=function(b,m,c,a,f,g){k(b,c*m[0]+a*m[2]+m[4],c*m[1]+a*m[3]+m[5],Math.abs(f*m[0])+Math.abs(g*m[2]),Math.abs(f*m[1])+Math.abs(g*m[3]));};E.prototype._expandBoundingBoxCR=function(b,m,c,a,r,f){k(b,c*m[0]+a*m[2]+m[4],c*m[1]+a*m[3]+m[5],Math.sqrt(o(r*m[0])+o(f*m[2])),Math.sqrt(o(r*m[1])+o(f*m[3])));};E.prototype._expandBoundingBox=function(b,m){};E.prototype._expandBoundingBoxRecursive=function(b,m,a){if(this.isVisible(m)){var c=this._matrixWorld(a);this._expandBoundingBox(b,c);var f=this.children;for(var i=0,l=f.length;i<l;i++){f[i]._expandBoundingBoxRecursive(b,m,c);}}};E.prototype._getSceneTreeElement=function(){var a=this;var b=a.parent;while(b){if(b.userData.closed){a=b;}b=b.parent;}while(a.userData.skipIt){a=a.parent;}return a;};E.prototype._findRectElementsRecursive=function(s,r,m,a){if(this.isVisible(m)){var b=this._matrixWorld(a);var c=this.children;var f={min:{x:Infinity,y:Infinity},max:{x:-Infinity,y:-Infinity}};this._expandBoundingBox(f,b);if(f.min.x<=r.x2&&f.max.x>=r.x1&&f.min.y<=r.y2&&f.max.y>=r.y1){s.add(this._getSceneTreeElement());}for(var i=0,l=c.length;i<l;i++){c[i]._findRectElementsRecursive(s,r,m,b);}}};E.prototype.tagName=function(){return"g";};E.prototype._setBaseAttributes=function(s,m){s("id",this.uid);if(this.opacity!==undefined){s("opacity",this.nodeContentType===N.Hotspot&&this.isSelected(m)?(this.opacity*0.5+0.5):this.opacity);}if(!j(this.matrix)){s("transform","matrix("+this.matrix.join(",")+")");}if(!this.isVisible(m)){s("display","none");}if(this.fill!==undefined){s("fill",this._cssColor(this.fill,m));}if(this.stroke!==undefined&&this.stroke[3]>0&&this.strokeWidth){s("stroke",this._cssColor(this.stroke,m));s("stroke-width",this.strokeWidth);s("vector-effect","non-scaling-stroke");if(this.strokeDashArray.length>0){s("stroke-dasharray",this.strokeDashArray.join(" "));}}if(this.nodeContentType===N.Hotspot){s("filter","url(#hotspot-effect)");}};E.prototype._setSpecificAttributes=function(s){};E.prototype.render=function(r,m){var a=this.tagName();r.write("<"+a);var s=r.writeAttribute.bind(r);this._setBaseAttributes(s,m);this._setSpecificAttributes(s);r.write(">");if(this._renderContent){this._renderContent(r);}this.children.forEach(function(b){b.render(r,m);});r.write("</"+a+">");};E.prototype._createDomElement=function(c){var a=document.createElementNS("http://www.w3.org/2000/svg",this.tagName());var s=a.setAttribute.bind(a);this._setBaseAttributes(s,1<<c);this._setSpecificAttributes(s);if(this._createContent){this._createContent(a);}return a;};E.prototype.invalidate=function(c){if(this.domRef!==null){var a=this.domRef;this.domRef=this._createDomElement(c);a.parentNode.replaceChild(this.domRef,a);for(var i=0,l=this.children.length;i<l;i++){var b=this.children[i].domRef;if(b){this.domRef.appendChild(b);}}}};E.prototype.rerender=function(c){var a=this.domRef;if(a!==null&&a.parentNode!==null){this.traverse(function(n){n.domRef=n._createDomElement(c);if(n===this){a.parentNode.replaceChild(n.domRef,a);}else{n.parent.domRef.appendChild(n.domRef);}}.bind(this));}};function p(a,b){var c=a.children;for(var i=0,l=c.length;i<l;i++){if(c[i].id===b){return c[i];}}return null;}E.prototype._setDomRef=function(a){this.domRef=a;var c=this.children;for(var i=0,l=c.length;i<l;i++){var b=c[i];b._setDomRef(a?p(a,b.uid):null);}};E.prototype.getElementByProperty=function(n,v){if(this[n]===v){return this;}var c=this.children;for(var i=0,l=c.length;i<l;i++){var a=c[i].getElementByProperty(n,v);if(a!==null){return a;}}return null;};E.prototype.getElementById=function(i){return this.getElementByProperty("uid",i);};E.prototype.copy=function(s,r){this.name=s.name;this.matrix=s.matrix.slice();this.nodeContentType=s.nodeContentType;this.materialId=s.materialId;this.lineStyle=s.lineStyle;this.fillStyle=s.fillStyle;if(s.opacity!==undefined){this.opacity=s.opacity;}if(s.tintColor!==undefined){this.tintColor=s.tintColor;}if(s.fill!==undefined){this.fill=s.fill.slice();}if(s.stroke!==undefined){this.stroke=s.stroke.slice();}if(s.strokeWidth!==undefined){this.strokeWidth=s.strokeWidth;}if(s.strokeDashArray!==undefined){this.strokeDashArray=s.strokeDashArray.slice();}if(s.widthCoordinateSpace!==undefined){this.widthCoordinateSpace=s.widthCoordinateSpace;}if(r||r===undefined){for(var i=0,l=s.children.length;i<l;i++){this.add(s.children[i].clone());}}return this;};E.prototype.clone=function(){return new this.constructor().copy(this);};function t(a,b,f){return a+(b-a)*f;}E.prototype._cssColor=function(c,m){var a=c[3];if(a===0){return"none";}var r=c[0]*255;var g=c[1]*255;var b=c[2]*255;var f=this.tintColor;if(f){f=d(f);var i=f.alpha;if(i>0){r=t(r,f.red,i);g=t(g,f.green,i);b=t(b,f.blue,i);}}var l=this.highlightColor;if(l){l=d(l);var n=l.alpha;if(n>0){r=t(r,l.red,n);g=t(g,l.green,n);b=t(b,l.blue,n);a=t(a,n,n);}}var q=((r<<24)|(g<<16)|(b<<8)|(a*255))>>>0;return"#"+("00000000"+q.toString(16)).slice(-8);};return E;});
