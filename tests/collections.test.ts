// Copyright Fauna, Inc.
// SPDX-License-Identifier: MIT-0

import faunadb from 'faunadb';

import { Sliding, Split, Tail, Zip } from '../src/collections';

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
  port: parseInt(process.env.FAUNADB_PORT) || 443,
  scheme: process.env.FAUNADB_SCHEME || "https",
})

beforeAll(() => {
  return setupDatabase();
});

afterAll(() => {
  return teardownDatabase();
});

test('Sliding works with a window smaller than the array', async () => {
  const result = await faunaClient.query(
    Call("Sliding", [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 3])
  );

  expect(result).toEqual([
    [0, 1, 2], 
    [1, 2, 3],
    [2, 3, 4],
    [3, 4, 5],
    [4, 5, 6],
    [5, 6, 7],
    [6, 7, 8],
    [7, 8, 9]
  ]);
});

test('Sliding works with a window equal to the size of the array', async () => {
  const result = await faunaClient.query(
    Call("Sliding", [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 10])
  );

  expect(result).toEqual([[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]]);
});

test.skip('Sliding works with a window larger than the size of the array', async () => {
  const result = await faunaClient.query(
    Call("Sliding", [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 20])
  );

  expect(result).toEqual([[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]]);
});

test('Split works with whitespace characters', async () => {
  const result = await faunaClient.query(
    Call("Split", ["Hello, world!", " "])
  );

  expect(result).toEqual(["Hello,", "world!"]);
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
      Sliding(),
      Split(),
      Tail(),
      Zip(),
    )
  );
}

async function teardownDatabase() {
  const result = await faunaClient.query(
    Do(
      Delete(Function("Sliding")),
      Delete(Function("Split")),
      Delete(Function("Tail")),
      Delete(Function("Zip"))
    )
  );
}