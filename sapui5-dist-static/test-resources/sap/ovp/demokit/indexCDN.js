(function () {
    var locationURL = document.location;
    var oURL = new URL(locationURL);
    var searchParameters = new URLSearchParams(oURL.search);
    var versionQuery = searchParameters.has("version") && searchParameters.get("version");

    var sandboxScript;
    var bootstrapScript;
    if (versionQuery) {
        sandboxScript = `https://sapui5nightly${versionQuery}.int.sap.eu2.hana.ondemand.com/test-resources/sap/ushell/bootstrap/sandbox.js`;

        bootstrapScript = `https://sapui5nightly${versionQuery}.int.sap.eu2.hana.ondemand.com/resources/sap-ui-core.js`;
    }
    else {
        sandboxScript = `https://sapui5untested.int.sap.eu2.hana.ondemand.com/test-resources/sap/ushell/bootstrap/sandbox.js`;

        bootstrapScript = `https://sapui5untested.int.sap.eu2.hana.ondemand.com/resources/sap-ui-core.js`;
    }

    window['sap-ushell-config'] = {
        defaultRenderer: 'fiori2',
        bootstrapPlugins: {
            RuntimeAuthoringPlugin: {
                component: "sap.ushell.plugins.rta",
                config: {
                    validateAppVersion: false
                }
            }
        },
        renderers: {
            fiori2: {
                componentData: {
                    config: {
                        enableSearch: false,
                        enableUserDefaultParameters: true,
                        rootIntent: "Shell-home"
                    }
                }
            }
        },
        applications: {
            "procurement-overview": {
                title: 'Procurement Overview Page',
                description: 'Procurement Overview Page Demo App',
                applicationType: 'URL',
                url: "./apps/procurement/webapp",
                additionalInformation: 'SAPUI5.Component=procurement'
            },
            "sales-overview": {
                title: 'Sales(Analytical) Overview Page',
                description: 'Sales Overview Page Demo App',
                applicationType: 'URL',
                url: "./apps/sales/webapp",
                additionalInformation: 'SAPUI5.Component=sales'
            },
            "browse-books": {
                title: 'Browse Books',
                description: 'Bookshop(V4) Overview Page Demo App',
                applicationType: 'URL',
                url: "./apps/bookshop/webapp",
                additionalInformation: 'SAPUI5.Component=bookshop'
            },
        }
    };
    document.write(`<script src="${sandboxScript}"></script>`);
    document.write(`<script id="sap-ui-bootstrap" 
        src="${bootstrapScript}"
        data-sap-ui-libs="sap.m,sap.ushell,sap.ui.layout" 
        data-sap-ui-compatVersion="edge"
        data-sap-ui-theme="sap_fiori_3" 
        data-sap-ui-resourceroots='{
            "procurement": "../",
            "sales": "../",
            "bookshop": "../"
        }'
        data-sap-ui-frameOptions="allow">
    </script>`);
})();
