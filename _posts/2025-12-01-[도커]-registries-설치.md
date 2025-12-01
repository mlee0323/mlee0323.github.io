---
layout: post
date: 2025-12-01
title: "[도커] registries 설치"
tags: [MZC, Docker]
categories: [Docker]
---

vmware에서 서버 새로 설치 후, 도커까지 설치한다



{% raw %}
```bash
docker pull registry # 레지스트리 이미지 pull

# 레지스트리 run, 다른점은 -v 로 volume 설정
docker run -d -p 5000:5000 -v /home/lee/registry_data:/var/lib/registry \
--restart=always --name=docker-registry-1 registry:latest

# nginx pull
docker pull nginx:1.29.3-alpine

# 이런식으로 registry 통해 업로드 하려고 할때는 id 대신 ip가 들어감
docker image tag nginx:1.29.3-alpine 192.168.184.4:5000/nginx:1.29.3-lee

docker push 192.168.184.4:5000/nginx:1.29.3-lee

# 아래 파일 내용들 수정
sudo vim /etc/init.d/docker
# 위의 파일에서는 DOCKER_OPTS=--insecure-registry 192.168.184.4:5000
# 이 부분만 수정하면 된다

sudo vim /etc/docker/daemon.json
# 위의 파일은 내용만 추가
# { "insecure-registries": ["192.168.184.4:5000"] }

sudo systemctl restart docker.service

# 확인 (이름만)
curl -X GET http://192.168.184.4:5000/v2/_catalog

# 확인 (태그까지)
curl -X GET http://192.168.184.4:5000/v2/nginx/tags/list
```
{% endraw %}


