// Copyright Fauna, Inc.
// SPDX-License-Identifier: MIT-0

import faunadb from 'faunadb';

import { CreateQueue } from '../src/queue';
import { IsQueue } from '../src/queue/lib';

const q = faunadb.query,
{
  Collection,
  CreateCollection,
  Delete,
  Do,
  Let,
  Var
} = q;

const faunaClient = new faunadb.Client({
  secret: process.env.FAUNA_ADMIN_KEY,
  domain: process.env.FAUNADB_DOMAIN || "db.fauna.com",
})

const queueName = "a_queue";
const nonQueueName = "not_a_queue";
const plainCollectionName = "plain_collection";

beforeAll(() => {
  return setupDatabase();
});

afterAll(() => {
  return teardownDatabase();
});

test('Returns true when a queue is created', async () => {
  const result = await faunaClient.query(
    Let({
        queue: queueName
      },
      IsQueue(Var("queue"))
    ));

  expect(result).toBeTruthy();
});

test('Returns false when queue is set to false', async () => {
  const result = await faunaClient.query(
    Let({
        queue: nonQueueName
      },
      IsQueue(Var("queue"))
    ));

  expect(result).toBeFalsy();
});

test('Returns false for a plain collection', async () => {
  const result = await faunaClient.query(
    Let({
        queue: plainCollectionName
      },
      IsQueue(Var("queue"))
    ));

  expect(result).toBeFalsy();
});

async function setupDatabase() {
  const result = await faunaClient.query(
    Do(
      CreateQueue(queueName),
      CreateCollection({name: nonQueueName, data: { queue: false }}),
      CreateCollection({name: plainCollectionName})
    )
  );
}

async function teardownDatabase() {
  const result = await faunaClient.query(
    Do(
      Delete(Collection(queueName)),
      Delete(Collection(nonQueueName)),
      Delete(Collection(plainCollectionName)),
    )
  );
}