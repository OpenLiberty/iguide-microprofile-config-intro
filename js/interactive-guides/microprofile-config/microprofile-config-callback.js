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

    var propsFileConfig = "download_url=ftp://music.com/us-south/download";
    var __checkConfigPropsFile = function(content) {
        var match = false;
        try {
            if(content.match(/\s*download_url=ftp:\/\/music.com\/us-south\/download\s*/g)){
                match = true;
            }
        }
        catch (e) {

        }
        return match;
    };

    /*
     * Callback and functions to support Configuring steps.
     */
    var serverEnvDownloadUrlConfig = "download_url=ftp://music.com/us-west/download";
    var serverEnvFileName = "server.env";
    var __checkServerEnvContent = function(content) {
        var match = false;
        try {
            if (content.match(/WLP_SKIP_MAXPERMSIZE=true\s*download_url=ftp:\/\/music.com\/us-west\/download\s*/g)) {
                match = true;
            }
        }
        catch (e) {

        }
        return match;
    };

    var __checkSystemPropsContent = function(content){
        var match = false;
        try {
            if (content.match(/WLP_SKIP_MAXPERMSIZE=true\s*download_url=ftp:\/\/music.com\/asia\/download\s*/g)) {
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
                editor.closeEditorErrorBox(stepName);                                
                contentManager.showBrowser(stepName, 0);
                contentManager.addRightSlideClassToBrowser(stepName, 0);
                var index = contentManager.getCurrentInstructionIndex();
                if(index === 0){
                    contentManager.markCurrentInstructionComplete(stepName);
                    contentManager.updateWithNewInstructionNoMarkComplete(stepName);
                }                
            } else {
                // display error and provide link to fix it
                editor.createErrorLinkForCallBack(true, __addPropToConfigProps);
            }
        };
        editor.addSaveListener(__showWebBrowser);
    };

    var __listenToEditorForServerEnv = function(editor) {
        var __showWebBrowser = function() {
            var stepName = editor.getStepName();
            var content = contentManager.getTabbedEditorContents(stepName, serverEnvFileName);
            if (__checkServerEnvContent(content)) {
                editor.closeEditorErrorBox(stepName);
                contentManager.showBrowser(stepName, 0);
                contentManager.addRightSlideClassToBrowser(stepName, 0);

                var index = contentManager.getCurrentInstructionIndex();  
                if(index === 0){
                    contentManager.markCurrentInstructionComplete(stepName);
                    contentManager.updateWithNewInstructionNoMarkComplete(stepName);
                }                
            } else {
                // display error and provide link to fix it
                editor.createErrorLinkForCallBack(true, __addPropToServerEnv);
            }
        };
        editor.addSaveListener(__showWebBrowser);
    };

    var __listenToEditorForSystemProperties = function(editor) {
        var __showWebBrowser = function() {
            var stepName = editor.getStepName();
            var content = contentManager.getTabbedEditorContents(stepName, systemPropsFileName);
            if (__checkSystemPropsContent(content)) {
                editor.closeEditorErrorBox(stepName);
                contentManager.showBrowser(stepName, 0);
                contentManager.addRightSlideClassToBrowser(stepName, 0);

                var index = contentManager.getCurrentInstructionIndex();  
                if(index === 0){
                    contentManager.markCurrentInstructionComplete(stepName);
                    contentManager.updateWithNewInstructionNoMarkComplete(stepName);
                }                
            } else {
                // display error and provide link to fix it
                editor.createErrorLinkForCallBack(true, __addPropToSystemProperties);
            }
        };
        editor.addSaveListener(__showWebBrowser);
    };

    var __addPropToConfigProps = function() {
        var stepName = stepContent.getCurrentStepName();
        // reset content every time property is added through the button so as to clear out any manual editing
        contentManager.resetEditorContents(stepName);
        var content = contentManager.getEditorContents(stepName);

        contentManager.replaceEditorContents(stepName, 1, 1, propsFileConfig);
    };

    var __addPropToServerEnv = function() {     
        var stepName = stepContent.getCurrentStepName();
        // reset content every time property is added through the button so as to clear out any manual editing
        contentManager.resetTabbedEditorContents(stepName, serverEnvFileName);
        contentManager.replaceTabbedEditorContents(stepName, serverEnvFileName, 2, 2, serverEnvDownloadUrlConfig);

        var readOnlyLines = [];
        readOnlyLines.push({
            from: 1,
            to: 1
        });

        contentManager.markTabbedEditorReadOnlyLines(stepName, serverEnvFileName, readOnlyLines);
    };

    var systemPropsFileName = "bootstrap.properties";
    var systemPropsDownloadUrlConfig = "download_url=ftp://music.com/asia/download";
    var __addPropToSystemProperties = function() {
        var stepName = stepContent.getCurrentStepName();
        // reset content every time property is added through the button so as to clear out any manual editing
        contentManager.resetTabbedEditorContents(stepName, systemPropsFileName);
        contentManager.replaceTabbedEditorContents(stepName, systemPropsFileName, 2, 2, systemPropsDownloadUrlConfig);

        var readOnlyLines = [];
        readOnlyLines.push({
            from: 1,
            to: 1
        });

        contentManager.markTabbedEditorReadOnlyLines(stepName, systemPropsFileName, readOnlyLines);
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

    var __listenToBrowserForSystemPropConfig = function(webBrowser) {
        var setBrowserContent = function(currentURL) {
            webBrowser.setBrowserContent("/guides/iguide-microprofile-config/html/interactive-guides/microprofile-config/download-from-property-in-system-props.html");
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

    var __saveTabbedEditorButton = function(event) {
        if (event.type === "click" ||
           (event.type === "keypress" && (event.which === 13 || event.which === 32))) {
            // Click or 'Enter' or 'Space' key event...
            var stepName = stepContent.getCurrentStepName();
            var editorFileName;
            if (stepName === "ConfigureAsEnvVar") {
                editorFileName = serverEnvFileName;
            } else if (stepName === "ConfigurePropsFile") {
                editorFileName = "META-INF/microprofile-config.props";
            } else if (stepName === "ConfigureViaInject") {
                editorFileName === "Music-download.java";
            } else if (stepName === "ConfigureAsSysProp") {
                editorFileName = "bootstrap.properties";
            }
            if (editorFileName) {
                contentManager.saveTabbedEditor(stepName, editorFileName);
            }
        }
    };

    var __listenToEditorTabChange = function(tabbedEditor, instructionIndexToMarkUnavailable, fileNameToCheck) {
        var __handleInstruction = function() {
            var instructionId = '#' + stepContent.getCurrentStepName() + '-instruction-' + instructionIndexToMarkUnavailable;
            if (!contentManager.isInstructionComplete(stepContent.getCurrentStepName(), instructionIndexToMarkUnavailable)) {
                var newActiveTabFileName = tabbedEditor.getActiveTabFileName();
                var instr = $(instructionId);
                if (newActiveTabFileName !== fileNameToCheck) {
                    // "Dim" out non-completed instructions when moving to a readonly editor tab
                    if (instr.length > 0) {
                        // Make it dim temporarily
                        instr.addClass('unavailable');
                    }
                } else {
                    if (instr.length > 0) {
                        // Make it available again
                        instr.removeClass('unavailable');
                    }
                }
            }
        };

        tabbedEditor.addActiveTabChangeListener(__handleInstruction);
    };
    
    var __getInjectionConfigContent = function(content) {
        var annotationParams = null;
        try {
            // match
            // private Config config;
            //   <space or newline here>
            // @Inject @ConfigProperty(name=\"download_url\", defaultValue=\"ftp://music.com/us-east/download\")
            // private String downloadUrl;
            var contentToMatch = "[\\s\\S]*private Config config;\\s*@Inject\\s*@ConfigProperty\\s*\\(([\\s\\S]*)\\)\\s*private String downloadUrl;";
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
            annotationParams = params;           
        }
        catch (e) {

        }
        return annotationParams;
    };

    var __isParamInAnnotation = function(annotationParams) {
        var allMatch = false; 
        if (annotationParams.length === 2) {
            var param1 = annotationParams[0];
            var param2 = annotationParams[1];
                  
            if ((param1 === "name=\"download_url\"" &&
                 param2 === "defaultValue=\"ftp:\/\/music.com\/us\/download\"") ||
                (param2 === "name=\"download_url\"" &&
                 param1 === "defaultValue=\"ftp:\/\/music.com\/us\/download\"")) {
                allMatch = true;
            }
        }
        return allMatch;      
    }

    var __checkInjectionEditorContent = function(content) {
        var annotationIsThere = false;
        var editorContentBreakdown = __getInjectionConfigContent(content);
        if (editorContentBreakdown !== null) {
            annotationIsThere = __isParamInAnnotation(editorContentBreakdown);
        } 
        return annotationIsThere;
    };

    var __listenToEditorForInjectConfig = function(editor) {
        var __showWebBrowser = function() {
            var stepName = editor.getStepName();
            var content = contentManager.getEditorContents(stepName);
            if (__checkInjectionEditorContent(content)) {
                editor.closeEditorErrorBox(stepName);
                //contentManager.showBrowser(stepName, 0);
                //contentManager.addRightSlideClassToBrowser(stepName, 0);
                contentManager.markCurrentInstructionComplete(stepName);
                //contentManager.updateWithNewInstructionNoMarkComplete(stepName);
            } else {
                // display error and provide link to fix it
                editor.createErrorLinkForCallBack(true, __addInjectConfigToEditor);
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
        var injectConfig = "    @Inject @ConfigProperty(name=\"download_url\", defaultValue=\"ftp://music.com/us-east/download\")";
        if (!stepName) {   
           stepName = stepContent.getCurrentStepName();
        }
        // reset content every time property is added through the button so as to clear out any manual editing
        contentManager.resetEditorContents(stepName);
        var content = contentManager.getEditorContents(stepName);

        contentManager.replaceEditorContents(stepName, 10, 10, injectConfig, 1);
        var readOnlyLines = [];
        readOnlyLines.push({from: 1, to: 9}, {from: 11, to: 12});
        contentManager.markEditorReadOnlyLines(stepName, readOnlyLines);       
    };
    
    var downloadMusicUrl = "https://music.com/play";

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
        listenToEditorForSystemProperties: __listenToEditorForSystemProperties,
        listenToBrowserForPropFileConfig: __listenToBrowserForPropFileConfig,
        listenToBrowserForServerEnvConfig: __listenToBrowserForServerEnvConfig,
        listenToBrowserForSystemPropConfig: __listenToBrowserForSystemPropConfig,
        addPropToConfigProps: __addPropToConfigProps,
        addPropToServerEnvButton: __addPropToServerEnvButton,
        addPropToSystemProperties: __addPropToSystemProperties,
        refreshBrowserButton: __refreshBrowserButton,
        saveButton: __saveButton,
        saveTabbedEditorButton: __saveTabbedEditorButton,
        listenToEditorTabChange: __listenToEditorTabChange,
        listenToEditorForInjectConfig: __listenToEditorForInjectConfig,
        addConfigInjectButton: __addConfigInjectButton,
        listenToBrowserForDefaultConfig:  __listenToBrowserForDefaultConfig,
        populateURL:  __populateURL,
        enterButtonURL: __enterButtonURL
    };

})();
