const glob = require('glob')

function fromDir(startPath, extension, callback) {
    glob(startPath + '/**/*'+extension, {}, (err, files)=>{
        callback(files)
    })
}

module.exports = fromDir;