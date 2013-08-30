/*
ExtJS Calculator Widget

Copyright (c) 2013 Vodun

Contact:  https://github.com/vodun

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as
published by the Free Software Foundation and appearing in the file LICENSE included in the
packaging of this file.

Please review the following information to ensure the GNU General Public License version 3.0
requirements will be met: http://www.gnu.org/copyleft/gpl.html.


*/


Ext.define("Vdn.widget.Calc", {
    extend: "Ext.panel.Panel",
    requires: ["Ext.Button"],
    alias: "widget.vdncalc",
    cls: "default-calc",
    closable: true,
    activated: true,
    dragging: false,
    frame: true,
    title: 'Calc',
    configColorsEffect: {
        useopacity: true,
        noActiveColor:  "#F0F8FF",
        activeColor:  "#E0E7EE"
    },
    calcs: {
        memory: 0,
        result: 0
    },

    initComponent: function () {
        p = this;

        p.eventClickBtn = function (btn) {
            if (this.getComponent('vdisplayCalc').value == '0') newVal = btn.text;
            else newVal = this.getComponent('vdisplayCalc').value + btn.text;
            this.getComponent('vdisplayCalc').setValue(newVal);
        }

        var arr_buttons = [{
            text: "MC"
        }, {

            text: "MR"
        }, {

            text: "MS"
        }, {

            text: "M+"
        }, {

            text: "M-"
        }, {

            text: "&#8592;"
        }, {

            text: "CE"
        }, {

            text: "C"
        }, {

            text: "&#8723;"
        }, {

            text: "&#8730;"
        }, {

            text: "7"
        }, {

            text: "8"
        }, {

            text: "9"
        }, {

            text: "/"
        }, {

            text: "%"
        }, {

            text: "4"
        }, {

            text: "5"
        }, {

            text: "6"
        }, {

            text: "x"
        }, {

            text: "1/x"
        }, {

            text: "1"
        }, {

            text: "2"
        }, {

            text: "3"
        }, {

            text: "-"
        }, {

            itemId: "eqCalc",
            text: "=",
            rowspan: 2
        }, {
			itemId: "zeroCalc",
            text: "0",
            colspan: 2
        }, {

            text: ","
        }, {

            text: "+"
        }];
        p.items = [];
        p.items.push(Ext.create('Ext.form.field.Text', {
            xtype: "textfield",
            itemId: "vdisplayCalc",
            value: "0",
            readOnly: true,
            fieldCls: "calc-txtfieldCls",
            cls: "calc-txtfield",
            colspan: 5
        }));
        for (var i = 0; i < arr_buttons.length; i++) {
            switch (arr_buttons[i].text) {
                case "=":
                    arr_buttons[i].cls = "calc-buttons-eq";
                    break;
                case "0":
                    arr_buttons[i].cls = "calc-buttons-zero";
                    break;
                default:
                    arr_buttons[i].cls = "calc-buttons";
            }
			var btn=Ext.create('Ext.button.Button', arr_buttons[i]);
			//btn.width = 33;
            p.items.push(btn);
            p.items[i].on('click', p.eventClickBtn, p, p.items[i]);

        }
        p.draggable = {
            moveOnly: true,
            onMouseDown: function () {
                this.panel.dragging = true;
            },
            onMouseUp: function () {
                if (!Ext.isIE) this.panel.dragging = false;
                this.panel.onClickToPanel();

            }
        }, p.layout = {
            type: 'table',
            columns: 5
        },
        p.onClickToPanel = function () {
            this.activated = true;

            if ((!Ext.isIE || Ext.isIE9p) && this.configColorsEffect.useopacity) this.setBodyStyle('opacity', 1);
            else this.setBodyStyle('background', this.configColorsEffect.activeColor);

        };
        p.onClickOutsidePanel = function (e) {
            var idPanel = this.getId();
            if (!Ext.get(e.getTarget()).findParent("div#" + idPanel)) {
                if (!this.dragging) {
                    this.activated = false;
                    if ((!Ext.isIE || Ext.isIE9p) && this.configColorsEffect.useopacity) this.setBodyStyle('opacity', 0.5);
                    else this.setBodyStyle('background', this.configColorsEffect.noActiveColor);
                } else {
                    this.dragging = false;
                }
            }

        };
        if (!Ext.isIE9p && this.configColorsEffect.useopacity)
			this.setBodyStyle('background', this.configColorsEffect.activeColor);
        p.callParent(arguments);
    },
    afterRender: function () {
        panel = this;
        panel.callParent(arguments);
        panel.el.on('click', this.onClickToPanel, this);
        Ext.get(Ext.getBody()).on("mouseup", panel.onClickOutsidePanel, this);
        panel.getComponent('eqCalc').height = panel.getComponent('eqCalc').getHeight(); // Cause css vertical-align not supported by button
		 
    }

});