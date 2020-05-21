const login = document.querySelector('.login');
const register = document.querySelector('.register');

login.addEventListener('click',()=>{
    const registerContent = document.querySelector('.registerContent');
    registerContent.style.display = "none";
    const loginContent = document.querySelector('.loginContent');
    loginContent.style.display = 'block';
})

register.addEventListener('click',()=>{
    const registerContent = document.querySelector('.registerContent');
    registerContent.style.display = "block";
    const loginContent = document.querySelector('.loginContent');
    loginContent.style.display = 'none';
})