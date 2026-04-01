---
layout: post
date: 2026-03-18
title: "[AWS] ssm기반 zero-trust 연결 문제"
tags: [Study, MZC]
categories: [AWS]
---


### SSM 기반 zero-trust?


이 문제의 시작은 EKS관리를 위한 관리자용 접근에서 시작했다.


관리를 위하여 EKS 에 접근하는 방법은 세가지 방법이 있다.

1. SSH + Bastion
2. VPN
3. SSM

이때 Bastion과 VPN 모두 외부에 엔드포인트가 존재하거나 포트가 열려야 한다.


→ 무슨 말인가? 공격당하기 쉽다는 뜻이다. 


물론 Bastion을 사용하면 결국 진입점이 하나만 되기 때문에 더 쉽게 대처할 수 있지만 그래도 공격에 노출이 된다.


그렇다면 SSM은? 


IAM 기반으로 하여서 aws cli 계정 인증을 통해서만 들어갈 수 있고, 이를 zero-trust라고 한다.


> 제로 트러스트는 암시적 신뢰를 제거하고 엄격한 ID 인증 및 승인을 적용하여 현대 조직을 보호하도록 설계된 클라우드 보안 모델이다. 제로 트러스트에서는 모든 사용자, 기기, 구성요소가 조직의 네트워크 내부에 있는지 또는 외부에 있는지에 관계없이 항상 신뢰할 수 없는 것으로 간주된다. - [Google Cloud](https://cloud.google.com/learn/what-is-zero-trust?hl=ko) 


물론 엔드포인트가 필요하지만 결국 내부에 존재하는 것이기 때문에 공격당할 가능성은 적다.


이번 프로젝트에서는 ssm기반의 zero-trust를 설계하였고, private subnet에 관리용 workstation을 구성하였다.


이때 eks와 통신하기 위해서는 보안그룹 설정이 중요하다.



#### 보안 그룹 관련


보안 그룹 이름 :  workstation-airline-sg

- 아웃바운드 : 443(HTTPS로 접속)

보안 그룹 이름 : **ssm-vpc-endpoint-sg**

- 인바운드 : 443(HTTPS로 접속 / 소스 지정을 workstation-airline-sg)

이 보안 그룹은 처음에 아웃바운드 하나만 있으면 되는줄 알았다.


오후에 성공한 이유는 아무생각없이 인/아웃바운드 443을 전부 열었기 때문.


하지만 ec2에서 ssm endpoint로 요청을 쏘는 방식이기 때문에 ec2에서는 아운바운드로 열어야 한다.


이때 소스는 0.0.0.0/0 으로 열어도 상관없다. 어차피 밖으로 보내는것이기 때문.


문제는 이 endpoint 쪽에서 발생. ec2에서 트래픽(?) 을 쏘면 ssm endpoint에서 받아야 하는데, 이전에는 아웃바운드만 열려있어서 못받음! → ssm연결 당연히 x


그래서 보안 그룹 추가하고 인바운드로 ec2 보안그룹을 지정해서 443 오픈 → ssm 접속 성공

