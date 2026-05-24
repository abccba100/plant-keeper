# CANOPY_SYSTEM

# 개요

Plant Keeper의 canopy는:
단순 장식 요소가 아니다.

UI 전체 분위기를 결정하는:
환경 조명 시스템이다.

사용자는:
"나무를 보는 것"이 아니라

"햇빛과 그림자를 느껴야 한다."

---

# 핵심 역할

Canopy는:
- 계절 공기감
- 자연광 분위기
- 공간 깊이
- 감정적 몰입감

을 담당한다.

---

# 핵심 철학

중요:
Canopy는 절대
"PNG 나무 장식"

처럼 보이면 안 된다.

대신:
- 창문 너머 그림자
- 실제 햇빛
- 자연광 diffusion
- 부드러운 식물 실루엣

처럼 느껴져야 한다.

---

# 구조

Canopy는:
다중 레이어 구조로 구현한다.

---

# Layer 1 — Base Light

## 역할

계절별 전체 조명 분위기.

## 구현

- radial-gradient
- warm ambient tint
- soft directional light

---

# Layer 2 — Branch Silhouette

## 역할

큰 가지 흐름 표현.

## 특징

- blurred
- translucent
- low contrast
- natural curves

## 금지

- flat vector branch
- cartoon shape
- hard edge silhouette

---

# Layer 3 — Leaf Shadow

## 역할

공간 위로 드리워지는 잎 그림자.

## 특징

- soft blur
- multiply blend
- layered opacity
- directional lighting

---

# Layer 4 — Atmospheric Diffusion

## 역할

빛 퍼짐 표현.

## 구성 요소

- bloom glow
- fog tint
- sunlight bleed
- subtle haze

---

# Layer 5 — Floating Particles

## 역할

공기감 강화.

## 특징

particles는:
보이는 것이 아니라
느껴져야 한다.

---

# 계절별 Canopy 방향

# 봄

## 분위기
- 벚꽃 그림자
- 연한 pink glow
- 부드러운 bloom

## 특징
- 밝은 공기
- 가벼운 particle
- soft sunlight

---

# 여름

## 분위기
- 짙은 초록 canopy
- 강한 자연광
- dense shadow

## 특징
- leaf overlap 증가
- humid glow
- richer contrast

---

# 가을

## 분위기
- amber sunlight
- maple shadow
- 긴 그림자

## 특징
- warm dust
- golden light
- deep atmosphere

---

# 겨울

## 분위기
- pale blue light
- frost haze
- 차가운 공기

## 특징
- sparse branches
- minimal shadow
- quiet empty spacing

---

# 구현 기술

반드시 적극 활용:

- mix-blend-mode
- backdrop-filter
- filter: blur()
- opacity layering
- mask-image
- radial-gradient
- z-index layering

---

# 가장 중요한 원칙

Canopy는:
"보이는 오브젝트"

가 아니라,

"공간의 공기와 빛"

처럼 느껴져야 한다.