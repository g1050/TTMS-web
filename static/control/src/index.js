
class Html_Init{
    constructor(){
        this.html = document.getElementsByTagName('html')[0];
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.isPho = false;
        
    }
    init(){
        this.html.style.width = this.width + 'px'
        this.html.style.height = this.height + 'px';
        console.log(this.width);
        if(this.width<768){
            this.isPho = true;
            let body = document.getElementsByTagName('body')[0];
            body.innerHTML = `
            <div class="choose">
        <span class="user_name"></span>
        <div class="pre">
            <img src="img/show.png" class="show_choose"><span class="user_pre">系统管理员</span> 
        </div>
        <div class="circle"></div>
    </div>
    <div class="choose_nav">
        <div class="pre_control">
            <div class="control_staff">
                   <img src="img/staff.png" alt="">
                   <span>员工</span>
            </div>
            <div class="control_movie">
                <img src="img/movie.png" alt="">
                <span>影厅</span>
            </div>
            <div class="control_set">
                <img src="img/seat.png" alt="">
                <span>座位</span>
            </div>
            <div class="back">
                  <img src="img/return.png" alt="">
                <span>返回</span>
            </div>
        </div>
    </div>
    <div class="container">
        <div class="staff_div">
            <li>
                <span class="stf_name">姓名</span>|<span class="stf_pho">手机号</span>|<span class="stf_pas">密码</span>|<span class="stf_born">生日</span>|<span class="stf_pre">职位</span>
            </li>
            <button class="stf_del">删除</button><button class="stf_mod">修改</button>
        
            <ul class="staff_ul">
                
              
            </ul>
        </div>
    </div>
    <div class="page">
        
    </div>
            `
        }
        
    }
}

class Css_Show{
    constructor(){
        this.button = document.getElementsByClassName('show_choose')[0];
        this.button_show = false;
        this.nav = document.getElementsByClassName('choose_nav')[0];
        //判断是点击了删除还是修改按键  默认点击删除按键
        this.isDel = true;
    }
    button_event(){
        this.button.addEventListener('click',()=>{
            console.log(1111);
            if(this.button_show){
                console.log(1);
                this.nav_event(this.button_show);
                this.button.style.transition = '.7s'
                this.button.style.transform = `translateY(-50%) rotateY(360deg)`;
                this.button_show = false;
            }
            else{
                console.log(2);
                this.nav_event(this.button_show);
                this.button.style.transition = '.7s'
                this.button.style.transform = `translateY(-50%) rotateX(180deg)`;
                this.button_show = true;
            }
           
        })
    }
    nav_event(botton_show){
        this.nav.style.transition = '.7s'
        if(botton_show){
            this.nav.style.transform = 'translateY(-12vh)';
        }
        else{
            this.nav.style.transform = 'translateY(12vh)';
        }
    }
    //删除及修改的按键
    del_mod(){

    }
  

}


//系统管理员侧边栏选择按钮
class Os_Option_Cho{
    constructor(){
        //获得侧边栏数组
        this.option = document.getElementsByClassName('os_li');
        //获得选择列表的初始className
        this.class_name = this.option[0].className;
        console.log(this.class_name);
        //默认第一个员工管理被选中
        this.option[0].className = `${this.class_name} is_Choose`
        //员工管理页面
        this.stf_col = document.querySelector('stf_col');
        this.cin_col = document.querySelector('.cin_col');
        this.seat_col = document.querySelector('.seat_col');
        

        this.os_content = document.getElementsByClassName('os_content');

        this.perforn_col = document.querySelector('.per_col');
        this.perforn_col.style.display = 'none';

        this.rec_col = document.querySelector('.rec_col');
        this.rec_col.style.display = 'none';

        this.man_col = document.querySelector('.man_col');
        this.man_col.style.display = 'none';

     
    }
    //点击切换事件
    option_change(){
      
        for(let i = 0;i < this.option.length;i++){
           
            this.option[i].addEventListener('click',()=>{
                for(let i = 0;i < this.option.length;i++){
                    this.os_content[i].style.display = 'none';
                    this.option[i].className = `${this.class_name}`
                }
                this.os_content[i].style.display = 'block';
                this.option[i].className = `${this.class_name} is_Choose`
            })
        }
        //为影厅管理按钮添加事件  
        this.option[0].addEventListener('click',()=>{
            Init(1);
        })
        //@首先请求一页数据
        this.option[1].addEventListener('click',()=>{
            let cin_req = new Cin_Req();
            cin_req.request(1);
            //为影厅管理挂载添加事件
            let cin_add = new Cin_Add();
            cin_add.cin_add_event();
            //为什么删除：因为加载顺序原因，必须放在request里，否则进cin_req，直接
            //进这里  dom还未加载
            // let cin_del = new Cin_Del();
            // cin_del.but_del_event();
        }) 
    }

}

class Bus_Option_Cho{
    constructor(){
        this.inf_show = document.querySelector('.os_col');
        this.stf_col = document.querySelector('.stf_col');
        this.cin_col = document.querySelector('.cin_col');
        //将系统管理员模块清除
        this.stf_col.style.display = 'none';
        this.cin_col.style.display = 'none';
        this.bus_content = document.getElementsByClassName('bus_content');
      
        this.perforn_col = document.querySelector('.per_col');
        this.perforn_col.style.display = 'none';

        this.rec_col = document.querySelector('.rec_col');
        this.rec_col.style.display = 'none';

        this.man_col = document.querySelector('.man_col');
        this.man_col.style.display = 'none';

        this.ticket_total_col = document.querySelector('.ticket_total_col')
        this.ticket_ser_col = document.querySelector('.ticket_ser_col');
        this.return_col = document.querySelector('.return_col')
        this.ticket_total_col.style.display = 'none';
        this.ticket_ser_col.style.display = 'none';
        this.return_col.style.display = 'none';
    }
    create_li(){
        console.log(55454545);
        this.inf_show.innerHTML = '';
        let li = document.createElement('li');
        li.setAttribute('class','iconfont os_li');
        li.innerHTML = '&#xe620; 电影管理';
        this.inf_show.appendChild(li);
        let li1 = document.createElement('li');
        li1.setAttribute('class','iconfont os_li');
        li1.innerHTML = '&#xe620; 计划管理';
        this.inf_show.appendChild(li1);
        this.option = document.getElementsByClassName('os_li');
    }
    //点击切换事件
    option_change(){
        this.class_name = this.option[0].className;
        for(let i = 0;i < this.option.length;i++){
            
            this.option[i].addEventListener('click',()=>{
                for(let i = 0;i < this.bus_content.length;i++){
                    this.bus_content[i].style.display = 'none';
                    this.option[i].className = `${this.class_name}`
                }
                this.bus_content[i].style.display = 'block';
                this.option[i].className = `${this.class_name} is_Choose`
            })
        }
        this.option[0].addEventListener('click',()=>{
            Film_Init();
            
        })
        this.option[1].addEventListener('click',()=>{
            Sch_Init(1);
        })
      
    }
}

class Tic_Option_Cho{
    constructor(){
        this.inf_show = document.querySelector('.os_col');
        this.stf_col = document.querySelector('.stf_col');
        this.cin_col = document.querySelector('.cin_col');
        this.seat_col = document.querySelector('.seat_col');
        this.mov_col = document.querySelector('.mov_col');
        this.perforn_col = document.querySelector('.perforn_col');
        this.ticket_total_col = document.querySelector('.ticket_total_col')
        this.ticket_ser_col = document.querySelector('.ticket_ser_col');
        this.return_col = document.querySelector('.return_col')
       
        //将其他模块清除
        this.stf_col.style.display = 'none';
        this.cin_col.style.display = 'none';
        this.seat_col.style.display = 'none';
        this.mov_col.style.display = 'none';
        this.perforn_col.style.display = 'none';

       

        this.perforn_col = document.querySelector('.per_col');
        this.perforn_col.style.display = 'none';

        this.rec_col = document.querySelector('.rec_col');
        this.rec_col.style.display = 'none';

        this.man_col = document.querySelector('.man_col');
        this.man_col.style.display = 'none';


        this.ticket_total_col.style.display = 'block';
        this.ticket_ser_col.style.display = 'none';
        this.return_col.style.display = 'none';
        this.tic_content = document.getElementsByClassName('tic_content');
    }
    create_li(){
        this.inf_show.innerHTML = '';
        let li = document.createElement('li');
        li.setAttribute('class','iconfont os_li');
        li.innerHTML = '&#xe620; 票务';
        this.inf_show.appendChild(li);
        let li1 = document.createElement('li');
        li1.setAttribute('class','iconfont os_li');
        li1.innerHTML = '&#xe620; 购票';
        this.inf_show.appendChild(li1);
        this.option = document.getElementsByClassName('os_li');
        let li2 = document.createElement('li');
        li2.setAttribute('class','iconfont os_li');
        li2.innerHTML = '&#xe620; 退票';
        this.inf_show.appendChild(li2);
        this.option = document.getElementsByClassName('os_li');
    }
     //点击切换事件
     option_change(){
        this.class_name = this.option[0].className;
        for(let i = 0;i < this.option.length;i++){
            
            this.option[i].addEventListener('click',()=>{
                for(let i = 0;i < this.tic_content.length;i++){
                    this.tic_content[i].style.display = 'none';
                    this.option[i].className = `${this.class_name}`
                }
                this.tic_content[i].style.display = 'block';
                this.option[i].className = `${this.class_name} is_Choose`
            })
        }
        //    let film_req = new Film_Req();
        //     film_req.request(1);
        Film_Init();
        this.tic_content[0].style.display = 'block';
        this.option[0].addEventListener('click',()=>{
         
    // let film_ser = new Film_Ser();
    // film_ser.add_click_event();
    // let input_css = new Input_Css();
    // input_css.add_event();
    // film_req.req_add_event();
    // let film_del = new Film_Del();
    // film_del.del_add_event();
    // let file_mod = new Film_Mod();
    // file_mod.span_to_input();
    // let file_add = new Film_Add();
    // file_add.add_event();
            
        })
        this.option[1].addEventListener('click',()=>{
            alert('1111');
            let mov_req = new Mov_Req();
            mov_req.request(1);
            // Sch_Init(1);
        })
        this.option[2].addEventListener('click',()=>{
            Return_Init();
        })
        
    }
}

class Man_Option_cho{
    constructor(){
        this.inf_show = document.querySelector('.os_col');
        this.stf_col = document.querySelector('.stf_col');
        this.cin_col = document.querySelector('.cin_col');
        this.man_col = document.querySelector('.man_col');
        this.seat_col = document.querySelector('.seat_col');
        this.mov_col = document.querySelector('.mov_col');
        this.perforn_col = document.querySelector('.perforn_col');
        this.ticket_total_col = document.querySelector('.ticket_total_col');
        this.ticket_ser_col = document.querySelector('.ticket_ser_col');
        this.return_col = document.querySelector('.return_col');
      
        this.per_col = document.querySelector('.per_col');
        this.per_col.style.display = 'none';
       
        //将其他模块清除
        this.stf_col.style.display = 'none';
        this.cin_col.style.display = 'none';
        this.seat_col.style.display = 'none';
        this.mov_col.style.display = 'none';
        this.perforn_col.style.display = 'none';
        this.man_col.style.display = 'block';
       
        this.ticket_total_col.style.display = 'none';
        this.ticket_ser_col.style.display = 'none';
        this.return_col.style.display = 'none';
        
        this.rec_col = document.querySelector('.rec_col');
        this.rec_col.style.display = 'none';

        this.bus_content = document.getElementsByClassName('man_content')
        console.log("aaaaaaa")
        console.log(this.bus_content)
    }
    create_li(){
        this.inf_show.innerHTML = '';
        let li = document.createElement('li');
        li.setAttribute('class','iconfont os_li');
        li.innerHTML = '&#xe620; 票房统计';
        this.inf_show.appendChild(li);
        let li1 = document.createElement('li');
        li1.setAttribute('class','iconfont os_li');
        li1.innerHTML = '&#xe620; 业绩统计';
        this.inf_show.appendChild(li1);
        this.option = document.getElementsByClassName('os_li');
        let li2 = document.createElement('li');
        li2.setAttribute('class','iconfont os_li');
        li2.innerHTML = '&#xe620; 订单查询';
        this.inf_show.appendChild(li2);
        this.option = document.getElementsByClassName('os_li');

    }
     //点击切换事件
     option_change(){
        this.class_name = this.option[0].className;
        for(let i = 0;i < this.option.length;i++){
            
            this.option[i].addEventListener('click',()=>{
                for(let i = 0;i < this.bus_content.length;i++){
                    this.bus_content[i].style.display = 'none';
                    this.option[i].className = `${this.class_name}`
                }
                this.bus_content[i].style.display = 'block';
                this.option[i].className = `${this.class_name} is_Choose`
            })
        }
        this.option[0].addEventListener('click',()=>{
            Man_Init();
            
        })
        this.option[1].addEventListener('click',()=>{
            Per_Init();
        })
        this.option[2].addEventListener('click',()=>{
            Rec_Init();
        })
      
    }
}

//职位对应的页面控制
class Page_Cho{
    constructor(){
        this.pre = ['系统管理员','运营经理','售票员','会计','财务经理'];
        this.storage = window.localStorage;
        this.index_num = parseInt(this.storage['emp_privilege']);
    }
    //根据获得的职位号码生成对应的页面
    document_init(){
        
        //首先获得localstorage的元素
        const get_local = new Get_Local();
        //进行设置
        get_local.set_Inner();
        //如果职位是系统管理员
        if(this.index_num == 0){
            //为侧边栏绑定选择事件
            let os_option_cho = new Os_Option_Cho();
            os_option_cho.option_change();
            //完成搜索的设置
            let stf_seach = new Stf_Search();
            //完成分页的设置 包括
            //@查询每页的员工信息
            //@对每个员工绑定删除事件
            //@对每个员工绑定修改事件
            //@完成员工信息的展示
            let stf_req = new Stf_Req();
            stf_req.request(1);
            //为按钮添加事件，以可以添加员工
            let stf_add = new Stf_Add();
            stf_add.stf_add_event();
        }
        else if(this.index_num == 1){
          
            //显示对应的界面
            let bus_option_cho = new Bus_Option_Cho();
            bus_option_cho.create_li();
            bus_option_cho.option_change();
            Film_Init();
        }
        else if(this.index_num == 2){
            //显示相应界面
            let tic_option_cho = new Tic_Option_Cho();
            tic_option_cho.create_li();
            tic_option_cho.option_change();
            //默认请求第一页
            let film_req = new Film_Req();
            film_req.request(1);
    // let film_ser = new Film_Ser();
    // film_ser.add_click_event();
    // let input_css = new Input_Css();
    // input_css.add_event();
    // film_req.req_add_event();
    // let film_del = new Film_Del();
    // film_del.del_add_event();
    // let file_mod = new Film_Mod();
    // file_mod.span_to_input();
    // let file_add = new Film_Add();
    // file_add.add_event();
            Tic_Init();
        }
        else if(this.index_num == 3){
         
            let man_option_cho = new Man_Option_cho();
    
            man_option_cho.create_li();
          
            man_option_cho.option_change();
   
            Man_Init();
        }
    }
    
}


window.onload = ()=>{
    const html_init = new Html_Init()
    html_init.init();
    //如果是移动端
    if(html_init.isPho){
        const css_show = new Css_Show();
        css_show.button_event();
        const getlocal = new GetLocal();
        getlocal.setInner();
        const del = new Delete();
        const query = new Query();
        query.callback = (data)=>{
            //默认展示第一页的数据
            query.showTotalData(data)
            //状态为删除
            query.isDel = true;
            //将获得的数据绑定到类上
            query.data = data;
            //添加选择删除修改的事件
            query.addEvent();
            //添加删除按钮点击事件
            query.addDel();
            //为删除按钮添加事件
            query.addDelEvent = (pho)=>{
                del.del_pho = pho;
                del.del();
            }
        }
        query.request(1);
    }
    //如果是网页端
   else{
       //获得职位并生成对应页面
        const page_cho = new Page_Cho();
        page_cho.document_init();
        console.log(page_cho.index_num);
        
     
    
   }

}
