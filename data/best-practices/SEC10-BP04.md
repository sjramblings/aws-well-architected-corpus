---
id: SEC10-BP04
pillar: security
pillar_question: SEC10
title: Develop and test security incident response playbooks
risk_level: MEDIUM
source_url: >-
  https://docs.aws.amazon.com/wellarchitected/latest/framework/sec_incident_response_playbooks.html
scraped_at: '2026-05-20'
source: Amazon Web Services — docs.aws.amazon.com
licence: © Amazon Web Services. Reproduced under AWS documentation terms — see NOTICE.
content_hash: 'sha256:023ab792891cae593d3f2e3de9cdca6736a063abe94381c3a8769494b39f31f4'
---
# SEC10-BP04 — Develop and test security incident response playbooks

## Statement

A key part of preparing your incident response processes is developing playbooks. Incident response playbooks provide prescriptive guidance and steps to follow when a security event occurs. Having clear structure and steps simplifies the response and reduces the likelihood for human error.

## Implementation Guidance

Playbooks should be created for incident scenarios such as:

-   **Expected incidents**: Playbooks should be created for incidents you anticipate. This includes threats like denial of service (DoS), ransomware, and credential compromise.
    
-   **Known security findings or alerts**: Playbooks should be created to address your known security findings and alerts, such as those from Amazon GuardDuty. When you receive a GuardDuty finding, the playbook should provide clear steps to prevent mishandling or ignoring the alert. For more remediation details and guidance, see [Remediating security issues discovered by GuardDuty](https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_remediate.html).
    

Playbooks should contain technical steps for a security analyst to complete in order to adequately investigate and respond to a potential security incident.

AWS' Customer Incident Response Team (CIRT) has published a [GitHub repository containing incident response playbooks](https://github.com/aws-samples/aws-customer-playbook-framework/tree/main/docs), organized by threat scenario, type, and resource. These playbooks can be adapted to align with your existing incident response procedures or serve as a foundation for developing new ones.

### Implementation steps

Items to include in a playbook include:

-   **Playbook overview**: What risk or incident scenario does this playbook address? What is the goal of the playbook?
    
-   **Prerequisites**: What logs, detection mechanisms, and automated tools are required for this incident scenario? What is the expected notification?
    
-   **Communication and escalation information**: Who is involved and what is their contact information? What are each of the stakeholders’ responsibilities?
    
-   **Response steps**: Across phases of incident response, what tactical steps should be taken? What queries should an analyst run? What code should be run to achieve the desired outcome?
    
    -   **Detect**: How will the incident be detected?
        
    -   **Analyze**: How will the scope of impact be determined?
        
    -   **Contain**: How will the incident be isolated to limit scope?
        
    -   **Eradicate**: How will the threat be removed from the environment?
        
    -   **Recover**: How will the affected system or resource be brought back into production?
        
    
-   **Expected outcomes**: After queries and code are run, what is the expected result of the playbook?

## Resources

**Related Well-Architected best practices:**

-   [SEC10-BP02 - Develop incident management plans](https://docs.aws.amazon.com/wellarchitected/latest/framework/sec_incident_response_develop_management_plans.html)
    

**Related documents:**

-   [Framework for Incident Response Playbooks](https://github.com/aws-samples/aws-customer-playbook-framework) 
    
-   [Develop your own Incident Response Playbooks](https://github.com/aws-samples/aws-incident-response-playbooks-workshop) 
    
-   [Incident Response Playbook Samples](https://github.com/aws-samples/aws-incident-response-playbooks) 
    
-   [Building an AWS incident response runbook using Jupyter playbooks and CloudTrail Lake](https://catalog.workshops.aws/incident-response-jupyter/en-US)
