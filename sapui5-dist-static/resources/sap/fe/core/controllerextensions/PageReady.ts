import { ControllerExtension, OverrideExecution } from "sap/ui/core/mvc";
import { ControllerExtensionMetadata } from "sap/fe/core/controllerextensions";
import { Component } from "sap/ui/core";
import { AppComponent, CommonUtils } from "sap/fe/core";
import { ManagedObject, EventProvider } from "sap/ui/base";
import { Log } from "sap/base";
import { Context } from "sap/ui/model";
import { UI5Event } from "global";
import { UI5Class, Override, Public, Final, Extensible, Private } from "../helpers/ClassSupport";

@UI5Class("sap.fe.core.controllerextensions.PageReady", ControllerExtensionMetadata)
class PageReadyControllerExtension extends ControllerExtension {
	private _oEventProvider!: EventProvider;
	private _oView: any;
	private _oAppComponent!: AppComponent;
	private _oPageComponent!: any;
	private _oContainer!: any;
	private _bAfterBindingAlreadyApplied!: boolean;
	private _fnContainerDelegate: any;

	private _bIsPageReady!: boolean;
	private _bWaitingForRefresh!: boolean;
	private bShown!: boolean;
	private bHasContext!: boolean;
	private bDataReceived: boolean | undefined;
	private bTablesLoaded: boolean | undefined;
	private pageReadyTimer: NodeJS.Timeout | undefined;

	@Override()
	public onInit() {
		this._oEventProvider = new EventProvider();
		this._oView = (this as any).base.getView();
		this._oAppComponent = CommonUtils.getAppComponent(this._oView);
		this._oPageComponent = Component.getOwnerComponentFor(this._oView);

		if (this._oPageComponent && this._oPageComponent.attachContainerDefined) {
			this._oPageComponent.attachContainerDefined((oEvent: UI5Event) => this.registerContainer(oEvent.getParameter("container")));
		} else {
			this.registerContainer(this._oView);
		}
	}

	@Override()
	public onExit() {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		delete this._oAppComponent;
		this._oContainer.removeEventDelegate(this._fnContainerDelegate);
	}

	@Override("_routing")
	onRouteMatched() {
		this._bIsPageReady = false;
	}
	@Override("_routing")
	onRouteMatchedFinished() {
		this.checkPageReadyDebounced();
	}

	@Override("_routing")
	onAfterBinding(oBindingContext: Context) {
		if (!this._bAfterBindingAlreadyApplied) {
			this._bAfterBindingAlreadyApplied = true;
			let aBoundElements: any[] = [];
			const aNotBoundMDCTables: any[] = [];
			let iRequested = 0;
			let iReceived = 0;
			const fnRequested = (oEvent: UI5Event) => {
				oEvent.getSource().detachDataRequested(fnRequested);
				iRequested++;
				this.bDataReceived = false;
			};
			const fnReceived = (oEvent: UI5Event) => {
				switch (oEvent.getSource().sGroupId) {
					case "$auto.Workers":
						this._oEventProvider.fireEvent("workersBatchReceived");
						break;
					case "$auto.Heroes":
						this._oEventProvider.fireEvent("heroesBatchReceived");
						break;
					default:
				}
				oEvent.getSource().detachDataReceived(fnReceived);
				iReceived++;
				if (iReceived === iRequested && iRequested !== 0) {
					iRequested = 0;
					iReceived = 0;
					this.bDataReceived = true;
					this.checkPageReadyDebounced();
				}
			};
			const fnSearch = function(oEvent: UI5Event) {
				const aMDCTables = aNotBoundMDCTables.filter(oElem => {
					if (oEvent.getSource().sId === oElem.getFilter()) {
						return true;
					}
					return false;
				});
				aMDCTables.forEach((oMDCTable: any) => {
					let oRowBinding = oMDCTable.getRowBinding();
					const fnAttachDataEvents = () => {
						oRowBinding.attachDataRequested(fnRequested);
						oRowBinding.attachDataReceived(fnReceived);
						aBoundElements.push(oRowBinding);
					};
					if (oRowBinding) {
						fnAttachDataEvents();
					} else {
						setTimeout(() => {
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

			this.attachEventOnce(
				"pageReady",
				null,
				() => {
					aBoundElements.forEach((oElement: any) => {
						oElement.detachEvent("dataRequested", fnRequested);
						oElement.detachEvent("dataReceived", fnReceived);
						oElement.detachEvent("search", fnSearch);
					});
					this._bAfterBindingAlreadyApplied = false;
					aBoundElements = [];
				},
				null
			);
			if (oBindingContext) {
				const mainObjectBinding = (oBindingContext as any).getBinding();
				mainObjectBinding.attachDataRequested(fnRequested);
				mainObjectBinding.attachDataReceived(fnReceived);
				aBoundElements.push(mainObjectBinding);
			}

			const aTableInitializedPromises: Promise<any>[] = [];
			this._oView.findAggregatedObjects(true, (oElement: any) => {
				const oObjectBinding = oElement.getObjectBinding();
				if (oObjectBinding) {
					// Register on all object binding (mostly used on object pages)
					oObjectBinding.attachDataRequested(fnRequested);
					oObjectBinding.attachDataReceived(fnReceived);
					aBoundElements.push(oObjectBinding);
				} else {
					const aBindingKeys = Object.keys(oElement.mBindingInfos);
					if (aBindingKeys.length > 0) {
						aBindingKeys.forEach(sPropertyName => {
							const oListBinding = oElement.mBindingInfos[sPropertyName].binding;
							// Register on all list binding, good for basic tables, problematic for MDC, see above
							if (oListBinding && oListBinding.isA("sap.ui.model.odata.v4.ODataListBinding")) {
								oListBinding.attachDataRequested(fnRequested);
								oListBinding.attachDataReceived(fnReceived);
								aBoundElements.push(oListBinding);
							}
						});
					}
				}
				// This is dirty but MDC Table has a weird loading lifecycle
				if (oElement.isA("sap.ui.mdc.Table")) {
					this.bTablesLoaded = false;
					// access binding only after table is bound
					aTableInitializedPromises.push(
						oElement
							.initialized()
							.then(() => {
								const oRowBinding = oElement.getRowBinding();
								if (oRowBinding) {
									oRowBinding.attachDataRequested(fnRequested);
									oRowBinding.attachDataReceived(fnReceived);
									aBoundElements.push(oRowBinding);
								} else {
									aNotBoundMDCTables.push(oElement);
								}
							})
							.catch(function(oError: Error) {
								Log.error("Cannot find a bound table", oError);
							})
					);
				} else if (oElement.isA("sap.ui.mdc.FilterBar")) {
					oElement.attachEvent("search", fnSearch);
					aBoundElements.push(oElement);
				}
			});
			if (aTableInitializedPromises.length > 0) {
				Promise.all(aTableInitializedPromises)
					.then(() => {
						this.bTablesLoaded = true;
						this.checkPageReadyDebounced();
					})
					.catch(oError => {
						Log.info("There was an error with one or multiple table", oError);
						this.bTablesLoaded = true;
						this.checkPageReadyDebounced();
					});
			}
		}
	}

	@Public
	@Final
	public isPageReady() {
		return this._bIsPageReady;
	}
	@Public
	@Final
	public attachEventOnce(sEventId: string, oData: any, fnFunction: Function, oListener: any) {
		// eslint-disable-next-line prefer-rest-params
		return this._oEventProvider.attachEventOnce(sEventId, oData, fnFunction, oListener);
	}
	@Public
	@Final
	public attachEvent(sEventId: string, oData: any, fnFunction: Function, oListener: any) {
		// eslint-disable-next-line prefer-rest-params
		return this._oEventProvider.attachEvent(sEventId, oData, fnFunction, oListener);
	}
	@Public
	@Final
	public detachEvent(sEventId: string, fnFunction: Function) {
		// eslint-disable-next-line prefer-rest-params
		return this._oEventProvider.detachEvent(sEventId, fnFunction);
	}
	private registerContainer(oContainer: ManagedObject) {
		this._oContainer = oContainer;
		this._fnContainerDelegate = {
			onBeforeShow: () => {
				this.bShown = false;
				this._bIsPageReady = false;
			},
			onBeforeHide: () => {
				this.bShown = false;
				this._bIsPageReady = false;
			},
			onAfterShow: () => {
				this.bShown = true;
				this._checkPageReady(true);
			}
		};
		this._oContainer.addEventDelegate(this._fnContainerDelegate);
	}

	@Private
	@Extensible(OverrideExecution.Instead)
	public isContextExpected() {
		return false;
	}

	public checkPageReadyDebounced() {
		if (this.pageReadyTimer) {
			clearTimeout(this.pageReadyTimer);
		}
		this.pageReadyTimer = setTimeout(() => {
			this._checkPageReady();
		}, 200);
	}

	public _checkPageReady(bFromNav: boolean = false) {
		const fnUIUpdated = () => {
			// Wait until the UI is no longer dirty
			if (!sap.ui.getCore().getUIDirty()) {
				sap.ui.getCore().detachEvent("UIUpdated", fnUIUpdated);
				this._bWaitingForRefresh = false;
				setTimeout(() => {
					this._checkPageReady();
				}, 20);
			}
		};

		// In case UIUpdate does not get called, check if UI is not dirty and then call _checkPageReady
		const checkUIUpdated = () => {
			if (sap.ui.getCore().getUIDirty()) {
				setTimeout(checkUIUpdated, 500);
			} else if (this._bWaitingForRefresh) {
				this._bWaitingForRefresh = false;
				sap.ui.getCore().detachEvent("UIUpdated", fnUIUpdated);
				this._checkPageReady();
			}
		};

		if (
			this.bShown &&
			this.bDataReceived !== false &&
			this.bTablesLoaded !== false &&
			(!this.isContextExpected() || this.bHasContext) // Either no context is expected or there is one
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
}

export default PageReadyControllerExtension;
