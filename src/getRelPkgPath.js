const logger = require('./util/logger');
const log = logger.create('server-utils');

const getPkgRoot = require('./getPkgRoot');

const getRelPkgPath = (path) => {
    const pkgRoot = getPackageRoot();
    const relativePath = path.relative(pkgRoot, path);

    log.debug(`Relative: ${relativePath}`);
    return relativePath;
};