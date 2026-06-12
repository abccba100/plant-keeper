export type PlantKind = 'monstera' | 'peace' | 'sansevieria' | 'peperomia'

export type Plant = {
  name: string
  tone: string
  kind: PlantKind
}

export const plantKinds: PlantKind[] = ['monstera', 'peace', 'sansevieria', 'peperomia']

export const plantToneByKind: Record<PlantKind, string> = {
  monstera: '#71986f',
  peace: '#789671',
  sansevieria: '#2f9aa3',
  peperomia: '#f0a21d',
}

export const plants: Plant[] = [
  { name: '몬스테라', tone: plantToneByKind.monstera, kind: 'monstera' },
  { name: '스파티필름', tone: plantToneByKind.peace, kind: 'peace' },
  { name: '산세베리아', tone: plantToneByKind.sansevieria, kind: 'sansevieria' },
  { name: '필레아 페페', tone: plantToneByKind.peperomia, kind: 'peperomia' },
]

export function getPlantTone(kind: PlantKind) {
  return plantToneByKind[kind]
}
