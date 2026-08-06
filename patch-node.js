const fs = require('fs');

function patchFs(fsModule) {
  if (!fsModule || fsModule.__readlink_patched) return;
  fsModule.__readlink_patched = true;

  const originalReadlink = fsModule.readlink;
  const originalReadlinkSync = fsModule.readlinkSync;

  if (originalReadlink) {
    fsModule.readlink = function (path, options, callback) {
      const cb = typeof options === 'function' ? options : callback;
      const opts = typeof options === 'function' ? {} : options;

      originalReadlink.call(fsModule, path, opts, (err, linkString) => {
        if (err && (err.code === 'EISDIR' || err.code === 'UNKNOWN')) {
          try {
            const lstat = fsModule.lstatSync(path);
            if (!lstat.isSymbolicLink()) {
              err.code = 'EINVAL';
            }
          } catch (_) {}
        }
        if (cb) cb(err, linkString);
      });
    };
  }

  if (originalReadlinkSync) {
    fsModule.readlinkSync = function (path, options) {
      try {
        return originalReadlinkSync.call(fsModule, path, options);
      } catch (err) {
        if (err && (err.code === 'EISDIR' || err.code === 'UNKNOWN')) {
          try {
            const lstat = fsModule.lstatSync(path);
            if (!lstat.isSymbolicLink()) {
              err.code = 'EINVAL';
            }
          } catch (_) {}
        }
        throw err;
      }
    };
  }
}

patchFs(fs);

try {
  const gfs = require('graceful-fs');
  patchFs(gfs);
} catch (_) {}

console.log('[Node-Patch] Applied fs.readlink EISDIR -> EINVAL patch for Node 24 Windows.');
