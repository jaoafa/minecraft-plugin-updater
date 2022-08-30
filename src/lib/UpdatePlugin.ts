import { BukkitResult } from '@/parser/BukkitParser'
import { GitHubReleaseResult } from '@/parser/GitHubReleaseParser'
import { JenkinsBuildResult } from '@/parser/JenkinsBuildParser'
import { SpigotMCResult } from '@/parser/SpigotMCParser'
import { LuckPermsResult } from '@/parser/LuckPermsParser'
import { IPlugin } from '@/lib/Plugin'
import open from 'open'
import axios from 'axios'
import fs from 'fs'
import AdmZip from 'adm-zip'

type ParserResults =
  | BukkitResult
  | GitHubReleaseResult
  | JenkinsBuildResult
  | SpigotMCResult
  | LuckPermsResult

function isJarFile(filename: string): boolean {
  // zip 解凍可能かどうか & plugin.yml があるかどうか

  try {
    const zip = new AdmZip(filename)
    const entry = zip.getEntry('plugin.yml')
    return entry !== null
  } catch (e) {
    return false
  }
}

async function download(url: string | undefined, filename: string) {
  if (!url) {
    console.warn('download failed')
    return
  }
  // まずはAxios経由でダウンロードしてみる
  const response = await axios.get(url, {
    responseType: 'stream',
    validateStatus: () => true,
  })
  if (response.status === 200) {
    response.data.pipe(fs.createWriteStream(filename))
    await new Promise((resolve) => {
      response.data.on('end', resolve)
    })
  }

  // それでもダウンロードできない場合は、openを使ってブラウザでダウンロードする
  if (!fs.existsSync(filename) || !isJarFile(filename)) {
    if (fs.existsSync(filename)) fs.rmSync(filename)
    console.log('download failed. open browser')
    await open(url)
  } else {
    console.log('download success')
  }
}

export default async function (
  plugin: IPlugin,
  result: ParserResults,
  serverVersion: string
) {
  const filename = `plugins/${plugin.name}-${result.latest.version}.jar`
  switch (plugin.package.constructor.name) {
    case 'BukkitParser': {
      const item = (result as BukkitResult).versions.find((v) =>
        v.gameVersions.includes(serverVersion)
      )
      if (!item) {
        console.warn(`${plugin.name} is not available for ${serverVersion}`)
        break
      }
      await download(item.downloadUrl, filename)
      break
    }
    case 'GitHubReleaseParser':
      await download(
        (result as GitHubReleaseResult).latest.downloadUrl,
        filename
      )
      break
    case 'JenkinsBuildParser':
      await download(
        (result as JenkinsBuildResult).latest.downloadUrl,
        filename
      )
      break
    case 'SpigotMCParser':
      await download((result as SpigotMCResult).latest.downloadUrl, filename)
      break
    case 'LuckPermsParser':
      await download((result as LuckPermsResult).latest.downloadUrl, filename)
      break
    default:
      throw new Error(`Unknown plugin type: ${plugin.package.constructor.name}`)
  }
}
