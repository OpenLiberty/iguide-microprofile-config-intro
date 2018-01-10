To use the sample application, extract the sampleapp_mpconfig.zip file to your local directory.
The application is broken into a displayCarTypes service and a obtainCarTypes service.  

Use the Maven command 'mvn install' from the directory containing the extracted .zip files 
to build the project and install it to your local repository.  This will create the 
'displayCarTypes\target\liberty' directory containing your liberty server, mpConfigServer, and
start the server. To stop and start the server, issue the following commands from 
<extract-directory>/displayCarTypes/target/liberty/wlp/bin:
      server stop mpConfigServer
      server start mpConfigServer

The <extract-directory>\displayCarTypes\src directory contains the InventoryConfig.java file as
shown throughout this guide.  This file is where the port configuration property value is 
injected into the code. The variable is given the default value of '9080'.

The properties file can be found within 
<extract-directory>\displayCarTypes\src\main\webapp\META-INF\microprofile-config.properties.
It sets the port value to 9081.

The server.env and bootstrap.properties files can be found within the mpConfigServer directory
at <extract-directory>\displayCarTypes\target\liberty\wlp\usr\servers\mpConfigServer.  They 
set the port value to 9082 (in server.env) and 9083 (in bootstrap.properties).

To execute the sample application, visit the following URL from your browser:
      http://localhost:9080/car-types
Initially this will show all 5 car types, SUV, Crossover, Coupe, Truck, and Convertible, since
the bootstrap.properties contains the port value 9083.

You can edit the \META-INF\microprofile-config.properties file, the server.env file, or the 
bootstrap.properties file to change the port values or change the config_ordinal of the 
configuration source.  Because the injected port configuration value is static, changes to
server.env and bootstrap.properties only take effect at application startup.  Restarting the
mpConfigServer as indicated above will restart the application.


