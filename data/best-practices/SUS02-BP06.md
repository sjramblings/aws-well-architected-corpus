---
id: SUS02-BP06
pillar: sustainability
pillar_question: SUS02
title: Implement buffering or throttling to flatten the demand curve
risk_level: LOW
source_url: >-
  https://docs.aws.amazon.com/wellarchitected/latest/framework/sus_sus_user_a7.html
scraped_at: '2026-05-20'
source: Amazon Web Services — docs.aws.amazon.com
licence: © Amazon Web Services. Reproduced under AWS documentation terms — see NOTICE.
content_hash: 'sha256:a7bfabff0fc50069d9d74863d86ff8acc42f7cc48a65ef80348f483475e998bc'
---
# SUS02-BP06 — Implement buffering or throttling to flatten the demand curve

## Statement

Buffering and throttling flatten the demand curve and reduce the provisioned capacity required for your workload.

## Common Anti-Patterns

-   You process the client requests immediately while it is not needed.
    
-   You do not analyze the requirements for client requests.

## Benefits

Flattening the demand curve reduce the required provisioned capacity for the workload. Reducing the provisioned capacity means less energy consumption and less environmental impact.

## Implementation Guidance

Flattening the workload demand curve can help you to reduce the provisioned capacity for a workload and reduce its environmental impact. Assume a workload with the demand curve shown in below figure. This workload has two peaks, and to handle those peaks, the resource capacity as shown by orange line is provisioned. The resources and energy used for this workload is not indicated by the area under the demand curve, but the area under the provisioned capacity line, as provisioned capacity is needed to handle those two peaks.

![Provisioned capacity waveform with two distinct peaks that require high provisioned capacity.](/images/wellarchitected/latest/framework/images/provisioned-capacity-1.png)

_Demand curve with two distinct peaks that require high provisioned capacity._

You can use buffering or throttling to modify the demand curve and smooth out the peaks, which means less provisioned capacity and less energy consumed. Implement throttling when your clients can perform retries. Implement buffering to store the request and defer processing until a later time.

![Waveform diagram displaying a workload with smoothed-out peaks created using buffering or throttling.](/images/wellarchitected/latest/framework/images/provisioned-capacity-2.png)

_Throttling's effect on the demand curve and provisioned capacity._

**Implementation steps**

-   Analyze the client requests to determine how to respond to them. Questions to consider include:
    
    -   Can this request be processed asynchronously?
        
    -   Does the client have retry capability?
        
    
-   If the client has retry capability, then you can implement throttling, which tells the source that if it cannot service the request at the current time, it should try again later.
    
    -   You can use [Amazon API Gateway](https://aws.amazon.com/api-gateway/) to implement throttling.
        
    
-   For clients that cannot perform retries, a buffer needs to be implemented to flatten the demand curve. A buffer defers request processing, allowing applications that run at different rates to communicate effectively. A buffer-based approach uses a queue or a stream to accept messages from producers. Messages are read by consumers and processed, allowing the messages to run at the rate that meets the consumers’ business requirements.
    
    -   [Amazon Simple Queue Service (Amazon SQS)](https://aws.amazon.com/sqs/) is a managed service that provides queues that allow a single consumer to read individual messages.
        
    -   [Amazon Kinesis](https://aws.amazon.com/kinesis/) provides a stream that allows many consumers to read the same messages.
        
    
-   Analyze the overall demand, rate of change, and required response time to right size the throttle or buffer required.

## Resources

**Related documents:**

-   [Getting started with Amazon SQS](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-getting-started.html)
    
-   [Application integration Using Queues and Messages](https://aws.amazon.com/blogs/architecture/application-integration-using-queues-and-messages/)
    
-   [Managing and monitoring API throttling in your workloads](https://aws.amazon.com/blogs/mt/managing-monitoring-api-throttling-in-workloads/)
    
-   [Throttling a tiered, multi-tenant REST API at scale using API Gateway](https://aws.amazon.com/blogs/architecture/throttling-a-tiered-multi-tenant-rest-api-at-scale-using-api-gateway-part-1/)
    
-   [Application integration Using Queues and Messages](https://aws.amazon.com/blogs/architecture/application-integration-using-queues-and-messages/)
    

**Related videos:**

-   [AWS re:Invent 2022 - Application integration patterns for microservices](https://www.youtube.com/watch?v=GoBOivyE7PY)
    
-   [AWS re:Invent 2023 - Smart savings: Amazon EC2 cost-optimization strategies](https://www.youtube.com/watch?v=_AHPbxzIGV0)
    
-   [AWS re:Invent 2023 - Advanced integration patterns & trade-offs for loosely coupled systems](https://www.youtube.com/watch?v=FGKGdUiZKto)
