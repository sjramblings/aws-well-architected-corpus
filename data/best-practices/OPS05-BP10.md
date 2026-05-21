---
id: OPS05-BP10
pillar: operational-excellence
pillar_question: OPS05
title: Fully automate integration and deployment
risk_level: LOW
source_url: >-
  https://docs.aws.amazon.com/wellarchitected/latest/framework/ops_dev_integ_auto_integ_deploy.html
scraped_at: '2026-05-20'
source: Amazon Web Services — docs.aws.amazon.com
licence: © Amazon Web Services. Reproduced under AWS documentation terms — see NOTICE.
content_hash: 'sha256:c1f6e46b87f8feb12caffe6d364299bfd0e029c609b8c4c96378474998e728c9'
extraction_warnings: []
sections_present:
  statement: true
  desiredOutcome: true
  commonAntiPatterns: true
  benefits: true
  implementationGuidance: true
  resources: true
---
# OPS05-BP10 — Fully automate integration and deployment

## Statement

Automate build, deployment, and testing of the workload. This reduces errors caused by manual processes and reduces the effort to deploy changes.

Apply metadata using [Resource Tags](https://docs.aws.amazon.com/general/latest/gr/aws_tagging.html) and [AWS Resource Groups](https://docs.aws.amazon.com/ARG/latest/APIReference/Welcome.html) following a consistent [tagging strategy](https://aws.amazon.com/answers/account-management/aws-tagging-strategies/) to aid in identification of your resources. Tag your resources for organization, cost accounting, access controls, and targeting the run of automated operations activities.

## Desired Outcome

Developers use tools to deliver code and promote through to production. Developers do not have to log into the AWS Management Console to deliver updates. There is a full audit trail of change and configuration, meeting the needs of governance and compliance. Processes are repeatable and are standardized across teams. Developers are free to focus on development and code pushes, increasing productivity.

## Common Anti-Patterns

-   On Friday, you finish authoring the new code for your feature branch. On Monday, after running your code quality test scripts and each of your unit tests scripts, you check in your code for the next scheduled release.
    
-   You are assigned to code a fix for a critical issue impacting a large number of customers in production. After testing the fix, you commit your code and email change management to request approval to deploy it to production.
    
-   As a developer, you log into the AWS Management Console to create a new development environment using non-standard methods and systems.

## Benefits

By implementing automated build and deployment management systems, you reduce errors caused by manual processes and reduce the effort to deploy changes helping your team members to focus on delivering business value. You increase the speed of delivery as you promote through to production.

## Implementation Guidance

You use build and deployment management systems to track and implement change, to reduce errors caused by manual processes, and reduce the level of effort. Fully automate the integration and deployment pipeline from code check-in through build, testing, deployment, and validation. This reduces lead time, encourages increased frequency of change, reduces the level of effort, increases the speed to market, results in increased productivity, and increases the security of your code as you promote through to production.

## Resources

**Related best practices:**

-   [OPS05-BP03 Use configuration management systems](./ops_dev_integ_conf_mgmt_sys.html)
    
-   [OPS05-BP04 Use build and deployment management systems](./ops_dev_integ_build_mgmt_sys.html)
    

**Related documents:**

-   [What is AWS CodeBuild?](https://docs.aws.amazon.com/codebuild/latest/userguide/welcome.html)
    
-   [What is AWS CodeDeploy?](https://docs.aws.amazon.com/codedeploy/latest/userguide/welcome.html)
    

**Related videos:**

-   [AWS re:Invent 2022 - AWS Well-Architected best practices for DevOps on AWS](https://youtu.be/hfXokRAyorA)
