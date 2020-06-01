//对登录样式进行处理的类
class Csscheck{
    constructor(){
        this.log_num = document.querySelector('.log_num');
        this.log_pas = document.querySelector('.log_pas');
        this.reg = /^1[0-9]{10}/    
    }
    check(){
        const tip1 = '请输入电话号码';
        const tip2 = '请输入密码';
        const tip3 = '请输入十一位电话号';
        //决定这个函数的返回值
        let judge = true;  
        //判断是否输入
        if(this.log_num.value == ''){
            //设置输入为空的提示信息
            this.errEmpty(this.log_num,tip1);
            judge = false;
        }
        else if(this.log_num.value.length !=11){  
            this.innerShow('请输入十一位手机号码',0)
            judge = false;
        }
        if(this.log_pas.value == ''){
            this.errEmpty(this.log_pas,tip2);
            judge = false;
        }
       return judge;
         
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
    //参数：显示字符串 是错误/正确信息
    innerShow(str,judge){
        let tips = document.querySelector('.tips_Inner');
        let scroll_box = document.querySelector('.scroll_box')
        tips.innerHTML = str;
        if(judge == 0){
            tips.style.color = 'rgb(212, 19, 19)';
        }
        else{
            tips.style.color = 'rgb(255, 248, 220)'
        }
        scroll_box.style.transition = '1s';
        scroll_box.style.transform = "translateY(-8vh)"
        setTimeout(() => {
            scroll_box.style.transform = "translateY(0vh)"
        }, 1500);
    }
}
//处理登录的类
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
    setLocalstorage(data){
        let storage = window.localStorage;
        storage[`emp_privilege`] = data.emp_privilege;
    }

}
//处理session请求的类
class SessionJudge{
    constructor(){
        this.url = "http://gaoxingkun.top:8888/account/login/session"
        this._this = this;
    }
    get(){
        ajax(this.url,'GET','','json', this.callback);
    }
    setLocalstorage(data){
        let storage = window.localStorage;
        storage['emp_privilege'] = data.emp_privilege;
        storage['emp_name'] = data.emp_name;
    }
    callback(data){
        console.log('undefined');
     
    }
   
}

window.onload = ()=>{
    const csscheck = new Csscheck();
    const loginer = new Login();
    //将loginer csscheck方法重写
    loginer.csscheck = ()=>{
        let judge = csscheck.check();
        return judge;
    }
    //设置callback函数内容
    loginer.callback = (data)=>{
        console.log(data.errno);
        
        //返回值是字符串，首先类型转换  为0代表登录成功
        //登录成功
        if(data.errno == '0'){
            console.log(121);
            
            csscheck.innerShow(`${data.emp_name} ${data.errmsg}`,1)
            //登录成功将信息保存在localstorage中
            loginer.setLocalstorage(data);
            window.open('../control/control.html','_self')
        }
        //登录失败
        else if(data.errno == '4001'){
            csscheck.innerShow(`该账号不存在`,0)
        }
        else if(data.errno == '4106'){
            csscheck.innerShow(`密码错误`,0)
        }
    }
    const sessionJudge = new SessionJudge();
    //将sessionJudge callback重写
    sessionJudge.callback = (data)=>{
        console.log(data);
           
        if(data.errno == '0'){
            console.log(111);
            
            sessionJudge.setLocalstorage(data);
            const date = new Date();
            const storeTime = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`
            console.log(date.getFullYear(),date.getHours(),date.getMinutes());
            window.open('../control/control.html','_self')
        }
    }
    //发送session请求
    sessionJudge.get();
}