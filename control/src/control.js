class Query{
    constructor(){
        this.input = document.querySelector('.submit');
        this.url = "http://gaoxingkun.top:8888/user/retrieve/";
        this.request(1)
        this.input.addEventListener('click',()=>{
            this.request(1)  
        })
    }
    request(num){
        let url = this.url + num
        console.log(num);
        
        ajax(url,'GET','','json', this.callback); 
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

window.onload = ()=>{
    const query = new Query();
    const add = new Add();
    const mod = new Modify();
    const del = new Delete();
    query.request(2);
    query.request(3);
}