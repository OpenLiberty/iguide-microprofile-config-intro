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
        if(stepName === "ConfigurePropsFile"){
            __addPropToConfigProps(stepName);
        }
        // correct annotation/method
        if (stepName === "ConfigureAsEnvVar") {
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
   
    //var injectConfigDefault = "download-url=ftp://music.com/us/download";

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

    /*
      Match the parameters. Returns
        0 for no match
        1 for exact match
        2 for extra parameters
    */
    var __isParamInAnnotation = function(annotationParams, paramsToCheck) {
        var params = [];
        var allMatch = 1;  // assume matching to begin with

        // for each parameter, break it down to name and value so as to make it easier to compare
        $(annotationParams).each(function(index, element){
            if (element.indexOf("=") !== -1) {
                params[index] = {};
                params[index].value = element.trim().substring(element.indexOf('=') + 1);
                params[index].name = element.trim().substring(0, element.indexOf('='));
            }
        });
        // now compare with the passed in expected params
        $(paramsToCheck).each(function(index, element){
            if (element.indexOf("=") !== -1) {
                var value = element.trim().substring(element.indexOf('=') + 1);
                var name = element.trim().substring(0, element.indexOf('='));
                var eachMatch = false;
                $(params).each(function(paramsIndex, annotationInEditor) {
                    if (annotationInEditor.name === name && annotationInEditor.value === value) {
                        eachMatch = true;
                        return false;  // break out of each loop
                    }
                });
                if (eachMatch === false) {
                    allMatch = 0;
                    return false; // break out of each loop
                }
            }
        });

        if (allMatch === 1 && annotationParams.length > paramsToCheck.length) {
            allMatch = 2; // extra parameters
        }
        console.log("allMatch ", allMatch);
        return allMatch;
    };

    var __checkInjectionEditorContent = function(content) {
        var annotationIsThere = true;
        var editorContentBreakdown = __getInjectionConfigContent(content);
        if (editorContentBreakdown.hasOwnProperty("annotationParams")) {
            var paramsToCheck = [];
            paramsToCheck[0] = "name=\"download-url\"";
            paramsToCheck[1] = "defaultValue=\"ftp://music.com/us/download\"";
            var isParamInAnnotation = __isParamInAnnotation(editorContentBreakdown.annotationParams, paramsToCheck);
            if (isParamInAnnotation !== 1) {
                annotationIsThere = false;
            }
        } else {
            annotationIsThere = false;
        }
        //console.log("")
        return annotationIsThere;
    };

    var __listenToEditorForInjectConfig = function(editor) {
        var __showWebBrowser = function() {
            var stepName = editor.getStepName();
            var content = contentManager.getEditorContents(stepName);
            if (__checkInjectionEditorContent(content)) {
                __closeEditorErrorBox(stepName);
                contentManager.showBrowser(stepName, 0);
                contentManager.addRightSlideClassToBrowser(stepName, 0);
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

        contentManager.insertEditorContents(stepName, 9, injectConfig);
        var readOnlyLines = [];
        readOnlyLines.push({from: 1, to: 7}, {from: 10, to: 11});
        contentManager.markEditorReadOnlyLines(stepName, readOnlyLines);       
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
        listenToBrowserForDefaultConfig:  __listenToBrowserForDefaultConfig    
    };

})();