---
layout: post
date: 2025-01-23
title: "[Dev] Call by reference vs Call by value"
tags: [Development, JavaScript]
categories: [CS]
---


## Call by reference

- 함수에 값을 전달할 때, Object 타입 (object, array, funtion)은 **참조 값, 즉 주소가 전달된다**.
- 함수 내부에서 객체의 내용 변경 시, 원본에도 영향이 간다.


{% raw %}
```javascript
function reference(obj) {
	obj.value = 10;
	console.log("Inside : ", obj);
	}
	
let new_obj = { value: 2 };
reference(new_obj);
console.log("Outside : ", new_obj);
```
{% endraw %}



결과 : 



{% raw %}
```javascript
Inside :  { value: 10 }
Outside :  { value: 10 }
```
{% endraw %}




## Call by value

- 함수 값을 전달할 때, Primitive 타입 (number, string, boolean 등)은 **값 자체의 복사본이 함수에 전할된다.**
- 함수 내부에서 값을 변경해도 원본에는 영향이 없다.


{% raw %}
```javascript
function value(x) {
    x = x + 10;
    console.log("Inside :", x);
}

let num = 5;
value(num);
console.log("Outside :", num);
```
{% endraw %}



결과 :



{% raw %}
```javascript
Inside : 15
Outside : 5
```
{% endraw %}


