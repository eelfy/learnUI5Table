sap.ui.define(
	[
		"sap/ui/model/SimpleType",
		"sap/ui/model/type/Boolean",
		"sap/ui/model/type/Date",
		"sap/ui/model/type/Float",
		"sap/ui/model/type/Integer",
		"sap/ui/model/type/String",
		"sap/ui/mdc/condition/FilterOperatorUtil",
		"sap/ui/mdc/condition/Operator",
		"sap/ui/mdc/enum/FieldDisplay"
	],
	function(SimpleType, BooleanType, DateType, FloatType, IntegerType, StringType, FilterOperatorUtil, Operator, FieldDisplay) {
		"use strict";

		/**
		 * Handle format/parse single filter value.
		 */
		return SimpleType.extend("sap.fe.macros.filter.type.Value", {
			constructor: function(oFormatOptions, oConstraints) {
				var sOperatorName = (oFormatOptions && oFormatOptions.operator) || this.getDefaultOperatorName();
				this._oOperator = FilterOperatorUtil.getOperator(sOperatorName);

				if (!this._oOperator && sOperatorName.includes(".")) {
					this.registerCustomOperator(sOperatorName);
				}

				return SimpleType.apply(this, arguments);
			},

			/**
			 * Returns the element type name.
			 *
			 * @param {string} sTypeName the actual type name
			 * @returns {string} the type of its elements
			 */
			getElementTypeName: function(sTypeName) {
				if (sTypeName.endsWith("[]")) {
					return sTypeName.substring(0, sTypeName.length - 2);
				}
				return null;
			},

			/**
			 * Retrieves the default type instance for given type name.
			 *
			 * @param {string} sTypeName the name of the type
			 * @param {object} [oFormatOptions] the format options
			 * @returns {null | sap.ui.model.SimpleType} the type instance or null if none found for given typename
			 * @protected
			 */
			getTypeInstance: function(sTypeName, oFormatOptions) {
				if (!sTypeName) {
					return null;
				}

				sTypeName = this.getElementTypeName(sTypeName) || sTypeName;

				switch (sTypeName) {
					case "string":
						return new StringType(oFormatOptions);
					case "int":
						return new IntegerType(oFormatOptions);
					case "float":
						return new FloatType(oFormatOptions);
					case "date":
						return new DateType(oFormatOptions);
					case "boolean":
						return new BooleanType(oFormatOptions);
					default:
						return null;
				}
			},

			/**
			 * Returns whether target type is an array.
			 *
			 * @param {string} sTargetType the target type name
			 * @returns {boolean} true if array type, false else
			 */
			isArrayType: function(sTargetType) {
				if (!sTargetType) {
					return false;
				}
				return sTargetType === "array" || sTargetType.endsWith("[]");
			},

			/**
			 * Returns the value parsed to the target type.
			 *
			 * @param {any} vValue the value to be parsed
			 * @param {string} sTargetType the target type, e.g. int, float[], string, etc.
			 * @returns {any|undefined} the parsed value
			 * @private
			 */
			getTypedValue: function(vValue, sTargetType) {
				if (vValue === undefined) {
					return undefined;
				}

				var bIsArrayType = this.isArrayType(sTargetType),
					oTargetType = this.getTypeInstance(sTargetType);

				if (bIsArrayType) {
					if (!Array.isArray(vValue)) {
						vValue = [vValue];
					}
					vValue = vValue.map(function(sValue) {
						return oTargetType ? oTargetType.parseValue(sValue, "string") : sValue;
					});
				} else {
					vValue = oTargetType ? oTargetType.parseValue(vValue, "string") : vValue;
				}

				return vValue;
			},

			formatConditionValues: function(vValues) {
				return Array.isArray(vValues) && vValues.length ? vValues[0] : vValues;
			},

			registerCustomOperator: function(sOperatorName) {
				var that = this;
				sap.ui.require([sOperatorName.substring(0, sOperatorName.lastIndexOf(".")).replaceAll(".", "/")], function(oHandler) {
					if (oHandler) {
						var sMethodName = sOperatorName.substring(sOperatorName.lastIndexOf(".") + 1);
						that._oOperator = new Operator({
							name: sOperatorName,
							valueTypes: ["self"],
							tokenParse: "^(.*)$",
							format: function(vValue) {
								return {
									operator: sOperatorName,
									values: vValue.values
								};
							},
							parse: function(sText, oType, sDisplayFormat, bDefaultOperator) {
								if (typeof sText === "object") {
									if (sText.operator !== sOperatorName) {
										throw Error("not matching operator");
									}
									return sText.values;
								}
								return Operator.prototype.parse.apply(this, arguments);
							},
							getModelFilter: function(oCondition) {
								return oHandler[sMethodName].call(oHandler, that.formatConditionValues(oCondition.values));
							}
						});
						FilterOperatorUtil.addOperator(that._oOperator);
					}
				});
			},

			/**
			 * Returns the used filter operator, defined by <code>formatOptions.operator</code> or <code>getDefaultOperatorName()</code>.
			 *
			 * @returns {sap.ui.mdc.conditions.Operator} the used operator
			 * @private
			 */
			getOperator: function() {
				return this._oOperator;
			},

			/**
			 * Returns the default operator name ("EQ").
			 * Should be overridden on demand.
			 *
			 * @returns {string} the default operator name
			 * @protected
			 */
			getDefaultOperatorName: function() {
				return FilterOperatorUtil.getEQOperator().name;
			},

			isMultiValueOperator: function(oOperator) {
				return (
					oOperator.valueTypes.filter(function(vValueType) {
						return !!vValueType && vValueType !== Operator.ValueType.Static;
					}).length > 1
				);
			},

			formatValue: function(vValue, sInternalType) {
				if (vValue === undefined || vValue === null) {
					return undefined;
				}
				var oOperator = this.getOperator(),
					vResult = oOperator.parse(vValue || "", undefined, FieldDisplay.Value);

				if (Array.isArray(vResult) && !this.isMultiValueOperator(oOperator)) {
					vResult = vResult[0];
				}

				return this.getTypedValue(vResult, sInternalType);
			},

			parseValue: function(vValue, sSourceType) {
				if (vValue === undefined || vValue === null) {
					return undefined;
				}
				var oOperator = this.getOperator(),
					vResult = oOperator.format({ values: this.isMultiValueOperator(oOperator) ? vValue : [vValue] });

				return vResult;
			},

			validateValue: function(vValue) {
				return true;
			}
		});
	},
	true
);
