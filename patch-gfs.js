const fs = require('fs');
const path = require('path');

const polyfillsPath = path.join(__dirname, 'node_modules', 'graceful-fs', 'polyfills.js');

if (fs.existsSync(polyfillsPath)) {
  let content = fs.readFileSync(polyfillsPath, 'utf8');

  const patchSnippet = `
  if (!fs.__readlink_patched) {
    fs.__readlink_patched = true;
    var origReadlink = fs.readlink;
    var origReadlinkSync = fs.readlinkSync;
    if (origReadlink) {
      fs.readlink = function(p, opts, cb) {
        var callback = typeof opts === 'function' ? opts : cb;
        var options = typeof opts === 'function' ? {} : opts;
        origReadlink.call(fs, p, options, function(err, link) {
          if (err && (err.code === 'EISDIR' || err.code === 'UNKNOWN')) {
            try {
              var lst = fs.lstatSync(p);
              if (!lst.isSymbolicLink()) err.code = 'EINVAL';
            } catch (_) {}
          }
          if (callback) callback(err, link);
        });
      };
    }
    if (origReadlinkSync) {
      fs.readlinkSync = function(p, opts) {
        try {
          return origReadlinkSync.call(fs, p, opts);
        } catch (err) {
          if (err && (err.code === 'EISDIR' || err.code === 'UNKNOWN')) {
            try {
              var lst = fs.lstatSync(p);
              if (!lst.isSymbolicLink()) err.code = 'EINVAL';
            } catch (_) {}
          }
          throw err;
        }
      };
    }
  }
`;

  if (!content.includes('__readlink_patched')) {
    content = content.replace('function patch (fs) {', 'function patch (fs) {' + patchSnippet);
    fs.writeFileSync(polyfillsPath, content, 'utf8');
    console.log('Successfully patched graceful-fs/polyfills.js for Node 24 Windows!');
  }
}
