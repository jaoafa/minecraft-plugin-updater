import Plugin from '@/lib/Plugin'
import updatePlugin from '@/lib/UpdatePlugin'
import fs from 'fs'
import * as readline from 'readline'
import { PluginYml } from './lib/PluginYml'

function getOneLineInput(question: string): Promise<string> {
  return new Promise<string>((resolve) => {
    const readlineInterface = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    readlineInterface.question(question, (answer) => {
      resolve(answer)
      readlineInterface.close()
    })
  })
}

async function mainUpdating() {
  const serverVersion = await getOneLineInput('server version: ')

  const dir = process.env.OLD_PLUGIN_DIR || 'plugins-old/'
  const newDir = process.env.NEW_PLUGIN_DIR || 'plugins/'
  if (fs.existsSync(newDir)) {
    fs.rmSync(newDir, { recursive: true, force: true })
  }
  fs.mkdirSync(newDir)
  const pluginsFiles = fs.readdirSync(dir)
  console.log('Plugin files:', pluginsFiles.length)
  for (const pluginFile of pluginsFiles) {
    const path = `${dir}${pluginFile}`
    const pluginYml = new PluginYml(path)
    const plugin = Plugin(pluginYml.main)
    if (!plugin) {
      console.warn(`Plugin ${pluginYml.name} is not found.`)
      console.log('Copy to new directory')
      fs.copyFileSync(path, `${newDir}${pluginFile}`)
      continue
    }

    console.log('Name:', pluginYml.name)
    console.log('Now version:', pluginYml.version)

    const result = await plugin.package.parse()
    console.log('Latest version:', result.latest.version)
    console.log('')
    const answer = await getOneLineInput('Do you want to update? (y/n): ')
    if (answer === 'y') {
      await updatePlugin(plugin, result, serverVersion)
    } else {
      console.log('Copy to new directory')
      fs.copyFileSync(path, `${newDir}${pluginFile}`)
    }
    console.log('----------------------------------------------------')
  }
}

async function mainDiff() {
  const dir = process.env.OLD_PLUGIN_DIR || 'plugins-old/'
  const newDir = process.env.NEW_PLUGIN_DIR || 'plugins/'
  if (!fs.existsSync(dir)) {
    console.error('Old directory is not found')
    return
  }
  if (!fs.existsSync(newDir)) {
    console.error('New directory not found')
    return
  }
  const pluginsFiles = fs.readdirSync(dir).map((p) => {
    return new PluginYml(`${dir}${p}`)
  })
  const newPluginsFiles = fs.readdirSync(newDir).map((p) => {
    return new PluginYml(`${newDir}${p}`)
  })
  console.log(
    'Plugin files:',
    pluginsFiles.length,
    '->',
    newPluginsFiles.length
  )

  const diff = pluginsFiles.filter((p) => {
    return newPluginsFiles.find((np) => np.main === p.main)
  })

  console.log('Diff:', diff.length)
  console.log('----------------------------------------------------')

  for (const plugin of diff) {
    const newPlugin = newPluginsFiles.find(
      (np) => np.main === plugin.main
    ) as PluginYml
    if (plugin.version === newPlugin.version) {
      continue
    }
    console.log(`${plugin.name}: ${plugin.version} -> ${newPlugin.version}`)
  }
  console.log('----------------------------------------------------')
}

;(async () => {
  const target = await getOneLineInput('Select target(update or diff): ')
  switch (target) {
    case 'update':
      await mainUpdating()
      break
    case 'diff':
      await mainDiff()
      break
    default:
      console.error('Invalid target')
  }
})()
