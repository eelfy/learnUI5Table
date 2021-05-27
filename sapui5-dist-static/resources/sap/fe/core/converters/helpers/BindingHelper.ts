import { and, bindingExpression, equal, Expression, not } from "sap/fe/core/helpers/BindingExpression";

export const UI = {
	IsCreateMode: bindingExpression("createMode", "ui") as Expression<boolean>,
	IsCreateModeSticky: bindingExpression("createModeSticky", "ui") as Expression<boolean>,
	IsEditable: bindingExpression("/isEditable", "ui") as Expression<boolean>,
	IsTransientBinding: equal(bindingExpression("@$ui5.context.isTransient"), true)
};

export const Draft = {
	IsNewObject: and(not(bindingExpression("HasActiveEntity")), not(bindingExpression("IsActiveEntity")))
};
