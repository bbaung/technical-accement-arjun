var Path = require('path');

const options = {
    multiExt: false
}

function parsePath(path) {
    var extname = options.multiExt
      ? Path.basename(path).slice(Path.basename(path).indexOf('.'))
      : Path.extname(path);
    return {
      dirname: Path.dirname(path),
      basename: Path.basename(path, extname),
      extname: extname
    };
 }


module.exports = parsePath