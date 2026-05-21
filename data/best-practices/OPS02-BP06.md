---
id: OPS02-BP06
pillar: operational-excellence
pillar_question: OPS02
title: Responsibilities between teams are predefined or negotiated
risk_level: LOW
source_url: >-
  https://docs.aws.amazon.com/wellarchitected/latest/framework/ops_ops_model_def_neg_team_agreements.html
scraped_at: '2026-05-20'
source: Amazon Web Services — docs.aws.amazon.com
licence: © Amazon Web Services. Reproduced under AWS documentation terms — see NOTICE.
content_hash: 'sha256:446ed49cfd6b12fef78a4450cc34ce19df3ee1f21cd75dc965f2c7ebaf3cb432'
extraction_warnings: []
sections_present:
  statement: true
  desiredOutcome: true
  commonAntiPatterns: true
  benefits: true
  implementationGuidance: true
  resources: true
---
# OPS02-BP06 — Responsibilities between teams are predefined or negotiated

## Statement

Have defined or negotiated agreements between teams describing how they work with and support each other (for example, response times, service level objectives, or service-level agreements). Inter-team communications channels are documented. Understanding the impact of the teams’ work on business outcomes and the outcomes of other teams and organizations informs the prioritization of their tasks and helps them respond appropriately.

When responsibility and ownership are undefined or unknown, you are at risk of both not addressing necessary activities in a timely fashion and of redundant and potentially conflicting efforts emerging to address those needs.

## Desired Outcome

-   Inter-team working or support agreements are agreed to and documented.
    
-   Teams that support or work with each other have defined communication channels and response expectations.

## Common Anti-Patterns

-   An issue occurs in production and two separate teams start troubleshooting independent of each other. Their siloed efforts extend the outage.
    
-   The operations team needs assistance from the development team but there is no agreed to response time. The request is stuck in the backlog.

## Benefits

-   Teams know how to interact and support each other.
    
-   Expectations for responsiveness are known.
    
-   Communications channels are clearly defined.

## Implementation Guidance

Implementing this best practice means that there is no ambiguity about how teams work with each other. Formal agreements codify how teams work together or support each other. Inter-team communication channels are documented.

**Customer example**

AnyCompany Retail’s SRE team has a service level agreement with their development team. Whenever the development team makes a request in their ticketing system, they can expect a response within fifteen minutes. If there is a site outage, the SRE team takes lead in the investigation with support from the development team.

**Implementation steps**

1.  Working with stakeholders across your organization, develop agreements between teams based on processes and procedures.
    
    1.  If a process or procedure is shared between two teams, develop a runbook on how the teams will work together.
        
    2.  If there are dependencies between teams, agree to a response SLA for requests.
        
    
2.  Document responsibilities in your knowledge management system.
    

**Level of effort for the implementation plan:** Medium. If there are no existing agreements between teams, it can take effort to come to agreement with stakeholders across your organization.

## Resources

**Related best practices:**

-   [OPS02-BP02 Processes and procedures have identified owners](./ops_ops_model_def_proc_owners.html) - Process ownership must be identified before setting agreements between teams.
    
-   [OPS02-BP03 Operations activities have identified owners responsible for their performance](./ops_ops_model_def_activity_owners.html) - Operations activities ownership must be identified before setting agreements between teams.
    

**Related documents:**

-   [AWS Executive Insights - Empowering Innovation with the Two-Pizza Team](https://aws.amazon.com/executive-insights/content/amazon-two-pizza-team/)
    
-   [Introduction to DevOps on AWS - Two-Pizza Teams](https://docs.aws.amazon.com/whitepapers/latest/introduction-devops-aws/two-pizza-teams.html)
