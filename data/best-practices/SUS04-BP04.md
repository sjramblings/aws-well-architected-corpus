---
id: SUS04-BP04
pillar: sustainability
pillar_question: SUS04
title: Use elasticity and automation to expand block storage or file system
risk_level: MEDIUM
source_url: >-
  https://docs.aws.amazon.com/wellarchitected/latest/framework/sus_sus_data_a5.html
scraped_at: '2026-05-20'
source: Amazon Web Services — docs.aws.amazon.com
licence: © Amazon Web Services. Reproduced under AWS documentation terms — see NOTICE.
content_hash: 'sha256:ed8d48b72fcb0ed2aca844d9d22d8cc7c6f594ea70172049187dcf4d51e5d13e'
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
# SUS04-BP04 — Use elasticity and automation to expand block storage or file system

## Statement

Use elasticity and automation to expand block storage or file system as data grows to minimize the total provisioned storage.

## Common Anti-Patterns

-   You procure large block storage or file system for future need.
    
-   You overprovision the input and output operations per second (IOPS) of your file system.
    
-   You do not monitor the utilization of your data volumes.

## Benefits

Minimizing over-provisioning for storage system reduces the idle resources and improves the overall efficiency of your workload.

## Implementation Guidance

Create block storage and file systems with size allocation, throughput, and latency that are appropriate for your workload. Use elasticity and automation to expand block storage or file system as data grows without having to over-provision these storage services.

### Implementation steps

-   For fixed size storage like [Amazon EBS](https://aws.amazon.com/ebs/), verify that you are monitoring the amount of storage used versus the overall storage size and create automation, if possible, to increase the storage size when reaching a threshold.
    
-   Use elastic volumes and managed block data services to automate allocation of additional storage as your persistent data grows. As an example, you can use [Amazon EBS Elastic Volumes](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-modify-volume.html) to change volume size, volume type, or adjust the performance of your Amazon EBS volumes.
    
-   Choose the right storage class, performance mode, and throughput mode for your file system to address your business need, not exceeding that.
    
    -   [Amazon EFS performance](https://docs.aws.amazon.com/efs/latest/ug/performance.html)
        
    -   [Amazon EBS volume performance on Linux instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSPerformance.html)
        
    
-   Set target levels of utilization for your data volumes, and resize volumes outside of expected ranges.
    
-   Right size read-only volumes to fit the data.
    
-   Migrate data to object stores to avoid provisioning the excess capacity from fixed volume sizes on block storage.
    
-   Regularly review elastic volumes and file systems to terminate idle volumes and shrink over-provisioned resources to fit the current data size.

## Resources

**Related documents:**

-   [Extend the file system after resizing an EBS volume](https://docs.aws.amazon.com/ebs/latest/userguide/recognize-expanded-volume-linux.html)
    
-   [Modify a volume using Amazon EBS Elastic Volumes](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-modify-volume.html)
    
-   [Amazon FSx Documentation](https://docs.aws.amazon.com/fsx/index.html)
    
-   [What is Amazon Elastic File System?](https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html)
    

**Related videos:**

-   [Deep Dive on Amazon EBS Elastic Volumes](https://www.youtube.com/watch?v=Vi_1Or7QuOg)
    
-   [Amazon EBS and Snapshot Optimization Strategies for Better Performance and Cost Savings](https://www.youtube.com/watch?v=h1hzRCsJefs)
    
-   [Optimizing Amazon EFS for cost and performance, using best practices](https://www.youtube.com/watch?v=9kfeh6_uZY8)
