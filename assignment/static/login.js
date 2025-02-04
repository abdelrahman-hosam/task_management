document.getElementById('submit').addEventListener('click' , async ()=> {
    const username = document.getElementById('username').value,
          password = document.getElementById('password').value
    const data = {
        "username": username,
        "password":password
    }
    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data) 
    }
    const response = await fetch('http://localhost:8000/api/user/login' , options)
    if(response.status === 200){
        window.location.replace("http://localhost:8000/homepage");
        return
    }else{
        const res = await response.json()
        window.alert(res['message'])
        return
    }
})