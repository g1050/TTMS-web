console.log(2342234);
class Cin_Search{
    constructor(){
        this.input = document.querySelector('.cin_ser');
        this.url_input = 'http://gaoxingkun.top:8888/studio/retrieve';
        this.url_but = 'http://gaoxingkun.top:8888/studio/retrieve/name'
        this.input_but = document.querySelector('.cin_ser_but');
        this.input_but.addEventListener('click',()=>{

        })
    }
    sea_name(req_method){
        console.log(this.input.value);
        
        //如果是true则进行模糊查询
        if(req_method){
            ajax(this.url_input,'GET',`emp_hint=${this.input.value}`,'json',this.callback)
        }
        //否则进行精确查询
        else{
            ajax(this.url_but,'GET',`emp_hint=${this.input.value}`,'json',this.callback)
        }
        
    }
    //输入时查询的回调函数
    input_callback = (data)=>{
        console.log(data);
        
        if(data.errno == '4101'){
            window.open('../index/index.html','_self')
        }
        let show_data = document.querySelector('.cin_show_ser')
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
    //点击时查询的回调函数
    click_callback = (data)=>{
        console.log(data);
        
        let ser_res = document.querySelector('.cin_res');
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
    callback(data){
        console.log(data);
        
    }
}
//电影院查询框输入时的模糊查询
let cin_search = ()=>{
    let input= document.querySelector('.cin_ser');
    //查询框不为空显示搜索结果
    if(!input.value == ''){
        let stf_search = new Cin_Search();
        stf_search.callback =   (data)=>{
            stf_search.input_callback(data);
        }
        stf_search.sea_name(true);
    }
    //如果为空不显示搜索结果
    else{
        let show_data = document.querySelector('.cin_show_ser')
        show_data.style.display = 'none';
    }
}




//--------------------影厅添加模块------------------//
class Cin_Add{
    constructor(){
       
        
        this.url = 'http://gaoxingkun.top:8888/studio/create'
        this.inf_show = `
        <div class="cin_inf_show">
            <span class="inf_id">影厅ID</span>
            <span class="inf_name">影厅名称</span>
            <span class="inf_type">影厅类型</span>
            <span class="inf_rows">行数</span>
            <span class="inf_cols">列数</span>
            <span class="inf_seat">可用座位</span>
            <span class="cin_add iconfont">&#xe604;</span>
        </div>
        `
        this.add_html = `
        <div class="add_div">
            <input class='add_name' maxlength='10' placeholder='影厅名称'>
            <input class='add_rows' maxlength='3' placeholder='影厅行数'>
            <input class='add_cols'  maxlength='3' placeholder='影厅列数'>
            <button class="cin_add_yes">添加</button>    <button class="cin_add_no">取消</button>
        </div>
        ` 
        this.cin_ser_res = document.querySelector('.cin_ser_res');
        //获得添加按钮
        this.but_add = document.querySelector('.cin_add');
        this.page = document.querySelector('.cin_page');
    }
   
    //按钮事件函数
    cin_add_event(){
        this.but_add.addEventListener('click',()=>{
            //页码清除
            this.page.innerHTML = '';
            this.cin_ser_res.innerHTML = this.inf_show;
            this.cin_ser_res.innerHTML += this.add_html
             //获得添加的两个按钮
            let add_yes = document.querySelector('.cin_add_yes');
            let add_no = document.querySelector('.cin_add_no');
            console.log(add_yes);
            let a = document.querySelector('.add_cols');
            console.log(a);
            //返回按钮设置
            add_no.addEventListener('click',()=>{
                //按下取消则返回
                let cin_req = new Cin_Req();
                cin_req.request(1);
                let cin_add = new Cin_Add();
                cin_add.cin_add_event();
            })
            add_yes.addEventListener('click',()=>{
                //按下则发送请求
                let judge = this.add_input_judge();
                if(judge){
                    let post_data = this.post_data();
                    this.add_post(post_data);
                }
            })
            //按钮样式控制
            add_yes.addEventListener('mousedown',()=>{
                console.log(1212121212);
                
                add_yes.style.color = 'rgb(207, 207, 207)';
                add_yes.style.border = '1px solid rgb(207, 207, 207) '
                add_yes.style.background = 'rgb(136, 136, 136)'
            })
            add_yes.addEventListener('mouseup',()=>{
                add_yes.style.color = 'rgb(10, 10, 10)';
                add_yes.style.border = '1px solid rgb(207, 207, 207) '
                add_yes.style.background = 'rgb(239, 239, 239)'
            })
            add_no.addEventListener('mousedown',()=>{
                add_no.style.color = 'rgb(207, 207, 207)';
                add_no.style.border = '1px solid rgb(207, 207, 207) '
                add_no.style.background = 'rgb(136, 136, 136)'
            })
            add_no.addEventListener('mouseup',()=>{
                add_no.style.color = 'rgb(10, 10, 10)';
                add_no.style.border = '1px solid rgb(207, 207, 207) '
                add_no.style.background = 'rgb(239, 239, 239)'
            })
        })
       
    }

    //判断输入是否合法
    add_input_judge(){
        let add_name = document.querySelector('.add_name');
        let add_rows = document.querySelector('.add_rows');
        let add_cols = document.querySelector('.add_cols');
        let judge = true;
        if(add_name.value == ''){
            add_name.setAttribute('placeholder','请输入影厅名称')
            judge = false;
        }
        if(add_rows.value == ''){
            add_rows.setAttribute('placeholder','请输入影厅行数');
            judge = false;
        }
        if(add_cols.value == ''){
            add_cols.setAttribute('placeholder','请输入影厅列数');
            judge = false;
        }
        return judge;
    }
    //获得输入的数据
    post_data(){
        let add_name = document.querySelector('.add_name');
        let add_rows = document.querySelector('.add_rows');
        let add_cols = document.querySelector('.add_cols');
        let data = {
            "stu_name":`${add_name.value}`,
            "stu_rows":parseInt(add_rows.value),
            "stu_cols":parseInt(add_cols.value)
        }
        return JSON.stringify(data);
    }
     //发送请求
     add_post(post_data){
        ajax(this.url,'post',post_data,'json',this.callback);
    }
    callback(data){
        console.log(data);
        let cin_req = new Cin_Req();
        cin_req.request(1);
        let cin_add = new Cin_Add();
        cin_add.cin_add_event();
        let cin_del = new Cin_Del();
        cin_del.but_del_event();
    }
}

//-------------------影厅删除模块------------------//
class Cin_Del{
    constructor(){
        this.url = 'http://gaoxingkun.top:8888/studio/delete';
        this.del_id = '';
        this.att = document.querySelector('.att');
        this.del_now = 'false';
        this.stf = '';
        
    }
    request(){
        let param = `stu_id=${this.del_id}`
        ajax(this.url,'GET',param,'json', this.callback); 
    }
    //每个删除按钮绑定对应事件
    but_del_event(){
        console.log(101);
        
        //获得删除按钮的父级
        let ser_res = document.querySelector('.cin_ser_res');
        console.log(ser_res);
        
        let mod_but = document.getElementsByClassName('cin_mod');
        console.log(mod_but);
        
        //获得删除按钮dom数组
        let del_but = document.getElementsByClassName('cin_del');
        console.log(del_but.length);
        
        
        //绑定事件
        for(let i =0;i < del_but.length;i++){
            console.log(102);
            
            del_but[i].addEventListener('click',()=>{
                console.log(2);
                
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
            this.del_id = this.stf.parentNode.getElementsByClassName('inf_id')[0].innerHTML;
          
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
        let cin_req = new Cin_Req();
        cin_req.request(1);
    }
}

//--------------------影厅修改模块---------------//
class Cin_Mod{
    constructor(){
        this.url ='http://gaoxingkun.top:8888/studio/update' 
         //获得修改按钮的父级
         this.ser_res = document.querySelector('.cin_ser_res');
         //获得修改按键按钮dom数组
         this.mod_but = this.ser_res.getElementsByClassName('cin_mod');
         //获得修改输入的div dom数组
         this.mod_div = this.ser_res.getElementsByClassName('cin_mod_input');
         //获得输入dom数组中的完成按钮数组
         this.mod_div_acc = this.ser_res.getElementsByClassName('cin_mod_acc');
         //获得输入dom数组中的退出按钮数组
         this.mod_div_noacc = this.ser_res.getElementsByClassName('cin_mod_noacc');
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
}

//--------------------影厅数据查询模块-----------//
class Cin_Req{
    constructor(){
        this.url = 'http://gaoxingkun.top:8888/studio/retrieve/'
        this.type = ['IMAX厅','4K厅','杜比全景声厅','LUXE巨幕厅','儿童厅'];
        //this.page = document.querySelector('.page')
        this.inf_show = `
        <div class="cin_inf_show">
            <span class="inf_id">影厅ID</span>
            <span class="inf_name">影厅名称</span>
            <span class="inf_type">影厅类型</span>
            <span class="inf_rows">行数</span>
            <span class="inf_cols">列数</span>
            <span class="inf_seat">可用座位</span>
            <span class="cin_add iconfont">&#xe604;</span>
        </div>
        `
        this.cin_ser_res = document.querySelector('.cin_ser_res');
    }
    //发送请求
    request(num){
        this.cin_ser_res.innerHTML = this.inf_show; 
        let url = this.url + num;
        console.log(num);
        ajax(url,'GET','','json', this.callback); 
        
    }
    //回调函数将返回的信息展示
    callback(data){
        console.log(data);
        
        let cin_ser_res = document.querySelector('.cin_ser_res');
        let type = ['IMAX厅','4K厅','杜比全景声厅','LUXE巨幕厅','儿童厅'];
        //生成对应的影厅信息
        for(let i=0;i<data.data.length;i++){
            let div = document.createElement('div');
            console.log(data.data[i].stu_type);
            
            div.innerHTML = `
            <span class="inf_id">${data.data[i].stu_id}</span>
            <span class="inf_name">${data.data[i].stu_name}</span>
            <span class="inf_type">${type[data.data[i].stu_type]}</span>
            <span class="inf_rows">${data.data[i].stu_rows}</span>
            <span class="inf_cols">${data.data[i].stu_cols}</span>
            <span class="inf_seat">${data.data[i].stu_ava_seat}</span>
            <span class="iconfont  cin_mod">&#xe601;</span>
            <span class="iconfont  cin_del">&#xe600;</span>
            <div class='cin_mod_input'>
                <span class='cin_mod_id'>${data.data[i].stu_id}</span>
                <input class="cin_mod_name" value=${data.data[i].stu_name}>
                <span class="cin_mod_type">${type[data.data[i].stu_type]}</span>
                <input class='cin_mod_rows' value=${data.data[i].stu_rows}>
                <input class='cin_mod_cols' value=${data.data[i].stu_cols}>
                <span class='cin_mod_seat'>${data.data[i].stu_ava_seat}</span>
                <span class='cin_mod_acc iconfont'>&#xe73b;</span>
                <span class='cin_mod_noacc iconfont'>&#xe600;</span>
            </div>
                `
            cin_ser_res.appendChild(div);
        }
        //生成对应的页码
        let page = document.querySelector('.cin_page');
       
        
        page.innerHTML = '';
        for(let i = 0;i < data.sum / 10 ;i++){
          
            let span = document.createElement('span');
            span.setAttribute('class',`cin_page${i}`)
            span.innerHTML = i+1;
            page.appendChild(span);
        }
        for(let i = 0;i < data.sum / 10;i++){
            let span = document.getElementsByClassName(`cin_page${i}`)[0];
            let _i = i+1;
            span.addEventListener('click',()=>{
                //点击发送对应请求
                cin_page_req(_i);
            })
        }
        let cin_add = new Cin_Add();
        cin_add.cin_add_event();
        let cin_del = new Cin_Del();
        cin_del.but_del_event();
        let cin_mod = new Cin_Mod();
        cin_mod.but_mod_event();
    }
   
}
let cin_page_req = (i)=>{
    let cin_req = new Cin_Req();
    cin_req.request(i);
    let cin_add = new Cin_Add();
    cin_add.cin_add_event();
    let cin_del = new Cin_Del();
    cin_del.but_del_event();
    let cin_mod = new Cin_Mod();
    cin_mod.but_mod_event();
}
