/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/m/Button","sap/ui/dom/units/Rem"],function(B,R){"use strict";var S={init:function(){this.oBtn=new B().placeAt(sap.ui.getCore().getStaticAreaRef());this.oBtn.setVisible(false);},getButtonWidth:function(t){if(this.oBtn.getVisible()===false){this.oBtn.setVisible(true);}this.oBtn.setText(t);this.oBtn.addStyleClass("sapMListTblCell");this.oBtn.rerender();var n=R.fromPx(this.oBtn.getDomRef().scrollWidth);this.oBtn.setVisible(false);return n;},exit:function(){this.oBtn.destroy();}};return S;});
