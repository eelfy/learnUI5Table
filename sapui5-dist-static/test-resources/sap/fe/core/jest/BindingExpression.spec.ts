import {
	and,
	bindingExpression,
	compileBinding,
	constant,
	equal,
	Expression,
	expressionEquals,
	fn,
	formatResult,
	addTypeInformation,
	greaterOrEqual,
	greaterThan,
	ifElse,
	lessOrEqual,
	lessThan,
	not,
	notEqual,
	or,
	ref,
	concat,
	isEmpty,
	transformRecursively,
	BindingExpressionExpression,
	resolveBindingString
} from "sap/fe/core/helpers/BindingExpression";
import { EntityType } from "@sap-ux/vocabularies-types";
import { Context } from "sap/ui/model/odata/v4";

describe("Binding Expressions Support", function() {
	it("Constants", () => {
		expect(compileBinding(constant("1"))).toEqual("1");
		expect(compileBinding(constant(1))).toEqual("1");
		expect(compileBinding(constant(true))).toEqual("true");
		expect(compileBinding(true)).toEqual("true");
	});

	it("Comparison", () => {
		// "equal(ifElse(x, a, a), a) --> true"
		expect(compileBinding(equal(ifElse(bindingExpression("isEditable"), constant("A"), constant("A")), constant("A")))).toEqual("true");
		//"equal(ifElse(x, b, b), a) --> false";
		expect(compileBinding(equal(ifElse(bindingExpression("isEditable"), constant("B"), constant("B")), constant("A")))).toEqual(
			"false"
		);
		//"(using constants) equal(ifElse(x, a, b), a) --> x";
		expect(compileBinding(equal(ifElse(bindingExpression("isEditable"), constant("A"), constant("B")), constant("A")))).toEqual(
			"{isEditable}"
		);
		//"(using binding expressions) equal(ifElse(x, a, a), a) --> x";
		expect(
			compileBinding(
				equal(ifElse(bindingExpression("isEditable"), bindingExpression("A"), bindingExpression("B")), bindingExpression("A"))
			)
		).toEqual("{isEditable}");
		//"equal(ifElse(x, a, b), c) --> no reduction";
		expect(
			compileBinding(equal(ifElse(bindingExpression("isEditable"), bindingExpression("A"), bindingExpression("B")), constant("A")))
		).toEqual("{= (%{isEditable} ? %{A} : %{B}) === 'A'}");

		const a = ifElse(bindingExpression("isEditable"), bindingExpression("A"), bindingExpression("B"));
		const b = ifElse(bindingExpression("isEditable"), bindingExpression("A"), bindingExpression("B"));
		//"equal(a, a) --> true"
		expect(compileBinding(equal(a, b))).toEqual("true");
		// "equal(null, null) --> true"
		expect(compileBinding(equal(constant(null), constant(null)))).toEqual("true");

		// "notEqual(a, a) --> false"
		expect(compileBinding(notEqual(a, b))).toEqual("false");
		// "notEqual(null, null) --> false"
		expect(compileBinding(notEqual(constant(null), constant(null)))).toEqual("false");
	});

	it("Data model definition", () => {
		expect(compileBinding(bindingExpression("editMode", "ui"))).toEqual("{ui>editMode}");
		expect(compileBinding(bindingExpression("SalesOrder"))).toEqual("{SalesOrder}");
	});

	it("Constant Equality", () => {
		expect(compileBinding(equal(constant("1"), constant("1")))).toEqual("true");
		expect(compileBinding(equal(constant(1), constant(1)))).toEqual("true");
		expect(compileBinding(equal(constant(1), constant(15)))).toEqual("false");
		expect(compileBinding(equal(constant(true), constant(false)))).toEqual("false");

		expect(compileBinding(notEqual(constant("1"), constant("1")))).toEqual("false");
		expect(compileBinding(notEqual(constant(1), constant(1)))).toEqual("false");
		expect(compileBinding(notEqual(constant(1), constant(15)))).toEqual("true");
		expect(compileBinding(notEqual(constant(true), constant(false)))).toEqual("true");
		expect(compileBinding(equal(undefined, undefined))).toEqual("true");
		expect(compileBinding(equal(undefined, true))).toEqual("false");
		expect(compileBinding(equal(undefined, false))).toEqual("false");
		expect(compileBinding(equal(undefined, 1))).toEqual("false");
		expect(compileBinding(equal(undefined, "foo"))).toEqual("false");
	});

	it("Expression Equality", () => {
		expect(expressionEquals(constant(true) as Expression<any>, constant(4) as Expression<any>)).toEqual(false);
		expect(expressionEquals(constant("1"), constant("1"))).toEqual(true);
		expect(expressionEquals(constant("1"), constant("2"))).toEqual(false);
		expect(expressionEquals(constant("1"), bindingExpression("foo"))).toEqual(false);
		expect(expressionEquals(not(bindingExpression("foo")), not(bindingExpression("foo")))).toEqual(true);
		expect(expressionEquals(bindingExpression("foo"), bindingExpression("foo"))).toEqual(true);
		expect(
			expressionEquals(
				and(bindingExpression("foo"), bindingExpression("bar")),
				and(bindingExpression("foo"), bindingExpression("bar"))
			)
		).toEqual(true);
		expect(
			expressionEquals(
				and(bindingExpression("bar"), bindingExpression("foo")),
				and(bindingExpression("foo"), bindingExpression("bar"))
			)
		).toEqual(true);

		const fakeFormatter = function(isEditable: string) {
			// Do Nothing
			return "Nothing";
		};
		fakeFormatter.__functionName = "MyFormatterName";
		expect(
			expressionEquals(
				formatResult([bindingExpression("editMode", "ui")], fakeFormatter),
				formatResult([bindingExpression("editMode", "ui")], fakeFormatter)
			)
		).toEqual(true);
		expect(
			expressionEquals(
				formatResult([bindingExpression("editMode", "XX")], fakeFormatter),
				formatResult([bindingExpression("editMode", "ui")], fakeFormatter)
			)
		).toEqual(false);
		expect(
			expressionEquals(
				formatResult([constant("%{ui>/editMode}")], fakeFormatter),
				formatResult([bindingExpression("editMode", "ui")], fakeFormatter)
			)
		).toEqual(false);

		expect(
			expressionEquals(
				addTypeInformation([bindingExpression("editMode", "ui")], "sap.ui.model.odata.type.Unit"),
				addTypeInformation([bindingExpression("editMode", "ui")], "sap.ui.model.odata.type.Unit")
			)
		).toEqual(true);
		expect(
			expressionEquals(
				addTypeInformation([bindingExpression("editMode", "XX")], "sap.ui.model.odata.type.Unit"),
				addTypeInformation([bindingExpression("editMode", "ui")], "sap.ui.model.odata.type.Unit")
			)
		).toEqual(false);
		expect(
			expressionEquals(
				addTypeInformation([constant("%{ui>/editMode}")], "sap.ui.model.odata.type.Unit"),
				addTypeInformation([bindingExpression("editMode", "ui")], "sap.ui.model.odata.type.Unit")
			)
		).toEqual(false);
		expect(
			expressionEquals(
				addTypeInformation([bindingExpression("editMode", "ui")], "sap.ui.model.odata.type.Unit"),
				addTypeInformation([bindingExpression("editMode", "ui")], "sap.ui.model.odata.type.Currency")
			)
		).toEqual(false);
	});

	it("And operator", () => {
		expect(compileBinding(and(constant(true), constant(false)))).toEqual("false");
		expect(compileBinding(and(constant(true), constant(true)))).toEqual("true");
		expect(compileBinding(and(constant(true), bindingExpression("SalesOrder")))).toEqual("{SalesOrder}");
		expect(compileBinding(and(constant(false), bindingExpression("SalesOrder")))).toEqual("false");
		expect(compileBinding(and(bindingExpression("isEditable", "ui"), bindingExpression("SalesOrder")))).toEqual(
			"{= (%{ui>isEditable} && %{SalesOrder})}"
		);

		const a = and(bindingExpression("a1"), bindingExpression("a2"));
		const b = and(bindingExpression("b1"), bindingExpression("b2"));
		expect(compileBinding(and(a, b))).toEqual("{= (%{a1} && %{a2} && %{b1} && %{b2})}");

		expect(compileBinding(and(a, a))).toEqual("{= (%{a1} && %{a2})}");
		expect(compileBinding(and(a, and(a, a)))).toEqual("{= (%{a1} && %{a2})}");
		expect(compileBinding(and(bindingExpression("foo"), not(bindingExpression("foo"))))).toEqual("false");
	});

	it("Or operator", () => {
		expect(compileBinding(or(constant(true), constant(false)))).toEqual("true");
		expect(compileBinding(or(constant(false), constant(false)))).toEqual("false");
		expect(compileBinding(or(constant(true), constant(true)))).toEqual("true");
		expect(compileBinding(or(constant(false), bindingExpression("SalesOrder")))).toEqual("{SalesOrder}");
		expect(compileBinding(or(constant(true), bindingExpression("SalesOrder")))).toEqual("true");
		expect(compileBinding(or(bindingExpression("isEditable", "ui"), bindingExpression("SalesOrder")))).toEqual(
			"{= (%{ui>isEditable} || %{SalesOrder})}"
		);

		const a = or(bindingExpression("a1"), bindingExpression("a2"));
		const b = or(bindingExpression("b1"), bindingExpression("b2"));
		expect(compileBinding(or(a, b))).toEqual("{= (%{a1} || %{a2} || %{b1} || %{b2})}");
		expect(compileBinding(or(bindingExpression("foo"), not(bindingExpression("foo"))))).toEqual("true");
	});

	it("Not operator", () => {
		expect(compileBinding(not(constant(true)))).toEqual("false");
		expect(compileBinding(not(bindingExpression("SalesOrder")))).toEqual("{= !%{SalesOrder}}");
		expect(compileBinding(not(and(bindingExpression("isEditable", "ui"), bindingExpression("SalesOrder"))))).toEqual(
			"{= !(%{ui>isEditable} && %{SalesOrder})}"
		);
	});

	it("Not operator can simplify some expressions", () => {
		expect(compileBinding(not(and(equal(1, bindingExpression("SalesOrder")), equal(2, bindingExpression("SalesOrder")))))).toEqual(
			"{= (1 !== %{SalesOrder} || 2 !== %{SalesOrder})}"
		);
		expect(compileBinding(not(or(equal(1, bindingExpression("SalesOrder")), equal(2, bindingExpression("SalesOrder")))))).toEqual(
			"{= (1 !== %{SalesOrder} && 2 !== %{SalesOrder})}"
		);
		expect(compileBinding(not(equal(1, bindingExpression("SalesOrder"))))).toEqual("{= 1 !== %{SalesOrder}}");
		expect(compileBinding(not(notEqual(1, bindingExpression("SalesOrder"))))).toEqual("{= 1 === %{SalesOrder}}");
		expect(compileBinding(not(greaterThan(1, bindingExpression("SalesOrder"))))).toEqual("{= 1 <= %{SalesOrder}}");
		expect(compileBinding(not(greaterOrEqual(1, bindingExpression("SalesOrder"))))).toEqual("{= 1 < %{SalesOrder}}");
		expect(compileBinding(not(lessOrEqual(1, bindingExpression("SalesOrder"))))).toEqual("{= 1 > %{SalesOrder}}");
		expect(compileBinding(not(lessThan(1, bindingExpression("SalesOrder"))))).toEqual("{= 1 >= %{SalesOrder}}");
		expect(compileBinding(lessThan("a", "b"))).toEqual("true");
		expect(compileBinding(not(not(bindingExpression("SalesOrder"))))).toEqual("{SalesOrder}");

		// "Optimize nested if-else (condition)"
		expect(
			compileBinding(ifElse(notEqual(ifElse(equal(bindingExpression("condition"), 5), 0, 3), 1), constant("a"), constant("b")))
		).toEqual("a");
	});

	it("Complex Equality", () => {
		expect(compileBinding(equal(bindingExpression("editMode", "ui"), constant("Editable")))).toEqual(
			"{= %{ui>editMode} === 'Editable'}"
		);
		expect(compileBinding(equal(constant(34), bindingExpression("SalesOrder")))).toEqual("{= 34 === %{SalesOrder}}");
	});

	it("Formatter call", () => {
		const fakeEntityType = {
			keys: [{ name: "ID" }, { name: "Toto" }]
		} as EntityType;
		const fakeFormatter = function(isEditable: string) {
			// Do Nothing
			return "Nothing";
		};
		fakeFormatter.__functionName = "MyFormatterName";
		expect(compileBinding(formatResult([bindingExpression("editMode", "ui")], fakeFormatter))).toEqual(
			"{path:'ui>editMode', targetType : 'any', formatter: 'MyFormatterName'}"
		);
		expect(compileBinding(formatResult(["Yellow"], fakeFormatter))).toEqual("Yellow");
		expect(compileBinding(formatResult(["Yellow"], fakeFormatter, fakeEntityType))).toEqual(
			"{parts:[{value: 'Yellow'},{path:'ID', targetType : 'any'},{path:'Toto', targetType : 'any'}], formatter: 'MyFormatterName'}"
		);
		expect(compileBinding(formatResult([bindingExpression("Hello")], fakeFormatter, fakeEntityType))).toEqual(
			"{path:'Hello', targetType : 'any', formatter: 'MyFormatterName'}"
		);

		const fakeFormatter2 = function(isEditable: string, bool: boolean, number: number) {
			// Do Nothing
			return "Nothing";
		};
		fakeFormatter2.__functionName = "MyFormatterName";
		expect(compileBinding(formatResult(["Yellow", false, 42], fakeFormatter2))).toEqual(
			"{parts:[{value: 'Yellow'},{value: 'false'},{value: 42}], formatter: 'MyFormatterName'}"
		);

		const fakeFormatter3 = function(bool: boolean, number: number) {
			// Do Nothing
			return "Nothing";
		};
		fakeFormatter3.__functionName = "MyFormatterName3";
		expect(compileBinding(formatResult([bindingExpression("somethingBoolean"), 42], fakeFormatter3, fakeEntityType))).toEqual(
			"{parts:[{path:'somethingBoolean', targetType : 'any'},{value: 42}], formatter: 'MyFormatterName3'}"
		);
	});

	it("Complex type call", () => {
		expect(compileBinding(addTypeInformation([bindingExpression("value")], "sap.ui.model.odata.type.Unit"))).toEqual(
			"{path:'value', targetType : 'any', type: 'sap.ui.model.odata.type.Unit'}"
		);
		expect(
			compileBinding(addTypeInformation([bindingExpression("value"), bindingExpression("unit")], "sap.ui.model.odata.type.Unit"))
		).toEqual(
			"{mode:'TwoWay', parts:[{path:'value', targetType : 'any'},{path:'unit', targetType : 'any'},{mode:'OneTime',path:'/##@@requestUnitsOfMeasure',targetType:'any'}],type:'sap.ui.model.odata.type.Unit'}"
		);
		expect(
			compileBinding(
				addTypeInformation([bindingExpression("value"), bindingExpression("currency")], "sap.ui.model.odata.type.Currency")
			)
		).toEqual(
			"{mode:'TwoWay', parts:[{path:'value', targetType : 'any'},{path:'currency', targetType : 'any'},{mode:'OneTime',path:'/##@@requestCurrencyCodes',targetType:'any'}],type:'sap.ui.model.odata.type.Currency'}"
		);
		expect(compileBinding(addTypeInformation([bindingExpression("value"), bindingExpression("currency")], "defaultType"))).toEqual(
			"{mode:'TwoWay', parts:[{path:'value', targetType : 'any'},{path:'currency', targetType : 'any'}], type: 'defaultType'}"
		);
	});

	it("If-Else operator", () => {
		expect(
			compileBinding(
				ifElse(equal(bindingExpression("/editMode", "ui"), constant("Editable")), constant("SingleSelect"), constant("None"))
			)
		).toEqual("{= %{ui>/editMode} === 'Editable' ? 'SingleSelect' : 'None'}");
		// Binding simplification
		expect(
			compileBinding(ifElse(equal(constant("Editable"), constant("Editable")), constant("SingleSelect"), constant("None")))
		).toEqual("SingleSelect");
	});

	it("If-Else operator can simplify some calls", () => {
		expect(
			compileBinding(ifElse(equal(bindingExpression("/editMode", "ui"), constant("Editable")), constant(true), constant(false)))
		).toEqual("{= %{ui>/editMode} === 'Editable'}");
		expect(
			compileBinding(ifElse(equal(bindingExpression("/editMode", "ui"), constant("Editable")), constant(false), constant(true)))
		).toEqual("{= %{ui>/editMode} !== 'Editable'}");

		expect(compileBinding(ifElse(bindingExpression("isEditable"), constant(true), bindingExpression("BoolValue")))).toEqual(
			"{= %{isEditable} ? true : %{BoolValue}}"
		);
		expect(compileBinding(ifElse(bindingExpression("isEditable"), constant(false), bindingExpression("BoolValue")))).toEqual(
			"{= (!%{isEditable} && %{BoolValue})}"
		);
		expect(compileBinding(ifElse(not(bindingExpression("condition")), constant("a"), constant("b")))).toEqual(
			"{= %{condition} ? 'b' : 'a'}"
		);
		expect(compileBinding(ifElse(bindingExpression("isEditable"), bindingExpression("BoolValue"), constant(true)))).toEqual(
			"{= %{isEditable} ? %{BoolValue} : true}"
		);
		expect(compileBinding(ifElse(bindingExpression("isEditable"), bindingExpression("BoolValue"), constant(false)))).toEqual(
			"{= (%{isEditable} && %{BoolValue})}"
		);
		// "Optimize nested if-else (condition)"
		expect(compileBinding(ifElse(ifElse(bindingExpression("condition"), true, false), constant("a"), constant("b")))).toEqual(
			"{= %{condition} ? 'a' : 'b'}"
		);
		//"Optimize nested if-else (condition)"
		expect(compileBinding(ifElse(ifElse(bindingExpression("condition"), false, true), constant("a"), constant("b")))).toEqual(
			"{= %{condition} ? 'b' : 'a'}"
		);
		//"Optimize nested if-else (condition)"
		expect(
			compileBinding(
				ifElse(ifElse(bindingExpression("condition"), false, bindingExpression<boolean>("a")), constant("b"), constant("c"))
			)
		).toEqual("{= (!%{condition} && %{a}) ? 'b' : 'c'}");
		//"Optimize nested if-else (onTrue branch)"
		expect(
			compileBinding(
				ifElse(bindingExpression("condition"), ifElse(bindingExpression("condition"), constant("a"), constant("b")), constant("c"))
			)
		).toEqual("{= %{condition} ? 'a' : 'c'}");
		//"Optimize nested if-else (onFalse branch)"
		expect(
			compileBinding(
				ifElse(bindingExpression("condition"), constant("a"), ifElse(bindingExpression("condition"), constant("b"), constant("c")))
			)
		).toEqual("{= %{condition} ? 'a' : 'c'}");
		//"Optimize nested if-else (onFalse branch)"
		expect(
			compileBinding(
				ifElse(
					not(bindingExpression("condition")),
					constant("a"),
					ifElse(bindingExpression("condition"), constant("b"), constant("c"))
				)
			)
		).toEqual("{= %{condition} ? 'b' : 'a'}");

		// everything nested - condition, onTrue, onFalse
		const condition = ifElse(bindingExpression("condition"), false, bindingExpression<boolean>("a"));
		const onTrue = ifElse(
			bindingExpression("condition"),
			ifElse(bindingExpression("condition"), constant("a"), constant("b")),
			constant("c")
		);
		const onFalse = ifElse(
			bindingExpression("condition"),
			constant("a"),
			ifElse(bindingExpression("condition"), constant("b"), constant("c"))
		);

		//"Optimize nested if-else (condition and both branches)"
		expect(compileBinding(ifElse(condition, onTrue, onFalse))).toEqual("{= %{condition} ? 'a' : 'c'}");
	});

	it("Reference", () => {
		expect(compileBinding(ref("foo"))).toEqual("foo");
		expect(compileBinding(ref(null))).toEqual("null");
		expect(compileBinding(ref("null"))).toEqual("null");
		expect(compileBinding(ref(""))).toEqual("null");
	});

	it("Object", () => {
		// comparisons: Array
		expect(compileBinding(lessThan([], []))).toEqual("false");
		expect(compileBinding(lessOrEqual([], []))).toEqual("true");
		expect(compileBinding(equal([], []))).toEqual("false");
		expect(compileBinding(greaterOrEqual([], []))).toEqual("true");
		expect(compileBinding(greaterThan([], []))).toEqual("false");
		expect(compileBinding(lessThan([0], [0]))).toEqual("false");
		expect(compileBinding(lessOrEqual([0], [0]))).toEqual("true");
		expect(compileBinding(equal([0], [0]))).toEqual("false");
		expect(compileBinding(greaterOrEqual([0], [0]))).toEqual("true");
		expect(compileBinding(greaterThan([0], [0]))).toEqual("false");
		expect(compileBinding(lessThan([0], [0, 1]))).toEqual("true");
		expect(compileBinding(lessOrEqual([0], [0, 1]))).toEqual("true");
		expect(compileBinding(equal([0], [0, 1]))).toEqual("false");
		expect(compileBinding(greaterOrEqual([0], [0, 1]))).toEqual("false");
		expect(compileBinding(greaterThan([0], [0, 1]))).toEqual("false");
		expect(compileBinding(lessThan([0, 1], [0]))).toEqual("false");
		expect(compileBinding(lessOrEqual([0, 1], [0]))).toEqual("false");
		expect(compileBinding(equal([0, 1], [0]))).toEqual("false");
		expect(compileBinding(greaterOrEqual([0, 1], [0]))).toEqual("true");
		expect(compileBinding(greaterThan([0, 1], [0]))).toEqual("true");

		expect(compileBinding(lessThan({}, {}))).toEqual("false");
		expect(compileBinding(lessOrEqual({}, {}))).toEqual("true");
		expect(compileBinding(equal({}, {}))).toEqual("false");
		expect(compileBinding(greaterOrEqual({}, {}))).toEqual("true");
		expect(compileBinding(greaterThan({}, {}))).toEqual("false");

		// implicit constant()
		expect(compileBinding({})).toEqual("{}");
		expect(compileBinding({ foo: "bar" })).toEqual("{foo: 'bar'}");
		expect(compileBinding({ foo: 1 })).toEqual("{foo: 1}");
		expect(compileBinding({ foo: true })).toEqual("{foo: true}");
		expect(compileBinding({ foo: null })).toEqual("{foo: null}");
		expect(compileBinding({ foo: undefined })).toEqual("{}");
		expect(compileBinding({ foo: { bar: "baz" } })).toEqual("{foo: {bar: 'baz'}}");
		expect(compileBinding({ 1: "bar" })).toEqual("{1: 'bar'}");
		expect(compileBinding([])).toEqual("[]");
		expect(compileBinding([undefined, null])).toEqual("[undefined, null]");
		expect(compileBinding([1, 2, 3])).toEqual("[1, 2, 3]");
		expect(compileBinding({ foo: [1, 2, 3] })).toEqual("{foo: [1, 2, 3]}");
		expect(compileBinding({}, true)).toEqual("{}");
		expect(compileBinding({ foo: "bar" }, true)).toEqual("{foo: 'bar'}");
		expect(compileBinding({ foo: 1 }, true)).toEqual("{foo: 1}");
		expect(compileBinding({ foo: true }, true)).toEqual("{foo: true}");
		expect(compileBinding({ foo: null }, true)).toEqual("{foo: null}");
		expect(compileBinding({ foo: undefined }, true)).toEqual("{}");
		expect(compileBinding({ foo: { bar: "baz" } }, true)).toEqual("{foo: {bar: 'baz'}}");
		expect(compileBinding({ 1: "bar" }, true)).toEqual("{1: 'bar'}");
		expect(compileBinding([], true)).toEqual("[]");
		expect(compileBinding([undefined, null], true)).toEqual("[undefined, null]");
		expect(compileBinding([1, 2, 3], true)).toEqual("[1, 2, 3]");
		expect(compileBinding({ foo: [1, 2, 3] }, true)).toEqual("{foo: [1, 2, 3]}");

		// explicit constant()
		expect(compileBinding({ foo: constant("bar") })).toEqual("{foo: 'bar'}");
		expect(compileBinding({ foo: constant(1) })).toEqual("{foo: 1}");
		expect(compileBinding({ foo: constant(true) })).toEqual("{foo: true}");
		expect(compileBinding({ foo: constant(null) })).toEqual("{foo: null}");
		expect(compileBinding({ foo: constant(undefined) })).toEqual("{}");
		expect(compileBinding({ 1: constant("bar") })).toEqual("{1: 'bar'}");

		// other types
		expect(compileBinding({ foo: bindingExpression("bar") })).toEqual("{foo: %{bar}}");
		expect(compileBinding({ foo: constant("bar") })).toEqual("{foo: 'bar'}");
		expect(compileBinding({ foo: { bar: constant("baz") } })).toEqual("{foo: {bar: 'baz'}}");

		const obj = {
			contexts: fn("getBindingContext", [], bindingExpression("/#fe::ObjectPage/", "$view")),
			invocationGrouping: constant("ChangeSet"),
			label: constant("Test"),
			model: fn("getModel", [], bindingExpression("/", "$source")),
			isNavigable: true
		};

		expect(compileBinding(obj)).toEqual(
			"{contexts: %{$view>/#fe::ObjectPage/}.getBindingContext(), invocationGrouping: 'ChangeSet', label: 'Test', model: %{$source>/}.getModel(), isNavigable: true}"
		);

		expect(compileBinding(equal({ foo: "bar" }, null))).toEqual("false");
		expect(compileBinding(equal({ foo: "bar" }, { foo: "bar" }))).toEqual("false");
	});

	it("Function", () => {
		expect(compileBinding(fn("foo", []))).toEqual("foo()");
		expect(compileBinding(fn("foo", [1]))).toEqual("foo(1)");
		expect(compileBinding(fn("foo", ["bar"]))).toEqual("foo('bar')");
		expect(compileBinding(fn("foo", [constant("bar")]))).toEqual("foo('bar')");
		expect(compileBinding(fn("foo", [ref("bar")]))).toEqual("foo(bar)");
		expect(compileBinding(fn("foo", [{ bar: "baz" }]))).toEqual("foo({bar: 'baz'})");
		expect(compileBinding(fn("foo", [null]))).toEqual("foo(null)");
		expect(compileBinding(fn("foo", [undefined]))).toEqual("foo(undefined)");
		expect(compileBinding(fn("foo", [1, 2, 3, 4]))).toEqual("foo(1, 2, 3, 4)");
		expect(compileBinding(fn("foo", [1, 2, undefined, 4, undefined]))).toEqual("foo(1, 2, undefined, 4, undefined)");

		expect(compileBinding(fn("foo", [ref("$controller"), equal(bindingExpression("bar"), bindingExpression("baz"))]))).toEqual(
			"foo($controller, %{bar} === %{baz})"
		);

		const obj = fn("MyFunction", [
			{
				contexts: fn("getBindingContext", [], bindingExpression("/#fe::ObjectPage/", "$view")),
				invocationGrouping: "ChangeSet",
				label: "Test",
				model: fn("getModel", [], bindingExpression("/", "$source")),
				isNavigable: true
			},
			1
		]);

		expect(compileBinding(obj)).toEqual(
			"MyFunction({contexts: %{$view>/#fe::ObjectPage/}.getBindingContext(), invocationGrouping: 'ChangeSet', label: 'Test', model: %{$source>/}.getModel(), isNavigable: true}, 1)"
		);

		// flat parameter list
		function myHandler(a: number, b: string, c: boolean): string {
			return "Hi!";
		}

		myHandler.__functionName = "callMyHandler";

		//"Typed function, flat signature"
		expect(compileBinding(fn(myHandler, [1, bindingExpression("name"), bindingExpression("isValid")]))).toEqual(
			"callMyHandler(1, %{name}, %{isValid})"
		);

		// Object as parameter
		function myHandlerObj(c: { context: Context }): string {
			return "Hi!";
		}

		myHandlerObj.__functionName = "callMyHandler";

		// "Typed function, object-typed signature"
		expect(
			compileBinding(fn(myHandlerObj, [{ context: fn("getBindingContext", [], bindingExpression("/#fe::ObjectPage/", "$view")) }]))
		).toEqual("callMyHandler({context: %{$view>/#fe::ObjectPage/}.getBindingContext()})");
	});

	it("Apply Function", () => {
		expect(compileBinding(fn("bar", [], ref("foo")))).toEqual("foo.bar()");
		expect(compileBinding(fn("bar", [], bindingExpression("/#fe::ObjectPage/", "$view")))).toEqual("%{$view>/#fe::ObjectPage/}.bar()");
	});

	it("Function as part of expression", () => {
		const expression = equal(fn("foo", [ref("$controller"), constant(5)]), constant(6));
		expect(compileBinding(expression)).toEqual("{= foo($controller, 5) === 6}");
	});

	it("Concat Operator", () => {
		expect(compileBinding(concat("a", "b"))).toEqual("ab");
		expect(compileBinding(concat("a", bindingExpression("BindingPath")))).toEqual("{= 'a' + %{BindingPath} }");
	});

	it("Is Empty Shortcut", () => {
		expect(compileBinding(isEmpty(bindingExpression("BindingPath")))).toEqual(
			"{= (%{BindingPath} === '' || %{BindingPath} === undefined || %{BindingPath} === null)}"
		);
		expect(compileBinding(isEmpty(concat("a", bindingExpression("BindingPath"))))).toEqual(
			"{= (%{BindingPath} === '' || %{BindingPath} === undefined || %{BindingPath} === null)}"
		);
		expect(compileBinding(isEmpty(concat(bindingExpression("BindingPath1"), bindingExpression("BindingPath2"))))).toEqual(
			"{= (%{BindingPath1} === '' || %{BindingPath1} === undefined || %{BindingPath1} === null || %{BindingPath2} === '' || %{BindingPath2} === undefined || %{BindingPath2} === null)}"
		);
	});

	it("Support recursive transformation", () => {
		const transformBinding = (binding: BindingExpressionExpression<any>) => {
			binding.modelName = "newModel";
			return binding;
		};
		expect(compileBinding(transformRecursively(isEmpty(bindingExpression("BindingPath")), "Binding", transformBinding))).toEqual(
			"{= (%{BindingPath} === '' || %{BindingPath} === undefined || %{BindingPath} === null)}"
		);

		expect(compileBinding(concat(bindingExpression("BindingPath"), bindingExpression("Bubu")))).toEqual(
			"{= %{BindingPath} + %{Bubu} }"
		);
		expect(
			compileBinding(
				transformRecursively(concat(bindingExpression("BindingPath"), bindingExpression("Bubu")), "Binding", transformBinding)
			)
		).toEqual("{= %{newModel>BindingPath} + %{newModel>Bubu} }");

		expect(
			compileBinding(
				transformRecursively(
					fn("foo", [ref("$controller"), equal(bindingExpression("bar"), bindingExpression("baz"))]),
					"Binding",
					transformBinding
				)
			)
		).toEqual("foo($controller, %{bar} === %{baz})");

		expect(compileBinding(transformRecursively(not(bindingExpression("SalesOrder")), "Binding", transformBinding))).toEqual(
			"{= !%{SalesOrder}}"
		);

		const fakeFormatter = function(isEditable: string) {
			// Do Nothing
			return "Nothing";
		};
		fakeFormatter.__functionName = "MyFormatterName";
		expect(
			compileBinding(
				transformRecursively(formatResult([bindingExpression("editMode", "ui")], fakeFormatter), "Binding", transformBinding)
			)
		).toEqual("{path:'newModel>editMode', targetType : 'any', formatter: 'MyFormatterName'}");

		expect(
			compileBinding(
				transformRecursively(
					addTypeInformation([bindingExpression("value", "ui"), bindingExpression("unit", "ui")], "sap.ui.model.odata.type.Unit"),
					"Binding",
					transformBinding
				)
			)
		).toEqual(
			"{mode:'TwoWay', parts:[{path:'newModel>value', targetType : 'any'},{path:'newModel>unit', targetType : 'any'},{mode:'OneTime',path:'/##@@requestUnitsOfMeasure',targetType:'any'}],type:'sap.ui.model.odata.type.Unit'}"
		);

		expect(
			compileBinding(
				transformRecursively(
					equal(ifElse(bindingExpression("isEditable"), bindingExpression("A"), bindingExpression("B")), constant("A")),
					"Binding",
					transformBinding
				)
			)
		).toEqual("{= (%{isEditable} ? %{A} : %{B}) === 'A'}");
	});

	it("Supports BindingString Operator", () => {
		// Boolean case
		expect(compileBinding(resolveBindingString("true", "boolean"))).toEqual("true");
		expect(compileBinding(resolveBindingString("false", "boolean"))).toEqual("false");
		expect(compileBinding(resolveBindingString(true, "boolean"))).toEqual("true");
		expect(compileBinding(resolveBindingString(false, "boolean"))).toEqual("false");
		expect(compileBinding(resolveBindingString("Yolo"))).toEqual("Yolo");
		expect(compileBinding(resolveBindingString("{something>else}", "boolean"))).toEqual("{something>else}");
	});
});
