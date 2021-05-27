/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

 // Provides helper sap.gantt.simple.GanttUtils
 sap.ui.define([
	"./BaseText",
	"./AggregationUtils",
	"./GanttUtils",
	"sap/ui/core/Core",
	"sap/gantt/library",
	"sap/ui/Device",
	"sap/gantt/misc/Utility"
], function (BaseText, AggregationUtils, GanttUtils, Core, library, Device, Utility) {
	"use strict";
	var iDefaultFontSize  = 12;

	var horizontalTextAlignment = library.simple.horizontalTextAlignment;

	var RenderUtils = {
		apiVersion: 2,    // enable in-place DOM patching

		// Define the render buffer to improve the overall horizontal scrolling performance
		RENDER_EXTEND_FACTOR: 0.382,

		getGanttRenderWidth: function(oGantt) {
			var iVisibleWidth = jQuery(document.getElementById(oGantt.getId() + "-gantt")).width();
			return iVisibleWidth * (1 + 2 * RenderUtils.RENDER_EXTEND_FACTOR);
		},

		renderAttributes : function(oRm, oElement, aAttribute) {
			var aPropertiesa = aAttribute.map(function(prop){
				var sPropertyGetter = prop.split("-").reduce(function(prefix, name) {
					return prefix + name.charAt(0).toUpperCase() + name.slice(1);
				}, "get");
				return {
					name: prop,
					value: oElement[sPropertyGetter]()
				};
			});

			aPropertiesa.forEach(function(oAttr) {
				if (oAttr.value || oAttr.value === 0) {
					if (oAttr.name === "style") {
						var aStyles = oAttr.value.split(";");
						aStyles.forEach(function(sStyle){
							sStyle = sStyle.trim();
							if (sStyle != "") {
								var aStyle = sStyle.split(/:(.*)/);
								if (aStyle[0] === "fill" && (aStyle[1].indexOf(" ") != -1)) {
									aStyle[1] = encodeURI(aStyle[1]);
								}
								oRm.style(aStyle[0], aStyle[1]);
							}
						});
					} else {
						oRm.attr(oAttr.name, oAttr.value);
					}
				}
			});
		},

		renderTooltip: function(oRm, oElement) {
			if (oElement.getTooltip()) {
				oRm.openStart("title").openEnd();
				oRm.text(oElement.getTooltip());
				oRm.close("title");
			}
		},

		/**
		 * Shape selection model is the single truth on shape selection and since its selection change event
		 * won't rerender all shapes, here we need to to reset selected property values based on the selection model.
		 *
		 * @param {sap.gantt.simple.GanttChartWithTable} oGantt Gantt chart instance
		 * @param {array} aSelectedShapeUid array of selected shape UIDs
		 * @param {array} aDeselectedShapeUid array of deselected shape UIDs
		 *
		 * @private
		 */
		updateShapeSelections: function(oGantt, aSelectedShapeUid, aDeselectedShapeUid) {
			if (oGantt._getResizeExtension == null) {
				// Gantt Extensions only available after GanttChart fully rendered. If the extension is not there
				// means the control haven't been rendered yet, thus skip update the selection outline
				return;
			}
			var oResizeExtension = oGantt._getResizeExtension();
			var sGanttId = oGantt.getId();

			GanttUtils.getShapesWithUid(sGanttId, aDeselectedShapeUid).forEach(function(oElement) {
				if (oElement) {
					if (oElement.isA("sap.gantt.simple.shapes.Shape")) {
						oElement.setSelected(false);
					} else {
						oElement.setProperty("selected", false, true);
					}
				}
			});

			oResizeExtension.clearAllOutline(sGanttId);

			GanttUtils.getShapesWithUid(sGanttId, aSelectedShapeUid).forEach(function(oElement) {
				if (oElement) {
					if (oElement.getProperty("selectable")) {
						if (oElement.isA("sap.gantt.simple.shapes.Shape")) {
							oElement.setSelected(true);
						} else {
							// it's possible that the shape element is scrolling outside of visible area
							oElement.setProperty("selected", true, true);
							oResizeExtension.toggleOutline(oElement);
						}
					}
					oGantt.getSelection().updateProperties(oElement.getShapeUid(), {
						draggable: oElement.getDraggable(),
						time: oElement.getTime(),
						endTime: oElement.getEndTime()
					});
				}
			});
		},
		getShapeElementByTarget : function(target) {
			return jQuery(this.getDraggableDOMElement(target)).control(0, true);
		},
		getDraggableDOMElement : function(target) {
			return jQuery(target).closest("[" + GanttUtils.SHAPE_ID_DATASET_KEY + "]").get(0);
		},
		/**
		 * Render the <text> SVG element for shapes which has title and showTitle properties
		 *
		 * If the shape is a Chevron, then need to consider it's headWith and tailWidth
		 *
		 * @param {sap.ui.core.RenderManager} oRm Render Manager
		 * @param {sap.gantt.simple.BaseShape} oElement shape instance
		 */
		renderElementTitle : function(oRm, oElement) {
			if (oElement.getShowTitle == null || !oElement.getShowTitle()) { return; }

			var sTitle = oElement.getTitle();
			if (sTitle) {
				/* eslint-disable no-unused-vars */
				var iHead = 0, iEllipseWidth = 0, iShapeWidth = 0;

				if (oElement.getWidth) {
					iEllipseWidth = oElement.getWidth();
					iShapeWidth = oElement.getWidth(); //Set the Width of the shape.
				}

				if (oElement.getHeadWidth) {
					iHead = oElement.getHeadWidth();
					iEllipseWidth -= iHead;
				}

				if (oElement.getTailWidth) {
					iEllipseWidth -= oElement.getTailWidth();
				}

				var iCornerPaddingPixel = 2 + iHead;
				var mTextSettings = {
					text: sTitle,
					fill: "#000",
					showEllipsis: true,
					truncateWidth: iEllipseWidth,
					textAnchor: oElement.getHorizontalTextAlignment().toLowerCase(),
					verticalTextAlignment: oElement.getVerticalTextAlignment()
				};
				var bRTL = Core.getConfiguration().getRTL();

				if (mTextSettings.textAnchor === horizontalTextAlignment.Start.toLowerCase()) {
					if (GanttUtils.iRTLModeInIE()) {
						mTextSettings.textAnchor = horizontalTextAlignment.End.toLowerCase();
					}
					mTextSettings.x = bRTL ? oElement.getX() + oElement.getWidth() - iCornerPaddingPixel : oElement.getX() + iCornerPaddingPixel;
					this.setVerticalAlignment(oElement, mTextSettings);
				} else if (mTextSettings.textAnchor === horizontalTextAlignment.End.toLowerCase()) {
					if (GanttUtils.iRTLModeInIE()) {
						mTextSettings.textAnchor = horizontalTextAlignment.Start.toLowerCase();
					}
					mTextSettings.x = bRTL ? oElement.getX() + iCornerPaddingPixel : oElement.getX() + oElement.getWidth() - iCornerPaddingPixel;
					this.setVerticalAlignment(oElement, mTextSettings);
				} else if (mTextSettings.textAnchor === horizontalTextAlignment.Middle.toLowerCase()) {
					mTextSettings.x = oElement.getX() + oElement.getWidth() / 2;
					this.setVerticalAlignment(oElement, mTextSettings);
				} else if (mTextSettings.textAnchor === horizontalTextAlignment.Ribbon.toLowerCase()) {
					bRTL ? this.renderRepetitiveTextRTL(oElement, mTextSettings, iCornerPaddingPixel) : this.renderRepetitiveTextLTR(oElement, mTextSettings, iCornerPaddingPixel);
					this.setVerticalAlignment(oElement, mTextSettings);
				}

				// add xBias and yBias to the x and y coordinates of the text
				var mBias = Utility.getShapeBias(oElement);
				mTextSettings.x = mTextSettings.x + mBias.x;
				mTextSettings.y = mTextSettings.y + mBias.y;

				var oTitle = new BaseText(mTextSettings).addStyleClass("sapGanttTextNoPointerEvents");
				oTitle.setProperty("childElement", true, true);
				oTitle.renderElement(oRm, oTitle);
			}
		},

		//Set y coordinate for the text to be displayed in LTR & RTL mode.
		setVerticalAlignment: function(oElement, mTextSettings) {
			if (mTextSettings.verticalTextAlignment === "Top") {
				mTextSettings.y = oElement.getY() + parseInt(oElement.getHeight(), 10) - iDefaultFontSize / 1.5;
			} else if (mTextSettings.verticalTextAlignment === "Bottom") {
				mTextSettings.y = oElement.getRowYCenter() + iDefaultFontSize / 1.5;
			} else {
				mTextSettings.y = oElement.getRowYCenter() + iDefaultFontSize / 2.5;
			}
		},

		//render text in Repetitive format for LTR mode
		renderRepetitiveTextLTR: function(oElement, mTextSettings, iCornerPaddingPixel) {
			mTextSettings.textAnchor = horizontalTextAlignment.Start.toLowerCase();
			if (GanttUtils.iRTLModeInIE()) {
				mTextSettings.textAnchor = horizontalTextAlignment.End.toLowerCase();
			}
			mTextSettings.x = oElement.getX() + iCornerPaddingPixel;
			var traversedWidthLTR = mTextSettings.x;
			while (traversedWidthLTR < oElement.getX() + oElement.getWidth()) {
				mTextSettings.text = mTextSettings.text + Array(10).fill('\xa0').join('')  + mTextSettings.text;
				traversedWidthLTR = oElement.getX() + mTextSettings.text.length;
			}
		},

		//render text in Repetitive format for RTL mode
		renderRepetitiveTextRTL: function(oElement, mTextSettings, iCornerPaddingPixel) {
			mTextSettings.textAnchor = horizontalTextAlignment.Start.toLowerCase();
			if (GanttUtils.iRTLModeInIE()) {
				mTextSettings.textAnchor = horizontalTextAlignment.End.toLowerCase();
			}
			mTextSettings.x = oElement.getX() + oElement.getWidth() - iCornerPaddingPixel;
			var traversedWidthRTL = mTextSettings.x;
			while (traversedWidthRTL > oElement.getX()) {
				mTextSettings.text = mTextSettings.text + Array(10).fill('\xa0').join('') + mTextSettings.text;
				traversedWidthRTL = traversedWidthRTL - mTextSettings.text.length;
			}
		},

		renderInlineShapes : function(oRm, oRowSetting, oGantt) {
			var sTopRowClassName = oRowSetting.getId() + "-top";
			var sRowClassName = oRowSetting.getId() + "-row";

			oRm.openStart("g", oRowSetting);
			oRm.class(sTopRowClassName);
			oRm.openEnd();
				oRm.openStart("g");
				// set default rowId to empty string to prevent assertion failure
				oRm.attr(GanttUtils.ROW_ID_DATASET_KEY, oRowSetting.getRowId() || "");
				oRm.class(sRowClassName);
				oRm.openEnd();

				this.renderMainRowAllShapes(oRm, oRowSetting, oGantt);

				oRm.close("g");
			oRm.close("g");
		},

		renderMainRowAllShapes: function(oRm, oRowSetting, oGantt){
			var aRowStates = oGantt.getSyncedControl().getRowStates();
			var mPosition = this.calcRowDomPosition(oRowSetting, aRowStates),
				iMainRowYCenter = mPosition.rowYCenter,
				iRowHeight = mPosition.rowHeight;

			var mAggregations = AggregationUtils.getNonLazyAggregations(oRowSetting);
			var aShapesInRow = Object.keys(mAggregations).filter(function(sName){
				// skip calendars due to special rendering order
				return sName !== "calendars" && sName !== "relationships";
			}).map(function(sName){ // eslint-disable-line
				// get all binding aggregation instances and default to empty array
				return oRowSetting.getAggregation(sName) || [];
			}.bind(oRowSetting));

			var sRowUid = oRowSetting.getRowUid(),
				oSelectionModel = oGantt.oSelection,
				oExpandModel    = oGantt._oExpandModel,
				oAxisTime       = oGantt.getAxisTime(),
				bHasExpandShape = oExpandModel.isRowExpanded(sRowUid);

			aShapesInRow.forEach(function(aShapes, iIndex){
				aShapes.forEach(function(oShape){

					if (oGantt.isShapeVisible(oShape)) {
						RenderUtils.renderMainRowShape(oRm, oShape, {
							expandModel: oExpandModel,
							selectionModel: oSelectionModel,
							axisTime: oAxisTime,
							rowSetting: oRowSetting,
							rowUid: sRowUid,
							rowExpanded: bHasExpandShape,
							mainRowYCenter: iMainRowYCenter,
							rowHeight: iRowHeight
						}, oGantt.getShowParentRowOnExpand());
					}
				});
			});
		},

		renderMainRowShape : function(oRm, oShape, mOption, bShowParentRow) {
			// passing the mOption to save unnecessary calculation because of it's always the same for the row
			this.setSpecialProperties(oShape, mOption);

			// render main row shap in RenderManager
			// oShape.renderElement(oRm, oShape, null);
			if ((Object.keys(mOption.expandModel.mExpanded).indexOf(mOption.rowUid) == -1  && !mOption.rowExpanded) || bShowParentRow){
				oShape.renderElement(oRm, oShape, null);
			}

			if (mOption.rowExpanded) {
				// just in case the main row shapes had expanded shapes
				this.renderExpandShapesIfNecessary(oRm, oShape, mOption, bShowParentRow);
			}
		},

		setSpecialProperties: function(oShape, mOption) {
			var oExpandModel = mOption.expandModel,
				sRowUid = mOption.rowUid,
				sShapeUid = mOption.rowSetting.getShapeUid(oShape),
				oTable = oShape.getParentRowSettings().getParent().getParent(),
				oGantt = oTable.getParent();

			if (!oShape._iBaseRowHeight) {
				oShape._iBaseRowHeight = mOption.rowHeight;
				var mAggregations = AggregationUtils.getNonLazyAggregations(oShape);
				Object.keys(mAggregations).filter(function(sName){
					var oAggregation = mAggregations[sName];
					if (oAggregation.appData !== null) {
						return oAggregation.appData.sapGanttOrder === 1;
					}
				}).map(function(sName) {
					if (sName === "utilizationBar" || sName === "utilizationLine") {
						oShape._iBaseRowHeight = oShape._iBaseRowHeight - 1;
					}
				});
			}
			oShape.mAxisTime = mOption.axisTime;
			oShape.setProperty("shapeUid", sShapeUid, true);
			if (oShape.getProperty("selectable")) {
				oShape.setProperty("selected", mOption.selectionModel.existed(sShapeUid), true);
			}
			oShape.setProperty("rowYCenter", oExpandModel.getRowYCenterByUid(sRowUid, mOption.mainRowYCenter, oShape.getScheme(), 0, oGantt), true);
		},

		/**
		 * Check whether the given d is valid.
		 *
		 * @param {string} sD attribute of this path
		 * @return {boolean} whether the given d is valid
		 */
		isValidD: function(sD) {
			return !!sD && sD.indexOf("NaN") === -1 && sD.indexOf("undefined") === -1 && sD.indexOf("null") === -1;
		},

		renderExpandShapesIfNecessary : function(oRm, oMainShape, mOption, bShowParentRow) {
			var oTable = oMainShape.getParentRowSettings().getParent().getParent(),
			    oGantt = oTable.getParent();

			var fnRenderExpandShape = function(aShapes) {
				if (!aShapes || aShapes.length === 0) {
					return;
				}
				var aExpandedShapes = aShapes;
				if (jQuery.isArray(aShapes) === false) {
					aExpandedShapes = [aShapes];
				}

				// Calculates the level of each shape and stores it as part of the shape.
				GanttUtils.calculateLevelForShapes(aExpandedShapes, "time", "endTime");

				aExpandedShapes.forEach(function(oShape, iIndex){
					if (oShape._level) {
						iIndex = oShape._level - 1;
					}
					var iRowYCenter = bShowParentRow ?  mOption.expandModel.getRowYCenterByUid(mOption.rowUid, null, oShape.getScheme(), iIndex, oGantt) : mOption.expandModel.getRowYCenterByUid(mOption.rowUid, null, oShape.getScheme(), iIndex, oGantt) - oMainShape._iBaseRowHeight;
					oShape.setProperty("rowYCenter", iRowYCenter, true);
					oShape._iBaseRowHeight = mOption.expandModel.getExpandShapeHeightByUid(mOption.rowUid, oShape.getScheme(), mOption.iRowHeight);
					oShape.setProperty("shapeUid", mOption.rowSetting.getShapeUid(oShape), true);

					// render expanded shapes
					oShape.renderElement(oRm, oShape);
				});
			};
			if (oMainShape._isSubTasks) {
				var aExpandableShapes = oMainShape.getParent().getAllExpandableShapes();
				var childArraay = [];
				aExpandableShapes.forEach(function(oMainshape){ // eslint-disable-line
					var aChild = AggregationUtils.getLazyElementsByScheme(oMainshape, oMainShape.getParent().getParentGantt().getShapeSchemes()[1].getKey());
					childArraay = childArraay.concat(aChild);
				});
				fnRenderExpandShape(childArraay);
			} else if (!oMainShape._isSubTasks){
				var mAggregations = AggregationUtils.getLazyAggregations(oMainShape);
				Object.keys(mAggregations).forEach(function(sName){
				var aShapes = oMainShape.getAggregation(sName);
				fnRenderExpandShape(aShapes);
				});
			}
		},

		calcRowDomPosition : function(oRowSetting, aRowStates) {
			var oRow = oRowSetting._getRow(),
				oTable = oRow.getParent(),
				iRowIndex = oTable.indexOfRow(oRow);

			var iRowHeight = aRowStates[iRowIndex].height;
			var iRowYCenter = 0;
			for (var iIndex = 0; iIndex <= iRowIndex; iIndex++) {
				iRowYCenter += aRowStates[iIndex].height;
			}

			iRowYCenter -= iRowHeight / 2;

			return {
				rowYCenter: iRowYCenter,
				rowHeight: iRowHeight
			};
		},

		/**
		 * Either prepend given item at the front of the given array, or
		 * append given item at the end of the given array.
		 *
		 * @param {array} aArray An array
		 * @param {object} oItem An item that is going to be either prepended or appended to the given array.
		 * @param {boolean} bUnshift If set to true, given item is inserted at the beginning of the array.
		 * If set to false or undefined, the given item is pushed at the end of the given array.
		 * @private
		 */
		pushOrUnshift: function (aArray, oItem, bUnshift) {
			if (bUnshift === true) {
				aArray.splice(0, 0, oItem);
			} else {
				aArray.push(oItem);
			}
		},

		/**
		 * Creates ordered list of callback functions based on template.
		 *
		 * Items from the given template array are either one by one either added to the end or
		 * to the beginning of the new array. When the item has bUnshift set to true,
		 * then it is inserted at the beginning of the array.
		 * If it bUnshift is set to false, then it is pushed to the end of the array.
		 *
		 * @param {array} aTemplateForOrderedRenderFunctions array of objects
		 * @returns {array} Ordered list  of callback functions
		 */
		createOrderedListOfRenderFunctionsFromTemplate: function (aTemplateForOrderedRenderFunctions) {
			var aOrderedRenderFunctions = [];
			for (var i = 0; i < aTemplateForOrderedRenderFunctions.length; i++) {
				this.pushOrUnshift(
					aOrderedRenderFunctions,
					aTemplateForOrderedRenderFunctions[i].fnCallback,
					aTemplateForOrderedRenderFunctions[i].bUnshift);
			}
			return aOrderedRenderFunctions;
		},
		/**
		 * Render the <animate> tag for the shape
		 *
		 * @param {sap.ui.core.RenderManager} oRm Render Manager
		 * @param {sap.gantt.simple.BaseShape} oElement shape instance
		 */
		renderElementAnimation : function(oRm, oElement) {
			var mAnimationSettings = oElement.getAnimationProperties(oElement.getAnimationSettings());
			if (mAnimationSettings) {
				oRm.openStart("animate");
				oRm.attr("attributeName", "fill");
				oRm.attr("values", mAnimationSettings.values);
				oRm.attr("dur", mAnimationSettings.duration);
				oRm.attr("repeatCount", mAnimationSettings.repeatCount);
				oRm.openEnd().close();
			}
		}
	};

	return RenderUtils;
}, /* bExport= */ true);
