// Copyright Fauna, Inc.
// SPDX-License-Identifier: MIT-0

import faunadb from 'faunadb';

const q = faunadb.query
const {
  Collection,
  Equals,
  Get,
  Let,
  Select,
  Var
} = q;

/**
 * @param {faunadb.Expr} name - The name of the collection to check.
 * @returns {boolean} - True if the collection exists and is a queue; false otherwise.
 * 
 * Tail() accepts a Fauna Array and returns a new array consisting of every
 * element except the first. If the array is empty, Tail() returns an empty array.
 *
 * ### Consumes per call
 * * 1 Read Ops
 * * 0 Write Ops
 * * 1 ComputeOp (19 FQL verbs)
 * 
 * ### Dependencies:
 * none
 *
 * ### Usage in Fauna Schema Migrate:
 * ```js
 * import faunadb, { CreateFunction } from 'faunadb';
 * import { IsQueue } from '@fauna-labs/fql-utilities';
 * 
 * export default CreateFunction({
 *   name: 'IsQueue',
 *   body: Query(Lambda(
 *     "collection",
 *     IsQueue(Collection(Var("collection")))
 *   ))
 * })
 * ```
 *
 * ### Usage in FQL:
 * ```fql
 * <N/A - Partial function>
 *```
 */

export function IsQueue(name: faunadb.Expr): faunadb.Expr {
  return Let(
    {
      collection: Collection(Var("name")),
      metadata: Select(["data"], Get(Var("collection"))),
      isQueue: Select(["queue"], Var("metadata"))
    },
    Equals(Var("isQueue"), true)
  )
}
