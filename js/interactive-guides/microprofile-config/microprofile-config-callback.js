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
                $("#" + idHere).bind("click", handleOnClickFixContent);
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
        if (stepName === "ConfigurePropsFile"){
            __addPropToConfigProps(stepName);
        } else if (stepName === "ConfigureAsEnvVar") {
            __addPropToServerEnv(stepName);
        } else if (stepName === "ConfigureViaInject") {
            __addInjectConfigToEditor(stepName);
        }
        // hide the error box
        __closeEditorErrorBox(stepName);
        // call save editor
        if (isSave === true) {
            contentManager.saveEditor(stepName);
        }
    };

    var propsFileConfig = "download-url=ftp://music.com/canada/download";
    var __checkConfigPropsFile = function(content) {
        var match = false;
        try {
            if(content.match(/\s*download-url=ftp:\/\/music.com\/canada\/download\s*/g)){
                match = true;
            }
        }
        catch (e) {

        }
        return match;
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

    var __listenToEditorForPropConfig = function(editor) {
        var __showWebBrowser = function() {
            var stepName = editor.getStepName();
            var content = contentManager.getEditorContents(stepName);
            if (__checkConfigPropsFile(content)) {
                __closeEditorErrorBox(stepName);                                
                contentManager.showBrowser(stepName, 0);
                contentManager.addRightSlideClassToBrowser(stepName, 0);
                var index = contentManager.getCurrentInstructionIndex();
                if(index === 0){
                    contentManager.markCurrentInstructionComplete(stepName);
                    contentManager.updateWithNewInstructionNoMarkComplete(stepName);
                }                
            } else {
                // display error and provide link to fix it
                __createErrorLinkForCallBack(stepName, true);
            }
        };
        editor.addSaveListener(__showWebBrowser);
    };

    var __listenToEditorForServerEnv = function(editor) {
        var __showWebBrowser = function() {
            var stepName = editor.getStepName();
            var content = contentManager.getEditorContents(stepName);
            if (__checkServerEnvContent(content)) {
                __closeEditorErrorBox(stepName);
                contentManager.showBrowser(stepName, 0);
                contentManager.addRightSlideClassToBrowser(stepName, 0);

                var index = contentManager.getCurrentInstructionIndex();  
                if(index === 0){
                    contentManager.markCurrentInstructionComplete(stepName);
                    contentManager.updateWithNewInstructionNoMarkComplete(stepName);
                }                
            } else {
                // display error and provide link to fix it
                __createErrorLinkForCallBack(stepName, true);
            }
        };
        editor.addSaveListener(__showWebBrowser);
    };

    var __addPropToConfigProps = function() {
        var stepName = stepContent.getCurrentStepName();
        // reset content every time property is added through the button so as to clear out any
        // manual editing
        __closeEditorErrorBox(stepName);
        contentManager.resetEditorContents(stepName);
        var content = contentManager.getEditorContents(stepName);

        contentManager.replaceEditorContents(stepName, 1, 1, propsFileConfig);
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

    var __listenToBrowserForPropFileConfig = function(webBrowser) {
        var setBrowserContent = function(currentURL) {
            webBrowser.setBrowserContent("/guides/iguide-microprofile-config/html/interactive-guides/microprofile-config/download-from-properties-file.html");
            contentManager.markCurrentInstructionComplete(webBrowser.getStepName());
        }
        // Cannot use contentManager.hideBrowser as the browser is still going thru initialization 
        webBrowser.contentRootElement.addClass("hidden");
        webBrowser.addUpdatedURLListener(setBrowserContent);
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

    var __refreshBrowserButton = function(event) {
        if (event.type === "click" ||
           (event.type === "keypress" && (event.which === 13 || event.which === 32))) {
           // Click or 'Enter' or 'Space' key event...
           contentManager.refreshBrowser(stepContent.getCurrentStepName());
        }
    };

    var __saveButton = function(event) {
        if (event.type === "click" ||
           (event.type === "keypress" && (event.which === 13 || event.which === 32))) {
            // Click or 'Enter' or 'Space' key event...
            contentManager.saveEditor(stepContent.getCurrentStepName());
        }
    };

    var __getInjectionConfigContent = function(content) {
        var editorContents = {};
        try {
            // match
            // private Config config;
            //   <space or newline here>
            // @Inject @ConfigProperty(name=\"download-url\", defaultValue=\"ftp://music.com/us/download\")
            // private String downloadUrl;
            var contentToMatch = "[\\s\\S]*private Config config;\\s*@Inject\\s*@ConfigProperty\\s*\(([\\s\\S]*)\)\\s*private String downloadUrl;";
            var regExpToMatch = new RegExp(contentToMatch, "g");
            var groups = regExpToMatch.exec(content);
            
            var params = groups[1];
            params = params.replace('\n','');
            params = params.replace(/\s/g, ''); // Remove whitespace
            if (params.trim() !== "") {
                params = params.split(',');
            } else {
                params = [];
            }
            editorContents.annotationParams = params;           
        }
        catch (e) {

        }
        return editorContents;
    };

    var __isParamInAnnotation = function(annotationParams) {
        var allMatch = 2; 
        if (annotationParams.length === 2) {
            var param1 = annotationParams[0];
            var param2 = annotationParams[1];
            
            //console.log("param1 ", param1);
            //console.log("param2 ", param2);
            //regExpr1 = "\s*name\s*=\s*\"download-url\"\s*"
            //regExpr2 = "\s*defaultValue\s*=\s*\"ftp:\/\/music.com\/us\/download\"\s*\)\s*";       
            if (param1.match(/\s*name\s*=\s*\"download-url\"\s*/) &&
                param2.match(/\s*defaultValue\s*=\s*\"ftp:\/\/music.com\/us\/download\"\s*\)\s*/)) {
                console.log("match a ");
                allMatch = 1;
            }
            else if (param2.match(/\s*name\s*=\s*\"download-url\"\s*/) &&
                param1.match(/\s*defaultValue\s*=\s*\"ftp:\/\/music.com\/us\/download\"\s*\)\s*/)) {
                console.log("match b ");
                allMatch = 1;
            }
        }
        //console.log("allMatch ", allMatch);
        return allMatch;      
    }

    var __checkInjectionEditorContent = function(content) {
        var annotationIsThere = true;
        var editorContentBreakdown = __getInjectionConfigContent(content);
        if (editorContentBreakdown.hasOwnProperty("annotationParams")) {
            //var paramsToCheck = [];
            //paramsToCheck[0] = "name=\"download-url\"";
            //paramsToCheck[1] = "defaultValue=\"ftp://music.com/us/download\"";
            var isParamInAnnotation = __isParamInAnnotation(editorContentBreakdown.annotationParams);
            if (isParamInAnnotation !== 1) {
                annotationIsThere = false;
            }
        } else {
            annotationIsThere = false;
        }
        return annotationIsThere;
    };

    var __listenToEditorForInjectConfig = function(editor) {
        var __showWebBrowser = function() {
            var stepName = editor.getStepName();
            var content = contentManager.getEditorContents(stepName);
            if (__checkInjectionEditorContent(content)) {
                __closeEditorErrorBox(stepName);
                //contentManager.showBrowser(stepName, 0);
                //contentManager.addRightSlideClassToBrowser(stepName, 0);
                contentManager.markCurrentInstructionComplete(stepName);
                //contentManager.updateWithNewInstructionNoMarkComplete(stepName);
            } else {
                // display error and provide link to fix it
                __createErrorLinkForCallBack(stepName, true);
            }
        };
        editor.addSaveListener(__showWebBrowser);
    };

    var __addConfigInjectButton = function(event) {
        if (event.type === "click" ||
        (event.type === "keypress" && (event.which === 13 || event.which === 32))) {
            // Click or 'Enter' or 'Space' key event...
            __addInjectConfigToEditor();
        }        
    };

    var __addInjectConfigToEditor = function(stepName) {
        var injectConfig = "    @Inject @ConfigProperty(name=\"download-url\", defaultValue=\"ftp://music.com/us/download\")";
        if (!stepName) {   
           stepName = stepContent.getCurrentStepName();
        }
        // reset content every time property is added through the button so as to clear out any
        // manual editing
        __closeEditorErrorBox(stepName);
        contentManager.resetEditorContents(stepName);
        var content = contentManager.getEditorContents(stepName);

        contentManager.insertEditorContents(stepName, 10, injectConfig);
        var readOnlyLines = [];
        readOnlyLines.push({from: 1, to: 8}, {from: 11, to: 12});
        contentManager.markEditorReadOnlyLines(stepName, readOnlyLines);       
    };
    
    var downloadMusicUrl = "https://music.com/download";

    var __populateURL = function(event, stepName) {
        if (event.type === "click" ||
           (event.type === "keypress" && (event.which === 13 || event.which === 32))) {
               // Click or 'Enter' or 'Space' key event...
            contentManager.setBrowserURL(stepName, downloadMusicUrl);
        }
    };

    var __enterButtonURL = function(event, stepName) {
        if (event.type === "click" ||
        (event.type === "keypress" && (event.which === 13 || event.which === 32))) {
            // Click or 'Enter' or 'Space' key event...
            contentManager.refreshBrowser(stepName);
        }
    };

    var __listenToBrowserForDefaultConfig = function(webBrowser) {
        var setBrowserContent = function(currentURL) {
            webBrowser.setBrowserContent("/guides/iguide-microprofile-config/html/interactive-guides/microprofile-config/download-from-injection.html");
            contentManager.markCurrentInstructionComplete(webBrowser.getStepName());
        }
        
        webBrowser.addUpdatedURLListener(setBrowserContent);
    };

    return {
        listenToEditorForPropConfig: __listenToEditorForPropConfig,
        listenToEditorForServerEnv: __listenToEditorForServerEnv,
        listenToBrowserForPropFileConfig: __listenToBrowserForPropFileConfig,
        listenToBrowserForServerEnvConfig: __listenToBrowserForServerEnvConfig,
        addPropToConfigProps: __addPropToConfigProps,
        addPropToServerEnvButton: __addPropToServerEnvButton,
        refreshBrowserButton: __refreshBrowserButton,
        saveButton: __saveButton,
        listenToEditorForInjectConfig: __listenToEditorForInjectConfig,
        addConfigInjectButton: __addConfigInjectButton,
        listenToBrowserForDefaultConfig:  __listenToBrowserForDefaultConfig,
        populateURL:  __populateURL,
        enterButtonURL: __enterButtonURL
    };

})();
