---
pillar: security
name: "Security"
question_count: 11
bp_count: 63
---

# Security

## Questions

### SEC01 — SEC 1. How do you securely operate your workload?

- [SEC01-BP01](../best-practices/SEC01-BP01.md) — Separate workloads using accounts
- [SEC01-BP02](../best-practices/SEC01-BP02.md) — Secure account root user and properties
- [SEC01-BP03](../best-practices/SEC01-BP03.md) — Identify and validate control objectives
- [SEC01-BP04](../best-practices/SEC01-BP04.md) — Stay up to date with security threats and recommendations
- [SEC01-BP05](../best-practices/SEC01-BP05.md) — Reduce security management scope
- [SEC01-BP06](../best-practices/SEC01-BP06.md) — Automate deployment of standard security controls
- [SEC01-BP07](../best-practices/SEC01-BP07.md) — Identify threats and prioritize mitigations using a threat model
- [SEC01-BP08](../best-practices/SEC01-BP08.md) — Evaluate and implement new security services and features regularly

### SEC02 — SEC 2. How do you manage authentication for people and machines?

- [SEC02-BP01](../best-practices/SEC02-BP01.md) — Use strong sign-in mechanisms
- [SEC02-BP02](../best-practices/SEC02-BP02.md) — Use temporary credentials
- [SEC02-BP03](../best-practices/SEC02-BP03.md) — Store and use secrets securely
- [SEC02-BP04](../best-practices/SEC02-BP04.md) — Rely on a centralized identity provider
- [SEC02-BP05](../best-practices/SEC02-BP05.md) — Audit and rotate credentials periodically
- [SEC02-BP06](../best-practices/SEC02-BP06.md) — Employ user groups and attributes

### SEC03 — SEC 3. How do you manage permissions for people and machines?

- [SEC03-BP01](../best-practices/SEC03-BP01.md) — Define access requirements
- [SEC03-BP02](../best-practices/SEC03-BP02.md) — Grant least privilege access
- [SEC03-BP03](../best-practices/SEC03-BP03.md) — Establish emergency access process
- [SEC03-BP04](../best-practices/SEC03-BP04.md) — Reduce permissions continuously
- [SEC03-BP05](../best-practices/SEC03-BP05.md) — Define permission guardrails for your organization
- [SEC03-BP06](../best-practices/SEC03-BP06.md) — Manage access based on lifecycle
- [SEC03-BP07](../best-practices/SEC03-BP07.md) — Analyze public and cross-account access
- [SEC03-BP08](../best-practices/SEC03-BP08.md) — Share resources securely within your organization
- [SEC03-BP09](../best-practices/SEC03-BP09.md) — Share resources securely with a third party

### SEC04 — SEC 4. How do you detect and investigate security events?

- [SEC04-BP01](../best-practices/SEC04-BP01.md) — Configure service and application logging
- [SEC04-BP02](../best-practices/SEC04-BP02.md) — Capture logs, findings, and metrics in standardized locations
- [SEC04-BP03](../best-practices/SEC04-BP03.md) — Correlate and enrich security alerts
- [SEC04-BP04](../best-practices/SEC04-BP04.md) — Initiate remediation for non-compliant resources

### SEC05 — SEC 5. How do you protect your network resources?

- [SEC05-BP01](../best-practices/SEC05-BP01.md) — Create network layers
- [SEC05-BP02](../best-practices/SEC05-BP02.md) — Control traffic flow within your network layers
- [SEC05-BP03](../best-practices/SEC05-BP03.md) — Implement inspection-based protection
- [SEC05-BP04](../best-practices/SEC05-BP04.md) — Automate network protection

### SEC06 — SEC 6. How do you protect your compute resources?

- [SEC06-BP01](../best-practices/SEC06-BP01.md) — Perform vulnerability management
- [SEC06-BP02](../best-practices/SEC06-BP02.md) — Provision compute from hardened images
- [SEC06-BP03](../best-practices/SEC06-BP03.md) — Reduce manual management and interactive access
- [SEC06-BP04](../best-practices/SEC06-BP04.md) — Validate software integrity
- [SEC06-BP05](../best-practices/SEC06-BP05.md) — Automate compute protection

### SEC07 — SEC 7. How do you classify your data?

- [SEC07-BP01](../best-practices/SEC07-BP01.md) — Understand your data classification scheme
- [SEC07-BP02](../best-practices/SEC07-BP02.md) — Apply data protection controls based on data sensitivity
- [SEC07-BP03](../best-practices/SEC07-BP03.md) — Automate identification and classification
- [SEC07-BP04](../best-practices/SEC07-BP04.md) — Define scalable data lifecycle management

### SEC08 — SEC 8. How do you protect your data at rest?

- [SEC08-BP01](../best-practices/SEC08-BP01.md) — Implement secure key management
- [SEC08-BP02](../best-practices/SEC08-BP02.md) — Enforce encryption at rest
- [SEC08-BP03](../best-practices/SEC08-BP03.md) — Automate data at rest protection
- [SEC08-BP04](../best-practices/SEC08-BP04.md) — Enforce access control

### SEC09 — SEC 9. How do you protect your data in transit?

- [SEC09-BP01](../best-practices/SEC09-BP01.md) — Implement secure key and certificate management
- [SEC09-BP02](../best-practices/SEC09-BP02.md) — Enforce encryption in transit
- [SEC09-BP03](../best-practices/SEC09-BP03.md) — Authenticate network communications

### SEC10 — SEC 10. How do you anticipate, respond to, and recover from incidents?

- [SEC10-BP01](../best-practices/SEC10-BP01.md) — Identify key personnel and external resources
- [SEC10-BP02](../best-practices/SEC10-BP02.md) — Develop incident management plans
- [SEC10-BP03](../best-practices/SEC10-BP03.md) — Prepare forensic capabilities
- [SEC10-BP04](../best-practices/SEC10-BP04.md) — Develop and test security incident response playbooks
- [SEC10-BP05](../best-practices/SEC10-BP05.md) — Pre-provision access
- [SEC10-BP06](../best-practices/SEC10-BP06.md) — Pre-deploy tools
- [SEC10-BP07](../best-practices/SEC10-BP07.md) — Run simulations
- [SEC10-BP08](../best-practices/SEC10-BP08.md) — Establish a framework for learning from incidents

### SEC11 — SEC 11. How do you incorporate and validate the security properties of applications throughout the design, development, and deployment lifecycle?

- [SEC11-BP01](../best-practices/SEC11-BP01.md) — Train for application security
- [SEC11-BP02](../best-practices/SEC11-BP02.md) — Automate testing throughout the development and release lifecycle
- [SEC11-BP03](../best-practices/SEC11-BP03.md) — Perform regular penetration testing
- [SEC11-BP04](../best-practices/SEC11-BP04.md) — Conduct code reviews
- [SEC11-BP05](../best-practices/SEC11-BP05.md) — Centralize services for packages and dependencies
- [SEC11-BP06](../best-practices/SEC11-BP06.md) — Deploy software programmatically
- [SEC11-BP07](../best-practices/SEC11-BP07.md) — Regularly assess security properties of the pipelines
- [SEC11-BP08](../best-practices/SEC11-BP08.md) — Build a program that embeds security ownership in workload teams
