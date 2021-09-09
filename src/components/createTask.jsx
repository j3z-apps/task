import React, { useRef } from 'react';

function CreateTask({username, handlers}) {

    const inputRef = useRef()
    const createButton = useRef()

    return (
        <>
            <div className="create-task-wrapper">
                <div className="logged-section">
                    <span>Username: {username}</span>
                    <div className="logged-btns-wrapper">
                        <button id="logout" onClick={handlers.logOut} className="logged-btn red-btn">Log Out</button>
                        <button id="delete-account" onClick={handlers.deleteAccount} className="logged-btn red-btn">Delete Account</button>
                    </div>
                </div>
                
                <input ref={inputRef} type="text" onKeyUp={e => {if (e.code === 'Enter' && inputRef.current.value !== '') {createButton.current.click()}}} placeholder="Type the task name here..."></input>
                <div className="buttons">
                    <button ref={createButton} onClick={() => {handlers.createTask(inputRef.current.value); inputRef.current.value = null}} className="create-task green-btn">Create Task</button>
                    <button className="red-btn" onClick={() => handlers.deleteAllTasks()} id="delete-all-tasks">Delete All Tasks</button>
                </div>
            </div>
        </>
    )
}

export default CreateTask
