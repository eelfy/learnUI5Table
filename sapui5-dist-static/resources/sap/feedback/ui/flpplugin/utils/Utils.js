/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([],function(){"use strict";return{getCurrentApp:function(){return sap.ushell.Container.getService("AppLifeCycle").getCurrentApplication();},isUI5Application:function(c){return c.applicationType.toLowerCase()==="ui5";}};});
