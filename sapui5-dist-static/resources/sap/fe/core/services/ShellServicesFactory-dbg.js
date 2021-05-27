sap.ui.define(["sap/ui/core/service/ServiceFactory", "sap/ui/core/service/Service"], function (ServiceFactory, Service) {
  "use strict";

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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

  /**
   * Mock implementation of the ShellService for OpenFE
   *
   * @implements {IShellServices}
   * @private
   */
  var ShellServiceMock = /*#__PURE__*/function (_Service) {
    _inherits(ShellServiceMock, _Service);

    var _super = _createSuper(ShellServiceMock);

    function ShellServiceMock() {
      _classCallCheck(this, ShellServiceMock);

      return _super.apply(this, arguments);
    }

    _createClass(ShellServiceMock, [{
      key: "init",
      value: function init() {
        this.initPromise = Promise.resolve(this);
        this.instanceType = "mock";
      }
    }, {
      key: "getLinks",
      value: function getLinks(oArgs) {
        return Promise.resolve([]);
      }
    }, {
      key: "getLinksWithCache",
      value: function getLinksWithCache(oArgs) {
        return Promise.resolve([]);
      }
    }, {
      key: "toExternal",
      value: function toExternal(oNavArgumentsArr, oComponent) {
        return;
      }
    }, {
      key: "getStartupAppState",
      value: function getStartupAppState(oArgs) {
        return Promise.resolve(null);
      }
    }, {
      key: "backToPreviousApp",
      value: function backToPreviousApp() {
        return;
      }
    }, {
      key: "hrefForExternal",
      value: function hrefForExternal(oArgs, oComponent, bAsync) {
        return "";
      }
    }, {
      key: "getAppState",
      value: function getAppState(oComponent, sAppStateKey) {
        return Promise.resolve({});
      }
    }, {
      key: "createEmptyAppState",
      value: function createEmptyAppState(oComponent) {
        return Promise.resolve({});
      }
    }, {
      key: "isNavigationSupported",
      value: function isNavigationSupported(oNavArgumentsArr, oComponent) {
        return Promise.resolve({});
      }
    }, {
      key: "isInitialNavigation",
      value: function isInitialNavigation() {
        return false;
      }
    }, {
      key: "expandCompactHash",
      value: function expandCompactHash(sHashFragment) {
        return Promise.resolve({});
      }
    }, {
      key: "parseShellHash",
      value: function parseShellHash(sHash) {
        return {};
      }
    }, {
      key: "splitHash",
      value: function splitHash(sHash) {
        return Promise.resolve({});
      }
    }, {
      key: "constructShellHash",
      value: function constructShellHash(oNewShellHash) {
        return "";
      }
    }, {
      key: "setDirtyFlag",
      value: function setDirtyFlag(bDirty) {
        return;
      }
    }, {
      key: "registerDirtyStateProvider",
      value: function registerDirtyStateProvider(fnDirtyStateProvider) {
        return;
      }
    }, {
      key: "deregisterDirtyStateProvider",
      value: function deregisterDirtyStateProvider(fnDirtyStateProvider) {
        return;
      }
    }, {
      key: "createRenderer",
      value: function createRenderer() {
        return {};
      }
    }, {
      key: "getUser",
      value: function getUser() {
        return {};
      }
    }, {
      key: "hasUShell",
      value: function hasUShell() {
        return false;
      }
    }, {
      key: "registerNavigationFilter",
      value: function registerNavigationFilter(fnNavFilter) {
        return;
      }
    }, {
      key: "unregisterNavigationFilter",
      value: function unregisterNavigationFilter(fnNavFilter) {
        return;
      }
    }, {
      key: "setBackNavigation",
      value: function setBackNavigation(fnCallBack) {
        return;
      }
    }, {
      key: "setHierarchy",
      value: function setHierarchy(aHierarchyLevels) {
        return;
      }
    }, {
      key: "setTitle",
      value: function setTitle(sTitle) {
        return;
      }
    }, {
      key: "getContentDensity",
      value: function getContentDensity() {
        // in case there is no shell we probably need to look at the classes being defined on the body
        if (document.body.classList.contains("sapUiSizeCozy")) {
          return "cozy";
        } else if (document.body.classList.contains("sapUiSizeCompact")) {
          return "compact";
        } else {
          return "";
        }
      }
    }]);

    return ShellServiceMock;
  }(Service);
  /**
   * @typedef ShellServicesSettings
   * @private
   */


  /**
   * Wrap a JQuery Promise within a native {Promise}.
   *
   * @template {object} T
   * @param {JQueryPromise<T>} jqueryPromise the original jquery promise
   * @returns {Promise<T>} a native promise wrapping the same object
   * @private
   */
  function wrapJQueryPromise(jqueryPromise) {
    return new Promise(function (resolve, reject) {
      // eslint-disable-next-line promise/catch-or-return
      jqueryPromise.done(resolve).fail(reject);
    });
  }
  /**
   * Base implementation of the ShellServices
   *
   * @implements {IShellServices}
   * @private
   */


  var ShellServices = /*#__PURE__*/function (_Service2) {
    _inherits(ShellServices, _Service2);

    var _super2 = _createSuper(ShellServices);

    function ShellServices() {
      _classCallCheck(this, ShellServices);

      return _super2.apply(this, arguments);
    }

    _createClass(ShellServices, [{
      key: "init",
      // !: means that we know it will be assigned before usage
      value: function init() {
        var _this = this;

        var oContext = this.getContext();
        var oComponent = oContext.scopeObject;
        this.oShellContainer = oContext.settings.shellContainer;
        this.instanceType = "real";
        this.linksCache = {};

        this.fnFindSemanticObjectsInCache = function (oArgs) {
          var _oArgs = oArgs;
          var aCachedSemanticObjects = [];
          var aNonCachedSemanticObjects = [];
          var index;

          for (var i = 0; i < _oArgs.length; i++) {
            if (this.linksCache[_oArgs[i][0].semanticObject]) {
              aCachedSemanticObjects.push(this.linksCache[_oArgs[i][0].semanticObject].links);
              Object.defineProperty(oArgs[i][0], "links", {
                value: this.linksCache[_oArgs[i][0].semanticObject].links
              });
            } else {
              aNonCachedSemanticObjects.push(_oArgs[i]);
            }
          }

          return {
            oldArgs: oArgs,
            newArgs: aNonCachedSemanticObjects,
            cachedLinks: aCachedSemanticObjects
          };
        };

        this.initPromise = new Promise(function (resolve, reject) {
          _this.resolveFn = resolve;
          _this.rejectFn = reject;
        });
        var oCrossAppNavServicePromise = this.oShellContainer.getServiceAsync("CrossApplicationNavigation");
        var oUrlParsingServicePromise = this.oShellContainer.getServiceAsync("URLParsing");
        var oShellNavigationServicePromise = this.oShellContainer.getServiceAsync("ShellNavigation");
        var oShellUIServicePromise = oComponent.getService("ShellUIService");
        Promise.all([oCrossAppNavServicePromise, oUrlParsingServicePromise, oShellNavigationServicePromise, oShellUIServicePromise]).then(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 4),
              oCrossAppNavService = _ref2[0],
              oUrlParsingService = _ref2[1],
              oShellNavigation = _ref2[2],
              oShellUIService = _ref2[3];

          _this.crossAppNavService = oCrossAppNavService;
          _this.urlParsingService = oUrlParsingService;
          _this.shellNavigation = oShellNavigation;
          _this.shellUIService = oShellUIService;

          _this.resolveFn();
        }).catch(this.rejectFn);
      }
      /**
       * Retrieves the target links configured for a given semantic object & action
       * Will retrieve the CrossApplicationNavigation
       * service reference call the getLinks method. In case service is not available or any exception
       * method throws exception error in console.
       *
       * @private
       * @ui5-restricted
       * @param {object} oArgs - check the definition of
       * sap.ushell.services.CrossApplicationNavigation=>getLinks arguments
       * @returns {Promise} Promise which will be resolved to target links array
       */

    }, {
      key: "getLinks",
      value: function getLinks(oArgs) {
        var _this2 = this;

        return new Promise(function (resolve, reject) {
          // eslint-disable-next-line promise/catch-or-return
          _this2.crossAppNavService.getLinks(oArgs).fail(function (oError) {
            reject(new Error(oError + " sap.fe.core.services.NavigationServiceFactory.getLinks"));
          }).then(resolve);
        });
      }
      /**
       * Retrieves the target links configured for a given semantic object & action in cache
       * Will retrieve the CrossApplicationNavigation
       * service reference call the getLinks method. In case service is not available or any exception
       * method throws exception error in console.
       *
       * @private
       * @ui5-restricted
       * @param {object} oArgs - check the definition of
       * sap.ushell.services.CrossApplicationNavigation=>getLinks arguments
       * @returns {Promise} Promise which will be resolved to target links array
       */

    }, {
      key: "getLinksWithCache",
      value: function getLinksWithCache(oArgs) {
        var _this3 = this;

        return new Promise(function (resolve, reject) {
          // eslint-disable-next-line promise/catch-or-return
          if (oArgs.length === 0) {
            resolve([]);
          } else {
            var aLinks;

            var oCacheResults = _this3.fnFindSemanticObjectsInCache(oArgs);

            if (oCacheResults.newArgs.length === 0) {
              resolve(oCacheResults.cachedLinks);
            } else {
              // eslint-disable-next-line promise/catch-or-return
              _this3.crossAppNavService.getLinks(oCacheResults.newArgs).fail(function (oError) {
                reject(new Error(oError + " sap.fe.core.services.NavigationServiceFactory.getLinksWithCache"));
              }).then(function (aLinks) {
                if (aLinks.length !== 0) {
                  var oSemanticObjectsLinks = {};

                  for (var i = 0; i < aLinks.length; i++) {
                    if (oCacheResults.newArgs[i][0].links === undefined) {
                      oSemanticObjectsLinks[oCacheResults.newArgs[i][0].semanticObject] = {
                        links: aLinks[i]
                      };
                      _this3.linksCache = Object.assign(_this3.linksCache, oSemanticObjectsLinks);
                    }
                  }
                }

                if (oCacheResults.cachedLinks.length === 0) {
                  resolve(aLinks);
                } else {
                  var aMergedLinks = [];
                  var j = 0;

                  for (var k = 0; k < oCacheResults.oldArgs.length; k++) {
                    if (j < aLinks.length) {
                      if (oCacheResults.oldArgs[k][0].semanticObject === oCacheResults.newArgs[j][0].semanticObject) {
                        aMergedLinks.push(aLinks[j]);
                        j++;
                      } else {
                        aMergedLinks.push(oCacheResults.oldArgs[k][0].links);
                      }
                    } else {
                      aMergedLinks.push(oCacheResults.oldArgs[k][0].links);
                    }
                  }

                  resolve(aMergedLinks);
                }
              });
            }
          }
        });
      }
      /**
       * Will retrieve the ShellContainer.
       *
       * @private
       * @ui5-restricted
       * sap.ushell.container
       * @returns {object} Object with predefined shellContainer methods
       */

    }, {
      key: "getShellContainer",
      value: function getShellContainer() {
        return this.oShellContainer;
      }
      /**
       * Will call toExternal method of CrossApplicationNavigation service with Navigation Arguments and oComponent.
       *
       * @private
       * @ui5-restricted
       * @param {Array} oNavArgumentsArr and
       * @param {object} oComponent - check the definition of
       * sap.ushell.services.CrossApplicationNavigation=>toExternal arguments
       * @returns {void}
       */

    }, {
      key: "toExternal",
      value: function toExternal(oNavArgumentsArr, oComponent) {
        this.crossAppNavService.toExternal(oNavArgumentsArr, oComponent);
      }
      /**
       * Retrieves the target startupAppState
       * Will check the existance of the ShellContainer and retrieve the CrossApplicationNavigation
       * service reference call the getStartupAppState method. In case service is not available or any exception
       * method throws exception error in console.
       *
       * @private
       * @ui5-restricted
       * @param {object} oArgs - check the definition of
       * sap.ushell.services.CrossApplicationNavigation=>getStartupAppState arguments
       * @returns {Promise} Promise which will be resolved to Object
       */

    }, {
      key: "getStartupAppState",
      value: function getStartupAppState(oArgs) {
        var _this4 = this;

        return new Promise(function (resolve, reject) {
          // JQuery Promise behaves differently
          // eslint-disable-next-line promise/catch-or-return
          _this4.crossAppNavService.getStartupAppState(oArgs).fail(function (oError) {
            reject(new Error(oError + " sap.fe.core.services.NavigationServiceFactory.getStartupAppState"));
          }).then(resolve);
        });
      }
      /**
       * Will call backToPreviousApp method of CrossApplicationNavigation service.
       *
       * @returns {void}
       * @private
       * @ui5-restricted
       */

    }, {
      key: "backToPreviousApp",
      value: function backToPreviousApp() {
        return this.crossAppNavService.backToPreviousApp();
      }
      /**
       * Will call hrefForExternal method of CrossApplicationNavigation service.
       *
       * @private
       * @ui5-restricted
       * @param {object} oArgs - check the definition of
       * @param {object} oComponent the appComponent
       * @param {boolean} bAsync whether this call should be async or not
       * sap.ushell.services.CrossApplicationNavigation=>hrefForExternal arguments
       * @returns {string} Promise which will be resolved to string
       */

    }, {
      key: "hrefForExternal",
      value: function hrefForExternal(oArgs, oComponent, bAsync) {
        return this.crossAppNavService.hrefForExternal(oArgs, oComponent, bAsync);
      }
      /**
       * Will call getAppState method of CrossApplicationNavigation service with oComponent and oAppStateKey.
       *
       * @private
       * @ui5-restricted
       * @param {object} oComponent and
       * @param {string} sAppStateKey - check the definition of
       * sap.ushell.services.CrossApplicationNavigation=>getAppState arguments
       * @returns {Promise} Promise which will be resolved to object
       */

    }, {
      key: "getAppState",
      value: function getAppState(oComponent, sAppStateKey) {
        return wrapJQueryPromise(this.crossAppNavService.getAppState(oComponent, sAppStateKey));
      }
      /**
       * Will call createEmptyAppState method of CrossApplicationNavigation service with oComponent.
       *
       * @private
       * @ui5-restricted
       * @param {object} oComponent - check the definition of
       * sap.ushell.services.CrossApplicationNavigation=>createEmptyAppState arguments
       * @returns {Promise} Promise which will be resolved to object
       */

    }, {
      key: "createEmptyAppState",
      value: function createEmptyAppState(oComponent) {
        return this.crossAppNavService.createEmptyAppState(oComponent);
      }
      /**
       * Will call isNavigationSupported method of CrossApplicationNavigation service with Navigation Arguments and oComponent.
       *
       * @private
       * @ui5-restricted
       * @param {Array} oNavArgumentsArr and
       * @param {object} oComponent - check the definition of
       * sap.ushell.services.CrossApplicationNavigation=>isNavigationSupported arguments
       * @returns {Promise} Promise which will be resolved to object
       */

    }, {
      key: "isNavigationSupported",
      value: function isNavigationSupported(oNavArgumentsArr, oComponent) {
        return wrapJQueryPromise(this.crossAppNavService.isNavigationSupported(oNavArgumentsArr, oComponent));
      }
      /**
       * Will call isInitialNavigation method of CrossApplicationNavigation service.
       *
       * @private
       * @ui5-restricted
       * @returns {Promise} Promise which will be resolved to boolean
       */

    }, {
      key: "isInitialNavigation",
      value: function isInitialNavigation() {
        return this.crossAppNavService.isInitialNavigation();
      }
      /**
       * Will call expandCompactHash method of CrossApplicationNavigation service.
       *
       * @param {string} sHashFragment an (internal format) shell hash
       * @returns {Promise} promise the success handler of the resolve promise get an expanded shell hash as first argument
       * @private
       * @ui5-restricted
       */

    }, {
      key: "expandCompactHash",
      value: function expandCompactHash(sHashFragment) {
        return this.crossAppNavService.expandCompactHash(sHashFragment);
      }
      /**
       * Will call parseShellHash method of URLParsing service with given sHash.
       *
       * @private
       * @ui5-restricted
       * @param {string} sHash - check the definition of
       * sap.ushell.services.URLParsing=>parseShellHash arguments
       * @returns {object} which will return object
       */

    }, {
      key: "parseShellHash",
      value: function parseShellHash(sHash) {
        return this.urlParsingService.parseShellHash(sHash);
      }
      /**
       * Will call splitHash method of URLParsing service with given sHash.
       *
       * @private
       * @ui5-restricted
       * @param {string} sHash - check the definition of
       * sap.ushell.services.URLParsing=>splitHash arguments
       * @returns {Promise} Promise which will be resolved to object
       */

    }, {
      key: "splitHash",
      value: function splitHash(sHash) {
        return this.urlParsingService.splitHash(sHash);
      }
      /**
       * Will call constructShellHash method of URLParsing service with given sHash.
       *
       * @private
       * @ui5-restricted
       * @param {object} oNewShellHash - check the definition of
       * sap.ushell.services.URLParsing=>constructShellHash arguments
       * @returns {string} Shell Hash string
       */

    }, {
      key: "constructShellHash",
      value: function constructShellHash(oNewShellHash) {
        return this.urlParsingService.constructShellHash(oNewShellHash);
      }
      /**
       * Will call setDirtyFlag method with given dirty state.
       *
       * @private
       * @ui5-restricted
       * @param {boolean} bDirty - check the definition of sap.ushell.Container.setDirtyFlag arguments
       */

    }, {
      key: "setDirtyFlag",
      value: function setDirtyFlag(bDirty) {
        this.oShellContainer.setDirtyFlag(bDirty);
      }
      /**
       * Will call registerDirtyStateProvider method with given dirty state provider callback method.
       *
       * @private
       * @ui5-restricted
       * @param {Function} fnDirtyStateProvider - check the definition of sap.ushell.Container.registerDirtyStateProvider arguments
       */

    }, {
      key: "registerDirtyStateProvider",
      value: function registerDirtyStateProvider(fnDirtyStateProvider) {
        this.oShellContainer.registerDirtyStateProvider(fnDirtyStateProvider);
      }
      /**
       * Will call deregisterDirtyStateProvider method with given dirty state provider callback method.
       *
       * @private
       * @ui5-restricted
       * @param {Function} fnDirtyStateProvider - check the definition of sap.ushell.Container.deregisterDirtyStateProvider arguments
       */

    }, {
      key: "deregisterDirtyStateProvider",
      value: function deregisterDirtyStateProvider(fnDirtyStateProvider) {
        this.oShellContainer.deregisterDirtyStateProvider(fnDirtyStateProvider);
      }
      /**
       * Will call createRenderer method of ushell container.
       *
       * @private
       * @ui5-restricted
       * @returns {object} returns renderer object
       */

    }, {
      key: "createRenderer",
      value: function createRenderer() {
        return this.oShellContainer.createRenderer();
      }
      /**
       * Will call getUser method of ushell container.
       *
       * @private
       * @ui5-restricted
       * @returns {object} returns User object
       */

    }, {
      key: "getUser",
      value: function getUser() {
        return this.oShellContainer.getUser();
      }
      /**
       * Will check if ushell container is available or not.
       *
       * @private
       * @ui5-restricted
       * @returns {boolean} returns true
       */

    }, {
      key: "hasUShell",
      value: function hasUShell() {
        return true;
      }
      /**
       * Will call registerNavigationFilter method of shellNavigation.
       *
       * @param {Function} fnNavFilter the filter function to register
       * @returns {void}
       * @private
       * @ui5-restricted
       */

    }, {
      key: "registerNavigationFilter",
      value: function registerNavigationFilter(fnNavFilter) {
        this.shellNavigation.registerNavigationFilter(fnNavFilter);
      }
      /**
       * Will call unregisterNavigationFilter method of shellNavigation.
       *
       * @param {Function} fnNavFilter the filter function to unregister
       * @returns {void}
       * @private
       * @ui5-restricted
       */

    }, {
      key: "unregisterNavigationFilter",
      value: function unregisterNavigationFilter(fnNavFilter) {
        this.shellNavigation.unregisterNavigationFilter(fnNavFilter);
      }
      /**
       * Will call setBackNavigation method of ShellUIService
       * that displays the back button in the shell header.
       *
       * @param {Function} [fnCallBack]
       * A callback function called when the button is clicked in the UI.
       * @returns {void}
       * @private
       * @ui5-restricted
       */

    }, {
      key: "setBackNavigation",
      value: function setBackNavigation(fnCallBack) {
        this.shellUIService.setBackNavigation(fnCallBack);
      }
      /**
       * Will call setHierarchy method of ShellUIService
       * that displays the given hierarchy in the shell header.
       *
       * @param {object[]} [aHierarchyLevels]
       * An array representing hierarchies of the currently displayed app.
       * @returns {void}
       * @private
       * @ui5-restricted
       */

    }, {
      key: "setHierarchy",
      value: function setHierarchy(aHierarchyLevels) {
        this.shellUIService.setHierarchy(aHierarchyLevels);
      }
      /**
       * Will call setTitle method of ShellUIService
       * that displays the given title in the shell header.
       *
       * @param {string} [sTitle]
       * The new title. The default title is set if this argument is not given.
       * @returns {void}
       * @private
       * @ui5-restricted
       */

    }, {
      key: "setTitle",
      value: function setTitle(sTitle) {
        this.shellUIService.setTitle(sTitle);
      }
      /**
       * Retrieves the currently defined content density.
       *
       * @returns {string} the content density value
       */

    }, {
      key: "getContentDensity",
      value: function getContentDensity() {
        return this.oShellContainer.getUser().getContentDensity();
      }
    }]);

    return ShellServices;
  }(Service);
  /**
   * Service Factory for the ShellServices
   *
   * @private
   */


  var ShellServicesFactory = /*#__PURE__*/function (_ServiceFactory) {
    _inherits(ShellServicesFactory, _ServiceFactory);

    var _super3 = _createSuper(ShellServicesFactory);

    function ShellServicesFactory() {
      _classCallCheck(this, ShellServicesFactory);

      return _super3.apply(this, arguments);
    }

    _createClass(ShellServicesFactory, [{
      key: "createInstance",

      /**
       * Creates either a standard or a mock Shell service depending on the configuration.
       *
       * @param {ServiceContext<ShellServicesSettings>} oServiceContext the shellservice context
       * @returns {Promise<IShellServices>} a promise for a shell service implementation
       * @see ServiceFactory#createInstance
       */
      value: function createInstance(oServiceContext) {
        oServiceContext.settings.shellContainer = sap.ushell && sap.ushell.Container;
        var oShellService = oServiceContext.settings.shellContainer ? new ShellServices(oServiceContext) : new ShellServiceMock(oServiceContext);
        return oShellService.initPromise.then(function () {
          // Enrich the appComponent with this method
          oServiceContext.scopeObject.getShellServices = function () {
            return oShellService;
          };

          return oShellService;
        });
      }
    }]);

    return ShellServicesFactory;
  }(ServiceFactory);

  return ShellServicesFactory;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNoZWxsU2VydmljZXNGYWN0b3J5LnRzIl0sIm5hbWVzIjpbIlNoZWxsU2VydmljZU1vY2siLCJpbml0UHJvbWlzZSIsIlByb21pc2UiLCJyZXNvbHZlIiwiaW5zdGFuY2VUeXBlIiwib0FyZ3MiLCJvTmF2QXJndW1lbnRzQXJyIiwib0NvbXBvbmVudCIsImJBc3luYyIsInNBcHBTdGF0ZUtleSIsInNIYXNoRnJhZ21lbnQiLCJzSGFzaCIsIm9OZXdTaGVsbEhhc2giLCJiRGlydHkiLCJmbkRpcnR5U3RhdGVQcm92aWRlciIsImZuTmF2RmlsdGVyIiwiZm5DYWxsQmFjayIsImFIaWVyYXJjaHlMZXZlbHMiLCJzVGl0bGUiLCJkb2N1bWVudCIsImJvZHkiLCJjbGFzc0xpc3QiLCJjb250YWlucyIsIlNlcnZpY2UiLCJ3cmFwSlF1ZXJ5UHJvbWlzZSIsImpxdWVyeVByb21pc2UiLCJyZWplY3QiLCJkb25lIiwiZmFpbCIsIlNoZWxsU2VydmljZXMiLCJvQ29udGV4dCIsImdldENvbnRleHQiLCJzY29wZU9iamVjdCIsIm9TaGVsbENvbnRhaW5lciIsInNldHRpbmdzIiwic2hlbGxDb250YWluZXIiLCJsaW5rc0NhY2hlIiwiZm5GaW5kU2VtYW50aWNPYmplY3RzSW5DYWNoZSIsIl9vQXJncyIsImFDYWNoZWRTZW1hbnRpY09iamVjdHMiLCJhTm9uQ2FjaGVkU2VtYW50aWNPYmplY3RzIiwiaW5kZXgiLCJpIiwibGVuZ3RoIiwic2VtYW50aWNPYmplY3QiLCJwdXNoIiwibGlua3MiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsInZhbHVlIiwib2xkQXJncyIsIm5ld0FyZ3MiLCJjYWNoZWRMaW5rcyIsInJlc29sdmVGbiIsInJlamVjdEZuIiwib0Nyb3NzQXBwTmF2U2VydmljZVByb21pc2UiLCJnZXRTZXJ2aWNlQXN5bmMiLCJvVXJsUGFyc2luZ1NlcnZpY2VQcm9taXNlIiwib1NoZWxsTmF2aWdhdGlvblNlcnZpY2VQcm9taXNlIiwib1NoZWxsVUlTZXJ2aWNlUHJvbWlzZSIsImdldFNlcnZpY2UiLCJhbGwiLCJ0aGVuIiwib0Nyb3NzQXBwTmF2U2VydmljZSIsIm9VcmxQYXJzaW5nU2VydmljZSIsIm9TaGVsbE5hdmlnYXRpb24iLCJvU2hlbGxVSVNlcnZpY2UiLCJjcm9zc0FwcE5hdlNlcnZpY2UiLCJ1cmxQYXJzaW5nU2VydmljZSIsInNoZWxsTmF2aWdhdGlvbiIsInNoZWxsVUlTZXJ2aWNlIiwiY2F0Y2giLCJnZXRMaW5rcyIsIm9FcnJvciIsIkVycm9yIiwiYUxpbmtzIiwib0NhY2hlUmVzdWx0cyIsIm9TZW1hbnRpY09iamVjdHNMaW5rcyIsInVuZGVmaW5lZCIsImFzc2lnbiIsImFNZXJnZWRMaW5rcyIsImoiLCJrIiwidG9FeHRlcm5hbCIsImdldFN0YXJ0dXBBcHBTdGF0ZSIsImJhY2tUb1ByZXZpb3VzQXBwIiwiaHJlZkZvckV4dGVybmFsIiwiZ2V0QXBwU3RhdGUiLCJjcmVhdGVFbXB0eUFwcFN0YXRlIiwiaXNOYXZpZ2F0aW9uU3VwcG9ydGVkIiwiaXNJbml0aWFsTmF2aWdhdGlvbiIsImV4cGFuZENvbXBhY3RIYXNoIiwicGFyc2VTaGVsbEhhc2giLCJzcGxpdEhhc2giLCJjb25zdHJ1Y3RTaGVsbEhhc2giLCJzZXREaXJ0eUZsYWciLCJyZWdpc3RlckRpcnR5U3RhdGVQcm92aWRlciIsImRlcmVnaXN0ZXJEaXJ0eVN0YXRlUHJvdmlkZXIiLCJjcmVhdGVSZW5kZXJlciIsImdldFVzZXIiLCJyZWdpc3Rlck5hdmlnYXRpb25GaWx0ZXIiLCJ1bnJlZ2lzdGVyTmF2aWdhdGlvbkZpbHRlciIsInNldEJhY2tOYXZpZ2F0aW9uIiwic2V0SGllcmFyY2h5Iiwic2V0VGl0bGUiLCJnZXRDb250ZW50RGVuc2l0eSIsIlNoZWxsU2VydmljZXNGYWN0b3J5Iiwib1NlcnZpY2VDb250ZXh0Iiwic2FwIiwidXNoZWxsIiwiQ29udGFpbmVyIiwib1NoZWxsU2VydmljZSIsImdldFNoZWxsU2VydmljZXMiLCJTZXJ2aWNlRmFjdG9yeSJdLCJtYXBwaW5n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O3dDQVVrQkMsVSxFQUE2QjtBQUM5QyxhQUFLc0QsY0FBTCxDQUFvQmdDLGlCQUFwQixDQUFzQ3RGLFVBQXRDO0FBQ0E7QUFFRDs7Ozs7Ozs7Ozs7OzttQ0FVYUMsZ0IsRUFBdUM7QUFDbkQsYUFBS3FELGNBQUwsQ0FBb0JpQyxZQUFwQixDQUFpQ3RGLGdCQUFqQztBQUNBO0FBRUQ7Ozs7Ozs7Ozs7Ozs7K0JBVVNDLE0sRUFBc0I7QUFDOUIsYUFBS29ELGNBQUwsQ0FBb0JrQyxRQUFwQixDQUE2QnRGLE1BQTdCO0FBQ0E7QUFFRDs7Ozs7Ozs7MENBSzRCO0FBQzNCLGVBQVEsS0FBS2UsZUFBTCxDQUFxQmtFLE9BQXJCLEVBQUQsQ0FBd0NNLGlCQUF4QyxFQUFQO0FBQ0E7Ozs7SUFyZDBCbEYsTztBQXdkNUI7Ozs7Ozs7TUFLTW1GLG9COzs7Ozs7Ozs7Ozs7OztBQUNMOzs7Ozs7O3FDQU9lQyxlLEVBQWlGO0FBQy9GQSxRQUFBQSxlQUFlLENBQUN6RSxRQUFoQixDQUF5QkMsY0FBekIsR0FBMEN5RSxHQUFHLENBQUNDLE1BQUosSUFBY0QsR0FBRyxDQUFDQyxNQUFKLENBQVdDLFNBQW5FO0FBQ0EsWUFBTUMsYUFBYSxHQUFHSixlQUFlLENBQUN6RSxRQUFoQixDQUF5QkMsY0FBekIsR0FDbkIsSUFBSU4sYUFBSixDQUFrQjhFLGVBQWxCLENBRG1CLEdBRW5CLElBQUkzRyxnQkFBSixDQUFxQjJHLGVBQXJCLENBRkg7QUFHQSxlQUFPSSxhQUFhLENBQUM5RyxXQUFkLENBQTBCNkQsSUFBMUIsQ0FBK0IsWUFBTTtBQUMzQztBQUNDNkMsVUFBQUEsZUFBZSxDQUFDM0UsV0FBakIsQ0FBcUNnRixnQkFBckMsR0FBd0Q7QUFBQSxtQkFBTUQsYUFBTjtBQUFBLFdBQXhEOztBQUNBLGlCQUFPQSxhQUFQO0FBQ0EsU0FKTSxDQUFQO0FBS0E7Ozs7SUFsQmlDRSxjOztTQXFCcEJQLG9CIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnMgKi9cblxuaW1wb3J0IHsgU2VydmljZUZhY3RvcnksIFNlcnZpY2UsIFNlcnZpY2VDb250ZXh0IH0gZnJvbSBcInNhcC91aS9jb3JlL3NlcnZpY2VcIjtcbmltcG9ydCB7IENvbnRhaW5lciwgQ3Jvc3NBcHBsaWNhdGlvbk5hdmlnYXRpb24sIFNoZWxsTmF2aWdhdGlvbiwgVVJMUGFyc2luZyB9IGZyb20gXCJzYXAvdXNoZWxsL3NlcnZpY2VzXCI7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwic2FwL3VpL2NvcmVcIjtcbmltcG9ydCB7IEpRdWVyeVByb21pc2UgfSBmcm9tIFwialF1ZXJ5XCI7XG5cbi8qKlxuICogQGludGVyZmFjZSBJU2hlbGxTZXJ2aWNlc1xuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJU2hlbGxTZXJ2aWNlcyB7XG5cdGluaXRQcm9taXNlOiBQcm9taXNlPElTaGVsbFNlcnZpY2VzPjtcblxuXHRnZXRMaW5rcyhvQXJnczogb2JqZWN0KTogUHJvbWlzZTxhbnk+O1xuXG5cdHRvRXh0ZXJuYWwob05hdkFyZ3VtZW50c0FycjogQXJyYXk8b2JqZWN0Piwgb0NvbXBvbmVudDogb2JqZWN0KTogdm9pZDtcblxuXHRnZXRTdGFydHVwQXBwU3RhdGUob0FyZ3M6IG9iamVjdCk6IFByb21pc2U8YW55PjtcblxuXHRiYWNrVG9QcmV2aW91c0FwcCgpOiB2b2lkO1xuXG5cdGhyZWZGb3JFeHRlcm5hbChvQXJncz86IG9iamVjdCwgb0NvbXBvbmVudD86IG9iamVjdCwgYkFzeW5jPzogYm9vbGVhbik6IHN0cmluZztcblxuXHRnZXRBcHBTdGF0ZShvQ29tcG9uZW50OiBDb21wb25lbnQsIHNBcHBTdGF0ZUtleTogc3RyaW5nKTogUHJvbWlzZTxhbnk+O1xuXG5cdGNyZWF0ZUVtcHR5QXBwU3RhdGUob0NvbXBvbmVudDogQ29tcG9uZW50KTogb2JqZWN0O1xuXG5cdGlzTmF2aWdhdGlvblN1cHBvcnRlZChvTmF2QXJndW1lbnRzQXJyOiBBcnJheTxvYmplY3Q+LCBvQ29tcG9uZW50OiBvYmplY3QpOiBQcm9taXNlPGFueT47XG5cblx0aXNJbml0aWFsTmF2aWdhdGlvbigpOiBib29sZWFuO1xuXG5cdGV4cGFuZENvbXBhY3RIYXNoKHNIYXNoRnJhZ21lbnQ6IHN0cmluZyk6IG9iamVjdDtcblxuXHRwYXJzZVNoZWxsSGFzaChzSGFzaDogc3RyaW5nKTogb2JqZWN0O1xuXG5cdHNwbGl0SGFzaChzSGFzaDogc3RyaW5nKTogb2JqZWN0O1xuXG5cdGNvbnN0cnVjdFNoZWxsSGFzaChvTmV3U2hlbGxIYXNoOiBvYmplY3QpOiBzdHJpbmc7XG5cblx0c2V0RGlydHlGbGFnKGJEaXJ0eTogYm9vbGVhbik6IHZvaWQ7XG5cblx0cmVnaXN0ZXJEaXJ0eVN0YXRlUHJvdmlkZXIoZm5EaXJ0eVN0YXRlUHJvdmlkZXI6IEZ1bmN0aW9uKTogdm9pZDtcblxuXHRkZXJlZ2lzdGVyRGlydHlTdGF0ZVByb3ZpZGVyKGZuRGlydHlTdGF0ZVByb3ZpZGVyOiBGdW5jdGlvbik6IHZvaWQ7XG5cblx0Y3JlYXRlUmVuZGVyZXIoKTogb2JqZWN0O1xuXG5cdGdldFVzZXIoKTogb2JqZWN0O1xuXG5cdGhhc1VTaGVsbCgpOiBib29sZWFuO1xuXG5cdHJlZ2lzdGVyTmF2aWdhdGlvbkZpbHRlcihmbk5hdkZpbHRlcjogRnVuY3Rpb24pOiB2b2lkO1xuXG5cdHVucmVnaXN0ZXJOYXZpZ2F0aW9uRmlsdGVyKGZuTmF2RmlsdGVyOiBGdW5jdGlvbik6IHZvaWQ7XG5cblx0c2V0QmFja05hdmlnYXRpb24oZm5DYWxsQmFjaz86IEZ1bmN0aW9uKTogdm9pZDtcblxuXHRzZXRIaWVyYXJjaHkoYUhpZXJhcmNoeUxldmVsczogQXJyYXk8b2JqZWN0Pik6IHZvaWQ7XG5cblx0c2V0VGl0bGUoc1RpdGxlOiBzdHJpbmcpOiB2b2lkO1xuXG5cdGdldENvbnRlbnREZW5zaXR5KCk6IHN0cmluZztcbn1cblxuLyoqXG4gKiBNb2NrIGltcGxlbWVudGF0aW9uIG9mIHRoZSBTaGVsbFNlcnZpY2UgZm9yIE9wZW5GRVxuICpcbiAqIEBpbXBsZW1lbnRzIHtJU2hlbGxTZXJ2aWNlc31cbiAqIEBwcml2YXRlXG4gKi9cbmNsYXNzIFNoZWxsU2VydmljZU1vY2sgZXh0ZW5kcyBTZXJ2aWNlPFNoZWxsU2VydmljZXNTZXR0aW5ncz4gaW1wbGVtZW50cyBJU2hlbGxTZXJ2aWNlcyB7XG5cdGluaXRQcm9taXNlITogUHJvbWlzZTxhbnk+O1xuXHRpbnN0YW5jZVR5cGUhOiBzdHJpbmc7XG5cblx0aW5pdCgpIHtcblx0XHR0aGlzLmluaXRQcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKHRoaXMpO1xuXHRcdHRoaXMuaW5zdGFuY2VUeXBlID0gXCJtb2NrXCI7XG5cdH1cblxuXHRnZXRMaW5rcyhvQXJnczogb2JqZWN0KSB7XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7XG5cdH1cblxuXHRnZXRMaW5rc1dpdGhDYWNoZShvQXJnczogb2JqZWN0KSB7XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7XG5cdH1cblxuXHR0b0V4dGVybmFsKG9OYXZBcmd1bWVudHNBcnI6IEFycmF5PG9iamVjdD4sIG9Db21wb25lbnQ6IG9iamVjdCkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGdldFN0YXJ0dXBBcHBTdGF0ZShvQXJnczogb2JqZWN0KSB7XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTtcblx0fVxuXG5cdGJhY2tUb1ByZXZpb3VzQXBwKCkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGhyZWZGb3JFeHRlcm5hbChvQXJncz86IG9iamVjdCwgb0NvbXBvbmVudD86IG9iamVjdCwgYkFzeW5jPzogYm9vbGVhbikge1xuXHRcdHJldHVybiBcIlwiO1xuXHR9XG5cblx0Z2V0QXBwU3RhdGUob0NvbXBvbmVudDogb2JqZWN0LCBzQXBwU3RhdGVLZXk6IHN0cmluZykge1xuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoe30pO1xuXHR9XG5cblx0Y3JlYXRlRW1wdHlBcHBTdGF0ZShvQ29tcG9uZW50OiBvYmplY3QpIHtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHt9KTtcblx0fVxuXG5cdGlzTmF2aWdhdGlvblN1cHBvcnRlZChvTmF2QXJndW1lbnRzQXJyOiBBcnJheTxvYmplY3Q+LCBvQ29tcG9uZW50OiBvYmplY3QpIHtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHt9KTtcblx0fVxuXG5cdGlzSW5pdGlhbE5hdmlnYXRpb24oKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0ZXhwYW5kQ29tcGFjdEhhc2goc0hhc2hGcmFnbWVudDogc3RyaW5nKSB7XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSh7fSk7XG5cdH1cblxuXHRwYXJzZVNoZWxsSGFzaChzSGFzaDogc3RyaW5nKSB7XG5cdFx0cmV0dXJuIHt9O1xuXHR9XG5cblx0c3BsaXRIYXNoKHNIYXNoOiBzdHJpbmcpIHtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHt9KTtcblx0fVxuXG5cdGNvbnN0cnVjdFNoZWxsSGFzaChvTmV3U2hlbGxIYXNoOiBvYmplY3QpIHtcblx0XHRyZXR1cm4gXCJcIjtcblx0fVxuXG5cdHNldERpcnR5RmxhZyhiRGlydHk6IGJvb2xlYW4pIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRyZWdpc3RlckRpcnR5U3RhdGVQcm92aWRlcihmbkRpcnR5U3RhdGVQcm92aWRlcjogRnVuY3Rpb24pIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRkZXJlZ2lzdGVyRGlydHlTdGF0ZVByb3ZpZGVyKGZuRGlydHlTdGF0ZVByb3ZpZGVyOiBGdW5jdGlvbikge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGNyZWF0ZVJlbmRlcmVyKCkge1xuXHRcdHJldHVybiB7fTtcblx0fVxuXG5cdGdldFVzZXIoKSB7XG5cdFx0cmV0dXJuIHt9O1xuXHR9XG5cblx0aGFzVVNoZWxsKCkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdHJlZ2lzdGVyTmF2aWdhdGlvbkZpbHRlcihmbk5hdkZpbHRlcjogRnVuY3Rpb24pOiB2b2lkIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHR1bnJlZ2lzdGVyTmF2aWdhdGlvbkZpbHRlcihmbk5hdkZpbHRlcjogRnVuY3Rpb24pOiB2b2lkIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRzZXRCYWNrTmF2aWdhdGlvbihmbkNhbGxCYWNrPzogRnVuY3Rpb24pOiB2b2lkIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRzZXRIaWVyYXJjaHkoYUhpZXJhcmNoeUxldmVsczogQXJyYXk8b2JqZWN0Pik6IHZvaWQge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHNldFRpdGxlKHNUaXRsZTogc3RyaW5nKTogdm9pZCB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Z2V0Q29udGVudERlbnNpdHkoKTogc3RyaW5nIHtcblx0XHQvLyBpbiBjYXNlIHRoZXJlIGlzIG5vIHNoZWxsIHdlIHByb2JhYmx5IG5lZWQgdG8gbG9vayBhdCB0aGUgY2xhc3NlcyBiZWluZyBkZWZpbmVkIG9uIHRoZSBib2R5XG5cdFx0aWYgKGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKFwic2FwVWlTaXplQ296eVwiKSkge1xuXHRcdFx0cmV0dXJuIFwiY296eVwiO1xuXHRcdH0gZWxzZSBpZiAoZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoXCJzYXBVaVNpemVDb21wYWN0XCIpKSB7XG5cdFx0XHRyZXR1cm4gXCJjb21wYWN0XCI7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBcIlwiO1xuXHRcdH1cblx0fVxufVxuXG4vKipcbiAqIEB0eXBlZGVmIFNoZWxsU2VydmljZXNTZXR0aW5nc1xuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0IHR5cGUgU2hlbGxTZXJ2aWNlc1NldHRpbmdzID0ge1xuXHRzaGVsbENvbnRhaW5lcj86IENvbnRhaW5lcjtcbn07XG5cbi8qKlxuICogV3JhcCBhIEpRdWVyeSBQcm9taXNlIHdpdGhpbiBhIG5hdGl2ZSB7UHJvbWlzZX0uXG4gKlxuICogQHRlbXBsYXRlIHtvYmplY3R9IFRcbiAqIEBwYXJhbSB7SlF1ZXJ5UHJvbWlzZTxUPn0ganF1ZXJ5UHJvbWlzZSB0aGUgb3JpZ2luYWwganF1ZXJ5IHByb21pc2VcbiAqIEByZXR1cm5zIHtQcm9taXNlPFQ+fSBhIG5hdGl2ZSBwcm9taXNlIHdyYXBwaW5nIHRoZSBzYW1lIG9iamVjdFxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gd3JhcEpRdWVyeVByb21pc2U8VD4oanF1ZXJ5UHJvbWlzZTogSlF1ZXJ5UHJvbWlzZTxUPik6IFByb21pc2U8VD4ge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcm9taXNlL2NhdGNoLW9yLXJldHVyblxuXHRcdGpxdWVyeVByb21pc2UuZG9uZShyZXNvbHZlIGFzIGFueSkuZmFpbChyZWplY3QpO1xuXHR9KTtcbn1cblxuLyoqXG4gKiBCYXNlIGltcGxlbWVudGF0aW9uIG9mIHRoZSBTaGVsbFNlcnZpY2VzXG4gKlxuICogQGltcGxlbWVudHMge0lTaGVsbFNlcnZpY2VzfVxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgU2hlbGxTZXJ2aWNlcyBleHRlbmRzIFNlcnZpY2U8UmVxdWlyZWQ8U2hlbGxTZXJ2aWNlc1NldHRpbmdzPj4gaW1wbGVtZW50cyBJU2hlbGxTZXJ2aWNlcyB7XG5cdHJlc29sdmVGbjogYW55O1xuXHRyZWplY3RGbjogYW55O1xuXHRpbml0UHJvbWlzZSE6IFByb21pc2U8YW55Pjtcblx0Ly8gITogbWVhbnMgdGhhdCB3ZSBrbm93IGl0IHdpbGwgYmUgYXNzaWduZWQgYmVmb3JlIHVzYWdlXG5cdGNyb3NzQXBwTmF2U2VydmljZSE6IENyb3NzQXBwbGljYXRpb25OYXZpZ2F0aW9uO1xuXHR1cmxQYXJzaW5nU2VydmljZSE6IFVSTFBhcnNpbmc7XG5cdHNoZWxsTmF2aWdhdGlvbiE6IFNoZWxsTmF2aWdhdGlvbjtcblx0b1NoZWxsQ29udGFpbmVyITogQ29udGFpbmVyO1xuXHRzaGVsbFVJU2VydmljZSE6IGFueTtcblx0aW5zdGFuY2VUeXBlITogc3RyaW5nO1xuXHRsaW5rc0NhY2hlITogYW55O1xuXHRmbkZpbmRTZW1hbnRpY09iamVjdHNJbkNhY2hlOiBhbnk7XG5cblx0aW5pdCgpIHtcblx0XHRjb25zdCBvQ29udGV4dCA9IHRoaXMuZ2V0Q29udGV4dCgpO1xuXHRcdGNvbnN0IG9Db21wb25lbnQgPSBvQ29udGV4dC5zY29wZU9iamVjdCBhcyBhbnk7XG5cdFx0dGhpcy5vU2hlbGxDb250YWluZXIgPSBvQ29udGV4dC5zZXR0aW5ncy5zaGVsbENvbnRhaW5lcjtcblx0XHR0aGlzLmluc3RhbmNlVHlwZSA9IFwicmVhbFwiO1xuXHRcdHRoaXMubGlua3NDYWNoZSA9IHt9O1xuXHRcdHRoaXMuZm5GaW5kU2VtYW50aWNPYmplY3RzSW5DYWNoZSA9IGZ1bmN0aW9uKG9BcmdzOiBhbnkpOiBvYmplY3Qge1xuXHRcdFx0Y29uc3QgX29BcmdzOiBhbnkgPSBvQXJncztcblx0XHRcdGNvbnN0IGFDYWNoZWRTZW1hbnRpY09iamVjdHMgPSBbXTtcblx0XHRcdGNvbnN0IGFOb25DYWNoZWRTZW1hbnRpY09iamVjdHMgPSBbXTtcblx0XHRcdGxldCBpbmRleDtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgX29BcmdzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmICh0aGlzLmxpbmtzQ2FjaGVbX29BcmdzW2ldWzBdLnNlbWFudGljT2JqZWN0XSkge1xuXHRcdFx0XHRcdGFDYWNoZWRTZW1hbnRpY09iamVjdHMucHVzaCh0aGlzLmxpbmtzQ2FjaGVbX29BcmdzW2ldWzBdLnNlbWFudGljT2JqZWN0XS5saW5rcyk7XG5cdFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG9BcmdzW2ldWzBdLCBcImxpbmtzXCIsIHtcblx0XHRcdFx0XHRcdHZhbHVlOiB0aGlzLmxpbmtzQ2FjaGVbX29BcmdzW2ldWzBdLnNlbWFudGljT2JqZWN0XS5saW5rc1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGFOb25DYWNoZWRTZW1hbnRpY09iamVjdHMucHVzaChfb0FyZ3NbaV0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4geyBvbGRBcmdzOiBvQXJncywgbmV3QXJnczogYU5vbkNhY2hlZFNlbWFudGljT2JqZWN0cywgY2FjaGVkTGlua3M6IGFDYWNoZWRTZW1hbnRpY09iamVjdHMgfTtcblx0XHR9O1xuXHRcdHRoaXMuaW5pdFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHR0aGlzLnJlc29sdmVGbiA9IHJlc29sdmU7XG5cdFx0XHR0aGlzLnJlamVjdEZuID0gcmVqZWN0O1xuXHRcdH0pO1xuXHRcdGNvbnN0IG9Dcm9zc0FwcE5hdlNlcnZpY2VQcm9taXNlID0gdGhpcy5vU2hlbGxDb250YWluZXIuZ2V0U2VydmljZUFzeW5jKFwiQ3Jvc3NBcHBsaWNhdGlvbk5hdmlnYXRpb25cIik7XG5cdFx0Y29uc3Qgb1VybFBhcnNpbmdTZXJ2aWNlUHJvbWlzZSA9IHRoaXMub1NoZWxsQ29udGFpbmVyLmdldFNlcnZpY2VBc3luYyhcIlVSTFBhcnNpbmdcIik7XG5cdFx0Y29uc3Qgb1NoZWxsTmF2aWdhdGlvblNlcnZpY2VQcm9taXNlID0gdGhpcy5vU2hlbGxDb250YWluZXIuZ2V0U2VydmljZUFzeW5jKFwiU2hlbGxOYXZpZ2F0aW9uXCIpO1xuXHRcdGNvbnN0IG9TaGVsbFVJU2VydmljZVByb21pc2UgPSBvQ29tcG9uZW50LmdldFNlcnZpY2UoXCJTaGVsbFVJU2VydmljZVwiKTtcblx0XHRQcm9taXNlLmFsbChbb0Nyb3NzQXBwTmF2U2VydmljZVByb21pc2UsIG9VcmxQYXJzaW5nU2VydmljZVByb21pc2UsIG9TaGVsbE5hdmlnYXRpb25TZXJ2aWNlUHJvbWlzZSwgb1NoZWxsVUlTZXJ2aWNlUHJvbWlzZV0pXG5cdFx0XHQudGhlbigoW29Dcm9zc0FwcE5hdlNlcnZpY2UsIG9VcmxQYXJzaW5nU2VydmljZSwgb1NoZWxsTmF2aWdhdGlvbiwgb1NoZWxsVUlTZXJ2aWNlXSkgPT4ge1xuXHRcdFx0XHR0aGlzLmNyb3NzQXBwTmF2U2VydmljZSA9IG9Dcm9zc0FwcE5hdlNlcnZpY2U7XG5cdFx0XHRcdHRoaXMudXJsUGFyc2luZ1NlcnZpY2UgPSBvVXJsUGFyc2luZ1NlcnZpY2U7XG5cdFx0XHRcdHRoaXMuc2hlbGxOYXZpZ2F0aW9uID0gb1NoZWxsTmF2aWdhdGlvbjtcblx0XHRcdFx0dGhpcy5zaGVsbFVJU2VydmljZSA9IG9TaGVsbFVJU2VydmljZTtcblx0XHRcdFx0dGhpcy5yZXNvbHZlRm4oKTtcblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2godGhpcy5yZWplY3RGbik7XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmVzIHRoZSB0YXJnZXQgbGlua3MgY29uZmlndXJlZCBmb3IgYSBnaXZlbiBzZW1hbnRpYyBvYmplY3QgJiBhY3Rpb25cblx0ICogV2lsbCByZXRyaWV2ZSB0aGUgQ3Jvc3NBcHBsaWNhdGlvbk5hdmlnYXRpb25cblx0ICogc2VydmljZSByZWZlcmVuY2UgY2FsbCB0aGUgZ2V0TGlua3MgbWV0aG9kLiBJbiBjYXNlIHNlcnZpY2UgaXMgbm90IGF2YWlsYWJsZSBvciBhbnkgZXhjZXB0aW9uXG5cdCAqIG1ldGhvZCB0aHJvd3MgZXhjZXB0aW9uIGVycm9yIGluIGNvbnNvbGUuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAcGFyYW0ge29iamVjdH0gb0FyZ3MgLSBjaGVjayB0aGUgZGVmaW5pdGlvbiBvZlxuXHQgKiBzYXAudXNoZWxsLnNlcnZpY2VzLkNyb3NzQXBwbGljYXRpb25OYXZpZ2F0aW9uPT5nZXRMaW5rcyBhcmd1bWVudHNcblx0ICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZCB0byB0YXJnZXQgbGlua3MgYXJyYXlcblx0ICovXG5cdGdldExpbmtzKG9BcmdzOiBvYmplY3QpIHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByb21pc2UvY2F0Y2gtb3ItcmV0dXJuXG5cdFx0XHR0aGlzLmNyb3NzQXBwTmF2U2VydmljZVxuXHRcdFx0XHQuZ2V0TGlua3Mob0FyZ3MpXG5cdFx0XHRcdC5mYWlsKChvRXJyb3I6IGFueSkgPT4ge1xuXHRcdFx0XHRcdHJlamVjdChuZXcgRXJyb3Iob0Vycm9yICsgXCIgc2FwLmZlLmNvcmUuc2VydmljZXMuTmF2aWdhdGlvblNlcnZpY2VGYWN0b3J5LmdldExpbmtzXCIpKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0LnRoZW4ocmVzb2x2ZSk7XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmVzIHRoZSB0YXJnZXQgbGlua3MgY29uZmlndXJlZCBmb3IgYSBnaXZlbiBzZW1hbnRpYyBvYmplY3QgJiBhY3Rpb24gaW4gY2FjaGVcblx0ICogV2lsbCByZXRyaWV2ZSB0aGUgQ3Jvc3NBcHBsaWNhdGlvbk5hdmlnYXRpb25cblx0ICogc2VydmljZSByZWZlcmVuY2UgY2FsbCB0aGUgZ2V0TGlua3MgbWV0aG9kLiBJbiBjYXNlIHNlcnZpY2UgaXMgbm90IGF2YWlsYWJsZSBvciBhbnkgZXhjZXB0aW9uXG5cdCAqIG1ldGhvZCB0aHJvd3MgZXhjZXB0aW9uIGVycm9yIGluIGNvbnNvbGUuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAcGFyYW0ge29iamVjdH0gb0FyZ3MgLSBjaGVjayB0aGUgZGVmaW5pdGlvbiBvZlxuXHQgKiBzYXAudXNoZWxsLnNlcnZpY2VzLkNyb3NzQXBwbGljYXRpb25OYXZpZ2F0aW9uPT5nZXRMaW5rcyBhcmd1bWVudHNcblx0ICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZCB0byB0YXJnZXQgbGlua3MgYXJyYXlcblx0ICovXG5cdGdldExpbmtzV2l0aENhY2hlKG9BcmdzOiBvYmplY3QpIHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByb21pc2UvY2F0Y2gtb3ItcmV0dXJuXG5cdFx0XHRpZiAoKDxPYmplY3RbXT5vQXJncykubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdHJlc29sdmUoW10pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bGV0IGFMaW5rcztcblx0XHRcdFx0Y29uc3Qgb0NhY2hlUmVzdWx0cyA9IHRoaXMuZm5GaW5kU2VtYW50aWNPYmplY3RzSW5DYWNoZShvQXJncyk7XG5cblx0XHRcdFx0aWYgKG9DYWNoZVJlc3VsdHMubmV3QXJncy5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0XHRyZXNvbHZlKG9DYWNoZVJlc3VsdHMuY2FjaGVkTGlua3MpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcm9taXNlL2NhdGNoLW9yLXJldHVyblxuXHRcdFx0XHRcdHRoaXMuY3Jvc3NBcHBOYXZTZXJ2aWNlXG5cdFx0XHRcdFx0XHQuZ2V0TGlua3Mob0NhY2hlUmVzdWx0cy5uZXdBcmdzKVxuXHRcdFx0XHRcdFx0LmZhaWwoKG9FcnJvcjogYW55KSA9PiB7XG5cdFx0XHRcdFx0XHRcdHJlamVjdChuZXcgRXJyb3Iob0Vycm9yICsgXCIgc2FwLmZlLmNvcmUuc2VydmljZXMuTmF2aWdhdGlvblNlcnZpY2VGYWN0b3J5LmdldExpbmtzV2l0aENhY2hlXCIpKTtcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQudGhlbihhTGlua3MgPT4ge1xuXHRcdFx0XHRcdFx0XHRpZiAoYUxpbmtzLmxlbmd0aCAhPT0gMCkge1xuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IG9TZW1hbnRpY09iamVjdHNMaW5rczogYW55ID0ge307XG5cblx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFMaW5rcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKG9DYWNoZVJlc3VsdHMubmV3QXJnc1tpXVswXS5saW5rcyA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdG9TZW1hbnRpY09iamVjdHNMaW5rc1tvQ2FjaGVSZXN1bHRzLm5ld0FyZ3NbaV1bMF0uc2VtYW50aWNPYmplY3RdID0ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxpbmtzOiBhTGlua3NbaV1cblx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5saW5rc0NhY2hlID0gT2JqZWN0LmFzc2lnbih0aGlzLmxpbmtzQ2FjaGUsIG9TZW1hbnRpY09iamVjdHNMaW5rcyk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0aWYgKG9DYWNoZVJlc3VsdHMuY2FjaGVkTGlua3MubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShhTGlua3MpO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IGFNZXJnZWRMaW5rcyA9IFtdO1xuXHRcdFx0XHRcdFx0XHRcdGxldCBqID0gMDtcblxuXHRcdFx0XHRcdFx0XHRcdGZvciAobGV0IGsgPSAwOyBrIDwgb0NhY2hlUmVzdWx0cy5vbGRBcmdzLmxlbmd0aDsgaysrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoaiA8IGFMaW5rcy5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKG9DYWNoZVJlc3VsdHMub2xkQXJnc1trXVswXS5zZW1hbnRpY09iamVjdCA9PT0gb0NhY2hlUmVzdWx0cy5uZXdBcmdzW2pdWzBdLnNlbWFudGljT2JqZWN0KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YU1lcmdlZExpbmtzLnB1c2goYUxpbmtzW2pdKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRqKys7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YU1lcmdlZExpbmtzLnB1c2gob0NhY2hlUmVzdWx0cy5vbGRBcmdzW2tdWzBdLmxpbmtzKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0YU1lcmdlZExpbmtzLnB1c2gob0NhY2hlUmVzdWx0cy5vbGRBcmdzW2tdWzBdLmxpbmtzKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShhTWVyZ2VkTGlua3MpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIFdpbGwgcmV0cmlldmUgdGhlIFNoZWxsQ29udGFpbmVyLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICogc2FwLnVzaGVsbC5jb250YWluZXJcblx0ICogQHJldHVybnMge29iamVjdH0gT2JqZWN0IHdpdGggcHJlZGVmaW5lZCBzaGVsbENvbnRhaW5lciBtZXRob2RzXG5cdCAqL1xuXHRnZXRTaGVsbENvbnRhaW5lcigpIHtcblx0XHRyZXR1cm4gdGhpcy5vU2hlbGxDb250YWluZXI7XG5cdH1cblxuXHQvKipcblx0ICogV2lsbCBjYWxsIHRvRXh0ZXJuYWwgbWV0aG9kIG9mIENyb3NzQXBwbGljYXRpb25OYXZpZ2F0aW9uIHNlcnZpY2Ugd2l0aCBOYXZpZ2F0aW9uIEFyZ3VtZW50cyBhbmQgb0NvbXBvbmVudC5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIEBwYXJhbSB7QXJyYXl9IG9OYXZBcmd1bWVudHNBcnIgYW5kXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBvQ29tcG9uZW50IC0gY2hlY2sgdGhlIGRlZmluaXRpb24gb2Zcblx0ICogc2FwLnVzaGVsbC5zZXJ2aWNlcy5Dcm9zc0FwcGxpY2F0aW9uTmF2aWdhdGlvbj0+dG9FeHRlcm5hbCBhcmd1bWVudHNcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHR0b0V4dGVybmFsKG9OYXZBcmd1bWVudHNBcnI6IEFycmF5PG9iamVjdD4sIG9Db21wb25lbnQ6IG9iamVjdCk6IHZvaWQge1xuXHRcdHRoaXMuY3Jvc3NBcHBOYXZTZXJ2aWNlLnRvRXh0ZXJuYWwob05hdkFyZ3VtZW50c0Fyciwgb0NvbXBvbmVudCk7XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmVzIHRoZSB0YXJnZXQgc3RhcnR1cEFwcFN0YXRlXG5cdCAqIFdpbGwgY2hlY2sgdGhlIGV4aXN0YW5jZSBvZiB0aGUgU2hlbGxDb250YWluZXIgYW5kIHJldHJpZXZlIHRoZSBDcm9zc0FwcGxpY2F0aW9uTmF2aWdhdGlvblxuXHQgKiBzZXJ2aWNlIHJlZmVyZW5jZSBjYWxsIHRoZSBnZXRTdGFydHVwQXBwU3RhdGUgbWV0aG9kLiBJbiBjYXNlIHNlcnZpY2UgaXMgbm90IGF2YWlsYWJsZSBvciBhbnkgZXhjZXB0aW9uXG5cdCAqIG1ldGhvZCB0aHJvd3MgZXhjZXB0aW9uIGVycm9yIGluIGNvbnNvbGUuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAcGFyYW0ge29iamVjdH0gb0FyZ3MgLSBjaGVjayB0aGUgZGVmaW5pdGlvbiBvZlxuXHQgKiBzYXAudXNoZWxsLnNlcnZpY2VzLkNyb3NzQXBwbGljYXRpb25OYXZpZ2F0aW9uPT5nZXRTdGFydHVwQXBwU3RhdGUgYXJndW1lbnRzXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQgdG8gT2JqZWN0XG5cdCAqL1xuXHRnZXRTdGFydHVwQXBwU3RhdGUob0FyZ3M6IENvbXBvbmVudCkge1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHQvLyBKUXVlcnkgUHJvbWlzZSBiZWhhdmVzIGRpZmZlcmVudGx5XG5cdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJvbWlzZS9jYXRjaC1vci1yZXR1cm5cblx0XHRcdHRoaXMuY3Jvc3NBcHBOYXZTZXJ2aWNlXG5cdFx0XHRcdC5nZXRTdGFydHVwQXBwU3RhdGUob0FyZ3MpXG5cdFx0XHRcdC5mYWlsKChvRXJyb3I6IGFueSkgPT4ge1xuXHRcdFx0XHRcdHJlamVjdChuZXcgRXJyb3Iob0Vycm9yICsgXCIgc2FwLmZlLmNvcmUuc2VydmljZXMuTmF2aWdhdGlvblNlcnZpY2VGYWN0b3J5LmdldFN0YXJ0dXBBcHBTdGF0ZVwiKSk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC50aGVuKHJlc29sdmUpO1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIFdpbGwgY2FsbCBiYWNrVG9QcmV2aW91c0FwcCBtZXRob2Qgb2YgQ3Jvc3NBcHBsaWNhdGlvbk5hdmlnYXRpb24gc2VydmljZS5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKi9cblx0YmFja1RvUHJldmlvdXNBcHAoKSB7XG5cdFx0cmV0dXJuIHRoaXMuY3Jvc3NBcHBOYXZTZXJ2aWNlLmJhY2tUb1ByZXZpb3VzQXBwKCk7XG5cdH1cblxuXHQvKipcblx0ICogV2lsbCBjYWxsIGhyZWZGb3JFeHRlcm5hbCBtZXRob2Qgb2YgQ3Jvc3NBcHBsaWNhdGlvbk5hdmlnYXRpb24gc2VydmljZS5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBvQXJncyAtIGNoZWNrIHRoZSBkZWZpbml0aW9uIG9mXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBvQ29tcG9uZW50IHRoZSBhcHBDb21wb25lbnRcblx0ICogQHBhcmFtIHtib29sZWFufSBiQXN5bmMgd2hldGhlciB0aGlzIGNhbGwgc2hvdWxkIGJlIGFzeW5jIG9yIG5vdFxuXHQgKiBzYXAudXNoZWxsLnNlcnZpY2VzLkNyb3NzQXBwbGljYXRpb25OYXZpZ2F0aW9uPT5ocmVmRm9yRXh0ZXJuYWwgYXJndW1lbnRzXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZCB0byBzdHJpbmdcblx0ICovXG5cdGhyZWZGb3JFeHRlcm5hbChvQXJnczogb2JqZWN0LCBvQ29tcG9uZW50Pzogb2JqZWN0LCBiQXN5bmM/OiBib29sZWFuKSB7XG5cdFx0cmV0dXJuIHRoaXMuY3Jvc3NBcHBOYXZTZXJ2aWNlLmhyZWZGb3JFeHRlcm5hbChvQXJncywgb0NvbXBvbmVudCwgYkFzeW5jKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBXaWxsIGNhbGwgZ2V0QXBwU3RhdGUgbWV0aG9kIG9mIENyb3NzQXBwbGljYXRpb25OYXZpZ2F0aW9uIHNlcnZpY2Ugd2l0aCBvQ29tcG9uZW50IGFuZCBvQXBwU3RhdGVLZXkuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAcGFyYW0ge29iamVjdH0gb0NvbXBvbmVudCBhbmRcblx0ICogQHBhcmFtIHtzdHJpbmd9IHNBcHBTdGF0ZUtleSAtIGNoZWNrIHRoZSBkZWZpbml0aW9uIG9mXG5cdCAqIHNhcC51c2hlbGwuc2VydmljZXMuQ3Jvc3NBcHBsaWNhdGlvbk5hdmlnYXRpb249PmdldEFwcFN0YXRlIGFyZ3VtZW50c1xuXHQgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkIHRvIG9iamVjdFxuXHQgKi9cblx0Z2V0QXBwU3RhdGUob0NvbXBvbmVudDogQ29tcG9uZW50LCBzQXBwU3RhdGVLZXk6IHN0cmluZykge1xuXHRcdHJldHVybiB3cmFwSlF1ZXJ5UHJvbWlzZSh0aGlzLmNyb3NzQXBwTmF2U2VydmljZS5nZXRBcHBTdGF0ZShvQ29tcG9uZW50LCBzQXBwU3RhdGVLZXkpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBXaWxsIGNhbGwgY3JlYXRlRW1wdHlBcHBTdGF0ZSBtZXRob2Qgb2YgQ3Jvc3NBcHBsaWNhdGlvbk5hdmlnYXRpb24gc2VydmljZSB3aXRoIG9Db21wb25lbnQuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAcGFyYW0ge29iamVjdH0gb0NvbXBvbmVudCAtIGNoZWNrIHRoZSBkZWZpbml0aW9uIG9mXG5cdCAqIHNhcC51c2hlbGwuc2VydmljZXMuQ3Jvc3NBcHBsaWNhdGlvbk5hdmlnYXRpb249PmNyZWF0ZUVtcHR5QXBwU3RhdGUgYXJndW1lbnRzXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQgdG8gb2JqZWN0XG5cdCAqL1xuXHRjcmVhdGVFbXB0eUFwcFN0YXRlKG9Db21wb25lbnQ6IENvbXBvbmVudCkge1xuXHRcdHJldHVybiB0aGlzLmNyb3NzQXBwTmF2U2VydmljZS5jcmVhdGVFbXB0eUFwcFN0YXRlKG9Db21wb25lbnQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFdpbGwgY2FsbCBpc05hdmlnYXRpb25TdXBwb3J0ZWQgbWV0aG9kIG9mIENyb3NzQXBwbGljYXRpb25OYXZpZ2F0aW9uIHNlcnZpY2Ugd2l0aCBOYXZpZ2F0aW9uIEFyZ3VtZW50cyBhbmQgb0NvbXBvbmVudC5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIEBwYXJhbSB7QXJyYXl9IG9OYXZBcmd1bWVudHNBcnIgYW5kXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBvQ29tcG9uZW50IC0gY2hlY2sgdGhlIGRlZmluaXRpb24gb2Zcblx0ICogc2FwLnVzaGVsbC5zZXJ2aWNlcy5Dcm9zc0FwcGxpY2F0aW9uTmF2aWdhdGlvbj0+aXNOYXZpZ2F0aW9uU3VwcG9ydGVkIGFyZ3VtZW50c1xuXHQgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkIHRvIG9iamVjdFxuXHQgKi9cblx0aXNOYXZpZ2F0aW9uU3VwcG9ydGVkKG9OYXZBcmd1bWVudHNBcnI6IEFycmF5PG9iamVjdD4sIG9Db21wb25lbnQ6IG9iamVjdCkge1xuXHRcdHJldHVybiB3cmFwSlF1ZXJ5UHJvbWlzZSh0aGlzLmNyb3NzQXBwTmF2U2VydmljZS5pc05hdmlnYXRpb25TdXBwb3J0ZWQob05hdkFyZ3VtZW50c0Fyciwgb0NvbXBvbmVudCkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFdpbGwgY2FsbCBpc0luaXRpYWxOYXZpZ2F0aW9uIG1ldGhvZCBvZiBDcm9zc0FwcGxpY2F0aW9uTmF2aWdhdGlvbiBzZXJ2aWNlLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZCB0byBib29sZWFuXG5cdCAqL1xuXHRpc0luaXRpYWxOYXZpZ2F0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLmNyb3NzQXBwTmF2U2VydmljZS5pc0luaXRpYWxOYXZpZ2F0aW9uKCk7XG5cdH1cblxuXHQvKipcblx0ICogV2lsbCBjYWxsIGV4cGFuZENvbXBhY3RIYXNoIG1ldGhvZCBvZiBDcm9zc0FwcGxpY2F0aW9uTmF2aWdhdGlvbiBzZXJ2aWNlLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc0hhc2hGcmFnbWVudCBhbiAoaW50ZXJuYWwgZm9ybWF0KSBzaGVsbCBoYXNoXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlfSBwcm9taXNlIHRoZSBzdWNjZXNzIGhhbmRsZXIgb2YgdGhlIHJlc29sdmUgcHJvbWlzZSBnZXQgYW4gZXhwYW5kZWQgc2hlbGwgaGFzaCBhcyBmaXJzdCBhcmd1bWVudFxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICovXG5cdGV4cGFuZENvbXBhY3RIYXNoKHNIYXNoRnJhZ21lbnQ6IHN0cmluZykge1xuXHRcdHJldHVybiB0aGlzLmNyb3NzQXBwTmF2U2VydmljZS5leHBhbmRDb21wYWN0SGFzaChzSGFzaEZyYWdtZW50KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBXaWxsIGNhbGwgcGFyc2VTaGVsbEhhc2ggbWV0aG9kIG9mIFVSTFBhcnNpbmcgc2VydmljZSB3aXRoIGdpdmVuIHNIYXNoLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICogQHBhcmFtIHtzdHJpbmd9IHNIYXNoIC0gY2hlY2sgdGhlIGRlZmluaXRpb24gb2Zcblx0ICogc2FwLnVzaGVsbC5zZXJ2aWNlcy5VUkxQYXJzaW5nPT5wYXJzZVNoZWxsSGFzaCBhcmd1bWVudHNcblx0ICogQHJldHVybnMge29iamVjdH0gd2hpY2ggd2lsbCByZXR1cm4gb2JqZWN0XG5cdCAqL1xuXHRwYXJzZVNoZWxsSGFzaChzSGFzaDogc3RyaW5nKSB7XG5cdFx0cmV0dXJuIHRoaXMudXJsUGFyc2luZ1NlcnZpY2UucGFyc2VTaGVsbEhhc2goc0hhc2gpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFdpbGwgY2FsbCBzcGxpdEhhc2ggbWV0aG9kIG9mIFVSTFBhcnNpbmcgc2VydmljZSB3aXRoIGdpdmVuIHNIYXNoLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICogQHBhcmFtIHtzdHJpbmd9IHNIYXNoIC0gY2hlY2sgdGhlIGRlZmluaXRpb24gb2Zcblx0ICogc2FwLnVzaGVsbC5zZXJ2aWNlcy5VUkxQYXJzaW5nPT5zcGxpdEhhc2ggYXJndW1lbnRzXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQgdG8gb2JqZWN0XG5cdCAqL1xuXHRzcGxpdEhhc2goc0hhc2g6IHN0cmluZykge1xuXHRcdHJldHVybiB0aGlzLnVybFBhcnNpbmdTZXJ2aWNlLnNwbGl0SGFzaChzSGFzaCk7XG5cdH1cblxuXHQvKipcblx0ICogV2lsbCBjYWxsIGNvbnN0cnVjdFNoZWxsSGFzaCBtZXRob2Qgb2YgVVJMUGFyc2luZyBzZXJ2aWNlIHdpdGggZ2l2ZW4gc0hhc2guXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAcGFyYW0ge29iamVjdH0gb05ld1NoZWxsSGFzaCAtIGNoZWNrIHRoZSBkZWZpbml0aW9uIG9mXG5cdCAqIHNhcC51c2hlbGwuc2VydmljZXMuVVJMUGFyc2luZz0+Y29uc3RydWN0U2hlbGxIYXNoIGFyZ3VtZW50c1xuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBTaGVsbCBIYXNoIHN0cmluZ1xuXHQgKi9cblx0Y29uc3RydWN0U2hlbGxIYXNoKG9OZXdTaGVsbEhhc2g6IG9iamVjdCkge1xuXHRcdHJldHVybiB0aGlzLnVybFBhcnNpbmdTZXJ2aWNlLmNvbnN0cnVjdFNoZWxsSGFzaChvTmV3U2hlbGxIYXNoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBXaWxsIGNhbGwgc2V0RGlydHlGbGFnIG1ldGhvZCB3aXRoIGdpdmVuIGRpcnR5IHN0YXRlLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICogQHBhcmFtIHtib29sZWFufSBiRGlydHkgLSBjaGVjayB0aGUgZGVmaW5pdGlvbiBvZiBzYXAudXNoZWxsLkNvbnRhaW5lci5zZXREaXJ0eUZsYWcgYXJndW1lbnRzXG5cdCAqL1xuXHRzZXREaXJ0eUZsYWcoYkRpcnR5OiBib29sZWFuKSB7XG5cdFx0dGhpcy5vU2hlbGxDb250YWluZXIuc2V0RGlydHlGbGFnKGJEaXJ0eSk7XG5cdH1cblxuXHQvKipcblx0ICogV2lsbCBjYWxsIHJlZ2lzdGVyRGlydHlTdGF0ZVByb3ZpZGVyIG1ldGhvZCB3aXRoIGdpdmVuIGRpcnR5IHN0YXRlIHByb3ZpZGVyIGNhbGxiYWNrIG1ldGhvZC5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGZuRGlydHlTdGF0ZVByb3ZpZGVyIC0gY2hlY2sgdGhlIGRlZmluaXRpb24gb2Ygc2FwLnVzaGVsbC5Db250YWluZXIucmVnaXN0ZXJEaXJ0eVN0YXRlUHJvdmlkZXIgYXJndW1lbnRzXG5cdCAqL1xuXHRyZWdpc3RlckRpcnR5U3RhdGVQcm92aWRlcihmbkRpcnR5U3RhdGVQcm92aWRlcjogRnVuY3Rpb24pIHtcblx0XHR0aGlzLm9TaGVsbENvbnRhaW5lci5yZWdpc3RlckRpcnR5U3RhdGVQcm92aWRlcihmbkRpcnR5U3RhdGVQcm92aWRlcik7XG5cdH1cblxuXHQvKipcblx0ICogV2lsbCBjYWxsIGRlcmVnaXN0ZXJEaXJ0eVN0YXRlUHJvdmlkZXIgbWV0aG9kIHdpdGggZ2l2ZW4gZGlydHkgc3RhdGUgcHJvdmlkZXIgY2FsbGJhY2sgbWV0aG9kLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gZm5EaXJ0eVN0YXRlUHJvdmlkZXIgLSBjaGVjayB0aGUgZGVmaW5pdGlvbiBvZiBzYXAudXNoZWxsLkNvbnRhaW5lci5kZXJlZ2lzdGVyRGlydHlTdGF0ZVByb3ZpZGVyIGFyZ3VtZW50c1xuXHQgKi9cblx0ZGVyZWdpc3RlckRpcnR5U3RhdGVQcm92aWRlcihmbkRpcnR5U3RhdGVQcm92aWRlcjogRnVuY3Rpb24pIHtcblx0XHR0aGlzLm9TaGVsbENvbnRhaW5lci5kZXJlZ2lzdGVyRGlydHlTdGF0ZVByb3ZpZGVyKGZuRGlydHlTdGF0ZVByb3ZpZGVyKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBXaWxsIGNhbGwgY3JlYXRlUmVuZGVyZXIgbWV0aG9kIG9mIHVzaGVsbCBjb250YWluZXIuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAcmV0dXJucyB7b2JqZWN0fSByZXR1cm5zIHJlbmRlcmVyIG9iamVjdFxuXHQgKi9cblx0Y3JlYXRlUmVuZGVyZXIoKSB7XG5cdFx0cmV0dXJuIHRoaXMub1NoZWxsQ29udGFpbmVyLmNyZWF0ZVJlbmRlcmVyKCk7XG5cdH1cblxuXHQvKipcblx0ICogV2lsbCBjYWxsIGdldFVzZXIgbWV0aG9kIG9mIHVzaGVsbCBjb250YWluZXIuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAcmV0dXJucyB7b2JqZWN0fSByZXR1cm5zIFVzZXIgb2JqZWN0XG5cdCAqL1xuXHRnZXRVc2VyKCkge1xuXHRcdHJldHVybiB0aGlzLm9TaGVsbENvbnRhaW5lci5nZXRVc2VyKCk7XG5cdH1cblxuXHQvKipcblx0ICogV2lsbCBjaGVjayBpZiB1c2hlbGwgY29udGFpbmVyIGlzIGF2YWlsYWJsZSBvciBub3QuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gcmV0dXJucyB0cnVlXG5cdCAqL1xuXHRoYXNVU2hlbGwoKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvKipcblx0ICogV2lsbCBjYWxsIHJlZ2lzdGVyTmF2aWdhdGlvbkZpbHRlciBtZXRob2Qgb2Ygc2hlbGxOYXZpZ2F0aW9uLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbk5hdkZpbHRlciB0aGUgZmlsdGVyIGZ1bmN0aW9uIHRvIHJlZ2lzdGVyXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICovXG5cdHJlZ2lzdGVyTmF2aWdhdGlvbkZpbHRlcihmbk5hdkZpbHRlcjogRnVuY3Rpb24pIHtcblx0XHR0aGlzLnNoZWxsTmF2aWdhdGlvbi5yZWdpc3Rlck5hdmlnYXRpb25GaWx0ZXIoZm5OYXZGaWx0ZXIpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFdpbGwgY2FsbCB1bnJlZ2lzdGVyTmF2aWdhdGlvbkZpbHRlciBtZXRob2Qgb2Ygc2hlbGxOYXZpZ2F0aW9uLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbk5hdkZpbHRlciB0aGUgZmlsdGVyIGZ1bmN0aW9uIHRvIHVucmVnaXN0ZXJcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKi9cblx0dW5yZWdpc3Rlck5hdmlnYXRpb25GaWx0ZXIoZm5OYXZGaWx0ZXI6IEZ1bmN0aW9uKSB7XG5cdFx0dGhpcy5zaGVsbE5hdmlnYXRpb24udW5yZWdpc3Rlck5hdmlnYXRpb25GaWx0ZXIoZm5OYXZGaWx0ZXIpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFdpbGwgY2FsbCBzZXRCYWNrTmF2aWdhdGlvbiBtZXRob2Qgb2YgU2hlbGxVSVNlcnZpY2Vcblx0ICogdGhhdCBkaXNwbGF5cyB0aGUgYmFjayBidXR0b24gaW4gdGhlIHNoZWxsIGhlYWRlci5cblx0ICpcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gW2ZuQ2FsbEJhY2tdXG5cdCAqIEEgY2FsbGJhY2sgZnVuY3Rpb24gY2FsbGVkIHdoZW4gdGhlIGJ1dHRvbiBpcyBjbGlja2VkIGluIHRoZSBVSS5cblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKi9cblx0c2V0QmFja05hdmlnYXRpb24oZm5DYWxsQmFjaz86IEZ1bmN0aW9uKTogdm9pZCB7XG5cdFx0dGhpcy5zaGVsbFVJU2VydmljZS5zZXRCYWNrTmF2aWdhdGlvbihmbkNhbGxCYWNrKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBXaWxsIGNhbGwgc2V0SGllcmFyY2h5IG1ldGhvZCBvZiBTaGVsbFVJU2VydmljZVxuXHQgKiB0aGF0IGRpc3BsYXlzIHRoZSBnaXZlbiBoaWVyYXJjaHkgaW4gdGhlIHNoZWxsIGhlYWRlci5cblx0ICpcblx0ICogQHBhcmFtIHtvYmplY3RbXX0gW2FIaWVyYXJjaHlMZXZlbHNdXG5cdCAqIEFuIGFycmF5IHJlcHJlc2VudGluZyBoaWVyYXJjaGllcyBvZiB0aGUgY3VycmVudGx5IGRpc3BsYXllZCBhcHAuXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICovXG5cdHNldEhpZXJhcmNoeShhSGllcmFyY2h5TGV2ZWxzOiBBcnJheTxvYmplY3Q+KTogdm9pZCB7XG5cdFx0dGhpcy5zaGVsbFVJU2VydmljZS5zZXRIaWVyYXJjaHkoYUhpZXJhcmNoeUxldmVscyk7XG5cdH1cblxuXHQvKipcblx0ICogV2lsbCBjYWxsIHNldFRpdGxlIG1ldGhvZCBvZiBTaGVsbFVJU2VydmljZVxuXHQgKiB0aGF0IGRpc3BsYXlzIHRoZSBnaXZlbiB0aXRsZSBpbiB0aGUgc2hlbGwgaGVhZGVyLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gW3NUaXRsZV1cblx0ICogVGhlIG5ldyB0aXRsZS4gVGhlIGRlZmF1bHQgdGl0bGUgaXMgc2V0IGlmIHRoaXMgYXJndW1lbnQgaXMgbm90IGdpdmVuLlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICogQHByaXZhdGVcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqL1xuXHRzZXRUaXRsZShzVGl0bGU6IHN0cmluZyk6IHZvaWQge1xuXHRcdHRoaXMuc2hlbGxVSVNlcnZpY2Uuc2V0VGl0bGUoc1RpdGxlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIGN1cnJlbnRseSBkZWZpbmVkIGNvbnRlbnQgZGVuc2l0eS5cblx0ICpcblx0ICogQHJldHVybnMge3N0cmluZ30gdGhlIGNvbnRlbnQgZGVuc2l0eSB2YWx1ZVxuXHQgKi9cblx0Z2V0Q29udGVudERlbnNpdHkoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gKHRoaXMub1NoZWxsQ29udGFpbmVyLmdldFVzZXIoKSBhcyBhbnkpLmdldENvbnRlbnREZW5zaXR5KCk7XG5cdH1cbn1cblxuLyoqXG4gKiBTZXJ2aWNlIEZhY3RvcnkgZm9yIHRoZSBTaGVsbFNlcnZpY2VzXG4gKlxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgU2hlbGxTZXJ2aWNlc0ZhY3RvcnkgZXh0ZW5kcyBTZXJ2aWNlRmFjdG9yeTxTaGVsbFNlcnZpY2VzU2V0dGluZ3M+IHtcblx0LyoqXG5cdCAqIENyZWF0ZXMgZWl0aGVyIGEgc3RhbmRhcmQgb3IgYSBtb2NrIFNoZWxsIHNlcnZpY2UgZGVwZW5kaW5nIG9uIHRoZSBjb25maWd1cmF0aW9uLlxuXHQgKlxuXHQgKiBAcGFyYW0ge1NlcnZpY2VDb250ZXh0PFNoZWxsU2VydmljZXNTZXR0aW5ncz59IG9TZXJ2aWNlQ29udGV4dCB0aGUgc2hlbGxzZXJ2aWNlIGNvbnRleHRcblx0ICogQHJldHVybnMge1Byb21pc2U8SVNoZWxsU2VydmljZXM+fSBhIHByb21pc2UgZm9yIGEgc2hlbGwgc2VydmljZSBpbXBsZW1lbnRhdGlvblxuXHQgKiBAc2VlIFNlcnZpY2VGYWN0b3J5I2NyZWF0ZUluc3RhbmNlXG5cdCAqL1xuXHRjcmVhdGVJbnN0YW5jZShvU2VydmljZUNvbnRleHQ6IFNlcnZpY2VDb250ZXh0PFNoZWxsU2VydmljZXNTZXR0aW5ncz4pOiBQcm9taXNlPElTaGVsbFNlcnZpY2VzPiB7XG5cdFx0b1NlcnZpY2VDb250ZXh0LnNldHRpbmdzLnNoZWxsQ29udGFpbmVyID0gc2FwLnVzaGVsbCAmJiBzYXAudXNoZWxsLkNvbnRhaW5lcjtcblx0XHRjb25zdCBvU2hlbGxTZXJ2aWNlID0gb1NlcnZpY2VDb250ZXh0LnNldHRpbmdzLnNoZWxsQ29udGFpbmVyXG5cdFx0XHQ/IG5ldyBTaGVsbFNlcnZpY2VzKG9TZXJ2aWNlQ29udGV4dCBhcyBTZXJ2aWNlQ29udGV4dDxSZXF1aXJlZDxTaGVsbFNlcnZpY2VzU2V0dGluZ3M+Pilcblx0XHRcdDogbmV3IFNoZWxsU2VydmljZU1vY2sob1NlcnZpY2VDb250ZXh0KTtcblx0XHRyZXR1cm4gb1NoZWxsU2VydmljZS5pbml0UHJvbWlzZS50aGVuKCgpID0+IHtcblx0XHRcdC8vIEVucmljaCB0aGUgYXBwQ29tcG9uZW50IHdpdGggdGhpcyBtZXRob2Rcblx0XHRcdChvU2VydmljZUNvbnRleHQuc2NvcGVPYmplY3QgYXMgYW55KS5nZXRTaGVsbFNlcnZpY2VzID0gKCkgPT4gb1NoZWxsU2VydmljZTtcblx0XHRcdHJldHVybiBvU2hlbGxTZXJ2aWNlO1xuXHRcdH0pO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNoZWxsU2VydmljZXNGYWN0b3J5O1xuIl19