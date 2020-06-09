




let Man_Init = ()=>{
    let man_req = new Man_Req();
    man_req.button();
    man_req.request(1);
    //man_req.request_();
    //let mov_req = new Mov_Req();
    //mov_req.request(1);
}


class Man_Req{
    constructor(){
        this.url = 'http://gaoxingkun.top:8888/record/boxoffice/'
        this.url1 = 'http://gaoxingkun.top:8888/manage/retrieve/byid?man_id=3'
        this.index = 1;
    }
    button(){
        let last = document.getElementsByClassName('last')[0];
        last.addEventListener('click',()=>{
            this.index--;
            if(this.index<1){
                this.index = 1;
            }
            let man_req = new Man_Req(this.index)
            man_req.request(this.index);
        })

        let next = document.getElementsByClassName('next')[0];
        next.addEventListener('click',()=>{
            console.log(1);
            
            this.index++;
            if(this.index<1){
                this.index = 1;
            }
            let man_req = new Man_Req(this.index)
            man_req.request(this.index);
        })

    }
    request(num){
        let url = this.url + num;
        ajax(url,'GET',``,'json',this.callback)
    }
    request_(){
        ajax(this.url1,'GET','','json',this.callback)
    }
    callback(data){
        console.log(data);
        if(data.errno != '0'){
            return;
        }
        let manage_res = document.querySelector('.manage_res');
        manage_res.innerHTML = '';
        for(let i = 0;i < data.data.length;i++){
            //let status_arr = ['可售','已售']
            
            let inner = `
            <div class="manage_div">
                <span class="man_res_id">${data.data[i].id}</span>
                <span class="man_res_row">${data.data[i].name}</span>
                <span class="man_res_col">${data.data[i].sum_price}</span>
            </div>
            `
            manage_res.innerHTML += inner;
        }
        
      
    }
}

let Per_Init = ()=>{
    let man_req = new Per_Req();
    man_req.button();
    man_req.request(1);
    //man_req.request_();
    //let mov_req = new Mov_Req();
    //mov_req.request(1);
}

let Rec_Init = ()=>{
    let man_req = new Rec_Req();
    man_req.button();
    man_req.request(1);
    //man_req.request_();
    //let mov_req = new Mov_Req();
    //mov_req.request(1);
}
//performance
class Per_Req{
    constructor(){
        this.url = 'http://gaoxingkun.top:8888/record/performance/'
        //this.url1 = 'http://gaoxingkun.top:8888/manage/retrieve/byid?man_id=3'
        this.index = 1;
    }
    button(){
        let last = document.getElementsByClassName('last')[0];
        last.addEventListener('click',()=>{
            this.index--;
            if(this.index<1){
                this.index = 1;
            }
            let man_req = new Per_Req(this.index)
            man_req.request(this.index);
        })

        let next = document.getElementsByClassName('next')[0];
        next.addEventListener('click',()=>{
            console.log(1);
            
            this.index++;
            if(this.index<1){
                this.index = 1;
            }
            let man_req = new Per_Req(this.index)
            man_req.request(this.index);
        })

    }
    request(num){
        let url = this.url + num;
        ajax(url,'GET',``,'json',this.callback)
    }
    request_(){
        ajax(this.url1,'GET','','json',this.callback)
    }
    callback(data){
        console.log(data);
        if(data.errno != '0'){
            return;
        }
        let manage_res = document.querySelector('.per_res');
        manage_res.innerHTML = '';
        for(let i = 0;i < data.data.length;i++){
            //let status_arr = ['可售','已售']
            
            let inner = `
            <div class="per_div">
                <span class="per_res_id">${data.data[i].id}</span>
                <span class="per_res_row">${data.data[i].name}</span>
                <span class="per_res_col">${data.data[i].sum_price}</span>
            </div>
            `
            manage_res.innerHTML += inner;
        }
        
      
    }
}




class Rec_Req{
    constructor(){
        this.url = 'http://gaoxingkun.top:8888/record/retrieve/'
        //this.url1 = 'http://gaoxingkun.top:8888/manage/retrieve/byid?man_id=3'
        this.index = 1;
    }
    button(){
        let last = document.getElementsByClassName('last')[0];
        last.addEventListener('click',()=>{
            this.index--;
            if(this.index<1){
                this.index = 1;
            }
            let man_req = new Per_Req(this.index)
            man_req.request(this.index);
        })

        let next = document.getElementsByClassName('next')[0];
        next.addEventListener('click',()=>{
            console.log(1);
            
            this.index++;
            if(this.index<1){
                this.index = 1;
            }
            let man_req = new Per_Req(this.index)
            man_req.request(this.index);
        })

    }
    request(num){
        let url = this.url + num;
        ajax(url,'GET',``,'json',this.callback)
    }
    request_(){
        ajax(this.url1,'GET','','json',this.callback)
    }
    callback(data){
        console.log("ssssss")
        console.log(data.data[0].EmpName);
        if(data.errno != '0'){
            return;
        }
        let manage_res = document.querySelector('.rec_res');
        manage_res.innerHTML = '';
        for(let i = 0;i < data.data.length;i++){
            //let status_arr = ['可售','已售']
            //<span class="rec_res_status">${data.data[i].MovieName}</span> 

            let inner = `
            <div class="per_div">
            <span class="rec_res_id">${data.data[i].RecId}</span>
            <span class="rec_res_row">${data.data[i].EmpName}</span>
            <span class="rec_res_col">${data.data[i].Created}</span>
            <span class="rec_res_sch">${data.data[i].TicketPrice}</span>
            <span class="rec_res_mov">${data.data[i].TicketId}</span>
            </div>
            `
            manage_res.innerHTML += inner;
        }
        
      
    }
}
/*
class Mov_Req{
    constructor(){
        this.url = 'http://gaoxingkun.top:8888/movie/retrieve/'
        this.movid_url = 'http://gaoxingkun.top:8888/schedule/retrieve/bymovie'
        this.man_url = 'http://gaoxingkun.top:8888/manage/retrieve/bysch'
    }
    //发送请求获得电影
    request(num){
        let url = this.url + num;
        ajax(url,'GET','','json',this.callback)
    }
    //发送请求获得电影的演出计划
    request_sch(mov_id){
        ajax(this.movid_url,'GET',`mov_id=${mov_id}`,'json',this.sch_callback)
    }
    request_man(sch_id){
        ajax(this.man_url,'GET',`sch_id=${sch_id}`,'json',this.man_callback)
    }
    callback(data){
        console.log(data);
        let manage_mov_res = document.querySelector('.manage_mov_res');
        manage_mov_res.innerHTML = '';
        //调用函数将数据动态加载
        for(let i = 0;i < data.sum;i++){
            let inf = `
                <div class="manage_mov_div">
                <span class="man_mov_res_id">${data.data[i].mov_id}</span>
                <span class="man_mov_res_name">${data.data[i].mov_name}</span>
                <span class="man_mov_res_type">${data.data[i].mov_type}</span>
                <span class="man_mov_res_time">${data.data[i].mov_time}</span>
                <span class="man_mov_res_comment">${data.data[i].mov_comment}</span>
                <span class="man_mov_res_rel">${data.data[i].mov_rel}</span>
            </div>
            `
            manage_mov_res.innerHTML += inf;
        }
        let manage_mov_div = document.getElementsByClassName('manage_mov_div');
        console.log(manage_mov_div.length);
        for(let i = 0;i < manage_mov_div.length;i++){
            manage_mov_div[i].addEventListener('click',()=>{
                let mov_req = new Mov_Req();
                mov_req.request_sch(manage_mov_div[i].querySelector('.man_mov_res_id').innerHTML)
            })
        }
    }
    sch_callback(data){
        console.log('??');
        console.log(data);
        
        let inf = `
     
        <span class="inf_sch_id">ID</span>
        <span class="inf_sch_time">演出时间</span>
        <span class="inf_stu_name">影厅</span>
        <span class="inf_mov_name">电影</span>
        <span class="inf_sch_price">票价</span>
       
        
       `
        let manage_inf_mov_show = document.querySelector('.manage_inf_mov_show');
        manage_inf_mov_show.innerHTML = inf;
        let manage_mov_res = document.querySelector('.manage_mov_res');
        manage_mov_res.innerHTML = '';
        for(let i=0;i < data.data.length;i++){
            let inner = `
            <div class="manage_mov_div">
                <span class="res_sch_id">${data.data[i].sch_id}</span>
                <span class="res_sch_time">${data.data[i].sch_time}</span>
                <span class="res_stu_name">${data.data[i].stu_name}</span>
                <span class="res_mov_name">${data.data[i].mov_name}</span>
                <span class="res_sch_price">${data.data[i].sch_price}</span>
            </div>
            `
            manage_mov_res.innerHTML +=inner;
        }
        //添加点击事件
       let manage_mov_div = document.getElementsByClassName('manage_mov_div');
       console.log(manage_mov_div.length);
       
       for(let i=0;i <manage_mov_div.length;i++){
           manage_mov_div[i].addEventListener('click',()=>{
              //点击请求此id对应的票
              let mov_req = new Mov_Req();
              let sch_id = manage_mov_div[i].querySelector('.res_sch_id').innerHTML
              mov_req.request_man(sch_id)
           })
       }
    }
    man_callback(data){
        console.log(data);

        if(data.sum == '0'){
            let attention = document.querySelector('.attention');
            attention.style.display = 'block';
            setTimeout(()=>{
                attention.style.transition = '1s';
                attention.style.display = 'none';
                // attention.style.opacity = '0'
            },1000)
           
            attention.style.opacity = '1'
        }
        let container = document.querySelector('.manage_inf_mov_show');
        container.innerHTML = ''
        let newcontainer = `
        <span class="man_inf_id">ID</span>
        <span class="man_inf_row">行</span>
        <span class="man_inf_col">列</span>
        <span class="man_inf_status">状态</span>
        <span class="man_inf_sch">影厅</span>
        <span class="man_inf_mov">电影</span>
        `
        container.innerHTML = newcontainer;
        let button = document.getElementsByClassName('manage_page')[1];
        button.style.display = 'inline-block'
        let last = document.getElementsByClassName('last')[1];
        let next = document.getElementsByClassName('next')[1];
        last.style.display = 'inline-block'
        save_data = data;
        man_index = 0;
        create_man()
       
    }
    
}
save_data = '';
man_index = 0;
let last = document.getElementsByClassName('last')[1];
let next = document.getElementsByClassName('next')[1];
last.addEventListener('click',()=>{
    console.log('left');
    if(man_index >=10){
        man_index-=10;
        create_man()
    }
    else{
        return;
    }        
})
next.addEventListener('click',()=>{
    console.log('right');
    console.log(man_index);
    
    if(man_index+10>=save_data.sum){
        return;
    }
    else{
        man_index+=10;
        create_man()
    }
})

let buy = document.querySelector('.buy');

buy.addEventListener('click',()=>{
   
    let data = {m_manage:m_data}
    let post_data = JSON.stringify(data)
    console.log(post_data);
    
    let url = 'http://gaoxingkun.top:8888/manage/update';
    ajax(url,'post',post_data,'json',buy_callback)
})
let buy_callback = (data)=>{
    console.log(data);
    
}
let  m_data = [];

let create_man = (data)=>{
    let manage_res = document.querySelector('.manage_mov_res');
    let status_arr = ['可售','已售']
   
    manage_res.innerHTML = ''
    for(let i=man_index;i<man_index + 10;i++){
        let inner = `
        <div class="manage_div">
            <span class="man_res_id">${save_data.data[i].man_id}</span>
            <span class="man_res_row">${save_data.data[i].seat.st_row}</span>
            <span class="man_res_col">${save_data.data[i].seat.st_col}</span>
            <span class="man_res_status">${status_arr[parseInt(save_data.data[i].TicStatus)]}</span>
            <span class="man_res_sch">${save_data.data[i].TicStuName}</span>
            <span class="man_res_mov">${save_data.data[i].TicMovName}</span>
        </div>
        `
        manage_res.innerHTML +=inner;
    }
    let manage = document.getElementsByClassName('manage_div');
    console.log(manage);
    
    for(let i =0;i<10;i++){
        manage[i+10].addEventListener('click',()=>{
           
            let man_id = manage[i+10].querySelector('.man_res_id').innerHTML;
            man_id_value = parseInt(man_id);
            let temp = {"man_id":man_id_value};
            m_data.push(temp);
            manage[i+10].style.border = '1px solid red';
        })
    }
  
    console.log(man_index);
    
  
}

let Return_Init = ()=>{
    let return_man = new Return_Tic();
    return_man.add_event();
}
class Return_Tic{
    constructor(){
         this.but = document.querySelector('.return_but');
         this.input = document.querySelector('.return_input');
         this.url = 'http://gaoxingkun.top:8888/manage/retrieve/byid'
         this.url_return = 'http://gaoxingkun.top:8888/manage/update/return'
    }
    request(man_id){
        ajax(this.url,'GET',`man_id=${man_id}`,'json',this.callback)
    }
    return_request(man_id){
        let post_data = {
            "man_id":man_id
        };
        post_data = JSON.stringify(post_data);
        console.log(post_data);
        
        ajax(this.url_return,'post',post_data,'json',this.request_callback)
    }
    add_event(){
        this.but.addEventListener('click',()=>{
            //点击发送请求
            if(this.input.value == ''){
                this.input.setAttribute('placeholder','请输入id');
                return;
            }
            else{
                this.request(this.input.value);
            }
        })
    }
    request_callback(data){
        console.log(data);
        if(data.errno == '4001'){
            let return_res_div = document.querySelector('.return_res_div');
            return_res_div.innerHTML = '';
            let att = document.querySelector('.return_att');
            att.style.display = 'block'
           
            att.style.zIndex = '2'
          
            setTimeout(()=>{
                att.style.display = 'none';
            },1000)
        }
        
    }
    callback(data){
        console.log(data);
        let status_arr = ['可购','已购'];
        let return_res_div = document.querySelector('.return_res_div');
        let inf = `
        <div class="manage_div">
        <span class="man_res_id">${data.data.man_id}</span>
        <span class="man_res_row">${data.data.seat.st_row}</span>
        <span class="man_res_col">${data.data.seat.st_col}</span>
        <span class="man_res_status">${status_arr[parseInt(data.data.TicStatus)]}</span>
        <span class="man_res_sch">${data.data.TicStuName}</span>
        <span class="man_res_mov">${data.data.TicMovName}</span>
        </div>
          `
        return_res_div.innerHTML = inf;
        let button = document.querySelector('.return_man');
        let att = document.querySelector('.return_att');
        
        button.addEventListener('click',()=>{
            if(return_res_div.innerHTML == ''){
                att.innerHTML = '请先查找影片！'
                att.style.display = 'block';
                setTimeout(()=>{
                    att.style.display = 'none';

                },1000)
            }
            else{
               let return_man = new Return_Tic();
               let id = return_res_div.querySelector('.man_res_id').innerHTML;
               console.log(id);
                id = parseInt(id);
               return_man.return_request(id);
                
            }    
            
        })
        
    }
}
*/