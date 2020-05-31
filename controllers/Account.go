package controllers

import (
	"astaxie/beego/logs"
	"encoding/json"
	"ttms/models"
)

type AccountController struct {
	BaseController
}

//验证手机号和密码
func (c *AccountController) VerifyUser() {
	var data models.Employee;
	c.resp = make(map[string]interface{})
	defer c.sendJSON(c.resp)

	//获取前端数据
	if err:=json.Unmarshal(c.Ctx.Input.RequestBody,&data);err != nil{
		c.resp["errno"] = models.RECODE_NODATA
		c.resp["errmsg"] = models.RecodeText(models.RECODE_NODATA)
		return
	}

	logs.Debug("GetData = ",data)
	employee := models.Employee{EmpPhonenumber: data.EmpPhonenumber}
	//从数据库中取出验证,条件查询
	if err := models.SelectEmployeeByPhone(&employee);err != nil {
		logs.Error(err)
		c.PackRecode(c.resp,models.RECODE_DBERR) //数据库错误
		return
	}
	logs.Debug("验证密码时候从数据库中取出的数据为 ",data)

	//判断密码
	if data.EmpPassword == employee.EmpPassword {
		logs.Debug("密码验证成功")

		c.resp["emp_privilege"] = employee.EmpPrivilege //添加职位信息
		c.resp["emp_name"] = employee.EmpName //返回名字
		c.PackRecode(c.resp,models.RECODE_OK) //验证密码成功
		//设置session
		c.SetSession(EMP_KEY,employee)
		c.Ctx.SetCookie("debug","debug when verifying")
	} else {
		c.PackRecode(c.resp,models.RECODE_PWDERR) //密码错误
	}

}

//注册时候上传用户信息,插入信息到数据库，设置session。
func (c *AccountController) PostUserData() {
	//data := make(map[string]interface{})
	var data models.Employee;
	c.resp = make(map[string]interface{})
	defer c.sendJSON(c.resp)

	//获取前端数据
	if err:=json.Unmarshal(c.Ctx.Input.RequestBody,&data);err != nil{
		c.PackRecode(c.resp,models.RECODE_NODATA) //前段没有发送数据
		return
	}

	logs.Debug("获取前段的数据",data)

	//判断账号是否已经注册

	//发送个M层插入数据
	err,id := models.InsertEmployee(&data)
	if err != nil {
		logs.Error(err,id)
		c.PackRecode(c.resp,models.RECODE_DATAEXIST)
		return
	}
	logs.Debug("注册时插入数据库中的数据是",data)

	//设置session
	c.SetSession(EMP_KEY,data)
	c.Ctx.SetCookie("debug","Just to debug cookie when registing,useless")
	//返回数据
	c.PackRecode(c.resp,models.RECODE_OK)

}

//判断是否已经登录,从session中判断
func (c *AccountController) GetUserSession(){
	resp := make(map[string]interface{})
	defer c.sendJSON(resp)

	c.MyPrepare()
	//已经登录
	if c.IsLogin {
		resp["emp_name"] = c.Employee.EmpName
		resp["emp_privilege"] = c.Employee.EmpPrivilege //添加职位信息
		c.PackRecode(resp,models.RECODE_OK) //已经登录
	}else {
		c.PackRecode(resp,models.RECODE_SESSIONERR) //未登录
	}

}