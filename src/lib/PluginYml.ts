import AdmZip from 'adm-zip'
import yaml from 'js-yaml'

export interface IPluginYml {
  name: string
  main: string
  version: string
  description: string
}

export class PluginYml {
  readonly name: string
  readonly version: string
  readonly main: string

  constructor(filepath: string) {
    const zip = new AdmZip(filepath)
    const entry = zip.getEntry('plugin.yml')
    if (!entry) {
      throw new Error('plugin.yml not found')
    }
    const content = zip.readAsText(entry)
    const object = yaml.load(content) as IPluginYml
    this.name = object.name
    this.version = object.version
    this.main = object.main
  }
}
