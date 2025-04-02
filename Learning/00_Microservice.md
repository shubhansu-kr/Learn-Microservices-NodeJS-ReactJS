# Microservices

A monolithic service contains routing, middleware, business logic and database access to implement all the feature of an app under a single umbrella.

While, a microservice service contains routing, middleware, business logic and database access to implement only a single feature of the app under a single umbrella.

Challenges faced by microservices:

1. Data management between services
    - Each service in a microservice has it's own database where it stores the information. And no service is allowed to access the database of other services directly, it can only be done by requesting the other service for accessing data.
    - This is called Database-Per-Service
    - If we dont use independent database for each service, if the db goes down then all the services goes down.
    - Scaling database would become challenging with increased throughput.
    - Failure in one service will affect all the services sharing the common db
    - IF one service updates the schema structure then it would lead to failure of all the other services which shares the same db and didn't incorporate the schema changes in it's code.
    - Sometimes we would just need different type of database for different service.
    - Another major issue faced in microservice architecture is implementation of new features which requires data from multiple database. In order to implement the feature all the services owning the database has to incorporate the feature to make it work in microservice architecture.

Communication Strategies between services

1. Sync : Services communicate with each other using direct requests.
    - Conceptually easy to understand
    - New service won't need a database if its requesting data from other services.
    - Introduces a dependency between services
    - If any interservice fails, the overall request fails.
    - The entire request is only as fast as the slowest request
    - Can easily create a web of request.
2. Async : Services communicate with each other using Events.
    - The first way of implementing an async communication is by using an event bus. It's a event orchestrating service which routes the request event and response event to the correct service. But it still has all the downsides as the sync communication, just that instead of request we have a web of events.
    - The second way of implementing an async communication is by keeping only the required data in the database created for a service. And whenever the data related to the particular service is updated by another service they emit an event to update all the other services database. And to serve the request, the service does not need to request any other service, it can simply look up it's database.
    - In this method, there is no dependency of service on other service
    - New service will be extremely fast
    - Data duplication, Pay for extra storage + extra DB
    - Difficult to understand
