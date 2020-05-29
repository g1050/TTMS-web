class Query{
    constructor(){
       // this.input = document.querySelector('.submit');
        this.url = "http://gaoxingkun.top:8888/user/retrieve/";
        this.pre = ['系统管理员','运营经理','售票员','会计','运营经理'];
        this.staff_url = document.querySelector('.staff_ul');
       
        // this.input.addEventListener('click',()=>{
        //     this.request(1)  
        // })
    }
    //发送请求
    request(num){
        let url = this.url + num
        console.log(num);
        
        ajax(url,'GET','','json', this.callback); 
    }
    //向页面添加一行数据
    showData(data){
        console.log(data);
        
        let list = document.createElement('li');
        list.innerHTML = ` <span class="stf_name">${data.emp_name}</span>|<span class="stf_pho">${data.emp_phonenumber}</span>|<span span class="stf_pas">${data.emp_password}</span>|<span class="stf_born">${data.emp_born_year}</span>|<span class="stf_pre">${this.pre[data.emp_privilege]}</span>|<span class="staff_del iconfont">&#xe600;</span>|<span class="staff_mod iconfont">&#xe601;</span>`
        console.log(23);
        console.log(data);
        this.staff_url.appendChild(list);
    }
    //向页面添加十行数据
    showTotalData(data){
        for(let i=0;i<10;i++){
            this.showData(data.data[i])
        }
    }
    callback(data){
        console.log(data);
        console.log(data.sum);
        
    }
}

class Add{
    constructor(){
        this.input = document.querySelector('.add');
        this.url = 'http://gaoxingkun.top:8888//user/create'
        this.add_name = document.querySelector('.add_name');
        this.add_pas = document.querySelector('.add_pas');
        this.add_born = document.querySelector('.add_born');
        this.add_pho = document.querySelector('.add_pho');
        this.add_pri = document.querySelector('.add_pri');
        this.input.addEventListener('click',()=>{
            ajax(this.url,'post',this.postData(),'json',this.callback)
        })
        
    }
    
    postData(){
        let data = {
            "emp_password":`${this.add_pas.value}`,
            "emp_name":`${this.add_name.value}`,
            "emp_born_year":`${this.add_born.value}`,
            "emp_phonenumber":`${this.add_pho.value}`,
            "emp_privilege":`${this.add_pri.value}`
        }
        console.log(data);
        
        return JSON.stringify(data);
    
    }
         callback(data){
             console.log(data);
             
         }
}

class Modify{
    constructor(){
        this.input = document.querySelector('.modify');
        this.url = "http://gaoxingkun.top:8888//user/updata";
        this.mod_name = document.querySelector('.mod_name');
        this.mod_pas = document.querySelector('.mod_pas');
        this.mod_born = document.querySelector('.mod_born');
        this.mod_pho = document.querySelector('.mod_pho');
        this.mod_pri = document.querySelector('.mod_pri');
        this.input.addEventListener('click',()=>{
            this.change();
        })
    }
    postData(){
        let data = {
            "emp_password":`${this.mod_pas.value}`,
            "emp_name":`${this.mod_name.value}`,
            "emp_born_year":`${this.mod_pho.value}`,
            "emp_phonenumber":`${this.mod_pho.value}`,
            "emp_privilege":`${this.mod_pri.value}`
        }
        return JSON.stringify(data)
    }
    callback(data){
        console.log(data);
        
    }
    change(){
        ajax(this.url,'post',this.postData(),'json',this.callback)
    }
}

class Delete{
    constructor(){
        this.input = document.querySelector('.delete')
        this.url = "http://gaoxingkun.top:8888/user/delete"
        this.del_pho = document.querySelector('.del_pho');
        this.input.addEventListener('click',()=>{
            this.del();
        })
    }
    getdata(){
        return `emp_phonenumber=${this.del_pho.value}`
    }
    callback(data){
        console.log(data);
        
    }
    del(){
        ajax(this.url,'GET',this.getdata(),'json', this.callback); 
    }


}
class GetLocal{
    constructor(){
        this.pre = ['系统管理员','运营经理','售票员','会计','运营经理'];
        this.storage = window.localStorage;
        this.user_name = document.getElementsByClassName('user_name')[0];
        this.user_pre = document.getElementsByClassName('user_pre')[0];
       
   
        
    }
    setInner(){
        this.user_name.innerHTML = this.storage[`emp_name`];
        let index_num = parseInt(this.storage[`emp_privilege`]);
        this.user_pre.innerHTML = this.pre[index_num];
    }
}

