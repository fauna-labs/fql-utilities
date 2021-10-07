This repository contains unofficial patterns, sample code, or tools to help developers build more effectively with [Fauna][fauna]. All [Fauna Labs][fauna-labs] repositories are provided “as-is” and without support. By using this repository or its contents, you agree that this repository may never be officially supported and moved to the [Fauna organization][fauna-organization].

---

# FQL utilities

This repo contains code for user-defined functions (UDFs) to accomplish common tasks in Fauna. These UDFs are designed to be deployed with [Fauna Schema Migrate][fauna-schema-migrate].

## How to use

* `npm init -y`
* `npm install faunadb`
* `npm install --save-dev @fauna-labs/faunadb-schema-migrate`
* `npm install --save-dev @fauna-labs/fql-utilities`
* `npx fauna-schema-migrate init`
* Create a file named `tail.js` in the `fauna/resources` directory with the following code:
  ```js
  import { Tail } from '@fauna-labs/fql-utilities';

  export default Tail();
  ```
* `npx fauna-schema-migrate generate`
* `npx fauna-schema-migrate apply`

This creates a UDF named `Tail()` in your database. `Tail()` accepts one parameter, an [Array][fql-array], and returns a new array consisting of every element except the first. If the array is empty, `Tail()` returns an empty array.

You can then call the Tail UDF with the following code:

```fql
Let(
  {
    array: [0, 1, 2],
    shortArray: Call("Tail", Var("array"))
  },
  Equals(Count(Var("shortArray")), 2) // true
)
```

## Included packages

### Collections

* [Tail()](src/collections/tail.ts)
* [Zip()](src/collections/zip.ts)

### Vector math

* [CrossProduct()](src/vector/crossProduct.ts)
* [DotProduct()](src/vector/dotProduct.ts)

[fauna]: https://www.fauna.com/
[fauna-labs]: https://github.com/fauna-labs
[fauna-organization]: https://github.com/fauna
[fauna-schema-migrate]: https://github.com/fauna-labs/fauna-schema-migrate
[fql-array]: https://docs.fauna.com/fauna/current/api/fql/types?lang=shell#array
