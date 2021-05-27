import { String as ODataStringType } from "sap/ui/model/odata/type";
import { ValidateException } from "sap/ui/model";

const emailW3CRegexp = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/;
const EmailType = ODataStringType.extend("sap.fe.core.type.Email", {
	validateValue(sValue: string) {
		if (!emailW3CRegexp.test(sValue)) {
			throw new ValidateException(
				sap.ui
					.getCore()
					.getLibraryResourceBundle("sap.fe.core")
					.getText("T_EMAILTYPE_INVALID_VALUE")
			);
		}
		ODataStringType.prototype.validateValue.apply(this, [sValue]);
	}
});
export default EmailType;
