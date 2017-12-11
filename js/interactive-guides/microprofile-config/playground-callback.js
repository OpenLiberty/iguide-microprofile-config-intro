var playground = function(){
    var STEP_NAME = 'DefaultPlayground';
    var JAVA_FILE = 'CarTypes.java';
    var PROP_FILE = '/META-INF/microprofile-config.properties';
    var ENV_FILE = 'server.env';
    var SYS_FILE = 'bootstrap.properties';

    var properties = {};
    var staging = [];
    var fileOrdinals = {};

    var _playground = function(root, stepName) {
        this.root = root;
        this.stepName = stepName;
    };

    _playground.prototype = {
        /**
         * 
         * @param {String} key - the name of the property
         * @param {String} value - the value of the property
         * @param {String} source - 'inject', 'propFile', 'envVar', 'sysProp'
         * @param {*} ordinal (optional) - provided ordinal number. otherwise default based on source
         */
        playgroundAddConfig: function(key, value, source, ordinal) {
            if (!ordinal) {
                ordinal = this.__getDefaultOrdinal(source);
            }

            if (properties[key]) {
                var oldOrdinal = properties[key].ordinal;
                if (parseInt(ordinal) >= parseInt(oldOrdinal)) {
                    properties[key] = {'ordinal': ordinal, 'value': value};
                }
            } else {
                properties[key] = {'ordinal': ordinal, 'value': value};
            }
        },

        /**
         * Clear all properties and error messages, and read/parse all files for properties again
         */
        repopulatePlaygroundConfigs: function() {
            properties = {};
            fileOrdinals = {};
            this.__clearErrorMessage();

            this.__getInjectionProperties(JAVA_FILE);
            this.__getPropertiesFileProperties(PROP_FILE);
            this.__getEnvironmentProperties(ENV_FILE);
            this.__getSystemProperties(SYS_FILE);
            this.showProperties();
        },

        __getInjectionProperties: function(fileName) {
            var injectionContent = contentManager.getTabbedEditorContents(STEP_NAME, fileName);

            // Use regex global search to find and store all indices of matches.
            // Makes sure we have @Inject and @ConfigProperty
            var regexp = /@Inject\s+@ConfigProperty/g;
            var match, matches = [];
            while ((match = regexp.exec(injectionContent)) != null) {
                matches.push(match.index);
            }
            
            // For each match, grab string until end of Java code line (including lines split for readability).
            var lines = [];
            for (var i in matches) {
                var content = injectionContent.substring(matches[i]);
                var endLine = content.indexOf(';');
                var line = content.substring(0, endLine).replace(/\n/g, ''); //remove newline characters
                lines.push(line);
            }

            // For each line, grab config value and properties
            for (var i in lines) {
                var lineRegexp = /\(.*(?=\))/;  //grab everything in between the parentheses
                var propertyLine = lineRegexp.exec(lines[i]);

                if (propertyLine) {
                    var inlineProperties = propertyLine[0];
                    var nameRegexp = /name="(.*?)"/g; //match 'name' property, with the property value as substring match
                    var defaultValueRegexp = /defaultValue="(.*?)"/g; //match 'defaultValue' property, with the property value as substring match
                    var name = nameRegexp.exec(inlineProperties);
                    var defaultValue = defaultValueRegexp.exec(inlineProperties);
                    if (name && defaultValue) {
                        //index 1 is the regex substring match which contains the value of the match
                        this.playgroundAddConfig(name[1], defaultValue[1], 'inject'); 
                    }
                }
            }
        },

        __getPropertiesFileProperties: function(fileName) {
            var editorInstance = this.__getEditorInstance(fileName);
            this.__parseAndStorePropertyFiles(fileName, 'propFile');
        },

        __getEnvironmentProperties: function(fileName) {
            var editorInstance = this.__getEditorInstance(fileName);
            this.__parseAndStorePropertyFiles(fileName, 'envVar');
        },

        __getSystemProperties: function(fileName) {
            var editorInstance = this.__getEditorInstance(fileName);
            this.__parseAndStorePropertyFiles(fileName, 'sysProp');
        },

        /**
         * Parse properties files and store them.
         */
        __parseAndStorePropertyFiles: function(filename, filetype) {
            var fileContent = contentManager.getTabbedEditorContents(STEP_NAME, filename);
            
            if (fileContent) {
                var regex = /^[ \t]*(.+?)[ \t]*[=: ][ \t]*(.+$)/gm; // match all key value pairs
                var match = null;
                var ordinal;
                while ((match = regex.exec(fileContent)) !== null) {
                    var key = match[1].trim();
                    var value = match[2];
                    if (key === 'config_ordinal') {
                        //TODO: what if ordinal has already been set? (multiple config_ordinal keys)
                        ordinal = value;
                        this.__setFileOrdinal(filetype, ordinal);
                    } else if (key.match(/^[!#].*/) !== null) {
                        // ignore lines that start with ! or # for comments
                        // all non-valid property lines are already ignored
                        continue;
                    } else {
                        this.__stageConfigProperty(key, value);                        
                    }
                }

                this.__storeStagedProperties(filetype, ordinal);
            }
        },
        
        /**
         * Temporarily hold properties.
         * Used while parsing properties files and waiting to encounter `config_ordinal`
         */
        __stageConfigProperty: function(key, value) {
            staging.push([key, value]);
        },

        /**
         * Store properties.
         * Used after parsing properties files and checked for existence of `config_ordinal`
         */
        __storeStagedProperties: function(source, ordinal) {
            for (var i in staging) {
                var key = staging[i][0];
                var value = staging[i][1];
                if (this.getProperty(key) !== null) {
                    this.playgroundAddConfig(key, value, source, ordinal);
                } else {
                    var message = 'The property <b>' + key + '</b> needs to be set with @Inject in Java file';
                    this.__displayErrorMessage(message);
                }
            }
            staging = [];
        },

        /**
         * Display final properties and values in pod
         */
        showProperties: function() {
            var props = this.getProperties();
            var propsDiv = this.root.find('.properties');
            propsDiv.empty();
            for (var key in props) {
                var prop = $('<li>');
                prop.html(key + ' - ' + props[key].value);
                propsDiv.append(prop);
            }
        },

        __getDefaultOrdinal: function(source) {
            switch(source) {
            case 'inject': return '0';
            case 'propFile': return '100';
            case 'envVar': return '300';
            case 'sysProp': return '400';
            default: return '0';
            }
        },

        __setFileOrdinal: function(filetype, ordinal) {
            fileOrdinals[filetype] = ordinal;
        },

        __getFileOrdinal: function(filetype) {
            if (fileOrdinals[filetype]) {
                return fileOrdinals[filetype];
            } else {
                return __getDefaultOrdinal(filetype);
            }
        },

        __getFileName: function(filetype) {
            switch(filetype) {
                case 'inject': return JAVA_FILE;
                case 'propFile': return PROP_FILE;
                case 'envVar': return ENV_FILE;
                case 'sysProp': return SYS_FILE;
                default: return null;
            }
        },

        getProperties: function() {
            return properties;
        },
        
        getProperty: function(key) {
            if (properties[key]) {
                return properties[key];
            } else {
                return null;
            }
        },
        
        __getEditorInstance: function(fileName) {
            if (contentManager.getEditorInstanceFromTabbedEditor) {
                return contentManager.getEditorInstanceFromTabbedEditor(STEP_NAME, fileName);
            }
        },

        /**
         * Displays error message across all the files in the tabbedEditor
         * TODO: possibly move this functionality into commons code, make sure to ignore readonly editors
         */
        __displayErrorMessage: function(message) {
            var javaEditor = this.__getEditorInstance(JAVA_FILE);
            var propEditor = this.__getEditorInstance(PROP_FILE);
            var envEditor = this.__getEditorInstance(ENV_FILE);
            var sysEditor = this.__getEditorInstance(SYS_FILE);

            javaEditor.createCustomErrorMessage(message);
            propEditor.createCustomErrorMessage(message);
            envEditor.createCustomErrorMessage(message);
            sysEditor.createCustomErrorMessage(message);
        },

        /**
         * Clears all error messages across all the files in tabbedEditor
         * TODO: possibly move this functionality into commons code, make sure to ignore readonly editors
         */
        __clearErrorMessage: function() {
            var javaEditor = this.__getEditorInstance(JAVA_FILE);
            var propEditor = this.__getEditorInstance(PROP_FILE);
            var envEditor = this.__getEditorInstance(ENV_FILE);
            var sysEditor = this.__getEditorInstance(SYS_FILE);

            javaEditor.closeEditorErrorBox();
            propEditor.closeEditorErrorBox();
            envEditor.closeEditorErrorBox();
            sysEditor.closeEditorErrorBox();
        }
    };

    var _create = function(root, stepName){
        return new _playground(root, stepName);
    };

    return {
        create: _create
    };
}();
