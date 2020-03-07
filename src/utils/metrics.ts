import prometheus = require('prom-client');

const collectDefaultMetrics = prometheus.collectDefaultMetrics
const Registry = prometheus.Registry
const register = new Registry()
collectDefaultMetrics({ register })

export default register
