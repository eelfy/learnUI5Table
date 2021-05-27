sap.ui.define(["sap/fe/core/helpers/ClassSupport", "./MacroAPI"], function (ClassSupport, MacroAPI) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _temp;

  var Association = ClassSupport.Association;
  var Property = ClassSupport.Property;
  var Event = ClassSupport.Event;
  var EventHandler = ClassSupport.EventHandler;
  var APIClass = ClassSupport.APIClass;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  /**
   * Macro for creating a Field based on the metadata provided by OData V4.
   * <br>
   * Usually, a DataField or DataPoint annotation is expected, but the macro Field can also be used to display a property from the entity type.
   *
   *
   * Usage example:
   * <pre>
   * &lt;macro:Field id="MyField" metaPath="MyProperty" /&gt;
   * </pre>
   *
   * @alias sap.fe.macros.Field
   * @public
   */
  var FieldAPI = (_dec = APIClass("sap.fe.macros.FieldAPI"), _dec2 = Property({
    type: "boolean"
  }), _dec3 = Property({
    type: "boolean"
  }), _dec4 = Property({
    type: "string"
  }), _dec5 = Association({
    type: "sap.ui.core.Control",
    multiple: true,
    singularName: "ariaLabelledBy"
  }), _dec6 = Property({
    type: "boolean"
  }), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_MacroAPI) {
    _inherits(FieldAPI, _MacroAPI);

    var _super = _createSuper(FieldAPI);

    function FieldAPI() {
      var _this;

      _classCallCheck(this, FieldAPI);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _initializerDefineProperty(_assertThisInitialized(_this), "editable", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_assertThisInitialized(_this), "readOnly", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_assertThisInitialized(_this), "id", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_assertThisInitialized(_this), "change", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_assertThisInitialized(_this), "ariaLabelledBy", _descriptor5, _assertThisInitialized(_this));

      _initializerDefineProperty(_assertThisInitialized(_this), "required", _descriptor6, _assertThisInitialized(_this));

      return _this;
    }

    _createClass(FieldAPI, [{
      key: "handleChange",
      value: function handleChange(oEvent) {
        this.fireChange({
          value: this.getValue(),
          isValid: oEvent.getParameter("valid")
        });
      }
    }, {
      key: "onBeforeRendering",
      value: function onBeforeRendering() {
        var oContent = this.getContent();

        if (oContent && oContent.addAriaLabelledBy) {
          var aAriaLabelledBy = this.getAriaLabelledBy();

          for (var i = 0; i < aAriaLabelledBy.length; i++) {
            var sId = aAriaLabelledBy[i];
            var aAriaLabelledBys = oContent.getAriaLabelledBy() || [];

            if (aAriaLabelledBys.indexOf(sId) === -1) {
              oContent.addAriaLabelledBy(sId);
            }
          }
        }
      }
    }, {
      key: "enhanceAccessibilityState",
      value: function enhanceAccessibilityState(_oElement, mAriaProps) {
        var oParent = this.getParent();

        if (oParent && oParent.enhanceAccessibilityState) {
          // use FieldWrapper as control, but aria properties of rendered inner control.
          oParent.enhanceAccessibilityState(this, mAriaProps);
        }

        return mAriaProps;
      }
      /**
       * Retrieves the current value of the Field.
       *
       * @public
       * @returns the current value of the field
       */

    }, {
      key: "getValue",
      value: function getValue() {
        var oControl = this.content,
            aControls;

        if (oControl.isA("sap.fe.core.controls.FieldWrapper")) {
          aControls = oControl.getContentEdit() || [oControl.getContentDisplay()] || [];

          if (aControls.length === 1) {
            oControl = aControls[0];
          } else {
            throw "getting value not yet implemented for this field type";
          }
        }

        if (oControl.isA("sap.m.CheckBox")) {
          return oControl.getSelected();
        } else if (oControl.isA("sap.m.Input")) {
          return oControl.getValue();
        } else if (oControl.isA("sap.ui.mdc.Field")) {
          return oControl.getValue();
        } else {
          throw "getting value not yet implemented for this field type";
        }
      } // we need to expose a state corresponding to the real editable state of the field so that when a FormElement tries
      // to see if it needs to set a required mark on the Label we actually check whether the field is required

    }, {
      key: "getEditable",
      value: function getEditable() {
        var _ref;

        var oControl = this.content;
        return ((_ref = oControl) === null || _ref === void 0 ? void 0 : _ref.getEditMode()) !== "Display";
      }
    }]);

    return FieldAPI;
  }(MacroAPI), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "editable", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "readOnly", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "id", [_dec4], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "change", [Event], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "ariaLabelledBy", [_dec5], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "required", [_dec6], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _applyDecoratedDescriptor(_class2.prototype, "handleChange", [EventHandler], Object.getOwnPropertyDescriptor(_class2.prototype, "handleChange"), _class2.prototype)), _class2)) || _class);
  return FieldAPI;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZpZWxkQVBJLnRzIl0sIm5hbWVzIjpbIkZpZWxkQVBJIiwiQVBJQ2xhc3MiLCJQcm9wZXJ0eSIsInR5cGUiLCJBc3NvY2lhdGlvbiIsIm11bHRpcGxlIiwic2luZ3VsYXJOYW1lIiwib0V2ZW50IiwiZmlyZUNoYW5nZSIsInZhbHVlIiwiZ2V0VmFsdWUiLCJpc1ZhbGlkIiwiZ2V0UGFyYW1ldGVyIiwib0NvbnRlbnQiLCJnZXRDb250ZW50IiwiYWRkQXJpYUxhYmVsbGVkQnkiLCJhQXJpYUxhYmVsbGVkQnkiLCJnZXRBcmlhTGFiZWxsZWRCeSIsImkiLCJsZW5ndGgiLCJzSWQiLCJhQXJpYUxhYmVsbGVkQnlzIiwiaW5kZXhPZiIsIl9vRWxlbWVudCIsIm1BcmlhUHJvcHMiLCJvUGFyZW50IiwiZ2V0UGFyZW50IiwiZW5oYW5jZUFjY2Vzc2liaWxpdHlTdGF0ZSIsIm9Db250cm9sIiwiY29udGVudCIsImFDb250cm9scyIsImlzQSIsImdldENvbnRlbnRFZGl0IiwiZ2V0Q29udGVudERpc3BsYXkiLCJnZXRTZWxlY3RlZCIsImdldEVkaXRNb2RlIiwiTWFjcm9BUEkiLCJFdmVudCIsIkV2ZW50SGFuZGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBUUE7Ozs7Ozs7Ozs7Ozs7O01BZU1BLFEsV0FETEMsUUFBUSxDQUFDLHdCQUFELEMsVUFXUEMsUUFBUSxDQUFDO0FBQUVDLElBQUFBLElBQUksRUFBRTtBQUFSLEdBQUQsQyxVQVVSRCxRQUFRLENBQUM7QUFBRUMsSUFBQUEsSUFBSSxFQUFFO0FBQVIsR0FBRCxDLFVBUVJELFFBQVEsQ0FBQztBQUFFQyxJQUFBQSxJQUFJLEVBQUU7QUFBUixHQUFELEMsVUFXUkMsV0FBVyxDQUFDO0FBQUVELElBQUFBLElBQUksRUFBRSxxQkFBUjtBQUErQkUsSUFBQUEsUUFBUSxFQUFFLElBQXpDO0FBQStDQyxJQUFBQSxZQUFZLEVBQUU7QUFBN0QsR0FBRCxDLFVB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IEFQSUNsYXNzLCBFdmVudEhhbmRsZXIsIEV2ZW50LCBQcm9wZXJ0eSwgQXNzb2NpYXRpb24gfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9DbGFzc1N1cHBvcnRcIjtcbmltcG9ydCBNYWNyb0FQSSBmcm9tIFwiLi9NYWNyb0FQSVwiO1xuaW1wb3J0IHsgSW5wdXQsIENoZWNrQm94IH0gZnJvbSBcInNhcC9tXCI7XG5pbXBvcnQgeyBGaWVsZCBhcyBtZGNGaWVsZCB9IGZyb20gXCJzYXAvdWkvbWRjXCI7XG5pbXBvcnQgeyBGaWVsZFdyYXBwZXIgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udHJvbHNcIjtcbmltcG9ydCB7IENvbnRyb2wgfSBmcm9tIFwic2FwL3VpL2NvcmVcIjtcbmltcG9ydCB7IFVJNUV2ZW50IH0gZnJvbSBcImdsb2JhbFwiO1xuXG4vKipcbiAqIE1hY3JvIGZvciBjcmVhdGluZyBhIEZpZWxkIGJhc2VkIG9uIHRoZSBtZXRhZGF0YSBwcm92aWRlZCBieSBPRGF0YSBWNC5cbiAqIDxicj5cbiAqIFVzdWFsbHksIGEgRGF0YUZpZWxkIG9yIERhdGFQb2ludCBhbm5vdGF0aW9uIGlzIGV4cGVjdGVkLCBidXQgdGhlIG1hY3JvIEZpZWxkIGNhbiBhbHNvIGJlIHVzZWQgdG8gZGlzcGxheSBhIHByb3BlcnR5IGZyb20gdGhlIGVudGl0eSB0eXBlLlxuICpcbiAqXG4gKiBVc2FnZSBleGFtcGxlOlxuICogPHByZT5cbiAqICZsdDttYWNybzpGaWVsZCBpZD1cIk15RmllbGRcIiBtZXRhUGF0aD1cIk15UHJvcGVydHlcIiAvJmd0O1xuICogPC9wcmU+XG4gKlxuICogQGFsaWFzIHNhcC5mZS5tYWNyb3MuRmllbGRcbiAqIEBwdWJsaWNcbiAqL1xuQEFQSUNsYXNzKFwic2FwLmZlLm1hY3Jvcy5GaWVsZEFQSVwiKVxuY2xhc3MgRmllbGRBUEkgZXh0ZW5kcyBNYWNyb0FQSSB7XG5cdC8qKlxuXHQgKiBBbiBleHByZXNzaW9uIHRoYXQgYWxsb3dzIHlvdSB0byBjb250cm9sIHRoZSBlZGl0YWJsZSBzdGF0ZSBvZiB0aGUgZmllbGQuXG5cdCAqXG5cdCAqIElmIHlvdSBkbyBub3Qgc2V0IGFueSBleHByZXNzaW9uLCBTQVAgRmlvcmkgZWxlbWVudHMgaG9va3MgaW50byB0aGUgc3RhbmRhcmQgbGlmZWN5Y2xlIHRvIGRldGVybWluZSBpZiB0aGUgcGFnZSBpcyBjdXJyZW50bHkgZWRpdGFibGUuXG5cdCAqIFBsZWFzZSBub3RlIHRoYXQgeW91IGNhbm5vdCBzZXQgYSBmaWVsZCB0byBlZGl0YWJsZSBpZiBpdCBoYXMgYmVlbiBkZWZpbmVkIGluIHRoZSBhbm5vdGF0aW9uIGFzIG5vdCBlZGl0YWJsZS5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQGRlcHJlY2F0ZWRcblx0ICovXG5cdEBQcm9wZXJ0eSh7IHR5cGU6IFwiYm9vbGVhblwiIH0pXG5cdGVkaXRhYmxlITogYm9vbGVhbjtcblxuXHQvKipcblx0ICogQW4gZXhwcmVzc2lvbiB0aGF0IGFsbG93cyB5b3UgdG8gY29udHJvbCB0aGUgcmVhZC1vbmx5IHN0YXRlIG9mIHRoZSBmaWVsZC5cblx0ICpcblx0ICogSWYgeW91IGRvIG5vdCBzZXQgYW55IGV4cHJlc3Npb24sIFNBUCBGaW9yaSBlbGVtZW50cyBob29rcyBpbnRvIHRoZSBzdGFuZGFyZCBsaWZlY3ljbGUgdG8gZGV0ZXJtaW5lIHRoZSBjdXJyZW50IHN0YXRlLlxuXHQgKlxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRAUHJvcGVydHkoeyB0eXBlOiBcImJvb2xlYW5cIiB9KVxuXHRyZWFkT25seSE6IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIFRoZSBpZGVudGlmaWVyIG9mIHRoZSBGaWVsZCBjb250cm9sLlxuXHQgKlxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRAUHJvcGVydHkoeyB0eXBlOiBcInN0cmluZ1wiIH0pXG5cdGlkITogc3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBBbiBldmVudCBjb250YWluaW5nIGRldGFpbHMgaXMgdHJpZ2dlcmVkIHdoZW4gdGhlIHZhbHVlIG9mIHRoZSBmaWVsZCBpcyBjaGFuZ2VkLlxuXHQgKlxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRARXZlbnRcblx0Y2hhbmdlITogRnVuY3Rpb247XG5cblx0QEFzc29jaWF0aW9uKHsgdHlwZTogXCJzYXAudWkuY29yZS5Db250cm9sXCIsIG11bHRpcGxlOiB0cnVlLCBzaW5ndWxhck5hbWU6IFwiYXJpYUxhYmVsbGVkQnlcIiB9KVxuXHRhcmlhTGFiZWxsZWRCeSE6IENvbnRyb2w7XG5cblx0QFByb3BlcnR5KHsgdHlwZTogXCJib29sZWFuXCIgfSlcblx0cmVxdWlyZWQhOiBib29sZWFuO1xuXG5cdEBFdmVudEhhbmRsZXJcblx0aGFuZGxlQ2hhbmdlKG9FdmVudDogVUk1RXZlbnQpIHtcblx0XHQodGhpcyBhcyBhbnkpLmZpcmVDaGFuZ2UoeyB2YWx1ZTogdGhpcy5nZXRWYWx1ZSgpLCBpc1ZhbGlkOiBvRXZlbnQuZ2V0UGFyYW1ldGVyKFwidmFsaWRcIikgfSk7XG5cdH1cblxuXHRvbkJlZm9yZVJlbmRlcmluZygpIHtcblx0XHRjb25zdCBvQ29udGVudCA9ICh0aGlzIGFzIGFueSkuZ2V0Q29udGVudCgpO1xuXHRcdGlmIChvQ29udGVudCAmJiBvQ29udGVudC5hZGRBcmlhTGFiZWxsZWRCeSkge1xuXHRcdFx0Y29uc3QgYUFyaWFMYWJlbGxlZEJ5ID0gKHRoaXMgYXMgYW55KS5nZXRBcmlhTGFiZWxsZWRCeSgpO1xuXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFBcmlhTGFiZWxsZWRCeS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRjb25zdCBzSWQgPSBhQXJpYUxhYmVsbGVkQnlbaV07XG5cdFx0XHRcdGNvbnN0IGFBcmlhTGFiZWxsZWRCeXMgPSBvQ29udGVudC5nZXRBcmlhTGFiZWxsZWRCeSgpIHx8IFtdO1xuXHRcdFx0XHRpZiAoYUFyaWFMYWJlbGxlZEJ5cy5pbmRleE9mKHNJZCkgPT09IC0xKSB7XG5cdFx0XHRcdFx0b0NvbnRlbnQuYWRkQXJpYUxhYmVsbGVkQnkoc0lkKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGVuaGFuY2VBY2Nlc3NpYmlsaXR5U3RhdGUoX29FbGVtZW50OiBvYmplY3QsIG1BcmlhUHJvcHM6IG9iamVjdCk6IG9iamVjdCB7XG5cdFx0Y29uc3Qgb1BhcmVudCA9IHRoaXMuZ2V0UGFyZW50KCk7XG5cblx0XHRpZiAob1BhcmVudCAmJiAob1BhcmVudCBhcyBhbnkpLmVuaGFuY2VBY2Nlc3NpYmlsaXR5U3RhdGUpIHtcblx0XHRcdC8vIHVzZSBGaWVsZFdyYXBwZXIgYXMgY29udHJvbCwgYnV0IGFyaWEgcHJvcGVydGllcyBvZiByZW5kZXJlZCBpbm5lciBjb250cm9sLlxuXHRcdFx0KG9QYXJlbnQgYXMgYW55KS5lbmhhbmNlQWNjZXNzaWJpbGl0eVN0YXRlKHRoaXMsIG1BcmlhUHJvcHMpO1xuXHRcdH1cblxuXHRcdHJldHVybiBtQXJpYVByb3BzO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHJpZXZlcyB0aGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgRmllbGQuXG5cdCAqXG5cdCAqIEBwdWJsaWNcblx0ICogQHJldHVybnMgdGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIGZpZWxkXG5cdCAqL1xuXHRnZXRWYWx1ZSgpOiBib29sZWFuIHwgc3RyaW5nIHtcblx0XHRsZXQgb0NvbnRyb2wgPSB0aGlzLmNvbnRlbnQsXG5cdFx0XHRhQ29udHJvbHM7XG5cblx0XHRpZiAob0NvbnRyb2wuaXNBKFwic2FwLmZlLmNvcmUuY29udHJvbHMuRmllbGRXcmFwcGVyXCIpKSB7XG5cdFx0XHRhQ29udHJvbHMgPSAob0NvbnRyb2wgYXMgRmllbGRXcmFwcGVyKS5nZXRDb250ZW50RWRpdCgpIHx8IFsob0NvbnRyb2wgYXMgRmllbGRXcmFwcGVyKS5nZXRDb250ZW50RGlzcGxheSgpXSB8fCBbXTtcblx0XHRcdGlmIChhQ29udHJvbHMubGVuZ3RoID09PSAxKSB7XG5cdFx0XHRcdG9Db250cm9sID0gYUNvbnRyb2xzWzBdO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhyb3cgXCJnZXR0aW5nIHZhbHVlIG5vdCB5ZXQgaW1wbGVtZW50ZWQgZm9yIHRoaXMgZmllbGQgdHlwZVwiO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChvQ29udHJvbC5pc0EoXCJzYXAubS5DaGVja0JveFwiKSkge1xuXHRcdFx0cmV0dXJuIChvQ29udHJvbCBhcyBDaGVja0JveCkuZ2V0U2VsZWN0ZWQoKTtcblx0XHR9IGVsc2UgaWYgKG9Db250cm9sLmlzQShcInNhcC5tLklucHV0XCIpKSB7XG5cdFx0XHRyZXR1cm4gKG9Db250cm9sIGFzIElucHV0KS5nZXRWYWx1ZSgpO1xuXHRcdH0gZWxzZSBpZiAob0NvbnRyb2wuaXNBKFwic2FwLnVpLm1kYy5GaWVsZFwiKSkge1xuXHRcdFx0cmV0dXJuIChvQ29udHJvbCBhcyBtZGNGaWVsZCkuZ2V0VmFsdWUoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhyb3cgXCJnZXR0aW5nIHZhbHVlIG5vdCB5ZXQgaW1wbGVtZW50ZWQgZm9yIHRoaXMgZmllbGQgdHlwZVwiO1xuXHRcdH1cblx0fVxuXG5cdC8vIHdlIG5lZWQgdG8gZXhwb3NlIGEgc3RhdGUgY29ycmVzcG9uZGluZyB0byB0aGUgcmVhbCBlZGl0YWJsZSBzdGF0ZSBvZiB0aGUgZmllbGQgc28gdGhhdCB3aGVuIGEgRm9ybUVsZW1lbnQgdHJpZXNcblx0Ly8gdG8gc2VlIGlmIGl0IG5lZWRzIHRvIHNldCBhIHJlcXVpcmVkIG1hcmsgb24gdGhlIExhYmVsIHdlIGFjdHVhbGx5IGNoZWNrIHdoZXRoZXIgdGhlIGZpZWxkIGlzIHJlcXVpcmVkXG5cdGdldEVkaXRhYmxlKCk6IGJvb2xlYW4ge1xuXHRcdGNvbnN0IG9Db250cm9sID0gdGhpcy5jb250ZW50O1xuXHRcdHJldHVybiAob0NvbnRyb2wgYXMgRmllbGRXcmFwcGVyKT8uZ2V0RWRpdE1vZGUoKSAhPT0gXCJEaXNwbGF5XCI7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRmllbGRBUEk7XG4iXX0=