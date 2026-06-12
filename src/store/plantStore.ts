import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { plants as defaultPlants, type Plant } from './plantData'

type PlantStore = {
  plants: Plant[]
  addPlant: (plant: Plant) => void
  resetPlants: () => void
}

function normalizeName(name: string) {
  return name.trim().replace(/\s+/g, ' ')
}

function normalizePlant(plant: Plant): Plant {
  return {
    ...plant,
    name: normalizeName(plant.name),
  }
}

function addUniquePlant(plants: Plant[], plant: Plant) {
  const normalized = normalizePlant(plant)

  if (!normalized.name) {
    return plants
  }

  const alreadyExists = plants.some((candidate) => normalizeName(candidate.name).toLowerCase() === normalized.name.toLowerCase())
  if (alreadyExists) {
    return plants
  }

  return [...plants, normalized]
}

function mergePlants(plants: Plant[]) {
  return plants.reduce<Plant[]>((merged, plant) => addUniquePlant(merged, plant), [])
}

export const usePlantStore = create<PlantStore>()(
  persist(
    (set) => ({
      plants: defaultPlants,
      addPlant: (plant) =>
        set((state) => ({
          plants: addUniquePlant(state.plants, plant),
        })),
      resetPlants: () => set({ plants: defaultPlants }),
    }),
    {
      name: 'plant-keeper-plants',
      storage: createJSONStorage(() => window.localStorage),
      version: 2,
      migrate: (persisted) => persisted,
      merge: (persisted, current) => ({
        ...current,
        ...(persisted as Partial<PlantStore>),
        plants: mergePlants((persisted as Partial<PlantStore>)?.plants ?? current.plants),
      }),
    },
  ),
)
