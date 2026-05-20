---
id: REL12-BP01
pillar: reliability
pillar_question: REL12
title: Use playbooks to investigate failures
risk_level: HIGH
source_url: >-
  https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_testing_resiliency_playbook_resiliency.html
scraped_at: '2026-05-20'
source: Amazon Web Services — docs.aws.amazon.com
licence: © Amazon Web Services. Reproduced under AWS documentation terms — see NOTICE.
content_hash: 'sha256:b3ea06907446e0cb4b37644d6ef96ab785864245ce84413758ecfc3e66a01de4'
---
# REL12-BP01 — Use playbooks to investigate failures

## Statement

Permit consistent and prompt responses to failure scenarios that are not well understood, by documenting the investigation process in playbooks. Playbooks are the predefined steps performed to identify the factors contributing to a failure scenario. The results from any process step are used to determine the next steps to take until the issue is identified or escalated.

The playbook is proactive planning that you must do, to be able to take reactive actions effectively. When failure scenarios not covered by the playbook are encountered in production, first address the issue (put out the fire). Then go back and look at the steps you took to address the issue and use these to add a new entry in the playbook.

Note that playbooks are used in response to specific incidents, while runbooks are used to achieve specific outcomes. Often, runbooks are used for routine activities and playbooks are used to respond to non-routine events.

## Common Anti-Patterns

-   Planning to deploy a workload without knowing the processes to diagnose issues or respond to incidents.
    
-   Unplanned decisions about which systems to gather logs and metrics from when investigating an event.
    
-   Not retaining metrics and events long enough to be able to retrieve the data.

## Benefits

Capturing playbooks ensures that processes can be consistently followed. Codifying your playbooks limits the introduction of errors from manual activity. Automating playbooks shortens the time to respond to an event by eliminating the requirement for team member intervention or providing them additional information when their intervention begins.

## Implementation Guidance

-   Use playbooks to identify issues. Playbooks are documented processes to investigate issues. Allow consistent and prompt responses to failure scenarios by documenting processes in playbooks. Playbooks must contain the information and guidance necessary for an adequately skilled person to gather applicable information, identify potential sources of failure, isolate faults, and determine contributing factors (perform post-incident analysis).
    
    -   Implement playbooks as code. Perform your operations as code by scripting your playbooks to ensure consistency and limit reduce errors caused by manual processes. Playbooks can be composed of multiple scripts representing the different steps that might be necessary to identify the contributing factors to an issue. Runbook activities can be invoked or performed as part of playbook activities, or might prompt to run a playbook in response to identified events.
        
        -   [Automate your operational playbooks with AWS Systems Manager](https://aws.amazon.com/about-aws/whats-new/2019/11/automate-your-operational-playbooks-with-aws-systems-manager/)
            
        -   [AWS Systems Manager Run Command](https://docs.aws.amazon.com/systems-manager/latest/userguide/execute-remote-commands.html)
            
        -   [AWS Systems Manager Automation](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-automation.html)
            
        -   [What is AWS Lambda?](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
            
        -   [What Is Amazon EventBridge?](https://docs.aws.amazon.com/eventbridge/latest/userguide/what-is-amazon-eventbridge.html)
            
        -   [Using Amazon CloudWatch Alarms](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html)

## Resources

**Related documents:**

-   [AWS Systems Manager Automation](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-automation.html)
    
-   [AWS Systems Manager Run Command](https://docs.aws.amazon.com/systems-manager/latest/userguide/execute-remote-commands.html)
    
-   [Automate your operational playbooks with AWS Systems Manager](https://aws.amazon.com/about-aws/whats-new/2019/11/automate-your-operational-playbooks-with-aws-systems-manager/)
    
-   [Using Amazon CloudWatch Alarms](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html)
    
-   [Using Canaries (Amazon CloudWatch Synthetics)](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries.html)
    
-   [What Is Amazon EventBridge?](https://docs.aws.amazon.com/eventbridge/latest/userguide/what-is-amazon-eventbridge.html)
    
-   [What is AWS Lambda?](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
    

**Related examples:**

-   [Automating operations with Playbooks and Runbooks](https://wellarchitectedlabs.com/operational-excellence/200_labs/200_automating_operations_with_playbooks_and_runbooks/)
