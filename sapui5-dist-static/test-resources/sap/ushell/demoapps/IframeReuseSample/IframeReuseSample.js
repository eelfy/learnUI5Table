/**
 * Open for the first time - preparations
 */
function onLoad () {
    setEventHandlers();
    setTimeValues();
    addEventListener("message", processMessages);

    /**
     * the first time the iframe is launched, its for a specific
     * app so we need to create it
     */
    openApp(getApplicationID(document.URL));

    /**
     * Inform FLP that this iframe supports statefull container
     * (this is not needed in case the indication exists in
     * the URL template of the app).
     * In case the statefull container for this iframe is already
     * enabled though the URL Template, we do not need to do anything.
     */
    if (document.location.href.indexOf("disableSetup=true") < 0) {
        sendRequestToFLP("sap.ushell.services.appLifeCycle.setup", {
            isStateful: true,
            session: {
                bLogoutSupport: true
            }
        });
    }
}

/**
 * Set event handlers
 */
function setEventHandlers()
{
    $("#idA2B").click(function () { navToApp('B', true); });
    $("#idA2C").click(function () { navToApp('C', true); });

    $("#idB2A").click(function () { navToApp('A', true); });
    $("#idB2C").click(function () { navToApp('C', true); });

    $("#idC2A").click(function () { navToApp('A', true); });
    $("#idC2B").click(function () { navToApp('B', true); });
}

/**
 * Handle stateful container events from FLP
 */
function processMessages(oMessage)
{
    var oMessageData = JSON.parse(oMessage.data);

    if (oMessageData.service === "sap.ushell.services.appLifeCycle.create") {
        openApp(getApplicationID(oMessageData.body.sUrl));
        sendSuccessToFLP(oMessageData);
    } else if (oMessageData.service === "sap.ushell.services.appLifeCycle.destroy") {
        closeApp();
        sendSuccessToFLP(oMessageData);
    } else if (oMessageData.service === "sap.ushell.appRuntime.innerAppRouteChange") {
        navToApp(oMessageData.body.oHash.newHash);
        sendSuccessToFLP(oMessageData);
    } else if (oMessageData.service === "sap.ushell.sessionHandler.logout") {
        //do whatever is needed to logout
        sendSuccessToFLP(oMessageData);
    }
}

/**
 * Open an application
 */
function openApp(sID) {
    $("#idTimeOpened").text(new Date().toLocaleTimeString());
    $("#idApp").text(sID);
    $("#canvas").prepend($("#"+sID));
    $("#idAppArea").css('background-color', $("#"+sID).attr("color"));
}

/**
 * Close an application
 */
function closeApp() {
    $('#Apps').prepend($('#canvas').find(">:first-child"));
}

/**
 * internal navigation from App to App
 */
function navToApp(sID, bUpdateFLPRoute) {
    closeApp();
    openApp(sID);
    if (bUpdateFLPRoute) {
        sendRequestToFLP("sap.ushell.services.CrossApplicationNavigation.setInnerAppRoute", {
            appSpecificRoute: "&/" + sID
        });
    }
}

/**
 * util function to post message to FLP
 */
function sendRequestToFLP (sService, oData) {
    window.parent.postMessage({
        type: "request",
        service: sService,
        body: oData
    }, "*");
}

/**
 * util function to send respond to FLP
 */
function sendSuccessToFLP (oMessageData) {
    window.parent.postMessage({
        type: "response",
        "service": oMessageData.service,
        "request_id": oMessageData.request_id,
        "status": "success",
        "body": {}
    }, "*")
}

/**
 * Extract the application ID from the URL
 */
function getApplicationID(sUrl) {
    var sHash = sUrl.substr(sUrl.indexOf("#"));
    return sHash.substr(sHash.indexOf("&/")+2);
}

/**
 * util function to show time
 */
function setTimeValues() {
    function showCurrentTime() {
        $("#idCurrentTime").text(new Date().toLocaleTimeString());
    }

    $("#idTimeCreated").text(new Date().toLocaleTimeString());
    showCurrentTime();
    setInterval(showCurrentTime, 1000);
}
window.onload = onLoad;
