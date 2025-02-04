document.getElementById('insert').addEventListener('click', async()=> {
    const title = document.getElementById('title').value,
          des = document.getElementById('des').value,
          dueDate = document.getElementById('due-date').value
    const data = {
        "title": title,
        "des": des,
        "due_date": dueDate
    }
    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) 
    }
    const response = await fetch('/api/task/create' , options)
    if(response.status === 201){
        location.reload()
    }
    else{
        const res = await response.json()
        window.alert(res['message'])
        return
    }
})

document.addEventListener('DOMContentLoaded' , async ()=> {
    const options = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const response = await fetch('/api/task/get' , options)
    if(response.status === 200){
        const main = document.getElementById('tasks')
        const res = await response.json()
        const tasks = res['tasks']
        for(const task of tasks){
            //card and card content
            const card = document.createElement('div'),
                  title = document.createElement('h2'),
                  description = document.createElement('p'),
                  due_date = document.createElement('p'),
                  isDone = document.createElement('p'),
                  update_btn = document.createElement('button'),
                  delete_btn = document.createElement('button'),
                  change_status = document.createElement('button'),
                  update_id = task['update_id'],
                  delete_id = task['delete_id']
            //information inside the card
            title.innerText = task['title']
            description.innerText = task['des']
            due_date.innerText = task['due_date']
            isDone.innerText = task['isDone']? 'done':'not done'
            update_btn.innerText = 'update'
            delete_btn.innerText = 'delete'
            change_status.innerText = 'change status'
            //set the attributes of the card that will help in other operations
            card.setAttribute('class' , 'card')
            card.setAttribute('data-delete-id' , delete_id)
            card.setAttribute('data-update-id' , update_id)
            //set the attributes for the buttons so they can be usable
            update_btn.setAttribute('id' , 'update')
            update_btn.addEventListener('click' , () => update(update_id , card , update_btn))
            delete_btn.setAttribute('id' , 'delete')
            delete_btn.addEventListener('click' , () => delete_task(delete_id))
            change_status.setAttribute('id' , 'status')
            change_status.addEventListener('click' , ()=> change_task_status(update_id))
            //insert the information inside the card then insert the card into the page
            card.append(title , description , due_date , isDone , update_btn , delete_btn , change_status)
            main.appendChild(card)
        }
    }
})

async function update(id , card , update_btn) {
    const title = document.createElement('input'),
          des = document.createElement('input'),
          dueDate = document.createElement('input'),
          confirm = document.createElement('button'),
          cancel = document.createElement('button')
    update_btn.remove()
    //placeholders for the buttons and attributes for the fields to make them accessable
    title.setAttribute('placeholder' , 'insert the new title')
    title.setAttribute('class' , 'title')
    des.setAttribute('placeholder' , 'insert the new description')
    des.setAttribute('class' , 'des')
    dueDate.setAttribute('type' , 'date')
    dueDate.setAttribute('class' , 'due-date')
    //button functionality
    confirm.addEventListener('click' , () => confirm_update(id))
    cancel.addEventListener('click' , () => cancel_update(id))
    //the value inside the buttons
    confirm.innerText = 'confirm'
    cancel.innerText = 'cancel'
    card.append(title , des , dueDate , confirm , cancel)
}

async function confirm_update(id){
    const newTitle = document.querySelector(`#tasks [data-update-id = "${id}"] .title`).value,
          newDes = document.querySelector(`#tasks [data-update-id = "${id}"] .des`).value,
          newDueDate = document.querySelector(`#tasks [data-update-id = "${id}"] .due-date`).value
    const data = {
        "newTitle":newTitle,
        "newDes": newDes,
        "newDueDate": newDueDate,
        "update_id": id
    }
    const options = {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    const response = await fetch('/api/task/update' , options)
    if(response.status === 200){
        cancel_update(id)
    }else{
        const res = await response.json()
        window.alert(res['message'])
    }
}

function cancel_update(id){
    const newTitle = document.querySelector(`#tasks [data-update-id = "${id}"] .title`),
          newDes = document.querySelector(`#tasks [data-update-id = "${id}"] .des`),
          newDueDate = document.querySelector(`#tasks [data-update-id = "${id}"] .due-date`)
    newTitle.remove()
    newDes.remove()
    newDueDate.remove()
    location.reload()
}

async function delete_task(id){
    const data = {
        "delete_id":id
    }
    const options = {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    const response = await fetch('/api/task/delete' , options)
    if(response.status === 200){
        location.reload()
    }else{
        const res = await response.json()
        window.alert(res['message'])
    }
}

async function change_task_status(id){
    const data = {
        "update_id": id
    }
    const options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    const response = await fetch('/api/task/finished' , options)
    if(response.status === 200){
        location.reload()
    }else{
        const res = await response.json()
        window.alert(res['message'])
    }
}