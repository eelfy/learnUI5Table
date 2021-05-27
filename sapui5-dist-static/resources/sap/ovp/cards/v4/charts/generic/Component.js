sap.ui.define(["sap/ovp/cards/generic/Component","sap/ovp/cards/jUtils"],function(C,u){"use strict";return C.extend("sap.ovp.cards.charts.generic.Component",{metadata:{properties:{"headerExtensionFragment":{"type":"string","defaultValue":"sap.ovp.cards.generic.KPIHeader"},"selectionAnnotationPath":{"type":"string","defaultValue":"com.sap.vocabularies.UI.v1.SelectionVariant"},"chartAnnotationPath":{"type":"string","defaultValue":"com.sap.vocabularies.UI.v1.Chart"},"presentationAnnotationPath":{"type":"string","defaultValue":"com.sap.vocabularies.UI.v1.PresentationVariant"},"identificationAnnotationPath":{"type":"string","defaultValue":"com.sap.vocabularies.UI.v1.Identification"},"dataPointAnnotationPath":{"type":"string","defaultValue":"com.sap.vocabularies.UI.v1.DataPoint"}},version:"1.88.0",library:"sap.ovp",includes:[],dependencies:{libs:[],components:[]},config:{}},addTabindex:function(){u.setAttributeToMultipleElements(".tabindex0","tabindex",0);u.setAttributeToMultipleElements(".tabindex-1","tabindex",-1);},onAfterRendering:function(){this.addTabindex();}});});
