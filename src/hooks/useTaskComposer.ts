import { useState, type FormEvent } from 'react'
import { useCalendarStore } from '../store/calendarStore'
import type { Plant, PlantId } from '../store/plantData'
import { taskComposerOptions, type TaskComposerValue } from '../components/calendar/calendarConfig'

type TaskComposerDate = {
  year: number
  monthIndex: number
  date: number
}

type UseTaskComposerOptions = {
  date: TaskComposerDate
  plants: Plant[]
  initialPlantId?: PlantId
}

export function useTaskComposer({ date, plants, initialPlantId }: UseTaskComposerOptions) {
  const addTask = useCalendarStore((state) => state.addTask)
  const [taskValue, setTaskValue] = useState<TaskComposerValue>('watering')
  const [customTaskTitle, setCustomTaskTitle] = useState('')
  const [selectedPlantId, setSelectedPlantId] = useState<PlantId | undefined>(initialPlantId ?? plants[0]?.id)

  const isManualTask = taskValue === 'manual'
  const trimmedCustomTaskTitle = customTaskTitle.trim()
  const canAddTask = !isManualTask || trimmedCustomTaskTitle.length > 0
  const selectedTaskOption = taskComposerOptions.find((option) => option.value === taskValue) ?? taskComposerOptions[0]
  const effectivePlantId = plants.some((plant) => plant.id === selectedPlantId)
    ? selectedPlantId
    : plants[0]?.id
  const selectedPlant = plants.find((plant) => plant.id === effectivePlantId) ?? plants[0]

  function handleAddTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!canAddTask || !selectedPlant) {
      return
    }

    addTask({
      year: date.year,
      monthIndex: date.monthIndex,
      date: date.date,
      type: selectedTaskOption.calendarType,
      title: isManualTask ? trimmedCustomTaskTitle : selectedTaskOption.title,
      plantId: selectedPlant.id,
      plantKind: selectedPlant.kind,
      time: selectedTaskOption.time,
    })

    if (isManualTask) {
      setCustomTaskTitle('')
    }
  }

  return {
    taskValue,
    setTaskValue,
    customTaskTitle,
    setCustomTaskTitle,
    effectivePlantId,
    setSelectedPlantId,
    isManualTask,
    canAddTask,
    handleAddTask,
  }
}
