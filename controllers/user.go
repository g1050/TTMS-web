package controllers

import (
	"astaxie/beego/logs"
	"strconv"
)

type UserController struct {
	BaseController
}

func (c *UserController)GetUserData() {
	pageStr := c.Ctx.Input.Param(":page")
	page,_ := strconv.Atoi(pageStr)
	logs.Debug("获取员工信息第",page,"页")

	//如果是1从数据库中获取一共有多少数据,并且返回

	//其他情况返回相应数据

}
