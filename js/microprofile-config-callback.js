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

    var mpconfigMessages = microprofileConfigMessages.returnMessages();
    var propsFileConfig = "port=9081";
    var propsFileName = "META-INF/microprofile-config.properties";
    
    /*
    *  Checks that the correct content was entered in META-INF/microprofile-config.properties
    */
    var __checkConfigPropsFile = function(content) {
        var match = false;
        try {
            if(content.match(/\s*port=9081\s*$/g)){
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
            if (content.match(/\s*port=9083\s*$/g)) {
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

             if(content.match(/\s*port=9081\s*config_ordinal=500\s*$/g)){
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
                var index = contentManager.getCurrentInstructionIndex(stepName);
                editor.addCodeUpdated();
                if(index === 0){
                    var stepBrowser = contentManager.getBrowser(stepName);
                    stepBrowser.contentRootElement.trigger("click");
    
                    contentManager.markCurrentInstructionComplete(stepName);
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
    var serverEnvDownloadUrlConfig = "port=9082";
    var serverEnvFileName = "server.env";
    var __checkServerEnvContent = function(content) {
        var match = false;
        try {
            if (content.match(/\s*port=9082\s*$/g)) {
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

                var index = contentManager.getCurrentInstructionIndex(stepName);
                editor.addCodeUpdated();
                if(index === 0){
                    var stepBrowser = contentManager.getBrowser(stepName);
                    stepBrowser.contentRootElement.trigger("click");
    
                    contentManager.markCurrentInstructionComplete(stepName);
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

                var index = contentManager.getCurrentInstructionIndex(stepName);
                editor.addCodeUpdated();
                if(index === 0){
                    var stepBrowser = contentManager.getBrowser(stepName);
                    stepBrowser.contentRootElement.trigger("click");
    
                    contentManager.markCurrentInstructionComplete(stepName);
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

                var index = contentManager.getCurrentInstructionIndex(stepName);
                editor.addCodeUpdated();
                if(index === 0){
                    var stepBrowser = contentManager.getBrowser(stepName);
                    stepBrowser.contentRootElement.trigger("click");
    
                    contentManager.markCurrentInstructionComplete(stepName);
                }
            } else {
                // display error and provide link to fix it
		        editor.createErrorLinkForCallBack(true, __addConfigOrdinalToProps);
            }
        };
        editor.addSaveListener(__showWebBrowser);
    };


    var __addPropToConfigProps = function(stepName) {
        if (stepName === undefined) {
            stepName = stepContent.getCurrentStepName();
        }
        // reset content every time property is added through the button so as to clear out any manual editing
        contentManager.focusTabbedEditorByName(stepName, propsFileName);
        contentManager.resetTabbedEditorContents(stepName, propsFileName);
        contentManager.replaceTabbedEditorContents(stepName, propsFileName, 1, 1, propsFileConfig);
    };

    var __addPropToConfigPropsButton = function(event, stepName) {
        if (event.type === "click" ||
           (event.type === "keypress" && (event.which === 13 || event.which === 32))) {
            // Click or 'Enter' or 'Space' key event...
            __addPropToConfigProps(stepName);
        }
    };

    var __addConfigOrdinalToProps = function(stepName) {
        if (stepName === undefined) {
            stepName = stepContent.getCurrentStepName();
        }
        var configOrdinal = "config_ordinal=500";
        // reset content every time property is added through the button so as to clear out any manual editing
        contentManager.focusTabbedEditorByName(stepName, propsFileName);
        contentManager.resetTabbedEditorContents(stepName, propsFileName );
        contentManager.replaceTabbedEditorContents(stepName, propsFileName, 2, 2, configOrdinal);
    };

    var __addConfigOrdinalToPropsButton = function(event, stepName) {
        if (event.type === "click" ||
           (event.type === "keypress" && (event.which === 13 || event.which === 32))) {
            // Click or 'Enter' or 'Space' key event...
            __addConfigOrdinalToProps(stepName);
        }
    };

    var __addPropToServerEnv = function(stepName) {
        if (stepName === undefined) {
            stepName = stepContent.getCurrentStepName();
        }
        // reset content every time property is added through the button so as to clear out any manual editing
        contentManager.focusTabbedEditorByName(stepName, serverEnvFileName);
        contentManager.resetTabbedEditorContents(stepName, serverEnvFileName);
        contentManager.replaceTabbedEditorContents(stepName, serverEnvFileName, 1, 1, serverEnvDownloadUrlConfig);
    };    

    var systemPropsFileName = "bootstrap.properties";
    var systemPropsDownloadUrlConfig = "port=9083";
    var __addPropToSystemProperties = function(stepName) {
        if (stepName === undefined) {
            stepName = stepContent.getCurrentStepName();
        }
        // reset content every time property is added through the button so as to clear out any manual editing
        contentManager.focusTabbedEditorByName(stepName, systemPropsFileName);
        contentManager.resetTabbedEditorContents(stepName, systemPropsFileName);
        contentManager.replaceTabbedEditorContents(stepName, systemPropsFileName, 1, 1, systemPropsDownloadUrlConfig);
    };

    var __addPropToSystemPropertiesButton = function(event, stepName) {
        if (event.type === "click" ||
           (event.type === "keypress" && (event.which === 13 || event.which === 32))) {
            // Click or 'Enter' or 'Space' key event...
            __addPropToSystemProperties(stepName);
        }
    };

    var __listenToBrowserForPropFileConfig = function(webBrowser) {
        var setBrowserContent = function(currentURL) {
            if (contentManager.getCurrentInstructionIndex(webBrowser.getStepName()) === 1) {
                webBrowser.contentRootElement.trigger("click");
                webBrowser.setBrowserContent("/guides/iguide-microprofile-config/html/interactive-guides/microprofile-config/download-from-properties-file.html");
                webBrowser.setBrowserStatusBar(mpconfigMessages.RETRIEVED_DATA);
                contentManager.markCurrentInstructionComplete(webBrowser.getStepName());
            }
        }
        webBrowser.addUpdatedURLListener(setBrowserContent);
    };

    var __listenToBrowserForServerEnvConfig = function(webBrowser) {
        var setBrowserContent = function(currentURL) {
            if (contentManager.getCurrentInstructionIndex(webBrowser.getStepName()) === 1) {
                webBrowser.contentRootElement.trigger("click");
                webBrowser.setBrowserContent("/guides/iguide-microprofile-config/html/interactive-guides/microprofile-config/download-from-property-in-server-env.html");
                webBrowser.setBrowserStatusBar(mpconfigMessages.RETRIEVED_DATA_QA);
                contentManager.markCurrentInstructionComplete(webBrowser.getStepName());
            }
        }
        webBrowser.addUpdatedURLListener(setBrowserContent);
    };

    var __listenToBrowserForSystemPropConfig = function(webBrowser) {
        var setBrowserContent = function(currentURL) {
            if (contentManager.getCurrentInstructionIndex(webBrowser.getStepName()) === 1) {
                webBrowser.contentRootElement.trigger("click");
                webBrowser.setBrowserContent("/guides/iguide-microprofile-config/html/interactive-guides/microprofile-config/download-from-property-in-system-props.html");
                webBrowser.setBrowserStatusBar(mpconfigMessages.RETRIEVED_DATA_PROD);
                contentManager.markCurrentInstructionComplete(webBrowser.getStepName());
            }
        }
        webBrowser.addUpdatedURLListener(setBrowserContent);
    };

    var __addPropToServerEnvButton = function(event, stepName) {
        if (event.type === "click" ||
           (event.type === "keypress" && (event.which === 13 || event.which === 32))) {
            // Click or 'Enter' or 'Space' key event...
            __addPropToServerEnv(stepName);
        }
    };

    var __refreshBrowserButton = function(event, stepName) {
        if (event.type === "click" ||
           (event.type === "keypress" && (event.which === 13 || event.which === 32))) {
           // Click or 'Enter' or 'Space' key event...
           if (stepName === undefined) {
               stepName = stepContent.getCurrentStepName();
           }
           contentManager.refreshBrowser(stepName);
        }
    };

    var __saveTabbedEditorButton = function(event, stepName) {
        if (event.type === "click" ||
           (event.type === "keypress" && (event.which === 13 || event.which === 32))) {
            // Click or 'Enter' or 'Space' key event...
            if (stepName === undefined) {
                stepName = stepContent.getCurrentStepName();
            }
            var editorFileName;
            if(stepName === "EnableMPConfig") {
                editorFileName = "server.xml";
            } else if(stepName === "ConfigureViaInject"){
                editorFileName = configEditorFileName;
            } else if(stepName === "InjectWithDefaultValue"){
                editorFileName = configEditorFileName;
            } else if (stepName === "ConfigureAsEnvVar") {
                editorFileName = serverEnvFileName;
            } else if ((stepName === "ConfigurePropsFile") || (stepName === "UpdateOrdinal")) {
                editorFileName = "META-INF/microprofile-config.properties";
            } else if (stepName === "ConfigureAsSysProp") {
                editorFileName = "bootstrap.properties";
            }
            if (editorFileName) {
                contentManager.saveTabbedEditor(stepName, editorFileName);
            }
        }
    };

    var __getInjectionConfigContent = function(content) {
        var annotationParams = null;
        try {
            // match
            // public class InventoryConfig {
            //   <space or newline here>
            // @Inject @ConfigProperty(name=\"port\", defaultValue=\"9080\")
            // private int port;
            var contentToMatch = "[\\s\\S]*public class InventoryConfig {\\s*@Inject\\s*@ConfigProperty\\s*\\(([\\s\\S]*)\\)\\s*private int port;";
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

            if ((param1 === "name=\"port\"" &&
                 param2 === "defaultValue=\"9080\"") ||
                (param2 === "name=\"port\"" &&
                 param1 === "defaultValue=\"9080\"")) {
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
            var content = contentManager.getTabbedEditorContents(stepName, configEditorFileName);
            if (__checkDefaultInjectionEditorContent(content)) {
                editor.closeEditorErrorBox(stepName);
                editor.addCodeUpdated();
                var stepBrowser = contentManager.getBrowser(stepName);
                stepBrowser.contentRootElement.trigger("click");

                contentManager.markCurrentInstructionComplete(stepName);
            } else {
                // display error and provide link to fix it
                editor.createErrorLinkForCallBack(true, __addInjectDefaultConfigToEditor);
            }
        };
        editor.addSaveListener(__showWebBrowser);
    };

    var serverXmlFileName = "server.xml";
    var __listenToEditorForFeatureInServerXML = function(editor) {      
      var __saveServerXML = function() {
        var stepName = editor.getStepName();
        var content = contentManager.getTabbedEditorContents(stepName, serverXmlFileName);
        if (__checkMicroProfileConfigFeatureContent(content)) {
            editor.addCodeUpdated();
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

    var __addMicroProfileConfigFeatureButton = function(event, stepName) {
      if (event.type === "click" ||
         (event.type === "keypress" && (event.which === 13 || event.which === 32))) {
          // Click or 'Enter' or 'Space' key event...
          __addMicroProfileConfigFeature(stepName);
      }
    };

    var __addMicroProfileConfigFeature = function(stepName) {
        if (stepName === undefined) {
            stepName = stepContent.getCurrentStepName();
         }
        var ConfigFeature = "      <feature>mpConfig-1.1</feature>";
        // reset content every time feature is added through the button to clear manual editing
        contentManager.resetTabbedEditorContents(stepName, serverXmlFileName);
        var content = contentManager.getTabbedEditorContents(stepName, serverXmlFileName);
        contentManager.replaceTabbedEditorContents(stepName, serverXmlFileName, 6, 6, ConfigFeature);
    };

    var __addInjectDefaultConfigButton = function(event, stepName) {
        if (event.type === "click" ||
        (event.type === "keypress" && (event.which === 13 || event.which === 32))) {
            // Click or 'Enter' or 'Space' key event...
            __addInjectDefaultConfigToEditor(stepName);
        }
    };
    
    var __addInjectDefaultConfigToEditor = function(stepName) {
        // Put the BankService.java editor into focus.
        contentManager.focusTabbedEditorByName(stepName, configEditorFileName);

        var injectConfig = "    @Inject @ConfigProperty(name=\"port\", \n" +
                           "                            defaultValue=\"9080\")";
        if (stepName === undefined) {
           stepName = stepContent.getCurrentStepName();
        }
        // reset content every time property is added through the button so as to clear out any manual editing
        contentManager.resetTabbedEditorContents(stepName, configEditorFileName);
        var content = contentManager.getTabbedEditorContents(stepName, configEditorFileName);

        contentManager.replaceTabbedEditorContents(stepName, configEditorFileName, 9, 9, injectConfig, 2);
        var readOnlyLines = [];
        readOnlyLines.push({from: 1, to: 8}, {from: 11, to: 16});
        contentManager.markEditorReadOnlyLines(stepName, readOnlyLines);
    };

    var carsUrl = "https://mycarvendor.openliberty.io/car-types";

    var __populateURL = function(event, stepName) {
        if (event.type === "click" ||
           (event.type === "keypress" && (event.which === 13 || event.which === 32))) {
               // Click or 'Enter' or 'Space' key event...
            contentManager.setBrowserURL(stepName, carsUrl);
        }
    };

    var __listenToBrowserForInjectDefaultConfig = function(webBrowser) {
        var setBrowserContent = function(currentURL) {
            webBrowser.contentRootElement.trigger("click");

            // Check if URL is correct before loading content
            if(webBrowser.getURL() === "https://mycarvendor.openliberty.io/car-types"){
                var instructionIdx = contentManager.getCurrentInstructionIndex(webBrowser.getStepName());
                if (instructionIdx === 1) {
                    webBrowser.setBrowserContent("/guides/iguide-microprofile-config/html/interactive-guides/microprofile-config/download-from-injection.html");
                    webBrowser.setBrowserStatusBar(mpconfigMessages.RETRIEVED_DATA_DEV);
                    contentManager.markCurrentInstructionComplete(webBrowser.getStepName());
                }
            }
        }
        webBrowser.addUpdatedURLListener(setBrowserContent);
    };

    var __listenToEditorForInjectConfig = function(editor) {
        var __showPodWithDeploymentException = function() {
            var stepName = editor.getStepName();
            var content = contentManager.getTabbedEditorContents(stepName, configEditorFileName);
            if (__checkInjectionEditorContent(content)) {
                editor.closeEditorErrorBox(stepName);
                editor.addCodeUpdated();
                contentManager.markCurrentInstructionComplete(stepName);
                var stepWidgets = stepContent.getStepWidgets(stepName);
                // The pod is currently hidden.  Resize the stepWidgets so the pod will be shown.
                // You must indicate to make the "pod" the activeWidget (parameter two) so that 
                // the code in resizeStepWidgets will un-hide the pod.
                stepContent.resizeStepWidgets(stepWidgets, "pod", true);
                contentManager.setPodContentWithSlideUp(stepName,
                    "<p  class='errorSyntaxCss'>" +  mpconfigMessages.EXCEPTION1 +  "<span style='color:red'>" + mpconfigMessages.EXCEPTION2 + " CWMCG5003E</span>" +  mpconfigMessages.EXCEPTION3 +
                    "</p>"
                );
                // Unfortunately, making the pod the active widget allowed our disabled browser
                // to be full size because of the way the resizeStepWidgets was written.  Therefore,
                // make the "tabbedEditor" the activeWidget now so that it remains full size since
                // it should be seen, not the disabled browser.
                stepContent.resizeStepWidgets(stepWidgets, "tabbedEditor");
            } else {
                // display error
                editor.createErrorLinkForCallBack(true, __addInjectConfigToEditor);
            }
        };
        editor.addSaveListener(__showPodWithDeploymentException);
    };

    var __isInjectParamInAnnotation = function(annotationParams) {
        var allMatch = false;
        if (annotationParams.length === 1) {
            var param1 = annotationParams[0];

            if (param1 === "name=\"port\"") {
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

    var __addInjectConfigButton = function(event, stepName) {
        if (event.type === "click" ||
        (event.type === "keypress" && (event.which === 13 || event.which === 32))) {
            // Click or 'Enter' or 'Space' key event...
            __addInjectConfigToEditor(stepName);
        }
    };

    var configEditorFileName = "InventoryConfig.java";
    var __addInjectConfigToEditor = function(stepName) {
        // Put the BankService.java editor into focus.
        contentManager.focusTabbedEditorByName(stepName, configEditorFileName);

        var injectConfig = "    @Inject @ConfigProperty(name=\"port\")";
        if (stepName === undefined) {
           stepName = stepContent.getCurrentStepName();
        }
        // reset content every time property is added through the button so as to clear out any manual editing
        contentManager.resetTabbedEditorContents(stepName, configEditorFileName);
        var content = contentManager.getTabbedEditorContents(stepName, configEditorFileName);

        contentManager.replaceTabbedEditorContents(stepName, configEditorFileName, 9, 9, injectConfig);
        var readOnlyLines = [];
        readOnlyLines.push({from: 1, to: 8}, {from: 10, to: 15});
        contentManager.markEditorReadOnlyLines(stepName, readOnlyLines);
    };

    var __createPlayground = function(root, stepName) {
        // If root is not a jQuery element, get the jQuery element from the root object passed in
        if(!root.selector){
            root = root.contentRootElement;
        }

        var pg = playground.create(root, stepName);
        var populateContents = function() {
            // Wait until all 4 editors have been loaded to call update the properties so the editors have time to load
            setTimeout(function(){
                try {
                    pg.repopulatePlaygroundConfigs();
                } catch (e) {
                    console.log(mpconfigMessages.RETRYING_MESSAGE);
                    populateContents();
                }            
            }, 250);
        }
        populateContents();
        root.playground = pg;

        contentManager.setPlayground(stepName, pg, 0);
    };

    var updatePlaygroundProperties = function(editor) {
        var __populateProperties = function(editorInstance, editor) {
            editorInstance.addCodeUpdated();
            var pg = contentManager.getPlayground(editorInstance.getStepName());
            pg.repopulatePlaygroundConfigs();
        };
        editor.addSaveListener(__populateProperties);
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
        addPropToConfigProps: __addPropToConfigProps,       
        addPropToConfigPropsButton: __addPropToConfigPropsButton, 
        addPropToServerEnvButton: __addPropToServerEnvButton,
        addPropToSystemProperties: __addPropToSystemProperties,
        addPropToSystemPropertiesButton: __addPropToSystemPropertiesButton,
        addConfigOrdinalToProps: __addConfigOrdinalToProps,
        addConfigOrdinalToPropsButton: __addConfigOrdinalToPropsButton,
        addInjectConfigButton: __addInjectConfigButton,
        addInjectDefaultConfigButton: __addInjectDefaultConfigButton,
        listenToEditorForFeatureInServerXML: __listenToEditorForFeatureInServerXML,
        addMicroProfileConfigFeatureButton: __addMicroProfileConfigFeatureButton,
        refreshBrowserButton: __refreshBrowserButton,
        saveTabbedEditorButton: __saveTabbedEditorButton,
        populateURL:  __populateURL,
        createPlayground: __createPlayground,
        updatePlaygroundProperties: updatePlaygroundProperties
    };

})();
