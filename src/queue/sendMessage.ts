// Copyright Fauna, Inc.
// SPDX-License-Identifier: MIT-0

import faunadb, { CreateFunction, Merge } from 'faunadb';
import { IsQueue } from './lib';

const q = faunadb.query
const {
  Abort,
  Collection,
  Concat,
  Create,
  If,
  Lambda,
  Let,
  Query,
  Var
} = q;

/**
 * @param {object} message - The message to place in the queue.
 * @param {string} queue - The name of the queue to place the message in.
 * @returns {object} - The message placed in the queue.
 * 
 * SendMessage() accepts a message and queue name and inserts the given message
 * into the queue. If the queue does not exist or is not a queue, an error is
 * returned.
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
 * import { SendMessage } from '@fauna-labs/fql-utilities';
 * export default SendMessage;
 * ```
 *
 * ### Usage in FQL:
 * ```fql
 * Call(
 *   "SendMessage",
 *   [
 *     { "source": "Fauna", "body": "Hello World!" },
 *     "MyQueue"
 *   ]
 * )
 * ```
 */

export function SendMessage(replace: boolean = false): faunadb.Expr {
  return CreateFunction({
    name: "SendMessage",
    body: Query(Lambda(
      ["message", "queue"],
      If(
        IsQueue(Var("queue")),
        Let(
          {
            "data": Merge(Var("message"), { "_visible": true })
          },
          Create(Collection(Var("queue")), { data: Var("data") })
        ),
        Abort(Concat(Var("queue"), "is not a valid queue."))
      )
    )) 
  });
}
