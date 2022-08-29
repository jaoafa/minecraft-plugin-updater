import axios from 'axios'
import {BaseParser, BaseParserOptions, BaseParserResult, ParseError} from './BaseParser'
import {LuckPermsMetadata} from "@/interfaces/luckperms";

interface LuckPermsVersionItemWithDownloadUrl {
  version: string
  releaseAt: Date
  downloadUrl: string
}

type LuckPermsVersionItem = Omit<LuckPermsVersionItemWithDownloadUrl, 'downloadUrl'>

export interface LuckPermsResult extends BaseParserResult {
  latest: LuckPermsVersionItemWithDownloadUrl
  versions: LuckPermsVersionItem[]
}

export class LuckPermsParser extends BaseParser<BaseParserOptions,
    LuckPermsResult> {
  constructor() {
    super({});
  }

  async parse(): Promise<LuckPermsResult> {
    const response = await axios.get<LuckPermsMetadata>(
        'https://metadata.luckperms.net/data/all',
        {
          validateStatus: () => true
        }
    )
    if (response.status !== 200) {
      throw new ParseError(
          'Failed to get latest version of LuckPerms'
      )
    }
    const latest = {
      version: response.data.version,
      releaseAt: new Date(response.data.versionTimestamp),
      downloadUrl: response.data.downloads.bukkit
    }
    const items: LuckPermsVersionItem[] = response.data.changeLog.map((item) => ({
      version: item.version,
      releaseAt: new Date(item.timestamp),
    }))
    return {
      latest,
      versions: items
    }
  }
}
