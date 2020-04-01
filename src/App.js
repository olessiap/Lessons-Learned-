import React from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import styled, {css} from 'styled-components'

const LessonItem = styled.p`
  width:300px;

  ${props => props.done && css`
    background-color:grey;
  `}
`

const GET_LESSONS = gql`
  query getLessons {
  lessons {
    id
    name
    done
  }
}
`

const TOGGLE_LESSON = gql`
  mutation MyMutation($id: Int!, $done: Boolean!) {
  update_lessons(where: {id: {_eq: $id}}, _set: {done: $done}) {
    returning {
      done
      id
      name
    }
  }
}
`
 
function App() {
  const { data, loading, error } = useQuery(GET_LESSONS)
  const [ toggleLesson ] = useMutation(TOGGLE_LESSON)
  
  async function handleToggleLesson(lesson) {
    const data = await toggleLesson({variables: {id:lesson.id, done:!lesson.done}})
    console.log(data)
  }

  if(loading) return <div>Loading...</div>
  if(error) return <div>Error fetching todos</div>
  return (
    <div>
      <h1>Lessons Learned</h1>
      <form>
        <input type="text"/>
        <input type="submit"/>
      </form>  
      <div>
        {data.lessons.map(item => (
          <LessonItem done={item.done} onDoubleClick={() => handleToggleLesson(item)} key={item.id}>
            <span>{item.name}</span>
            <button>&times;</button>
          </LessonItem>
        ))}
      </div>
    </div>
    )
}

export default App;
