/*!
 * SAPUI5

        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(['sap/ui/thirdparty/jquery','./library','sap/ui/core/Control','sap/ui/core/library','./ProgressIndicatorRenderer'],function(q,l,C,c,P){"use strict";var B=c.BarColor;var a=C.extend("sap.me.ProgressIndicator",{metadata:{deprecated:true,library:"sap.me",properties:{visible:{type:"boolean",group:"Behavior",defaultValue:true},enabled:{type:"boolean",group:"Behavior",defaultValue:true},barColor:{type:"sap.ui.core.BarColor",group:"Appearance",defaultValue:B.NEUTRAL},displayValue:{type:"string",group:"Appearance",defaultValue:'0%'},percentValue:{type:"int",group:"Data",defaultValue:0},showValue:{type:"boolean",group:"Appearance",defaultValue:true},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:'100%'}}}});a.prototype.setEndBar=function(){var w=this.getPercentValue();var b;var t;this.oBar=this.getDomRef("bar");this.oEnd=this.getDomRef("end");this.oBox=this.getDomRef("box");q(this.oEnd).removeClass('sapUIMeProgIndEndHidden');q(this.oEnd).addClass('sapUIMeProgIndEnd');if(w>100){b=(10000/w)+'%';}else{b='100%';}if(w>100){t=(w-100)*20;}else{t=(100-w)*20;}q(this.oBox).animate({width:b},0,'linear');q(this.oEnd).animate({left:b},t,'linear');q(this.oBar).animate({width:w+'%'},t,'linear');if(!this.oThis){this.oThis=this.$();}};a.prototype.setEndBarGoesBack=function(p){var w=this.getPercentValue();var b;var t;this.oBar=this.getDomRef("bar");this.oEnd=this.getDomRef("end");this.oBox=this.getDomRef("box");if(p>100){b=(10000/p)+'%';}else{b='100%';}q(this.oEnd).removeClass('sapUIMeProgIndEnd');q(this.oEnd).addClass('sapUIMeProgIndEndHidden');if(w>100){t=(w-100)*20;}else{t=(100-w)*20;}q(this.oBox).animate({width:b},0,'linear');q(this.oEnd).animate({left:b},t,'linear');q(this.oBar).animate({width:w+'%'},t,'linear');if(!this.oThis){this.oThis=this.$();}};a.prototype.setPercentValue=function(p){var w=this.getPercentValue();var b;this.oBar=this.getDomRef("bar");this.oEnd=this.getDomRef("end");this.oBox=this.getDomRef("box");var t=this;var d;if(p<0){p=0;}if(p>100){b=(10000/p)+'%';}else{b='100%';}if(!this.oBar){d=p*20;this.setProperty('percentValue',p,true);q(this.oBar).animate({width:p+'%'},d,'linear');return this;}if(p>100&&w<=100){d=(100-w)*20;this.setProperty('percentValue',p,true);q(this.oBar).animate({width:'100%'},d,'linear',function(){t.setEndBar();});}else if(p<=100&&w>100){d=(w-100)*20;this.setProperty('percentValue',p,true);q(this.oBar).animate({width:'100%'},d,'linear',function(){t.setEndBarGoesBack();});}else if(p>100&&w>100){if(p>w){d=(p-w)*20;}else{d=(w-p)*20;}b=(10000/p)+'%';this.setProperty('percentValue',p,true);q(this.oBox).animate({width:b},0,'linear');q(this.oEnd).animate({left:b},d,'linear');q(this.oBar).animate({width:p+'%'},d,'linear',function(){});if(!this.oThis){this.oThis=this.$();}}else{if(p>w){d=(p-w)*20;}else{d=(w-p)*20;}this.setProperty('percentValue',p,true);q(this.oBar).animate({width:p+'%'},d,'linear');if(!this.oThis){this.oThis=this.$();}}return this;};a.prototype.onselectstart=function(){return false;};return a;});
