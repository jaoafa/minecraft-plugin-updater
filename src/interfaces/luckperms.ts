export interface Downloads {
  bukkit: string
  'bukkit-legacy': string
  bungee: string
  fabric: string
  forge: string
  nukkit: string
  sponge: string
  velocity: string
}

export interface ChangeLog {
  version: string
  timestamp: number
  title: string
  commit: string
}

export interface PlaceholderExpansions {
  'bukkit-mvdw': string
  'bukkit-placeholderapi': string
  'fabric-placeholderapi': string
}

export interface Extensions {
  'extension-legacy-api': string
  'extension-default-assignments': string
}

export interface AdditionalPlugins {
  extracontexts: string
}

export interface LuckPermsMetadata {
  discordUserCount: number
  version: string
  versionTimestamp: number
  downloads: Downloads
  changeLog: ChangeLog[]
  placeholderExpansions: PlaceholderExpansions
  extensions: Extensions
  additionalPlugins: AdditionalPlugins
  patreonCount: number
}
