export type PlantKind = 'monstera' | 'peace' | 'sansevieria' | 'peperomia'
export type PlantId = string

export type Plant = {
  id: PlantId
  name: string
  tone: string
  kind: PlantKind
}

export type PlantInput = Omit<Plant, 'id'> & Partial<Pick<Plant, 'id'>>

export const plantKinds: PlantKind[] = ['monstera', 'peace', 'sansevieria', 'peperomia']

export const plantToneByKind: Record<PlantKind, string> = {
  monstera: '#71986f',
  peace: '#789671',
  sansevieria: '#2f9aa3',
  peperomia: '#f0a21d',
}

export const plants: Plant[] = [
  { id: 'plant-default-monstera', name: '몬스테라', tone: plantToneByKind.monstera, kind: 'monstera' },
  { id: 'plant-default-peace', name: '스파티필름', tone: plantToneByKind.peace, kind: 'peace' },
  { id: 'plant-default-sansevieria', name: '산세베리아', tone: plantToneByKind.sansevieria, kind: 'sansevieria' },
  { id: 'plant-default-peperomia', name: '필레아 페페', tone: plantToneByKind.peperomia, kind: 'peperomia' },
]

export function getPlantTone(kind: PlantKind) {
  return plantToneByKind[kind]
}

export function createPlantId(kind: PlantKind) {
  const randomId = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  return `plant-${kind}-${randomId}`
}
