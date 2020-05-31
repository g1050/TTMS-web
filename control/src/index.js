
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
       console.log(222);
       //首先获得localstorage的元素
       const get_local = new Get_Local();
       //进行设置
       get_local.set_Inner();
       //完成搜索的设置
       let stf_seach = new Stf_Search();
       //完成分页的设置 包括
       //@查询每页的员工信息
       //@对每个员工绑定删除事件
       //@对每个员工绑定修改事件
       //@完成员工信息的展示
       let stf_req = new Stf_Req();
       stf_req.request(1);
    //    let stf_add = new Stf_Add();
    //    stf_add.stf_add_event();
   }

}
