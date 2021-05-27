sap.ui.define(
	[
        "sap/ui/core/util/MockServer"
	],
	function (MockServer) {
		"use strict";

        return {
            SUCCESS: 'Success',
            ERROR: 'Error',
            processFlowDefaultValues: {
                frontend: {
                    iconColor: "Neutral",
                    label:"",
                    text: ""
                },
                model: {
                    iconColor: "Neutral",
                    label:"",
                    text: ""
                },
                request: {
                    iconColor: "Neutral",
                    label:"",
                    text: ""
                },
                backend: {
                    iconColor: "Neutral",
                    label:"",
                    text: ""
                }
            },
            isPostOrMerge: function(sMethod){
                return sMethod === MockServer.HTTPMETHOD.MERGE || sMethod === MockServer.HTTPMETHOD.POST;
            }
        };
    }
);