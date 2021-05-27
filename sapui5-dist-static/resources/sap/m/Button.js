/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library", "sap/ui/core/Control", "sap/ui/core/ShortcutHintsMixin", "sap/ui/core/EnabledPropagator", "sap/ui/core/IconPool", "sap/ui/Device", "sap/ui/core/ContextMenuSupport", "sap/ui/core/library", "./ButtonRenderer", "sap/ui/events/KeyCodes", "sap/ui/core/LabelEnablement", "sap/m/BadgeEnabler", "sap/ui/core/InvisibleText"], function (l, C, S, E, I, D, a, c, B, K, L, b, d) {
    "use strict";
    var T = c.TextDirection;
    var e = l.ButtonType;
    var f = l.ButtonAccessibilityType;
    var g = l.BadgeState;
    var A = c.aria.HasPopup;
    var h = 1,
        i = 9999;
    var j = C.extend("sap.m.Button", {
        metadata: {
            interfaces: ["sap.ui.core.IFormContent"],
            library: "sap.m",
            properties: {
                text: {
                    type: "string",
                    group: "Misc",
                    defaultValue: ""
                },
                type: {
                    type: "sap.m.ButtonType",
                    group: "Appearance",
                    defaultValue: e.Default
                },
                width: {
                    type: "sap.ui.core.CSSSize",
                    group: "Misc",
                    defaultValue: null
                },
                enabled: {
                    type: "boolean",
                    group: "Behavior",
                    defaultValue: true
                },
                icon: {
                    type: "sap.ui.core.URI",
                    group: "Appearance",
                    defaultValue: ""
                },
                iconFirst: {
                    type: "boolean",
                    group: "Appearance",
                    defaultValue: true
                },
                activeIcon: {
                    type: "sap.ui.core.URI",
                    group: "Misc",
                    defaultValue: null
                },
                iconDensityAware: {
                    type: "boolean",
                    group: "Misc",
                    defaultValue: true
                },
                textDirection: {
                    type: "sap.ui.core.TextDirection",
                    group: "Appearance",
                    defaultValue: T.Inherit
                },
                ariaHasPopup: {
                    type: "sap.ui.core.aria.HasPopup",
                    group: "Accessibility",
                    defaultValue: A.None
                }
            },
            associations: {
                ariaDescribedBy: {
                    type: "sap.ui.core.Control",
                    multiple: true,
                    singularName: "ariaDescribedBy"
                },
                ariaLabelledBy: {
                    type: "sap.ui.core.Control",
                    multiple: true,
                    singularName: "ariaLabelledBy"
                }
            },
            events: {
                tap: {
                    deprecated: true
                },
                press: {}
            },
            designtime: "sap/m/designtime/Button.designtime",
            dnd: {
                draggable: true,
                droppable: false
            }
        }
    });
    E.call(j.prototype);
    a.apply(j.prototype);
    b.call(j.prototype);
    j.prototype.init = function () {
        this._onmouseenter = this._onmouseenter.bind(this);
        this._buttonPressed = false;
        S.addConfig(this, {
            event: "press",
            position: "0 0",
            addAccessibilityLabel: true
        }, this);
        this.initBadgeEnablement({
            position: "topRight",
            selector: {
                suffix: "inner"
            }
        });
        this._oBadgeData = {
            value: "",
            state: ""
        };
        this._badgeMinValue = h;
        this._badgeMaxValue = i;
    };
    j.prototype.badgeValueFormatter = function (v) {
        var V = parseInt(v),
            o = this.getBadgeCustomData(),
            k = o.getVisible();
        if (isNaN(V)) {
            return false;
        }
        if (V < this._badgeMinValue) {
            k && o.setVisible(false);
        } else {
            !k && o.setVisible(true);
            if (V > this._badgeMaxValue && v.indexOf("+") === -1) {
                v = this._badgeMaxValue < 1000 ? this._badgeMaxValue + "+" : "999+";
            }
        }
        return v;
    };
    j.prototype.setBadgeMinValue = function (m) {
        var v = this.getBadgeCustomData().getValue();
        if (m && !isNaN(m) && m >= h && m != this._badgeMinValue) {
            this._badgeMinValue = m;
            this.badgeValueFormatter(v);
            this.invalidate();
        }
        return this;
    };
    j.prototype.setBadgeMaxValue = function (m) {
        if (m && !isNaN(m) && m <= i && m != this._badgeMaxValue) {
            this._badgeMaxValue = m;
            this.invalidate();
        }
        return this;
    };
    j.prototype.onBadgeUpdate = function (v, s) {
        if (this._oBadgeData.value !== v || this._oBadgeData.state !== s) {
            if (s === g.Disappear) {
                v = "";
            }
            this._updateBadgeInvisibleText(v);
            this._oBadgeData = {
                value: v,
                state: s
            };
        }
    };
    j.prototype._updateBadgeInvisibleText = function (v) {
        var r = sap.ui.getCore().getLibraryResourceBundle("sap.m"),
            s, p;
        v = v.toString().trim();
        p = v.indexOf("+");
        if (p !== -1) {
            s = r.getText("BUTTON_BADGE_MORE_THAN_ITEMS", v.substr(0, p));
        } else {
            switch (v) {
                case "":
                    s = "";
                    break;
                case "1":
                    s = r.getText("BUTTON_BADGE_ONE_ITEM", v);
                    break;
                default:
                    s = r.getText("BUTTON_BADGE_MANY_ITEMS", v);
            }
        }
        this._getBadgeInvisibleText().setText(s);
    };
    j.prototype._getBadgeInvisibleText = function () {
        return this._oBadgeInvisibleText || (this._oBadgeInvisibleText = new d(this.getId() + "-badge").toStatic());
    };
    j.prototype.exit = function () {
        if (this._image) {
            this._image.destroy();
        }
        if (this._iconBtn) {
            this._iconBtn.destroy();
        }
        if (this._oBadgeInvisibleText) {
            this._oBadgeInvisibleText.destroy();
            this._oBadgeData = null;
        }
        this.$().off("mouseenter", this._onmouseenter);
    };
    j.prototype.setType = function (s) {
        this.setProperty("type", s, false);
        switch (s) {
            case e.Critical:
                this._sTypeIconURI = "sap-icon://message-warning";
                break;
            case e.Negative:
                this._sTypeIconURI = "sap-icon://message-error";
                break;
            case e.Success:
                this._sTypeIconURI = "sap-icon://message-success";
                break;
            case e.Neutral:
                this._sTypeIconURI = "sap-icon://message-information";
                break;
            case e.Back:
            case e.Up:
                this._sTypeIconURI = "sap-icon://nav-back";
                break;
            default:
                this._sTypeIconURI = null;
        }
        return this;
    };
    j.prototype.onBeforeRendering = function () {
        this._bRenderActive = this._bActive;
        this.$().off("mouseenter", this._onmouseenter);
    };
    j.prototype.onAfterRendering = function () {
        if (this._bRenderActive) {
            this._activeButton();
            this._bRenderActive = this._bActive;
        }
        this.$().on("mouseenter", this._onmouseenter);
    };
    j.prototype.ontouchstart = function (o) {
        o.setMarked();
        if (this._bRenderActive) {
            delete this._bRenderActive;
        }
        if (o.targetTouches.length === 1) {
            this._buttonPressed = true;
            this._activeButton();
        }
        if (this.getEnabled() && this.getVisible()) {
            if ((D.browser.safari || D.browser.firefox) && (o.originalEvent && o.originalEvent.type === "mousedown")) {
                this._setButtonFocus();
            }
            if (!D.browser.msie) {
                this._sTouchStartTargetId = o.target.id.replace(this.getId(), '');
            }
        } else {
            if (!D.browser.msie) {
                this._sTouchStartTargetId = '';
            }
        }
    };
    j.prototype.ontouchend = function (o) {
        var s;
        this._buttonPressed = o.originalEvent && o.originalEvent.buttons & 1;
        this._inactiveButton();
        if (this._bRenderActive) {
            delete this._bRenderActive;
            this.ontap(o, true);
        }
        if (!D.browser.msie) {
            s = o.target.id.replace(this.getId(), '');
            if (this._buttonPressed === 0 && ((this._sTouchStartTargetId === "-BDI-content" && (s === '-content' || s === '-inner' || s === '-img')) || (this._sTouchStartTargetId === "-content" && (s === '-inner' || s === '-img')) || (this._sTouchStartTargetId === '-img' && s !== '-img'))) {
                this.ontap(o, true);
            }
        }
        this._sTouchStartTargetId = '';
    };
    j.prototype.ontouchcancel = function () {
        this._buttonPressed = false;
        this._sTouchStartTargetId = '';
        this._inactiveButton();
    };
    j.prototype.ontap = function (o, F) {
        o.setMarked();
        delete this._bRenderActive;
        if (this.bFromTouchEnd) {
            return;
        }
        if (this.getEnabled() && this.getVisible()) {
            if ((o.originalEvent && o.originalEvent.type === "touchend")) {
                this.focus();
            }
            this.fireTap({});
            this.firePress({});
        }
        this.bFromTouchEnd = F;
        if (this.bFromTouchEnd) {
            setTimeout(function () {
                delete this.bFromTouchEnd;
            }.bind(this), 0);
        }
    };
    j.prototype.onkeydown = function (o) {
        if (o.which === K.SPACE || o.which === K.ENTER || o.which === K.ESCAPE || o.which === K.SHIFT) {
            if (o.which === K.SPACE || o.which === K.ENTER) {
                o.setMarked();
                this._activeButton();
            }
            if (o.which === K.ENTER) {
                this.firePress({});
            }
            if (o.which === K.SPACE) {
                this._bPressedSpace = true;
            }
            if (this._bPressedSpace) {
                if (o.which === K.SHIFT || o.which === K.ESCAPE) {
                    this._bPressedEscapeOrShift = true;
                    this._inactiveButton();
                }
            }
        } else {
            if (this._bPressedSpace) {
                o.preventDefault();
            }
        }
    };
    j.prototype.onkeyup = function (o) {
        if (o.which === K.ENTER) {
            o.setMarked();
            this._inactiveButton();
        }
        if (o.which === K.SPACE) {
            if (!this._bPressedEscapeOrShift) {
                o.setMarked();
                this._inactiveButton();
                this.firePress({});
            } else {
                this._bPressedEscapeOrShift = false;
            }
            this._bPressedSpace = false;
        }
        if (o.which === K.ESCAPE) {
            this._bPressedSpace = false;
        }
    };
    j.prototype._onmouseenter = function (o) {
        if (this._buttonPressed && o.originalEvent && o.originalEvent.buttons & 1) {
            this._activeButton();
        }
    };
    j.prototype.onfocusout = function () {
        this._buttonPressed = false;
        this._sTouchStartTargetId = '';
        this._inactiveButton();
    };
    j.prototype._activeButton = function () {
        if (!this._isUnstyled()) {
            this.$("inner").addClass("sapMBtnActive");
        }
        this._bActive = this.getEnabled();
        if (this._bActive) {
            if (this._getAppliedIcon() && this.getActiveIcon() && this._image) {
                this._image.setSrc(this.getActiveIcon());
            }
        }
    };
    j.prototype._inactiveButton = function () {
        if (!this._isUnstyled()) {
            this.$("inner").removeClass("sapMBtnActive");
        }
        this._bActive = false;
        if (this.getEnabled()) {
            if (this._getAppliedIcon() && this.getActiveIcon() && this._image) {
                this._image.setSrc(this._getAppliedIcon());
            }
        }
    };
    j.prototype._isHoverable = function () {
        return this.getEnabled() && D.system.desktop;
    };
    j.prototype._getImage = function (s, k, m, n) {
        var o = I.isIconURI(k),
            p;
        if (this._image instanceof sap.m.Image && o || this._image instanceof sap.ui.core.Icon && !o) {
            this._image.destroy();
            this._image = undefined;
        }
        p = this.getIconFirst();
        if (this._image) {
            this._image.setSrc(k);
            if (this._image instanceof sap.m.Image) {
                this._image.setActiveSrc(m);
                this._image.setDensityAware(n);
            }
        } else {
            this._image = I.createControlByURI({
                id: s,
                src: k,
                activeSrc: m,
                densityAware: n,
                useIconTooltip: false
            }, sap.m.Image).addStyleClass("sapMBtnCustomIcon").setParent(this, null, true);
        }
        this._image.addStyleClass("sapMBtnIcon");
        this._image.toggleStyleClass("sapMBtnIconLeft", p);
        this._image.toggleStyleClass("sapMBtnIconRight", !p);
        return this._image;
    };
    j.prototype._getInternalIconBtn = function (s, k) {
        var o = this._iconBtn;
        if (o) {
            o.setSrc(k);
        } else {
            o = I.createControlByURI({
                id: s,
                src: k,
                useIconTooltip: false
            }, sap.m.Image).setParent(this, null, true);
        }
        o.addStyleClass("sapMBtnIcon");
        o.addStyleClass("sapMBtnIconLeft");
        this._iconBtn = o;
        return this._iconBtn;
    };
    j.prototype._isUnstyled = function () {
        var u = false;
        if (this.getType() === e.Unstyled) {
            u = true;
        }
        return u;
    };
    j.prototype.getPopupAnchorDomRef = function () {
        return this.getDomRef("inner");
    };
    j.prototype._getText = function () {
        return this.getText();
    };
    j.prototype._getTooltip = function () {
        var t, o;
        t = this.getTooltip_AsString();
        if (!t && !this._getText()) {
            o = I.getIconInfo(this._getAppliedIcon());
            if (o) {
                t = o.text ? o.text : o.name;
            }
        }
        return t;
    };
    j.prototype._getAppliedIcon = function () {
        return this.getIcon() || this._sTypeIconURI;
    };
    j.prototype.getAccessibilityInfo = function () {
        var s = this._getText() || this.getTooltip_AsString();
        if (!s && this._getAppliedIcon()) {
            var o = I.getIconInfo(this._getAppliedIcon());
            if (o) {
                s = o.text || o.name;
            }
        }
        return {
            role: "button",
            type: sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("ACC_CTR_TYPE_BUTTON"),
            description: s,
            focusable: this.getEnabled(),
            enabled: this.getEnabled()
        };
    };
    j.prototype._setButtonFocus = function () {
        setTimeout(function () {
            this.focus();
        }.bind(this), 0);
    };
    j.prototype._determineSelfReferencePresence = function () {
        var k = this.getAriaLabelledBy(),
            m = k.indexOf(this.getId()) !== -1,
            H = L.getReferencingLabels(this).length > 0,
            p = this.getParent(),
            n = !!(p && p.enhanceAccessibilityState);
        return !m && this._getText() && (k.length > 0 || H || n);
    };
    j.prototype._determineAccessibilityType = function () {
        var H = this.getAriaLabelledBy().length > 0,
            k = this.getAriaDescribedBy().length > 0,
            m = L.getReferencingLabels(this).length > 0,
            n = this.getType() !== e.Default,
            o = H || m,
            p = k || n || (this._oBadgeData && this._oBadgeData.value !== "" && this._oBadgeData.State !== g.Disappear),
            s;
        if (!o && !p) {
            s = f.Default;
        } else if (o && !p) {
            s = f.Labelled;
        } else if (!o && p) {
            s = f.Described;
        } else if (o && p) {
            s = f.Combined;
        }
        return s;
    };
    j.prototype._getTitleAttribute = function (s) {
        return this.getTooltip();
    };
    return j;
});