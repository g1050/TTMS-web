console.log(2342234);
class Cin_Search{
    constructor(){
        this.input = document.querySelector('.cin_ser');
        this.url_input = 'http://gaoxingkun.top:8888/studio/retrieve';
        this.url_but = 'http://gaoxingkun.top:8888/studio/retrieve/name'
        this.input_but = document.querySelector('.cin_ser_but');
        //点击按钮发送请求
        this.input_but.addEventListener('click',()=>{
            let show_data = document.querySelector('.cin_show_ser')
            show_data.style.display = 'none';
            this.callback = (data)=>{
                cin_click_callback(data);
            }
            this.sea_name(false);

            
        })
    }
    sea_name(req_method){
        //如果是true则进行模糊查询
        if(req_method){
         
            
            ajax(this.url_input,'GET',`stu_hint=${this.input.value}`,'json',this.callback)
        }
        //否则进行精确查询
        else{
           
            console.log(344343434);
            
            ajax(this.url_but,'GET',`stu_name=${this.input.value}`,'json',this.callback)
        }
        
    }
    callback(data){
       console.log(data);
    }
}
let cin_click_callback = (data)=>{
    this.inf_show = `
    <div class="cin_inf_show">
        <span class="inf_id">影厅ID</span>
        <span class="inf_name">影厅名称</span>
        <span class="inf_type">影厅类型</span>
        <span class="inf_rows">行列数</span>
        <span class="inf_seat">可用座位</span>
        <span class="cin_add iconfont">&#xe604;</span>
    </div>
    `
    console.log(data);
    let cin_ser = document.querySelector('.cin_ser');
    cin_ser.value = '';
    let cin_ser_res = document.querySelector('.cin_ser_res');
    cin_ser_res.innerHTML = this.inf_show;
    let  type = ['IMAX厅','4K厅','杜比全景声厅','LUXE巨幕厅','儿童厅'];
    let size = [5,7,10];
    //生成对应员工信息
    for(let i=0;i<data.data.length;i++){
        let div = document.createElement('div');
        console.log(data.data[i].stu_type);
        div.innerHTML = `
            <span class="inf_id">${data.data[i].stu_id}</span>
            <span class="inf_name">${data.data[i].stu_name}</span>
            <span class="inf_type">${type[data.data[i].stu_type-1]}</span>
            <span class="inf_rows">${size[data.data[i].stu_size-1]}</span>
            <span class="inf_seat">${data.data[i].stu_ava_seat}</span>
            <span class="iconfont  cin_mod">&#xe601;</span>
            <span class="iconfont  cin_del">&#xe600;</span>
            <span class="iconfont  cin_sea_seat">&#xe603;</span>
            <div class='cin_mod_input'>
                <span class='cin_mod_id'>${data.data[i].stu_id}</span>
                <input class="cin_mod_name" value=${data.data[i].stu_name}>
                <span class="cin_mod_type">${type[data.data[i].stu_type-1]}</span>
                <select class='cin_mod_size' value=${data.data[i].stu_rows}>
                    <option>5</option>
                    <option>7</option>
                    <option>10</option>
                </select>
                <span class='cin_mod_seat'>${data.data[i].stu_ava_seat}</span>
                <span class='cin_mod_acc iconfont'>&#xe73b;</span>
                <span class='cin_mod_noacc iconfont'>&#xe600;</span>
            </div>
                `
        cin_ser_res.appendChild(div);
    }
        let cin_add = new Cin_Add();
        cin_add.cin_add_event();
        let cin_del = new Cin_Del();
        cin_del.but_del_event();
        let cin_mod = new Cin_Mod();
        cin_mod.but_mod_event();
        cin_mod.but_mod_req();
        let seat_set = new Seat_Set();
        seat_set.add_seat_event();
    let page = document.querySelector('.cin_page');
    page.innerHTML = '';
    let span = document.createElement('span');
    span.setAttribute('class','search_return_but');
    span.innerHTML = '返回'
    span.addEventListener('click',()=>{
        // let cin_req = new Cin_Req();
        // cin_req.request(1);
        // //为按钮添加事件，以可以添加员工
        // let cin_add = new Cin_Add();
        // cin_add.cin_add_event();
        // let cin_del = new Cin_Del();
        // cin_del.but_del_event();
        // let cin_mod = new Cin_Mod();
        // cin_mod.but_mod_event();
        // cin_mod.but_mod_req();
        Init(1);
    })
    page.appendChild(span);

}

let cin_input_callback = (data)=>{
    console.log(data);
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
    let ser_res = document.querySelector('.cin_ser_res'); 
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
           div.addEventListener('click',()=>{
               console.log(333);
               //设置点击事件 点击则在下面显示
               //首先将展示的数据隐藏
               show_data.style.display = 'none';
               //将下方展示数据清除
               ser_res.innerHTML = inf_show;
                //点击后进行精确查询  更改回调函数
                let cin_search = new Cin_Search();
                cin_search.callback =   (data)=>{
                    cin_click_callback(data);
                }
                cin_search.sea_name(false);
                
           })
            show_data.appendChild(div);
        }
    }
}

let cin_search = ()=>{
    let input = document.querySelector('.cin_ser');
    //字符串为空不进行查询
    if(!input.value == ''){
        let cin_search = new Cin_Search();
        cin_search.callback =   (data)=>{
            cin_input_callback(data);
        }
        cin_search.sea_name(true);
    }
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
            <span class="inf_rows">行列数</span>
            <span class="inf_seat">可用座位</span>
            <span class="cin_add iconfont">&#xe604;</span>
        </div>
        `
        this.add_html = `
        <div class="add_div">
            <input class='add_name' maxlength='10' placeholder='影厅名称'>
            <select class='add_type'>
                <option>IMAX厅</option>
                <option>4K厅</option>
                <option>杜比全景声厅</option>
                <option>LUXE巨幕厅</option>
                <option>儿童厅</option>
            </select>
            <select class='add_size'>
                <option>5</option>
                <option>7</option>
                <option>10</option>
            </select>
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
                let seat_set = new Seat_Set();
                seat_set.add_seat_event();
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
      
        let judge = true;
        if(add_name.value == ''){
            add_name.setAttribute('placeholder','请输入影厅名称')
            judge = false;
        }
        return judge;
    }
    //获得输入的数据
    post_data(){
        let  type = ['IMAX厅','4K厅','杜比全景声厅','LUXE巨幕厅','儿童厅'];
        let size = [5,7,10];
        let add_name = document.querySelector('.add_name');
        let add_type = document.querySelector('.add_type');
        let add_size = document.querySelector('.add_size');
        let index = 0;
        for(let i = 0;i < type.length ;i++){
            if(add_type.value == type[i]){
                index = i+1;
                break;
            }
        }
        let index_size = 0;
        if(add_size.value == 5) 
            index_size = 0;
        else if(add_size.value == 7)
            index_size = 1;
        else if(add_size.value == 10)
            index_size = 2;
        let data = {
            "stu_name":`${add_name.value}`,
            "stu_type":index,
            "stu_size":index_size+1
        }
        return JSON.stringify(data);
    }
     //发送请求
     add_post(post_data){
        ajax(this.url,'post',post_data,'json',this.callback);
    }
    callback(data){
        console.log(data);
        // let cin_req = new Cin_Req();
        // cin_req.request(1);
        // let cin_add = new Cin_Add();
        // cin_add.cin_add_event();
        // let cin_del = new Cin_Del();
        // cin_del.but_del_event();
        Init(1)
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
       
        
        //获得删除按钮的父级
        let ser_res = document.querySelector('.cin_ser_res');
      
        
        let mod_but = document.getElementsByClassName('cin_mod');
       
        
        //获得删除按钮dom数组
        let del_but = document.getElementsByClassName('cin_del');
      
        
        
        //绑定事件
        for(let i =0;i < del_but.length;i++){
            
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
        let seat_set = new Seat_Set();
        seat_set.add_seat_event();
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
                console.log(345353);
                
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
        let  type = ['IMAX厅','4K厅','杜比全景声厅','LUXE巨幕厅','儿童厅'];
        let _type = dom.getElementsByClassName('cin_mod_type')[0].value;
        let index = 0;
        let index_size = 0;
        for(let i = 0;i < type.length;i++){
            if(_type == type[i]){
                index = i+1;
                break;
            }
        }
        let size = [5,7,10];
        let _size = dom.getElementsByClassName('cin_mod_size')[0].value;
        _size = parseInt(_size);
        console.log(_size);
        
        for(let i = 0; i < size.length ; i++){
            if(_size == size[i]){
                index_size = i+1;
                break;
            }
        }
        let data = {
            "stu_name":`${dom.getElementsByClassName('cin_mod_name')[0].value}`,
            "stu_id":parseInt(dom.getElementsByClassName('cin_mod_id')[0].innerHTML),
            "stu_type":index+1,
            "stu_size":index_size
        }
        return JSON.stringify(data);
    }
    callback(data){
        let cin_req = new Cin_Req();
        cin_req.request(1);
        let cin_add = new Cin_Add();
        cin_add.cin_add_event();
        let cin_del = new Cin_Del();
        cin_del.but_del_event();
        let cin_mod = new Cin_Mod();
        cin_mod.but_mod_event();
        cin_mod.but_mod_req();
        let seat_set = new Seat_Set();
        seat_set.add_seat_event();
    
        
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
            <span class="inf_rows">行列数</span>
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
     
        
        let cin_ser_res = document.querySelector('.cin_ser_res');
        let type = ['IMAX厅','4K厅','杜比全景声厅','LUXE巨幕厅','儿童厅'];
        let size = [5,7,10];
        //生成对应的影厅信息
        for(let i=0;i<data.data.length;i++){
            let div = document.createElement('div');
           
            
            div.innerHTML = `
            <span class="inf_id">${data.data[i].stu_id}</span>
            <span class="inf_name">${data.data[i].stu_name}</span>
            <span class="inf_type">${type[data.data[i].stu_type-1]}</span>
            <span class="inf_rows">${size[data.data[i].stu_size-1]}</span>
            <span class="inf_seat">${data.data[i].stu_ava_seat}</span>
            <span class="iconfont  cin_mod">&#xe601;</span>
            <span class="iconfont  cin_del">&#xe600;</span>
            <span class="iconfont  cin_sea_seat">&#xe603;</span>
            <div class='cin_mod_input'>
                <span class='cin_mod_id'>${data.data[i].stu_id}</span>
                <input class="cin_mod_name" value=${data.data[i].stu_name}>
                <span class="cin_mod_type">${type[data.data[i].stu_type-1]}</span>
                <select class='cin_mod_size' value=${data.data[i].stu_rows}>
                    <option>5</option>
                    <option>7</option>
                    <option>10</option>
                </select>
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
        cin_mod.but_mod_req();
        let seat_set = new Seat_Set();
        seat_set.add_seat_event();
      
    }
   
}
let cin_page_req = (i)=>{
    // let cin_req = new Cin_Req();
    // cin_req.request(i);
    // let cin_add = new Cin_Add();
    // cin_add.cin_add_event();
    // let cin_del = new Cin_Del();
    // cin_del.but_del_event();
    // let cin_mod = new Cin_Mod();
    // cin_mod.but_mod_event();
    // cin_mod.but_mod_req();
    Init(i)

}
let Init = (i)=>{
    let cin_req = new Cin_Req();
    cin_req.request(i);
    let cin_add = new Cin_Add();
    cin_add.cin_add_event();
    let cin_del = new Cin_Del();
    cin_del.but_del_event();
    let cin_mod = new Cin_Mod();
    cin_mod.but_mod_event();
    cin_mod.but_mod_req();
    let seat_set = new Seat_Set();
    seat_set.add_seat_event();
}

//------------------------座位控制模块---------//
class Seat_Set{
    constructor(){
        this.total_seat_url = 'http://gaoxingkun.top:8888/seat/retrieve';
        this.update_seat_url = 'http://gaoxingkun.top:8888/seat/update'
        this.cin_ser_res = document.querySelector('.cin_ser_res');
        this.page = document.querySelector('.page');
    }
    request_total(id){
        
        ajax(this.total_seat_url,'GET',`stu_id=${id}`,'json',this.callback);
    }
    request_update(post_data){
        ajax(this.update_seat_url,'post',post_data,'json',this.callback);
    }
    callback(data){
        console.log(data);
        
    }
 
    post_data(dom){
        let st_id = dom.getAttribute('value');
        st_id = parseInt(st_id);
        let st_status = dom.getAttribute('status');
        st_status = parseInt(st_status);
        if(st_status){
            st_status = 0;
        }
        else{
            st_status = 1;
        }
        let data = {
            "st_id":st_id,
            "st_status":st_status
        }
        return JSON.stringify(data);
    }
    //为按钮绑定点击事件 

    add_seat_event(){
        let seat_but = document.getElementsByClassName('cin_sea_seat');
        
       
        
        for(let i = 0;i < seat_but.length;i++){
            //点击则显示对应座位数
            seat_but[i].addEventListener('click',()=>{
                let num = seat_but[i].parentNode.getElementsByClassName('inf_rows')[0];
                let id  = seat_but[i].parentNode.querySelector('.inf_id').innerHTML;
                
                //点击图标发送作为请求
             
                console.log(id.innerHTML);
                //获得行数
                num = parseInt(num.innerHTML);

                this.cin_ser_res.innerHTML = '';
                this.page.innerHTML = '';
                // let div = document.createElement('div');
                // div.setAttribute('class','sea_seat');
                //获取座位数
                let create_5 = document.querySelector('.create_seat_5');
                let create_7 = document.querySelector('.create_seat_7');
                let create_10 = document.querySelector('.create_seat_10');
                if(num == '5'){
                    let create_5 = document.querySelector('.create_seat_5');
                    create_5.style.display = 'block';
                    create_7.style.display = 'none';
                    create_10.style.display = 'none';
                     this.callback = (data)=>{
                        this.five_seat_set(data);
                    }
                }
                else if(num == '7'){
                    create_5.style.display = 'none';
                    create_7.style.display = 'block';
                    create_10.style.display = 'none';
                    this.callback = (data)=>{
                        this.seven_seat_set(data);
                    }
                }
                else if(num == '10'){
                    create_5.style.display = 'none';
                    create_7.style.display = 'none';
                    create_10.style.display = 'block';
                    this.callback = (data)=>{
                        this.ten_seat_set(data);
                    }
                }
                this.request_total(id);
             
                
             
            })
        }

    }
    five_seat_set(data){
        console.log(data);
        let page = document.querySelector('.cin_page');
        page.innerHTML = '';
        let span = document.createElement('span');
        span.setAttribute('class','seat_return');
        span.innerHTML = '返回'
        span.addEventListener('click',()=>{
            let cin_req = new Cin_Req();
            cin_req.request(1);
            let create_seat_5 = document.querySelector('.create_seat_5');
            create_seat_5.style.display = 'none';
            let create_seat_7 = document.querySelector('.create_seat_7');
            create_seat_7.style.display = 'none';
            let create_seat_10 = document.querySelector('.create_seat_10');
            create_seat_10.style.display = 'none';
        })
        page.appendChild(span);
        let seat_div = document.querySelector('.create_seat_5');
        let seats = seat_div.getElementsByTagName('span');
        console.log(seats.length);
        
        for(let i = 0;i < 25;i++){
            seats[i].setAttribute('value',`${data.data[i].st_id}`)
            seats[i].setAttribute('status',`${data.data[i].st_status}`)
            if(data.data[i].st_status == '1'){
                seats[i].style.color = 'red';
                console.log(232);
                
            }
            else if(data.data[i].st_status == '0'){
                seats[i].style.color = 'springgreen'
            }
          //为每个座位绑定事件
        seats[i].addEventListener('click',()=>{
            //点击则发送请求
            let post_data = this.post_data(seats[i]);
            this.callback = (data)=>{
                console.log(data);
                // for(let i = 0;i < 49;i++){
                    // console.log(data.data[i]);
                    if(data.errno == '0'){
                        let status = seats[i].getAttribute('status');
                        console.log(status);
                        
                        if(status == '0'){
                            status = '1';
                        }
                        else{
                            status = '0';
                        }
                        seats[i].setAttribute('status',status);
                        if(status == '1'){
                            seats[i].style.color = 'red';
                            console.log(232);
                            
                        }
                        else if(status == '0'){
                            seats[i].style.color = 'springgreen'
                        }
                    }
            }
            this.request_update(post_data);
        })
             
    } 
    }
    seven_seat_set(data){
        console.log(data);
        let page = document.querySelector('.cin_page');
        page.innerHTML = '';
        let span = document.createElement('span');
        span.setAttribute('class','seat_return');
        span.innerHTML = '返回'
        span.addEventListener('click',()=>{
            let cin_req = new Cin_Req();
            cin_req.request(1);
            let create_seat_5 = document.querySelector('.create_seat_5');
            create_seat_5.style.display = 'none';
            let create_seat_7 = document.querySelector('.create_seat_7');
            create_seat_7.style.display = 'none';
            let create_seat_10 = document.querySelector('.create_seat_10');
            create_seat_10.style.display = 'none';
        })
        page.appendChild(span);
        let seat_div = document.querySelector('.create_seat_7');
        let seats = seat_div.getElementsByTagName('span');
        console.log(seats.length);
        
        for(let i = 0;i < 49;i++){
                seats[i].setAttribute('value',`${data.data[i].st_id}`)
                seats[i].setAttribute('status',`${data.data[i].st_status}`)
                if(data.data[i].st_status == '1'){
                    seats[i].style.color = 'red';
                    console.log(232);
                    
                }
                else if(data.data[i].st_status == '0'){
                    seats[i].style.color = 'springgreen'
                }
              //为每个座位绑定事件
            seats[i].addEventListener('click',()=>{
                //点击则发送请求
                let post_data = this.post_data(seats[i]);
                this.callback = (data)=>{
                    console.log(data);
                    // for(let i = 0;i < 49;i++){
                        // console.log(data.data[i]);
                        if(data.errno == '0'){
                            let status = seats[i].getAttribute('status');
                            console.log(status);
                            
                            if(status == '0'){
                                status = '1';
                            }
                            else{
                                status = '0';
                            }
                            seats[i].setAttribute('status',status);
                            if(status == '1'){
                                seats[i].style.color = 'red';
                                console.log(232);
                                
                            }
                            else if(status == '0'){
                                seats[i].style.color = 'springgreen'
                            }
                        }
                }
                this.request_update(post_data);
            })
                 
        } 
    }
    ten_seat_set(data){
        console.log(data);
        let page = document.querySelector('.cin_page');
        page.innerHTML = '';
        let span = document.createElement('span');
        span.setAttribute('class','seat_return');
        span.innerHTML = '返回'
        span.addEventListener('click',()=>{
            let cin_req = new Cin_Req();
            cin_req.request(1);
            let create_seat_5 = document.querySelector('.create_seat_5');
            create_seat_5.style.display = 'none';
            let create_seat_7 = document.querySelector('.create_seat_7');
            create_seat_7.style.display = 'none';
            let create_seat_10 = document.querySelector('.create_seat_10');
            create_seat_10.style.display = 'none';
        })
        page.appendChild(span);
        let seat_div = document.querySelector('.create_seat_10');
        let seats = seat_div.getElementsByTagName('span');
        console.log(seats.length);
        
        for(let i = 0;i < 100;i++){
            seats[i].setAttribute('value',`${data.data[i].st_id}`)
            seats[i].setAttribute('status',`${data.data[i].st_status}`)
            if(data.data[i].st_status == '1'){
                seats[i].style.color = 'red';
                console.log(232);
                
            }
            else if(data.data[i].st_status == '0'){
                seats[i].style.color = 'springgreen'
            }
          //为每个座位绑定事件
        seats[i].addEventListener('click',()=>{
            //点击则发送请求
            let post_data = this.post_data(seats[i]);
            this.callback = (data)=>{
                console.log(data);
                // for(let i = 0;i < 49;i++){
                    // console.log(data.data[i]);
                    if(data.errno == '0'){
                        let status = seats[i].getAttribute('status');
                        console.log(status);
                        
                        if(status == '0'){
                            status = '1';
                        }
                        else{
                            status = '0';
                        }
                        seats[i].setAttribute('status',status);
                        if(status == '1'){
                            seats[i].style.color = 'red';
                            console.log(232);
                            
                        }
                        else if(status == '0'){
                            seats[i].style.color = 'springgreen'
                        }
                    }
            }
            this.request_update(post_data);
        })
             
    } 
    }
}
