# iguide-microprofile-config

Link to the guide on Openliberty.io: Will update when the guide is live.

This repo provides an interactive guide on the Openliberty.io website that users can interact with 
and learn more about different concepts related to Open Liberty.


## What you'll learn:
Learn how to use MicroProfile Config to separate configuration from code. Explore how to inject configuration data into a microservice without repackaging the application each time the underlying runtime environment changes. MicroProfile makes building configurable microservices easy with its MicroProfile Config feature. Application configuration properties from multiple sources are combined into a single set of configuration properties and accessed from a single API by your application.

Using the Microprofile Config API, the sample application illustrates how a configuration property can be assigned a value in multiple configuration sources. Each source is assigned a priority. The value from the source with the highest priority takes precedence over that from a lower priority. This method allows code to run unchanged under different configurations for development, test, quality assurance, and production environments since an existing configuration value can easily be overridden as the need arises.
