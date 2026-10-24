/# Learning — System Design and DevOps & Cloud Curriculum

This is a **reference curriculum** for importing into Learning's existing catalogs (`content/subjects.json`, `content/topics.json`, `content/concepts.json`). It is not a second runtime source of truth. Preserve existing stable subject/question IDs, notes, progress, and lesson associations during catalog migration.

The planned hierarchy remains **Subject → Topic → Lessons + Interview Questions**. Entries below are topic-level outlines, **not completed lessons**. No lesson or question counts should be inferred from these outlines.

## 1. System Design

**Target:** 35 focused topics. The supplied outline does **not** assign individual priorities. Leave them unset during transcription or propose priorities separately for approval; do not represent inferred priorities as source-provided.

| # | Topic | Coverage |
|---:|---|---|
| 1 | Introduction to System Design | HLD, LLD, requirements, design process |
| 2 | Capacity Estimation | QPS, storage, bandwidth, latency, throughput |
| 3 | Client-Server Architecture | Request flow, servers, stateless/stateful services |
| 4 | Load Balancing | Algorithms, health checks, L4 vs L7 |
| 5 | Horizontal & Vertical Scaling | Scaling approaches, bottlenecks |
| 6 | Consistent Hashing | Hash rings, virtual nodes, rebalancing |
| 7 | Caching Fundamentals | Cache strategies, TTL, eviction |
| 8 | Distributed Caching | Cache consistency, stampedes, invalidation |
| 9 | Content Delivery Networks | Edge caching, cache hierarchies, invalidation |
| 10 | Database Selection | SQL vs NoSQL, access patterns, trade-offs |
| 11 | Database Replication | Leaders, followers, replica lag, failover |
| 12 | Database Partitioning & Sharding | Partition keys, distribution, rebalancing |
| 13 | Distributed Consistency | Strong/eventual consistency, consistency models |
| 14 | CAP Theorem & Network Partitions | CAP assumptions, practical implications |
| 15 | Distributed Transactions | Two-phase commit, sagas, failure recovery |
| 16 | Concurrency Control | Optimistic/pessimistic locking, isolation, conflicts |
| 17 | Message Queues | Producers, consumers, delivery guarantees |
| 18 | Event-Driven Architecture | Pub/sub, event processing, outbox patterns |
| 19 | Stream Processing | Kafka concepts, partitions, offsets, processing |
| 20 | Rate Limiting | Token bucket, leaky bucket, sliding windows |
| 21 | Reliability Patterns | Timeouts, retries, circuit breakers, bulkheads |
| 22 | High Availability & Disaster Recovery | Redundancy, failover, backups, RPO/RTO |
| 23 | Distributed Coordination | Leader election, leases, consensus basics |
| 24 | Service Communication | REST, gRPC, gateways, service discovery |
| 25 | Real-Time Communication | WebSockets, SSE, long polling |
| 26 | Microservices & Monoliths | Boundaries, service decomposition, trade-offs |
| 27 | CQRS & Event Sourcing | Command/query separation, event logs |
| 28 | Observability in Distributed Systems | Logs, metrics, traces, monitoring |
| 29 | Low-Level Design Fundamentals | Classes, interfaces, modularity, UML |
| 30 | Design Patterns | Creational, structural, behavioral patterns |
| 31 | Object-Oriented Design Problems | Parking lot, elevator, library management |
| 32 | Distributed ID Generation | UUIDs, Snowflake-style IDs, ordering |
| 33 | Search System Architecture | Inverted indexes, search pipelines, ranking |
| 34 | AI System Architecture | RAG pipelines, model gateways, agent orchestration |
| 35 | End-to-End System Design | URL shortener, chat, payments, notifications, news feed |

### System Design authoring guidance

Topics should represent distinct mechanisms, engineering decisions, or skills. Do not split every concept into its own topic. For example, TTL and LRU eviction are lessons under **Caching Fundamentals**, while **Database Replication** and **Database Partitioning & Sharding** deserve separate topics. Detailed DBMS internals should have a canonical home in Core CS; System Design emphasizes architectural consequences and trade-offs.

**Example: Distributed Caching**

Potential lessons (not yet authored): Why distributed caching exists; cache-aside and write strategies; invalidation and stale data; stampedes and hot keys; consistency and failure scenarios.

Potential interview questions (not yet authored): What happens when Redis becomes unavailable? How would you handle a surge of requests for one key? Why could two application servers observe different cached values?

**Open review item:** Check the 35-topic list for gaps, overlap, and uneven scope before generating lessons. In particular, End-to-End System Design and AI System Architecture may later warrant more detailed subdivision, but do not change the supplied topic list silently.

## 2. DevOps & Cloud

**Target:** 44 focused topics in eight presentation groups. Priorities below are supplied by the curriculum and should be preserved.

### Group 1 — Linux & Server Administration

| # | Topic | Coverage | Priority |
|---:|---|---|---|
| 1 | Linux Fundamentals | Filesystems, shell, permissions, users, groups | Essential |
| 2 | Linux Process Management | Processes, signals, jobs, systemd, services | Essential |
| 3 | Linux Networking | IP, DNS, ports, routing, SSH, firewall, troubleshooting | Essential |
| 4 | Bash & Shell Scripting | Pipes, redirection, scripts, automation, cron | Essential |
| 5 | Linux Performance & Troubleshooting | CPU, RAM, disk I/O, logs, `top`, `ss`, `lsof`, `journalctl` | Important |

### Group 2 — Containers & Docker

| # | Topic | Coverage | Priority |
|---:|---|---|---|
| 6 | Container Fundamentals | Containers vs VMs, namespaces, cgroups, isolation | Essential |
| 7 | Docker Fundamentals | Images, containers, Dockerfiles, layers, registries | Essential |
| 8 | Docker Networking | Bridge, host networking, DNS, port publishing | Essential |
| 9 | Docker Storage | Volumes, bind mounts, persistence | Essential |
| 10 | Docker Compose | Multi-container applications, environment configuration, dependencies | Essential |
| 11 | Docker Optimization & Security | Multi-stage builds, image sizes, build cache, non-root execution, vulnerabilities | Important |

### Group 3 — CI/CD & Release Engineering

| # | Topic | Coverage | Priority |
|---:|---|---|---|
| 12 | CI/CD Fundamentals | Pipelines, build, test, deploy, continuous delivery vs deployment | Essential |
| 13 | GitHub Actions | Workflows, jobs, runners, secrets, artifacts, reusable workflows | Essential |
| 14 | GitLab CI / Jenkins | Alternative CI/CD systems, pipelines, agents, shared runners | Important |
| 15 | Deployment Strategies | Rolling deployments, blue-green, canary, rollback | Essential |
| 16 | GitOps & Argo CD | Desired state, reconciliation, Argo CD, automated delivery | Important |

### Group 4 — Cloud Computing & Infrastructure

| # | Topic | Coverage | Priority |
|---:|---|---|---|
| 17 | Cloud Fundamentals | IaaS, PaaS, SaaS, regions, availability zones, shared responsibility | Essential |
| 18 | Cloud Compute | VMs, instance types, autoscaling, managed containers, serverless | Essential |
| 19 | Cloud Networking | VPC, subnets, route tables, gateways, security groups, NAT | Essential |
| 20 | Cloud Storage & Databases | Object/block storage, managed SQL/NoSQL, backups | Essential |
| 21 | Cloud IAM & Security | Identities, roles, policies, least privilege, credentials | Essential |
| 22 | Cloud Cost & Architecture | Pricing, right-sizing, cost monitoring, availability trade-offs | Important |

**Teaching platform:** AWS can serve as the main worked-example cloud, with brief Azure and GCP comparisons. Avoid three redundant provider-specific curricula.

### Group 5 — Infrastructure as Code & Configuration Management

| # | Topic | Coverage | Priority |
|---:|---|---|---|
| 23 | Infrastructure as Code Fundamentals | Declarative vs imperative, infrastructure lifecycle, configuration drift | Essential |
| 24 | Terraform Fundamentals | HCL, resources, data sources, providers, variables, outputs | Essential |
| 25 | Terraform State & Modules | State files, remote backends, locking, modules, dependency graphs | Important |
| 26 | Ansible & Configuration Management | Inventories, playbooks, roles, idempotent configuration | Important |

### Group 6 — Kubernetes & Container Orchestration

| # | Topic | Coverage | Priority |
|---:|---|---|---|
| 27 | Kubernetes Architecture | Control plane, API server, scheduler, controllers, etcd, kubelet | Essential |
| 28 | Pods & Workload Controllers | Pods, Deployments, ReplicaSets, StatefulSets, DaemonSets, Jobs | Essential |
| 29 | Kubernetes Networking | Services, DNS, Gateway API, Ingress, CNI, NetworkPolicies | Essential |
| 30 | Kubernetes Configuration & Storage | ConfigMaps, Secrets, PVs, PVCs, StorageClasses | Essential |
| 31 | Kubernetes Scheduling & Scaling | Requests, limits, HPA, node scheduling, taints, tolerations | Important |
| 32 | Kubernetes Security & Troubleshooting | RBAC, service accounts, probes, logs, failed pods, cluster failures | Important |
| 33 | Helm & Package Management | Charts, templates, values, releases, upgrades | Important |

### Group 7 — Monitoring, Logging & Observability

| # | Topic | Coverage | Priority |
|---:|---|---|---|
| 34 | Observability Fundamentals | Metrics, logs, traces, instrumentation, telemetry | Essential |
| 35 | Prometheus & PromQL | Exporters, scraping, time-series metrics, labels, PromQL, recording rules | Essential |
| 36 | Grafana & Dashboards | Data sources, dashboards, visualization, alerting | Essential |
| 37 | Centralized Logging | Loki, Elasticsearch/OpenSearch, log aggregation, structured logs | Important |
| 38 | Distributed Tracing | OpenTelemetry, trace context, spans, Jaeger, sampling | Important |
| 39 | Alerting & Incident Diagnosis | Alertmanager, actionable alerts, thresholds, incident investigation | Important |

### Group 8 — Reliability, Security & Operations

| # | Topic | Coverage | Priority |
|---:|---|---|---|
| 40 | SRE Fundamentals | SLIs, SLOs, error budgets, reliability engineering | Important |
| 41 | Incident Management | Incident response, escalation, postmortems, root-cause analysis | Important |
| 42 | Backup & Disaster Recovery | Backups, restoration, RPO, RTO, failover | Important |
| 43 | DevSecOps & Supply Chain Security | Image scanning, dependency scanning, secrets, SBOM, artifact signing | Important |
| 44 | Performance & Capacity Planning | Load tests, resource saturation, capacity forecasts, bottlenecks | Important |

### DevOps authoring guidance

These groups are for navigation, not a new compulsory hierarchy between Subject and Topic. Teach durable mechanisms rather than making the content entirely tool-dependent. AWS is a primary example, not a required cloud account. Focus early study on Linux, Docker, CI/CD, cloud concepts, Terraform basics, Kubernetes basics, observability, and production troubleshooting. Ansible, advanced cluster administration, and specialized SRE subjects can be deferred for backend SWE preparation.

The topic order is a recommended progression, **not** a strict prerequisite chain; monitoring can be taught using a small Python service before Kubernetes.

## 3. Integration rules for the coding agent

1. Read the current catalogs and identify existing subject/topic IDs before generating new IDs. Keep IDs stable wherever possible.
2. Make the existing catalogs the only active source of truth; treat this Markdown file as an import and review reference.
3. Preserve all published lesson/question IDs and personal data, including custom questions, notes, review states, deletion markers, and frozen legacy migration references.
4. Map or retain old topic references safely; do not strand any published content when replacing broad topics.
5. Populate only topic metadata: title, coverage/description, priority where specified, group where applicable, and planning status. Do not create empty lessons or pretend planned material has been authored.
6. Show planned versus published material accurately in navigation and counts.
7. If the schema requires a priority for System Design topics, propose values for approval or explicitly document a deterministic migration rule—do not claim priorities were provided here.
8. Detect duplicates, missing references, and content compatibility problems during validation.
9. Report separately any possible curriculum gaps or cross-subject overlap; do not silently rewrite the supplied topic names or coverage.
10. Keep static Vite/Vercel deployment and avoid a backend, database, or runtime AI dependency.
