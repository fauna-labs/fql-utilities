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
  secret: process.env.FAUNADB_ADMIN_KEY,
  domain: process.env.FAUNADB_DOMAIN || "db.fauna.com",
})

beforeAll(() => {
  return setupDatabase();
});

afterAll(() => {
  return teardownDatabase();
});

test('Tail returns an array of length n-1', async () => {
  const result = await faunaClient.query(
    Call("Tail", [[1, 2, 3, 4, 5]])
  );

  expect(result).toEqual([2, 3, 4, 5]);
});

test('Tail on an array of length 1 returns an empty array', async () => {
  const result = await faunaClient.query(
    Call("Tail", [[1]])
  );

  expect(result).toEqual([]);
});

test('Tail on an empty array returns an empty array', async () => {
  const result = await faunaClient.query(
    Call("Tail", [[]])
  );

  expect(result).toEqual([]);
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