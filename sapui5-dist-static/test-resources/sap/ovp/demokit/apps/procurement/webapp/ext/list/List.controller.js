(function () {
    "use strict";
    /*global sap, jQuery */

    sap.ui.controller("procurement.ext.list.List", {
        counter: 0,
        arrayLength: 0,
        minMaxModel: {},
        onInit: function () {
            this.counter = 0;
            this.minMaxModel = new sap.ui.model.json.JSONModel();
            this.minMaxModel.setData({
                minValue: 1,
                maxValue: -1
            });
            this.getView().setModel(this.minMaxModel, "minMaxModel");
        },

        onAfterRendering: function () {

            var isImageCard = this.getCardPropertiesModel().oData.imageSupported;
            var densityStyle = this.getCardPropertiesModel().oData.densityStyle;
            if (isImageCard && isImageCard === "true") {

                var imageList = this.byId('ovpList');

                /**
                 * This function does some CSS changes after the card is rendered
                 */
                imageList.attachUpdateFinished(
                    function () {
                        var iL = this.byId('ovpList');
                        var items = iL.getItems();
                        var isIcon = false;
                        var cls = iL.getDomRef().getAttribute("class");

                        if (densityStyle === "cozy") {
                            cls = cls + " sapOvpListImageCozy";
                        } else {
                            cls = cls + " sapOvpListImageCompact";
                        }

                        iL.getDomRef().setAttribute("class", cls);

                        /**
                         * Looping through all elements in the displayed list to find out
                         * if it is icon or image type card,
                         * the size of the icon/image varies accordingly
                         */
                        items.forEach(
                            function (item) {
                                if (item.getIcon().indexOf("icon") != -1) {
                                    isIcon = true;
                                }
                            }
                        );

                        items.forEach(
                            function (item) {

                                var listItemRef = item.getDomRef();
                                var imgIcon = listItemRef.children[0].children[0];
                                var itemDescription = item.getDescription();
                                var icon = item.getIcon();
                                var tIcon = isIcon;
                                var title = item.getTitle();

                                var initials = title.split(' ').map(function (str) {
                                    return str ? str[0].toUpperCase() : "";
                                }).join('').substring(0, 2);

                                /**
                                 * Condition for card in which images and icons are present
                                 * we are checking if any list item is an image to set
                                 * appropriate CSS
                                 */
                                if (icon != "" && icon.indexOf("icon") == -1) {
                                    isIcon = false;
                                }

                                if (densityStyle === "cozy" && isIcon === false) {
                                    if (imgIcon) {
                                        var cls = imgIcon.getAttribute("class");
                                        cls = cls + " sapOvpImageCozy";
                                        imgIcon.setAttribute("class", cls);
                                    }
                                }

                                var itemStyle = "";
                                if (isIcon === true && itemDescription === "") {
                                    itemStyle = densityStyle === "compact" ? "sapOvpListWithIconNoDescCompact" : "sapOvpListWithIconNoDescCozy";
                                } else if (isIcon === false && itemDescription === "") {
                                    itemStyle = densityStyle === "compact" ? "sapOvpListWithImageNoDescCompact" : "sapOvpListWithImageNoDescCozy";
                                } else {
                                    itemStyle = densityStyle === "compact" ? "sapOvpListWithImageIconCompact" : "sapOvpListWithImageIconCozy";
                                }

                                item.addStyleClass(itemStyle);

                                if (icon === "" && listItemRef.children[0].id !== "ovpIconImagePlaceHolder") {
                                    var placeHolder = document.createElement('div');
                                    placeHolder.innerHTML = initials;
                                    placeHolder.setAttribute("id", "ovpIconImagePlaceHolder");
                                    placeHolder.className = isIcon === true ? "sapOvpIconPlaceHolder" : "sapOvpImagePlaceHolder";
                                    if (isIcon === false && densityStyle === "cozy") {
                                        placeHolder.className = placeHolder.className + " sapOvpImageCozy";
                                    }
                                    listItemRef.insertBefore(placeHolder, listItemRef.children[0]);
                                }
                                isIcon = tIcon;

                            }
                        );
                    }.bind(this));
            }
        },

        onListItemPress: function (oEvent) {
            var aNavigationFields = this.getEntityNavigationEntries(oEvent.getSource().getBindingContext(), this.getCardPropertiesModel().getProperty("/annotationPath"));
            this.doNavigation(oEvent.getSource().getBindingContext(), aNavigationFields[0]);
        },

            /**
             * This function loops through context values and gets
             * the Max & Min Value for the card in 'this'
             * context(ie different for different cards)
             * Requirement: In case of global filters applied context changes and Max and Min should also change
             * Drawback : Max and Min are calculated for each list Items again considering all items in context.
             * */
            _getMinMaxObjectFromContext: function (noOfItems) {
                this.counter++;
                var oEntityType = this.getEntityType(),
                    sAnnotationPath = this.getCardPropertiesModel().getProperty("/annotationPath"),
                    aRecords = oEntityType[sAnnotationPath],
                    context = this.getMetaModel().createBindingContext(oEntityType.$path + "/" + sAnnotationPath),
                    minMaxObject = {
                        minValue: 0,
                        maxValue: 0
                    };

                //Case 1:  In case of percentage
                if (AnnotationHelper.isFirstDataPointPercentageUnit(context, aRecords)) {
                    minMaxObject.minValue = 0;
                    minMaxObject.maxValue = 100;
                    return minMaxObject;
                }

                //Case 2: Otherwise
                var dataPointValue = AnnotationHelper.getFirstDataPointValue(context, aRecords),
                    barList = this.getView().byId("ovpList"),
                    listItems = barList.getBinding("items"),
                    oModel = this.getModel(),
                    itemsContextsArray = listItems.getCurrentContexts();
                for (var i = 0; noOfItems ? i < noOfItems : i < itemsContextsArray.length; i++) {
                    /*To get original value by going through relative paths in case of slash*/
                    var originalValue = oModel.getOriginalProperty(dataPointValue, itemsContextsArray[i]),
                        currentItemValue = parseFloat(originalValue, 10);
                    if (currentItemValue < minMaxObject.minValue) {
                        minMaxObject.minValue = currentItemValue;
                    } else if (currentItemValue > minMaxObject.maxValue) {
                        minMaxObject.maxValue = currentItemValue;
                    }
                }
                return minMaxObject;
            },

            /**
             *  this function
             *  1.updates both min and max values in 'this' context
             *  and
             *  2.then updates the model attached to that particular card
             *  3.then refreshes the model to affect the changes
             *  */
            _updateMinMaxModel: function (noOfItems) {
                var minMaxObject = this._getMinMaxObjectFromContext(noOfItems);
                this.minMaxModel.setData({
                    minValue: minMaxObject.minValue,
                    maxValue: minMaxObject.maxValue
                });
                this.minMaxModel.refresh();
                return minMaxObject;
            },

            /**
             * this function call update method and return the value.
             * */
            returnBarChartValue: function (value) {
                this._updateMinMaxModel();
                var iValue = parseFloat(value, 10);
                return iValue;
            },

        /**
         * Gets the card items binding object for the count footer
         */
        getCardItemsBinding: function () {
            var list = this.getView().byId("ovpList");
            return list.getBinding("items");
        },

        /**
         * Gets the card items binding info
         */
        getCardItemBindingInfo: function () {
            var oList = this.getView().byId("ovpList");
            return oList.getBindingInfo("items");
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
            try {
                var oGenCardCtrl = this.getView().getController();
                var iHeaderHeight = this.getItemHeight(oGenCardCtrl, 'ovpCardHeader');
                var iFooterHeight = this.getItemHeight(oGenCardCtrl, 'ovpCountFooter');
                var iDropDownHeight = this.getItemHeight(oGenCardCtrl, 'toolbar');
                //Set the card height to the resized height
                jQuery($card).find(".sapOvpWrapper").css({
                    height: ((newCardLayout.rowSpan * newCardLayout.iRowHeightPx) - (iHeaderHeight + iFooterHeight + 16)) + "px"
                });

                //For List card Available space = Total Sapace - Drop down height(If presenet)
                iLineItemHeight = this.getItemHeight(oGenCardCtrl, 'ovpList', true);
                iAvailableSpace = this.getItemHeight(oGenCardCtrl, 'ovpCardContentContainer') - iDropDownHeight;

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
                    var cardResizedToHeaderList = false;
                    if (oBindingInfo.length <= 0) {
                        cardResizedToHeaderList = true;
                        this._handleCountHeader(cardResizedToHeaderList);
                        oBindingInfo.length = 1;
                    } else {
                        this._handleCountHeader(cardResizedToHeaderList);
                    }
                    oCardPropertiesModel.setProperty("/cardLayout/noOfItems", iNoOfItems);
                    this.getCardItemsBinding().refresh();
                }
            } catch (error) {
                jQuery.sap.log.warning("OVP resize: " + this.cardId + " catch " + error.toString());
            }
        }

    });
})();
