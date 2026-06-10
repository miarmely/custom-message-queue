# Custom Message Queue Microservices Project

A microservice-based application developed as part of the **Programming Languages** course. The purpose of this project was to understand the fundamentals of distributed systems and asynchronous communication by designing and implementing a custom message queue mechanism inspired by message broker architectures.

Instead of using third-party solutions such as RabbitMQ, the project implements its own queue management and task distribution logic using custom algorithms.

## Overview

The system consists of three independent applications:

* **API Service** (Node.js)
* **Worker Microservice** (Node.js)
* **Web Client** (React.js)

The API Service receives requests from users and places tasks into a custom queue system. Worker services continuously monitor the queue and process pending tasks asynchronously.

## Architecture

```text
+-------------+
| React Client|
+------+------+
       |
       v
+-------------+
| API Service |
|  Node.js    |
+------+------+
       |
       v
+----------------------+
| Custom Queue System  |
| (Own Algorithm)      |
+------+---------------+
       |
       v
+-------------+
|   Worker    |
|  Node.js    |
+-------------+
```

## Components

### API Service

The API Service acts as the entry point of the application.

Responsibilities:

* Receiving requests from clients
* Validating incoming data
* Creating and managing queue tasks
* Distributing tasks to worker services

### Worker Microservice

The Worker Service processes queued tasks asynchronously.

Responsibilities:

* Monitoring pending tasks
* Executing background operations
* Processing workload independently from the API
* Returning task results

### Web Application

The frontend application is built with React.js.

Responsibilities:

* Providing a simple user interface
* Sending requests to the API Service
* Displaying task status and results

## Technologies

### Backend

* Node.js
* Express.js
* TypeScript

### Frontend

* React.js
* HTML
* CSS

### Concepts

* Microservices Architecture
* Asynchronous Processing
* Background Workers
* Custom Queue Management
* Service Decoupling

## Features

* Custom message queue implementation
* Asynchronous task processing
* Worker-based architecture
* Microservice communication
* Queue monitoring and management
* Simple web interface
* Modular service design

## Learning Objectives

This project was developed to explore:

* Distributed systems
* Asynchronous processing
* Task scheduling
* Queue management algorithms
* Microservice architecture
* Backend system design
* Worker service patterns

## Author

@Miarmely

Software Engineer | Backend Developer | Database Engineer
