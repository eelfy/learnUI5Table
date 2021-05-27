/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/base/Log"],function(L){"use strict";var e={CLEAN:0,PROCESSED:1,DIRTY:2};var c=e.CLEAN;return{setEditStateDirty:function(){c=e.DIRTY;},setEditStateProcessed:function(){c=e.PROCESSED;},resetEditState:function(){c=e.CLEAN;},isEditStateDirty:function(){return c!==e.CLEAN;},cleanProcessedEditState:function(){if(c===e.PROCESSED){c=e.CLEAN;}}};});
