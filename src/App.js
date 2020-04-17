import React, { useState } from 'react'
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

const ADD_LESSON = gql`
  mutation MyMutation2($text: String!, ) {
  insert_lessons(objects: {name: $text}) {
    returning {
      name
      id
      done
    }
  }
}
`

const DELETE_LESSON = gql`
  mutation deleteTodo($id: Int!) {
  delete_lessons(where: {id: {_eq: $id}}) {
    returning {
      done
      id
      name
    }
  }
}
`
 
function App() {
  const [ text, setText ] = useState("")
  const { data, loading, error } = useQuery(GET_LESSONS)
  const [ toggleLesson ] = useMutation(TOGGLE_LESSON)
  const [ addLesson ] = useMutation(ADD_LESSON, {
    onCompleted: () => setText("")
  })

  const [ deleteLesson ] = useMutation(DELETE_LESSON)
  
  async function handleToggleLesson(lesson) {
    const data = await toggleLesson({variables: {id:lesson.id, done:!lesson.done}})
    console.log(data)
  }

  async function handleAddLesson(e) {
    e.preventDefault()
    if(text.length > 0) {
      const data = await addLesson({
        variables: {text:text},
        refetchQueries: [{ query: GET_LESSONS }]
      })
      console.log(data)
    }
  }

  async function handleDeleteLesson({ id }) {
    const isConfirmed = window.confirm("did you really learn this lesson?")
    if(isConfirmed) {
      const data = await deleteLesson({ 
        variables: { id },
        update: cache => {
          const prevData = cache.readQuery({ query: GET_LESSONS})
          const newLessons = prevData.lessons.filter(lesson => lesson.id !== id)
          cache.writeQuery({ query:GET_LESSONS, data: {lessons: newLessons}})
          }
        })
      console.log("deleted the lesson", data)
    }
  }
  
  if(loading) return <div>Loading...</div>
  if(error) return <div>Error fetching todos</div>
  return (
    <div>
      <h1>Lessons Learned</h1>
      <form onSubmit={handleAddLesson}>
        <input type="text"
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
        <input type="submit"/>
      </form>  
      <div>
        {data.lessons.map(item => (
          <LessonItem done={item.done} onDoubleClick={() => handleToggleLesson(item)} key={item.id}>
            <span>{item.name}</span>
            <button onClick={() => handleDeleteLesson(item)}>&times;</button>
          </LessonItem>
        ))}
      </div>
    </div>
    )
}

export default App;
