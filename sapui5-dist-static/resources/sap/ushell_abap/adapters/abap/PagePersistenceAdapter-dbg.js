// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @fileOverview PagePersistenceAdapter for the ABAP platform.
 * @version 1.88.1
 */
sap.ui.define([
    "sap/base/util/ObjectPath",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/odata/ODataMetadata",
    "sap/ushell/resources"
], function (ObjectPath, ODataModel, ODataMetadata, resources) {
    "use strict";

    /**
     * Gets the service url from window["sap-ushell-config"].services.PagePersistence.
     *
     * If the metadata updates because there is a change in the backend, then the metadataString and the metadata JSON string must be updated.
     *
     * @returns {string} the service url.
     */
    function getServiceUrl () {
        var oServiceConfig = (window["sap-ushell-config"].services && window["sap-ushell-config"].services.PagePersistence) || {};
        return (ObjectPath.get("config.serviceUrl", oServiceConfig.adapter) || "").replace(/\/?$/, "/");
    }

    var fnOrig = ODataMetadata.prototype._loadMetadata;
    ODataMetadata.prototype._loadMetadata = function (sUrl, bSuppressEvents) {
        if (this.sUrl && this.sUrl.indexOf(getServiceUrl()) >= 0) {
            var mParams = {
                // eslint-disable-next-line
                metadataString: '<?xml version="1.0" encoding="utf-8"?><edmx:Edmx Version="1.0" xmlns:edmx="http://schemas.microsoft.com/ado/2007/06/edmx" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" xmlns:sap="http://www.sap.com/Protocols/SAPData"><edmx:DataServices m:DataServiceVersion="2.0"><Schema Namespace=".UI2.FDM_PAGE_REPOSITORY_SRV" xml:lang="en" sap:schema-version="1" xmlns="http://schemas.microsoft.com/ado/2008/09/edm"><EntityType Name="Page" sap:content-version="1"><Key><PropertyRef Name="id"/></Key><Property Name="id" Type="Edm.String" Nullable="false" MaxLength="35" sap:unicode="false" sap:label="Page ID" sap:updatable="false"/><Property Name="title" Type="Edm.String" MaxLength="100" sap:unicode="false" sap:label="Page Description"/><Property Name="description" Type="Edm.String" MaxLength="100" sap:unicode="false" sap:label="Page Description"/><NavigationProperty Name="sections" Relationship=".UI2.FDM_PAGE_REPOSITORY_SRV.Page_Section" FromRole="FromRole_Page_Section" ToRole="ToRole_Page_Section"/></EntityType><EntityType Name="Section" sap:content-version="1"><Key><PropertyRef Name="id"/></Key><Property Name="id" Type="Edm.String" Nullable="false" MaxLength="35" sap:unicode="false" sap:label="Page Section ID" sap:updatable="false"/><Property Name="title" Type="Edm.String" MaxLength="100" sap:unicode="false" sap:label="Page Description" sap:filterable="false"/><Property Name="sectionIndex" Type="Edm.Int16" Nullable="false" sap:unicode="false" sap:label="Page Section Index" sap:filterable="false"/><NavigationProperty Name="viz" Relationship=".UI2.FDM_PAGE_REPOSITORY_SRV.Section_Viz" FromRole="FromRole_Section_Viz" ToRole="ToRole_Section_Viz"/></EntityType><EntityType Name="Viz" sap:content-version="1"><Key><PropertyRef Name="id"/></Key><Property Name="displayFormatHint" Type="Edm.String" Nullable="false" sap:unicode="false" sap:label="Display Hint" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="id" Type="Edm.String" Nullable="false" MaxLength="35" sap:unicode="false" sap:label="Assignment Item ID" sap:updatable="false"/><Property Name="itemIndex" Type="Edm.Int16" Nullable="false" sap:unicode="false" sap:label="Assignment Index"/><Property Name="targetMappingId" Type="Edm.String" sap:unicode="false" sap:label="Target Mapping Compound String"/><Property Name="catalogTileId" Type="Edm.String" sap:unicode="false" sap:label="Catalog Tile Compound String"/></EntityType><Association Name="Page_Section" sap:content-version="1"><End Type=".UI2.FDM_PAGE_REPOSITORY_SRV.Page" Multiplicity="1" Role="FromRole_Page_Section"/><End Type=".UI2.FDM_PAGE_REPOSITORY_SRV.Section" Multiplicity="*" Role="ToRole_Page_Section"/></Association><Association Name="Section_Viz" sap:content-version="1"><End Type=".UI2.FDM_PAGE_REPOSITORY_SRV.Section" Multiplicity="1" Role="FromRole_Section_Viz"/><End Type=".UI2.FDM_PAGE_REPOSITORY_SRV.Viz" Multiplicity="*" Role="ToRole_Section_Viz"/></Association><EntityContainer Name="_UI2_FDM_PAGE_REPOSITORY_SRV_Entities" m:IsDefaultEntityContainer="true" sap:supported-formats="atom json xlsx"><EntitySet Name="pageSet" EntityType=".UI2.FDM_PAGE_REPOSITORY_SRV.Page" sap:searchable="true" sap:content-version="1"/><EntitySet Name="sectionSet" EntityType=".UI2.FDM_PAGE_REPOSITORY_SRV.Section" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:pageable="false" sap:content-version="1"/><EntitySet Name="vizSet" EntityType=".UI2.FDM_PAGE_REPOSITORY_SRV.Viz" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:pageable="false" sap:content-version="1"/><AssociationSet Name="Page_SectionSet" Association=".UI2.FDM_PAGE_REPOSITORY_SRV.Page_Section" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1"><End EntitySet="pageSet" Role="FromRole_Page_Section"/><End EntitySet="sectionSet" Role="ToRole_Page_Section"/></AssociationSet><AssociationSet Name="Section_VizSet" Association=".UI2.FDM_PAGE_REPOSITORY_SRV.Section_Viz" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1"><End EntitySet="sectionSet" Role="FromRole_Section_Viz"/><End EntitySet="vizSet" Role="ToRole_Section_Viz"/></AssociationSet></EntityContainer><atom:link rel="self" href="/sap/opu/odata/UI2/FDM_PAGE_RUNTIME_SRV/$metadata" xmlns:atom="http://www.w3.org/2005/Atom"/><atom:link rel="latest-version" href="/sap/opu/odata/UI2/FDM_PAGE_RUNTIME_SRV/$metadata" xmlns:atom="http://www.w3.org/2005/Atom"/></Schema></edmx:DataServices></edmx:Edmx>',
                lastModified: "Sat, 31 Oct 2020 12:09:53 GMT"
            };
            // eslint-disable-next-line
            this._handleLoaded(JSON.parse("{\"version\":\"1.0\",\"dataServices\":{\"dataServiceVersion\":\"2.0\",\"schema\":[{\"namespace\":\".UI2.FDM_PAGE_REPOSITORY_SRV\",\"entityType\":[{\"name\":\"Page\",\"key\":{\"propertyRef\":[{\"name\":\"id\"}]},\"property\":[{\"name\":\"id\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"35\",\"extensions\":[{\"name\":\"unicode\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Page ID\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"title\",\"type\":\"Edm.String\",\"maxLength\":\"100\",\"extensions\":[{\"name\":\"unicode\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Page Description\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"description\",\"type\":\"Edm.String\",\"maxLength\":\"100\",\"extensions\":[{\"name\":\"unicode\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Page Description\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]}],\"navigationProperty\":[{\"name\":\"sections\",\"relationship\":\".UI2.FDM_PAGE_REPOSITORY_SRV.Page_Section\",\"fromRole\":\"FromRole_Page_Section\",\"toRole\":\"ToRole_Page_Section\"}],\"extensions\":[{\"name\":\"content-version\",\"value\":\"1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"Section\",\"key\":{\"propertyRef\":[{\"name\":\"id\"}]},\"property\":[{\"name\":\"id\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"35\",\"extensions\":[{\"name\":\"unicode\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Page Section ID\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"title\",\"type\":\"Edm.String\",\"maxLength\":\"100\",\"extensions\":[{\"name\":\"unicode\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Page Description\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"sectionIndex\",\"type\":\"Edm.Int16\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"unicode\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Page Section Index\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]}],\"navigationProperty\":[{\"name\":\"viz\",\"relationship\":\".UI2.FDM_PAGE_REPOSITORY_SRV.Section_Viz\",\"fromRole\":\"FromRole_Section_Viz\",\"toRole\":\"ToRole_Section_Viz\"}],\"extensions\":[{\"name\":\"content-version\",\"value\":\"1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"Viz\",\"key\":{\"propertyRef\":[{\"name\":\"id\"}]},\"property\":[{\"name\":\"displayFormatHint\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"unicode\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Display Hint\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"sortable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"filterable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"id\",\"type\":\"Edm.String\",\"nullable\":\"false\",\"maxLength\":\"35\",\"extensions\":[{\"name\":\"unicode\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Assignment Item ID\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"itemIndex\",\"type\":\"Edm.Int16\",\"nullable\":\"false\",\"extensions\":[{\"name\":\"unicode\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Assignment Index\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"targetMappingId\",\"type\":\"Edm.String\",\"extensions\":[{\"name\":\"unicode\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Target Mapping Compound String\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"catalogTileId\",\"type\":\"Edm.String\",\"extensions\":[{\"name\":\"unicode\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"label\",\"value\":\"Catalog Tile Compound String\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]}],\"extensions\":[{\"name\":\"content-version\",\"value\":\"1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]}],\"association\":[{\"name\":\"Page_Section\",\"end\":[{\"type\":\".UI2.FDM_PAGE_REPOSITORY_SRV.Page\",\"multiplicity\":\"1\",\"role\":\"FromRole_Page_Section\"},{\"type\":\".UI2.FDM_PAGE_REPOSITORY_SRV.Section\",\"multiplicity\":\"*\",\"role\":\"ToRole_Page_Section\"}],\"extensions\":[{\"name\":\"content-version\",\"value\":\"1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"Section_Viz\",\"end\":[{\"type\":\".UI2.FDM_PAGE_REPOSITORY_SRV.Section\",\"multiplicity\":\"1\",\"role\":\"FromRole_Section_Viz\"},{\"type\":\".UI2.FDM_PAGE_REPOSITORY_SRV.Viz\",\"multiplicity\":\"*\",\"role\":\"ToRole_Section_Viz\"}],\"extensions\":[{\"name\":\"content-version\",\"value\":\"1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]}],\"entityContainer\":[{\"name\":\"_UI2_FDM_PAGE_REPOSITORY_SRV_Entities\",\"isDefaultEntityContainer\":\"true\",\"entitySet\":[{\"name\":\"pageSet\",\"entityType\":\".UI2.FDM_PAGE_REPOSITORY_SRV.Page\",\"extensions\":[{\"name\":\"searchable\",\"value\":\"true\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"content-version\",\"value\":\"1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"sectionSet\",\"entityType\":\".UI2.FDM_PAGE_REPOSITORY_SRV.Section\",\"extensions\":[{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"deletable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"pageable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"content-version\",\"value\":\"1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"vizSet\",\"entityType\":\".UI2.FDM_PAGE_REPOSITORY_SRV.Viz\",\"extensions\":[{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"deletable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"pageable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"content-version\",\"value\":\"1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]}],\"associationSet\":[{\"name\":\"Page_SectionSet\",\"association\":\".UI2.FDM_PAGE_REPOSITORY_SRV.Page_Section\",\"end\":[{\"entitySet\":\"pageSet\",\"role\":\"FromRole_Page_Section\"},{\"entitySet\":\"sectionSet\",\"role\":\"ToRole_Page_Section\"}],\"extensions\":[{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"deletable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"content-version\",\"value\":\"1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]},{\"name\":\"Section_VizSet\",\"association\":\".UI2.FDM_PAGE_REPOSITORY_SRV.Section_Viz\",\"end\":[{\"entitySet\":\"sectionSet\",\"role\":\"FromRole_Section_Viz\"},{\"entitySet\":\"vizSet\",\"role\":\"ToRole_Section_Viz\"}],\"extensions\":[{\"name\":\"creatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"updatable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"deletable\",\"value\":\"false\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"content-version\",\"value\":\"1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]}],\"extensions\":[{\"name\":\"supported-formats\",\"value\":\"atom json xlsx\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"}]}],\"extensions\":[{\"name\":\"lang\",\"value\":\"en\",\"namespace\":\"http://www.w3.org/XML/1998/namespace\"},{\"name\":\"schema-version\",\"value\":\"1\",\"namespace\":\"http://www.sap.com/Protocols/SAPData\"},{\"name\":\"link\",\"value\":null,\"attributes\":[{\"name\":\"rel\",\"value\":\"self\",\"namespace\":null},{\"name\":\"href\",\"value\":\"/sap/opu/odata/UI2/FDM_PAGE_RUNTIME_SRV/$metadata\",\"namespace\":null}],\"children\":[],\"namespace\":\"http://www.w3.org/2005/Atom\"},{\"name\":\"link\",\"value\":null,\"attributes\":[{\"name\":\"rel\",\"value\":\"latest-version\",\"namespace\":null},{\"name\":\"href\",\"value\":\"/sap/opu/odata/UI2/FDM_PAGE_RUNTIME_SRV/$metadata\",\"namespace\":null}],\"children\":[],\"namespace\":\"http://www.w3.org/2005/Atom\"}]}]}}"), mParams);
            ODataMetadata.prototype._loadMetadata = fnOrig; // Set back the original to save some execution time
            return new Promise(function (resolve, reject) {
                resolve(mParams);
            });
        }
        return fnOrig.call(this, sUrl, bSuppressEvents);
    };

    var oODataModel = new ODataModel({
        serviceUrl: getServiceUrl(),
        headers: {
            "sap-language": sap.ushell.Container.getUser().getLanguage(),
            "sap-client": sap.ushell.Container.getLogonSystem().getClient()
        },
        defaultCountMode: "None",
        skipMetadataAnnotationParsing: true,
        useBatch: false
    });

    // If we have the metdata cache backe in action, we will need to revert to the previous implementation
    var oMetaDataPromise = new Promise(function (resolve, reject) {
        resolve();
    });

    /**
     * Constructs a new instance of the PagePersistenceAdapter for the ABAP platform
     *
     * @constructor
     * @experimental Since 1.67.0
     * @private
     */
    var PagePersistenceAdapter = function () {
        this.S_COMPONENT_NAME = "sap.ushell_abap.adapters.abap.PagePersistenceAdapter";
    };

    /**
     * Returns the instance of ODataModel
     *
     * @returns {sap.ui.model.odata.v2.ODataModel} The OData model
     */
    PagePersistenceAdapter.prototype.getODataModel = function () {
        return oODataModel;
    };

    /**
     * Returns the instance of ODataModel
     *
     * @returns {sap.ui.model.odata.v2.ODataModel} The OData model
     */
    PagePersistenceAdapter.prototype.getMetadataPromise = function () {
        return oMetaDataPromise;
    };

    /**
     * Returns a page
     *
     * @param {string} pageId The page ID
     * @returns {Promise<object>} Resolves to a page
     *
     * @experimental Since 1.67.0
     * @private
     */
    PagePersistenceAdapter.prototype.getPage = function (pageId) {
        return this._readPage(pageId)
            .then(this._convertODataToReferencePage)
            .catch(this._rejectWithError.bind(this));
    };

    /**
     * Returns array of pages
     *
     * @param {string[]} aPageId The array of page ID
     * @returns {Promise<object[]>} Resolves to array of pages
     *
     * @experimental Since 1.75.0
     * @private
     */
    PagePersistenceAdapter.prototype.getPages = function (aPageId) {
        return this._readPages(aPageId)
            .then(function (page) {
                return page.results.map(this._convertODataToReferencePage);
            }.bind(this))
            .catch(this._rejectWithError.bind(this));
    };

    /**
     * Reads a page from the server
     *
     * @param {string} pageId The page ID
     * @returns {Promise<object>} Resolves to a page in the OData format
     *
     * @experimental Since 1.67.0
     * @private
     */
    PagePersistenceAdapter.prototype._readPage = function (pageId) {
        return this.getMetadataPromise().then(function () {
            return new Promise(function (resolve, reject) {
                this.getODataModel().read("/pageSet('" + encodeURIComponent(pageId) + "')", {
                    urlParameters: {
                        $expand: "sections/viz"
                    },
                    success: resolve,
                    error: reject
                });
            }.bind(this));
        }.bind(this));
    };

    /**
     * Reads pages from the server
     *
     * @param {string[]} aPageId The array of page ID
     * @returns {Promise<object[]>} Resolves to a array of page in the OData format
     *
     * @experimental Since 1.75.0
     * @private
     */
    PagePersistenceAdapter.prototype._readPages = function (aPageId) {
        return this.getMetadataPromise().then(function () {
            return new Promise(function (resolve, reject) {
                sap.ui.require(["sap/ui/model/Filter", "sap/ui/model/FilterOperator"], function (Filter, FilterOperator) {
                    var aPageFilters = [],
                        oPageFilter;
                    for (var i = 0; i < aPageId.length; i++) {
                        oPageFilter = new Filter({
                            path: "id",
                            operator: FilterOperator.EQ,
                            value1: aPageId[i],
                            and: false
                        });
                        aPageFilters.push(oPageFilter);
                    }
                    this.getODataModel().read("/pageSet", {
                        urlParameters: {
                            $expand: "sections/viz"
                        },
                        filters: aPageFilters,
                        success: resolve,
                        error: reject
                    });
                }.bind(this));
            }.bind(this));
        }.bind(this));
    };

    /**
     * Converts a reference page from the OData format to the FLP internal format.
     *
     * @param {object} page The page in the OData format.
     * @returns {object} The page in the FLP format.
     *
     * @experimental Since 1.67.0
     * @private
     */
    PagePersistenceAdapter.prototype._convertODataToReferencePage = function (page) {
        return {
            id: page.id,
            title: page.title,
            description: page.description,
            createdBy: page.createdBy,
            createdByFullname: page.createdByFullname || page.createdBy,
            modifiedBy: page.modifiedBy,
            modifiedByFullname: page.modifiedByFullname || page.modifiedBy,
            sections: page.sections.results.map(function (oSection) {
                return {
                    id: oSection.id,
                    sectionIndex: oSection.sectionIndex,
                    title: oSection.title,
                    viz: oSection.viz.results.map(function (oViz) {
                        return {
                            catalogTileId: oViz.catalogTileId,
                            id: oViz.id,
                            itemIndex: oViz.itemIndex,
                            targetMappingId: oViz.targetMappingId,
                            // rename both when our frontend names match backend names
                            vizId: oViz.catalogTileId, // our "vizId" should be renamed to "catalogTileId"
                            inboundPermanentKey: oViz.targetMappingId, // our "inboundPermanentKey" should be renamed to "targetMappingId"
                            displayFormatHint: oViz.displayFormatHint
                        };
                    }).sort(function (firstViz, secondViz) {
                        return firstViz.itemIndex - secondViz.itemIndex;
                    })
                };
            }).sort(function (firstSection, secondSection) {
                return firstSection.sectionIndex - secondSection.sectionIndex;
            })
        };
    };

    /**
     * @param {object} error The error object
     * @returns {Promise<object>} A rejected promise containing the error
     *
     * @experimental Since 1.67.0
     * @private
     */
    PagePersistenceAdapter.prototype._rejectWithError = function (error) {
        var oError = {
            component: this.S_COMPONENT_NAME,
            description: resources.i18n.getText("PagePersistenceAdapter.CannotLoadPage"),
            detail: error
        };
        return Promise.reject(oError);
    };

    return PagePersistenceAdapter;
}, true /* bExport */);
