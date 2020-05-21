class Register{
    constructor(){
        this.button = document.querySelector('.submit')
        this.number = document.querySelector('.reg_num');
        this.password = document.querySelector('.reg_pas');
        this.name = document.querySelector('.reg_name');
        this.year = document.querySelector('.reg_year')
        this.button.addEventListener('click',()=>{
            this.accData = this.number.value;
            this.pasData = this.password.value;
            this.nameData = this.name.value;
            this.yearData = this.year.value;
            ajax("http://gaoxingkun.top:8888/account/register/info",'post',this.postData(),'json',this.callback)
            
        })
    }
    postData(){
      
        let str1 = {
            "emp_phonenumber":`${this.accData}`,
            "emp_name":`${this.nameData}`,
            "emp_password":`${this.pasData}`,
            "emp_born_year":`${this.yearData}`
        }
        str1 = JSON.stringify(str1);
        console.log(str1);
        
            return str1;
    }
    callback(data){
        console.log(data);
    }
}

class Login{
    constructor(){
        this.button = document.querySelector('.log_sub');
        this.log_num = document.querySelector('.log_num');
        this.log_pas = document.querySelector('.log_pas');
        this.button.addEventListener('click',()=>{
            this.phone = this.log_num.value;
            this.pas = this.log_pas.value;
            ajax('http://gaoxingkun.top:8888/account/login/verify','post',this.postData(),'json',this.callback)
        })
    }
    postData(){
        let str = {
            "emp_phonenumber":`${this.phone}`,
            "emp_password":`${this.pas}`
        }
        str = JSON.stringify(str);
        return str;
    }
    callback(data){
        if(data.errno ==0){
            console.log(data);
            
            console.log(1);
            
        }
        
    }

}

class SessionJudge{
    constructor(){
        this.url = "http://gaoxingkun.top:8888/account/login/session"
        ajax(this.url,'GET','','json', this.callback);

    }
    callback(data){
        console.log(data);
        
    }
}


window.onload = ()=>{
    const register = new Register();
    const loginer = new Login();
    const session = new SessionJudge();
}