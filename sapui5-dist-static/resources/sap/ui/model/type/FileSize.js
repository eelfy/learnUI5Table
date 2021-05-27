/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/format/FileSizeFormat','sap/ui/model/SimpleType','sap/ui/model/FormatException','sap/ui/model/ParseException','sap/ui/model/ValidateException',"sap/ui/thirdparty/jquery"],function(F,S,a,P,V,q){"use strict";var b=S.extend("sap.ui.model.type.FileSize",{constructor:function(){S.apply(this,arguments);this.sName="FileSize";}});b.prototype.formatValue=function(v,i){var f;if(v==undefined||v==null){return null;}if(this.oInputFormat&&typeof v==="string"){f=this.oInputFormat.parse(v);if(isNaN(f)){throw new a("Cannot format file size: "+v+" has the wrong format");}}else if(!this.oInputFormat&&typeof v==="string"){throw new a("Cannot format file size: "+v+" of type string without input/source formatter");}else if(typeof v==="number"){f=v;}else{throw new a("Cannot format file size: "+v+" has wrong type: "+(typeof v));}if(f==undefined||f==null){return null;}switch(this.getPrimitiveType(i)){case"string":return this.oOutputFormat.format(f);case"int":return Math.floor(f);case"float":case"any":return f;default:throw new a("Don't know how to format FileSize to "+i);}};b.prototype.parseValue=function(v,i){var r,B;if(v==undefined||v==null){return null;}switch(this.getPrimitiveType(i)){case"string":r=this.oOutputFormat.parse(v);if(isNaN(r)){B=sap.ui.getCore().getLibraryResourceBundle();throw new P(B.getText("FileSize.Invalid"));}break;case"int":case"float":r=v;break;default:throw new P("Don't know how to parse FileSize from "+i);}if(this.oInputFormat){r=this.oInputFormat.format(r);}return r;};b.prototype.validateValue=function(v){if(this.oConstraints){var B=sap.ui.getCore().getLibraryResourceBundle(),c=[],m=[],i=this.oInputFormat;if(i&&typeof v==="string"){v=i.parse(v);}else if(!i&&typeof v==="string"){throw new Error("No Validation possible: '"+v+"' is of type string but not input/source format specified.");}q.each(this.oConstraints,function(n,C){if(i&&typeof C==="string"){C=i.parse(C);}else if(!i&&typeof C==="string"){throw new Error("No Validation possible: Compare value ("+n+") '"+C+"' is of type string but not input/source format specified.");}switch(n){case"minimum":if(v<C){c.push("minimum");m.push(B.getText("FileSize.Minimum",[C]));}break;case"maximum":if(v>C){c.push("maximum");m.push(B.getText("FileSize.Maximum",[C]));}}});if(c.length>0){throw new V(this.combineMessages(m),c);}}};b.prototype.setFormatOptions=function(f){this.oFormatOptions=f;this._handleLocalizationChange();};b.prototype._handleLocalizationChange=function(){this.oOutputFormat=F.getInstance(this.oFormatOptions);if(this.oFormatOptions.source){this.oInputFormat=F.getInstance(this.oFormatOptions.source);}};return b;});
