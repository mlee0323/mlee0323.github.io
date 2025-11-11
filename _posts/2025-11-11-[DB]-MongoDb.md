---
layout: post
date: 2025-11-11
title: "[DB] MongoDb"
tags: [MZC]
categories: [Database]
---

MongoDb는 NoSQL 데이터베이스이다.


[RDB vs NoSQL](https://mlee0323.github.io/posts/DB-RDB-vs-NoSQL/)


우분투 버전에 따라 조금씩 다르다



{% raw %}
```shell
- 우분투 버전 확인
cat /etc/lsb-release

- 공개 키 소프트웨어 설치
sudo apt-get install gnupg curl

- 공개키 가져오기
curl -fsSL https://pgp.mongodb.com/server-8.0.asc | \
sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg \
	   --dearmor
   
- Ubuntu 24.04 사용중
 echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.2.list
 
 sudo apt update
 sudo apt install -y mongodb-org=8.2.0 mongodb-org-database=8.2.0 mongodb-org-server=8.2.0 mongodb-mongosh mongodb-org-mongos=8.2.0 mongodb-org-tools=8.2.0
 
- 서비스 실행 및 시작 등록
~$ sudo systemctl start mongod
~$ sudo systemctl enable mongod

- 접속 방버
mondosh
```
{% endraw %}



데이터베이스 삽입



{% raw %}
```sql
-- 데이터베이스 만들기. 여기서 다른점은 안에 내용이 없으면 뜨지 않음
db.myCollection.insertOne({name: "study"})

-- db 확인
show dbs
```
{% endraw %}


