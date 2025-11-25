---
layout: post
date: 2025-11-25
title: "[쿠버네티스] Architecture 기초"
tags: [K8s]
categories: [K8s]
---


#### Master Node / Control Plane

- Kube-API Server
	- 모든 내/외부 명령어가 처리되는 곳
	- REST API 제공, Authentication, Authorization, Admission Control 기능 제공
	- 수평 확장이(Scale-out)이 가능하도록 설계되어있음
- Kube-Schedular
	- NodeName, 즉 아직 할당되지 않은 pod를 감지하고, 실행할 최적의 Node에 배치
	- 스케줄링 기준
		- 리소스 요구사항 (CPU/Memory)
		- 하드웨어/소프트웨어 제약 조건ㄱ
		- Affinity 및 Anti-affinity
		- Taint와 Toleration
- Kube-Controller-Manager
	- 컨트롤러 프로세스를 구동하는 컴포넌트
	- 주요 컨트롤러
		- Node Controller : 노드가 다운되었을 때 감지 후 대응
		- Replication Controller : 시스템의 모든 Replication Controller 오브젝트에 대해 알맞을 수의 pod를 유지
		- Endpoint Controller : Service와 Pod를 연결
- etcd
	- 모든 클러스터 데이터를 저장하는 고가용성 key-value 저장소
	- K8s의 유일한 Stateful 컴포넌트이며, Single Source of Truth (얘만 있으면 복구 사능)


#### Worker Node


모든 Worder Node에서 실행되며, pod를 유지 관리하고 런타임 환경 제공

- Kubelet
	- 클러스터의 각 노드에서 실행되는 에이전트. PodSpec의 정의에 따라 관리
	- API Server와 통신하여 노드의 리소스 상태를 보고하고, Pod의 Health Check
	- 쿠버네티스를 통해 생성된 컨테이너만 관리
- Kube-proxy
	- 각 노드에서 실행되는 네트워크 프록시
	- 노드의 네트워크 규칙(iptables or IPVS)를 유지 관리하고 클러스터 내/외부의 통신 라우팅
- Container Runtime
	- 실제로 컨테이너를 실행하는 소프트웨어
	- Containerd, CRI-O등 Kubernetes CRI를 구현한 런타임


#### Core Objects Definition

- Pod
	- 쿠버네티스에서 생성하고 관리하는 가장 작은 배포 단위
	- 하나 이상의 컨테이너 그룹
	- 스토리지/네트워크 공유
- Deployment
	- Pod와 ReplicaSet에 대한 declarative updates 제공
	- Rolling update, rollback, scaling, pausing
	- 사용자가 desired state 정의 시, depoloyment controller가 actual state를 이에 맞춤
- Service
	- Pod의 집합에 접근할 수 있는 정책을 정의하는 추상적 개념
	- Pod는 일시적(Ephemeral)이기에 ip가 변동하므로, 고정된 virtual IP(ClusterIP)를 제공하여 안정적인 네트워크 엔드포인트 보장
