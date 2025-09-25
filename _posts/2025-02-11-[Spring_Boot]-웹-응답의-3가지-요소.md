---
layout: post
date: 2025-02-11
title: "[Spring_Boot] 웹 응답의 3가지 요소"
tags: [Spring Boot, Java]
categories: [Spring Boot]
---


## 웹 응답의 3가지 요소

1. 상태 라인에서 상태 코드
2. Header 만든 뒤, body가 어떠한 content type 인지를 정하는 content type header
3. body 부분


{% raw %}
```java
resp.setStatus(200);
resp.setHeader("Content-Type", "text/plain");
resp.getWriter().println("Hello Servlet");
```
{% endraw %}


