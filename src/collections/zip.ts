// Copyright Fauna, Inc.
// SPDX-License-Identifier: MIT-0

import faunadb, { CreateFunction } from 'faunadb'

const q = faunadb.query
const {
  Abort,
  And,
  Append,
  Call,
  Count,
  Equals,
  GTE,
  If,
  IsArray,
  Lambda,
  Let,
  Query,
  Select,
  Subtract,
  Var
} = q

/**
 * Zip() accepts two arrays of equal length and returns a new array of the same length
 * where each element of the new array is a tuple containing the corresponding element
 * from the first and the second arguments.
 *
 * @param {Array<any>} array1 - The first array to zip.
 * @param {Array<any>} array2 - The second array to zip. `array2` must be the same length as `array1`.
 * @returns {Array<any>} A new array of tuples where each element contains the corresponding element from `array1` and `array2`.
 * 
 * Dependencies:
 * * [`Tail()`](./tail.ts)
 * ```js
 * import { Tail } from '@fauna-labs/fql-utilities/collections';
 * export default Tail();
 * ```
 *
 * Usage in Fauna Schema Migrate:
 * ```js
 * import { Zip } from '@fauna-labs/fql-utilities/collections';
 * export default Zip();
 * ```
 *
 * Usage in FQL:
 * ```fql
 * Let(
 *   { zippedArray: Call("Zip", Var("array1"), Var("array2")) },
 *   Equals(Count(Var("zippedArray")), Count(Var("array1"))) // true
 * )
 * ```
 */
export function Zip(): faunadb.Expr {
  return CreateFunction({
    name: 'Zip',
    body: Query(
      Lambda(
        ["array1", "array2"],
        If(
          And(
            IsArray(Var("array1")),
            IsArray(Var("array2")),
            Equals(Count(Var("array1")), Count(Var("array2"))),
            GTE(Count(Var("array1")), 1)
          ),
          Let(
            {
              tuple: [[Select(0, Var("array1")), Select(0, Var("array2"))]],
              tail_length: Subtract(Count(Var("array1")), 1)
            },
            If(
              Equals(Var("tail_length"), 0),
              Var("tuple"),
              Append(
                Call("Zip", [
                  Call("Tail", [Var("array1")]),
                  Call("Tail", [Var("array2")])
                ]),
                Var("tuple")
              )
            )
          ),
          Abort("Zip requires two arguments that are arrays of the same length.")
        )
      )
    )
  })
}