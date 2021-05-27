/*
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/ui/core/Core",
	"sap/ui/model/CompositeType",
	"sap/ui/comp/util/FormatUtil",
	"sap/ui/model/ParseException",
	"sap/ui/model/ValidateException",
	"sap/base/util/isPlainObject",
	"sap/base/assert"
], function(
	coreLibrary,
	CompositeType,
	FormatUtil,
	ParseException,
	ValidateException,
	isPlainObject,
	assert
) {
	"use strict";
	var TextArrangement = CompositeType.extend("sap.ui.comp.smartfield.type.TextArrangement", {
		constructor: function(oFormatOptions, oConstraints, oSettings) {
			this.getPrimaryType().call(this, oFormatOptions, oConstraints);
			CompositeType.call(this, oFormatOptions, oConstraints);
			this.init(oFormatOptions, oConstraints, oSettings);
			assert(oSettings.keyField !== undefined, "Missing value for the keyField. - " + this.getName());
			assert(oSettings.descriptionField !== undefined, "Missing value for the descriptionField. - " + this.getName());
		},

		metadata: {
			"abstract": true
		}
	});

	TextArrangement.prototype.init = function(oFormatOptions, oConstraints, oSettings) {
		this.sName = "TextArrangement";
		this.bParseWithValues = true;
		this.async = true;

		var oDefaultFormatOptions = {
			textArrangement: "idOnly"
		};

		var oDefaultSettings = {
			onBeforeValidateValue: function() {}
		};

		this.oSettings = Object.assign(oDefaultSettings, oSettings);
		this.oFormatOptions = Object.assign(oDefaultFormatOptions, oFormatOptions);

		this.fnParser = this.getValidator({
			textArrangement: this.oFormatOptions.textArrangement,
			prefix: "parse"
		});

		this.fnValidator = this.getValidator({
			textArrangement: this.oFormatOptions.textArrangement,
			prefix: "validate"
		});

		this.bValueListNoValidation = oSettings.valueListNoValidation;
	};

	TextArrangement.prototype.parseValue = function(vValue, sSourceType, aCurrentValues) {
		var aResult, sTextArrangement = this.oFormatOptions.textArrangement;

		if (typeof vValue === "string" ) {
			vValue = vValue.replace(/\s+$/, "");
		}

		if (vValue === "" || (sTextArrangement === "idOnly")) {
			aResult = this.parseIDOnly(vValue, sSourceType);
		} else {
			aResult = this.fnParser(vValue, sSourceType, aCurrentValues, this.oFormatOptions, this.oSettings);
		}

		if (aResult[0] && aResult[0].toUpperCase && this.oFormatOptions.displayFormat === "UpperCase") {
			aResult[0] = aResult[0].toUpperCase();
		}

		return aResult;
	};

	TextArrangement.prototype.parseIDOnly = function(vValue, sSourceType) {
		vValue = this.getPrimaryType().prototype.parseValue.call(this, vValue, sSourceType);
		return [vValue, undefined];
	};

	TextArrangement.prototype.parseIDAndDescription = function(vValue, sSourceType, aCurrentValues, oFormatOptions) {
		var rTextArrangementFormat = /.*\s\(.*\)/i;

		// if the value format is "ID (description)" or "description (ID)"
		if (rTextArrangementFormat.test(vValue)) {
			var rSeparator = /\s\(/gi;

			// raise a parse exception if the delimiter used to separate the ID from the description
			// is duplicated (delimiter collision problem)
			if (vValue.match(rSeparator).length > 1) {
				throw new ParseException(this.getResourceBundleText("SMARTFIELD_NOT_FOUND"));
			}

			var aValues = TextArrangement.splitIDAndDescription(vValue, {
				separator: rSeparator,
				textArrangement: oFormatOptions.textArrangement
			});

			vValue = aValues[0];
		}

		return this.parseIDOnly(vValue, sSourceType);
	};

	TextArrangement.prototype.parseDescriptionOnly = function(vValue, sSourceType, aCurrentValues, oFormatOptions, oSettings) {

		return new Promise(function(fnResolve, fnReject) {
			// The request for the description won't be sent and we need to resolve the promise
			if ( vValue === null || vValue === "" ){
				return fnResolve([vValue, ""]);
			}

			function handleSuccess(aData) {
				var sID,
					sKeyField = oSettings.keyField,
					sDescriptionField = oSettings.descriptionField;

				// filtering in the text/description field first as the textArrangement format option is set to "descriptionOnly"
				var aIDs = filterValuesByKey(vValue, {
					key: sDescriptionField,
					value: sKeyField,
					data: aData
				});

				var aIDsLength = aIDs.length;

				if (aIDsLength === 1) {
					sID = this.getPrimaryType().prototype.parseValue.call(this, aIDs[0], sSourceType);
					fnResolve([sID, undefined]);
					return;
				}

				// if no IDs were found in the text/description field, filtering the key field
				if (aIDsLength === 0) {

					aIDs = filterValuesByKey(vValue, {
						key: sKeyField,
						value: sDescriptionField,
						data: aData
					});

					aIDsLength = aIDs.length;
				}

				// TODO: We should move the validation logic to the validate method.
				if (!this.bValueListNoValidation) {
					if (aIDsLength === 0) {
						fnReject(new ValidateException(this.getResourceBundleText("SMARTFIELD_NOT_FOUND")));
						return;
					}

					// duplicate IDs were found
					if (aIDsLength > 1) {
						fnReject(new ValidateException(this.getResourceBundleText("SMARTFIELD_DUPLICATE_VALUES")));
						return;
					}
				}

				sID = this.getPrimaryType().prototype.parseValue.call(this, vValue, sSourceType);
				fnResolve([sID, undefined]);
			}

			function handleException(error) {
				// TODO: In the future maybe handle the error from the server
				fnReject(new ValidateException(this.getResourceBundleText("SMARTFIELD_INVALID_ENTRY")));
			}

			var oOnBeforeValidateValueSettings = {
				filterFields: this.getFilterFields(),
				success: handleSuccess.bind(this),
				error: handleException.bind(this)
			};

			this.onBeforeValidateValue(vValue, oOnBeforeValidateValueSettings);
		}.bind(this));
	};

	TextArrangement.prototype.validateValue = function(aValues, bCheckValuesValidity) {
		this.validateIDOnly(aValues);
		var vID = aValues[0];

		// prevent a request to be sent when the ID value is "" (empty)
		if (vID === null) {
			return;
		}

		// prevent a request to be sent when the description is known
		if (this.oFormatOptions.textArrangement === "descriptionOnly") {
			this.validateDescriptionOnly(aValues, this.oSettings);
			return;
		}

		if (this.oFormatOptions.textArrangement === "idOnly") {
			this.validateIDOnly(aValues, this.oSettings);
			return;
		}

		var oPromise = new Promise(function(fnResolve, fnReject) {

			function handleSuccess(aData) {
				var oSettings = Object.assign({}, this.oSettings, {
					data: aData,
					reject: fnReject
				});

				var bValidValue = this.fnValidator(aValues, oSettings);

				if (bValidValue) {
					fnResolve(aValues);
				}
			}

			function handleException(error) {
				// TODO: In the future maybe handle the error from the server
				fnReject(new ValidateException(this.getResourceBundleText("SMARTFIELD_INVALID_ENTRY")));
			}

			var oOnBeforeValidateValueSettings = {
				filterFields: this.getFilterFields(),
				success: handleSuccess.bind(this),
				error: handleException.bind(this),
				bCheckValuesValidity: bCheckValuesValidity
			};

			this.onBeforeValidateValue(vID, oOnBeforeValidateValueSettings);
		}.bind(this));

		if (this.bValueListNoValidation) {
			return;
		} else {
			return oPromise;
		}
	};

	TextArrangement.prototype.validateIDOnly = function(aValue) {
		this.getPrimaryType().prototype.validateValue.call(this, aValue[0]);
	};

	TextArrangement.prototype.validateIDAndDescription = function(aValues, oSettings) {
		var oFilterSettings = {
				key: oSettings.keyField,
				value: oSettings.descriptionField,
				data: oSettings.data
			};

		if (this.oFormatOptions && this.oFormatOptions.displayFormat) {
			oFilterSettings.displayFormat = this.oFormatOptions.displayFormat;
		}

		// filter for description given the ID
		var aDescription = filterValuesByKey(aValues[0], oFilterSettings);

		var fnReject = oSettings.reject;

		if (!this.bValueListNoValidation) {
			// if no description is found
			if (aDescription.length === 0) {
				fnReject(new ValidateException(this.getResourceBundleText("SMARTFIELD_NOT_FOUND")));
				return false;
			}

			// more descriptions were found for the same ID
			if (aDescription.length > 1) {
				fnReject(new ValidateException(this.getResourceBundleText("SMARTFIELD_DUPLICATE_VALUES")));
				return false;
			}
		}

		return true;
	};

	TextArrangement.prototype.validateDescriptionOnly = function(aValues, oSettings) {};

	TextArrangement.prototype.formatValue = function(aValues, sTargetType) {
		var sKey;

		// In case we receive a string or if context is removed we can receive a value of null
		if (!Array.isArray(aValues)) {
			return aValues;
		}

		// Handle unwanted comma in the model - In case we have only ID in the field and recieve again only ID.
		if (this.bValueListNoValidation && aValues[1] === undefined){
			aValues.splice(1, 1);
		}
		sKey = this.getPrimaryType().prototype.formatValue.call(this, aValues[0], sTargetType);

		if (sKey === "" || sKey === null) {
			return sKey;
		}

		if (sKey && this.oFormatOptions.displayFormat === "UpperCase") {
			sKey = sKey.toUpperCase();
		}

		var vDescription = aValues[1];

		if (vDescription === "" && this.oFormatOptions.textArrangement !== "idOnly"){
			this._sTextArrangementLastReadValue = null;
		}


		// in case the binding path is invalid/empty
		if (isPlainObject(vDescription)) {
			vDescription = "";
		}

		return FormatUtil.getFormattedExpressionFromDisplayBehaviour(this.oFormatOptions.textArrangement, sKey, vDescription);
	};

	TextArrangement.prototype.destroy = function() {
		this.oFormatOptions = null;
		this.oSettings = null;
		this.fnParser = null;
		this.fnValidator = null;
	};

	TextArrangement.prototype.getName = function() {
		return "sap.ui.comp.smartfield.type.TextArrangement";
	};

	TextArrangement.prototype.onBeforeValidateValue = function(vValue, mSettings) {
		this.oSettings.onBeforeValidateValue(vValue, mSettings);
	};

	TextArrangement.prototype.getResourceBundleText = function(sKey, aParams) {
		return coreLibrary.getLibraryResourceBundle("sap.ui.comp").getText(sKey, aParams);
	};

	/**
	 * Gets the primary type of this object.
	 *
	 * @returns {sap.ui.model.odata.type.ODataType} The data type used for parsing, validation and formatting
	 * @protected
	 * @abstract
	 */
	TextArrangement.prototype.getPrimaryType = function() {};

	TextArrangement.prototype.getValidator = function(mSettings) {

		switch (mSettings.textArrangement) {

			case "idAndDescription":
			case "descriptionAndId":
				return this[mSettings.prefix + "IDAndDescription"];

			case "descriptionOnly":
				return this[mSettings.prefix + "DescriptionOnly"];

			default:
				return this[mSettings.prefix + "IDOnly"];
		}
	};

	TextArrangement.prototype.getFilterFields = function(vValue) {
		return ["keyField"];
	};

	function filterValuesByKey(sKey, mSettings) {
		var aValues = [];
		if (mSettings.displayFormat === "UpperCase") {
			sKey = sKey.toLowerCase();
		}
		mSettings.data.forEach(function(mData, iIndex, aData) {
			var sCurrKey = mSettings.displayFormat === "UpperCase" ? mData[mSettings.key].toLowerCase() : mData[mSettings.key];
			if (sCurrKey === sKey) {
				aValues.push(mData[mSettings.value]);
			}
		});

		return aValues;
	}

	TextArrangement.splitIDAndDescription = function(vValue, mSettings) {
		var aValues = mSettings.separator.exec(vValue), // note: if the match fails, it returns null
			iIndex = aValues["index"];

		switch (mSettings.textArrangement) {

			case "idAndDescription":
				return [
					vValue.slice(0, iIndex /* index of the first separator */),
					vValue.slice(iIndex /* index of the first separator */ + 2, -1)
				];

			case "descriptionAndId":
				return [
					vValue.slice(iIndex /* index of the first separator */ + 2, -1),
					vValue.slice(0, iIndex /* index of the first separator */)
				];

			default:
				return ["", ""];
		}
	};

	return TextArrangement;
});
