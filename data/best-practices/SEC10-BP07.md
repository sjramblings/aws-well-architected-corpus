---
id: SEC10-BP07
pillar: security
pillar_question: SEC10
title: Run simulations
risk_level: MEDIUM
source_url: >-
  https://docs.aws.amazon.com/wellarchitected/latest/framework/sec_incident_response_run_game_days.html
scraped_at: '2026-05-20'
source: Amazon Web Services — docs.aws.amazon.com
licence: © Amazon Web Services. Reproduced under AWS documentation terms — see NOTICE.
content_hash: 'sha256:4558d37b9bf1519b5153b8c3c9f33006e2644b21689cec61518305f316cd8b94'
extraction_warnings:
  - 'Missing inline marker: Desired outcome'
  - 'Missing inline marker: Common anti-patterns'
sections_present:
  statement: true
  desiredOutcome: false
  commonAntiPatterns: false
  benefits: true
  implementationGuidance: true
  resources: true
---
# SEC10-BP07 — Run simulations

## Statement

As organizations grow and evolve over time, so does the threat landscape, making it important to continually review your incident response capabilities. Running simulations (also known as game days) is one method that can be used to perform this assessment. Simulations use real-world security event scenarios designed to mimic a threat actor’s tactics, techniques, and procedures (TTPs) and allow an organization to exercise and evaluate their incident response capabilities by responding to these mock cyber events as they might occur in reality.

## Benefits

Simulations have a variety of benefits:

-   Validating cyber readiness and developing the confidence of your incident responders.
    
-   Testing the accuracy and efficiency of tools and workflows.
    
-   Refining communication and escalation methods aligned with your incident response plan.
    
-   Providing an opportunity to respond to less common vectors.

## Implementation Guidance

There are three main types of simulations:

-   **Tabletop exercises:** The tabletop approach to simulations is a discussion-based session involving the various incident response stakeholders to practice roles and responsibilities and use established communication tools and playbooks. Exercise facilitation can typically be accomplished in a full day in a virtual venue, physical venue, or a combination. Because it is discussion-based, the tabletop exercise focuses on processes, people, and collaboration. Technology is an integral part of the discussion, but the actual use of incident response tools or scripts is generally not a part of the tabletop exercise.
    
-   **Purple team exercises:** Purple team exercises increase the level of collaboration between the incident responders (blue team) and simulated threat actors (red team). The blue team is comprised of members of the security operations center (SOC), but can also include other stakeholders that would be involved during an actual cyber event. The red team is comprised of a penetration testing team or key stakeholders that are trained in offensive security. The red team works collaboratively with the exercise facilitators when designing a scenario so that the scenario is accurate and feasible. During purple team exercises, the primary focus is on the detection mechanisms, the tools, and the standard operating procedures (SOPs) supporting the incident response efforts.
    
-   **Red team exercises:** During a red team exercise, the offense (red team) conducts a simulation to achieve a certain objective or set of objectives from a predetermined scope. The defenders (blue team) will not necessarily have knowledge of the scope and duration of the exercise, which provides a more realistic assessment of how they would respond to an actual incident. Because red team exercises can be invasive tests, be cautious and implement controls to verify that the exercise does not cause actual harm to your environment.
    

Consider facilitating cyber simulations at a regular interval. Each exercise type can provide unique benefits to the participants and the organization as a whole, so you might choose to start with less complex simulation types (such as tabletop exercises) and progress to more complex simulation types (red team exercises). You should select a simulation type based on your security maturity, resources, and your desired outcomes. Some customers might not choose to perform red team exercises due to complexity and cost.

## Implementation steps

Regardless of the type of simulation you choose, simulations generally follow these implementation steps:

1.  **Define core exercise elements:** Define the simulation scenario and the objectives of the simulation. Both of these should have leadership acceptance.
    
2.  **Identify key stakeholders:** At a minimum, an exercise needs exercise facilitators and participants. Depending on the scenario, additional stakeholders such as legal, communications, or executive leadership might be involved.
    
3.  **Build and test the scenario:** The scenario might need to be redefined as it is being built if specific elements aren’t feasible. A finalized scenario is expected as the output of this stage.
    
4.  **Facilitate the simulation:** The type of simulation determines the facilitation used (a paper-based scenario compared to a highly technical, simulated scenario). The facilitators should align their facilitation tactics to the exercise objects and they should engage all exercise participants wherever possible to provide the most benefit.
    
5.  **Develop the after-action report (AAR):** Identify areas that went well, those that can use improvement, and potential gaps. The AAR should measure the effectiveness of the simulation as well as the team’s response to the simulated event so that progress can be tracked over time with future simulations.

## Resources

**Related documents:**

-   [AWS Incident Response Guide](https://docs.aws.amazon.com/whitepapers/latest/aws-security-incident-response-guide/welcome.html)
    

**Related videos:**

-   [AWS GameDay - Security Edition](https://www.youtube.com/watch?v=XnfDWID_OQs)
    
-   [Running effective security incident response simulations](https://www.youtube.com/watch?v=63EdzHT25_A)
