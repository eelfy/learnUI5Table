sap.ui.define([],function(){"use strict";return{setCreationMode:function(c){var u=this.base.getView().getBindingContext("ui");u.getModel().setProperty("createMode",c,u,true);if(this.getProgrammingModel()==="Sticky"){u.getModel().setProperty("createModeSticky",this._oTransactionHelper._bCreateMode,u,true);}}};});
