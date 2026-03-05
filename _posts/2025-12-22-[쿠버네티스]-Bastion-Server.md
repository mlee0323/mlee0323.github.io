---
layout: post
date: 2025-12-22
title: "[쿠버네티스] Bastion Server"
tags: [MZC, K8s]
categories: [Docker]
---

설치되어야 할 패키지

- vim, git, curl, wget, net-tools, open-iscsi, nfs-common

Bastion Host로 사용할 우분투 서버의 ssh 설정

- 포트번호 변경 권장
- 루트 계정으로 접속 차단 : PermitRootLogin no
- 비어있는 비밀번호 금지 : PermitEmptyPasswords no


{% raw %}
```bash
host master
	HostName master
	User lee
	Port 22
```
{% endraw %}



연결할 vm에서


sudo ufw default deny incoming


sudo ufw default allow outgoing


sudo ufw allow from <ip/24> :  전체 네트워크 그룹 여는거


sudo ufw allow from <ip> to any port  22 proto tcp : 하나 여는거


sudo ufw enable


sudo ufw status

