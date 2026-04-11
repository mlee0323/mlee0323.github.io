---
layout: post
date: 2026-04-11
title: "[AWS] ALB + Ingress의 사용 이유와 NLB 차이점"
tags: [Study]
categories: [AWS]
---


## 이 글의 용도


이번 글은 면접 준비 + 프로젝트 정리를 하며 이해도를 높이기 위한 글이다



## ALB + Ingress


---


왜 이러한 구조를 선택했는가?


→ 쿠버네티스 내부 routing abstracion과 AWS L7 기능을 분리해서 관리하기 위해



#### Ingress


일단 Ingress는 우리가 프로젝트에서 선택한 MSA 구조에서 서비스의 확장성을 고려했다.


이로 인하여 각 서비스별 routing rule을 쿠버네티스 리소스로 관리하기 위해서이다.


예를 들어 /auth, /flight, /payment 같은 path 기반 routing을 Ingress로 관리하게 되면 서비스를 확장하거나 변경할때 애플리케이션 레벤이 아니라 쿠버네티스 레벨에서 통제가 가능하다.



#### ALB


AWS에서 제공하는 L7의 기능을 사용하기 위해서이다.


기본적으로 AWS Load Balancer Controller가 Ingress를 감지해서 자동으로 생성한다.


또한 CloudFront와의 연동이 편리하고 TLS termination이 가능하기 때문이다.


특히 Ingress에서 routing을 정의하고 그 역할을 수행하는것은 ALB이기 때문이다.



## NLB 사용하지 않은 이유


---


일단 NLB는 L7 기반이기 때문에 path 기반 routing이 불가능하다.


물론 TCP 성능이 더 좋고 latency가 낮다고는 하지만 실제로 사용해보지는 않아서 아직 잘 모르겠다.


또한 이번 프로젝트 경우에는 모든 요청이 HTTPS로 들어오게 되어있는데 TLS termination을 하기 위해서는 NLB에서 하지 못한다고 한다. 



## ALB만 사용가능한데 Ingress를 사용한 이유


---


일단 Ingress를 사용하게 된다면 운영 책임과 변경 관리 범위를 쿠버네티스 내부로 제한이 가능하다.


무슨말인가?


ALB만으로 path routing이 가능하지만 AWS 리소스 수준으로 직접 관리해야 한다.


만약 새로운 서비스가 추가가 된다고 가정하고, ALB만을 사용한다고 생각해보자.

1. AWS콘솔 또는 Terraform을 수정하고
2. ALB listener rule 추가
3. target group 생성

즉, 애플리케이션이 변경이 되는것인데 인프라를 변경해야 한다.


또한 우리 프로젝트는 ArgoCD 기반으로 관리하기 때문에 Git 기반의 관리가 좋다.


또한 Ingress를 사용하여 코드 기반으로 관리를 하게 된다면 위에처럼 인프라를 수정안해도 되고 yaml파일만 수정하면 라우팅이 바로 가능하다.

