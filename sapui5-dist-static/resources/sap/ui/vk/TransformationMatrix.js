/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/base/DataType","sap/base/assert"],function(D,c){"use strict";var T=D.getType("float[]");T.parseValue=function(v){var a=T.getComponentType();return v.split(/\s*,\s*|\s+/).map(a.parseValue.bind(a));};T.convertTo4x4=function(a){var m=a;return[m[0],m[1],m[2],0,m[3],m[4],m[5],0,m[6],m[7],m[8],0,m[9],m[10],m[11],1];};T.canConvertTo4x3=function(m){var e=function(a,b){return Math.abs(a-b)<1e-5;};return(e(m[3],0)&&e(m[7],0)&&e(m[11],0)&&e(m[15],1));};T.convertTo4x3=function(a){var m=a;c(T.canConvertTo4x3(m),"The transformation matrix is invalid. The last column must be [0, 0, 0, 1].");return[m[0],m[1],m[2],m[4],m[5],m[6],m[8],m[9],m[10],m[12],m[13],m[14]];};T.convert3x2To4x3=function(m){return[m[0],m[1],0,m[2],m[3],0,0,0,1,m[4],m[5],0];};T.convert4x3To3x2=function(m){return new Float32Array([m[0],m[1],m[3],m[4],m[9],m[10]]);};T.convert4x4To3x2=function(m){return new Float32Array([m[0],m[1],m[4],m[5],m[12],m[13]]);};T.convertTo3x2=function(m){if(m){if(m.length===12){return T.convert4x3To3x2(m);}else if(m.length===16){return T.convert4x4To3x2(m);}}return new Float32Array([1,0,0,1,0,0]);};return T;},true);
