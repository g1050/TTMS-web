//-------------------------基本信息获取模块----------//
class Get_Local{
    constructor(){
        this.pre = ['系统管理员','运营经理','售票员','会计','运营经理'];
        this.user_name = document.querySelector('.user_name');
        this.user_pre = document.querySelector('.user_pre');
        this.storage = window.localStorage;
    }
    set_Inner(){
        this.user_name.innerHTML = this.storage[`emp_name`];
        let index_num = parseInt(this.storage[`emp_privilege`]);
        this.user_pre.innerHTML = this.pre[index_num];
    }
}
//------------------------员工信息查询模块-------------//
class Stf_Search{
    constructor(){
        this.input = document.querySelector('.stf_ser');
        this.url_input = 'http://gaoxingkun.top:8888/user/retrieve/name';
        this.url_but = 'http://gaoxingkun.top:8888/user/retrieve'
        this.input_but = document.querySelector('.stf_ser_but');
        //点击按钮发送请求
        this.input_but.addEventListener('click',()=>{
            this.callback = (data)=>{
                click_callback(data);
            }
            this.sea_name(false);

            
        })
    }
    sea_name(req_method){
        //如果是true则进行模糊查询
        if(req_method){
            ajax(this.url_input,'GET',`emp_hint=${this.input.value}`,'json',this.callback)
        }
        //否则进行精确查询
        else{
            ajax(this.url_but,'GET',`emp_hint=${this.input.value}`,'json',this.callback)
        }
        
    }
    callback(data){
       
      
    }
}
let click_callback = (data)=>{
    console.log(data);
    
    let ser_res = document.querySelector('.ser_res');
    //将获得结果打印出来
    for(let i=0;i<data.sum;i++){
        let div = document.createElement('div');
        div.innerHTML = `
            <div class="result${i}">
                <span>${data.data[i]}</span>
                <span>手机号码</span>
                <span>密码</span>
                <span>生日</span>
                <span>职位</span>
               
            </div>
        `
    }
   
}

let input_callback = (data)=>{
    console.log(data);
    
    if(data.errno == '4101'){
        window.open('../index/index.html','_self')
    }
    let show_data = document.querySelector('.show_ser')
    if(data.errno == '4002'){
        show_data.style.display = 'none';
    }
    else{
        show_data.style.display = 'block';
        show_data.innerHTML = '';
        for(let i=0;i<data.sum;i++){
            let div = document.createElement('div');
            div.innerHTML = `${data.data[i]}`;
           
            show_data.appendChild(div);
        }
    }
}

let search = ()=>{
    let input = document.querySelector('.stf_ser');
    //字符串为空不进行查询
    if(!input.value == ''){
        let stf_search = new Stf_Search();
        stf_search.callback =   (data)=>{
            input_callback(data);
        }
        stf_search.sea_name();
    }
    else{
        let show_data = document.querySelector('.show_ser')
        show_data.style.display = 'none';
    }
   
}

//---------------------删除模块-------------------//
class Stf_Del{
    constructor(){
        this.url = "http://gaoxingkun.top:8888/user/delete";
        this.del_pho = '';
        this.att = document.querySelector('.att');
        this.del_now = 'false';
        this.stf = '';
    }
    request(){
        let param =  `emp_phonenumber=${this.del_pho}` 
        ajax(this.url,'GET',param,'json', this.callback); 
    }
    //每个删除按钮绑定对应事件
    but_del_event(){
        //获得删除按钮的父级
        let ser_res = document.querySelector('.ser_res');
        //获得删除按钮dom数组
        let del_but = ser_res.getElementsByClassName('inf_del');
        //绑定事件
        for(let i =0;i < del_but.length;i++){
            del_but[i].addEventListener('click',()=>{
                let att_inf = document.querySelector('.att_inf')
                console.log('right');
                this.att.style.display = 'block';
                this.att.style.transition = '.5s';
               
                this.att.style.width = '20vw';
                this.att.style.height = '20vh';
                //将点击的员工保存下来，方便访问
                this.stf = del_but[i];
                att_inf.innerHTML = `删除 ${this.stf.parentNode.getElementsByClassName('inf_name')[0].innerHTML}`
            })
        }
        this.but_is_del();
        //如果确认选择删除，才会发送请求
      
    }
    //为删除判断的按钮绑定事件
    but_is_del(){
        let att_yes = document.querySelector('.att_yes');
        let att_no = document.querySelector('.att_no');
      
        let att = document.querySelector('.att');
        att_yes.addEventListener('click',()=>{
            att.style.display = 'none';
            this.del_now = 'true;'
            //如果确认删除
            //获得手机号码
            this.del_pho = this.stf.parentNode.getElementsByClassName('inf_pho')[0].innerHTML;
          
            this.request();
            console.log(this.del_pho);
                     
        })
        att_no.addEventListener('click',()=>{
            att.style.display = 'none';
            this.del_now = 'false';
        })
    }
    callback(data){
        console.log(data);
        
    }
}

//---------------修改模块-----------------------//
class Stf_Mod{
    constructor(){
        this.url = "http://gaoxingkun.top:8888//user/updata";
        //获得修改按钮的父级
        this.ser_res = document.querySelector('.ser_res');
        //获得修改按键按钮dom数组
        this.mod_but = this.ser_res.getElementsByClassName('inf_mod');
        //获得修改输入的div dom数组
        this.mod_div = this.ser_res.getElementsByClassName('mod_input');
        //获得输入dom数组中的完成按钮数组
        this.mod_div_acc = this.ser_res.getElementsByClassName('mod_acc');
        //获得输入dom数组中的退出按钮数组
        this.mod_div_noacc = this.ser_res.getElementsByClassName('mod_noacc');
        this.url = 'http://gaoxingkun.top:8888//user/updata'
    }
    //修改按键的按钮
    but_mod_event(){
        for(let i = 0;i < this.mod_div.length;i++){
            this.mod_but[i].addEventListener('click',()=>{
                this.mod_div[i].style.zIndex = '1';
            })
        }
     
    }
    //发送修改请求的按钮
    but_mod_req(){
          //获得添加的盒子
        for(let i = 0;i < this.mod_but.length;i++){
            this.mod_div_noacc[i].addEventListener('click',()=>{
                //点击按钮则显示修改界面
                this.mod_div[i].style.zIndex = '-1';
            })
        }
        for(let i = 0;i < this.mod_but.length;i++){
            this.mod_div_acc[i].addEventListener('click',()=>{
               //发送修改请求               
                let a= this.mod_div[i].getElementsByClassName('mod_pre')[0];
               
                let post_data = this.post_data(this.mod_div[i]);
                console.log(post_data);
                
                //发送对应请求
                ajax(this.url,'post',post_data,'json',this.callback);
                this.mod_div[i].style.zIndex = '-1';
            })
        }

    }
    post_data(dom){
        console.log(5555555);
        
        let pre = ['系统管理员','运营经理','售票员','会计','运营经理'];
        let pre_str = dom.getElementsByClassName('mod_pre')[0].value;
        let index = 0;
        for(let i = 0;i < pre.length;i++){
            if(pre_str == pre[i]){
                index = i;
               break;
            }
        }
        console.log(index);
        console.log(234);
        
        let data = {
            "emp_password":`${dom.getElementsByClassName('mod_pas')[0].value}`,
            "emp_name":`${dom.getElementsByClassName('mod_name')[0].value}`,
            "emp_born_year":`${dom.getElementsByClassName('mod_born')[0].value}`,
            "emp_phonenumber":`${dom.getElementsByClassName('mod_pho')[0].innerHTML}`,
            "emp_privilege":index
        }
        return JSON.stringify(data)
    }
    callback(data){
        console.log(data);
        
    }
}

//-----------------添加模块-------------------//
class Stf_Add{
    constructor(){
        this.ser_res = document.querySelector('.ser_res');
        this.inf_show = `
        <div class="inf_show">
            <span class="inf_name">姓名</span>
            <span class="inf_pho">手机号码</span>
            <span class="inf_pas">密码</span>
            <span class="inf_born">生日</span>
            <span class="inf_pre">职位</span>
            <span class="stf_add iconfont">&#xe604;</span>
        </div>
    `
   // this.ser_res.innerHTML = this.inf_show;
    //获得添加按钮
    this.but_add = document.querySelector('.stf_add');
    //获得换页按钮
    this.page = document.querySelector('.page');
    //获得
    this.ser_res = document.querySelector('.ser_res');
    console.log(111);
    
    console.log(this.but_add);
    
    
    }
    stf_add_event(){
        console.log(888);
        let but_add = document.querySelector('.stf_add');
        console.log(but_add);
        let a = document.querySelector('.inf_name');
        a.addEventListener('click',()=>{
            console.log(9999);
            
        })
        but_add.addEventListener('click',()=>{
            console.log(23);
            this.page.innerHTML = ''
            this.ser_res.innerHTML = ''
            this.ser_res.innerHTML = this.inf_show;
    })
       

    }
}


//分页模块开始------------------------------------//
class Stf_Req{
    constructor(){
        this.url = "http://gaoxingkun.top:8888/user/retrieve/";
        this.pre = ['系统管理员','运营经理','售票员','会计','运营经理'];
        this.rer_res = document.querySelector('.rer_res');
        this.page = document.querySelector('.page');
        //当前显示的是第几页
        this.index = 1;
    }
    //发送请求
    request(num){
        let url = this.url + num
        console.log(num);
        ajax(url,'GET','','json', this.callback); 
    }
    //回调函数将返回的数据加载到html上
    callback(data){
        console.log(data);
        // if(data.errno = '4101'){
        //     window.open('../index/index.html','_self')
        // }
    
//-----------------------生成一页的数据--------------//
        let ser_res = document.querySelector('.ser_res');
        let page = document.querySelector('.page');
        console.log(ser_res);
        let inf_show = `
            <div class="inf_show">
                <span class="inf_name">姓名</span>
                <span class="inf_pho">手机号码</span>
                <span class="inf_pas">密码</span>
                <span class="inf_born">生日</span>
                <span class="inf_pre">职位</span>
                <span class="stf_add iconfont">&#xe604;</span>
            </div>
        `

        
        ser_res.innerHTML = inf_show;
        //inf_show_div.appendChild(span);
        const pre = ['系统管理员','运营经理','售票员','会计','运营经理'];
        //生成对应员工信息
        for(let i=0;i<data.data.length;i++){
            let div = document.createElement('div');
            div.innerHTML = `
            <span class="inf_name">${data.data[i].emp_name}</span>
            <span class="inf_pho">${data.data[i].emp_phonenumber}</span>
            <span class="inf_pas">${data.data[i].emp_password}</span>
            <span class="inf_born">${data.data[i].emp_born_year}</span>
            <span class="inf_pre">${pre[data.data[i].emp_privilege]}</span>
            <span class="iconfont inf_mod">&#xe601;</span>
            <span class="iconfont inf_del">&#xe600;</span>
            <div class='mod_input'>
                <input class='mod_name' value=${data.data[i].emp_name}>
                <span class='mod_pho'>${data.data[i].emp_phonenumber}</span>
                <input class='mod_pas' value=${data.data[i].emp_password}>
                <input class='mod_born' value=${data.data[i].emp_born_year}>
                <select class='mod_pre'>
                    <option>系统管理员</option> 
                    <option>运营经理</option> 
                    <option>售票员</option> 
                    <option>会计</option>
                    <option>财务经理</option>  
                </select>
                <span class='mod_acc iconfont'>&#xe73b;</span>
                <span class='mod_noacc iconfont'>&#xe600;</span>
                </div>
            `
            ser_res.appendChild(div);
        }
//--------------------绑定删除事件----------------//        
        let stf_del = new Stf_Del();
        stf_del.but_del_event();
        stf_del.callback = (data)=>{
            //删除后重新显示当前元素
        }
        //创建页的选择按钮
        page.innerHTML = '';
        for(let i = 0;i < data.sum / 10;i++){
            let span = document.createElement('span');
            span.setAttribute('class',`page${i}`)
            span.innerHTML = i+1;
            page.appendChild(span);
        }
        for(let i = 0;i < data.sum / 10;i++){
            let span = document.getElementsByClassName(`page${i}`)[0];
            let _i = i+1;
            span.addEventListener('click',()=>{
                //点击发送对应请求
                page_req(_i);
            })
        }
      //  page.style.tranform = 'translateX(-50%)'
//------------------绑定修改界面--------------------//
        let stf_mod = new Stf_Mod();
        stf_mod.but_mod_event();
        stf_mod.but_mod_req();
 //----------------绑定增加事件----------------------//
        let stf_add = new Stf_Add();
        stf_add.stf_add_event();
    }


}

let page_req = (_i)=>{
    let stf_req = new Stf_Req();
    stf_req.request(_i);
}




