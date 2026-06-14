import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createPlantId, plants as defaultPlants, type Plant, type PlantInput } from './plantData'

type PlantStore = {
  plants: Plant[]
  addPlant: (plant: PlantInput) => Plant | undefined
  resetPlants: () => void
}

type SavePlantResult = {
  nextPlants: Plant[]
  savedPlant?: Plant
}

function normalizeName(name: string) {
  return name.trim().replace(/\s+/g, ' ')
}

function normalizePlant(plant: PlantInput): Plant {
  return {
    ...plant,
    id: plant.id ?? createPlantId(plant.kind),
    name: normalizeName(plant.name),
  }
}

function findSamePlant(plants: Plant[], plant: Plant) {
  const normalizedPlantName = normalizeName(plant.name).toLowerCase()

  return plants.find((candidate) => {
    const normalizedCandidateName = normalizeName(candidate.name).toLowerCase()

    return candidate.id === plant.id || normalizedCandidateName === normalizedPlantName
  })
}

function savePlantIfUnique(plants: Plant[], plant: PlantInput): SavePlantResult {
  const normalized = normalizePlant(plant)

  if (!normalized.name) {
    return { nextPlants: plants }
  }

  const existingPlant = findSamePlant(plants, normalized)
  if (existingPlant) {
    return { nextPlants: plants, savedPlant: existingPlant }
  }

  return { nextPlants: [...plants, normalized], savedPlant: normalized }
}

function mergePlants(plants: PlantInput[]) {
  return plants.reduce<Plant[]>((merged, plant) => {
    const result = savePlantIfUnique(merged, plant)

    return result.nextPlants
  }, [])
}

export const usePlantStore = create<PlantStore>()(
  persist(
    (set) => ({
      plants: defaultPlants,
      addPlant: (plant) => {
        let savedPlant: Plant | undefined

        set((state) => {
          const result = savePlantIfUnique(state.plants, plant)
          savedPlant = result.savedPlant

          return {
            plants: result.nextPlants,
          }
        })

        return savedPlant
      },
      resetPlants: () => set({ plants: defaultPlants }),
    }),
    {
      name: 'plant-keeper-plants',
      storage: createJSONStorage(() => window.localStorage),
      version: 3,
      migrate: (persisted) => persisted,
      merge: (persisted, current) => ({
        ...current,
        ...(persisted as Partial<PlantStore>),
        plants: mergePlants((persisted as Partial<PlantStore>)?.plants ?? current.plants),
      }),
    },
  ),
)
