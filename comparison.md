# PostgreSQL and MongoDB Comparison

## 1. Query Experience

PostgreSQL felt natural for operations involving relationships between users, posts, and comments. SQL `JOIN` operations make it straightforward to retrieve related records, while `GROUP BY` and aggregate functions provide a clear way to calculate comment counts. PostgreSQL also allows these operations to be expressed in a compact and readable form.

MongoDB felt natural when retrieving documents using filters and sorting. However, when a query required information from multiple collections, I needed aggregation stages such as `$lookup`, `$unwind`, and `$group`. These stages are flexible, but a longer pipeline can be more difficult to read than a comparable SQL query.

## 2. Effect of Referencing

I modeled comments in a separate collection in MongoDB instead of embedding all comments inside each post. This avoids continually expanding post documents as comments grow and allows comments to be queried independently.

The decision also affects query complexity. For example, retrieving a post with each comment author's name requires joining the `posts`, `comments`, and `users` collections through `$lookup` stages. In PostgreSQL, the equivalent operation can use joins across the related tables. Separate collections therefore provide flexibility but can require more aggregation work when related data must be retrieved together.

## 3. Aggregation and Missing Records

Both databases can calculate comment counts and find users who have never created a post. In PostgreSQL, a `LEFT JOIN` preserves posts with no comments, allowing their count to appear as zero. In MongoDB, starting the aggregation from `posts`, looking up matching comments, and applying `$size` also includes posts with zero comments.

This comparison showed me that the starting point of a query matters. An aggregation beginning from `comments` cannot return posts that have no comments unless the query is designed differently.

## 4. Database Choice

For this blog application, I would choose PostgreSQL. Users, posts, and comments have clear relationships, and the application needs joins, aggregation, foreign-key integrity, and transactions. PostgreSQL represents these requirements directly.

MongoDB remains a useful option for applications whose data is naturally document-oriented or whose records have flexible structures. This exercise showed me that the choice should depend on the application's data relationships and query patterns rather than on the popularity of a database.
