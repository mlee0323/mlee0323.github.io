---
layout: post
date: 2025-09-26
title: "[네트워크] Packet-switching"
tags: [Study]
categories: [Network, CS]
---


## Packet-switching 특징 4가지

1. store-and-forward
	- 노드를 거칠 때마다 store and forward가 일어남. 왜? 전자신호이기 때문에 비트들을 프레임 단위로 잘라 내고 어디로 보낼지 결정해야 함으로 store 후 forward 해야함.
2. queueing delay, loss
	- store가 일어나고, 저장 공간은 유한하기 때문에 저장 공간이 찬 이후 들어오는 비트는 loss 발생
3. out-of-order delivery
	- 보내는 순서와 받는 순서가 다름
	- multiple path로 인해 발생. 반대 : in-order delivery
4. best-effort
	- 최선을 다해서 목적지로 보내지만, loss, out-of-order, delay 발생 가능
