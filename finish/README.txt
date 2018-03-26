To use the sample application, extract the sampleapp_mpconfig.zip file to your 
local directory. The application is broken into two services, a displayCarTypes 
service and an obtainCarTypes service. 

Run the Maven command 'mvn install' from the directory that contains the 
extracted .zip files to build the project and install it to your local directory. 
This creates the 'displayCarTypes/target/liberty' directory that contains your 
liberty server, mpConfigServer, and it starts the server. 

To start and stop the server, issue the following commands from the
<extract-directory> directory:
      mvn liberty:start-server
      mvn liberty:stop-server

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

To access the sample application, visit the following URL from your browser: 
      http://localhost:9080/car-types 
Initially this will show all 5 car types, SUV, Crossover, Coupe, Truck, and 
Convertible, since the bootstrap.properties contains the port value 9083. 

You can edit the /META-INF/microprofile-config.properties file, the server.env 
file, or the bootstrap.properties file to change the port values or change the 
config_ordinal of the configuration source. To save the changes on the Liberty 
server, run the Maven command 'mvn package' from the directory that contains 
the extracted sampleapp_mpconfig.zip files. 

The injected port configuration value is static. Changes to these files only 
take effect at application startup. To restart the application, restart 
the mpConfigServer, as indicated above. 