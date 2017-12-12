var playground = function(){
    var STEP_NAME = 'DefaultPlayground';
    var JAVA_FILE = 'CarTypes.java';
    var PROP_FILE = '/META-INF/microprofile-config.properties';
    var ENV_FILE = 'server.env';
    var SYS_FILE = 'bootstrap.properties';

    var FILETYPES = {'inject':'inject', 'propFile':'propFile', 'envVar':'envVar', 'sysProp':'sysProp'};

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
            if (!value && (source === FILETYPES.inject)) {
                ordinal = '-1'; //must be assigned elsewhere if no defaultValue
            } else if (!ordinal) {
                ordinal = this.__getDefaultOrdinal(source);
            }

            if (properties[key]) {
                var oldOrdinal = properties[key].ordinal;
                if (parseInt(ordinal) >= parseInt(oldOrdinal)) {
                    properties[key] = {'ordinal': ordinal, 'value': value, 'source': source};
                }
            } else {
                properties[key] = {'ordinal': ordinal, 'value': value, 'source': source};
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
            this.updateFigure();
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
                    var nameRegexp = /name\s*=\s*"(.*?)"/g; //match 'name' property, with the property value as substring match
                    var defaultValueRegexp = /defaultValue\s*=\s*"(.*?)"/g; //match 'defaultValue' property, with the property value as substring match
                    var name = nameRegexp.exec(inlineProperties);
                    var defaultValue = defaultValueRegexp.exec(inlineProperties);
                    if (name) {
                        //index 1 is the regex substring match which contains the value of the match
                        if (defaultValue) {
                            this.playgroundAddConfig(name[1], defaultValue[1], FILETYPES.inject);                            
                        } else {
                            this.playgroundAddConfig(name[1], '', FILETYPES.inject);                            
                        }
                    }
                }
            }
        },

        __getPropertiesFileProperties: function(fileName) {
            var editorInstance = this.__getEditorInstance(fileName);
            this.__parseAndStorePropertyFiles(fileName, FILETYPES.propFile);
        },

        __getEnvironmentProperties: function(fileName) {
            var editorInstance = this.__getEditorInstance(fileName);
            this.__parseAndStorePropertyFiles(fileName, FILETYPES.envVar);
        },

        __getSystemProperties: function(fileName) {
            var editorInstance = this.__getEditorInstance(fileName);
            this.__parseAndStorePropertyFiles(fileName, FILETYPES.sysProp);
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
                    var message = utils.formatString(mpconfigMessages.injectionRequired, [key]);
                    this.__displayErrorMessage(message);
                }
            }
            staging = [];
        },

        /**
         * Gets filename from the html of the property row in the table
         * and makes that file active in the tabbedEditor
         */
        __focusOnSourceTab: function(tableRow) {
            var cells = tableRow.querySelectorAll("td");
            var source = cells[2].innerText; //cells[2] - is the cell with the filename
            contentManager.focusTabbedEditorByName(STEP_NAME, source);
        },

        /**
         * Display final properties and values in pod
         */
        showProperties: function() {
            var props = this.getProperties();

            //create a table to display properties
            var propsTable = this.root.find('.propsTable');
            propsTable.empty();
            propsTable.append('<tr><th>Config property</th><th>Value</th><th>Source</th></tr></table>'); //adding the column headers

            for (var key in props) {
                if (parseInt(props[key].ordinal) < 0) {
                    this.__displayErrorMessage(utils.formatString(mpconfigMessages.valueRequired, [key]));
                } else {
                    var prop = $('<tr class="propertyRow">');
                    prop.append('<td>' + key + '</td>');
                    prop.append('<td>' + props[key].value + '</td>');
                    prop.append('<td>' + this.__getFileName(props[key].source) + '</td></tr>'); 
                    propsTable.append(prop);
                }
            }

            //add on click event to each row in the properties table
            //clicking the row will activate the respective source tab
            var propRows = this.root.find('tr.propertyRow');
            var thisPlayground = this;
            propRows.each(function() {
                $(this).on('click', function(e) {
                    thisPlayground.__focusOnSourceTab(this);
                });
            });
        },

        /* Updates the 4 config source cards and sorts them by their ordinal value with the highest ordinal being on top. */
        updateFigure: function(){           
            var order = this.__getOrdinalObjects();
            // Sort the config objects by ordinal
            order.sort(function(a, b){
                var ordinalA = parseInt(a.ordinal);
                var ordinalB = parseInt(b.ordinal);
                if(ordinalA > ordinalB){
                    return 1;
                }
                else if(ordinalA < ordinalB){
                    return -1;
                }
                // Equal ordinals
                return 0;
            });
            // Update the cards text and color
            for(var i = 0; i < order.length; i++){
                var configSource = order[i];
                // Find the card's span associated with this order
                var card = $('.ordinal-' + order[i].filetype);
                if(card.length > 0){
                    card.removeClass('ordinal-0 ordinal-1 ordinal-2 ordinal-3');
                    card.addClass('ordinal-' + i);

                    // Update the ordinal if there is one
                    if(configSource.ordinal > 0) {
                        card.find('.ordinalCardOrdinal').html('Ordinal = ' + configSource.ordinal);
                    }                    
                    // Change the background color to always match the card
                    card.css('background-color', configSource.bgcolor);

                    // Create a closure to keep track of each configSource so it doesn't use the last one for each card.
                    var closure = function(configSource){
                        // Add onClick listener to focus the correct tab once clicked
                        card.on('click', function(event){
                            event.preventDefault();
                            event.stopPropagation();
                            contentManager.focusTabbedEditorByName(STEP_NAME, configSource.fileName);
                        });
                        card.on('keypress', function(event){
                            if(event.which === 13){
                                event.preventDefault();
                                event.stopPropagation();
                                contentManager.focusTabbedEditorByName(STEP_NAME, configSource.fileName);
                            }
                        });
                    }
                    closure(configSource);                    
                }                
            }
        },

        __getOrdinalObjects: function() {
            // Get order of the ordinals
            var ordinalObjects = [];
            for(var filetype in FILETYPES){
                var obj = {};
                obj.filetype = filetype;
                obj.ordinal = this.__getFileOrdinal(filetype);
                obj.fileName = this.__getFileName(filetype);
                obj.bgcolor = this.__getCardColor(filetype);
                ordinalObjects.push(obj);
            }
            return ordinalObjects;            
        },

        __getDefaultOrdinal: function(source) {
            switch(source) {
            case FILETYPES.inject: return '0';
            case FILETYPES.propFile: return '100';
            case FILETYPES.envVar: return '300';
            case FILETYPES.sysProp: return '400';
            default: return '0';
            }
        },

        __setFileOrdinal: function(filetype, ordinal) {
            fileOrdinals[filetype] = ordinal;
        },

        /**
         * @param {String} filetype : shortname of filetype
         * @returns : ordinal of specified properties file
         */
        __getFileOrdinal: function(filetype) {
            if (fileOrdinals[filetype]) {
                return fileOrdinals[filetype];
            } else {
                return this.__getDefaultOrdinal(filetype);
            }
        },

        /**
         * @returns : array of file ordinals
         */
        __getAllFileOrdinals: function() {
            return fileOrdinals;
        },

        __getFileName: function(filetype) {
            switch(filetype) {
                case FILETYPES.inject: return JAVA_FILE;
                case FILETYPES.propFile: return PROP_FILE;
                case FILETYPES.envVar: return ENV_FILE;
                case FILETYPES.sysProp: return SYS_FILE;
                default: return null;
            }
        },

        /* Returns the color for the ordinal card associated with the fileType passed in */
        __getCardColor: function(filetype) {
            switch(filetype) {
                case FILETYPES.inject: return '#F0F2FD';
                case FILETYPES.propFile: return '#E5EAFB';
                case FILETYPES.envVar: return '#DAE1FA';
                case FILETYPES.sysProp: return '#CDD6F9';
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
