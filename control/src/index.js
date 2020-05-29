
class Html_Init{
    constructor(){
        this.html = document.getElementsByTagName('html')[0];
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }
    init(){
        this.html.style.width = this.width + 'px'
        this.html.style.height = this.height + 'px';
    }
}

class Css_Show{
    constructor(){
        this.button = document.getElementsByClassName('show_choose')[0];
        this.button_show = false;
        this.nav = document.getElementsByClassName('choose_nav')[0];
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

}

window.onload = ()=>{
    const html_init = new Html_Init()
    html_init.init();
    const css_show = new Css_Show();
    css_show.button_event();
    const getlocal = new GetLocal();
    getlocal.setInner();
    const query = new Query();
    query.callback = (data)=>{
        console.log(2323);
        query.showTotalData(data)
       
    }
    query.request(1);
}
