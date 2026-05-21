---
id: COST04-BP03
pillar: cost-optimization
pillar_question: COST04
title: Decommission resources
risk_level: MEDIUM
source_url: >-
  https://docs.aws.amazon.com/wellarchitected/latest/framework/cost_decomissioning_resources_decommission.html
scraped_at: '2026-05-20'
source: Amazon Web Services — docs.aws.amazon.com
licence: © Amazon Web Services. Reproduced under AWS documentation terms — see NOTICE.
content_hash: 'sha256:538025f428cd7dea5fa818559936623268cbaffe5d585ea3c8359b2cf21c610a'
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
# COST04-BP03 — Decommission resources

## Statement

Decommission resources initiated by events such as periodic audits, or changes in usage. Decommissioning is typically performed periodically and can be manual or automated.

## Implementation Guidance

The frequency and effort to search for unused resources should reflect the potential savings, so an account with a small cost should be analyzed less frequently than an account with larger costs. Searches and decommission events can be initiated by state changes in the workload, such as a product going end of life or being replaced. Searches and decommission events may also be initiated by external events, such as changes in market conditions or product termination.

**Implementation steps**

-   **Decommission resources:** This is the depreciation stage of AWS resources that are no longer needed or ending of a licensing agreement. Complete all final checks completed before moving to the disposal stage and decommissioning resources to prevent any unwanted disruptions like taking snapshots or backups. Using the decommissioning process, decommission each of the resources that have been identified as unused.

## Resources

**Related documents:**

-   [AWS Auto Scaling](https://aws.amazon.com/autoscaling/)
    
-   [AWS Trusted Advisor](https://aws.amazon.com/premiumsupport/trustedadvisor/)
