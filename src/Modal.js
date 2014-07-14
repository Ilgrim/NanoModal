
var El = require("./El");
var ModalEvent = require("./ModalEvent");

function Modal(options) {
    var modal = El("div", "nanoModal nanoModalOverride");
    var content = El("div", "nanoModalContent");
    var buttonArea = El("div", "nanoModalButtons");
    modal.add(content);
    modal.add(buttonArea);

    var buttons = [];
    var modalsContainer = document.getElementById("nanoModalsContainer");

    var onShowEvent = ModalEvent();
    var onHideEvent = ModalEvent();

    if (typeof options === "undefined") {
        return;
    }
    if (options.content === undefined) {
        var text = options;
        options = {
            content: text
        };
    }

    var setContent = function(newContent) {
        // Only good way of checking if a node in IE8...
        if (newContent.nodeType) {
            content.html("");
            content.el.appendChild(newContent);
        } else {
            content.html(newContent);
        }
    };
    setContent(options.content);

    if (options.buttons === undefined) {
        options.buttons = [{text: "Close", handler: "hide", primary: true}];
    }

    var show = function() {
        modalsContainer.appendChild(modal.el);
        modal.show();
        modal.setStyle("marginLeft", -modal.el.clientWidth / 2 + "px");
        onShowEvent.fire();
    };

    var hide = function() {
        if (modal.isShowing()) {
            modal.hide();
            onHideEvent.fire();
        }
    };

    var onShow = function(callback) {
        onShowEvent.addListener(callback);
    };

    var onHide = function(callback) {
        onHideEvent.addListener(callback);
    };

    var removeButtons = function() {
        var t = buttons.length;
        while (t-- > 0) {
            var button = buttons[t];
            button.remove();
        }
        buttons = [];
    };

    var remove = function() {
        hide();
        removeButtons();
        modal.remove();
        onShowEvent.removeAllListeners();
        onHideEvent.removeAllListeners();
    };

    var setButtons = function(buttonList) {
        var btnIdx = buttonList.length;
        var btnObj;
        var btnEl;
        var classes;

        removeButtons();

        if (btnIdx === 0) {
            buttonArea.hide();
        } else {
            buttonArea.show();
            while (btnIdx-- > 0) {
                btnObj = buttonList[btnIdx];
                classes = "nanoModalBtn";
                if (btnObj.primary) {
                    classes += " nanoModalBtnPrimary";
                }
                btnEl = El("button", classes);
                if (btnObj.handler === "hide") {
                    btnEl.addClickListener(hide);
                } else if (btnObj.handler) {
                    btnEl.addClickListener(btnObj.handler);
                }
                btnEl.text(btnObj.text);
                buttonArea.add(btnEl);
                buttons.push(btnEl);
            }
        }
    };
    setButtons(options.buttons);

    modalsContainer.appendChild(modal.el);

    return {
        modal: modal,
        options: options,
        show: show,
        hide: hide,
        onShow: onShow,
        onHide: onHide,
        remove: remove,
        setButtons: setButtons,
        setContent: setContent
    };
}

module.exports = Modal;
