---
pillar: reliability
name: "Reliability"
question_count: 13
bp_count: 65
---

# Reliability

## Questions

### REL01 — REL 1. How do you manage Service Quotas and constraints?

- [REL01-BP01](../best-practices/REL01-BP01.md) — Aware of service quotas and constraints
- [REL01-BP02](../best-practices/REL01-BP02.md) — Manage service quotas across accounts and regions
- [REL01-BP03](../best-practices/REL01-BP03.md) — Accommodate fixed service quotas and constraints through architecture
- [REL01-BP04](../best-practices/REL01-BP04.md) — Monitor and manage quotas
- [REL01-BP05](../best-practices/REL01-BP05.md) — Automate quota management
- [REL01-BP06](../best-practices/REL01-BP06.md) — Ensure that a sufficient gap exists between the current quotas and the maximum usage to accommodate failover

### REL02 — REL 2. How do you plan your network topology?

- [REL02-BP01](../best-practices/REL02-BP01.md) — Use highly available network connectivity for your workload public endpoints
- [REL02-BP02](../best-practices/REL02-BP02.md) — Provision redundant connectivity between private networks in the cloud and on-premises environments
- [REL02-BP03](../best-practices/REL02-BP03.md) — Ensure IP subnet allocation accounts for expansion and availability
- [REL02-BP04](../best-practices/REL02-BP04.md) — Prefer hub-and-spoke topologies over many-to-many mesh
- [REL02-BP05](../best-practices/REL02-BP05.md) — Enforce non-overlapping private IP address ranges in all private address spaces where they are connected

### REL03 — REL 3. How do you design your workload service architecture?

- [REL03-BP01](../best-practices/REL03-BP01.md) — Choose how to segment your workload
- [REL03-BP02](../best-practices/REL03-BP02.md) — Build services focused on specific business domains and functionality
- [REL03-BP03](../best-practices/REL03-BP03.md) — Provide service contracts per API

### REL04 — REL 4. How do you design interactions in a distributed system to prevent failures?

- [REL04-BP01](../best-practices/REL04-BP01.md) — Identify the kind of distributed systems you depend on
- [REL04-BP02](../best-practices/REL04-BP02.md) — Implement loosely coupled dependencies
- [REL04-BP03](../best-practices/REL04-BP03.md) — Do constant work
- [REL04-BP04](../best-practices/REL04-BP04.md) — Make mutating operations idempotent

### REL05 — REL 5. How do you design interactions in a distributed system to mitigate or withstand failures?

- [REL05-BP01](../best-practices/REL05-BP01.md) — Implement graceful degradation to transform applicable hard dependencies into soft dependencies
- [REL05-BP02](../best-practices/REL05-BP02.md) — Throttle requests
- [REL05-BP03](../best-practices/REL05-BP03.md) — Control and limit retry calls
- [REL05-BP04](../best-practices/REL05-BP04.md) — Fail fast and limit queues
- [REL05-BP05](../best-practices/REL05-BP05.md) — Set client timeouts
- [REL05-BP06](../best-practices/REL05-BP06.md) — Make systems stateless where possible
- [REL05-BP07](../best-practices/REL05-BP07.md) — Implement emergency levers

### REL06 — REL 6. How do you monitor workload resources?

- [REL06-BP01](../best-practices/REL06-BP01.md) — Monitor all components for the workload (Generation)
- [REL06-BP02](../best-practices/REL06-BP02.md) — Define and calculate metrics (Aggregation)
- [REL06-BP03](../best-practices/REL06-BP03.md) — Send notifications (Real-time processing and alarming)
- [REL06-BP04](../best-practices/REL06-BP04.md) — Automate responses (Real-time processing and alarming)
- [REL06-BP05](../best-practices/REL06-BP05.md) — Analyze logs
- [REL06-BP06](../best-practices/REL06-BP06.md) — Regularly review monitoring scope and metrics
- [REL06-BP07](../best-practices/REL06-BP07.md) — Monitor end-to-end tracing of requests through your system

### REL07 — REL 7. How do you design your workload to adapt to changes in demand?

- [REL07-BP01](../best-practices/REL07-BP01.md) — Use automation when obtaining or scaling resources
- [REL07-BP02](../best-practices/REL07-BP02.md) — Obtain resources upon detection of impairment to a workload
- [REL07-BP03](../best-practices/REL07-BP03.md) — Obtain resources upon detection that more resources are needed for a workload
- [REL07-BP04](../best-practices/REL07-BP04.md) — Load test your workload

### REL08 — REL 8. How do you implement change?

- [REL08-BP01](../best-practices/REL08-BP01.md) — Use runbooks for standard activities such as deployment
- [REL08-BP02](../best-practices/REL08-BP02.md) — Integrate functional testing as part of your deployment
- [REL08-BP03](../best-practices/REL08-BP03.md) — Integrate resiliency testing as part of your deployment
- [REL08-BP04](../best-practices/REL08-BP04.md) — Deploy using immutable infrastructure
- [REL08-BP05](../best-practices/REL08-BP05.md) — Deploy changes with automation

### REL09 — REL 9. How do you back up data?

- [REL09-BP01](../best-practices/REL09-BP01.md) — Identify and back up all data that needs to be backed up, or reproduce the data from sources
- [REL09-BP02](../best-practices/REL09-BP02.md) — Secure and encrypt backups
- [REL09-BP03](../best-practices/REL09-BP03.md) — Perform data backup automatically
- [REL09-BP04](../best-practices/REL09-BP04.md) — Perform periodic recovery of the data to verify backup integrity and processes

### REL10 — REL 10. How do you use fault isolation to protect your workload?

- [REL10-BP01](../best-practices/REL10-BP01.md) — Deploy the workload to multiple locations
- [REL10-BP02](../best-practices/REL10-BP02.md) — Automate recovery for components constrained to a single location
- [REL10-BP03](../best-practices/REL10-BP03.md) — Use bulkhead architectures to limit scope of impact

### REL11 — REL 11. How do you design your workload to withstand component failures?

- [REL11-BP01](../best-practices/REL11-BP01.md) — Monitor all components of the workload to detect failures
- [REL11-BP02](../best-practices/REL11-BP02.md) — Fail over to healthy resources
- [REL11-BP03](../best-practices/REL11-BP03.md) — Automate healing on all layers
- [REL11-BP04](../best-practices/REL11-BP04.md) — Rely on the data plane and not the control plane during recovery
- [REL11-BP05](../best-practices/REL11-BP05.md) — Use static stability to prevent bimodal behavior
- [REL11-BP06](../best-practices/REL11-BP06.md) — Send notifications when events impact availability
- [REL11-BP07](../best-practices/REL11-BP07.md) — Architect your product to meet availability targets and uptime service level agreements (SLAs)

### REL12 — REL 12. How do you test reliability?

- [REL12-BP01](../best-practices/REL12-BP01.md) — Use playbooks to investigate failures
- [REL12-BP02](../best-practices/REL12-BP02.md) — Perform post-incident analysis
- [REL12-BP03](../best-practices/REL12-BP03.md) — Test scalability and performance requirements
- [REL12-BP04](../best-practices/REL12-BP04.md) — Test resiliency using chaos engineering
- [REL12-BP05](../best-practices/REL12-BP05.md) — Conduct game days regularly

### REL13 — REL 13. How do you plan for disaster recovery (DR)?

- [REL13-BP01](../best-practices/REL13-BP01.md) — Define recovery objectives for downtime and data loss
- [REL13-BP02](../best-practices/REL13-BP02.md) — Use defined recovery strategies to meet the recovery objectives
- [REL13-BP03](../best-practices/REL13-BP03.md) — Test disaster recovery implementation to validate the implementation
- [REL13-BP04](../best-practices/REL13-BP04.md) — Manage configuration drift at the DR site or Region
- [REL13-BP05](../best-practices/REL13-BP05.md) — Automate recovery
