# 📊 Observability Stack Guide

> **Complete monitoring, logging, and tracing infrastructure for UltraThinking Monorepo**

---

## 🎯 Overview

The Observability Stack provides comprehensive insights into the health, performance, and behavior of all microservices.

### Components

- **📊 Prometheus** - Metrics collection and storage
- **📈 Grafana** - Visualization and dashboards
- **📝 Loki** - Log aggregation
- **🔍 Jaeger** - Distributed tracing
- **🚨 Alertmanager** - Alert routing and notifications
- **📡 Node Exporter** - Host metrics
- **🐳 cAdvisor** - Container metrics

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         Grafana (Port 3100)                      │
│              Unified Dashboards & Visualization                  │
└───────┬───────────────────┬──────────────────┬───────────────────┘
        │                   │                  │
        ▼                   ▼                  ▼
┌───────────────┐   ┌──────────────┐   ┌──────────────┐
│  Prometheus   │   │     Loki     │   │    Jaeger    │
│  (Port 9090)  │   │ (Port 3101)  │   │ (Port 16686) │
│    Metrics    │   │     Logs     │   │    Traces    │
└───────┬───────┘   └──────┬───────┘   └──────┬───────┘
        │                  │                  │
        │   ┌──────────────┴────────┬─────────┘
        │   │                       │
        ▼   ▼                       ▼
┌─────────────────────────────────────────────────────┐
│            All Microservices + Exporters            │
│  - API Gateway  - Web Services  - Apps              │
│  - Backend Services  - Node Exporter  - cAdvisor    │
└─────────────────────────────────────────────────────┘
```

---

## 📊 Prometheus Configuration

### Service Discovery

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    cluster: 'ultrathinking-prod'
    region: 'us-east-1'

# Alertmanager configuration
alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - alertmanager:9093

# Rule files
rule_files:
  - "alerts/*.yml"

# Scrape configs
scrape_configs:
  # Prometheus itself
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  # Node Exporter
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  # cAdvisor
  - job_name: 'cadvisor'
    static_configs:
      - targets: ['cadvisor:8080']

  # API Gateway
  - job_name: 'api-gateway'
    metrics_path: '/metrics'
    static_configs:
      - targets: ['service-api-gateway:4000']
    relabel_configs:
      - source_labels: [__address__]
        target_label: instance
        replacement: 'api-gateway'

  # Web Services
  - job_name: 'web-services'
    metrics_path: '/metrics'
    static_configs:
      - targets:
          - 'web-clisonix-main:8000'
          - 'web-ultrathinking:8003'
    relabel_configs:
      - source_labels: [__address__]
        regex: '(.+):(\d+)'
        target_label: service
        replacement: '$1'

  # Applications
  - job_name: 'apps'
    metrics_path: '/api/metrics'
    static_configs:
      - targets:
          - 'app-starbooking:3000'
          - 'app-harmonic:3001'
          - 'app-cwy:3002'

  # Backend Services
  - job_name: 'backend-services'
    metrics_path: '/metrics'
    static_configs:
      - targets:
          - 'service-auth:5100'
          - 'service-clisonix-cloud:5000'
          - 'service-kloud-hardware:6000'

  # PostgreSQL
  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']

  # Redis
  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']
```

---

## 🚨 Alert Rules

### Critical Alerts

```yaml
# alerts/critical.yml
groups:
  - name: critical_alerts
    interval: 30s
    rules:
      # Service Down
      - alert: ServiceDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Service {{ $labels.job }} is down"
          description: "{{ $labels.instance }} has been down for more than 1 minute."

      # High Error Rate
      - alert: HighErrorRate
        expr: |
          rate(http_requests_total{status=~"5.."}[5m]) / 
          rate(http_requests_total[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate on {{ $labels.service }}"
          description: "Error rate is {{ humanizePercentage $value }} (threshold: 5%)"

      # Database Connection Pool Exhausted
      - alert: DatabaseConnectionPoolExhausted
        expr: |
          (database_connections_active / database_connections_max) > 0.9
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Database connection pool nearly exhausted"
          description: "{{ $labels.instance }} is using {{ humanizePercentage $value }} of available connections"

      # High Memory Usage
      - alert: HighMemoryUsage
        expr: |
          (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / 
          node_memory_MemTotal_bytes > 0.9
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage on {{ $labels.instance }}"
          description: "Memory usage is {{ humanizePercentage $value }}"

      # Disk Space Low
      - alert: DiskSpaceLow
        expr: |
          (node_filesystem_avail_bytes{mountpoint="/"} / 
          node_filesystem_size_bytes{mountpoint="/"}) < 0.1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Low disk space on {{ $labels.instance }}"
          description: "Only {{ humanizePercentage $value }} disk space remaining"

      # High API Latency
      - alert: HighAPILatency
        expr: |
          histogram_quantile(0.95, 
            rate(http_request_duration_seconds_bucket[5m])
          ) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High API latency on {{ $labels.service }}"
          description: "95th percentile latency is {{ $value }}s (threshold: 1s)"
```

---

## 📈 Grafana Dashboards

### Pre-configured Dashboards

1. **System Overview**
   - All services status
   - Request rates
   - Error rates
   - Latency percentiles

2. **API Gateway Dashboard**
   - Request throughput
   - Authentication success/failure
   - Rate limiting hits
   - Response times by endpoint

3. **Service Health Dashboard**
   - CPU usage per service
   - Memory usage per service
   - Network I/O
   - Container restart count

4. **Database Dashboard**
   - Connection pool usage
   - Query performance
   - Slow queries
   - Transaction rates

5. **Business Metrics Dashboard**
   - User registrations
   - Active sessions
   - Bookings created
   - Revenue metrics

---

## 📝 Loki Configuration

### Log Aggregation

```yaml
# loki-config.yml
auth_enabled: false

server:
  http_listen_port: 3101
  grpc_listen_port: 9096

common:
  path_prefix: /tmp/loki
  storage:
    filesystem:
      chunks_directory: /tmp/loki/chunks
      rules_directory: /tmp/loki/rules
  replication_factor: 1
  ring:
    kvstore:
      store: inmemory

schema_config:
  configs:
    - from: 2020-10-24
      store: boltdb-shipper
      object_store: filesystem
      schema: v11
      index:
        prefix: index_
        period: 24h

# Retention
limits_config:
  retention_period: 168h  # 7 days
  max_query_length: 0h
```

### Promtail (Log Shipper)

```yaml
# promtail-config.yml
server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://loki:3101/loki/api/v1/push

scrape_configs:
  # Docker containers
  - job_name: docker
    docker_sd_configs:
      - host: unix:///var/run/docker.sock
        refresh_interval: 5s
    relabel_configs:
      - source_labels: ['__meta_docker_container_name']
        regex: '/(.*)'
        target_label: 'container'
      - source_labels: ['__meta_docker_container_log_stream']
        target_label: 'stream'

  # Application logs
  - job_name: apps
    static_configs:
      - targets:
          - localhost
        labels:
          job: apps
          __path__: /var/log/apps/*.log

  # System logs
  - job_name: syslog
    static_configs:
      - targets:
          - localhost
        labels:
          job: syslog
          __path__: /var/log/syslog
```

---

## 🔍 Jaeger Tracing

### Configuration

```yaml
# jaeger-config.yml
collector:
  zipkin:
    http-port: 9411

storage:
  type: elasticsearch
  elasticsearch:
    server-urls: http://elasticsearch:9200
    index-prefix: jaeger

ui:
  basePath: /jaeger
```

### Instrumentation Example (Python)

```python
from opentelemetry import trace
from opentelemetry.exporter.jaeger.thrift import JaegerExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

# Configure Jaeger exporter
jaeger_exporter = JaegerExporter(
    agent_host_name="jaeger",
    agent_port=6831,
)

# Set up tracer provider
provider = TracerProvider()
processor = BatchSpanProcessor(jaeger_exporter)
provider.add_span_processor(processor)
trace.set_tracer_provider(provider)

# Get tracer
tracer = trace.get_tracer(__name__)

# Use in code
@app.get("/api/patients")
async def get_patients():
    with tracer.start_as_current_span("get_patients"):
        # Your code here
        pass
```

---

## 🚀 Deployment

### Docker Compose

```yaml
# Add to docker-compose.yml
services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./infra/infra-docker/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - ./infra/infra-docker/prometheus/alerts:/etc/prometheus/alerts
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=30d'
    networks:
      - ultrathinking-network

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    ports:
      - "3100:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD:-admin}
      - GF_USERS_ALLOW_SIGN_UP=false
    volumes:
      - ./infra/infra-docker/grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./infra/infra-docker/grafana/datasources:/etc/grafana/provisioning/datasources
      - grafana_data:/var/lib/grafana
    networks:
      - ultrathinking-network
    depends_on:
      - prometheus
      - loki

  loki:
    image: grafana/loki:latest
    container_name: loki
    ports:
      - "3101:3101"
    volumes:
      - ./infra/infra-docker/loki/loki-config.yml:/etc/loki/local-config.yaml
      - loki_data:/tmp/loki
    command: -config.file=/etc/loki/local-config.yaml
    networks:
      - ultrathinking-network

  promtail:
    image: grafana/promtail:latest
    container_name: promtail
    volumes:
      - ./infra/infra-docker/promtail/promtail-config.yml:/etc/promtail/config.yml
      - /var/log:/var/log
      - /var/run/docker.sock:/var/run/docker.sock
    command: -config.file=/etc/promtail/config.yml
    networks:
      - ultrathinking-network
    depends_on:
      - loki

  jaeger:
    image: jaegertracing/all-in-one:latest
    container_name: jaeger
    ports:
      - "5775:5775/udp"
      - "6831:6831/udp"
      - "6832:6832/udp"
      - "5778:5778"
      - "16686:16686"
      - "14268:14268"
      - "14250:14250"
      - "9411:9411"
    environment:
      - COLLECTOR_ZIPKIN_HTTP_PORT=9411
    networks:
      - ultrathinking-network

  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
    networks:
      - ultrathinking-network

  cadvisor:
    image: gcr.io/cadvisor/cadvisor:latest
    container_name: cadvisor
    ports:
      - "8080:8080"
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:rw
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
    networks:
      - ultrathinking-network

volumes:
  prometheus_data:
  grafana_data:
  loki_data:
```

---

## 📊 Accessing Dashboards

Once deployed, access:

- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3100 (admin / admin)
- **Jaeger**: http://localhost:16686
- **cAdvisor**: http://localhost:8080

---

## 🔧 Best Practices

1. **Metrics Naming** - Use consistent naming conventions
2. **Label Cardinality** - Avoid high-cardinality labels
3. **Retention** - Configure appropriate retention periods
4. **Alerting** - Set meaningful thresholds
5. **Dashboard Organization** - Group related metrics
6. **Log Structured Format** - Use JSON for logs
7. **Sampling** - Use trace sampling in high-traffic services

---

**Last Updated:** April 11, 2026
