---
layout: post
date: 2025-01-19
title: "[Dev] RDB vs NoSQL"
tags: [DB, Database, Dev, Development, ]
categories: [Development, Dev, ]
---


## RDB (Relational Database)


RDB stores and manages data in a tabular format. Tables are related to each other through keys, such as primary and foreign keys. It uses SQL to query and manage data. 


Pros :

- Suited for structured data and applications that require complex queries.
- Strong transaction management and guaranteed data consistency.
- Ideal for applications that require relational data models and multi-table operations.

Cons : 

- Horizontal scaling may be complex and costly.
- Flexibility and adaptability can be limited for fixed schema.
- It may not be the best for large, unstructured datasets.


## NoSQL


NoSQL is designed to deal with large-scale, distributed data storage. It can handle unstructured or semi-structured data more flexibly. 


Pros : 

- High scalability and performance for large datasets or distributed environments.
- Flexible schema and support for various types of data, including unstructured data.

Cons :

- ACID transactions may not be fully supported, leading to potential issues with data consistency.
- Not suitable for performing complex queries and joining multiple data sources.
- Some NoSQL systems can be less efficient for handling highly related data.


### Comparison of RDB vs NoSQL


| Feature            | RDB (Relational Database)                               | NoSQL (Non-relational Database)                               |
| ------------------ | ------------------------------------------------------- | ------------------------------------------------------------- |
| Data Model         | Table-based (Rows and Columns)                          | Various (Document, Key-Value, Column-family, Graph)           |
| Schema             | Fixed schema required                                   | Flexible schema                                               |
| Query Language     | SQL                                                     | Depends on the system (e.g., MongoDB query language, etc.)    |
| Scalability        | Vertical scaling (adding more power to a single server) | Horizontal scaling (adding more servers)                      |
| Transactions       | ACID (Atomicity, Consistency, Isolation, Durability)    | BASE (Basically Available, Soft state, Eventually consistent) |
| Consistency        | Strong consistency                                      | Eventual consistency (sometimes)                              |
| Data Relationships | Explicit relationships between tables                   | Simple or no relationships; optimized for denormalized data   |

undefined