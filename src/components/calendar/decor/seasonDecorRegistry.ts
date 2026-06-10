import type { Season } from '../../../store/calendarData'

// ─── WebP assets ─────────────────────────────────────────────────────────────
// All images are served as WebP (converted from PNG via `npm run convert-images`).
// PNG originals are kept as a fallback but are not imported here.
// ─────────────────────────────────────────────────────────────────────────────
import autumnBranchHero from '../../../assets/calendar-decor/high-res/autumn-hero-flipped.webp?url'
import autumnGround from '../../../assets/calendar-decor/elements/autumn/decor-09.webp?url'
import autumnFloater from '../../../assets/calendar-decor/high-res/autumn-floater.webp?url'
import autumnMascot from '../../../assets/calendar-decor/elements/autumn/decor-05.webp?url'
import autumnRibbon from '../../../assets/calendar-decor/high-res/autumn-ribbon.webp?url'
import autumnBranchSub from '../../../assets/calendar-decor/high-res/autumn-sub.webp?url'
import springBranchHero from '../../../assets/calendar-decor/high-res/spring-hero.webp?url'
import springBranchSub from '../../../assets/calendar-decor/high-res/spring-sub.webp?url'
import springFloater from '../../../assets/calendar-decor/high-res/spring-floater.webp?url'
import springGround from '../../../assets/calendar-decor/high-res/spring-ground.webp?url'
import springMascot from '../../../assets/calendar-decor/high-res/spring-mascot.webp?url'
import springRibbon from '../../../assets/calendar-decor/high-res/spring-ribbon.webp?url'
import summerFloater from '../../../assets/calendar-decor/elements/summer/decor-06.webp?url'
import summerMascot from '../../../assets/calendar-decor/elements/summer/decor-08.webp?url'
import summerRibbon from '../../../assets/calendar-decor/elements/summer/branch-02.webp?url'
import summerBranchHero from '../../../assets/calendar-decor/high-res/summer-hero.webp?url'
import summerBranchSub from '../../../assets/calendar-decor/high-res/summer-sub.webp?url'
import summerGround from '../../../assets/calendar-decor/high-res/summer-ground.webp?url'
import winterBranchHero from '../../../assets/calendar-decor/high-res/winter-hero.webp?url'
import winterBranchSub from '../../../assets/calendar-decor/high-res/winter-sub.webp?url'
import winterFloater from '../../../assets/calendar-decor/high-res/winter-floater.webp?url'
import winterGround from '../../../assets/calendar-decor/high-res/winter-ground.webp?url'
import winterMascot from '../../../assets/calendar-decor/high-res/winter-mascot.webp?url'
import winterRibbon from '../../../assets/calendar-decor/high-res/winter-ribbon.webp?url'

export type SeasonDecorSet = {
  hero: string
  sub: string
  mascot: string
  floater: string
  ground: string
  ribbon: string
}

export const seasonDecor: Record<Season, SeasonDecorSet> = {
  spring: {
    hero: springBranchHero,
    sub: springBranchSub,
    mascot: springMascot,
    floater: springFloater,
    ground: springGround,
    ribbon: springRibbon,
  },
  summer: {
    hero: summerBranchHero,
    sub: summerBranchSub,
    mascot: summerMascot,
    floater: summerFloater,
    ground: summerGround,
    ribbon: summerRibbon,
  },
  autumn: {
    hero: autumnBranchHero,
    sub: autumnBranchSub,
    mascot: autumnMascot,
    floater: autumnFloater,
    ground: autumnGround,
    ribbon: autumnRibbon,
  },
  winter: {
    hero: winterBranchHero,
    sub: winterBranchSub,
    mascot: winterMascot,
    floater: winterFloater,
    ground: winterGround,
    ribbon: winterRibbon,
  },
}
