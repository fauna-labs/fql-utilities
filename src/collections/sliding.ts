// Copyright Fauna, Inc.
// SPDX-License-Identifier: MIT-0

import faunadb, { CreateFunction } from 'faunadb';

const q = faunadb.query
const {
  Add,
  Append,
  Drop,
  GTE,
  If,
  Lambda,
  Let,
  Map,
  Query,
  Reduce,
  Select,
  Take,
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
  ["coll", "size"],
  Select(
    "results",
    Reduce(
      // Do something,
      Lambda(
        ["accumulator", "value"],
        Let(
          {
            // Append the current value onto each of the existing accumulators.
            partialTempArrays: Map(
              Select(
                ["tempArrays"], 
                Var("accumulator")
              ),
              Lambda(
                "array", 
                Append(Var("value"), Var("array"))
              )
            ),
            newTempArrays: Append(
              [[Var("value")]],
              Var("partialTempArrays")
            ),
            newCount: Add(Select(["count"], Var("accumulator")), 1)
          },
          If(
            GTE(Var("newCount"), Var("size")),
            // If the new count is >= the sliding window size, we've already fully instantiated
            // the accumulators, so we take the first element and Append it onto the results.
            {
              count: Var("newCount"),
              results: Append(
                Take(1, Var("newTempArrays")),
                Select(["results"], Var("accumulator"))
              ),
              tempArrays: Drop(1, Var("newTempArrays"))
            },
            // If the count is strictly less than the sliding window size, we move on.
            {
              count: Var("newCount"),
              // Error here
              results: Select(["results"], Var("accumulator")),
              tempArrays: Var("newTempArrays")
            }
          )
        )
      ),
      // Initial,
      {
        "count": 0,
        "results": [],
        "tempArrays": []
      },
      // Array or set
      Var("coll")
    )
  )
));

export function Sliding(replace: boolean = false): faunadb.Expr {
  return CreateFunction({
    name: "Sliding",
    body: body
  })
}