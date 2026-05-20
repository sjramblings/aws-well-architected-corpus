---
id: OPS10-BP05
pillar: operational-excellence
pillar_question: OPS10
title: Define a customer communication plan for service-impacting events
risk_level: MEDIUM
source_url: >-
  https://docs.aws.amazon.com/wellarchitected/latest/framework/ops_event_response_push_notify.html
scraped_at: '2026-05-20'
source: Amazon Web Services — docs.aws.amazon.com
licence: © Amazon Web Services. Reproduced under AWS documentation terms — see NOTICE.
content_hash: 'sha256:da113e4146482d84247b3730907dd667d7b0e4b22c404082ae6ae0f61f2a1d78'
extraction_warnings: []
sections_present:
  statement: true
  desiredOutcome: true
  commonAntiPatterns: true
  benefits: true
  implementationGuidance: true
  resources: true
---
# OPS10-BP05 — Define a customer communication plan for service-impacting events

## Statement

Effective communication during service impacting events is critical to maintain trust and transparency with customers. A well-defined communication plan helps your organization quickly and clearly share information, both internally and externally, during incidents.

## Desired Outcome

-   A robust communication plan that effectively informs customers and stakeholders during service impacting events.
    
-   Transparency in communication to build trust and reduce customer anxiety.
    
-   Minimizing the impact of service impacting events on customer experience and business operations.

## Common Anti-Patterns

-   Inadequate or delayed communication leads to customer confusion and dissatisfaction.
    
-   Overly technical or vague messaging fails to convey the actual impact on users.
    
-   There is no predefined communication strategy, resulting in inconsistent and reactive messaging.

## Benefits

-   Enhanced customer trust and satisfaction through proactive and clear communication.
    
-   Reduced burden on support teams by preemptively addressing customer concerns.
    
-   Improved ability to manage and recover from incidents effectively.

## Implementation Guidance

Creating a comprehensive communication plan for service impacting events involves multiple facets, from choosing the right channels to crafting the message and tone. The plan should be adaptable, scalable, and cater to different outage scenarios.

### Implementation steps

1.  **Define roles and responsibilities:**
    
    -   Assign a major incident manager to oversee incident response activities.
        
    -   Designate a communications manager responsible for coordinating all external and internal communications.
        
    -   Include the support manager to provide consistent communication through support tickets.
        
    
2.  **Identify communication channels:** Select channels like workplace chat, email, SMS, social media, in-app notifications, and status pages. These channels should be resilient and able to operate independently during service impacting events.
    
3.  **Communicate quickly, clearly, and regularly to customers:**
    
    -   Develop templates for various service impairment scenarios, emphasizing simplicity and essential details. Include information about the service impairment, expected resolution time, and impact.
        
    -   Use Amazon Pinpoint to alert customers using push notifications, in-app notifications, emails, text messages, voice messages, and messages over custom channels.
        
    -   Use Amazon Simple Notification Service (Amazon SNS) to alert subscribers programatically or through email, mobile push notifications, and text messages.
        
    -   Communicate status through dashboards by sharing an Amazon CloudWatch dashboard publicly.
        
    -   Encourage social media engagement:
        
        -   Actively monitor social media to understand customer sentiment.
            
        -   Post on social media platforms for public updates and community engagement.
            
        -   Prepare templates for consistent and clear social media communication.
            
        
    
4.  **Coordinate internal communication:** Implement internal protocols using tools like Amazon Q Developer in chat applications for team coordination and communication. Use CloudWatch dashboards to communicate status.
    
5.  **Orchestrate communication with dedicated tools and services:**
    
    -   Use AWS Systems Manager Incident Manager with Amazon Q Developer in chat applications to set up dedicated chat channels for real-time internal communication and coordination during incidents.
        
    -   Use AWS Systems Manager Incident Manager runbooks to automate customer notifications through Amazon Pinpoint, Amazon SNS, or third-party tools like social media platforms during incidents.
        
    -   Incorporate approval workflows within runbooks to optionally review and authorize all external communications before sending.
        
    
6.  **Practice and improve:**
    
    -   Conduct training on the use of communication tools and strategies. Empower teams to make timely decisions during incidents.
        
    -   Test the communication plan through regular drills or gamedays. Use these tests to refine messaging and evaluate the effectiveness of channels.
        
    -   Implement feedback mechanisms to assess communication effectiveness during incidents. Continually evolve the communication plan based on feedback and changing needs.
        
    

**Level of effort for the implementation plan:** High

## Resources

**Related best practices:**

-   [OPS07-BP03 Use runbooks to perform procedures](./ops_ready_to_support_use_runbooks.html)
    
-   [OPS10-BP06 Communicate status through dashboards](./ops_event_response_dashboards.html)
    
-   [OPS11-BP02 Perform post-incident analysis](./ops_evolve_ops_perform_rca_process.html)
    

**Related documents:**

-   [Atlassian - Incident communication best practices](https://www.atlassian.com/incident-management/incident-communication)
    
-   [Atlassian - How to write a good status update](https://www.atlassian.com/blog/statuspage/how-to-write-a-good-status-update)
    
-   [PagerDuty - A Guide to Incident Communications](https://www.pagerduty.com/resources/learn/a-guide-to-incident-communications/)
    

**Related videos:**

-   [Atlassian - Create your own incident communication plan: Incident templates](https://www.youtube.com/watch?v=ZROVn6-K2qU)
    

**Related examples:**

-   [AWS Health Dashboard](https://aws.amazon.com/premiumsupport/technology/aws-health-dashboard/)
