sap.ui.define(["sap/ui/core/mvc/ControllerExtension", "sap/ui/core/mvc/OverrideExecution", "sap/fe/core/controllerextensions/ControllerExtensionMetadata", "sap/ui/core/Component", "sap/fe/core/CommonUtils", "sap/ui/base/EventProvider", "sap/base/Log", "../helpers/ClassSupport"], function (ControllerExtension, OverrideExecution, ControllerExtensionMetadata, Component, CommonUtils, EventProvider, Log, ClassSupport) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2;

  var Private = ClassSupport.Private;
  var Extensible = ClassSupport.Extensible;
  var Final = ClassSupport.Final;
  var Public = ClassSupport.Public;
  var Override = ClassSupport.Override;
  var UI5Class = ClassSupport.UI5Class;

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

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  var PageReadyControllerExtension = (_dec = UI5Class("sap.fe.core.controllerextensions.PageReady", ControllerExtensionMetadata), _dec2 = Override(), _dec3 = Override(), _dec4 = Override("_routing"), _dec5 = Override("_routing"), _dec6 = Override("_routing"), _dec7 = Extensible(OverrideExecution.Instead), _dec(_class = (_class2 = /*#__PURE__*/function (_ControllerExtension) {
    _inherits(PageReadyControllerExtension, _ControllerExtension);

    var _super = _createSuper(PageReadyControllerExtension);

    function PageReadyControllerExtension() {
      _classCallCheck(this, PageReadyControllerExtension);

      return _super.apply(this, arguments);
    }

    _createClass(PageReadyControllerExtension, [{
      key: "onInit",
      value: function onInit() {
        var _this = this;

        this._oEventProvider = new EventProvider();
        this._oView = this.base.getView();
        this._oAppComponent = CommonUtils.getAppComponent(this._oView);
        this._oPageComponent = Component.getOwnerComponentFor(this._oView);

        if (this._oPageComponent && this._oPageComponent.attachContainerDefined) {
          this._oPageComponent.attachContainerDefined(function (oEvent) {
            return _this.registerContainer(oEvent.getParameter("container"));
          });
        } else {
          this.registerContainer(this._oView);
        }
      }
    }, {
      key: "onExit",
      value: function onExit() {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete this._oAppComponent;

        this._oContainer.removeEventDelegate(this._fnContainerDelegate);
      }
    }, {
      key: "onRouteMatched",
      value: function onRouteMatched() {
        this._bIsPageReady = false;
      }
    }, {
      key: "onRouteMatchedFinished",
      value: function onRouteMatchedFinished() {
        this.checkPageReadyDebounced();
      }
    }, {
      key: "onAfterBinding",
      value: function onAfterBinding(oBindingContext) {
        var _this2 = this;

        if (!this._bAfterBindingAlreadyApplied) {
          this._bAfterBindingAlreadyApplied = true;
          var aBoundElements = [];
          var aNotBoundMDCTables = [];
          var iRequested = 0;
          var iReceived = 0;

          var fnRequested = function (oEvent) {
            oEvent.getSource().detachDataRequested(fnRequested);
            iRequested++;
            _this2.bDataReceived = false;
          };

          var fnReceived = function (oEvent) {
            switch (oEvent.getSource().sGroupId) {
              case "$auto.Workers":
                _this2._oEventProvider.fireEvent("workersBatchReceived");

                break;

              case "$auto.Heroes":
                _this2._oEventProvider.fireEvent("heroesBatchReceived");

                break;

              default:
            }

            oEvent.getSource().detachDataReceived(fnReceived);
            iReceived++;

            if (iReceived === iRequested && iRequested !== 0) {
              iRequested = 0;
              iReceived = 0;
              _this2.bDataReceived = true;

              _this2.checkPageReadyDebounced();
            }
          };

          var fnSearch = function (oEvent) {
            var aMDCTables = aNotBoundMDCTables.filter(function (oElem) {
              if (oEvent.getSource().sId === oElem.getFilter()) {
                return true;
              }

              return false;
            });
            aMDCTables.forEach(function (oMDCTable) {
              var oRowBinding = oMDCTable.getRowBinding();

              var fnAttachDataEvents = function () {
                oRowBinding.attachDataRequested(fnRequested);
                oRowBinding.attachDataReceived(fnReceived);
                aBoundElements.push(oRowBinding);
              };

              if (oRowBinding) {
                fnAttachDataEvents();
              } else {
                setTimeout(function () {
                  oRowBinding = oMDCTable.getRowBinding();

                  if (oRowBinding) {
                    fnAttachDataEvents();
                  } else {
                    Log.error("Cannot attach events to unbound table", null);
                  }
                }, 0);
              }
            });
          };

          if (this.isContextExpected() && oBindingContext === undefined) {
            // Force to mention we are expecting data
            this.bHasContext = false;
            return;
          } else {
            this.bHasContext = true;
          }

          this.attachEventOnce("pageReady", null, function () {
            aBoundElements.forEach(function (oElement) {
              oElement.detachEvent("dataRequested", fnRequested);
              oElement.detachEvent("dataReceived", fnReceived);
              oElement.detachEvent("search", fnSearch);
            });
            _this2._bAfterBindingAlreadyApplied = false;
            aBoundElements = [];
          }, null);

          if (oBindingContext) {
            var mainObjectBinding = oBindingContext.getBinding();
            mainObjectBinding.attachDataRequested(fnRequested);
            mainObjectBinding.attachDataReceived(fnReceived);
            aBoundElements.push(mainObjectBinding);
          }

          var aTableInitializedPromises = [];

          this._oView.findAggregatedObjects(true, function (oElement) {
            var oObjectBinding = oElement.getObjectBinding();

            if (oObjectBinding) {
              // Register on all object binding (mostly used on object pages)
              oObjectBinding.attachDataRequested(fnRequested);
              oObjectBinding.attachDataReceived(fnReceived);
              aBoundElements.push(oObjectBinding);
            } else {
              var aBindingKeys = Object.keys(oElement.mBindingInfos);

              if (aBindingKeys.length > 0) {
                aBindingKeys.forEach(function (sPropertyName) {
                  var oListBinding = oElement.mBindingInfos[sPropertyName].binding; // Register on all list binding, good for basic tables, problematic for MDC, see above

                  if (oListBinding && oListBinding.isA("sap.ui.model.odata.v4.ODataListBinding")) {
                    oListBinding.attachDataRequested(fnRequested);
                    oListBinding.attachDataReceived(fnReceived);
                    aBoundElements.push(oListBinding);
                  }
                });
              }
            } // This is dirty but MDC Table has a weird loading lifecycle


            if (oElement.isA("sap.ui.mdc.Table")) {
              _this2.bTablesLoaded = false; // access binding only after table is bound

              aTableInitializedPromises.push(oElement.initialized().then(function () {
                var oRowBinding = oElement.getRowBinding();

                if (oRowBinding) {
                  oRowBinding.attachDataRequested(fnRequested);
                  oRowBinding.attachDataReceived(fnReceived);
                  aBoundElements.push(oRowBinding);
                } else {
                  aNotBoundMDCTables.push(oElement);
                }
              }).catch(function (oError) {
                Log.error("Cannot find a bound table", oError);
              }));
            } else if (oElement.isA("sap.ui.mdc.FilterBar")) {
              oElement.attachEvent("search", fnSearch);
              aBoundElements.push(oElement);
            }
          });

          if (aTableInitializedPromises.length > 0) {
            Promise.all(aTableInitializedPromises).then(function () {
              _this2.bTablesLoaded = true;

              _this2.checkPageReadyDebounced();
            }).catch(function (oError) {
              Log.info("There was an error with one or multiple table", oError);
              _this2.bTablesLoaded = true;

              _this2.checkPageReadyDebounced();
            });
          }
        }
      }
    }, {
      key: "isPageReady",
      value: function isPageReady() {
        return this._bIsPageReady;
      }
    }, {
      key: "attachEventOnce",
      value: function attachEventOnce(sEventId, oData, fnFunction, oListener) {
        // eslint-disable-next-line prefer-rest-params
        return this._oEventProvider.attachEventOnce(sEventId, oData, fnFunction, oListener);
      }
    }, {
      key: "attachEvent",
      value: function attachEvent(sEventId, oData, fnFunction, oListener) {
        // eslint-disable-next-line prefer-rest-params
        return this._oEventProvider.attachEvent(sEventId, oData, fnFunction, oListener);
      }
    }, {
      key: "detachEvent",
      value: function detachEvent(sEventId, fnFunction) {
        // eslint-disable-next-line prefer-rest-params
        return this._oEventProvider.detachEvent(sEventId, fnFunction);
      }
    }, {
      key: "registerContainer",
      value: function registerContainer(oContainer) {
        var _this3 = this;

        this._oContainer = oContainer;
        this._fnContainerDelegate = {
          onBeforeShow: function () {
            _this3.bShown = false;
            _this3._bIsPageReady = false;
          },
          onBeforeHide: function () {
            _this3.bShown = false;
            _this3._bIsPageReady = false;
          },
          onAfterShow: function () {
            _this3.bShown = true;

            _this3._checkPageReady(true);
          }
        };

        this._oContainer.addEventDelegate(this._fnContainerDelegate);
      }
    }, {
      key: "isContextExpected",
      value: function isContextExpected() {
        return false;
      }
    }, {
      key: "checkPageReadyDebounced",
      value: function checkPageReadyDebounced() {
        var _this4 = this;

        if (this.pageReadyTimer) {
          clearTimeout(this.pageReadyTimer);
        }

        this.pageReadyTimer = setTimeout(function () {
          _this4._checkPageReady();
        }, 200);
      }
    }, {
      key: "_checkPageReady",
      value: function _checkPageReady() {
        var _this5 = this;

        var bFromNav = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var fnUIUpdated = function () {
          // Wait until the UI is no longer dirty
          if (!sap.ui.getCore().getUIDirty()) {
            sap.ui.getCore().detachEvent("UIUpdated", fnUIUpdated);
            _this5._bWaitingForRefresh = false;
            setTimeout(function () {
              _this5._checkPageReady();
            }, 20);
          }
        }; // In case UIUpdate does not get called, check if UI is not dirty and then call _checkPageReady


        var checkUIUpdated = function () {
          if (sap.ui.getCore().getUIDirty()) {
            setTimeout(checkUIUpdated, 500);
          } else if (_this5._bWaitingForRefresh) {
            _this5._bWaitingForRefresh = false;
            sap.ui.getCore().detachEvent("UIUpdated", fnUIUpdated);

            _this5._checkPageReady();
          }
        };

        if (this.bShown && this.bDataReceived !== false && this.bTablesLoaded !== false && (!this.isContextExpected() || this.bHasContext) // Either no context is expected or there is one
        ) {
            if (this.bDataReceived === true && !bFromNav && !this._bWaitingForRefresh && sap.ui.getCore().getUIDirty()) {
              // If we requested data we get notified as soon as the data arrived, so before the next rendering tick
              this.bDataReceived = undefined;
              this._bWaitingForRefresh = true;
              sap.ui.getCore().attachEvent("UIUpdated", fnUIUpdated);
              setTimeout(checkUIUpdated, 500);
            } else if (!this._bWaitingForRefresh && sap.ui.getCore().getUIDirty()) {
              this._bWaitingForRefresh = true;
              sap.ui.getCore().attachEvent("UIUpdated", fnUIUpdated);
              setTimeout(checkUIUpdated, 500);
            } else if (!this._bWaitingForRefresh) {
              // In the case we're not waiting for any data (navigating back to a page we already have loaded)
              // just wait for a frame to fire the event.
              this._bIsPageReady = true;

              this._oEventProvider.fireEvent("pageReady");
            }
          }
      }
    }]);

    return PageReadyControllerExtension;
  }(ControllerExtension), (_applyDecoratedDescriptor(_class2.prototype, "onInit", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "onInit"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onExit", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "onExit"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onRouteMatched", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "onRouteMatched"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onRouteMatchedFinished", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "onRouteMatchedFinished"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onAfterBinding", [_dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "onAfterBinding"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "isPageReady", [Public, Final], Object.getOwnPropertyDescriptor(_class2.prototype, "isPageReady"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "attachEventOnce", [Public, Final], Object.getOwnPropertyDescriptor(_class2.prototype, "attachEventOnce"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "attachEvent", [Public, Final], Object.getOwnPropertyDescriptor(_class2.prototype, "attachEvent"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "detachEvent", [Public, Final], Object.getOwnPropertyDescriptor(_class2.prototype, "detachEvent"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "isContextExpected", [Private, _dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "isContextExpected"), _class2.prototype)), _class2)) || _class);
  return PageReadyControllerExtension;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBhZ2VSZWFkeS50cyJdLCJuYW1lcyI6WyJQYWdlUmVhZHlDb250cm9sbGVyRXh0ZW5zaW9uIiwiVUk1Q2xhc3MiLCJDb250cm9sbGVyRXh0ZW5zaW9uTWV0YWRhdGEiLCJPdmVycmlkZSIsIkV4dGVuc2libGUiLCJPdmVycmlkZUV4ZWN1dGlvbiIsIkluc3RlYWQiLCJfb0V2ZW50UHJvdmlkZXIiLCJFdmVudFByb3ZpZGVyIiwiX29WaWV3IiwiYmFzZSIsImdldFZpZXciLCJfb0FwcENvbXBvbmVudCIsIkNvbW1vblV0aWxzIiwiZ2V0QXBwQ29tcG9uZW50IiwiX29QYWdlQ29tcG9uZW50IiwiQ29tcG9uZW50IiwiZ2V0T3duZXJDb21wb25lbnRGb3IiLCJhdHRhY2hDb250YWluZXJEZWZpbmVkIiwib0V2ZW50IiwicmVnaXN0ZXJDb250YWluZXIiLCJnZXRQYXJhbWV0ZXIiLCJfb0NvbnRhaW5lciIsInJlbW92ZUV2ZW50RGVsZWdhdGUiLCJfZm5Db250YWluZXJEZWxlZ2F0ZSIsIl9iSXNQYWdlUmVhZHkiLCJjaGVja1BhZ2VSZWFkeURlYm91bmNlZCIsIm9CaW5kaW5nQ29udGV4dCIsIl9iQWZ0ZXJCaW5kaW5nQWxyZWFkeUFwcGxpZWQiLCJhQm91bmRFbGVtZW50cyIsImFOb3RCb3VuZE1EQ1RhYmxlcyIsImlSZXF1ZXN0ZWQiLCJpUmVjZWl2ZWQiLCJmblJlcXVlc3RlZCIsImdldFNvdXJjZSIsImRldGFjaERhdGFSZXF1ZXN0ZWQiLCJiRGF0YVJlY2VpdmVkIiwiZm5SZWNlaXZlZCIsInNHcm91cElkIiwiZmlyZUV2ZW50IiwiZGV0YWNoRGF0YVJlY2VpdmVkIiwiZm5TZWFyY2giLCJhTURDVGFibGVzIiwiZmlsdGVyIiwib0VsZW0iLCJzSWQiLCJnZXRGaWx0ZXIiLCJmb3JFYWNoIiwib01EQ1RhYmxlIiwib1Jvd0JpbmRpbmciLCJnZXRSb3dCaW5kaW5nIiwiZm5BdHRhY2hEYXRhRXZlbnRzIiwiYXR0YWNoRGF0YVJlcXVlc3RlZCIsImF0dGFjaERhdGFSZWNlaXZlZCIsInB1c2giLCJzZXRUaW1lb3V0IiwiTG9nIiwiZXJyb3IiLCJpc0NvbnRleHRFeHBlY3RlZCIsInVuZGVmaW5lZCIsImJIYXNDb250ZXh0IiwiYXR0YWNoRXZlbnRPbmNlIiwib0VsZW1lbnQiLCJkZXRhY2hFdmVudCIsIm1haW5PYmplY3RCaW5kaW5nIiwiZ2V0QmluZGluZyIsImFUYWJsZUluaXRpYWxpemVkUHJvbWlzZXMiLCJmaW5kQWdncmVnYXRlZE9iamVjdHMiLCJvT2JqZWN0QmluZGluZyIsImdldE9iamVjdEJpbmRpbmciLCJhQmluZGluZ0tleXMiLCJPYmplY3QiLCJrZXlzIiwibUJpbmRpbmdJbmZvcyIsImxlbmd0aCIsInNQcm9wZXJ0eU5hbWUiLCJvTGlzdEJpbmRpbmciLCJiaW5kaW5nIiwiaXNBIiwiYlRhYmxlc0xvYWRlZCIsImluaXRpYWxpemVkIiwidGhlbiIsImNhdGNoIiwib0Vycm9yIiwiYXR0YWNoRXZlbnQiLCJQcm9taXNlIiwiYWxsIiwiaW5mbyIsInNFdmVudElkIiwib0RhdGEiLCJmbkZ1bmN0aW9uIiwib0xpc3RlbmVyIiwib0NvbnRhaW5lciIsIm9uQmVmb3JlU2hvdyIsImJTaG93biIsIm9uQmVmb3JlSGlkZSIsIm9uQWZ0ZXJTaG93IiwiX2NoZWNrUGFnZVJlYWR5IiwiYWRkRXZlbnREZWxlZ2F0ZSIsInBhZ2VSZWFkeVRpbWVyIiwiY2xlYXJUaW1lb3V0IiwiYkZyb21OYXYiLCJmblVJVXBkYXRlZCIsInNhcCIsInVpIiwiZ2V0Q29yZSIsImdldFVJRGlydHkiLCJfYldhaXRpbmdGb3JSZWZyZXNoIiwiY2hlY2tVSVVwZGF0ZWQiLCJDb250cm9sbGVyRXh0ZW5zaW9uIiwiUHVibGljIiwiRmluYWwiLCJQcml2YXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BV01BLDRCLFdBRExDLFFBQVEsQ0FBQyw0Q0FBRCxFQUErQ0MsMkJBQS9DLEMsVUFrQlBDLFFBQVEsRSxVQWNSQSxRQUFRLEUs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TSxtQkFBbEQsSUFBeUVKLEdBQUcsQ0FBQ0MsRUFBSixDQUFPQyxPQUFQLEdBQWlCQyxVQUFqQixFQUE3RSxFQUE0RztBQUMzRztBQUNBLG1CQUFLdEUsYUFBTCxHQUFxQnVCLFNBQXJCO0FBQ0EsbUJBQUtnRCxtQkFBTCxHQUEyQixJQUEzQjtBQUNBSixjQUFBQSxHQUFHLENBQUNDLEVBQUosQ0FBT0MsT0FBUCxHQUFpQnJCLFdBQWpCLENBQTZCLFdBQTdCLEVBQTBDa0IsV0FBMUM7QUFDQS9DLGNBQUFBLFVBQVUsQ0FBQ3FELGNBQUQsRUFBaUIsR0FBakIsQ0FBVjtBQUNBLGFBTkQsTUFNTyxJQUFJLENBQUMsS0FBS0QsbUJBQU4sSUFBNkJKLEdBQUcsQ0FBQ0MsRUFBSixDQUFPQyxPQUFQLEdBQWlCQyxVQUFqQixFQUFqQyxFQUFnRTtBQUN0RSxtQkFBS0MsbUJBQUwsR0FBMkIsSUFBM0I7QUFDQUosY0FBQUEsR0FBRyxDQUFDQyxFQUFKLENBQU9DLE9BQVAsR0FBaUJyQixXQUFqQixDQUE2QixXQUE3QixFQUEwQ2tCLFdBQTFDO0FBQ0EvQyxjQUFBQSxVQUFVLENBQUNxRCxjQUFELEVBQWlCLEdBQWpCLENBQVY7QUFDQSxhQUpNLE1BSUEsSUFBSSxDQUFDLEtBQUtELG1CQUFWLEVBQStCO0FBQ3JDO0FBQ0E7QUFDQSxtQkFBS2xGLGFBQUwsR0FBcUIsSUFBckI7O0FBQ0EsbUJBQUtsQixlQUFMLENBQXFCZ0MsU0FBckIsQ0FBK0IsV0FBL0I7QUFDQTtBQUNEO0FBQ0Q7Ozs7SUEvU3lDc0UsbUIsMjFCQXdNekNDLE0sRUFDQUMsSywySkFJQUQsTSxFQUNBQyxLLDJKQUtBRCxNLEVBQ0FDLEssdUpBS0FELE0sRUFDQUMsSyw2SkF3QkFDLE87U0FnRWFoSCw0QiIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29udHJvbGxlckV4dGVuc2lvbiwgT3ZlcnJpZGVFeGVjdXRpb24gfSBmcm9tIFwic2FwL3VpL2NvcmUvbXZjXCI7XG5pbXBvcnQgeyBDb250cm9sbGVyRXh0ZW5zaW9uTWV0YWRhdGEgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udHJvbGxlcmV4dGVuc2lvbnNcIjtcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCJzYXAvdWkvY29yZVwiO1xuaW1wb3J0IHsgQXBwQ29tcG9uZW50LCBDb21tb25VdGlscyB9IGZyb20gXCJzYXAvZmUvY29yZVwiO1xuaW1wb3J0IHsgTWFuYWdlZE9iamVjdCwgRXZlbnRQcm92aWRlciB9IGZyb20gXCJzYXAvdWkvYmFzZVwiO1xuaW1wb3J0IHsgTG9nIH0gZnJvbSBcInNhcC9iYXNlXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcInNhcC91aS9tb2RlbFwiO1xuaW1wb3J0IHsgVUk1RXZlbnQgfSBmcm9tIFwiZ2xvYmFsXCI7XG5pbXBvcnQgeyBVSTVDbGFzcywgT3ZlcnJpZGUsIFB1YmxpYywgRmluYWwsIEV4dGVuc2libGUsIFByaXZhdGUgfSBmcm9tIFwiLi4vaGVscGVycy9DbGFzc1N1cHBvcnRcIjtcblxuQFVJNUNsYXNzKFwic2FwLmZlLmNvcmUuY29udHJvbGxlcmV4dGVuc2lvbnMuUGFnZVJlYWR5XCIsIENvbnRyb2xsZXJFeHRlbnNpb25NZXRhZGF0YSlcbmNsYXNzIFBhZ2VSZWFkeUNvbnRyb2xsZXJFeHRlbnNpb24gZXh0ZW5kcyBDb250cm9sbGVyRXh0ZW5zaW9uIHtcblx0cHJpdmF0ZSBfb0V2ZW50UHJvdmlkZXIhOiBFdmVudFByb3ZpZGVyO1xuXHRwcml2YXRlIF9vVmlldzogYW55O1xuXHRwcml2YXRlIF9vQXBwQ29tcG9uZW50ITogQXBwQ29tcG9uZW50O1xuXHRwcml2YXRlIF9vUGFnZUNvbXBvbmVudCE6IGFueTtcblx0cHJpdmF0ZSBfb0NvbnRhaW5lciE6IGFueTtcblx0cHJpdmF0ZSBfYkFmdGVyQmluZGluZ0FscmVhZHlBcHBsaWVkITogYm9vbGVhbjtcblx0cHJpdmF0ZSBfZm5Db250YWluZXJEZWxlZ2F0ZTogYW55O1xuXG5cdHByaXZhdGUgX2JJc1BhZ2VSZWFkeSE6IGJvb2xlYW47XG5cdHByaXZhdGUgX2JXYWl0aW5nRm9yUmVmcmVzaCE6IGJvb2xlYW47XG5cdHByaXZhdGUgYlNob3duITogYm9vbGVhbjtcblx0cHJpdmF0ZSBiSGFzQ29udGV4dCE6IGJvb2xlYW47XG5cdHByaXZhdGUgYkRhdGFSZWNlaXZlZDogYm9vbGVhbiB8IHVuZGVmaW5lZDtcblx0cHJpdmF0ZSBiVGFibGVzTG9hZGVkOiBib29sZWFuIHwgdW5kZWZpbmVkO1xuXHRwcml2YXRlIHBhZ2VSZWFkeVRpbWVyOiBOb2RlSlMuVGltZW91dCB8IHVuZGVmaW5lZDtcblxuXHRAT3ZlcnJpZGUoKVxuXHRwdWJsaWMgb25Jbml0KCkge1xuXHRcdHRoaXMuX29FdmVudFByb3ZpZGVyID0gbmV3IEV2ZW50UHJvdmlkZXIoKTtcblx0XHR0aGlzLl9vVmlldyA9ICh0aGlzIGFzIGFueSkuYmFzZS5nZXRWaWV3KCk7XG5cdFx0dGhpcy5fb0FwcENvbXBvbmVudCA9IENvbW1vblV0aWxzLmdldEFwcENvbXBvbmVudCh0aGlzLl9vVmlldyk7XG5cdFx0dGhpcy5fb1BhZ2VDb21wb25lbnQgPSBDb21wb25lbnQuZ2V0T3duZXJDb21wb25lbnRGb3IodGhpcy5fb1ZpZXcpO1xuXG5cdFx0aWYgKHRoaXMuX29QYWdlQ29tcG9uZW50ICYmIHRoaXMuX29QYWdlQ29tcG9uZW50LmF0dGFjaENvbnRhaW5lckRlZmluZWQpIHtcblx0XHRcdHRoaXMuX29QYWdlQ29tcG9uZW50LmF0dGFjaENvbnRhaW5lckRlZmluZWQoKG9FdmVudDogVUk1RXZlbnQpID0+IHRoaXMucmVnaXN0ZXJDb250YWluZXIob0V2ZW50LmdldFBhcmFtZXRlcihcImNvbnRhaW5lclwiKSkpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnJlZ2lzdGVyQ29udGFpbmVyKHRoaXMuX29WaWV3KTtcblx0XHR9XG5cdH1cblxuXHRAT3ZlcnJpZGUoKVxuXHRwdWJsaWMgb25FeGl0KCkge1xuXHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnRcblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0ZGVsZXRlIHRoaXMuX29BcHBDb21wb25lbnQ7XG5cdFx0dGhpcy5fb0NvbnRhaW5lci5yZW1vdmVFdmVudERlbGVnYXRlKHRoaXMuX2ZuQ29udGFpbmVyRGVsZWdhdGUpO1xuXHR9XG5cblx0QE92ZXJyaWRlKFwiX3JvdXRpbmdcIilcblx0b25Sb3V0ZU1hdGNoZWQoKSB7XG5cdFx0dGhpcy5fYklzUGFnZVJlYWR5ID0gZmFsc2U7XG5cdH1cblx0QE92ZXJyaWRlKFwiX3JvdXRpbmdcIilcblx0b25Sb3V0ZU1hdGNoZWRGaW5pc2hlZCgpIHtcblx0XHR0aGlzLmNoZWNrUGFnZVJlYWR5RGVib3VuY2VkKCk7XG5cdH1cblxuXHRAT3ZlcnJpZGUoXCJfcm91dGluZ1wiKVxuXHRvbkFmdGVyQmluZGluZyhvQmluZGluZ0NvbnRleHQ6IENvbnRleHQpIHtcblx0XHRpZiAoIXRoaXMuX2JBZnRlckJpbmRpbmdBbHJlYWR5QXBwbGllZCkge1xuXHRcdFx0dGhpcy5fYkFmdGVyQmluZGluZ0FscmVhZHlBcHBsaWVkID0gdHJ1ZTtcblx0XHRcdGxldCBhQm91bmRFbGVtZW50czogYW55W10gPSBbXTtcblx0XHRcdGNvbnN0IGFOb3RCb3VuZE1EQ1RhYmxlczogYW55W10gPSBbXTtcblx0XHRcdGxldCBpUmVxdWVzdGVkID0gMDtcblx0XHRcdGxldCBpUmVjZWl2ZWQgPSAwO1xuXHRcdFx0Y29uc3QgZm5SZXF1ZXN0ZWQgPSAob0V2ZW50OiBVSTVFdmVudCkgPT4ge1xuXHRcdFx0XHRvRXZlbnQuZ2V0U291cmNlKCkuZGV0YWNoRGF0YVJlcXVlc3RlZChmblJlcXVlc3RlZCk7XG5cdFx0XHRcdGlSZXF1ZXN0ZWQrKztcblx0XHRcdFx0dGhpcy5iRGF0YVJlY2VpdmVkID0gZmFsc2U7XG5cdFx0XHR9O1xuXHRcdFx0Y29uc3QgZm5SZWNlaXZlZCA9IChvRXZlbnQ6IFVJNUV2ZW50KSA9PiB7XG5cdFx0XHRcdHN3aXRjaCAob0V2ZW50LmdldFNvdXJjZSgpLnNHcm91cElkKSB7XG5cdFx0XHRcdFx0Y2FzZSBcIiRhdXRvLldvcmtlcnNcIjpcblx0XHRcdFx0XHRcdHRoaXMuX29FdmVudFByb3ZpZGVyLmZpcmVFdmVudChcIndvcmtlcnNCYXRjaFJlY2VpdmVkXCIpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBcIiRhdXRvLkhlcm9lc1wiOlxuXHRcdFx0XHRcdFx0dGhpcy5fb0V2ZW50UHJvdmlkZXIuZmlyZUV2ZW50KFwiaGVyb2VzQmF0Y2hSZWNlaXZlZFwiKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdH1cblx0XHRcdFx0b0V2ZW50LmdldFNvdXJjZSgpLmRldGFjaERhdGFSZWNlaXZlZChmblJlY2VpdmVkKTtcblx0XHRcdFx0aVJlY2VpdmVkKys7XG5cdFx0XHRcdGlmIChpUmVjZWl2ZWQgPT09IGlSZXF1ZXN0ZWQgJiYgaVJlcXVlc3RlZCAhPT0gMCkge1xuXHRcdFx0XHRcdGlSZXF1ZXN0ZWQgPSAwO1xuXHRcdFx0XHRcdGlSZWNlaXZlZCA9IDA7XG5cdFx0XHRcdFx0dGhpcy5iRGF0YVJlY2VpdmVkID0gdHJ1ZTtcblx0XHRcdFx0XHR0aGlzLmNoZWNrUGFnZVJlYWR5RGVib3VuY2VkKCk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0XHRjb25zdCBmblNlYXJjaCA9IGZ1bmN0aW9uKG9FdmVudDogVUk1RXZlbnQpIHtcblx0XHRcdFx0Y29uc3QgYU1EQ1RhYmxlcyA9IGFOb3RCb3VuZE1EQ1RhYmxlcy5maWx0ZXIob0VsZW0gPT4ge1xuXHRcdFx0XHRcdGlmIChvRXZlbnQuZ2V0U291cmNlKCkuc0lkID09PSBvRWxlbS5nZXRGaWx0ZXIoKSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGFNRENUYWJsZXMuZm9yRWFjaCgob01EQ1RhYmxlOiBhbnkpID0+IHtcblx0XHRcdFx0XHRsZXQgb1Jvd0JpbmRpbmcgPSBvTURDVGFibGUuZ2V0Um93QmluZGluZygpO1xuXHRcdFx0XHRcdGNvbnN0IGZuQXR0YWNoRGF0YUV2ZW50cyA9ICgpID0+IHtcblx0XHRcdFx0XHRcdG9Sb3dCaW5kaW5nLmF0dGFjaERhdGFSZXF1ZXN0ZWQoZm5SZXF1ZXN0ZWQpO1xuXHRcdFx0XHRcdFx0b1Jvd0JpbmRpbmcuYXR0YWNoRGF0YVJlY2VpdmVkKGZuUmVjZWl2ZWQpO1xuXHRcdFx0XHRcdFx0YUJvdW5kRWxlbWVudHMucHVzaChvUm93QmluZGluZyk7XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRpZiAob1Jvd0JpbmRpbmcpIHtcblx0XHRcdFx0XHRcdGZuQXR0YWNoRGF0YUV2ZW50cygpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0XHRcdFx0b1Jvd0JpbmRpbmcgPSBvTURDVGFibGUuZ2V0Um93QmluZGluZygpO1xuXHRcdFx0XHRcdFx0XHRpZiAob1Jvd0JpbmRpbmcpIHtcblx0XHRcdFx0XHRcdFx0XHRmbkF0dGFjaERhdGFFdmVudHMoKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRMb2cuZXJyb3IoXCJDYW5ub3QgYXR0YWNoIGV2ZW50cyB0byB1bmJvdW5kIHRhYmxlXCIsIG51bGwpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9LCAwKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fTtcblx0XHRcdGlmICh0aGlzLmlzQ29udGV4dEV4cGVjdGVkKCkgJiYgb0JpbmRpbmdDb250ZXh0ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0Ly8gRm9yY2UgdG8gbWVudGlvbiB3ZSBhcmUgZXhwZWN0aW5nIGRhdGFcblx0XHRcdFx0dGhpcy5iSGFzQ29udGV4dCA9IGZhbHNlO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLmJIYXNDb250ZXh0ID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5hdHRhY2hFdmVudE9uY2UoXG5cdFx0XHRcdFwicGFnZVJlYWR5XCIsXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdCgpID0+IHtcblx0XHRcdFx0XHRhQm91bmRFbGVtZW50cy5mb3JFYWNoKChvRWxlbWVudDogYW55KSA9PiB7XG5cdFx0XHRcdFx0XHRvRWxlbWVudC5kZXRhY2hFdmVudChcImRhdGFSZXF1ZXN0ZWRcIiwgZm5SZXF1ZXN0ZWQpO1xuXHRcdFx0XHRcdFx0b0VsZW1lbnQuZGV0YWNoRXZlbnQoXCJkYXRhUmVjZWl2ZWRcIiwgZm5SZWNlaXZlZCk7XG5cdFx0XHRcdFx0XHRvRWxlbWVudC5kZXRhY2hFdmVudChcInNlYXJjaFwiLCBmblNlYXJjaCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0dGhpcy5fYkFmdGVyQmluZGluZ0FscmVhZHlBcHBsaWVkID0gZmFsc2U7XG5cdFx0XHRcdFx0YUJvdW5kRWxlbWVudHMgPSBbXTtcblx0XHRcdFx0fSxcblx0XHRcdFx0bnVsbFxuXHRcdFx0KTtcblx0XHRcdGlmIChvQmluZGluZ0NvbnRleHQpIHtcblx0XHRcdFx0Y29uc3QgbWFpbk9iamVjdEJpbmRpbmcgPSAob0JpbmRpbmdDb250ZXh0IGFzIGFueSkuZ2V0QmluZGluZygpO1xuXHRcdFx0XHRtYWluT2JqZWN0QmluZGluZy5hdHRhY2hEYXRhUmVxdWVzdGVkKGZuUmVxdWVzdGVkKTtcblx0XHRcdFx0bWFpbk9iamVjdEJpbmRpbmcuYXR0YWNoRGF0YVJlY2VpdmVkKGZuUmVjZWl2ZWQpO1xuXHRcdFx0XHRhQm91bmRFbGVtZW50cy5wdXNoKG1haW5PYmplY3RCaW5kaW5nKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgYVRhYmxlSW5pdGlhbGl6ZWRQcm9taXNlczogUHJvbWlzZTxhbnk+W10gPSBbXTtcblx0XHRcdHRoaXMuX29WaWV3LmZpbmRBZ2dyZWdhdGVkT2JqZWN0cyh0cnVlLCAob0VsZW1lbnQ6IGFueSkgPT4ge1xuXHRcdFx0XHRjb25zdCBvT2JqZWN0QmluZGluZyA9IG9FbGVtZW50LmdldE9iamVjdEJpbmRpbmcoKTtcblx0XHRcdFx0aWYgKG9PYmplY3RCaW5kaW5nKSB7XG5cdFx0XHRcdFx0Ly8gUmVnaXN0ZXIgb24gYWxsIG9iamVjdCBiaW5kaW5nIChtb3N0bHkgdXNlZCBvbiBvYmplY3QgcGFnZXMpXG5cdFx0XHRcdFx0b09iamVjdEJpbmRpbmcuYXR0YWNoRGF0YVJlcXVlc3RlZChmblJlcXVlc3RlZCk7XG5cdFx0XHRcdFx0b09iamVjdEJpbmRpbmcuYXR0YWNoRGF0YVJlY2VpdmVkKGZuUmVjZWl2ZWQpO1xuXHRcdFx0XHRcdGFCb3VuZEVsZW1lbnRzLnB1c2gob09iamVjdEJpbmRpbmcpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnN0IGFCaW5kaW5nS2V5cyA9IE9iamVjdC5rZXlzKG9FbGVtZW50Lm1CaW5kaW5nSW5mb3MpO1xuXHRcdFx0XHRcdGlmIChhQmluZGluZ0tleXMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdFx0YUJpbmRpbmdLZXlzLmZvckVhY2goc1Byb3BlcnR5TmFtZSA9PiB7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IG9MaXN0QmluZGluZyA9IG9FbGVtZW50Lm1CaW5kaW5nSW5mb3Nbc1Byb3BlcnR5TmFtZV0uYmluZGluZztcblx0XHRcdFx0XHRcdFx0Ly8gUmVnaXN0ZXIgb24gYWxsIGxpc3QgYmluZGluZywgZ29vZCBmb3IgYmFzaWMgdGFibGVzLCBwcm9ibGVtYXRpYyBmb3IgTURDLCBzZWUgYWJvdmVcblx0XHRcdFx0XHRcdFx0aWYgKG9MaXN0QmluZGluZyAmJiBvTGlzdEJpbmRpbmcuaXNBKFwic2FwLnVpLm1vZGVsLm9kYXRhLnY0Lk9EYXRhTGlzdEJpbmRpbmdcIikpIHtcblx0XHRcdFx0XHRcdFx0XHRvTGlzdEJpbmRpbmcuYXR0YWNoRGF0YVJlcXVlc3RlZChmblJlcXVlc3RlZCk7XG5cdFx0XHRcdFx0XHRcdFx0b0xpc3RCaW5kaW5nLmF0dGFjaERhdGFSZWNlaXZlZChmblJlY2VpdmVkKTtcblx0XHRcdFx0XHRcdFx0XHRhQm91bmRFbGVtZW50cy5wdXNoKG9MaXN0QmluZGluZyk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBUaGlzIGlzIGRpcnR5IGJ1dCBNREMgVGFibGUgaGFzIGEgd2VpcmQgbG9hZGluZyBsaWZlY3ljbGVcblx0XHRcdFx0aWYgKG9FbGVtZW50LmlzQShcInNhcC51aS5tZGMuVGFibGVcIikpIHtcblx0XHRcdFx0XHR0aGlzLmJUYWJsZXNMb2FkZWQgPSBmYWxzZTtcblx0XHRcdFx0XHQvLyBhY2Nlc3MgYmluZGluZyBvbmx5IGFmdGVyIHRhYmxlIGlzIGJvdW5kXG5cdFx0XHRcdFx0YVRhYmxlSW5pdGlhbGl6ZWRQcm9taXNlcy5wdXNoKFxuXHRcdFx0XHRcdFx0b0VsZW1lbnRcblx0XHRcdFx0XHRcdFx0LmluaXRpYWxpemVkKClcblx0XHRcdFx0XHRcdFx0LnRoZW4oKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IG9Sb3dCaW5kaW5nID0gb0VsZW1lbnQuZ2V0Um93QmluZGluZygpO1xuXHRcdFx0XHRcdFx0XHRcdGlmIChvUm93QmluZGluZykge1xuXHRcdFx0XHRcdFx0XHRcdFx0b1Jvd0JpbmRpbmcuYXR0YWNoRGF0YVJlcXVlc3RlZChmblJlcXVlc3RlZCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRvUm93QmluZGluZy5hdHRhY2hEYXRhUmVjZWl2ZWQoZm5SZWNlaXZlZCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRhQm91bmRFbGVtZW50cy5wdXNoKG9Sb3dCaW5kaW5nKTtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0YU5vdEJvdW5kTURDVGFibGVzLnB1c2gob0VsZW1lbnQpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdFx0LmNhdGNoKGZ1bmN0aW9uKG9FcnJvcjogRXJyb3IpIHtcblx0XHRcdFx0XHRcdFx0XHRMb2cuZXJyb3IoXCJDYW5ub3QgZmluZCBhIGJvdW5kIHRhYmxlXCIsIG9FcnJvcik7XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSBlbHNlIGlmIChvRWxlbWVudC5pc0EoXCJzYXAudWkubWRjLkZpbHRlckJhclwiKSkge1xuXHRcdFx0XHRcdG9FbGVtZW50LmF0dGFjaEV2ZW50KFwic2VhcmNoXCIsIGZuU2VhcmNoKTtcblx0XHRcdFx0XHRhQm91bmRFbGVtZW50cy5wdXNoKG9FbGVtZW50KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRpZiAoYVRhYmxlSW5pdGlhbGl6ZWRQcm9taXNlcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFByb21pc2UuYWxsKGFUYWJsZUluaXRpYWxpemVkUHJvbWlzZXMpXG5cdFx0XHRcdFx0LnRoZW4oKCkgPT4ge1xuXHRcdFx0XHRcdFx0dGhpcy5iVGFibGVzTG9hZGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdHRoaXMuY2hlY2tQYWdlUmVhZHlEZWJvdW5jZWQoKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5jYXRjaChvRXJyb3IgPT4ge1xuXHRcdFx0XHRcdFx0TG9nLmluZm8oXCJUaGVyZSB3YXMgYW4gZXJyb3Igd2l0aCBvbmUgb3IgbXVsdGlwbGUgdGFibGVcIiwgb0Vycm9yKTtcblx0XHRcdFx0XHRcdHRoaXMuYlRhYmxlc0xvYWRlZCA9IHRydWU7XG5cdFx0XHRcdFx0XHR0aGlzLmNoZWNrUGFnZVJlYWR5RGVib3VuY2VkKCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0QFB1YmxpY1xuXHRARmluYWxcblx0cHVibGljIGlzUGFnZVJlYWR5KCkge1xuXHRcdHJldHVybiB0aGlzLl9iSXNQYWdlUmVhZHk7XG5cdH1cblx0QFB1YmxpY1xuXHRARmluYWxcblx0cHVibGljIGF0dGFjaEV2ZW50T25jZShzRXZlbnRJZDogc3RyaW5nLCBvRGF0YTogYW55LCBmbkZ1bmN0aW9uOiBGdW5jdGlvbiwgb0xpc3RlbmVyOiBhbnkpIHtcblx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJlZmVyLXJlc3QtcGFyYW1zXG5cdFx0cmV0dXJuIHRoaXMuX29FdmVudFByb3ZpZGVyLmF0dGFjaEV2ZW50T25jZShzRXZlbnRJZCwgb0RhdGEsIGZuRnVuY3Rpb24sIG9MaXN0ZW5lcik7XG5cdH1cblx0QFB1YmxpY1xuXHRARmluYWxcblx0cHVibGljIGF0dGFjaEV2ZW50KHNFdmVudElkOiBzdHJpbmcsIG9EYXRhOiBhbnksIGZuRnVuY3Rpb246IEZ1bmN0aW9uLCBvTGlzdGVuZXI6IGFueSkge1xuXHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcmVmZXItcmVzdC1wYXJhbXNcblx0XHRyZXR1cm4gdGhpcy5fb0V2ZW50UHJvdmlkZXIuYXR0YWNoRXZlbnQoc0V2ZW50SWQsIG9EYXRhLCBmbkZ1bmN0aW9uLCBvTGlzdGVuZXIpO1xuXHR9XG5cdEBQdWJsaWNcblx0QEZpbmFsXG5cdHB1YmxpYyBkZXRhY2hFdmVudChzRXZlbnRJZDogc3RyaW5nLCBmbkZ1bmN0aW9uOiBGdW5jdGlvbikge1xuXHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcmVmZXItcmVzdC1wYXJhbXNcblx0XHRyZXR1cm4gdGhpcy5fb0V2ZW50UHJvdmlkZXIuZGV0YWNoRXZlbnQoc0V2ZW50SWQsIGZuRnVuY3Rpb24pO1xuXHR9XG5cdHByaXZhdGUgcmVnaXN0ZXJDb250YWluZXIob0NvbnRhaW5lcjogTWFuYWdlZE9iamVjdCkge1xuXHRcdHRoaXMuX29Db250YWluZXIgPSBvQ29udGFpbmVyO1xuXHRcdHRoaXMuX2ZuQ29udGFpbmVyRGVsZWdhdGUgPSB7XG5cdFx0XHRvbkJlZm9yZVNob3c6ICgpID0+IHtcblx0XHRcdFx0dGhpcy5iU2hvd24gPSBmYWxzZTtcblx0XHRcdFx0dGhpcy5fYklzUGFnZVJlYWR5ID0gZmFsc2U7XG5cdFx0XHR9LFxuXHRcdFx0b25CZWZvcmVIaWRlOiAoKSA9PiB7XG5cdFx0XHRcdHRoaXMuYlNob3duID0gZmFsc2U7XG5cdFx0XHRcdHRoaXMuX2JJc1BhZ2VSZWFkeSA9IGZhbHNlO1xuXHRcdFx0fSxcblx0XHRcdG9uQWZ0ZXJTaG93OiAoKSA9PiB7XG5cdFx0XHRcdHRoaXMuYlNob3duID0gdHJ1ZTtcblx0XHRcdFx0dGhpcy5fY2hlY2tQYWdlUmVhZHkodHJ1ZSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHR0aGlzLl9vQ29udGFpbmVyLmFkZEV2ZW50RGVsZWdhdGUodGhpcy5fZm5Db250YWluZXJEZWxlZ2F0ZSk7XG5cdH1cblxuXHRAUHJpdmF0ZVxuXHRARXh0ZW5zaWJsZShPdmVycmlkZUV4ZWN1dGlvbi5JbnN0ZWFkKVxuXHRwdWJsaWMgaXNDb250ZXh0RXhwZWN0ZWQoKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0cHVibGljIGNoZWNrUGFnZVJlYWR5RGVib3VuY2VkKCkge1xuXHRcdGlmICh0aGlzLnBhZ2VSZWFkeVRpbWVyKSB7XG5cdFx0XHRjbGVhclRpbWVvdXQodGhpcy5wYWdlUmVhZHlUaW1lcik7XG5cdFx0fVxuXHRcdHRoaXMucGFnZVJlYWR5VGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdHRoaXMuX2NoZWNrUGFnZVJlYWR5KCk7XG5cdFx0fSwgMjAwKTtcblx0fVxuXG5cdHB1YmxpYyBfY2hlY2tQYWdlUmVhZHkoYkZyb21OYXY6IGJvb2xlYW4gPSBmYWxzZSkge1xuXHRcdGNvbnN0IGZuVUlVcGRhdGVkID0gKCkgPT4ge1xuXHRcdFx0Ly8gV2FpdCB1bnRpbCB0aGUgVUkgaXMgbm8gbG9uZ2VyIGRpcnR5XG5cdFx0XHRpZiAoIXNhcC51aS5nZXRDb3JlKCkuZ2V0VUlEaXJ0eSgpKSB7XG5cdFx0XHRcdHNhcC51aS5nZXRDb3JlKCkuZGV0YWNoRXZlbnQoXCJVSVVwZGF0ZWRcIiwgZm5VSVVwZGF0ZWQpO1xuXHRcdFx0XHR0aGlzLl9iV2FpdGluZ0ZvclJlZnJlc2ggPSBmYWxzZTtcblx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0dGhpcy5fY2hlY2tQYWdlUmVhZHkoKTtcblx0XHRcdFx0fSwgMjApO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHQvLyBJbiBjYXNlIFVJVXBkYXRlIGRvZXMgbm90IGdldCBjYWxsZWQsIGNoZWNrIGlmIFVJIGlzIG5vdCBkaXJ0eSBhbmQgdGhlbiBjYWxsIF9jaGVja1BhZ2VSZWFkeVxuXHRcdGNvbnN0IGNoZWNrVUlVcGRhdGVkID0gKCkgPT4ge1xuXHRcdFx0aWYgKHNhcC51aS5nZXRDb3JlKCkuZ2V0VUlEaXJ0eSgpKSB7XG5cdFx0XHRcdHNldFRpbWVvdXQoY2hlY2tVSVVwZGF0ZWQsIDUwMCk7XG5cdFx0XHR9IGVsc2UgaWYgKHRoaXMuX2JXYWl0aW5nRm9yUmVmcmVzaCkge1xuXHRcdFx0XHR0aGlzLl9iV2FpdGluZ0ZvclJlZnJlc2ggPSBmYWxzZTtcblx0XHRcdFx0c2FwLnVpLmdldENvcmUoKS5kZXRhY2hFdmVudChcIlVJVXBkYXRlZFwiLCBmblVJVXBkYXRlZCk7XG5cdFx0XHRcdHRoaXMuX2NoZWNrUGFnZVJlYWR5KCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdGlmIChcblx0XHRcdHRoaXMuYlNob3duICYmXG5cdFx0XHR0aGlzLmJEYXRhUmVjZWl2ZWQgIT09IGZhbHNlICYmXG5cdFx0XHR0aGlzLmJUYWJsZXNMb2FkZWQgIT09IGZhbHNlICYmXG5cdFx0XHQoIXRoaXMuaXNDb250ZXh0RXhwZWN0ZWQoKSB8fCB0aGlzLmJIYXNDb250ZXh0KSAvLyBFaXRoZXIgbm8gY29udGV4dCBpcyBleHBlY3RlZCBvciB0aGVyZSBpcyBvbmVcblx0XHQpIHtcblx0XHRcdGlmICh0aGlzLmJEYXRhUmVjZWl2ZWQgPT09IHRydWUgJiYgIWJGcm9tTmF2ICYmICF0aGlzLl9iV2FpdGluZ0ZvclJlZnJlc2ggJiYgc2FwLnVpLmdldENvcmUoKS5nZXRVSURpcnR5KCkpIHtcblx0XHRcdFx0Ly8gSWYgd2UgcmVxdWVzdGVkIGRhdGEgd2UgZ2V0IG5vdGlmaWVkIGFzIHNvb24gYXMgdGhlIGRhdGEgYXJyaXZlZCwgc28gYmVmb3JlIHRoZSBuZXh0IHJlbmRlcmluZyB0aWNrXG5cdFx0XHRcdHRoaXMuYkRhdGFSZWNlaXZlZCA9IHVuZGVmaW5lZDtcblx0XHRcdFx0dGhpcy5fYldhaXRpbmdGb3JSZWZyZXNoID0gdHJ1ZTtcblx0XHRcdFx0c2FwLnVpLmdldENvcmUoKS5hdHRhY2hFdmVudChcIlVJVXBkYXRlZFwiLCBmblVJVXBkYXRlZCk7XG5cdFx0XHRcdHNldFRpbWVvdXQoY2hlY2tVSVVwZGF0ZWQsIDUwMCk7XG5cdFx0XHR9IGVsc2UgaWYgKCF0aGlzLl9iV2FpdGluZ0ZvclJlZnJlc2ggJiYgc2FwLnVpLmdldENvcmUoKS5nZXRVSURpcnR5KCkpIHtcblx0XHRcdFx0dGhpcy5fYldhaXRpbmdGb3JSZWZyZXNoID0gdHJ1ZTtcblx0XHRcdFx0c2FwLnVpLmdldENvcmUoKS5hdHRhY2hFdmVudChcIlVJVXBkYXRlZFwiLCBmblVJVXBkYXRlZCk7XG5cdFx0XHRcdHNldFRpbWVvdXQoY2hlY2tVSVVwZGF0ZWQsIDUwMCk7XG5cdFx0XHR9IGVsc2UgaWYgKCF0aGlzLl9iV2FpdGluZ0ZvclJlZnJlc2gpIHtcblx0XHRcdFx0Ly8gSW4gdGhlIGNhc2Ugd2UncmUgbm90IHdhaXRpbmcgZm9yIGFueSBkYXRhIChuYXZpZ2F0aW5nIGJhY2sgdG8gYSBwYWdlIHdlIGFscmVhZHkgaGF2ZSBsb2FkZWQpXG5cdFx0XHRcdC8vIGp1c3Qgd2FpdCBmb3IgYSBmcmFtZSB0byBmaXJlIHRoZSBldmVudC5cblx0XHRcdFx0dGhpcy5fYklzUGFnZVJlYWR5ID0gdHJ1ZTtcblx0XHRcdFx0dGhpcy5fb0V2ZW50UHJvdmlkZXIuZmlyZUV2ZW50KFwicGFnZVJlYWR5XCIpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBQYWdlUmVhZHlDb250cm9sbGVyRXh0ZW5zaW9uO1xuIl19