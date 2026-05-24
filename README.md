# Plant Keeper

## 프로젝트 개요

Plant Keeper는 단순 식물 관리 앱이 아니다.

이 프로젝트의 핵심은:

"식물 관리 기록" + "사계절 감성 경험" + "시간이 쌓이는 공간"

이다.

사용자는 단순히:
- 물 준 날짜를 기록하는 것이 아니라

계절과 식물의 변화를
조용히 기록하고 감상하는 경험을 하게 된다.

Plant Keeper는:
- 생산성 앱
- 관리 툴
- 투두 앱

이 아니라,

"감성적인 식물 생활 아카이브"

를 목표로 한다.

---

# 핵심 디자인 철학

## 1. 살아있는 캘린더

캘린더는 단순 날짜 표가 아니다.

각 날짜 셀은:
- 작은 풍경
- 계절 조각
- 식물의 상태
- 시간의 축적

을 표현한다.

---

## 2. 계절이 UI 전체를 지배해야 함

계절은:
- 단순 색상 테마 변경이 아니라

UI 전체의:
- 공기감
- 조명
- 그림자
- 분위기
- 밀도

를 바꿔야 한다.

---

## 3. 한국 감성 기반 디자인

Plant Keeper는:
서양 botanical dashboard가 아니라

"조용한 한국의 사계절"

감성을 기반으로 한다.

핵심 키워드:
- 한국 아파트 햇살
- 조용한 오후
- 계절 공기
- 창문 그림자
- 카페 감성
- 느린 시간감
- 여백
- 자연광

---

# 핵심 UX 방향

## 목표 UX

사용자가 앱을 열었을 때:

"오늘 식물 상태를 관리해야지"

보다

"오늘 계절 분위기를 느끼고 싶다"

가 먼저 느껴져야 한다.

---

# 주요 기능 구조

# 1. 메인 월간 캘린더

프로젝트 핵심 기능.

## 기능
- 월간 캘린더
- 식물 상태 기록
- 날짜별 이벤트
- 계절별 분위기 변화
- 여러 식물 동시 관리

---

## 캘린더 철학

모든 이벤트는:
- 숨겨지면 안 됨
- 점(dot) 처리 지양
- overflow hidden 지양

각 이벤트는:
- 작은 landscape UI
- 작은 생태 변화
- 축적감

으로 표현해야 함.

---

# 2. 식물 등록 기능

## 기능
- 식물 추가
- 식물 이미지
- 이름
- 종류
- 물 주기
- 햇빛 정보
- 메모
- 성장 기록

---

## 방향성

단순 CRUD 느낌이 아니라:
- 감성 기록
- 식물 일기

느낌이어야 함.

---

# 3. 식물 상태 기록

식물 상태는:
텍스트 라벨이나 기능성 아이콘보다

환경 변화와 분위기 변화로 표현한다.

예:
- 흙의 수분감 변화
- 작은 새잎 성장
- 미세한 조명 변화
- 계절 입자 효과
- ambient glow
- 잎 방향 변화

사용자는 상태를 "읽는 것"이 아니라
"느끼는 경험"을 하게 된다.

---

## 상태 표현 방식

중요:
식물을 절대:
- 죽은 느낌
- grayscale
- opacity 감소

로 표현하지 않는다.

대신:
- 흙 상태
- 작은 새잎
- 미세한 glow
- 수분감
- 잎 변화

등으로 표현한다.

---

# 4. 계절 시스템

Plant Keeper의 핵심 시스템.

---

## 봄

### 특징
- 벚꽃 그림자
- 연분홍 bloom
- 따뜻한 햇살
- 꽃잎 particle

### 분위기
- 부드러움
- 시작
- 생장감

---

## 여름

### 특징
- 짙은 초록 canopy
- 강한 자연광
- 습한 공기감
- dense shadow

### 분위기
- 생명력
- 깊은 초록
- 풍성함

---

## 가을

### 특징
- 단풍 그림자
- amber sunlight
- 낙엽 particle
- 긴 그림자

### 분위기
- 따뜻함
- 기록감
- 축적감

---

## 겨울

### 특징
- 차가운 아침빛
- frost 느낌
- pale blue ambient
- 여백 강조

### 분위기
- 조용함
- 차분함
- 휴식감

---

# 5. 상단 Canopy 시스템

프로젝트 핵심 무드 요소.

---

## 정의

상단 canopy는:
- 단순 decoration이 아님

UI 전체 분위기를 결정하는:
- 환경 조명 레이어
- 그림자 레이어
- 공기 레이어

이다.

---

## 구성 요소

- overhanging branches
- leaf shadows
- translucent silhouettes
- sunlight diffusion
- seasonal overlays

---

## 구현 방식

### 사용 기술
- absolute layer
- mix-blend-mode
- opacity
- blur
- radial-gradient
- backdrop-filter

---

## 중요 원칙

절대:
- 스티커 느낌
- cartoon 느낌
- flat vector 느낌

이 되면 안 됨.

실제:
- 창문 너머 그림자
- 햇빛이 들어오는 느낌

처럼 표현해야 함.

---

# 6. 캘린더 셀 시스템

각 날짜 셀은:
"작은 살아있는 풍경"

이어야 함.

---

## 셀 구조

- date
- event stack
- soil layer
- sprout layer
- ambient layer
- seasonal particles

---

## 셀 상태 경우의 수

### 기본
이벤트 없음

### 물 준 날
soil moisture 강조

### 성장
새잎 / glow

### 여러 이벤트
dense stacking

### today
현재 날짜 강조

### selected
선택 상태

### hover
부드러운 hover

### 미래 일정
예정 상태

### 기록 축적
history density

---

# 7. Atmosphere Layer 시스템

Plant Keeper의 핵심.

---

## 구성 요소

- ambient light
- seasonal particles
- grain texture
- window shadow
- fog layer
- vignette
- depth blur

---

## 목적

단순 UI가 아니라:
"공기감"

을 만들기 위함.

---

# 8. 디자인 시스템 방향

## 핵심 방향

기본 UI보다:
- atmosphere
- spacing
- lighting
- emotional composition

이 더 중요함.

---

## 키워드

- breathable spacing
- cinematic light
- premium natural UI
- Korean emotional design
- calm seasonal mood
- tactile texture

---

# 기술 스택

## Frontend
- React
- TypeScript
- Emotion 또는 styled-components

---

## 상태 관리
- Zustand

---

## 디자인 구조
- Layered Design
- Atmosphere Layer System

---

## 스타일 핵심 기술

### 적극 사용
- mix-blend-mode
- backdrop-filter
- radial-gradient
- blur
- mask-image
- opacity layering

---

# 구현 철학

Plant Keeper는:
단순 컴포넌트 프로젝트가 아니라

"환경 연출 기반 UI"

프로젝트이다.

즉:
- 카드 디자인
- 버튼 디자인

보다

- 빛
- 그림자
- 공기
- 시간감

이 더 중요하다.

---

# 금지 사항

## 금지 디자인

- generic SaaS 느낌
- productivity dashboard
- harsh warning UI
- dead plant visuals
- excessive flat design
- cartoon plant style
- over-decoration

---

# 최종 목표

Plant Keeper의 최종 목표는:

"사용자가 계절과 식물의 시간을
조용히 기록하는 감성 공간"

을 만드는 것이다.

사용자는:
단순히 식물을 관리하는 것이 아니라,

시간과 계절을
천천히 쌓아가는 경험을 하게 된다.