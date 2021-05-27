//@ui5-bundle sap/ushell/demo/AppDirtyStateProvider/Component-preload.js
sap.ui.predefine('sap/ushell/demo/AppDirtyStateProvider/Component',["sap/ushell/library","sap/ui/core/UIComponent"],function(l,U){"use strict";var N=l.NavigationState;return U.extend("sap.ushell.demo.AppDirtyStateProvider.Component",{metadata:{manifest:"json"},init:function(){U.prototype.init.apply(this,arguments);var r=this.getRouter();r.getTargets().attachDisplay(this._storeCurrentView,this);r.initialize();this.fnGetDirtyStateProvider=this.getDirtyState.bind(this);sap.ushell.Container.registerDirtyStateProvider(this.fnGetDirtyStateProvider);},exit:function(){this.getRouter().getTargets().detachDisplay(this._storeCurrentView,this);sap.ushell.Container.deregisterDirtyStateProvider(this.fnGetDirtyStateProvider);},_isViewDirty:function(v){var m=v.getModel();var i=m&&m.getProperty("/dirtyState");return i;},getDirtyState:function(n){var i=this._isViewDirty(this._oCurrentView);if(n.status===N.Finished){return i;}if(n.isCrossAppNavigation){return i;}var c=n.innerAppRoute;var r=this.getRouter().getRouteInfoByHash(c);switch(r.name){case"employeeOverview":return i;default:return false;}},_storeCurrentView:function(t){this._oCurrentView=t.getParameter("view");}});});
sap.ui.predefine('sap/ushell/demo/AppDirtyStateProvider/controller/App.controller',["sap/ushell/demo/AppDirtyStateProvider/controller/BaseController","sap/ui/model/json/JSONModel"],function(B,J){"use strict";var i="A dirty flag provider is an application-defined function that is called lazily by the Fiori Launchpad"+"when the dirty state of the application is to be determined."+"Simple scenarios (applications made of a single view) are covered by another basic API"+"(sap.ushell.Container.setDirtyState(<boolean>)). However, managing dirty state via dirty state providers can be useful if the "+"application is composed of multiple views and complex decisions must be taken to determine the dirty state of the application. \n\n"+"This application contains sample code that demonstrates how to use dirty state"+"providers in UI5 applications that display views based on the UI5 router concept."+"Specifically, this example addresses advanced scenario where"+"the application has multiple views, but only some of them destroy the input of the user"+"upon navigation. To take the correct decision, the dirty state provider"+"will check the context in which the navigation occur, managing in detail cross and inner app navigations.\n\n"+"The idea is to manage the decision of displaying the dirty state dialog to the user"+"centrally, in the application component, while keeping track of the"+"current application view.";return B.extend("sap.ushell.demo.AppDirtyStateProvider.controller.App",{onInit:function(){this.oModelData={introText:i,dirtyState:false};this._setModel(this.oModelData);},onDisplayNotFound:function(){this.getRouter().getTargets().display("notFound",{fromTarget:"home"});},onNavToEmployees:function(){this.getRouter().navTo("employeeList");},onNavToEmployeeOverview:function(){this.getRouter().navTo("employeeOverview");},onTextChange:function(e){var d=e.getSource().getValue()!=="";this.getView().getModel().setProperty("/dirtyState",d);},_setModel:function(j){if(!this._oModel){this._oModel=new J(j);}else{this._oModel.setData(j);}this.getView().setModel(this._oModel);}});});
sap.ui.predefine('sap/ushell/demo/AppDirtyStateProvider/controller/BaseController',["sap/ui/core/mvc/Controller","sap/ui/core/routing/History"],function(C,H){"use strict";return C.extend("sap.ushell.demo.AppDirtyStateProvider.controller.BaseController",{getRouter:function(){return sap.ui.core.UIComponent.getRouterFor(this);},onNavBack:function(){var h=H.getInstance();var p=h.getPreviousHash();if(p!==undefined){window.history.go(-1);}else{this.getRouter().navTo("appHome",{},true);}}});});
sap.ui.predefine('sap/ushell/demo/AppDirtyStateProvider/controller/NotFound.controller',["sap/ushell/demo/AppDirtyStateProvider/controller/BaseController"],function(B){"use strict";return B.extend("sap.ushell.demo.AppDirtyStateProvider.controller.NotFound",{onInit:function(){var r=this.getRouter();var t=r.getTarget("notFound");t.attachDisplay(function(e){this._oData=e.getParameter("data");},this);},onNavBack:function(e){if(this._oData&&this._oData.fromTarget){this.getRouter().getTargets().display(this._oData.fromTarget);delete this._oData.fromTarget;return;}B.prototype.onNavBack.apply(this,arguments);}});});
sap.ui.predefine('sap/ushell/demo/AppDirtyStateProvider/controller/employee/EmployeeList.controller',["sap/ushell/demo/AppDirtyStateProvider/controller/BaseController","sap/ui/model/json/JSONModel"],function(B,J){"use strict";return B.extend("sap.ushell.demo.AppDirtyStateProvider.controller.employee.EmployeeList",{onInit:function(){var r=this.getRouter();r.getRoute("employeeList").attachMatched(this._onRouteMatched,this);},_onRouteMatched:function(){var m=new J();m.loadData("../../demoapps/AppDirtyStateProvider/localService/mockdata/Employees.json").then(function(){this.getView().setModel(m);}.bind(this));}});});
sap.ui.predefine('sap/ushell/demo/AppDirtyStateProvider/controller/employee/overview/EmployeeOverview.controller',["sap/ushell/demo/AppDirtyStateProvider/controller/BaseController"],function(B){"use strict";return B.extend("sap.ushell.demo.AppDirtyStateProvider.controller.employee.overview.EmployeeOverview",{});});
sap.ui.predefine('sap/ushell/demo/AppDirtyStateProvider/controller/employee/overview/EmployeeOverviewContent.controller',["sap/ushell/demo/AppDirtyStateProvider/controller/BaseController"],function(B){"use strict";return B.extend("sap.ushell.demo.AppDirtyStateProvider.controller.employee.overview.EmployeeOverviewContent",{});});
sap.ui.require.preload({
	"sap/ushell/demo/AppDirtyStateProvider/i18n/i18n.properties":'#\n#Mon Mar 29 18:19:17 UTC 2021\nEmployeeDetailTitle=Employee Details of {0} {1}\nappTitle=SAPUI5 Navigation\nFirstName=First Name\nDisplayNotFound=Display Not Found\nNotFound=Not Found\nEmployeeDetailsOf=Employee Details of\nResumeOf=RÃ©sumÃ© of\nCity=City\nEmployeeID=Employee ID\nEmployees=Employees\nRegion=Region\nEmployeeOverview=Employee Overview\nEmployeeOverviewTop=Employees Overview Top\nHobbies=Hobbies\nShowEmployeeList=Show Employee List\nEmployeeIDColon=Employee ID\\:\nNotes=Notes\nListOfAllEmployees=List of all employees\nPostalCode=Postal Code\nCountry=Country\nPhoneHome=Phone (Home)\nShowEmployeeOverview=Show Employees Overview\nResumeTitle=RÃ©sumÃ© of {0} {1}\nhomePageTitle=App Home\nProjects=Projects\nAddress=Address\nInfo=Info\nEmployeeList=Employee List\nappDescription=A simple app that explains how to use navigation and routing features of SAPUI5\nNotFound.text=Sorry, but the requested resource is not available.\nLastName=Last Name\nFlipToResume=Flip to RÃ©sumÃ©\nNotFound.description=Please check the URL and try again.\niWantToNavigate=I want to navigate\nPhone=Phone\nFlipToResume.tooltip=See the rÃ©sumÃ© of this employee\n',
	"sap/ushell/demo/AppDirtyStateProvider/manifest.json":'{"_version":"1.1.0","sap.app":{"_version":"1.1.0","id":"sap.ushell.demo.AppDirtyStateProvider","type":"application","i18n":"i18n/i18n.properties","title":"{{appTitle}}","description":"{{appDescription}}","applicationVersion":{"version":"1.0.0"},"ach":"CA-UI5-FST"},"sap.ui":{"_version":"1.1.0","technology":"UI5","deviceTypes":{"desktop":true,"tablet":true,"phone":true},"supportedThemes":["sap_bluecrystal"]},"sap.ui5":{"_version":"1.1.0","rootView":{"viewName":"sap.ushell.demo.AppDirtyStateProvider.view.App","type":"XML"},"dependencies":{"minUI5Version":"1.30","libs":{"sap.m":{}}},"services":{"ShellUIService":{"factoryName":"sap.ushell.ui5service.ShellUIService","lazy":false,"settings":{"setHierarchy":"auto","setTitle":"auto"}}},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"sap.ushell.demo.AppDirtyStateProvider.i18n.i18n"}},"":{"dataSource":"employeeRemote"}},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","viewPath":"sap.ushell.demo.AppDirtyStateProvider.view","controlId":"app","controlAggregation":"pages","transition":"slide","bypassed":{"target":"notFound"}},"routes":[{"pattern":"","name":"appHome","target":"home"},{"pattern":"employees","name":"employeeList","target":"employees"},{"pattern":"employee/overview:?query:","name":"employeeOverview","titleTarget":"EmployeeOverviewContent","target":["EmployeeOverviewTop","EmployeeOverviewContent"]}],"targets":{"home":{"viewName":"App","title":"{i18n>homePageTitle}","viewLevel":1},"notFound":{"viewName":"NotFound","transition":"show"},"employees":{"viewPath":"sap.ushell.demo.AppDirtyStateProvider.view.employee","viewName":"EmployeeList","viewLevel":2,"title":"{i18n>EmployeeList}"},"EmployeeOverview":{"viewPath":"sap.ushell.demo.AppDirtyStateProvider.view.employee.overview","viewName":"EmployeeOverview","viewLevel":2},"EmployeeOverviewTop":{"parent":"EmployeeOverview","viewPath":"sap.ushell.demo.AppDirtyStateProvider.view.employee.overview","viewName":"EmployeeOverviewTop","controlId":"EmployeeOverviewParent","controlAggregation":"content"},"EmployeeOverviewContent":{"parent":"EmployeeOverview","viewPath":"sap.ushell.demo.AppDirtyStateProvider.view.employee.overview","viewName":"EmployeeOverviewContent","title":"{i18n>EmployeeOverview}","controlId":"EmployeeOverviewParent","controlAggregation":"content"}}}}}',
	"sap/ushell/demo/AppDirtyStateProvider/view/App.view.xml":'<mvc:View xmlns="sap.m" xmlns:mvc="sap.ui.core.mvc" xmlns:core="sap.ui.core" xmlns:layout="sap.ui.layout" controllerName="sap.ushell.demo.AppDirtyStateProvider.controller.App" displayBlock="true"><App id="app"><Page showHeader="false" class="sapUiResponsiveContentPadding"><content><Title titleStyle="H2" text="Introduction"/><TextArea id="infoArea" width="100%" rows="30" editable="false" value="{/introText}"/><layout:VerticalLayout width="100%"><layout:content><Title titleStyle="H2" text="Edit information" class="sapUiSmallMarginTop"/><Input class="sapUiSmallMarginBottom" liveChange="onTextChange" type="text" id="dirtyStateInput"/><Label text="Dirty state" class="sapUiTinyMarginBottom"/><layout:HorizontalLayout><layout:content><core:Icon src="status-negative" class="sapUiTinyMarginEnd" color="{= ${/dirtyState} ? \'red\' : \'green\'}"/><Label text="{= ${/dirtyState} ? \'Dirty\' : \'Not dirty\'}"/></layout:content></layout:HorizontalLayout><Title titleStyle="H2" text="Navigate to other views" class="sapUiSmallMarginTop sapUiSmallMarginBottom"/><layout:HorizontalLayout><layout:content><Button id="displayNotFoundBtn" text="{i18n&gt;DisplayNotFound}" press="onDisplayNotFound" class="sapUiTinyMarginEnd"/><Button id="employeeListBtn" text="{i18n&gt;ShowEmployeeList}" press="onNavToEmployees" class="sapUiTinyMarginEnd"/><Button id="employeeOverviewBtn" type="Reject" text="{i18n&gt;ShowEmployeeOverview}" press="onNavToEmployeeOverview" class="sapUiTinyMarginEnd"/></layout:content></layout:HorizontalLayout></layout:content></layout:VerticalLayout></content></Page></App></mvc:View>',
	"sap/ushell/demo/AppDirtyStateProvider/view/NotFound.view.xml":'<mvc:View controllerName="sap.ushell.demo.AppDirtyStateProvider.controller.NotFound" xmlns="sap.m" xmlns:mvc="sap.ui.core.mvc"><MessagePage title="{i18n&gt;NotFound}" text="{i18n&gt;NotFound.text}" description="{i18n&gt;NotFound.description}" showNavButton="true" navButtonPress="onNavBack"/></mvc:View>',
	"sap/ushell/demo/AppDirtyStateProvider/view/employee/EmployeeList.view.xml":'<mvc:View controllerName="sap.ushell.demo.AppDirtyStateProvider.controller.employee.EmployeeList" xmlns="sap.m" xmlns:mvc="sap.ui.core.mvc"><Page id="employeeListPage" showHeader="false" title="{i18n&gt;EmployeeList}" showNavButton="true" navButtonPress="onNavBack" class="sapUiResponsiveContentPadding"><content><List id="employeeList" headerText="{i18n&gt;ListOfAllEmployees}" items="{/}"><items><StandardListItem title="{FirstName} {LastName}" iconDensityAware="false" iconInset="false" type="Navigation"/></items></List></content></Page></mvc:View>',
	"sap/ushell/demo/AppDirtyStateProvider/view/employee/overview/EmployeeOverview.view.xml":'<mvc:View controllerName="sap.ushell.demo.AppDirtyStateProvider.controller.employee.overview.EmployeeOverview" xmlns="sap.m" xmlns:mvc="sap.ui.core.mvc"><Page id="EmployeeOverviewParent" title="{i18n&gt;EmployeeOverview}" showHeader="false" showNavButton="true" navButtonPress="onNavBack" class="sapUiResponsiveContentPadding"><content/></Page></mvc:View>',
	"sap/ushell/demo/AppDirtyStateProvider/view/employee/overview/EmployeeOverviewContent.view.xml":'<mvc:View controllerName="sap.ushell.demo.AppDirtyStateProvider.controller.employee.overview.EmployeeOverviewContent" xmlns="sap.m" xmlns:mvc="sap.ui.core.mvc"><Table id="employeesTable"><headerToolbar><Toolbar><Title text="{i18n&gt;Employees}" level="H2"/><ToolbarSpacer/><SearchField id="searchField" width="50%"/><Button icon="sap-icon://sort"/></Toolbar></headerToolbar><columns><Column id="employeeIDCol"><Text text="{i18n&gt;EmployeeID}"/></Column><Column id="firstNameCol" demandPopin="true"><Text text="{i18n&gt;FirstName}"/></Column><Column id="lastNameCol" demandPopin="true"><Text text="{i18n&gt;LastName}"/></Column><Column id="addressCol" minScreenWidth="Tablet" demandPopin="true"><Text text="{i18n&gt;Address}"/></Column><Column id="cityCol" minScreenWidth="Tablet" demandPopin="true"><Text text="{i18n&gt;City}"/></Column><Column id="regionCol" minScreenWidth="Tablet" demandPopin="true"><Text text="{i18n&gt;Region}"/></Column><Column id="postalCodeCol" minScreenWidth="Tablet" demandPopin="true"><Text text="{i18n&gt;PostalCode}"/></Column><Column id="countryCol" minScreenWidth="Tablet" demandPopin="true"><Text text="{i18n&gt;Country}"/></Column><Column id="homePhoneCol" minScreenWidth="Tablet" demandPopin="true" hAlign="Right"><Text text="{i18n&gt;Phone}"/></Column></columns><items/></Table></mvc:View>',
	"sap/ushell/demo/AppDirtyStateProvider/view/employee/overview/EmployeeOverviewTop.view.xml":'<mvc:View xmlns="sap.m" xmlns:mvc="sap.ui.core.mvc" class="sapUiMediumMarginBottom"><Title text="{i18n&gt;EmployeeOverviewTop}"/></mvc:View>'
},"sap/ushell/demo/AppDirtyStateProvider/Component-preload"
);
//# sourceMappingURL=Component-preload.js.map