// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

(function () {
    "use strict";

    sap.ui.controller("sap.ushell.demo.demoTiles.TestViewTile", {
        _handleTilePress: function (oTileControl) {
            if (typeof oTileControl.attachPress === 'function') {
                oTileControl.attachPress(function () {
                    if (typeof oTileControl.getTargetURL === 'function') {
                        var sTargetURL = oTileControl.getTargetURL();
                        if (sTargetURL) {
                            if (sTargetURL[0] === '#') {
                                hasher.setHash(sTargetURL);
                            } else {
                                sap.ui.require("sap/ushell/utils/WindowUtils", function (WindowUtils) {
                                    WindowUtils.openURL(sTargetURL, '_blank');
                                });
                            }
                        }
                    }
                });
            }
        }
    });
}());
