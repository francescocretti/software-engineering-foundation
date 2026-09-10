import 'reflect-metadata'

// `ConfigModule.forRoot` reads the environment when `AppModule` is imported,
// so test-only configuration must be in place before any source module loads.
process.env.THROTTLE_LIMIT ??= '10'
process.env.THROTTLE_TTL_MS ??= '60000'
