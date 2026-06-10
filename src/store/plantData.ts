export type PlantKind = 'monstera' | 'peace' | 'sansevieria' | 'peperomia'

export type Plant = {
  name: string
  tone: string
  kind: PlantKind
}

export const plants: Plant[] = [
  { name: '몬스테라', tone: '#71986f', kind: 'monstera' },
  { name: '스파티필름', tone: '#789671', kind: 'peace' },
  { name: '산세베리아', tone: '#2f9aa3', kind: 'sansevieria' },
  { name: '필레아 페페', tone: '#f0a21d', kind: 'peperomia' },
]
