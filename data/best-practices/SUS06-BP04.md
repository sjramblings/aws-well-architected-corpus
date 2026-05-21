---
id: SUS06-BP04
pillar: sustainability
pillar_question: SUS06
title: Increase utilization of build environments
risk_level: LOW
source_url: >-
  https://docs.aws.amazon.com/wellarchitected/latest/framework/sus_sus_dev_a4.html
scraped_at: '2026-05-20'
source: Amazon Web Services — docs.aws.amazon.com
licence: © Amazon Web Services. Reproduced under AWS documentation terms — see NOTICE.
content_hash: 'sha256:4a45cd1e402b2e53e562db6bd1c7e5027fea8ec5cd3ee4beec2faa6daed96f15'
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
# SUS06-BP04 — Increase utilization of build environments

## Statement

Increase the utilization of resources to develop, test, and build your workloads.

## Common Anti-Patterns

-   You manually provision or terminate your build environments.
    
-   You keep your build environments running independent of test, build, or release activities (for example, running an environment outside of the working hours of your development team members).
    
-   You over-provision resources for your build environments.

## Benefits

By increasing the utilization of build environments, you can improve the overall efficiency of your cloud workload while allocating the resources to builders to develop, test, and build efficiently.

## Implementation Guidance

Use automation and infrastructure-as-code to bring build environments up when needed and take them down when not used. A common pattern is to schedule periods of availability that coincide with the working hours of your development team members. Your test environments should closely resemble the production configuration. However, look for opportunities to use instance types with burst capacity, Amazon EC2 Spot Instances, automatic scaling database services, containers, and serverless technologies to align development and test capacity with use. Limit data volume to just meet the test requirements. If using production data in test, explore possibilities of sharing data from production and not moving data across.

**Implementation steps**

-   **Use infrastructure as code:** Use infrastructure as code to provision your build environments.
    
-   **Use automation:** Use automation to manage the lifecycle of your development and test environments and maximize the efficiency of your build resources.
    
-   **Maximize utilization**: Use strategies to maximize the utilization of development and test environments.
    
    -   Use minimum viable representative environments to develop and test potential improvements.
        
    -   Use serverless technologies if possible.
        
    -   Use On-Demand Instances to supplement your developer devices.
        
    -   Use instance types with burst capacity, Spot Instances, and other technologies to align build capacity with use.
        
    -   Adopt native cloud services for secure instance shell access rather than deploying fleets of bastion hosts.
        
    -   Automatically scale your build resources depending on your build jobs.

## Resources

**Related documents:**

-   [AWS Systems Manager Session Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html)
    
-   [Amazon EC2 Burstable performance instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/burstable-performance-instances.html)
    
-   [What is AWS CloudFormation?](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html)
    
-   [What is AWS CodeBuild?](https://docs.aws.amazon.com/codebuild/latest/userguide/welcome.html)
    
-   [Instance Scheduler on AWS](https://aws.amazon.com/solutions/implementations/instance-scheduler-on-aws/)
    

**Related videos:**

-   [AWS re:Invent 2023 - Continuous integration and delivery for AWS](https://www.youtube.com/watch?v=25w9uJPt0SA)
