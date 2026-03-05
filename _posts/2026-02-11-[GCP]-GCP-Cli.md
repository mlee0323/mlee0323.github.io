---
layout: post
date: 2026-02-11
title: "[GCP] GCP Cli"
categories: [GCP]
---


## 네트워크 구성



#### 1.1 VPC 생성



{% raw %}
```bash
gcloud compute networks create lee-vpc --subnet-mode=custom

gcloud compute networks update lee-vpc --bgp-routing-mode=global
```
{% endraw %}




#### 1.2 Subnet


| 용도             | CIDR        | 갯수 | 이유 |
| -------------- | ----------- | -- | -- |
| Public Subnet  | 10.0.0.0/24 |    |    |
| Private Subnet | 10.1.0.0/20 |    |    |
|                |             |    |    |
|                |             |    |    |

undefined
퍼블릭 서브넷 10.0.0.0/24 256개


프라이빗 10.1.0.0/20



#### 1.2.1 Subnet 생성



{% raw %}
```bash
# Public subnet
gcloud compute networks subnets create [subnet-name] \
--network=[vpc-name] \
--range=[CIDR] \
--region=[region-name]

# 예시
gcloud compute networks subnets create lee-subnet-public \
--network=lee-vpc \
--range=10.0.0.0/24 \
--region=asia-northeast2

# Private subnet
gcloud compute networks subnets create [subnet-name] \
--network=[vpc-name] \
--range=[CIDR] \
--region=[region-name] \
--secondary-range=[range-name]=[CIDR] \ # 여러개 가능
--enable-private-ip-google-access

# 예시
gcloud compute networks subnets create lee-subnet-private \
--network=lee-vpc \
--range=10.128.0.0/14 \
--region=asia-northeast2 \
--secondary-range=lee-pod-range=10.10.0.0/16 \
--secondary-range=lee-service-range=10.100.0.0/20  \
--enable-private-ip-google-access
```
{% endraw %}




{% raw %}
```bash
gcloud compute routers create [router-name] \
--network=[vpc-name] \
--region=[region-name]
```
{% endraw %}




{% raw %}
```bash
gcloud compute routers nats create [nat-name] \
--router=[router-name] \
--region=[region-name] \
--auto-allocate-nat-external-ips \ # nat에 ip부여
--nat-all-subnet-ip-ranges
```
{% endraw %}




{% raw %}
```bash
gcloud compute firewall-rules create lee-allow-ssh \
--network=lee-vpc \
--priority=1000 \
--direction=INGRESS \
--action=ALLOW \
--target-tags=ssh-server \
--rules=tcp:22 \
--source-ranges=0.0.0.0/0
```
{% endraw %}




{% raw %}
```bash
gcloud compute firewall-rules create lee-allow-sshs \
--network=lee-vpc \
--priority=1000 \
--direction=INGRESS \
--action=ALLOW \
--target-tags=https-server \
--rules=tcp:344 \
--source-ranges=0.0.0.0/0
```
{% endraw %}




{% raw %}
```bash
gcloud compute firewall-rules create lee-allow-http \
--network=lee-vpc \
--priority=1000 \
--direction=INGRESS \
--action=ALLOW \
--target-tags=http-server \
--rules=tcp:80 \
--source-ranges=0.0.0.0/0
```
{% endraw %}




{% raw %}
```bash
gcloud compute firewall-rules create lee-allow-internal \
--network=lee-vpc \
--priority=65534 \
--direction=INGRESS \
--action=ALLOW \
--target-tags=all-allow \
--rules=all \
--source-ranges=10.0.0.0/16
```
{% endraw %}




{% raw %}
```bash
gcloud compute firewall-rules create lee-allow-icmp \
--network=lee-vpc \
--priority=1000 \
--direction=INGRESS \
--action=ALLOW \
--target-tags=icmp-server \
--rules=icmp \
--source-ranges=0.0.0.0/0
```
{% endraw %}




{% raw %}
```bash
gcloud compute firewall-rules create lee-allow-lb-health-check \
--network=lee-vpc \
--priority=1000 \
--direction=INGRESS \
--action=ALLOW \
--target-tags=health-check-server \
--source-ranges=130.211.0.0/22,35.191.0.0/16 \
--rules=tcp:80
```
{% endraw %}




{% raw %}
```bash
# 만든거 수정
gcloud compute firewall-rules update lee-allow-lb-health-check \
--source-ranges=130.211.0.0/22,35.191.0.0/16
```
{% endraw %}




{% raw %}
```bash
gcloud compute firewall-rules list --filter="name ~ lee"
```
{% endraw %}




{% raw %}
```bash
gcloud compute instances create [instance-name] \
--project=$(gcloud config get-value-project) \
--network=[vpc-name] \
--zone=[zone-name] \
--subnet=[subnet-name] \
--tags=[firewall-rules],[firewall-rules]... \
--machine-type=[machine-type-name] \ # ex) e2-mirco
# gcloud compute images list --project=ubuntu-ois-cloud --filter="name ~ 'ubuntu-2404'"
# 위에꺼 치면 이런식으로 나옴 ubuntu-2404-noble-amd64-v20260128  ubuntu-os-cloud  ubuntu-2404-lts-amd64
--images-project=[image-project-name] \ # ex) ubuntu-os-cloud
--image-family=[os-name] \ # ex) ubuntu-2404-lts-amd64
--labels=[label-key]=[label-value] \
--no-address

# 예시

gcloud compute instances create lee-vm \
--project=$(gcloud config get-value project) \
--network=lee-vpc --zone=asia-northeast2-a \
--subnet=lee-subnet-public --machine-type=e2-micro \
--tags=ssh-server,http-server,https-server,all-allow,icmp-server,health-check-server \
--image-project=ubuntu-os-cloud \
--image-family=ubuntu-2404-lts-amd64 \
--labels=username=lee,team=team2 \
--scopes=https://www.googleapis.com/auth/cloud-platform \
--metadata=startup-script-url=gs://lee-bucket-vm/init.sh \
--no-address # private

# 삭제
gcloud compute instances delete lee-test-vm --zone=asia-northeast2-a
```
{% endraw %}




{% raw %}
```bash
# 삭제하는 방법중 제일 편한거
# 방화벽 기준
gcloud compute firewall-rules list | grep lee
# 이렇게 하면 lee가 들어간 방화벽들 나오는데
# 아래 명령어로 하면 한번에 삭제 가능
gcloud compute firewall-rules delete $(gcloud compute firewall-rules list | grep lee)
```
{% endraw %}




{% raw %}
```bash
gcloud compute health-checks create http lee-helth-check \
--region=asia-northeast2 \
--port=80 \
--check-interval=5s \
--timeout=5s \
--healthy-threshold=2 \
--unhealthy-threshold=3

# stateless 관리형 인스턴스 그룹 생성
gcloud compute instance-groups managed create lee-mig \
--template=lee-tmp \
--size=1 \
--region=asia-northeast2 \
--zones=asia-northeast2-a,asia-northeast2-b,asia-northeast2-c \
--base-instance-name=lee-app \
--health-check=projects/$(gcloud config get-value project)/regions/asia-northeast2/healthChecks/lee-helth-check \
--initial-delay=300
```
{% endraw %}




{% raw %}
```bash
gcloud compute instance-templates create lee-tmp \
--project=$(gcloud config get-value project) \
--network=lee-vpc \
--region=asia-northeast2 \
--subnet=lee-subnet-public \
--machine-type=e2-micro \
--tags=ssh-server,http-server,https-server,all-allow,icmp-server,health-check-server \
--image-project=ubuntu-os-cloud \
--image-family=ubuntu-2404-lts-amd64 \
--scopes=https://www.googleapis.com/auth/cloud-platform \
--metadata=startup-script-url=gs://lee-bucket-vm/init.sh \
--boot-disk-size=20GB \
--boot-disk-type=pd-balanced \
--no-address
```
{% endraw %}




{% raw %}
```bash
# autoscaling

gcloud compute instance-groups managed set-autoscaling lee-mig \
--region=asia-northeast2 \
--min-num-replicas=1 \
--max-num-replicas=2 \
--target-cpu-utilization=0.6 \
--cool-down-period=60
```
{% endraw %}


