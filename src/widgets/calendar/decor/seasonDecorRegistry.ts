import type { Season } from '../../../entities/calendar/model/calendar'
import autumnBranchHero from '../../../assets/calendar-decor/high-res/autumn-hero-flipped.png?url'
import autumnGround from '../../../assets/calendar-decor/elements/autumn/decor-09.png?url'
import autumnFloater from '../../../assets/calendar-decor/high-res/autumn-floater.png?url'
import autumnMascot from '../../../assets/calendar-decor/elements/autumn/decor-05.png?url'
import autumnRibbon from '../../../assets/calendar-decor/high-res/autumn-ribbon.png?url'
import autumnBranchSub from '../../../assets/calendar-decor/high-res/autumn-sub.png?url'
import springBranchHero from '../../../assets/calendar-decor/high-res/spring-hero.png?url'
import springBranchSub from '../../../assets/calendar-decor/high-res/spring-sub.png?url'
import springFloater from '../../../assets/calendar-decor/high-res/spring-floater.png?url'
import springGround from '../../../assets/calendar-decor/high-res/spring-ground.png?url'
import springMascot from '../../../assets/calendar-decor/high-res/spring-mascot.png?url'
import springRibbon from '../../../assets/calendar-decor/high-res/spring-ribbon.png?url'
import summerFloater from '../../../assets/calendar-decor/elements/summer/decor-06.png?url'
import summerMascot from '../../../assets/calendar-decor/elements/summer/decor-08.png?url'
import summerRibbon from '../../../assets/calendar-decor/elements/summer/branch-02.png?url'
import summerBranchHero from '../../../assets/calendar-decor/high-res/summer-hero.png?url'
import summerBranchSub from '../../../assets/calendar-decor/high-res/summer-sub.png?url'
import summerGround from '../../../assets/calendar-decor/high-res/summer-ground.png?url'
import winterBranchHero from '../../../assets/calendar-decor/high-res/winter-hero.png?url'
import winterBranchSub from '../../../assets/calendar-decor/high-res/winter-sub.png?url'
import winterFloater from '../../../assets/calendar-decor/high-res/winter-floater.png?url'
import winterGround from '../../../assets/calendar-decor/high-res/winter-ground.png?url'
import winterMascot from '../../../assets/calendar-decor/high-res/winter-mascot.png?url'
import winterRibbon from '../../../assets/calendar-decor/high-res/winter-ribbon.png?url'

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
