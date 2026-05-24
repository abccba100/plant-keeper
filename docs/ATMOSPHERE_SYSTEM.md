# ATMOSPHERE_SYSTEM

# 개요

Plant Keeper의 핵심은:
단순 UI가 아니라

"계절 기반 분위기 경험"

이다.

따라서:
- 카드
- 버튼
- 컴포넌트

보다

- 공기감
- 조명
- 그림자
- 깊이감
- 계절감

이 더 중요하다.

---

# 핵심 철학

Plant Keeper는:
사용자가 정보를 읽는 앱이 아니라,

계절과 시간을
느끼는 공간이어야 한다.

즉:
UI보다 atmosphere가 우선이다.

---

# Atmosphere Layer 구조

Plant Keeper는
다중 atmosphere layer 구조를 사용한다.

레이어 순서:

1. Background Atmosphere Layer
2. Seasonal Light Layer
3. Canopy Shadow Layer
4. Ambient Particle Layer
5. UI Layer
6. Glass / Blur Layer

---

# 1. Background Atmosphere Layer

## 역할

전체 계절 공기감 표현.

## 구성 요소

- radial gradient
- ambient seasonal tint
- vignette
- soft edge darkening

## 특징

배경은 flat color가 아니라:
공기처럼 느껴져야 한다.

---

# 2. Seasonal Light Layer

## 역할

계절별 조명 분위기 표현.

## 봄
- pale pink light
- soft bloom
- warm daylight

## 여름
- saturated green light
- humid glow
- rich sunlight

## 가을
- amber directional light
- warm sunset tone
- deep shadow contrast

## 겨울
- pale blue ambient light
- frosted atmosphere
- soft cold lighting

---

# 3. Canopy Shadow Layer

## 가장 중요한 atmosphere 요소.

Canopy는:
단순 decoration이 아니다.

UI 전체 분위기를 만드는:
환경 그림자 시스템이다.

---

## 구성 요소

- branch silhouettes
- leaf shadows
- translucent overlays
- sunlight diffusion
- seasonal shadow patterns

---

## 구현 목표

사용자는:
"나무 이미지를 보는 것"이 아니라

"창문 너머 햇빛과 그림자를 느껴야 한다."

---

## 금지 사항

- sticker-like tree
- obvious PNG decoration
- cartoon branches
- flat vector shadows

---

## 구현 방식

- absolute positioning
- mix-blend-mode
- opacity layering
- blur diffusion
- radial light masking

---

# 4. Ambient Particle Layer

## 역할

공기감 표현.

## 구성 요소

### 봄
- flower petals
- pollen particles

### 여름
- dust glow
- humid particles

### 가을
- leaf particles
- warm dust

### 겨울
- frost particles
- snow haze

---

## 중요 원칙

particles는:
보이는 것이 아니라
느껴져야 한다.

과하면 안 된다.

---

# 5. UI Layer

실제 인터랙션 UI.

## 포함 요소

- sidebar
- calendar grid
- filters
- modals
- buttons

---

## 중요 원칙

UI는:
atmosphere 위에
조용히 놓여 있어야 한다.

---

# 6. Glass / Blur Layer

## 역할

깊이감 강화.

## 구성 요소

- backdrop blur
- translucent overlay
- soft bloom
- subtle reflection

---

# 계절별 핵심 감성

## 봄
"조용히 피어나는 공기"

## 여름
"짙은 초록 아래의 햇살"

## 가을
"따뜻한 기록의 시간"

## 겨울
"차가운 새벽의 여백"

---

# 구현 핵심 기술

적극 사용:

- mix-blend-mode
- backdrop-filter
- radial-gradient
- blur
- opacity layering
- mask-image
- layered z-index system

---

# 가장 중요한 원칙

Plant Keeper는:
UI 프로젝트가 아니라

"분위기 연출 시스템"

프로젝트이다.

모든 구현은:
기능보다 atmosphere를 우선한다.