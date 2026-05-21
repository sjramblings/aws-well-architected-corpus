---
id: OPS04-BP01
pillar: operational-excellence
pillar_question: OPS04
title: Identify key performance indicators
risk_level: HIGH
source_url: >-
  https://docs.aws.amazon.com/wellarchitected/latest/framework/ops_observability_identify_kpis.html
scraped_at: '2026-05-20'
source: Amazon Web Services — docs.aws.amazon.com
licence: © Amazon Web Services. Reproduced under AWS documentation terms — see NOTICE.
content_hash: 'sha256:bbc1a069798ee4302fd5879f93e504f4f12a13a842ec2e0b664a02c2c11881c6'
extraction_warnings: []
sections_present:
  statement: true
  desiredOutcome: true
  commonAntiPatterns: true
  benefits: true
  implementationGuidance: true
  resources: true
---
# OPS04-BP01 — Identify key performance indicators

## Statement

Implementing observability in your workload starts with understanding its state and making data-driven decisions based on business requirements. One of the most effective ways to ensure alignment between monitoring activities and business objectives is by defining and monitoring key performance indicators (KPIs).

## Desired Outcome

Efficient observability practices that are tightly aligned with business objectives, ensuring that monitoring efforts are always in service of tangible business outcomes.

## Common Anti-Patterns

-   Undefined KPIs: Working without clear KPIs can lead to monitoring too much or too little, missing vital signals.
    
-   Static KPIs: Not revisiting or refining KPIs as the workload or business objectives evolve.
    
-   Misalignment: Focusing on technical metrics that don’t correlate directly with business outcomes or are harder to correlate with real-world issues.

## Benefits

-   Ease of issue identification: Business KPIs often surface issues more clearly than technical metrics. A dip in a business KPI can pinpoint a problem more effectively than sifting through numerous technical metrics.
    
-   Business alignment: Ensures that monitoring activities directly support business objectives.
    
-   Efficiency: Prioritize monitoring resources and attention on metrics that matter.
    
-   Proactivity: Recognize and address issues before they have broader business implications.

## Implementation Guidance

To effectively define workload KPIs:

1.  **Start with business outcomes:** Before diving into metrics, understand the desired business outcomes. Is it increased sales, higher user engagement, or faster response times?
    
2.  **Correlate technical metrics with business objectives:** Not all technical metrics have a direct impact on business outcomes. Identify those that do, but it's often more straightforward to identify an issue using a business KPI.
    
3.  **Use [Amazon CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html):** Employ CloudWatch to define and monitor metrics that represent your KPIs.
    
4.  **Regularly review and update KPIs:** As your workload and business evolve, keep your KPIs relevant.
    
5.  **Involve stakeholders:** Involve both technical and business teams in defining and reviewing KPIs.
    

**Level of effort for the implementation plan:** Medium

## Resources

**Related best practices:**

-   [OPS04-BP02 Implement application telemetry](./ops_observability_application_telemetry.html)
    
-   [OPS04-BP03 Implement user experience telemetry](./ops_observability_customer_telemetry.html)
    
-   [OPS04-BP04 Implement dependency telemetry](./ops_observability_dependency_telemetry.html)
    
-   [OPS04-BP05 Implement distributed tracing](./ops_observability_dist_trace.html)
    

**Related documents:**

-   [AWS Observability Best Practices](https://aws-observability.github.io/observability-best-practices/)
    
-   [CloudWatch User Guide](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html)
    
-   [AWS Observability Skill Builder Course](https://explore.skillbuilder.aws/learn/course/external/view/elearning/14688/aws-observability)
    

**Related videos:**

-   [Developing an observability strategy](https://www.youtube.com/watch?v=Ub3ATriFapQ)
    

**Related examples:**

-   [One Observability Workshop](https://catalog.workshops.aws/observability/en-US)
