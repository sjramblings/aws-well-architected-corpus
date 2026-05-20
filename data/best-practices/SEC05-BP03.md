---
id: SEC05-BP03
pillar: security
pillar_question: SEC05
title: Implement inspection-based protection
risk_level: MEDIUM
source_url: >-
  https://docs.aws.amazon.com/wellarchitected/latest/framework/sec_network_protection_inspection.html
scraped_at: '2026-05-20'
source: Amazon Web Services — docs.aws.amazon.com
licence: © Amazon Web Services. Reproduced under AWS documentation terms — see NOTICE.
content_hash: 'sha256:21a9d575326c6f42602ff18a4b9f6f468494eb6ed205ed83d18f04cbbaeb9eb6'
---
# SEC05-BP03 — Implement inspection-based protection

## Statement

Set up traffic inspection points between your network layers to make sure data in transit matches the expected categories and patterns.  Analyze traffic flows, metadata, and patterns to help identify, detect, and respond to events more effectively.

## Desired Outcome

Traffic that traverses between your network layers are inspected and authorized.  Allow and deny decisions are based on explicit rules, threat intelligence, and deviations from baseline behaviors.  Protections become stricter as traffic moves closer to sensitive data.

## Common Anti-Patterns

-   Relying solely on firewall rules based on ports and protocols. Not taking advantage of intelligent systems.
    
-   Authoring firewall rules based on specific current threat patterns that are subject to change.
    
-   Only inspecting traffic where traffic transits from private to public subnets, or from public subnets to the Internet.
    
-   Not having a baseline view of your network traffic to compare for behavior anomalies.

## Benefits

Inspection systems allow you to author intelligent rules, such as allowing or denying traffic only when certain conditions within the traffic data exist. Benefit from managed rule sets from AWS and partners, based on the latest threat intelligence, as the threat landscape changes over time.  This reduces the overhead of maintaining rules and researching indicators of compromise, reducing the potential for false positives.

## Implementation Guidance

Have fine-grained control over both your stateful and stateless network traffic using AWS Network Firewall, or other [Firewalls](https://aws.amazon.com/marketplace/search/results?searchTerms=firewalls) and [Intrusion Prevention Systems](https://aws.amazon.com/marketplace/search/results?searchTerms=Intrusion+Prevention+Systems) (IPS) on AWS Marketplace that you can deploy behind a [Gateway Load Balancer (GWLB)](https://aws.amazon.com/elasticloadbalancing/gateway-load-balancer/).  AWS Network Firewall supports [Suricata-compatible](https://docs.aws.amazon.com/network-firewall/latest/developerguide/stateful-rule-groups-ips.html) open source IPS specifications to help protect your workload.

Both the AWS Network Firewall and vendor solutions that use a GWLB support different inline inspection deployment models.  For example, you can perform inspection on a per-VPC basis, centralize in an inspection VPC, or deploy in a hybrid model where east-west traffic flows through an inspection VPC and Internet ingress is inspected per-VPC.  Another consideration is whether the solution supports unwrapping Transport Layer Security (TLS), enabling deep packet inspection for traffic flows initiated in either direction. For more information and in-depth details on these configurations, see the [AWS Network Firewall Best Practice guide](https://aws.github.io/aws-security-services-best-practices/guides/network-firewall/).

If you are using solutions that perform out-of-band inspections, such as pcap analysis of packet data from network interfaces operating in promiscuous mode, you can configure [VPC traffic mirroring](https://docs.aws.amazon.com/vpc/latest/mirroring/what-is-traffic-mirroring.html). Mirrored traffic counts towards the available bandwidth of your interfaces and is subject to the same data transfer charges as non-mirrored traffic. You can see if virtual versions of these appliances are available on the [AWS Marketplace](https://aws.amazon.com/marketplace/solutions/infrastructure-software/cloud-networking), which may support inline deployment behind a GWLB.

For components that transact over HTTP-based protocols, protect your application from common threats with a web application firewall (WAF). [AWS WAF](https://aws.amazon.com/waf) is a web application firewall that lets you monitor and block HTTP(S) requests that match your configurable rules before sending to Amazon API Gateway, Amazon CloudFront, AWS AppSync or an Application Load Balancer. Consider deep packet inspection when you evaluate the deployment of your web application firewall, as some require you to terminate TLS before traffic inspection. To get started with AWS WAF, you can use [AWS Managed Rules](https://docs.aws.amazon.com/waf/latest/developerguide/getting-started.html#getting-started-wizard-add-rule-group) in combination with your own, or use existing [partner integrations](https://aws.amazon.com/waf/partners/).

You can centrally manage AWS WAF, AWS Shield Advanced, AWS Network Firewall, and Amazon VPC security groups across your AWS Organization with [AWS Firewall Manager](https://aws.amazon.com/firewall-manager/). 

## Implementation steps

1.  Determine if you can scope inspection rules broadly, such as through an inspection VPC, or if you require a more granular per-VPC approach.
    
2.  For inline inspection solutions:
    
    1.  If using AWS Network Firewall, create rules, firewall policies, and the firewall itself. Once these have been configured, you can [route traffic to the firewall endpoint](https://aws.amazon.com/blogs/networking-and-content-delivery/deployment-models-for-aws-network-firewall/) to enable inspection. 
        
    2.  If using a third-party appliance with a Gateway Load Balancer (GWLB), deploy and configure your appliance in one or more availability zones. Then, create your GWLB, the endpoint service, endpoint, and configure routing for your traffic.
        
    
3.  For out-of-band inspection solutions:
    
    1.  Turn on VPC Traffic Mirroring on interfaces where inbound and outbound traffic should be mirrored. You can use Amazon EventBridge rules to invoke an AWS Lambda function to turn on traffic mirroring on interfaces when new resources are created. Point the traffic mirroring sessions to the Network Load Balancer in front of your appliance that processes traffic.
        
    
4.  For inbound web traffic solutions:
    
    1.  To configure AWS WAF, start by configuring a web access control list (web ACL). The web ACL is a collection of rules with a serially processed default action (ALLOW or DENY) that defines how your WAF handles traffic. You can create your own rules and groups or use AWS managed rule groups in your web ACL.
        
    2.  Once your web ACL is configured, associate the web ACL with an AWS resource (like an Application Load Balancer, API Gateway REST API, or CloudFront distribution) to begin protecting web traffic.

## Resources

**Related documents:**

-   [What is Traffic Mirroring?](https://docs.aws.amazon.com/vpc/latest/mirroring/what-is-traffic-mirroring.html)
    
-   [Implementing inline traffic inspection using third-party security appliances](https://docs.aws.amazon.com/prescriptive-guidance/latest/inline-traffic-inspection-third-party-appliances/welcome.html)
    
-   [AWS Network Firewall example architectures with routing](https://docs.aws.amazon.com/network-firewall/latest/developerguide/architectures.html)
    
-   [Centralized inspection architecture with AWS Gateway Load Balancer and AWS Transit Gateway](https://aws.amazon.com/blogs/networking-and-content-delivery/centralized-inspection-architecture-with-aws-gateway-load-balancer-and-aws-transit-gateway/)
    

**Related examples:**

-   [Best practices for deploying Gateway Load Balancer](https://aws.amazon.com/blogs/networking-and-content-delivery/best-practices-for-deploying-gateway-load-balancer/)
    
-   [TLS inspection configuration for encrypted egress traffic and AWS Network Firewall](https://aws.amazon.com/blogs/security/tls-inspection-configuration-for-encrypted-egress-traffic-and-aws-network-firewall/)
    

**Related tools:**

-   [AWS Marketplace IDS/IPS](https://aws.amazon.com/marketplace/search/results?prevFilters=%257B%2522id%2522%3A%25220ed48363-5064-4d47-b41b-a53f7c937314%2522%257D&searchTerms=ids%2Fips)
