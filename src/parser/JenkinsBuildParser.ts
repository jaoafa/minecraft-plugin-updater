import { JenkinsResponse } from '@/interfaces/jenkins'
import axios from 'axios'
import {
  BaseParser,
  BaseParserOptions,
  BaseParserResult,
  ParseError,
} from './BaseParser'

export interface JenkinsBuildOptions extends BaseParserOptions {
  domain: string
  jobName: string
}

interface JenkinsVersionItem {
  id: number
  version: string
  downloadUrl: string
}

export interface JenkinsBuildResult extends BaseParserResult {
  latest: JenkinsVersionItem
}

export class JenkinsBuildParser extends BaseParser<
  JenkinsBuildOptions,
  JenkinsBuildResult
> {
  async parse(): Promise<JenkinsBuildResult> {
    const { domain, jobName } = this.options
    const response = await axios.get<JenkinsResponse>(
      `https://${domain}/job/${jobName}/lastSuccessfulBuild/api/json`,
      {
        validateStatus: () => true,
      }
    )
    if (response.status !== 200) {
      throw new ParseError(
        `Failed to get latest version of ${domain}/${jobName}`
      )
    }
    const filename = response.data.artifacts[0].relativePath
    const downloadUrl = `https://${domain}/job/${jobName}/lastSuccessfulBuild/artifact/${filename}`
    return {
      latest: {
        id: response.data.number,
        version: response.data.number.toString(),
        downloadUrl,
      },
    }
  }
}
