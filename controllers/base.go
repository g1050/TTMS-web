package controllers

import (
	"astaxie/beego/logs"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/config"
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

//返回当前用户具有的权限
//0 表示未登录 其他俺表示具有的权限
func (c *BaseController)GetAuthority()int64{


	c.Prepare()
	//获取session
	if !c.IsLogin {
		logs.Error("账号未登录")
		return 0
	}

	iniconf, err := config.NewConfig("ini", "conf/app.conf")
	if err != nil {
		logs.Error("读取配置文件出错",err)
	}

	var ret int64
	switch c.Employee.EmpPrivilege {
	case models.ADMINISTRATOR:
		ret,_ = iniconf.Int64("ADMINISTRATOR")
		logs.Debug("配置文件中是:",ret)


	}
	return ret
}

func JudgeAuthority(op int)  {
	
}
