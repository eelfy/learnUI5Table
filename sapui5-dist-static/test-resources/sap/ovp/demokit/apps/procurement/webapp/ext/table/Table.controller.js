(function () {
    "use strict";
    /*global sap, jQuery */

    sap.ui.controller("procurement.ext.table.Table", {

        onInit: function () {
        },

        onColumnListItemPress: function (oEvent) {
            var aNavigationFields = this.getEntityNavigationEntries(oEvent.getSource().getBindingContext(), this.getCardPropertiesModel().getProperty("/annotationPath"));
            this.doNavigation(oEvent.getSource().getBindingContext(), aNavigationFields[0]);
        },

        /**
         * Gets the card items binding object for the count footer
         */
        getCardItemsBinding: function() {
            var table = this.getView().byId("ovpTable");
            return table.getBinding("items");
        },

        onAfterRendering: function () {
            var oTable = this.getView().byId("ovpTable");
            var aAggregation = oTable.getAggregation("columns");
            for (var iCount = 0; iCount < 3; iCount++) {
                if (aAggregation[iCount]) {
                    aAggregation[iCount].setStyleClass("sapTableColumnShow").setVisible(true);
                }
            }
        },

        /**
         * Gets the card items binding info
         */
        getCardItemBindingInfo: function () {
            var oList = this.getView().byId("ovpTable");
            return oList.getBindingInfo("items");
        },

        /**
         * Handles no of columns to be shown in table when view-switch happens
         *
         * @method addColumnInTable
         * @param {String} sCardId - Card Id
         * @param {Object} oCardResizeData- card resize properties
         */
        addColumnInTable: function ($card, oCardResizeData) {
            if (oCardResizeData.colSpan >= 1) {
                if (jQuery($card).find("tr").length != 0) {
                    var table = sap.ui.getCore().byId(jQuery($card).find(".sapMList").attr("id"));
                    var aggregation = table.getAggregation("columns");
                    var iColSpan = oCardResizeData.colSpan;
                    // No of columns to be shown calculated based upon colspan
                    var iIndicator = iColSpan + 1;
                    for (var i = 0; i < 6; i++) {
                        if (aggregation[i]) {
                            if (i <= iIndicator) {
                                //Show any particular column
                                aggregation[i].setStyleClass("sapTableColumnShow").setVisible(true);
                            } else {
                                //hide any particular column
                                aggregation[i].setStyleClass("sapTableColumnHide").setVisible(false);
                            }
                        }
                    }
                    table.rerender();
                }
            }
        },

        /**
         * Method called upon card resize
         *
         * @method resizeCard
         * @param {Object} newCardLayout- resize data of the card
         * @return {Object} $card - Jquery object of the card
         */
        resizeCard: function (newCardLayout, $card) {
            var iLineItemHeight, iAvailableSpace;
            var oCardPropertiesModel = this.getCardPropertiesModel();
            oCardPropertiesModel.setProperty("/cardLayout/rowSpan", newCardLayout.rowSpan);
            oCardPropertiesModel.setProperty("/cardLayout/colSpan", newCardLayout.colSpan);
            var oGenCardCtrl = this.getView().getController();
            try {
                var iHeaderHeight = this.getItemHeight(oGenCardCtrl, 'ovpCardHeader');
                var iFooterHeight = this.getItemHeight(oGenCardCtrl, 'ovpCountFooter');
                var iDropDownHeight = this.getItemHeight(oGenCardCtrl, 'toolbar');
                jQuery($card).find(".sapOvpWrapper").css({
                    height: ((newCardLayout.rowSpan * newCardLayout.iRowHeightPx) - (iHeaderHeight + iFooterHeight + 16)) + "px"
                });

                //For Table card Available space = Total Sapace - Table Header Height - Drop down height(If presenet)
                iLineItemHeight = this.getItemHeight(oGenCardCtrl, 'ovpTable', true);
                iAvailableSpace = this.getItemHeight(oGenCardCtrl, 'ovpCardContentContainer') - iLineItemHeight - iDropDownHeight;
                this.addColumnInTable($card, newCardLayout);

                if (iLineItemHeight) {
                    var iNoOfItems = Math.floor(iAvailableSpace / iLineItemHeight);
                    var iRemainingSpace = iAvailableSpace % iLineItemHeight;
                    var oBindingInfo = this.getCardItemBindingInfo();
                    //As footer has no border-top show border to the footer  only in resizable card layout
                    if (iRemainingSpace === 0 || iRemainingSpace > 4) {
                        var $footer = this.getView().byId("ovpCountFooter");
                        if ($footer) {
                            $footer.getDomRef().parentElement.classList.add("sapOvpFixedLayoutFooter");
                        }
                    }
                    //If the remaining space is less than 16px do not display the extra item
                    if (iLineItemHeight - iRemainingSpace <= 8) {
                        oBindingInfo.length = iNoOfItems + 1;
                    } else {
                        oBindingInfo.length = iNoOfItems;
                    }
                    var cardResizedToHeaderTable = false;
                    if (oBindingInfo.length <= 0) {
                        cardResizedToHeaderTable = true;
                        this._handleCountHeader(cardResizedToHeaderTable);
                        oBindingInfo.length = 1;
                    } else {
                       this._handleCountHeader(cardResizedToHeaderTable);
                    }
                    oCardPropertiesModel.setProperty("/cardLayout/noOfItems", iNoOfItems);
                    this.getCardItemsBinding().refresh();
                }
            } catch (error) {
                jQuery.sap.log.warning("OVP resize: " + this.cardId  + " catch " + error.toString());
            }
        }
    });
})();
