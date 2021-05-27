/*
 * ! SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/comp/library","sap/m/ComboBox","sap/m/ComboBoxRenderer","sap/ui/core/Core",'sap/ui/core/Item',"sap/m/inputUtils/ListHelpers"],function(l,C,a,c,I,L){"use strict";var d="00000000-0000-0000-0000-000000000000";function i(v){return v===d;}var C=C.extend("sap.ui.comp.smartfield.ComboBox",{metadata:{library:"sap.ui.comp",properties:{enteredValue:{type:"string",group:"Data",defaultValue:""}}},renderer:a});C.prototype.setEnteredValue=function(v){if(v){this.setSelectedKey(v);}var s=this.getSelectedItem();if(v&&!s&&!i(v)){this.setValue(v);}var e=s?this.getSelectedKey():this.getValue();this.setProperty("enteredValue",e);return this;};return C;});
