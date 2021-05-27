sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel',
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/ButtonType",
    "sap/m/StandardListItem",
    // "sap/m/Text",
    "sap/m/List"


], function (Controller, JSONModel, MessageToast, Dialog, Button, ButtonType, StandardListItem, List) {
    "use strict";

    return Controller.extend("intheme.zui5_example.controller.Main", {
        metadata: {
            manifest: "json"
        },
        onInit: function () {
            // console.clear()
        },
        // sempai: function () {
        //     MessageToast.show('>.<', {
        //         duration: 1000,
        //         width: "auto",
        //         my: "center centre",
        //         at: "center centre",
        //         animationDuration: 500
        //     })
        //     MessageToast.show('>.<', {
        //         duration: 1000,
        //         width: "auto",
        //         my: "bottom bottom",
        //         at: "bottom bottom",
        //         animationDuration: 500
        //     })
        //     MessageToast.show('>.<', {
        //         duration: 1000,
        //         width: "auto",
        //         my: "top top",
        //         at: "top top",
        //         animationDuration: 500
        //     })
        // },
        onDefaultDialogPress: function (data) {
            // debugger
            let id = 'oDialog'
            if (!this.oDefaultDialog) {
                // debugger
                this.oDefaultDialog = new Dialog({
                    id: id,
                    title: "my damn fckng list",
                    content: new List({
                        items: {
                            path: "/data",
                            template: new StandardListItem({
                                title: "{meh}",
                                info: "{info}",
                                counter: "{id}"
                            })
                        }
                    }),
                    beginButton: new Button({
                        type: ButtonType.Emphasized,
                        text: "please press me as hard as u can",
                        press: function () {
                            this.oDefaultDialog.close();
                            // this.sempai()
                        }.bind(this)
                    })
                });
                var oModel = new sap.ui.model.json.JSONModel(data);
                sap.ui.getCore().byId(id).setModel(oModel);
                // debugger
                // this.getView().byId(id).setModel(oModel)
                // this.getView().setModel(oModel);
                // var oModel = new sap.ui.model.json.JSONModel(data)
                // sap.ui.getCore().byId("oDialog").setModel(oModel)

                this.getView().addDependent(this.oDefaultDialog);
            }

            var oModel = new sap.ui.model.json.JSONModel(data);
            sap.ui.getCore().byId(id).setModel(oModel);

            // this.getView().byId(id).setModel(oModel)
            // EventProvider sap.ui.model.json.JSONModel
            // console.log(this.onSelectionChange());
            this.oDefaultDialog.open();
            // this.getView().removeAllDependents(this.oDefaultDialog)

            // debugger
        },

        getLocalData: function (oEvent, elem) {

            return oEvent.getSource().getParent().getBindingContext()
                .getObject(elem)
        },



        showDialog: function (oEvent) {

            // console.log(num);
            this.localData = {
                data: [{
                        id: 1,
                        'meh': this.getLocalData(oEvent, "Volume"),
                        info: "Volume"
                    },
                    {
                        id: 2,
                        'meh': this.getLocalData(oEvent, "Unit"),
                        info: "Unit"
                    },
                    {
                        id: 3,
                        'meh': this.getLocalData(oEvent, "Material"),
                        info: "Material"
                    },
                    {
                        id: 4,
                        'meh': this.getLocalData(oEvent, "Width"),
                        info: "Width"
                    }
                ]
            }
            console.log(this.localData);
            this.onDefaultDialogPress(this.localData)
            // return this.localData
        },

        btnWidth: function () {
            let arr = [];
            let i = 0;
            let yo = 0
            let chel = this.getView().byId('idProductsTable').getAggregation('items')
            while (i < chel.length) {
                arr.push(+this.getView().byId('idProductsTable').getAggregation('items')[i]
                    .getBindingContext().getObject().Width)
                // arr.push(i)
                yo += i
                // console.log(chel[i].getBindingContext().getObject().Width);
                // yo += this.getView().byId('idProductsTable').getAggregation('items')[i].getBindingContext().getObject().Width
                i++
            }
            let res = arr.reduce((sum, el) => sum + el)
            console.log(yo);
            // debugger
            // let aWidth = this.getView().byId('idProductsTable').getAggregation('items')[3].getBindingContext().getObject().Width
            // MessageToast.show(res);


        }
        // // POPOVER
        // handlePopoverPress: function (oEvent) {
        //     // debugger
        //     var oModel = new JSONModel(sap.ui.require.toUrl("stupidData.json"));
        //     // this.getView().setModel(oModel);

        //     var oButton = oEvent.getSource(),
        //         oView = this.getView();

        //     // create popover
        //     if (!this._pPopover) {
        //         this._pPopover = Fragment.load({
        //             id: oView.getId(),
        //             name: "intheme.zui5_example.view.Popover",
        //             controller: this
        //         }).then(function (oPopover) {
        //             // debugger
        //             oView.addDependent(oPopover);
        //             oPopover.bindElement("/data/0");
        //             return oPopover;
        //         });
        //     }
        //     this._pPopover.then(function (oPopover) {
        //         oPopover.openBy(oButton);
        //     });
        // },

        // DIALOG



    });
});