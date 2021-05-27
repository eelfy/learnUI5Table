import { OverrideExecution } from "sap/ui/core/mvc";
import { ObjectPath, deepClone } from "sap/base/util";
import { ElementMetadata, RenderManager } from "sap/ui/core";
import { UI5Event } from "global";

const ensureMetadata = function(target: any) {
	if (!target.hasOwnProperty("metadata")) {
		target.metadata = deepClone(
			target.metadata || {
				properties: {},
				macroContexts: {},
				aggregations: {},
				associations: {},
				methods: {},
				events: {}
			}
		);
	}
	return target.metadata;
};
export function Override(sTarget?: string) {
	return function(target: any, propertyKey: string) {
		if (!target.override) {
			target.override = {};
		}
		let currentTarget = target.override;
		if (sTarget) {
			if (!currentTarget.extension) {
				currentTarget.extension = {};
			}
			if (!currentTarget.extension[sTarget]) {
				currentTarget.extension[sTarget] = {};
			}
			currentTarget = currentTarget.extension[sTarget];
		}
		currentTarget[propertyKey] = target[propertyKey];
	};
}
export function Extensible(oOverrideExecution?: OverrideExecution) {
	return function(target: any, propertyKey: string) {
		const metadata = ensureMetadata(target);
		if (!metadata.methods[propertyKey]) {
			metadata.methods[propertyKey] = {};
		}
		metadata.methods[propertyKey].overrideExecution = oOverrideExecution;
	};
}
export function Public(target: any, propertyKey: string) {
	const metadata = ensureMetadata(target);
	if (!metadata.methods[propertyKey]) {
		metadata.methods[propertyKey] = {};
	}
	metadata.methods[propertyKey].public = true;
}
export function Private(target: any, propertyKey: string) {
	const metadata = ensureMetadata(target);
	if (!metadata.methods[propertyKey]) {
		metadata.methods[propertyKey] = {};
	}
	metadata.methods[propertyKey].public = false;
}
export function Final(target: any, propertyKey: string) {
	const metadata = ensureMetadata(target);
	if (!metadata.methods[propertyKey]) {
		metadata.methods[propertyKey] = {};
	}
	metadata.methods[propertyKey].final = true;
}

export function Event(target: any, eventKey: string) {
	const metadata = ensureMetadata(target);
	if (!metadata.events[eventKey]) {
		metadata.events[eventKey] = {};
	}
}

export function EventHandler(target: any, propertykey: any) {
	target.constructor[propertykey] = function(...args: any[]) {
		const currentTarget = target.constructor.getAPI(args[0] as UI5Event);
		currentTarget[propertykey](...args);
	};
}

export function MacroContext(bMetaModelObject: boolean = false): any {
	return Property({ type: "sap.ui.model.Context", macroContext: true, metaModelObject: bMetaModelObject });
}

export function Property(oPropertyParams: any): any {
	return function(target: any, propertyKey: string, propertyDescriptor: PropertyDescriptor): any {
		const metadata = ensureMetadata(target);
		if (oPropertyParams?.macroContext) {
			if (!metadata.macroContexts[propertyKey]) {
				metadata.macroContexts[propertyKey] = oPropertyParams;
			}
		}
		if (!metadata.properties[propertyKey]) {
			metadata.properties[propertyKey] = oPropertyParams;
		}
		delete propertyDescriptor.writable;
		delete (propertyDescriptor as any).initializer;
		(propertyDescriptor as any).set = function(v: any) {
			return this.setProperty(propertyKey, v);
		};
		(propertyDescriptor as any).get = function() {
			return this.getProperty(propertyKey);
		};

		return propertyDescriptor;
	};
}

export function Aggregation(oAggregationDescriptor?: any): any {
	return function(target: any, propertyKey: string, propertyDescriptor: PropertyDescriptor): any {
		const metadata = ensureMetadata(target);
		if (!metadata.aggregations[propertyKey]) {
			metadata.aggregations[propertyKey] = oAggregationDescriptor;
		}
		if (oAggregationDescriptor.isDefault) {
			metadata.defaultAggregation = propertyKey;
		}
		delete propertyDescriptor.writable;
		delete (propertyDescriptor as any).initializer;
		(propertyDescriptor as any).set = function(v: any) {
			return this.setAggregation(propertyKey, v);
		};
		(propertyDescriptor as any).get = function() {
			return this.getAggregation(propertyKey);
		};

		return propertyDescriptor;
	};
}

export function Association(oAssociationDescription?: any): any {
	return function(target: any, propertyKey: string, propertyDescriptor: PropertyDescriptor): any {
		const metadata = ensureMetadata(target);
		if (!metadata.associations[propertyKey]) {
			metadata.associations[propertyKey] = oAssociationDescription;
		}
		delete propertyDescriptor.writable;
		delete (propertyDescriptor as any).initializer;
		(propertyDescriptor as any).set = function(v: any) {
			return this.setAggregation(propertyKey, v);
		};
		(propertyDescriptor as any).get = function() {
			return this.getAggregation(propertyKey);
		};

		return propertyDescriptor;
	};
}

export function APIClass(sTarget: string) {
	return function(constructor: Function) {
		if (!constructor.prototype.metadata) {
			constructor.prototype.metadata = {};
		}

		if (!constructor.prototype.metadata.interfaces) {
			constructor.prototype.metadata.interfaces = [];
		}
		constructor.prototype.metadata.interfaces.push("sap.ui.core.IFormContent");

		if (!constructor.prototype.renderer) {
			constructor.prototype.renderer = {
				apiVersion: 2,
				render: function(oRm: RenderManager, oControl: any) {
					oRm.renderControl(oControl.getContent());
				}
			};
		}

		describe(constructor, sTarget, constructor.prototype, ElementMetadata);
	};
}
export function UI5Class(sTarget: string, metadataClass?: any, metadataDefinition?: any) {
	return function(constructor: Function) {
		if (!constructor.prototype.metadata) {
			constructor.prototype.metadata = {};
		}
		if (metadataDefinition?.properties) {
			constructor.prototype.metadata.properties = metadataDefinition.properties;
		}
		if (metadataDefinition?.events) {
			constructor.prototype.metadata.events = metadataDefinition.events;
		}
		describe(constructor, sTarget, constructor.prototype, metadataClass);
	};
}

function describe(clazz: any, name: string, inObj: any, metadataClass?: any) {
	const obj: any = {};
	obj.metadata = inObj.metadata || {};
	obj.override = inObj.override;
	obj.constructor = clazz;
	obj.metadata.baseType = Object.getPrototypeOf(clazz.prototype)
		.getMetadata()
		.getName();
	obj.renderer = inObj.renderer || clazz.renderer;
	obj.metadata.interfaces = inObj.metadata?.interfaces || clazz.metadata?.interfaces;
	let metadata: any;
	if (metadataClass) {
		metadata = new metadataClass(name, obj);
	} else {
		metadata = new ElementMetadata(name, obj);
	}
	clazz.getMetadata = clazz.prototype.getMetadata = function() {
		return metadata;
	};
	const fnInit = clazz.prototype.init;
	clazz.prototype.init = function(...args: any[]) {
		fnInit.apply(this, args);
		const aPropertyKeys = Object.keys(obj.metadata.properties);
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const that = this;
		aPropertyKeys.forEach(propertyKey => {
			Object.defineProperty(that, propertyKey, {
				configurable: true,
				set: (v: any) => {
					return that.setProperty(propertyKey, v);
				},
				get: () => {
					return that.getProperty(propertyKey);
				}
			});
		});
	};
	ObjectPath.set(name, clazz);
}
