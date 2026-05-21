---
id: OPS05-BP09
pillar: operational-excellence
pillar_question: OPS05
title: 'Make frequent, small, reversible changes'
risk_level: LOW
source_url: >-
  https://docs.aws.amazon.com/wellarchitected/latest/framework/ops_dev_integ_freq_sm_rev_chg.html
scraped_at: '2026-05-20'
source: Amazon Web Services — docs.aws.amazon.com
licence: © Amazon Web Services. Reproduced under AWS documentation terms — see NOTICE.
content_hash: 'sha256:ead87e74c2858974c530b14c2f33cec1dcc0bf1c47dfa8d82e4db812cc6832be'
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
# OPS05-BP09 — Make frequent, small, reversible changes

## Statement

Frequent, small, and reversible changes reduce the scope and impact of a change. When used in conjunction with change management systems, configuration management systems, and build and delivery systems frequent, small, and reversible changes reduce the scope and impact of a change. This results in more effective troubleshooting and faster remediation with the option to roll back changes.

## Common Anti-Patterns

-   You deploy a new version of your application quarterly with a change window that means a core service is turned off.
    
-   You frequently make changes to your database schema without tracking changes in your management systems.
    
-   You perform manual in-place updates, overwriting existing installations and configurations, and have no clear roll-back plan.

## Benefits

Development efforts are faster by deploying small changes frequently. When the changes are small, it is much easier to identify if they have unintended consequences, and they are easier to reverse. When the changes are reversible, there is less risk to implementing the change, as recovery is simplified. The change process has a reduced risk and the impact of a failed change is reduced.

## Implementation Guidance

Use frequent, small, and reversible changes to reduce the scope and impact of a change. This eases troubleshooting, helps with faster remediation, and provides the option to roll back a change. It also increases the rate at which you can deliver value to the business.

## Resources

**Related best practices:**

-   [OPS05-BP03 Use configuration management systems](./ops_dev_integ_conf_mgmt_sys.html)
    
-   [OPS05-BP04 Use build and deployment management systems](./ops_dev_integ_build_mgmt_sys.html)
    
-   [OPS06-BP04 Automate testing and rollback](./ops_mit_deploy_risks_auto_testing_and_rollback.html)
    

**Related documents:**

-   [Implementing Microservices on AWS](https://docs.aws.amazon.com/whitepapers/latest/microservices-on-aws/microservices-on-aws.html)
    
-   [Microservices - Observability](https://docs.aws.amazon.com/whitepapers/latest/microservices-on-aws/observability.html)
