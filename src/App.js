import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

const GET_LESSONS = gql`
  query getLessons {
  lessons {
    id
    name
    done
  }
}
`
function App() {
  const { data, loading, error } = useQuery(GET_LESSONS)
  console.log(data)
  
  if(loading) return <div>Loading...</div>
  if(error) return <div>Error fetching todos</div>
  return (
    <div>
      <h1>Lessons Learned</h1>
      {/* Lessons Form */}
      {data.lessons.map(item => (
        <p key={item.id}>
          <span>{item.name}</span>
          <button>&times;</button>
        </p>
    ))}</div>
    )
}

export default App;
