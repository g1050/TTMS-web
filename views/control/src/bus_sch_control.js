let Sch_Init = (num)=>{
    let sch_req = new Sch_Req();
    sch_req.callback = (data)=>{
        console.log(data);
        
        sch_req.create_page(data);
        sch_req.create_div(data.data);
    }
    sch_req.request(num);
    let sch_del = new Sch_Del();
    sch_del.add_del_event();
    let sch_mod = new Sch_Mod();
    sch_mod.add_mod_event();
    let sch_add = new Sch_Add();
    sch_add.add_event();
}
let inf_show = `
<div class="inf_show">
    <span class="inf_sch_id">ID</span>
    <span class="inf_sch_time">演出时间</span>
    <span class="inf_stu_name">影厅</span>
    <span class="inf_mov_name">电影</span>
    <span class="inf_sch_price">票价</span>
    <span class="inf_sch_add iconfont">&#xe604;</span>
</div>
`
class Sch_Req{
    constructor(){
        this.url = 'http://gaoxingkun.top:8888/schedule/retrieve/';
      
    }
    request(num){
        let url = this.url + num;
        ajax(url,'GET','','json',this.callback)
    }
    callback(data){
        console.log(data);
        
    }
    create_page(data){
        let per_page = document.querySelector('.per_page');
        per_page.innerHTML = '';
        for(let i = 0;i < data.sum/10;i++){
            let span = document.createElement('span');
            span.innerHTML = i+1;
         
            per_page.appendChild(span);
        }
        let pages = per_page.getElementsByTagName('span');
       
        
        for(let i = 0;i<pages.length;i++){
            pages[i].addEventListener('click',()=>{
                per_page.innerHTML = '';
                console.log(i);
                
               Sch_Init(i+1)
            })
        }
        

    }
    create_div(data){
        let container = document.querySelector('.container');
        container.innerHTML = `${inf_show}`;
        console.log(3);
        
        for(let i = 0;i < data.length;i++){
            console.log(32);
            
            let res_show = `
      
            <span class="res_sch_id">${data[i].sch_id}</span>
            <span class="res_sch_time">${data[i].sch_time}</span>
            <span class="res_stu_name">${data[i].stu_name}</span>
            <span class="res_mov_name">${data[i].mov_name}</span>
            <span class="res_sch_price">${data[i].sch_price}</span>
            <span class="res_sch_mod iconfont">&#xe601;</span>
            <span class="res_sch_del iconfont">&#xe600;</span>
            <div class="mod_div">
                <span class="mod_sch_id">${data[i].sch_id}</span>
                <input type="text" class="mod_sch_time" placeholder="演出时间" value='${data[i].sch_time}'>
                <input type="text" class="mod_stu_name" placeholder="影厅" value='${data[i].stu_name}'>
                <input type="text" class="mod_mov_name" placeholder="电影" value='${data[i].mov_name}'>
                <input type="text" class="mod_sch_price" placeholder="票价" value='${data[i].sch_price}'>
                <span class="mod_yes iconfont">&#xe73b;</span>
                <span class="mod_no iconfont">&#xe600;</span>
       
            `
            let div = document.createElement('div');
            div.innerHTML = res_show;
            div.setAttribute('class','res_show');
            container.appendChild(div);
        }        
        console.log(24234242342423);
        
        let sch_del = new Sch_Del();
        sch_del.add_del_event();
        let sch_mod = new Sch_Mod();
        sch_mod.add_mod_event();
        let sch_add = new Sch_Add();
        sch_add.add_event();
    }

}

class Sch_Del{

    constructor(){
        this.url = 'http://gaoxingkun.top:8888/schedule/delete'
    }
    request(id){
        ajax(this.url,'GET',`sch_id=${id}`,'json',this.callback)
    }
    add_del_event(){
     
        let yes_del = document.querySelector('.is_del_yes');
        let no_del = document.querySelector('.is_del_no');
      
        console.log(34243);
      
        let del_but = document.getElementsByClassName('res_sch_del');
       
        
        for(let i = 0;i < del_but.length ;i++){
            del_but[i].addEventListener('click',()=>{
               //唤醒删除界面
                let per_is_del_div = document.querySelector('.per_is_del_div');
                no_del.addEventListener('click',()=>{
                    per_is_del_div.style.display = 'none';
                })
                yes_del.addEventListener('click',()=>{
                    let id = del_but[i].parentNode.querySelector('.res_sch_id').innerHTML;
                    // 发起删除请求
                    this.request(id);
                    per_is_del_div.style.display = 'none';
                })
                per_is_del_div.style.display = 'block';
            })
        }
    }
    callback(data){
        Sch_Init();
        
    }
}
//修改
class Sch_Mod{
    constructor(){
        this.url = 'http://gaoxingkun.top:8888/schedule/update';
        
    }
    request(post_data){
        ajax(this.url,'post',post_data,'json',this.callback)
    }
    post_data(dom){
        let time = dom.querySelector('.mod_sch_time').value;
        let sch_id = dom.querySelector('.mod_sch_id').innerHTML;
        sch_id = parseInt(sch_id);
        let sch_mov_id = dom.querySelector('.mod_mov_name').value;
        sch_mov_id = parseInt(sch_mov_id);
        let sch_stu_id = dom.querySelector('.mod_stu_name').value;
        sch_stu_id = parseInt(sch_stu_id);
        let sch_price = dom.querySelector('.mod_sch_price').value;
        sch_price = parseFloat(sch_price);

        let data = {
            "sch_time":time,
            "sch_stu_id":sch_stu_id,
            "sch_mov_id":sch_mov_id,
            "sch_price":sch_price,
            "sch_id":sch_id
        }
        return JSON.stringify(data);
    }
    add_mod_event(){
      
        
        let mod_but = document.getElementsByClassName('res_sch_mod');
        console.log(mod_but.length);
        
        for(let i = 0;i < mod_but.length ;i++){
            mod_but[i].addEventListener('click',()=>{
                let mod_div = mod_but[i].parentNode.querySelector('.mod_div');
                mod_div.style.background = 'rgb(181,181,181)'
                // mod_but[i].parentNode.style.zIndex = '-1'
                mod_div.style.zIndex = '2';
                let is_mod = mod_div.querySelector('.mod_yes');
                is_mod.addEventListener('click',()=>{
                   //发送请求
                    let post_data = this.post_data(mod_div);
                    this.request(post_data);
                })
                let no_mod = mod_div.querySelector('.mod_no');
                no_mod.addEventListener('click',()=>{
                    mod_div.style.zIndex = '-1';
                    
                })
            })
              
        }
    }
    callback(data){
        console.log(data);
        
    }
}

class Sch_Add{
    constructor(){
        this.url = 'http://gaoxingkun.top:8888/schedule/create'
    }
    request(post_data){
        ajax(this.url,'post',post_data,'json',callback);
    }
    post_data(){
        let add_time = document.querySelector('.add_time').value;
        let add_stu = document.querySelector('.add_stu').value;
        add_stu = parseInt(add_stu);
        let add_mov = document.querySelector('.add_mov').value;
        add_mov = parseInt(add_mov);
        let add_price = document.querySelector('.add_price').value;
        add_price = parseInt(add_price);

        let data = {
            "sch_time":add_time,
            "sch_stu_id":add_stu,
            "sch_mov_id":add_mov,
            "sch_price":add_price,
           
        }
        return JSON.stringify(data);
    }
    add_event(){
        let add_but = document.querySelector('.inf_sch_add');
        add_but.addEventListener('click',()=>{
            console.log('none');
            let container = document.querySelector('.container');
            container.innerHTML = inf_show
            let div = document.createElement('div');
           
            div.setAttribute('class','per_add_div')
            container.appendChild(div);
            let time_div = document.createElement('input');
            time_div.setAttribute('class','add_time');
            time_div.setAttribute('placeholder','时间格式： 2020-06-01 01:24:00')
            let stu_div = document.createElement('input');
            stu_div.setAttribute('class','add_stu');
            stu_div.setAttribute('placeholder','影厅ID')
            // stu_div.setAttribute('oninput',"value=value.replace(/[^\d]/g,'')")
            let mov_div = document.createElement('input');
            mov_div.setAttribute('class','add_mov');
            mov_div.setAttribute('placeholder','电影ID')
            let price_div = document.createElement('input');
            price_div.setAttribute('class','add_price');
            price_div.setAttribute('placeholder','价格')
            div.appendChild(time_div);
            div.appendChild(stu_div);
            div.appendChild(mov_div);
            div.appendChild(price_div);
            let add_yes = document.createElement('button');
            add_yes.setAttribute('class','per_add_yes')
            add_yes.innerHTML = '确认';
            let add_no = document.createElement('button');
            add_no.setAttribute('class','per_add_no')
            add_no.innerHTML = '取消';
            div.appendChild(add_yes);
            div.appendChild(add_no)
            add_no.addEventListener('click',()=>{
                Sch_Init();
                container.removeChild(div);
            })
            add_yes.addEventListener('click',()=>{
                let post_data = this.post_data();
                this.request(post_data)
            })
        })
    }
    callback(data){
        console.log(data);
        
    }
}
