package controllers

import (
	"encoding/json"
	_"ttms/models"
	"astaxie/beego/logs"
	"strconv"
	"ttms/models"
)

//写进配置文件
const ROWTOSHOW = 10

type DataEmp struct {
	Employee []models.Employee`json:"employee"`
}

type UserController struct {
	BaseController
}

func (c *UserController)GetUserData() {
	resp := make(map[string]interface{})
	defer c.sendJSON(resp)

	pageStr := c.Ctx.Input.Param(":page")
	page,_ := strconv.Atoi(pageStr)
	logs.Debug("获取员工信息第",page,"页")

	slice := []models.Employee{}
	//返回情况返回相应数据
	//models.T()
	err,sum,ret2 := models.GetDataByNumAndOffset("employee",&slice,10,(page-1)*10)
	if err != nil || ret2 == 0{
		logs.Error("查询n条数据出错")
		resp["sum"] = 0
		c.PackRecode(resp,models.RECODE_DBERR) //数据库错误
		return
	}

	c.PackRecode(resp,models.RECODE_OK)
	resp["sum"] = sum
	resp["data"] = slice
	logs.Debug("从数据库存中获得数据",slice)
	logs.Debug(resp)
}

func (c *UserController)InsertUserData() {
	resp := make(map[string]interface{})
	defer c.sendJSON(resp)

	data := DataEmp{}
	json.Unmarshal(c.Ctx.Input.RequestBody,&data)
	logs.Debug(data)
	/*
	logs.Debug("添加员工")
	//data := make(map[string]interface{})
	data := []models.Employee{}
	emp1 := models.Employee{EmpId: 1}
	emp2 := models.Employee{EmpId: 2}
	data = append(data, emp1)
	data = append(data, emp2)

	str,_ := json.Marshal(data)
	logs.Debug(string(str))
	/*
	body := c.Ctx.Input.RequestBody
	logs.Debug("%s",body)
	err := json.Unmarshal(body,&data)
	if err != nil {
		logs.Debug("获取数据错误:",err)
	}
	arr := []models.Employee{}
	json.Unmarshal(str,&arr)
	logs.Debug("获取的数据",arr)
	*/
}
