---
id: COST04-BP05
pillar: cost-optimization
pillar_question: COST04
title: Enforce data retention policies
risk_level: MEDIUM
source_url: >-
  https://docs.aws.amazon.com/wellarchitected/latest/framework/cost_decomissioning_resources_data_retention.html
scraped_at: '2026-05-20'
source: Amazon Web Services — docs.aws.amazon.com
licence: © Amazon Web Services. Reproduced under AWS documentation terms — see NOTICE.
content_hash: 'sha256:2ca48721c39810726484a0a63336d5e8f1770b400b80f56a030d0252ac199669'
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
# COST04-BP05 — Enforce data retention policies

## Statement

Define data retention policies on supported resources to handle object deletion per your organizations’ requirements. Identify and delete unnecessary or orphaned resources and objects that are no longer required.

## Implementation Guidance

Use data retention policies and lifecycle policies to reduce the associated costs of the decommissioning process and storage costs for the identified resources. Defining your data retention policies and lifecycle policies to perform automated storage class migration and deletion will reduce the overall storage costs during its lifetime. You can use Amazon Data Lifecycle Manager to automate the creation and deletion of Amazon Elastic Block Store snapshots and Amazon EBS-backed Amazon Machine Images (AMIs), and use Amazon S3 Intelligent-Tiering or an Amazon S3 lifecycle configuration to manage the lifecycle of your Amazon S3 objects. You can also implement custom code using the [API or SDK](https://aws.amazon.com/tools/) to create lifecycle policies and policy rules for objects to be deleted automatically.

**Implementation steps**

-   **Use Amazon Data Lifecycle Manager:** Use lifecycle policies on Amazon Data Lifecycle Manager to automate deletion of Amazon EBS snapshots and Amazon EBS-backed AMIs.
    
-   **Set up lifecycle configuration on a bucket:** Use Amazon S3 lifecycle configuration on a bucket to define actions for Amazon S3 to take during an object's lifecycle, as well as deletion at the end of the object's lifecycle, based on your business requirements.

## Resources

**Related documents:**

-   [AWS Trusted Advisor](https://aws.amazon.com/premiumsupport/trustedadvisor/)
    
-   [Amazon Data Lifecycle Manager](https://docs.aws.amazon.com/dlm/?icmpid=docs_homepage_mgmtgov)
    
-   [How to set lifecycle configuration on Amazon S3 bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/how-to-set-lifecycle-configuration-intro.html)
    

**Related videos:**

-   [Automate Amazon EBS Snapshots with Amazon Data Lifecycle Manager](https://www.youtube.com/watch?v=RJpEjnVSdi4)
    
-   [Empty an Amazon S3 bucket using a lifecycle configuration rule](https://www.youtube.com/watch?v=JfK9vamen9I)
    

**Related examples:**

-   [Empty an Amazon S3 bucket using a lifecycle configuration rule](https://aws.amazon.com/premiumsupport/knowledge-center/s3-empty-bucket-lifecycle-rule/)
