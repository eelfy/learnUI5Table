// modeler component for integration testing

sap.ui.define('test.sap.apf.testhelper.modelerComponentCloudFoundry.Component', [
	'sap/apf/modeler/Component',
	'sap/m/App'
], function(ModelerComponent, App) {
	"use strict";

	var Component = ModelerComponent.extend("test.sap.apf.testhelper.modelerComponentCloudFoundry.Component", {
		name: "test.sap.apf.testhelper.modelerComponentCloudFoundry",
		metadata: {
			manifest : "json",
			properties : {
				injectedApfApi: {
					Constructor: function(oComponent, injectedConstructors, manifests) {
						this.startApf = function() {
							var application = new App();
							return application;
						};
						this.destroy = function() {};

						this.startupSucceeded = function() {
							return true;
						};
					}
				}
			}
		},
		getInjections : function() {
			var inject = {
				functions: {
					isUsingCloudFoundryProxy: function() { return true; }
				}
			};
			jQuery.extend(true, inject, inject, ModelerComponent.prototype.getInjections.apply(this, arguments));

			return inject;
		}
	});
	return Component;

}, true);
