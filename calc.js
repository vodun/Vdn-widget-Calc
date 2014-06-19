/*
ExtJS Calculator Widget

Copyright (c) 2013 Sergey Makoveev

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
    x: 0,
    y: 0,
    configColorsEffect: {
        useopacity: true,
        noActiveColor: "#F0F8FF",
        activeColor: "#E0E7EE"
    },
    calcs: {
        memory: 0,
        result: null,
        input: null,
        operation: "",
        entered: false
    },
    initComponent: function () {
        p = this;
        p.eventClickBtn = function (btn, e, calc) {  
            if (calc.getComponent('calcDisplay').value == "Error" && btn.text != "C") return;
            var curValue = parseFloat(calc.getComponent('calcDisplay').value ), mset=false;
            switch (btn.text) {
                case 'C':
                    calc.getComponent('calcDisplay').setValue(0);
                    calc.calcs.result = null;
                    calc.calcs.input = null;
                    break;
                case 'MC':
                    calc.calcs.memory = 0;
					mset=true;
                    break;
                case 'MR':
                    calc.getComponent('calcDisplay').setValue(calc.calcs.memory);
                    calc.calcs.input = parseFloat(calc.getComponent('calcDisplay').value);
                    calc.calcs.entered = true;
                    break;
                case 'MS':
                    calc.calcs.memory = curValue;
                    calc.calcs.entered = true;
					mset=true;
                    break;
                case 'M+':
                    calc.calcs.memory += curValue;
                    calc.calcs.entered = true;
					mset=true;
                    break;
                case 'M-':
                    calc.calcs.memory -= curValue;
                    calc.calcs.entered = true;
					mset=true;
                    break;
                case '1/x':
                    if (curValue != 0) {
                        calc.calcs.input = 1 / curValue;
                        calc.getComponent('calcDisplay').setValue(calc.calcs.input);
                        calc.calcs.entered = true;
                    } else calc.getComponent('calcDisplay').setValue("Error");
                    break;
                case '&#8592;':
                    break;
                case 'CE':
                    break;
                case '&#8723;':
					calc.getComponent('calcDisplay').setValue(-1*curValue);  
					calc.calcs.input = calc.getComponent('calcDisplay').value;		
				 				
                    break;
                case '&#8730;':
                    break;
                case '%':
                    break;
                case ',':
 			    
						if (calc.calcs.input == null){ 
						calc.getComponent('calcDisplay').setValue("0" + btn.text.replace(',','.'));
						calc.calcs.input = calc.getComponent('calcDisplay').value;
					}else  if (calc.getComponent('calcDisplay').value.toString().indexOf(".") == -1)
						calc.getComponent('calcDisplay').setValue(curValue + "" + btn.text.replace(',','.'));
					 
                    break;
                default:
				//console.log(calc.calcs.result + " = "+ calc.calcs.input);
					if 		 (btn.text.match(/\d/))			{
                        if (calc.getComponent('calcDisplay').value == '0' || calc.calcs.input == null || calc.calcs.entered) {
                            calc.getComponent('calcDisplay').setValue(btn.text);
                            calc.calcs.operation == "";
                            calc.calcs.entered = false;
                        } else calc.getComponent('calcDisplay').setValue(calc.getComponent('calcDisplay').value + "" + btn.text);
                        calc.calcs.input = calc.getComponent('calcDisplay').value;
                    }else  {
                        if (calc.calcs.result == null) {
                            calc.calcs.result = calc.calcs.input;
                        } else if (calc.calcs.input != null && calc.calcs.operation != "") {
							var fixedPar=16;
							if (calc.calcs.operation=="+"||calc.calcs.operation=="-")
								fixedPar=Math.max(calc.calcs.input.toString().substr(calc.calcs.input.toString().indexOf(".") + 1).length, calc.calcs.result.toString().substr(calc.calcs.result.toString().indexOf(".") + 1).length);
							if (fixedPar>16) fixedPar=16;
							//console.log(fixedPar);                            
							calc.calcs.result =  +(eval(calc.calcs.result + calc.calcs.operation + calc.calcs.input)).toFixed(fixedPar);
							
                            if (calc.calcs.result == Infinity || calc.calcs.result.toString() == 'NaN') {
                                calc.getComponent('calcDisplay').setValue("Error");
                                calc.calcs.result = 0;
                            } else  calc.getComponent('calcDisplay').setValue(calc.calcs.result);                             
                        } else if (calc.calcs.input != null) calc.calcs.result = calc.calcs.input;
                        if (btn.text == "=") {
                            calc.calcs.operation = "";
                        } else calc.calcs.operation = btn.text;
                        calc.calcs.input = null;                       
                    } 

//console.log(calc.calcs.input);
            }
			if (mset) 
			    if (calc.calcs.memory==0){               
						calc.getComponent('MR').disable();
                    calc.getComponent('MC').disable();}
					else
					{                    calc.getComponent('MR').enable();
                    calc.getComponent('MC').enable();}
			 console.log( calc.calcs.result);
        }
        var arr_buttons = [ {text: "MC", disabled:true }, {text: "MR", disabled:true}, {text: "MS"}, {text: "M+"}, {text: "M-"},
							{text: "&#8592;"}, {text: "CE"}, {text: "C"}, {text: "&#8723;"}, {text: "&#8730;"},
							{text: "7"}, {text: "8"}, {text: "9"}, {text: "/"}, {text: "%"},
							{text: "4"}, {text: "5"}, {text: "6"}, {text: "*"}, {text: "1/x"}, 
							{text: "1"}, {text: "2"}, {text: "3"}, {text: "-"}, {text: "=", rowspan: 2},
							{text: "0", colspan: 2}, {text: ","}, {text: "+"}];
        p.items = [];
        p.items.push(Ext.create('Ext.form.field.Text', {
			itemId:'calcDisplay',
            xtype: "textfield",
            value: "0",
            readOnly: true,
            fieldCls: "calc-txtfieldCls",
            cls: 'calc-txtfield',
            colspan: 5
        }));
		var before_items=p.items.length;
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
			arr_buttons[i].itemId=arr_buttons[i].text;
            var btn = Ext.create('Ext.button.Button', arr_buttons[i]);
            p.items.push(btn);
            p.items[i+before_items].on('click', p.eventClickBtn,this, p);
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
        },
        p.layout = {
            type: 'table',
            columns: 5
        },
        p.onClickToPanel = function () {
            if (!this.activated) {
                this.activated = true;
                this.dragging = false;
                if ((!Ext.isIE || Ext.isIE9p) && this.configColorsEffect.useopacity) this.setBodyStyle('opacity', 1);
                else this.setBodyStyle('background', this.configColorsEffect.activeColor);
            }
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
        p.onClose = function () {
            Ext.get(Ext.getBody()).un("mouseup", this.onClickOutsidePanel, this);
            p.clearListeners();
        }
        if (!Ext.isIE9p && this.configColorsEffect.useopacity) this.setBodyStyle('background', this.configColorsEffect.activeColor);
        p.callParent(arguments);
    },
    afterRender: function () {
        panel = this;
        panel.callParent(arguments);
        panel.el.on('click', panel.onClickToPanel, panel);
        panel.on('close', panel.onClose, panel);
        Ext.get(Ext.getBody()).on("mouseup", panel.onClickOutsidePanel, panel);
        panel.getComponent('=').height = panel.getComponent('=').getHeight(); // Cause css vertical-align not supported by ext.button
    }
});