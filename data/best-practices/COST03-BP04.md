---
id: COST03-BP04
pillar: cost-optimization
pillar_question: COST03
title: Establish organization metrics
risk_level: HIGH
source_url: >-
  https://docs.aws.amazon.com/wellarchitected/latest/framework/cost_monitor_usage_define_kpi.html
scraped_at: '2026-05-20'
source: Amazon Web Services — docs.aws.amazon.com
licence: © Amazon Web Services. Reproduced under AWS documentation terms — see NOTICE.
content_hash: 'sha256:eafa5ed1a5edd5de7c6777159cb159663cc38b1dac57c02a960e6a108747306b'
extraction_warnings:
  - 'Missing inline marker: Desired outcome'
  - 'Missing inline marker: Common anti-patterns'
  - 'Missing inline marker: Benefits'
sections_present:
  statement: true
  desiredOutcome: false
  commonAntiPatterns: false
  benefits: false
  implementationGuidance: true
  resources: true
---
# COST03-BP04 — Establish organization metrics

## Statement

Establish the organization metrics that are required for this workload. Example metrics of a workload are customer reports produced, or web pages served to customers.

## Implementation Guidance

Understand how your workload’s output is measured against business success. Each workload typically has a small set of major outputs that indicate performance. If you have a complex workload with many components, then you can prioritize the list, or define and track metrics for each component. Work with your teams to understand which metrics to use. This unit will be used to understand the efficiency of the workload, or the cost for each business output.

**Implementation steps**

-   **Define workload outcomes:** Meet with the stakeholders in the business and define the outcomes for the workload. These are a primary measure of customer usage and must be business metrics and not technical metrics. There should be a small number of high-level metrics (less than five) per workload. If the workload produces multiple outcomes for different use cases, then group them into a single metric.
    
-   **Define workload component outcomes:** Optionally, if you have a large and complex workload, or can easily break your workload into components (such as microservices) with well-defined inputs and outputs, define metrics for each component. The effort should reflect the value and cost of the component. Start with the largest components and work towards the smaller components.

## Resources

**Related documents:**

-   [Tagging AWS resources](https://docs.aws.amazon.com/general/latest/gr/aws_tagging.html)
    
-   [Analyzing your costs with AWS Budgets](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/budgets-managing-costs.html)
    
-   [Analyzing your costs with Cost Explorer](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-explorer-what-is.html)
    
-   [Managing AWS Cost and Usage Reports](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/billing-reports-costusage-managing.html)
