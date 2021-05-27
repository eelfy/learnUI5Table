//@ui5-bundle sap/ui/demo/iconexplorer/Component-h2-preload.js
sap.ui.predefine('sap/ui/demo/iconexplorer/Component',["sap/ui/core/UIComponent","sap/ui/Device","sap/ui/model/json/JSONModel","sap/ui/demo/iconexplorer/model/models","sap/ui/demo/iconexplorer/model/IconModel","sap/ui/demo/iconexplorer/model/FavoriteModel","sap/ui/demo/iconexplorer/controller/ErrorHandler","sap/ui/core/IconPool","sap/ui/VersionInfo"],function(U,D,J,m,I,F,E,a,V){"use strict";return U.extend("sap.ui.demo.iconexplorer.Component",{metadata:{manifest:"json"},init:function(){U.prototype.init.apply(this,arguments);V.load().then(function(v){var o=new J({isOpenUI5:v&&v.gav&&/openui5/i.test(v.gav)});this.setModel(o,"version");var f=new F();this.setModel(f,"fav");var i=new I(this._oIconsLoadedPromise);this.setModel(i);this.setModel(m.createDeviceModel(),"device");var b=[];var c={};c["SAP-icons"]={fontFamily:"SAP-icons",fontURI:sap.ui.require.toUrl("sap/ui/core/themes/base/fonts/")};var t={fontFamily:"SAP-icons-TNT",fontURI:sap.ui.require.toUrl("sap/tnt/themes/base/fonts/")};a.registerFont(t);b.push(a.fontLoaded("SAP-icons-TNT"));c["SAP-icons-TNT"]=t;if(!o.getProperty("/isOpenUI5")){var B={fontFamily:"BusinessSuiteInAppSymbols",fontURI:sap.ui.require.toUrl("sap/ushell/themes/base/fonts/")};a.registerFont(B);b.push(a.fontLoaded("BusinessSuiteInAppSymbols"));c["BusinessSuiteInAppSymbols"]=B;}this.iconsLoaded();Promise.all(b).then(function(){i.init(Object.keys(c));i.iconsLoaded().then(function(){this._fnIconsLoadedResolve();}.bind(this));}.bind(this));this._oFontConfigs=c;this._oErrorHandler=new E(this);this.getRouter().initialize();}.bind(this));},iconsLoaded:function(){if(!this._oIconsLoadedPromise){this._oIconsLoadedPromise=new Promise(function(r,R){this._fnIconsLoadedResolve=r;this._fnIconsLoadedReject=R;}.bind(this));}return this._oIconsLoadedPromise;},destroy:function(){this._oErrorHandler.destroy();U.prototype.destroy.apply(this,arguments);},getContentDensityClass:function(){if(this._sContentDensityClass===undefined){if(document.body.classList.contains("sapUiSizeCozy")||document.body.classList.contains("sapUiSizeCompact")){this._sContentDensityClass="";}else if(!D.support.touch){this._sContentDensityClass="sapUiSizeCompact";}else{this._sContentDensityClass="sapUiSizeCozy";}}return this._sContentDensityClass;}});});
sap.ui.require.preload({
	"sap/ui/demo/iconexplorer/manifest.json":'{"_version":"1.21.0","sap.app":{"id":"sap.ui.demo.iconexplorer","type":"application","i18n":{"bundleUrl":"i18n/i18n.properties","supportedLocales":[""],"fallbackLocale":""},"title":"{{appTitle}}","description":"{{appDescription}}","applicationVersion":{"version":"1.0.0"}},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://image-viewer","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"rootView":{"viewName":"sap.ui.demo.iconexplorer.view.App","type":"XML","async":true,"id":"app"},"dependencies":{"minUI5Version":"1.60.0","libs":{"sap.ui.core":{},"sap.m":{},"sap.f":{},"sap.ui.layout":{}}},"resources":{"css":[{"uri":"css/style.css"}]},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"sap.ui.demo.iconexplorer.i18n.i18n","supportedLocales":[""],"fallbackLocale":""}}},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","viewPath":"sap.ui.demo.iconexplorer.view","controlId":"app","controlAggregation":"pages","bypassed":{"target":"notFound"},"async":true},"routes":[{"pattern":"","name":"home","target":"home"},{"pattern":":?query:","name":"legacy","target":["overview"]},{"pattern":"overview/:fontName:/:?query:","name":"overview","target":"overview"}],"targets":{"home":{"viewName":"Home","viewId":"home","viewLevel":1},"overview":{"viewName":"Overview","viewId":"overview","viewLevel":2},"notFound":{"viewName":"NotFound","viewId":"notFound"}}}}}'
},"sap/ui/demo/iconexplorer/Component-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"sap/ui/demo/iconexplorer/Component.js":["sap/ui/Device.js","sap/ui/VersionInfo.js","sap/ui/core/IconPool.js","sap/ui/core/UIComponent.js","sap/ui/demo/iconexplorer/controller/ErrorHandler.js","sap/ui/demo/iconexplorer/model/FavoriteModel.js","sap/ui/demo/iconexplorer/model/IconModel.js","sap/ui/demo/iconexplorer/model/models.js","sap/ui/model/json/JSONModel.js"],
"sap/ui/demo/iconexplorer/controller/App.controller.js":["sap/base/Log.js","sap/ui/demo/iconexplorer/controller/BaseController.js","sap/ui/model/json/JSONModel.js"],
"sap/ui/demo/iconexplorer/controller/BaseController.js":["sap/ui/core/UIComponent.js","sap/ui/core/mvc/Controller.js"],
"sap/ui/demo/iconexplorer/controller/ErrorHandler.js":["sap/m/MessageBox.js","sap/ui/base/Object.js"],
"sap/ui/demo/iconexplorer/controller/Home.controller.js":["sap/ui/core/Icon.js","sap/ui/demo/iconexplorer/controller/BaseController.js","sap/ui/demo/iconexplorer/model/formatter.js","sap/ui/model/json/JSONModel.js"],
"sap/ui/demo/iconexplorer/controller/NotFound.controller.js":["sap/ui/demo/iconexplorer/controller/BaseController.js"],
"sap/ui/demo/iconexplorer/controller/Overview.controller.js":["sap/m/Label.js","sap/m/MessageToast.js","sap/m/ToggleButton.js","sap/m/library.js","sap/ui/Device.js","sap/ui/core/Fragment.js","sap/ui/core/IconPool.js","sap/ui/core/theming/Parameters.js","sap/ui/demo/iconexplorer/controller/BaseController.js","sap/ui/demo/iconexplorer/model/formatter.js","sap/ui/model/Filter.js","sap/ui/model/FilterOperator.js","sap/ui/model/json/JSONModel.js"],
"sap/ui/demo/iconexplorer/controls/TitleLink.js":["sap/m/Title.js","sap/m/Toolbar.js","sap/ui/Device.js","sap/ui/core/Renderer.js","sap/ui/core/library.js"],
"sap/ui/demo/iconexplorer/localService/mockserver.js":["sap/base/Log.js","sap/base/util/UriParameters.js","sap/ui/model/json/JSONModel.js","sap/ui/thirdparty/sinon.js"],
"sap/ui/demo/iconexplorer/model/FavoriteModel.js":["sap/base/Log.js","sap/ui/demo/iconexplorer/model/Sorter.js","sap/ui/model/json/JSONModel.js","sap/ui/util/Storage.js"],
"sap/ui/demo/iconexplorer/model/IconModel.js":["sap/base/Log.js","sap/ui/core/IconPool.js","sap/ui/demo/iconexplorer/model/Sorter.js","sap/ui/model/json/JSONModel.js"],
"sap/ui/demo/iconexplorer/model/formatter.js":["sap/ui/core/library.js"],
"sap/ui/demo/iconexplorer/model/models.js":["sap/ui/Device.js","sap/ui/model/json/JSONModel.js"],
"sap/ui/demo/iconexplorer/view/App.view.xml":["sap/m/App.js","sap/ui/core/mvc/XMLView.js","sap/ui/demo/iconexplorer/controller/App.controller.js"],
"sap/ui/demo/iconexplorer/view/Home.view.xml":["sap/m/Column.js","sap/m/ColumnListItem.js","sap/m/Input.js","sap/m/Label.js","sap/m/Link.js","sap/m/ObjectNumber.js","sap/m/Page.js","sap/m/PageAccessibleLandmarkInfo.js","sap/m/Text.js","sap/m/Token.js","sap/ui/core/CustomData.js","sap/ui/core/Icon.js","sap/ui/core/mvc/XMLView.js","sap/ui/demo/iconexplorer/controller/Home.controller.js","sap/ui/demo/iconexplorer/controls/TitleLink.js","sap/ui/layout/BlockLayout.js","sap/ui/layout/BlockLayoutCell.js","sap/ui/layout/BlockLayoutRow.js","sap/ui/layout/HorizontalLayout.js","sap/ui/layout/VerticalLayout.js"],
"sap/ui/demo/iconexplorer/view/NotFound.view.xml":["sap/m/Link.js","sap/m/MessagePage.js","sap/ui/core/mvc/XMLView.js","sap/ui/demo/iconexplorer/controller/NotFound.controller.js"],
"sap/ui/demo/iconexplorer/view/Overview.view.xml":["sap/m/Button.js","sap/m/ComboBox.js","sap/m/FlexBox.js","sap/m/FlexItemData.js","sap/m/FormattedText.js","sap/m/GenericTile.js","sap/m/IconTabBar.js","sap/m/IconTabFilter.js","sap/m/IconTabSeparator.js","sap/m/Input.js","sap/m/Label.js","sap/m/List.js","sap/m/NumericContent.js","sap/m/ObjectAttribute.js","sap/m/OverflowToolbar.js","sap/m/Page.js","sap/m/PageAccessibleLandmarkInfo.js","sap/m/Panel.js","sap/m/Popover.js","sap/m/ScrollContainer.js","sap/m/SearchField.js","sap/m/StandardListItem.js","sap/m/Text.js","sap/m/TileContent.js","sap/m/Token.js","sap/m/Tokenizer.js","sap/m/Toolbar.js","sap/m/ToolbarSpacer.js","sap/ui/core/CustomData.js","sap/ui/core/Icon.js","sap/ui/core/InvisibleText.js","sap/ui/core/Item.js","sap/ui/core/mvc/XMLView.js","sap/ui/demo/iconexplorer/controller/Overview.controller.js","sap/ui/layout/BlockLayout.js","sap/ui/layout/BlockLayoutCell.js","sap/ui/layout/BlockLayoutRow.js","sap/ui/layout/FixFlex.js","sap/ui/layout/PaneContainer.js","sap/ui/layout/ResponsiveSplitter.js","sap/ui/layout/SplitPane.js","sap/ui/layout/SplitterLayoutData.js","sap/ui/layout/VerticalLayout.js"],
"sap/ui/demo/iconexplorer/view/browse/Details.fragment.xml":["sap/m/Column.js","sap/m/ColumnListItem.js","sap/m/Label.js","sap/m/RatingIndicator.js","sap/m/Table.js","sap/m/Text.js","sap/m/Token.js","sap/ui/core/Fragment.js","sap/ui/core/Icon.js","sap/ui/layout/HorizontalLayout.js"],
"sap/ui/demo/iconexplorer/view/browse/Favorites.fragment.xml":["sap/m/Column.js","sap/m/ColumnListItem.js","sap/m/Label.js","sap/m/RatingIndicator.js","sap/m/Table.js","sap/m/Text.js","sap/m/Token.js","sap/ui/core/Fragment.js","sap/ui/core/Icon.js","sap/ui/layout/HorizontalLayout.js"],
"sap/ui/demo/iconexplorer/view/browse/Grid.fragment.xml":["sap/m/CustomListItem.js","sap/m/Label.js","sap/m/List.js","sap/m/RatingIndicator.js","sap/ui/core/Fragment.js","sap/ui/core/Icon.js","sap/ui/layout/VerticalLayout.js"],
"sap/ui/demo/iconexplorer/view/browse/Visual.fragment.xml":["sap/m/CustomListItem.js","sap/m/Label.js","sap/m/List.js","sap/m/RatingIndicator.js","sap/ui/core/Fragment.js","sap/ui/core/Icon.js","sap/ui/layout/VerticalLayout.js"]
}});
//# sourceMappingURL=Component-h2-preload.js.map