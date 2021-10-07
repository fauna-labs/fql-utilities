 // Copyright Fauna, Inc.
 // SPDX-License-Identifier: MIT-0

import faunadb, { CreateFunction } from 'faunadb';

const q = faunadb.query
const {
  Abort,
  And,
  Count,
  Equals,
  If,
  IsArray,
  Lambda,
  Multiply,
  Query,
  Select,
  Subtract,
  Var
} = q;

/**
 * CrossProduct() accepts two arrays each representing vectors in three dimensions and
 * returns the cross product or orthogonal vector product of those vectors in a 
 * right hand coordinate system.
 * @param {Array<number>} a - The first vector. `a` must be of length three (3).
 * @param {Array<number>} b - The second vector.  `b` must be of length three (3).
 * @returns {number} The cross product of the two vectors.
 * Dependencies:
 * none
 *
 * Usage in Fauna Schema Migrate:
 * ```js
 * import { CrossProduct } from '@fauna-labs/fql-utilities/vector';
 * export default CrossProduct();
 * ```
 *
 * Usage in FQL:
 * ```fql
 * Let(
 *   {
 *     a: [0, 1, 2],
 *     b: [3, 4, 5]
 *   },
 *   Equals(Call("CrossProduct", Var("a"), Var("b")), [-3, 6, -3]) // true
 * )
 * ```
 */
export function CrossProduct(): faunadb.Expr {
  return CreateFunction({
    name: "CrossProduct",
    body: Query(
      Lambda(
        ["a", "b"],
        If(
          And(
            IsArray(Var("a")),
            Equals(Count(Var("a")), 3),
            IsArray(Var("b")),
            Equals(Count(Var("b")), 3)
          ),
          [
            Subtract(Multiply(Select(1, Var("a")), Select(2, Var("b"))), Multiply(Select(2, Var("a")), Select(1, Var("b")))),
            Subtract(Multiply(Select(2, Var("a")), Select(0, Var("b"))), Multiply(Select(0, Var("a")), Select(2, Var("b")))),
            Subtract(Multiply(Select(0, Var("a")), Select(1, Var("b"))), Multiply(Select(1, Var("a")), Select(0, Var("b"))))
          ],
          Abort("CrossProduct requires two vectors of length three (3).")
        )
      )
    )
  });
}
