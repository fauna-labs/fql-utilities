// Copyright Fauna, Inc.
// SPDX-License-Identifier: MIT-0

import faunadb, { CreateIndex } from 'faunadb';

const {
  Collection,
} = faunadb.query;

/**
 * @param {string} name - The name of the queue.
 * @param {boolean} [fifo=false] - (Not yet implemented) Whether this queue is a first-in-first-out (FIFO) queue.
 * @param {boolean} [priority=false] - (Not yet implemented) Whether this queue is a priority queue.
 * @returns {Index} - A Fauna index implementing a queue.
 * 
 * CreateQueue() creates a collection in the specified database with additional
 * properties to represent a queue.
 *
 * ### Consumes per call
 * * 0 Read Ops
 * * 1 Write Ops
 * * 1 ComputeOp (1 FQL verbs)
 * 
 * ### Dependencies:
 * none
 *
 * ### Usage in Fauna Schema Migrate:
 * ```js
 * import { CreateQueueIndex } from '@fauna-labs/fql-utilities';
 * 
 * export default CreateQueueIndex('MyQueue');
 * ```
 *
 * ### Usage in FQL:
 * Call(
 *   "CreateQueueIndex",
 *   ["MyQueue"]
 * )
 */

export function CreateQueueIndex(queueName: string, fifo: boolean = false, priority: boolean = false): faunadb.Expr {
  return CreateIndex({
    name: queueName,
    source: Collection(queueName),
    terms: [
      { field: ["data", "_visible"] }
    ],
    values: [
      { field: "ts" }, 
      { field: "ref" }
    ]
  });
}
