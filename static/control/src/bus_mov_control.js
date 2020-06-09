let Film_Init = ()=>{
    let film_req = new Film_Req();
    film_req.request(1);
    let film_ser = new Film_Ser();
    film_ser.add_click_event();
    let input_css = new Input_Css();
    input_css.add_event();
    film_req.req_add_event();
    let film_del = new Film_Del();
    film_del.del_add_event();
    let file_mod = new Film_Mod();
    file_mod.span_to_input();
    let file_add = new Film_Add();
    file_add.add_event();
   
}


film_data = '';
class Film_Req{
    constructor(){
        this.url = 'http://gaoxingkun.top:8888/movie/retrieve/'
    }
    request(num){
        let url = this.url + num;
        ajax(url,'GET','','json', this.callback); 
    }
    //为两个按钮绑定事件
    req_add_event(){
        let but_left = document.querySelector('.mov_left');
        let but_right = document.querySelector('.mov_right')
        but_left.addEventListener('click',()=>{
            //请求上一个电影数据
            //获得当前电影的id
            let mov_id = document.querySelector('.mov_id').innerHTML;
            let index = 0;
            mov_id = parseInt(mov_id)
            //每次循环求得当前元素在数组中的下标
            for(let i = 0;i < film_data.sum;i++){
                if(mov_id == film_data.data[i].mov_id){
                    index = i;
                    break;
                }
            }
            console.log(index);
            
            if(index-1 >= 0){
               film_inf_set(film_data,index-1)
            }
            else{
                film_inf_set(film_data,index);
            }
            
        })
        but_right.addEventListener('click',()=>{
            //请求上一个电影数据
            //获得当前电影的id
            let mov_id = document.querySelector('.mov_id').innerHTML;
            let index = 0;
            mov_id = parseInt(mov_id)
            //每次循环求得当前元素在数组中的下标
            for(let i = 0;i < film_data.sum;i++){
                if(mov_id == film_data.data[i].mov_id){
                    index = i;
                    break;
                }
            }
            if(index+1 > film_data.sum-1){
               film_inf_set(film_data,index)
            }
            else{
                film_inf_set(film_data,index+1);
            }
            
        })
    }
    callback(data){
        console.log(data);
        //请求后将数据存储起来
        film_data = data;
        //首先请求第一页
        film_inf_set(data,0);
    
    }
}
let film_inf_set = (data,num)=>{
      //设置背景图片
      let mov_img = document.querySelector('.mov_img');
      mov_img.style.transition = '.5s'
      mov_img.style.background = `url(${data.data[num].mov_img})`
      mov_img.style.backgroundSize = '100% 100%';
      mov_img.style.backgroundRepeat = 'no-repeat'
      //设置展示图片
      let mov_show_img = document.querySelector('.mov_show_img');
      mov_show_img.src = `${data.data[num].mov_img}`
      mov_show_img.style.backgroundSize = '100% 100%';
      mov_show_img.style.backgroundRepeat = 'no-repeat'
    //设置信息内容
      let mov_name = document.querySelector('.mov_name');
      mov_name.innerHTML = data.data[num].mov_name;
      let mov_comment = document.querySelector('.mov_comment');
      mov_comment.innerHTML = data.data[num].mov_comment;
      let mov_type = document.querySelector('.mov_type');
      mov_type.innerHTML = data.data[num].mov_type;
      let mov_rel = document.querySelector('.mov_rel');
      mov_rel.innerHTML = data.data[num].mov_rel;
      let mov_time = document.querySelector('.mov_time');
      mov_time.innerHTML = data.data[num].mov_time;
      let mov_des = document.querySelector('.mov_des');
      mov_des.innerHTML = data.data[num].mov_description;
      let mov_id = document.querySelector('.mov_id');
      mov_id.innerHTML = data.data[num].mov_id;
      mov_show_img.style.transition = '.5s'
      mov_name.style.transition = '.5s'
      mov_comment.style.transition = '.5s'
      mov_type.style.transition = '.5s'
      mov_rel.style.transition = '.5s'
      mov_time.style.transition = '.5s'
      mov_des.style.transition = '.5s'
      mov_id.style.transition = '.5s'
    }
//删除电影
class Film_Del{
    constructor(){
        this.mov_del = document.querySelector('.mov_del');
        this.url = 'http://gaoxingkun.top:8888/movie/delete'
        this.mov_id = '';
        this.isDel = false;
    }
    request(){
        let param = `mov_id=${this.mov_id}`
        ajax(this.url,'GET',param,'json', this.callback); 
    }
    //为按钮绑定事件
    del_add_event(){
        this.mov_del.addEventListener('click',()=>{
            console.log(44444444444);
            //点击按钮出现是否删除框
            let is_del = document.querySelector('.is_del');
            is_del.style.display = 'block';
            //为这两个按钮绑定事件
            let del_yes = document.querySelector('.del_yes');
            //点击yes 发送删除请求
            del_yes.addEventListener('click',()=>{
                //获得当前电影的id
                this.mov_id = document.querySelector('.mov_id').innerHTML;
                //发送请求
                this.request();
                is_del.style.display = 'none';
            })
            let del_no = document.querySelector('.del_no');
            //点击no 不发送请求
            del_no.addEventListener('click',()=>{
                is_del.style.display = 'none';
            })
            
        })
    }
    callback(data){
        //重新刷新页面
        Film_Init();
    }
}
//-----------------------------------修改电影--------------------------------//
class Film_Mod{
    constructor(){
        this.url = 'http://gaoxingkun.top:8888/movie/update'
        this.mov_mod = document.querySelector('.mov_mod');
    }
    request(post_data){
        ajax(this.url,'post',post_data,'json',this.callBack)
    }
    //将span变为input  可以输入
    span_to_input(){
        this.mov_mod.addEventListener('click',()=>{
            let mov_name = document.querySelector('.mov_name');
            let mov_con_right = document.querySelector('.mov_con_right');
            mov_name.style.display = 'none';
            let input_name = document.createElement('input');
            input_name.setAttribute('class',' input_name');
            input_name.setAttribute('placeholder','电影名称')
            // input.style.fontSize = '1rem'
            // input.style.color = '#000'
            // input.style.width = '12vw'
            // mov_name.style.display = 'inline-block';
            mov_con_right.insertBefore(input_name,mov_con_right.firstChild);

            let mov_comment = document.querySelector('.mov_comment');
           
            mov_comment.style.display = 'none';
            let input_comment = document.createElement('input');
            input_comment.setAttribute('class',' input_comment');
            input_comment.setAttribute('placeholder','评分')
            let temp = document.querySelector('.input_name');
            mov_con_right.insertBefore(input_comment,temp.nextElementSibling);
            
            let mov_type = document.querySelector('.mov_type');
            mov_type.style.display = 'none';
            let input_type = document.createElement('input');
            input_type.setAttribute('class',' input_type');
            input_type.setAttribute('placeholder','类型')
             temp = document.querySelector('.input_comment');
            mov_con_right.insertBefore(input_type,temp.nextElementSibling);

            let mov_rel = document.querySelector('.mov_rel');
            mov_rel.style.display = 'none';
            let input_rel = document.createElement('input');
            input_rel.setAttribute('class',' input_rel');
            input_rel.setAttribute('placeholder','国家')
             temp = document.querySelector('.input_type');
            mov_con_right.insertBefore(input_rel,temp.nextElementSibling);

            let mov_time = document.querySelector('.mov_time');
            mov_time.style.display = 'none';
            let input_time = document.createElement('input');
            input_time.setAttribute('class',' input_time');
            input_time.setAttribute('placeholder','时间')
             temp = document.querySelector('.input_rel');
            mov_con_right.insertBefore(input_time,temp.nextElementSibling);

            let mov_des = document.querySelector('.mov_des');
            mov_des.style.display = 'none';
            let input_des = document.createElement('textarea');
            input_des.setAttribute('class',' input_des');
            input_des.setAttribute('placeholder','描述')
             temp = document.querySelector('.mov_cut');
            mov_con_right.insertBefore(input_des,temp.nextElementSibling);

            //创建两个按钮
            let button_yes = document.createElement('button');
            button_yes.setAttribute('class','button_yes');
            button_yes.innerHTML = '确定'
            mov_con_right.appendChild(button_yes)
            this.set_input_value();
            let button_no = document.createElement('button');
            button_no.setAttribute('class','button_no');
            button_no.innerHTML = '取消'
            mov_con_right.appendChild(button_no)
            
            //为这两个按钮绑定事件
            button_no.addEventListener('click',()=>{
               
                mov_name.style.display = 'inline-block';
                mov_comment.style.display = 'inline-block';
                mov_type.style.display = 'block';
                mov_rel.style.display = 'inline-block';
                mov_time.style.display = 'inline-block';
                mov_des.style.display = 'inline-block';
              

                mov_con_right.removeChild(input_name);
                mov_con_right.removeChild(input_comment);
                mov_con_right.removeChild(input_type);
                mov_con_right.removeChild(input_rel);
                mov_con_right.removeChild(input_time);
                mov_con_right.removeChild(input_des);
                mov_con_right.removeChild(button_yes);
                mov_con_right.removeChild(button_no);
               
            })
            button_yes.addEventListener('click',()=>{
                 //发起请求
                 let post_data = this.post_data();
                 this.request(post_data);
                mov_name.style.display = 'inline-block';
                mov_comment.style.display = 'inline-block';
                mov_type.style.display = 'block';
                mov_rel.style.display = 'inline-block';
                mov_time.style.display = 'inline-block';
                mov_des.style.display = 'inline-block';
                mov_con_right.removeChild(input_name);
                mov_con_right.removeChild(input_comment);
                mov_con_right.removeChild(input_type);
                mov_con_right.removeChild(input_rel);
                mov_con_right.removeChild(input_time);
                mov_con_right.removeChild(input_des);
                mov_con_right.removeChild(button_yes);
                mov_con_right.removeChild(button_no);
               
                //回到初始界面
                let film_req = new Film_Req();
                film_req.request(1);
                
            })
            this.set_input_value();

        })
    
    }
    post_data(){
        let input_name = document.querySelector('.input_name').value;
        let input_comment = document.querySelector('.input_comment').value;
        input_comment = parseFloat(input_comment)
        let input_type = document.querySelector('.input_type').value;
        let input_rel = document.querySelector('.input_rel').value;
        let input_time = document.querySelector('.input_time').value;
        input_time = parseInt(input_time);
        let input_des = document.querySelector('.input_des').value;
        let input_id = document.querySelector('.mov_id').innerHTML;
        let input_img = document.querySelector('.mov_show_img').src;
        input_id = parseInt(input_id);
        let data = {
            "mov_id":input_id,
            "mov_name":`${input_name}`,
            "mov_type":`${input_type}`,
            "mov_comment":input_comment,
            "mov_time":input_time,
            "mov_rel":`${input_rel}`,
            "mov_description":`${input_des}`,
            "mov_img":`${input_img}`
        }
        return JSON.stringify(data);


    }
    //为input填上数值
    set_input_value(){
        let input_name = document.querySelector('.input_name');
        let mov_name = document.querySelector('.mov_name');
        input_name.value = mov_name.innerHTML;

        let input_comment = document.querySelector('.input_comment');
        let mov_comment = document.querySelector('.mov_comment');
        input_comment.value = mov_comment.innerHTML;

        let input_type = document.querySelector('.input_type');
        let mov_type = document.querySelector('.mov_type');
        input_type.value = mov_type.innerHTML;

        let input_rel = document.querySelector('.input_rel');
        let mov_rel = document.querySelector('.mov_rel');
        input_rel.value = mov_rel.innerHTML;

        let input_time = document.querySelector('.input_time');
        let mov_time = document.querySelector('.mov_time');
        input_time.value = mov_time.innerHTML;

        let input_des = document.querySelector('.input_des');
        let mov_des = document.querySelector('.mov_des');
        input_des.value = mov_des.innerHTML;



    }
    callBack(data){
        console.log(data);
        
    }
}

//-----------------------------查询电影-------------------------------//
class Film_Ser{
    constructor(){
        this.mov_ser = document.querySelector('.mov_ser');
        this.mov_ser_but = document.querySelector('.mov_ser_but')
        this.input_url = 'http://gaoxingkun.top:8888/movie/retrieve/name';
        this.but_url = 'http://gaoxingkun.top:8888/movie/retrieve';
    }
    add_click_event(){
        this.mov_ser_but.addEventListener('click',()=>{
           if(this.mov_ser.value == ''){
               return;
           }
            
            this.callback = (data)=>{
                film_click_callback(data);
            }
            this.request(false,mov_ser.value)
        })
    }
    request(req_method,name){
        console.log(this.callback);
        
        if(req_method){
            ajax(this.input_url,'GET',`mov_name=${name}`,'json',this.callback)
        }
        else{
            ajax(this.but_url,'GET',`mov_hint=${name}`,'json',this.callback);
        }
       
    }
    callback(data){
        console.log(data);
        
    }

}

let ser_name_save = ''

let mov_input_callback = (data)=>{
    console.log(705);
    
    let mov_res = document.querySelector('.mov_res');
    mov_res.innerHTML = '';
  
    
   for(let i = 0;i < data.sum ;i++){
       console.log(999);
       
        let div = document.createElement('div');
        div.innerHTML = `${data.data[i].mov_name}`;
          //为每个div绑定事件
        div.addEventListener('click',()=>{
            //点击就发送精确查询请求
            let name = div.innerHTML;
            ser_name_save = name;
            let film_ser = new Film_Ser();
            
            film_ser.callback = (data)=>{
                film_click_callback(data)
            }
            film_ser.request(false,name);
            mov_res.innerHTML = ''
        })
        mov_res.appendChild(div);
      

   }
    
}

let film_click_callback = (data)=>{
    console.log(data);
    
    console.log(194);
    let mov_res = document.querySelector('.mov_res');
    mov_res.innerHTML = '';
    // let mov_ser = document.querySelector('.mov_ser');
    // mov_ser.value = '';
    let film_req = new Film_Req();
  
    //修改回调函数
    film_req.callback = (data)=>{
        console.log(data);
        //请求后将数据存储起来
        film_data = data;
        let index = -1;
        for(let i = 0;i < film_data.sum;i++){
            if(film_data.data[i].mov_name == ser_name_save){
                index = i;
                break;
            }
        }
        if(index == -1){
            console.log(4444);
            
            return 
        }
        film_inf_set(data,index);
    
    }
    film_req.request(1);
}

let film_input_ser = ()=>{
    console.log(23424234);
   
    let film_ser =  new Film_Ser();
    let mov_res = document.querySelector('.mov_res');
    if(film_ser.mov_ser.value == ''){
        mov_res.innerHTML = '';
        return;
    }
    film_ser.callback = (data)=>{
        mov_input_callback(data);
    }
    this.mov_ser = document.querySelector('.mov_ser');
    let name = mov_ser.value;
    film_ser.request(true,name);
}

//-----------------------------添加电影-------------------------------//
class Film_Add{
    constructor(){
        this.mov_add = document.querySelector('.mov_add');
        this.url = 'http://gaoxingkun.top:8888/movie/create/info'
    }
    add_event(){
        this.mov_add.addEventListener('click',()=>{
            let mov_show_img = document.querySelector('.mov_show_img');
            mov_show_img.src = '';
            let mov_name = document.querySelector('.mov_name');
            let mov_con_right = document.querySelector('.mov_con_right');
            mov_name.style.display = 'none';
            let input_name = document.createElement('input');
            input_name.setAttribute('class',' input_name');
            input_name.setAttribute('placeholder','电影名称')
            // input.style.fontSize = '1rem'
            // input.style.color = '#000'
            // input.style.width = '12vw'
            // mov_name.style.display = 'inline-block';
            mov_con_right.insertBefore(input_name,mov_con_right.firstChild);

            let mov_comment = document.querySelector('.mov_comment');
           
            mov_comment.style.display = 'none';
            let input_comment = document.createElement('input');
            input_comment.setAttribute('class',' input_comment');
            input_comment.setAttribute('placeholder','评分')
            let temp = document.querySelector('.input_name');
            mov_con_right.insertBefore(input_comment,temp.nextElementSibling);
            
            let mov_type = document.querySelector('.mov_type');
            mov_type.style.display = 'none';
            let input_type = document.createElement('input');
            input_type.setAttribute('class',' input_type');
            input_type.setAttribute('placeholder','类型')
             temp = document.querySelector('.input_comment');
            mov_con_right.insertBefore(input_type,temp.nextElementSibling);

            let mov_rel = document.querySelector('.mov_rel');
            mov_rel.style.display = 'none';
            let input_rel = document.createElement('input');
            input_rel.setAttribute('class',' input_rel');
            input_rel.setAttribute('placeholder','国家')
             temp = document.querySelector('.input_type');
            mov_con_right.insertBefore(input_rel,temp.nextElementSibling);

            let mov_time = document.querySelector('.mov_time');
            mov_time.style.display = 'none';
            let input_time = document.createElement('input');
            input_time.setAttribute('class',' input_time');
            input_time.setAttribute('placeholder','时间')
             temp = document.querySelector('.input_rel');
            mov_con_right.insertBefore(input_time,temp.nextElementSibling);

            let mov_des = document.querySelector('.mov_des');
            mov_des.style.display = 'none';
            let input_des = document.createElement('textarea');
            input_des.setAttribute('class',' input_des');
            input_des.setAttribute('placeholder','描述')
             temp = document.querySelector('.mov_cut');
            mov_con_right.insertBefore(input_des,temp.nextElementSibling);

              //创建两个按钮
              let button_yes = document.createElement('button');
              button_yes.setAttribute('class','button_yes');
              button_yes.innerHTML = '确定'
              mov_con_right.appendChild(button_yes)
       
              let button_no = document.createElement('button');
              button_no.setAttribute('class','button_no');
              button_no.innerHTML = '取消'
              mov_con_right.appendChild(button_no)
              
              //为这两个按钮绑定事件
              button_no.addEventListener('click',()=>{
                 
                  mov_name.style.display = 'inline-block';
                  mov_comment.style.display = 'inline-block';
                  mov_type.style.display = 'block';
                  mov_rel.style.display = 'inline-block';
                  mov_time.style.display = 'inline-block';
                  mov_des.style.display = 'inline-block';
                
  
                  mov_con_right.removeChild(input_name);
                  mov_con_right.removeChild(input_comment);
                  mov_con_right.removeChild(input_type);
                  mov_con_right.removeChild(input_rel);
                  mov_con_right.removeChild(input_time);
                  mov_con_right.removeChild(input_des);
                  mov_con_right.removeChild(button_yes);
                  mov_con_right.removeChild(button_no);
                  let film_req = new Film_Req();
                  film_req.request(1);
                 
              })
              button_yes.addEventListener('click',()=>{
                  
                   
                   let post_data = this.post_data();
                   this.request(post_data);
                  mov_name.style.display = 'inline-block';
                  mov_comment.style.display = 'inline-block';
                  mov_type.style.display = 'block';
                  mov_rel.style.display = 'inline-block';
                  mov_time.style.display = 'inline-block';
                  mov_des.style.display = 'inline-block';
                  mov_con_right.removeChild(input_name);
                  mov_con_right.removeChild(input_comment);
                  mov_con_right.removeChild(input_type);
                  mov_con_right.removeChild(input_rel);
                  mov_con_right.removeChild(input_time);
                  mov_con_right.removeChild(input_des);
                  mov_con_right.removeChild(button_yes);
                  mov_con_right.removeChild(button_no);
                 
               
            })
            
        })
    }
    request(post_data){
        ajax(this.url,'post',post_data,'json',this.callback)
    }
    post_data(){
        let input_name = document.querySelector('.input_name').value;
        let input_comment = document.querySelector('.input_comment').value;
        input_comment = parseFloat(input_comment)
        let input_type = document.querySelector('.input_type').value;
        let input_rel = document.querySelector('.input_rel').value;
        let input_time = document.querySelector('.input_time').value;
        input_time = parseInt(input_time);
        let input_des = document.querySelector('.input_des').value;
      
       
  
        let data = {
            "mov_name":`${input_name}`,
            "mov_type":`${input_type}`,
            "mov_comment":input_comment,
            "mov_time":input_time,
            "mov_rel":`${input_rel}`,
            "mov_description":`${input_des}`
           
        }
        return JSON.stringify(data);
    }
    callback(data){
        console.log(data);
           //回到初始界面
           let film_req = new Film_Req();
           film_req.request(1);
    }
}


//输入文件的样式控制
class Input_Css{
    constructor(){
        this.mov_show_iconfont = document.querySelector('.mov_show_iconfont');
        this.input_pic = document.querySelector('.input_pic');
    }
    add_event(){
        //鼠标滑过触发时间
        this.input_pic.addEventListener('mousemove',()=>{
            this.mov_show_iconfont.style.opacity = '1';
        })
        this.input_pic.addEventListener('mouseout',()=>{
            this.mov_show_iconfont.style.opacity = '0';
        })
    }
}
//----------------------------------获得传入的图片-----------------------------------//
let callback = (data)=>{
    console.log(data);
    
   Film_Init()
    
}

let get_pic = (e)=>{
    let url = 'http://gaoxingkun.top:8888/movie/create/image/';
    let mov_id = document.querySelector('.mov_id').innerHTML;
    mov_id = parseInt(mov_id);
    url = url + mov_id
    //获得Input
    let input_pic = document.querySelector('.input_pic');
    let files = input_pic.files
    console.log(input_pic.files);
    //将图片展示
    let mov_show_img = document.querySelector('.mov_show_img')
    let imgUrl = window.URL.createObjectURL(files[0])
    console.log(imgUrl);
    
    mov_show_img.src = `${imgUrl}`
    //获取formData
    let formData = new FormData();
   
  [].slice.call(files).forEach(function(value,index){
    formData.append('image',value,value.name) //遍历添加数据
    console.log(value);
    
  })
  console.log(formData);
  
  ajax1(url,'post',formData,'json',callback)


  
 
    
}

let ajax1 = (url,type,param,dataType,callBack,reality)=>{
    var xhr = null;
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    }
    else{
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }

    xhr.withCredentials = true;
    if(type =='GET'){
        url += "?" + param; 
    }
    if(typeof reality != 'undefined'){
        url += "&" + reality;
    }
    xhr.open(type, url , true);
    var data = null;
    if(type == 'post'){
        data = param;
       
        
        //设置POST的请求头，否则数据传不到后台
        // xhr.setRequestHeader("Content-Type", "multipart/form-data");
    }
    xhr.send(data);
    xhr.onreadystatechange = function(){
        
        console.log(xhr.readyState ,xhr.status);
        
        if(xhr.readyState == 4 && xhr.status == 200){
            
            
            var data = xhr.responseText;
            if(dataType == 'json'){
                data = JSON.parse(data);
                
            }
            
            callBack(data);
            
        }
    }
}
