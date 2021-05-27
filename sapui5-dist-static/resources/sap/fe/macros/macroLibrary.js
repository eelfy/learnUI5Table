/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/core/util/XMLPreprocessor","sap/fe/macros/PhantomUtil","./Chart.metadata","./Field.metadata","./internal/Field.metadata","./FilterField.metadata","./FilterBar.metadata","./Form.metadata","./FormContainer.metadata","./MicroChart.metadata","./Table.metadata","./ValueHelp.metadata","./valuehelp/ValueHelpFilterBar.metadata","./Contact.metadata","./QuickViewForm.metadata","./fpm/InputField.metadata","./DraftIndicator.metadata"],function(X,P,C,F,I,a,b,c,d,M,T,V,e,f,Q,g,D){"use strict";var n="sap.fe.macros",h=[T,c,d,F,I,b,a,C,V,e,M,f,Q,g,D].map(function(E){if(typeof E==="string"){return{name:E,namespace:n,metadata:{metadataContexts:{},properties:{},events:{}}};}return E;});function r(){h.forEach(function(E){P.register(E);});}function i(){h.forEach(function(E){X.plugIn(null,E.namespace,E.name);});}r();return{register:r,deregister:i};});
