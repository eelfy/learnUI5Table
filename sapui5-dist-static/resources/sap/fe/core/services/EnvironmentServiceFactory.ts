import { ServiceFactory, Service, ServiceContext } from "sap/ui/core/service";
import { DefaultEnvironmentCapabilities, EnvironmentCapabilities } from "../converters/MetaModelConverter";
import { VersionInfo } from "sap/ui";

class EnvironmentCapabilitiesService extends Service<EnvironmentCapabilities> {
	resolveFn: any;
	rejectFn: any;
	initPromise!: Promise<any>;
	environmentCapabilities!: EnvironmentCapabilities;
	// !: means that we know it will be assigned before usage

	init() {
		this.initPromise = new Promise((resolve, reject) => {
			this.resolveFn = resolve;
			this.rejectFn = reject;
		});
		const oContext = this.getContext();
		this.environmentCapabilities = Object.assign({}, DefaultEnvironmentCapabilities);
		VersionInfo.load()
			.then(versionInfo => {
				this.environmentCapabilities.Chart = !!versionInfo.libraries.find(lib => lib.name === "sap.viz");
				this.environmentCapabilities.MicroChart = !!versionInfo.libraries.find(lib => lib.name === "sap.suite.ui.microchart");
				this.environmentCapabilities.UShell = !!(sap && sap.ushell && sap.ushell.Container);
				this.environmentCapabilities.IntentBasedNavigation = !!(sap && sap.ushell && sap.ushell.Container);
				this.environmentCapabilities = Object.assign(this.environmentCapabilities, oContext.settings);
				this.resolveFn(this);
			})
			.catch(this.rejectFn);
	}

	resolveLibrary(libraryName: string): Promise<boolean> {
		return new Promise(function(resolve) {
			try {
				sap.ui
					.getCore()
					.loadLibrary(`${libraryName.replace(/\./g, "/")}`, { async: true })
					.then(function() {
						resolve(true);
					})
					.catch(function() {
						resolve(false);
					});
			} catch (e) {
				resolve(false);
			}
		});
	}

	public setCapabilities(oCapabilities: EnvironmentCapabilities) {
		this.environmentCapabilities = oCapabilities;
	}

	public getCapabilities() {
		return this.environmentCapabilities;
	}

	getInterface(): any {
		return this;
	}
}

class EnvironmentServiceFactory extends ServiceFactory<EnvironmentCapabilities> {
	createInstance(oServiceContext: ServiceContext<EnvironmentCapabilities>) {
		const environmentCapabilitiesService = new EnvironmentCapabilitiesService(oServiceContext);
		return environmentCapabilitiesService.initPromise;
	}
}

export default EnvironmentServiceFactory;
