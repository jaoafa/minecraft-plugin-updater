export default {
  '*.(js|ts)?(x)': filenames => {
    const rawFilePaths = filenames.map(file => {
      const cwd = process.cwd()
      const isMatchingPathFormat = file.includes(process.cwd())
      const correctCwd = isMatchingPathFormat ? cwd : cwd.replace(/\\/g, '/')
      const rawFilePath = file.replace(correctCwd, '.')
      return rawFilePath
    })

    return [
      `prettier --write ${rawFilePaths.join(' ')}`,
      `eslint . --fix ${rawFilePaths.join(' ')}`
    ]
  }
}