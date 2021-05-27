sap.ui.define(["sap/fe/core/helpers/ClassSupport", "sap/ui/core/Control", "sap/fe/core/converters/ConverterContext", "sap/base/util/merge", "sap/base/util/uid", "sap/fe/macros/PhantomUtil", "sap/ui/core/util/XMLPreprocessor"], function (ClassSupport, Control, ConverterContext, merge, uid, PhantomUtil, XMLPreprocessor) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _class3, _temp;

  var createConverterContextForMacro = ConverterContext.createConverterContextForMacro;
  var Property = ClassSupport.Property;
  var Aggregation = ClassSupport.Aggregation;
  var APIClass = ClassSupport.APIClass;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

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

  var MacroAPI = (_dec = APIClass("sap.fe.macros.MacroAPI"), _dec2 = Property({
    type: "string"
  }), _dec3 = Property({
    type: "string"
  }), _dec4 = Aggregation({
    type: "sap.ui.core.Control",
    multiple: false,
    isDefault: true
  }), _dec(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_Control) {
    _inherits(MacroAPI, _Control);

    var _super = _createSuper(MacroAPI);

    function MacroAPI() {
      var _this;

      _classCallCheck(this, MacroAPI);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _initializerDefineProperty(_assertThisInitialized(_this), "contextPath", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_assertThisInitialized(_this), "metaPath", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_assertThisInitialized(_this), "content", _descriptor3, _assertThisInitialized(_this));

      _defineProperty(_assertThisInitialized(_this), "modelResolved", false);

      return _this;
    }

    _createClass(MacroAPI, [{
      key: "rerender",
      value: function rerender() {
        this.content.rerender();
      }
    }, {
      key: "getDomRef",
      value: function getDomRef() {
        var oContent = this.content;
        return oContent ? oContent.getDomRef() : _get(_getPrototypeOf(MacroAPI.prototype), "getDomRef", this).call(this);
      }
    }, {
      key: "propagateProperties",
      value: function propagateProperties(vName) {
        var _this2 = this;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        _get(_getPrototypeOf(MacroAPI.prototype), "propagateProperties", this).call(this, vName);

        if (this.metadata.macroContexts && !this.modelResolved) {
          var oPageModel = this.getModel("_pageModel");

          if (oPageModel) {
            Object.keys(this.metadata.macroContexts).forEach(function (macroKeyName) {
              _this2[macroKeyName] = oPageModel.getObject(_this2[macroKeyName]);
            });
            this.modelResolved = true;
          }
        }
      }
    }], [{
      key: "getAPI",
      value: function getAPI(oEvent) {
        var oSource = oEvent.getSource();

        while (oSource && !oSource.isA("sap.fe.macros.MacroAPI")) {
          oSource = oSource.getParent();
        }

        return oSource && oSource.isA("sap.fe.macros.MacroAPI") && oSource;
      }
    }, {
      key: "setDefaultValue",
      value: function setDefaultValue(oProps, sPropName, oOverrideValue) {
        if (oProps[sPropName] === undefined) {
          oProps[sPropName] = oOverrideValue;
        }
      }
    }, {
      key: "register",
      value: function register() {
        PhantomUtil.register(this);
      }
    }, {
      key: "unregister",
      value: function unregister() {
        XMLPreprocessor.plugIn(null, this.namespace, this.macroName);
      }
    }]);

    return MacroAPI;
  }(Control), _defineProperty(_class3, "namespace", "sap.fe.macros"), _defineProperty(_class3, "macroName", "Macro"), _defineProperty(_class3, "fragment", "sap.fe.macros.Macro"), _defineProperty(_class3, "hasValidation", true), _defineProperty(_class3, "getConverterContext", function (oDataModelPath, contextPath, mSettings) {
    var oAppComponent = mSettings.appComponent;
    var viewData = mSettings.models.viewData && mSettings.models.viewData.getData();
    var oConverterContext = createConverterContextForMacro(oDataModelPath.startingEntitySet.name, mSettings.models.metaModel, viewData.converterType, oAppComponent && oAppComponent.getShellServices(), oAppComponent && oAppComponent.getDiagnostics(), merge, oDataModelPath.contextLocation, viewData);
    return oConverterContext;
  }), _defineProperty(_class3, "createBindingContext", function (oData, mSettings) {
    var sContextPath = "/" + uid();
    mSettings.models.converterContext.setProperty(sContextPath, oData);
    return mSettings.models.converterContext.createBindingContext(sContextPath);
  }), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "contextPath", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "metaPath", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "content", [_dec4], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  })), _class2)) || _class);
  return MacroAPI;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1hY3JvQVBJLnRzIl0sIm5hbWVzIjpbIk1hY3JvQVBJIiwiQVBJQ2xhc3MiLCJQcm9wZXJ0eSIsInR5cGUiLCJBZ2dyZWdhdGlvbiIsIm11bHRpcGxlIiwiaXNEZWZhdWx0IiwiY29udGVudCIsInJlcmVuZGVyIiwib0NvbnRlbnQiLCJnZXREb21SZWYiLCJ2TmFtZSIsIm1ldGFkYXRhIiwibWFjcm9Db250ZXh0cyIsIm1vZGVsUmVzb2x2ZWQiLCJvUGFnZU1vZGVsIiwiZ2V0TW9kZWwiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsIm1hY3JvS2V5TmFtZSIsImdldE9iamVjdCIsIm9FdmVudCIsIm9Tb3VyY2UiLCJnZXRTb3VyY2UiLCJpc0EiLCJnZXRQYXJlbnQiLCJvUHJvcHMiLCJzUHJvcE5hbWUiLCJvT3ZlcnJpZGVWYWx1ZSIsInVuZGVmaW5lZCIsIlBoYW50b21VdGlsIiwicmVnaXN0ZXIiLCJYTUxQcmVwcm9jZXNzb3IiLCJwbHVnSW4iLCJuYW1lc3BhY2UiLCJtYWNyb05hbWUiLCJDb250cm9sIiwib0RhdGFNb2RlbFBhdGgiLCJjb250ZXh0UGF0aCIsIm1TZXR0aW5ncyIsIm9BcHBDb21wb25lbnQiLCJhcHBDb21wb25lbnQiLCJ2aWV3RGF0YSIsIm1vZGVscyIsImdldERhdGEiLCJvQ29udmVydGVyQ29udGV4dCIsImNyZWF0ZUNvbnZlcnRlckNvbnRleHRGb3JNYWNybyIsInN0YXJ0aW5nRW50aXR5U2V0IiwibmFtZSIsIm1ldGFNb2RlbCIsImNvbnZlcnRlclR5cGUiLCJnZXRTaGVsbFNlcnZpY2VzIiwiZ2V0RGlhZ25vc3RpY3MiLCJtZXJnZSIsImNvbnRleHRMb2NhdGlvbiIsIm9EYXRhIiwic0NvbnRleHRQYXRoIiwidWlkIiwiY29udmVydGVyQ29udGV4dCIsInNldFByb3BlcnR5IiwiY3JlYXRlQmluZGluZ0NvbnRleHQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQVVN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SUEsYUFBYSxDQUFDWSxjQUFkLEVBTHNDLEVBTXZEQyxLQU51RCxFQU92RGhCLGNBQWMsQ0FBQ2lCLGVBUHdDLEVBUXZEWixRQVJ1RCxDQUF4RDtBQVVBLFdBQU9HLGlCQUFQO0FBQ0EsRyxvREFDNkIsVUFBU1UsS0FBVCxFQUF3QmhCLFNBQXhCLEVBQXdDO0FBQ3JFLFFBQU1pQixZQUFZLEdBQUcsTUFBTUMsR0FBRyxFQUE5QjtBQUNBbEIsSUFBQUEsU0FBUyxDQUFDSSxNQUFWLENBQWlCZSxnQkFBakIsQ0FBa0NDLFdBQWxDLENBQThDSCxZQUE5QyxFQUE0REQsS0FBNUQ7QUFDQSxXQUFPaEIsU0FBUyxDQUFDSSxNQUFWLENBQWlCZSxnQkFBakIsQ0FBa0NFLG9CQUFsQyxDQUF1REosWUFBdkQsQ0FBUDtBQUNBLEc7Ozs7Ozs7Ozs7Ozs7Ozs7U0FTYXpELFEiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFQSUNsYXNzLCBBZ2dyZWdhdGlvbiwgUHJvcGVydHkgfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9DbGFzc1N1cHBvcnRcIjtcbmltcG9ydCB7IENvbnRyb2wgfSBmcm9tIFwic2FwL3VpL2NvcmVcIjtcbmltcG9ydCB7IFVJNUV2ZW50IH0gZnJvbSBcImdsb2JhbFwiO1xuaW1wb3J0IHsgRGF0YU1vZGVsT2JqZWN0UGF0aCB9IGZyb20gXCJzYXAvZmUvY29yZS90ZW1wbGF0aW5nL0RhdGFNb2RlbFBhdGhIZWxwZXJcIjtcbmltcG9ydCB7IGNyZWF0ZUNvbnZlcnRlckNvbnRleHRGb3JNYWNybyB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL0NvbnZlcnRlckNvbnRleHRcIjtcbmltcG9ydCB7IG1lcmdlLCB1aWQgfSBmcm9tIFwic2FwL2Jhc2UvdXRpbFwiO1xuaW1wb3J0IHsgUGhhbnRvbVV0aWwgfSBmcm9tIFwic2FwL2ZlL21hY3Jvc1wiO1xuaW1wb3J0IHsgWE1MUHJlcHJvY2Vzc29yIH0gZnJvbSBcInNhcC91aS9jb3JlL3V0aWxcIjtcblxuQEFQSUNsYXNzKFwic2FwLmZlLm1hY3Jvcy5NYWNyb0FQSVwiKVxuY2xhc3MgTWFjcm9BUEkgZXh0ZW5kcyBDb250cm9sIHtcblx0c3RhdGljIG5hbWVzcGFjZTogc3RyaW5nID0gXCJzYXAuZmUubWFjcm9zXCI7XG5cdHN0YXRpYyBtYWNyb05hbWU6IHN0cmluZyA9IFwiTWFjcm9cIjtcblx0c3RhdGljIGZyYWdtZW50OiBzdHJpbmcgPSBcInNhcC5mZS5tYWNyb3MuTWFjcm9cIjtcblx0c3RhdGljIGhhc1ZhbGlkYXRpb246IGJvb2xlYW4gPSB0cnVlO1xuXG5cdC8qKlxuXHQgKiBEZWZpbmVzIHRoZSBwYXRoIG9mIHRoZSBjb250ZXh0IHVzZWQgaW4gdGhlIGN1cnJlbnQgcGFnZSBvciBibG9jay5cblx0ICogVGhpcyBzZXR0aW5nIGlzIGRlZmluZWQgYnkgdGhlIGZyYW1ld29yay5cblx0ICpcblx0ICogQHB1YmxpY1xuXHQgKi9cblx0QFByb3BlcnR5KHsgdHlwZTogXCJzdHJpbmdcIiB9KVxuXHRjb250ZXh0UGF0aCE6IHN0cmluZztcblxuXHQvKipcblx0ICogRGVmaW5lcyB0aGUgcmVsYXRpdmUgcGF0aCBvZiB0aGUgcHJvcGVydHkgaW4gdGhlIG1ldGFtb2RlbCwgYmFzZWQgb24gdGhlIGN1cnJlbnQgY29udGV4dFBhdGguXG5cdCAqXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdEBQcm9wZXJ0eSh7IHR5cGU6IFwic3RyaW5nXCIgfSlcblx0bWV0YVBhdGghOiBzdHJpbmc7XG5cblx0QEFnZ3JlZ2F0aW9uKHsgdHlwZTogXCJzYXAudWkuY29yZS5Db250cm9sXCIsIG11bHRpcGxlOiBmYWxzZSwgaXNEZWZhdWx0OiB0cnVlIH0pXG5cdGNvbnRlbnQhOiBDb250cm9sO1xuXG5cdHJlcmVuZGVyKCkge1xuXHRcdHRoaXMuY29udGVudC5yZXJlbmRlcigpO1xuXHR9XG5cblx0Z2V0RG9tUmVmKCkge1xuXHRcdGNvbnN0IG9Db250ZW50ID0gdGhpcy5jb250ZW50O1xuXHRcdHJldHVybiBvQ29udGVudCA/IG9Db250ZW50LmdldERvbVJlZigpIDogc3VwZXIuZ2V0RG9tUmVmKCk7XG5cdH1cblx0cHJpdmF0ZSBtZXRhZGF0YTogYW55O1xuXHRwcml2YXRlIG1vZGVsUmVzb2x2ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblx0cHJvcGFnYXRlUHJvcGVydGllcyh2TmFtZTogc3RyaW5nIHwgYm9vbGVhbikge1xuXHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnRcblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0c3VwZXIucHJvcGFnYXRlUHJvcGVydGllcyh2TmFtZSk7XG5cdFx0aWYgKHRoaXMubWV0YWRhdGEubWFjcm9Db250ZXh0cyAmJiAhdGhpcy5tb2RlbFJlc29sdmVkKSB7XG5cdFx0XHRjb25zdCBvUGFnZU1vZGVsID0gdGhpcy5nZXRNb2RlbChcIl9wYWdlTW9kZWxcIik7XG5cdFx0XHRpZiAob1BhZ2VNb2RlbCkge1xuXHRcdFx0XHRPYmplY3Qua2V5cyh0aGlzLm1ldGFkYXRhLm1hY3JvQ29udGV4dHMpLmZvckVhY2goKG1hY3JvS2V5TmFtZTogc3RyaW5nKSA9PiB7XG5cdFx0XHRcdFx0dGhpc1ttYWNyb0tleU5hbWUgYXMga2V5b2YgTWFjcm9BUEldID0gb1BhZ2VNb2RlbC5nZXRPYmplY3QodGhpc1ttYWNyb0tleU5hbWUgYXMga2V5b2YgTWFjcm9BUEldIGFzIHN0cmluZyk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR0aGlzLm1vZGVsUmVzb2x2ZWQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHN0YXRpYyBnZXRBUEkob0V2ZW50OiBVSTVFdmVudCk6IE1hY3JvQVBJIHtcblx0XHRsZXQgb1NvdXJjZSA9IG9FdmVudC5nZXRTb3VyY2UoKTtcblx0XHR3aGlsZSAob1NvdXJjZSAmJiAhb1NvdXJjZS5pc0EoXCJzYXAuZmUubWFjcm9zLk1hY3JvQVBJXCIpKSB7XG5cdFx0XHRvU291cmNlID0gb1NvdXJjZS5nZXRQYXJlbnQoKTtcblx0XHR9XG5cdFx0cmV0dXJuIG9Tb3VyY2UgJiYgb1NvdXJjZS5pc0EoXCJzYXAuZmUubWFjcm9zLk1hY3JvQVBJXCIpICYmIG9Tb3VyY2U7XG5cdH1cblxuXHRzdGF0aWMgc2V0RGVmYXVsdFZhbHVlKG9Qcm9wczogYW55LCBzUHJvcE5hbWU6IHN0cmluZywgb092ZXJyaWRlVmFsdWU6IGFueSkge1xuXHRcdGlmIChvUHJvcHNbc1Byb3BOYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRvUHJvcHNbc1Byb3BOYW1lXSA9IG9PdmVycmlkZVZhbHVlO1xuXHRcdH1cblx0fVxuXHRzdGF0aWMgZ2V0Q29udmVydGVyQ29udGV4dCA9IGZ1bmN0aW9uKG9EYXRhTW9kZWxQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoLCBjb250ZXh0UGF0aDogc3RyaW5nLCBtU2V0dGluZ3M6IGFueSkge1xuXHRcdGNvbnN0IG9BcHBDb21wb25lbnQgPSBtU2V0dGluZ3MuYXBwQ29tcG9uZW50O1xuXHRcdGNvbnN0IHZpZXdEYXRhID0gbVNldHRpbmdzLm1vZGVscy52aWV3RGF0YSAmJiBtU2V0dGluZ3MubW9kZWxzLnZpZXdEYXRhLmdldERhdGEoKTtcblx0XHRjb25zdCBvQ29udmVydGVyQ29udGV4dCA9IGNyZWF0ZUNvbnZlcnRlckNvbnRleHRGb3JNYWNybyhcblx0XHRcdG9EYXRhTW9kZWxQYXRoLnN0YXJ0aW5nRW50aXR5U2V0Lm5hbWUsXG5cdFx0XHRtU2V0dGluZ3MubW9kZWxzLm1ldGFNb2RlbCxcblx0XHRcdHZpZXdEYXRhLmNvbnZlcnRlclR5cGUsXG5cdFx0XHRvQXBwQ29tcG9uZW50ICYmIG9BcHBDb21wb25lbnQuZ2V0U2hlbGxTZXJ2aWNlcygpLFxuXHRcdFx0b0FwcENvbXBvbmVudCAmJiBvQXBwQ29tcG9uZW50LmdldERpYWdub3N0aWNzKCksXG5cdFx0XHRtZXJnZSxcblx0XHRcdG9EYXRhTW9kZWxQYXRoLmNvbnRleHRMb2NhdGlvbixcblx0XHRcdHZpZXdEYXRhXG5cdFx0KTtcblx0XHRyZXR1cm4gb0NvbnZlcnRlckNvbnRleHQ7XG5cdH07XG5cdHN0YXRpYyBjcmVhdGVCaW5kaW5nQ29udGV4dCA9IGZ1bmN0aW9uKG9EYXRhOiBvYmplY3QsIG1TZXR0aW5nczogYW55KSB7XG5cdFx0Y29uc3Qgc0NvbnRleHRQYXRoID0gXCIvXCIgKyB1aWQoKTtcblx0XHRtU2V0dGluZ3MubW9kZWxzLmNvbnZlcnRlckNvbnRleHQuc2V0UHJvcGVydHkoc0NvbnRleHRQYXRoLCBvRGF0YSk7XG5cdFx0cmV0dXJuIG1TZXR0aW5ncy5tb2RlbHMuY29udmVydGVyQ29udGV4dC5jcmVhdGVCaW5kaW5nQ29udGV4dChzQ29udGV4dFBhdGgpO1xuXHR9O1xuXHRzdGF0aWMgcmVnaXN0ZXIoKSB7XG5cdFx0UGhhbnRvbVV0aWwucmVnaXN0ZXIodGhpcyk7XG5cdH1cblx0c3RhdGljIHVucmVnaXN0ZXIoKSB7XG5cdFx0KFhNTFByZXByb2Nlc3NvciBhcyBhbnkpLnBsdWdJbihudWxsLCB0aGlzLm5hbWVzcGFjZSwgdGhpcy5tYWNyb05hbWUpO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hY3JvQVBJO1xuIl19