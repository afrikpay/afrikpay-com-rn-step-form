const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];

// 2. Let Metro know where to resolve packages and force them to the project's node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. Force resolution to the local node_modules for critical packages to avoid multiple instances
// We use a Proxy to ensure all resolutions for these packages go to the projectRoot
const extraNodeModules = {
  'react': path.resolve(projectRoot, 'node_modules/react'),
  'react-native': path.resolve(projectRoot, 'node_modules/react-native'),
  '@expo/vector-icons': path.resolve(
    projectRoot,
    'node_modules/@expo/vector-icons'
  ),
  'react-native-paper': path.resolve(
    projectRoot,
    'node_modules/react-native-paper'
  ),
  'react-hook-form': path.resolve(projectRoot, 'node_modules/react-hook-form'),
};

config.resolver.extraNodeModules = new Proxy(extraNodeModules, {
  get: (target, name) => {
    if (target[name]) {
      return target[name];
    }
    return path.join(projectRoot, `node_modules/${name}`);
  },
});

// 4. Important: Block any node_modules resolution from the library root to avoid conflicts
config.resolver.blockList = [
  new RegExp(`${path.resolve(workspaceRoot, 'node_modules')}/react/.*`),
  new RegExp(`${path.resolve(workspaceRoot, 'node_modules')}/react-native/.*`),
];

module.exports = config;
