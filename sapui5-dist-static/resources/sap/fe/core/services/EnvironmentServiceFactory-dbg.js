sap.ui.define(["sap/ui/core/service/ServiceFactory", "sap/ui/core/service/Service", "../converters/MetaModelConverter", "sap/ui/VersionInfo"], function (ServiceFactory, Service, MetaModelConverter, VersionInfo) {
  "use strict";

  var DefaultEnvironmentCapabilities = MetaModelConverter.DefaultEnvironmentCapabilities;

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

  var EnvironmentCapabilitiesService = /*#__PURE__*/function (_Service) {
    _inherits(EnvironmentCapabilitiesService, _Service);

    var _super = _createSuper(EnvironmentCapabilitiesService);

    function EnvironmentCapabilitiesService() {
      _classCallCheck(this, EnvironmentCapabilitiesService);

      return _super.apply(this, arguments);
    }

    _createClass(EnvironmentCapabilitiesService, [{
      key: "init",
      // !: means that we know it will be assigned before usage
      value: function init() {
        var _this = this;

        this.initPromise = new Promise(function (resolve, reject) {
          _this.resolveFn = resolve;
          _this.rejectFn = reject;
        });
        var oContext = this.getContext();
        this.environmentCapabilities = Object.assign({}, DefaultEnvironmentCapabilities);
        VersionInfo.load().then(function (versionInfo) {
          _this.environmentCapabilities.Chart = !!versionInfo.libraries.find(function (lib) {
            return lib.name === "sap.viz";
          });
          _this.environmentCapabilities.MicroChart = !!versionInfo.libraries.find(function (lib) {
            return lib.name === "sap.suite.ui.microchart";
          });
          _this.environmentCapabilities.UShell = !!(sap && sap.ushell && sap.ushell.Container);
          _this.environmentCapabilities.IntentBasedNavigation = !!(sap && sap.ushell && sap.ushell.Container);
          _this.environmentCapabilities = Object.assign(_this.environmentCapabilities, oContext.settings);

          _this.resolveFn(_this);
        }).catch(this.rejectFn);
      }
    }, {
      key: "resolveLibrary",
      value: function resolveLibrary(libraryName) {
        return new Promise(function (resolve) {
          try {
            sap.ui.getCore().loadLibrary("".concat(libraryName.replace(/\./g, "/")), {
              async: true
            }).then(function () {
              resolve(true);
            }).catch(function () {
              resolve(false);
            });
          } catch (e) {
            resolve(false);
          }
        });
      }
    }, {
      key: "setCapabilities",
      value: function setCapabilities(oCapabilities) {
        this.environmentCapabilities = oCapabilities;
      }
    }, {
      key: "getCapabilities",
      value: function getCapabilities() {
        return this.environmentCapabilities;
      }
    }, {
      key: "getInterface",
      value: function getInterface() {
        return this;
      }
    }]);

    return EnvironmentCapabilitiesService;
  }(Service);

  var EnvironmentServiceFactory = /*#__PURE__*/function (_ServiceFactory) {
    _inherits(EnvironmentServiceFactory, _ServiceFactory);

    var _super2 = _createSuper(EnvironmentServiceFactory);

    function EnvironmentServiceFactory() {
      _classCallCheck(this, EnvironmentServiceFactory);

      return _super2.apply(this, arguments);
    }

    _createClass(EnvironmentServiceFactory, [{
      key: "createInstance",
      value: function createInstance(oServiceContext) {
        var environmentCapabilitiesService = new EnvironmentCapabilitiesService(oServiceContext);
        return environmentCapabilitiesService.initPromise;
      }
    }]);

    return EnvironmentServiceFactory;
  }(ServiceFactory);

  return EnvironmentServiceFactory;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkVudmlyb25tZW50U2VydmljZUZhY3RvcnkudHMiXSwibmFtZXMiOlsiRW52aXJvbm1lbnRDYXBhYmlsaXRpZXNTZXJ2aWNlIiwiaW5pdFByb21pc2UiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInJlc29sdmVGbiIsInJlamVjdEZuIiwib0NvbnRleHQiLCJnZXRDb250ZXh0IiwiZW52aXJvbm1lbnRDYXBhYmlsaXRpZXMiLCJPYmplY3QiLCJhc3NpZ24iLCJEZWZhdWx0RW52aXJvbm1lbnRDYXBhYmlsaXRpZXMiLCJWZXJzaW9uSW5mbyIsImxvYWQiLCJ0aGVuIiwidmVyc2lvbkluZm8iLCJDaGFydCIsImxpYnJhcmllcyIsImZpbmQiLCJsaWIiLCJuYW1lIiwiTWljcm9DaGFydCIsIlVTaGVsbCIsInNhcCIsInVzaGVsbCIsIkNvbnRhaW5lciIsIkludGVudEJhc2VkTmF2aWdhdGlvbiIsInNldHRpbmdzIiwiY2F0Y2giLCJsaWJyYXJ5TmFtZSIsInVpIiwiZ2V0Q29yZSIsImxvYWRMaWJyYXJ5IiwicmVwbGFjZSIsImFzeW5jIiwiZSIsIm9DYXBhYmlsaXRpZXMiLCJTZXJ2aWNlIiwiRW52aXJvbm1lbnRTZXJ2aWNlRmFjdG9yeSIsIm9TZXJ2aWNlQ29udGV4dCIsImVudmlyb25tZW50Q2FwYWJpbGl0aWVzU2VydmljZSIsIlNlcnZpY2VGYWN0b3J5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BSU1BLDhCOzs7Ozs7Ozs7Ozs7O0FBS0w7NkJBRU87QUFBQTs7QUFDTixhQUFLQyxXQUFMLEdBQW1CLElBQUlDLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDbkQsVUFBQSxLQUFJLENBQUNDLFNBQUwsR0FBaUJGLE9BQWpCO0FBQ0EsVUFBQSxLQUFJLENBQUNHLFFBQUwsR0FBZ0JGLE1BQWhCO0FBQ0EsU0FIa0IsQ0FBbkI7QUFJQSxZQUFNRyxRQUFRLEdBQUcsS0FBS0MsVUFBTCxFQUFqQjtBQUNBLGFBQUtDLHVCQUFMLEdBQStCQyxNQUFNLENBQUNDLE1BQVAsQ0FBYyxFQUFkLEVBQWtCQyw4QkFBbEIsQ0FBL0I7QUFDQUMsUUFBQUEsV0FBVyxDQUFDQyxJQUFaLEdBQ0VDLElBREYsQ0FDTyxVQUFBQyxXQUFXLEVBQUk7QUFDcEIsVUFBQSxLQUFJLENBQUNQLHVCQUFMLENBQTZCUSxLQUE3QixHQUFxQyxDQUFDLENBQUNELFdBQVcsQ0FBQ0UsU0FBWixDQUFzQkMsSUFBdEIsQ0FBMkIsVUFBQUMsR0FBRztBQUFBLG1CQUFJQSxHQUFHLENBQUNDLElBQUosS0FBYSxTQUFqQjtBQUFBLFdBQTlCLENBQXZDO0FBQ0EsVUFBQSxLQUFJLENBQUNaLHVCQUFMLENBQTZCYSxVQUE3QixHQUEwQyxDQUFDLENBQUNOLFdBQVcsQ0FBQ0UsU0FBWixDQUFzQkMsSUFBdEIsQ0FBMkIsVUFBQUMsR0FBRztBQUFBLG1CQUFJQSxHQUFHLENBQUNDLElBQUosS0FBYSx5QkFBakI7QUFBQSxXQUE5QixDQUE1QztBQUNBLFVBQUEsS0FBSSxDQUFDWix1QkFBTCxDQUE2QmMsTUFBN0IsR0FBc0MsQ0FBQyxFQUFFQyxHQUFHLElBQUlBLEdBQUcsQ0FBQ0MsTUFBWCxJQUFxQkQsR0FBRyxDQUFDQyxNQUFKLENBQVdDLFNBQWxDLENBQXZDO0FBQ0EsVUFBQSxLQUFJLENBQUNqQix1QkFBTCxDQUE2QmtCLHFCQUE3QixHQUFxRCxDQUFDLEVBQUVILEdBQUcsSUFBSUEsR0FBRyxDQUFDQyxNQUFYLElBQXFCRCxHQUFHLENBQUNDLE1BQUosQ0FBV0MsU0FBbEMsQ0FBdEQ7QUFDQSxVQUFBLEtBQUksQ0FBQ2pCLHVCQUFMLEdBQStCQyxNQUFNLENBQUNDLE1BQVAsQ0FBYyxLQUFJLENBQUNGLHVCQUFuQixFQUE0Q0YsUUFBUSxDQUFDcUIsUUFBckQsQ0FBL0I7O0FBQ0EsVUFBQSxLQUFJLENBQUN2QixTQUFMLENBQWUsS0FBZjtBQUNBLFNBUkYsRUFTRXdCLEtBVEYsQ0FTUSxLQUFLdkIsUUFUYjtBQVVBOzs7cUNBRWN3QixXLEVBQXVDO0FBQ3JELGVBQU8sSUFBSTVCLE9BQUosQ0FBWSxVQUFTQyxPQUFULEVBQWtCO0FBQ3BDLGNBQUk7QUFDSHFCLFlBQUFBLEdBQUcsQ0FBQ08sRUFBSixDQUNFQyxPQURGLEdBRUVDLFdBRkYsV0FFaUJILFdBQVcsQ0FBQ0ksT0FBWixDQUFvQixLQUFwQixFQUEyQixHQUEzQixDQUZqQixHQUVvRDtBQUFFQyxjQUFBQSxLQUFLLEVBQUU7QUFBVCxhQUZwRCxFQUdFcEIsSUFIRixDQUdPLFlBQVc7QUFDaEJaLGNBQUFBLE9BQU8sQ0FBQyxJQUFELENBQVA7QUFDQSxhQUxGLEVBTUUwQixLQU5GLENBTVEsWUFBVztBQUNqQjFCLGNBQUFBLE9BQU8sQ0FBQyxLQUFELENBQVA7QUFDQSxhQVJGO0FBU0EsV0FWRCxDQVVFLE9BQU9pQyxDQUFQLEVBQVU7QUFDWGpDLFlBQUFBLE9BQU8sQ0FBQyxLQUFELENBQVA7QUFDQTtBQUNELFNBZE0sQ0FBUDtBQWVBOzs7c0NBRXNCa0MsYSxFQUF3QztBQUM5RCxhQUFLNUIsdUJBQUwsR0FBK0I0QixhQUEvQjtBQUNBOzs7d0NBRXdCO0FBQ3hCLGVBQU8sS0FBSzVCLHVCQUFaO0FBQ0E7OztxQ0FFbUI7QUFDbkIsZUFBTyxJQUFQO0FBQ0E7Ozs7SUF0RDJDNkIsTzs7TUF5RHZDQyx5Qjs7Ozs7Ozs7Ozs7OztxQ0FDVUMsZSxFQUEwRDtBQUN4RSxZQUFNQyw4QkFBOEIsR0FBRyxJQUFJekMsOEJBQUosQ0FBbUN3QyxlQUFuQyxDQUF2QztBQUNBLGVBQU9DLDhCQUE4QixDQUFDeEMsV0FBdEM7QUFDQTs7OztJQUpzQ3lDLGM7O1NBT3pCSCx5QiIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2VydmljZUZhY3RvcnksIFNlcnZpY2UsIFNlcnZpY2VDb250ZXh0IH0gZnJvbSBcInNhcC91aS9jb3JlL3NlcnZpY2VcIjtcbmltcG9ydCB7IERlZmF1bHRFbnZpcm9ubWVudENhcGFiaWxpdGllcywgRW52aXJvbm1lbnRDYXBhYmlsaXRpZXMgfSBmcm9tIFwiLi4vY29udmVydGVycy9NZXRhTW9kZWxDb252ZXJ0ZXJcIjtcbmltcG9ydCB7IFZlcnNpb25JbmZvIH0gZnJvbSBcInNhcC91aVwiO1xuXG5jbGFzcyBFbnZpcm9ubWVudENhcGFiaWxpdGllc1NlcnZpY2UgZXh0ZW5kcyBTZXJ2aWNlPEVudmlyb25tZW50Q2FwYWJpbGl0aWVzPiB7XG5cdHJlc29sdmVGbjogYW55O1xuXHRyZWplY3RGbjogYW55O1xuXHRpbml0UHJvbWlzZSE6IFByb21pc2U8YW55Pjtcblx0ZW52aXJvbm1lbnRDYXBhYmlsaXRpZXMhOiBFbnZpcm9ubWVudENhcGFiaWxpdGllcztcblx0Ly8gITogbWVhbnMgdGhhdCB3ZSBrbm93IGl0IHdpbGwgYmUgYXNzaWduZWQgYmVmb3JlIHVzYWdlXG5cblx0aW5pdCgpIHtcblx0XHR0aGlzLmluaXRQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0dGhpcy5yZXNvbHZlRm4gPSByZXNvbHZlO1xuXHRcdFx0dGhpcy5yZWplY3RGbiA9IHJlamVjdDtcblx0XHR9KTtcblx0XHRjb25zdCBvQ29udGV4dCA9IHRoaXMuZ2V0Q29udGV4dCgpO1xuXHRcdHRoaXMuZW52aXJvbm1lbnRDYXBhYmlsaXRpZXMgPSBPYmplY3QuYXNzaWduKHt9LCBEZWZhdWx0RW52aXJvbm1lbnRDYXBhYmlsaXRpZXMpO1xuXHRcdFZlcnNpb25JbmZvLmxvYWQoKVxuXHRcdFx0LnRoZW4odmVyc2lvbkluZm8gPT4ge1xuXHRcdFx0XHR0aGlzLmVudmlyb25tZW50Q2FwYWJpbGl0aWVzLkNoYXJ0ID0gISF2ZXJzaW9uSW5mby5saWJyYXJpZXMuZmluZChsaWIgPT4gbGliLm5hbWUgPT09IFwic2FwLnZpelwiKTtcblx0XHRcdFx0dGhpcy5lbnZpcm9ubWVudENhcGFiaWxpdGllcy5NaWNyb0NoYXJ0ID0gISF2ZXJzaW9uSW5mby5saWJyYXJpZXMuZmluZChsaWIgPT4gbGliLm5hbWUgPT09IFwic2FwLnN1aXRlLnVpLm1pY3JvY2hhcnRcIik7XG5cdFx0XHRcdHRoaXMuZW52aXJvbm1lbnRDYXBhYmlsaXRpZXMuVVNoZWxsID0gISEoc2FwICYmIHNhcC51c2hlbGwgJiYgc2FwLnVzaGVsbC5Db250YWluZXIpO1xuXHRcdFx0XHR0aGlzLmVudmlyb25tZW50Q2FwYWJpbGl0aWVzLkludGVudEJhc2VkTmF2aWdhdGlvbiA9ICEhKHNhcCAmJiBzYXAudXNoZWxsICYmIHNhcC51c2hlbGwuQ29udGFpbmVyKTtcblx0XHRcdFx0dGhpcy5lbnZpcm9ubWVudENhcGFiaWxpdGllcyA9IE9iamVjdC5hc3NpZ24odGhpcy5lbnZpcm9ubWVudENhcGFiaWxpdGllcywgb0NvbnRleHQuc2V0dGluZ3MpO1xuXHRcdFx0XHR0aGlzLnJlc29sdmVGbih0aGlzKTtcblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2godGhpcy5yZWplY3RGbik7XG5cdH1cblxuXHRyZXNvbHZlTGlicmFyeShsaWJyYXJ5TmFtZTogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdHNhcC51aVxuXHRcdFx0XHRcdC5nZXRDb3JlKClcblx0XHRcdFx0XHQubG9hZExpYnJhcnkoYCR7bGlicmFyeU5hbWUucmVwbGFjZSgvXFwuL2csIFwiL1wiKX1gLCB7IGFzeW5jOiB0cnVlIH0pXG5cdFx0XHRcdFx0LnRoZW4oZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKHRydWUpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmNhdGNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0cmVzb2x2ZShmYWxzZSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdHJlc29sdmUoZmFsc2UpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0cHVibGljIHNldENhcGFiaWxpdGllcyhvQ2FwYWJpbGl0aWVzOiBFbnZpcm9ubWVudENhcGFiaWxpdGllcykge1xuXHRcdHRoaXMuZW52aXJvbm1lbnRDYXBhYmlsaXRpZXMgPSBvQ2FwYWJpbGl0aWVzO1xuXHR9XG5cblx0cHVibGljIGdldENhcGFiaWxpdGllcygpIHtcblx0XHRyZXR1cm4gdGhpcy5lbnZpcm9ubWVudENhcGFiaWxpdGllcztcblx0fVxuXG5cdGdldEludGVyZmFjZSgpOiBhbnkge1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG59XG5cbmNsYXNzIEVudmlyb25tZW50U2VydmljZUZhY3RvcnkgZXh0ZW5kcyBTZXJ2aWNlRmFjdG9yeTxFbnZpcm9ubWVudENhcGFiaWxpdGllcz4ge1xuXHRjcmVhdGVJbnN0YW5jZShvU2VydmljZUNvbnRleHQ6IFNlcnZpY2VDb250ZXh0PEVudmlyb25tZW50Q2FwYWJpbGl0aWVzPikge1xuXHRcdGNvbnN0IGVudmlyb25tZW50Q2FwYWJpbGl0aWVzU2VydmljZSA9IG5ldyBFbnZpcm9ubWVudENhcGFiaWxpdGllc1NlcnZpY2Uob1NlcnZpY2VDb250ZXh0KTtcblx0XHRyZXR1cm4gZW52aXJvbm1lbnRDYXBhYmlsaXRpZXNTZXJ2aWNlLmluaXRQcm9taXNlO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEVudmlyb25tZW50U2VydmljZUZhY3Rvcnk7XG4iXX0=