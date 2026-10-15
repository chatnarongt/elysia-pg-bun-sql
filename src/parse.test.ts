import { expect, test } from 'bun:test'
import { int, ints, ParseError, param, pgIntArray, records } from './parse.ts'

test('int/ints', () => {
  expect(int('42', 'id')).toBe(42)
  expect(int(['7', '8'], 'id')).toBe(7)
  expect(ints(['1', '2'], 'id')).toEqual([1, 2])
  for (const bad of [undefined, '', 'x', '1.5', '2147483648', '1;drop'])
    expect(() => int(bad, 'id')).toThrow(ParseError)
  expect(() => ints(Array(101).fill('1'), 'id')).toThrow(ParseError)
})

test('records', () => {
  expect(records('{"id":1,"randomNumber":42}')).toEqual([{ id: 1, randomNumber: 42 }])
  expect(records(['{"id":1,"randomNumber":2}', '{"id":3,"randomNumber":4}'])).toHaveLength(2)
  for (const bad of ['nope', 'null', '{"id":1.5,"randomNumber":2}', '{"id":1}'])
    expect(() => records(bad)).toThrow(ParseError)
})

test('pgIntArray', () => {
  expect(pgIntArray([1, 2, 3])).toBe('{1,2,3}')
})

test('param', () => {
  expect(param('http://x/?a=1', 'a')).toBe('1')
  expect(param('http://x/?a=1&a=2', 'a')).toEqual(['1', '2'])
  expect(param('http://x/', 'a')).toBeUndefined()
})
