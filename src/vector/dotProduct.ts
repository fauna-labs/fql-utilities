 // Copyright Fauna, Inc.
 // SPDX-License-Identifier: MIT-0

import faunadb, { CreateFunction } from 'faunadb';

const q = faunadb.query
const {
  Add,
  Call,
  Lambda,
  Multiply,
  Query,
  Reduce,
  Select,
  Var
} = q;

/**
 * DotProduct() accepts two arrays of equal length representing vectors and
 * returns the dot product or scalar product of those vectors.
 * @param {Array<number>} a - The first vector.
 * @param {Array<number>} b - The second vector. `b` must be the same length as `a`.
 * @returns {number} The dot product of the two vectors.
 *
 * Dependencies:
 * * [`Tail()`](../collections/tail.ts)
 * ```js
 * import { Tail } from '@fauna-labs/fql-utilities/collections';
 * export default Tail();
 * ```
 * * [`Zip()`](../collections/zip.ts)
 * ```js
 * import { Zip } from '@fauna-labs/fql-utilities/collections';
 * export default Zip();
 * ```
 *
 * Usage in Fauna Schema Migrate:
 * ```js
 * import { DotProduct } from '@fauna-labs/fql-utilities/vector';
 * export default DotProduct();
 * ```
 *
 * Usage in FQL:
 * ```fql
 * Let(
 *   {
 *     a: [0, 1, 2],
 *     b: [3, 4, 5]
 *   },
 *   Equals(Call("DotProduct", Var("a"), Var("b")), 14) // true
 * )
 * ```
 */
export function DotProduct(): faunadb.Expr {
  return CreateFunction({
    name: "DotProduct",
    body: Query(
      Lambda(
        ["a", "b"],
        Reduce(
          Lambda(
            ["acc", "tuple"],
            Add(
              Var("acc"),
              Multiply(Select(0, Var("tuple")), Select(1, Var("tuple")))
            )
          ),
          0,
          Call("Zip", [Var("a"), Var("b")])
        )
      )
    )
  });
}
