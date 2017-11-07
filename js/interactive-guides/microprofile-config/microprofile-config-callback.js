/*******************************************************************************
* Copyright (c) 2017 IBM Corporation and others.
* All rights reserved. This program and the accompanying materials
* are made available under the terms of the Eclipse Public License v1.0
* which accompanies this distribution, and is available at
* http://www.eclipse.org/legal/epl-v10.html
*
* Contributors:
*     IBM Corporation - initial API and implementation
*******************************************************************************/
var microprofileConfigCallBack = (function() {

    // ToDo: fixing editor error prompt should be moved to common codes
    var __createEditorErrorButton = function(buttonId, buttonName, className, method, ariaLabel) {
        return $('<button/>', {
            type: 'button',
            text: buttonName,
            id: buttonId,
            class: className,
            click: method,
            'aria-label': ariaLabel
        });
    };

    var __closeEditorErrorBox = function(stepName) {
        var step = $("[data-step=" + stepName + "]");
        var editorError = step.find(".alertFrame").first();

        if (editorError.length) {
            editorError.addClass("hidden");
        }
    };

    var __createErrorLinkForCallBack = function(stepName, isSave) {
        var idHere = "here_button_error_editor_" + stepName;
        var idClose = "close_button_error_editor_" + stepName;
        var idError = "error_" + stepName;

        var thisStepName = stepName;
        var thisIsSave = isSave;

        var handleOnClickFixContent = function() {
            __correctEditorError(thisStepName, thisIsSave);
        };

        var handleOnClickClose = function() {
            __closeEditorErrorBox(thisStepName);
        };

        var step = $("[data-step=" + stepName + "]");
        var editorError = step.find(".alertFrame").first();
        if (editorError.length) {
            editorError.removeClass("hidden");

            var errorLink = editorError.find("#" + idError).first();
            if (errorLink.length) {
                // button exists
                // unbind the previous click of this button id
                // before bind it to a new onclick
                $("#" + idHere).unbind("click");
                $("#" + idHere).bind("click", handleOnClickAnnotation);
            } else {

                var hereButton = __createEditorErrorButton(idHere, messages.hereButton, "here_button_error_editor", handleOnClickFixContent, "Here");
                var closeButton = __createEditorErrorButton(idClose, "", "glyphicon glyphicon-remove-circle close_button_error_editor", handleOnClickClose, "Close error");
                var strMsg = "Error detected. To fix the error click ";
                //var strMsg = utils.formatString(messages.editorErrorLink, [hereButton]);

                var spanStr = '<span id=\"' + idError + '\">' + strMsg;
                editorError.append(spanStr);
                editorError.append(hereButton);
                editorError.append(closeButton);
                editorError.append('</span>');
            }
        }
    };

    var __correctEditorError = function(stepName, isSave) {
        // correct annotation/method
        if (stepName === "ConfigureAsEnvVar") {
            __addPropToServerEnv(stepName);
        }
        // hide the error box
        __closeEditorErrorBox(stepName);
        // call save editor
        if (isSave === true) {
            contentManager.saveEditor(stepName);
        }
    };

    /*
     * Callback and functions to support Configuring as an Environment Variable step.
     */
    var serverEnvDownloadUrlConfig = "download-url=ftp://music.com/asia/download";
    var __checkServerEnvContent = function(content) {
        var match = false;
        try {
            if (content.match(/WLP_SKIP_MAXPERMSIZE=true\s*download-url=ftp:\/\/music.com\/asia\/download\s*/g)) {
                match = true;
            }
        }
        catch (e) {

        }
        return match;
    };

    var __listenToEditorForServerEnv = function(editor) {
        var __showWebBrowser = function() {
            var stepName = editor.getStepName();
            var content = contentManager.getEditorContents(stepName);
            if (__checkServerEnvContent(content)) {
                __closeEditorErrorBox(stepName);
                contentManager.showBrowser(stepName, 0);
                contentManager.addRightSlideClassToBrowser(stepName, 0);
                contentManager.markCurrentInstructionComplete(stepName);
                contentManager.updateWithNewInstructionNoMarkComplete(stepName);
            } else {
                // display error and provide link to fix it
                __createErrorLinkForCallBack(stepName, true);
            }
        };
        editor.addSaveListener(__showWebBrowser);
    };

    var __addPropToServerEnv = function() {     
        var stepName = stepContent.getCurrentStepName();
        // reset content every time property is added through the button so as to clear out any
        // manual editing
        __closeEditorErrorBox(stepName);
        contentManager.resetEditorContents(stepName);
        var content = contentManager.getEditorContents(stepName);

        contentManager.replaceEditorContents(stepName, 2, 2, serverEnvDownloadUrlConfig);
        var readOnlyLines = [];
        readOnlyLines.push({
            from: 1,
            to: 1
        });
        contentManager.markEditorReadOnlyLines(stepName, readOnlyLines);
    };

    var __listenToBrowserForServerEnvConfig = function(webBrowser) {
        var setBrowserContent = function(currentURL) {
            webBrowser.setBrowserContent("/guides/iguide-microprofile-config/html/interactive-guides/microprofile-config/download-from-property-in-server-env.html");
            contentManager.markCurrentInstructionComplete(webBrowser.getStepName());
        }
        // Cannot use contentManager.hideBrowser as the browser is still going thru initialization 
        webBrowser.contentRootElement.addClass("hidden");
        webBrowser.addUpdatedURLListener(setBrowserContent);
    };
    
    var __addPropToServerEnvButton = function(event) {
        if (event.type === "click" ||
           (event.type === "keypress" && (event.which === 13 || event.which === 32))) {
            // Click or 'Enter' or 'Space' key event...
            __addPropToServerEnv();
        }
    };

    var __saveServerEnvButton = function(event) {
        if (event.type === "click" ||
           (event.type === "keypress" && (event.which === 13 || event.which === 32))) {
            // Click or 'Enter' or 'Space' key event...
            contentManager.saveEditor(stepContent.getCurrentStepName());
        }
    };

    var __serverEnvRefreshBrowserButton = function(event) {
        if (event.type === "click" ||
           (event.type === "keypress" && (event.which === 13 || event.which === 32))) {
           // Click or 'Enter' or 'Space' key event...
           contentManager.refreshBrowser(stepContent.getCurrentStepName());
        }
    };

    return {
        listenToEditorForServerEnv: __listenToEditorForServerEnv,
        listenToBrowserForServerEnvConfig: __listenToBrowserForServerEnvConfig,
        addPropToServerEnvButton: __addPropToServerEnvButton,
        saveServerEnvButton: __saveServerEnvButton,
        serverEnvRefreshBrowserButton: __serverEnvRefreshBrowserButton
    };

})();