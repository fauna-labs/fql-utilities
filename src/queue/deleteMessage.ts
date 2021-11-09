// Copyright Fauna, Inc.
// SPDX-License-Identifier: MIT-0

import faunadb, { CreateFunction } from 'faunadb';
import { IsQueue } from './lib';

const q = faunadb.query
const {
  Abort,
  Collection,
  Concat,
  Delete,
  If,
  Lambda,
  Query,
  Ref,
  Var
} = q;

/**
 * @param {object} id - The message id to delete from the queue.
 * @param {string} queue - The name of the queue to remove the message from.
 * @returns {object} - The message deleted from the queue.
 * 
 * DeleteMessage() accepts a message id and queue name and deletes the given
 * message from the queue. If the queue does not exist or is not a queue, an
 * error is returned.
 *
 * ### Consumes per call
 * * 1 Read Ops
 * * 1 Write Ops
 * * 1 ComputeOp (19 FQL verbs)
 * 
 * ### Dependencies:
 * <none>
 *
 * ### Usage in Fauna Schema Migrate:
 * ```js
 * import { DeleteMessage } from '@fauna-labs/fql-utilities';
 * export default DeleteMessage;
 * ```
 *
 * ### Usage in FQL:
 * ```fql
 * Call(
 *   "DeleteMessage",
 *   [
 *     "1234567890",
 *     "MyQueue"
 *   ]
 * )
 * ```
 */

export function DeleteMessage(): faunadb.Expr {
  return CreateFunction({
    name: "DeleteMessage",
    body: Query(Lambda(
      ["id", "queue"],
      If(
        IsQueue(Var("queue")),
        Delete(Ref(Collection(Var("queue")), Var("id"))),
        Abort(Concat(Var("queue"), "is not a valid queue."))
      )
    )) 
  });
}
