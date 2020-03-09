import prometheus = require('prom-client');

const collectDefaultMetrics = prometheus.collectDefaultMetrics
const Registry = prometheus.Registry
const register = new Registry()
collectDefaultMetrics({ register })

export const CPU_GAUGE = new prometheus.Gauge({ name: 'minitwit_cpu_load_percent', help: 'Current load of the CPU in percent.', registers: [register] })
export const RESPONSE_COUNTER = new prometheus.Counter({ name: 'minitwit_http_responses_total', help: 'The count of HTTP responses sent.', registers: [register] })
export const REQ_DURATION_SUMMARY = new prometheus.Histogram({ name: 'minitwit_request_duration_milliseconds', help: 'Request duration distribution.', registers: [register] })

export default register
