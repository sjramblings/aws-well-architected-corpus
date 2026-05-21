---
id: PERF01-BP05
pillar: performance-efficiency
pillar_question: PERF01
title: Use policies and reference architectures
risk_level: MEDIUM
source_url: >-
  https://docs.aws.amazon.com/wellarchitected/latest/framework/perf_architecture_use_policies_and_reference_architectures.html
scraped_at: '2026-05-20'
source: Amazon Web Services — docs.aws.amazon.com
licence: © Amazon Web Services. Reproduced under AWS documentation terms — see NOTICE.
content_hash: 'sha256:3890acd642aa2051811af0780ab41cfdd56ffd7116fc5c358039c0b644193aef'
extraction_warnings:
  - 'Missing inline marker: Desired outcome'
sections_present:
  statement: true
  desiredOutcome: false
  commonAntiPatterns: true
  benefits: true
  implementationGuidance: true
  resources: true
---
# PERF01-BP05 — Use policies and reference architectures

## Statement

Use internal policies and existing reference architectures when selecting services and configurations to be more efficient when designing and implementing your workload.

## Common Anti-Patterns

-   You allow a wide variety of technology that may impact the management overhead of your company.

## Benefits

Establishing a policy for architecture, technology, and vendor choices allows decisions to be made quickly.

## Implementation Guidance

Having internal policies in selecting resources and architecture provides standards and guidelines to follow when making architectural choices. Those guidelines streamline the decision-making process when choosing the right cloud service and can help improve performance efficiency. Deploy your workload using policies or reference architectures. Integrate the services into your cloud deployment, then use your performance tests to verify that you can continue to meet your performance requirements.

### Implementation steps

-   Clearly understand the requirements of your cloud workload.
    
-   Review internal and external policies to identify the most relevant ones.
    
-   Use the appropriate reference architectures provided by AWS or your industry best practices.
    
-   Create a continuum consisting of policies, standards, reference architectures, and prescriptive guidelines for common situations. Doing so allows your teams to move faster. Tailor the assets for your vertical if applicable.
    
-   Validate these policies and reference architectures for your workload in sandbox environments.
    
-   Stay up-to-date with industry standards and AWS updates to make sure your policies and reference architectures help optimize your cloud workload.

## Resources

**Related documents:**

-   [AWS Architecture Center](https://aws.amazon.com/architecture/)
    
-   [AWS Partner Network](https://aws.amazon.com/partners/)
    
-   [AWS Solutions Library](https://aws.amazon.com/solutions/)
    
-   [AWS Knowledge Center](https://aws.amazon.com/premiumsupport/knowledge-center/)
    
-   [AWS Architecture Blog](https://aws.amazon.com/blogs/architecture/category/events/reinvent/)
    

**Related videos:**

-   [This is my Architecture](https://aws.amazon.com/architecture/this-is-my-architecture/)
    
-   [AWS re:Invent 2022 - Accelerate value for your business with SAP & AWS reference architecture](https://www.youtube.com/watch?v=-u3oyOy-HxU)
    

**Related examples:**

-   [AWS Samples](https://github.com/aws-samples)
    
-   [AWS SDK Examples](https://github.com/awsdocs/aws-doc-sdk-examples)
