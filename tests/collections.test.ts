// Copyright Fauna, Inc.
// SPDX-License-Identifier: MIT-0

import faunadb from 'faunadb';

import { Tail, Zip } from '../src/collections';

const q = faunadb.query
const {
  Call,
  Delete,
  Do,
  Function
} = q;

const faunaClient = new faunadb.Client({
  secret: process.env.FAUNADB_ADMIN_KEY || "fnAEVSa9Z4AAQxE3edcPeF3i6oDCdjIakeISJ-_t",
  domain: process.env.FAUNADB_DOMAIN || "db.us.fauna.com",
})

beforeAll(() => {
  return setupDatabase();
});

afterAll(() => {
  return teardownDatabase();
});

test('Tail works', async () => {
  const result = await faunaClient.query(
    Call("Tail", [[1, 2, 3, 4, 5]])
  );

  expect(result).toEqual([2, 3, 4, 5]);
});

test('Zip works', async () => {
  const result = await faunaClient.query(
    Call("Zip", [[1, 2, 3, 4, 5], ["a", "b", "c", "d", "e"]])
  );

  expect(result).toEqual([[1, "a"], [2, "b"], [3, "c"], [4, "d"], [5, "e"]]);
});

async function setupDatabase() {
  const result = await faunaClient.query(
    Do(
      Tail(),
      Zip(),
    )
  );
}

async function teardownDatabase() {
  const result = await faunaClient.query(
    Do(
      Delete(Function("Tail")),
      Delete(Function("Zip"))
    )
  );
}