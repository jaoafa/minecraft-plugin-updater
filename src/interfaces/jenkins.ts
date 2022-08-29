export interface Caus {
  _class: string
  shortDescription: string
}

export interface Branch {
  SHA1: string
  name: string
}

export interface Marked {
  SHA1: string
  branch: Branch[]
}

export interface RevisionBranch {
  SHA1: string
  name: string
}

export interface Revision {
  SHA1: string
  branch: RevisionBranch[]
}

export interface BranchBuild {
  _class: string
  buildNumber: number
  // buildResult?: any
  marked: Marked
  revision: Revision
}

export interface Branch3 {
  SHA1: string
  name: string
}

export interface LastBuiltRevision {
  SHA1: string
  branch: Branch3[]
}

export interface Action {
  _class: string
  causes: Caus[]
  buildsByBranchName: {
    [key: string]: BranchBuild
  }
  lastBuiltRevision: LastBuiltRevision
  remoteUrls: string[]
  scmName: string
}

export interface Artifact {
  displayPath: string
  fileName: string
  relativePath: string
}

export interface Author {
  absoluteUrl: string
  fullName: string
}

export interface Path {
  editType: string
  file: string
}

export interface Item {
  _class: string
  affectedPaths: string[]
  commitId: string
  timestamp: number
  author: Author
  authorEmail: string
  comment: string
  date: string
  id: string
  msg: string
  paths: Path[]
}

export interface ChangeSet {
  _class: string
  items: Item[]
  kind: string
}

export interface Culprit {
  absoluteUrl: string
  fullName: string
}

export interface JenkinsResponse {
  _class: string
  actions: Action[]
  artifacts: Artifact[]
  building: boolean
  // description?: any
  displayName: string
  duration: number
  estimatedDuration: number
  // executor?: any
  fullDisplayName: string
  id: string
  keepLog: boolean
  number: number
  queueId: number
  result: string
  timestamp: number
  url: string
  builtOn: string
  changeSet: ChangeSet
  culprits: Culprit[]
  // mavenArtifacts: [];
  mavenVersionUsed: string
}
