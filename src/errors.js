const nullable = str => (str ? str : '')

class ZoemError {
  constructor(msg, startCoordinates, endCoordinates) {
    this.msg = msg;
    this.startCoordinates = startCoordinates;
    this.endCoordinates = endCoordinates;
  }

  toString() {
    return this.msg;
  }
}

class RuntimeError extends ZoemError {
  constructor(msg, token) {
    super(
      `${nullable(token.lexeme && `at "${token.lexeme}": `)}${msg}`,
      token.startCoordinates,
      token.endCoordinates
    );
  }
}

class ReturnError {
  constructor(val) {
    this.value = val;
  }
}

const error = (msg, startCoordinates, endCoordinates) => {
  new ZoemError(msg, startCoordinates, endCoordinates);
}

const parseError = (msg, token) => {
  if (token.type === token.EOF) {
    return new ZoemError(msg, token.startCoordinates, token.endCoordinates);
  } else {
    return new ZoemError(
      `${nullable(token.lexeme && `at "${token.lexeme}": `)}${msg}`,
      token.startCoordinates,
      token.endCoordinates
    );
  }
}

const runtimeError = (msg, token) => new RuntimeError(msg, token);

const formatZoemError = (e, code) => {
  if (e instanceof ZoemError) {
    const frontIndex = code.lastIndexOf('\n', e.startCoordinates.index);
    const preErrorStart = frontIndex < 0 ? 0 : frontIndex;
    const preErrorSection = code.substring(preErrorStart, e.startCoordinates.index);

    // Error String
    const errorSection = code.substring(e.startCoordinates.index, e.endCoordinates.index);

    // Post Error String
    const backIndex = code.indexOf('\n', e.endCoordinates.index);
    const postErrorStart = backIndex < 0 ? code.length : backIndex;
    const postErrorSection = code.substring(e.endCoordinates.index, postErrorStart);

    // Print Critical Code
    const errorType = e instanceof RuntimeError ? 'Runtime Error' : 'Parse Error';
    return {
      oneLiner: `${errorType}: ${e.toString()} at ${e.endCoordinates.line}:${e.endCoordinates.col +
        1}`,
      preErrorSection,
      errorSection,
      postErrorSection
    };
  } else {
    return {
      oneLiner: `Unexpected javascript Error: ${e}`
    };
  }
}

export {
  error,
  ZoemError,
  ReturnError,
  runtimeError,
  parseError,
  formatZoemError
}