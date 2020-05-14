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

//批量获取,排序,分页显示
func (c *UserController)GetUserData() {
	resp := make(map[string]interface{})
	defer c.sendJSON(resp)

	pageStr := c.Ctx.Input.Param(":page")
	page,_ := strconv.Atoi(pageStr)
	logs.Debug("获取员工信息第",page,"页")

	slice := []models.Employee{}
	//返回情况返回相应数据
	//models.T()
	err,sum,ret2 := models.GetDataByNumAndOffset("employee",&slice,10,(page-1)*10,"emp_privilege")
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

//批量插入
func (c *UserController)InsertUserData() {
	resp := make(map[string]interface{})
	defer c.sendJSON(resp)

	//data的成员是Employee数组
	data := DataEmp{}
	json.Unmarshal(c.Ctx.Input.RequestBody,&data)
	logs.Debug("从前段获取的数组是",data)

	//发给models批量插入
	err,sucessNum := models.InsertMul(models.EMPPLYEE,&(data.Employee))
	if err != nil || sucessNum == 0{
		c.PackRecode(resp,models.RECODE_DBERR)
		return
	}
	c.PackRecode(resp,models.RECODE_OK)

}
