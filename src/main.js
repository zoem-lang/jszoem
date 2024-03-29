// adapted from YALI.js by Daniel Berezin (danman113)
// https://github.com/danman113/YALI.js

import { Tokenizer } from './tokenizer.js';
import { Parser } from './parser.js';
import { Interpreter } from './interpreter.js';
import { Environment } from './environment.js';

// function run(code, environment, printfn, debug = false) {
function run(code, environment, debug = false) {
  const tokenizer = new Tokenizer(code);
  const tokens = tokenizer.scanTokens();
  if (debug) console.log(tokens);
  const parser = new Parser(tokens);
  const statements = parser.parse();
  if (debug) console.log(statements);
  // const interpreter = new Interpreter(environment, printfn);
  const interpreter = new Interpreter(environment, code);
  let lastStatement;
  for (let statement of statements) {
    lastStatement = interpreter.interpret(statement);
  }
  const echo = interpreter.getEcho();
  return echo;
  // return lastStatement;
}

function parse(code) {
  const tokenizer = new Tokenizer(code);
  const tokens = tokenizer.scanTokens();
  const parser = new Parser(tokens);
  const statements = parser.parse();
  return statements;
}

export { formatZoemError } from './errors.js';
export {
  run,
  parse,
  Parser,
  Tokenizer,
  Interpreter,
  Environment
};