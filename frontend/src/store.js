import { legacy_createStore as createStore } from 'redux'

// Get previously saved cases from LocalStorage
const savedCases = JSON.parse(localStorage.getItem('landpredictCases')) || []

const initialState = {
  sidebarShow: true,
  theme: 'light',

  // LANDPREDICT Cases
  cases: savedCases,
}

const changeState = (state = initialState, action) => {
  switch (action.type) {
    case 'set':
      return {
        ...state,
        ...action,
      }

    // Add a new case
    case 'ADD_CASE': {
      const updatedCases = [...state.cases, action.payload]

      localStorage.setItem('landpredictCases', JSON.stringify(updatedCases))

      return {
        ...state,
        cases: updatedCases,
      }
    }

    // Delete a case
    case 'DELETE_CASE': {
      const updatedCases = state.cases.filter((_, index) => index !== action.payload)

      localStorage.setItem('landpredictCases', JSON.stringify(updatedCases))

      return {
        ...state,
        cases: updatedCases,
      }
    }

    // Update an existing case
    case 'UPDATE_CASE': {
      const { index, updatedCase } = action.payload

      const updatedCases = state.cases.map((item, itemIndex) =>
        itemIndex === index ? updatedCase : item,
      )

      // Update LocalStorage
      localStorage.setItem('landpredictCases', JSON.stringify(updatedCases))

      return {
        ...state,
        cases: updatedCases,
      }
    }

    default:
      return state
  }
}

const store = createStore(changeState)

export default store
