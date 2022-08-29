import {PluginYml} from "./lib/PluginYml"
import fs from 'fs'
import Plugin from "@/lib/Plugin";
import * as readline from "readline";
import updatePlugin from "@/lib/UpdatePlugin";

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
  });
}

async function main() {
  const serverVersion = await getOneLineInput("server version: ")

  const dir = process.env.OLD_PLUGIN_DIR || 'plugins-old/'
  const newDir = process.env.NEW_PLUGIN_DIR || 'plugins/'
  if (fs.existsSync(newDir)) {
    fs.rmSync(newDir, { recursive: true, force: true })
  }
  fs.mkdirSync(newDir)
  const pluginsFiles = fs.readdirSync(dir)
  console.log("Plugin files:", pluginsFiles.length)
  for (const pluginFile of pluginsFiles) {
    const path = `${dir}${pluginFile}`
    const pluginYml = new PluginYml(path)
    const plugin = Plugin(pluginYml.main)
    if (!plugin) {
      console.warn(`Plugin ${pluginYml.name} is not found.`)
      console.log("Copy to new directory")
      fs.copyFileSync(path, `${newDir}${pluginFile}`)
      continue
    }

    console.log("Name:", pluginYml.name)
    console.log("Now version:", pluginYml.version)

    const result = await plugin.package.parse()
    console.log("Latest version:", result.latest.version)
    console.log("")
    const answer = await getOneLineInput("Do you want to update? (y/n): ")
    if (answer === "y") {
      await updatePlugin(plugin, result, serverVersion)
    }else{
      console.log("Copy to new directory")
      fs.copyFileSync(path, `${newDir}${pluginFile}`)
    }
    console.log("----------------------------------------------------")
  }
}

(async () => {
  await main()
})()
