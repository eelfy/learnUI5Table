/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
    "../ChartDelegateNew",
    "../../../util/loadModules",
    "../../../library",
    "sap/ui/core/Core",
    "sap/m/text",
    "../ODataMetaModelUtil",
    "sap/ui/mdc/library",
    "sap/base/util/merge",
    'sap/ui/mdc/odata/v4/TypeUtil',
    "sap/ui/mdc/odata/v4/ODataMetaModelUtil",
    "sap/base/Log",
    'sap/ui/mdc/util/FilterUtil',
    'sap/ui/mdc/odata/v4/util/DelegateUtil',
    "sap/ui/mdc/ChartNew/ChartTypeButtonNew",
    "sap/ui/mdc/ChartNew/ItemNew",
    "sap/ui/model/Sorter",
    "sap/m/VBox"
], function (
    V4ChartDelegate,
    loadModules,
    library,
    Core,
    Text,
    MetaModelUtil,
    MDCLib,
    merge,
    TypeUtil,
    ODataMetaModelUtil,
    Log,
    FilterUtil,
    DelegateUtil,
    ChartTypeButton,
    MDCChartItem,
    Sorter,
    VBox
) {
    "use strict";
    /**
     * Delegate class for sap.ui.mdc.ChartNew and ODataV4.
     * Enables additional analytical capabilities.
     * <b>Note:</b> The class is experimental and the API/behavior is not finalized.
     *
     * @author SAP SE
     * @private
     * @ui5-restricted sap.fe
     * @MDC_PUBLIC_CANDIDATE
     * @since 1.88
     * @alias sap.ui.mdc.odata.v4.vizChart.ChartDelegateNew
     */
    var ChartDelegate = Object.assign({}, V4ChartDelegate);

    //var ChartLibrary;
    var Chart;
    var Dimension;
    //var HierarchyDimension;
    //var TimeDimension;
    var Measure;
    //var VizPopover;
    var VizTooltip;


    /**
     * Define a set of V4 specific functions which is specifically meant for the sap.chart.Chart control
     *
     * ...
     */

    /**
     * Provides the table's filter delegate that provides basic filter functionality such as adding filter fields.
     * <b>Note:</b> The functionality provided in this delegate should act as a subset of a FilterBarDelegate
     * to enable the table for inbuilt filtering.
     *
     * @example <caption>Example usage of <code>getFilterDelegate</code></caption>
     * oFilterDelegate = {
     * 		addItem: function() {
     * 			var oFilterFieldPromise = new Promise(...);
     * 			return oFilterFieldPromise;
     * 		}
     * }
     * @returns {Object} Object for the chart filter personalization
     * @public
     */
    ChartDelegate.getFilterDelegate = function () {
        return {
            /**
             *
             * @param {String} sPropertyName The property name
             * @param {Object} oMDCChart Instance of the chart TODO: Which one? MDC or inner?
             *
             * @returns {Promise} Promise that resolves with an instance of a <code>sap.ui.mdc.FilterField</code>.
             * For more information, see {@link sap.ui.mdc.AggregationBaseDelegate#addItem AggregationBaseDelegate}.
             */
            addItem: function (sPropertyName, oMDCChart) {
                return Promise.resolve(null);
            }
        };
    };

    /**
     * Toolbar relevant API (WIP)
     */
    ChartDelegate.zoomIn = function (iValue) {
        this._oInnerChart.zoom({direction: "in"});
    };

    ChartDelegate.zoomOut = function (iValue) {
        this._oInnerChart.zoom({direction: "out"});
    };


    /**
     * Gets the current zooming information for the inner chart
     */
    ChartDelegate.getZoomState = function () {

        if (this._oInnerChart) {
            return this._oInnerChart.getZoomInfo(this);
        }

    };
    /**
     ** Returns the event handler for chartSelectionDetails as an object
     * {
     *   "eventId": id of the selection event,
     *   "listener": reference to inner chart
     *   }
     *
     * @returns {object} event handler for chartSelectionDetails
     */
    ChartDelegate.getInnerChartSelectionHandler = function () {
        return {eventId: "_selectionDetails", listener: this._oInnerChart};
    };

    /**
     * Sets the visibility of the legend
     * This is called by the MDC Chart, do not call it directly!
     * @param {bool} bVisible true to show legend, false to hide
     *
     * @experimental
     * @private
     * @ui5-restricted Fiori Elements, sap.ui.mdc
     */
    ChartDelegate.setLegendVisible = function (bVisible) {
        if (this._oInnerChart) {
            this._oInnerChart.setVizProperties({
                'legend': {
                    'visible': bVisible
                },
                'sizeLegend': {
                    'visible': bVisible
                }
            });
        } else {
            Log.error("Could not set legend visibility since inner chart is not yet initialized!");
        }
    };

    ChartDelegate.getLegendState = function () {

    };

    ChartDelegate.getSortInfo = function () {

    };

    /**
     * Creates a Sorter for given Property
     * @param {sap.ui.mdc.ChartNew.ItemNew} oMDCItem the MDC Item to create a Sorter for
     * @param {object} oSortProperty the sorting information
     */
    ChartDelegate.getSorterForItem = function (oMDCItem, oSortProperty) {
        //TODO: Check wether we really need this method.
        //TODO: Right now it is needed since the name of a property does not include the aggregation method -> leads to an error when calling back-end
        //TODO: In old chart, aggragation method was included in name since every method had their own Item

        if (oMDCItem.getType() === "aggregatable") {
            return new Sorter(oMDCItem.getAggregationMethod() + oSortProperty.name, oSortProperty.descending);
        } else if (oMDCItem.getType() === "groupable") {
            return new Sorter(oSortProperty.name, oSortProperty.descending);
        }

    };

    /**
     * Inserts an MDC Chart Item (in case of sap.chart.Chart a Measure/Dimension) on the inner chart
     * This function is called by MDC Chart on a change of the <code>Items</code> aggregation
     * @param {sap.ui.mdc.chartNew-ItemNew} oMDCChartItem the MDC CHart Item to insert into the inner chart
     * @param {int} iIndex the index to insert into
     */
    ChartDelegate.insertItemToInnerChart = function (oMDCChartItem, iIndex) {
        //TODO: Create Measures/Dimension only when required?
        if (oMDCChartItem.getType() === "groupable") {
            this.createInnerDimension(oMDCChartItem);
            var aVisibleDimension = this._oInnerChart.getVisibleDimensions();
            aVisibleDimension.splice(iIndex, 0, oMDCChartItem.getName()); //Insert Item without deleting existing dimension
            this._oInnerChart.setVisibleDimensions(aVisibleDimension);
        } else if (oMDCChartItem.getType() === "aggregatable") {
            this.createInnerMeasure(oMDCChartItem);
            var aVisibleMeasures = this._oInnerChart.getVisibleMeasures();
            aVisibleMeasures.splice(iIndex, 0, oMDCChartItem.getAggregationMethod() + oMDCChartItem.getName());
            this._oInnerChart.setVisibleMeasures(aVisibleMeasures);
        }
    };

    /**
     * Removes an Item (in case of sap.chart.Chart a Measure/Dimension) from the inner chart
     * This function is called by MDC Chart on a change of the <code>Items</code> aggregation
     * @param {sap.ui.mdc.chartNew.ItemNew} oMDCChartItem The Item to remove from the inner chart
     */
    ChartDelegate.removeItemFromInnerChart = function (oMDCChartItem) {
        if (oMDCChartItem.getType() === "groupable" && this._oInnerChart.getVisibleDimensions().includes(oMDCChartItem.getName())) {
            var aNewVisibleDimensions = this._oInnerChart.getVisibleDimensions().filter(function (e) {
                return e !== oMDCChartItem.getName();
            });
            this._oInnerChart.setVisibleDimensions(aNewVisibleDimensions);

            this._oInnerChart.removeDimension(this._oInnerChart.getDimensionByName(oMDCChartItem.getName()));
        } else if (oMDCChartItem.getType() === "aggregatable" && this._oInnerChart.getVisibleMeasures().includes(oMDCChartItem.getAggregationMethod() + oMDCChartItem.getName())) {
            var aNewVisibleMeasures = this._oInnerChart.getVisibleMeasures().filter(function (e) {
                return e !== oMDCChartItem.getAggregationMethod() + oMDCChartItem.getName();
            });
            this._oInnerChart.setVisibleMeasures(aNewVisibleMeasures);

            this._oInnerChart.removeMeasure(this._oInnerChart.getMeasureByName(oMDCChartItem.getAggregationMethod() + oMDCChartItem.getName()));
        }
    };

    /**
     * Creates a new MDC Chart Item for given Property name and updates inner chart
     * (Does NOT add the MDC CHart Item to the Item aggregation of the MDC Chart)
     * Called by p13n
     * @param {string} sPropertyName the name of the property added
     * @param {sap.ui.mdc.ChartNew} oMDCChart reference to the MDC Chart to add the property to
     * @returns {Promise} Promise that resolves with new MDC Chart Item as parameter
     */
    ChartDelegate.addItem = function (sPropertyName, oMDCChart, mPropertyBag) {
        if (oMDCChart.getModel) {
            return Promise.resolve(this._createMDCChartItem(sPropertyName, oMDCChart));
        }
        return Promise.resolve(null);
    };

    ChartDelegate.removeItem = function (oProperty, oMDCChart) {
        return Promise.resolve(true);
    };

    ChartDelegate._createMDCChartItem = function (sPropertyName, oMDCChart) {
        return this.fetchProperties(oMDCChart).then(function (aProperties) {
            var oPropertyInfo = aProperties.find(function (oCurrentPropertyInfo) {
                return oCurrentPropertyInfo.name === sPropertyName;
            });

            if (!oPropertyInfo) {
                return null;
            }

            //TODO: Check for case: both aggegatable and groupable
            if (oPropertyInfo.groupable) {
                return new MDCChartItem(oMDCChart.getId() + "--GroupableItem--" + oPropertyInfo.name, {
                    name: oPropertyInfo.name,
                    label: oPropertyInfo.label,
                    type: "groupable"
                });
            }

            if (oPropertyInfo.aggregatable) {
                return new MDCChartItem(oMDCChart.getId() + "--AggregatableItem--" + oPropertyInfo.name, {
                    name: oPropertyInfo.name,
                    label: oPropertyInfo.label,
                    type: "aggregatable",
                    aggregationMethod: oPropertyInfo.recAggrMethod
                });
            }
        });
    };

    /**
     * Chart relevant API (WIP)
     */
    /**
     * Loads necessary libraries and creates inner chart
     * @returns {Promise} resolved when inner chart is ready
     */
    ChartDelegate.initializeInnerChart = function (oMDCChart) {
        this._oMDCChart = oMDCChart;

        return new Promise(function (resolve, reject) {

            this._loadChart().then(function (aModules) {

                this._oInnerStructure = new VBox();

                resolve(this._oInnerStructure); //Not applicable in this case
            }.bind(this));
        }.bind(this));
    };

    ChartDelegate._createInitialContentFromItems = function (aMDCItems) {
        var aVisibleDimensions = [];
        var aVisibleMeasures = [];
        aMDCItems.forEach(function (oItem) {
            switch (oItem.getType()) {
                case "groupable":
                    aVisibleDimensions.push(oItem.getName());
                    var oDimension = new Dimension({name: oItem.getName(), label: oItem.getLabel(), role: "category"});
                    this._oInnerChart.addDimension(oDimension);
                    break;
                case "aggregatable":
                    //TODO: Alias might be changing after backend request
                    aVisibleMeasures.push(oItem.getAggregationMethod() + oItem.getName());
                    var oMeasure = new Measure({
                        name: oItem.getAggregationMethod() + oItem.getName(),//"average" + oItem.getName(),
                        label: oItem.getLabel(),
                        role: "axis1",
                        analyticalInfo: {
                            propertyPath: oItem.getName(), //TODO: What to fill here without PropertyInfos? Consider property at MDC Item level
                            "with": oItem.getAggregationMethod()
                        }
                    });
                    this._oInnerChart.addMeasure(oMeasure);
                    break;
            }
        }.bind(this));

        this._oInnerChart.setVisibleDimensions(aVisibleDimensions);
        this._oInnerChart.setVisibleMeasures(aVisibleMeasures);
    };

    ChartDelegate.getInnerChart = function () {
        return this._oInnerChart;
    };

    /**
     * Returns the current chart type
     * {
     *  icon : string,
     *  text: string
     * }
     *
     * @returns {object} information about the current chart type
     * @throws exception if inner chart is not yet ready
     */
    ChartDelegate.getChartTypeInfo = function () {
        if (!this._oInnerChart) {
            throw 'inner chart is not bound';
        }

        var sType = this._oMDCChart.getChartType(),
            oMDCResourceBundle = Core.getLibraryResourceBundle("sap.ui.mdc");

        var mInfo = {
            icon: ChartTypeButton.mMatchingIcon[sType],
            text: oMDCResourceBundle.getText("chart.CHART_TYPE_TOOLTIP", [
                sType
            ])
        };

        return mInfo;
    };

    /**
     * Gets the available chart types for the current state of the inner chart
     *
     * @returns {array} Array containing the available chart types
     *
     * @experimental
     * @private
     * @ui5-restricted Fiori Elements
     */
    ChartDelegate.getAvailableChartTypes = function () {
        var aChartTypes = [];

        if (this._oInnerChart) {
            var aAvailableChartTypes = this._oInnerChart.getAvailableChartTypes().available;

            if (aChartTypes) {

                var oChartResourceBundle = Core.getLibraryResourceBundle("sap.chart.messages");

                for (var i = 0; i < aAvailableChartTypes.length; i++) {
                    var sType = aAvailableChartTypes[i].chart;
                    aChartTypes.push({
                        key: sType,
                        icon: ChartTypeButton.mMatchingIcon[sType],
                        text: oChartResourceBundle.getText("info/" + sType),
                        selected: (sType == this._oMDCChart.getChartType())
                    });
                }
            }
        }

        return aChartTypes;
    };

    //TODO: Check for setDrillStackInfo
    ChartDelegate.getDrillStackInfo = function () {

    };

    /**
     * Returns the current drill stack of the inner chart
     * The returned objects need at least a "label" and a "name" property
     * @returns {array} Array containing the drill stack
     */
    ChartDelegate.getDrillStack = function () {
        //TODO: Generify the return values here for other chart frameworks
        return this._oInnerChart.getDrillStack();
    };

    /**
     * This returns all sorted dimensions of an inner chart as property.
     * This is used to determine possible drill-down dimensions in the drill down popover of the MDC Chart
     * @returns {Promise} Promsie containing an array of Dimensions in a sorted manner
     */
    ChartDelegate.getSortedDimensions = function (oMDCChart) {
        return new Promise(function (resolve, reject) {
            this.fetchProperties(oMDCChart).then(function (aProperties) {

                var aDimensions = aProperties.filter(function (oItem) {
                    return oItem.groupable; //Groupable means "Dimension" for sap.chart.Chart
                });

                if (aDimensions) {
                    aDimensions.sort(function (a, b) {
                        if (a.label && b.label) {
                            return a.label.localeCompare(b.label);
                        }
                    });
                }

                resolve(aDimensions);
            });
        }.bind(this));
    };

    /**
     * Determines which MDC Items are Drillable and returns them
     * Used by breadcrumbs
     *
     * @param {sap.ui.mdc.ChartNew} oMDCChart the MDC Chart to get the Items from
     * @returns {array} Array of MDC Items which are drillable
     *
     */
    ChartDelegate.getDrillableItems = function (oMDCChart) {
        var aFilteredItems = oMDCChart.getItems().filter(function (oItem) {
            return oItem.getType() === "groupable";
        });
        return aFilteredItems;
    };

    /**
     * Sets the chart type of the inner chart
     * Is called by MDC Chart when <code>chartType</code> property is updated
     * @param {string} sChartType the new chart type
     */
    ChartDelegate.setChartType = function (sChartType) {
        this._oInnerChart.setChartType(sChartType);
    };

    /**
     * Creates the inner dataset for the inner chart
     */
    ChartDelegate.createInnerChartContent = function (oMDCChart, fnCallbackDataLoaded) {

        //Create content based on propertyInfos and MDCChart items
        //var oPropertyHelper = oMDCChart.getPropertyHelper();
        //var aGroupableProperties = oPropertyHelper.getAllGroupableProperties();
        //var aAggregatableProperties = oPropertyHelper.getAllAggregatableProperties();

        //create inner instances for aggregations
        //this.createInnerDimensions(aGroupableProperties);
        //this.createInnerMeasures(aAggregatableProperties, oPropertyHelper);
        //rebind after everything is ready

        this._oInnerChart = new Chart({
            id: oMDCChart.getId() + "--innerChart",
            chartType: "column",
            height: "330px",
            width: "100%",
            isAnalytical: true//,
        });
        //Create initial content during pre-processing
        this._createInitialContentFromItems(oMDCChart.getItems());

        //Since zoom information is not yet available for sap.chart.Chart after data load is complete, do it on renderComplete instead
        //This is a workaround which is hopefully not needed in other chart libraries
        this._oInnerChart.attachRenderComplete(function () {
            oMDCChart._updateToolbar();
        });
        this._oInnerStructure.removeAllItems();
        this._oInnerStructure.addItem(this._oInnerChart);

        this._fnDataLoadedCallback = fnCallbackDataLoaded;
        var oBindingInfo = this._getBindingInfo(oMDCChart);
        this.updateBindingInfo(oMDCChart, oBindingInfo); //Applies filters
        this.rebindChart(oMDCChart, oBindingInfo);
    };

    ChartDelegate.createInnerDimension = function (oMDCChartItem) {
        //TODO: Check for Hierachy and Time
        //TODO: Check for role annotation
        //var aVisibleDimensions = [];

        var oDimension = new Dimension({
            name: oMDCChartItem.getName(),
            role: "category",
            label: oMDCChartItem.getLabel()
        });
        this._oInnerChart.addDimension(oDimension);
        //add to visibleDimensions
        //TODO: Check this
        /*
        if (oProperty.isVisible()){
            aVisibleDimensions.push(oProperty.getName());
        }*/

        //this._oInnerChart.setVisibleDimensions(aVisibleDimensions);
    };

    ChartDelegate.createInnerMeasure = function (oMDChartItem) {
        //TODO: Check for Criticality, Coloring and so on
        //TODO: Check for role annotation
        //TODO: Where to get analyticalInfo from?
        //var aVisibleMeasures = [];
        var oMeasure = new Measure({
            name: oMDChartItem.getAggregationMethod() + oMDChartItem.getName(),
            role: "axis1", label: oMDChartItem.getLabel(),
            analyticalInfo: {
                propertyPath: oMDChartItem.getName(),
                "with": oMDChartItem.getAggregationMethod()
            }
        });
        this._oInnerChart.addMeasure(oMeasure);
        //add to visibleMeasures
        //TODO: Check this
        /*
        if (oProperty.isVisible()){
            aVisibleMeasures.push(oRawProperty.recAggrMethod + oProperty.getName());
        }*/

        //this._oInnerChart.setVisibleMeasures(aVisibleMeasures);
    };
    /**
     * Checks the binding of the table and rebinds it if required.
     *
     * @param {sap.ui.mdc.ChartNew} oMDCChart The MDC chart instance
     * @param {object} oBindingInfo The bindingInfo of the chart
     */
    ChartDelegate.rebindChart = function (oMDCChart, oBindingInfo) {
        if (oMDCChart && oBindingInfo && this._oInnerChart) {
            //TODO: bindData sap.chart.Chart specific and therefore needs to be changed to a general API.
            this._addBindingListener(oBindingInfo, "change", this._onDataLoadComplete.bind(this));

            //TODO: Clarify why sap.ui.model.odata.v4.ODataListBinding.destroy this.bHasAnalyticalInfo is false
            //TODO: on second call, as it leads to issues when changing layout options within the settings dialog.
            //TODO: bHasAnalyticalInfo of inner chart binding should be true and in fact is true initially.
            if (oBindingInfo.binding) {
                oBindingInfo.binding.bHasAnalyticalInfo = true;
            }


            this._oInnerChart.bindData(oBindingInfo);
            this._oBindingInfo = oBindingInfo;
            this._innerChartBound = true;
        }
    };

    ChartDelegate._getBindingInfo = function (oMDCChart) {

        if (this._oBindingInfo) {
            return this._oBindingInfo;
        }

        var oMetadataInfo = oMDCChart.getDelegate().payload;
        var sEntitySetPath = "/" + oMetadataInfo.collectionName;
        var oBindingInfo = {
            path: sEntitySetPath,
            parameters: {
                entitySet: oMetadataInfo.collectionName,
                useBatchRequests: true,
                provideGrandTotals: true,
                provideTotalResultSize: true,
                noPaging: true
            }
        };
        return oBindingInfo;
    };

    /**
     * Returns whether the inner chart is currently bound
     * @returns {bool} true if inner chart is bound; false if not
     */
    ChartDelegate.getInnerChartBound = function () {
        return !!this._innerChartBound;
    };

    /**
     * Updates the binding info with the relevant filters
     *
     * @param {Object} oMDCChart The MDC chart instance
     * @param {Object} oBindingInfo The binding info of the chart
     */
    ChartDelegate.updateBindingInfo = function (oMDCChart, oBindingInfo) {
        var oFilter = Core.byId(oMDCChart.getFilter());
        if (oFilter) {
            var mConditions = oFilter.getConditions();

            if (mConditions) {

                if (!oBindingInfo) {
                    oBindingInfo = {};
                }

                var aPropertiesMetadata = oFilter.getPropertyInfoSet ? oFilter.getPropertyInfoSet() : null;
                var aParameterNames = DelegateUtil.getParameterNames(oFilter);
                var oFilterInfo = FilterUtil.getFilterInfo(oFilter, mConditions, aPropertiesMetadata, aParameterNames);
                if (oFilterInfo) {
                    oBindingInfo.filters = oFilterInfo.filters;
                }

                var sParameterPath = DelegateUtil.getParametersInfo(oFilter, mConditions);
                if (sParameterPath) {
                    oBindingInfo.path = sParameterPath;
                }
            }

            // get the basic search
            var sSearchText = oFilter.getSearch();
            if (sSearchText) {

                if (!oBindingInfo) {
                    oBindingInfo = {};
                }

                if (!oBindingInfo.parameters) {
                    oBindingInfo.parameters = {};
                }
                // add basic search parameter as expected by v4.ODataListBinding
                oBindingInfo.parameters.$search = sSearchText;
            }
        }
    };

    /**
     * Adds an item to the inner chart (measure/dimension)
     */
    ChartDelegate.addInnerItem = function (sPropertyName, oMDCChart, mPropertyBag) {
        return Promise.resolve(null);
    };

    /**
     * Inserts an item to the inner chart (measure/dimension)
     */
    ChartDelegate.insertInnerItem = function (sPropertyName, oMDCChart, mPropertyBag) {

    };

    /**
     * Removes an item from the inner chart
     */
    ChartDelegate.removeInnerItem = function (sPropertyName, oMDCChart, mPropertyBag) {
        // return true within the Promise for default behaviour (e.g. continue to destroy the item)
        return Promise.resolve(true);
    };

    /**
     * Sets tooltips visible/invisible on inner chart
     * @param {bool}  bFlag true for visible, false for invisible
     */
    ChartDelegate.setChartTooltipVisibility = function (bFlag) {

        if (this._oInnerChart) {
            if (bFlag) {
                if (!this._vizTooltip) {
                    this._vizTooltip = new VizTooltip();
                }
                // Make this dynamic for setter calls
                this._vizTooltip.connect(this._oInnerChart.getVizUid());
            } else {
                if (this._vizTooltip) {
                    this._vizTooltip.destroy();
                }
            }
        } else {
            Log.error("Trying to set chart tooltip while inner chart was not yet initialized");
        }
    };

    /**
     *
     * Delegate specific part
     *
     */
    ChartDelegate._loadChart = function () {

        return new Promise(function (resolve) {
            var aNotLoadedModulePaths = ['sap/chart/library', 'sap/chart/Chart', 'sap/chart/data/Dimension', 'sap/chart/data/HierarchyDimension', 'sap/chart/data/TimeDimension', 'sap/chart/data/Measure', 'sap/viz/ui5/controls/VizTooltip'];

            function onModulesLoadedSuccess(fnChartLibrary, fnChart, fnDimension, fnHierarchyDimension, fnTimeDimension, fnMeasure, fnVizTooltip) {
                //ChartLibrary = fnChartLibrary;
                Chart = fnChart;
                Dimension = fnDimension;
                //HierarchyDimension = fnHierarchyDimension;
                //TimeDimension = fnTimeDimension;
                Measure = fnMeasure;
                VizTooltip = fnVizTooltip;

                resolve();
            }

            sap.ui.require(aNotLoadedModulePaths, onModulesLoadedSuccess);
        });

    };

    /**
     * Initializes a new table property helper for V4 analytics with the property extensions merged into the property infos.
     *
     * @param {sap.ui.mdc.Table} oTable Instance of the MDC table.
     * @returns {Promise<sap.ui.mdc.table.V4AnalyticsPropertyHelper>} A promise that resolves with the property helper.
     * @private
     * @ui5-restricted sap.ui.mdc
     */
    ChartDelegate.initPropertyHelper = function (oMDCChart) {
        // TODO: Do this in the DelegateMixin, or provide a function in the base delegate to merge properties and extensions
        return Promise.all([
            this.fetchProperties(oMDCChart),
            loadModules("sap/ui/mdc/odata/v4/ChartPropertyHelperNew")
        ]).then(function (aResult) {
            return Promise.all(aResult.concat(this.fetchPropertyExtensions(oMDCChart, aResult[0])));
        }.bind(this)).then(function (aResult) {
            var aProperties = aResult[0];
            var PropertyHelper = aResult[1][0];
            var mExtensions = aResult[2];
            var iMatchingExtensions = 0;
            var aPropertiesWithExtension = [];

            for (var i = 0; i < aProperties.length; i++) {
                aPropertiesWithExtension.push(Object.assign({}, aProperties[i], {
                    extension: mExtensions[aProperties[i].name] || {}
                }));

                if (aProperties[i].name in mExtensions) {
                    iMatchingExtensions++;
                }
            }

            if (iMatchingExtensions !== Object.keys(mExtensions).length) {
                throw new Error("At least one property extension does not point to an existing property");
            }

            return new PropertyHelper(aPropertiesWithExtension, oMDCChart);
        });
    };

    ChartDelegate.fetchProperties = function (oMDCChart) {
        var oModel = this._getModel(oMDCChart);
        var pCreatePropertyInfos;

        if (!oModel) {
            pCreatePropertyInfos = new Promise(function (resolve) {
                oMDCChart.attachModelContextChange({
                    resolver: resolve
                }, onModelContextChange, this);
            }.bind(this)).then(function (oModel) {
                return this._createPropertyInfos(oMDCChart, oModel);
            }.bind(this));
        } else {
            pCreatePropertyInfos = this._createPropertyInfos(oMDCChart, oModel);
        }

        return pCreatePropertyInfos.then(function (aProperties) {
            if (oMDCChart.data) {
                oMDCChart.data("$mdcChartPropertyInfo", aProperties);
            }
            return aProperties;
        });
    };

    function onModelContextChange(oEvent, oData) {
        var oMDCChart = oEvent.getSource();
        var oModel = this._getModel(oMDCChart);

        if (oModel) {
            oMDCChart.detachModelContextChange(onModelContextChange);
            oData.resolver(oModel);
        }
    }

    ChartDelegate._createPropertyInfos = function (oMDCChart, oModel) {
        var oMetadataInfo = oMDCChart.getDelegate().payload;
        var aProperties = [];
        var sEntitySetPath = "/" + oMetadataInfo.collectionName;
        var oMetaModel = oModel.getMetaModel();

        return Promise.all([
            oMetaModel.requestObject(sEntitySetPath + "/"), oMetaModel.requestObject(sEntitySetPath + "@")
        ]).then(function (aResults) {
            var oEntityType = aResults[0], mEntitySetAnnotations = aResults[1];
            var oSortRestrictions = mEntitySetAnnotations["@Org.OData.Capabilities.V1.SortRestrictions"] || {};
            var oSortRestrictionsInfo = ODataMetaModelUtil.getSortRestrictionsInfo(oSortRestrictions);
            var oFilterRestrictions = mEntitySetAnnotations["@Org.OData.Capabilities.V1.FilterRestrictions"];
            var oFilterRestrictionsInfo = ODataMetaModelUtil.getFilterRestrictionsInfo(oFilterRestrictions);

            for (var sKey in oEntityType) {
                var oObj = oEntityType[sKey];

                if (oObj && oObj.$kind === "Property") {
                    // ignore (as for now) all complex properties
                    // not clear if they might be nesting (complex in complex)
                    // not clear how they are represented in non-filterable annotation
                    // etc.
                    if (oObj.$isCollection) {
                        //Log.warning("Complex property with type " + oObj.$Type + " has been ignored");
                        continue;
                    }

                    var oPropertyAnnotations = oMetaModel.getObject(sEntitySetPath + "/" + sKey + "@");

                    //TODO: Check what we want to do with properties neither aggregatable nor groupable
                    //Right now: skip them, since we can't create a chart from it
                    if (!oPropertyAnnotations["@Org.OData.Aggregation.V1.Aggregatable"] && !oPropertyAnnotations["@Org.OData.Aggregation.V1.Groupable"]) {
                        continue;
                    }

                    aProperties.push({
                        name: sKey,
                        label: oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Label"] || sKey,
                        sortable: oSortRestrictionsInfo[sKey] ? oSortRestrictionsInfo[sKey].sortable : true,
                        filterable: oFilterRestrictionsInfo[sKey] ? oFilterRestrictionsInfo[sKey].filterable : true,
                        groupable: oPropertyAnnotations["@Org.OData.Aggregation.V1.Groupable"] || false,
                        aggregatable: oPropertyAnnotations["@Org.OData.Aggregation.V1.Aggregatable"] || false,
                        recAggrMethod: oPropertyAnnotations["@Org.OData.Aggregation.V1.RecommendedAggregationMethod"],
                        supAggrMethods: oPropertyAnnotations["@Org.OData.Aggregation.V1.SupportedAggregationMethods"],
                        maxConditions: ODataMetaModelUtil.isMultiValueFilterExpression(oFilterRestrictionsInfo.propertyInfo[sKey]) ? -1 : 1,
                        sortKey: oPropertyAnnotations["@Org.OData.Aggregation.V1.Aggregatable"] ? oPropertyAnnotations["@Org.OData.Aggregation.V1.RecommendedAggregationMethod"] + sKey : sKey,
                        kind: oPropertyAnnotations["@Org.OData.Aggregation.V1.Groupable"] ? "Groupable" : "Aggregatable" //Only needed for P13n Item Panel
                    });
                }
            }
            return aProperties;
        });
    };


    ChartDelegate._getModel = function (oTable) {
        var oMetadataInfo = oTable.getDelegate().payload;
        return oTable.getModel(oMetadataInfo.model);
    };

    ChartDelegate._addBindingListener = function (oBindingInfo, sEventName, fHandler) {
        if (!oBindingInfo.events) {
            oBindingInfo.events = {};
        }

        if (!oBindingInfo.events[sEventName]) {
            oBindingInfo.events[sEventName] = fHandler;
        } else {
            // Wrap the event handler of the other party to add our handler.
            var fOriginalHandler = oBindingInfo.events[sEventName];
            oBindingInfo.events[sEventName] = function () {
                fHandler.apply(this, arguments);
                fOriginalHandler.apply(this, arguments);
            };
        }
    };

    ChartDelegate._onDataLoadComplete = function (mEventParams) {
        if (mEventParams.mParameters.reason === "change" && !mEventParams.mParameters.detailedReason) {
            this._fnDataLoadedCallback.call();
        }
    };

    return ChartDelegate;
});