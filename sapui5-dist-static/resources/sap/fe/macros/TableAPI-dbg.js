sap.ui.define(["sap/fe/core/helpers/ClassSupport", "sap/fe/core/helpers/PasteHelper", "sap/m/MessageBox", "sap/ui/Device", "sap/base/Log", "./MacroAPI"], function (ClassSupport, PasteHelper, MessageBox, Device, Log, MacroAPI) {
  "use strict";

  var _dec, _dec2, _class, _class2, _descriptor, _temp;

  var parseDataForTablePaste = PasteHelper.parseDataForTablePaste;
  var MacroContext = ClassSupport.MacroContext;
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
   * @classdesc
   * Content of a Field
   *
   * @class sap.fe.macros.Table
   */
  var TableAPI = (_dec = APIClass("sap.fe.macros.TableAPI"), _dec2 = MacroContext(), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_MacroAPI) {
    _inherits(TableAPI, _MacroAPI);

    var _super = _createSuper(TableAPI);

    function TableAPI() {
      var _this;

      _classCallCheck(this, TableAPI);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _initializerDefineProperty(_assertThisInitialized(_this), "tableDefinition", _descriptor, _assertThisInitialized(_this));

      return _this;
    }

    _createClass(TableAPI, [{
      key: "onPaste",
      value: function onPaste(oEvent, oController) {
        var _this2 = this;

        // If paste is disable or if we're not in edit mode, we can't paste anything
        if (!this.tableDefinition.control.enablePaste || !this.getModel("ui").getProperty("/isEditable")) {
          return;
        }

        var aRawPastedData = oEvent.getParameter("data"),
            oTable = oEvent.getSource(),
            bPasteEnabled = oTable.data()["pasteEnabled"];
        var oResourceModel;

        if (bPasteEnabled === true || bPasteEnabled === "true") {
          parseDataForTablePaste(aRawPastedData, oTable).then(function (aParsedData) {
            if (aParsedData && aParsedData.length > 0) {
              return oController.editFlow.createMultipleDocuments(oTable.getRowBinding(), aParsedData, _this2.tableDefinition.control.createAtEnd);
            }
          }).catch(function (oError) {
            Log.error("Error while pasting data", oError);
          });
        } else {
          oResourceModel = sap.ui.getCore().getLibraryResourceBundle("sap.fe.core");
          MessageBox.error(oResourceModel.getText("T_OP_CONTROLLER_SAPFE_PASTE_DISABLED_MESSAGE"), {
            title: oResourceModel.getText("C_COMMON_SAPFE_ERROR")
          });
        }
      }
    }, {
      key: "onPasteButtonPressed",
      value: function onPasteButtonPressed() {
        var _this3 = this;

        var oResourceModel = sap.ui.getCore().getLibraryResourceBundle("sap.fe.templates"),
            sDeviceOs = Device.os.name,
            sDeviceBrowser = Device.browser,
            sDeviceSystem = Device.system; // We need a default in case we fall through the crack

        var sMessageOnPasteButton = oResourceModel.getText("T_OP_CONTROLLER_TABLE_PASTE_BUTTON_ACTION_MESSAGE_WINDOWS_DESKTOP"); // On mobile, there is no native paste trigger:

        if (sDeviceBrowser.mobile) {
          sMessageOnPasteButton = oResourceModel.getText("T_OP_CONTROLLER_TABLE_PASTE_BUTTON_ACTION_MESSAGE_TOUCH_DEVICE");
        } else if (sDeviceSystem.desktop) {
          switch (sDeviceOs) {
            case "win":
              sMessageOnPasteButton = oResourceModel.getText("T_OP_CONTROLLER_TABLE_PASTE_BUTTON_ACTION_MESSAGE_WINDOWS_DESKTOP");
              break;

            case "mac":
              sMessageOnPasteButton = oResourceModel.getText("T_OP_CONTROLLER_TABLE_PASTE_BUTTON_ACTION_MESSAGE_IOS_DESKTOP");
              break;
          }
        }

        MessageBox.information(sMessageOnPasteButton, {
          onClose: function () {
            if (_this3.content) {
              var _ref;

              // Set the focus on the inner table to allow paste
              (_ref = _this3.content.getAggregation("_content")) === null || _ref === void 0 ? void 0 : _ref.applyFocusInfo({
                preventScroll: true
              });
            }
          }
        });
      }
    }]);

    return TableAPI;
  }(MacroAPI), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "tableDefinition", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _applyDecoratedDescriptor(_class2.prototype, "onPaste", [EventHandler], Object.getOwnPropertyDescriptor(_class2.prototype, "onPaste"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onPasteButtonPressed", [EventHandler], Object.getOwnPropertyDescriptor(_class2.prototype, "onPasteButtonPressed"), _class2.prototype)), _class2)) || _class);
  return TableAPI;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRhYmxlQVBJLnRzIl0sIm5hbWVzIjpbIlRhYmxlQVBJIiwiQVBJQ2xhc3MiLCJNYWNyb0NvbnRleHQiLCJvRXZlbnQiLCJvQ29udHJvbGxlciIsInRhYmxlRGVmaW5pdGlvbiIsImNvbnRyb2wiLCJlbmFibGVQYXN0ZSIsImdldE1vZGVsIiwiZ2V0UHJvcGVydHkiLCJhUmF3UGFzdGVkRGF0YSIsImdldFBhcmFtZXRlciIsIm9UYWJsZSIsImdldFNvdXJjZSIsImJQYXN0ZUVuYWJsZWQiLCJkYXRhIiwib1Jlc291cmNlTW9kZWwiLCJwYXJzZURhdGFGb3JUYWJsZVBhc3RlIiwidGhlbiIsImFQYXJzZWREYXRhIiwibGVuZ3RoIiwiZWRpdEZsb3ciLCJjcmVhdGVNdWx0aXBsZURvY3VtZW50cyIsImdldFJvd0JpbmRpbmciLCJjcmVhdGVBdEVuZCIsImNhdGNoIiwib0Vycm9yIiwiTG9nIiwiZXJyb3IiLCJzYXAiLCJ1aSIsImdldENvcmUiLCJnZXRMaWJyYXJ5UmVzb3VyY2VCdW5kbGUiLCJNZXNzYWdlQm94IiwiZ2V0VGV4dCIsInRpdGxlIiwic0RldmljZU9zIiwiRGV2aWNlIiwib3MiLCJuYW1lIiwic0RldmljZUJyb3dzZXIiLCJicm93c2VyIiwic0RldmljZVN5c3RlbSIsInN5c3RlbSIsInNNZXNzYWdlT25QYXN0ZUJ1dHRvbiIsIm1vYmlsZSIsImRlc2t0b3AiLCJpbmZvcm1hdGlvbiIsIm9uQ2xvc2UiLCJjb250ZW50IiwiZ2V0QWdncmVnYXRpb24iLCJhcHBseUZvY3VzSW5mbyIsInByZXZlbnRTY3JvbGwiLCJNYWNyb0FQSSIsIkV2ZW50SGFuZGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFVQTs7Ozs7O01BT01BLFEsV0FETEMsUUFBUSxDQUFDLHdCQUFELEMsVUFFUEMsWUFBWSxFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs4QkFJTEMsTSxFQUFrQkMsVyxFQUE2QjtBQUFBOztBQUN0RDtBQUNBLFlBQUksQ0FBQyxLQUFLQyxlQUFMLENBQXFCQyxPQUFyQixDQUE2QkMsV0FBOUIsSUFBNkMsQ0FBQyxLQUFLQyxRQUFMLENBQWMsSUFBZCxFQUFvQkMsV0FBcEIsQ0FBZ0MsYUFBaEMsQ0FBbEQsRUFBa0c7QUFDakc7QUFDQTs7QUFFRCxZQUFNQyxjQUFjLEdBQUdQLE1BQU0sQ0FBQ1EsWUFBUCxDQUFvQixNQUFwQixDQUF2QjtBQUFBLFlBQ0NDLE1BQU0sR0FBR1QsTUFBTSxDQUFDVSxTQUFQLEVBRFY7QUFBQSxZQUVDQyxhQUFhLEdBQUdGLE1BQU0sQ0FBQ0csSUFBUCxHQUFjLGNBQWQsQ0FGakI7QUFHQSxZQUFJQyxjQUFKOztBQUVBLFlBQUlGLGFBQWEsS0FBSyxJQUFsQixJQUEwQkEsYUFBYSxLQUFLLE1BQWhELEVBQXdEO0FBQ3ZERyxVQUFBQSxzQkFBc0IsQ0FBQ1AsY0FBRCxFQUFpQkUsTUFBakIsQ0FBdEIsQ0FDRU0sSUFERixDQUNPLFVBQUFDLFdBQVcsRUFBSTtBQUNwQixnQkFBSUEsV0FBVyxJQUFJQSxXQUFXLENBQUNDLE1BQVosR0FBcUIsQ0FBeEMsRUFBMkM7QUFDMUMscUJBQU9oQixXQUFXLENBQUNpQixRQUFaLENBQXFCQyx1QkFBckIsQ0FDTlYsTUFBTSxDQUFDVyxhQUFQLEVBRE0sRUFFTkosV0FGTSxFQUdOLE1BQUksQ0FBQ2QsZUFBTCxDQUFxQkMsT0FBckIsQ0FBNkJrQixXQUh2QixDQUFQO0FBS0E7QUFDRCxXQVRGLEVBVUVDLEtBVkYsQ0FVUSxVQUFBQyxNQUFNLEVBQUk7QUFDaEJDLFlBQUFBLEdBQUcsQ0FBQ0MsS0FBSixDQUFVLDBCQUFWLEVBQXNDRixNQUF0QztBQUNBLFdBWkY7QUFhQSxTQWRELE1BY087QUFDTlYsVUFBQUEsY0FBYyxHQUFHYSxHQUFHLENBQUNDLEVBQUosQ0FBT0MsT0FBUCxHQUFpQkMsd0JBQWpCLENBQTBDLGFBQTFDLENBQWpCO0FBQ0FDLFVBQUFBLFVBQVUsQ0FBQ0wsS0FBWCxDQUFpQlosY0FBYyxDQUFDa0IsT0FBZixDQUF1Qiw4Q0FBdkIsQ0FBakIsRUFBeUY7QUFDeEZDLFlBQUFBLEtBQUssRUFBRW5CLGNBQWMsQ0FBQ2tCLE9BQWYsQ0FBdUIsc0JBQXZCO0FBRGlGLFdBQXpGO0FBR0E7QUFDRDs7OzZDQUdzQjtBQUFBOztBQUN0QixZQUFNbEIsY0FBYyxHQUFHYSxHQUFHLENBQUNDLEVBQUosQ0FBT0MsT0FBUCxHQUFpQkMsd0JBQWpCLENBQTBDLGtCQUExQyxDQUF2QjtBQUFBLFlBQ0NJLFNBQVMsR0FBR0MsTUFBTSxDQUFDQyxFQUFQLENBQVVDLElBRHZCO0FBQUEsWUFFQ0MsY0FBYyxHQUFHSCxNQUFNLENBQUNJLE9BRnpCO0FBQUEsWUFHQ0MsYUFBYSxHQUFHTCxNQUFNLENBQUNNLE1BSHhCLENBRHNCLENBS3RCOztBQUNBLFlBQUlDLHFCQUE2QixHQUFHNUIsY0FBYyxDQUFDa0IsT0FBZixDQUF1QixtRUFBdkIsQ0FBcEMsQ0FOc0IsQ0FPdEI7O0FBQ0EsWUFBSU0sY0FBYyxDQUFDSyxNQUFuQixFQUEyQjtBQUMxQkQsVUFBQUEscUJBQXFCLEdBQUc1QixjQUFjLENBQUNrQixPQUFmLENBQXVCLGdFQUF2QixDQUF4QjtBQUNBLFNBRkQsTUFFTyxJQUFJUSxhQUFhLENBQUNJLE9BQWxCLEVBQTJCO0FBQ2pDLGtCQUFRVixTQUFSO0FBQ0MsaUJBQUssS0FBTDtBQUNDUSxjQUFBQSxxQkFBcUIsR0FBRzVCLGNBQWMsQ0FBQ2tCLE9BQWYsQ0FBdUIsbUVBQXZCLENBQXhCO0FBQ0E7O0FBQ0QsaUJBQUssS0FBTDtBQUNDVSxjQUFBQSxxQkFBcUIsR0FBRzVCLGNBQWMsQ0FBQ2tCLE9BQWYsQ0FBdUIsK0RBQXZCLENBQXhCO0FBQ0E7QUFORjtBQVFBOztBQUNERCxRQUFBQSxVQUFVLENBQUNjLFdBQVgsQ0FBdUJILHFCQUF2QixFQUE4QztBQUM3Q0ksVUFBQUEsT0FBTyxFQUFFLFlBQU07QUFDZCxnQkFBSSxNQUFJLENBQUNDLE9BQVQsRUFBa0I7QUFBQTs7QUFDakI7QUFDQSxzQkFBQyxNQUFJLENBQUNBLE9BQUwsQ0FBYUMsY0FBYixDQUE0QixVQUE1QixDQUFELDhDQUFrREMsY0FBbEQsQ0FBaUU7QUFBRUMsZ0JBQUFBLGFBQWEsRUFBRTtBQUFqQixlQUFqRTtBQUNBO0FBQ0Q7QUFONEMsU0FBOUM7QUFRQTs7OztJQW5FcUJDLFE7Ozs7OytEQUlyQkMsWSw0SkFrQ0FBLFk7U0FnQ2F0RCxRIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBUElDbGFzcywgRXZlbnRIYW5kbGVyLCBNYWNyb0NvbnRleHQgfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9DbGFzc1N1cHBvcnRcIjtcbmltcG9ydCB7IFVJNUV2ZW50IH0gZnJvbSBcImdsb2JhbFwiO1xuaW1wb3J0IHsgcGFyc2VEYXRhRm9yVGFibGVQYXN0ZSB9IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL1Bhc3RlSGVscGVyXCI7XG5pbXBvcnQgeyBNZXNzYWdlQm94IH0gZnJvbSBcInNhcC9tXCI7XG5pbXBvcnQgeyBEZXZpY2UgfSBmcm9tIFwic2FwL3VpXCI7XG5pbXBvcnQgeyBMb2cgfSBmcm9tIFwic2FwL2Jhc2VcIjtcbmltcG9ydCB7IFBhZ2VDb250cm9sbGVyIH0gZnJvbSBcInNhcC9mZS9jb3JlXCI7XG5pbXBvcnQgeyBUYWJsZVZpc3VhbGl6YXRpb24gfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9jb250cm9scy9Db21tb24vVGFibGVcIjtcbmltcG9ydCBNYWNyb0FQSSBmcm9tIFwiLi9NYWNyb0FQSVwiO1xuXG4vKipcbiAqIEBjbGFzc2Rlc2NcbiAqIENvbnRlbnQgb2YgYSBGaWVsZFxuICpcbiAqIEBjbGFzcyBzYXAuZmUubWFjcm9zLlRhYmxlXG4gKi9cbkBBUElDbGFzcyhcInNhcC5mZS5tYWNyb3MuVGFibGVBUElcIilcbmNsYXNzIFRhYmxlQVBJIGV4dGVuZHMgTWFjcm9BUEkge1xuXHRATWFjcm9Db250ZXh0KClcblx0dGFibGVEZWZpbml0aW9uITogVGFibGVWaXN1YWxpemF0aW9uO1xuXG5cdEBFdmVudEhhbmRsZXJcblx0b25QYXN0ZShvRXZlbnQ6IFVJNUV2ZW50LCBvQ29udHJvbGxlcjogUGFnZUNvbnRyb2xsZXIpIHtcblx0XHQvLyBJZiBwYXN0ZSBpcyBkaXNhYmxlIG9yIGlmIHdlJ3JlIG5vdCBpbiBlZGl0IG1vZGUsIHdlIGNhbid0IHBhc3RlIGFueXRoaW5nXG5cdFx0aWYgKCF0aGlzLnRhYmxlRGVmaW5pdGlvbi5jb250cm9sLmVuYWJsZVBhc3RlIHx8ICF0aGlzLmdldE1vZGVsKFwidWlcIikuZ2V0UHJvcGVydHkoXCIvaXNFZGl0YWJsZVwiKSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGFSYXdQYXN0ZWREYXRhID0gb0V2ZW50LmdldFBhcmFtZXRlcihcImRhdGFcIiksXG5cdFx0XHRvVGFibGUgPSBvRXZlbnQuZ2V0U291cmNlKCksXG5cdFx0XHRiUGFzdGVFbmFibGVkID0gb1RhYmxlLmRhdGEoKVtcInBhc3RlRW5hYmxlZFwiXTtcblx0XHRsZXQgb1Jlc291cmNlTW9kZWw7XG5cblx0XHRpZiAoYlBhc3RlRW5hYmxlZCA9PT0gdHJ1ZSB8fCBiUGFzdGVFbmFibGVkID09PSBcInRydWVcIikge1xuXHRcdFx0cGFyc2VEYXRhRm9yVGFibGVQYXN0ZShhUmF3UGFzdGVkRGF0YSwgb1RhYmxlKVxuXHRcdFx0XHQudGhlbihhUGFyc2VkRGF0YSA9PiB7XG5cdFx0XHRcdFx0aWYgKGFQYXJzZWREYXRhICYmIGFQYXJzZWREYXRhLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRcdHJldHVybiBvQ29udHJvbGxlci5lZGl0Rmxvdy5jcmVhdGVNdWx0aXBsZURvY3VtZW50cyhcblx0XHRcdFx0XHRcdFx0b1RhYmxlLmdldFJvd0JpbmRpbmcoKSxcblx0XHRcdFx0XHRcdFx0YVBhcnNlZERhdGEsXG5cdFx0XHRcdFx0XHRcdHRoaXMudGFibGVEZWZpbml0aW9uLmNvbnRyb2wuY3JlYXRlQXRFbmRcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXHRcdFx0XHQuY2F0Y2gob0Vycm9yID0+IHtcblx0XHRcdFx0XHRMb2cuZXJyb3IoXCJFcnJvciB3aGlsZSBwYXN0aW5nIGRhdGFcIiwgb0Vycm9yKTtcblx0XHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG9SZXNvdXJjZU1vZGVsID0gc2FwLnVpLmdldENvcmUoKS5nZXRMaWJyYXJ5UmVzb3VyY2VCdW5kbGUoXCJzYXAuZmUuY29yZVwiKTtcblx0XHRcdE1lc3NhZ2VCb3guZXJyb3Iob1Jlc291cmNlTW9kZWwuZ2V0VGV4dChcIlRfT1BfQ09OVFJPTExFUl9TQVBGRV9QQVNURV9ESVNBQkxFRF9NRVNTQUdFXCIpLCB7XG5cdFx0XHRcdHRpdGxlOiBvUmVzb3VyY2VNb2RlbC5nZXRUZXh0KFwiQ19DT01NT05fU0FQRkVfRVJST1JcIilcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdEBFdmVudEhhbmRsZXJcblx0b25QYXN0ZUJ1dHRvblByZXNzZWQoKSB7XG5cdFx0Y29uc3Qgb1Jlc291cmNlTW9kZWwgPSBzYXAudWkuZ2V0Q29yZSgpLmdldExpYnJhcnlSZXNvdXJjZUJ1bmRsZShcInNhcC5mZS50ZW1wbGF0ZXNcIiksXG5cdFx0XHRzRGV2aWNlT3MgPSBEZXZpY2Uub3MubmFtZSxcblx0XHRcdHNEZXZpY2VCcm93c2VyID0gRGV2aWNlLmJyb3dzZXIsXG5cdFx0XHRzRGV2aWNlU3lzdGVtID0gRGV2aWNlLnN5c3RlbTtcblx0XHQvLyBXZSBuZWVkIGEgZGVmYXVsdCBpbiBjYXNlIHdlIGZhbGwgdGhyb3VnaCB0aGUgY3JhY2tcblx0XHRsZXQgc01lc3NhZ2VPblBhc3RlQnV0dG9uOiBzdHJpbmcgPSBvUmVzb3VyY2VNb2RlbC5nZXRUZXh0KFwiVF9PUF9DT05UUk9MTEVSX1RBQkxFX1BBU1RFX0JVVFRPTl9BQ1RJT05fTUVTU0FHRV9XSU5ET1dTX0RFU0tUT1BcIik7XG5cdFx0Ly8gT24gbW9iaWxlLCB0aGVyZSBpcyBubyBuYXRpdmUgcGFzdGUgdHJpZ2dlcjpcblx0XHRpZiAoc0RldmljZUJyb3dzZXIubW9iaWxlKSB7XG5cdFx0XHRzTWVzc2FnZU9uUGFzdGVCdXR0b24gPSBvUmVzb3VyY2VNb2RlbC5nZXRUZXh0KFwiVF9PUF9DT05UUk9MTEVSX1RBQkxFX1BBU1RFX0JVVFRPTl9BQ1RJT05fTUVTU0FHRV9UT1VDSF9ERVZJQ0VcIik7XG5cdFx0fSBlbHNlIGlmIChzRGV2aWNlU3lzdGVtLmRlc2t0b3ApIHtcblx0XHRcdHN3aXRjaCAoc0RldmljZU9zKSB7XG5cdFx0XHRcdGNhc2UgXCJ3aW5cIjpcblx0XHRcdFx0XHRzTWVzc2FnZU9uUGFzdGVCdXR0b24gPSBvUmVzb3VyY2VNb2RlbC5nZXRUZXh0KFwiVF9PUF9DT05UUk9MTEVSX1RBQkxFX1BBU1RFX0JVVFRPTl9BQ1RJT05fTUVTU0FHRV9XSU5ET1dTX0RFU0tUT1BcIik7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJtYWNcIjpcblx0XHRcdFx0XHRzTWVzc2FnZU9uUGFzdGVCdXR0b24gPSBvUmVzb3VyY2VNb2RlbC5nZXRUZXh0KFwiVF9PUF9DT05UUk9MTEVSX1RBQkxFX1BBU1RFX0JVVFRPTl9BQ1RJT05fTUVTU0FHRV9JT1NfREVTS1RPUFwiKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdFx0TWVzc2FnZUJveC5pbmZvcm1hdGlvbihzTWVzc2FnZU9uUGFzdGVCdXR0b24sIHtcblx0XHRcdG9uQ2xvc2U6ICgpID0+IHtcblx0XHRcdFx0aWYgKHRoaXMuY29udGVudCkge1xuXHRcdFx0XHRcdC8vIFNldCB0aGUgZm9jdXMgb24gdGhlIGlubmVyIHRhYmxlIHRvIGFsbG93IHBhc3RlXG5cdFx0XHRcdFx0KHRoaXMuY29udGVudC5nZXRBZ2dyZWdhdGlvbihcIl9jb250ZW50XCIpIGFzIGFueSk/LmFwcGx5Rm9jdXNJbmZvKHsgcHJldmVudFNjcm9sbDogdHJ1ZSB9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRhYmxlQVBJO1xuIl19