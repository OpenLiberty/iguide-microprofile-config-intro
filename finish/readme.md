# Setup

To use the sample application, download and extract the [sampleapp_mpconfig.zip] 
(https://github.com/OpenLiberty/iguide-microprofile-config/raw/master/finish/sampleapp_mpconfig.zip) 
file to your local directory.

Use the `mvn install` Maven command from the directory that contains the extracted .zip files 
to build the project and install it in your local repository. The command creates the 
`displayCarTypes/target/liberty` directory that contains your Liberty server, mpConfigServer, 
and starts the server in the background.

To stop the running server, run the Maven command `mvn liberty:stop-server`. To start
the mpConfigServer, run the Maven command `mvn liberty:start-server`.

To access the sample application, visit the http://localhost:9080/car-types URL. Initially, this will 
show all 5 car types, SUV, Crossover, Coupe, Truck, and Convertible, since the bootstrap.properties
contains the port value 9083. 

The <extract-directory>/displayCarTypes/src directory contains the 
InventoryConfig.java file as shown throughout this guide.  This file is where the 
port configuration property value is injected into the code. The variable has the 
default value of '9080'. 

The properties file can be found in 
<extract-directory>/displayCarTypes/src/main/webapp/META-INF/microprofile-config.properties. 
It sets the port value to 9081. 

The server.env and bootstrap.properties files can be found within the 
mpConfigServer configuration directory at 
<extract-directory>/displayCarTypes/src/main/liberty/config. 
They set the port value to 9082 (in server.env) and 9083 (in bootstrap.properties). 

You can edit the /META-INF/microprofile-config.properties file, the server.env 
file, or the bootstrap.properties file to change the port values or change the 
config_ordinal of the configuration source. To save the changes on the Liberty 
server, run the Maven command 'mvn package' from the directory that contains 
the extracted sampleapp_mpconfig.zip files. 

The injected port configuration value is static. Changes to these files only 
take effect at application startup. To restart the application, restart 
the mpConfigServer, as indicated above. 