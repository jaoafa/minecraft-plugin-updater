import axios from 'axios'
import * as cheerio from 'cheerio'
import {BaseParser, BaseParserOptions, ParseError} from './BaseParser'
import {BukkitPageTableItem} from "@/interfaces/bukkit-table";

export interface BukkitOptions extends BaseParserOptions {
  projectId: string
}

export interface BukkitVersionItem {
  name: string
  version: string
  gameVersions: string[]
  downloadUrl: string
}

export type BukkitResult = {
  latest: BukkitVersionItem,
  versions: BukkitVersionItem[]
}

export class BukkitParser extends BaseParser<BukkitOptions, BukkitResult> {
  async parse(): Promise<BukkitResult> {
    const projectId = this.options.projectId
    const response = await axios.get(
        `https://dev.bukkit.org/projects/${projectId}/files`,
        {
          validateStatus: () => true
        }
    )
    if (response.status !== 200) {
      throw new ParseError(`Failed to get latest version of ${projectId}`)
    }
    const $ = cheerio.load(response.data)
    const trs: BukkitPageTableItem[] = []
    /* | Type | Name | Size | Uploaded | Game Version | Downloads | */
    $("table.project-file-listing > tbody > tr").each((_, tr) => {
      const epochText = $(tr).find("td.project-file-date-uploaded > abbr").attr("data-epoch")
      if (!epochText) {
        return
      }
      const epoch = parseInt(epochText, 10) * 1000
      const gameVersion = $(tr).find("td.project-file-game-version > span.version-label").text().trim()
      const addicional = $(tr).find("span.additional-versions")
      const rawOtherGameVersion = addicional.length > 0 ? addicional.attr("title")?.trim() as string : ""
      const otherGameVersion = rawOtherGameVersion
          .replaceAll("</div><div>", ",")
          .replaceAll("<div>", "")
          .replaceAll("</div>", "")
          .split(",")
          .map(v => v.trim())
          .filter(v => v.length > 0)
      const gameVersions = [gameVersion, ...otherGameVersion]
      const downloadRelativePath = $(tr).find("td.project-file-name div.project-file-download-button a").attr("href")
      trs.push({
        type: $(tr).find("td.project-file-release-type > div").attr("title"),
        name: $(tr).find("td.project-file-name div.project-file-name-container").text().trim(),
        size: $(tr).find("td.project-file-size").text().trim(),
        uploaded: new Date(epoch),
        gameVersions,
        downloads: $(tr).find("td.project-file-downloads").text().trim().replaceAll(",", ""),
        downloadUrl: "https://dev.bukkit.org" + downloadRelativePath,
      })
    })

    const latest = trs[0]
    return {
      latest: {
        name: latest.name,
        version: BukkitParser.getVersion(latest.name),
        gameVersions: latest.gameVersions,
        downloadUrl: latest.downloadUrl,
      },
      versions: trs.map(tr => ({
        name: tr.name,
        version: BukkitParser.getVersion(tr.name),
        gameVersions: tr.gameVersions,
        downloadUrl: tr.downloadUrl,
      })),
    }
  }

  private static getVersion(name: string): string {
    const regex = {
      SEMVER: /v?(\d+)\.(\d+)\.(\d+)(?:-([\dA-Za-z-]+(?:\.[\dA-Za-z-]+)*))?(?:\+[\dA-Za-z-]+)?/,
      TWOVER: /v(\d+)\.(\d+)/,
    }
    const semverMatch = name.match(regex.SEMVER)
    if (semverMatch) {
      return semverMatch[0]
    }
    const twoverMatch = name.match(regex.TWOVER)
    if (twoverMatch) {
      return twoverMatch[0]
    }
    return name
  }
}
