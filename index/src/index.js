class Csscheck{
    constructor(){
        this.log_num = document.querySelector('.log_num');
        this.log_pas = document.querySelector('.log_pas');
        this.reg = /^1[0-9]{10}/    
        this.log_num.addEventListener('keydown',()=>{
           if(this.log_num.value == 11){
                
           }
            
        })
    }
    check(str){
        const tip1 = '请输入电话号码';
        const tip2 = '请输入密码';
        //判断是否输入
        if(this.log_num.value == ''){
            //设置输入为空的提示信息
            this.errEmpty(this.log_num,tip1);
            return false;
        }
        if(this.log_pas.value == ''){
            this.errEmpty(this.log_pas,tip2);
            return false;
        }
        return this.reg.test(str)
    }
    errEmpty(dom,tip){
        let className = dom.className;
        dom.setAttribute('placeholder',"输入不能为空!")
        dom.setAttribute('class',`${dom.className} placeholder`)
        setTimeout(() => {
            dom.setAttribute('placeholder',`${tip}`)
            dom.setAttribute('class',`${className}`)
        }, 2000);
    }

}

class Login{
    constructor(){
        this.button = document.querySelector('.log_sub');
        this.log_num = document.querySelector('.log_num');
        this.log_pas = document.querySelector('.log_pas');
        //通过此布尔变量控制账号及密码的正确性
        this.permit = false;
        this.button.addEventListener('click',()=>{
            //定义一个变量，接受输入规范检查结果
            this.permit = this.csscheck()
            this.phone = this.log_num.value;
            this.pas = this.log_pas.value;
            //一个操作，判断账号密码输入是否合法
            if(this.permit){
                ajax('http://gaoxingkun.top:8888/account/login/verify','post',this.postData(),'json',this.callback)
            }
            else{
                //输出对应的结果
            }
            
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
    csscheck(){
        console.log("undefine");
        
    }
    callback(data){
        if(data.errno ==0){
            console.log(data);      
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
    const csscheck = new Csscheck();
    const loginer = new Login();
    loginer.csscheck = ()=>{
        csscheck.check();
    }
    const session = new SessionJudge();
}