import { GitHubRelease } from '@/interfaces/github-release'
import axios from 'axios'
import {
  BaseParser,
  BaseParserOptions,
  BaseParserResult,
  ParseError
} from './BaseParser'

export interface GitHubReleaseOptions extends BaseParserOptions {
  repository: string
}

export interface GitHubVersionItem {
  id: number
  name: string
  version: string
  downloadUrl?: string
}

export interface GitHubReleaseResult extends BaseParserResult {
  latest: GitHubVersionItem
  versions: GitHubVersionItem[]
}

export class GitHubReleaseParser extends BaseParser<
  GitHubReleaseOptions,
  GitHubReleaseResult
> {
  async parse(): Promise<GitHubReleaseResult> {
    const { repository } = this.options
    const response = await axios.get<GitHubRelease[]>(
      `https://api.github.com/repos/${repository}/releases`,
      {
        validateStatus: () => true
      }
    )
    if (response.status !== 200) {
      throw new ParseError(`Failed to get latest version of ${repository}`)
    }
    const items: GitHubVersionItem[] = response.data.map((item) => ({
      id: item.id,
      name: item.name,
      version: item.tag_name,
      downloadUrl: item.assets.length > 0 ? item.assets[0].browser_download_url : undefined
    }))
    return {
      latest: items[0],
      versions: items
    }
  }
}
