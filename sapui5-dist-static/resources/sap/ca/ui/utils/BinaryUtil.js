/*
 * Binary Ajax 0.2
 * Copyright (c) 2008 Jacob Seidelin, cupboy@gmail.com, http://blog.nihilogic.dk/
 * Licensed under the MPL License [http://www.nihilogic.dk/licenses/mpl-license.txt]
 */
jQuery.sap.declare("sap.ca.ui.utils.BinaryUtil");sap.ui.base.Object.extend("sap.ca.ui.utils.BinaryUtil",{constructor:function(d,D){var a=d;var b=D;this.getByteAt=function(o){return a.charCodeAt(o)&0xFF;};this.getBytesAt=function(o,l,B){var c=[];if(B===undefined){B=true;}for(var i=0;i<l;i++){if(B){c[i]=a.charCodeAt(o+i)&0xFF;}else{c[i]=a.charCodeAt(o+l-i-1)&0xFF;}};return c;};this.getLength=function(){return b;};this.getSShortAt=function(o,B){var c=this.getBytesAt(o,2,B);var s=(c[0]<<8)+c[1];return s;};this.getShortAt=function(o,B){var u=this.getSShortAt(o,B);if(u<0)u+=65536;return u;};this.getLongAt=function(o,B){var u=this.getSLongAt(o,B);if(u<0)u+=4294967296;return u;};this.getSLongAt=function(o,B){var c=this.getBytesAt(o,4,B);var l=(((((c[0]<<8)+c[1])<<8)+c[2])<<8)+c[3];return l;};this.getStringAt=function(o,l){var s=[];var B=this.getBytesAt(o,l);for(var j=0;j<l;j++){s[j]=String.fromCharCode(B[j]);}return s.join("");};}});
