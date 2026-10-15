ADR Number: 001
Title: Database Technology Selection
Date: 2026-09-25
Owner: Douglas Silva
Status: Accepted

Context
At the start of the inventory management system development project, it was necessary to select a database technology that would meet the application's needs. Several options were available, including relational and NoSQL databases.

Decision
It was decided to use a relational database for the inventory management system. The chosen technology is PostgreSQL, due to its robustness, support for ACID transactions, and maturity within the development community.

Rationale
The decision to use a relational database—specifically PostgreSQL—was based on the following reasons:

- Complex Data Modeling: The inventory management system involves complex relationships between products, suppliers, orders, and inventory. A relational database is better suited for modeling these relationships and maintaining data integrity.
- Transactions and Consistency: Given that data accuracy is crucial in the context of inventory management, the ACID transaction guarantees provided by PostgreSQL ensure that database operations are consistent and reliable.
- Future Scalability Support: Although the project does not initially require massive scalability, choosing PostgreSQL offers the possibility of scaling the system vertically in the future, if necessary, to handle increased data volume.
- Tools and Community: PostgreSQL boasts a wide range of tools, documentation, and an active developer community that can serve as valuable resources for addressing future challenges.

Alternatives Considered
The following alternatives were considered:

- MongoDB: A NoSQL database widely used for unstructured data scenarios. However, its lack of support for ACID transactions and the complexity of data modeling made it less suitable for the inventory management system's needs.
- MySQL: A popular relational database; however, given the application's specific characteristics and the need for enhanced support for complex operations, PostgreSQL was preferred.

Consequences