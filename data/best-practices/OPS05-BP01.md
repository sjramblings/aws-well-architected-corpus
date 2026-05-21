---
id: OPS05-BP01
pillar: operational-excellence
pillar_question: OPS05
title: Use version control
risk_level: HIGH
source_url: >-
  https://docs.aws.amazon.com/wellarchitected/latest/framework/ops_dev_integ_version_control.html
scraped_at: '2026-05-20'
source: Amazon Web Services — docs.aws.amazon.com
licence: © Amazon Web Services. Reproduced under AWS documentation terms — see NOTICE.
content_hash: 'sha256:8219c5a62e651aa23194a26065fcd0ab99a4e192c8e1c15fc59be17a0dc71576'
extraction_warnings: []
sections_present:
  statement: true
  desiredOutcome: true
  commonAntiPatterns: true
  benefits: true
  implementationGuidance: true
  resources: true
---
# OPS05-BP01 — Use version control

## Statement

Use version control to activate tracking of changes and releases.

Many AWS services offer version control capabilities. Use a revision or [source control](https://aws.amazon.com/devops/source-control/) system such as [Git](https://aws.amazon.com/devops/source-control/git/) to manage code and other artifacts such as version-controlled [AWS CloudFormation](https://aws.amazon.com/cloudformation/) templates of your infrastructure.

## Desired Outcome

Your teams collaborate on code. When merged, the code is consistent and no changes are lost. Errors are easily reverted through correct versioning.

## Common Anti-Patterns

-   You have been developing and storing your code on your workstation. You have had an unrecoverable storage failure on the workstation and your code is lost.
    
-   After overwriting the existing code with your changes, you restart your application and it is no longer operable. You are unable to revert the change.
    
-   You have a write lock on a report file that someone else needs to edit. They contact you asking that you stop work on it so that they can complete their tasks.
    
-   Your research team has been working on a detailed analysis that shapes your future work. Someone has accidentally saved their shopping list over the final report. You are unable to revert the change and have to recreate the report.

## Benefits

By using version control capabilities you can easily revert to known good states and previous versions, and limit the risk of assets being lost.

## Implementation Guidance

Maintain assets in version controlled repositories. Doing so supports tracking changes, deploying new versions, detecting changes to existing versions, and reverting to prior versions (for example, rolling back to a known good state in the event of a failure). Integrate the version control capabilities of your configuration management systems into your procedures.

## Resources

**Related best practices:**

-   [OPS05-BP04 Use build and deployment management systems](./ops_dev_integ_build_mgmt_sys.html)
    

**Related videos:**

-   [AWS re:Invent 2023 - How Lockheed Martin builds software faster, powered by DevSecOps](https://www.youtube.com/watch?v=Q1OSyxYkl5w)
    
-   [AWS re:Invent 2023 - How GitHub operationalizes AI for team collaboration and productivity](https://www.youtube.com/watch?v=cOVvGaiusOI)
