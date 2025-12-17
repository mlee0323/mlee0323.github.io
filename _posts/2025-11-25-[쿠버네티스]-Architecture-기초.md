---
layout: post
date: 2025-11-25
title: "[쿠버네티스] Architecture 기초"
tags: [K8s]
categories: [K8s]
---

> 💡 본 내용은 공부한 내용에 기반하였음



#### Master Node / Control Plane

- Kube-API Server
	- 모든 내/외부 명령어가 처리되는 곳
	- REST API 제공, Authentication, Authorization, Admission Control 기능 제공
	- 수평 확장이(Scale-out)이 가능하도록 설계되어있음
- Kube-Schedular
	- NodeName, 즉 아직 할당되지 않은 pod를 감지하고, 실행할 최적의 Node에 배치
	- 스케줄링 기준
		- 리소스 요구사항 (CPU/Memory)
		- 하드웨어/소프트웨어 제약 조건
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
	- IP는 pod에 부여되기 때문에 내부의 컨테이너는 모두 동일한 IP, 포트로 구현
- Deployment
	- Pod와 ReplicaSet에 대한 declarative updates 제공
	- Rolling update, rollback, scaling, pausing
	- 사용자가 desired state 정의 시, depoloyment controller가 actual state를 이에 맞춤
- Service
	- Pod의 집합에 접근할 수 있는 정책을 정의하는 추상적 개념
	- Pod는 일시적(Ephemeral)이기에 ip가 변동하므로, 고정된 virtual IP(ClusterIP)를 제공하여 안정적인 네트워크 엔드포인트 보장
- ConfigMap
	- 기밀성이 없는 일반적인 설정 데이터를 저장
	- etcd에 평문으로 저장되며, 1MB를 초과할 수 없음
	- 환경 변주로 주입 시 파일이 변경되면 파드 재생성해야함
	- 볼륨으로 마운트시 싱크 주기에 따라 자동 갱신
- Secret
	- .env와 비슷한 역할
	- 비밀번호, 토큰, 키 등 민감한 데이터를 저장
	- base64로 인코딩되어 저장
		- 아무나 디코딩 가능하기에 etcd 저장 시 `EncyptionConfiguration` 설정해줘야함
	- 볼륨 마운트시 노드 디스크에 민감 정보가 기록되는 것을 방지하기 위해 디스크가 아닌 tmpfs(RAM 메모리 파일시스템)에 저장
- PV (PersistentVolume)
	- 클러스터 내에 존재하는 실제 스토리지 자원
	- Cluster 레벨 리소스이며, namespace에 속하지 않음
- PVC (PersistentVolumeClaim)
	- 사용자가 PV를 사용하기 위해 요청하는 일종의 스토리지 요청서(claim)
	- Namespace 레벨 리소스
	- PVC 생성 시 PV Controller가 클러스터 내의 pv 중 조건이 일치하는 것을 찾아 연결

아래는 예시들이다

<details>
  <summary>ConfigMap</summary>



{% raw %}
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mysql-config
  namespace: mysql-2tier
```
{% endraw %}




  </details><details>
  <summary>Secret</summary>



{% raw %}
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysql-secret
  namespace: mysql-2tier
data:
  mysql-root-password: MDMyMw==
  mysql-user-id: bGVl
  mysql-user-password: MDMyMw==
  mysql-database-name: bGVl
```
{% endraw %}




  </details><details>
  <summary>PV</summary>



{% raw %}
```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: mysql-pv-2tier
spec:
  # storageClassName: manual 바운드가 안되면 추가
  capacity:
    storage: 5G
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/var//var/lib/mysql"
```
{% endraw %}




  </details><details>
  <summary>PVC</summary>



{% raw %}
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mysql-pvc
  namespace: mysql-2tier
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5G
```
{% endraw %}




  </details><details>
  <summary>Deployment</summary>



{% raw %}
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql-deploy
  namespace: mysql-2tier
spec:
  selector:
    matchLabels:
      app: mysql
  replicas:
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
        - name: mysql
          image: mysql:8.0.44-debian
          env:
            - name: MYSQL_ROOT_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: mysql-secret
                  key: mysql-root-password
          # - name: MYSQL_USER
          #   valueFrom:
          #     secretKeyRef:
          #       name: mysql-secret
          #       key: mysql-user-id
          # - name: MYSQL_PASSWORD
          #   valueFrom:
          #     secretKeyRef:
          #       name: mysql-secret
          #       key: mysql-user-password
          # - name: MYSQL_DATABASE
          #   valueFrom:
          #     secretKeyRef:
          #       name: mysql-secret
          #       key: mysql-database-name
          ports:
            - containerPort: 3306
              name: mysql
          volumeMounts:
            - name: mysql-storage
              mountPath: /var/lib/mysql
            - name: initdb
              mountPath: /docker-entrypoint-initdb.d
            - name: mysql-config-volume
              mountPath: /etc/mysql/conf.d/
              readOnly: true
      volumes:
        - name: mysql-storage
          persistentVolumeClaim:
            claimName: mysql-pvc
        - name: initdb
          configMap:
            name: mysql-initdb-config
        - name: mysql-config-volume
          configMap:
            name: mysql-config
```
{% endraw %}




  </details><details>
  <summary>Service</summary>



{% raw %}
```yaml
apiVersion: v1
kind: Service
metadata:
  name: mysql-svc
  namespace: mysql-2tier
spec:
  type: ClusterIP
  selector:
    app: mysql
  ports:
    - protocol: TCP
      port: 3306
      targetPort: 3306
```
{% endraw %}




  </details>