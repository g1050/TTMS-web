let Tic_Init = ()=>{
    let tic_req = new Tic_Req();
    tic_req.button();
    tic_req.request(1);
    tic_req.request_();
    let mov_req = new Mov_Req();
    mov_req.request(1);
}

class Tic_Req{
    constructor(){
        this.url = 'http://gaoxingkun.top:8888/ticket/retrieve/'
        this.url1 = 'http://gaoxingkun.top:8888/ticket/retrieve/byid?tic_id=3'
        this.index = 1;
    }
    button(){
        let last = document.getElementsByClassName('last')[0];
        last.addEventListener('click',()=>{
            this.index--;
            if(this.index<1){
                this.index = 1;
            }
            let tic_req = new Tic_Req(this.index)
            tic_req.request(this.index);
        })

        let next = document.getElementsByClassName('next')[0];
        next.addEventListener('click',()=>{
            console.log(1);
            
            this.index++;
            if(this.index<1){
                this.index = 1;
            }
            let tic_req = new Tic_Req(this.index)
            tic_req.request(this.index);
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
        let ticket_res = document.querySelector('.ticket_res');
        ticket_res.innerHTML = '';
        for(let i = 0;i < data.data.length;i++){
            let status_arr = ['可售','已售']
            
            let inner = `
            <div class="ticket_div">
                <span class="tic_res_id">${data.data[i].tic_id}</span>
                <span class="tic_res_row">${data.data[i].seat.st_row}</span>
                <span class="tic_res_col">${data.data[i].seat.st_col}</span>
                <span class="tic_res_status">${status_arr[parseInt(data.data[i].TicStatus)]}</span>
                <span class="tic_res_sch">${data.data[i].TicStuName}</span>
                <span class="tic_res_mov">${data.data[i].TicMovName}</span>
            </div>
            `
            ticket_res.innerHTML += inner;
        }
        
      
    }
}

class Mov_Req{
    constructor(){
        this.url = 'http://gaoxingkun.top:8888/movie/retrieve/'
        this.movid_url = 'http://gaoxingkun.top:8888/schedule/retrieve/bymovie'
        this.tic_url = 'http://gaoxingkun.top:8888/ticket/retrieve/bysch'
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
    request_tic(sch_id){
        ajax(this.tic_url,'GET',`sch_id=${sch_id}`,'json',this.tic_callback)
    }
    callback(data){
        console.log(data);
        let ticket_mov_res = document.querySelector('.ticket_mov_res');
        ticket_mov_res.innerHTML = '';
        //调用函数将数据动态加载
        for(let i = 0;i < data.sum;i++){
            let inf = `
                <div class="ticket_mov_div">
                <span class="tic_mov_res_id">${data.data[i].mov_id}</span>
                <span class="tic_mov_res_name">${data.data[i].mov_name}</span>
                <span class="tic_mov_res_type">${data.data[i].mov_type}</span>
                <span class="tic_mov_res_time">${data.data[i].mov_time}</span>
                <span class="tic_mov_res_comment">${data.data[i].mov_comment}</span>
                <span class="tic_mov_res_rel">${data.data[i].mov_rel}</span>
            </div>
            `
            ticket_mov_res.innerHTML += inf;
        }
        let ticket_mov_div = document.getElementsByClassName('ticket_mov_div');
        console.log(ticket_mov_div.length);
        for(let i = 0;i < ticket_mov_div.length;i++){
            ticket_mov_div[i].addEventListener('click',()=>{
                let mov_req = new Mov_Req();
                mov_req.request_sch(ticket_mov_div[i].querySelector('.tic_mov_res_id').innerHTML)
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
        let ticket_inf_mov_show = document.querySelector('.ticket_inf_mov_show');
        ticket_inf_mov_show.innerHTML = inf;
        let ticket_mov_res = document.querySelector('.ticket_mov_res');
        ticket_mov_res.innerHTML = '';
        for(let i=0;i < data.data.length;i++){
            let inner = `
            <div class="ticket_mov_div">
                <span class="res_sch_id">${data.data[i].sch_id}</span>
                <span class="res_sch_time">${data.data[i].sch_time}</span>
                <span class="res_stu_name">${data.data[i].stu_name}</span>
                <span class="res_mov_name">${data.data[i].mov_name}</span>
                <span class="res_sch_price">${data.data[i].sch_price}</span>
            </div>
            `
            ticket_mov_res.innerHTML +=inner;
        }
        //添加点击事件
       let ticket_mov_div = document.getElementsByClassName('ticket_mov_div');
       console.log(ticket_mov_div.length);
       
       for(let i=0;i <ticket_mov_div.length;i++){
           ticket_mov_div[i].addEventListener('click',()=>{
              //点击请求此id对应的票
              let mov_req = new Mov_Req();
              let sch_id = ticket_mov_div[i].querySelector('.res_sch_id').innerHTML
              mov_req.request_tic(sch_id)
           })
       }
    }
    tic_callback(data){
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
        let container = document.querySelector('.ticket_inf_mov_show');
        container.innerHTML = ''
        let newcontainer = `
        <span class="tic_inf_id">ID</span>
        <span class="tic_inf_row">行</span>
        <span class="tic_inf_col">列</span>
        <span class="tic_inf_status">状态</span>
        <span class="tic_inf_sch">影厅</span>
        <span class="tic_inf_mov">电影</span>
        `
        container.innerHTML = newcontainer;
        let button = document.getElementsByClassName('ticket_page')[1];
        button.style.display = 'inline-block'
        let last = document.getElementsByClassName('last')[1];
        let next = document.getElementsByClassName('next')[1];
        last.style.display = 'inline-block'
        save_data = data;
        tic_index = 0;
        create_tic()
       
    }
    
}
save_data = '';
tic_index = 0;
let last = document.getElementsByClassName('last')[1];
let next = document.getElementsByClassName('next')[1];
last.addEventListener('click',()=>{
    console.log('left');
    if(tic_index >=10){
        tic_index-=10;
        create_tic()
    }
    else{
        return;
    }        
})
next.addEventListener('click',()=>{
    console.log('right');
    console.log(tic_index);
    
    if(tic_index+10>=save_data.sum){
        return;
    }
    else{
        tic_index+=10;
        create_tic()
    }
})

let buy = document.querySelector('.buy');

buy.addEventListener('click',()=>{
   
    let data = {m_ticket:m_data}
    let post_data = JSON.stringify(data)
    console.log(post_data);
    
    let url = 'http://gaoxingkun.top:8888/ticket/update';
    ajax(url,'post',post_data,'json',buy_callback)
})
let buy_callback = (data)=>{
    console.log(data);
    
}
let  m_data = [];

let create_tic = (data)=>{
    let ticket_res = document.querySelector('.ticket_mov_res');
    let status_arr = ['可售','已售']
   
    ticket_res.innerHTML = ''
    for(let i=tic_index;i<tic_index + 10;i++){
        let inner = `
        <div class="ticket_div">
            <span class="tic_res_id">${save_data.data[i].tic_id}</span>
            <span class="tic_res_row">${save_data.data[i].seat.st_row}</span>
            <span class="tic_res_col">${save_data.data[i].seat.st_col}</span>
            <span class="tic_res_status">${status_arr[parseInt(save_data.data[i].TicStatus)]}</span>
            <span class="tic_res_sch">${save_data.data[i].TicStuName}</span>
            <span class="tic_res_mov">${save_data.data[i].TicMovName}</span>
        </div>
        `
        ticket_res.innerHTML +=inner;
    }
    let ticket = document.getElementsByClassName('ticket_div');
    console.log(ticket);
    
    for(let i =0;i<10;i++){
        ticket[i+10].addEventListener('click',()=>{
           
            let tic_id = ticket[i+10].querySelector('.tic_res_id').innerHTML;
            tic_id_value = parseInt(tic_id);
            let temp = {"tic_id":tic_id_value};
            m_data.push(temp);
            ticket[i+10].style.border = '1px solid red';
        })
    }
  
    console.log(tic_index);
    
  
}

let Return_Init = ()=>{
    let return_tic = new Return_Tic();
    return_tic.add_event();
}
class Return_Tic{
    constructor(){
         this.but = document.querySelector('.return_but');
         this.input = document.querySelector('.return_input');
         this.url = 'http://gaoxingkun.top:8888/ticket/retrieve/byid'
         this.url_return = 'http://gaoxingkun.top:8888/ticket/update/return'
    }
    request(tic_id){
        ajax(this.url,'GET',`tic_id=${tic_id}`,'json',this.callback)
    }
    return_request(tic_id){
        let post_data = {
            "tic_id":tic_id
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
        <div class="ticket_div">
        <span class="tic_res_id">${data.data.tic_id}</span>
        <span class="tic_res_row">${data.data.seat.st_row}</span>
        <span class="tic_res_col">${data.data.seat.st_col}</span>
        <span class="tic_res_status">${status_arr[parseInt(data.data.TicStatus)]}</span>
        <span class="tic_res_sch">${data.data.TicStuName}</span>
        <span class="tic_res_mov">${data.data.TicMovName}</span>
        </div>
          `
        return_res_div.innerHTML = inf;
        let button = document.querySelector('.return_tic');
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
               let return_tic = new Return_Tic();
               let id = return_res_div.querySelector('.tic_res_id').innerHTML;
               console.log(id);
                id = parseInt(id);
               return_tic.return_request(id);
                
            }    
            
        })
        
    }
}
