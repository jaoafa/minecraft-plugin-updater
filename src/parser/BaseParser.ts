// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BaseParserOptions {}

export interface VersionItem {
  version: string
}

export interface BaseParserResult {
  latest: VersionItem
  versions?: VersionItem[]
}

export abstract class BaseParser<
  T extends BaseParserOptions,
  R extends BaseParserResult
> {
  protected options: T

  constructor(options: T) {
    this.options = options
  }

  abstract parse(): Promise<R>
}

export class ParseError extends Error {}
