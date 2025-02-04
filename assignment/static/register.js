document.getElementById('submit').addEventListener('click' , async ()=> {
    const username = document.getElementById('username').value,
          password = document.getElementById('password').value,
          confirmPassword = document.getElementById('confirmPassword').value
    const data = {
        "username": username,
        "password":password,
        "confirmPassword":confirmPassword
    }
    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data) 
    }
    const response = await fetch('http://localhost:8000/api/user/register' , options)
    if(response.status === 201){
        window.alert('user was created successfully')
        return
    }else{
        const res = await response.json()
        window.alert(res['message'])
        return
    }
})