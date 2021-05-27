import { Button } from "sap/m";
import MacroAPI from "sap/fe/macros/MacroAPI";

describe("MacroComponent", function() {
	it("Can Render a Renderless Control", async function() {
		const button = new Button("Yolo56");
		const macro = new MacroAPI({ content: button });
		const div = document.createElement("div");
		div.setAttribute("id", "content");
		document.body.appendChild(div);
		macro.placeAt("content");
		sap.ui.getCore().applyChanges();
		const domRef = (button.getDomRef() as unknown) as Element;
		expect(domRef.outerHTML).toMatchSnapshot();
		button.setText("My Button");
		button.rerender();
		// macro.rerender();
		const domRef2 = (button.getDomRef() as unknown) as Element;
		expect(domRef2.outerHTML).toMatchSnapshot();
		button.setText("My Other Button");
		macro.rerender();
		const domRef3 = (macro.getDomRef() as unknown) as Element;
		expect(domRef3.outerHTML).toMatchSnapshot();
		macro.focus({});
	});
});
