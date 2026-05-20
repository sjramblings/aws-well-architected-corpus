---
id: SEC03-BP06
pillar: security
pillar_question: SEC03
title: Manage access based on lifecycle
risk_level: MEDIUM
source_url: >-
  https://docs.aws.amazon.com/wellarchitected/latest/framework/sec_permissions_lifecycle.html
scraped_at: '2026-05-20'
source: Amazon Web Services — docs.aws.amazon.com
licence: © Amazon Web Services. Reproduced under AWS documentation terms — see NOTICE.
content_hash: 'sha256:e9052db706dc52439bacc164008967e7594f07833b4c156c841db73e05a14f79'
---
# SEC03-BP06 — Manage access based on lifecycle

## Statement

Monitor and adjust the permissions granted to your principals (users, roles, and groups) throughout their lifecycle within your organization. Adjust group memberships as users change roles, and remove access when a user leaves the organization.

## Desired Outcome

You monitor and adjust permissions throughout the lifecycle of principals within the organization, reducing risk of unnecessary privileges. You grant appropriate access when you create a user. You modify access as the user's responsibilities change, and you remove access when the user is no longer active or has left the organization. You centrally manage changes to your users, roles, and groups. You use automation to propagate changes to your AWS environments.

## Common Anti-Patterns

-   Granting excessive or broad access privileges to identities upfront, beyond what is initially required.
    
-   Not reviewing and adjusting access privileges as identities' roles and responsibilities change over time.
    
-   Leaving inactive or terminated identities with active access privileges. This increases the risk of unauthorized access.
    
-   Not leveraging automation to manage the lifecycle of identities.

## Implementation Guidance

Carefully manage and adjust access privileges that you grant to identities (such as users, roles, groups) throughout their lifecycle. This lifecycle includes the initial onboarding phase, ongoing changes in roles and responsibilities, and eventual offboarding or termination. Proactively manage access based on the stage of the lifecycle to maintain the appropriate access level. Adhere to the principle of least privilege to reduce the risk of excessive or unnecessary access Privileges.

You can manage the lifecycle of IAM users directly within the AWS account, or through federation from your workforce identity provider to [AWS IAM Identity Center](https://aws.amazon.com/iam/identity-center/). For IAM users, you can create, modify, and delete users and their associated permissions within the AWS account. For federated users, you can use IAM Identity Center to manage their lifecycle by synchronizing user and group information from your organization's identity provider using the [System for Cross-domain Identity Management](https://docs.aws.amazon.com/singlesignon/latest/developerguide/what-is-scim.html) (SCIM) protocol.

SCIM is an open standard protocol for automated provisioning and deprovisioning of user identities across different systems. By integrating your identity provider with IAM Identity Center using SCIM, you can automatically synchronize user and group information, helping to validate that access privileges are granted, modified, or revoked based on changes in your organization's authoritative identity source.

As the roles and responsibilities of employees change within your organization, adjust their access privileges accordingly. You can use IAM Identity Center's permission sets to define different job roles or responsibilities and associate them with the appropriate IAM policies and permissions. When an employee's role changes, you can update their assigned permission set to reflect their new responsibilities. Verify that they have the necessary access while adhering to the principle of least privilege.

### Implementation steps

1.  Define and document an access management lifecycle process, including procedures for granting initial access, periodic reviews, and offboarding.
    
2.  Implement [IAM roles, groups, and permissions boundaries](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html) to manage access collectively and enforce maximum permissible access levels.
    
3.  Integrate with a [federated identity provider](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers.html) (such as Microsoft Active Directory, Okta, Ping Identity) as the authoritative source for user and group information using IAM Identity Center.
    
4.  Use the [SCIM](https://docs.aws.amazon.com/singlesignon/latest/developerguide/what-is-scim.html) protocol to synchronize user and group information from the identity provider into IAM Identity Center's Identity Store.
    
5.  Create [permission sets](https://docs.aws.amazon.com/singlesignon/latest/userguide/permissionsetsconcept.html) in IAM Identity Center that represent different job roles or responsibilities within your organization. Define the appropriate IAM policies and permissions for each permission set.
    
6.  Implement regular access reviews, prompt access revocation, and continuous improvement of the access management lifecycle process.
    
7.  Provide training and awareness to employees on access management best practices.

## Resources

**Related best practices:**

-   [SEC02-BP04 Rely on a centralized identity provider](https://docs.aws.amazon.com/wellarchitected/latest/framework/sec_identities_identity_provider.html)
    

**Related documents:**

-   [Manage your identity source](https://docs.aws.amazon.com/singlesignon/latest/userguide/manage-your-identity-source.html) 
    
-   [Manage identities in IAM Identity Center](https://docs.aws.amazon.com/singlesignon/latest/userguide/manage-your-identity-source-sso.html)
    
-   [Using AWS Identity and Access Management Access Analyzer](https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html)
    
-   [IAM Access Analyzer policy generation](https://docs.aws.amazon.com/IAM/latest/UserGuide/access-analyzer-policy-generation.html)
    

**Related videos:**

-   [AWS re:Inforce 2023 - Manage temporary elevated access with AWS IAM Identity Center](https://www.youtube.com/watch?v=a1Na2G7TTQ0)
    
-   [AWS re:Invent 2022 - Simplify your existing workforce access with IAM Identity Center](https://www.youtube.com/watch?v=TvQN4OdR_0Y&t=444s)
    
-   [AWS re:Invent 2022 - Harness power of IAM policies & rein in permissions w/Access Analyzer](https://www.youtube.com/watch?v=x-Kh8hKVX74&list=PL2yQDdvlhXf8bvQJuSP1DQ8vu75jdttlM&index=11)
