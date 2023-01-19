module.exports = {
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    // Important: return the modified config
    config.experiments.syncWebAssembly = true
    config.experiments.asyncWebAssembly = true
    return config
  },
}
