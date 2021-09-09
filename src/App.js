import React, { useState, useEffect } from 'react';
import Task from './components/task'
import CreateTask from './components/createTask'
import Login from './components/login'

const LOCAL_STORAGE_USER_KEY = 'taskUser.app'

function App() {

  const [state, setState] = useState({"userInfo": {"username": '', "password": ''},"tasks": []})

  // GET USER TASKS WHEN FIRST ENTERING THE PAGE
  useEffect(() => {
    let userInfo = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USER_KEY))
    if (userInfo) {
      getDBTasks(userInfo).then(tasks => {
        if (tasks !== false) setState({"userInfo": userInfo,"tasks": tasks}
      )})
    }
  }, [])

  // UPDATE DB EVERYTIME TASKS ARRAY CHANGES
  useEffect(() => {
    if (state.userInfo.username !== '') {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(state.userInfo))
      setDBTasks()
    }
  }, [state])

  // DB TASKS = LOCAL TASKS
  function setDBTasks() {
    var data = JSON.stringify({
      "tasks": state.tasks
    })
    fetch(`/login/${state.userInfo.username}/${state.userInfo.password}/settasks`, {method: 'post', headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    }, body: data})  
  }

  // RETURN DB TASKS
  async function getDBTasks(userInfo) {
    var promise = false
    if (userInfo.username !== '') {
      promise = await fetch(`/login/${userInfo.username}/${userInfo.password}/gettasks`).then(res => {
        if (res.status === 200) {return res.json()} else {return false}
      })
    }
    return promise
  }
  ///////////////////

  // DELETE A TASK
  function handleDeleteTask(taskName) {
    if (state.tasks.find(task => task.name === taskName)) {
      const newTasks = state.tasks.filter(task => task.name !== taskName)
      setState({"userInfo": state.userInfo, "tasks": newTasks})
    }
  }

  // CREATE NEW TASK
  function handleCreateTask(taskName) {
    if (taskName !== '' && !state.tasks.find(task => task.name === taskName)) {
      let newTasks = state.tasks
      newTasks.push({
        "name": taskName,
        "completed": false,
      })
      setState({userInfo: state.userInfo, tasks: newTasks})
    } else {
      alert('Invalid task name!')
    }
  }

  // DELETE ALL TASKS
  function handleDeleteAllTasks() {
    if (state.tasks.length > 0) {  
      if (window.confirm('Are you sure you want to delete all tasks?')) setState({"userInfo": state.userInfo , "tasks": []})
    } else {
      alert('There are no tasks to delete!')
    }
  }

  // TOGGLE TASKS STATE
  function handleCompleteIncompleteTask(taskName) {
    if (state.tasks.find(task => task.name === taskName)) {
      let newTasks = state.tasks
      newTasks.map(task => {
        if (task.name === taskName) task.completed = !task.completed
      })
      setState({"userInfo": state.userInfo, "tasks": newTasks})
    }
  }
  // LOGIN
  function handleLogin(username, password) {
    if (username !== '' && password !== '') {
      let warn = document.getElementById('warnings-label')
      warn.innerText = ''
      fetch(`/login/${username}/${password}/gettasks`).then(res => {  
        if (res.status === 404) {     
          warn.innerText = 'Wrong Credentials!'
          setTimeout(() => warn.innerText = '', 4000)
          return null
        } else {
          return res.json()
        }
      }).then(tasks => {  
        if (tasks != null) {
          warn.innerText = `Welcome ${username}!`
          setTimeout(() => setState({"userInfo": {"username": username, "password": password}, "tasks": tasks}), 2000)
        }
      })
    }
  }

  // SIGN UP
  function handleSignUp(newUsername, newPassword) {
    var warn = document.getElementById('warnings-label')
    fetch(`/signup/${newUsername}/${newPassword}`, {method: 'post'}).then(res => {
      if (res.status === 200) {
        warn.innerText = 'The registration was successful! You may login now.'
        setTimeout(() => warn.innerText = '', 4000)
      } else if (res.status === 409) {
        warn.innerText = 'That username already exists!'
        setTimeout(() => warn.innerText = '', 4000)
      } else if (res.status === 400) {
        warn.innerText = 'Username and Password need at least 5 characters and can´t contain any of these special characters :\n []?«|!"ºª~^´`*+-:;,<>=)(/&%$#{}€£§ '
        setTimeout(() => warn.innerText = '', 12000)
      }
    })
  }   

  // LOGOUT
  function handleLogout() {
    setState({
      "userInfo": {"username": '', "password": ''},
      "tasks": []
    })
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify({"username": '', "password": ''}))
  }

  function handleDeleteAccount() {
    console.log('HANDLE DELETE')
    if (window.confirm('Are you sure you want to delete your account?')) {
      fetch(`/delete/${state.userInfo.username}/${state.userInfo.password}`).then(res => {
        console.log(res)
        if (res.status === 200) handleLogout()
      })
    }
  }

  // HANDLERS TO BE CALLED BY CHILDREN
  const handlers = {
    deleteTask: handleDeleteTask,
    createTask: handleCreateTask,
    deleteAllTasks: handleDeleteAllTasks,
    completeIncompleteTask: handleCompleteIncompleteTask,
    login: handleLogin,
    signup: handleSignUp,
    logOut: handleLogout,
    deleteAccount: handleDeleteAccount
  }

  return (
    <>
    {!state.userInfo.username.length ? <Login handlers={handlers} /> : <> 
            <CreateTask username={state.userInfo.username} handlers={handlers} />
            <div className="incomplete-tasks"><h1 className="title">INCOMPLETE TASKS</h1>{state.userInfo.username ? state.tasks.map(task => {if (!task.completed) return <Task key={task.name} task={task} handlers={handlers}/>}) : null}</div>
            <div className="complete-tasks"><h1 className="title">COMPLETE TASKS</h1>{state.userInfo.username ? state.tasks.map(task => {if (task.completed) return <Task key={task.name} task={task} handlers={handlers}/>}) : null}</div>
            </>
    }
    </>
  )
}

export default App;
