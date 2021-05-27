sap.ui.define(["sap/ovp/cards/v4/generic/Card.controller", "sap/ovp/cards/v4/charts/VizAnnotationManager",
    "sap/viz/ui5/data/FlattenedDataset", "sap/ovp/cards/OVPCardAsAPIUtils", "sap/ovp/app/resources", "sap/base/util/each", "sap/ovp/cards/ovpLogger",  "sap/ovp/cards/Filterhelper", "sap/ui/model/FilterOperator"],
    function (CardController, VizAnnotationManager, FlattenedDataset, OVPCardAsAPIUtils, OvpResources, each, ovpLogger, Filterhelper, FilterOperator) {
        "use strict";
        var oLogger = new ovpLogger("OVP.v4.analytical.analyticalChart");
        return CardController.extend("sap.ovp.cards.charts.v4.analytical.analyticalChart", {
            onInit: function () {
                //The base controller lifecycle methods are not called by default, so they have to be called
                //Take reference from function mixinControllerDefinition in sap/ui/core/mvc/Controller.js
                CardController.prototype.onInit.apply(this, arguments);
                var that = this;
                this.eventhandler = function (channelid, event, filters) {
                    if (that.getView().getModel().getMetaModel().getData) {
                        var metaData = that.getView().getModel().getMetaModel().getData();
                        var entityTypeKey = that.getView().getModel('ovpCardProperties').getData().entityType.$Type;
                        var relfilters = Filterhelper._getEntityRelevantFilters(metaData[entityTypeKey],filters);
                        relfilters = Filterhelper.mergeFilters(relfilters, that.selectionVaraintFilter);
                        var cardBinding = that.getCardItemsBinding();
                        try {
                            if (relfilters && relfilters.aFilters) {
                                getFilterParams(relfilters.aFilters[0].aFilters, cardBinding).then(function(filterParameters) {
                                    filterParameters = filterParameters.join(" and ");
                                    var aggregateParams = cardBinding.mParameters.$apply.split("/").length > 1 ? that.getCardItemsBinding().mParameters.$apply.split("/")[1] : that.getCardItemsBinding().mParameters.$apply.split("/")[0];
                                    cardBinding.mParameters.$apply = "filter(" + filterParameters + ")/" + aggregateParams;
                                    cardBinding.setAggregation();
                                }).catch(function(err) {
                                    oLogger.error(err);
                                });
                            } else {
                                cardBinding.mParameters.$apply = cardBinding.mParameters.$apply.split("/")[1];
                                cardBinding.setAggregation();
                            }
                            if (that.getKPIBinding()) {
                                that.getKPIBinding().filter(relfilters);
                            }
                        } catch (err) {
                            oLogger.error(err);
                        }
                    }
                };
                this.GloabalEventBus = sap.ui.getCore().getEventBus();
                if (this.oCardComponentData && this.oCardComponentData.mainComponent) {
                this.GloabalEventBus.subscribe(
                    "OVPGlobalfilter",
                    "OVPGlobalFilterSeacrhfired",
                    that.eventhandler
                  );
                }
                VizAnnotationManager.formatChartAxes();

                function getFilterParams(filters, cardBinding) {
                    var oMetaModel = cardBinding.oModel.getMetaModel();
                    var oMetaContext = oMetaModel.getMetaContext(cardBinding.oModel.resolve(cardBinding.sPath, cardBinding.oContext));
                    return Promise.all(filters.map(function(filter) {
                        var filterString;
                        if (filters.length > 1) {
                            filterString = getSingleFilter(filter.aFilters[0], oMetaModel, oMetaContext);
                        } else {
                            filterString = getSingleFilter(filter, oMetaModel, oMetaContext);
                        }
                        return filterString;
                    }));
                }

                function getSingleFilter(oFilter,  oMetaModel, oMetaContext) {
                    var sResolvedPath = oMetaModel.resolve(oFilter.sPath, oMetaContext);
                    return oMetaModel.fetchObject(sResolvedPath).then(function(value) {
                        var sEdmType = value.$Type;
                        var sFilter, sFilterPath, bToLower, sValue;
                        function setCase(sText) {
                            return bToLower ? "tolower(" + sText + ")" : sText;
                        }

                        bToLower = sEdmType === "Edm.String" && oFilter.bCaseSensitive === false;
                        sFilterPath = setCase(decodeURIComponent(oFilter.sPath));
                        sValue = setCase(Filterhelper.formatLiteral(oFilter.oValue1, sEdmType));

                        switch (oFilter.sOperator) {
                            case FilterOperator.BT :
                                sFilter = sFilterPath + " ge " + sValue + " and " + sFilterPath + " le "
                                    + setCase(Filterhelper.formatLiteral(oFilter.oValue2, sEdmType));
                                break;
                            case FilterOperator.NB :
                                sFilter = wrap(sFilterPath + " lt " + sValue + " or " + sFilterPath + " gt "
                                    + setCase(Filterhelper.formatLiteral(oFilter.oValue2, sEdmType)));
                                break;
                            case FilterOperator.EQ :
                            case FilterOperator.GE :
                            case FilterOperator.GT :
                            case FilterOperator.LE :
                            case FilterOperator.LT :
                            case FilterOperator.NE :
                                sFilter = sFilterPath + " " + oFilter.sOperator.toLowerCase() + " " + sValue;
                                break;
                            case FilterOperator.Contains :
                            case FilterOperator.EndsWith :
                            case FilterOperator.NotContains :
                            case FilterOperator.NotEndsWith :
                            case FilterOperator.NotStartsWith :
                            case FilterOperator.StartsWith :
                                sFilter = oFilter.sOperator.toLowerCase().replace("not", "not ")
                                    + "(" + sFilterPath + "," + sValue + ")";
                                break;
                            default :
                                throw new Error("Unsupported operator: " + oFilter.sOperator);
                        }
                        return sFilter;
                    });
                }
                function wrap(sFilter) {
                    return sFilter;
                }
//				this.bFlag = true;
            },
            onBeforeRendering: function () {
                if (this.bCardProcessed) {
                    return;
                }
                VizAnnotationManager.validateCardConfiguration(this);
                var vizFrame = this.getView().byId("analyticalChart");
                var oCompData = this.getOwnerComponent().getComponentData();
                if (vizFrame) {
                    vizFrame.setHeight("21rem");
                }
                if (this.getCardPropertiesModel().getProperty("/layoutDetail") === "resizable" && oCompData && oCompData.appComponent) {
                    var oDashboardLayoutUtil = oCompData.appComponent.getDashboardLayoutUtil();
                    var oCard = oDashboardLayoutUtil.dashboardLayoutModel.getCardById(oCompData.cardId);
                    if (oCard.dashboardLayout.autoSpan && vizFrame) {
                        vizFrame.setHeight("21rem");
                    }
                }
//		    var bubbleText = this.getView().byId("bubbleText");
//			var chartTitle = this.getView().byId("ovpCT");
                var vbLayout = this.getView().byId("vbLayout");
//			var bubbleSizeText = sap.ui.getCore().getLibraryResourceBundle("sap.ovp").getText("BUBBLESIZE");
                var navigation;

                var isVizPropSet = false;

                var oDataSet = new FlattenedDataset({
                    data: {
                        path: "/"
                    }
                });

                this.isVizPropSet = isVizPropSet;
                this.oDataSet = oDataSet;
                this.vizFrame = vizFrame;
                this.vbLayout = vbLayout;
                /*var navigation = vizFrame.getModel('ovpCardProperties').getProperty("/navigation");
                 if (navigation == "chartNav") {
                 vizFrame.attachBrowserEvent("click", this.onHeaderClick.bind(this));
                 } else {
                 sap.ovp.cards.charts.VizAnnotationManager.getSelectedDataPoint(vizFrame, this);
                 }*/
                if (!vizFrame) {
                    oLogger.error(VizAnnotationManager.constants.ERROR_NO_CHART +
                    ": (" + this.getView().getId() + ")");
                } else {
                    this.vbLayout.setBusy(true);
                    navigation = vizFrame.getModel('ovpCardProperties').getProperty("/navigation");
                    //FIORITECHP1-6021 - Allow Disabling of Navigation from Graph
                    if (navigation === undefined || navigation == "datapointNav" || navigation != "headerNav") {
                        VizAnnotationManager.getSelectedDataPoint(vizFrame, this);
                    }
                    vizFrame.destroyDataset();
//				vizFrame.addEventDelegate(this.busyDelegate, vizFrame);
//				var handler = vizFrame.getParent();
//				handler.setBusy(true);
//				sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes(vizFrame,handler,chartTitle);
//				if (bubbleText != undefined) {
//					var feeds = vizFrame.getFeeds();
//					jQuery.each(feeds,function(i,v){
//						if (feeds[i].getUid() == "bubbleWidth") {
//							bubbleText.setText(bubbleSizeText + " " + feeds[i].getValues());
//						}
//					});
//				}
//				sap.ovp.cards.charts.VizAnnotationManager.hideDateTimeAxis(vizFrame);
                    var binding = vizFrame.getParent().getBinding("data");

                    this._handleKPIHeader();

                    if (binding && binding.getPath()) {
                        binding.attachDataReceived(this.onDataReceived.bind(this));
                        binding.attachDataRequested(this.onDataRequested.bind(this));
                    } else {
                        var noDataDiv = sap.ui.xmlfragment("sap.ovp.cards.charts.generic.noData");
                        var cardContainer = this.getCardContentContainer();
                        cardContainer.removeAllItems();
                        cardContainer.addItem(noDataDiv);
                    }

                    vizFrame.addEventDelegate({
                        onmouseover: function () {
                            var vizTooltip = vizFrame._oOvpVizFrameTooltip;
                            if (vizTooltip) {
                                vizTooltip._oPopup.close();
                            }
                        }
                    });
                }
                this.bCardProcessed = true;
            },

            onAfterRendering: function () {
                CardController.prototype.onAfterRendering.apply(this, arguments);
                if (!OVPCardAsAPIUtils.checkIfAPIIsUsed(this) && this.getCardPropertiesModel().getProperty("/layoutDetail") === "resizable") {
                    var oCard = this.oDashboardLayoutUtil.dashboardLayoutModel.getCardById(this.cardId);
                    var sCardId = this.oDashboardLayoutUtil.getCardDomId(this.cardId);
                    var element = document.getElementById(sCardId);
                    var iHeaderHeight = this.getHeaderHeight();
                    if (!oCard.dashboardLayout.autoSpan) {
                        if (element){
                            var ovpWrapper = element.getElementsByClassName('sapOvpWrapper')[0];
                            if (ovpWrapper) {
                                ovpWrapper.style.height = oCard.dashboardLayout.rowSpan * this.oDashboardLayoutUtil.ROW_HEIGHT_PX + 2 - (iHeaderHeight + 2 * this.oDashboardLayoutUtil.CARD_BORDER_PX) + "px";
                            }
                        }
                    }
                    if (oCard.dashboardLayout.showOnlyHeader) {
                        element.classList.add("sapOvpMinHeightContainer");
                    }
                    var vizCard = this.getView().byId("analyticalChart");
                    if (vizCard) {
                        vizCard.setHeight(this._calculateVizFrameHeight() + "px");
                    }
                }
                if (!OVPCardAsAPIUtils.checkIfAPIIsUsed(this)) {
                    var oCardPropertiesModel = this.getCardPropertiesModel();
                    var cardmanifestModel = this.getOwnerComponent().getModel("ui").getData().cards;
                    var relfilters = [];
                    if (this.getMetaModel().getData) {
                        var entityType = this.getMetaModel().getData()[this.getEntitySet().$Type];
                        this.selectionVaraintFilter = Filterhelper.getSelectionVariantFilters(cardmanifestModel, oCardPropertiesModel, this.getEntityType());
                    }
                    if (this.oCardComponentData.mainComponent.getGlobalFilter()) {
                        relfilters = Filterhelper._getEntityRelevantFilters(entityType,this.oCardComponentData.mainComponent.oGlobalFilter.getFilters());
                    }
                    relfilters = Filterhelper.mergeFilters(relfilters, this.selectionVaraintFilter);
                    if (this.getCardItemsBinding()) {
                        this.getCardItemsBinding().filter(relfilters);
                    }
                    if (this.getKPIBinding()) {
                        this.getKPIBinding().filter(relfilters);
                    }
                }
            },

            onDataReceived: function (oEvent) {
                var that = this;
                var vizFrame = this.getView().byId("analyticalChart");
                var bubbleText = this.getView().byId("bubbleText");
                var chartTitle = this.getView().byId("ovpCT");
                var bubbleSizeText = OvpResources.getText("BUBBLESIZE");
                var entityType = that.getMetaModel().getData()["$Annotations"];
                this.oDataSet.bindData("analyticalmodel>/", "");
                vizFrame.setDataset(this.oDataSet);

                var handler = vizFrame.getParent();

                if (!this.isVizPropSet) {

                    VizAnnotationManager.buildVizAttributes(vizFrame, handler, chartTitle, this);
                    this.isVizPropSet = true;

                    if (bubbleText != undefined) {
                        var feeds = vizFrame.getFeeds();
                        each(feeds, function (i, v) {
                            if (feeds[i].getUid() == "bubbleWidth") {
                                bubbleText.setText(bubbleSizeText + " " + feeds[i].getValues());
                            }
                        });
                    }
                    VizAnnotationManager.hideDateTimeAxis(vizFrame);
                }
                if (this.getCardPropertiesModel() && this.getCardPropertiesModel().getData() &&
                        this.getCardPropertiesModel().getData().colorPalette && (vizFrame.getVizType() === "stacked_column")) {
                    var allDims = vizFrame.getDataset().getDimensions(),
                        vfFeed = vizFrame.getFeeds(),
                        vfFeedColorName, dim;
                    for (var m = 0; m < vfFeed.length; m++) {
                        if (vfFeed[m].getUid() === "color") {
                            vfFeedColorName = vfFeed[m].getValues()[0];
                            break;
                        }
                    }
                    for (var n = 0; n < allDims.length; n++) {
                        if (allDims[n].getName() === vfFeedColorName) {
                            dim = allDims[n];
                            break;
                        }
                    }
                    if (vfFeedColorName && dim) {
                        var sorter = {};
                        sorter["bDescending"] = true;
                        dim.setSorter(sorter);
                    }
                }
                var chartScaleTitle = this.getView().byId("ovpUoMTitle");
                var vizData = oEvent ? oEvent.getSource().getCurrentContexts().map( function (context) {
                    return context.getObject();
                }) : null;
                //FIORITECHP1-4935Reversal of Scale factor in Chart and Chart title.
                VizAnnotationManager.setChartUoMTitle(vizFrame, vizData, chartScaleTitle, entityType);
                if (this.bFlag == true) {
//			vizFrame.addEventDelegate(this.freeDelegate, vizFrame);
                    this.bFlag = false;
                    this.vbLayout.setBusy(false);
                } else {
                    setTimeout(function () {
                        that.vbLayout.setBusy(false);
                    }, 0);
                }
                VizAnnotationManager.checkNoData(oEvent, this.getCardContentContainer(), vizFrame);
            },
            onDataRequested: function () {
//			var vizFrame = this.getView().byId("analyticalChart");
//			vizFrame.removeEventDelegate(this.freeDelegate, vizFrame);
                this.vbLayout.setBusy(true);
            },

            getCardItemsBinding: function () {
                var vizFrame = this.getView().byId("analyticalChart");
//            var handler = vizFrame.getParent();
                //vizFrame.setBusy(true); Commenting for the issue 1780015305
                // if (this.vizFrame.getParent().getBinding("data")){
                if (vizFrame && vizFrame.getDataset() && vizFrame.getDataset().getBinding("data") && this.vbLayout) {
                    this.vbLayout.setBusy(false);
                }

                if (vizFrame && vizFrame.getParent()) {
                    return vizFrame.getParent().getBinding("data");
                }

                return null;
            },

            /**
             * Method called upon when card is resized manually
             *
             * @method resizeCard
             * @param {Object} newCardLayout - new card layout after resize
             */
            resizeCard: function (newCardLayout) {
                var oCardPropertiesModel = this.getCardPropertiesModel();
                this.newCardLayout = newCardLayout;
                oCardPropertiesModel.setProperty("/cardLayout/rowSpan", newCardLayout.rowSpan);
                oCardPropertiesModel.setProperty("/cardLayout/colSpan", newCardLayout.colSpan);
                var oCardLayout = this.getCardPropertiesModel().getProperty("/cardLayout");
                var iHeaderHeight = this.getHeaderHeight();
                //Set the height of cardContentContainer
                var setCardContentContainerHeight = this.getView().getDomRef().querySelectorAll(".sapOvpWrapper");
                for (var i = 0; i < setCardContentContainerHeight.length; i++) {
                    setCardContentContainerHeight[i].style.height = (newCardLayout.rowSpan * oCardLayout.iRowHeightPx + 2) - (iHeaderHeight + 2 * oCardLayout.iCardBorderPx) + "px";
                }
                var vizCard = this.getView().byId("analyticalChart");
                var bubbleText = this.getView().byId("bubbleText");
                var chartTitle = this.getView().byId("ovpCT");

                if (vizCard) {
                    if (vizCard.getVizType() === 'timeseries_bubble' || vizCard.getVizType() === 'bubble') {
                        if (oCardLayout.colSpan > 1) {
                            bubbleText.setVisible(false);
                        } else {
                            bubbleText.setVisible(true);
                        }
                    }
                    vizCard.setHeight(this._calculateVizFrameHeight() + "px");
                }
                var oOvpContent = this.getView().byId('ovpCardContentContainer').getDomRef();
                if (oOvpContent) {
                    if (!newCardLayout.showOnlyHeader) {
                        oOvpContent.classList.remove('sapOvpContentHidden');
                    } else {
                        oOvpContent.classList.add('sapOvpContentHidden');
                    }
                }

                var bubbleSizeText = OvpResources.getText("BUBBLESIZE");
                this.oDataSet.bindData("analyticalmodel>/", "");
                this.vizFrame.setDataset(this.oDataSet);

                var handler = vizCard.getParent();
                if (!this.isVizPropSet) {
                    VizAnnotationManager.buildVizAttributes(vizCard, handler, chartTitle, this);
                    this.isVizPropSet = true;
                    if (bubbleText != undefined) {
                        var feeds = vizCard.getFeeds();
                        each(feeds, function (i, v) {
                            if (feeds[i].getUid() == "bubbleWidth") {
                                bubbleText.setText(bubbleSizeText + " " + feeds[i].getValues());
                            }
                        });
                    }
                    VizAnnotationManager.hideDateTimeAxis(vizCard);
                }
                VizAnnotationManager.reprioritizeContent(this.newCardLayout, vizCard);
            },

            /**
             * Method to calculate viz frame height
             *
             * @method _calculateVizFrameHeight
             * @return {Integer} iVizFrameHeight - Calculated height of the viz frame
             *                                      For Fixed layout - 480 px
             *                                      For resizable layout - Calculated according to the rowspan
             */
            _calculateVizFrameHeight: function () {
                var iVizFrameHeight;
                var oCard = this.oDashboardLayoutUtil.dashboardLayoutModel.getCardById(this.cardId);
                var vizCard = this.getView().byId("analyticalChart");
                //For resizable layout calculate height of vizframe
                if (oCard) {
                    var oGenCardCtrl = this.getView().getController();
                    var iDropDownHeight = this.getItemHeight(oGenCardCtrl, 'toolbar');
                    var iHeaderHeight = this.getHeaderHeight();
                    var iChartTextHeight = this.getView().byId("ovpCT") ? 24 : 0;
                    var iBubbleTextHeight = (vizCard.getVizType() === 'timeseries_bubble' || vizCard.getVizType() === "bubble") && oCard.dashboardLayout.colSpan === 1 ? 43 : 0;
                    //Viz container height = Card Container height + Border top of OvpCardContainer[1px--.sapOvpCardContentContainer] - (Header height + Card padding top and bottom{16px} +
                    //                          View switch toolbar height + Height of the Chart text(if present) + Height of bubble chart text +
                    //                          Padding top to  the card container[0.875rem -- .ovpChartTitleVBox] + Margin top to viz frame[1rem .ovpViz])
                    iVizFrameHeight = oCard.dashboardLayout.rowSpan * this.oDashboardLayoutUtil.ROW_HEIGHT_PX + 2 - ( iHeaderHeight + 2 * this.oDashboardLayoutUtil.CARD_BORDER_PX + iDropDownHeight + iChartTextHeight + iBubbleTextHeight + 30);
                }
                return iVizFrameHeight;
            },

            /**
             * Method to refresh the view after drag completion
             *
             * @method refreshCard
             */
            refreshCard: function () {
                this.getView().rerender();
            }
        });
    }
);
