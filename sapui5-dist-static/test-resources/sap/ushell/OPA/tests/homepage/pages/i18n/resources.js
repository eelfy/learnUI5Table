// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define(["sap/ui/model/resource/ResourceModel"], function (
    ResourceModel
) {
    "use strict";
    return {
        i18n: new ResourceModel({
            bundleLocale: sap.ui.getCore().getConfiguration().getLanguage()
        }).getResourceBundle()
    };
}, /* bExport= */ true);
