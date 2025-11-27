---
layout: post
date: 2025-11-14
title: "[알고리즘] Binary Search"
tags: [Algorithm]
categories: [Algorithm]
---


## 이진탐색이란? (Binary Search)


검색이 매우 빠른 알고리즘이다. 다만, 이진탐색이 가능하기 위해서는 데이터가 sorted된 상태여야 한다.



#### 작동 원리


target을 찾기 위해 인덱스의 중간값(mid)와 먼저 비교한다. 만약 target이 더 크다면 왼쪽으로, 작아면 오른쪽으로 이동하면서 검색한다.


이렇게 된다면 절반은 버리고 시작할 수 있기 때문에 매우 빠른 속도로 검색할 수 있다. 


시간복잡도 : 

- Best : O(1)
- Average : O(log n)
- Worst : O(log n)
