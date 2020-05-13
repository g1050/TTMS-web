package controllers

import (
	"astaxie/beego/logs"
	"strconv"
	"ttms/models"
)

type UserController struct {
	BaseController
}

func (c *UserController)GetUserData() {
	resp := make(map[string]interface{})
	c.sendJSON(resp)

	pageStr := c.Ctx.Input.Param(":page")
	page,_ := strconv.Atoi(pageStr)
	logs.Debug("获取员工信息第",page,"页")

	slice := []models.Employee{}
	//返回情况返回相应数据
	models.GetDataByNumAndOffset("employee",&slice,10,(page-1)*10)
	logs.Debug("获得数据",slice)
}
