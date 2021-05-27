// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["./common.constants"],function(c){"use strict";var s;var d=/[?&]sap-ui-debug=(true|x|X)(&|$)/.test(window.location.search);if(!d){try{s=window.localStorage.getItem(c.uiDebugKey);d=!!s&&/^(true|x|X)$/.test(s);}catch(e){}}return d;});
