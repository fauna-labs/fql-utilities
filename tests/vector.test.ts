// Copyright Fauna, Inc.
// SPDX-License-Identifier: MIT-0

import faunadb from 'faunadb';

import { CrossProduct, DotProduct } from '../src/vector';
// Dependencies
import { Tail, Zip } from '../src/collections'

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

beforeAll(async () => {
  await faunaClient.query(
    Do(
      CrossProduct(),
      DotProduct(),
      Tail(),
      Zip()
    )
  );
});

afterAll(async () => {
  await faunaClient.query(
    Do(
      Delete(Function("CrossProduct")),
      Delete(Function("DotProduct")),
      Delete(Function("Tail")),
      Delete(Function("Zip"))
    )
  );
});

test('CrossProduct works', async () => {
  const result = await faunaClient.query(
    Call(
      "CrossProduct",
      [
        [0, 1, 2],
        [3, 4, 5],
      ]
    )
  );

  expect(result).toEqual([-3, 6, -3]);
});

test('DotProduct works', async () => {
  const result = await faunaClient.query(
    Call(
      "DotProduct",
      [
        [0, 1, 2],
        [3, 4, 5],
      ]
    )
  );

  expect(result).toEqual(14);
});
