import { Dispatch, ReactNode, createContext, useMemo, useReducer } from "react";
import { ActivityActions, ActivityState, activityReducer, initialState } from "../reducers/activity-reducer";
import { Activity } from "../types";
import { categories } from "../data/categories";

type ActivityProviderProps = {
    children: ReactNode
}

type ActivityContextProps = {
    state: ActivityState
    dispatch: Dispatch<ActivityActions>,
    activities: Activity[]
    caloriesConsumed: number
    caloriesBurned: number
    totalCalories: number
    categoryName: (category: Activity['category']) => string[]
    isEmptyActivities: boolean
}

export const ActivityContext = createContext<ActivityContextProps>(null!)

export const ActivityProvider = ({children} : ActivityProviderProps) => {

    const [state, dispatch] = useReducer(activityReducer, initialState)

    const { activities } = state
  
    //Contadores
    const caloriesConsumed = useMemo(() => activities.reduce((total, activity) => activity.category === 1 ? total + activity.calories : total, 0), [activities])

    const caloriesBurned = useMemo(() => activities.reduce((total, activity) => activity.category === 2 ? total + activity.calories : total, 0), [activities])

    const totalCalories = useMemo(() => caloriesConsumed - caloriesBurned, [activities])

    //Categorias
    const categoryName = useMemo(() =>
        (category : Activity['category']) => categories.map(cat => cat.id === category ? cat.name : ''), [activities])
    
    const isEmptyActivities = useMemo(() => activities.length === 0, [activities])
        

    return (    
        <ActivityContext.Provider value={{
            state,
            dispatch,
            activities,
            caloriesConsumed,
            caloriesBurned,
            totalCalories,
            categoryName,
            isEmptyActivities
        }}>
            {children}

        </ActivityContext.Provider>
    )
}