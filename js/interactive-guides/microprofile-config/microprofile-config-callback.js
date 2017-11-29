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
    var propsFileName = "META-INF/microprofile-config.properties";
    /*
    *  Checks that the correct content was entered in META-INF/microprofile-config.properties
    */
    var __checkConfigPropsFile = function(content) {
        var match = false;
        try {
            if(content.match(/\s*download_url=ftp:\/\/music.com\/us-south\/download\s*$/g)){
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
            if (content.match(/WLP_SKIP_MAXPERMSIZE=true\s*download_url=ftp:\/\/music.com\/asia\/download\s*$/g)) {
                match = true;
            }
        }
        catch (e) {

        }
        return match;
     };

     var __checkConfigOrdinalProp = function(content) {
         var match = false;
         try {

             if(content.match(/\s*download_url=ftp:\/\/music.com\/us-south\/download\s*config_ordinal=500\s*$/g)){
                 match = true;
             }
         }
         catch (e) {

         }
         return match;
     };

    /*
    *  Adds a save listener to the editor, and gives a callback to handle changing the browser and instructions if the content entered in the
    *  META-INF/microprofile-config.properties editor was right.
    */
    var __listenToEditorForPropConfig = function(editor) {
        var __showWebBrowser = function() {
            var stepName = editor.getStepName();
            var content = contentManager.getTabbedEditorContents(stepName, propsFileName);
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

    /*
     * Callback and functions to support Configuring steps.
     */
    var serverEnvDownloadUrlConfig = "download_url=ftp://music.com/us-west/download";
    var serverEnvFileName = "server.env";
    var __checkServerEnvContent = function(content) {
        var match = false;
        try {
            if (content.match(/WLP_SKIP_MAXPERMSIZE=true\s*download_url=ftp:\/\/music.com\/us-west\/download\s*$/g)) {
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

    /*
    *  Adds a save listener to the editor for 'Changing ordinal of ConfigSource' step
    */
    var __listenToEditorForOrdinalChange = function(editor) {
        var __showWebBrowser = function() {
            var stepName = editor.getStepName();
            var content = contentManager.getTabbedEditorContents(stepName, propsFileName);
            if (__checkConfigOrdinalProp(content)) {
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
		editor.createErrorLinkForCallBack(true, __addConfigOrdinalToProps);
            }
        };
        editor.addSaveListener(__showWebBrowser);
    };


    var __addPropToConfigProps = function() {
        var stepName = stepContent.getCurrentStepName();
        // reset content every time property is added through the button so as to clear out any manual editing
        contentManager.resetTabbedEditorContents(stepName, propsFileName);
        contentManager.replaceTabbedEditorContents(stepName, propsFileName, 1, 1, propsFileConfig);
    };

    var __addConfigOrdinalToProps = function() {
        var stepName = stepContent.getCurrentStepName();
        var configOrdinal = "config_ordinal=500";
        // reset content every time property is added through the button so as to clear out any manual editing
        contentManager.resetTabbedEditorContents(stepName, propsFileName );
        contentManager.replaceTabbedEditorContents(stepName, propsFileName, 2, 2, configOrdinal);
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
            } else if ((stepName === "ConfigurePropsFile") || (stepName === "UpdateOrdinal")) {
                editorFileName = "META-INF/microprofile-config.properties";
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
            // public class Music-download {
            //   <space or newline here>
            // @Inject @ConfigProperty(name=\"download_url\", defaultValue=\"ftp://music.com/us-east/download\")
            // private String downloadUrl;
            var contentToMatch = "[\\s\\S]*public class Music-download {\\s*@Inject\\s*@ConfigProperty\\s*\\(([\\s\\S]*)\\)\\s*private String downloadUrl;";
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

    var __isDefaultInjectParamInAnnotation = function(annotationParams) {
        var allMatch = false;
        if (annotationParams.length === 2) {
            var param1 = annotationParams[0];
            var param2 = annotationParams[1];

            if ((param1 === "name=\"download_url\"" &&
                 param2 === "defaultValue=\"ftp:\/\/music.com\/us-east\/download\"") ||
                (param2 === "name=\"download_url\"" &&
                 param1 === "defaultValue=\"ftp:\/\/music.com\/us-east\/download\"")) {
                allMatch = true;
            }
        }
        return allMatch;
    }

    var __checkDefaultInjectionEditorContent = function(content) {
        var annotationIsThere = false;
        var editorContentBreakdown = __getInjectionConfigContent(content);
        if (editorContentBreakdown !== null) {
            annotationIsThere = __isDefaultInjectParamInAnnotation(editorContentBreakdown);
        }
        return annotationIsThere;
    };

    var __listenToEditorForInjectDefaultConfig = function(editor) {
        var __showWebBrowser = function() {
            var stepName = editor.getStepName();
            var content = contentManager.getEditorContents(stepName);
            if (__checkDefaultInjectionEditorContent(content)) {
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
                editor.createErrorLinkForCallBack(true, __addInjectDefaultConfigToEditor);
            }
        };
        editor.addSaveListener(__showWebBrowser);
    };

    var __listenToEditorForFeatureInServerXML = function(editor) {
      var __saveServerXML = function() {
        var stepName = stepContent.getCurrentStepName();
        var content = contentManager.getEditorContents(stepName);
        if (__checkMicroProfileConfigFeatureContent(content)) {
            var stepName = stepContent.getCurrentStepName();
            contentManager.markCurrentInstructionComplete(stepName);
        } else {
            // display error to fix it
            editor.createErrorLinkForCallBack(true, __addMicroProfileConfigFeature);
        }
      };
      editor.addSaveListener(__saveServerXML);
    };

    var __getMicroProfileConfigFeatureContent = function(content) {
      var editorContents = {};
      try {
          // match
          // <?xml version="1.0"?>
          // ...
          // <feature>jaxrs-2.0</feature>
          //    <anything here>
          // </featureManager>
          // and capture groups to get content before <feature>jaxrs-2.0</feature>, the feature, and after
          // closing featureManager content tag.
          var featureManagerToMatch = "([\\s\\S]*)<feature>jaxrs-2.0</feature>([\\s\\S]*)<\\/featureManager>([\\s\\S]*)";
          var regExpToMatch = new RegExp(featureManagerToMatch, "g");
          var groups = regExpToMatch.exec(content);
          editorContents.beforeNewFeature = groups[1]; //includes <feature>jaxrs-2.0</feature>
          editorContents.features = groups[2];
          editorContents.afterFeature = groups[3];
      }
      catch (e) {

      }
      return editorContents;
    };


    var __isConfigInFeatures = function(features) {
         features = features.replace('\n', '');
         features = features.replace(/\s/g, ''); // Remove whitespace
         try {
            var featureMatches = features.match(/<feature>[\s\S]*?<\/feature>/g);
            if (features.length === "<feature>mpConfig-1.1</feature>".length) {
              //featureMatches should only contain the mpConfig-1.1 feature
              if (featureMatches[0] === "<feature>mpConfig-1.1</feature>") {
                return true;
              }
            }
            return false;
         }
         catch (e) {

         }
    };

    var __checkMicroProfileConfigFeatureContent = function(content) {
        var isConfigFeatureThere = false;
        var editorContentBreakdown = __getMicroProfileConfigFeatureContent(content);
        if (editorContentBreakdown.hasOwnProperty("features")) {
          //verify that mpConfig-1.1 feature was added
          isConfigFeatureThere =  __isConfigInFeatures(editorContentBreakdown.features);
        }
        return isConfigFeatureThere;
    };

    var __addMicroProfileConfigFeatureButton = function(event) {
      if (event.type === "click" ||
         (event.type === "keypress" && (event.which === 13 || event.which === 32))) {
          // Click or 'Enter' or 'Space' key event...
          __addMicroProfileConfigFeature();
      }
    };

    var __addMicroProfileConfigFeature = function() {

        var ConfigFeature = "      <feature>mpConfig-1.1</feature>";
        var stepName = stepContent.getCurrentStepName();
        // reset content every time feature is added through the button to clear manual editing
        contentManager.resetEditorContents(stepName);
        var content = contentManager.getEditorContents(stepName);
        contentManager.replaceEditorContents(stepName, 6, 6, ConfigFeature, 1);
    };

    var __addInjectDefaultConfigButton = function(event) {
        if (event.type === "click" ||
        (event.type === "keypress" && (event.which === 13 || event.which === 32))) {
            // Click or 'Enter' or 'Space' key event...
            __addInjectDefaultConfigToEditor();
        }
    };

    var __addInjectDefaultConfigToEditor = function(stepName) {
        var injectConfig = "    @Inject @ConfigProperty(name=\"download_url\", defaultValue=\"ftp://music.com/us-east/download\")";
        if (!stepName) {
           stepName = stepContent.getCurrentStepName();
        }
        // reset content every time property is added through the button so as to clear out any manual editing
        contentManager.resetEditorContents(stepName);
        var content = contentManager.getEditorContents(stepName);

        contentManager.replaceEditorContents(stepName, 6, 6, injectConfig, 1);
        var readOnlyLines = [];
        readOnlyLines.push({from: 1, to: 5}, {from: 7, to: 12});
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

    var __listenToBrowserForInjectDefaultConfig = function(webBrowser) {
        var setBrowserContent = function(currentURL) {
            webBrowser.setBrowserContent("/guides/iguide-microprofile-config/html/interactive-guides/microprofile-config/download-from-injection.html");
            contentManager.markCurrentInstructionComplete(webBrowser.getStepName());
        }

        webBrowser.contentRootElement.addClass("hidden");
        webBrowser.addUpdatedURLListener(setBrowserContent);
    };

    var __listenToBrowserForInjectConfig = function(webBrowser) {
        var setBrowserContent = function(currentURL) {
            webBrowser.setBrowserContent("/guides/iguide-microprofile-config/html/interactive-guides/microprofile-config/download-deployment-exception.html");
            contentManager.markCurrentInstructionComplete(webBrowser.getStepName());
        }

        webBrowser.contentRootElement.addClass("hidden");
        webBrowser.addUpdatedURLListener(setBrowserContent);
    };

    var __listenToEditorForInjectConfig = function(editor) {
        var __showWebBrowser = function() {
            var stepName = editor.getStepName();
            var content = contentManager.getEditorContents(stepName);
            if (__checkInjectionEditorContent(content)) {
                editor.closeEditorErrorBox(stepName);
                contentManager.showBrowser(stepName, 0);
                contentManager.addRightSlideClassToBrowser(stepName, 0);
                //contentManager.markCurrentInstructionComplete(stepName);
                //contentManager.updateWithNewInstructionNoMarkComplete(stepName);

                var index = contentManager.getCurrentInstructionIndex();
                if(index === 0){
                    contentManager.markCurrentInstructionComplete(stepName);
                    contentManager.updateWithNewInstructionNoMarkComplete(stepName);
                }
            } else {
                // display error and provide link to fix it
                editor.createErrorLinkForCallBack(true, __addInjectConfigToEditor);
            }
        };
        editor.addSaveListener(__showWebBrowser);
    };

    var __isInjectParamInAnnotation = function(annotationParams) {
        var allMatch = false;
        if (annotationParams.length === 1) {
            var param1 = annotationParams[0];

            if (param1 === "name=\"download_url\"") {
                allMatch = true;
            }
        }
        return allMatch;
    }

    var __checkInjectionEditorContent = function(content) {
        var annotationIsThere = false;
        var editorContentBreakdown = __getInjectionConfigContent(content);
        if (editorContentBreakdown !== null) {
            annotationIsThere = __isInjectParamInAnnotation(editorContentBreakdown);
        }
        return annotationIsThere;
    };

    var __addInjectConfigButton = function(event) {
        if (event.type === "click" ||
        (event.type === "keypress" && (event.which === 13 || event.which === 32))) {
            // Click or 'Enter' or 'Space' key event...
            __addInjectConfigToEditor();
        }
    };

    var __addInjectConfigToEditor = function(stepName) {
        var injectConfig = "    @Inject @ConfigProperty(name=\"download_url\")";
        if (!stepName) {
           stepName = stepContent.getCurrentStepName();
        }
        // reset content every time property is added through the button so as to clear out any manual editing
        contentManager.resetEditorContents(stepName);
        var content = contentManager.getEditorContents(stepName);

        contentManager.replaceEditorContents(stepName, 6, 6, injectConfig, 1);
        var readOnlyLines = [];
        readOnlyLines.push({from: 1, to: 5}, {from: 7, to: 12});
        contentManager.markEditorReadOnlyLines(stepName, readOnlyLines);
    };

    return {
        listenToEditorForPropConfig: __listenToEditorForPropConfig,
        listenToEditorForServerEnv: __listenToEditorForServerEnv,
        listenToEditorForSystemProperties: __listenToEditorForSystemProperties,
        listenToEditorForOrdinalChange: __listenToEditorForOrdinalChange,
        listenToEditorForInjectDefaultConfig: __listenToEditorForInjectDefaultConfig,
        listenToEditorForInjectConfig: __listenToEditorForInjectConfig,
        listenToBrowserForPropFileConfig: __listenToBrowserForPropFileConfig,
        listenToBrowserForServerEnvConfig: __listenToBrowserForServerEnvConfig,
        listenToBrowserForSystemPropConfig: __listenToBrowserForSystemPropConfig,
        listenToBrowserForInjectDefaultConfig:  __listenToBrowserForInjectDefaultConfig,
        listenToBrowserForInjectConfig: __listenToBrowserForInjectConfig,
        listenToEditorTabChange: __listenToEditorTabChange,
        listenToEditorForInjectConfig: __listenToEditorForInjectConfig,
        addPropToConfigProps: __addPropToConfigProps,
        addPropToServerEnvButton: __addPropToServerEnvButton,
        addPropToSystemProperties: __addPropToSystemProperties,
        addConfigOrdinalToProps: __addConfigOrdinalToProps,
        addInjectConfigButton: __addInjectConfigButton,
        addInjectDefaultConfigButton: __addInjectDefaultConfigButton,
        listenToEditorForFeatureInServerXML: __listenToEditorForFeatureInServerXML,
        addMicroProfileConfigFeatureButton: __addMicroProfileConfigFeatureButton,
        refreshBrowserButton: __refreshBrowserButton,
        saveButton: __saveButton,
        saveTabbedEditorButton: __saveTabbedEditorButton,
        populateURL:  __populateURL,
        enterButtonURL: __enterButtonURL
    };

})();
