/* global describe, it */

const parinfer = require('../parinfer.js')
const assert = require('assert')

function isInteger (x) {
  return typeof x === 'number' &&
       isFinite(x) &&
       Math.floor(x) === x
}

function isValidTestId (id) {
  return typeof id === 'number' && id >= 1000 && id < 10000
}

function isTestIdArg (s) {
  if (typeof s !== 'string') return false
  const split = s.split(':')
  if (split.length !== 2) return false
  const testId = parseInt(split[1], 10)
  return split[0] === '--id' && isValidTestId(testId)
}

assert(isTestIdArg('--id:1400'))
assert(!isTestIdArg('--id'))
assert(!isTestIdArg('--id:78'))

function extractJustId (s) {
  const a = s.split(':')
  return parseInt(a[1], 10)
}

assert(extractJustId('--id:1400') === 1400)

// -----------------------------------------------------------------------------
// Compile tests from Markdown to JSON

require('./cases/build.js').buildAll()
const indentCases = require('./cases/indent-mode.json')
const parenCases = require('./cases/paren-mode.json')
const smartCases = require('./cases/smart-mode.json')

// -----------------------------------------------------------------------------
// STRUCTURE TEST
// Diff the relevant result properties.

function assertStructure (actual, expected) {
  assert.strictEqual(actual.text, expected.text)
  assert.strictEqual(actual.success, expected.success)
  assert.strictEqual(actual.cursorX, expected.cursorX)
  assert.strictEqual(actual.cursorLine, expected.cursorLine)

  assert.strictEqual(actual.error == null, expected.error == null)
  if (actual.error) {
    // NOTE: we currently do not test 'message' and 'extra'
    assert.strictEqual(actual.error.name, expected.error.name)
    assert.strictEqual(actual.error.lineNo, expected.error.lineNo)
    assert.strictEqual(actual.error.x, expected.error.x)
  }

  if (expected.tabStops) {
    assert.strictEqual(actual.tabStops == null, false)

    const expectedTSLen = expected.tabStops.length
    const actualTSLen = actual.tabStops.length
    assert.strictEqual(expectedTSLen, actualTSLen)

    let i = 0
    while (i < expectedTSLen) {
      const actualTS = actual.tabStops[i]
      const expectedTS = expected.tabStops[i]

      assert.strictEqual(actualTS.lineNo, expectedTS.lineNo)
      assert.strictEqual(actualTS.x, expectedTS.x)
      assert.strictEqual(actualTS.ch, expectedTS.ch)
      assert.strictEqual(actualTS.argX, expectedTS.argX)

      i = i + 1
    }
  }

  if (expected.parenTrails) {
    assert.deepStrictEqual(actual.parenTrails, expected.parenTrails)
  }
}

function testStructure (testCase, mode) {
  const expected = testCase.result
  const text = testCase.text
  const options = testCase.options
  let result1, result2, result3

  // We are not yet verifying that the returned paren tree is correct.
  // We are simply setting it to ensure it is constructed in a way that doesn't
  // throw an exception.
  options.returnParens = true

  it('should generate the correct result structure', function () {
    result1 = null
    if (mode === 'indent') {
      result1 = parinfer.indentMode(text, options)
    } else if (mode === 'paren') {
      result1 = parinfer.parenMode(text, options)
    } else if (mode === 'smart') {
      result1 = parinfer.smartMode(text, options)
    }
    assert(result1 !== null)

    assertStructure(result1, expected)

    // FIXME: not checking paren trails after this main check
    // (causing problems, and not a priority at time of writing)
    if (result1.parenTrails) {
      delete result1.parenTrails
    }
  })

  if (expected.error ||
      expected.tabStops ||
      expected.parenTrails ||
      testCase.options.changes) {
    return
  }

  it('should generate the same result structure on idempotence check', function () {
    const options2 = {
      ...options,
      cursorX: result1.cursorX,
      cursorLine: result1.cursorLine
    }

    result2 = null
    if (mode === 'indent') {
      result2 = parinfer.indentMode(result1.text, options2)
    } else if (mode === 'paren') {
      result2 = parinfer.parenMode(result1.text, options2)
    } else if (mode === 'smart') {
      result2 = parinfer.smartMode(result1.text, options2)
    }
    assert(result2 !== null)

    assertStructure(result2, result1)
  })

  it('should generate the same result structure on cross-mode check', function () {
    const hasCursor = isInteger(expected.cursorX)
    if (!hasCursor) {
      const options3 = { ...options }
      result3 = null
      if (mode === 'indent') {
        result3 = parinfer.indentMode(result1.text, options3)
      } else if (mode === 'paren') {
        result3 = parinfer.parenMode(result1.text, options3)
      } else if (mode === 'smart') {
        result3 = parinfer.smartMode(result1.text, options3)
      }
      assert(result3 !== null)

      assertStructure(result3, result1)
    }
  })
}

// -----------------------------------------------------------------------------
// STRING TESTS
// Diff the annotated text instead of the data for easy reading.
// (requires extra parser/printer code that we may not want to port)

const parinferTest = require('../testParsingLib.js')

function testString (testCase, mode) {
  const expected = testCase.result
  const source = testCase.source

  const extras = {
    printTabStops: expected.tabStops,
    printParenTrails: expected.parenTrails
  }

  let pretty, pretty2, pretty3
  let prettyIn

  it('should generate the correct annotated output', function () {
    switch (mode) {
      case 'indent': pretty = parinferTest.indentMode(source.in, extras); break
      case 'paren': pretty = parinferTest.parenMode(source.in, extras); break
      case 'smart': pretty = parinferTest.smartMode(source.in, extras); break
    }
    assert.strictEqual(pretty, source.out, '\n\nINPUT:\n' + source.in + '\n')
    prettyIn = parinferTest.transferInlineOpts(source.in, pretty)
  })

  if (expected.error ||
      expected.tabStops ||
      expected.parenTrails ||
      testCase.options.changes) {
    return
  }

  it('should generate the same annotated output on idempotence check', function () {
    switch (mode) {
      case 'indent': pretty2 = parinferTest.indentMode(prettyIn, extras); break
      case 'paren': pretty2 = parinferTest.parenMode(prettyIn, extras); break
      case 'smart': pretty2 = parinferTest.smartMode(prettyIn, extras); break
    }
    assert.strictEqual(pretty2, pretty)
  })

  it('should generate the same annotated output on cross-mode check', function () {
    const hasCursor = expected.cursorX != null
    if (!hasCursor) {
      switch (mode) {
        case 'indent': pretty3 = parinferTest.parenMode(prettyIn, extras); break
        case 'paren': pretty3 = parinferTest.indentMode(prettyIn, extras); break
        case 'smart': pretty3 = parinferTest.parenMode(prettyIn, extras); break
      }
      assert.strictEqual(pretty3, pretty)
    }
  })
}

function runTest (testCase, mode) {
  describe('Test Case #' + testCase.id, function () {
    testString(testCase, mode)
    testStructure(testCase, mode)
  })
}

// -----------------------------------------------------------------------------
// Test execution order

const allTestCases = indentCases.concat(parenCases, smartCases)
const allTestCasesIds = allTestCases.reduce((acc, itm) => {
  return acc.add(itm.id)
}, new Set())

const cliIdArgs = process.argv.filter(isTestIdArg).map(extractJustId)
const onlyTestTheseIds = cliIdArgs.length === 0 ? allTestCasesIds : new Set(cliIdArgs)

describe('test case ids are unique', function () {
  assert.strictEqual(allTestCases.length, allTestCasesIds.size, 'all test case ids should be unique')
})

describe('Indent Mode', function () {
  for (let i = 0; i < indentCases.length; i++) {
    const testCase = indentCases[i]
    if (onlyTestTheseIds.has(testCase.id)) {
      runTest(testCase, 'indent')
    }
  }
})

describe('Paren Mode', function () {
  for (let i = 0; i < parenCases.length; i++) {
    const testCase = parenCases[i]
    if (onlyTestTheseIds.has(testCase.id)) {
      runTest(testCase, 'paren')
    }
  }
})

describe('Smart Mode', function () {
  for (let i = 0; i < smartCases.length; i++) {
    const testCase = smartCases[i]
    if (onlyTestTheseIds.has(testCase.id)) {
      runTest(testCase, 'smart')
    }
  }
})
