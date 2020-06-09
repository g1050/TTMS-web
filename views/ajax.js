
//支持GET/POST请求，支持JSON/Text数据返回
function ajax(url,type,param,dataType,callBack,reality){
    //路径，GET/POST，appkey,返回值类型JSON/Text，回调函数
    // console.log(dataType);
    
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
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    }
    xhr.send(data);
    xhr.onreadystatechange = function(){
        
        // console.log(xhr.readyState ,xhr.status);
        
        if(xhr.readyState == 4 && xhr.status == 200){
            
            
            var data = xhr.responseText;
            if(dataType == 'json'){
                data = JSON.parse(data);
                
            }
            
            callBack(data);
            
        }
    }
}