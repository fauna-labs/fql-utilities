// Copyright Fauna, Inc.
// SPDX-License-Identifier: MIT-0

import faunadb, { CreateFunction } from 'faunadb';

const q = faunadb.query
const {
  Concat,
  FindStrRegex,
  Lambda,
  Map,
  Query,
  Select,
  Var
} = q;

/**
 * @param {Array<any>} array - The array to take the tail from.
 * @returns {Array<any>} - The tail of the array.
 * 
 * Tail() accepts a Fauna Array and returns a new array consisting of every
 * element except the first. If the array is empty, Tail() returns an empty array.
 *
 * ### Consumes per call
 * * 0 Read Ops
 * * 0 Write Ops
 * * 1 ComputeOp (8 FQL verbs)
 * 
 * ### Dependencies:
 * none
 *
 * ### Usage in Fauna Schema Migrate:
 * ```js
 * import { Split } from '@fauna-labs/fql-utilities/collections';
 * export default Split();
 * ```
 *
 * ### Usage in FQL:
 * ```fql
 * Let(
 *   {
 *     array: [0, 1, 2],
 *     shortArray: Call("Tail", Var("array"))
 *   },
 *   Equals(Count(Var("shortArray")), 2) // true
 * )
 *```
 */

const body = Query(Lambda(
  ["str", "delimiter"],
  Map(
    FindStrRegex(Var("str"), Concat(["[^\\", Var("delimiter"), "]+"])),
    Lambda("res", Select(["data"], Var("res")))
  )
));

export function Split(replace: boolean = false): faunadb.Expr {
  return CreateFunction({
    name: "Split",
    body: body
  })
}