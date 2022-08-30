import { BukkitParser } from '@/parser/BukkitParser'
import { GitHubReleaseParser } from '@/parser/GitHubReleaseParser'
import { JenkinsBuildParser } from '@/parser/JenkinsBuildParser'
import { LuckPermsParser } from '@/parser/LuckPermsParser'
import { SpigotMCParser } from '@/parser/SpigotMCParser'

export type Parser =
  | BukkitParser
  | GitHubReleaseParser
  | JenkinsBuildParser
  | SpigotMCParser
  | LuckPermsParser

export interface IPlugin {
  name: string
  main: string
  package: Parser
}

const Plugin: IPlugin[] = [
  {
    name: 'ArmorStandEditor',
    main: 'io.github.rypofalem.armorstandeditor.ArmorStandEditorPlugin',
    package: new GitHubReleaseParser({
      repository: 'Wolfieheart/ArmorStandEditor',
    }),
  },
  {
    name: 'Citizens',
    main: 'net.citizensnpcs.Citizens',
    package: new JenkinsBuildParser({
      domain: 'ci.citizensnpcs.co',
      jobName: 'Citizens2',
    }),
  },
  {
    name: 'CoreProtect',
    main: 'net.coreprotect.CoreProtect',
    package: new GitHubReleaseParser({
      repository: 'PlayPro/CoreProtect',
    }),
  },
  {
    name: 'Denizen',
    main: 'com.denizenscript.denizen.Denizen',
    package: new JenkinsBuildParser({
      domain: 'ci.citizensnpcs.co',
      jobName: 'Denizen',
    }),
  },
  {
    name: 'Depenizen',
    main: 'com.denizenscript.depenizen.bukkit.Depenizen',
    package: new JenkinsBuildParser({
      domain: 'ci.citizensnpcs.co',
      jobName: 'Depenizen',
    }),
  },
  {
    name: 'DiscordSRV',
    main: 'github.scarsz.discordsrv.DiscordSRV',
    package: new GitHubReleaseParser({
      repository: 'DiscordSRV/DiscordSRV',
    }),
  },
  {
    name: 'dynmap',
    main: 'org.dynmap.bukkit.DynmapPlugin',
    package: new SpigotMCParser({
      resourceId: 274,
    }),
  },
  {
    name: 'Dynmap-WorldGuard',
    main: 'org.dynmap.worldguard.DynmapWorldGuardPlugin',
    package: new GitHubReleaseParser({
      repository: 'jaoafa/Dynmap-WorldGuard',
    }),
  },
  {
    name: 'FastAsyncWorldEdit',
    main: 'com.sk89q.worldedit.bukkit.WorldEditPlugin',
    package: new GitHubReleaseParser({
      repository: 'IntellectualSites/FastAsyncWorldEdit',
    }),
  },
  {
    name: 'GSit',
    main: 'dev.geco.gsit.GSitMain',
    package: new GitHubReleaseParser({
      repository: 'Gecolay/GSit',
    }),
  },
  {
    name: 'LiftReloaded',
    main: 'com.minecraftcorp.lift.bukkit.LiftPlugin',
    package: new GitHubReleaseParser({
      repository: 'kikelkik/LiftReloaded',
    }),
  },
  {
    name: 'LuckPerms',
    main: 'me.lucko.luckperms.bukkit.loader.BukkitLoaderPlugin',
    package: new LuckPermsParser(),
  },
  {
    name: 'LunaChat',
    main: 'com.github.ucchyocean.lc3.LunaChatBukkit',
    package: new GitHubReleaseParser({
      repository: 'ucchyocean/LunaChat',
    }),
  },
  {
    name: 'MinecartSpeedPlus',
    main: 'fi.dy.esav.Minecart_speedplus.Minecart_speedplus',
    package: new SpigotMCParser({
      resourceId: 69639,
    }),
  },
  {
    name: 'Multiverse-Core',
    main: 'com.onarandombox.MultiverseCore.MultiverseCore',
    package: new SpigotMCParser({
      resourceId: 390,
    }),
  },
  {
    name: 'NoteBlockAPI',
    main: 'com.xxmicloxx.NoteBlockAPI.NoteBlockAPI',
    package: new GitHubReleaseParser({
      repository: 'koca2000/NoteBlockAPI',
    }),
  },
  {
    name: 'NuVotifier',
    main: 'com.vexsoftware.votifier.NuVotifierBukkit',
    package: new GitHubReleaseParser({
      repository: 'NuVotifier/NuVotifier',
    }),
  },
  {
    name: 'PacketLimiter',
    main: 'ca.spottedleaf.packetlimiter.PacketLimiter',
    package: new GitHubReleaseParser({
      repository: 'spottedleaf/PacketLimiter',
    }),
  },
  {
    name: 'ProtocolChanger',
    main: 'net.simplyrin.protocolchanger.ProtocolChanger',
    package: new SpigotMCParser({
      resourceId: 42310,
    }),
  },
  {
    name: 'ProtocolLib',
    main: 'com.comphenix.protocol.ProtocolLib',
    package: new GitHubReleaseParser({
      repository: 'dmulloy2/ProtocolLib',
    }),
  },
  {
    name: 'Sentinel',
    main: 'org.mcmonkey.sentinel.SentinelPlugin',
    package: new SpigotMCParser({
      resourceId: 22017,
    }),
  },
  {
    name: 'spark',
    main: 'me.lucko.spark.bukkit.BukkitSparkPlugin',
    package: new SpigotMCParser({
      resourceId: 57242,
    }),
  },
  {
    name: 'TimingsGenerator',
    main: 'net.okocraft.timingsgenerator.TimingsGeneratorPlugin',
    package: new GitHubReleaseParser({
      repository: 'jaoafa/TimingsGenerator',
    }),
  },
  {
    name: 'ViaBackwards',
    main: 'com.viaversion.viabackwards.BukkitPlugin',
    package: new GitHubReleaseParser({
      repository: 'ViaVersion/ViaBackwards',
    }),
  },
  {
    name: 'ViaVersion',
    main: 'com.viaversion.viaversion.ViaVersionPlugin',
    package: new GitHubReleaseParser({
      repository: 'ViaVersion/ViaVersion',
    }),
  },
  {
    name: 'WorldEditSelectionVisualizer',
    main: 'fr.mrmicky.worldeditselectionvisualizer.WorldEditSelectionVisualizer',
    package: new GitHubReleaseParser({
      repository: 'MrMicky-FR/WorldEditSelectionVisualizer',
    }),
  },
  {
    name: 'WorldGuard',
    main: 'com.sk89q.worldguard.bukkit.WorldGuardPlugin',
    package: new BukkitParser({
      projectId: 'worldguard',
    }),
  },
  {
    name: 'WorldGuardExtraFlags',
    main: 'net.goldtreeservers.worldguardextraflags.WorldGuardExtraFlagsPlugin',
    package: new GitHubReleaseParser({
      repository: 'aromaa/WorldGuardExtraFlags',
    }),
  },
]

export default function (main: string): IPlugin | undefined {
  return Plugin.find((p) => p.main === main)
}
