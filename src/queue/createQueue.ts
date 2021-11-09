// Copyright Fauna, Inc.
// SPDX-License-Identifier: MIT-0

import faunadb, { CreateCollection } from 'faunadb';

/**
 * @param {string} name - The name of the queue.
 * @param {boolean} [fifo=false] - (Not yet implemented) Whether this queue is a first-in-first-out (FIFO) queue.
 * @param {boolean} [priority=false] - (Not yet implemented) Whether this queue is a priority queue.
 * @returns {Queue} - A Fauna collection representing a queue.
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
 * import { CreateQueue } from '@fauna-labs/fql-utilities';
 * 
 * const options = {
 *   name: 'my_queue',
 *   fifo: false,     // Optional, not yet implemented
 *   priority: false  // Optional, not yet implemented
 * }
 * 
 * export default CreateQueue(options);
 * ```
 *
 * ### Usage in FQL:
 * <not applicable>
 */

export function CreateQueue(name: string, fifo: boolean = false, priority: boolean = false): faunadb.Expr {
  return CreateCollection({
    name: name,
    ttl_days: 7,
    history_days: 0,
    data: {
      queue: true,
      fifo: fifo,
      priority: priority
    }
  });
}
