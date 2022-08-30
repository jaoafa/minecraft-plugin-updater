import { SpigotMCResponse } from '@/interfaces/spigot'
import axios from 'axios'
import { BaseParser, BaseParserOptions, ParseError } from './BaseParser'

export interface SpigotMCOptions extends BaseParserOptions {
  resourceId: number
}

export interface SpigotMCVersionItem {
  id: number
  version: string
  downloadUrl: string
}

export type SpigotMCResult = {
  latest: SpigotMCVersionItem
  versions: SpigotMCVersionItem[]
}

export class SpigotMCParser extends BaseParser<
  SpigotMCOptions,
  SpigotMCResult
> {
  async parse(): Promise<SpigotMCResult> {
    const resourceId = this.options.resourceId
    const response = await axios.get<SpigotMCResponse[]>(
      `https://api.spiget.org/v2/resources/${resourceId}/versions?sort=-id`,
      {
        validateStatus: () => true,
      }
    )
    if (response.status !== 200) {
      throw new ParseError(`Failed to get latest version of ${resourceId}`)
    }
    const items: SpigotMCVersionItem[] = response.data.map((item) => ({
      id: item.id,
      version: item.name,
      downloadUrl: `https://api.spiget.org/v2/resources/${resourceId}/versions/${item.id}/download`,
    }))
    return {
      latest: items[0],
      versions: items,
    }
  }
}
