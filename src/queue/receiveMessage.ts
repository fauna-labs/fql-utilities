// Copyright Fauna, Inc.
// SPDX-License-Identifier: MIT-0

import faunadb, { CreateFunction, Get, Now } from 'faunadb';
import { IsQueue } from './lib';

const q = faunadb.query
const {
  Abort,
  Concat,
  If,
  Index,
  Lambda,
  Let,
  Query,
  Update,
  Var
} = q;

/**
 * @param {string} queue - The name of the queue to read the next message from.
 * @returns {object} - The next message taken from the queue. May be null if
 * the queue is empty.
 * 
 * ReceiveMessage() accepts a queue name, retrieves the next visible message
 * from the queue, and marks that message as no longer visible. If the queue
 * does not exist or is not a queue, an error is returned.
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
 * import { ReceiveMessage } from '@fauna-labs/fql-utilities';
 * export default ReceiveMessage;
 * ```
 *
 * ### Usage in FQL:
 * ```fql
 * Call(
 *   "ReceiveMessage",
 *   "MyQueue"
 * )
 * ```
 */

export function ReceiveMessage(): faunadb.Expr {
  return CreateFunction({
    name: "ReceiveMessage",
    body: Query(Lambda(
      "queue",
      If(
        IsQueue(Var("queue")),
        Let(
          {
            "messageRef": Get(Index(Var("queue"))),
            "retrievalTime": Now()
          },
          Update(
            Var("messageRef"), 
            { 
              "data": { 
                "_visible": null,
                "_retrievalTime": Var("retrievalTime") 
              } 
            }
          ) 
        ),
        Abort(Concat(Var("queue"), "is not a valid queue."))
      )
    )) 
  });
}
