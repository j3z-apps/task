import React from 'react'
import './css/tasks.css'

function Task ({task, handlers}) {

    return (
        <>
            <div className="task-wrapper">
                <h1>{task.name.replace('~',' ')}</h1>
                <div className="buttons">
                    <button onClick={() => handlers.completeIncompleteTask(task.name)} className="green-btn">{task.completed ? 'Incomplete' : 'Complete'}</button>
                    <button className="red-btn" style={{display: task.completed ? 'block' : 'none'}} onClick={() => handlers.deleteTask(task.name)}>Delete Task</button>
                </div>
            </div>
        </>
    )
}

export default Task

