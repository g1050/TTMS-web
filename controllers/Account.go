package controllers

import (
	"astaxie/beego/logs"
	"encoding/json"
	"fmt"
	"github.com/astaxie/beego"
	"ttms/models"
)

type AccountController struct {
	beego.Controller
}


func (c *AccountController) sendJSON(mp map[string]interface{}){
	c.Data["json"]=mp
	c.ServeJSON()
}

//注册时候上传用户信息,插入信息到数据库，设置session。
func (c *AccountController) PostUserData() {
	//data := make(map[string]interface{})
	var data models.Employee;
	resp := make(map[string]interface{})
	defer c.sendJSON(resp)

	//获取前端数据
	if err:=json.Unmarshal(c.Ctx.Input.RequestBody,&data);err != nil{
		resp["errno"] = models.RECODE_NODATA
		resp["errmsg"] = models.RecodeText(models.RECODE_NODATA)
		return
	}

	fmt.Println("获取的data = ",data)

	//判断账号是否已经注册

	//发送个M层插入数据
	err,id := models.InsertEmployee(data)
	if err != nil {
		logs.Error(err,id)
		resp["errno"] = models.RECODE_DATAEXIST
		resp["errmsg"] = models.RecodeText(models.RECODE_DATAEXIST)
		return
	}

	//设置session
	c.SetSession("emp_id",id)
	//返回数据
	resp["errno"] = models.RECODE_OK
	resp["errmsg"] = models.RecodeText(models.RECODE_OK)

}

//判断是否已经登录,从session中判断
func (c *AccountController) GetUserSession(){
	resp := make(map[string]interface{})
	defer c.sendJSON(resp)

	//获取emp_id
	emp_id := c.GetSession("emp_id")
	if emp_id == nil{
		fmt.Println("账户未登录")
	}else {
		resp["errno"] = models.RECODE_OK
		resp["errmsg"] = "账户已经登录"
		//resp["errmsg"] = models.RecodeText(models.RECODE_OK)
		//后期可以做缓存优化
		resp["emp_name"] = "从数据库中取出数据"
	}


	//存在就取得Name,发送到客户端

	//不能存在就发送错误码

}