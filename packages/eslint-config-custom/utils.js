function getFile(path = process.cwd(), fileName) {
  if (!fileName) {
    throw new Error('No fileName provided')
  }
  if (path === '/' || path === '') {
    throw new Error(`No ${fileName} found`)
  }
  try {
    return require(`${path}/${fileName}`)
  } catch (e) {
    const parentPath = path.split('/').slice(0, -1).join('/')
    return getFile(parentPath, fileName)
  }
}

function getFilePath(path = process.cwd(), fileName) {
  if (!fileName) {
    throw new Error('No fileName provided')
  }
  if (path === '/' || path === '') {
    throw new Error(`No ${fileName} found`)
  }
  try {
    const filePath = `${path}/${fileName}`
    require(filePath)
    return filePath
  } catch (e) {
    const parentPath = path.split('/').slice(0, -1).join('/')
    return getFilePath(parentPath, fileName)
  }
}

module.exports = {
  getFile,
  getFilePath,
}
