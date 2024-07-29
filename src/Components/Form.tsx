import { useState, ChangeEvent, FormEvent, Dispatch, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { Activity } from "../types"
import categories from "../data/categories"
import { ActivityActions, ActivityState } from "../reducers/activity-reducer"

type FormProps = {
  dispatch: Dispatch<ActivityActions>
  state: ActivityState
}

const initialState: Activity = {
  id: uuidv4(),
  category: 1,
  name: "",
  calories: 0,
}

export default function Form({ dispatch, state }: FormProps) {
  const [activity, setActivity] = useState<Activity>(initialState)
  useEffect(() => {
    if (state.activeId) {
      const selectedActivity = state.activities.filter(
        stateActivity => stateActivity.id === state.activeId
      )[0]
      setActivity(selectedActivity)
    }
  }, [state.activeId])

  const handleChange = (
    e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>
  ) => {
    const { value, id } = e.target
    const isNumberField = ["category", "calories"].includes(id)

    setActivity({
      ...activity,
      [id]: isNumberField ? +value : value,
    })
  }

  const isValidActivity = () => {
    const { name, calories } = activity
    return name.trim() !== "" && calories > 0
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    dispatch({ type: "save-activity", payload: { newActivity: activity } })
    setActivity({ ...initialState, id: uuidv4() })
  }

  return (
    <>
      {" "}
      <form
        className=" space-y-5 bg-white shadow p-10 rounded-lg"
        onSubmit={handleSubmit}
      >
        <div className=" grid grid-cols-1 gap-3">
          {" "}
          <label htmlFor="category" className=" font-bold">
            Category
          </label>
          <select
            className=" border border-slate-300 p-2 rounded-lg w-full bg-white"
            id="category"
            value={activity.category}
            onChange={handleChange}
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className=" grid grid-cols-1 gap-3">
          {" "}
          <label htmlFor="name" className=" font-bold">
            Activity:
          </label>
          <input
            id="name"
            type="text"
            className="border border-slate-300 p-2 rounded-lg"
            placeholder="Exercise, orange juice, salad, etc."
            value={activity.name}
            onChange={handleChange}
          />
        </div>
        <div className=" grid grid-cols-1 gap-3">
          {" "}
          <label htmlFor="calories" className=" font-bold">
            Calories:
          </label>
          <input
            id="calories"
            type="number"
            className="border border-slate-300 p-2 rounded-lg"
            placeholder="Calorias, ej. 300 o 500"
            value={activity.calories}
            onChange={handleChange}
          />
        </div>
        <input
          type="submit"
          className=" disabled:opacity-10 rounded-2xl bg-gray-800 hover:bg-gray-900 w-full p-2 font-bold uppercase text-white cursor-pointer"
          value={activity.category === 1 ? `Save food` : `Save exercise`}
          disabled={!isValidActivity()}
        />
      </form>
    </>
  )
}
