package controllers

import (
	"astaxie/beego/logs"
	"github.com/astaxie/beego"
	"ttms/models"
)

const EMP_KEY = "EMP_KEY"
type BaseController struct {
	beego.Controller
	Employee models.Employee
	IsLogin bool
}

func (c *BaseController) sendJSON(mp map[string]interface{}){
	c.Data["json"]=mp
	c.ServeJSON()
}

func (c *BaseController)MyPrepare()  {
	//尝试获取session

	emp,ok := c.GetSession(EMP_KEY).(models.Employee)
	c.IsLogin = false
	if ok {
		logs.Info("获得了session",emp)
		//更新
		c.Employee = emp
		c.IsLogin = true
	}else {
		logs.Info("没有session")
	}
}

func (c *BaseController)PackRecode(resp map[string]interface{},recode string)  {
	resp["errno"] = recode
	resp["errmsg"] = models.RecodeText(recode)
}

func (c *BaseController)GetAuthority(emp_privilege int64)int{
	switch emp_privilege {
	case models.ADMINISTRATOR:


	}
	return  1
}
